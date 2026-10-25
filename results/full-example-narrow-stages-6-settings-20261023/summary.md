# full-example-narrow-stages-6-settings-20261023

**Question:** On the narrow-stages example, with every kind of agent and earnings shaping next round's money, which of the six rule settings gets furthest?

**Answer:** Best overall: No flow-back, immediate. Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money, money to the main level and waste. (8 measures; a clear difference is more than 2.7 standard errors.)

- hardest level: 6.00 against traditional 0.36, clearly better.
- targets solved: 2.67 against traditional 0.09, clearly better.
- bounty value: 1298 against traditional 44, clearly better.
- ROI: 1.49 against traditional 0.03, clearly better.
- knowledge found (bits): 157 against traditional 79, clearly better.
- knowledge per unit of money: 0.17 against traditional 0.06, clearly better.
- money to the main level: 564 against traditional 1012, clearly better.
- waste: 0.45 against traditional 0.72, clearly better.

![full-example-narrow-stages-6-settings-20261023](figures/compare.svg)

| setting | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | bits per money | cost | waste |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 0.4 ± 1.4 | 0.1 ± 0.4 | 44 ± 184 | 0.03 ± 0.13 | 79 ± 12 | 0.057 ± 0.008 | 1012 ± 336 | 0.72 ± 0.05 |
| OSO (immediate) | 6.0 ± 0.1 | 2.7 ± 0.7 | 1327 ± 358 | 1.59 ± 0.74 | 157 ± 19 | 0.176 ± 0.049 | 565 ± 243 | 0.45 ± 0.07 |
| OSO (choice) | 5.8 ± 0.6 | 1.7 ± 1.3 | 836 ± 630 | 0.76 ± 0.67 | 134 ± 20 | 0.111 ± 0.031 | 875 ± 286 | 0.62 ± 0.08 |
| Flow-back, finished-only | 0.4 ± 1.4 | 0.1 ± 0.3 | 39 ± 165 | 0.03 ± 0.12 | 79 ± 12 | 0.057 ± 0.009 | 1106 ± 240 | 0.72 ± 0.05 |
| No flow-back, immediate | 6.0 ± 0.0 | 2.7 ± 0.7 | 1298 ± 353 | 1.49 ± 0.72 | 157 ± 18 | 0.169 ± 0.048 | 564 ± 209 | 0.45 ± 0.07 |
| No flow-back, choice | 5.8 ± 0.6 | 1.4 ± 1.2 | 700 ± 599 | 0.63 ± 0.64 | 130 ± 19 | 0.105 ± 0.030 | 851 ± 297 | 0.64 ± 0.08 |

**Design** (fixed before the run): compared Traditional, OSO (immediate), OSO (choice), Flow-back, finished-only, No flow-back, immediate, No flow-back, choice · held the same: the narrow-stages example · measure: all of hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money, money to the main level, waste · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Designed in the app on the narrow-stages example (spaces/example-narrow-stages.yaml): Traditional vs OSO (immediate) vs OSO (choice) vs Flow-back, finished-only vs No flow-back, immediate vs No flow-back, choice. α and c apply to the OSO (flow-back) settings only.

Values are mean ± standard deviation over runs.

| setting | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | knowledge published (bits) | bits per money | cost | waste | sharing | reach L6 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 0.4 ± 1.4 | 0.1 ± 0.4 | 44 ± 184 | 0.03 ± 0.13 | 79 ± 12 | 2 ± 9 | 0.057 ± 0.008 | 1012 ± 336 | 0.72 ± 0.05 | 0.00 ± 0.00 | 0.06 |
| OSO (immediate) | 6.0 ± 0.1 | 2.7 ± 0.7 | 1327 ± 358 | 1.59 ± 0.74 | 157 ± 19 | 157 ± 19 | 0.176 ± 0.049 | 565 ± 243 | 0.45 ± 0.07 | 1.00 ± 0.00 | 0.99 |
| OSO (choice) | 5.8 ± 0.6 | 1.7 ± 1.3 | 836 ± 630 | 0.76 ± 0.67 | 134 ± 20 | 120 ± 34 | 0.111 ± 0.031 | 875 ± 286 | 0.62 ± 0.08 | 0.44 ± 0.12 | 0.84 |
| Flow-back, finished-only | 0.4 ± 1.4 | 0.1 ± 0.3 | 39 ± 165 | 0.03 ± 0.12 | 79 ± 12 | 2 ± 10 | 0.057 ± 0.009 | 1106 ± 240 | 0.72 ± 0.05 | 0.00 ± 0.00 | 0.06 |
| No flow-back, immediate | 6.0 ± 0.0 | 2.7 ± 0.7 | 1298 ± 353 | 1.49 ± 0.72 | 157 ± 18 | 157 ± 18 | 0.169 ± 0.048 | 564 ± 209 | 0.45 ± 0.07 | 1.00 ± 0.00 | 1.00 |
| No flow-back, choice | 5.8 ± 0.6 | 1.4 ± 1.2 | 700 ± 599 | 0.63 ± 0.64 | 130 ± 19 | 112 ± 32 | 0.105 ± 0.030 | 851 ± 297 | 0.64 ± 0.08 | 0.43 ± 0.12 | 0.81 |

Code: commit `cd9fb92` (with uncommitted changes). Experiment: [config/experiments/full-example-narrow-stages-6-settings-20261023.yaml](../../config/experiments/full-example-narrow-stages-6-settings-20261023.yaml). Command: `npm run sim -- full-example-narrow-stages-6-settings-20261023 --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
