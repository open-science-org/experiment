# Scaling as length growth changes

**Question:** As length growth changes (everything else as the default graph), how much money does each society need, and does the gap between traditional and OSO grow?

**Answer:** To solve half the targets, traditional needs 4.9× to 7.2× the money OSO needs. By difficulty: length growth 1 6.8×, length growth 2 7.2×, length growth 3 6.8×, length growth 4 4.9×.

![Scaling as length growth changes](figures/compare.svg)

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | α = 0.8, β = 0.5 | traditional ÷ OSO |
| --- | --- | --- | --- | --- | --- |
| length growth 1 | 939 | 138 | 148 | 235 | 6.8× |
| length growth 2 | 2,197 | 306 | 273 | 517 | 7.2× |
| length growth 3 | 4,483 | 662 | 582 | 1,131 | 6.8× |
| length growth 4 | 8,793 | 1,808 | 1,671 | 2,335 | 4.9× |

**Design** (fixed before the run): compared 4 societies on 4 difficulties (length growth 1, length growth 2, length growth 3, length growth 4) · held the same: the simple model: 12 identical agents, equal money each round, no mint, no validation · measure: money needed to solve half the targets, lower is better · from the sweeps tagged "one at a time 2026-10-24: length growth".

**Caveats:**
- Read off between the two budgets that bracket half the targets, in log budget.
- Each difficulty has its own budget range; "> x" means not reached within it.

<details><summary>Details</summary>

**Log–log slope of bounty value against budget** (where value is above 0 and below 90% of its most; a slope of 1 means value grows in proportion to money):

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | α = 0.8, β = 0.5 |
| --- | --- | --- | --- | --- |
| length growth 1 | 0.86 | 2.06 | 3.46 | 1.90 |
| length growth 2 | – | 2.91 | – | – |
| length growth 3 | – | 2.70 | 2.15 | 2.00 |
| length growth 4 | 1.87 | 2.54 | 1.56 | 1.06 |

From: [Scaling, length growth 1 (else default)](../simple-ideas-6x8-p2-len3g1-comp0-7-one-at-a-time-length-growth-20261024/summary.md), [Scaling, length growth 2 (else default)](../simple-ideas-6x8-p2-len3g2-comp0-7-one-at-a-time-length-growth-20261024/summary.md), [Scaling, length growth 3 (else default)](../simple-ideas-6x8-p2-len3g3-comp0-7-one-at-a-time-length-growth-20261024/summary.md), [Scaling, length growth 4 (else default)](../simple-ideas-6x8-p2-len3g4-comp0-7-one-at-a-time-length-growth-20261024/summary.md).

</details>
