// The Lean pilot's harness. Parsing and the banned-text screen run everywhere; the checks that need
// Lean and the private reference proofs run only where they exist (not in CI).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { banned, checkFile, parseAxioms, parseErrors } from '../src/lean/checker.ts';
import { extractProof } from '../src/lean/agent.ts';
import { leanReady } from '../src/lean/tasks.ts';
import { Community, LEAN_REWARDS, parseReply, progress, proofBody, spendTo, type CommunityOptions, type CommunityResult } from '../src/lean/community.ts';
import { medianDiff, medianRange, reachK } from '../src/lean/societies.ts';
import { MODEL_VERSION } from '../src/engine/version.ts';

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

test('money to a count of targets includes the whole round that reached it', () => {
  const act = (round: number, t: number, cost: number, target?: string) => ({ round, t, cost, kind: target ? 'target' : 'lemma', ok: true, target });
  const run = { opts: { counted: ['A', 'B'] }, actions: [act(1, 1, 0.1, 'A'), act(1, 2, 0.3), act(2, 3, 0.2, 'B'), act(2, 4, 0.4)] } as unknown as CommunityResult;
  assert.equal(Number(spendTo(run, 1)!.toFixed(3)), 0.4);
  assert.equal(Number(spendTo(run, 2)!.toFixed(3)), 1);
  assert.equal(spendTo(run, 3), null);
  assert.deepEqual(progress(run).map(([, y]) => y), [0, 1, 1, 2, 2]);
});

test('the count of targets is the highest more than half the runs of every setup reach, and not reached stays not reached', () => {
  const reach = (k: number) => ({ opts: { counted: ['A', 'B', 'C'] }, actions: ['A', 'B', 'C'].slice(0, k).map((target, n) => ({ round: n + 1, t: n, cost: 0.1, kind: 'target', ok: true, target })) }) as unknown as CommunityResult;
  assert.equal(reachK([[reach(3), reach(3), reach(1)], [reach(2), reach(3), reach(3)]], 3), 3);
  assert.equal(reachK([[reach(3), reach(1), reach(1)], [reach(2), reach(3), reach(3)]], 3), 1);
  assert.equal(medianRange([1, 2, Infinity])[0], 2);
  assert.equal(medianRange([1, Infinity, Infinity])[0], Infinity);
  assert.match(medianDiff([1, 1, 1, 1, 1, 1], [2, 2, 2, 2, 2, 2]), /^−\$1\.000 \(95% range −\$1\.000 to −\$1\.000\)$/);
});

