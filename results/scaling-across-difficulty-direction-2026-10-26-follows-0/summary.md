# Scaling across direction of difficulty, follows level not at all

**Meta-analysis:** runs nothing itself; it combines the results of 4 experiments: [Direction of difficulty: easier by 1 bit per level; follows level not at all](../simple-ideas-6x8-p2-len3gm1-comp0-7-tie0-direction-scaling-20261026/summary.md), [Direction of difficulty: every level equally hard; follows level not at all](../simple-ideas-6x8-p2-len3g0-comp0-7-tie0-direction-scaling-20261026/summary.md), [Direction of difficulty: harder by 2 bits per level; follows level not at all](../simple-ideas-6x8-p2-len3g2-comp0-7-tie0-direction-scaling-20261026/summary.md), [Direction of difficulty: harder by 4 bits per level; follows level not at all](../simple-ideas-6x8-p2-len3g4-comp0-7-tie0-direction-scaling-20261026/summary.md).

**Question:** Across direction of difficulty, follows level not at all, how much money does each society need, and does the gap between traditional and OSO grow?

**Answer:** To solve half the targets, traditional needs 1.3× to 5.3× the money OSO needs. By difficulty: growth -1 1.3×, growth 0 2.1×, growth 2 5.3×, growth 4 5.0×.

![Scaling across direction of difficulty, follows level not at all](figures/compare.svg)

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | α = 0.8, β = 0.5 | α = 1, β = 1 | traditional ÷ OSO |
| --- | --- | --- | --- | --- | --- | --- |
| growth -1 | 49 | 36 | 49 | 40 | 35 | 1.3× |
| growth 0 | 109 | 51 | 53 | 70 | 50 | 2.1× |
| growth 2 | 889 | 167 | 176 | 277 | 163 | 5.3× |
| growth 4 | 3,792 | 763 | 927 | 1,230 | 765 | 5.0× |

**Design** (fixed before the run): compared 5 societies on 4 difficulties (growth -1, growth 0, growth 2, growth 4) · held the same: the simple model: 12 identical agents, equal money each round, a knowledge reward of 1 per new bit, no validation · measure: money needed to solve half the targets, lower is better · from the sweeps tagged "direction 2026-10-26: follows 0".

**Caveats:**
- Read off between the two budgets that bracket half the targets, in log budget.
- Each difficulty has its own budget range; "> x" means not reached within it.

<details><summary>Details</summary>

**Log–log slope of bounty value against budget** (where value is above 0 and below 90% of its most; a slope of 1 means value grows in proportion to money):

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | α = 0.8, β = 0.5 | α = 1, β = 1 |
| --- | --- | --- | --- | --- | --- |
| growth -1 | 0.69 | 0.91 | 1.23 | 0.89 | 0.92 |
| growth 0 | 0.88 | 1.51 | 1.94 | 1.18 | 1.49 |
| growth 2 | 0.51 | 0.76 | 1.09 | 0.68 | 0.75 |
| growth 4 | 0.35 | 0.44 | 0.56 | 0.41 | 0.43 |

</details>
