// How far each setup got on a deep problem (one target, a long hidden proof): `node scripts/deep-steps.ts <experiment id> [money]`.
//
// Targets proved is 0 or 1 a run there, too coarse, so this reads the step matcher (scripts/match-steps.ts, run here
// first) and reports, per setup, with 95% ranges over runs (Student t; runs are the unit):
//   - hidden steps reached once each run has spent the same money (default $2: before any run stops), the main measure;
//   - the deepest level of the hidden proof reached by then;
//   - runs that proved the target, and the money each needed.
// Differences between setups come with Welch ranges. Earlier runs named in the plan's `compare` are read too.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { costOf, type Action, type CommunityOptions } from '../src/lean/community.ts';
import { LEAN_DIR, loadTasks, type Problems } from '../src/lean/tasks.ts';

const [id, moneyArg] = process.argv.slice(2);
if (!id) { console.error('usage: node scripts/deep-steps.ts <experiment id> [money per run]'); process.exit(1); }
const money = Number(moneyArg ?? 2);
const runs = join(LEAN_DIR, 'runs');
const plan = JSON.parse(readFileSync(join(runs, `${id}.plan.json`), 'utf8')) as { societies: string[]; repeats: number; compare?: { experiment: string; setup: string }[] };
const sources = [...plan.societies.map((key) => ({ key, from: id, repeats: plan.repeats })),
  ...(plan.compare ?? []).map((c) => ({ key: c.setup, from: c.experiment, repeats: (JSON.parse(readFileSync(join(runs, `${c.experiment}.plan.json`), 'utf8')) as { repeats: number }).repeats }))];

// Student t, 97.5th percentile, by degrees of freedom (1–30; the normal value above).
const T = [12.71, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228, 2.201, 2.179, 2.16, 2.145, 2.131, 2.12, 2.11, 2.101, 2.093, 2.086, 2.08, 2.074, 2.069, 2.064, 2.06, 2.056, 2.052, 2.048, 2.045, 2.042];
const t975 = (df: number) => (df < 1 ? NaN : T[Math.min(30, Math.round(df)) - 1] ?? 1.96);
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
const variance = (xs: number[]) => xs.reduce((a, b) => a + (b - mean(xs)) ** 2, 0) / (xs.length - 1);
const range = (xs: number[]) => (xs.length < 2 ? '' : ` (${(mean(xs) - t975(xs.length - 1) * Math.sqrt(variance(xs) / xs.length)).toFixed(1)} to ${(mean(xs) + t975(xs.length - 1) * Math.sqrt(variance(xs) / xs.length)).toFixed(1)})`);

interface Run { key: string; rep: number; done: boolean; spent: number; steps: number; deepest: number; provedAt: number | null }
let problems: Problems = 'deep';
const all: Run[] = sources.flatMap(({ key, from, repeats }) => Array.from({ length: repeats }, (_, k) => {
  const dir = join(runs, `${from}-r${k + 1}-${key}`);
  if (!existsSync(join(dir, 'actions.jsonl'))) return [];
  problems = ((JSON.parse(readFileSync(join(dir, 'options.json'), 'utf8')) as CommunityOptions).problems ?? 'main') as Problems;
  execFileSync('node', ['scripts/match-steps.ts', dir], { stdio: 'ignore' });
  const actions = readFileSync(join(dir, 'actions.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)) as Action[];
  const m = JSON.parse(readFileSync(join(dir, 'matches.json'), 'utf8')) as { covers: Record<string, string[]>; combos?: Record<string, string[]> };
  // Money spent when each lab lemma was proved; a step is reached by the money at which its lemma (or the last of its lemmas) was.
  let spent = 0, provedAt: number | null = null;
  const at = new Map<string, number>();
  for (const a of actions) {
    spent += costOf(a);
    if (a.ok && a.entry && !at.has(a.entry)) at.set(a.entry, spent);
    if (a.ok && a.kind === 'target' && provedAt === null) provedAt = spent;
  }
  const reached = new Map<string, number>();
  for (const [e, steps] of Object.entries(m.covers)) for (const s of steps) if (at.has(e)) reached.set(s, Math.min(reached.get(s) ?? Infinity, at.get(e)!));
  for (const [s, used] of Object.entries(m.combos ?? {})) { const w = Math.max(...used.map((e) => at.get(e) ?? Infinity)); if (Number.isFinite(w)) reached.set(s, Math.min(reached.get(s) ?? Infinity, w)); }
  const depth = new Map(loadTasks(problems).map((t) => [t.name, t.depth]));
  const by = [...reached].filter(([, w]) => w <= money).map(([s]) => s);
  return [{ key: `${key}${from === id ? '' : ` (${from})`}`, rep: k + 1, done: existsSync(join(dir, 'result.json')), spent, steps: by.length, deepest: Math.max(0, ...by.map((s) => depth.get(s) ?? 0)), provedAt }];
}).flat());

const hidden = loadTasks(problems).filter((t) => !t.posted).length;
console.log(`${id}: hidden steps reached by $${money.toFixed(2)} a run (of ${hidden}), mean and 95% range over runs\n`);
const keys = [...new Set(all.map((r) => r.key))];
for (const key of keys) {
  const rs = all.filter((r) => r.key === key), short = rs.filter((r) => r.spent < money && !r.done);
  const proved = rs.filter((r) => r.provedAt !== null).map((r) => r.provedAt!);
  console.log(`${key}: ${rs.length} run(s), ${rs.filter((r) => r.done).length} finished${short.length ? `; ${short.length} not yet at $${money.toFixed(2)}, counted so far` : ''}`);
  console.log(`  steps reached     ${mean(rs.map((r) => r.steps)).toFixed(1)}${range(rs.map((r) => r.steps))}`);
  console.log(`  deepest level     ${mean(rs.map((r) => r.deepest)).toFixed(1)}${range(rs.map((r) => r.deepest))}`);
  console.log(`  proved the target ${proved.length} of ${rs.length}${proved.length ? `, for ${proved.map((p) => '$' + p.toFixed(2)).join(', ')}` : ''}`);
}
// Each pair of setups: the difference in steps reached, with a Welch range.
for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) {
  const a = all.filter((r) => r.key === keys[i]).map((r) => r.steps), b = all.filter((r) => r.key === keys[j]).map((r) => r.steps);
  if (a.length < 2 || b.length < 2) { console.log(`\n${keys[i]} − ${keys[j]}: ${(mean(a) - mean(b)).toFixed(1)} steps (no range: fewer than 2 runs a side)`); continue; }
  const va = variance(a) / a.length, vb = variance(b) / b.length, se = Math.sqrt(va + vb);
  const df = (va + vb) ** 2 / (va ** 2 / (a.length - 1) + vb ** 2 / (b.length - 1));
  const d = mean(a) - mean(b);
  console.log(`\n${keys[i]} − ${keys[j]}: ${d.toFixed(1)} steps (${(d - t975(df) * se).toFixed(1)} to ${(d + t975(df) * se).toFixed(1)})`);
}
