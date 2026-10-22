// The canonical report for a problem space (specification, section 8). Every space gets the same
// experiments (battery.ts) and the same report: a headline, the space, progress for the money, the
// six settings, whether flow-back makes agents share, robustness, limits, and how to reproduce.
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { battery, GRID, KNOWLEDGE_LEVELS, SENSITIVITY, sensitivityBattery } from './battery.ts';
import { getPath, loadScenario, expandPaths } from '../engine/config.ts';
import { preset } from '../experiments/experiment.ts';
import { runExperiment, type Output } from '../experiments/experiment.ts';
import { heatmap, lineChart, rangeChart, worldFigure, type RangeRow } from './figures.ts';
import { mean, sd, type RunResult } from '../engine/measures.ts';
import { Rng } from '../engine/rng.ts';
import { spaceIds, spaceToYaml, withCalibratedBudget, type Space } from '../spaces/spaces.ts';
import { writeCard } from '../card.ts';
import { worlds } from '../engine/world.ts';

import { CODE_PATHS, REPORTS_DIR, ROOT } from '../paths.ts';
export { REPORTS_DIR };

const f1 = (x: number) => (Number.isFinite(x) ? x.toFixed(1) : '–');
const f2 = (x: number) => (Number.isFinite(x) ? x.toFixed(2) : '–');
const pct = (x: number) => (Number.isFinite(x) ? `${Math.round(x * 100)}%` : '–');
const se = (xs: number[]) => (xs.length > 1 ? sd(xs) / Math.sqrt(xs.length) : 0);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Mean frontier (hardest level published) at each spend on a common grid. */
function frontierCurve(runs: RunResult[], X: number, steps = 40): [number, number][] {
  return Array.from({ length: steps + 1 }, (_, k) => {
    const x = (X * k) / steps;
    const levels = runs.map((r) => {
      let level = 0;
      for (const c of r.curve) {
        if (c.spend <= x + 1e-9) level = c.level;
        else break;
      }
      return level;
    });
    return [x, mean(levels)] as [number, number];
  });
}

function git() {
  try {
    const commit = execSync('git rev-parse --short HEAD', { encoding: 'utf8', cwd: ROOT }).trim();
    const dirty = execSync(`git status --porcelain -- ${CODE_PATHS.join(' ')}`, { encoding: 'utf8', cwd: ROOT })
      .split('\n').filter(Boolean).length > 0;
    return { commit, dirty };
  } catch {
    return { commit: 'unknown', dirty: true };
  }
}

function markdownTable(rows: Record<string, string | number>[]): string {
  const cols = Object.keys(rows[0] ?? {});
  const line = (cells: unknown[]) => `| ${cells.map((c) => String(c).replace(/\|/g, '\\|')).join(' | ')} |`;
  return [line(cols), line(cols.map(() => '---')), ...rows.map((r) => line(cols.map((c) => r[c])))].join('\n');
}

export interface Headline {
  id: string;
  title: string;
  summary: string;
  verdict: 'OSO ahead' | 'no clear difference' | 'traditional ahead';
  maxLevel: number;
  targetLevel: number;
  targets: number;
  budget: number;
  traditional: { frontier: number; reach: number; cost: number; targetsSolved: number; value?: number; spend?: number; roi?: number };
  oso: { frontier: number; reach: number; cost: number; targetsSolved: number; value?: number; spend?: number; roi?: number };
  osoChoice: { frontier: number; sharing: number };
  alphaStar: number | null;
  robustness: { condition: string; osoLead: number }[];
  /** OSO's (choice) lead in level over traditional across each parameter's tested values. */
  sensitivity: { parameter: string; group: string; min: number; max: number; base: number }[];
  seeds: number;
  commit: string;
  date: string;
}

