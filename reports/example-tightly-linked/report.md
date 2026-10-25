# Example: small and tightly linked (battery story): OSO vs. traditional research

> An example setting of the idea graph generator, told as a battery but not measured from it: 20 ideas, each leaning heavily on several earlier ones; two bounties.

**For the same money, the OSO community got further, or got there more cheaply, than the traditional one.**

- **How far:** with a budget of 260, OSO reached level **5.0** of 5 on average; traditional research reached **1.6**.
- **Targets solved:** OSO solved **1.9** of 2; traditional solved **0.4**.
- **Cost to reach level 5:** OSO 120; traditional 188 (in the 33% of runs that got there).
- **Return on the money (ROI):** OSO gained **5.36** in bounty value per unit spent (772 for 165); traditional **0.74** (172 for 251). Value gained is the bounties of the targets solved.
- **Does flow-back make agents share?** When agents choose, sharing rises clearly (by 0.2 or more) once α is 0.5 or lower. At OSO's default α = 0.8, agents shared 10% of their intermediate ideas.
- **Robustness:** OSO's lead in level is smallest when shared knowledge is **costly to take up** (+3.1 levels).
- **Sensitivity:** Across the tested values of the parameters a market or community sets, OSO's lead (agents choosing what to share) runs from **+0.4** to **+3.2** levels. The smallest lead, at f, earnings shape next round's money = 75%, is **within noise: no clear difference there**. The lead is most sensitive to **α, absorption rate**.

