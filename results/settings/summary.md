# The six rule settings on the default world

**Question:** On the default field, which rule setting gets furthest for the same budget?

**Answer:** Best: OSO, 7.9 (1 more tie). Best traditional: Traditional, 5.7. Clear difference.

![The six rule settings on the default world](figures/compare.svg)

| setting | frontier | reach L7 | speed | ROI (value per spend) |
| --- | --- | --- | --- | --- |
| Traditional | 5.7 ± 1.2 | 0.35 | 96 ± 16 | 0.22 ± 0.18 |
| OSO (immediate) | 7.9 ± 0.2 | 1.00 | 49 ± 14 | 1.44 ± 0.48 |
| Flow-back, finished-only | 5.5 ± 1.1 | 0.28 | 96 ± 18 | 0.20 ± 0.15 |
| No flow-back, immediate | 7.9 ± 0.3 | 1.00 | 50 ± 14 | 1.41 ± 0.48 |
| No flow-back, choice | 6.0 ± 0.9 | 0.35 | 100 ± 16 | 0.20 ± 0.17 |
| OSO (choice) | 6.3 ± 1.0 | 0.43 | 96 ± 19 | 0.27 ± 0.25 |

**Design** (fixed before the run): compared the six rule settings · held the same: the field, 12 agents and the budget · measure: hardest level published, higher is better · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Traditional research (α = 1, c = 0, finished-only), OSO (α = 0.8, c = 0.15) with immediate and with agent's-choice visibility, and the mixed corners. Same world parameters, agents and budget in every setting; each seed gives the same world and agents across settings.

Values are mean ± standard deviation over runs.

| setting | frontier | reach L7 | speed | ROI (value per spend) | cost | spend | ideas per 100 | breadth | waste | credit | sharing | hoarded | gamer share of pay | trivial spend |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 5.7 ± 1.2 | 0.35 | 96 ± 16 | 0.22 ± 0.18 | 957 ± 161 | 1194 ± 11 | 2.4 ± 0.6 | 0.60 ± 0.13 | 0.64 ± 0.09 | 0.95 ± 0.09 | 0.01 ± 0.01 | 0.47 ± 0.13 | 0.96 | 0.31 ± 0.01 |
| OSO (immediate) | 7.9 ± 0.2 | 1.00 | 49 ± 14 | 1.44 ± 0.48 | 485 ± 141 | 849 ± 207 | 7.7 ± 1.8 | 0.98 ± 0.07 | 0.86 ± 0.03 | 0.57 ± 0.07 | 1.00 ± 0.00 | 0.00 ± 0.00 | 0.38 | 0.19 ± 0.05 |
| Flow-back, finished-only | 5.5 ± 1.1 | 0.28 | 96 ± 18 | 0.20 ± 0.15 | 959 ± 182 | 1195 ± 2 | 2.3 ± 0.6 | 0.58 ± 0.13 | 0.64 ± 0.09 | 0.96 ± 0.07 | 0.00 ± 0.01 | 0.48 ± 0.13 | 0.97 | 0.32 ± 0.01 |
| No flow-back, immediate | 7.9 ± 0.3 | 1.00 | 50 ± 14 | 1.41 ± 0.48 | 494 ± 143 | 871 ± 210 | 7.6 ± 1.8 | 0.98 ± 0.05 | 0.84 ± 0.04 | 0.47 ± 0.09 | 1.00 ± 0.00 | 0.00 ± 0.00 | 0.37 | 0.19 ± 0.05 |
| No flow-back, choice | 6.0 ± 0.9 | 0.35 | 100 ± 16 | 0.20 ± 0.17 | 990 ± 159 | 1195 ± 2 | 3.5 ± 0.6 | 0.59 ± 0.13 | 0.66 ± 0.07 | 0.88 ± 0.12 | 0.23 ± 0.08 | 0.21 ± 0.10 | 0.92 | 0.30 ± 0.02 |
| OSO (choice) | 6.3 ± 1.0 | 0.43 | 96 ± 19 | 0.27 ± 0.25 | 959 ± 186 | 1193 ± 11 | 3.7 ± 0.7 | 0.63 ± 0.15 | 0.68 ± 0.09 | 0.87 ± 0.11 | 0.22 ± 0.09 | 0.18 ± 0.12 | 0.91 | 0.30 ± 0.02 |

Code: commit `ead6740` (with uncommitted changes). Experiment: [config/experiments/settings.yaml](../../config/experiments/settings.yaml). Command: `npm run sim -- settings --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
