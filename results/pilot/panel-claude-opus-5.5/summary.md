# Lean pilot: panel-claude-opus-5.5

How hard each theorem of the Lean problem set is for a real agent. 

- **Agent:** `anthropic/claude-opus-5.5` via openrouter, reasoning effort high. One attempt is a first proof plus up to 3 repairs on Lean's error messages.
- **Rules:** Lean 4.35 core only; `grind` banned; the checker accepts a proof only if it uses nothing beyond the library given and Lean's standard axioms.
- **Conditions:** *library*: the theorems it rests on in the reference tree are given; *alone*: posted targets with an empty library.
- **Attempts:** 32; tokens in 149.0k (plus 0.0k cached), out 194.1k; cost $4.48 ($0.140 per attempt).

Theorem ids are the anonymous ids of [worlds/lean-reference.json](../../../worlds/lean-reference.json); statements and proofs are private until the experiment.

## Success by depth (library)

| depth | theorems | attempts | proved | success per attempt | tokens per attempt |
| --- | --- | --- | --- | --- | --- |
| 1 | 1 | 2 | 2 | 100% | 3.5k |
| 2 | 1 | 2 | 2 | 100% | 4.3k |
| 3 | 2 | 4 | 4 | 100% | 4.4k |
| 4 | 1 | 2 | 2 | 100% | 2.6k |
| 5 | 2 | 4 | 4 | 100% | 3.4k |
| 7 | 1 | 2 | 2 | 100% | 4.0k |

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
| C3 | 1 | C | alone | 2/2 | 1.0 | 3.3k |
| A3 | 2 | A | alone | 2/2 | 1.5 | 17.5k |
| C4 | 3 | C | alone | 2/2 | 1.0 | 4.8k |
| X1 | 3 | cross | alone | 2/2 | 1.0 | 13.0k |
| B3 | 4 | B | alone | 2/2 | 1.0 | 4.6k |
| B5 | 5 | B | alone | 2/2 | 1.5 | 33.4k |
| X2 | 5 | cross | alone | 2/2 | 1.0 | 4.7k |
| A5 | 7 | A | alone | 2/2 | 2.0 | 60.2k |
| C3 | 1 | C | library | 2/2 | 1.0 | 3.5k |
| A3 | 2 | A | library | 2/2 | 1.0 | 4.3k |
| C4 | 3 | C | library | 2/2 | 1.0 | 2.7k |
| X1 | 3 | cross | library | 2/2 | 1.0 | 6.1k |
| B3 | 4 | B | library | 2/2 | 1.0 | 2.6k |
| B5 | 5 | B | library | 2/2 | 1.0 | 3.1k |
| X2 | 5 | cross | library | 2/2 | 1.0 | 3.7k |
| A5 | 7 | A | library | 2/2 | 1.0 | 4.0k |
