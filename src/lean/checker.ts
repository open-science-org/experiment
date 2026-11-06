// The success oracle of the Lean experiment: Lean's checker (specification, section 6.2).
// An attempt is the proof of one statement. The harness writes a file that imports only the public
// definitions, states the agent's library as axioms (each one is a theorem the reference proofs prove,
// so this is sound), and then the statement with the agent's proof. `#print axioms` then lists exactly
// which library theorems the proof used: that is both the soundness check and the attribution.
import { execFile, execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
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
    [/(^|\n)\s*#|#(print|eval|reduce|exit|check|guard)\b|\brun_(cmd|tac|elab|meta)\b|\bby_elab\b/, 'commands (`#…`, `run_cmd`, …) are not allowed'],
    // Anywhere, not only at a line start: Lean starts a new command mid-line too.
    [/\b(macro_rules|macro|syntax|elab_rules|elab|declare_syntax_cat|notation|infixl?|infixr|prefix|postfix|binder_predicate|initialize|builtin_initialize|simproc|dsimproc)\b/, 'new syntax and macros are not allowed in a proof'],
    [/(^|\n|;)\s*(theorem|lemma|def|abbrev|instance|example|axiom|opaque|structure|inductive|class|namespace|section|end|import|set_option|attribute|universe|variable|mutual|noncomputable|private|protected|local|scoped|@\[)\b/, 'the proof must not start new declarations, sections or options'],
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

/** Lean's search path for a project, found once per project (asking `lake env` each time costs seconds). */
const leanPaths = new Map<string, string>();
function leanEnv(projectDir: string, buildDir: string) {
  const PATH = `${join(homedir(), '.elan', 'bin')}:${process.env.PATH}`;
  if (!leanPaths.has(projectDir)) leanPaths.set(projectDir, execFileSync('lake', ['env', 'printenv', 'LEAN_PATH'], { cwd: projectDir, env: { ...process.env, PATH }, encoding: 'utf8' }).trim());
  return { ...process.env, PATH, LEAN_PATH: `${buildDir}:${leanPaths.get(projectDir)}` };
}
const run = (cmd: string, argv: string[], cwd: string, env: NodeJS.ProcessEnv, timeoutMs: number) => new Promise<{ out: string; timedOut: boolean }>((resolve) =>
  execFile(cmd, argv, { cwd, env, timeout: timeoutMs, maxBuffer: 8 << 20 }, (err, stdout, stderr) =>
    resolve({ out: `${stdout}\n${stderr}`, timedOut: !!(err as { killed?: boolean } | null)?.killed })));

export interface Compiled {
  /** Lean's messages from compiling the file. */
  out: string;
  timedOut: boolean;
  /**
   * The theorem's axioms, read by `axcheck` from the compiled module (null if the file did not compile,
   * 'missing' if there is no such theorem after it). `axcheck` is a separate program: nothing in the
   * agent's text runs there, so a macro that rewrites `#print axioms` in the file cannot fake this.
   */
  axioms: string[] | null | 'missing';
}

/** Compiles `text` as a module in `buildDir` of the Lean project `projectDir`, then reads `theorem`'s axioms. */
export async function compileAndRead(projectDir: string, buildDir: string, text: string, theorem: string, timeoutMs: number): Promise<Compiled> {
  const axcheck = join(projectDir, '.lake', 'build', 'bin', 'axcheck');
  if (!existsSync(axcheck)) throw new Error(`${axcheck} is missing: run \`lake build axcheck\` in ${projectDir}`);
  mkdirSync(buildDir, { recursive: true });
  const mod = `Cand_${process.pid}_${++counter}`;
  const file = join(buildDir, `${mod}.lean`), olean = join(buildDir, `${mod}.olean`);
  writeFileSync(file, text);
  const env = leanEnv(projectDir, buildDir), t0 = Date.now();
  try {
    const c = await run('lean', ['-o', olean, file], projectDir, env, timeoutMs);
    if (c.timedOut || !existsSync(olean)) return { ...c, axioms: null };
    const a = await run(axcheck, [mod, theorem], projectDir, env, Math.max(30_000, timeoutMs - (Date.now() - t0)));
    const line = /^(THEOREM.*|MISSING|NOT_A_THEOREM)$/m.exec(a.out)?.[1];
    if (a.timedOut || !line) return { out: `${c.out}\nthe axioms check did not finish: ${a.out.trim().slice(0, 300)}`, timedOut: a.timedOut, axioms: null };
    return { ...c, axioms: line.startsWith('THEOREM') ? line.split(/\s+/).slice(1).filter(Boolean) : 'missing' };
  } finally {
    for (const f of [file, olean, join(buildDir, `${mod}.ilean`)]) rmSync(f, { force: true });
  }
}

/** Checks one proof with Lean: the file compiles, then the attempt's axioms are read from the compiled module. */
export async function check(task: Pick<Task, 'ns' | 'signature'>, proof: string, opts: CheckOptions): Promise<CheckResult> {
  const t0 = Date.now();
  const bad = banned(proof, opts.allowGrind);
  if (bad.length) return { ok: false, errors: bad, uses: [], seconds: 0 };
  const { text, firstProofLine } = checkFile(task, proof, opts.library);
  const c = await compileAndRead(LEAN_DIR, join(LEAN_DIR, '.pilot'), text, `${task.ns}.attempt`, opts.timeoutMs ?? 120_000);
  const seconds = (Date.now() - t0) / 1000;
  if (c.timedOut) return { ok: false, errors: ['Lean timed out checking the proof'], uses: [], seconds };
  const errors = parseErrors(c.out, firstProofLine, proof.split('\n').length);
  const axioms = c.axioms === 'missing' ? null : c.axioms;
  if (c.axioms === 'missing' && !errors.length) errors.push('the attempt is not a proved theorem after your proof');
  const libraryNames = new Set(opts.library.map((l) => l.name));
  const uses = (axioms ?? []).filter((a) => libraryNames.has(a));
  const other = (axioms ?? []).filter((a) => !libraryNames.has(a) && !STANDARD_AXIOMS.includes(a));
  if (other.length && !errors.length) errors.push(other.includes('sorryAx') ? 'the proof is incomplete (Lean reports `sorry`)' : `the proof depends on ${other.join(', ')}, which is not allowed`);
  else if (other.length && !other.every((a) => a === 'sorryAx')) errors.push(`the proof depends on ${other.filter((a) => a !== 'sorryAx').join(', ')}, which is not allowed`);
  if (!errors.length && axioms === null) errors.push(`Lean did not accept the proof:\n${c.out.trim().slice(0, 2000)}`);
  return { ok: errors.length === 0, errors, uses, seconds };
}
