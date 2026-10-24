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
import { ideasWorld, worlds } from '../engine/world.ts';
import { expand, type ExperimentSpec, type Level } from '../experiments/experiment.ts';
import { expandPaths, getPath, loadScenario, merge } from '../engine/config.ts';
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
  { path: 'rules.alpha', label: 'α, absorption rate', group: 'market', min: 0, max: 1, step: 0.05, flowBack: true, values: [0.2, 0.4, 0.6, 0.8],
    short: 'how much of the value reaching an idea it absorbs for its authors',
    explain: 'When value reaches an idea, from a bounty or from later work, the idea absorbs α of it for its authors. The rest flows back to the ideas it built on, split by how much it used each, and on down the tree. Lower α pays foundational work more, which is what is meant to make agents share it. Only the OSO settings have flow-back; traditional rules are α = 1.' },
  { path: 'rules.c', label: 'c, cited share of the mint', group: 'market', min: 0, max: 0.6, step: 0.05, flowBack: true, values: [0, 0.15, 0.3, 0.5],
    short: 'share of each new mint paid to the ideas it built on',
    explain: 'Every validated idea mints tokens. Its authors get 1 − c; the other c goes to the ideas it built on and flows on down from there. So an idea earns each time someone builds on it, long before any bounty is won. Traditional rules are c = 0.' },
  { path: 'rules.mint', label: 'mint per idea', group: 'market', min: 0, max: 5, step: 0.25, values: [0, 0.5, 1, 2],
    short: 'tokens created for each validated idea',
    explain: 'Paid to an idea\'s authors (and, through c, to what it built on) when it is published. It pays for progress along the way, not only for bounties; it is also what gaming agents chase with trivial ideas. Bounties are a few units for the easiest target and double with each level.' },
  { path: 'rules.screen', label: 'θ, validation screen', group: 'market', min: 0, max: 1, step: 0.05, values: [0, 0.5, 0.9],
    short: 'chance validators reject a trivial idea',
    explain: 'A trivial idea adds nothing; it is submitted only to collect the mint. Validators reject it with chance θ. At low θ gaming pays, and under rules where money follows earnings a gaming agent can capture much of the budget.' },
  { path: 'budget.allocation.rho', label: 'ρ, money follows earnings', group: 'market', min: 0, max: 1, step: 0.05, values: [0, 0.5, 1],
    short: 'share of each round\'s money given by recent earnings',
    explain: 'A round is one step of the run: that round\'s money is handed out, each agent makes the attempts it can afford, new ideas are shared or kept, and rewards are paid. Each round, funders split that round\'s money: 1 − ρ equally among agents, ρ in proportion to what each earned in recent rounds. So what an agent earns this round raises its share next round. High ρ concentrates money on whoever is winning, like funding a few big agents; ρ = 0 shares it equally.' },
  { path: 'budget.X', label: 'total budget', group: 'market', min: 10, max: 100000, step: 10, integer: true, values: [],
    short: 'all the money the community gets for the whole run',
    explain: 'Each attempt costs the agent its cost per attempt (1 for most agents, less for cheap explorers). Every field\'s budget is set so OSO solves about 90% of its targets; less makes the race tighter, more lets both communities finish.' },
  { path: 'behaviour.psi', label: 'ψ, scoop risk', group: 'guess', min: 0, max: 0.95, step: 0.05, values: [0, 0.25, 0.5, 0.75],
    short: 'how likely agents think a shared lemma lets a rival win the target',
    explain: 'An agent that may choose whether to share a lemma weighs what sharing earns (the mint now, plus the value that will flow back if others build on it) against the risk that a rival uses it to reach the target first. ψ scales that risk. It matters only in the settings where agents choose.' },
  { path: 'behaviour.kappa', label: 'κ, value of being used', group: 'guess', min: 0, max: 5, step: 0.25, values: [0, 1, 2, 4],
    short: 'how much agents think publishing raises a lemma\'s use',
    explain: 'The other side of the sharing decision: how much an agent expects publishing to increase the value that later flows back to its lemma. Higher κ makes sharing look more attractive.' },
  { path: 'behaviour.perceptionNoise', label: 'σ₀, perception noise', group: 'guess', min: 0, max: 3, step: 0.1, values: [0, 0.5, 1, 2],
    short: 'how noisily agents see the value of what they could attempt',
    explain: 'Agents judge each idea they could attempt by its expected value, seen with noise of this size. At 0 they see exactly; higher, they misjudge more often and spread effort onto worse options.' },
  { path: 'behaviour.policy.tau', label: 'τ, choice randomness', group: 'guess', min: 0.01, max: 2, step: 0.01, values: [0.05, 0.3, 1],
    short: 'how loosely agents follow their best option',
    explain: 'Agents choose among the ideas they could attempt with a softmax rule: near τ = 0 they almost always take the best-looking one; higher τ spreads attempts over good-enough options, more like a real community\'s variety.' },
  { path: 'attribution.noise', label: 'attribution error', group: 'guess', min: 0, max: 1, step: 0.05, values: [0, 0.1, 0.3, 0.6],
    short: 'error in the ledger\'s weights of what each idea built on',
    explain: 'Flow-back is split by how much an idea used each thing it built on. In Lean these weights are exact; elsewhere they are estimated. With error, part of the flow-back goes to the wrong ideas, which weakens the incentive to do foundational work.' },
  { path: 'knowledge.absorbCost', label: 'uptake cost: money to take up an idea', group: 'guess', min: 0, max: 2, step: 0.05, values: [0, 0.25, 0.5, 1],
    short: 'money an agent spends to take up each published idea',
    explain: 'Before building on a published idea, an agent must read and understand it. At 0 sharing is free; at 1, taking up an idea costs as much as an attempt. This is the main cost of an open, crowded literature.' },
  { path: 'knowledge.errorRate', label: 'chance a proof is wrong', group: 'guess', min: 0, max: 0.5, step: 0.01, values: [0, 0.05, 0.1, 0.2],
    short: 'some ideas are wrong, and wrongness spreads',
    explain: 'With this chance a proof is wrong, and so is anything built on a wrong idea. A target\'s check catches it: the target is rejected and the wrong ideas it rested on are retracted. Shared wrong ideas spread further, so this is the main risk of sharing.' },
  { path: 'success.p0', label: 'p₀, chance at level 1', group: 'field', min: 0.05, max: 1, step: 0.05, values: [0.3, 0.5, 0.8],
    short: 'chance an attempt at a level-1 idea succeeds',
    explain: 'Each attempt succeeds with a chance that depends on the idea\'s level: p₀ at level 1, then multiplied by η for each level up. A field that lists its ideas one by one may set some chances directly; those ignore p₀ and η.' },
  { path: 'success.eta', label: 'η, difficulty per level', group: 'field', min: 0.2, max: 0.95, step: 0.05, values: [0.4, 0.5, 0.6, 0.7],
    short: 'how much harder each level is than the one below',
    explain: 'An idea at level ℓ succeeds with chance p₀ · η^(ℓ − 1) per attempt. Lower η makes deep ideas much harder, so building on others\' work matters more.' },
];

