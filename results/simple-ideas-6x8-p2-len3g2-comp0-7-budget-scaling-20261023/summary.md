# Scaling on the default graph

**Question:** Scaling on the default graph: how does what each society achieves grow with its budget?

**Answer:** At budget 150: best α = 1, β = 1. Against traditional, clearly better on hardest level, knowledge found (bits), knowledge per unit of money and waste; no clear difference on targets solved, bounty value and ROI. At budgets 300–600: best OSO (α = 0.8, β = 1). Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money and waste. At budget 1200: best OSO (α = 0.8, β = 1). Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money and waste; no clear difference on money to the main level. At budget 2400: best OSO (α = 0.8, β = 1). Against traditional, clearly better on hardest level, targets solved, bounty value, ROI, knowledge per unit of money, money to the main level and waste; no clear difference on knowledge found (bits). At budgets 4800–9600: best OSO (α = 0.8, β = 1). Against traditional, clearly better on ROI, knowledge per unit of money, money to the main level and waste; no clear difference on hardest level, targets solved, bounty value and knowledge found (bits). (Compared at each budget; 8 measures, a clear difference is more than 2.7 standard errors.)

- Budget 150: hardest level: 4.10 against traditional 0.00, clearly better. targets solved: 0.03 against traditional 0.00, no clear difference.
- Budget 300: hardest level: 5.58 against traditional 0.00, clearly better. targets solved: 0.75 against traditional 0.00, clearly better.
- Budget 600: hardest level: 6.00 against traditional 0.00, clearly better. targets solved: 1.82 against traditional 0.00, clearly better.
- Budget 1200: hardest level: 6.00 against traditional 0.15, clearly better. targets solved: 2.00 against traditional 0.03, clearly better.
- Budget 2400: hardest level: 6.00 against traditional 4.65, clearly better. targets solved: 2.00 against traditional 1.32, clearly better.
- Budget 4800: hardest level: 6.00 against traditional 6.00, no clear difference. targets solved: 2.00 against traditional 2.00, no clear difference.
- Budget 9600: hardest level: 6.00 against traditional 6.00, no clear difference. targets solved: 2.00 against traditional 2.00, no clear difference.

![Scaling on the default graph](figures/compare.svg)

