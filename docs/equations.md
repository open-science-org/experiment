<!-- math -->
# Equations

Every rule of the experiment as a formula, in the order a run uses them. Each formula has one line saying what it does. The simulation uses all of them; the AI-model tests use the same rules, except where [section 9](#9-ai-model-tests-what-changes) says otherwise. Words for the same ideas: [How it works](README.md). Full definitions: [the design](design.md).

## Symbols

| Symbol | Meaning | Default |
| --- | --- | --- |
| $r, j, x$ | results (nodes of the tree); $j$ is a parent of $x$ when $x$ builds on $j$ | |
| $\ell_r$ | level of result $r$ | |
| $p_r$ | chance that one try at $r$ works | from the level |
| $B_t$ | prize (bounty) of target $t$ | from the level |
| $i$ | an agent | 12 agents |
| $X,\ T$ | total budget, number of rounds | 1200, 120 |
| $\alpha$ | share of incoming value a result's author keeps | traditional 1, OSO 0.8 |
| $c$ | share of each new mint paid to the results it built on | traditional 0, OSO 0.15 |
| $m$ | mint: tokens for each new result | 1 |
| $\rho$ | how far money follows past earnings | 0.5 |
| $\theta$ | chance a trivial result is rejected | 0.5 |
| $\psi$ | scoop risk: how much publishing helps a rival win | 0.5 |
| $\kappa$ | how much publishing raises a result's use | 1 |
| $\tau,\ \varepsilon$ | choice randomness, chance of a random pick | 0.3, 0.05 |
| $s_i, q_i, k_i, \delta_i, \gamma_i, \omega_i, \beta_i, g_i$ | agent traits: skill, judgement, cost per try, patience, risk attitude, reuse, liking for sharing, gaming | by kind |

## 1. The tree

How hard a result is: each level up, a try works less often.

$$p_r = p_0 \, \eta^{\,\ell_r - 1} \qquad (p_0 = 0.5,\ \eta = 0.6)$$

How big a prize is: it grows with the level.

$$B_t = B_0 \, g^{\,\ell_t - 1} \qquad (B_0 = 4,\ g = 2)$$

A hand-drawn tree can set $p_r$ and $B_t$ for each result instead.

## 2. A try

The chance that agent $i$'s try at $r$ works. A specialist has $s_i \times 1.6$ in its own area and $s_i \times 0.4$ elsewhere.

$$\pi_{ir} = \min(1,\ s_i \, p_r)$$

With learning from failure (optional), each failed try makes the next one likelier; $F_{ir}$ are $i$'s own failures on $r$, $F^{\text{pub}}_{r}$ the public failures of others.

$$\pi_{ir} = \min\!\Big(\text{cap},\ s_i \, p_r \big(1 + \text{gain}\,(F_{ir} + w_{\text{shared}} \, F^{\text{pub}}_{r})\big)\Big)$$

A try costs $k_i$. A success on a result someone else already published is a duplicate and earns nothing.

## 3. Money each round

Each round releases $X/T$. Agent $i$ gets part of it equally and part by its recent earnings $\bar E_i$:

$$b_i = \frac{X}{T}\left[\frac{1-\rho}{N} + \rho\,\frac{\bar E_i}{\sum_{i'} \bar E_{i'}}\right] \qquad \bar E_i \leftarrow 0.7\,\bar E_i + 0.3\,E_i^{\text{this round}}$$

It makes $\lfloor b_i / k_i \rfloor$ tries and keeps the rest for the next round. The run stops when the money is spent or every target is solved.

## 4. Rewards

**The mint.** A new result pays its author $(1-c)\,m$; the other $c\,m$ goes to the results it built on (through the waterfall below). A result that builds on nothing keeps all of $m$. A trivial result is rejected with chance $\theta$; if accepted it earns $m$.

**The prize.** When target $t$ is first published, $B_t$ enters it through the waterfall.

**Link strength** is the work the parent saves: finding parent $j$ again would take about $1/p_j$ tries. A result's weights over its parents add up to 1.

$$w_{xj} = \frac{1/p_j}{\sum_{j' \in \text{parents}(x)} 1/p_{j'}}$$

**The waterfall.** Value $v$ entering result $x$ pays the author of each result $a$ (either $x$ itself or one it rests on) the amount $v \cdot \text{share}_{xa}$:

$$\text{share}_{xx} = \alpha \quad (1 \text{ if } x \text{ has no parents}) \qquad \text{share}_{xa} = \sum_{j \in \text{parents}(x)} (1-\alpha)\, w_{xj}\, \text{share}_{ja}$$

With $\alpha = 1$ and $c = 0$ (traditional), nothing flows back.

## 5. Choosing what to try

**Chance of being first** at $r$, where $n_r$ agents could try it now:

$$\text{win}_r = \frac{1}{\max(1,\ n_r)}$$

**How long until value from below arrives,** in rounds: 5 per level between $r$ and the targets that build on it (1 if there are none).

$$h_r = \max\!\big(1,\ 5\,(\bar\ell_{\text{targets above } r} - \ell_r)\big)$$

**What authoring $r$ will earn from others' work** (flow-back), if every target built on it is solved and every result built on it is published:

$$S_r = \sum_{t \text{ built on } r} B_t \, \text{share}_{tr} \;+\; \sum_{d \text{ built on } r} c\, m \sum_{j \in \text{parents}(d)} w_{dj}\, \text{share}_{jr}$$

Under traditional rules, $S_r = 0$.

**What $r$ is worth to agent $i$.** $\hat B_r$ is the largest prize built on $r$, as $i$ sees it; $\hat S_r$ is $S_r$ as $i$ sees it. Each is the true value times $(1 + \sigma_0 (1 - q_i)\, \xi)$, with $\xi$ a standard normal drawn once.

$$V_{ir} = \underbrace{(1-c)\,m}_{\text{mint}} + \underbrace{\alpha\, B_r\, \text{win}_r}_{\text{prize, if a target}} + \underbrace{\delta_i^{h_r}\, \alpha\, \hat B_r\, \text{win}_r}_{\text{stepping stone}} + \underbrace{\delta_i^{h_r}\, \hat S_r}_{\text{flow-back}}$$

**Score,** with a penalty for uncertain tries ($\gamma_i > 0$ cautious, $< 0$ chases long shots):

$$U_{ir} = V_{ir}\left(\pi_{ir} - \gamma_i \sqrt{\pi_{ir}(1-\pi_{ir})}\right)$$

**The pick.** With chance $g_i$ the agent farms a trivial result instead. Otherwise, with chance $\varepsilon$ it picks a result at random, and else by softmax over its frontier $F_i$ (results it does not know whose parents it all knows):

$$P(r) = \frac{\exp\!\big((U_{ir} - U^{\max}_i)/(\tau\, |U^{\max}_i|)\big)}{\sum_{r' \in F_i} \exp\!\big((U_{ir'} - U^{\max}_i)/(\tau\, |U^{\max}_i|)\big)}$$

