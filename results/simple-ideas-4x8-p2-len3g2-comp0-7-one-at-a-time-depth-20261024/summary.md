# Scaling, depth 4 (else default)

**Question:** With depth 4 and everything else as the default graph, how does what each society achieves grow with its budget?

**Answer:** At budget 50: best OSO (α = 0.2, β = 1). Against traditional, clearly better on hardest level; no clear difference on targets solved, bounty value, ROI and waste. At budget 100: best OSO (α = 0.8, β = 1). Against traditional, clearly better on hardest level, targets solved, bounty value and ROI; no clear difference on waste. At budget 200: best OSO (α = 0.8, β = 1). Against traditional, clearly better on hardest level, targets solved, bounty value, ROI and waste. At budget 400: best OSO (α = 0.8, β = 1). Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, money to the main level and waste. At budget 800: best OSO (α = 0.8, β = 1). Against traditional, clearly better on targets solved, bounty value, ROI, money to the main level and waste; no clear difference on hardest level. At budgets 1600–102400: best OSO (α = 0.8, β = 1). Against traditional, clearly better on ROI, money to the main level and waste; no clear difference on hardest level, targets solved and bounty value. (Compared at each budget; 6 measures, a clear difference is more than 2.6 standard errors.)

- Budget 50: hardest level: 2.45 against traditional 0.00, clearly better. targets solved: 0.05 against traditional 0.00, no clear difference.
- Budget 100: hardest level: 3.45 against traditional 0.00, clearly better. targets solved: 0.70 against traditional 0.00, clearly better.
- Budget 200: hardest level: 4.00 against traditional 0.00, clearly better. targets solved: 1.75 against traditional 0.00, clearly better.
- Budget 400: hardest level: 4.00 against traditional 0.60, clearly better. targets solved: 2.00 against traditional 0.15, clearly better.
- Budget 800: hardest level: 4.00 against traditional 4.00, no clear difference. targets solved: 2.00 against traditional 1.65, clearly better.
- Budget 1600: hardest level: 4.00 against traditional 4.00, no clear difference. targets solved: 2.00 against traditional 2.00, no clear difference.
- Budget 3200: hardest level: 4.00 against traditional 4.00, no clear difference. targets solved: 2.00 against traditional 2.00, no clear difference.
- Budget 6400: hardest level: 4.00 against traditional 4.00, no clear difference. targets solved: 2.00 against traditional 2.00, no clear difference.
- Budget 12800: hardest level: 4.00 against traditional 4.00, no clear difference. targets solved: 2.00 against traditional 2.00, no clear difference.
- Budget 25600: hardest level: 4.00 against traditional 4.00, no clear difference. targets solved: 2.00 against traditional 2.00, no clear difference.
- Budget 51200: hardest level: 4.00 against traditional 4.00, no clear difference. targets solved: 2.00 against traditional 2.00, no clear difference.
- Budget 102400: hardest level: 4.00 against traditional 4.00, no clear difference. targets solved: 2.00 against traditional 2.00, no clear difference.

![Scaling, depth 4 (else default)](figures/compare.svg)

