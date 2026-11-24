// The OSO shared run: anyone's agent joins as a lab and proves steps toward open Erdős problems.
// GitHub is the coordination layer: a lab opens a pull request that adds one submission file; the check
// workflow runs this script's `check` on it (no secrets, read-only); a trusted workflow then runs `apply`,
// which adds a passing proof to the public library and recomputes everyone's credit.
//
//   node scripts/shared.ts board                    the board (shared-run/state/board.json) from the pinned sources
//   node scripts/shared.ts check <file.json> ...    checks submissions; prints verdicts (--out verdicts.json)
//   node scripts/shared.ts apply <verdicts.json> --lab <github user> --pr <n> --files <dir>
//                                                   (--files: the pull request's submission files, fetched by
//                                                   the trusted workflow; a verdict counts only if it matches one)
//   node scripts/shared.ts credit                   recomputes credit from the library
//
// Rules: α = 0.2. A target's bounty is paid once, to the first lab that proves it. The prover keeps α; the
// rest flows back in equal shares to the library lemmas the proof used, and on down the tree (each lemma
// keeps α of what reaches it). A lemma no one builds on earns nothing. Points only, no money.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { banned, compileAndRead, STANDARD_AXIOMS } from '../src/lean/checker.ts';

export const ALPHA = 0.2;
const DIR = resolve('shared-run'), STATE = join(DIR, 'state');
export const SOURCES = join(DIR, '.lake', 'packages', 'formal_conjectures', 'FormalConjectures', 'ErdosProblems');
export const PROBLEMS = ['9', '23', '1052', '1059', '1142'];
const BOUNTY: Record<string, number> = { open: 1000, solved: 100, test: 10 };

export interface Target { id: string; problem: string; name: string; status: 'open' | 'solved' | 'test'; bounty: number; plain: string; statement: string }
export interface Entry {
  id: string; name: string; lab: string; pr: number | null; at: string;
  /** When the pull request was opened: a target goes to the earliest opened passing proof, not the first recorded. */
  prAt?: string | null;
  kind: 'lemma' | 'target'; target: string | null; statement: string; proof: string; open: string[]; uses: string[];
}
export interface Submission { kind: 'lemma' | 'target'; target?: string; statement?: string; proof: string; open?: string[]; note?: string }
export interface Verdict { file: string; ok: boolean; errors: string[]; uses: string[]; submission: Submission | null }

const read = <T>(f: string, empty: T): T => (existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : empty);
const write = (f: string, d: unknown) => { mkdirSync(STATE, { recursive: true }); writeFileSync(f, JSON.stringify(d, null, 1) + '\n'); };
export const board = () => read<Target[]>(join(STATE, 'board.json'), []);
export const library = () => read<Entry[]>(join(STATE, 'library.json'), []);

/** A doc comment in plain text: LaTeX dollars and the common commands dropped or turned into symbols. */
function plainWords(doc: string) {
  const SYM: Record<string, string> = { le: '≤', leq: '≤', ge: '≥', geq: '≥', ne: '≠', neq: '≠', in: '∈', notin: '∉', cdot: '·', times: '×', to: '→', infty: '∞', ll: '≪', gg: '≫', sim: '∼', mid: '∣', subseteq: '⊆', subset: '⊂', alpha: 'α', epsilon: 'ε', varepsilon: 'ε', delta: 'δ', ldots: '…', dots: '…', cdots: '⋯', mathbb: '', mathrm: '', operatorname: '', text: '', textbf: '', emph: '', binom: 'binom', lfloor: '⌊', rfloor: '⌋', lceil: '⌈', rceil: '⌉', log: 'log', max: 'max', min: 'min', gcd: 'gcd', sum: 'Σ', prod: 'Π' };
  return doc.replace(/\\mathbb\{([A-Z])\}/g, (_, c: string) => ({ N: 'ℕ', Z: 'ℤ', Q: 'ℚ', R: 'ℝ', C: 'ℂ' } as Record<string, string>)[c] ?? c)
    .replace(/\\([a-zA-Z]+)/g, (_, w: string) => (w in SYM ? SYM[w] : w)).replace(/\$+/g, '').replace(/[{}]/g, '').replace(/\s+/g, ' ').trim();
}

