# The Lean experiment: design

The AI-agent half of the project: real AI models prove theorems in Lean, under traditional or OSO rules. This page is the design: what is asked, of whom, under which rules, and why. In the app, the **Lean experiment** page shows all of it from the runs themselves: the problems, each setup's settings, the exact prompts, and every turn of every run. Results: [AI agents on the Lean problems](ai-agent-results.md).

Last updated: 2026-11-07.

## The question

**For the same money, does a community of AI agents prove more when value flows back to the results a proof used (OSO) than when results are only shared (a shared library), or kept private until a target is proved (traditional)?**

The earlier races compared OSO with traditional, but OSO also shared everything, so they could not tell sharing and flow-back apart. The shared library is the setup that separates them: it shares like OSO but nothing flows back.

## The problems

Three small areas, defined from scratch in Lean 4 with only Lean's core library (no Mathlib), so the agents cannot look the results up in a library:

| Area | What it is | Shape |
| --- | --- | --- |
| **A** | a number sequence: u(0) = 0, u(1) = 1, u(n+2) = 5·u(n+1) + 3·u(n) | one long chain of lemmas |
| **B** | insertion sort and merge sort on lists of numbers | wide: many separate lemmas that meet at the end |
| **C** | 2×2 integer matrices: product, determinant, powers | shallow |

The areas differ in shape on purpose, as real fields do. Two targets join areas, so work in one area pays off in another.

### The 8 targets

Each agent sees these, with their bounties. The bounty is 4 · 2^(depth − 1).

| Target | What it says | Area | Depth | Bounty |
| --- | --- | --- | --- | --- |
| C3 · det_mul | the determinant of a product is the product of the determinants | C | 1 | 4 |
| A3 · u_dvd_mul | u(m) divides u(m·k) | A | 2 | 8 |
| C4 · pow_mul | x^(m·n) = (x^m)^n for matrices | C | 3 | 16 |
| X1 · cassini | Cassini's identity: u(n+1)² − u(n+2)·u(n) = (−3)ⁿ, proved through matrix powers | A + C | 3 | 16 |
| B3 · isort_sorted | insertion sort's output is sorted | B | 4 | 32 |
| B5 · msort_eq_isort | merge sort and insertion sort give the same list | B | 5 | 64 |
| X2 · isort_u | sorting the first n terms of the sequence changes nothing | A + B | 5 | 64 |
| A5 · u_gcd | gcd(u(m), u(n)) = u(gcd(m, n)) | A | 7 | 256 |

### How the targets were chosen

- **Depth is measured, not set.** We first proved every target ourselves, through 42 theorems in all. A target's depth is how many levels of lemmas that proof needed. It is one route; agents may find shorter ones.
- **A range of difficulty:** C3 is the easy floor (every setup proves it); A5 is almost never proved. The middle targets are where setups can differ.
- **Targets must need their lemmas.** In the [model panel](../results/pilot/panel-2026-10-19/summary.md), DeepSeek V4.1 Flash proved 4 of 16 targets alone and 12 of 16 when given the lemmas, so the deep targets really need groundwork.
- **Tools shaped the choice.** Lean's `grind` tactic proved the matrix facts in one step, which left area C with no depth. So `grind` is banned, and C's targets need induction.

More: [the problem set](../lean/README.md) and [its notes](../lean/NOTES.md).

### What agents see and may use

- **They see:** the definitions, the 8 targets with bounties and who has proved them, and every published result.
- **They do not see:** our own proofs or the tree of 42 theorems. Finding the lemmas is the work. Our proofs stay private so models trained later cannot memorize them.
- **They may cite** Lean's core lemmas and tactics freely (the "existing literature").
- **They may not use:** `grind`, `sorry`, `native_decide`, search tactics, or commands that run code.
- **Lean checks every proof**, and records exactly which earlier results it used. That record is what value flows back along.

## The agents

