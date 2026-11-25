// The Lean problem set as tasks for the pilot: every reference theorem, its statement, the theorems
// it rests on, and an anonymous public id. Reads the reference proofs in lean/, which are
// never shown to agents (lean/README.md).
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../paths.ts';

export const LEAN_DIR = join(ROOT, 'lean');

export interface Task {
  /** Fully qualified Lean name, e.g. `OSO.M2.det_mul`. */
  name: string;
  /** Name inside its namespace, e.g. `det_mul`. */
  short: string;
  /** The namespace the theorem is stated in (`OSO` or `OSO.M2`). */
  ns: string;
  /** Binders and type, as written after the name: `(x y : M2) : det (mul x y) = …`. */
  signature: string;
  /** The reference proof, starting at `:=` or the first `|` (used only to test the harness). */
  reference: string;
  depth: number;
  area: 'A' | 'B' | 'C' | 'D' | 'P' | 'cross';
  /** Posted target id (A3, …), or '' for a hidden lemma. */
  posted: string;
  /** Anonymous public id, the same as in worlds/lean-reference.json (posted targets keep their id). */
  publicId: string;
  /** Reference theorems its proof uses directly. */
  uses: string[];
  /** Every reference theorem it rests on. */
  ancestors: string[];
}

/** Definitional lemmas (proved by rfl): free for everyone, as part of the definitions. */
export const FREE = ['OSO.u_succ_succ', 'OSO.L_succ_succ', // L_succ_succ: bigger set only (used where the set has it)
  // The deep set's definitional lemmas.
  ...['zero_eq', 'one_eq', 'add_zero', 'add_succ', 'mul_zero', 'mul_succ', 'pow_zero', 'pow_succ', 'succ_eq_add_one', 'le_iff', 'lt_iff', 'dvd_iff', 'sum_zero', 'sum_succ', 'choose_zero_succ', 'choose_succ_succ'].map((n) => `OSO.${n}`)];

// The harder targets are a separate set, so that the runs made on the main set keep their meaning.
// The bigger set (2026-11-20) keeps the main set's 8 targets and adds areas D (search trees) and E (counting).
// The deep set (2026-11-23) stands alone: its own numbers, from zero to Fermat's little theorem, one posted target.
export type Problems = 'main' | 'hard' | 'big' | 'deep';
/** The problem set when none is given: OSO_PROBLEMS (the CLI sets it from --problems), else main. */
export const defaultProblems = (): Problems => (['hard', 'big', 'deep'].includes(process.env.OSO_PROBLEMS ?? '') ? process.env.OSO_PROBLEMS as Problems : 'main');
/** The namespace opened inside `OSO` for statements: the matrices, or the deep set's numbers. */
export const opened = (problems: Problems = defaultProblems()) => (problems === 'deep' ? 'N' : 'M2');
export const filesOf = (problems: Problems): [string, Task['area']][] => problems === 'deep' ? [['Deep', 'P']] : [['A', 'A'], ['B', 'B'], ['C', 'C'], ['Cross', 'cross'],
  ...(problems === 'hard' ? [['Hard', 'cross'] as [string, Task['area']]] : []),
  ...(problems === 'big' ? [['BigA', 'A'], ['BigAC', 'cross'], ['BigDE', 'D']] as [string, Task['area']][] : [])];

/** Lean is on this machine and the checker is built: what the tests that run Lean need. */
export function leanReady(): boolean {
  return leanAvailable() && existsSync(join(LEAN_DIR, '.lake', 'build', 'bin', 'axcheck'));
}

export function leanAvailable(): boolean {
  return existsSync(join(LEAN_DIR, 'Reference', 'A.lean')) && existsSync(join(LEAN_DIR, 'reference-dag.md'));
}

