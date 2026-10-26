# Example: narrow stages (drug discovery story): OSO vs. traditional research

> An example setting of the idea graph generator, told as drug discovery but not measured from it: six stages, each reusing only part of the evidence before it; three bounties.

**For the same money, the OSO community got further, or got there more cheaply, than the traditional one.**

- **How far:** with a budget of 1420, OSO reached level **6.0** of 6 on average; traditional research reached **0.7**.
- **Targets solved:** OSO solved **2.9** of 3; traditional solved **0.1**.
- **Cost to reach level 6:** OSO 530; traditional 1085 (in the 11% of runs that got there).
- **Return on the money (ROI):** OSO gained **1.55** in bounty value per unit spent (1390 for 989); traditional **0.05** (73 for 1414). Value gained is the bounties of the targets solved.
- **Does flow-back make agents share?** When agents choose, sharing rises clearly (by 0.2 or more) once α is 0.4 or lower. At OSO's default α = 0.8, agents shared 44% of their intermediate ideas.
- **Robustness:** OSO's lead in level is smallest when shared knowledge is **costly to take up** (+5.3 levels).
- **Sensitivity:** Across the tested values of the parameters a market or community sets, OSO's lead (agents choosing what to share) runs from **+2.1** to **+5.3** levels. The smallest lead, at mint per idea = 4, is still clearly positive. The lead is most sensitive to **mint per idea**.

