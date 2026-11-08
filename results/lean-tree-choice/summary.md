# Agents choosing what to publish on the Lean problem set's tree, by α

**Question:** On the Lean tree, does flow-back make agents choose to share?

**Answer:** Best: α 0.2, 0.9.

![Agents choosing what to publish on the Lean problem set's tree, by α](figures/compare.svg)

| α | sharing | frontier | targets solved | ROI (value per spend) |
| --- | --- | --- | --- | --- |
| 1 | 0.36 ± 0.05 | 5.5 ± 1.3 | 6.6 ± 1.3 | 0.81 ± 0.67 |
| 0.8 | 0.43 ± 0.06 | 5.7 ± 1.2 | 6.9 ± 1.1 | 0.87 ± 0.63 |
| 0.2 | 0.91 ± 0.05 | 7.0 ± 0.0 | 8.0 ± 0.0 | 2.03 ± 0.45 |

**Design** (fixed before the run): compared α 1, 0.8 and 0.2, agents choosing what to publish · held the same: the Lean tree, the agents and the budget · measure: share of ideas published at once, higher is better · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The prediction for roadmap M3 (labs choose what to publish): the simulation's agents choose whether to publish each intermediate idea, on the real shape of the Lean problem set, at the three α values of the Lean runs.

Values are mean ± standard deviation over runs.

| α | sharing | frontier | targets solved | spend | waste | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 0.36 ± 0.05 | 5.5 ± 1.3 | 6.6 ± 1.3 | 363 ± 60 | 0.59 ± 0.08 | 0.81 ± 0.67 |
| 0.8 | 0.43 ± 0.06 | 5.7 ± 1.2 | 6.9 ± 1.1 | 361 ± 60 | 0.58 ± 0.08 | 0.87 ± 0.63 |
| 0.2 | 0.91 ± 0.05 | 7.0 ± 0.0 | 8.0 ± 0.0 | 238 ± 54 | 0.24 ± 0.07 | 2.03 ± 0.45 |

Code: commit `e245416` (with uncommitted changes). Experiment: [config/experiments/lean-tree-choice.yaml](../../config/experiments/lean-tree-choice.yaml). Command: `npm run sim -- lean-tree-choice --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
