// The world: a hidden DAG of results (docs/simulator.md, section 2.1). World generators are plugins in
// the `worlds` registry; each turns its parameters and the success model into a World.
import { ROOT } from '../paths.ts';
import { readFileSync } from 'node:fs';
import { isAbsolute, join } from 'node:path';
import type { Scenario } from './config.ts';
import { Registry } from './registry.ts';
import type { Rng } from './rng.ts';
import { bitsWeights } from './difficulty.ts';

export interface World {
  n: number;
  /** Deepest level. */
  levels: number;
  level: number[];
  area: number[];
  /** Base success chance per attempt, before skill. */
  p: number[];
  prereqs: number[][];
  children: number[][];
  /** True attribution weights over each result's prerequisites, proportional to 1/p_j. */
  weights: number[][];
  isTarget: boolean[];
  bounty: number[];
  targets: number[];
  ancestors: Set<number>[];
  /** Targets strictly below each result (targets that depend on it). */
  targetsBelow: number[][];
  deadEnd: boolean[];
  /** Optional names, for worlds read from a file. */
  names?: string[];
  /** Ideas as bit sequences (the `ideas` generator): the bit ids each idea contains, its parents' shares included. */
  bits?: number[][];
  /** With bits: ideas needing more unresolved bits than this are not attempted. */
  attemptLimit?: number;
}

export type WorldMaker = (success: Scenario['success'], rng: Rng) => World;

export const worlds = new Registry<Record<string, unknown>, WorldMaker>('world');

/** Fills in everything derived from levels, prerequisites, p and bounties. */
export function finishWorld(base: { level: number[]; area: number[]; p: number[]; prereqs: number[][]; bounty: number[]; names?: string[]; bits?: number[][]; attemptLimit?: number }): World {
  const { level, area, p, prereqs, bounty } = base;
  const n = level.length;
  const children: number[][] = Array.from({ length: n }, () => []);
  prereqs.forEach((ps, r) => ps.forEach((j) => children[j].push(r)));
  // Link weights: the work each parent saves. With bits, the bits it resolves (Shapley); otherwise 1/p.
  const weights = base.bits ? bitsWeights(prereqs, base.bits) : prereqs.map((ps) => {
    const raw = ps.map((j) => 1 / p[j]);
    const sum = raw.reduce((a, b) => a + b, 0);
    return raw.map((x) => x / sum);
  });
  const ancestors: Set<number>[] = [];
  for (let r = 0; r < n; r++) {
    const a = new Set<number>();
    for (const j of prereqs[r]) {
      if (j >= r) throw new Error(`world: result ${r} builds on result ${j}, which must come earlier in the list`);
      a.add(j);
      for (const x of ancestors[j]) a.add(x);
    }
    ancestors.push(a);
  }
  const isTarget = bounty.map((b) => b > 0);
  const targets = [...Array(n).keys()].filter((r) => isTarget[r]);
  const targetsBelow: number[][] = Array.from({ length: n }, () => []);
  for (const t of targets) for (const a of ancestors[t]) targetsBelow[a].push(t);
  const deadEnd = [...Array(n).keys()].map((r) => !isTarget[r] && targetsBelow[r].length === 0);
  return {
    n, levels: Math.max(0, ...level), level, area, p, prereqs, children, weights, isTarget, bounty, targets,
    ancestors, targetsBelow, deadEnd, names: base.names,
    ...(base.bits ? { bits: base.bits, attemptLimit: base.attemptLimit ?? 24 } : {}),
  };
}

interface LayeredParams extends Record<string, unknown> {
  levels: number;
  width: number;
  maxPrereqs: number;
  skipProb: number;
  areas: number;
  areaStickiness: number;
  targets: { level: number; count: number }[];
  bountyBase: number;
  bountyGrowth: number;
}

