# An abstract research field: OSO vs. traditional research

> A generic field: 80 ideas in 8 levels, about two parents each, four bounties at the top.

**For the same money, the OSO community got further, or got there more cheaply, than the traditional one.**

- **How far:** with a budget of 950, OSO reached level **8.0** of 8 on average; traditional research reached **3.7**.
- **Targets solved:** OSO solved **3.6** of 4; traditional solved **0.7**.
- **Cost to reach level 8:** OSO 401; traditional 686 (in the 46% of runs that got there).
- **Return on the money (ROI):** OSO gained **2.70** in bounty value per unit spent (1859 for 747); traditional **0.36** (343 for 947). Value gained is the bounties of the targets solved.
- **Does flow-back make agents share?** When agents choose, sharing rises clearly (by 0.2 or more) once α is 0.2 or lower. At OSO's default α = 0.8, agents shared 22% of their intermediate ideas.
- **Robustness:** OSO's lead in level is smallest when shared knowledge is **costly to take up** (+4.1 levels).
- **Sensitivity:** Across the tested values of the parameters a market or community sets, OSO's lead (agents choosing what to share) runs from **+0.0** to **+5.8** levels. The smallest lead, at ρ, money follows earnings = 100%, is **within noise: no clear difference there**. The lead is most sensitive to **ρ, money follows earnings**. Why ρ matters so much here: under traditional rules, when money follows earnings, the first agent to earn takes the money. In this community that is the gaming agent, which earns early from trivial ideas and then, holding all the money, does the research too. Without a gaming agent the effect disappears (see the funding-rule-gamer experiment).