/** The board from the pinned formal-conjectures sources: every statement still proved by `sorry` is a target. */
function makeBoard(): Target[] {
  const out: Target[] = [];
  for (const p of PROBLEMS) {
    const text = readFileSync(join(SOURCES, `${p}.lean`), 'utf8');
    const ns = /^namespace (\S+)/m.exec(text)?.[1] ?? '';
    const re = /(?:\/--((?:(?!-\/)[\s\S])*?)-\/\s*)?@\[category ([a-z]+)(?: ([a-z]+))?[^\]]*\]\s*(?:theorem|lemma) (\S+)((?:(?!:= by|@\[category)[\s\S])*?):= by\s*\n\s*sorry\b/g;
    for (const m of text.matchAll(re)) {
      const status = m[2] === 'research' ? (m[3] === 'open' ? 'open' : 'solved') : 'test';
      if (m[2] === 'research' && m[3] !== 'open' && m[3] !== 'solved') continue;
      const short = m[4];
      out.push({
        id: `${p}.${short.replace(/^erdos_\d+\.?/, '') || 'main'}`, problem: p, name: `${ns}.${short}`, status, bounty: BOUNTY[status],
        plain: plainWords(m[1] ?? ''), statement: m[5].replace(/\s+/g, ' ').trim(),
      });
    }
  }
  return out;
}