test('replies are read however the lab formats them, and the screen still applies', () => {
  const fence = '```';
  const proof = (t: string) => { const { code } = parseReply(t); return code && proofBody(code); };
  assert.equal(proof(`ACTION: target C3\n${fence}lean\n:= by simp\n${fence}`), ':= by simp');
  assert.equal(proof('ACTION: target C3\n:= by\n  simp'), ':= by\n  simp', 'no fence');
  assert.equal(proof(`${fence}lean\nACTION: target C3\n:= by simp\n${fence}`), ':= by simp', 'action inside the fence');
  assert.equal(proof(`ACTION: target C3\n${fence}lean\n:= by simp`), ':= by simp', 'fence never closed');
  assert.equal(proof(`ACTION: target C3\n${fence}lean\nnamespace OSO\nnamespace M2\n\ntheorem attempt (x : M2) : x = x := by\n  rfl\n\nend M2\nend OSO\n${fence}`), ':= by\n  rfl', 'namespaces');
  assert.equal(proof(`ACTION: target C3\n${fence}lean\nby simp\n${fence}`), ':= by simp', 'bare by');
  assert.equal(proof(`ACTION: target C3\n${fence}lean\ntheorem foo (a : Nat) : a = a := by rfl\n${fence}`), ':= by rfl', 'another name');
  assert.equal(parseReply('ACTION: lemma\ntheorem foo : 1 = 1 := rfl').code, 'theorem foo : 1 = 1 := rfl', 'lemma without a fence');
  assert.equal(parseReply('I will think about it.').action, null);
  assert.equal(parseReply('I will think about it.').code, null);
  // Only matching outer namespace lines go; anything else reaches the screen as written.
  assert.ok(banned(proof(`ACTION: target C3\n${fence}lean\nnamespace OSO\n:= by simp\nend Other\n${fence}`)!).length);
  assert.ok(banned(proof(`ACTION: target C3\n${fence}lean\n:= by simp\n\ntheorem other : True := trivial\n${fence}`)!).length);
  assert.ok(banned(proof('ACTION: target C3\n:= by sorry')!).length);
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

test('with Lean: the checker accepts a proof, rejects a wrong one, and reports what it used', { skip: !leanReady() }, async () => {
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

test('with Lean: an attempt repairs a rejected proof using the error messages', { skip: !leanReady() }, async () => {
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

test('with Lean: communities run, and under OSO results are shared while traditional labs duplicate', { skip: !leanReady() }, async () => {
  const { runCommunity, referenceAgent } = await import('../src/lean/community.ts');
  const base = { agents: ['a', 'b', 'c'], budget: 0.12, rounds: 12, repairs: 0, alpha: 0.8, mint: 1, effort: 'low' as const, allowGrind: true };
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

test('a community stops, marked, when the key runs out of credit', async () => {
  const { runCommunity } = await import('../src/lean/community.ts');
  const { mkdtempSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const root = mkdtempSync(`${tmpdir()}/oso-credit-`);
  let calls = 0;
  const broke = async () => { calls++; throw new Error('OpenRouter 402: This request would exceed your available credits'); };
  const r = await runCommunity({ rules: 'oso', agents: ['a', 'b'], budget: 1, rounds: 10, repairs: 0, alpha: 0.8, mint: 1, effort: 'low' }, () => broke, () => 0, 'test-credit', () => {}, root);
  assert.equal(r.stopped, 'out of credit');
  assert.equal(calls, 2, 'no round after the first refusal');
});

test('with Lean: race designs suggest counted targets from the pilot and post their lemmas as conjectures', { skip: !leanReady() }, async () => {
  const design = await import('../src/viewer/design.ts');
  const direct = design.conjecturesFor(['A3'], 'direct');
  const all = design.conjecturesFor(['A5'], 'all');
  assert.ok(direct.length >= 1 && direct.every((id) => /^[ABCX]-\d\d$/.test(id)), 'lemmas only, by public id');
  assert.ok(all.length > design.conjecturesFor(['A5'], 'direct').length, 'every lemma a target rests on includes its direct ones and more');
  assert.deepEqual(design.conjecturesFor(['A3'], 'none'), []);
  const s = design.suggestCounted('no-such/model');
  assert.equal(s.run, null);
});

test('earlier runs: flow-back split by what each used result cost to prove, equally when a cost is unknown', async () => {
  const { Community } = await import('../src/lean/community.ts');
  const w = (costs: (number | undefined)[]) => Community.prototype.weights.call({ opts: {} }, costs.map((cost) => ({ cost })) as never);
  assert.deepEqual(w([1, 3]), [0.25, 0.75]);
  assert.deepEqual(w([1, undefined]), [0.5, 0.5]);
  assert.deepEqual(w([]), []);
});

test('the Lean runs\' rewards were checked against the current simulation model', () => {
  assert.equal(LEAN_REWARDS.checkedAgainst, MODEL_VERSION,
    `the simulation is now model v${MODEL_VERSION}: compare the Lean rewards (LEAN_REWARDS in src/lean/community.ts) with it, update the gaps, and set checkedAgainst`);
  // Each reward setting says how it differs, so summaries can.
  for (const knowledge of ['off', 'flat-mint'] as const) assert.ok(LEAN_REWARDS.gaps({ knowledge }).every((g) => g.length > 20));
});

test('with the knowledge reward off, a new result earns nothing and the prompt says so', async () => {
  const { Community, mintOf } = await import('../src/lean/community.ts');
  const base = { rules: 'oso' as const, agents: ['a', 'b'], budget: 1, rounds: 1, repairs: 0, alpha: 0.8, mint: 1, effort: 'low' as const };
  assert.equal(mintOf({ ...base, knowledge: 'off' }), 0);
  assert.equal(mintOf(base), 1); // runs from before the setting existed: the old flat mint
  for (const rules of ['oso', 'shared', 'traditional', 'independent', 'planner'] as const) {
    const off = new Community({ ...base, rules, knowledge: 'off' }).systemPrompt(1), old = new Community({ ...base, rules }).systemPrompt(1);
    assert.doesNotMatch(off, /mint/, rules);
    assert.match(old, /mint of 1/, rules);
  }
});

test('the plain planner gets no strategy advice and no failure reports', () => {
  const base = { agents: ['a', 'b', 'c', 'd'], budget: 1, rounds: 5, repairs: 2, rules: 'planner', alpha: 1, mint: 1, knowledge: 'off', split: 'lines-saved', effort: 'medium', mayStop: false, counted: [] } as unknown as CommunityOptions;
  const failed = { round: 1, agent: 1, kind: 'lemma', ok: false, reason: 'not accepted', name: 'x', turns: 1, usage: {}, transcript: [], t: 1 } as never;
  for (const [plain, has] of [[false, true], [true, false]] as const) {
    const com = new Community({ ...base, plainPlanner: plain });
    com.actions.push(failed);
    assert.equal(com.plannerSystem().includes('A good plan'), has);
    assert.equal(com.plannerPrompt(2).includes('Last round'), has);
  }
});

test('every setup states its rules in the same three lines; only the rule lines differ', async () => {
  const { Community } = await import('../src/lean/community.ts');
  const base = { agents: ['a', 'b', 'c', 'd'], budget: 1, rounds: 1, repairs: 0, mint: 1, effort: 'low' as const, knowledge: 'off' as const };
  const lines = (rules: 'shared' | 'oso' | 'traditional', alpha: number) => new Community({ ...base, rules, alpha }).systemPrompt(1).split('\n');
  const shared = lines('shared', 1), oso = lines('oso', 0.2), trad = lines('traditional', 1);
  const diff = (a: string[], b: string[]) => a.filter((l, n) => l !== b[n]);
  assert.equal(shared.length, oso.length);
  assert.equal(shared.length, trad.length);
  // Shared library and OSO differ only in the name and how bounties are paid; shared and traditional only in the name and who sees what.
  assert.deepEqual(diff(shared, oso).map((l) => l.split(':')[0]), ['How this community works (shared library)', '- Bounties']);
  assert.deepEqual(diff(shared, trad).map((l) => l.split(':')[0]), ['How this community works (shared library)', '- Seeing results']);
  assert.match(oso.join('\n'), /keeps 20%/);
});

test('a turn that throws is kept in the log as an error, and not counted as a failed proof', async () => {
  const { runCommunity, stats } = await import('../src/lean/community.ts');
  const { mkdtempSync, readFileSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const root = mkdtempSync(join(tmpdir(), 'oso-err-'));
  const opts = { rules: 'shared' as const, agents: ['a'], budget: 1, rounds: 1, repairs: 0, alpha: 1, mint: 0, effort: 'low' as const, knowledge: 'off' as const };
  const boom = (() => { throw new Error('upstream 500 after retries'); }) as never;
  const r = await runCommunity(opts, () => boom, () => 0, 'err-test', () => {}, root);
  const logged = readFileSync(join(root, 'err-test', 'actions.jsonl'), 'utf8').trim().split('\n').map((l) => JSON.parse(l));
  assert.equal(logged[0].kind, 'error');
  assert.match(logged[0].reason, /upstream 500/);
  assert.equal(stats(r).errors, 1);
  assert.equal(stats(r).failed, 0);
});

test("a lab's thinking is saved in its own file, not in the action log", async () => {
  const { runCommunity } = await import('../src/lean/community.ts');
  const { mkdtempSync, readFileSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const root = mkdtempSync(join(tmpdir(), 'oso-think-'));
  const chat = async () => ({ text: 'ACTION: pass', content: 'x', usage: { input: 1, output: 1, cacheRead: 0, cacheWrite: 0, cost: 0.001 }, stop: 'stop', reasoning: 'passing looks best' });
  const opts = { rules: 'shared' as const, agents: ['a'], budget: 1, rounds: 1, repairs: 0, alpha: 1, mint: 0, effort: 'low' as const, knowledge: 'off' as const, mayStop: false };
  await runCommunity(opts, () => chat as never, () => 0.001, 'think', () => {}, root);
  const saved = JSON.parse(readFileSync(join(root, 'think', 'reasoning.jsonl'), 'utf8'));
  assert.deepEqual([saved.action, saved.reasoning], [0, ['passing looks best']]);
  assert.doesNotMatch(readFileSync(join(root, 'think', 'actions.jsonl'), 'utf8'), /passing looks best/);
});

test('labs choosing what to publish: PUBLISH no keeps a lemma private until its target, and only a new result earns the proof-size reward', async () => {
  const { Community, proofSize, sizeReward, publishChoice } = await import('../src/lean/community.ts');
  assert.equal(proofSize('by\n  -- a comment\n  simp [foo]  /- block -/'), 5); // by simp [ foo ]
  assert.equal(sizeReward(82), 1.6);
  assert.equal(sizeReward(5000), 4);
  assert.equal(publishChoice(['Answer PUBLISH: yes or PUBLISH: no.', 'theorem x ...\nPUBLISH: no']), 'no');
  assert.equal(publishChoice(['PUBLISH: yes or PUBLISH: no']), undefined);
  const c = new Community({ rules: 'oso', alpha: 0.8, publishing: 'choose', knowledge: 'proof-size', agents: ['a', 'b'], budget: 1, rounds: 1, repairs: 0, mint: 1, effort: 'low' });
  const kept = { name: 'k1', ns: 'OSO', signature: '(n : Nat) : n + 0 = n', author: 0, public: false, round: 1, uses: [], size: 80, choice: 'no' as const };
  c.library.push(kept);
  assert.equal(c.visible(1).length, 0); // the other lab cannot see a kept lemma
  // Another lab publishes the same statement first: the kept one earns nothing when it is published later.
  const other = { ...kept, name: 'k2', author: 1, choice: 'yes' as const };
  c.library.push(other); c.publish(other, 1);
  assert.equal(c.earnings[1], 1.6); // 80 symbols → log2(3) = 1.6, kept whole (it used nothing)
  c.publish(kept, 2);
  assert.equal(c.earnings[0], 0);
  const p = c.systemPrompt(0);
  assert.match(p, /only PUBLISH: yes, or only PUBLISH: no/);
  assert.match(p, /keeps 80%/);
  assert.match(p, /up to 4, more for a longer proof/);
  // Another lab's target never publishes a lab's kept lemma; flow-back goes to the first publisher of a statement.
  const d = new Community({ rules: 'oso', alpha: 0.5, publishing: 'choose', knowledge: 'off', agents: ['a', 'b'], budget: 1, rounds: 1, repairs: 0, mint: 1, effort: 'low' });
  const k = { name: 'k', ns: 'OSO', signature: 'S', author: 0, public: false, round: 1, uses: [] };
  const pubA = { name: 'p', ns: 'OSO', signature: 'P', author: 0, public: false, round: 1, uses: ['OSO.k'] };
  const firstS = { name: 'f', ns: 'OSO', signature: 'S', author: 1, public: false, round: 1, uses: [] };
  d.library.push(k, pubA, firstS);
  d.publish(firstS, 1); d.publishBundle(pubA, 2);
  assert.equal(k.public, true); // its author's PUBLISH: yes on p took k along
  const t = { name: 't', ns: 'OSO', signature: 'T', author: 1, public: false, round: 3, uses: ['OSO.p'], target: 'C3' };
  d.library.push(t); d.publishBundle(t, 3);
  // C3's 4: b keeps 2, p gets 2 and keeps 1 (a); 1 flows to S, which b published first, not to a's copy k.
  assert.deepEqual(d.earnings, [1, 3]);
});

test('flow-back is split by the lines each cited result saves (its proof length), not by what it cost', async () => {
  const { Community } = await import('../src/lean/community.ts');
  const c = new Community({ rules: 'oso', alpha: 0.5, split: 'lines-saved', agents: ['a', 'b', 'c'], budget: 1, rounds: 1, repairs: 0, mint: 1, effort: 'low' });
  const long = { name: 'long', ns: 'OSO', signature: 'L', author: 0, public: true, round: 1, publishedRound: 1, uses: [], size: 300, cost: 0.01 };
  const short = { name: 'short', ns: 'OSO', signature: 'S', author: 1, public: true, round: 1, publishedRound: 1, uses: [], size: 100, cost: 0.09 };
  const t = { name: 't', ns: 'OSO', signature: 'T', author: 2, public: true, round: 2, publishedRound: 2, uses: ['OSO.long', 'OSO.short'] };
  c.library.push(long, short, t);
  c.pay(t, 8); // keeps 4; 4 flows back, 3 to the long proof and 1 to the short one, whatever they cost
  assert.deepEqual(c.earnings, [3, 1, 4]);
});

test('money follows earnings: each round the funder releases the same money, a share f of it by recent earnings', async () => {
  const { Community } = await import('../src/lean/community.ts');
  const c = new Community({ rules: 'oso', alpha: 0.8, follow: 0.5, agents: ['a', 'b'], budget: 1, rounds: 10, repairs: 0, mint: 1, effort: 'low' });
  c.fund(); // round 1: nobody has earned yet, so equal: 0.2 a round for both labs, 0.1 each
  assert.deepEqual(c.released, [0.1, 0.1]);
  const before = [...c.earnings];
  c.earnings[0] += 10; // lab 1 earns this round
  c.settle(before);
  c.fund(); // round 2: half equal (0.05 each), half by recent earnings (all to lab 1)
  assert.deepEqual(c.released.map((x) => Math.round(x * 1000) / 1000), [0.25, 0.15]);
  c.spent[1] = 0.16; // a turn can go a little over what it had
  assert.equal(c.active(1), false); // out of money this round
  assert.equal(c.done(), false); // more comes next round
  assert.match(c.systemPrompt(0), /Money: the funder releases the money round by round, \$0\.200 a round for all labs: 50% split equally/);
  // Without the setting, a fixed budget per lab, as before.
  const d = new Community({ rules: 'oso', alpha: 0.8, agents: ['a'], budget: 1, rounds: 10, repairs: 0, mint: 1, effort: 'low' });
  d.fund();
  assert.equal(d.budgetOf(0), 1);
  assert.doesNotMatch(d.systemPrompt(0), /Money:/);
});

test('labs that may not stop lose only the turn they pass', async () => {
  const { Community } = await import('../src/lean/community.ts');
  const base = { rules: 'shared' as const, agents: ['a', 'b'], budget: 1, rounds: 1, repairs: 0, alpha: 1, mint: 1, effort: 'low' as const, knowledge: 'off' as const };
  assert.match(new Community({ ...base, mayStop: false }).systemPrompt(0), /cannot stop early/);
  assert.match(new Community(base).systemPrompt(0), /ACTION: pass/);
  const { runCommunity } = await import('../src/lean/community.ts');
  const { mkdtempSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const passing = async () => ({ text: 'ACTION: pass', content: '', usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 }, stop: 'end_turn' });
  const r = await runCommunity({ ...base, rounds: 3, mayStop: false }, () => passing as never, () => 0.001, 'test-may-stop', () => {}, mkdtempSync(`${tmpdir()}/oso-stop-`));
  assert.equal(r.actions.filter((a) => a.kind === 'pass').length, 0);
  assert.equal(r.actions.length, 6, 'both labs take a turn in each of the 3 rounds');
});

test('labs choose with the knowledge reward off: the setups set it, whatever the common options say', async () => {
  const { Community, firstProofs } = await import('../src/lean/community.ts');
  const { societyOptions } = await import('../src/lean/societies.ts');
  const base = { rules: 'shared' as const, agents: ['a', 'b'], budget: 1, rounds: 1, repairs: 0, alpha: 1, mint: 1, effort: 'low' as const, knowledge: 'proof-size' as const };
  for (const [key, alpha] of [['choose-off-1', 1], ['choose-off-0.2', 0.2]] as const) {
    const o = societyOptions(key, base);
    assert.equal(o.knowledge, 'off');
    assert.equal(o.publishing, 'choose');
    assert.equal(o.alpha, alpha);
    assert.match(new Community(o).systemPrompt(0), /A new result earns nothing by itself/);
  }
  assert.equal(societyOptions('choose-1', { ...base, knowledge: 'off' }).knowledge, 'proof-size', 'the first labs-choose setups keep the reward');
  const e = (name: string, signature: string) => ({ name, signature, ns: 'OSO', author: 0, public: true, round: 1, uses: [] });
  assert.deepEqual(firstProofs([e('a', 'x :  1'), e('b', 'x : 1'), e('c', 'y')]).map((x) => x.name), ['a', 'c'], 'a repeat proof of a statement is left out');
});
