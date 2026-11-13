// β, the share of ideas published as soon as they are proved, against α, when agents choose what to publish.
// From saved results only: the simulation's sweeps and the AI labs of Labs choose (lean-m3).
// Writes docs/figures/beta-by-alpha.svg and prints the numbers as a table. Run: node scripts/beta-by-alpha.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { lineChart, type Series } from '../src/report/figures.ts';

// Student t for a 95% range, by degrees of freedom.
const T95 = [NaN, 12.71, 4.30, 3.18, 2.78, 2.57, 2.45, 2.36, 2.31, 2.26, 2.23];
const t95 = (df: number) => (df <= 10 ? T95[df] : df < 30 ? 2.1 : df < 99 ? 2.0 : 1.984);
const range = (xs: number[]) => {
  const n = xs.length, m = xs.reduce((a, b) => a + b, 0) / n;
  const sd = n > 1 ? Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / (n - 1)) : NaN;
  const h = (t95(n - 1) * sd) / Math.sqrt(n);
  return { m, lo: Math.max(0, m - h), hi: Math.min(1, m + h), n };
};
type Point = { a: number; m: number; lo: number; hi: number; n: number; lemmas?: number };
// Each run's share, then the mean over runs at each α, for the simulation and the AI labs alike.
// α is a field of each run in a sweep, or part of the society's name ("Agents choose, α = 0.2").
const simulation = (dir: string): Point[] => {
  const by = new Map<number, number[]>();
  for (const l of readFileSync(`results/${dir}/runs.jsonl`, 'utf8').split('\n').filter(Boolean)) {
    const r = JSON.parse(l), a = r['α'] ?? Number(/^Agents choose, α = ([\d.]+)$/.exec(r.society ?? '')?.[1] ?? NaN);
    if (!Number.isNaN(a) && typeof r.sharingRate === 'number') by.set(a, [...(by.get(a) ?? []), r.sharingRate]);
  }
  return [...by].map(([a, xs]) => ({ a, ...range(xs) })).sort((x, y) => y.a - x.a);
};
// AI labs: runs where labs proved no lemma have no share and are left out; `lemmas` counts the lemmas behind it.
const ai = (id: string): Point[] => {
  const by = new Map<number, { xs: number[]; lemmas: number }>();
  for (const r of JSON.parse(readFileSync(`results/community/${id}/data.json`, 'utf8')).runs) {
    const a = Number(r.society.replace(/^choose-(off-)?/, '')), st = r.stats;
    if (st.sharedOfChosen === null) continue;
    const e = by.get(a) ?? { xs: [], lemmas: 0 };
    e.xs.push(st.sharedOfChosen); e.lemmas += st.chosen ?? 0; by.set(a, e);
  }
  return [...by].map(([a, e]) => ({ a, ...range(e.xs), lemmas: e.lemmas })).sort((x, y) => y.a - x.a);
};

const lines: { name: string; slot: 1 | 2 | 3; colour?: string; pts: Point[]; what: string }[] = [
  { name: 'AI labs, paid to publish', slot: 2, pts: ai('lean-m3'), what: 'Labs choose (lean-m3): 4 DeepSeek labs, 10 runs per α; a new result earns up to 4 when published (counts from data saved before 2026-11-12 are rebuilt by node scripts/lean-summary.ts)' },
  { name: 'AI labs, not paid', slot: 1, colour: 'var(--ink)', pts: ai('lean-m3-off'), what: 'Labs choose, knowledge reward off (lean-m3-off): the same, with nothing paid for publishing' },
  { name: 'Sim. matched, paid', slot: 3, pts: simulation('lean-tree-choice-matched'), what: 'the simulation set up like Labs choose: the Lean tree, 4 agents, the same reward for publishing; 100 runs per α' },
  { name: 'Sim. matched, not paid', slot: 3, colour: 'var(--s4)', pts: simulation('lean-tree-choice-matched-off'), what: 'the same with no reward for publishing: the prediction for AI labs, not paid; 100 runs per α' },
  { name: 'Sim. identical agents', slot: 3, colour: 'var(--s5)', pts: simulation('simple-ideas-6x8-p2-len3g2-comp0-7-step2-by-alpha-20261025'), what: "the README's step 2: default idea graph, 12 identical agents choosing what to share, fixed budgets (f = 0); 100 runs per α" },
];
const series: Series[] = lines.map((l) => ({ name: l.name, slot: l.slot, colour: l.colour, points: l.pts.map((p) => [p.a, p.m]), ranges: l.pts.map((p) => [p.lo, p.hi]) }));
writeFileSync('docs/figures/beta-by-alpha.svg', lineChart({
  title: 'Share of ideas published at once (β), by α, when agents choose',
  subtitle: 'More flow-back to the right. Mean over runs; bars: 95% ranges. Run at α 1, 0.8, 0.2 (and 0).',
  xLabel: 'α, the share a result keeps', yLabel: 'Published at once (β)', series,
  x: [0, 1], y: [0, 1], xTicks: [1, 0.8, 0.6, 0.4, 0.2, 0], yTicks: [0, 0.25, 0.5, 0.75, 1],
  reverseX: true, markers: true, format: { y: (v) => `${Math.round(v * 100)}%` },
}) + '\n');

const pct = (v: number) => `${Math.round(v * 100)}%`;
const alphas = [...new Set(lines.flatMap((l) => l.pts.map((p) => p.a)))].sort((x, y) => y - x);
console.log(`| α | ${lines.map((l) => l.name).join(' | ')} |`);
console.log(`| --- |${lines.map(() => ' --- |').join('')}`);
for (const a of alphas) console.log(`| ${a} | ${lines.map((l) => { const p = l.pts.find((q) => q.a === a); return p ? `${pct(p.m)} (${pct(p.lo)}–${pct(p.hi)})` : '–'; }).join(' | ')} |`);
console.log('\n' + lines.map((l) => `- ${l.name}: ${l.what}.`).join('\n'));
for (const l of lines.slice(0, 2)) console.log(`${l.name}: ${l.pts.map((p) => `α ${p.a}: ${p.n} runs, ${p.lemmas} lemmas`).join('; ')}`);
