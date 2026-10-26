# Scaling as length growth changes

**Meta-analysis:** runs nothing itself; it combines the results of 4 experiments: [Scaling, length growth 1 (else default)](../simple-ideas-6x8-p2-len3g1-comp0-7-one-at-a-time-length-growth-20261024/summary.md), [Scaling, length growth 2 (else default)](../simple-ideas-6x8-p2-len3g2-comp0-7-one-at-a-time-length-growth-20261024/summary.md), [Scaling, length growth 3 (else default)](../simple-ideas-6x8-p2-len3g3-comp0-7-one-at-a-time-length-growth-20261024/summary.md), [Scaling, length growth 4 (else default)](../simple-ideas-6x8-p2-len3g4-comp0-7-one-at-a-time-length-growth-20261024/summary.md).

**Question:** As length growth changes (everything else as the default graph), how much money does each society need, and does the gap between traditional and OSO grow?

**Answer:** To solve half the targets, traditional needs 4.9× to 7.7× the money OSO needs. By difficulty: length growth 1 7.7×, length growth 2 6.8×, length growth 3 6.0×, length growth 4 4.9×.

![Scaling as length growth changes](figures/compare.svg)

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | α = 0.8, β = 0.5 | traditional ÷ OSO |
| --- | --- | --- | --- | --- | --- |
| length growth 1 | 1,008 | 131 | 148 | 248 | 7.7× |
| length growth 2 | 2,153 | 315 | 293 | 566 | 6.8× |
| length growth 3 | 4,334 | 721 | 558 | 1,131 | 6.0× |
| length growth 4 | 9,510 | 1,950 | 2,136 | 3,072 | 4.9× |

**Design** (fixed before the run): compared 4 societies on 4 difficulties (length growth 1, length growth 2, length growth 3, length growth 4) · held the same: the simple model: 12 identical agents, equal money each round, a knowledge reward of 1 per new bit, no validation · measure: money needed to solve half the targets, lower is better · from the sweeps tagged "one at a time 2026-10-24: length growth".

**Caveats:**
- Read off between the two budgets that bracket half the targets, in log budget.
- Each difficulty has its own budget range; "> x" means not reached within it.

<details><summary>Details</summary>

**Log–log slope of bounty value against budget** (where value is above 0 and below 90% of its most; a slope of 1 means value grows in proportion to money):

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | α = 0.8, β = 0.5 |
| --- | --- | --- | --- | --- |
| length growth 1 | 0.66 | 3.17 | 4.09 | 1.73 |
| length growth 2 | – | 3.27 | 3.04 | 2.52 |
| length growth 3 | – | 2.94 | 2.54 | 2.24 |
| length growth 4 | 1.86 | 1.16 | 1.88 | 2.39 |

</details>
