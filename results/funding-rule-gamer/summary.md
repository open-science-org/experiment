# Is the funding-rule effect a gamer effect? Drug discovery

Traditional and OSO (immediate) on the drug-discovery field, as compute follows earnings (ρ) from 0 to 1, with and without the gaming agent. With ρ = 1 under traditional rules, the first agent to earn takes all the compute; the gamer earns first, from trivial results, and then does all the research.

- **Date:** 2026-10-20
- **Code:** commit `45faf29` (with uncommitted changes to the simulator)
- **Experiment:** [config/experiments/funding-rule-gamer.yaml](../../config/experiments/funding-rule-gamer.yaml)
- **Command:** `npm run sim -- funding-rule-gamer --seeds 100 --save`
- **Runs:** 1200 (100 seeds per row), in `runs.jsonl`; the full configuration in `config.json`

Values are mean ± standard deviation over seeds.

| gaming agent | ρ | setting | frontier | targets solved | cost | gamer share of pay |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 0 | Traditional | 0.6 ± 1.8 | 0.1 ± 0.3 | 965 ± 166 | 0.91 |
| 1 | 0 | OSO (immediate) | 6.0 ± 0.0 | 2.9 ± 0.4 | 200 ± 65 | 0.09 |
| 1 | 0.5 | Traditional | 2.7 ± 3.0 | 0.7 ± 0.9 | 847 ± 221 | 0.99 |
| 1 | 0.5 | OSO (immediate) | 6.0 ± 0.1 | 2.8 ± 0.6 | 223 ± 94 | 0.41 |
| 1 | 1 | Traditional | 5.7 ± 1.3 | 2.3 ± 0.9 | 673 ± 240 | 1.00 |
| 1 | 1 | OSO (immediate) | 6.0 ± 0.2 | 2.4 ± 1.0 | 222 ± 112 | 0.62 |
| 0 | 0 | Traditional | 1.0 ± 2.3 | 0.2 ± 0.4 | 1000 ± 187 | – |
| 0 | 0 | OSO (immediate) | 6.0 ± 0.0 | 2.9 ± 0.3 | 199 ± 73 | – |
| 0 | 0.5 | Traditional | 1.0 ± 2.3 | 0.3 ± 0.8 | 1000 ± 187 | – |
| 0 | 0.5 | OSO (immediate) | 6.0 ± 0.0 | 2.8 ± 0.6 | 200 ± 91 | – |
| 0 | 1 | Traditional | 1.0 ± 2.3 | 0.3 ± 0.8 | 1000 ± 187 | – |
| 0 | 1 | OSO (immediate) | 6.0 ± 0.1 | 2.4 ± 1.1 | 186 ± 86 | – |
