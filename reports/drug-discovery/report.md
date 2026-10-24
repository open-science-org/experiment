# Early-stage drug discovery: OSO vs. traditional research

> Six stages from biology to a development candidate; each stage reuses only part of the evidence before it, and three candidates carry bounties.

**For the same money, the OSO community got further, or got there more cheaply, than the traditional one.**

- **How far:** with a budget of 1400, OSO reached level **6.0** of 6 on average; traditional research reached **3.5**.
- **Targets solved:** OSO solved **2.7** of 3; traditional solved **0.8**.
- **Cost to reach level 6:** OSO 627 (in the 99% of runs that got there); traditional 1040 (in the 58% of runs that got there).
- **Return on the money (ROI):** OSO gained **1.40** in bounty value per unit spent (1302 for 1055); traditional **0.30** (403 for 1386). Value gained is the bounties of the targets solved.
- **Does flow-back make agents share?** When agents choose, sharing rises clearly (by 0.2 or more) once α is 0.3 or lower. At OSO's default α = 0.8, agents shared 41% of their intermediate ideas.
- **Robustness:** OSO's lead in level is smallest when shared knowledge is **costly to take up** (+2.4 levels).
- **Sensitivity:** Across the tested values of the parameters a market or community sets, OSO's lead (agents choosing what to share) runs from **+0.2** to **+4.6** levels. The smallest lead, at ρ, money follows earnings = 100%, is **within noise: no clear difference there**. The lead is most sensitive to **ρ, money follows earnings**. Why ρ matters so much here: under traditional rules, when money follows earnings, the first agent to earn takes the money. In this community that is the gaming agent, which earns early from trivial ideas and then, holding all the money, does the research too. Without a gaming agent the effect disappears (see the funding-rule-gamer experiment).

