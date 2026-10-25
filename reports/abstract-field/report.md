# An abstract research field: OSO vs. traditional research

> A generic field: 80 ideas in 8 levels, about two parents each, four bounties at the top.

**For the same money, the OSO community got further, or got there more cheaply, than the traditional one.**

- **How far:** with a budget of 800, OSO reached level **8.0** of 8 on average; traditional research reached **1.5**.
- **Targets solved:** OSO solved **3.4** of 4; traditional solved **0.3**.
- **Cost to reach level 8:** OSO 398; traditional 622 (in the 19% of runs that got there).
- **Return on the money (ROI):** OSO gained **2.73** in bounty value per unit spent (1756 for 684); traditional **0.17** (133 for 794). Value gained is the bounties of the targets solved.
- **Does flow-back make agents share?** When agents choose, sharing rises clearly (by 0.2 or more) once α is 0.2 or lower. At OSO's default α = 0.8, agents shared 17% of their intermediate ideas.
- **Robustness:** OSO's lead in level is smallest when shared knowledge is **costly and sometimes wrong** (+5.6 levels).
- **Sensitivity:** Across the tested values of the parameters a market or community sets, OSO's lead (agents choosing what to share) runs from **+0.5** to **+5.9** levels. The smallest lead, at f, earnings shape next round's money = 100%, is still clearly positive. The lead is most sensitive to **f, earnings shape next round's money**. Why f matters so much here: under traditional rules, when money follows earnings, the first agent to earn takes the money. In this community that is the gaming agent, which earns early from trivial ideas and then, holding all the money, does the research too. Without a gaming agent the effect disappears (see the funding-rule-gamer experiment).

