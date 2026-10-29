# Lab size with 192 agents, deeper ideas harder by 4 bits per level

**Question:** With 192 agents in labs of 1 to 192 that share inside the lab, how much money does the field need to solve half the targets, against OSO across the whole field?

**Answer:** Best: Labs of 192 (one lab of everyone), 9952.0. Best traditional: Traditional (α = 1, β = 0), alone, 722176.0. Clear difference.

![Lab size with 192 agents, deeper ideas harder by 4 bits per level](figures/compare.svg)

| society | money to half the targets | targets solved | waste | ROI (value per spend) |
| --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0), alone | 722176 ± 80457 | 8.0 ± 0.0 | 0.89 ± 0.01 | 0.00 ± 0.00 |
| Labs of 2 | 415760 ± 36507 | 8.0 ± 0.0 | 0.88 ± 0.01 | 0.00 ± 0.00 |
| Labs of 4 | 225616 ± 22918 | 8.0 ± 0.0 | 0.86 ± 0.01 | 0.00 ± 0.00 |
| Labs of 8 | 131312 ± 13192 | 8.0 ± 0.0 | 0.85 ± 0.01 | 0.01 ± 0.00 |
| Labs of 16 | 74560 ± 5496 | 8.0 ± 0.0 | 0.82 ± 0.01 | 0.01 ± 0.00 |
| Labs of 32 | 41552 ± 3437 | 8.0 ± 0.2 | 0.77 ± 0.02 | 0.02 ± 0.00 |
| Labs of 64 | 23680 ± 1848 | 8.2 ± 0.4 | 0.69 ± 0.02 | 0.04 ± 0.00 |
| Labs of 96 | 17160 ± 1743 | 8.3 ± 0.6 | 0.61 ± 0.02 | 0.06 ± 0.01 |
| Labs of 192 (one lab of everyone) | 9952 ± 965 | 8.1 ± 0.3 | 0.44 ± 0.03 | 0.11 ± 0.01 |
| OSO (α = 0.8, β = 1) | 14504 ± 2827 | 8.2 ± 0.5 | 0.51 ± 0.04 | 0.08 ± 0.02 |
| OSO (α = 0.2, β = 1) | 14056 ± 2112 | 8.0 ± 0.2 | 0.54 ± 0.03 | 0.07 ± 0.01 |

**Design** (fixed before the run): compared labs of 1, 2, 4, 8, 16, 32, 64, 96, 192 against field-wide OSO at α = 0.8 and 0.2 · held the same: a generated idea graph (6 levels × 64 ideas, 2 parents each, deeper ideas harder by 4 bits per level, composition 0.7, 16 targets), 192 identical agents, 1 attempt per agent per round, paid until half the targets are solved, no flat mint, knowledge reward 1 per new bit, no validation · measure: money to solve half the targets, lower is better · 8 graphs × 3 runs on each, per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The simple model with 192 identical agents on a generated idea graph of 6 levels × 64 ideas (2 ideas per agent), 2 parents each, composition 0.7, deeper ideas harder by 4 bits per level, 16 targets on the top level; each graph run 3 times. Traditional rules (α = 1, nothing published before a target), with agents in equal labs of 1, 2, 4, 8, 16, 32, 64, 96, 192; lab mates share every proof at once, privately. Against OSO across the whole field at α = 0.8 and 0.2. Each agent makes 1 attempt per round; the funder pays until half the targets are solved, and the measure is the money spent by then. Held fixed: equal money per agent every round, no flat mint, a knowledge reward of 1 per new bit flowing back with α, no validation.

Values are mean ± standard deviation over runs.

