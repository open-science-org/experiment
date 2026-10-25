# full-example-deep-field-traditional-vs-osochoice-by-alpha-20261023

**Question:** When agents choose what to publish, how much do they share (β) at each α, and how far do they get?

**Answer:** Best overall: OSO (choice), α = 0. Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money, money to the main level and waste. (8 measures; a clear difference is more than 2.7 standard errors.)

- hardest level: 8.00 against traditional 3.28, clearly better.
- targets solved: 3.73 against traditional 0.56, clearly better.
- bounty value: 1910 against traditional 287, clearly better.
- ROI: 2.72 against traditional 0.30, clearly better.
- knowledge found (bits): 188 against traditional 87, clearly better.
- knowledge per unit of money: 0.26 against traditional 0.09, clearly better.
- money to the main level: 391 against traditional 731, clearly better.
- waste: 0.54 against traditional 0.64, clearly better.

![full-example-deep-field-traditional-vs-osochoice-by-alpha-20261023](figures/compare.svg)

| setting | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | bits per money | cost | waste |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 3.3 ± 4.0 | 0.6 ± 0.8 | 287 ± 401 | 0.30 ± 0.42 | 87 ± 17 | 0.092 ± 0.018 | 731 ± 166 | 0.64 ± 0.04 |
| OSO (choice), α = 0.9 | 6.8 ± 1.6 | 0.8 ± 0.9 | 389 ± 467 | 0.42 ± 0.51 | 97 ± 17 | 0.102 ± 0.019 | 690 ± 207 | 0.64 ± 0.04 |
| OSO (choice), α = 0.8 | 6.9 ± 1.4 | 0.6 ± 0.7 | 307 ± 371 | 0.32 ± 0.39 | 98 ± 15 | 0.103 ± 0.016 | 753 ± 149 | 0.64 ± 0.03 |
| OSO (choice), α = 0.6 | 7.0 ± 1.5 | 0.8 ± 1.0 | 399 ± 497 | 0.42 ± 0.53 | 101 ± 18 | 0.107 ± 0.019 | 738 ± 149 | 0.65 ± 0.03 |
| OSO (choice), α = 0.4 | 7.4 ± 1.0 | 0.8 ± 0.9 | 394 ± 442 | 0.42 ± 0.47 | 106 ± 16 | 0.112 ± 0.017 | 711 ± 188 | 0.65 ± 0.03 |
| OSO (choice), α = 0.2 | 7.8 ± 0.5 | 1.6 ± 1.1 | 804 ± 583 | 0.87 ± 0.66 | 129 ± 20 | 0.138 ± 0.024 | 659 ± 168 | 0.64 ± 0.03 |
| OSO (choice), α = 0 | 8.0 ± 0.0 | 3.7 ± 0.7 | 1910 ± 340 | 2.72 ± 0.84 | 188 ± 13 | 0.263 ± 0.054 | 391 ± 124 | 0.54 ± 0.07 |

**Design** (fixed before the run): compared Traditional, OSO (choice), by α, absorption rate · held the same: the field "the deep-field example" · measure: all of hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money, money to the main level, waste · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Designed in the app on the field "the deep-field example" (spaces/example-deep-field.yaml): Traditional vs OSO (choice), varying α, absorption rate. α and c apply to the OSO (flow-back) settings only.

Values are mean ± standard deviation over runs.

| setting | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | knowledge published (bits) | bits per money | cost | waste | sharing | reach L8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 3.3 ± 4.0 | 0.6 ± 0.8 | 287 ± 401 | 0.30 ± 0.42 | 87 ± 17 | 24 ± 30 | 0.092 ± 0.018 | 731 ± 166 | 0.64 ± 0.04 | 0.00 ± 0.01 | 0.41 |
| OSO (choice), α = 0.9 | 6.8 ± 1.6 | 0.8 ± 0.9 | 389 ± 467 | 0.42 ± 0.51 | 97 ± 17 | 62 ± 26 | 0.102 ± 0.019 | 690 ± 207 | 0.64 ± 0.04 | 0.19 ± 0.06 | 0.58 |
| OSO (choice), α = 0.8 | 6.9 ± 1.4 | 0.6 ± 0.7 | 307 ± 371 | 0.32 ± 0.39 | 98 ± 15 | 64 ± 24 | 0.103 ± 0.016 | 753 ± 149 | 0.64 ± 0.03 | 0.20 ± 0.07 | 0.57 |
| OSO (choice), α = 0.6 | 7.0 ± 1.5 | 0.8 ± 1.0 | 399 ± 497 | 0.42 ± 0.53 | 101 ± 18 | 71 ± 27 | 0.107 ± 0.019 | 738 ± 149 | 0.65 ± 0.03 | 0.22 ± 0.07 | 0.62 |
| OSO (choice), α = 0.4 | 7.4 ± 1.0 | 0.8 ± 0.9 | 394 ± 442 | 0.42 ± 0.47 | 106 ± 16 | 80 ± 24 | 0.112 ± 0.017 | 711 ± 188 | 0.65 ± 0.03 | 0.27 ± 0.08 | 0.62 |
| OSO (choice), α = 0.2 | 7.8 ± 0.5 | 1.6 ± 1.1 | 804 ± 583 | 0.87 ± 0.66 | 129 ± 20 | 115 ± 28 | 0.138 ± 0.024 | 659 ± 168 | 0.64 ± 0.03 | 0.43 ± 0.09 | 0.82 |
| OSO (choice), α = 0 | 8.0 ± 0.0 | 3.7 ± 0.7 | 1910 ± 340 | 2.72 ± 0.84 | 188 ± 13 | 188 ± 13 | 0.263 ± 0.054 | 391 ± 124 | 0.54 ± 0.07 | 0.97 ± 0.02 | 1.00 |

Code: commit `94d7303` (with uncommitted changes). Experiment: [config/experiments/full-example-deep-field-traditional-vs-osochoice-by-alpha-20261023.yaml](../../config/experiments/full-example-deep-field-traditional-vs-osochoice-by-alpha-20261023.yaml). Command: `npm run sim -- full-example-deep-field-traditional-vs-osochoice-by-alpha-20261023 --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
