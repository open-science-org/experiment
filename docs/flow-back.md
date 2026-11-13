# Flow-back: what it does so far

2026-11-12, after an independent review. Flow-back is OSO's α: a result's author keeps α of what it earns, and the rest flows back to the results its proof used. α 1 means nothing flows back. Setups are named by their [OSO parameters](lean-experiment.md#the-setups). **Finding** = the measure fixed in advance for that experiment; **lead** = noticed afterwards, or too few runs.

## Summary

| Question | Answer | Strength |
| --- | --- | --- |
| Does it make labs do more groundwork? | More lemmas in all 5 experiments where only flow-back paid for lemmas; no difference when publishing itself was paid | Lead: strong and repeated, but lemmas were never the measure fixed in advance |
| More targets? | No clear gain in any experiment; the ranges allow up to about one more target | Finding (targets were the measure in three experiments) |
| Lower cost? | Not shown; on the harder targets OSO cost more, with no range (5 runs) | Lead |
| Does it make labs share? | Direction as predicted when publishing earns nothing (58% at α 1, 93% at α 0.2), but not shown: difference +35 points, range −18 to +87 | The planned measure; not met |
| Why do labs do more groundwork? | Labs restate the rule and reason with it; without flow-back they call a lemma a gift to rivals | Lead (keyword count and a hand-read sample) |
| Does the size of α matter? | Not told apart: the ranges are wide | – |
| Through the prompt or through the money? | Not separated yet | – |
| Does it send money to useful labs? | Not tested (f = 0 in every run) | – |

## 1. Two routes: the prompt and the earnings

![How flow-back can change what labs do: A through the prompt, B through the earnings a lab sees](figures/flow-back-dag.svg)

| # | Arrow | Route | Evidence so far |
| --- | --- | --- | --- |
| 1 | Flow-back → the prompt states the rule | A | By design. The shared library's prompt says the opposite: "Nothing flows back" |
| 2 | Rule → lab expects groundwork to pay | A | **Seen, weakly:** OSO labs weigh what a lemma gets when others use it on 66–74% of lemma turns, much of it in the prompt's own words (section 4) |
| 3 | Expects pay → publishes more | A | **Not shown:** direction as predicted once publishing is not paid, but the range includes zero (section 2). Blocked in every other run |
| 4 | Expects pay → more lemmas | A | **Seen,** but cannot be told apart from arrow 7 |
| 5 | Flow-back → money reaches cited results | B | By design |
| 6 | → lab sees its earnings | B | By design, but only as a running total ("Your earnings so far"), not which use paid what |
| 7 | Earnings seen → more lemmas | B | **Not tested:** cannot be told apart from arrow 4 |
| 8 | → money follows earnings | B | **Not tested:** f = 0 in every run |
| 9, 10 | More money → more turns → targets | B | **Not tested** |
| 11 | Sharing → others build on it | | Simulation only |
| 12 | More lemmas → cited later | | **Seen:** +4.1 cited a run (Spend all), +5.1 (Fair-prompt check) |
| 13 | Building on others → targets, cost | | Simulation yes; AI runs: no clear gain |

With f = 0, route B is also text: the money a lab earns changes nothing but the earnings line it reads. So both routes reach the lab as words in its prompt.

**Other explanations the graph does not separate:**

| Explanation | Why it matters |
| --- | --- |
| Targets pay the prover less | At α 0.2 a prover keeps 20% of the bounty, so targets pay less against lemmas. This works through both routes |
| The shared library's prompt says "Nothing flows back" | It may push the shared library's groundwork down, so the gap would overstate flow-back |
| The OSO prompt is longer and talks about results being used | It may nudge labs toward lemmas, whatever the pay |
| Experiments differ in more than α | Labs choose (Nov 8) and its reward-off rerun (Nov 9) also differ in how flow-back is split (changed 2026-11-08), in one prompt clause and in date |

**What the evidence cannot say yet:** α 0.8 and 0.2 looking alike does not favour the prompt: we never measured how much flow-back money actually reached labs in a run. And labs not linking earnings to use says nothing either way, since they see only a total.

**The test that separates them,** revised after the review (plan in the local notes):

| | Money flows back (α 0.2) | Money does not (α 1) |
| --- | --- | --- |
| **Prompt states flow-back** | Told and paid | Told, not paid |
| **Prompt says nothing about it** | Paid, not told | Neither |

- All four setups run fresh, at the same time, with results published at once and labs that cannot stop (as in Spend all), so labs prove enough lemmas.
- Measure fixed in advance: lemmas proved per run. The prompt's effect is the difference between the rows; the earnings' effect, between the columns.
- Every setup shows itemised earnings ("+0.8: lab 3 cited your lemma X"), so labs can link money to use.
- The two silent prompts say the same thing and are true in both setups.
- "Told, not paid" gives labs a rule that is not applied; the write-up must say so. We record whether "paid, not told" labs notice their target pay is below the bounty.
- Size: at 10 runs a setup (about $24) each effect has a range of about ±4 lemmas, likely too wide; 20 runs a setup cost about $48.

## 2. What flow-back should do

| Effect | Simulation | AI runs on Lean |
| --- | --- | --- |
| Labs share | **Finding:** 24% of ideas shared at α 1, 66% at α 0.2 (12 identical agents) | **Not shown.** When publishing earns nothing: direction as predicted, range includes zero. When publishing is paid: 98–100% at every α |
| Labs do groundwork | Yes | **Lead: yes** (section 3) |
| Money goes to labs whose work is used | **Lead:** with money following earnings, best α drops to 0.2 | Not tested |

### β by α: sharing when agents choose

β is the share of ideas published as soon as they are proved. From saved results (`node scripts/beta-by-alpha.ts`); means over runs with 95% ranges, drawn as bars:

![Share of ideas published at once (β), by α, when agents choose](figures/beta-by-alpha.svg)

| α | AI labs, paid to publish | AI labs, not paid | Sim. matched, paid | Sim. matched, not paid | Sim. identical agents |
| --- | --- | --- | --- | --- | --- |
| 1 | 99% (98–100%) | **58% (7–100%)**, 6 runs, 8 lemmas | 17% (16–18%) | 16% (15–17%) | 24% (22–26%) |
| 0.8 | 99% (97–100%) | **63% (31–94%)**, 10 runs, 28 lemmas | 20% (19–21%) | 16% (15–17%) | 29% (27–32%) |
| 0.2 | 100% (99–100%) | **93% (84–100%)**, 10 runs, 30 lemmas | 93% (93–94%) | 93% (92–93%) | 66% (64–68%) |
| 0 | – | – | – | – | 100% |

| Series | What it is |
| --- | --- |
| AI labs, paid to publish | Labs choose: 4 DeepSeek labs, 10 runs per α; a new result earns up to 4 when published |
| AI labs, not paid | Labs choose, knowledge reward off: the same with nothing paid for publishing. Runs with no lemma have no share and are left out |
| Sim. matched, paid | The simulation set up like Labs choose (Lean tree, 4 agents, same reward); 100 runs per α |
| Sim. matched, not paid | The same with no reward for publishing: the prediction for "AI labs, not paid" |
| Sim. identical agents | The README's step 2: default idea graph, 12 identical agents, fixed budgets (f = 0); 100 runs per α |

- **In the simulation, β rises as α falls,** mostly below α 0.8.
- **AI labs paid to publish did not follow it:** 98–100% at every α, where the simulation with the same pay predicted 17% at α 1.
- **AI labs not paid point the same way, but it is not shown.** The planned measure, α 0.2 minus α 1: +35 points (−18 to +87) over runs. Pooling all lemmas instead (5 of 8, 22 of 28, 27 of 30) gives +28 points (−1 to +60), with α 0.8 at 79%, lifted by one run that published 7 of 7. The plan counted it for flow-back only if α 0.2 was clearly higher; it is not.
- **Turning the reward off cut lemma work sharply:** lemma attempts fell from 366 to 17 at α 1 and from 401 to 45 at α 0.2. Labs went for targets instead, which is why the α 1 share rests on 8 lemmas.
- Only α 1, 0.8, 0.2 (and 0) were run, so the lines between points are not data.

## 3. Groundwork: lemmas proved per run

| Experiment (runs a setup) | Traditional | Shared library, or α 1 when labs choose | OSO α 0.8 | OSO α 0.2 | α 0.2 minus the shared library or α 1 (95% range) |
| --- | --- | --- | --- | --- | --- |
| Spend all (20) | 7.2 | 7.2 | 10.7 | 13.8 | +6.6 (+2.8 to +10.4); cited later +4.1 (+1.6 to +6.5) |
| Fair-prompt check (10) | – | 8.5 | – | 17.2 | +8.7 (+3.4 to +14.0) |
| May quit (10) | 1.0 | 0.3 | 3.7 | 2.5 | +2.2 (+1.4 to +3.0) |
| Labs choose, publishing paid (10) | – | 19.6 | 19.6 | 20.4 | +0.8 (−6.2 to +7.8) |
| Labs choose, nothing paid (10) | – | 0.7 | 2.7 | 3.0 | +2.3 (+0.8 to +3.8); cited later +1.1 (+0.2 to +2.0) |
| Harder targets (5) | 20.0 | 21.8 | – | 26.4 | +4.6 (+0.2 to +9.0) |
| Harder targets, pay per lemma (α 1, m 1) | | | | 63.0 | +41.2 (+5.5 to +76.9) against shared |

- In all 5 experiments where only flow-back paid for lemmas, α 0.2 proved more; the ranges sit above zero. No difference in Labs choose with publishing paid.
- With flow-back, labs also built on each other more: Spend all 2.2 → 5.8 a run, Fair-prompt check 3.1 → 7.0.
- A certain payment per lemma did far more than flow-back.

## 4. What the labs say

Share of turns where the lab's thinking weighs what a result gets when another lab uses it (`python3 scripts/lean-flowback.py`; 148 runs saved thinking). It is a keyword count. Much of what it catches is labs restating their prompt's rule, and it does not tell "earns when used" from "earns nothing".

| Experiment (runs with thinking) | Setup | Lemma turns | Target turns |
| --- | --- | --- | --- |
| Fair-prompt check (runs 6–10 only) | OSO α 0.2 | 69% of 160 | 39% of 214 |
| | Shared library | 33% of 107 | 19% of 225 |
| May quit (10) | OSO α 0.8 | 72% of 58 | 39% of 244 |
| | OSO α 0.2 | 74% of 46 | 47% of 195 |
| | Shared library / traditional | 0% of 6 / 0% of 13 | 12% / 3% |
| Labs choose, publishing paid (10) | α 1 / 0.8 / 0.2 | 28% / 60% / 66% | 13% / 26% / 31% |
| Labs choose, nothing paid (10) | α 1 / 0.8 / 0.2 | 47% of 17 / 68% of 40 / 67% of 45 | 3% / 13% / 15% |
| Harder targets (5) | OSO α 0.2 | 66% of 253 | 32% of 301 |
| | Shared library | 31% of 230 | 13% of 406 |
| | Pay per lemma / traditional | 13% / 11% | 7% / 2% |

Which way they reason, from 20 matching sentences per setup (harder targets and Fair-prompt check), read by hand, not blind:

| Setup | "Earns when others use it" | "Earns nothing, or helps a rival" | Unclear |
| --- | --- | --- | --- |
| OSO α 0.2 | 18 | 1 | 1 |
| Shared library | 0 | 16 | 4 |

| Setup | Typical sentence |
| --- | --- |
| OSO α 0.2 | "If another lab proves A5 citing our lemma, A5 value flows 80% to used results, ours gets share." |
| Shared library | "If we prove `msort_sorted`, other labs may use it to solve B5/H5 and earn bounty, not us." |

- Labs use the rule they are given when they reason. That shows they read it, not that it changes their choices.
- About a third of OSO target turns also weigh flow-back, then go for the target anyway.

## 5. The size of α

The prompts for α 0.8 and α 0.2 differ only in the number.

| Measure | OSO α 0.8 | OSO α 0.2 | α 0.2 minus α 0.8 |
| --- | --- | --- | --- |
| Lemmas a run: Spend all | 10.7 | 13.8 | +3.1 (−0.6 to +6.8) |
| Same: May quit | 3.7 | 2.5 | −1.2 (−2.9 to +0.5) |
| Same: Labs choose, paid | 19.6 | 20.4 | – |
| Share published: Labs choose, not paid | 63% | 93% | wide ranges (section 2) |
| Lemma turns weighing flow-back: May quit | 72% | 74% | – |

Not told apart: every difference has a range that includes zero, and the money that actually flowed back in each run was not measured.

## 6. What it has not done

| Measure | OSO α 0.2 against shared library | Strength |
| --- | --- | --- |
| Targets, Spend all | +0.4 (−0.1 to +0.9) | Finding |
| Targets, May quit | +0.0 (−0.8 to +0.8) | Finding |
| Targets, Fair-prompt check | +0.5 (−0.4 to +1.4) | Finding |
| Money to 7 of 11 targets, harder targets (median) | $0.727 against $0.509 (no range, 5 runs) | Lead |
| Earlier leads (cheapest to 5 targets; B5 11 of 20 vs 0 of 20) | Did not hold in later runs | – |

About half of all lemmas are never cited, so extra groundwork helps only where a target lacks it.

## 7. Tests still to run

| Test | What it would show | Cost |
| --- | --- | --- |
| Prompt × earnings, 2 × 2 (section 1) | Route A against route B | about $48 at 20 runs a setup |
| Money follows earnings (f > 0) | Whether money moves to labs whose work is used: route B as the simulation means it | to plan |
| More runs of Labs choose, nothing paid, at α 1 | Enough lemmas to measure sharing at high α | to plan |

## Method

- Lemma counts and ranges: `python3 scripts/lean-estimates.py <experiment> <setups> <base>`; per experiment: [results](ai-agent-results.md).
- Share published at once: per run, then the mean over runs (`results/community/<experiment>/summary.md`); `node scripts/lean-summary.ts <experiment>` rewrites a summary from its saved runs.
- Thinking: `python3 scripts/lean-flowback.py` (`--sample N` prints matching sentences). The hand-read sample was drawn from its matches, so it was filtered by the keyword count first.
- Thinking was saved only from the Fair-prompt check on (its runs 6–10), so Spend all has none.
