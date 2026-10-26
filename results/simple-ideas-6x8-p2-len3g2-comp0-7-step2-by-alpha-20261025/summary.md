# Step 2. Agents choose what to share, so β comes out of their choices

**Question:** On a generated idea graph, at step 2 of the model, how far does a society get for the same money, and how much do agents share, by α?

**Answer:** Best overall: Agents choose, α = 0. Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money, money to the main level and waste. (8 measures; a clear difference is more than 2.7 standard errors.)

- hardest level: 6.00 against traditional 0.30, clearly better.
- targets solved: 2.00 against traditional 0.05, clearly better.
- bounty value: 256 against traditional 6.40, clearly better.
- ROI: 0.47 against traditional 0.01, clearly better.
- knowledge found (bits): 126 against traditional 60, clearly better.
- knowledge per unit of money: 0.22 against traditional 0.05, clearly better.
- money to the main level: 323 against traditional 845, clearly better.
- waste: 0.54 against traditional 0.72, clearly better.

![Step 2. Agents choose what to share, so β comes out of their choices](figures/compare.svg)

| society | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | bits per money | cost | waste |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, finished work only) | 0.3 ± 1.3 | 0.1 ± 0.2 | 6 ± 28 | 0.01 ± 0.02 | 60 ± 7 | 0.050 ± 0.006 | 845 ± 393 | 0.72 ± 0.05 |
| Agents choose, α = 1 | 5.0 ± 1.4 | 0.4 ± 0.6 | 47 ± 83 | 0.04 ± 0.08 | 76 ± 15 | 0.065 ± 0.016 | 871 ± 249 | 0.71 ± 0.05 |
| Agents choose, α = 0.8 | 5.2 ± 1.0 | 0.5 ± 0.8 | 68 ± 100 | 0.06 ± 0.10 | 80 ± 15 | 0.069 ± 0.016 | 839 ± 250 | 0.71 ± 0.05 |
| Agents choose, α = 0.2 | 6.0 ± 0.0 | 2.0 ± 0.2 | 252 ± 29 | 0.41 ± 0.12 | 106 ± 17 | 0.166 ± 0.035 | 467 ± 147 | 0.58 ± 0.07 |
| Agents choose, α = 0 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.47 ± 0.14 | 126 ± 13 | 0.223 ± 0.050 | 323 ± 117 | 0.54 ± 0.09 |

**Design** (fixed before the run): compared traditional against agents choosing what to share, at α in {1, 0.8, 0.2, 0} · held the same: a generated idea graph (6 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7), 12 identical agents, equal money each round (f = 0), no flat mint, a knowledge reward of 1 per new bit flowing back with α, no validation (θ = 0), a budget of 1200 · measure: all of hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money, money to the main level, waste · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Step 2 of the model step by step (the simple model plus agents choosing what to share) on a generated idea graph (6 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7); each run draws its own graph. Only α varies: agents choose what to publish, so β is an outcome. Traditional (α = 1, finished work only) is the reference. Held fixed: 12 identical agents, equal money each round (f = 0), no flat mint, a knowledge reward of 1 per new bit flowing back with α, no validation (θ = 0), a budget of 1200.

Values are mean ± standard deviation over runs.

| society | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | knowledge published (bits) | bits per money | cost | waste | sharing | reach L6 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, finished work only) | 0.3 ± 1.3 | 0.1 ± 0.2 | 6 ± 28 | 0.01 ± 0.02 | 60 ± 7 | 1 ± 6 | 0.050 ± 0.006 | 845 ± 393 | 0.72 ± 0.05 | 0.00 ± 0.00 | 0.05 |
| Agents choose, α = 1 | 5.0 ± 1.4 | 0.4 ± 0.6 | 47 ± 83 | 0.04 ± 0.08 | 76 ± 15 | 50 ± 24 | 0.065 ± 0.016 | 871 ± 249 | 0.71 ± 0.05 | 0.24 ± 0.10 | 0.47 |
| Agents choose, α = 0.8 | 5.2 ± 1.0 | 0.5 ± 0.8 | 68 ± 100 | 0.06 ± 0.10 | 80 ± 15 | 57 ± 25 | 0.069 ± 0.016 | 839 ± 250 | 0.71 ± 0.05 | 0.29 ± 0.11 | 0.49 |
| Agents choose, α = 0.2 | 6.0 ± 0.0 | 2.0 ± 0.2 | 252 ± 29 | 0.41 ± 0.12 | 106 ± 17 | 105 ± 19 | 0.166 ± 0.035 | 467 ± 147 | 0.58 ± 0.07 | 0.66 ± 0.10 | 1.00 |
| Agents choose, α = 0 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.47 ± 0.14 | 126 ± 13 | 126 ± 13 | 0.223 ± 0.050 | 323 ± 117 | 0.54 ± 0.09 | 1.00 ± 0.00 | 1.00 |

Code: commit `dc540e2`. Experiment: [config/experiments/simple-ideas-6x8-p2-len3g2-comp0-7-step2-by-alpha-20261025.yaml](../../config/experiments/simple-ideas-6x8-p2-len3g2-comp0-7-step2-by-alpha-20261025.yaml). Command: `npm run sim -- simple-ideas-6x8-p2-len3g2-comp0-7-step2-by-alpha-20261025 --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
