# Lab size with 192 agents, deeper ideas harder by 2 bits per level

**Question:** With 192 agents in labs of 1 to 192 that share inside the lab, how much money does the field need to solve half the targets, against OSO across the whole field?

**Answer:** Best: Labs of 192 (one lab of everyone), 2592.0. Best traditional: Traditional (α = 1, β = 0), alone, 151584.0. Clear difference.

![Lab size with 192 agents, deeper ideas harder by 2 bits per level](figures/compare.svg)

| society | money to half the targets | targets solved | waste | ROI (value per spend) |
| --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0), alone | 151584 ± 22858 | 8.0 ± 0.0 | 0.90 ± 0.01 | 0.01 ± 0.00 |
| Labs of 2 | 90064 ± 12890 | 8.0 ± 0.0 | 0.88 ± 0.01 | 0.01 ± 0.00 |
| Labs of 4 | 57216 ± 8048 | 8.0 ± 0.2 | 0.86 ± 0.01 | 0.02 ± 0.00 |
| Labs of 8 | 32896 ± 3619 | 8.1 ± 0.3 | 0.84 ± 0.01 | 0.03 ± 0.00 |
| Labs of 16 | 18264 ± 1714 | 8.2 ± 0.7 | 0.80 ± 0.02 | 0.06 ± 0.01 |
| Labs of 32 | 10456 ± 979 | 8.3 ± 0.4 | 0.73 ± 0.02 | 0.10 ± 0.01 |
| Labs of 64 | 6208 ± 419 | 9.4 ± 1.3 | 0.65 ± 0.02 | 0.19 ± 0.03 |
| Labs of 96 | 4432 ± 310 | 10.0 ± 1.4 | 0.58 ± 0.02 | 0.29 ± 0.04 |
| Labs of 192 (one lab of everyone) | 2592 ± 272 | 10.2 ± 2.1 | 0.40 ± 0.03 | 0.51 ± 0.11 |
| OSO (α = 0.8, β = 1) | 2912 ± 347 | 8.6 ± 0.9 | 0.44 ± 0.04 | 0.38 ± 0.06 |
| OSO (α = 0.2, β = 1) | 2816 ± 338 | 8.3 ± 0.5 | 0.46 ± 0.03 | 0.38 ± 0.04 |

**Design** (fixed before the run): compared labs of 1, 2, 4, 8, 16, 32, 64, 96, 192 against field-wide OSO at α = 0.8 and 0.2 · held the same: a generated idea graph (6 levels × 64 ideas, 2 parents each, deeper ideas harder by 2 bits per level, composition 0.7, 16 targets), 192 identical agents, 1 attempt per agent per round, paid until half the targets are solved, no flat mint, knowledge reward 1 per new bit, no validation · measure: money to solve half the targets, lower is better · 8 graphs × 3 runs on each, per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The simple model with 192 identical agents on a generated idea graph of 6 levels × 64 ideas (2 ideas per agent), 2 parents each, composition 0.7, deeper ideas harder by 2 bits per level, 16 targets on the top level; each graph run 3 times. Traditional rules (α = 1, nothing published before a target), with agents in equal labs of 1, 2, 4, 8, 16, 32, 64, 96, 192; lab mates share every proof at once, privately. Against OSO across the whole field at α = 0.8 and 0.2. Each agent makes 1 attempt per round; the funder pays until half the targets are solved, and the measure is the money spent by then. Held fixed: equal money per agent every round, no flat mint, a knowledge reward of 1 per new bit flowing back with α, no validation.

Values are mean ± standard deviation over runs.

