# For the same money, does OSO get further than traditional research on this topic?

**Question:** For the same money, does OSO get further than traditional research on this topic?

**Answer:** Best: OSO, 6.0. Best traditional: Traditional, 2.6. Clear difference.

![For the same money, does OSO get further than traditional research on this topic?](figures/compare.svg)

| setting | frontier | reach L5 | cost | ROI (value per spend) |
| --- | --- | --- | --- | --- |
| Traditional | 2.6 ± 3.0 | 0.44 | 854 ± 229 | 0.26 ± 0.39 |
| OSO (immediate) | 6.0 ± 0.2 | 1.00 | 230 ± 99 | 1.72 ± 0.78 |

**Design** (fixed before the run): compared Traditional, OSO (immediate) · held the same: the field "Early-stage drug discovery" · measure: hardest level published, higher is better · 50 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Designed in the app on the field "Early-stage drug discovery" (spaces/drug-discovery.yaml): Traditional vs OSO (immediate). α and c apply to the OSO (flow-back) settings only.

Values are mean ± standard deviation over runs.

| setting | frontier | reach L5 | cost | sharing | targets solved | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- | --- |
| Traditional | 2.6 ± 3.0 | 0.44 | 854 ± 229 | 0.00 ± 0.00 | 0.6 ± 0.8 | 0.26 ± 0.39 |
| OSO (immediate) | 6.0 ± 0.2 | 1.00 | 230 ± 99 | 1.00 ± 0.00 | 2.7 ± 0.8 | 1.72 ± 0.78 |

Code: commit `ead6740` (with uncommitted changes). Experiment: [config/experiments/exp-202610220206.yaml](../../config/experiments/exp-202610220206.yaml). Command: `npm run sim -- exp-202610220206 --seeds 50 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