| society | budget | frontier | targets solved | value gained | ROI (value per spend) | cost | waste |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 50 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.21 ± 0.10 |
| Traditional (α = 1, β = 0) | 100 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.29 ± 0.10 |
| Traditional (α = 1, β = 0) | 200 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.44 ± 0.11 |
| Traditional (α = 1, β = 0) | 400 | 0.6 ± 1.5 | 0.1 ± 0.4 | 5 ± 12 | 0.01 ± 0.03 | 264 ± 43 | 0.62 ± 0.09 |
| Traditional (α = 1, β = 0) | 800 | 4.0 ± 0.0 | 1.6 ± 0.5 | 53 ± 16 | 0.08 ± 0.03 | 563 ± 167 | 0.73 ± 0.07 |
| Traditional (α = 1, β = 0) | 1600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.09 ± 0.02 | 563 ± 234 | 0.75 ± 0.05 |
| Traditional (α = 1, β = 0) | 3200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.09 ± 0.02 | 613 ± 137 | 0.77 ± 0.03 |
| Traditional (α = 1, β = 0) | 6400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.08 ± 0.02 | 629 ± 212 | 0.77 ± 0.04 |
| Traditional (α = 1, β = 0) | 12800 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.09 ± 0.03 | 598 ± 190 | 0.74 ± 0.05 |
| Traditional (α = 1, β = 0) | 25600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.08 ± 0.02 | 710 ± 222 | 0.80 ± 0.04 |
| Traditional (α = 1, β = 0) | 51200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.07 ± 0.01 | 786 ± 251 | 0.81 ± 0.05 |
| Traditional (α = 1, β = 0) | 102400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.07 ± 0.01 | 895 ± 191 | 0.80 ± 0.06 |
| OSO (α = 0.8, β = 1) | 50 | 1.9 ± 1.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.21 ± 0.10 |
| OSO (α = 0.8, β = 1) | 100 | 3.5 ± 0.8 | 0.7 ± 0.8 | 22 ± 26 | 0.26 ± 0.31 | 77 ± 14 | 0.25 ± 0.09 |
| OSO (α = 0.8, β = 1) | 200 | 4.0 ± 0.0 | 1.8 ± 0.6 | 56 ± 20 | 0.45 ± 0.23 | 101 ± 31 | 0.28 ± 0.07 |
| OSO (α = 0.8, β = 1) | 400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.48 ± 0.18 | 101 ± 31 | 0.28 ± 0.07 |
| OSO (α = 0.8, β = 1) | 800 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.48 ± 0.18 | 101 ± 31 | 0.28 ± 0.07 |
| OSO (α = 0.8, β = 1) | 1600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.50 ± 0.17 | 107 ± 37 | 0.29 ± 0.08 |
| OSO (α = 0.8, β = 1) | 3200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.47 ± 0.13 | 107 ± 41 | 0.32 ± 0.09 |
| OSO (α = 0.8, β = 1) | 6400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.41 ± 0.13 | 118 ± 38 | 0.40 ± 0.10 |
| OSO (α = 0.8, β = 1) | 12800 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.36 ± 0.14 | 144 ± 65 | 0.47 ± 0.11 |
| OSO (α = 0.8, β = 1) | 25600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.31 ± 0.05 | 202 ± 26 | 0.51 ± 0.09 |
| OSO (α = 0.8, β = 1) | 51200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.28 ± 0.06 | 238 ± 42 | 0.57 ± 0.12 |
| OSO (α = 0.8, β = 1) | 102400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.27 ± 0.06 | 245 ± 50 | 0.56 ± 0.11 |
| OSO (α = 0.2, β = 1) | 50 | 2.5 ± 0.7 | 0.1 ± 0.2 | 2 ± 7 | 0.03 ± 0.15 | 48 ± 0 | 0.22 ± 0.09 |
| OSO (α = 0.2, β = 1) | 100 | 3.4 ± 0.7 | 0.7 ± 0.8 | 21 ± 26 | 0.24 ± 0.32 | 77 ± 16 | 0.27 ± 0.08 |
| OSO (α = 0.2, β = 1) | 200 | 4.0 ± 0.2 | 1.9 ± 0.5 | 59 ± 16 | 0.49 ± 0.21 | 103 ± 34 | 0.29 ± 0.07 |
| OSO (α = 0.2, β = 1) | 400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.51 ± 0.18 | 108 ± 40 | 0.30 ± 0.07 |
| OSO (α = 0.2, β = 1) | 800 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.51 ± 0.18 | 108 ± 40 | 0.30 ± 0.07 |
| OSO (α = 0.2, β = 1) | 1600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.51 ± 0.17 | 103 ± 30 | 0.31 ± 0.07 |
| OSO (α = 0.2, β = 1) | 3200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.51 ± 0.21 | 108 ± 31 | 0.33 ± 0.09 |
| OSO (α = 0.2, β = 1) | 6400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.50 ± 0.13 | 98 ± 42 | 0.38 ± 0.11 |
| OSO (α = 0.2, β = 1) | 12800 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.38 ± 0.13 | 128 ± 50 | 0.50 ± 0.08 |
| OSO (α = 0.2, β = 1) | 25600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.34 ± 0.06 | 190 ± 24 | 0.57 ± 0.10 |
| OSO (α = 0.2, β = 1) | 51200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.29 ± 0.05 | 229 ± 41 | 0.61 ± 0.11 |
| OSO (α = 0.2, β = 1) | 102400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.29 ± 0.05 | 225 ± 43 | 0.60 ± 0.11 |
| α = 0.8, β = 0.5 | 50 | 1.4 ± 1.5 | 0.1 ± 0.3 | 3 ± 10 | 0.07 ± 0.21 | 42 ± 8 | 0.24 ± 0.14 |
| α = 0.8, β = 0.5 | 100 | 2.7 ± 1.2 | 0.1 ± 0.4 | 5 ± 12 | 0.05 ± 0.12 | 70 ± 23 | 0.32 ± 0.13 |
| α = 0.8, β = 0.5 | 200 | 3.7 ± 0.6 | 1.1 ± 0.8 | 34 ± 26 | 0.21 ± 0.19 | 118 ± 48 | 0.42 ± 0.09 |
| α = 0.8, β = 0.5 | 400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.31 ± 0.11 | 164 ± 96 | 0.44 ± 0.08 |
| α = 0.8, β = 0.5 | 800 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.31 ± 0.11 | 164 ± 96 | 0.44 ± 0.08 |
| α = 0.8, β = 0.5 | 1600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.33 ± 0.11 | 155 ± 85 | 0.46 ± 0.08 |
| α = 0.8, β = 0.5 | 3200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.31 ± 0.12 | 172 ± 71 | 0.48 ± 0.12 |
| α = 0.8, β = 0.5 | 6400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.31 ± 0.12 | 188 ± 69 | 0.46 ± 0.09 |
| α = 0.8, β = 0.5 | 12800 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.29 ± 0.11 | 209 ± 82 | 0.53 ± 0.10 |
| α = 0.8, β = 0.5 | 25600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.23 ± 0.08 | 234 ± 73 | 0.57 ± 0.11 |
| α = 0.8, β = 0.5 | 51200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.17 ± 0.03 | 383 ± 49 | 0.70 ± 0.08 |
| α = 0.8, β = 0.5 | 102400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.16 ± 0.03 | 422 ± 109 | 0.72 ± 0.10 |

