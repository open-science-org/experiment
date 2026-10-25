# Simple model on An abstract research field: α × β

**Question:** On An abstract research field, how far does a society get for the same money, by α and β?

**Answer:** Best: α = 1, β = 0.25, 6.0 (15 more tie). Best traditional: Traditional (α = 1, β = 0), 0.2. Clear difference.

![Simple model on An abstract research field: α × β](figures/compare.svg)

| society | frontier | value gained | sharing | ROI (value per spend) |
| --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 0.2 ± 1.2 | 8 ± 40 | 0.00 ± 0.00 | 0.01 ± 0.04 |
| α = 1, β = 0.25 | 6.0 ± 0.0 | 243 ± 39 | 0.26 ± 0.07 | 0.30 ± 0.11 |
| α = 1, β = 0.5 | 6.0 ± 0.0 | 256 ± 0 | 0.54 ± 0.08 | 0.43 ± 0.16 |
| α = 1, β = 0.75 | 6.0 ± 0.0 | 253 ± 18 | 0.77 ± 0.07 | 0.53 ± 0.17 |
| α = 1, β = 1 | 6.0 ± 0.0 | 256 ± 0 | 1.00 ± 0.00 | 0.65 ± 0.24 |
| α = 0.8, β = 0 | 0.4 ± 1.4 | 8 ± 31 | 0.00 ± 0.00 | 0.01 ± 0.03 |
| α = 0.8, β = 0.25 | 6.0 ± 0.1 | 225 ± 61 | 0.26 ± 0.07 | 0.26 ± 0.11 |
| α = 0.8, β = 0.5 | 6.0 ± 0.0 | 253 ± 18 | 0.53 ± 0.08 | 0.42 ± 0.11 |
| α = 0.8, β = 0.75 | 6.0 ± 0.0 | 256 ± 0 | 0.77 ± 0.07 | 0.51 ± 0.17 |
| OSO (α = 0.8, β = 1) | 6.0 ± 0.0 | 256 ± 0 | 1.00 ± 0.00 | 0.65 ± 0.22 |
| α = 0.5, β = 0 | 0.2 ± 1.2 | 5 ± 25 | 0.00 ± 0.00 | 0.00 ± 0.02 |
| α = 0.5, β = 0.25 | 6.0 ± 0.0 | 230 ± 52 | 0.28 ± 0.08 | 0.27 ± 0.10 |
| α = 0.5, β = 0.5 | 6.0 ± 0.0 | 256 ± 0 | 0.53 ± 0.07 | 0.44 ± 0.15 |
| α = 0.5, β = 0.75 | 6.0 ± 0.0 | 256 ± 0 | 0.79 ± 0.06 | 0.60 ± 0.20 |
| OSO (α = 0.5, β = 1) | 6.0 ± 0.0 | 256 ± 0 | 1.00 ± 0.00 | 0.74 ± 0.27 |
| α = 0.2, β = 0 | 0.4 ± 1.4 | 8 ± 31 | 0.00 ± 0.00 | 0.01 ± 0.03 |
| α = 0.2, β = 0.25 | 6.0 ± 0.2 | 218 ± 70 | 0.26 ± 0.07 | 0.26 ± 0.12 |
| α = 0.2, β = 0.5 | 6.0 ± 0.0 | 248 ± 31 | 0.53 ± 0.09 | 0.43 ± 0.15 |
| α = 0.2, β = 0.75 | 6.0 ± 0.0 | 253 ± 18 | 0.78 ± 0.07 | 0.58 ± 0.26 |
| OSO (α = 0.2, β = 1) | 6.0 ± 0.0 | 256 ± 0 | 1.00 ± 0.00 | 0.68 ± 0.23 |

**Design** (fixed before the run): compared α in {1, 0.8, 0.5, 0.2} × β in {0, 0.25, 0.5, 0.75, 1} · held the same: the field "An abstract research field", 12 identical agents, equal money each round, no mint, no validation · measure: hardest level published, higher is better · 50 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

The simple model on the field "An abstract research field" (spaces/abstract-field.yaml): only α and β vary. Held fixed: 12 identical agents, equal money every round (ρ = 0), no mint (m = 0), no validation (θ = 0), the field's idea graph and bounties.

Values are mean ± standard deviation over runs.