/** Theorem statements and proofs from the reference sources. */
export function parseReference(problems: Problems = defaultProblems()): Map<string, { ns: string; short: string; signature: string; reference: string }> {
  const out = new Map<string, { ns: string; short: string; signature: string; reference: string }>();
  for (const [file] of filesOf(problems)) {
    const lines = readFileSync(join(LEAN_DIR, 'Reference', `${file}.lean`), 'utf8').split('\n');
    let ns = '';
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const nsm = /^namespace (\S+)/.exec(line);
      if (nsm) ns = nsm[1];
      const m = /^theorem (\S+)(.*)$/.exec(line);
      if (!m) continue;
      // The declaration runs until the next line that starts in column 0 (or a docstring).
      let j = i + 1;
      while (j < lines.length && !/^\S/.test(lines[j])) j++;
      const decl = [m[2], ...lines.slice(i + 1, j)].join('\n').replace(/\s+$/, '');
      // Split the signature from the proof: at the first top-level `:=`, or at the first `|` line.
      const assign = decl.indexOf(':=');
      const alt = decl.search(/\n\s*\|/);
      const cut = alt >= 0 && (assign < 0 || alt < assign) ? alt + 1 : assign;
      out.set(`${ns}.${m[1]}`, { ns, short: m[1], signature: decl.slice(0, cut).trim(), reference: decl.slice(cut).replace(/^\n/, '') });
    }
  }
  return out;
}

