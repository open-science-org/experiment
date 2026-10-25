# Simple model on a generated idea graph: α × β

**Question:** On a generated idea graph, how far does a society get for the same money, by α and β?

**Answer:** Best overall: OSO (α = 0.2, β = 1). Against traditional, clearly better on hardest level and waste; no clear difference on targets solved, bounty value and ROI. (5 measures; a clear difference is more than 2.6 standard errors.)

- hardest level: 5.20 against traditional 0.00, clearly better.
- targets solved: 0.00 against traditional 0.00, no clear difference.
- bounty value: 0.00 against traditional 0.00, no clear difference.
- ROI: 0.00 against traditional 0.00, no clear difference.
- waste: 0.20 against traditional 0.51, clearly better.

![Simple model on a generated idea graph: α × β](figures/compare.svg)

| society | frontier | targets solved | value gained | ROI (value per spend) | cost | waste |
| --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.51 ± 0.07 |
| α = 1, β = 0.25 | 3.2 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.45 ± 0.08 |
| α = 1, β = 0.5 | 4.3 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.34 ± 0.06 |
| α = 1, β = 0.75 | 4.8 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.26 ± 0.08 |
| α = 1, β = 1 | 5.1 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.19 ± 0.05 |
| α = 0.8, β = 0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.51 ± 0.06 |
| α = 0.8, β = 0.25 | 3.3 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.44 ± 0.08 |
| α = 0.8, β = 0.5 | 4.2 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.34 ± 0.07 |
| α = 0.8, β = 0.75 | 4.7 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.26 ± 0.07 |
| OSO (α = 0.8, β = 1) | 5.0 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.19 ± 0.05 |
| α = 0.5, β = 0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.50 ± 0.07 |
| α = 0.5, β = 0.25 | 3.3 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.42 ± 0.07 |
| α = 0.5, β = 0.5 | 4.1 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.34 ± 0.08 |
| α = 0.5, β = 0.75 | 4.7 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.25 ± 0.07 |
| OSO (α = 0.5, β = 1) | 5.1 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.19 ± 0.05 |
| α = 0.2, β = 0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.57 ± 0.05 |
| α = 0.2, β = 0.25 | 3.2 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.46 ± 0.07 |
| α = 0.2, β = 0.5 | 4.2 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.36 ± 0.08 |
| α = 0.2, β = 0.75 | 4.6 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.26 ± 0.07 |
| OSO (α = 0.2, β = 1) | 5.2 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.20 ± 0.05 |

**Design** (fixed before the run): compared α in {1, 0.8, 0.5, 0.2} × β in {0, 0.25, 0.5, 0.75, 1} · held the same: a generated idea graph (9 levels × 8 ideas, 2 parents each, sequences of 4 bits growing by 4 per level, composition 0.7), 12 identical agents, budget 1200 split equally, no mint, no validation · measure: all of hardest level, targets solved, bounty value, ROI, money to the main level, waste · 50 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The simple model on a generated idea graph (9 levels × 8 ideas, 2 parents each, sequences of 4 bits growing by 4 per level, composition 0.7); each run draws its own graph. Only α and β vary. Held fixed: 12 identical agents, a budget of 1200 split equally every round (ρ = 0), no mint, no validation.

Values are mean ± standard deviation over runs.

| society | frontier | targets solved | value gained | ROI (value per spend) | cost | waste | sharing | reach L9 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.51 ± 0.07 | 0.00 ± 0.00 | 0.00 |
| α = 1, β = 0.25 | 3.2 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.45 ± 0.08 | 0.22 ± 0.10 | 0.00 |
| α = 1, β = 0.5 | 4.3 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.34 ± 0.06 | 0.53 ± 0.10 | 0.00 |
| α = 1, β = 0.75 | 4.8 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.26 ± 0.08 | 0.77 ± 0.09 | 0.00 |
| α = 1, β = 1 | 5.1 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.19 ± 0.05 | 1.00 ± 0.00 | 0.00 |
| α = 0.8, β = 0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.51 ± 0.06 | 0.00 ± 0.00 | 0.00 |
| α = 0.8, β = 0.25 | 3.3 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.44 ± 0.08 | 0.24 ± 0.10 | 0.00 |
| α = 0.8, β = 0.5 | 4.2 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.34 ± 0.07 | 0.53 ± 0.09 | 0.00 |
| α = 0.8, β = 0.75 | 4.7 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.26 ± 0.07 | 0.77 ± 0.08 | 0.00 |
| OSO (α = 0.8, β = 1) | 5.0 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.19 ± 0.05 | 1.00 ± 0.00 | 0.00 |
| α = 0.5, β = 0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.50 ± 0.07 | 0.00 ± 0.00 | 0.00 |
| α = 0.5, β = 0.25 | 3.3 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.42 ± 0.07 | 0.24 ± 0.09 | 0.00 |
| α = 0.5, β = 0.5 | 4.1 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.34 ± 0.08 | 0.52 ± 0.11 | 0.00 |
| α = 0.5, β = 0.75 | 4.7 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.25 ± 0.07 | 0.77 ± 0.08 | 0.00 |
| OSO (α = 0.5, β = 1) | 5.1 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.19 ± 0.05 | 1.00 ± 0.00 | 0.00 |
| α = 0.2, β = 0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.57 ± 0.05 | 0.00 ± 0.00 | 0.00 |
| α = 0.2, β = 0.25 | 3.2 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.46 ± 0.07 | 0.24 ± 0.10 | 0.00 |
| α = 0.2, β = 0.5 | 4.2 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.36 ± 0.08 | 0.52 ± 0.13 | 0.00 |
| α = 0.2, β = 0.75 | 4.6 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.26 ± 0.07 | 0.76 ± 0.09 | 0.00 |
| OSO (α = 0.2, β = 1) | 5.2 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.20 ± 0.05 | 1.00 ± 0.00 | 0.00 |

Code: commit `04dc47f`. Experiment: [config/experiments/simple-ideas-9x8-p2-len4g4-comp0-7-alpha-beta-20261023.yaml](../../config/experiments/simple-ideas-9x8-p2-len4g4-comp0-7-alpha-beta-20261023.yaml). Command: `npm run sim -- simple-ideas-9x8-p2-len4g4-comp0-7-alpha-beta-20261023 --seeds 50 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
