// Simulator tests: the waterfall against the ledger, the one-chain check against exact predictions,
// traditional rules as a special case, accounting, reproducibility, the model's predictions, and
// the configuration layer (validation, plugins, file worlds, experiment expansion).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Chain } from '../vendor/oso-ledger/ledger/chain.ts';
import { makeTx, versionId } from '../vendor/oso-ledger/ledger/ledger.ts';
import { ONE_OSO, acct, balance } from '../vendor/oso-ledger/ledger/state.ts';
import { importVersion } from '../vendor/oso-ledger/ledger/versions.ts';
import { DEV_PARAMS, devAddress, devKeys } from '../vendor/oso-ledger/api/demo.ts';
import { hiddenDepth, sharedDepth } from '../src/experiments/analytic.ts';
import { loadScenario, type Scenario } from '../src/engine/config.ts';
import { expand, loadExperiment, preset } from '../src/experiments/experiment.ts';
import { run } from '../src/engine/model.ts';
import { Rng } from '../src/engine/rng.ts';
import { attributionValue, shares, worlds } from '../src/engine/world.ts';

const worldOf = (sc: Scenario, seed: number) => worlds.create(sc.world, 'world')(sc.success, new Rng(seed).fork(1));
/** The default scenario with a named preset and further overrides. */
const scenarioFor = (name: string, ...overrides: Record<string, unknown>[]) => loadScenario(null, preset(name), ...overrides);
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
/** The random-layer world (every parent required, a fixed chance per level). The mechanism tests below were
 * calibrated on it; the default world is now the idea generator. */
const LAYERED = { world: { kind: 'layered' } };

test("the simulator's waterfall pays what the ledger's OIP-14 waterfall pays", () => {
  const sc = loadScenario(null, { world: { kind: 'layered', levels: 4, width: 3, targets: [{ level: 4, count: 1 }] } });
  const world = worldOf(sc, 7);
  // Integer weights in bps, as the ledger stores them, used by both sides.
  const bps = world.weights.map((ws) => {
    const out = ws.map((w) => Math.floor(w * 10_000));
    if (out.length) out[0] += 10_000 - out.reduce((a, b) => a + b, 0);
    return out;
  });
  const alpha = 0.7;
  const share = shares(world, alpha, bps.map((ws) => ws.map((x) => x / 10_000)));

  const op = devKeys.operator;
  const chain = new Chain(op);
  const params = { ...DEV_PARAMS, alpha_default: alpha * 10_000, dust: '1', settle_cap: 10_000 };
  chain.commit([makeTx(op, chain.state, 'genesis', { params, bootstrap: (1000n * ONE_OSO).toString() })]);
  chain.commit([makeTx(op, chain.state, 'bootstrap.grant', { to: devAddress('funder'), amount: (100n * ONE_OSO).toString() })]);
  const ids: string[] = [];
  chain.commit(world.level.map((l, r) => {
    const v = importVersion({
      key: `r${r}`, tier: 'curated', title: `Result ${r}`, abstract: '', authors: ['X'], date: `${2000 + l}-01-01`,
      date_precision: 'day', type: 'paper', venue: '', citation_count: 0, external_ids: { s2: `r${r}` }, references: [],
    }, devAddress('operator'));
    ids.push(versionId(v));
    return makeTx(op, chain.state, 'idea.import', { version: v, origin_date: `${2000 + l}-01-01`, tier: 'curated' }, r);
  }));
  const approvals = world.prereqs.flatMap((ps, r) => ps.length
    ? [['weights.approve', { work_id: ids[r], parents: Object.fromEntries(ps.map((j, k) => [ids[j], bps[r][k]])), basis: 'test' }] as const]
    : []);
  chain.commit(approvals.map(([type, body], i) => makeTx(op, chain.state, type, body, i)));

  const t = world.targets[0];
  const amount = 100n * ONE_OSO;
  const b = chain.commit([makeTx(devKeys.funder, chain.state, 'idea.fund', { work_id: ids[t], amount: amount.toString() })]);
  assert.ok(b.txs[0].ok, b.txs[0].error ?? '');
  for (let i = 0; i < 5 && chain.state.queue.length; i++) chain.commit([]);
  for (let r = 0; r < world.n; r++) {
    const got = Number(balance(chain.state, acct.unresolved(ids[r]))) / Number(amount);
    assert.ok(Math.abs(got - share[t][r]) < 1e-9, `result ${r}: ledger ${got}, simulator ${share[t][r]}`);
  }
});

