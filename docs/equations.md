<!-- math -->
# Equations

Every rule of the experiment as a formula, in the order a run uses them. Each formula has one line saying what it does, and is worked out on the small tree below. The simulation uses all of them; the AI-model tests use the same rules, except where [section 12](#12-ai-model-tests-what-changes) says otherwise. The same ideas in words: [How it works](README.md). Full definitions: [the design](design.md).

## The example tree

![A tree of ideas, levels left to right: z1, z2 and y2 at level 1; y1 at level 2, built on z1 and z2; x at level 3, built on y1 and y2, with a bounty of 16](img/equations-tree.svg)

- **This tree follows the parents-required rule** ([section 3.2](#32-the-lean-problem-set-parents-required)); the definitions in sections 1 and 2 hold for any idea graph, and [section 3.1](#31-the-generator) generates graphs of any shape.
- **Ideas** are the circles in the tree. Every idea is the same kind of thing; they differ only in their level, chance of success, bounty and links. An idea with a bounty is what other pages call a **target**.
- **Arrows** go from a parent to the idea built on it. The number on an arrow is the **link weight**. Credit flows the other way, against the arrows.
- **Levels** run left to right, easiest first. An idea **before** $x$ is one $x$ builds on, directly or through others ($y_1$, $y_2$, $z_1$, $z_2$). An idea **after** $x$ is built on $x$.
- **The letters are the formulas' own:** $x$ is the idea in question, $y$ its parents, $z$ ideas further back, $u$ ideas after it. When an example looks at another idea, it says so (for example "for $y_1$").

## One round, as a loop

![One round as a loop of six steps: 1 money, 2 choose what to attempt, 3 attempt, 4 publish or keep, 5 rewards, 6 earnings, which feed the next round's money through rho. Dashed: alpha and c send credit back to earlier ideas, which changes what agents choose to try and share](img/equations-loop.svg)

A run is $R$ rounds (120 by default). A **round** is one pass through steps 1 to 6: that round's money $\text{Budget}/R$ is split among the agents, each makes the attempts it can afford, new ideas are shared or kept, rewards are paid and recent earnings are updated. The **next round** starts again at step 1, with the money split by those updated earnings. Each step's box names its section and symbols. Two loops feed back:

- **Money follows earnings ($f$, for funding).** Earnings in step 6 set next round's money in step 1. This happens under both rules.
- **Credit flows back (absorption rate $\alpha$, and $c$).** Rewards in step 5 reach earlier ideas, so agents expect more from building and sharing (steps 2 and 4). This is where traditional ($\alpha = 1$, $c = 0$) and OSO ($\alpha = 0.8$, $c = 0.15$) differ.

## Symbols

Grouped by what they belong to, in the order of the sections below. A hat marks an agent's own estimate: $\hat B$ is a bounty as agent $i$ sees it.

**An idea** ([section 1](#1-an-idea))

| Symbol | Meaning | In the example | Default |
| --- | --- | --- | --- |
| $x$ | an idea | $x$ | |
| $\ell_x$ | level | $\ell_x = 3$ | |
| $B_x$ | bounty: 0 for most ideas | $B_x = 16$, $B_{y_1} = 0$ | |
| $K$ | the ideas an agent already knows | | |
| $W_x(K),\ p_x(K)$ | work to find $x$ knowing $K$ (in attempts), and the chance one attempt works | | |

**The idea graph** ([section 2](#2-the-idea-graph))

| Symbol | Meaning | In the example | Default |
| --- | --- | --- | --- |
| $y \to x$ | $y$ is a parent of $x$: knowing $y$ lowers the work for $x$ | $y_1 \to x$ | |
| $z,\ u$ | an idea before $x$, an idea after $x$ | $z_1$ is before $x$ | |
| $\phi_{y \to x}$ | contribution: the work $y$ saves $x$ (Shapley value) | $\phi_{y_1 \to x} = 3.33$ | |
| $w_{y \to x}$ | link weight: contributions scaled to add up to 1 | $w_{y_1 \to x} = 62.5\%$ | |
| $\text{share}(x, z)$ | part of value entering $x$ that reaches $z$'s author ($z$ is $x$ or an idea before it) | $\text{share}(x, y_1) = 0.1$ | |

**Parents required** ([section 3.2](#32-the-lean-problem-set-parents-required))

| Symbol | Meaning | In the example | Default |
| --- | --- | --- | --- |
| $p_x$ | chance one attempt works, once all parents are known | $p_x = 0.18$ | $p_0\,\eta^{\ell - 1}$ |
| $p_0,\ \eta$ | chance at level 1, and how much harder each level is | | 0.5, 0.6 |
| $B_0$ | bounty of a level-1 idea with a bounty | | 4 |

**An attempt** ([section 4](#4-an-attempt))

| Symbol | Meaning | Default |
| --- | --- | --- |
| $i$ | an agent | 12 agents |
| $s_i$ | skill | 1 (explorer 0.5) |
| $\pi_{i,x}$ | chance agent $i$'s attempt at $x$ works | |
| $n^{\text{fail}},\ \lambda$ | failed attempts (optional learning), and how much others' public failures count | |

**Money** ([section 5](#5-money-each-round))

| Symbol | Meaning | Default |
| --- | --- | --- |
| $\text{Budget},\ R,\ N$ | total money, number of rounds, number of agents | 1200, 120, 12 |
| $k_i$ | cost of one attempt | 1 (explorer 0.3) |
| $f$ | funding: how far money follows past earnings | 0.5 |
| $\text{money}_i,\ \bar E_i$ | agent $i$'s money this round, and its recent earnings | |

**The mint** ([section 6](#6-the-mint))

| Symbol | Meaning | In the example | Default |
| --- | --- | --- | --- |
| $m$ | tokens minted for each new idea | | 1 |
| $c$ | cited share: part of each mint passed to the parents | | traditional 0, OSO 0.15 |
| $m_x$ | what $x$'s author gets from its mint | $m_{y_1} = 0.85$ | $(1-c)\,m$; $m$ for a root |
| $\theta$ | chance a trivial idea is rejected | | 0.5 |
| $g_i$ | gaming: share of attempts spent on trivial ideas, for their mint | | 0 (gamer 0.6) |

**Value flow** ([section 7](#7-value-flow))

| Symbol | Meaning | In the example | Default |
| --- | --- | --- | --- |
| $\alpha$ | absorption rate: how much of the value entering an idea it absorbs (for its author); the rest passes to its parents | $x$ keeps 12.8 of 16 | traditional 1, OSO 0.8 |
| $F_x$ | flow-back: what authoring $x$ earns from later work | $F_{y_1} = 1.675$ | |

**Choosing what to attempt** ([section 8](#8-choosing-what-to-attempt))

| Symbol | Meaning | Default |
| --- | --- | --- |
| $\text{rivals}_x,\ \text{win}_x$ | agents that could attempt $x$ now, and the chance of being first | |
| $h_x$ | rounds until value from later ideas arrives | |
| $B^{\text{after}}_x$ | the largest bounty after $x$ | |
| $\delta_i$ | patience: how much later payoffs count | 0.85 to 0.98 |
| $q_i,\ \sigma_0$ | judgement, and how wrong a poor judge's estimates are | 0.3 to 1; 1 |
| $\gamma_i$ | risk attitude: above 0 cautious, below 0 chases long shots | −0.2 to 0.2 |
| $V_{i,x},\ U_{i,x}$ | what $x$ is worth to $i$, and its score | |
| $\tau,\ \varepsilon$ | choice randomness, chance of a random pick | 0.3, 0.05 |

**Choosing whether to share** ([section 9](#9-choosing-whether-to-share-where-β-comes-from))

| Symbol | Meaning | Default |
| --- | --- | --- |
| $o_i$ | openness: how much the agent likes publishing for its own sake | −1 to 0.5 |
| $\beta$ | share of intermediate ideas published at once: set by the rules, or the result of agents' choices | 0 traditional, 1 OSO |
| $\beta_{i,x}$ | chance agent $i$ publishes idea $x$ at once | |
| $\psi$ | scoop risk: how much publishing helps a rival win | 0.5 |
| $\kappa$ | how much publishing raises an idea's use | 1 |

**Sharing and its costs** ([section 10](#10-sharing-and-its-costs))

| Symbol | Meaning | Default |
| --- | --- | --- |
| $\omega_i$ | reuse: chance a round of taking up a published idea | 0.6 to 1 |
| $a$ | uptake cost: money to take up an idea (optional) | 0 |
| $e$ | chance a proof is wrong (optional) | 0 |

**Measures** ([section 11](#11-measures))

| Symbol | Meaning |
| --- | --- |
| $L^*$ | the main level a run is judged on |
| $\text{value},\ \text{ROI}$ | bounties of the ideas solved, and value per unit of money |
| $SE$ | standard error of a row's average |

## 1. An idea

An idea is anything an agent can try to find: a result, a lemma, a design. What describes one idea $x$:

- **Level** $\ell_x$: how far it is from the start; higher is harder.
- **Bounty** $B_x$: the reward posted on it; 0 for most ideas. An idea with a bounty is a **target**.
- **Work** $W_x(K)$: the expected money, in attempts, to find $x$ for an agent that already knows the set of ideas $K$. Each attempt at $x$ works with chance $p_x(K)$, so the work is about $1/p_x(K)$ attempts once $x$ can be attempted at all.

Work is what ties ideas together: knowing other ideas can make $x$ cheaper to find, or possible at all.

## 2. The idea graph

The ideas and how they help each other form the **idea graph** of a problem space. Everything in this section is a property of the graph (and of $\alpha$), not of what agents do. Section 3 generates them.

**Parents.** $y$ is a **parent** of $x$, written $y \to x$, if knowing $y$ lowers the work for $x$: $W_x(K \cup \{y\}) < W_x(K)$. A parent can be **required** (without it $x$ cannot be attempted: the work is infinite) or just **helpful**. An idea **before** $x$ is a parent, a parent's parent, and so on; an idea **after** $x$ is one built on $x$. A **root** has no parents.

**Contribution** of parent $y$ to $x$: the work $y$ saves. When parents overlap (either one would do, or they help more together), each one's saving is averaged over every order in which $x$'s parents could become known (the **Shapley value**), so the savings add up exactly to what all parents save together:

$$\phi_{y \to x} = \frac{1}{|\text{orders}|} \sum_{\text{orders}} \Big( W_x(\text{parents known before } y) - W_x(\text{those} \cup \{y\}) \Big)$$

**Link weight:** the contributions, scaled so that an idea's weights add up to 1:

$$w_{y \to x} = \frac{\phi_{y \to x}}{\sum_{y' \to x} \phi_{y' \to x}}$$

**How value spreads through the graph.** Value entering idea $x$ is split: $x$ absorbs $\alpha$ of it for its author (the **absorption rate**, set by the rules), and $1-\alpha$ passes to its parents by link weight, where the same split repeats. $\text{share}(x, z)$ is the part that reaches the author of $z$, where $z$ is $x$ itself or an idea before it:

$$\text{share}(x, x) = \alpha \quad (1 \text{ for a root}) \qquad \text{share}(x, z) = \sum_{y \to x} (1-\alpha)\, w_{y \to x}\, \text{share}(y, z)$$

The shares from one idea add up to 1, so value is never lost or created. With $\alpha = 1$ (traditional), $\text{share}(x, x) = 1$ and nothing passes back.

## 3. Generating idea graphs

### 3.1 The generator

One generator makes idea graphs of any shape, with three groups of controls that can be set separately. Each idea is a **sequence of bits** (like coin tosses): part of it is made of pieces of its parents' sequences, the rest is new.

| Group | Control | What it sets | Default |
| --- | --- | --- | --- |
| **Structure** | levels, ideas per level | how deep and how wide the graph is | 6, 8 |
| | parents per idea | how many earlier ideas an idea builds on, on average | 2 |
| | skip | chance a parent comes from an older level instead of the level just below | 0.2 |
| **Difficulty** | length $L_1$, growth $g$ | an idea at level $\ell$ is a sequence of $L_\ell = L_1 + g\,(\ell - 1)$ bits | 3, 2 |
| **Attribution** | composition $\kappa$ | the share of an idea's bits that are pieces of its parents' sequences | 0.7 |
| Bounties | ideas with a bounty | how many top-level ideas carry one, of $B_0 \cdot 2^{\ell - 1}$ | 2 |

**Building one idea** $x$ at level $\ell$: it takes $\kappa\,L_\ell$ bits from its parents, one contiguous piece from each in equal shares, and adds $L_\ell - \kappa L_\ell$ new bits of its own. Write $\text{bits}(x)$ for its set of bits.

**An attempt.** Every bit inside an idea the agent knows is resolved. An attempt at $x$ works with chance

$$p_x(K) = 2^{-\,|\text{bits}(x) \,\setminus\, \text{bits resolved by } K|} \qquad W_x(K) = 2^{\,|\text{unresolved bits}|} \text{ attempts}$$

Any idea can be attempted at any time: parents are **helpful, not required**. Knowing a parent resolves the bits the child took from it.

**Link weight:** the bits each parent resolves inside the child. A bit that several parents contain is split equally among them, which is exactly the Shapley value for this case:

$$\phi_{y \to x} = \sum_{b \,\in\, \text{bits}(x) \cap \text{bits}(y)} \frac{1}{\big|\{y' \to x : b \in \text{bits}(y')\}\big|} \qquad w_{y \to x} = \frac{\phi_{y \to x}}{\sum_{y' \to x} \phi_{y' \to x}}$$

*Example:* $y$ = HHT and $x$ = HHTHHH ($x$ took all 3 of $y$'s bits and added 3). From scratch, $W_x = 2^6 = 64$ attempts; knowing $y$, $W_x = 2^3 = 8$. If $x$ instead has two parents HHTH and THHH that overlap in TH, each resolves 4 of $x$'s 6 bits; the 2 shared bits are split, so each contributes $2 + 1 = 3$: weights 50% each.

**Presets.** Three topics are named settings of the generator, each with its story (description and glossary) and a full report on the Results page:

| Preset | Levels × width | Parents | Length, growth | Composition | Why |
| --- | --- | --- | --- | --- | --- |
| Abstract research field | 8 × 10 | 2 | 2, +1.5 | 0.7 | a generic, deep and wide field |
| Early-stage drug discovery | 6 × 9 | 1.5 | 2, +2 | 0.5 | each stage reuses only part of the evidence before it; many dead ends |
| Solid-state battery | 5 × 4 | 2.5 | 3, +2 | 0.8 | a small field where ideas lean heavily on what came before |

Their numbers are illustrative, not measured from the fields. Reports made before October 24 used hand-written graphs; they are kept as earlier versions.

**What the controls do** (12 identical agents, 10 runs; level reached of 6): with the defaults, traditional reaches 1.2 and OSO 6.0. Lower composition (0.2) makes parents help little, and even OSO stalls at 3.9; higher composition (0.95) makes parents do most of the work, and traditional reaches 5.4, because an agent's own private ideas help it too. Longer sequences, more parents or more levels make it harder for traditional much faster than for OSO.

### 3.2 The Lean problem set: parents required

The Lean problem set's tree (the real structure of the theorems the AI models prove), and every result saved before October 23, use this rule: an idea can be attempted only once all its parents are known. The example tree follows it too.

- **Chance per attempt** falls with the level, once every parent is known; all parents are required:

$$p_x = p_0 \, \eta^{\,\ell_x - 1} \qquad (p_0 = 0.5,\ \eta = 0.6) \qquad W_x = 1/p_x \text{ attempts}$$

- **Bounties** sit on some ideas and double with the level (a hand-drawn graph can put one on any idea):

$$B_x = B_0 \cdot 2^{\,\ell_x - 1} \qquad (B_0 = 4)$$

- **Contribution:** without parent $y$, an agent has to find $y$ first, which takes about $1/p_y$ attempts; that is the work $y$ saves. Parents' savings simply add up, so the Shapley value is just $\phi_{y \to x} = 1/p_y$:

$$w_{y \to x} = \frac{1/p_y}{\sum_{y' \to x} 1/p_{y'}}$$

*Example:* $z_1$, $z_2$ and $y_2$ (level 1) have $p = 0.5$, $y_1$ has $p = 0.3$, and $x$ has $p = 0.18$ and the bounty $B_x = 4 \cdot 2^2 = 16$; the others have no bounty. $x$'s parents are $y_1$ ($1/p = 3.33$) and $y_2$ ($1/p = 2$), so $w_{y_1 \to x} = 3.33/5.33 = 62.5\%$ and $w_{y_2 \to x} = 37.5\%$. $y_1$'s parents $z_1$ and $z_2$ are equally hard: 50% each. With $\alpha = 0.8$, the shares of value entering $x$ are:

| $z$ | $\text{share}(x, z)$ | How |
| --- | --- | --- |
| $x$ | 0.8 | $x$ absorbs $\alpha$ |
| $y_1$ | 0.1 | $0.2 \times 0.625$ reaches $y_1$, which absorbs 0.8 of it |
| $y_2$ | 0.075 | $0.2 \times 0.375$; $y_2$ is a root and keeps it all |
| $z_1$, $z_2$ | 0.0125 each | $0.2 \times 0.625 \times 0.2 \times 0.5$ |

### 3.3 The Lean graph

The AI-model tests use a third kind, described in [section 12](#12-ai-model-tests-what-changes): theorems and lemmas, with work measured rather than set.

## 4. An attempt

The chance that agent $i$'s try at $x$ works:

$$\pi_{i,x} = \min(1,\ s_i \, p_x)$$

A specialist's skill is $\times 1.6$ in its own area and $\times 0.4$ elsewhere. An attempt costs $k_i$. A success on an idea someone else already published is a **duplicate** and earns nothing.

*Example:* a cheap explorer ($s = 0.5$) attempting $x$: $\pi = 0.5 \times 0.18 = 0.09$, about one success in eleven attempts.

**Learning from failure** (optional). Each failed attempt makes the next one likelier. $n^{\text{fail}}_{i,x}$ counts $i$'s own failures on $x$, and $n^{\text{fail, public}}_x$ the failures others made public, which count $\lambda$ times as much:

$$\pi_{i,x} = \min\!\Big(\text{cap},\ s_i \, p_x \big(1 + \text{gain}\,(n^{\text{fail}}_{i,x} + \lambda \, n^{\text{fail, public}}_{x})\big)\Big)$$

## 5. Money each round

Each round releases $\text{Budget}/R$. Agent $i$ gets part of it equally (out of $N$ agents) and part by its recent earnings $\bar E_i$:

$$\text{money}_i = \frac{\text{Budget}}{R}\left[\frac{1-f}{N} + f\,\frac{\bar E_i}{\sum_{i'} \bar E_{i'}}\right] \qquad \bar E_i \leftarrow 0.7\,\bar E_i + 0.3 \times \text{this round's earnings}$$

It makes $\lfloor \text{money}_i / k_i \rfloor$ attempts and keeps the rest for the next round. The run stops when the money is spent or every bounty is won.

*Example:* with the defaults, each round releases $1200/120 = 10$. An agent earning nothing still gets $10 \times 0.5/12 \approx 0.42$; one earning half of everything gets $0.42 + 10 \times 0.5 \times 0.5 \approx 2.9$.

## 6. The mint

Every new idea mints $m$ tokens. Its author gets $m_x = (1-c)\,m$, and $c\,m$ goes to its parents by link weight, then flows back from there (section 7). A root keeps all of $m$.

*Example* ($c = 0.15$): when $y_1$ is published, its author gets $m_{y_1} = 0.85$, and the authors of $z_1$ and $z_2$ get 0.075 each.

**Gaming.** With chance $g_i$ an agent spends an attempt on a trivial idea instead, to collect its mint. A trivial idea is rejected with chance $\theta$; if accepted, it earns $m$.

## 7. Value flow

Value enters an idea in two ways, and then spreads through the graph by $\text{share}$ (section 2):

- **A bounty** $B_x$ enters $x$ when $x$ is first published. The author of each $z$ gets $B_x \, \text{share}(x, z)$.
- **A mint's cited part** $c\,m$ enters $x$'s parents by link weight when $x$ is published (section 6), and spreads on from each parent the same way.

*Example* ($\alpha = 0.8$): $x$'s bounty of 16 pays **$x$ 12.8, $y_1$ 1.6, $y_2$ 1.2, $z_1$ 0.2, $z_2$ 0.2** ($16 \times$ the shares in section 3.2). Under traditional rules ($\alpha = 1$), $x$ keeps all 16.

## 8. Choosing what to attempt

Each round, an agent looks at its **frontier**: ideas it does not know yet whose parents it all knows. It scores each one.

**Chance of being first** at $x$, when $\text{rivals}_x$ agents (itself included) could attempt it now:

$$\text{win}_x = \frac{1}{\max(1,\ \text{rivals}_x)}$$

**Rounds until value from later ideas arrives:** 5 per level between $x$ and the ideas with a bounty after it (1 if there are none).

$$h_x = \max\!\big(1,\ 5\,(\text{average level of the ideas with a bounty after } x - \ell_x)\big)$$

**Flow-back: what authoring $x$ earns from later work,** if every idea after it is found and published. For each later idea $u$, its bounty and its mint flow back to $x$:

$$F_x = \sum_{u \text{ after } x} \Big( B_u \, \text{share}(u, x) \;+\; c\, m \sum_{y \to u} w_{y \to u}\, \text{share}(y, x) \Big)$$

*Example,* for $y_1$: $x$'s bounty sends $16 \times 0.2 \times 0.625 \times 0.8 = 1.6$, and $x$'s mint sends $0.15 \times 0.625 \times 0.8 = 0.075$, so $F_{y_1} = 1.675$. Under traditional rules $F_x = 0$ for every idea.

**What $x$ is worth to agent $i$.** $\hat B^{\text{after}}_x$ and $\hat F_x$ are the largest bounty after $x$ and the flow-back, as $i$ sees them: the true value times $(1 + \sigma_0 (1 - q_i)\, \xi)$, with $\xi$ a random normal number drawn once.

$$V_{i,x} = \underbrace{m_x}_{\text{mint}} + \underbrace{\alpha\, B_x\, \text{win}_x}_{\text{its own bounty}} + \underbrace{\delta_i^{h_x}\, \alpha\, \hat B^{\text{after}}_x\, \text{win}_x}_{\text{stepping stone}} + \underbrace{\delta_i^{h_x}\, \hat F_x}_{\text{flow-back}}$$

**The score** weighs value by the chance of success, with a penalty for uncertain attempts:

$$U_{i,x} = V_{i,x}\left(\pi_{i,x} - \gamma_i \sqrt{\pi_{i,x}(1-\pi_{i,x})}\right)$$

*Example,* for $y_1$: $h_{y_1} = 5\,(3 - 2) = 5$. A patient agent ($\delta = 0.98$) counts later value $0.98^5 = 0.90$; an impatient racer ($\delta = 0.85$) only $0.85^5 = 0.44$, so foundations look half as good to it.

**The pick.** With chance $g_i$ the agent farms a trivial idea instead. Otherwise it picks at random with chance $\varepsilon$, and else by softmax: the better the score, the likelier the pick ($U^{\max}_i$ is its best score).

$$P(x) = \frac{\exp\!\big((U_{i,x} - U^{\max}_i)/(\tau\, |U^{\max}_i|)\big)}{\sum_{x' \text{ in the frontier}} \exp\!\big((U_{i,x'} - U^{\max}_i)/(\tau\, |U^{\max}_i|)\big)}$$

## 9. Choosing whether to share: where β comes from

$\beta$ is the **share of intermediate ideas** (ideas without a bounty) that are published in the round they are proved. It is a measure of how open a society is: 0 is closed, 1 is fully open. Ideas with a bounty are always published.

Two settings fix it by rule: traditional and the other finished-only settings publish an idea only with the target that rests on it ($\beta \approx 0$); OSO and the other immediate settings publish everything at once ($\beta = 1$). In the settings where agents choose, $\beta$ is not set: it comes out of every agent's decision about every idea it proves, in four steps.

**Step 1. One decision.** Agent $i$ has just proved idea $x$. It publishes $x$ at once if what sharing brings is at least the risk sharing adds:

$$\underbrace{o_i\, m}_{\text{openness}} + \underbrace{m_x\big(1 - \delta_i^{h_x}\, \text{win}_x\big)}_{\text{mint lost by waiting}} + \underbrace{\delta_i^{h_x}\, \hat F_x\, \kappa}_{\text{credit when others use it}} \;\ge\; \underbrace{\alpha\, \hat B^{\text{after}}_x\, \text{win}_x\, \psi}_{\text{scoop risk}}$$

- **Openness** $o_i$: how much the agent likes publishing for its own sake, in units of the mint (its kind sets it: foundation builder 0.5, free rider −1).
- **Mint lost by waiting:** a private idea is paid its mint only if its author later wins a bounty after it, which happens with chance about $\delta_i^{h_x}\,\text{win}_x$ in today's value. With no bounty after $x$, the whole mint is lost by waiting.
- **Credit when others use it:** the flow-back $F_x$ (section 8) the idea will earn once later ideas are built on it, counted at today's value.
- **Scoop risk:** publishing helps rivals win the bounty after $x$; $\psi$ is how much it raises their chance.

**Step 2. Both sides depend on α.** The flow-back grows and then shrinks as $\alpha$ falls, because an idea receives $1-\alpha$ of what flows from later ideas but keeps only $\alpha$ of what reaches it. The scoop risk falls in a straight line with $\alpha$. For $y_1$ in the example tree (one step before $x$, link weight 0.625, bounty 16 after it):

$$F_{y_1}(\alpha) = \underbrace{16 \times 0.625\,(1-\alpha)\,\alpha}_{\text{from } x\text{'s bounty}} + \underbrace{0.15 \times 0.625\,\alpha}_{\text{from } x\text{'s mint}} \qquad \text{scoop risk} = \alpha \times 16 \times \text{win} \times \psi$$

**Step 3. A threshold.** With 3 agents able to attempt $y_1$ ($\text{win} = 1/3$), patience $\delta = 0.9$ ($\delta^{h} = 0.9^5 = 0.59$), openness 0 and exact estimates:

| $\alpha$ | 0.95 | 0.8 | 0.6 | 0.5 | 0.3 | 0.1 |
| --- | --- | --- | --- | --- | --- | --- |
| $F_{y_1}$ | 0.56 | 1.68 | 2.46 | 2.55 | 2.13 | 0.91 |
| sharing brings | 1.02 | 1.67 | 2.13 | 2.19 | 1.94 | 1.22 |
| scoop risk | 2.53 | 2.13 | 1.60 | 1.33 | 0.80 | 0.27 |
| publishes? | no | no | yes | yes | yes | yes |

The two sides cross at $\alpha^* \approx 0.72$: this agent publishes $y_1$ when $\alpha \le 0.72$.

**Step 4. From one decision to $\beta$.** Agents see $\hat F_x$ and $\hat B^{\text{after}}_x$ through their judgement: each is the true value times $(1 + \sigma_0 (1-q_i)\,\xi)$, with $\xi$ a random normal number (section 8). So for a given agent and idea, publishing happens with a probability, not a yes or no:

$$\beta_{i,x} = P\big(\text{sharing brings} \ge \text{scoop risk}\big) \quad \text{over the agent's estimation errors}$$

For $y_1$ above:

| Judgement $q$ | $\alpha = 0.8$ | $\alpha = 0.5$ | $\alpha = 0.3$ |
| --- | --- | --- | --- |
| 1 (exact) | 0 | 1 | 1 |
| 0.7 (foundation builder) | 0.26 | 0.92 | 0.99 |
| 0.3 (explorer, gamer) | 0.39 | 0.74 | 0.88 |

A society's $\beta$ is the average over every decision in a run, by every agent, about every intermediate idea it proves:

$$\beta = \frac{\text{intermediate ideas published in the round they were proved}}{\text{intermediate ideas proved}}$$

It is the **sharing** measure on the result cards. Measured on the default field, with agents choosing ([α sweep](../results/alpha-sweep/summary.md), 100 runs each):

| $\alpha$ | 1 | 0.8 | 0.6 | 0.5 | 0.4 | 0.3 | 0.2 | 0.1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| $\beta$ | 0.23 | 0.22 | 0.25 | 0.28 | 0.34 | 0.47 | 0.63 | 0.77 |

Even with no flow-back ($\alpha = 1$), about a quarter of ideas are published: dead ends (no bounty after them, so nothing to be scooped and the whole mint lost by waiting) and agents with high openness. $\beta$ rises steeply only once $\alpha \le 0.4$, because the scoop risk is the whole bounty after $x$, while the flow-back to an intermediate idea is only a share of it. Everything here rests on $\psi$, which is a guess (see [not yet measured](design.md#12-not-yet-measured)).

## 10. Sharing and its costs

**Uptake.** Each round, agent $i$ takes up each published idea it does not know with chance $\omega_i$, and can then build on it.

**Uptake cost** (optional). Taking up an idea costs $a$ from the round's money, while the agent can afford it.

**Wrong ideas** (optional). A successful proof is wrong with chance $e$, and anything built on a wrong idea is wrong too. Ideas with a bounty are checked: one resting on a wrong idea is rejected, and the wrong ideas under it are withdrawn.

## 11. Measures

**Frontier:** the hardest level published by the end of the run.

$$\text{frontier} = \max\{\ell_x : x \text{ published}\}$$

**Reach and cost:** the share of runs that published the main level $L^*$, and the money spent by the round they did.

**Value gained and return on the money (ROI):**

$$\text{value} = \sum_{x \text{ found}} B_x \qquad \text{ROI} = \frac{\text{value}}{\text{money spent}}$$

*Example:* finding $x$ for 40 units of money gives value 16 and ROI 0.4.

**Sharing:** the share of proved ideas without a bounty published in the round they were proved. **Waste:** the share of money spent on **repeated work** (attempts at an idea someone else had already proved, whether or not they published it), on dead ends, and on trivial ideas.

**Credit accuracy:** how well bounty pay matches true contribution. Contribution splits each bounty won over the ideas in its proof by $1/p$:

$$\text{credit} = 1 - \tfrac12 \sum_i \left| \frac{\text{pay}_i}{\sum \text{pay}} - \frac{\text{contribution}_i}{\sum \text{contribution}} \right|$$

**The answer.** Rows are compared on the measure fixed before the run. Two rows differ clearly when the gap between their averages is more than two standard errors:

$$|\bar v_A - \bar v_B| > 2\sqrt{SE_A^2 + SE_B^2} \qquad SE = \frac{\text{standard deviation}}{\sqrt{\text{number of runs}}}$$

## 12. AI-model tests: what changes

The AI-model tests use a third idea graph, **the Lean graph**, with the definitions of sections 1 and 2. Sections 5 to 7 (money, the mint, value flow) stay; the rest changes like this:

- **Ideas** are theorems and lemmas. The posted targets are fixed; agents add new lemmas as they go, so the graph grows during a run.
- **An attempt** works when Lean accepts the proof. The work $W_x(K)$ is not set but measured: what models spend to prove $x$.
- **Parents** are exactly the earlier ideas a proof uses; Lean records them.
- **Bounties:** $B_x = B_0 \cdot 2^{\,\ell_x - 1}$ for the posted theorems, where $\ell_x$ is the theorem's level in the reference tree.
- **Money** is dollars, as charged by the model provider, and each agent gets the same budget.
- **Contribution** uses the money spent to prove each parent, $\text{spent}_y$, as the stand-in for the work it saves (exact only if the parent would have to be proved again from scratch):

$$w_{y \to x} = \frac{\text{spent}_y}{\sum_{y' \to x} \text{spent}_{y'}}$$

- **Choices** (what to attempt, whether to pass) are the models' own, not the formulas of sections 8 and 9. Sharing is set by the rules: traditional publishes when an idea with a bounty is proved, OSO at once.
- **ROI** is bounty value per dollar.

What is still a stand-in or a guess: [the design, section 12](design.md#12-not-yet-measured).
