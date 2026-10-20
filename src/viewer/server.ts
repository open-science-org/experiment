// The experiment viewer: `npm run viewer`, then open http://127.0.0.1:8791.
// Plays back simulated runs round by round (traced on demand), and Lean pilot runs, live or after the
// fact. It listens on this machine only: pilot transcripts contain proofs, which are private.
import { createServer } from 'node:http';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, normalize, relative } from 'node:path';
import { marked } from 'marked';
import { ROOT, REPORTS_DIR, RESULTS_DIR } from '../paths.ts';
import { loadScenario, expandPaths } from '../engine/config.ts';
import { traceRun } from '../engine/model.ts';
import { preset } from '../experiments/experiment.ts';
import { loadSpace, spaceIds, withCalibratedBudget, type Space } from '../spaces/spaces.ts';
import { LEAN_DIR, leanAvailable, loadTasks } from '../lean/tasks.ts';
import * as design from './design.ts';

const PORT = Number(process.env.PORT ?? 8791);
/** Folders the viewer may serve files and documents from. Never lean/ (private) or .env. */
const PUBLIC_DIRS = ['reports', 'results', 'docs', 'worlds', 'config', 'spaces'];
const TYPES: Record<string, string> = { '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.md': 'text/plain; charset=utf-8', '.yaml': 'text/plain; charset=utf-8', '.jsonl': 'text/plain; charset=utf-8', '.py': 'text/plain; charset=utf-8' };

/** A repository path, if it is inside a public folder. */
function publicPath(path: string): string | null {
  const rel = normalize(path).replace(/^(\.\.\/)+/, '');
  if (rel.startsWith('/') || rel.includes('..') || !PUBLIC_DIRS.includes(rel.split('/')[0])) return null;
  const full = join(ROOT, rel);
  return existsSync(full) ? full : null;
}

/** A Markdown document rendered to HTML, with images and links pointing back into the viewer. */
function doc(path: string): { path: string; title: string; html: string } {
  const full = publicPath(path);
  if (!full || !full.endsWith('.md')) throw new Error(`no such document: ${path}`);
  const md = readFileSync(full, 'utf8');
  const base = dirname(relative(ROOT, full));
  const resolve = (href: string) => normalize(join(base, href));
  let html = marked.parse(md, { async: false }) as string;
  html = html.replace(/(src|href)="([^"#:]+?)(#[^"]*)?"/g, (m, attr, href, hash = '') => {
    if (/^(https?:|mailto:|\/)/.test(href)) return m;
    const target = resolve(href);
    if (!publicPath(target)) return `${attr}="#" data-missing="${target}"`;
    if (attr === 'href' && target.endsWith('.md')) return `href="#/doc/${target}"`;
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
  return { fields, pilot: pilot.sort((a, b) => b.modified - a.modified), experiments, comparison: comparison ? doc(`results/pilot/${comparison.id}/summary.md`) : null, comparisonData, comparisonPath: comparison ? `results/pilot/${comparison.id}/summary.md` : null };
}
const PAGE = new URL('./index.html', import.meta.url).pathname;
const SETTINGS: Record<string, string> = { traditional: 'Traditional', oso: 'OSO (immediate)', osoChoice: 'OSO (choice)', creditOnly: 'Flow-back, finished-only', sharingOnly: 'No flow-back, immediate', traditionalChoice: 'No flow-back, choice' };

const spaces = new Map<string, Space>();
function space(id: string): Space {
  if (!spaces.has(id)) spaces.set(id, withCalibratedBudget(loadSpace(id)).space);
  return spaces.get(id)!;
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
  return readdirSync(dir).filter((d) => existsSync(join(dir, d, 'options.json'))).map((d) => {
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
      if (url.pathname === '/api/reports/build') return job(design.buildReportJob(String(b.space ?? ''), Number(b.seeds ?? 100)));
      return send(404, { error: 'not found' });
    }
    if (url.pathname === '/api/design/options') return send(200, design.options());
    if (url.pathname === '/api/design/field') return send(200, design.fieldValues(url.searchParams.get('id') ?? ''));
    if (url.pathname === '/api/spaces/yaml') return send(200, { yaml: design.fieldYaml(url.searchParams.get('id') ?? '') });
    if (url.pathname === '/api/jobs') return send(200, design.listJobs());
    if (url.pathname.startsWith('/api/jobs/')) return send(200, design.getJob(url.pathname.slice('/api/jobs/'.length)));
    if (url.pathname === '/') return send(200, readFileSync(PAGE, 'utf8'), 'text/html; charset=utf-8');
    if (url.pathname === '/api/overview') return send(200, overview());
    if (url.pathname === '/api/doc') return send(200, doc(url.searchParams.get('path') ?? ''));
    if (url.pathname.startsWith('/files/')) {
      const full = publicPath(decodeURIComponent(url.pathname.slice('/files/'.length)));
      if (!full || statSync(full).isDirectory()) return send(404, { error: 'not found' });
      return send(200, (extname(full) === '.png' ? readFileSync(full) : readFileSync(full, 'utf8')), TYPES[extname(full)] ?? 'text/plain; charset=utf-8');
    }
    if (url.pathname === '/api/spaces') return send(200, spaceIds().map((id) => ({ id, title: loadSpace(id).spec.title })));
    if (url.pathname === '/api/settings') return send(200, SETTINGS);
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
