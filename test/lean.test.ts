// The Lean pilot's harness. Parsing and the banned-text screen run everywhere; the checks that need
// Lean and the private reference proofs run only where they exist (not in CI).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { banned, checkFile, parseAxioms, parseErrors } from '../src/lean/checker.ts';
import { extractProof } from '../src/lean/agent.ts';
import { leanAvailable } from '../src/lean/tasks.ts';

test('the screen rejects unsound, unsafe and banned proofs', () => {
  assert.deepEqual(banned(':= by simp [u]'), []);
  assert.ok(banned(':= by sorry').length);
  assert.ok(banned(':= by native_decide').length);
  assert.ok(banned(':= by grind').length);
  assert.deepEqual(banned(':= by grind', true), []);
  assert.ok(banned(':= by simp\n#eval IO.println "x"').length);
  assert.ok(banned(':= by simp\n\ntheorem other : True := trivial').length);
  assert.ok(banned(':= by exact?').length);
  assert.ok(banned('by simp').length, 'must start with := or |');
  assert.deepEqual(banned('  | 0 => rfl\n  | n + 1 => by simp'), []);
});

test("axioms and errors are read from Lean's output", () => {
  assert.deepEqual(parseAxioms("'OSO.attempt' depends on axioms: [propext, OSO.lemA]"), ['propext', 'OSO.lemA']);
  assert.deepEqual(parseAxioms("'OSO.attempt' does not depend on any axioms"), []);
  assert.equal(parseAxioms('nothing'), null);
  const out = 'x/check.lean:12:4: error: unknown identifier \'foo\'\nmore detail\nx/check.lean:20:0: error: other\n';
  assert.deepEqual(parseErrors(out, 11, 3), ["line 2 of your proof, column 4: unknown identifier 'foo'\nmore detail", 'in the statement: other']);
  const coded = "x/check.lean:52:20: error(lean.unknownIdentifier): Unknown identifier `congrArg₂`\n'OSO.attempt' depends on axioms: [propext, sorryAx]\n";
  assert.deepEqual(parseErrors(coded, 50, 10), ['line 3 of your proof, column 20: Unknown identifier `congrArg₂`']);
});

test('the checked file states the library as axioms and the attempt in its namespace', () => {
  const { text, firstProofLine } = checkFile({ ns: 'OSO', signature: ': ∀ n, 0 < u (n + 1)' }, ':= by\n  simp', [
    { name: 'OSO.lemB', ns: 'OSO', short: 'lemB', signature: ': ∀ n : Nat, 0 < n + 1' },
  ]);
  assert.match(text, /^import Problems\.Defs\n/);
  assert.match(text, /axiom lemB : ∀ n : Nat, 0 < n \+ 1/);
  assert.equal(text.split('\n')[firstProofLine - 1], ':= by');
  assert.match(text, /#print axioms OSO\.attempt/);
});

test('proofs are taken from the last lean block, without a repeated statement', () => {
  assert.equal(extractProof('Here:\n```lean\n:= by simp\n```'), ':= by simp');
  assert.equal(extractProof('```lean\ntheorem attempt (n : Nat) : n = n := by rfl\n```'), ':= by rfl');
  assert.equal(extractProof('no code'), null);
});

test('with Lean: the checker accepts a proof, rejects a wrong one, and reports what it used', { skip: !leanAvailable() }, async () => {
  const { check } = await import('../src/lean/checker.ts');
  // Examples only: these are not lemmas of the problem set.
  const lib = [{ name: 'OSO.lemC', ns: 'OSO', short: 'lemC', signature: ': ∀ n : Nat, n ≤ n + 1' }];
  const task = { ns: 'OSO', signature: '(n : Nat) : n ≤ n + 2' };
  const good = await check(task, ':= Nat.le_trans (lemC n) (lemC (n + 1))', { library: lib });
  assert.ok(good.ok, good.errors.join('\n'));
  assert.deepEqual(good.uses, ['OSO.lemC']);
  const bad = await check(task, ':= lemC n', { library: lib });
  assert.ok(!bad.ok && bad.errors.length);
  const hidden = await check(task, ':= Nat.le_trans (lemD (Nat.le_succ n)) (lemC _)', { library: lib });
  assert.ok(!hidden.ok, 'a lemma outside the library is unknown');
});

test('with Lean: an attempt repairs a rejected proof using the error messages', { skip: !leanAvailable() }, async () => {
  const { attempt } = await import('../src/lean/agent.ts');
  // A made-up task (not from the problem set): the first reply is wrong, the second fixes it.
  const task = { ns: 'OSO', signature: '(n : Nat) : n + 0 = n' } as unknown as Parameters<typeof attempt>[0];
  const replies = ['```lean\n:= by exact rfl rfl\n```', '```lean\n:= by simp\n```'];
  const seen: string[] = [];
  const r = await attempt(task, [], async (_s, messages) => {
    seen.push(String(messages[messages.length - 1].content));
    const text = replies.shift()!;
    return { text, content: text, usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0 }, stop: 'end_turn' };
  });
  assert.ok(r.ok);
  assert.equal(r.turns.length, 2);
  assert.match(seen[1], /Lean rejected the proof/);
});

