# Lab size with 96 agents, deeper ideas harder by 4 bits per level

**Question:** With 96 agents in labs of 1 to 96 that share inside the lab, how much money does the field need to solve half the targets, against OSO across the whole field?

**Answer:** Best: Labs of 96 (one lab of everyone), 5702.4. Best traditional: Traditional (α = 1, β = 0), alone, 215817.6. Clear difference.

![Lab size with 96 agents, deeper ideas harder by 4 bits per level](figures/compare.svg)

| society | money to half the targets | targets solved | waste | ROI (value per spend) |
| --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0), alone | 215818 ± 34099 | 4.0 ± 0.1 | 0.89 ± 0.01 | 0.00 ± 0.00 |
| Labs of 2 | 116462 ± 19571 | 4.0 ± 0.1 | 0.87 ± 0.01 | 0.00 ± 0.00 |
| Labs of 4 | 65227 ± 10380 | 4.0 ± 0.0 | 0.85 ± 0.01 | 0.01 ± 0.00 |
| Labs of 8 | 37067 ± 5968 | 4.0 ± 0.2 | 0.81 ± 0.01 | 0.01 ± 0.00 |
| Labs of 16 | 20690 ± 4169 | 4.0 ± 0.1 | 0.76 ± 0.02 | 0.03 ± 0.00 |
| Labs of 32 | 12048 ± 2769 | 4.1 ± 0.3 | 0.66 ± 0.03 | 0.05 ± 0.01 |
| Labs of 48 | 9045 ± 1915 | 4.0 ± 0.2 | 0.60 ± 0.03 | 0.06 ± 0.01 |
| Labs of 96 (one lab of everyone) | 5702 ± 1630 | 4.0 ± 0.2 | 0.41 ± 0.05 | 0.10 ± 0.03 |
| OSO (α = 0.8, β = 1) | 7032 ± 2024 | 4.0 ± 0.0 | 0.47 ± 0.06 | 0.08 ± 0.03 |
| OSO (α = 0.2, β = 1) | 7187 ± 1878 | 4.0 ± 0.1 | 0.49 ± 0.05 | 0.08 ± 0.02 |

**Design** (fixed before the run): compared labs of 1, 2, 4, 8, 16, 32, 48, 96 against field-wide OSO at α = 0.8 and 0.2 · held the same: a generated idea graph (6 levels × 32 ideas, 2 parents each, deeper ideas harder by 4 bits per level, composition 0.7, 8 targets), 96 identical agents, 1 attempt per agent per round, paid until half the targets are solved, no flat mint, knowledge reward 1 per new bit, no validation · measure: money to solve half the targets, lower is better · 20 graphs × 3 runs on each, per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The simple model with 96 identical agents on a generated idea graph of 6 levels × 32 ideas (2 ideas per agent), 2 parents each, composition 0.7, deeper ideas harder by 4 bits per level, 8 targets on the top level; each graph run 3 times. Traditional rules (α = 1, nothing published before a target), with agents in equal labs of 1, 2, 4, 8, 16, 32, 48, 96; lab mates share every proof at once, privately. Against OSO across the whole field at α = 0.8 and 0.2. Each agent makes 1 attempt per round; the funder pays until half the targets are solved, and the measure is the money spent by then. Held fixed: equal money per agent every round, no flat mint, a knowledge reward of 1 per new bit flowing back with α, no validation.

Values are mean ± standard deviation over runs.

