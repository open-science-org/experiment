// The next experiment: the same agents, checker and total
// money under several ways of organizing them, and the graph a collaborator asked for: money spent
// against targets Lean has verified, one line per society.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { LEAN_REWARDS, charged, countedOf, mintOf, progress, spendTo, stats, type CommunityOptions, type CommunityResult, type Rules } from './community.ts';
import { lineChart } from '../report/figures.ts';
import { writeCard } from '../card.ts';
import { RESULTS_DIR } from '../paths.ts';
import { loadTasks } from './tasks.ts';
import { experimentName } from './names.ts';

export interface Society { /** Planner rules: no strategy advice and no failure reports for the planner. */ plain?: boolean; /** Labs choose what to publish, with the knowledge reward by proof size (roadmap M3). */ choose?: boolean; /** With `choose`: 'off' pays no reward for publishing, so keeping a result costs nothing. */ knowledge?: 'off' | 'flat-mint'; name: string; /** The setup in OSO settings: when others see a result, α, who decides the work. */ rules: Rules; alpha?: number; /** One lab with everyone's budget. */ single?: boolean; colour: string; slot: 1 | 2 | 3 }

/** OSO is orange, traditional blue; the baselines are greys. */
export const SOCIETIES: Record<string, Society> = {
  single: { name: 'Single agent', rules: 'independent', single: true, colour: '#5f5e5a', slot: 3 },
  independent: { name: 'Independent labs', rules: 'independent', colour: '#8a8984', slot: 3 },
  shared: { name: 'Shared library', rules: 'shared', colour: '#b3b1aa', slot: 3 },
  // The planner as first built: its prompt also has strategy advice and a report of what failed last round.
  planner: { name: 'Planner with hints', rules: 'planner', colour: '#33322f', slot: 3 },
  // The same role with the same information as the labs: what coordination alone is worth.
  'planner-plain': { name: 'Plain planner', rules: 'planner', plain: true, colour: '#8f8d86', slot: 3 },
  // New results pay their authors a flat amount and nothing flows back: credit without the dependency graph.
  'pay-lemma': { name: 'Pay per lemma', rules: 'oso', alpha: 1, knowledge: 'flat-mint', colour: '#6f6e69', slot: 3 },
  traditional: { name: 'Traditional', rules: 'traditional', colour: '#2a78d6', slot: 1 },
  oso: { name: 'OSO, α 0.8', rules: 'oso', alpha: 0.8, colour: '#eb6834', slot: 2 },
  'oso-0.2': { name: 'OSO, α 0.2', rules: 'oso', alpha: 0.2, colour: '#f2a07b', slot: 2 },
  // Labs choose what to publish (roadmap M3); knowledge reward by proof size. α 1: nothing flows back.
  'choose-1': { name: 'Labs choose, α 1', rules: 'oso', alpha: 1, choose: true, colour: '#33322f', slot: 3 },
  'choose-0.8': { name: 'Labs choose, α 0.8', rules: 'oso', alpha: 0.8, choose: true, colour: '#eb6834', slot: 2 },
  'choose-0.2': { name: 'Labs choose, α 0.2', rules: 'oso', alpha: 0.2, choose: true, colour: '#f2a07b', slot: 2 },
  // The same with the knowledge reward off.
  'choose-off-1': { name: 'Labs choose, reward off, α 1', rules: 'oso', alpha: 1, choose: true, knowledge: 'off', colour: '#33322f', slot: 3 },
  'choose-off-0.2': { name: 'Labs choose, reward off, α 0.2', rules: 'oso', alpha: 0.2, choose: true, knowledge: 'off', colour: '#f2a07b', slot: 2 },
};

/** A setup in OSO's parameters, from the options a run really used: when results go public, α, the flat mint m, the knowledge reward m_bit and f, the share of money that follows earnings. */
export function osoParams(o: CommunityOptions) {
  const when = o.publishing === 'choose' ? 'labs choose when to publish' : o.rules === 'traditional' ? 'public when a target is proved' : o.rules === 'independent' ? 'never shared' : 'public at once';
  const parts = [when, `α ${o.rules === 'oso' ? o.alpha : 1}`, `m ${mintOf(o)}`, `m_bit ${o.knowledge === 'proof-size' ? 'by proof size' : 0}`, `f ${o.follow ?? 0}`];
  if (o.rules === 'planner') parts.push(o.plainPlanner ? 'lab 1 plans, the others prove; same information as the labs' : 'lab 1 plans, the others prove; lab 1 also gets strategy advice and reports of what failed');
  if (o.agents.length === 1) parts.push('one lab, all the money');
  return parts.join(' · ');
}

