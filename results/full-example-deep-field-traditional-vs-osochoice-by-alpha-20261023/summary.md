# full-example-deep-field-traditional-vs-osochoice-by-alpha-20261023

**Question:** When agents choose what to publish, how much do they share (β) at each α, and how far do they get?

**Answer:** Best overall: OSO (choice), α = 0. Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money and waste; no clear difference on money to the main level. (8 measures; a clear difference is more than 2.7 standard errors.)

- hardest level: 8.00 against traditional 0.08, clearly better.
- targets solved: 3.25 against traditional 0.01, clearly better.
- bounty value: 1664 against traditional 5.12, clearly better.
- ROI: 2.15 against traditional 0.01, clearly better.
- knowledge found (bits): 181 against traditional 67, clearly better.
- knowledge per unit of money: 0.23 against traditional 0.07, clearly better.
- money to the main level: 402 against traditional 636, no clear difference.
- waste: 0.48 against traditional 0.57, clearly better.

![full-example-deep-field-traditional-vs-osochoice-by-alpha-20261023](figures/compare.svg)

| setting | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | bits per money | cost | waste |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 0.1 ± 0.8 | 0.0 ± 0.1 | 5 ± 51 | 0.01 ± 0.05 | 67 ± 11 | 0.071 ± 0.011 | 636 ± 0 | 0.57 ± 0.04 |
| OSO (choice), α = 0.9 | 7.4 ± 1.1 | 1.8 ± 1.7 | 911 ± 850 | 1.16 ± 1.21 | 128 ± 28 | 0.149 ± 0.051 | 596 ± 214 | 0.51 ± 0.06 |
| OSO (choice), α = 0.8 | 7.5 ± 1.3 | 1.9 ± 1.6 | 988 ± 840 | 1.23 ± 1.17 | 128 ± 27 | 0.148 ± 0.047 | 618 ± 185 | 0.51 ± 0.07 |
| OSO (choice), α = 0.6 | 7.7 ± 0.9 | 2.1 ± 1.6 | 1065 ± 803 | 1.29 ± 1.09 | 135 ± 27 | 0.155 ± 0.045 | 636 ± 183 | 0.52 ± 0.06 |
| OSO (choice), α = 0.4 | 7.9 ± 0.5 | 2.5 ± 1.4 | 1270 ± 718 | 1.52 ± 1.00 | 146 ± 25 | 0.168 ± 0.041 | 578 ± 202 | 0.54 ± 0.05 |
| OSO (choice), α = 0.2 | 8.0 ± 0.2 | 3.0 ± 1.3 | 1536 ± 655 | 2.00 ± 1.12 | 155 ± 19 | 0.191 ± 0.049 | 537 ± 186 | 0.53 ± 0.05 |
| OSO (choice), α = 0 | 8.0 ± 0.0 | 3.3 ± 1.1 | 1664 ± 546 | 2.15 ± 0.94 | 181 ± 15 | 0.227 ± 0.050 | 402 ± 163 | 0.48 ± 0.07 |

**Design** (fixed before the run): compared Traditional, OSO (choice), by α, absorption rate · held the same: the field "the deep-field example" · measure: all of hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money, money to the main level, waste · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Designed in the app on the field "the deep-field example" (spaces/example-deep-field.yaml): Traditional vs OSO (choice), varying α, absorption rate. α and c apply to the OSO (flow-back) settings only.

Values are mean ± standard deviation over runs.

| setting | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | knowledge published (bits) | bits per money | cost | waste | sharing | reach L8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 0.1 ± 0.8 | 0.0 ± 0.1 | 5 ± 51 | 0.01 ± 0.05 | 67 ± 11 | 0 ± 3 | 0.071 ± 0.011 | 636 ± 0 | 0.57 ± 0.04 | 0.00 ± 0.00 | 0.01 |
| OSO (choice), α = 0.9 | 7.4 ± 1.1 | 1.8 ± 1.7 | 911 ± 850 | 1.16 ± 1.21 | 128 ± 28 | 103 ± 45 | 0.149 ± 0.051 | 596 ± 214 | 0.51 ± 0.06 | 0.24 ± 0.08 | 0.74 |
| OSO (choice), α = 0.8 | 7.5 ± 1.3 | 1.9 ± 1.6 | 988 ± 840 | 1.23 ± 1.17 | 128 ± 27 | 106 ± 43 | 0.148 ± 0.047 | 618 ± 185 | 0.51 ± 0.07 | 0.24 ± 0.09 | 0.76 |
| OSO (choice), α = 0.6 | 7.7 ± 0.9 | 2.1 ± 1.6 | 1065 ± 803 | 1.29 ± 1.09 | 135 ± 27 | 116 ± 43 | 0.155 ± 0.045 | 636 ± 183 | 0.52 ± 0.06 | 0.27 ± 0.10 | 0.82 |
| OSO (choice), α = 0.4 | 7.9 ± 0.5 | 2.5 ± 1.4 | 1270 ± 718 | 1.52 ± 1.00 | 146 ± 25 | 133 ± 38 | 0.168 ± 0.041 | 578 ± 202 | 0.54 ± 0.05 | 0.36 ± 0.10 | 0.91 |
| OSO (choice), α = 0.2 | 8.0 ± 0.2 | 3.0 ± 1.3 | 1536 ± 655 | 2.00 ± 1.12 | 155 ± 19 | 150 ± 25 | 0.191 ± 0.049 | 537 ± 186 | 0.53 ± 0.05 | 0.49 ± 0.09 | 0.96 |
| OSO (choice), α = 0 | 8.0 ± 0.0 | 3.3 ± 1.1 | 1664 ± 546 | 2.15 ± 0.94 | 181 ± 15 | 181 ± 15 | 0.227 ± 0.050 | 402 ± 163 | 0.48 ± 0.07 | 1.00 ± 0.00 | 1.00 |

Code: commit `dc540e2`. Experiment: [config/experiments/full-example-deep-field-traditional-vs-osochoice-by-alpha-20261023.yaml](../../config/experiments/full-example-deep-field-traditional-vs-osochoice-by-alpha-20261023.yaml). Command: `npm run sim -- full-example-deep-field-traditional-vs-osochoice-by-alpha-20261023 --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
