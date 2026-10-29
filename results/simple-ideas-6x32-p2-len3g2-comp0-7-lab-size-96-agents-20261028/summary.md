# Lab size with 96 agents, deeper ideas harder by 2 bits per level

**Question:** With 96 agents in labs of 1 to 96 that share inside the lab, how much money does the field need to solve half the targets, against OSO across the whole field?

**Answer:** Best: Labs of 96 (one lab of everyone), 1211.2. Best traditional: Traditional (α = 1, β = 0), alone, 44521.6. Clear difference.

![Lab size with 96 agents, deeper ideas harder by 2 bits per level](figures/compare.svg)

| society | money to half the targets | targets solved | waste | ROI (value per spend) |
| --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0), alone | 44522 ± 9640 | 4.0 ± 0.2 | 0.89 ± 0.02 | 0.01 ± 0.00 |
| Labs of 2 | 26942 ± 4966 | 4.0 ± 0.1 | 0.87 ± 0.02 | 0.02 ± 0.00 |
| Labs of 4 | 15827 ± 2011 | 4.0 ± 0.2 | 0.84 ± 0.02 | 0.03 ± 0.00 |
| Labs of 8 | 8730 ± 1210 | 4.2 ± 0.4 | 0.79 ± 0.02 | 0.06 ± 0.01 |
| Labs of 16 | 5133 ± 544 | 4.2 ± 0.5 | 0.73 ± 0.02 | 0.11 ± 0.02 |
| Labs of 32 | 2922 ± 285 | 4.4 ± 0.7 | 0.63 ± 0.03 | 0.19 ± 0.03 |
| Labs of 48 | 2112 ± 243 | 4.6 ± 0.7 | 0.55 ± 0.03 | 0.28 ± 0.06 |
| Labs of 96 (one lab of everyone) | 1211 ± 153 | 4.9 ± 1.0 | 0.34 ± 0.03 | 0.52 ± 0.09 |
| OSO (α = 0.8, β = 1) | 1405 ± 221 | 4.3 ± 0.5 | 0.39 ± 0.05 | 0.40 ± 0.08 |
| OSO (α = 0.2, β = 1) | 1427 ± 218 | 4.5 ± 0.7 | 0.43 ± 0.06 | 0.41 ± 0.07 |

**Design** (fixed before the run): compared labs of 1, 2, 4, 8, 16, 32, 48, 96 against field-wide OSO at α = 0.8 and 0.2 · held the same: a generated idea graph (6 levels × 32 ideas, 2 parents each, deeper ideas harder by 2 bits per level, composition 0.7, 8 targets), 96 identical agents, 1 attempt per agent per round, paid until half the targets are solved, no flat mint, knowledge reward 1 per new bit, no validation · measure: money to solve half the targets, lower is better · 20 graphs × 3 runs on each, per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The simple model with 96 identical agents on a generated idea graph of 6 levels × 32 ideas (2 ideas per agent), 2 parents each, composition 0.7, deeper ideas harder by 2 bits per level, 8 targets on the top level; each graph run 3 times. Traditional rules (α = 1, nothing published before a target), with agents in equal labs of 1, 2, 4, 8, 16, 32, 48, 96; lab mates share every proof at once, privately. Against OSO across the whole field at α = 0.8 and 0.2. Each agent makes 1 attempt per round; the funder pays until half the targets are solved, and the measure is the money spent by then. Held fixed: equal money per agent every round, no flat mint, a knowledge reward of 1 per new bit flowing back with α, no validation.

Values are mean ± standard deviation over runs.

