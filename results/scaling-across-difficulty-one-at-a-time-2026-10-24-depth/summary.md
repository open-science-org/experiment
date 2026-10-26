# Scaling as depth changes

**Question:** As depth changes (everything else as the default graph), how much money does each society need, and does the gap between traditional and OSO grow?

**Answer:** To solve half the targets, traditional needs 5.3× to 7.0× the money OSO needs. By difficulty: depth 4 6.1×, depth 6 7.0×, depth 8 5.3×, depth 10 5.9×.

![Scaling as depth changes](figures/compare.svg)

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | α = 0.8, β = 0.5 | traditional ÷ OSO |
| --- | --- | --- | --- | --- | --- |
| depth 4 | 827 | 136 | 140 | 227 | 6.1× |
| depth 6 | 2,193 | 315 | 293 | 533 | 7.0× |
| depth 8 | 4,786 | 907 | 749 | 1,226 | 5.3× |
| depth 10 | 12,364 | 2,089 | 1,890 | 3,200 | 5.9× |

**Design** (fixed before the run): compared 4 societies on 4 difficulties (depth 4, depth 6, depth 8, depth 10) · held the same: the simple model: 12 identical agents, equal money each round, a knowledge reward of 1 per new bit, no validation · measure: money needed to solve half the targets, lower is better · from the sweeps tagged "one at a time 2026-10-24: depth".

**Caveats:**
- Read off between the two budgets that bracket half the targets, in log budget.
- Each difficulty has its own budget range; "> x" means not reached within it.

<details><summary>Details</summary>

**Log–log slope of bounty value against budget** (where value is above 0 and below 90% of its most; a slope of 1 means value grows in proportion to money):

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | α = 0.8, β = 0.5 |
| --- | --- | --- | --- | --- |
| depth 4 | 2.12 | 2.13 | – | 3.00 |
| depth 6 | – | 3.27 | 3.04 | 3.00 |
| depth 8 | 4.04 | 4.00 | 4.46 | 2.91 |
| depth 10 | 4.39 | 3.32 | 3.81 | 4.32 |

From: [Scaling, depth 4 (else default)](../simple-ideas-4x8-p2-len3g2-comp0-7-one-at-a-time-depth-20261024/summary.md), [Scaling, depth 6 (else default)](../simple-ideas-6x8-p2-len3g2-comp0-7-one-at-a-time-depth-20261024/summary.md), [Scaling, depth 8 (else default)](../simple-ideas-8x8-p2-len3g2-comp0-7-one-at-a-time-depth-20261024/summary.md), [Scaling, depth 10 (else default)](../simple-ideas-10x8-p2-len3g2-comp0-7-one-at-a-time-depth-20261024/summary.md).

</details>
