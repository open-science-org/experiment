# Learning from failure: own failures vs. shared failures

**Question:** Does making failed attempts public help, and under which rules?

**Answer:** Best on hardest level published: OSO (immediate), learn from own, 8.0 (tied with OSO (immediate), learn from all (public)). Best traditional: Traditional, learn from all (public), 7.6; a clear difference.

| setting | failures | frontier | reach L7 | speed | cost |
| --- | --- | --- | --- | --- | --- |
| Traditional | no learning | 5.7 ± 1.2 | 0.35 | 96 ± 16 | 957 ± 161 |
| Traditional | learn from own | 7.4 ± 0.7 | 0.96 | 87 ± 17 | 865 ± 171 |
| Traditional | learn from all (public) | 7.6 ± 0.6 | 0.98 | 82 ± 17 | 810 ± 171 |
| OSO (immediate) | no learning | 7.9 ± 0.2 | 1.00 | 49 ± 14 | 485 ± 141 |
| OSO (immediate) | learn from own | 8.0 ± 0.0 | 1.00 | 37 ± 10 | 367 ± 96 |
| OSO (immediate) | learn from all (public) | 8.0 ± 0.0 | 1.00 | 29 ± 6 | 284 ± 64 |

**Design** (fixed before the run): compared own failures or shared failures, under each rule setting · held the same: the Lean tree, agents and budget · measure: hardest level published, higher is better · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

With the learning oracle, each failed attempt raises the next chance on that result by 10% of p. With rules.publishFailures, failed attempts are public, so agents also learn from others' failures (sharedWeight = 1). Compared under traditional and OSO (immediate) rules on the default world.

Values are mean ± standard deviation over runs.

| setting | failures | frontier | reach L7 | speed | cost | spend | targets solved | waste | credit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | no learning | 5.7 ± 1.2 | 0.35 | 96 ± 16 | 957 ± 161 | 1194 ± 11 | 4.2 ± 0.9 | 0.64 ± 0.09 | 0.95 ± 0.09 |
| Traditional | learn from own | 7.4 ± 0.7 | 0.96 | 87 ± 17 | 865 ± 171 | 1148 ± 88 | 6.0 ± 0.9 | 0.77 ± 0.08 | 0.97 ± 0.07 |
| Traditional | learn from all (public) | 7.6 ± 0.6 | 0.98 | 82 ± 17 | 810 ± 171 | 1099 ± 114 | 6.4 ± 0.8 | 0.80 ± 0.07 | 0.92 ± 0.12 |
| OSO (immediate) | no learning | 7.9 ± 0.2 | 1.00 | 49 ± 14 | 485 ± 141 | 849 ± 207 | 6.9 ± 0.5 | 0.86 ± 0.03 | 0.57 ± 0.07 |
| OSO (immediate) | learn from own | 8.0 ± 0.0 | 1.00 | 37 ± 10 | 367 ± 96 | 589 ± 150 | 7.0 ± 0.0 | 0.81 ± 0.04 | 0.58 ± 0.11 |
| OSO (immediate) | learn from all (public) | 8.0 ± 0.0 | 1.00 | 29 ± 6 | 284 ± 64 | 412 ± 79 | 7.0 ± 0.0 | 0.82 ± 0.04 | 0.57 ± 0.08 |

Code: commit `023509e` (with uncommitted changes). Experiment: [config/experiments/failures.yaml](../../config/experiments/failures.yaml). Command: `npm run sim -- failures --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
