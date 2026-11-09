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
//   shared:      every result is published at once, as under OSO, but nothing flows back: an author
//                keeps its own mint and bounty. The gap to OSO is what value flow adds on its own.
//   independent: nothing is shared; each lab sees only its own results. A target counts when any lab
//                proves it ("best of N"). With one lab and the whole budget, it is the single agent.
//   planner:     lab 1 plans and does not prove: each round it gives every other lab one assignment (a
//                target, or a lemma to state and prove). Results are shared at once and nothing flows
//                back, as in a shared library. A strong orchestration baseline, at the same total money.
// Transcripts contain proofs, so they stay in lean/runs/ (private); summaries use anonymous ids.
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { check, type CheckOptions } from './checker.ts';
import { definitions, FREE, LEAN_DIR, loadTasks, parseReference, type Problems, type Task } from './tasks.ts';
import { OPENROUTER_API, type Chat, type Usage } from './agent.ts';
import { referenceProof } from './selftest.ts';
import { lineChart } from '../report/figures.ts';
import { writeCard } from '../card.ts';
import { RESULTS_DIR } from '../paths.ts';

export type Rules = 'traditional' | 'oso' | 'shared' | 'independent' | 'planner';

/**
 * How the Lean runs' rewards compare with the current simulation model (src/engine/version.ts). When
 * MODEL_VERSION changes, compare the rewards here with it, update `gaps`, then set `checkedAgainst`: a test
 * fails until then. Every summary lists the gaps of the options it ran with.
 */
export const LEAN_REWARDS = {
  checkedAgainst: 6,
  gaps: (o: Pick<CommunityOptions, 'knowledge' | 'split'>): string[] => [
    o.knowledge === 'off'
      ? 'the knowledge reward is off (the simulation pays 1 per new bit since v5): Lean has no agreed measure of a result\'s new knowledge yet, see docs/design.md'
      : o.knowledge === 'proof-size'
      ? `the knowledge reward is measured by proof size (log2(1 + symbols/${PROOF_UNIT}), at most ${PROOF_CAP}), a stand-in for the simulation's log2(1/p) per new bit; the simulation's prediction for sharing comes from its own fields, not from this problem set with this reward; a lab could pad its proofs, so sizes are checked against runs without the reward`
      : 'a flat mint (1 per new result, easy or hard, flowing back by α), not the knowledge reward per new bit the simulation has paid since v5',
    o.split === 'lines-saved'
      ? 'value flowing back is split by the lines each parent saves (its own proof\'s length in symbols), a stand-in for the work it saves (1/p) in the simulation'
      : 'value flowing back is split by the money spent proving each parent, not by the work a parent saves (1/p) as in the simulation',
  ],
};
/** Rules under which a result is public as soon as Lean accepts it. */
export const atOnce = (r: Rules) => r === 'oso' || r === 'shared' || r === 'planner';
/** The flat mint a new result earns (0 with the knowledge reward off or measured by proof size). */
export const mintOf = (o: Pick<CommunityOptions, 'knowledge' | 'mint'>) => (o.knowledge === 'off' || o.knowledge === 'proof-size' ? 0 : o.mint);
/** The knowledge reward by proof size: log2(1 + size / PROOF_UNIT), at most PROOF_CAP. In Spend all the median accepted
 *  lemma had 82 symbols (1.6), C3 35 (0.9), A5 about 1,200 (the cap). On a log scale with a low cap, padding a proof
 *  pays little; the cap equals the smallest bounty, so a lemma never earns more than a target. */
