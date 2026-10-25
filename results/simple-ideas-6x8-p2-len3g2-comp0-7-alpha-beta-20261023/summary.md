# On a generated idea graph, how do α (absorption rate) and β (publishing) together decide how far a society gets?

**Question:** On a generated idea graph, how do α (absorption rate) and β (publishing) together decide how far a society gets?

**Answer:** Best: α = 1, β = 0.75, 6.0 (15 more tie). Best traditional: Traditional (α = 1, β = 0), 0.2. Clear difference.

![On a generated idea graph, how do α (absorption rate) and β (publishing) together decide how far a society gets?](figures/compare.svg)

| society | frontier | value gained | sharing | ROI (value per spend) |
| --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 0.2 ± 1.2 | 8 ± 40 | 0.00 ± 0.00 | 0.01 ± 0.04 |
| α = 1, β = 0.25 | 6.0 ± 0.1 | 223 ± 62 | 0.26 ± 0.08 | 0.27 ± 0.13 |
| α = 1, β = 0.5 | 6.0 ± 0.2 | 246 ± 51 | 0.54 ± 0.09 | 0.43 ± 0.14 |
| α = 1, β = 0.75 | 6.0 ± 0.0 | 256 ± 0 | 0.77 ± 0.08 | 0.56 ± 0.19 |
| α = 1, β = 1 | 6.0 ± 0.0 | 256 ± 0 | 1.00 ± 0.00 | 0.74 ± 0.27 |
| α = 0.8, β = 0 | 0.5 ± 1.6 | 10 ± 35 | 0.00 ± 0.00 | 0.01 ± 0.03 |
| α = 0.8, β = 0.25 | 6.0 ± 0.1 | 238 ± 52 | 0.26 ± 0.08 | 0.28 ± 0.09 |
| α = 0.8, β = 0.5 | 6.0 ± 0.0 | 253 ± 18 | 0.55 ± 0.09 | 0.44 ± 0.13 |
| α = 0.8, β = 0.75 | 6.0 ± 0.0 | 253 ± 18 | 0.78 ± 0.07 | 0.59 ± 0.23 |
| OSO (α = 0.8, β = 1) | 6.0 ± 0.0 | 256 ± 0 | 1.00 ± 0.00 | 0.68 ± 0.21 |
| α = 0.5, β = 0 | 0.1 ± 0.8 | 3 ± 18 | 0.00 ± 0.00 | 0.00 ± 0.02 |
| α = 0.5, β = 0.25 | 6.0 ± 0.1 | 238 ± 52 | 0.28 ± 0.08 | 0.28 ± 0.09 |
| α = 0.5, β = 0.5 | 6.0 ± 0.0 | 256 ± 0 | 0.53 ± 0.09 | 0.45 ± 0.13 |
| α = 0.5, β = 0.75 | 6.0 ± 0.0 | 253 ± 18 | 0.78 ± 0.08 | 0.61 ± 0.17 |
| OSO (α = 0.5, β = 1) | 6.0 ± 0.0 | 256 ± 0 | 1.00 ± 0.00 | 0.73 ± 0.25 |
| α = 0.2, β = 0 | 0.2 ± 1.2 | 5 ± 25 | 0.00 ± 0.00 | 0.00 ± 0.02 |
| α = 0.2, β = 0.25 | 6.0 ± 0.2 | 236 ± 60 | 0.28 ± 0.08 | 0.32 ± 0.12 |
| α = 0.2, β = 0.5 | 6.0 ± 0.0 | 256 ± 0 | 0.52 ± 0.09 | 0.51 ± 0.16 |
| α = 0.2, β = 0.75 | 6.0 ± 0.0 | 256 ± 0 | 0.78 ± 0.07 | 0.64 ± 0.18 |
| OSO (α = 0.2, β = 1) | 6.0 ± 0.0 | 256 ± 0 | 1.00 ± 0.00 | 0.79 ± 0.21 |

**Design** (fixed before the run): compared α in {1, 0.8, 0.5, 0.2} × β in {0, 0.25, 0.5, 0.75, 1} · held the same: a generated idea graph (6 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7), 12 identical agents, budget 1200 split equally, no mint, no validation · measure: hardest level published, higher is better · 50 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The simple model on a generated idea graph (6 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7); each run draws its own graph. Only α and β vary. Held fixed: 12 identical agents, a budget of 1200 split equally every round (ρ = 0), no mint, no validation.

Values are mean ± standard deviation over runs.

