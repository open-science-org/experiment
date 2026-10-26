# The Lean problem set: OSO vs. traditional research

> The shape of the OSO Lean problem set; 42 theorems in three areas, 8 posted targets.

**For the same money, the OSO community got further, or got there more cheaply, than the traditional one.**

- **How far:** with a budget of 400, OSO reached level **7.0** of 7 on average; traditional research reached **5.2**.
- **Targets solved:** OSO solved **8.0** of 8; traditional solved **6.1**.
- **Cost to reach level 5:** OSO 116; traditional 269 (in the 71% of runs that got there).
- **Return on the money (ROI):** OSO gained **2.22** in bounty value per unit spent (460 for 219); traditional **0.65** (222 for 374). Value gained is the bounties of the targets solved.
- **Does flow-back make agents share?** When agents choose, sharing rises clearly (by 0.2 or more) once α is 0.6 or lower. At OSO's default α = 0.8, agents shared 43% of their intermediate ideas.
- **Robustness:** OSO's lead in level is smallest when shared knowledge is **costly to take up** (+1.2 levels).
- **Sensitivity:** Across the tested values of the parameters a market or community sets, OSO's lead (agents choosing what to share) runs from **+0.2** to **+2.0** levels. The smallest lead, at f, earnings shape next round's money = 100%, is still clearly positive. The lead is most sensitive to **mint per idea**.

