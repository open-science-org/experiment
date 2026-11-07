// Does the knowledge reward matter? Runs the model step by step (steps 1-5) with the knowledge reward on
// (1 per new bit) and off (0), on the same graphs and the same luck, and writes
// results/knowledge-reward-by-step/summary.md with a line graph.
//
// npm run sim -- knowledge-reward [--seeds 100]
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { RESULTS_DIR } from '../paths.ts';
import { loadExperiment, runExperiment, type ExperimentSpec } from '../experiments/experiment.ts';
import { lineChart } from './figures.ts';
import { writeCard } from '../card.ts';
import { MODEL_VERSION } from '../engine/version.ts';

const STEPS = [
  { id: 'simple-ideas-6x8-p2-len3g2-comp0-7-step1-alpha-beta-20261025', name: '1. Sharing set by the rules, equal money' },
  { id: 'simple-ideas-6x8-p2-len3g2-comp0-7-step2-by-alpha-20261025', name: '2. Agents choose what to share' },
  { id: 'simple-ideas-6x8-p2-len3g2-comp0-7-step3-by-alpha-20261025', name: '3. Half the money follows earnings' },
  { id: 'simple-ideas-6x8-p2-len3g2-comp0-7-step4-by-alpha-20261025', name: '4. Agents differ' },
  { id: 'simple-ideas-6x8-p2-len3g2-comp0-7-step5-by-alpha-20261025', name: '5. A gamer joins' },
];
// The societies compared, by the row label each step uses (step 1 sets sharing; the others let agents choose).
const SOCIETIES = [
  { name: 'Traditional', step1: 'Traditional (α = 1, β = 0)', rest: 'Traditional (α = 1, finished work only)' },
  { name: 'α = 1', step1: 'α = 1, β = 1', rest: 'Agents choose, α = 1' },
  { name: 'α = 0.8', step1: 'OSO (α = 0.8, β = 1)', rest: 'Agents choose, α = 0.8' },
  { name: 'α = 0.2', step1: 'OSO (α = 0.2, β = 1)', rest: 'Agents choose, α = 0.2' },
  { name: 'α = 0', step1: null, rest: 'Agents choose, α = 0' },
];

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length);
const sd = (xs: number[]) => { const m = mean(xs); return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, xs.length - 1)); };

/** Per-run targets solved and sharing for each society, with the knowledge reward at `perBit`. */
function runStep(id: string, perBit: number, seeds: number) {
  const spec = loadExperiment(id);
  const withReward: ExperimentSpec = { ...spec, set: { ...(spec.set ?? {}), 'rules.mintPerBit': perBit } };
  const out = runExperiment(withReward, seeds);
  const label = (i: number) => String(Object.values(out.rows[i].labels)[0]);
  return new Map(out.rows.map((_, i) => [label(i), { targets: out.results[i].map((r) => r.targetsSolved), sharing: out.results[i].map((r) => r.sharingRate) }]));
}

