# exp-20261022025249

**Question:** Traditional vs OSO (immediate) vs OSO (choice) vs Flow-back, finished-only vs No flow-back, immediate vs No flow-back, choice on An abstract research field: which gets furthest?

**Answer:** Best: OSO, 8.0 (1 more tie). Best traditional: Traditional, 6.4. Clear difference.

![exp-20261022025249](figures/compare.svg)

| setting | frontier | reach L7 | cost | ROI (value per spend) |
| --- | --- | --- | --- | --- |
| Traditional | 6.4 ± 1.5 | 0.60 | 845 ± 194 | 0.54 ± 0.45 |
| OSO (immediate) | 8.0 ± 0.0 | 1.00 | 420 ± 133 | 1.61 ± 0.44 |
| OSO (choice) | 7.1 ± 1.0 | 0.78 | 869 ± 201 | 0.58 ± 0.47 |
| Flow-back, finished-only | 6.9 ± 1.3 | 0.70 | 857 ± 173 | 0.65 ± 0.48 |
| No flow-back, immediate | 8.0 ± 0.1 | 1.00 | 432 ± 114 | 1.63 ± 0.51 |
| No flow-back, choice | 7.1 ± 0.9 | 0.78 | 871 ± 140 | 0.61 ± 0.46 |

**Design** (fixed before the run): compared Traditional, OSO (immediate), OSO (choice), Flow-back, finished-only, No flow-back, immediate, No flow-back, choice · held the same: the field "An abstract research field", with mint per result = 0, θ, validation screen = 0 · measure: hardest level published, higher is better · 50 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Designed in the app on the field "An abstract research field" (spaces/abstract-field.yaml): Traditional vs OSO (immediate) vs OSO (choice) vs Flow-back, finished-only vs No flow-back, immediate vs No flow-back, choice; with mint per result = 0, θ, validation screen = 0. α and c apply to the OSO (flow-back) settings only.

Values are mean ± standard deviation over runs.

| setting | frontier | reach L7 | cost | sharing | targets solved | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- | --- |
| Traditional | 6.4 ± 1.5 | 0.60 | 845 ± 194 | 0.00 ± 0.01 | 5.2 ± 1.5 | 0.54 ± 0.45 |
| OSO (immediate) | 8.0 ± 0.0 | 1.00 | 420 ± 133 | 1.00 ± 0.00 | 7.0 ± 0.0 | 1.61 ± 0.44 |
| OSO (choice) | 7.1 ± 1.0 | 0.78 | 869 ± 201 | 0.24 ± 0.08 | 5.3 ± 1.4 | 0.58 ± 0.47 |
| Flow-back, finished-only | 6.9 ± 1.3 | 0.70 | 857 ± 173 | 0.00 ± 0.01 | 5.5 ± 1.4 | 0.65 ± 0.48 |
| No flow-back, immediate | 8.0 ± 0.1 | 1.00 | 432 ± 114 | 1.00 ± 0.00 | 6.9 ± 0.3 | 1.63 ± 0.51 |
| No flow-back, choice | 7.1 ± 0.9 | 0.78 | 871 ± 140 | 0.25 ± 0.09 | 5.5 ± 1.2 | 0.61 ± 0.46 |

Code: commit `b725f0a` (with uncommitted changes). Experiment: [config/experiments/exp-20261022025249.yaml](../../config/experiments/exp-20261022025249.yaml). Command: `npm run sim -- exp-20261022025249 --seeds 50 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
