# Simple model on a generated idea graph: α × β

**Question:** On a generated idea graph, how far does a society get for the same money, by α and β?

**Answer:** Best overall: α = 1, β = 1. Against traditional, clearly better on hardest level, targets solved, bounty value and ROI; clearly worse on waste; no clear difference on money to the main level. (6 measures; a clear difference is more than 2.6 standard errors.)

- hardest level: 7.00 against traditional 0.42, clearly better.
- targets solved: 2.00 against traditional 0.06, clearly better.
- bounty value: 512 against traditional 15, clearly better.
- ROI: 0.92 against traditional 0.01, clearly better.
- money to the main level: 417 against traditional 832, no clear difference.
- waste: 0.87 against traditional 0.20, clearly worse.

![Simple model on a generated idea graph: α × β](figures/compare.svg)

| society | frontier | targets solved | value gained | ROI (value per spend) | cost | waste |
| --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 0.4 ± 1.7 | 0.1 ± 0.2 | 15 ± 61 | 0.01 ± 0.05 | 832 ± 321 | 0.20 ± 0.10 |
| α = 1, β = 0.25 | 6.9 ± 0.4 | 1.3 ± 0.7 | 338 ± 190 | 0.34 ± 0.22 | 838 ± 191 | 0.81 ± 0.09 |
| α = 1, β = 0.5 | 7.0 ± 0.1 | 1.7 ± 0.5 | 445 ± 125 | 0.58 ± 0.29 | 591 ± 197 | 0.83 ± 0.10 |
| α = 1, β = 0.75 | 7.0 ± 0.0 | 1.9 ± 0.2 | 497 ± 61 | 0.79 ± 0.29 | 459 ± 152 | 0.85 ± 0.09 |
| α = 1, β = 1 | 7.0 ± 0.0 | 2.0 ± 0.0 | 512 ± 0 | 0.92 ± 0.39 | 417 ± 170 | 0.87 ± 0.05 |
| α = 0.8, β = 0 | 0.1 ± 1.0 | 0.0 ± 0.1 | 5 ± 36 | 0.00 ± 0.03 | 1068 ± 0 | 0.20 ± 0.08 |
| α = 0.8, β = 0.25 | 6.8 ± 0.5 | 1.3 ± 0.7 | 333 ± 181 | 0.36 ± 0.28 | 834 ± 273 | 0.78 ± 0.11 |
| α = 0.8, β = 0.5 | 7.0 ± 0.0 | 1.8 ± 0.4 | 471 ± 95 | 0.64 ± 0.26 | 560 ± 244 | 0.86 ± 0.08 |
| α = 0.8, β = 0.75 | 7.0 ± 0.0 | 2.0 ± 0.2 | 502 ± 51 | 0.76 ± 0.26 | 464 ± 154 | 0.87 ± 0.07 |
| OSO (α = 0.8, β = 1) | 7.0 ± 0.0 | 2.0 ± 0.1 | 507 ± 36 | 1.00 ± 0.45 | 381 ± 152 | 0.87 ± 0.06 |
| α = 0.5, β = 0 | 0.3 ± 1.4 | 0.0 ± 0.2 | 10 ± 51 | 0.01 ± 0.04 | 732 ± 272 | 0.21 ± 0.08 |
| α = 0.5, β = 0.25 | 6.7 ± 0.6 | 1.2 ± 0.8 | 317 ± 217 | 0.34 ± 0.28 | 736 ± 254 | 0.79 ± 0.12 |
| α = 0.5, β = 0.5 | 7.0 ± 0.1 | 1.8 ± 0.5 | 461 ± 116 | 0.63 ± 0.30 | 607 ± 203 | 0.84 ± 0.09 |
| α = 0.5, β = 0.75 | 7.0 ± 0.0 | 1.9 ± 0.2 | 497 ± 61 | 0.82 ± 0.31 | 445 ± 154 | 0.87 ± 0.08 |
| OSO (α = 0.5, β = 1) | 7.0 ± 0.0 | 2.0 ± 0.1 | 507 ± 36 | 0.94 ± 0.32 | 385 ± 173 | 0.88 ± 0.08 |
| α = 0.2, β = 0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.21 ± 0.05 |
| α = 0.2, β = 0.25 | 6.7 ± 0.6 | 1.1 ± 0.8 | 287 ± 211 | 0.31 ± 0.28 | 778 ± 206 | 0.79 ± 0.11 |
| α = 0.2, β = 0.5 | 7.0 ± 0.0 | 1.9 ± 0.2 | 497 ± 61 | 0.71 ± 0.29 | 555 ± 183 | 0.87 ± 0.07 |
| α = 0.2, β = 0.75 | 7.0 ± 0.0 | 2.0 ± 0.3 | 502 ± 72 | 0.85 ± 0.33 | 468 ± 196 | 0.88 ± 0.08 |
| OSO (α = 0.2, β = 1) | 7.0 ± 0.0 | 2.0 ± 0.0 | 512 ± 0 | 1.06 ± 0.37 | 350 ± 124 | 0.88 ± 0.05 |

**Design** (fixed before the run): compared α in {1, 0.8, 0.5, 0.2} × β in {0, 0.25, 0.5, 0.75, 1} · held the same: a generated idea graph (7 levels × 7 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7), 12 identical agents, budget 1200 split equally, no mint, no validation · measure: all of hardest level, targets solved, bounty value, ROI, money to the main level, waste · 50 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The simple model on a generated idea graph (7 levels × 7 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7); each run draws its own graph. Only α and β vary. Held fixed: 12 identical agents, a budget of 1200 split equally every round (ρ = 0), no mint, no validation.

Values are mean ± standard deviation over runs.