function layered(params: LayeredParams): WorldMaker {
  return (success, rng) => {
    const level: number[] = [];
    const area: number[] = [];
    const prereqs: number[][] = [];
    const byLevel: number[][] = [];
    for (let l = 1; l <= params.levels; l++) {
      byLevel[l] = [];
      for (let k = 0; k < params.width; k++) {
        const r = level.length;
        level.push(l);
        byLevel[l].push(r);
        if (l === 1) {
          prereqs.push([]);
          area.push(rng.int(params.areas));
          continue;
        }
        const main = rng.pick(byLevel[l - 1]);
        const ps = new Set([main]);
        const extra = rng.int(params.maxPrereqs);
        for (let e = 0; e < extra; e++) {
          const from = rng.chance(params.skipProb) && l > 2 ? 1 + rng.int(l - 2) : l - 1;
          ps.add(rng.pick(byLevel[from]));
        }
        prereqs.push([...ps].sort((a, b) => a - b));
        area.push(rng.chance(params.areaStickiness) ? area[main] : rng.int(params.areas));
      }
    }
    const p = level.map((l) => success.p0 * success.eta ** (l - 1));
    // Ancestor counts, to place targets where real composition is needed.
    const ancestorCount: number[] = [];
    const ancestors: Set<number>[] = [];
    for (let r = 0; r < level.length; r++) {
      const a = new Set<number>();
      for (const j of prereqs[r]) {
        a.add(j);
        for (const x of ancestors[j]) a.add(x);
      }
      ancestors.push(a);
      ancestorCount.push(a.size);
    }
    const bounty = new Array<number>(level.length).fill(0);
    for (const spec of params.targets) {
      const pool = [...byLevel[spec.level]].sort((a, b) => ancestorCount[b] - ancestorCount[a]);
      const top = rng.shuffle(pool.slice(0, Math.max(spec.count, Math.ceil(pool.length / 2))));
      top.slice(0, spec.count).forEach((t) => (bounty[t] = params.bountyBase * params.bountyGrowth ** (spec.level - 1)));
    }
    return finishWorld({ level, area, p, prereqs, bounty });
  };
}

worlds.register<LayeredParams>('layered', {
  description: 'A random DAG in levels; each result builds on 1 to maxPrereqs results below it',
  defaults: {
    levels: 8, width: 10, maxPrereqs: 3, skipProb: 0.25, areas: 3, areaStickiness: 0.8,
    targets: [{ level: 3, count: 2 }, { level: 5, count: 2 }, { level: 7, count: 2 }, { level: 8, count: 1 }],
    bountyBase: 4, bountyGrowth: 2,
  },
  create: layered,
});

worlds.register<{ length: number; bounty: number }>('chain', {
  description: 'A single chain of results, with a target (bounty) at the end; the simple model',
  defaults: { length: 300, bounty: 1 },
  create: ({ length, bounty }) => {
    const make = layered({
      levels: length, width: 1, maxPrereqs: 1, skipProb: 0, areas: 1, areaStickiness: 1,
      targets: [{ level: length, count: 1 }], bountyBase: bounty, bountyGrowth: 1,
    });
    return make;
  },
});

/** One result in a world given as a list (worlds `graph` and `file`). */
export interface NodeSpec {
  id: string;
  /** Ids of the results it builds on; they must appear earlier in the list. */
  prereqs?: string[];
  /** Success chance per attempt; if absent, taken from the success model by level. */
  p?: number;
  /** Area index, from 0. */
  area?: number;
  /** A bounty makes the result a target. */
  bounty?: number;
}

/** Builds a world from a list of results. Levels are derived from prerequisites. */
export function worldFromNodes(nodes: NodeSpec[], success: Scenario['success'], where: string): World {
  if (!Array.isArray(nodes) || nodes.length === 0) throw new Error(`${where}: needs a non-empty list of nodes`);
  const index = new Map<string, number>();
  nodes.forEach((nd, i) => {
    if (typeof nd.id !== 'string' || !nd.id) throw new Error(`${where}: node ${i} needs an "id"`);
    if (index.has(nd.id)) throw new Error(`${where}: duplicate id "${nd.id}"`);
    index.set(nd.id, i);
  });
  const prereqs = nodes.map((nd, i) => (nd.prereqs ?? []).map((id) => {
    const j = index.get(id);
    if (j === undefined) throw new Error(`${where}: ${nd.id} builds on unknown result "${id}"`);
    if (j >= i) throw new Error(`${where}: ${nd.id} builds on "${id}", which must be listed before it`);
    return j;
  }).sort((a, b) => a - b));
  const level: number[] = [];
  prereqs.forEach((ps) => level.push(1 + Math.max(0, ...ps.map((j) => level[j]))));
  for (const nd of nodes) {
    if (nd.p !== undefined && !(nd.p > 0 && nd.p <= 1)) throw new Error(`${where}: ${nd.id} has p = ${nd.p}; it must be in (0, 1]`);
    if (nd.bounty !== undefined && !(nd.bounty >= 0)) throw new Error(`${where}: ${nd.id} has a negative bounty`);
  }
  const world = finishWorld({
    level,
    area: nodes.map((nd) => nd.area ?? 0),
    p: nodes.map((nd, r) => nd.p ?? success.p0 * success.eta ** (level[r] - 1)),
    prereqs,
    bounty: nodes.map((nd) => nd.bounty ?? 0),
    names: nodes.map((nd) => nd.id),
  });
  if (!world.targets.length) throw new Error(`${where}: no result has a bounty, so there are no targets`);
  return world;
}

