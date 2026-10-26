# Example: a deep, wide field: OSO vs. traditional research

> An example setting of the idea graph generator, not a real field: 80 ideas in 8 levels, about two parents each, four bounties at the top.

**For the same money, the OSO community got further, or got there more cheaply, than the traditional one.**

- **How far:** with a budget of 760, OSO reached level **8.0** of 8 on average; traditional research reached **0.2**.
- **Targets solved:** OSO solved **3.7** of 4; traditional solved **0.0**.
- **Cost to reach level 8:** OSO 338; traditional 570 (in the 2% of runs that got there).
- **Return on the money (ROI):** OSO gained **3.24** in bounty value per unit spent (1874 for 613); traditional **0.01** (10 for 757). Value gained is the bounties of the targets solved.
- **Does flow-back make agents share?** When agents choose, sharing rises clearly (by 0.2 or more) once α is 0.3 or lower. At OSO's default α = 0.8, agents shared 21% of their intermediate ideas.
- **Robustness:** OSO's lead in level is smallest when shared knowledge is **costly to take up** (+7.8 levels).
- **Sensitivity:** Across the tested values of the parameters a market or community sets, OSO's lead (agents choosing what to share) runs from **+4.1** to **+7.7** levels. The smallest lead, at mint per idea = 2, is still clearly positive. The lead is most sensitive to **mint per idea**.