Four labs, all **DeepSeek V4.1 Flash** (through OpenRouter), with no personas. Each turn, a lab tries one thing (a target or a lemma of its own), and may repair its proof twice after seeing Lean's errors.

**Why this model.** A lab model must keep working and gain from lemmas, or there is nothing for the rules to change.

| Model | Keeps working as a lab | Gains from lemmas |
| --- | --- | --- |
| DeepSeek V4.1 Flash | yes | yes: 4 of 16 alone, 12 with lemmas |
| GPT-OSS-120B (cheaper) | no: all four labs gave up in round 1 | a little: 2 of 16 alone, 7 with lemmas |
| Claude Opus / Sonnet 5.5 | not tried | no: 16 of 16 alone, nothing left to gain |

## The setups

Only the rules differ between setups.

| Setup | Others see a result | Value flowing back |
| --- | --- | --- |
| **Traditional** | when its author proves a target (then the target and its lemmas are published) | none: the prover keeps the whole bounty |
| **Shared library** | at once | none: the prover keeps the whole bounty |
| **OSO, α 0.8** | at once | a result keeps 80% of what reaches it; 20% flows back to the results it used |
| **OSO, α 0.2** | at once | a result keeps 20%; 80% flows back |

Value flowing back is split among the results a proof used by how much each cost to prove, and keeps flowing down the tree. α 0.2 is always included, as a low α.

The pilot also tried single agent, independent labs and a planner; they did not bear on the question and were left out.

## Rewards

- **Bounties only.** A target's bounty goes to its prover and, under OSO, flows back by α.
- **The knowledge reward is off:** a new result earns nothing for itself. Why, and how it could be measured later: [design.md](design.md#the-knowledge-reward-in-lean).
- Agents are told their aim is to earn as much as they can within their budget, and see their earnings each round.

## The prompts

Every lab gets the same instructions: what Lean version and rules apply, the definitions, how to answer, plus a few lines stating the setup's rules. Each turn it also sees its earnings, budget left, the targets and their status, and the published results.

The exact text is on the app's Lean experiment page (Prompts tab), with the lines that differ between setups side by side. Runs from 2026-11-07 on save the prompts they sent.

**Known problem:** the setups' prompts differ by more than the rules. The shared library's has an extra line, "Other results earn nothing by themselves", and the OSO prompts explain flow-back at length. Part of any difference could come from the wording. Fix planned: one template for all setups, and a check with OSO's wording but shared-library payment.

## Run settings

| | Part B | Part A (planned) |
| --- | --- | --- |
| Money per lab | $0.15, as charged | $0.15 |
| Rounds, at most | 60 (money, not rounds, ends a run) | 30 |
| May a lab stop early? | no: a pass only skips that turn | yes: a pass ends its turns |
| Compared at | the same money **spent** | the same money **offered** |
| Setups | all four | all four |
| Runs per setup | 20 | 16 |
| Repairs per action | 2 | 2 |

All setups in a batch run together, so a change at the model provider hits them alike. A run with a harness fault is rerun; runs are never dropped for their results.

## Measures and comparisons, fixed in advance

- **Main measure:** targets proved (of 8) by the end of a run.
- **Main comparisons:** OSO α 0.2 against the shared library; OSO α 0.8 against the shared library. Against traditional: secondary.
- **Clear** means more than 2 standard errors from zero. Runs are not paired.
- **Also reported:** money spent, lemmas proved, results built on another lab's work, work done twice, and which targets were proved.
- **Power:** with 20 runs per setup, a real lead of 1 target shows as clear about 60% of the time; 80% needs about 32 runs.

## Where it stands

- **Part B** (20 runs per setup, run 2026-11-07): no clear difference on the main measure. Looked for afterwards: OSO α 0.2 proved B5 in 11 of 20 runs, the shared library in 0. Details: [results](ai-agent-results.md).
- **Next:** fix the prompts, then a run fixed in advance to test the B5 lead, then part A.
- **Limits:** one model, one small problem set, and the rules (not the agents) decide what is published.
