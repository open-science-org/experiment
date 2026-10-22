# How much the kinds of agents matter

**Question:** Does the mix of agent kinds change who wins, traditional or OSO?

**Answer:** Best: all plain, OSO, 8.0 (5 more tie). Best traditional: all explorers, Traditional, 7.7. Clear difference.

![How much the kinds of agents matter](figures/compare.svg)

| team | setting | frontier | reach L7 | cost | sharing |
| --- | --- | --- | --- | --- | --- |
| default mix | Traditional | 5.7 ± 1.2 | 0.35 | 957 ± 161 | 0.01 ± 0.01 |
| default mix | OSO (immediate) | 7.9 ± 0.2 | 1.00 | 485 ± 141 | 1.00 ± 0.00 |
| default mix | OSO (choice) | 6.3 ± 1.0 | 0.43 | 959 ± 186 | 0.22 ± 0.09 |
| no foundation builders | Traditional | 5.7 ± 1.0 | 0.34 | 962 ± 177 | 0.00 ± 0.01 |
| no foundation builders | OSO (immediate) | 8.0 ± 0.2 | 1.00 | 474 ± 142 | 1.00 ± 0.00 |
| no foundation builders | OSO (choice) | 6.3 ± 0.9 | 0.51 | 947 ± 193 | 0.23 ± 0.08 |
| no racers | Traditional | 5.6 ± 1.0 | 0.32 | 986 ± 170 | 0.00 ± 0.01 |
| no racers | OSO (immediate) | 8.0 ± 0.2 | 1.00 | 462 ± 134 | 1.00 ± 0.00 |
| no racers | OSO (choice) | 6.1 ± 0.9 | 0.37 | 919 ± 219 | 0.23 ± 0.09 |
| no explorers | Traditional | 5.6 ± 1.0 | 0.29 | 999 ± 131 | 0.01 ± 0.01 |
| no explorers | OSO (immediate) | 7.9 ± 0.3 | 1.00 | 522 ± 153 | 1.00 ± 0.00 |
| no explorers | OSO (choice) | 6.2 ± 0.9 | 0.45 | 996 ± 127 | 0.23 ± 0.08 |
| no specialists | Traditional | 5.5 ± 1.0 | 0.26 | 1024 ± 158 | 0.00 ± 0.01 |
| no specialists | OSO (immediate) | 7.9 ± 0.2 | 1.00 | 474 ± 138 | 1.00 ± 0.00 |
| no specialists | OSO (choice) | 6.2 ± 0.9 | 0.44 | 955 ± 160 | 0.22 ± 0.08 |
| no free rider | Traditional | 5.8 ± 1.1 | 0.38 | 1009 ± 151 | 0.00 ± 0.01 |
| no free rider | OSO (immediate) | 8.0 ± 0.2 | 1.00 | 459 ± 150 | 1.00 ± 0.00 |
| no free rider | OSO (choice) | 6.3 ± 0.9 | 0.46 | 997 ± 164 | 0.24 ± 0.08 |
| no gamer | Traditional | 6.6 ± 1.3 | 0.63 | 864 ± 194 | 0.00 ± 0.01 |
| no gamer | OSO (immediate) | 8.0 ± 0.1 | 1.00 | 415 ± 126 | 1.00 ± 0.00 |
| no gamer | OSO (choice) | 7.4 ± 0.9 | 0.85 | 712 ± 217 | 0.27 ± 0.09 |
| all plain | Traditional | 6.1 ± 1.3 | 0.48 | 1002 ± 130 | 0.00 ± 0.00 |
| all plain | OSO (immediate) | 8.0 ± 0.0 | 1.00 | 427 ± 101 | 1.00 ± 0.00 |
| all plain | OSO (choice) | 6.5 ± 1.2 | 0.58 | 890 ± 169 | 0.21 ± 0.08 |
| all foundation | Traditional | 4.9 ± 0.5 | 0.02 | 1013 ± 66 | 0.00 ± 0.01 |
| all foundation | OSO (immediate) | 8.0 ± 0.2 | 1.00 | 676 ± 115 | 1.00 ± 0.00 |
| all foundation | OSO (choice) | 6.1 ± 0.8 | 0.31 | 1010 ± 154 | 0.27 ± 0.09 |
| all racers | Traditional | 6.3 ± 1.2 | 0.56 | 970 ± 149 | 0.00 ± 0.01 |
| all racers | OSO (immediate) | 8.0 ± 0.2 | 1.00 | 437 ± 111 | 1.00 ± 0.00 |
| all racers | OSO (choice) | 6.8 ± 0.9 | 0.69 | 875 ± 191 | 0.24 ± 0.07 |
| all explorers | Traditional | 7.7 ± 0.4 | 1.00 | 755 ± 177 | 0.00 ± 0.01 |
| all explorers | OSO (immediate) | 8.0 ± 0.0 | 1.00 | 280 ± 69 | 1.00 ± 0.00 |
| all explorers | OSO (choice) | 7.8 ± 0.5 | 0.98 | 632 ± 212 | 0.30 ± 0.08 |

**Design** (fixed before the run): compared the default mix, each kind swapped for plain agents, and teams of one kind, under three rule settings · held the same: the field, 12 agents and the budget · measure: hardest level published, higher is better · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Each kind of agent swapped for the same number of plain agents (average skill, no preferences, full reuse), and teams of 12 of one kind. Same field and budget throughout; each seed gives the same world.