**Design** (fixed before the run): compared four societies × budgets 50 to 102400 · held the same: a generated idea graph (4 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7), 12 identical agents, budget 50 split equally, no mint, no validation · measure: all of hardest level, targets solved, bounty value, ROI, money to the main level, waste · 20 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The simple model on a generated idea graph (4 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7); each run draws its own graph. Only α and β vary. Held fixed: 12 identical agents, a budget of 50 split equally every round (ρ = 0), no mint, no validation.

Values are mean ± standard deviation over runs.

| society | budget | frontier | targets solved | value gained | ROI (value per spend) | cost | waste | sharing | reach L4 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 50 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.21 ± 0.10 | 0.00 ± 0.00 | 0.00 |
| Traditional (α = 1, β = 0) | 100 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.29 ± 0.10 | 0.00 ± 0.00 | 0.00 |
| Traditional (α = 1, β = 0) | 200 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.44 ± 0.11 | 0.00 ± 0.00 | 0.00 |
| Traditional (α = 1, β = 0) | 400 | 0.6 ± 1.5 | 0.1 ± 0.4 | 5 ± 12 | 0.01 ± 0.03 | 264 ± 43 | 0.62 ± 0.09 | 0.00 ± 0.00 | 0.15 |
| Traditional (α = 1, β = 0) | 800 | 4.0 ± 0.0 | 1.6 ± 0.5 | 53 ± 16 | 0.08 ± 0.03 | 563 ± 167 | 0.73 ± 0.07 | 0.00 ± 0.00 | 1.00 |
| Traditional (α = 1, β = 0) | 1600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.09 ± 0.02 | 563 ± 234 | 0.75 ± 0.05 | 0.00 ± 0.00 | 1.00 |
| Traditional (α = 1, β = 0) | 3200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.09 ± 0.02 | 613 ± 137 | 0.77 ± 0.03 | 0.00 ± 0.00 | 1.00 |
| Traditional (α = 1, β = 0) | 6400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.08 ± 0.02 | 629 ± 212 | 0.77 ± 0.04 | 0.00 ± 0.01 | 1.00 |
| Traditional (α = 1, β = 0) | 12800 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.09 ± 0.03 | 598 ± 190 | 0.74 ± 0.05 | 0.01 ± 0.03 | 1.00 |
| Traditional (α = 1, β = 0) | 25600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.08 ± 0.02 | 710 ± 222 | 0.80 ± 0.04 | 0.01 ± 0.02 | 1.00 |
| Traditional (α = 1, β = 0) | 51200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.07 ± 0.01 | 786 ± 251 | 0.81 ± 0.05 | 0.03 ± 0.04 | 1.00 |
| Traditional (α = 1, β = 0) | 102400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.07 ± 0.01 | 895 ± 191 | 0.80 ± 0.06 | 0.37 ± 0.16 | 1.00 |
| OSO (α = 0.8, β = 1) | 50 | 1.9 ± 1.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.21 ± 0.10 | 0.85 ± 0.37 | 0.00 |
| OSO (α = 0.8, β = 1) | 100 | 3.5 ± 0.8 | 0.7 ± 0.8 | 22 ± 26 | 0.26 ± 0.31 | 77 ± 14 | 0.25 ± 0.09 | 1.00 ± 0.00 | 0.55 |
| OSO (α = 0.8, β = 1) | 200 | 4.0 ± 0.0 | 1.8 ± 0.6 | 56 ± 20 | 0.45 ± 0.23 | 101 ± 31 | 0.28 ± 0.07 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.48 ± 0.18 | 101 ± 31 | 0.28 ± 0.07 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 800 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.48 ± 0.18 | 101 ± 31 | 0.28 ± 0.07 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 1600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.50 ± 0.17 | 107 ± 37 | 0.29 ± 0.08 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 3200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.47 ± 0.13 | 107 ± 41 | 0.32 ± 0.09 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 6400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.41 ± 0.13 | 118 ± 38 | 0.40 ± 0.10 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 12800 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.36 ± 0.14 | 144 ± 65 | 0.47 ± 0.11 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 25600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.31 ± 0.05 | 202 ± 26 | 0.51 ± 0.09 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 51200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.28 ± 0.06 | 238 ± 42 | 0.57 ± 0.12 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 102400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.27 ± 0.06 | 245 ± 50 | 0.56 ± 0.11 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 50 | 2.5 ± 0.7 | 0.1 ± 0.2 | 2 ± 7 | 0.03 ± 0.15 | 48 ± 0 | 0.22 ± 0.09 | 1.00 ± 0.00 | 0.05 |
| OSO (α = 0.2, β = 1) | 100 | 3.4 ± 0.7 | 0.7 ± 0.8 | 21 ± 26 | 0.24 ± 0.32 | 77 ± 16 | 0.27 ± 0.08 | 1.00 ± 0.00 | 0.50 |
| OSO (α = 0.2, β = 1) | 200 | 4.0 ± 0.2 | 1.9 ± 0.5 | 59 ± 16 | 0.49 ± 0.21 | 103 ± 34 | 0.29 ± 0.07 | 1.00 ± 0.00 | 0.95 |
| OSO (α = 0.2, β = 1) | 400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.51 ± 0.18 | 108 ± 40 | 0.30 ± 0.07 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 800 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.51 ± 0.18 | 108 ± 40 | 0.30 ± 0.07 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 1600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.51 ± 0.17 | 103 ± 30 | 0.31 ± 0.07 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 3200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.51 ± 0.21 | 108 ± 31 | 0.33 ± 0.09 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 6400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.50 ± 0.13 | 98 ± 42 | 0.38 ± 0.11 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 12800 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.38 ± 0.13 | 128 ± 50 | 0.50 ± 0.08 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 25600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.34 ± 0.06 | 190 ± 24 | 0.57 ± 0.10 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 51200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.29 ± 0.05 | 229 ± 41 | 0.61 ± 0.11 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 102400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.29 ± 0.05 | 225 ± 43 | 0.60 ± 0.11 | 1.00 ± 0.00 | 1.00 |
| α = 0.8, β = 0.5 | 50 | 1.4 ± 1.5 | 0.1 ± 0.3 | 3 ± 10 | 0.07 ± 0.21 | 42 ± 8 | 0.24 ± 0.14 | 0.29 ± 0.31 | 0.10 |
| α = 0.8, β = 0.5 | 100 | 2.7 ± 1.2 | 0.1 ± 0.4 | 5 ± 12 | 0.05 ± 0.12 | 70 ± 23 | 0.32 ± 0.13 | 0.55 ± 0.25 | 0.30 |
| α = 0.8, β = 0.5 | 200 | 3.7 ± 0.6 | 1.1 ± 0.8 | 34 ± 26 | 0.21 ± 0.19 | 118 ± 48 | 0.42 ± 0.09 | 0.56 ± 0.12 | 0.75 |
| α = 0.8, β = 0.5 | 400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.31 ± 0.11 | 164 ± 96 | 0.44 ± 0.08 | 0.56 ± 0.12 | 1.00 |
| α = 0.8, β = 0.5 | 800 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.31 ± 0.11 | 164 ± 96 | 0.44 ± 0.08 | 0.56 ± 0.12 | 1.00 |
| α = 0.8, β = 0.5 | 1600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.33 ± 0.11 | 155 ± 85 | 0.46 ± 0.08 | 0.57 ± 0.13 | 1.00 |
| α = 0.8, β = 0.5 | 3200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.31 ± 0.12 | 172 ± 71 | 0.48 ± 0.12 | 0.63 ± 0.14 | 1.00 |
| α = 0.8, β = 0.5 | 6400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.31 ± 0.12 | 188 ± 69 | 0.46 ± 0.09 | 0.70 ± 0.09 | 1.00 |
| α = 0.8, β = 0.5 | 12800 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.29 ± 0.11 | 209 ± 82 | 0.53 ± 0.10 | 0.75 ± 0.07 | 1.00 |
| α = 0.8, β = 0.5 | 25600 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.23 ± 0.08 | 234 ± 73 | 0.57 ± 0.11 | 0.85 ± 0.07 | 1.00 |
| α = 0.8, β = 0.5 | 51200 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.17 ± 0.03 | 383 ± 49 | 0.70 ± 0.08 | 0.97 ± 0.04 | 1.00 |
| α = 0.8, β = 0.5 | 102400 | 4.0 ± 0.0 | 2.0 ± 0.0 | 64 ± 0 | 0.16 ± 0.03 | 422 ± 109 | 0.72 ± 0.10 | 1.00 ± 0.01 | 1.00 |

Code: commit `9a11c8a` (with uncommitted changes). Experiment: [config/experiments/simple-ideas-4x8-p2-len3g2-comp0-7-one-at-a-time-depth-20261024.yaml](../../config/experiments/simple-ideas-4x8-p2-len3g2-comp0-7-one-at-a-time-depth-20261024.yaml). Command: `npm run sim -- simple-ideas-4x8-p2-len3g2-comp0-7-one-at-a-time-depth-20261024 --seeds 20 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
