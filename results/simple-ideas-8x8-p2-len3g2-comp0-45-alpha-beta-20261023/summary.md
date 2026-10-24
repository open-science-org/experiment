# Simple model on a generated idea graph: α × β

**Question:** On a generated idea graph, how far does a society get for the same money, by α and β?

**Answer:** Best overall: OSO (α = 0.2, β = 1). Against traditional, clearly better on hardest level; clearly worse on waste; no clear difference on targets solved, bounty value and ROI. (6 measures; a clear difference is more than 2.6 standard errors.)

- hardest level: 5.88 against traditional 0.00, clearly better.
- targets solved: 0.04 against traditional 0.00, no clear difference.
- bounty value: 20 against traditional 0.00, no clear difference.
- ROI: 0.02 against traditional 0.00, no clear difference.
- money to the main level: best OSO (α = 0.8, β = 1), 732.
- waste: 0.65 against traditional 0.18, clearly worse.

![Simple model on a generated idea graph: α × β](figures/compare.svg)

| society | frontier | targets solved | value gained | ROI (value per spend) | cost | waste |
| --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.18 ± 0.04 |
| α = 1, β = 0.25 | 3.9 ± 1.2 | 0.0 ± 0.1 | 10 ± 72 | 0.01 ± 0.06 | 756 ± 0 | 0.55 ± 0.09 |
| α = 1, β = 0.5 | 4.6 ± 0.9 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.59 ± 0.09 |
| α = 1, β = 0.75 | 5.1 ± 0.9 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.61 ± 0.09 |
| α = 1, β = 1 | 5.7 ± 1.0 | 0.0 ± 0.1 | 10 ± 72 | 0.01 ± 0.06 | 888 ± 138 | 0.64 ± 0.09 |
| α = 0.8, β = 0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.18 ± 0.04 |
| α = 0.8, β = 0.25 | 3.6 ± 1.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.54 ± 0.08 |
| α = 0.8, β = 0.5 | 4.7 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.59 ± 0.09 |
| α = 0.8, β = 0.75 | 5.3 ± 0.9 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.62 ± 0.09 |
| OSO (α = 0.8, β = 1) | 5.7 ± 0.9 | 0.0 ± 0.1 | 10 ± 72 | 0.01 ± 0.06 | 732 ± 0 | 0.63 ± 0.10 |
| α = 0.5, β = 0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.19 ± 0.04 |
| α = 0.5, β = 0.25 | 3.6 ± 0.9 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.53 ± 0.09 |
| α = 0.5, β = 0.5 | 4.5 ± 1.1 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.60 ± 0.10 |
| α = 0.5, β = 0.75 | 5.0 ± 0.9 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 732 ± 0 | 0.62 ± 0.09 |
| OSO (α = 0.5, β = 1) | 5.7 ± 1.0 | 0.0 ± 0.2 | 20 ± 101 | 0.02 ± 0.09 | 864 ± 187 | 0.63 ± 0.09 |
| α = 0.2, β = 0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.22 ± 0.05 |
| α = 0.2, β = 0.25 | 4.0 ± 0.9 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.55 ± 0.09 |
| α = 0.2, β = 0.5 | 4.8 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.60 ± 0.08 |
| α = 0.2, β = 0.75 | 5.4 ± 0.8 | 0.0 ± 0.2 | 20 ± 101 | 0.02 ± 0.09 | 810 ± 110 | 0.64 ± 0.07 |
| OSO (α = 0.2, β = 1) | 5.9 ± 0.8 | 0.0 ± 0.2 | 20 ± 101 | 0.02 ± 0.09 | 924 ± 272 | 0.65 ± 0.09 |

**Design** (fixed before the run): compared α in {1, 0.8, 0.5, 0.2} × β in {0, 0.25, 0.5, 0.75, 1} · held the same: a generated idea graph (8 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.45), 12 identical agents, budget 1200 split equally, no mint, no validation · measure: all of hardest level, targets solved, bounty value, ROI, money to the main level, waste · 50 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The simple model on a generated idea graph (8 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.45); each run draws its own graph. Only α and β vary. Held fixed: 12 identical agents, a budget of 1200 split equally every round (ρ = 0), no mint, no validation.