*The verdict compares the hardest level reached, the targets solved and (when both communities reach level 6 in at least 90% of runs) the cost to get there, each against two standard errors. 100 simulated runs per setting · simulator commit `dc540e2` · 2026-10-26. This is a simulation with guessed parameters, not evidence about real research; see [What this shows](#what-this-shows-and-what-it-does-not).*

## 1. The problem space

Early-stage drug discovery. Validated biology (a disease mechanism) supports target identification; targets support screening assays; assays find hits; hits are optimized into leads; and a lead with enough evidence becomes a development candidate. Each stage is much harder than the one before, and many hits and leads go nowhere. Three disease areas (oncology, immunology, neuroscience) share some early biology. Labs either publish each step as they go or keep it until they have a candidate.

| In this space | means |
| --- | --- |
| an idea | a validated piece of evidence (mechanism, target, assay, hit or lead) |
| a target | a development candidate, worth a large bounty |
| an attempt | one experimental campaign |
| an agent | a lab |

![The research tree](figures/world.svg)

The tree has 54 ideas in 6 levels. 23 are dead ends: no target depends on them. 3 are targets:

| target | level | bounty | ideas it rests on |
| --- | --- | --- | --- |
| T1 | 6 | 486 | 11 |
| T2 | 6 | 486 | 13 |
| T3 | 6 | 486 | 11 |

How hard each level is, before an agent's skill:

| level | ideas | targets | chance per attempt, parents known | sequence length (bits) |
| --- | --- | --- | --- | --- |
| 1 | 9 | 0 | 25% | 2.0 |
| 2 | 9 | 0 | 25% | 4.0 |
| 3 | 9 | 0 | 13% | 6.0 |
| 4 | 9 | 0 | 6% | 8.0 |
| 5 | 9 | 0 | 2% | 10.0 |
| 6 | 9 | 3 | 1% | 12.0 |

The community has 12 agents (3 foundation, 3 racer, 2 explorer, 2 specialist, 1 freeRider, 1 gamer) and a budget of 1420 over 118 rounds (calibrated: the smallest budget at which OSO solves about 90% of the targets).

## 2. Progress for the money

![Hardest level published by money spent](figures/frontier.svg)

Each line is the mean, over 100 runs, of the hardest level the community had published after spending that much money. A line that ends early means every target was solved and the funder stopped paying.

## 3. The six settings

The rules are the only difference between rows ([the design](../../docs/design.md#the-rules-compared)). Traditional: nothing flows back to what an idea built on, and work is published only when finished. OSO: value flows back (α = 0.8, c = 0.15), and ideas are published at once or when the agent chooses.

| setting | frontier | reach L6 | speed | cost | spend | targets solved | waste | credit | sharing | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 0.7 ± 1.9 | 0.11 | 90 ± 29 | 1085 ± 350 | 1414 ± 19 | 0.1 ± 0.5 | 0.73 ± 0.05 | 0.11 ± 0.31 | 0.00 ± 0.00 | 0.05 ± 0.18 |
| OSO (immediate) | 6.0 ± 0.0 | 1.00 | 44 ± 19 | 530 ± 234 | 989 ± 264 | 2.9 ± 0.5 | 0.45 ± 0.06 | 0.61 ± 0.11 | 1.00 ± 0.00 | 1.55 ± 0.58 |
| Flow-back, finished-only | 0.8 ± 2.0 | 0.13 | 91 ± 26 | 1095 ± 317 | 1414 ± 17 | 0.2 ± 0.5 | 0.73 ± 0.05 | 0.13 ± 0.34 | 0.00 ± 0.00 | 0.06 ± 0.19 |
| No flow-back, immediate | 6.0 ± 0.0 | 1.00 | 47 ± 20 | 562 ± 235 | 974 ± 283 | 2.8 ± 0.6 | 0.45 ± 0.07 | 0.51 ± 0.15 | 1.00 ± 0.00 | 1.58 ± 0.67 |
| No flow-back, choice | 5.7 ± 0.5 | 0.72 | 72 ± 26 | 866 ± 314 | 1316 ± 201 | 1.3 ± 1.3 | 0.65 ± 0.07 | 0.51 ± 0.44 | 0.43 ± 0.13 | 0.58 ± 0.64 |
| OSO (choice) | 5.7 ± 0.6 | 0.80 | 73 ± 25 | 879 ± 303 | 1277 ± 232 | 1.5 ± 1.3 | 0.64 ± 0.07 | 0.58 ± 0.42 | 0.44 ± 0.12 | 0.70 ± 0.76 |

Values are mean ± standard deviation over runs. *frontier*: hardest level published; *reach L6*: share of runs reaching level 6; *speed*, *cost*: rounds and money to reach it; *credit*: how closely bounty pay matches true contribution; *sharing*: share of intermediate ideas published as soon as they were proved.

## 4. Does flow-back make agents share?

![Sharing and reach by α](figures/alpha.svg)

| α | intermediate ideas shared | frontier | reach level 6 | targets solved |
| --- | --- | --- | --- | --- |
| 1 | 43% | 5.7 | 72% | 1.3 |
| 0.8 | 44% | 5.7 | 80% | 1.5 |
| 0.6 | 50% | 5.9 | 88% | 1.8 |
| 0.5 | 58% | 5.9 | 93% | 1.7 |
| 0.4 | 67% | 5.9 | 94% | 2.1 |
| 0.3 | 75% | 6.0 | 97% | 2.4 |
| 0.2 | 81% | 6.0 | 100% | 2.7 |
| 0.1 | 87% | 6.0 | 100% | 2.8 |

Sharing rises clearly once α is 0.4 or lower: this is the threshold α* in this space. The threshold depends on the scoop risk ψ = 0.5, which is a guess.

## 5. When sharing is costly or sometimes wrong

Taking up a published idea costs 0.5; proofs are wrong 10% of the time, ideas built on a wrong idea are wrong too, and targets reveal and retract them.

| shared knowledge | traditional frontier | OSO frontier | OSO lead | traditional targets | OSO targets |
| --- | --- | --- | --- | --- | --- |
| free and correct | 0.7 | 6.0 | +5.3 | 0.1 | 2.9 |
| costly to take up | 0.7 | 6.0 | +5.3 | 0.1 | 2.4 |
| sometimes wrong | 0.2 | 6.0 | +5.8 | 0.0 | 2.5 |
| costly and sometimes wrong | 0.2 | 6.0 | +5.7 | 0.0 | 1.7 |

## 6. Sensitivity to the parameters

In OSO, α and c are set by each community ([OIP-14](https://github.com/open-science-org/OIPs/blob/master/OIPS/oip-14.md)), validators decide how strict the screen is, funders decide how far money follows earnings, and the mint may become a community parameter ([OIP-8](https://github.com/open-science-org/OIPs/blob/master/OIPS/oip-8.md)). Their values will be set by competing communities, not by us, so the result must hold across them. The parameters below the line are our guesses about how agents think.

Each parameter is varied alone, from this space's settings, with agents choosing what to share (the realistic case: incentives matter only if sharing is a choice). The lead is OSO's hardest level reached minus traditional's under the same parameter value; α and c do not exist under traditional rules, so there it is compared with traditional's default.

![OSO's lead by parameter](figures/sensitivity.svg)

Across the tested values of the parameters a market or community sets, OSO's lead (agents choosing what to share) runs from **+2.1** to **+5.3** levels. The smallest lead, at mint per idea = 4, is still clearly positive. The lead is most sensitive to **mint per idea**.

| parameter | means | tested | OSO lead (lowest to highest) |
| --- | --- | --- | --- |
| α, absorption rate | how much of the value reaching an idea it absorbs; the rest flows back to what it built on | 0.2, 0.4, 0.6, 0.8, 0.95 | +5.0 to +5.3 |
| c, cited share of the mint | share of each new mint paid to the ideas it built on | 0%, 5%, 15%, 30%, 50% | +5.1 to +5.1 |
| mint per idea | tokens minted for each validated idea, relative to bounties (the smallest bounty is a few units) | 0, 0.5, 1, 2, 4 | +2.1 to +5.1 |
| θ, validation screen | chance validators reject a trivial idea | 0%, 25%, 50%, 75%, 95% | +5.1 to +5.1 |
| f, earnings shape next round's money | share of each round's money funders give by recent earnings rather than equally | 0%, 25%, 50%, 75%, 100% | +4.0 to +5.3 |
| ψ, scoop risk | how likely agents think a shared lemma lets a rival take the target | 0, 0.25, 0.5, 0.75, 0.9 | +5.0 to +5.3 |
| κ, value of being used | how much agents think publishing raises a lemma's use | 0, 0.5, 1, 2, 4 | +5.0 to +5.2 |
| σ₀, perception noise | how noisily agents see the value of what they might attempt | 0, 0.5, 1, 2 | +5.1 to +5.2 |
| τ, choice randomness | how loosely agents follow their best option | 0.05, 0.15, 0.3, 0.6, 1 | +2.9 to +5.5 |
| attribution error | noise in the ledger's weights of what each idea built on | 0, 0.1, 0.3, 0.6 | +5.0 to +5.1 |

The two flow-back levers together:

![Sharing by α and c](figures/flow-back-grid.svg)

| α \ c | 0% | 5% | 15% | 30% | 50% |
| --- | --- | --- | --- | --- | --- |
| 0.95 | 42% · 5.6 | 42% · 5.6 | 42% · 5.6 | 42% · 5.6 | 42% · 5.6 |
| 0.8 | 44% · 5.7 | 44% · 5.7 | 44% · 5.7 | 44% · 5.7 | 44% · 5.7 |
| 0.6 | 50% · 5.9 | 50% · 5.9 | 50% · 5.9 | 50% · 5.9 | 50% · 5.9 |
| 0.4 | 67% · 5.9 | 67% · 5.9 | 67% · 5.9 | 67% · 5.9 | 67% · 5.9 |
| 0.2 | 81% · 6.0 | 81% · 6.0 | 81% · 6.0 | 81% · 6.0 | 81% · 6.0 |

Each cell: share of intermediate ideas published · hardest level reached.

<details><summary>Every tested value</summary>

| parameter | value | OSO frontier | traditional frontier | OSO lead | OSO targets | traditional targets | ideas shared |
| --- | --- | --- | --- | --- | --- | --- | --- |
| α, absorption rate | 0.2 | 6.0 | 0.7 | +5.3 | 2.7 | 0.1 | 81% |
| α, absorption rate | 0.4 | 5.9 | 0.7 | +5.3 | 2.1 | 0.1 | 67% |
| α, absorption rate | 0.6 | 5.9 | 0.7 | +5.2 | 1.8 | 0.1 | 50% |
| α, absorption rate | 0.8 (this space) | 5.7 | 0.7 | +5.1 | 1.5 | 0.1 | 44% |
| α, absorption rate | 0.95 | 5.6 | 0.7 | +5.0 | 1.6 | 0.1 | 42% |
| c, cited share of the mint | 0% | 5.7 | 0.7 | +5.1 | 1.5 | 0.1 | 44% |
| c, cited share of the mint | 5% | 5.7 | 0.7 | +5.1 | 1.5 | 0.1 | 44% |
| c, cited share of the mint | 15% (this space) | 5.7 | 0.7 | +5.1 | 1.5 | 0.1 | 44% |
| c, cited share of the mint | 30% | 5.7 | 0.7 | +5.1 | 1.5 | 0.1 | 44% |
| c, cited share of the mint | 50% | 5.7 | 0.7 | +5.1 | 1.5 | 0.1 | 44% |
| mint per idea | 0 (this space) | 5.7 | 0.7 | +5.1 | 1.5 | 0.1 | 44% |
| mint per idea | 0.5 | 5.2 | 3.1 | +2.1 | 0.6 | 0.7 | 39% |
| mint per idea | 1 | 5.4 | 3.1 | +2.3 | 1.0 | 0.7 | 40% |
| mint per idea | 2 | 5.4 | 3.1 | +2.2 | 0.9 | 0.6 | 40% |
| mint per idea | 4 | 5.5 | 3.4 | +2.1 | 1.0 | 0.8 | 42% |
| θ, validation screen | 0% | 5.7 | 0.7 | +5.1 | 1.5 | 0.1 | 44% |
| θ, validation screen | 25% | 5.7 | 0.7 | +5.1 | 1.5 | 0.1 | 44% |
| θ, validation screen | 50% (this space) | 5.7 | 0.7 | +5.1 | 1.5 | 0.1 | 44% |
| θ, validation screen | 75% | 5.7 | 0.7 | +5.1 | 1.5 | 0.1 | 44% |
| θ, validation screen | 95% | 5.7 | 0.7 | +5.1 | 1.5 | 0.1 | 44% |
| f, earnings shape next round's money | 0% | 4.7 | 0.7 | +4.0 | 0.2 | 0.1 | 39% |
| f, earnings shape next round's money | 25% | 5.2 | 0.7 | +4.5 | 0.6 | 0.1 | 40% |
| f, earnings shape next round's money | 50% (this space) | 5.7 | 0.7 | +5.1 | 1.5 | 0.1 | 44% |
| f, earnings shape next round's money | 75% | 5.9 | 0.7 | +5.2 | 2.0 | 0.1 | 45% |
| f, earnings shape next round's money | 100% | 6.0 | 0.7 | +5.3 | 2.4 | 0.2 | 46% |
| ψ, scoop risk | 0 | 6.0 | 0.7 | +5.3 | 2.9 | 0.1 | 100% |
| ψ, scoop risk | 0.25 | 5.8 | 0.7 | +5.1 | 1.6 | 0.1 | 46% |
| ψ, scoop risk | 0.5 (this space) | 5.7 | 0.7 | +5.1 | 1.5 | 0.1 | 44% |
| ψ, scoop risk | 0.75 | 5.7 | 0.7 | +5.1 | 1.5 | 0.1 | 43% |
| ψ, scoop risk | 0.9 | 5.7 | 0.7 | +5.0 | 1.4 | 0.1 | 43% |
| κ, value of being used | 0 | 5.7 | 0.7 | +5.0 | 1.5 | 0.1 | 42% |
| κ, value of being used | 0.5 | 5.7 | 0.7 | +5.0 | 1.4 | 0.1 | 43% |
| κ, value of being used | 1 (this space) | 5.7 | 0.7 | +5.1 | 1.5 | 0.1 | 44% |
| κ, value of being used | 2 | 5.8 | 0.7 | +5.1 | 1.7 | 0.1 | 45% |
| κ, value of being used | 4 | 5.9 | 0.7 | +5.2 | 1.9 | 0.1 | 48% |
| σ₀, perception noise | 0 | 5.7 | 0.5 | +5.2 | 1.3 | 0.1 | 43% |
| σ₀, perception noise | 0.5 | 5.8 | 0.6 | +5.2 | 1.5 | 0.1 | 42% |
| σ₀, perception noise | 1 (this space) | 5.7 | 0.7 | +5.1 | 1.5 | 0.1 | 44% |
| σ₀, perception noise | 2 | 5.8 | 0.7 | +5.1 | 1.5 | 0.2 | 48% |
| τ, choice randomness | 0.05 | 4.9 | 2.0 | +2.9 | 1.4 | 0.7 | 26% |
| τ, choice randomness | 0.15 | 5.6 | 1.6 | +3.9 | 1.8 | 0.4 | 33% |
| τ, choice randomness | 0.3 (this space) | 5.7 | 0.7 | +5.1 | 1.5 | 0.1 | 44% |
| τ, choice randomness | 0.6 | 5.7 | 0.2 | +5.5 | 1.0 | 0.0 | 48% |
| τ, choice randomness | 1 | 5.6 | 0.2 | +5.4 | 0.6 | 0.0 | 48% |
| attribution error | 0 (this space) | 5.7 | 0.7 | +5.1 | 1.5 | 0.1 | 44% |
| attribution error | 0.1 | 5.7 | 0.7 | +5.0 | 1.5 | 0.1 | 44% |
| attribution error | 0.3 | 5.7 | 0.7 | +5.0 | 1.5 | 0.1 | 43% |
| attribution error | 0.6 | 5.8 | 0.7 | +5.1 | 1.4 | 0.1 | 44% |

</details>

## What this shows and what it does not

- **It is a simulation** of the [OSO demo specification](../../docs/design.md): ideas are abstract, success is chance, and agents follow a formula. It shows how the incentive rules play out *if* this space works as described, not that it does.
- **The parameters are guesses,** especially the success chances, the scoop risk ψ, and the costs and error rates in section 5. Section 6 varies each one alone; it does not vary them together, except α and c.
- **By default, sharing is free and always correct,** which favours OSO; section 5 shows how much of the lead survives without that.
- **Notes for this space:** A preset of the idea graph generator. Each stage reuses only part of the evidence before it (composition 0.5), many hits and leads go nowhere, and the stages get much harder. The numbers are illustrative, not measured from the field.

## Reproduce

```sh
npm run sim -- report example-narrow-stages --seeds 100
```

The space is [spaces/example-narrow-stages.yaml](../../spaces/example-narrow-stages.yaml) (written by hand as an example of a new problem space). Every number above is in [data.json](data.json). Generated by the OSO simulator at commit `dc540e2`.
