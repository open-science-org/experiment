# full-example-deep-field-6-settings-20261023

**Question:** On the deep-field example, with every kind of agent and earnings shaping next round's money, which of the six rule settings gets furthest?

**Answer:** Best overall: OSO. Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money, money to the main level and waste. (8 measures; a clear difference is more than 2.7 standard errors.)

- hardest level: 8.00 against traditional 3.28, clearly better.
- targets solved: 3.74 against traditional 0.56, clearly better.
- bounty value: 1915 against traditional 287, clearly better.
- ROI: 2.84 against traditional 0.30, clearly better.
- knowledge found (bits): 159 against traditional 87, clearly better.
- knowledge per unit of money: 0.23 against traditional 0.09, clearly better.
- money to the main level: 399 against traditional 731, clearly better.
- waste: 0.42 against traditional 0.64, clearly better.

![full-example-deep-field-6-settings-20261023](figures/compare.svg)

| setting | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | bits per money | cost | waste |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 3.3 ± 4.0 | 0.6 ± 0.8 | 287 ± 401 | 0.30 ± 0.42 | 87 ± 17 | 0.092 ± 0.018 | 731 ± 166 | 0.64 ± 0.04 |
| OSO (immediate) | 8.0 ± 0.0 | 3.7 ± 0.6 | 1915 ± 330 | 2.84 ± 0.97 | 159 ± 15 | 0.227 ± 0.048 | 399 ± 160 | 0.42 ± 0.05 |
| OSO (choice) | 6.9 ± 1.4 | 0.6 ± 0.7 | 307 ± 371 | 0.32 ± 0.39 | 98 ± 15 | 0.103 ± 0.016 | 753 ± 149 | 0.64 ± 0.03 |
| Flow-back, finished-only | 3.4 ± 4.0 | 0.6 ± 0.8 | 297 ± 406 | 0.32 ± 0.44 | 87 ± 17 | 0.092 ± 0.019 | 732 ± 159 | 0.64 ± 0.03 |
| No flow-back, immediate | 8.0 ± 0.0 | 3.7 ± 0.7 | 1915 ± 346 | 2.86 ± 0.95 | 155 ± 16 | 0.225 ± 0.047 | 391 ± 140 | 0.42 ± 0.06 |
| No flow-back, choice | 7.0 ± 1.4 | 0.9 ± 1.0 | 451 ± 516 | 0.48 ± 0.55 | 99 ± 20 | 0.105 ± 0.021 | 666 ± 204 | 0.64 ± 0.03 |

**Design** (fixed before the run): compared Traditional, OSO (immediate), OSO (choice), Flow-back, finished-only, No flow-back, immediate, No flow-back, choice · held the same: the field "the deep-field example" · measure: all of hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money, money to the main level, waste · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Designed in the app on the field "the deep-field example" (spaces/example-deep-field.yaml): Traditional vs OSO (immediate) vs OSO (choice) vs Flow-back, finished-only vs No flow-back, immediate vs No flow-back, choice. α and c apply to the OSO (flow-back) settings only.

Values are mean ± standard deviation over runs.

| setting | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | knowledge published (bits) | bits per money | cost | waste | sharing | reach L8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 3.3 ± 4.0 | 0.6 ± 0.8 | 287 ± 401 | 0.30 ± 0.42 | 87 ± 17 | 24 ± 30 | 0.092 ± 0.018 | 731 ± 166 | 0.64 ± 0.04 | 0.00 ± 0.01 | 0.41 |
| OSO (immediate) | 8.0 ± 0.0 | 3.7 ± 0.6 | 1915 ± 330 | 2.84 ± 0.97 | 159 ± 15 | 159 ± 15 | 0.227 ± 0.048 | 399 ± 160 | 0.42 ± 0.05 | 1.00 ± 0.00 | 1.00 |
| OSO (choice) | 6.9 ± 1.4 | 0.6 ± 0.7 | 307 ± 371 | 0.32 ± 0.39 | 98 ± 15 | 64 ± 24 | 0.103 ± 0.016 | 753 ± 149 | 0.64 ± 0.03 | 0.20 ± 0.07 | 0.57 |
| Flow-back, finished-only | 3.4 ± 4.0 | 0.6 ± 0.8 | 297 ± 406 | 0.32 ± 0.44 | 87 ± 17 | 25 ± 32 | 0.092 ± 0.019 | 732 ± 159 | 0.64 ± 0.03 | 0.00 ± 0.00 | 0.42 |
| No flow-back, immediate | 8.0 ± 0.0 | 3.7 ± 0.7 | 1915 ± 346 | 2.86 ± 0.95 | 155 ± 16 | 155 ± 16 | 0.225 ± 0.047 | 391 ± 140 | 0.42 ± 0.06 | 1.00 ± 0.00 | 1.00 |
| No flow-back, choice | 7.0 ± 1.4 | 0.9 ± 1.0 | 451 ± 516 | 0.48 ± 0.55 | 99 ± 20 | 67 ± 27 | 0.105 ± 0.021 | 666 ± 204 | 0.64 ± 0.03 | 0.20 ± 0.07 | 0.62 |

Code: commit `94d7303` (with uncommitted changes). Experiment: [config/experiments/full-example-deep-field-6-settings-20261023.yaml](../../config/experiments/full-example-deep-field-6-settings-20261023.yaml). Command: `npm run sim -- full-example-deep-field-6-settings-20261023 --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
