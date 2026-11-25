// Replay one moment of a finished run with a changed prompt: `node scripts/replay-turn.ts <run dir> <rounds> <tries> [variants]`.
//
// Rebuilds the community as it stood at the start of each round given (library, earnings, money spent, past actions,
// all from the saved run), then lets the run's own model take that turn again, `tries` times per variant, labs in turn.
// Variants (comma list, default all): as-run, small (one small lemma a turn), small+failures (also the last 20
// failed tries shown). Lean checks every reply as in a run. Reports, per variant: turns with an answer, lemmas
// accepted, replies cut off, money a turn. Writes every turn to <run dir>/replay-<rounds>.jsonl. Costs real money.
import { appendFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { openRouterChat } from '../src/lean/agent.ts';
import { Community, costOf, type Action, type CommunityOptions, type CommunityResult } from '../src/lean/community.ts';
import { referenceCost } from '../src/lean/prices.ts';

const [dir, roundsArg, triesArg, variantsArg] = process.argv.slice(2);
if (!dir || !roundsArg || !triesArg) { console.error('usage: node scripts/replay-turn.ts <run dir> <round[,round]> <tries> [as-run,small,small+failures]'); process.exit(1); }
const rounds = roundsArg.split(',').map(Number), tries = Number(triesArg);
const VARIANTS: Record<string, Partial<CommunityOptions>> = { 'as-run': {}, small: { smallSteps: true }, 'small+failures': { smallSteps: true, showFailures: 20 } };
const variants = (variantsArg ?? Object.keys(VARIANTS).join(',')).split(',');
for (const v of variants) if (!VARIANTS[v]) { console.error(`unknown variant ${v}`); process.exit(1); }

const opts = JSON.parse(readFileSync(join(dir, 'options.json'), 'utf8')) as CommunityOptions;
// The checker reads the problem set from the environment when it is not passed (as the CLI sets it for a run).
process.env.OSO_PROBLEMS = opts.problems ?? 'main';
const result = JSON.parse(readFileSync(join(dir, 'result.json'), 'utf8')) as CommunityResult;
const actions = readFileSync(join(dir, 'actions.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)) as Action[];
const out = join(dir, `replay-${rounds.join('-')}-${Date.now()}.jsonl`);

/** The community at the start of `round`, with a variant's options. */
function rebuild(round: number, extra: Partial<CommunityOptions>): Community {
  const com = new Community({ ...opts, ...extra });
  com.library.push(...result.library.filter((e) => e.round < round).map((e) => ({ ...e, public: e.public && (e.publishedRound ?? e.round) < round })));
  com.actions.push(...actions.filter((a) => a.round < round));
  for (const p of result.ledger ?? []) if (p.round < round) com.earnings[p.lab] += p.amount;
  for (const a of actions) if (a.round < round) com.spent[a.agent] += costOf(a);
  return com;
}

const price = (u: Parameters<typeof referenceCost>[1] & { cost?: number }) => referenceCost(opts.agents[0], u) ?? u.cost ?? 0;
const jobs = rounds.flatMap((round) => variants.flatMap((variant) => Array.from({ length: tries }, (_, k) => ({ round, variant, lab: k % opts.agents.length }))));
console.log(`${jobs.length} turns: rounds ${rounds.join(', ')} × ${variants.join(', ')} × ${tries}. Writing ${out}`);

const rows: { round: number; variant: string; a: Action }[] = [];
let next = 0;
async function worker() {
  while (next < jobs.length) {
    const { round, variant, lab } = jobs[next++];
    const com = rebuild(round, VARIANTS[variant]);
    const chat = openRouterChat({ provider: 'openrouter', model: opts.agents[lab], effort: opts.effort, maxTokens: 32_000, providers: opts.providers });
    try {
      const a = await com.act(lab, round, chat, price, () => {});
      rows.push({ round, variant, a });
      appendFileSync(out, JSON.stringify({ round, variant, lab, kind: a.kind, ok: a.ok, reason: a.reason, name: a.name, signature: a.signature, cost: a.cost, replies: a.transcript?.length, cut: a.transcript?.filter((t) => t.stop === 'length').length, transcript: a.transcript?.map((t) => ({ stop: t.stop, output: t.output, errors: t.errors, text: t.text })) }) + '\n');
      process.stdout.write(`${a.ok ? '+' : a.kind === 'none' ? '.' : 'x'}`);
    } catch (e) { process.stdout.write('!'); appendFileSync(out, JSON.stringify({ round, variant, lab, error: String(e) }) + '\n'); }
  }
}
await Promise.all(Array.from({ length: 12 }, worker));
console.log('\n');

for (const round of rounds) for (const variant of variants) {
  const rs = rows.filter((r) => r.round === round && r.variant === variant).map((r) => r.a);
  const replies = rs.reduce((s, a) => s + (a.transcript?.length ?? 0), 0), cut = rs.reduce((s, a) => s + (a.transcript?.filter((t) => t.stop === 'length').length ?? 0), 0);
  const ok = rs.filter((a) => a.ok && !/duplicate/.test(a.reason ?? ''));
  console.log(`round ${round}, ${variant.padEnd(15)} turns ${rs.length} | gave an answer ${rs.filter((a) => a.kind !== 'none').length} | accepted ${ok.length} | replies cut off ${cut}/${replies} | $${(rs.reduce((s, a) => s + a.cost, 0) / Math.max(1, rs.length)).toFixed(4)} a turn`);
  for (const a of ok) console.log(`    + lab ${a.agent + 1}: ${a.name} ${a.signature?.replace(/\s+/g, ' ').slice(0, 110)}`);
}
