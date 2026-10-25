# Scaling, depth 10 (else default)

**Question:** With depth 10 and everything else as the default graph, how does what each society achieves grow with its budget?

**Answer:** At budget 50: best OSO (α = 0.8, β = 1). Against traditional, clearly better on hardest level; no clear difference on targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money and waste. At budget 100: best OSO (α = 0.2, β = 1). Against traditional, clearly better on hardest level, knowledge found (bits) and knowledge per unit of money; no clear difference on targets solved, bounty value, ROI and waste. At budgets 200–400: best OSO (α = 0.2, β = 1). Against traditional, clearly better on hardest level, knowledge found (bits), knowledge per unit of money and waste; no clear difference on targets solved, bounty value and ROI. At budget 800: best OSO (α = 0.8, β = 1). Against traditional, clearly better on hardest level, knowledge found (bits), knowledge per unit of money and waste; no clear difference on targets solved, bounty value and ROI. At budget 1600: best OSO (α = 0.2, β = 1). Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money and waste. At budget 3200: best OSO (α = 0.8, β = 1). Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money and waste. At budget 6400: best OSO (α = 0.8, β = 1). Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money and waste; no clear difference on money to the main level. At budget 12800: best OSO (α = 0.8, β = 1). Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, knowledge per unit of money, money to the main level and waste; no clear difference on knowledge found (bits). At budget 25600: best OSO (α = 0.8, β = 1). Against traditional, clearly better on ROI, knowledge per unit of money, money to the main level and waste; clearly worse on knowledge found (bits); no clear difference on hardest level, targets solved and bounty value. At budgets 51200–102400: best OSO (α = 0.8, β = 1). Against traditional, clearly better on ROI, knowledge per unit of money, money to the main level and waste; no clear difference on hardest level, targets solved, bounty value and knowledge found (bits). (Compared at each budget; 8 measures, a clear difference is more than 2.7 standard errors.)

- Budget 50: hardest level: 1.60 against traditional 0.00, clearly better. targets solved: 0.00 against traditional 0.00, no clear difference.
- Budget 100: hardest level: 2.80 against traditional 0.00, clearly better. targets solved: 0.00 against traditional 0.00, no clear difference.
- Budget 200: hardest level: 4.45 against traditional 0.00, clearly better. targets solved: 0.00 against traditional 0.00, no clear difference.
- Budget 400: hardest level: 6.50 against traditional 0.00, clearly better. targets solved: 0.00 against traditional 0.00, no clear difference.
- Budget 800: hardest level: 7.65 against traditional 0.00, clearly better. targets solved: 0.10 against traditional 0.00, no clear difference.
- Budget 1600: hardest level: 9.50 against traditional 0.00, clearly better. targets solved: 0.75 against traditional 0.00, clearly better.
- Budget 3200: hardest level: 10 against traditional 0.00, clearly better. targets solved: 1.90 against traditional 0.00, clearly better.
- Budget 6400: hardest level: 10 against traditional 0.50, clearly better. targets solved: 2.00 against traditional 0.05, clearly better.
- Budget 12800: hardest level: 10 against traditional 6.00, clearly better. targets solved: 2.00 against traditional 0.95, clearly better.
- Budget 25600: hardest level: 10 against traditional 10, no clear difference. targets solved: 2.00 against traditional 2.00, no clear difference.
- Budget 51200: hardest level: 10 against traditional 10, no clear difference. targets solved: 2.00 against traditional 2.00, no clear difference.
- Budget 102400: hardest level: 10 against traditional 10, no clear difference. targets solved: 2.00 against traditional 2.00, no clear difference.

![Scaling, depth 10 (else default)](figures/compare.svg)