| society | frontier | targets solved | value gained | ROI (value per spend) | cost | waste | sharing | reach L7 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 0.4 ± 1.7 | 0.1 ± 0.2 | 15 ± 61 | 0.01 ± 0.05 | 832 ± 321 | 0.20 ± 0.10 | 0.00 ± 0.00 | 0.06 |
| α = 1, β = 0.25 | 6.9 ± 0.4 | 1.3 ± 0.7 | 338 ± 190 | 0.34 ± 0.22 | 838 ± 191 | 0.81 ± 0.09 | 0.24 ± 0.07 | 0.88 |
| α = 1, β = 0.5 | 7.0 ± 0.1 | 1.7 ± 0.5 | 445 ± 125 | 0.58 ± 0.29 | 591 ± 197 | 0.83 ± 0.10 | 0.54 ± 0.08 | 0.98 |
| α = 1, β = 0.75 | 7.0 ± 0.0 | 1.9 ± 0.2 | 497 ± 61 | 0.79 ± 0.29 | 459 ± 152 | 0.85 ± 0.09 | 0.77 ± 0.07 | 1.00 |
| α = 1, β = 1 | 7.0 ± 0.0 | 2.0 ± 0.0 | 512 ± 0 | 0.92 ± 0.39 | 417 ± 170 | 0.87 ± 0.05 | 1.00 ± 0.00 | 1.00 |
| α = 0.8, β = 0 | 0.1 ± 1.0 | 0.0 ± 0.1 | 5 ± 36 | 0.00 ± 0.03 | 1068 ± 0 | 0.20 ± 0.08 | 0.00 ± 0.00 | 0.02 |
| α = 0.8, β = 0.25 | 6.8 ± 0.5 | 1.3 ± 0.7 | 333 ± 181 | 0.36 ± 0.28 | 834 ± 273 | 0.78 ± 0.11 | 0.27 ± 0.08 | 0.88 |
| α = 0.8, β = 0.5 | 7.0 ± 0.0 | 1.8 ± 0.4 | 471 ± 95 | 0.64 ± 0.26 | 560 ± 244 | 0.86 ± 0.08 | 0.53 ± 0.08 | 1.00 |
| α = 0.8, β = 0.75 | 7.0 ± 0.0 | 2.0 ± 0.2 | 502 ± 51 | 0.76 ± 0.26 | 464 ± 154 | 0.87 ± 0.07 | 0.78 ± 0.06 | 1.00 |
| OSO (α = 0.8, β = 1) | 7.0 ± 0.0 | 2.0 ± 0.1 | 507 ± 36 | 1.00 ± 0.45 | 381 ± 152 | 0.87 ± 0.06 | 1.00 ± 0.00 | 1.00 |
| α = 0.5, β = 0 | 0.3 ± 1.4 | 0.0 ± 0.2 | 10 ± 51 | 0.01 ± 0.04 | 732 ± 272 | 0.21 ± 0.08 | 0.00 ± 0.00 | 0.04 |
| α = 0.5, β = 0.25 | 6.7 ± 0.6 | 1.2 ± 0.8 | 317 ± 217 | 0.34 ± 0.28 | 736 ± 254 | 0.79 ± 0.12 | 0.27 ± 0.08 | 0.76 |
| α = 0.5, β = 0.5 | 7.0 ± 0.1 | 1.8 ± 0.5 | 461 ± 116 | 0.63 ± 0.30 | 607 ± 203 | 0.84 ± 0.09 | 0.54 ± 0.09 | 0.98 |
| α = 0.5, β = 0.75 | 7.0 ± 0.0 | 1.9 ± 0.2 | 497 ± 61 | 0.82 ± 0.31 | 445 ± 154 | 0.87 ± 0.08 | 0.77 ± 0.07 | 1.00 |
| OSO (α = 0.5, β = 1) | 7.0 ± 0.0 | 2.0 ± 0.1 | 507 ± 36 | 0.94 ± 0.32 | 385 ± 173 | 0.88 ± 0.08 | 1.00 ± 0.00 | 1.00 |
| α = 0.2, β = 0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.21 ± 0.05 | 0.00 ± 0.00 | 0.00 |
| α = 0.2, β = 0.25 | 6.7 ± 0.6 | 1.1 ± 0.8 | 287 ± 211 | 0.31 ± 0.28 | 778 ± 206 | 0.79 ± 0.11 | 0.25 ± 0.08 | 0.72 |
| α = 0.2, β = 0.5 | 7.0 ± 0.0 | 1.9 ± 0.2 | 497 ± 61 | 0.71 ± 0.29 | 555 ± 183 | 0.87 ± 0.07 | 0.53 ± 0.08 | 1.00 |
| α = 0.2, β = 0.75 | 7.0 ± 0.0 | 2.0 ± 0.3 | 502 ± 72 | 0.85 ± 0.33 | 468 ± 196 | 0.88 ± 0.08 | 0.77 ± 0.07 | 1.00 |
| OSO (α = 0.2, β = 1) | 7.0 ± 0.0 | 2.0 ± 0.0 | 512 ± 0 | 1.06 ± 0.37 | 350 ± 124 | 0.88 ± 0.05 | 1.00 ± 0.00 | 1.00 |

Code: commit `51d3f4a` (with uncommitted changes). Experiment: [config/experiments/simple-ideas-7x7-p2-len3g2-comp0-7-alpha-beta-20261023.yaml](../../config/experiments/simple-ideas-7x7-p2-len3g2-comp0-7-alpha-beta-20261023.yaml). Command: `npm run sim -- simple-ideas-7x7-p2-len3g2-comp0-7-alpha-beta-20261023 --seeds 50 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