*The verdict compares the hardest level reached, the targets solved and (when both communities reach level 8 in at least 90% of runs) the cost to get there, each against two standard errors. 100 simulated runs per setting · simulator commit `3d52dde` · 2026-10-25. This is a simulation with guessed parameters, not evidence about real research; see [What this shows](#what-this-shows-and-what-it-does-not).*

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

The community has 12 agents (3 foundation, 3 racer, 2 explorer, 2 specialist, 1 freeRider, 1 gamer) and a budget of 800 over 67 rounds (calibrated: the smallest budget at which OSO solves about 90% of the targets).

## 2. Progress for the money

![Hardest level published by money spent](figures/frontier.svg)

Each line is the mean, over 100 runs, of the hardest level the community had published after spending that much money. A line that ends early means every target was solved and the funder stopped paying.

## 3. The six settings

The rules are the only difference between rows ([specification, section 3](../../docs/design.md#3-the-rules)). Traditional: nothing flows back to what an idea built on, and work is published only when finished. OSO: value flows back (α = 0.8, c = 0.15), and ideas are published at once or when the agent chooses.

| setting | frontier | reach L8 | speed | cost | spend | targets solved | waste | credit | sharing | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 1.5 ± 3.2 | 0.19 | 53 ± 11 | 622 ± 135 | 794 ± 2 | 0.3 ± 0.6 | 0.62 ± 0.03 | 0.19 ± 0.39 | 0.00 ± 0.00 | 0.17 ± 0.37 |
| OSO (immediate) | 8.0 ± 0.0 | 1.00 | 34 ± 12 | 398 ± 143 | 684 ± 114 | 3.4 ± 1.0 | 0.42 ± 0.05 | 0.46 ± 0.13 | 1.00 ± 0.00 | 2.73 ± 1.09 |
| Flow-back, finished-only | 1.3 ± 2.9 | 0.16 | 54 ± 13 | 641 ± 151 | 794 ± 2 | 0.2 ± 0.5 | 0.62 ± 0.03 | 0.16 ± 0.36 | 0.00 ± 0.01 | 0.12 ± 0.30 |
| No flow-back, immediate | 8.0 ± 0.1 | 0.99 | 34 ± 13 | 396 ± 153 | 702 ± 107 | 3.3 ± 1.0 | 0.42 ± 0.05 | 0.36 ± 0.12 | 1.00 ± 0.00 | 2.56 ± 1.05 |
| No flow-back, choice | 6.3 ± 1.8 | 0.37 | 48 ± 15 | 568 ± 179 | 794 ± 2 | 0.4 ± 0.7 | 0.63 ± 0.03 | 0.26 ± 0.41 | 0.18 ± 0.07 | 0.25 ± 0.43 |
| OSO (choice) | 6.0 ± 1.8 | 0.36 | 54 ± 14 | 636 ± 164 | 794 ± 2 | 0.3 ± 0.6 | 0.62 ± 0.04 | 0.25 ± 0.40 | 0.17 ± 0.07 | 0.22 ± 0.36 |

Values are mean ± standard deviation over runs. *frontier*: hardest level published; *reach L8*: share of runs reaching level 8; *speed*, *cost*: rounds and money to reach it; *credit*: how closely bounty pay matches true contribution; *sharing*: share of intermediate ideas published as soon as they were proved.

## 4. Does flow-back make agents share?

![Sharing and reach by α](figures/alpha.svg)

| α | intermediate ideas shared | frontier | reach level 8 | targets solved |
| --- | --- | --- | --- | --- |
| 1 | 18% | 6.3 | 37% | 0.4 |
| 0.8 | 17% | 6.0 | 36% | 0.3 |
| 0.6 | 19% | 6.3 | 38% | 0.3 |
| 0.5 | 21% | 6.6 | 43% | 0.4 |
| 0.4 | 24% | 6.7 | 41% | 0.5 |
| 0.3 | 31% | 7.2 | 53% | 0.8 |
| 0.2 | 39% | 7.4 | 60% | 0.9 |
| 0.1 | 51% | 7.7 | 74% | 1.2 |

Sharing rises clearly once α is 0.2 or lower: this is the threshold α* in this space. The threshold depends on the scoop risk ψ = 0.5, which is a guess.

## 5. When sharing is costly or sometimes wrong

Taking up a published idea costs 0.5; proofs are wrong 10% of the time, ideas built on a wrong idea are wrong too, and targets reveal and retract them.

| shared knowledge | traditional frontier | OSO frontier | OSO lead | traditional targets | OSO targets |
| --- | --- | --- | --- | --- | --- |
| free and correct | 1.5 | 8.0 | +6.5 | 0.3 | 3.4 |
| costly to take up | 1.5 | 7.7 | +6.1 | 0.3 | 1.1 |
| sometimes wrong | 1.9 | 8.0 | +6.0 | 0.3 | 2.3 |
| costly and sometimes wrong | 1.9 | 7.5 | +5.6 | 0.3 | 0.8 |

## 6. Sensitivity to the parameters

In OSO, α and c are set by each community ([OIP-14](https://github.com/open-science-org/OIPs/blob/master/OIPS/oip-14.md)), validators decide how strict the screen is, funders decide how far money follows earnings, and the mint may become a community parameter ([OIP-8](https://github.com/open-science-org/OIPs/blob/master/OIPS/oip-8.md)). Their values will be set by competing communities, not by us, so the result must hold across them. The parameters below the line are our guesses about how agents think.

Each parameter is varied alone, from this space's settings, with agents choosing what to share (the realistic case: incentives matter only if sharing is a choice). The lead is OSO's hardest level reached minus traditional's under the same parameter value; α and c do not exist under traditional rules, so there it is compared with traditional's default.

![OSO's lead by parameter](figures/sensitivity.svg)

Across the tested values of the parameters a market or community sets, OSO's lead (agents choosing what to share) runs from **+0.5** to **+5.9** levels. The smallest lead, at f, earnings shape next round's money = 100%, is still clearly positive. The lead is most sensitive to **f, earnings shape next round's money**. Why f matters so much here: under traditional rules, when money follows earnings, the first agent to earn takes the money. In this community that is the gaming agent, which earns early from trivial ideas and then, holding all the money, does the research too. Without a gaming agent the effect disappears (see the funding-rule-gamer experiment).

| parameter | means | tested | OSO lead (lowest to highest) |
| --- | --- | --- | --- |
| α, absorption rate | how much of the value reaching an idea it absorbs; the rest flows back to what it built on | 0.2, 0.4, 0.6, 0.8, 0.95 | +4.5 to +5.9 |
| c, cited share of the mint | share of each new mint paid to the ideas it built on | 0%, 5%, 15%, 30%, 50% | +4.5 to +4.7 |
| mint per idea | tokens minted for each validated idea, relative to bounties (the smallest bounty is a few units) | 0, 0.5, 1, 2, 4 | +4.2 to +5.0 |
| θ, validation screen | chance validators reject a trivial idea | 0%, 25%, 50%, 75%, 95% | +4.2 to +5.0 |
| f, earnings shape next round's money | share of each round's money funders give by recent earnings rather than equally | 0%, 25%, 50%, 75%, 100% | +0.5 to +5.0 |
| ψ, scoop risk | how likely agents think a shared lemma lets a rival take the target | 0, 0.25, 0.5, 0.75, 0.9 | +4.5 to +6.5 |
| κ, value of being used | how much agents think publishing raises a lemma's use | 0, 0.5, 1, 2, 4 | +4.4 to +4.8 |
| σ₀, perception noise | how noisily agents see the value of what they might attempt | 0, 0.5, 1, 2 | +3.8 to +5.0 |
| τ, choice randomness | how loosely agents follow their best option | 0.05, 0.15, 0.3, 0.6, 1 | +0.9 to +5.8 |
| attribution error | noise in the ledger's weights of what each idea built on | 0, 0.1, 0.3, 0.6 | +4.3 to +4.6 |

The two flow-back levers together:

![Sharing by α and c](figures/flow-back-grid.svg)

| α \ c | 0% | 5% | 15% | 30% | 50% |
| --- | --- | --- | --- | --- | --- |
| 0.95 | 19% · 6.3 | 17% · 6.1 | 17% · 6.2 | 17% · 6.0 | 17% · 6.1 |
| 0.8 | 18% · 6.1 | 18% · 6.2 | 17% · 6.0 | 17% · 6.0 | 17% · 6.2 |
| 0.6 | 20% · 6.4 | 20% · 6.4 | 19% · 6.3 | 20% · 6.3 | 20% · 6.5 |
| 0.4 | 26% · 6.7 | 24% · 6.7 | 24% · 6.7 | 25% · 6.9 | 26% · 6.8 |
| 0.2 | 40% · 7.5 | 40% · 7.4 | 39% · 7.4 | 39% · 7.6 | 39% · 7.4 |

Each cell: share of intermediate ideas published · hardest level reached.

<details><summary>Every tested value</summary>

| parameter | value | OSO frontier | traditional frontier | OSO lead | OSO targets | traditional targets | ideas shared |
| --- | --- | --- | --- | --- | --- | --- | --- |
| α, absorption rate | 0.2 | 7.4 | 1.5 | +5.9 | 0.9 | 0.3 | 39% |
| α, absorption rate | 0.4 | 6.7 | 1.5 | +5.1 | 0.5 | 0.3 | 24% |
| α, absorption rate | 0.6 | 6.3 | 1.5 | +4.8 | 0.3 | 0.3 | 19% |
| α, absorption rate | 0.8 (this space) | 6.0 | 1.5 | +4.5 | 0.3 | 0.3 | 17% |
| α, absorption rate | 0.95 | 6.2 | 1.5 | +4.7 | 0.3 | 0.3 | 17% |
| c, cited share of the mint | 0% | 6.1 | 1.5 | +4.6 | 0.4 | 0.3 | 18% |
| c, cited share of the mint | 5% | 6.2 | 1.5 | +4.6 | 0.4 | 0.3 | 18% |
| c, cited share of the mint | 15% (this space) | 6.0 | 1.5 | +4.5 | 0.3 | 0.3 | 17% |
| c, cited share of the mint | 30% | 6.0 | 1.5 | +4.5 | 0.4 | 0.3 | 17% |
| c, cited share of the mint | 50% | 6.2 | 1.5 | +4.7 | 0.4 | 0.3 | 17% |
| mint per idea | 0 | 5.1 | 0.1 | +5.0 | 0.1 | 0.0 | 16% |
| mint per idea | 0.5 | 6.2 | 1.8 | +4.3 | 0.4 | 0.3 | 18% |
| mint per idea | 1 (this space) | 6.0 | 1.5 | +4.5 | 0.3 | 0.3 | 17% |
| mint per idea | 2 | 6.4 | 2.2 | +4.2 | 0.4 | 0.3 | 19% |
| mint per idea | 4 | 6.3 | 2.1 | +4.2 | 0.4 | 0.3 | 20% |
| θ, validation screen | 0% | 6.2 | 1.6 | +4.6 | 0.4 | 0.2 | 17% |
| θ, validation screen | 25% | 6.1 | 1.8 | +4.2 | 0.4 | 0.3 | 19% |
| θ, validation screen | 50% (this space) | 6.0 | 1.5 | +4.5 | 0.3 | 0.3 | 17% |
| θ, validation screen | 75% | 6.4 | 1.4 | +5.0 | 0.3 | 0.2 | 17% |
| θ, validation screen | 95% | 6.5 | 1.8 | +4.7 | 0.8 | 0.3 | 19% |
| f, earnings shape next round's money | 0% | 5.2 | 0.2 | +5.0 | 0.1 | 0.0 | 16% |
| f, earnings shape next round's money | 25% | 4.8 | 0.2 | +4.5 | 0.1 | 0.0 | 15% |
| f, earnings shape next round's money | 50% (this space) | 6.0 | 1.5 | +4.5 | 0.3 | 0.3 | 17% |
| f, earnings shape next round's money | 75% | 7.4 | 5.1 | +2.3 | 1.1 | 1.1 | 21% |
| f, earnings shape next round's money | 100% | 7.8 | 7.3 | +0.5 | 2.3 | 2.2 | 25% |
| ψ, scoop risk | 0 | 8.0 | 1.5 | +6.5 | 3.3 | 0.3 | 98% |
| ψ, scoop risk | 0.25 | 6.1 | 1.5 | +4.6 | 0.3 | 0.3 | 17% |
| ψ, scoop risk | 0.5 (this space) | 6.0 | 1.5 | +4.5 | 0.3 | 0.3 | 17% |
| ψ, scoop risk | 0.75 | 6.1 | 1.5 | +4.6 | 0.3 | 0.3 | 17% |
| ψ, scoop risk | 0.9 | 6.1 | 1.5 | +4.5 | 0.3 | 0.3 | 17% |
| κ, value of being used | 0 | 6.0 | 1.5 | +4.4 | 0.4 | 0.3 | 17% |
| κ, value of being used | 0.5 | 6.0 | 1.5 | +4.5 | 0.4 | 0.3 | 17% |
| κ, value of being used | 1 (this space) | 6.0 | 1.5 | +4.5 | 0.3 | 0.3 | 17% |
| κ, value of being used | 2 | 6.2 | 1.5 | +4.7 | 0.3 | 0.3 | 18% |
| κ, value of being used | 4 | 6.4 | 1.5 | +4.8 | 0.4 | 0.3 | 18% |
| σ₀, perception noise | 0 | 6.1 | 2.0 | +4.1 | 0.5 | 0.3 | 14% |
| σ₀, perception noise | 0.5 | 5.9 | 2.1 | +3.8 | 0.4 | 0.3 | 14% |
| σ₀, perception noise | 1 (this space) | 6.0 | 1.5 | +4.5 | 0.3 | 0.3 | 17% |
| σ₀, perception noise | 2 | 6.4 | 1.4 | +5.0 | 0.4 | 0.2 | 23% |
| τ, choice randomness | 0.05 | 6.0 | 5.1 | +0.9 | 1.1 | 1.0 | 3% |
| τ, choice randomness | 0.15 | 5.8 | 4.9 | +0.9 | 0.9 | 1.0 | 5% |
| τ, choice randomness | 0.3 (this space) | 6.0 | 1.5 | +4.5 | 0.3 | 0.3 | 17% |
| τ, choice randomness | 0.6 | 6.3 | 0.5 | +5.8 | 0.2 | 0.1 | 23% |
| τ, choice randomness | 1 | 6.1 | 0.7 | +5.4 | 0.1 | 0.1 | 24% |
| attribution error | 0 (this space) | 6.0 | 1.5 | +4.5 | 0.3 | 0.3 | 17% |
| attribution error | 0.1 | 6.1 | 1.5 | +4.6 | 0.4 | 0.3 | 17% |
| attribution error | 0.3 | 5.9 | 1.5 | +4.3 | 0.3 | 0.3 | 17% |
| attribution error | 0.6 | 6.0 | 1.5 | +4.4 | 0.3 | 0.3 | 18% |

</details>

## What this shows and what it does not

- **It is a simulation** of the [OSO demo specification](../../docs/design.md): ideas are abstract, success is chance, and agents follow a formula. It shows how the incentive rules play out *if* this space works as described, not that it does.
- **The parameters are guesses,** especially the success chances, the scoop risk ψ, and the costs and error rates in section 5. Section 6 varies each one alone; it does not vary them together, except α and c.
- **By default, sharing is free and always correct,** which favours OSO; section 5 shows how much of the lead survives without that.

## Reproduce

```sh
npm run sim -- report abstract-field --seeds 100
```

The space is [spaces/abstract-field.yaml](../../spaces/abstract-field.yaml). Every number above is in [data.json](data.json). Generated by the OSO simulator at commit `3d52dde`.
