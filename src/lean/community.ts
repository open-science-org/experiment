// A community of real agents racing on the Lean problem set, under traditional or OSO rules, on the
// same budget (specification, sections 2 to 5, with real agents and Lean as the success oracle).
//
// Each round, every agent with budget left takes one action: prove a target, or state and prove a new
// lemma of its own. Lean checks every proof against the library the agent can see, and records exactly
// which library results it used.
//   traditional: lemmas stay private to their author until it proves a target; then the target and the
//                lemmas it rests on are published together, and the author takes the bounty.
//   oso:         every result is published as soon as Lean accepts it; a new result's mint and a
//                target's bounty flow back to the results it used (α, c).
// Transcripts contain proofs, so they stay in lean/runs/ (private); summaries use anonymous ids.
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { check, type CheckOptions } from './checker.ts';
import { definitions, FREE, LEAN_DIR, loadTasks, parseReference, type Task } from './tasks.ts';
import type { Chat, Usage } from './agent.ts';
import { referenceProof } from './selftest.ts';
import { lineChart } from '../report/figures.ts';
import { RESULTS_DIR } from '../paths.ts';

export type Rules = 'traditional' | 'oso';

export interface CommunityOptions {
  rules: Rules;
  /** One entry per agent: the model it runs on. */
  agents: string[];
  /** Budget per agent, in dollars at the model's list price. */
  budget: number;
  rounds: number;
  repairs: number;
  alpha: number;
  c: number;
  mint: number;
  effort: 'low' | 'medium' | 'high';
  /** Allow grind (only for the stand-in agents, whose reference proofs use it). */
  allowGrind?: boolean;
  /** Each lab's persona: its name and the instructions its features produce (empty: none). */
  personas?: string[];
  personaNames?: string[];
  /** Enforced persona features, per lab: repairs per action, reasoning effort, and whether it sees others' results. */
  repairsByLab?: number[];
  effortByLab?: ('low' | 'medium' | 'high')[];
  reuseByLab?: boolean[];
}

/** A result in the community's library. */
export interface Entry {
  name: string;
  ns: string;
  signature: string;
  author: number;
  /** Target id, if it is a posted target. */
  target?: string;
  public: boolean;
  round: number;
  publishedRound?: number;
  /** Library results its proof used (names). */
  uses: string[];
  /** One basic tactic proves it: it may be cited, but it earns no mint. */
  trivial?: boolean;
}

export interface Action {
  round: number; agent: number; model: string;
  kind: 'target' | 'lemma' | 'pass' | 'none';
  target?: string; name?: string; signature?: string;
  ok: boolean; reason?: string; turns: number;
  /** The library entry an accepted action created, and the results its proof used. */
  entry?: string; uses?: string[];
  usage: Usage; listCost: number; spentAfter: number;
  transcript: { text: string; proof: string | null; errors: string[] }[];
  t: number;
}

const TRIVIAL = [':= by rfl', ':= by decide', ':= by simp', ':= by omega', ':= by simp_all', ':= by simp [u]'];

/** List prices from OpenRouter, in dollars per token. */
export async function listPrices(models: string[]): Promise<Record<string, { input: number; output: number }>> {
  const res = await fetch('https://openrouter.ai/api/v1/models');
  const data = (await res.json()) as { data: { id: string; pricing: { prompt: string; completion: string } }[] };
  const out: Record<string, { input: number; output: number }> = {};
  for (const m of models) {
    const d = data.data.find((x) => x.id === m);
    if (!d) throw new Error(`OpenRouter does not list ${m}`);
    out[m] = { input: Number(d.pricing.prompt), output: Number(d.pricing.completion) };
  }
  return out;
}

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

