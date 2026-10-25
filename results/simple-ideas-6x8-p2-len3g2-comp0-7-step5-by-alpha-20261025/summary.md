# Step 5: A gamer, and validation

**Question:** With agents choose what to share; earnings shape next round's money; different kinds of agents; a gamer, and validation, how far does a society get for the same money, and how much do agents share, by α?

**Answer:** Best overall: Agents choose, α = 0. Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money, money to the main level and waste. (8 measures; a clear difference is more than 2.7 standard errors.)

- hardest level: 6.00 against traditional 1.44, clearly better.
- targets solved: 1.99 against traditional 0.34, clearly better.
- bounty value: 255 against traditional 44, clearly better.
- ROI: 0.49 against traditional 0.04, clearly better.
- knowledge found (bits): 126 against traditional 72, clearly better.
- knowledge per unit of money: 0.24 against traditional 0.06, clearly better.
- money to the main level: 272 against traditional 990, clearly better.
- waste: 0.56 against traditional 0.72, clearly better.

![Step 5: A gamer, and validation](figures/compare.svg)

| society | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | bits per money | cost | waste |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, finished work only) | 1.4 ± 2.6 | 0.3 ± 0.7 | 44 ± 84 | 0.04 ± 0.08 | 72 ± 12 | 0.062 ± 0.011 | 990 ± 174 | 0.72 ± 0.05 |
| Agents choose, α = 1 | 6.0 ± 0.0 | 1.9 ± 0.4 | 242 ± 48 | 0.36 ± 0.15 | 101 ± 16 | 0.144 ± 0.041 | 561 ± 205 | 0.57 ± 0.07 |
| Agents choose, α = 0.8 | 6.0 ± 0.0 | 1.9 ± 0.2 | 250 ± 28 | 0.36 ± 0.12 | 105 ± 18 | 0.148 ± 0.038 | 532 ± 205 | 0.58 ± 0.07 |
| Agents choose, α = 0.2 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.55 ± 0.17 | 105 ± 18 | 0.219 ± 0.049 | 347 ± 111 | 0.52 ± 0.07 |
| Agents choose, α = 0 | 6.0 ± 0.0 | 2.0 ± 0.1 | 255 ± 13 | 0.49 ± 0.17 | 126 ± 15 | 0.237 ± 0.069 | 272 ± 107 | 0.56 ± 0.09 |

**Design** (fixed before the run): compared traditional against agents choosing what to share, at α in {1, 0.8, 0.2, 0} · held the same: a generated idea graph (6 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7), 12 identical agents, budget 1200 split equally, no flat mint, knowledge reward 1 per new bit, no validation; plus agents choose what to share; earnings shape next round's money; different kinds of agents; a gamer, and validation · measure: all of hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money, money to the main level, waste · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The simple model on a generated idea graph (6 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7); each run draws its own graph. Only α and β vary. Held fixed: 12 identical agents, a budget of 1200 split equally every round (f = 0), no flat mint, a knowledge reward of 1 per new bit flowing back with α, no validation. Step 5 adds: agents choose what to share; earnings shape next round's money; different kinds of agents; a gamer, and validation.

Values are mean ± standard deviation over runs.

| society | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | knowledge published (bits) | bits per money | cost | waste | sharing | reach L6 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, finished work only) | 1.4 ± 2.6 | 0.3 ± 0.7 | 44 ± 84 | 0.04 ± 0.08 | 72 ± 12 | 11 ± 21 | 0.062 ± 0.011 | 990 ± 174 | 0.72 ± 0.05 | 0.00 ± 0.00 | 0.24 |
| Agents choose, α = 1 | 6.0 ± 0.0 | 1.9 ± 0.4 | 242 ± 48 | 0.36 ± 0.15 | 101 ± 16 | 96 ± 18 | 0.144 ± 0.041 | 561 ± 205 | 0.57 ± 0.07 | 0.35 ± 0.10 | 1.00 |
| Agents choose, α = 0.8 | 6.0 ± 0.0 | 1.9 ± 0.2 | 250 ± 28 | 0.36 ± 0.12 | 105 ± 18 | 103 ± 19 | 0.148 ± 0.038 | 532 ± 205 | 0.58 ± 0.07 | 0.40 ± 0.11 | 1.00 |
| Agents choose, α = 0.2 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.55 ± 0.17 | 105 ± 18 | 105 ± 19 | 0.219 ± 0.049 | 347 ± 111 | 0.52 ± 0.07 | 0.68 ± 0.08 | 1.00 |
| Agents choose, α = 0 | 6.0 ± 0.0 | 2.0 ± 0.1 | 255 ± 13 | 0.49 ± 0.17 | 126 ± 15 | 126 ± 15 | 0.237 ± 0.069 | 272 ± 107 | 0.56 ± 0.09 | 1.00 ± 0.00 | 1.00 |

Code: commit `cd9fb92` (with uncommitted changes). Experiment: [config/experiments/simple-ideas-6x8-p2-len3g2-comp0-7-step5-by-alpha-20261025.yaml](../../config/experiments/simple-ideas-6x8-p2-len3g2-comp0-7-step5-by-alpha-20261025.yaml). Command: `npm run sim -- simple-ideas-6x8-p2-len3g2-comp0-7-step5-by-alpha-20261025 --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
