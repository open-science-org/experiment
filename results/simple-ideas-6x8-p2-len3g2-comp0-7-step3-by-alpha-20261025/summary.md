# Step 3. Half the money follows earnings

**Question:** On a generated idea graph, at step 3 of the model, how far does a society get for the same money, and how much do agents share, by α?

**Answer:** Best overall: Agents choose, α = 0. Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money, money to the main level and waste. (8 measures; a clear difference is more than 2.7 standard errors.)

- hardest level: 6.00 against traditional 0.30, clearly better.
- targets solved: 1.99 against traditional 0.07, clearly better.
- bounty value: 255 against traditional 8.96, clearly better.
- ROI: 0.45 against traditional 0.01, clearly better.
- knowledge found (bits): 125 against traditional 60, clearly better.
- knowledge per unit of money: 0.22 against traditional 0.05, clearly better.
- money to the main level: 308 against traditional 845, clearly better.
- waste: 0.54 against traditional 0.72, clearly better.

![Step 3. Half the money follows earnings](figures/compare.svg)

| society | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | bits per money | cost | waste |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, finished work only) | 0.3 ± 1.3 | 0.1 ± 0.3 | 9 ± 42 | 0.01 ± 0.05 | 60 ± 7 | 0.051 ± 0.011 | 845 ± 393 | 0.72 ± 0.05 |
| Agents choose, α = 1 | 5.7 ± 1.1 | 1.5 ± 0.8 | 196 ± 102 | 0.24 ± 0.15 | 91 ± 15 | 0.101 ± 0.032 | 711 ± 250 | 0.61 ± 0.08 |
| Agents choose, α = 0.8 | 5.9 ± 0.4 | 1.8 ± 0.5 | 229 ± 69 | 0.30 ± 0.15 | 96 ± 15 | 0.119 ± 0.034 | 674 ± 239 | 0.58 ± 0.06 |
| Agents choose, α = 0.2 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.48 ± 0.13 | 103 ± 17 | 0.189 ± 0.042 | 388 ± 142 | 0.54 ± 0.07 |
| Agents choose, α = 0 | 6.0 ± 0.0 | 2.0 ± 0.1 | 255 ± 13 | 0.45 ± 0.12 | 125 ± 12 | 0.219 ± 0.045 | 308 ± 114 | 0.54 ± 0.07 |

**Design** (fixed before the run): compared traditional against agents choosing what to share, at α in {1, 0.8, 0.2, 0} · held the same: a generated idea graph (6 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7), 12 identical agents, half of each round's money by what agents earned (f = 0.5), no flat mint, a knowledge reward of 1 per new bit flowing back with α, no validation (θ = 0), a budget of 1200 · measure: all of hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money, money to the main level, waste · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Step 3 of the model step by step (the simple model plus agents choosing what to share and money following earnings) on a generated idea graph (6 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7); each run draws its own graph. Only α varies: agents choose what to publish, so β is an outcome. Traditional (α = 1, finished work only) is the reference. Held fixed: 12 identical agents, half of each round's money by what agents earned (f = 0.5), no flat mint, a knowledge reward of 1 per new bit flowing back with α, no validation (θ = 0), a budget of 1200.

Values are mean ± standard deviation over runs.

| society | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | knowledge published (bits) | bits per money | cost | waste | sharing | reach L6 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, finished work only) | 0.3 ± 1.3 | 0.1 ± 0.3 | 9 ± 42 | 0.01 ± 0.05 | 60 ± 7 | 2 ± 9 | 0.051 ± 0.011 | 845 ± 393 | 0.72 ± 0.05 | 0.00 ± 0.00 | 0.05 |
| Agents choose, α = 1 | 5.7 ± 1.1 | 1.5 ± 0.8 | 196 ± 102 | 0.24 ± 0.15 | 91 ± 15 | 82 ± 25 | 0.101 ± 0.032 | 711 ± 250 | 0.61 ± 0.08 | 0.26 ± 0.12 | 0.88 |
| Agents choose, α = 0.8 | 5.9 ± 0.4 | 1.8 ± 0.5 | 229 ± 69 | 0.30 ± 0.15 | 96 ± 15 | 91 ± 19 | 0.119 ± 0.034 | 674 ± 239 | 0.58 ± 0.06 | 0.31 ± 0.11 | 0.97 |
| Agents choose, α = 0.2 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.48 ± 0.13 | 103 ± 17 | 102 ± 18 | 0.189 ± 0.042 | 388 ± 142 | 0.54 ± 0.07 | 0.66 ± 0.10 | 1.00 |
| Agents choose, α = 0 | 6.0 ± 0.0 | 2.0 ± 0.1 | 255 ± 13 | 0.45 ± 0.12 | 125 ± 12 | 125 ± 12 | 0.219 ± 0.045 | 308 ± 114 | 0.54 ± 0.07 | 1.00 ± 0.00 | 1.00 |

Code: commit `dc540e2`. Experiment: [config/experiments/simple-ideas-6x8-p2-len3g2-comp0-7-step3-by-alpha-20261025.yaml](../../config/experiments/simple-ideas-6x8-p2-len3g2-comp0-7-step3-by-alpha-20261025.yaml). Command: `npm run sim -- simple-ideas-6x8-p2-len3g2-comp0-7-step3-by-alpha-20261025 --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
