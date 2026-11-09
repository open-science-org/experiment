# Agents choosing what to publish on the Lean tree, matched to the Lean runs, knowledge reward off, by α

**Question:** Set up like the Lean runs, with no reward for publishing, does flow-back make agents choose to share?

**Answer:** Best: α 0.2, 0.9.

![Agents choosing what to publish on the Lean tree, matched to the Lean runs, knowledge reward off, by α](figures/compare.svg)

| α | sharing | frontier | targets solved | ROI (value per spend) |
| --- | --- | --- | --- | --- |
| 1 | 0.16 ± 0.04 | 1.5 ± 0.5 | 1.2 ± 0.6 | 0.05 ± 0.03 |
| 0.8 | 0.16 ± 0.05 | 1.5 ± 0.5 | 1.3 ± 0.6 | 0.05 ± 0.03 |
| 0.2 | 0.93 ± 0.04 | 5.1 ± 0.8 | 2.8 ± 1.0 | 0.31 ± 0.22 |

**Design** (fixed before the run): compared α 1, 0.8 and 0.2, agents choosing what to publish, knowledge reward off · held the same: the Lean tree, 4 identical agents, equal money, no knowledge reward · measure: share of ideas published at once, higher is better · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The prediction for the Lean run "labs choose, reward off": as lean-tree-choice-matched (4 identical agents, money split equally and not following earnings), but a new result earns nothing by itself. Agents choose whether to publish each intermediate idea; α 1 and 0.2 as in the Lean runs, α 0.8 for reference.

Values are mean ± standard deviation over runs.

| α | sharing | frontier | targets solved | spend | waste | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 0.16 ± 0.04 | 1.5 ± 0.5 | 1.2 ± 0.6 | 132 ± 0 | 0.58 ± 0.04 | 0.05 ± 0.03 |
| 0.8 | 0.16 ± 0.05 | 1.5 ± 0.5 | 1.3 ± 0.6 | 132 ± 0 | 0.58 ± 0.05 | 0.05 ± 0.03 |
| 0.2 | 0.93 ± 0.04 | 5.1 ± 0.8 | 2.8 ± 1.0 | 132 ± 0 | 0.15 ± 0.07 | 0.31 ± 0.22 |

Code: commit `6b4a7dc`. Experiment: [config/experiments/lean-tree-choice-matched-off.yaml](../../config/experiments/lean-tree-choice-matched-off.yaml). Command: `npm run sim -- lean-tree-choice-matched-off --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
