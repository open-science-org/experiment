# AI agents on the Lean problems: results so far

Last updated: 2026-11-07. Every result here has its own page under `results/` (the links), with its design, caveats and logs. This page only gathers them.

**In short:** with help (lemmas), weak models prove targets they cannot prove alone. In five paired races with one cheap model, OSO reached 2 hard targets in every run and for about half the money; traditional reached them in 3 of 5. In the main experiment (part B, 20 runs per setup), OSO did **not** prove clearly more targets than a plain shared library. Looked for afterwards: with more value flowing back, labs proved more lemmas and built on each other more, and OSO α 0.2 proved a hard target (B5) in 11 of 20 runs, the shared library in none. That is a lead, not a finding: it was not the measure fixed in advance, and the setups' prompts differed by more than the rules. The test setup itself checks out.

## 1. Do lemmas help a model? (single model, no community)

[Model panel, 2026-10-19](../results/pilot/panel-2026-10-19/summary.md): each model tried each of 16 targets alone, and again with the lemmas the target needs.

| Model | Proved with lemmas | Proved alone |
| --- | --- | --- |
| Claude Opus 5.5 | 16 of 16 | 16 of 16 |
| Claude Sonnet 5.5 | 16 of 16 | 16 of 16 |
| GPT-5.6 Terra | 16 of 16 | 11 of 16 |
| Gemini 3.8 Flash | 14 of 16 | 11 of 16 |
| DeepSeek V4.1 Flash | 12 of 16 | 4 of 16 |

**What it means:** the strong models need no help on these problems, so they cannot show what sharing is worth. DeepSeek V4.1 Flash gains the most from lemmas and is cheap, so the races use it.

## 2. OSO against traditional (4 DeepSeek labs)

| Test | Runs | Result | Status |
| --- | --- | --- | --- |
| [First race](../results/community/community-2026-10-20b/summary.md), 2026-10-20 (mixed models, $0.40 a lab) | 1 per side | both proved 4 of 8 targets | no verdict: one run |
| [Cheap-model race](../results/community/race-cheap/summary.md), 2026-10-24 ($0.15 a lab) | 5 paired | see below | **the main result so far** |
| [Speed race](../results/community/race-speed/summary.md), 2026-10-24 | 5 paired | no difference | **not valid:** the key ran out of money; 950 calls refused |

**The cheap-model race.** Hard targets ("counted": A3, X2, B5, A5) are those DeepSeek never proved alone.

| | Traditional | OSO |
| --- | --- | --- |
| Counted targets proved (of 4) | 1.6 | 2.0 |
| Runs that reached 2 counted targets | 3 of 5 | **5 of 5** |
| Money to reach 2, when reached | $0.24 | **$0.13** |
| Lemmas and conjectures proved twice | 20.0 | 0 |
| Targets proved twice (two labs in the same round) | 0.4 | 2.4 |
| Used another lab's result | 0 | 6.4 |

Money to reach 2 counted targets, run by run (OSO / traditional): $0.25 / never, $0.11 / never, $0.07 / $0.18, $0.13 / $0.26, $0.11 / $0.28. OSO was cheaper in every run. The spend measure was chosen after the run (exploratory); budgets were at list prices, and OpenRouter charged about 5.6× more on both sides.

**What it means:** OSO's lead comes from what the simulation predicts: sharing at once stops labs proving the same groundwork again (20 repeats a run against none), and labs build on each other's results. But OSO here was also sharing, so this race cannot say how much is due to flow-back.

## 3. Seven setups (pilot, 2026-11-07)

[pilot-societies-1](../results/community/pilot-societies-1/summary.md): 4 DeepSeek labs, $0.15 a lab, 2 runs per setup, $4.58 in all. It separates sharing from flow-back: a shared library (sharing without flow-back) against OSO.

