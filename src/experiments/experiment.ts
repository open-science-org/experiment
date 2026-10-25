// Experiments: a base scenario plus factors whose combinations become the rows of a table
// (docs/simulator.md, "Configuration"). Analyses that build their own table are plugins.
import { hiddenDepth, sharedDepth } from './analytic.ts';
import { expandPaths, getPath, loadScenario, merge, readConfigFile, type Scenario } from '../engine/config.ts';
import { COLUMNS, fmt, mean, mse, type RunResult } from '../engine/measures.ts';
import { run } from '../engine/model.ts';

/** A level of a factor: a label, and overrides (inline, or a preset from config/presets.yaml). */
export interface Level {
  label: string | number;
  set?: Record<string, unknown>;
  preset?: string;
}

export type Factor =
  | { name: string; levels: Level[] }
  | { name: string; path: string; values: unknown[] };

export interface ExperimentSpec {
  id: string;
  title: string;
  description: string;
  seeds: number;
  firstSeed?: number;
  /** Base scenario: `default`, a name in config/scenarios/, or a path. */
  scenario?: string;
  /** Overrides for every row (dotted paths allowed). */
  set?: Record<string, unknown>;
  factors?: Factor[];
  /** Overrides applied to rows whose settings match `when`. */
  patches?: { when: Record<string, unknown>; set: Record<string, unknown> }[];
  /** Rows to leave out, by matching settings. */
  exclude?: Record<string, unknown>[];
  /** Columns of the table (see COLUMNS in measures.ts). */
  columns?: string[];
  /** An analysis that builds its own table instead (see `analyses`). */
  analysis?: string;
  /** Declared before running: the question, what differs and what is held the same, the main measure (a column id) and which way is better, and known caveats. */
  question?: string;
  compare?: string;
  fixed?: string;
  measure?: string;
  better?: 'higher' | 'lower';
  caveats?: string[];
  /** Search words shown on the card: model, topic, what was compared. */
  tags?: string[];
}

export interface Row {
  labels: Record<string, string | number>;
  patch: Record<string, unknown>;
  scenario: Scenario;
}

export interface Output {
  config: unknown;
  table: Record<string, string | number>[];
  runs: Record<string, unknown>[];
  /** The expanded rows and every run's full result, for reports (not written by --save). */
  rows: Row[];
  results: RunResult[][];
}

const SPEC_KEYS = ['id', 'title', 'description', 'seeds', 'firstSeed', 'scenario', 'set', 'factors', 'patches', 'exclude', 'columns', 'analysis', 'question', 'compare', 'fixed', 'measure', 'better', 'caveats', 'tags'];

let presetCache: Record<string, Record<string, unknown>> | null = null;
export function preset(name: string): Record<string, unknown> {
  presetCache ??= readConfigFile('config/presets.yaml') as Record<string, Record<string, unknown>>;
  const p = presetCache[name];
  if (!p) throw new Error(`unknown preset "${name}" (known: ${Object.keys(presetCache).join(', ')})`);
  return p;
}

export function loadExperiment(fileOrId: string): ExperimentSpec {
  const file = fileOrId.includes('/') || fileOrId.includes('.') ? fileOrId : `config/experiments/${fileOrId}.yaml`;
  const spec = readConfigFile(file) as ExperimentSpec;
  const unknown = Object.keys(spec).filter((k) => !SPEC_KEYS.includes(k));
  if (unknown.length) throw new Error(`${file}: unknown key ${unknown.join(', ')}`);
  for (const k of ['id', 'title', 'description', 'seeds'] as const) if (spec[k] === undefined) throw new Error(`${file}: missing "${k}"`);
  return spec;
}

const matches = (sc: Scenario, when: Record<string, unknown>) =>
  Object.entries(when).every(([path, v]) => JSON.stringify(getPath(sc, path)) === JSON.stringify(v));

/** Expands the factors into rows: every combination of levels, first factor outermost. */
export function expand(spec: ExperimentSpec): Row[] {
  let combos: { labels: Record<string, string | number>; patch: Record<string, unknown> }[] = [{ labels: {}, patch: {} }];
  for (const f of spec.factors ?? []) {
    const levels: { label: string | number; patch: Record<string, unknown> }[] = 'levels' in f
      ? f.levels.map((l) => ({ label: l.label, patch: merge(l.preset ? preset(l.preset) : {}, expandPaths(l.set ?? {})) }))
      : f.values.map((v) => ({ label: typeof v === 'number' || typeof v === 'string' ? v : JSON.stringify(v), patch: expandPaths({ [f.path]: v }) }));
    combos = combos.flatMap((c) => levels.map((l) => ({ labels: { ...c.labels, [f.name]: l.label }, patch: merge(c.patch, l.patch) })));
  }
  const rows: Row[] = [];
  for (const c of combos) {
    let scenario = loadScenario(spec.scenario ?? null, spec.set ?? {}, c.patch);
    if ((spec.exclude ?? []).some((e) => matches(scenario, e))) continue;
    let patch = c.patch;
    for (const p of spec.patches ?? []) {
      if (matches(scenario, p.when)) {
        patch = merge(patch, expandPaths(p.set));
        scenario = loadScenario(spec.scenario ?? null, spec.set ?? {}, patch);
      }
    }
    rows.push({ labels: c.labels, patch, scenario });
  }
  return rows;
}

