# Scaling across direction of difficulty, follows level mostly (0.8)

**Meta-analysis:** runs nothing itself; it combines the results of 4 experiments: [Direction of difficulty: easier by 1 bit per level; follows level mostly (0.8)](../simple-ideas-6x8-p2-len3gm1-comp0-7-tie0-8-direction-scaling-20261026/summary.md), [Direction of difficulty: every level equally hard; follows level mostly (0.8)](../simple-ideas-6x8-p2-len3g0-comp0-7-tie0-8-direction-scaling-20261026/summary.md), [Direction of difficulty: harder by 2 bits per level; follows level mostly (0.8)](../simple-ideas-6x8-p2-len3g2-comp0-7-tie0-8-direction-scaling-20261026/summary.md), [Direction of difficulty: harder by 4 bits per level; follows level mostly (0.8)](../simple-ideas-6x8-p2-len3g4-comp0-7-tie0-8-direction-scaling-20261026/summary.md).

**Question:** Across direction of difficulty, follows level mostly (0.8), how much money does each society need, and does the gap between traditional and OSO grow?

**Answer:** To solve half the targets, traditional needs 1.2× to 6.3× the money OSO needs. By difficulty: growth -1 1.2×, growth 0 2.0×, growth 2 6.3×, growth 4 5.6×.

![Scaling across direction of difficulty, follows level mostly (0.8)](figures/compare.svg)

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | α = 0.8, β = 0.5 | α = 1, β = 1 | traditional ÷ OSO |
| --- | --- | --- | --- | --- | --- | --- |
| growth -1 | 31 | 26 | 44 | 29 | 24 | 1.2× |
| growth 0 | 108 | 54 | 65 | 74 | 49 | 2.0× |
| growth 2 | 1,935 | 307 | 299 | 485 | 300 | 6.3× |
| growth 4 | 11,214 | 1,996 | 1,943 | 2,906 | 1,953 | 5.6× |

**Design** (fixed before the run): compared 5 societies on 4 difficulties (growth -1, growth 0, growth 2, growth 4) · held the same: the simple model: 12 identical agents, equal money each round, a knowledge reward of 1 per new bit, no validation · measure: money needed to solve half the targets, lower is better · from the sweeps tagged "direction 2026-10-26: follows 0.8".

**Caveats:**
- Read off between the two budgets that bracket half the targets, in log budget.
- Each difficulty has its own budget range; "> x" means not reached within it.

<details><summary>Details</summary>

**Log–log slope of bounty value against budget** (where value is above 0 and below 90% of its most; a slope of 1 means value grows in proportion to money):

| difficulty | Traditional (α = 1, β = 0) | OSO (α = 0.8, β = 1) | OSO (α = 0.2, β = 1) | α = 0.8, β = 0.5 | α = 1, β = 1 |
| --- | --- | --- | --- | --- | --- |
| growth -1 | 0.67 | 0.93 | 0.82 | 0.87 | 0.91 |
| growth 0 | 0.84 | 1.42 | 1.75 | 1.16 | 1.42 |
| growth 2 | 0.42 | 0.73 | 1.38 | 0.67 | 0.88 |
| growth 4 | 0.30 | 0.48 | 0.88 | 0.47 | 0.50 |

</details>
