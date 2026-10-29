# Lab size with 192 agents, deeper ideas easier (1 bit fewer per level)

**Question:** With 192 agents in labs of 1 to 192 that share inside the lab, how much money does the field need to solve half the targets, against OSO across the whole field?

**Answer:** Best: Labs of 192 (one lab of everyone), 192.0 (4 more tie). Best traditional: Traditional (α = 1, β = 0), alone, 224.0. Clear difference.

![Lab size with 192 agents, deeper ideas easier (1 bit fewer per level)](figures/compare.svg)

| society | money to half the targets | targets solved | waste | ROI (value per spend) |
| --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0), alone | 224 ± 73 | 10.2 ± 1.7 | 0.33 ± 0.07 | 6.12 ± 1.34 |
| Labs of 2 | 248 ± 106 | 10.5 ± 2.0 | 0.35 ± 0.08 | 5.88 ± 1.36 |
| Labs of 4 | 224 ± 73 | 10.0 ± 1.7 | 0.34 ± 0.07 | 5.96 ± 1.18 |
| Labs of 8 | 256 ± 92 | 10.5 ± 2.1 | 0.35 ± 0.09 | 5.57 ± 1.27 |
| Labs of 16 | 240 ± 85 | 10.1 ± 1.8 | 0.34 ± 0.07 | 5.68 ± 1.10 |
| Labs of 32 | 208 ± 54 | 9.8 ± 1.6 | 0.30 ± 0.05 | 6.21 ± 1.08 |
| Labs of 64 | 224 ± 73 | 11.1 ± 2.4 | 0.27 ± 0.06 | 6.54 ± 1.17 |
| Labs of 96 | 208 ± 54 | 11.0 ± 1.7 | 0.22 ± 0.04 | 6.96 ± 1.24 |
| Labs of 192 (one lab of everyone) | 192 ± 0 | 11.6 ± 1.8 | 0.11 ± 0.02 | 7.75 ± 1.21 |
| OSO (α = 0.8, β = 1) | 200 ± 39 | 10.4 ± 1.8 | 0.15 ± 0.03 | 6.79 ± 1.38 |
| OSO (α = 0.2, β = 1) | 344 ± 80 | 10.3 ± 1.9 | 0.23 ± 0.03 | 4.08 ± 1.36 |

**Design** (fixed before the run): compared labs of 1, 2, 4, 8, 16, 32, 64, 96, 192 against field-wide OSO at α = 0.8 and 0.2 · held the same: a generated idea graph (6 levels × 64 ideas, 2 parents each, deeper ideas easier (1 bit fewer per level), composition 0.7, 16 targets), 192 identical agents, 1 attempt per agent per round, paid until half the targets are solved, no flat mint, knowledge reward 1 per new bit, no validation · measure: money to solve half the targets, lower is better · 8 graphs × 3 runs on each, per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The simple model with 192 identical agents on a generated idea graph of 6 levels × 64 ideas (2 ideas per agent), 2 parents each, composition 0.7, deeper ideas easier (1 bit fewer per level), 16 targets on the top level; each graph run 3 times. Traditional rules (α = 1, nothing published before a target), with agents in equal labs of 1, 2, 4, 8, 16, 32, 64, 96, 192; lab mates share every proof at once, privately. Against OSO across the whole field at α = 0.8 and 0.2. Each agent makes 1 attempt per round; the funder pays until half the targets are solved, and the measure is the money spent by then. Held fixed: equal money per agent every round, no flat mint, a knowledge reward of 1 per new bit flowing back with α, no validation.

Values are mean ± standard deviation over runs.

