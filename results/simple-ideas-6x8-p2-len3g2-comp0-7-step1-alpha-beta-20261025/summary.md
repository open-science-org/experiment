# Step 1: The simple model

**Question:** On a generated idea graph, how far does a society get for the same money, by α and β?

**Answer:** Best overall: OSO (α = 0.8, β = 1). Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money, money to the main level and waste. (8 measures; a clear difference is more than 2.7 standard errors.)

- hardest level: 6.00 against traditional 0.24, clearly better.
- targets solved: 2.00 against traditional 0.05, clearly better.
- bounty value: 256 against traditional 6.40, clearly better.
- ROI: 0.65 against traditional 0.01, clearly better.
- knowledge found (bits): 101 against traditional 60, clearly better.
- knowledge per unit of money: 0.25 against traditional 0.05, clearly better.
- money to the main level: 283 against traditional 1104, clearly better.
- waste: 0.32 against traditional 0.72, clearly better.

![Step 1: The simple model](figures/compare.svg)

| society | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | bits per money | cost | waste |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 0.2 ± 1.2 | 0.1 ± 0.3 | 6 ± 33 | 0.01 ± 0.03 | 60 ± 8 | 0.051 ± 0.007 | 1104 ± 87 | 0.72 ± 0.05 |
| α = 1, β = 1 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.67 ± 0.25 | 99 ± 19 | 0.248 ± 0.069 | 288 ± 96 | 0.31 ± 0.08 |
| α = 0.8, β = 0 | 0.3 ± 1.3 | 0.1 ± 0.2 | 6 ± 28 | 0.01 ± 0.02 | 61 ± 8 | 0.051 ± 0.007 | 972 ± 121 | 0.72 ± 0.05 |
| OSO (α = 0.8, β = 1) | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.65 ± 0.20 | 101 ± 20 | 0.248 ± 0.054 | 283 ± 87 | 0.32 ± 0.09 |
| α = 0.2, β = 0 | 0.5 ± 1.7 | 0.1 ± 0.3 | 13 ± 43 | 0.01 ± 0.04 | 64 ± 8 | 0.054 ± 0.008 | 879 ± 276 | 0.76 ± 0.04 |
| OSO (α = 0.2, β = 1) | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.68 ± 0.21 | 106 ± 17 | 0.273 ± 0.062 | 261 ± 97 | 0.36 ± 0.10 |

**Design** (fixed before the run): compared α in {1, 0.8, 0.2} × β in {0, 1} · held the same: a generated idea graph (6 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7), 12 identical agents, budget 1200 split equally, no flat mint, knowledge reward 1 per new bit, no validation · measure: all of hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money, money to the main level, waste · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The simple model on a generated idea graph (6 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7); each run draws its own graph. Only α and β vary. Held fixed: 12 identical agents, a budget of 1200 split equally every round (f = 0), no flat mint, a knowledge reward of 1 per new bit flowing back with α, no validation.

Values are mean ± standard deviation over runs.

| society | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | knowledge published (bits) | bits per money | cost | waste | sharing | reach L6 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 0.2 ± 1.2 | 0.1 ± 0.3 | 6 ± 33 | 0.01 ± 0.03 | 60 ± 8 | 2 ± 8 | 0.051 ± 0.007 | 1104 ± 87 | 0.72 ± 0.05 | 0.00 ± 0.00 | 0.04 |
| α = 1, β = 1 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.67 ± 0.25 | 99 ± 19 | 99 ± 19 | 0.248 ± 0.069 | 288 ± 96 | 0.31 ± 0.08 | 1.00 ± 0.00 | 1.00 |
| α = 0.8, β = 0 | 0.3 ± 1.3 | 0.1 ± 0.2 | 6 ± 28 | 0.01 ± 0.02 | 61 ± 8 | 2 ± 7 | 0.051 ± 0.007 | 972 ± 121 | 0.72 ± 0.05 | 0.00 ± 0.00 | 0.05 |
| OSO (α = 0.8, β = 1) | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.65 ± 0.20 | 101 ± 20 | 101 ± 20 | 0.248 ± 0.054 | 283 ± 87 | 0.32 ± 0.09 | 1.00 ± 0.00 | 1.00 |
| α = 0.2, β = 0 | 0.5 ± 1.7 | 0.1 ± 0.3 | 13 ± 43 | 0.01 ± 0.04 | 64 ± 8 | 3 ± 9 | 0.054 ± 0.008 | 879 ± 276 | 0.76 ± 0.04 | 0.00 ± 0.00 | 0.09 |
| OSO (α = 0.2, β = 1) | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.68 ± 0.21 | 106 ± 17 | 106 ± 17 | 0.273 ± 0.062 | 261 ± 97 | 0.36 ± 0.10 | 1.00 ± 0.00 | 1.00 |

Code: commit `cd9fb92` (with uncommitted changes). Experiment: [config/experiments/simple-ideas-6x8-p2-len3g2-comp0-7-step1-alpha-beta-20261025.yaml](../../config/experiments/simple-ideas-6x8-p2-len3g2-comp0-7-step1-alpha-beta-20261025.yaml). Command: `npm run sim -- simple-ideas-6x8-p2-len3g2-comp0-7-step1-alpha-beta-20261025 --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
