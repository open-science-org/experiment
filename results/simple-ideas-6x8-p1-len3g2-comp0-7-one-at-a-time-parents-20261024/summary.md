# Scaling, parents 1 (else default)

**Question:** With parents 1 and everything else as the default graph, how does what each society achieves grow with its budget?

**Answer:** At budget 50: best OSO (α = 0.2, β = 1). Against traditional, clearly better on hardest level, knowledge found (bits) and knowledge per unit of money; no clear difference on targets solved, bounty value, ROI and waste. At budget 100: best OSO (α = 0.8, β = 1). Against traditional, clearly better on hardest level, knowledge found (bits) and knowledge per unit of money; no clear difference on targets solved, bounty value, ROI and waste. At budget 200: best OSO (α = 0.8, β = 1). Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money and waste. At budget 400: best OSO (α = 0.8, β = 1). Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money and waste; no clear difference on money to the main level. At budget 800: best OSO (α = 0.8, β = 1). Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money, money to the main level and waste. At budgets 1600–25600: best OSO (α = 0.8, β = 1). Against traditional, clearly better on ROI, knowledge per unit of money, money to the main level and waste; no clear difference on hardest level, targets solved, bounty value and knowledge found (bits). At budget 51200: best OSO (α = 0.8, β = 1). Against traditional, clearly better on ROI, knowledge found (bits), knowledge per unit of money, money to the main level and waste; no clear difference on hardest level, targets solved and bounty value. At budget 102400: best OSO (α = 0.8, β = 1). Against traditional, clearly better on ROI, knowledge found (bits), knowledge per unit of money and money to the main level; no clear difference on hardest level, targets solved, bounty value and waste. (Compared at each budget; 8 measures, a clear difference is more than 2.7 standard errors.)

- Budget 50: hardest level: 2.65 against traditional 0.00, clearly better. targets solved: 0.00 against traditional 0.00, no clear difference.
- Budget 100: hardest level: 3.35 against traditional 0.00, clearly better. targets solved: 0.10 against traditional 0.00, no clear difference.
- Budget 200: hardest level: 5.30 against traditional 0.00, clearly better. targets solved: 0.30 against traditional 0.00, clearly better.
- Budget 400: hardest level: 5.95 against traditional 0.30, clearly better. targets solved: 1.60 against traditional 0.05, clearly better.
- Budget 800: hardest level: 6.00 against traditional 2.40, clearly better. targets solved: 1.80 against traditional 0.40, clearly better.
- Budget 1600: hardest level: 6.00 against traditional 5.70, no clear difference. targets solved: 2.00 against traditional 1.80, no clear difference.
- Budget 3200: hardest level: 6.00 against traditional 5.70, no clear difference. targets solved: 2.00 against traditional 1.85, no clear difference.
- Budget 6400: hardest level: 6.00 against traditional 6.00, no clear difference. targets solved: 2.00 against traditional 1.95, no clear difference.
- Budget 12800: hardest level: 6.00 against traditional 6.00, no clear difference. targets solved: 2.00 against traditional 2.00, no clear difference.
- Budget 25600: hardest level: 6.00 against traditional 6.00, no clear difference. targets solved: 2.00 against traditional 2.00, no clear difference.
- Budget 51200: hardest level: 6.00 against traditional 6.00, no clear difference. targets solved: 2.00 against traditional 2.00, no clear difference.
- Budget 102400: hardest level: 6.00 against traditional 6.00, no clear difference. targets solved: 2.00 against traditional 2.00, no clear difference.

![Scaling, parents 1 (else default)](figures/compare.svg)

