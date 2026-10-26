# full-example-deep-field-6-settings-20261023

**Question:** On the deep-field example, with every kind of agent and earnings shaping next round's money, which of the six rule settings gets furthest?

**Answer:** Best overall: OSO. Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money and waste; no clear difference on money to the main level. (8 measures; a clear difference is more than 2.7 standard errors.)

- hardest level: 8.00 against traditional 0.08, clearly better.
- targets solved: 3.89 against traditional 0.01, clearly better.
- bounty value: 1992 against traditional 5.12, clearly better.
- ROI: 3.27 against traditional 0.01, clearly better.
- knowledge found (bits): 165 against traditional 67, clearly better.
- knowledge per unit of money: 0.26 against traditional 0.07, clearly better.
- money to the main level: 328 against traditional 636, no clear difference.
- waste: 0.32 against traditional 0.57, clearly better.

![full-example-deep-field-6-settings-20261023](figures/compare.svg)

| setting | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | bits per money | cost | waste |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 0.1 ± 0.8 | 0.0 ± 0.1 | 5 ± 51 | 0.01 ± 0.05 | 67 ± 11 | 0.071 ± 0.011 | 636 ± 0 | 0.57 ± 0.04 |
| OSO (immediate) | 8.0 ± 0.0 | 3.9 ± 0.4 | 1992 ± 191 | 3.27 ± 0.96 | 165 ± 18 | 0.263 ± 0.051 | 328 ± 110 | 0.32 ± 0.06 |
| OSO (choice) | 7.5 ± 1.3 | 1.9 ± 1.6 | 988 ± 840 | 1.23 ± 1.17 | 128 ± 27 | 0.148 ± 0.047 | 618 ± 185 | 0.51 ± 0.07 |
| Flow-back, finished-only | 0.1 ± 0.8 | 0.0 ± 0.1 | 5 ± 51 | 0.01 ± 0.05 | 67 ± 10 | 0.071 ± 0.010 | 420 ± 0 | 0.58 ± 0.04 |
| No flow-back, immediate | 8.0 ± 0.0 | 4.0 ± 0.3 | 2022 ± 134 | 3.36 ± 0.85 | 165 ± 19 | 0.267 ± 0.044 | 336 ± 105 | 0.33 ± 0.07 |
| No flow-back, choice | 7.4 ± 1.1 | 1.8 ± 1.7 | 911 ± 847 | 1.08 ± 1.09 | 126 ± 31 | 0.141 ± 0.045 | 625 ± 211 | 0.52 ± 0.06 |

**Design** (fixed before the run): compared Traditional, OSO (immediate), OSO (choice), Flow-back, finished-only, No flow-back, immediate, No flow-back, choice · held the same: the field "the deep-field example" · measure: all of hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money, money to the main level, waste · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Designed in the app on the field "the deep-field example" (spaces/example-deep-field.yaml): Traditional vs OSO (immediate) vs OSO (choice) vs Flow-back, finished-only vs No flow-back, immediate vs No flow-back, choice. α and c apply to the OSO (flow-back) settings only.

Values are mean ± standard deviation over runs.

| setting | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | knowledge published (bits) | bits per money | cost | waste | sharing | reach L8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 0.1 ± 0.8 | 0.0 ± 0.1 | 5 ± 51 | 0.01 ± 0.05 | 67 ± 11 | 0 ± 3 | 0.071 ± 0.011 | 636 ± 0 | 0.57 ± 0.04 | 0.00 ± 0.00 | 0.01 |
| OSO (immediate) | 8.0 ± 0.0 | 3.9 ± 0.4 | 1992 ± 191 | 3.27 ± 0.96 | 165 ± 18 | 165 ± 18 | 0.263 ± 0.051 | 328 ± 110 | 0.32 ± 0.06 | 1.00 ± 0.00 | 1.00 |
| OSO (choice) | 7.5 ± 1.3 | 1.9 ± 1.6 | 988 ± 840 | 1.23 ± 1.17 | 128 ± 27 | 106 ± 43 | 0.148 ± 0.047 | 618 ± 185 | 0.51 ± 0.07 | 0.24 ± 0.09 | 0.76 |
| Flow-back, finished-only | 0.1 ± 0.8 | 0.0 ± 0.1 | 5 ± 51 | 0.01 ± 0.05 | 67 ± 10 | 0 ± 2 | 0.071 ± 0.010 | 420 ± 0 | 0.58 ± 0.04 | 0.00 ± 0.00 | 0.01 |
| No flow-back, immediate | 8.0 ± 0.0 | 4.0 ± 0.3 | 2022 ± 134 | 3.36 ± 0.85 | 165 ± 19 | 165 ± 19 | 0.267 ± 0.044 | 336 ± 105 | 0.33 ± 0.07 | 1.00 ± 0.00 | 1.00 |
| No flow-back, choice | 7.4 ± 1.1 | 1.8 ± 1.7 | 911 ± 847 | 1.08 ± 1.09 | 126 ± 31 | 100 ± 46 | 0.141 ± 0.045 | 625 ± 211 | 0.52 ± 0.06 | 0.23 ± 0.08 | 0.71 |

Code: commit `dc540e2`. Experiment: [config/experiments/full-example-deep-field-6-settings-20261023.yaml](../../config/experiments/full-example-deep-field-6-settings-20261023.yaml). Command: `npm run sim -- full-example-deep-field-6-settings-20261023 --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
