# AI agents on the Lean problems: results so far

Last updated: 2026-11-25. Every result here has its own page under `results/` (the links), with its design, caveats and logs. This page only gathers them. Setup names are short labels for their [OSO parameters](lean-experiment.md#the-setups): when results go public, α, the flat mint m, the knowledge reward m_bit, and f.

## TL;DR

Checked after every run; last checked 2026-11-27, after E1 (4k), the Fermat runs (4l, 4m), the QR test run (4n), the replay test of the prompt fix (4o), the first QR comparison (4p) and labs choose on QR (4q).

- **Lemmas help weak models.** DeepSeek proves 4 of 16 targets alone, 12 of 16 with the lemmas they need.
- **Sharing lets labs build on each other** (Spend all: 2.2 results a run in the shared library, 0.4 under traditional), but it has not raised targets proved. A plain shared library gets this too, so it is not unique to OSO. **Repeated work is not a general result:** traditional labs proved the same lemma about 20 times a run in the small cheap race (5 runs), but only 0.4 times in Spend all (20 runs per setup; shared library 0.2).
- **Flow-back (OSO's own rule): no clear gain in targets proved yet.** Against the shared library, OSO α 0.2 proved about the same: +0.4 (Spend all), +0.5 (Fair-prompt check), +0.0 (May quit), all with ranges that include zero.
- **Lead: flow-back goes with more lemmas** in all 5 experiments where only flow-back paid for lemmas (about twice as many with fair prompts), and more of them get used: lemmas a later proof cites rose by 1 to 5 a run at α 0.2 (section 4d). Lemmas were never the measure fixed in advance. About half of all lemmas are never cited, and in Labs choose α 1 labs proved as many once publishing paid a small reward.
- **A lead that did not hold: low α gets there sooner.** OSO α 0.2 reached 5 of the 8 targets for the least money in all four earlier experiments (section 4e, ranges overlapping, count picked after looking); on the harder targets the shared library was cheaper (section 4g).
- **Lead, not a finding:** the hardest target, B5, comes up more at low α, but the gap shrank with fair prompts and B5 was picked after looking.
- **Flow-back and sharing: direction as predicted, not shown.** With the knowledge reward off, labs published 58% of lemmas at α 1 and 93% at α 0.2 (section 4h); the planned difference, +35 points, has a range from −18 to +87. Labs proved only 8 lemmas at α 1. With publishing paid they shared 98–100% at every α.
- **Bigger set (27 targets), labs choose, reward off (section 4i): no clear difference.** Lemmas published at once: 92% at α 1, 96% at α 0.2 (+4 points, range −3 to +12). Targets proved of 27: traditional 20.0, α 1 20.6, α 0.2 21.2; α 0.2 minus traditional +1.2 (range −0.3 to +2.7). Lead, not fixed in advance: results built on another lab's work rose from 6.4 (traditional) to 11.4 (α 1) and 16.0 (α 0.2) a run, and α 0.2 proved more lemmas (23 against 14).
- **Against OSO:** with publishing paid, labs did not share more with flow-back (they published nearly everything at every α), and did not clearly keep working longer (α 0.8: about 2 rounds longer; α 0.2: no clear change).
- **Money was wasted in every run so far.** About 23% of model replies ran out of length while thinking and gave no answer, costing roughly 39% of the money (section 5). It affects all setups, more in the shared library (27%) than at α 0.2 (23%). In small tests no setting helped: high, medium or low effort, or a cap on thinking, left about 71–75% of replies cut off on hard targets without lemmas (section 5).
- **Pilot: three harder targets kept.** Alone the model proved none of 6 candidates (0 of 24 attempts). With the lemmas, 3 passed the rule fixed in advance (H4 and H5 4 of 4, H6 3 of 4); 3 were still too hard (0 of 4 each). Four attempts each is a rough screen.
- **Harder targets, main run (6 setups × 5 runs, $0.40 a lab; too few runs for 95% ranges):** the four sharing setups proved 10.4 to 11 of the 11 targets a run, traditional 7.6 and the plain planner 7.8; but those two ran at a higher price per token, so their dollar budgets bought about a quarter less thinking (correction below). At the same price, traditional reached 7 targets for $0.42, between the shared library ($0.34) and OSO α 0.2 ($0.48). The planner with a good strategy was cheapest at every count and proved all 11 in every run, but the same role without our hints (the plain planner) was among the worst, so the gain came from the hints. Flow-back alone (OSO α 0.2 against the shared library) showed no gain here: the shared library was somewhat cheaper. Section 4g.
- **E1, reward or instruction (section 4k, 5 runs per setup): no effect shown on the measure fixed in advance.** Lemmas cited later: reward (OSO α 0.2 − shared, both told to earn) +3.8 (range −1.9 to +9.5); the instruction to earn −1.8 (−6.2 to +2.6); seeing earnings −0.8 (−6.1 to +4.5). **Lead:** counting all lemmas, the reward goes with about twice as many (+11.0, range +5.5 to +16.5) and being told to earn with no reward goes with fewer (−6.8, range −12.6 to −1.0); seeing the earnings made no difference. So the extra groundwork under OSO looks like the reward, not the prompt, but much of it is not used later.
- **Flow-back, everything so far in one place:** [flow-back](flow-back.md). Labs restate the rule in their thinking; in the shared library they call a lemma a gift to rivals. Whether the prompt or the earnings drive the extra groundwork is not separated yet.
- **Our hints may matter more than the rules.** The strategy advice and failure reports we gave only the planner made the biggest difference in any run so far. A lead: give them to every lab and compare again.
- **Why the tests may be blind:** five of the 8 targets are nearly always proved, so "targets proved" barely moves. Flow-back should matter most on deep problems, not tested yet.
- **Money is now counted at one fixed price per token** (from 2026-11-17; correction below). The model's price doubled between Nov 8 and Nov 9; dollar figures below are repriced.
- **The setup checks out** (proof checker, fault tests, public benchmark). Flow-back was split by money spent instead of lines saved until 2026-11-08; the counts stand (correction below).
- **Deep set: a community of cheap models proved Fermat's little theorem from scratch** (one run, OSO α 0.2, section 4j): 11 levels deep, from their own numbers, in round 61 for $2.53. The proof rests on 53 results from all 4 labs; one step took 57 failed tries before a lab broke it. One run with no comparison: it shows the depth is reachable, not that OSO's rules helped.
- **Deep set, traditional (one run, section 4l): Fermat not proved in 100 rounds** ($4.65 spent, 34 of 95 hidden steps; labs worked alone and proved 22 lemmas twice). At $2 a run it had reached 27 steps against the OSO run's 52. One run a side, different days: direction as predicted, size not estimated.
- **Deep set, three setups side by side (one run each, section 4m): Fermat not proved in any.** Hidden steps by $2 a run: traditional 34, shared library 51, OSO α 0.2 38. OSO's labs reached the last hard step first (round 28) and then lost 46% of their money to replies cut off on it. Across the Fermat runs, sharing at once beat traditional in all four pairs; flow-back over plain sharing is open.
- **QR, labs choose what to publish (one run each, section 4q): labs share almost everything either way.** Published at once: 96% at α 1, 100% at α 0.2, with nothing rewarding it. Flow-back has little to change when sharing is already the default. Hidden steps by $2 a run: 78 and 76.
- **QR, three setups side by side (one run each, section 4p): no setup got past level 10 of 17.** Hidden steps reached of 206: traditional 56, shared library 69, OSO α 0.2 70. Lead, not a result: sharing got further than working alone (+13 and +14); flow-back added nothing beyond sharing (+1). All stalled on the basics before Wilson's theorem and Gauss's lemma. With the small-lemma prompt, each run spent only $1.02 to $1.24 of $8 before the 100 rounds ran out, so counts are at 100 rounds, not equal money. One run each: no ranges.
- **Asking for one small lemma a turn cuts wasted money (replay test, section 4o).** Retaking 90 turns of the Fermat OSO run per prompt: lemmas accepted per turn 0.11 with the prompt as run, 0.31 asking for one small lemma (+0.20, range +0.08 to +0.32), 0.36 also showing recent failures (+0.24, range +0.13 to +0.36). Replies cut off before an answer fell from 70% of model replies to 40% and 14%. Lemmas per dollar: 7, 26, 49. One run's moments only; accepted lemmas, not hidden steps.
- **QR set ready (test run, not a result, section 4n).** A new problem: quadratic reciprocity from scratch, 206 hidden steps, 17 levels deep (Fermat: 95, 11). One cheap OSO α 0.2 run (20 rounds, $0.18) reached 34 hidden steps, the deepest at level 10. Everything worked: checker, step map, live snapshot.
- **Bigger problem set (27 targets), model check:** 4 cheap models, each target alone and with its lemmas, 2 attempts each ($3.34). Targets that needed their lemmas (0 of 2 alone, at least 1 of 2 with them): DeepSeek V4.1 Flash 10, GLM-5.3 Flash 8, Qwen 3.7 Flash 16 (but it proved only 27 of 54 even with lemmas), Claude Haiku 5.5 1 (it proved 50 of 54 alone: too strong for this set). Results: `results/pilot/big-panel-*`.

## Correction: the model's price changed between runs (found 2026-11-13)

**The error.** Budgets were in dollars, at whatever OpenRouter charged on the day. For DeepSeek V4.1 Flash that was about $0.20 per million output tokens in every run to 2026-11-08, $0.30 in the main runs on the harder targets (Nov 9), and $0.39–0.40 in the harder-targets pilot, Labs choose with the reward off, and the harder-targets follow-up (traditional and the plain planner). Tokens per try did not change. So later runs got less thinking for the same budget, and their money to reach K targets was inflated.

**The fix.** Money is now tokens at a fixed reference price per model ([src/lean/prices.ts](../src/lean/prices.ts): DeepSeek $0.06 input, $0.20 output, $0.006 cached input per million, fitted to the charges to Nov 8). New runs count budgets this way; old runs are repriced when read. Every summary and graph has been regenerated. The cost of each experiment still shows what was charged.

**What it changes.** Runs to Nov 8 barely change. Within one batch run together, comparisons were fair. Across batches they were not: Labs choose with the reward off cost about half of what was shown, and on the harder targets traditional and the plain planner, which ran later, cost about half. Repricing cannot give back thinking that higher prices cut short, so their target counts may still be low.

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

[Result](../results/community/lean-hard-2/summary.md) · [How soon each setup got there](../results/community/lean-hard-2/speed.md). 6 setups × 5 runs, 4 DeepSeek labs, $0.40 a lab, medium effort, labs cannot stop early; $37.86 in all. The plain planner and traditional were added after the other four had run, and ran later, at a higher price per token (correction above): their $0.40 bought about a quarter less thinking. Money below is repriced to one fixed price.

**Setups** ([OSO parameters](lean-experiment.md#the-setups); m_bit 0 and f 0 in all): OSO (public at once, α 0.2, m 0); shared library (at once, α 1, m 0); planner with a good strategy (at once, α 1, m 0; lab 1 assigns the work and also gets [strategy advice and failure reports](lean-experiment.md#the-advantages-of-the-planner-with-a-good-strategy)); plain planner (the same with the labs' information only); pay per lemma (at once, α 1, m 1); traditional (public when a target is proved, α 1, m 0).

**Measure, fixed in advance:** median money, all labs together, to reach K of the 11 targets, with K the highest count that more than half the runs of every setup reached: **K = 7**. With 5 runs a setup there is no 95% range for a median (it needs 6), so these are estimates only.

| Setup | Runs that reached 7 | Median money to 7 | Targets proved by the end (mean) | Money spent (mean) | Lemmas proved (mean) |
| --- | --- | --- | --- | --- | --- |
| Planner with a good strategy | 5 of 5 | **$0.134** | 11.0 | $0.54 | 22.6 |
| Shared library | 5 of 5 | $0.335 | 10.4 | $1.08 | 21.8 |
| Traditional | 4 of 5 | $0.418 | 7.6 | $0.83 | 20.0 |
| Pay per lemma | 5 of 5 | $0.453 | 10.6 | $1.10 | 63.0 |
| OSO, α 0.2 | 5 of 5 | $0.484 | 10.8 | $0.84 | 26.4 |
| Plain planner | 4 of 5 | $0.587 | 7.8 | $0.61 | 13.0 |

**What it suggests:**
- **Sharing at once proved more targets, but not for less money.** The four setups that publish at once proved 10.4 to 11 targets a run; traditional proved 7.6. At the same price, though, traditional reached 7 targets for less than OSO α 0.2 and pay per lemma, and its runs had about a quarter less thinking, which may explain part of its lower count.
- **The planner's hints, not the planning, did it.** The planner with a good strategy was cheapest at every count (to 10 targets: $0.268, against $0.616 to $0.769 for the other sharing setups) and proved all 11 in every run, for half the money. The plain planner, the same role with the labs' information, proved 7.8 and was the most expensive to 7.
- **Flow-back, the only difference between OSO α 0.2 and the shared library:** no gain here. The shared library was cheaper to 7 ($0.335 against $0.484) and to 10 ($0.652 against $0.769); OSO spent less in all ($0.84 against $1.08) and proved about the same. Five runs each, so this is not settled.
- **A flat reward per lemma (pay per lemma against the shared library: only m differs)** tripled the lemmas proved (63 against 22) and changed little else.
- **The harder targets work at $0.40 a lab.** In the four sharing setups H4 was proved in 19 of 20 runs and H5 in 20 of 20; in traditional and the plain planner, 1 to 3 of 5.
- **Empty replies rose again:** 34% (3,087 of 9,088), against 23% in earlier runs and 28% in stage 1.

**Caveats:** K is set by the setups that reach the fewest targets, so the four sharing setups are compared at 7 of 11, well below what they reached; the counts above 7 were looked at afterwards. Two setups ran later, at a higher price per token. Five more runs per setup would give ranges.

## 4h. Labs choose, knowledge reward off (2026-11-09 to 10)

[Result](../results/community/lean-m3-off/summary.md). The same as Labs choose (4c) with one change: a new result earns nothing when published (m_bit 0). **Setups:** the lab chooses when to publish; α 1, 0.8 and 0.2; m 0, m_bit 0, f 0. 4 DeepSeek labs, $0.15 a lab, labs cannot stop, 10 runs per α, 30 in all, $18.57. **Measure fixed in advance:** the share of lemmas published at once, α 0.2 against α 1; flow-back counts only if α 0.2 is clearly higher. **Prediction,** from the simulation matched to these runs: 16% at α 1, 16% at α 0.8, 93% at α 0.2.

**Departures from the plan** (`notes/lean-main-experiment.md`, 2026-11-08):
- α 0.8 was added; the plan had α 1 and α 0.2 only.
- The plan's first step, 2 runs at α 1 to check that labs keep at least 15% of their lemmas, was skipped: all 30 runs started at once. The check would have passed (3 of 8 kept).
- 30 runs instead of 20, $18.57 instead of about $14.
- Not the same as 4c apart from the reward: flow-back is split by lines saved here (fixed 2026-11-08), by money spent in 4c; the prompt no longer says how it is split; the runs are a day later.

| α | Published at once (mean over runs) | Pooled lemmas | Predicted | Lemma attempts | Lemmas proved a run | Targets proved (of 8) |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 58% (7–100%), 6 runs with a lemma | 5 of 8 | 16% | 17 | 0.7 (0.2–1.2) | 4.1 (3.3–4.9) |
| 0.8 | 63% (31–94%) | 22 of 28 | 16% | 40 | 2.7 (1.4–4.1) | 4.6 (4.1–5.1) |
| 0.2 | 93% (84–100%) | 27 of 30 | 93% | 45 | 3.0 (1.6–4.4) | 4.8 (4.1–5.5) |

**The planned measure, α 0.2 minus α 1: +35 points (−18 to +87).** Pooling all lemmas instead: +28 points (−1 to +60). Both ranges include zero, so by the plan's rule flow-back did **not** clearly raise sharing.

α 0.2 minus α 1, also: lemmas +2.3 (+0.8 to +3.8), lemmas cited later +1.1 (+0.2 to +2.0), built on another lab +1.1 (+0.1 to +2.1), targets +0.7 (−0.3 to +1.7). B5 and A5: proved in no run.

**What it shows:**
- **Direction as predicted, not shown.** At α 0.2 the labs matched the prediction (93% against 93%). At α 1 and 0.8 they shared more than predicted, but the α 1 share rests on 8 lemmas.
- **Without the reward, labs mostly stopped proving lemmas:** 17 attempts at α 1 against 366 with the reward. They went for targets instead.
- **Flow-back still went with more groundwork:** about 4 times the lemmas at α 0.2 as at α 1 (lead).
- **Targets: fewer than with the reward** (4.1–4.8 against 6.1–6.7 in 4c), and no deep target proved.
- **Why labs kept lemmas** (all 12 kept lemmas read): mostly because keeping cost nothing ("if we keep it private and then prove C4 using it, it will be published automatically"); once because a rival might use it ("If we publish the lemma, others could use it to prove B3 faster").

**Caveats:** the number of lemmas depends on α, so the share is measured on different amounts of work. To measure sharing at α 1, labs need to prove more lemmas there: more runs, or more money a lab.

## 4i. Labs choose on the bigger set, knowledge reward off (2026-11-22 to 23)

[Result](../results/community/lean-big-1/summary.md). **Setups:** traditional (public when a target is proved, α 1, m 0, m_bit 0, f 0); the lab chooses when to publish with α 1 or α 0.2 (m 0, m_bit 0, f 0). 4 DeepSeek V4.1 Flash labs, $0.40 a lab ($1.60 a run), labs cannot stop early, 5 runs per setup, 15 in all, about $24 at the fixed reference price. 27 targets, depth 1 to 7. Streamed live on oso.network.

**Measure fixed in advance:** the share of lemmas published at once, α 0.2 against α 1. **Result:** 92% (95% range 85% to 98%) at α 1, 96% (93% to 99%) at α 0.2; difference +4 points (−3 to +12). No clear difference: labs shared nearly everything at both α.

**Targets proved, of 27** (mean, 95% range over 5 runs): traditional 20.0 (18.5 to 21.5), α 1 20.6 (19.5 to 21.7), α 0.2 21.2 (20.6 to 21.8). α 0.2 minus traditional +1.2 (−0.3 to +2.7); α 0.2 minus α 1 +0.6 (−0.5 to +1.7). Every run stalled at 20 to 21 targets; the deepest ones (X1, X6) were tried and failed to the end of the money.

**Looked at after the results (leads only):** results that built on another lab's work: 6.4 a run (traditional), 11.4 (α 1), 16.0 (α 0.2). Lemmas proved: 14.6, 14.0, 23.0. Targets proved again by a second lab: 11.0, 12.6, 19.2, so more building on others came with more repeated target work too.

## 4j. Deep set: Fermat's little theorem from scratch (one run, 2026-11-23 to 24)

[Result](../results/community/deep-fermat-1/summary.md). **Setup:** OSO α 0.2 (public at once, α 0.2, m 0, m_bit 0, f 0). 4 DeepSeek V4.1 Flash labs, $2 a lab, up to 100 rounds, labs cannot stop early. One run, no other setup: it shows what a community can reach, not whether OSO's rules help. The deep set has its own numbers built from zero (no Mathlib) and one posted target, P1, Fermat's little theorem, at depth 11; the 95 steps below it are hidden. Stand-in labs replaying the reference proofs reach P1 in round 27.

**Result:** P1 was proved in round 61, for $2.53 at the reference price (about a third of the $8; the run ends when the target is proved). The proof rests on 53 results, from all 4 labs. Labs proved 82 lemmas; 63 results built on another lab's work. Lean matched 50 of the 95 hidden steps to lab lemmas as stated (steps proved in another form or split over several lemmas are not counted).

**The bottleneck:** from round 25 the labs kept trying one step, (k+1)·C(n+1,k+1) = (n+1)·C(n,k), and failed 57 times (counting tries of this statement and its close variants). Lab 1 proved it in round 59. In round 60 lab 4 used it to show that a prime p divides C(p,k), and in round 61 it proved P1.

**Harness:** 245 of 568 replies (43%) ran out of length and gave no answer; 28 turns were lost to provider errors. The laptop slept during rounds 8 to 15, which only slowed the run. This run started before the payout ledger existed (2026-11-24), so its earnings cannot be audited.

## 4k. E1: reward, instruction or seeing earnings? (2026-11-24 to 25)

[Result](../results/community/lean-e1/summary.md). **Question:** under OSO, labs lay more groundwork. Is that the reward itself (value flowing back), the instruction to earn in every prompt, or seeing the earnings each round? **Setups** (all public at once, m 0, m_bit 0, f 0): shared library told only to prove targets, no rewards mentioned or shown (α 1); shared library told to earn (α 1, as in all earlier runs); OSO α 0.2 told to earn, earnings shown; OSO α 0.2 told to earn, earnings paid but not shown. Big set (27 targets), 4 DeepSeek V4.1 Flash labs, $0.40 a lab, up to 60 rounds, labs cannot stop. 5 runs per setup, 20 in all, started at once; $32.18 as charged. **Measure fixed before the run:** lemmas cited later (first proofs of non-trivial lemmas, not targets, that a later proof used), compared in three pairs.

**Result (5 runs per setup, mean a run with 95% range):**

| Setup | Lemmas cited later | All lemmas | Targets (of 27) | Replies cut off |
| --- | --- | --- | --- | --- |
| Shared, told to prove | 11.0 (7.5 to 14.5) | 19.0 | 21.4 | 18% |
| Shared, told to earn | 9.2 (5.2 to 13.2) | 12.2 | 21.0 | 34% |
| OSO α 0.2 | 13.0 (7.7 to 18.3) | 23.2 | 21.4 | 30% |
| OSO α 0.2, earnings hidden | 13.8 (11.8 to 15.8) | 23.8 | 21.8 | 27% |

**The three comparisons fixed in advance** (difference in lemmas cited later, Welch 95% range): reward (OSO − shared, both told to earn) **+3.8 (−1.9 to +9.5)**; instruction (told to earn − told to prove, both without reward) **−1.8 (−6.2 to +2.6)**; seeing earnings (shown − hidden) **−0.8 (−6.1 to +4.5)**. All three ranges include zero: **no effect shown on the measure fixed in advance**, at this size.

**Leads (all lemmas, not the measure fixed in advance):** the reward goes with about twice the lemmas (OSO − shared, told to earn: +11.0, range +5.5 to +16.5), and being told to earn with nothing to earn goes with fewer (told to earn − told to prove: −6.8, range −12.6 to −1.0). Seeing the earnings made no difference (−0.6, range −4.7 to +3.5). So the extra lemmas under OSO look like the reward, not the word "earn" and not the scoreboard; but many of the extra lemmas are not cited later, which is why the main measure moves less. Targets were the same everywhere (21 to 22 of 27: the set saturates). Replies cut off were fewer when labs were told to prove (18% against 27–34%), a lead to check.

**Harness:** every run was audited (payout ledger balances, spending equals the sum of action costs). Plan and comparisons were fixed on 2026-11-24 before any run started; the comparisons chart was added before any result was read.

## 4l. Deep set: traditional on Fermat's little theorem (one run, 2026-11-24 to 25)

[Result](../results/community/deep-fermat-trad-1/summary.md). **Setup:** traditional (public when a target is proved, α 1, m 0, m_bit 0, f 0), otherwise as section 4j: 4 DeepSeek V4.1 Flash labs, $2 a lab, up to 100 rounds, labs cannot stop. One run, on a different day from the OSO run: a first look, not a test (an exception to 5 runs per setup, by choice). With one target, nothing is public until P1 is proved, so each lab works alone.

**Result:** P1 was **not proved** in 100 rounds; the run spent $4.65. Labs proved 175 lemmas, 22 of them a second time (another lab had it privately), and no result built on another lab's work. 34 of the 95 hidden steps were reached (Lean, both matcher passes).

**Against the OSO run (section 4j), at the same money** (`scripts/deep-steps.ts`, $2 a run): traditional reached 27 hidden steps, deepest level 7; OSO reached 52, deepest level 8, and went on to prove P1 for $2.53. One run a side, different days: the direction is what sharing predicts, the size is not estimated. A shared-library run and fresh runs of both are going (deep-fermat-2).

**Harness:** 47% of this run's replies were cut off before an answer. (The OSO run predates logging of the stop reason, so its 43% in section 4j was counted from empty replies.)

## 4m. Deep set: traditional, shared library and OSO side by side (one run each, 2026-11-25)

[Result](../results/community/deep-fermat-2/summary.md). **Setups:** traditional (public when a target is proved · α 1 · m 0 · m_bit 0 · f 0), shared library (public at once · α 1 · m 0 · m_bit 0 · f 0), OSO (public at once · α 0.2 · m 0 · m_bit 0 · f 0). Otherwise as sections 4j and 4l: 4 DeepSeek V4.1 Flash labs, $2 a lab, up to 100 rounds, labs cannot stop. One run each, started together: a first look, not a test (by choice). In the two sharing setups every lemma is public at once by the rules, so labs did not choose to share.

**Result:** no setup proved P1 in 100 rounds.

| | Traditional | Shared library | OSO α 0.2 |
| --- | --- | --- | --- |
| Hidden steps reached by $2 a run (of 95) | 34 | 51 | 38 |
| Deepest level by $2 | 7 | 8 | 7 |
| Hidden steps reached by the end | 38 | 60 | 53 |
| Lemmas accepted | 190 | 119 | 86 |
| Built on another lab's work | 0 | 94 | 68 |
| Spent | $4.30 | $5.56 | $5.85 |
| Replies cut off | 41% | 57% | 60% |

**Why OSO fell behind the shared library here (looked at after the run):** Lean rejected about as many proofs in each setup (161, 180, 166); the gap is turns where every reply ran out of length with no answer (48, 91, 137; 21%, 32% and 46% of the money). In round 28 an OSO lab proved that Fermat follows from (1+a)^p ≡ 1 + a^p mod p. After round 33 every OSO turn opened on that last step (shared 57%, traditional 16%), which needs p | C(p,k), the bottleneck of section 4j; labs tried to plan the rest of the proof in one reply and ran out of length. OSO labs did not talk about earnings more (they mentioned credit less than shared labs). So sharing took OSO to the hard step sooner, and then all four labs stalled on it together; the shared library never had the shortcut and spread over more, smaller steps.

**Traditional proves the most lemmas and gets the least far,** as in section 4l: 27 of its lemmas re-prove a hidden step another lab had already proved privately (shared 1, OSO 0).

**With the earlier runs** (hidden steps by $2 a run; different days, not pooled): traditional 27 and 34, OSO 52 and 38, shared library 51. Sharing at once got further than traditional in all four pairs; whether flow-back adds anything over plain sharing is open.

## 4n. QR set: test run (one cheap run, 2026-11-25)

[Result](../results/community/qr-smoke-1/summary.md). A test of the new QR set before any paid comparison, not a result.

- **The QR set:** quadratic reciprocity, from scratch, on the deep set's own numbers. One posted target (Q1, depth 17). The hidden proof has 206 steps: 88 of the deep set's lemmas and 118 new ones (remainders, products, Wilson, Euler's criterion, Gauss's lemma, Eisenstein's count). Fermat: 95 steps, depth 11. The hidden proof and step map stay out of git until the QR runs end.
- **Setup:** OSO α 0.2 (public at once, α 0.2, m 0, m_bit 0, f 0), 4 DeepSeek V4.1 Flash labs, $0.25 each, 20 rounds, labs could not stop.
- **What happened:** the 20 rounds ran out first, at $0.18 spent. 80 turns: 62 lemmas accepted, 18 failed. 44 lemmas built on another lab's; 11 proved twice. **34 of the 206 hidden steps reached, the deepest at level 10.** Q1 not proved, as expected.
- **Checks:** the checker accepted the labs' proofs on the QR definitions; the step matcher found hidden steps; the live snapshot builds (206-step map, Q1 at depth 17). Not pushed to the Live page, since it is a test.

## 4o. Replay test: one small lemma a turn, and showing failures (2026-11-26)

Why: in the Fermat OSO run (4m), 46% of the money went on turns with no answer, mostly replies cut off while thinking. Run with `scripts/replay-turn.ts`, $3.20; data in the run folder (not in git, like all transcripts).

- **Design:** the OSO α 0.2 run of deep-fermat-2, rebuilt as it stood at rounds 40, 55 and 70. Each lab retakes its turn 30 times per round under each prompt (90 turns a prompt): *as run*; *small* (asks for one small lemma a turn); *small + failures* (also shows the last 20 failed tries and why). Lean checks every reply, as in a run.

| Prompt | Lemmas accepted a turn (95% range) | Turns with an answer | Replies cut off | Money | Lemmas per dollar |
| --- | --- | --- | --- | --- | --- |
| As run | 0.11 (0.05–0.18) | 49 of 90 | 186 of 267 (70%) | $1.48 | 7 |
| Small | 0.31 (0.22–0.41) | 84 of 90 | 99 of 247 (40%) | $1.06 | 26 |
| Small + failures | 0.36 (0.26–0.45) | 90 of 90 | 32 of 236 (14%) | $0.66 | 49 |

- **Differences, lemmas accepted a turn:** small − as run +0.20 (range +0.08 to +0.32); small + failures − as run +0.24 (+0.13 to +0.36); small + failures − small +0.04 (−0.09 to +0.18).
- **Reading:** both changes help clearly against the prompt as run, at lower cost. Showing failures adds little more in lemmas but halves the money a turn again. At round 70 (the hard last step) the gains shrink: 1, 5 and 7 lemmas accepted of 30.
- **Limits:** one run, three moments; turns at one moment share the same state, so the ranges are too narrow if anything. "Accepted" counts lemmas Lean passed, not hidden steps reached or targets proved. Small lemmas may also be easier and less useful.
- **Decision this informs:** turn on `smallSteps` and `showFailures` for the QR runs, for every setup alike.

## 4p. QR set: traditional, shared library and OSO side by side (one run each, 2026-11-26)

[Result](../results/community/qr-1/summary.md). The next step in difficulty after Fermat (4m): quadratic reciprocity from scratch, 206 hidden steps, 17 levels deep.

- **Setup:** traditional (public when a target is proved, α 1, m 0, m_bit 0, f 0), shared library (public at once, α 1, m 0, m_bit 0, f 0) and OSO (public at once, α 0.2, m 0, m_bit 0, f 0). 4 DeepSeek V4.1 Flash labs, $2 each, 100 rounds, labs could not stop. Prompt fix on for all (one small lemma a turn; the last 20 failed tries shown; section 4o). One run each, as agreed: a first look, no ranges.
- **Main measure, hidden steps reached (of 206):** traditional 56, shared library 69, OSO α 0.2 70. The budget was $2 a lab ($8 a run), but no run spent even $2 before the 100 rounds ran out, so these are counts at 100 rounds, not at equal money.
- **Deepest level:** 10 of 17 in all three. Q1 not proved in any.
- **Where they stopped:** most steps reached are the deep set's basics and the congruence stage (S1). A handful reach products (S2) and single pieces of Gauss's lemma and the parity facts (S4, S5); almost none of Wilson's theorem or Euler's criterion (S3).
- **Money:** $1.16, $1.24 and $1.02 spent of $8 a run; the 100 rounds ran out first. Cheap turns are the prompt fix at work (4o), so more rounds, not more money, would go further.
- **Work:** lemmas accepted 351, 306, 313; built on another lab's 0, 277, 265; proved twice 52, 32, 43.
- **Reading:** a lead to test, not a result: sharing got further than working alone (+13, +14 steps), as on Fermat, and OSO's flow-back added nothing on top of sharing (+1). Sharing was forced in both the shared library and OSO, so this run does not test whether flow-back makes labs *choose* to share; that is the labs-choose test (qr-choose-1). Fewer than 2 runs a side, so none of these gaps has a range.
- **Limits:** the prompt fix shows each lab recent failed tries, but traditional labs see only their own, while shared and OSO labs see everyone's. That fits each setup's rules, but part of the sharing gap may come from shared failures, not shared lemmas.
- **Next:** the same three setups with many more rounds (money was not the limit), and then 5 runs a setup if a gap remains.

## 4q. QR set: labs choose what to publish, α 1 vs α 0.2 (one run each, 2026-11-27)

[Result](../results/community/qr-choose-1/summary.md). Follows 4p, where sharing was forced: here each lab chooses, for every lemma, whether to publish it at once or keep it.

- **Setup:** labs choose (public at once only if the lab says so), knowledge reward off (nothing pays for publishing), α 1 against α 0.2, m 0, m_bit 0, f 0. 4 DeepSeek V4.1 Flash labs, $2 each, 300 rounds, labs could not stop. Prompt fix on (4o).
- **Main measure, share of lemmas published at once:** α 1 96% (36 of 1,021 kept back, 10 of those published later); α 0.2 100% (1 of 930). Difference +3 points (+4 in lean-big-1, range −3 to +12). Replies with no PUBLISH line left out: 11 and 24.
- **Hidden steps reached (of 206):** by $2 a run, α 1 78, α 0.2 76; by $6.70 a run, 94 and 81. Deepest level 10 of 17 in both; Q1 not proved.
- **Money:** $6.78 and $7.94 of $8 a run.
- **Reading:** labs share almost everything even when nothing rewards it and they keep all the credit. On these models sharing is the default, so flow-back has little left to change; lean-big-1 found the same on the main set. The step gap at $6.70 (+13 for α 1) cannot come from sharing, which was nearly equal; one run each, so it has no range.
- **Limits:** one run each. The labs are one model, trained to be helpful, told the rules; people or models that guard their work may act differently. The prompt names publishing as a choice, which may itself push toward yes.
- **Next:** testing whether flow-back makes labs share needs labs that sometimes keep work back, e.g. a cost to publishing or a reward for being first to a target.

## 4r. Replay test: library search (2026-11-27)

Why: on QR, shared and OSO labs read the whole library every turn (about 800 lemmas, 50,000 tokens by round 200) and think longer over it, so a turn cost about twice a traditional one. Run with `scripts/replay-turn.ts`, $0.27; data in the run folder (not in git).

- **Design:** the α 0.2 run of qr-choose-1 (930 lemmas), rebuilt at rounds 200 and 280; 10 turns a round under each prompt (20 a prompt). *As run* (small lemmas and failures shown, whole library); *search* (the same, but only the newest 60 lemmas shown; labs ask for others with `ACTION: search <words>`, matched in code, up to 3 a turn).

| Prompt | Cost a turn | Lemmas accepted | Replies cut off | Lemmas per dollar |
| --- | --- | --- | --- | --- |
| Whole library | $0.0093 | 15 of 20 | 11 of 35 | 81 |
| Newest 60 + search | $0.0043 | 12 of 20 | 1 of 90 | 140 |

- **Reading:** search halves the cost of a turn and nearly ends replies cut off; labs used it about 3 times a turn. Lemmas accepted a turn may be a little lower (0.60 against 0.75); 20 turns a prompt is too few to say.
- **Limits:** one run, two moments, 20 turns a prompt: no ranges. Word matching only.
- **Decision this informs:** from 2026-11-27 every setup shows the newest 60 lemmas it can see and has search (`--library-search 60`, the default), so a turn's prompt is about the same size in every setup.

## 5. Is the test setup sound? (harness checks)

| Check | Result |
| --- | --- |
| [Proof checker stress test](../results/bench/stress/summary.md) | 32 of 32 cases right; one cheat found and closed (faking Lean's report on which axioms a proof uses) |
| Fault tests | server errors, stuck models, no credit, missing costs, the budget limit and replies cut off partway are all handled (9 tests) |
| [Public benchmark](../results/bench/or-gptoss120b-50x4/summary.md) (FormalMATH-Lite, 50 problems, GPT-OSS-120B) | 12 of 50 with one try, 17 with any of 4, for $0.10; **no proof lost by our harness**; 2 benchmark statements look broken |
| Books balance (`node scripts/audit-runs.ts`, 2026-11-24) | 327 of 336 saved runs: each lab's spending equals its actions' costs. The 9 others are races of Oct 20–21, from before failed turns were logged (Nov 7): money spent on turns that hit "out of credit" has no action. Labs spent 0.9% beyond their budgets in all (the call that crosses a budget is allowed to finish). From Nov 24 every payout is in a ledger and each run audits itself. |

Faults found and fixed on the way: wrong error labels, proofs without a code block, planner lines dropped, dotted lemma names, replies cut off partway, and runs spoiled by the laptop sleeping. Budgets count the actual charge since 2026-10-21.

### Replies that gave no answer

Each model reply may use up to 32,000 tokens, including its thinking. In the four main experiments 5,646 of 24,902 replies (23%) used all of them and gave no text at all. Each cost about $0.0066, so about $37 of the $94.63 spent. All setups are affected: 27% of replies in the shared library, 25% traditional, 22–23% OSO, 16–18% Labs choose. Costs on this page include this waste.

A further 22% of replies (5,385) had text that never reached Lean, mostly because of its format. From 2026-11-08 these are read more tolerantly, and the prompt shows an example; the same checks still apply. Read again by the new code, 3,517 of those saved replies would now reach Lean; whether they would pass is not known. Runs after that date are not directly comparable with earlier ones on cost.

**Does effort change it? (pilot, 2026-11-08; 24 attempts at each effort, H4, H5, H6, alone and with lemmas.)** No clear change between high and medium. The community runs above were all at medium, so the empty replies happen there too. Replies stopped by the length limit: 50 of 69 at medium effort, 54 of 69 at high. Cost: $0.60 and $0.62. With lemmas: 12 of 12 proved at medium, 11 of 12 at high. Alone, every reply at both efforts hit the limit (48 of 48) and nothing was proved: the model keeps thinking when it is stuck. Too small to show a difference in quality.

**Would a lower limit fix it?** From saved single-reply turns (1,203, all at medium effort, the setting of every community run so far), not a new test: replies that gave an answer used a median of 14,875 tokens, and a limit of 16,000 would have cut 41% of those Lean accepted. So a lower limit would cost proofs.

**Is retrying after an empty reply worth it?** When the first reply was empty, 29% of turns still ended in an accepted proof (717 of 2,483). When the first empty reply came second, 4% did (57 of 1,269); third, none (0 of 387).

**Can a setting stop it? (test, 2026-11-24; 24 attempts each, H4, H5, H6, alone and with lemmas, DeepSeek V4.1 Flash.)** No: three settings, the same waste. Replies cut off with no answer: medium effort 50 of 70 (71%, range 60–81%); medium effort with thinking capped at 20,000 tokens 51 of 72 (71%, 59–80%); low effort 49 of 65 (75%, 64–84%). Proved: 11, 9 and 12 of 24. Cost: $0.70, $0.72, $0.65. The cut-offs are the attempts without lemmas: in all three, every one of those used up its turns and proved nothing, while with lemmas the model mostly answered. The cap was sent, but replies still ran to the 32,000-token limit, so it seems not to be honoured on long replies; not checked further. Results: [medium](../results/pilot/waste-medium/summary.md), [capped](../results/pilot/waste-think20k/summary.md), [low](../results/pilot/waste-low/summary.md).

## 6. What is still open

1. **Does flow-back make labs choose to share?** Labs choose found no answer: labs published nearly everything at every α, to collect the new-result reward. Next: the same setups with that reward off, α 1 against α 0.2, so keeping costs nothing at α 1.
2. **Does flow-back open hard targets?** B5 keeps coming up at low α (Spend all, Labs choose), but the fair-prompt check gave a much smaller gap. Next: B5 as the measure fixed in advance.
3. **Does flow-back keep labs working?** May quit: no clear change at α 0.2, about 2 rounds longer at α 0.8 (+0.6 to +3.6); labs stopped after 5 to 8 rounds in every setup. 10 runs each.
4. **More groundwork, same targets:** flow-back raised lemmas in Spend all, the fair-prompt check and May quit, but not in Labs choose (where publishing paid at every α), and not targets proved. Lemmas a later proof cites are the better measure. Whether the extra groundwork pays off on harder problems is open (roadmap M4b, M5).
5. **One model, one small problem set (42 theorems).** Results may not carry over to other models or harder mathematics.
