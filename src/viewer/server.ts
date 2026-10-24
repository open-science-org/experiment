// The experiment viewer: `npm run viewer`, then open http://127.0.0.1:8791.
// Plays back simulated runs round by round (traced on demand), and Lean pilot runs, live or after the
// fact. It listens on this machine only: pilot transcripts contain proofs, which are private.
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
import { LEAN_DIR, leanAvailable, loadTasks } from '../lean/tasks.ts';
import * as design from './design.ts';
import { allCards } from '../card.ts';

const PORT = Number(process.env.PORT ?? 8791);
/** Folders the viewer may serve files and documents from. Never lean/ (private) or .env. */
const PUBLIC_DIRS = ['reports', 'results', 'docs', 'worlds', 'config', 'spaces'];
/** Single public files outside those folders. Nothing else in lean/ is served: its private parts hold proofs. */
const PUBLIC_FILES = ['README.md', 'lean/README.md', 'lean/Problems/Defs.lean', 'lean/Problems/Targets.lean'];
const TYPES: Record<string, string> = { '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.md': 'text/plain; charset=utf-8', '.yaml': 'text/plain; charset=utf-8', '.jsonl': 'text/plain; charset=utf-8', '.py': 'text/plain; charset=utf-8', '.lean': 'text/plain; charset=utf-8' };

/** A repository path, if it is inside a public folder. */
function publicPath(path: string): string | null {
  const rel = normalize(path).replace(/^(\.\.\/)+/, '');
  if (rel.startsWith('/') || rel.includes('..') || !(PUBLIC_DIRS.includes(rel.split('/')[0]) || PUBLIC_FILES.includes(rel))) return null;
  const full = join(ROOT, rel);
  return existsSync(full) ? full : null;
}

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
  let html = marked.parse(md, { async: false }) as string;
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
  const rows = expand(spec);
  const keys = Object.keys(rows[0]?.labels ?? {});
  const label = (labels: Record<string, unknown>) => keys.map((k) => (typeof labels[k] === 'number' ? `${k.split(',')[0]} ${labels[k]}` : String(labels[k]).replace(/^OSO \(immediate\)$/, 'OSO'))).join(', ') || 'all';
  const runs = jsonl(join(RESULTS_DIR, id, 'runs.jsonl'));
  const groups = rows.map((r) => runs.filter((x) => keys.every((k) => x[k] === r.labels[k])));
  const measures = [...OUTCOMES.map((m) => m.id), 'sharing', 'reachTarget', 'speed', 'duplicates', 'credit'].filter((m) => VALUES[m]);
  const better = Object.fromEntries(OUTCOMES.map((m) => [m.id, m.better]));
  const stat = (xs: number[]) => { const n = xs.length, m = xs.reduce((a, b) => a + b, 0) / Math.max(1, n); return { mean: m, sd: Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, n - 1)), n }; };
  return {
    ok: true, title: spec.title,
    measures: measures.map((m) => ({ id: m, name: MEASURE_NAMES[m] ?? m, better: better[m] ?? (['speed', 'duplicates', 'cost', 'waste'].includes(m) ? 'lower' : 'higher') })),
    progress: PROGRESS.map((v) => ({ id: v, name: { level: 'hardest level published', value: 'bounty value found', published: 'ideas published', targets: 'targets solved' }[v] })),
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

const jsonl = (f: string) => (existsSync(f) ? readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)) : []);

