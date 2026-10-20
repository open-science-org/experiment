# Lean pilot: models compared

Each model attempted every posted target alone (no library) and with the theorems it rests on (library), 2 attempts each. One attempt is a proof plus up to 3 repairs on Lean's errors; reasoning effort high; `grind` banned. All models were called through OpenRouter, which reports each call's cost.

## By model

| model | proved with library | proved alone | cost per attempt, library | cost per attempt, alone | cost per proof, library / alone | total cost |
| --- | --- | --- | --- | --- | --- | --- |
| `anthropic/claude-opus-5.5` | 16/16 (100%) | 16/16 (100%) | $0.042 | $0.24 | $0.042 / $0.24 | $4.48 |
| `anthropic/claude-sonnet-5.5` | 16/16 (100%) | 16/16 (100%) | $0.022 | $0.13 | $0.022 / $0.13 | $2.43 |
| `openai/gpt-5.6-terra` | 13/16 (81%) | 7/16 (44%) | $0.096 | $0.22 | $0.068 / $0.11 | $5.03 |

## By target: proved alone · proved with library

| target | depth | claude-opus-5.5 | claude-sonnet-5.5 | gpt-5.6-terra |
| --- | --- | --- | --- | --- |
| C3 | 1 | 2/2 alone · 2/2 with | 2/2 alone · 2/2 with | 0/2 alone · 1/2 with |
| A3 | 2 | 2/2 alone · 2/2 with | 2/2 alone · 2/2 with | 1/2 alone · 2/2 with |
| C4 | 3 | 2/2 alone · 2/2 with | 2/2 alone · 2/2 with | 2/2 alone · 2/2 with |
| X1 | 3 | 2/2 alone · 2/2 with | 2/2 alone · 2/2 with | 0/2 alone · 1/2 with |
| B3 | 4 | 2/2 alone · 2/2 with | 2/2 alone · 2/2 with | 2/2 alone · 2/2 with |
| B5 | 5 | 2/2 alone · 2/2 with | 2/2 alone · 2/2 with | 0/2 alone · 2/2 with |
| X2 | 5 | 2/2 alone · 2/2 with | 2/2 alone · 2/2 with | 2/2 alone · 2/2 with |
| A5 | 7 | 2/2 alone · 2/2 with | 2/2 alone · 2/2 with | 0/2 alone · 1/2 with |

A target a model proves alone does not need its lemmas, for that model: shared lemmas then save cost, but do not make the result reachable. Ids are the anonymous ids of [worlds/lean-reference.json](../../../worlds/lean-reference.json). Runs: [panel-claude-opus-5.5](../panel-claude-opus-5.5/summary.md), [panel-claude-sonnet-5.5](../panel-claude-sonnet-5.5/summary.md), [panel-gpt-5.6-terra](../panel-gpt-5.6-terra/summary.md).
