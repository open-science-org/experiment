// The README's results plots, drawn from saved results (npm run sim -- summary-figures). Rebuild them after
// rerunning the results they read; each plot names its source below.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, RESULTS_DIR } from '../paths.ts';
import { barChart, lineChart, type Series } from './figures.ts';

const OUT = join(ROOT, 'docs', 'figures');

/** The saved result whose id matches, newest name first (ids end in a date). */
const resultId = (match: RegExp) => readdirSync(RESULTS_DIR).filter((d) => match.test(d) && existsSync(join(RESULTS_DIR, d, 'runs.jsonl'))).sort().at(-1);
const runsOf = (id: string) => readFileSync(join(RESULTS_DIR, id, 'runs.jsonl'), 'utf8').trim().split('\n').map((l) => JSON.parse(l) as Record<string, unknown>);
const cardOf = (id: string) => JSON.parse(readFileSync(join(RESULTS_DIR, id, 'card.json'), 'utf8')) as { table: Record<string, string>[] };
const num = (s: string) => Number(String(s).replace(/[,×>\s]/g, ''));

/** Mean of a measure by α for "Agents choose, α = a" rows, and the traditional row's mean. */
function byAlpha(id: string, measure: string) {
  const sums = new Map<string, { n: number; t: number }>();
  for (const r of runsOf(id)) {
    const k = String(r.society), v = Number(r[measure]);
    const e = sums.get(k) ?? { n: 0, t: 0 };
    e.n++; e.t += v; sums.set(k, e);
  }
  const points: [number, number][] = [];
  let traditional = 0;
  for (const [k, e] of sums) {
    const a = /^Agents choose, α = ([\d.]+)$/.exec(k);
    if (a) points.push([Number(a[1]), e.t / e.n]);
    else if (/^Traditional/.test(k)) traditional = e.t / e.n;
  }
  return { points: points.sort((x, y) => y[0] - x[0]), traditional };
}