function pilotRuns() {
  const dir = join(LEAN_DIR, 'runs');
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((d) => existsSync(join(dir, d, 'attempts.jsonl')) && !d.startsWith('stub-')).map((d) => {
    const opts = JSON.parse(readFileSync(join(dir, d, 'options.json'), 'utf8'));
    const files = ['attempts.jsonl', 'events.jsonl'].map((f) => join(dir, d, f)).filter(existsSync);
    const modified = Math.max(0, ...files.map((f) => statSync(f).mtimeMs));
    return { id: d, model: opts.model?.model ?? '?', provider: opts.model?.provider ?? 'anthropic', recorded: jsonl(join(dir, d, 'attempts.jsonl')).length, modified, live: Date.now() - modified < 5 * 60_000 };
  }).sort((a, b) => b.modified - a.modified);
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
    const model = c.kind !== 'simulation' ? KIND[c.kind] : c.tags?.includes('simple model') ? 'Simple model' : c.tags?.includes('full model') ? 'Full model' : 'Simulation';
    const watch = c.kind === 'simulation' && existsSync(join(ROOT, 'config', 'experiments', `${c.id}.yaml`)) ? `#/live?tab=sim&experiment=${encodeURIComponent(c.id)}`
      : c.kind === 'field report' && !c.superseded ? `#/live?tab=sim&space=${encodeURIComponent(c.id)}` : c.kind === 'race' && !c.invalid ? '#/live?tab=ai' : null;
    // When the run started; older cards without it: when their result was last written.
    return { at: c.ranAt ? Date.parse(c.ranAt) : existsSync(page) ? statSync(page).mtimeMs : Date.parse(c.date), id: c.id, kind: model, title: c.title, question: c.design.question, answer: c.invalid ? `Not valid: ${c.invalid}` : c.superseded ? `Earlier version. ${c.answer}` : c.answer, status: c.invalid ? 'not valid' : c.superseded ? 'earlier' : 'done', result: `#/doc/${c.page}`, watch, tags: c.tags ?? [] };
  });
  const seen = new Set(rows.map((r) => r.id));
  for (const j of design.listJobs()) {
    if (j.status !== 'running') continue;
    rows.push({ at: j.startedAt, id: j.id, kind: 'Running now', title: j.title, question: j.title, answer: j.log.at(-1) ?? 'starting…', status: 'running', result: '', watch: null, tags: [] });
  }
  for (const c of communityRuns()) {
    if (seen.has(c.id) || !c.live) continue;
    rows.push({ at: c.modified, id: c.id, kind: 'AI test', title: c.id, question: 'An AI test, in progress', answer: `${c.actions} actions so far`, status: 'running', result: '', watch: `#/live?tab=ai&run=${encodeURIComponent(c.id)}`, tags: [] });
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
  const tasks = loadTasks();
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
      if (url.pathname === '/api/spaces/check') return send(200, design.checkField(String(b.yaml ?? '')));
      if (url.pathname === '/api/spaces/save') { const r = design.saveField(String(b.yaml ?? ''), b.overwrite === true); spaces.delete(r.id); return send(200, r); }
      if (url.pathname === '/api/spaces/generate') return job(design.generateFieldJob(String(b.description ?? '')));
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
    if (url.pathname === '/api/design/field') return send(200, design.fieldValues(url.searchParams.get('id') ?? ''));
    if (url.pathname === '/api/spaces/yaml') return send(200, { yaml: design.fieldYaml(url.searchParams.get('id') ?? '') });
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
    if (url.pathname.startsWith('/files/')) {
      const full = publicPath(decodeURIComponent(url.pathname.slice('/files/'.length)));
      if (!full || statSync(full).isDirectory()) return send(404, { error: 'not found' });
      return send(200, (extname(full) === '.png' ? readFileSync(full) : readFileSync(full, 'utf8')), TYPES[extname(full)] ?? 'text/plain; charset=utf-8');
    }
    if (url.pathname === '/api/result-data') return send(200, resultData(url.searchParams.get('id') ?? ''));
    if (url.pathname === '/api/history') return send(200, history());
    if (url.pathname === '/api/presets') return send(200, design.graphPresets());
    if (url.pathname === '/api/spaces') return send(200, spaceIds().map((id) => ({ id, title: loadSpace(id).spec.title })));
    if (url.pathname === '/api/settings') return send(200, SETTINGS);
    if (url.pathname === '/api/sim/rows') return send(200, experimentRows(url.searchParams.get('experiment') ?? ''));
    if (url.pathname === '/api/sim/experiments') return send(200, allCards().filter((c) => c.kind === 'simulation' && existsSync(join(ROOT, 'config', 'experiments', `${c.id}.yaml`))).map((c) => ({ id: c.id, title: c.title, date: c.date })));
    if (url.pathname === '/api/sim' && url.searchParams.get('experiment')) return send(200, simExperiment(url.searchParams.get('experiment')!, Number(url.searchParams.get('row') ?? 0), Number(url.searchParams.get('seed') ?? 1)));
    if (url.pathname === '/api/sim') return send(200, sim(url.searchParams.get('space') ?? 'abstract-field', url.searchParams.get('setting') ?? 'oso', Number(url.searchParams.get('seed') ?? 1)));
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