test('the one-chain check matches its exact predictions', () => {
  const X = 320;
  const p = 0.2;
  for (const [N, kind] of [[4, 'immediate'], [4, 'finished-only']] as const) {
    const sc = loadScenario(null, {
      world: { kind: 'chain', length: 200 },
      success: { p0: p, eta: 1 },
      budget: { X, perAgentPerRound: 1, allocation: { kind: 'equal' } },
      'agents.mix': { foundation: 0, racer: 0, explorer: 0, specialist: 0, freeRider: 0, gamer: 0, plain: N },
      'rules.visibility': { kind },
    });
    const depths = Array.from({ length: 300 }, (_, k) => run(sc, 300 + k).deepestProved);
    const exact = kind === 'immediate' ? sharedDepth(X, p) : hiddenDepth(X, p, N);
    const se = exact.sd / Math.sqrt(depths.length);
    assert.ok(Math.abs(mean(depths) - exact.mean) < 4 * se, `${kind}: simulated ${mean(depths)}, exact ${exact.mean} ± ${se}`);
  }
});

test('with traditional rules, only targets have attribution value', () => {
  const world = worldOf(loadScenario(), 3);
  const S = attributionValue(world, shares(world, 1, world.weights), world.weights, 0, 1);
  for (let r = 0; r < world.n; r++) if (!world.isTarget[r]) assert.equal(S[r], 0);
  const osoS = attributionValue(world, shares(world, 0.8, world.weights), world.weights, 0.15, 1);
  assert.ok(osoS.some((x, r) => !world.isTarget[r] && x > 0));
});

test('runs are reproducible from their seed', () => {
  assert.deepEqual(run(scenarioFor('osoChoice'), 11), run(scenarioFor('osoChoice'), 11));
});

test('everything paid out equals mints plus bounties of solved targets', () => {
  for (const setting of ['traditional', 'oso', 'creditOnly', 'sharingOnly', 'traditionalChoice', 'osoChoice']) {
    const sc = scenarioFor(setting);
    const r = run(sc, 5);
    const world = worldOf(sc, 5);
    const solvedBounty = r.totalEarnings - (r.published + r.trivialPublished) * sc.rules.mint;
    const bounties = world.targets.map((t) => world.bounty[t]);
    const subsetSums = bounties.reduce<number[]>((sums, x) => [...sums, ...sums.map((y) => y + x)], [0]);
    assert.ok(subsetSums.some((x) => Math.abs(x - solvedBounty) < 1e-6), `${setting}: unexplained payout ${solvedBounty}`);
  }
});

test('prediction 1: sharing pools search, so OSO reaches deeper than traditional for the same budget', () => {
  const frontier = (setting: string) => mean(Array.from({ length: 12 }, (_, k) => run(scenarioFor(setting, LAYERED), 100 + k).frontier));
  assert.ok(frontier('oso') > frontier('traditional') + 1);
});

test('prediction 2: with enough flow-back, agents choose to share', () => {
  const sharing = (alpha: number) => mean(Array.from({ length: 12 }, (_, k) =>
    run(loadScenario(null, LAYERED, { 'behaviour.psi': 0.1, rules: { alpha, c: alpha === 1 ? 0 : 0.15, visibility: { kind: 'choice' } } }), 200 + k).sharingRate));
  assert.ok(sharing(0.3) > sharing(1) + 0.3);
});

test('misspelled settings and unknown plugin parameters are rejected', () => {
  assert.throws(() => loadScenario(null, { 'rules.alhpa': 0.5 }), /unknown setting "rules.alhpa"/);
  assert.throws(() => loadScenario(null, { 'rules.alpha': 'high' }), /rules.alpha must be a number/);
  assert.throws(() => loadScenario(null, { 'agents.mix.wizard': 2 }), /not defined in agents.archetypes/);
  assert.throws(() => run(loadScenario(null, { 'rules.visibility': { kind: 'delayed', dd: 2 } }), 1), /has no parameter "dd"/);
  assert.throws(() => run(loadScenario(null, { 'rules.visibility': { kind: 'telepathy' } }), 1), /unknown visibility "telepathy"/);
});

