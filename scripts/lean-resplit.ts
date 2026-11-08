// The graph-weight correction (2026-11-08): replays each finished Lean run's payouts with the split it ran with
// (money spent proving each cited result) and with the corrected split (lines saved: each cited result's proof
// length, relative to the others the same proof cites). Only OSO runs with α < 1, where value flows back.
// Run from the repository: node scripts/lean-resplit.ts
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { Community, parseLemma, proofSize } from '../src/lean/community.ts';
const dir = 'lean/runs';
const exps = ['lean-main-b', 'lean-b5', 'lean-part-a', 'lean-m3', 'race-cheap', 'pilot-societies-1'];
const out: Record<string, { runs: number; total: number; moved: number; maxRun: number; rankFlips: number; check: number; edges: number; edgeShift: number }> = {};
for (const d of readdirSync(dir)) {
  const m = /^(.*)-r\d+-(.+)$/.exec(d); if (!m || !exps.includes(m[1])) continue;
  const f = join(dir, d, 'result.json'); if (!existsSync(f)) continue;
  const res = JSON.parse(readFileSync(f, 'utf8'));
  if (res.opts.rules !== 'oso' || res.opts.alpha >= 1) continue; // nothing flows back otherwise
  const acts = readFileSync(join(dir, d, 'actions.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
  const size = new Map<string, number>();
  for (const a of acts) if (a.ok && a.entry) {
    const code = a.transcript?.at(-1)?.proof ?? '';
    const proof = a.kind === 'lemma' ? (parseLemma(code)?.proof ?? code) : code.replace(/^\s*theorem\s+attempt\b[\s\S]*?(?=:=|\n\s*\|)/, '');
    size.set(a.entry, proofSize(proof.replace(/^\s*:=/, '')));
  }
  const replay = (split: 'cost' | 'lines-saved') => {
    const c = new Community({ ...res.opts, split });
    c.library = res.library.map((e: any) => ({ ...e, size: e.size ?? size.get(e.name), public: false }));
    const order = c.library.map((e, i) => [e, i] as const).filter(([e]) => res.library[c.library.indexOf(e)].public)
      .sort((a, b) => (a[0].publishedRound ?? 0) - (b[0].publishedRound ?? 0) || a[1] - b[1]);
    for (const [e] of order) c.publish(e, e.publishedRound ?? e.round);
    return c.earnings;
  };
  const old = replay('cost'), now = replay('lines-saved');
  const total = old.reduce((a, b) => a + b, 0);
  const moved = old.reduce((a, x, i) => a + Math.abs(x - now[i]), 0) / 2;
  const lib = res.library as any[];
  // Per edge: share of each cited parent, both ways, over results citing two or more library results.
  let edges = 0, shift = 0;
  const c0 = new Community({ ...res.opts, split: 'cost' }), c1 = new Community({ ...res.opts, split: 'lines-saved' });
  for (const e of lib) {
    const used = e.uses.map((n: string) => lib.find((x) => `${x.ns}.${x.name}` === n)).filter(Boolean).map((u: any) => ({ ...u, size: u.size ?? size.get(u.name) }));
    if (used.length < 2) continue;
    const w0 = c0.weights(used), w1 = c1.weights(used);
    edges++; shift += w0.reduce((a: number, x: number, i: number) => a + Math.abs(x - w1[i]), 0) / 2;
  }
  const rank = (xs: number[]) => xs.map((x, i) => [x, i]).sort((a, b) => b[0] - a[0]).map((p) => p[1]).join();
  const k = `${m[1]} ${m[2]}`;
  const o = (out[k] ??= { runs: 0, total: 0, moved: 0, maxRun: 0, rankFlips: 0, check: 0, edges: 0, edgeShift: 0 });
  o.runs++; o.total += total; o.moved += moved; o.maxRun = Math.max(o.maxRun, total ? moved / total : 0);
  o.rankFlips += rank(old) !== rank(now) ? 1 : 0; o.edges += edges; o.edgeShift += shift;
  o.check = Math.max(o.check, old.reduce((a, x, i) => a + Math.abs(x - res.earnings[i]), 0));
}
for (const [k, o] of Object.entries(out)) console.log(k.padEnd(28), 'runs', o.runs, '| earnings moved', (100 * o.moved / o.total).toFixed(1) + '%', '(worst run ' + (100 * o.maxRun).toFixed(1) + '%)', '| lab order changed in', o.rankFlips, 'runs | multi-parent results', o.edges, 'mean share shift', o.edges ? (100 * o.edgeShift / o.edges).toFixed(0) + '%' : '-', '| replay vs recorded, max gap', o.check.toFixed(2));
