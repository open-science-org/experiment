// The Lean pilot (specification, section 6.2): `npm run pilot -- <command>`.
//   selftest                      run every reference proof through the checker
//   calibrate [options]           a real agent attempts every theorem; needs ANTHROPIC_API_KEY
//     --dry-run                   only count attempts, calls and prompt tokens
//     --stub                      answer with the reference proofs (tests the pipeline, no model)
//     --attempts N (3)  --repairs N (3)  --concurrency N (4)
//     --only A3,B-02,...          some theorems only
//     --conditions library,alone  which conditions (both)
//     --provider anthropic|openrouter (whichever key is set)  --model NAME  --effort low|medium|high|max
//     --grind (allow grind)
//     --run ID                    resume or name a run (default: today's date and time)
//   summary <run>                 rewrite the public summary of a run
//   world <run>                   write worlds/lean-measured.json and spaces/lean-measured.yaml
//   compare <id> <run> <run> ...  several runs (one per model) side by side
//   series <id>                   combine finished races <id>-r1, <id>-r2, … into one summary
//   community [options]           real-agent communities, traditional and OSO, on the same budget
//     --agents m1,m2,...  --budget DOLLARS (per agent)  --rounds N (30)  --repairs N (2)
//     --rules traditional,oso  --effort low|medium|high (medium)  --run ID  --stub  --dry-run
import { chatFor, DEFAULT_MODEL, DEFAULT_MODELS, defaultProvider, type Provider } from './agent.ts';
import { estimate, readRun, writeComparison, referenceChat, runPilot, writeMeasuredWorld, writeSummary, type Condition, type PilotOptions } from './pilot.ts';
import { selftest } from './selftest.ts';
import { leanAvailable, loadTasks } from './tasks.ts';

const args = process.argv.slice(2);
const [cmd, arg] = args;
const flag = (name: string) => args.includes(`--${name}`);
const value = (name: string, fallback: string) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : fallback; };

if (!leanAvailable()) {
  console.error('The Lean problem set is not here: lean/Reference/ and lean/reference-dag.md are private and not in git.');
  process.exit(1);
}

if (cmd === 'selftest') {
  const rows = await selftest();
  const fail = rows.filter((r) => !r.withGrind);
  const wrongUses = rows.filter((r) => r.withGrind && !r.usesOk);
  const grindMismatch = rows.filter((r) => r.withGrind && r.noGrind === r.usesGrind);
  console.log(`\n${rows.length} reference proofs: ${rows.length - fail.length} pass with grind allowed; ${rows.filter((r) => !r.noGrind).length} need grind.`);
  for (const r of fail) console.log(`  FAIL ${r.task.name}: ${r.errors.join(' | ').slice(0, 400)}`);
  for (const r of wrongUses) console.log(`  uses differ from the reference DAG: ${r.task.name}`);
  for (const r of grindMismatch) console.log(`  grind ban inconsistent: ${r.task.name}`);
  process.exit(fail.length || wrongUses.length || grindMismatch.length ? 1 : 0);
}

if (cmd === 'calibrate') {
  const opts: PilotOptions = {
    attempts: Number(value('attempts', '3')),
    repairs: Number(value('repairs', '3')),
    concurrency: Number(value('concurrency', '4')),
    allowGrind: flag('grind'),
    conditions: value('conditions', 'library,alone').split(',') as Condition[],
    only: value('only', '').split(',').filter(Boolean),
    model: (() => {
      const provider = value('provider', defaultProvider() ?? 'anthropic') as Provider;
      return { ...DEFAULT_MODEL, provider, model: value('model', DEFAULT_MODELS[provider]), effort: value('effort', DEFAULT_MODEL.effort) as PilotOptions['model']['effort'] };
    })(),
  };
  const e = estimate(opts);
  console.log(`${e.attempts} attempts; at most ${e.maxCalls} model calls; first prompts about ${Math.round(e.firstPromptTokens / 1000)}k tokens in all (repairs and thinking add more).`);
  if (flag('dry-run')) process.exit(0);
  const stub = flag('stub');
  const keyVar = opts.model.provider === 'openrouter' ? 'OPENROUTER_API_KEY' : 'ANTHROPIC_API_KEY';
  if (!stub && !process.env[keyVar]) {
    console.error(`Set ${keyVar} in .env to run with ${opts.model.provider} (or use --dry-run or --stub).`);
    process.exit(1);
  }
  if (!stub) console.log(`Agent: ${opts.model.model} via ${opts.model.provider}, effort ${opts.model.effort}.`);
  const runId = value('run', `${stub ? 'stub-' : ''}${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')}`);
  const records = await runPilot(opts, stub ? referenceChat(loadTasks()) : chatFor(opts.model), runId);
  const dir = writeSummary(runId, records, opts, stub ? 'This is a pipeline test: the "agent" answers with the reference proofs.' : '');
  console.log(`\n${records.filter((r) => r.ok).length}/${records.length} attempts proved. Summary: ${dir}/summary.md; transcripts (private): lean/runs/${runId}/`);
  process.exit(0);
}

