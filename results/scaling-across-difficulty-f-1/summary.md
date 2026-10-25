# Scaling across difficulty, with f = 1

**Question:** As difficulty, with f = 1 changes (everything else as the default graph), how much money does each society need, and does the gap between traditional and OSO grow?

**Answer:** To solve half the targets, traditional needs 1.8× to 6.3× the money OSO needs. By difficulty: default 6.3×, hard 1.8×.

![Scaling across difficulty, with f = 1](figures/compare.svg)

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | OSO (α = 0, β = 1) | α = 0.8, β = 0.5 | α = 1, β = 1 | traditional ÷ OSO |
| --- | --- | --- | --- | --- | --- | --- | --- |
| default | 1,798 | 286 | 272 | 525 | 482 | 331 | 6.3× |
| hard | 13,432 | 7,478 | 6,662 | 13,162 | 7,645 | 7,156 | 1.8× |

**Design** (fixed before the run): compared 6 societies on 2 difficulties (default, hard) · held the same: the simple model: 12 identical agents, equal money each round, no mint, no validation · measure: money needed to solve half the targets, lower is better · from the sweeps tagged "f 1".

**Caveats:**
- Read off between the two budgets that bracket half the targets, in log budget.
- Each difficulty has its own budget range; "> x" means not reached within it.

<details><summary>Details</summary>

**Log–log slope of bounty value against budget** (where value is above 0 and below 90% of its most; a slope of 1 means value grows in proportion to money):

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | OSO (α = 0, β = 1) | α = 0.8, β = 0.5 | α = 1, β = 1 |
| --- | --- | --- | --- | --- | --- | --- |
| default | 4.64 | 4.00 | 2.50 | 2.85 | 3.39 | 4.64 |
| hard | 2.97 | 1.94 | 1.60 | 1.80 | 2.34 | 1.78 |

From: [Scaling with earnings shaping next round's money (f = 1): Default graph (6 × 8)](../simple-ideas-6x8-p2-len3g2-comp0-7-f1-scaling-20261024/summary.md), [Scaling with earnings shaping next round's money (f = 1): Hard graph (10 × 10)](../simple-ideas-10x10-p2-5-len4g3-comp0-7-bounties-from-5-f1-scaling-20261024/summary.md).

</details>
