# Example: small and tightly linked (battery story): OSO vs. traditional research

> An example setting of the idea graph generator, told as a battery but not measured from it: 20 ideas, each leaning heavily on several earlier ones; two bounties.

**For the same money, the OSO community got further, or got there more cheaply, than the traditional one.**

- **How far:** with a budget of 180, OSO reached level **5.0** of 5 on average; traditional research reached **0.3**.
- **Targets solved:** OSO solved **1.9** of 2; traditional solved **0.1**.
- **Cost to reach level 5:** OSO 94; traditional 142 (in the 6% of runs that got there).
- **Return on the money (ROI):** OSO gained **6.46** in bounty value per unit spent (740 for 128); traditional **0.17** (28 for 179). Value gained is the bounties of the targets solved.
- **Does flow-back make agents share?** When agents choose, sharing rises clearly (by 0.2 or more) once α is 0.6 or lower. At OSO's default α = 0.8, agents shared 8% of their intermediate ideas.
- **Robustness:** OSO's lead in level is smallest when shared knowledge is **costly and sometimes wrong** (+4.4 levels).
- **Sensitivity:** Across the tested values of the parameters a market or community sets, OSO's lead (agents choosing what to share) runs from **+0.6** to **+4.5** levels. The smallest lead, at mint per idea = 0.5, is still clearly positive. The lead is most sensitive to **α, absorption rate**.

