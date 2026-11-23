# Societies compared: targets proved for the money (lean-big-1)

**Question:** For the same agents, checker and money, does a community prove more targets when value flows back (OSO) than when results are only shared, or kept private until a target is proved?

**Answer:** Lemmas published at once: Labs choose, reward off, α 1 92% (95% range 85% to 98%); Labs choose, reward off, α 0.2 96% (95% range 93% to 99%). α 0.2 minus α 1: 4% (95% range -3% to 12%).

![Societies compared: targets proved for the money (lean-big-1)](figures/progress.svg)

| society | OSO parameters | targets proved | money to 2 targets | spent | lemmas proved | built on another lab | lemmas proved twice | targets proved twice |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | public when a target is proved · α 1 · m 0 · m_bit 0 · f 0 | 20.00 ± 1.22 of 27 | $0.01 (5 of 5 got there) | $1.61 | 14.60 | 6.40 | 1.20 | 11.00 |
| Labs choose, reward off, α 1 | labs choose when to publish · α 1 · m 0 · m_bit 0 · f 0 | 20.60 ± 0.89 of 27 | $0.01 (5 of 5 got there) | $1.61 | 14.00 | 11.40 | 0.20 | 12.60 |
| Labs choose, reward off, α 0.2 | labs choose when to publish · α 0.2 · m 0 · m_bit 0 · f 0 | 21.20 ± 0.45 of 27 | $0.01 (5 of 5 got there) | $1.61 | 23.00 | 16.00 | 0.20 | 19.20 |

**Design** (fixed before the run): compared Traditional, Labs choose, reward off, α 1, Labs choose, reward off, α 0.2 · held the same: the same 4 agents (the single agent: the first, with all the money), $1.60 in all, Lean checks every proof · measure: the share of lemmas published at once (of those with a PUBLISH line), α 0.2 against α 1; targets proved beside it, higher is better · 5 runs per setup, not paired. Cost: $24.18 as charged.

**Caveats:**
- Labs could not stop early: each worked until its money or the rounds ran out, so setups are compared at the same money spent.
- Rewards differ from the current simulation model: the knowledge reward is off (the simulation pays 1 per new bit since v5): Lean has no agreed measure of a result's new knowledge yet, see docs/design.md; value flowing back is split by the lines each parent saves (its own proof's length in symbols), a stand-in for the work it saves (1/p) in the simulation.
- Table values are mean ± standard deviation over runs. Above: means with 95% ranges (Student t), and differences between setups with their 95% ranges; runs are not paired.

<details><summary>Details</summary>



![Verified targets for the money](figures/progress.svg)

- **Societies:** single agent (one lab, everyone's money); independent labs (nothing shared, a target counts when any lab proves it); shared library (everything public at once, no value flows back); planner (lab 1 assigns work to the others each round, results shared, nothing flows back); traditional (private until a target is proved); OSO (public at once, value flows back to what a result used; α is the share an author keeps).
- **Agents:** `deepseek/deepseek-v4.1-flash`, `deepseek/deepseek-v4.1-flash`, `deepseek/deepseek-v4.1-flash`, `deepseek/deepseek-v4.1-flash`; up to 60 rounds; up to 2 repairs on Lean's errors per action.

Transcripts are not in this repository.

</details>
