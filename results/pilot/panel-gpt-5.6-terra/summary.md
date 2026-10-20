# Lean pilot: panel-gpt-5.6-terra

How hard each theorem of the Lean problem set is for a real agent. 

- **Agent:** `openai/gpt-5.6-terra` via openrouter, reasoning effort high. One attempt is a first proof plus up to 3 repairs on Lean's error messages.
- **Rules:** Lean 4.35 core only; `grind` banned; the checker accepts a proof only if it uses nothing beyond the library given and Lean's standard axioms.
- **Conditions:** *library*: the theorems it rests on in the reference tree are given; *alone*: posted targets with an empty library.
- **Attempts:** 31; tokens in 214.3k (plus 293.6k cached), out 269.8k; cost $3.83 ($0.124 per attempt).

Theorem ids are the anonymous ids of [worlds/lean-reference.json](../../../worlds/lean-reference.json); statements and proofs are private until the experiment.

## Success by depth (library)

| depth | theorems | attempts | proved | success per attempt | tokens per attempt |
| --- | --- | --- | --- | --- | --- |
| 1 | 1 | 2 | 2 | 100% | 19.9k |
| 2 | 1 | 2 | 2 | 100% | 5.2k |
| 3 | 2 | 4 | 4 | 100% | 24.2k |
| 4 | 1 | 2 | 2 | 100% | 2.5k |
| 5 | 2 | 4 | 4 | 100% | 4.3k |
| 7 | 1 | 2 | 2 | 100% | 21.0k |

## Do targets need their lemmas?

| target | depth | alone | with library |
| --- | --- | --- | --- |
| C3 | 1 | 1/2 | 2/2 |
| A3 | 2 | 2/2 | 2/2 |
| C4 | 3 | 2/2 | 2/2 |
| X1 | 3 | 0/2 | 2/2 |
| B3 | 4 | 2/2 | 2/2 |
| B5 | 5 | 1/2 | 2/2 |
| X2 | 5 | 2/2 | 2/2 |
| A5 | 7 | 0/1 | 2/2 |

A target proved alone in most attempts is too easy: its lemmas are not needed.

## Every theorem

| id | depth | area | condition | proved | mean turns | tokens per attempt |
| --- | --- | --- | --- | --- | --- | --- |
| C3 | 1 | C | alone | 1/2 | 3.0 | 34.9k |
| A3 | 2 | A | alone | 2/2 | 2.5 | 33.8k |
| C4 | 3 | C | alone | 2/2 | 1.5 | 10.1k |
| X1 | 3 | cross | alone | 0/2 | 4.0 | 73.2k |
| B3 | 4 | B | alone | 2/2 | 2.5 | 27.7k |
| B5 | 5 | B | alone | 1/2 | 3.5 | 63.3k |
| X2 | 5 | cross | alone | 2/2 | 1.5 | 13.6k |
| A5 | 7 | A | alone | 0/1 | 4.0 | 52.7k |
| C3 | 1 | C | library | 2/2 | 3.0 | 19.9k |
| A3 | 2 | A | library | 2/2 | 1.0 | 5.2k |
| C4 | 3 | C | library | 2/2 | 1.0 | 1.9k |
| X1 | 3 | cross | library | 2/2 | 3.5 | 46.4k |
| B3 | 4 | B | library | 2/2 | 1.5 | 2.5k |
| B5 | 5 | B | library | 2/2 | 1.0 | 2.2k |
| X2 | 5 | cross | library | 2/2 | 1.0 | 6.5k |
| A5 | 7 | A | library | 2/2 | 2.5 | 21.0k |
