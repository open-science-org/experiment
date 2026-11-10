# AI agents on the Lean problems: results so far

Last updated: 2026-11-08. Every result here has its own page under `results/` (the links), with its design, caveats and logs. This page only gathers them. Setup names are short labels for their [OSO parameters](lean-experiment.md#the-setups): when results go public, α, the flat mint m, the knowledge reward m_bit, and f.

## TL;DR

Checked after every run; last checked 2026-11-09, after the main run on the harder targets (section 4g).

- **Lemmas help weak models.** DeepSeek proves 4 of 16 targets alone, 12 of 16 with the lemmas they need.
- **Sharing lets labs build on each other** (Spend all: 2.2 results a run in the shared library, 0.4 under traditional), but it has not raised targets proved. A plain shared library gets this too, so it is not unique to OSO. **Repeated work is not a general result:** traditional labs proved the same lemma about 20 times a run in the small cheap race (5 runs), but only 0.4 times in Spend all (20 runs per setup; shared library 0.2).
- **Flow-back (OSO's own rule): no clear gain in targets proved yet.** Against the shared library, OSO α 0.2 proved about the same: +0.4 (Spend all), +0.5 (Fair-prompt check), +0.0 (May quit), all with ranges that include zero.
- **Flow-back goes with more lemmas in most experiments** (about twice as many with fair prompts), and more of them get used: lemmas a later proof cites rose by 1 to 5 a run at α 0.2 (section 4d). About half of all lemmas are never cited, and in Labs choose α 1 labs proved as many once publishing paid a small reward.
- **Lead, not a finding: low α gets there sooner.** OSO α 0.2 reached 5 of the 8 targets for the least money in all four experiments (section 4e), but most ranges overlap, and the count of 5 was picked after looking. At 4 and 6 targets the order is mixed: at 6 in Spend all the shared library was cheapest.
- **Lead, not a finding:** the hardest target, B5, comes up more at low α, but the gap shrank with fair prompts and B5 was picked after looking.
- **Against OSO:** labs did not share more with flow-back (they published nearly everything at every α), and did not clearly keep working longer (α 0.8: about 2 rounds longer; α 0.2: no clear change).
- **Money was wasted in every run so far.** About 23% of model replies ran out of length while thinking and gave no answer, costing roughly 39% of the money (section 5). It affects all setups, more in the shared library (27%) than at α 0.2 (23%). In a small test, effort (high or medium) made no clear difference.
- **Pilot: three harder targets kept.** Alone the model proved none of 6 candidates (0 of 24 attempts). With the lemmas, 3 passed the rule fixed in advance (H4 and H5 4 of 4, H6 3 of 4); 3 were still too hard (0 of 4 each). Four attempts each is a rough screen.
- **Harder targets, main run (6 setups × 5 runs, $0.40 a lab; too few runs for 95% ranges):** sharing at once mattered most: the four sharing setups proved 10.4 to 11 of the 11 targets a run, traditional 7.6 and the plain planner 7.8. The planner with a good strategy was cheapest at every count and proved all 11 in every run, but the same role without our hints (the plain planner) was among the worst, so the gain came from the hints. Flow-back alone (OSO α 0.2 against the shared library) showed no gain here: the shared library was somewhat cheaper. Section 4g.
- **Our hints may matter more than the rules.** The strategy advice and failure reports we gave only the planner made the biggest difference in any run so far. A lead: give them to every lab and compare again.
- **Why the tests may be blind:** five of the 8 targets are nearly always proved, so "targets proved" barely moves. Flow-back should matter most on deep problems, not tested yet.
- **The setup checks out** (proof checker, fault tests, public benchmark). Flow-back was split by money spent instead of lines saved until 2026-11-08; the counts stand (correction below).

## Correction: the graph weights for flow-back were wrong (found 2026-11-08)

**The error.** Under OSO, value that reaches a result flows back to the results its proof cited, split by graph weights. The design (docs/design.md, and the simulation) says each cited result's weight should be the work it saves, relative to the other results the same proof cites. The Lean code instead split it by the **money spent proving** each cited result. That is a poor stand-in: an easy lemma that needed several repairs could take most of the share from a harder one proved at the first try. Every Lean run up to and including Labs choose what to publish used the wrong split. Summaries listed it as a known gap, but it was not fixed. **Since 2026-11-08** the split is by lines saved: each cited result's proof length in symbols, relative to the others the same proof cites. Commit 361b9e7.

**Which runs it touched.** Only OSO setups with α below 1, where value flows back: OSO α 0.8 and α 0.2 in Spend all, the Fair-prompt check and May quit; Labs choose α 0.8 and α 0.2; and the earlier race and pilot. Traditional, the shared library and every α 1 setup pay no flow-back, so they are unaffected.

**How much it changed the payouts.** Each affected run's payouts replayed with both splits (`scripts/lean-resplit.ts`). The replay with the old split matches the recorded payouts exactly for every main experiment.

| Experiment, setup | Runs | Earnings that would move to another lab | Worst run | Runs where the labs' order by earnings changes | Results citing 2+ results | Average change in their split |
| --- | --- | --- | --- | --- | --- | --- |
| Spend all, OSO α 0.8 | 20 | 0.8% | 4.5% | 0 | 27 | 23% |
| Spend all, OSO α 0.2 | 20 | 4.6% | 17.6% | 5 | 41 | 29% |
| Fair-prompt check, OSO α 0.2 | 10 | 3.9% | 19.0% | 3 | 30 | 22% |
| May quit, OSO α 0.8 | 10 | 1.0% | 5.0% | 1 | 12 | 32% |
| May quit, OSO α 0.2 | 10 | 1.1% | 8.3% | 2 | 3 | 24% |
| Labs choose, α 0.8 | 10 | 1.4% | 2.9% | 1 | 35 | 21% |
| Labs choose, α 0.2 | 10 | 4.7% | 10.3% | 2 | 46 | 31% |

Where a proof cited two or more results, the split between them was often quite different (by about a quarter on average). But such proofs are few, and most of what labs earn is the share they keep of their own bounties, so overall only 1–5% of earnings would have gone to a different lab. In the worst run, a fifth would have. At α 0.2, where more value flows back, the error mattered more.

**How it affects the results.**
- **The measures do not depend on the split:** targets proved, lemmas proved, building on others, money spent, and the share published are counted from what labs did, not from what they were paid. Those numbers stand as reported.
- **What could have changed is behaviour.** Each round a lab saw its own earnings, which were slightly off, and it acted on them. We cannot replay that. Labs could not see how the split was worked out, only that value flows back, and earnings moved by a few percent, so the effect on what they chose to do was probably small. We cannot rule it out, most of all for OSO α 0.2.
- **No finding rests on who earned what.** The pattern (about twice the groundwork with flow-back, targets about the same) is unaffected as a count. Whether it would be stronger or weaker with the right weights is open: the next runs use them.

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
| Used another lab's result | 0 | 5.2 |

Money to reach 2 counted targets, run by run (OSO / traditional): $0.25 / never, $0.11 / never, $0.07 / $0.18, $0.13 / $0.26, $0.11 / $0.28. OSO was cheaper in every run. The spend measure was chosen after the run (exploratory); budgets were at list prices, and OpenRouter charged about 5.6× more on both sides.

**What it means:** OSO's lead comes from what the simulation predicts: sharing at once stops labs proving the same groundwork again (20 repeats a run against none), and labs build on each other's results. But OSO here was also sharing, so this race cannot say how much is due to flow-back.

## 3. Seven setups (pilot, 2026-11-07)

[pilot-societies-1](../results/community/pilot-societies-1/summary.md): 4 DeepSeek labs, $0.15 a lab, 2 runs per setup, $4.58 in all. It separates sharing from flow-back: a shared library (sharing without flow-back) against OSO.

| Setup | Settings | Money to 2 targets | Targets proved (of 8) |
| --- | --- | --- | --- |
| Single agent | never shared, one lab with all the money, α 1, m 1 | $0.04 | 4.0 |
| Independent labs | never shared, α 1, m 1 | $0.03 | 3.0 |
| Shared library | public at once, α 1, m 1 | $0.05 | 5.0 |
| Planner with a good strategy | public at once, α 1, m 1, lab 1 assigns the work; [it also gets strategy advice and failure reports](lean-experiment.md#the-advantages-of-the-planner-with-a-good-strategy) | $0.12 | 3.5 |
| Traditional | public when a target is proved, α 1, m 1 | $0.07 | 3.5 |
| OSO, α 0.8 | public at once, α 0.8, m 1 | $0.03 | 4.5 |
| OSO, α 0.2 | public at once, α 0.2, m 1 | $0.02 | **6.0** |

**What it means:**
- **The measure was too easy.** Every setup reached 2 targets for a few cents, so the comparison says nothing yet. The main experiment needs a harder measure (3 or more targets, or only the hard ones).
- **A lead to test, not a result:** OSO α 0.2 proved the most targets (6 of 8 in both runs), the shared library 5.
- **Runs vary a lot** (the planner took $0.22 to reach 2 targets in one run, $0.02 in the other), so the main experiment needs many runs per setup.
- **Old rewards:** these runs paid a flat mint per result. New runs have the knowledge reward off ([why](design.md#the-knowledge-reward-in-lean)).
- One OSO α 0.2 run was spoiled when the laptop slept; it was rerun.

**The planner setup works:** in a [trial](../results/community/planner-trial-2/summary.md), DeepSeek labs followed their assignment 10 times out of 12. GPT-OSS-120B labs gave up at once, so it is not used as a lab model.

**Choosing the lab model.** A lab model must keep working and gain from lemmas. DeepSeek V4.1 Flash is the cheapest tested model that does both. GPT-OSS-120B is cheaper but gave up as a lab. In the [lemma panel](../results/pilot/panel-gpt-oss-120b/summary.md) it gained a little (2 of 16 alone, 7 with lemmas). It has not been tried in a plain race, so it may have failed only in the planner trial's setup. The strong Claude models prove every target alone, so they cannot show what sharing is worth.

## 4. Spend all: labs must spend all their money (2026-11-07)

**Setups:** traditional (public when a target is proved, α 1), shared library (public at once, α 1), OSO (public at once, α 0.8 and 0.2). m 0, m_bit 0, f 0 throughout.

**Question, fixed in advance** (the design is in the local notes, `notes/lean-main-experiment.md`): at the same money **spent**, does a community prove more when value flows back (OSO) than when results are only shared (a shared library)? 4 DeepSeek V4.1 Flash labs, $0.15 each; labs could not stop early, so nearly every run spent its money (about $0.61; one OSO α 0.8 run proved all 8 targets by round 13 and ended at $0.45); 20 runs per setup; knowledge reward off; bounties 4 · 2^(depth − 1). Results: [lean-main-b](../results/community/lean-main-b/summary.md). Traditional (20 runs) was added afterwards as a reference point; its runs came after the others'. Full design: [the Lean experiment](lean-experiment.md).

**A known flaw:** the setups' prompts differed by more than the rules. The shared library's had an extra line, "Other results earn nothing by themselves", and the OSO prompts explained flow-back at length. Some of any difference between setups could come from the wording. New runs use one template, where only the rule lines differ.

### The answer: about the same

Targets proved by the end, of 8 (the measure fixed in advance), means with 95% ranges:

| Setup | Targets proved | Spread | Minus the shared library |
| --- | --- | --- | --- |
| Traditional | 5.80 (5.44–6.16) | 4–7 | −0.05 (−0.50 to +0.40) |
| Shared library (α 1) | 5.85 (5.58–6.12) | 4–7 | |
| OSO, α 0.8 | 5.80 (5.33–6.27) | 4–8 | −0.05 (−0.59 to +0.49) |
| OSO, α 0.2 | 6.25 (5.80–6.70) | 5–8 | +0.40 (−0.13 to +0.93) |

The plan's rule, a difference of two standard errors, put neither OSO setting ahead of the shared library. Sharing alone did not raise the number of targets: the shared library proved about as many as traditional. Runs varied less than in the pilot (about ±0.8 targets against ±1.4).

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
| Traditional | 7.2 | 0.4 | 0.4 | 2.6 |
| Shared library | 7.2 | 2.2 | 0.2 | 3.6 |
| OSO, α 0.8 | 10.7 | 3.6 | 0.2 | 3.0 |
| OSO, α 0.2 | 13.8 | 5.8 | 0.2 | 2.9 |

A target is proved twice when a lab proves it after another lab already has: nearly always in the same round (2 later cases in all, both under traditional). "Built on another lab", here and below, counts only the first proof of each statement (recounted 2026-11-08; the pages under `results/` still show the older, higher counts). (An earlier version of this table counted both kinds together as "lemmas proved twice".)

**What it suggests:**
- **Sharing changes how labs work:** labs built on each other's results 2.2 times a run in the shared library, against 0.4 under traditional.
- **Flow-back goes with more groundwork:** traditional and the shared library proved the same number of lemmas (7.2 a run); OSO proved more, and more the lower the α (10.7 at α 0.8, 13.8 at α 0.2). Labs also built on each other more.
- **And with B5:** the hard target that needs the most lemmas was proved more often the more value flowed back (0, 5 and 11 runs of 20).
- **The total barely moves,** because the measure fixed in advance counts every target the same.
- These go together; they do not show that flow-back caused them. The prompts differed by more than the rules (above), and these patterns were looked for after the results.

**How to confirm it:** with the prompts fixed, a run fixed in advance on B5 alone: is B5 proved, OSO α 0.2 against the shared library, about 40 runs each.

**Also:** "money to reach 3 targets" was too easy; every run got there for $0.04–0.05.

## 4a. Fair-prompt check (2026-11-07 to 08)

**Setups:** shared library (public at once, α 1), OSO (public at once, α 0.2). m 0, m_bit 0, f 0 throughout.

[Result](../results/community/lean-b5/summary.md). Plan fixed before the runs (roadmap M1): Spend all's B5 lead, tested again with one prompt template, so that the setups' prompts differ only in their rules. Shared library against OSO α 0.2, labs cannot stop, 10 runs per setup, 20 in all, $16.10. **Labs had $0.20 each here, against $0.15 in Spend all**, so two things changed at once: the prompts and the money.

| Setup | B5 proved | Targets proved (of 8) | Lemmas proved | Built on another lab | Rounds a lab worked |
| --- | --- | --- | --- | --- | --- |
| Shared library | 3 of 10 (0.11–0.60) | 6.1 (5.6–6.6) | 8.5 (4.6–12.4) | 3.1 (1.2–5.1) | 16.9 (16.0–17.7) |
| OSO, α 0.2 | 4 of 10 (0.17–0.69) | 6.6 (5.9–7.3) | 17.2 (13.6–20.8) | 7.0 (4.7–9.3) | 19.6 (18.0–21.1) |
| OSO minus shared | +0.10 (−0.28 to +0.45) | +0.5 (−0.4 to +1.4) | +8.7 (+3.4 to +14.0) | +3.9 (+0.9 to +6.9) | +2.7 (+0.9 to +4.4) |

**B5:** much closer than in Spend all (11 of 20 against 0 of 20, a gap of 0.55). The range here (−0.28 to +0.45) leaves room for a gap of up to about 0.45, so the B5 question is still open, and we cannot say whether the fair prompts or the extra money closed the gap. We did not add the 10 extra runs the plan allowed: May quit and M3 were already using the provider, and the lemma result was what bore on M3.

**Lemmas and building on others:** with flow-back, labs proved about twice as many lemmas and built on another lab's result more often. This is the same direction as in Spend all. Targets: +0.5, with a range from slightly fewer to about one more. Lead, not a finding: OSO α 0.2 proved A5 in 3 of 10 runs, the shared library in 0.

**What labs thought** (runs 6–10, `scripts/lean-thinking.py`, a rough keyword count checked by hand on 10 matches per setup): on lemma turns, 64% of OSO labs' thinking mentions being paid through flow-back, against 20% in the shared library, where it mostly notes that nothing flows back. So labs notice the rule, often quoting it. Whether it drives their choice is not shown: in about half the OSO samples the lab mentions flow-back and then goes for a target.

## 4b. May quit: labs may stop early (2026-11-08)

**Setups:** traditional (public when a target is proved, α 1), shared library (public at once, α 1), OSO (public at once, α 0.8 and 0.2). m 0, m_bit 0, f 0 throughout.

[Result](../results/community/lean-part-a/summary.md). Plan fixed before the runs (roadmap M2). Same setups and money as Spend all ($0.15 a lab, prompts from the one template), but a lab that passes stops for good. 10 runs per setup, 40 in all, $11.90. Main comparison: OSO α 0.2 against the shared library.

**The question:** does flow-back keep labs working, and get further with the same money offered?

| Setup | Targets proved (of 8) | Targets per dollar | Money spent, of $0.60 | Rounds a lab worked | Labs that never passed | Lemmas proved | Built on another lab |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 5.0 (4.4–5.6) | 19.0 (15.8–22.3) | $0.27 (0.23–0.31) | 5.5 (4.8–6.2) | 2 of 40 | 1.0 (0.1–1.9) | 0.2 (0.0–0.5) |
| Shared library | 5.0 (4.3–5.7) | 17.9 (14.5–21.4) | $0.29 (0.24–0.34) | 5.6 (4.8–6.4) | 2 of 40 | 0.3 (0.0–0.7) | 0.7 (0.1–1.3) |
| OSO, α 0.8 | 5.1 (4.5–5.7) | 16.3 (12.8–19.8) | $0.34 (0.27–0.40) | 7.7 (6.4–9.0) | 5 of 40 | 3.7 (2.1–5.3) | 1.4 (0.5–2.3) |
| OSO, α 0.2 | 5.0 (4.5–5.5) | 17.8 (14.9–20.7) | $0.29 (0.24–0.35) | 6.4 (5.4–7.4) | 1 of 40 | 2.5 (1.8–3.2) | 1.1 (0.5–1.7) |

Against the shared library, with 95% ranges:

| | Targets | Targets per dollar | Money spent | Rounds a lab worked | Lemmas | Built on another lab |
| --- | --- | --- | --- | --- | --- | --- |
| OSO α 0.2 | +0.0 (−0.8 to +0.8) | −0.2 (−4.6 to +4.3) | +$0.00 (−0.07 to +0.07) | +0.8 (−0.5 to +2.1) | +2.2 (+1.4 to +3.0) | +0.4 (−0.5 to +1.3) |
| OSO α 0.8 | +0.1 (−0.8 to +1.0) | −1.7 (−6.6 to +3.2) | +$0.04 (−0.04 to +0.13) | +2.1 (+0.6 to +3.6) | +3.4 (+1.8 to +5.0) | +0.7 (−0.4 to +1.8) |

Means with 95% ranges (Student t; for differences, degrees of freedom from the smaller group, slightly wider than usual). B5 and A5: proved in no May quit run. Definitions and the script: `scripts/lean-estimates.py` ("rounds a lab worked" leaves out passes and turns with no valid action; lemmas leave out those the checker marked trivial).

**What it shows:**
- **Targets: about the same in every setup** (about 5 of 8), and the ranges allow at most about one target either way.
- **Labs stopped early everywhere,** after 5 to 8 rounds, with about half their money unspent.
- **With flow-back, labs proved more lemmas** (α 0.2: +2.2 a run). At α 0.8 they also worked about two rounds longer. Building on each other: +0.7 a run at α 0.8 and +0.4 at α 0.2, with ranges that include zero. The plan's warning sign, spending more for the same targets, fits α 0.8 weakly (+$0.04, range −0.04 to +0.13, for the same targets); at α 0.2 money spent was the same.
- **Against Spend all** (labs could not stop, so they spent all their money): May quit proved 0.7 to 1.25 fewer targets per setup (shared library −0.85, range −1.6 to −0.1; OSO α 0.2 −1.25, range −1.9 to −0.6) for about half the money. The prompts differ too (Spend all used the older wording), so this is not only the effect of stopping.

## 4c. Labs choose what to publish (2026-11-08, roadmap M3)

**Setups:** the lab chooses when to publish, α 1, 0.8 and 0.2; m 0, m_bit by proof size (at most 4), f 0.

[Result](../results/community/lean-m3/summary.md). Plan fixed before the runs. Each lab, after proving a lemma, says whether to publish it now or keep it private; a kept lemma goes public only with a target its author proves on it. A new result earns a small reward by proof length (at most 4) when it is published, if no lab published it first. α 1, 0.8 and 0.2; labs cannot stop; $0.15 a lab; 10 runs per setup, 30 in all, $17.94.

**The question:** does flow-back make labs choose to share?

| Setup | Lemmas published at once | Predicted (simulation, matched) | Targets proved (of 8) | Lemmas proved | B5 proved |
| --- | --- | --- | --- | --- | --- |
| Labs choose, α 1 | 99% (98–100%) | 17% | 6.3 (5.6–7.0) | 19.6 (14.0–25.2) | 4 of 10 |
| Labs choose, α 0.8 | 99% (97–100%) | 20% | 6.1 (5.3–6.9) | 19.6 (15.3–23.9) | 4 of 10 |
| Labs choose, α 0.2 | 100% (99–100%) | 93% | 6.7 (5.9–7.5) | 20.4 (16.3–24.5) | 8 of 10 |

α 0.2 minus α 1: share published +1 point (−1 to +2); targets +0.4 (−0.6 to +1.4); B5 +0.4 (−0.02 to +0.67).

**The answer: labs published nearly everything at every α** (599 of 606 lemmas published at once, 6 kept, 1 with no PUBLISH line; without trivial lemmas, 589 of 596). This is the outcome the plan named as "against": the share published does not rise with flow-back, because it is already at the top. The simulation predicted that agents at α 1 keep most lemmas, to avoid helping rivals to the next bounty.

**Why, from the labs' thinking:** they publish to collect the new-result reward, which a kept lemma loses ("Publishing now gives up to 4"; "Keeping private doesn't earn unless used in a solved target"). They rarely weigh the risk that publishing helps a rival win the next target. In the simulation the same reward exists, but agents weigh that risk. So with this reward, keeping costs an AI lab more than it gains, at any α.

**Other measures:**
- **No sign of padding:** median lemma proof 69–79 symbols, against 82 in Spend all.
- **Lead, not a finding:** α 0.2 proved B5 in 8 of 10 runs, α 1 in 4 of 10 (difference +0.4, range −0.02 to +0.67). B5 keeps coming up with low α, but not yet as a planned measure.
- Compared with Spend all's OSO setups (everything published by rule, no new-result reward), labs here proved more lemmas (about 20 against 11–14 a run). The rules and prompts differ, so this is not a clean comparison.

**What it means for the next step:** with a reward paid on publication, AI labs share by default, so this setup cannot show flow-back raising sharing. To test that, the incentive to keep has to be real: run the same setups with the new-result reward off (then keeping costs nothing at α 1). Not yet run.

## 4d. Lemmas a later proof cites (looked at after the results)

Lemmas count as useful groundwork only if another result's proof used them. First proofs only, trivial lemmas left out. Means with 95% ranges (`scripts/lean-estimates.py`).

| Experiment | Shared library (or α 1) | OSO α 0.8 | OSO α 0.2 | α 0.2 minus shared (or α 1) |
| --- | --- | --- | --- | --- |
| Spend all | 2.2 (1.3–3.1) | 4.4 (2.8–6.1) | 6.3 (4.0–8.5) | +4.1 (+1.6 to +6.5) |
| Fair-prompt check | 3.3 (0.9–5.7) | not run | 8.4 (5.1–11.7) | +5.1 (+1.0 to +9.2) |
| May quit | 0.0 | 2.1 (1.5–2.7) | 1.1 (0.6–1.6) | +1.1 (+0.6 to +1.6) |
| Labs choose (against α 1) | 8.8 (5.2–12.4) | 8.8 (5.4–12.2) | 10.5 (7.5–13.5) | +1.7 (−3.0 to +6.4) |

With flow-back, labs proved more lemmas that others went on to use, except in Labs choose, where publishing paid at every α. About half of all lemmas are not cited by any later proof.

## 4e. How soon setups reach the targets (looked at after the results)

Every run records each action's round and cost, so this comes from the saved runs. `npm run speed -- <experiment id>` writes the tables for any experiment. Money is what all labs together had spent by the end of the round in which the proof came in. Runs that never got there count as "not reached", so no setup is flattered by leaving them out. Details per experiment: [Spend all](../results/community/lean-main-b/speed.md), [Fair-prompt check](../results/community/lean-b5/speed.md), [May quit](../results/community/lean-part-a/speed.md), [Labs choose](../results/community/lean-m3/speed.md).

**The graphs are in the app:** Experiments → Results, for each experiment. Click a main question, and the graph changes to answer it.

Median money to reach 5 of the 8 targets (range covering at least 95%):

*Corrected 2026-11-08: an off-by-one made the ranges in the first version too narrow (they covered about 88–89%, not 95%). The medians did not change.*

*Changed 2026-11-09: money now counts the whole round. Labs work at the same time, so counting only up to the moment a proof came in left out the calls still running. Medians rose by a few percent to about a quarter.*

| Experiment | Traditional | Shared library (or α 1) | OSO α 0.8 | OSO α 0.2 |
| --- | --- | --- | --- | --- |
| Spend all | $0.249 (0.190–0.334) | $0.290 (0.180–0.390) | $0.246 (0.176–0.320) | $0.172 (0.119–0.235) |
| Fair-prompt check | not run | $0.316 (0.172–0.436) | not run | $0.218 (0.166–0.338) |
| May quit | $0.243 (0.085 to not reached) | $0.231 (0.182 to not reached) | $0.287 (0.159 to not reached) | $0.190 (0.097 to not reached) |
| Labs choose (against α 1) | not run | $0.235 (0.124–0.403) | $0.248 (0.134–0.369) | $0.142 (0.102–0.257) |

**What it suggests:** OSO α 0.2 reached 5 targets for the least money in all four experiments, about 20–40% less than the shared library or α 1, though most ranges overlap. It does not hold at every count: at 4 targets the order varies, and at 6 targets Spend all's shared library was cheapest ($0.336, against $0.382 for OSO α 0.2). A lead: the count of 5 was picked after looking. At 7 targets, more OSO α 0.2 runs got there in Spend all (10 of 20, against 1 of 20 in the shared library) and Labs choose (7 of 10, against 4 of 10).

## 4f. Harder targets, stage 1 (pilot, 2026-11-09; left out)

**Setups:** public at once in all: OSO α 0.2 (m 0), shared library (α 1, m 0), planner with a good strategy (α 1, m 0; lab 1 assigns the work, and [gets strategy advice and failure reports the others do not](lean-experiment.md#the-advantages-of-the-planner-with-a-good-strategy)), pay per lemma (α 1, m 1). m_bit 0, f 0.

8 runs, 2 per setup, $0.20 a lab, $6.16 in all. The rule fixed in advance needed each of H4, H5 and H6 to be proved in some runs but not all, or at least two of them. Results pooled over the setups, so the check did not look at who was ahead.

| Target | Runs that proved it (of 8) | Attempts, all runs | Money |
| --- | --- | --- | --- |
| H6 | 7 | 23 | $0.28 |
| H5 | 0 | 5 (in 1 run) | $0.14 |
| H4 | 0 | 0 | $0 |
| B5 | 0 | 2 | $0.07 |
| A5 | 0 | 2 | $0.07 |
| X1 | 4 | 90 | $2.08 |

Only H6 met the rule, so stage 2 was not started. Labs spent $0.77 of each run's $0.80, a third of all the money on X1 alone. Runs proved 5 to 7 targets. 28% of replies were empty (95% range 25–31%), above the 23% of earlier runs. With 2 runs per setup this says nothing about which setup is better.

## 4g. Harder targets, main run (2026-11-09)

[Result](../results/community/lean-hard-2/summary.md) · [How soon each setup got there](../results/community/lean-hard-2/speed.md). 6 setups × 5 runs, 4 DeepSeek labs, $0.40 a lab, medium effort, labs cannot stop early; $37.86 in all. The plain planner and traditional were added after the other four had run, and ran later.

**Setups** ([OSO parameters](lean-experiment.md#the-setups); m_bit 0 and f 0 in all): OSO (public at once, α 0.2, m 0); shared library (at once, α 1, m 0); planner with a good strategy (at once, α 1, m 0; lab 1 assigns the work and also gets [strategy advice and failure reports](lean-experiment.md#the-advantages-of-the-planner-with-a-good-strategy)); plain planner (the same with the labs' information only); pay per lemma (at once, α 1, m 1); traditional (public when a target is proved, α 1, m 0).

**Measure, fixed in advance:** median money, all labs together, to reach K of the 11 targets, with K the highest count that more than half the runs of every setup reached: **K = 7**. With 5 runs a setup there is no 95% range for a median (it needs 6), so these are estimates only.

| Setup | Runs that reached 7 | Median money to 7 | Targets proved by the end (mean) | Money spent (mean) | Lemmas proved (mean) |
| --- | --- | --- | --- | --- | --- |
| Planner with a good strategy | 5 of 5 | **$0.203** | 11.0 | $0.70 | 22.6 |
| Shared library | 5 of 5 | $0.509 | 10.4 | $1.44 | 21.8 |
| Pay per lemma | 5 of 5 | $0.699 | 10.6 | $1.45 | 63.0 |
| OSO, α 0.2 | 5 of 5 | $0.727 | 10.8 | $1.17 | 26.4 |
| Traditional | 4 of 5 | $0.812 | 7.6 | $1.62 | 20.0 |
| Plain planner | 4 of 5 | $1.137 | 7.8 | $1.19 | 13.0 |

**What it suggests:**
- **Sharing at once is the big effect.** The four setups that publish at once proved 10.4 to 11 targets a run; traditional proved 7.6. This matches the simulation.
- **The planner's hints, not the planning, did it.** The planner with a good strategy was cheapest at every count (to 10 targets: $0.400, against $0.940 to $1.152 for the other sharing setups) and proved all 11 in every run, for half the money. The plain planner, the same role with the labs' information, proved 7.8 and was the most expensive to 7.
- **Flow-back, the only difference between OSO α 0.2 and the shared library:** no gain here. The shared library was cheaper to 7 ($0.509 against $0.727) and to 10 ($0.970 against $1.152); OSO spent less in all ($1.17 against $1.44) and proved about the same. Five runs each, so this is not settled.
- **A flat reward per lemma (pay per lemma against the shared library: only m differs)** tripled the lemmas proved (63 against 22) and changed little else.
- **The harder targets work at $0.40 a lab.** In the four sharing setups H4 was proved in 19 of 20 runs and H5 in 20 of 20; in traditional and the plain planner, 1 to 3 of 5.
- **Empty replies rose again:** 34% (3,087 of 9,088), against 23% in earlier runs and 28% in stage 1.

**Caveats:** K is set by the setups that reach the fewest targets, so the four sharing setups are compared at 7 of 11, well below what they reached; the counts above 7 were looked at afterwards. Two setups ran later than the others. Five more runs per setup would give ranges.

## 5. Is the test setup sound? (harness checks)

| Check | Result |
| --- | --- |
| [Proof checker stress test](../results/bench/stress/summary.md) | 32 of 32 cases right; one cheat found and closed (faking Lean's report on which axioms a proof uses) |
| Fault tests | server errors, stuck models, no credit, missing costs, the budget limit and replies cut off partway are all handled (9 tests) |
| [Public benchmark](../results/bench/or-gptoss120b-50x4/summary.md) (FormalMATH-Lite, 50 problems, GPT-OSS-120B) | 12 of 50 with one try, 17 with any of 4, for $0.10; **no proof lost by our harness**; 2 benchmark statements look broken |

Faults found and fixed on the way: wrong error labels, proofs without a code block, planner lines dropped, dotted lemma names, replies cut off partway, and runs spoiled by the laptop sleeping. Budgets count the actual charge since 2026-10-21.

### Replies that gave no answer

Each model reply may use up to 32,000 tokens, including its thinking. In the four main experiments 5,646 of 24,902 replies (23%) used all of them and gave no text at all. Each cost about $0.0066, so about $37 of the $94.63 spent. All setups are affected: 27% of replies in the shared library, 25% traditional, 22–23% OSO, 16–18% Labs choose. Costs on this page include this waste.

A further 22% of replies (5,385) had text that never reached Lean, mostly because of its format. From 2026-11-08 these are read more tolerantly, and the prompt shows an example; the same checks still apply. Read again by the new code, 3,517 of those saved replies would now reach Lean; whether they would pass is not known. Runs after that date are not directly comparable with earlier ones on cost.

**Does effort change it? (pilot, 2026-11-08; 24 attempts at each effort, H4, H5, H6, alone and with lemmas.)** No clear change between high and medium. The community runs above were all at medium, so the empty replies happen there too. Replies stopped by the length limit: 50 of 69 at medium effort, 54 of 69 at high. Cost: $0.60 and $0.62. With lemmas: 12 of 12 proved at medium, 11 of 12 at high. Alone, every reply at both efforts hit the limit (48 of 48) and nothing was proved: the model keeps thinking when it is stuck. Too small to show a difference in quality.

**Would a lower limit fix it?** From saved single-reply turns (1,203, all at medium effort, the setting of every community run so far), not a new test: replies that gave an answer used a median of 14,875 tokens, and a limit of 16,000 would have cut 41% of those Lean accepted. So a lower limit would cost proofs.

**Is retrying after an empty reply worth it?** When the first reply was empty, 29% of turns still ended in an accepted proof (717 of 2,483). When the first empty reply came second, 4% did (57 of 1,269); third, none (0 of 387).

## 6. What is still open

1. **Does flow-back make labs choose to share?** Labs choose found no answer: labs published nearly everything at every α, to collect the new-result reward. Next: the same setups with that reward off, α 1 against α 0.2, so keeping costs nothing at α 1.
2. **Does flow-back open hard targets?** B5 keeps coming up at low α (Spend all, Labs choose), but the fair-prompt check gave a much smaller gap. Next: B5 as the measure fixed in advance.
3. **Does flow-back keep labs working?** May quit: no clear change at α 0.2, about 2 rounds longer at α 0.8 (+0.6 to +3.6); labs stopped after 5 to 8 rounds in every setup. 10 runs each.
4. **More groundwork, same targets:** flow-back raised lemmas in Spend all, the fair-prompt check and May quit, but not in Labs choose (where publishing paid at every α), and not targets proved. Lemmas a later proof cites are the better measure. Whether the extra groundwork pays off on harder problems is open (roadmap M4b, M5).
5. **One model, one small problem set (42 theorems).** Results may not carry over to other models or harder mathematics.