Values are mean ± standard deviation over runs.

| team | setting | frontier | reach L7 | cost | sharing | gamer share of pay |
| --- | --- | --- | --- | --- | --- | --- |
| default mix | Traditional | 5.7 ± 1.2 | 0.35 | 957 ± 161 | 0.01 ± 0.01 | 0.96 |
| default mix | OSO (immediate) | 7.9 ± 0.2 | 1.00 | 485 ± 141 | 1.00 ± 0.00 | 0.38 |
| default mix | OSO (choice) | 6.3 ± 1.0 | 0.43 | 959 ± 186 | 0.22 ± 0.09 | 0.91 |
| no foundation builders | Traditional | 5.7 ± 1.0 | 0.34 | 962 ± 177 | 0.00 ± 0.01 | 0.97 |
| no foundation builders | OSO (immediate) | 8.0 ± 0.2 | 1.00 | 474 ± 142 | 1.00 ± 0.00 | 0.31 |
| no foundation builders | OSO (choice) | 6.3 ± 0.9 | 0.51 | 947 ± 193 | 0.23 ± 0.08 | 0.90 |
| no racers | Traditional | 5.6 ± 1.0 | 0.32 | 986 ± 170 | 0.00 ± 0.01 | 0.97 |
| no racers | OSO (immediate) | 8.0 ± 0.2 | 1.00 | 462 ± 134 | 1.00 ± 0.00 | 0.35 |
| no racers | OSO (choice) | 6.1 ± 0.9 | 0.37 | 919 ± 219 | 0.23 ± 0.09 | 0.93 |
| no explorers | Traditional | 5.6 ± 1.0 | 0.29 | 999 ± 131 | 0.01 ± 0.01 | 0.97 |
| no explorers | OSO (immediate) | 7.9 ± 0.3 | 1.00 | 522 ± 153 | 1.00 ± 0.00 | 0.47 |
| no explorers | OSO (choice) | 6.2 ± 0.9 | 0.45 | 996 ± 127 | 0.23 ± 0.08 | 0.94 |
| no specialists | Traditional | 5.5 ± 1.0 | 0.26 | 1024 ± 158 | 0.00 ± 0.01 | 0.96 |
| no specialists | OSO (immediate) | 7.9 ± 0.2 | 1.00 | 474 ± 138 | 1.00 ± 0.00 | 0.36 |
| no specialists | OSO (choice) | 6.2 ± 0.9 | 0.44 | 955 ± 160 | 0.22 ± 0.08 | 0.94 |
| no free rider | Traditional | 5.8 ± 1.1 | 0.38 | 1009 ± 151 | 0.00 ± 0.01 | 0.97 |
| no free rider | OSO (immediate) | 8.0 ± 0.2 | 1.00 | 459 ± 150 | 1.00 ± 0.00 | 0.38 |
| no free rider | OSO (choice) | 6.3 ± 0.9 | 0.46 | 997 ± 164 | 0.24 ± 0.08 | 0.92 |
| no gamer | Traditional | 6.6 ± 1.3 | 0.63 | 864 ± 194 | 0.00 ± 0.01 | – |
| no gamer | OSO (immediate) | 8.0 ± 0.1 | 1.00 | 415 ± 126 | 1.00 ± 0.00 | – |
| no gamer | OSO (choice) | 7.4 ± 0.9 | 0.85 | 712 ± 217 | 0.27 ± 0.09 | – |
| all plain | Traditional | 6.1 ± 1.3 | 0.48 | 1002 ± 130 | 0.00 ± 0.00 | – |
| all plain | OSO (immediate) | 8.0 ± 0.0 | 1.00 | 427 ± 101 | 1.00 ± 0.00 | – |
| all plain | OSO (choice) | 6.5 ± 1.2 | 0.58 | 890 ± 169 | 0.21 ± 0.08 | – |
| all foundation | Traditional | 4.9 ± 0.5 | 0.02 | 1013 ± 66 | 0.00 ± 0.01 | – |
| all foundation | OSO (immediate) | 8.0 ± 0.2 | 1.00 | 676 ± 115 | 1.00 ± 0.00 | – |
| all foundation | OSO (choice) | 6.1 ± 0.8 | 0.31 | 1010 ± 154 | 0.27 ± 0.09 | – |
| all racers | Traditional | 6.3 ± 1.2 | 0.56 | 970 ± 149 | 0.00 ± 0.01 | – |
| all racers | OSO (immediate) | 8.0 ± 0.2 | 1.00 | 437 ± 111 | 1.00 ± 0.00 | – |
| all racers | OSO (choice) | 6.8 ± 0.9 | 0.69 | 875 ± 191 | 0.24 ± 0.07 | – |
| all explorers | Traditional | 7.7 ± 0.4 | 1.00 | 755 ± 177 | 0.00 ± 0.01 | – |
| all explorers | OSO (immediate) | 8.0 ± 0.0 | 1.00 | 280 ± 69 | 1.00 ± 0.00 | – |
| all explorers | OSO (choice) | 7.8 ± 0.5 | 0.98 | 632 ± 212 | 0.30 ± 0.08 | – |

Code: commit `cacf1d2` (with uncommitted changes). Experiment: [config/experiments/agent-kinds.yaml](../../config/experiments/agent-kinds.yaml). Command: `npm run sim -- agent-kinds --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
