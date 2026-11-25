// What a Lean run ran on, saved beside it as manifest.json: the code's commit, the tool versions, the problem
// set's files and the prompts, as hashes, and the prices money was counted at. With it a result can be traced to
// the exact code and inputs, and two runs can be checked for the same setup.
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../paths.ts';
import { MODEL_VERSION } from '../engine/version.ts';
import { REFERENCE_PRICES } from './prices.ts';
import { filesOf, LEAN_DIR, type Problems } from './tasks.ts';

/** Raise when a field's meaning changes. */
export const MANIFEST_SCHEMA = 1;

const sha = (s: string | Buffer) => createHash('sha256').update(s).digest('hex');
const git = (...args: string[]) => { try { return execFileSync('git', ['-C', ROOT, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return null; } };

/** The files that define a problem set: its DAG, the definitions and statements, and the reference proofs (as src/lean/tasks.ts reads them). */
export function problemFiles(problems: Problems): string[] {
  const dag = problems === 'big' ? ['reference-dag-big.md'] : problems === 'deep' ? ['reference-dag-deep.md'] : ['reference-dag.md', ...(problems === 'hard' ? ['reference-dag-hard.md'] : [])];
  const defs = readdirSync(join(LEAN_DIR, 'Problems')).filter((f) => f.endsWith('.lean')).sort().map((f) => `Problems/${f}`);
  return [...dag, ...defs, ...filesOf(problems).map(([f]) => `Reference/${f}.lean`), 'lean-toolchain'].filter((f) => existsSync(join(LEAN_DIR, f)));
}

export interface Manifest {
  schema: number; runId: string; startedAt: string;
  code: { commit: string | null; dirty: boolean | null; branch: string | null };
  tools: { node: string; lean: string | null };
  simulationModel: number;
  problems: { set: Problems; files: Record<string, string> };
  prompts: string; models: string[];
  prices: Record<string, { input: number; output: number; cacheRead: number } | null>;
  command: string[];
}

export function runManifest(runId: string, o: { problems?: Problems; agents: string[] }, prompts: string[], command = process.argv.slice(2)): Manifest {
  const set = o.problems ?? 'main';
  const status = git('status', '--porcelain', '--untracked-files=no');
  const toolchain = join(LEAN_DIR, 'lean-toolchain');
  return {
    schema: MANIFEST_SCHEMA, runId, startedAt: new Date().toISOString(),
    code: { commit: git('rev-parse', 'HEAD'), dirty: status === null ? null : status !== '', branch: git('branch', '--show-current') },
    tools: { node: process.version, lean: existsSync(toolchain) ? readFileSync(toolchain, 'utf8').trim() : null },
    simulationModel: MODEL_VERSION,
    problems: { set, files: Object.fromEntries(problemFiles(set).map((f) => [f, sha(readFileSync(join(LEAN_DIR, f)))])) },
    prompts: sha(JSON.stringify(prompts)),
    models: [...new Set(o.agents)],
    prices: Object.fromEntries([...new Set(o.agents)].map((m) => [m, REFERENCE_PRICES[m] ?? null])),
    command,
  };
}