export function writeSummaryFigures(): string[] {
  mkdirSync(OUT, { recursive: true });
  const written: string[] = [];
  const save = (name: string, svg: string) => { writeFileSync(join(OUT, name), svg); written.push(`docs/figures/${name}`); };

  // 1–2. Agents choosing what to share: share published and targets solved, by α (step 2 and step 5).
  const s2 = resultId(/step2-by-alpha/), s5 = resultId(/step5-by-alpha/);
  if (s2 && s5) {
    for (const [file, measure, title, yLabel, yMax, fmt] of [
      ['sharing-by-alpha.svg', 'sharingRate', 'When agents choose, flow-back makes them share', 'share of ideas published at once', 1, (v: number) => `${Math.round(v * 100)}%`],
      ['targets-by-alpha.svg', 'targetsSolved', 'Targets solved when agents choose what to share', 'targets solved (of 2)', 2, (v: number) => v.toFixed(1)],
    ] as const) {
      const a = byAlpha(s2, measure), b = byAlpha(s5, measure);
      const series: Series[] = [
        { name: 'Step 2: agents choose', slot: 2, points: a.points },
        { name: 'Step 5: full model', slot: 3, points: b.points },
        { name: 'Traditional', slot: 1, points: [[1, a.traditional], [0, a.traditional]] },
      ];
      save(file, lineChart({
        title, subtitle: 'Default idea graph, 12 agents, same money; 100 runs per point',
        xLabel: 'α: 1 = nothing flows back, 0 = all flows back', yLabel, series,
        x: [0, 1], y: [0, yMax], reverseX: true, markers: true,
        xTicks: [1, 0.8, 0.6, 0.4, 0.2, 0], yTicks: [0, 0.25, 0.5, 0.75, 1].map((t) => t * yMax),
        format: { y: fmt },
      }));
    }
  }

  // 3. The money gap across difficulty (the scaling ladder).
  const ladder = 'scaling-across-difficulty-scaling-ladder-2026-10-24';
  if (existsSync(join(RESULTS_DIR, ladder, 'card.json'))) {
    const rows = cardOf(ladder).table;
    save('money-gap-by-difficulty.svg', barChart({
      title: 'Traditional needs this many times the money OSO needs',
      bars: rows.map((r) => ({ label: r.difficulty, value: num(r['traditional ÷ OSO']), slot: 1 as const })),
      format: (v) => `${v.toFixed(1)}×`,
    }));
  }

  // 4. The money gap by depth (each step equally hard), against the number of agents.
  const deep = 'scaling-across-difficulty-deep-graph-2026-10-25';
  if (existsSync(join(RESULTS_DIR, deep, 'card.json'))) {
    const rows = cardOf(deep).table.map((r) => [Math.log2(num(r.difficulty.replace('depth', ''))), num(r['traditional ÷ OSO'])] as [number, number]);
    const x: [number, number] = [rows[0][0], rows.at(-1)![0]];
    save('money-gap-by-depth.svg', lineChart({
      title: 'The gap grows with depth', subtitle: 'Money to solve half the targets, traditional ÷ OSO; each step equally hard',
      xLabel: 'Depth (levels, log scale)', yLabel: 'traditional ÷ OSO',
      series: [
        { name: 'Traditional ÷ OSO', slot: 1, points: rows },
        { name: '12 agents, each alone', slot: 3, points: [[x[0], 12], [x[1], 12]] },
      ],
      x, y: [0, 15], markers: true,
      xTicks: rows.map((r) => r[0]), yTicks: [0, 3, 6, 9, 12, 15],
      format: { x: (v) => String(Math.round(2 ** v)), y: (v) => `${Number.isInteger(v) ? v : v.toFixed(1)}×` },
    }));
  }
  // 5. Lab size: money ÷ field-wide OSO by the number of separate labs (24 agents), on two graphs.
  const labs = 'scaling-across-difficulty-lab-size-2026-10-28';
  if (existsSync(join(RESULTS_DIR, labs, 'card.json'))) {
    // One line per direction of difficulty, shaded light (deeper ideas easier) to dark (deeper ideas much harder).
    const rows = cardOf(labs).table.map((r) => ({ r, g: num(r.difficulty.replace('growth', '')) })).sort((a, b) => a.g - b.g);
    const SHADES = ['#a9cbf2', '#7fb0ea', '#5592dc', '#2a78d6', '#1d5aa8', '#103d78'];
    const series: Series[] = rows.map(({ r, g }, j) => {
      const oso = num(r['OSO (α = 0.8, β = 1)']);
      const points = Object.entries(r).flatMap(([k, v]) => {
        const size = /^Traditional.*alone$/.test(k) ? 1 : Number(/^Labs of (\d+)/.exec(k)?.[1] ?? NaN);
        return Number.isFinite(size) && num(v) > 0 ? [[Math.log2(24 / size), num(v) / oso] as [number, number]] : [];
      }).sort((a, b) => a[0] - b[0]);
      return { name: g > 0 ? `+${g}` : String(g).replace('-', '−'), slot: 1, colour: SHADES[Math.round((j * (SHADES.length - 1)) / Math.max(1, rows.length - 1))], points };
    });
    series.push({ name: 'OSO', slot: 2, points: [[0, 1], [Math.log2(24), 1]] });
    const ticks = [1, 2, 3, 4, 6, 8, 12, 24];
    const most = Math.max(...series.flatMap((x) => x.points.map((p) => p[1]))), step = most > 12 ? 4 : 2, top = Math.ceil(most / step) * step;
    save('money-by-lab-size.svg', lineChart({
      title: 'The more separate labs, the more money', subtitle: '24 agents in labs that share inside only. Lines: bits added per level (light: deeper easier; dark: much harder)',
      xLabel: 'Number of separate labs (24 ÷ lab size; log scale)', yLabel: 'money to solve half the targets ÷ OSO',
      series, x: [0, Math.log2(24)], y: [0, top], markers: true,
      xTicks: ticks.map((t) => Math.log2(t)), yTicks: Array.from({ length: top / step + 1 }, (_, k) => k * step),
      format: { x: (v) => String(Math.round(2 ** v)), y: (v) => `${Number.isInteger(v) ? v : v.toFixed(1)}×` },
    }));
  }
  return written;
}