test('a component whose kind changes does not keep the old kind\'s parameters', () => {
  const sc = loadScenario(null, { world: { kind: 'chain', length: 10 } });
  assert.deepEqual(sc.world, { kind: 'chain', length: 10 });
});

test('a world read from a file runs, with levels derived from prerequisites', () => {
  const dir = mkdtempSync(join(tmpdir(), 'oso-sim-'));
  const path = join(dir, 'dag.json');
  writeFileSync(path, JSON.stringify({ nodes: [
    { id: 'a' }, { id: 'b' }, { id: 'ab', prereqs: ['a', 'b'] }, { id: 'goal', prereqs: ['ab'], bounty: 10, p: 0.5 },
  ] }));
  const sc = loadScenario(null, { world: { kind: 'file', path }, 'measures.targetLevel': 3 });
  const world = worldOf(sc, 1);
  assert.deepEqual(world.level, [1, 1, 2, 3]);
  assert.equal(world.p[3], 0.5);
  assert.deepEqual(world.targets, [3]);
  const r = run(sc, 1);
  assert.equal(r.targetsSolved, 1);
});

test('experiments expand factors, presets, patches and exclusions into rows', () => {
  const psi = expand(loadExperiment('alpha-psi'));
  assert.equal(psi.length, 27);
  assert.ok(!psi.some((r) => r.scenario.rules.alpha === 1 && r.scenario.rules.c === 0.15));
  const sweep = expand(loadExperiment('alpha-sweep'));
  assert.equal(sweep[0].scenario.rules.c, 0);
  assert.equal(sweep[1].scenario.rules.c, 0.15);
  const settings = expand(loadExperiment('settings'));
  assert.deepEqual(settings[1].scenario.rules, scenarioFor('oso').rules);
  const sens = expand(loadExperiment('sensitivity'));
  assert.equal(sens.length, 8);
  assert.equal(sens[6].scenario.agents.mix.gamer, 0);
});

test('delayed visibility publishes lemmas the stated number of rounds later', () => {
  const r = run(loadScenario(null, LAYERED, { 'rules.visibility': { kind: 'delayed', d: 3 } }), 4);
  assert.ok(r.publicationLag >= 3, `lag ${r.publicationLag}`);
});

test('a learning oracle, where failures raise the next chance, reaches deeper than pure chance', () => {
  const chain = (oracle: Record<string, unknown>) => loadScenario(null, {
    world: { kind: 'chain', length: 200 },
    success: { p0: 0.1, eta: 1, oracle },
    budget: { X: 200, perAgentPerRound: 1, allocation: { kind: 'equal' } },
    'agents.mix': { foundation: 0, racer: 0, explorer: 0, specialist: 0, freeRider: 0, gamer: 0, plain: 1 },
    'rules.visibility': { kind: 'immediate' },
  });
  const depth = (sc: Scenario) => mean(Array.from({ length: 200 }, (_, k) => run(sc, 500 + k).deepestProved));
  const chance = depth(chain({ kind: 'chance' }));
  const learning = depth(chain({ kind: 'learning', gain: 0.5 }));
  assert.ok(Math.abs(chance - 20) < 1.5, `chance oracle: ${chance}, expected about X·p = 20`);
  assert.ok(learning > chance + 5, `learning ${learning} vs chance ${chance}`);
});

test('deciders can differ by archetype, and a zero-intelligence decider runs', () => {
  const sc = loadScenario(null, LAYERED, { 'agents.deciders': { gamer: { kind: 'random' }, racer: { kind: 'random', publish: 0 } } });
  const r = run(sc, 3);
  assert.ok(r.published > 0);
  // A random gamer never games, so nothing trivial is farmed.
  assert.equal(r.trivialPublished, 0);
  const all = run(loadScenario(null, { 'behaviour.decider': { kind: 'random' }, 'rules.visibility': { kind: 'immediate' } }), 3);
  assert.ok(all.frontier >= 1);
  assert.throws(() => run(loadScenario(null, { 'agents.deciders': { gamer: { kind: 'oracle-reader' } } }), 1), /unknown decider/);
});