*The verdict compares the hardest level reached, the targets solved and (when both communities reach level 5 in at least 90% of runs) the cost to get there, each against two standard errors. 100 simulated runs per setting · simulator commit `94d7303+` · 2026-10-25. This is a simulation with guessed parameters, not evidence about real research; see [What this shows](#what-this-shows-and-what-it-does-not).*

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

The community has 12 agents (3 foundation, 3 racer, 2 explorer, 2 specialist, 1 freeRider, 1 gamer) and a budget of 260 over 22 rounds (calibrated: the smallest budget at which OSO solves about 90% of the targets).

## 2. Progress for the money

![Hardest level published by money spent](figures/frontier.svg)

Each line is the mean, over 100 runs, of the hardest level the community had published after spending that much money. A line that ends early means every target was solved and the funder stopped paying.

## 3. The six settings

The rules are the only difference between rows ([specification, section 3](../../docs/design.md#3-the-rules)). Traditional: nothing flows back to what an idea built on, and work is published only when finished. OSO: value flows back (α = 0.8, c = 0.15), and ideas are published at once or when the agent chooses.

| setting | frontier | reach L5 | speed | cost | spend | targets solved | waste | credit | sharing | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 1.6 ± 2.4 | 0.33 | 16 ± 4 | 188 ± 50 | 251 ± 16 | 0.4 ± 0.7 | 0.54 ± 0.07 | 0.32 ± 0.47 | 0.01 ± 0.02 | 0.74 ± 1.24 |
| OSO (immediate) | 5.0 ± 0.0 | 1.00 | 11 ± 4 | 120 ± 50 | 165 ± 52 | 1.9 ± 0.3 | 0.32 ± 0.07 | 0.47 ± 0.17 | 1.00 ± 0.00 | 5.36 ± 2.44 |
| Flow-back, finished-only | 1.6 ± 2.4 | 0.33 | 17 ± 4 | 196 ± 48 | 252 ± 11 | 0.4 ± 0.7 | 0.54 ± 0.07 | 0.32 ± 0.47 | 0.01 ± 0.02 | 0.70 ± 1.13 |
| No flow-back, immediate | 5.0 ± 0.2 | 0.97 | 10 ± 4 | 115 ± 49 | 163 ± 57 | 1.9 ± 0.4 | 0.32 ± 0.08 | 0.34 ± 0.19 | 1.00 ± 0.00 | 5.41 ± 2.60 |
| No flow-back, choice | 2.7 ± 2.2 | 0.42 | 17 ± 4 | 194 ± 49 | 251 ± 17 | 0.5 ± 0.7 | 0.55 ± 0.07 | 0.38 ± 0.47 | 0.07 ± 0.08 | 0.90 ± 1.29 |
| OSO (choice) | 2.7 ± 2.1 | 0.38 | 16 ± 5 | 182 ± 54 | 249 ± 19 | 0.5 ± 0.8 | 0.54 ± 0.07 | 0.30 ± 0.43 | 0.10 ± 0.11 | 0.91 ± 1.44 |

Values are mean ± standard deviation over runs. *frontier*: hardest level published; *reach L5*: share of runs reaching level 5; *speed*, *cost*: rounds and money to reach it; *credit*: how closely bounty pay matches true contribution; *sharing*: share of intermediate ideas published as soon as they were proved.

## 4. Does flow-back make agents share?

![Sharing and reach by α](figures/alpha.svg)

| α | intermediate ideas shared | frontier | reach level 5 | targets solved |
| --- | --- | --- | --- | --- |
| 1 | 7% | 2.7 | 42% | 0.5 |
| 0.8 | 10% | 2.7 | 38% | 0.5 |
| 0.6 | 21% | 3.9 | 67% | 1.0 |
| 0.5 | 29% | 4.1 | 68% | 1.0 |
| 0.4 | 37% | 4.5 | 79% | 1.2 |
| 0.3 | 47% | 4.8 | 92% | 1.5 |
| 0.2 | 54% | 4.8 | 89% | 1.6 |
| 0.1 | 63% | 5.0 | 98% | 1.8 |

Sharing rises clearly once α is 0.5 or lower: this is the threshold α* in this space. The threshold depends on the scoop risk ψ = 0.5, which is a guess.

## 5. When sharing is costly or sometimes wrong

Taking up a published idea costs 0.5; proofs are wrong 10% of the time, ideas built on a wrong idea are wrong too, and targets reveal and retract them.

| shared knowledge | traditional frontier | OSO frontier | OSO lead | traditional targets | OSO targets |
| --- | --- | --- | --- | --- | --- |
| free and correct | 1.6 | 5.0 | +3.4 | 0.4 | 1.9 |
| costly to take up | 1.6 | 4.8 | +3.1 | 0.4 | 1.3 |
| sometimes wrong | 1.3 | 5.0 | +3.7 | 0.3 | 1.8 |
| costly and sometimes wrong | 1.3 | 4.6 | +3.4 | 0.3 | 1.0 |

## 6. Sensitivity to the parameters

In OSO, α and c are set by each community ([OIP-14](https://github.com/open-science-org/OIPs/blob/master/OIPS/oip-14.md)), validators decide how strict the screen is, funders decide how far money follows earnings, and the mint may become a community parameter ([OIP-8](https://github.com/open-science-org/OIPs/blob/master/OIPS/oip-8.md)). Their values will be set by competing communities, not by us, so the result must hold across them. The parameters below the line are our guesses about how agents think.

Each parameter is varied alone, from this space's settings, with agents choosing what to share (the realistic case: incentives matter only if sharing is a choice). The lead is OSO's hardest level reached minus traditional's under the same parameter value; α and c do not exist under traditional rules, so there it is compared with traditional's default.

![OSO's lead by parameter](figures/sensitivity.svg)

Across the tested values of the parameters a market or community sets, OSO's lead (agents choosing what to share) runs from **+0.4** to **+3.2** levels. The smallest lead, at f, earnings shape next round's money = 75%, is **within noise: no clear difference there**. The lead is most sensitive to **α, absorption rate**.

| parameter | means | tested | OSO lead (lowest to highest) |
| --- | --- | --- | --- |
| α, absorption rate | how much of the value reaching an idea it absorbs; the rest flows back to what it built on | 0.2, 0.4, 0.6, 0.8, 0.95 | +0.9 to +3.2 |
| c, cited share of the mint | share of each new mint paid to the ideas it built on | 0%, 5%, 15%, 30%, 50% | +1.0 to +1.2 |
| mint per idea | tokens minted for each validated idea, relative to bounties (the smallest bounty is a few units) | 0, 0.5, 1, 2, 4 | +1.0 to +1.5 |
| θ, validation screen | chance validators reject a trivial idea | 0%, 25%, 50%, 75%, 95% | +0.8 to +1.8 |
| f, earnings shape next round's money | share of each round's money funders give by recent earnings rather than equally | 0%, 25%, 50%, 75%, 100% | +0.4 to +1.3 |
| ψ, scoop risk | how likely agents think a shared lemma lets a rival take the target | 0, 0.25, 0.5, 0.75, 0.9 | +0.9 to +3.4 |
| κ, value of being used | how much agents think publishing raises a lemma's use | 0, 0.5, 1, 2, 4 | +0.8 to +1.6 |
| σ₀, perception noise | how noisily agents see the value of what they might attempt | 0, 0.5, 1, 2 | +1.0 to +1.3 |
| τ, choice randomness | how loosely agents follow their best option | 0.05, 0.15, 0.3, 0.6, 1 | +0.3 to +1.7 |
| attribution error | noise in the ledger's weights of what each idea built on | 0, 0.1, 0.3, 0.6 | +1.0 to +1.4 |

The two flow-back levers together:

![Sharing by α and c](figures/flow-back-grid.svg)

| α \ c | 0% | 5% | 15% | 30% | 50% |
| --- | --- | --- | --- | --- | --- |
| 0.95 | 7% · 2.6 | 7% · 2.6 | 7% · 2.6 | 7% · 2.6 | 7% · 2.5 |
| 0.8 | 10% · 2.8 | 10% · 2.8 | 10% · 2.7 | 11% · 2.9 | 11% · 2.8 |
| 0.6 | 21% · 3.9 | 21% · 3.9 | 21% · 3.9 | 21% · 3.9 | 21% · 4.0 |
| 0.4 | 38% · 4.6 | 37% · 4.6 | 37% · 4.5 | 38% · 4.5 | 37% · 4.5 |
| 0.2 | 54% · 4.8 | 54% · 4.8 | 54% · 4.8 | 53% · 4.8 | 53% · 4.9 |

Each cell: share of intermediate ideas published · hardest level reached.

<details><summary>Every tested value</summary>

| parameter | value | OSO frontier | traditional frontier | OSO lead | OSO targets | traditional targets | ideas shared |
| --- | --- | --- | --- | --- | --- | --- | --- |
| α, absorption rate | 0.2 | 4.8 | 1.6 | +3.2 | 1.6 | 0.4 | 54% |
| α, absorption rate | 0.4 | 4.5 | 1.6 | +2.9 | 1.2 | 0.4 | 37% |
| α, absorption rate | 0.6 | 3.9 | 1.6 | +2.2 | 1.0 | 0.4 | 21% |
| α, absorption rate | 0.8 (this space) | 2.7 | 1.6 | +1.0 | 0.5 | 0.4 | 10% |
| α, absorption rate | 0.95 | 2.6 | 1.6 | +0.9 | 0.5 | 0.4 | 7% |
| c, cited share of the mint | 0% | 2.8 | 1.6 | +1.1 | 0.5 | 0.4 | 10% |
| c, cited share of the mint | 5% | 2.8 | 1.6 | +1.1 | 0.5 | 0.4 | 10% |
| c, cited share of the mint | 15% (this space) | 2.7 | 1.6 | +1.0 | 0.5 | 0.4 | 10% |
| c, cited share of the mint | 30% | 2.9 | 1.6 | +1.2 | 0.6 | 0.4 | 11% |
| c, cited share of the mint | 50% | 2.8 | 1.6 | +1.1 | 0.6 | 0.4 | 11% |
| mint per idea | 0 | 1.6 | 0.5 | +1.1 | 0.3 | 0.1 | 6% |
| mint per idea | 0.5 | 2.7 | 1.8 | +1.0 | 0.6 | 0.5 | 10% |
| mint per idea | 1 (this space) | 2.7 | 1.6 | +1.0 | 0.5 | 0.4 | 10% |
| mint per idea | 2 | 3.0 | 1.8 | +1.3 | 0.7 | 0.4 | 11% |
| mint per idea | 4 | 3.2 | 1.8 | +1.5 | 0.7 | 0.4 | 14% |
| θ, validation screen | 0% | 3.2 | 2.1 | +1.1 | 0.7 | 0.6 | 11% |
| θ, validation screen | 25% | 3.0 | 2.1 | +0.9 | 0.6 | 0.6 | 10% |
| θ, validation screen | 50% (this space) | 2.7 | 1.6 | +1.0 | 0.5 | 0.4 | 10% |
| θ, validation screen | 75% | 2.2 | 1.4 | +0.8 | 0.4 | 0.4 | 7% |
| θ, validation screen | 95% | 2.4 | 0.7 | +1.8 | 0.6 | 0.2 | 9% |
| f, earnings shape next round's money | 0% | 1.7 | 0.4 | +1.3 | 0.2 | 0.1 | 7% |
| f, earnings shape next round's money | 25% | 1.5 | 0.5 | +1.0 | 0.2 | 0.1 | 6% |
| f, earnings shape next round's money | 50% (this space) | 2.7 | 1.6 | +1.0 | 0.5 | 0.4 | 10% |
| f, earnings shape next round's money | 75% | 3.8 | 3.4 | +0.4 | 1.1 | 1.1 | 13% |
| f, earnings shape next round's money | 100% | 4.4 | 4.0 | +0.5 | 1.5 | 1.4 | 19% |
| ψ, scoop risk | 0 | 5.0 | 1.6 | +3.4 | 1.9 | 0.4 | 99% |
| ψ, scoop risk | 0.25 | 3.0 | 1.6 | +1.4 | 0.7 | 0.4 | 13% |
| ψ, scoop risk | 0.5 (this space) | 2.7 | 1.6 | +1.0 | 0.5 | 0.4 | 10% |
| ψ, scoop risk | 0.75 | 2.6 | 1.6 | +1.0 | 0.5 | 0.4 | 9% |
| ψ, scoop risk | 0.9 | 2.5 | 1.6 | +0.9 | 0.5 | 0.4 | 8% |
| κ, value of being used | 0 | 2.4 | 1.6 | +0.8 | 0.4 | 0.4 | 7% |
| κ, value of being used | 0.5 | 2.5 | 1.6 | +0.9 | 0.5 | 0.4 | 8% |
| κ, value of being used | 1 (this space) | 2.7 | 1.6 | +1.0 | 0.5 | 0.4 | 10% |
| κ, value of being used | 2 | 2.9 | 1.6 | +1.3 | 0.6 | 0.4 | 12% |
| κ, value of being used | 4 | 3.2 | 1.6 | +1.6 | 0.7 | 0.4 | 16% |
| σ₀, perception noise | 0 | 2.8 | 1.9 | +1.0 | 0.6 | 0.5 | 8% |
| σ₀, perception noise | 0.5 | 2.8 | 1.7 | +1.1 | 0.7 | 0.5 | 7% |
| σ₀, perception noise | 1 (this space) | 2.7 | 1.6 | +1.0 | 0.5 | 0.4 | 10% |
| σ₀, perception noise | 2 | 3.0 | 1.7 | +1.3 | 0.5 | 0.5 | 14% |
| τ, choice randomness | 0.05 | 2.5 | 2.2 | +0.3 | 0.7 | 0.6 | 5% |
| τ, choice randomness | 0.15 | 2.9 | 2.3 | +0.6 | 0.8 | 0.6 | 6% |
| τ, choice randomness | 0.3 (this space) | 2.7 | 1.6 | +1.0 | 0.5 | 0.4 | 10% |
| τ, choice randomness | 0.6 | 2.4 | 1.1 | +1.3 | 0.4 | 0.3 | 11% |
| τ, choice randomness | 1 | 2.6 | 0.9 | +1.7 | 0.3 | 0.2 | 13% |
| attribution error | 0 (this space) | 2.7 | 1.6 | +1.0 | 0.5 | 0.4 | 10% |
| attribution error | 0.1 | 2.8 | 1.6 | +1.1 | 0.5 | 0.4 | 9% |
| attribution error | 0.3 | 3.0 | 1.6 | +1.3 | 0.6 | 0.4 | 10% |
| attribution error | 0.6 | 3.0 | 1.6 | +1.4 | 0.6 | 0.4 | 10% |

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

The space is [spaces/example-tightly-linked.yaml](../../spaces/example-tightly-linked.yaml) (written by hand as an example of a space listed idea by idea (the graph world)). Every number above is in [data.json](data.json). Generated by the OSO simulator at commit `94d7303+` (with uncommitted changes).