| society | frontier | value gained | ROI (value per spend) | sharing | targets solved | cost |
| --- | --- | --- | --- | --- | --- | --- |
| Traditional (α = 1, β = 0) | 0.2 ± 1.2 | 8 ± 40 | 0.01 ± 0.04 | 0.00 ± 0.00 | 0.1 ± 0.3 | – |
| α = 1, β = 0.25 | 6.0 ± 0.0 | 243 ± 39 | 0.30 ± 0.11 | 0.26 ± 0.07 | 1.9 ± 0.3 | – |
| α = 1, β = 0.5 | 6.0 ± 0.0 | 256 ± 0 | 0.43 ± 0.16 | 0.54 ± 0.08 | 2.0 ± 0.0 | – |
| α = 1, β = 0.75 | 6.0 ± 0.0 | 253 ± 18 | 0.53 ± 0.17 | 0.77 ± 0.07 | 2.0 ± 0.1 | – |
| α = 1, β = 1 | 6.0 ± 0.0 | 256 ± 0 | 0.65 ± 0.24 | 1.00 ± 0.00 | 2.0 ± 0.0 | – |
| α = 0.8, β = 0 | 0.4 ± 1.4 | 8 ± 31 | 0.01 ± 0.03 | 0.00 ± 0.00 | 0.1 ± 0.2 | – |
| α = 0.8, β = 0.25 | 6.0 ± 0.1 | 225 ± 61 | 0.26 ± 0.11 | 0.26 ± 0.07 | 1.8 ± 0.5 | – |
| α = 0.8, β = 0.5 | 6.0 ± 0.0 | 253 ± 18 | 0.42 ± 0.11 | 0.53 ± 0.08 | 2.0 ± 0.1 | – |
| α = 0.8, β = 0.75 | 6.0 ± 0.0 | 256 ± 0 | 0.51 ± 0.17 | 0.77 ± 0.07 | 2.0 ± 0.0 | – |
| OSO (α = 0.8, β = 1) | 6.0 ± 0.0 | 256 ± 0 | 0.65 ± 0.22 | 1.00 ± 0.00 | 2.0 ± 0.0 | – |
| α = 0.5, β = 0 | 0.2 ± 1.2 | 5 ± 25 | 0.00 ± 0.02 | 0.00 ± 0.00 | 0.0 ± 0.2 | – |
| α = 0.5, β = 0.25 | 6.0 ± 0.0 | 230 ± 52 | 0.27 ± 0.10 | 0.28 ± 0.08 | 1.8 ± 0.4 | – |
| α = 0.5, β = 0.5 | 6.0 ± 0.0 | 256 ± 0 | 0.44 ± 0.15 | 0.53 ± 0.07 | 2.0 ± 0.0 | – |
| α = 0.5, β = 0.75 | 6.0 ± 0.0 | 256 ± 0 | 0.60 ± 0.20 | 0.79 ± 0.06 | 2.0 ± 0.0 | – |
| OSO (α = 0.5, β = 1) | 6.0 ± 0.0 | 256 ± 0 | 0.74 ± 0.27 | 1.00 ± 0.00 | 2.0 ± 0.0 | – |
| α = 0.2, β = 0 | 0.4 ± 1.4 | 8 ± 31 | 0.01 ± 0.03 | 0.00 ± 0.00 | 0.1 ± 0.2 | – |
| α = 0.2, β = 0.25 | 6.0 ± 0.2 | 218 ± 70 | 0.26 ± 0.12 | 0.26 ± 0.07 | 1.7 ± 0.5 | – |
| α = 0.2, β = 0.5 | 6.0 ± 0.0 | 248 ± 31 | 0.43 ± 0.15 | 0.53 ± 0.09 | 1.9 ± 0.2 | – |
| α = 0.2, β = 0.75 | 6.0 ± 0.0 | 253 ± 18 | 0.58 ± 0.26 | 0.78 ± 0.07 | 2.0 ± 0.1 | – |
| OSO (α = 0.2, β = 1) | 6.0 ± 0.0 | 256 ± 0 | 0.68 ± 0.23 | 1.00 ± 0.00 | 2.0 ± 0.0 | – |

Code: commit `94d7303` (with uncommitted changes). Experiment: [config/experiments/simple-20261023190525.yaml](../../config/experiments/simple-20261023190525.yaml). Command: `npm run sim -- simple-20261023190525 --seeds 50 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
