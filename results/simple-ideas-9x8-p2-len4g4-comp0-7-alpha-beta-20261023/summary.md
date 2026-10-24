# Simple model on a generated idea graph: α × β

**Question:** On a generated idea graph, how far does a society get for the same money, by α and β?

**Answer:** Best overall: OSO (α = 0.2, β = 1). Against traditional, clearly better on hardest level; clearly worse on waste; no clear difference on targets solved, bounty value and ROI. (6 measures; a clear difference is more than 2.6 standard errors.)

- hardest level: 5.12 against traditional 0.00, clearly better.
- targets solved: 0.00 against traditional 0.00, no clear difference.
- bounty value: 0.00 against traditional 0.00, no clear difference.
- ROI: 0.00 against traditional 0.00, no clear difference.
- money to the main level: best α = 1, β = 1, 732.
- waste: 0.61 against traditional 0.12, clearly worse.

![Simple model on a generated idea graph: α × β](figures/compare.svg)

| society | frontier | targets solved | value gained | ROI (value per spend) | cost | waste |
| --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.12 ± 0.05 |
| α = 1, β = 0.25 | 3.3 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.53 ± 0.10 |
| α = 1, β = 0.5 | 4.4 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.59 ± 0.11 |
| α = 1, β = 0.75 | 4.7 ± 0.6 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.59 ± 0.10 |
| α = 1, β = 1 | 5.0 ± 0.9 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 732 ± 0 | 0.59 ± 0.11 |
| α = 0.8, β = 0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.12 ± 0.05 |
| α = 0.8, β = 0.25 | 3.3 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.53 ± 0.10 |
| α = 0.8, β = 0.5 | 4.2 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.58 ± 0.10 |
| α = 0.8, β = 0.75 | 4.6 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.59 ± 0.09 |
| OSO (α = 0.8, β = 1) | 4.9 ± 0.9 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 732 ± 0 | 0.58 ± 0.11 |
| α = 0.5, β = 0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.13 ± 0.06 |
| α = 0.5, β = 0.25 | 3.2 ± 0.9 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.51 ± 0.10 |
| α = 0.5, β = 0.5 | 4.0 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.57 ± 0.09 |
| α = 0.5, β = 0.75 | 4.7 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.60 ± 0.09 |
| OSO (α = 0.5, β = 1) | 5.0 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.59 ± 0.10 |
| α = 0.2, β = 0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.14 ± 0.06 |
| α = 0.2, β = 0.25 | 3.5 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.57 ± 0.09 |
| α = 0.2, β = 0.5 | 4.2 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.59 ± 0.09 |
| α = 0.2, β = 0.75 | 4.8 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.60 ± 0.09 |
| OSO (α = 0.2, β = 1) | 5.1 ± 0.9 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 732 ± 0 | 0.61 ± 0.10 |

**Design** (fixed before the run): compared α in {1, 0.8, 0.5, 0.2} × β in {0, 0.25, 0.5, 0.75, 1} · held the same: a generated idea graph (9 levels × 8 ideas, 2 parents each, sequences of 4 bits growing by 4 per level, composition 0.7), 12 identical agents, budget 1200 split equally, no mint, no validation · measure: all of hardest level, targets solved, bounty value, ROI, money to the main level, waste · 50 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The simple model on a generated idea graph (9 levels × 8 ideas, 2 parents each, sequences of 4 bits growing by 4 per level, composition 0.7); each run draws its own graph. Only α and β vary. Held fixed: 12 identical agents, a budget of 1200 split equally every round (ρ = 0), no mint, no validation.

Values are mean ± standard deviation over runs.

| society | frontier | targets solved | value gained | ROI (value per spend) | cost | waste | sharing | reach L9 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.12 ± 0.05 | 0.00 ± 0.00 | 0.00 |
| α = 1, β = 0.25 | 3.3 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.53 ± 0.10 | 0.24 ± 0.10 | 0.00 |
| α = 1, β = 0.5 | 4.4 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.59 ± 0.11 | 0.52 ± 0.10 | 0.00 |
| α = 1, β = 0.75 | 4.7 ± 0.6 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.59 ± 0.10 | 0.77 ± 0.08 | 0.00 |
| α = 1, β = 1 | 5.0 ± 0.9 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 732 ± 0 | 0.59 ± 0.11 | 1.00 ± 0.00 | 0.02 |
| α = 0.8, β = 0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.12 ± 0.05 | 0.00 ± 0.00 | 0.00 |
| α = 0.8, β = 0.25 | 3.3 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.53 ± 0.10 | 0.24 ± 0.10 | 0.00 |
| α = 0.8, β = 0.5 | 4.2 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.58 ± 0.10 | 0.52 ± 0.10 | 0.00 |
| α = 0.8, β = 0.75 | 4.6 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.59 ± 0.09 | 0.76 ± 0.08 | 0.00 |
| OSO (α = 0.8, β = 1) | 4.9 ± 0.9 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 732 ± 0 | 0.58 ± 0.11 | 1.00 ± 0.00 | 0.02 |
| α = 0.5, β = 0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.13 ± 0.06 | 0.00 ± 0.00 | 0.00 |
| α = 0.5, β = 0.25 | 3.2 ± 0.9 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.51 ± 0.10 | 0.26 ± 0.11 | 0.00 |
| α = 0.5, β = 0.5 | 4.0 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.57 ± 0.09 | 0.53 ± 0.11 | 0.00 |
| α = 0.5, β = 0.75 | 4.7 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.60 ± 0.09 | 0.75 ± 0.10 | 0.00 |
| OSO (α = 0.5, β = 1) | 5.0 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.59 ± 0.10 | 1.00 ± 0.00 | 0.00 |
| α = 0.2, β = 0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.14 ± 0.06 | 0.00 ± 0.00 | 0.00 |
| α = 0.2, β = 0.25 | 3.5 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.57 ± 0.09 | 0.25 ± 0.11 | 0.00 |
| α = 0.2, β = 0.5 | 4.2 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.59 ± 0.09 | 0.48 ± 0.11 | 0.00 |
| α = 0.2, β = 0.75 | 4.8 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.60 ± 0.09 | 0.77 ± 0.10 | 0.00 |
| OSO (α = 0.2, β = 1) | 5.1 ± 0.9 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 732 ± 0 | 0.61 ± 0.10 | 1.00 ± 0.00 | 0.02 |

Code: commit `5070108` (with uncommitted changes). Experiment: [config/experiments/simple-ideas-9x8-p2-len4g4-comp0-7-alpha-beta-20261023.yaml](../../config/experiments/simple-ideas-9x8-p2-len4g4-comp0-7-alpha-beta-20261023.yaml). Command: `npm run sim -- simple-ideas-9x8-p2-len4g4-comp0-7-alpha-beta-20261023 --seeds 50 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