if (cmd === 'community') {
  const { runCommunity, referenceAgent, listPrices, writeCommunityComparison } = await import('./community.ts');
  const { openRouterChat } = await import('./agent.ts');
  const stub = flag('stub');
  // A race designed in the app comes as a config file; flags set the rest.
  const cfg = flag('config') ? JSON.parse((await import('node:fs')).readFileSync(value('config', ''), 'utf8')) as Record<string, unknown> : {};
  const pick = (name: string, fallback: string) => (cfg[name] !== undefined ? String(Array.isArray(cfg[name]) ? (cfg[name] as unknown[]).join(',') : cfg[name]) : value(name, fallback));
  const agents = pick('agents', 'deepseek/deepseek-v4.1-flash,google/gemini-3.8-flash,openai/gpt-5.6-terra,deepseek/deepseek-v4.1-flash').split(',');
  const base = {
    agents, budget: Number(pick('budget', '0.5')), rounds: Number(pick('rounds', '30')), repairs: Number(pick('repairs', '2')),
    alpha: 0.8, c: 0.15, mint: 1, effort: pick('effort', 'medium') as 'low' | 'medium' | 'high', allowGrind: stub,
    personas: (cfg.personas as string[] | undefined) ?? [],
    personaNames: (cfg.personaNames as string[] | undefined) ?? [],
    repairsByLab: cfg.repairsByLab as number[] | undefined,
    effortByLab: cfg.effortByLab as ('low' | 'medium' | 'high')[] | undefined,
    reuseByLab: cfg.reuseByLab as boolean[] | undefined,
    conjectures: (cfg.conjectures as string[] | undefined) ?? (value('conjectures', '') ? value('conjectures', '').split(',') : []),
    conjectureBounty: Number(pick('conjectureBounty', '1')),
    counted: (cfg.counted as string[] | undefined) ?? (value('counted', '') ? value('counted', '').split(',') : []),
  };
  const rules = pick('rules', 'traditional,oso').split(',') as ('traditional' | 'oso')[];
  console.log(`${rules.length} communities × ${agents.length} labs × $${base.budget} = $${(rules.length * agents.length * base.budget).toFixed(2)} at most, at list prices; up to ${base.rounds} rounds.`);
  if (flag('dry-run')) process.exit(0);
  if (!stub && !process.env.OPENROUTER_API_KEY) { console.error('Set OPENROUTER_API_KEY in .env (or use --stub).'); process.exit(1); }
  const prices = stub ? null : await listPrices([...new Set(agents)]);
  const price = (m: string, u: { input: number; output: number; cacheRead: number }) => (prices ? (u.input + u.cacheRead) * prices[m].input + u.output * prices[m].output : 0.01);
  const id = pick('run', `${stub ? 'stub-' : ''}community-${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')}`);
  const repeats = Number(pick('repeats', '1'));
  const chat = (com: import('./community.ts').Community, i: number) => (stub ? referenceAgent(com, i) : openRouterChat({ provider: 'openrouter', model: agents[i], effort: base.effortByLab?.[i] ?? base.effort, maxTokens: 32_000 }));
  if (repeats > 1) {
    // A series: both communities, run after run, then one summary on the measure fixed in advance.
    const { writeRaceSeries } = await import('./community.ts');
    const pairs = [];
    for (let k = 1; k <= repeats; k++) {
      const out: Record<string, import('./community.ts').CommunityResult> = {};
      for (const r of rules) {
        console.log(`\nRun ${k} of ${repeats}, ${r === 'oso' ? 'OSO' : 'Traditional'} community:`);
        out[r] = await runCommunity({ ...base, rules: r }, chat, price, `${id}-r${k}-${r}`);
      }
      pairs.push({ rep: k, traditional: out.traditional, oso: out.oso });
      writeRaceSeries(id, pairs, String(cfg.design ?? value('design', 'A series of races with the same labs and budget on both sides.')));
    }
    console.log(`\nSummary: results/community/${id}/summary.md`);
    process.exit(0);
  }
  const results = [];
  for (const r of rules) {
    console.log(`\n${r === 'oso' ? 'OSO' : 'Traditional'} community:`);
    const result = await runCommunity({ ...base, rules: r }, chat, price, `${id}-${r}`);
    results.push({ runId: `${id}-${r}`, result });
  }
  const dir = writeCommunityComparison(id, results, stub ? 'This is a pipeline test: the labs play from the reference proofs.' : '', stub);
  console.log(`\nSummary: ${dir}/summary.md`);
  process.exit(0);
}

