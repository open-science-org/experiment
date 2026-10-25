# Deep graph: 20 levels, each step equally hard

**Question:** On a graph 20 levels deep where every step is equally hard, how much money does each society need, and does traditional research fall further behind as the chain of work gets longer?

**Answer:** At budget 128: best α = 1, β = 1. Against traditional, clearly better on hardest level, knowledge found (bits), knowledge per unit of money and waste; no clear difference on targets solved, bounty value and ROI. At budget 256: best OSO (α = 0.2, β = 1). Against traditional, clearly better on hardest level, knowledge found (bits), knowledge per unit of money and waste; no clear difference on targets solved, bounty value and ROI. At budget 512: best OSO (α = 0.2, β = 1). Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money and waste. At budget 1024: best OSO (α = 0.8, β = 1). Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money and waste. At budget 2048: best OSO (α = 0.8, β = 1). Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money and waste; no clear difference on money to the main level. At budgets 4096–8192: best OSO (α = 0.2, β = 1). Against traditional, clearly better on ROI, knowledge per unit of money, money to the main level and waste; no clear difference on hardest level, targets solved, bounty value and knowledge found (bits). At budget 16384: best OSO (α = 0.8, β = 1). Against traditional, clearly better on ROI, knowledge per unit of money, money to the main level and waste; no clear difference on hardest level, targets solved, bounty value and knowledge found (bits). At budget 32768: best OSO (α = 0.8, β = 1). Against traditional, clearly better on ROI, knowledge found (bits), knowledge per unit of money, money to the main level and waste; no clear difference on hardest level, targets solved and bounty value. (Compared at each budget; 8 measures, a clear difference is more than 2.7 standard errors.)

- Budget 128: hardest level: 6.30 against traditional 0.00, clearly better. targets solved: 0.00 against traditional 0.00, no clear difference.
- Budget 256: hardest level: 14 against traditional 0.00, clearly better. targets solved: 0.03 against traditional 0.00, no clear difference.
- Budget 512: hardest level: 20 against traditional 0.00, clearly better. targets solved: 1.90 against traditional 0.00, clearly better.
- Budget 1024: hardest level: 20 against traditional 0.00, clearly better. targets solved: 2.00 against traditional 0.00, clearly better.
- Budget 2048: hardest level: 20 against traditional 0.67, clearly better. targets solved: 2.00 against traditional 0.07, clearly better.
- Budget 4096: hardest level: 20 against traditional 19, no clear difference. targets solved: 2.00 against traditional 1.87, no clear difference.
- Budget 8192: hardest level: 20 against traditional 20, no clear difference. targets solved: 2.00 against traditional 2.00, no clear difference.
- Budget 16384: hardest level: 20 against traditional 20, no clear difference. targets solved: 2.00 against traditional 2.00, no clear difference.
- Budget 32768: hardest level: 20 against traditional 20, no clear difference. targets solved: 2.00 against traditional 2.00, no clear difference.

![Deep graph: 20 levels, each step equally hard](figures/compare.svg)

