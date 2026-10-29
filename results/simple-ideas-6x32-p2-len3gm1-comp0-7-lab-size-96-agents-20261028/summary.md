# Lab size with 96 agents, deeper ideas easier (1 bit fewer per level)

**Question:** With 96 agents in labs of 1 to 96 that share inside the lab, how much money does the field need to solve half the targets, against OSO across the whole field?

**Answer:** Best: Labs of 96 (one lab of everyone), 102.4. Best traditional: Traditional (α = 1, β = 0), alone, 128.0. Clear difference.

![Lab size with 96 agents, deeper ideas easier (1 bit fewer per level)](figures/compare.svg)

| society | money to half the targets | targets solved | waste | ROI (value per spend) |
| --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0), alone | 128 ± 46 | 5.3 ± 1.1 | 0.36 ± 0.09 | 5.68 ± 1.47 |
| Labs of 2 | 128 ± 46 | 5.5 ± 1.1 | 0.34 ± 0.10 | 5.96 ± 1.74 |
| Labs of 4 | 125 ± 48 | 5.3 ± 1.1 | 0.34 ± 0.09 | 5.96 ± 1.93 |
| Labs of 8 | 120 ± 42 | 5.3 ± 1.1 | 0.33 ± 0.09 | 6.06 ± 1.85 |
| Labs of 16 | 120 ± 42 | 5.3 ± 1.1 | 0.31 ± 0.08 | 6.02 ± 1.59 |
| Labs of 32 | 118 ± 41 | 5.5 ± 1.2 | 0.26 ± 0.06 | 6.36 ± 1.71 |
| Labs of 48 | 115 ± 39 | 5.4 ± 1.3 | 0.23 ± 0.06 | 6.38 ± 1.72 |
| Labs of 96 (one lab of everyone) | 102 ± 24 | 5.8 ± 1.2 | 0.11 ± 0.04 | 7.42 ± 1.44 |
| OSO (α = 0.8, β = 1) | 117 ± 40 | 5.3 ± 1.1 | 0.14 ± 0.04 | 6.24 ± 1.92 |
| OSO (α = 0.2, β = 1) | 168 ± 70 | 4.6 ± 0.7 | 0.20 ± 0.06 | 4.11 ± 1.70 |

**Design** (fixed before the run): compared labs of 1, 2, 4, 8, 16, 32, 48, 96 against field-wide OSO at α = 0.8 and 0.2 · held the same: a generated idea graph (6 levels × 32 ideas, 2 parents each, deeper ideas easier (1 bit fewer per level), composition 0.7, 8 targets), 96 identical agents, 1 attempt per agent per round, paid until half the targets are solved, no flat mint, knowledge reward 1 per new bit, no validation · measure: money to solve half the targets, lower is better · 20 graphs × 3 runs on each, per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The simple model with 96 identical agents on a generated idea graph of 6 levels × 32 ideas (2 ideas per agent), 2 parents each, composition 0.7, deeper ideas easier (1 bit fewer per level), 8 targets on the top level; each graph run 3 times. Traditional rules (α = 1, nothing published before a target), with agents in equal labs of 1, 2, 4, 8, 16, 32, 48, 96; lab mates share every proof at once, privately. Against OSO across the whole field at α = 0.8 and 0.2. Each agent makes 1 attempt per round; the funder pays until half the targets are solved, and the measure is the money spent by then. Held fixed: equal money per agent every round, no flat mint, a knowledge reward of 1 per new bit flowing back with α, no validation.

Values are mean ± standard deviation over runs.

