# Cheap AI models, OSO vs traditional

**Question:** With the cheapest model, does an OSO community of AI labs solve more of the hard targets than a traditional one, for the same money?

**Answer:** No clear difference: OSO 2.0, traditional 1.6 targets that count (5 runs each).

| rules | targets that count | all targets | spent | work done twice | used another lab's result |
| --- | --- | --- | --- | --- | --- |
| Traditional | 1.6 ± 0.5 of 4 | 4.2 ± 0.8 of 8 | $0.34 | 20.4 ± 15.3 | 0.0 ± 0.0 |
| OSO | 2.0 ± 0.0 of 4 | 5.2 ± 0.4 of 8 | $0.28 | 2.4 ± 0.9 | 6.4 ± 0.5 |

**Design** (fixed before the run): compared traditional rules and OSO rules · held the same: four DeepSeek V4.1 Flash labs (two foundation builders, a target racer, a neutral lab), $0.15 each, 12 posted conjectures, up to 30 rounds · measure: targets solved, counting A3, X2, B5, A5, higher is better · 5 runs per side. Cost: $3.10 at list prices.

**Caveats:**
- Counted targets: those DeepSeek never proved alone in the pilot but did with lemmas; neither side reached B5 or A5.
- One model and one small problem set; 4 traditional actions were lost to dropped connections, none on the OSO side.
- Budgets were not binding: the communities spent 52% of theirs on average, because labs passed.

<details><summary>Details</summary>

![Counted targets solved for the money](figures/progress.svg)

**Exploratory** (not fixed in advance): mean spend at which a run had k counted targets solved.

| counted targets | traditional | OSO |
| --- | --- | --- |
| 1 | $0.13 (5 of 5 runs) | $0.05 (5 of 5 runs) |
| 2 | $0.24 (3 of 5 runs) | $0.13 (5 of 5 runs) |

## The design, fixed in advance

Fixed before the runs (2026-10-20). Model: DeepSeek V4.1 Flash for every lab, so labs differ only by persona. Counted targets: the posted targets DeepSeek never proved alone in the pilot but did prove with their lemmas (A3, X2, B5, A5); X1 (not proved even with lemmas) and C3, C4, B3 (provable alone) are warm-ups. Posted conjectures: the counted targets' direct prerequisites in the reference tree, plus the whole chain under A5. Measure: counted targets solved for the same budget, mean over 5 runs per side, verdict against two standard errors.

- **Counted targets:** A3, X2, B5, A5. The others are warm-ups: solved, they are reported but do not count.
- **Labs:** lab 1: `deepseek/deepseek-v4.1-flash` as Foundation builder; lab 2: `deepseek/deepseek-v4.1-flash` as Foundation builder; lab 3: `deepseek/deepseek-v4.1-flash` as Target racer; lab 4: `deepseek/deepseek-v4.1-flash` as Neutral. The same labs and personas on both sides.
- **Budget:** $0.15 per lab at list prices; up to 30 rounds. **Posted conjectures:** 12, bounty 1 each; their ids (K1, …) are neutral, and their statements are given to the labs but not listed here.
- **Rules:** traditional: results private until their lab proves a target, then published with it; OSO: everything published at once, α = 0.8, c = 0.15, mint 1.

## Every run

| run | traditional: counted | spent | OSO: counted | spent | traditional duplicated | OSO duplicated | OSO built on others |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 1 | $0.34 | 2 | $0.39 | 8 | 3 | 6 |
| 2 | 1 | $0.42 | 2 | $0.24 | 42 | 3 | 7 |
| 3 | 2 | $0.18 | 2 | $0.21 | 6 | 2 | 6 |
| 4 | 2 | $0.41 | 2 | $0.27 | 16 | 3 | 7 |
| 5 | 2 | $0.32 | 2 | $0.31 | 30 | 1 | 6 |

Transcripts, with every proof, are private.


</details>