| society | budget | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | bits per money | cost | waste |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 50 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 4 ± 3 | 0.090 ± 0.071 | – | 0.52 ± 0.13 |
| Traditional (α = 1, β = 0) | 100 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 9 ± 4 | 0.095 ± 0.043 | – | 0.58 ± 0.14 |
| Traditional (α = 1, β = 0) | 200 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 18 ± 5 | 0.094 ± 0.023 | – | 0.68 ± 0.12 |
| Traditional (α = 1, β = 0) | 400 | 0.3 ± 1.3 | 0.1 ± 0.2 | 6 ± 29 | 0.02 ± 0.07 | 32 ± 7 | 0.081 ± 0.019 | 252 ± 0 | 0.77 ± 0.08 |
| Traditional (α = 1, β = 0) | 800 | 2.4 ± 3.0 | 0.4 ± 0.5 | 51 ± 64 | 0.06 ± 0.08 | 54 ± 8 | 0.068 ± 0.010 | 548 ± 136 | 0.82 ± 0.06 |
| Traditional (α = 1, β = 0) | 1600 | 5.7 ± 1.3 | 1.8 ± 0.5 | 230 ± 67 | 0.24 ± 0.13 | 72 ± 14 | 0.068 ± 0.016 | 714 ± 243 | 0.85 ± 0.04 |
| Traditional (α = 1, β = 0) | 3200 | 5.7 ± 1.3 | 1.9 ± 0.5 | 237 ± 63 | 0.20 ± 0.12 | 82 ± 20 | 0.059 ± 0.017 | 1009 ± 422 | 0.85 ± 0.03 |
| Traditional (α = 1, β = 0) | 6400 | 6.0 ± 0.0 | 1.9 ± 0.2 | 250 ± 29 | 0.21 ± 0.07 | 86 ± 22 | 0.066 ± 0.020 | 904 ± 562 | 0.86 ± 0.05 |
| Traditional (α = 1, β = 0) | 12800 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.25 ± 0.09 | 78 ± 16 | 0.072 ± 0.021 | 764 ± 295 | 0.87 ± 0.04 |
| Traditional (α = 1, β = 0) | 25600 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.25 ± 0.11 | 80 ± 20 | 0.071 ± 0.019 | 880 ± 260 | 0.87 ± 0.03 |
| Traditional (α = 1, β = 0) | 51200 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.21 ± 0.12 | 90 ± 22 | 0.066 ± 0.019 | 1063 ± 469 | 0.88 ± 0.03 |
| Traditional (α = 1, β = 0) | 102400 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.17 ± 0.08 | 101 ± 18 | 0.064 ± 0.021 | 1235 ± 647 | 0.89 ± 0.03 |
| OSO (α = 0.8, β = 1) | 50 | 1.9 ± 1.5 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 8 ± 6 | 0.165 ± 0.133 | – | 0.49 ± 0.11 |
| OSO (α = 0.8, β = 1) | 100 | 3.4 ± 1.5 | 0.1 ± 0.3 | 13 ± 39 | 0.13 ± 0.41 | 17 ± 9 | 0.181 ± 0.093 | 66 ± 8 | 0.51 ± 0.09 |
| OSO (α = 0.8, β = 1) | 200 | 5.3 ± 0.7 | 0.3 ± 0.5 | 38 ± 60 | 0.20 ± 0.31 | 42 ± 8 | 0.219 ± 0.043 | 150 ± 54 | 0.54 ± 0.09 |
| OSO (α = 0.8, β = 1) | 400 | 6.0 ± 0.2 | 1.6 ± 0.6 | 205 ± 77 | 0.75 ± 0.39 | 74 ± 15 | 0.244 ± 0.049 | 201 ± 60 | 0.59 ± 0.09 |
| OSO (α = 0.8, β = 1) | 800 | 6.0 ± 0.0 | 1.8 ± 0.5 | 230 ± 67 | 0.77 ± 0.38 | 82 ± 24 | 0.231 ± 0.061 | 224 ± 118 | 0.57 ± 0.08 |
| OSO (α = 0.8, β = 1) | 1600 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.81 ± 0.23 | 79 ± 21 | 0.236 ± 0.045 | 217 ± 105 | 0.58 ± 0.06 |
| OSO (α = 0.8, β = 1) | 3200 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.96 ± 0.57 | 75 ± 27 | 0.232 ± 0.065 | 252 ± 126 | 0.56 ± 0.08 |
| OSO (α = 0.8, β = 1) | 6400 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 1.00 ± 0.55 | 74 ± 25 | 0.254 ± 0.085 | 205 ± 95 | 0.60 ± 0.08 |
| OSO (α = 0.8, β = 1) | 12800 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.85 ± 0.31 | 78 ± 25 | 0.236 ± 0.062 | 247 ± 162 | 0.63 ± 0.08 |
| OSO (α = 0.8, β = 1) | 25600 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.74 ± 0.37 | 96 ± 27 | 0.244 ± 0.066 | 258 ± 155 | 0.68 ± 0.09 |
| OSO (α = 0.8, β = 1) | 51200 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.56 ± 0.11 | 109 ± 20 | 0.236 ± 0.051 | 442 ± 97 | 0.73 ± 0.07 |
| OSO (α = 0.8, β = 1) | 102400 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.36 ± 0.10 | 141 ± 8 | 0.200 ± 0.060 | 727 ± 155 | 0.83 ± 0.10 |
| OSO (α = 0.2, β = 1) | 50 | 2.6 ± 1.2 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 12 ± 6 | 0.251 ± 0.133 | – | 0.54 ± 0.15 |
| OSO (α = 0.2, β = 1) | 100 | 4.1 ± 1.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 24 ± 8 | 0.255 ± 0.082 | – | 0.58 ± 0.12 |
| OSO (α = 0.2, β = 1) | 200 | 5.1 ± 0.6 | 0.1 ± 0.4 | 19 ± 47 | 0.10 ± 0.24 | 50 ± 13 | 0.260 ± 0.067 | 146 ± 31 | 0.66 ± 0.10 |
| OSO (α = 0.2, β = 1) | 400 | 6.0 ± 0.2 | 1.7 ± 0.6 | 218 ± 73 | 0.72 ± 0.31 | 91 ± 13 | 0.290 ± 0.065 | 226 ± 59 | 0.70 ± 0.08 |
| OSO (α = 0.2, β = 1) | 800 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.78 ± 0.22 | 97 ± 14 | 0.287 ± 0.070 | 248 ± 113 | 0.69 ± 0.09 |
| OSO (α = 0.2, β = 1) | 1600 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.85 ± 0.34 | 90 ± 16 | 0.283 ± 0.082 | 239 ± 95 | 0.67 ± 0.09 |
| OSO (α = 0.2, β = 1) | 3200 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.87 ± 0.46 | 89 ± 20 | 0.276 ± 0.096 | 247 ± 174 | 0.68 ± 0.09 |
| OSO (α = 0.2, β = 1) | 6400 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.76 ± 0.29 | 101 ± 19 | 0.285 ± 0.072 | 229 ± 86 | 0.70 ± 0.08 |
| OSO (α = 0.2, β = 1) | 12800 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.86 ± 0.26 | 89 ± 20 | 0.284 ± 0.063 | 236 ± 93 | 0.72 ± 0.10 |
| OSO (α = 0.2, β = 1) | 25600 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.76 ± 0.35 | 101 ± 27 | 0.267 ± 0.078 | 258 ± 96 | 0.69 ± 0.11 |
| OSO (α = 0.2, β = 1) | 51200 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.61 ± 0.00 | 108 ± 17 | 0.258 ± 0.040 | 420 ± 0 | 0.76 ± 0.08 |
| OSO (α = 0.2, β = 1) | 102400 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.39 ± 0.13 | 142 ± 9 | 0.217 ± 0.076 | 694 ± 176 | 0.85 ± 0.09 |
| α = 0.8, β = 0.5 | 50 | 1.1 ± 1.3 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 7 ± 5 | 0.139 ± 0.113 | – | 0.50 ± 0.12 |
| α = 0.8, β = 0.5 | 100 | 2.0 ± 1.3 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 14 ± 7 | 0.147 ± 0.074 | – | 0.55 ± 0.11 |
| α = 0.8, β = 0.5 | 200 | 4.0 ± 1.3 | 0.1 ± 0.3 | 13 ± 39 | 0.07 ± 0.21 | 28 ± 10 | 0.146 ± 0.054 | 150 ± 42 | 0.59 ± 0.10 |
| α = 0.8, β = 0.5 | 400 | 5.8 ± 0.6 | 1.2 ± 0.8 | 154 ± 107 | 0.49 ± 0.40 | 55 ± 13 | 0.163 ± 0.052 | 269 ± 69 | 0.65 ± 0.08 |
| α = 0.8, β = 0.5 | 800 | 6.0 ± 0.2 | 1.6 ± 0.6 | 211 ± 75 | 0.57 ± 0.35 | 72 ± 14 | 0.163 ± 0.051 | 313 ± 128 | 0.68 ± 0.06 |
| α = 0.8, β = 0.5 | 1600 | 6.0 ± 0.0 | 1.9 ± 0.2 | 250 ± 29 | 0.50 ± 0.19 | 86 ± 18 | 0.161 ± 0.044 | 345 ± 138 | 0.68 ± 0.09 |
| α = 0.8, β = 0.5 | 3200 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.61 ± 0.35 | 76 ± 25 | 0.155 ± 0.039 | 307 ± 188 | 0.68 ± 0.07 |
| α = 0.8, β = 0.5 | 6400 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.65 ± 0.22 | 77 ± 21 | 0.180 ± 0.036 | 295 ± 119 | 0.69 ± 0.09 |
| α = 0.8, β = 0.5 | 12800 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.65 ± 0.28 | 78 ± 23 | 0.180 ± 0.052 | 312 ± 136 | 0.70 ± 0.06 |
| α = 0.8, β = 0.5 | 25600 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.59 ± 0.27 | 84 ± 24 | 0.176 ± 0.046 | 301 ± 110 | 0.73 ± 0.06 |
| α = 0.8, β = 0.5 | 51200 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.54 ± 0.15 | 88 ± 22 | 0.176 ± 0.036 | 420 ± 0 | 0.74 ± 0.09 |
| α = 0.8, β = 0.5 | 102400 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.28 ± 0.05 | 123 ± 17 | 0.135 ± 0.028 | 852 ± 0 | 0.82 ± 0.05 |

