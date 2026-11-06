// Stress test of the Phase 0 checker, before any paid run: replies written the many ways a model writes
// them must pass when the proof is right, and every cheat or broken proof must fail. No model is called.
//
// npm run stress [-- --only name,name] [--concurrency 3]   -> results/bench/stress/summary.md
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { BENCH_DIR, compile, extractTactics } from './check.ts';
import type { Problem } from './sample.ts';

const args = process.argv.slice(2);
const value = (name: string, fallback: string) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : fallback; };
const { problems } = JSON.parse(readFileSync(join(BENCH_DIR, 'problems.json'), 'utf8')) as { problems: Problem[] };
const P = (id: string) => problems.find((p) => p.id === id)!;
const A = P('omni_theorem_3018'), B = P('omni_theorem_3054');

// Proofs Goedel-Prover found and Lean accepted (local-phase0-try1), with the margin removed.
const good = `have h_main : ∃ a ∈ S, ∃ b ∈ S, ∃ c ∈ S, a * b * c = 80 ∧ a + b + c = 25 := by
  rw [hS]
  refine' ⟨1, by norm_num, 4, by norm_num, 20, by norm_num, _⟩
  norm_num
  <;> aesop
exact h_main`;
const goodB = `have h₂ : b = a + 6 := by omega
have h₃ : a = 1 ∨ a = 2 ∨ a = 3 := by
  have h₄ : a ≤ 3 := by omega
  interval_cases a <;> omega
rcases h₃ with (rfl | rfl | rfl) <;> subst h₂ <;> norm_num`;
const fence = (code: string, lang = 'lean') => '```' + lang + '\n' + code + '\n```';
const indent = (code: string, n: number) => code.split('\n').map((l) => ' '.repeat(n) + l).join('\n');
const stmtA = A.statement, stmtB = B.statement;

interface Case { name: string; p: Problem; reply: string; expect: 'accept' | 'reject'; why: string; timeoutMs?: number; /** false: skip the text screen, to test the axioms check alone. */ screen?: boolean }
const cases: Case[] = [
  // Right proofs, written differently: all must pass.
  { name: 'tactics at the margin', p: A, reply: fence(good), expect: 'accept', why: 'the commonest reply' },
  { name: 'theorem repeated, prose around', p: A, reply: `Here is the proof.\n\n${fence(`${A.header}\n\n${stmtA}\n${indent(good, 2)}`, 'lean4')}\n\nThis uses norm_num.`, expect: 'accept', why: 'models often repeat the whole file' },
  { name: 'a wrong draft, then the right proof', p: A, reply: `First try:\n${fence(`${stmtA}\n  simp`)}\nBetter:\n${fence(`${stmtA}\n${indent(good, 2)}`)}`, expect: 'accept', why: 'the last block counts' },
  { name: 'tactics indented four spaces', p: A, reply: fence(indent(good, 4)), expect: 'accept', why: 'deeper margin' },
  { name: 'tabs', p: A, reply: fence(good.replace(/^ {2}/gm, '\t')), expect: 'accept', why: 'tab indents' },
  { name: 'Windows line endings', p: A, reply: fence(good).replace(/\n/g, '\r\n'), expect: 'accept', why: 'CRLF' },
  { name: 'stated as lemma', p: A, reply: fence(`${stmtA.replace(/^theorem/, 'lemma')}\n${indent(good, 2)}`), expect: 'accept', why: '`lemma` for `theorem`' },
  { name: 'statement on one line', p: A, reply: fence(`${stmtA.replace(/\s*\n\s*/g, ' ')}\n${indent(good, 2)}`), expect: 'accept', why: 'line breaks differ' },
  { name: '`by` on its own line', p: A, reply: fence(`${stmtA.replace(/\s*by$/, '\n  by')}\n${indent(good, 4)}`), expect: 'accept', why: 'layout of `:= by`' },
  { name: 'as an example', p: A, reply: fence(`${stmtA.replace(/^theorem\s+\S+/, 'example')}\n${indent(good, 2)}`), expect: 'accept', why: 'unnamed form of the same statement' },
  { name: 'set_option before tactics', p: B, reply: fence(`set_option maxHeartbeats 400000 in\n${goodB}`), expect: 'accept', why: 'a normal option inside the proof' },
  { name: 'second problem, plain', p: B, reply: fence(goodB), expect: 'accept', why: 'a second statement' },

  // Cheats and broken proofs: all must fail.
  { name: 'sorry', p: A, reply: fence('sorry'), expect: 'reject', why: 'the plain cheat' },
  { name: 'admit', p: A, reply: fence('admit'), expect: 'reject', why: '' },
  { name: 'sorryAx by name', p: A, reply: fence('exact sorryAx _ false'), expect: 'reject', why: 'not the word `sorry`, so the text screen misses it; `#print axioms` must catch it' },
  { name: 'sorryAx, axioms report faked', p: A, reply: fence(`exact sorryAx _ false\nmacro_rules | \`(#print axioms $_) => \`(#eval IO.println "'omni_theorem_3018' does not depend on any axioms")`), expect: 'reject', why: 'rewrites our `#print axioms` to print a clean report' },
  { name: 'faked report, indented', p: A, reply: fence(`exact sorryAx _ false\n  macro_rules | \`(#print axioms $_) => \`(#eval IO.println "'omni_theorem_3018' does not depend on any axioms")`), expect: 'reject', why: 'same, hidden by indenting' },
  { name: 'faked report, past the screen', p: A, reply: fence(`exact sorryAx _ false\n${'macro_rules | \`(#print axioms $_) => \`(#eval IO.println "\'omni_theorem_3018\' does not depend on any axioms")'}`), expect: 'reject', why: 'the text screen off: the separate axioms check must still catch it', screen: false },
  { name: 'same line, past the screen', p: A, reply: fence(`exact sorryAx _ false macro_rules | \`(tactic| skip) => \`(tactic| skip)`), expect: 'reject', why: 'a command can start mid-line', screen: false },
  { name: 'new syntax mid-line', p: A, reply: fence('exact sorryAx _ false; notation "x" => 1'), expect: 'reject', why: 'the screen must catch it anywhere in a line' },
  { name: 'new axiom before the theorem', p: A, reply: fence(`axiom cheat : False\n${stmtA}\n  exact cheat.elim`), expect: 'reject', why: 'only what follows `:= by` is used' },
  { name: 'axiom after the proof', p: A, reply: fence(`exact absurd trivial cheat\naxiom cheat : ¬True`), expect: 'reject', why: 'a declaration after the proof' },
  { name: 'weaker statement', p: A, reply: fence('theorem omni_theorem_3018 : True := by\n  trivial'), expect: 'reject', why: 'the statement must not change' },
  { name: 'proof uses itself', p: B, reply: fence('exact omni_theorem_3054 ha hb h'), expect: 'reject', why: 'circular' },
  { name: 'native_decide', p: B, reply: fence('native_decide'), expect: 'reject', why: 'trusts compiled code' },
  { name: 'ofReduceBool', p: B, reply: fence('exact Lean.ofReduceBool _ _ rfl'), expect: 'reject', why: '' },
  { name: 'proof cut short', p: B, reply: fence(goodB.split('\n').slice(0, 3).join('\n')), expect: 'reject', why: 'unfinished' },
  { name: 'tactics after the goal is closed', p: B, reply: fence(`${goodB}\nomega`), expect: 'reject', why: '"no goals" error' },
  { name: 'no code block', p: A, reply: 'The answer follows from norm_num.', expect: 'reject', why: '' },
  { name: 'empty reply', p: A, reply: '', expect: 'reject', why: '' },
  { name: 'hits a limit', p: B, reply: fence('have : (2 : ℕ) ^ 100000 % 7 = 2 := by decide\nomega'), expect: 'reject', why: 'Lean stops it' },
  { name: 'never finishes', p: B, reply: fence('set_option maxHeartbeats 0 in\nset_option maxRecDepth 1000000 in\nrepeat (first | skip)'), expect: 'reject', why: 'no limit inside Lean: our timeout must stop it', timeoutMs: 45_000 },
];