| society | budget | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | bits per money | cost | waste |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 50 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 5 ± 4 | 0.108 ± 0.083 | – | 0.14 ± 0.06 |
| Traditional (α = 1, β = 0) | 100 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 9 ± 5 | 0.094 ± 0.049 | – | 0.18 ± 0.07 |
| Traditional (α = 1, β = 0) | 200 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 17 ± 4 | 0.088 ± 0.021 | – | 0.27 ± 0.08 |
| Traditional (α = 1, β = 0) | 400 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 26 ± 4 | 0.065 ± 0.010 | – | 0.39 ± 0.07 |
| Traditional (α = 1, β = 0) | 800 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 40 ± 5 | 0.050 ± 0.006 | – | 0.52 ± 0.05 |
| Traditional (α = 1, β = 0) | 1600 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 65 ± 9 | 0.041 ± 0.006 | – | 0.61 ± 0.03 |
| Traditional (α = 1, β = 0) | 3200 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 108 ± 13 | 0.034 ± 0.004 | – | 0.67 ± 0.03 |
| Traditional (α = 1, β = 0) | 6400 | 0.5 ± 2.2 | 0.1 ± 0.2 | 102 ± 458 | 0.02 ± 0.07 | 161 ± 16 | 0.025 ± 0.002 | 6132 ± 0 | 0.74 ± 0.02 |
| Traditional (α = 1, β = 0) | 12800 | 6.0 ± 5.0 | 0.9 ± 0.9 | 1946 ± 1817 | 0.17 ± 0.16 | 230 ± 14 | 0.019 ± 0.002 | 9016 ± 1896 | 0.78 ± 0.03 |
| Traditional (α = 1, β = 0) | 25600 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 0.28 ± 0.06 | 264 ± 20 | 0.018 ± 0.003 | 12391 ± 3283 | 0.79 ± 0.03 |
| Traditional (α = 1, β = 0) | 51200 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 0.28 ± 0.06 | 260 ± 16 | 0.018 ± 0.004 | 11536 ± 3251 | 0.80 ± 0.02 |
| Traditional (α = 1, β = 0) | 102400 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 0.29 ± 0.06 | 263 ± 16 | 0.018 ± 0.003 | 12282 ± 2718 | 0.79 ± 0.02 |
| OSO (α = 0.8, β = 1) | 50 | 1.6 ± 1.2 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 7 ± 7 | 0.150 ± 0.135 | – | 0.14 ± 0.06 |
| OSO (α = 0.8, β = 1) | 100 | 2.5 ± 1.1 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 16 ± 9 | 0.171 ± 0.093 | – | 0.16 ± 0.06 |
| OSO (α = 0.8, β = 1) | 200 | 4.2 ± 1.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 35 ± 10 | 0.184 ± 0.052 | – | 0.17 ± 0.05 |
| OSO (α = 0.8, β = 1) | 400 | 6.0 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 72 ± 12 | 0.181 ± 0.031 | – | 0.20 ± 0.04 |
| OSO (α = 0.8, β = 1) | 800 | 7.7 ± 1.1 | 0.1 ± 0.3 | 205 ± 630 | 0.26 ± 0.80 | 116 ± 18 | 0.147 ± 0.023 | 768 ± 34 | 0.22 ± 0.03 |
| OSO (α = 0.8, β = 1) | 1600 | 9.3 ± 0.7 | 0.6 ± 0.7 | 1126 ± 1406 | 0.77 ± 1.05 | 185 ± 25 | 0.119 ± 0.020 | 1053 ± 397 | 0.25 ± 0.03 |
| OSO (α = 0.8, β = 1) | 3200 | 10.0 ± 0.0 | 1.9 ± 0.3 | 3891 ± 630 | 1.80 ± 0.58 | 232 ± 20 | 0.105 ± 0.026 | 1720 ± 430 | 0.27 ± 0.03 |
| OSO (α = 0.8, β = 1) | 6400 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 1.81 ± 0.55 | 233 ± 21 | 0.101 ± 0.025 | 1697 ± 488 | 0.27 ± 0.03 |
| OSO (α = 0.8, β = 1) | 12800 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 1.64 ± 0.54 | 240 ± 17 | 0.096 ± 0.031 | 1856 ± 878 | 0.28 ± 0.03 |
| OSO (α = 0.8, β = 1) | 25600 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 1.85 ± 0.63 | 241 ± 26 | 0.107 ± 0.035 | 1807 ± 754 | 0.29 ± 0.04 |
| OSO (α = 0.8, β = 1) | 51200 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 1.66 ± 0.43 | 249 ± 25 | 0.099 ± 0.021 | 1723 ± 562 | 0.31 ± 0.06 |
| OSO (α = 0.8, β = 1) | 102400 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 1.70 ± 0.45 | 253 ± 29 | 0.103 ± 0.022 | 2045 ± 510 | 0.37 ± 0.09 |
| OSO (α = 0.2, β = 1) | 50 | 2.0 ± 0.9 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 10 ± 6 | 0.207 ± 0.126 | – | 0.20 ± 0.06 |
| OSO (α = 0.2, β = 1) | 100 | 2.8 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 20 ± 7 | 0.213 ± 0.070 | – | 0.18 ± 0.05 |
| OSO (α = 0.2, β = 1) | 200 | 4.5 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 42 ± 8 | 0.219 ± 0.043 | – | 0.20 ± 0.04 |
| OSO (α = 0.2, β = 1) | 400 | 6.5 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 81 ± 12 | 0.204 ± 0.030 | – | 0.22 ± 0.05 |
| OSO (α = 0.2, β = 1) | 800 | 8.0 ± 0.9 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 128 ± 25 | 0.161 ± 0.032 | – | 0.24 ± 0.04 |
| OSO (α = 0.2, β = 1) | 1600 | 9.5 ± 0.7 | 0.8 ± 0.7 | 1536 ± 1467 | 1.08 ± 1.19 | 199 ± 26 | 0.130 ± 0.025 | 1240 ± 243 | 0.27 ± 0.03 |
| OSO (α = 0.2, β = 1) | 3200 | 10.0 ± 0.0 | 1.9 ± 0.4 | 3789 ± 750 | 2.09 ± 1.04 | 227 ± 27 | 0.117 ± 0.037 | 1669 ± 671 | 0.26 ± 0.04 |
| OSO (α = 0.2, β = 1) | 6400 | 10.0 ± 0.0 | 1.9 ± 0.2 | 3994 ± 458 | 1.70 ± 0.62 | 238 ± 17 | 0.099 ± 0.031 | 1748 ± 654 | 0.28 ± 0.04 |
| OSO (α = 0.2, β = 1) | 12800 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 1.78 ± 0.46 | 244 ± 19 | 0.105 ± 0.027 | 1537 ± 607 | 0.29 ± 0.03 |
| OSO (α = 0.2, β = 1) | 25600 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 1.88 ± 0.47 | 243 ± 18 | 0.111 ± 0.026 | 1637 ± 528 | 0.30 ± 0.05 |
| OSO (α = 0.2, β = 1) | 51200 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 1.62 ± 0.46 | 249 ± 25 | 0.098 ± 0.026 | 2000 ± 832 | 0.33 ± 0.05 |
| OSO (α = 0.2, β = 1) | 102400 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 1.76 ± 0.59 | 262 ± 31 | 0.110 ± 0.032 | 2035 ± 621 | 0.37 ± 0.09 |
| α = 0.8, β = 0.5 | 50 | 0.8 ± 1.1 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 6 ± 6 | 0.131 ± 0.123 | – | 0.13 ± 0.06 |
| α = 0.8, β = 0.5 | 100 | 1.6 ± 1.4 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 14 ± 9 | 0.141 ± 0.096 | – | 0.17 ± 0.06 |
| α = 0.8, β = 0.5 | 200 | 3.0 ± 1.3 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 25 ± 10 | 0.131 ± 0.050 | – | 0.24 ± 0.07 |
| α = 0.8, β = 0.5 | 400 | 4.8 ± 1.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 55 ± 12 | 0.138 ± 0.029 | – | 0.31 ± 0.05 |
| α = 0.8, β = 0.5 | 800 | 5.8 ± 1.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 90 ± 18 | 0.114 ± 0.023 | – | 0.38 ± 0.06 |
| α = 0.8, β = 0.5 | 1600 | 8.0 ± 0.9 | 0.1 ± 0.2 | 102 ± 458 | 0.06 ± 0.29 | 150 ± 19 | 0.094 ± 0.012 | 1500 ± 0 | 0.42 ± 0.06 |
| α = 0.8, β = 0.5 | 3200 | 9.6 ± 0.6 | 0.8 ± 0.8 | 1741 ± 1664 | 0.66 ± 0.75 | 209 ± 21 | 0.071 ± 0.014 | 2490 ± 522 | 0.46 ± 0.06 |
| α = 0.8, β = 0.5 | 6400 | 10.0 ± 0.0 | 1.9 ± 0.2 | 3994 ± 458 | 1.12 ± 0.38 | 240 ± 22 | 0.065 ± 0.015 | 2790 ± 915 | 0.44 ± 0.04 |
| α = 0.8, β = 0.5 | 12800 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 1.15 ± 0.39 | 246 ± 24 | 0.067 ± 0.018 | 2987 ± 630 | 0.45 ± 0.06 |
| α = 0.8, β = 0.5 | 25600 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 1.20 ± 0.38 | 245 ± 23 | 0.070 ± 0.019 | 2620 ± 910 | 0.50 ± 0.07 |
| α = 0.8, β = 0.5 | 51200 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 1.14 ± 0.29 | 255 ± 20 | 0.070 ± 0.016 | 2876 ± 853 | 0.49 ± 0.04 |
| α = 0.8, β = 0.5 | 102400 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 1.12 ± 0.43 | 251 ± 25 | 0.067 ± 0.019 | 3110 ± 1044 | 0.49 ± 0.07 |