*The verdict compares the hardest level reached, the targets solved and (when both communities reach level 8 in at least 90% of runs) the cost to get there, each against two standard errors. 100 simulated runs per setting · simulator commit `3d56faf` · 2026-10-24. This is a simulation with guessed parameters, not evidence about real research; see [What this shows](#what-this-shows-and-what-it-does-not).*

## 1. The problem space

A research field with no particular subject. Ideas build on ideas in eight levels of rising difficulty, across three loosely connected areas. Seven targets carry bounties that double with each level, and about a third of all ideas are dead ends that lead to no target. Twelve agents of six kinds work in it: patient foundation builders, target racers, cheap explorers, specialists, a free rider and a gamer who farms trivial ideas.

| In this space | means |
| --- | --- |
| an idea | a finding that later findings can build on |
| a target | a bounty-carrying finding announced in advance |
| an attempt | one attempt at proving a finding, which succeeds or fails |

![The research tree](figures/world.svg)

The tree has 80 ideas in 8 levels. 34 are dead ends: no target depends on them. 4 are targets:

| target | level | bounty | ideas it rests on |
| --- | --- | --- | --- |
| T1 | 8 | 512 | 27 |
| T2 | 8 | 512 | 27 |
| T3 | 8 | 512 | 24 |
| T4 | 8 | 512 | 22 |

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

The community has 12 agents (3 foundation, 3 racer, 2 explorer, 2 specialist, 1 freeRider, 1 gamer) and a budget of 950 over 79 rounds (calibrated: the smallest budget at which OSO solves about 90% of the targets).

## 2. Progress for the money

![Hardest level published by money spent](figures/frontier.svg)

Each line is the mean, over 100 runs, of the hardest level the community had published after spending that much money. A line that ends early means every target was solved and the funder stopped paying.

## 3. The six settings

The rules are the only difference between rows ([specification, section 3](../../docs/design.md#3-the-rules)). Traditional: nothing flows back to what an idea built on, and work is published only when finished. OSO: value flows back (α = 0.8, c = 0.15), and ideas are published at once or when the agent chooses.

| setting | frontier | reach L8 | speed | cost | spend | targets solved | waste | credit | sharing | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 3.7 ± 4.0 | 0.46 | 57 ± 14 | 686 ± 163 | 947 ± 2 | 0.7 ± 0.8 | 0.54 ± 0.11 | 0.46 ± 0.50 | 0.00 ± 0.00 | 0.36 ± 0.45 |
| OSO (immediate) | 8.0 ± 0.0 | 1.00 | 34 ± 12 | 401 ± 144 | 747 ± 165 | 3.6 ± 0.7 | 0.84 ± 0.05 | 0.51 ± 0.11 | 1.00 ± 0.00 | 2.70 ± 1.00 |
| Flow-back, finished-only | 4.2 ± 4.0 | 0.53 | 59 ± 17 | 700 ± 199 | 946 ± 17 | 0.8 ± 0.9 | 0.55 ± 0.11 | 0.51 ± 0.49 | 0.00 ± 0.00 | 0.45 ± 0.53 |
| No flow-back, immediate | 8.0 ± 0.0 | 1.00 | 30 ± 13 | 360 ± 153 | 741 ± 166 | 3.7 ± 0.6 | 0.82 ± 0.06 | 0.40 ± 0.13 | 1.00 ± 0.00 | 2.75 ± 0.95 |
| No flow-back, choice | 7.3 ± 1.1 | 0.65 | 54 ± 16 | 650 ± 188 | 942 ± 40 | 0.9 ± 0.9 | 0.62 ± 0.08 | 0.52 ± 0.43 | 0.22 ± 0.08 | 0.53 ± 0.58 |
| OSO (choice) | 7.0 ± 1.6 | 0.65 | 58 ± 15 | 690 ± 182 | 941 ± 25 | 1.1 ± 1.2 | 0.64 ± 0.10 | 0.52 ± 0.44 | 0.22 ± 0.08 | 0.59 ± 0.67 |

Values are mean ± standard deviation over runs. *frontier*: hardest level published; *reach L8*: share of runs reaching level 8; *speed*, *cost*: rounds and money to reach it; *credit*: how closely bounty pay matches true contribution; *sharing*: share of intermediate ideas published as soon as they were proved.

## 4. Does flow-back make agents share?

![Sharing and reach by α](figures/alpha.svg)

| α | intermediate ideas shared | frontier | reach level 8 | targets solved |
| --- | --- | --- | --- | --- |
| 1 | 22% | 7.3 | 65% | 0.9 |
| 0.8 | 22% | 7.0 | 65% | 1.1 |
| 0.6 | 24% | 7.4 | 70% | 1.0 |
| 0.5 | 26% | 7.3 | 65% | 1.0 |
| 0.4 | 30% | 7.7 | 76% | 1.1 |
| 0.3 | 38% | 7.7 | 80% | 1.5 |
| 0.2 | 45% | 7.8 | 85% | 1.7 |
| 0.1 | 56% | 7.8 | 85% | 2.0 |

Sharing rises clearly once α is 0.2 or lower: this is the threshold α* in this space. The threshold depends on the scoop risk ψ = 0.5, which is a guess.

## 5. When sharing is costly or sometimes wrong

Taking up a published idea costs 0.5; proofs are wrong 10% of the time, ideas built on a wrong idea are wrong too, and targets reveal and retract them.

| shared knowledge | traditional frontier | OSO frontier | OSO lead | traditional targets | OSO targets |
| --- | --- | --- | --- | --- | --- |
| free and correct | 3.7 | 8.0 | +4.3 | 0.7 | 3.6 |
| costly to take up | 3.7 | 7.8 | +4.1 | 0.6 | 1.6 |
| sometimes wrong | 2.8 | 8.0 | +5.2 | 0.4 | 3.0 |
| costly and sometimes wrong | 2.8 | 7.8 | +5.0 | 0.5 | 1.2 |

## 6. Sensitivity to the parameters

In OSO, α and c are set by each community ([OIP-14](https://github.com/open-science-org/OIPs/blob/master/OIPS/oip-14.md)), validators decide how strict the screen is, funders decide how far money follows earnings, and the mint may become a community parameter ([OIP-8](https://github.com/open-science-org/OIPs/blob/master/OIPS/oip-8.md)). Their values will be set by competing communities, not by us, so the result must hold across them. The parameters below the line are our guesses about how agents think.

Each parameter is varied alone, from this space's settings, with agents choosing what to share (the realistic case: incentives matter only if sharing is a choice). The lead is OSO's hardest level reached minus traditional's under the same parameter value; α and c do not exist under traditional rules, so there it is compared with traditional's default.

![OSO's lead by parameter](figures/sensitivity.svg)

Across the tested values of the parameters a market or community sets, OSO's lead (agents choosing what to share) runs from **+0.0** to **+5.8** levels. The smallest lead, at ρ, money follows earnings = 100%, is **within noise: no clear difference there**. The lead is most sensitive to **ρ, money follows earnings**. Why ρ matters so much here: under traditional rules, when money follows earnings, the first agent to earn takes the money. In this community that is the gaming agent, which earns early from trivial ideas and then, holding all the money, does the research too. Without a gaming agent the effect disappears (see the funding-rule-gamer experiment).

| parameter | means | tested | OSO lead (lowest to highest) |
| --- | --- | --- | --- |
| α, absorption rate | how much of the value reaching an idea it absorbs; the rest flows back to what it built on | 0.2, 0.4, 0.6, 0.8, 0.95 | +3.4 to +4.2 |
| c, cited share of the mint | share of each new mint paid to the ideas it built on | 0%, 5%, 15%, 30%, 50% | +3.3 to +3.7 |
| mint per idea | tokens minted for each validated idea, relative to bounties (the smallest bounty is a few units) | 0, 0.5, 1, 2, 4 | +3.1 to +5.8 |
| θ, validation screen | chance validators reject a trivial idea | 0%, 25%, 50%, 75%, 95% | +3.4 to +4.6 |
| ρ, money follows earnings | share of each round's money funders give by recent earnings rather than equally | 0%, 25%, 50%, 75%, 100% | +0.0 to +5.7 |
| ψ, scoop risk | how likely agents think a shared lemma lets a rival take the target | 0, 0.25, 0.5, 0.75, 0.9 | +3.4 to +4.3 |
| κ, value of being used | how much agents think publishing raises a lemma's use | 0, 0.5, 1, 2, 4 | +3.3 to +3.5 |
| σ₀, perception noise | how noisily agents see the value of what they might attempt | 0, 0.5, 1, 2 | +3.0 to +3.9 |
| τ, choice randomness | how loosely agents follow their best option | 0.05, 0.15, 0.3, 0.6, 1 | -0.1 to +5.8 |
| attribution error | noise in the ledger's weights of what each idea built on | 0, 0.1, 0.3, 0.6 | +3.3 to +3.5 |

The two flow-back levers together:

![Sharing by α and c](figures/flow-back-grid.svg)

| α \ c | 0% | 5% | 15% | 30% | 50% |
| --- | --- | --- | --- | --- | --- |
| 0.95 | 22% · 7.3 | 22% · 7.1 | 22% · 7.2 | 22% · 7.2 | 22% · 7.3 |
| 0.8 | 23% · 7.4 | 22% · 7.2 | 22% · 7.0 | 23% · 7.1 | 22% · 7.0 |
| 0.6 | 25% · 7.3 | 24% · 7.3 | 24% · 7.4 | 25% · 7.1 | 24% · 7.4 |
| 0.4 | 31% · 7.6 | 31% · 7.7 | 30% · 7.7 | 31% · 7.5 | 30% · 7.5 |
| 0.2 | 46% · 7.9 | 46% · 7.8 | 45% · 7.8 | 44% · 7.8 | 44% · 7.8 |

Each cell: share of intermediate ideas published · hardest level reached.

<details><summary>Every tested value</summary>

| parameter | value | OSO frontier | traditional frontier | OSO lead | OSO targets | traditional targets | ideas shared |
| --- | --- | --- | --- | --- | --- | --- | --- |
| α, absorption rate | 0.2 | 7.8 | 3.7 | +4.2 | 1.7 | 0.7 | 45% |
| α, absorption rate | 0.4 | 7.7 | 3.7 | +4.0 | 1.1 | 0.7 | 30% |
| α, absorption rate | 0.6 | 7.4 | 3.7 | +3.7 | 1.0 | 0.7 | 24% |
| α, absorption rate | 0.8 (this space) | 7.0 | 3.7 | +3.4 | 1.1 | 0.7 | 22% |
| α, absorption rate | 0.95 | 7.2 | 3.7 | +3.5 | 0.9 | 0.7 | 22% |
| c, cited share of the mint | 0% | 7.4 | 3.7 | +3.7 | 1.0 | 0.7 | 23% |
| c, cited share of the mint | 5% | 7.2 | 3.7 | +3.5 | 0.8 | 0.7 | 22% |
| c, cited share of the mint | 15% (this space) | 7.0 | 3.7 | +3.4 | 1.1 | 0.7 | 22% |
| c, cited share of the mint | 30% | 7.1 | 3.7 | +3.4 | 0.9 | 0.7 | 23% |
| c, cited share of the mint | 50% | 7.0 | 3.7 | +3.3 | 0.9 | 0.7 | 22% |
| mint per idea | 0 | 6.2 | 0.5 | +5.8 | 0.4 | 0.1 | 21% |
| mint per idea | 0.5 | 7.1 | 3.8 | +3.3 | 0.8 | 0.6 | 22% |
| mint per idea | 1 (this space) | 7.0 | 3.7 | +3.4 | 1.1 | 0.7 | 22% |
| mint per idea | 2 | 7.1 | 4.0 | +3.1 | 0.9 | 0.7 | 23% |
| mint per idea | 4 | 7.3 | 3.8 | +3.5 | 1.1 | 0.6 | 25% |
| θ, validation screen | 0% | 7.4 | 4.0 | +3.4 | 1.0 | 0.7 | 23% |
| θ, validation screen | 25% | 7.2 | 3.8 | +3.4 | 0.9 | 0.7 | 22% |
| θ, validation screen | 50% (this space) | 7.0 | 3.7 | +3.4 | 1.1 | 0.7 | 22% |
| θ, validation screen | 75% | 6.9 | 3.3 | +3.6 | 0.9 | 0.6 | 21% |
| θ, validation screen | 95% | 7.2 | 2.6 | +4.6 | 1.3 | 0.5 | 25% |
| ρ, money follows earnings | 0% | 6.1 | 0.4 | +5.7 | 0.2 | 0.1 | 19% |
| ρ, money follows earnings | 25% | 6.1 | 0.7 | +5.4 | 0.3 | 0.1 | 20% |
| ρ, money follows earnings | 50% (this space) | 7.0 | 3.7 | +3.4 | 1.1 | 0.7 | 22% |
| ρ, money follows earnings | 75% | 7.8 | 7.1 | +0.7 | 2.0 | 1.8 | 26% |
| ρ, money follows earnings | 100% | 8.0 | 8.0 | +0.0 | 2.8 | 3.0 | 32% |
| ψ, scoop risk | 0 | 8.0 | 3.7 | +4.3 | 3.6 | 0.7 | 98% |
| ψ, scoop risk | 0.25 | 7.1 | 3.7 | +3.5 | 1.1 | 0.7 | 23% |
| ψ, scoop risk | 0.5 (this space) | 7.0 | 3.7 | +3.4 | 1.1 | 0.7 | 22% |
| ψ, scoop risk | 0.75 | 7.1 | 3.7 | +3.4 | 1.1 | 0.7 | 21% |
| ψ, scoop risk | 0.9 | 7.1 | 3.7 | +3.4 | 1.1 | 0.7 | 21% |
| κ, value of being used | 0 | 7.0 | 3.7 | +3.3 | 1.0 | 0.7 | 21% |
| κ, value of being used | 0.5 | 7.0 | 3.7 | +3.3 | 1.0 | 0.7 | 21% |
| κ, value of being used | 1 (this space) | 7.0 | 3.7 | +3.4 | 1.1 | 0.7 | 22% |
| κ, value of being used | 2 | 7.1 | 3.7 | +3.4 | 1.0 | 0.7 | 23% |
| κ, value of being used | 4 | 7.1 | 3.7 | +3.5 | 1.1 | 0.7 | 24% |
| σ₀, perception noise | 0 | 7.4 | 4.4 | +3.0 | 1.2 | 0.8 | 20% |
| σ₀, perception noise | 0.5 | 7.2 | 3.8 | +3.4 | 1.0 | 0.8 | 20% |
| σ₀, perception noise | 1 (this space) | 7.0 | 3.7 | +3.4 | 1.1 | 0.7 | 22% |
| σ₀, perception noise | 2 | 7.5 | 3.6 | +3.9 | 1.1 | 0.6 | 29% |
| τ, choice randomness | 0.05 | 6.7 | 6.9 | -0.1 | 1.6 | 1.8 | 5% |
| τ, choice randomness | 0.15 | 7.1 | 6.7 | +0.4 | 1.5 | 1.5 | 7% |
| τ, choice randomness | 0.3 (this space) | 7.0 | 3.7 | +3.4 | 1.1 | 0.7 | 22% |
| τ, choice randomness | 0.6 | 7.1 | 1.3 | +5.8 | 0.5 | 0.2 | 27% |
| τ, choice randomness | 1 | 6.5 | 1.0 | +5.5 | 0.2 | 0.1 | 28% |
| attribution error | 0 (this space) | 7.0 | 3.7 | +3.4 | 1.1 | 0.7 | 22% |
| attribution error | 0.1 | 7.2 | 3.7 | +3.5 | 1.0 | 0.7 | 23% |
| attribution error | 0.3 | 7.0 | 3.7 | +3.3 | 0.9 | 0.7 | 22% |
| attribution error | 0.6 | 7.1 | 3.7 | +3.4 | 1.0 | 0.7 | 22% |

</details>

## What this shows and what it does not

- **It is a simulation** of the [OSO demo specification](../../docs/design.md): ideas are abstract, success is chance, and agents follow a formula. It shows how the incentive rules play out *if* this space works as described, not that it does.
- **The parameters are guesses,** especially the success chances, the scoop risk ψ, and the costs and error rates in section 5. Section 6 varies each one alone; it does not vary them together, except α and c.
- **By default, sharing is free and always correct,** which favours OSO; section 5 shows how much of the lead survives without that.

## Reproduce

```sh
npm run sim -- report abstract-field --seeds 100
```

The space is [spaces/abstract-field.yaml](../../spaces/abstract-field.yaml). Every number above is in [data.json](data.json). Generated by the OSO simulator at commit `3d56faf`.