const only = value('only', '').split(',').filter(Boolean);
const run = only.length ? cases.filter((c) => only.includes(c.name)) : cases;
const concurrency = Number(value('concurrency', '3'));
console.log(`${run.length} cases, ${concurrency} at a time (each Lean check loads Mathlib: about 30 s).`);
const out: (Case & { got: 'accept' | 'reject'; detail: string; seconds: number })[] = [];
const queue = [...run];
await Promise.all(Array.from({ length: concurrency }, async () => {
  for (let c = queue.shift(); c; c = queue.shift()) {
    const tactics = extractTactics(c.reply, c.p);
    const r = tactics === null ? { ok: false, errors: ['no proof found in the reply'], seconds: 0 } : await compile(c.p, tactics, { timeoutMs: c.timeoutMs, screen: c.screen ?? true });
    const got = r.ok ? 'accept' : 'reject';
    out.push({ ...c, got, detail: r.errors[0]?.split('\n')[0].slice(0, 110) ?? '', seconds: r.seconds });
    console.log(`  ${got === c.expect ? 'ok  ' : 'FAIL'} ${c.name}: ${got}${r.errors[0] ? ` (${r.errors[0].split('\n')[0].slice(0, 90)})` : ''} · ${Math.round(r.seconds)}s`);
  }
}));
const order = (c: Case) => cases.indexOf(c);
out.sort((a, b) => order(a) - order(b));
const bad = out.filter((c) => c.got !== c.expect);
const dir = join(BENCH_DIR, '..', 'results', 'bench', 'stress');
mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, 'summary.md'), [
  '# Phase 0 checker: stress test', '',
  `${out.length - bad.length} of ${out.length} cases as expected${bad.length ? `; **${bad.length} wrong**: ${bad.map((c) => c.name).join(', ')}` : ''}. ${new Date().toISOString().slice(0, 10)}.`, '',
  '| Case | Should | Did | Why it is here | Lean said |', '| --- | --- | --- | --- | --- |',
  ...out.map((c) => `| ${c.got === c.expect ? '' : '**✗** '}${c.name} | ${c.expect} | ${c.got} | ${c.why} | ${c.detail.replace(/\|/g, '\\|')} |`), '',
].join('\n'));
console.log(`\n${out.length - bad.length} of ${out.length} as expected. results/bench/stress/summary.md`);
process.exit(bad.length ? 1 : 0);
