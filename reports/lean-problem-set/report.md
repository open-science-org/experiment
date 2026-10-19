# The Lean problem set: OSO vs. traditional research

> The shape of the OSO Lean problem set; 42 theorems in three areas, 8 posted targets.

**For the same money, the OSO community got further, or got there more cheaply, than the traditional one.**

- **How far:** with a budget of 400 compute, OSO reached level **7.0** of 7 on average; traditional research reached **4.4**.
- **Targets solved:** OSO solved **8.0** of 8; traditional solved **4.8**.
- **Cost to reach level 5:** OSO 125 compute; traditional 303 compute (in the 44% of runs that got there).
- **Does flow-back make agents share?** When agents choose, sharing rises clearly (by 0.2 or more) once α is 0.6 or lower. At OSO's default α = 0.8, agents shared 42% of their intermediate results.
- **Robustness:** OSO's lead in level is smallest when shared knowledge is **costly to absorb** (+2.2 levels).
- **Sensitivity:** Across the tested values of the parameters a market or community sets, OSO's lead (agents choosing what to share) runs from **+0.1** to **+2.6** levels. The smallest lead, at mint per result = 0, is **within noise: no clear difference there**. The lead is most sensitive to **α, retention**.

*The verdict compares the hardest level reached, the targets solved and (when both communities reach level 5 in at least 90% of runs) the cost to get there, each against two standard errors. 100 simulated runs per setting · simulator commit `44f5044+` · 2026-10-19. This is a simulation with guessed parameters, not evidence about real research; see [What this shows](#what-this-shows-and-what-it-does-not).*

## 1. The problem space

The reference tree of the Lean problem set: a number sequence (area A), sorting (area B) and 2 × 2 integer matrices (area C), plus results that join areas. Each result is a theorem; a theorem can be attempted once the theorems its proof uses are known. The eight posted targets carry bounties that double with depth. Area A is a long chain, area B is wide, and area C is shallow. Success chances follow the default model by level until the Lean pilot measures them.

| In this space | means |
| --- | --- |
| a result | a theorem, with its proof |
| a target | a posted theorem with a bounty |
| an attempt | one try at writing a proof that Lean accepts |
| an area | a mathematical topic |

![The research tree](figures/world.svg)

The tree has 42 results in 7 levels and 4 areas (A sequence, B sorting, C matrices, across areas). 6 are dead ends: no target depends on them. 8 are targets:

| target | level | bounty | results it rests on |
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

| level | results | targets | success chance per attempt |
| --- | --- | --- | --- |
| 1 | 20 | 1 | 50% |
| 2 | 9 | 1 | 30% |
| 3 | 6 | 2 | 18% |
| 4 | 2 | 1 | 11% |
| 5 | 3 | 2 | 6% |
| 6 | 1 | 0 | 4% |
| 7 | 1 | 1 | 2% |

The community has 12 agents (3 foundation, 3 racer, 2 explorer, 2 specialist, 1 freeRider, 1 gamer) and a budget of 400 compute over 40 rounds.

## 2. Progress for the money

![Hardest level published by compute spent](figures/frontier.svg)

Each line is the mean, over 100 runs, of the hardest level the community had published after spending that much compute. A line that ends early means every target was solved and the funder stopped paying.

## 3. The six settings

The rules are the only difference between rows ([specification, section 3](https://github.com/open-science-org/OSO/blob/master/docs/demo-model.md#3-the-rules)). Traditional: nothing flows back to what a result built on, and work is published only when finished. OSO: value flows back (α = 0.8, c = 0.15), and results are published at once or when the agent chooses.

| setting | frontier | reach L5 | speed | cost | spend | targets solved | waste | credit | sharing |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 4.4 ± 1.2 | 0.44 | 31 ± 7 | 303 ± 66 | 394 ± 14 | 4.8 ± 1.5 | 0.53 ± 0.10 | 0.98 ± 0.04 | 0.01 ± 0.02 |
| OSO (immediate) | 7.0 ± 0.0 | 1.00 | 13 ± 3 | 125 ± 32 | 243 ± 59 | 8.0 ± 0.0 | 0.78 ± 0.05 | 0.73 ± 0.06 | 1.00 ± 0.00 |
| Flow-back, finished-only | 4.3 ± 1.1 | 0.48 | 33 ± 6 | 327 ± 64 | 392 ± 19 | 4.9 ± 1.7 | 0.55 ± 0.11 | 0.99 ± 0.03 | 0.01 ± 0.02 |
| No flow-back, immediate | 7.0 ± 0.1 | 1.00 | 14 ± 4 | 131 ± 39 | 246 ± 63 | 8.0 ± 0.1 | 0.77 ± 0.06 | 0.59 ± 0.08 | 1.00 ± 0.00 |
| No flow-back, choice | 4.9 ± 1.2 | 0.67 | 31 ± 7 | 301 ± 74 | 386 ± 33 | 5.9 ± 1.4 | 0.59 ± 0.13 | 0.84 ± 0.09 | 0.35 ± 0.05 |
| OSO (choice) | 5.2 ± 1.2 | 0.76 | 28 ± 8 | 273 ± 77 | 372 ± 54 | 6.3 ± 1.3 | 0.62 ± 0.13 | 0.84 ± 0.08 | 0.42 ± 0.06 |

Values are mean ± standard deviation over runs. *frontier*: hardest level published; *reach L5*: share of runs reaching level 5; *speed*, *cost*: rounds and compute to reach it; *credit*: how closely bounty pay matches true contribution; *sharing*: share of intermediate results published as soon as they were proved.

## 4. Does flow-back make agents share?

![Sharing and reach by α](figures/alpha.svg)

| α | intermediate results shared | frontier | reach level 5 | targets solved |
| --- | --- | --- | --- | --- |
| 1 | 35% | 4.9 | 67% | 5.9 |
| 0.8 | 42% | 5.2 | 76% | 6.3 |
| 0.6 | 57% | 5.9 | 92% | 7.0 |
| 0.5 | 68% | 6.5 | 99% | 7.5 |
| 0.4 | 80% | 6.9 | 100% | 7.9 |
| 0.3 | 87% | 6.9 | 99% | 7.9 |
| 0.2 | 92% | 7.0 | 100% | 8.0 |
| 0.1 | 95% | 7.0 | 100% | 8.0 |

Sharing rises clearly once α is 0.6 or lower: this is the threshold α* in this space. The threshold depends on the scoop risk ψ = 0.5, which is a guess.

## 5. When sharing is costly or sometimes wrong

Absorbing a published result costs 0.5 compute; proofs are wrong 10% of the time, results built on a wrong result are wrong too, and targets reveal and retract them.

| shared knowledge | traditional frontier | OSO frontier | OSO lead | traditional targets | OSO targets |
| --- | --- | --- | --- | --- | --- |
| free and correct | 4.4 | 7.0 | +2.6 | 4.8 | 8.0 |
| costly to absorb | 4.2 | 6.4 | +2.2 | 4.7 | 7.0 |
| sometimes wrong | 4.1 | 6.6 | +2.5 | 4.3 | 7.6 |
| costly and sometimes wrong | 3.7 | 5.9 | +2.2 | 3.8 | 6.3 |

## 6. Sensitivity to the parameters

In OSO, α and c are set by each community ([OIP-14](https://github.com/open-science-org/OIPs/blob/master/OIPS/oip-14.md)), validators decide how strict the screen is, funders decide how far compute follows earnings, and the mint may become a community parameter ([OIP-8](https://github.com/open-science-org/OIPs/blob/master/OIPS/oip-8.md)). Their values will be set by competing communities, not by us, so the result must hold across them. The parameters below the line are our guesses about how agents think.

Each parameter is varied alone, from this space's settings, with agents choosing what to share (the realistic case: incentives matter only if sharing is a choice). The lead is OSO's hardest level reached minus traditional's under the same parameter value; α and c do not exist under traditional rules, so there it is compared with traditional's default.

![OSO's lead by parameter](figures/sensitivity.svg)

Across the tested values of the parameters a market or community sets, OSO's lead (agents choosing what to share) runs from **+0.1** to **+2.6** levels. The smallest lead, at mint per result = 0, is **within noise: no clear difference there**. The lead is most sensitive to **α, retention**.

| parameter | means | tested | OSO lead (lowest to highest) |
| --- | --- | --- | --- |
| α, retention | share of the value reaching a result that it keeps; the rest flows back to what it built on | 0.2, 0.4, 0.6, 0.8, 0.95 | +0.4 to +2.6 |
| c, cited share of the mint | share of each new mint paid to the results it built on | 0%, 5%, 15%, 30%, 50% | +0.7 to +0.9 |
| mint per result | tokens minted for each validated result, relative to bounties (the smallest bounty is a few units) | 0, 0.5, 1, 2, 4 | +0.1 to +1.7 |
| θ, validation screen | chance validators reject a trivial result | 0%, 25%, 50%, 75%, 95% | +0.5 to +1.1 |
| ρ, compute follows earnings | share of each round's compute funders give by recent earnings rather than equally | 0%, 25%, 50%, 75%, 100% | +0.1 to +1.4 |
| ψ, scoop risk | how likely agents think a shared lemma lets a rival take the target | 0, 0.25, 0.5, 0.75, 0.9 | +0.4 to +2.6 |
| κ, value of being used | how much agents think publishing raises a lemma's use | 0, 0.5, 1, 2, 4 | +0.6 to +1.6 |
| σ₀, perception noise | how noisily agents see the value of what they might attempt | 0, 0.5, 1, 2 | +0.3 to +1.6 |
| τ, choice randomness | how loosely agents follow their best option | 0.05, 0.15, 0.3, 0.6, 1 | +0.3 to +1.5 |
| attribution error | noise in the ledger's weights of what each result built on | 0, 0.1, 0.3, 0.6 | +0.7 to +0.9 |

The two flow-back levers together:

![Sharing by α and c](figures/flow-back-grid.svg)

| α \ c | 0% | 5% | 15% | 30% | 50% |
| --- | --- | --- | --- | --- | --- |
| 0.95 | 37% · 4.9 | 36% · 5.0 | 37% · 4.8 | 36% · 4.7 | 37% · 4.9 |
| 0.8 | 42% · 5.0 | 43% · 5.2 | 42% · 5.2 | 43% · 5.2 | 43% · 5.2 |
| 0.6 | 58% · 5.8 | 58% · 5.9 | 57% · 5.9 | 58% · 5.8 | 58% · 5.8 |
| 0.4 | 81% · 6.9 | 81% · 7.0 | 80% · 6.9 | 80% · 6.9 | 79% · 6.9 |
| 0.2 | 92% · 7.0 | 92% · 7.0 | 92% · 7.0 | 92% · 7.0 | 91% · 6.9 |

Each cell: share of intermediate results published · hardest level reached.

<details><summary>Every tested value</summary>

| parameter | value | OSO frontier | traditional frontier | OSO lead | OSO targets | traditional targets | results shared |
| --- | --- | --- | --- | --- | --- | --- | --- |
| α, retention | 0.2 | 7.0 | 4.4 | +2.6 | 8.0 | 4.8 | 92% |
| α, retention | 0.4 | 6.9 | 4.4 | +2.5 | 7.9 | 4.8 | 80% |
| α, retention | 0.6 | 5.9 | 4.4 | +1.5 | 7.0 | 4.8 | 57% |
| α, retention | 0.8 (this space) | 5.2 | 4.4 | +0.9 | 6.3 | 4.8 | 42% |
| α, retention | 0.95 | 4.8 | 4.4 | +0.4 | 5.8 | 4.8 | 37% |
| c, cited share of the mint | 0% | 5.0 | 4.4 | +0.7 | 6.2 | 4.8 | 42% |
| c, cited share of the mint | 5% | 5.2 | 4.4 | +0.8 | 6.2 | 4.8 | 43% |
| c, cited share of the mint | 15% (this space) | 5.2 | 4.4 | +0.9 | 6.3 | 4.8 | 42% |
| c, cited share of the mint | 30% | 5.2 | 4.4 | +0.9 | 6.2 | 4.8 | 43% |
| c, cited share of the mint | 50% | 5.2 | 4.4 | +0.8 | 6.2 | 4.8 | 43% |
| mint per result | 0 | 5.7 | 5.6 | +0.1 | 6.6 | 6.5 | 24% |
| mint per result | 0.5 | 5.2 | 4.3 | +0.9 | 6.3 | 5.0 | 35% |
| mint per result | 1 (this space) | 5.2 | 4.4 | +0.9 | 6.3 | 4.8 | 42% |
| mint per result | 2 | 5.5 | 4.4 | +1.1 | 6.9 | 4.9 | 58% |
| mint per result | 4 | 6.0 | 4.3 | +1.7 | 7.1 | 4.8 | 73% |
| θ, validation screen | 0% | 5.1 | 4.6 | +0.5 | 6.0 | 5.1 | 43% |
| θ, validation screen | 25% | 5.1 | 4.5 | +0.6 | 6.2 | 5.1 | 43% |
| θ, validation screen | 50% (this space) | 5.2 | 4.4 | +0.9 | 6.3 | 4.8 | 42% |
| θ, validation screen | 75% | 5.6 | 4.5 | +1.1 | 6.8 | 5.1 | 42% |
| θ, validation screen | 95% | 5.9 | 5.2 | +0.7 | 7.0 | 6.1 | 43% |
| ρ, compute follows earnings | 0% | 4.8 | 3.5 | +1.4 | 5.9 | 3.6 | 43% |
| ρ, compute follows earnings | 25% | 4.9 | 3.5 | +1.4 | 6.0 | 3.8 | 42% |
| ρ, compute follows earnings | 50% (this space) | 5.2 | 4.4 | +0.9 | 6.3 | 4.8 | 42% |
| ρ, compute follows earnings | 75% | 5.6 | 5.4 | +0.2 | 6.8 | 6.2 | 42% |
| ρ, compute follows earnings | 100% | 6.5 | 6.4 | +0.1 | 7.5 | 7.5 | 44% |
| ψ, scoop risk | 0 | 7.0 | 4.4 | +2.6 | 8.0 | 4.8 | 99% |
| ψ, scoop risk | 0.25 | 5.8 | 4.4 | +1.4 | 7.0 | 4.8 | 58% |
| ψ, scoop risk | 0.5 (this space) | 5.2 | 4.4 | +0.9 | 6.3 | 4.8 | 42% |
| ψ, scoop risk | 0.75 | 4.8 | 4.4 | +0.4 | 5.8 | 4.8 | 37% |
| ψ, scoop risk | 0.9 | 4.9 | 4.4 | +0.5 | 5.8 | 4.8 | 35% |
| κ, value of being used | 0 | 5.0 | 4.4 | +0.6 | 6.0 | 4.8 | 39% |
| κ, value of being used | 0.5 | 5.2 | 4.4 | +0.8 | 6.2 | 4.8 | 40% |
| κ, value of being used | 1 (this space) | 5.2 | 4.4 | +0.9 | 6.3 | 4.8 | 42% |
| κ, value of being used | 2 | 5.5 | 4.4 | +1.1 | 6.6 | 4.8 | 47% |
| κ, value of being used | 4 | 5.9 | 4.4 | +1.6 | 7.0 | 4.8 | 53% |
| σ₀, perception noise | 0 | 4.7 | 4.3 | +0.4 | 5.4 | 4.4 | 37% |
| σ₀, perception noise | 0.5 | 4.8 | 4.4 | +0.3 | 5.5 | 4.9 | 38% |
| σ₀, perception noise | 1 (this space) | 5.2 | 4.4 | +0.9 | 6.3 | 4.8 | 42% |
| σ₀, perception noise | 2 | 5.9 | 4.3 | +1.6 | 7.1 | 5.0 | 46% |
| τ, choice randomness | 0.05 | 5.2 | 4.9 | +0.3 | 5.7 | 5.0 | 36% |
| τ, choice randomness | 0.15 | 5.2 | 4.7 | +0.4 | 5.8 | 5.1 | 38% |
| τ, choice randomness | 0.3 (this space) | 5.2 | 4.4 | +0.9 | 6.3 | 4.8 | 42% |
| τ, choice randomness | 0.6 | 5.4 | 4.3 | +1.1 | 6.8 | 5.1 | 46% |
| τ, choice randomness | 1 | 5.6 | 4.2 | +1.5 | 7.0 | 5.0 | 48% |
| attribution error | 0 (this space) | 5.2 | 4.4 | +0.9 | 6.3 | 4.8 | 42% |
| attribution error | 0.1 | 5.1 | 4.4 | +0.7 | 6.2 | 4.8 | 42% |
| attribution error | 0.3 | 5.1 | 4.4 | +0.7 | 6.3 | 4.8 | 43% |
| attribution error | 0.6 | 5.1 | 4.4 | +0.7 | 6.2 | 4.8 | 44% |

</details>

## What this shows and what it does not

- **It is a simulation** of the [OSO demo specification](https://github.com/open-science-org/OSO/blob/master/docs/demo-model.md): results are abstract, success is chance, and agents follow a formula. It shows how the incentive rules play out *if* this space works as described, not that it does.
- **The parameters are guesses,** especially the success chances, the scoop risk ψ, and the costs and error rates in section 5. Section 6 varies each one alone; it does not vary them together, except α and c.
- **By default, sharing is free and always correct,** which favours OSO; section 5 shows how much of the lead survives without that.
- **Notes for this space:** Theorem names are hidden; the tree is the route of our own reference proofs, and agents may find others.

## Reproduce

```sh
npm run sim -- report lean-problem-set --seeds 100
```

The space is [spaces/lean-problem-set.yaml](../../spaces/lean-problem-set.yaml) (written by hand from the Lean problem set's reference proofs). Every number above is in [data.json](data.json). Generated by the OSO simulator at commit `44f5044+` (with uncommitted changes).
