# Scaling as depth changes

**Question:** As depth changes (everything else as the default graph), how much money does each society need, and does the gap between traditional and OSO grow?

**Answer:** To solve half the targets, traditional needs 4.5× to 7.2× the money OSO needs. By difficulty: depth 4 4.5×, depth 6 7.2×, depth 8 6.1×, depth 10 6.6×.

![Scaling as depth changes](figures/compare.svg)

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | α = 0.8, β = 0.5 | traditional ÷ OSO |
| --- | --- | --- | --- | --- | --- |
| depth 4 | 606 | 134 | 109 | 200 | 4.5× |
| depth 6 | 2,197 | 306 | 273 | 517 | 7.2× |
| depth 8 | 4,894 | 800 | 709 | 1,345 | 6.1× |
| depth 10 | 13,230 | 2,016 | 1,873 | 3,517 | 6.6× |

**Design** (fixed before the run): compared 4 societies on 4 difficulties (depth 4, depth 6, depth 8, depth 10) · held the same: the simple model: 12 identical agents, equal money each round, no mint, no validation · measure: money needed to solve half the targets, lower is better · from the sweeps tagged "one at a time 2026-10-24: depth".

**Caveats:**
- Read off between the two budgets that bracket half the targets, in log budget.
- Each difficulty has its own budget range; "> x" means not reached within it.

<details><summary>Details</summary>

**Log–log slope of bounty value against budget** (where value is above 0 and below 90% of its most; a slope of 1 means value grows in proportion to money):

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | α = 0.8, β = 0.5 |
| --- | --- | --- | --- | --- |
| depth 4 | 2.45 | 1.96 | – | – |
| depth 6 | – | 2.91 | – | – |
| depth 8 | 5.00 | – | 4.58 | 3.70 |
| depth 10 | 4.25 | 2.46 | – | 4.09 |

From: [Scaling, depth 4 (else default)](../simple-ideas-4x8-p2-len3g2-comp0-7-one-at-a-time-depth-20261024/summary.md), [Scaling, depth 6 (else default)](../simple-ideas-6x8-p2-len3g2-comp0-7-one-at-a-time-depth-20261024/summary.md), [Scaling, depth 8 (else default)](../simple-ideas-8x8-p2-len3g2-comp0-7-one-at-a-time-depth-20261024/summary.md), [Scaling, depth 10 (else default)](../simple-ideas-10x8-p2-len3g2-comp0-7-one-at-a-time-depth-20261024/summary.md).

</details>
