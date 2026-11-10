# Flow-back: what it does so far

2026-11-09. Everything we have measured about flow-back, in the simulation and in the AI runs on Lean problems. **Finding** means a measure fixed in advance; **lead** means it was noticed afterwards or comes from a small run. Setups are named by their [OSO parameters](lean-experiment.md#the-setups).

## In short

- **Flow-back is OSO's α:** when a result earns (a target's bounty), its author keeps α, and the rest flows back to the results its proof used, and on down. α 1 means nothing flows back.
- **It is meant to do three things:** make labs share, make labs do groundwork, and, once money follows earnings, send money to the labs whose work others use.
- **In the AI runs so far, it does one of them:** labs do more groundwork. They prove more lemmas, and more of them are used by later proofs.
- **The labs work out why:** with flow-back, they reason that a lemma earns when another lab uses it. Without it, they reason that a lemma earns nothing and may hand a rival the bounty.
- **They respond to whether value flows back, much less to how much.** α 0.8 and α 0.2 look alike in the labs' thinking, and mostly in what they do.
- **The extra groundwork has not turned into more targets or lower cost,** in any experiment.
- **The other two effects are untested:** every AI run either forced sharing or paid for publishing anyway, and every lab had a fixed budget.

## What flow-back should do

| Effect | Why it should happen | Simulation | AI runs on Lean |
| --- | --- | --- | --- |
| 1. Labs share | Under α 1, publishing a step helps rivals to the next bounty and earns nothing. With flow-back it earns when they use it | **Finding:** agents shared 24% of ideas at α 1, 66% at α 0.2 | **Not shown.** The rules forced sharing, or (Labs choose) publishing was paid at every α, so labs published 99–100% everywhere |
| 2. Labs do groundwork | A lemma earns only through flow-back, so more of it raises what a lemma is worth against a target | Yes | **Yes, the steadiest effect** (below) |
| 3. Money goes to useful labs | When money follows earnings (f > 0), labs whose work is used get more money and do more | **Lead:** once money follows earnings, the best α drops to 0.2 | **Not tested:** f = 0 in every run |

## The effect we see: more groundwork

Lemmas proved per run (first proofs, trivial lemmas left out), means with 95% ranges where we have them. "Cited" counts the lemmas that a later proof used.

| Experiment | Traditional | Shared library (α 1) | OSO α 0.8 | OSO α 0.2 | OSO α 0.2 minus shared |
| --- | --- | --- | --- | --- | --- |
| Spend all, 20 runs a setup | 7.2 | 7.2 | 10.7 | 13.8 | lemmas cited: +4.1 (+1.6 to +6.5) |
| Fair-prompt check, 10 | not run | 8.5 | not run | 17.2 | +8.7 (+3.4 to +14.0); cited +5.1 (+1.0 to +9.2) |
| May quit, 10 | 1.0 | 0.3 | 3.7 | 2.5 | +2.2 (+1.4 to +3.0); cited +1.1 (+0.6 to +1.6) |
| Labs choose (publishing paid), 10 | not run | 19.6 (α 1) | 19.6 | 20.4 | +0.8; cited +1.7 (−3.0 to +6.4) |
| Harder targets, 5 | 20.0 | 21.8 | not run | 26.4 | +4.6 (+0.2 to +9.0); cited +3.8 (−2.3 to +9.9) |

