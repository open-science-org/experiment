# Early-stage drug discovery

**Question:** For the same money, does OSO get further than traditional research in Early-stage drug discovery?

**Answer:** OSO ahead: level 6.0 against 2.7 of 6; targets 2.8 against 0.7 of 3; ROI 1.77 against 0.28.

![Early-stage drug discovery](figures/frontier.svg)

| rules | hardest level | targets solved | cost to level 5 | ROI |
| --- | --- | --- | --- | --- |
| Traditional | 2.7 of 6 | 0.7 of 3 | 847 | 0.28 (335 for 1228) |
| OSO | 6.0 of 6 | 2.8 of 3 | 223 | 1.77 (1351 for 850) |

**Design** (fixed before the run): compared the six rule settings, an α sweep, the parameters one by one, costly and fallible sharing · held the same: the field, 12 agents and a budget of 1240 · measure: hardest level reached, higher is better · 100 runs per setting.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out if the field works as described.
- OSO's lead as the market-set parameters vary: 0.3 to 4.4 levels.
- Stage difficulties and bounties are illustrative, not industry figures.

<details><summary>Details</summary>

The full report: [report.md](report.md).

</details>
