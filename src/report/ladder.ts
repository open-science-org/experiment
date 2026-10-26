// Scaling across difficulty: reads a set of budget sweeps (one per difficulty, same societies) and asks how
// the money each society needs grows as problems get harder. Writes results/<id>/summary.md with one chart.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { EXPERIMENTS_DIR, RESULTS_DIR } from '../paths.ts';
import { loadExperiment } from '../experiments/experiment.ts';
import { writeCard } from '../card.ts';

interface Sweep { id: string; title: string; level: string; budgets: number[]; societies: string[]; runs: Record<string, unknown>[] }

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length);
const L = Math.log10;

/** The budget at which a society first reaches `share` of the targets on average, read off in log budget. */
export function budgetFor(points: { budget: number; share: number }[], share: number): number | null {
  const ps = [...points].sort((a, b) => a.budget - b.budget);
  for (let i = 0; i < ps.length; i++) {
    if (ps[i].share >= share) {
      if (i === 0) return ps[0].budget;
      const a = ps[i - 1], b = ps[i], t = (share - a.share) / (b.share - a.share || 1);
      return 10 ** (L(a.budget) + t * (L(b.budget) - L(a.budget)));
    }
  }
  return null;
}

/** Slope of log(value) against log(budget), over budgets where value is above 0 and below 90% of its most. */
export function slopeOf(points: { budget: number; value: number }[]): number | null {
  const top = Math.max(...points.map((p) => p.value));
  const ps = points.filter((p) => p.value > 0 && p.value < 0.9 * top);
  if (ps.length < 2) return null;
  const xs = ps.map((p) => L(p.budget)), ys = ps.map((p) => L(p.value)), mx = mean(xs), my = mean(ys);
  return xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0) / xs.reduce((a, x) => a + (x - mx) ** 2, 0);
}