| society | money to half the targets | targets solved | waste | sharing | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0), alone | 215818 ± 34099 | 4.0 ± 0.1 | 0.89 ± 0.01 | 0.00 ± 0.00 | 0.00 ± 0.00 |
| Labs of 2 | 116462 ± 19571 | 4.0 ± 0.1 | 0.87 ± 0.01 | 0.00 ± 0.00 | 0.00 ± 0.00 |
| Labs of 4 | 65227 ± 10380 | 4.0 ± 0.0 | 0.85 ± 0.01 | 0.00 ± 0.00 | 0.01 ± 0.00 |
| Labs of 8 | 37067 ± 5968 | 4.0 ± 0.2 | 0.81 ± 0.01 | 0.00 ± 0.00 | 0.01 ± 0.00 |
| Labs of 16 | 20690 ± 4169 | 4.0 ± 0.1 | 0.76 ± 0.02 | 0.00 ± 0.00 | 0.03 ± 0.00 |
| Labs of 32 | 12048 ± 2769 | 4.1 ± 0.3 | 0.66 ± 0.03 | 0.00 ± 0.00 | 0.05 ± 0.01 |
| Labs of 48 | 9045 ± 1915 | 4.0 ± 0.2 | 0.60 ± 0.03 | 0.00 ± 0.00 | 0.06 ± 0.01 |
| Labs of 96 (one lab of everyone) | 5702 ± 1630 | 4.0 ± 0.2 | 0.41 ± 0.05 | 0.00 ± 0.00 | 0.10 ± 0.03 |
| OSO (α = 0.8, β = 1) | 7032 ± 2024 | 4.0 ± 0.0 | 0.47 ± 0.06 | 1.00 ± 0.00 | 0.08 ± 0.03 |
| OSO (α = 0.2, β = 1) | 7187 ± 1878 | 4.0 ± 0.1 | 0.49 ± 0.05 | 1.00 ± 0.00 | 0.08 ± 0.02 |

**Graph or luck?** 20 graphs, 3 runs on each. Each cell: the average, then how much it varies from graph to graph (standard deviation of the graph averages) and between runs on one graph (standard deviation within a graph).

| row | hardest level | targets solved | waste |
| --- | --- | --- | --- |
| Traditional (α = 1, β = 0), alone | 6.00 (graphs 0.00, runs 0.00) | 4.02 (graphs 0.07, runs 0.13) | 0.89 (graphs 0.01, runs 0.01) |
| Labs of 2 | 6.00 (graphs 0.00, runs 0.00) | 4.02 (graphs 0.07, runs 0.13) | 0.87 (graphs 0.01, runs 0.01) |
| Labs of 4 | 6.00 (graphs 0.00, runs 0.00) | 4.00 (graphs 0.00, runs 0.00) | 0.85 (graphs 0.01, runs 0.01) |
| Labs of 8 | 6.00 (graphs 0.00, runs 0.00) | 4.03 (graphs 0.10, runs 0.18) | 0.81 (graphs 0.01, runs 0.01) |
| Labs of 16 | 6.00 (graphs 0.00, runs 0.00) | 4.02 (graphs 0.07, runs 0.13) | 0.76 (graphs 0.02, runs 0.02) |
| Labs of 32 | 6.00 (graphs 0.00, runs 0.00) | 4.07 (graphs 0.23, runs 0.13) | 0.66 (graphs 0.02, runs 0.02) |
| Labs of 48 | 6.00 (graphs 0.00, runs 0.00) | 4.03 (graphs 0.15, runs 0.13) | 0.60 (graphs 0.03, runs 0.02) |
| Labs of 96 (one lab of everyone) | 6.00 (graphs 0.00, runs 0.00) | 4.05 (graphs 0.12, runs 0.22) | 0.41 (graphs 0.04, runs 0.02) |
| OSO (α = 0.8, β = 1) | 6.00 (graphs 0.00, runs 0.00) | 4.00 (graphs 0.00, runs 0.00) | 0.47 (graphs 0.05, runs 0.03) |
| OSO (α = 0.2, β = 1) | 6.00 (graphs 0.00, runs 0.00) | 4.02 (graphs 0.07, runs 0.13) | 0.49 (graphs 0.04, runs 0.04) |

Code: commit `594438e`. Experiment: [config/experiments/simple-ideas-6x32-p2-len3g4-comp0-7-lab-size-96-agents-20261028.yaml](../../config/experiments/simple-ideas-6x32-p2-len3g4-comp0-7-lab-size-96-agents-20261028.yaml). Command: `npm run sim -- simple-ideas-6x32-p2-len3g4-comp0-7-lab-size-96-agents-20261028 --seeds 60 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