/** How progress is kept per run: 21 evenly spaced points of the budget (0, 5%, …, 100%). */
export const PROGRESS_POINTS = 21;
export const PROGRESS = ['level', 'value', 'published', 'targets', 'knowledge', 'knowledgePublished'] as const;

/**
 * A run record without the full curve. Progress (hardest level, bounty value, ideas published, targets
 * solved) is kept at 21 points of the budget, the same for every run, so runs can be averaged point by
 * point; a run that stopped early keeps its final values.
 */
function record(r: RunResult, extra: Record<string, unknown>, budget: number) {
  const { curve, ...rest } = r;
  const at = (x: number) => curve.filter((c) => c.spend <= x + 1e-9).at(-1);
  const points = Array.from({ length: PROGRESS_POINTS }, (_, k) => at((budget * k) / (PROGRESS_POINTS - 1)));
  const progress = Object.fromEntries(PROGRESS.map((v) => [v, points.map((c) => c?.[v] ?? 0)]));
  return { ...extra, ...rest, progress, frontierAtSpend: Array.from({ length: 11 }, (_, k) => at((budget * k) / 10)?.level ?? 0) };
}

type Analysis = (spec: ExperimentSpec, rows: Row[], results: RunResult[][]) => Output['table'];

/** Analyses that replace the default table. */
export const analyses: Record<string, Analysis> = {
  /** The simple model against its exact predictions (factors: N, and progress = shared or hidden). */
  'simple-chain-exact': (_spec, rows, results) => {
    const table: Output['table'] = [];
    const byN = new Map<number, { shared?: number[]; hidden?: number[]; X: number; p: number }>();
    rows.forEach((row, k) => {
      const N = Number(row.labels.N);
      const entry = byN.get(N) ?? { X: row.scenario.budget.X, p: row.scenario.success.p0 };
      entry[String(row.labels.progress) as 'shared' | 'hidden'] = results[k].map((r) => r.deepestProved);
      byN.set(N, entry);
    });
    for (const [N, e] of byN) {
      const exactS = sharedDepth(e.X, e.p).mean;
      const exactH = hiddenDepth(e.X, e.p, N).mean;
      table.push({
        N,
        'shared: simulated': mse(e.shared ?? [], 1),
        'shared: exact': fmt(exactS, 1),
        'hidden: simulated': mse(e.hidden ?? [], 1),
        'hidden: exact': fmt(exactH, 1),
        'gain: simulated': fmt(mean(e.shared ?? []) / mean(e.hidden ?? [])),
        'gain: exact': fmt(exactS / exactH),
      });
    }
    return table;
  },
};

/** The outcome measures every result is judged on when no single main measure is declared. */
export const OUTCOMES: { id: string; name: string; better: 'higher' | 'lower' }[] = [
  { id: 'frontier', name: 'hardest level', better: 'higher' },
  { id: 'targetsSolved', name: 'targets solved', better: 'higher' },
  { id: 'value', name: 'bounty value', better: 'higher' },
  { id: 'roi', name: 'ROI', better: 'higher' },
  { id: 'knowledge', name: 'knowledge found (bits)', better: 'higher' },
  { id: 'knowledgePerMoney', name: 'knowledge per unit of money', better: 'higher' },
  { id: 'cost', name: 'money to the main level', better: 'lower' },
  { id: 'waste', name: 'waste', better: 'lower' },
];

/** The columns, with ROI added when missing. */
export const withRoi = (cols: string[]) => (cols.includes('roi') ? cols : [...cols, 'roi']);

export const DEFAULT_COLUMNS = ['frontier', 'reachTarget', 'speed', 'cost', 'roi', 'knowledge', 'knowledgePerMoney', 'spend', 'productivity', 'breadth', 'waste', 'credit', 'sharing', 'hoarded'];

export function runExperiment(spec: ExperimentSpec, seeds = spec.seeds, onRow?: (done: number, of: number) => void): Output {
  const rows = expand(spec);
  const first = spec.firstSeed ?? 1;
  const results = rows.map((row, i) => { const rs = Array.from({ length: seeds }, (_, k) => run(row.scenario, first + k)); onRow?.(i + 1, rows.length); return rs; });
  const runs = rows.flatMap((row, i) => results[i].map((r, k) => record(r, { ...row.labels, seed: first + k }, row.scenario.budget.X)));
  let table: Output['table'];
  if (spec.analysis) {
    const a = analyses[spec.analysis];
    if (!a) throw new Error(`unknown analysis "${spec.analysis}" (known: ${Object.keys(analyses).join(', ')})`);
    table = a(spec, rows, results);
  } else {
    // Every result reports its return on the money (ROI), whatever else it lists.
    const cols = withRoi(spec.columns ?? DEFAULT_COLUMNS);
    for (const c of cols) if (!COLUMNS[c]) throw new Error(`unknown column "${c}" (known: ${Object.keys(COLUMNS).join(', ')})`);
    table = rows.map((row, i) => ({
      ...row.labels,
      ...Object.fromEntries(cols.map((c) => [COLUMNS[c].header(row.scenario), COLUMNS[c].value(results[i], row.scenario)])),
    }));
  }
  const base = loadScenario(spec.scenario ?? null, spec.set ?? {});
  return { config: { experiment: spec, base, rows: rows.map((r) => ({ labels: r.labels, overrides: r.patch })) }, table, runs, rows, results };
}