/** Splits an agent's `theorem name signature := proof` into its parts. */
export function parseLemma(code: string): { name: string; signature: string; proof: string } | null {
  const m = /^\s*(?:theorem|lemma)\s+([A-Za-z_][\w']*)\s+([\s\S]*)$/.exec(code);
  if (!m) return null;
  const rest = m[2];
  const assign = rest.indexOf(':=');
  const alt = rest.search(/\n\s*\|/);
  const cut = alt >= 0 && (assign < 0 || alt < assign) ? alt + 1 : assign;
  if (cut < 0) return null;
  return { name: m[1], signature: rest.slice(0, cut).trim(), proof: rest.slice(cut).replace(/^\n/, '') };
}

export class Community {
  opts: CommunityOptions;
  targets: Task[];
  library: Entry[] = [];
  /** Earnings by agent. */
  earnings: number[];
  spent: number[];
  actions: Action[] = [];
  free: Pick<Task, 'name' | 'ns' | 'short' | 'signature'>[];
  /** Labs that passed: they stop for the rest of the run. */
  passed = new Set<number>();

  constructor(opts: CommunityOptions) {
    this.opts = opts;
    this.targets = loadTasks().filter((t) => t.posted);
    this.earnings = opts.agents.map(() => 0);
    this.spent = opts.agents.map(() => 0);
    const ref = parseReference();
    this.free = FREE.map((name) => ({ name, ...ref.get(name)! }));
  }

  bounty(t: Task) { return 4 * 2 ** (t.depth - 1); }
  solved(id: string) { return this.library.find((e) => e.target === id); }
  /** What agent i can see and cite: everything published, and its own private results. */
  visible(i: number) {
    const reuse = this.opts.reuseByLab?.[i] ?? true;
    return this.library.filter((e) => e.author === i || (e.public && reuse));
  }
  checkLibrary(i: number): CheckOptions['library'] {
    return [...this.free, ...this.visible(i).map((e) => ({ name: `${e.ns}.${e.name}`, ns: e.ns, short: e.name, signature: e.signature }))];
  }
  uniqueName(base: string) {
    const taken = new Set([...this.library.map((e) => e.name), ...this.targets.map((t) => t.short), 'attempt', ...FREE.map((f) => f.split('.').pop()!)]);
    if (!taken.has(base)) return base;
    for (let k = 2; ; k++) if (!taken.has(`${base}_${k}`)) return `${base}_${k}`;
  }

  /** Pays value v into entry x: it keeps α (all, under traditional rules or if it used nothing); the rest flows to what it used. */
  pay(x: Entry, v: number) {
    const used = x.uses.map((n) => this.library.find((e) => `${e.ns}.${e.name}` === n)).filter((e): e is Entry => !!e);
    const keep = this.opts.rules === 'oso' && used.length ? this.opts.alpha : 1;
    this.earnings[x.author] += v * keep;
    if (keep < 1) for (const u of used) this.pay(u, (v * (1 - keep)) / used.length);
  }
  /** Publishing a result: its mint (less the cited share under OSO), and the bounty if it is a target. */
  publish(e: Entry, round: number) {
    if (e.public) return;
    e.public = true;
    e.publishedRound = round;
    const used = e.uses.map((n) => this.library.find((x) => `${x.ns}.${x.name}` === n)).filter((x): x is Entry => !!x);
    const c = this.opts.rules === 'oso' && used.length ? this.opts.c : 0;
    const mint = e.trivial ? 0 : this.opts.mint;
    this.earnings[e.author] += mint * (1 - c);
    for (const u of used) this.pay(u, (mint * c) / used.length);
    if (e.target) this.pay(e, this.bounty(this.targets.find((t) => t.publicId === e.target)!));
  }
  /** Traditional rules: a solved target is published with every private result it rests on. */
  publishBundle(e: Entry, round: number) {
    const seen = new Set<string>();
    const walk = (x: Entry) => {
      for (const n of x.uses) {
        const u = this.library.find((y) => `${y.ns}.${y.name}` === n);
        if (u && !seen.has(n)) { seen.add(n); walk(u); }
      }
      if (!x.public) this.publish(x, round);
    };
    walk(e);
  }

  systemPrompt(i: number): string {
    const o = this.opts;
    const rules = o.rules === 'traditional'
      ? `How this community works (traditional rules):
- Lemmas you prove stay private to you; other labs cannot see or use them, and you cannot see theirs.
- When you prove a posted target, it is published together with every lemma it rests on, and you receive the whole bounty.
- Each published result also earns its author a mint of ${o.mint}.`
      : `How this community works (OSO rules):
- Every result you prove is published at once, and every lab can build on it immediately.
- Each new result earns its author a mint of ${o.mint}; if it builds on earlier results, ${o.c * 100}% of that mint goes to them.
- When value reaches a result (a target's bounty, or value flowing from later work), its author keeps ${o.alpha * 100}% and the rest flows back to the results it used, and on down.`;
    const persona = o.personas?.[i]?.trim() ? `Your lab's way of working${o.personaNames?.[i] ? ` (${o.personaNames[i]})` : ''}: ${o.personas[i].trim()}` : '';
    return `You are lab ${i + 1} of ${o.agents.length} in a research community proving theorems in Lean 4 (version 4.35.0, core library only, no Mathlib). Your aim is to earn as much as you can within your budget; every model call you make costs budget.

${rules}

The definitions:

\`\`\`lean
${definitions().trim()}
\`\`\`

Proof rules: core lemmas and tactics such as simp, omega, decide, induction, cases and rw may be used. Not allowed: sorry, admit, native_decide, grind, search tactics (exact?, apply?), commands and set_option. Cite library results by the names shown. A lemma that a single basic tactic proves (rfl, decide, simp, omega) counts as trivial: you may cite it, but it earns no mint.

Each turn, take exactly one action, and reply with exactly one \`\`\`lean code block:
- To prove a posted target, start your reply with the line ACTION: target <ID>, and give the proof that completes \`theorem attempt <statement>\` (starting with := or with | match arms).
- To state and prove a new lemma, start with ACTION: lemma, and give the whole declaration: \`theorem <name> <statement> := <proof>\`. Choose lemmas that bring a target within reach.
- If nothing seems worth your budget, reply ACTION: pass. You stop for the rest of the run and keep what you have not spent.${persona ? `\n\n${persona}` : ''}`;
  }

  turnPrompt(i: number, round: number): string {
    const lib = this.visible(i);
    const fmt = (e: Entry) => `theorem ${e.ns === 'OSO' ? '' : e.ns.replace(/^OSO\./, '') + '.'}${e.name} ${e.signature}${e.public ? (e.author === i ? '   -- yours, published' : `   -- lab ${e.author + 1}`) : '   -- yours, private'}`;
    const targets = this.targets.map((t) => {
      const s = this.solved(t.publicId);
      const status = s ? (s.public || s.author === i ? `solved by lab ${s.author + 1}` : 'open') : 'open';
      return `${t.publicId} (bounty ${this.bounty(t)}, ${status}): theorem attempt ${norm(t.signature)}${t.ns === 'OSO.M2' ? '   -- stated inside namespace M2' : ''}`;
    });
    return `Round ${round}. Your earnings so far: ${this.earnings[i].toFixed(1)}. Budget left: $${Math.max(0, this.opts.budget - this.spent[i]).toFixed(3)}.

Posted targets:
${targets.join('\n')}

Library you can cite:
${lib.length ? '```lean\n' + lib.map(fmt).join('\n') + '\n```' : '(empty)'}

Take one action.`;
  }

  /** One agent's action this round: a reply, then Lean, with repairs. */
  async act(i: number, round: number, chat: Chat, price: (u: Usage) => number, log: (a: Action) => void): Promise<Action> {
    const model = this.opts.agents[i];
    const system = this.systemPrompt(i);
    const messages: { role: 'user' | 'assistant'; content: unknown }[] = [{ role: 'user', content: this.turnPrompt(i, round) }];
    const usage: Usage = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, cost: 0 };
    const transcript: Action['transcript'] = [];
    let kind: Action['kind'] = 'none', target: string | undefined, lemma: ReturnType<typeof parseLemma> = null, ok = false, reason = '';
    const repairs = this.opts.repairsByLab?.[i] ?? this.opts.repairs;
    for (let k = 0; k <= repairs; k++) {
      const reply = await chat(system, messages);
      for (const key of ['input', 'output', 'cacheRead', 'cacheWrite'] as const) usage[key] += reply.usage[key];
      usage.cost = (usage.cost ?? 0) + (reply.usage.cost ?? 0);
      this.spent[i] += price(reply.usage);
      const text = reply.text;
      if (/ACTION:\s*pass\b/i.test(text)) { kind = 'pass'; reason = 'passed'; this.passed.add(i); transcript.push({ text, proof: null, errors: [] }); break; }
      const action = /ACTION:\s*(target|lemma)\s*([A-Za-z0-9-]*)/i.exec(text);
      const code = [...text.matchAll(/```(?:lean4?|)\s*\n([\s\S]*?)```/g)].map((m) => m[1].replace(/\s+$/, '')).pop() ?? null;
      let errors: string[] = [];
      if (reply.stop === 'refusal') { reason = 'declined'; transcript.push({ text, proof: null, errors: ['declined'] }); break; }
      if (!action || !code) errors = ['Start with ACTION: target <ID> or ACTION: lemma, then one ```lean code block.'];
      else if (action[1].toLowerCase() === 'target') {
        kind = 'target'; target = action[2].toUpperCase();
        const t = this.targets.find((x) => x.publicId === target);
        if (!t) errors = [`There is no target ${target}.`];
        else {
          const r = await check(t, code.replace(/^\s*theorem\s+attempt\b[\s\S]*?(?=:=|\n\s*\|)/, ''), { library: this.checkLibrary(i), allowGrind: this.opts.allowGrind });
          errors = r.errors;
          if (r.ok) {
            ok = true;
            const e: Entry = { name: this.uniqueName(`target_${t.publicId}`), ns: t.ns, signature: t.signature, author: i, target: t.publicId, public: false, round, uses: r.uses.filter((u) => !FREE.includes(u)) };
            const already = this.solved(t.publicId);
            this.library.push(e);
            if (already) reason = 'already solved by another lab: duplicate';
            else if (this.opts.rules === 'oso') this.publish(e, round);
            else this.publishBundle(e, round);
          }
        }
      } else {
        kind = 'lemma';
        lemma = parseLemma(code);
        if (!lemma) errors = ['Give the whole declaration: theorem <name> <statement> := <proof>.'];
        else if (this.targets.some((t) => norm(t.signature) === norm(lemma!.signature))) errors = ['That is a posted target: use ACTION: target <ID> instead.'];
        else {
          const r = await check({ ns: 'OSO', signature: lemma.signature }, lemma.proof.replace(new RegExp(`(?<![\\w.])${lemma.name}(?![\\w'])`, 'g'), 'attempt'), { library: this.checkLibrary(i), allowGrind: this.opts.allowGrind });
          errors = r.errors;
          if (r.ok) {
            // The trivial-result screen: a statement one basic tactic proves earns nothing.
            let trivial = false;
            for (const tac of TRIVIAL) if ((await check({ ns: 'OSO', signature: lemma.signature }, tac, { library: [] })).ok) { trivial = true; break; }
            const dup = this.visible(i).find((e) => norm(e.signature) === norm(lemma!.signature));
            if (dup) { reason = `duplicate of ${dup.name}, which you can already cite`; }
            else {
              ok = true;
              if (trivial) reason = 'trivial: citable, but earns no mint';
              const hidden = this.library.find((e) => !e.public && e.author !== i && norm(e.signature) === norm(lemma!.signature));
              if (hidden) reason = `duplicate of lab ${hidden.author + 1}'s private result`;
              const e: Entry = { name: this.uniqueName(lemma.name), ns: 'OSO', signature: lemma.signature, author: i, public: false, round, uses: r.uses.filter((u) => !FREE.includes(u)), ...(trivial ? { trivial } : {}) };
              this.library.push(e);
              if (this.opts.rules === 'oso') this.publish(e, round);
            }
          }
        }
      }
      transcript.push({ text, proof: code, errors });
      if (ok || reason) break;
      if (this.spent[i] >= this.opts.budget) { reason = 'budget spent'; break; }
      messages.push({ role: 'assistant', content: reply.content });
      messages.push({ role: 'user', content: `Not accepted:\n\n${errors.join('\n\n').slice(0, 5000)}\n\nFix it and reply again in the same format.` });
    }
    const made = ok ? this.library.filter((e) => e.author === i && e.round === round).at(-1) : undefined;
    const a: Action = {
      round, agent: i, model, kind, target, name: lemma?.name, signature: lemma?.signature, ok, reason: reason || (ok ? undefined : 'not accepted'),
      ...(made ? { entry: made.name, uses: made.uses } : {}),
      turns: transcript.length, usage, listCost: price(usage), spentAfter: this.spent[i], transcript, t: Date.now(),
    };
    this.actions.push(a);
    log(a);
    return a;
  }

  active(i: number) { return this.spent[i] < this.opts.budget && !this.passed.has(i); }
  done() { return this.targets.every((t) => this.solved(t.publicId)) || this.opts.agents.every((_, i) => !this.active(i)); }
}

/** A stand-in agent that plays from the reference proofs: tests the mechanics without a model. */
export function referenceAgent(com: Community, i: number): Chat {
  const tasks = loadTasks();
  const failed = new Set<string>();
  let last: Task | undefined;
  return async () => {
    if (last && !com.actions.filter((a) => a.agent === i).at(-1)?.ok) failed.add(last.name);
    const visible = com.visible(i);
    const knows = (name: string) => FREE.includes(name) || visible.some((e) => e.signature === tasks.find((t) => t.name === name)?.signature);
    // Different labs pick different results from what is within reach, as real labs would.
    const reach = tasks.filter((t) => !knows(t.name) && !failed.has(t.name) && t.uses.every((u) => knows(u)) && !(t.posted && com.solved(t.publicId)?.public));
    const next = reach[i % Math.max(1, reach.length)];
    last = next;
    const usage = { input: 2000, output: 500, cacheRead: 0, cacheWrite: 0 };
    if (!next) return { text: 'ACTION: pass', content: '', usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 }, stop: 'end_turn' };
    let proof = referenceProof(next);
    // Cite results by the names they have in this community.
    for (const u of next.uses) {
      const short = u.split('.').pop()!;
      const e = visible.find((x) => x.signature === tasks.find((t) => t.name === u)?.signature);
      if (e && e.name !== short) proof = proof.replace(new RegExp(`(?<![\\w.])${short}(?![\\w'])`, 'g'), e.name);
    }
    const text = next.posted
      ? `ACTION: target ${next.publicId}\n\`\`\`lean\n${proof}\n\`\`\``
      : `ACTION: lemma\n\`\`\`lean\ntheorem ${next.short} ${next.signature} ${proof.trimStart().startsWith('|') ? '\n' + proof : proof}\n\`\`\``;
    return { text, content: text, usage, stop: 'end_turn' };
  };
}

