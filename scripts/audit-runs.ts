// Audit saved community runs: do the books balance? Runs from 2026-11-24 carry a ledger, so earnings and flow-back
// are checked too; older runs only their spending (each lab's spending against its actions' costs) and overspending.
// Run: node scripts/audit-runs.ts [prefix]   (prefix: only runs whose id starts with it, e.g. lean-big-1)
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { LEAN_DIR } from '../src/lean/tasks.ts';
import { audit, readCommunity } from '../src/lean/community.ts';

const prefix = process.argv[2] ?? '';
const dir = join(LEAN_DIR, 'runs');
const ids = readdirSync(dir).filter((d) => d.startsWith(prefix) && existsSync(join(dir, d, 'result.json'))).sort();
let bad = 0, withLedger = 0, over = 0, budget = 0;
for (const id of ids) {
  const r = readCommunity(id);
  if (!r.actions || !r.spent) continue;
  const a = audit(r);
  if (r.ledger) withLedger++;
  over += a.overspent.reduce((x, y) => x + y, 0);
  budget += r.opts.budget * r.opts.agents.length;
  if (!a.ok) { bad++; console.log(`${id}: ${a.problems.slice(0, 3).join('; ')}${a.problems.length > 3 ? ` (+${a.problems.length - 3} more)` : ''}`); }
}
console.log(`${ids.length} runs: ${ids.length - bad} balance, ${bad} do not; ${withLedger} have a ledger. Spent beyond budgets: $${over.toFixed(3)} of $${budget.toFixed(2)} (${(100 * over / Math.max(budget, 1e-9)).toFixed(1)}%).`);
process.exit(bad ? 1 : 0);
