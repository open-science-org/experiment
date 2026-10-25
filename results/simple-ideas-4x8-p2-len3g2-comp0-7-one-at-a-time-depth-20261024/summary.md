# Scaling, depth 4 (else default)

**Question:** With depth 4 and everything else as the default graph, how does what each society achieves grow with its budget?

**Answer:** At budget 50: best OSO (α = 0.2, β = 1). Against traditional, clearly better on hardest level, knowledge found (bits) and knowledge per unit of money; no clear difference on targets solved, bounty value, ROI and waste. At budget 100: best OSO (α = 0.2, β = 1). Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, knowledge found (bits) and knowledge per unit of money; no clear difference on waste. At budget 200: best OSO (α = 0.2, β = 1). Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money and waste; no clear difference on money to the main level. At budget 400: best OSO (α = 0.2, β = 1). Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money, money to the main level and waste. At budget 800: best OSO (α = 0.2, β = 1). Against traditional, clearly better on targets solved, bounty value, ROI, knowledge per unit of money, money to the main level and waste; no clear difference on hardest level and knowledge found (bits). At budgets 1600–6400: best OSO (α = 0.8, β = 1). Against traditional, clearly better on ROI, knowledge per unit of money, money to the main level and waste; no clear difference on hardest level, targets solved, bounty value and knowledge found (bits). At budget 12800: best OSO (α = 0.2, β = 1). Against traditional, clearly better on ROI, knowledge per unit of money, money to the main level and waste; no clear difference on hardest level, targets solved, bounty value and knowledge found (bits). At budgets 25600–102400: best OSO (α = 0.8, β = 1). Against traditional, clearly better on ROI, knowledge found (bits), knowledge per unit of money, money to the main level and waste; no clear difference on hardest level, targets solved and bounty value. (Compared at each budget; 8 measures, a clear difference is more than 2.7 standard errors.)

- Budget 50: hardest level: 2.25 against traditional 0.00, clearly better. targets solved: 0.00 against traditional 0.00, no clear difference.
- Budget 100: hardest level: 3.55 against traditional 0.00, clearly better. targets solved: 0.85 against traditional 0.00, clearly better.
- Budget 200: hardest level: 4.00 against traditional 0.20, clearly better. targets solved: 2.00 against traditional 0.05, clearly better.
- Budget 400: hardest level: 4.00 against traditional 0.80, clearly better. targets solved: 2.00 against traditional 0.25, clearly better.
- Budget 800: hardest level: 4.00 against traditional 3.60, no clear difference. targets solved: 2.00 against traditional 1.50, clearly better.
- Budget 1600: hardest level: 4.00 against traditional 4.00, no clear difference. targets solved: 2.00 against traditional 2.00, no clear difference.
- Budget 3200: hardest level: 4.00 against traditional 4.00, no clear difference. targets solved: 2.00 against traditional 2.00, no clear difference.
- Budget 6400: hardest level: 4.00 against traditional 4.00, no clear difference. targets solved: 2.00 against traditional 2.00, no clear difference.
- Budget 12800: hardest level: 4.00 against traditional 4.00, no clear difference. targets solved: 2.00 against traditional 2.00, no clear difference.
- Budget 25600: hardest level: 4.00 against traditional 4.00, no clear difference. targets solved: 2.00 against traditional 2.00, no clear difference.
- Budget 51200: hardest level: 4.00 against traditional 4.00, no clear difference. targets solved: 2.00 against traditional 2.00, no clear difference.
- Budget 102400: hardest level: 4.00 against traditional 4.00, no clear difference. targets solved: 2.00 against traditional 2.00, no clear difference.

![Scaling, depth 4 (else default)](figures/compare.svg)

