# Scaling as parents changes

**Meta-analysis:** runs nothing itself; it combines the results of 4 experiments: [Scaling, parents 1 (else default)](../simple-ideas-6x8-p1-len3g2-comp0-7-one-at-a-time-parents-20261024/summary.md), [Scaling, parents 2 (else default)](../simple-ideas-6x8-p2-len3g2-comp0-7-one-at-a-time-parents-20261024/summary.md), [Scaling, parents 3 (else default)](../simple-ideas-6x8-p3-len3g2-comp0-7-one-at-a-time-parents-20261024/summary.md), [Scaling, parents 4 (else default)](../simple-ideas-6x8-p4-len3g2-comp0-7-one-at-a-time-parents-20261024/summary.md).

**Question:** As parents changes (everything else as the default graph), how much money does each society need, and does the gap between traditional and OSO grow?

**Answer:** To solve half the targets, traditional needs 3.0× to 7.0× the money OSO needs. By difficulty: parents 1 3.0×, parents 2 6.8×, parents 3 7.0×, parents 4 6.8×.

![Scaling as parents changes](figures/compare.svg)

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | α = 0.8, β = 0.5 | traditional ÷ OSO |
| --- | --- | --- | --- | --- | --- |
| parents 1 | 879 | 290 | 292 | 362 | 3.0× |
| parents 2 | 2,153 | 315 | 293 | 566 | 6.8× |
| parents 3 | 2,309 | 328 | 334 | 579 | 7.0× |
| parents 4 | 2,460 | 364 | 346 | 612 | 6.8× |

**Design** (fixed before the run): compared 4 societies on 4 difficulties (parents 1, parents 2, parents 3, parents 4) · held the same: the simple model: 12 identical agents, equal money each round, a knowledge reward of 1 per new bit, no validation · measure: money needed to solve half the targets, lower is better · from the sweeps tagged "one at a time 2026-10-24: parents".

**Caveats:**
- Read off between the two budgets that bracket half the targets, in log budget.
- Each difficulty has its own budget range; "> x" means not reached within it.

<details><summary>Details</summary>

**Log–log slope of bounty value against budget** (where value is above 0 and below 90% of its most; a slope of 1 means value grows in proportion to money):

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | α = 0.8, β = 0.5 |
| --- | --- | --- | --- | --- |
| parents 1 | 4.09 | 2.00 | 3.50 | 3.52 |
| parents 2 | – | 3.27 | 3.04 | 2.52 |
| parents 3 | – | – | – | 3.09 |
| parents 4 | 3.95 | 4.52 | 4.64 | 5.00 |

</details>
