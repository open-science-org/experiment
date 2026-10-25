// Prompting a new problem space: `npm run sim -- new "<description>"`.
// Claude writes a space file (spaces/<id>.yaml) from a plain-language description; the file is
// validated against the scenario rules and test-run, and any error is sent back for a fix. The budget
// is then calibrated, so every space is hard but not hopeless (spaces.ts, calibrateBudget).
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { run } from '../engine/model.ts';
import { calibrateBudget, parseSpace, spaceAgents, withBudget, type Space, type SpaceSpec } from './spaces.ts';

import { ROOT } from '../paths.ts';
export const MODEL = 'claude-opus-5-5';

/** Sends a conversation and returns the model's text. Injectable, so the loop can be tested offline. */
export type Complete = (system: string, messages: { role: 'user' | 'assistant'; content: string }[]) => Promise<string>;

export function claudeComplete(): Complete {
  const client = new Anthropic();
  return async (system, messages) => {
    const stream = client.beta.messages.stream({
      model: MODEL,
      max_tokens: 64000,
      thinking: { type: 'adaptive' },
      output_config: { effort: 'high' },
      // If the model declines, retry on a fallback model chosen by the API.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system,
      messages,
    });
    const message = await stream.finalMessage();
    if (message.stop_reason === 'refusal') throw new Error('the model declined to write this space');
    if (message.stop_reason === 'max_tokens') throw new Error('the response was cut off (max_tokens)');
    return message.content.flatMap((b) => (b.type === 'text' ? [b.text] : [])).join('\n');
  };
}

/** The same drafting through OpenRouter, for whoever has an OpenRouter key instead (lean/agent.ts). */
export async function openRouterComplete(model = 'anthropic/claude-opus-5.5', fallback = 'anthropic/claude-sonnet-5.5', log = (_: string) => {}): Promise<Complete> {
  const { openRouterChat, DEFAULT_MODEL } = await import('../lean/agent.ts');
  const chat = (m: string) => openRouterChat({ ...DEFAULT_MODEL, provider: 'openrouter', model: m, maxTokens: 32_000 });
  const [primary, second] = [chat(model), chat(fallback)];
  const complete: Complete & { used?: string } = async (system, messages) => {
    complete.used = model;
    // As the Anthropic API's server-side fallback does: if the model declines, try the fallback model once.
    let reply = await primary(system, messages);
    if (reply.stop === 'refusal' && fallback) {
      log(`  ${model} declined; trying ${fallback}…`);
      reply = await second(system, messages);
      complete.used = fallback;
    }
    if (reply.stop === 'refusal') throw new Error('The model declined to draft this field. Describe it differently (in terms of stages, difficulty and prizes), or write the file yourself.');
    return reply.text;
  };
  return complete;
}

/** Whichever provider has a key: Anthropic first, then OpenRouter. */
/** `via` names the model that answered last (a function, since a fallback may answer instead). */
export async function anyComplete(log = (_: string) => {}): Promise<{ complete: Complete; via: string | (() => string) }> {
  if (process.env.ANTHROPIC_API_KEY) return { complete: claudeComplete(), via: `${MODEL} (Anthropic)` };
  if (process.env.OPENROUTER_API_KEY) {
    const complete = await openRouterComplete(undefined, undefined, log);
    return { complete, via: () => `${(complete as { used?: string }).used ?? 'anthropic/claude-opus-5.5'} (OpenRouter)` };
  }
  throw new Error('No model key: set ANTHROPIC_API_KEY or OPENROUTER_API_KEY in .env');
}

