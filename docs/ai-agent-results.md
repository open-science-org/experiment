# AI agents on the Lean problems: results so far

Last updated: 2026-11-08. Every result here has its own page under `results/` (the links), with its design, caveats and logs. This page only gathers them.

**In short:** with help (lemmas), weak models prove targets they cannot prove alone. In five paired races with one cheap model, OSO reached 2 hard targets in every run and for about half the money; traditional reached them in 3 of 5. In the main experiment (part B, 20 runs per setup), OSO did **not** prove clearly more targets than a plain shared library. But it changed how labs worked: with more value flowing back, labs proved more lemmas and built on each other more, and that opened a hard target (B5) that the shared library never proved. That last finding is exploratory and needs a test fixed in advance. The test setup itself checks out.

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
| Work done twice | 20.4 | 2.4 |
| Used another lab's result | 0 | 6.4 |

Money to reach 2 counted targets, run by run (OSO / traditional): $0.25 / never, $0.11 / never, $0.07 / $0.18, $0.13 / $0.26, $0.11 / $0.28. OSO was cheaper in every run. The spend measure was chosen after the run (exploratory); budgets were at list prices, and OpenRouter charged about 5.6× more on both sides.

**What it means:** OSO's lead comes from what the simulation predicts: sharing at once stops labs proving the same lemma again (20 against 2 repeats), and labs build on each other's results. But OSO here was also sharing, so this race cannot say how much is due to flow-back.

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

## 4. The main experiment, part B (2026-11-08)

**Question, fixed in advance** (the design is in the local notes, `notes/lean-main-experiment.md`): at the same money **spent**, does a community prove more when value flows back (OSO) than when results are only shared (a shared library)? 4 DeepSeek V4.1 Flash labs, $0.15 each; labs could not stop early, so every run spent its money (about $0.61); 20 runs per setup; knowledge reward off; bounties 4 · 2^(depth − 1). Results: [lean-main-b](../results/community/lean-main-b/summary.md). Traditional (20 runs) was added afterwards as a reference and is still running.

### The answer: no clear difference

Targets proved by the end, of 8 (the measure fixed in advance):

| Setup | Mean | Spread | Against the shared library |
| --- | --- | --- | --- |
| Shared library (α 1) | 5.85 | 4–7 | |
| OSO, α 0.8 | 5.80 | 4–8 | −0.05 (not clear) |
| OSO, α 0.2 | 6.25 | 5–8 | +0.40 (not clear: 1.6 standard errors; clear needs 2) |

By the rule fixed in advance, neither OSO setting is clearly ahead of the shared library. Runs varied less than in the pilot (about ±0.8 targets against ±1.4), so the test was sharper than planned.

### What changed: which targets, and how labs worked (exploratory)

Looked for after seeing the results, so these are leads, not findings.

**Which targets** (runs out of 20 that proved each):

| Setup | B5, merge sort = insertion sort (depth 5, bounty 64, 5 lemmas in our proof) | X1, Cassini's identity (depth 3, bounty 16, 2 lemmas) | The other six |
| --- | --- | --- | --- |
| Shared library | **0** | 17 | about the same in every setup: C3, A3, C4, B3, X2 nearly always; A5 almost never |
| OSO, α 0.8 | **5** | 10 | |
| OSO, α 0.2 | **11** | 13 | |

**How labs worked** (per run):

| Setup | Lemmas proved | Results built on another lab's work | Lemmas proved twice |
| --- | --- | --- | --- |
| Shared library | 7.2 | 2.6 | 3.7 |
| OSO, α 0.8 | 10.7 | 4.3 | 3.1 |
| OSO, α 0.2 | 13.8 | 6.6 | 3.0 |

**What it suggests:** flow-back changes what labs do. The more value flows back (lower α), the more groundwork labs do and the more they build on each other's. That groundwork opens a hard target that needs many lemmas (B5). It costs some quicker wins on a target that needs few (X1). The measure fixed in advance counts every target the same, so the shift barely moves the total. This is the behaviour OSO is meant to cause, seen in real AI agents for the first time. It still needs a test fixed in advance.

**How to confirm it:** in part A, fix in advance a measure that counts hard targets more: bounty won (B5 is worth 64, X1 16), or whether the hard targets (B5, X2, A5) are proved.

**Also:** "money to reach 3 targets" was too easy; every run got there for $0.04–0.05.

## 5. Is the test setup sound? (harness checks)

| Check | Result |
| --- | --- |
| [Proof checker stress test](../results/bench/stress/summary.md) | 32 of 32 cases right; one cheat found and closed (faking Lean's report on which axioms a proof uses) |
| Fault tests | server errors, stuck models, no credit, missing costs, the budget limit and replies cut off partway are all handled (9 tests) |
| [Public benchmark](../results/bench/or-gptoss120b-50x4/summary.md) (FormalMATH-Lite, 50 problems, GPT-OSS-120B) | 13 of 50 with one try, 17 with any of 4, for $0.15; **no proof lost by our harness**; 2 benchmark statements look broken |

Faults found and fixed on the way: wrong error labels, proofs without a code block, planner lines dropped, dotted lemma names, replies cut off partway, and runs spoiled by the laptop sleeping. Budgets count the actual charge since 2026-10-21.

## 6. What is still open

1. **Does flow-back open hard targets?** Part B's lead (B5: 0, 5 and 11 runs of 20), tested with a measure fixed in advance that counts hard targets more (part A).
2. **Does flow-back keep labs working?** Part A, where labs may stop early.
3. **The knowledge reward in Lean:** off for now; how to measure it later is in [design.md](design.md#the-knowledge-reward-in-lean).
4. **Agents choosing what to publish:** in every test so far the rules set sharing. In the simulation, flow-back matters most when agents choose.
5. **One model, one small problem set (42 theorems).** Results may not carry over to other models or harder mathematics.
