// A live snapshot of an experiment, for the Live page on oso.network: `node scripts/live-snapshot.ts <id> [out.json]`.
// Reads lean/runs/<id>.plan.json and each run's action log while the runs go. Only what the checker
// decided goes out (targets and lemmas proved or not, money spent): no proofs, no model thinking.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { costOf, type Action, type CommunityOptions } from '../src/lean/community.ts';
import { EXPERIMENT_NAMES } from '../src/lean/names.ts';
import { osoLabel, osoParams } from '../src/lean/societies.ts';
import { AREAS, LEAN_DIR, loadTasks, PLAIN } from '../src/lean/tasks.ts';

const [id, out = 'live.json'] = process.argv.slice(2);
if (!id) { console.error('usage: node scripts/live-snapshot.ts <experiment id> [out.json]'); process.exit(1); }
const runs = join(LEAN_DIR, 'runs');
const plan = JSON.parse(readFileSync(join(runs, `${id}.plan.json`), 'utf8')) as { societies: string[]; repeats: number; startedAt: number };
const lines = (f: string) => (existsSync(f) ? readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)) : []);

// Money points for the line graph: mean targets proved by each setup once each run has spent that much.
const GRID = 40;
let problems: CommunityOptions['problems'] = 'main', cap = 0, first: CommunityOptions | null = null;
const setups = plan.societies.map((key) => {
  let opts: CommunityOptions | null = null;
  const tried: Record<string, Record<number, [number, number]>> = {};
  const reps = Array.from({ length: plan.repeats }, (_, k) => {
    const dir = join(runs, `${id}-r${k + 1}-${key}`);
    if (!existsSync(join(dir, 'options.json'))) return { rep: k + 1, status: 'waiting' as const, round: 0, spent: 0, targets: [] as string[], lemmas: 0, steps: [] as [number, number][], provedAt: {} as Record<string, number>, spentBy: [] as number[] };
    opts ??= JSON.parse(readFileSync(join(dir, 'options.json'), 'utf8')) as CommunityOptions;
    problems = opts.problems ?? 'main';
    cap = opts.budget * opts.agents.length;
    first ??= opts;
    const actions = lines(join(dir, 'actions.jsonl')) as Action[];
    let spent = 0;
    const targets: string[] = [], steps: [number, number][] = [[0, 0]];
    // For the round-by-round view: the round each target was first proved, money spent by the end of each round,
    // and every attempt at a target (round, accepted or not).
    const provedAt: Record<string, number> = {}, spentBy: number[] = [];
    for (const a of actions) {
      spent += costOf(a);
      spentBy[a.round] = spent;
      if (a.kind === 'target' && a.target) {
        if (a.ok && provedAt[a.target] === undefined) provedAt[a.target] = a.round;
        ((tried[a.target] ??= {})[a.round] ??= [0, 0])[a.ok ? 0 : 1]++;
      }
      if (a.kind === 'target' && a.ok && a.target && !a.reason?.includes('duplicate') && !targets.includes(a.target)) { targets.push(a.target); steps.push([spent, targets.length]); }
    }
    return {
      rep: k + 1, status: existsSync(join(dir, 'result.json')) ? 'done' as const : 'running' as const,
      round: Math.max(0, ...actions.map((a) => a.round)), spent, targets,
      lemmas: actions.filter((a) => a.kind === 'lemma' && a.ok).length, steps, provedAt,
      spentBy: Array.from({ length: spentBy.length }, (_, i) => Math.round(1e4 * (spentBy.slice(0, i + 1).filter((x) => x !== undefined).at(-1) ?? 0)) / 1e4),
    };
  });
  return { key, label: opts ? osoLabel(key, opts) : key, params: opts ? osoParams(opts) : '', reps, tried };
});