export const PROOF_UNIT = 40, PROOF_CAP = 4;
/** A proof's size: its names, numbers and signs, with comments and spaces left out. Give it the proof only, not the statement. */
export const proofSize = (proof: string) =>
  proof.replace(/\/-[\s\S]*?-\//g, '').replace(/--[^\n]*/g, '').match(/[A-Za-z_][\w'.]*|\d+|[^\s\w]/g)?.length ?? 0;
export const sizeReward = (size: number) => Math.min(PROOF_CAP, Math.round(Math.log2(1 + size / PROOF_UNIT) * 10) / 10);
/** A lab's PUBLISH choice: the last line that is only "PUBLISH: yes" or "PUBLISH: no", in any of its replies this turn
 *  (so wording copied from the prompt does not count). Both or neither: no choice. */
export function publishChoice(replies: string[]): 'yes' | 'no' | undefined {
  // The line alone, allowing bold, backticks or a full stop around it.
  const all = replies.flatMap((t) => [...t.matchAll(/^[\s*`]*PUBLISH:\s*(yes|no)[\s*`.]*$/gim)].map((m) => m[1].toLowerCase()));
  return all.at(-1) as 'yes' | 'no' | undefined;
}

export interface CommunityOptions {
  rules: Rules;
  /** One entry per agent: the model it runs on. */
  agents: string[];
  /** Budget per agent, in dollars: what the provider charged (older runs: list prices). */
  budget: number;
  rounds: number;
  repairs: number;
  alpha: number;
  /** Runs before 2026-11-07 only: the share of the flat mint passed to cited results. It now flows back by α. */
  c?: number;
  mint: number;
  /**
   * The knowledge reward: what a new result earns for itself when it is published. 'off' (new runs since
   * 2026-11-06): nothing; only bounties pay, flowing back by α. 'flat-mint': the old flat `mint` per
   * result, `c` of it to the results it cites (runs before 2026-11-06, which have no such field).
   * Why off for now, and how it could be measured later: docs/design.md, "The knowledge reward in Lean".
   */
  knowledge?: 'off' | 'flat-mint' | 'proof-size';
  /** Who decides when a lemma is published: the rules (default), or each lab, result by result ('choose': a kept
   *  lemma stays private until its author proves a target that rests on it; targets are always published). */
  publishing?: 'rules' | 'choose';
  /** How value flowing back is split among the results a proof used: by the lines each saves (its own proof's
   *  length in symbols; runs from 2026-11-08), or by the money spent proving it (earlier runs, which have no such field). */
  split?: 'lines-saved' | 'cost';
  /**
   * Money follows earnings, as in the simulation (docs/equations.md, section 5): the funder releases the money
   * round by round, the same amount each round (all labs' money / rounds); a share 1 − follow of it is split equally
   * among the labs still working, a share `follow` by their recent earnings (0.7 old, 0.3 this round). Unspent money
   * carries over. Not set: each lab has its own fixed budget for the whole run (runs before 2026-11-08).
   */
  follow?: number;
  /** May a lab stop early by passing (default yes)? No: every lab works until its money or the rounds run out,
   *  so setups are compared at the same money spent; a pass then only skips that turn. */
  /** Planner rules: the planner gets no strategy advice and no report of what failed, so it has the same information as the labs. */
  plainPlanner?: boolean;
  mayStop?: boolean;
  effort: 'low' | 'medium' | 'high';
  /** Allow grind (only for the stand-in agents, whose reference proofs use it). */
  allowGrind?: boolean;
  /** Each lab's persona: its name and the instructions its features produce (empty: none). */
  personas?: string[];
  personaNames?: string[];
  /** Posted conjectures: intermediate results the community wants proved, each with a small bounty (by public id). */
  conjectures?: string[];
  conjectureBounty?: number;
  /** The targets the result is judged on (public ids); all if empty. */
  counted?: string[];
  /** Which problem set: the main 8 targets (default) or those plus the harder targets (private files; see lean/reference-dag-hard.md). */
  problems?: Problems;
  /** Enforced persona features, per lab: repairs per action, reasoning effort, and whether it sees others' results. */
  repairsByLab?: number[];
  effortByLab?: ('low' | 'medium' | 'high')[];
  reuseByLab?: boolean[];
}

/** A result in the community's library. */
export interface Entry {
  name: string;
  /** Money spent on the action that proved it: the stand-in for how much it contributes to what uses it. */
  cost?: number;
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
  /** Posted conjecture id, if it is one. */
  conjecture?: string;
  /** Its proof's length in symbols: the lines citing it saves (how flow-back is split), and the knowledge reward by proof size. */
  size?: number;
  /** When labs choose: what its author chose ('none': no PUBLISH line, so kept private). */
  choice?: 'yes' | 'no' | 'none';
  /** An already published result proves it in one step (a restatement): it earns no knowledge reward. */
  known?: boolean;
}

export interface Action {
  round: number; agent: number; model: string;
  kind: 'target' | 'conjecture' | 'lemma' | 'pass' | 'none' | 'plan' | 'error';
  target?: string; name?: string; signature?: string;
  ok: boolean; reason?: string; turns: number;
  /** The library entry an accepted action created, and the results its proof used. */
  entry?: string; uses?: string[];
  /** Dollars this action counted against the budget: the provider's charge. Older runs have only listCost. */
  usage: Usage; cost?: number; listCost?: number; spentAfter: number;
  /** The companies that served this action's calls, in order. */
  servedBy?: string[];
  /** Each reply: the model's thinking (saved since 2026-11-07, where the provider returns it), its answer, the proof and Lean's errors. */
  transcript: { reasoning?: string; text: string; proof: string | null; errors: string[] }[];
  t: number;
}

const TRIVIAL = [':= by rfl', ':= by decide', ':= by simp', ':= by omega', ':= by simp_all', ':= by simp [u]'];

/** List prices from OpenRouter, in dollars per token. */
export async function listPrices(models: string[]): Promise<Record<string, { input: number; output: number }>> {
  const res = await fetch(`${OPENROUTER_API}/models`);
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
/** The first proof of each statement: proving a target or lemma again is work done twice, not building on others. */
export const firstProofs = (library: Entry[]) => { const seen = new Set<string>(); return library.filter((e) => !seen.has(norm(e.signature)) && !!seen.add(norm(e.signature))); };

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

/** A reply's action and its code. Labs often leave out the code fence, put the ACTION line inside it, or wrap the proof in
 *  namespace lines; these are read the same way, and the code then goes through the same checks. */
export function parseReply(text: string): { action: RegExpExecArray | null; code: string | null } {
  const action = /ACTION:\s*(target|conjecture|lemma)\s*([A-Za-z0-9-]*)/i.exec(text);
  const fenced = [...text.matchAll(/```(?:lean4?|)\s*\n([\s\S]*?)(?:```|$)/g)].map((m) => m[1]).pop();
  const raw = fenced ?? (action ? text.slice(action.index).split('\n').slice(1).join('\n') : '');
  let lines = raw.split('\n').filter((l) => !/^\s*ACTION:/i.test(l));
  const trim = () => { while (lines.length && !lines[0].trim()) lines.shift(); while (lines.length && !lines.at(-1)!.trim()) lines.pop(); };
  trim();
  for (let open = /^\s*namespace\s+([\w.]+)\s*$/.exec(lines[0] ?? ''); open && new RegExp(`^\\s*end\\s+${open[1].replace(/\./g, '\\.')}\\s*$`).test(lines.at(-1) ?? ''); open = /^\s*namespace\s+([\w.]+)\s*$/.exec(lines[0] ?? '')) { lines = lines.slice(1, -1); trim(); }
  return { action, code: lines.length ? lines.join('\n') : null };
}

/** A posted target's proof from a lab's code: any `theorem name statement` in front is dropped, and a bare `by` gets its `:=`. */
export const proofBody = (code: string) => {
  const body = code.replace(/^\s*(?:theorem|lemma)\s+[\w'.]+\b[\s\S]*?(?=:=|\n\s*\|)/, '');
  return /^\s*by\b/.test(body) ? ':= ' + body.trimStart() : body;
};

export class Community {
  opts: CommunityOptions;
  targets: Task[];
  /** Posted conjectures, with neutral ids (K1, K2, …) so the summary names no hidden lemma. */
  conjectures: (Task & { cid: string })[];
  library: Entry[] = [];
  /** Earnings by agent. */
  earnings: number[];
  spent: number[];
  actions: Action[] = [];
  free: Pick<Task, 'name' | 'ns' | 'short' | 'signature'>[];
  /** Money follows earnings: money released to each lab so far, and its smoothed recent earnings. */
  released: number[] = [];
  recent: number[] = [];
  /** Labs that passed: they stop for the rest of the run. */
  passed = new Set<number>();
  /** Planner rules: this round's assignment for each lab. */
  plans: string[] = [];

  constructor(opts: CommunityOptions) {
    this.opts = opts;
    const tasks = loadTasks(opts.problems);
    this.targets = tasks.filter((t) => t.posted);
    this.conjectures = (opts.conjectures ?? []).map((id, k) => {
      const t = tasks.find((x) => x.publicId === id);
      if (!t || t.posted) throw new Error(`conjecture ${id} is not a lemma of the problem set`);
      return { ...t, cid: `K${k + 1}` };
    });
    this.earnings = opts.agents.map(() => 0);
    this.spent = opts.agents.map(() => 0);
    this.released = opts.agents.map(() => 0);
    this.recent = opts.agents.map(() => 0);
    const ref = parseReference(opts.problems);
    this.free = FREE.map((name) => ({ name, ...ref.get(name)! }));
  }

  bounty(t: Task) { return 4 * 2 ** (t.depth - 1); }
  solved(id: string) { return this.library.find((e) => e.target === id); }
  provedConjecture(cid: string) { return this.library.find((e) => e.conjecture === cid); }
  /** What agent i can see and cite: everything published, and its own private results. */
  visible(i: number) {
    const reuse = this.opts.rules !== 'independent' && (this.opts.reuseByLab?.[i] ?? true);
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

  /**
   * How flow-back from a result is split between the results it used: by each one's contribution, the
   * work it saves (docs/design.md, attribution weights). Measured by the lines it saves: citing it saves writing
   * its proof, so its own proof's length in symbols (earlier runs: the money spent proving it). An equal split
   * when a measure is missing.
   */
  weights(used: Entry[]): number[] {
    const costs = used.map((u) => (this.opts.split === 'lines-saved' ? u.size : u.cost) ?? 0), sum = costs.reduce((a, b) => a + b, 0);
    return costs.every((x) => x > 0) ? costs.map((x) => x / sum) : used.map(() => 1 / used.length);
  }
  /** Pays value v into entry x: it keeps α (all, under traditional rules or if it used nothing); the rest flows to what it used. */
  pay(x: Entry, v: number) {
    // A copy of a statement another lab published first: credit goes to the first publisher, as in the simulation.
    const first = (u: Entry) => this.library.filter((e) => e.public && norm(e.signature) === norm(u.signature) && !e.target)
      .sort((a, b) => a.publishedRound! - b.publishedRound! || this.library.indexOf(a) - this.library.indexOf(b))[0] ?? u;
    const used = [...new Set(x.uses.map((n) => this.library.find((e) => `${e.ns}.${e.name}` === n)).filter((e): e is Entry => !!e).map((u) => (u.target ? u : first(u))))];
    const keep = this.opts.rules === 'oso' && used.length ? this.opts.alpha : 1;
    this.earnings[x.author] += v * keep;
    if (keep < 1) { const w = this.weights(used); used.forEach((u, k) => this.pay(u, v * (1 - keep) * w[k])); }
  }
  /** Publishing a result: its mint (less the cited share under OSO), and the bounty if it is a target. */
  publish(e: Entry, round: number) {
    if (e.public) return;
    e.public = true;
    e.publishedRound = round;
    const used = e.uses.map((n) => this.library.find((x) => `${x.ns}.${x.name}` === n)).filter((x): x is Entry => !!x);
    // A new result's own reward flows back like a bounty (the simulation's α0, equal to α).
    const mint = e.trivial || e.known ? 0 : mintOf(this.opts);
    if (mint) this.pay(e, mint);
    // The knowledge reward by proof size: only for what is new, so nothing if a lab published the same statement first.
    const first = !this.library.some((x) => x !== e && x.public && norm(x.signature) === norm(e.signature));
    if (this.opts.knowledge === 'proof-size' && !e.trivial && !e.known && first && e.size) this.pay(e, sizeReward(e.size));
    if (e.target) this.pay(e, this.bounty(this.targets.find((t) => t.publicId === e.target)!));
    if (e.conjecture && !e.trivial) this.pay(e, this.opts.conjectureBounty ?? 1);
  }
  /** Publishing with the author's own private results it rests on (traditional rules, and a lab's PUBLISH: yes),
   *  so nothing public rests on hidden work. Another lab's private results are never published by it. */
  publishBundle(e: Entry, round: number) {
    const seen = new Set<string>();
    const walk = (x: Entry) => {
      for (const n of x.uses) {
        const u = this.library.find((y) => `${y.ns}.${y.name}` === n);
        if (u && u.author === e.author && !seen.has(n)) { seen.add(n); walk(u); }
      }
      if (!x.public) this.publish(x, round);
    };
    walk(e);
  }

  systemPrompt(i: number): string {
    const o = this.opts, M = mintOf(o);
    // One template for every setup: the same three lines, each stating one rule, so the setups' prompts differ only
    // where their rules do (runs before 2026-11-07 used freer wording per setup; see docs/lean-experiment.md).
    const name = o.publishing === 'choose' ? 'labs choose what to publish' : { independent: o.agents.length === 1 ? 'one lab' : 'independent labs', planner: 'with a planner', shared: 'shared library', traditional: 'traditional rules', oso: 'OSO rules' }[o.rules];
    const seeing = o.publishing === 'choose'
      ? 'You choose, for each lemma you prove, whether to publish it now: then every lab can see it and build on it. Or keep it private: only you can see and use it. A kept lemma is published when you prove a posted target that rests on it; if you never do, it is never published and earns nothing. Publishing a lemma also publishes your kept lemmas it rests on. Targets are always published. When you prove a lemma, end your reply with a line that says only PUBLISH: yes, or only PUBLISH: no.'
      : o.rules === 'independent'
      ? o.agents.length === 1 ? 'You work alone, with the whole budget; your results go into your own library.' : 'Labs work separately: you see only your own results, and no lab sees yours.'
      : o.rules === 'traditional'
      ? 'Lemmas you prove stay private to you; other labs cannot see or use them, and you cannot see theirs. When you prove a posted target, it is published together with every lemma it rests on.'
      : 'Every result you prove is published at once, and every lab can build on it immediately.';
    const flow = o.rules === 'oso' && o.alpha < 1
      ? `When value reaches a result (a target's bounty, or value flowing back from later work), its author keeps ${o.alpha * 100}% and the rest flows back to the results it used, and on down.`
      : "A target's bounty goes to the lab that proves it. Nothing flows back to the results it used.";
    const own = o.knowledge === 'proof-size'
      ? `When a result is published, it earns up to ${PROOF_CAP}, more for a longer proof, if it is new: no lab has published it, or a result that proves it in one step, before${o.rules === 'oso' && o.alpha < 1 ? '. This flows back in the same way' : '. Its author keeps it'}.`
      : M ? `A new result earns its author a mint of ${M}${o.rules === 'oso' && o.alpha < 1 ? ', which flows back in the same way' : ''}. It is new if no lab has published it, or a result that proves it in one step, before.` : 'A new result earns nothing by itself.';
    const planner = o.rules === 'planner' ? '\n- Lab 1 is the planner: it does not prove anything; each round it gives every other lab an assignment, to bring the targets within reach together. Follow your assignment unless it is clearly impossible.' : '';
    const money = o.follow === undefined ? '' : `\n- Money: the funder releases the money round by round, $${((o.budget * o.agents.length) / o.rounds).toFixed(3)} a round for all labs: ${Math.round((1 - o.follow) * 100)}% split equally among the labs still working, ${Math.round(o.follow * 100)}% in proportion to what each earned recently. Unspent money carries over; a lab with no money left waits for the next round.`;
    const rules = `How this community works (${name}):${planner}\n- Seeing results: ${seeing}\n- Bounties: ${flow}\n- New results: ${own}${money}`;
    const persona = o.personas?.[i]?.trim() ? `Your lab's way of working${o.personaNames?.[i] ? ` (${o.personaNames[i]})` : ''}: ${o.personas[i].trim()}` : '';
    return `You are lab ${i + 1} of ${o.agents.length} in a research community proving theorems in Lean 4 (version 4.35.0, core library only, no Mathlib). Your aim is to earn as much as you can within your budget; every model call you make costs budget.

${rules}

The definitions:

\`\`\`lean
${definitions().trim()}
\`\`\`

Proof rules: core lemmas and tactics such as simp, omega, decide, induction, cases and rw may be used. Not allowed: sorry, admit, native_decide, grind, search tactics (exact?, apply?), commands and set_option. Cite library results by the names shown. A lemma that a single basic tactic proves (rfl, decide, simp, omega) counts as trivial: you may cite it${M ? ', but it earns no mint' : ''}.

Each turn, take exactly one action, and reply with exactly one \`\`\`lean code block. A reply looks like this:
ACTION: target <ID>
\`\`\`lean
:= by
  simp
\`\`\`
- To prove a posted target, start your reply with the line ACTION: target <ID>, and give the proof that completes \`theorem attempt <statement>\` (starting with := or with | match arms).
${this.conjectures.length ? `- To prove a posted conjecture, start your reply with the line ACTION: conjecture <ID>, and give the proof that completes \`theorem attempt <statement>\` (starting with := or with | match arms). A conjecture is an intermediate result the community wants; it earns a bounty of ${o.conjectureBounty ?? 1} when it is published, and can then be cited by the name shown.\n` : ''}- To state and prove a new lemma, start with ACTION: lemma, and give the whole declaration: \`theorem <name> <statement> := <proof>\`. Choose lemmas that bring a target within reach.
${o.mayStop === false ? '- You keep working until your budget or the rounds run out: you cannot stop early. Use every turn to prove something useful.' : '- If nothing seems worth your budget, reply ACTION: pass. You stop for the rest of the run and keep what you have not spent.'}${persona ? `\n\n${persona}` : ''}`;
  }

  turnPrompt(i: number, round: number): string {
    const lib = this.visible(i);
    const fmt = (e: Entry) => `theorem ${e.ns === 'OSO' ? '' : e.ns.replace(/^OSO\./, '') + '.'}${e.name} ${e.signature}${e.public ? (e.author === i ? '   -- yours, published' : `   -- lab ${e.author + 1}`) : '   -- yours, private'}`;
    const targets = this.targets.map((t) => {
      const s = this.solved(t.publicId);
      const status = s ? ((s.public && this.opts.rules !== 'independent') || s.author === i ? `solved by lab ${s.author + 1}` : 'open') : 'open';
      return `${t.publicId} (bounty ${this.bounty(t)}, ${status}): theorem attempt ${norm(t.signature)}${t.ns === 'OSO.M2' ? '   -- stated inside namespace M2' : ''}`;
    });
    const conj = this.conjectures.map((k) => {
      const e = this.provedConjecture(k.cid);
      const status = e ? (e.public ? `proved by lab ${e.author + 1}: cite it as ${e.name}` : e.author === i ? `proved by you (private): cite it as ${e.name}` : 'open') : 'open';
      return `${k.cid} (${status}): theorem attempt ${norm(k.signature)}`;
    });
    return `Round ${round}. Your earnings so far: ${this.earnings[i].toFixed(1)}. Budget left: $${Math.max(0, this.budgetOf(i) - this.spent[i]).toFixed(3)}.${this.opts.follow !== undefined ? ` Money you get next round: about $${this.nextFunding(i).toFixed(3)}.` : ''}

Posted targets:
${targets.join('\n')}

${conj.length ? `Posted conjectures:\n${conj.join('\n')}\n\n` : ''}Library you can cite:
${lib.length ? '```lean\n' + lib.map(fmt).join('\n') + '\n```' : '(empty)'}
${this.plans[i] ? `\nYour assignment from the planner this round:\n${this.plans[i]}\n` : ''}
Take one action.`;
  }

  /** Planner rules: lab 1's instructions. */
  plannerSystem(): string {
    const o = this.opts;
    return `You are the planner of a research community of ${o.agents.length - 1} labs proving theorems in Lean 4 (version 4.35.0, core library only, no Mathlib). You do not prove anything yourself. Each round you give every lab one assignment, so that together they prove the posted targets for as little money as possible: every model call costs budget, yours included.

Results are published at once and every lab can cite them.${o.plainPlanner ? '' : ' A good plan splits each hard target into lemmas, gives different labs different lemmas so no work is done twice, and assigns a target once the lemmas it needs are in the library.'}

The definitions:

\`\`\`lean
${definitions().trim()}
\`\`\`

Reply with one line per lab, and nothing else:
LAB <n>: target <ID>
LAB <n>: lemma \`theorem <name> <statement>\` (a short note on why it helps is fine)
The labs are numbered 2 to ${o.agents.length}.`;
  }

  plannerPrompt(round: number): string {
    const pub = this.library.filter((e) => e.public);
    const targets = this.targets.map((t) => `${t.publicId} (${this.solved(t.publicId) ? `solved by lab ${this.solved(t.publicId)!.author + 1}` : 'open'}): theorem attempt ${norm(t.signature)}${t.ns === 'OSO.M2' ? '   -- stated inside namespace M2' : ''}`);
    const last = this.actions.filter((a) => a.round === round - 1 && a.kind !== 'plan').map((a) => `lab ${a.agent + 1}: ${a.kind}${a.target ? ` ${a.target}` : a.name ? ` ${a.name}` : ''} ${a.ok ? 'accepted' : `failed${a.reason ? ` (${a.reason})` : ''}`}`);
    const labs = this.opts.agents.map((_, i) => i).filter((i) => i > 0 && this.active(i)).map((i) => i + 1);
    return `Round ${round}. Your budget left: $${Math.max(0, this.budgetOf(0) - this.spent[0]).toFixed(3)}. Labs still working: ${labs.join(', ')}.

Posted targets:
${targets.join('\n')}

Library (everyone can cite):
${pub.length ? '```lean\n' + pub.map((e) => `theorem ${e.ns === 'OSO' ? '' : e.ns.replace(/^OSO\./, '') + '.'}${e.name} ${e.signature}   -- lab ${e.author + 1}`).join('\n') + '\n```' : '(empty)'}

${last.length && !this.opts.plainPlanner ? `Last round:\n${last.join('\n')}\n\n` : ''}Give each lab still working its assignment.`;
  }

  /** Planner rules: one planning call, charged to lab 1; it sets this round's assignments. */
  async plan(round: number, chat: Chat, price: (u: Usage) => number, log: (a: Action) => void): Promise<void> {
    const reply = await chat(this.plannerSystem(), [{ role: 'user', content: this.plannerPrompt(round) }]);
    const cost = price(reply.usage);
    this.spent[0] += cost;
    this.plans = [];
    // A planner may give a lab several lines (one per lemma): the lab gets all of them, in order.
    for (const m of reply.text.matchAll(/^\s*LAB\s*(\d+)\s*:\s*(.+)$/gim)) {
      const i = Number(m[1]) - 1;
      this.plans[i] = this.plans[i] ? `${this.plans[i]}\n${m[2].trim()}` : m[2].trim();
    }
    const a: Action = { round, agent: 0, model: this.opts.agents[0], kind: 'plan', ok: this.plans.length > 0, turns: 1, usage: reply.usage, cost, spentAfter: this.spent[0], transcript: [{ text: reply.text, proof: null, errors: [] }], t: Date.now() };
    this.actions.push(a);
    log(a);
  }

  /** One agent's action this round: a reply, then Lean, with repairs. */
  async act(i: number, round: number, chat: Chat, price: (u: Usage) => number, log: (a: Action) => void): Promise<Action> {
    const model = this.opts.agents[i];
    const system = this.systemPrompt(i);
    const messages: { role: 'user' | 'assistant'; content: unknown }[] = [{ role: 'user', content: this.turnPrompt(i, round) }];
    const usage: Usage = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, cost: 0 };
    const transcript: Action['transcript'] = [];
    const servedBy: string[] = [];
    let kind: Action['kind'] = 'none', target: string | undefined, lemma: ReturnType<typeof parseLemma> = null, ok = false, reason = '';
    const repairs = this.opts.repairsByLab?.[i] ?? this.opts.repairs;
    for (let k = 0; k <= repairs; k++) {
      const reply = await chat(system, messages);
      for (const key of ['input', 'output', 'cacheRead', 'cacheWrite'] as const) usage[key] += reply.usage[key];
      usage.cost = (usage.cost ?? 0) + (reply.usage.cost ?? 0);
      if (reply.usage.provider) servedBy.push(reply.usage.provider);
      this.spent[i] += price(reply.usage);
      const text = reply.text;
      if (/ACTION:\s*pass\b/i.test(text)) {
        // Labs that may not stop lose only this turn.
        if (this.opts.mayStop === false) { reason = 'tried to pass, which is not allowed: turn skipped'; transcript.push({ ...(reply.reasoning ? { reasoning: reply.reasoning } : {}), text, proof: null, errors: [] }); break; }
        kind = 'pass'; reason = 'passed'; this.passed.add(i); transcript.push({ ...(reply.reasoning ? { reasoning: reply.reasoning } : {}), text, proof: null, errors: [] }); break;
      }
      const { action, code } = parseReply(text);
      let errors: string[] = [];
      if (reply.stop === 'refusal') { reason = 'declined'; transcript.push({ ...(reply.reasoning ? { reasoning: reply.reasoning } : {}), text, proof: null, errors: ['declined'] }); break; }
      if (!text.trim()) errors = ['Your reply ran out of length before it gave an answer. Think for less, then give the ACTION line and the code block.'];
      else if (!action || !code) errors = ['Start with ACTION: target <ID> or ACTION: lemma, then one ```lean code block.'];
      else if (action[1].toLowerCase() === 'conjecture') {
        kind = 'conjecture'; target = action[2].toUpperCase();
        const k = this.conjectures.find((x) => x.cid === target);
        if (!k) errors = [`There is no conjecture ${target}.`];
        else {
          const visibleDone = this.provedConjecture(k.cid);
          if (visibleDone && (visibleDone.public || visibleDone.author === i)) errors = [`${k.cid} is already proved: cite it as ${visibleDone.name}.`];
          else {
            const r = await check(k, proofBody(code), { library: this.checkLibrary(i), allowGrind: this.opts.allowGrind });
            errors = r.errors;
            if (r.ok) {
              ok = true;
              const hidden = this.library.find((e) => e.conjecture === k.cid && e.author !== i);
              if (hidden) reason = `duplicate of lab ${hidden.author + 1}'s private result`;
              const e: Entry = { name: this.uniqueName(`conj_${k.cid}`), ns: k.ns, signature: k.signature, author: i, conjecture: k.cid, public: false, round, uses: r.uses.filter((u) => !FREE.includes(u)), size: proofSize(code.replace(/^\s*:=/, '')) };
              this.library.push(e);
              if (atOnce(this.opts.rules)) this.publish(e, round);
            }
          }
        }
      } else if (action[1].toLowerCase() === 'target') {
        kind = 'target'; target = action[2].toUpperCase();
        const t = this.targets.find((x) => x.publicId === target);
        if (!t) errors = [`There is no target ${target}.`];
        else {
          const r = await check(t, proofBody(code), { library: this.checkLibrary(i), allowGrind: this.opts.allowGrind });
          errors = r.errors;
          if (r.ok) {
            ok = true;
            const e: Entry = { name: this.uniqueName(`target_${t.publicId}`), ns: t.ns, signature: t.signature, author: i, target: t.publicId, public: false, round, uses: r.uses.filter((u) => !FREE.includes(u)) };
            const already = this.solved(t.publicId);
            e.size = proofSize(proofBody(code).replace(/^\s*:=/, ''));
            this.library.push(e);
            if (already) reason = 'already solved by another lab: duplicate';
            else if (this.opts.rules === 'traditional' || this.opts.publishing === 'choose') this.publishBundle(e, round);
            else this.publish(e, round);
          }
        }
      } else {
        kind = 'lemma';
        lemma = parseLemma(code);
        if (!lemma) errors = [/^\s*(?:theorem|lemma)\s+[\w']+\./.test(code) ? 'Lemma names cannot contain a dot: use a plain name such as pow_add.' : 'Give the whole declaration: theorem <name> <statement> := <proof>.'];
        else if (this.targets.some((t) => norm(t.signature) === norm(lemma!.signature))) errors = ['That is a posted target: use ACTION: target <ID> instead.'];
        else {
          const r = await check({ ns: 'OSO', signature: lemma.signature }, lemma.proof.replace(new RegExp(`(?<![\\w.])${lemma.name}(?![\\w'])`, 'g'), 'attempt'), { library: this.checkLibrary(i), allowGrind: this.opts.allowGrind });
          errors = r.errors;
          if (r.ok) {
            // The trivial-result screen: a statement one basic tactic proves earns nothing.
            let trivial = false;
            for (const tac of TRIVIAL) if ((await check({ ns: 'OSO', signature: lemma.signature }, tac, { library: [] })).ok) { trivial = true; break; }
            // A restatement of a published result (renamed variables, say) is not new: one step from it proves it.
            // Checked before the duplicate test and the name, so nothing waits between those and joining the library: two labs in one round must not take the same name.
            let known = false;
            if ((this.opts.knowledge === 'proof-size' || this.opts.knowledge === 'flat-mint') && !trivial) {
              const pub = this.library.filter((x) => x.public && !x.trivial).map((x) => `${x.ns}.${x.name}`);
              if (pub.length) known = (await check({ ns: 'OSO', signature: lemma.signature }, `:= by first ${pub.map((n) => `| (apply ${n} <;> assumption) | (apply ${n}; done)`).join(' ')}`, { library: this.checkLibrary(i) })).ok;
            }
            const dup = this.visible(i).find((e) => norm(e.signature) === norm(lemma!.signature));
            if (dup) { reason = `duplicate of ${dup.name}, which you can already cite`; }
            else {
              ok = true;
              if (trivial) reason = 'trivial: citable, but earns no mint';
              // Already proved by a lab this one cannot see (private, or under independent rules): work done twice.
              const hidden = this.library.find((e) => e.author !== i && norm(e.signature) === norm(lemma!.signature));
              if (hidden) reason = `duplicate of lab ${hidden.author + 1}'s ${hidden.public ? 'result' : 'private result'}`;
              const e: Entry = { name: this.uniqueName(lemma.name), ns: 'OSO', signature: lemma.signature, author: i, public: false, round, uses: r.uses.filter((u) => !FREE.includes(u)), ...(trivial ? { trivial } : {}) };
              e.size = proofSize(lemma.proof.replace(/^\s*:=/, ''));
              if (known) e.known = true;
              this.library.push(e);
              if (this.opts.publishing === 'choose') {
                // The lab's choice; without a PUBLISH line the lemma stays private (counted, and β is also given over explicit choices).
                const c = publishChoice([...transcript.map((t) => t.text ?? ''), text]);
                e.choice = c ?? 'none';
                if (c === 'yes') this.publishBundle(e, round);
              } else if (atOnce(this.opts.rules)) this.publish(e, round);
            }
          }
        }
      }
      transcript.push({ ...(reply.reasoning ? { reasoning: reply.reasoning } : {}), text, proof: code, errors });
      if (ok || reason) break;
      if (this.spent[i] >= this.budgetOf(i)) { reason = 'budget spent'; break; }
      messages.push({ role: 'assistant', content: reply.content });
      messages.push({ role: 'user', content: `Not accepted:\n\n${errors.join('\n\n').slice(0, 5000)}\n\nFix it and reply again in the same format.` });
    }
    const made = ok ? this.library.filter((e) => e.author === i && e.round === round).at(-1) : undefined;
    if (made) made.cost = price(usage);
    const a: Action = {
      round, agent: i, model, kind, target, name: lemma?.name, signature: lemma?.signature, ok, reason: reason || (ok ? undefined : 'not accepted'),
      ...(made ? { entry: made.name, uses: made.uses } : {}),
      turns: transcript.length, usage, cost: price(usage), spentAfter: this.spent[i], ...(servedBy.length ? { servedBy } : {}), transcript, t: Date.now(),
    };
    this.actions.push(a);
    log(a);
    return a;
  }

  /** The money lab i may spend: its fixed budget, or what the funder has released to it so far. */
  budgetOf(i: number) { return this.opts.follow === undefined ? this.opts.budget : this.released[i]; }
  active(i: number) { return this.spent[i] < this.budgetOf(i) && !this.passed.has(i); }
  /** Money follows earnings: the start of a round, when the funder releases this round's money. */
  fund() {
    const f = this.opts.follow;
    if (f === undefined) return;
    const n = this.opts.agents.length, perRound = (this.opts.budget * n) / this.opts.rounds;
    const working = this.opts.agents.map((_, i) => i).filter((i) => !this.passed.has(i));
    const total = working.reduce((a, i) => a + this.recent[i], 0);
    for (const i of working) this.released[i] += perRound * ((1 - f) / working.length + f * (total > 0 ? this.recent[i] / total : 1 / working.length));
  }
  /** What lab i would get next round at its current recent earnings (shown to it). */
  nextFunding(i: number) {
    const f = this.opts.follow ?? 0, n = this.opts.agents.length, perRound = (this.opts.budget * n) / this.opts.rounds;
    const working = this.opts.agents.map((_, k) => k).filter((k) => !this.passed.has(k));
    const total = working.reduce((a, k) => a + this.recent[k], 0);
    return this.passed.has(i) ? 0 : perRound * ((1 - f) / working.length + f * (total > 0 ? this.recent[i] / total : 1 / working.length));
  }
  /** Money follows earnings: the end of a round; `before` is each lab's earnings when the round began. */
  settle(before: number[]) { this.recent = this.recent.map((e, i) => 0.7 * e + 0.3 * (this.earnings[i] - before[i])); }
  done() {
    if (this.targets.every((t) => this.solved(t.publicId))) return true;
    // Money released round by round: a lab out of money now gets more next round, so only passing or the whole budget ends it.
    if (this.opts.follow !== undefined) return this.opts.agents.every((_, i) => this.passed.has(i)) || this.spent.reduce((a, b) => a + b, 0) >= this.opts.budget * this.opts.agents.length;
    return this.opts.agents.every((_, i) => !this.active(i) || (this.opts.rules === 'planner' && i === 0));
  }
}

/** A stand-in agent that plays from the reference proofs: tests the mechanics without a model. */
export function referenceAgent(com: Community, i: number): Chat {
  const tasks = loadTasks(com.opts.problems);
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
    const conj = com.conjectures.find((k) => k.name === next.name);
    const text = next.posted
      ? `ACTION: target ${next.publicId}\n\`\`\`lean\n${proof}\n\`\`\``
      : conj ? `ACTION: conjecture ${conj.cid}\n\`\`\`lean\n${proof}\n\`\`\``
      : `ACTION: lemma\n\`\`\`lean\ntheorem ${next.short} ${next.signature} ${proof.trimStart().startsWith('|') ? '\n' + proof : proof}\n\`\`\`${com.opts.publishing === 'choose' ? `\nPUBLISH: ${(i + com.actions.length) % 3 ? 'yes' : 'no'}` : ''}`;
    return { text, content: text, usage, stop: 'end_turn' };
  };
}

export interface CommunityResult { opts: CommunityOptions; actions: Action[]; library: Entry[]; earnings: number[]; spent: number[]; /** Why the run ended early, if it did (for example, out of credit). */ stopped?: string }

/** What an action cost: the charge, or the list price for runs recorded before charges were used. */
export const costOf = (a: Action) => a.cost ?? a.listCost ?? 0;
/** Whether a run's money is the provider's charge (true) or list prices (older runs). */
export const charged = (r: CommunityResult) => r.actions.every((a) => a.cost !== undefined);

/** Runs one community to the end: rounds of one action per agent with budget left, in parallel. */
export async function runCommunity(opts: CommunityOptions, chatFor: (com: Community, i: number) => Chat, price: (model: string, u: Usage) => number, runId: string, log = console.log, root = join(LEAN_DIR, 'runs')): Promise<CommunityResult> {
  const com = new Community(opts);
  const dir = join(root, runId);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'options.json'), JSON.stringify({ kind: 'community', ...opts, rewards: { gaps: LEAN_REWARDS.gaps(opts) } }, null, 1));
  // The exact instructions each lab gets, as sent (the viewer shows these; the code's wording may change later).
  writeFileSync(join(dir, 'prompts.json'), JSON.stringify(opts.agents.map((_, i) => com.systemPrompt(i)), null, 1));
  const file = join(dir, 'actions.jsonl');
  writeFileSync(file, '');
  const chats = opts.agents.map((_, i) => chatFor(com, i));
  let stopped: string | undefined;
  for (let round = 1; round <= opts.rounds && !com.done() && !stopped; round++) {
    com.fund();
    const before = [...com.earnings], spentBefore = [...com.spent];
    if (opts.rules === 'planner') {
      com.plans = [];
      if (com.active(0)) await com.plan(round, chats[0], (u) => price(opts.agents[0], u), (a) => appendFileSync(file, JSON.stringify(a) + '\n')).catch((e) => {
        const msg = (e as Error).message;
        log(`  round ${round} · planner: error ${msg}`);
        if (/\b402\b|credits/i.test(msg)) stopped = 'out of credit';
      });
      if (stopped) break;
      const last = com.actions.at(-1);
      if (last?.kind === 'plan') log(`  round ${round} · planner: ${com.plans.filter(Boolean).length} assignments · $${costOf(last).toFixed(3)}`);
    }
    // Under planner rules lab 1 only plans.
    const active = opts.agents.map((_, i) => i).filter((i) => com.active(i) && !(opts.rules === 'planner' && i === 0));
    await Promise.all(active.map((i) => com.act(i, round, chats[i], (u) => price(opts.agents[i], u), (a) => {
      // The model's thinking is long (tens of thousands of tokens a turn): it goes to its own file, keyed by the
      // action's place in actions.jsonl, so the action log stays small.
      if (a.transcript.some((x) => x.reasoning)) {
        appendFileSync(join(dir, 'reasoning.jsonl'), JSON.stringify({ action: com.actions.indexOf(a), round, agent: i, reasoning: a.transcript.map((x) => x.reasoning ?? null) }) + '\n');
        for (const x of a.transcript) delete x.reasoning;
      }
      appendFileSync(file, JSON.stringify(a) + '\n');
      const solved = com.targets.filter((t) => com.solved(t.publicId)).length;
      log(`  round ${round} · agent ${i + 1} (${a.model.split('/').pop()}): ${a.kind === 'target' ? `target ${a.target}` : a.kind === 'conjecture' ? `conjecture ${a.target}` : a.kind === 'lemma' ? `lemma ${a.name ?? '?'}` : a.kind === 'pass' ? 'passed' : 'no action'} ${a.ok ? 'accepted' : 'failed'}${a.reason ? ` (${a.reason})` : ''} · $${costOf(a).toFixed(3)} · ${solved}/${com.targets.length} targets solved`);
    }).catch((e) => {
      const msg = (e as Error).message;
      log(`  round ${round} · agent ${i + 1}: error ${msg}`);
      // Kept in the log, so a lost turn is counted, not silently missing.
      const a: Action = { round, agent: i, model: opts.agents[i], kind: 'error', ok: false, reason: msg.slice(0, 500), turns: 0, usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 }, cost: com.spent[i] - spentBefore[i], spentAfter: com.spent[i], transcript: [], t: Date.now() } as Action;
      com.actions.push(a);
      appendFileSync(file, JSON.stringify(a) + '\n');
      // Out of credit: every later call fails too, so the run would only look like labs giving up.
      if (/\b402\b|credits/i.test(msg)) stopped = 'out of credit';
    })));
    com.settle(before);
  }
  if (stopped) log(`  stopped: ${stopped}`);
  const result: CommunityResult = { opts, actions: com.actions, library: com.library, earnings: com.earnings, spent: com.spent, ...(stopped ? { stopped } : {}) };
  writeFileSync(join(dir, 'result.json'), JSON.stringify(result, null, 1));
  return result;
}