| society | budget | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | bits per money | cost | waste |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 128 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 13 ± 3 | 0.111 ± 0.026 | – | 0.25 ± 0.09 |
| Traditional (α = 1, β = 0) | 256 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 20 ± 3 | 0.080 ± 0.011 | – | 0.36 ± 0.08 |
| Traditional (α = 1, β = 0) | 512 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 29 ± 3 | 0.057 ± 0.007 | – | 0.46 ± 0.06 |
| Traditional (α = 1, β = 0) | 1024 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 45 ± 5 | 0.044 ± 0.005 | – | 0.53 ± 0.04 |
| Traditional (α = 1, β = 0) | 2048 | 0.7 ± 3.7 | 0.1 ± 0.4 | 1 ± 6 | 0.00 ± 0.00 | 86 ± 11 | 0.043 ± 0.007 | 1644 ± 0 | 0.60 ± 0.03 |
| Traditional (α = 1, β = 0) | 4096 | 18.7 ± 5.1 | 1.9 ± 0.5 | 30 ± 8 | 0.01 ± 0.00 | 154 ± 10 | 0.043 ± 0.003 | 3402 ± 365 | 0.68 ± 0.04 |
| Traditional (α = 1, β = 0) | 8192 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.01 ± 0.00 | 156 ± 7 | 0.044 ± 0.004 | 3371 ± 492 | 0.69 ± 0.04 |
| Traditional (α = 1, β = 0) | 16384 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.01 ± 0.00 | 156 ± 7 | 0.045 ± 0.004 | 3430 ± 393 | 0.69 ± 0.04 |
| Traditional (α = 1, β = 0) | 32768 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.01 ± 0.00 | 158 ± 5 | 0.044 ± 0.004 | 3525 ± 429 | 0.69 ± 0.04 |
| OSO (α = 0.8, β = 1) | 128 | 5.6 ± 2.5 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 26 ± 10 | 0.220 ± 0.084 | – | 0.07 ± 0.03 |
| OSO (α = 0.8, β = 1) | 256 | 12.3 ± 3.7 | 0.1 ± 0.3 | 1 ± 4 | 0.00 ± 0.02 | 65 ± 16 | 0.257 ± 0.065 | 252 ± 0 | 0.09 ± 0.03 |
| OSO (α = 0.8, β = 1) | 512 | 20.0 ± 0.2 | 1.8 ± 0.5 | 28 ± 8 | 0.07 ± 0.02 | 135 ± 14 | 0.319 ± 0.046 | 382 ± 75 | 0.11 ± 0.04 |
| OSO (α = 0.8, β = 1) | 1024 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.08 ± 0.01 | 137 ± 15 | 0.321 ± 0.043 | 387 ± 79 | 0.11 ± 0.04 |
| OSO (α = 0.8, β = 1) | 2048 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.08 ± 0.01 | 141 ± 16 | 0.330 ± 0.042 | 384 ± 73 | 0.12 ± 0.05 |
| OSO (α = 0.8, β = 1) | 4096 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.08 ± 0.02 | 141 ± 17 | 0.333 ± 0.059 | 384 ± 88 | 0.13 ± 0.06 |
| OSO (α = 0.8, β = 1) | 8192 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.08 ± 0.01 | 146 ± 14 | 0.343 ± 0.051 | 404 ± 77 | 0.13 ± 0.03 |
| OSO (α = 0.8, β = 1) | 16384 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.07 ± 0.01 | 157 ± 12 | 0.353 ± 0.044 | 427 ± 75 | 0.16 ± 0.06 |
| OSO (α = 0.8, β = 1) | 32768 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.07 ± 0.01 | 164 ± 1 | 0.363 ± 0.037 | 446 ± 66 | 0.18 ± 0.05 |
| OSO (α = 0.2, β = 1) | 128 | 6.1 ± 2.3 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 29 ± 9 | 0.239 ± 0.076 | – | 0.08 ± 0.03 |
| OSO (α = 0.2, β = 1) | 256 | 13.6 ± 3.5 | 0.0 ± 0.2 | 1 ± 3 | 0.00 ± 0.01 | 70 ± 17 | 0.278 ± 0.068 | 240 ± 0 | 0.09 ± 0.03 |
| OSO (α = 0.2, β = 1) | 512 | 20.0 ± 0.0 | 1.9 ± 0.3 | 30 ± 5 | 0.07 ± 0.02 | 140 ± 16 | 0.339 ± 0.044 | 375 ± 63 | 0.12 ± 0.04 |
| OSO (α = 0.2, β = 1) | 1024 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.08 ± 0.01 | 142 ± 16 | 0.340 ± 0.042 | 375 ± 63 | 0.12 ± 0.04 |
| OSO (α = 0.2, β = 1) | 2048 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.08 ± 0.01 | 144 ± 15 | 0.343 ± 0.037 | 375 ± 54 | 0.13 ± 0.04 |
| OSO (α = 0.2, β = 1) | 4096 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.08 ± 0.01 | 148 ± 16 | 0.349 ± 0.051 | 377 ± 59 | 0.14 ± 0.04 |
| OSO (α = 0.2, β = 1) | 8192 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.07 ± 0.01 | 151 ± 11 | 0.348 ± 0.044 | 400 ± 78 | 0.14 ± 0.05 |
| OSO (α = 0.2, β = 1) | 16384 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.07 ± 0.01 | 157 ± 10 | 0.351 ± 0.038 | 423 ± 53 | 0.15 ± 0.05 |
| OSO (α = 0.2, β = 1) | 32768 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.07 ± 0.01 | 164 ± 1 | 0.381 ± 0.047 | 424 ± 73 | 0.18 ± 0.06 |
| α = 0.8, β = 0.5 | 128 | 3.6 ± 1.9 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 20 ± 8 | 0.170 ± 0.069 | – | 0.17 ± 0.06 |
| α = 0.8, β = 0.5 | 256 | 7.4 ± 2.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 43 ± 13 | 0.170 ± 0.052 | – | 0.21 ± 0.04 |
| α = 0.8, β = 0.5 | 512 | 16.4 ± 3.8 | 0.3 ± 0.5 | 4 ± 8 | 0.01 ± 0.02 | 96 ± 25 | 0.190 ± 0.049 | 464 ± 56 | 0.27 ± 0.04 |
| α = 0.8, β = 0.5 | 1024 | 20.0 ± 0.0 | 2.0 ± 0.2 | 31 ± 3 | 0.05 ± 0.01 | 142 ± 13 | 0.212 ± 0.035 | 621 ± 149 | 0.31 ± 0.05 |
| α = 0.8, β = 0.5 | 2048 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.05 ± 0.01 | 144 ± 13 | 0.206 ± 0.027 | 630 ± 107 | 0.32 ± 0.04 |
| α = 0.8, β = 0.5 | 4096 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.05 ± 0.01 | 140 ± 12 | 0.221 ± 0.030 | 594 ± 111 | 0.30 ± 0.06 |
| α = 0.8, β = 0.5 | 8192 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.05 ± 0.01 | 146 ± 11 | 0.210 ± 0.037 | 664 ± 130 | 0.33 ± 0.04 |
| α = 0.8, β = 0.5 | 16384 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.05 ± 0.01 | 156 ± 9 | 0.219 ± 0.026 | 652 ± 108 | 0.36 ± 0.05 |
| α = 0.8, β = 0.5 | 32768 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.05 ± 0.01 | 162 ± 5 | 0.227 ± 0.032 | 682 ± 125 | 0.40 ± 0.07 |
| α = 1, β = 1 | 128 | 6.3 ± 3.5 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 28 ± 11 | 0.232 ± 0.091 | – | 0.07 ± 0.03 |
| α = 1, β = 1 | 256 | 12.4 ± 3.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 65 ± 17 | 0.256 ± 0.069 | – | 0.09 ± 0.04 |
| α = 1, β = 1 | 512 | 19.9 ± 0.4 | 1.8 ± 0.5 | 29 ± 7 | 0.07 ± 0.02 | 134 ± 13 | 0.319 ± 0.045 | 387 ± 65 | 0.11 ± 0.05 |
| α = 1, β = 1 | 1024 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.08 ± 0.01 | 136 ± 13 | 0.321 ± 0.041 | 392 ± 70 | 0.11 ± 0.05 |
| α = 1, β = 1 | 2048 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.07 ± 0.01 | 142 ± 15 | 0.322 ± 0.057 | 394 ± 81 | 0.12 ± 0.05 |
| α = 1, β = 1 | 4096 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.08 ± 0.01 | 140 ± 14 | 0.329 ± 0.058 | 401 ± 80 | 0.12 ± 0.04 |
| α = 1, β = 1 | 8192 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.07 ± 0.01 | 148 ± 14 | 0.341 ± 0.040 | 404 ± 69 | 0.13 ± 0.05 |
| α = 1, β = 1 | 16384 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.07 ± 0.01 | 155 ± 13 | 0.347 ± 0.054 | 420 ± 72 | 0.16 ± 0.06 |
| α = 1, β = 1 | 32768 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.07 ± 0.01 | 163 ± 3 | 0.367 ± 0.050 | 431 ± 84 | 0.17 ± 0.06 |

