# How much the traditional-vs-OSO gap depends on the gamer and the funding loop

**Question:** How much of OSO's lead depends on the gaming agent and the funding loop?

**Answer:** Best: no funding loop (ρ = 0), OSO, 8.0 (3 more tie). Best traditional: no gamer, Traditional, 7.0. Clear difference.

![How much the traditional-vs-OSO gap depends on the gamer and the funding loop](figures/compare.svg)

| variant | setting | frontier | reach L7 | speed | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- |
| default (ρ = 0.5, θ = 0.5) | Traditional | 5.7 ± 1.2 | 0.35 | 96 ± 16 | 0.22 ± 0.18 |
| default (ρ = 0.5, θ = 0.5) | OSO (immediate) | 7.9 ± 0.2 | 1.00 | 49 ± 14 | 1.44 ± 0.48 |
| no funding loop (ρ = 0) | Traditional | 4.6 ± 0.9 | 0.01 | 111 ± 0 | 0.09 ± 0.05 |
| no funding loop (ρ = 0) | OSO (immediate) | 8.0 ± 0.1 | 1.00 | 44 ± 11 | 1.53 ± 0.43 |
| strong screen (θ = 0.9) | Traditional | 5.7 ± 1.1 | 0.32 | 97 ± 15 | 0.24 ± 0.27 |
| strong screen (θ = 0.9) | OSO (immediate) | 8.0 ± 0.2 | 1.00 | 46 ± 13 | 1.55 ± 0.46 |
| no gamer | Traditional | 7.0 ± 1.2 | 0.77 | 84 ± 21 | 0.66 ± 0.46 |
| no gamer | OSO (immediate) | 8.0 ± 0.1 | 1.00 | 42 ± 13 | 1.62 ± 0.48 |

**Design** (fixed before the run): compared traditional and OSO, under four variants · held the same: the field and budget · measure: hardest level published, higher is better · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Traditional and OSO (immediate) under four variants. Under traditional rules only target winners and spammers earn early, so the funding loop can hand the gaming agent most of the budget.

Values are mean ± standard deviation over runs.

| variant | setting | frontier | reach L7 | speed | ROI (value per spend) | cost | spend | ideas per 100 | breadth | waste | credit | sharing | hoarded | gamer share of pay | trivial spend |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| default (ρ = 0.5, θ = 0.5) | Traditional | 5.7 ± 1.2 | 0.35 | 96 ± 16 | 0.22 ± 0.18 | 957 ± 161 | 1194 ± 11 | 2.4 ± 0.6 | 0.60 ± 0.13 | 0.64 ± 0.09 | 0.95 ± 0.09 | 0.01 ± 0.01 | 0.47 ± 0.13 | 0.96 | 0.31 ± 0.01 |
| default (ρ = 0.5, θ = 0.5) | OSO (immediate) | 7.9 ± 0.2 | 1.00 | 49 ± 14 | 1.44 ± 0.48 | 485 ± 141 | 849 ± 207 | 7.7 ± 1.8 | 0.98 ± 0.07 | 0.86 ± 0.03 | 0.57 ± 0.07 | 1.00 ± 0.00 | 0.00 ± 0.00 | 0.38 | 0.19 ± 0.05 |
| no funding loop (ρ = 0) | Traditional | 4.6 ± 0.9 | 0.01 | 111 ± 0 | 0.09 ± 0.05 | 1105 ± 0 | 1190 ± 0 | 1.8 ± 0.5 | 0.46 ± 0.11 | 0.48 ± 0.15 | 0.83 ± 0.09 | 0.00 ± 0.00 | 0.57 ± 0.13 | 0.36 | 0.05 ± 0.00 |
| no funding loop (ρ = 0) | OSO (immediate) | 8.0 ± 0.1 | 1.00 | 44 ± 11 | 1.53 ± 0.43 | 432 ± 114 | 801 ± 182 | 8.3 ± 1.7 | 0.99 ± 0.05 | 0.87 ± 0.03 | 0.58 ± 0.05 | 1.00 ± 0.00 | 0.00 ± 0.00 | 0.09 | 0.05 ± 0.00 |
| strong screen (θ = 0.9) | Traditional | 5.7 ± 1.1 | 0.32 | 97 ± 15 | 0.24 ± 0.27 | 964 ± 151 | 1183 ± 63 | 2.5 ± 0.8 | 0.59 ± 0.15 | 0.63 ± 0.09 | 0.95 ± 0.09 | 0.00 ± 0.01 | 0.46 ± 0.14 | 0.83 | 0.27 ± 0.06 |
| strong screen (θ = 0.9) | OSO (immediate) | 8.0 ± 0.2 | 1.00 | 46 ± 13 | 1.55 ± 0.46 | 456 ± 128 | 801 ± 205 | 8.3 ± 1.9 | 0.99 ± 0.04 | 0.82 ± 0.04 | 0.56 ± 0.09 | 1.00 ± 0.00 | 0.00 ± 0.00 | 0.13 | 0.08 ± 0.04 |
| no gamer | Traditional | 7.0 ± 1.2 | 0.77 | 84 ± 21 | 0.66 ± 0.46 | 840 ± 210 | 1123 ± 130 | 3.7 ± 1.3 | 0.80 ± 0.18 | 0.58 ± 0.11 | 0.95 ± 0.09 | 0.00 ± 0.01 | 0.34 ± 0.15 | – | 0.00 ± 0.00 |
| no gamer | OSO (immediate) | 8.0 ± 0.1 | 1.00 | 42 ± 13 | 1.62 ± 0.48 | 412 ± 133 | 766 ± 195 | 8.7 ± 1.9 | 0.99 ± 0.06 | 0.80 ± 0.06 | 0.60 ± 0.08 | 1.00 ± 0.00 | 0.00 ± 0.00 | – | 0.00 ± 0.00 |

Code: commit `ead6740` (with uncommitted changes). Experiment: [config/experiments/sensitivity.yaml](../../config/experiments/sensitivity.yaml). Command: `npm run sim -- sensitivity --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