export function readCommunity(runId: string): CommunityResult {
  return JSON.parse(readFileSync(join(LEAN_DIR, 'runs', runId, 'result.json'), 'utf8')) as CommunityResult;
}

/* ---------------------------------------------------------------------------- Comparing communities */


/** Targets solved by community spend, in the order actions finished. */
/** The targets a result is judged on. */
const postedCount = (r: CommunityResult) => loadTasks(r.opts.problems).filter((t) => t.posted).length;
export const countedOf = (r: CommunityResult) => (r.opts.counted?.length ? r.opts.counted : loadTasks(r.opts.problems).filter((t) => t.posted).map((t) => t.publicId));

/** Money all labs together had spent by the end of each round. Labs work at the same time, so a proof is counted with its whole round: otherwise the calls still running when it came in would be left out. */
export function moneyByRound(actions: Action[]): Map<number, number> {
  const inRound = new Map<number, number>();
  for (const a of actions) inRound.set(a.round, (inRound.get(a.round) ?? 0) + costOf(a));
  let total = 0;
  return new Map([...inRound].sort(([x], [y]) => x - y).map(([round, m]) => [round, (total += m)] as [number, number]));
}

export function progress(r: CommunityResult): [number, number][] {
  const counted = new Set(countedOf(r));
  const acts = [...r.actions].sort((a, b) => a.t - b.t);
  const solved = new Set<string>(), money = moneyByRound(r.actions);
  const pts: [number, number][] = [[0, 0]];
  for (const a of acts) {
    if (a.kind === 'target' && a.ok && a.target && counted.has(a.target)) solved.add(a.target);
    pts.push([money.get(a.round)!, solved.size]);
  }
  return pts;
}

