# Scaling as length growth changes

**Question:** As length growth changes (everything else as the default graph), how much money does each society need, and does the gap between traditional and OSO grow?

**Answer:** To solve half the targets, traditional needs 5.0× to 6.3× the money OSO needs. By difficulty: length growth 1 5.9×, length growth 2 6.3×, length growth 3 6.2×, length growth 4 5.0×.

![Scaling as length growth changes](figures/compare.svg)

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | α = 0.8, β = 0.5 | traditional ÷ OSO |
| --- | --- | --- | --- | --- | --- |
| length growth 1 | 768 | 131 | 129 | 227 | 5.9× |
| length growth 2 | 2,046 | 323 | 292 | 538 | 6.3× |
| length growth 3 | 4,202 | 673 | 622 | 1,131 | 6.2× |
| length growth 4 | 9,830 | 1,950 | 1,838 | 2,410 | 5.0× |

**Design** (fixed before the run): compared 4 societies on 4 difficulties (length growth 1, length growth 2, length growth 3, length growth 4) · held the same: the simple model: 12 identical agents, equal money each round, no mint, no validation · measure: money needed to solve half the targets, lower is better · from the sweeps tagged "one at a time 2026-10-24: length growth".

**Caveats:**
- Read off between the two budgets that bracket half the targets, in log budget.
- Each difficulty has its own budget range; "> x" means not reached within it.

<details><summary>Details</summary>

**Log–log slope of bounty value against budget** (where value is above 0 and below 90% of its most; a slope of 1 means value grows in proportion to money):

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | α = 0.8, β = 0.5 |
| --- | --- | --- | --- | --- |
| length growth 1 | 2.39 | 1.63 | 2.17 | 4.00 |
| length growth 2 | – | 3.81 | 3.50 | – |
| length growth 3 | – | 2.32 | 2.22 | 2.40 |
| length growth 4 | 2.00 | 1.66 | 2.00 | 1.39 |

From: [Scaling, length growth 1 (else default)](../simple-ideas-6x8-p2-len3g1-comp0-7-one-at-a-time-length-growth-20261024/summary.md), [Scaling, length growth 2 (else default)](../simple-ideas-6x8-p2-len3g2-comp0-7-one-at-a-time-length-growth-20261024/summary.md), [Scaling, length growth 3 (else default)](../simple-ideas-6x8-p2-len3g3-comp0-7-one-at-a-time-length-growth-20261024/summary.md), [Scaling, length growth 4 (else default)](../simple-ideas-6x8-p2-len3g4-comp0-7-one-at-a-time-length-growth-20261024/summary.md).

</details>
