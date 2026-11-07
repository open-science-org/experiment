// The next experiment: the same agents, checker and total
// money under several ways of organizing them, and the graph a collaborator asked for: money spent
// against targets Lean has verified, one line per society.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { LEAN_REWARDS, charged, countedOf, progress, spendTo, stats, type CommunityOptions, type CommunityResult, type Rules } from './community.ts';
import { lineChart } from '../report/figures.ts';
import { writeCard } from '../card.ts';
import { RESULTS_DIR } from '../paths.ts';

export interface Society { name: string; /** The setup in OSO settings: when others see a result, α, who decides the work. */ params: string; rules: Rules; alpha?: number; /** One lab with everyone's budget. */ single?: boolean; colour: string; slot: 1 | 2 | 3 }

/** OSO is orange, traditional blue; the baselines are greys. */
export const SOCIETIES: Record<string, Society> = {
  single: { name: 'Single agent', params: 'one lab, all the money · α 1', rules: 'independent', single: true, colour: '#5f5e5a', slot: 3 },
  independent: { name: 'Independent labs', params: 'results never shared · α 1', rules: 'independent', colour: '#8a8984', slot: 3 },
  shared: { name: 'Shared library', params: 'shared at once · α 1', rules: 'shared', colour: '#b3b1aa', slot: 3 },
  planner: { name: 'Planner', params: 'shared at once · α 1 · lab 1 assigns the work', rules: 'planner', colour: '#33322f', slot: 3 },
  traditional: { name: 'Traditional', params: 'shared when a target is proved · α 1', rules: 'traditional', colour: '#2a78d6', slot: 1 },
  oso: { name: 'OSO, α 0.8', params: 'shared at once · α 0.8', rules: 'oso', alpha: 0.8, colour: '#eb6834', slot: 2 },
  'oso-0.2': { name: 'OSO, α 0.2', params: 'shared at once · α 0.2', rules: 'oso', alpha: 0.2, colour: '#f2a07b', slot: 2 },
};

/** A society's options from the common ones: the same total money in every society. */
export function societyOptions(key: string, base: CommunityOptions): CommunityOptions {
  const s = SOCIETIES[key];
  if (!s) throw new Error(`unknown society ${key}; known: ${Object.keys(SOCIETIES).join(', ')}`);
  const o: CommunityOptions = { ...base, rules: s.rules, alpha: s.alpha ?? base.alpha };
  if (!s.single) return o;
  const one = <T>(xs?: T[]) => (xs ? xs.slice(0, 1) : undefined);
  // One action per round: the single agent gets as many rounds as all the labs' actions, so money is the only limit.
  return { ...o, agents: base.agents.slice(0, 1), budget: base.budget * base.agents.length, rounds: base.rounds * base.agents.length, personas: one(base.personas), personaNames: one(base.personaNames), repairsByLab: one(base.repairsByLab), effortByLab: one(base.effortByLab), reuseByLab: one(base.reuseByLab) };
}

export interface SocietyRun { key: string; rep: number; runId: string; result: CommunityResult }

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length);
const sd = (xs: number[]) => { const m = mean(xs); return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, xs.length - 1)); };
const f2 = (x: number) => x.toFixed(2);

/** Counted targets solved once `x` dollars were spent: the step curve, held at its end after the run stops. */
function solvedAt(pts: [number, number][], x: number) {
  let y = 0;
  for (const [px, py] of pts) { if (px > x) break; y = py; }
  return y;
}