export function stats(r: CommunityResult) {
  const lemmas = r.actions.filter((a) => a.kind === 'lemma');
  const solved = new Set(r.actions.filter((a) => a.kind === 'target' && a.ok).map((a) => a.target));
  const deepest = Math.max(0, ...[...solved].map((id) => loadTasks(r.opts.problems).find((t) => t.publicId === id)?.depth ?? 0));
  return {
    rules: r.opts.rules,
    targetsSolved: solved.size,
    countedSolved: [...solved].filter((t) => countedOf(r).includes(t!)).length,
    counted: countedOf(r).length,
    conjecturesProved: new Set(r.actions.filter((a) => a.kind === 'conjecture' && a.ok).map((a) => a.target)).size,
    /** Accepted results whose proof used another lab's result: the community building on itself. */
    /** Sharing (the simulation's β): of the lemmas proved (not trivial, not targets), the share published in the round they were proved. */
    sharedAtOnce: (() => { const xs = r.library.filter((e) => !e.target && !e.trivial); return xs.length ? xs.filter((e) => e.public && e.publishedRound === e.round).length / xs.length : null; })(),
    /** Labs choosing: the share published at once among lemmas with an explicit PUBLISH line. */
    sharedOfChosen: (() => { const xs = r.library.filter((e) => e.choice === 'yes' || e.choice === 'no'); return xs.length ? xs.filter((e) => e.choice === 'yes').length / xs.length : null; })(),
    /** Labs choosing: lemmas kept private because the reply gave no PUBLISH line. */
    noChoice: r.library.filter((e) => e.choice === 'none').length,
    /** The knowledge reward by proof size: mean proof size of accepted lemmas (to spot padding). */
    lemmaSize: (() => { const xs = r.library.filter((e) => !e.target && e.size); return xs.length ? xs.reduce((a, e) => a + e.size!, 0) / xs.length : null; })(),
    builtOnOthers: firstProofs(r.library).filter((e) => e.uses.some((u) => { const x = r.library.find((y) => `${y.ns}.${y.name}` === u); return x && x.author !== e.author; })).length,
    deepestTarget: deepest,
    /** Value gained: the prizes of the targets solved (4 at depth 1, doubling with each level). */
    value: [...solved].reduce((a, id) => a + 4 * 2 ** ((loadTasks(r.opts.problems).find((t) => t.publicId === id)?.depth ?? 1) - 1), 0),
    spent: r.spent.reduce((a, b) => a + b, 0),
    budget: r.opts.budget * r.opts.agents.length,
    actions: r.actions.length,
    lemmasAccepted: lemmas.filter((a) => a.ok && !/trivial/.test(a.reason ?? '')).length,
    /** Groundwork done twice: a lemma or posted conjecture proved again when the same statement was already proved (by the lab or another). */
    lemmasDuplicate: r.actions.filter((a) => (a.kind === 'lemma' || a.kind === 'conjecture') && /duplicate/.test(a.reason ?? '')).length,
    /** Targets proved again after another lab had already proved them. */
    targetsDuplicate: r.actions.filter((a) => a.kind === 'target' && /duplicate/.test(a.reason ?? '')).length,
    /** Turns lost to an error the harness could not recover from (a call that failed after its retries). */
    errors: r.actions.filter((a) => a.kind === 'error').length,
    trivial: lemmas.filter((a) => /trivial/.test(a.reason ?? '')).length,
    failed: r.actions.filter((a) => a.kind !== 'plan' && a.kind !== 'error' && !a.ok && !/duplicate|trivial/.test(a.reason ?? '')).length,
    /** Planner rounds whose reply gave no usable `LAB n:` line. */
    plansUnusable: r.actions.filter((a) => a.kind === 'plan' && !a.ok).length,
    published: r.library.filter((e) => e.public).length,
    neverPublished: r.library.filter((e) => !e.public).length,
    earnings: r.earnings,
  };
}

