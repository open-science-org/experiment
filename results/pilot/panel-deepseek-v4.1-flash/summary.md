# Lean pilot: panel-deepseek-v4.1-flash

How hard each theorem of the Lean problem set is for a real agent. 

- **Agent:** `deepseek/deepseek-v4.1-flash` via openrouter, reasoning effort high. One attempt is a first proof plus up to 3 repairs on Lean's error messages.
- **Rules:** Lean 4.35 core only; `grind` banned; the checker accepts a proof only if it uses nothing beyond the library given and Lean's standard axioms.
- **Conditions:** *library*: the theorems it rests on in the reference tree are given; *alone*: posted targets with an empty library.
- **Attempts:** 11; tokens in 12.5k (plus 7.9k cached), out 181.1k; cost $0.09 ($0.008 per attempt).

Theorem ids are the anonymous ids of [worlds/lean-reference.json](../../../worlds/lean-reference.json); statements and proofs are private until the experiment.

## Success by depth (library)

| depth | theorems | attempts | proved | success per attempt | tokens per attempt |
| --- | --- | --- | --- | --- | --- |
| 1 | 1 | 1 | 1 | 100% | 30.6k |
| 2 | 1 | 1 | 1 | 100% | 31.1k |
| 3 | 1 | 2 | 2 | 100% | 5.5k |
| 4 | 1 | 2 | 2 | 100% | 2.2k |
| 5 | 2 | 4 | 4 | 100% | 23.4k |
| 7 | 1 | 1 | 1 | 100% | 30.8k |

## Do targets need their lemmas?

Not run.

A target proved alone in most attempts is too easy: its lemmas are not needed.

## Every theorem

| id | depth | area | condition | proved | mean turns | tokens per attempt |
| --- | --- | --- | --- | --- | --- | --- |
| C3 | 1 | C | library | 1/1 | 1.0 | 30.6k |
| A3 | 2 | A | library | 1/1 | 1.0 | 31.1k |
| C4 | 3 | C | library | 2/2 | 1.0 | 5.5k |
| B3 | 4 | B | library | 2/2 | 1.0 | 2.2k |
| B5 | 5 | B | library | 2/2 | 1.5 | 3.8k |
| X2 | 5 | cross | library | 2/2 | 1.5 | 43.0k |
| A5 | 7 | A | library | 1/1 | 1.0 | 30.8k |
