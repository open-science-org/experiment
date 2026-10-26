# Scaling across difficulty, with f = 0.5

**Meta-analysis:** runs nothing itself; it combines the results of 2 experiments: [Scaling with earnings shaping next round's money (f = 0.5): Default graph (6 × 8)](../simple-ideas-6x8-p2-len3g2-comp0-7-f0-5-scaling-20261024/summary.md), [Scaling with earnings shaping next round's money (f = 0.5): Hard graph (10 × 10)](../simple-ideas-10x10-p2-5-len4g3-comp0-7-bounties-from-5-f0-5-scaling-20261024/summary.md).

**Question:** Across difficulty, with f = 0.5, how much money does each society need, and does the gap between traditional and OSO grow?

**Answer:** To solve half the targets, traditional needs 2.5× to 5.4× the money OSO needs. By difficulty: default 5.4×, hard 2.5×.

![Scaling across difficulty, with f = 0.5](figures/compare.svg)

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | OSO (α = 0, β = 1) | α = 0.8, β = 0.5 | α = 1, β = 1 | traditional ÷ OSO |
| --- | --- | --- | --- | --- | --- | --- | --- |
| default | 1,756 | 328 | 343 | 439 | 460 | 340 | 5.4× |
| hard | 15,867 | 6,382 | 5,852 | 13,723 | 8,485 | 6,882 | 2.5× |

**Design** (fixed before the run): compared 6 societies on 2 difficulties (default, hard) · held the same: the simple model: 12 identical agents, equal money each round, a knowledge reward of 1 per new bit, no validation · measure: money needed to solve half the targets, lower is better · from the sweeps tagged "f 0.5".

**Caveats:**
- Read off between the two budgets that bracket half the targets, in log budget.
- Each difficulty has its own budget range; "> x" means not reached within it.

<details><summary>Details</summary>

**Log–log slope of bounty value against budget** (where value is above 0 and below 90% of its most; a slope of 1 means value grows in proportion to money):

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | OSO (α = 0, β = 1) | α = 0.8, β = 0.5 | α = 1, β = 1 |
| --- | --- | --- | --- | --- | --- | --- |
| default | 4.73 | 2.70 | 3.52 | 2.79 | 2.91 | 4.58 |
| hard | 2.35 | 1.88 | 1.95 | 1.63 | 1.71 | 1.80 |

</details>