test('costly knowledge is paid from the budget, so spend never exceeds X', () => {
  const runs = (absorbCost: number) => Array.from({ length: 10 }, (_, k) => run(scenarioFor('oso', LAYERED, { 'knowledge.absorbCost': absorbCost }), 700 + k));
  const free = runs(0);
  const costly = runs(1);
  for (const r of costly) assert.ok(r.spend <= 1200 + 1e-9, `spend ${r.spend}`);
  assert.ok(mean(costly.map((r) => r.absorbShare)) > 0.2);
  assert.ok(mean(costly.map((r) => r.frontier)) < mean(free.map((r) => r.frontier)));
});

test('wrong results spread, are rejected at targets, and are retracted', () => {
  const none = run(scenarioFor('oso'), 9);
  assert.equal(none.rejectedTargets + none.retracted, 0);
  const rs = Array.from({ length: 10 }, (_, k) => run(scenarioFor('oso', { 'knowledge.errorRate': 0.15 }), 800 + k));
  assert.ok(mean(rs.map((r) => r.rejectedTargets)) > 1);
  assert.ok(mean(rs.map((r) => r.retracted)) > 1);
});

test('public failures let agents learn from each other', () => {
  const chain = (publishFailures: boolean) => loadScenario(null, {
    world: { kind: 'chain', length: 200 },
    success: { p0: 0.05, eta: 1, oracle: { kind: 'learning', gain: 0.1 } },
    budget: { X: 400, perAgentPerRound: 1, allocation: { kind: 'equal' } },
    'agents.mix': { foundation: 0, racer: 0, explorer: 0, specialist: 0, freeRider: 0, gamer: 0, plain: 4 },
    rules: { visibility: { kind: 'immediate' }, publishFailures },
  });
  const depth = (sc: Scenario) => mean(Array.from({ length: 100 }, (_, k) => run(sc, 900 + k).deepestProved));
  assert.ok(depth(chain(true)) > depth(chain(false)) + 3);
});

test('the Lean reference tree loads as a world', () => {
  const sc = loadScenario('lean-tree');
  const world = worldOf(sc, 1);
  assert.equal(world.n, 42);
  assert.equal(world.targets.length, 8);
  assert.equal(world.levels, 7);
  assert.ok(mean(Array.from({ length: 10 }, (_, k) => run(loadScenario('lean-tree', { rules: { alpha: 0.8, c: 0.15, visibility: { kind: 'immediate' } } }), k + 1).targetsSolved)) > 7);
});

test('problem spaces load, and a bad space is rejected with a usable message', async () => {
  const { loadSpace, parseSpace, spaceIds } = await import('../src/spaces/spaces.ts');
  for (const id of spaceIds()) assert.equal(loadSpace(id).spec.id, id);
  const good = loadSpace('example-narrow-stages').spec;
  assert.throws(() => parseSpace({ ...good, id: 'Not Kebab' }), /kebab-case/);
  assert.throws(() => parseSpace({ ...good, glossary: { idea: 'x', target: '', attempt: 'y' } }), /glossary.target/);
  assert.throws(() => parseSpace({ ...good, scenario: { 'world.targets': [] } }), /no targets/);
  assert.throws(() => parseSpace({ ...good, scenario: { ...good.scenario, 'measures.targetLevel': 9 } }), /deepest level/);
});

test('an inline graph world builds, with levels from prerequisites', () => {
  const sc = loadScenario(null, { world: { kind: 'graph', nodes: [
    { id: 'a' }, { id: 'b', prereqs: ['a'] }, { id: 'c', prereqs: ['a'] }, { id: 'goal', prereqs: ['b', 'c'], bounty: 5 },
  ] }, 'measures.targetLevel': 3 });
  const w = worldOf(sc, 1);
  assert.deepEqual(w.level, [1, 2, 2, 3]);
  assert.throws(() => worldOf(loadScenario(null, { world: { kind: 'graph', nodes: [{ id: 'a', prereqs: ['b'] }, { id: 'b', bounty: 1 }] } }), 1), /listed before it/);
});