if (cmd === 'series') {
  if (!arg) throw new Error('usage: npm run pilot -- series <id>');
  const { readCommunity, writeRaceSeries } = await import('./community.ts');
  const { existsSync, readFileSync } = await import('node:fs');
  const { join } = await import('node:path');
  const { LEAN_DIR } = await import('./tasks.ts');
  const pairs = [];
  for (let k = 1; k < 100; k++) {
    const done = (r: string) => existsSync(join(LEAN_DIR, 'runs', `${arg}-r${k}-${r}`, 'result.json'));
    if (!existsSync(join(LEAN_DIR, 'runs', `${arg}-r${k}-traditional`)) && !existsSync(join(LEAN_DIR, 'runs', `${arg}-r${k}-oso`))) break;
    if (done('traditional') && done('oso')) pairs.push({ rep: k, traditional: readCommunity(`${arg}-r${k}-traditional`), oso: readCommunity(`${arg}-r${k}-oso`) });
  }
  if (!pairs.length) throw new Error(`no finished pair of races for ${arg}`);
  const cfgFile = join(LEAN_DIR, 'runs', `${arg}.config.json`);
  const c = existsSync(cfgFile) ? JSON.parse(readFileSync(cfgFile, 'utf8')) as { title?: string; design?: string; question?: string; compare?: string; fixed?: string; caveats?: string[]; primary?: { kind: 'spendTo'; k: number } } : {};
  const design = { title: c.title, prose: c.design, question: c.question, compare: c.compare, fixed: c.fixed, caveats: c.caveats, primary: c.primary };
  console.log(`${pairs.length} finished pair(s): ${writeRaceSeries(arg, pairs, design)}/summary.md`);
  process.exit(0);
}

if (cmd === 'compare') {
  const [, id, ...runIds] = args.filter((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
  if (!id || !runIds.length) throw new Error('usage: npm run pilot -- compare <id> <run> <run> ...');
  console.log(`${writeComparison(id, runIds, value('title', 'models compared'))}/summary.md`);
  process.exit(0);
}

if (cmd === 'summary' || cmd === 'world') {
  if (!arg) throw new Error(`usage: npm run pilot -- ${cmd} <run>`);
  const { records, opts } = readRun(arg);
  if (cmd === 'summary') console.log(`${writeSummary(arg, records, opts)}/summary.md`);
  else console.log(Object.values(writeMeasuredWorld(arg, records)).join('\n'));
  process.exit(0);
}

console.log('Usage: npm run pilot -- selftest | calibrate [--dry-run | --stub] [options] | summary <run> | world <run>');
