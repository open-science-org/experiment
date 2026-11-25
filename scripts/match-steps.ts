// Which hidden steps of the reference proofs a run's labs have proved: `node scripts/match-steps.ts <run dir>`.
//
// Labs name and state their lemmas their own way, so a step counts as proved when Lean gets it from one lab lemma
// by `apply` alone: either side of an = or ↔ may come first, arguments in any order, other hypotheses at hand, and
// no computing through the definitions (with_reducible). A lab lemma is proved, so whatever it gives is really
// available: no step is coloured wrongly. A step proved in another shape (k·C against C·k) or split over several
// lemmas is missed, so a grey step means "not proved in this form". Works for any problem set: it reads the
// run's options and the set's reference files.
// Writes <run dir>/matches.json and checks only lemmas it has not checked before, so it can run every minute.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Action, CommunityOptions } from '../src/lean/community.ts';
import { definitions, filesOf, FREE, LEAN_DIR, loadTasks, opened, type Problems } from '../src/lean/tasks.ts';

const dir = process.argv[2];
if (!dir || !existsSync(join(dir, 'options.json'))) { console.error('usage: node scripts/match-steps.ts <run dir>'); process.exit(1); }
const opts = JSON.parse(readFileSync(join(dir, 'options.json'), 'utf8')) as CommunityOptions;
const problems = (opts.problems ?? 'main') as Problems;
process.env.OSO_PROBLEMS = problems;
const out = join(dir, 'matches.json');
type Matches = { checked: Record<string, string>; covers: Record<string, string[]> };
const saved: Matches = existsSync(out) ? JSON.parse(readFileSync(out, 'utf8')) : { checked: {}, covers: {} };

