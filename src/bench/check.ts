// Phase 0 checker: a benchmark statement, unchanged, with the agent's tactics after `:= by`, checked by
// Lean against Mathlib; the theorem may use only Lean's standard axioms (no `sorryAx`), read by a separate program.
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compileAndRead, STANDARD_AXIOMS } from '../lean/checker.ts';

export const BENCH_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'bench');

export interface Statement { id: string; header: string; statement: string }
export interface BenchCheck { ok: boolean; errors: string[]; seconds: number }

export const theoremName = (p: Statement) => /^theorem\s+([^\s(:{[]+)/.exec(p.statement)![1];

/**
 * The tactics in a reply's last ```lean block. A reply may repeat the whole theorem: then only what
 * follows its `:= by` counts, so the statement itself can never be changed.
 */
export function extractTactics(text: string, p: Statement): string | null {
  const blocks = [...text.matchAll(/```(?:lean4?|)\s*\n([\s\S]*?)```/g)].map((m) => m[1].replace(/\s+$/, ''));
  if (!blocks.length) return null;
  const block = blocks[blocks.length - 1];
  const name = theoremName(p).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // `example` is the same statement without a name; only the tactics are used either way.
  const head = new RegExp(`(^|\\n)\\s*((theorem|lemma)\\s+${name}\\b|example\\b)[\\s\\S]*?:=\\s*by\\b`).exec(block);
  if (head) return block.slice(head.index + head[0].length).replace(/^[ \t]*\n/, '');
  if (/(^|\n)\s*(theorem|lemma|example)\s/.test(block)) return null; // a different theorem: not an answer to this one
  return block.replace(/^\s*by\b/, '');
}

/** Text the tactics must not contain: unsound shortcuts, and commands or declarations outside the proof. */
export function bannedTactics(tactics: string): string[] {
  const rules: [RegExp, string][] = [
    [/\bsorry\b|\badmit\b/, '`sorry` and `admit` are not allowed'],
    [/\bnative_decide\b|\+native\b|ofReduceBool|\bimplemented_by\b|\bextern\b|\bunsafe\b/, '`native_decide`, `unsafe` and similar are not allowed'],
    [/(^|\n)\s*#|#(print|eval|reduce|exit|check|guard)\b|\brun_(cmd|tac|elab|meta)\b|\bby_elab\b/, 'commands (`#…`, `run_cmd`, …) are not allowed'],
    // Anywhere, not only at a line start: Lean starts a new command mid-line too.
    [/\b(macro_rules|macro|syntax|elab_rules|elab|declare_syntax_cat|notation|infixl?|infixr|prefix|postfix|binder_predicate|initialize|builtin_initialize|simproc|dsimproc)\b/, 'new syntax and macros are not allowed in a proof'],
    [/(^|\n|;)\s*(theorem|lemma|def|abbrev|instance|example|axiom|opaque|structure|inductive|class|namespace|section|end|import|attribute|universe|variable|mutual|noncomputable|private|protected|local|scoped|@\[)\b/, 'the proof must not start new declarations'],
  ];
  return rules.filter(([re]) => re.test(tactics)).map(([, msg]) => msg);
}

/**
 * The proof, moved as one block to two spaces in, so lines keep their depth relative to each other.
 * Replies differ: some indent the tactics already, some start them at the margin.
 */
export function indentProof(tactics: string): string {
  const lines = tactics.replace(/\t/g, '  ').split('\n');
  const depth = Math.min(...lines.filter((l) => l.trim()).map((l) => /^ */.exec(l)![0].length));
  return lines.map((l) => (l.trim() ? `  ${l.slice(Number.isFinite(depth) ? depth : 0)}` : '')).join('\n');
}

/**
 * Checks `tactics` as the proof of `p`, in two steps (see `compileAndRead`): Lean compiles the file, whose
 * errors go back to the agent; then a separate program reads the theorem's axioms from the compiled module.
 * With `allowSorry`, only that the statement compiles.
 */
export async function compile(p: Statement, tactics: string, { allowSorry = false, timeoutMs = 180_000, screen = true } = {}): Promise<BenchCheck> {
  const t0 = Date.now();
  // `screen: false` skips the text screen, so the stress test can show the axioms check holds on its own.
  const bad = allowSorry || !screen ? [] : bannedTactics(tactics);
  if (bad.length) return { ok: false, errors: bad, seconds: 0 };
  const before = `${p.header}\n\n${p.statement}\n`;
  const first = before.split('\n').length;
  const c = await compileAndRead(BENCH_DIR, join(BENCH_DIR, '.check'), `${before}${indentProof(tactics)}\n`, theoremName(p), timeoutMs);
  const seconds = (Date.now() - t0) / 1000;
  if (c.timedOut) return { ok: false, errors: ['Lean timed out checking the proof'], seconds };
  const errors: string[] = [];
  const re = /^[^\n:]*\.lean:(\d+):(\d+): error(?:\([^)]*\))?: ([\s\S]*?)(?=^[^\n:]*\.lean:\d+:\d+: |(?![\s\S]))/gm;
  for (const m of c.out.matchAll(re)) {
    const line = Number(m[1]) - first + 1;
    errors.push(`${line >= 1 ? `line ${line} of your proof, column ${m[2]}` : 'in the statement'}: ${m[3].trim()}`);
  }
  // A tactic run on every case (`<;>`) reports the same error once per case: say it once, with the count,
  // so the repair message shows each problem instead of one problem many times.
  const seen = new Map<string, number>();
  for (const e of errors.splice(0)) seen.set(e, (seen.get(e) ?? 0) + 1);
  for (const [e, n] of seen) errors.push(n > 1 ? `${e} (reported ${n} times, once per case)` : e);
  if (errors.length) return { ok: false, errors, seconds };
  if (c.axioms === null) return { ok: false, errors: [`Lean did not accept the proof:\n${c.out.trim().slice(0, 2000)}`], seconds };
  if (c.axioms === 'missing') return { ok: false, errors: [`\`${theoremName(p)}\` is not a proved theorem after your proof`], seconds };
  const other = c.axioms.filter((x) => !STANDARD_AXIOMS.includes(x) && !(allowSorry && x === 'sorryAx'));
  if (other.includes('sorryAx')) errors.push('the proof is incomplete (Lean reports `sorry`)');
  else if (other.length) errors.push(`the proof depends on ${other.join(', ')}, which is not allowed`);
  return { ok: errors.length === 0, errors, seconds };
}
