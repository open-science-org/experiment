// Checks the harness against the reference proofs: with its ancestors as the library, every
// reference proof must pass (grind allowed); with grind banned, exactly those using grind must fail.
import { check } from './checker.ts';
import { FREE, loadTasks, parseReference, type Task } from './tasks.ts';

export function libraryFor(task: Task, tasks: Task[]) {
  const ref = parseReference();
  const free = FREE.map((name) => ({ name, ...ref.get(name)! }));
  return [...free, ...tasks.filter((t) => task.ancestors.includes(t.name))];
}

/** The reference proof, with recursive calls renamed to `attempt`. */
export function referenceProof(task: Task): string {
  return task.reference.replace(new RegExp(`(?<![\\w.])${task.short}(?![\\w'])`, 'g'), 'attempt');
}

export async function selftest(log = console.log, concurrency = 6) {
  const tasks = loadTasks();
  const rows: { task: Task; withGrind: boolean; noGrind: boolean; usesGrind: boolean; usesOk: boolean; errors: string[] }[] = [];
  const queue = [...tasks];
  await Promise.all(Array.from({ length: concurrency }, async () => {
    for (let task = queue.shift(); task; task = queue.shift()) {
      const library = libraryFor(task, tasks);
      const proof = referenceProof(task);
      const a = await check(task, proof, { library, allowGrind: true });
      const b = await check(task, proof, { library, allowGrind: false });
      const direct = task.uses.filter((u) => !FREE.includes(u)).sort();
      rows.push({ task, withGrind: a.ok, noGrind: b.ok, usesGrind: /\bgrind\b/.test(proof), usesOk: JSON.stringify(a.uses.filter((u) => !FREE.includes(u)).sort()) === JSON.stringify(direct), errors: a.errors });
      log(`  ${task.publicId.padEnd(5)} ${a.ok ? 'pass' : 'FAIL'}${b.ok ? '' : ' (fails without grind)'} ${a.ok && !JSON.stringify(a.uses.filter((u) => !FREE.includes(u)).sort()).includes('') ? '' : ''}${a.seconds.toFixed(1)}s`);
    }
  }));
  return rows;
}
