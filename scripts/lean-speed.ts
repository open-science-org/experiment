// How soon a Lean experiment's setups reach its targets, from the saved runs (costs nothing).
// Run from the repository: npm run speed -- <experiment id> [setups, comma-separated]
// Writes results/community/<id>/speed.md, the tables behind the graph on the app's Experiments → Results page.
// A run that never reaches a target counts as "not reached": medians and their 95% ranges use every run,
// so a setup is not flattered by leaving out the runs that failed.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { countedOf, moneyByRound, type CommunityResult } from '../src/lean/community.ts';
import { SOCIETIES, medianRange } from '../src/lean/societies.ts';

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
console.log(lines.filter((l) => !l.startsWith('![')).join('\n'));
