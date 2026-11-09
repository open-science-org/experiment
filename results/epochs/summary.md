# Turns of the feedback loop (epochs), on the default field

**Question:** Does OSO's lead grow with more turns of the feedback loop?

**Answer:** Best: OSO, α 0.8, f = 0.5, every round (120), 0.6 (11 more tie). Best traditional: Traditional, equal (f = 0), 0.0. Clear difference.

![Turns of the feedback loop (epochs), on the default field](figures/compare.svg)

| setting | money | targets solved | frontier | reach L7 | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- |
| Traditional | equal (f = 0) | 0.0 ± 0.0 | 0.0 ± 0.0 | 0.00 | 0.00 ± 0.00 |
| Traditional | f = 0.5, 1 epoch | 0.0 ± 0.0 | 0.0 ± 0.0 | 0.00 | 0.00 ± 0.00 |
| Traditional | f = 0.5, 5 epochs | 0.0 ± 0.0 | 0.0 ± 0.0 | 0.00 | 0.00 ± 0.00 |
| Traditional | f = 0.5, 20 epochs | 0.0 ± 0.0 | 0.0 ± 0.0 | 0.00 | 0.00 ± 0.00 |
| Traditional | f = 0.5, every round (120) | 0.0 ± 0.0 | 0.0 ± 0.0 | 0.00 | 0.00 ± 0.00 |
| Shared library | equal (f = 0) | 0.5 ± 0.7 | 5.3 ± 0.7 | 0.00 | 0.26 ± 0.40 |
| Shared library | f = 0.5, 1 epoch | 0.5 ± 0.7 | 5.3 ± 0.7 | 0.00 | 0.26 ± 0.40 |
| Shared library | f = 0.5, 5 epochs | 0.5 ± 0.7 | 5.3 ± 0.7 | 0.00 | 0.25 ± 0.40 |
| Shared library | f = 0.5, 20 epochs | 0.5 ± 0.6 | 5.4 ± 0.7 | 0.00 | 0.27 ± 0.37 |
| Shared library | f = 0.5, every round (120) | 0.6 ± 0.7 | 5.4 ± 0.8 | 0.00 | 0.32 ± 0.44 |
| OSO, α 0.8 | equal (f = 0) | 0.6 ± 0.7 | 5.5 ± 0.7 | 0.00 | 0.33 ± 0.40 |
| OSO, α 0.8 | f = 0.5, 1 epoch | 0.6 ± 0.7 | 5.5 ± 0.7 | 0.00 | 0.33 ± 0.40 |
| OSO, α 0.8 | f = 0.5, 5 epochs | 0.5 ± 0.7 | 5.4 ± 0.7 | 0.00 | 0.28 ± 0.39 |
| OSO, α 0.8 | f = 0.5, 20 epochs | 0.6 ± 0.7 | 5.5 ± 0.7 | 0.00 | 0.38 ± 0.57 |
| OSO, α 0.8 | f = 0.5, every round (120) | 0.6 ± 0.7 | 5.5 ± 0.6 | 0.00 | 0.35 ± 0.43 |
| OSO, α 0.2 | equal (f = 0) | 0.6 ± 0.7 | 5.4 ± 0.6 | 0.00 | 0.32 ± 0.42 |
| OSO, α 0.2 | f = 0.5, 1 epoch | 0.6 ± 0.7 | 5.4 ± 0.6 | 0.00 | 0.32 ± 0.42 |
| OSO, α 0.2 | f = 0.5, 5 epochs | 0.6 ± 0.7 | 5.5 ± 0.6 | 0.00 | 0.30 ± 0.38 |
| OSO, α 0.2 | f = 0.5, 20 epochs | 0.6 ± 0.7 | 5.5 ± 0.6 | 0.00 | 0.31 ± 0.42 |
| OSO, α 0.2 | f = 0.5, every round (120) | 0.5 ± 0.7 | 5.5 ± 0.6 | 0.00 | 0.30 ± 0.40 |
| Agents choose, α 1 | equal (f = 0) | 0.0 ± 0.0 | 1.8 ± 1.2 | 0.00 | 0.00 ± 0.00 |
| Agents choose, α 1 | f = 0.5, 1 epoch | 0.0 ± 0.0 | 1.8 ± 1.2 | 0.00 | 0.00 ± 0.00 |
| Agents choose, α 1 | f = 0.5, 5 epochs | 0.0 ± 0.3 | 2.2 ± 1.5 | 0.00 | 0.03 ± 0.19 |
| Agents choose, α 1 | f = 0.5, 20 epochs | 0.0 ± 0.1 | 2.4 ± 1.7 | 0.00 | 0.01 ± 0.07 |
| Agents choose, α 1 | f = 0.5, every round (120) | 0.0 ± 0.2 | 2.6 ± 1.7 | 0.00 | 0.02 ± 0.14 |
| Agents choose, α 0.2 | equal (f = 0) | 0.1 ± 0.3 | 4.2 ± 1.1 | 0.00 | 0.06 ± 0.17 |
| Agents choose, α 0.2 | f = 0.5, 1 epoch | 0.1 ± 0.3 | 4.2 ± 1.1 | 0.00 | 0.06 ± 0.17 |
| Agents choose, α 0.2 | f = 0.5, 5 epochs | 0.1 ± 0.3 | 4.2 ± 1.1 | 0.00 | 0.04 ± 0.17 |
| Agents choose, α 0.2 | f = 0.5, 20 epochs | 0.1 ± 0.4 | 4.5 ± 1.1 | 0.00 | 0.08 ± 0.24 |
| Agents choose, α 0.2 | f = 0.5, every round (120) | 0.2 ± 0.4 | 4.5 ± 1.2 | 0.00 | 0.08 ± 0.21 |