export interface CommunityResult { opts: CommunityOptions; actions: Action[]; library: Entry[]; earnings: number[]; spent: number[] }

/** Runs one community to the end: rounds of one action per agent with budget left, in parallel. */
export async function runCommunity(opts: CommunityOptions, chatFor: (com: Community, i: number) => Chat, price: (model: string, u: Usage) => number, runId: string, log = console.log, root = join(LEAN_DIR, 'runs')): Promise<CommunityResult> {
  const com = new Community(opts);
  const dir = join(root, runId);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'options.json'), JSON.stringify({ kind: 'community', ...opts }, null, 1));
  const file = join(dir, 'actions.jsonl');
  writeFileSync(file, '');
  const chats = opts.agents.map((_, i) => chatFor(com, i));
  for (let round = 1; round <= opts.rounds && !com.done(); round++) {
    const active = opts.agents.map((_, i) => i).filter((i) => com.active(i));
    await Promise.all(active.map((i) => com.act(i, round, chats[i], (u) => price(opts.agents[i], u), (a) => {
      appendFileSync(file, JSON.stringify(a) + '\n');
      const solved = com.targets.filter((t) => com.solved(t.publicId)).length;
      log(`  round ${round} · lab ${i + 1} (${a.model.split('/').pop()}): ${a.kind === 'target' ? `target ${a.target}` : a.kind === 'lemma' ? `lemma ${a.name ?? '?'}` : a.kind === 'pass' ? 'passed' : 'no action'} ${a.ok ? 'accepted' : 'failed'}${a.reason ? ` (${a.reason})` : ''} · $${a.listCost.toFixed(3)} · ${solved}/8 targets solved`);
    }).catch((e) => log(`  round ${round} · lab ${i + 1}: error ${(e as Error).message}`))));
  }
  const result: CommunityResult = { opts, actions: com.actions, library: com.library, earnings: com.earnings, spent: com.spent };
  writeFileSync(join(dir, 'result.json'), JSON.stringify(result, null, 1));
  return result;
}

