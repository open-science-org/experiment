# Early-stage drug discovery: OSO vs. traditional research

> Five stages from biology to a development candidate, in three disease areas, with three candidates as bounties.

**For the same money, the OSO community got further, or got there more cheaply, than the traditional one.**

- **How far:** with a budget of 1240 money, OSO reached level **6.0** of 6 on average; traditional research reached **2.7**.
- **Targets solved:** OSO solved **2.8** of 3; traditional solved **0.7**.
- **Cost to reach level 5:** OSO 223 money; traditional 847 money (in the 45% of runs that got there).
- **Return on the money (ROI):** OSO gained **1.77** in bounty value per unit spent (1351 for 850); traditional **0.28** (335 for 1228). Value gained is the bounties of the targets solved.
- **Does flow-back make agents share?** When agents choose, sharing rises clearly (by 0.2 or more) once α is 0.4 or lower. At OSO's default α = 0.8, agents shared 41% of their intermediate ideas.
- **Robustness:** OSO's lead in level is smallest when shared knowledge is **costly to take up** (+3.2 levels).
- **Sensitivity:** Across the tested values of the parameters a market or community sets, OSO's lead (agents choosing what to share) runs from **+0.3** to **+4.4** levels. The smallest lead, at ρ, money follows earnings = 100%, is **within noise: no clear difference there**. The lead is most sensitive to **ρ, money follows earnings**. Why ρ matters so much here: under traditional rules, when money follows earnings, the first agent to earn takes the money. In this community that is the gaming agent, which earns early from trivial ideas and then, holding all the money, does the research too. Without a gaming agent the effect disappears (see the funding-rule-gamer experiment).

