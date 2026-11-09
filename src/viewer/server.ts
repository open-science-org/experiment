// The experiment viewer: `npm run viewer`, then open http://127.0.0.1:8791.
// Plays back simulated runs round by round (traced on demand), and Lean pilot runs, live or after the
// fact. It listens on this machine only: pilot transcripts contain proofs, which are private.
import { MODEL_HISTORY, MODEL_VERSION } from '../engine/version.ts';
import { createServer } from 'node:http';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, normalize, relative } from 'node:path';
import { marked } from 'marked';
import katex from 'katex';
import { ROOT, REPORTS_DIR, RESULTS_DIR } from '../paths.ts';
import { loadScenario, expandPaths } from '../engine/config.ts';
import { traceRun } from '../engine/model.ts';
import { expand, loadExperiment, OUTCOMES, PROGRESS, PROGRESS_POINTS, preset } from '../experiments/experiment.ts';
import { MEASURE_NAMES, VALUES } from '../engine/measures.ts';
import { loadSpace, spaceIds, withCalibratedBudget, type Space } from '../spaces/spaces.ts';
import { AREAS, LEAN_DIR, PLAIN, definitions, leanAvailable, loadTasks, type Problems } from '../lean/tasks.ts';
import * as design from './design.ts';
import { Community, LEAN_REWARDS, firstProofs, moneyByRound, progress, type CommunityResult } from '../lean/community.ts';
import { SOCIETIES, osoLabel, osoParams, societyOptions } from '../lean/societies.ts';
import { experimentName, isTest } from '../lean/names.ts';
import { creditLeft, keyUsage } from '../lean/agent.ts';
import { allCards } from '../card.ts';

const PORT = Number(process.env.PORT ?? 8791);
/** Folders the viewer may serve files and documents from. Never lean/ (private) or .env. */
const PUBLIC_DIRS = ['reports', 'results', 'docs', 'worlds', 'config', 'spaces'];
/** Single public files outside those folders. Nothing else in lean/ is served: its private parts hold proofs. */
const PUBLIC_FILES = ['README.md', 'lean/README.md', 'lean/Problems/Defs.lean', 'lean/Problems/Targets.lean'];
const TYPES: Record<string, string> = { '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.md': 'text/plain; charset=utf-8', '.yaml': 'text/plain; charset=utf-8', '.jsonl': 'text/plain; charset=utf-8', '.py': 'text/plain; charset=utf-8', '.lean': 'text/plain; charset=utf-8' };

/** A repository path, if it is inside a public folder. */
/** The roadmap lives in the local notes, beside this repository; the app reads that one file and nothing else there. */
const ROADMAP = join(ROOT, '..', 'notes', 'roadmap.md');
function publicPath(path: string): string | null {
  const rel = normalize(path).replace(/^(\.\.\/)+/, '');
  if (rel === 'notes/roadmap.md') return existsSync(ROADMAP) ? ROADMAP : null;
  if (rel.startsWith('/') || rel.includes('..') || !(PUBLIC_DIRS.includes(rel.split('/')[0]) || PUBLIC_FILES.includes(rel))) return null;
  const full = join(ROOT, rel);
  return existsSync(full) ? full : null;
}

