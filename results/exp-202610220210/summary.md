# exp-202610220210

**Question:** Traditional vs OSO (immediate) vs OSO (choice) vs Flow-back, finished-only vs No flow-back, immediate vs No flow-back, choice on An abstract research field: which gets furthest?

**Answer:** Best: OSO, 7.9 (1 more tie). Best traditional: Traditional, 5.7. Clear difference.

![exp-202610220210](figures/compare.svg)

| setting | frontier | reach L7 | cost | ROI (value per spend) |
| --- | --- | --- | --- | --- |
| Traditional | 5.7 ± 1.3 | 0.36 | 940 ± 115 | 0.25 ± 0.23 |
| OSO (immediate) | 7.9 ± 0.2 | 1.00 | 464 ± 128 | 1.48 ± 0.44 |
| OSO (choice) | 6.4 ± 1.1 | 0.52 | 950 ± 196 | 0.32 ± 0.29 |
| Flow-back, finished-only | 5.7 ± 1.1 | 0.34 | 962 ± 154 | 0.22 ± 0.16 |
| No flow-back, immediate | 7.9 ± 0.2 | 1.00 | 471 ± 146 | 1.42 ± 0.50 |
| No flow-back, choice | 6.0 ± 1.0 | 0.38 | 968 ± 146 | 0.22 ± 0.19 |

**Design** (fixed before the run): compared Traditional, OSO (immediate), OSO (choice), Flow-back, finished-only, No flow-back, immediate, No flow-back, choice · held the same: the field "An abstract research field" · measure: hardest level published, higher is better · 50 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Designed in the app on the field "An abstract research field" (spaces/abstract-field.yaml): Traditional vs OSO (immediate) vs OSO (choice) vs Flow-back, finished-only vs No flow-back, immediate vs No flow-back, choice. α and c apply to the OSO (flow-back) settings only.

Values are mean ± standard deviation over runs.

| setting | frontier | reach L7 | cost | sharing | targets solved | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- | --- |
| Traditional | 5.7 ± 1.3 | 0.36 | 940 ± 115 | 0.01 ± 0.01 | 4.2 ± 1.1 | 0.25 ± 0.23 |
| OSO (immediate) | 7.9 ± 0.2 | 1.00 | 464 ± 128 | 1.00 ± 0.00 | 6.9 ± 0.4 | 1.48 ± 0.44 |
| OSO (choice) | 6.4 ± 1.1 | 0.52 | 950 ± 196 | 0.24 ± 0.09 | 4.6 ± 1.2 | 0.32 ± 0.29 |
| Flow-back, finished-only | 5.7 ± 1.1 | 0.34 | 962 ± 154 | 0.00 ± 0.01 | 4.2 ± 0.9 | 0.22 ± 0.16 |
| No flow-back, immediate | 7.9 ± 0.2 | 1.00 | 471 ± 146 | 1.00 ± 0.00 | 6.9 ± 0.5 | 1.42 ± 0.50 |
| No flow-back, choice | 6.0 ± 1.0 | 0.38 | 968 ± 146 | 0.24 ± 0.08 | 4.2 ± 0.9 | 0.22 ± 0.19 |

Code: commit `b725f0a` (with uncommitted changes). Experiment: [config/experiments/exp-202610220210.yaml](../../config/experiments/exp-202610220210.yaml). Command: `npm run sim -- exp-202610220210 --seeds 50 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
