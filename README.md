# OSO experiment

**For the same money, does research get further when ideas are shared at once and credit flows back to what they built on (OSO), than under traditional rules?**

Two ways to test it, with the same design:
- **Simulation:** made-up idea graphs, simple formula agents, thousands of runs in minutes.
- **AI models:** real models prove Lean theorems, and Lean checks every proof.

Traditional research is one setting of OSO's rules (α = 1, β = 0), so one model covers both. [How it works](docs/README.md) explains it in plain words; the [Equations](docs/equations.md) define it.

## Results so far

Model version 6, October 2026. **These are simulations with guessed settings: they show how the rules play out, not that they work in real fields.** Two settings matter throughout: **α**, the share of incoming reward an idea keeps (1 = nothing flows back to the work it built on), and **β**, the share of ideas published as soon as they are proved. Every result, with its design and charts, is in the app under Runs → Results.

**1. The simulator matches the exact math.** On a single chain of ideas, simulated runs match the exact values at every group size. With 16 agents and the same money, sharing reaches 10× deeper than each agent working alone.

<img src="results/simple/figures/compare.svg" alt="Deepest idea reached by number of agents: shared stays near 128 levels, hidden falls from 128 to 13 as agents go from 1 to 16; dots match the exact dashed lines" width="560">

**2. Sharing is what gets research further.** In the simple model (identical agents, α and β set), a society that publishes every idea at once solves both targets on the default graph, against 0.1 for traditional, and wastes about 31% of its money instead of 72%. With sharing set, α barely matters.

**3. Flow-back makes agents choose to share.** This is OSO's central claim. When agents decide for themselves whether to publish (step 2 of the model), they share more as more reward flows back: 24% of ideas at α = 1, 66% at α = 0.2, all of them at α = 0. The same holds with every mechanism of the full model on (step 5: different kinds of agents, money following earnings, a gamer and validation).

<img src="docs/figures/sharing-by-alpha.svg" alt="Share of ideas published by α: rises from about 25–35% at α = 1 to 100% at α = 0, for step 2 and step 5; traditional publishes none early" width="620">

With the full model's mechanisms, even agents with no flow-back solve nearly both targets, because money follows results. Traditional solves 0.1 to 0.3.

<img src="docs/figures/targets-by-alpha.svg" alt="Targets solved by α: step 2 rises from 0.4 at α = 1 to 2.0 at α = 0.2; step 5 stays near 2.0; traditional (step 2) about 0.1" width="620">

**4. Traditional needs several times the money for the same result** (to solve half the targets): 3.5× to 5.7× across five difficulties. When half the money follows earnings the gap is 2.5× to 5.4×; when all of it does, 1.7× to 4.9×.

<img src="docs/figures/money-gap-by-difficulty.svg" alt="Traditional needs 3.5× (easy), 5.7× (default), 4.9× (medium), 3.9× (hard) and 4.6× (very hard) the money OSO needs" width="560">

**5. The gap grows with depth.** On graphs where every step is equally hard, OSO's money doubles exactly with depth; traditional's grows faster. Traditional needs 7.8× the money at 10 levels and 12.9× at 80, past the 12× expected from 12 agents each repeating the same work. Why it keeps growing is still being checked.

<img src="docs/figures/money-gap-by-depth.svg" alt="Traditional ÷ OSO by depth: 7.8× at 10 levels, 7.9× at 20, 9.3× at 40, 12.9× at 80, crossing the 12× line" width="620">

**6. Where OSO does not win.** On easy graphs and simple chains (one parent per idea), sharing is cheaper but does not get further. Flow-back must not be total: at α = 0 the solver of a target keeps nothing, agents drift into dead ends, and 54% of the money is wasted instead of 31–37%.

**7. Real AI models: too early to tell.** In a head-to-head on Lean theorems, OSO solved 2.0 targets and traditional 1.6 (5 runs each; no clear difference). In a pilot of 5 models, 3 solved targets with shared help that they never solved alone.

The plots are drawn from saved results: `npm run sim -- summary-figures` redraws them after a rerun.

## Run the app

```sh
git clone https://github.com/open-science-org/experiment.git
cd experiment
npm install
npm run viewer        # then open http://127.0.0.1:8791
```

Needs Node 22.18 or later. Simulations need nothing else. AI-model tests also need [Lean](https://lean-lang.org/install/), an `OPENROUTER_API_KEY` in `.env`, and the private reference proofs in `lean/` (ask the maintainers).

- **Runs:** every run (History), every result as a short card with interactive charts (Results), and any run replayed round by round (Live).
- **New:** design a run. Simple model (only α and β vary) or full model (every setting; simulated agents or AI models).
- **How it works:** the design, the equations and the model versions.

## Command line

```sh
npm run sim                              # list the experiments
npm run sim -- <experiment> --save       # run one and save it in results/
npm run sim -- report <preset>           # the full report on one preset
npm run sim -- ladder "<tag>"            # a scaling report from budget sweeps with that tag
npm test                                 # the tests
```

The [code guide](docs/simulator.md) covers configuration, plugins and tests.

## What is where

| Path | Contents |
| --- | --- |
| [docs/](docs/) | [How it works](docs/README.md), [Equations](docs/equations.md), [model versions](docs/model-versions.md), [design](docs/design.md), [code guide](docs/simulator.md) |
| [config/](config/) | The default settings (each one documented) and every experiment |
| [spaces/](spaces/) | Example presets of the idea graph generator, and the Lean problem set |
| [results/](results/), [reports/](reports/) | Saved results, and one full report per preset |
| [src/](src/) | The model (`engine/`), experiments, reports, the AI-model tests (`lean/`) and the app (`viewer/`) |
| [lean/](lean/) | The Lean problem set (definitions and targets; reference proofs are private) |
| [vendor/oso-ledger/](vendor/oso-ledger/) | A pinned copy of the OSO ledger; the tests check the simulator pays exactly what it pays |

## Related

- [OSO](https://github.com/open-science-org/OSO): the protocol.
- [OIPs](https://github.com/open-science-org/OIPs): the improvement proposals, including flow-back (OIP-14).
- [app](https://github.com/open-science-org/app): the OSO v1 app.