| Setup | Settings | Money to 2 targets | Targets proved (of 8) |
| --- | --- | --- | --- |
| Single agent | one lab, all the money | $0.04 | 4.0 |
| Independent labs | never shared | $0.03 | 3.0 |
| Shared library | shared at once, no flow-back | $0.05 | 5.0 |
| Planner | shared at once, lab 1 assigns the work | $0.12 | 3.5 |
| Traditional | shared when a target is proved | $0.07 | 3.5 |
| OSO, α 0.8 | shared at once, 20% flows back | $0.03 | 4.5 |
| OSO, α 0.2 | shared at once, 80% flows back | $0.02 | **6.0** |

**What it means:**
- **The measure was too easy.** Every setup reached 2 targets for a few cents, so the comparison says nothing yet. The main experiment needs a harder measure (3 or more targets, or only the hard ones).
- **A lead to test, not a result:** OSO α 0.2 proved the most targets (6 of 8 in both runs), the shared library 5.
- **Runs vary a lot** (the planner took $0.22 to reach 2 targets in one run, $0.02 in the other), so the main experiment needs many runs per setup.
- **Old rewards:** these runs paid a flat mint per result. New runs have the knowledge reward off ([why](design.md#the-knowledge-reward-in-lean)).
- One OSO α 0.2 run was spoiled when the laptop slept; it was rerun.

**The planner setup works:** in a [trial](../results/community/planner-trial-2/summary.md), DeepSeek labs followed their assignment 10 times out of 12. GPT-OSS-120B labs gave up at once, so it is not used as a lab model.

**Choosing the lab model.** A lab model must keep working and gain from lemmas. DeepSeek V4.1 Flash is the cheapest tested model that does both. GPT-OSS-120B is cheaper but gave up as a lab. It has not been tried in the lemma panel or a plain race, so it may have failed only in the planner trial's setup. The strong Claude models prove every target alone, so they cannot show what sharing is worth.

## 4. The main experiment, part B (2026-11-07)

**Question, fixed in advance** (the design is in the local notes, `notes/lean-main-experiment.md`): at the same money **spent**, does a community prove more when value flows back (OSO) than when results are only shared (a shared library)? 4 DeepSeek V4.1 Flash labs, $0.15 each; labs could not stop early, so every run spent its money (about $0.61); 20 runs per setup; knowledge reward off; bounties 4 · 2^(depth − 1). Results: [lean-main-b](../results/community/lean-main-b/summary.md). Traditional (20 runs) was added afterwards as a reference point; its runs came after the others'. Full design: [the Lean experiment](lean-experiment.md).

**A known flaw:** the setups' prompts differed by more than the rules. The shared library's had an extra line, "Other results earn nothing by themselves", and the OSO prompts explained flow-back at length. Some of any difference between setups could come from the wording. New runs use one template, where only the rule lines differ.

### The answer: no clear difference

Targets proved by the end, of 8 (the measure fixed in advance):

| Setup | Mean | Spread | Against the shared library |
| --- | --- | --- | --- |
| Traditional | 5.80 | 4–7 | (reference) |
| Shared library (α 1) | 5.85 | 4–7 | |
| OSO, α 0.8 | 5.80 | 4–8 | −0.05 (not clear) |
| OSO, α 0.2 | 6.25 | 5–8 | +0.40 (not clear: 1.6 standard errors; clear needs 2) |

By the rule fixed in advance, neither OSO setting is clearly ahead of the shared library. Against traditional (secondary): OSO α 0.2 +0.45 (1.6 standard errors, not clear), OSO α 0.8 0.00, shared library +0.05. Sharing alone did not raise the number of targets: the shared library proved no more than traditional. Runs varied less than in the pilot (about ±0.8 targets against ±1.4), so the test was sharper than planned.

### What changed: which targets, and how labs worked (exploratory)

Looked for after seeing the results, so these are leads, not findings.

**Which targets** (runs out of 20 that proved each):

| Setup | B5, merge sort = insertion sort (depth 5, bounty 64, 5 lemmas in our proof) | X1, Cassini's identity (depth 3, bounty 16, 2 lemmas) | The other six |
| --- | --- | --- | --- |
| Traditional | 3 | 14 | about the same in every setup: C3, A3, C4, B3, X2 nearly always; A5 almost never |
| Shared library | **0** | 17 | |
| OSO, α 0.8 | **5** | 10 | |
| OSO, α 0.2 | **11** | 13 | |

**How labs worked** (per run):

| Setup | Lemmas proved | Results built on another lab's work | Lemmas proved twice | Targets proved twice |
| --- | --- | --- | --- | --- |
| Traditional | 7.2 | 0.6 | 0.4 | 2.6 |
| Shared library | 7.2 | 2.6 | 0.2 | 3.6 |
| OSO, α 0.8 | 10.7 | 4.3 | 0.2 | 3.0 |
| OSO, α 0.2 | 13.8 | 6.6 | 0.2 | 2.9 |

A target is proved twice when two labs prove it in the same round. (An earlier version of this table counted both kinds together as "lemmas proved twice".)

**What it suggests:**
- **Sharing changes how labs work:** labs built on each other's results 2.6 times a run in the shared library, against 0.6 under traditional.
- **Flow-back goes with more groundwork:** traditional and the shared library proved the same number of lemmas (7.2 a run); OSO proved more, and more the lower the α (10.7 at α 0.8, 13.8 at α 0.2). Labs also built on each other more.
- **And with B5:** the hard target that needs the most lemmas was proved more often the more value flowed back (0, 5 and 11 runs of 20).
- **The total barely moves,** because the measure fixed in advance counts every target the same.
- These go together; they do not show that flow-back caused them. The prompts differed by more than the rules (above), and these patterns were looked for after the results.

**How to confirm it:** with the prompts fixed, a run fixed in advance on B5 alone: is B5 proved, OSO α 0.2 against the shared library, about 40 runs each.

**Also:** "money to reach 3 targets" was too easy; every run got there for $0.04–0.05.

## 4a. B5 check, fair prompts (2026-11-07 to 08)

[Result](../results/community/lean-b5/summary.md). Plan fixed before the runs (roadmap M1): part B's B5 lead, tested again with one prompt template, so that the setups' prompts differ only in their rules. Shared library against OSO α 0.2, labs cannot stop, 10 runs per setup, 20 in all, $16.10. **Labs had $0.20 each here, against $0.15 in part B**, so two things changed at once: the prompts and the money.

| Setup | B5 proved | Targets proved (of 8) | Lemmas proved | Built on another lab | Rounds a lab worked |
| --- | --- | --- | --- | --- | --- |
| Shared library | 3 of 10 (0.11–0.60) | 6.1 (5.6–6.6) | 8.5 (4.6–12.4) | 3.4 (1.6–5.2) | 16.9 (16.0–17.7) |
| OSO, α 0.2 | 4 of 10 (0.17–0.69) | 6.6 (5.9–7.3) | 17.2 (13.6–20.8) | 8.4 (6.0–10.8) | 19.6 (18.0–21.1) |
| OSO minus shared | +0.10 (−0.28 to +0.45) | +0.5 (−0.4 to +1.4) | +8.7 (+3.4 to +14.0) | +5.0 (+2.0 to +8.0) | +2.7 (+0.9 to +4.4) |

**B5:** much closer than in part B (11 of 20 against 0 of 20, a gap of 0.55). The range here (−0.28 to +0.45) leaves room for a gap of up to about 0.45, so the B5 question is still open, and we cannot say whether the fair prompts or the extra money closed the gap. We did not add the 10 extra runs the plan allowed: part A and M3 were already using the provider, and the lemma result was what bore on M3.

**Lemmas and building on others:** with flow-back, labs proved about twice as many lemmas and built on another lab's result more often. This is the same direction as in part B. Targets: +0.5, with a range from slightly fewer to about one more. Lead, not a finding: OSO α 0.2 proved A5 in 3 of 10 runs, the shared library in 0.

**What labs thought** (runs 6–10, `scripts/lean-thinking.py`, a rough keyword count checked by hand on 10 matches per setup): on lemma turns, 64% of OSO labs' thinking mentions being paid through flow-back, against 20% in the shared library, where it mostly notes that nothing flows back. So labs notice the rule, often quoting it. Whether it drives their choice is not shown: in about half the OSO samples the lab mentions flow-back and then goes for a target.

## 4b. Part A: labs may stop early (2026-11-08)

[Result](../results/community/lean-part-a/summary.md). Plan fixed before the runs (roadmap M2). Same setups and money as part B ($0.15 a lab, prompts from the one template), but a lab that passes stops for good. 10 runs per setup, 40 in all, $11.90. Main comparison: OSO α 0.2 against the shared library.

**The question:** does flow-back keep labs working, and get further with the same money offered?

| Setup | Targets proved (of 8) | Targets per dollar | Money spent, of $0.60 | Rounds a lab worked | Labs that never passed | Lemmas proved | Built on another lab |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 5.0 (4.4–5.6) | 19.0 (15.8–22.3) | $0.27 (0.23–0.31) | 5.5 (4.8–6.2) | 2 of 40 | 1.0 (0.1–1.9) | 0.2 (0.0–0.5) |
| Shared library | 5.0 (4.3–5.7) | 17.9 (14.5–21.4) | $0.29 (0.24–0.34) | 5.6 (4.8–6.4) | 2 of 40 | 0.3 (0.0–0.7) | 0.7 (0.1–1.3) |
| OSO, α 0.8 | 5.1 (4.5–5.7) | 16.3 (12.8–19.8) | $0.34 (0.27–0.40) | 7.7 (6.4–9.0) | 5 of 40 | 3.7 (2.1–5.3) | 2.7 (1.5–3.9) |
| OSO, α 0.2 | 5.0 (4.5–5.5) | 17.8 (14.9–20.7) | $0.29 (0.24–0.35) | 6.4 (5.4–7.4) | 1 of 40 | 2.5 (1.8–3.2) | 1.5 (0.7–2.3) |

Against the shared library, with 95% ranges:

| | Targets | Targets per dollar | Money spent | Rounds a lab worked | Lemmas | Built on another lab |
| --- | --- | --- | --- | --- | --- | --- |
| OSO α 0.2 | +0.0 (−0.8 to +0.8) | −0.2 (−4.6 to +4.3) | +$0.00 (−0.07 to +0.07) | +0.8 (−0.5 to +2.1) | +2.2 (+1.4 to +3.0) | +0.8 (−0.2 to +1.8) |
| OSO α 0.8 | +0.1 (−0.8 to +1.0) | −1.7 (−6.6 to +3.2) | +$0.04 (−0.04 to +0.13) | +2.1 (+0.6 to +3.6) | +3.4 (+1.8 to +5.0) | +2.0 (+0.7 to +3.3) |

Means with 95% ranges (Student t; for differences, degrees of freedom from the smaller group, slightly wider than usual). B5 and A5: proved in no part A run. Definitions and the script: `scripts/lean-estimates.py` ("rounds a lab worked" leaves out passes and turns with no valid action; lemmas leave out those the checker marked trivial).

**What it shows:**
- **Targets: about the same in every setup** (about 5 of 8), and the ranges allow at most about one target either way.
- **Labs stopped early everywhere,** after 5 to 8 rounds, with about half their money unspent.
- **With flow-back, labs proved more lemmas** (α 0.2: +2.2 a run). At α 0.8 they also worked about two rounds longer and built on each other more. The plan's warning sign, spending more for the same targets, fits α 0.8 weakly (+$0.04, range −0.04 to +0.13, for the same targets); at α 0.2 money spent was the same.
- **Against part B** (labs could not stop, so they spent all their money): part A proved 0.7 to 1.25 fewer targets per setup (shared library −0.85, range −1.6 to −0.1; OSO α 0.2 −1.25, range −1.9 to −0.6) for about half the money. The prompts differ too (part B used the older wording), so this is not only the effect of stopping.

## 4c. Labs choose what to publish (2026-11-08, roadmap M3)

[Result](../results/community/lean-m3/summary.md). Plan fixed before the runs. Each lab, after proving a lemma, says whether to publish it now or keep it private; a kept lemma goes public only with a target its author proves on it. A new result earns a small reward by proof length (at most 4) when it is published, if no lab published it first. α 1, 0.8 and 0.2; labs cannot stop; $0.15 a lab; 10 runs per setup, 30 in all, $17.94.

**The question:** does flow-back make labs choose to share?

| Setup | Lemmas published at once | Predicted (simulation, matched) | Targets proved (of 8) | Lemmas proved | B5 proved |
| --- | --- | --- | --- | --- | --- |
| Labs choose, α 1 | 99% (98–100%) | 17% | 6.3 (5.6–7.0) | 19.6 (14.0–25.2) | 4 of 10 |
| Labs choose, α 0.8 | 99% (97–100%) | 20% | 6.1 (5.3–6.9) | 19.6 (15.3–23.9) | 4 of 10 |
| Labs choose, α 0.2 | 100% (99–100%) | 93% | 6.7 (5.9–7.5) | 20.4 (16.3–24.5) | 8 of 10 |

α 0.2 minus α 1: share published +1 point (−1 to +2); targets +0.4 (−0.6 to +1.4); B5 +0.4 (−0.02 to +0.67).

**The answer: labs published nearly everything at every α** (596 of 602 lemmas; 6 kept, 1 with no PUBLISH line). This is the outcome the plan named as "against": the share published does not rise with flow-back, because it is already at the top. The simulation predicted that agents at α 1 keep most lemmas, to avoid helping rivals to the next bounty.

**Why, from the labs' thinking:** they publish to collect the new-result reward, which a kept lemma loses ("Publishing now gives up to 4"; "Keeping private doesn't earn unless used in a solved target"). They rarely weigh the risk that publishing helps a rival win the next target. In the simulation the same reward exists, but agents weigh that risk. So with this reward, keeping costs an AI lab more than it gains, at any α.

**Other measures:**
- **No sign of padding:** median lemma proof 69–79 symbols, against 82 in part B.
- **Lead, not a finding:** α 0.2 proved B5 in 8 of 10 runs, α 1 in 4 of 10 (difference +0.4, range −0.02 to +0.67). B5 keeps coming up with low α, but not yet as a planned measure.
- Compared with part B's OSO setups (everything published by rule, no new-result reward), labs here proved more lemmas (about 20 against 11–14 a run). The rules and prompts differ, so this is not a clean comparison.

**What it means for the next step:** with a reward paid on publication, AI labs share by default, so this setup cannot show flow-back raising sharing. To test that, the incentive to keep has to be real: run the same setups with the new-result reward off (then keeping costs nothing at α 1). Not yet run.

## 5. Is the test setup sound? (harness checks)

| Check | Result |
| --- | --- |
| [Proof checker stress test](../results/bench/stress/summary.md) | 32 of 32 cases right; one cheat found and closed (faking Lean's report on which axioms a proof uses) |
| Fault tests | server errors, stuck models, no credit, missing costs, the budget limit and replies cut off partway are all handled (9 tests) |
| [Public benchmark](../results/bench/or-gptoss120b-50x4/summary.md) (FormalMATH-Lite, 50 problems, GPT-OSS-120B) | 13 of 50 with one try, 17 with any of 4, for $0.15; **no proof lost by our harness**; 2 benchmark statements look broken |

Faults found and fixed on the way: wrong error labels, proofs without a code block, planner lines dropped, dotted lemma names, replies cut off partway, and runs spoiled by the laptop sleeping. Budgets count the actual charge since 2026-10-21.

## 6. What is still open

1. **Does flow-back open hard targets?** Part B's lead (B5: 0, 5 and 11 runs of 20), tested with fair prompts and a measure fixed in advance.
2. **Does flow-back keep labs working?** Part A, where labs may stop early.
3. **The knowledge reward in Lean:** off for now; how to measure it later is in [design.md](design.md#the-knowledge-reward-in-lean).
4. **Agents choosing what to publish:** in every test so far the rules set sharing. In the simulation, flow-back matters most when agents choose.
5. **One model, one small problem set (42 theorems).** Results may not carry over to other models or harder mathematics.
