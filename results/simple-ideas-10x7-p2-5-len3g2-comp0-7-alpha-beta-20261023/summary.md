# Simple model on a generated idea graph: α × β

**Question:** On a generated idea graph, how far does a society get for the same money, by α and β?

**Answer:** Best: OSO (α = 0.2, β = 1), 8.9 (3 more tie). Best traditional: Traditional (α = 1, β = 0), 0.0. Clear difference.

![Simple model on a generated idea graph: α × β](figures/compare.svg)

| society | frontier | value gained | sharing | ROI (value per spend) |
| --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 0.00 ± 0.00 |
| α = 1, β = 0.25 | 5.9 ± 0.9 | 0 ± 0 | 0.27 ± 0.06 | 0.00 ± 0.00 |
| α = 1, β = 0.5 | 7.5 ± 1.0 | 41 ± 290 | 0.53 ± 0.08 | 0.03 ± 0.24 |
| α = 1, β = 0.75 | 8.3 ± 1.0 | 205 ± 621 | 0.76 ± 0.07 | 0.17 ± 0.52 |
| α = 1, β = 1 | 8.8 ± 0.8 | 532 ± 1156 | 1.00 ± 0.00 | 0.46 ± 1.00 |
| α = 0.8, β = 0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 0.00 ± 0.00 |
| α = 0.8, β = 0.25 | 6.1 ± 1.2 | 82 ± 405 | 0.26 ± 0.06 | 0.07 ± 0.34 |
| α = 0.8, β = 0.5 | 7.5 ± 0.8 | 41 ± 290 | 0.52 ± 0.06 | 0.03 ± 0.24 |
| α = 0.8, β = 0.75 | 8.3 ± 0.8 | 164 ± 561 | 0.77 ± 0.06 | 0.14 ± 0.47 |
| OSO (α = 0.8, β = 1) | 8.8 ± 0.8 | 492 ± 976 | 1.00 ± 0.00 | 0.42 ± 0.83 |
| α = 0.5, β = 0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 0.00 ± 0.00 |
| α = 0.5, β = 0.25 | 6.2 ± 1.0 | 41 ± 290 | 0.27 ± 0.07 | 0.03 ± 0.24 |
| α = 0.5, β = 0.5 | 7.3 ± 1.0 | 41 ± 290 | 0.51 ± 0.08 | 0.03 ± 0.24 |
| α = 0.5, β = 0.75 | 8.1 ± 0.8 | 123 ± 491 | 0.76 ± 0.06 | 0.10 ± 0.41 |
| OSO (α = 0.5, β = 1) | 8.7 ± 0.8 | 205 ± 621 | 1.00 ± 0.00 | 0.17 ± 0.52 |
| α = 0.2, β = 0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 0.00 ± 0.00 |
| α = 0.2, β = 0.25 | 6.2 ± 1.0 | 0 ± 0 | 0.27 ± 0.08 | 0.00 ± 0.00 |
| α = 0.2, β = 0.5 | 7.4 ± 0.8 | 41 ± 290 | 0.53 ± 0.07 | 0.03 ± 0.24 |
| α = 0.2, β = 0.75 | 8.3 ± 0.9 | 123 ± 491 | 0.78 ± 0.06 | 0.10 ± 0.41 |
| OSO (α = 0.2, β = 1) | 8.9 ± 0.7 | 287 ± 718 | 1.00 ± 0.00 | 0.24 ± 0.60 |

**Design** (fixed before the run): compared α in {1, 0.8, 0.5, 0.2} × β in {0, 0.25, 0.5, 0.75, 1} · held the same: a generated idea graph (10 levels × 7 ideas, 2.5 parents each, sequences of 3 bits growing by 2 per level, composition 0.7), 12 identical agents, budget 1200 split equally, no mint, no validation · measure: hardest level published, higher is better · 50 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The simple model on a generated idea graph (10 levels × 7 ideas, 2.5 parents each, sequences of 3 bits growing by 2 per level, composition 0.7); each run draws its own graph. Only α and β vary. Held fixed: 12 identical agents, a budget of 1200 split equally every round (ρ = 0), no mint, no validation.

Values are mean ± standard deviation over runs.