**Design** (fixed before the run): compared four societies × budgets 50 to 102400 · held the same: a generated idea graph (6 levels × 8 ideas, 1 parents each, sequences of 3 bits growing by 2 per level, composition 0.7), 12 identical agents, budget 50 split equally, no mint, no validation · measure: all of hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money, money to the main level, waste · 20 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The simple model on a generated idea graph (6 levels × 8 ideas, 1 parents each, sequences of 3 bits growing by 2 per level, composition 0.7); each run draws its own graph. Only α and β vary. Held fixed: 12 identical agents, a budget of 50 split equally every round (f = 0), no flat mint, a knowledge reward of 1 per new bit flowing back with α, no validation.

Values are mean ± standard deviation over runs.

| society | budget | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | knowledge published (bits) | bits per money | cost | waste | sharing | reach L6 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 50 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 4 ± 3 | 0 ± 0 | 0.090 ± 0.071 | – | 0.52 ± 0.13 | 0.00 ± 0.00 | 0.00 |
| Traditional (α = 1, β = 0) | 100 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 9 ± 4 | 0 ± 0 | 0.095 ± 0.043 | – | 0.58 ± 0.14 | 0.00 ± 0.00 | 0.00 |
| Traditional (α = 1, β = 0) | 200 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 18 ± 5 | 0 ± 0 | 0.094 ± 0.023 | – | 0.68 ± 0.12 | 0.00 ± 0.00 | 0.00 |
| Traditional (α = 1, β = 0) | 400 | 0.3 ± 1.3 | 0.1 ± 0.2 | 6 ± 29 | 0.02 ± 0.07 | 32 ± 7 | 1 ± 3 | 0.081 ± 0.019 | 252 ± 0 | 0.77 ± 0.08 | 0.00 ± 0.00 | 0.05 |
| Traditional (α = 1, β = 0) | 800 | 2.4 ± 3.0 | 0.4 ± 0.5 | 51 ± 64 | 0.06 ± 0.08 | 54 ± 8 | 7 ± 8 | 0.068 ± 0.010 | 548 ± 136 | 0.82 ± 0.06 | 0.00 ± 0.00 | 0.40 |
| Traditional (α = 1, β = 0) | 1600 | 5.7 ± 1.3 | 1.8 ± 0.5 | 230 ± 67 | 0.24 ± 0.13 | 72 ± 14 | 26 ± 8 | 0.068 ± 0.016 | 714 ± 243 | 0.85 ± 0.04 | 0.00 ± 0.00 | 0.95 |
| Traditional (α = 1, β = 0) | 3200 | 5.7 ± 1.3 | 1.9 ± 0.5 | 237 ± 63 | 0.20 ± 0.12 | 82 ± 20 | 27 ± 8 | 0.059 ± 0.017 | 1009 ± 422 | 0.85 ± 0.03 | 0.00 ± 0.00 | 0.95 |
| Traditional (α = 1, β = 0) | 6400 | 6.0 ± 0.0 | 1.9 ± 0.2 | 250 ± 29 | 0.21 ± 0.07 | 86 ± 22 | 28 ± 5 | 0.066 ± 0.020 | 904 ± 562 | 0.86 ± 0.05 | 0.00 ± 0.00 | 1.00 |
| Traditional (α = 1, β = 0) | 12800 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.25 ± 0.09 | 78 ± 16 | 29 ± 5 | 0.072 ± 0.021 | 764 ± 295 | 0.87 ± 0.04 | 0.00 ± 0.01 | 1.00 |
| Traditional (α = 1, β = 0) | 25600 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.25 ± 0.11 | 80 ± 20 | 29 ± 5 | 0.071 ± 0.019 | 880 ± 260 | 0.87 ± 0.03 | 0.01 ± 0.03 | 1.00 |
| Traditional (α = 1, β = 0) | 51200 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.21 ± 0.12 | 90 ± 22 | 29 ± 5 | 0.066 ± 0.019 | 1063 ± 469 | 0.88 ± 0.03 | 0.05 ± 0.08 | 1.00 |
| Traditional (α = 1, β = 0) | 102400 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.17 ± 0.08 | 101 ± 18 | 29 ± 5 | 0.064 ± 0.021 | 1235 ± 647 | 0.89 ± 0.03 | 0.13 ± 0.11 | 1.00 |
| OSO (α = 0.8, β = 1) | 50 | 1.9 ± 1.5 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 8 ± 6 | 8 ± 6 | 0.165 ± 0.133 | – | 0.49 ± 0.11 | 0.70 ± 0.47 | 0.00 |
| OSO (α = 0.8, β = 1) | 100 | 3.4 ± 1.5 | 0.1 ± 0.3 | 13 ± 39 | 0.13 ± 0.41 | 17 ± 9 | 17 ± 9 | 0.181 ± 0.093 | 66 ± 8 | 0.51 ± 0.09 | 0.95 ± 0.22 | 0.10 |
| OSO (α = 0.8, β = 1) | 200 | 5.3 ± 0.7 | 0.3 ± 0.5 | 38 ± 60 | 0.20 ± 0.31 | 42 ± 8 | 42 ± 8 | 0.219 ± 0.043 | 150 ± 54 | 0.54 ± 0.09 | 1.00 ± 0.00 | 0.40 |
| OSO (α = 0.8, β = 1) | 400 | 6.0 ± 0.2 | 1.6 ± 0.6 | 205 ± 77 | 0.75 ± 0.39 | 74 ± 15 | 74 ± 15 | 0.244 ± 0.049 | 201 ± 60 | 0.59 ± 0.09 | 1.00 ± 0.00 | 0.95 |
| OSO (α = 0.8, β = 1) | 800 | 6.0 ± 0.0 | 1.8 ± 0.5 | 230 ± 67 | 0.77 ± 0.38 | 82 ± 24 | 82 ± 24 | 0.231 ± 0.061 | 224 ± 118 | 0.57 ± 0.08 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 1600 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.81 ± 0.23 | 79 ± 21 | 79 ± 21 | 0.236 ± 0.045 | 217 ± 105 | 0.58 ± 0.06 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 3200 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.96 ± 0.57 | 75 ± 27 | 75 ± 27 | 0.232 ± 0.065 | 252 ± 126 | 0.56 ± 0.08 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 6400 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 1.00 ± 0.55 | 74 ± 25 | 74 ± 25 | 0.254 ± 0.085 | 205 ± 95 | 0.60 ± 0.08 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 12800 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.85 ± 0.31 | 78 ± 25 | 78 ± 25 | 0.236 ± 0.062 | 247 ± 162 | 0.63 ± 0.08 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 25600 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.74 ± 0.37 | 96 ± 27 | 96 ± 27 | 0.244 ± 0.066 | 258 ± 155 | 0.68 ± 0.09 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 51200 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.56 ± 0.11 | 109 ± 20 | 109 ± 20 | 0.236 ± 0.051 | 442 ± 97 | 0.73 ± 0.07 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 102400 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.36 ± 0.10 | 141 ± 8 | 141 ± 8 | 0.200 ± 0.060 | 727 ± 155 | 0.83 ± 0.10 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 50 | 2.6 ± 1.2 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 12 ± 6 | 12 ± 6 | 0.251 ± 0.133 | – | 0.54 ± 0.15 | 1.00 ± 0.00 | 0.00 |
| OSO (α = 0.2, β = 1) | 100 | 4.1 ± 1.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 24 ± 8 | 24 ± 8 | 0.255 ± 0.082 | – | 0.58 ± 0.12 | 1.00 ± 0.00 | 0.00 |
| OSO (α = 0.2, β = 1) | 200 | 5.1 ± 0.6 | 0.1 ± 0.4 | 19 ± 47 | 0.10 ± 0.24 | 50 ± 13 | 50 ± 13 | 0.260 ± 0.067 | 146 ± 31 | 0.66 ± 0.10 | 1.00 ± 0.00 | 0.25 |
| OSO (α = 0.2, β = 1) | 400 | 6.0 ± 0.2 | 1.7 ± 0.6 | 218 ± 73 | 0.72 ± 0.31 | 91 ± 13 | 91 ± 13 | 0.290 ± 0.065 | 226 ± 59 | 0.70 ± 0.08 | 1.00 ± 0.00 | 0.95 |
| OSO (α = 0.2, β = 1) | 800 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.78 ± 0.22 | 97 ± 14 | 97 ± 14 | 0.287 ± 0.070 | 248 ± 113 | 0.69 ± 0.09 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 1600 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.85 ± 0.34 | 90 ± 16 | 90 ± 16 | 0.283 ± 0.082 | 239 ± 95 | 0.67 ± 0.09 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 3200 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.87 ± 0.46 | 89 ± 20 | 89 ± 20 | 0.276 ± 0.096 | 247 ± 174 | 0.68 ± 0.09 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 6400 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.76 ± 0.29 | 101 ± 19 | 101 ± 19 | 0.285 ± 0.072 | 229 ± 86 | 0.70 ± 0.08 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 12800 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.86 ± 0.26 | 89 ± 20 | 89 ± 20 | 0.284 ± 0.063 | 236 ± 93 | 0.72 ± 0.10 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 25600 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.76 ± 0.35 | 101 ± 27 | 101 ± 27 | 0.267 ± 0.078 | 258 ± 96 | 0.69 ± 0.11 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 51200 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.61 ± 0.00 | 108 ± 17 | 108 ± 17 | 0.258 ± 0.040 | 420 ± 0 | 0.76 ± 0.08 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 102400 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.39 ± 0.13 | 142 ± 9 | 142 ± 9 | 0.217 ± 0.076 | 694 ± 176 | 0.85 ± 0.09 | 1.00 ± 0.00 | 1.00 |
| α = 0.8, β = 0.5 | 50 | 1.1 ± 1.3 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 7 ± 5 | 4 ± 4 | 0.139 ± 0.113 | – | 0.50 ± 0.12 | 0.35 ± 0.35 | 0.00 |
| α = 0.8, β = 0.5 | 100 | 2.0 ± 1.3 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 14 ± 7 | 9 ± 7 | 0.147 ± 0.074 | – | 0.55 ± 0.11 | 0.45 ± 0.29 | 0.00 |
| α = 0.8, β = 0.5 | 200 | 4.0 ± 1.3 | 0.1 ± 0.3 | 13 ± 39 | 0.07 ± 0.21 | 28 ± 10 | 21 ± 9 | 0.146 ± 0.054 | 150 ± 42 | 0.59 ± 0.10 | 0.55 ± 0.13 | 0.10 |
| α = 0.8, β = 0.5 | 400 | 5.8 ± 0.6 | 1.2 ± 0.8 | 154 ± 107 | 0.49 ± 0.40 | 55 ± 13 | 47 ± 13 | 0.163 ± 0.052 | 269 ± 69 | 0.65 ± 0.08 | 0.55 ± 0.10 | 0.80 |
| α = 0.8, β = 0.5 | 800 | 6.0 ± 0.2 | 1.6 ± 0.6 | 211 ± 75 | 0.57 ± 0.35 | 72 ± 14 | 60 ± 14 | 0.163 ± 0.051 | 313 ± 128 | 0.68 ± 0.06 | 0.53 ± 0.11 | 0.95 |
| α = 0.8, β = 0.5 | 1600 | 6.0 ± 0.0 | 1.9 ± 0.2 | 250 ± 29 | 0.50 ± 0.19 | 86 ± 18 | 76 ± 17 | 0.161 ± 0.044 | 345 ± 138 | 0.68 ± 0.09 | 0.55 ± 0.10 | 1.00 |
| α = 0.8, β = 0.5 | 3200 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.61 ± 0.35 | 76 ± 25 | 67 ± 24 | 0.155 ± 0.039 | 307 ± 188 | 0.68 ± 0.07 | 0.61 ± 0.12 | 1.00 |
| α = 0.8, β = 0.5 | 6400 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.65 ± 0.22 | 77 ± 21 | 66 ± 20 | 0.180 ± 0.036 | 295 ± 119 | 0.69 ± 0.09 | 0.61 ± 0.09 | 1.00 |
| α = 0.8, β = 0.5 | 12800 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.65 ± 0.28 | 78 ± 23 | 69 ± 25 | 0.180 ± 0.052 | 312 ± 136 | 0.70 ± 0.06 | 0.69 ± 0.10 | 1.00 |
| α = 0.8, β = 0.5 | 25600 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.59 ± 0.27 | 84 ± 24 | 73 ± 25 | 0.176 ± 0.046 | 301 ± 110 | 0.73 ± 0.06 | 0.75 ± 0.08 | 1.00 |
| α = 0.8, β = 0.5 | 51200 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.54 ± 0.15 | 88 ± 22 | 78 ± 24 | 0.176 ± 0.036 | 420 ± 0 | 0.74 ± 0.09 | 0.83 ± 0.08 | 1.00 |
| α = 0.8, β = 0.5 | 102400 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.28 ± 0.05 | 123 ± 17 | 115 ± 18 | 0.135 ± 0.028 | 852 ± 0 | 0.82 ± 0.05 | 0.94 ± 0.05 | 1.00 |

Code: commit `94d7303` (with uncommitted changes). Experiment: [config/experiments/simple-ideas-6x8-p1-len3g2-comp0-7-one-at-a-time-parents-20261024.yaml](../../config/experiments/simple-ideas-6x8-p1-len3g2-comp0-7-one-at-a-time-parents-20261024.yaml). Command: `npm run sim -- simple-ideas-6x8-p1-len3g2-comp0-7-one-at-a-time-parents-20261024 --seeds 20 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
