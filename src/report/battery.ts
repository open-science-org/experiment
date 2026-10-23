// The canonical battery: the same experiments, run on every problem space, so that every report
// answers the same questions in the same form (specification, section 8).
import type { ExperimentSpec } from '../experiments/experiment.ts';
import type { Space } from '../spaces/spaces.ts';

export const SETTINGS_LEVELS = [
  { label: 'Traditional', preset: 'traditional' },
  { label: 'OSO (immediate)', preset: 'oso' },
  { label: 'Flow-back, finished-only', preset: 'creditOnly' },
  { label: 'No flow-back, immediate', preset: 'sharingOnly' },
  { label: 'No flow-back, choice', preset: 'traditionalChoice' },
  { label: 'OSO (choice)', preset: 'osoChoice' },
];

export const ALPHAS = [1, 0.8, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1];

export const KNOWLEDGE_LEVELS = [
  { label: 'free and correct', set: {} },
  { label: 'costly to absorb', set: { 'knowledge.absorbCost': 0.5 } },
  { label: 'sometimes wrong', set: { 'knowledge.errorRate': 0.1 } },
  { label: 'costly and sometimes wrong', set: { 'knowledge.absorbCost': 0.5, 'knowledge.errorRate': 0.1 } },
];

/** The battery for a space: the six settings, the α sweep, and robustness of sharing. */
export function battery(space: Space, seeds: number): ExperimentSpec[] {
  const base = { scenario: space.spec.scenarioFile, set: space.spec.scenario ?? {}, seeds };
  return [
    {
      ...base,
      id: 'settings',
      title: 'The six rule settings',
      description: 'Traditional research, OSO, and the mixed corners, on the same world, agents and budget.',
      factors: [{ name: 'setting', levels: SETTINGS_LEVELS }],
      columns: ['frontier', 'reachTarget', 'speed', 'cost', 'spend', 'targetsSolved', 'waste', 'credit', 'sharing'],
    },
    {
      ...base,
      id: 'alpha',
      title: 'Does flow-back make agents share?',
      description: "Agents choose whether to publish each intermediate result. α from 1 (traditional) down to 0.1; c = 0.15 (0 at α = 1).",
      set: { ...base.set, 'rules.c': 0.15, 'rules.visibility': { kind: 'choice' } },
      factors: [{ name: 'α', path: 'rules.alpha', values: ALPHAS }],
      patches: [{ when: { 'rules.alpha': 1 }, set: { 'rules.c': 0 } }],
      columns: ['sharing', 'frontier', 'reachTarget', 'targetsSolved'],
    },
    {
      ...base,
      id: 'robustness',
      title: 'When sharing is costly or sometimes wrong',
      description: 'Absorbing a published result costs 0.5 compute; proofs are wrong 10% of the time, and targets reveal and retract them.',
      factors: [
        { name: 'knowledge', levels: KNOWLEDGE_LEVELS },
        { name: 'setting', levels: SETTINGS_LEVELS.slice(0, 2) },
      ],
      columns: ['frontier', 'reachTarget', 'targetsSolved', 'absorbSpend', 'retracted'],
    },
  ];
}

/** A parameter whose value the report varies one at a time, around the space's own value. */
export interface SensitivityParam {
  id: string;
  label: string;
  /** What it means, for the report. */
  meaning: string;
  path: string;
  values: number[];
  /** `market`: set by communities, funders or the protocol; `guess`: an assumption about agents. */
  group: 'market' | 'guess';
  /** Parameters of OSO's flow-back (α, c) do not exist under traditional rules. */
  osoOnly?: boolean;
  format?: (v: number) => string;
}

const pctFmt = (v: number) => `${Math.round(v * 100)}%`;

export const SENSITIVITY: SensitivityParam[] = [
  { id: 'alpha', label: 'α, absorption rate', meaning: 'how much of the value reaching a result it absorbs; the rest flows back to what it built on', path: 'rules.alpha', values: [0.2, 0.4, 0.6, 0.8, 0.95], group: 'market', osoOnly: true },
  { id: 'c', label: 'c, cited share of the mint', meaning: 'share of each new mint paid to the results it built on', path: 'rules.c', values: [0, 0.05, 0.15, 0.3, 0.5], group: 'market', osoOnly: true, format: pctFmt },
  { id: 'mint', label: 'mint per result', meaning: 'tokens minted for each validated result, relative to bounties (the smallest bounty is a few units)', path: 'rules.mint', values: [0, 0.5, 1, 2, 4], group: 'market' },
  { id: 'screen', label: 'θ, validation screen', meaning: 'chance validators reject a trivial result', path: 'rules.screen', values: [0, 0.25, 0.5, 0.75, 0.95], group: 'market', format: pctFmt },
  { id: 'rho', label: 'ρ, compute follows earnings', meaning: 'share of each round\'s compute funders give by recent earnings rather than equally', path: 'budget.allocation.rho', values: [0, 0.25, 0.5, 0.75, 1], group: 'market', format: pctFmt },
  { id: 'psi', label: 'ψ, scoop risk', meaning: 'how likely agents think a shared lemma lets a rival take the target', path: 'behaviour.psi', values: [0, 0.25, 0.5, 0.75, 0.9], group: 'guess' },
  { id: 'kappa', label: 'κ, value of being used', meaning: 'how much agents think publishing raises a lemma\'s use', path: 'behaviour.kappa', values: [0, 0.5, 1, 2, 4], group: 'guess' },
  { id: 'noise', label: 'σ₀, perception noise', meaning: 'how noisily agents see the value of what they might attempt', path: 'behaviour.perceptionNoise', values: [0, 0.5, 1, 2], group: 'guess' },
  { id: 'tau', label: 'τ, choice randomness', meaning: 'how loosely agents follow their best option', path: 'behaviour.policy.tau', values: [0.05, 0.15, 0.3, 0.6, 1], group: 'guess' },
  { id: 'attribution', label: 'attribution error', meaning: 'noise in the ledger\'s weights of what each result built on', path: 'attribution.noise', values: [0, 0.1, 0.3, 0.6], group: 'guess' },
];

/** The flow-back grid: α × c, with agents choosing whether to share. */
export const GRID = { alpha: [0.95, 0.8, 0.6, 0.4, 0.2], c: [0, 0.05, 0.15, 0.3, 0.5] };

/** One experiment per parameter: OSO (choice), and traditional unless the parameter is OSO's own. */
export function sensitivityBattery(space: Space, seeds: number): ExperimentSpec[] {
  const base = { scenario: space.spec.scenarioFile, set: space.spec.scenario ?? {}, seeds };
  const settings = [SETTINGS_LEVELS[0], SETTINGS_LEVELS[5]];
  return [
    ...SENSITIVITY.map((p): ExperimentSpec => ({
      ...base,
      id: `sensitivity-${p.id}`,
      title: `Sensitivity: ${p.label}`,
      description: p.meaning,
      factors: [
        { name: 'setting', levels: p.osoOnly ? [settings[1]] : settings },
        { name: p.id, path: p.path, values: p.values },
      ],
      columns: ['frontier', 'targetsSolved', 'sharing'],
    })),
    {
      ...base,
      id: 'grid',
      title: 'The flow-back levers together',
      description: 'α × c under agent\'s choice.',
      set: { ...base.set, 'rules.visibility': { kind: 'choice' } },
      factors: [
        { name: 'α', path: 'rules.alpha', values: GRID.alpha },
        { name: 'c', path: 'rules.c', values: GRID.c },
      ],
      columns: ['sharing', 'frontier', 'targetsSolved'],
    },
  ];
}
