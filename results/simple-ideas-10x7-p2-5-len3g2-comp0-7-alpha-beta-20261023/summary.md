# Simple model on a generated idea graph: α × β

**Question:** On a generated idea graph, how far does a society get for the same money, by α and β?

**Answer:** Best: OSO (α = 0.2, β = 1), 9.0 (2 more tie). Best traditional: Traditional (α = 1, β = 0), 0.0. Clear difference.

![Simple model on a generated idea graph: α × β](figures/compare.svg)

| society | frontier | value gained | sharing | ROI (value per spend) |
| --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 0.00 ± 0.00 |
| α = 1, β = 0.25 | 5.9 ± 0.9 | 0 ± 0 | 0.26 ± 0.07 | 0.00 ± 0.00 |
| α = 1, β = 0.5 | 7.3 ± 0.9 | 0 ± 0 | 0.53 ± 0.08 | 0.00 ± 0.00 |
| α = 1, β = 0.75 | 8.2 ± 0.8 | 82 ± 405 | 0.77 ± 0.07 | 0.07 ± 0.34 |
| α = 1, β = 1 | 8.8 ± 0.9 | 451 ± 952 | 1.00 ± 0.00 | 0.38 ± 0.81 |
| α = 0.8, β = 0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 0.00 ± 0.00 |
| α = 0.8, β = 0.25 | 6.2 ± 1.1 | 0 ± 0 | 0.26 ± 0.07 | 0.00 ± 0.00 |
| α = 0.8, β = 0.5 | 7.7 ± 0.9 | 0 ± 0 | 0.53 ± 0.09 | 0.00 ± 0.00 |
| α = 0.8, β = 0.75 | 8.2 ± 0.8 | 82 ± 405 | 0.76 ± 0.07 | 0.07 ± 0.34 |
| OSO (α = 0.8, β = 1) | 8.6 ± 1.0 | 369 ± 795 | 1.00 ± 0.00 | 0.31 ± 0.67 |
| α = 0.5, β = 0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 0.00 ± 0.00 |
| α = 0.5, β = 0.25 | 6.1 ± 1.0 | 0 ± 0 | 0.28 ± 0.08 | 0.00 ± 0.00 |
| α = 0.5, β = 0.5 | 7.4 ± 0.8 | 41 ± 290 | 0.51 ± 0.09 | 0.03 ± 0.24 |
| α = 0.5, β = 0.75 | 8.3 ± 0.9 | 123 ± 491 | 0.76 ± 0.07 | 0.10 ± 0.41 |
| OSO (α = 0.5, β = 1) | 8.9 ± 0.8 | 369 ± 795 | 1.00 ± 0.00 | 0.31 ± 0.67 |
| α = 0.2, β = 0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 0.00 ± 0.00 |
| α = 0.2, β = 0.25 | 6.2 ± 0.8 | 0 ± 0 | 0.25 ± 0.07 | 0.00 ± 0.00 |
| α = 0.2, β = 0.5 | 7.5 ± 0.9 | 41 ± 290 | 0.53 ± 0.09 | 0.03 ± 0.24 |
| α = 0.2, β = 0.75 | 8.3 ± 0.8 | 41 ± 290 | 0.78 ± 0.06 | 0.03 ± 0.24 |
| OSO (α = 0.2, β = 1) | 9.0 ± 0.7 | 573 ± 1098 | 1.00 ± 0.00 | 0.49 ± 0.94 |

**Design** (fixed before the run): compared α in {1, 0.8, 0.5, 0.2} × β in {0, 0.25, 0.5, 0.75, 1} · held the same: a generated idea graph (10 levels × 7 ideas, 2.5 parents each, sequences of 3 bits growing by 2 per level, composition 0.7), 12 identical agents, budget 1200 split equally, no mint, no validation · measure: hardest level published, higher is better · 50 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The simple model on a generated idea graph (10 levels × 7 ideas, 2.5 parents each, sequences of 3 bits growing by 2 per level, composition 0.7); each run draws its own graph. Only α and β vary. Held fixed: 12 identical agents, a budget of 1200 split equally every round (ρ = 0), no mint, no validation.

Values are mean ± standard deviation over runs.

