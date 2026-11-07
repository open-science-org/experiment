# Societies compared: verified targets for the money (lean-main-b)

**Question:** For the same agents, checker and money, does OSO reach the same verified targets for less than other ways of organizing the agents?

**Answer:** OSO, α 0.8 reached 3 verified targets for $0.05 on average, $0.01 more than Shared library over 20 paired runs (Shared library cheaper; ±$0.01). OSO, α 0.2 reached 3 verified targets for $0.05 on average, $0.01 more than Shared library over 20 paired runs (no clear difference; ±$0.01).

![Societies compared: verified targets for the money (lean-main-b)](figures/progress.svg)

| society | settings | money to 3 targets | got there | targets at full budget | spent | work done twice |
| --- | --- | --- | --- | --- | --- | --- |
| Shared library | shared at once · α 1 | $0.04 ± 0.02 | 20 of 20 | 5.85 of 8 | $0.61 | 3.70 |
| OSO, α 0.8 | shared at once · α 0.8 | $0.05 ± 0.02 | 20 of 20 | 5.80 of 8 | $0.60 | 3.15 |
| OSO, α 0.2 | shared at once · α 0.2 | $0.05 ± 0.03 | 20 of 20 | 6.25 of 8 | $0.61 | 3.05 |
| Traditional | shared when a target is proved · α 1 | $0.05 ± 0.02 | 20 of 20 | 5.80 of 8 | $0.61 | 2.95 |

**Design** (fixed before the run): compared Shared library, OSO, α 0.8, OSO, α 0.2, Traditional · held the same: the same 4 agents (the single agent: the first, with all the money), $0.60 in all, Lean checks every proof · measure: money spent to verify 3 of the counted targets (C3, A3, C4, X1, B3, B5, X2, A5); a run that never does counts as its whole budget, lower is better · 20 runs per society, paired. Cost: $48.68 as charged.

**Caveats:**
- Labs could not stop early: each worked until its money or the rounds ran out, so setups are compared at the same money spent.
- Rewards differ from the current simulation model: the knowledge reward is off (the simulation pays 1 per new bit since v5): Lean has no agreed measure of a result's new knowledge yet, see docs/design.md; value flowing back is still split by the money spent proving each parent, not by the work a parent saves (1/p) as in the simulation.
- Values are mean ± standard deviation over runs; the verdict compares runs in pairs (run k of each society), with ± two standard errors of the difference.

<details><summary>Details</summary>

Main Lean experiment, part B (pre-registered in notes/lean-main-experiment.md, 2026-11-07): does flow-back add anything beyond sharing, at the same money spent? Shared library, OSO α 0.8 and OSO α 0.2, 20 runs each; labs cannot stop early. Traditional (20 runs) added on 2026-11-08, after the other three had run, as the reference point.

![Verified targets for the money](figures/progress.svg)

- **Societies:** single agent (one lab, everyone's money); independent labs (nothing shared, a target counts when any lab proves it); shared library (everything public at once, no value flows back); planner (lab 1 assigns work to the others each round, results shared, nothing flows back); traditional (private until a target is proved); OSO (public at once, value flows back to what a result used; α is the share an author keeps).
- **Agents:** `deepseek/deepseek-v4.1-flash`, `deepseek/deepseek-v4.1-flash`, `deepseek/deepseek-v4.1-flash`, `deepseek/deepseek-v4.1-flash`; up to 60 rounds; up to 2 repairs on Lean's errors per action.

Transcripts, with every proof, are private.

</details>
