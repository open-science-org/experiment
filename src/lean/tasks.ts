// The Lean problem set as tasks for the pilot: every reference theorem, its statement, the theorems
// it rests on, and an anonymous public id. Reads the private reference proofs in lean/, which are
// never shown to agents and never committed (lean/README.md).
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
  /** The reference proof, starting at `:=` or the first `|` (private; used only to test the harness). */
  reference: string;
  depth: number;
  area: 'A' | 'B' | 'C' | 'cross';
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
export const FREE = ['OSO.u_succ_succ'];

const FILES: [string, Task['area']][] = [['A', 'A'], ['B', 'B'], ['C', 'C'], ['Cross', 'cross']];

export function leanAvailable(): boolean {
  return existsSync(join(LEAN_DIR, 'Reference', 'A.lean')) && existsSync(join(LEAN_DIR, 'reference-dag.md'));
}

/** Theorem statements and proofs from the reference sources. */
export function parseReference(): Map<string, { ns: string; short: string; signature: string; reference: string }> {
  const out = new Map<string, { ns: string; short: string; signature: string; reference: string }>();
  for (const [file] of FILES) {
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
export function loadTasks(): Task[] {
  const src = parseReference();
  const rows: { depth: number; name: string; area: Task['area']; posted: string; uses: string[] }[] = [];
  for (const line of readFileSync(join(LEAN_DIR, 'reference-dag.md'), 'utf8').split('\n')) {
    if (!/^\| \d/.test(line)) continue;
    const [depth, name, area, posted, uses] = line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
    const q = (n: string) => `OSO.${n.replace(/`/g, '')}`;
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
  const letter = { A: 'A', B: 'B', C: 'C', cross: 'X' } as const;
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
  return `namespace ${t.ns}\n${t.ns === 'OSO' ? 'open M2 in\n' : ''}axiom ${t.short} ${t.signature}\nend ${t.ns}`;
}

export function definitions(): string {
  return readFileSync(join(LEAN_DIR, 'Problems', 'Defs.lean'), 'utf8');
}