/** A society's options from the common ones: the same total money in every society. */
export function societyOptions(key: string, base: CommunityOptions): CommunityOptions {
  const s = SOCIETIES[key];
  if (!s) throw new Error(`unknown society ${key}; known: ${Object.keys(SOCIETIES).join(', ')}`);
  const o: CommunityOptions = { ...base, rules: s.rules, alpha: s.alpha ?? base.alpha, ...(s.plain ? { plainPlanner: true } : {}), ...(s.choose ? { publishing: 'choose' as const, knowledge: s.knowledge ?? ('proof-size' as const) } : s.knowledge ? { knowledge: s.knowledge } : {}) };
  if (!s.single) return o;
  const one = <T>(xs?: T[]) => (xs ? xs.slice(0, 1) : undefined);
  // One action per round: the single agent gets as many rounds as all the labs' actions, so money is the only limit.
  return { ...o, agents: base.agents.slice(0, 1), budget: base.budget * base.agents.length, rounds: base.rounds * base.agents.length, personas: one(base.personas), personaNames: one(base.personaNames), repairsByLab: one(base.repairsByLab), effortByLab: one(base.effortByLab), reuseByLab: one(base.reuseByLab) };
}

export interface SocietyRun { key: string; rep: number; runId: string; result: CommunityResult }

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length);
const sd = (xs: number[]) => { const m = mean(xs); return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, xs.length - 1)); };
const f2 = (x: number) => x.toFixed(2);
/** Student t for a 95% range, by degrees of freedom (few runs need a wider range than ±2 SE). */
const T95 = [NaN, 12.71, 4.3, 3.18, 2.78, 2.57, 2.45, 2.36, 2.31, 2.26, 2.23, 2.2, 2.18, 2.16, 2.14, 2.13, 2.12, 2.11, 2.1, 2.09, 2.09];
const t95 = (df: number) => (df < 1 ? NaN : df < T95.length ? T95[df] : 1.96 + 2.4 / df);
/** Mean with its 95% range, as text. */
/** Mean with its 95% range, as text; a share's range is kept within 0 and 1. */
const range = (xs: number[], fmt = f2) => {
  const m = mean(xs), h = t95(xs.length - 1) * sd(xs) / Math.sqrt(xs.length), share = fmt === pct;
  const lo = share ? Math.max(0, m - h) : m - h, hi = share ? Math.min(1, m + h) : m + h;
  return Number.isFinite(h) ? `${fmt(m)} (95% range ${fmt(lo)} to ${fmt(hi)})` : fmt(m);
};
/** The difference of two means with its 95% range (runs not paired; degrees of freedom from the smaller group, a cautious choice). */
const diff = (a: number[], b: number[], fmt = f2) => {
  const d = mean(a) - mean(b), h = t95(Math.min(a.length, b.length) - 1) * Math.sqrt(sd(a) ** 2 / a.length + sd(b) ** 2 / b.length);
  return Number.isFinite(h) ? `${fmt(d)} (95% range ${fmt(d - h)} to ${fmt(d + h)})` : fmt(d);
};
const pct = (x: number) => `${Math.round(x * 100)}%`;

/** The median and a range of at least 95% from the sorted runs themselves (under 6 runs: no range, null); Infinity is "not reached". */
export function medianRange(xs: number[]): [number, number | null, number | null] {
  const s = [...xs].sort((a, b) => a - b), n = s.length;
  let cum = 0, c = 1, r = -1; // s[r] to s[n-1-r] misses the median with chance 2 P(X <= r), X binomial(n, 1/2); r: the largest with P(X <= r) <= 2.5%
  for (let k = 0; k < n; k++) { cum += c / 2 ** n; if (cum > 0.025) break; r = k; c = c * (n - k) / (k + 1); }
  const mid = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
  return r < 0 ? [mid, null, null] : [mid, s[r], s[n - 1 - r]];
}

/** The highest count that more than half the runs of every setup reach (0 if none). It does not look at who is cheapest. */
export function reachK(groups: CommunityResult[][], n: number) {
  for (let k = n; k >= 1; k--) if (groups.every((rs) => rs.filter((r) => spendTo(r, k) !== null).length > rs.length / 2)) return k;
  return 0;
}

const usd3 = (x: number) => (x === Infinity ? 'not reached' : `$${x.toFixed(3)}`);
const medianText = (xs: number[]) => {
  const [m, lo, hi] = medianRange(xs);
  return lo === null || hi === null ? usd3(m) : `${usd3(m)} (95% range ${usd3(lo)} to ${usd3(hi)})`;
};

