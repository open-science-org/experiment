# Scaling across difficulty, with f = 1

**Question:** As difficulty, with f = 1 changes (everything else as the default graph), how much money does each society need, and does the gap between traditional and OSO grow?

**Answer:** To solve half the targets, traditional needs 2.0× to 6.3× the money OSO needs. By difficulty: default 6.3×, hard 2.0×.

![Scaling across difficulty, with f = 1](figures/compare.svg)

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | OSO (α = 0, β = 1) | α = 0.8, β = 0.5 | α = 1, β = 1 | traditional ÷ OSO |
| --- | --- | --- | --- | --- | --- | --- | --- |
| default | 1,969 | 314 | 265 | 497 | 482 | 284 | 6.3× |
| hard | 12,684 | 6,320 | 5,894 | 13,099 | 7,111 | 6,784 | 2.0× |

**Design** (fixed before the run): compared 6 societies on 2 difficulties (default, hard) · held the same: the simple model: 12 identical agents, equal money each round, no mint, no validation · measure: money needed to solve half the targets, lower is better · from the sweeps tagged "f 1".

**Caveats:**
- Read off between the two budgets that bracket half the targets, in log budget.
- Each difficulty has its own budget range; "> x" means not reached within it.

<details><summary>Details</summary>

**Log–log slope of bounty value against budget** (where value is above 0 and below 90% of its most; a slope of 1 means value grows in proportion to money):

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | OSO (α = 0, β = 1) | α = 0.8, β = 0.5 | α = 1, β = 1 |
| --- | --- | --- | --- | --- | --- | --- |
| default | – | 3.81 | 4.17 | 3.74 | 3.39 | 2.42 |
| hard | 3.99 | 1.75 | 1.65 | 1.72 | 1.87 | 1.87 |

From: [Scaling with earnings shaping next round's money (f = 1): Default graph (6 × 8)](../simple-ideas-6x8-p2-len3g2-comp0-7-f1-scaling-20261024/summary.md), [Scaling with earnings shaping next round's money (f = 1): Hard graph (10 × 10)](../simple-ideas-10x10-p2-5-len4g3-comp0-7-bounties-from-5-f1-scaling-20261024/summary.md).

</details>
