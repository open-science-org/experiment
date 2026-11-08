# Agents choosing what to publish on the Lean tree, matched to the Lean runs, by α

**Question:** Set up like the Lean runs, does flow-back make agents choose to share?

**Answer:** Best: α 0.2, 0.9.

![Agents choosing what to publish on the Lean tree, matched to the Lean runs, by α](figures/compare.svg)

| α | sharing | frontier | targets solved | ROI (value per spend) |
| --- | --- | --- | --- | --- |
| 1 | 0.17 ± 0.05 | 1.5 ± 0.5 | 1.3 ± 0.6 | 0.05 ± 0.03 |
| 0.8 | 0.20 ± 0.05 | 1.6 ± 0.6 | 1.4 ± 0.7 | 0.06 ± 0.04 |
| 0.2 | 0.93 ± 0.03 | 5.1 ± 0.8 | 2.5 ± 1.0 | 0.28 ± 0.29 |

**Design** (fixed before the run): compared α 1, 0.8 and 0.2, agents choosing what to publish · held the same: the Lean tree, 4 identical agents, equal money · measure: share of ideas published at once, higher is better · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The prediction for roadmap M3, set up like the Lean runs: 4 identical agents (as the 4 DeepSeek labs), money split equally and not following earnings, a third of the Lean tree scenario's money (4 agents, not 12). Agents choose whether to publish each intermediate idea; α 1, 0.8 and 0.2 as in the Lean runs.

Values are mean ± standard deviation over runs.

| α | sharing | frontier | targets solved | spend | waste | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 0.17 ± 0.05 | 1.5 ± 0.5 | 1.3 ± 0.6 | 132 ± 0 | 0.57 ± 0.05 | 0.05 ± 0.03 |
| 0.8 | 0.20 ± 0.05 | 1.6 ± 0.6 | 1.4 ± 0.7 | 132 ± 0 | 0.57 ± 0.05 | 0.06 ± 0.04 |
| 0.2 | 0.93 ± 0.03 | 5.1 ± 0.8 | 2.5 ± 1.0 | 132 ± 0 | 0.16 ± 0.05 | 0.28 ± 0.29 |

Code: commit `efe8878`. Experiment: [config/experiments/lean-tree-choice-matched.yaml](../../config/experiments/lean-tree-choice-matched.yaml). Command: `npm run sim -- lean-tree-choice-matched --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
