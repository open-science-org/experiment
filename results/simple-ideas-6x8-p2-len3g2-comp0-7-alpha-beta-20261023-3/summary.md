# Simple model on a generated idea graph: α × β

**Question:** On a generated idea graph, how far does a society get for the same money, by α and β?

**Answer:** Best: α = 1, β = 1, 6.0 (5 more tie). Best traditional: Traditional (α = 1, β = 0), 0.2. Clear difference.

![Simple model on a generated idea graph: α × β](figures/compare.svg)

| society | frontier | value gained | knowledge (bits) | ROI (value per spend) |
| --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 0.2 ± 1.2 | 8 ± 40 | 59 ± 8 | 0.01 ± 0.04 |
| α = 1, β = 0.5 | 6.0 ± 0.2 | 246 ± 51 | 93 ± 12 | 0.43 ± 0.14 |
| α = 1, β = 1 | 6.0 ± 0.0 | 256 ± 0 | 90 ± 13 | 0.74 ± 0.27 |
| α = 0.5, β = 0 | 0.1 ± 0.8 | 3 ± 18 | 59 ± 8 | 0.00 ± 0.02 |
| α = 0.5, β = 0.5 | 6.0 ± 0.0 | 256 ± 0 | 94 ± 12 | 0.45 ± 0.13 |
| OSO (α = 0.5, β = 1) | 6.0 ± 0.0 | 256 ± 0 | 91 ± 13 | 0.73 ± 0.25 |
| α = 0.05, β = 0 | 0.4 ± 1.4 | 10 ± 44 | 62 ± 9 | 0.01 ± 0.04 |
| α = 0.05, β = 0.5 | 6.0 ± 0.0 | 256 ± 0 | 92 ± 12 | 0.50 ± 0.14 |
| OSO (α = 0.05, β = 1) | 6.0 ± 0.0 | 256 ± 0 | 89 ± 12 | 0.80 ± 0.22 |

**Design** (fixed before the run): compared α in {1, 0.5, 0.05} × β in {0, 0.5, 1} · held the same: a generated idea graph (6 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7), 12 identical agents, budget 1200 split equally, no mint, no validation · measure: hardest level published, higher is better · 50 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The simple model on a generated idea graph (6 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7); each run draws its own graph. Only α and β vary. Held fixed: 12 identical agents, a budget of 1200 split equally every round (ρ = 0), no mint, no validation.

Values are mean ± standard deviation over runs.

| society | frontier | value gained | ROI (value per spend) | knowledge (bits) | knowledge published (bits) | bits per money | sharing | targets solved | cost |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 0.2 ± 1.2 | 8 ± 40 | 0.01 ± 0.04 | 59 ± 8 | 1 ± 7 | 0.050 ± 0.007 | 0.00 ± 0.00 | 0.1 ± 0.3 | 924 ± 221 |
| α = 1, β = 0.5 | 6.0 ± 0.2 | 246 ± 51 | 0.43 ± 0.14 | 93 ± 12 | 84 ± 13 | 0.158 ± 0.041 | 0.54 ± 0.09 | 1.9 ± 0.4 | 422 ± 143 |
| α = 1, β = 1 | 6.0 ± 0.0 | 256 ± 0 | 0.74 ± 0.27 | 90 ± 13 | 90 ± 13 | 0.252 ± 0.073 | 1.00 ± 0.00 | 2.0 ± 0.0 | 263 ± 113 |
| α = 0.5, β = 0 | 0.1 ± 0.8 | 3 ± 18 | 0.00 ± 0.02 | 59 ± 8 | 1 ± 5 | 0.050 ± 0.006 | 0.00 ± 0.00 | 0.0 ± 0.1 | 1104 ± 0 |
| α = 0.5, β = 0.5 | 6.0 ± 0.0 | 256 ± 0 | 0.45 ± 0.13 | 94 ± 12 | 84 ± 12 | 0.162 ± 0.038 | 0.53 ± 0.09 | 2.0 ± 0.0 | 463 ± 149 |
| OSO (α = 0.5, β = 1) | 6.0 ± 0.0 | 256 ± 0 | 0.73 ± 0.25 | 91 ± 13 | 91 ± 13 | 0.251 ± 0.064 | 1.00 ± 0.00 | 2.0 ± 0.0 | 288 ± 105 |
| α = 0.05, β = 0 | 0.4 ± 1.4 | 10 ± 44 | 0.01 ± 0.04 | 62 ± 9 | 3 ± 11 | 0.053 ± 0.008 | 0.00 ± 0.00 | 0.1 ± 0.3 | 864 ± 241 |
| α = 0.05, β = 0.5 | 6.0 ± 0.0 | 256 ± 0 | 0.50 ± 0.14 | 92 ± 12 | 83 ± 11 | 0.174 ± 0.040 | 0.54 ± 0.09 | 2.0 ± 0.0 | 395 ± 148 |
| OSO (α = 0.05, β = 1) | 6.0 ± 0.0 | 256 ± 0 | 0.80 ± 0.22 | 89 ± 12 | 89 ± 12 | 0.272 ± 0.056 | 1.00 ± 0.00 | 2.0 ± 0.0 | 242 ± 96 |

Code: commit `10c7482` (with uncommitted changes). Experiment: [config/experiments/simple-ideas-6x8-p2-len3g2-comp0-7-alpha-beta-20261023-3.yaml](../../config/experiments/simple-ideas-6x8-p2-len3g2-comp0-7-alpha-beta-20261023-3.yaml). Command: `npm run sim -- simple-ideas-6x8-p2-len3g2-comp0-7-alpha-beta-20261023-3 --seeds 50 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