**Design** (fixed before the run): compared five societies (traditional, OSO at α = 0.8 and 0.2, half-open, open without flow-back) × 9 budgets · held the same: a deep generated graph (20 levels × 4, 2 new bits per step), 12 identical agents, equal money, knowledge reward 1 per new bit, no validation · measure: all of hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money, money to the main level, waste · 30 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The simple model on a deep generated idea graph (20 levels × 4 ideas, 2 parents each; every idea adds exactly 2 new bits to what it inherits, so each step is equally hard at any depth; 2 bounties on the top level). Held fixed: 12 identical agents, equal money every round (f = 0), no flat mint, a knowledge reward of 1 per new bit flowing back with α, no validation.

Values are mean ± standard deviation over runs.

| society | budget | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | knowledge published (bits) | bits per money | cost | waste | sharing | reach L20 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 128 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 13 ± 3 | 0 ± 0 | 0.111 ± 0.026 | – | 0.25 ± 0.09 | 0.00 ± 0.00 | 0.00 |
| Traditional (α = 1, β = 0) | 256 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 20 ± 3 | 0 ± 0 | 0.080 ± 0.011 | – | 0.36 ± 0.08 | 0.00 ± 0.00 | 0.00 |
| Traditional (α = 1, β = 0) | 512 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 29 ± 3 | 0 ± 0 | 0.057 ± 0.007 | – | 0.46 ± 0.06 | 0.00 ± 0.00 | 0.00 |
| Traditional (α = 1, β = 0) | 1024 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 45 ± 5 | 0 ± 0 | 0.044 ± 0.005 | – | 0.53 ± 0.04 | 0.00 ± 0.00 | 0.00 |
| Traditional (α = 1, β = 0) | 2048 | 0.7 ± 3.7 | 0.1 ± 0.4 | 1 ± 6 | 0.00 ± 0.00 | 86 ± 11 | 3 ± 16 | 0.043 ± 0.007 | 1644 ± 0 | 0.60 ± 0.03 | 0.00 ± 0.00 | 0.03 |
| Traditional (α = 1, β = 0) | 4096 | 18.7 ± 5.1 | 1.9 ± 0.5 | 30 ± 8 | 0.01 ± 0.00 | 154 ± 10 | 107 ± 32 | 0.043 ± 0.003 | 3402 ± 365 | 0.68 ± 0.04 | 0.00 ± 0.00 | 0.93 |
| Traditional (α = 1, β = 0) | 8192 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.01 ± 0.00 | 156 ± 7 | 113 ± 12 | 0.044 ± 0.004 | 3371 ± 492 | 0.69 ± 0.04 | 0.01 ± 0.01 | 1.00 |
| Traditional (α = 1, β = 0) | 16384 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.01 ± 0.00 | 156 ± 7 | 115 ± 12 | 0.045 ± 0.004 | 3430 ± 393 | 0.69 ± 0.04 | 0.01 ± 0.01 | 1.00 |
| Traditional (α = 1, β = 0) | 32768 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.01 ± 0.00 | 158 ± 5 | 115 ± 12 | 0.044 ± 0.004 | 3525 ± 429 | 0.69 ± 0.04 | 0.02 ± 0.02 | 1.00 |
| OSO (α = 0.8, β = 1) | 128 | 5.6 ± 2.5 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 26 ± 10 | 26 ± 10 | 0.220 ± 0.084 | – | 0.07 ± 0.03 | 1.00 ± 0.00 | 0.00 |
| OSO (α = 0.8, β = 1) | 256 | 12.3 ± 3.7 | 0.1 ± 0.3 | 1 ± 4 | 0.00 ± 0.02 | 65 ± 16 | 65 ± 16 | 0.257 ± 0.065 | 252 ± 0 | 0.09 ± 0.03 | 1.00 ± 0.00 | 0.07 |
| OSO (α = 0.8, β = 1) | 512 | 20.0 ± 0.2 | 1.8 ± 0.5 | 28 ± 8 | 0.07 ± 0.02 | 135 ± 14 | 135 ± 14 | 0.319 ± 0.046 | 382 ± 75 | 0.11 ± 0.04 | 1.00 ± 0.00 | 0.97 |
| OSO (α = 0.8, β = 1) | 1024 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.08 ± 0.01 | 137 ± 15 | 137 ± 15 | 0.321 ± 0.043 | 387 ± 79 | 0.11 ± 0.04 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 2048 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.08 ± 0.01 | 141 ± 16 | 141 ± 16 | 0.330 ± 0.042 | 384 ± 73 | 0.12 ± 0.05 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 4096 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.08 ± 0.02 | 141 ± 17 | 141 ± 17 | 0.333 ± 0.059 | 384 ± 88 | 0.13 ± 0.06 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 8192 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.08 ± 0.01 | 146 ± 14 | 146 ± 14 | 0.343 ± 0.051 | 404 ± 77 | 0.13 ± 0.03 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 16384 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.07 ± 0.01 | 157 ± 12 | 157 ± 12 | 0.353 ± 0.044 | 427 ± 75 | 0.16 ± 0.06 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 32768 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.07 ± 0.01 | 164 ± 1 | 164 ± 1 | 0.363 ± 0.037 | 446 ± 66 | 0.18 ± 0.05 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 128 | 6.1 ± 2.3 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 29 ± 9 | 29 ± 9 | 0.239 ± 0.076 | – | 0.08 ± 0.03 | 1.00 ± 0.00 | 0.00 |
| OSO (α = 0.2, β = 1) | 256 | 13.6 ± 3.5 | 0.0 ± 0.2 | 1 ± 3 | 0.00 ± 0.01 | 70 ± 17 | 70 ± 17 | 0.278 ± 0.068 | 240 ± 0 | 0.09 ± 0.03 | 1.00 ± 0.00 | 0.03 |
| OSO (α = 0.2, β = 1) | 512 | 20.0 ± 0.0 | 1.9 ± 0.3 | 30 ± 5 | 0.07 ± 0.02 | 140 ± 16 | 140 ± 16 | 0.339 ± 0.044 | 375 ± 63 | 0.12 ± 0.04 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 1024 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.08 ± 0.01 | 142 ± 16 | 142 ± 16 | 0.340 ± 0.042 | 375 ± 63 | 0.12 ± 0.04 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 2048 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.08 ± 0.01 | 144 ± 15 | 144 ± 15 | 0.343 ± 0.037 | 375 ± 54 | 0.13 ± 0.04 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 4096 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.08 ± 0.01 | 148 ± 16 | 148 ± 16 | 0.349 ± 0.051 | 377 ± 59 | 0.14 ± 0.04 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 8192 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.07 ± 0.01 | 151 ± 11 | 151 ± 11 | 0.348 ± 0.044 | 400 ± 78 | 0.14 ± 0.05 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 16384 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.07 ± 0.01 | 157 ± 10 | 157 ± 10 | 0.351 ± 0.038 | 423 ± 53 | 0.15 ± 0.05 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 32768 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.07 ± 0.01 | 164 ± 1 | 164 ± 1 | 0.381 ± 0.047 | 424 ± 73 | 0.18 ± 0.06 | 1.00 ± 0.00 | 1.00 |
| α = 0.8, β = 0.5 | 128 | 3.6 ± 1.9 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 20 ± 8 | 15 ± 8 | 0.170 ± 0.069 | – | 0.17 ± 0.06 | 0.53 ± 0.20 | 0.00 |
| α = 0.8, β = 0.5 | 256 | 7.4 ± 2.8 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 43 ± 13 | 36 ± 14 | 0.170 ± 0.052 | – | 0.21 ± 0.04 | 0.53 ± 0.13 | 0.00 |
| α = 0.8, β = 0.5 | 512 | 16.4 ± 3.8 | 0.3 ± 0.5 | 4 ± 8 | 0.01 ± 0.02 | 96 ± 25 | 85 ± 23 | 0.190 ± 0.049 | 464 ± 56 | 0.27 ± 0.04 | 0.52 ± 0.08 | 0.27 |
| α = 0.8, β = 0.5 | 1024 | 20.0 ± 0.0 | 2.0 ± 0.2 | 31 ± 3 | 0.05 ± 0.01 | 142 ± 13 | 133 ± 14 | 0.212 ± 0.035 | 621 ± 149 | 0.31 ± 0.05 | 0.53 ± 0.06 | 1.00 |
| α = 0.8, β = 0.5 | 2048 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.05 ± 0.01 | 144 ± 13 | 134 ± 15 | 0.206 ± 0.027 | 630 ± 107 | 0.32 ± 0.04 | 0.53 ± 0.06 | 1.00 |
| α = 0.8, β = 0.5 | 4096 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.05 ± 0.01 | 140 ± 12 | 131 ± 13 | 0.221 ± 0.030 | 594 ± 111 | 0.30 ± 0.06 | 0.60 ± 0.06 | 1.00 |
| α = 0.8, β = 0.5 | 8192 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.05 ± 0.01 | 146 ± 11 | 137 ± 12 | 0.210 ± 0.037 | 664 ± 130 | 0.33 ± 0.04 | 0.66 ± 0.07 | 1.00 |
| α = 0.8, β = 0.5 | 16384 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.05 ± 0.01 | 156 ± 9 | 151 ± 13 | 0.219 ± 0.026 | 652 ± 108 | 0.36 ± 0.05 | 0.78 ± 0.05 | 1.00 |
| α = 0.8, β = 0.5 | 32768 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.05 ± 0.01 | 162 ± 5 | 160 ± 8 | 0.227 ± 0.032 | 682 ± 125 | 0.40 ± 0.07 | 0.88 ± 0.05 | 1.00 |
| α = 1, β = 1 | 128 | 6.3 ± 3.5 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 28 ± 11 | 28 ± 11 | 0.232 ± 0.091 | – | 0.07 ± 0.03 | 1.00 ± 0.00 | 0.00 |
| α = 1, β = 1 | 256 | 12.4 ± 3.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 65 ± 17 | 65 ± 17 | 0.256 ± 0.069 | – | 0.09 ± 0.04 | 1.00 ± 0.00 | 0.00 |
| α = 1, β = 1 | 512 | 19.9 ± 0.4 | 1.8 ± 0.5 | 29 ± 7 | 0.07 ± 0.02 | 134 ± 13 | 134 ± 13 | 0.319 ± 0.045 | 387 ± 65 | 0.11 ± 0.05 | 1.00 ± 0.00 | 0.97 |
| α = 1, β = 1 | 1024 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.08 ± 0.01 | 136 ± 13 | 136 ± 13 | 0.321 ± 0.041 | 392 ± 70 | 0.11 ± 0.05 | 1.00 ± 0.00 | 1.00 |
| α = 1, β = 1 | 2048 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.07 ± 0.01 | 142 ± 15 | 142 ± 15 | 0.322 ± 0.057 | 394 ± 81 | 0.12 ± 0.05 | 1.00 ± 0.00 | 1.00 |
| α = 1, β = 1 | 4096 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.08 ± 0.01 | 140 ± 14 | 140 ± 14 | 0.329 ± 0.058 | 401 ± 80 | 0.12 ± 0.04 | 1.00 ± 0.00 | 1.00 |
| α = 1, β = 1 | 8192 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.07 ± 0.01 | 148 ± 14 | 148 ± 14 | 0.341 ± 0.040 | 404 ± 69 | 0.13 ± 0.05 | 1.00 ± 0.00 | 1.00 |
| α = 1, β = 1 | 16384 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.07 ± 0.01 | 155 ± 13 | 155 ± 13 | 0.347 ± 0.054 | 420 ± 72 | 0.16 ± 0.06 | 1.00 ± 0.00 | 1.00 |
| α = 1, β = 1 | 32768 | 20.0 ± 0.0 | 2.0 ± 0.0 | 32 ± 0 | 0.07 ± 0.01 | 163 ± 3 | 163 ± 3 | 0.367 ± 0.050 | 431 ± 84 | 0.17 ± 0.06 | 1.00 ± 0.00 | 1.00 |

Code: commit `99f92ba`. Experiment: [config/experiments/simple-ideas-20x4-p2-len3g2-new2-deep-scaling-20261025.yaml](../../config/experiments/simple-ideas-20x4-p2-len3g2-new2-deep-scaling-20261025.yaml). Command: `npm run sim -- simple-ideas-20x4-p2-len3g2-new2-deep-scaling-20261025 --seeds 30 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