// Raw HTML in a document: comments and the few tags our documents use are kept; anything else is shown as text.
const SAFE_HTML = new marked.Renderer();
SAFE_HTML.html = ({ text }: { text: string }) => {
  const tags = [...text.replace(/<!--[\s\S]*?-->/g, '').matchAll(/<\/?([a-zA-Z][\w-]*)/g)].map((m) => m[1].toLowerCase());
  const safe = tags.every((t) => ['details', 'summary', 'img', 'br', 'sub', 'sup'].includes(t)) && !/\son\w+\s*=|javascript:/i.test(text);
  return safe ? text : text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

/** A Markdown document rendered to HTML, with images and links pointing back into the viewer. */
function doc(path: string): { path: string; title: string; html: string } {
  const full = publicPath(path);
  if (!full || !full.endsWith('.md')) throw new Error(`no such document: ${path}`);
  let md = readFileSync(full, 'utf8');
  const base = dirname(relative(ROOT, full));
  // Documents that start with <!-- math --> have $…$ and $$…$$ maths (as on GitHub), rendered here with KaTeX.
  const maths: string[] = [];
  if (md.startsWith('<!-- math -->')) {
    const keep = (tex: string, display: boolean) => {
      maths.push(katex.renderToString(tex.trim(), { displayMode: display, throwOnError: false, output: 'html' }));
      return `MATH${maths.length - 1}END`;
    };
    md = md.replace(/^\$\$([\s\S]+?)\$\$$/gm, (_, t) => keep(t, true)).replace(/\$([^$\n]+?)\$/g, (_, t) => keep(t, false));
  }
  const resolve = (href: string) => normalize(join(base, href));
  let html = marked.parse(md, { async: false, renderer: SAFE_HTML }) as string;
  html = html.replace(/(href|src)="\s*(?:javascript|vbscript|data):[^"]*"/gi, '$1="#"');
  html = html.replace(/MATH(\d+)END/g, (_, k) => maths[Number(k)]);
  html = html.replace(/(src|href)="([^"#:]+?)(#[^"]*)?"/g, (m, attr, href, hash = '') => {
    if (/^(https?:|mailto:|\/)/.test(href)) return m;
    const target = resolve(href);
    // Code and other files outside the public folders: open them on GitHub, where the repository is public.
    if (!publicPath(target)) return attr === 'href' && existsSync(join(ROOT, target)) ? `href="https://github.com/open-science-org/experiment/${statSync(join(ROOT, target)).isDirectory() ? 'tree' : 'blob'}/master/${target}${hash}"` : `${attr}="#" data-missing="${target}"`;
    if (attr === 'href' && target.endsWith('.md')) return `href="#/doc/${target}${hash ? `?at=${hash.slice(1)}` : ''}"`;
    return `${attr}="/files/${target}${hash}"`;
  });
  html = html.replace(/<a href="(https?:[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener"');
  return { path: relative(ROOT, full), title: /^# (.+)$/m.exec(md)?.[1] ?? path, html };
}

/** Headline numbers of every field's report, for the overview. */
function overview() {
  const ids = new Set(spaceIds());
  const fields = existsSync(REPORTS_DIR) ? readdirSync(REPORTS_DIR).filter((d) => ids.has(d) && existsSync(join(REPORTS_DIR, d, 'data.json')))
    .map((d) => JSON.parse(readFileSync(join(REPORTS_DIR, d, 'data.json'), 'utf8')).headline) : [];
  const pilotDir = join(RESULTS_DIR, 'pilot');
  const pilot = existsSync(pilotDir) ? readdirSync(pilotDir).filter((d) => !d.startsWith('stub-') && existsSync(join(pilotDir, d, 'summary.md')))
    .map((d) => ({ id: d, title: (/^# (.+)$/m.exec(readFileSync(join(pilotDir, d, 'summary.md'), 'utf8'))?.[1] ?? d).replace(/^Lean pilot: /, ''), modified: statSync(join(pilotDir, d, 'summary.md')).mtimeMs })) : [];
  const experiments = readdirSync(RESULTS_DIR).filter((d) => existsSync(join(RESULTS_DIR, d, 'summary.md')))
    .map((d) => ({ id: d, title: (/^# (.+)$/m.exec(readFileSync(join(RESULTS_DIR, d, 'summary.md'), 'utf8'))?.[1] ?? d) }));
  const comparison = pilot.filter((p) => p.id.startsWith('panel-20')).sort((a, b) => b.modified - a.modified)[0];
  const comparisonData = comparison && existsSync(join(pilotDir, comparison.id, 'data.json')) ? JSON.parse(readFileSync(join(pilotDir, comparison.id, 'data.json'), 'utf8')) : null;
  return { fields, pilot: pilot.sort((a, b) => b.modified - a.modified), experiments, comparison: comparison ? doc(`results/pilot/${comparison.id}/summary.md`) : null, comparisonData, comparisonPath: comparison ? `results/pilot/${comparison.id}/summary.md` : null, cards: allCards() };
}
const PAGE = new URL('./index.html', import.meta.url).pathname;
const SETTINGS: Record<string, string> = { traditional: 'Traditional', oso: 'OSO (immediate)', osoChoice: 'OSO (choice)', creditOnly: 'Flow-back, finished-only', sharingOnly: 'No flow-back, immediate', traditionalChoice: 'No flow-back, choice' };

const spaces = new Map<string, Space>();
function space(id: string): Space {
  if (!spaces.has(id)) spaces.set(id, withCalibratedBudget(loadSpace(id)).space);
  return spaces.get(id)!;
}

/** What the page needs to replay one traced run. */
function replayOf(sc: ReturnType<typeof loadScenario>, seed: number, label: string, title: string) {
  const t = traceRun(sc, seed);
  const w = t.world;
  return {
    space: { id: '', title, glossary: null, areas: [] },
    setting: { id: label, label }, seed,
    budget: { X: sc.budget.X, rounds: sc.budget.rounds },
    world: { n: w.n, levels: w.levels, level: w.level, area: w.area, prereqs: w.prereqs, isTarget: w.isTarget, bounty: w.bounty, deadEnd: w.deadEnd, names: w.names ?? null, p: w.p, bits: w.bits ?? null, tosses: w.tosses ?? null },
    agents: t.agents.map((a) => ({ id: a.id, archetype: a.archetype })),
    events: t.events,
    result: { frontier: t.result.frontier, targetsSolved: t.result.targetsSolved, spend: t.result.spend, sharing: t.result.sharingRate },
  };
}

/**
 * A saved result's numbers for the interactive charts: each row's mean and spread on every measure, and,
 * for runs that record it, how hardest level, bounty value, ideas published and targets solved grew with
 * money spent (mean over runs at 21 points of the budget).
 */
function resultData(id: string) {
  if (!/^[\w.-]+$/.test(id) || !existsSync(join(ROOT, 'config', 'experiments', `${id}.yaml`)) || !existsSync(join(RESULTS_DIR, id, 'runs.jsonl'))) return { ok: false };
  const spec = loadExperiment(id);
  // An experiment with its own analysis (the one-chain check) answers with its own table, not these charts.
  if (spec.analysis) return { ok: false };
  const rows = expand(spec);
  const keys = Object.keys(rows[0]?.labels ?? {});
  const label = (labels: Record<string, unknown>) => keys.map((k) => (typeof labels[k] === 'number' ? `${k.split(',')[0]} ${labels[k]}` : String(labels[k]).replace(/^OSO \(immediate\)$/, 'OSO'))).join(', ') || 'all';
  const runs = jsonl(join(RESULTS_DIR, id, 'runs.jsonl'));
  const groups = rows.map((r) => runs.filter((x) => keys.every((k) => x[k] === r.labels[k])));
  const measures = [...OUTCOMES.map((m) => m.id), 'knowledgePublished', 'sharing', 'reachTarget', 'speed', 'duplicates', 'credit'].filter((m) => VALUES[m]);
  const better = Object.fromEntries(OUTCOMES.map((m) => [m.id, m.better]));
  const stat = (xs: number[]) => { const n = xs.length, m = xs.reduce((a, b) => a + b, 0) / Math.max(1, n); return { mean: m, sd: Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, n - 1)), n }; };
  return {
    ok: true, title: spec.title,
    measures: measures.map((m) => ({ id: m, name: MEASURE_NAMES[m] ?? m, better: better[m] ?? (['speed', 'duplicates', 'cost', 'waste'].includes(m) ? 'lower' : 'higher') })),
    progress: PROGRESS.map((v) => ({ id: v, name: { level: 'hardest level published', value: 'bounty value found', published: 'ideas published', targets: 'targets solved', knowledge: 'knowledge found (bits)', knowledgePublished: 'knowledge published (bits)' }[v] })),
    rows: rows.map((r, i) => {
      const g = groups[i];
      // RunResult fields are named differently from column ids; VALUES maps a stored run to each measure.
      const vals = (m: string) => g.map((x) => VALUES[m]!(x as never)).filter((v): v is number => v !== null && Number.isFinite(v));
      const hasProgress = g.length && g.every((x) => x.progress);
      return {
        label: label(r.labels), budget: r.scenario.budget.X,
        stats: Object.fromEntries(measures.map((m) => [m, stat(vals(m))])),
        progress: hasProgress ? Object.fromEntries(PROGRESS.map((v) => [v, Array.from({ length: PROGRESS_POINTS }, (_, k) => g.reduce((a, x) => a + x.progress[v][k], 0) / g.length)])) : null,
      };
    }),
  };
}

/** A saved experiment's rows, for picking two societies to replay. */
function experimentRows(id: string) {
  const spec = loadExperiment(id);
  const rows = expand(spec);
  const label = (r: (typeof rows)[number]) => Object.entries(r.labels).map(([k, v]) => (typeof v === 'number' ? `${k} ${v}` : String(v))).join(', ') || 'all';
  return { id, title: spec.title, seeds: spec.seeds, firstSeed: spec.firstSeed ?? 1, rows: rows.map(label) };
}

/** Replays one row of a saved experiment, at one seed: the same graph and dice for every row. */
function simExperiment(id: string, row: number, seed: number) {
  const spec = loadExperiment(id);
  const rows = expand(spec);
  if (!rows[row]) throw new Error(`no row ${row} in ${id}`);
  return replayOf(rows[row].scenario, seed, experimentRows(id).rows[row], spec.title);
}

function sim(id: string, setting: string, seed: number) {
  if (!SETTINGS[setting]) throw new Error(`unknown setting ${setting}`);
  const sp = space(id);
  // The space's settings (with its calibrated budget), then the rule setting.
  const sc = loadScenario(sp.spec.scenarioFile ?? null, expandPaths(sp.spec.scenario ?? {}), preset(setting));
  const t = traceRun(sc, seed);
  const w = t.world;
  return {
    space: { id, title: sp.spec.title, glossary: sp.spec.glossary, areas: sp.spec.areas ?? [] },
    setting: { id: setting, label: SETTINGS[setting] }, seed,
    budget: { X: sc.budget.X, rounds: sc.budget.rounds },
    world: { n: w.n, levels: w.levels, level: w.level, area: w.area, prereqs: w.prereqs, isTarget: w.isTarget, bounty: w.bounty, deadEnd: w.deadEnd, names: w.names ?? null, p: w.p },
    agents: t.agents.map((a) => ({ id: a.id, archetype: a.archetype })),
    events: t.events,
    result: { frontier: t.result.frontier, targetsSolved: t.result.targetsSolved, spend: t.result.spend, sharing: t.result.sharingRate },
  };
}

/** A JSON-lines file; a running job may be part-way through writing the last line, so that one may be skipped. */
const jsonl = (f: string) => {
  if (!existsSync(f)) return [];
  const lines = readFileSync(f, 'utf8').split('\n').filter(Boolean);
  return lines.flatMap((l, k) => { try { return [JSON.parse(l)]; } catch (e) { if (k < lines.length - 1) throw e; return []; } });
};

function pilotRuns() {
  const dir = join(LEAN_DIR, 'runs');
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((d) => existsSync(join(dir, d, 'attempts.jsonl')) && !d.startsWith('stub-')).flatMap((d) => { try {
    const opts = JSON.parse(readFileSync(join(dir, d, 'options.json'), 'utf8'));
    const files = ['attempts.jsonl', 'events.jsonl'].map((f) => join(dir, d, f)).filter(existsSync);
    const modified = Math.max(0, ...files.map((f) => statSync(f).mtimeMs));
    const attempts = jsonl(join(dir, d, 'attempts.jsonl'));
    // How many attempts the run plans, when it names its targets; a run whose failing attempts are slow still counts as running.
    const planned = opts.only?.length ? opts.only.length * (opts.conditions?.length ?? 1) * (opts.attempts ?? 1) : null;
    const quiet = Date.now() - modified;
    const status = planned !== null && attempts.length >= planned ? 'finished' : quiet < (planned !== null ? 20 : 5) * 60_000 ? 'running' : planned !== null ? 'stopped' : 'unknown';
    const proved: Record<string, Record<string, [number, number]>> = {};
    for (const a of attempts) { const c = ((proved[a.publicId] ??= {})[a.condition] ??= [0, 0]); c[1]++; if (a.ok) c[0]++; }
    return [{ id: d, model: opts.model?.model ?? '?', provider: opts.model?.provider ?? 'anthropic', recorded: attempts.length, modified, live: Date.now() - modified < 5 * 60_000, planned, status, running: status === 'running', spent: attempts.reduce((v, a) => v + (a.usage?.cost ?? 0), 0), proved }];
  } catch { return []; } }).sort((a, b) => b.modified - a.modified);
}

/** Community runs: pairs of `<id>-traditional` and `<id>-oso` folders in lean/runs/. */
function communityRuns() {
  const dir = join(LEAN_DIR, 'runs');
  if (!existsSync(dir)) return [];
  const ids = new Map<string, { id: string; rules: string[]; modified: number; actions: number }>();
  for (const d of readdirSync(dir)) {
    const m = /^(.*)-(traditional|oso)$/.exec(d);
    if (!m || m[1].startsWith('test-') || !existsSync(join(dir, d, 'options.json'))) continue;
    const opts = JSON.parse(readFileSync(join(dir, d, 'options.json'), 'utf8'));
    if (opts.kind !== 'community') continue;
    const f = join(dir, d, 'actions.jsonl');
    const run = ids.get(m[1]) ?? { id: m[1], rules: [], modified: 0, actions: 0 };
    run.rules.push(m[2]);
    if (existsSync(f)) { run.modified = Math.max(run.modified, statSync(f).mtimeMs); run.actions += jsonl(f).length; }
    ids.set(m[1], run);
  }
  return [...ids.values()].map((r) => ({ ...r, live: Date.now() - r.modified < 3 * 60_000 })).sort((a, b) => b.modified - a.modified);
}

/**
 * Every run, newest first: saved results (with the time their card was written), tests running now
 * in the app, and AI tests still in progress. One row each, with where to read and where to watch it.
 */
function history() {
  const KIND: Record<string, string> = { race: 'AI test', 'model pilot': 'AI pilot', 'field report': 'Preset report', simulation: 'Simulation' };
  const rows = allCards().map((c) => {
    const page = join(ROOT, c.page);
    const model = c.basedOn?.length ? 'Meta-analysis' : c.kind !== 'simulation' ? KIND[c.kind] : c.tags?.includes('simple model') ? 'Simple model' : c.tags?.includes('full model') ? 'Full model (step 5)' : 'Simulation';
    const watch = c.kind === 'simulation' && existsSync(join(ROOT, 'config', 'experiments', `${c.id}.yaml`)) ? `#/live?tab=sim&experiment=${encodeURIComponent(c.id)}`
      : c.kind === 'field report' && !c.superseded ? `#/live?tab=sim&space=${encodeURIComponent(c.id)}` : c.kind === 'race' && !c.invalid ? '#/live?tab=ai' : null;
    // When the run started; older cards without it: when their result was last written.
    return { at: c.ranAt ? Date.parse(c.ranAt) : existsSync(page) ? statSync(page).mtimeMs : Date.parse(c.date), id: c.id, kind: model, title: c.title, question: c.design.question, answer: c.invalid ? `Not valid: ${c.invalid}` : c.superseded ? `Earlier version. ${c.answer}` : c.answer, status: c.invalid ? 'not valid' : c.superseded ? 'earlier' : c.modelVersion !== undefined && c.modelVersion < MODEL_VERSION ? 'older model' : 'done', modelVersion: c.modelVersion ?? null, result: `#/doc/${c.page}`, watch, tags: c.tags ?? [] };
  });
  const seen = new Set(rows.map((r) => r.id));
  for (const j of design.listJobs()) {
    if (j.status !== 'running') continue;
    rows.push({ at: j.startedAt, id: j.id, kind: 'Running now', title: j.title, question: j.title, answer: j.log.at(-1) ?? 'starting…', status: 'running', modelVersion: MODEL_VERSION, result: '', watch: null, tags: [] });
  }
  for (const c of communityRuns()) {
    if (seen.has(c.id) || !c.live) continue;
    rows.push({ at: c.modified, id: c.id, kind: 'AI test', title: c.id, question: 'An AI test, in progress', answer: `${c.actions} actions so far`, status: 'running', modelVersion: null, result: '', watch: `#/live?tab=ai&run=${encodeURIComponent(c.id)}`, tags: [] });
  }
  return rows.sort((a, b) => b.at - a.at);
}

function communityRun(id: string) {
  if (!/^[\w.-]+$/.test(id)) throw new Error('bad run id');
  const out: Record<string, unknown> = { id };
  for (const rules of ['traditional', 'oso']) {
    const dir = join(LEAN_DIR, 'runs', `${id}-${rules}`);
    if (!existsSync(join(dir, 'options.json'))) continue;
    out[rules] = { options: JSON.parse(readFileSync(join(dir, 'options.json'), 'utf8')), actions: jsonl(join(dir, 'actions.jsonl')), finished: existsSync(join(dir, 'result.json')) };
  }
  out.targets = loadTasks().filter((t) => t.posted).map((t) => ({ id: t.publicId, depth: t.depth, bounty: 4 * 2 ** (t.depth - 1) }));
  return out;
}

function pilotRun(id: string) {
  if (!/^[\w.-]+$/.test(id)) throw new Error('bad run id');
  const dir = join(LEAN_DIR, 'runs', id);
  const opts = JSON.parse(readFileSync(join(dir, 'options.json'), 'utf8'));
  const tasks = loadTasks(opts.problems ?? (id.startsWith('hard-check') ? 'hard' : 'main'));
  const pid = new Map(tasks.map((t) => [t.name, t.publicId]));
  return {
    id, options: opts,
    records: jsonl(join(dir, 'attempts.jsonl')).map((r) => ({ ...r, name: undefined })),
    events: jsonl(join(dir, 'events.jsonl')),
    tree: tasks.map((t) => ({ id: t.publicId, depth: t.depth, area: t.area, posted: t.posted, prereqs: t.uses.map((u) => pid.get(u)).filter(Boolean) })),
  };
}

/** Models OpenRouter offers that can reason, with list prices per million tokens (cached for an hour). */
let modelCache: { at: number; list: unknown[] } | null = null;
async function models() {
  if (modelCache && Date.now() - modelCache.at < 3600_000) return modelCache.list;
  const res = await fetch('https://openrouter.ai/api/v1/models');
  const data = (await res.json()) as { data: { id: string; name: string; pricing: { prompt: string; completion: string }; supported_parameters?: string[] }[] };
  const list = data.data
    .filter((m) => (m.supported_parameters ?? []).includes('reasoning') && !m.id.endsWith(':batch') && !m.id.startsWith('~'))
    .map((m) => ({ id: m.id, name: m.name, input: Number(m.pricing.prompt) * 1e6, output: Number(m.pricing.completion) * 1e6 }))
    .sort((a, b) => a.id.localeCompare(b.id));
  modelCache = { at: Date.now(), list };
  return list;
}

/**
 * The Progress page: every society experiment (runs done, running, waiting, with the money-vs-targets
 * curve of each), every Phase 0 benchmark run, and the credit left. No transcripts or proofs.
 */
/** One problem set as a graph: only the theorems some target needs, with how hard each target has been so far. */
function problemSpace(set: Problems) {
  const tasks = loadTasks(set), byName = new Map(tasks.map((t) => [t.name, t]));
  const below = (name: string, seen = new Set<string>()): Set<string> => { for (const u of byName.get(name)?.uses ?? []) if (!seen.has(u)) { seen.add(u); below(u, seen); } return seen; };
  const label = new Map(tasks.map((t) => [t.name, t.posted ? t.publicId : t.short]));
  const needed = new Set(tasks.filter((t) => t.posted).flatMap((t) => [t.name, ...below(t.name)]));
  // Community results from the largest run on the main set; for the harder targets, the difficulty check (one model alone, a pilot).
  const main = leanData('lean-main-b'), community = Object.fromEntries(main.targets.map((t: { id: string }) => [t.id, [main.setups.reduce((a: number, s: { proved: Record<string, number> }) => a + s.proved[t.id], 0), main.setups.reduce((a: number, s: { done: number }) => a + s.done, 0)]]));
  const check: Record<string, Record<string, [number, number]>> = {};
  for (const run of ['hard-check-1', 'hard-check-2']) for (const a of jsonl(join(LEAN_DIR, 'runs', run, 'attempts.jsonl'))) { const c = ((check[a.publicId] ??= {})[a.condition] ??= [0, 0]); c[1]++; if (a.ok) c[0]++; }
  const shown = tasks.filter((t) => needed.has(t.name));
  return {
    set, experiment: main.name, areas: AREAS,
    theorems: shown.map((t) => ({ id: label.get(t.name), name: t.short, plain: t.posted ? PLAIN[t.publicId] ?? '' : '', depth: t.depth, area: t.area, posted: t.posted ? t.publicId : null, statement: t.signature, uses: t.uses.map((u) => label.get(u)) })),
    targets: shown.filter((t) => t.posted).map((t) => ({ id: t.publicId, name: t.short, area: t.area, depth: t.depth, bounty: 4 * 2 ** (t.depth - 1), plain: PLAIN[t.publicId] ?? '', statement: t.signature, uses: t.uses.map((u) => label.get(u)), below: below(t.name).size, community: community[t.publicId] ?? null, alone: check[t.publicId]?.alone ?? null, lemmas: check[t.publicId]?.library ?? null })),
  };
}

/** The Lean experiment explained: the problems, the society experiments, each setup's labs and exact prompts. */
function leanData(exp: string) {
  let tasks = loadTasks('main');
  let label = new Map(tasks.map((t) => [t.name, t.posted ? t.publicId : t.short]));
  const below = (name: string, seen = new Set<string>()): Set<string> => {
    for (const u of tasks.find((t) => t.name === name)?.uses ?? []) if (!seen.has(u)) { seen.add(u); below(u, seen); }
    return seen;
  };
  const dir = join(LEAN_DIR, 'runs');
  const keys = Object.keys(SOCIETIES).sort((a, b) => b.length - a.length);
  const runs = new Map<string, { key: string; rep: number; done: boolean }[]>();
  for (const d of existsSync(dir) ? readdirSync(dir) : []) {
    const m = /^(.*)-r(\d+)-(.+)$/.exec(d);
    if (!m || !keys.includes(m[3]) || m[1].startsWith('test-') || !existsSync(join(dir, d, 'options.json'))) continue;
    runs.set(m[1], [...(runs.get(m[1]) ?? []), { key: m[3], rep: Number(m[2]), done: existsSync(join(dir, d, 'result.json')) }]);
  }
  // A run's prompts: as sent (a list), or rebuilt afterwards from the code that ran it ({ rebuilt, prompts }).
  const saved = (run: string): { prompts: string[]; rebuilt: string | null } | null => {
    if (!existsSync(join(dir, run, 'prompts.json'))) return null;
    const j = JSON.parse(readFileSync(join(dir, run, 'prompts.json'), 'utf8'));
    return Array.isArray(j) ? { prompts: j, rebuilt: null } : { prompts: j.prompts, rebuilt: j.rebuilt };
  };
  const ids = [...runs.keys()].sort((a, b) => Number(isTest(a)) - Number(isTest(b)) || statSync(join(dir, `${b}-r1-${runs.get(b)![0].key}`)).mtimeMs - statSync(join(dir, `${a}-r1-${runs.get(a)![0].key}`)).mtimeMs);
  const experiments = ids.map((x) => ({ id: x, name: experimentName(x), test: isTest(x) }));
  // By default the newest experiment with a finished run, so the page opens on results, not an empty table.
  const id = runs.has(exp) ? exp : ids.find((x) => !isTest(x) && runs.get(x)!.some((r) => r.done)) ?? ids[0];
  const mine = runs.get(id) ?? [];
  // An experiment on the harder set has its own targets.
  if (mine[0] && JSON.parse(readFileSync(join(dir, `${id}-r${mine[0].rep}-${mine[0].key}`, 'options.json'), 'utf8')).problems === 'hard') {
    tasks = loadTasks('hard'); label = new Map(tasks.map((t) => [t.name, t.posted ? t.publicId : t.short]));
  }
  const posted = tasks.filter((t) => t.posted).map((t) => ({ id: t.publicId, bounty: 4 * 2 ** (t.depth - 1), depth: t.depth }));
  const setups = [...new Set(mine.map((r) => r.key))].sort((a, b) => Object.keys(SOCIETIES).indexOf(a) - Object.keys(SOCIETIES).indexOf(b)).map((key) => {
    const first = mine.filter((r) => r.key === key).sort((a, b) => a.rep - b.rep)[0];
    const options = JSON.parse(readFileSync(join(dir, `${id}-r${first.rep}-${key}`, 'options.json'), 'utf8'));
    const com = new Community(options);
    const lab = Math.min(1, options.agents.length - 1);
    const done = mine.filter((r) => r.key === key && r.done).map((r) => JSON.parse(readFileSync(join(dir, `${id}-r${r.rep}-${key}`, 'result.json'), 'utf8')) as CommunityResult);
    const proved = Object.fromEntries(tasks.filter((t) => t.posted).map((t) => [t.publicId, done.filter((r) => r.library.some((e) => e.target === t.publicId)).length]));
    return { key, name: SOCIETIES[key].name, params: osoParams(options), label: osoLabel(SOCIETIES[key].name, options), colour: SOCIETIES[key].colour, options, runs: mine.filter((r) => r.key === key).length, done: done.length, proved,
      // Each finished run's targets proved by money spent, for the mean graph.
      series: done.map((r) => seriesOf(r, posted)),
      system: saved(`${id}-r${first.rep}-${key}`)?.prompts[lab] ?? com.systemPrompt(lab), promptFrom: saved(`${id}-r${first.rep}-${key}`)?.rebuilt ?? (saved(`${id}-r${first.rep}-${key}`) ? 'sent' : 'current'), turn: com.turnPrompt(lab, 1), lab: lab + 1 };
  });
  return {
    experiments, id, name: experimentName(id), setups, reps: [...new Set(mine.map((r) => r.rep))].sort((a, b) => a - b),
    areas: AREAS, definitions: definitions(),
    theorems: tasks.map((t) => ({ id: label.get(t.name), name: t.short, plain: t.posted ? PLAIN[t.publicId] ?? '' : '', depth: t.depth, area: t.area, posted: t.posted ? t.publicId : null, statement: t.signature, uses: t.uses.map((u) => label.get(u)) })),
    targets: tasks.filter((t) => t.posted).map((t) => ({ id: t.publicId, name: t.short, area: t.area, depth: t.depth, bounty: 4 * 2 ** (t.depth - 1), plain: PLAIN[t.publicId] ?? '', statement: t.signature,
      uses: t.uses.map((u) => label.get(u)), below: below(t.name).size })),
  };
}

/** One reply a task's chance was spent on, counted as a try only if Lean checked a proof: replies without a proof, or
 *  turned away by the format checks before Lean, do not count. Runs without saved replies count every reply. */
const NOT_CHECKED = /^(Start with ACTION|There is no|That is a posted|Lemma names|Give the whole|the proof must|.* is already proved)/;
const triesOf = (a: CommunityResult['actions'][number]) => (a.transcript ? a.transcript.filter((t) => t.proof && !NOT_CHECKED.test(t.errors[0] ?? '')).length : a.turns ?? 0);

/** One run turn by turn, for the Lean results graph: after each turn, the money spent, round, proof tries so far, targets
 *  proved, bounty value of those targets, lemmas proved, results built on another lab's work, and which targets are
 *  proved (bit n = the n-th posted target). */
function seriesOf(r: CommunityResult, posted: { id: string; bounty: number; depth: number }[]) {
  const acts = [...r.actions].sort((a, b) => a.t - b.t), byName = new Map(r.library.map((e) => [`${e.ns}.${e.name}`, e]));
  const solved = new Set<string>(), cited = new Set<string>();
  // Repeat proofs of a statement do not count as building on others; only first proofs of real lemmas can be cited groundwork.
  const first = firstProofs(r.library), firstNames = new Set(first.map((e) => e.name)), groundwork = new Set(first.filter((e) => !e.target && !e.conjecture && !e.trivial).map((e) => `${e.ns}.${e.name}`));
  let lemmas = 0, built = 0;
  // Money and tries count the whole round: labs work at the same time.
  const money = moneyByRound(r.actions), triesIn = new Map<number, number>();
  for (const a of r.actions) triesIn.set(a.round, (triesIn.get(a.round) ?? 0) + triesOf(a));
  const triesBy = (round: number) => [...triesIn].reduce((v, [k, n]) => (k <= round ? v + n : v), 0);
  const rows: number[][] = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
  acts.forEach((a) => {
    if (a.ok && a.kind === 'target' && a.target) solved.add(a.target);
    if (a.ok && a.kind === 'lemma' && !/trivial/.test(a.reason ?? '')) lemmas++;
    if (a.ok && (!a.entry || firstNames.has(a.entry)) && (a.uses ?? []).some((u) => { const e = byName.get(u); return e && e.author !== a.agent; })) built++;
    if (a.ok) for (const u of a.uses ?? []) if (groundwork.has(u)) cited.add(u);
    const mask = posted.reduce((m, t, k) => (solved.has(t.id) ? m | (1 << k) : m), 0);
    rows.push([Math.round(money.get(a.round)! * 1e4) / 1e4, a.round, triesBy(a.round), solved.size, posted.reduce((v, t) => v + (solved.has(t.id) ? t.bounty : 0), 0), lemmas, built, mask, Math.max(0, ...posted.filter((t) => solved.has(t.id)).map((t) => t.depth)), cited.size, Math.round(((a.t - acts[0].t) / 60000) * 10) / 10]);
  });
  return rows;
}

/** Every turn of one society run, with the lab's replies and Lean's errors. */
function leanRun(id: string) {
  if (!/^[\w.-]+$/.test(id)) throw new Error('bad run id');
  const d = join(LEAN_DIR, 'runs', id);
  if (!existsSync(join(d, 'options.json'))) throw new Error('no such run');
  // The model's thinking, saved since 2026-11-07 in its own file: action number → one entry per reply.
  const thinking = Object.fromEntries(jsonl(join(d, 'reasoning.jsonl')).map((x) => [x.action, x.reasoning]));
  return { id, options: JSON.parse(readFileSync(join(d, 'options.json'), 'utf8')), actions: jsonl(join(d, 'actions.jsonl')), thinking, finished: existsSync(join(d, 'result.json')) };
}

/** Money spent on model calls, as charged, for every Lean run and benchmark: per experiment, in all, and over time.
 *  Runs before 2026-10-21 that recorded only list prices count at list price (marked). Stand-in and local runs cost nothing. */
async function costData() {
  const dir = join(LEAN_DIR, 'runs');
  type Row = { id: string; name: string; kind: string; runs: number; spent: number; listOnly: number; first: number; last: number; running: boolean };
  const rows = new Map<string, Row>(), hours = new Map<number, number>();
  const add = (id: string, name: string, kind: string, recs: Record<string, unknown>[], modified: number, open: boolean, undated = modified) => {
    const r = rows.get(id) ?? { id, name, kind, runs: 0, spent: 0, listOnly: 0, first: Infinity, last: 0, running: false };
    r.runs++;
    for (const a of recs) {
      const u = (a.usage ?? {}) as { cost?: number };
      const charged = (a.cost as number | undefined) ?? u.cost ?? (a.dollars as number | undefined);
      const c = charged ?? (a.listCost as number | undefined) ?? 0;
      if (charged === undefined && c) r.listOnly += c;
      r.spent += c;
      // A record without a time: its file's age (the oldest file, which later edits to the folder do not move).
      const t = (a.t as number | undefined) ?? undated;
      r.first = Math.min(r.first, t); r.last = Math.max(r.last, t);
      if (c && kind !== 'test') { const h = Math.floor(t / 3_600_000); hours.set(h, (hours.get(h) ?? 0) + c); }
    }
    if (!recs.length) { r.first = Math.min(r.first, modified); r.last = Math.max(r.last, modified); }
    r.running ||= open && Date.now() - modified < 10 * 60_000;
    rows.set(id, r);
  };
  for (const d of existsSync(dir) ? readdirSync(dir) : []) {
    const p = join(dir, d);
    if (!statSync(p).isDirectory()) continue;
    const files = ['actions.jsonl', 'attempts.jsonl', 'attempts-superseded.jsonl'].map((f) => join(p, f)).filter(existsSync);
    const recs = files.flatMap((f) => jsonl(f));
    const modified = Math.max(statSync(p).mtimeMs, ...files.map((f) => statSync(f).mtimeMs));
    const undated = files.length ? Math.min(...files.map((f) => statSync(f).mtimeMs)) : modified;
    const m = /^(.*)-r(\d+)-(.+)$/.exec(d);
    const open = !existsSync(join(p, 'result.json')) && !existsSync(join(p, 'summary.md'));
    if (m && !d.startsWith('community-')) add(m[1], experimentName(m[1]), isTest(m[1]) ? 'test' : 'society experiment', recs, modified, open, undated);
    else if (d.startsWith('panel-')) add(d, `Lemma panel: ${d.slice(6)}`, 'model panel', recs, modified, open, undated);
    else if (d.startsWith('community-2026-10-20')) add('first-race', 'First race: mixed models, OSO vs traditional (Oct 20)', 'race', recs, modified, open, undated);
    else add(d, d === 'first-test' ? 'First test: Claude Opus on the problems (Oct 19)' : d, /^(stub|test|local)/.test(d) ? 'test' : 'other', recs, modified, open, undated);
  }
  const bench = join(RESULTS_DIR, 'bench');
  for (const d of existsSync(bench) ? readdirSync(bench) : []) {
    const f = join(bench, d, 'records.jsonl');
    if (existsSync(f)) add(`bench-${d}`, `Benchmark: ${d}`, d.startsWith('local') ? 'test' : 'benchmark', jsonl(f), statSync(f).mtimeMs, false);
  }
  // Pipeline tests charge a pretend $0.01 a call and local models are priced as if hosted: no real money, left out.
  const list = [...rows.values()].filter((r) => r.kind !== 'test' && (r.spent > 0 || r.running)).map((r) => ({ ...r, spent: Math.round(r.spent * 1e4) / 1e4, listOnly: Math.round(r.listOnly * 1e4) / 1e4 })).sort((a, b) => b.last - a.last);
  let run = 0;
  const series = [...hours.entries()].sort((a, b) => a[0] - b[0]).map(([h, c]) => [h * 3_600_000, Math.round((run += c) * 1e4) / 1e4]);
  const key = process.env.OPENROUTER_API_KEY;
  return { total: Math.round(list.reduce((a, r) => a + r.spent, 0) * 100) / 100, experiments: list, series, keyUsage: key ? await keyUsage(key) : null, credit: key ? await creditLeft(key) : null };
}

async function progressData() {
  const dir = join(LEAN_DIR, 'runs');
  const keys = Object.keys(SOCIETIES).sort((a, b) => b.length - a.length);
  const groups = new Map<string, { id: string; plan: { societies: string[]; repeats: number; k: number; startedAt?: number } | null; runs: Record<string, unknown>[] }>();
  for (const d of existsSync(dir) ? readdirSync(dir) : []) {
    const m = /^(.*)-r(\d+)-(.+)$/.exec(d);
    if (!m || !keys.includes(m[3]) || m[1].startsWith('test-') || !existsSync(join(dir, d, 'options.json'))) continue;
    const opts = JSON.parse(readFileSync(join(dir, d, 'options.json'), 'utf8'));
    const actions = jsonl(join(dir, d, 'actions.jsonl'));
    const f = join(dir, d, 'actions.jsonl');
    const modified = existsSync(f) ? statSync(f).mtimeMs : 0;
    const finished = existsSync(join(dir, d, 'result.json'));
    const result = finished ? JSON.parse(readFileSync(join(dir, d, 'result.json'), 'utf8')) as CommunityResult : null;
    const pts = progress(result ?? ({ opts, actions } as unknown as CommunityResult));
    type Group = typeof groups extends Map<string, infer G> ? G : never;
    const g: Group = groups.get(m[1]) ?? { id: m[1], plan: existsSync(join(dir, `${m[1]}.plan.json`)) ? JSON.parse(readFileSync(join(dir, `${m[1]}.plan.json`), 'utf8')) : null, runs: [] };
    g.runs.push({
      key: m[3], rep: Number(m[2]), status: finished ? 'done' : Date.now() - modified < 10 * 60_000 ? 'running' : 'stopped',
      round: actions.reduce((a, x) => Math.max(a, x.round ?? 0), 0), rounds: opts.rounds, budget: opts.budget * opts.agents.length,
      spent: pts.at(-1)![0], solved: pts.at(-1)![1], counted: (opts.counted ?? []).length || null, stopped: result?.stopped ?? null,
      started: actions.length ? Math.min(...actions.map((a) => a.t)) : null, modified, points: pts, gaps: LEAN_REWARDS.gaps(opts),
    });
    groups.set(m[1], g);
  }
  const experiments = [...groups.values()].map((g) => ({ ...g, name: experimentName(g.id), test: isTest(g.id), modified: Math.max(...g.runs.map((r) => r.modified as number)) })).sort((a, b) => Number(a.test) - Number(b.test) || b.modified - a.modified);
  const bdir = join(RESULTS_DIR, 'bench');
  const bench = (existsSync(bdir) ? readdirSync(bdir) : []).filter((d) => existsSync(join(bdir, d, 'records.jsonl'))).map((d) => {
    const f = join(bdir, d, 'records.jsonl'), recs = jsonl(f);
    const problems = new Set(recs.map((r) => r.id)), solved = new Set(recs.filter((r) => r.ok).map((r) => r.id));
    const sum = join(bdir, d, 'summary.md');
    const model = existsSync(sum) ? (/\*\*Agent:\*\* `([^`]+)`/.exec(readFileSync(sum, 'utf8'))?.[1] ?? '') : '';
    return { id: d, model, attempts: recs.length, problems: problems.size, solved: solved.size, cost: recs.reduce((a, r) => a + (r.dollars ?? 0), 0), modified: statSync(f).mtimeMs, finished: existsSync(join(bdir, d, 'summary.md')) && statSync(join(bdir, d, 'summary.md')).mtimeMs >= statSync(f).mtimeMs - 5000 };
  }).sort((a, b) => b.modified - a.modified);
  const key = process.env.OPENROUTER_API_KEY;
  let credit: number | null = null;
  try { credit = key ? await creditLeft(key) : null; } catch { credit = null; }
  return { now: Date.now(), credit, rewards: { current: MODEL_VERSION, gaps: LEAN_REWARDS.gaps({ knowledge: 'off' }) }, societies: Object.fromEntries(Object.entries(SOCIETIES).map(([k, v]) => [k, { name: v.name, label: osoLabel(v.name, societyOptions(k, { agents: ['a', 'b', 'c', 'd'], alpha: 0.8, mint: 1, knowledge: 'off' } as never)), colour: v.colour }])), experiments, bench };
}

/** What is left on the OpenRouter key's limit (the key itself is never sent to the page). */
async function balance() {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return { ok: false, message: 'No OPENROUTER_API_KEY in .env' };
  const res = await fetch('https://openrouter.ai/api/v1/key', { headers: { Authorization: `Bearer ${key}` } });
  const d = ((await res.json()) as { data?: { limit: number | null; limit_remaining: number | null; usage: number } }).data;
  return { ok: !!d, limit: d?.limit ?? null, remaining: d?.limit_remaining ?? null, usage: d?.usage ?? null };
}

/** Reads a JSON request body (small: designs and field files). */
function body(req: import('node:http').IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((ok, fail) => {
    let s = '';
    req.on('data', (d) => { s += d; if (s.length > 1 << 20) { fail(new Error('request too large')); req.destroy(); } });
    req.on('end', () => { try { ok(s ? JSON.parse(s) : {}); } catch { fail(new Error('the request is not JSON')); } });
  });
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://127.0.0.1:${PORT}`);
  const send = (status: number, body: unknown, type = 'application/json') => {
    res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    res.end(type === 'application/json' ? JSON.stringify(body) : (body as string | Buffer));
  };
  try {
    if (req.method === 'POST') {
      // Only this app may post: a page on another site cannot set this header without CORS.
      if (req.headers['x-oso-app'] !== '1') return send(403, { error: 'forbidden' });
      const b = await body(req);
      const job = (j: design.Job) => send(200, { job: j.id });
      if (url.pathname === '/api/experiments/check') return send(200, design.checkExperiment(b.design as design.Design));
      if (url.pathname === '/api/experiments/run') return job(design.runExperimentJob(b.design as design.Design, b.overwrite === true));
      if (url.pathname === '/api/name/ai') return send(200, { name: design.aiName(b.design as design.RaceDesign) });
      if (url.pathname === '/api/simple/graph') return send(200, design.graphPreview(b.graph as design.GraphControls));
      if (url.pathname === '/api/simple/check') return send(200, design.checkSimple(b.design as design.SimpleDesign));
      if (url.pathname === '/api/simple/run') return job(design.runSimpleJob(b.design as design.SimpleDesign, b.overwrite === true));
      if (url.pathname === '/api/persona/text') return send(200, { text: design.personaText(b.persona as design.Persona) });
      if (url.pathname === '/api/race/series') return job(design.buildSeriesJob(String(b.id ?? '')));
      if (url.pathname === '/api/community/start') return job(design.startRaceJob(b.design as design.RaceDesign));
      if (url.pathname === '/api/reports/build') return job(design.buildReportJob(String(b.space ?? ''), Number(b.seeds ?? 100)));
      return send(404, { error: 'not found' });
    }
    if (url.pathname === '/api/design/options') return send(200, design.options());
    if (url.pathname === '/api/race/suggest') return send(200, design.suggestCounted(url.searchParams.get('model') ?? ''));
    if (url.pathname === '/api/design/agents') return send(200, design.fieldAgents(url.searchParams.get('id') ?? ''));
    if (url.pathname === '/api/models') return send(200, await models());
    if (url.pathname === '/api/balance') return send(200, await balance());
    if (url.pathname === '/api/progress') return send(200, await progressData());
    if (url.pathname === '/api/costs') return send(200, await costData());
    if (url.pathname === '/api/lean') return send(200, leanAvailable() ? leanData(url.searchParams.get('exp') ?? '') : null);
    if (url.pathname === '/api/problems') return send(200, leanAvailable() ? problemSpace(url.searchParams.get('set') === 'hard' ? 'hard' : 'main') : null);
    if (url.pathname === '/api/lean/run') return send(200, leanRun(url.searchParams.get('id') ?? ''));
    if (url.pathname === '/api/design/field') return send(200, design.fieldValues(url.searchParams.get('id') ?? ''));
    if (url.pathname === '/api/jobs') return send(200, design.listJobs());
    if (url.pathname.startsWith('/api/jobs/')) return send(200, design.getJob(url.pathname.slice('/api/jobs/'.length)));
    if (url.pathname.startsWith('/katex/')) {
      // The maths renderer's style sheet and fonts, from its package.
      const dist = join(ROOT, 'node_modules', 'katex', 'dist');
      const f = normalize(join(dist, url.pathname.slice('/katex/'.length)));
      if (!f.startsWith(dist + '/') || !existsSync(f) || statSync(f).isDirectory()) return send(404, { error: 'not found' });
      const types: Record<string, string> = { '.css': 'text/css; charset=utf-8', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf' };
      return send(200, readFileSync(f), types[extname(f)] ?? 'application/octet-stream');
    }
    if (url.pathname === '/') return send(200, readFileSync(PAGE, 'utf8'), 'text/html; charset=utf-8');
    if (url.pathname === '/api/overview') return send(200, overview());
    if (url.pathname === '/api/doc') return send(200, doc(url.searchParams.get('path') ?? ''));
    if (url.pathname === '/api/roadmap') {
      // The milestones for the Home page: "### M1. Title", its status line and its question.
      if (!existsSync(ROADMAP)) return send(200, { milestones: [] });
      const md = readFileSync(ROADMAP, 'utf8');
      const milestones = md.split(/\n(?=### )/).filter((b) => /^### M\d/.test(b)).map((b) => ({
        id: /^### (M\d+[a-z]?)/.exec(b)![1], title: /^### M\d+[a-z]?\.\s*(.+)/.exec(b)![1].trim(),
        status: /\*\*Status:\*\*\s*(.+)/.exec(b)?.[1].trim() ?? '', question: /\*\*Question:\*\*\s*(.+)/.exec(b)?.[1].trim() ?? '',
      }));
      return send(200, { milestones, aim: /\*\*The claim we want to be able to make:\*\*\s*(.+)/.exec(md)?.[1] ?? '' });
    }
    if (url.pathname.startsWith('/files/')) {
      const full = publicPath(decodeURIComponent(url.pathname.slice('/files/'.length)));
      if (!full || statSync(full).isDirectory()) return send(404, { error: 'not found' });
      return send(200, (extname(full) === '.png' ? readFileSync(full) : readFileSync(full, 'utf8')), TYPES[extname(full)] ?? 'text/plain; charset=utf-8');
    }
    if (url.pathname === '/api/result-data') return send(200, resultData(url.searchParams.get('id') ?? ''));
    if (url.pathname === '/api/history') return send(200, history());
    if (url.pathname === '/api/model') return send(200, { version: MODEL_VERSION, history: MODEL_HISTORY });
    if (url.pathname === '/api/presets') return send(200, design.graphPresets());
    if (url.pathname === '/api/spaces') return send(200, spaceIds().map((id) => ({ id, title: loadSpace(id).spec.title })));
    if (url.pathname === '/api/settings') return send(200, SETTINGS);
    if (url.pathname === '/api/sim/rows') return send(200, experimentRows(url.searchParams.get('experiment') ?? ''));
    if (url.pathname === '/api/sim/experiments') return send(200, allCards().filter((c) => c.kind === 'simulation' && existsSync(join(ROOT, 'config', 'experiments', `${c.id}.yaml`))).map((c) => ({ id: c.id, title: c.title, date: c.date })));
    if (url.pathname === '/api/sim' && url.searchParams.get('experiment')) return send(200, simExperiment(url.searchParams.get('experiment')!, Number(url.searchParams.get('row') ?? 0), Number(url.searchParams.get('seed') ?? 1)));
    if (url.pathname === '/api/sim') return send(200, sim(url.searchParams.get('space') ?? 'example-deep-field', url.searchParams.get('setting') ?? 'oso', Number(url.searchParams.get('seed') ?? 1)));
    if (url.pathname === '/api/pilot/runs') return send(200, leanAvailable() ? pilotRuns() : []);
    if (url.pathname === '/api/community/runs') return send(200, leanAvailable() ? communityRuns() : []);
    if (url.pathname === '/api/community/run') return send(200, communityRun(url.searchParams.get('id') ?? ''));
    if (url.pathname === '/api/pilot/run') return send(200, pilotRun(url.searchParams.get('id') ?? ''));
    send(404, { error: 'not found' });
  } catch (e) {
    send(400, { error: (e as Error).message });
  }
});
server.listen(PORT, '127.0.0.1', () => console.log(`Experiment viewer: http://127.0.0.1:${PORT}`));