export function readCommunity(runId: string): CommunityResult {
  return JSON.parse(readFileSync(join(LEAN_DIR, 'runs', runId, 'result.json'), 'utf8')) as CommunityResult;
}

/* ---------------------------------------------------------------------------- Comparing communities */


/** Targets solved by community spend, in the order actions finished. */
export function progress(r: CommunityResult): [number, number][] {
  const acts = [...r.actions].sort((a, b) => a.t - b.t);
  const solved = new Set<string>();
  let spent = 0;
  const pts: [number, number][] = [[0, 0]];
  for (const a of acts) {
    spent += a.listCost;
    if (a.kind === 'target' && a.ok && a.target) solved.add(a.target);
    pts.push([spent, solved.size]);
  }
  return pts;
}

export function stats(r: CommunityResult) {
  const lemmas = r.actions.filter((a) => a.kind === 'lemma');
  const solved = new Set(r.actions.filter((a) => a.kind === 'target' && a.ok).map((a) => a.target));
  const deepest = Math.max(0, ...[...solved].map((id) => loadTasks().find((t) => t.publicId === id)?.depth ?? 0));
  return {
    rules: r.opts.rules,
    targetsSolved: solved.size,
    deepestTarget: deepest,
    spent: r.spent.reduce((a, b) => a + b, 0),
    budget: r.opts.budget * r.opts.agents.length,
    actions: r.actions.length,
    lemmasAccepted: lemmas.filter((a) => a.ok && !/trivial/.test(a.reason ?? '')).length,
    lemmasDuplicate: r.actions.filter((a) => a.ok && /duplicate/.test(a.reason ?? '')).length + lemmas.filter((a) => !a.ok && /duplicate/.test(a.reason ?? '')).length,
    trivial: lemmas.filter((a) => /trivial/.test(a.reason ?? '')).length,
    failed: r.actions.filter((a) => !a.ok && !/duplicate|trivial/.test(a.reason ?? '')).length,
    published: r.library.filter((e) => e.public).length,
    neverPublished: r.library.filter((e) => !e.public).length,
    earnings: r.earnings,
  };
}

