// Phase 0 checker: a benchmark statement, unchanged, with the agent's tactics after `:= by`, checked by
// Lean against Mathlib. `#print axioms` must list only Lean's standard axioms (no `sorryAx`).
import { execFile } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { STANDARD_AXIOMS } from '../lean/checker.ts';

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
  const head = new RegExp(`(^|\\n)\\s*(theorem|lemma)\\s+${name}\\b[\\s\\S]*?:=\\s*by\\b`).exec(block);
  if (head) return block.slice(head.index + head[0].length).replace(/^[ \t]*\n/, '');
  if (/(^|\n)\s*(theorem|lemma)\s/.test(block)) return null; // a different theorem: not an answer to this one
  return block.replace(/^\s*by\b/, '');
}

/** Text the tactics must not contain: unsound shortcuts, and commands or declarations outside the proof. */
export function bannedTactics(tactics: string): string[] {
  const rules: [RegExp, string][] = [
    [/\bsorry\b|\badmit\b/, '`sorry` and `admit` are not allowed'],
    [/\bnative_decide\b|\+native\b|ofReduceBool|\bimplemented_by\b|\bextern\b|\bunsafe\b/, '`native_decide`, `unsafe` and similar are not allowed'],
    [/(^|\n)\s*#|\brun_(cmd|tac|elab|meta)\b|\bby_elab\b/, 'commands (`#…`, `run_cmd`, …) are not allowed'],
    [/(^|\n)(theorem|lemma|def|abbrev|instance|example|axiom|opaque|structure|inductive|class|namespace|section|end|import|attribute|macro|syntax|elab|notation|mutual|noncomputable|private|protected|@\[)\b/, 'the proof must not start new declarations'],
  ];
  return rules.filter(([re]) => re.test(tactics)).map(([, msg]) => msg);
}

let counter = 0;

/** Checks `tactics` as the proof of `p`. With `allowSorry`, only that the statement compiles. */
export function compile(p: Statement, tactics: string, { allowSorry = false, timeoutMs = 180_000 } = {}): Promise<BenchCheck> {
  const t0 = Date.now();
  const bad = allowSorry ? [] : bannedTactics(tactics);
  if (bad.length) return Promise.resolve({ ok: false, errors: bad, seconds: 0 });
  const body = tactics.split('\n').map((l) => (/^\S/.test(l) ? `  ${l}` : l)).join('\n');
  const before = `${p.header}\n\n${p.statement}\n`;
  const first = before.split('\n').length;
  const text = `${before}${body}\n\n#print axioms ${theoremName(p)}\n`;
  const dir = join(BENCH_DIR, '.check');
  mkdirSync(dir, { recursive: true });
  const file = join(dir, `check-${process.pid}-${++counter}.lean`);
  writeFileSync(file, text);
  const env = { ...process.env, PATH: `${join(homedir(), '.elan', 'bin')}:${process.env.PATH}` };
  return new Promise((resolve) => {
    execFile('lake', ['env', 'lean', file], { cwd: BENCH_DIR, env, timeout: timeoutMs, maxBuffer: 8 << 20 }, (err, stdout, stderr) => {
      rmSync(file, { force: true });
      const seconds = (Date.now() - t0) / 1000;
      if (err && (err as { killed?: boolean }).killed) return resolve({ ok: false, errors: ['Lean timed out checking the proof'], seconds });
      const output = `${stdout}\n${stderr}`;
      const errors: string[] = [];
      const re = /^[^\n:]*\.lean:(\d+):(\d+): error(?:\([^)]*\))?: ([\s\S]*?)(?=^[^\n:]*\.lean:\d+:\d+: |^'[^'\n]*' (?:depends|does not depend)|(?![\s\S]))/gm;
      for (const m of output.matchAll(re)) {
        const line = Number(m[1]) - first + 1;
        errors.push(`${line >= 1 ? `line ${line} of your proof, column ${m[2]}` : 'in the statement'}: ${m[3].trim()}`);
      }
      const ax = /depends on axioms: \[([^\]]*)\]/.exec(output);
      const axioms = /does not depend on any axioms/.test(output) ? [] : ax ? ax[1].split(',').map((s) => s.trim()) : null;
      const other = (axioms ?? []).filter((a) => !STANDARD_AXIOMS.includes(a) && !(allowSorry && a === 'sorryAx'));
      if (!errors.length && other.includes('sorryAx')) errors.push('the proof is incomplete (Lean reports `sorry`)');
      else if (!errors.length && other.length) errors.push(`the proof depends on ${other.join(', ')}, which is not allowed`);
      if (!errors.length && axioms === null) errors.push(`Lean did not accept the proof:\n${output.trim().slice(0, 2000)}`);
      resolve({ ok: errors.length === 0, errors, seconds });
    });
  });
}
