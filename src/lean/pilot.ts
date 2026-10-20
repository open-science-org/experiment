// The calibration pilot: how hard is each theorem for a real agent?
// For every reference theorem, with the theorems it rests on as its library ("library"), and for every
// posted target with an empty library ("alone"), run a few attempts and record success, repairs, tokens
// and checking time. Transcripts contain proofs, so they stay in lean/runs/ (private); the summary in
// results/pilot/ uses only the anonymous ids of worlds/lean-reference.json.
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { RESULTS_DIR, ROOT, SPACES_DIR } from '../paths.ts';
import { attempt, systemPrompt, taskPrompt, type AttemptResult, type Chat, type ModelSettings } from './agent.ts';
import { libraryFor, referenceProof } from './selftest.ts';
import { LEAN_DIR, loadTasks, type Task } from './tasks.ts';

export type Condition = 'library' | 'alone';

export interface PilotOptions {
  attempts: number;
  repairs: number;
  concurrency: number;
  allowGrind: boolean;
  conditions: Condition[];
  /** Public ids or Lean names to run; all if empty. */
  only: string[];
  model: ModelSettings;
}

export interface Job { task: Task; condition: Condition; k: number }

export function jobs(tasks: Task[], opts: Pick<PilotOptions, 'attempts' | 'conditions' | 'only'>): Job[] {
  const chosen = opts.only.length ? tasks.filter((t) => opts.only.includes(t.publicId) || opts.only.includes(t.name)) : tasks;
  const out: Job[] = [];
  for (const condition of opts.conditions) {
    for (const task of chosen) {
      if (condition === 'alone' && !task.posted) continue;
      for (let k = 0; k < opts.attempts; k++) out.push({ task, condition, k });
    }
  }
  return out;
}

function library(job: Job, tasks: Task[]) {
  const lib = libraryFor(job.task, tasks);
  return job.condition === 'alone' ? lib.filter((l) => !tasks.some((t) => t.name === l.name)) : lib;
}

/** What a run would send: attempts, the most model calls, and a rough count of prompt tokens. */
export function estimate(opts: PilotOptions) {
  const tasks = loadTasks();
  const js = jobs(tasks, opts);
  const chars = js.reduce((a, j) => a + systemPrompt(opts.allowGrind).length + taskPrompt(j.task, library(j, tasks)).length, 0);
  return { attempts: js.length, maxCalls: js.length * (opts.repairs + 1), firstPromptTokens: Math.round(chars / 3.5) };
}

/** A stand-in agent that answers with the reference proof: tests the pipeline without a model. */
export function referenceChat(tasks: Task[]): Chat {
  return async (_system, messages) => {
    const first = String(messages[0].content);
    const task = tasks.find((t) => first.includes(`theorem attempt ${t.signature}\n`))!;
    const text = `\`\`\`lean\n${referenceProof(task)}\n\`\`\``;
    return { text, content: text, usage: { input: first.length / 4, output: text.length / 4, cacheRead: 0, cacheWrite: 0 }, stop: 'end_turn' };
  };
}

export interface Record_ {
  publicId: string; name: string; depth: number; area: string; posted: string; condition: Condition; k: number;
  ok: boolean; failure?: string; turns: number; uses: string[];
  usage: { input: number; output: number; cacheRead: number; cacheWrite: number; cost?: number };
  checkSeconds: number; seconds: number;
  transcript: AttemptResult['turns'];
}

