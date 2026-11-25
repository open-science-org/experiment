// How soon a Lean experiment's setups reach its targets, from the saved runs (costs nothing).
// Run from the repository: npm run speed -- <experiment id> [setups, comma-separated] [--with=<other id>:<setup>]
// --with adds one setup from another experiment to the graph only (saved as money-to-targets-with-<id>-<setup>.svg);
// it must have the same targets and the same money per run.
// Writes results/community/<id>/speed.md, the tables behind the graph on the app's Experiments → Results page.
// A run that never reaches a target counts as "not reached": medians and their 95% ranges use every run,
// so a setup is not flattered by leaving out the runs that failed.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { countedOf, moneyByRound, type CommunityResult } from '../src/lean/community.ts';
import { SOCIETIES, medianRange, osoLabel, osoParams } from '../src/lean/societies.ts';
import { lineChart } from '../src/report/figures.ts';
import { EXPERIMENT_NAMES } from '../src/lean/names.ts';

const args = process.argv.slice(2), withArg = args.find((a) => a.startsWith('--with='))?.slice(7);
const [id, only] = args.filter((a) => !a.startsWith('--'));
if (!id) throw new Error('usage: npm run speed -- <experiment id> [setups, comma-separated] [--with=<other id>:<setup>]');
const RUNS = 'lean/runs';
function load(exp: string) {
  const out = new Map<string, CommunityResult[]>();
  for (const d of readdirSync(RUNS).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))) {
    const m = new RegExp(`^${exp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-r\\d+-(.+)$`).exec(d);
    if (!m || d.endsWith('.log') || !existsSync(join(RUNS, d, 'result.json')) || !SOCIETIES[m[1]]) continue;
    out.set(m[1], [...(out.get(m[1]) ?? []), JSON.parse(readFileSync(join(RUNS, d, 'result.json'), 'utf8'))]);
  }
  return out;
}
const groups = load(id);
const ORDER = Object.keys(SOCIETIES);
const keys = (only ? only.split(',') : [...groups.keys()]).filter((k) => groups.has(k)).sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
if (!keys.length) throw new Error(`no finished runs for ${id}`);

const wilson = (k: number, n: number, z = 1.96): [number, number] => {
  const p = k / n, c = (p + z * z / 2 / n) / (1 + z * z / n), h = z * Math.sqrt(p * (1 - p) / n + z * z / 4 / n / n) / (1 + z * z / n);
  return [Math.max(0, c - h), Math.min(1, c + h)];
};

/** Each counted target's first proof in a run: its round and the community's money spent by the end of that round. */
function firstProofs(r: CommunityResult) {
  const counted = new Set(countedOf(r)), out = new Map<string, { round: number; money: number }>(), money = moneyByRound(r.actions);
  for (const a of [...r.actions].sort((x, y) => x.t - y.t)) {
    if (a.kind === 'target' && a.ok && a.target && counted.has(a.target) && !out.has(a.target)) out.set(a.target, { round: a.round, money: money.get(a.round)! });
  }
  return out;
}
const dir = join('results', 'community', id);
mkdirSync(dir, { recursive: true });
const sample = groups.get(keys[0])![0], targets = countedOf(sample);

const never = '–';
const usd = (x: number) => (x === Infinity ? never : `$${x.toFixed(3)}`), rnd = (x: number) => (x === Infinity ? never : x % 1 ? x.toFixed(1) : String(x));
const cell = (xs: number[], f: (x: number) => string) => { const [m, lo, hi] = medianRange(xs); if (lo === null || hi === null) return `${m === Infinity ? 'not reached' : f(m)} (too few runs for a range)`; return m === Infinity ? (lo === Infinity ? 'not reached' : `not reached (from ${f(lo)})`) : `${f(m)} (${f(lo)} to ${hi === Infinity ? 'not reached' : f(hi)})`; };
const lines: string[] = [`# How soon each setup reaches the targets: ${id}`, '',
  'From the saved runs by `npm run speed`. Looked at after the results, so these are leads. Money is what all labs together had spent by the end of the round in which the proof came in. Medians use every run; "not reached" means a run that never got there, and each range covers at least 95%.', '',
  `The graphs are on the app's Experiments → Results page for this experiment.`, ''];
