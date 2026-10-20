# Lean pilot: panel-claude-sonnet-5.5

How hard each theorem of the Lean problem set is for a real agent. 

- **Agent:** `anthropic/claude-sonnet-5.5` via openrouter, reasoning effort high. One attempt is a first proof plus up to 3 repairs on Lean's error messages.
- **Rules:** Lean 4.35 core only; `grind` banned; the checker accepts a proof only if it uses nothing beyond the library given and Lean's standard axioms.
- **Conditions:** *library*: the theorems it rests on in the reference tree are given; *alone*: posted targets with an empty library.
- **Attempts:** 32; tokens in 294.9k (plus 0.0k cached), out 175.3k; cost $2.34 ($0.073 per attempt).

Theorem ids are the anonymous ids of [worlds/lean-reference.json](../../../worlds/lean-reference.json); statements and proofs are private until the experiment.

## Success by depth (library)

| depth | theorems | attempts | proved | success per attempt | tokens per attempt |
| --- | --- | --- | --- | --- | --- |
| 1 | 1 | 2 | 2 | 100% | 6.3k |
| 2 | 1 | 2 | 2 | 100% | 3.4k |
| 3 | 2 | 4 | 4 | 100% | 9.9k |
| 4 | 1 | 2 | 2 | 100% | 2.0k |
| 5 | 2 | 4 | 4 | 100% | 3.2k |
| 7 | 1 | 2 | 2 | 100% | 3.8k |

## Do targets need their lemmas?

| target | depth | alone | with library |
| --- | --- | --- | --- |
| C3 | 1 | 2/2 | 2/2 |
| A3 | 2 | 2/2 | 2/2 |
| C4 | 3 | 2/2 | 2/2 |
| X1 | 3 | 2/2 | 2/2 |
| B3 | 4 | 2/2 | 2/2 |
| B5 | 5 | 2/2 | 2/2 |
| X2 | 5 | 2/2 | 2/2 |
| A5 | 7 | 2/2 | 2/2 |

A target proved alone in most attempts is too easy: its lemmas are not needed.

## Every theorem

| id | depth | area | condition | proved | mean turns | tokens per attempt |
| --- | --- | --- | --- | --- | --- | --- |
| C3 | 1 | C | alone | 2/2 | 1.5 | 4.2k |
| A3 | 2 | A | alone | 2/2 | 2.0 | 18.1k |
| C4 | 3 | C | alone | 2/2 | 1.0 | 3.7k |
| X1 | 3 | cross | alone | 2/2 | 2.0 | 14.4k |
| B3 | 4 | B | alone | 2/2 | 1.0 | 3.9k |
| B5 | 5 | B | alone | 2/2 | 4.0 | 106.4k |
| X2 | 5 | cross | alone | 2/2 | 1.0 | 4.9k |
| A5 | 7 | A | alone | 2/2 | 1.5 | 38.0k |
| C3 | 1 | C | library | 2/2 | 2.0 | 6.3k |
| A3 | 2 | A | library | 2/2 | 1.0 | 3.4k |
| C4 | 3 | C | library | 2/2 | 1.0 | 2.3k |
| X1 | 3 | cross | library | 2/2 | 2.5 | 17.5k |
| B3 | 4 | B | library | 2/2 | 1.0 | 2.0k |
| B5 | 5 | B | library | 2/2 | 1.0 | 2.9k |
| X2 | 5 | cross | library | 2/2 | 1.0 | 3.4k |
| A5 | 7 | A | library | 2/2 | 1.0 | 3.8k |
