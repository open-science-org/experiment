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

${c.chart ? `![${c.title}](${relative(dirname(join(ROOT, c.page)), join(ROOT, c.chart)).replace(/\\/g, '/')})\n\n` : ''}${table(c.table)}

**Design** (fixed before the run): compared ${c.design.compare} · held the same: ${c.design.fixed} · measure: ${c.design.measure}, ${c.design.better} is better · ${c.design.runs}.${c.cost ? ` Cost: ${c.cost}.` : ''}

${c.caveats.length ? `**Caveats:**\n${c.caveats.slice(0, 3).map((x) => `- ${x}`).join('\n')}\n` : ''}${details ? `\n<details><summary>Details</summary>\n\n${details}\n\n</details>\n` : ''}`;
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
      if (!d.isDirectory() || d.name.startsWith('stub-')) continue;
      const f = join(dir, d.name, 'card.json');
      if (existsSync(f)) { const c = read(f); if (c) out.push(c); }
      else if (depth > 1) scan(join(dir, d.name), depth - 1);
    }
  };
  scan(RESULTS_DIR);
  scan(REPORTS_DIR, 1);
  return out.sort((a, b) => b.date.localeCompare(a.date) || a.kind.localeCompare(b.kind) || a.title.localeCompare(b.title));
}

/** results/README.md: one line per experiment. */
export function writeIndex(): void {
  const cards = allCards();
  const link = (c: Card) => `[${c.title}](${relative(RESULTS_DIR, join(ROOT, c.page)).replace(/\\/g, '/')})`;
  const rows = cards.map((c) => ({ date: c.date, kind: c.kind, experiment: link(c), question: c.design.question, answer: c.invalid ? `Not valid: ${c.invalid}` : c.answer, cost: c.cost ?? '–' }));
  writeFileSync(join(RESULTS_DIR, 'README.md'), `# Experiments

Every experiment in this repository, newest first. Each has a short card: the question, the answer computed from the measure declared before the run, a small table, the design and its caveats. The run-by-run log of saved simulations is [LOG.md](LOG.md).

${table(rows) || 'None yet.'}
`);
}