const atK = (r: CommunityResult, k: number, f: 'round' | 'money') => { const xs = [...firstProofs(r).values()].sort((a, b) => a.money - b.money); return xs[k - 1]?.[f] ?? Infinity; };
const table = (title: string, rowsOf: (k: string) => string[], head: string[]) => {
  lines.push(`## ${title}`, '', `| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...keys.flatMap((k) => rowsOf(k).map((r) => `| ${SOCIETIES[k].name} | ${r} |`)), '');
};
for (const k of [4, 5, 6, 7]) table(`Reaching ${k} targets`, (s) => {
  const rs = groups.get(s)!, money = rs.map((r) => atK(r, k, 'money')), rounds = rs.map((r) => atK(r, k, 'round'));
  const hit = money.filter((x) => x < Infinity).length, [lo, hi] = wilson(hit, rs.length);
  return [`${hit} of ${rs.length} (${Math.round(lo * 100)}–${Math.round(hi * 100)}%) | ${cell(money, usd)} | ${cell(rounds, rnd)}`];
}, ['Setup', 'Runs that reached it', 'Median money', 'Median round']);
const ids = [...targets].sort();
lines.push('## Each target', '', 'Runs that reached it · median round · median money.', '', `| Target | ${keys.map((k) => SOCIETIES[k].name).join(' | ')} |`, `| --- | ${keys.map(() => '---').join(' | ')} |`);
for (const t of ids) lines.push(`| ${t} | ${keys.map((k) => {
  const f = groups.get(k)!.map((r) => firstProofs(r).get(t)), hit = f.filter(Boolean).length;
  return `${hit} of ${f.length} · ${rnd(medianRange(f.map((x) => x?.round ?? Infinity))[0])} · ${usd(medianRange(f.map((x) => x?.money ?? Infinity))[0])}`;
}).join(' | ')} |`);
writeFileSync(join(dir, 'speed.md'), lines.join('\n') + '\n');

// The same as a graph: median money to reach each number of targets, with its 95% range; a line stops once half
// or more of a setup's runs never got there. The top of the graph is all the money the labs had.
const cap = sample.opts.budget * sample.opts.agents.length;
// When the setups differ only in α, the lines are named by α and the other OSO parameters go in the subtitle.
const params = keys.map((k) => osoParams(groups.get(k)![0].opts).split(' · '));
const onlyAlpha = params.every((p) => p.filter((x) => !x.startsWith('α ')).join() === params[0].filter((x) => !x.startsWith('α ')).join());
const curve = (rs: CommunityResult[]) => {
  const pts: [number, number][] = [], ranges: [number, number][] = [];
  let ranged = false, n = 1;
  for (; n <= targets.length; n++) {
    const [m, lo, hi] = medianRange(rs.map((r) => atK(r, n, 'money')));
    if (m === Infinity) break;
    if (lo !== null) ranged = true;
    pts.push([n, m]); ranges.push([lo ?? m, Math.min(cap, hi ?? m)]);
  }
  // Each run's own line, to the last count it reached; the median line stops once half the runs or more never got further.
  const own = rs.map((r) => { const xs: [number, number][] = []; for (let k = 1; k <= targets.length && atK(r, k, 'money') < Infinity; k++) xs.push([k, atK(r, k, 'money')]); return xs; });
  return { points: pts, ...(ranged ? { ranges } : {}), runs: own, ...(n <= targets.length && pts.length ? { stopped: `${usd(pts.at(-1)![1])} at ${pts.length}; most runs never reached ${n}` } : {}) };
};
const series = keys.map((k, i) => ({
  name: onlyAlpha ? params[i].find((x) => x.startsWith('α '))!.replace('α ', 'α = ') : osoLabel(SOCIETIES[k].name, groups.get(k)![0].opts),
  slot: SOCIETIES[k].slot ?? 2, colour: SOCIETIES[k].colour, dash: SOCIETIES[k].dash, ...curve(groups.get(k)!),
}));
let file = 'money-to-targets.svg', runsNote = `Median of ${groups.get(keys[0])!.length} runs`;
if (withArg) {
  const [exp, setup] = withArg.split(':'), rs = load(exp).get(setup);
  if (!rs?.length) throw new Error(`no finished runs for ${exp}, setup ${setup}`);
  const o = rs[0].opts;
  if (countedOf(rs[0]).join() !== targets.join() || o.budget * o.agents.length !== cap) throw new Error(`${withArg} has other targets or money`);
  const from = (EXPERIMENT_NAMES[exp] ?? exp).split(':')[0];
  series.push({ name: `${SOCIETIES[setup].name} (${from})`, slot: SOCIETIES[setup].slot ?? 2, colour: SOCIETIES[setup].colour, ...curve(rs) });
  file = `money-to-targets-with-${exp}-${setup}.svg`;
  runsNote += ` (${SOCIETIES[setup].name.toLowerCase()}: ${rs.length})`;
}
mkdirSync(join(dir, 'figures'), { recursive: true });
writeFileSync(join(dir, 'figures', file), lineChart({
  title: 'Money spent to reach a number of targets',
  subtitle: `${onlyAlpha ? `${withArg ? 'α' : 'All'}: ${params[0].filter((x) => !x.startsWith('α ')).join(', ')}. ` : ''}${runsNote}, bold; each run faint${series.some((x) => x.ranges) ? '; bars: 95% ranges' : ' (no ranges under 6 runs)'}; an open ring: the line stops there.`,
  xLabel: `Targets proved (of ${targets.length})`, yLabel: 'Money spent, all labs ($)', series,
  x: [1, targets.length], y: [0, cap], xTicks: targets.map((_, i) => i + 1), yTicks: [0, cap / 4, cap / 2, (3 * cap) / 4, cap],
  markers: true, format: { y: (v) => `$${v.toFixed(2)}` },
}) + '\n');
console.log(lines.filter((l) => !l.startsWith('![')).join('\n'));
