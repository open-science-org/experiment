// Designing experiments in the app: fields (problem spaces) and experiments, checked, saved and run.
// Heavy work (reports, experiments) runs as a child process of the command line, so results are
// saved exactly as `npm run sim` saves them; drafting a field with a model runs in this process.
import { spawn } from 'node:child_process';
import { existsSync, openSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse, stringify } from 'yaml';
import { loadTasks } from '../lean/tasks.ts';
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
];

/** The eight traits of a simulated agent (docs/simulator.md, section 2.2). */
export const TRAITS = [
  { key: 'skill', label: 'skill', min: 0.1, max: 2, step: 0.05, explain: 'Multiplies the chance that an attempt succeeds: chance = skill × the result\'s base chance (at most 1).' },
  { key: 'conjecture', label: 'conjecture quality', min: 0, max: 1, step: 0.05, explain: 'How accurately the agent sees what a result is worth before trying it. At 1 it sees exactly; lower, it misjudges by more (see σ₀, perception noise).' },
  { key: 'cost', label: 'cost per attempt', min: 0.1, max: 3, step: 0.05, explain: 'Compute units one attempt costs this agent. A cheap explorer tries more often with the same budget.' },
  { key: 'horizon', label: 'horizon', min: 0.5, max: 1, step: 0.01, explain: 'How much the agent values later payoffs: value arriving t rounds from now counts × horizon^t. Near 1 it is patient (foundations pay off late); lower, it wants returns now.' },
  { key: 'risk', label: 'risk attitude', min: -1, max: 1, step: 0.05, explain: 'Penalty on uncertain payoffs. Positive: cautious, prefers likely successes. Negative: risk-seeking, goes for long shots such as hard targets.' },
  { key: 'reuse', label: 'reuse', min: 0, max: 1, step: 0.05, explain: 'Chance each round of taking up a result someone else published, so that it can build on it. Low reuse means ignoring others\' work.' },
  { key: 'sharing', label: 'sharing', min: -1, max: 1, step: 0.05, explain: 'Intrinsic value the agent puts on publishing, in units of the mint: positive likes sharing (as many scientists do), negative dislikes it (a free rider). It matters when agents choose what to publish.' },
  { key: 'gaming', label: 'gaming', min: 0, max: 1, step: 0.05, explain: 'Share of the agent\'s attempts spent submitting trivial results to collect the mint. The validation screen θ decides how often that pays.' },
];

/** A field's agents: their kinds with traits, and how many of each. */
export function fieldAgents(id: string) {
  const { space } = withCalibratedBudget(loadSpace(id));
  const a = space.scenario.agents;
  return { archetypes: a.archetypes, mix: a.mix, specialist: a.specialist };
}

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
  duplicates: 'proofs of already-published results', targetsSolved: 'targets solved', gamerShare: "the gamer's share of all pay",
  trivialSpend: 'compute spent on trivial results', rejected: 'targets rejected for resting on wrong results', retracted: 'results retracted as wrong', absorbSpend: 'compute spent absorbing published results',
};

