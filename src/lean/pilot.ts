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
import { barChart, lineChart } from '../report/figures.ts';
import { writeCard } from '../card.ts';
import { existsSync as exists } from 'node:fs';

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
  /** When the attempt started and ended (ms since 1970), for playback. */
  startedAt?: number;
  endedAt?: number;
}

export async function runPilot(opts: PilotOptions, chat: Chat, runId: string, log = console.log): Promise<Record_[]> {
  const tasks = loadTasks();
  const queue = jobs(tasks, opts);
  const total = queue.length;
  const privateDir = join(LEAN_DIR, 'runs', runId);
  mkdirSync(privateDir, { recursive: true });
  writeFileSync(join(privateDir, 'options.json'), JSON.stringify(opts, null, 1));
  const file = join(privateDir, 'attempts.jsonl');
  // Live events for the viewer: when each attempt starts, each turn's outcome, and when it ends.
  const eventsFile = join(privateDir, 'events.jsonl');
  const event = (e: Record<string, unknown>) => appendFileSync(eventsFile, JSON.stringify({ t: Date.now(), ...e }) + '\n');
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
      const who = { id: job.task.publicId, condition: job.condition, k: job.k };
      event({ kind: 'start', ...who });
      let result: AttemptResult;
      try {
        let n = 0;
        result = await attempt(job.task, library(job, tasks), chat, {
          repairs: opts.repairs, allowGrind: opts.allowGrind,
          onTurn: (turn) => event({ kind: 'turn', ...who, turn: ++n, ok: turn.check?.ok ?? false, stop: turn.stop, cost: turn.usage.cost ?? 0, errors: turn.check?.errors.length ?? 0 }),
        });
      } catch (e) {
        event({ kind: 'error', ...who, message: (e as Error).message.slice(0, 300) });
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
        startedAt: t0, endedAt: Date.now(),
      };
      appendFileSync(file, JSON.stringify(rec) + '\n');
      event({ kind: 'done', ...who, ok: rec.ok, turns: rec.turns, cost: rec.usage.cost ?? 0 });
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

## Success by level (library)

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
  idea: a theorem, with its proof
  target: a posted theorem with a bounty
  attempt: one attempt at writing a proof that Lean accepts, with a few repairs
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

/** Several runs side by side (one per model): results/pilot/<id>/summary.md. */
export function writeComparison(id: string, runIds: string[], title: string): string {
  const runs = runIds.map((r) => ({ runId: r, ...readRun(r) }));
  const pct = (x: number) => `${Math.round(x * 100)}%`;
  const money = (x: number) => `$${x.toFixed(x < 0.1 ? 3 : 2)}`;
  const table = (rows: Record<string, unknown>[]) => {
    const cols = Object.keys(rows[0] ?? {});
    return [`| ${cols.join(' | ')} |`, `| ${cols.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${cols.map((c) => r[c]).join(' | ')} |`)].join('\n');
  };
  const stat = (rs: Record_[]) => ({ n: rs.length, ok: rs.filter((r) => r.ok).length, cost: rs.reduce((a, r) => a + (r.usage.cost ?? 0), 0) / Math.max(1, rs.length), turns: rs.reduce((a, r) => a + r.turns, 0) / Math.max(1, rs.length) });
  const models = runs.map((r) => r.opts.model.model);
  const overall = runs.map((r) => {
    const lib = stat(r.records.filter((x) => x.condition === 'library'));
    const alone = stat(r.records.filter((x) => x.condition === 'alone'));
    const okCost = (c: Condition) => { const rs = r.records.filter((x) => x.condition === c && x.ok); return rs.length ? rs.reduce((a, x) => a + (x.usage.cost ?? 0), 0) / rs.length : NaN; };
    return {
      model: `\`${r.opts.model.model}\``,
      'proved with library': `${lib.ok}/${lib.n} (${pct(lib.ok / Math.max(1, lib.n))})`,
      'proved alone': `${alone.ok}/${alone.n} (${pct(alone.ok / Math.max(1, alone.n))})`,
      'cost per attempt, library': money(lib.cost),
      'cost per attempt, alone': money(alone.cost),
      'cost per proof, library / alone': `${Number.isFinite(okCost('library')) ? money(okCost('library')) : '–'} / ${Number.isFinite(okCost('alone')) ? money(okCost('alone')) : '–'}`,
      'total cost': money(r.records.reduce((a, x) => a + (x.usage.cost ?? 0), 0)),
    };
  });
  const ids = [...new Set(runs.flatMap((r) => r.records.map((x) => x.publicId)))];
  const depth = new Map(runs.flatMap((r) => r.records.map((x) => [x.publicId, x.depth] as const)));
  ids.sort((a, b) => depth.get(a)! - depth.get(b)! || a.localeCompare(b));
  const cell = (rs: Record_[]) => (rs.length ? `${rs.filter((x) => x.ok).length}/${rs.length}` : '–');
  const perTarget = ids.map((t) => ({
    target: t, depth: depth.get(t),
    ...Object.fromEntries(runs.map((r, i) => [models[i].split('/').pop()!,
      `${cell(r.records.filter((x) => x.publicId === t && x.condition === 'alone'))} alone · ${cell(r.records.filter((x) => x.publicId === t && x.condition === 'library'))} with`])),
  }));
  // The headline, computed from the data: per model, success and cost with and without lemmas, and
  // the targets the lemmas made reachable (proved with them, never alone).
  const models_ = runs.map((r) => {
    const recs = r.records.filter((x) => x.posted);
    const lib = recs.filter((x) => x.condition === 'library'), alone = recs.filter((x) => x.condition === 'alone');
    const okCost = (rs: Record_[]) => { const ok = rs.filter((x) => x.ok); return ok.length ? ok.reduce((a, x) => a + (x.usage.cost ?? 0), 0) / ok.length : null; };
    // Tokens do not depend on which provider served a call (prices differ between providers).
    const okTokens = (rs: Record_[]) => { const ok = rs.filter((x) => x.ok); return ok.length ? ok.reduce((a, x) => a + x.usage.output, 0) / ok.length : null; };
    const tids = [...new Set(recs.map((x) => x.publicId))];
    const needs = tids.filter((t) => {
      const a = alone.filter((x) => x.publicId === t), l = lib.filter((x) => x.publicId === t);
      return a.length > 0 && !a.some((x) => x.ok) && l.some((x) => x.ok);
    });
    const missing = tids.filter((t) => !alone.some((x) => x.publicId === t));
    return {
      model: r.opts.model.model, runId: r.runId,
      library: { proved: lib.filter((x) => x.ok).length, attempts: lib.length, costPerProof: okCost(lib), tokensPerProof: okTokens(lib) },
      alone: { proved: alone.filter((x) => x.ok).length, attempts: alone.length, costPerProof: okCost(alone), tokensPerProof: okTokens(alone) },
      needsLemmas: needs.sort((a, b) => depth.get(a)! - depth.get(b)!), missingAlone: missing,
      cost: r.records.reduce((a, x) => a + (x.usage.cost ?? 0), 0),
    };
  });
  const rate = (x: { proved: number; attempts: number }) => (x.attempts ? x.proved / x.attempts : NaN);
  const allAlone = models_.filter((m) => m.alone.attempts > 0 && m.alone.proved === m.alone.attempts);
  const helped = models_.filter((m) => m.needsLemmas.length);
  const savings = models_.filter((m) => m.library.tokensPerProof && m.alone.tokensPerProof && m.alone.attempts >= 4).map((m) => m.alone.tokensPerProof! / m.library.tokensPerProof!);
  const cheapest = [...models_].filter((m) => m.library.costPerProof !== null).sort((a, b) => a.library.costPerProof! - b.library.costPerProof!)[0];
  const short = (m: string) => m.split('/').pop()!;
  const headline = [
    `**Lemmas made targets reachable for ${helped.length} of ${models_.length} models.** ${helped.length ? helped.map((m) => `${short(m.model)}: ${m.needsLemmas.join(', ')}`).join('; ') + ' were proved with their lemmas but never alone.' : ''}`.trim(),
    allAlone.length ? `**${allAlone.map((m) => short(m.model)).join(' and ')} proved every target alone,** so for ${allAlone.length > 1 ? 'them' : 'it'} the lemmas save cost but are not needed.` : '',
    savings.length ? `**With the lemmas, a proof took ${Math.min(...savings).toFixed(1)} to ${Math.max(...savings).toFixed(1)} times fewer output tokens** than without, across models (tokens, not dollars: OpenRouter sends a model's calls to providers with different prices).` : '',
    cheapest ? `**Cheapest with lemmas: ${short(cheapest.model)},** at $${cheapest.library.costPerProof!.toFixed(3)} per proof (${Math.round(100 * rate(cheapest.library))}% of attempts proved).` : '',
  ].filter(Boolean);
  // Progress for the money: targets proved as each model spends, working up the tree (by depth),
  // alone and with the lemmas. Lemmas' own cost is not counted: the panel attempted only targets.
  const dir = join(RESULTS_DIR, 'pilot', id);
  mkdirSync(join(dir, 'figures'), { recursive: true });
  const curves = models_.map((m) => {
    const recs = runs.find((r) => r.runId === m.runId)!.records.filter((x) => x.posted);
    const curve = (cond: Condition) => {
      const rs = recs.filter((x) => x.condition === cond).sort((a, b) => a.depth - b.depth || a.publicId.localeCompare(b.publicId) || a.k - b.k);
      const proved = new Set<string>();
      let spent = 0;
      const pts: [number, number][] = [[0, 0]];
      for (const x of rs) { spent += x.usage.cost ?? 0; if (x.ok) proved.add(x.publicId); pts.push([spent, proved.size]); }
      return pts;
    };
    const lib = curve('library'), alone = curve('alone');
    const T = new Set(recs.map((x) => x.publicId)).size;
    const maxX = Math.max(lib.at(-1)![0], alone.at(-1)![0], 1e-6);
    const nice = (x: number) => { const m10 = 10 ** Math.floor(Math.log10(x)); return [1, 2, 2.5, 5, 10].map((k) => k * m10).find((v) => v >= x)!; };
    const top = nice(maxX);
    const file = `figures/progress-${short(m.model).replace(/[^\w.-]/g, '-')}.svg`;
    writeFileSync(join(dir, file), lineChart({
      title: `${short(m.model)}: targets proved for the money`,
      subtitle: 'Cumulative, working up the tree. The lemmas\' own cost is not counted.',
      xLabel: 'Dollars spent', yLabel: 'Targets proved',
      series: [{ name: 'With lemmas', slot: 2, points: lib }, { name: 'Alone', slot: 1, points: alone }],
      x: [0, top], y: [0, T], xTicks: [0, top / 4, top / 2, (3 * top) / 4, top], yTicks: Array.from({ length: T + 1 }, (_, i) => i).filter((i) => T <= 8 || i % 2 === 0),
      format: { x: (v) => `$${Number.isInteger(v) ? v : v.toFixed(2)}`, y: (v) => String(Math.round(v)) },
    }));
    return { model: m.model, file, library: lib, alone, targets: T };
  });
  const r0 = runs[0].opts;
  const md = `# Lean pilot: ${title}

## Headline

${headline.map((h) => `- ${h}`).join('\n')}
${models_.some((m) => m.missingAlone.length) ? `\n*Missing: ${models_.filter((m) => m.missingAlone.length).map((m) => `${short(m.model)} alone on ${m.missingAlone.join(', ')}`).join('; ')} (see the notes).*\n` : ''}
Each model attempted every posted target alone (no library) and with the theorems it rests on (library), ${r0.attempts} attempts each. One attempt is a proof plus up to ${r0.repairs} repairs on Lean's errors; reasoning effort ${r0.model.effort}; \`grind\` ${r0.allowGrind ? 'allowed' : 'banned'}. All models were called through OpenRouter, which reports each call's cost.

## Progress for the money

How many targets each model proved as it spent, working up the tree from the shallowest target, alone (as in traditional research, where each prover builds everything itself) and with the lemmas each target rests on (as in OSO, where they are shared). **The lemmas' own cost is not counted**: this panel attempted only the targets, so the "with lemmas" line shows the saving for a prover who finds the lemmas already published, not the community's whole bill. Dollar costs depend on which provider served each call (see the notes).

${curves.map((c) => `![${short(c.model)}](${c.file})`).join('\n')}

## By model

${table(overall)}

## By target: proved alone · proved with library

${table(perTarget)}

A target a model proves alone does not need its lemmas, for that model: shared lemmas then save cost, but do not make the target reachable. Ids are the anonymous ids of [worlds/lean-reference.json](../../../worlds/lean-reference.json). Runs: ${runIds.map((r) => `[${r}](../${r}/summary.md)`).join(', ')}.
`;
  writeFileSync(join(dir, 'figures', 'models.svg'), barChart({
    title: 'Targets solved, with help and alone (share of attempts)',
    bars: models_.flatMap((m) => [
      { label: `${short(m.model)}, with help`, value: m.library.attempts ? m.library.proved / m.library.attempts : 0, slot: 2 as const, text: `${m.library.proved}/${m.library.attempts}` },
      { label: `${short(m.model)}, alone`, value: m.alone.attempts ? m.alone.proved / m.alone.attempts : 0, slot: 1 as const, text: `${m.alone.proved}/${m.alone.attempts}` },
    ]),
    max: 1, legend: [{ name: 'with help (as under OSO)', slot: 2 }, { name: 'alone (as under traditional)', slot: 1 }],
  }));
  const notesFile = join(dir, 'notes.md');
  const notes = exists(notesFile) ? readFileSync(notesFile, 'utf8').trim() : '';
  const plain = (t: string) => t.replace(/\*\*/g, '');
  const starts = runs.flatMap((r) => r.records.map((x) => x.startedAt ?? 0)).filter((t) => t > 0);
  writeCard(dir, {
    ...(starts.length ? { ranAt: new Date(Math.min(...starts)).toISOString() } : {}),
    id, kind: 'model pilot', date: new Date().toISOString().slice(0, 10), title,
    design: {
      question: 'Can a model solve more when it is given the helper ideas (lemmas) a target needs?',
      compare: 'each model alone, and with the helper ideas each target needs',
      fixed: `the 8 posted targets, ${r0.attempts} attempts each, up to ${r0.repairs} repairs, reasoning effort ${r0.model.effort}, grind ${r0.allowGrind ? 'allowed' : 'banned'}`,
      measure: 'targets solved with help but never alone', better: 'higher', runs: `${r0.attempts} attempts per target, each way`,
    },
    answer: (() => { const h = models_.filter((m) => m.needsLemmas.length); return `With help, ${h.length} of ${models_.length} models solved targets they never solved alone (${h.map((m) => short(m.model)).join(', ') || 'none'}). ${models_.filter((m) => m.alone.attempts && m.alone.proved === m.alone.attempts).map((m) => short(m.model)).join(' and ') || 'No model'} solved everything alone.`; })(),
    table: models_.map((m) => ({
      model: short(m.model), 'with help': `${m.library.proved}/${m.library.attempts}`, alone: `${m.alone.proved}/${m.alone.attempts}`,
      'needed help for': m.needsLemmas.join(', ') || '–',
      'tokens per proof, with help / alone': m.library.tokensPerProof && m.alone.tokensPerProof ? `${(m.library.tokensPerProof / 1000).toFixed(1)}k / ${(m.alone.tokensPerProof / 1000).toFixed(1)}k` : '–',
    })),
    caveats: ['The helper ideas were given, not found: this measures how much they help, not whether a model would think of them.', 'Only a few attempts per target: the rates are rough.'],
    cost: `$${models_.reduce((a, m) => a + m.cost, 0).toFixed(2)}`,
    page: `results/pilot/${id}/summary.md`,
    chart: `results/pilot/${id}/figures/models.svg`,
  }, md.replace(/^# .*\n/, '') + (notes ? `\n## Notes\n\n${notes}\n` : ''));
  writeFileSync(join(dir, 'data.json'), JSON.stringify({ id, title, runs: runIds, attempts: r0.attempts, repairs: r0.repairs, allowGrind: r0.allowGrind, effort: r0.model.effort, headline, models: models_, curves }, null, 1) + '\n');
  return dir;
}
