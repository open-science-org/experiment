# Simple model on a generated idea graph: α × β

**Question:** On a generated idea graph, how far does a society get for the same money, by α and β?

**Answer:** Best: α = 1, β = 0.5, 6.0 (15 more tie). Best traditional: Traditional (α = 1, β = 0), 0.2. Clear difference.

![Simple model on a generated idea graph: α × β](figures/compare.svg)

| society | frontier | value gained | sharing | ROI (value per spend) |
| --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 0.2 ± 1.2 | 5 ± 25 | 0.00 ± 0.00 | 0.00 ± 0.02 |
| α = 1, β = 0.25 | 6.0 ± 0.1 | 233 ± 56 | 0.26 ± 0.09 | 0.27 ± 0.11 |
| α = 1, β = 0.5 | 6.0 ± 0.0 | 256 ± 0 | 0.54 ± 0.09 | 0.46 ± 0.14 |
| α = 1, β = 0.75 | 6.0 ± 0.0 | 256 ± 0 | 0.77 ± 0.07 | 0.55 ± 0.15 |
| α = 1, β = 1 | 6.0 ± 0.0 | 256 ± 0 | 1.00 ± 0.00 | 0.72 ± 0.26 |
| α = 0.8, β = 0 | 0.8 ± 2.1 | 18 ± 45 | 0.00 ± 0.00 | 0.02 ± 0.04 |
| α = 0.8, β = 0.25 | 6.0 ± 0.2 | 233 ± 62 | 0.28 ± 0.08 | 0.29 ± 0.12 |
| α = 0.8, β = 0.5 | 6.0 ± 0.0 | 253 ± 18 | 0.54 ± 0.09 | 0.46 ± 0.16 |
| α = 0.8, β = 0.75 | 6.0 ± 0.0 | 256 ± 0 | 0.78 ± 0.06 | 0.58 ± 0.23 |
| OSO (α = 0.8, β = 1) | 6.0 ± 0.0 | 256 ± 0 | 1.00 ± 0.00 | 0.73 ± 0.25 |
| α = 0.5, β = 0 | 0.4 ± 1.4 | 8 ± 31 | 0.00 ± 0.00 | 0.01 ± 0.03 |
| α = 0.5, β = 0.25 | 5.9 ± 0.3 | 233 ± 62 | 0.29 ± 0.08 | 0.30 ± 0.14 |
| α = 0.5, β = 0.5 | 6.0 ± 0.0 | 256 ± 0 | 0.53 ± 0.10 | 0.49 ± 0.22 |
| α = 0.5, β = 0.75 | 6.0 ± 0.0 | 253 ± 18 | 0.77 ± 0.08 | 0.60 ± 0.23 |
| OSO (α = 0.5, β = 1) | 6.0 ± 0.0 | 256 ± 0 | 1.00 ± 0.00 | 0.71 ± 0.27 |
| α = 0.2, β = 0 | 1.0 ± 2.2 | 26 ± 63 | 0.00 ± 0.00 | 0.02 ± 0.06 |
| α = 0.2, β = 0.25 | 6.0 ± 0.0 | 246 ± 35 | 0.26 ± 0.07 | 0.34 ± 0.12 |
| α = 0.2, β = 0.5 | 6.0 ± 0.0 | 256 ± 0 | 0.54 ± 0.09 | 0.53 ± 0.18 |
| α = 0.2, β = 0.75 | 6.0 ± 0.0 | 256 ± 0 | 0.78 ± 0.08 | 0.66 ± 0.18 |
| OSO (α = 0.2, β = 1) | 6.0 ± 0.0 | 256 ± 0 | 1.00 ± 0.00 | 0.79 ± 0.24 |

**Design** (fixed before the run): compared α in {1, 0.8, 0.5, 0.2} × β in {0, 0.25, 0.5, 0.75, 1} · held the same: a generated idea graph (6 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7), 12 identical agents, budget 1200 split equally, no mint, no validation · measure: hardest level published, higher is better · 50 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The simple model on a generated idea graph (6 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7); each run draws its own graph. Only α and β vary. Held fixed: 12 identical agents, a budget of 1200 split equally every round (ρ = 0), no mint, no validation.

Values are mean ± standard deviation over runs.

