# All together on the Lean tree: learning, shared failures, costly and fallible sharing

**Question:** With learning, shared failures, and costly, fallible sharing all on, does OSO still lead?

**Answer:** Best: free and correct, OSO, 7.0 (3 more tie). Best traditional: free and correct, Traditional, 6.5. Clear difference.

![All together on the Lean tree: learning, shared failures, costly and fallible sharing](figures/compare.svg)

| knowledge | setting | frontier | reach L5 | speed | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- |
| free and correct | Traditional | 6.5 ± 1.0 | 0.93 | 24 ± 7 | 1.36 ± 0.67 |
| free and correct | OSO (immediate) | 7.0 ± 0.0 | 1.00 | 12 ± 3 | 2.66 ± 0.50 |
| free and correct | OSO + public failures | 7.0 ± 0.0 | 1.00 | 10 ± 2 | 3.37 ± 0.47 |
| free and correct | OSO (choice) | 6.7 ± 0.8 | 0.97 | 21 ± 6 | 1.72 ± 0.74 |
| costly and fallible | Traditional | 6.3 ± 1.3 | 0.89 | 24 ± 8 | 1.18 ± 0.72 |
| costly and fallible | OSO (immediate) | 7.0 ± 0.3 | 1.00 | 13 ± 5 | 2.20 ± 0.60 |
| costly and fallible | OSO + public failures | 7.0 ± 0.0 | 1.00 | 12 ± 5 | 2.22 ± 0.52 |
| costly and fallible | OSO (choice) | 6.5 ± 1.0 | 0.95 | 22 ± 8 | 1.56 ± 0.81 |

**Design** (fixed before the run): compared the rule settings, with every optional mechanism on · held the same: the Lean tree, agents and budget · measure: hardest level published, higher is better · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The Lean reference tree; every agent learns from failure (learning oracle, gain 0.1). Knowledge is either free and always correct, or costly (absorbCost 0.25) and fallible (errorRate 0.05). OSO is run with and without publishing failed attempts.

Values are mean ± standard deviation over runs.

| knowledge | setting | frontier | reach L5 | speed | ROI (value per spend) | cost | spend | targets solved | take up spend | rejected targets | retracted | sharing | credit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| free and correct | Traditional | 6.5 ± 1.0 | 0.93 | 24 ± 7 | 1.36 ± 0.67 | 238 ± 69 | 319 ± 71 | 7.4 ± 1.2 | 0.00 ± 0.00 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0.02 ± 0.02 | 0.99 ± 0.03 |
| free and correct | OSO (immediate) | 7.0 ± 0.0 | 1.00 | 12 ± 3 | 2.66 ± 0.50 | 110 ± 31 | 179 ± 33 | 8.0 ± 0.0 | 0.00 ± 0.00 | 0.0 ± 0.0 | 0.0 ± 0.0 | 1.00 ± 0.00 | 0.76 ± 0.09 |
| free and correct | OSO + public failures | 7.0 ± 0.0 | 1.00 | 10 ± 2 | 3.37 ± 0.47 | 92 ± 19 | 139 ± 19 | 8.0 ± 0.0 | 0.00 ± 0.00 | 0.0 ± 0.0 | 0.0 ± 0.0 | 1.00 ± 0.00 | 0.74 ± 0.08 |
| free and correct | OSO (choice) | 6.7 ± 0.8 | 0.97 | 21 ± 6 | 1.72 ± 0.74 | 206 ± 64 | 278 ± 82 | 7.8 ± 0.6 | 0.00 ± 0.00 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0.43 ± 0.05 | 0.92 ± 0.06 |
| costly and fallible | Traditional | 6.3 ± 1.3 | 0.89 | 24 ± 8 | 1.18 ± 0.72 | 240 ± 75 | 335 ± 76 | 6.9 ± 1.5 | 0.16 ± 0.06 | 1.5 ± 1.2 | 2.7 ± 2.5 | 0.02 ± 0.02 | 1.00 ± 0.01 |
| costly and fallible | OSO (immediate) | 7.0 ± 0.3 | 1.00 | 13 ± 5 | 2.20 ± 0.60 | 124 ± 52 | 222 ± 66 | 8.0 ± 0.3 | 0.44 ± 0.05 | 1.7 ± 1.3 | 2.5 ± 2.5 | 0.93 ± 0.07 | 0.93 ± 0.09 |
| costly and fallible | OSO + public failures | 7.0 ± 0.0 | 1.00 | 12 ± 5 | 2.22 ± 0.52 | 121 ± 47 | 220 ± 59 | 8.0 ± 0.1 | 0.44 ± 0.05 | 1.9 ± 1.5 | 2.9 ± 2.9 | 0.93 ± 0.07 | 0.93 ± 0.09 |
| costly and fallible | OSO (choice) | 6.5 ± 1.0 | 0.95 | 22 ± 8 | 1.56 ± 0.81 | 216 ± 82 | 290 ± 86 | 7.5 ± 1.0 | 0.31 ± 0.09 | 1.8 ± 1.3 | 2.6 ± 2.6 | 0.42 ± 0.07 | 0.95 ± 0.06 |

Code: commit `dc540e2`. Experiment: [config/experiments/complex.yaml](../../config/experiments/complex.yaml). Command: `npm run sim -- complex --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