**Design** (fixed before the run): compared traditional, shared library, OSO α 0.8 and α 0.2 (rules decide sharing), and agents choosing at α 1 and α 0.2, by how often money follows earnings · held the same: the default field, 12 agents, the total money and 120 rounds · measure: targets solved, higher is better · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Money follows earnings (half of each round's money by recent earnings) and the shares are reset E times in the run's 120 rounds: once (the loop never turns), 5 times, 20 times, or every round. Equal money (f = 0) is the control. Total money 250 (the default 1200 leaves every sharing setup at the ceiling). Same field, agents and total money in every row; each seed gives the same field and agents.

Values are mean ± standard deviation over runs.

| setting | money | frontier | targets solved | reach L7 | money to half the targets | sharing | waste | duplicates | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | equal (f = 0) | 0.0 ± 0.0 | 0.0 ± 0.0 | 0.00 | – | 0.00 ± 0.00 | 0.45 ± 0.07 | 0.0 ± 0.0 | 0.00 ± 0.00 |
| Traditional | f = 0.5, 1 epoch | 0.0 ± 0.0 | 0.0 ± 0.0 | 0.00 | – | 0.00 ± 0.00 | 0.45 ± 0.07 | 0.0 ± 0.0 | 0.00 ± 0.00 |
| Traditional | f = 0.5, 5 epochs | 0.0 ± 0.0 | 0.0 ± 0.0 | 0.00 | – | 0.00 ± 0.00 | 0.45 ± 0.07 | 0.0 ± 0.0 | 0.00 ± 0.00 |
| Traditional | f = 0.5, 20 epochs | 0.0 ± 0.0 | 0.0 ± 0.0 | 0.00 | – | 0.00 ± 0.00 | 0.45 ± 0.07 | 0.0 ± 0.0 | 0.00 ± 0.00 |
| Traditional | f = 0.5, every round (120) | 0.0 ± 0.0 | 0.0 ± 0.0 | 0.00 | – | 0.00 ± 0.00 | 0.45 ± 0.07 | 0.0 ± 0.0 | 0.00 ± 0.00 |
| Shared library | equal (f = 0) | 5.3 ± 0.7 | 0.5 ± 0.7 | 0.00 | 197 ± 40 | 1.00 ± 0.00 | 0.31 ± 0.06 | 0.6 ± 0.8 | 0.26 ± 0.40 |
| Shared library | f = 0.5, 1 epoch | 5.3 ± 0.7 | 0.5 ± 0.7 | 0.00 | 197 ± 40 | 1.00 ± 0.00 | 0.31 ± 0.06 | 0.6 ± 0.8 | 0.26 ± 0.40 |
| Shared library | f = 0.5, 5 epochs | 5.3 ± 0.7 | 0.5 ± 0.7 | 0.00 | 188 ± 36 | 1.00 ± 0.00 | 0.31 ± 0.05 | 0.4 ± 0.7 | 0.25 ± 0.40 |
| Shared library | f = 0.5, 20 epochs | 5.4 ± 0.7 | 0.5 ± 0.6 | 0.00 | 186 ± 33 | 1.00 ± 0.00 | 0.32 ± 0.07 | 0.4 ± 0.6 | 0.27 ± 0.37 |
| Shared library | f = 0.5, every round (120) | 5.4 ± 0.8 | 0.6 ± 0.7 | 0.00 | 185 ± 46 | 1.00 ± 0.00 | 0.31 ± 0.07 | 0.3 ± 0.7 | 0.32 ± 0.44 |
| OSO, α 0.8 | equal (f = 0) | 5.5 ± 0.7 | 0.6 ± 0.7 | 0.00 | 199 ± 41 | 1.00 ± 0.00 | 0.31 ± 0.06 | 0.5 ± 0.8 | 0.33 ± 0.40 |
| OSO, α 0.8 | f = 0.5, 1 epoch | 5.5 ± 0.7 | 0.6 ± 0.7 | 0.00 | 199 ± 41 | 1.00 ± 0.00 | 0.31 ± 0.06 | 0.5 ± 0.8 | 0.33 ± 0.40 |
| OSO, α 0.8 | f = 0.5, 5 epochs | 5.4 ± 0.7 | 0.5 ± 0.7 | 0.00 | 194 ± 44 | 1.00 ± 0.00 | 0.31 ± 0.07 | 0.4 ± 0.6 | 0.28 ± 0.39 |
| OSO, α 0.8 | f = 0.5, 20 epochs | 5.5 ± 0.7 | 0.6 ± 0.7 | 0.00 | 180 ± 49 | 1.00 ± 0.00 | 0.31 ± 0.07 | 0.3 ± 0.6 | 0.38 ± 0.57 |
| OSO, α 0.8 | f = 0.5, every round (120) | 5.5 ± 0.6 | 0.6 ± 0.7 | 0.00 | 183 ± 42 | 1.00 ± 0.00 | 0.31 ± 0.07 | 0.4 ± 0.6 | 0.35 ± 0.43 |
| OSO, α 0.2 | equal (f = 0) | 5.4 ± 0.6 | 0.6 ± 0.7 | 0.00 | 182 ± 47 | 1.00 ± 0.00 | 0.33 ± 0.06 | 0.7 ± 1.0 | 0.32 ± 0.42 |
| OSO, α 0.2 | f = 0.5, 1 epoch | 5.4 ± 0.6 | 0.6 ± 0.7 | 0.00 | 182 ± 47 | 1.00 ± 0.00 | 0.33 ± 0.06 | 0.7 ± 1.0 | 0.32 ± 0.42 |
| OSO, α 0.2 | f = 0.5, 5 epochs | 5.5 ± 0.6 | 0.6 ± 0.7 | 0.00 | 187 ± 35 | 1.00 ± 0.00 | 0.32 ± 0.07 | 0.4 ± 0.6 | 0.30 ± 0.38 |
| OSO, α 0.2 | f = 0.5, 20 epochs | 5.5 ± 0.6 | 0.6 ± 0.7 | 0.00 | 177 ± 39 | 1.00 ± 0.00 | 0.32 ± 0.07 | 0.3 ± 0.5 | 0.31 ± 0.42 |
| OSO, α 0.2 | f = 0.5, every round (120) | 5.5 ± 0.6 | 0.5 ± 0.7 | 0.00 | 180 ± 40 | 1.00 ± 0.00 | 0.33 ± 0.07 | 0.3 ± 0.5 | 0.30 ± 0.40 |
| Agents choose, α 1 | equal (f = 0) | 1.8 ± 1.2 | 0.0 ± 0.0 | 0.00 | – | 0.15 ± 0.10 | 0.46 ± 0.08 | 0.0 ± 0.1 | 0.00 ± 0.00 |
| Agents choose, α 1 | f = 0.5, 1 epoch | 1.8 ± 1.2 | 0.0 ± 0.0 | 0.00 | – | 0.15 ± 0.10 | 0.46 ± 0.08 | 0.0 ± 0.1 | 0.00 ± 0.00 |
| Agents choose, α 1 | f = 0.5, 5 epochs | 2.2 ± 1.5 | 0.0 ± 0.3 | 0.00 | 171 ± 8 | 0.15 ± 0.11 | 0.44 ± 0.08 | 0.0 ± 0.1 | 0.03 ± 0.19 |
| Agents choose, α 1 | f = 0.5, 20 epochs | 2.4 ± 1.7 | 0.0 ± 0.1 | 0.00 | 165 ± 50 | 0.17 ± 0.11 | 0.44 ± 0.09 | 0.0 ± 0.1 | 0.01 ± 0.07 |
| Agents choose, α 1 | f = 0.5, every round (120) | 2.6 ± 1.7 | 0.0 ± 0.2 | 0.00 | 169 ± 27 | 0.17 ± 0.11 | 0.43 ± 0.08 | 0.0 ± 0.2 | 0.02 ± 0.14 |
| Agents choose, α 0.2 | equal (f = 0) | 4.2 ± 1.1 | 0.1 ± 0.3 | 0.00 | 193 ± 61 | 0.59 ± 0.09 | 0.46 ± 0.07 | 0.1 ± 0.3 | 0.06 ± 0.17 |
| Agents choose, α 0.2 | f = 0.5, 1 epoch | 4.2 ± 1.1 | 0.1 ± 0.3 | 0.00 | 193 ± 61 | 0.59 ± 0.09 | 0.46 ± 0.07 | 0.1 ± 0.3 | 0.06 ± 0.17 |
| Agents choose, α 0.2 | f = 0.5, 5 epochs | 4.2 ± 1.1 | 0.1 ± 0.3 | 0.00 | 183 ± 46 | 0.59 ± 0.10 | 0.44 ± 0.08 | 0.2 ± 0.4 | 0.04 ± 0.17 |
| Agents choose, α 0.2 | f = 0.5, 20 epochs | 4.5 ± 1.1 | 0.1 ± 0.4 | 0.00 | 192 ± 27 | 0.59 ± 0.10 | 0.44 ± 0.07 | 0.1 ± 0.4 | 0.08 ± 0.24 |
| Agents choose, α 0.2 | f = 0.5, every round (120) | 4.5 ± 1.2 | 0.2 ± 0.4 | 0.00 | 200 ± 46 | 0.60 ± 0.10 | 0.44 ± 0.07 | 0.2 ± 0.4 | 0.08 ± 0.21 |

Code: commit `a14577c`. Experiment: [config/experiments/epochs.yaml](../../config/experiments/epochs.yaml). Command: `npm run sim -- epochs --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
