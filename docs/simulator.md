# OSO demo simulator

The simulator is one instantiation of the **[OSO demo experiment specification](design.md)**. The specification defines every concept once:
- ideas and the research tree;
- attempts and success;
- what agents know and what sharing conveys;
- rewards, rounds and measures.

**Read it first.** This document describes how the simulator implements it.

What makes this instantiation the simulation:
- **ideas are abstract:** ideas of a generated tree, with no content;
- **the success oracle is chance:** each attempt succeeds with probability p, drawn by a seeded random-number generator;
- **agents are formulas:** they follow a scoring rule with set traits.

Traditional research and OSO are two settings of the same rules.

Problem spaces, the `new` command and canonical reports are described in the [README](../README.md).

**What it is for.** It checks the mechanics, finds which parameters matter, finds failure modes, and designs the experiment with real LLM agents. It is **not** evidence that OSO works in the real world; see [section 6](#6-what-this-simulation-can-and-cannot-show).

```sh
npm run sim                                     # list the experiments
npm run sim -- settings                         # run one, print its table
npm run sim -- settings --set rules.screen=0.9  # change any setting for every row
npm run sim -- my-experiment.yaml               # run your own experiment file
npm run sim -- all --save                       # run all and log results in results/
npm run sim -- plugins                          # list worlds, rules, policies, columns
npm test                                        # the tests
```

Everything about a run is configuration. The defaults are in [scenarios/default.yaml](../config/scenarios/default.yaml), which documents every setting, and experiments are YAML files in [experiments/](../config/experiments/). See [3. Configuration and extending](#3-configuration-and-extending).

Contents:
- [0. The specification in the simulator](#0-the-specification-in-the-simulator)
- [1. The simple model](#1-the-simple-model)
- [2. The default setup, as implemented](#2-the-default-setup-as-implemented)
- [3. Configuration and extending](#3-configuration-and-extending)
- [4. Measures](#4-measures)
- [5. Results](#5-results)
- [6. What this simulation can and cannot show](#6-what-this-simulation-can-and-cannot-show)
- [7. Code and tests](#7-code-and-tests)

## 0. The specification in the simulator

Where each element of the [specification](design.md) lives:

| Specification | Configuration (scenario) | Code |
| --- | --- | --- |
| Research tree, targets, bounties (2.1) | `world` (plugin: `layered`, `chain`, `file`) | `world.ts` |
| Success oracle and chance p (2.2) | `success.oracle` (plugin: `chance`, `learning`); p from `success` (p0, eta), agent `skill`, specialist boost | `oracles.ts`; `model.ts`, `attempt` |
| Knowledge, publishing, uptake (2.3) | `rules.visibility` (plugin), agent `reuse` | `rules.ts` (`visibilities`), `model.ts` (`publishBundle`, uptake loop) |
| Costly and fallible knowledge (2.3) | `knowledge.absorbCost`, `knowledge.errorRate` | `model.ts` (`absorb`, `retract`) |
| Public failures (2.2) | `rules.publishFailures`, with `success.oracle: learning` | `model.ts` (`attempt`), `oracles.ts` |
| Rewards: mint, bounty, flow-back, screen (2.4) | `rules.alpha`, `rules.c`, `rules.mint`, `rules.screen`, `attribution.noise` | `world.ts` (`shares`, `attributionValue`), `model.ts` (`publishOne`, `payInto`) |
| Budget, rounds, allocation (2.5) | `budget` (allocation plugin) | `rules.ts` (`allocations`), `model.ts` (`run`) |
| One round (2.6) | — | `model.ts`, `run` |
| The rules and settings (3) | `rules`; named settings in `presets.yaml` | `presets.yaml` |
| Traits and archetypes (4.1) | `agents.archetypes`, `agents.mix` | `agents.ts` |
| How agents decide (4.2) | `behaviour.decider` (plugin: `formula`, `random`), per archetype in `agents.deciders`; the formula decider's settings in `behaviour` | `deciders.ts`; `rules.ts` (`policies`) |
| Measures (5) | `measures.targetLevel`; columns in experiments | `measures.ts` |
| Experiments and factors (7) | `experiments/*.yaml` | `experiment.ts`, `cli.ts` |

**The effects of sharing modelled here.** By default, a published idea lets other agents attempt what builds on it, after uptake. It carries no statement, method or failed attempts, and it is always correct and free to take up. Optional mechanics add public failures, a uptake cost, and wrong ideas (section 2.6) ([specification, section 2.3](design.md#23-knowledge-and-sharing)).

## 1. The simple model

Start here: it isolates the one effect everything else builds on, and it has an exact answer, so it also checks the simulator.

**Setup.**
- **The problem:** a single chain of ideas. Idea k can be attempted only once idea k − 1 is known.
- **Difficulty:** every attempt succeeds with the same probability **p = 0.2**.
- **Agents:** N identical agents ("plain" agents: average skill, no preferences).
- **Budget:** A = 640 attempts in total, one per agent per round.

The only difference between the two cases is visibility:
- **Shared progress:** every idea is published, and every agent takes it up at once.
- **Hidden progress:** nothing is published until the end of the chain, which no one reaches. So each agent climbs alone.

The measure is the deepest idea proved by anyone.

**Exact predictions** (`src/experiments/analytic.ts`):
- **Shared:** every attempt, by anyone, works on the current step, so the level is the number of successes in A attempts: **Binomial(A, p)**, with mean **A·p = 128**.
- **Hidden:** each agent gets A/N attempts and climbs alone, so its level is **Binomial(A/N, p)**. The community's deepest idea is the best of N such agents, with mean **Σ_k (1 − F(k)^N)**, where F is the Binomial(X/N, p) distribution function. That is about X·p/N plus a little luck.

**Simulated vs. exact** ([results/simple](../results/simple/summary.md); 1,000 seeds per row; mean ± standard error):

| N | Shared: simulated | Shared: exact | Hidden: simulated | Hidden: exact | Gain from sharing |
| --- | --- | --- | --- | --- | --- |
| 1 | 128.6 ± 0.3 | 128.0 | 128.6 ± 0.3 | 128.0 | 1.00 |
| 2 | 128.3 ± 0.3 | 128.0 | 67.9 ± 0.2 | 68.0 | 1.89 |
| 4 | 128.4 ± 0.3 | 128.0 | 37.2 ± 0.1 | 37.3 | 3.45 |
| 8 | 128.3 ± 0.3 | 128.0 | 21.3 ± 0.1 | 21.2 | 6.02 |
| 16 | 128.3 ± 0.3 | 128.0 | 12.7 ± 0.0 | 12.7 | 10.14 |

**What it shows.**
- **The gain from sharing grows with the number of agents.** With N agents, sharing reaches roughly N times deeper for the same money, a little less because the best of N lone agents gets lucky. Hidden progress makes N agents search the same steps N times.
- **The simulator matches the mathematics.** Every row agrees with the exact value to within about two standard errors. The rows use the same seeds, so their errors move together.

This check also caught a flaw. The simulator's first random-number generator (mulberry32) lowered success rates by about 0.3%, about 3 standard errors over 7,000 runs. With xoshiro128\*\* the simulated level matched the exact value (127.97 vs. 128.0 over 4,000 runs). Commit `77f0d88`.

**What the simple model leaves out:** incentives. Here visibility is imposed. The default setup adds the reasons agents would or wouldn't share, and what they get paid for.

## 2. The default setup, as implemented

The default scenario ([scenarios/default.yaml](../config/scenarios/default.yaml)), with the implementation details the [specification](design.md) leaves to each instantiation. Compared with the simple model, it adds five things:
1. **A branching world** with targets, bounties and dead ends.
2. **Agents with different traits.**
3. **Rewards:** a mint per idea and a bounty per target, paid through the OSO flow-back.
4. **Choices:** agents decide what to attempt and, in one setting, whether to publish.
5. **A funding loop:** earnings buy future money.

### 2.1 The world (`world.ts`)

**Layout.** 8 levels of 10 ideas each, so 80 ideas.
- **Parents.** An idea at level ℓ ≥ 2 has one main parent at level ℓ − 1, plus up to two extra parents. Each extra one comes from the level just below, or (with probability 0.25) from any lower level. Ideas at level 1 are roots.
- **Areas.** There are 3. An idea is in the same area as its main parent with probability 0.8; otherwise its area is random.

**Difficulty.** Every attempt on an idea at level ℓ succeeds with probability:

  p = 0.5 · 0.6^(ℓ−1)

That is 50% at level 1, 18% at level 3, 6.5% at level 5, 2.3% at level 7 and 1.4% at level 8, for an agent of skill 1.

**Targets.** Two each at levels 3, 5 and 7, and one at level 8.
- **Placement:** each is chosen at random from the half of its level with the most ancestors, so targets need real composition.
- **Bounty:** 4 · 2^(ℓ−1), so 16, 64, 256 and 512.

**Dead ends.** Ideas with no target below them. On average about 31 of the 80 ideas (over 200 worlds).

**Link weights.** An idea's parents share its attribution in proportion to their cost, 1/p. Harder parents count more. The ledger can use noisy weights (spread σ_w), but the default is exact.

[world-example.svg](img/world-example.svg) draws the world of seed 1 (`node src/report/draw-world.ts 1 > world.svg`).

Every run draws a new world from its seed. Within an experiment, the same seed gives the same world and agents in every setting, so the settings are compared on identical worlds.

### 2.2 Agents (`agents.ts`)

There are 12 agents. Each has eight traits:

| Archetype | Count | Skill | Conjecture q | Cost k | Horizon δ | Risk γ | Reuse ω | Openness o | Gaming g |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Foundation builder | 3 | 1.0 | 0.7 | 1.0 | 0.98 | 0.2 | 0.9 | 0.5 | 0 |
| Target racer | 3 | 1.0 | 0.5 | 1.0 | 0.85 | −0.2 | 0.6 | 0 | 0 |
| Cheap explorer | 2 | 0.5 | 0.3 | 0.3 | 0.95 | 0 | 0.8 | 0.2 | 0 |
| Specialist | 2 | 1.0 (×1.6 in its area, ×0.4 elsewhere) | 0.6 | 1.0 | 0.95 | 0 | 0.8 | 0.2 | 0 |
| Free rider | 1 | 0.8 | 0.5 | 1.0 | 0.9 | 0 | 1.0 | −1 | 0 |
| Gamer | 1 | 0.8 | 0.3 | 0.5 | 0.9 | 0 | 0.8 | 0 | 0.6 |

What each trait does:
- **Skill** multiplies the success chance: π = min(1, skill · p_x).
- **Conjecture quality** q sets how accurately the agent perceives what an idea is worth. Its estimates are the true values × (1 + (1 − q)·ξ), with ξ standard normal, drawn once per agent and idea.
- **Cost** k is the money per attempt.
- **Horizon** δ discounts value that arrives later, per round.
- **Risk** γ penalizes uncertain payoffs; negative means risk-seeking.
- **Reuse** ω is the chance per round of taking up an idea someone else published.
- **Openness** o is the intrinsic value of publishing, in units of the mint. (β is the share of intermediate ideas a society publishes: see the [Equations page, section 9](equations.md).)
- **Gaming** g is the share of attempts spent farming trivial ideas.

These values are guesses chosen to give a diverse population. They were not measured.

### 2.3 The rules: the only thing the settings change (`presets.yaml`)

| Setting | α | c | Visibility |
| --- | --- | --- | --- |
| Traditional | 1 | 0 | finished-only |
| OSO (immediate) | 0.8 | 0.15 | immediate |
| Flow-back, finished-only | 0.8 | 0.15 | finished-only |
| No flow-back, immediate | 1 | 0 | immediate |
| No flow-back, choice | 1 | 0 | agent's choice |
| OSO (choice) | 0.8 | 0.15 | agent's choice |

- **α**, the absorption rate, is how much of the value entering an idea it absorbs; the rest flows to its parents.
- **c** is the share of each new idea's mint paid to what it built on.
- **Visibility:**
  - **finished-only:** an idea stays private until its author proves a target that depends on it. The author's whole private bundle under that target is then published, oldest first.
  - **immediate:** an idea is published as soon as it is proved, together with any private ideas it needs.
  - **delayed(d):** an idea is published d rounds after it is proved (available, but not used by the named settings).
  - **agent's choice:** the agent decides for each lemma (section 2.5). Targets are always published.

  An idea's parents are always published before it, so value never flows to hidden work.

### 2.4 One round (`model.ts`, function `run`)

The budget is 1,200 over R = 120 rounds, so 10 per round.

1. **Budgets.** Agent i gets:

   b_i = 10 · [ (1 − ρ)/12 + ρ · Ē_i / Σ Ē ]

   with ρ = 0.5. Ē_i is its smoothed recent earnings: Ē ← 0.7·Ē + 0.3·(this round's earnings). Before anyone earns, the split is equal. An agent makes floor(b_i / k_i) attempts and carries the remainder to the next round. All attempts in a round are shuffled, so agents interleave and race.
2. **Delayed publications** due this round are made.
3. **Rivals.** For each idea, count how many agents could attempt it now. This is the race estimate used in scoring.
4. **Attempts,** one at a time:
   - With probability g, the agent farms a trivial idea. It costs k, and the validation screen rejects it with probability θ = 0.5. If accepted, it earns the mint m = 1.
   - Otherwise the agent lists its **frontier**: ideas it doesn't know whose parents it all knows. If the frontier is empty, it spends nothing.
   - With probability ε = 0.05 it picks a random idea from the frontier. Otherwise it picks by softmax over the score U (section 2.5): the probability is proportional to exp((U − U_best) / (τ·|U_best|)), with τ = 0.3.
   - It spends k, and succeeds with probability π.
   - **On success:** if someone else already published the idea, the proof is a duplicate and earns nothing. Otherwise the visibility rule decides whether to publish.
5. **Publishing an idea** makes the agent its author of record:
   - **Mint:** the author earns (1 − c)·m, or the whole m for a root. c·m flows into the idea's parents through flow-back.
   - **Bounty:** if the idea is a target, its bounty enters it through flow-back.
   - **Uptake:** every other agent takes the idea up at once with probability ω.
6. **Uptake.** Every agent takes up each published idea it doesn't yet know, with probability ω.
7. **Earnings** are added up and Ē is updated.
8. **Stopping.** The run ends when the budget is spent, or as soon as every target is solved, since a funder stops paying then.

The symbols below are the ones on the [Equations](equations.md) page, where each formula is worked out on an example tree.

**Link weights** w(y → x) are proportional to 1/p_y: the expected attempts to find parent y, which is the work y saves x ([design, link weights](design.md#24-rewards)).

**Flow-back** (`world.ts`, function `shares`): value v entering idea x pays share(x, z) · v to the author of each z, either x itself or an idea before it.

```
share(x, x) = α                                         (1 if x is a root)
share(x, z) = Σ over parents y of x of (1 − α) · w(y → x) · share(y, z)
```

A test checks that this pays each idea exactly what the ledger's integer OIP-14 flow-back pays (to 1e-9).

### 2.5 Decisions

The default `formula` decider ([deciders.ts](../src/engine/deciders.ts)). Deciders are plugins: an archetype can use another one (`agents.deciders`), such as `random`, a zero-intelligence baseline.

**What to attempt.** The value of idea x to agent i is:

```
V = mint + its own bounty + stepping stone + flow-back
  mint            = m_x = (1 − c)·m                       (m for a root)
  its own bounty  = α · B_x · win                         (0 for ideas without a bounty)
  stepping stone  = δ^h · α · B̂_after · win
  flow-back       = δ^h · F̂
U = V · ( π − γ · √(π·(1 − π)) )
```

- **win** = 1 / max(1, rivals): the agent's chance of being first, where rivals counts the agents (itself included) that could attempt x now.
- **B̂_after:** the agent's estimate of the largest bounty after x. An idea is worth proving on the way to one's own target, under any rules.
- **F̂:** the agent's estimate of F_x, what authoring x will earn from flow-back. F_x assumes every idea after x is found and published:

  F_x = Σ over ideas u after x of [ B_u · share(u, x) + c·m · Σ over parents y of u of w(y → u) · share(y, x) ]

  Under traditional rules (α = 1, c = 0), F_x = 0 for every idea.
- **h:** the expected delay before value from later ideas arrives: 5 rounds per level between x and the ideas with a bounty after it.

**Whether to publish** (agent's choice only). Publish idea x now if:

```
o·m  +  mint lost by waiting  +  δ^h · F̂ · κ   ≥   α · B̂_after · win · ψ
```

- **mint lost by waiting** = m_x × (1 − δ^h · win): publishing earns the mint now, while a private idea is published, and paid, only if its author later wins a target after it.
- **κ = 1:** how much publishing raises an idea's expected use.
- **ψ = 0.5:** the scoop risk: how much publishing raises a rival's chance of winning the target after x. This is the parameter the results are most sensitive to.

### 2.6 Optional mechanics

All are off by default; switching them on changes nothing else.

**Learning from failure.** With `success.oracle: { kind: learning, gain, sharedWeight }`, an attempt by agent i on idea x succeeds with chance:

  p_x × (1 + gain × (i's failures on x + λ × others' public failures on x)), at most `cap`, where λ is `sharedWeight`

With `rules.publishFailures: true`, every failed attempt is public. Under traditional rules this is not the default, but it can be set to separate the two effects.

**Costly knowledge.** With `knowledge.absorbCost > 0`, published ideas are no longer taken up at once and for free:
- at the start of each round, each agent takes up the published ideas it does not know, lowest level first;
- each is taken up with the agent's reuse chance, and each costs `absorbCost` from that round's money, while the agent can afford it;
- what is left funds its attempts.

Spending therefore never exceeds the budget.

**Wrong ideas.** With `knowledge.errorRate > 0`:
- each successful proof is wrong with that chance;
- an idea proved on top of a wrong idea is wrong too, and a published wrong idea passes its wrongness to every agent that takes it up;
- lemmas are not checked, so a wrong lemma earns its mint;
- **targets are checked:** a target proof that is wrong, or rests on a wrong idea, is rejected. The wrong ideas under it are retracted from the agent's knowledge. If a retracted idea was published, the publication is withdrawn and everyone who took it up loses it;
- mints already paid stay, under OIP-11's rule of no clawback.

**The Lean reference tree.** `scenario: lean-tree` uses [worlds/lean-reference.json](../worlds/lean-reference.json). It is the Lean problem set's reference tree, with theorem names replaced by anonymous ids: 42 ideas in areas A, B and C plus cross-area ideas, the 8 posted targets, and bounty 4 · 2^(level − 1). [worlds/from-reference-dag.py](../worlds/from-reference-dag.py) regenerates it. Success chances follow the default model by level, with a budget of 400 and L\* = 5.

## 3. Configuration and extending

### Scenarios

A **scenario** is one complete setup: the world, the agents, the rules, the budget and the agents' behaviour. [scenarios/default.yaml](../config/scenarios/default.yaml) holds every setting with its default and a comment. Any file or override changes only what it names.

| Section | Settings | Defaults |
| --- | --- | --- |
| `world` | A world generator (`kind`) and its parameters | `layered`: 8 levels × 10, ≤ 3 parents, 3 areas, targets at levels 3, 5, 7, 8, bounty 4·2^(ℓ−1) |
| `success` | Success chance per attempt by level, p = p0 · eta^(level − 1), and the success oracle | p0 = 0.5, eta = 0.6; oracle `chance` |
| `attribution` | Noise in the ledger's link weights | 0 (exact) |
| `agents` | Archetypes and their traits, the mix, specialist boost and penalty | 12 agents of six archetypes (section 2.2) |
| `rules` | α, c, mint, validation screen θ, visibility rule, publishing failures | Traditional: α = 1, c = 0, finished-only, θ = 0.5, failures private |
| `knowledge` | Cost to take up a published idea; chance a proof is wrong | 0 and 0: free and correct |
| `budget` | Total money (`X`), rounds (or attempts per agent per round), stopping, allocation rule | 1,200 over 120 rounds; earnings share with ρ = 0.5 |
| `behaviour` | Choice policy, perception noise, κ, ψ, rounds per level | softmax τ = 0.3, ε = 0.05; κ = 1, ψ = 0.5 |
| `measures` | Level L\* for speed and cost | 7 |

**Validation.** Every scenario is checked before it runs. A misspelled or unknown setting is an error, and so are a wrong type, an archetype used in the mix but not defined, and an unknown parameter of a plugin. So a typo can't silently do nothing.

**Overrides** use nested YAML or dotted paths, for example `rules.alpha: 0.8` or `--set budget.allocation.rho=0`. When a component's `kind` changes, it is replaced whole, so parameters of the old kind don't leak into the new one.

### Experiments

An experiment is a YAML file in [experiments/](../config/experiments/):

```yaml
id: my-experiment
title: Does a strong screen help OSO?
description: One paragraph, copied into the saved summary.
seeds: 100                      # seeds per row; every row uses the same seeds (paired comparison)
scenario: default               # base scenario: default, a name in scenarios/, or a path
set:                            # overrides for every row
  rules.visibility: { kind: choice }
factors:                        # every combination of levels becomes one row; first factor outermost
  - name: setting               # a factor of named levels, inline (set) or from presets.yaml (preset)
    levels:
      - { label: Traditional, preset: traditional }
      - { label: OSO, preset: osoChoice }
  - { name: θ, path: rules.screen, values: [0.5, 0.9] }   # a sweep of one setting
patches:                        # overrides for rows whose settings match
  - { when: { rules.alpha: 1 }, set: { rules.c: 0 } }
exclude:                        # rows to leave out
  - { rules.alpha: 1, rules.c: 0.15 }
columns: [frontier, reachTarget, cost, sharing, gamerShare]   # see `npm run sim -- plugins`
```

An experiment may instead name an `analysis` that builds its own table, as `simple.yaml` does with `simple-chain-exact`. [presets.yaml](../config/presets.yaml) holds the six rule settings by name.

### Plugins

Components chosen by `kind` are plugins. `npm run sim -- plugins` lists them with their parameters.

| Registry | In a scenario | Built in |
| --- | --- | --- |
| `worlds` (src/engine/world.ts) | `world.kind` | `layered` (random levels), `chain` (the simple model), `file` (any DAG from JSON) |
| `visibilities` (src/engine/rules.ts) | `rules.visibility.kind` | `finished-only`, `immediate`, `delayed` (`d`), `choice` |
| `allocations` (src/engine/rules.ts) | `budget.allocation.kind` | `earnings-share` (`rho`, `smoothing`), `equal` |
| `oracles` (src/engine/oracles.ts) | `success.oracle.kind` | `chance` (succeeds with chance p), `learning` (`gain`, `cap`: each failure raises the next chance) |
| `deciders` (src/engine/deciders.ts) | `behaviour.decider.kind`, `agents.deciders.<archetype>.kind` | `formula` (section 2.5), `random` (`publish`) |
| `policies` (src/engine/rules.ts) | `behaviour.policy.kind` (formula decider) | `softmax` (`tau`, `epsilon`), `greedy` |
| `COLUMNS` (src/engine/measures.ts) | `columns:` | frontier, reach, speed, cost, spend, productivity, breadth, waste, credit, sharing, hoarded, reuse, duplicates, targets solved, gamer share, trivial spend |
| `analyses` (src/experiments/experiment.ts) | `analysis:` | `simple-chain-exact` |

**A world from a file** reads `{ "nodes": [{ "id", "prereqs"?, "p"?, "area"?, "bounty"? }] }`, with every idea listed after the ideas it builds on. Levels are derived from the parents. An idea's `p` overrides the success model, and a `bounty` makes it a target. This is how the Lean problem set's reference DAG, with measured success chances, can become a simulated world.

**Adding a plugin** means registering it once; it can then be used from any YAML file. For example, a visibility rule that publishes only every k-th round:

```ts
// in rules.ts, or any module imported by the simulator
visibilities.register<{ every: number }>('batched', {
  description: 'Results are published in batches every `every` rounds',
  defaults: { every: 5 },
  create: ({ every }) => ({
    onProof: (ctx) => ctx.schedule(Math.ceil((ctx.round + 1) / every) * every),
  }),
});
```

```yaml
rules: { visibility: { kind: batched, every: 10 } }
```

The other registries work the same way:
- **A world generator** returns a function `(success, rng) => World`; `finishWorld` builds the World from levels, parents, p and bounties.
- **A success oracle** returns `{ succeeds(ctx) }`. The context includes the agent, the idea, the environment's chance p, the agent's past failures on that idea, the random stream, and the decider's `payload`. An oracle that runs Lean's checker on a written proof would be one more plugin.
- **A decider** returns `{ choose(agent, frontier), wouldPublish(agent, result, choice) }`. It must use only what its agent knows (specification, section 2.3) and draw randomness only from the run's stream. An LLM decider, which prompts a model and attaches its proof as the payload, would be one more plugin.
- **A measure** is an entry in `COLUMNS`.

The core loop (`model.ts`) is only the environment: frontier, success, publishing, payment and money. Every decision and every source of success is a plugin. Today the loop is synchronous; LLM deciders and a Lean oracle will need an asynchronous version of it, which is the next change for the Lean harness.

**Reproducibility.** A run depends only on its scenario and seed. Each component draws from its own random stream (world, agents, attribution noise, perception, the run itself), so changing one part of a setup does not reshuffle the others. Both refactors (to configuration, then to oracle and decider plugins) reproduced every saved idea exactly: all 56 table rows of the five experiments.

## 4. Measures

Computed at the end of each run (`model.ts`, function `measure`):

| Measure | Definition |
| --- | --- |
| **frontier** | Highest level published |
| **reach L7** | Share of runs in which level 7 was published |
| **speed** | First round in which level 7 was published (runs that reached it) |
| **cost** | Spend at that round |
| **spend** | Total spend; less than the budget when every target was solved early |
| **ideas per 100** | Published, non-trivial ideas per 100 units of spend |
| **breadth** | Share of targets solved |
| **waste** | Share of spend on redundant work (attempts by others on an idea someone published first, including failed attempts), dead ends and trivial ideas |
| **credit** | Credit accuracy: 1 − ½ Σ_i \| bounty pay share − contribution share \|. Each solved target's bounty is split over every idea in its proof, in proportion to cost 1/p, to define contribution. **High trivially when one agent proves a whole chain alone, as under traditional rules**, so compare it only between settings that share work |
| **sharing** | Share of proved lemmas published in the same round they were first proved |
| **hoarded** | Share of proved lemmas never published |
| **gamer share of pay** | Share of all pay that went to the gaming agent |
| **rejected targets**, **retracted** | Target proofs rejected because they rested on a wrong idea; wrong ideas retracted |
| **uptake spend** | Share of spend on taking up others' published ideas |
| **trivial spend** | Share of spend on trivial ideas |

Tables show mean ± standard deviation over seeds. Per-run values, including the frontier at 11 points of spend, are in each experiment's `runs.jsonl`.

## 5. Results

Logged in [results/](../results/LOG.md). Every saved result names the commit that produced it. To regenerate one:

```sh
git checkout <commit> && npm run sim -- <experiment> --seeds <n> --save
```

### Six settings ([results/settings](../results/settings/summary.md), 100 seeds)

| Setting | Frontier | Reach L7 | Cost to L7 | Ideas per 100 | Credit | Sharing | Gamer share of pay |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 5.7 ± 1.2 | 35% | 957 | 2.4 | 0.95 | 0.01 | 0.96 |
| OSO (immediate) | 7.9 ± 0.2 | 100% | 485 | 7.7 | 0.57 | 1.00 | 0.38 |
| Flow-back, finished-only | 5.5 ± 1.1 | 28% | 959 | 2.3 | 0.96 | 0.00 | 0.97 |
| No flow-back, immediate | 7.9 ± 0.3 | 100% | 494 | 7.6 | 0.47 | 1.00 | 0.37 |
| No flow-back, choice | 6.0 ± 0.9 | 35% | 990 | 3.5 | 0.88 | 0.23 | 0.92 |
| OSO (choice) | 6.3 ± 1.0 | 43% | 959 | 3.7 | 0.87 | 0.22 | 0.91 |

### α sweep under agent's choice ([results/alpha-sweep](../results/alpha-sweep/summary.md), 100 seeds)

| α | 1 | 0.8 | 0.6 | 0.5 | 0.4 | 0.3 | 0.2 | 0.1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Sharing | 0.23 | 0.22 | 0.25 | 0.28 | 0.34 | 0.47 | 0.63 | 0.77 |
| Reach L7 | 35% | 43% | 48% | 63% | 73% | 86% | 98% | 100% |
| Frontier | 6.0 | 6.3 | 6.4 | 6.7 | 6.9 | 7.2 | 7.6 | 7.8 |

The full grid over scoop risk ψ and cited share c is in [results/alpha-psi](../results/alpha-psi/summary.md).

### Sensitivity ([results/sensitivity](../results/sensitivity/summary.md), 100 seeds)

| Variant | Traditional frontier | OSO frontier | Gap | Gamer share of pay (traditional) |
| --- | --- | --- | --- | --- |
| Default (ρ = 0.5, θ = 0.5) | 5.7 | 7.9 | 2.2 | 0.96 |
| No funding loop (ρ = 0) | 4.6 | 8.0 | 3.4 | 0.36 |
| Strong screen (θ = 0.9) | 5.7 | 8.0 | 2.3 | 0.83 |
| No gamer | 7.0 | 8.0 | 1.0 | – |

### More complex setups ([lean-tree](../results/lean-tree/summary.md), [failures](../results/failures/summary.md), [costly-sharing](../results/costly-sharing/summary.md), [complex](../results/complex/summary.md); 100 seeds)

**The Lean reference tree** (budget 400, L\* = 5):

| Setting | Frontier | Reach L5 | Cost to L5 | Targets solved (of 8) | Sharing |
| --- | --- | --- | --- | --- | --- |
| Traditional | 4.4 | 44% | 303 | 4.8 | 0.01 |
| OSO (immediate) | 7.0 | 100% | 125 | 8.0 | 1.00 |
| OSO (choice) | 5.2 | 76% | 273 | 6.3 | 0.42 |

**Learning from failure** (default world; gain 0.1). Cost to reach level 7:

| | No learning | Learn from own failures | Learn from public failures |
| --- | --- | --- | --- |
| Traditional | 957 | 865 | 810 |
| OSO (immediate) | 485 | 367 | 284 |

**Costly and fallible sharing** (default world). Frontier, and targets solved, traditional vs. OSO:

| Uptake cost | Error rate | Traditional | OSO |
| --- | --- | --- | --- |
| 0 | 0 | 5.7, 4.2 | 7.9, 6.9 |
| 0 | 0.15 | 4.5, 3.0 | 7.2, 4.9 |
| 1 | 0 | 5.5, 4.0 | 7.3, 5.4 |
| 1 | 0.15 | 4.5, 3.0 | 6.6, 3.4 |

### What the results say

1. **Sharing does most of the work.** Immediate visibility reaches level 7 in every run at about half the cost, with or without flow-back. The simple model shows why: hidden progress makes every agent repeat the same steps. In this model the effect is largely built in (section 6).
2. **Flow-back makes agents choose to share, but only when α is well below OSO's 0.8.**
   - **At 0.8:** sharing barely moves (0.22 vs. 0.23 at α = 1).
   - **At 0.3:** it doubles to 0.47.
   - **At 0.1:** it reaches 0.77, and every run reaches level 7.

   With a lower scoop risk (ψ = 0.1), the turn comes earlier: sharing is 0.61 at α = 0.5. So the threshold α\* exists in this model, but where it falls depends on ψ, which is a guess.
3. **The cited mint share c barely matters,** because the mint (1) is small next to the bounties (16 to 512).
4. **Flow-back makes credit more accurate when work is shared:** 0.57 with flow-back vs. 0.47 without, both with immediate visibility. The traditional setting's 0.95 is the trivial case of one agent proving a whole chain alone.
5. **Under traditional rules, the gaming agent captures the money.** Intermediate ideas stay private, so nobody else earns anything until they win a target. Meanwhile the gamer's trivial ideas earn mint from the first round, so the funding loop hands it the largest budget. It then wins most targets too, and ends with a median of 100% of all pay. Without the gamer, traditional reaches level 7.0 instead of 5.7, and the gap to OSO shrinks from 2.2 levels to 1.0. **So a large part of the default gap comes from one spammer combined with earnings-driven funding,** a real-world pattern, but an assumption here. Present the gap together with this decomposition.
6. **Without the funding loop (ρ = 0), the gap grows** (4.6 vs. 8.0), because traditional agents can no longer concentrate money on whoever is ahead.
7. **The real tree shape favours OSO more.** On the Lean reference tree, OSO solves all 8 targets in every run, at 41% of traditional's cost to level 5. With agent's choice, agents share more than on random trees (0.42 vs. 0.22 at α = 0.8): the real tree has many shallow ideas with little scoop risk.
8. **Public failures help a sharing community most.** Learning from everyone's failures cuts OSO's cost to level 7 by 41% (485 to 284), and traditional's by 15% (957 to 810).
9. **Costly, fallible sharing narrows OSO's lead.** With both an uptake cost of 1 and a 15% error rate, OSO still reaches deeper (6.6 vs. 4.5), but solves barely more targets (3.4 vs. 3.0). Errors cause more retractions under OSO (21 vs. 10 at a 15% error rate), because wrong ideas spread to more agents. This is an argument for checking every idea, as Lean does, before others build on it.
10. **Everything combined on the Lean tree:** OSO stays ahead. Publishing failures stops mattering once taking up is costly.

## 6. What this simulation can and cannot show

It is a thought experiment with the arithmetic done exactly. The [specification, section 6](design.md#6-instantiations) compares it element by element with the Lean experiment. Where it departs from real research, starting with the largest gaps:

1. **Agents never invent problems.** Every possible idea already exists, and agents see exactly which ones they can attempt. Real research is mostly finding the right question or lemma.
2. **By default, the benefit of sharing is largely built in.** A published idea is instantly usable, always correct and free to take up. The optional costs and errors (section 2.6) test how much of the advantage survives without that, but their sizes are guesses.
3. **Attempts are independent draws by default.** The learning oracle adds learning from failure in a simple form; there is still no partial progress.
4. **The agents are formulas.** Their behaviour is the scoring rule in section 2.5. Real scientists and LLM agents may respond to incentives differently.
5. **The key numbers are guesses.** Bounties, the mint, the traits, and above all the scoop risk ψ were chosen, not measured. Where α\* falls is a property of these assumptions.
6. **The worlds are random graphs,** not fields with foundational ideas, fashions or dying lines of work.

What the tests still use a stand-in or a guess for, in both kinds of test, is listed in [the design, section 12](design.md#12-not-yet-measured).

What it is good for:
- checking the mechanics (flow-back matches the ledger, and the simple model matches the mathematics);
- finding which parameters matter (ψ, α, ρ and the gamer, while c barely matters);
- finding failure modes (spam capturing money);
- choosing the settings, budget and number of runs for the experiment with LLM agents on real problems, which addresses gaps 1, 3 and 4.

## 7. Code and tests

| Path | Contents |
| --- | --- |
| `src/engine/` | The environment and its plugins: `model.ts` (one run), `world.ts` (worlds `layered`, `chain`, `graph`, `file`; flow-back shares; attribution value S), `agents.ts`, `rules.ts` (visibility, allocation, choice policies), `oracles.ts`, `deciders.ts`, `measures.ts` (measures and table columns), `config.ts` (scenario types, loading, merging, validation), `registry.ts`, `rng.ts` (seeded xoshiro128\*\*) |
| `src/experiments/` | `experiment.ts` expands experiments into rows and runs them; `analytic.ts` holds the simple model's exact predictions |
| `src/spaces/` | `spaces.ts` loads and validates problem spaces and calibrates budgets; `new-space.ts` has Claude write a space |
| `src/report/` | `battery.ts` (the canonical experiments), `report.ts` (the canonical report and index), `figures.ts` (SVG charts), `draw-world.ts` |
| `src/cli.ts`, `src/paths.ts` | The command line; where everything lives |
| `config/` | `scenarios/default.yaml` (every setting, documented), `scenarios/lean-tree.yaml`, `presets.yaml` (the six rule settings), `experiments/*.yaml` |
| `spaces/` | Problem spaces, one YAML file each |
| `worlds/` | Data for file worlds: the Lean reference tree and the script that builds it |
| `results/` | Saved experiments: per experiment `summary.md`, `config.json` (every parameter, the commit), `runs.jsonl` (one line per run); `LOG.md` lists every saved run |
| `reports/` | One canonical report per space, and the index |
| `vendor/oso-ledger/` | A pinned copy of the app's ledger, used only by the tests (`npm run sync-ledger` refreshes it) |
| `test/` | Tests |

The tests (`npm test`) check:
- flow-back against the ledger;
- the simple model against its exact predictions;
- that lemmas have no flow-back value under traditional rules;
- reproducibility from a seed;
- that payouts equal mints plus solved bounties;
- both predictions of the model doc on fixed seeds;
- the configuration layer: validation errors, component replacement, worlds from files, experiment expansion, and the delayed visibility rule;
- the plugins: a learning oracle reaches deeper than chance, and deciders can differ by archetype;
- problem spaces: every space loads, bad spaces are rejected with usable messages, graph worlds derive levels, the generator sends errors back until the file is valid (with a stub model), and every report has the canonical sections and files.
