// The Phase 0 checker and the next experiment's societies: the parts that do not need a model.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { BENCH_DIR, bannedTactics, compile, extractTactics, indentProof } from '../src/bench/check.ts';
import { SOCIETIES, societyOptions, writeSocieties } from '../src/lean/societies.ts';
import { Community, runCommunity, stats, referenceAgent, type CommunityOptions } from '../src/lean/community.ts';
import { leanAvailable } from '../src/lean/tasks.ts';
import { RESULTS_DIR } from '../src/paths.ts';

const p = { id: 't', header: 'import Mathlib', statement: 'theorem t (a b : ℕ) : a + b = b + a := by' };

test('the proof is what follows the theorem\'s `:= by`; a different theorem is not an answer', () => {
  assert.equal(extractTactics('```lean\ntheorem t (a b : ℕ) : a + b = b + a := by\n  omega\n```', p), '  omega');
  assert.equal(extractTactics('Here:\n```lean\nomega\n```', p), 'omega');
  assert.equal(extractTactics('```lean\nby\n  omega\n```', p), '\n  omega');
  assert.equal(extractTactics('```lean\ntheorem other : True := by\n  trivial\n```', p), null);
  assert.equal(extractTactics('no code', p), null);
  assert.equal(extractTactics('by\n  omega', p), '\n  omega'); // all code, no fence
});

test('a proof moves as one block, so nested lines keep their depth', () => {
  assert.equal(indentProof('constructor\n· simp\n  ring\n· omega'), '  constructor\n  · simp\n    ring\n  · omega');
  assert.equal(indentProof('    induction n with\n    | zero => simp\n    | succ k ih =>\n      omega'), '  induction n with\n  | zero => simp\n  | succ k ih =>\n    omega');
  assert.equal(indentProof('\tsimp'), '  simp');
});

test('banned shortcuts and new declarations are refused', () => {
  assert.ok(bannedTactics('sorry').length);
  assert.ok(bannedTactics('native_decide').length);
  assert.ok(bannedTactics('omega\n#eval 1').length);
  assert.ok(bannedTactics('omega\ntheorem x : True := trivial').length);
  assert.deepEqual(bannedTactics('have h : 1 = 1 := rfl\nomega'), []);
});

test('with Mathlib: a proof starting at the margin with nested lines is accepted', { skip: !leanAvailable() || !existsSync(join(BENCH_DIR, '.lake', 'packages', 'mathlib')) || !process.env.BENCH_LEAN }, async () => {
  const q = { id: 'q', header: 'import Mathlib', statement: 'theorem q (a b : ℕ) (h : a = b) : a + 0 = b ∧ b = a := by' };
  assert.ok((await compile(q, 'constructor\n· simp\n  exact h\n· exact h.symm')).ok);
  assert.ok(!(await compile(q, 'constructor\n· simp')).ok);
});

const base: CommunityOptions = { agents: ['a', 'b', 'c', 'd'], budget: 0.5, rounds: 30, repairs: 2, alpha: 0.8, c: 0.15, mint: 1, effort: 'medium', allowGrind: true, rules: 'oso' } as CommunityOptions;

test('every society has the same total money; the single agent has it all, with rounds to spend it', () => {
  for (const key of Object.keys(SOCIETIES)) {
    const o = societyOptions(key, base);
    assert.equal(o.budget * o.agents.length, 2, key);
  }
  const one = societyOptions('single', base);
  assert.deepEqual([one.agents.length, one.rounds], [1, 120]);
  assert.equal(societyOptions('oso-0.2', base).alpha, 0.2);
});

test('the planner reads `LAB n:` lines and charges lab 1; a reply without them is an unusable plan, not a failed attempt', async () => {
  const com = new Community({ ...base, rules: 'planner' });
  const usage = { input: 1000, output: 100, cacheRead: 0, cacheWrite: 0 };
  await com.plan(1, async () => ({ text: 'LAB 2: target T1\nlab 3 : lemma `theorem x : True`\nLAB 4: target T2', content: '', usage, stop: 'end_turn' }), () => 0.01, () => {});
  assert.deepEqual([com.plans[1], com.plans[3], com.spent[0]], ['target T1', 'target T2', 0.01]);
  assert.match(com.plans[2], /lemma/);
  await com.plan(2, async () => ({ text: 'LAB 2: lemma `theorem a : True`\nLAB 2: lemma `theorem b : True`', content: '', usage, stop: 'end_turn' }), () => 0.01, () => {});
  assert.equal(com.plans[1], 'lemma `theorem a : True`\nlemma `theorem b : True`'); // several lines for one lab: all kept
  com.actions.pop();
  await com.plan(2, async () => ({ text: 'I suggest everyone works on T1.', content: '', usage, stop: 'end_turn' }), () => 0.01, () => {});
  const st = stats({ opts: com.opts, actions: com.actions, library: com.library, earnings: com.earnings, spent: com.spent });
  assert.deepEqual([st.failed, st.plansUnusable], [0, 1]);
});

test('a planner that runs out of credit stops the run instead of leaving the labs unassigned', async () => {
  const chat = (com: Community, i: number) => (i === 0 ? async () => { throw new Error('OpenRouter 402: Insufficient credits'); } : referenceAgent(com, i));
  const r = await runCommunity({ ...base, rules: 'planner' }, chat as never, () => 0.01, `test-planner-402-${process.pid}`, () => {}, join(process.env.TMPDIR ?? '/tmp', 'oso-test-runs'));
  assert.equal(r.stopped, 'out of credit');
  assert.equal(r.actions.length, 0);
});

test('the societies summary handles runs with no actions', () => {
  const empty = { opts: { ...base, counted: ['T1'] }, actions: [], library: [], earnings: [0, 0, 0, 0], spent: [0, 0, 0, 0] };
  const index = join(RESULTS_DIR, 'README.md'), kept = readFileSync(index, 'utf8'); // the card writer adds a line here
  const dir = writeSocieties(`test-empty-${process.pid}`, [{ key: 'oso', rep: 1, runId: 'x', result: empty }, { key: 'shared', rep: 1, runId: 'y', result: empty }], 1);
  renameSync(dir, join(tmpdir(), `oso-test-empty-${process.pid}`)); // keep results/ for real runs
  writeFileSync(index, kept);
});
