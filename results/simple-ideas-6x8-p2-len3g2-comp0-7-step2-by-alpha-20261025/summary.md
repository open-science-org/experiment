# Step 2. Agents choose what to share, so β comes out of their choices

**Question:** On a generated idea graph, at step 2 of the model, how far does a society get for the same money, and how much do agents share, by α?

**Answer:** Best overall: Agents choose, α = 0. Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money, money to the main level and waste. (8 measures; a clear difference is more than 2.7 standard errors.)

- hardest level: 6.00 against traditional 0.48, clearly better.
- targets solved: 2.00 against traditional 0.09, clearly better.
- bounty value: 256 against traditional 12, clearly better.
- ROI: 0.47 against traditional 0.01, clearly better.
- knowledge found (bits): 126 against traditional 60, clearly better.
- knowledge per unit of money: 0.22 against traditional 0.05, clearly better.
- money to the main level: 323 against traditional 932, clearly better.
- waste: 0.54 against traditional 0.72, clearly better.

![Step 2. Agents choose what to share, so β comes out of their choices](figures/compare.svg)

| society | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | bits per money | cost | waste |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, finished work only) | 0.5 ± 1.6 | 0.1 ± 0.3 | 12 ± 41 | 0.01 ± 0.04 | 60 ± 8 | 0.051 ± 0.007 | 932 ± 300 | 0.72 ± 0.04 |
| Agents choose, α = 1 | 4.9 ± 1.4 | 0.4 ± 0.6 | 49 ± 83 | 0.04 ± 0.08 | 76 ± 17 | 0.065 ± 0.016 | 895 ± 218 | 0.70 ± 0.05 |
| Agents choose, α = 0.8 | 5.4 ± 1.0 | 0.6 ± 0.8 | 79 ± 104 | 0.07 ± 0.10 | 82 ± 16 | 0.072 ± 0.018 | 871 ± 250 | 0.70 ± 0.04 |
| Agents choose, α = 0.2 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.45 ± 0.13 | 107 ± 16 | 0.182 ± 0.037 | 439 ± 138 | 0.54 ± 0.06 |
| Agents choose, α = 0 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.47 ± 0.14 | 126 ± 13 | 0.223 ± 0.050 | 323 ± 117 | 0.54 ± 0.09 |

**Design** (fixed before the run): compared traditional against agents choosing what to share, at α in {1, 0.8, 0.2, 0} · held the same: a generated idea graph (6 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7), 12 identical agents, equal money each round (f = 0), no flat mint, a knowledge reward of 1 per new bit flowing back with α, no validation (θ = 0), a budget of 1200 · measure: all of hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money, money to the main level, waste · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Step 2 of the model step by step (the simple model plus agents choosing what to share) on a generated idea graph (6 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7); each run draws its own graph. Only α varies: agents choose what to publish, so β is an outcome. Traditional (α = 1, finished work only) is the reference. Held fixed: 12 identical agents, equal money each round (f = 0), no flat mint, a knowledge reward of 1 per new bit flowing back with α, no validation (θ = 0), a budget of 1200.

Values are mean ± standard deviation over runs.

| society | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | knowledge published (bits) | bits per money | cost | waste | sharing | reach L6 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, finished work only) | 0.5 ± 1.6 | 0.1 ± 0.3 | 12 ± 41 | 0.01 ± 0.04 | 60 ± 8 | 3 ± 9 | 0.051 ± 0.007 | 932 ± 300 | 0.72 ± 0.04 | 0.00 ± 0.00 | 0.08 |
| Agents choose, α = 1 | 4.9 ± 1.4 | 0.4 ± 0.6 | 49 ± 83 | 0.04 ± 0.08 | 76 ± 17 | 51 ± 26 | 0.065 ± 0.016 | 895 ± 218 | 0.70 ± 0.05 | 0.26 ± 0.11 | 0.47 |
| Agents choose, α = 0.8 | 5.4 ± 1.0 | 0.6 ± 0.8 | 79 ± 104 | 0.07 ± 0.10 | 82 ± 16 | 62 ± 26 | 0.072 ± 0.018 | 871 ± 250 | 0.70 ± 0.04 | 0.31 ± 0.12 | 0.66 |
| Agents choose, α = 0.2 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.45 ± 0.13 | 107 ± 16 | 107 ± 17 | 0.182 ± 0.037 | 439 ± 138 | 0.54 ± 0.06 | 0.71 ± 0.09 | 1.00 |
| Agents choose, α = 0 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.47 ± 0.14 | 126 ± 13 | 126 ± 13 | 0.223 ± 0.050 | 323 ± 117 | 0.54 ± 0.09 | 1.00 ± 0.00 | 1.00 |

Code: commit `3e57a41`. Experiment: [config/experiments/simple-ideas-6x8-p2-len3g2-comp0-7-step2-by-alpha-20261025.yaml](../../config/experiments/simple-ideas-6x8-p2-len3g2-comp0-7-step2-by-alpha-20261025.yaml). Command: `npm run sim -- simple-ideas-6x8-p2-len3g2-comp0-7-step2-by-alpha-20261025 --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