/** When a test started: its first action. */
const firstAt = (rs: CommunityResult[]) => { const ts = rs.flatMap((r) => r.actions.map((a) => a.t)).filter(Boolean); return ts.length ? new Date(Math.min(...ts)).toISOString() : undefined; };

export function writeCommunityComparison(id: string, runs: { runId: string; result: CommunityResult }[], note = '', standIn = false): string {
  const who = standIn ? 'stand-in agents' : 'real agents';
  const dir = join(RESULTS_DIR, 'community', id);
  mkdirSync(join(dir, 'figures'), { recursive: true });
  const curves = runs.map((x) => ({ ...x, pts: progress(x.result), st: stats(x.result) }));
  const label = (rules: Rules) => (rules === 'oso' ? 'OSO' : 'Traditional');
  const maxX = Math.max(...curves.map((c) => c.st.budget), 1e-6);
  const money = runs.every((x) => charged(x.result)) ? 'as charged' : 'at list prices';
  writeFileSync(join(dir, 'figures', 'progress.svg'), lineChart({
    title: `Targets solved for the money: ${who}, OSO vs traditional`,
    subtitle: `Same agents and budget ($${maxX.toFixed(2)} ${money}); Lean checks every proof.`,
    xLabel: 'Dollars spent by the community', yLabel: 'Targets solved',
    series: curves.map((c) => ({ name: label(c.result.opts.rules), slot: c.result.opts.rules === 'oso' ? 2 : 1, points: c.pts })) as never,
    x: [0, maxX], y: [0, 8], xTicks: [0, maxX / 4, maxX / 2, (3 * maxX) / 4, maxX], yTicks: [0, 2, 4, 6, 8],
    format: { x: (v) => `$${v.toFixed(2)}`, y: (v) => String(v) },
  }));
  const o = runs[0].result.opts;
  const rows = curves.map((c) => ({
    rules: label(c.result.opts.rules), 'targets solved': `${c.st.targetsSolved} of ${postedCount(c.result)}`, 'deepest target': c.st.deepestTarget,
    spent: `$${c.st.spent.toFixed(2)} of $${c.st.budget.toFixed(2)}`, 'value gained': c.st.value, 'ROI (value per $)': c.st.spent > 0 ? Math.round(c.st.value / c.st.spent) : '–', actions: c.st.actions, 'lemmas accepted': c.st.lemmasAccepted,
    'lemmas proved twice': c.st.lemmasDuplicate, 'targets proved twice': c.st.targetsDuplicate, trivial: c.st.trivial, 'failed attempts': c.st.failed, 'never published': c.st.neverPublished,
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

- **Agents:** ${o.agents.map((m, i) => `agent ${i + 1}: \`${m}\``).join(', ')}; each with $${o.budget} ${money}; reasoning effort ${o.effort}.
- **Each round,** every agent with budget left takes one action: prove a target, or state and prove a new lemma; up to ${o.repairs} repairs on Lean's errors.
- **Traditional:** lemmas stay private until their author proves a target; the target and the lemmas it rests on are then published and the author takes the bounty. **OSO:** every idea is published at once; mint ${o.mint}${o.c !== undefined ? `, c = ${o.c}` : ''}, α = ${o.alpha}.
- **Duplicated work:** a lemma proved again when another agent already had it (privately, under traditional rules), or a target solved twice, for example by two agents in the same round. **Trivial:** one basic tactic proves it; it can be cited but earns no mint. **Agents may pass** when nothing seems worth their budget, and keep the rest.
- **One run per setting:** results vary from run to run; several runs are needed before reading much into a difference.

Runs: ${runs.map((x) => x.runId).join(', ')}. Transcripts (with proofs) are private.
`;
  if (!standIn) writeCard(dir, {
    ranAt: firstAt(runs.map((x) => x.result)),
    id, kind: 'race', date: new Date(Math.min(...runs.map((x) => x.result.actions[0]?.t ?? Date.now()))).toISOString().slice(0, 10), title: 'First AI test, OSO vs traditional',
    design: { question: 'For the same money, does an OSO community of AI agents solve more targets than a traditional one?', compare: 'traditional rules and OSO rules', fixed: `the same ${o.agents.length} agents, $${o.budget} each, no personas`, measure: 'targets solved', better: 'higher', runs: '1 run per side' },
    answer: verdict.replace(/\*\*/g, ''), table: rows.map((r) => ({ rules: r.rules, 'targets solved': r['targets solved'], spent: r.spent, 'ROI (value per $)': r['ROI (value per $)'], 'lemmas accepted': r['lemmas accepted'], 'lemmas proved twice': r['lemmas proved twice'], 'targets proved twice': r['targets proved twice'] })),
    caveats: ['One run per side: no verdict either way.', ...(note ? [note] : [])],
    page: `results/community/${id}/summary.md`,
    chart: `results/community/${id}/figures/progress.svg`,
  }, md.replace(/^# .*\n/, '').replace(/!\[[^\]]*\]\(figures\/progress\.svg\)\n*/, ''));
  else writeFileSync(join(dir, 'summary.md'), md);
  writeFileSync(join(dir, 'data.json'), JSON.stringify({ id, runs: runs.map((x) => x.runId), stats: curves.map((c) => c.st), curves: curves.map((c) => ({ rules: c.result.opts.rules, points: c.pts })) }, null, 1) + '\n');
  return dir;
}

/* ------------------------------------------------------------------------- A series of repeated races */

export interface Pair { rep: number; traditional: CommunityResult; oso: CommunityResult }
type Side = keyof Omit<Pair, 'rep'>;

/**
 * Several races with the same design, summarized on the measure fixed in advance: counted targets
 * solved for the same budget, mean and spread over runs; verdict against two standard errors.
 */
export interface RaceDesign { /** Set when the result must not be used, with the reason. */ invalid?: string; title?: string; question?: string; compare?: string; fixed?: string; caveats?: string[]; prose?: string; primary?: { kind: 'spendTo'; k: number } }

/** Spend at which a run first had k counted targets solved (null if never). */
export function spendTo(r: CommunityResult, k: number): number | null {
  const p = progress(r).find(([, y]) => y >= k);
  return p ? p[0] : null;
}

export function writeRaceSeries(id: string, pairs: Pair[], designIn: string | RaceDesign): string {
  const dsg: RaceDesign = typeof designIn === 'string' ? { prose: designIn } : designIn;
  const design = dsg.prose ?? '';
  const dir = join(RESULTS_DIR, 'community', id);
  mkdirSync(join(dir, 'figures'), { recursive: true });
  const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length);
  const sd = (xs: number[]) => { const m = mean(xs); return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, xs.length - 1)); };
  const side = (k: Side) => pairs.map((p) => stats(p[k]));
  const T = side('traditional'), O = side('oso');
  const counted = countedOf(pairs[0].oso);
  const priced = pairs.every((p) => charged(p.oso) && charged(p.traditional)) ? 'as charged' : 'at list prices';
  const stoppedRuns = pairs.flatMap((p) => [p.traditional, p.oso]).filter((r) => r.stopped);
  const invalid = dsg.invalid ?? (stoppedRuns.length ? `${stoppedRuns.length} run(s) stopped early (${stoppedRuns[0].stopped}).` : undefined);
  const m = (xs: { [k: string]: unknown }[], key: string) => mean(xs.map((x) => Number(x[key])));
  const se = (xs: number[]) => (xs.length > 1 ? sd(xs) / Math.sqrt(xs.length) : Infinity);
  const tC = T.map((x) => x.countedSolved), oC = O.map((x) => x.countedSolved);
  const diff = mean(oC) - mean(tC), margin = 2 * Math.hypot(se(oC), se(tC));
  let verdict = pairs.length < 2 ? 'one run per side: no verdict'
    : diff > margin ? 'OSO ahead' : diff < -margin ? 'traditional ahead' : 'no clear difference';
  // Main measure, when declared: money spent to solve k targets that count (a run that never does counts as its whole budget).
  const primaryK = dsg.primary?.kind === 'spendTo' ? dsg.primary.k : null;
  const budgetOf = (r: CommunityResult) => r.opts.budget * r.opts.agents.length;
  const spendK = (side: Side) => pairs.map((p) => spendTo(p[side], primaryK ?? 1) ?? budgetOf(p[side]));
  const reachedK = (side: Side) => pairs.filter((p) => spendTo(p[side], primaryK ?? 1) !== null).length;
  const tS = spendK('traditional'), oS = spendK('oso');
  if (primaryK !== null && pairs.length > 1) {
    const d = mean(tS) - mean(oS), mg = 2 * Math.hypot(se(oS), se(tS));
    verdict = d > mg ? 'OSO ahead' : d < -mg ? 'traditional ahead' : 'no clear difference';
  }
  // Chart: every run's curve, thin; OSO orange, traditional blue.
  const budget = pairs[0].oso.opts.budget * pairs[0].oso.opts.agents.length;
  const W = 760, H = 380, l = 56, rt = 170, tp = 70, bt = 48, pw = W - l - rt, ph = H - tp - bt, Y = counted.length;
  const sx = (x: number) => l + (x / budget) * pw, sy = (y: number) => tp + ph - (y / Math.max(1, Y)) * ph;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Counted targets solved for the money, every run"><style>
  .bg{fill:#fcfcfb} text{fill:#0b0b0b;font-family:Helvetica,Arial,sans-serif} .s{fill:#52514e;font-size:12px} .g{stroke:#e6e5e1} .o{stroke:#eb6834} .t{stroke:#2a78d6} .of{fill:#eb6834} .tf{fill:#2a78d6}
  @media (prefers-color-scheme: dark){.bg{fill:#1a1a19} text{fill:#fff} .s{fill:#c3c2b7} .g{stroke:#34332f} .o{stroke:#d95926} .t{stroke:#3987e5} .of{fill:#d95926} .tf{fill:#3987e5}}</style>
  <rect class="bg" width="${W}" height="${H}" rx="8"/><text x="${l}" y="28" font-size="16" font-weight="700">Targets that count, by money spent (${pairs.length} run${pairs.length > 1 ? 's' : ''} per side)</text>
  <rect class="of" x="${l}" y="40" width="12" height="10" rx="2"/><text class="of" x="${l + 17}" y="49" font-size="12" font-weight="700">OSO</text><rect class="tf" x="${l + 60}" y="40" width="12" height="10" rx="2"/><text class="tf" x="${l + 77}" y="49" font-size="12" font-weight="700">Traditional</text><text class="s" x="${l + 160}" y="49">each line is one run</text>`;
  for (let y = 0; y <= Y; y++) svg += `<line class="g" x1="${l}" x2="${l + pw}" y1="${sy(y)}" y2="${sy(y)}"/><text class="s" x="${l - 8}" y="${sy(y) + 4}" text-anchor="end">${y}</text>`;
  for (const k of [0, 0.25, 0.5, 0.75, 1]) svg += `<text class="s" x="${sx(budget * k)}" y="${tp + ph + 18}" text-anchor="middle">$${(budget * k).toFixed(2)}</text>`;
  svg += `<text class="s" x="${l + pw / 2}" y="${H - 10}" text-anchor="middle">Dollars spent by the community (list prices)</text>`;
  for (const p of pairs) for (const k of ['traditional', 'oso'] as Side[]) {
    const pts = progress(p[k]);
    let d = ''; pts.forEach(([x, y], i) => { d += i ? ` H${sx(x).toFixed(1)} V${sy(y).toFixed(1)}` : `M${sx(x).toFixed(1)} ${sy(y).toFixed(1)}`; });
    svg += `<path d="${d}" fill="none" class="${k === 'oso' ? 'o' : 't'}" stroke-width="1.8" stroke-opacity="0.6"><title>${k === 'oso' ? 'OSO' : 'Traditional'}, run ${p.rep}: ${pts.at(-1)![1]} for $${pts.at(-1)![0].toFixed(2)}</title></path>`;
  }
  const ends: [number, string, string][] = [[sy(mean(oC)), `OSO: ${mean(oC).toFixed(1)} on average`, 'of'], [sy(mean(tC)), `Traditional: ${mean(tC).toFixed(1)}`, 'tf']];
  ends.sort((a, b) => a[0] - b[0]); if (ends[1][0] - ends[0][0] < 16) ends[1][0] = ends[0][0] + 16;
  for (const [y, t, c] of ends) svg += `<circle class="${c}" cx="${l + pw + 10}" cy="${y}" r="4"/><text class="${c}" x="${l + pw + 18}" y="${y + 4}" font-size="12" font-weight="700">${t}</text>`;
  writeFileSync(join(dir, 'figures', 'progress.svg'), svg + '</svg>');

  const f1 = (x: number) => x.toFixed(1), f2 = (x: number) => x.toFixed(2);
  const ms = (xs: number[]) => `${f1(mean(xs))} ± ${f1(sd(xs))}`;
  const rows = [['traditional', T], ['oso', O]].map(([k, S]) => {
    const st = S as ReturnType<typeof stats>[];
    return `| ${k === 'oso' ? 'OSO' : 'Traditional'} | ${ms(st.map((x) => x.countedSolved))} of ${counted.length} | ${ms(st.map((x) => x.targetsSolved))} of ${postedCount(pairs[0].oso)} | $${f2(m(st, 'spent'))} | ${ms(st.map((x) => x.conjecturesProved))} | ${ms(st.map((x) => x.lemmasDuplicate))} | ${ms(st.map((x) => x.builtOnOthers))} |`;
  });
  const perRun = pairs.map((p, n) => `| ${p.rep} | ${T[n].countedSolved} | $${f2(T[n].spent)} | ${O[n].countedSolved} | $${f2(O[n].spent)} | ${T[n].lemmasDuplicate} | ${O[n].lemmasDuplicate} | ${O[n].builtOnOthers} |`);
  const o = pairs[0].oso.opts;
  const md = `# Real agents, OSO vs traditional: ${id}

**${verdict === 'OSO ahead' ? `OSO ahead: ${f1(mean(oC))} against ${f1(mean(tC))} targets that count (${pairs.length} runs each).`
    : verdict === 'traditional ahead' ? `Traditional ahead: ${f1(mean(tC))} against ${f1(mean(oC))} targets that count (${pairs.length} runs each).`
    : verdict === 'no clear difference' ? `No clear difference: OSO ${f1(mean(oC))}, traditional ${f1(mean(tC))} targets that count (${pairs.length} runs each).`
    : `One run per side: OSO ${f1(mean(oC))}, traditional ${f1(mean(tC))} counted targets; too few runs for a verdict.`}**

The verdict compares the mean number of counted targets solved against two standard errors. The measure and the design were fixed before the runs.

![Counted targets solved for the money](figures/progress.svg)

| rules | counted targets solved | all targets | spent (mean) | conjectures proved | lemmas proved twice | built on another agent's idea |
| --- | --- | --- | --- | --- | --- | --- |
${rows.join('\n')}

Values are mean ± standard deviation over runs.

## The design, fixed in advance

${design}

- **Counted targets:** ${counted.join(', ')}. The others are warm-ups: solved, they are reported but do not count.
- **Agents:** ${o.agents.map((mdl, i) => `agent ${i + 1}: \`${mdl}\`${o.personaNames?.[i] ? ` as ${o.personaNames[i]}` : ''}`).join('; ')}. The same agents and personas on both sides.
- **Budget:** $${o.budget} per agent ${priced}; up to ${o.rounds} rounds. **Posted conjectures:** ${o.conjectures?.length ?? 0}, bounty ${o.conjectureBounty ?? 1} each; their ids (K1, …) are neutral, and their statements are given to the agents but not listed here.
- **Rules:** traditional: ideas private until their agent proves a target, then published with it; OSO: everything published at once, α = ${o.alpha}${o.c !== undefined ? `, c = ${o.c}` : ''}, mint ${o.mint}.

## Every run

| run | traditional: counted | spent | OSO: counted | spent | traditional: lemmas twice | OSO: lemmas twice | OSO built on others |
| --- | --- | --- | --- | --- | --- | --- | --- |
${perRun.join('\n')}

Transcripts, with every proof, are private.
`;
  // Exploratory measures, computed the same way for every series and labelled as such.
  const ks = Array.from({ length: counted.length }, (_, i) => i + 1);
  const explore = ks.map((k) => {
    const cell = (side: Side) => {
      const xs = pairs.map((p) => spendTo(p[side], k)).filter((x): x is number => x !== null);
      return xs.length ? `$${(xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(2)} (${xs.length} of ${pairs.length} runs)` : 'never';
    };
    return { 'counted targets': k, traditional: cell('traditional'), OSO: cell('oso') };
  }).filter((r) => r.traditional !== 'never' || r.OSO !== 'never');
  const budgetUse = (m(T, 'spent') + m(O, 'spent')) / 2 / budget;
  const money = (x: number) => `$${x.toFixed(2)}`;
  const answer = primaryK === null ? md.split('\n').find((l) => l.startsWith('**'))!.replace(/\*\*/g, '')
    : `${verdict === 'OSO ahead' ? 'OSO ahead' : verdict === 'traditional ahead' ? 'Traditional ahead' : verdict === 'no clear difference' ? 'No clear difference' : 'One run per side'}: OSO solved ${primaryK} targets that count for ${money(mean(oS))} on average, traditional for ${money(mean(tS))} (${reachedK('oso')} and ${reachedK('traditional')} of ${pairs.length} runs got there).`;
  writeCard(dir, {
    ranAt: firstAt(pairs.flatMap((p) => [p.traditional, p.oso])),
    id, kind: 'race', date: new Date().toISOString().slice(0, 10), title: dsg.title ?? `AI models, OSO vs traditional (${id})`,
    design: {
      question: dsg.question ?? 'For the same money, does an OSO community of AI agents solve more of the counted targets than a traditional one?',
      compare: dsg.compare ?? 'traditional rules and OSO rules',
      fixed: dsg.fixed ?? `the same ${o.agents.length} agents and personas, $${o.budget} each, ${o.conjectures?.length ?? 0} posted conjectures`,
      measure: primaryK === null ? `targets solved, counting ${counted.join(', ')}` : `money spent to solve ${primaryK} of the targets that count (${counted.join(', ')}); a run that never does counts as its whole budget`,
      better: primaryK === null ? 'higher' : 'lower', runs: `${pairs.length} run${pairs.length > 1 ? 's' : ''} per side`,
    },
    answer,
    table: [['Traditional', T], ['OSO', O]].map(([name, S]) => {
      const st = S as ReturnType<typeof stats>[];
      const sp = name === 'OSO' ? oS : tS;
      return { rules: name as string, ...(primaryK !== null ? { [`money to ${primaryK} targets`]: `$${f2(mean(sp))} ± ${f2(sd(sp))}` } : {}), 'targets that count': `${ms(st.map((x) => x.countedSolved))} of ${counted.length}`, 'all targets': `${ms(st.map((x) => x.targetsSolved))} of 8`, spent: `$${f2(m(st, 'spent'))}`, 'ROI (value per $)': ms(st.map((x) => (x.spent > 0 ? x.value / x.spent : 0))), 'work done twice': ms(st.map((x) => x.lemmasDuplicate)), "used another agent's idea": ms(st.map((x) => x.builtOnOthers)) };
    }),
    caveats: [
      ...(dsg.caveats ?? []),
      ...(budgetUse < 0.7 ? [`Budgets were not binding: the communities spent ${Math.round(budgetUse * 100)}% of theirs on average, because agents passed.`] : []),
      'Values are mean ± standard deviation over runs.',
    ],
    cost: `$${(T.reduce((a, x) => a + x.spent, 0) + O.reduce((a, x) => a + x.spent, 0)).toFixed(2)} ${priced}`,
    ...(invalid ? { invalid } : {}),
    page: `results/community/${id}/summary.md`,
    chart: `results/community/${id}/figures/progress.svg`,
  }, `
**Exploratory** (not fixed in advance): mean spend at which a run had k counted targets solved.

${[`| ${Object.keys(explore[0] ?? { k: 1 }).join(' | ')} |`, `| ${Object.keys(explore[0] ?? { k: 1 }).map(() => '---').join(' | ')} |`, ...explore.map((r) => `| ${Object.values(r).join(' | ')} |`)].join('\n')}

${md.slice(md.indexOf('## The design'))}`);
  writeFileSync(join(dir, 'data.json'), JSON.stringify({ id, verdict, counted, runs: pairs.map((p, n) => ({ rep: p.rep, traditional: T[n], oso: O[n] })) }, null, 1) + '\n');
  return dir;
}