const actions = (existsSync(join(dir, 'actions.jsonl')) ? readFileSync(join(dir, 'actions.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)) : []) as Action[];
const fresh = actions.filter((a) => a.ok && a.entry && a.kind === 'lemma' && a.signature && saved.checked[a.entry] !== a.signature);
if (!fresh.length) process.exit(0);
// MATCH_DEBUG=1 prints the generated Lean file's path, to read Lean's own messages.
const DEBUG = process.env.MATCH_DEBUG;

// Cheap screen before Lean: the conclusion must use the same definitions and operators as the step's.
const defs = definitions(problems);
const vocab = new Set([
  ...[...defs.matchAll(/^\s*(?:def|abbrev|inductive|structure|instance)\s+([\w.]+)/gm)].map((m) => m[1].split('.').pop()!),
  // Constructors (`| succ : N → N`), not the arms of a match (`| a, zero =>`).
  ...[...defs.matchAll(/^\s*\|\s*([A-Za-z_][\w']*)\s*(?::|$)/gm)].map((m) => m[1]),
]);
const conclusion = (sig: string) => {
  let depth = 0, cut = -1;
  for (let i = 0; i < sig.length; i++) {
    const c = sig[i];
    if ('([{⟨'.includes(c)) depth++; else if (')]}⟩'.includes(c)) depth--;
    else if (c === ':' && depth === 0 && sig[i + 1] !== '=') { cut = i; break; }
  }
  let body = sig.slice(cut + 1);
  for (;;) { const m = /^\s*∀[^,]*,/.exec(body); if (!m) break; body = body.slice(m[0].length); }
  // After the last top-level arrow: the hypotheses before it do not have to match.
  depth = 0; let last = -1;
  for (let i = 0; i < body.length; i++) { const c = body[i]; if ('([{⟨'.includes(c)) depth++; else if (')]}⟩'.includes(c)) depth--; else if (c === '→' && depth === 0) last = i; }
  return body.slice(last + 1);
};
const shape = (sig: string) => [...new Set((conclusion(sig).match(/[A-Za-z_][\w.']*|[+*^∣≤<=↔∧∨¬≠%/-]/g) ?? []).map((t) => t.split('.').pop()!).filter((t) => vocab.has(t) || !/^[A-Za-z_]/.test(t)))].sort().join(' ');

const steps = loadTasks(problems).filter((t) => !t.posted && !FREE.includes(t.name));
const pairs: { i: number; t: (typeof steps)[number] }[] = [];
fresh.forEach((a, i) => { const k = shape(a.signature!); for (const t of steps) if (shape(t.signature) === k) pairs.push({ i, t }); });

const covers: Record<string, string[]> = {};
if (pairs.length) {
  const open = opened(problems);
  const head = [...filesOf(problems).map(([f]) => `import Reference.${f}`), 'set_option autoImplicit false', '', 'namespace OSO.Lab', `open ${open}`,
    ...fresh.map((a, i) => `axiom e${i} ${a.signature!.trim().startsWith(':') || a.signature!.trim().startsWith('(') || a.signature!.trim().startsWith('{') ? a.signature : `: ${a.signature}`}`), 'end OSO.Lab', ''];
  const lines = [...head], at: { from: number; to: number; i: number; name: string }[] = [];
  pairs.forEach(({ i, t }, k) => {
    const from = lines.length + 1, e = `OSO.Lab.e${i}`;
    lines.push(`namespace ${t.ns}`, ...(t.ns === 'OSO' ? [`open ${open}`] : []), 'set_option maxHeartbeats 20000 in',
      `theorem oso_match_${k} ${t.signature} := by`, '  intros', '  first',
      `  | (with_reducible apply ${e} <;> assumption)`, `  | (apply Eq.symm; with_reducible apply ${e} <;> assumption)`, `  | (apply Iff.symm; with_reducible apply ${e} <;> assumption)`, `end ${t.ns}`, `#print axioms ${t.ns}.oso_match_${k}`, '');
    at.push({ from, to: lines.length, i, name: `${t.ns}.oso_match_${k}`, step: t.name } as never);
  });
  const file = join(mkdtempSync(join(tmpdir(), 'oso-match-')), 'Match.lean');
  writeFileSync(file, lines.join('\n'));
  if (DEBUG) console.log('file', file);
  let log = '';
  try { log = execFileSync('lake', ['env', 'lean', '-DmaxErrors=1000000', file], { cwd: LEAN_DIR, encoding: 'utf8', maxBuffer: 64 << 20, stdio: ['ignore', 'pipe', 'pipe'] }); }
  catch (e) { log = `${(e as { stdout?: string }).stdout ?? ''}${(e as { stderr?: string }).stderr ?? ''}`; }
  // A lab lemma Lean cannot read (rare: it was read once already, by the checker) gets no axiom, and its checks fail.
  const bad = [...log.matchAll(/Match\.lean:(\d+):\d+: error/g)].map((m) => Number(m[1])).filter((l) => l <= head.length);
  if (bad.length) console.error(`match-steps: Lean could not read ${bad.length} lab lemma line(s); their checks count as not matched`);
  // Positive proof only: a check counts when Lean prints its axioms and they do not include sorryAx (a failed
  // proof is closed with sorry). Silence never counts, so a cut-off log cannot make a match.
  const held = new Set([...log.matchAll(/'([\w.]+)' depends on axioms: \[([^\]]*)\]/g)].filter((m) => !m[2].includes('sorryAx')).map((m) => m[1]));
  for (const p of at as unknown as { i: number; name: string; step: string }[]) if (held.has(p.name)) (covers[fresh[p.i].entry!] ??= []).push(p.step);
}
for (const a of fresh) { saved.checked[a.entry!] = a.signature!; saved.covers[a.entry!] = covers[a.entry!] ?? []; }
writeFileSync(out, JSON.stringify(saved, null, 1) + '\n');
const hit = Object.values(saved.covers).filter((c) => c.length).length;
console.log(`match-steps: ${fresh.length} new lemmas, ${pairs.length} checks; ${hit} of ${Object.keys(saved.covers).length} lemmas give a hidden step`);
