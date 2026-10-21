# How much the traditional-vs-OSO gap depends on the gamer and the compute loop

**Question:** How much of OSO's lead depends on the gaming agent and the compute loop?

**Answer:** Best on hardest level published: no compute loop (ρ = 0), OSO (immediate), 8.0 (tied with no gamer, OSO (immediate) and strong screen (θ = 0.9), OSO (immediate) and 1 more). Best traditional: no gamer, Traditional, 7.0; a clear difference.

| variant | setting | frontier | reach L7 | speed | cost |
| --- | --- | --- | --- | --- | --- |
| default (ρ = 0.5, θ = 0.5) | Traditional | 5.7 ± 1.2 | 0.35 | 96 ± 16 | 957 ± 161 |
| default (ρ = 0.5, θ = 0.5) | OSO (immediate) | 7.9 ± 0.2 | 1.00 | 49 ± 14 | 485 ± 141 |
| no compute loop (ρ = 0) | Traditional | 4.6 ± 0.9 | 0.01 | 111 ± 0 | 1105 ± 0 |
| no compute loop (ρ = 0) | OSO (immediate) | 8.0 ± 0.1 | 1.00 | 44 ± 11 | 432 ± 114 |
| strong screen (θ = 0.9) | Traditional | 5.7 ± 1.1 | 0.32 | 97 ± 15 | 964 ± 151 |
| strong screen (θ = 0.9) | OSO (immediate) | 8.0 ± 0.2 | 1.00 | 46 ± 13 | 456 ± 128 |
| no gamer | Traditional | 7.0 ± 1.2 | 0.77 | 84 ± 21 | 840 ± 210 |
| no gamer | OSO (immediate) | 8.0 ± 0.1 | 1.00 | 42 ± 13 | 412 ± 133 |

**Design** (fixed before the run): compared traditional and OSO, under four variants · held the same: the field and budget · measure: hardest level published, higher is better · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Traditional and OSO (immediate) under four variants. Under traditional rules only target winners and spammers earn early, so the compute loop can hand the gaming agent most of the budget.

Values are mean ± standard deviation over runs.

| variant | setting | frontier | reach L7 | speed | cost | spend | results per 100 | breadth | waste | credit | sharing | hoarded | gamer share of pay | trivial spend |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| default (ρ = 0.5, θ = 0.5) | Traditional | 5.7 ± 1.2 | 0.35 | 96 ± 16 | 957 ± 161 | 1194 ± 11 | 2.4 ± 0.6 | 0.60 ± 0.13 | 0.64 ± 0.09 | 0.95 ± 0.09 | 0.01 ± 0.01 | 0.47 ± 0.13 | 0.96 | 0.31 ± 0.01 |
| default (ρ = 0.5, θ = 0.5) | OSO (immediate) | 7.9 ± 0.2 | 1.00 | 49 ± 14 | 485 ± 141 | 849 ± 207 | 7.7 ± 1.8 | 0.98 ± 0.07 | 0.86 ± 0.03 | 0.57 ± 0.07 | 1.00 ± 0.00 | 0.00 ± 0.00 | 0.38 | 0.19 ± 0.05 |
| no compute loop (ρ = 0) | Traditional | 4.6 ± 0.9 | 0.01 | 111 ± 0 | 1105 ± 0 | 1190 ± 0 | 1.8 ± 0.5 | 0.46 ± 0.11 | 0.48 ± 0.15 | 0.83 ± 0.09 | 0.00 ± 0.00 | 0.57 ± 0.13 | 0.36 | 0.05 ± 0.00 |
| no compute loop (ρ = 0) | OSO (immediate) | 8.0 ± 0.1 | 1.00 | 44 ± 11 | 432 ± 114 | 801 ± 182 | 8.3 ± 1.7 | 0.99 ± 0.05 | 0.87 ± 0.03 | 0.58 ± 0.05 | 1.00 ± 0.00 | 0.00 ± 0.00 | 0.09 | 0.05 ± 0.00 |
| strong screen (θ = 0.9) | Traditional | 5.7 ± 1.1 | 0.32 | 97 ± 15 | 964 ± 151 | 1183 ± 63 | 2.5 ± 0.8 | 0.59 ± 0.15 | 0.63 ± 0.09 | 0.95 ± 0.09 | 0.00 ± 0.01 | 0.46 ± 0.14 | 0.83 | 0.27 ± 0.06 |
| strong screen (θ = 0.9) | OSO (immediate) | 8.0 ± 0.2 | 1.00 | 46 ± 13 | 456 ± 128 | 801 ± 205 | 8.3 ± 1.9 | 0.99 ± 0.04 | 0.82 ± 0.04 | 0.56 ± 0.09 | 1.00 ± 0.00 | 0.00 ± 0.00 | 0.13 | 0.08 ± 0.04 |
| no gamer | Traditional | 7.0 ± 1.2 | 0.77 | 84 ± 21 | 840 ± 210 | 1123 ± 130 | 3.7 ± 1.3 | 0.80 ± 0.18 | 0.58 ± 0.11 | 0.95 ± 0.09 | 0.00 ± 0.01 | 0.34 ± 0.15 | – | 0.00 ± 0.00 |
| no gamer | OSO (immediate) | 8.0 ± 0.1 | 1.00 | 42 ± 13 | 412 ± 133 | 766 ± 195 | 8.7 ± 1.9 | 0.99 ± 0.06 | 0.80 ± 0.06 | 0.60 ± 0.08 | 1.00 ± 0.00 | 0.00 ± 0.00 | – | 0.00 ± 0.00 |

Code: commit `023509e` (with uncommitted changes). Experiment: [config/experiments/sensitivity.yaml](../../config/experiments/sensitivity.yaml). Command: `npm run sim -- sensitivity --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