/** The eight traits of a simulated agent (docs/simulator.md, section 2.2). */
export const TRAITS = [
  { key: 'skill', label: 'skill', min: 0.1, max: 2, step: 0.05, explain: 'How often an attempt works. At 1 an attempt works as often as the idea allows; at 0.5, half as often.' },
  { key: 'conjecture', label: 'conjecture quality', min: 0, max: 1, step: 0.05, explain: 'How well the agent judges what an idea is worth before trying it. At 1 it judges exactly; lower, it often picks the wrong things.' },
  { key: 'cost', label: 'cost per attempt', min: 0.1, max: 3, step: 0.05, explain: 'Money per attempt. A cheaper agent gets more attempts from the same budget.' },
  { key: 'horizon', label: 'horizon', min: 0.5, max: 1, step: 0.01, explain: 'Patience. Near 1, the agent values payoffs that come many rounds later, such as a bounty several levels up; lower, it wants payoffs now.' },
  { key: 'risk', label: 'risk attitude', min: -1, max: 1, step: 0.05, explain: 'Above 0, the agent avoids long shots and prefers sure things; below 0, it chases long shots such as hard targets.' },
  { key: 'reuse', label: 'reuse', min: 0, max: 1, step: 0.05, explain: 'Chance each round of picking up an idea someone else published, so it can build on it. Sharing only helps if agents reuse.' },
  { key: 'sharing', label: 'openness', min: -1, max: 1, step: 0.05, explain: 'How much the agent likes publishing for its own sake: above 0 it likes it, below 0 it dislikes it. Only matters when agents choose what to share.' },
  { key: 'gaming', label: 'gaming', min: 0, max: 1, step: 0.05, explain: 'Share of attempts spent on trivial ideas, just to collect the small reward each one pays.' },
];