function summarize(runs: RunResult[]) {
  const reached = runs.filter((r) => r.speed !== null);
  return {
    frontier: mean(runs.map((r) => r.frontier)),
    frontierSE: se(runs.map((r) => r.frontier)),
    reach: reached.length / runs.length,
    cost: reached.length ? mean(reached.map((r) => r.cost!)) : NaN,
    costSE: se(reached.map((r) => r.cost!)),
    targetsSolved: mean(runs.map((r) => r.targetsSolved)),
    targetsSE: se(runs.map((r) => r.targetsSolved)),
    sharing: mean(runs.map((r) => r.sharingRate)),
    value: mean(runs.map((r) => r.value)),
    spend: mean(runs.map((r) => r.spend)),
    roi: mean(runs.map((r) => r.roi)),
  };
}

/** Runs the battery on a space and writes reports/<id>/. Returns the headline numbers. */
export function buildReport(input: Space, seeds = 100, log: (s: string) => void = () => {}, root = REPORTS_DIR): Headline {
  const { space, calibrated } = withCalibratedBudget(input);
  if (calibrated) log(`  calibrated the budget: X = ${space.scenario.budget.X}`);
  const { spec, scenario } = space;
  const g = spec.glossary;
  const outDir = join(root, spec.id);
  mkdirSync(join(outDir, 'figures'), { recursive: true });
  const world = worlds.create(scenario.world, 'world')(scenario.success, new Rng(1).fork(1));

  const outputs: Record<string, Output> = {};
  for (const exp of [...battery(space, seeds), ...sensitivityBattery(space, seeds)]) {
    const t0 = Date.now();
    outputs[exp.id] = runExperiment(exp, seeds);
    log(`  ${exp.title}: ${outputs[exp.id].rows.length} rows × ${seeds} runs (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  }
  const settings = outputs.settings;
  const byLabel = (o: Output, labels: Record<string, string | number>) => {
    const i = o.rows.findIndex((r) => Object.entries(labels).every(([k, v]) => r.labels[k] === v));
    if (i < 0) throw new Error(`report: no row ${JSON.stringify(labels)}`);
    return o.results[i];
  };
  const trad = summarize(byLabel(settings, { setting: 'Traditional' }));
  const oso = summarize(byLabel(settings, { setting: 'OSO (immediate)' }));
  const choice = summarize(byLabel(settings, { setting: 'OSO (choice)' }));
  const X = scenario.budget.X;
  const L = scenario.measures.targetLevel;
  const T = world.targets.length;

  const diff = oso.frontier - trad.frontier;
  const margin = 2 * Math.hypot(oso.frontierSE, trad.frontierSE);
  const tdiff = oso.targetsSolved - trad.targetsSolved;
  const tmargin = 2 * Math.hypot(oso.targetsSE, trad.targetsSE);
  // Cost counts only when both reach the main level in nearly every run; otherwise level and targets decide.
  const costComparable = oso.reach >= 0.9 && trad.reach >= 0.9;
  const cdiff = costComparable ? trad.cost - oso.cost : 0;
  const cmargin = 2 * Math.hypot(oso.costSE, trad.costSE);
  const ahead = [diff > margin, tdiff > tmargin, cdiff > cmargin].some(Boolean);
  const behind = [diff < -margin, tdiff < -tmargin, cdiff < -cmargin].some(Boolean);
  const verdict: Headline['verdict'] = ahead && !behind ? 'OSO ahead' : behind && !ahead ? 'traditional ahead' : 'no clear difference';

  // α sweep: sharing and reach by α; α* is the highest α at which sharing rises 0.2 above α = 1.
  const alpha = outputs.alpha;
  const alphaPoints = alpha.rows.map((r, i) => ({ alpha: Number(r.labels['α']), ...summarize(alpha.results[i]) }));
  const base = alphaPoints.find((p) => p.alpha === 1)!;
  const alphaStar = alphaPoints.filter((p) => p.alpha < 1 && p.sharing >= base.sharing + 0.2).map((p) => p.alpha).sort((a, b) => b - a)[0] ?? null;

  // Robustness: OSO's frontier lead under each condition of knowledge.
  const rob = outputs.robustness;
  const robustness = KNOWLEDGE_LEVELS.map((k) => {
    const t = summarize(byLabel(rob, { knowledge: k.label, setting: 'Traditional' }));
    const o = summarize(byLabel(rob, { knowledge: k.label, setting: 'OSO (immediate)' }));
    return { condition: k.label, traditional: t, oso: o, osoLead: o.frontier - t.frontier };
  });

  // Figures.
  const curveRuns = (label: string) => byLabel(settings, { setting: label });
  writeFileSync(join(outDir, 'figures', 'frontier.svg'), lineChart({
    title: `How far each community got for the money: ${spec.title}`,
    subtitle: `Mean hardest level published, by compute spent (${seeds} runs per setting). Higher is better.`,
    xLabel: 'Compute spent', yLabel: 'Hardest level published',
    series: [
      { name: 'OSO (immediate)', slot: 2, points: frontierCurve(curveRuns('OSO (immediate)'), X) },
      { name: 'Traditional', slot: 1, points: frontierCurve(curveRuns('Traditional'), X) },
      { name: 'OSO (choice)', slot: 3, points: frontierCurve(curveRuns('OSO (choice)'), X) },
    ],
    x: [0, X], y: [0, world.levels],
    xTicks: [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(X * t)),
    yTicks: Array.from({ length: world.levels + 1 }, (_, i) => i),
    format: { y: (v) => v.toFixed(1).replace(/\.0$/, ''), x: (v) => String(Math.round(v)) },
  }));
  writeFileSync(join(outDir, 'figures', 'alpha.svg'), lineChart({
    title: 'Does flow-back make agents share?',
    subtitle: `Agents choose whether to publish each intermediate result. Lower α: more value flows back to what a result built on.`,
    xLabel: 'α (share of value a result keeps)', yLabel: 'Share',
    series: [
      { name: 'Results shared', slot: 1, points: alphaPoints.map((p) => [p.alpha, p.sharing]) },
      { name: `Runs reaching level ${L}`, slot: 2, points: alphaPoints.map((p) => [p.alpha, p.reach]) },
    ],
    x: [0.1, 1], y: [0, 1], reverseX: true, markers: true,
    xTicks: [1, 0.8, 0.6, 0.4, 0.2], yTicks: [0, 0.25, 0.5, 0.75, 1],
    format: { y: (v) => `${Math.round(v * 100)}%`, x: (v) => String(v) },
  }));
  writeFileSync(join(outDir, 'figures', 'world.svg'), worldFigure(world, `The research tree: ${spec.title}`, spec.areas));

  // Sensitivity: OSO (agents choose what to share) against traditional, one parameter at a time.
  const choiceScenario = loadScenario(spec.scenarioFile ?? null, expandPaths(spec.scenario ?? {}), preset('osoChoice'));
  const sens = SENSITIVITY.map((p) => {
    const o = outputs[`sensitivity-${p.id}`];
    const fmtV = p.format ?? ((v: number) => String(v));
    const points = p.values.map((v) => {
      const c = summarize(byLabel(o, { setting: 'OSO (choice)', [p.id]: v }));
      const t = p.osoOnly ? trad : summarize(byLabel(o, { setting: 'Traditional', [p.id]: v }));
      return { v, value: fmtV(v), oso: c, trad: t, lead: c.frontier - t.frontier, leadSE: Math.hypot(c.frontierSE, t.frontierSE), targetLead: c.targetsSolved - t.targetsSolved };
    });
    const leads = points.map((q) => q.lead);
    return { p, points, base: getPath(choiceScenario, p.path) as number, baseLead: choice.frontier - trad.frontier, min: Math.min(...leads), max: Math.max(...leads) };
  });
  const groupName = { market: 'Set by communities, funders or the protocol', guess: 'Guessed: how agents think and see' };
  writeFileSync(join(outDir, 'figures', 'sensitivity.svg'), rangeChart({
    title: "How OSO's lead depends on each parameter",
    subtitle: `OSO with agents choosing what to share, minus traditional: hardest level reached (${seeds} runs per value). Right of 0: OSO ahead.`,
    xLabel: 'OSO lead in hardest level reached',
    rows: sens.map((x): RangeRow => ({ label: x.p.label, group: groupName[x.p.group], points: x.points.map((q) => ({ value: q.value, y: q.lead })), base: x.baseLead })),
    format: (v) => (v > 0 ? '+' : '') + v.toFixed(1),
  }));
  const grid = outputs.grid;
  const gridCell = (a: number, c: number) => summarize(byLabel(grid, { 'α': a, c }));
  const cFmt = (v: number) => `${Math.round(v * 100)}%`;
  writeFileSync(join(outDir, 'figures', 'flow-back-grid.svg'), heatmap({
    title: 'The flow-back levers together',
    subtitle: 'Share of intermediate results agents choose to publish; below it, the hardest level reached.',
    rowLabel: 'α, retention', colLabel: 'c, cited share of the mint',
    rows: GRID.alpha.map(String), cols: GRID.c.map(cFmt),
    values: GRID.alpha.map((a) => GRID.c.map((c) => gridCell(a, c).sharing)), range: [0, 1],
    format: (v) => pct(v), note: (r, k) => `level ${f1(gridCell(GRID.alpha[r], GRID.c[k]).frontier)}`,
  }));
  const market = sens.filter((x) => x.p.group === 'market');
  const mostSensitive = market.reduce((a, b) => (b.max - b.min > a.max - a.min ? b : a));
  const marketMin = market.reduce((a, b) => (b.min < a.min ? b : a));
  const worst = marketMin.points.reduce((a, b) => (b.lead < a.lead ? b : a));
  const worstText = worst.lead > 2 * worst.leadSE ? 'still clearly positive'
    : worst.lead < -2 * worst.leadSE ? '**negative: traditional research is ahead there**'
    : '**within noise: no clear difference there**';
  const sensRows = sens.flatMap((x) => x.points.map((q) => ({
    parameter: x.p.label, value: q.value + (q.v === x.base ? ' (this space)' : ''),
    'OSO frontier': f1(q.oso.frontier), 'traditional frontier': f1(q.trad.frontier), 'OSO lead': (q.lead >= 0 ? '+' : '') + f1(q.lead),
    'OSO targets': f1(q.oso.targetsSolved), 'traditional targets': f1(q.trad.targetsSolved), 'results shared': pct(q.oso.sharing),
  })));
  const gridTable = GRID.alpha.map((a) => ({ 'α \\ c': a, ...Object.fromEntries(GRID.c.map((c) => { const g = gridCell(a, c); return [cFmt(c), `${pct(g.sharing)} · ${f1(g.frontier)}`]; })) }));
  const gamerNote = mostSensitive.p.id === 'rho' && (scenario.agents.mix.gamer ?? 0) > 0
    ? ' Why ρ matters so much here: under traditional rules, when compute follows earnings, the first agent to earn takes the compute. In this community that is the gaming agent, which earns early from trivial results and then, holding all the compute, does the research too. Without a gaming agent the effect disappears (see the funding-rule-gamer experiment).'
    : '';
  const sensitivityLine = `Across the tested values of the parameters a market or community sets, OSO's lead (agents choosing what to share) runs from **${marketMin.min >= 0 ? '+' : ''}${f1(marketMin.min)}** to **+${f1(Math.max(...market.map((x) => x.max)))}** levels. The smallest lead, at ${marketMin.p.label} = ${worst.value}, is ${worstText}. The lead is most sensitive to **${mostSensitive.p.label}**.${gamerNote}`;

  const { commit, dirty } = git();
  const date = new Date().toISOString().slice(0, 10);
  const headline: Headline = {
    id: spec.id, title: spec.title, summary: spec.summary, verdict, maxLevel: world.levels, targetLevel: L, targets: T, budget: X,
    traditional: { frontier: trad.frontier, reach: trad.reach, cost: trad.cost, targetsSolved: trad.targetsSolved, value: trad.value, spend: trad.spend, roi: trad.roi },
    oso: { frontier: oso.frontier, reach: oso.reach, cost: oso.cost, targetsSolved: oso.targetsSolved, value: oso.value, spend: oso.spend, roi: oso.roi },
    osoChoice: { frontier: choice.frontier, sharing: choice.sharing },
    alphaStar, robustness: robustness.map((r) => ({ condition: r.condition, osoLead: r.osoLead })),
    sensitivity: sens.map((x) => ({ parameter: x.p.label, group: x.p.group, min: x.min, max: x.max, base: x.base })),
    seeds, commit: dirty ? `${commit}+` : commit, date,
  };

  const costLine = (s: typeof trad, name: string) =>
    s.reach > 0 ? `${name} ${Math.round(s.cost)} compute${s.reach < 1 ? ` (in the ${pct(s.reach)} of runs that got there)` : ''}` : `${name} never got there`;
  const verdictText = {
    'OSO ahead': 'For the same money, the OSO community got further, or got there more cheaply, than the traditional one.',
    'no clear difference': 'For the same money, there is no clear difference between the two communities.',
    'traditional ahead': 'For the same money, the traditional community got further, or got there more cheaply, than the OSO one.',
  }[verdict];
  const deadEnds = world.deadEnd.filter(Boolean).length;
  const levelsTable = Array.from({ length: world.levels }, (_, i) => i + 1).map((l) => {
    const rs = [...Array(world.n).keys()].filter((r) => world.level[r] === l);
    return { level: l, results: rs.length, targets: rs.filter((r) => world.isTarget[r]).length, 'success chance per attempt': pct(mean(rs.map((r) => world.p[r]))) };
  });
  const targetsTable = world.targets.map((t, k) => ({ target: world.names?.[t] ?? `T${k + 1}`, level: world.level[t], bounty: world.bounty[t], 'results it rests on': world.ancestors[t].size }));

  const settingsTable = settings.table.map((r) => r);
  const alphaTable = alphaPoints.map((p) => ({ α: p.alpha, 'intermediate results shared': pct(p.sharing), frontier: f1(p.frontier), [`reach level ${L}`]: pct(p.reach), 'targets solved': f1(p.targetsSolved) }));
  const robTable = robustness.map((r) => ({
    'shared knowledge': r.condition,
    'traditional frontier': f1(r.traditional.frontier), 'OSO frontier': f1(r.oso.frontier), 'OSO lead': (r.osoLead >= 0 ? '+' : '') + f1(r.osoLead),
    'traditional targets': f1(r.traditional.targetsSolved), 'OSO targets': f1(r.oso.targetsSolved),
  }));
  const weakest = robustness.reduce((a, b) => (b.osoLead < a.osoLead ? b : a));

  const verdictRule = `The verdict compares the hardest level reached, the targets solved and (when both communities reach level ${L} in at least 90% of runs) the cost to get there, each against two standard errors.`;
  const md = `# ${spec.title}: OSO vs. traditional research

> ${spec.summary}

**${verdictText}**

- **How far:** with a budget of ${X} compute, OSO reached level **${f1(oso.frontier)}** of ${world.levels} on average; traditional research reached **${f1(trad.frontier)}**.
- **Targets solved:** OSO solved **${f1(oso.targetsSolved)}** of ${T}; traditional solved **${f1(trad.targetsSolved)}**.
- **Cost to reach level ${L}:** ${costLine(oso, 'OSO')}; ${costLine(trad, 'traditional')}.
- **Return on the money (ROI):** OSO gained **${f2(oso.roi)}** in prize value per unit spent (${Math.round(oso.value)} for ${Math.round(oso.spend)}); traditional **${f2(trad.roi)}** (${Math.round(trad.value)} for ${Math.round(trad.spend)}). Value gained is the prizes of the targets solved.
- **Does flow-back make agents share?** ${alphaStar !== null ? `When agents choose, sharing rises clearly (by 0.2 or more) once α is ${alphaStar} or lower.` : 'When agents choose, sharing does not rise clearly (by 0.2) for any α down to 0.1.'} At OSO's default α = 0.8, agents shared ${pct(choice.sharing)} of their intermediate results.
- **Robustness:** OSO's lead in level is ${weakest.osoLead >= 0 ? 'smallest' : 'reversed'} when shared knowledge is **${weakest.condition}** (${weakest.osoLead >= 0 ? '+' : ''}${f1(weakest.osoLead)} levels).
- **Sensitivity:** ${sensitivityLine}

*${verdictRule} ${seeds} simulated runs per setting · simulator commit \`${headline.commit}\` · ${date}. This is a simulation with guessed parameters, not evidence about real research; see [What this shows](#what-this-shows-and-what-it-does-not).*

## 1. The problem space

${spec.description}

| In this space | means |
| --- | --- |
| a result | ${g.result} |
| a target | ${g.target} |
| an attempt | ${g.attempt} |
${g.area ? `| an area | ${g.area} |\n` : ''}${g.agent ? `| an agent | ${g.agent} |\n` : ''}
![The research tree](figures/world.svg)

The tree has ${world.n} results in ${world.levels} levels${spec.areas?.length ? ` and ${spec.areas.length} areas (${spec.areas.join(', ')})` : ''}. ${deadEnds} are dead ends: no target depends on them. ${world.targets.length} are targets:

${markdownTable(targetsTable)}

How hard each level is, before an agent's skill:

${markdownTable(levelsTable)}

The community has ${Object.values(scenario.agents.mix).reduce((a, b) => a + b, 0)} agents (${Object.entries(scenario.agents.mix).filter(([, n]) => n > 0).map(([a, n]) => `${n} ${a}`).join(', ')}) and a budget of ${X} compute over ${scenario.budget.rounds ?? '–'} rounds${calibrated ? ' (calibrated: the smallest budget at which OSO solves about 90% of the targets)' : ''}.

## 2. Progress for the money

![Hardest level published by compute spent](figures/frontier.svg)

Each line is the mean, over ${seeds} runs, of the hardest level the community had published after spending that much compute. A line that ends early means every target was solved and the funder stopped paying.

## 3. The six settings

The rules are the only difference between rows ([specification, section 3](../../docs/design.md#3-the-rules)). Traditional: nothing flows back to what a result built on, and work is published only when finished. OSO: value flows back (α = 0.8, c = 0.15), and results are published at once or when the agent chooses.

${markdownTable(settingsTable)}

Values are mean ± standard deviation over runs. *frontier*: hardest level published; *reach L${L}*: share of runs reaching level ${L}; *speed*, *cost*: rounds and compute to reach it; *credit*: how closely bounty pay matches true contribution; *sharing*: share of intermediate results published as soon as they were proved.

## 4. Does flow-back make agents share?

![Sharing and reach by α](figures/alpha.svg)

${markdownTable(alphaTable)}

${alphaStar !== null ? `Sharing rises clearly once α is ${alphaStar} or lower: this is the threshold α* in this space.` : 'Sharing does not rise clearly for any α in this range: in this space, flow-back alone does not make agents share.'} The threshold depends on the scoop risk ψ = ${scenario.behaviour.psi}, which is a guess.

## 5. When sharing is costly or sometimes wrong

Absorbing a published result costs 0.5 compute; proofs are wrong 10% of the time, results built on a wrong result are wrong too, and targets reveal and retract them.

${markdownTable(robTable)}

## 6. Sensitivity to the parameters

In OSO, α and c are set by each community ([OIP-14](https://github.com/open-science-org/OIPs/blob/master/OIPS/oip-14.md)), validators decide how strict the screen is, funders decide how far compute follows earnings, and the mint may become a community parameter ([OIP-8](https://github.com/open-science-org/OIPs/blob/master/OIPS/oip-8.md)). Their values will be set by competing communities, not by us, so the result must hold across them. The parameters below the line are our guesses about how agents think.

Each parameter is varied alone, from this space's settings, with agents choosing what to share (the realistic case: incentives matter only if sharing is a choice). The lead is OSO's hardest level reached minus traditional's under the same parameter value; α and c do not exist under traditional rules, so there it is compared with traditional's default.

![OSO's lead by parameter](figures/sensitivity.svg)

${sensitivityLine}

| parameter | means | tested | OSO lead (lowest to highest) |
| --- | --- | --- | --- |
${sens.map((x) => `| ${x.p.label} | ${x.p.meaning} | ${x.points.map((q) => q.value).join(', ')} | ${x.min >= 0 ? '+' : ''}${f1(x.min)} to ${x.max >= 0 ? '+' : ''}${f1(x.max)} |`).join('\n')}

The two flow-back levers together:

![Sharing by α and c](figures/flow-back-grid.svg)

${markdownTable(gridTable)}

Each cell: share of intermediate results published · hardest level reached.

<details><summary>Every tested value</summary>

${markdownTable(sensRows)}

</details>

## What this shows and what it does not

- **It is a simulation** of the [OSO demo specification](../../docs/design.md): results are abstract, success is chance, and agents follow a formula. It shows how the incentive rules play out *if* this space works as described, not that it does.
- **The parameters are guesses,** especially the success chances, the scoop risk ψ, and the costs and error rates in section 5. Section 6 varies each one alone; it does not vary them together, except α and c.
- **By default, sharing is free and always correct,** which favours OSO; section 5 shows how much of the lead survives without that.
${spec.notes ? `- **Notes for this space:** ${spec.notes}\n` : ''}
## Reproduce

\`\`\`sh
npm run sim -- report ${spec.id} --seeds ${seeds}
\`\`\`

The space is [spaces/${spec.id}.yaml](../../spaces/${spec.id}.yaml)${spec.source ? ` (${spec.source})` : ''}. Every number above is in [data.json](data.json). Generated by the OSO simulator at commit \`${headline.commit}\`${dirty ? ' (with uncommitted changes)' : ''}.
`;
  writeFileSync(join(outDir, 'report.md'), md);
  writeFileSync(join(outDir, 'space.yaml'), spaceToYaml(spec));
  writeFileSync(join(outDir, 'data.json'), JSON.stringify({
    headline,
    settings: settings.table, alpha: alphaTable, robustness: robTable, sensitivity: sensRows, flowBackGrid: gridTable,
    curves: Object.fromEntries(['Traditional', 'OSO (immediate)', 'OSO (choice)'].map((l) => [l, frontierCurve(curveRuns(l), X)])),
    world: { results: world.n, levels: world.levels, targets: T, deadEnds },
  }, null, 1) + '\n');
  if (root === REPORTS_DIR) writeCard(outDir, {
    id: spec.id, kind: 'field report', date, title: spec.title,
    design: {
      question: `For the same money, does OSO get further than traditional research in ${spec.title.replace(/^(An?|The) /, (m) => m.toLowerCase())}?`,
      compare: 'the six rule settings, an α sweep, the parameters one by one, costly and fallible sharing',
      fixed: `the field, ${Object.values(scenario.agents.mix).reduce((a, b) => a + b, 0)} agents and a budget of ${X}`,
      measure: 'hardest level reached', better: 'higher', runs: `${seeds} runs per setting`,
    },
    answer: `${verdict === 'OSO ahead' ? 'OSO ahead' : verdict === 'traditional ahead' ? 'Traditional ahead' : 'No clear difference'}: level ${f1(oso.frontier)} against ${f1(trad.frontier)} of ${world.levels}; targets ${f1(oso.targetsSolved)} against ${f1(trad.targetsSolved)} of ${T}; ROI ${f2(oso.roi)} against ${f2(trad.roi)}.`,
    table: [
      { rules: 'Traditional', 'hardest level': `${f1(trad.frontier)} of ${world.levels}`, 'targets solved': `${f1(trad.targetsSolved)} of ${T}`, [`cost to level ${L}`]: trad.reach > 0 ? Math.round(trad.cost) : 'never', ROI: `${f2(trad.roi)} (${Math.round(trad.value)} for ${Math.round(trad.spend)})` },
      { rules: 'OSO', 'hardest level': `${f1(oso.frontier)} of ${world.levels}`, 'targets solved': `${f1(oso.targetsSolved)} of ${T}`, [`cost to level ${L}`]: oso.reach > 0 ? Math.round(oso.cost) : 'never', ROI: `${f2(oso.roi)} (${Math.round(oso.value)} for ${Math.round(oso.spend)})` },
    ],
    caveats: ['A simulation with guessed parameters: it shows how the rules play out if the field works as described.', `OSO's lead as the market-set parameters vary: ${f1(marketMin.min)} to ${f1(Math.max(...market.map((x) => x.max)))} levels.`, ...(spec.notes ? [spec.notes] : [])],
    page: `reports/${spec.id}/card.md`,
    chart: `reports/${spec.id}/figures/frontier.svg`,
  }, `The full report: [report.md](report.md).`, 'card.md');
  writeIndex(root);
  return headline;
}

/** reports/README.md: every space with its headline numbers. */
export function writeIndex(root = REPORTS_DIR): void {
  if (!existsSync(root)) return;
  // In the repository's reports folder, list only reports whose space still exists.
  const known = root === REPORTS_DIR ? new Set(spaceIds()) : null;
  const heads: Headline[] = readdirSync(root)
    .filter((d) => existsSync(join(root, d, 'data.json')) && (!known || known.has(d)))
    .map((d) => (JSON.parse(readFileSync(join(root, d, 'data.json'), 'utf8')) as { headline: Headline }).headline)
    .sort((a, b) => a.title.localeCompare(b.title));
  const rows = heads.map((h) => ({
    'problem space': `[${h.title}](${h.id}/report.md)`,
    verdict: cap(h.verdict),
    'level reached (OSO / traditional)': `${f1(h.oso.frontier)} / ${f1(h.traditional.frontier)} of ${h.maxLevel}`,
    'targets solved (OSO / traditional)': `${f1(h.oso.targetsSolved)} / ${f1(h.traditional.targetsSolved)} of ${h.targets}`,
    'α*': h.alphaStar ?? '–',
    'OSO lead across market parameters': h.sensitivity ? (() => { const m = h.sensitivity.filter((x) => x.group === 'market'); return `${f1(Math.min(...m.map((x) => x.min)))} to ${f1(Math.max(...m.map((x) => x.max)))} levels`; })() : '–',
    runs: h.seeds,
    date: h.date,
  }));
  writeFileSync(join(root, 'README.md'), `# Problem-space reports

Every problem space in [spaces/](../spaces/) gets the same canonical report: the same experiments, the same sections, the same figures. Add a space by hand or with \`npm run sim -- new "<description>"\`, then \`npm run sim -- report <id>\`.

**OSO lead across market parameters**: the range of OSO's lead in level (agents choosing what to share) as each community- or funder-set parameter is varied alone (report section 6).

**α\\*** is the highest α at which agents who choose clearly share more (by 0.2) than at α = 1; "–" means not within α ≥ 0.1.

${rows.length ? markdownTable(rows) : 'No reports yet.'}
`);
}

export { f2 };
