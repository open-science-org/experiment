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
import { expand, type ExperimentSpec, type Level } from '../experiments/experiment.ts';
import { expandPaths, getPath, merge } from '../engine/config.ts';
import { EXPERIMENTS_DIR, ROOT, SPACES_DIR } from '../paths.ts';
import { SENSITIVITY } from '../report/battery.ts';
import { worldFigure } from '../report/figures.ts';
import { anyComplete, checkSpace, generateSpace } from '../spaces/new-space.ts';
import { loadSpace, spaceAgents, spaceToYaml, withCalibratedBudget, type SpaceSpec } from '../spaces/spaces.ts';

export const SETTINGS: Record<string, string> = {
  traditional: 'Traditional', oso: 'OSO (immediate)', osoChoice: 'OSO (choice)',
  creditOnly: 'Flow-back, finished-only', sharingOnly: 'No flow-back, immediate', traditionalChoice: 'No flow-back, choice',
};

export interface Parameter {
  path: string;
  label: string;
  /** One line: what it is. */
  short: string;
  /** A paragraph: what it does in a run, and why it matters. */
  explain: string;
  group: 'market' | 'guess' | 'field';
  min: number; max: number; step: number;
  integer?: boolean;
  /** α and c exist only under OSO's flow-back rules: they never change the traditional settings. */
  flowBack?: boolean;
  /** Values suggested when the parameter is varied. */
  values: number[];
}