Values are mean ± standard deviation over runs.

| society | frontier | targets solved | value gained | ROI (value per spend) | cost | waste | sharing | reach L8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.18 ± 0.04 | 0.00 ± 0.00 | 0.00 |
| α = 1, β = 0.25 | 3.9 ± 1.2 | 0.0 ± 0.1 | 10 ± 72 | 0.01 ± 0.06 | 756 ± 0 | 0.55 ± 0.09 | 0.25 ± 0.10 | 0.02 |
| α = 1, β = 0.5 | 4.6 ± 0.9 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.59 ± 0.09 | 0.48 ± 0.09 | 0.00 |
| α = 1, β = 0.75 | 5.1 ± 0.9 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.61 ± 0.09 | 0.77 ± 0.07 | 0.00 |
| α = 1, β = 1 | 5.7 ± 1.0 | 0.0 ± 0.1 | 10 ± 72 | 0.01 ± 0.06 | 888 ± 138 | 0.64 ± 0.09 | 1.00 ± 0.00 | 0.06 |
| α = 0.8, β = 0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.18 ± 0.04 | 0.00 ± 0.00 | 0.00 |
| α = 0.8, β = 0.25 | 3.6 ± 1.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.54 ± 0.08 | 0.23 ± 0.11 | 0.00 |
| α = 0.8, β = 0.5 | 4.7 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.59 ± 0.09 | 0.50 ± 0.10 | 0.00 |
| α = 0.8, β = 0.75 | 5.3 ± 0.9 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.62 ± 0.09 | 0.76 ± 0.09 | 0.00 |
| OSO (α = 0.8, β = 1) | 5.7 ± 0.9 | 0.0 ± 0.1 | 10 ± 72 | 0.01 ± 0.06 | 732 ± 0 | 0.63 ± 0.10 | 1.00 ± 0.00 | 0.02 |
| α = 0.5, β = 0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.19 ± 0.04 | 0.00 ± 0.00 | 0.00 |
| α = 0.5, β = 0.25 | 3.6 ± 0.9 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.53 ± 0.09 | 0.24 ± 0.10 | 0.00 |
| α = 0.5, β = 0.5 | 4.5 ± 1.1 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.60 ± 0.10 | 0.47 ± 0.09 | 0.00 |
| α = 0.5, β = 0.75 | 5.0 ± 0.9 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 732 ± 0 | 0.62 ± 0.09 | 0.74 ± 0.08 | 0.02 |
| OSO (α = 0.5, β = 1) | 5.7 ± 1.0 | 0.0 ± 0.2 | 20 ± 101 | 0.02 ± 0.09 | 864 ± 187 | 0.63 ± 0.09 | 1.00 ± 0.00 | 0.04 |
| α = 0.2, β = 0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.22 ± 0.05 | 0.00 ± 0.00 | 0.00 |
| α = 0.2, β = 0.25 | 4.0 ± 0.9 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.55 ± 0.09 | 0.25 ± 0.10 | 0.00 |
| α = 0.2, β = 0.5 | 4.8 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.60 ± 0.08 | 0.52 ± 0.10 | 0.00 |
| α = 0.2, β = 0.75 | 5.4 ± 0.8 | 0.0 ± 0.2 | 20 ± 101 | 0.02 ± 0.09 | 810 ± 110 | 0.64 ± 0.07 | 0.76 ± 0.09 | 0.04 |
| OSO (α = 0.2, β = 1) | 5.9 ± 0.8 | 0.0 ± 0.2 | 20 ± 101 | 0.02 ± 0.09 | 924 ± 272 | 0.65 ± 0.09 | 1.00 ± 0.00 | 0.04 |

Code: commit `2903b67` (with uncommitted changes). Experiment: [config/experiments/simple-ideas-8x8-p2-len3g2-comp0-45-alpha-beta-20261023.yaml](../../config/experiments/simple-ideas-8x8-p2-len3g2-comp0-45-alpha-beta-20261023.yaml). Command: `npm run sim -- simple-ideas-8x8-p2-len3g2-comp0-45-alpha-beta-20261023 --seeds 50 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
