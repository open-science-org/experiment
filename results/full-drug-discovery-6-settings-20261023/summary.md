# full-drug-discovery-6-settings-20261023

**Question:** On the drug discovery preset, with every kind of agent and money following earnings, which of the six rule settings gets furthest?

**Answer:** Best overall: OSO. Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, money to the main level and waste. (6 measures; a clear difference is more than 2.6 standard errors.)

- hardest level: 6.00 against traditional 2.88, clearly better.
- targets solved: 2.75 against traditional 0.65, clearly better.
- bounty value: 1337 against traditional 316, clearly better.
- ROI: 1.38 against traditional 0.23, clearly better.
- money to the main level: 654 against traditional 1039, clearly better.
- waste: 0.52 against traditional 0.75, clearly better.

![full-drug-discovery-6-settings-20261023](figures/compare.svg)

| setting | frontier | targets solved | value gained | ROI (value per spend) | cost | waste |
| --- | --- | --- | --- | --- | --- | --- |
| Traditional | 2.9 ± 3.0 | 0.7 ± 0.8 | 316 ± 387 | 0.23 ± 0.30 | 1039 ± 270 | 0.75 ± 0.03 |
| OSO (immediate) | 6.0 ± 0.0 | 2.8 ± 0.6 | 1337 ± 304 | 1.38 ± 0.56 | 654 ± 266 | 0.52 ± 0.04 |
| OSO (choice) | 5.4 ± 0.9 | 0.9 ± 1.0 | 418 ± 469 | 0.32 ± 0.37 | 988 ± 272 | 0.72 ± 0.03 |
| Flow-back, finished-only | 2.6 ± 3.0 | 0.6 ± 0.7 | 277 ± 361 | 0.20 ± 0.26 | 1046 ± 244 | 0.74 ± 0.03 |
| No flow-back, immediate | 6.0 ± 0.1 | 2.6 ± 0.8 | 1244 ± 380 | 1.26 ± 0.62 | 610 ± 246 | 0.52 ± 0.04 |
| No flow-back, choice | 5.2 ± 1.1 | 0.7 ± 0.8 | 355 ± 402 | 0.26 ± 0.30 | 1031 ± 284 | 0.73 ± 0.03 |

**Design** (fixed before the run): compared Traditional, OSO (immediate), OSO (choice), Flow-back, finished-only, No flow-back, immediate, No flow-back, choice · held the same: the field "Early-stage drug discovery" · measure: all of hardest level, targets solved, bounty value, ROI, money to the main level, waste · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Designed in the app on the field "Early-stage drug discovery" (spaces/drug-discovery.yaml): Traditional vs OSO (immediate) vs OSO (choice) vs Flow-back, finished-only vs No flow-back, immediate vs No flow-back, choice. α and c apply to the OSO (flow-back) settings only.

Values are mean ± standard deviation over runs.

| setting | frontier | targets solved | value gained | ROI (value per spend) | cost | waste | sharing | reach L6 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 2.9 ± 3.0 | 0.7 ± 0.8 | 316 ± 387 | 0.23 ± 0.30 | 1039 ± 270 | 0.75 ± 0.03 | 0.00 ± 0.00 | 0.48 |
| OSO (immediate) | 6.0 ± 0.0 | 2.8 ± 0.6 | 1337 ± 304 | 1.38 ± 0.56 | 654 ± 266 | 0.52 ± 0.04 | 1.00 ± 0.00 | 1.00 |
| OSO (choice) | 5.4 ± 0.9 | 0.9 ± 1.0 | 418 ± 469 | 0.32 ± 0.37 | 988 ± 272 | 0.72 ± 0.03 | 0.38 ± 0.11 | 0.62 |
| Flow-back, finished-only | 2.6 ± 3.0 | 0.6 ± 0.7 | 277 ± 361 | 0.20 ± 0.26 | 1046 ± 244 | 0.74 ± 0.03 | 0.00 ± 0.00 | 0.43 |
| No flow-back, immediate | 6.0 ± 0.1 | 2.6 ± 0.8 | 1244 ± 380 | 1.26 ± 0.62 | 610 ± 246 | 0.52 ± 0.04 | 1.00 ± 0.00 | 0.98 |
| No flow-back, choice | 5.2 ± 1.1 | 0.7 ± 0.8 | 355 ± 402 | 0.26 ± 0.30 | 1031 ± 284 | 0.73 ± 0.03 | 0.37 ± 0.12 | 0.58 |

Code: commit `04dc47f`. Experiment: [config/experiments/full-drug-discovery-6-settings-20261023.yaml](../../config/experiments/full-drug-discovery-6-settings-20261023.yaml). Command: `npm run sim -- full-drug-discovery-6-settings-20261023 --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