/** The kinds of agent in the default community, in plain words. */
export const KINDS: Record<string, { name: string; what: string }> = {
  foundation: { name: 'Foundation builder', what: 'Patient and careful; builds the basic ideas others need, and likes sharing.' },
  racer: { name: 'Target racer', what: 'Impatient; chases the bounties and long shots, and never shares for its own sake.' },
  explorer: { name: 'Cheap explorer', what: 'Less skilled and a poor judge, but each attempt is cheap, so it attempts a lot.' },
  specialist: { name: 'Specialist', what: 'Much better in its own area (1.6×), much worse elsewhere (0.4×).' },
  freeRider: { name: 'Free rider', what: "Uses everyone's ideas and dislikes sharing its own." },
  gamer: { name: 'Gamer', what: 'Spends most attempts on trivial ideas to collect their small rewards.' },
  plain: { name: 'Plain', what: 'Average at everything, no preferences; uses every idea it sees. A baseline.' },
};

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
  value: 'value gained: the bounties of the targets solved', roi: 'return on the money: value gained per unit spent',
  frontier: 'hardest level published', deepestProved: 'deepest level proved by anyone', reachTarget: 'share of runs reaching the main level',
  speed: 'rounds to reach the main level', cost: 'money to reach the main level', spend: 'money spent', productivity: 'ideas per 100 money',
  breadth: 'share of targets solved', waste: 'share of money on ideas no target needed', credit: 'how well bounty pay matches contribution',
  sharing: 'share of intermediate ideas published at once', hoarded: 'ideas proved but never published', reuse: 'how often published ideas were built on',
  duplicates: 'proofs of already-published ideas', targetsSolved: 'targets solved', gamerShare: "the gamer's share of all pay",
  trivialSpend: 'money spent on trivial ideas', rejected: 'targets rejected for resting on wrong ideas', retracted: 'ideas retracted as wrong', absorbSpend: 'money spent taking up published ideas',
};

