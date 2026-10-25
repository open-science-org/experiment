# Scaling across difficulty

**Question:** As problems get harder, how much more money does each society need, and does the gap between traditional and OSO grow?

**Answer:** To solve half the targets, traditional needs 3.1× to 6.2× the money OSO needs. By difficulty: easy 3.1×, default 6.2×, medium 4.9×, hard 4.3×, very hard 4.4×.

![Scaling across difficulty](figures/compare.svg)

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | α = 0.8, β = 0.5 | α = 1, β = 1 | traditional ÷ OSO |
| --- | --- | --- | --- | --- | --- | --- |
| easy | 92 | 30 | 30 | 37 | 29 | 3.1× |
| default | 1,937 | 314 | 279 | 495 | 340 | 6.2× |
| medium | 2,988 | 613 | 542 | 962 | 566 | 4.9× |
| hard | 31,095 | 7,161 | 6,892 | 9,603 | 7,300 | 4.3× |
| very hard | 70,321 | 16,133 | 15,258 | 23,443 | 15,642 | 4.4× |

**Design** (fixed before the run): compared 5 societies on 5 difficulties (easy, default, medium, hard, very hard) · held the same: the simple model: 12 identical agents, equal money each round, no mint, no validation · measure: money needed to solve half the targets, lower is better · from the sweeps tagged "scaling ladder 2026-10-24".

**Caveats:**
- Read off between the two budgets that bracket half the targets, in log budget.
- Each difficulty has its own budget range; "> x" means not reached within it.

<details><summary>Details</summary>

**Log–log slope of bounty value against budget** (where value is above 0 and below 90% of its most; a slope of 1 means value grows in proportion to money):

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | α = 0.8, β = 0.5 | α = 1, β = 1 |
| --- | --- | --- | --- | --- | --- |
| easy | 2.02 | 1.18 | 1.09 | 1.49 | 1.14 |
| default | 5.43 | 3.81 | 2.72 | 3.32 | 4.58 |
| medium | 2.43 | 2.88 | 2.29 | 3.20 | 2.46 |
| hard | 2.30 | 1.91 | 1.60 | 2.24 | 1.83 |
| very hard | 2.35 | 1.75 | 1.80 | 2.15 | 1.81 |

From: [Scaling: Easy graph (4 × 6)](../simple-ideas-4x6-p1-5-len2g1-comp0-7-scaling-ladder-20261024/summary.md), [Scaling: Default graph (6 × 8)](../simple-ideas-6x8-p2-len3g2-comp0-7-scaling-ladder-20261024/summary.md), [Scaling: Medium graph (8 × 8, bounties from level 5)](../simple-ideas-8x8-p2-len3g2-comp0-7-bounties-from-5-scaling-ladder-20261024/summary.md), [Scaling: Hard graph (10 × 10)](../simple-ideas-10x10-p2-5-len4g3-comp0-7-bounties-from-5-scaling-ladder-20261024/summary.md), [Scaling: Very hard graph (14 × 12)](../simple-ideas-14x12-p3-len4g3-comp0-8-bounties-from-7-scaling-ladder-20261024/summary.md).

</details>