*The verdict compares the hardest level reached, the targets solved and (when both communities reach level 5 in at least 90% of runs) the cost to get there, each against two standard errors. 100 simulated runs per setting · simulator commit `dc540e2` · 2026-10-26. This is a simulation with guessed parameters, not evidence about real research; see [What this shows](#what-this-shows-and-what-it-does-not).*

## 1. The problem space

Building a solid-state lithium battery. Three lines of work run in parallel: the solid electrolyte (finding a conducting material, making it stable and making it thin), the interfaces (stopping dendrites and keeping contact as the cell breathes), and manufacturing (making layers at scale). A working laboratory cell needs ideas from all three; a cell that survives a thousand cycles needs more. Some promising lines (a polymer electrolyte, a coating that never scales) lead nowhere.

| In this space | means |
| --- | --- |
| an idea | a demonstrated material property or process step |
| a target | a cell that meets a performance milestone |
| an attempt | one round of synthesis and testing |
| an agent | a lab or startup |

![The research tree](figures/world.svg)

The tree has 20 ideas in 5 levels. 3 are dead ends: no target depends on them. 2 are targets:

| target | level | bounty | ideas it rests on |
| --- | --- | --- | --- |
| T1 | 5 | 400 | 12 |
| T2 | 5 | 400 | 12 |

How hard each level is, before an agent's skill:

| level | ideas | targets | chance per attempt, parents known | sequence length (bits) |
| --- | --- | --- | --- | --- |
| 1 | 4 | 0 | 13% | 3.0 |
| 2 | 4 | 0 | 50% | 5.0 |
| 3 | 4 | 0 | 31% | 7.0 |
| 4 | 4 | 0 | 17% | 9.0 |
| 5 | 4 | 2 | 17% | 11.0 |

The community has 12 agents (3 foundation, 3 racer, 2 explorer, 2 specialist, 1 freeRider, 1 gamer) and a budget of 180 over 15 rounds (calibrated: the smallest budget at which OSO solves about 90% of the targets).

## 2. Progress for the money

![Hardest level published by money spent](figures/frontier.svg)

Each line is the mean, over 100 runs, of the hardest level the community had published after spending that much money. A line that ends early means every target was solved and the funder stopped paying.

## 3. The six settings

The rules are the only difference between rows ([the design](../../docs/design.md#the-rules-compared)). Traditional: nothing flows back to what an idea built on, and work is published only when finished. OSO: value flows back (α = 0.8, c = 0.15), and ideas are published at once or when the agent chooses.

| setting | frontier | reach L5 | speed | cost | spend | targets solved | waste | credit | sharing | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 0.3 ± 1.2 | 0.06 | 12 ± 2 | 142 ± 30 | 179 ± 4 | 0.1 ± 0.3 | 0.38 ± 0.10 | 0.06 ± 0.24 | 0.00 ± 0.03 | 0.17 ± 0.75 |
| OSO (immediate) | 5.0 ± 0.0 | 1.00 | 8 ± 3 | 94 ± 32 | 128 ± 35 | 1.9 ± 0.4 | 0.20 ± 0.07 | 0.46 ± 0.16 | 1.00 ± 0.00 | 6.46 ± 2.73 |
| Flow-back, finished-only | 0.2 ± 1.0 | 0.04 | 12 ± 2 | 141 ± 25 | 180 ± 1 | 0.0 ± 0.2 | 0.39 ± 0.10 | 0.04 ± 0.20 | 0.00 ± 0.00 | 0.09 ± 0.45 |
| No flow-back, immediate | 5.0 ± 0.2 | 0.96 | 8 ± 3 | 91 ± 34 | 130 ± 35 | 1.8 ± 0.6 | 0.19 ± 0.06 | 0.37 ± 0.22 | 1.00 ± 0.00 | 6.14 ± 2.93 |
| No flow-back, choice | 1.3 ± 2.0 | 0.18 | 12 ± 3 | 138 ± 37 | 177 ± 10 | 0.3 ± 0.6 | 0.37 ± 0.10 | 0.18 ± 0.38 | 0.05 ± 0.10 | 0.69 ± 1.64 |
| OSO (choice) | 1.8 ± 2.2 | 0.28 | 12 ± 3 | 136 ± 33 | 175 ± 13 | 0.4 ± 0.8 | 0.37 ± 0.09 | 0.24 ± 0.41 | 0.08 ± 0.12 | 1.10 ± 2.01 |

Values are mean ± standard deviation over runs. *frontier*: hardest level published; *reach L5*: share of runs reaching level 5; *speed*, *cost*: rounds and money to reach it; *credit*: how closely bounty pay matches true contribution; *sharing*: share of intermediate ideas published as soon as they were proved.

## 4. Does flow-back make agents share?

![Sharing and reach by α](figures/alpha.svg)

| α | intermediate ideas shared | frontier | reach level 5 | targets solved |
| --- | --- | --- | --- | --- |
| 1 | 5% | 1.3 | 18% | 0.3 |
| 0.8 | 8% | 1.8 | 28% | 0.4 |
| 0.6 | 28% | 4.0 | 70% | 1.0 |
| 0.5 | 38% | 4.4 | 77% | 1.2 |
| 0.4 | 44% | 4.7 | 86% | 1.4 |
| 0.3 | 48% | 4.8 | 89% | 1.6 |
| 0.2 | 54% | 4.8 | 87% | 1.6 |
| 0.1 | 61% | 4.9 | 94% | 1.7 |

Sharing rises clearly once α is 0.6 or lower: this is the threshold α* in this space. The threshold depends on the scoop risk ψ = 0.5, which is a guess.

## 5. When sharing is costly or sometimes wrong

Taking up a published idea costs 0.5; proofs are wrong 10% of the time, ideas built on a wrong idea are wrong too, and targets reveal and retract them.

| shared knowledge | traditional frontier | OSO frontier | OSO lead | traditional targets | OSO targets |
| --- | --- | --- | --- | --- | --- |
| free and correct | 0.3 | 5.0 | +4.7 | 0.1 | 1.9 |
| costly to take up | 0.3 | 4.7 | +4.4 | 0.1 | 1.2 |
| sometimes wrong | 0.1 | 4.9 | +4.8 | 0.0 | 1.6 |
| costly and sometimes wrong | 0.1 | 4.5 | +4.4 | 0.0 | 0.9 |

## 6. Sensitivity to the parameters

In OSO, α and c are set by each community ([OIP-14](https://github.com/open-science-org/OIPs/blob/master/OIPS/oip-14.md)), validators decide how strict the screen is, funders decide how far money follows earnings, and the mint may become a community parameter ([OIP-8](https://github.com/open-science-org/OIPs/blob/master/OIPS/oip-8.md)). Their values will be set by competing communities, not by us, so the result must hold across them. The parameters below the line are our guesses about how agents think.

Each parameter is varied alone, from this space's settings, with agents choosing what to share (the realistic case: incentives matter only if sharing is a choice). The lead is OSO's hardest level reached minus traditional's under the same parameter value; α and c do not exist under traditional rules, so there it is compared with traditional's default.

![OSO's lead by parameter](figures/sensitivity.svg)

Across the tested values of the parameters a market or community sets, OSO's lead (agents choosing what to share) runs from **+0.6** to **+4.5** levels. The smallest lead, at mint per idea = 0.5, is still clearly positive. The lead is most sensitive to **α, absorption rate**.

| parameter | means | tested | OSO lead (lowest to highest) |
| --- | --- | --- | --- |
| α, absorption rate | how much of the value reaching an idea it absorbs; the rest flows back to what it built on | 0.2, 0.4, 0.6, 0.8, 0.95 | +1.1 to +4.5 |
| c, cited share of the mint | share of each new mint paid to the ideas it built on | 0%, 5%, 15%, 30%, 50% | +1.5 to +1.5 |
| mint per idea | tokens minted for each validated idea, relative to bounties (the smallest bounty is a few units) | 0, 0.5, 1, 2, 4 | +0.6 to +1.6 |
| θ, validation screen | chance validators reject a trivial idea | 0%, 25%, 50%, 75%, 95% | +1.5 to +1.5 |
| f, earnings shape next round's money | share of each round's money funders give by recent earnings rather than equally | 0%, 25%, 50%, 75%, 100% | +0.7 to +1.6 |
| ψ, scoop risk | how likely agents think a shared lemma lets a rival take the target | 0, 0.25, 0.5, 0.75, 0.9 | +1.1 to +4.7 |
| κ, value of being used | how much agents think publishing raises a lemma's use | 0, 0.5, 1, 2, 4 | +0.9 to +2.5 |
| σ₀, perception noise | how noisily agents see the value of what they might attempt | 0, 0.5, 1, 2 | +0.9 to +2.1 |
| τ, choice randomness | how loosely agents follow their best option | 0.05, 0.15, 0.3, 0.6, 1 | +0.8 to +2.1 |
| attribution error | noise in the ledger's weights of what each idea built on | 0, 0.1, 0.3, 0.6 | +1.4 to +1.5 |

The two flow-back levers together:

![Sharing by α and c](figures/flow-back-grid.svg)

| α \ c | 0% | 5% | 15% | 30% | 50% |
| --- | --- | --- | --- | --- | --- |
| 0.95 | 5% · 1.4 | 5% · 1.4 | 5% · 1.4 | 5% · 1.4 | 5% · 1.4 |
| 0.8 | 8% · 1.8 | 8% · 1.8 | 8% · 1.8 | 8% · 1.8 | 8% · 1.8 |
| 0.6 | 28% · 4.0 | 28% · 4.0 | 28% · 4.0 | 28% · 4.0 | 28% · 4.0 |
| 0.4 | 44% · 4.7 | 44% · 4.7 | 44% · 4.7 | 44% · 4.7 | 44% · 4.7 |
| 0.2 | 54% · 4.8 | 54% · 4.8 | 54% · 4.8 | 54% · 4.8 | 54% · 4.8 |

Each cell: share of intermediate ideas published · hardest level reached.

<details><summary>Every tested value</summary>

| parameter | value | OSO frontier | traditional frontier | OSO lead | OSO targets | traditional targets | ideas shared |
| --- | --- | --- | --- | --- | --- | --- | --- |
| α, absorption rate | 0.2 | 4.8 | 0.3 | +4.5 | 1.6 | 0.1 | 54% |
| α, absorption rate | 0.4 | 4.7 | 0.3 | +4.4 | 1.4 | 0.1 | 44% |
| α, absorption rate | 0.6 | 4.0 | 0.3 | +3.7 | 1.0 | 0.1 | 28% |
| α, absorption rate | 0.8 (this space) | 1.8 | 0.3 | +1.5 | 0.4 | 0.1 | 8% |
| α, absorption rate | 0.95 | 1.4 | 0.3 | +1.1 | 0.3 | 0.1 | 5% |
| c, cited share of the mint | 0% | 1.8 | 0.3 | +1.5 | 0.4 | 0.1 | 8% |
| c, cited share of the mint | 5% | 1.8 | 0.3 | +1.5 | 0.4 | 0.1 | 8% |
| c, cited share of the mint | 15% (this space) | 1.8 | 0.3 | +1.5 | 0.4 | 0.1 | 8% |
| c, cited share of the mint | 30% | 1.8 | 0.3 | +1.5 | 0.4 | 0.1 | 8% |
| c, cited share of the mint | 50% | 1.8 | 0.3 | +1.5 | 0.4 | 0.1 | 8% |
| mint per idea | 0 (this space) | 1.8 | 0.3 | +1.5 | 0.4 | 0.1 | 8% |
| mint per idea | 0.5 | 1.3 | 0.7 | +0.6 | 0.1 | 0.2 | 8% |
| mint per idea | 1 | 1.4 | 0.6 | +0.8 | 0.1 | 0.1 | 8% |
| mint per idea | 2 | 1.7 | 0.6 | +1.1 | 0.2 | 0.1 | 10% |
| mint per idea | 4 | 2.2 | 0.6 | +1.6 | 0.2 | 0.2 | 14% |
| θ, validation screen | 0% | 1.8 | 0.3 | +1.5 | 0.4 | 0.1 | 8% |
| θ, validation screen | 25% | 1.8 | 0.3 | +1.5 | 0.4 | 0.1 | 8% |
| θ, validation screen | 50% (this space) | 1.8 | 0.3 | +1.5 | 0.4 | 0.1 | 8% |
| θ, validation screen | 75% | 1.8 | 0.3 | +1.5 | 0.4 | 0.1 | 8% |
| θ, validation screen | 95% | 1.8 | 0.3 | +1.5 | 0.4 | 0.1 | 8% |
| f, earnings shape next round's money | 0% | 1.0 | 0.3 | +0.7 | 0.1 | 0.1 | 6% |
| f, earnings shape next round's money | 25% | 1.3 | 0.3 | +1.0 | 0.1 | 0.1 | 7% |
| f, earnings shape next round's money | 50% (this space) | 1.8 | 0.3 | +1.5 | 0.4 | 0.1 | 8% |
| f, earnings shape next round's money | 75% | 1.8 | 0.3 | +1.5 | 0.5 | 0.1 | 10% |
| f, earnings shape next round's money | 100% | 1.9 | 0.3 | +1.6 | 0.6 | 0.1 | 10% |
| ψ, scoop risk | 0 | 5.0 | 0.3 | +4.7 | 1.9 | 0.1 | 100% |
| ψ, scoop risk | 0.25 | 2.6 | 0.3 | +2.3 | 0.6 | 0.1 | 14% |
| ψ, scoop risk | 0.5 (this space) | 1.8 | 0.3 | +1.5 | 0.4 | 0.1 | 8% |
| ψ, scoop risk | 0.75 | 1.4 | 0.3 | +1.1 | 0.3 | 0.1 | 5% |
| ψ, scoop risk | 0.9 | 1.4 | 0.3 | +1.1 | 0.3 | 0.1 | 5% |
| κ, value of being used | 0 | 1.2 | 0.3 | +0.9 | 0.3 | 0.1 | 5% |
| κ, value of being used | 0.5 | 1.6 | 0.3 | +1.3 | 0.4 | 0.1 | 7% |
| κ, value of being used | 1 (this space) | 1.8 | 0.3 | +1.5 | 0.4 | 0.1 | 8% |
| κ, value of being used | 2 | 2.1 | 0.3 | +1.8 | 0.4 | 0.1 | 11% |
| κ, value of being used | 4 | 2.8 | 0.3 | +2.5 | 0.6 | 0.1 | 19% |
| σ₀, perception noise | 0 | 1.1 | 0.2 | +0.9 | 0.3 | 0.0 | 5% |
| σ₀, perception noise | 0.5 | 1.1 | 0.2 | +0.9 | 0.3 | 0.0 | 5% |
| σ₀, perception noise | 1 (this space) | 1.8 | 0.3 | +1.5 | 0.4 | 0.1 | 8% |
| σ₀, perception noise | 2 | 2.3 | 0.2 | +2.1 | 0.5 | 0.1 | 13% |
| τ, choice randomness | 0.05 | 1.1 | 0.3 | +0.8 | 0.3 | 0.1 | 5% |
| τ, choice randomness | 0.15 | 1.1 | 0.3 | +0.8 | 0.2 | 0.1 | 4% |
| τ, choice randomness | 0.3 (this space) | 1.8 | 0.3 | +1.5 | 0.4 | 0.1 | 8% |
| τ, choice randomness | 0.6 | 2.1 | 0.1 | +1.9 | 0.5 | 0.0 | 13% |
| τ, choice randomness | 1 | 2.2 | 0.1 | +2.1 | 0.5 | 0.0 | 14% |
| attribution error | 0 (this space) | 1.8 | 0.3 | +1.5 | 0.4 | 0.1 | 8% |
| attribution error | 0.1 | 1.7 | 0.3 | +1.4 | 0.4 | 0.1 | 7% |
| attribution error | 0.3 | 1.7 | 0.3 | +1.4 | 0.3 | 0.1 | 7% |
| attribution error | 0.6 | 1.7 | 0.3 | +1.4 | 0.3 | 0.1 | 8% |

</details>

## What this shows and what it does not

- **It is a simulation** of the [OSO demo specification](../../docs/design.md): ideas are abstract, success is chance, and agents follow a formula. It shows how the incentive rules play out *if* this space works as described, not that it does.
- **The parameters are guesses,** especially the success chances, the scoop risk ψ, and the costs and error rates in section 5. Section 6 varies each one alone; it does not vary them together, except α and c.
- **By default, sharing is free and always correct,** which favours OSO; section 5 shows how much of the lead survives without that.
- **Notes for this space:** A preset of the idea graph generator. A small field where ideas lean heavily on what came before (composition 0.8) and each one needs several earlier results (2.5 parents). The numbers are illustrative, not measured from the field.

## Reproduce

```sh
npm run sim -- report example-tightly-linked --seeds 100
```

The space is [spaces/example-tightly-linked.yaml](../../spaces/example-tightly-linked.yaml) (written by hand as an example of a space listed idea by idea (the graph world)). Every number above is in [data.json](data.json). Generated by the OSO simulator at commit `dc540e2`.
