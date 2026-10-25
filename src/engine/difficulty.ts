// How knowing some ideas makes another easier (docs/equations.md, section 3).
//
// Worlds made by the `ideas` generator give every idea a set of bits, like a coin-toss sequence: its own
// new bits plus a share of each parent's bits. An attempt at x works with chance 2^-(unresolved bits),
// where every bit inside an idea the agent knows is resolved. Any idea can be attempted; parents make it
// cheaper. A parent's link weight is the bits it resolves inside the child (a bit that several parents
// share is split equally among them: the Shapley value).
//
// Worlds without bits (the topics written so far) keep the original rule: an idea can be attempted once
// all its parents are known, and then works with chance p; link weights ∝ 1/p.
import type { World } from './world.ts';

export interface KnowledgeView {
  world: World;
  known: Set<number>[];
  /** Bumped whenever an agent's knowledge changes, so the bits it has resolved can be cached. */
  knowVersion: Int32Array;
}

/** Ideas whose parents agent i all knows, and that it does not know yet. */
export function gatedFrontier(v: KnowledgeView, i: number): number[] {
  const out: number[] = [];
  const k = v.known[i];
  for (let r = 0; r < v.world.n; r++) if (!k.has(r) && v.world.prereqs[r].every((j) => k.has(j))) out.push(r);
  return out;
}

/** Link weights for a world with bits: each parent's share of the bits all parents resolve (Shapley). */
export function bitsWeights(prereqs: number[][], bits: number[][]): number[][] {
  return prereqs.map((ps, x) => {
    if (!ps.length) return [];
    const inX = new Set(bits[x]);
    const holders = new Map<number, number>();
    for (const y of ps) for (const b of bits[y]) if (inX.has(b)) holders.set(b, (holders.get(b) ?? 0) + 1);
    const phi = ps.map((y) => bits[y].reduce((a, b) => a + (inX.has(b) ? 1 / holders.get(b)! : 0), 0));
    const sum = phi.reduce((a, b) => a + b, 0);
    return sum > 0 ? phi.map((f) => f / sum) : ps.map(() => 1 / ps.length);
  });
}

const resolvedCache = new WeakMap<KnowledgeView, Map<number, { version: number; resolved: Set<number> }>>();

/** The bits agent i has resolved: every bit of every idea it knows. */
function resolvedBy(v: KnowledgeView, i: number): Set<number> {
  let perAgent = resolvedCache.get(v);
  if (!perAgent) resolvedCache.set(v, (perAgent = new Map()));
  const hit = perAgent.get(i);
  if (hit && hit.version === v.knowVersion[i]) return hit.resolved;
  const resolved = new Set<number>();
  for (const x of v.known[i]) for (const b of v.world.bits![x]) resolved.add(b);
  perAgent.set(i, { version: v.knowVersion[i], resolved });
  return resolved;
}

/** Bits of idea x that agent i has not resolved. */
export function unresolvedBits(v: KnowledgeView, i: number, x: number): number {
  const resolved = resolvedBy(v, i);
  let n = 0;
  for (const b of v.world.bits![x]) if (!resolved.has(b)) n++;
  return n;
}

/** The ideas agent i can attempt now. */
export function frontier(v: KnowledgeView, i: number): number[] {
  if (!v.world.bits) return gatedFrontier(v, i);
  const out: number[] = [];
  const k = v.known[i];
  for (let r = 0; r < v.world.n; r++) if (!k.has(r) && unresolvedBits(v, i, r) <= v.world.attemptLimit!) out.push(r);
  return out;
}

/**
 * Knowledge in a set of ideas, in bits. On a graph with bits: the distinct bits across the ideas, so a bit
 * shared with a parent counts once. Without bits (the Lean problem set): each idea counts log2(1/p).
 */
export function knowledgeOf(world: World, ideas: Iterable<number>): number {
  if (!world.bits) { let k = 0; for (const x of ideas) k += Math.log2(1 / world.p[x]); return k; }
  const seen = new Set<number>();
  for (const x of ideas) for (const b of world.bits[x]) seen.add(b);
  return seen.size;
}

/** Chance an attempt by agent i at idea x works, before the agent's skill. */
export function chanceOf(v: KnowledgeView, i: number, x: number): number {
  return v.world.bits ? 2 ** -unresolvedBits(v, i, x) : v.world.p[x];
}