| society | budget | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | bits per money | cost | waste |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 150 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 16 ± 5 | 0.112 ± 0.034 | – | 0.30 ± 0.10 |
| Traditional (α = 1, β = 0) | 300 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 26 ± 5 | 0.089 ± 0.017 | – | 0.43 ± 0.10 |
| Traditional (α = 1, β = 0) | 600 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 39 ± 5 | 0.067 ± 0.009 | – | 0.59 ± 0.08 |
| Traditional (α = 1, β = 0) | 1200 | 0.1 ± 0.9 | 0.0 ± 0.2 | 3 ± 20 | 0.00 ± 0.02 | 60 ± 8 | 0.051 ± 0.007 | 744 ± 0 | 0.72 ± 0.05 |
| Traditional (α = 1, β = 0) | 2400 | 4.7 ± 2.5 | 1.3 ± 0.8 | 170 ± 106 | 0.08 ± 0.05 | 98 ± 8 | 0.044 ± 0.005 | 1934 ± 329 | 0.80 ± 0.03 |
| Traditional (α = 1, β = 0) | 4800 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.11 ± 0.02 | 103 ± 12 | 0.044 ± 0.007 | 2123 ± 497 | 0.80 ± 0.03 |
| Traditional (α = 1, β = 0) | 9600 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.11 ± 0.02 | 105 ± 12 | 0.043 ± 0.006 | 2208 ± 450 | 0.80 ± 0.02 |
| OSO (α = 0.8, β = 1) | 150 | 3.9 ± 1.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 35 ± 12 | 0.244 ± 0.082 | – | 0.20 ± 0.06 |
| OSO (α = 0.8, β = 1) | 300 | 5.6 ± 0.5 | 0.8 ± 0.8 | 96 ± 104 | 0.36 ± 0.40 | 73 ± 15 | 0.262 ± 0.060 | 230 ± 40 | 0.26 ± 0.07 |
| OSO (α = 0.8, β = 1) | 600 | 6.0 ± 0.0 | 1.8 ± 0.4 | 234 ± 57 | 0.64 ± 0.27 | 98 ± 17 | 0.251 ± 0.061 | 287 ± 87 | 0.32 ± 0.09 |
| OSO (α = 0.8, β = 1) | 1200 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.67 ± 0.22 | 100 ± 20 | 0.251 ± 0.060 | 287 ± 87 | 0.31 ± 0.08 |
| OSO (α = 0.8, β = 1) | 2400 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.69 ± 0.21 | 99 ± 16 | 0.261 ± 0.061 | 287 ± 99 | 0.32 ± 0.08 |
| OSO (α = 0.8, β = 1) | 4800 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.60 ± 0.17 | 107 ± 18 | 0.242 ± 0.050 | 291 ± 106 | 0.35 ± 0.09 |
| OSO (α = 0.8, β = 1) | 9600 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.69 ± 0.31 | 101 ± 20 | 0.253 ± 0.074 | 302 ± 105 | 0.33 ± 0.07 |
| α = 0.8, β = 0.5 | 150 | 2.7 ± 1.2 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 25 ± 10 | 0.173 ± 0.069 | 144 ± 0 | 0.30 ± 0.10 |
| α = 0.8, β = 0.5 | 300 | 4.5 ± 1.1 | 0.1 ± 0.4 | 16 ± 52 | 0.06 ± 0.18 | 51 ± 13 | 0.176 ± 0.044 | 224 ± 54 | 0.37 ± 0.07 |
| α = 0.8, β = 0.5 | 600 | 5.8 ± 0.4 | 1.1 ± 0.8 | 147 ± 103 | 0.29 ± 0.23 | 88 ± 13 | 0.165 ± 0.036 | 404 ± 128 | 0.47 ± 0.08 |
| α = 0.8, β = 0.5 | 1200 | 6.0 ± 0.0 | 2.0 ± 0.2 | 253 ± 20 | 0.41 ± 0.14 | 102 ± 14 | 0.160 ± 0.039 | 463 ± 171 | 0.49 ± 0.08 |
| α = 0.8, β = 0.5 | 2400 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.44 ± 0.14 | 101 ± 17 | 0.167 ± 0.035 | 460 ± 145 | 0.49 ± 0.09 |
| α = 0.8, β = 0.5 | 4800 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.41 ± 0.10 | 101 ± 16 | 0.160 ± 0.033 | 464 ± 133 | 0.50 ± 0.08 |
| α = 0.8, β = 0.5 | 9600 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.44 ± 0.12 | 102 ± 15 | 0.171 ± 0.034 | 479 ± 169 | 0.51 ± 0.07 |
| α = 1, β = 1 | 150 | 4.1 ± 1.0 | 0.0 ± 0.2 | 3 ± 20 | 0.02 ± 0.14 | 38 ± 14 | 0.263 ± 0.096 | 138 ± 8 | 0.20 ± 0.06 |
| α = 1, β = 1 | 300 | 5.5 ± 0.7 | 0.7 ± 0.7 | 90 ± 93 | 0.34 ± 0.39 | 70 ± 15 | 0.252 ± 0.061 | 213 ± 43 | 0.26 ± 0.07 |
| α = 1, β = 1 | 600 | 6.0 ± 0.0 | 1.9 ± 0.4 | 237 ± 55 | 0.65 ± 0.28 | 98 ± 16 | 0.249 ± 0.053 | 273 ± 89 | 0.32 ± 0.09 |
| α = 1, β = 1 | 1200 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.67 ± 0.24 | 100 ± 18 | 0.249 ± 0.054 | 273 ± 89 | 0.32 ± 0.08 |
| α = 1, β = 1 | 2400 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.68 ± 0.29 | 99 ± 20 | 0.249 ± 0.069 | 286 ± 131 | 0.31 ± 0.08 |
| α = 1, β = 1 | 4800 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.66 ± 0.19 | 103 ± 16 | 0.257 ± 0.066 | 300 ± 107 | 0.33 ± 0.08 |
| α = 1, β = 1 | 9600 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.68 ± 0.25 | 100 ± 21 | 0.251 ± 0.070 | 286 ± 102 | 0.33 ± 0.08 |

**Design** (fixed before the run): compared four societies × budgets 150, 300, 600, 1200, 2400, 4800, 9600 · held the same: a generated idea graph (6 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7), 12 identical agents, budget 150 split equally, no mint, no validation · measure: all of hardest level, targets solved, bounty value, ROI, knowledge found (bits), knowledge per unit of money, money to the main level, waste · 40 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The simple model on a generated idea graph (6 levels × 8 ideas, 2 parents each, sequences of 3 bits growing by 2 per level, composition 0.7); each run draws its own graph. Only α and β vary. Held fixed: 12 identical agents, a budget of 150 split equally every round (f = 0), no flat mint, a knowledge reward of 1 per new bit flowing back with α, no validation.

