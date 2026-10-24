# full-drug-discovery-6-settings-20261023

**Question:** On the drug discovery preset, with every kind of agent and money following earnings, which of the six rule settings gets furthest?

**Answer:** Best overall: OSO. Against traditional, clearly better on hardest level, targets solved, bounty value, ROI and money to the main level; clearly worse on waste. (6 measures; a clear difference is more than 2.6 standard errors.)

- hardest level: 5.99 against traditional 3.48, clearly better.
- targets solved: 2.68 against traditional 0.83, clearly better.
- bounty value: 1302 against traditional 403, clearly better.
- ROI: 1.40 against traditional 0.30, clearly better.
- money to the main level: 627 against traditional 1040, clearly better.
- waste: 0.87 against traditional 0.61, clearly worse.

![full-drug-discovery-6-settings-20261023](figures/compare.svg)

| setting | frontier | targets solved | value gained | ROI (value per spend) | cost | waste |
| --- | --- | --- | --- | --- | --- | --- |
| Traditional | 3.5 ± 3.0 | 0.8 ± 0.8 | 403 ± 409 | 0.30 ± 0.32 | 1040 ± 266 | 0.61 ± 0.12 |
| OSO (immediate) | 6.0 ± 0.1 | 2.7 ± 0.7 | 1302 ± 323 | 1.40 ± 0.65 | 627 ± 267 | 0.87 ± 0.06 |
| OSO (choice) | 5.5 ± 0.8 | 1.0 ± 1.0 | 467 ± 473 | 0.34 ± 0.36 | 961 ± 279 | 0.69 ± 0.11 |
| Flow-back, finished-only | 3.2 ± 3.0 | 0.8 ± 0.9 | 413 ± 460 | 0.31 ± 0.36 | 984 ± 246 | 0.62 ± 0.13 |
| No flow-back, immediate | 6.0 ± 0.1 | 2.5 ± 0.8 | 1230 ± 400 | 1.23 ± 0.59 | 625 ± 259 | 0.85 ± 0.07 |
| No flow-back, choice | 5.5 ± 0.9 | 0.9 ± 1.0 | 447 ± 472 | 0.34 ± 0.38 | 923 ± 268 | 0.66 ± 0.10 |

**Design** (fixed before the run): compared Traditional, OSO (immediate), OSO (choice), Flow-back, finished-only, No flow-back, immediate, No flow-back, choice · held the same: the field "Early-stage drug discovery" · measure: all of hardest level, targets solved, bounty value, ROI, money to the main level, waste · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Designed in the app on the field "Early-stage drug discovery" (spaces/drug-discovery.yaml): Traditional vs OSO (immediate) vs OSO (choice) vs Flow-back, finished-only vs No flow-back, immediate vs No flow-back, choice. α and c apply to the OSO (flow-back) settings only.

Values are mean ± standard deviation over runs.

| setting | frontier | targets solved | value gained | ROI (value per spend) | cost | waste | sharing | reach L6 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 3.5 ± 3.0 | 0.8 ± 0.8 | 403 ± 409 | 0.30 ± 0.32 | 1040 ± 266 | 0.61 ± 0.12 | 0.00 ± 0.00 | 0.58 |
| OSO (immediate) | 6.0 ± 0.1 | 2.7 ± 0.7 | 1302 ± 323 | 1.40 ± 0.65 | 627 ± 267 | 0.87 ± 0.06 | 1.00 ± 0.00 | 0.99 |
| OSO (choice) | 5.5 ± 0.8 | 1.0 ± 1.0 | 467 ± 473 | 0.34 ± 0.36 | 961 ± 279 | 0.69 ± 0.11 | 0.41 ± 0.13 | 0.64 |
| Flow-back, finished-only | 3.2 ± 3.0 | 0.8 ± 0.9 | 413 ± 460 | 0.31 ± 0.36 | 984 ± 246 | 0.62 ± 0.13 | 0.00 ± 0.01 | 0.54 |
| No flow-back, immediate | 6.0 ± 0.1 | 2.5 ± 0.8 | 1230 ± 400 | 1.23 ± 0.59 | 625 ± 259 | 0.85 ± 0.07 | 1.00 ± 0.00 | 0.99 |
| No flow-back, choice | 5.5 ± 0.9 | 0.9 ± 1.0 | 447 ± 472 | 0.34 ± 0.38 | 923 ± 268 | 0.66 ± 0.10 | 0.41 ± 0.13 | 0.68 |

Code: commit `a58200a` (with uncommitted changes). Experiment: [config/experiments/full-drug-discovery-6-settings-20261023.yaml](../../config/experiments/full-drug-discovery-6-settings-20261023.yaml). Command: `npm run sim -- full-drug-discovery-6-settings-20261023 --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
