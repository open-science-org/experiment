# exp-202610220048

**Question:** Traditional vs OSO (immediate) on An abstract research field: which gets furthest?

**Answer:** Best: OSO, 8.0. Best traditional: Traditional, 5.7. Clear difference.

![exp-202610220048](figures/compare.svg)

| setting | frontier | reach L7 | cost | sharing |
| --- | --- | --- | --- | --- |
| Traditional | 5.7 ± 1.1 | 0.34 | 984 ± 88 | 0.00 ± 0.01 |
| OSO (immediate) | 8.0 ± 0.1 | 1.00 | 451 ± 127 | 1.00 ± 0.00 |

**Design** (fixed before the run): compared Traditional, OSO (immediate) · held the same: the field "An abstract research field", with θ, validation screen = 0.65 · measure: hardest level published, higher is better · 50 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Designed in the app on the field "An abstract research field" (spaces/abstract-field.yaml): Traditional vs OSO (immediate); with θ, validation screen = 0.65. α and c apply to the OSO (flow-back) settings only.

Values are mean ± standard deviation over runs.

| setting | frontier | reach L7 | cost | sharing | targets solved |
| --- | --- | --- | --- | --- | --- |
| Traditional | 5.7 ± 1.1 | 0.34 | 984 ± 88 | 0.00 ± 0.01 | 4.2 ± 1.0 |
| OSO (immediate) | 8.0 ± 0.1 | 1.00 | 451 ± 127 | 1.00 ± 0.00 | 6.9 ± 0.5 |

Code: commit `2ecf6f1` (with uncommitted changes). Experiment: [config/experiments/exp-202610220048.yaml](../../config/experiments/exp-202610220048.yaml). Command: `npm run sim -- exp-202610220048 --seeds 50 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
