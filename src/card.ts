// One way to present every experiment, of any kind: a short card (question, answer, key numbers,
// design, caveats) and one index of all of them (results/README.md). The design is declared before the
// run; the answer is computed from the declared measure, never written by hand.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { REPORTS_DIR, RESULTS_DIR, ROOT } from './paths.ts';

/** What every experiment declares before it runs. */
export interface Design {
  question: string;
  /** What differs between the rows. */
  compare: string;
  /** What is held the same. */
  fixed: string;
  /** The one main number, and which way is better. */
  measure: string;
  better: 'higher' | 'lower';
  runs: string;
}

export interface Card {
  id: string;
  kind: 'simulation' | 'field report' | 'model pilot' | 'race';
  date: string;
  title: string;
  design: Design;
  /** One sentence, from the declared measure and the two-standard-error rule. */
  answer: string;
  /** A small table: the rows and the measure, plus at most three supporting columns. */
  table: Record<string, string | number>[];
  caveats: string[];
  cost?: string;
  /** Path of the card's own page, from the repository root. */
  page: string;
  /** One comparison chart (an SVG, path from the repository root). */
  chart?: string;
  /** Set when the result must not be used, with the reason. The card stays, marked. */
  invalid?: string;
  /** Search words: model, topic, what was compared. */
  tags?: string[];
  /** Set on an earlier version of a result that a newer one replaces, with why. */
  superseded?: string;
  /** When the run started (ISO time). */
  ranAt?: string;
  /** With every measure judged: one line per measure. */
  answers?: string[];
}

const table = (rows: Record<string, string | number>[]) => {
  if (!rows.length) return '';
  const cols = Object.keys(rows[0]);
  const line = (c: unknown[]) => `| ${c.map((x) => String(x).replace(/\|/g, '\\|')).join(' | ')} |`;
  return [line(cols), line(cols.map(() => '---')), ...rows.map((r) => line(cols.map((c) => r[c])))].join('\n');
};

/** The card as Markdown: short on top, details folded away below. */
export function cardMarkdown(c: Card, details = ''): string {
  return `# ${c.title}
${c.invalid ? `\n**Not valid:** ${c.invalid} Do not use this result.\n` : ''}
**Question:** ${c.design.question}

**Answer:** ${c.answer}
${c.answers?.length ? `\n${c.answers.map((l) => `- ${l}`).join('\n')}\n` : ''}
${c.chart ? `![${c.title}](${relative(dirname(join(ROOT, c.page)), join(ROOT, c.chart)).replace(/\\/g, '/')})\n\n` : ''}${table(c.table)}

**Design** (fixed before the run): compared ${c.design.compare} · held the same: ${c.design.fixed} · measure: ${c.design.measure}${c.design.measure.startsWith('all of') ? '' : `, ${c.design.better} is better`} · ${c.design.runs}.${c.cost ? ` Cost: ${c.cost}.` : ''}

${c.caveats.length ? `**Caveats:**\n${c.caveats.slice(0, 3).map((x) => `- ${x}`).join('\n')}\n` : ''}${details ? `\n<details><summary>Details</summary>\n\n${details}\n\n</details>\n` : ''}`;
}

/** The z for k measures at an overall 5% chance of a false alarm (two-sided, Bonferroni). */
export function barFor(k: number): number {
  // Inverse normal (Acklam's approximation) at 1 − 0.025/k.
  const p = 1 - 0.025 / Math.max(1, k);
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const q = Math.sqrt(-2 * Math.log(1 - p));
  return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
}

/**
 * The answer on every measure at once. The bar for a clear difference is raised with the number of
 * measures (barFor), so looking at all of them does not make a false "clear difference" more likely.
 * Returns one summary sentence and one line per measure.
 */