export function writeLadder(tag: string, order: string[] = [], what = 'difficulty'): string {
  const ids = readdirSync(EXPERIMENTS_DIR).filter((f) => f.endsWith('.yaml')).map((f) => f.slice(0, -5))
    .filter((id) => (loadExperiment(id).tags ?? []).includes(tag) && existsSync(join(RESULTS_DIR, id, 'runs.jsonl')));
  if (!ids.length) throw new Error(`no finished experiments tagged "${tag}"`);
  const sweeps: Sweep[] = ids.map((id) => {
    const spec = loadExperiment(id);
    const level = (spec.tags ?? []).find((t) => t.startsWith('difficulty '))?.slice('difficulty '.length) ?? id;
    const runs = readFileSync(join(RESULTS_DIR, id, 'runs.jsonl'), 'utf8').trim().split('\n').map((l) => JSON.parse(l));
    return { id, title: spec.title, level, budgets: [...new Set(runs.map((r) => Number(r.budget)))].sort((a, b) => a - b), societies: [...new Set(runs.map((r) => String(r.society)))], runs };
  // Named difficulties in the given order; numbered steps ("length growth 3") by their number.
  }).sort((a, b) => (order.includes(a.level) && order.includes(b.level) ? order.indexOf(a.level) - order.indexOf(b.level) : parseFloat(a.level.replace(/^[^\d.]*/, '')) - parseFloat(b.level.replace(/^[^\d.]*/, ''))));
  const societies = sweeps[0].societies;
  // Per difficulty and society: share of targets solved and bounty value, by budget.
  const table = sweeps.map((s) => ({
    level: s.level,
    per: Object.fromEntries(societies.map((so) => {
      const pts = s.budgets.map((b) => { const rs = s.runs.filter((r) => r.society === so && Number(r.budget) === b); return { budget: b, share: mean(rs.map((r) => Number(r.breadth))), value: mean(rs.map((r) => Number(r.value))) }; });
      return [so, { b50: budgetFor(pts, 0.5), b90: budgetFor(pts, 0.9), slope: slopeOf(pts), max: s.budgets.at(-1)! }];
    })),
  }));
  const id = `scaling-across-difficulty-${tag.replace(/[^a-z0-9]+/gi, '-').toLowerCase().replace(/-$/, '')}`;
  const dir = join(RESULTS_DIR, id);
  mkdirSync(join(dir, 'figures'), { recursive: true });
  // The chart: difficulty across, budget to solve half the targets (log) up, one line per society.
  const W = 820, H = 360, l = 70, rgt = 250, tp = 40, bt = 40, pw = W - l - rgt, ph = H - tp - bt;
  const all = table.flatMap((t) => societies.map((so) => t.per[so].b50).filter((x): x is number => x !== null));
  const lo = 10 ** Math.floor(L(Math.min(...all))), hi = 10 ** Math.ceil(L(Math.max(...all, ...table.map((t) => t.per[societies[0]].max))));
  const sx = (i: number) => l + (i / Math.max(1, table.length - 1)) * pw, sy = (v: number) => tp + ph - ((L(v) - L(lo)) / (L(hi) - L(lo))) * ph;
  const colour = (so: string) => (/^Traditional/.test(so) ? '#2a78d6' : /^OSO/.test(so) ? '#eb6834' : '#8a8f98');
  // Lines of the same colour (two OSO rows, say) differ by style: solid first, then dashed, dotted, dash-dot.
  const DASH = ['', '8 4', '2 4', '10 4 2 4'], seenColour = new Map<string, number>();
  const dash = (so: string, _k: number) => { const c = colour(so), n = seenColour.get(c) ?? 0; seenColour.set(c, n + 1); return DASH[n % DASH.length]; };
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" font-family="system-ui, sans-serif"><rect width="${W}" height="${H}" fill="#fff"/><text x="${l}" y="22" font-size="15" font-weight="700" fill="#1f1f1f">Money needed to solve half the targets, by ${what}</text>`;
  for (let e = L(lo); e <= L(hi) + 1e-9; e++) svg += `<line x1="${l}" x2="${l + pw}" y1="${sy(10 ** e)}" y2="${sy(10 ** e)}" stroke="#e6e6e6"/><text x="${l - 8}" y="${sy(10 ** e) + 4}" text-anchor="end" font-size="11" fill="#6b6b6b">${(10 ** e).toLocaleString('en-US')}</text>`;
  table.forEach((t, i) => { svg += `<text x="${sx(i)}" y="${tp + ph + 18}" text-anchor="middle" font-size="12" fill="#2b2b2b">${t.level}</text>`; });
  svg += `<text x="${l + pw / 2}" y="${H - 4}" text-anchor="middle" font-size="11" fill="#6b6b6b">difficulty (budget on a log scale; a missing point: never got there within the sweep)</text>`;
  let k = 0;
  // Grey rows first, so traditional and OSO lines and dots are drawn on top; the legend keeps the original order.
  const drawOrder = [...societies].sort((a, b) => Number(/^Traditional|^OSO/.test(a)) - Number(/^Traditional|^OSO/.test(b)));
  const legendRow = new Map(societies.map((so, j) => [so, j]));
  drawOrder.forEach((so) => {
    const j = legendRow.get(so)!;
    const c = colour(so), ds = dash(so, k++);
    const pts = table.map((t, i) => [i, t.per[so].b50] as const).filter(([, v]) => v !== null) as [number, number][];
    svg += `<path d="${pts.map(([i, v], n) => `${n ? 'L' : 'M'}${sx(i).toFixed(1)} ${sy(v).toFixed(1)}`).join(' ')}" fill="none" stroke="${c}" stroke-width="2.6"${ds ? ` stroke-dasharray="${ds}"` : ''}/>`;
    for (const [i, v] of pts) svg += `<circle cx="${sx(i)}" cy="${sy(v)}" r="4.5" fill="${c}" stroke="#fff" stroke-width="1.2"/>`;
    const ly = tp + 14 + j * 20;
    svg += `<line x1="${l + pw + 14}" x2="${l + pw + 38}" y1="${ly - 4}" y2="${ly - 4}" stroke="${c}" stroke-width="2.6"${ds ? ` stroke-dasharray="${ds}"` : ''}/><text x="${l + pw + 44}" y="${ly}" font-size="12" font-weight="700" fill="${c}">${so}</text>`;
  });
  writeFileSync(join(dir, 'figures', 'compare.svg'), svg + '</svg>');
  const trad = societies.find((so) => /^Traditional/.test(so)), oso = societies.find((so) => /^OSO/.test(so));
  const fmt = (v: number | null, max: number) => (v === null ? `> ${max.toLocaleString('en-US')}` : Math.round(v).toLocaleString('en-US'));
  const rows = table.map((t) => ({
    difficulty: t.level,
    ...Object.fromEntries(societies.map((so) => [so, fmt(t.per[so].b50, t.per[so].max)])),
    'traditional ÷ OSO': trad && oso && t.per[oso].b50 ? (t.per[trad].b50 ? `${(t.per[trad].b50! / t.per[oso].b50!).toFixed(1)}×` : `> ${(t.per[trad].max / t.per[oso].b50!).toFixed(0)}×`) : '–',
  }));
  const ratios = table.map((t) => (trad && oso && t.per[trad].b50 && t.per[oso].b50 ? t.per[trad].b50! / t.per[oso].b50! : null));
  const known = ratios.filter((x): x is number => x !== null);
  const answer = trad && oso
    ? `To solve half the targets, traditional needs ${known.length ? `${Math.min(...known).toFixed(1)}× to ${Math.max(...known).toFixed(1)}×` : 'far more than'} the money OSO needs${ratios.some((x) => x === null) ? `, and on ${ratios.filter((x) => x === null).length} of the hardest graphs it never gets there within the sweep` : ''}. ${known.length > 1 ? (known.every((x, i) => i === 0 || x >= known[i - 1]) ? 'The gap grows with every step in difficulty.' : `By difficulty: ${table.map((t, i) => `${t.level} ${ratios[i] === null ? 'not reached' : `${ratios[i]!.toFixed(1)}×`}`).join(', ')}.`) : ''}`
    : 'See the table.';
  const slopes = table.map((t) => ({ difficulty: t.level, ...Object.fromEntries(societies.map((so) => [so, t.per[so].slope === null ? '–' : t.per[so].slope!.toFixed(2)])) }));
  const md = (rs: Record<string, string>[]) => [`| ${Object.keys(rs[0]).join(' | ')} |`, `| ${Object.keys(rs[0]).map(() => '---').join(' | ')} |`, ...rs.map((r) => `| ${Object.values(r).join(' | ')} |`)].join('\n');
  writeCard(dir, {
    id, kind: 'simulation', date: new Date().toISOString().slice(0, 10), ranAt: new Date().toISOString(),
    title: what === 'difficulty' ? 'Scaling across difficulty' : what.startsWith('difficulty') ? `Scaling across ${what}` : what.includes(',') ? `Scaling across ${what}` : `Scaling as ${what} changes`,
    design: { question: what === 'difficulty' ? 'As problems get harder, how much more money does each society need, and does the gap between traditional and OSO grow?' : what.includes(',') ? `Across ${what}, how much money does each society need, and does the gap between traditional and OSO grow?` : `As ${what} changes (everything else as the default graph), how much money does each society need, and does the gap between traditional and OSO grow?`, compare: `${societies.length} societies on ${table.length} difficulties (${table.map((t) => t.level).join(', ')})`, fixed: 'the simple model: 12 identical agents, equal money each round, a knowledge reward of 1 per new bit, no validation', measure: 'money needed to solve half the targets', better: 'lower', runs: `from the sweeps tagged "${tag}"` },
    answer, table: rows, caveats: ['Read off between the two budgets that bracket half the targets, in log budget.', 'Each difficulty has its own budget range; "> x" means not reached within it.'],
    page: `results/${id}/summary.md`, chart: `results/${id}/figures/compare.svg`, tags: ['scaling', 'scaling law', 'difficulty', tag, 'meta-analysis'],
    basedOn: sweeps.map((s) => ({ id: s.id, title: s.title })),
  }, `**Log–log slope of bounty value against budget** (where value is above 0 and below 90% of its most; a slope of 1 means value grows in proportion to money):\n\n${md(slopes)}`);
  return dir;
}