export function options() {
  return {
    settings: SETTINGS,
    parameters: PARAMETERS,
    traits: TRAITS,
    personas: PERSONAS,
    personaFeatures: PERSONA_FEATURES,
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
  /** Declared before running: the question and the main measure (a column id). */
  question?: string;
  measure?: string;
  /** The community, if changed: every kind's traits and how many of each (the whole mix). */
  agents?: { archetypes: Record<string, Record<string, number | boolean>>; mix: Record<string, number> };
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
  let agents: Record<string, unknown> = {};
  if (d.agents) {
    const { archetypes, mix } = d.agents;
    for (const [name, t] of Object.entries(archetypes)) {
      if (!/^[A-Za-z][\w]*$/.test(name)) throw new Error(`agent kind "${name}": use letters and digits only`);
      for (const tr of TRAITS) {
        const v = Number(t[tr.key]);
        if (!Number.isFinite(v) || v < tr.min || v > tr.max) throw new Error(`${name}: ${tr.label} must be between ${tr.min} and ${tr.max}`);
      }
    }
    // The mix is replaced whole: kinds the field had but the design leaves out get 0.
    const full = Object.fromEntries([...new Set([...Object.keys(space.scenario.agents.mix), ...Object.keys(mix)])].map((k) => [k, Math.max(0, Math.round(Number(mix[k] ?? 0)))]));
    for (const [k, n] of Object.entries(full)) {
      if (n > 50) throw new Error(`${k}: at most 50 agents of one kind`);
      if (n > 0 && !archetypes[k] && !space.scenario.agents.archetypes[k]) throw new Error(`unknown agent kind ${k}`);
    }
    if (!Object.values(full).some((n) => n > 0)) throw new Error('the community needs at least one agent');
    agents = { agents: { archetypes, mix: full } };
    changed.push(`agents: ${Object.entries(full).filter(([, n]) => n).map(([k, n]) => `${n} ${k}`).join(', ')}`);
  }
  return {
    id: d.id,
    title: d.title || d.id,
    description: `Designed in the app on the field "${space.spec.title}" (spaces/${d.space}.yaml): ${d.settings.map((s) => SETTINGS[s]).join(' vs ')}${varied.length ? `, varying ${varied.map((v) => param(v.path).label).join(' and ')}` : ''}${changed.length ? `; with ${changed.join(', ')}` : ''}. α and c apply to the OSO (flow-back) settings only.`,
    seeds: d.seeds,
    ...(space.spec.scenarioFile ? { scenario: space.spec.scenarioFile } : {}),
    set: merge(merge(expandPaths(space.spec.scenario ?? {}), expandPaths(fixedOther)), agents) as Record<string, unknown>,
    factors: [
      { name: 'setting', levels },
      ...variedOther.map((v) => ({ name: param(v.path).label, path: v.path, values: v.values })),
    ],
    columns: d.columns.length ? d.columns : options().defaultColumns,
    question: d.question || d.title || `${d.settings.map((s) => SETTINGS[s]).join(' vs ')} on ${space.spec.title}: which gets furthest?`,
    compare: `${d.settings.map((s) => SETTINGS[s]).join(', ')}${varied.length ? `, by ${varied.map((v) => param(v.path).label).join(' and ')}` : ''}`,
    fixed: `the field "${space.spec.title}"${changed.length ? `, with ${changed.join(', ')}` : ''}`,
    measure: d.measure && COLUMNS[d.measure] ? d.measure : (d.columns[0] ?? 'frontier'),
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
function cliJob(kind: string, title: string, args: string[], result: () => unknown, script = 'src/cli.ts'): Job {
  const job = newJob(kind, title);
  const child = spawn(process.execPath, ['--env-file-if-exists=.env', script, ...args], { cwd: ROOT });
  const take = (data: Buffer) => { for (const line of data.toString().split('\n')) if (line.trim()) job.log.push(line); };
  child.stdout.on('data', take);
  child.stderr.on('data', take);
  child.on('close', (code) => {
    job.endedAt = Date.now();
    if (code === 0) { job.status = 'done'; job.result = result(); } else { job.status = 'failed'; job.log.push(`exited with code ${code}`); }
  });
  return job;
}

/**
 * A persona: how a real AI lab behaves, separate from its model (what it is capable of and costs).
 * "Instructed" features become sentences in the lab's instructions, generated from their values, so a
 * persona means the same thing in every run; "enforced" features are set by the harness, whatever the
 * model does.
 */
export interface Persona {
  name: string;
  /** 0: safe bets … 1: long shots. */ risk: number;
  /** 0: what pays now … 1: patient. */ horizon: number;
  /** 0: no gaming … 1: farms easy results. */ gaming: number;
  focus: 'any' | 'A' | 'B' | 'C';
  /** Enforced: whether it sees and may cite other labs' published results. */ reuse: boolean;
  /** Enforced: repairs per action. */ persistence: number;
  /** Enforced: reasoning effort. */ thoroughness: 'low' | 'medium' | 'high';
}

export const PERSONA_FEATURES = [
  { key: 'risk', label: 'risk attitude', kind: 'instructed', type: 'slider', left: 'safe bets', right: 'long shots', explain: 'Whether the lab goes for results it is likely to prove, or for the hard, high-bounty targets even when it may fail.' },
  { key: 'horizon', label: 'horizon', kind: 'instructed', type: 'slider', left: 'what pays now', right: 'patient', explain: 'Whether the lab spends on lemmas that pay off later (a foundation builder) or only on what earns now (a racer).' },
  { key: 'gaming', label: 'gaming', kind: 'instructed', type: 'slider', left: 'none', right: 'farms easy results', explain: 'Whether the lab tries to earn by publishing many easy results. A result one basic tactic proves earns nothing, so this tests how easy the screen is to beat.' },
  { key: 'focus', label: 'focus', kind: 'instructed', type: 'select', options: { any: 'all areas', A: 'the sequence (A)', B: 'sorting (B)', C: 'matrices (C)' }, explain: 'Whether the lab works on one area only, like a specialist.' },
  { key: 'reuse', label: 'reuse', kind: 'enforced', type: 'toggle', explain: 'Whether the lab is shown, and may cite, other labs\' published results. Off: it works alone even under OSO. Enforced by the harness, not just asked for.' },
  { key: 'persistence', label: 'persistence', kind: 'enforced', type: 'number', min: 0, max: 5, explain: 'How many times the lab may repair a proof Lean rejected, within one action.' },
  { key: 'thoroughness', label: 'thoroughness', kind: 'enforced', type: 'select', options: { low: 'low', medium: 'medium', high: 'high' }, explain: 'The model\'s reasoning effort: how long it thinks before each reply. More thinking costs more.' },
  { key: 'sharing', label: 'sharing', kind: 'unavailable', type: 'none', explain: 'Whether the lab publishes or holds back its results. Not yet available: under OSO every result is published at once; it needs a setting where labs choose what to publish.' },
] as const;

const neutral: Omit<Persona, 'name'> = { risk: 0.5, horizon: 0.5, gaming: 0, focus: 'any', reuse: true, persistence: 2, thoroughness: 'medium' };
export const PERSONAS: Persona[] = [
  { name: 'Neutral', ...neutral },
  { name: 'Foundation builder', ...neutral, risk: 0.3, horizon: 0.95, thoroughness: 'high', persistence: 3 },
  { name: 'Target racer', ...neutral, risk: 0.8, horizon: 0.1 },
  { name: 'Cheap explorer', ...neutral, risk: 0.2, horizon: 0.4, thoroughness: 'low', persistence: 1 },
  { name: 'Specialist: sequence', ...neutral, focus: 'A', horizon: 0.7 },
  { name: 'Specialist: sorting', ...neutral, focus: 'B', horizon: 0.7 },
  { name: 'Specialist: matrices', ...neutral, focus: 'C', horizon: 0.7 },
  { name: 'Lone wolf', ...neutral, reuse: false },
  { name: 'Gamer', ...neutral, gaming: 0.9, risk: 0.1, horizon: 0.1, thoroughness: 'low', persistence: 1 },
];

/** The instructions a persona's features produce (the enforced features are not in the text). */
export function personaText(p: Persona): string {
  const out: string[] = [];
  if (p.risk <= 0.33) out.push('Prefer results you are likely to prove; avoid long shots.');
  if (p.risk >= 0.67) out.push('Go for the hard, high-bounty targets, even when you may well fail.');
  if (p.horizon >= 0.67) out.push('Be patient: lemmas that later results can build on are worth your budget even if no target is in reach yet.');
  if (p.horizon <= 0.33) out.push('Go for what pays now: attempt targets within reach, and prove a lemma only when a target needs it.');
  if (p.gaming >= 0.67) out.push('Earn by publishing as many easy results as you can: quantity over depth.');
  else if (p.gaming >= 0.34) out.push('Easy results that earn the mint are worth publishing when you see them.');
  const areas = { A: 'the sequence u (area A)', B: 'sorting: isort, msort, Sorted and cnt (area B)', C: '2 × 2 matrices, M2 (area C)' } as const;
  if (p.focus !== 'any') out.push(`Work only on ${areas[p.focus]}.`);
  if (!p.reuse) out.push('You work alone: you cannot see other labs\' results.');
  return out.join(' ');
}

/**
 * A race, designed in advance: labs (each a model and a persona), the budget per lab, rounds, which rules;
 * the question, the counted targets, which lemmas to post as conjectures, and how many runs per side.
 */
export interface RaceDesign {
  id: string; labs: { model: string; persona: Persona }[]; budget: number; rounds: number; rules: ('traditional' | 'oso')[];
  question?: string; counted?: string[]; conjectures?: 'none' | 'direct' | 'all'; repeats?: number;
}

/** Posted conjectures for a design: the lemmas the counted targets use directly, or every lemma they rest on (public ids). */
export function conjecturesFor(counted: string[], mode: RaceDesign['conjectures']): string[] {
  if (!mode || mode === 'none') return [];
  const tasks = loadTasks();
  const id = new Map(tasks.map((t) => [t.name, t.publicId]));
  const by = new Map(tasks.map((t) => [t.publicId, t]));
  const out = new Set<string>();
  for (const c of counted) {
    const t = by.get(c);
    if (!t) continue;
    for (const u of mode === 'all' ? t.ancestors : t.uses) {
      const p = id.get(u);
      if (p && !by.get(p)!.posted) out.add(p);
    }
  }
  return [...out];
}

/** From the model pilot: per posted target, how often a model proved it alone and with its lemmas, and the suggested counted targets. */
export function suggestCounted(model: string) {
  const dir = join(ROOT, 'lean', 'runs');
  const runs = existsSync(dir) ? readdirSync(dir).filter((d) => d.startsWith('panel-') && existsSync(join(dir, d, 'options.json')) && existsSync(join(dir, d, 'attempts.jsonl'))) : [];
  const run = runs.find((d) => JSON.parse(readFileSync(join(dir, d, 'options.json'), 'utf8')).model?.model === model);
  if (!run) return { model, run: null, targets: [], counted: [] };
  const recs = readFileSync(join(dir, run, 'attempts.jsonl'), 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l) as { publicId: string; posted: string; condition: string; ok: boolean });
  const targets = loadTasks().filter((t) => t.posted).map((t) => {
    const rs = recs.filter((r) => r.publicId === t.publicId);
    const cell = (c: string) => { const x = rs.filter((r) => r.condition === c); return { proved: x.filter((r) => r.ok).length, attempts: x.length }; };
    return { id: t.publicId, depth: t.depth, alone: cell('alone'), library: cell('library') };
  });
  // Counted: proved with lemmas at least once, never alone; the rest are warm-ups or out of reach.
  const counted = targets.filter((t) => t.alone.attempts > 0 && t.alone.proved === 0 && t.library.proved > 0).map((t) => t.id);
  return { model, run, targets, counted };
}

/** Starts a race of real AI labs (spends money: the page confirms the maximum first). */
export function startRaceJob(d: RaceDesign): Job {
  if (!ID.test(d.id)) throw new Error('the run name must be kebab-case (a-z, 0-9, hyphens)');
  if (!d.labs.length || d.labs.length > 12) throw new Error('between 1 and 12 labs');
  if (!(d.budget > 0 && d.budget <= 20)) throw new Error('budget per lab must be between $0 and $20');
  if (!(d.rounds >= 1 && d.rounds <= 200)) throw new Error('rounds must be between 1 and 200');
  for (const l of d.labs) {
    const p = l.persona;
    if (![p.risk, p.horizon, p.gaming].every((x) => x >= 0 && x <= 1)) throw new Error('risk, horizon and gaming go from 0 to 1');
    if (!['any', 'A', 'B', 'C'].includes(p.focus) || !['low', 'medium', 'high'].includes(p.thoroughness) || !(p.persistence >= 0 && p.persistence <= 5)) throw new Error('bad persona');
  }
  if (!d.rules.length || d.rules.some((r) => r !== 'traditional' && r !== 'oso')) throw new Error('choose traditional, OSO or both');
  for (const l of d.labs) if (!/^[\w.-]+\/[\w.:-]+$/.test(l.model)) throw new Error(`bad model id ${l.model}`);
  const repeats = Math.round(d.repeats ?? 1);
  if (!(repeats >= 1 && repeats <= 10)) throw new Error('between 1 and 10 runs per side');
  const posted = loadTasks().filter((t) => t.posted).map((t) => t.publicId);
  const counted = (d.counted ?? []).filter((c) => posted.includes(c));
  const conjectures = conjecturesFor(counted.length ? counted : posted, d.conjectures);
  const config = {
    question: d.question || 'For the same money, does an OSO community of AI labs solve more of the counted targets than a traditional one?',
    compare: 'traditional rules and OSO rules',
    fixed: `${d.labs.length} labs (${d.labs.map((l) => `${l.model.split('/').pop()} as ${l.persona.name}`).join('; ')}), $${d.budget} each, ${conjectures.length} posted conjectures, up to ${d.rounds} rounds`,
    caveats: [] as string[],
    counted, conjectures, conjectureBounty: 1,
    design: `Designed in the app on ${new Date().toISOString().slice(0, 10)}, before the runs.`,
    agents: d.labs.map((l) => l.model),
    personaNames: d.labs.map((l) => l.persona.name),
    personas: d.labs.map((l) => personaText(l.persona)),
    repairsByLab: d.labs.map((l) => Math.round(l.persona.persistence)),
    effortByLab: d.labs.map((l) => l.persona.thoroughness),
    reuseByLab: d.labs.map((l) => l.persona.reuse),
    budget: d.budget, rounds: d.rounds, rules: d.rules, run: d.id,
  };
  const runsDir = join(ROOT, 'lean', 'runs');
  const file = join(runsDir, `${d.id}.config.json`);
  if (existsSync(file)) throw new Error(`a race called "${d.id}" exists already; choose another name`);
  writeFileSync(file, JSON.stringify(config, null, 1));
  const max = d.budget * d.labs.length * d.rules.length * repeats;
  // Every community runs as its own detached process, kept awake, so a long race survives this app
  // restarting; when all have ended, the series card is built.
  const job = newJob('race', `Race: ${d.id}, ${repeats} run${repeats > 1 ? 's' : ''} per side (at most $${max.toFixed(2)})`);
  let open = 0;
  for (let k = 1; k <= repeats; k++) for (const r of d.rules) {
    const run = `${d.id}-r${k}`;
    const out = openSync(join(runsDir, `${run}-${r}.log`), 'a');
    const child = spawn('caffeinate', ['-i', '-m', process.execPath, '--env-file-if-exists=.env', 'src/lean/cli.ts', 'community', '--config', file, '--rules', r, '--run', run], { cwd: ROOT, detached: true, stdio: ['ignore', out, out] });
    child.unref();
    open++;
    job.log.push(`started run ${k}, ${r === 'oso' ? 'OSO' : 'traditional'} (log: lean/runs/${run}-${r}.log)`);
    child.on('close', (code) => {
      job.log.push(`run ${k}, ${r === 'oso' ? 'OSO' : 'traditional'}: ${code === 0 ? 'finished' : `stopped (code ${code})`}`);
      if (--open === 0) {
        const s = spawn(process.execPath, ['--env-file-if-exists=.env', 'src/lean/cli.ts', 'series', d.id], { cwd: ROOT });
        s.stdout.on('data', (b: Buffer) => job.log.push(b.toString().trim()));
        s.on('close', (c2) => { job.endedAt = Date.now(); job.status = c2 === 0 ? 'done' : 'failed'; job.result = { run: d.id, doc: `results/community/${d.id}/summary.md` }; });
      }
    });
  }
  return job;
}

/** Builds a race series' card from whatever runs have finished (also after this app restarted). */
export function buildSeriesJob(id: string): Job {
  if (!ID.test(id)) throw new Error('bad race name');
  return cliJob('series', `Card for ${id}`, ['series', id], () => ({ doc: `results/community/${id}/summary.md` }), 'src/lean/cli.ts');
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
