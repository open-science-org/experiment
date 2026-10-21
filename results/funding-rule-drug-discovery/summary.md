# Does the funding rule decide the race? Drug discovery

**Question:** Does the funding rule decide the race in drug discovery?

**Answer:** Best: OSO, ρ 0, 6.0 (3 more tie). Best traditional: Traditional, ρ 1, 5.7. Clear difference.

![Does the funding rule decide the race? Drug discovery](figures/compare.svg)

| setting | ρ, compute follows earnings | frontier | targets solved | cost | gamer share of pay |
| --- | --- | --- | --- | --- | --- |
| Traditional | 0 | 0.6 ± 1.8 | 0.1 ± 0.3 | 965 ± 166 | 0.91 |
| Traditional | 0.5 | 2.7 ± 3.0 | 0.7 ± 0.9 | 847 ± 221 | 0.99 |
| Traditional | 1 | 5.7 ± 1.3 | 2.3 ± 0.9 | 673 ± 240 | 1.00 |
| OSO (immediate) | 0 | 6.0 ± 0.0 | 2.9 ± 0.4 | 200 ± 65 | 0.09 |
| OSO (immediate) | 0.5 | 6.0 ± 0.1 | 2.8 ± 0.6 | 223 ± 94 | 0.41 |
| OSO (immediate) | 1 | 6.0 ± 0.2 | 2.4 ± 1.0 | 222 ± 112 | 0.62 |
| OSO (choice) | 0 | 5.0 ± 0.9 | 0.4 ± 0.8 | 832 ± 241 | 0.53 |
| OSO (choice) | 0.5 | 5.4 ± 0.9 | 1.0 ± 1.1 | 756 ± 253 | 0.93 |
| OSO (choice) | 1 | 6.0 ± 0.3 | 2.5 ± 0.9 | 481 ± 226 | 0.70 |

**Design** (fixed before the run): compared how far compute follows earnings (ρ), under three rule settings · held the same: the drug-discovery field, agents and budget · measure: hardest level published, higher is better · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Designed in the app on the field "Early-stage drug discovery" (spaces/drug-discovery.yaml): Traditional vs OSO (immediate) vs OSO (choice), varying ρ, compute follows earnings. A varied parameter overrides the rule setting's own value.

Values are mean ± standard deviation over runs.

| setting | ρ, compute follows earnings | frontier | targets solved | cost | gamer share of pay | sharing |
| --- | --- | --- | --- | --- | --- | --- |
| Traditional | 0 | 0.6 ± 1.8 | 0.1 ± 0.3 | 965 ± 166 | 0.91 | 0.00 ± 0.00 |
| Traditional | 0.5 | 2.7 ± 3.0 | 0.7 ± 0.9 | 847 ± 221 | 0.99 | 0.00 ± 0.00 |
| Traditional | 1 | 5.7 ± 1.3 | 2.3 ± 0.9 | 673 ± 240 | 1.00 | 0.00 ± 0.01 |
| OSO (immediate) | 0 | 6.0 ± 0.0 | 2.9 ± 0.4 | 200 ± 65 | 0.09 | 1.00 ± 0.00 |
| OSO (immediate) | 0.5 | 6.0 ± 0.1 | 2.8 ± 0.6 | 223 ± 94 | 0.41 | 1.00 ± 0.00 |
| OSO (immediate) | 1 | 6.0 ± 0.2 | 2.4 ± 1.0 | 222 ± 112 | 0.62 | 1.00 ± 0.00 |
| OSO (choice) | 0 | 5.0 ± 0.9 | 0.4 ± 0.8 | 832 ± 241 | 0.53 | 0.42 ± 0.13 |
| OSO (choice) | 0.5 | 5.4 ± 0.9 | 1.0 ± 1.1 | 756 ± 253 | 0.93 | 0.41 ± 0.12 |
| OSO (choice) | 1 | 6.0 ± 0.3 | 2.5 ± 0.9 | 481 ± 226 | 0.70 | 0.41 ± 0.12 |

Code: commit `7434f7c` (with uncommitted changes). Experiment: [config/experiments/funding-rule-drug-discovery.yaml](../../config/experiments/funding-rule-drug-discovery.yaml). Command: `npm run sim -- funding-rule-drug-discovery --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