/** Every parameter the designer offers, with its range and a plain explanation. */
export const PARAMETERS: Parameter[] = [
  { path: 'rules.alpha', label: 'α, retention', group: 'market', min: 0.05, max: 1, step: 0.05, flowBack: true, values: [0.2, 0.4, 0.6, 0.8],
    short: 'share of the value reaching a result that its authors keep',
    explain: 'When value reaches a result, from a bounty or from later work, its authors keep α of it. The rest flows back to the results it built on, split by how much it used each, and on down the tree. Lower α pays foundational work more, which is what is meant to make agents share it. Only the OSO settings have flow-back; traditional rules are α = 1.' },
  { path: 'rules.c', label: 'c, cited share of the mint', group: 'market', min: 0, max: 0.6, step: 0.05, flowBack: true, values: [0, 0.15, 0.3, 0.5],
    short: 'share of each new mint paid to the results it built on',
    explain: 'Every validated result mints tokens. Its authors get 1 − c; the other c goes to the results it built on and flows on down from there. So a result earns each time someone builds on it, long before any bounty is won. Traditional rules are c = 0.' },
  { path: 'rules.mint', label: 'mint per result', group: 'market', min: 0, max: 5, step: 0.25, values: [0, 0.5, 1, 2],
    short: 'tokens created for each validated result',
    explain: 'Paid to a result\'s authors (and, through c, to what it built on) when it is published. It pays for progress along the way, not only for prizes; it is also what gaming agents chase with trivial results. Bounties are a few units for the easiest target and double with each level.' },
  { path: 'rules.screen', label: 'θ, validation screen', group: 'market', min: 0, max: 1, step: 0.05, values: [0, 0.5, 0.9],
    short: 'chance validators reject a trivial result',
    explain: 'A trivial result adds nothing; it is submitted only to collect the mint. Validators reject it with chance θ. At low θ gaming pays, and under rules where compute follows earnings a gaming agent can capture much of the budget.' },
  { path: 'budget.allocation.rho', label: 'ρ, compute follows earnings', group: 'market', min: 0, max: 1, step: 0.05, values: [0, 0.5, 1],
    short: 'share of each round\'s compute given by recent earnings',
    explain: 'Each round, funders split the compute: 1 − ρ equally among agents, ρ in proportion to what each earned recently. High ρ concentrates money on whoever is winning, like funding a few big labs; ρ = 0 shares it equally.' },
  { path: 'budget.X', label: 'total budget', group: 'market', min: 10, max: 100000, step: 10, integer: true, values: [],
    short: 'all the compute the community gets for the whole run',
    explain: 'Each attempt costs the agent its cost per attempt (1 for most agents, less for cheap explorers). Every field\'s budget is set so OSO solves about 90% of its targets; less makes the race tighter, more lets both communities finish.' },
  { path: 'behaviour.psi', label: 'ψ, scoop risk', group: 'guess', min: 0, max: 0.95, step: 0.05, values: [0, 0.25, 0.5, 0.75],
    short: 'how likely agents think a shared lemma lets a rival win the target',
    explain: 'An agent that may choose whether to share a lemma weighs what sharing earns (the mint now, plus the value that will flow back if others build on it) against the risk that a rival uses it to reach the target first. ψ scales that risk. It matters only in the settings where agents choose.' },
  { path: 'behaviour.kappa', label: 'κ, value of being used', group: 'guess', min: 0, max: 5, step: 0.25, values: [0, 1, 2, 4],
    short: 'how much agents think publishing raises a lemma\'s use',
    explain: 'The other side of the sharing decision: how much an agent expects publishing to increase the value that later flows back to its lemma. Higher κ makes sharing look more attractive.' },
  { path: 'behaviour.perceptionNoise', label: 'σ₀, perception noise', group: 'guess', min: 0, max: 3, step: 0.1, values: [0, 0.5, 1, 2],
    short: 'how noisily agents see the value of what they could attempt',
    explain: 'Agents judge each result they could attempt by its expected value, seen with noise of this size. At 0 they see exactly; higher, they misjudge more often and spread effort onto worse options.' },
  { path: 'behaviour.policy.tau', label: 'τ, choice randomness', group: 'guess', min: 0.01, max: 2, step: 0.01, values: [0.05, 0.3, 1],
    short: 'how loosely agents follow their best option',
    explain: 'Agents choose among the results they could attempt with a softmax rule: near τ = 0 they almost always take the best-looking one; higher τ spreads attempts over good-enough options, more like a real community\'s variety.' },
  { path: 'attribution.noise', label: 'attribution error', group: 'guess', min: 0, max: 1, step: 0.05, values: [0, 0.1, 0.3, 0.6],
    short: 'error in the ledger\'s weights of what each result built on',
    explain: 'Flow-back is split by how much a result used each thing it built on. In Lean these weights are exact; elsewhere they are estimated. With error, part of the flow-back goes to the wrong results, which weakens the incentive to do foundational work.' },
  { path: 'knowledge.absorbCost', label: 'cost to absorb a result', group: 'guess', min: 0, max: 2, step: 0.05, values: [0, 0.25, 0.5, 1],
    short: 'compute an agent spends to take up each published result',
    explain: 'Before building on a published result, an agent must read and understand it. At 0 sharing is free; at 1, taking up a result costs as much as an attempt. This is the main cost of an open, crowded literature.' },
  { path: 'knowledge.errorRate', label: 'chance a proof is wrong', group: 'guess', min: 0, max: 0.5, step: 0.01, values: [0, 0.05, 0.1, 0.2],
    short: 'some results are wrong, and wrongness spreads',
    explain: 'With this chance a proof is wrong, and so is anything built on a wrong result. A target\'s check catches it: the target is rejected and the wrong results it rested on are retracted. Shared wrong results spread further, so this is the main risk of sharing.' },
  { path: 'success.p0', label: 'p₀, chance at level 1', group: 'field', min: 0.05, max: 1, step: 0.05, values: [0.3, 0.5, 0.8],
    short: 'chance an attempt at a level-1 result succeeds',
    explain: 'Each attempt succeeds with a chance that depends on the result\'s level: p₀ at level 1, then multiplied by η for each level up. A field that lists its results one by one may set some chances directly; those ignore p₀ and η.' },
  { path: 'success.eta', label: 'η, difficulty per level', group: 'field', min: 0.2, max: 0.95, step: 0.05, values: [0.4, 0.5, 0.6, 0.7],
    short: 'how much harder each level is than the one below',
    explain: 'A result at level ℓ succeeds with chance p₀ · η^(ℓ − 1) per attempt. Lower η makes deep results much harder, so building on others\' work matters more.' },
  { path: 'agents.mix.gamer', label: 'gaming agents', group: 'field', min: 0, max: 6, step: 1, integer: true, values: [0, 1, 2, 4],
    short: 'how many agents farm trivial results for the mint',
    explain: 'A gaming agent submits trivial results to collect the mint, and the validation screen θ is what stops it. Adding gaming agents adds to the community: the others stay.' },
];

