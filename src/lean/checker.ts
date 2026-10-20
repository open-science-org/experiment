// The success oracle of the Lean experiment: Lean's checker (specification, section 6.2).
// An attempt is the proof of one statement. The harness writes a file that imports only the public
// definitions, states the agent's library as axioms (each one is a theorem the reference proofs prove,
// so this is sound), and then the statement with the agent's proof. `#print axioms` then lists exactly
// which library theorems the proof used: that is both the soundness check and the attribution.
import { execFile } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { asAxiom, LEAN_DIR, type Task } from './tasks.ts';

/** Lean's own axioms, which any proof may use. */
export const STANDARD_AXIOMS = ['propext', 'Classical.choice', 'Quot.sound'];

export interface CheckOptions {
  /** Library theorems the agent may cite (stated as axioms). */
  library: Pick<Task, 'name' | 'ns' | 'short' | 'signature'>[];
  /** Allow `grind` (a decision of the experiment; banned by default). */
  allowGrind?: boolean;
  timeoutMs?: number;
}

export interface CheckResult {
  ok: boolean;
  /** What went wrong, in the words sent back to the agent. */
  errors: string[];
  /** Library theorems the proof uses. */
  uses: string[];
  seconds: number;
}

/**
 * Text the proof must not contain. Banned for soundness (sorry, admit, native_decide), for safety
 * (commands that run code while checking, new declarations or options), for speed (search tactics),
 * and, unless allowed, `grind`.
 */
export function banned(proof: string, allowGrind = false): string[] {
  const rules: [RegExp, string][] = [
    [/\bsorry\b|\badmit\b/, '`sorry` and `admit` are not allowed'],
    [/\bnative_decide\b|\+native\b|ofReduceBool/, '`native_decide` is not allowed'],
    [/(^|\n)\s*#|\brun_(cmd|tac|elab|meta)\b|\bby_elab\b/, 'commands (`#…`, `run_cmd`, …) are not allowed'],
    [/(^|\n)\s*(theorem|lemma|def|abbrev|instance|example|axiom|opaque|structure|inductive|class|namespace|section|end|import|set_option|attribute|macro|macro_rules|syntax|elab|notation|infix|infixl|infixr|prefix|postfix|mutual|noncomputable|private|protected|@\[)\b/, 'the proof must not start new declarations, sections or options'],
    [/\bset_option\b|\bimplemented_by\b|\bextern\b|\bunsafe\b|\bIO\b/, 'options, `unsafe`, `extern` and `IO` are not allowed'],
    [/\b(exact|apply|rw|simp|simp_all|show_term|hint)\?/, 'search tactics (`exact?`, `apply?`, …) are not allowed'],
  ];
  if (!allowGrind) rules.push([/\bgrind\b/, '`grind` is not allowed in this experiment']);
  const proofStart = proof.trimStart();
  const out = rules.filter(([re]) => re.test(proof)).map(([, msg]) => msg);
  if (!proofStart.startsWith(':=') && !proofStart.startsWith('|')) out.push('the proof must start with `:=` or with `|` match arms');
  return out;
}

/** The checked file: definitions, the library as axioms, the attempt, and the axioms it uses. */
export function checkFile(task: Pick<Task, 'ns' | 'signature'>, proof: string, library: CheckOptions['library']): { text: string; firstProofLine: number } {
  const head = [
    'import Problems.Defs',
    'set_option autoImplicit false',
    '',
    '-- The agent\'s library: theorems proved earlier, stated as axioms.',
    ...library.map(asAxiom),
    '',
    `namespace ${task.ns}`,
    task.ns === 'OSO' ? 'open M2' : '',
    `theorem attempt ${task.signature}`,
  ];
  const tail = ['', `end ${task.ns}`, `#print axioms ${task.ns}.attempt`, ''];
  const before = head.join('\n');
  return { text: [before, proof, ...tail].join('\n'), firstProofLine: before.split('\n').length + 1 };
}

/** Parses `#print axioms` output: the axioms the attempt depends on, or null if it was not printed. */
export function parseAxioms(output: string): string[] | null {
  if (/'[^']*attempt' does not depend on any axioms/.test(output)) return [];
  const m = /'[^']*attempt' depends on axioms: \[([^\]]*)\]/.exec(output);
  return m ? m[1].split(',').map((s) => s.trim()).filter(Boolean) : null;
}

/** Lean's error messages, with line numbers relative to the agent's proof. */
export function parseErrors(output: string, firstProofLine: number, proofLines: number): string[] {
  const errors: string[] = [];
  // Lean 4.35 may tag an error with a code: `error(lean.unknownIdentifier): …`.
  const re = /^[^\n:]*\.lean:(\d+):(\d+): error(?:\([^)]*\))?: ([\s\S]*?)(?=^[^\n:]*\.lean:\d+:\d+: |^'[^'\n]*' (?:depends|does not depend)|(?![\s\S]))/gm;
  for (const m of output.matchAll(re)) {
    const line = Number(m[1]) - firstProofLine + 1;
    const where = line >= 1 && line <= proofLines ? `line ${line} of your proof, column ${m[2]}` : 'in the statement';
    errors.push(`${where}: ${m[3].trim()}`);
  }
  return errors;
}

let counter = 0;

/** Checks one proof with Lean. */
export function check(task: Pick<Task, 'ns' | 'signature'>, proof: string, opts: CheckOptions): Promise<CheckResult> {
  const t0 = Date.now();
  const bad = banned(proof, opts.allowGrind);
  if (bad.length) return Promise.resolve({ ok: false, errors: bad, uses: [], seconds: 0 });
  const { text, firstProofLine } = checkFile(task, proof, opts.library);
  const dir = join(LEAN_DIR, '.pilot');
  mkdirSync(dir, { recursive: true });
  const file = join(dir, `check-${process.pid}-${++counter}.lean`);
  writeFileSync(file, text);
  const env = { ...process.env, PATH: `${join(homedir(), '.elan', 'bin')}:${process.env.PATH}` };
  return new Promise((resolve) => {
    execFile('lake', ['env', 'lean', file], { cwd: LEAN_DIR, env, timeout: opts.timeoutMs ?? 120_000, maxBuffer: 8 << 20 }, (err, stdout, stderr) => {
      rmSync(file, { force: true });
      const output = `${stdout}\n${stderr}`;
      const seconds = (Date.now() - t0) / 1000;
      if (err && (err as NodeJS.ErrnoException & { killed?: boolean }).killed) {
        return resolve({ ok: false, errors: ['Lean timed out checking the proof'], uses: [], seconds });
      }
      const errors = parseErrors(output, firstProofLine, proof.split('\n').length);
      const axioms = parseAxioms(output);
      const libraryNames = new Set(opts.library.map((l) => l.name));
      const uses = (axioms ?? []).filter((a) => libraryNames.has(a));
      const other = (axioms ?? []).filter((a) => !libraryNames.has(a) && !STANDARD_AXIOMS.includes(a));
      if (other.length && !errors.length) errors.push(`Lean reported a problem it did not describe (the proof depends on ${other.join(', ')}); full output:\n${output.trim().slice(0, 3000)}`);
      else if (other.length && !other.every((a) => a === 'sorryAx')) errors.push(`the proof depends on ${other.filter((a) => a !== 'sorryAx').join(', ')}, which is not allowed`);
      if (!errors.length && axioms === null) errors.push('Lean did not accept the proof');
      resolve({ ok: errors.length === 0, errors, uses, seconds });
    });
  });
}