*The verdict compares the hardest level reached, the targets solved and (when both communities reach level 5 in at least 90% of runs) the cost to get there, each against two standard errors. 100 simulated runs per setting · simulator commit `dc540e2` · 2026-10-26. This is a simulation with guessed parameters, not evidence about real research; see [What this shows](#what-this-shows-and-what-it-does-not).*

## 1. The problem space

The reference tree of the Lean problem set: a number sequence (area A), sorting (area B) and 2 × 2 integer matrices (area C), plus ideas that join areas. Each idea is a theorem; a theorem can be attempted once the theorems its proof uses are known. The eight posted targets carry bounties that double with level. Area A is a long chain, area B is wide, and area C is shallow. Success chances follow the default model by level until the Lean pilot measures them.

| In this space | means |
| --- | --- |
| an idea | a theorem, with its proof |
| a target | a posted theorem with a bounty |
| an attempt | one attempt at writing a proof that Lean accepts |
| an area | a mathematical topic |

![The research tree](figures/world.svg)

The tree has 42 ideas in 7 levels and 4 areas (A sequence, B sorting, C matrices, across areas). 6 are dead ends: no target depends on them. 8 are targets:

| target | level | bounty | ideas it rests on |
| --- | --- | --- | --- |
| C3 | 1 | 4 | 0 |
| A3 | 2 | 8 | 1 |
| C4 | 3 | 16 | 3 |
| X1 | 3 | 16 | 4 |
| B3 | 4 | 32 | 4 |
| B5 | 5 | 64 | 14 |
| X2 | 5 | 64 | 11 |
| A5 | 7 | 256 | 7 |

How hard each level is, before an agent's skill:

| level | ideas | targets | success chance per attempt |
| --- | --- | --- | --- |
| 1 | 20 | 1 | 50% |
| 2 | 9 | 1 | 30% |
| 3 | 6 | 2 | 18% |
| 4 | 2 | 1 | 11% |
| 5 | 3 | 2 | 6% |
| 6 | 1 | 0 | 4% |
| 7 | 1 | 1 | 2% |

The community has 12 agents (3 foundation, 3 racer, 2 explorer, 2 specialist, 1 freeRider, 1 gamer) and a budget of 400 over 40 rounds.

## 2. Progress for the money

![Hardest level published by money spent](figures/frontier.svg)

Each line is the mean, over 100 runs, of the hardest level the community had published after spending that much money. A line that ends early means every target was solved and the funder stopped paying.

## 3. The six settings

The rules are the only difference between rows ([the design](../../docs/design.md#the-rules-compared)). Traditional: nothing flows back to what an idea built on, and work is published only when finished. OSO: value flows back (α = 0.8, c = 0.15), and ideas are published at once or when the agent chooses.

| setting | frontier | reach L5 | speed | cost | spend | targets solved | waste | credit | sharing | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 5.2 ± 1.5 | 0.71 | 27 ± 7 | 269 ± 70 | 374 ± 44 | 6.1 ± 1.7 | 0.61 ± 0.08 | 0.98 ± 0.05 | 0.01 ± 0.02 | 0.65 ± 0.56 |
| OSO (immediate) | 7.0 ± 0.0 | 1.00 | 12 ± 3 | 116 ± 31 | 219 ± 53 | 8.0 ± 0.0 | 0.17 ± 0.04 | 0.72 ± 0.06 | 1.00 ± 0.00 | 2.22 ± 0.56 |
| Flow-back, finished-only | 5.7 ± 1.3 | 0.82 | 25 ± 7 | 248 ± 68 | 358 ± 57 | 6.5 ± 1.6 | 0.59 ± 0.08 | 0.99 ± 0.03 | 0.01 ± 0.02 | 0.87 ± 0.63 |
| No flow-back, immediate | 7.0 ± 0.1 | 1.00 | 12 ± 3 | 112 ± 34 | 219 ± 60 | 8.0 ± 0.1 | 0.17 ± 0.04 | 0.63 ± 0.10 | 1.00 ± 0.00 | 2.24 ± 0.60 |
| No flow-back, choice | 5.5 ± 1.3 | 0.79 | 28 ± 8 | 271 ± 78 | 363 ± 60 | 6.6 ± 1.3 | 0.59 ± 0.08 | 0.87 ± 0.11 | 0.36 ± 0.05 | 0.81 ± 0.67 |
| OSO (choice) | 5.7 ± 1.2 | 0.87 | 27 ± 6 | 262 ± 64 | 361 ± 60 | 6.9 ± 1.1 | 0.58 ± 0.08 | 0.85 ± 0.08 | 0.43 ± 0.06 | 0.87 ± 0.63 |

Values are mean ± standard deviation over runs. *frontier*: hardest level published; *reach L5*: share of runs reaching level 5; *speed*, *cost*: rounds and money to reach it; *credit*: how closely bounty pay matches true contribution; *sharing*: share of intermediate ideas published as soon as they were proved.

## 4. Does flow-back make agents share?

![Sharing and reach by α](figures/alpha.svg)

| α | intermediate ideas shared | frontier | reach level 5 | targets solved |
| --- | --- | --- | --- | --- |
| 1 | 36% | 5.5 | 79% | 6.6 |
| 0.8 | 43% | 5.7 | 87% | 6.9 |
| 0.6 | 59% | 6.3 | 99% | 7.4 |
| 0.5 | 70% | 6.6 | 99% | 7.7 |
| 0.4 | 80% | 6.9 | 99% | 7.9 |
| 0.3 | 86% | 7.0 | 100% | 8.0 |
| 0.2 | 91% | 7.0 | 100% | 8.0 |
| 0.1 | 93% | 7.0 | 100% | 8.0 |

Sharing rises clearly once α is 0.6 or lower: this is the threshold α* in this space. The threshold depends on the scoop risk ψ = 0.5, which is a guess.

## 5. When sharing is costly or sometimes wrong

Taking up a published idea costs 0.5; proofs are wrong 10% of the time, ideas built on a wrong idea are wrong too, and targets reveal and retract them.

| shared knowledge | traditional frontier | OSO frontier | OSO lead | traditional targets | OSO targets |
| --- | --- | --- | --- | --- | --- |
| free and correct | 5.2 | 7.0 | +1.8 | 6.1 | 8.0 |
| costly to take up | 5.4 | 6.6 | +1.2 | 6.2 | 7.5 |
| sometimes wrong | 4.6 | 6.7 | +2.1 | 5.2 | 7.8 |
| costly and sometimes wrong | 4.9 | 6.2 | +1.3 | 5.4 | 6.7 |

## 6. Sensitivity to the parameters

In OSO, α and c are set by each community ([OIP-14](https://github.com/open-science-org/OIPs/blob/master/OIPS/oip-14.md)), validators decide how strict the screen is, funders decide how far money follows earnings, and the mint may become a community parameter ([OIP-8](https://github.com/open-science-org/OIPs/blob/master/OIPS/oip-8.md)). Their values will be set by competing communities, not by us, so the result must hold across them. The parameters below the line are our guesses about how agents think.

Each parameter is varied alone, from this space's settings, with agents choosing what to share (the realistic case: incentives matter only if sharing is a choice). The lead is OSO's hardest level reached minus traditional's under the same parameter value; α and c do not exist under traditional rules, so there it is compared with traditional's default.

![OSO's lead by parameter](figures/sensitivity.svg)

Across the tested values of the parameters a market or community sets, OSO's lead (agents choosing what to share) runs from **+0.2** to **+2.0** levels. The smallest lead, at f, earnings shape next round's money = 100%, is still clearly positive. The lead is most sensitive to **mint per idea**.

| parameter | means | tested | OSO lead (lowest to highest) |
| --- | --- | --- | --- |
| α, absorption rate | how much of the value reaching an idea it absorbs; the rest flows back to what it built on | 0.2, 0.4, 0.6, 0.8, 0.95 | +0.5 to +1.8 |
| c, cited share of the mint | share of each new mint paid to the ideas it built on | 0%, 5%, 15%, 30%, 50% | +0.6 to +0.6 |
| mint per idea | tokens minted for each validated idea, relative to bounties (the smallest bounty is a few units) | 0, 0.5, 1, 2, 4 | +0.6 to +2.0 |
| θ, validation screen | chance validators reject a trivial idea | 0%, 25%, 50%, 75%, 95% | +0.6 to +0.6 |
| f, earnings shape next round's money | share of each round's money funders give by recent earnings rather than equally | 0%, 25%, 50%, 75%, 100% | +0.2 to +1.6 |
| ψ, scoop risk | how likely agents think a shared lemma lets a rival take the target | 0, 0.25, 0.5, 0.75, 0.9 | +0.3 to +1.8 |
| κ, value of being used | how much agents think publishing raises a lemma's use | 0, 0.5, 1, 2, 4 | +0.4 to +1.1 |
| σ₀, perception noise | how noisily agents see the value of what they might attempt | 0, 0.5, 1, 2 | -0.3 to +0.9 |
| τ, choice randomness | how loosely agents follow their best option | 0.05, 0.15, 0.3, 0.6, 1 | -0.1 to +0.7 |
| attribution error | noise in the ledger's weights of what each idea built on | 0, 0.1, 0.3, 0.6 | +0.6 to +0.7 |

The two flow-back levers together:

![Sharing by α and c](figures/flow-back-grid.svg)

| α \ c | 0% | 5% | 15% | 30% | 50% |
| --- | --- | --- | --- | --- | --- |
| 0.95 | 36% · 5.6 | 36% · 5.6 | 36% · 5.6 | 36% · 5.6 | 36% · 5.6 |
| 0.8 | 43% · 5.7 | 43% · 5.7 | 43% · 5.7 | 43% · 5.7 | 43% · 5.7 |
| 0.6 | 59% · 6.3 | 59% · 6.3 | 59% · 6.3 | 59% · 6.3 | 59% · 6.3 |
| 0.4 | 80% · 6.9 | 80% · 6.9 | 80% · 6.9 | 80% · 6.9 | 80% · 6.9 |
| 0.2 | 91% · 7.0 | 91% · 7.0 | 91% · 7.0 | 91% · 7.0 | 91% · 7.0 |

Each cell: share of intermediate ideas published · hardest level reached.

<details><summary>Every tested value</summary>

| parameter | value | OSO frontier | traditional frontier | OSO lead | OSO targets | traditional targets | ideas shared |
| --- | --- | --- | --- | --- | --- | --- | --- |
| α, absorption rate | 0.2 | 7.0 | 5.2 | +1.8 | 8.0 | 6.1 | 91% |
| α, absorption rate | 0.4 | 6.9 | 5.2 | +1.8 | 7.9 | 6.1 | 80% |
| α, absorption rate | 0.6 | 6.3 | 5.2 | +1.2 | 7.4 | 6.1 | 59% |
| α, absorption rate | 0.8 (this space) | 5.7 | 5.2 | +0.6 | 6.9 | 6.1 | 43% |
| α, absorption rate | 0.95 | 5.6 | 5.2 | +0.5 | 6.7 | 6.1 | 36% |
| c, cited share of the mint | 0% | 5.7 | 5.2 | +0.6 | 6.9 | 6.1 | 43% |
| c, cited share of the mint | 5% | 5.7 | 5.2 | +0.6 | 6.9 | 6.1 | 43% |
| c, cited share of the mint | 15% (this space) | 5.7 | 5.2 | +0.6 | 6.9 | 6.1 | 43% |
| c, cited share of the mint | 30% | 5.7 | 5.2 | +0.6 | 6.9 | 6.1 | 43% |
| c, cited share of the mint | 50% | 5.7 | 5.2 | +0.6 | 6.9 | 6.1 | 43% |
| mint per idea | 0 (this space) | 5.7 | 5.2 | +0.6 | 6.9 | 6.1 | 43% |
| mint per idea | 0.5 | 5.7 | 4.4 | +1.3 | 6.9 | 5.0 | 50% |
| mint per idea | 1 | 5.8 | 4.5 | +1.2 | 7.0 | 4.9 | 59% |
| mint per idea | 2 | 5.8 | 4.1 | +1.6 | 7.0 | 4.7 | 68% |
| mint per idea | 4 | 6.2 | 4.2 | +2.0 | 7.3 | 4.9 | 77% |
| θ, validation screen | 0% | 5.7 | 5.2 | +0.6 | 6.9 | 6.1 | 43% |
| θ, validation screen | 25% | 5.7 | 5.2 | +0.6 | 6.9 | 6.1 | 43% |
| θ, validation screen | 50% (this space) | 5.7 | 5.2 | +0.6 | 6.9 | 6.1 | 43% |
| θ, validation screen | 75% | 5.7 | 5.2 | +0.6 | 6.9 | 6.1 | 43% |
| θ, validation screen | 95% | 5.7 | 5.2 | +0.6 | 6.9 | 6.1 | 43% |
| f, earnings shape next round's money | 0% | 4.8 | 3.3 | +1.6 | 5.9 | 3.4 | 42% |
| f, earnings shape next round's money | 25% | 5.0 | 4.0 | +1.0 | 6.2 | 4.3 | 42% |
| f, earnings shape next round's money | 50% (this space) | 5.7 | 5.2 | +0.6 | 6.9 | 6.1 | 43% |
| f, earnings shape next round's money | 75% | 6.6 | 6.3 | +0.3 | 7.7 | 7.2 | 43% |
| f, earnings shape next round's money | 100% | 6.9 | 6.6 | +0.2 | 7.8 | 7.5 | 45% |
| ψ, scoop risk | 0 | 7.0 | 5.2 | +1.8 | 8.0 | 6.1 | 100% |
| ψ, scoop risk | 0.25 | 6.1 | 5.2 | +0.9 | 7.3 | 6.1 | 59% |
| ψ, scoop risk | 0.5 (this space) | 5.7 | 5.2 | +0.6 | 6.9 | 6.1 | 43% |
| ψ, scoop risk | 0.75 | 5.4 | 5.2 | +0.3 | 6.6 | 6.1 | 36% |
| ψ, scoop risk | 0.9 | 5.9 | 5.2 | +0.7 | 7.1 | 6.1 | 34% |
| κ, value of being used | 0 | 5.5 | 5.2 | +0.4 | 6.6 | 6.1 | 38% |
| κ, value of being used | 0.5 | 5.5 | 5.2 | +0.4 | 6.7 | 6.1 | 40% |
| κ, value of being used | 1 (this space) | 5.7 | 5.2 | +0.6 | 6.9 | 6.1 | 43% |
| κ, value of being used | 2 | 5.9 | 5.2 | +0.7 | 7.0 | 6.1 | 48% |
| κ, value of being used | 4 | 6.2 | 5.2 | +1.1 | 7.2 | 6.1 | 55% |
| σ₀, perception noise | 0 | 5.3 | 5.6 | -0.3 | 6.4 | 6.0 | 36% |
| σ₀, perception noise | 0.5 | 5.6 | 5.7 | -0.0 | 6.6 | 6.2 | 37% |
| σ₀, perception noise | 1 (this space) | 5.7 | 5.2 | +0.6 | 6.9 | 6.1 | 43% |
| σ₀, perception noise | 2 | 6.3 | 5.3 | +0.9 | 7.4 | 6.2 | 48% |
| τ, choice randomness | 0.05 | 5.9 | 6.0 | -0.1 | 6.7 | 6.2 | 36% |
| τ, choice randomness | 0.15 | 5.8 | 5.9 | -0.1 | 6.6 | 5.9 | 39% |
| τ, choice randomness | 0.3 (this space) | 5.7 | 5.2 | +0.6 | 6.9 | 6.1 | 43% |
| τ, choice randomness | 0.6 | 5.9 | 5.7 | +0.2 | 7.2 | 6.8 | 46% |
| τ, choice randomness | 1 | 6.3 | 5.6 | +0.7 | 7.5 | 6.6 | 48% |
| attribution error | 0 (this space) | 5.7 | 5.2 | +0.6 | 6.9 | 6.1 | 43% |
| attribution error | 0.1 | 5.9 | 5.2 | +0.7 | 7.1 | 6.1 | 43% |
| attribution error | 0.3 | 5.8 | 5.2 | +0.6 | 7.1 | 6.1 | 43% |
| attribution error | 0.6 | 5.9 | 5.2 | +0.7 | 7.1 | 6.1 | 43% |

</details>

## What this shows and what it does not

- **It is a simulation** of the [OSO demo specification](../../docs/design.md): ideas are abstract, success is chance, and agents follow a formula. It shows how the incentive rules play out *if* this space works as described, not that it does.
- **The parameters are guesses,** especially the success chances, the scoop risk ψ, and the costs and error rates in section 5. Section 6 varies each one alone; it does not vary them together, except α and c.
- **By default, sharing is free and always correct,** which favours OSO; section 5 shows how much of the lead survives without that.
- **Notes for this space:** Theorem names are hidden; the tree is the route of our own reference proofs, and agents may find others.

## Reproduce

```sh
npm run sim -- report lean-problem-set --seeds 100
```

The space is [spaces/lean-problem-set.yaml](../../spaces/lean-problem-set.yaml) (written by hand from the Lean problem set's reference proofs). Every number above is in [data.json](data.json). Generated by the OSO simulator at commit `dc540e2`.
