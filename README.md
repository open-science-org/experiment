# OSO experiment

**Does open science research beat traditional research for the same money?**

This repository simulates communities of research agents and compares two sets of rules on the same field, agents and budget:
- **traditional:** work is published only when it is finished, and nothing flows back to the work it built on;
- **OSO:** results are published as they are found, and part of the value of each result flows back to what it built on.

Traditional research is a special case of OSO's rules (α = 1, c = 0, finished work only), so one model covers both. The model is defined once in the **[demo experiment specification](docs/design.md)**; this repository implements it.

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
  - sensitivity to each parameter: those communities, funders or the protocol set (they will be market-driven, so the result must hold across them) and those we guessed;
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

## The Lean pilot

The simulator's success chances are guesses. The pilot measures them: a real agent (Claude) attempts every theorem of the [Lean problem set](lean/README.md), and Lean decides.

```sh
npm run pilot -- selftest                       # every reference proof through the checker
npm run pilot -- calibrate --dry-run            # how many attempts and calls a run makes
npm run pilot -- calibrate --stub --attempts 1  # the whole pipeline, with reference proofs as the "agent"
npm run pilot -- calibrate                      # the real run; needs ANTHROPIC_API_KEY
npm run pilot -- world <run>                    # measured chances -> worlds/lean-measured.json + a space
```

- **An attempt** is a first proof plus up to three repairs, each sent back with Lean's error messages.
- **Two conditions:**
  - *library*: every theorem, with the theorems it rests on given as its library;
  - *alone*: each posted target with an empty library. This tests whether the targets really need their lemmas.
- **The checker** ([src/lean/checker.ts](src/lean/checker.ts)) writes a file that imports only the public definitions and states the agent's library as axioms. Each axiom is a theorem the reference proofs prove, so this is sound, and the agent cannot reach any lemma it was not given. `#print axioms` then lists exactly which library theorems a proof used: that is both the soundness check and the attribution. The screen bans `grind`, `sorry`, `native_decide`, search tactics, commands that run code, and new declarations. Each check takes about 0.3 seconds.
- **The self-test passes:** all 42 reference proofs are accepted with `grind` allowed, and for each one the theorems it uses match the reference tree exactly. Nine need `grind`, so with it banned, agents have to find other proofs for those.
- **What gets published:** transcripts contain proofs, so they stay in `lean/runs/`, which is private. The public summary in `results/pilot/<run>/` uses only anonymous ids.
- **The model:** Claude Opus 5.5 at effort `high`, through whichever key is in `.env`, which Git ignores. With `ANTHROPIC_API_KEY`, it calls Anthropic directly (adaptive thinking, with server-side fallbacks on). With `OPENROUTER_API_KEY`, it goes through OpenRouter, which also serves GPT, Gemini and open models (`--model`); OpenRouter reports each call's cost, so the summary gives dollars.

## Experiments: designed, then summarized the same way

Every experiment, of any kind, declares before it runs: the **question**, what is **compared**, what is **held the same**, the one **main measure** and which way is better, and how many **runs**. Its result is a short **card**: the question, the **answer** computed from that measure (best row against the best traditional row, judged against two standard errors), a small table, the design in one line, and at most three caveats; everything else is folded away under *Details*. Measures looked at after a run are labelled *exploratory*.

[results/README.md](results/README.md) lists every experiment with its question and answer, newest first. It is rebuilt whenever a result is saved.

## The app

```sh
npm run viewer        # then open http://127.0.0.1:8791
```

Four pages:

- **Results:** every experiment as a short card (question, answer). Click one for its details.
- **New:** one form. Pick who does the work: **simulated agents** (chance decides each attempt; free, thousands of runs) or **AI models** (Lean checks each proof; costs money, a few runs). Then the question, what to compare, and the runs. Everything else is under *More options*.
- **Live:** tests with AI models as they run, simulation replays, and every attempt by the AI models.
- **Topics:** the research topics, their reports, and adding a new one.

The app runs on this machine only, and never shows `lean/` (the private answers) or `.env`.

## Layout

| Path | Contents |
| --- | --- |
| [spaces/](spaces/) | Problem spaces, one YAML file each |
| [reports/](reports/) | One canonical report per space, and the index |
| [config/](config/) | The default scenario (every setting, documented), the rule presets, and the experiments |
| [results/](results/) | Saved experiment runs and their log |
| [src/](src/) | `engine/` (the environment), `experiments/`, `spaces/`, `report/`, and the command line |
| [docs/](docs/) | [How it works](docs/README.md), the [full design](docs/design.md) and the [simulator in detail](docs/simulator.md) |
| [worlds/](worlds/) | Data for worlds read from files, such as the Lean reference tree |
| [vendor/oso-ledger/](vendor/oso-ledger/) | A pinned copy of the [app](https://github.com/open-science-org/app)'s ledger. The tests check that the simulator's waterfall pays exactly what the real ledger pays; `npm run sync-ledger` refreshes it |
| [lean/](lean/) | The Lean problem set (public part) |
| [src/viewer/](src/viewer/) | The viewer: a local server and one page |
| [test/](test/) | Tests |

The Lean problem set is in `lean/`: its definitions and targets are public, and its reference proofs are private.

## Related

- [OSO](https://github.com/open-science-org/OSO): the protocol. The experiment's design now lives here, in [docs/design.md](docs/design.md).
- [OIPs](https://github.com/open-science-org/OIPs): the improvement proposals that define the rules, including the waterfall (OIP-14).
- [app](https://github.com/open-science-org/app): the OSO v1 app: ledger, API and front end.