| society | money to half the targets | targets solved | waste | sharing | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0), alone | 722176 ± 80457 | 8.0 ± 0.0 | 0.89 ± 0.01 | 0.00 ± 0.00 | 0.00 ± 0.00 |
| Labs of 2 | 415760 ± 36507 | 8.0 ± 0.0 | 0.88 ± 0.01 | 0.00 ± 0.00 | 0.00 ± 0.00 |
| Labs of 4 | 225616 ± 22918 | 8.0 ± 0.0 | 0.86 ± 0.01 | 0.00 ± 0.00 | 0.00 ± 0.00 |
| Labs of 8 | 131312 ± 13192 | 8.0 ± 0.0 | 0.85 ± 0.01 | 0.00 ± 0.00 | 0.01 ± 0.00 |
| Labs of 16 | 74560 ± 5496 | 8.0 ± 0.0 | 0.82 ± 0.01 | 0.00 ± 0.00 | 0.01 ± 0.00 |
| Labs of 32 | 41552 ± 3437 | 8.0 ± 0.2 | 0.77 ± 0.02 | 0.00 ± 0.00 | 0.02 ± 0.00 |
| Labs of 64 | 23680 ± 1848 | 8.2 ± 0.4 | 0.69 ± 0.02 | 0.00 ± 0.00 | 0.04 ± 0.00 |
| Labs of 96 | 17160 ± 1743 | 8.3 ± 0.6 | 0.61 ± 0.02 | 0.00 ± 0.00 | 0.06 ± 0.01 |
| Labs of 192 (one lab of everyone) | 9952 ± 965 | 8.1 ± 0.3 | 0.44 ± 0.03 | 0.00 ± 0.00 | 0.11 ± 0.01 |
| OSO (α = 0.8, β = 1) | 14504 ± 2827 | 8.2 ± 0.5 | 0.51 ± 0.04 | 1.00 ± 0.00 | 0.08 ± 0.02 |
| OSO (α = 0.2, β = 1) | 14056 ± 2112 | 8.0 ± 0.2 | 0.54 ± 0.03 | 1.00 ± 0.00 | 0.07 ± 0.01 |

**Graph or luck?** 8 graphs, 3 runs on each. Each cell: the average, then how much it varies from graph to graph (standard deviation of the graph averages) and between runs on one graph (standard deviation within a graph).

| row | hardest level | targets solved | waste |
| --- | --- | --- | --- |
| Traditional (α = 1, β = 0), alone | 6.00 (graphs 0.00, runs 0.00) | 8.00 (graphs 0.00, runs 0.00) | 0.89 (graphs 0.01, runs 0.01) |
| Labs of 2 | 6.00 (graphs 0.00, runs 0.00) | 8.00 (graphs 0.00, runs 0.00) | 0.88 (graphs 0.01, runs 0.01) |
| Labs of 4 | 6.00 (graphs 0.00, runs 0.00) | 8.00 (graphs 0.00, runs 0.00) | 0.86 (graphs 0.01, runs 0.01) |
| Labs of 8 | 6.00 (graphs 0.00, runs 0.00) | 8.00 (graphs 0.00, runs 0.00) | 0.85 (graphs 0.01, runs 0.01) |
| Labs of 16 | 6.00 (graphs 0.00, runs 0.00) | 8.00 (graphs 0.00, runs 0.00) | 0.82 (graphs 0.01, runs 0.01) |
| Labs of 32 | 6.00 (graphs 0.00, runs 0.00) | 8.04 (graphs 0.12, runs 0.20) | 0.77 (graphs 0.01, runs 0.01) |
| Labs of 64 | 6.00 (graphs 0.00, runs 0.00) | 8.17 (graphs 0.25, runs 0.35) | 0.69 (graphs 0.02, runs 0.01) |
| Labs of 96 | 6.00 (graphs 0.00, runs 0.00) | 8.29 (graphs 0.45, runs 0.41) | 0.61 (graphs 0.02, runs 0.01) |
| Labs of 192 (one lab of everyone) | 6.00 (graphs 0.00, runs 0.00) | 8.13 (graphs 0.17, runs 0.35) | 0.44 (graphs 0.03, runs 0.02) |
| OSO (α = 0.8, β = 1) | 6.00 (graphs 0.00, runs 0.00) | 8.17 (graphs 0.25, runs 0.50) | 0.51 (graphs 0.03, runs 0.03) |
| OSO (α = 0.2, β = 1) | 6.00 (graphs 0.00, runs 0.00) | 8.04 (graphs 0.12, runs 0.20) | 0.54 (graphs 0.02, runs 0.03) |

Code: commit `776b77f`. Experiment: [config/experiments/simple-ideas-6x64-p2-len3g4-comp0-7-lab-size-192-agents-20261028.yaml](../../config/experiments/simple-ideas-6x64-p2-len3g4-comp0-7-lab-size-192-agents-20261028.yaml). Command: `npm run sim -- simple-ideas-6x64-p2-len3g4-comp0-7-lab-size-192-agents-20261028 --seeds 24 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