export async function runPilot(opts: PilotOptions, chat: Chat, runId: string, log = console.log): Promise<Record_[]> {
  const tasks = loadTasks();
  const queue = jobs(tasks, opts);
  const total = queue.length;
  const privateDir = join(LEAN_DIR, 'runs', runId);
  mkdirSync(privateDir, { recursive: true });
  writeFileSync(join(privateDir, 'options.json'), JSON.stringify(opts, null, 1));
  const file = join(privateDir, 'attempts.jsonl');
  // Resume: skip attempts already recorded.
  const done = existsSync(file) ? readFileSync(file, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l) as Record_) : [];
  const key = (j: { name: string; condition: string; k: number }) => `${j.name}|${j.condition}|${j.k}`;
  const seen = new Set(done.map(key));
  const todo = queue.filter((j) => !seen.has(key({ name: j.task.name, condition: j.condition, k: j.k })));
  const records = [...done];
  let finished = done.length;
  await Promise.all(Array.from({ length: opts.concurrency }, async () => {
    for (let job = todo.shift(); job; job = todo.shift()) {
      const t0 = Date.now();
      let result: AttemptResult;
      try {
        result = await attempt(job.task, library(job, tasks), chat, { repairs: opts.repairs, allowGrind: opts.allowGrind });
      } catch (e) {
        log(`  ${job.task.publicId} ${job.condition} #${job.k + 1}: error, will retry on resume: ${(e as Error).message}`);
        continue;
      }
      const sum = (f: (u: Record_['usage']) => number) => result.turns.reduce((a, t) => a + f(t.usage), 0);
      const rec: Record_ = {
        publicId: job.task.publicId, name: job.task.name, depth: job.task.depth, area: job.task.area, posted: job.task.posted,
        condition: job.condition, k: job.k, ok: result.ok, failure: result.failure, turns: result.turns.length, uses: result.uses,
        usage: { input: sum((u) => u.input), output: sum((u) => u.output), cacheRead: sum((u) => u.cacheRead), cacheWrite: sum((u) => u.cacheWrite), cost: sum((u) => u.cost ?? 0) },
        checkSeconds: result.turns.reduce((a, t) => a + (t.check?.seconds ?? 0), 0), seconds: (Date.now() - t0) / 1000,
        transcript: result.turns,
      };
      appendFileSync(file, JSON.stringify(rec) + '\n');
      records.push(rec);
      log(`  [${++finished}/${total}] ${rec.publicId.padEnd(5)} ${rec.condition.padEnd(7)} #${rec.k + 1}: ${rec.ok ? `proved in ${rec.turns} turn${rec.turns > 1 ? 's' : ''}` : `failed (${rec.failure})`}`);
    }
  }));
  return records;
}

/** Laplace-smoothed success chance per attempt. */
const pHat = (s: number, n: number) => (s + 0.5) / (n + 1);

/** Public, anonymized summary: results/pilot/<runId>/{summary.md, data.json}. */
export function writeSummary(runId: string, records: Record_[], opts: PilotOptions, note = ''): string {
  const dir = join(RESULTS_DIR, 'pilot', runId);
  mkdirSync(dir, { recursive: true });
  const groups = new Map<string, Record_[]>();
  for (const r of records) groups.set(`${r.publicId}|${r.condition}`, [...(groups.get(`${r.publicId}|${r.condition}`) ?? []), r]);
  const per = [...groups.values()].map((rs) => ({
    id: rs[0].publicId, depth: rs[0].depth, area: rs[0].area, posted: rs[0].posted, condition: rs[0].condition,
    attempts: rs.length, proved: rs.filter((r) => r.ok).length,
    meanTurns: rs.reduce((a, r) => a + r.turns, 0) / rs.length,
    tokens: rs.reduce((a, r) => a + r.usage.input + r.usage.output + r.usage.cacheRead + r.usage.cacheWrite, 0) / rs.length,
    outputTokens: rs.reduce((a, r) => a + r.usage.output, 0) / rs.length,
  })).sort((a, b) => a.condition.localeCompare(b.condition) || a.depth - b.depth || a.id.localeCompare(b.id));
  const byDepth = [...new Set(per.filter((p) => p.condition === 'library').map((p) => p.depth))].sort((a, b) => a - b).map((d) => {
    const ps = per.filter((p) => p.condition === 'library' && p.depth === d);
    const n = ps.reduce((a, p) => a + p.attempts, 0), s = ps.reduce((a, p) => a + p.proved, 0);
    return { depth: d, theorems: ps.length, attempts: n, proved: s, rate: s / n, tokens: ps.reduce((a, p) => a + p.tokens * p.attempts, 0) / n };
  });
  const totals = records.reduce((a, r) => ({ input: a.input + r.usage.input, output: a.output + r.usage.output, cacheRead: a.cacheRead + r.usage.cacheRead, cacheWrite: a.cacheWrite + r.usage.cacheWrite, cost: a.cost + (r.usage.cost ?? 0) }), { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, cost: 0 });
  const pct = (x: number) => `${Math.round(x * 100)}%`;
  const k = (x: number) => `${(x / 1000).toFixed(1)}k`;
  const table = (rows: Record<string, unknown>[]) => {
    const cols = Object.keys(rows[0] ?? {});
    return [`| ${cols.join(' | ')} |`, `| ${cols.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${cols.map((c) => r[c]).join(' | ')} |`)].join('\n');
  };
  const alone = per.filter((p) => p.condition === 'alone');
  const md = `# Lean pilot: ${runId}

How hard each theorem of the Lean problem set is for a real agent. ${note}

- **Agent:** \`${opts.model.model}\` via ${opts.model.provider ?? 'anthropic'}, reasoning effort ${opts.model.effort}. One attempt is a first proof plus up to ${opts.repairs} repairs on Lean's error messages.
- **Rules:** Lean 4.35 core only; \`grind\` ${opts.allowGrind ? 'allowed' : 'banned'}; the checker accepts a proof only if it uses nothing beyond the library given and Lean's standard axioms.
- **Conditions:** *library*: the theorems it rests on in the reference tree are given; *alone*: posted targets with an empty library.
- **Attempts:** ${records.length}; tokens in ${k(totals.input)} (plus ${k(totals.cacheRead)} cached), out ${k(totals.output)}${totals.cost ? `; cost $${totals.cost.toFixed(2)} ($${(totals.cost / Math.max(1, records.length)).toFixed(3)} per attempt)` : ''}.

Theorem ids are the anonymous ids of [worlds/lean-reference.json](../../../worlds/lean-reference.json); statements and proofs are private until the experiment.

## Success by depth (library)

${byDepth.length ? table(byDepth.map((d) => ({ depth: d.depth, theorems: d.theorems, attempts: d.attempts, proved: d.proved, 'success per attempt': pct(d.rate), 'tokens per attempt': k(d.tokens) }))) : 'No library attempts.'}

## Do targets need their lemmas?

${alone.length ? table(alone.map((p) => {
    const lib = per.find((q) => q.id === p.id && q.condition === 'library');
    return { target: p.id, depth: p.depth, 'alone': `${p.proved}/${p.attempts}`, 'with library': lib ? `${lib.proved}/${lib.attempts}` : '–' };
  })) : 'Not run.'}

A target proved alone in most attempts is too easy: its lemmas are not needed.

## Every theorem

${table(per.map((p) => ({ id: p.id, depth: p.depth, area: p.area, condition: p.condition, proved: `${p.proved}/${p.attempts}`, 'mean turns': p.meanTurns.toFixed(1), 'tokens per attempt': k(p.tokens) })))}
`;
  writeFileSync(join(dir, 'summary.md'), md);
  writeFileSync(join(dir, 'data.json'), JSON.stringify({ runId, options: opts, totals, byDepth, theorems: per }, null, 1) + '\n');
  return dir;
}