export function writeKnowledgeReward(seeds = 100): string {
  const id = 'knowledge-reward-by-step';
  const dir = join(RESULTS_DIR, id);
  mkdirSync(join(dir, 'figures'), { recursive: true });
  const t0 = new Date().toISOString();
  const data = STEPS.map((st) => ({ ...st, on: runStep(st.id, 1, seeds), off: runStep(st.id, 0, seeds) }));

  // One row per step and society: targets solved with and without, the paired difference, and sharing.
  const rows: Record<string, string>[] = [];
  const cell: Record<string, Record<string, { on: number; off: number; clear: boolean }>> = {};
  for (const [s, d] of data.entries()) {
    cell[d.name] = {};
    for (const so of SOCIETIES) {
      const label = s === 0 ? so.step1 : so.rest;
      const on = label && d.on.get(label), off = label && d.off.get(label);
      if (!on || !off) continue;
      const diff = on.targets.map((x, k) => x - off.targets[k]);
      const clear = Math.abs(mean(diff)) > 2 * (sd(diff) / Math.sqrt(diff.length));
      cell[d.name][so.name] = { on: mean(on.targets), off: mean(off.targets), clear };
      rows.push({
        step: d.name, society: so.name,
        'targets solved, with': mean(on.targets).toFixed(2), 'targets solved, without': mean(off.targets).toFixed(2),
        difference: `${mean(diff) >= 0 ? '+' : ''}${mean(diff).toFixed(2)}${clear ? ' (clear)' : ''}`,
        'shared at once, with → without': `${(mean(on.sharing) * 100).toFixed(0)}% → ${(mean(off.sharing) * 100).toFixed(0)}%`,
      });
    }
  }

  // The graph: targets solved at each step, with and without the knowledge reward, for α = 1 and α = 0.8
  // (where it matters) and α = 0.2 (where it does not). Shades of one hue per α: dark with, light without.
  const lines: [string, string, string, 1 | 2 | 3][] = [['α = 0.8', '#eb6834', '#f5b899', 2], ['α = 1', '#5f5e5a', '#b3b1aa', 3], ['α = 0.2', '#1b7f8c', '#8cc7cf', 3]];
  const series = lines.flatMap(([so, dark, light, slot]) => (['on', 'off'] as const).map((k) => ({
    name: `${so.replace(' = ', ' ')} ${k === 'on' ? 'with' : 'w/o'}`, slot, colour: k === 'on' ? dark : light,
    points: data.map((d, s) => [s + 1, cell[d.name][so]?.[k] ?? 0] as [number, number]),
  })));
  writeFileSync(join(dir, 'figures', 'by-step.svg'), lineChart({
    title: 'Targets solved, with and without the knowledge reward',
    subtitle: `Model v${MODEL_VERSION}, step by step; mean of ${seeds} runs per point, the same graphs and luck with and without.`,
    xLabel: 'Step of the model (each adds one mechanism)', yLabel: 'Targets solved (of 2)',
    series, x: [1, 5], y: [0, 2], xTicks: [1, 2, 3, 4, 5], yTicks: [0, 0.5, 1, 1.5, 2], markers: true,
    format: { x: (v) => `step ${v}`, y: (v) => v.toFixed(1) },
  }));

  const at = (step: number, so: string) => cell[STEPS[step - 1].name][so];
  const answer = `With sharing set by the rules and equal money (step 1), the knowledge reward changes nothing. Once agents choose what to share and money follows earnings (steps 3-5), it matters at high α: at α = 0.8 a society solves ${at(3, 'α = 0.8').on.toFixed(1)} of 2 targets with it and ${at(3, 'α = 0.8').off.toFixed(1)} without (step 3). At α = 0.2 or 0 it barely matters: flowing value back already pays for intermediate work.`;
  const md = (rs: Record<string, string>[]) => [`| ${Object.keys(rs[0]).join(' | ')} |`, `| ${Object.keys(rs[0]).map(() => '---').join(' | ')} |`, ...rs.map((r) => `| ${Object.values(r).join(' | ')} |`)].join('\n');
  writeCard(dir, {
    id, kind: 'simulation', date: t0.slice(0, 10), ranAt: t0, modelVersion: MODEL_VERSION,
    title: 'Does the knowledge reward matter? Step by step, with and without',
    design: {
      question: 'Does paying a knowledge reward (1 per new bit, flowing back with α) change how far a society gets, and when?',
      compare: 'the knowledge reward on (1 per new bit) and off (0), at each step of the model and each α',
      fixed: 'everything else in each step experiment (6 × 8 generated graphs, 12 agents, budget 1,200); the same graphs and luck with and without',
      measure: 'targets solved (of 2)', better: 'higher', runs: `${seeds} runs per point, paired`,
    },
    answer,
    table: rows.filter((r) => ['α = 1', 'α = 0.8', 'α = 0.2'].includes(r.society)).map((r) => ({ step: r.step.split('.')[0], society: r.society, with: r['targets solved, with'], without: r['targets solved, without'], difference: r.difference })),
    caveats: [
      'Exploratory, not fixed in advance: a first look with 40 runs per point came first (2026-11-06); this is the same comparison with more runs.',
      '"Clear" means the paired difference is more than two standard errors from zero.',
      'Step 1 has no α = 0 row; its open societies set β = 1, so sharing is fixed at 100%.',
      'Why it matters for the Lean runs: there, money does not follow earnings and labs do not choose what to publish (like step 1), so on these results a knowledge reward would change little until money follows earnings.',
    ],
    page: `results/${id}/summary.md`, chart: `results/${id}/figures/by-step.svg`,
    tags: ['knowledge reward', 'step by step', 'mint', 'α'],
  }, `## What the knowledge reward is

When an idea is published, each of its **new bits** (bits no published idea has yet) earns 1. The idea keeps α of that and the rest flows back to the ideas it built on, like a bounty. A copy or a trivial idea adds no new bits, so it earns nothing, and publishing first pays. It has been on in every model since v5; this result turns it off to see what it does.

## How it was run

Each of the five step-by-step experiments (each step adds one mechanism to the one before: ${STEPS.map((st) => `[${st.name}](../${st.id}/summary.md)`).join(', ')}) was rerun ${seeds} times with the knowledge reward at 1 per new bit and again at 0, with the same graphs and the same luck, so each run with it has a twin without it.

![Targets solved, with and without the knowledge reward](figures/by-step.svg)

## Every step and society

${md(rows)}

## What it means

- **It only changes who is paid when nothing else depends on earnings** (step 1): the same ideas are found either way.
- **It matters when earnings steer what happens**, through agents choosing what to share (step 2, a little) or money following earnings (steps 3-5, a lot), and only at high α. Without it, an agent earns nothing until a target is proved, so money cannot move toward agents making progress.
- **Low α does the same job.** At α = 0.2 or 0 the flow-back already pays for intermediate work, so the knowledge reward adds little. It narrows the gap between α = 1 (sharing without flow-back) and OSO at α = 0.8.

Rerun: \`npm run sim -- knowledge-reward\`.`);
  return dir;
}
