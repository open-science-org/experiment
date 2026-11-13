// Rewrite the summary of a finished society experiment from its saved runs, without running anything:
// after a change to how summaries are written. Run: node scripts/lean-summary.ts <experiment id> [design note]
// The design note is the paragraph the run was started with (--design or the config's "design"); pass it again.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { LEAN_DIR } from '../src/lean/tasks.ts';
import { readCommunity } from '../src/lean/community.ts';
import { writeSocieties } from '../src/lean/societies.ts';
import { writeIndex } from '../src/card.ts';

const id = process.argv[2];
if (!id) throw new Error('usage: node scripts/lean-summary.ts <experiment id>');
const plan = JSON.parse(readFileSync(join(LEAN_DIR, 'runs', `${id}.plan.json`), 'utf8')) as { societies: string[]; repeats: number; k: number };
const runs = [];
for (let rep = 1; rep <= plan.repeats; rep++) for (const key of plan.societies) runs.push({ key, rep, runId: `${id}-r${rep}-${key}`, result: readCommunity(`${id}-r${rep}-${key}`) });
// The card keeps the date it was first written, so the results index stays in order.
const cardFile = join('results', 'community', id, 'card.json');
const date = existsSync(cardFile) ? JSON.parse(readFileSync(cardFile, 'utf8')).date : null;
const dir = writeSocieties(id, runs, plan.k, process.argv[3] ?? '');
if (date) { const card = JSON.parse(readFileSync(cardFile, 'utf8')); writeFileSync(cardFile, JSON.stringify({ ...card, date }, null, 1) + '\n'); writeIndex(); }
console.log(`${dir}/summary.md`);
