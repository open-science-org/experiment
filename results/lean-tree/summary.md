# The six rule settings on the Lean problem set's reference tree

**Question:** On the Lean problem set's tree, which rule setting gets furthest?

**Answer:** Best: OSO, 7.0 (1 more tie). Best traditional: Traditional, 5.2. Clear difference.

![The six rule settings on the Lean problem set's reference tree](figures/compare.svg)

| setting | frontier | reach L5 | speed | ROI (value per spend) |
| --- | --- | --- | --- | --- |
| Traditional | 5.2 ± 1.5 | 0.67 | 27 ± 7 | 0.63 ± 0.55 |
| OSO (immediate) | 7.0 ± 0.0 | 1.00 | 12 ± 3 | 2.22 ± 0.56 |
| Flow-back, finished-only | 5.7 ± 1.4 | 0.81 | 25 ± 7 | 0.85 ± 0.62 |
| No flow-back, immediate | 7.0 ± 0.1 | 1.00 | 12 ± 3 | 2.24 ± 0.60 |
| No flow-back, choice | 5.7 ± 1.2 | 0.89 | 26 ± 8 | 0.88 ± 0.60 |
| OSO (choice) | 6.1 ± 1.0 | 0.96 | 25 ± 7 | 1.03 ± 0.61 |

**Design** (fixed before the run): compared the six rule settings · held the same: the Lean tree, 12 agents and the budget · measure: hardest level published, higher is better · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The same settings as `settings`, on the real shape of the Lean problem set (42 ideas in three areas plus cross-area ideas, 8 targets, bounties by level) instead of a random tree, with X = 400. Success chances follow the default model by level until the Lean pilot measures them.

Values are mean ± standard deviation over runs.

| setting | frontier | reach L5 | speed | ROI (value per spend) | cost | spend | targets solved | breadth | waste | credit | sharing | gamer share of pay |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 5.2 ± 1.5 | 0.67 | 27 ± 7 | 0.63 ± 0.55 | 267 ± 69 | 377 ± 40 | 5.9 ± 1.8 | 0.74 ± 0.22 | 0.61 ± 0.08 | 0.99 ± 0.03 | 0.01 ± 0.02 | 0.09 |
| OSO (immediate) | 7.0 ± 0.0 | 1.00 | 12 ± 3 | 2.22 ± 0.56 | 116 ± 31 | 219 ± 53 | 8.0 ± 0.0 | 1.00 ± 0.00 | 0.17 ± 0.04 | 0.72 ± 0.06 | 1.00 ± 0.00 | 0.03 |
| Flow-back, finished-only | 5.7 ± 1.4 | 0.81 | 25 ± 7 | 0.85 ± 0.62 | 247 ± 71 | 363 ± 54 | 6.5 ± 1.7 | 0.81 ± 0.21 | 0.58 ± 0.08 | 0.99 ± 0.03 | 0.01 ± 0.02 | 0.04 |
| No flow-back, immediate | 7.0 ± 0.1 | 1.00 | 12 ± 3 | 2.24 ± 0.60 | 112 ± 34 | 219 ± 60 | 8.0 ± 0.1 | 1.00 ± 0.01 | 0.17 ± 0.04 | 0.63 ± 0.10 | 1.00 ± 0.00 | 0.02 |
| No flow-back, choice | 5.7 ± 1.2 | 0.89 | 26 ± 8 | 0.88 ± 0.60 | 256 ± 80 | 360 ± 56 | 6.9 ± 1.2 | 0.87 ± 0.14 | 0.59 ± 0.09 | 0.86 ± 0.11 | 0.36 ± 0.05 | 0.02 |
| OSO (choice) | 6.1 ± 1.0 | 0.96 | 25 ± 7 | 1.03 ± 0.61 | 250 ± 71 | 349 ± 61 | 7.3 ± 0.9 | 0.91 ± 0.11 | 0.57 ± 0.08 | 0.87 ± 0.09 | 0.43 ± 0.06 | 0.01 |

Code: commit `cd9fb92` (with uncommitted changes). Experiment: [config/experiments/lean-tree.yaml](../../config/experiments/lean-tree.yaml). Command: `npm run sim -- lean-tree --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
