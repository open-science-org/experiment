// How soon a Lean experiment's setups reach its targets, from the saved runs (costs nothing).
// Run from the repository: npm run speed -- <experiment id> [setups, comma-separated]
// Writes results/community/<id>/speed.md and figures/speed-money.svg, figures/speed-rounds.svg.
// A run that never reaches a target counts as "not reached": medians and their 95% ranges use every run,
// so a setup is not flattered by leaving out the runs that failed.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { countedOf, progress, type CommunityResult } from '../src/lean/community.ts';
import { SOCIETIES, solvedAt } from '../src/lean/societies.ts';
import { lineChart, type Series } from '../src/report/figures.ts';

const [id, only] = process.argv.slice(2);
if (!id) throw new Error('usage: npm run speed -- <experiment id> [setups, comma-separated]');
const RUNS = 'lean/runs';
const groups = new Map<string, CommunityResult[]>();
for (const d of readdirSync(RUNS).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))) {
  const m = new RegExp(`^${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-r\\d+-(.+)$`).exec(d);
  if (!m || d.endsWith('.log') || !existsSync(join(RUNS, d, 'result.json')) || !SOCIETIES[m[1]]) continue;
  groups.set(m[1], [...(groups.get(m[1]) ?? []), JSON.parse(readFileSync(join(RUNS, d, 'result.json'), 'utf8'))]);
}
const ORDER = Object.keys(SOCIETIES);
const keys = (only ? only.split(',') : [...groups.keys()]).filter((k) => groups.has(k)).sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
if (!keys.length) throw new Error(`no finished runs for ${id}`);

const T95 = [NaN, 12.71, 4.3, 3.18, 2.78, 2.57, 2.45, 2.36, 2.31, 2.26, 2.23, 2.2, 2.18, 2.16, 2.14, 2.13, 2.12, 2.11, 2.1, 2.09, 2.09];
const t95 = (df: number) => (df < T95.length ? T95[df] : 1.96 + 2.4 / df);
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
function meanRange(xs: number[]): [number, number, number] {
  const m = mean(xs), sd = Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / Math.max(1, xs.length - 1));
  const h = t95(xs.length - 1) * sd / Math.sqrt(xs.length);
  return [m, m - h, m + h];
}
/** The median and a range of at least 95% from the sorted runs themselves; Infinity is "not reached". */
function medianRange(xs: number[]): [number, number, number] {
  const s = [...xs].sort((a, b) => a - b), n = s.length;
  let cum = 0, c = 1, r = 0; // r: how many runs can be cut from each end, with P(X <= r - 1) <= 2.5%
  for (let k = 0; k < n; k++) { cum += c / 2 ** n; if (cum > 0.025) break; r = k + 1; c = c * (n - k) / (k + 1); }
  const mid = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
  return [mid, s[r], s[n - 1 - r]];
}
const wilson = (k: number, n: number, z = 1.96): [number, number] => {
  const p = k / n, c = (p + z * z / 2 / n) / (1 + z * z / n), h = z * Math.sqrt(p * (1 - p) / n + z * z / 4 / n / n) / (1 + z * z / n);
  return [Math.max(0, c - h), Math.min(1, c + h)];
};

/** Each counted target's first proof in a run: its round and the community's money spent by then. */
function firstProofs(r: CommunityResult) {
  const counted = new Set(countedOf(r)), out = new Map<string, { round: number; money: number }>();
  let money = 0;
  for (const a of [...r.actions].sort((x, y) => x.t - y.t)) {
    money += a.cost ?? 0;
    if (a.kind === 'target' && a.ok && a.target && counted.has(a.target) && !out.has(a.target)) out.set(a.target, { round: a.round, money });
  }
  return out;
}
/** Targets proved by the end of each round: [round, count]. */
function byRound(r: CommunityResult, last: number) {
  const proved = [...firstProofs(r).values()].map((x) => x.round);
  return (x: number) => (x > last ? proved.length : proved.filter((p) => p <= x).length);
}

