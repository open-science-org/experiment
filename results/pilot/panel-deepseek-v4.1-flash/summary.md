# Lean pilot: panel-deepseek-v4.1-flash

How hard each theorem of the Lean problem set is for a real agent. 

- **Agent:** `deepseek/deepseek-v4.1-flash` via openrouter, reasoning effort high. One attempt is a first proof plus up to 3 repairs on Lean's error messages.
- **Rules:** Lean 4.35 core only; `grind` banned; the checker accepts a proof only if it uses nothing beyond the library given and Lean's standard axioms.
- **Conditions:** *library*: the theorems it rests on in the reference tree are given; *alone*: posted targets with an empty library.
- **Attempts:** 32; tokens in 57.9k (plus 82.9k cached), out 2311.3k; cost $0.91 ($0.028 per attempt).

Theorem ids are the anonymous ids of [worlds/lean-reference.json](../../../worlds/lean-reference.json); statements and proofs are private until the experiment.

## Success by depth (library)

| depth | theorems | attempts | proved | success per attempt | tokens per attempt |
| --- | --- | --- | --- | --- | --- |
| 1 | 1 | 2 | 2 | 100% | 55.7k |
| 2 | 1 | 2 | 1 | 50% | 82.3k |
| 3 | 2 | 4 | 2 | 50% | 69.4k |
| 4 | 1 | 2 | 2 | 100% | 2.2k |
| 5 | 2 | 4 | 4 | 100% | 23.4k |
| 7 | 1 | 2 | 1 | 50% | 81.9k |

## Do targets need their lemmas?

| target | depth | alone | with library |
| --- | --- | --- | --- |
| C3 | 1 | 1/2 | 2/2 |
| A3 | 2 | 0/2 | 1/2 |
| C4 | 3 | 1/2 | 2/2 |
| X1 | 3 | 0/2 | 0/2 |
| B3 | 4 | 2/2 | 2/2 |
| B5 | 5 | 0/2 | 2/2 |
| X2 | 5 | 0/2 | 2/2 |
| A5 | 7 | 0/2 | 1/2 |

A target proved alone in most attempts is too easy: its lemmas are not needed.

## Every theorem

| id | depth | area | condition | proved | mean turns | tokens per attempt |
| --- | --- | --- | --- | --- | --- | --- |
| C3 | 1 | C | alone | 1/2 | 3.5 | 102.8k |
| A3 | 2 | A | alone | 0/2 | 4.0 | 133.4k |
| C4 | 3 | C | alone | 1/2 | 3.0 | 92.4k |
| X1 | 3 | cross | alone | 0/2 | 4.0 | 133.4k |
| B3 | 4 | B | alone | 2/2 | 2.0 | 54.0k |
| B5 | 5 | B | alone | 0/2 | 4.0 | 111.3k |
| X2 | 5 | cross | alone | 0/2 | 4.0 | 96.3k |
| A5 | 7 | A | alone | 0/2 | 4.0 | 94.9k |
| C3 | 1 | C | library | 2/2 | 2.0 | 55.7k |
| A3 | 2 | A | library | 1/2 | 2.5 | 82.3k |
| C4 | 3 | C | library | 2/2 | 1.0 | 5.5k |
| X1 | 3 | cross | library | 0/2 | 4.0 | 133.2k |
| B3 | 4 | B | library | 2/2 | 1.0 | 2.2k |
| B5 | 5 | B | library | 2/2 | 1.5 | 3.8k |
| X2 | 5 | cross | library | 2/2 | 1.5 | 43.0k |
| A5 | 7 | A | library | 1/2 | 2.5 | 81.9k |
