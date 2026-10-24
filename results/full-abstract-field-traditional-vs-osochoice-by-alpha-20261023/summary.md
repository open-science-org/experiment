# full-abstract-field-traditional-vs-osochoice-by-alpha-20261023

**Question:** When agents choose what to publish, how much do they share (β) at each α, and how far do they get?

**Answer:** Best overall: OSO (choice), α = 0. Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, money to the main level and waste. (6 measures; a clear difference is more than 2.6 standard errors.)

- hardest level: 8.00 against traditional 3.68, clearly better.
- targets solved: 3.69 against traditional 0.67, clearly better.
- bounty value: 1889 against traditional 343, clearly better.
- ROI: 2.48 against traditional 0.36, clearly better.
- money to the main level: 410 against traditional 686, clearly better.
- waste: 0.58 against traditional 0.66, clearly better.

![full-abstract-field-traditional-vs-osochoice-by-alpha-20261023](figures/compare.svg)

| setting | frontier | targets solved | value gained | ROI (value per spend) | cost | waste |
| --- | --- | --- | --- | --- | --- | --- |
| Traditional | 3.7 ± 4.0 | 0.7 ± 0.8 | 343 ± 431 | 0.36 ± 0.45 | 686 ± 163 | 0.66 ± 0.04 |
| OSO (choice), α = 0.9 | 7.1 ± 1.4 | 0.9 ± 0.9 | 451 ± 473 | 0.48 ± 0.51 | 650 ± 191 | 0.66 ± 0.04 |
| OSO (choice), α = 0.8 | 7.0 ± 1.6 | 1.1 ± 1.2 | 548 ± 601 | 0.59 ± 0.67 | 690 ± 182 | 0.65 ± 0.03 |
| OSO (choice), α = 0.6 | 7.4 ± 1.1 | 1.0 ± 1.0 | 497 ± 517 | 0.53 ± 0.57 | 701 ± 163 | 0.66 ± 0.04 |
| OSO (choice), α = 0.4 | 7.7 ± 0.7 | 1.1 ± 1.0 | 568 ± 519 | 0.60 ± 0.56 | 702 ± 172 | 0.66 ± 0.04 |
| OSO (choice), α = 0.2 | 7.8 ± 0.4 | 1.7 ± 1.2 | 881 ± 600 | 0.96 ± 0.69 | 615 ± 189 | 0.66 ± 0.04 |
| OSO (choice), α = 0 | 8.0 ± 0.0 | 3.7 ± 0.6 | 1889 ± 306 | 2.48 ± 0.72 | 410 ± 122 | 0.58 ± 0.07 |

**Design** (fixed before the run): compared Traditional, OSO (choice), by α, absorption rate · held the same: the field "An abstract research field" · measure: all of hardest level, targets solved, bounty value, ROI, money to the main level, waste · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Designed in the app on the field "An abstract research field" (spaces/abstract-field.yaml): Traditional vs OSO (choice), varying α, absorption rate. α and c apply to the OSO (flow-back) settings only.

Values are mean ± standard deviation over runs.

| setting | frontier | targets solved | value gained | ROI (value per spend) | cost | waste | sharing | reach L8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 3.7 ± 4.0 | 0.7 ± 0.8 | 343 ± 431 | 0.36 ± 0.45 | 686 ± 163 | 0.66 ± 0.04 | 0.00 ± 0.00 | 0.46 |
| OSO (choice), α = 0.9 | 7.1 ± 1.4 | 0.9 ± 0.9 | 451 ± 473 | 0.48 ± 0.51 | 650 ± 191 | 0.66 ± 0.04 | 0.22 ± 0.08 | 0.61 |
| OSO (choice), α = 0.8 | 7.0 ± 1.6 | 1.1 ± 1.2 | 548 ± 601 | 0.59 ± 0.67 | 690 ± 182 | 0.65 ± 0.03 | 0.22 ± 0.08 | 0.65 |
| OSO (choice), α = 0.6 | 7.4 ± 1.1 | 1.0 ± 1.0 | 497 ± 517 | 0.53 ± 0.57 | 701 ± 163 | 0.66 ± 0.04 | 0.24 ± 0.08 | 0.70 |
| OSO (choice), α = 0.4 | 7.7 ± 0.7 | 1.1 ± 1.0 | 568 ± 519 | 0.60 ± 0.56 | 702 ± 172 | 0.66 ± 0.04 | 0.30 ± 0.09 | 0.76 |
| OSO (choice), α = 0.2 | 7.8 ± 0.4 | 1.7 ± 1.2 | 881 ± 600 | 0.96 ± 0.69 | 615 ± 189 | 0.66 ± 0.04 | 0.45 ± 0.10 | 0.85 |
| OSO (choice), α = 0 | 8.0 ± 0.0 | 3.7 ± 0.6 | 1889 ± 306 | 2.48 ± 0.72 | 410 ± 122 | 0.58 ± 0.07 | 0.97 ± 0.02 | 1.00 |

Code: commit `5530bf2` (with uncommitted changes). Experiment: [config/experiments/full-abstract-field-traditional-vs-osochoice-by-alpha-20261023.yaml](../../config/experiments/full-abstract-field-traditional-vs-osochoice-by-alpha-20261023.yaml). Command: `npm run sim -- full-abstract-field-traditional-vs-osochoice-by-alpha-20261023 --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