// Colours: OSO orange, traditional blue, others grey; low α darker and dashed, as in the app.
const look = (k: string) => k.endsWith('0.2') ? { colour: '#a8421a', dash: '6 4' } : k === 'shared' ? { colour: '#6b6a65' } : { colour: SOCIETIES[k].colour };
const band = (points: [number, number][], curves: number[][], top: number): [number, number, number][] =>
  points.map(([x], n) => { const [, lo, hi] = meanRange(curves.map((c) => c[n])); return [x, Math.max(0, lo), Math.min(top, hi)]; });
const dir = join('results', 'community', id);
mkdirSync(join(dir, 'figures'), { recursive: true });
const sample = groups.get(keys[0])![0], targets = countedOf(sample), top = targets.length;
const total = Math.max(...keys.flatMap((k) => groups.get(k)!.map((r) => r.opts.budget * r.opts.agents.length)));
const fy = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));
const yTicks = Array.from({ length: top + 1 }, (_, n) => n);
const runsOf = (k: string) => groups.get(k)!.length;
const label = keys.map((k) => runsOf(k)).every((n) => n === runsOf(keys[0])) ? `${runsOf(keys[0])} runs per setup` : 'runs per setup differ';

const moneyGrid = Array.from({ length: 61 }, (_, n) => (total * n) / 60);
const moneySeries: Series[] = keys.map((k) => {
  const curves = groups.get(k)!.map((r) => { const c = progress(r); return moneyGrid.map((x) => solvedAt(c, x)); });
  const points = moneyGrid.map((x, n) => [x, mean(curves.map((c) => c[n]))] as [number, number]);
  return { name: SOCIETIES[k].name, slot: SOCIETIES[k].slot, ...look(k), points, band: band(points, curves, top) };
});
writeFileSync(join(dir, 'figures', 'speed-money.svg'), lineChart({
  title: 'Targets proved for the money', subtitle: `Mean of ${label}; shading is the 95% range of the mean.`,
  xLabel: 'Dollars the community has spent', yLabel: 'Targets proved', series: moneySeries, x: [0, total], y: [0, top],
  xTicks: [0, total / 4, total / 2, (3 * total) / 4, total], yTicks, format: { x: (v) => `$${v.toFixed(2)}`, y: fy },
}));
const lastRound = Math.max(...keys.flatMap((k) => groups.get(k)!.flatMap((r) => r.actions.map((a) => a.round))));
const roundGrid = Array.from({ length: lastRound + 1 }, (_, n) => n);
const roundSeries: Series[] = keys.map((k) => {
  const curves = groups.get(k)!.map((r) => { const f = byRound(r, lastRound); return roundGrid.map(f); });
  const points = roundGrid.map((x, n) => [x, mean(curves.map((c) => c[n]))] as [number, number]);
  return { name: SOCIETIES[k].name, slot: SOCIETIES[k].slot, ...look(k), points, band: band(points, curves, top) };
});
const step = Math.max(1, Math.ceil(lastRound / 6));
writeFileSync(join(dir, 'figures', 'speed-rounds.svg'), lineChart({
  title: 'Targets proved by round', subtitle: `Mean of ${label}; shading is the 95% range of the mean.`,
  xLabel: 'Round', yLabel: 'Targets proved', series: roundSeries, x: [0, lastRound], y: [0, top],
  xTicks: roundGrid.filter((x) => x % step === 0), yTicks, format: { x: (v) => String(v), y: fy },
}));

const never = '–';
const usd = (x: number) => (x === Infinity ? never : `$${x.toFixed(3)}`), rnd = (x: number) => (x === Infinity ? never : x % 1 ? x.toFixed(1) : String(x));
const cell = (xs: number[], f: (x: number) => string) => { const [m, lo, hi] = medianRange(xs); return m === Infinity ? (lo === Infinity ? 'not reached' : `not reached (from ${f(lo)})`) : `${f(m)} (${f(lo)} to ${hi === Infinity ? 'not reached' : f(hi)})`; };
const lines: string[] = [`# How soon each setup reaches the targets: ${id}`, '',
  'From the saved runs by `npm run speed`. Looked at after the results, so these are leads. Money is what all labs together had spent when the proof came in. Medians use every run; "not reached" means a run that never got there, and each range covers at least 95%.', '',
  '![Targets proved for the money](figures/speed-money.svg)', '', '![Targets proved by round](figures/speed-rounds.svg)', ''];
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
console.log(lines.filter((l) => !l.startsWith('![')).join('\n'));
