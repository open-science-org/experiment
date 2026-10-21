# The simple model: one chain, shared vs. hidden progress

**Question:** Does the simulator match the exact mathematics of shared against hidden progress?

**Answer:** See the table: this experiment checks the model against exact values.

| N | shared: simulated | shared: exact | hidden: simulated | hidden: exact | gain: simulated | gain: exact |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 128.6 ± 0.3 | 128.0 | 128.6 ± 0.3 | 128.0 | 1.00 | 1.00 |
| 2 | 128.3 ± 0.3 | 128.0 | 67.9 ± 0.2 | 68.0 | 1.89 | 1.88 |
| 4 | 128.4 ± 0.3 | 128.0 | 37.2 ± 0.1 | 37.3 | 3.45 | 3.44 |
| 8 | 128.3 ± 0.3 | 128.0 | 21.3 ± 0.1 | 21.2 | 6.02 | 6.03 |
| 16 | 128.3 ± 0.3 | 128.0 | 12.7 ± 0.0 | 12.7 | 10.14 | 10.11 |

**Design** (fixed before the run): compared progress shared or hidden, for communities of 1 to 16 agents · held the same: one chain of results, chance 0.2 per attempt, 640 attempts · measure: agreement with the exact values, higher is better · 1000 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

A single chain of 300 results, each with success chance p = 0.2 per attempt; N identical agents; X = 640 attempts in total, one per agent per round. Shared: every result is published and taken up at once. Hidden: nothing is published until the end of the chain, which no one reaches. Measure: the deepest result proved by anyone. The exact values come from src/experiments/analytic.ts.

Values are mean ± standard error, so they can be compared with the exact values.

| N | shared: simulated | shared: exact | hidden: simulated | hidden: exact | gain: simulated | gain: exact |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 128.6 ± 0.3 | 128.0 | 128.6 ± 0.3 | 128.0 | 1.00 | 1.00 |
| 2 | 128.3 ± 0.3 | 128.0 | 67.9 ± 0.2 | 68.0 | 1.89 | 1.88 |
| 4 | 128.4 ± 0.3 | 128.0 | 37.2 ± 0.1 | 37.3 | 3.45 | 3.44 |
| 8 | 128.3 ± 0.3 | 128.0 | 21.3 ± 0.1 | 21.2 | 6.02 | 6.03 |
| 16 | 128.3 ± 0.3 | 128.0 | 12.7 ± 0.0 | 12.7 | 10.14 | 10.11 |

Code: commit `9b5ec21` (with uncommitted changes). Experiment: [config/experiments/simple.yaml](../../config/experiments/simple.yaml). Command: `npm run sim -- simple --seeds 1000 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
