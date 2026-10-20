# Lean pilot: five models on the posted targets (2026-10-19)

Each model attempted every posted target alone (no library) and with the theorems it rests on (library), 2 attempts each. One attempt is a proof plus up to 3 repairs on Lean's errors; reasoning effort high; `grind` banned. All models were called through OpenRouter, which reports each call's cost.

## By model

| model | proved with library | proved alone | cost per attempt, library | cost per attempt, alone | cost per proof, library / alone | total cost |
| --- | --- | --- | --- | --- | --- | --- |
| `anthropic/claude-opus-5.5` | 16/16 (100%) | 16/16 (100%) | $0.042 | $0.24 | $0.042 / $0.24 | $4.48 |
| `anthropic/claude-sonnet-5.5` | 16/16 (100%) | 16/16 (100%) | $0.022 | $0.12 | $0.022 / $0.12 | $2.34 |
| `openai/gpt-5.6-terra` | 16/16 (100%) | 11/16 (69%) | $0.068 | $0.20 | $0.068 / $0.16 | $4.27 |
| `google/gemini-3.8-flash` | 14/16 (88%) | 11/16 (69%) | $0.16 | $0.22 | $0.13 / $0.17 | $6.09 |
| `deepseek/deepseek-v4.1-flash` | 12/16 (75%) | 4/10 (40%) | $0.010 | $0.038 | $0.008 / $0.001 | $0.55 |

## By target: proved alone · proved with library

| target | depth | claude-opus-5.5 | claude-sonnet-5.5 | gpt-5.6-terra | gemini-3.8-flash | deepseek-v4.1-flash |
| --- | --- | --- | --- | --- | --- | --- |
| C3 | 1 | 2/2 alone · 2/2 with | 2/2 alone · 2/2 with | 1/2 alone · 2/2 with | 2/2 alone · 2/2 with | 1/2 alone · 2/2 with |
| A3 | 2 | 2/2 alone · 2/2 with | 2/2 alone · 2/2 with | 2/2 alone · 2/2 with | 2/2 alone · 2/2 with | 0/2 alone · 1/2 with |
| C4 | 3 | 2/2 alone · 2/2 with | 2/2 alone · 2/2 with | 2/2 alone · 2/2 with | 2/2 alone · 2/2 with | 1/2 alone · 2/2 with |
| X1 | 3 | 2/2 alone · 2/2 with | 2/2 alone · 2/2 with | 0/2 alone · 2/2 with | 0/2 alone · 1/2 with | 0/2 alone · 0/2 with |
| B3 | 4 | 2/2 alone · 2/2 with | 2/2 alone · 2/2 with | 2/2 alone · 2/2 with | 2/2 alone · 2/2 with | 2/2 alone · 2/2 with |
| B5 | 5 | 2/2 alone · 2/2 with | 2/2 alone · 2/2 with | 1/2 alone · 2/2 with | 1/2 alone · 2/2 with | – alone · 2/2 with |
| X2 | 5 | 2/2 alone · 2/2 with | 2/2 alone · 2/2 with | 2/2 alone · 2/2 with | 2/2 alone · 2/2 with | – alone · 2/2 with |
| A5 | 7 | 2/2 alone · 2/2 with | 2/2 alone · 2/2 with | 1/2 alone · 2/2 with | 0/2 alone · 1/2 with | – alone · 1/2 with |

A target a model proves alone does not need its lemmas, for that model: shared lemmas then save cost, but do not make the result reachable. Ids are the anonymous ids of [worlds/lean-reference.json](../../../worlds/lean-reference.json). Runs: [panel-claude-opus-5.5](../panel-claude-opus-5.5/summary.md), [panel-claude-sonnet-5.5](../panel-claude-sonnet-5.5/summary.md), [panel-gpt-5.6-terra](../panel-gpt-5.6-terra/summary.md), [panel-gemini-3.8-flash](../panel-gemini-3.8-flash/summary.md), [panel-deepseek-v4.1-flash](../panel-deepseek-v4.1-flash/summary.md).
## Notes

- **A checker bug was fixed mid-run:** Lean errors tagged with a code (`error(lean.…)`) were not passed to the agent, so some repairs were made blind. The 12 attempts that received such feedback were set aside, kept privately as superseded, and rerun with the fix. The numbers above count only attempts whose feedback was complete.
- **DeepSeek alone on B5, X2 and A5 is missing:** both tries were cut off by a network interruption 13 minutes in, every attempt at once. By then each had had one or two proofs rejected by Lean, but none had finished, so they are not counted.
- **Credit ran out once,** midway through the Gemini and DeepSeek runs; they were resumed where they stopped.
- **Effort:** every model ran at reasoning effort `high` with 32,000 output tokens per turn. Gemini and DeepSeek sometimes used the whole allowance thinking; from the resumed runs on, the agent was told when its reply had been cut off.