| society | frontier | value gained | ROI (value per spend) | sharing | targets solved | cost |
| --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 0.2 ± 1.2 | 5 ± 25 | 0.00 ± 0.02 | 0.00 ± 0.00 | 0.0 ± 0.2 | 678 ± 365 |
| α = 1, β = 0.25 | 6.0 ± 0.1 | 233 ± 56 | 0.27 ± 0.11 | 0.26 ± 0.09 | 1.8 ± 0.4 | 656 ± 206 |
| α = 1, β = 0.5 | 6.0 ± 0.0 | 256 ± 0 | 0.46 ± 0.14 | 0.54 ± 0.09 | 2.0 ± 0.0 | 412 ± 128 |
| α = 1, β = 0.75 | 6.0 ± 0.0 | 256 ± 0 | 0.55 ± 0.15 | 0.77 ± 0.07 | 2.0 ± 0.0 | 343 ± 108 |
| α = 1, β = 1 | 6.0 ± 0.0 | 256 ± 0 | 0.72 ± 0.26 | 1.00 ± 0.00 | 2.0 ± 0.0 | 292 ± 110 |
| α = 0.8, β = 0 | 0.8 ± 2.1 | 18 ± 45 | 0.02 ± 0.04 | 0.00 ± 0.00 | 0.1 ± 0.4 | 912 ± 197 |
| α = 0.8, β = 0.25 | 6.0 ± 0.2 | 233 ± 62 | 0.29 ± 0.12 | 0.28 ± 0.08 | 1.8 ± 0.5 | 665 ± 221 |
| α = 0.8, β = 0.5 | 6.0 ± 0.0 | 253 ± 18 | 0.46 ± 0.16 | 0.54 ± 0.09 | 2.0 ± 0.1 | 444 ± 139 |
| α = 0.8, β = 0.75 | 6.0 ± 0.0 | 256 ± 0 | 0.58 ± 0.23 | 0.78 ± 0.06 | 2.0 ± 0.0 | 336 ± 103 |
| OSO (α = 0.8, β = 1) | 6.0 ± 0.0 | 256 ± 0 | 0.73 ± 0.25 | 1.00 ± 0.00 | 2.0 ± 0.0 | 279 ± 99 |
| α = 0.5, β = 0 | 0.4 ± 1.4 | 8 ± 31 | 0.01 ± 0.03 | 0.00 ± 0.00 | 0.1 ± 0.2 | 952 ± 194 |
| α = 0.5, β = 0.25 | 5.9 ± 0.3 | 233 ± 62 | 0.30 ± 0.14 | 0.29 ± 0.08 | 1.8 ± 0.5 | 683 ± 217 |
| α = 0.5, β = 0.5 | 6.0 ± 0.0 | 256 ± 0 | 0.49 ± 0.22 | 0.53 ± 0.10 | 2.0 ± 0.0 | 453 ± 179 |
| α = 0.5, β = 0.75 | 6.0 ± 0.0 | 253 ± 18 | 0.60 ± 0.23 | 0.77 ± 0.08 | 2.0 ± 0.1 | 312 ± 94 |
| OSO (α = 0.5, β = 1) | 6.0 ± 0.0 | 256 ± 0 | 0.71 ± 0.27 | 1.00 ± 0.00 | 2.0 ± 0.0 | 285 ± 93 |
| α = 0.2, β = 0 | 1.0 ± 2.2 | 26 ± 63 | 0.02 ± 0.06 | 0.00 ± 0.00 | 0.2 ± 0.5 | 969 ± 274 |
| α = 0.2, β = 0.25 | 6.0 ± 0.0 | 246 ± 35 | 0.34 ± 0.12 | 0.26 ± 0.07 | 1.9 ± 0.3 | 626 ± 205 |
| α = 0.2, β = 0.5 | 6.0 ± 0.0 | 256 ± 0 | 0.53 ± 0.18 | 0.54 ± 0.09 | 2.0 ± 0.0 | 381 ± 128 |
| α = 0.2, β = 0.75 | 6.0 ± 0.0 | 256 ± 0 | 0.66 ± 0.18 | 0.78 ± 0.08 | 2.0 ± 0.0 | 308 ± 100 |
| OSO (α = 0.2, β = 1) | 6.0 ± 0.0 | 256 ± 0 | 0.79 ± 0.24 | 1.00 ± 0.00 | 2.0 ± 0.0 | 237 ± 80 |

Code: commit `81f6c4a` (with uncommitted changes). Experiment: [config/experiments/simple-ideas-6x8-p2-len3g2-comp0-7-alpha-beta-20261024.yaml](../../config/experiments/simple-ideas-6x8-p2-len3g2-comp0-7-alpha-beta-20261024.yaml). Command: `npm run sim -- simple-ideas-6x8-p2-len3g2-comp0-7-alpha-beta-20261024 --seeds 50 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
