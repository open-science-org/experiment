// The experiment viewer: `npm run viewer`, then open http://127.0.0.1:8791.
// Plays back simulated runs round by round (traced on demand), and Lean pilot runs, live or after the
// fact. It listens on this machine only: pilot transcripts contain proofs, which are private.
import { createServer } from 'node:http';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { loadScenario, expandPaths } from '../engine/config.ts';
import { traceRun } from '../engine/model.ts';
import { preset } from '../experiments/experiment.ts';
import { loadSpace, spaceIds, withCalibratedBudget, type Space } from '../spaces/spaces.ts';
import { LEAN_DIR, leanAvailable, loadTasks } from '../lean/tasks.ts';

const PORT = Number(process.env.PORT ?? 8791);
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

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://127.0.0.1:${PORT}`);
  const send = (status: number, body: unknown, type = 'application/json') => {
    res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    res.end(type === 'application/json' ? JSON.stringify(body) : body);
  };
  try {
    if (url.pathname === '/') return send(200, readFileSync(PAGE, 'utf8'), 'text/html; charset=utf-8');
    if (url.pathname === '/api/spaces') return send(200, spaceIds().map((id) => ({ id, title: loadSpace(id).spec.title })));
    if (url.pathname === '/api/settings') return send(200, SETTINGS);
    if (url.pathname === '/api/sim') return send(200, sim(url.searchParams.get('space') ?? 'abstract-field', url.searchParams.get('setting') ?? 'oso', Number(url.searchParams.get('seed') ?? 1)));
    if (url.pathname === '/api/pilot/runs') return send(200, leanAvailable() ? pilotRuns() : []);
    if (url.pathname === '/api/pilot/run') return send(200, pilotRun(url.searchParams.get('id') ?? ''));
    send(404, { error: 'not found' });
  } catch (e) {
    send(500, { error: (e as Error).message });
  }
});
server.listen(PORT, '127.0.0.1', () => console.log(`Experiment viewer: http://127.0.0.1:${PORT}`));
