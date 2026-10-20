# Lean pilot: first-test

How hard each theorem of the Lean problem set is for a real agent. 

- **Agent:** `anthropic/claude-opus-5.5` via openrouter, reasoning effort high. One attempt is a first proof plus up to 3 repairs on Lean's error messages.
- **Rules:** Lean 4.35 core only; `grind` banned; the checker accepts a proof only if it uses nothing beyond the library given and Lean's standard axioms.
- **Conditions:** *library*: the theorems it rests on in the reference tree are given; *alone*: posted targets with an empty library.
- **Attempts:** 7; tokens in 17.1k (plus 0.0k cached), out 33.6k; cost $0.74 ($0.106 per attempt).

Theorem ids are the anonymous ids of [worlds/lean-reference.json](../../../worlds/lean-reference.json); statements and proofs are private until the experiment.

## Success by depth (library)

| depth | theorems | attempts | proved | success per attempt | tokens per attempt |
| --- | --- | --- | --- | --- | --- |
| 1 | 1 | 1 | 1 | 100% | 2.9k |
| 2 | 1 | 1 | 1 | 100% | 12.6k |
| 3 | 2 | 2 | 2 | 100% | 5.0k |

## Do targets need their lemmas?

| target | depth | alone | with library |
| --- | --- | --- | --- |
| A3 | 2 | 1/1 | 1/1 |
| C4 | 3 | 1/1 | 1/1 |
| X1 | 3 | 1/1 | 1/1 |

A target proved alone in most attempts is too easy: its lemmas are not needed.

## Every theorem

| id | depth | area | condition | proved | mean turns | tokens per attempt |
| --- | --- | --- | --- | --- | --- | --- |
| A3 | 2 | A | alone | 1/1 | 1.0 | 11.0k |
| C4 | 3 | C | alone | 1/1 | 1.0 | 4.8k |
| X1 | 3 | cross | alone | 1/1 | 1.0 | 9.5k |
| B-02 | 1 | B | library | 1/1 | 1.0 | 2.9k |
| A3 | 2 | A | library | 1/1 | 2.0 | 12.6k |
| C4 | 3 | C | library | 1/1 | 1.0 | 2.7k |
| X1 | 3 | cross | library | 1/1 | 1.0 | 7.3k |