test('generating a space sends errors back to the model until the file is valid', async () => {
  const { generateSpace } = await import('../src/spaces/new-space.ts');
  const valid = readFileSync(new URL('../spaces/example-narrow-stages.yaml', import.meta.url), 'utf8').replace('id: example-narrow-stages', 'id: test-space');
  const replies = ['```yaml\nid: test-space\ntitle: T\n```', '```yaml\n' + valid + '\n```'];
  const seen: string[] = [];
  const space = await generateSpace('a test field', async (_system, messages) => {
    seen.push(messages[messages.length - 1].content);
    return replies.shift()!;
  });
  assert.equal(space.spec.id, 'test-space');
  assert.match(seen[1], /not valid/);
  assert.ok(space.scenario.budget.X > 0);
  assert.match(space.spec.source ?? '', /generated by/);
});

test('the canonical report has the same sections for every space', async () => {
  const { buildReport } = await import('../src/report/report.ts');
  const REPORTS_DIR = mkdtempSync(join(tmpdir(), 'oso-reports-'));
  const { loadSpace } = await import('../src/spaces/spaces.ts');
  const space = loadSpace('example-narrow-stages');
  const spec = { ...space.spec, id: 'test-report' };
  const h = buildReport({ spec, scenario: space.scenario }, 4, () => {}, REPORTS_DIR);
  const md = readFileSync(join(REPORTS_DIR, 'test-report', 'report.md'), 'utf8');
  for (const heading of ['## 1. The problem space', '## 2. Progress for the money', '## 3. The six settings', '## 4. Does flow-back make agents share?', '## 5. When sharing is costly or sometimes wrong', '## 6. Sensitivity to the parameters', '## What this shows and what it does not', '## Reproduce']) {
    assert.ok(md.includes(heading), heading);
  }
  for (const f of ['figures/frontier.svg', 'figures/alpha.svg', 'figures/world.svg', 'figures/sensitivity.svg', 'figures/flow-back-grid.svg', 'data.json']) assert.ok(existsSync(join(REPORTS_DIR, 'test-report', f)), f);
  assert.ok(['OSO ahead', 'no clear difference', 'traditional ahead'].includes(h.verdict));
});

test('a traced run is the same run, and its events account for what was published', async () => {
  const { traceRun } = await import('../src/engine/model.ts');
  for (const name of ['traditional', 'oso', 'osoChoice']) {
    const sc = scenarioFor(name);
    const t = traceRun(sc, 5);
    assert.deepEqual(t.result, run(sc, 5));
    const published = new Set(t.events.filter((e) => e.k === 'publish').map((e) => (e as { x: number }).x));
    const rounds = t.events.filter((e) => e.k === 'round');
    assert.equal(rounds.length, t.result.curve.length);
    assert.equal(Math.max(0, ...[...published].map((x) => t.world.level[x])), t.result.frontier);
  }
});

test('the designer turns a design into a valid experiment and rejects bad designs', async () => {
  const design = await import('../src/viewer/design.ts');
  const d = { id: 'designer-test', title: 'T', space: 'example-tightly-linked', settings: ['traditional', 'oso'], vary: [{ path: 'rules.screen', values: [0, 0.9] }], columns: ['frontier'], seeds: 3 };
  const c = design.checkExperiment(d);
  assert.ok(c.ok, c.error ?? '');
  assert.equal(c.rows, 4);
  assert.equal(c.runs, 12);
  const spec = design.experimentFor(d);
  assert.equal(spec.factors?.[0].name, 'setting');
  assert.equal((spec.set as Record<string, Record<string, unknown>>).budget.X, 260, 'uses the calibrated budget');
  assert.equal(design.checkExperiment({ ...d, id: 'Bad Name' }).ok, false);
  assert.equal(design.checkExperiment({ ...d, settings: [] }).ok, false);
  assert.equal(design.checkExperiment({ ...d, vary: [{ path: 'rules.nope', values: [1] }] }).ok, false);
  // α belongs to the flow-back settings: varying it leaves the traditional row traditional.
  const { expand } = await import('../src/experiments/experiment.ts');
  const rows = expand(design.experimentFor({ ...d, settings: ['traditional', 'osoChoice'], vary: [{ path: 'rules.alpha', values: [0.2, 0.6] }], set: { 'rules.c': 0.3, 'rules.screen': 0.9 } }));
  assert.equal(rows.length, 3);
  assert.deepEqual(rows.map((r) => [r.scenario.rules.alpha, r.scenario.rules.c, r.scenario.rules.screen]), [[1, 0, 0.9], [0.2, 0.3, 0.9], [0.6, 0.3, 0.9]]);
  assert.equal(design.checkExperiment({ ...d, set: { 'rules.screen': 3 } }).ok, false, 'out of range');
  // A designed community replaces the field's: kinds left out get no agents.
  const custom = expand(design.experimentFor({ ...d, agents: { archetypes: { foundation: { skill: 1.5, conjecture: 0.7, cost: 1, horizon: 0.98, risk: 0.2, reuse: 0.9, sharing: 0.5, gaming: 0, specialist: false } }, mix: { foundation: 6 } } }));
  const mix = custom[0].scenario.agents.mix;
  assert.equal(Object.values(mix).reduce((a, b) => a + b, 0), 6);
  assert.equal(custom[0].scenario.agents.archetypes.foundation.skill, 1.5);
  assert.equal(design.checkExperiment({ ...d, agents: { archetypes: {}, mix: { racer: 0, foundation: 0, explorer: 0, specialist: 0, freeRider: 0, gamer: 0 } } }).ok, false, 'needs an agent');
});