*The verdict compares the hardest level reached, the targets solved and (when both communities reach level 8 in at least 90% of runs) the cost to get there, each against two standard errors. 100 simulated runs per setting · simulator commit `dc540e2` · 2026-10-26. This is a simulation with guessed parameters, not evidence about real research; see [What this shows](#what-this-shows-and-what-it-does-not).*

## 1. The problem space

A research field with no particular subject. Ideas build on ideas in eight levels of rising difficulty, each idea taking most of its content from about two earlier ones. Four ideas at the top carry bounties. Twelve agents of six kinds work in it: patient foundation builders, target racers, cheap explorers, specialists, a free rider and a gamer who farms trivial ideas.

| In this space | means |
| --- | --- |
| an idea | a finding that later findings can build on |
| a target | a bounty-carrying finding announced in advance |
| an attempt | one attempt at proving a finding, which succeeds or fails |

![The research tree](figures/world.svg)

The tree has 80 ideas in 8 levels. 28 are dead ends: no target depends on them. 4 are targets:

| target | level | bounty | ideas it rests on |
| --- | --- | --- | --- |
| T1 | 8 | 512 | 36 |
| T2 | 8 | 512 | 27 |
| T3 | 8 | 512 | 37 |
| T4 | 8 | 512 | 37 |

How hard each level is, before an agent's skill:

| level | ideas | targets | chance per attempt, parents known | sequence length (bits) |
| --- | --- | --- | --- | --- |
| 1 | 10 | 0 | 25% | 2.0 |
| 2 | 10 | 0 | 50% | 4.0 |
| 3 | 10 | 0 | 50% | 5.0 |
| 4 | 10 | 0 | 14% | 7.0 |
| 5 | 10 | 0 | 19% | 8.0 |
| 6 | 10 | 0 | 10% | 10.0 |
| 7 | 10 | 0 | 13% | 11.0 |
| 8 | 10 | 4 | 5% | 13.0 |

The community has 12 agents (3 foundation, 3 racer, 2 explorer, 2 specialist, 1 freeRider, 1 gamer) and a budget of 760 over 63 rounds (calibrated: the smallest budget at which OSO solves about 90% of the targets).

## 2. Progress for the money

![Hardest level published by money spent](figures/frontier.svg)

Each line is the mean, over 100 runs, of the hardest level the community had published after spending that much money. A line that ends early means every target was solved and the funder stopped paying.

## 3. The six settings

The rules are the only difference between rows ([the design](../../docs/design.md#the-rules-compared)). Traditional: nothing flows back to what an idea built on, and work is published only when finished. OSO: value flows back (α = 0.8, c = 0.15), and ideas are published at once or when the agent chooses.

| setting | frontier | reach L8 | speed | cost | spend | targets solved | waste | credit | sharing | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 0.2 ± 1.1 | 0.02 | 48 ± 11 | 570 ± 127 | 757 ± 0 | 0.0 ± 0.1 | 0.54 ± 0.05 | 0.02 ± 0.14 | 0.00 ± 0.00 | 0.01 ± 0.10 |
| OSO (immediate) | 8.0 ± 0.0 | 1.00 | 28 ± 9 | 338 ± 110 | 613 ± 114 | 3.7 ± 0.7 | 0.33 ± 0.06 | 0.48 ± 0.13 | 1.00 ± 0.00 | 3.24 ± 1.05 |
| Flow-back, finished-only | 0.2 ± 1.4 | 0.03 | 56 ± 1 | 668 ± 7 | 757 ± 1 | 0.0 ± 0.2 | 0.53 ± 0.05 | 0.03 ± 0.17 | 0.00 ± 0.00 | 0.02 ± 0.12 |
| No flow-back, immediate | 8.0 ± 0.0 | 1.00 | 27 ± 10 | 316 ± 119 | 626 ± 119 | 3.6 ± 0.7 | 0.33 ± 0.06 | 0.36 ± 0.14 | 1.00 ± 0.00 | 3.16 ± 1.05 |
| No flow-back, choice | 6.6 ± 2.0 | 0.55 | 45 ± 13 | 534 ± 151 | 740 ± 50 | 1.1 ± 1.5 | 0.50 ± 0.06 | 0.43 ± 0.47 | 0.20 ± 0.09 | 0.85 ± 1.17 |
| OSO (choice) | 6.7 ± 1.8 | 0.57 | 43 ± 11 | 515 ± 136 | 742 ± 49 | 1.1 ± 1.5 | 0.49 ± 0.06 | 0.39 ± 0.45 | 0.21 ± 0.10 | 0.85 ± 1.15 |

Values are mean ± standard deviation over runs. *frontier*: hardest level published; *reach L8*: share of runs reaching level 8; *speed*, *cost*: rounds and money to reach it; *credit*: how closely bounty pay matches true contribution; *sharing*: share of intermediate ideas published as soon as they were proved.

## 4. Does flow-back make agents share?

![Sharing and reach by α](figures/alpha.svg)

| α | intermediate ideas shared | frontier | reach level 8 | targets solved |
| --- | --- | --- | --- | --- |
| 1 | 20% | 6.6 | 55% | 1.1 |
| 0.8 | 21% | 6.7 | 57% | 1.1 |
| 0.6 | 22% | 7.0 | 60% | 1.3 |
| 0.5 | 27% | 7.4 | 71% | 1.4 |
| 0.4 | 34% | 7.6 | 77% | 1.4 |
| 0.3 | 41% | 7.6 | 76% | 1.8 |
| 0.2 | 46% | 7.8 | 89% | 1.8 |
| 0.1 | 54% | 7.8 | 84% | 2.0 |

Sharing rises clearly once α is 0.3 or lower: this is the threshold α* in this space. The threshold depends on the scoop risk ψ = 0.5, which is a guess.

## 5. When sharing is costly or sometimes wrong

Taking up a published idea costs 0.5; proofs are wrong 10% of the time, ideas built on a wrong idea are wrong too, and targets reveal and retract them.

| shared knowledge | traditional frontier | OSO frontier | OSO lead | traditional targets | OSO targets |
| --- | --- | --- | --- | --- | --- |
| free and correct | 0.2 | 8.0 | +7.8 | 0.0 | 3.7 |
| costly to take up | 0.2 | 7.9 | +7.8 | 0.0 | 2.3 |
| sometimes wrong | 0.0 | 8.0 | +8.0 | 0.0 | 2.9 |
| costly and sometimes wrong | 0.0 | 7.8 | +7.8 | 0.0 | 1.4 |

## 6. Sensitivity to the parameters

In OSO, α and c are set by each community ([OIP-14](https://github.com/open-science-org/OIPs/blob/master/OIPS/oip-14.md)), validators decide how strict the screen is, funders decide how far money follows earnings, and the mint may become a community parameter ([OIP-8](https://github.com/open-science-org/OIPs/blob/master/OIPS/oip-8.md)). Their values will be set by competing communities, not by us, so the result must hold across them. The parameters below the line are our guesses about how agents think.

Each parameter is varied alone, from this space's settings, with agents choosing what to share (the realistic case: incentives matter only if sharing is a choice). The lead is OSO's hardest level reached minus traditional's under the same parameter value; α and c do not exist under traditional rules, so there it is compared with traditional's default.

![OSO's lead by parameter](figures/sensitivity.svg)

Across the tested values of the parameters a market or community sets, OSO's lead (agents choosing what to share) runs from **+4.1** to **+7.7** levels. The smallest lead, at mint per idea = 2, is still clearly positive. The lead is most sensitive to **mint per idea**.

| parameter | means | tested | OSO lead (lowest to highest) |
| --- | --- | --- | --- |
| α, absorption rate | how much of the value reaching an idea it absorbs; the rest flows back to what it built on | 0.2, 0.4, 0.6, 0.8, 0.95 | +6.4 to +7.7 |
| c, cited share of the mint | share of each new mint paid to the ideas it built on | 0%, 5%, 15%, 30%, 50% | +6.6 to +6.6 |
| mint per idea | tokens minted for each validated idea, relative to bounties (the smallest bounty is a few units) | 0, 0.5, 1, 2, 4 | +4.1 to +6.6 |
| θ, validation screen | chance validators reject a trivial idea | 0%, 25%, 50%, 75%, 95% | +6.6 to +6.6 |
| f, earnings shape next round's money | share of each round's money funders give by recent earnings rather than equally | 0%, 25%, 50%, 75%, 100% | +5.4 to +7.5 |
| ψ, scoop risk | how likely agents think a shared lemma lets a rival take the target | 0, 0.25, 0.5, 0.75, 0.9 | +6.5 to +7.8 |
| κ, value of being used | how much agents think publishing raises a lemma's use | 0, 0.5, 1, 2, 4 | +6.5 to +6.7 |
| σ₀, perception noise | how noisily agents see the value of what they might attempt | 0, 0.5, 1, 2 | +6.4 to +7.2 |
| τ, choice randomness | how loosely agents follow their best option | 0.05, 0.15, 0.3, 0.6, 1 | +3.1 to +7.2 |
| attribution error | noise in the ledger's weights of what each idea built on | 0, 0.1, 0.3, 0.6 | +6.6 to +6.8 |

The two flow-back levers together:

![Sharing by α and c](figures/flow-back-grid.svg)

| α \ c | 0% | 5% | 15% | 30% | 50% |
| --- | --- | --- | --- | --- | --- |
| 0.95 | 21% · 6.6 | 21% · 6.6 | 21% · 6.6 | 21% · 6.6 | 21% · 6.6 |
| 0.8 | 21% · 6.7 | 21% · 6.7 | 21% · 6.7 | 21% · 6.7 | 21% · 6.7 |
| 0.6 | 22% · 7.0 | 22% · 7.0 | 22% · 7.0 | 22% · 7.0 | 22% · 7.0 |
| 0.4 | 34% · 7.6 | 34% · 7.6 | 34% · 7.6 | 34% · 7.6 | 34% · 7.6 |
| 0.2 | 46% · 7.8 | 46% · 7.8 | 46% · 7.8 | 46% · 7.8 | 46% · 7.8 |

Each cell: share of intermediate ideas published · hardest level reached.

<details><summary>Every tested value</summary>

| parameter | value | OSO frontier | traditional frontier | OSO lead | OSO targets | traditional targets | ideas shared |
| --- | --- | --- | --- | --- | --- | --- | --- |
| α, absorption rate | 0.2 | 7.8 | 0.2 | +7.7 | 1.8 | 0.0 | 46% |
| α, absorption rate | 0.4 | 7.6 | 0.2 | +7.5 | 1.4 | 0.0 | 34% |
| α, absorption rate | 0.6 | 7.0 | 0.2 | +6.9 | 1.3 | 0.0 | 22% |
| α, absorption rate | 0.8 (this space) | 6.7 | 0.2 | +6.6 | 1.1 | 0.0 | 21% |
| α, absorption rate | 0.95 | 6.6 | 0.2 | +6.4 | 1.0 | 0.0 | 21% |
| c, cited share of the mint | 0% | 6.7 | 0.2 | +6.6 | 1.1 | 0.0 | 21% |
| c, cited share of the mint | 5% | 6.7 | 0.2 | +6.6 | 1.1 | 0.0 | 21% |
| c, cited share of the mint | 15% (this space) | 6.7 | 0.2 | +6.6 | 1.1 | 0.0 | 21% |
| c, cited share of the mint | 30% | 6.7 | 0.2 | +6.6 | 1.1 | 0.0 | 21% |
| c, cited share of the mint | 50% | 6.7 | 0.2 | +6.6 | 1.1 | 0.0 | 21% |
| mint per idea | 0 (this space) | 6.7 | 0.2 | +6.6 | 1.1 | 0.0 | 21% |
| mint per idea | 0.5 | 6.2 | 1.8 | +4.4 | 0.4 | 0.2 | 18% |
| mint per idea | 1 | 6.1 | 1.4 | +4.7 | 0.3 | 0.2 | 19% |
| mint per idea | 2 | 6.0 | 1.8 | +4.1 | 0.3 | 0.3 | 19% |
| mint per idea | 4 | 6.4 | 1.8 | +4.5 | 0.4 | 0.3 | 20% |
| θ, validation screen | 0% | 6.7 | 0.2 | +6.6 | 1.1 | 0.0 | 21% |
| θ, validation screen | 25% | 6.7 | 0.2 | +6.6 | 1.1 | 0.0 | 21% |
| θ, validation screen | 50% (this space) | 6.7 | 0.2 | +6.6 | 1.1 | 0.0 | 21% |
| θ, validation screen | 75% | 6.7 | 0.2 | +6.6 | 1.1 | 0.0 | 21% |
| θ, validation screen | 95% | 6.7 | 0.2 | +6.6 | 1.1 | 0.0 | 21% |
| f, earnings shape next round's money | 0% | 5.6 | 0.2 | +5.4 | 0.1 | 0.0 | 17% |
| f, earnings shape next round's money | 25% | 6.1 | 0.2 | +5.9 | 0.3 | 0.0 | 18% |
| f, earnings shape next round's money | 50% (this space) | 6.7 | 0.2 | +6.6 | 1.1 | 0.0 | 21% |
| f, earnings shape next round's money | 75% | 7.5 | 0.2 | +7.3 | 2.3 | 0.0 | 25% |
| f, earnings shape next round's money | 100% | 7.7 | 0.2 | +7.5 | 3.0 | 0.1 | 27% |
| ψ, scoop risk | 0 | 8.0 | 0.2 | +7.8 | 3.7 | 0.0 | 100% |
| ψ, scoop risk | 0.25 | 6.7 | 0.2 | +6.6 | 1.0 | 0.0 | 22% |
| ψ, scoop risk | 0.5 (this space) | 6.7 | 0.2 | +6.6 | 1.1 | 0.0 | 21% |
| ψ, scoop risk | 0.75 | 6.6 | 0.2 | +6.5 | 1.2 | 0.0 | 21% |
| ψ, scoop risk | 0.9 | 6.6 | 0.2 | +6.5 | 1.1 | 0.0 | 21% |
| κ, value of being used | 0 | 6.6 | 0.2 | +6.5 | 1.2 | 0.0 | 20% |
| κ, value of being used | 0.5 | 6.7 | 0.2 | +6.5 | 1.2 | 0.0 | 21% |
| κ, value of being used | 1 (this space) | 6.7 | 0.2 | +6.6 | 1.1 | 0.0 | 21% |
| κ, value of being used | 2 | 6.8 | 0.2 | +6.6 | 1.1 | 0.0 | 21% |
| κ, value of being used | 4 | 6.8 | 0.2 | +6.7 | 1.1 | 0.0 | 23% |
| σ₀, perception noise | 0 | 6.5 | 0.1 | +6.4 | 0.9 | 0.0 | 17% |
| σ₀, perception noise | 0.5 | 6.8 | 0.2 | +6.5 | 1.1 | 0.1 | 19% |
| σ₀, perception noise | 1 (this space) | 6.7 | 0.2 | +6.6 | 1.1 | 0.0 | 21% |
| σ₀, perception noise | 2 | 7.3 | 0.1 | +7.2 | 1.5 | 0.0 | 28% |
| τ, choice randomness | 0.05 | 3.5 | 0.4 | +3.1 | 0.8 | 0.1 | 4% |
| τ, choice randomness | 0.15 | 4.8 | 0.1 | +4.7 | 1.1 | 0.0 | 8% |
| τ, choice randomness | 0.3 (this space) | 6.7 | 0.2 | +6.6 | 1.1 | 0.0 | 21% |
| τ, choice randomness | 0.6 | 7.2 | 0.0 | +7.2 | 0.7 | 0.0 | 27% |
| τ, choice randomness | 1 | 6.8 | 0.1 | +6.8 | 0.5 | 0.0 | 27% |
| attribution error | 0 (this space) | 6.7 | 0.2 | +6.6 | 1.1 | 0.0 | 21% |
| attribution error | 0.1 | 6.8 | 0.2 | +6.6 | 1.2 | 0.0 | 21% |
| attribution error | 0.3 | 7.0 | 0.2 | +6.8 | 1.2 | 0.0 | 22% |
| attribution error | 0.6 | 6.8 | 0.2 | +6.6 | 1.2 | 0.0 | 21% |

</details>

## What this shows and what it does not

- **It is a simulation** of the [OSO demo specification](../../docs/design.md): ideas are abstract, success is chance, and agents follow a formula. It shows how the incentive rules play out *if* this space works as described, not that it does.
- **The parameters are guesses,** especially the success chances, the scoop risk ψ, and the costs and error rates in section 5. Section 6 varies each one alone; it does not vary them together, except α and c.
- **By default, sharing is free and always correct,** which favours OSO; section 5 shows how much of the lead survives without that.

## Reproduce

```sh
npm run sim -- report example-deep-field --seeds 100
```

The space is [spaces/example-deep-field.yaml](../../spaces/example-deep-field.yaml). Every number above is in [data.json](data.json). Generated by the OSO simulator at commit `dc540e2`.
