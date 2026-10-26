# The six rule settings on the Lean problem set's reference tree

**Question:** On the Lean problem set's tree, which rule setting gets furthest?

**Answer:** Best: OSO, 7.0 (1 more tie). Best traditional: Traditional, 5.2. Clear difference.

![The six rule settings on the Lean problem set's reference tree](figures/compare.svg)

| setting | frontier | reach L5 | speed | ROI (value per spend) |
| --- | --- | --- | --- | --- |
| Traditional | 5.2 ± 1.5 | 0.71 | 27 ± 7 | 0.65 ± 0.56 |
| OSO (immediate) | 7.0 ± 0.0 | 1.00 | 12 ± 3 | 2.22 ± 0.56 |
| Flow-back, finished-only | 5.7 ± 1.3 | 0.82 | 25 ± 7 | 0.87 ± 0.63 |
| No flow-back, immediate | 7.0 ± 0.1 | 1.00 | 12 ± 3 | 2.24 ± 0.60 |
| No flow-back, choice | 5.5 ± 1.3 | 0.79 | 28 ± 8 | 0.81 ± 0.67 |
| OSO (choice) | 5.7 ± 1.2 | 0.87 | 27 ± 6 | 0.87 ± 0.63 |

**Design** (fixed before the run): compared the six rule settings · held the same: the Lean tree, 12 agents and the budget · measure: hardest level published, higher is better · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The same settings as `settings`, on the real shape of the Lean problem set (42 ideas in three areas plus cross-area ideas, 8 targets, bounties by level) instead of a random tree, with X = 400. Success chances follow the default model by level until the Lean pilot measures them.

Values are mean ± standard deviation over runs.

| setting | frontier | reach L5 | speed | ROI (value per spend) | cost | spend | targets solved | breadth | waste | credit | sharing | gamer share of pay |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 5.2 ± 1.5 | 0.71 | 27 ± 7 | 0.65 ± 0.56 | 269 ± 70 | 374 ± 44 | 6.1 ± 1.7 | 0.76 ± 0.21 | 0.61 ± 0.08 | 0.98 ± 0.05 | 0.01 ± 0.02 | 0.08 |
| OSO (immediate) | 7.0 ± 0.0 | 1.00 | 12 ± 3 | 2.22 ± 0.56 | 116 ± 31 | 219 ± 53 | 8.0 ± 0.0 | 1.00 ± 0.00 | 0.17 ± 0.04 | 0.72 ± 0.06 | 1.00 ± 0.00 | 0.03 |
| Flow-back, finished-only | 5.7 ± 1.3 | 0.82 | 25 ± 7 | 0.87 ± 0.63 | 248 ± 68 | 358 ± 57 | 6.5 ± 1.6 | 0.81 ± 0.20 | 0.59 ± 0.08 | 0.99 ± 0.03 | 0.01 ± 0.02 | 0.05 |
| No flow-back, immediate | 7.0 ± 0.1 | 1.00 | 12 ± 3 | 2.24 ± 0.60 | 112 ± 34 | 219 ± 60 | 8.0 ± 0.1 | 1.00 ± 0.01 | 0.17 ± 0.04 | 0.63 ± 0.10 | 1.00 ± 0.00 | 0.02 |
| No flow-back, choice | 5.5 ± 1.3 | 0.79 | 28 ± 8 | 0.81 ± 0.67 | 271 ± 78 | 363 ± 60 | 6.6 ± 1.3 | 0.83 ± 0.17 | 0.59 ± 0.08 | 0.87 ± 0.11 | 0.36 ± 0.05 | 0.02 |
| OSO (choice) | 5.7 ± 1.2 | 0.87 | 27 ± 6 | 0.87 ± 0.63 | 262 ± 64 | 361 ± 60 | 6.9 ± 1.1 | 0.86 ± 0.14 | 0.58 ± 0.08 | 0.85 ± 0.08 | 0.43 ± 0.06 | 0.02 |

Code: commit `dc540e2`. Experiment: [config/experiments/lean-tree.yaml](../../config/experiments/lean-tree.yaml). Command: `npm run sim -- lean-tree --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
