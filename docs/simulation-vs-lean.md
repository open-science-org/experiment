# How the simulation and the Lean runs differ

The Lean runs test the same rules as the simulation, on real proofs. They are not the same model. Read a match or a mismatch between the two with these differences in mind. Add to this list whenever one changes.

| | Simulation | Lean runs |
| --- | --- | --- |
| **Problems** | Generated fields of ideas, many sizes and difficulties | One problem set of 8 targets, written by us; a harder set adds 3 |
| **Difficulty** | Known exactly: each idea has its bits, and $2^{\text{bits}}$ attempts on average | Not known; estimated from how often a model proves a result |
| **Agents** | Formula agents | One cheap model (DeepSeek V4.1 Flash) in 4 labs |
| **An attempt** | A random draw that succeeds with chance $p$ | A proof the model writes and Lean checks |
| **What a result used** | Known from the idea graph | Read from the proof: the results Lean finds it depends on |
| **Link weights** | Relative intellectual contribution, in bits | Proof length of each used result, a stand-in (until 2026-11-08, money spent proving it) |
| **Knowledge reward** | Paid per new bit | Off in Spend all, Fair-prompt check and May quit; by proof size in Labs choose |
| **Who publishes** | Set by the rules, or agents choosing by a formula | Set by the rules, or the model choosing (Labs choose) |
| **Money** | Can follow earnings, over several epochs | Fixed budget per lab: every run so far is one epoch. `--follow` exists but has not been used |
| **Scoop risk** | A setting, ψ, which is a guess | No setting: it happens or not |
| **Wasted effort** | None by design | About a quarter of replies ran out of length before answering; see [the results](ai-agent-results.md) |

The reward differences for each run are also recorded in its own summary. What is still measured by a stand-in: [Not yet measured](design.md#not-yet-measured).
