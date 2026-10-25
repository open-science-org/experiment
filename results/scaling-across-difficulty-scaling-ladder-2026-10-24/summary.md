# Scaling across difficulty

**Question:** As problems get harder, how much more money does each society need, and does the gap between traditional and OSO grow?

**Answer:** To solve half the targets, traditional needs 3.7× to 6.3× the money OSO needs. By difficulty: easy 3.8×, default 6.3×, medium 4.6×, hard 3.7×, very hard 4.6×.

![Scaling across difficulty](figures/compare.svg)

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | α = 0.8, β = 0.5 | α = 1, β = 1 | traditional ÷ OSO |
| --- | --- | --- | --- | --- | --- | --- |
| easy | 121 | 32 | 33 | 47 | 30 | 3.8× |
| default | 2,045 | 325 | 275 | 502 | 273 | 6.3× |
| medium | 2,721 | 593 | 516 | 906 | 595 | 4.6× |
| hard | 26,442 | 7,053 | 5,948 | 9,549 | 6,578 | 3.7× |
| very hard | 63,025 | 13,644 | 13,655 | 19,722 | 14,142 | 4.6× |

**Design** (fixed before the run): compared 5 societies on 5 difficulties (easy, default, medium, hard, very hard) · held the same: the simple model: 12 identical agents, equal money each round, no mint, no validation · measure: money needed to solve half the targets, lower is better · from the sweeps tagged "scaling ladder 2026-10-24".

**Caveats:**
- Read off between the two budgets that bracket half the targets, in log budget.
- Each difficulty has its own budget range; "> x" means not reached within it.

<details><summary>Details</summary>

**Log–log slope of bounty value against budget** (where value is above 0 and below 90% of its most; a slope of 1 means value grows in proportion to money):

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | α = 0.8, β = 0.5 | α = 1, β = 1 |
| --- | --- | --- | --- | --- | --- |
| easy | 1.86 | 1.13 | 1.28 | 2.00 | 0.82 |
| default | – | 3.70 | 4.09 | 3.29 | 2.77 |
| medium | 2.58 | 4.02 | 2.28 | 3.23 | 3.52 |
| hard | 2.71 | 1.87 | 1.66 | 1.87 | 1.93 |
| very hard | 2.63 | 1.72 | 1.71 | 1.88 | 1.81 |

From: [Scaling: Easy graph (4 × 6)](../simple-ideas-4x6-p1-5-len2g1-comp0-7-scaling-ladder-20261024/summary.md), [Scaling: Default graph (6 × 8)](../simple-ideas-6x8-p2-len3g2-comp0-7-scaling-ladder-20261024/summary.md), [Scaling: Medium graph (8 × 8, bounties from level 5)](../simple-ideas-8x8-p2-len3g2-comp0-7-bounties-from-5-scaling-ladder-20261024/summary.md), [Scaling: Hard graph (10 × 10)](../simple-ideas-10x10-p2-5-len4g3-comp0-7-bounties-from-5-scaling-ladder-20261024/summary.md), [Scaling: Very hard graph (14 × 12)](../simple-ideas-14x12-p3-len4g3-comp0-8-bounties-from-7-scaling-ladder-20261024/summary.md).

</details>
