// The shared run's posted steps: a step counts as proved only by a library lemma with exactly its statement.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stepLists, stepStatus, type Entry, type StepList } from '../scripts/shared.ts';

const list: StepList = {
  target: '1052.even_of_isUnitaryPerfect', about: '', checked: '', open: ['Erdos1052'],
  steps: [{ id: 'S1', plain: '', statement: '(n : ℕ) (hn : 1 < n) : 0 < n', after: [] }, { id: 'S2', plain: '', statement: '(n : ℕ) : n ≤ n', after: ['S1'] }],
};
const entry = (id: string, statement: string, open = ['Erdos1052'], kind: Entry['kind'] = 'lemma'): Entry =>
  ({ id, name: `OSO.${id}`, lab: 'alice', pr: 1, at: '', kind, target: null, statement, proof: '', open, uses: [] });

test('a step is proved by a library lemma with the same statement, whitespace aside', () => {
  const [l] = stepStatus([list], [entry('L1', '(n : ℕ)   (hn : 1 < n) :  0 < n')]);
  assert.deepEqual(l.steps[0].provedBy, { id: 'L1', name: 'OSO.L1', lab: 'alice' });
  assert.equal(l.steps[1].provedBy, null);
});

test('a lemma in other namespaces, of another statement, or a target does not prove a step', () => {
  const [l] = stepStatus([list], [entry('L1', '(n : ℕ) (hn : 1 < n) : 0 < n', []), entry('L2', '(m : ℕ) : m ≤ m'), entry('L3', '(n : ℕ) : n ≤ n', ['Erdos1052'], 'target')]);
  assert.equal(l.steps[0].provedBy, null);
  assert.equal(l.steps[1].provedBy, null);
});

test('posted step lists are well formed: ids unique, "after" names earlier steps', () => {
  for (const l of stepLists()) {
    const ids = l.steps.map((s) => s.id);
    assert.equal(new Set(ids).size, ids.length, l.target);
    l.steps.forEach((s, i) => { for (const a of s.after) assert.ok(ids.slice(0, i).includes(a), `${l.target} ${s.id} after ${a}`); });
    for (const s of l.steps) assert.ok(s.statement && !s.statement.includes(':='), `${l.target} ${s.id}`);
  }
});
