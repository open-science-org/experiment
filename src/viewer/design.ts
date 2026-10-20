// Designing experiments in the app: fields (problem spaces) and experiments, checked, saved and run.
// Heavy work (reports, experiments) runs as a child process of the command line, so results are
// saved exactly as `npm run sim` saves them; drafting a field with a model runs in this process.
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse, stringify } from 'yaml';
import { COLUMNS } from '../engine/measures.ts';
import { Rng } from '../engine/rng.ts';
import { worlds } from '../engine/world.ts';
import { expand, type ExperimentSpec } from '../experiments/experiment.ts';
import { EXPERIMENTS_DIR, ROOT, SPACES_DIR } from '../paths.ts';
import { SENSITIVITY } from '../report/battery.ts';
import { worldFigure } from '../report/figures.ts';
import { anyComplete, checkSpace, generateSpace } from '../spaces/new-space.ts';
import { loadSpace, spaceAgents, spaceToYaml, withCalibratedBudget, type SpaceSpec } from '../spaces/spaces.ts';

export const SETTINGS: Record<string, string> = {
  traditional: 'Traditional', oso: 'OSO (immediate)', osoChoice: 'OSO (choice)',
  creditOnly: 'Flow-back, finished-only', sharingOnly: 'No flow-back, immediate', traditionalChoice: 'No flow-back, choice',
};

/** Parameters the designer offers to vary: the report's sensitivity set plus a few more. */
const PARAMETERS = [
  ...SENSITIVITY.map((p) => ({ path: p.path, label: p.label, meaning: p.meaning, values: p.values, group: p.group })),
  { path: 'knowledge.absorbCost', label: 'cost to absorb a result', meaning: 'compute an agent spends to take up each published result', values: [0, 0.25, 0.5, 1], group: 'guess' },
  { path: 'knowledge.errorRate', label: 'chance a proof is wrong', meaning: 'wrong results spread to what builds on them; targets catch them', values: [0, 0.05, 0.1, 0.2], group: 'guess' },
  { path: 'budget.X', label: 'total budget X', meaning: 'total compute for the whole community', values: [], group: 'market' },
  { path: 'success.eta', label: 'η, difficulty per level', meaning: 'success chance falls by this factor per level (lower: steeper)', values: [0.4, 0.5, 0.6, 0.7], group: 'guess' },
  { path: 'agents.mix.gamer', label: 'gaming agents', meaning: 'how many agents farm trivial results for the mint', values: [0, 1, 2, 4], group: 'guess' },
];

const COLUMN_INFO: Record<string, string> = {
  frontier: 'hardest level published', deepestProved: 'deepest level proved by anyone', reachTarget: 'share of runs reaching the main level',
  speed: 'rounds to reach the main level', cost: 'compute to reach the main level', spend: 'compute spent', productivity: 'results per 100 compute',
  breadth: 'share of targets solved', waste: 'share of compute on results no target needed', credit: 'how well bounty pay matches contribution',
  sharing: 'share of intermediate results published at once', hoarded: 'results proved but never published', reuse: 'how often published results were built on',
  duplicates: 'proofs of already-published results', targetsSolved: 'targets solved', gamerShare: "the gamer's share of compute",
  trivialSpend: 'compute spent on trivial results', rejected: 'targets rejected for resting on wrong results', retracted: 'results retracted as wrong', absorbSpend: 'compute spent absorbing published results',
};

export function options() {
  return {
    settings: SETTINGS,
    parameters: PARAMETERS,
    columns: Object.keys(COLUMNS).map((id) => ({ id, meaning: COLUMN_INFO[id] ?? id })),
    defaultColumns: ['frontier', 'reachTarget', 'cost', 'targetsSolved', 'sharing'],
    template: spaceToYaml({
      id: 'my-field', title: 'My field', summary: 'One sentence about the field.',
      description: 'What the field is, its stages or areas, and what progress means in it.',
      glossary: { result: 'a finding later work can build on', target: 'a prize-carrying finding', attempt: 'one try at a finding' },
      areas: ['area 1', 'area 2'],
      scenario: { world: { kind: 'layered', levels: 6, width: 8, maxPrereqs: 2, areas: 2, targets: [{ level: 6, count: 2 }], bountyBase: 4, bountyGrowth: 2 }, success: { p0: 0.5, eta: 0.55 }, measures: { targetLevel: 5 } },
      notes: 'Which numbers are guesses.',
    } as SpaceSpec),
  };
}

const ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Validates a field's YAML, test-runs it, calibrates its budget if needed, and draws its tree. */
export function checkField(yamlText: string) {
  try {
    const space = checkSpace(yamlText);
    const { space: ready, calibrated } = withCalibratedBudget(space);
    const sc = ready.scenario;
    const w = worlds.create(sc.world, 'world')(sc.success, new Rng(1).fork(1));
    return {
      ok: true, id: space.spec.id, title: space.spec.title, exists: existsSync(join(SPACES_DIR, `${space.spec.id}.yaml`)),
      summary: { results: w.n, levels: w.levels, targets: w.targets.length, deadEnds: w.deadEnd.filter(Boolean).length, agents: spaceAgents(ready), budget: sc.budget.X, calibrated },
      svg: worldFigure(w, `The research tree: ${space.spec.title}`, space.spec.areas),
    };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export function saveField(yamlText: string, overwrite = false) {
  const space = checkSpace(yamlText);
  const path = join(SPACES_DIR, `${space.spec.id}.yaml`);
  if (existsSync(path) && !overwrite) throw new Error(`a field called "${space.spec.id}" already exists; change its id, or save over it`);
  writeFileSync(path, yamlText.endsWith('\n') ? yamlText : `${yamlText}\n`);
  return { id: space.spec.id };
}

export function fieldYaml(id: string): string {
  if (!ID.test(id)) throw new Error('bad id');
  return readFileSync(join(SPACES_DIR, `${id}.yaml`), 'utf8');
}

export interface Design {
  id: string;
  title: string;
  space: string;
  settings: string[];
  vary: { path: string; values: number[] }[];
  columns: string[];
  seeds: number;
}

/** The experiment file a design stands for: the field's settings, then a rule setting, then each varied parameter. */
export function experimentFor(d: Design): ExperimentSpec {
  if (!ID.test(d.id)) throw new Error('the experiment id must be kebab-case (a-z, 0-9, hyphens)');
  if (!d.settings.length) throw new Error('choose at least one rule setting');
  for (const s of d.settings) if (!SETTINGS[s]) throw new Error(`unknown setting ${s}`);
  if (!(d.seeds >= 1 && d.seeds <= 1000)) throw new Error('runs per row must be between 1 and 1000');
  const { space } = withCalibratedBudget(loadSpace(d.space));
  const label = (path: string) => PARAMETERS.find((p) => p.path === path)?.label ?? path;
  const varied = d.vary.filter((v) => v.path && v.values.length);
  return {
    id: d.id,
    title: d.title || d.id,
    description: `Designed in the app on the field "${space.spec.title}" (spaces/${d.space}.yaml): ${d.settings.map((s) => SETTINGS[s]).join(' vs ')}${varied.length ? `, varying ${varied.map((v) => label(v.path)).join(' and ')}` : ''}. A varied parameter overrides the rule setting's own value.`,
    seeds: d.seeds,
    ...(space.spec.scenarioFile ? { scenario: space.spec.scenarioFile } : {}),
    set: space.spec.scenario ?? {},
    factors: [
      { name: 'setting', levels: d.settings.map((s) => ({ label: SETTINGS[s], preset: s })) },
      ...varied.map((v) => ({ name: label(v.path), path: v.path, values: v.values })),
    ],
    columns: d.columns.length ? d.columns : options().defaultColumns,
  };
}

export function checkExperiment(d: Design) {
  try {
    const spec = experimentFor(d);
    const rows = expand(spec);
    return { ok: true, rows: rows.length, runs: rows.length * spec.seeds, exists: existsSync(join(EXPERIMENTS_DIR, `${d.id}.yaml`)), yaml: stringify(spec, { lineWidth: 100 }), labels: rows.slice(0, 40).map((r) => r.labels) };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

/* -------------------------------------------------------------------------------- Background jobs */

export interface Job { id: string; kind: string; title: string; status: 'running' | 'done' | 'failed'; log: string[]; result?: unknown; startedAt: number; endedAt?: number }
const jobs = new Map<string, Job>();
let counter = 0;

function newJob(kind: string, title: string): Job {
  const job: Job = { id: `${Date.now().toString(36)}-${++counter}`, kind, title, status: 'running', log: [], startedAt: Date.now() };
  jobs.set(job.id, job);
  return job;
}

/** Runs the command line (`node src/cli.ts …`) as a child process, streaming its output into the job. */
function cliJob(kind: string, title: string, args: string[], result: () => unknown): Job {
  const job = newJob(kind, title);
  const child = spawn(process.execPath, ['--env-file-if-exists=.env', 'src/cli.ts', ...args], { cwd: ROOT });
  const take = (data: Buffer) => { for (const line of data.toString().split('\n')) if (line.trim()) job.log.push(line); };
  child.stdout.on('data', take);
  child.stderr.on('data', take);
  child.on('close', (code) => {
    job.endedAt = Date.now();
    if (code === 0) { job.status = 'done'; job.result = result(); } else { job.status = 'failed'; job.log.push(`exited with code ${code}`); }
  });
  return job;
}

export function runExperimentJob(d: Design, overwrite = false): Job {
  const spec = experimentFor(d);
  const file = join(EXPERIMENTS_DIR, `${spec.id}.yaml`);
  if (existsSync(file) && !overwrite) throw new Error(`an experiment called "${spec.id}" already exists; change its id, or run over it`);
  writeFileSync(file, `# Designed in the experiment app.\n${stringify(spec, { lineWidth: 100 })}`);
  return cliJob('experiment', `Experiment: ${spec.title}`, [spec.id, '--save'], () => ({ doc: `results/${spec.id}/summary.md` }));
}

export function buildReportJob(space: string, seeds: number): Job {
  if (!ID.test(space)) throw new Error('bad field id');
  return cliJob('report', `Standard report: ${space}`, ['report', space, '--seeds', String(Math.max(10, Math.min(500, seeds)))], () => ({ doc: `reports/${space}/report.md` }));
}

export function generateFieldJob(description: string): Job {
  if (description.trim().length < 20) throw new Error('describe the field in at least a sentence');
  const job = newJob('generate', `Draft a field: ${description.slice(0, 60)}`);
  (async () => {
    try {
      const { complete, via } = await anyComplete((m) => job.log.push(m.trim()));
      const space = await generateSpace(description, complete, { log: (s) => job.log.push(s.trim()), via });
      job.result = { yaml: spaceToYaml(space.spec) };
      job.status = 'done';
    } catch (e) {
      job.log.push((e as Error).message);
      job.status = 'failed';
    }
    job.endedAt = Date.now();
  })();
  return job;
}

export function getJob(id: string): Job {
  const job = jobs.get(id);
  if (!job) throw new Error('no such job');
  return job;
}

export function listJobs(): Job[] {
  return [...jobs.values()].sort((a, b) => b.startedAt - a.startedAt).slice(0, 20).map((j) => ({ ...j, log: j.log.slice(-3) }));
}

export { parse as parseYaml };