| society | money to half the targets | targets solved | waste | sharing | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0), alone | 128 ± 46 | 5.3 ± 1.1 | 0.36 ± 0.09 | 0.00 ± 0.00 | 5.68 ± 1.47 |
| Labs of 2 | 128 ± 46 | 5.5 ± 1.1 | 0.34 ± 0.10 | 0.00 ± 0.01 | 5.96 ± 1.74 |
| Labs of 4 | 125 ± 48 | 5.3 ± 1.1 | 0.34 ± 0.09 | 0.02 ± 0.03 | 5.96 ± 1.93 |
| Labs of 8 | 120 ± 42 | 5.3 ± 1.1 | 0.33 ± 0.09 | 0.04 ± 0.04 | 6.06 ± 1.85 |
| Labs of 16 | 120 ± 42 | 5.3 ± 1.1 | 0.31 ± 0.08 | 0.09 ± 0.06 | 6.02 ± 1.59 |
| Labs of 32 | 118 ± 41 | 5.5 ± 1.2 | 0.26 ± 0.06 | 0.17 ± 0.09 | 6.36 ± 1.71 |
| Labs of 48 | 115 ± 39 | 5.4 ± 1.3 | 0.23 ± 0.06 | 0.23 ± 0.11 | 6.38 ± 1.72 |
| Labs of 96 (one lab of everyone) | 102 ± 24 | 5.8 ± 1.2 | 0.11 ± 0.04 | 0.42 ± 0.13 | 7.42 ± 1.44 |
| OSO (α = 0.8, β = 1) | 117 ± 40 | 5.3 ± 1.1 | 0.14 ± 0.04 | 1.00 ± 0.00 | 6.24 ± 1.92 |
| OSO (α = 0.2, β = 1) | 168 ± 70 | 4.6 ± 0.7 | 0.20 ± 0.06 | 1.00 ± 0.00 | 4.11 ± 1.70 |

**Graph or luck?** 20 graphs, 3 runs on each. Each cell: the average, then how much it varies from graph to graph (standard deviation of the graph averages) and between runs on one graph (standard deviation within a graph).

| row | hardest level | targets solved | waste |
| --- | --- | --- | --- |
| Traditional (α = 1, β = 0), alone | 6.00 (graphs 0.00, runs 0.00) | 5.28 (graphs 0.72, runs 1.03) | 0.36 (graphs 0.06, runs 0.08) |
| Labs of 2 | 6.00 (graphs 0.00, runs 0.00) | 5.48 (graphs 0.68, runs 1.03) | 0.34 (graphs 0.07, runs 0.08) |
| Labs of 4 | 6.00 (graphs 0.00, runs 0.00) | 5.28 (graphs 0.52, runs 1.19) | 0.34 (graphs 0.06, runs 0.09) |
| Labs of 8 | 6.00 (graphs 0.00, runs 0.00) | 5.25 (graphs 0.71, runs 1.03) | 0.33 (graphs 0.05, runs 0.09) |
| Labs of 16 | 6.00 (graphs 0.00, runs 0.00) | 5.30 (graphs 0.58, runs 1.15) | 0.31 (graphs 0.05, runs 0.07) |
| Labs of 32 | 6.00 (graphs 0.00, runs 0.00) | 5.52 (graphs 0.81, runs 1.11) | 0.26 (graphs 0.05, runs 0.06) |
| Labs of 48 | 6.00 (graphs 0.00, runs 0.00) | 5.43 (graphs 0.48, runs 1.41) | 0.23 (graphs 0.03, runs 0.06) |
| Labs of 96 (one lab of everyone) | 6.00 (graphs 0.00, runs 0.00) | 5.83 (graphs 0.67, runs 1.15) | 0.11 (graphs 0.03, runs 0.03) |
| OSO (α = 0.8, β = 1) | 6.00 (graphs 0.00, runs 0.00) | 5.28 (graphs 0.51, runs 1.22) | 0.14 (graphs 0.02, runs 0.04) |
| OSO (α = 0.2, β = 1) | 6.00 (graphs 0.00, runs 0.00) | 4.60 (graphs 0.32, runs 0.82) | 0.20 (graphs 0.04, runs 0.06) |

Code: commit `594438e`. Experiment: [config/experiments/simple-ideas-6x32-p2-len3gm1-comp0-7-lab-size-96-agents-20261028.yaml](../../config/experiments/simple-ideas-6x32-p2-len3gm1-comp0-7-lab-size-96-agents-20261028.yaml). Command: `npm run sim -- simple-ideas-6x32-p2-len3gm1-comp0-7-lab-size-96-agents-20261028 --seeds 60 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