- **With flow-back, labs proved more lemmas in every experiment where only flow-back paid for them.** The gap is largest when money is tight against the work (Fair-prompt check, about twice) and smallest on the harder targets, where every setup needed many lemmas anyway.
- **Labs choose is the exception, and it fits:** there a new result earned up to 4 when published, at every α. Once a lemma pays for certain, flow-back adds little.
- **Flow-back also went with building on each other more** (results whose proof used another lab's work: Spend all 2.2 → 5.8 a run, Fair-prompt check 3.1 → 7.0).
- **A certain payment does more than flow-back.** On the harder targets, paying 1 for each new lemma (pay per lemma: α 1, m 1) raised lemmas from 21.8 to 63.0 a run (+41.2, range +5.5 to +76.9), against +4.6 for flow-back. Many of those were never cited.

## Why: what the labs say

On turns with saved thinking (118 runs; `scripts/lean-flowback.py`), we counted how often the lab thinks about what a result gets when another lab uses it.

| Experiment | Setup | Lemma turns: thinks about others using it | Target turns: same |
| --- | --- | --- | --- |
| Fair-prompt check | OSO α 0.2 | 69% of 160 | 39% of 214 |
| | Shared library | 33% of 107 | 19% of 225 |
| May quit | OSO α 0.8 | 72% of 58 | 39% of 244 |
| | OSO α 0.2 | 74% of 46 | 47% of 195 |
| | Shared library | 0% of 6 | 12% of 208 |
| | Traditional | 0% of 13 | 3% of 194 |
| Labs choose | α 1 | 28% of 366 | 13% of 328 |
| | α 0.8 | 60% of 350 | 26% of 326 |
| | α 0.2 | 66% of 401 | 31% of 290 |
| Harder targets | OSO α 0.2 | 66% of 253 | 32% of 301 |
| | Shared library | 31% of 230 | 13% of 406 |
| | Pay per lemma | 13% of 441 | 7% of 318 |
| | Traditional | 11% of 165 | 2% of 293 |

**The count does not show which way they reason,** so we read 20 matching sentences from each of OSO α 0.2 and the shared library by hand (harder targets and Fair-prompt check):

| | Says a lemma earns when others use it | Says it earns nothing, or helps a rival win | Unclear |
| --- | --- | --- | --- |
| OSO α 0.2 | 18 | 1 | 1 |
| Shared library | 0 | 16 | 4 |

Typical sentences:
- OSO: "If another lab proves A5 citing our lemma, A5 value flows 80% to used results, ours gets share."
- OSO: "A small lemma likely compiles, but earnings only if someone uses it."
- Shared library: "If we prove `msort_sorted`, other labs may use it to solve B5/H5 and earn bounty, not us."
- Shared library: "I'm lab 4 of 4; if I publish a useful lemma, another lab could use it for A5 and take bounty."

**What this shows:**
- **The payoff reason is real, not only the wording.** Labs do the sum: under flow-back, groundwork can pay; without it, groundwork can cost them a bounty. That is the mechanism OSO expects.
- **Without flow-back, sharing works against groundwork.** In the shared library, labs see their lemmas as gifts to rivals. Under traditional rules lemmas stay private, so the question rarely comes up (2–11%).
- **Thinking about it is not choosing it.** About a third of OSO target turns also weigh flow-back and then go for the target anyway.

## How much flow-back: the size of α matters little

If labs weighed the payoff, α 0.2 (80% flows back) should pull them towards groundwork much harder than α 0.8 (20% flows back). The two OSO settings use the same wording, with only the number changed.

- **In their thinking, about the same:** 72% and 74% of lemma turns (May quit), 60% and 66% (Labs choose).
- **In what they did, mixed:** α 0.2 proved more lemmas than α 0.8 in Spend all (13.8 against 10.7), fewer in May quit (2.5 against 3.7), and about the same in Labs choose (20.4 against 19.6).

**Lead:** labs respond to *whether* value flows back far more than to *how much*. That fits labs that reason in words ("it earns if used") more than in expected amounts. It also means the prompt's rule line could carry much of the effect, which we cannot separate from the payoff yet.

## What flow-back has not done

- **More targets:** no clear difference in any experiment. Spend all: OSO α 0.2 minus shared library +0.4 targets (−0.1 to +0.9). May quit: +0.0 (−0.8 to +0.8). Fair-prompt check: +0.5 (−0.4 to +1.4).
- **Lower cost:** on the harder targets, the shared library reached 7 of 11 targets for $0.509 (median), OSO α 0.2 for $0.727. Five runs each, so no ranges.
- **Lead, not held:** OSO α 0.2 reached 5 of 8 targets cheapest in all four earlier experiments, and proved the deepest target (B5) more often in Spend all (11 of 20 against 0 of 20). Neither held up in later runs.

**Why more groundwork may not mean more targets:** about half of all lemmas are never cited, and labs that can share already build on each other without flow-back. Extra lemmas help only when a target is blocked for lack of them.

## What would show flow-back's main value

1. **Labs choose, with nothing paid for publishing.** Keeping a lemma then has a real benefit at α 1, so flow-back can raise sharing. This is the simulation's main finding and has not been tested with AI labs. About $18.
2. **Money follows earnings (f > 0).** Labs whose work is used get more money. Built (`--follow`), not run.
3. **Payoff or wording:** the same rule text at α 0.9, 0.5 and 0.2. If groundwork follows α, it is the payoff. If it is the same whenever flow-back is mentioned, it is the wording.

## How this was measured

- Lemma counts and ranges: `scripts/lean-estimates.py`, from the saved runs. Numbers for each experiment: [AI agents on the Lean problems](ai-agent-results.md).
- Thinking: `scripts/lean-flowback.py`. A rough keyword count over sentences: a sentence counts if another lab uses a result and earning, value or flow-back comes up. It does not tell which way the lab reasons, so the direction comes from the 40 sentences read by hand (`--sample` prints them). Thinking was saved only in runs since the Fair-prompt check (its runs 6–10), so Spend all has none.
- Labs choose paid for publishing, and the harder targets had 5 runs a setup: both are weaker tests of flow-back than the others.