| society | frontier | value gained | ROI (value per spend) | sharing | targets solved | cost |
| --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 0.00 ± 0.00 | 0.0 ± 0.0 | – |
| α = 1, β = 0.25 | 5.9 ± 0.9 | 0 ± 0 | 0.00 ± 0.00 | 0.26 ± 0.07 | 0.0 ± 0.0 | – |
| α = 1, β = 0.5 | 7.3 ± 0.9 | 0 ± 0 | 0.00 ± 0.00 | 0.53 ± 0.08 | 0.0 ± 0.0 | – |
| α = 1, β = 0.75 | 8.2 ± 0.8 | 82 ± 405 | 0.07 ± 0.34 | 0.77 ± 0.07 | 0.0 ± 0.2 | 960 ± 231 |
| α = 1, β = 1 | 8.8 ± 0.9 | 451 ± 952 | 0.38 ± 0.81 | 1.00 ± 0.00 | 0.2 ± 0.5 | 991 ± 222 |
| α = 0.8, β = 0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 0.00 ± 0.00 | 0.0 ± 0.0 | – |
| α = 0.8, β = 0.25 | 6.2 ± 1.1 | 0 ± 0 | 0.00 ± 0.00 | 0.26 ± 0.07 | 0.0 ± 0.0 | 744 ± 0 |
| α = 0.8, β = 0.5 | 7.7 ± 0.9 | 0 ± 0 | 0.00 ± 0.00 | 0.53 ± 0.09 | 0.0 ± 0.0 | 1092 ± 0 |
| α = 0.8, β = 0.75 | 8.2 ± 0.8 | 82 ± 405 | 0.07 ± 0.34 | 0.76 ± 0.07 | 0.0 ± 0.2 | 1076 ± 42 |
| OSO (α = 0.8, β = 1) | 8.6 ± 1.0 | 369 ± 795 | 0.31 ± 0.67 | 1.00 ± 0.00 | 0.2 ± 0.4 | 985 ± 240 |
| α = 0.5, β = 0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 0.00 ± 0.00 | 0.0 ± 0.0 | – |
| α = 0.5, β = 0.25 | 6.1 ± 1.0 | 0 ± 0 | 0.00 ± 0.00 | 0.28 ± 0.08 | 0.0 ± 0.0 | 732 ± 0 |
| α = 0.5, β = 0.5 | 7.4 ± 0.8 | 41 ± 290 | 0.03 ± 0.24 | 0.51 ± 0.09 | 0.0 ± 0.1 | 1128 ± 0 |
| α = 0.5, β = 0.75 | 8.3 ± 0.9 | 123 ± 491 | 0.10 ± 0.41 | 0.76 ± 0.07 | 0.1 ± 0.2 | 1075 ± 187 |
| OSO (α = 0.5, β = 1) | 8.9 ± 0.8 | 369 ± 795 | 0.31 ± 0.67 | 1.00 ± 0.00 | 0.2 ± 0.4 | 919 ± 206 |
| α = 0.2, β = 0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 0.00 ± 0.00 | 0.0 ± 0.0 | – |
| α = 0.2, β = 0.25 | 6.2 ± 0.8 | 0 ± 0 | 0.00 ± 0.00 | 0.25 ± 0.07 | 0.0 ± 0.0 | – |
| α = 0.2, β = 0.5 | 7.5 ± 0.9 | 41 ± 290 | 0.03 ± 0.24 | 0.53 ± 0.09 | 0.0 ± 0.1 | 1056 ± 0 |
| α = 0.2, β = 0.75 | 8.3 ± 0.8 | 41 ± 290 | 0.03 ± 0.24 | 0.78 ± 0.06 | 0.0 ± 0.1 | 816 ± 255 |
| OSO (α = 0.2, β = 1) | 9.0 ± 0.7 | 573 ± 1098 | 0.49 ± 0.94 | 1.00 ± 0.00 | 0.3 ± 0.5 | 976 ± 179 |

Code: commit `04dc47f`. Experiment: [config/experiments/simple-ideas-10x7-p2-5-len3g2-comp0-7-alpha-beta-20261023.yaml](../../config/experiments/simple-ideas-10x7-p2-5-len3g2-comp0-7-alpha-beta-20261023.yaml). Command: `npm run sim -- simple-ideas-10x7-p2-5-len3g2-comp0-7-alpha-beta-20261023 --seeds 50 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
