// A language-model prover: one attempt is a first proof plus up to `repairs` corrections, each sent
// back with Lean's error messages (specification, section 6.2: "an agent proposes a statement and a
// proof, with a few repair turns on Lean's error messages").
import Anthropic from '@anthropic-ai/sdk';
import { check, type CheckOptions, type CheckResult } from './checker.ts';
import { definitions, type Task } from './tasks.ts';

export interface Usage { input: number; output: number; cacheRead: number; cacheWrite: number; /** Dollars, when the provider reports it. */ cost?: number }
export interface Turn { proof: string | null; check: CheckResult | null; usage: Usage; stop: string }

/** One model call: the conversation so far → the reply's text, the raw content to send back, usage. */
export type Chat = (system: string, messages: { role: 'user' | 'assistant'; content: unknown }[]) =>
  Promise<{ text: string; content: unknown; usage: Usage; stop: string }>;

export type Provider = 'anthropic' | 'openrouter';
export interface ModelSettings { provider: Provider; model: string; effort: 'low' | 'medium' | 'high' | 'max'; maxTokens: number }
export const DEFAULT_MODELS: Record<Provider, string> = { anthropic: 'claude-opus-5-5', openrouter: 'anthropic/claude-opus-5.5' };
export const DEFAULT_MODEL: ModelSettings = { provider: 'anthropic', model: DEFAULT_MODELS.anthropic, effort: 'high', maxTokens: 32_000 };

/** The provider whose key is set: Anthropic first, then OpenRouter. */
export function defaultProvider(): Provider | null {
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (process.env.OPENROUTER_API_KEY) return 'openrouter';
  return null;
}

export function chatFor(settings: ModelSettings): Chat {
  return settings.provider === 'openrouter' ? openRouterChat(settings) : claudeChat(settings);
}

/**
 * OpenRouter's chat API, for any model it serves (Claude, GPT, Gemini, open models). Reasoning is
 * requested at the same effort, and passed back between turns so the model keeps its earlier thinking.
 */
export function openRouterChat(settings: ModelSettings): Chat {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error('OPENROUTER_API_KEY is not set');
  return async (system, messages) => {
    const body = {
      model: settings.model,
      max_tokens: settings.maxTokens,
      reasoning: { effort: settings.effort === 'max' ? 'high' : settings.effort },
      usage: { include: true },
      messages: [
        { role: 'system', content: system },
        ...messages.map((m) => {
          if (m.role === 'assistant' && m.content && typeof m.content === 'object') {
            const c = m.content as { text: string; reasoning_details?: unknown };
            return { role: 'assistant', content: c.text, ...(c.reasoning_details ? { reasoning_details: c.reasoning_details } : {}) };
          }
          return { role: m.role, content: String(m.content) };
        }),
      ],
    };
    for (let tryNo = 1; ; tryNo++) {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'X-Title': 'OSO experiment: Lean pilot' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15 * 60_000),
      });
      if ((res.status === 429 || res.status >= 500) && tryNo < 4) {
        await new Promise((ok) => setTimeout(ok, 5000 * tryNo));
        continue;
      }
      const json = await res.json() as {
        error?: { message: string };
        choices?: { message: { content: string | null; reasoning_details?: unknown }; finish_reason: string }[];
        usage?: { prompt_tokens: number; completion_tokens: number; prompt_tokens_details?: { cached_tokens?: number }; cost?: number };
      };
      if (!res.ok || json.error || !json.choices?.length) throw new Error(`OpenRouter ${res.status}: ${json.error?.message ?? 'no reply'}`);
      const choice = json.choices[0];
      const text = choice.message.content ?? '';
      const u = json.usage;
      const cached = u?.prompt_tokens_details?.cached_tokens ?? 0;
      return {
        text,
        content: { text, reasoning_details: choice.message.reasoning_details },
        usage: { input: (u?.prompt_tokens ?? 0) - cached, output: u?.completion_tokens ?? 0, cacheRead: cached, cacheWrite: 0, cost: u?.cost },
        stop: choice.finish_reason === 'content_filter' ? 'refusal' : choice.finish_reason,
      };
    }
  };
}