| society | money to half the targets | targets solved | waste | sharing | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0), alone | 151584 ± 22858 | 8.0 ± 0.0 | 0.90 ± 0.01 | 0.00 ± 0.00 | 0.01 ± 0.00 |
| Labs of 2 | 90064 ± 12890 | 8.0 ± 0.0 | 0.88 ± 0.01 | 0.00 ± 0.00 | 0.01 ± 0.00 |
| Labs of 4 | 57216 ± 8048 | 8.0 ± 0.2 | 0.86 ± 0.01 | 0.00 ± 0.00 | 0.02 ± 0.00 |
| Labs of 8 | 32896 ± 3619 | 8.1 ± 0.3 | 0.84 ± 0.01 | 0.00 ± 0.00 | 0.03 ± 0.00 |
| Labs of 16 | 18264 ± 1714 | 8.2 ± 0.7 | 0.80 ± 0.02 | 0.00 ± 0.00 | 0.06 ± 0.01 |
| Labs of 32 | 10456 ± 979 | 8.3 ± 0.4 | 0.73 ± 0.02 | 0.00 ± 0.00 | 0.10 ± 0.01 |
| Labs of 64 | 6208 ± 419 | 9.4 ± 1.3 | 0.65 ± 0.02 | 0.00 ± 0.00 | 0.19 ± 0.03 |
| Labs of 96 | 4432 ± 310 | 10.0 ± 1.4 | 0.58 ± 0.02 | 0.01 ± 0.01 | 0.29 ± 0.04 |
| Labs of 192 (one lab of everyone) | 2592 ± 272 | 10.2 ± 2.1 | 0.40 ± 0.03 | 0.03 ± 0.02 | 0.51 ± 0.11 |
| OSO (α = 0.8, β = 1) | 2912 ± 347 | 8.6 ± 0.9 | 0.44 ± 0.04 | 1.00 ± 0.00 | 0.38 ± 0.06 |
| OSO (α = 0.2, β = 1) | 2816 ± 338 | 8.3 ± 0.5 | 0.46 ± 0.03 | 1.00 ± 0.00 | 0.38 ± 0.04 |

**Graph or luck?** 8 graphs, 3 runs on each. Each cell: the average, then how much it varies from graph to graph (standard deviation of the graph averages) and between runs on one graph (standard deviation within a graph).

| row | hardest level | targets solved | waste |
| --- | --- | --- | --- |
| Traditional (α = 1, β = 0), alone | 6.00 (graphs 0.00, runs 0.00) | 8.00 (graphs 0.00, runs 0.00) | 0.90 (graphs 0.01, runs 0.01) |
| Labs of 2 | 6.00 (graphs 0.00, runs 0.00) | 8.00 (graphs 0.00, runs 0.00) | 0.88 (graphs 0.01, runs 0.01) |
| Labs of 4 | 6.00 (graphs 0.00, runs 0.00) | 8.04 (graphs 0.12, runs 0.20) | 0.86 (graphs 0.01, runs 0.01) |
| Labs of 8 | 6.00 (graphs 0.00, runs 0.00) | 8.13 (graphs 0.17, runs 0.35) | 0.84 (graphs 0.01, runs 0.01) |
| Labs of 16 | 6.00 (graphs 0.00, runs 0.00) | 8.21 (graphs 0.35, runs 0.68) | 0.80 (graphs 0.02, runs 0.01) |
| Labs of 32 | 6.00 (graphs 0.00, runs 0.00) | 8.25 (graphs 0.24, runs 0.46) | 0.73 (graphs 0.01, runs 0.02) |
| Labs of 64 | 6.00 (graphs 0.00, runs 0.00) | 9.38 (graphs 0.95, runs 1.08) | 0.65 (graphs 0.01, runs 0.01) |
| Labs of 96 | 6.00 (graphs 0.00, runs 0.00) | 10.00 (graphs 1.01, runs 1.24) | 0.58 (graphs 0.02, runs 0.02) |
| Labs of 192 (one lab of everyone) | 6.00 (graphs 0.00, runs 0.00) | 10.17 (graphs 1.49, runs 1.78) | 0.40 (graphs 0.03, runs 0.01) |
| OSO (α = 0.8, β = 1) | 6.00 (graphs 0.00, runs 0.00) | 8.63 (graphs 0.65, runs 0.74) | 0.44 (graphs 0.03, runs 0.03) |
| OSO (α = 0.2, β = 1) | 6.00 (graphs 0.00, runs 0.00) | 8.29 (graphs 0.38, runs 0.35) | 0.46 (graphs 0.02, runs 0.03) |

Code: commit `594438e`. Experiment: [config/experiments/simple-ideas-6x64-p2-len3g2-comp0-7-lab-size-192-agents-20261028.yaml](../../config/experiments/simple-ideas-6x64-p2-len3g2-comp0-7-lab-size-192-agents-20261028.yaml). Command: `npm run sim -- simple-ideas-6x64-p2-len3g2-comp0-7-lab-size-192-agents-20261028 --seeds 24 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
