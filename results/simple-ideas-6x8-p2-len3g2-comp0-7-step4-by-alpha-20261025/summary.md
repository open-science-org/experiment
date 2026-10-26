# Step 4. Different kinds of agents

**Question:** On a generated idea graph, at step 4 of the model, how far does a society get for the same money, and how much do agents share, by α?

**Answer:** Best overall: Agents choose, α = 0.2. Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money, money to the main level and waste. (8 measures; a clear difference is more than 2.7 standard errors.)

- hardest level: 6.00 against traditional 1.26, clearly better.
- targets solved: 2.00 against traditional 0.32, clearly better.
- bounty value: 256 against traditional 41, clearly better.
- ROI: 0.59 against traditional 0.04, clearly better.
- knowledge found (bits): 105 against traditional 72, clearly better.
- knowledge per unit of money: 0.23 against traditional 0.06, clearly better.
- money to the main level: 324 against traditional 953, clearly better.
- waste: 0.51 against traditional 0.71, clearly better.

![Step 4. Different kinds of agents](figures/compare.svg)

| society | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | bits per money | cost | waste |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, finished work only) | 1.3 ± 2.5 | 0.3 ± 0.7 | 41 ± 85 | 0.04 ± 0.09 | 72 ± 13 | 0.062 ± 0.014 | 953 ± 183 | 0.71 ± 0.04 |
| Agents choose, α = 1 | 6.0 ± 0.1 | 1.9 ± 0.4 | 241 ± 49 | 0.37 ± 0.15 | 99 ± 18 | 0.142 ± 0.034 | 513 ± 178 | 0.56 ± 0.07 |
| Agents choose, α = 0.8 | 6.0 ± 0.0 | 2.0 ± 0.1 | 253 ± 18 | 0.40 ± 0.15 | 101 ± 19 | 0.155 ± 0.048 | 523 ± 196 | 0.57 ± 0.07 |
| Agents choose, α = 0.2 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.59 ± 0.20 | 105 ± 18 | 0.235 ± 0.060 | 324 ± 137 | 0.51 ± 0.07 |
| Agents choose, α = 0 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.52 ± 0.18 | 125 ± 15 | 0.249 ± 0.065 | 278 ± 105 | 0.55 ± 0.08 |

**Design** (fixed before the run): compared traditional against agents choosing what to share, at α in {1, 0.8, 0.2, 0} · held the same: a generated idea graph (6 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7), 12 agents of different kinds (3 foundation builders, 3 target racers, 2 cheap explorers, 2 specialists, a free rider, 1 plain), half of each round's money by what agents earned (f = 0.5), no flat mint, a knowledge reward of 1 per new bit flowing back with α, no validation (θ = 0), a budget of 1200 · measure: all of hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money, money to the main level, waste · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Step 4 of the model step by step (the simple model plus agents choosing what to share, money following earnings and different kinds of agents) on a generated idea graph (6 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7); each run draws its own graph. Only α varies: agents choose what to publish, so β is an outcome. Traditional (α = 1, finished work only) is the reference. Held fixed: 12 agents of different kinds (3 foundation builders, 3 target racers, 2 cheap explorers, 2 specialists, a free rider, 1 plain), half of each round's money by what agents earned (f = 0.5), no flat mint, a knowledge reward of 1 per new bit flowing back with α, no validation (θ = 0), a budget of 1200.

Values are mean ± standard deviation over runs.

| society | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | knowledge published (bits) | bits per money | cost | waste | sharing | reach L6 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, finished work only) | 1.3 ± 2.5 | 0.3 ± 0.7 | 41 ± 85 | 0.04 ± 0.09 | 72 ± 13 | 10 ± 21 | 0.062 ± 0.014 | 953 ± 183 | 0.71 ± 0.04 | 0.00 ± 0.00 | 0.21 |
| Agents choose, α = 1 | 6.0 ± 0.1 | 1.9 ± 0.4 | 241 ± 49 | 0.37 ± 0.15 | 99 ± 18 | 95 ± 19 | 0.142 ± 0.034 | 513 ± 178 | 0.56 ± 0.07 | 0.34 ± 0.11 | 0.99 |
| Agents choose, α = 0.8 | 6.0 ± 0.0 | 2.0 ± 0.1 | 253 ± 18 | 0.40 ± 0.15 | 101 ± 19 | 99 ± 20 | 0.155 ± 0.048 | 523 ± 196 | 0.57 ± 0.07 | 0.38 ± 0.11 | 1.00 |
| Agents choose, α = 0.2 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.59 ± 0.20 | 105 ± 18 | 104 ± 19 | 0.235 ± 0.060 | 324 ± 137 | 0.51 ± 0.07 | 0.68 ± 0.10 | 1.00 |
| Agents choose, α = 0 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.52 ± 0.18 | 125 ± 15 | 125 ± 15 | 0.249 ± 0.065 | 278 ± 105 | 0.55 ± 0.08 | 1.00 ± 0.00 | 1.00 |

Code: commit `3e57a41`. Experiment: [config/experiments/simple-ideas-6x8-p2-len3g2-comp0-7-step4-by-alpha-20261025.yaml](../../config/experiments/simple-ideas-6x8-p2-len3g2-comp0-7-step4-by-alpha-20261025.yaml). Command: `npm run sim -- simple-ideas-6x8-p2-len3g2-comp0-7-step4-by-alpha-20261025 --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
