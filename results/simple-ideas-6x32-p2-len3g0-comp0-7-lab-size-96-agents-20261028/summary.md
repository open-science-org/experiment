# Lab size with 96 agents, every level equally hard

**Question:** With 96 agents in labs of 1 to 96 that share inside the lab, how much money does the field need to solve half the targets, against OSO across the whole field?

**Answer:** Best: Labs of 96 (one lab of everyone), 211.2 (1 more tie). Best traditional: Traditional (α = 1, β = 0), alone, 587.2. Clear difference.

![Lab size with 96 agents, every level equally hard](figures/compare.svg)

| society | money to half the targets | targets solved | waste | ROI (value per spend) |
| --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0), alone | 587 ± 257 | 4.3 ± 0.6 | 0.47 ± 0.10 | 1.19 ± 0.82 |
| Labs of 2 | 488 ± 234 | 4.3 ± 0.6 | 0.43 ± 0.09 | 1.38 ± 0.70 |
| Labs of 4 | 472 ± 251 | 4.2 ± 0.5 | 0.42 ± 0.11 | 1.51 ± 0.97 |
| Labs of 8 | 368 ± 154 | 4.3 ± 0.6 | 0.39 ± 0.09 | 1.79 ± 0.81 |
| Labs of 16 | 355 ± 134 | 4.5 ± 0.7 | 0.38 ± 0.08 | 1.91 ± 0.96 |
| Labs of 32 | 283 ± 84 | 4.7 ± 0.8 | 0.34 ± 0.06 | 2.34 ± 0.87 |
| Labs of 48 | 250 ± 83 | 4.8 ± 1.1 | 0.30 ± 0.06 | 2.71 ± 1.10 |
| Labs of 96 (one lab of everyone) | 211 ± 52 | 5.2 ± 1.2 | 0.21 ± 0.05 | 3.27 ± 0.83 |
| OSO (α = 0.8, β = 1) | 227 ± 53 | 5.1 ± 1.0 | 0.23 ± 0.05 | 2.96 ± 0.66 |
| OSO (α = 0.2, β = 1) | 277 ± 85 | 5.0 ± 1.0 | 0.24 ± 0.04 | 2.50 ± 0.81 |

**Design** (fixed before the run): compared labs of 1, 2, 4, 8, 16, 32, 48, 96 against field-wide OSO at α = 0.8 and 0.2 · held the same: a generated idea graph (6 levels × 32 ideas, 2 parents each, every level equally hard, composition 0.7, 8 targets), 96 identical agents, 1 attempt per agent per round, paid until half the targets are solved, no flat mint, knowledge reward 1 per new bit, no validation · measure: money to solve half the targets, lower is better · 20 graphs × 3 runs on each, per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The simple model with 96 identical agents on a generated idea graph of 6 levels × 32 ideas (2 ideas per agent), 2 parents each, composition 0.7, every level equally hard, 8 targets on the top level; each graph run 3 times. Traditional rules (α = 1, nothing published before a target), with agents in equal labs of 1, 2, 4, 8, 16, 32, 48, 96; lab mates share every proof at once, privately. Against OSO across the whole field at α = 0.8 and 0.2. Each agent makes 1 attempt per round; the funder pays until half the targets are solved, and the measure is the money spent by then. Held fixed: equal money per agent every round, no flat mint, a knowledge reward of 1 per new bit flowing back with α, no validation.

Values are mean ± standard deviation over runs.

