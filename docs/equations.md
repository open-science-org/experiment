<!-- math -->
# Equations

Every rule of the experiment as a formula, in the order a run uses them. Each formula has one line saying what it does, and is worked out on the small tree below. The simulation uses all of them; the AI-model tests use the same rules, except where [section 10](#10-ai-model-tests-what-changes) says otherwise. The same ideas in words: [How it works](README.md). Full definitions: [the design](design.md).

## The example tree

![A tree of ideas, levels left to right: z1, z2 and y2 at level 1; y1 at level 2, built on z1 and z2; x at level 3, built on y1 and y2, with a prize of 16](img/equations-tree.svg)

- **Ideas** are the nodes. Every idea is the same kind of thing; they differ only in their level, chance of success, prize and links. An idea with a prize is what other pages call a **target**.
- **Arrows** go from a parent to the idea built on it. The number on an arrow is the **link weight**.
- **Levels** run left to right, easiest first. An idea **before** $x$ is one $x$ builds on, directly or through others ($y_1$, $y_2$, $z_1$, $z_2$). An idea **after** $x$ is built on $x$.
- **The letters are the formulas' own:** $x$ is the idea in question, $y$ its parents, $z$ ideas further back, $u$ ideas after it. When an example looks at another idea, it says so (for example "for $y_1$").

## Symbols

Grouped by what they belong to, in the order of the sections below. A hat marks an agent's own estimate: $\hat B$ is a prize as agent $i$ sees it.

**An idea** ([section 1](#1-an-idea))

| Symbol | Meaning | In the example | Default |
| --- | --- | --- | --- |
| $x$ | an idea | $x$ | |
| $y \to x$ | $y$ is a parent of $x$: $x$ builds on $y$ | $y_1 \to x$ | |
| $z,\ u$ | an idea before $x$, an idea after $x$ | $z_1$ is before $x$ | |
| $\ell_x$ | level | $\ell_x = 3$ | |
| $p_x$ | chance one try at it works | $p_x = 0.18$ | $0.5 \times 0.6^{\ell - 1}$ |
| $B_x$ | prize: 0 for most ideas | $B_x = 16$, $B_{y_1} = 0$ | $4 \times 2^{\ell - 1}$ for ideas with a prize |
| $w_{y \to x}$ | link weight: how much $x$ owes parent $y$ | $w_{y_1 \to x} = 62.5\%$ | from difficulty |

**A try** ([section 2](#2-a-try))

| Symbol | Meaning | Default |
| --- | --- | --- |
| $i$ | an agent | 12 agents |
| $s_i$ | skill | 1 (explorer 0.5) |
| $\pi_{i,x}$ | chance agent $i$'s try at $x$ works | |

**Money** ([section 3](#3-money-each-round))

| Symbol | Meaning | Default |
| --- | --- | --- |
| $X,\ R$ | total money, number of rounds | 1200, 120 |
| $k_i$ | cost of one try | 1 (explorer 0.3) |
| $\rho$ | how far money follows past earnings | 0.5 |
| $b_i,\ \bar E_i$ | agent $i$'s money this round, its recent earnings | |

**The mint** ([section 4](#4-the-mint))

| Symbol | Meaning | In the example | Default |
| --- | --- | --- | --- |
| $m$ | tokens minted for each new idea | | 1 |
| $c$ | share of each mint passed to the parents | | traditional 0, OSO 0.15 |
| $m_x$ | what $x$'s author gets from its mint | $m_{y_1} = 0.85$ | $(1-c)\,m$; $m$ for a root |
| $\theta$ | chance a trivial idea is rejected | | 0.5 |
| $g_i$ | gaming: share of tries spent on trivial ideas, for their mint | | 0 (gamer 0.6) |

**Value flow** ([section 5](#5-value-flow))

| Symbol | Meaning | In the example | Default |
| --- | --- | --- | --- |
| $\alpha$ | share of incoming value an idea's author keeps | $x$ keeps 12.8 of 16 | traditional 1, OSO 0.8 |
| $\text{share}(x, z)$ | part of value entering $x$ that reaches $z$'s author | $\text{share}(x, y_1) = 0.1$ | |
| $F_x$ | flow-back: what authoring $x$ earns from later work | $F_{y_1} = 1.675$ | |

**Choosing what to try** ([section 6](#6-choosing-what-to-try))

| Symbol | Meaning | Default |
| --- | --- | --- |
| $\text{win}_x$ | chance of being first at $x$ | |
| $h_x$ | rounds until value from later ideas arrives | |
| $B^{\text{after}}_x$ | the largest prize after $x$ | |
| $\delta_i$ | patience: how much later payoffs count | 0.85 to 0.98 |
| $q_i,\ \sigma_0$ | judgement, and how wrong a poor judge's estimates are | 0.3 to 1; 1 |
| $\gamma_i$ | risk attitude: above 0 cautious, below 0 chases long shots | −0.2 to 0.2 |
| $V_{i,x},\ U_{i,x}$ | what $x$ is worth to $i$, and its score | |
| $\tau,\ \varepsilon$ | choice randomness, chance of a random pick | 0.3, 0.05 |

**Choosing whether to share** ([section 7](#7-choosing-whether-to-share))

| Symbol | Meaning | Default |
| --- | --- | --- |
| $\beta_i$ | liking for sharing | −1 to 0.5 |
| $\psi$ | scoop risk: how much publishing helps a rival win | 0.5 |
| $\kappa$ | how much publishing raises an idea's use | 1 |

**Sharing and its costs** ([section 8](#8-sharing-and-its-costs))

| Symbol | Meaning | Default |
| --- | --- | --- |
| $\omega_i$ | reuse: chance a round of taking up a published idea | 0.6 to 1 |
| $a$ | cost to take up an idea (optional) | 0 |
| $e$ | chance a proof is wrong (optional) | 0 |

**Measures** ([section 9](#9-measures))

| Symbol | Meaning |
| --- | --- |
| $L^*$ | the main level a run is judged on |
| $\text{value},\ \text{ROI}$ | prizes of the ideas solved, and value per unit of money |
| $SE$ | standard error of a row's average |

## 1. An idea

Each idea $x$ has a level, a chance of success, a prize and links to its parents.

**Chance of success:** each level up, a try works less often.

$$p_x = p_0 \, \eta^{\,\ell_x - 1} \qquad (p_0 = 0.5,\ \eta = 0.6)$$

**Prize:** most ideas have none ($B_x = 0$). In a generated tree, some ideas get one that doubles with the level; a hand-drawn tree can give any idea a prize.

$$B_x = B_0 \cdot 2^{\,\ell_x - 1} \quad \text{for an idea with a prize} \qquad (B_0 = 4)$$

**Link weight** is the work the parent saves: finding parent $y$ again would take about $1/p_y$ tries. An idea's weights add up to 1.

$$w_{y \to x} = \frac{1/p_y}{\sum_{y' \to x} 1/p_{y'}}$$

*Example:* $z_1$, $z_2$ and $y_2$ (level 1) have $p = 0.5$, $y_1$ has $p = 0.3$, and $x$ has $p = 0.18$ and the prize $B_x = 4 \cdot 2^2 = 16$. $x$'s parents are $y_1$ ($1/p = 3.33$) and $y_2$ ($1/p = 2$), so $w_{y_1 \to x} = 3.33/5.33 = 62.5\%$ and $w_{y_2 \to x} = 37.5\%$. $y_1$'s parents $z_1$ and $z_2$ are equally hard: 50% each.

## 2. A try

The chance that agent $i$'s try at $x$ works:

$$\pi_{i,x} = \min(1,\ s_i \, p_x)$$

A specialist's skill is $\times 1.6$ in its own area and $\times 0.4$ elsewhere. A try costs $k_i$. A success on an idea someone else already published is a **duplicate** and earns nothing.

*Example:* a cheap explorer ($s = 0.5$) trying $x$: $\pi = 0.5 \times 0.18 = 0.09$, about one success in eleven tries.

**Learning from failure** (optional). Each failed try makes the next one likelier. $n^{\text{fail}}_{i,x}$ counts $i$'s own failures on $x$, and $n^{\text{fail, public}}_x$ the failures others made public:

$$\pi_{i,x} = \min\!\Big(\text{cap},\ s_i \, p_x \big(1 + \text{gain}\,(n^{\text{fail}}_{i,x} + w_{\text{shared}} \, n^{\text{fail, public}}_{x})\big)\Big)$$

## 3. Money each round

Each round releases $X/R$. Agent $i$ gets part of it equally (out of $N$ agents) and part by its recent earnings $\bar E_i$:

$$b_i = \frac{X}{R}\left[\frac{1-\rho}{N} + \rho\,\frac{\bar E_i}{\sum_{i'} \bar E_{i'}}\right] \qquad \bar E_i \leftarrow 0.7\,\bar E_i + 0.3 \times \text{this round's earnings}$$

It makes $\lfloor b_i / k_i \rfloor$ tries and keeps the rest for the next round. The run stops when the money is spent or every prize is won.

*Example:* with the defaults, each round releases $1200/120 = 10$. An agent earning nothing still gets $10 \times 0.5/12 \approx 0.42$; one earning half of everything gets $0.42 + 10 \times 0.5 \times 0.5 \approx 2.9$.

## 4. The mint

Every new idea mints $m$ tokens. Its author gets $m_x = (1-c)\,m$, and $c\,m$ goes to its parents by link weight, then flows back from there (section 5). A root keeps all of $m$.

*Example* ($c = 0.15$): when $y_1$ is published, its author gets $m_{y_1} = 0.85$, and the authors of $z_1$ and $z_2$ get 0.075 each.

**Gaming.** With chance $g_i$ an agent spends a try on a trivial idea instead, to collect its mint. A trivial idea is rejected with chance $\theta$; if accepted, it earns $m$.

## 5. Value flow

Value entering idea $x$ (a prize, or part of a mint) is split: $x$'s author keeps $\alpha$, and $1-\alpha$ flows to its parents by link weight, where the same split repeats. $\text{share}(x, z)$ is the part that reaches the author of $z$, where $z$ is $x$ itself or an idea before it:

$$\text{share}(x, x) = \alpha \quad (1 \text{ for a root}) \qquad \text{share}(x, z) = \sum_{y \to x} (1-\alpha)\, w_{y \to x}\, \text{share}(y, z)$$

A prize enters its idea when the idea is first published.

*Example* ($\alpha = 0.8$): $x$'s prize of 16. $x$ keeps $0.8 \times 16 = 12.8$. The other 3.2 goes 62.5% to $y_1$ (2.0) and 37.5% to $y_2$ (1.2). $y_1$ keeps $0.8 \times 2.0 = 1.6$ and passes 0.2 each to $z_1$ and $z_2$. In all: **$x$ 12.8, $y_1$ 1.6, $y_2$ 1.2, $z_1$ 0.2, $z_2$ 0.2.** Under traditional rules ($\alpha = 1$), $x$ keeps all 16.

## 6. Choosing what to try

Each round, an agent looks at its **frontier**: ideas it does not know yet whose parents it all knows. It scores each one.

**Chance of being first** at $x$, when $n_x$ agents could try it now:

$$\text{win}_x = \frac{1}{\max(1,\ n_x)}$$

**Rounds until value from later ideas arrives:** 5 per level between $x$ and the ideas with a prize after it (1 if there are none).

$$h_x = \max\!\big(1,\ 5\,(\text{average level of the prized ideas after } x - \ell_x)\big)$$

**Flow-back: what authoring $x$ earns from later work,** if every idea after it is found and published. For each later idea $u$, its prize and its mint flow back to $x$:

$$F_x = \sum_{u \text{ after } x} \Big( B_u \, \text{share}(u, x) \;+\; c\, m \sum_{y \to u} w_{y \to u}\, \text{share}(y, x) \Big)$$

*Example,* for $y_1$: $x$'s prize sends $16 \times 0.2 \times 0.625 \times 0.8 = 1.6$, and $x$'s mint sends $0.15 \times 0.625 \times 0.8 = 0.075$, so $F_{y_1} = 1.675$. Under traditional rules $F_x = 0$ for every idea.

**What $x$ is worth to agent $i$.** $\hat B^{\text{after}}_x$ and $\hat F_x$ are the largest prize after $x$ and the flow-back, as $i$ sees them: the true value times $(1 + \sigma_0 (1 - q_i)\, \xi)$, with $\xi$ a random normal number drawn once.

$$V_{i,x} = \underbrace{m_x}_{\text{mint}} + \underbrace{\alpha\, B_x\, \text{win}_x}_{\text{its own prize}} + \underbrace{\delta_i^{h_x}\, \alpha\, \hat B^{\text{after}}_x\, \text{win}_x}_{\text{stepping stone}} + \underbrace{\delta_i^{h_x}\, \hat F_x}_{\text{flow-back}}$$

**The score** weighs value by the chance of success, with a penalty for uncertain tries:

$$U_{i,x} = V_{i,x}\left(\pi_{i,x} - \gamma_i \sqrt{\pi_{i,x}(1-\pi_{i,x})}\right)$$

*Example,* for $y_1$: $h_{y_1} = 5\,(3 - 2) = 5$. A patient agent ($\delta = 0.98$) counts later value $0.98^5 = 0.90$; an impatient racer ($\delta = 0.85$) only $0.85^5 = 0.44$, so foundations look half as good to it.

**The pick.** With chance $g_i$ the agent farms a trivial idea instead. Otherwise it picks at random with chance $\varepsilon$, and else by softmax: the better the score, the likelier the pick ($U^{\max}_i$ is its best score).

$$P(x) = \frac{\exp\!\big((U_{i,x} - U^{\max}_i)/(\tau\, |U^{\max}_i|)\big)}{\sum_{x' \text{ in the frontier}} \exp\!\big((U_{i,x'} - U^{\max}_i)/(\tau\, |U^{\max}_i|)\big)}$$

## 7. Choosing whether to share

Only in the settings where agents choose; ideas with a prize are always published. Agent $i$ publishes idea $x$ at once if what sharing brings is at least the risk it adds:

$$\underbrace{\beta_i\, m}_{\text{liking for sharing}} + \underbrace{m_x\big(1 - \delta_i^{h_x}\, \text{win}_x\big)}_{\text{mint lost by waiting}} + \underbrace{\delta_i^{h_x}\, \hat F_x\, \kappa}_{\text{credit when others use it}} \;\ge\; \underbrace{\alpha\, \hat B^{\text{after}}_x\, \text{win}_x\, \psi}_{\text{scoop risk}}$$

A private idea earns its mint only if its author later wins a prize after it, which is why waiting can lose it. With no prize after $x$, the whole mint is lost by waiting.

*Example,* for $y_1$ under OSO, with 3 agents able to try it ($\text{win} = 1/3$), $\delta = 0.9$ ($0.9^5 = 0.59$), no liking for sharing, and true estimates. Sharing brings $0.85 \times (1 - 0.59/3) + 0.59 \times 1.675 \approx 1.67$. The scoop risk is $0.8 \times 16 \times \tfrac13 \times 0.5 \approx 2.13$. The agent keeps $y_1$ private. At $\alpha = 0.3$ the risk falls to 0.8 and $F_{y_1}$ rises, so it shares.

## 8. Sharing and its costs

**Uptake.** Each round, agent $i$ takes up each published idea it does not know with chance $\omega_i$, and can then build on it.

**Costly knowledge** (optional). Taking up an idea costs $a$ from the round's money, while the agent can afford it.

**Wrong results** (optional). A successful proof is wrong with chance $e$, and anything built on a wrong idea is wrong too. Ideas with a prize are checked: one resting on a wrong idea is rejected, and the wrong ideas under it are withdrawn.

## 9. Measures

**Frontier:** the hardest level published by the end of the run.

$$\text{frontier} = \max\{\ell_x : x \text{ published}\}$$

**Reach and cost:** the share of runs that published the main level $L^*$, and the money spent by the round they did.

**Value gained and return on the money (ROI):**

$$\text{value} = \sum_{x \text{ found}} B_x \qquad \text{ROI} = \frac{\text{value}}{\text{money spent}}$$

*Example:* finding $x$ for 40 units of money gives value 16 and ROI 0.4.

**Sharing:** the share of proved ideas without a prize published in the round they were proved. **Waste:** the share of money spent on duplicates, dead ends and trivial ideas.

**Credit accuracy:** how well prize pay matches true contribution. Contribution splits each prize won over the ideas in its proof by $1/p$:

$$\text{credit} = 1 - \tfrac12 \sum_i \left| \frac{\text{pay}_i}{\sum \text{pay}} - \frac{\text{contribution}_i}{\sum \text{contribution}} \right|$$

**The answer.** Rows are compared on the measure fixed before the run. Two rows differ clearly when the gap between their averages is more than two standard errors:

$$|\bar v_A - \bar v_B| > 2\sqrt{SE_A^2 + SE_B^2} \qquad SE = \frac{\text{standard deviation}}{\sqrt{\text{number of runs}}}$$

## 10. AI-model tests: what changes

Sections 3 to 5 stay; the rest changes like this:

- **A try** works when Lean accepts the proof. $p_x$ is not set but measured.
- **Prizes:** $B_x = 4 \cdot 2^{\,d_x - 1}$ for the posted theorems, where $d_x$ is the depth in the reference tree.
- **Money** is dollars, as charged by the model provider, and each lab gets the same budget.
- **Link weight** uses the money spent to prove each parent, $\text{spent}_y$, as the stand-in for the work it saves:

$$w_{y \to x} = \frac{\text{spent}_y}{\sum_{y' \to x} \text{spent}_{y'}}$$

- **Choices** (what to try, whether to pass) are the models' own, not the formulas of sections 6 and 7. Sharing is set by the rules: traditional publishes when an idea with a prize is proved, OSO at once.
- **ROI** is prize value per dollar.

What is still a stand-in or a guess: [the design, section 12](design.md#12-not-yet-measured).