| society | budget | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | bits per money | cost | waste |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 50 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 6 ± 4 | 0.120 ± 0.090 | – | 0.17 ± 0.08 |
| Traditional (α = 1, β = 0) | 100 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 13 ± 4 | 0.131 ± 0.044 | – | 0.27 ± 0.11 |
| Traditional (α = 1, β = 0) | 200 | 0.2 ± 0.9 | 0.1 ± 0.2 | 2 ± 7 | 0.01 ± 0.04 | 21 ± 5 | 0.108 ± 0.025 | 192 ± 0 | 0.41 ± 0.11 |
| Traditional (α = 1, β = 0) | 400 | 0.8 ± 1.6 | 0.3 ± 0.6 | 8 ± 18 | 0.02 ± 0.05 | 31 ± 5 | 0.079 ± 0.014 | 249 ± 66 | 0.60 ± 0.09 |
| Traditional (α = 1, β = 0) | 800 | 3.6 ± 1.2 | 1.5 ± 0.7 | 48 ± 22 | 0.08 ± 0.05 | 47 ± 6 | 0.072 ± 0.015 | 520 ± 184 | 0.71 ± 0.08 |
| Traditional (α = 1, β = 0) | 1600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.10 ± 0.03 | 51 ± 6 | 0.073 ± 0.016 | 587 ± 242 | 0.73 ± 0.05 |
| Traditional (α = 1, β = 0) | 3200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.09 ± 0.03 | 54 ± 6 | 0.075 ± 0.022 | 617 ± 268 | 0.74 ± 0.04 |
| Traditional (α = 1, β = 0) | 6400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.08 ± 0.03 | 54 ± 10 | 0.067 ± 0.013 | 735 ± 237 | 0.75 ± 0.05 |
| Traditional (α = 1, β = 0) | 12800 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.09 ± 0.03 | 54 ± 8 | 0.071 ± 0.014 | 565 ± 290 | 0.75 ± 0.05 |
| Traditional (α = 1, β = 0) | 25600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.08 ± 0.03 | 60 ± 9 | 0.072 ± 0.020 | 752 ± 272 | 0.79 ± 0.04 |
| Traditional (α = 1, β = 0) | 51200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.07 ± 0.03 | 63 ± 10 | 0.070 ± 0.014 | 766 ± 177 | 0.78 ± 0.05 |
| Traditional (α = 1, β = 0) | 102400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.07 ± 0.01 | 62 ± 8 | 0.066 ± 0.011 | 894 ± 188 | 0.79 ± 0.05 |
| OSO (α = 0.8, β = 1) | 50 | 1.7 ± 1.1 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 9 ± 7 | 0.180 ± 0.143 | – | 0.16 ± 0.06 |
| OSO (α = 0.8, β = 1) | 100 | 3.1 ± 0.9 | 0.5 ± 0.7 | 14 ± 22 | 0.15 ± 0.24 | 24 ± 10 | 0.256 ± 0.113 | 80 ± 13 | 0.18 ± 0.07 |
| OSO (α = 0.8, β = 1) | 200 | 4.0 ± 0.2 | 1.8 ± 0.6 | 56 ± 20 | 0.40 ± 0.19 | 43 ± 6 | 0.294 ± 0.080 | 117 ± 39 | 0.24 ± 0.07 |
| OSO (α = 0.8, β = 1) | 400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.43 ± 0.13 | 45 ± 7 | 0.297 ± 0.077 | 122 ± 43 | 0.24 ± 0.06 |
| OSO (α = 0.8, β = 1) | 800 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.43 ± 0.13 | 45 ± 7 | 0.297 ± 0.077 | 122 ± 43 | 0.24 ± 0.06 |
| OSO (α = 0.8, β = 1) | 1600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.43 ± 0.12 | 46 ± 8 | 0.304 ± 0.074 | 121 ± 42 | 0.25 ± 0.07 |
| OSO (α = 0.8, β = 1) | 3200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.43 ± 0.09 | 49 ± 9 | 0.321 ± 0.066 | 122 ± 37 | 0.27 ± 0.06 |
| OSO (α = 0.8, β = 1) | 6400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.41 ± 0.13 | 51 ± 11 | 0.316 ± 0.089 | 123 ± 39 | 0.33 ± 0.09 |
| OSO (α = 0.8, β = 1) | 12800 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.38 ± 0.15 | 58 ± 11 | 0.334 ± 0.094 | 144 ± 65 | 0.41 ± 0.12 |
| OSO (α = 0.8, β = 1) | 25600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.32 ± 0.06 | 69 ± 8 | 0.339 ± 0.076 | 195 ± 17 | 0.48 ± 0.10 |
| OSO (α = 0.8, β = 1) | 51200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.26 ± 0.03 | 75 ± 2 | 0.306 ± 0.037 | 250 ± 33 | 0.53 ± 0.10 |
| OSO (α = 0.8, β = 1) | 102400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.29 ± 0.05 | 75 ± 2 | 0.337 ± 0.062 | 231 ± 41 | 0.53 ± 0.10 |
| OSO (α = 0.2, β = 1) | 50 | 2.3 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 14 ± 8 | 0.297 ± 0.157 | – | 0.19 ± 0.07 |
| OSO (α = 0.2, β = 1) | 100 | 3.5 ± 0.6 | 0.8 ± 0.9 | 27 ± 28 | 0.30 ± 0.32 | 31 ± 9 | 0.338 ± 0.114 | 80 ± 9 | 0.23 ± 0.07 |
| OSO (α = 0.2, β = 1) | 200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.56 ± 0.15 | 43 ± 5 | 0.369 ± 0.091 | 104 ± 33 | 0.26 ± 0.07 |
| OSO (α = 0.2, β = 1) | 400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.56 ± 0.15 | 43 ± 5 | 0.369 ± 0.091 | 104 ± 33 | 0.26 ± 0.07 |
| OSO (α = 0.2, β = 1) | 800 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.56 ± 0.15 | 43 ± 5 | 0.369 ± 0.091 | 104 ± 33 | 0.26 ± 0.07 |
| OSO (α = 0.2, β = 1) | 1600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.53 ± 0.16 | 45 ± 7 | 0.359 ± 0.087 | 106 ± 36 | 0.27 ± 0.07 |
| OSO (α = 0.2, β = 1) | 3200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.50 ± 0.13 | 50 ± 9 | 0.381 ± 0.079 | 106 ± 31 | 0.30 ± 0.07 |
| OSO (α = 0.2, β = 1) | 6400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.46 ± 0.16 | 54 ± 10 | 0.389 ± 0.154 | 118 ± 47 | 0.36 ± 0.09 |
| OSO (α = 0.2, β = 1) | 12800 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.48 ± 0.17 | 59 ± 15 | 0.408 ± 0.069 | 117 ± 43 | 0.43 ± 0.13 |
| OSO (α = 0.2, β = 1) | 25600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.34 ± 0.06 | 71 ± 5 | 0.373 ± 0.077 | 191 ± 23 | 0.56 ± 0.10 |
| OSO (α = 0.2, β = 1) | 51200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.31 ± 0.08 | 75 ± 2 | 0.364 ± 0.089 | 219 ± 51 | 0.54 ± 0.10 |
| OSO (α = 0.2, β = 1) | 102400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.30 ± 0.06 | 75 ± 2 | 0.347 ± 0.074 | 229 ± 61 | 0.56 ± 0.10 |
| α = 0.8, β = 0.5 | 50 | 1.1 ± 1.2 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 7 ± 6 | 0.151 ± 0.135 | 36 ± 0 | 0.20 ± 0.09 |
| α = 0.8, β = 0.5 | 100 | 2.5 ± 1.1 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 18 ± 8 | 0.186 ± 0.082 | 64 ± 25 | 0.29 ± 0.12 |
| α = 0.8, β = 0.5 | 200 | 3.5 ± 0.8 | 1.0 ± 0.9 | 32 ± 29 | 0.19 ± 0.18 | 36 ± 10 | 0.199 ± 0.067 | 129 ± 44 | 0.38 ± 0.08 |
| α = 0.8, β = 0.5 | 400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.29 ± 0.09 | 46 ± 6 | 0.209 ± 0.056 | 174 ± 79 | 0.40 ± 0.07 |
| α = 0.8, β = 0.5 | 800 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.29 ± 0.09 | 46 ± 6 | 0.209 ± 0.056 | 174 ± 79 | 0.40 ± 0.07 |
| α = 0.8, β = 0.5 | 1600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.27 ± 0.07 | 50 ± 6 | 0.213 ± 0.054 | 184 ± 89 | 0.43 ± 0.07 |
| α = 0.8, β = 0.5 | 3200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.30 ± 0.08 | 50 ± 8 | 0.224 ± 0.051 | 164 ± 72 | 0.47 ± 0.08 |
| α = 0.8, β = 0.5 | 6400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.30 ± 0.08 | 52 ± 7 | 0.236 ± 0.058 | 172 ± 70 | 0.47 ± 0.09 |
| α = 0.8, β = 0.5 | 12800 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.25 ± 0.06 | 59 ± 7 | 0.228 ± 0.061 | 215 ± 92 | 0.52 ± 0.08 |
| α = 0.8, β = 0.5 | 25600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.26 ± 0.08 | 61 ± 12 | 0.231 ± 0.045 | 251 ± 86 | 0.54 ± 0.12 |
| α = 0.8, β = 0.5 | 51200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.16 ± 0.01 | 73 ± 6 | 0.187 ± 0.024 | 393 ± 33 | 0.66 ± 0.09 |
| α = 0.8, β = 0.5 | 102400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.15 ± 0.04 | 75 ± 2 | 0.183 ± 0.043 | 437 ± 119 | 0.70 ± 0.09 |