worlds.register<{ nodes: NodeSpec[]; areas: number }>('graph', {
  description: 'A DAG written in the scenario: nodes: [{ id, prereqs?, p?, area?, bounty? }], each after the results it builds on',
  defaults: { nodes: [], areas: 1 },
  create: ({ nodes }) => (success) => worldFromNodes(nodes, success, 'world "graph"'),
});

worlds.register<{ path: string; areas: number }>('file', {
  description: 'A DAG read from a JSON file: { nodes: [{ id, prereqs?, p?, area?, bounty? }] }, each after the results it builds on',
  defaults: { path: '', areas: 1 },
  create: ({ path }) => (success) => {
    if (!path) throw new Error('world "file" needs a path');
    const full = isAbsolute(path) ? path : join(ROOT, path);
    return worldFromNodes((JSON.parse(readFileSync(full, 'utf8')) as { nodes: NodeSpec[] }).nodes, success, `world file ${path}`);
  },
});

/** Ledger weights: true weights plus noise of spread sigma, renormalized. */
export function ledgerWeights(world: World, sigma: number, rng: Rng): number[][] {
  return world.weights.map((ws) => {
    if (sigma === 0 || ws.length < 2) return [...ws];
    const noisy = ws.map((w) => Math.max(1e-6, w + sigma * rng.normal()));
    const sum = noisy.reduce((a, b) => a + b, 0);
    return noisy.map((w) => w / sum);
  });
}

/**
 * share[x][r]: the fraction of value entering result x that reaches result r's author through the
 * waterfall. share[x][x] is what x's author keeps.
 */
export function shares(world: World, alpha: number, w: number[][]): Float64Array[] {
  const out: Float64Array[] = [];
  for (let x = 0; x < world.n; x++) {
    const row = new Float64Array(world.n);
    const ps = world.prereqs[x];
    row[x] = ps.length ? alpha : 1;
    ps.forEach((j, k) => {
      const f = (1 - alpha) * w[x][k];
      const rj = out[j];
      for (const a of world.ancestors[j]) row[a] += f * rj[a];
      row[j] += f * rj[j];
    });
    out.push(row);
  }
  return out;
}

/**
 * S_r: what authoring r can be expected to earn later from flow-back, assuming every target below it
 * is eventually solved and every descendant published.
 */
export function attributionValue(world: World, share: Float64Array[], w: number[][], c: number, m: number): number[] {
  const S = new Array<number>(world.n).fill(0);
  for (let d = 0; d < world.n; d++) {
    for (const r of world.ancestors[d]) {
      if (world.isTarget[d]) S[r] += world.bounty[d] * share[d][r];
      world.prereqs[d].forEach((j, k) => {
        if (j === r || world.ancestors[j].has(r)) S[r] += c * m * w[d][k] * share[j][r];
      });
    }
  }
  return S;
}

/* ----------------------------------------------------------------------------- The idea graph generator */