| society | money to half the targets | targets solved | waste | sharing | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0), alone | 44522 ± 9640 | 4.0 ± 0.2 | 0.89 ± 0.02 | 0.00 ± 0.00 | 0.01 ± 0.00 |
| Labs of 2 | 26942 ± 4966 | 4.0 ± 0.1 | 0.87 ± 0.02 | 0.00 ± 0.00 | 0.02 ± 0.00 |
| Labs of 4 | 15827 ± 2011 | 4.0 ± 0.2 | 0.84 ± 0.02 | 0.00 ± 0.00 | 0.03 ± 0.00 |
| Labs of 8 | 8730 ± 1210 | 4.2 ± 0.4 | 0.79 ± 0.02 | 0.00 ± 0.00 | 0.06 ± 0.01 |
| Labs of 16 | 5133 ± 544 | 4.2 ± 0.5 | 0.73 ± 0.02 | 0.00 ± 0.00 | 0.11 ± 0.02 |
| Labs of 32 | 2922 ± 285 | 4.4 ± 0.7 | 0.63 ± 0.03 | 0.00 ± 0.01 | 0.19 ± 0.03 |
| Labs of 48 | 2112 ± 243 | 4.6 ± 0.7 | 0.55 ± 0.03 | 0.01 ± 0.01 | 0.28 ± 0.06 |
| Labs of 96 (one lab of everyone) | 1211 ± 153 | 4.9 ± 1.0 | 0.34 ± 0.03 | 0.02 ± 0.02 | 0.52 ± 0.09 |
| OSO (α = 0.8, β = 1) | 1405 ± 221 | 4.3 ± 0.5 | 0.39 ± 0.05 | 1.00 ± 0.00 | 0.40 ± 0.08 |
| OSO (α = 0.2, β = 1) | 1427 ± 218 | 4.5 ± 0.7 | 0.43 ± 0.06 | 1.00 ± 0.00 | 0.41 ± 0.07 |

**Graph or luck?** 20 graphs, 3 runs on each. Each cell: the average, then how much it varies from graph to graph (standard deviation of the graph averages) and between runs on one graph (standard deviation within a graph).

| row | hardest level | targets solved | waste |
| --- | --- | --- | --- |
| Traditional (α = 1, β = 0), alone | 6.00 (graphs 0.00, runs 0.00) | 4.05 (graphs 0.12, runs 0.22) | 0.89 (graphs 0.01, runs 0.02) |
| Labs of 2 | 6.00 (graphs 0.00, runs 0.00) | 4.02 (graphs 0.07, runs 0.13) | 0.87 (graphs 0.02, runs 0.01) |
| Labs of 4 | 6.00 (graphs 0.00, runs 0.00) | 4.05 (graphs 0.12, runs 0.22) | 0.84 (graphs 0.01, runs 0.01) |
| Labs of 8 | 6.00 (graphs 0.00, runs 0.00) | 4.17 (graphs 0.23, runs 0.43) | 0.79 (graphs 0.01, runs 0.02) |
| Labs of 16 | 6.00 (graphs 0.00, runs 0.00) | 4.22 (graphs 0.31, runs 0.41) | 0.73 (graphs 0.02, runs 0.02) |
| Labs of 32 | 6.00 (graphs 0.00, runs 0.00) | 4.40 (graphs 0.35, runs 0.73) | 0.63 (graphs 0.03, runs 0.02) |
| Labs of 48 | 6.00 (graphs 0.00, runs 0.00) | 4.57 (graphs 0.41, runs 0.76) | 0.55 (graphs 0.03, runs 0.03) |
| Labs of 96 (one lab of everyone) | 6.00 (graphs 0.00, runs 0.00) | 4.90 (graphs 0.50, runs 0.99) | 0.34 (graphs 0.03, runs 0.02) |
| OSO (α = 0.8, β = 1) | 6.00 (graphs 0.00, runs 0.00) | 4.35 (graphs 0.30, runs 0.56) | 0.39 (graphs 0.04, runs 0.04) |
| OSO (α = 0.2, β = 1) | 6.00 (graphs 0.00, runs 0.00) | 4.45 (graphs 0.38, runs 0.72) | 0.43 (graphs 0.05, runs 0.04) |

Code: commit `594438e`. Experiment: [config/experiments/simple-ideas-6x32-p2-len3g2-comp0-7-lab-size-96-agents-20261028.yaml](../../config/experiments/simple-ideas-6x32-p2-len3g2-comp0-7-lab-size-96-agents-20261028.yaml). Command: `npm run sim -- simple-ideas-6x32-p2-len3g2-comp0-7-lab-size-96-agents-20261028 --seeds 60 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
