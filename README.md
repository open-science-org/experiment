# OSO experiment

**For the same money, does research get further when ideas are shared at once and credit flows back to what they built on (OSO), than under traditional rules?**

Two ways to test it, with the same design:
- **Simulation:** made-up idea graphs, simple formula agents, thousands of runs in minutes.
- **AI models:** real models prove Lean theorems, and Lean checks every proof.

Traditional research is one setting of OSO's rules (α = 1, β = 0), so one model covers both. [How it works](docs/README.md) explains it in plain words; the [Equations](docs/equations.md) define it.

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
