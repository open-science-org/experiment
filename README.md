# OSO experiment

**Does open science research beat traditional research for the same money?**

This repository simulates communities of research agents and compares two sets of rules on the same field, agents and budget:
- **traditional:** work is published only when it is finished, and nothing flows back to the work it built on;
- **OSO:** results are published as they are found, and part of the value of each result flows back to what it built on.

Traditional research is a special case of OSO's rules (α = 1, c = 0, finished work only), so one model covers both. The model is defined once in the **[demo experiment specification](https://github.com/open-science-org/OSO/blob/master/docs/demo-model.md)**; this repository implements it.

## Results

Every field gets the same canonical report. The [reports index](reports/README.md) lists them all; for example, [early-stage drug discovery](reports/drug-discovery/report.md).

These are simulations with guessed parameters. They show how the incentive rules play out if a field works as described, not that it does. Each report says what it does and does not show.

## Try a field of your own

Requires Node.js 22.18 or later (it runs TypeScript directly, with no build step).

```sh
npm install
npm run sim -- spaces                                # the problem spaces so far
npm run sim -- new "protein design: from folds to binders to enzymes" --report
npm run sim -- report drug-discovery                 # the canonical report for one space
npm run sim -- report all                            # every space, plus the index
npm run sim -- check my-space.yaml                   # validate a hand-written space
```

- **A problem space** ([spaces/](spaces/)) is one YAML file: a title, a plain-language description, a glossary (what a result, a target and an attempt mean in this field), and the scenario settings that differ from the defaults. Copy [drug-discovery.yaml](spaces/drug-discovery.yaml) to write one by hand; a small field with a known structure can list its results one by one, like [solid-state-battery.yaml](spaces/solid-state-battery.yaml).
- **`new`** asks Claude (`claude-opus-5-5`) to write the space from your description. The file is validated and test-run, and any errors go back to the model to fix, up to three times. It needs `ANTHROPIC_API_KEY`. If the model declines, the API retries on a fallback model (server-side fallbacks, on by default).
- **The budget is calibrated** for every space that does not set one: it is the smallest budget at which the OSO community solves about 90% of the targets. Every field is then hard but not hopeless, and the question is what the same money buys traditional research.
- **`report`** runs the same experiments on every space ([battery.ts](src/report/battery.ts)) and writes `reports/<id>/report.md` with the same sections, always:
  - a headline verdict;
  - the field and a drawing of its research tree;
  - progress for the money;
  - the six rule settings;
  - whether flow-back makes agents share;
  - robustness when sharing is costly or sometimes wrong;
  - what it shows and does not;
  - how to reproduce.

  Figures are in `figures/` and every number is in `data.json`.

## Experiments

Beyond the canonical reports, any question can be an experiment: a YAML file of factors whose combinations become the rows of a table.

```sh
npm run sim                                     # list the experiments
npm run sim -- settings                         # run one, print its table
npm run sim -- settings --set rules.screen=0.9  # change any setting for every row
npm run sim -- all --save                       # run all and log results in results/
npm run sim -- plugins                          # list worlds, rules, policies, columns
npm test                                        # the tests
```

The [simulator doc](docs/simulator.md) explains everything in detail: the simple model and its exact check, the default setup, configuration and plugins, the measures, the saved results, and the limits. Saved results are listed in [results/LOG.md](results/LOG.md).

## Layout

| Path | Contents |
| --- | --- |
| [spaces/](spaces/) | Problem spaces, one YAML file each |
| [reports/](reports/) | One canonical report per space, and the index |
| [config/](config/) | The default scenario (every setting, documented), the rule presets, and the experiments |
| [results/](results/) | Saved experiment runs and their log |
| [src/](src/) | `engine/` (the environment), `experiments/`, `spaces/`, `report/`, and the command line |
| [docs/](docs/) | The simulator in detail |
| [worlds/](worlds/) | Data for worlds read from files, such as the Lean reference tree |
| [vendor/oso-ledger/](vendor/oso-ledger/) | A pinned copy of the [app](https://github.com/open-science-org/app)'s ledger. The tests check that the simulator's waterfall pays exactly what the real ledger pays; `npm run sync-ledger` refreshes it |
| [test/](test/) | Tests |

The Lean problem set, where agents will prove real theorems, is being prepared in `lean/` and is not yet published.

## Related

- [OSO](https://github.com/open-science-org/OSO): the protocol and the [demo experiment specification](https://github.com/open-science-org/OSO/blob/master/docs/demo-model.md).
- [OIPs](https://github.com/open-science-org/OIPs): the improvement proposals that define the rules, including the waterfall (OIP-14).
- [app](https://github.com/open-science-org/app): the OSO v1 app: ledger, API and front end.
