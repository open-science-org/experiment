// A live snapshot of an experiment, for the Live page on oso.network: `node scripts/live-snapshot.ts <id> [out.json]`.
// Reads lean/runs/<id>.plan.json and each run's action log while the runs go. Only what the checker
// decided goes out (targets and lemmas proved or not, money spent): no proofs, no model thinking.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { costOf, type Action, type CommunityOptions } from '../src/lean/community.ts';
import { ROOT } from '../src/paths.ts';
import { EXPERIMENT_ANSWERS, EXPERIMENT_NAMES, EXPERIMENT_QUESTIONS } from '../src/lean/names.ts';

import { marked } from 'marked';

// The experiment's write-up in docs/ai-agent-results.md: the section that opens with a link to its result folder.
// As HTML for the Live page, links pointed at GitHub. Null until it is written up.
function resultsSection(id: string): { heading: string; html: string } | null {
  const doc = join(ROOT, 'docs', 'ai-agent-results.md');
  if (!existsSync(doc)) return null;
  const sections = readFileSync(doc, 'utf8').split(/^(?=## )/m);
  const sec = sections.find((x) => x.split('\n').slice(1).find((l) => l.trim())?.includes(`(../results/community/${id}/summary.md)`));
  if (!sec) return null;
  const [head, ...body] = sec.split('\n');
  const gh = 'https://github.com/open-science-org/experiment/blob/master/';
  const md = body.join('\n').trim().replace(/\]\((?!https?:|#)([^)]+)\)/g, (_, u: string) => `](${gh}${u.startsWith('../') ? u.slice(3) : 'docs/' + u})`)
    .replace(/\]\(#([^)]+)\)/g, (_, a: string) => `](${gh}docs/ai-agent-results.md#${a})`);
  return { heading: head.replace(/^##\s*/, '').replace(/^[0-9]+[a-z]?\.\s*/, ''), html: marked.parse(md, { async: false }) as string };
}
import { osoLabel, osoParams } from '../src/lean/societies.ts';

/** A lemma's statement with its variable names replaced by position, so `(n : N) : n + 0 = n` and `(m : N) : m + 0 = m` match. */
function statementKey(sig: string) {
  const s = sig.replace(/\s+/g, ' ').trim(), names = new Map<string, string>();
  // Names bound by binders ((x y : T), {x : T}, [h : T]) and by ∀, ∃, fun, λ.
  for (const m of s.matchAll(/[({[]\s*([^():{}\[\]]+?)\s*:(?!=)/g)) for (const n of m[1].split(' ')) if (/^[\p{L}_][\p{L}\p{N}_'.]*$/u.test(n)) names.set(n, '');
  for (const m of s.matchAll(/(?:∀|∃|fun|λ)\s+([^,:=>]+?)\s*(?:,|:|=>)/g)) for (const n of m[1].split(/[\s()]+/)) if (/^[\p{L}_][\p{L}\p{N}_']*$/u.test(n)) names.set(n, '');
  let k = 0;
  for (const n of names.keys()) names.set(n, `v${++k}`);
  return s.replace(/[\p{L}_][\p{L}\p{N}_'.]*/gu, (w) => names.get(w) ?? w);
}
import { AREAS, LEAN_DIR, loadTasks, PLAIN } from '../src/lean/tasks.ts';

const [id, out = 'live.json'] = process.argv.slice(2);
if (!id) { console.error('usage: node scripts/live-snapshot.ts <experiment id> [out.json]'); process.exit(1); }
const runs = join(LEAN_DIR, 'runs');
const plan = JSON.parse(readFileSync(join(runs, `${id}.plan.json`), 'utf8')) as { societies: string[]; repeats: number; startedAt: number; compare?: { experiment: string; setup: string }[] };
// The setups drawn: this experiment's, then any earlier runs it names to compare against (`compare` in the plan),
// read from that experiment's run folders. Same charts, same scales, so the setups can be compared.
const sources = [
  ...plan.societies.map((key) => ({ key, from: id, repeats: plan.repeats, earlier: false })),
  ...(plan.compare ?? []).map((c) => ({ key: c.setup, from: c.experiment, earlier: true,
    repeats: (JSON.parse(readFileSync(join(runs, `${c.experiment}.plan.json`), 'utf8')) as { repeats: number }).repeats })),
];
const lines = (f: string) => (existsSync(f) ? readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)) : []);

// Money points for the line graph: mean targets proved by each setup once each run has spent that much.
const GRID = 40;
let problems: CommunityOptions['problems'] = 'main', cap = 0, first: CommunityOptions | null = null;
const setups = sources.map(({ key, from, repeats, earlier }) => {
  let opts: CommunityOptions | null = null;
  const tried: Record<string, Record<number, [number, number]>> = {};
  const reps = Array.from({ length: repeats }, (_, k) => {
    const dir = join(runs, `${from}-r${k + 1}-${key}`);
    if (!existsSync(join(dir, 'options.json'))) return { rep: k + 1, status: 'waiting' as const, round: 0, spent: 0, targets: [] as string[], lemmas: 0, steps: [] as [number, number][], provedAt: {} as Record<string, number>, spentBy: [] as number[] };
    opts ??= JSON.parse(readFileSync(join(dir, 'options.json'), 'utf8')) as CommunityOptions;
    problems = opts.problems ?? 'main';
    cap = opts.budget * opts.agents.length;
    first ??= opts;
    const actions = lines(join(dir, 'actions.jsonl')) as Action[];
    // Lab lemma -> the hidden steps it gives (scripts/match-steps.ts; empty until it has run).
    // Steps given by several lab lemmas together (second pass): reached when the last of them was proved.
    const m = existsSync(join(dir, 'matches.json')) ? (JSON.parse(readFileSync(join(dir, 'matches.json'), 'utf8')) as { covers: Record<string, string[]>; combos?: Record<string, string[]> }) : null;
    const covers = m?.covers ?? {}, combos = m?.combos ?? {};
    const inCombo = new Set(Object.values(combos).flat());
    let spent = 0;
    const targets: string[] = [], steps: [number, number][] = [[0, 0]], lsteps: [number, number][] = [[0, 0]];
    // For the round-by-round view: the round each target was first proved, money spent by the end of each round,
    // and every attempt at a target (round, accepted or not).
    const provedAt: Record<string, number> = {}, spentBy: number[] = [];
    const seen = new Set<string>();
    for (const a of actions) {
      spent += costOf(a);
      spentBy[a.round] = spent;
      if (a.kind === 'target' && a.target) {
        if (a.ok && provedAt[a.target] === undefined) provedAt[a.target] = a.round;
        ((tried[a.target] ??= {})[a.round] ??= [0, 0])[a.ok ? 0 : 1]++;
      }
      // Unique lemmas only: a statement any lab in the run proved before (variables renamed aside) counts once.
      if (a.kind === 'lemma' && a.ok && a.entry && a.signature && !seen.has(statementKey(a.signature))) { seen.add(statementKey(a.signature)); lsteps.push([spent, lsteps.length]); }
      if (a.kind === 'target' && a.ok && a.target && !a.reason?.includes('duplicate') && !targets.includes(a.target)) { targets.push(a.target); steps.push([spent, targets.length]); }
    }
    return {
      rep: k + 1, status: existsSync(join(dir, 'result.json')) ? 'done' as const : 'running' as const,
      round: Math.max(0, ...actions.map((a) => a.round)), spent, targets,
      lemmas: actions.filter((a) => a.kind === 'lemma' && a.ok).length, steps, lsteps, provedAt,
      // What the labs built: every new result Lean accepted, who proved it and when, and the earlier results its
      // proof cites (read from Lean, so exact). Statements, not proofs.
      // Hidden steps the labs have proved (scripts/match-steps.ts): step name -> [round, lab, lab's lemma], earliest.
      covered: (() => {
        const out: Record<string, [number, number, string]> = {};
        for (const a of actions) if (a.ok && a.entry) for (const step of covers[a.entry] ?? []) if (!out[step] || out[step][0] > a.round) out[step] = [a.round, a.agent + 1, a.entry];
        const first = new Map<string, Action>();
        for (const a of actions) if (a.ok && a.entry && !first.has(a.entry)) first.set(a.entry, a);
        for (const [step, used] of Object.entries(combos)) {
          const last = used.map((e) => first.get(e)).filter((a): a is Action => !!a).sort((x, y) => y.round - x.round)[0];
          if (last && !out[step]) out[step] = [last.round, last.agent + 1, last.entry!];
        }
        return out;
      })(),
      library: (() => {
        const got = actions.filter((a) => a.ok && a.entry);
        const names = new Set(got.map((a) => a.entry!));
        return got.map((a) => ({ n: a.entry!, lab: a.agent + 1, round: a.round, target: a.kind === 'target' ? a.target : undefined, s: a.signature, onMap: !!covers[a.entry!]?.length || inCombo.has(a.entry!),
          uses: [...new Set((a.uses ?? []).map((u) => u.replace(/^OSO\./, '')).filter((u) => names.has(u) && u !== a.entry))] }));
      })(),
      spentBy: Array.from({ length: spentBy.length }, (_, i) => Math.round(1e4 * (spentBy.slice(0, i + 1).filter((x) => x !== undefined).at(-1) ?? 0)) / 1e4),
    };
  });
  return { key, from, earlier, repeats, label: (opts ? osoLabel(key, opts) : key) + (earlier ? ` (earlier run: ${from})` : ''), params: opts ? osoParams(opts) : '', reps, tried };
});

const at = (steps: [number, number][], money: number) => steps.filter(([m]) => m <= money).at(-1)?.[1] ?? 0;
const all = loadTasks(problems), tasks = all.filter((t) => t.posted);
// The problem's structure: every theorem in the reference proofs, by anonymous id (the hidden stepping stones keep
// no names), with what each one's reference proof uses. Posted targets are the ones with bounties.
const idOf = new Map(all.map((t) => [t.name, t.publicId]));
const dag = all.map((t) => ({ id: t.publicId, depth: t.depth, area: t.area, posted: !!t.posted, uses: t.uses.map((u) => idOf.get(u) ?? idOf.get(`OSO.${u}`)).filter(Boolean) }));
// The feed: each lab's checked results, and whose results a proof built on (the lab that first proved each one cited).
const built: Record<string, { on: number; scratch: number }> = Object.fromEntries(sources.map((s) => [s.key, { on: 0, scratch: 0 }]));
const feed = sources.flatMap(({ key, from, repeats }) => Array.from({ length: repeats }, (_, k) => {
  const author = new Map<string, number>();
  return (lines(join(runs, `${from}-r${k + 1}-${key}`, 'actions.jsonl')) as Action[])
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
  id, title: EXPERIMENT_NAMES[id] ?? id, question: EXPERIMENT_QUESTIONS[id] ?? null, answer: EXPERIMENT_ANSWERS[id] ?? null, results: resultsSection(id), updatedAt: Date.now(), startedAt: plan.startedAt,
  problems, moneyPerRun: cap,
  targets: tasks.map((t) => ({ id: t.publicId, depth: t.depth, bounty: 4 * 2 ** (t.depth - 1), area: t.area, text: PLAIN[t.publicId] ?? '', statement: t.signature.replace(/\s+/g, ' ').trim() })),
  // Who the labs are and how a run goes, for the page's "About this run".
  about: first && {
    labs: first.agents.length, models: [...new Set(first.agents.map((m) => m.split('/').pop()!))], budget: first.budget,
    rounds: first.rounds, mayStop: first.mayStop !== false, repairs: first.repairs, hidden: all.length - tasks.length,
    areas: [...new Set(all.map((t) => t.area))].map((a) => AREAS[a]).filter(Boolean),
  },
  dag,
  setups: setups.map((s) => {
    const started = s.reps.filter((r) => r.status !== 'waiting');
    // Each setup's lines stop at the most one of its runs has spent, so a setup that has spent less is not drawn
    // as if it had spent more and stalled.
    const upTo = Math.max(0, ...started.map((r) => r.spent)) * (1 + 1e-9);
    // The grid, then one last point at the setup's own spend, so a proof just before the line ends still shows.
    const own = upTo / (1 + 1e-9);
    const grid = (f: (m: number) => number) => [...Array.from({ length: GRID + 1 }, (_, g) => reach * g / GRID).filter((m, g) => g === 0 || m < own), ...(own > 0 ? [own] : [])].map((m) => [m, f(m)]);
    return {
      key: s.key, label: s.label, params: s.params, from: s.from, earlier: s.earlier,
      runs: { done: s.reps.filter((r) => r.status === 'done').length, running: s.reps.filter((r) => r.status === 'running').length, total: s.repeats },
      // Line graph: mean over started runs of targets proved for the money spent, money as a share of a run's money.
      curve: started.length ? grid((m) => started.reduce((a, r) => a + at(r.steps, m), 0) / started.length) : [],
      // The same for new lemmas: the page shows it when a run has one target, so the climb toward it shows.
      lemmaCurve: started.length ? grid((m) => started.reduce((a, r) => a + at(r.lsteps, m), 0) / started.length) : [],
      // How many runs proved each target.
      proved: Object.fromEntries(tasks.map((t) => [t.publicId, s.reps.filter((r) => r.targets.includes(t.publicId)).length])),
      // The library one run built (the first started run of this setup), for the page's graph of it.
      library: started[0]?.library ?? [],
      reps: s.reps.map(({ steps: _, lsteps: __, library: ___, covered, ...r }) => ({ ...r, covered: Object.fromEntries(Object.entries(covered ?? {}).flatMap(([k, v]) => (idOf.has(k) ? [[idOf.get(k)!, v]] : []))) })),
      // Attempts at each target by round, over all runs: [accepted, not accepted].
      tried: s.tried,
    };
  }),
  feed,
  // Accepted new results, by setup (all its runs): how many cite another lab's result, and how many do not.
  built,
};
writeFileSync(out, JSON.stringify(snapshot) + '\n');
console.log(`${out}: ${setups.map((s) => `${s.key}${s.earlier ? ` (${s.from})` : ''} ${s.reps.filter((r) => r.status !== 'waiting').length}/${s.repeats} started`).join(', ')}`);
