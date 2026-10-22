# Is it sharing at once, or credit flowing back, that makes OSO get further?

**Question:** Is it sharing at once, or credit flowing back, that makes OSO get further?

**Answer:** Best: OSO, 7.9 (1 more tie). Best traditional: Traditional, 5.7. Clear difference.

![Is it sharing at once, or credit flowing back, that makes OSO get further?](figures/compare.svg)

| setting | frontier | reach L7 | cost | ROI (value per spend) |
| --- | --- | --- | --- | --- |
| Traditional | 5.7 ± 1.3 | 0.36 | 940 ± 115 | 0.25 ± 0.23 |
| OSO (immediate) | 7.9 ± 0.2 | 1.00 | 464 ± 128 | 1.48 ± 0.44 |
| Flow-back, finished-only | 5.7 ± 1.1 | 0.34 | 962 ± 154 | 0.22 ± 0.16 |
| No flow-back, immediate | 7.9 ± 0.2 | 1.00 | 471 ± 146 | 1.42 ± 0.50 |

**Design** (fixed before the run): compared Traditional, OSO (immediate), Flow-back, finished-only, No flow-back, immediate · held the same: the field "An abstract research field" · measure: hardest level published, higher is better · 50 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Designed in the app on the field "An abstract research field" (spaces/abstract-field.yaml): Traditional vs OSO (immediate) vs Flow-back, finished-only vs No flow-back, immediate. α and c apply to the OSO (flow-back) settings only.

Values are mean ± standard deviation over runs.

| setting | frontier | reach L7 | cost | sharing | targets solved | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- | --- |
| Traditional | 5.7 ± 1.3 | 0.36 | 940 ± 115 | 0.01 ± 0.01 | 4.2 ± 1.1 | 0.25 ± 0.23 |
| OSO (immediate) | 7.9 ± 0.2 | 1.00 | 464 ± 128 | 1.00 ± 0.00 | 6.9 ± 0.4 | 1.48 ± 0.44 |
| Flow-back, finished-only | 5.7 ± 1.1 | 0.34 | 962 ± 154 | 0.00 ± 0.01 | 4.2 ± 0.9 | 0.22 ± 0.16 |
| No flow-back, immediate | 7.9 ± 0.2 | 1.00 | 471 ± 146 | 1.00 ± 0.00 | 6.9 ± 0.5 | 1.42 ± 0.50 |

Code: commit `88a4b32` (with uncommitted changes). Experiment: [config/experiments/exp-202610220203.yaml](../../config/experiments/exp-202610220203.yaml). Command: `npm run sim -- exp-202610220203 --seeds 50 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