test("the app's page script parses", async () => {
  const { Script } = await import('node:vm');
  const html = readFileSync(new URL('../src/viewer/index.html', import.meta.url), 'utf8');
  const script = /<script>([\s\S]*)<\/script>/.exec(html)?.[1] ?? '';
  assert.ok(script.length > 1000);
  assert.doesNotThrow(() => new Script(script), 'syntax error in src/viewer/index.html');
});

test('the simple model (α, β): beta sets the share of ideas published at once', async () => {
  const { loadScenario } = await import('../src/engine/config.ts');
  const { run } = await import('../src/engine/model.ts');
  const share = (beta: number) => {
    const sc = loadScenario(null, { rules: { visibility: { kind: 'chance', beta } } });
    const rs = [1, 2, 3, 4, 5, 6].map((seed) => run(sc, seed));
    return rs.reduce((a, r) => a + r.sharingRate, 0) / rs.length;
  };
  const [none, half, all] = [share(0), share(0.5), share(1)];
  assert.ok(none < 0.05, `beta 0 publishes almost nothing at once (${none})`);
  assert.ok(Math.abs(half - 0.5) < 0.12, `beta 0.5 publishes about half (${half})`);
  assert.ok(all > 0.95, `beta 1 publishes everything (${all})`);
});

test('the idea graph generator: structure, length and composition are set separately', async () => {
  const { ideasWorld } = await import('../src/engine/world.ts');
  const { Rng } = await import('../src/engine/rng.ts');
  const base = { levels: 5, width: 6, parents: 2, skip: 0.2, length: 3, lengthGrowth: 2, composition: 0.7, targets: 2, targetsFrom: 0, bountyBase: 4, bountyGrowth: 2, attemptLimit: 24 };
  const w = ideasWorld(base, new Rng(7));
  assert.equal(w.n, 30);
  // Difficulty: an idea at level l is a sequence of length + lengthGrowth·(l − 1) bits.
  for (let x = 0; x < w.n; x++) assert.equal(w.bits![x].length, 3 + 2 * (w.level[x] - 1));
  // Attribution: link weights add up to 1, and a parent resolves only bits that are inside the child.
  for (let x = 0; x < w.n; x++) if (w.prereqs[x].length) assert.ok(Math.abs(w.weights[x].reduce((a, b) => a + b, 0) - 1) < 1e-9);
  // Composition 0: nothing is inherited, so knowing the parents leaves the whole sequence to find.
  const none = ideasWorld({ ...base, composition: 0 }, new Rng(7));
  for (let x = 0; x < none.n; x++) assert.equal(none.p[x], 2 ** -none.bits![x].length);
  assert.equal(w.targets.length, 2);
});

