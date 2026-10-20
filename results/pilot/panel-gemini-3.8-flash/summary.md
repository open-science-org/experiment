# Lean pilot: panel-gemini-3.8-flash

How hard each theorem of the Lean problem set is for a real agent. 

- **Agent:** `google/gemini-3.8-flash` via openrouter, reasoning effort high. One attempt is a first proof plus up to 3 repairs on Lean's error messages.
- **Rules:** Lean 4.35 core only; `grind` banned; the checker accepts a proof only if it uses nothing beyond the library given and Lean's standard axioms.
- **Conditions:** *library*: the theorems it rests on in the reference tree are given; *alone*: posted targets with an empty library.
- **Attempts:** 23; tokens in 752.5k (plus 32.7k cached), out 762.1k; cost $3.42 ($0.149 per attempt).

Theorem ids are the anonymous ids of [worlds/lean-reference.json](../../../worlds/lean-reference.json); statements and proofs are private until the experiment.

## Success by depth (library)

| depth | theorems | attempts | proved | success per attempt | tokens per attempt |
| --- | --- | --- | --- | --- | --- |
| 1 | 1 | 2 | 2 | 100% | 69.6k |
| 2 | 1 | 2 | 2 | 100% | 48.5k |
| 3 | 2 | 4 | 3 | 75% | 106.3k |
| 4 | 1 | 2 | 2 | 100% | 5.1k |
| 5 | 2 | 3 | 3 | 100% | 25.8k |
| 7 | 1 | 2 | 1 | 50% | 168.2k |

## Do targets need their lemmas?

| target | depth | alone | with library |
| --- | --- | --- | --- |
| C3 | 1 | 2/2 | 2/2 |
| A3 | 2 | 2/2 | 2/2 |
| C4 | 3 | 2/2 | 2/2 |
| B3 | 4 | 2/2 | 2/2 |

A target proved alone in most attempts is too easy: its lemmas are not needed.

## Every theorem

| id | depth | area | condition | proved | mean turns | tokens per attempt |
| --- | --- | --- | --- | --- | --- | --- |
| C3 | 1 | C | alone | 2/2 | 1.5 | 52.1k |
| A3 | 2 | A | alone | 2/2 | 2.5 | 92.8k |
| C4 | 3 | C | alone | 2/2 | 1.5 | 57.3k |
| B3 | 4 | B | alone | 2/2 | 1.0 | 28.7k |
| C3 | 1 | C | library | 2/2 | 2.0 | 69.6k |
| A3 | 2 | A | library | 2/2 | 1.5 | 48.5k |
| C4 | 3 | C | library | 2/2 | 1.0 | 24.5k |
| X1 | 3 | cross | library | 1/2 | 4.0 | 188.0k |
| B3 | 4 | B | library | 2/2 | 1.0 | 5.1k |
| B5 | 5 | B | library | 2/2 | 1.0 | 5.0k |
| X2 | 5 | cross | library | 1/1 | 2.0 | 67.5k |
| A5 | 7 | A | library | 1/2 | 3.5 | 168.2k |
