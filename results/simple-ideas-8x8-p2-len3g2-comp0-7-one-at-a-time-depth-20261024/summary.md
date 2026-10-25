# Scaling, depth 8 (else default)

**Question:** With depth 8 and everything else as the default graph, how does what each society achieves grow with its budget?

**Answer:** At budgets 50–100: best OSO (α = 0.2, β = 1). Against traditional, clearly better on hardest level; no clear difference on targets solved, bounty value, ROI and waste. At budget 200: best OSO (α = 0.8, β = 1). Against traditional, clearly better on hardest level and waste; no clear difference on targets solved, bounty value and ROI. At budget 400: best OSO (α = 0.2, β = 1). Against traditional, clearly better on hardest level and waste; no clear difference on targets solved, bounty value and ROI. At budgets 800–1600: best OSO (α = 0.8, β = 1). Against traditional, clearly better on hardest level, targets solved, bounty value, ROI and waste. At budget 3200: best OSO (α = 0.8, β = 1). Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, money to the main level and waste. At budgets 6400–102400: best OSO (α = 0.8, β = 1). Against traditional, clearly better on ROI, money to the main level and waste; no clear difference on hardest level, targets solved and bounty value. (Compared at each budget; 6 measures, a clear difference is more than 2.6 standard errors.)

- Budget 50: hardest level: 2.20 against traditional 0.00, clearly better. targets solved: 0.00 against traditional 0.00, no clear difference.
- Budget 100: hardest level: 3.20 against traditional 0.00, clearly better. targets solved: 0.00 against traditional 0.00, no clear difference.
- Budget 200: hardest level: 4.70 against traditional 0.00, clearly better. targets solved: 0.00 against traditional 0.00, no clear difference.
- Budget 400: hardest level: 6.60 against traditional 0.00, clearly better. targets solved: 0.15 against traditional 0.00, no clear difference.
- Budget 800: hardest level: 7.80 against traditional 0.00, clearly better. targets solved: 1.10 against traditional 0.00, clearly better.
- Budget 1600: hardest level: 8.00 against traditional 0.00, clearly better. targets solved: 2.00 against traditional 0.00, clearly better.
- Budget 3200: hardest level: 8.00 against traditional 0.80, clearly better. targets solved: 2.00 against traditional 0.10, clearly better.
- Budget 6400: hardest level: 8.00 against traditional 7.20, no clear difference. targets solved: 2.00 against traditional 1.65, no clear difference.
- Budget 12800: hardest level: 8.00 against traditional 8.00, no clear difference. targets solved: 2.00 against traditional 2.00, no clear difference.
- Budget 25600: hardest level: 8.00 against traditional 8.00, no clear difference. targets solved: 2.00 against traditional 2.00, no clear difference.
- Budget 51200: hardest level: 8.00 against traditional 8.00, no clear difference. targets solved: 2.00 against traditional 2.00, no clear difference.
- Budget 102400: hardest level: 8.00 against traditional 8.00, no clear difference. targets solved: 2.00 against traditional 2.00, no clear difference.

![Scaling, depth 8 (else default)](figures/compare.svg)