/**
 * The measured world: the reference tree with each theorem's measured success chance per attempt
 * (library condition), as worlds/lean-measured.json, and a problem space that uses it.
 */
export function writeMeasuredWorld(runId: string, records: Record_[]): { world: string; space: string } {
  const ref = JSON.parse(readFileSync(join(ROOT, 'worlds', 'lean-reference.json'), 'utf8')) as { nodes: { id: string; p?: number }[] };
  const lib = records.filter((r) => r.condition === 'library');
  const nodes = ref.nodes.map((n) => {
    const rs = lib.filter((r) => r.publicId === n.id);
    return rs.length ? { ...n, p: Number(pHat(rs.filter((r) => r.ok).length, rs.length).toFixed(3)) } : n;
  });
  const world = join(ROOT, 'worlds', 'lean-measured.json');
  writeFileSync(world, JSON.stringify({ source: `Lean problem set, success chances measured in pilot ${runId} (anonymized)`, nodes }, null, 1) + '\n');
  const space = join(SPACES_DIR, 'lean-measured.yaml');
  writeFileSync(space, `id: lean-measured
title: The Lean problem set, measured
summary: The Lean problem set's reference tree, with each theorem's success chance measured with a real agent.
description: >-
  The same 42 theorems and 8 posted targets as the Lean problem set, but each theorem's chance of being
  proved in one attempt (a proof plus a few repairs on Lean's errors) is measured, not assumed: a real
  agent attempted it with the theorems it rests on as its library (pilot ${runId}).
glossary:
  result: a theorem, with its proof
  target: a posted theorem with a bounty
  attempt: one try at writing a proof that Lean accepts, with a few repairs
  area: a mathematical topic
areas: [A sequence, B sorting, C matrices, across areas]
scenarioFile: lean-tree
scenario:
  world: { kind: file, path: worlds/lean-measured.json, areas: 4 }
notes: >-
  Success chances come from a few attempts per theorem (results/pilot/${runId}), smoothed as
  (proved + 0.5) / (attempts + 1); agents' choices, sharing and costs are still the simulator's.
source: generated by npm run pilot -- world ${runId}
`);
  return { world, space };
}

export function readRun(runId: string): { records: Record_[]; opts: PilotOptions } {
  const dir = join(LEAN_DIR, 'runs', runId);
  const records = readFileSync(join(dir, 'attempts.jsonl'), 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l) as Record_);
  return { records, opts: JSON.parse(readFileSync(join(dir, 'options.json'), 'utf8')) as PilotOptions };
}
