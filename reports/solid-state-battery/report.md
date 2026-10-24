# A solid-state battery: OSO vs. traditional research

> A small field of 20 ideas, from electrolyte chemistry to a working cell, where each idea leans heavily on earlier ones; two bounties.

**For the same money, the OSO community got further, or got there more cheaply, than the traditional one.**

- **How far:** with a budget of 230, OSO reached level **5.0** of 5 on average; traditional research reached **1.4**.
- **Targets solved:** OSO solved **1.8** of 2; traditional solved **0.4**.
- **Cost to reach level 5:** OSO 109 (in the 98% of runs that got there); traditional 186 (in the 28% of runs that got there).
- **Return on the money (ROI):** OSO gained **6.05** in bounty value per unit spent (728 for 144); traditional **0.68** (144 for 225). Value gained is the bounties of the targets solved.
- **Does flow-back make agents share?** When agents choose, sharing rises clearly (by 0.2 or more) once α is 0.5 or lower. At OSO's default α = 0.8, agents shared 12% of their intermediate ideas.
- **Robustness:** OSO's lead in level is smallest when shared knowledge is **costly to take up** (+3.3 levels).
- **Sensitivity:** Across the tested values of the parameters a market or community sets, OSO's lead (agents choosing what to share) runs from **+0.5** to **+3.4** levels. The smallest lead, at ρ, money follows earnings = 100%, is **within noise: no clear difference there**. The lead is most sensitive to **α, absorption rate**.

