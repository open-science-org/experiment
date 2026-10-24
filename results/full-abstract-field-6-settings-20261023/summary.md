# full-abstract-field-6-settings-20261023

**Question:** On the abstract field preset, with every kind of agent and money following earnings, which of the six rule settings gets furthest?

**Answer:** Best overall: OSO. Against traditional, clearly better on hardest level, targets solved, bounty value, ROI and money to the main level; clearly worse on waste. (6 measures; a clear difference is more than 2.6 standard errors.)

- hardest level: 8.00 against traditional 3.68, clearly better.
- targets solved: 3.63 against traditional 0.67, clearly better.
- bounty value: 1859 against traditional 343, clearly better.
- ROI: 2.70 against traditional 0.36, clearly better.
- money to the main level: 401 against traditional 686, clearly better.
- waste: 0.84 against traditional 0.54, clearly worse.

![full-abstract-field-6-settings-20261023](figures/compare.svg)

| setting | frontier | targets solved | value gained | ROI (value per spend) | cost | waste |
| --- | --- | --- | --- | --- | --- | --- |
| Traditional | 3.7 ± 4.0 | 0.7 ± 0.8 | 343 ± 431 | 0.36 ± 0.45 | 686 ± 163 | 0.54 ± 0.11 |
| OSO (immediate) | 8.0 ± 0.0 | 3.6 ± 0.7 | 1859 ± 376 | 2.70 ± 1.00 | 401 ± 144 | 0.84 ± 0.05 |
| OSO (choice) | 7.0 ± 1.6 | 1.1 ± 1.2 | 548 ± 601 | 0.59 ± 0.67 | 690 ± 182 | 0.64 ± 0.10 |
| Flow-back, finished-only | 4.2 ± 4.0 | 0.8 ± 0.9 | 420 ± 485 | 0.45 ± 0.53 | 700 ± 199 | 0.55 ± 0.11 |
| No flow-back, immediate | 8.0 ± 0.0 | 3.7 ± 0.6 | 1889 ± 323 | 2.75 ± 0.95 | 360 ± 153 | 0.82 ± 0.06 |
| No flow-back, choice | 7.3 ± 1.1 | 0.9 ± 0.9 | 486 ± 479 | 0.53 ± 0.58 | 650 ± 188 | 0.62 ± 0.08 |

**Design** (fixed before the run): compared Traditional, OSO (immediate), OSO (choice), Flow-back, finished-only, No flow-back, immediate, No flow-back, choice · held the same: the field "An abstract research field" · measure: all of hardest level, targets solved, bounty value, ROI, money to the main level, waste · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Designed in the app on the field "An abstract research field" (spaces/abstract-field.yaml): Traditional vs OSO (immediate) vs OSO (choice) vs Flow-back, finished-only vs No flow-back, immediate vs No flow-back, choice. α and c apply to the OSO (flow-back) settings only.

Values are mean ± standard deviation over runs.

| setting | frontier | targets solved | value gained | ROI (value per spend) | cost | waste | sharing | reach L8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 3.7 ± 4.0 | 0.7 ± 0.8 | 343 ± 431 | 0.36 ± 0.45 | 686 ± 163 | 0.54 ± 0.11 | 0.00 ± 0.00 | 0.46 |
| OSO (immediate) | 8.0 ± 0.0 | 3.6 ± 0.7 | 1859 ± 376 | 2.70 ± 1.00 | 401 ± 144 | 0.84 ± 0.05 | 1.00 ± 0.00 | 1.00 |
| OSO (choice) | 7.0 ± 1.6 | 1.1 ± 1.2 | 548 ± 601 | 0.59 ± 0.67 | 690 ± 182 | 0.64 ± 0.10 | 0.22 ± 0.08 | 0.65 |
| Flow-back, finished-only | 4.2 ± 4.0 | 0.8 ± 0.9 | 420 ± 485 | 0.45 ± 0.53 | 700 ± 199 | 0.55 ± 0.11 | 0.00 ± 0.00 | 0.53 |
| No flow-back, immediate | 8.0 ± 0.0 | 3.7 ± 0.6 | 1889 ± 323 | 2.75 ± 0.95 | 360 ± 153 | 0.82 ± 0.06 | 1.00 ± 0.00 | 1.00 |
| No flow-back, choice | 7.3 ± 1.1 | 0.9 ± 0.9 | 486 ± 479 | 0.53 ± 0.58 | 650 ± 188 | 0.62 ± 0.08 | 0.22 ± 0.08 | 0.65 |

Code: commit `a58200a` (with uncommitted changes). Experiment: [config/experiments/full-abstract-field-6-settings-20261023.yaml](../../config/experiments/full-abstract-field-6-settings-20261023.yaml). Command: `npm run sim -- full-abstract-field-6-settings-20261023 --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
