# Lab size with 192 agents, every level equally hard

**Question:** With 192 agents in labs of 1 to 192 that share inside the lab, how much money does the field need to solve half the targets, against OSO across the whole field?

**Answer:** Best: Labs of 192 (one lab of everyone), 416.0 (1 more tie). Best traditional: Traditional (α = 1, β = 0), alone, 1328.0. Clear difference.

![Lab size with 192 agents, every level equally hard](figures/compare.svg)

| society | money to half the targets | targets solved | waste | ROI (value per spend) |
| --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0), alone | 1328 ± 612 | 8.4 ± 0.7 | 0.50 ± 0.09 | 0.99 ± 0.45 |
| Labs of 2 | 944 ± 408 | 8.4 ± 0.6 | 0.46 ± 0.07 | 1.31 ± 0.48 |
| Labs of 4 | 1112 ± 388 | 8.6 ± 0.8 | 0.49 ± 0.07 | 1.11 ± 0.40 |
| Labs of 8 | 952 ± 274 | 8.4 ± 0.6 | 0.46 ± 0.06 | 1.25 ± 0.49 |
| Labs of 16 | 856 ± 305 | 8.7 ± 1.0 | 0.45 ± 0.07 | 1.45 ± 0.53 |
| Labs of 32 | 784 ± 211 | 9.3 ± 1.2 | 0.44 ± 0.06 | 1.62 ± 0.43 |
| Labs of 64 | 600 ± 130 | 9.9 ± 1.5 | 0.38 ± 0.04 | 2.17 ± 0.39 |
| Labs of 96 | 584 ± 120 | 10.8 ± 2.0 | 0.34 ± 0.03 | 2.41 ± 0.32 |
| Labs of 192 (one lab of everyone) | 416 ± 108 | 10.8 ± 2.2 | 0.24 ± 0.03 | 3.45 ± 0.80 |
| OSO (α = 0.8, β = 1) | 456 ± 111 | 10.5 ± 2.4 | 0.26 ± 0.04 | 3.06 ± 0.75 |
| OSO (α = 0.2, β = 1) | 576 ± 98 | 10.3 ± 1.5 | 0.27 ± 0.03 | 2.34 ± 0.46 |

**Design** (fixed before the run): compared labs of 1, 2, 4, 8, 16, 32, 64, 96, 192 against field-wide OSO at α = 0.8 and 0.2 · held the same: a generated idea graph (6 levels × 64 ideas, 2 parents each, every level equally hard, composition 0.7, 16 targets), 192 identical agents, 1 attempt per agent per round, paid until half the targets are solved, no flat mint, knowledge reward 1 per new bit, no validation · measure: money to solve half the targets, lower is better · 8 graphs × 3 runs on each, per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The simple model with 192 identical agents on a generated idea graph of 6 levels × 64 ideas (2 ideas per agent), 2 parents each, composition 0.7, every level equally hard, 16 targets on the top level; each graph run 3 times. Traditional rules (α = 1, nothing published before a target), with agents in equal labs of 1, 2, 4, 8, 16, 32, 64, 96, 192; lab mates share every proof at once, privately. Against OSO across the whole field at α = 0.8 and 0.2. Each agent makes 1 attempt per round; the funder pays until half the targets are solved, and the measure is the money spent by then. Held fixed: equal money per agent every round, no flat mint, a knowledge reward of 1 per new bit flowing back with α, no validation.

Values are mean ± standard deviation over runs.