test('with bits, knowing an idea resolves its bits inside every later idea (the HHT, HHTHHH case)', async () => {
  const { finishWorld } = await import('../src/engine/world.ts');
  const { chanceOf, frontier } = await import('../src/engine/difficulty.ts');
  // y = bits 0-2 (HHT); x = y's bits plus 3 new ones (HHTHHH): knowing y halves the bits left.
  const w = finishWorld({ level: [1, 2], area: [0, 0], p: [1 / 8, 1 / 8], prereqs: [[], [0]], bounty: [0, 16], bits: [[0, 1, 2], [0, 1, 2, 3, 4, 5]] });
  const v = { world: w, known: [new Set<number>(), new Set([0])], knowVersion: new Int32Array(2) };
  assert.equal(chanceOf(v, 0, 1), 2 ** -6, 'from scratch: all six bits');
  assert.equal(chanceOf(v, 1, 1), 2 ** -3, 'knowing y: half the work done');
  assert.ok(frontier(v, 0).includes(1), 'x can be attempted without knowing y');
  assert.deepEqual(w.weights[1], [1]);
});

test('the generator can put bounties on deeper levels too, larger the deeper', async () => {
  const { ideasWorld } = await import('../src/engine/world.ts');
  const { Rng } = await import('../src/engine/rng.ts');
  const base = { levels: 6, width: 8, parents: 2, skip: 0.2, length: 3, lengthGrowth: 2, composition: 0.7, targets: 2, targetsFrom: 0, bountyBase: 4, bountyGrowth: 2, attemptLimit: 24 };
  const top = ideasWorld(base, new Rng(3));
  assert.deepEqual([...new Set(top.targets.map((t) => top.level[t]))], [6], 'by default, the top level only');
  const deep = ideasWorld({ ...base, targetsFrom: 3 }, new Rng(3));
  assert.deepEqual([...new Set(deep.targets.map((t) => deep.level[t]))].sort(), [3, 4, 5, 6]);
  assert.ok(deep.bounty[deep.targets.find((t) => deep.level[t] === 3)!] < deep.bounty[deep.targets.find((t) => deep.level[t] === 6)!]);
  assert.deepEqual(top.bits, deep.bits, 'the graph itself is the same');
});

test('scaling across difficulty: budget to reach a share, and the log-log slope', async () => {
  const { budgetFor, slopeOf } = await import('../src/report/ladder.ts');
  const pts = [{ budget: 100, share: 0.1 }, { budget: 200, share: 0.3 }, { budget: 400, share: 0.7 }, { budget: 800, share: 1 }];
  const b = budgetFor(pts, 0.5)!;
  assert.ok(b > 200 && b < 400, `between the budgets that bracket it (${b})`);
  assert.equal(budgetFor(pts.slice(0, 2), 0.5), null, 'never reached');
  // value = budget²: a slope of 2 on log-log axes.
  assert.ok(Math.abs(slopeOf([100, 200, 400, 800, 1600].map((x) => ({ budget: x, value: x * x / 1000 })).concat([{ budget: 3200, value: 1e9 }]))! - 2) < 1e-9);
});

test('knowledge counts distinct bits of solved ideas, a shared bit once', async () => {
  const { knowledgeOf } = await import('../src/engine/difficulty.ts');
  const w = { bits: [[0, 1, 2], [0, 1, 2, 3, 4, 5], [6, 7]], p: [0.5, 0.5, 0.5] } as unknown as Parameters<typeof knowledgeOf>[0];
  assert.equal(knowledgeOf(w, [0, 1]), 6);
  assert.equal(knowledgeOf(w, [0, 1, 2]), 8);
  const r = run(loadScenario(null, { 'rules.visibility': { kind: 'immediate' } }), 5);
  assert.ok(r.knowledge >= r.knowledgePublished && r.knowledgePublished > 0);
  assert.ok(Math.abs(r.knowledgePerMoney - r.knowledge / r.spend) < 1e-9);
});

test('the knowledge reward pays each new bit once, and alpha0 only moves who gets it', () => {
  const sc = (alpha0: number | null) => loadScenario(null, { rules: { alpha: 0.8, alpha0, c: 0, mint: 0, mintPerBit: 1, visibility: { kind: 'immediate' } } });
  for (const a0 of [null, 1, 0.3]) {
    const r = run(sc(a0), 11);
    // Everything paid is bounties plus one unit per bit published (flow-back moves money, never makes it).
    assert.ok(Math.abs(r.totalEarnings - r.value - r.knowledgePublished) < 1e-6, `alpha0 ${a0}: ${r.totalEarnings} vs ${r.value} + ${r.knowledgePublished}`);
  }
});