export function compareAll(rows: { label: string; values: Record<string, number[]> }[], measures: { id: string; name: string; better: 'higher' | 'lower'; fmt?: (x: number) => string }[]): { answer: string; lines: string[] } {
  const z = barFor(measures.length);
  const isTrad = (l: string) => /(^|, )Traditional\b/.test(l);
  const stat = (xs: number[]) => { const n = xs.length, m = xs.reduce((a, b) => a + b, 0) / Math.max(1, n); const sd = Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, n - 1)); return { m, se: n > 1 ? sd / Math.sqrt(n) : Infinity, n }; };
  const per = measures.map((ms) => {
    const st = rows.map((r) => ({ label: r.label, ...stat(r.values[ms.id] ?? []) })).filter((r) => r.n);
    st.sort((a, b) => (ms.better === 'higher' ? b.m - a.m : a.m - b.m));
    return { ms, st };
  }).filter((x) => x.st.length);
  // The best row overall: best (or tied with the best) on the most measures.
  const wins = new Map<string, number>();
  for (const { st } of per) for (const r of st) if (r === st[0] || Math.abs(r.m - st[0].m) <= z * Math.hypot(r.se, st[0].se)) wins.set(r.label, (wins.get(r.label) ?? 0) + 1);
  const best = [...wins.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  const trad = rows.find((r) => isTrad(r.label))?.label;
  const fmt = (ms: (typeof measures)[number], x: number) => (ms.fmt ? ms.fmt(x) : x < 10 ? x.toFixed(2) : x.toFixed(0));
  const better: string[] = [], same: string[] = [], worse: string[] = [];
  const lines = per.map(({ ms, st }) => {
    const b = st.find((r) => r.label === best), t = st.find((r) => r.label === trad);
    if (b && t && best !== trad) {
      const clear = Math.abs(b.m - t.m) > z * Math.hypot(b.se, t.se);
      const ahead = ms.better === 'higher' ? b.m > t.m : b.m < t.m;
      (clear ? (ahead ? better : worse) : same).push(ms.name);
      return `${ms.name}: ${fmt(ms, b.m)} against traditional ${fmt(ms, t.m)}${clear ? (ahead ? ', clearly better' : ', clearly worse') : ', no clear difference'}.`;
    }
    return `${ms.name}: best ${st[0].label}, ${fmt(ms, st[0].m)}.`;
  });
  const list = (xs: string[]) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} and ${xs.at(-1)}` : xs[0] ?? '');
  const answer = best && trad && best !== trad
    ? `Best overall: ${best}. Against traditional${better.length ? `, clearly better on ${list(better)}` : ''}${worse.length ? `${better.length ? ';' : ','} clearly worse on ${list(worse)}` : ''}${same.length ? `${better.length || worse.length ? ';' : ','} no clear difference on ${list(same)}` : ''}. (${per.length} measures; a clear difference is more than ${z.toFixed(1)} standard errors.)`
    : `Best overall: ${best ?? 'none'} (${per.length} measures).`;
  return { answer, lines };
}

export function writeCard(dir: string, c: Card, details = '', file = 'summary.md'): void {
  writeFileSync(join(dir, file), cardMarkdown(c, details));
  writeFileSync(join(dir, 'card.json'), JSON.stringify(c, null, 1) + '\n');
  writeIndex();
}

/**
 * The answer on one measure: the best row, the rows tied with it, and, when there are traditional rows,
 * the best of them, with whether the gap is clear (more than two standard errors).
 */
export function compareRows(rows: { label: string; values: number[] }[], better: 'higher' | 'lower', measure: string, fmt = (x: number) => x.toFixed(1)): string {
  const stat = rows.filter((r) => r.values.length).map((r) => {
    const n = r.values.length, m = r.values.reduce((a, b) => a + b, 0) / n;
    const sd = Math.sqrt(r.values.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, n - 1));
    return { label: r.label, m, se: n > 1 ? sd / Math.sqrt(n) : Infinity };
  }).sort((a, b) => (better === 'higher' ? b.m - a.m : a.m - b.m));
  if (!stat.length) return 'No data.';
  const best = stat[0];
  const clear = (x: typeof best, y: typeof best) => Math.abs(x.m - y.m) > 2 * Math.hypot(x.se, y.se);
  const isTrad = (l: string) => /(^|, )Traditional\b/.test(l);
  const tied = stat.slice(1).filter((r) => !clear(best, r) && !isTrad(r.label)).map((r) => r.label);
  const trad = stat.find((r) => isTrad(r.label));
  let out = `Best: ${best.label}, ${fmt(best.m)}${tied.length ? ` (${tied.length} more tie)` : ''}.`;
  if (trad && trad !== best) out += ` Best traditional: ${trad.label}, ${fmt(trad.m)}. ${clear(best, trad) ? 'Clear difference.' : 'No clear difference.'}`;
  else if (trad === best) out += ' That is traditional.';
  return out;
}

/** Every card in the repository: saved simulations, field reports, model pilots and races. */
export function allCards(): Card[] {
  const out: Card[] = [];
  const read = (f: string) => { try { return JSON.parse(readFileSync(f, 'utf8')) as Card; } catch { return null; } };
  const scan = (dir: string, depth = 2) => {
    if (!existsSync(dir)) return;
    for (const d of readdirSync(dir, { withFileTypes: true })) {
      // Single runs of a series (name-r1, name-r2, …) are summed up in the series' own card.
      if (!d.isDirectory() || d.name.startsWith('stub-') || /-r\d+$/.test(d.name)) continue;
      const f = join(dir, d.name, 'card.json');
      if (existsSync(f)) { const c = read(f); if (c) out.push(c); }
      else if (depth > 1) scan(join(dir, d.name), depth - 1);
    }
  };
  scan(RESULTS_DIR);
  scan(REPORTS_DIR, 2); // reports/<topic>/ and reports/earlier/<topic>/
  return out.sort((a, b) => b.date.localeCompare(a.date) || a.kind.localeCompare(b.kind) || a.title.localeCompare(b.title));
}

/** results/README.md: one line per experiment. */
export function writeIndex(): void {
  const cards = allCards();
  const link = (c: Card) => `[${c.title}](${relative(RESULTS_DIR, join(ROOT, c.page)).replace(/\\/g, '/')})`;
  const rows = cards.map((c) => ({ date: c.date, kind: c.kind, experiment: c.superseded ? `${link(c)} (earlier version)` : link(c), name: `\`${c.id}\``, question: c.design.question, answer: c.invalid ? `Not valid: ${c.invalid}` : c.answer, cost: c.cost ?? '–' }));
  writeFileSync(join(RESULTS_DIR, 'README.md'), `# Experiments

Every experiment in this repository, newest first. Each has a short card: the question, the answer computed from the measure declared before the run, a small table, the design and its caveats. The run-by-run log of saved simulations is [LOG.md](LOG.md).

${table(rows) || 'None yet.'}
`);
}
