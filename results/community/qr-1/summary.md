# Societies compared: targets proved for the money (qr-1)

**Question:** For the same agents, checker and money, does a community prove more targets when value flows back (OSO) than when results are only shared, or kept private until a target is proved?

**Answer:** One run each, no verdict yet. OSO, α 0.2 proved 0.00 targets of 1 a run; Shared library 0.00. Difference: 0.00.

![Societies compared: targets proved for the money (qr-1)](figures/progress.svg)

| society | OSO parameters | targets proved | money to 2 targets | spent | lemmas proved | built on another lab | lemmas proved twice | targets proved twice |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | public when a target is proved · α 1 · m 0 · m_bit 0 · f 0 | 0.00 ± 0.00 of 1 | $8.00 (0 of 1 got there) | $1.16 | 351.00 | 0.00 | 52.00 | 0.00 |
| Shared library | public at once · α 1 · m 0 · m_bit 0 · f 0 | 0.00 ± 0.00 of 1 | $8.00 (0 of 1 got there) | $1.24 | 306.00 | 277.00 | 32.00 | 0.00 |
| OSO, α 0.2 | public at once · α 0.2 · m 0 · m_bit 0 · f 0 | 0.00 ± 0.00 of 1 | $8.00 (0 of 1 got there) | $1.02 | 313.00 | 265.00 | 43.00 | 0.00 |

**Design** (fixed before the run): compared Traditional, Shared library, OSO, α 0.2 · held the same: the same 4 agents (the single agent: the first, with all the money), $8.00 in all, Lean checks every proof · measure: targets proved by the end of a run, of 1; money to reach 2 targets is shown beside it, higher is better · 1 run per setup, not paired. Cost: $3.43 as charged.

**Caveats:**
- Labs could not stop early: each worked until its money or the rounds ran out, so setups are compared at the same money spent.
- Rewards differ from the current simulation model: the knowledge reward is off (the simulation pays 1 per new bit since v5): Lean has no agreed measure of a result's new knowledge yet, see docs/design.md; value flowing back is split by the lines each parent saves (its own proof's length in symbols), a stand-in for the work it saves (1/p) in the simulation.
- Table values are mean ± standard deviation over runs. Above: means with 95% ranges (Student t), and differences between setups with their 95% ranges; runs are not paired.

<details><summary>Details</summary>

Scaling with problem difficulty, step 2: quadratic reciprocity from scratch (QR set, 206 hidden steps, depth 17) under traditional, shared library and OSO α 0.2, one run each, 4 DeepSeek V4.1 Flash labs at $2 each, 100 rounds, labs cannot stop. Prompt fix on for all (one small lemma a turn, last 20 failed tries shown; replay test 4o). Main measure: hidden steps reached once each run has spent $2 (scripts/deep-steps.ts); also deepest level reached.

![Verified targets for the money](figures/progress.svg)

- **Societies:** single agent (one lab, everyone's money); independent labs (nothing shared, a target counts when any lab proves it); shared library (everything public at once, no value flows back); planner (lab 1 assigns work to the others each round, results shared, nothing flows back); traditional (private until a target is proved); OSO (public at once, value flows back to what a result used; α is the share an author keeps).
- **Agents:** `deepseek/deepseek-v4.1-flash`, `deepseek/deepseek-v4.1-flash`, `deepseek/deepseek-v4.1-flash`, `deepseek/deepseek-v4.1-flash`; up to 100 rounds; up to 2 repairs on Lean's errors per action.

Transcripts are not in this repository.

</details>