| society | frontier | value gained | ROI (value per spend) | sharing | targets solved | cost |
| --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 0.2 ± 1.2 | 8 ± 40 | 0.01 ± 0.04 | 0.00 ± 0.00 | 0.1 ± 0.3 | 924 ± 221 |
| α = 1, β = 0.25 | 6.0 ± 0.1 | 223 ± 62 | 0.27 ± 0.13 | 0.26 ± 0.08 | 1.7 ± 0.5 | 678 ± 243 |
| α = 1, β = 0.5 | 6.0 ± 0.2 | 246 ± 51 | 0.43 ± 0.14 | 0.54 ± 0.09 | 1.9 ± 0.4 | 422 ± 143 |
| α = 1, β = 0.75 | 6.0 ± 0.0 | 256 ± 0 | 0.56 ± 0.19 | 0.77 ± 0.08 | 2.0 ± 0.0 | 357 ± 145 |
| α = 1, β = 1 | 6.0 ± 0.0 | 256 ± 0 | 0.74 ± 0.27 | 1.00 ± 0.00 | 2.0 ± 0.0 | 263 ± 113 |
| α = 0.8, β = 0 | 0.5 ± 1.6 | 10 ± 35 | 0.01 ± 0.03 | 0.00 ± 0.00 | 0.1 ± 0.3 | 951 ± 283 |
| α = 0.8, β = 0.25 | 6.0 ± 0.1 | 238 ± 52 | 0.28 ± 0.09 | 0.26 ± 0.08 | 1.9 ± 0.4 | 691 ± 221 |
| α = 0.8, β = 0.5 | 6.0 ± 0.0 | 253 ± 18 | 0.44 ± 0.13 | 0.55 ± 0.09 | 2.0 ± 0.1 | 444 ± 150 |
| α = 0.8, β = 0.75 | 6.0 ± 0.0 | 253 ± 18 | 0.59 ± 0.23 | 0.78 ± 0.07 | 2.0 ± 0.1 | 344 ± 111 |
| OSO (α = 0.8, β = 1) | 6.0 ± 0.0 | 256 ± 0 | 0.68 ± 0.21 | 1.00 ± 0.00 | 2.0 ± 0.0 | 292 ± 100 |
| α = 0.5, β = 0 | 0.1 ± 0.8 | 3 ± 18 | 0.00 ± 0.02 | 0.00 ± 0.00 | 0.0 ± 0.1 | 1104 ± 0 |
| α = 0.5, β = 0.25 | 6.0 ± 0.1 | 238 ± 52 | 0.28 ± 0.09 | 0.28 ± 0.08 | 1.9 ± 0.4 | 688 ± 179 |
| α = 0.5, β = 0.5 | 6.0 ± 0.0 | 256 ± 0 | 0.45 ± 0.13 | 0.53 ± 0.09 | 2.0 ± 0.0 | 463 ± 149 |
| α = 0.5, β = 0.75 | 6.0 ± 0.0 | 253 ± 18 | 0.61 ± 0.17 | 0.78 ± 0.08 | 2.0 ± 0.1 | 335 ± 102 |
| OSO (α = 0.5, β = 1) | 6.0 ± 0.0 | 256 ± 0 | 0.73 ± 0.25 | 1.00 ± 0.00 | 2.0 ± 0.0 | 288 ± 105 |
| α = 0.2, β = 0 | 0.2 ± 1.2 | 5 ± 25 | 0.00 ± 0.02 | 0.00 ± 0.00 | 0.0 ± 0.2 | 858 ± 314 |
| α = 0.2, β = 0.25 | 6.0 ± 0.2 | 236 ± 60 | 0.32 ± 0.12 | 0.28 ± 0.08 | 1.8 ± 0.5 | 619 ± 190 |
| α = 0.2, β = 0.5 | 6.0 ± 0.0 | 256 ± 0 | 0.51 ± 0.16 | 0.52 ± 0.09 | 2.0 ± 0.0 | 391 ± 151 |
| α = 0.2, β = 0.75 | 6.0 ± 0.0 | 256 ± 0 | 0.64 ± 0.18 | 0.78 ± 0.07 | 2.0 ± 0.0 | 324 ± 90 |
| OSO (α = 0.2, β = 1) | 6.0 ± 0.0 | 256 ± 0 | 0.79 ± 0.21 | 1.00 ± 0.00 | 2.0 ± 0.0 | 240 ± 104 |

Code: commit `04dc47f`. Experiment: [config/experiments/simple-ideas-6x8-p2-len3g2-comp0-7-alpha-beta-20261023.yaml](../../config/experiments/simple-ideas-6x8-p2-len3g2-comp0-7-alpha-beta-20261023.yaml). Command: `npm run sim -- simple-ideas-6x8-p2-len3g2-comp0-7-alpha-beta-20261023 --seeds 50 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