export function claudeChat(settings: ModelSettings = DEFAULT_MODEL): Chat {
  const client = new Anthropic();
  return async (system, messages) => {
    const stream = client.beta.messages.stream({
      model: settings.model,
      max_tokens: settings.maxTokens,
      thinking: { type: 'adaptive' },
      output_config: { effort: settings.effort },
      // If the model declines, the API retries on a fallback model.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system,
      messages: messages as Anthropic.Beta.BetaMessageParam[],
    });
    const m = await stream.finalMessage();
    const u = m.usage;
    return {
      text: m.content.flatMap((b) => (b.type === 'text' ? [b.text] : [])).join('\n'),
      // Sent back whole, so the model's earlier reasoning stays in the conversation.
      content: m.content,
      usage: { input: u.input_tokens, output: u.output_tokens, cacheRead: u.cache_read_input_tokens ?? 0, cacheWrite: u.cache_creation_input_tokens ?? 0 },
      stop: m.stop_reason ?? 'unknown',
    };
  };
}

export function systemPrompt(allowGrind: boolean): string {
  return `You are a research agent proving theorems in Lean 4 (version 4.35.0). Only Lean's core library is available: there is no Mathlib. Core lemmas (about Nat, Int, List, Nat.gcd, …) and tactics such as simp, omega, decide, induction, cases and rw may be used freely.

The definitions every theorem is about:

\`\`\`lean
${definitions().trim()}
\`\`\`

Rules:
- Prove exactly the statement you are given. You may cite the theorems in your library by their full names; no other theorems of this project exist for you.
- Not allowed: sorry, admit, native_decide${allowGrind ? '' : ', grind'}, search tactics (exact?, apply?, …), commands (#eval, run_cmd, …), set_option, and new top-level declarations. Use \`have\` for helper facts inside the proof.
- For a proof by recursion, the theorem's own name is \`attempt\`.

Reply with your proof in one \`\`\`lean code block: the text that completes the declaration shown, starting with \`:=\` (for example \`:= by\` followed by tactics) or with \`|\` match arms. Do not repeat the statement.`;
}

export function taskPrompt(task: Pick<Task, 'ns' | 'signature'>, library: CheckOptions['library']): string {
  const lib = library.length
    ? `Your library (theorems proved earlier, which you may cite):\n\n\`\`\`lean\n${library.map((l) => `theorem ${l.name} ${l.signature}`).join('\n\n')}\n\`\`\``
    : 'Your library is empty: there are no earlier theorems to cite.';
  return `${lib}\n\nProve this, inside \`namespace ${task.ns}\`${task.ns === 'OSO' ? ' with `open M2`' : ''}:\n\n\`\`\`lean\ntheorem attempt ${task.signature}\n\`\`\``;
}

export function extractProof(text: string): string | null {
  const blocks = [...text.matchAll(/```(?:lean4?|)\s*\n([\s\S]*?)```/g)].map((m) => m[1].replace(/\s+$/, ''));
  if (!blocks.length) return null;
  let proof = blocks[blocks.length - 1];
  // Tolerate a repeated statement: keep what follows it.
  const head = /^\s*theorem\s+attempt\b[\s\S]*?(:=|\n\s*\|)/.exec(proof);
  if (head) proof = proof.slice(head.index + head[0].length - head[1].length).replace(/^\n/, '');
  return proof;
}

export interface AttemptResult { ok: boolean; turns: Turn[]; uses: string[]; failure?: string }

/** One attempt: a proof, then repairs on Lean's errors until it passes or the repairs run out. */
export async function attempt(task: Task, library: CheckOptions['library'], chat: Chat, { repairs = 3, allowGrind = false } = {}): Promise<AttemptResult> {
  const system = systemPrompt(allowGrind);
  const messages: { role: 'user' | 'assistant'; content: unknown }[] = [{ role: 'user', content: taskPrompt(task, library) }];
  const turns: Turn[] = [];
  for (let k = 0; k <= repairs; k++) {
    const reply = await chat(system, messages);
    if (reply.stop === 'refusal') {
      turns.push({ proof: null, check: null, usage: reply.usage, stop: reply.stop });
      return { ok: false, turns, uses: [], failure: 'refusal' };
    }
    const proof = extractProof(reply.text);
    const result = proof ? await check(task, proof, { library, allowGrind }) : null;
    turns.push({ proof, check: result, usage: reply.usage, stop: reply.stop });
    if (result?.ok) return { ok: true, turns, uses: result.uses };
    messages.push({ role: 'assistant', content: reply.content });
    const feedback = !proof
      ? 'Your reply had no ```lean code block with a proof.'
      : `Lean rejected the proof:\n\n${result!.errors.join('\n\n').slice(0, 6000)}`;
    messages.push({ role: 'user', content: `${feedback}\n\nSend a corrected proof in one \`\`\`lean code block.` });
  }
  return { ok: false, turns, uses: [], failure: 'repairs exhausted' };
}