| society | budget | frontier | targets solved | value gained | ROI (value per spend) | cost | waste |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 50 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.16 ± 0.08 |
| Traditional (α = 1, β = 0) | 100 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.21 ± 0.09 |
| Traditional (α = 1, β = 0) | 200 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.31 ± 0.10 |
| Traditional (α = 1, β = 0) | 400 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.47 ± 0.09 |
| Traditional (α = 1, β = 0) | 800 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.60 ± 0.06 |
| Traditional (α = 1, β = 0) | 1600 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.70 ± 0.05 |
| Traditional (α = 1, β = 0) | 3200 | 0.8 ± 2.5 | 0.1 ± 0.3 | 51 ± 158 | 0.02 ± 0.05 | 2712 ± 153 | 0.76 ± 0.04 |
| Traditional (α = 1, β = 0) | 6400 | 7.2 ± 2.5 | 1.6 ± 0.7 | 845 ± 343 | 0.17 ± 0.08 | 4319 ± 943 | 0.80 ± 0.03 |
| Traditional (α = 1, β = 0) | 12800 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 0.20 ± 0.05 | 4465 ± 1547 | 0.80 ± 0.02 |
| Traditional (α = 1, β = 0) | 25600 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 0.19 ± 0.05 | 4637 ± 1155 | 0.80 ± 0.03 |
| Traditional (α = 1, β = 0) | 51200 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 0.18 ± 0.03 | 4560 ± 1123 | 0.80 ± 0.03 |
| Traditional (α = 1, β = 0) | 102400 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 0.19 ± 0.05 | 4942 ± 1092 | 0.80 ± 0.03 |
| OSO (α = 0.8, β = 1) | 50 | 1.9 ± 1.3 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.16 ± 0.07 |
| OSO (α = 0.8, β = 1) | 100 | 2.8 ± 1.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.18 ± 0.06 |
| OSO (α = 0.8, β = 1) | 200 | 4.7 ± 1.1 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.22 ± 0.06 |
| OSO (α = 0.8, β = 1) | 400 | 6.3 ± 1.1 | 0.1 ± 0.2 | 26 ± 114 | 0.06 ± 0.29 | 270 ± 42 | 0.25 ± 0.06 |
| OSO (α = 0.8, β = 1) | 800 | 7.8 ± 0.4 | 1.1 ± 0.7 | 563 ± 368 | 0.78 ± 0.56 | 572 ± 153 | 0.29 ± 0.04 |
| OSO (α = 0.8, β = 1) | 1600 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 1.10 ± 0.32 | 632 ± 305 | 0.30 ± 0.06 |
| OSO (α = 0.8, β = 1) | 3200 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 1.25 ± 0.45 | 706 ± 242 | 0.30 ± 0.05 |
| OSO (α = 0.8, β = 1) | 6400 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 1.02 ± 0.35 | 742 ± 306 | 0.32 ± 0.05 |
| OSO (α = 0.8, β = 1) | 12800 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 1.18 ± 0.62 | 715 ± 275 | 0.32 ± 0.06 |
| OSO (α = 0.8, β = 1) | 25600 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 1.07 ± 0.35 | 711 ± 174 | 0.35 ± 0.08 |
| OSO (α = 0.8, β = 1) | 51200 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 0.98 ± 0.30 | 808 ± 192 | 0.37 ± 0.10 |
| OSO (α = 0.8, β = 1) | 102400 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 0.97 ± 0.29 | 937 ± 262 | 0.44 ± 0.10 |
| OSO (α = 0.2, β = 1) | 50 | 2.2 ± 1.2 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.21 ± 0.07 |
| OSO (α = 0.2, β = 1) | 100 | 3.2 ± 1.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.22 ± 0.07 |
| OSO (α = 0.2, β = 1) | 200 | 4.5 ± 0.9 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.24 ± 0.05 |
| OSO (α = 0.2, β = 1) | 400 | 6.6 ± 1.0 | 0.1 ± 0.4 | 77 ± 188 | 0.19 ± 0.47 | 324 ± 48 | 0.26 ± 0.06 |
| OSO (α = 0.2, β = 1) | 800 | 7.8 ± 0.4 | 1.1 ± 0.9 | 563 ± 467 | 0.92 ± 0.84 | 505 ± 143 | 0.28 ± 0.06 |
| OSO (α = 0.2, β = 1) | 1600 | 8.0 ± 0.0 | 1.9 ± 0.3 | 973 ± 158 | 1.16 ± 0.55 | 602 ± 260 | 0.30 ± 0.04 |
| OSO (α = 0.2, β = 1) | 3200 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 1.28 ± 0.53 | 711 ± 310 | 0.29 ± 0.04 |
| OSO (α = 0.2, β = 1) | 6400 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 1.06 ± 0.37 | 705 ± 218 | 0.31 ± 0.06 |
| OSO (α = 0.2, β = 1) | 12800 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 1.16 ± 0.34 | 609 ± 192 | 0.33 ± 0.05 |
| OSO (α = 0.2, β = 1) | 25600 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 1.12 ± 0.46 | 689 ± 168 | 0.35 ± 0.08 |
| OSO (α = 0.2, β = 1) | 51200 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 0.99 ± 0.23 | 894 ± 235 | 0.41 ± 0.10 |
| OSO (α = 0.2, β = 1) | 102400 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 0.99 ± 0.29 | 937 ± 262 | 0.43 ± 0.11 |
| α = 0.8, β = 0.5 | 50 | 0.9 ± 1.2 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.15 ± 0.07 |
| α = 0.8, β = 0.5 | 100 | 1.6 ± 1.1 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.21 ± 0.08 |
| α = 0.8, β = 0.5 | 200 | 2.3 ± 1.1 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.31 ± 0.08 |
| α = 0.8, β = 0.5 | 400 | 5.0 ± 1.4 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 306 ± 93 | 0.38 ± 0.07 |
| α = 0.8, β = 0.5 | 800 | 6.7 ± 1.1 | 0.2 ± 0.5 | 102 ± 268 | 0.14 ± 0.37 | 584 ± 224 | 0.43 ± 0.06 |
| α = 0.8, β = 0.5 | 1600 | 7.8 ± 0.5 | 1.4 ± 0.8 | 717 ± 386 | 0.59 ± 0.39 | 939 ± 274 | 0.49 ± 0.07 |
| α = 0.8, β = 0.5 | 3200 | 8.0 ± 0.0 | 1.9 ± 0.2 | 998 ± 114 | 0.72 ± 0.33 | 1190 ± 563 | 0.50 ± 0.06 |
| α = 0.8, β = 0.5 | 6400 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 0.81 ± 0.29 | 987 ± 357 | 0.48 ± 0.05 |
| α = 0.8, β = 0.5 | 12800 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 0.79 ± 0.18 | 1009 ± 418 | 0.49 ± 0.06 |
| α = 0.8, β = 0.5 | 25600 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 0.75 ± 0.31 | 1126 ± 420 | 0.51 ± 0.07 |
| α = 0.8, β = 0.5 | 51200 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 0.69 ± 0.15 | 1148 ± 367 | 0.55 ± 0.05 |
| α = 0.8, β = 0.5 | 102400 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 0.55 ± 0.08 | 1661 ± 336 | 0.61 ± 0.08 |

