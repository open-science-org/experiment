# The six rule settings on the Lean problem set's reference tree

**Question:** On the Lean problem set's tree, which rule setting gets furthest?

**Answer:** Best on hardest level published: OSO (immediate), 7.0 (tied with No flow-back, immediate). Best traditional: Traditional, 4.4; a clear difference.

| setting | frontier | reach L5 | speed | cost |
| --- | --- | --- | --- | --- |
| Traditional | 4.4 ± 1.2 | 0.44 | 31 ± 7 | 303 ± 66 |
| OSO (immediate) | 7.0 ± 0.0 | 1.00 | 13 ± 3 | 125 ± 32 |
| Flow-back, finished-only | 4.3 ± 1.1 | 0.48 | 33 ± 6 | 327 ± 64 |
| No flow-back, immediate | 7.0 ± 0.1 | 1.00 | 14 ± 4 | 131 ± 39 |
| No flow-back, choice | 4.9 ± 1.2 | 0.67 | 31 ± 7 | 301 ± 74 |
| OSO (choice) | 5.2 ± 1.2 | 0.76 | 28 ± 8 | 273 ± 77 |

**Design** (fixed before the run): compared the six rule settings · held the same: the Lean tree, 12 agents and the budget · measure: hardest level published, higher is better · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The same settings as `settings`, on the real shape of the Lean problem set (42 results in three areas plus cross-area results, 8 targets, bounties by depth) instead of a random tree, with X = 400. Success chances follow the default model by level until the Lean pilot measures them.

Values are mean ± standard deviation over runs.

| setting | frontier | reach L5 | speed | cost | spend | targets solved | breadth | waste | credit | sharing | gamer share of pay |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 4.4 ± 1.2 | 0.44 | 31 ± 7 | 303 ± 66 | 394 ± 14 | 4.8 ± 1.5 | 0.60 ± 0.19 | 0.53 ± 0.10 | 0.98 ± 0.04 | 0.01 ± 0.02 | 0.89 |
| OSO (immediate) | 7.0 ± 0.0 | 1.00 | 13 ± 3 | 125 ± 32 | 243 ± 59 | 8.0 ± 0.0 | 1.00 ± 0.00 | 0.78 ± 0.05 | 0.73 ± 0.06 | 1.00 ± 0.00 | 0.14 |
| Flow-back, finished-only | 4.3 ± 1.1 | 0.48 | 33 ± 6 | 327 ± 64 | 392 ± 19 | 4.9 ± 1.7 | 0.62 ± 0.21 | 0.55 ± 0.11 | 0.99 ± 0.03 | 0.01 ± 0.02 | 0.86 |
| No flow-back, immediate | 7.0 ± 0.1 | 1.00 | 14 ± 4 | 131 ± 39 | 246 ± 63 | 8.0 ± 0.1 | 1.00 ± 0.02 | 0.77 ± 0.06 | 0.59 ± 0.08 | 1.00 ± 0.00 | 0.15 |
| No flow-back, choice | 4.9 ± 1.2 | 0.67 | 31 ± 7 | 301 ± 74 | 386 ± 33 | 5.9 ± 1.4 | 0.73 ± 0.18 | 0.59 ± 0.13 | 0.84 ± 0.09 | 0.35 ± 0.05 | 0.68 |
| OSO (choice) | 5.2 ± 1.2 | 0.76 | 28 ± 8 | 273 ± 77 | 372 ± 54 | 6.3 ± 1.3 | 0.79 ± 0.17 | 0.62 ± 0.13 | 0.84 ± 0.08 | 0.42 ± 0.06 | 0.53 |

Code: commit `023509e` (with uncommitted changes). Experiment: [config/experiments/lean-tree.yaml](../../config/experiments/lean-tree.yaml). Command: `npm run sim -- lean-tree --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
