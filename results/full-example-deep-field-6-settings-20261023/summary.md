# full-example-deep-field-6-settings-20261023

**Question:** On the deep-field example, with every kind of agent and earnings shaping next round's money, which of the six rule settings gets furthest?

**Answer:** Best overall: OSO. Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money and waste. (8 measures; a clear difference is more than 2.7 standard errors.)

- hardest level: 8.00 against traditional 0.00, clearly better.
- targets solved: 3.89 against traditional 0.00, clearly better.
- bounty value: 1992 against traditional 0.00, clearly better.
- ROI: 3.27 against traditional 0.00, clearly better.
- knowledge found (bits): 165 against traditional 66, clearly better.
- knowledge per unit of money: 0.26 against traditional 0.07, clearly better.
- money to the main level: best OSO, 328.
- waste: 0.32 against traditional 0.57, clearly better.

![full-example-deep-field-6-settings-20261023](figures/compare.svg)

| setting | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | bits per money | cost | waste |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 66 ± 9 | 0.070 ± 0.010 | – | 0.57 ± 0.04 |
| OSO (immediate) | 8.0 ± 0.0 | 3.9 ± 0.4 | 1992 ± 191 | 3.27 ± 0.96 | 165 ± 18 | 0.263 ± 0.051 | 328 ± 110 | 0.32 ± 0.06 |
| OSO (choice) | 7.4 ± 1.3 | 2.0 ± 1.5 | 1039 ± 789 | 1.28 ± 1.12 | 129 ± 29 | 0.150 ± 0.049 | 603 ± 194 | 0.51 ± 0.06 |
| Flow-back, finished-only | 0.2 ± 1.1 | 0.0 ± 0.1 | 10 ± 72 | 0.01 ± 0.08 | 67 ± 11 | 0.071 ± 0.012 | 528 ± 153 | 0.58 ± 0.04 |
| No flow-back, immediate | 8.0 ± 0.0 | 4.0 ± 0.3 | 2022 ± 134 | 3.36 ± 0.85 | 165 ± 19 | 0.267 ± 0.044 | 336 ± 105 | 0.33 ± 0.07 |
| No flow-back, choice | 7.5 ± 1.0 | 1.9 ± 1.6 | 998 ± 837 | 1.22 ± 1.13 | 127 ± 31 | 0.146 ± 0.047 | 614 ± 187 | 0.51 ± 0.06 |

**Design** (fixed before the run): compared Traditional, OSO (immediate), OSO (choice), Flow-back, finished-only, No flow-back, immediate, No flow-back, choice · held the same: the field "the deep-field example" · measure: all of hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money, money to the main level, waste · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Designed in the app on the field "the deep-field example" (spaces/example-deep-field.yaml): Traditional vs OSO (immediate) vs OSO (choice) vs Flow-back, finished-only vs No flow-back, immediate vs No flow-back, choice. α and c apply to the OSO (flow-back) settings only.

Values are mean ± standard deviation over runs.

| setting | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | knowledge published (bits) | bits per money | cost | waste | sharing | reach L8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 66 ± 9 | 0 ± 0 | 0.070 ± 0.010 | – | 0.57 ± 0.04 | 0.00 ± 0.00 | 0.00 |
| OSO (immediate) | 8.0 ± 0.0 | 3.9 ± 0.4 | 1992 ± 191 | 3.27 ± 0.96 | 165 ± 18 | 165 ± 18 | 0.263 ± 0.051 | 328 ± 110 | 0.32 ± 0.06 | 1.00 ± 0.00 | 1.00 |
| OSO (choice) | 7.4 ± 1.3 | 2.0 ± 1.5 | 1039 ± 789 | 1.28 ± 1.12 | 129 ± 29 | 106 ± 47 | 0.150 ± 0.049 | 603 ± 194 | 0.51 ± 0.06 | 0.24 ± 0.10 | 0.79 |
| Flow-back, finished-only | 0.2 ± 1.1 | 0.0 ± 0.1 | 10 ± 72 | 0.01 ± 0.08 | 67 ± 11 | 1 ± 5 | 0.071 ± 0.012 | 528 ± 153 | 0.58 ± 0.04 | 0.00 ± 0.00 | 0.02 |
| No flow-back, immediate | 8.0 ± 0.0 | 4.0 ± 0.3 | 2022 ± 134 | 3.36 ± 0.85 | 165 ± 19 | 165 ± 19 | 0.267 ± 0.044 | 336 ± 105 | 0.33 ± 0.07 | 1.00 ± 0.00 | 1.00 |
| No flow-back, choice | 7.5 ± 1.0 | 1.9 ± 1.6 | 998 ± 837 | 1.22 ± 1.13 | 127 ± 31 | 102 ± 47 | 0.146 ± 0.047 | 614 ± 187 | 0.51 ± 0.06 | 0.24 ± 0.09 | 0.78 |

Code: commit `cd9fb92` (with uncommitted changes). Experiment: [config/experiments/full-example-deep-field-6-settings-20261023.yaml](../../config/experiments/full-example-deep-field-6-settings-20261023.yaml). Command: `npm run sim -- full-example-deep-field-6-settings-20261023 --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