| society | money to half the targets | targets solved | waste | sharing | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0), alone | 587 ± 257 | 4.3 ± 0.6 | 0.47 ± 0.10 | 0.00 ± 0.00 | 1.19 ± 0.82 |
| Labs of 2 | 488 ± 234 | 4.3 ± 0.6 | 0.43 ± 0.09 | 0.00 ± 0.01 | 1.38 ± 0.70 |
| Labs of 4 | 472 ± 251 | 4.2 ± 0.5 | 0.42 ± 0.11 | 0.01 ± 0.01 | 1.51 ± 0.97 |
| Labs of 8 | 368 ± 154 | 4.3 ± 0.6 | 0.39 ± 0.09 | 0.02 ± 0.02 | 1.79 ± 0.81 |
| Labs of 16 | 355 ± 134 | 4.5 ± 0.7 | 0.38 ± 0.08 | 0.04 ± 0.04 | 1.91 ± 0.96 |
| Labs of 32 | 283 ± 84 | 4.7 ± 0.8 | 0.34 ± 0.06 | 0.10 ± 0.06 | 2.34 ± 0.87 |
| Labs of 48 | 250 ± 83 | 4.8 ± 1.1 | 0.30 ± 0.06 | 0.15 ± 0.11 | 2.71 ± 1.10 |
| Labs of 96 (one lab of everyone) | 211 ± 52 | 5.2 ± 1.2 | 0.21 ± 0.05 | 0.29 ± 0.10 | 3.27 ± 0.83 |
| OSO (α = 0.8, β = 1) | 227 ± 53 | 5.1 ± 1.0 | 0.23 ± 0.05 | 1.00 ± 0.00 | 2.96 ± 0.66 |
| OSO (α = 0.2, β = 1) | 277 ± 85 | 5.0 ± 1.0 | 0.24 ± 0.04 | 1.00 ± 0.00 | 2.50 ± 0.81 |

**Graph or luck?** 20 graphs, 3 runs on each. Each cell: the average, then how much it varies from graph to graph (standard deviation of the graph averages) and between runs on one graph (standard deviation within a graph).

| row | hardest level | targets solved | waste |
| --- | --- | --- | --- |
| Traditional (α = 1, β = 0), alone | 6.00 (graphs 0.00, runs 0.00) | 4.32 (graphs 0.46, runs 0.47) | 0.47 (graphs 0.06, runs 0.09) |
| Labs of 2 | 6.00 (graphs 0.00, runs 0.00) | 4.30 (graphs 0.47, runs 0.45) | 0.43 (graphs 0.05, runs 0.09) |
| Labs of 4 | 6.00 (graphs 0.00, runs 0.00) | 4.23 (graphs 0.24, runs 0.53) | 0.42 (graphs 0.07, runs 0.10) |
| Labs of 8 | 6.00 (graphs 0.00, runs 0.00) | 4.35 (graphs 0.35, runs 0.61) | 0.39 (graphs 0.07, runs 0.08) |
| Labs of 16 | 6.00 (graphs 0.00, runs 0.00) | 4.52 (graphs 0.43, runs 0.75) | 0.38 (graphs 0.05, runs 0.09) |
| Labs of 32 | 6.00 (graphs 0.00, runs 0.00) | 4.72 (graphs 0.46, runs 0.84) | 0.34 (graphs 0.03, runs 0.06) |
| Labs of 48 | 6.00 (graphs 0.00, runs 0.00) | 4.77 (graphs 0.58, runs 1.09) | 0.30 (graphs 0.04, runs 0.05) |
| Labs of 96 (one lab of everyone) | 6.00 (graphs 0.00, runs 0.00) | 5.20 (graphs 0.62, runs 1.20) | 0.21 (graphs 0.04, runs 0.03) |
| OSO (α = 0.8, β = 1) | 6.00 (graphs 0.00, runs 0.00) | 5.08 (graphs 0.54, runs 1.07) | 0.23 (graphs 0.04, runs 0.03) |
| OSO (α = 0.2, β = 1) | 6.00 (graphs 0.00, runs 0.00) | 5.00 (graphs 0.43, runs 1.06) | 0.24 (graphs 0.03, runs 0.03) |

Code: commit `594438e`. Experiment: [config/experiments/simple-ideas-6x32-p2-len3g0-comp0-7-lab-size-96-agents-20261028.yaml](../../config/experiments/simple-ideas-6x32-p2-len3g0-comp0-7-lab-size-96-agents-20261028.yaml). Command: `npm run sim -- simple-ideas-6x32-p2-len3g0-comp0-7-lab-size-96-agents-20261028 --seeds 60 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