| society | money to half the targets | targets solved | waste | sharing | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0), alone | 1328 ± 612 | 8.4 ± 0.7 | 0.50 ± 0.09 | 0.00 ± 0.00 | 0.99 ± 0.45 |
| Labs of 2 | 944 ± 408 | 8.4 ± 0.6 | 0.46 ± 0.07 | 0.00 ± 0.00 | 1.31 ± 0.48 |
| Labs of 4 | 1112 ± 388 | 8.6 ± 0.8 | 0.49 ± 0.07 | 0.00 ± 0.01 | 1.11 ± 0.40 |
| Labs of 8 | 952 ± 274 | 8.4 ± 0.6 | 0.46 ± 0.06 | 0.01 ± 0.01 | 1.25 ± 0.49 |
| Labs of 16 | 856 ± 305 | 8.7 ± 1.0 | 0.45 ± 0.07 | 0.02 ± 0.02 | 1.45 ± 0.53 |
| Labs of 32 | 784 ± 211 | 9.3 ± 1.2 | 0.44 ± 0.06 | 0.03 ± 0.02 | 1.62 ± 0.43 |
| Labs of 64 | 600 ± 130 | 9.9 ± 1.5 | 0.38 ± 0.04 | 0.10 ± 0.03 | 2.17 ± 0.39 |
| Labs of 96 | 584 ± 120 | 10.8 ± 2.0 | 0.34 ± 0.03 | 0.15 ± 0.05 | 2.41 ± 0.32 |
| Labs of 192 (one lab of everyone) | 416 ± 108 | 10.8 ± 2.2 | 0.24 ± 0.03 | 0.31 ± 0.09 | 3.45 ± 0.80 |
| OSO (α = 0.8, β = 1) | 456 ± 111 | 10.5 ± 2.4 | 0.26 ± 0.04 | 1.00 ± 0.00 | 3.06 ± 0.75 |
| OSO (α = 0.2, β = 1) | 576 ± 98 | 10.3 ± 1.5 | 0.27 ± 0.03 | 1.00 ± 0.00 | 2.34 ± 0.46 |

**Graph or luck?** 8 graphs, 3 runs on each. Each cell: the average, then how much it varies from graph to graph (standard deviation of the graph averages) and between runs on one graph (standard deviation within a graph).

| row | hardest level | targets solved | waste |
| --- | --- | --- | --- |
| Traditional (α = 1, β = 0), alone | 6.00 (graphs 0.00, runs 0.00) | 8.42 (graphs 0.46, runs 0.58) | 0.50 (graphs 0.06, runs 0.09) |
| Labs of 2 | 6.00 (graphs 0.00, runs 0.00) | 8.38 (graphs 0.28, runs 0.71) | 0.46 (graphs 0.05, runs 0.05) |
| Labs of 4 | 6.00 (graphs 0.00, runs 0.00) | 8.58 (graphs 0.56, runs 0.76) | 0.49 (graphs 0.05, runs 0.06) |
| Labs of 8 | 6.00 (graphs 0.00, runs 0.00) | 8.42 (graphs 0.35, runs 0.58) | 0.46 (graphs 0.04, runs 0.05) |
| Labs of 16 | 6.00 (graphs 0.00, runs 0.00) | 8.67 (graphs 0.44, runs 1.04) | 0.45 (graphs 0.05, runs 0.06) |
| Labs of 32 | 6.00 (graphs 0.00, runs 0.00) | 9.33 (graphs 0.93, runs 1.04) | 0.44 (graphs 0.04, runs 0.05) |
| Labs of 64 | 6.00 (graphs 0.00, runs 0.00) | 9.88 (graphs 0.87, runs 1.51) | 0.38 (graphs 0.02, runs 0.04) |
| Labs of 96 | 6.00 (graphs 0.00, runs 0.00) | 10.83 (graphs 1.04, runs 2.13) | 0.34 (graphs 0.02, runs 0.03) |
| Labs of 192 (one lab of everyone) | 6.00 (graphs 0.00, runs 0.00) | 10.79 (graphs 1.63, runs 1.87) | 0.24 (graphs 0.02, runs 0.03) |
| OSO (α = 0.8, β = 1) | 6.00 (graphs 0.00, runs 0.00) | 10.54 (graphs 1.49, runs 2.28) | 0.26 (graphs 0.03, runs 0.03) |
| OSO (α = 0.2, β = 1) | 6.00 (graphs 0.00, runs 0.00) | 10.29 (graphs 1.00, runs 1.37) | 0.27 (graphs 0.02, runs 0.03) |

Code: commit `594438e`. Experiment: [config/experiments/simple-ideas-6x64-p2-len3g0-comp0-7-lab-size-192-agents-20261028.yaml](../../config/experiments/simple-ideas-6x64-p2-len3g0-comp0-7-lab-size-192-agents-20261028.yaml). Command: `npm run sim -- simple-ideas-6x64-p2-len3g0-comp0-7-lab-size-192-agents-20261028 --seeds 24 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