**Design** (fixed before the run): compared four societies × budgets 50 to 102400 · held the same: a generated idea graph (8 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7), 12 identical agents, budget 50 split equally, no mint, no validation · measure: all of hardest level, targets solved, bounty value, ROI, money to the main level, waste · 20 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The simple model on a generated idea graph (8 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7); each run draws its own graph. Only α and β vary. Held fixed: 12 identical agents, a budget of 50 split equally every round (ρ = 0), no mint, no validation.

Values are mean ± standard deviation over runs.

| society | budget | frontier | targets solved | value gained | ROI (value per spend) | cost | waste | sharing | reach L8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 50 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.16 ± 0.08 | 0.00 ± 0.00 | 0.00 |
| Traditional (α = 1, β = 0) | 100 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.21 ± 0.09 | 0.00 ± 0.00 | 0.00 |
| Traditional (α = 1, β = 0) | 200 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.31 ± 0.10 | 0.00 ± 0.00 | 0.00 |
| Traditional (α = 1, β = 0) | 400 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.47 ± 0.09 | 0.00 ± 0.00 | 0.00 |
| Traditional (α = 1, β = 0) | 800 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.60 ± 0.06 | 0.00 ± 0.00 | 0.00 |
| Traditional (α = 1, β = 0) | 1600 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.70 ± 0.05 | 0.00 ± 0.00 | 0.00 |
| Traditional (α = 1, β = 0) | 3200 | 0.8 ± 2.5 | 0.1 ± 0.3 | 51 ± 158 | 0.02 ± 0.05 | 2712 ± 153 | 0.76 ± 0.04 | 0.00 ± 0.00 | 0.10 |
| Traditional (α = 1, β = 0) | 6400 | 7.2 ± 2.5 | 1.6 ± 0.7 | 845 ± 343 | 0.17 ± 0.08 | 4319 ± 943 | 0.80 ± 0.03 | 0.00 ± 0.00 | 0.90 |
| Traditional (α = 1, β = 0) | 12800 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 0.20 ± 0.05 | 4465 ± 1547 | 0.80 ± 0.02 | 0.00 ± 0.01 | 1.00 |
| Traditional (α = 1, β = 0) | 25600 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 0.19 ± 0.05 | 4637 ± 1155 | 0.80 ± 0.03 | 0.00 ± 0.01 | 1.00 |
| Traditional (α = 1, β = 0) | 51200 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 0.18 ± 0.03 | 4560 ± 1123 | 0.80 ± 0.03 | 0.00 ± 0.01 | 1.00 |
| Traditional (α = 1, β = 0) | 102400 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 0.19 ± 0.05 | 4942 ± 1092 | 0.80 ± 0.03 | 0.02 ± 0.03 | 1.00 |
| OSO (α = 0.8, β = 1) | 50 | 1.9 ± 1.3 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.16 ± 0.07 | 0.75 ± 0.44 | 0.00 |
| OSO (α = 0.8, β = 1) | 100 | 2.8 ± 1.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.18 ± 0.06 | 0.95 ± 0.22 | 0.00 |
| OSO (α = 0.8, β = 1) | 200 | 4.7 ± 1.1 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.22 ± 0.06 | 1.00 ± 0.00 | 0.00 |
| OSO (α = 0.8, β = 1) | 400 | 6.3 ± 1.1 | 0.1 ± 0.2 | 26 ± 114 | 0.06 ± 0.29 | 270 ± 42 | 0.25 ± 0.06 | 1.00 ± 0.00 | 0.10 |
| OSO (α = 0.8, β = 1) | 800 | 7.8 ± 0.4 | 1.1 ± 0.7 | 563 ± 368 | 0.78 ± 0.56 | 572 ± 153 | 0.29 ± 0.04 | 1.00 ± 0.00 | 0.80 |
| OSO (α = 0.8, β = 1) | 1600 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 1.10 ± 0.32 | 632 ± 305 | 0.30 ± 0.06 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 3200 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 1.25 ± 0.45 | 706 ± 242 | 0.30 ± 0.05 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 6400 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 1.02 ± 0.35 | 742 ± 306 | 0.32 ± 0.05 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 12800 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 1.18 ± 0.62 | 715 ± 275 | 0.32 ± 0.06 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 25600 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 1.07 ± 0.35 | 711 ± 174 | 0.35 ± 0.08 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 51200 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 0.98 ± 0.30 | 808 ± 192 | 0.37 ± 0.10 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 102400 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 0.97 ± 0.29 | 937 ± 262 | 0.44 ± 0.10 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 50 | 2.2 ± 1.2 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.21 ± 0.07 | 0.95 ± 0.22 | 0.00 |
| OSO (α = 0.2, β = 1) | 100 | 3.2 ± 1.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.22 ± 0.07 | 1.00 ± 0.00 | 0.00 |
| OSO (α = 0.2, β = 1) | 200 | 4.5 ± 0.9 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.24 ± 0.05 | 1.00 ± 0.00 | 0.00 |
| OSO (α = 0.2, β = 1) | 400 | 6.6 ± 1.0 | 0.1 ± 0.4 | 77 ± 188 | 0.19 ± 0.47 | 324 ± 48 | 0.26 ± 0.06 | 1.00 ± 0.00 | 0.20 |
| OSO (α = 0.2, β = 1) | 800 | 7.8 ± 0.4 | 1.1 ± 0.9 | 563 ± 467 | 0.92 ± 0.84 | 505 ± 143 | 0.28 ± 0.06 | 1.00 ± 0.00 | 0.75 |
| OSO (α = 0.2, β = 1) | 1600 | 8.0 ± 0.0 | 1.9 ± 0.3 | 973 ± 158 | 1.16 ± 0.55 | 602 ± 260 | 0.30 ± 0.04 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 3200 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 1.28 ± 0.53 | 711 ± 310 | 0.29 ± 0.04 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 6400 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 1.06 ± 0.37 | 705 ± 218 | 0.31 ± 0.06 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 12800 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 1.16 ± 0.34 | 609 ± 192 | 0.33 ± 0.05 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 25600 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 1.12 ± 0.46 | 689 ± 168 | 0.35 ± 0.08 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 51200 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 0.99 ± 0.23 | 894 ± 235 | 0.41 ± 0.10 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.2, β = 1) | 102400 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 0.99 ± 0.29 | 937 ± 262 | 0.43 ± 0.11 | 1.00 ± 0.00 | 1.00 |
| α = 0.8, β = 0.5 | 50 | 0.9 ± 1.2 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.15 ± 0.07 | 0.27 ± 0.37 | 0.00 |
| α = 0.8, β = 0.5 | 100 | 1.6 ± 1.1 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.21 ± 0.08 | 0.36 ± 0.28 | 0.00 |
| α = 0.8, β = 0.5 | 200 | 2.3 ± 1.1 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | – | 0.31 ± 0.08 | 0.42 ± 0.23 | 0.00 |
| α = 0.8, β = 0.5 | 400 | 5.0 ± 1.4 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 306 ± 93 | 0.38 ± 0.07 | 0.51 ± 0.13 | 0.10 |
| α = 0.8, β = 0.5 | 800 | 6.7 ± 1.1 | 0.2 ± 0.5 | 102 ± 268 | 0.14 ± 0.37 | 584 ± 224 | 0.43 ± 0.06 | 0.52 ± 0.12 | 0.30 |
| α = 0.8, β = 0.5 | 1600 | 7.8 ± 0.5 | 1.4 ± 0.8 | 717 ± 386 | 0.59 ± 0.39 | 939 ± 274 | 0.49 ± 0.07 | 0.54 ± 0.10 | 0.90 |
| α = 0.8, β = 0.5 | 3200 | 8.0 ± 0.0 | 1.9 ± 0.2 | 998 ± 114 | 0.72 ± 0.33 | 1190 ± 563 | 0.50 ± 0.06 | 0.59 ± 0.06 | 1.00 |
| α = 0.8, β = 0.5 | 6400 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 0.81 ± 0.29 | 987 ± 357 | 0.48 ± 0.05 | 0.62 ± 0.06 | 1.00 |
| α = 0.8, β = 0.5 | 12800 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 0.79 ± 0.18 | 1009 ± 418 | 0.49 ± 0.06 | 0.65 ± 0.08 | 1.00 |
| α = 0.8, β = 0.5 | 25600 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 0.75 ± 0.31 | 1126 ± 420 | 0.51 ± 0.07 | 0.73 ± 0.05 | 1.00 |
| α = 0.8, β = 0.5 | 51200 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 0.69 ± 0.15 | 1148 ± 367 | 0.55 ± 0.05 | 0.80 ± 0.06 | 1.00 |
| α = 0.8, β = 0.5 | 102400 | 8.0 ± 0.0 | 2.0 ± 0.0 | 1024 ± 0 | 0.55 ± 0.08 | 1661 ± 336 | 0.61 ± 0.08 | 0.87 ± 0.05 | 1.00 |

Code: commit `9a11c8a` (with uncommitted changes). Experiment: [config/experiments/simple-ideas-8x8-p2-len3g2-comp0-7-one-at-a-time-depth-20261024.yaml](../../config/experiments/simple-ideas-8x8-p2-len3g2-comp0-7-one-at-a-time-depth-20261024.yaml). Command: `npm run sim -- simple-ideas-8x8-p2-len3g2-comp0-7-one-at-a-time-depth-20261024 --seeds 20 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
