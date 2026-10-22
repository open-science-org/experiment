# exp-202610220110

**Question:** Traditional vs OSO (immediate) on An abstract research field: which gets furthest?

**Answer:** Best: OSO, 7.9. Best traditional: Traditional, 5.7. Clear difference.

![exp-202610220110](figures/compare.svg)

| setting | frontier | reach L7 | cost | ROI (value per spend) |
| --- | --- | --- | --- | --- |
| Traditional | 5.7 ± 1.3 | 0.36 | 940 ± 115 | 0.25 ± 0.23 |
| OSO (immediate) | 7.9 ± 0.2 | 1.00 | 464 ± 128 | 1.48 ± 0.44 |

**Design** (fixed before the run): compared Traditional, OSO (immediate) · held the same: the field "An abstract research field" · measure: hardest level published, higher is better · 50 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Designed in the app on the field "An abstract research field" (spaces/abstract-field.yaml): Traditional vs OSO (immediate). α and c apply to the OSO (flow-back) settings only.

Values are mean ± standard deviation over runs.

| setting | frontier | reach L7 | cost | sharing | targets solved | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- | --- |
| Traditional | 5.7 ± 1.3 | 0.36 | 940 ± 115 | 0.01 ± 0.01 | 4.2 ± 1.1 | 0.25 ± 0.23 |
| OSO (immediate) | 7.9 ± 0.2 | 1.00 | 464 ± 128 | 1.00 ± 0.00 | 6.9 ± 0.4 | 1.48 ± 0.44 |

Code: commit `88a4b32` (with uncommitted changes). Experiment: [config/experiments/exp-202610220110.yaml](../../config/experiments/exp-202610220110.yaml). Command: `npm run sim -- exp-202610220110 --seeds 50 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
