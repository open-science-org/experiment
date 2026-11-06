// Phase 0, the harness check: one agent, and independent agents (several attempts per problem, nothing
// shared), on the FormalMATH-Lite sample with Mathlib. Its job is to show our harness is not weak: a
// single agent should score near the published rate for the same model.
//
// npm run bench -- [--provider local|openrouter|anthropic] [--model M] [--attempts 1] [--repairs 2]
//                  [--concurrency 1] [--only id,id] [--max-tokens N] [--run ID] [--dry-run]
//   -> results/bench/<run>/summary.md and records.jsonl; transcripts (private) in bench/runs/<run>/
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chatFor, DEFAULT_MODEL, DEFAULT_MODELS, defaultProvider, localPrice, type ModelSettings, type Provider, type Usage } from '../lean/agent.ts';
import { BENCH_DIR, compile, extractTactics, theoremName } from './check.ts';
import type { Problem } from './sample.ts';

const args = process.argv.slice(2);
const value = (name: string, fallback: string) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : fallback; };
const flag = (name: string) => args.includes(`--${name}`);

const provider = value('provider', defaultProvider() ?? 'local') as Provider;
const model: ModelSettings = {
  ...DEFAULT_MODEL, provider, model: value('model', DEFAULT_MODELS[provider]), effort: value('effort', 'medium') as ModelSettings['effort'],
  maxTokens: Number(value('max-tokens', provider === 'local' ? '8000' : '32000')),
};
const attempts = Number(value('attempts', '1')), repairs = Number(value('repairs', '2')), concurrency = Number(value('concurrency', '1'));
const only = value('only', '').split(',').filter(Boolean);
const { problems: all } = JSON.parse(readFileSync(join(BENCH_DIR, 'problems.json'), 'utf8')) as { problems: Problem[] };
const problems = only.length ? all.filter((p) => only.includes(p.id)) : all;

console.log(`${problems.length} problems × ${attempts} attempts, up to ${1 + repairs} calls each: at most ${problems.length * attempts * (1 + repairs)} calls. Agent: ${model.model} via ${provider}.`);
if (flag('dry-run')) process.exit(0);

const runId = value('run', `bench-${provider}-${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')}`);
const out = join(BENCH_DIR, '..', 'results', 'bench', runId), priv = join(BENCH_DIR, 'runs', runId);
mkdirSync(out, { recursive: true }); mkdirSync(priv, { recursive: true });
writeFileSync(join(out, 'options.json'), JSON.stringify({ model, attempts, repairs, problems: problems.map((p) => p.id) }, null, 1));

const SYSTEM = `You prove theorems in Lean 4 with Mathlib. You get a theorem statement ending in \`:= by\`.
Reply with the complete proof in one \`\`\`lean code block: the tactics that follow \`:= by\` (you may repeat the whole theorem; only what follows its \`:= by\` is used).
Do not change the statement. Do not use \`sorry\`, \`admit\`, \`native_decide\` or new axioms. If Lean reports errors, fix them and reply with the whole corrected proof.`;

const chat = chatFor(model);
/** Dollars for a call: what the provider charged; a local call is priced as a cheap open model would be served. */
const dollars = (u: Usage) => (provider === 'local' ? localPrice(u) : u.cost ?? 0);

interface Rec { id: string; topic: string; k: number; ok: boolean; turns: number; input: number; output: number; dollars: number; seconds: number; failure?: string; t: number }
const records: Rec[] = [];

async function one(p: Problem, k: number): Promise<Rec> {
  const t0 = Date.now();
  const messages: { role: 'user' | 'assistant'; content: unknown }[] = [{ role: 'user', content: `Prove this:\n\n\`\`\`lean\n${p.header}\n\n${p.statement}\n\`\`\`` }];
  const transcript: unknown[] = [];
  let input = 0, output = 0, cost = 0, ok = false, failure = '', turns = 0;
  for (let turn = 0; turn <= repairs && !ok; turn++) {
    turns++;
    let reply;
    try { reply = await chat(SYSTEM, messages); } catch (e) { failure = `call failed: ${(e as Error).message}`; break; }
    input += reply.usage.input + reply.usage.cacheRead; output += reply.usage.output; cost += dollars(reply.usage);
    messages.push({ role: 'assistant', content: reply.content });
    const tactics = extractTactics(reply.text, p);
    const result = tactics === null ? null : await compile(p, tactics);
    ok = result?.ok ?? false;
    transcript.push({ text: reply.text, tactics, errors: result?.errors ?? ['no ```lean block with a proof of this theorem'], stop: reply.stop });
    if (!ok) {
      failure = reply.stop === 'length' || reply.stop === 'max_tokens' ? 'reply too long' : result ? 'Lean rejected the proof' : 'no proof in the reply';
      messages.push({ role: 'user', content: result ? `Lean reports:\n\n${result.errors.join('\n\n').slice(0, 6000)}\n\nFix the proof of \`${theoremName(p)}\` and reply with the whole corrected proof.` : `Your reply had no \`\`\`lean code block with a proof of \`${theoremName(p)}\`. Reply with one.` });
    }
  }
  writeFileSync(join(priv, `${p.id}-${k}.json`), JSON.stringify(transcript, null, 1));
  return { id: p.id, topic: p.topic, k, ok, turns, input, output, dollars: cost, seconds: (Date.now() - t0) / 1000, ...(ok ? {} : { failure }), t: Date.now() };
}