export function options() {
  return {
    settings: SETTINGS,
    parameters: PARAMETERS,
    traits: TRAITS,
    graphDefaults: GRAPH_DEFAULTS,
    kinds: KINDS,
    personas: PERSONAS,
    personaFeatures: PERSONA_FEATURES,
    flowBackSettings: FLOW_BACK,
    columns: Object.keys(COLUMNS).map((id) => ({ id, meaning: COLUMN_INFO[id] ?? id })),
    defaultColumns: ['frontier', 'reachTarget', 'cost', 'targetsSolved', 'value', 'roi', 'sharing'],
    template: spaceToYaml({
      id: 'my-field', title: 'My field', summary: 'One sentence about the field.',
      description: 'What the field is, its stages or areas, and what progress means in it.',
      glossary: { idea: 'a finding later work can build on', target: 'a finding with a bounty', attempt: 'one attempt at a finding' },
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
  if (!d.id) d = { ...d, id: fullName(d) };
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
    columns: ['frontier', 'targetsSolved', 'value', 'roi', 'cost', 'waste', 'sharing', 'reachTarget'],
    question: d.question || d.title || `${d.settings.map((s) => SETTINGS[s]).join(' vs ')} on ${space.spec.title}: which gets furthest?`,
    compare: `${d.settings.map((s) => SETTINGS[s]).join(', ')}${varied.length ? `, by ${varied.map((v) => param(v.path).label).join(' and ')}` : ''}`,
    fixed: `the field "${space.spec.title}"${changed.length ? `, with ${changed.join(', ')}` : ''}`,
    tags: ['simulation', 'full model', d.space, space.spec.title, ...d.settings.map((s) => SETTINGS[s]), ...varied.map((v) => param(v.path).label), ...(d.agents ? ['own agents'] : [])],
  };
}

export function checkExperiment(d: Design) {
  try {
    const spec = experimentFor(d);
    const rows = expand(spec);
    return { ok: true, rows: rows.length, runs: rows.length * spec.seeds, exists: existsSync(join(EXPERIMENTS_DIR, `${d.id}.yaml`)), yaml: stringify(spec, { lineWidth: 100 }), labels: rows.slice(0, 40).map((r) => r.labels), name: fullName(d), question: experimentFor({ ...d, question: '', title: '' }).question };
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
  { key: 'risk', label: 'risk attitude', kind: 'instructed', type: 'slider', left: 'safe bets', right: 'long shots', explain: 'Whether the agent goes for ideas it is likely to prove, or for the hard, high-bounty targets even when it may fail.' },
  { key: 'horizon', label: 'horizon', kind: 'instructed', type: 'slider', left: 'what pays now', right: 'patient', explain: 'Whether the agent spends on lemmas that pay off later (a foundation builder) or only on what earns now (a racer).' },
  { key: 'gaming', label: 'gaming', kind: 'instructed', type: 'slider', left: 'none', right: 'farms easy ideas', explain: 'Whether the agent attempts to earn by publishing many easy ideas. An idea one basic tactic proves earns nothing, so this tests how easy the screen is to beat.' },
  { key: 'focus', label: 'focus', kind: 'instructed', type: 'select', options: { any: 'all areas', A: 'the sequence (A)', B: 'sorting (B)', C: 'matrices (C)' }, explain: 'Whether the agent works on one area only, like a specialist.' },
  { key: 'reuse', label: 'reuse', kind: 'enforced', type: 'toggle', explain: 'Whether the agent is shown, and may cite, other agents\' published ideas. Off: it works alone even under OSO. Enforced by the harness, not just asked for.' },
  { key: 'persistence', label: 'persistence', kind: 'enforced', type: 'number', min: 0, max: 5, explain: 'How many times the agent may repair a proof Lean rejected, within one action.' },
  { key: 'thoroughness', label: 'thoroughness', kind: 'enforced', type: 'select', options: { low: 'low', medium: 'medium', high: 'high' }, explain: 'The model\'s reasoning effort: how long it thinks before each reply. More thinking costs more.' },
  { key: 'sharing', label: 'sharing', kind: 'unavailable', type: 'none', explain: 'Whether the agent publishes or holds back its ideas. Not yet available: under OSO every idea is published at once; it needs a setting where agents choose what to publish.' },
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
// Sent to the AI models as each lab's instructions: keep the wording fixed, so new tests stay comparable with old ones.
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
  if (!d.labs.length || d.labs.length > 12) throw new Error('between 1 and 12 agents');
  if (!(d.budget > 0 && d.budget <= 20)) throw new Error('budget per agent must be between $0 and $20');
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
    question: d.question || 'For the same money, does an OSO community of AI agents solve more of the counted targets than a traditional one?',
    compare: 'traditional rules and OSO rules',
    fixed: `${d.labs.length} agents (${d.labs.map((l) => `${l.model.split('/').pop()} as ${l.persona.name}`).join('; ')}), $${d.budget} each, ${conjectures.length} posted conjectures, up to ${d.rounds} rounds`,
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

/* ------------------------------------------------------------------------------------- The simple model */

/**
 * The simple model: only α (absorption rate) and β (chance an intermediate idea is published at once) vary.
 * Everything else is held fixed: 12 identical agents, equal money every round (ρ = 0), no mint (m = 0, so
 * bounties are the only value), no validation (θ = 0; no agent games, so nothing trivial is submitted),
 * and the topic's own idea graph and bounties.
 */
/** The generator's controls (world kind 'ideas'): structure, difficulty and attribution. */
export interface GraphControls { levels: number; width: number; parents: number; skip: number; length: number; lengthGrowth: number; composition: number; targets: number; targetsFrom: number }
export const GRAPH_DEFAULTS: GraphControls = { levels: 6, width: 8, parents: 2, skip: 0.2, length: 3, lengthGrowth: 2, composition: 0.7, targets: 2, targetsFrom: 0 };
const GRAPH_RANGES: Record<keyof GraphControls, [number, number]> = { levels: [1, 15], width: [1, 30], parents: [1, 6], skip: [0, 1], length: [1, 12], lengthGrowth: [0, 6], composition: [0, 1], targets: [1, 10], targetsFrom: [0, 15] };

/** The simple model's design: a topic, or a generated idea graph (graph), and the α and β values. */
export interface SimpleDesign { id: string; title?: string; question?: string; space: string; graph?: GraphControls; preset?: string; budget?: number; alphas: number[]; betas: number[]; seeds: number; measure?: string }

function checkGraph(g: GraphControls) {
  for (const [k, [lo, hi]] of Object.entries(GRAPH_RANGES)) {
    const v = Number(g[k as keyof GraphControls]);
    if (!Number.isFinite(v) || v < lo || v > hi) throw new Error(`idea graph: ${k} must be between ${lo} and ${hi}`);
  }
}

/** Topics that are presets of the generator: their controls, title and summary. */
export function graphPresets() {
  const keys = Object.keys(GRAPH_DEFAULTS) as (keyof GraphControls)[];
  return readdirSync(SPACES_DIR).filter((f) => f.endsWith('.yaml')).map((f) => parse(readFileSync(join(SPACES_DIR, f), 'utf8')) as SpaceSpec)
    .filter((sp) => (sp.scenario?.world as { kind?: string } | undefined)?.kind === 'ideas')
    .map((sp) => {
      const w = sp.scenario!.world as Record<string, number>;
      return { id: sp.id, title: sp.title, summary: sp.summary, controls: Object.fromEntries(keys.map((k) => [k, w[k] ?? GRAPH_DEFAULTS[k]])) as GraphControls };
    });
}

/** A generated idea graph, drawn, with its numbers: for the preview on the New page. */
export function graphPreview(g: GraphControls, seed = 1) {
  try {
    checkGraph(g);
    const w = ideasWorld({ ...g, targetsFrom: g.targetsFrom ?? 0, bountyBase: 4, bountyGrowth: 2, attemptLimit: 24 }, new Rng(seed));
    const withParents = w.prereqs.filter((ps) => ps.length);
    const inherited = w.bits!.map((b, x) => { const from = new Set(w.prereqs[x].flatMap((y) => w.bits![y])); return b.filter((bit) => from.has(bit)).length / b.length; });
    return {
      ok: true, svg: worldFigure(w, 'The idea graph (one draw)'),
      world: { n: w.n, levels: w.levels, level: w.level, prereqs: w.prereqs, bits: w.bits, tosses: w.tosses, isTarget: w.isTarget, bounty: w.bounty, deadEnd: w.deadEnd },
      ideas: w.n, targets: w.targets.length, deadEnds: w.deadEnd.filter(Boolean).length,
      parents: withParents.reduce((a, ps) => a + ps.length, 0) / Math.max(1, withParents.length),
      topLength: Math.max(...w.bits!.map((b) => b.length)),
      composition: inherited.filter((_, x) => w.prereqs[x].length).reduce((a, b) => a + b, 0) / Math.max(1, withParents.length),
    };
  } catch (e) { return { ok: false, error: (e as Error).message }; }
}

export const SIMPLE_FIXED = { 'rules.c': 0, 'budget.allocation.rho': 0, 'rules.mint': 0, 'rules.screen': 0 };
export const SIMPLE_AGENTS = 12;

/** A society's name: closed (traditional), fully open (OSO), or in between. */
export function societyLabel(alpha: number, beta: number): string {
  if (alpha === 1 && beta === 0) return 'Traditional (α = 1, β = 0)';
  if (beta === 1 && alpha < 1) return `OSO (α = ${alpha}, β = 1)`;
  return `α = ${alpha}, β = ${beta}`;
}

export function simpleExperimentFor(d: SimpleDesign): ExperimentSpec {
  if (!d.id) d = { ...d, id: simpleName(d) };
  if (!ID.test(d.id)) throw new Error('the experiment name must be kebab-case (a-z, 0-9, hyphens)');
  const check = (xs: number[], name: string, lo: number, hi: number) => {
    if (!xs.length) throw new Error(`give at least one value of ${name}`);
    for (const x of xs) if (!Number.isFinite(x) || x < lo || x > hi) throw new Error(`${name}: ${x} is outside ${lo} to ${hi}`);
  };
  check(d.alphas, 'α', 0, 1); check(d.betas, 'β', 0, 1);
  if (d.alphas.length * d.betas.length > 60) throw new Error('at most 60 societies (α values × β values)');
  if (!(d.seeds >= 1 && d.seeds <= 1000)) throw new Error('runs per society must be between 1 and 1000');
  if (d.graph) return simpleOnGraph(d, d.graph);
  const { space } = withCalibratedBudget(loadSpace(d.space));
  // Every agent kind the topic has is set to 0, then 12 plain agents: the mix is replaced whole.
  const mix = Object.fromEntries([...Object.keys(space.scenario.agents.mix), 'plain'].map((k) => [k, k === 'plain' ? SIMPLE_AGENTS : 0]));
  const levels = societies(d);
  return {
    id: d.id,
    title: d.title || d.question || `Simple model on ${space.spec.title}: α × β`,
    description: `The simple model on the field "${space.spec.title}" (spaces/${d.space}.yaml): only α and β vary. Held fixed: ${SIMPLE_AGENTS} identical agents, equal money every round (ρ = 0), no mint (m = 0), no validation (θ = 0), the field's idea graph and bounties.`,
    seeds: d.seeds,
    ...(space.spec.scenarioFile ? { scenario: space.spec.scenarioFile } : {}),
    set: merge(merge(expandPaths(space.spec.scenario ?? {}), expandPaths(SIMPLE_FIXED)), { agents: { mix } }) as Record<string, unknown>,
    factors: [{ name: 'society', levels }],
    columns: ['frontier', 'targetsSolved', 'value', 'roi', 'cost', 'waste', 'sharing', 'reachTarget'],
    question: d.question || `On ${space.spec.title}, how far does a society get for the same money, by α and β?`,
    compare: `α in {${d.alphas.join(', ')}} × β in {${d.betas.join(', ')}}`,
    fixed: `the field "${space.spec.title}", ${SIMPLE_AGENTS} identical agents, equal money each round, no mint, no validation`,
    tags: simpleTags(d, space.spec.title),
  };
}

const societies = (d: SimpleDesign): Level[] => d.alphas.flatMap((a) => d.betas.map((b) => ({ label: societyLabel(a, b), set: { 'rules.alpha': a, 'rules.visibility': { kind: 'chance', beta: b } } })));
const graphText = (g: GraphControls) => `${g.levels} levels × ${g.width} ideas, ${g.parents} parents each, sequences of ${g.length} bits growing by ${g.lengthGrowth} per level, composition ${g.composition}`;

const presetTitle = (id?: string) => (id ? graphPresets().find((p) => p.id === id)?.title.replace(/^(An?|The) /, '').toLowerCase() : undefined);

/** The simple model on a generated idea graph: each run draws its own graph from the controls. */
function simpleOnGraph(d: SimpleDesign, g: GraphControls): ExperimentSpec {
  checkGraph(g);
  const budget = d.budget ?? 1200;
  if (!(budget >= 10 && budget <= 100000)) throw new Error('the budget must be between 10 and 100,000');
  const mix = Object.fromEntries([...Object.keys(loadScenario(null).agents.mix), 'plain'].map((k) => [k, k === 'plain' ? SIMPLE_AGENTS : 0]));
  return {
    id: d.id,
    title: d.title || d.question || `Simple model on a generated idea graph: α × β`,
    description: `The simple model on a generated idea graph (${graphText(g)}); each run draws its own graph. Only α and β vary. Held fixed: ${SIMPLE_AGENTS} identical agents, a budget of ${budget} split equally every round (ρ = 0), no mint, no validation.`,
    seeds: d.seeds,
    set: merge(expandPaths({ world: { kind: 'ideas', ...g }, 'budget.X': budget, 'measures.targetLevel': g.levels, ...SIMPLE_FIXED }), { agents: { mix } }) as Record<string, unknown>,
    factors: [{ name: 'society', levels: societies(d) }],
    columns: ['frontier', 'targetsSolved', 'value', 'roi', 'cost', 'waste', 'sharing', 'reachTarget'],
    question: d.question || `On a generated idea graph${presetTitle(d.preset) ? ` (from the ${presetTitle(d.preset)} preset)` : ''}, how far does a society get for the same money, by α and β?`,
    compare: `α in {${d.alphas.join(', ')}} × β in {${d.betas.join(', ')}}`,
    fixed: `a generated idea graph (${graphText(g)}), ${SIMPLE_AGENTS} identical agents, budget ${budget} split equally, no mint, no validation`,
    tags: ['simulation', 'simple model', 'generated idea graph', 'ideas', `levels ${g.levels}`, `parents ${g.parents}`, `length ${g.length}`, `composition ${g.composition}`, 'alpha', 'beta'],
  };
}

export function checkSimple(d: SimpleDesign) {
  try {
    const spec = simpleExperimentFor(d);
    const rows = expand(spec);
    return { ok: true, rows: rows.length, runs: rows.length * spec.seeds, exists: existsSync(join(EXPERIMENTS_DIR, `${d.id}.yaml`)), name: simpleName(d), question: simpleExperimentFor({ ...d, question: '', title: '' }).question };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export function runSimpleJob(d: SimpleDesign, overwrite = false): Job {
  const spec = simpleExperimentFor(d);
  const file = join(EXPERIMENTS_DIR, `${spec.id}.yaml`);
  if (existsSync(file) && !overwrite) throw new Error(`an experiment called "${spec.id}" already exists; change its name`);
  writeFileSync(file, `# Designed in the experiment app (simple model).\n${stringify(spec, { lineWidth: 100 })}`);
  return cliJob('experiment', `Simple model: ${spec.title}`, [spec.id, '--save'], () => ({ doc: `results/${spec.id}/summary.md` }));
}

/* ------------------------------------------------------------------------------------------- Names */

// Canonical names: what an experiment is, then the date, so names sort, read and search well.
//   simple-<topic>-<what varies>-<yyyymmdd>            e.g. simple-abstract-field-alpha-beta-20261023
//   full-<topic>-<settings>[-by-<parameter>]-<yyyymmdd> e.g. full-drug-discovery-traditional-vs-oso-by-alpha-20261023
//   ai-<model>-x<agents>-<rules>-<yyyymmdd>            e.g. ai-deepseek-v4-1-flash-x4-traditional-vs-oso-20261023
// A name already taken gets -2, -3, …

const slug = (s: string) => s.toLowerCase().replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const num = (x: number) => String(x).replace('.', '-');
// The local date, so a name matches the day the run was made where it was made.
const today = () => { const d = new Date(), z = (n: number) => String(n).padStart(2, '0'); return `${d.getFullYear()}${z(d.getMonth() + 1)}${z(d.getDate())}`; };

function unique(base: string, taken: (id: string) => boolean): string {
  const b = base.length > 90 ? base.slice(0, 90).replace(/-[^-]*$/, '') : base;
  const stem = `${b}-${today()}`;
  if (!taken(stem)) return stem;
  for (let k = 2; ; k++) if (!taken(`${stem}-${k}`)) return `${stem}-${k}`;
}
const experimentTaken = (id: string) => existsSync(join(EXPERIMENTS_DIR, `${id}.yaml`));

export function simpleName(d: Pick<SimpleDesign, 'space' | 'alphas' | 'betas' | 'graph'>): string {
  const a = d.alphas.length > 1, b = d.betas.length > 1;
  const varies = a && b ? 'alpha-beta' : a ? `alpha-at-beta-${num(d.betas[0] ?? 0)}` : b ? `beta-at-alpha-${num(d.alphas[0] ?? 1)}` : `alpha-${num(d.alphas[0] ?? 1)}-beta-${num(d.betas[0] ?? 0)}`;
  // A generated graph is named by its controls: levels × width, parents, length + growth, composition.
  const where = d.graph ? `ideas-${d.graph.levels}x${d.graph.width}-p${num(d.graph.parents)}-len${num(d.graph.length)}g${num(d.graph.lengthGrowth)}-comp${num(d.graph.composition)}` : slug(d.space);
  return unique(`simple-${where}-${varies}`, experimentTaken);
}

export function fullName(d: Pick<Design, 'space' | 'settings' | 'vary' | 'agents'>): string {
  const settings = d.settings.length > 4 ? `${d.settings.length}-settings` : d.settings.map(slug).join('-vs-');
  const varied = d.vary.filter((v) => v.path && v.values.length).map((v) => slug(v.path.split('.').pop()!));
  return unique(`full-${slug(d.space)}-${settings}${varied.length ? `-by-${varied.join('-and-')}` : ''}${d.agents ? '-own-agents' : ''}`, experimentTaken);
}

export function aiName(d: Pick<RaceDesign, 'labs' | 'rules'>): string {
  const models = [...new Set(d.labs.map((l) => slug(l.model.split('/').pop() ?? l.model)))];
  const who = models.length === 1 ? `${models[0]}-x${d.labs.length}` : `${models.length}-models-x${d.labs.length}`;
  return unique(`ai-${who}-${d.rules.join('-vs-')}`, (id) => existsSync(join(ROOT, 'lean', 'runs', `${id}.config.json`)) || existsSync(join(ROOT, 'results', 'community', id)));
}

/** Search words for a card: the model, the topic, what was compared. */
export function simpleTags(d: SimpleDesign, topicTitle: string): string[] {
  return ['simulation', 'simple model', d.space, topicTitle, 'alpha', 'beta', 'absorption rate', 'publishing'];
}
