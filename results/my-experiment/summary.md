# my-experiment

**Question:** my-experiment

**Answer:** Best: OSO, 6.9. Best traditional: Traditional, 4.1. Clear difference.

![my-experiment](figures/compare.svg)

| setting | frontier | reach L7 | cost | ROI (value per spend) |
| --- | --- | --- | --- | --- |
| Traditional | 4.1 ± 1.2 | 0.00 | – | 0.07 ± 0.04 |
| OSO (immediate) | 6.9 ± 0.7 | 0.74 | 833 ± 196 | 0.33 ± 0.33 |
| OSO (choice) | 5.0 ± 0.8 | 0.04 | 1100 ± 34 | 0.09 ± 0.05 |
| Flow-back, finished-only | 4.2 ± 1.1 | 0.02 | 1145 ± 0 | 0.06 ± 0.05 |

**Design** (fixed before the run): compared setting · held the same: the field, agents and budget · measure: hardest level published, higher is better · 50 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Designed in the app on the field "An abstract research field" (spaces/abstract-field.yaml): Traditional vs OSO (immediate) vs OSO (choice) vs Flow-back, finished-only; with α, retention = 0.65, p₀, chance at level 1 = 0.25. α and c apply to the OSO (flow-back) settings only.

Values are mean ± standard deviation over runs.

| setting | frontier | reach L7 | cost | sharing | targets solved | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- | --- |
| Traditional | 4.1 ± 1.2 | 0.00 | – | 0.00 ± 0.01 | 2.7 ± 1.0 | 0.07 ± 0.04 |
| OSO (immediate) | 6.9 ± 0.7 | 0.74 | 833 ± 196 | 1.00 ± 0.00 | 4.5 ± 1.1 | 0.33 ± 0.33 |
| OSO (choice) | 5.0 ± 0.8 | 0.04 | 1100 ± 34 | 0.20 ± 0.08 | 3.0 ± 0.8 | 0.09 ± 0.05 |
| Flow-back, finished-only | 4.2 ± 1.1 | 0.02 | 1145 ± 0 | 0.00 ± 0.00 | 2.6 ± 0.8 | 0.06 ± 0.05 |

Code: commit `ead6740` (with uncommitted changes). Experiment: [config/experiments/my-experiment.yaml](../../config/experiments/my-experiment.yaml). Command: `npm run sim -- my-experiment --seeds 50 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
