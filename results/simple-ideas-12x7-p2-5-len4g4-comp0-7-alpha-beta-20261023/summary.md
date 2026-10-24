# Simple model on a generated idea graph: α × β

**Question:** On a generated idea graph, how far does a society get for the same money, by α and β?

**Answer:** Best overall: OSO (α = 0.2, β = 1). Against traditional, clearly better on hardest level; clearly worse on waste; no clear difference on targets solved, bounty value and ROI. (5 measures; a clear difference is more than 2.6 standard errors.)

- hardest level: 5.04 against traditional 0.00, clearly better.
- targets solved: 0.00 against traditional 0.00, no clear difference.
- bounty value: 0.00 against traditional 0.00, no clear difference.
- ROI: 0.00 against traditional 0.00, no clear difference.
- waste: 0.49 against traditional 0.03, clearly worse.

![Simple model on a generated idea graph: α × β](figures/compare.svg)

| society | frontier | targets solved | value gained | ROI (value per spend) | cost | waste |
| --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.03 ± 0.02 |
| α = 1, β = 0.25 | 3.2 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.44 ± 0.09 |
| α = 1, β = 0.5 | 4.1 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.46 ± 0.08 |
| α = 1, β = 0.75 | 4.6 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.46 ± 0.08 |
| α = 1, β = 1 | 5.0 ± 0.6 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.46 ± 0.10 |
| α = 0.8, β = 0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.03 ± 0.02 |
| α = 0.8, β = 0.25 | 3.1 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.43 ± 0.10 |
| α = 0.8, β = 0.5 | 4.1 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.45 ± 0.08 |
| α = 0.8, β = 0.75 | 4.6 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.48 ± 0.09 |
| OSO (α = 0.8, β = 1) | 5.0 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.47 ± 0.10 |
| α = 0.5, β = 0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.03 ± 0.02 |
| α = 0.5, β = 0.25 | 3.4 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.43 ± 0.08 |
| α = 0.5, β = 0.5 | 4.1 ± 0.6 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.45 ± 0.08 |
| α = 0.5, β = 0.75 | 4.4 ± 0.6 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.46 ± 0.10 |
| OSO (α = 0.5, β = 1) | 5.0 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.47 ± 0.09 |
| α = 0.2, β = 0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.03 ± 0.02 |
| α = 0.2, β = 0.25 | 3.5 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.44 ± 0.09 |
| α = 0.2, β = 0.5 | 4.2 ± 0.6 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.46 ± 0.07 |
| α = 0.2, β = 0.75 | 4.7 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.44 ± 0.09 |
| OSO (α = 0.2, β = 1) | 5.0 ± 0.6 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.49 ± 0.08 |

**Design** (fixed before the run): compared α in {1, 0.8, 0.5, 0.2} × β in {0, 0.25, 0.5, 0.75, 1} · held the same: a generated idea graph (12 levels × 7 ideas, 2.5 parents each, sequences of 4 bits growing by 4 per level, composition 0.7), 12 identical agents, budget 1200 split equally, no mint, no validation · measure: all of hardest level, targets solved, bounty value, ROI, money to the main level, waste · 50 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The simple model on a generated idea graph (12 levels × 7 ideas, 2.5 parents each, sequences of 4 bits growing by 4 per level, composition 0.7); each run draws its own graph. Only α and β vary. Held fixed: 12 identical agents, a budget of 1200 split equally every round (ρ = 0), no mint, no validation.

Values are mean ± standard deviation over runs.

| society | frontier | targets solved | value gained | ROI (value per spend) | cost | waste | sharing | reach L12 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.03 ± 0.02 | 0.00 ± 0.00 | 0.00 |
| α = 1, β = 0.25 | 3.2 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.44 ± 0.09 | 0.26 ± 0.11 | 0.00 |
| α = 1, β = 0.5 | 4.1 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.46 ± 0.08 | 0.53 ± 0.13 | 0.00 |
| α = 1, β = 0.75 | 4.6 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.46 ± 0.08 | 0.77 ± 0.10 | 0.00 |
| α = 1, β = 1 | 5.0 ± 0.6 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.46 ± 0.10 | 1.00 ± 0.00 | 0.00 |
| α = 0.8, β = 0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.03 ± 0.02 | 0.00 ± 0.00 | 0.00 |
| α = 0.8, β = 0.25 | 3.1 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.43 ± 0.10 | 0.25 ± 0.11 | 0.00 |
| α = 0.8, β = 0.5 | 4.1 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.45 ± 0.08 | 0.52 ± 0.13 | 0.00 |
| α = 0.8, β = 0.75 | 4.6 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.48 ± 0.09 | 0.77 ± 0.09 | 0.00 |
| OSO (α = 0.8, β = 1) | 5.0 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.47 ± 0.10 | 1.00 ± 0.00 | 0.00 |
| α = 0.5, β = 0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.03 ± 0.02 | 0.00 ± 0.00 | 0.00 |
| α = 0.5, β = 0.25 | 3.4 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.43 ± 0.08 | 0.27 ± 0.11 | 0.00 |
| α = 0.5, β = 0.5 | 4.1 ± 0.6 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.45 ± 0.08 | 0.51 ± 0.09 | 0.00 |
| α = 0.5, β = 0.75 | 4.4 ± 0.6 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.46 ± 0.10 | 0.77 ± 0.09 | 0.00 |
| OSO (α = 0.5, β = 1) | 5.0 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.47 ± 0.09 | 1.00 ± 0.00 | 0.00 |
| α = 0.2, β = 0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.03 ± 0.02 | 0.00 ± 0.00 | 0.00 |
| α = 0.2, β = 0.25 | 3.5 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.44 ± 0.09 | 0.25 ± 0.11 | 0.00 |
| α = 0.2, β = 0.5 | 4.2 ± 0.6 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.46 ± 0.07 | 0.53 ± 0.11 | 0.00 |
| α = 0.2, β = 0.75 | 4.7 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.44 ± 0.09 | 0.76 ± 0.09 | 0.00 |
| OSO (α = 0.2, β = 1) | 5.0 ± 0.6 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.49 ± 0.08 | 1.00 ± 0.00 | 0.00 |

Code: commit `5070108` (with uncommitted changes). Experiment: [config/experiments/simple-ideas-12x7-p2-5-len4g4-comp0-7-alpha-beta-20261023.yaml](../../config/experiments/simple-ideas-12x7-p2-5-len4g4-comp0-7-alpha-beta-20261023.yaml). Command: `npm run sim -- simple-ideas-12x7-p2-5-len4g4-comp0-7-alpha-beta-20261023 --seeds 50 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
