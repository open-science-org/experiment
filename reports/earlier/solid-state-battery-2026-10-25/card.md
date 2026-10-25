# Example: small and tightly linked (battery story)

**Question:** For the same money, does OSO get further than traditional research in Example: small and tightly linked (battery story)?

**Answer:** OSO ahead: level 5.0 against 1.6 of 5; targets 1.9 against 0.4 of 2; ROI 5.36 against 0.74.

![Example: small and tightly linked (battery story)](figures/frontier.svg)

| rules | hardest level | targets solved | cost to level 5 | ROI |
| --- | --- | --- | --- | --- |
| Traditional | 1.6 of 5 | 0.4 of 2 | 188 | 0.74 (172 for 251) |
| OSO | 5.0 of 5 | 1.9 of 2 | 120 | 5.36 (772 for 165) |

**Design** (fixed before the run): compared the six rule settings, an α sweep, the parameters one by one, costly and fallible sharing · held the same: the field, 12 agents and a budget of 260 · measure: hardest level reached, higher is better · 100 runs per setting.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out if the field works as described.
- OSO's lead as the market-set parameters vary: 0.4 to 3.2 levels.
- A preset of the idea graph generator. A small field where ideas lean heavily on what came before (composition 0.8) and each one needs several earlier results (2.5 parents). The numbers are illustrative, not measured from the field.

<details><summary>Details</summary>

The full report: [report.md](report.md).

</details>
