# Scaling as parents changes

**Question:** As parents changes (everything else as the default graph), how much money does each society need, and does the gap between traditional and OSO grow?

**Answer:** To solve half the targets, traditional needs 3.4× to 7.4× the money OSO needs. By difficulty: parents 1 3.4×, parents 2 7.2×, parents 3 7.0×, parents 4 7.4×.

![Scaling as parents changes](figures/compare.svg)

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | α = 0.8, β = 0.5 | traditional ÷ OSO |
| --- | --- | --- | --- | --- | --- |
| parents 1 | 800 | 236 | 187 | 362 | 3.4× |
| parents 2 | 2,197 | 306 | 273 | 517 | 7.2× |
| parents 3 | 2,220 | 315 | 292 | 571 | 7.0× |
| parents 4 | 2,447 | 329 | 329 | 578 | 7.4× |

**Design** (fixed before the run): compared 4 societies on 4 difficulties (parents 1, parents 2, parents 3, parents 4) · held the same: the simple model: 12 identical agents, equal money each round, no mint, no validation · measure: money needed to solve half the targets, lower is better · from the sweeps tagged "one at a time 2026-10-24: parents".

**Caveats:**
- Read off between the two budgets that bracket half the targets, in log budget.
- Each difficulty has its own budget range; "> x" means not reached within it.

<details><summary>Details</summary>

**Log–log slope of bounty value against budget** (where value is above 0 and below 90% of its most; a slope of 1 means value grows in proportion to money):

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | α = 0.8, β = 0.5 |
| --- | --- | --- | --- | --- |
| parents 1 | 2.00 | 3.81 | 3.46 | 3.52 |
| parents 2 | – | 2.91 | – | – |
| parents 3 | – | 1.47 | 2.54 | – |
| parents 4 | 5.00 | 3.75 | 2.38 | 3.54 |

From: [Scaling, parents 1 (else default)](../simple-ideas-6x8-p1-len3g2-comp0-7-one-at-a-time-parents-20261024/summary.md), [Scaling, parents 2 (else default)](../simple-ideas-6x8-p2-len3g2-comp0-7-one-at-a-time-parents-20261024/summary.md), [Scaling, parents 3 (else default)](../simple-ideas-6x8-p3-len3g2-comp0-7-one-at-a-time-parents-20261024/summary.md), [Scaling, parents 4 (else default)](../simple-ideas-6x8-p4-len3g2-comp0-7-one-at-a-time-parents-20261024/summary.md).

</details>
