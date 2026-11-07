# Lean pilot: panel-gpt-oss-120b

How hard each theorem of the Lean problem set is for a real agent. 

- **Agent:** `openai/gpt-oss-120b` via openrouter, reasoning effort high. One attempt is a first proof plus up to 3 repairs on Lean's error messages.
- **Rules:** Lean 4.35 core only; `grind` banned; the checker accepts a proof only if it uses nothing beyond the library given and Lean's standard axioms.
- **Conditions:** *library*: the theorems it rests on in the reference tree are given; *alone*: posted targets with an empty library.
- **Attempts:** 32; tokens in 1088.7k (plus 48.0k cached), out 2105.0k; cost $0.15 ($0.005 per attempt).

Theorem ids are the anonymous ids of [worlds/lean-reference.json](../../../worlds/lean-reference.json); statements and proofs are private until the experiment.

## Success by level (library)

| depth | theorems | attempts | proved | success per attempt | tokens per attempt |
| --- | --- | --- | --- | --- | --- |
| 1 | 1 | 2 | 0 | 0% | 84.0k |
| 2 | 1 | 2 | 0 | 0% | 122.2k |
| 3 | 2 | 4 | 2 | 50% | 88.0k |
| 4 | 1 | 2 | 2 | 100% | 8.7k |
| 5 | 2 | 4 | 3 | 75% | 34.1k |
| 7 | 1 | 2 | 0 | 0% | 129.6k |

## Do targets need their lemmas?

| target | depth | alone | with library |
| --- | --- | --- | --- |
| C3 | 1 | 0/2 | 0/2 |
| A3 | 2 | 0/2 | 0/2 |
| C4 | 3 | 0/2 | 2/2 |
| X1 | 3 | 0/2 | 0/2 |
| B3 | 4 | 2/2 | 2/2 |
| B5 | 5 | 0/2 | 2/2 |
| X2 | 5 | 0/2 | 1/2 |
| A5 | 7 | 0/2 | 0/2 |

A target proved alone in most attempts is too easy: its lemmas are not needed.

## Every theorem

| id | depth | area | condition | proved | mean turns | tokens per attempt |
| --- | --- | --- | --- | --- | --- | --- |
| C3 | 1 | C | alone | 0/2 | 4.0 | 87.1k |
| A3 | 2 | A | alone | 0/2 | 4.0 | 188.2k |
| C4 | 3 | C | alone | 0/2 | 4.0 | 98.4k |
| X1 | 3 | cross | alone | 0/2 | 4.0 | 142.9k |
| B3 | 4 | B | alone | 2/2 | 2.0 | 58.8k |
| B5 | 5 | B | alone | 0/2 | 4.0 | 151.7k |
| X2 | 5 | cross | alone | 0/2 | 4.0 | 139.2k |
| A5 | 7 | A | alone | 0/2 | 4.0 | 166.1k |
| C3 | 1 | C | library | 0/2 | 4.0 | 84.0k |
| A3 | 2 | A | library | 0/2 | 4.0 | 122.2k |
| C4 | 3 | C | library | 2/2 | 2.0 | 21.5k |
| X1 | 3 | cross | library | 0/2 | 4.0 | 154.4k |
| B3 | 4 | B | library | 2/2 | 2.5 | 8.7k |
| B5 | 5 | B | library | 2/2 | 2.0 | 12.7k |
| X2 | 5 | cross | library | 1/2 | 2.5 | 55.5k |
| A5 | 7 | A | library | 0/2 | 4.0 | 129.6k |