## 6. Choosing whether to share

Only in the settings where agents choose. Targets are always published. Agent $i$ publishes result $r$ at once if what sharing brings is at least the risk it adds:

$$\underbrace{\beta_i\, m}_{\text{liking for sharing}} + \underbrace{M_r\big(1 - \delta_i^{h_r}\, \text{win}_r\big)}_{\text{mint lost by waiting}} + \underbrace{\delta_i^{h_r}\, \hat S_r\, \kappa}_{\text{credit when others use it}} \;\ge\; \underbrace{\alpha\, \hat B_r\, \text{win}_r\, \psi}_{\text{scoop risk}}$$

Here $M_r$ is $r$'s mint, $(1-c)\,m$, or $m$ if it has no parents. A private result earns its mint only if its author later wins a target built on it, which is why waiting can lose it.

## 7. Sharing and its costs

**Uptake.** Each round, agent $i$ takes up each published result it does not know with chance $\omega_i$.

**Costly knowledge** (optional). Taking up a result costs $a$ from the round's money, while the agent can afford it.

**Wrong results** (optional). A successful proof is wrong with chance $e$; anything built on a wrong result is wrong too. Targets are checked: a target resting on a wrong result is rejected, and the wrong results under it are withdrawn.

## 8. Measures

**Frontier:** the hardest level published by the end of the run.

$$\text{frontier} = \max\{\ell_r : r \text{ published}\}$$

**Reach and cost:** the share of runs that published level $L^*$, and the money spent by the round they did.

**Value gained and return on the money (ROI):**

$$\text{value} = \sum_{t \text{ solved}} B_t \qquad \text{ROI} = \frac{\text{value}}{\text{spend}}$$

**Sharing:** the share of proved lemmas published in the round they were proved. **Waste:** the share of spend on duplicates, dead ends and trivial results.

**Credit accuracy:** how well prize pay matches true contribution (each solved target's prize split over the results in its proof by $1/p$):

$$\text{credit} = 1 - \tfrac12 \sum_i \left| \frac{\text{pay}_i}{\sum \text{pay}} - \frac{\text{contribution}_i}{\sum \text{contribution}} \right|$$

**The answer.** Rows are compared on the measure fixed before the run. Two rows differ clearly when the gap between their means is more than two standard errors:

$$|\bar y_A - \bar y_B| > 2\sqrt{SE_A^2 + SE_B^2} \qquad SE = \frac{\text{sd}}{\sqrt{n}}$$

## 9. AI-model tests: what changes

The rules in sections 3 to 6 stay, with these differences:

- **A try** works when Lean accepts the proof; $p_r$ is not set but measured.
- **Prizes:** $B_t = 4 \cdot 2^{\,d_t - 1}$, where $d_t$ is the target's depth in the reference tree.
- **Money** is dollars, as charged by the model provider; each lab gets the same budget.
- **Link strength** uses the money spent to prove each parent, $\text{cost}_j$, as the stand-in for the work it saves:

$$w_{xj} = \frac{\text{cost}_j}{\sum_{j' \in \text{parents}(x)} \text{cost}_{j'}}$$

- **Choices** (what to try, whether to pass) are the models' own, not the formulas of sections 5 and 6. Sharing is set by the rules: traditional publishes when a target is solved, OSO at once.
- **ROI** is prize value per dollar.

What is still a stand-in or a guess: [the design, section 12](design.md#12-not-yet-measured).
