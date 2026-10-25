# Example: narrow stages (drug discovery story)

**Question:** For the same money, does OSO get further than traditional research in Example: narrow stages (drug discovery story)?

**Answer:** OSO ahead: level 6.0 against 0.7 of 6; targets 2.9 against 0.2 of 3; ROI 1.55 against 0.07.

![Example: narrow stages (drug discovery story)](figures/frontier.svg)

| rules | hardest level | targets solved | cost to level 6 | ROI |
| --- | --- | --- | --- | --- |
| Traditional | 0.7 of 6 | 0.2 of 3 | 971 | 0.07 (92 for 1412) |
| OSO | 6.0 of 6 | 2.9 of 3 | 530 | 1.55 (1390 for 989) |

**Design** (fixed before the run): compared the six rule settings, an α sweep, the parameters one by one, costly and fallible sharing · held the same: the field, 12 agents and a budget of 1420 · measure: hardest level reached, higher is better · 100 runs per setting.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out if the field works as described.
- OSO's lead as the market-set parameters vary: 2.4 to 5.3 levels.
- A preset of the idea graph generator. Each stage reuses only part of the evidence before it (composition 0.5), many hits and leads go nowhere, and the stages get much harder. The numbers are illustrative, not measured from the field.

<details><summary>Details</summary>

The full report: [report.md](report.md).

</details>
