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
  assert.deepEqual(parseAxioms("'OSO.attempt' depends on axioms: [propext, OSO.u_add]"), ['propext', 'OSO.u_add']);
  assert.deepEqual(parseAxioms("'OSO.attempt' does not depend on any axioms"), []);
  assert.equal(parseAxioms('nothing'), null);
  const out = 'x/check.lean:12:4: error: unknown identifier \'foo\'\nmore detail\nx/check.lean:20:0: error: other\n';
  assert.deepEqual(parseErrors(out, 11, 3), ["line 2 of your proof, column 4: unknown identifier 'foo'\nmore detail", 'in the statement: other']);
});

test('the checked file states the library as axioms and the attempt in its namespace', () => {
  const { text, firstProofLine } = checkFile({ ns: 'OSO', signature: ': ∀ n, 0 < u (n + 1)' }, ':= by\n  simp', [
    { name: 'OSO.u_pos', ns: 'OSO', short: 'u_pos', signature: ': ∀ n, 0 < n → 0 < u n' },
  ]);
  assert.match(text, /^import Problems\.Defs\n/);
  assert.match(text, /axiom u_pos : ∀ n, 0 < n → 0 < u n/);
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
  const lib = [{ name: 'OSO.u_le_succ', ns: 'OSO', short: 'u_le_succ', signature: ': ∀ n, u n ≤ u (n + 1)' }];
  const task = { ns: 'OSO', signature: '(n : Nat) : u n ≤ u (n + 2)' };
  const good = await check(task, ':= Nat.le_trans (u_le_succ n) (u_le_succ (n + 1))', { library: lib });
  assert.ok(good.ok, good.errors.join('\n'));
  assert.deepEqual(good.uses, ['OSO.u_le_succ']);
  const bad = await check(task, ':= u_le_succ n', { library: lib });
  assert.ok(!bad.ok && bad.errors.length);
  const hidden = await check(task, ':= Nat.le_trans (u_mono (Nat.le_succ n)) (u_le_succ _)', { library: lib });
  assert.ok(!hidden.ok, 'a lemma outside the library is unknown');
});

test('with Lean: an attempt repairs a rejected proof using the error messages', { skip: !leanAvailable() }, async () => {
  const { attempt } = await import('../src/lean/agent.ts');
  const { loadTasks } = await import('../src/lean/tasks.ts');
  const task = loadTasks().find((t) => t.publicId === 'A-02')!;
  const replies = ['```lean\n:= by omega\n```', '```lean\n  | 0 => by decide\n  | n + 1 => by rw [OSO.u_succ_succ]; omega\n```'];
  const seen: string[] = [];
  const lib = [{ name: 'OSO.u_succ_succ', ns: 'OSO', short: 'u_succ_succ', signature: '(n : Nat) : u (n + 2) = 5 * u (n + 1) + 3 * u n' }];
  const r = await attempt(task, lib, async (_s, messages) => {
    seen.push(String(messages[messages.length - 1].content));
    const text = replies.shift()!;
    return { text, content: text, usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0 }, stop: 'end_turn' };
  });
  assert.ok(r.ok);
  assert.equal(r.turns.length, 2);
  assert.match(seen[1], /Lean rejected the proof/);
});