export function writeCommunityComparison(id: string, runs: { runId: string; result: CommunityResult }[], note = '', standIn = false): string {
  const who = standIn ? 'stand-in agents' : 'real agents';
  const dir = join(RESULTS_DIR, 'community', id);
  mkdirSync(join(dir, 'figures'), { recursive: true });
  const curves = runs.map((x) => ({ ...x, pts: progress(x.result), st: stats(x.result) }));
  const label = (rules: Rules) => (rules === 'oso' ? 'OSO' : 'Traditional');
  const maxX = Math.max(...curves.map((c) => c.st.budget), 1e-6);
  writeFileSync(join(dir, 'figures', 'progress.svg'), lineChart({
    title: `Targets solved for the money: ${who}, OSO vs traditional`,
    subtitle: `Same agents and budget ($${maxX.toFixed(2)} at list prices); Lean checks every proof.`,
    xLabel: 'Dollars spent by the community', yLabel: 'Targets solved',
    series: curves.map((c) => ({ name: label(c.result.opts.rules), slot: c.result.opts.rules === 'oso' ? 2 : 1, points: c.pts })) as never,
    x: [0, maxX], y: [0, 8], xTicks: [0, maxX / 4, maxX / 2, (3 * maxX) / 4, maxX], yTicks: [0, 2, 4, 6, 8],
    format: { x: (v) => `$${v.toFixed(2)}`, y: (v) => String(v) },
  }));
  const o = runs[0].result.opts;
  const rows = curves.map((c) => ({
    rules: label(c.result.opts.rules), 'targets solved': `${c.st.targetsSolved} of 8`, 'deepest target': c.st.deepestTarget,
    spent: `$${c.st.spent.toFixed(2)} of $${c.st.budget.toFixed(2)}`, actions: c.st.actions, 'lemmas accepted': c.st.lemmasAccepted,
    'duplicated work': c.st.lemmasDuplicate, trivial: c.st.trivial, 'failed attempts': c.st.failed, 'never published': c.st.neverPublished,
  }));
  const cols = Object.keys(rows[0] ?? {});
  const table = [`| ${cols.join(' | ')} |`, `| ${cols.map(() => '---').join(' | ')} |`, ...rows.map((r) => `| ${cols.map((c) => (r as Record<string, unknown>)[c]).join(' | ')} |`)].join('\n');
  const oso = curves.find((c) => c.result.opts.rules === 'oso')?.st, trad = curves.find((c) => c.result.opts.rules === 'traditional')?.st;
  const verdict = oso && trad
    ? oso.targetsSolved > trad.targetsSolved ? `**For the same money, the OSO community solved ${oso.targetsSolved} targets and the traditional one ${trad.targetsSolved}.**`
      : oso.targetsSolved < trad.targetsSolved ? `**For the same money, the traditional community solved ${trad.targetsSolved} targets and the OSO one ${oso.targetsSolved}.**`
      : `**Both communities solved ${oso.targetsSolved} targets for the same money.**`
    : '';
  const md = `# ${standIn ? 'Stand-in' : 'Real'} agents, OSO vs traditional: ${id}

${verdict} ${note}

![Targets solved for the money](figures/progress.svg)

${table}

- **Agents:** ${o.agents.map((m, i) => `lab ${i + 1}: \`${m}\``).join(', ')}; each with $${o.budget} at list prices; reasoning effort ${o.effort}.
- **Each round,** every lab with budget left takes one action: prove a target, or state and prove a new lemma; up to ${o.repairs} repairs on Lean's errors.
- **Traditional:** lemmas stay private until their author proves a target; the target and the lemmas it rests on are then published and the author takes the bounty. **OSO:** every result is published at once; mint ${o.mint}, c = ${o.c}, α = ${o.alpha}.
- **Duplicated work:** a lemma proved again when another lab already had it (privately, under traditional rules), or a target solved twice, for example by two labs in the same round. **Trivial:** one basic tactic proves it; it can be cited but earns no mint. **Labs may pass** when nothing seems worth their budget, and keep the rest.
- **One run per setting:** results vary from run to run; several runs are needed before reading much into a difference.

Runs: ${runs.map((x) => x.runId).join(', ')}. Transcripts (with proofs) are private.
`;
  writeFileSync(join(dir, 'summary.md'), md);
  writeFileSync(join(dir, 'data.json'), JSON.stringify({ id, runs: runs.map((x) => x.runId), stats: curves.map((c) => c.st), curves: curves.map((c) => ({ rules: c.result.opts.rules, points: c.pts })) }, null, 1) + '\n');
  return dir;
}