| society | frontier | value gained | ROI (value per spend) | sharing | targets solved | cost |
| --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 0.00 ± 0.00 | 0.0 ± 0.0 | – |
| α = 1, β = 0.25 | 5.9 ± 0.9 | 0 ± 0 | 0.00 ± 0.00 | 0.27 ± 0.06 | 0.0 ± 0.0 | – |
| α = 1, β = 0.5 | 7.5 ± 1.0 | 41 ± 290 | 0.03 ± 0.24 | 0.53 ± 0.08 | 0.0 ± 0.1 | 840 ± 0 |
| α = 1, β = 0.75 | 8.3 ± 1.0 | 205 ± 621 | 0.17 ± 0.52 | 0.76 ± 0.07 | 0.1 ± 0.3 | 902 ± 187 |
| α = 1, β = 1 | 8.8 ± 0.8 | 532 ± 1156 | 0.46 ± 1.00 | 1.00 ± 0.00 | 0.3 ± 0.6 | 970 ± 184 |
| α = 0.8, β = 0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 0.00 ± 0.00 | 0.0 ± 0.0 | – |
| α = 0.8, β = 0.25 | 6.1 ± 1.2 | 82 ± 405 | 0.07 ± 0.34 | 0.26 ± 0.06 | 0.0 ± 0.2 | 786 ± 59 |
| α = 0.8, β = 0.5 | 7.5 ± 0.8 | 41 ± 290 | 0.03 ± 0.24 | 0.52 ± 0.06 | 0.0 ± 0.1 | 1044 ± 0 |
| α = 0.8, β = 0.75 | 8.3 ± 0.8 | 164 ± 561 | 0.14 ± 0.47 | 0.77 ± 0.06 | 0.1 ± 0.3 | 1005 ± 105 |
| OSO (α = 0.8, β = 1) | 8.8 ± 0.8 | 492 ± 976 | 0.42 ± 0.83 | 1.00 ± 0.00 | 0.2 ± 0.5 | 910 ± 233 |
| α = 0.5, β = 0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 0.00 ± 0.00 | 0.0 ± 0.0 | – |
| α = 0.5, β = 0.25 | 6.2 ± 1.0 | 41 ± 290 | 0.03 ± 0.24 | 0.27 ± 0.07 | 0.0 ± 0.1 | 732 ± 0 |
| α = 0.5, β = 0.5 | 7.3 ± 1.0 | 41 ± 290 | 0.03 ± 0.24 | 0.51 ± 0.08 | 0.0 ± 0.1 | 912 ± 204 |
| α = 0.5, β = 0.75 | 8.1 ± 0.8 | 123 ± 491 | 0.10 ± 0.41 | 0.76 ± 0.06 | 0.1 ± 0.2 | 1124 ± 73 |
| OSO (α = 0.5, β = 1) | 8.7 ± 0.8 | 205 ± 621 | 0.17 ± 0.52 | 1.00 ± 0.00 | 0.1 ± 0.3 | 927 ± 216 |
| α = 0.2, β = 0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 0.00 ± 0.00 | 0.0 ± 0.0 | – |
| α = 0.2, β = 0.25 | 6.2 ± 1.0 | 0 ± 0 | 0.00 ± 0.00 | 0.27 ± 0.08 | 0.0 ± 0.0 | – |
| α = 0.2, β = 0.5 | 7.4 ± 0.8 | 41 ± 290 | 0.03 ± 0.24 | 0.53 ± 0.07 | 0.0 ± 0.1 | 1056 ± 0 |
| α = 0.2, β = 0.75 | 8.3 ± 0.9 | 123 ± 491 | 0.10 ± 0.41 | 0.78 ± 0.06 | 0.1 ± 0.2 | 888 ± 346 |
| OSO (α = 0.2, β = 1) | 8.9 ± 0.7 | 287 ± 718 | 0.24 ± 0.60 | 1.00 ± 0.00 | 0.1 ± 0.4 | 850 ± 195 |

Code: commit `5070108` (with uncommitted changes). Experiment: [config/experiments/simple-ideas-10x7-p2-5-len3g2-comp0-7-alpha-beta-20261023.yaml](../../config/experiments/simple-ideas-10x7-p2-5-len3g2-comp0-7-alpha-beta-20261023.yaml). Command: `npm run sim -- simple-ideas-10x7-p2-5-len3g2-comp0-7-alpha-beta-20261023 --seeds 50 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
