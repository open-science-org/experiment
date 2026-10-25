# Model versions

The model's version goes up whenever a change alters what runs produce. New optional settings that are off by default, and new measures, do not change it. Every simulation result records the version it ran on (the **Model** column in Runs → History); results from an older version are marked **older model** until they are rerun.

| Version | Date | What changed |
| --- | --- | --- |
| 5 | 2026-10-25 | **No flat mint.** The flat mint per idea is off in every model; the knowledge reward (1 per new bit, flowing back with $\alpha_0 = \alpha$) replaces it, in the full model too. The model can now be built up **step by step** (simple model, then agents choosing what to share, then earnings shaping money, then different agents, then a gamer). |
| 4 | 2026-10-25 | **Knowledge reward.** A published idea earns $m_{\text{bit}}$ per new bit (bits in no published idea yet), flowing back with its own absorption rate $\alpha_0$ ($= \alpha$ by default). On in the simple model ($m_{\text{bit}} = 1$), off in the full model. New measures (no effect on runs): knowledge found, knowledge published, knowledge per unit of money. |
| 3 | 2026-10-24 | **Bounty placement.** On each level with bounties, they go at random to ideas among the half resting on the most earlier ideas, instead of fixed positions. |
| 2 | 2026-10-24 | **The idea graph generator.** Ideas are coin-toss sequences; an attempt works with chance $2^{-\text{unresolved bits}}$; parents help but are not required; link weights are each parent's share of the bits (Shapley). Waste counts all repeated work, published or private. |
| 1 | 2026-10-21 | **Random-layer world.** Every parent required, a fixed chance per level ($0.5 \cdot 0.6^{\ell-1}$), three areas. |

v5 changed only defaults that every simple-model experiment already set (no flat mint, knowledge reward 1 per bit), so simple-model results from v4 are identical under v5 and are marked v5.

Results made before versioning started (2026-10-25) were stamped by when they ran: those on the random-layer world as version 1, the archived copies of the example reports as version 3.