export interface IdeasParams extends Record<string, unknown> {
  /** Structure: levels, ideas per level, parents per idea on average, and the chance a parent comes from an
   *  older level instead of the level just below. */
  levels: number;
  width: number;
  parents: number;
  skip: number;
  /** Difficulty: the sequence length (bits) of a level-1 idea, and how many bits longer each level up is. */
  length: number;
  lengthGrowth: number;
  /** Attribution: the share of an idea's length made of pieces of its parents' sequences (0: none, 1: all
   *  it can). The rest are its own new bits. */
  composition: number;
  /** Bounties: how many ideas at the top level carry one, and its size: bountyBase · bountyGrowth^(level − 1). */
  targets: number;
  bountyBase: number;
  bountyGrowth: number;
  /** Ideas needing more unresolved bits than this are not attempted. */
  attemptLimit: number;
}

/**
 * A general idea graph (docs/equations.md, section 3). Every idea is a bit sequence: a share of it is made of
 * pieces of its parents' sequences, the rest is new. Structure, difficulty (length) and attribution
 * (composition) are set separately.
 */
export function ideasWorld(params: IdeasParams, rng: Rng): World {
  const { levels, width } = params;
  if (!(levels >= 1 && width >= 1)) throw new Error('ideas: levels and width must be at least 1');
  if (!(params.composition >= 0 && params.composition <= 1)) throw new Error('ideas: composition must be between 0 and 1');
  const level: number[] = [], prereqs: number[][] = [], bits: number[][] = [];
  const byLevel: number[][] = [];
  let nextBit = 0;
  for (let l = 1; l <= levels; l++) {
    byLevel[l] = [];
    const length = Math.max(1, Math.round(params.length + params.lengthGrowth * (l - 1)));
    for (let k = 0; k < width; k++) {
      const x = level.length;
      const ps = new Set<number>();
      if (l > 1) {
        const extra = Math.max(0, params.parents - 1);
        const count = Math.min(1 + Math.floor(extra) + (rng.chance(extra - Math.floor(extra)) ? 1 : 0), byLevel[l - 1].length + (l > 2 ? width : 0));
        for (let t = 0; t < count * 6 && ps.size < count; t++) {
          const from = rng.chance(params.skip) && l > 2 ? 1 + rng.int(l - 2) : l - 1;
          ps.add(byLevel[from][rng.int(byLevel[from].length)]);
        }
      }
      const parents = [...ps].sort((u, v) => u - v);
      // Inherited: composition × length bits, taken as one contiguous piece from each parent, in equal shares.
      const want = parents.length ? Math.min(length - 1, Math.round(params.composition * length)) : 0;
      const inherited = new Set<number>();
      parents.forEach((y, j) => {
        const seq = bits[y];
        const share = Math.round(want * (j + 1) / parents.length) - Math.round(want * j / parents.length);
        const take = Math.min(seq.length, Math.max(0, share));
        if (!take) return;
        const start = rng.int(seq.length - take + 1);
        for (const b of seq.slice(start, start + take)) inherited.add(b);
      });
      const own = Math.max(1, length - inherited.size);
      level.push(l); prereqs.push(parents);
      bits.push([...inherited, ...Array.from({ length: own }, () => nextBit++)]);
      byLevel[l].push(x);
    }
  }
  // Chance per attempt once every parent is known: only the idea's own new bits are left.
  const p = bits.map((b, x) => {
    const fromParents = new Set(prereqs[x].flatMap((y) => bits[y]));
    return 2 ** -b.filter((bit) => !fromParents.has(bit)).length;
  });
  const bounty = new Array<number>(level.length).fill(0);
  const top = byLevel[levels], nT = Math.min(params.targets, top.length);
  for (let k = 0; k < nT; k++) bounty[top[Math.floor((k + 0.5) * top.length / nT)]] = params.bountyBase * params.bountyGrowth ** (levels - 1);
  return finishWorld({ level, area: level.map(() => 0), p, prereqs, bounty, bits, attemptLimit: params.attemptLimit });
}

worlds.register<IdeasParams>('ideas', {
  description: 'A general idea graph: ideas are bit sequences, part pieces of their parents\' sequences (composition), part new; set structure (levels, width, parents, skip), difficulty (length, lengthGrowth) and attribution (composition) separately',
  defaults: { levels: 6, width: 8, parents: 2, skip: 0.2, length: 3, lengthGrowth: 2, composition: 0.7, targets: 2, bountyBase: 4, bountyGrowth: 2, attemptLimit: 24 },
  create: (params) => (_success, rng) => ideasWorld(params, rng),
});
