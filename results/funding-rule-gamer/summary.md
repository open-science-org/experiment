# Is the funding-rule effect a gamer effect? Drug discovery

**Question:** Is the funding-rule effect caused by the gaming agent?

**Answer:** Best: gaming agent 1, ρ 0, OSO, 6.0 (5 more tie). Best traditional: gaming agent 1, ρ 1, Traditional, 5.7. Clear difference.

![Is the funding-rule effect a gamer effect? Drug discovery](figures/compare.svg)

| gaming agent | ρ | setting | frontier | targets solved | cost | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 0 | Traditional | 0.6 ± 1.8 | 0.1 ± 0.3 | 965 ± 166 | 0.04 ± 0.12 |
| 1 | 0 | OSO (immediate) | 6.0 ± 0.0 | 2.9 ± 0.4 | 200 ± 65 | 1.90 ± 0.72 |
| 1 | 0.5 | Traditional | 2.7 ± 3.0 | 0.7 ± 0.9 | 847 ± 221 | 0.28 ± 0.39 |
| 1 | 0.5 | OSO (immediate) | 6.0 ± 0.1 | 2.8 ± 0.6 | 223 ± 94 | 1.77 ± 0.68 |
| 1 | 1 | Traditional | 5.7 ± 1.3 | 2.3 ± 0.9 | 673 ± 240 | 1.19 ± 0.73 |
| 1 | 1 | OSO (immediate) | 6.0 ± 0.2 | 2.4 ± 1.0 | 222 ± 112 | 1.54 ± 1.12 |
| 0 | 0 | Traditional | 1.0 ± 2.3 | 0.2 ± 0.4 | 1000 ± 187 | 0.07 ± 0.15 |
| 0 | 0 | OSO (immediate) | 6.0 ± 0.0 | 2.9 ± 0.3 | 199 ± 73 | 1.97 ± 0.71 |
| 0 | 0.5 | Traditional | 1.0 ± 2.3 | 0.3 ± 0.8 | 1000 ± 187 | 0.14 ± 0.38 |
| 0 | 0.5 | OSO (immediate) | 6.0 ± 0.0 | 2.8 ± 0.6 | 200 ± 91 | 2.00 ± 0.91 |
| 0 | 1 | Traditional | 1.0 ± 2.3 | 0.3 ± 0.8 | 1000 ± 187 | 0.14 ± 0.36 |
| 0 | 1 | OSO (immediate) | 6.0 ± 0.1 | 2.4 ± 1.1 | 186 ± 86 | 2.01 ± 1.41 |

**Design** (fixed before the run): compared with or without the gaming agent × ρ × traditional or OSO · held the same: the drug-discovery field and budget · measure: hardest level published, higher is better · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Traditional and OSO (immediate) on the drug-discovery field, as money follows earnings (ρ) from 0 to 1, with and without the gaming agent. With ρ = 1 under traditional rules, the first agent to earn takes all the money; the gamer earns first, from trivial ideas, and then does all the research.

Values are mean ± standard deviation over runs.

| gaming agent | ρ | setting | frontier | targets solved | ROI (value per spend) | cost | gamer share of pay |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 0 | Traditional | 0.6 ± 1.8 | 0.1 ± 0.3 | 0.04 ± 0.12 | 965 ± 166 | 0.91 |
| 1 | 0 | OSO (immediate) | 6.0 ± 0.0 | 2.9 ± 0.4 | 1.90 ± 0.72 | 200 ± 65 | 0.09 |
| 1 | 0.5 | Traditional | 2.7 ± 3.0 | 0.7 ± 0.9 | 0.28 ± 0.39 | 847 ± 221 | 0.99 |
| 1 | 0.5 | OSO (immediate) | 6.0 ± 0.1 | 2.8 ± 0.6 | 1.77 ± 0.68 | 223 ± 94 | 0.41 |
| 1 | 1 | Traditional | 5.7 ± 1.3 | 2.3 ± 0.9 | 1.19 ± 0.73 | 673 ± 240 | 1.00 |
| 1 | 1 | OSO (immediate) | 6.0 ± 0.2 | 2.4 ± 1.0 | 1.54 ± 1.12 | 222 ± 112 | 0.62 |
| 0 | 0 | Traditional | 1.0 ± 2.3 | 0.2 ± 0.4 | 0.07 ± 0.15 | 1000 ± 187 | – |
| 0 | 0 | OSO (immediate) | 6.0 ± 0.0 | 2.9 ± 0.3 | 1.97 ± 0.71 | 199 ± 73 | – |
| 0 | 0.5 | Traditional | 1.0 ± 2.3 | 0.3 ± 0.8 | 0.14 ± 0.38 | 1000 ± 187 | – |
| 0 | 0.5 | OSO (immediate) | 6.0 ± 0.0 | 2.8 ± 0.6 | 2.00 ± 0.91 | 200 ± 91 | – |
| 0 | 1 | Traditional | 1.0 ± 2.3 | 0.3 ± 0.8 | 0.14 ± 0.36 | 1000 ± 187 | – |
| 0 | 1 | OSO (immediate) | 6.0 ± 0.1 | 2.4 ± 1.1 | 2.01 ± 1.41 | 186 ± 86 | – |

Code: commit `ead6740` (with uncommitted changes). Experiment: [config/experiments/funding-rule-gamer.yaml](../../config/experiments/funding-rule-gamer.yaml). Command: `npm run sim -- funding-rule-gamer --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