export function systemPrompt(): string {
  const read = (p: string) => readFileSync(join(ROOT, p), 'utf8');
  return `You write problem-space files for the OSO research-community simulator.

The simulator compares a community of research agents under traditional incentives (work published only when finished, no credit to what it built on) with OSO incentives (results published at once, value flowing back to what they built on). A problem space describes one field: its research tree of results, how hard each is, which results are targets with bounties, and the agents and budget. Results are abstract: the simulator only needs the tree's shape, difficulty and prizes, not the content.

Write ONE problem-space file as YAML in a single \`\`\`yaml code block, and nothing else after it. The file has these keys:
- id: kebab-case name.
- title: a short title.
- summary: one sentence.
- description: a paragraph in plain words: what the field is, what its stages are, what progress means.
- glossary: { idea, target, attempt, agent (optional) }: what each term means in this field, as short noun phrases.
- scenario: overrides of the default scenario below. Change only what the field needs. Usually: world, measures.targetLevel, and sometimes agents.mix.
- notes: caveats, such as which numbers are guesses (optional).

Choosing the world (scenario.world): always kind: ideas, the idea graph generator. Each idea is a coin-toss sequence (bits); an attempt works with chance 2^-(bits not yet known), so earlier ideas make later ones easier. Set three things separately:
- structure: levels (stages), width (ideas per stage), parents (average parents per idea), skip (chance a parent comes from any lower stage);
- difficulty: length (new bits at level 1) and lengthGrowth (bits added per level); 2^length is about the attempts a level-1 idea needs;
- attribution: composition (0 to 1, share of an idea's bits taken from its parents).
Bounties: targets (per level), targetsFrom (lowest level with bounties; 0 means the top level only), bountyBase and bountyGrowth (bounty = bountyBase · bountyGrowth^(level − 1)).
measures.targetLevel must not exceed levels; set it to the level of the main targets or one below. Do not set the budget: it is calibrated automatically.

Every setting, with its default and meaning (config/scenarios/default.yaml):
\`\`\`yaml
${read('config/scenarios/default.yaml')}
\`\`\`

Two example problem spaces:
\`\`\`yaml
${read('spaces/drug-discovery.yaml')}
\`\`\`
\`\`\`yaml
${read('spaces/abstract-field.yaml')}
\`\`\``;
}

function extractYaml(text: string): string {
  const fenced = [...text.matchAll(/```(?:yaml|yml)?\s*\n([\s\S]*?)```/g)].map((m) => m[1]);
  return fenced.length ? fenced[fenced.length - 1] : text;
}

/** Parses, validates and test-runs a space; throws with a message a model can act on. */
export function checkSpace(yamlText: string): Space {
  let spec: SpaceSpec;
  try {
    spec = parse(yamlText) as SpaceSpec;
  } catch (e) {
    throw new Error(`the YAML does not parse: ${(e as Error).message}`);
  }
  const space = parseSpace(spec, 'space');
  const probe = run(space.scenario, 1);
  if (probe.spend <= 0) throw new Error('a test run spent nothing: no agent could attempt any result');
  return space;
}

/**
 * Generates a space from a description: ask, check, and send errors back, up to `attempts` times.
 * Then calibrates the budget.
 */
export async function generateSpace(description: string, complete: Complete, { attempts = 3, log = (_: string) => {}, via = MODEL as string | (() => string) } = {}): Promise<Space> {
  const name = () => (typeof via === 'function' ? via() : via);
  const system = systemPrompt();
  const messages: { role: 'user' | 'assistant'; content: string }[] = [
    { role: 'user', content: `Write the problem-space file for this field:\n\n${description}` },
  ];
  let lastError = '';
  for (let k = 1; k <= attempts; k++) {
    log(`  asking for a draft (attempt ${k} of ${attempts})…`);
    const text = await complete(system, messages);
    const yamlText = extractYaml(text);
    try {
      const space = checkSpace(yamlText);
      log('  the space is valid; calibrating the budget…');
      const X = calibrateBudget(space);
      const spec = withBudget({ ...space.spec, source: `generated by ${name()} from: "${description.replace(/\s+/g, ' ').trim()}"` }, X, spaceAgents(space));
      return parseSpace(spec, 'space');
    } catch (e) {
      lastError = (e as Error).message;
      log(`  not valid: ${lastError}`);
      messages.push({ role: 'assistant', content: text });
      messages.push({ role: 'user', content: `That file is not valid: ${lastError}\n\nFix it and send the whole file again, in one yaml code block.` });
    }
  }
  throw new Error(`no valid space after ${attempts} attempts; last error: ${lastError}`);
}