**Design** (fixed before the run): compared four societies × budgets 50 to 102400 · held the same: a generated idea graph (4 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7), 12 identical agents, budget 50 split equally, no mint, no validation · measure: all of hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money, money to the main level, waste · 20 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The simple model on a generated idea graph (4 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7); each run draws its own graph. Only α and β vary. Held fixed: 12 identical agents, a budget of 50 split equally every round (ρ = 0), no mint, no validation.

Values are mean ± standard deviation over runs.

| society | budget | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | knowledge published (bits) | bits per money | cost | waste | sharing | reach L4 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 50 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 6 ± 4 | 0 ± 0 | 0.120 ± 0.090 | – | 0.17 ± 0.08 | 0.00 ± 0.00 | 0.00 |
| Traditional (α = 1, β = 0) | 100 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 13 ± 4 | 0 ± 0 | 0.131 ± 0.044 | – | 0.27 ± 0.11 | 0.00 ± 0.00 | 0.00 |
| Traditional (α = 1, β = 0) | 200 | 0.2 ± 0.9 | 0.1 ± 0.2 | 2 ± 7 | 0.01 ± 0.04 | 21 ± 5 | 0 ± 2 | 0.108 ± 0.025 | 192 ± 0 | 0.41 ± 0.11 | 0.00 ± 0.00 | 0.05 |
| Traditional (α = 1, β = 0) | 400 | 0.8 ± 1.6 | 0.3 ± 0.6 | 8 ± 18 | 0.02 ± 0.05 | 31 ± 5 | 3 ± 7 | 0.079 ± 0.014 | 249 ± 66 | 0.60 ± 0.09 | 0.00 ± 0.00 | 0.20 |
| Traditional (α = 1, β = 0) | 800 | 3.6 ± 1.2 | 1.5 ± 0.7 | 48 ± 22 | 0.08 ± 0.05 | 47 ± 6 | 23 ± 11 | 0.072 ± 0.015 | 520 ± 184 | 0.71 ± 0.08 | 0.00 ± 0.00 | 0.90 |
| Traditional (α = 1, β = 0) | 1600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.10 ± 0.03 | 51 ± 6 | 32 ± 5 | 0.073 ± 0.016 | 587 ± 242 | 0.73 ± 0.05 | 0.00 ± 0.00 | 1.00 |
| Traditional (α = 1, β = 0) | 3200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.09 ± 0.03 | 54 ± 6 | 33 ± 5 | 0.075 ± 0.022 | 617 ± 268 | 0.74 ± 0.04 | 0.00 ± 0.00 | 1.00 |
| Traditional (α = 1, β = 0) | 6400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.08 ± 0.03 | 54 ± 10 | 33 ± 5 | 0.067 ± 0.013 | 735 ± 237 | 0.75 ± 0.05 | 0.01 ± 0.02 | 1.00 |
| Traditional (α = 1, β = 0) | 12800 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.09 ± 0.03 | 54 ± 8 | 31 ± 4 | 0.071 ± 0.014 | 565 ± 290 | 0.75 ± 0.05 | 0.02 ± 0.06 | 1.00 |
| Traditional (α = 1, β = 0) | 25600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.08 ± 0.03 | 60 ± 9 | 33 ± 4 | 0.072 ± 0.020 | 752 ± 272 | 0.79 ± 0.04 | 0.03 ± 0.05 | 1.00 |
| Traditional (α = 1, β = 0) | 51200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.07 ± 0.03 | 63 ± 10 | 32 ± 5 | 0.070 ± 0.014 | 766 ± 177 | 0.78 ± 0.05 | 0.10 ± 0.14 | 1.00 |
| Traditional (α = 1, β = 0) | 102400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.07 ± 0.01 | 62 ± 8 | 33 ± 4 | 0.066 ± 0.011 | 894 ± 188 | 0.79 ± 0.05 | 0.40 ± 0.17 | 1.00 |
| OSO (α = 0.8, β = 1) | 50 | 1.7 ± 1.1 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 9 ± 7 | 9 ± 7 | 0.180 ± 0.143 | – | 0.16 ± 0.06 | 0.75 ± 0.44 | 0.00 |
| OSO (α = 0.8, β = 1) | 100 | 3.1 ± 0.9 | 0.5 ± 0.7 | 14 ± 22 | 0.15 ± 0.24 | 24 ± 10 | 24 ± 10 | 0.256 ± 0.113 | 80 ± 13 | 0.18 ± 0.07 | 1.00 ± 0.00 | 0.40 |
| OSO (α = 0.8, β = 1) | 200 | 4.0 ± 0.2 | 1.8 ± 0.6 | 56 ± 20 | 0.40 ± 0.19 | 43 ± 6 | 43 ± 6 | 0.294 ± 0.080 | 117 ± 39 | 0.24 ± 0.07 | 1.00 ± 0.00 | 0.95 |
| OSO (α = 0.8, β = 1) | 400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.43 ± 0.13 | 45 ± 7 | 45 ± 7 | 0.297 ± 0.077 | 122 ± 43 | 0.24 ± 0.06 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 800 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.43 ± 0.13 | 45 ± 7 | 45 ± 7 | 0.297 ± 0.077 | 122 ± 43 | 0.24 ± 0.06 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 1600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.43 ± 0.12 | 46 ± 8 | 46 ± 8 | 0.304 ± 0.074 | 121 ± 42 | 0.25 ± 0.07 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 3200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.43 ± 0.09 | 49 ± 9 | 49 ± 9 | 0.321 ± 0.066 | 122 ± 37 | 0.27 ± 0.06 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 6400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.41 ± 0.13 | 51 ± 11 | 51 ± 11 | 0.316 ± 0.089 | 123 ± 39 | 0.33 ± 0.09 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 12800 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.38 ± 0.15 | 58 ± 11 | 58 ± 11 | 0.334 ± 0.094 | 144 ± 65 | 0.41 ± 0.12 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 25600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.32 ± 0.06 | 69 ± 8 | 69 ± 8 | 0.339 ± 0.076 | 195 ± 17 | 0.48 ± 0.10 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 51200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.26 ± 0.03 | 75 ± 2 | 75 ± 2 | 0.306 ± 0.037 | 250 ± 33 | 0.53 ± 0.10 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 102400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.29 ± 0.05 | 75 ± 2 | 75 ± 2 | 0.337 ± 0.062 | 231 ± 41 | 0.53 ± 0.10 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 50 | 2.3 ± 0.7 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 14 ± 8 | 14 ± 8 | 0.297 ± 0.157 | – | 0.19 ± 0.07 | 1.00 ± 0.00 | 0.00 |
| OSO (α = 0.2, β = 1) | 100 | 3.5 ± 0.6 | 0.8 ± 0.9 | 27 ± 28 | 0.30 ± 0.32 | 31 ± 9 | 31 ± 9 | 0.338 ± 0.114 | 80 ± 9 | 0.23 ± 0.07 | 1.00 ± 0.00 | 0.60 |
| OSO (α = 0.2, β = 1) | 200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.56 ± 0.15 | 43 ± 5 | 43 ± 5 | 0.369 ± 0.091 | 104 ± 33 | 0.26 ± 0.07 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.56 ± 0.15 | 43 ± 5 | 43 ± 5 | 0.369 ± 0.091 | 104 ± 33 | 0.26 ± 0.07 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 800 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.56 ± 0.15 | 43 ± 5 | 43 ± 5 | 0.369 ± 0.091 | 104 ± 33 | 0.26 ± 0.07 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 1600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.53 ± 0.16 | 45 ± 7 | 45 ± 7 | 0.359 ± 0.087 | 106 ± 36 | 0.27 ± 0.07 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 3200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.50 ± 0.13 | 50 ± 9 | 50 ± 9 | 0.381 ± 0.079 | 106 ± 31 | 0.30 ± 0.07 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 6400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.46 ± 0.16 | 54 ± 10 | 54 ± 10 | 0.389 ± 0.154 | 118 ± 47 | 0.36 ± 0.09 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 12800 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.48 ± 0.17 | 59 ± 15 | 59 ± 15 | 0.408 ± 0.069 | 117 ± 43 | 0.43 ± 0.13 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 25600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.34 ± 0.06 | 71 ± 5 | 71 ± 5 | 0.373 ± 0.077 | 191 ± 23 | 0.56 ± 0.10 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 51200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.31 ± 0.08 | 75 ± 2 | 75 ± 2 | 0.364 ± 0.089 | 219 ± 51 | 0.54 ± 0.10 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 102400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.30 ± 0.06 | 75 ± 2 | 75 ± 2 | 0.347 ± 0.074 | 229 ± 61 | 0.56 ± 0.10 | 1.00 ± 0.00 | 1.00 |
| α = 0.8, β = 0.5 | 50 | 1.1 ± 1.2 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 7 ± 6 | 4 ± 4 | 0.151 ± 0.135 | 36 ± 0 | 0.20 ± 0.09 | 0.28 ± 0.32 | 0.05 |
| α = 0.8, β = 0.5 | 100 | 2.5 ± 1.1 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 18 ± 8 | 13 ± 7 | 0.186 ± 0.082 | 64 ± 25 | 0.29 ± 0.12 | 0.54 ± 0.25 | 0.15 |
| α = 0.8, β = 0.5 | 200 | 3.5 ± 0.8 | 1.0 ± 0.9 | 32 ± 29 | 0.19 ± 0.18 | 36 ± 10 | 31 ± 12 | 0.199 ± 0.067 | 129 ± 44 | 0.38 ± 0.08 | 0.56 ± 0.12 | 0.65 |
| α = 0.8, β = 0.5 | 400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.29 ± 0.09 | 46 ± 6 | 42 ± 6 | 0.209 ± 0.056 | 174 ± 79 | 0.40 ± 0.07 | 0.57 ± 0.11 | 1.00 |
| α = 0.8, β = 0.5 | 800 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.29 ± 0.09 | 46 ± 6 | 42 ± 6 | 0.209 ± 0.056 | 174 ± 79 | 0.40 ± 0.07 | 0.57 ± 0.11 | 1.00 |
| α = 0.8, β = 0.5 | 1600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.27 ± 0.07 | 50 ± 6 | 45 ± 6 | 0.213 ± 0.054 | 184 ± 89 | 0.43 ± 0.07 | 0.56 ± 0.13 | 1.00 |
| α = 0.8, β = 0.5 | 3200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.30 ± 0.08 | 50 ± 8 | 45 ± 8 | 0.224 ± 0.051 | 164 ± 72 | 0.47 ± 0.08 | 0.62 ± 0.10 | 1.00 |
| α = 0.8, β = 0.5 | 6400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.30 ± 0.08 | 52 ± 7 | 45 ± 8 | 0.236 ± 0.058 | 172 ± 70 | 0.47 ± 0.09 | 0.64 ± 0.10 | 1.00 |
| α = 0.8, β = 0.5 | 12800 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.25 ± 0.06 | 59 ± 7 | 53 ± 7 | 0.228 ± 0.061 | 215 ± 92 | 0.52 ± 0.08 | 0.75 ± 0.08 | 1.00 |
| α = 0.8, β = 0.5 | 25600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.26 ± 0.08 | 61 ± 12 | 56 ± 14 | 0.231 ± 0.045 | 251 ± 86 | 0.54 ± 0.12 | 0.87 ± 0.06 | 1.00 |
| α = 0.8, β = 0.5 | 51200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.16 ± 0.01 | 73 ± 6 | 69 ± 10 | 0.187 ± 0.024 | 393 ± 33 | 0.66 ± 0.09 | 0.95 ± 0.09 | 1.00 |
| α = 0.8, β = 0.5 | 102400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.15 ± 0.04 | 75 ± 2 | 75 ± 2 | 0.183 ± 0.043 | 437 ± 119 | 0.70 ± 0.09 | 1.00 ± 0.01 | 1.00 |

Code: commit `10c7482` (with uncommitted changes). Experiment: [config/experiments/simple-ideas-4x8-p2-len3g2-comp0-7-one-at-a-time-depth-20261024.yaml](../../config/experiments/simple-ideas-4x8-p2-len3g2-comp0-7-one-at-a-time-depth-20261024.yaml). Command: `npm run sim -- simple-ideas-4x8-p2-len3g2-comp0-7-one-at-a-time-depth-20261024 --seeds 20 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
