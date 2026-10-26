# Scaling across difficulty

**Meta-analysis:** runs nothing itself; it combines the results of 5 experiments: [Scaling: Easy graph (4 × 6)](../simple-ideas-4x6-p1-5-len2g1-comp0-7-scaling-ladder-20261024/summary.md), [Scaling: Default graph (6 × 8)](../simple-ideas-6x8-p2-len3g2-comp0-7-scaling-ladder-20261024/summary.md), [Scaling: Medium graph (8 × 8, bounties from level 5)](../simple-ideas-8x8-p2-len3g2-comp0-7-bounties-from-5-scaling-ladder-20261024/summary.md), [Scaling: Hard graph (10 × 10)](../simple-ideas-10x10-p2-5-len4g3-comp0-7-bounties-from-5-scaling-ladder-20261024/summary.md), [Scaling: Very hard graph (14 × 12)](../simple-ideas-14x12-p3-len4g3-comp0-8-bounties-from-7-scaling-ladder-20261024/summary.md).

**Question:** As problems get harder, how much more money does each society need, and does the gap between traditional and OSO grow?

**Answer:** To solve half the targets, traditional needs 3.5× to 5.7× the money OSO needs. By difficulty: easy 3.5×, default 5.7×, medium 4.9×, hard 3.9×, very hard 4.6×.

![Scaling across difficulty](figures/compare.svg)

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | α = 0.8, β = 0.5 | α = 1, β = 1 | traditional ÷ OSO |
| --- | --- | --- | --- | --- | --- | --- |
| easy | 134 | 38 | 36 | 51 | 31 | 3.5× |
| default | 1,840 | 322 | 327 | 535 | 346 | 5.7× |
| medium | 2,961 | 600 | 525 | 893 | 553 | 4.9× |
| hard | 25,703 | 6,602 | 6,167 | 9,066 | 6,365 | 3.9× |
| very hard | 62,608 | 13,676 | 13,770 | 20,724 | 13,857 | 4.6× |

**Design** (fixed before the run): compared 5 societies on 5 difficulties (easy, default, medium, hard, very hard) · held the same: the simple model: 12 identical agents, equal money each round, a knowledge reward of 1 per new bit, no validation · measure: money needed to solve half the targets, lower is better · from the sweeps tagged "scaling ladder 2026-10-24".

**Caveats:**
- Read off between the two budgets that bracket half the targets, in log budget.
- Each difficulty has its own budget range; "> x" means not reached within it.

<details><summary>Details</summary>

**Log–log slope of bounty value against budget** (where value is above 0 and below 90% of its most; a slope of 1 means value grows in proportion to money):

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | α = 0.8, β = 0.5 | α = 1, β = 1 |
| --- | --- | --- | --- | --- | --- |
| easy | 1.88 | 1.42 | 1.94 | 2.05 | 0.87 |
| default | 5.58 | – | 3.70 | 2.81 | 4.52 |
| medium | 2.40 | 2.69 | 2.48 | 2.57 | 3.55 |
| hard | 2.34 | 1.72 | 1.54 | 1.77 | 1.80 |
| very hard | 2.25 | 1.75 | 1.71 | 2.19 | 1.84 |

</details>
