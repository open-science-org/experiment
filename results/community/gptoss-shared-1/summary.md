# Societies compared: verified targets for the money (gptoss-shared-1)

**Question:** For the same agents, checker and money, does OSO reach the same verified targets for less than other ways of organizing the agents?

**Answer:** No run reached 2 verified targets.

![Societies compared: verified targets for the money (gptoss-shared-1)](figures/progress.svg)

| society | settings | money to 2 targets | got there | targets at full budget | spent | work done twice |
| --- | --- | --- | --- | --- | --- | --- |
| Shared library | shared at once · α 1 | $0.60 ± 0.00 | 0 of 1 | 0.00 of 8 | $0.00 | 0.00 |

**Design** (fixed before the run): compared Shared library · held the same: the same 4 agents (the single agent: the first, with all the money), $0.60 in all, Lean checks every proof · measure: money spent to verify 2 of the counted targets (C3, A3, C4, X1, B3, B5, X2, A5); a run that never does counts as its whole budget, lower is better · 1 run per society, paired. Cost: $0.00 as charged.

**Caveats:**
- Labs could stop early by passing, so setups are compared at the same money offered; money spent is shown beside each.
- Rewards differ from the current simulation model: the knowledge reward is off (the simulation pays 1 per new bit since v5): Lean has no agreed measure of a result's new knowledge yet, see docs/design.md; value flowing back is still split by the money spent proving each parent, not by the work a parent saves (1/p) as in the simulation.
- Values are mean ± standard deviation over runs; the verdict compares runs in pairs (run k of each society), with ± two standard errors of the difference.

<details><summary>Details</summary>

Check: does GPT-OSS-120B work as a lab? One shared-library run with 4 GPT-OSS-120B labs, as in the pilot.

![Verified targets for the money](figures/progress.svg)

- **Societies:** single agent (one lab, everyone's money); independent labs (nothing shared, a target counts when any lab proves it); shared library (everything public at once, no value flows back); planner (lab 1 assigns work to the others each round, results shared, nothing flows back); traditional (private until a target is proved); OSO (public at once, value flows back to what a result used; α is the share an author keeps).
- **Agents:** `openai/gpt-oss-120b`, `openai/gpt-oss-120b`, `openai/gpt-oss-120b`, `openai/gpt-oss-120b`; up to 30 rounds; up to 2 repairs on Lean's errors per action.

Transcripts, with every proof, are private.

</details>
