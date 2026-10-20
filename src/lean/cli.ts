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
