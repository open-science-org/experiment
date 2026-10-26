# The simulator: code guide

The model is defined on the [Equations page](equations.md). This page says where it lives in the code, how to configure and extend it, and how it is checked.

```sh
npm run sim                                     # list the experiments
npm run sim -- <experiment>                     # run one, print its table
npm run sim -- <experiment> --set rules.screen=0.9   # change any setting for every row
npm run sim -- <experiment> --save              # run it and save the result in results/
npm run sim -- plugins                          # list worlds, rules, policies, columns
npm test                                        # the tests
```

## Where the model lives

| Equations page | Setting (scenario) | Code (`src/engine/`) |
| --- | --- | --- |
| Idea graph and generator (1–3) | `world` (`ideas`, `chain`, `file`) | `world.ts` |
| An attempt (4) | `success.oracle` (`chance`, `learning`), agent `skill` | `difficulty.ts`, `oracles.ts`, `model.ts` |
| Money each round (5) | `budget` (allocation `earnings-share` with `rho` = f, or `equal`) | `rules.ts`, `model.ts` |
| Mint and knowledge reward (6) | `rules.mint`, `rules.c`, `rules.mintPerBit`, `rules.alpha0`, `rules.screen` | `model.ts` (`publishOne`, `payInto`) |
| Value flow (7) | `rules.alpha` | `world.ts` (`shares`) |
| Choosing what to attempt (8) | `behaviour`, `agents.archetypes`, `agents.mix` | `deciders.ts`, `agents.ts` |
| Choosing whether to share (9) | `rules.visibility` (`finished-only`, `immediate`, `delayed`, `choice`, `chance` with β) | `rules.ts`, `deciders.ts` |
| Sharing and its costs (10) | `knowledge.absorbCost`, `knowledge.errorRate`, `rules.publishFailures` | `model.ts` |
| Measures (11) | `columns` in an experiment | `measures.ts` |

The core loop (`model.ts`) is only the environment: what can be attempted, success, publishing, payment and money. Every decision and every source of success is a plugin.

## The one-chain check

The one effect everything else builds on, with an exact answer, so it also checks the simulator. One chain of ideas, each needing the one before; every attempt works with chance 0.2; N identical agents share 640 attempts. **Shared:** every idea is published at once. **Hidden:** nothing is published, so each agent climbs alone. Measure: the deepest idea anyone proved. Exact values are in `src/experiments/analytic.ts`.

| N | Shared (simulated) | Shared (exact) | Hidden (simulated) | Hidden (exact) | Gain from sharing |
| --- | --- | --- | --- | --- | --- |
| 1 | 128.6 | 128.0 | 128.6 | 128.0 | 1.0× |
| 2 | 128.3 | 128.0 | 67.9 | 68.0 | 1.9× |
| 4 | 128.4 | 128.0 | 37.2 | 37.3 | 3.5× |
| 8 | 128.3 | 128.0 | 21.3 | 21.2 | 6.0× |
| 16 | 128.3 | 128.0 | 12.7 | 12.7 | 10.1× |

With N agents, sharing reaches about N times deeper for the same money, and every row matches the exact value ([results/simple](../results/simple/summary.md), 1,000 seeds per row). The check once caught a flaw in the random-number generator (now xoshiro128\*\*).

## Configuration

**A scenario** is one complete setup. [config/scenarios/default.yaml](../config/scenarios/default.yaml) holds every setting with its default and a comment; anything else changes only what it names. A misspelled setting, a wrong type or an unknown plugin parameter is an error, never silently ignored.

**An experiment** is a YAML file in [config/experiments/](../config/experiments/). Every combination of its factors' levels is one row; every row uses the same seeds, so rows are compared on the same graphs and agents.

```yaml
id: my-experiment
title: Does a strong screen help OSO?
question: Does a strong validation screen help OSO?
seeds: 100
set:                            # overrides for every row
  rules.visibility: { kind: choice }
factors:
  - name: setting               # named levels, inline (set) or from config/presets.yaml (preset)
    levels:
      - { label: Traditional, preset: traditional }
      - { label: OSO, preset: osoChoice }
  - { name: θ, path: rules.screen, values: [0.5, 0.9] }   # a sweep of one setting
patches:                        # overrides for rows that match
  - { when: { rules.alpha: 1 }, set: { rules.c: 0 } }
columns: [frontier, targetsSolved, roi, knowledge, waste]
```

Experiments made in the app (New page) are written in this form, with canonical names.

**Model versions.** A change that alters what runs produce bumps `MODEL_VERSION` in `src/engine/version.ts` and adds a line to [model-versions.md](model-versions.md). Every saved result records its version.

**Reproducibility.** A run depends only on its scenario and seed. Each part (graph, agents, perception, the run) draws from its own random stream, so changing one part does not reshuffle the others. Saved results record every setting and the commit.

## Plugins

Each registry is a set of named components; `npm run sim -- plugins` lists them with their parameters. Adding one means registering it once, after which any YAML file can use it:

```ts
visibilities.register<{ every: number }>('batched', {
  description: 'Ideas are published in batches every `every` rounds',
  defaults: { every: 5 },
  create: ({ every }) => ({ onProof: (ctx) => ctx.schedule(Math.ceil((ctx.round + 1) / every) * every) }),
});
```

| Registry | Returns |
| --- | --- |
| `worlds` | `(success, rng) => World`; `finishWorld` builds it from levels, parents, chances, bounties and bits |
| `oracles` | `{ succeeds(ctx) }`: whether an attempt works |
| `deciders` | `{ choose(agent, frontier), wouldPublish(agent, idea, choice) }`, using only what the agent knows |
| `visibilities`, `allocations`, `policies` | when ideas are published, how money is split, how a score becomes a choice |
| `COLUMNS` | a measure for result tables |

A Lean-checker oracle and an LLM decider would be two more plugins, once the loop is made asynchronous.

Two more extension points, one entry each:

- **A step of the model** (`STEPS` in `src/viewer/design.ts`): its settings, what it now holds fixed (agents, money, reward, validation), and, if it changes them, the societies it compares. The app's step picker, the experiment text, the question and the name follow from the entry.
- **An analysis** (`analyses` in `src/experiments/experiment.ts`, used with `analysis: <name>`): it returns its table and, optionally, its own answer, chart and note. The result card uses them as given.

## Code and tests

| Path | Contents |
| --- | --- |
| `src/engine/` | The model: `model.ts` (one run), `world.ts`, `difficulty.ts`, `agents.ts`, `deciders.ts`, `rules.ts`, `oracles.ts`, `measures.ts`, `config.ts`, `version.ts`, `rng.ts` |
| `src/experiments/` | `experiment.ts` (rows, runs, outcome measures), `analytic.ts` (the one-chain check) |
| `src/report/` | Preset reports (`battery.ts`, `report.ts`), scaling reports (`ladder.ts`), charts |
| `src/viewer/` | The app: `server.ts` and one page, `index.html` |
| `src/lean/` | The AI-model tests: agents, the Lean checker, the race harness |
| `config/`, `spaces/`, `results/`, `reports/` | Settings and experiments; presets; saved results; preset reports |
| `vendor/oso-ledger/` | A pinned copy of the app's ledger, used by the tests (`npm run sync-ledger`) |

`npm test` checks, among other things: flow-back pays exactly what the real ledger pays; the one-chain check matches its exact values; everything paid out equals the bounties plus the mint and knowledge reward; runs reproduce from a seed; the generator sets structure, difficulty and attribution separately; settings are validated; presets load; and the app's designer produces valid experiments.
