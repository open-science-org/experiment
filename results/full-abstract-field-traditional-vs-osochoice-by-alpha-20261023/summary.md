# full-abstract-field-traditional-vs-osochoice-by-alpha-20261023

**Question:** When agents choose what to publish, how much do they share (β) at each α, and how far do they get?

**Answer:** Best overall: OSO (choice), α = 0. Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, money to the main level and waste. (6 measures; a clear difference is more than 2.6 standard errors.)

- hardest level: 8.00 against traditional 3.28, clearly better.
- targets solved: 3.73 against traditional 0.56, clearly better.
- bounty value: 1910 against traditional 287, clearly better.
- ROI: 2.72 against traditional 0.30, clearly better.
- money to the main level: 391 against traditional 731, clearly better.
- waste: 0.54 against traditional 0.64, clearly better.

![full-abstract-field-traditional-vs-osochoice-by-alpha-20261023](figures/compare.svg)

| setting | frontier | targets solved | value gained | ROI (value per spend) | cost | waste |
| --- | --- | --- | --- | --- | --- | --- |
| Traditional | 3.3 ± 4.0 | 0.6 ± 0.8 | 287 ± 401 | 0.30 ± 0.42 | 731 ± 166 | 0.64 ± 0.04 |
| OSO (choice), α = 0.9 | 6.8 ± 1.6 | 0.8 ± 0.9 | 389 ± 467 | 0.42 ± 0.51 | 690 ± 207 | 0.64 ± 0.04 |
| OSO (choice), α = 0.8 | 6.9 ± 1.4 | 0.6 ± 0.7 | 307 ± 371 | 0.32 ± 0.39 | 753 ± 149 | 0.64 ± 0.03 |
| OSO (choice), α = 0.6 | 7.0 ± 1.5 | 0.8 ± 1.0 | 399 ± 497 | 0.42 ± 0.53 | 738 ± 149 | 0.65 ± 0.03 |
| OSO (choice), α = 0.4 | 7.4 ± 1.0 | 0.8 ± 0.9 | 394 ± 442 | 0.42 ± 0.47 | 711 ± 188 | 0.65 ± 0.03 |
| OSO (choice), α = 0.2 | 7.8 ± 0.5 | 1.6 ± 1.1 | 804 ± 583 | 0.87 ± 0.66 | 659 ± 168 | 0.64 ± 0.03 |
| OSO (choice), α = 0 | 8.0 ± 0.0 | 3.7 ± 0.7 | 1910 ± 340 | 2.72 ± 0.84 | 391 ± 124 | 0.54 ± 0.07 |

**Design** (fixed before the run): compared Traditional, OSO (choice), by α, absorption rate · held the same: the field "An abstract research field" · measure: all of hardest level, targets solved, bounty value, ROI, money to the main level, waste · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Designed in the app on the field "An abstract research field" (spaces/abstract-field.yaml): Traditional vs OSO (choice), varying α, absorption rate. α and c apply to the OSO (flow-back) settings only.

Values are mean ± standard deviation over runs.

| setting | frontier | targets solved | value gained | ROI (value per spend) | cost | waste | sharing | reach L8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 3.3 ± 4.0 | 0.6 ± 0.8 | 287 ± 401 | 0.30 ± 0.42 | 731 ± 166 | 0.64 ± 0.04 | 0.00 ± 0.01 | 0.41 |
| OSO (choice), α = 0.9 | 6.8 ± 1.6 | 0.8 ± 0.9 | 389 ± 467 | 0.42 ± 0.51 | 690 ± 207 | 0.64 ± 0.04 | 0.19 ± 0.06 | 0.58 |
| OSO (choice), α = 0.8 | 6.9 ± 1.4 | 0.6 ± 0.7 | 307 ± 371 | 0.32 ± 0.39 | 753 ± 149 | 0.64 ± 0.03 | 0.20 ± 0.07 | 0.57 |
| OSO (choice), α = 0.6 | 7.0 ± 1.5 | 0.8 ± 1.0 | 399 ± 497 | 0.42 ± 0.53 | 738 ± 149 | 0.65 ± 0.03 | 0.22 ± 0.07 | 0.62 |
| OSO (choice), α = 0.4 | 7.4 ± 1.0 | 0.8 ± 0.9 | 394 ± 442 | 0.42 ± 0.47 | 711 ± 188 | 0.65 ± 0.03 | 0.27 ± 0.08 | 0.62 |
| OSO (choice), α = 0.2 | 7.8 ± 0.5 | 1.6 ± 1.1 | 804 ± 583 | 0.87 ± 0.66 | 659 ± 168 | 0.64 ± 0.03 | 0.43 ± 0.09 | 0.82 |
| OSO (choice), α = 0 | 8.0 ± 0.0 | 3.7 ± 0.7 | 1910 ± 340 | 2.72 ± 0.84 | 391 ± 124 | 0.54 ± 0.07 | 0.97 ± 0.02 | 1.00 |

Code: commit `04dc47f`. Experiment: [config/experiments/full-abstract-field-traditional-vs-osochoice-by-alpha-20261023.yaml](../../config/experiments/full-abstract-field-traditional-vs-osochoice-by-alpha-20261023.yaml). Command: `npm run sim -- full-abstract-field-traditional-vs-osochoice-by-alpha-20261023 --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