/** The difference of two medians with a 95% range, by resampling each setup's runs (fixed seed, so a summary can be remade). Not reached is Infinity; both not reached counts as no difference. Under 6 runs a side: no range. */
export function medianDiff(a: number[], b: number[]) {
  const med = (xs: number[]) => medianRange(xs)[0], gap = (x: number, y: number) => (x === Infinity && y === Infinity ? 0 : x - y);
  const d = gap(med(a), med(b)), money = (x: number) => (Number.isFinite(x) ? `${x < 0 ? '−' : '+'}$${Math.abs(x).toFixed(3)}` : x > 0 ? 'no upper limit' : 'no lower limit');
  if (Math.min(a.length, b.length) < 6) return money(d);
  let seed = 20261109;
  const rand = () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const draw = (xs: number[]) => xs.map(() => xs[Math.floor(rand() * xs.length)]), N = 4000;
  const ds = Array.from({ length: N }, () => gap(med(draw(a)), med(draw(b)))).sort((x, y) => (x < y ? -1 : x > y ? 1 : 0));
  return `${money(d)} (95% range ${money(ds[Math.floor(0.025 * N)])} to ${money(ds[Math.ceil(0.975 * N) - 1])})`;
}

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

  // The measure fixed in advance (main Lean experiment, 2026-11-07): targets proved by the end of a run, of all posted.
  // Money to reach k targets is kept beside it.
  const nTargets = loadTasks(runs[0]?.result.opts.problems).filter((t) => t.posted).length;
  // The experiment on the harder set (fixed 2026-11-09): median money to reach a count of targets, the count set by a rule that ignores who wins.
  const moneyMeasure = runs[0]?.result.opts.problems === 'hard';
  const K = moneyMeasure ? reachK(keys.map((key) => runs.filter((r) => r.key === key).map((r) => r.result)), nTargets) || k : k;
  const rows = keys.map((key) => {
    const rs = runs.filter((r) => r.key === key).map((r) => r.result), st = rs.map(stats);
    const to = rs.map((r) => spendTo(r, K) ?? r.opts.budget * r.opts.agents.length);
    const money = rs.map((r) => spendTo(r, K) ?? Infinity);
    const got = st.map((x) => x.targetsSolved);
    // Labs choosing what to publish: the share of lemmas published at once (explicit choices), per run.
    const share = st.map((x) => x.sharedOfChosen).filter((x): x is number => x !== null);
    return {
      key, got, share, money,
      row: {
        society: SOCIETIES[key].name,
        'OSO parameters': osoParams(rs[0].opts),
        'targets proved': `${f2(mean(got))} ± ${f2(sd(got))} of ${nTargets}`,
        [moneyMeasure ? `median money to ${K} targets` : `money to ${K} targets`]: `${moneyMeasure ? medianText(money) : `$${f2(mean(to))}`} (${rs.filter((r) => spendTo(r, K) !== null).length} of ${rs.length} got there)`,
        spent: `$${f2(mean(st.map((x) => x.spent)))}`,
        'lemmas proved': f2(mean(st.map((x) => x.lemmasAccepted))),
        'built on another lab': f2(mean(st.map((x) => x.builtOnOthers))),
        'lemmas proved twice': f2(mean(st.map((x) => x.lemmasDuplicate))),
        'targets proved twice': f2(mean(st.map((x) => x.targetsDuplicate))),
        ...(st.some((x) => x.errors) ? { 'turns lost to errors': f2(mean(st.map((x) => x.errors))) } : {}),
        ...(SOCIETIES[key].choose ? {
          'lemmas published at once': share.length ? range(share, pct) : '—',
          'with no PUBLISH line': f2(mean(st.map((x) => x.noChoice))),
          'lemma proof size': f2(mean(st.map((x) => x.lemmaSize ?? 0))),
        } : {}),
      },
    };
  });
  // Each OSO setup against the shared library (or, without one, the best other setup), as estimates with 95% ranges.
  // Runs are not paired (model calls cannot be replayed with the same luck).
  const rest = rows.filter((r) => !r.key.startsWith('oso'));
  const base = rest.find((r) => r.key === 'shared') ?? [...rest].sort((a, b) => mean(b.got) - mean(a.got))[0];
  const verdict = (r: (typeof rows)[number]) => {
    return `${SOCIETIES[r.key].name} proved ${range(r.got)} targets of ${nTargets} a run; ${SOCIETIES[base.key].name} ${range(base.got)}. Difference: ${diff(r.got, base.got)}.`;
  };
  // Labs choosing what to publish (roadmap M3): the main measure is the share published at once, α 0.2 against α 1.
  const lo = rows.find((r) => r.key === 'choose-0.2'), hi = rows.find((r) => r.key === 'choose-1');
  const chooseAnswer = lo && hi && lo.share.length && hi.share.length
    ? `Lemmas published at once: ${rows.filter((r) => SOCIETIES[r.key].choose).map((r) => `${SOCIETIES[r.key].name} ${r.share.length ? range(r.share, pct) : '—'}`).join('; ')}. α 0.2 minus α 1: ${diff(lo.share, hi.share, pct)}.`
    : null;
  const osoRows = rows.filter((r) => r.key.startsWith('oso'));
  const moneyAnswer = moneyMeasure
    ? `Median money, all labs together, to reach ${K} of the ${nTargets} targets: ${rows.map((r) => `${SOCIETIES[r.key].name} ${medianText(r.money)}`).join('; ')}.${osoRows.flatMap((x) => rest.map((b) => ` ${SOCIETIES[x.key].name} minus ${SOCIETIES[b.key].name}: ${medianDiff(x.money, b.money)}.`)).join('')}`
    : null;
  const best = [...rows].sort((a, b) => mean(b.got) - mean(a.got))[0];
  const answer = chooseAnswer ? chooseAnswer : moneyAnswer ? moneyAnswer : !osoRows.length || !base ? `Most targets proved: ${SOCIETIES[best.key].name}, ${f2(mean(best.got))} of ${nTargets}.`
    : `${reps < 2 ? 'One run each, no verdict yet. ' : ''}${osoRows.map(verdict).join(' ')}`;
  const o = [...runs].sort((a, b) => b.result.opts.agents.length - a.result.opts.agents.length)[0].result.opts;
  writeCard(dir, {
    id, kind: 'race', date: new Date().toISOString().slice(0, 10), title: experimentName(id) === id ? `Societies compared: targets proved for the money (${id})` : experimentName(id),
    ranAt: new Date(Math.min(Date.now(), ...runs.flatMap((r) => r.result.actions.map((a) => a.t)).filter(Boolean))).toISOString(),
    design: {
      question: moneyMeasure ? 'For the same agents and checker, how much money does each way of organizing the labs spend to reach the same number of targets?' : 'For the same agents, checker and money, does a community prove more targets when value flows back (OSO) than when results are only shared, or kept private until a target is proved?',
      compare: keys.map((x) => SOCIETIES[x].name).join(', '),
      fixed: `the same ${o.agents.length} agents (the single agent: the first, with all the money), $${f2(total)} in all, Lean checks every proof`,
      measure: chooseAnswer ? 'the share of lemmas published at once (of those with a PUBLISH line), α 0.2 against α 1; targets proved beside it' : `${moneyMeasure ? `median money, all labs together, to reach ${K} of the ${nTargets} targets; ${K} is the highest count that more than half the runs of every setup reached; a run that never got there counts as not reached` : `targets proved by the end of a run, of ${nTargets}; money to reach ${k} targets is shown beside it`}`,
      better: moneyMeasure ? 'lower' : 'higher', runs: `${reps} run${reps > 1 ? 's' : ''} per setup, not paired`,
    },
    answer,
    table: rows.map((r) => r.row),
    caveats: [
      o.mayStop === false ? 'Labs could not stop early: each worked until its money or the rounds ran out, so setups are compared at the same money spent.' : 'Labs could stop early by passing, so setups are compared at the same money offered; money spent is shown beside each.',
      ...(() => { const gaps = LEAN_REWARDS.gaps(o); return gaps.length ? [`Rewards differ from the current simulation model: ${gaps.join('; ')}.`] : []; })(),
      ...(local ? ['Models on this machine cost nothing; dollars price their tokens as a cheap open model would be served. A test of the setup, not a cost result.'] : []),
      moneyMeasure ? 'Money to a count is all labs together, to the end of the round that reached it. Medians have ranges of at least 95% from the sorted runs; differences of medians have 95% ranges from resampling the runs; runs are not paired. Other table values are mean ± standard deviation.' : 'Table values are mean ± standard deviation over runs. Above: means with 95% ranges (Student t), and differences between setups with their 95% ranges; runs are not paired.',
      ...(keys.includes('planner') ? ['Planner with hints has advantages the other setups lack: its prompt says how to split the work, and it sees what each lab tried last round and why it failed. A win for it may come from these hints rather than from coordination. Lab 1 only plans, so three labs prove and most of its money stays unspent.'] : []),
      ...(keys.includes('planner-plain') ? ['The plain planner has the same information as the labs (no strategy advice, no failure reports). Lab 1 only plans, so three labs prove.'] : []),
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
  writeFileSync(join(dir, 'data.json'), JSON.stringify({ id, k: K, counted, runs: runs.map((r) => ({ society: r.key, rep: r.rep, runId: r.runId, stats: stats(r.result) })) }, null, 1) + '\n');
  return dir;
}