*The verdict compares the hardest level reached, the targets solved and (when both communities reach level 5 in at least 90% of runs) the cost to get there, each against two standard errors. 100 simulated runs per setting · simulator commit `81f6c4a+` · 2026-10-24. This is a simulation with guessed parameters, not evidence about real research; see [What this shows](#what-this-shows-and-what-it-does-not).*

## 1. The problem space

Building a solid-state lithium battery. Three lines of work run in parallel: the solid electrolyte (finding a conducting material, making it stable and making it thin), the interfaces (stopping dendrites and keeping contact as the cell breathes), and manufacturing (making layers at scale). A working laboratory cell needs ideas from all three; a cell that survives a thousand cycles needs more. Some promising lines (a polymer electrolyte, a coating that never scales) lead nowhere.

| In this space | means |
| --- | --- |
| an idea | a demonstrated material property or process step |
| a target | a cell that meets a performance milestone |
| an attempt | one round of synthesis and testing |
| an agent | a lab or startup |

![The research tree](figures/world.svg)

The tree has 20 ideas in 5 levels. 6 are dead ends: no target depends on them. 2 are targets:

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

The community has 12 agents (3 foundation, 3 racer, 2 explorer, 2 specialist, 1 freeRider, 1 gamer) and a budget of 230 over 19 rounds (calibrated: the smallest budget at which OSO solves about 90% of the targets).

## 2. Progress for the money

![Hardest level published by money spent](figures/frontier.svg)

Each line is the mean, over 100 runs, of the hardest level the community had published after spending that much money. A line that ends early means every target was solved and the funder stopped paying.

## 3. The six settings

The rules are the only difference between rows ([specification, section 3](../../docs/design.md#3-the-rules)). Traditional: nothing flows back to what an idea built on, and work is published only when finished. OSO: value flows back (α = 0.8, c = 0.15), and ideas are published at once or when the agent chooses.

| setting | frontier | reach L5 | speed | cost | spend | targets solved | waste | credit | sharing | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 1.4 ± 2.3 | 0.28 | 16 ± 3 | 186 ± 37 | 225 ± 11 | 0.4 ± 0.6 | 0.42 ± 0.12 | 0.28 ± 0.45 | 0.01 ± 0.04 | 0.68 ± 1.25 |
| OSO (immediate) | 5.0 ± 0.2 | 0.98 | 9 ± 4 | 109 ± 49 | 144 ± 52 | 1.8 ± 0.5 | 0.78 ± 0.08 | 0.48 ± 0.19 | 1.00 ± 0.00 | 6.05 ± 2.97 |
| Flow-back, finished-only | 1.1 ± 2.1 | 0.23 | 15 ± 3 | 184 ± 40 | 225 ± 12 | 0.3 ± 0.6 | 0.41 ± 0.12 | 0.23 ± 0.42 | 0.01 ± 0.02 | 0.56 ± 1.19 |
| No flow-back, immediate | 5.0 ± 0.2 | 0.96 | 9 ± 3 | 104 ± 42 | 152 ± 51 | 1.9 ± 0.5 | 0.77 ± 0.11 | 0.34 ± 0.16 | 1.00 ± 0.00 | 5.74 ± 2.82 |
| No flow-back, choice | 2.2 ± 2.2 | 0.33 | 16 ± 3 | 186 ± 36 | 225 ± 12 | 0.4 ± 0.7 | 0.45 ± 0.13 | 0.27 ± 0.42 | 0.08 ± 0.10 | 0.81 ± 1.39 |
| OSO (choice) | 2.5 ± 2.2 | 0.40 | 14 ± 4 | 171 ± 47 | 223 ± 13 | 0.5 ± 0.8 | 0.48 ± 0.16 | 0.31 ± 0.42 | 0.12 ± 0.13 | 1.01 ± 1.49 |

Values are mean ± standard deviation over runs. *frontier*: hardest level published; *reach L5*: share of runs reaching level 5; *speed*, *cost*: rounds and money to reach it; *credit*: how closely bounty pay matches true contribution; *sharing*: share of intermediate ideas published as soon as they were proved.

## 4. Does flow-back make agents share?

![Sharing and reach by α](figures/alpha.svg)

| α | intermediate ideas shared | frontier | reach level 5 | targets solved |
| --- | --- | --- | --- | --- |
| 1 | 8% | 2.2 | 33% | 0.4 |
| 0.8 | 12% | 2.5 | 40% | 0.5 |
| 0.6 | 24% | 3.8 | 61% | 0.9 |
| 0.5 | 30% | 4.0 | 66% | 0.9 |
| 0.4 | 39% | 4.4 | 76% | 1.2 |
| 0.3 | 48% | 4.6 | 78% | 1.3 |
| 0.2 | 56% | 4.8 | 87% | 1.5 |
| 0.1 | 64% | 4.9 | 91% | 1.6 |

Sharing rises clearly once α is 0.5 or lower: this is the threshold α* in this space. The threshold depends on the scoop risk ψ = 0.5, which is a guess.

## 5. When sharing is costly or sometimes wrong

Taking up a published idea costs 0.5; proofs are wrong 10% of the time, ideas built on a wrong idea are wrong too, and targets reveal and retract them.

| shared knowledge | traditional frontier | OSO frontier | OSO lead | traditional targets | OSO targets |
| --- | --- | --- | --- | --- | --- |
| free and correct | 1.4 | 5.0 | +3.6 | 0.4 | 1.8 |
| costly to take up | 1.4 | 4.7 | +3.3 | 0.3 | 1.2 |
| sometimes wrong | 1.2 | 4.9 | +3.7 | 0.3 | 1.7 |
| costly and sometimes wrong | 1.2 | 4.6 | +3.4 | 0.3 | 1.0 |

## 6. Sensitivity to the parameters

In OSO, α and c are set by each community ([OIP-14](https://github.com/open-science-org/OIPs/blob/master/OIPS/oip-14.md)), validators decide how strict the screen is, funders decide how far money follows earnings, and the mint may become a community parameter ([OIP-8](https://github.com/open-science-org/OIPs/blob/master/OIPS/oip-8.md)). Their values will be set by competing communities, not by us, so the result must hold across them. The parameters below the line are our guesses about how agents think.

Each parameter is varied alone, from this space's settings, with agents choosing what to share (the realistic case: incentives matter only if sharing is a choice). The lead is OSO's hardest level reached minus traditional's under the same parameter value; α and c do not exist under traditional rules, so there it is compared with traditional's default.

![OSO's lead by parameter](figures/sensitivity.svg)

Across the tested values of the parameters a market or community sets, OSO's lead (agents choosing what to share) runs from **+0.5** to **+3.4** levels. The smallest lead, at ρ, money follows earnings = 100%, is **within noise: no clear difference there**. The lead is most sensitive to **α, absorption rate**.

| parameter | means | tested | OSO lead (lowest to highest) |
| --- | --- | --- | --- |
| α, absorption rate | how much of the value reaching an idea it absorbs; the rest flows back to what it built on | 0.2, 0.4, 0.6, 0.8, 0.95 | +0.9 to +3.4 |
| c, cited share of the mint | share of each new mint paid to the ideas it built on | 0%, 5%, 15%, 30%, 50% | +1.1 to +1.3 |
| mint per idea | tokens minted for each validated idea, relative to bounties (the smallest bounty is a few units) | 0, 0.5, 1, 2, 4 | +1.1 to +1.8 |
| θ, validation screen | chance validators reject a trivial idea | 0%, 25%, 50%, 75%, 95% | +0.9 to +2.2 |
| ρ, money follows earnings | share of each round's money funders give by recent earnings rather than equally | 0%, 25%, 50%, 75%, 100% | +0.5 to +1.4 |
| ψ, scoop risk | how likely agents think a shared lemma lets a rival take the target | 0, 0.25, 0.5, 0.75, 0.9 | +0.8 to +3.6 |
| κ, value of being used | how much agents think publishing raises a lemma's use | 0, 0.5, 1, 2, 4 | +0.7 to +1.6 |
| σ₀, perception noise | how noisily agents see the value of what they might attempt | 0, 0.5, 1, 2 | +1.0 to +1.4 |
| τ, choice randomness | how loosely agents follow their best option | 0.05, 0.15, 0.3, 0.6, 1 | +0.6 to +1.8 |
| attribution error | noise in the ledger's weights of what each idea built on | 0, 0.1, 0.3, 0.6 | +1.0 to +1.2 |

The two flow-back levers together:

![Sharing by α and c](figures/flow-back-grid.svg)

| α \ c | 0% | 5% | 15% | 30% | 50% |
| --- | --- | --- | --- | --- | --- |
| 0.95 | 8% · 2.3 | 8% · 2.3 | 8% · 2.3 | 8% · 2.2 | 8% · 2.2 |
| 0.8 | 13% · 2.6 | 13% · 2.5 | 12% · 2.5 | 12% · 2.6 | 13% · 2.7 |
| 0.6 | 25% · 3.7 | 26% · 3.8 | 24% · 3.8 | 24% · 3.7 | 24% · 3.7 |
| 0.4 | 39% · 4.4 | 39% · 4.4 | 39% · 4.4 | 39% · 4.3 | 39% · 4.3 |
| 0.2 | 55% · 4.9 | 54% · 4.8 | 56% · 4.8 | 55% · 4.9 | 54% · 4.8 |

Each cell: share of intermediate ideas published · hardest level reached.

<details><summary>Every tested value</summary>

| parameter | value | OSO frontier | traditional frontier | OSO lead | OSO targets | traditional targets | ideas shared |
| --- | --- | --- | --- | --- | --- | --- | --- |
| α, absorption rate | 0.2 | 4.8 | 1.4 | +3.4 | 1.5 | 0.4 | 56% |
| α, absorption rate | 0.4 | 4.4 | 1.4 | +3.0 | 1.2 | 0.4 | 39% |
| α, absorption rate | 0.6 | 3.8 | 1.4 | +2.4 | 0.9 | 0.4 | 24% |
| α, absorption rate | 0.8 (this space) | 2.5 | 1.4 | +1.1 | 0.5 | 0.4 | 12% |
| α, absorption rate | 0.95 | 2.3 | 1.4 | +0.9 | 0.4 | 0.4 | 8% |
| c, cited share of the mint | 0% | 2.6 | 1.4 | +1.2 | 0.5 | 0.4 | 13% |
| c, cited share of the mint | 5% | 2.5 | 1.4 | +1.1 | 0.5 | 0.4 | 13% |
| c, cited share of the mint | 15% (this space) | 2.5 | 1.4 | +1.1 | 0.5 | 0.4 | 12% |
| c, cited share of the mint | 30% | 2.6 | 1.4 | +1.2 | 0.5 | 0.4 | 12% |
| c, cited share of the mint | 50% | 2.7 | 1.4 | +1.3 | 0.6 | 0.4 | 13% |
| mint per idea | 0 | 1.9 | 0.6 | +1.3 | 0.2 | 0.2 | 10% |
| mint per idea | 0.5 | 2.5 | 1.4 | +1.1 | 0.5 | 0.3 | 12% |
| mint per idea | 1 (this space) | 2.5 | 1.4 | +1.1 | 0.5 | 0.4 | 12% |
| mint per idea | 2 | 2.5 | 1.3 | +1.2 | 0.5 | 0.3 | 13% |
| mint per idea | 4 | 3.2 | 1.4 | +1.8 | 0.6 | 0.4 | 17% |
| θ, validation screen | 0% | 2.8 | 1.9 | +1.0 | 0.7 | 0.5 | 12% |
| θ, validation screen | 25% | 2.6 | 1.7 | +0.9 | 0.6 | 0.5 | 14% |
| θ, validation screen | 50% (this space) | 2.5 | 1.4 | +1.1 | 0.5 | 0.4 | 12% |
| θ, validation screen | 75% | 2.3 | 1.1 | +1.3 | 0.4 | 0.3 | 12% |
| θ, validation screen | 95% | 2.6 | 0.4 | +2.2 | 0.7 | 0.1 | 13% |
| ρ, money follows earnings | 0% | 1.9 | 0.5 | +1.4 | 0.2 | 0.1 | 10% |
| ρ, money follows earnings | 25% | 1.7 | 0.6 | +1.1 | 0.3 | 0.1 | 8% |
| ρ, money follows earnings | 50% (this space) | 2.5 | 1.4 | +1.1 | 0.5 | 0.4 | 12% |
| ρ, money follows earnings | 75% | 3.5 | 2.7 | +0.8 | 0.9 | 0.8 | 16% |
| ρ, money follows earnings | 100% | 4.3 | 3.9 | +0.5 | 1.4 | 1.3 | 21% |
| ψ, scoop risk | 0 | 5.0 | 1.4 | +3.6 | 1.8 | 0.4 | 99% |
| ψ, scoop risk | 0.25 | 3.0 | 1.4 | +1.6 | 0.7 | 0.4 | 15% |
| ψ, scoop risk | 0.5 (this space) | 2.5 | 1.4 | +1.1 | 0.5 | 0.4 | 12% |
| ψ, scoop risk | 0.75 | 2.3 | 1.4 | +0.9 | 0.5 | 0.4 | 11% |
| ψ, scoop risk | 0.9 | 2.2 | 1.4 | +0.8 | 0.4 | 0.4 | 10% |
| κ, value of being used | 0 | 2.1 | 1.4 | +0.7 | 0.4 | 0.4 | 9% |
| κ, value of being used | 0.5 | 2.3 | 1.4 | +0.9 | 0.4 | 0.4 | 10% |
| κ, value of being used | 1 (this space) | 2.5 | 1.4 | +1.1 | 0.5 | 0.4 | 12% |
| κ, value of being used | 2 | 2.8 | 1.4 | +1.4 | 0.6 | 0.4 | 14% |
| κ, value of being used | 4 | 3.0 | 1.4 | +1.6 | 0.6 | 0.4 | 20% |
| σ₀, perception noise | 0 | 2.5 | 1.5 | +1.0 | 0.6 | 0.3 | 10% |
| σ₀, perception noise | 0.5 | 2.5 | 1.2 | +1.3 | 0.5 | 0.3 | 10% |
| σ₀, perception noise | 1 (this space) | 2.5 | 1.4 | +1.1 | 0.5 | 0.4 | 12% |
| σ₀, perception noise | 2 | 2.6 | 1.2 | +1.4 | 0.5 | 0.3 | 14% |
| τ, choice randomness | 0.05 | 2.7 | 2.0 | +0.6 | 0.6 | 0.5 | 7% |
| τ, choice randomness | 0.15 | 2.5 | 1.9 | +0.6 | 0.6 | 0.5 | 7% |
| τ, choice randomness | 0.3 (this space) | 2.5 | 1.4 | +1.1 | 0.5 | 0.4 | 12% |
| τ, choice randomness | 0.6 | 2.4 | 0.6 | +1.8 | 0.3 | 0.1 | 15% |
| τ, choice randomness | 1 | 2.4 | 0.7 | +1.7 | 0.3 | 0.2 | 18% |
| attribution error | 0 (this space) | 2.5 | 1.4 | +1.1 | 0.5 | 0.4 | 12% |
| attribution error | 0.1 | 2.5 | 1.4 | +1.1 | 0.6 | 0.4 | 13% |
| attribution error | 0.3 | 2.4 | 1.4 | +1.0 | 0.5 | 0.4 | 10% |
| attribution error | 0.6 | 2.6 | 1.4 | +1.2 | 0.5 | 0.4 | 12% |

</details>

## What this shows and what it does not

- **It is a simulation** of the [OSO demo specification](../../docs/design.md): ideas are abstract, success is chance, and agents follow a formula. It shows how the incentive rules play out *if* this space works as described, not that it does.
- **The parameters are guesses,** especially the success chances, the scoop risk ψ, and the costs and error rates in section 5. Section 6 varies each one alone; it does not vary them together, except α and c.
- **By default, sharing is free and always correct,** which favours OSO; section 5 shows how much of the lead survives without that.
- **Notes for this space:** A preset of the idea graph generator. A small field where ideas lean heavily on what came before (composition 0.8) and each one needs several earlier results (2.5 parents). The numbers are illustrative, not measured from the field.

## Reproduce

```sh
npm run sim -- report solid-state-battery --seeds 100
```

The space is [spaces/solid-state-battery.yaml](../../spaces/solid-state-battery.yaml) (written by hand as an example of a space listed idea by idea (the graph world)). Every number above is in [data.json](data.json). Generated by the OSO simulator at commit `81f6c4a+` (with uncommitted changes).