export function writeSocieties(id: string, runs: SocietyRun[], k: number, note = '', stub = false): string {
  const dir = join(RESULTS_DIR, 'community', id);
  mkdirSync(join(dir, 'figures'), { recursive: true });
  const keys = [...new Set(runs.map((r) => r.key))];
  const reps = Math.max(...runs.map((r) => r.rep));
  const total = Math.max(...runs.map((r) => r.result.opts.budget * r.result.opts.agents.length));
  const counted = countedOf(runs[0].result);
  const priced = runs.every((r) => charged(r.result)) ? 'as charged' : 'at list prices';
  const local = runs.some((r) => r.result.opts.agents.some((m) => m.startsWith('local:')));

  // The graph: mean counted targets solved against money spent, on a grid of 60 points.
  const grid = Array.from({ length: 61 }, (_, n) => (total * n) / 60);
  const series = keys.map((key) => {
    const curves = runs.filter((r) => r.key === key).map((r) => progress(r.result));
    return { name: SOCIETIES[key].name, slot: SOCIETIES[key].slot, colour: SOCIETIES[key].colour, points: grid.map((x) => [x, mean(curves.map((c) => solvedAt(c, x)))] as [number, number]) };
  });
  const yMax = Math.max(1, counted.length);
  writeFileSync(join(dir, 'figures', 'progress.svg'), lineChart({
    title: 'Verified targets for the money',
    subtitle: `Same agents, Lean checker and total money ($${f2(total)} ${local ? 'priced' : priced}) in every society; mean of ${reps} run${reps > 1 ? 's' : ''}.`,
    xLabel: 'Dollars spent so far', yLabel: 'Targets verified by Lean',
    series, x: [0, total], y: [0, yMax], xTicks: [0, total / 4, total / 2, (3 * total) / 4, total],
    yTicks: Array.from({ length: yMax + 1 }, (_, n) => n).filter((n) => yMax <= 8 || n % 2 === 0),
    format: { x: (v) => `$${v.toFixed(2)}`, y: (v) => String(v) },
  }));

  // The measure fixed in advance: money to reach k counted targets (a run that never does counts as its whole budget).
  const rows = keys.map((key) => {
    const rs = runs.filter((r) => r.key === key).map((r) => r.result), st = rs.map(stats);
    const to = rs.map((r) => spendTo(r, k) ?? r.opts.budget * r.opts.agents.length);
    return {
      key, to,
      row: {
        society: SOCIETIES[key].name,
        settings: SOCIETIES[key].params,
        [`money to ${k} targets`]: `$${f2(mean(to))} ± ${f2(sd(to))}`,
        'got there': `${rs.filter((r) => spendTo(r, k) !== null).length} of ${rs.length}`,
        'targets at full budget': `${f2(mean(st.map((x) => x.countedSolved)))} of ${counted.length}`,
        spent: `$${f2(mean(st.map((x) => x.spent)))}`,
        'work done twice': f2(mean(st.map((x) => x.lemmasDuplicate))),
      },
    };
  });
  const best = [...rows].sort((a, b) => mean(a.to) - mean(b.to))[0];
  // The verdict: each OSO society against the cheapest other one, run k against run k (the runs are paired),
  // clear when the mean difference is more than two standard errors from zero.
  const byRep = (key: string) => new Map(runs.filter((r) => r.key === key).map((r) => [r.rep, spendTo(r.result, k) ?? r.result.opts.budget * r.result.opts.agents.length]));
  const rest = rows.filter((r) => !r.key.startsWith('oso'));
  const strongest = [...rest].sort((a, b) => mean(a.to) - mean(b.to))[0];
  const verdict = (key: string) => {
    const a = byRep(key), b = byRep(strongest.key);
    const d = [...a].filter(([rep]) => b.has(rep)).map(([rep, x]) => x - b.get(rep)!);
    const md = mean(d), se = d.length > 1 ? sd(d) / Math.sqrt(d.length) : Infinity;
    const word = d.length < 2 ? 'one pair, no verdict' : Math.abs(md) <= 2 * se ? 'no clear difference' : md < 0 ? 'OSO cheaper' : `${SOCIETIES[strongest.key].name} cheaper`;
    return `${SOCIETIES[key].name} reached ${k} verified targets for $${f2(mean([...a.values()]))} on average, ${Math.abs(md) < 0.005 ? 'the same as' : md < 0 ? '$' + f2(-md) + ' less than' : '$' + f2(md) + ' more than'} ${SOCIETIES[strongest.key].name} over ${d.length} paired run${d.length === 1 ? '' : 's'} (${word}${d.length > 1 ? `; ±$${f2(2 * se)}` : ''}).`;
  };
  const osoKeys = rows.map((r) => r.key).filter((x) => x.startsWith('oso'));
  const answer = !osoKeys.length || !strongest ? `Cheapest to ${k} targets: ${SOCIETIES[best.key].name}, $${f2(mean(best.to))}.`
    : `${reps < 2 ? 'One run each, no verdict yet. ' : ''}${osoKeys.map(verdict).join(' ')}`;
  const o = [...runs].sort((a, b) => b.result.opts.agents.length - a.result.opts.agents.length)[0].result.opts;
  writeCard(dir, {
    id, kind: 'race', date: new Date().toISOString().slice(0, 10), title: `Societies compared: verified targets for the money (${id})`,
    ranAt: new Date(Math.min(Date.now(), ...runs.flatMap((r) => r.result.actions.map((a) => a.t)).filter(Boolean))).toISOString(),
    design: {
      question: 'For the same agents, checker and money, does OSO reach the same verified targets for less than other ways of organizing the agents?',
      compare: keys.map((x) => SOCIETIES[x].name).join(', '),
      fixed: `the same ${o.agents.length} agents (the single agent: the first, with all the money), $${f2(total)} in all, Lean checks every proof`,
      measure: `money spent to verify ${k} of the counted targets (${counted.join(', ')}); a run that never does counts as its whole budget`,
      better: 'lower', runs: `${reps} run${reps > 1 ? 's' : ''} per society, paired`,
    },
    answer,
    table: rows.map((r) => r.row),
    caveats: [
      o.mayStop === false ? 'Labs could not stop early: each worked until its money or the rounds ran out, so setups are compared at the same money spent.' : 'Labs could stop early by passing, so setups are compared at the same money offered; money spent is shown beside each.',
      ...(() => { const gaps = LEAN_REWARDS.gaps(o); return gaps.length ? [`Rewards differ from the current simulation model: ${gaps.join('; ')}.`] : []; })(),
      ...(local ? ['Models on this machine cost nothing; dollars price their tokens as a cheap open model would be served. A test of the setup, not a cost result.'] : []),
      'Values are mean ± standard deviation over runs; the verdict compares runs in pairs (run k of each society), with ± two standard errors of the difference.',
      ...(runs.some((r) => r.result.stopped) ? [`Some runs stopped early (${[...new Set(runs.map((r) => r.result.stopped).filter(Boolean))].join(', ')}); their money counts as spent up to the stop.`] : []),
    ],
    cost: stub ? '$0 (stand-in agents; dollars are a fixed $0.01 a call)' : local ? '$0 (local models)' : `$${f2(runs.reduce((a, r) => a + stats(r.result).spent, 0))} ${priced}`,
    page: `results/community/${id}/summary.md`,
    chart: `results/community/${id}/figures/progress.svg`,
  }, `${note}

![Verified targets for the money](figures/progress.svg)

- **Societies:** single agent (one lab, everyone's money); independent labs (nothing shared, a target counts when any lab proves it); shared library (everything public at once, no value flows back); planner (lab 1 assigns work to the others each round, results shared, nothing flows back); traditional (private until a target is proved); OSO (public at once, value flows back to what a result used; α is the share an author keeps).
- **Agents:** ${o.agents.map((m) => `\`${m}\``).join(', ')}; up to ${o.rounds} rounds; up to ${o.repairs} repairs on Lean's errors per action.

Transcripts, with every proof, are private.`);
  writeFileSync(join(dir, 'data.json'), JSON.stringify({ id, k, counted, runs: runs.map((r) => ({ society: r.key, rep: r.rep, runId: r.runId, stats: stats(r.result) })) }, null, 1) + '\n');
  return dir;
}
