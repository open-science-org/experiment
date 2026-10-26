# Step 3. Half the money follows earnings

**Question:** On a generated idea graph, at step 3 of the model, how far does a society get for the same money, and how much do agents share, by α?

**Answer:** Best overall: Agents choose, α = 0. Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money, money to the main level and waste. (8 measures; a clear difference is more than 2.7 standard errors.)

- hardest level: 6.00 against traditional 0.48, clearly better.
- targets solved: 1.99 against traditional 0.10, clearly better.
- bounty value: 255 against traditional 13, clearly better.
- ROI: 0.45 against traditional 0.01, clearly better.
- knowledge found (bits): 125 against traditional 60, clearly better.
- knowledge per unit of money: 0.22 against traditional 0.05, clearly better.
- money to the main level: 308 against traditional 932, clearly better.
- waste: 0.54 against traditional 0.71, clearly better.

![Step 3. Half the money follows earnings](figures/compare.svg)

| society | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | bits per money | cost | waste |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, finished work only) | 0.5 ± 1.6 | 0.1 ± 0.4 | 13 ± 46 | 0.01 ± 0.05 | 60 ± 8 | 0.051 ± 0.010 | 932 ± 300 | 0.71 ± 0.04 |
| Agents choose, α = 1 | 5.7 ± 1.0 | 1.6 ± 0.8 | 198 ± 99 | 0.25 ± 0.16 | 90 ± 15 | 0.104 ± 0.035 | 718 ± 253 | 0.60 ± 0.08 |
| Agents choose, α = 0.8 | 5.9 ± 0.4 | 1.8 ± 0.5 | 232 ± 67 | 0.31 ± 0.14 | 96 ± 15 | 0.121 ± 0.035 | 666 ± 209 | 0.58 ± 0.08 |
| Agents choose, α = 0.2 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.50 ± 0.15 | 104 ± 18 | 0.197 ± 0.040 | 395 ± 138 | 0.52 ± 0.07 |
| Agents choose, α = 0 | 6.0 ± 0.0 | 2.0 ± 0.1 | 255 ± 13 | 0.45 ± 0.12 | 125 ± 12 | 0.219 ± 0.045 | 308 ± 114 | 0.54 ± 0.07 |

**Design** (fixed before the run): compared traditional against agents choosing what to share, at α in {1, 0.8, 0.2, 0} · held the same: a generated idea graph (6 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7), 12 identical agents, half of each round's money by what agents earned (f = 0.5), no flat mint, a knowledge reward of 1 per new bit flowing back with α, no validation (θ = 0), a budget of 1200 · measure: all of hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money, money to the main level, waste · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Step 3 of the model step by step (the simple model plus agents choosing what to share and money following earnings) on a generated idea graph (6 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7); each run draws its own graph. Only α varies: agents choose what to publish, so β is an outcome. Traditional (α = 1, finished work only) is the reference. Held fixed: 12 identical agents, half of each round's money by what agents earned (f = 0.5), no flat mint, a knowledge reward of 1 per new bit flowing back with α, no validation (θ = 0), a budget of 1200.

Values are mean ± standard deviation over runs.

| society | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | knowledge published (bits) | bits per money | cost | waste | sharing | reach L6 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, finished work only) | 0.5 ± 1.6 | 0.1 ± 0.4 | 13 ± 46 | 0.01 ± 0.05 | 60 ± 8 | 3 ± 11 | 0.051 ± 0.010 | 932 ± 300 | 0.71 ± 0.04 | 0.00 ± 0.00 | 0.08 |
| Agents choose, α = 1 | 5.7 ± 1.0 | 1.6 ± 0.8 | 198 ± 99 | 0.25 ± 0.16 | 90 ± 15 | 82 ± 24 | 0.104 ± 0.035 | 718 ± 253 | 0.60 ± 0.08 | 0.27 ± 0.11 | 0.87 |
| Agents choose, α = 0.8 | 5.9 ± 0.4 | 1.8 ± 0.5 | 232 ± 67 | 0.31 ± 0.14 | 96 ± 15 | 92 ± 21 | 0.121 ± 0.035 | 666 ± 209 | 0.58 ± 0.08 | 0.31 ± 0.11 | 0.97 |
| Agents choose, α = 0.2 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.50 ± 0.15 | 104 ± 18 | 103 ± 19 | 0.197 ± 0.040 | 395 ± 138 | 0.52 ± 0.07 | 0.70 ± 0.09 | 1.00 |
| Agents choose, α = 0 | 6.0 ± 0.0 | 2.0 ± 0.1 | 255 ± 13 | 0.45 ± 0.12 | 125 ± 12 | 125 ± 12 | 0.219 ± 0.045 | 308 ± 114 | 0.54 ± 0.07 | 1.00 ± 0.00 | 1.00 |

Code: commit `3e57a41`. Experiment: [config/experiments/simple-ideas-6x8-p2-len3g2-comp0-7-step3-by-alpha-20261025.yaml](../../config/experiments/simple-ideas-6x8-p2-len3g2-comp0-7-step3-by-alpha-20261025.yaml). Command: `npm run sim -- simple-ideas-6x8-p2-len3g2-comp0-7-step3-by-alpha-20261025 --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