const at = (steps: [number, number][], money: number) => steps.filter(([m]) => m <= money).at(-1)?.[1] ?? 0;
const all = loadTasks(problems), tasks = all.filter((t) => t.posted);
// The problem's structure: every theorem in the reference proofs, by anonymous id (the hidden stepping stones keep
// no names), with what each one's reference proof uses. Posted targets are the ones with bounties.
const idOf = new Map(all.map((t) => [t.name, t.publicId]));
const dag = all.map((t) => ({ id: t.publicId, depth: t.depth, area: t.area, posted: !!t.posted, uses: t.uses.map((u) => idOf.get(u) ?? idOf.get(`OSO.${u}`)).filter(Boolean) }));
// The feed: each lab's checked results, and whose results a proof built on (the lab that first proved each one cited).
const built: Record<string, { on: number; scratch: number }> = Object.fromEntries(plan.societies.map((k) => [k, { on: 0, scratch: 0 }]));
const feed = plan.societies.flatMap((key) => Array.from({ length: plan.repeats }, (_, k) => {
  const author = new Map<string, number>();
  return (lines(join(runs, `${id}-r${k + 1}-${key}`, 'actions.jsonl')) as Action[])
    .filter((a) => a.kind === 'target' || a.kind === 'lemma')
    .map((a) => {
      const duplicate = !!a.reason?.includes('duplicate');
      const cites = [...new Set((a.ok ? a.uses ?? [] : []).map((u) => author.get(u.split('.').at(-1)!)).filter((l): l is number => l !== undefined && l !== a.agent))].map((l) => l + 1);
      if (a.ok && !duplicate) {
        if (a.entry && !author.has(a.entry)) author.set(a.entry, a.agent);
        if (cites.length) built[key].on++; else built[key].scratch++;
      }
      return { t: a.t, setup: key, run: k + 1, lab: a.agent + 1, kind: a.kind, item: a.kind === 'target' ? a.target : a.name, ok: a.ok, duplicate, cites };
    });
}).flat()).sort((a, b) => (b.t ?? 0) - (a.t ?? 0)).slice(0, 60);

// The graph runs to the most any run has spent so far (all the money once runs finish), so early progress is visible.
const reach = Math.min(cap, Math.max(cap / 400, ...setups.flatMap((s) => s.reps.map((r) => r.spent))));
const snapshot = {
  id, title: EXPERIMENT_NAMES[id] ?? id, updatedAt: Date.now(), startedAt: plan.startedAt,
  problems, moneyPerRun: cap,
  targets: tasks.map((t) => ({ id: t.publicId, depth: t.depth, bounty: 4 * 2 ** (t.depth - 1), area: t.area, text: PLAIN[t.publicId] ?? '' })),
  // Who the labs are and how a run goes, for the page's "About this run".
  about: first && {
    labs: first.agents.length, models: [...new Set(first.agents.map((m) => m.split('/').pop()!))], budget: first.budget,
    rounds: first.rounds, mayStop: first.mayStop !== false, repairs: first.repairs, hidden: all.length - tasks.length,
    areas: [...new Set(all.map((t) => t.area))].map((a) => AREAS[a]).filter(Boolean),
  },
  dag,
  setups: setups.map((s) => {
    const started = s.reps.filter((r) => r.status !== 'waiting');
    return {
      key: s.key, label: s.label, params: s.params,
      runs: { done: s.reps.filter((r) => r.status === 'done').length, running: s.reps.filter((r) => r.status === 'running').length, total: plan.repeats },
      // Line graph: mean over started runs of targets proved for the money spent, money as a share of a run's money.
      curve: started.length ? Array.from({ length: GRID + 1 }, (_, g) => { const m = reach * g / GRID; return [m, started.reduce((a, r) => a + at(r.steps, m), 0) / started.length]; }) : [],
      // How many runs proved each target.
      proved: Object.fromEntries(tasks.map((t) => [t.publicId, s.reps.filter((r) => r.targets.includes(t.publicId)).length])),
      reps: s.reps.map(({ steps: _, ...r }) => r),
      // Attempts at each target by round, over all runs: [accepted, not accepted].
      tried: s.tried,
    };
  }),
  feed,
  // Accepted new results, by setup (all its runs): how many cite another lab's result, and how many do not.
  built,
};
writeFileSync(out, JSON.stringify(snapshot) + '\n');
console.log(`${out}: ${setups.map((s) => `${s.key} ${s.reps.filter((r) => r.status !== 'waiting').length}/${plan.repeats} started`).join(', ')}`);