*The verdict compares the hardest level reached, the targets solved and (when both communities reach level 5 in at least 90% of runs) the cost to get there, each against two standard errors. 100 simulated runs per setting · simulator commit `ead6740+` · 2026-10-23. This is a simulation with guessed parameters, not evidence about real research; see [What this shows](#what-this-shows-and-what-it-does-not).*

## 1. The problem space

Early-stage drug discovery. Validated biology (a disease mechanism) supports target identification; targets support screening assays; assays find hits; hits are optimized into leads; and a lead with enough evidence becomes a development candidate. Each stage is much harder than the one before, and many hits and leads go nowhere. Three disease areas (oncology, immunology, neuroscience) share some early biology. Labs either publish each step as they go or keep it until they have a candidate.

| In this space | means |
| --- | --- |
| an idea | a validated piece of evidence (mechanism, target, assay, hit or lead) |
| a target | a development candidate, worth a large bounty |
| an attempt | one experimental campaign |
| an area | a disease area |
| an agent | a lab |

![The research tree](figures/world.svg)

The tree has 54 ideas in 6 levels and 3 areas (oncology, immunology, neuroscience). 33 are dead ends: no target depends on them. 3 are targets:

| target | level | bounty | ideas it rests on |
| --- | --- | --- | --- |
| T1 | 6 | 486 | 16 |
| T2 | 6 | 486 | 18 |
| T3 | 6 | 486 | 16 |

How hard each level is, before an agent's skill:

| level | results | targets | success chance per attempt |
| --- | --- | --- | --- |
| 1 | 9 | 0 | 60% |
| 2 | 9 | 0 | 27% |
| 3 | 9 | 0 | 12% |
| 4 | 9 | 0 | 5% |
| 5 | 9 | 0 | 2% |
| 6 | 9 | 3 | 1% |

The community has 12 agents (3 foundation, 3 racer, 2 explorer, 2 specialist, 1 freeRider, 1 gamer) and a budget of 1240 money over 103 rounds (calibrated: the smallest budget at which OSO solves about 90% of the targets).

## 2. Progress for the money

![Hardest level published by money spent](figures/frontier.svg)

Each line is the mean, over 100 runs, of the hardest level the community had published after spending that much money. A line that ends early means every target was solved and the funder stopped paying.

## 3. The six settings

The rules are the only difference between rows ([specification, section 3](../../docs/design.md#3-the-rules)). Traditional: nothing flows back to what an idea built on, and work is published only when finished. OSO: value flows back (α = 0.8, c = 0.15), and ideas are published at once or when the agent chooses.

| setting | frontier | reach L5 | speed | cost | spend | targets solved | waste | credit | sharing | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 2.7 ± 3.0 | 0.45 | 71 ± 18 | 847 ± 221 | 1228 ± 51 | 0.7 ± 0.9 | 0.56 ± 0.16 | 0.44 ± 0.49 | 0.00 ± 0.00 | 0.28 ± 0.39 |
| OSO (immediate) | 6.0 ± 0.1 | 1.00 | 19 ± 8 | 223 ± 94 | 850 ± 234 | 2.8 ± 0.6 | 0.87 ± 0.05 | 0.67 ± 0.14 | 1.00 ± 0.00 | 1.77 ± 0.68 |
| Flow-back, finished-only | 2.7 ± 3.0 | 0.45 | 73 ± 18 | 871 ± 217 | 1227 ± 55 | 0.6 ± 0.8 | 0.55 ± 0.15 | 0.45 ± 0.50 | 0.00 ± 0.00 | 0.26 ± 0.37 |
| No flow-back, immediate | 6.0 ± 0.0 | 1.00 | 20 ± 7 | 236 ± 83 | 869 ± 239 | 2.8 ± 0.5 | 0.85 ± 0.06 | 0.56 ± 0.12 | 1.00 ± 0.00 | 1.75 ± 0.73 |
| No flow-back, choice | 5.4 ± 0.9 | 0.78 | 69 ± 21 | 826 ± 258 | 1224 ± 58 | 0.8 ± 0.9 | 0.66 ± 0.11 | 0.54 ± 0.48 | 0.41 ± 0.12 | 0.34 ± 0.40 |
| OSO (choice) | 5.4 ± 0.9 | 0.79 | 63 ± 21 | 756 ± 253 | 1207 ± 91 | 1.0 ± 1.1 | 0.69 ± 0.13 | 0.53 ± 0.46 | 0.41 ± 0.12 | 0.43 ± 0.51 |

Values are mean ± standard deviation over runs. *frontier*: hardest level published; *reach L5*: share of runs reaching level 5; *speed*, *cost*: rounds and money to reach it; *credit*: how closely bounty pay matches true contribution; *sharing*: share of intermediate ideas published as soon as they were proved.

## 4. Does flow-back make agents share?

![Sharing and reach by α](figures/alpha.svg)

| α | intermediate ideas shared | frontier | reach level 5 | targets solved |
| --- | --- | --- | --- | --- |
| 1 | 41% | 5.4 | 78% | 0.8 |
| 0.8 | 41% | 5.4 | 79% | 1.0 |
| 0.6 | 46% | 5.6 | 95% | 1.4 |
| 0.5 | 53% | 5.8 | 98% | 1.7 |
| 0.4 | 66% | 5.9 | 100% | 2.2 |
| 0.3 | 77% | 6.0 | 100% | 2.4 |
| 0.2 | 85% | 6.0 | 100% | 2.6 |
| 0.1 | 91% | 6.0 | 100% | 2.6 |

Sharing rises clearly once α is 0.4 or lower: this is the threshold α* in this space. The threshold depends on the scoop risk ψ = 0.5, which is a guess.

## 5. When sharing is costly or sometimes wrong

Taking up a published idea costs 0.5; proofs are wrong 10% of the time, ideas built on a wrong idea are wrong too, and targets reveal and retract them.

| shared knowledge | traditional frontier | OSO frontier | OSO lead | traditional targets | OSO targets |
| --- | --- | --- | --- | --- | --- |
| free and correct | 2.7 | 6.0 | +3.3 | 0.7 | 2.8 |
| costly to take up | 2.7 | 5.9 | +3.2 | 0.7 | 2.2 |
| sometimes wrong | 1.0 | 5.8 | +4.8 | 0.2 | 1.3 |
| costly and sometimes wrong | 1.0 | 5.5 | +4.5 | 0.2 | 0.9 |

## 6. Sensitivity to the parameters

In OSO, α and c are set by each community ([OIP-14](https://github.com/open-science-org/OIPs/blob/master/OIPS/oip-14.md)), validators decide how strict the screen is, funders decide how far money follows earnings, and the mint may become a community parameter ([OIP-8](https://github.com/open-science-org/OIPs/blob/master/OIPS/oip-8.md)). Their values will be set by competing communities, not by us, so the result must hold across them. The parameters below the line are our guesses about how agents think.

Each parameter is varied alone, from this space's settings, with agents choosing what to share (the realistic case: incentives matter only if sharing is a choice). The lead is OSO's hardest level reached minus traditional's under the same parameter value; α and c do not exist under traditional rules, so there it is compared with traditional's default.

![OSO's lead by parameter](figures/sensitivity.svg)

Across the tested values of the parameters a market or community sets, OSO's lead (agents choosing what to share) runs from **+0.3** to **+4.4** levels. The smallest lead, at ρ, money follows earnings = 100%, is **within noise: no clear difference there**. The lead is most sensitive to **ρ, money follows earnings**. Why ρ matters so much here: under traditional rules, when money follows earnings, the first agent to earn takes the money. In this community that is the gaming agent, which earns early from trivial ideas and then, holding all the money, does the research too. Without a gaming agent the effect disappears (see the funding-rule-gamer experiment).

| parameter | means | tested | OSO lead (lowest to highest) |
| --- | --- | --- | --- |
| α, absorption rate | how much of the value reaching an idea it absorbs; the rest flows back to what it built on | 0.2, 0.4, 0.6, 0.8, 0.95 | +2.6 to +3.3 |
| c, cited share of the mint | share of each new mint paid to the ideas it built on | 0%, 5%, 15%, 30%, 50% | +2.7 to +2.9 |
| mint per idea | tokens minted for each validated idea, relative to bounties (the smallest bounty is a few units) | 0, 0.5, 1, 2, 4 | +2.3 to +4.2 |
| θ, validation screen | chance validators reject a trivial idea | 0%, 25%, 50%, 75%, 95% | +2.3 to +2.7 |
| ρ, money follows earnings | share of each round's money funders give by recent earnings rather than equally | 0%, 25%, 50%, 75%, 100% | +0.3 to +4.4 |
| ψ, scoop risk | how likely agents think a shared lemma lets a rival take the target | 0, 0.25, 0.5, 0.75, 0.9 | +2.7 to +3.3 |
| κ, value of being used | how much agents think publishing raises a lemma's use | 0, 0.5, 1, 2, 4 | +2.6 to +2.9 |
| σ₀, perception noise | how noisily agents see the value of what they might attempt | 0, 0.5, 1, 2 | +2.0 to +3.0 |
| τ, choice randomness | how loosely agents follow their best option | 0.05, 0.15, 0.3, 0.6, 1 | +1.1 to +4.5 |
| attribution error | noise in the ledger's weights of what each idea built on | 0, 0.1, 0.3, 0.6 | +2.7 to +2.8 |

The two flow-back levers together:

![Sharing by α and c](figures/flow-back-grid.svg)

| α \ c | 0% | 5% | 15% | 30% | 50% |
| --- | --- | --- | --- | --- | --- |
| 0.95 | 41% · 5.5 | 40% · 5.4 | 40% · 5.3 | 40% · 5.4 | 40% · 5.5 |
| 0.8 | 43% · 5.6 | 41% · 5.5 | 41% · 5.4 | 41% · 5.4 | 41% · 5.4 |
| 0.6 | 46% · 5.6 | 45% · 5.7 | 46% · 5.6 | 46% · 5.6 | 44% · 5.7 |
| 0.4 | 67% · 5.9 | 66% · 5.9 | 66% · 5.9 | 66% · 5.9 | 66% · 5.9 |
| 0.2 | 86% · 6.0 | 85% · 6.0 | 85% · 6.0 | 86% · 6.0 | 85% · 6.0 |

Each cell: share of intermediate ideas published · hardest level reached.

<details><summary>Every tested value</summary>

| parameter | value | OSO frontier | traditional frontier | OSO lead | OSO targets | traditional targets | ideas shared |
| --- | --- | --- | --- | --- | --- | --- | --- |
| α, absorption rate | 0.2 | 6.0 | 2.7 | +3.3 | 2.6 | 0.7 | 85% |
| α, absorption rate | 0.4 | 5.9 | 2.7 | +3.2 | 2.2 | 0.7 | 66% |
| α, absorption rate | 0.6 | 5.6 | 2.7 | +2.9 | 1.4 | 0.7 | 46% |
| α, absorption rate | 0.8 (this space) | 5.4 | 2.7 | +2.7 | 1.0 | 0.7 | 41% |
| α, absorption rate | 0.95 | 5.3 | 2.7 | +2.6 | 0.9 | 0.7 | 40% |
| c, cited share of the mint | 0% | 5.6 | 2.7 | +2.9 | 1.0 | 0.7 | 43% |
| c, cited share of the mint | 5% | 5.5 | 2.7 | +2.8 | 1.1 | 0.7 | 41% |
| c, cited share of the mint | 15% (this space) | 5.4 | 2.7 | +2.7 | 1.0 | 0.7 | 41% |
| c, cited share of the mint | 30% | 5.4 | 2.7 | +2.7 | 0.9 | 0.7 | 41% |
| c, cited share of the mint | 50% | 5.4 | 2.7 | +2.7 | 0.9 | 0.7 | 41% |
| mint per idea | 0 | 5.0 | 0.8 | +4.2 | 0.5 | 0.2 | 42% |
| mint per idea | 0.5 | 5.5 | 2.8 | +2.7 | 1.0 | 0.7 | 41% |
| mint per idea | 1 (this space) | 5.4 | 2.7 | +2.7 | 1.0 | 0.7 | 41% |
| mint per idea | 2 | 5.5 | 2.9 | +2.5 | 1.1 | 0.8 | 41% |
| mint per idea | 4 | 5.4 | 3.2 | +2.3 | 1.0 | 0.8 | 43% |
| θ, validation screen | 0% | 5.4 | 3.1 | +2.3 | 1.1 | 0.8 | 42% |
| θ, validation screen | 25% | 5.6 | 2.9 | +2.7 | 1.1 | 0.7 | 42% |
| θ, validation screen | 50% (this space) | 5.4 | 2.7 | +2.7 | 1.0 | 0.7 | 41% |
| θ, validation screen | 75% | 5.4 | 2.8 | +2.7 | 1.0 | 0.6 | 41% |
| θ, validation screen | 95% | 5.5 | 3.1 | +2.4 | 1.3 | 0.8 | 43% |
| ρ, money follows earnings | 0% | 5.0 | 0.6 | +4.4 | 0.4 | 0.1 | 42% |
| ρ, money follows earnings | 25% | 5.0 | 1.2 | +3.8 | 0.4 | 0.2 | 41% |
| ρ, money follows earnings | 50% (this space) | 5.4 | 2.7 | +2.7 | 1.0 | 0.7 | 41% |
| ρ, money follows earnings | 75% | 5.9 | 5.2 | +0.7 | 1.5 | 1.8 | 42% |
| ρ, money follows earnings | 100% | 6.0 | 5.7 | +0.3 | 2.5 | 2.3 | 41% |
| ψ, scoop risk | 0 | 6.0 | 2.7 | +3.3 | 2.8 | 0.7 | 99% |
| ψ, scoop risk | 0.25 | 5.6 | 2.7 | +2.9 | 1.2 | 0.7 | 43% |
| ψ, scoop risk | 0.5 (this space) | 5.4 | 2.7 | +2.7 | 1.0 | 0.7 | 41% |
| ψ, scoop risk | 0.75 | 5.4 | 2.7 | +2.7 | 0.9 | 0.7 | 40% |
| ψ, scoop risk | 0.9 | 5.4 | 2.7 | +2.7 | 0.9 | 0.7 | 40% |
| κ, value of being used | 0 | 5.3 | 2.7 | +2.6 | 0.9 | 0.7 | 40% |
| κ, value of being used | 0.5 | 5.3 | 2.7 | +2.6 | 0.9 | 0.7 | 40% |
| κ, value of being used | 1 (this space) | 5.4 | 2.7 | +2.7 | 1.0 | 0.7 | 41% |
| κ, value of being used | 2 | 5.6 | 2.7 | +2.9 | 1.1 | 0.7 | 43% |
| κ, value of being used | 4 | 5.6 | 2.7 | +2.9 | 1.2 | 0.7 | 46% |
| σ₀, perception noise | 0 | 5.2 | 2.8 | +2.4 | 0.9 | 0.7 | 36% |
| σ₀, perception noise | 0.5 | 5.2 | 3.1 | +2.0 | 0.7 | 0.8 | 38% |
| σ₀, perception noise | 1 (this space) | 5.4 | 2.7 | +2.7 | 1.0 | 0.7 | 41% |
| σ₀, perception noise | 2 | 5.7 | 2.7 | +3.0 | 1.2 | 0.6 | 48% |
| τ, choice randomness | 0.05 | 5.5 | 4.4 | +1.2 | 1.4 | 1.1 | 32% |
| τ, choice randomness | 0.15 | 5.4 | 4.3 | +1.1 | 1.4 | 1.0 | 32% |
| τ, choice randomness | 0.3 (this space) | 5.4 | 2.7 | +2.7 | 1.0 | 0.7 | 41% |
| τ, choice randomness | 0.6 | 5.6 | 1.7 | +3.9 | 0.6 | 0.4 | 47% |
| τ, choice randomness | 1 | 5.6 | 1.1 | +4.5 | 0.4 | 0.3 | 50% |
| attribution error | 0 (this space) | 5.4 | 2.7 | +2.7 | 1.0 | 0.7 | 41% |
| attribution error | 0.1 | 5.5 | 2.7 | +2.8 | 1.0 | 0.7 | 41% |
| attribution error | 0.3 | 5.5 | 2.7 | +2.8 | 1.0 | 0.7 | 41% |
| attribution error | 0.6 | 5.5 | 2.7 | +2.8 | 1.0 | 0.7 | 41% |

</details>

## What this shows and what it does not

- **It is a simulation** of the [OSO demo specification](../../docs/design.md): ideas are abstract, success is chance, and agents follow a formula. It shows how the incentive rules play out *if* this space works as described, not that it does.
- **The parameters are guesses,** especially the success chances, the scoop risk ψ, and the costs and error rates in section 5. Section 6 varies each one alone; it does not vary them together, except α and c.
- **By default, sharing is free and always correct,** which favours OSO; section 5 shows how much of the lead survives without that.
- **Notes for this space:** Stage difficulties and bounties are illustrative, not industry figures.

## Reproduce

```sh
npm run sim -- report drug-discovery --seeds 100
```

The space is [spaces/drug-discovery.yaml](../../spaces/drug-discovery.yaml) (written by hand as an example of a new problem space). Every number above is in [data.json](data.json). Generated by the OSO simulator at commit `ead6740+` (with uncommitted changes).