*The verdict compares the hardest level reached, the targets solved and (when both communities reach level 6 in at least 90% of runs) the cost to get there, each against two standard errors. 100 simulated runs per setting · simulator commit `81f6c4a+` · 2026-10-24. This is a simulation with guessed parameters, not evidence about real research; see [What this shows](#what-this-shows-and-what-it-does-not).*

## 1. The problem space

Early-stage drug discovery. Validated biology (a disease mechanism) supports target identification; targets support screening assays; assays find hits; hits are optimized into leads; and a lead with enough evidence becomes a development candidate. Each stage is much harder than the one before, and many hits and leads go nowhere. Three disease areas (oncology, immunology, neuroscience) share some early biology. Labs either publish each step as they go or keep it until they have a candidate.

| In this space | means |
| --- | --- |
| an idea | a validated piece of evidence (mechanism, target, assay, hit or lead) |
| a target | a development candidate, worth a large bounty |
| an attempt | one experimental campaign |
| an agent | a lab |

![The research tree](figures/world.svg)

The tree has 54 ideas in 6 levels. 31 are dead ends: no target depends on them. 3 are targets:

| target | level | bounty | ideas it rests on |
| --- | --- | --- | --- |
| T1 | 6 | 486 | 11 |
| T2 | 6 | 486 | 3 |
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

The community has 12 agents (3 foundation, 3 racer, 2 explorer, 2 specialist, 1 freeRider, 1 gamer) and a budget of 1400 over 117 rounds (calibrated: the smallest budget at which OSO solves about 90% of the targets).

## 2. Progress for the money

![Hardest level published by money spent](figures/frontier.svg)

Each line is the mean, over 100 runs, of the hardest level the community had published after spending that much money. A line that ends early means every target was solved and the funder stopped paying.

## 3. The six settings

The rules are the only difference between rows ([specification, section 3](../../docs/design.md#3-the-rules)). Traditional: nothing flows back to what an idea built on, and work is published only when finished. OSO: value flows back (α = 0.8, c = 0.15), and ideas are published at once or when the agent chooses.

| setting | frontier | reach L6 | speed | cost | spend | targets solved | waste | credit | sharing | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 3.5 ± 3.0 | 0.58 | 87 ± 22 | 1040 ± 266 | 1386 ± 52 | 0.8 ± 0.8 | 0.61 ± 0.12 | 0.58 ± 0.49 | 0.00 ± 0.00 | 0.30 ± 0.32 |
| OSO (immediate) | 6.0 ± 0.1 | 0.99 | 53 ± 22 | 627 ± 267 | 1055 ± 279 | 2.7 ± 0.7 | 0.87 ± 0.06 | 0.64 ± 0.13 | 1.00 ± 0.00 | 1.40 ± 0.65 |
| Flow-back, finished-only | 3.2 ± 3.0 | 0.54 | 83 ± 21 | 984 ± 246 | 1382 ± 60 | 0.8 ± 0.9 | 0.62 ± 0.13 | 0.54 ± 0.50 | 0.00 ± 0.01 | 0.31 ± 0.36 |
| No flow-back, immediate | 6.0 ± 0.1 | 0.99 | 53 ± 22 | 625 ± 259 | 1117 ± 256 | 2.5 ± 0.8 | 0.85 ± 0.07 | 0.54 ± 0.16 | 1.00 ± 0.00 | 1.23 ± 0.59 |
| No flow-back, choice | 5.5 ± 0.9 | 0.68 | 78 ± 22 | 923 ± 268 | 1378 ± 65 | 0.9 ± 1.0 | 0.66 ± 0.10 | 0.54 ± 0.47 | 0.41 ± 0.13 | 0.34 ± 0.38 |
| OSO (choice) | 5.5 ± 0.8 | 0.64 | 81 ± 23 | 961 ± 279 | 1383 ± 47 | 1.0 ± 1.0 | 0.69 ± 0.11 | 0.55 ± 0.46 | 0.41 ± 0.13 | 0.34 ± 0.36 |

Values are mean ± standard deviation over runs. *frontier*: hardest level published; *reach L6*: share of runs reaching level 6; *speed*, *cost*: rounds and money to reach it; *credit*: how closely bounty pay matches true contribution; *sharing*: share of intermediate ideas published as soon as they were proved.

## 4. Does flow-back make agents share?

![Sharing and reach by α](figures/alpha.svg)

| α | intermediate ideas shared | frontier | reach level 6 | targets solved |
| --- | --- | --- | --- | --- |
| 1 | 41% | 5.5 | 68% | 0.9 |
| 0.8 | 41% | 5.5 | 64% | 1.0 |
| 0.6 | 46% | 5.6 | 76% | 1.3 |
| 0.5 | 52% | 5.6 | 75% | 1.3 |
| 0.4 | 60% | 5.8 | 85% | 1.7 |
| 0.3 | 70% | 5.9 | 93% | 2.1 |
| 0.2 | 77% | 6.0 | 96% | 2.5 |
| 0.1 | 85% | 6.0 | 99% | 2.6 |

Sharing rises clearly once α is 0.3 or lower: this is the threshold α* in this space. The threshold depends on the scoop risk ψ = 0.5, which is a guess.

## 5. When sharing is costly or sometimes wrong

Taking up a published idea costs 0.5; proofs are wrong 10% of the time, ideas built on a wrong idea are wrong too, and targets reveal and retract them.

| shared knowledge | traditional frontier | OSO frontier | OSO lead | traditional targets | OSO targets |
| --- | --- | --- | --- | --- | --- |
| free and correct | 3.5 | 6.0 | +2.5 | 0.8 | 2.7 |
| costly to take up | 3.5 | 5.9 | +2.4 | 0.8 | 2.2 |
| sometimes wrong | 1.9 | 5.9 | +4.0 | 0.4 | 2.0 |
| costly and sometimes wrong | 1.9 | 5.8 | +3.9 | 0.4 | 1.4 |

## 6. Sensitivity to the parameters

In OSO, α and c are set by each community ([OIP-14](https://github.com/open-science-org/OIPs/blob/master/OIPS/oip-14.md)), validators decide how strict the screen is, funders decide how far money follows earnings, and the mint may become a community parameter ([OIP-8](https://github.com/open-science-org/OIPs/blob/master/OIPS/oip-8.md)). Their values will be set by competing communities, not by us, so the result must hold across them. The parameters below the line are our guesses about how agents think.

Each parameter is varied alone, from this space's settings, with agents choosing what to share (the realistic case: incentives matter only if sharing is a choice). The lead is OSO's hardest level reached minus traditional's under the same parameter value; α and c do not exist under traditional rules, so there it is compared with traditional's default.

![OSO's lead by parameter](figures/sensitivity.svg)

Across the tested values of the parameters a market or community sets, OSO's lead (agents choosing what to share) runs from **+0.2** to **+4.6** levels. The smallest lead, at ρ, money follows earnings = 100%, is **within noise: no clear difference there**. The lead is most sensitive to **ρ, money follows earnings**. Why ρ matters so much here: under traditional rules, when money follows earnings, the first agent to earn takes the money. In this community that is the gaming agent, which earns early from trivial ideas and then, holding all the money, does the research too. Without a gaming agent the effect disappears (see the funding-rule-gamer experiment).

| parameter | means | tested | OSO lead (lowest to highest) |
| --- | --- | --- | --- |
| α, absorption rate | how much of the value reaching an idea it absorbs; the rest flows back to what it built on | 0.2, 0.4, 0.6, 0.8, 0.95 | +2.0 to +2.5 |
| c, cited share of the mint | share of each new mint paid to the ideas it built on | 0%, 5%, 15%, 30%, 50% | +1.8 to +2.0 |
| mint per idea | tokens minted for each validated idea, relative to bounties (the smallest bounty is a few units) | 0, 0.5, 1, 2, 4 | +1.9 to +4.6 |
| θ, validation screen | chance validators reject a trivial idea | 0%, 25%, 50%, 75%, 95% | +2.0 to +3.0 |
| ρ, money follows earnings | share of each round's money funders give by recent earnings rather than equally | 0%, 25%, 50%, 75%, 100% | +0.2 to +4.4 |
| ψ, scoop risk | how likely agents think a shared lemma lets a rival take the target | 0, 0.25, 0.5, 0.75, 0.9 | +1.9 to +2.5 |
| κ, value of being used | how much agents think publishing raises a lemma's use | 0, 0.5, 1, 2, 4 | +1.9 to +2.1 |
| σ₀, perception noise | how noisily agents see the value of what they might attempt | 0, 0.5, 1, 2 | +1.8 to +2.5 |
| τ, choice randomness | how loosely agents follow their best option | 0.05, 0.15, 0.3, 0.6, 1 | +0.2 to +4.4 |
| attribution error | noise in the ledger's weights of what each idea built on | 0, 0.1, 0.3, 0.6 | +1.9 to +2.0 |

The two flow-back levers together:

![Sharing by α and c](figures/flow-back-grid.svg)

| α \ c | 0% | 5% | 15% | 30% | 50% |
| --- | --- | --- | --- | --- | --- |
| 0.95 | 40% · 5.4 | 41% · 5.5 | 41% · 5.5 | 40% · 5.5 | 40% · 5.4 |
| 0.8 | 43% · 5.5 | 41% · 5.3 | 41% · 5.5 | 42% · 5.4 | 41% · 5.2 |
| 0.6 | 47% · 5.5 | 47% · 5.5 | 46% · 5.6 | 46% · 5.5 | 46% · 5.5 |
| 0.4 | 62% · 5.8 | 61% · 5.9 | 60% · 5.8 | 61% · 5.7 | 62% · 5.8 |
| 0.2 | 78% · 6.0 | 77% · 5.9 | 77% · 6.0 | 77% · 5.9 | 78% · 6.0 |

Each cell: share of intermediate ideas published · hardest level reached.

<details><summary>Every tested value</summary>

| parameter | value | OSO frontier | traditional frontier | OSO lead | OSO targets | traditional targets | ideas shared |
| --- | --- | --- | --- | --- | --- | --- | --- |
| α, absorption rate | 0.2 | 6.0 | 3.5 | +2.5 | 2.5 | 0.8 | 77% |
| α, absorption rate | 0.4 | 5.8 | 3.5 | +2.4 | 1.7 | 0.8 | 60% |
| α, absorption rate | 0.6 | 5.6 | 3.5 | +2.2 | 1.3 | 0.8 | 46% |
| α, absorption rate | 0.8 (this space) | 5.5 | 3.5 | +2.0 | 1.0 | 0.8 | 41% |
| α, absorption rate | 0.95 | 5.5 | 3.5 | +2.0 | 0.9 | 0.8 | 41% |
| c, cited share of the mint | 0% | 5.5 | 3.5 | +2.0 | 0.9 | 0.8 | 43% |
| c, cited share of the mint | 5% | 5.3 | 3.5 | +1.8 | 0.8 | 0.8 | 41% |
| c, cited share of the mint | 15% (this space) | 5.5 | 3.5 | +2.0 | 1.0 | 0.8 | 41% |
| c, cited share of the mint | 30% | 5.4 | 3.5 | +1.9 | 0.9 | 0.8 | 42% |
| c, cited share of the mint | 50% | 5.2 | 3.5 | +1.8 | 0.7 | 0.8 | 41% |
| mint per idea | 0 | 5.0 | 0.5 | +4.6 | 0.7 | 0.1 | 43% |
| mint per idea | 0.5 | 5.3 | 3.4 | +1.9 | 0.9 | 0.8 | 41% |
| mint per idea | 1 (this space) | 5.5 | 3.5 | +2.0 | 1.0 | 0.8 | 41% |
| mint per idea | 2 | 5.4 | 3.2 | +2.2 | 1.1 | 0.8 | 42% |
| mint per idea | 4 | 5.4 | 3.4 | +2.1 | 0.9 | 0.7 | 43% |
| θ, validation screen | 0% | 5.4 | 3.2 | +2.1 | 0.8 | 0.8 | 42% |
| θ, validation screen | 25% | 5.5 | 3.1 | +2.4 | 1.1 | 0.8 | 42% |
| θ, validation screen | 50% (this space) | 5.5 | 3.5 | +2.0 | 1.0 | 0.8 | 41% |
| θ, validation screen | 75% | 5.4 | 3.4 | +2.0 | 0.9 | 0.8 | 41% |
| θ, validation screen | 95% | 5.5 | 2.5 | +3.0 | 1.0 | 0.5 | 44% |
| ρ, money follows earnings | 0% | 5.0 | 0.5 | +4.4 | 0.3 | 0.1 | 42% |
| ρ, money follows earnings | 25% | 5.0 | 1.0 | +4.1 | 0.5 | 0.2 | 42% |
| ρ, money follows earnings | 50% (this space) | 5.5 | 3.5 | +2.0 | 1.0 | 0.8 | 41% |
| ρ, money follows earnings | 75% | 5.8 | 5.2 | +0.6 | 1.7 | 1.6 | 43% |
| ρ, money follows earnings | 100% | 6.0 | 5.8 | +0.2 | 2.4 | 2.2 | 44% |
| ψ, scoop risk | 0 | 6.0 | 3.5 | +2.5 | 2.6 | 0.8 | 99% |
| ψ, scoop risk | 0.25 | 5.5 | 3.5 | +2.0 | 1.0 | 0.8 | 43% |
| ψ, scoop risk | 0.5 (this space) | 5.5 | 3.5 | +2.0 | 1.0 | 0.8 | 41% |
| ψ, scoop risk | 0.75 | 5.4 | 3.5 | +1.9 | 0.8 | 0.8 | 40% |
| ψ, scoop risk | 0.9 | 5.5 | 3.5 | +2.0 | 0.8 | 0.8 | 41% |
| κ, value of being used | 0 | 5.4 | 3.5 | +1.9 | 0.8 | 0.8 | 39% |
| κ, value of being used | 0.5 | 5.4 | 3.5 | +1.9 | 0.8 | 0.8 | 40% |
| κ, value of being used | 1 (this space) | 5.5 | 3.5 | +2.0 | 1.0 | 0.8 | 41% |
| κ, value of being used | 2 | 5.5 | 3.5 | +2.1 | 1.0 | 0.8 | 44% |
| κ, value of being used | 4 | 5.6 | 3.5 | +2.1 | 1.0 | 0.8 | 45% |
| σ₀, perception noise | 0 | 5.4 | 3.7 | +1.8 | 0.9 | 0.9 | 40% |
| σ₀, perception noise | 0.5 | 5.3 | 3.5 | +1.9 | 0.9 | 0.8 | 40% |
| σ₀, perception noise | 1 (this space) | 5.5 | 3.5 | +2.0 | 1.0 | 0.8 | 41% |
| σ₀, perception noise | 2 | 5.5 | 3.0 | +2.5 | 0.9 | 0.7 | 46% |
| τ, choice randomness | 0.05 | 5.4 | 5.2 | +0.2 | 1.5 | 1.6 | 19% |
| τ, choice randomness | 0.15 | 5.4 | 5.3 | +0.2 | 1.5 | 1.5 | 24% |
| τ, choice randomness | 0.3 (this space) | 5.5 | 3.5 | +2.0 | 1.0 | 0.8 | 41% |
| τ, choice randomness | 0.6 | 5.2 | 0.9 | +4.3 | 0.3 | 0.2 | 47% |
| τ, choice randomness | 1 | 5.2 | 0.8 | +4.4 | 0.2 | 0.1 | 49% |
| attribution error | 0 (this space) | 5.5 | 3.5 | +2.0 | 1.0 | 0.8 | 41% |
| attribution error | 0.1 | 5.5 | 3.5 | +2.0 | 0.9 | 0.8 | 41% |
| attribution error | 0.3 | 5.4 | 3.5 | +1.9 | 1.0 | 0.8 | 41% |
| attribution error | 0.6 | 5.3 | 3.5 | +1.9 | 1.0 | 0.8 | 42% |

</details>

## What this shows and what it does not

- **It is a simulation** of the [OSO demo specification](../../docs/design.md): ideas are abstract, success is chance, and agents follow a formula. It shows how the incentive rules play out *if* this space works as described, not that it does.
- **The parameters are guesses,** especially the success chances, the scoop risk ψ, and the costs and error rates in section 5. Section 6 varies each one alone; it does not vary them together, except α and c.
- **By default, sharing is free and always correct,** which favours OSO; section 5 shows how much of the lead survives without that.
- **Notes for this space:** A preset of the idea graph generator. Each stage reuses only part of the evidence before it (composition 0.5), many hits and leads go nowhere, and the stages get much harder. The numbers are illustrative, not measured from the field.

## Reproduce

```sh
npm run sim -- report drug-discovery --seeds 100
```

The space is [spaces/drug-discovery.yaml](../../spaces/drug-discovery.yaml) (written by hand as an example of a new problem space). Every number above is in [data.json](data.json). Generated by the OSO simulator at commit `81f6c4a+` (with uncommitted changes).