Values are mean ± standard deviation over runs.

| society | budget | frontier | targets solved | value gained | ROI (value per spend) | knowledge (bits) | knowledge published (bits) | bits per money | cost | waste | sharing | reach L6 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 150 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 16 ± 5 | 0 ± 0 | 0.112 ± 0.034 | – | 0.30 ± 0.10 | 0.00 ± 0.00 | 0.00 |
| Traditional (α = 1, β = 0) | 300 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 26 ± 5 | 0 ± 0 | 0.089 ± 0.017 | – | 0.43 ± 0.10 | 0.00 ± 0.00 | 0.00 |
| Traditional (α = 1, β = 0) | 600 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 39 ± 5 | 0 ± 0 | 0.067 ± 0.009 | – | 0.59 ± 0.08 | 0.00 ± 0.00 | 0.00 |
| Traditional (α = 1, β = 0) | 1200 | 0.1 ± 0.9 | 0.0 ± 0.2 | 3 ± 20 | 0.00 ± 0.02 | 60 ± 8 | 1 ± 3 | 0.051 ± 0.007 | 744 ± 0 | 0.72 ± 0.05 | 0.00 ± 0.00 | 0.03 |
| Traditional (α = 1, β = 0) | 2400 | 4.7 ± 2.5 | 1.3 ± 0.8 | 170 ± 106 | 0.08 ± 0.05 | 98 ± 8 | 47 ± 27 | 0.044 ± 0.005 | 1934 ± 329 | 0.80 ± 0.03 | 0.00 ± 0.00 | 0.78 |
| Traditional (α = 1, β = 0) | 4800 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.11 ± 0.02 | 103 ± 12 | 66 ± 8 | 0.044 ± 0.007 | 2123 ± 497 | 0.80 ± 0.03 | 0.00 ± 0.01 | 1.00 |
| Traditional (α = 1, β = 0) | 9600 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.11 ± 0.02 | 105 ± 12 | 68 ± 9 | 0.043 ± 0.006 | 2208 ± 450 | 0.80 ± 0.02 | 0.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 150 | 3.9 ± 1.0 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 35 ± 12 | 35 ± 12 | 0.244 ± 0.082 | – | 0.20 ± 0.06 | 1.00 ± 0.00 | 0.00 |
| OSO (α = 0.8, β = 1) | 300 | 5.6 ± 0.5 | 0.8 ± 0.8 | 96 ± 104 | 0.36 ± 0.40 | 73 ± 15 | 73 ± 15 | 0.262 ± 0.060 | 230 ± 40 | 0.26 ± 0.07 | 1.00 ± 0.00 | 0.60 |
| OSO (α = 0.8, β = 1) | 600 | 6.0 ± 0.0 | 1.8 ± 0.4 | 234 ± 57 | 0.64 ± 0.27 | 98 ± 17 | 98 ± 17 | 0.251 ± 0.061 | 287 ± 87 | 0.32 ± 0.09 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 1200 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.67 ± 0.22 | 100 ± 20 | 100 ± 20 | 0.251 ± 0.060 | 287 ± 87 | 0.31 ± 0.08 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 2400 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.69 ± 0.21 | 99 ± 16 | 99 ± 16 | 0.261 ± 0.061 | 287 ± 99 | 0.32 ± 0.08 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 4800 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.60 ± 0.17 | 107 ± 18 | 107 ± 18 | 0.242 ± 0.050 | 291 ± 106 | 0.35 ± 0.09 | 1.00 ± 0.00 | 1.00 |
| OSO (α = 0.8, β = 1) | 9600 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.69 ± 0.31 | 101 ± 20 | 101 ± 20 | 0.253 ± 0.074 | 302 ± 105 | 0.33 ± 0.07 | 1.00 ± 0.00 | 1.00 |
| α = 0.8, β = 0.5 | 150 | 2.7 ± 1.2 | 0.0 ± 0.0 | 0 ± 0 | 0.00 ± 0.00 | 25 ± 10 | 19 ± 10 | 0.173 ± 0.069 | 144 ± 0 | 0.30 ± 0.10 | 0.45 ± 0.22 | 0.03 |
| α = 0.8, β = 0.5 | 300 | 4.5 ± 1.1 | 0.1 ± 0.4 | 16 ± 52 | 0.06 ± 0.18 | 51 ± 13 | 42 ± 12 | 0.176 ± 0.044 | 224 ± 54 | 0.37 ± 0.07 | 0.53 ± 0.13 | 0.20 |
| α = 0.8, β = 0.5 | 600 | 5.8 ± 0.4 | 1.1 ± 0.8 | 147 ± 103 | 0.29 ± 0.23 | 88 ± 13 | 78 ± 14 | 0.165 ± 0.036 | 404 ± 128 | 0.47 ± 0.08 | 0.53 ± 0.11 | 0.80 |
| α = 0.8, β = 0.5 | 1200 | 6.0 ± 0.0 | 2.0 ± 0.2 | 253 ± 20 | 0.41 ± 0.14 | 102 ± 14 | 93 ± 15 | 0.160 ± 0.039 | 463 ± 171 | 0.49 ± 0.08 | 0.53 ± 0.10 | 1.00 |
| α = 0.8, β = 0.5 | 2400 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.44 ± 0.14 | 101 ± 17 | 94 ± 18 | 0.167 ± 0.035 | 460 ± 145 | 0.49 ± 0.09 | 0.56 ± 0.09 | 1.00 |
| α = 0.8, β = 0.5 | 4800 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.41 ± 0.10 | 101 ± 16 | 92 ± 17 | 0.160 ± 0.033 | 464 ± 133 | 0.50 ± 0.08 | 0.59 ± 0.08 | 1.00 |
| α = 0.8, β = 0.5 | 9600 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.44 ± 0.12 | 102 ± 15 | 94 ± 17 | 0.171 ± 0.034 | 479 ± 169 | 0.51 ± 0.07 | 0.68 ± 0.09 | 1.00 |
| α = 1, β = 1 | 150 | 4.1 ± 1.0 | 0.0 ± 0.2 | 3 ± 20 | 0.02 ± 0.14 | 38 ± 14 | 38 ± 14 | 0.263 ± 0.096 | 138 ± 8 | 0.20 ± 0.06 | 1.00 ± 0.00 | 0.05 |
| α = 1, β = 1 | 300 | 5.5 ± 0.7 | 0.7 ± 0.7 | 90 ± 93 | 0.34 ± 0.39 | 70 ± 15 | 70 ± 15 | 0.252 ± 0.061 | 213 ± 43 | 0.26 ± 0.07 | 1.00 ± 0.00 | 0.63 |
| α = 1, β = 1 | 600 | 6.0 ± 0.0 | 1.9 ± 0.4 | 237 ± 55 | 0.65 ± 0.28 | 98 ± 16 | 98 ± 16 | 0.249 ± 0.053 | 273 ± 89 | 0.32 ± 0.09 | 1.00 ± 0.00 | 1.00 |
| α = 1, β = 1 | 1200 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.67 ± 0.24 | 100 ± 18 | 100 ± 18 | 0.249 ± 0.054 | 273 ± 89 | 0.32 ± 0.08 | 1.00 ± 0.00 | 1.00 |
| α = 1, β = 1 | 2400 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.68 ± 0.29 | 99 ± 20 | 99 ± 20 | 0.249 ± 0.069 | 286 ± 131 | 0.31 ± 0.08 | 1.00 ± 0.00 | 1.00 |
| α = 1, β = 1 | 4800 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.66 ± 0.19 | 103 ± 16 | 103 ± 16 | 0.257 ± 0.066 | 300 ± 107 | 0.33 ± 0.08 | 1.00 ± 0.00 | 1.00 |
| α = 1, β = 1 | 9600 | 6.0 ± 0.0 | 2.0 ± 0.0 | 256 ± 0 | 0.68 ± 0.25 | 100 ± 21 | 100 ± 21 | 0.251 ± 0.070 | 286 ± 102 | 0.33 ± 0.08 | 1.00 ± 0.00 | 1.00 |

Code: commit `dc540e2`. Experiment: [config/experiments/simple-ideas-6x8-p2-len3g2-comp0-7-budget-scaling-20261023.yaml](../../config/experiments/simple-ideas-6x8-p2-len3g2-comp0-7-budget-scaling-20261023.yaml). Command: `npm run sim -- simple-ideas-6x8-p2-len3g2-comp0-7-budget-scaling-20261023 --seeds 40 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