| society | money to half the targets | targets solved | waste | sharing | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0), alone | 224 ± 73 | 10.2 ± 1.7 | 0.33 ± 0.07 | 0.00 ± 0.00 | 6.12 ± 1.34 |
| Labs of 2 | 248 ± 106 | 10.5 ± 2.0 | 0.35 ± 0.08 | 0.00 ± 0.01 | 5.88 ± 1.36 |
| Labs of 4 | 224 ± 73 | 10.0 ± 1.7 | 0.34 ± 0.07 | 0.01 ± 0.01 | 5.96 ± 1.18 |
| Labs of 8 | 256 ± 92 | 10.5 ± 2.1 | 0.35 ± 0.09 | 0.02 ± 0.01 | 5.57 ± 1.27 |
| Labs of 16 | 240 ± 85 | 10.1 ± 1.8 | 0.34 ± 0.07 | 0.04 ± 0.03 | 5.68 ± 1.10 |
| Labs of 32 | 208 ± 54 | 9.8 ± 1.6 | 0.30 ± 0.05 | 0.09 ± 0.05 | 6.21 ± 1.08 |
| Labs of 64 | 224 ± 73 | 11.1 ± 2.4 | 0.27 ± 0.06 | 0.18 ± 0.06 | 6.54 ± 1.17 |
| Labs of 96 | 208 ± 54 | 11.0 ± 1.7 | 0.22 ± 0.04 | 0.27 ± 0.07 | 6.96 ± 1.24 |
| Labs of 192 (one lab of everyone) | 192 ± 0 | 11.6 ± 1.8 | 0.11 ± 0.02 | 0.44 ± 0.10 | 7.75 ± 1.21 |
| OSO (α = 0.8, β = 1) | 200 ± 39 | 10.4 ± 1.8 | 0.15 ± 0.03 | 1.00 ± 0.00 | 6.79 ± 1.38 |
| OSO (α = 0.2, β = 1) | 344 ± 80 | 10.3 ± 1.9 | 0.23 ± 0.03 | 1.00 ± 0.00 | 4.08 ± 1.36 |

**Graph or luck?** 8 graphs, 3 runs on each. Each cell: the average, then how much it varies from graph to graph (standard deviation of the graph averages) and between runs on one graph (standard deviation within a graph).

| row | hardest level | targets solved | waste |
| --- | --- | --- | --- |
| Traditional (α = 1, β = 0), alone | 6.00 (graphs 0.00, runs 0.00) | 10.21 (graphs 0.59, runs 1.98) | 0.33 (graphs 0.04, runs 0.08) |
| Labs of 2 | 6.00 (graphs 0.00, runs 0.00) | 10.54 (graphs 1.47, runs 1.74) | 0.35 (graphs 0.06, runs 0.06) |
| Labs of 4 | 6.00 (graphs 0.00, runs 0.00) | 9.96 (graphs 1.05, runs 1.66) | 0.34 (graphs 0.04, runs 0.07) |
| Labs of 8 | 6.00 (graphs 0.00, runs 0.00) | 10.46 (graphs 1.19, runs 2.12) | 0.35 (graphs 0.04, runs 0.09) |
| Labs of 16 | 6.00 (graphs 0.00, runs 0.00) | 10.08 (graphs 1.22, runs 1.59) | 0.34 (graphs 0.04, runs 0.07) |
| Labs of 32 | 6.00 (graphs 0.00, runs 0.00) | 9.83 (graphs 1.02, runs 1.53) | 0.30 (graphs 0.03, runs 0.04) |
| Labs of 64 | 6.00 (graphs 0.00, runs 0.00) | 11.08 (graphs 1.55, runs 2.31) | 0.27 (graphs 0.03, runs 0.06) |
| Labs of 96 | 6.00 (graphs 0.00, runs 0.00) | 11.00 (graphs 1.21, runs 1.44) | 0.22 (graphs 0.02, runs 0.03) |
| Labs of 192 (one lab of everyone) | 6.00 (graphs 0.00, runs 0.00) | 11.63 (graphs 0.86, runs 1.94) | 0.11 (graphs 0.01, runs 0.02) |
| OSO (α = 0.8, β = 1) | 6.00 (graphs 0.00, runs 0.00) | 10.42 (graphs 1.09, runs 1.78) | 0.15 (graphs 0.02, runs 0.02) |
| OSO (α = 0.2, β = 1) | 6.00 (graphs 0.00, runs 0.00) | 10.29 (graphs 1.16, runs 1.85) | 0.23 (graphs 0.03, runs 0.02) |

Code: commit `594438e`. Experiment: [config/experiments/simple-ideas-6x64-p2-len3gm1-comp0-7-lab-size-192-agents-20261028.yaml](../../config/experiments/simple-ideas-6x64-p2-len3gm1-comp0-7-lab-size-192-agents-20261028.yaml). Command: `npm run sim -- simple-ideas-6x64-p2-len3gm1-comp0-7-lab-size-192-agents-20261028 --seeds 24 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