test('a lemma declaration splits into name, statement and proof', async () => {
  const { parseLemma } = await import('../src/lean/community.ts');
  assert.deepEqual(parseLemma('theorem foo (n : Nat) : n + 0 = n := by simp'), { name: 'foo', signature: '(n : Nat) : n + 0 = n', proof: ':= by simp' });
  assert.equal(parseLemma('theorem foo : ∀ n, P n\n  | 0 => h0\n  | n + 1 => hs')?.proof, '  | 0 => h0\n  | n + 1 => hs');
  assert.equal(parseLemma('def foo := 1'), null);
});

test('with Lean: communities run, and under OSO results are shared while traditional labs duplicate', { skip: !leanAvailable() }, async () => {
  const { runCommunity, referenceAgent } = await import('../src/lean/community.ts');
  const base = { agents: ['a', 'b', 'c'], budget: 0.12, rounds: 12, repairs: 0, alpha: 0.8, c: 0.15, mint: 1, effort: 'low' as const, allowGrind: true };
  const { mkdtempSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const root = mkdtempSync(`${tmpdir()}/oso-community-`);
  const run = (rules: 'traditional' | 'oso') => runCommunity({ ...base, rules }, (com, i) => referenceAgent(com, i), () => 0.01, `test-community-${rules}`, () => {}, root);
  const [trad, oso] = [await run('traditional'), await run('oso')];
  assert.ok(oso.library.filter((e) => !e.public).length < trad.library.filter((e) => !e.public).length, 'OSO publishes; traditional keeps lemmas private');
  const solved = (r: typeof oso) => new Set(r.actions.filter((a) => a.kind === 'target' && a.ok).map((a) => a.target)).size;
  assert.ok(solved(oso) >= solved(trad));
  assert.ok(oso.earnings.some((e) => e > 0));
});

test('with Lean: race designs suggest counted targets from the pilot and post their lemmas as conjectures', { skip: !leanAvailable() }, async () => {
  const design = await import('../src/viewer/design.ts');
  const direct = design.conjecturesFor(['A3'], 'direct');
  const all = design.conjecturesFor(['A5'], 'all');
  assert.ok(direct.length >= 1 && direct.every((id) => /^[ABCX]-\d\d$/.test(id)), 'lemmas only, by public id');
  assert.ok(all.length > design.conjecturesFor(['A5'], 'direct').length, 'every lemma a target rests on includes its direct ones and more');
  assert.deepEqual(design.conjecturesFor(['A3'], 'none'), []);
  const s = design.suggestCounted('no-such/model');
  assert.equal(s.run, null);
});
