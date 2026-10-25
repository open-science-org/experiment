# Early-stage drug discovery

**Question:** For the same money, does OSO get further than traditional research in Early-stage drug discovery?

**Answer:** OSO ahead: level 6.0 against 2.2 of 6; targets 2.8 against 0.5 of 3; ROI 1.43 against 0.18.

![Early-stage drug discovery](figures/frontier.svg)

| rules | hardest level | targets solved | cost to level 6 | ROI |
| --- | --- | --- | --- | --- |
| Traditional | 2.2 of 6 | 0.5 of 3 | 1009 | 0.18 (243 for 1340) |
| OSO | 6.0 of 6 | 2.8 of 3 | 625 | 1.43 (1346 for 1022) |

**Design** (fixed before the run): compared the six rule settings, an α sweep, the parameters one by one, costly and fallible sharing · held the same: the field, 12 agents and a budget of 1350 · measure: hardest level reached, higher is better · 100 runs per setting.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out if the field works as described.
- OSO's lead as the market-set parameters vary: 0.1 to 4.1 levels.
- A preset of the idea graph generator. Each stage reuses only part of the evidence before it (composition 0.5), many hits and leads go nowhere, and the stages get much harder. The numbers are illustrative, not measured from the field.

<details><summary>Details</summary>

The full report: [report.md](report.md).

</details>
