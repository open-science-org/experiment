<!-- math -->
# Equations: the model step by step

*Model version 5 ([what changed in each version](model-versions.md)).*

The model is built up one mechanism at a time, so each step's effect can be seen on its own. Step 1 is the [simple model](equations-simple.md). Step 5 has exactly the [full model](equations.md)'s mechanisms and agents; the full model then compares six sharing rules (imposed or chosen, with or without flow-back) where step 5 sweeps α with agents choosing. The full model's optional extras (costly or wrong sharing, learning from failure) stay off in both. Every step uses the same idea graph, bounties and knowledge reward: a published idea earns 1 per new bit, flowing back with $\alpha$.

| Step | Adds | Equations | Setting |
| --- | --- | --- | --- |
| 1 | **The simple model.** 12 identical agents, equal money each round. $\alpha$ and $\beta$ are set. | [simple model](equations-simple.md) | — |
| 2 | **Agents choose what to share.** Each agent publishes an idea when its reward beats the risk a rival uses it to win a bounty first. $\beta$ is no longer set: it comes out of the choices. | [section 9](equations.md#9-choosing-whether-to-share-where-β-comes-from) | visibility: choice |
| 3 | **Earnings shape next round's money.** Half of each round's money goes to agents by what they earned. | [section 5](equations.md#5-money-each-round) | $f = 0.5$ |
| 4 | **Different kinds of agents.** 3 foundation builders, 3 target racers, 2 cheap explorers, 2 specialists, a free rider and 1 plain agent. | [section 8](equations.md#8-choosing-what-to-attempt) | the agent mix |
| 5 | **A gamer, and validation.** The last plain agent becomes a gamer, who spends some attempts on trivial ideas; validators reject them half the time. A trivial idea adds no new bits, so it earns nothing. | [section 6](equations.md#6-the-mint) | gamer 1, $\theta = 0.5$ |

**What is compared.** At step 1, societies by $\alpha$ and $\beta$. From step 2, **traditional** (finished work only, $\alpha = 1$) against **agents choosing** at several $\alpha$, since $\beta$ is now their choice. The **sharing** measure shows the $\beta$ that came out.

**Reading the steps.** If a mechanism matters, the gap between traditional and OSO changes at the step that adds it. Step 2 is the key one for OSO's claim: it shows whether flow-back ($\alpha < 1$) makes agents choose to share.
