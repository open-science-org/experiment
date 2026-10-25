# full-example-deep-field-traditional-vs-osochoice-by-alpha-20261023

**Question:** When agents choose what to publish, how much do they share (β) at each α, and how far do they get?

**Answer:** Best overall: OSO (choice), α = 0. Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money and waste. (8 measures; a clear difference is more than 2.7 standard errors.)

- hardest level: 8.00 against traditional 0.00, clearly better.
- targets solved: 3.25 against traditional 0.00, clearly better.
- bounty value: 1664 against traditional 0.00, clearly better.
- ROI: 2.15 against traditional 0.00, clearly better.
- knowledge found (bits): 181 against traditional 66, clearly better.
- knowledge per unit of money: 0.23 against traditional 0.07, clearly better.
- money to the main level: best OSO (choice), α = 0, 402.
- waste: 0.48 against traditional 0.57, clearly better.

![full-example-deep-field-traditional-vs-osochoice-by-alpha-20261023](figures/compare.svg)

| setting | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | bits per money | cost | waste |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 66 ± 9 | 0.070 ± 0.010 | – | 0.57 ± 0.04 |
| OSO (choice), α = 0.9 | 7.6 ± 1.1 | 2.1 ± 1.5 | 1065 ± 769 | 1.30 ± 1.10 | 129 ± 28 | 0.149 ± 0.048 | 626 ± 203 | 0.51 ± 0.06 |
| OSO (choice), α = 0.8 | 7.4 ± 1.3 | 2.0 ± 1.5 | 1039 ± 789 | 1.28 ± 1.12 | 129 ± 29 | 0.150 ± 0.049 | 603 ± 194 | 0.51 ± 0.06 |
| OSO (choice), α = 0.6 | 7.8 ± 0.6 | 2.3 ± 1.5 | 1157 ± 776 | 1.38 ± 1.03 | 138 ± 25 | 0.157 ± 0.038 | 637 ± 173 | 0.51 ± 0.05 |
| OSO (choice), α = 0.4 | 7.8 ± 0.5 | 2.4 ± 1.5 | 1224 ± 794 | 1.49 ± 1.11 | 142 ± 26 | 0.165 ± 0.045 | 588 ± 186 | 0.54 ± 0.05 |
| OSO (choice), α = 0.2 | 7.9 ± 0.3 | 3.0 ± 1.2 | 1546 ± 617 | 1.92 ± 0.96 | 155 ± 19 | 0.186 ± 0.039 | 544 ± 189 | 0.52 ± 0.06 |
| OSO (choice), α = 0 | 8.0 ± 0.0 | 3.3 ± 1.1 | 1664 ± 546 | 2.15 ± 0.94 | 181 ± 15 | 0.227 ± 0.050 | 402 ± 163 | 0.48 ± 0.07 |

**Design** (fixed before the run): compared Traditional, OSO (choice), by α, absorption rate · held the same: the field "the deep-field example" · measure: all of hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money, money to the main level, waste · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Designed in the app on the field "the deep-field example" (spaces/example-deep-field.yaml): Traditional vs OSO (choice), varying α, absorption rate. α and c apply to the OSO (flow-back) settings only.

Values are mean ± standard deviation over runs.

| setting | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | knowledge published (bits) | bits per money | cost | waste | sharing | reach L8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 66 ± 9 | 0 ± 0 | 0.070 ± 0.010 | – | 0.57 ± 0.04 | 0.00 ± 0.00 | 0.00 |
| OSO (choice), α = 0.9 | 7.6 ± 1.1 | 2.1 ± 1.5 | 1065 ± 769 | 1.30 ± 1.10 | 129 ± 28 | 106 ± 43 | 0.149 ± 0.048 | 626 ± 203 | 0.51 ± 0.06 | 0.24 ± 0.09 | 0.85 |
| OSO (choice), α = 0.8 | 7.4 ± 1.3 | 2.0 ± 1.5 | 1039 ± 789 | 1.28 ± 1.12 | 129 ± 29 | 106 ± 47 | 0.150 ± 0.049 | 603 ± 194 | 0.51 ± 0.06 | 0.24 ± 0.10 | 0.79 |
| OSO (choice), α = 0.6 | 7.8 ± 0.6 | 2.3 ± 1.5 | 1157 ± 776 | 1.38 ± 1.03 | 138 ± 25 | 122 ± 39 | 0.157 ± 0.038 | 637 ± 173 | 0.51 ± 0.05 | 0.28 ± 0.09 | 0.88 |
| OSO (choice), α = 0.4 | 7.8 ± 0.5 | 2.4 ± 1.5 | 1224 ± 794 | 1.49 ± 1.11 | 142 ± 26 | 128 ± 40 | 0.165 ± 0.045 | 588 ± 186 | 0.54 ± 0.05 | 0.37 ± 0.10 | 0.87 |
| OSO (choice), α = 0.2 | 7.9 ± 0.3 | 3.0 ± 1.2 | 1546 ± 617 | 1.92 ± 0.96 | 155 ± 19 | 150 ± 25 | 0.186 ± 0.039 | 544 ± 189 | 0.52 ± 0.06 | 0.51 ± 0.08 | 0.95 |
| OSO (choice), α = 0 | 8.0 ± 0.0 | 3.3 ± 1.1 | 1664 ± 546 | 2.15 ± 0.94 | 181 ± 15 | 181 ± 15 | 0.227 ± 0.050 | 402 ± 163 | 0.48 ± 0.07 | 1.00 ± 0.00 | 1.00 |

Code: commit `cd9fb92` (with uncommitted changes). Experiment: [config/experiments/full-example-deep-field-traditional-vs-osochoice-by-alpha-20261023.yaml](../../config/experiments/full-example-deep-field-traditional-vs-osochoice-by-alpha-20261023.yaml). Command: `npm run sim -- full-example-deep-field-traditional-vs-osochoice-by-alpha-20261023 --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
