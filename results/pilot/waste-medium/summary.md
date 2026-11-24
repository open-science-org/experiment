# Lean pilot: waste-medium

How hard each theorem of the Lean problem set is for a real agent. 

- **Agent:** `deepseek/deepseek-v4.1-flash` via openrouter, reasoning effort medium. One attempt is a first proof plus up to 3 repairs on Lean's error messages.
- **Rules:** Lean 4.35 core only; `grind` banned; the checker accepts a proof only if it uses nothing beyond the library given and Lean's standard axioms.
- **Conditions:** *library*: the theorems it rests on in the reference tree are given; *alone*: posted targets with an empty library.
- **Attempts:** 24; tokens in 10.2k (plus 96.3k cached), out 1700.8k; cost $0.70 ($0.029 per attempt).

Theorem ids are the anonymous ids of [worlds/lean-reference.json](../../../worlds/lean-reference.json); statements and proofs are in lean/Reference/.

## Success by level (library)

| depth | theorems | attempts | proved | success per attempt | tokens per attempt |
| --- | --- | --- | --- | --- | --- |
| 2 | 1 | 4 | 3 | 75% | 45.8k |
| 4 | 2 | 8 | 8 | 100% | 2.6k |

## Do targets need their lemmas?

| target | depth | alone | with library |
| --- | --- | --- | --- |
| H6 | 2 | 0/4 | 3/4 |
| H4 | 4 | 0/4 | 4/4 |
| H5 | 4 | 0/4 | 4/4 |

A target proved alone in most attempts is too easy: its lemmas are not needed.

## Every theorem

| id | depth | area | condition | proved | mean turns | tokens per attempt |
| --- | --- | --- | --- | --- | --- | --- |
| H6 | 2 | cross | alone | 0/4 | 4.0 | 133.6k |
| H4 | 4 | B | alone | 0/4 | 4.0 | 133.6k |
| H5 | 4 | B | alone | 0/4 | 4.0 | 133.5k |
| H6 | 2 | cross | library | 3/4 | 3.5 | 45.8k |
| H4 | 4 | B | library | 4/4 | 1.0 | 2.9k |
| H5 | 4 | B | library | 4/4 | 1.0 | 2.4k |