const queue = problems.flatMap((p) => Array.from({ length: attempts }, (_, k) => [p, k] as const));
const started = Date.now();
await Promise.all(Array.from({ length: Math.max(1, concurrency) }, async () => {
  for (let job = queue.shift(); job; job = queue.shift()) {
    const r = await one(...job);
    records.push(r);
    appendFileSync(join(out, 'records.jsonl'), JSON.stringify(r) + '\n');
    const solved = new Set(records.filter((x) => x.ok).map((x) => x.id)).size;
    console.log(`  ${r.ok ? 'PROVED' : 'failed'} ${r.id} #${r.k + 1} (${r.turns} calls, ${Math.round(r.seconds)}s${r.failure ? `, ${r.failure}` : ''}); ${solved} solved, ${records.length} of ${problems.length * attempts} done`);
  }
}));

// Summary: solved by one agent (first attempt) and by independent agents (any of the attempts).
const solvedBy = (ks: number) => new Set(records.filter((r) => r.ok && r.k < ks).map((r) => r.id));
const total = records.reduce((a, r) => a + r.dollars, 0), tokens = records.reduce((a, r) => a + r.input + r.output, 0);
const topics = [...new Set(problems.map((p) => p.topic))].sort();
const any = solvedBy(attempts);
const fail = new Map<string, number>();
for (const r of records) if (!r.ok) fail.set(r.failure!, (fail.get(r.failure!) ?? 0) + 1);
const lines = [
  `# Phase 0 harness check: ${runId}`, '',
  `- **Problems:** ${problems.length} from FormalMATH-Lite, spread over topics as the full set is (\`bench/problems.json\`).`,
  `- **Agent:** \`${model.model}\` via ${provider}, effort ${model.effort}, replies up to ${model.maxTokens} tokens. One attempt is a first proof plus up to ${repairs} repairs on Lean's errors.`,
  `- **Checker:** Lean 4.35 with Mathlib v4.35.0; the statement is never changed; only Lean's standard axioms are allowed.`,
  provider === 'local' ? `- **Money:** a model on this machine costs nothing; dollars here price its tokens as a cheap open model would be served ($0.10 / $0.40 per million tokens in / out).` : `- **Money:** what the provider charged.`,
  '',
  '| | Solved | Rate |', '| --- | --- | --- |',
  `| One agent (first attempt) | ${solvedBy(1).size} of ${problems.length} | ${Math.round((100 * solvedBy(1).size) / problems.length)}% |`,
  ...(attempts > 1 ? [`| Independent agents (any of ${attempts}) | ${any.size} of ${problems.length} | ${Math.round((100 * any.size) / problems.length)}% |`] : []),
  '',
  `**Cost:** $${total.toFixed(2)} in all, ${any.size ? `$${(total / any.size).toFixed(3)} per problem solved` : 'nothing solved'}; ${(tokens / 1e6).toFixed(2)}M tokens; ${Math.round((Date.now() - started) / 60000)} minutes.`, '',
  '| Topic | Problems | Solved |', '| --- | --- | --- |',
  ...topics.map((t) => `| ${t} | ${problems.filter((p) => p.topic === t).length} | ${[...any].filter((id) => problems.find((p) => p.id === id)?.topic === t).length} |`),
  '',
  ...(fail.size ? ['**Why attempts failed:** ' + [...fail].map(([f, c]) => `${f} ${c}`).join('; ') + '.', ''] : []),
  'Records: `records.jsonl` (one line per attempt, in the order they finished, for the cost-vs-solved graph).', '',
];
writeFileSync(join(out, 'summary.md'), lines.join('\n'));
console.log(`\n${any.size} of ${problems.length} solved. Summary: results/bench/${runId}/summary.md`);
