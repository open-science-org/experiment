// Why each Phase 0 attempt failed, sorted by whose fault it is: the harness (we lost or cut a proof),
// the benchmark (the statement looks false or broken), or the model (Lean rejected a wrong proof).
//
// node src/bench/audit.ts <run>   -> results/bench/<run>/audit.md
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { BENCH_DIR } from './check.ts';

const run = process.argv[2];
if (!run) throw new Error('usage: node src/bench/audit.ts <run>');
const out = join(BENCH_DIR, '..', 'results', 'bench', run);
const records = readFileSync(join(out, 'records.jsonl'), 'utf8').trim().split('\n').map((l) => JSON.parse(l) as { id: string; k: number; ok: boolean; failure?: string; turns: number });
interface Turn { text: string; tactics: string | null; errors: string[]; stop: string }

/** The cause of a failed attempt, from its last turn (and the others, for the "statement is false" claim). */
function cause(turns: Turn[]): { who: 'harness' | 'benchmark' | 'model' | 'run'; why: string } {
  const last = turns.at(-1)!;
  const said = turns.some((t) => /\b(statement|theorem|claim)\b[^.]{0,60}\b(is|are) (false|not true|unprovable|incorrect)|counterexample|cannot be proved|no (Lean )?proof (of [^.]* )?(can )?exists?/i.test(t.text));
  if (last.stop === 'length' || last.stop === 'max_tokens') return { who: 'harness', why: 'reply cut off at the length limit' };
  if (last.tactics === null) {
    if (said) return { who: 'benchmark', why: 'the model says the statement is false' };
    if (/```/.test(last.text)) return { who: 'harness', why: 'a code block we did not take as a proof' };
    return { who: 'model', why: 'no proof in the reply' };
  }
  const e = last.errors.join('\n');
  if (said) return { who: 'benchmark', why: 'the model says the statement is false (and still tried)' };
  if (/in the statement: unsolved goals/.test(e)) return { who: 'model', why: 'tactics did not close the goal (our feedback wrongly said "in the statement"; fixed 2026-11-06)' };
  if (/in the statement/.test(e)) return { who: 'harness', why: 'Lean reports an error in the statement, not the proof' };
  if (/timed out|axioms check did not finish/.test(e)) return { who: 'harness', why: 'our time limit' };
  if (/not allowed/.test(e)) return { who: 'model', why: `refused by the screen: ${e.split('\n')[0].slice(0, 60)}` };
  if (/Unknown (identifier|constant)|unknown (identifier|constant)|deprecated/.test(e)) return { who: 'model', why: 'a Mathlib name that does not exist (an older or invented name)' };
  if (/unexpected token|expected/.test(e) && !/unsolved goals/.test(e)) return { who: 'model', why: 'Lean syntax error' };
  if (/unsolved goals|linarith failed|nlinarith failed|failed to prove|omega could not|No goals|Tactic .* failed|failed/.test(e)) return { who: 'model', why: 'tactics did not close the goal' };
  return { who: 'model', why: `other Lean error: ${e.split('\n')[0].slice(0, 60)}` };
}

const rows = records.filter((r) => !r.ok).map((r) => {
  if (r.failure === 'call failed') return { ...r, who: 'run' as const, why: 'a model call failed (not scored)', note: '' };
  const turns = JSON.parse(readFileSync(join(BENCH_DIR, 'runs', `${run}-transcripts`, `${r.id}-${r.k}.json`), 'utf8')) as Turn[];
  const c = cause(turns);
  return { ...r, ...c, note: (turns.at(-1)!.errors[0] ?? '').split('\n')[0].slice(0, 90) };
});
const by = (who: string) => rows.filter((r) => r.who === who);
const solved = records.filter((r) => r.ok).length;
const lines = [
  `# Why attempts failed: ${run}`, '',
  `${solved} of ${records.filter((r) => r.failure !== 'call failed').length} scored attempts proved. Of the ${rows.length - by('run').length} that failed:`, '',
  '| Whose fault | Failures |', '| --- | --- |',
  `| Our harness (a proof lost or cut short) | ${by('harness').length} |`,
  `| The benchmark (statement looks false) | ${by('benchmark').length} |`,
  `| The model (Lean rejected its proof) | ${by('model').length} |`,
  ...(by('run').length ? [`| Not scored (a call failed) | ${by('run').length} |`] : []), '',
  '| Problem | Whose fault | Why | Lean said |', '| --- | --- | --- | --- |',
  ...rows.map((r) => `| ${r.id} | ${r.who} | ${r.why} | ${r.note.replace(/\|/g, '\\|')} |`), '',
  'Sorted from each attempt\'s transcript by fixed rules (src/bench/audit.ts); read the transcripts for the harness and benchmark rows.', '',
];
writeFileSync(join(out, 'audit.md'), lines.join('\n'));
console.log(lines.slice(0, 10).join('\n'));
