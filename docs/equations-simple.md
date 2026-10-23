<!-- math -->
# Equations: the simple model

The simple model keeps only the two mechanisms at the core of OSO, and holds everything else fixed:

- **Value flow, $\alpha$** (the absorption rate): the share of incoming value an idea keeps for its author. The rest flows back to the ideas it built on.
- **Publishing, $\beta$**: the chance that an intermediate idea is published as soon as it is proved.

Societies range from closed ($\alpha = 1$, $\beta = 0$: traditional) to fully open with value flow ($\alpha < 1$, $\beta = 1$: OSO), with every mix in between. The [full model](equations.md) has every other mechanism; the symbols here are the same.

## The idea graph

The same as in the full model ([sections 1 to 3](equations.md#1-an-idea)): ideas with a level $\ell_x$, a chance per attempt and a bounty $B_x$, linked to their parents with link weights $w_{y \to x}$. Either **generated** ([section 3.1](equations.md#31-the-generator)): ideas are bit sequences, an attempt works with chance $2^{-\text{bits left}}$, and you set the structure, the difficulty (sequence length) and the attribution (composition). Or **a topic** ([section 3.2](equations.md#32-the-written-topics-parents-required)): parents are required, $p_x = p_0\,\eta^{\ell_x - 1}$, and $w_{y \to x} \propto 1/p_y$.

## What is held fixed

| | Value |
| --- | --- |
| Agents | 12 identical agents (skill 1, exact judgement, cost 1 per attempt, full reuse, no gaming) |
| Money | the budget split equally: every agent gets $\text{Budget}/(R\,N)$ each round, whatever it earned ($\rho = 0$) |
| Mint | off: $m = 0$, so bounties are the only value |
| Validation | off: $\theta = 0$. No agent games, so nothing trivial is ever submitted |
| Ideas and bounties | a generated idea graph (every run draws its own) or a topic's |

## One round

1. **Money.** Each agent gets $b = \dfrac{\text{Budget}}{R\,N}$, makes as many attempts as that pays for, and carries the rest to the next round.
2. **What to attempt.** Each agent scores the ideas it can attempt and picks a good one, as in the full model ([section 8](equations.md#8-choosing-what-to-attempt)), with every agent's traits the same.
3. **An attempt** at $x$ works with chance $p_x$. A success on an idea someone already published is a duplicate and earns nothing.
4. **Publish or keep.** An idea with a bounty is published at once. Any other idea is published at once **with chance $\beta$**; otherwise it stays private until its author proves an idea with a bounty that rests on it, and is published with that one:

$$P(\text{published at once}) = \begin{cases} 1 & B_x > 0 \\ \beta & B_x = 0 \end{cases}$$

5. **Rewards.** There is no mint. A bounty $B_x$ enters $x$ when $x$ is first published and spreads back through the graph: the author of each idea $z$ that $x$ rests on gets $B_x\,\text{share}(x, z)$, with

$$\text{share}(x, x) = \alpha \qquad \text{share}(x, z) = \sum_{y \to x} (1-\alpha)\, w_{y \to x}\, \text{share}(y, z)$$

6. **Take up.** Every agent takes up each published idea at once, and can build on it.

## Measures

The same as the full model ([section 11](equations.md#11-measures)): the hardest level published (frontier), the bounty value found, the return on the money (ROI = value ÷ money spent), and $\beta$ as measured (the **sharing** column, which should match the $\beta$ that was set).

## What to expect

With money split equally and every agent the same, $\alpha$ changes who is paid, and only slightly what agents choose to attempt, so $\beta$ decides how far a society gets. $\alpha$ matters again once money follows earnings ($\rho > 0$), or when agents choose whether to publish ([full model, section 9](equations.md#9-choosing-whether-to-share-where-β-comes-from)), where $\beta$ comes out of $\alpha$.
