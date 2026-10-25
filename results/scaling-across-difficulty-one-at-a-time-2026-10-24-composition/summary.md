# Scaling as composition changes

**Question:** As composition changes (everything else as the default graph), how much money does each society need, and does the gap between traditional and OSO grow?

**Answer:** To solve half the targets, traditional needs 6.0× to 7.2× the money OSO needs. By difficulty: composition 0.5 6.0×, composition 0.7 7.2×, composition 0.85 6.7×, composition 0.95 6.6×.

![Scaling as composition changes](figures/compare.svg)

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | α = 0.8, β = 0.5 | traditional ÷ OSO |
| --- | --- | --- | --- | --- | --- |
| composition 0.5 | 4,092 | 686 | 610 | 1,077 | 6.0× |
| composition 0.7 | 2,197 | 306 | 273 | 517 | 7.2× |
| composition 0.85 | 1,181 | 176 | 194 | 286 | 6.7× |
| composition 0.95 | 1,094 | 167 | 157 | 263 | 6.6× |

**Design** (fixed before the run): compared 4 societies on 4 difficulties (composition 0.5, composition 0.7, composition 0.85, composition 0.95) · held the same: the simple model: 12 identical agents, equal money each round, no mint, no validation · measure: money needed to solve half the targets, lower is better · from the sweeps tagged "one at a time 2026-10-24: composition".

**Caveats:**
- Read off between the two budgets that bracket half the targets, in log budget.
- Each difficulty has its own budget range; "> x" means not reached within it.

<details><summary>Details</summary>

**Log–log slope of bounty value against budget** (where value is above 0 and below 90% of its most; a slope of 1 means value grows in proportion to money):

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | α = 0.8, β = 0.5 |
| --- | --- | --- | --- | --- |
| composition 0.5 | – | 2.00 | 2.27 | 3.00 |
| composition 0.7 | – | 2.91 | – | – |
| composition 0.85 | 2.54 | 3.58 | – | 2.77 |
| composition 0.95 | – | 3.12 | 2.49 | – |

From: [Scaling, composition 0.5 (else default)](../simple-ideas-6x8-p2-len3g2-comp0-5-one-at-a-time-composition-20261024/summary.md), [Scaling, composition 0.7 (else default)](../simple-ideas-6x8-p2-len3g2-comp0-7-one-at-a-time-composition-20261024/summary.md), [Scaling, composition 0.85 (else default)](../simple-ideas-6x8-p2-len3g2-comp0-85-one-at-a-time-composition-20261024/summary.md), [Scaling, composition 0.95 (else default)](../simple-ideas-6x8-p2-len3g2-comp0-95-one-at-a-time-composition-20261024/summary.md).

</details>