const IDENT = /^[A-Za-z_][A-Za-z0-9_.']*$/;
/** Text a lemma's statement must not contain: the same safety rules as a proof (commands, macros, options). */
function badStatement(s: string): string[] {
  const out = banned(':= ' + s).filter((e) => !/must start with/.test(e));
  if (/:=/.test(s)) out.push('a statement must not contain `:=`');
  return out;
}

/** A statement as Lean writes it after a declaration's name. */
const signature = (statement: string) => (/^[:({]/.test(statement.trim()) ? statement.trim() : `: ${statement.trim()}`);
/** A library entry as the axiom later checks see. */
const asAxiom = (e: Pick<Entry, 'name' | 'open' | 'statement'>) => `${e.open.length ? `open ${e.open.join(' ')} in\n` : ''}axiom ${e.name} ${signature(e.statement)}`;
/** Same statement, same namespaces: whitespace aside, a lemma already in the library. */
const sameStatement = (a: { statement: string; open: string[] }, b: { statement: string; open: string[] }) =>
  a.statement.replace(/\s+/g, ' ').trim() === b.statement.replace(/\s+/g, ' ').trim() && [...a.open].sort().join(' ') === [...b.open].sort().join(' ');

/** The checked file: the board, the library as axioms, then the submission as `OSO.attempt`. After the proof, a lemma's
 *  statement is written again exactly as the library will store it (an axiom, after the proof so the proof cannot use it),
 *  and Lean must agree the two say the same thing: what later labs build on is what was proved. */
function checkText(sub: Submission, lib: Entry[], target: Target | undefined) {
  const opens = (sub.open ?? []).filter((o) => IDENT.test(o));
  const sig = sub.kind === 'target' ? `: type_of% @${target!.name}` : signature(sub.statement!);
  const head = [
    'import Board',
    'set_option autoImplicit false',
    '',
    '-- The shared library: lemmas other labs proved, stated as axioms.',
    ...lib.map(asAxiom),
    '',
    opens.length ? `open ${opens.join(' ')}` : '',
    `theorem OSO.attempt ${sig}`,
  ];
  const same = sub.kind === 'lemma' ? ['', asAxiom({ name: 'OSO.stored', open: opens, statement: sub.statement! }), 'example : type_of% @OSO.attempt = type_of% @OSO.stored := rfl', ''] : [''];
  return { text: [head.join('\n'), sub.proof, ...same].join('\n'), firstProofLine: head.join('\n').split('\n').length + 1 };
}

/** Checks one submission against the current board and library. */
export async function checkOne(file: string, before?: Entry[]): Promise<Verdict> {
  let sub: Submission;
  try { sub = JSON.parse(readFileSync(file, 'utf8')); } catch { return { file, ok: false, errors: ['the file is not valid JSON'], uses: [], submission: null }; }
  const errors: string[] = [];
  const targets = board(), lib = before ?? library();
  const target = sub.kind === 'target' ? targets.find((t) => t.id === sub.target) : undefined;
  if (sub.kind !== 'lemma' && sub.kind !== 'target') errors.push('`kind` must be "lemma" or "target"');
  if (sub.kind === 'target' && !target) errors.push(`unknown target ${JSON.stringify(sub.target)}; see shared-run/state/board.json`);
  if (sub.kind === 'lemma' && !(typeof sub.statement === 'string' && sub.statement.trim())) errors.push('a lemma needs a `statement`');
  if (typeof sub.proof !== 'string' || sub.proof.length > 60_000) errors.push('`proof` must be text (at most 60,000 characters)');
  if ((sub.open ?? []).some((o) => !IDENT.test(o))) errors.push('`open` must list namespaces only');
  if (sub.kind === 'lemma' && typeof sub.statement === 'string') errors.push(...badStatement(sub.statement));
  const copy = sub.kind === 'lemma' && typeof sub.statement === 'string' ? lib.find((e) => e.kind === 'lemma' && sameStatement(e, { statement: sub.statement!, open: (sub.open ?? []).filter((o) => IDENT.test(o)) })) : undefined;
  if (copy) errors.push(`this lemma is already in the library as ${copy.name}: cite it instead`);
  if (typeof sub.proof === 'string') errors.push(...banned(sub.proof, true));
  if (errors.length) return { file, ok: false, errors, uses: [], submission: sub };
  const { text, firstProofLine } = checkText(sub, lib, target);
  const c = await compileAndRead(DIR, join(DIR, '.check'), text, 'OSO.attempt', 600_000);
  if (c.timedOut) return { file, ok: false, errors: ['Lean timed out (10 minutes)'], uses: [], submission: sub };
  const re = /^[^\n:]*\.lean:(\d+):(\d+): error(?:\([^)]*\))?: ([\s\S]*?)(?=^[^\n:]*\.lean:\d+:\d+: |(?![\s\S]))/gm;
  for (const m of c.out.matchAll(re)) errors.push(`line ${Number(m[1]) - firstProofLine + 1}, column ${m[2]}: ${m[3].trim().slice(0, 1500)}`);
  const axioms = Array.isArray(c.axioms) ? c.axioms : null;
  const names = new Set(lib.map((e) => e.name));
  const uses = (axioms ?? []).filter((a) => names.has(a));
  const other = (axioms ?? []).filter((a) => !names.has(a) && !STANDARD_AXIOMS.includes(a));
  if (!errors.length && axioms === null) errors.push(`Lean did not accept the proof:\n${c.out.trim().slice(0, 2000)}`);
  if (other.length) errors.push(other.includes('sorryAx') ? 'the proof is incomplete (Lean reports `sorry`)' : `the proof depends on ${other.join(', ')}, which is not allowed`);
  return { file, ok: errors.length === 0, errors, uses: lib.filter((e) => uses.includes(e.name)).map((e) => e.id), submission: sub };
}

/** Everyone's credit: each target's bounty, paid once, flowing back through the library under α. */
export function credit(lib: Entry[], targets: Target[]) {
  const byId = new Map(lib.map((e) => [e.id, e]));
  const earned = new Map<string, number>(), lab = new Map<string, number>();
  const pay = (id: string, v: number) => {
    const e = byId.get(id)!;
    const parents = e.uses.filter((u) => byId.has(u));
    const keep = parents.length ? ALPHA * v : v;
    earned.set(id, (earned.get(id) ?? 0) + keep);
    lab.set(e.lab, (lab.get(e.lab) ?? 0) + keep);
    for (const p of parents) pay(p, ((1 - ALPHA) * v) / parents.length);
  };
  const paid = new Set<string>();
  // A proof copied from an open pull request can finish its check first; the bounty goes to the one opened first.
  const when = (e: Entry) => e.prAt ?? e.at;
  for (const e of [...lib].sort((a, b) => when(a).localeCompare(when(b)))) {
    if (e.kind !== 'target' || !e.target || paid.has(e.target)) continue;
    const t = targets.find((x) => x.id === e.target);
    if (!t) continue;
    paid.add(e.target);
    pay(e.id, t.bounty);
  }
  return { entries: Object.fromEntries(earned), labs: Object.fromEntries(lab), solved: [...paid] };
}

/** The public summary the site reads: board, labs, latest verdicts, solved targets. */
function summarize() {
  const targets = board(), lib = library(), c = credit(lib, targets);
  const verdicts = read<{ at: string; lab: string; pr: number; ok: boolean; kind: string; target: string | null; id: string | null; errors: string[] }[]>(join(STATE, 'verdicts.json'), []);
  const day = Date.now() - 86_400_000;
  const labs = [...new Set([...lib.map((e) => e.lab), ...verdicts.map((v) => v.lab)])].map((name) => ({
    name, points: Math.round((c.labs[name] ?? 0) * 10) / 10, proofs: lib.filter((e) => e.lab === name).length,
    lastAt: [...lib.filter((e) => e.lab === name).map((e) => e.at), ...verdicts.filter((v) => v.lab === name).map((v) => v.at)].sort().at(-1) ?? null,
  })).sort((a, b) => b.points - a.points || b.proofs - a.proofs);
  write(join(STATE, 'summary.json'), {
    alpha: ALPHA, updatedAt: new Date().toISOString(),
    activeLabs: labs.filter((l) => l.lastAt && Date.parse(l.lastAt) > day).length,
    targets: targets.map((t) => ({ ...t, solvedBy: lib.find((e) => e.kind === 'target' && e.target === t.id)?.lab ?? null })),
    library: lib.map((e) => ({ id: e.id, lab: e.lab, kind: e.kind, target: e.target, uses: e.uses, at: e.at, pr: e.pr, points: Math.round((c.entries[e.id] ?? 0) * 10) / 10, statement: e.statement })),
    labs, feed: verdicts.slice(-40).reverse(),
  });
}

const main = import.meta.url === pathToFileURL(process.argv[1] ?? '').href;
const [cmd, ...args] = main ? process.argv.slice(2) : ['(imported)'];
const flag = (k: string) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
if (cmd === 'board') {
  const b = makeBoard();
  write(join(STATE, 'board.json'), b);
  if (!existsSync(join(STATE, 'library.json'))) write(join(STATE, 'library.json'), []);
  summarize();
  console.log(b.map((t) => `${t.id.padEnd(34)} ${t.status.padEnd(7)} ${String(t.bounty).padStart(5)}  ${t.name}`).join('\n'));
} else if (cmd === 'check') {
  const files = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--out');
  const verdicts: Verdict[] = [];
  for (const f of files) verdicts.push(await checkOne(f));
  if (flag('--out')) writeFileSync(flag('--out')!, JSON.stringify(verdicts, null, 1));
  for (const v of verdicts) console.log(`${v.ok ? 'PASS' : 'FAIL'} ${v.file}${v.uses.length ? ` (uses ${v.uses.join(', ')})` : ''}${v.errors.length ? '\n  ' + v.errors.join('\n  ') : ''}`);
  process.exitCode = verdicts.every((v) => v.ok) ? 0 : 1;
} else if (cmd === 'apply') {
  const verdicts: Verdict[] = JSON.parse(readFileSync(args[0], 'utf8'));
  const lab = flag('--lab'), pr = Number(flag('--pr')), dir = flag('--files'), prAt = flag('--pr-at') ?? null;
  if (!lab || !IDENT.test(lab.replace(/-/g, '_'))) throw new Error('--lab <github user> is required');
  const lib = library(), log = read<object[]>(join(STATE, 'verdicts.json'), []), at = new Date().toISOString();
  // The verdicts come from the check job, where the submission's Lean ran: trust a pass only if its submission
  // is exactly a file of the pull request (fetched here from GitHub) and passes the text rules again.
  const fromPr = dir ? readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => { try { return JSON.stringify(JSON.parse(readFileSync(join(dir, f), 'utf8'))); } catch { return ''; } }) : null;
  for (const v of verdicts) {
    if (v.ok && (!v.submission || (fromPr && !fromPr.includes(JSON.stringify(v.submission))) || banned(v.submission.proof, true).length || (v.submission.kind === 'lemma' && badStatement(v.submission.statement ?? '').length))) {
      v.ok = false; v.errors = ['the verdict does not match the pull request'];
    }
    const s = v.submission;
    // The library may have grown since the check: a lemma recorded meanwhile with the same statement wins.
    const copy = v.ok && s?.kind === 'lemma' ? lib.find((e) => e.kind === 'lemma' && sameStatement(e, { statement: s.statement ?? '', open: (s.open ?? []).filter((o) => IDENT.test(o)) })) : undefined;
    if (copy) { v.ok = false; v.errors = [`this lemma is already in the library as ${copy.name}: cite it instead`]; }
    let id: string | null = null;
    if (v.ok && s) {
      id = `L${lib.length + 1}`;
      const t = s.kind === 'target' ? board().find((x) => x.id === s.target) : undefined;
      lib.push({ id, name: `OSO.${id}`, lab, pr: pr || null, at, prAt, kind: s.kind, target: s.kind === 'target' ? s.target! : null,
        statement: s.kind === 'target' ? `: type_of% @${t!.name}` : s.statement!, proof: s.proof, open: (s.open ?? []).filter((o) => IDENT.test(o)), uses: v.uses });
    }
    log.push({ at, lab, pr, ok: v.ok, kind: s?.kind ?? '?', target: s?.target ?? null, id, errors: v.errors.slice(0, 3).map((e) => e.slice(0, 300)) });
  }
  write(join(STATE, 'library.json'), lib);
  write(join(STATE, 'verdicts.json'), log);
  summarize();
  console.log(`applied ${verdicts.length} verdict(s) for ${lab}; library has ${lib.length}`);
} else if (cmd === 'audit') {
  // Check every library entry again, each against only the entries before it: anyone can confirm the whole library.
  const lib = library(), tmp = join(DIR, '.check', 'audit');
  mkdirSync(tmp, { recursive: true });
  let bad = 0;
  for (const [i, e] of lib.entries()) {
    const f = join(tmp, `${e.id}.json`);
    writeFileSync(f, JSON.stringify(e.kind === 'target' ? { kind: 'target', target: e.target, proof: e.proof, open: e.open } : { kind: 'lemma', statement: e.statement, proof: e.proof, open: e.open }));
    const v = await checkOne(f, lib.slice(0, i));
    const usesOk = [...v.uses].sort().join() === [...e.uses].sort().join();
    if (!v.ok || !usesOk) bad++;
    console.log(`${v.ok && usesOk ? 'OK  ' : 'BAD '} ${e.id} (${e.lab}, #${e.pr})${v.ok ? (usesOk ? '' : `: uses ${v.uses.join(', ')}, recorded ${e.uses.join(', ')}`) : ': ' + v.errors.join(' / ').slice(0, 300)}`);
  }
  console.log(`${lib.length - bad} of ${lib.length} entries check again`);
  if (bad) process.exitCode = 1;
} else if (cmd === 'credit') {
  summarize();
  console.log(JSON.stringify(credit(library(), board()), null, 1));
} else if (main) {
  console.error('usage: node scripts/shared.ts board | check <file.json>... [--out v.json] | apply <v.json> --lab <user> --pr <n> [--pr-at time] | audit | credit');
  process.exitCode = 2;
}
