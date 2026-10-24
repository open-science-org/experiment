# Simple model on a generated idea graph: α × β

**Question:** On a generated idea graph, how far does a society get for the same money, by α and β?

**Answer:** Best: α = 1, β = 0.5, 6.0 (3 more tie). Best traditional: Traditional (α = 1, β = 0), 0.2. Clear difference.

![Simple model on a generated idea graph: α × β](figures/compare.svg)

| society | frontier | value gained | sharing | ROI (value per spend) |
| --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 0.2 ± 1.2 | 5 ± 25 | 0.00 ± 0.00 | 0.00 ± 0.02 |
| α = 1, β = 0.5 | 6.0 ± 0.0 | 256 ± 0 | 0.54 ± 0.09 | 0.46 ± 0.14 |
| α = 1, β = 1 | 6.0 ± 0.0 | 256 ± 0 | 1.00 ± 0.00 | 0.72 ± 0.26 |
| α = 0.5, β = 0 | 0.4 ± 1.4 | 8 ± 31 | 0.00 ± 0.00 | 0.01 ± 0.03 |
| α = 0.5, β = 0.5 | 6.0 ± 0.0 | 256 ± 0 | 0.53 ± 0.10 | 0.49 ± 0.22 |
| OSO (α = 0.5, β = 1) | 6.0 ± 0.0 | 256 ± 0 | 1.00 ± 0.00 | 0.71 ± 0.27 |

**Design** (fixed before the run): compared α in {1, 0.5} × β in {0, 0.5, 1} · held the same: a generated idea graph (6 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7), 12 identical agents, budget 1200 split equally, no mint, no validation · measure: hardest level published, higher is better · 50 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The simple model on a generated idea graph (6 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7); each run draws its own graph. Only α and β vary. Held fixed: 12 identical agents, a budget of 1200 split equally every round (ρ = 0), no mint, no validation.

Values are mean ± standard deviation over runs.

| society | frontier | value gained | ROI (value per spend) | sharing | targets solved | cost |
| --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 0.2 ± 1.2 | 5 ± 25 | 0.00 ± 0.02 | 0.00 ± 0.00 | 0.0 ± 0.2 | 678 ± 365 |
| α = 1, β = 0.5 | 6.0 ± 0.0 | 256 ± 0 | 0.46 ± 0.14 | 0.54 ± 0.09 | 2.0 ± 0.0 | 412 ± 128 |
| α = 1, β = 1 | 6.0 ± 0.0 | 256 ± 0 | 0.72 ± 0.26 | 1.00 ± 0.00 | 2.0 ± 0.0 | 292 ± 110 |
| α = 0.5, β = 0 | 0.4 ± 1.4 | 8 ± 31 | 0.01 ± 0.03 | 0.00 ± 0.00 | 0.1 ± 0.2 | 952 ± 194 |
| α = 0.5, β = 0.5 | 6.0 ± 0.0 | 256 ± 0 | 0.49 ± 0.22 | 0.53 ± 0.10 | 2.0 ± 0.0 | 453 ± 179 |
| OSO (α = 0.5, β = 1) | 6.0 ± 0.0 | 256 ± 0 | 0.71 ± 0.27 | 1.00 ± 0.00 | 2.0 ± 0.0 | 285 ± 93 |

Code: commit `4d59f4a` (with uncommitted changes). Experiment: [config/experiments/simple-ideas-6x8-p2-len3g2-comp0-7-alpha-beta-20261023-2.yaml](../../config/experiments/simple-ideas-6x8-p2-len3g2-comp0-7-alpha-beta-20261023-2.yaml). Command: `npm run sim -- simple-ideas-6x8-p2-len3g2-comp0-7-alpha-beta-20261023-2 --seeds 50 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