/** All tasks, in depth order, with dependencies from reference-dag.md. */
export function loadTasks(problems: Problems = defaultProblems()): Task[] {
  const src = parseReference(problems);
  const rows: { depth: number; name: string; area: Task['area']; posted: string; uses: string[] }[] = [];
  for (const line of (problems === 'big' ? ['reference-dag-big.md'] : problems === 'deep' ? ['reference-dag-deep.md'] : ['reference-dag.md', ...(problems === 'hard' ? ['reference-dag-hard.md'] : [])]).flatMap((f) => readFileSync(join(LEAN_DIR, f), 'utf8').split('\n'))) {
    if (!/^\| \d/.test(line)) continue;
    const [depth, name, area, posted, uses] = line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
    const q = (n: string) => `OSO.${n.replace(/`/g, '')}`;
    const known = rows.find((r) => r.name === q(name));
    if (known) { known.posted = posted; continue; } // a harder target that is an existing lemma
    rows.push({
      depth: Number(depth), name: q(name), area: area as Task['area'], posted,
      uses: uses === '—' ? [] : uses.split(',').map((u) => q(u.trim())),
    });
  }
  // Anonymous ids, as worlds/from-reference-dag.py makes them; B3 is posted on two theorems and
  // keeps its id on the deeper one.
  const postedRows = new Map<string, typeof rows>();
  for (const r of rows) if (r.posted) postedRows.set(r.posted, [...(postedRows.get(r.posted) ?? []), r]);
  for (const group of postedRows.values()) group.sort((a, b) => a.depth - b.depth).slice(0, -1).forEach((r) => { r.posted = ''; });
  const sorted = [...rows].sort((a, b) => a.depth - b.depth || a.area.localeCompare(b.area) || a.name.slice(4).localeCompare(b.name.slice(4)));
  const letter = { A: 'A', B: 'B', C: 'C', D: 'D', P: 'P', cross: 'X' } as const;
  const counts: Record<string, number> = {};
  const ids = new Map<string, string>();
  for (const r of sorted) {
    if (r.posted) ids.set(r.name, r.posted);
    else ids.set(r.name, `${letter[r.area]}-${String((counts[r.area] = (counts[r.area] ?? 0) + 1)).padStart(2, '0')}`);
  }
  const byName = new Map(rows.map((r) => [r.name, r]));
  const ancestors = (n: string, seen = new Set<string>()): Set<string> => {
    for (const u of byName.get(n)?.uses ?? []) if (!seen.has(u)) { seen.add(u); ancestors(u, seen); }
    return seen;
  };
  return sorted.map((r) => {
    const s = src.get(r.name);
    if (!s) throw new Error(`reference-dag.md lists ${r.name}, which is not in the reference sources`);
    return { name: r.name, ...s, depth: r.depth, area: r.area, posted: r.posted, publicId: ids.get(r.name)!, uses: r.uses, ancestors: [...ancestors(r.name)].sort() };
  });
}

/** The statement of a theorem as an axiom, for a task's library. */
export function asAxiom(t: { ns: string; short: string; signature: string }): string {
  return `namespace ${t.ns}\n${t.ns === 'OSO' ? `open ${opened()} in\n` : ''}axiom ${t.short} ${t.signature}\nend ${t.ns}`;
}

/** The posted targets and the three areas in plain words, for people reading the experiment (not shown to the labs). */
export const PLAIN: Record<string, string> = {
  C3: 'The determinant of a product of two 2×2 matrices is the product of their determinants.',
  A3: 'A term of the sequence divides every term whose position is a multiple of its own: u(m) divides u(m·k).',
  C4: 'Matrix powers multiply out: x to the power m·n equals (x to the power m) to the power n.',
  X1: "Cassini's identity for the sequence: u(n+1)² − u(n+2)·u(n) = (−3)ⁿ. Links the sequence to matrix powers.",
  B3: "Insertion sort's output is sorted.",
  B5: 'Merge sort and insertion sort give exactly the same list, for any list of numbers.',
  X2: 'Sorting the first n terms of the sequence changes nothing: the sequence is already in increasing order.',
  A5: 'The greatest common divisor of two terms is the term at the gcd of their positions: gcd(u(m), u(n)) = u(gcd(m, n)).',
  H4: 'Merging two merge-sorted lists gives the merge sort of the two lists joined together.',
  H5: 'Merge sort leaves a list unchanged exactly when the list is already sorted.',
  P1: "Fermat's little theorem, from scratch: for every prime p and every number a, a to the power p leaves the same remainder as a when divided by p.",
  H6: 'A doubling formula: u(2n) is u(n) times the trace of the n-th power of the sequence\'s matrix.',
};
export const AREAS: Record<string, string> = {
  A: 'A number sequence: u(0) = 0, u(1) = 1, u(n+2) = 5·u(n+1) + 3·u(n), so 0, 1, 5, 28, 155, …',
  B: 'Sorting: insertion sort and merge sort on lists of numbers.',
  C: '2×2 integer matrices: product, determinant, powers.',
  D: 'Search trees and counting (bigger set): insertion into a search tree, tree sort, lists with the same counts, sums.',
  P: 'Numbers from scratch (deep set): addition, multiplication, order, divisibility, primes, binomial coefficients and congruences, built from zero and successor.',
  cross: 'Mixes two areas.',
};

/** The definitions agents see: the main set's, and for the bigger set its additions too. */
export function definitions(problems: Problems = defaultProblems()): string {
  const main = readFileSync(join(LEAN_DIR, 'Problems', 'Defs.lean'), 'utf8');
  const free = (names: string) => `\n-- Free to cite (true by \`rfl\`): ${names}.\n`;
  if (problems === 'deep') {
    const ref = parseReference('deep');
    return readFileSync(join(LEAN_DIR, 'Problems', 'DeepDefs.lean'), 'utf8').trimEnd()
      + free(FREE.filter((n) => ref.has(n)).map((n) => `${n} ${ref.get(n)!.signature}`).join('; '));
  }
  if (problems !== 'big') return main.trimEnd() + free('OSO.u_succ_succ (n : Nat) : u (n + 2) = 5 * u (n + 1) + 3 * u n');
  return main.trimEnd() + '\n\n' + readFileSync(join(LEAN_DIR, 'Problems', 'BigDefs.lean'), 'utf8').replace(/^import .*\n/m, '').trimEnd()
    + free('OSO.u_succ_succ (n : Nat) : u (n + 2) = 5 * u (n + 1) + 3 * u n; OSO.L_succ_succ (p q n : Nat) : L p q (n + 2) = p * L p q (n + 1) + q * L p q n');
}

/** Names the definitions declare (last part, e.g. `insert` for `Tree.insert`): a lemma may not take one. */
export function definedNames(problems: Problems = defaultProblems()): string[] {
  return [...definitions(problems).matchAll(/^\s*(?:def|abbrev|inductive|structure|instance)\s+([\w.]+)/gm)].map((m) => m[1].split('.').pop()!);
}