**Design** (fixed before the run): compared four societies × budgets 50 to 102400 · held the same: a generated idea graph (10 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7), 12 identical agents, budget 50 split equally, no mint, no validation · measure: all of hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money, money to the main level, waste · 20 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The simple model on a generated idea graph (10 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7); each run draws its own graph. Only α and β vary. Held fixed: 12 identical agents, a budget of 50 split equally every round (ρ = 0), no mint, no validation.

Values are mean ± standard deviation over runs.

| society | budget | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | knowledge published (bits) | bits per money | cost | waste | sharing | reach L10 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 50 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 5 ± 4 | 0 ± 0 | 0.108 ± 0.083 | – | 0.14 ± 0.06 | 0.00 ± 0.00 | 0.00 |
| Traditional (α = 1, β = 0) | 100 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 9 ± 5 | 0 ± 0 | 0.094 ± 0.049 | – | 0.18 ± 0.07 | 0.00 ± 0.00 | 0.00 |
| Traditional (α = 1, β = 0) | 200 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 17 ± 4 | 0 ± 0 | 0.088 ± 0.021 | – | 0.27 ± 0.08 | 0.00 ± 0.00 | 0.00 |
| Traditional (α = 1, β = 0) | 400 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 26 ± 4 | 0 ± 0 | 0.065 ± 0.010 | – | 0.39 ± 0.07 | 0.00 ± 0.00 | 0.00 |
| Traditional (α = 1, β = 0) | 800 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 40 ± 5 | 0 ± 0 | 0.050 ± 0.006 | – | 0.52 ± 0.05 | 0.00 ± 0.00 | 0.00 |
| Traditional (α = 1, β = 0) | 1600 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 65 ± 9 | 0 ± 0 | 0.041 ± 0.006 | – | 0.61 ± 0.03 | 0.00 ± 0.00 | 0.00 |
| Traditional (α = 1, β = 0) | 3200 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 108 ± 13 | 0 ± 0 | 0.034 ± 0.004 | – | 0.67 ± 0.03 | 0.00 ± 0.00 | 0.00 |
| Traditional (α = 1, β = 0) | 6400 | 0.5 ± 2.2 | 0.1 ± 0.2 | 102 ± 458 | 0.02 ± 0.07 | 161 ± 16 | 5 ± 22 | 0.025 ± 0.002 | 6132 ± 0 | 0.74 ± 0.02 | 0.00 ± 0.00 | 0.05 |
| Traditional (α = 1, β = 0) | 12800 | 6.0 ± 5.0 | 0.9 ± 0.9 | 1946 ± 1817 | 0.17 ± 0.16 | 230 ± 14 | 91 ± 79 | 0.019 ± 0.002 | 9016 ± 1896 | 0.78 ± 0.03 | 0.00 ± 0.00 | 0.60 |
| Traditional (α = 1, β = 0) | 25600 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 0.28 ± 0.06 | 264 ± 20 | 180 ± 16 | 0.018 ± 0.003 | 12391 ± 3283 | 0.79 ± 0.03 | 0.00 ± 0.00 | 1.00 |
| Traditional (α = 1, β = 0) | 51200 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 0.28 ± 0.06 | 260 ± 16 | 177 ± 17 | 0.018 ± 0.004 | 11536 ± 3251 | 0.80 ± 0.02 | 0.00 ± 0.01 | 1.00 |
| Traditional (α = 1, β = 0) | 102400 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 0.29 ± 0.06 | 263 ± 16 | 176 ± 15 | 0.018 ± 0.003 | 12282 ± 2718 | 0.79 ± 0.02 | 0.00 ± 0.01 | 1.00 |
| OSO (α = 0.8, β = 1) | 50 | 1.6 ± 1.2 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 7 ± 7 | 7 ± 7 | 0.150 ± 0.135 | – | 0.14 ± 0.06 | 0.70 ± 0.47 | 0.00 |
| OSO (α = 0.8, β = 1) | 100 | 2.5 ± 1.1 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 16 ± 9 | 16 ± 9 | 0.171 ± 0.093 | – | 0.16 ± 0.06 | 0.90 ± 0.31 | 0.00 |
| OSO (α = 0.8, β = 1) | 200 | 4.2 ± 1.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 35 ± 10 | 35 ± 10 | 0.184 ± 0.052 | – | 0.17 ± 0.05 | 1.00 ± 0.00 | 0.00 |
| OSO (α = 0.8, β = 1) | 400 | 6.0 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 72 ± 12 | 72 ± 12 | 0.181 ± 0.031 | – | 0.20 ± 0.04 | 1.00 ± 0.00 | 0.00 |
| OSO (α = 0.8, β = 1) | 800 | 7.7 ± 1.1 | 0.1 ± 0.3 | 205 ± 630 | 0.26 ± 0.80 | 116 ± 18 | 116 ± 18 | 0.147 ± 0.023 | 768 ± 34 | 0.22 ± 0.03 | 1.00 ± 0.00 | 0.10 |
| OSO (α = 0.8, β = 1) | 1600 | 9.3 ± 0.7 | 0.6 ± 0.7 | 1126 ± 1406 | 0.77 ± 1.05 | 185 ± 25 | 185 ± 25 | 0.119 ± 0.020 | 1053 ± 397 | 0.25 ± 0.03 | 1.00 ± 0.00 | 0.45 |
| OSO (α = 0.8, β = 1) | 3200 | 10.0 ± 0.0 | 1.9 ± 0.3 | 3891 ± 630 | 1.80 ± 0.58 | 232 ± 20 | 232 ± 20 | 0.105 ± 0.026 | 1720 ± 430 | 0.27 ± 0.03 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 6400 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 1.81 ± 0.55 | 233 ± 21 | 233 ± 21 | 0.101 ± 0.025 | 1697 ± 488 | 0.27 ± 0.03 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 12800 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 1.64 ± 0.54 | 240 ± 17 | 240 ± 17 | 0.096 ± 0.031 | 1856 ± 878 | 0.28 ± 0.03 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 25600 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 1.85 ± 0.63 | 241 ± 26 | 241 ± 26 | 0.107 ± 0.035 | 1807 ± 754 | 0.29 ± 0.04 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 51200 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 1.66 ± 0.43 | 249 ± 25 | 249 ± 25 | 0.099 ± 0.021 | 1723 ± 562 | 0.31 ± 0.06 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 102400 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 1.70 ± 0.45 | 253 ± 29 | 253 ± 29 | 0.103 ± 0.022 | 2045 ± 510 | 0.37 ± 0.09 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 50 | 2.0 ± 0.9 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 10 ± 6 | 10 ± 6 | 0.207 ± 0.126 | – | 0.20 ± 0.06 | 0.95 ± 0.22 | 0.00 |
| OSO (α = 0.2, β = 1) | 100 | 2.8 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 20 ± 7 | 20 ± 7 | 0.213 ± 0.070 | – | 0.18 ± 0.05 | 1.00 ± 0.00 | 0.00 |
| OSO (α = 0.2, β = 1) | 200 | 4.5 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 42 ± 8 | 42 ± 8 | 0.219 ± 0.043 | – | 0.20 ± 0.04 | 1.00 ± 0.00 | 0.00 |
| OSO (α = 0.2, β = 1) | 400 | 6.5 ± 0.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 81 ± 12 | 81 ± 12 | 0.204 ± 0.030 | – | 0.22 ± 0.05 | 1.00 ± 0.00 | 0.00 |
| OSO (α = 0.2, β = 1) | 800 | 8.0 ± 0.9 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 128 ± 25 | 128 ± 25 | 0.161 ± 0.032 | – | 0.24 ± 0.04 | 1.00 ± 0.00 | 0.00 |
| OSO (α = 0.2, β = 1) | 1600 | 9.5 ± 0.7 | 0.8 ± 0.7 | 1536 ± 1467 | 1.08 ± 1.19 | 199 ± 26 | 199 ± 26 | 0.130 ± 0.025 | 1240 ± 243 | 0.27 ± 0.03 | 1.00 ± 0.00 | 0.60 |
| OSO (α = 0.2, β = 1) | 3200 | 10.0 ± 0.0 | 1.9 ± 0.4 | 3789 ± 750 | 2.09 ± 1.04 | 227 ± 27 | 227 ± 27 | 0.117 ± 0.037 | 1669 ± 671 | 0.26 ± 0.04 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 6400 | 10.0 ± 0.0 | 1.9 ± 0.2 | 3994 ± 458 | 1.70 ± 0.62 | 238 ± 17 | 238 ± 17 | 0.099 ± 0.031 | 1748 ± 654 | 0.28 ± 0.04 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 12800 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 1.78 ± 0.46 | 244 ± 19 | 244 ± 19 | 0.105 ± 0.027 | 1537 ± 607 | 0.29 ± 0.03 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 25600 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 1.88 ± 0.47 | 243 ± 18 | 243 ± 18 | 0.111 ± 0.026 | 1637 ± 528 | 0.30 ± 0.05 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 51200 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 1.62 ± 0.46 | 249 ± 25 | 249 ± 25 | 0.098 ± 0.026 | 2000 ± 832 | 0.33 ± 0.05 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 102400 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 1.76 ± 0.59 | 262 ± 31 | 262 ± 31 | 0.110 ± 0.032 | 2035 ± 621 | 0.37 ± 0.09 | 1.00 ± 0.00 | 1.00 |
| α = 0.8, β = 0.5 | 50 | 0.8 ± 1.1 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 6 ± 6 | 3 ± 5 | 0.131 ± 0.123 | – | 0.13 ± 0.06 | 0.25 ± 0.37 | 0.00 |
| α = 0.8, β = 0.5 | 100 | 1.6 ± 1.4 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 14 ± 9 | 8 ± 8 | 0.141 ± 0.096 | – | 0.17 ± 0.06 | 0.34 ± 0.33 | 0.00 |
| α = 0.8, β = 0.5 | 200 | 3.0 ± 1.3 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 25 ± 10 | 18 ± 9 | 0.131 ± 0.050 | – | 0.24 ± 0.07 | 0.52 ± 0.20 | 0.00 |
| α = 0.8, β = 0.5 | 400 | 4.8 ± 1.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 55 ± 12 | 45 ± 11 | 0.138 ± 0.029 | – | 0.31 ± 0.05 | 0.56 ± 0.12 | 0.00 |
| α = 0.8, β = 0.5 | 800 | 5.8 ± 1.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 90 ± 18 | 77 ± 18 | 0.114 ± 0.023 | – | 0.38 ± 0.06 | 0.54 ± 0.11 | 0.00 |
| α = 0.8, β = 0.5 | 1600 | 8.0 ± 0.9 | 0.1 ± 0.2 | 102 ± 458 | 0.06 ± 0.29 | 150 ± 19 | 131 ± 20 | 0.094 ± 0.012 | 1500 ± 0 | 0.42 ± 0.06 | 0.51 ± 0.10 | 0.05 |
| α = 0.8, β = 0.5 | 3200 | 9.6 ± 0.6 | 0.8 ± 0.8 | 1741 ± 1664 | 0.66 ± 0.75 | 209 ± 21 | 192 ± 22 | 0.071 ± 0.014 | 2490 ± 522 | 0.46 ± 0.06 | 0.54 ± 0.07 | 0.65 |
| α = 0.8, β = 0.5 | 6400 | 10.0 ± 0.0 | 1.9 ± 0.2 | 3994 ± 458 | 1.12 ± 0.38 | 240 ± 22 | 227 ± 23 | 0.065 ± 0.015 | 2790 ± 915 | 0.44 ± 0.04 | 0.57 ± 0.05 | 1.00 |
| α = 0.8, β = 0.5 | 12800 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 1.15 ± 0.39 | 246 ± 24 | 232 ± 22 | 0.067 ± 0.018 | 2987 ± 630 | 0.45 ± 0.06 | 0.63 ± 0.04 | 1.00 |
| α = 0.8, β = 0.5 | 25600 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 1.20 ± 0.38 | 245 ± 23 | 228 ± 21 | 0.070 ± 0.019 | 2620 ± 910 | 0.50 ± 0.07 | 0.68 ± 0.07 | 1.00 |
| α = 0.8, β = 0.5 | 51200 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 1.14 ± 0.29 | 255 ± 20 | 238 ± 19 | 0.070 ± 0.016 | 2876 ± 853 | 0.49 ± 0.04 | 0.76 ± 0.04 | 1.00 |
| α = 0.8, β = 0.5 | 102400 | 10.0 ± 0.0 | 2.0 ± 0.0 | 4096 ± 0 | 1.12 ± 0.43 | 251 ± 25 | 240 ± 24 | 0.067 ± 0.019 | 3110 ± 1044 | 0.49 ± 0.07 | 0.87 ± 0.05 | 1.00 |

Code: commit `10c7482` (with uncommitted changes). Experiment: [config/experiments/simple-ideas-10x8-p2-len3g2-comp0-7-one-at-a-time-depth-20261024.yaml](../../config/experiments/simple-ideas-10x8-p2-len3g2-comp0-7-one-at-a-time-depth-20261024.yaml). Command: `npm run sim -- simple-ideas-10x8-p2-len3g2-comp0-7-one-at-a-time-depth-20261024 --seeds 20 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
