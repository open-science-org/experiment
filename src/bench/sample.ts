// Phase 0 problems: a fixed sample of FormalMATH-Lite (SphereLab, MIT license), spread over topics in
// proportion to the full set. Each statement is checked to compile against our Mathlib (with `sorry`)
// before it is kept, since FormalMATH was written for an older Mathlib.
//
// node src/bench/sample.ts <FormalMATH_lite.json> [--n 50] [--seed 1]   -> bench/problems.json
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { BENCH_DIR, compile } from './check.ts';

export interface Problem { id: string; source: string; topic: string; header: string; statement: string }

const args = process.argv.slice(2);
const opt = (name: string, fallback: string) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : fallback; };
const n = Number(opt('n', '50')), seed = Number(opt('seed', '1'));

/** The broad topic: the first part of FormalMATH's domain after "Mathematics ->". */
function topic(domain: string): string {
  const d = domain.replace(/^Mathematics\s*->\s*/, '').split(/->|;/)[0].trim().toLowerCase();
  if (/number theory/.test(d)) return 'number theory';
  if (/discrete|combinator/.test(d)) return 'combinatorics';
  if (/geometry/.test(d)) return 'geometry';
  if (/calculus|analysis|precalculus/.test(d)) return 'calculus';
  if (/applied/.test(d)) return 'applied';
  return 'algebra';
}

/** A seeded shuffle (mulberry32), so the sample is the same every time. */
function shuffle<T>(xs: T[], s: number): T[] {
  let a = s >>> 0;
  const rand = () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 2 ** 32; };
  const out = [...xs];
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  return out;
}

const raw = JSON.parse(readFileSync(args[0], 'utf8')) as { source: string; theorem_names: string; autoformalization: string; domain: string }[];
const all: Problem[] = raw.flatMap((r) => {
  const code = r.autoformalization.trim();
  const at = code.search(/^theorem\s/m);
  if (at < 0 || !code.endsWith(':= by')) return [];
  return [{ id: r.theorem_names, source: r.source, topic: topic(r.domain), header: code.slice(0, at).trim(), statement: code.slice(at) }];
});
const byTopic = new Map<string, Problem[]>();
for (const p of shuffle(all, seed)) byTopic.set(p.topic, [...(byTopic.get(p.topic) ?? []), p]);

// Each topic's share of n, largest remainders first, then statements that compile, in shuffled order.
const quota = [...byTopic].map(([t, ps]) => ({ t, exact: (n * ps.length) / all.length }));
const want = new Map(quota.map((q) => [q.t, Math.floor(q.exact)]));
for (const q of [...quota].sort((a, b) => (b.exact % 1) - (a.exact % 1)).slice(0, n - [...want.values()].reduce((a, b) => a + b, 0))) want.set(q.t, want.get(q.t)! + 1);

const kept: Problem[] = [];
for (const [t, ps] of byTopic) {
  let got = 0;
  for (const p of ps) {
    if (got >= want.get(t)!) break;
    const r = await compile(p, 'sorry', { allowSorry: true });
    if (r.ok) { kept.push(p); got++; } else console.log(`  skipped ${p.id} (${t}): ${r.errors[0]?.slice(0, 120)}`);
  }
  console.log(`${t}: ${got} of ${want.get(t)} (from ${ps.length})`);
}
writeFileSync(join(BENCH_DIR, 'problems.json'), JSON.stringify({ from: 'FormalMATH-Lite (SphereLab, MIT license)', seed, problems: kept }, null, 1) + '\n');
console.log(`${kept.length} problems -> bench/problems.json`);