/** The values a field uses for every parameter (α and c as under OSO's rules). */
export function fieldValues(id: string): Record<string, number> {
  const { space } = withCalibratedBudget(loadSpace(id));
  const sc = space.scenario as unknown as Record<string, unknown>;
  const osoRules = (parse(readFileSync(join(ROOT, 'config', 'presets.yaml'), 'utf8')) as Record<string, { rules: Record<string, number> }>).osoChoice.rules;
  return Object.fromEntries(PARAMETERS.map((p) => [p.path, p.flowBack ? osoRules[p.path.split('.')[1]] : Number(getPath(sc, p.path) ?? 0)]));
}

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
    flowBackSettings: FLOW_BACK,
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
  /** Fixed values that differ from the field's own. */
  set?: Record<string, number>;
  vary: { path: string; values: number[] }[];
  columns: string[];
  seeds: number;
}

/** The settings with OSO's flow-back (α < 1, c > 0); only these take α and c. */
const FLOW_BACK = ['oso', 'osoChoice', 'creditOnly'];

/**
 * The experiment file a design stands for. Rows: each rule setting, then each varied parameter.
 * α and c belong to the flow-back settings only: fixing or varying them changes those rows and leaves
 * the traditional ones as they are.
 */
export function experimentFor(d: Design): ExperimentSpec {
  if (!ID.test(d.id)) throw new Error('the experiment name must be kebab-case (a-z, 0-9, hyphens)');
  if (!d.settings.length) throw new Error('choose at least one rule setting');
  for (const s of d.settings) if (!SETTINGS[s]) throw new Error(`unknown setting ${s}`);
  if (!(d.seeds >= 1 && d.seeds <= 1000)) throw new Error('runs per row must be between 1 and 1000');
  const param = (path: string) => {
    const p = PARAMETERS.find((x) => x.path === path);
    if (!p) throw new Error(`unknown parameter ${path}`);
    return p;
  };
  const { space } = withCalibratedBudget(loadSpace(d.space));
  const fixed = Object.entries(d.set ?? {});
  for (const [path, v] of fixed) {
    const p = param(path);
    if (!Number.isFinite(v) || v < p.min || v > p.max) throw new Error(`${p.label} must be between ${p.min} and ${p.max}`);
  }
  const varied = d.vary.filter((v) => v.path && v.values.length);
  if (varied.length > 2) throw new Error('vary at most two parameters');
  for (const v of varied) {
    const p = param(v.path);
    for (const x of v.values) if (!Number.isFinite(x) || x < p.min || x > p.max) throw new Error(`${p.label}: ${x} is outside ${p.min} to ${p.max}`);
  }
  const fixedFlow = Object.fromEntries(fixed.filter(([path]) => param(path).flowBack));
  const fixedOther = Object.fromEntries(fixed.filter(([path]) => !param(path).flowBack));
  const variedFlow = varied.filter((v) => param(v.path).flowBack);
  const variedOther = varied.filter((v) => !param(v.path).flowBack);
  // Flow-back settings × every combination of varied α and c; other settings once.
  let combos: { label: string; set: Record<string, number> }[] = [{ label: '', set: {} }];
  for (const v of variedFlow) {
    const name = param(v.path).label.split(',')[0];
    combos = combos.flatMap((c) => v.values.map((x) => ({ label: `${c.label}, ${name} = ${x}`, set: { ...c.set, [v.path]: x } })));
  }
  const levels: Level[] = d.settings.flatMap((s) => (FLOW_BACK.includes(s)
    ? combos.map((c) => ({ label: SETTINGS[s] + c.label, preset: s, ...(Object.keys(fixedFlow).length || Object.keys(c.set).length ? { set: { ...fixedFlow, ...c.set } } : {}) }))
    : [{ label: SETTINGS[s], preset: s }]));
  const changed = fixed.map(([path, v]) => `${param(path).label} = ${v}`);
  return {
    id: d.id,
    title: d.title || d.id,
    description: `Designed in the app on the field "${space.spec.title}" (spaces/${d.space}.yaml): ${d.settings.map((s) => SETTINGS[s]).join(' vs ')}${varied.length ? `, varying ${varied.map((v) => param(v.path).label).join(' and ')}` : ''}${changed.length ? `; with ${changed.join(', ')}` : ''}. α and c apply to the OSO (flow-back) settings only.`,
    seeds: d.seeds,
    ...(space.spec.scenarioFile ? { scenario: space.spec.scenarioFile } : {}),
    set: merge(expandPaths(space.spec.scenario ?? {}), expandPaths(fixedOther)) as Record<string, unknown>,
    factors: [
      { name: 'setting', levels },
      ...variedOther.map((v) => ({ name: param(v.path).label, path: v.path, values: v.values })),
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
