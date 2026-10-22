# Sharing isn't free: absorbing costs and wrong results

**Question:** Does OSO's lead survive when absorbing results costs compute, or results are sometimes wrong?

**Answer:** Best: OSO, absorb cost 0, error rate 0, 7.9. Best traditional: Traditional, absorb cost 0.5, error rate 0, 5.7. Clear difference.

![Sharing isn't free: absorbing costs and wrong results](figures/compare.svg)

| setting | absorb cost | error rate | frontier | reach L7 | cost | ROI (value per spend) |
| --- | --- | --- | --- | --- | --- | --- |
| Traditional | 0 | 0 | 5.7 ± 1.2 | 0.35 | 957 ± 161 | 0.22 ± 0.18 |
| Traditional | 0 | 0.05 | 5.1 ± 1.0 | 0.15 | 1061 ± 122 | 0.15 ± 0.11 |
| Traditional | 0 | 0.15 | 4.5 ± 0.9 | 0.02 | 989 ± 234 | 0.09 ± 0.05 |
| Traditional | 0.25 | 0 | 5.5 ± 1.1 | 0.27 | 975 ± 167 | 0.21 ± 0.19 |
| Traditional | 0.25 | 0.05 | 5.1 ± 1.0 | 0.12 | 954 ± 114 | 0.14 ± 0.11 |
| Traditional | 0.25 | 0.15 | 4.5 ± 0.9 | 0.01 | 895 ± 0 | 0.08 ± 0.05 |
| Traditional | 0.5 | 0 | 5.7 ± 1.1 | 0.35 | 996 ± 134 | 0.22 ± 0.18 |
| Traditional | 0.5 | 0.05 | 5.2 ± 1.0 | 0.15 | 976 ± 192 | 0.16 ± 0.17 |
| Traditional | 0.5 | 0.15 | 4.4 ± 1.0 | 0.01 | 585 ± 0 | 0.09 ± 0.13 |
| Traditional | 1 | 0 | 5.5 ± 1.1 | 0.30 | 1009 ± 170 | 0.20 ± 0.16 |
| Traditional | 1 | 0.05 | 5.2 ± 0.9 | 0.14 | 1008 ± 128 | 0.14 ± 0.11 |
| Traditional | 1 | 0.15 | 4.5 ± 1.0 | 0.03 | 1070 ± 74 | 0.09 ± 0.06 |
| OSO (immediate) | 0 | 0 | 7.9 ± 0.2 | 1.00 | 485 ± 141 | 1.44 ± 0.48 |
| OSO (immediate) | 0 | 0.05 | 7.6 ± 0.5 | 1.00 | 568 ± 178 | 0.86 ± 0.54 |
| OSO (immediate) | 0 | 0.15 | 7.2 ± 0.5 | 0.96 | 629 ± 188 | 0.36 ± 0.30 |
| OSO (immediate) | 0.25 | 0 | 7.8 ± 0.4 | 1.00 | 627 ± 173 | 1.06 ± 0.47 |
| OSO (immediate) | 0.25 | 0.05 | 7.4 ± 0.5 | 0.99 | 675 ± 222 | 0.63 ± 0.52 |
| OSO (immediate) | 0.25 | 0.15 | 7.1 ± 0.5 | 0.92 | 781 ± 215 | 0.26 ± 0.23 |
| OSO (immediate) | 0.5 | 0 | 7.7 ± 0.5 | 0.99 | 626 ± 228 | 1.01 ± 0.59 |
| OSO (immediate) | 0.5 | 0.05 | 7.2 ± 0.6 | 0.92 | 679 ± 261 | 0.56 ± 0.50 |
| OSO (immediate) | 0.5 | 0.15 | 7.0 ± 0.6 | 0.84 | 759 ± 250 | 0.24 ± 0.24 |
| OSO (immediate) | 1 | 0 | 7.3 ± 0.7 | 0.87 | 663 ± 260 | 0.69 ± 0.61 |
| OSO (immediate) | 1 | 0.05 | 6.8 ± 0.7 | 0.72 | 695 ± 250 | 0.29 ± 0.31 |
| OSO (immediate) | 1 | 0.15 | 6.6 ± 0.6 | 0.62 | 744 ± 255 | 0.15 ± 0.23 |

**Design** (fixed before the run): compared absorb cost × error rate × traditional or OSO · held the same: the field, agents and budget · measure: hardest level published, higher is better · 100 runs per row.

**Caveats:**
- A simulation with guessed parameters: it shows how the rules play out, not that they work.

<details><summary>Details</summary>

Taking up a published result costs `absorbCost` compute, and each proof is wrong with chance `errorRate`; results built on a wrong result are wrong, and a target check rejects them and retracts the wrong results. Where does OSO's advantage shrink or vanish? Default world.

Values are mean ± standard deviation over runs.

| setting | absorb cost | error rate | frontier | reach L7 | cost | ROI (value per spend) | spend | targets solved | absorb spend | rejected targets | retracted |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 0 | 0 | 5.7 ± 1.2 | 0.35 | 957 ± 161 | 0.22 ± 0.18 | 1194 ± 11 | 4.2 ± 0.9 | 0.00 ± 0.00 | 0.0 ± 0.0 | 0.0 ± 0.0 |
| Traditional | 0 | 0.05 | 5.1 ± 1.0 | 0.15 | 1061 ± 122 | 0.15 ± 0.11 | 1194 ± 2 | 3.6 ± 0.9 | 0.00 ± 0.00 | 1.4 ± 1.2 | 3.6 ± 3.7 |
| Traditional | 0 | 0.15 | 4.5 ± 0.9 | 0.02 | 989 ± 234 | 0.09 ± 0.05 | 1194 ± 2 | 3.0 ± 0.8 | 0.00 ± 0.00 | 3.9 ± 1.9 | 9.8 ± 5.8 |
| Traditional | 0.25 | 0 | 5.5 ± 1.1 | 0.27 | 975 ± 167 | 0.21 ± 0.19 | 1194 ± 7 | 4.1 ± 0.9 | 0.04 ± 0.01 | 0.0 ± 0.0 | 0.0 ± 0.0 |
| Traditional | 0.25 | 0.05 | 5.1 ± 1.0 | 0.12 | 954 ± 114 | 0.14 ± 0.11 | 1195 ± 1 | 3.6 ± 0.9 | 0.04 ± 0.01 | 1.6 ± 1.4 | 3.7 ± 3.8 |
| Traditional | 0.25 | 0.15 | 4.5 ± 0.9 | 0.01 | 895 ± 0 | 0.08 ± 0.05 | 1195 ± 1 | 3.0 ± 0.9 | 0.03 ± 0.01 | 3.7 ± 2.0 | 9.4 ± 6.1 |
| Traditional | 0.5 | 0 | 5.7 ± 1.1 | 0.35 | 996 ± 134 | 0.22 ± 0.18 | 1193 ± 11 | 4.2 ± 0.9 | 0.09 ± 0.03 | 0.0 ± 0.0 | 0.0 ± 0.0 |
| Traditional | 0.5 | 0.05 | 5.2 ± 1.0 | 0.15 | 976 ± 192 | 0.16 ± 0.17 | 1192 ± 30 | 3.6 ± 0.9 | 0.08 ± 0.03 | 1.6 ± 1.3 | 3.9 ± 3.8 |
| Traditional | 0.5 | 0.15 | 4.4 ± 1.0 | 0.01 | 585 ± 0 | 0.09 ± 0.13 | 1192 ± 30 | 2.9 ± 1.0 | 0.05 ± 0.02 | 3.6 ± 1.9 | 10.0 ± 6.0 |
| Traditional | 1 | 0 | 5.5 ± 1.1 | 0.30 | 1009 ± 170 | 0.20 ± 0.16 | 1195 ± 2 | 4.0 ± 0.9 | 0.15 ± 0.04 | 0.0 ± 0.0 | 0.0 ± 0.0 |
| Traditional | 1 | 0.05 | 5.2 ± 0.9 | 0.14 | 1008 ± 128 | 0.14 ± 0.11 | 1194 ± 2 | 3.7 ± 0.8 | 0.13 ± 0.04 | 2.3 ± 1.5 | 4.6 ± 3.9 |
| Traditional | 1 | 0.15 | 4.5 ± 1.0 | 0.03 | 1070 ± 74 | 0.09 ± 0.06 | 1194 ± 2 | 3.0 ± 0.9 | 0.10 ± 0.04 | 5.4 ± 2.2 | 12.4 ± 6.5 |
| OSO (immediate) | 0 | 0 | 7.9 ± 0.2 | 1.00 | 485 ± 141 | 1.44 ± 0.48 | 849 ± 207 | 6.9 ± 0.5 | 0.00 ± 0.00 | 0.0 ± 0.0 | 0.0 ± 0.0 |
| OSO (immediate) | 0 | 0.05 | 7.6 ± 0.5 | 1.00 | 568 ± 178 | 0.86 ± 0.54 | 1061 ± 188 | 6.1 ± 1.0 | 0.00 ± 0.00 | 3.2 ± 2.0 | 9.2 ± 6.8 |
| OSO (immediate) | 0 | 0.15 | 7.2 ± 0.5 | 0.96 | 629 ± 188 | 0.36 ± 0.30 | 1183 ± 49 | 4.9 ± 1.0 | 0.00 ± 0.00 | 7.0 ± 2.2 | 20.8 ± 8.1 |
| OSO (immediate) | 0.25 | 0 | 7.8 ± 0.4 | 1.00 | 627 ± 173 | 1.06 ± 0.47 | 1020 ± 187 | 6.5 ± 0.8 | 0.17 ± 0.03 | 0.0 ± 0.0 | 0.0 ± 0.0 |
| OSO (immediate) | 0.25 | 0.05 | 7.4 ± 0.5 | 0.99 | 675 ± 222 | 0.63 ± 0.52 | 1121 ± 152 | 5.5 ± 1.2 | 0.16 ± 0.03 | 2.8 ± 1.8 | 7.4 ± 6.2 |
| OSO (immediate) | 0.25 | 0.15 | 7.1 ± 0.5 | 0.92 | 781 ± 215 | 0.26 ± 0.23 | 1192 ± 20 | 4.4 ± 0.9 | 0.16 ± 0.02 | 5.6 ± 2.1 | 16.5 ± 8.5 |
| OSO (immediate) | 0.5 | 0 | 7.7 ± 0.5 | 0.99 | 626 ± 228 | 1.01 ± 0.59 | 1007 ± 217 | 6.2 ± 1.1 | 0.33 ± 0.07 | 0.0 ± 0.0 | 0.0 ± 0.0 |
| OSO (immediate) | 0.5 | 0.05 | 7.2 ± 0.6 | 0.92 | 679 ± 261 | 0.56 ± 0.50 | 1128 ± 151 | 5.3 ± 1.2 | 0.31 ± 0.05 | 2.6 ± 1.7 | 7.0 ± 6.1 |
| OSO (immediate) | 0.5 | 0.15 | 7.0 ± 0.6 | 0.84 | 759 ± 250 | 0.24 ± 0.24 | 1188 ± 34 | 4.3 ± 1.0 | 0.31 ± 0.03 | 5.8 ± 2.2 | 16.5 ± 7.8 |
| OSO (immediate) | 1 | 0 | 7.3 ± 0.7 | 0.87 | 663 ± 260 | 0.69 ± 0.61 | 1076 ± 200 | 5.4 ± 1.4 | 0.41 ± 0.03 | 0.0 ± 0.0 | 0.0 ± 0.0 |
| OSO (immediate) | 1 | 0.05 | 6.8 ± 0.7 | 0.72 | 695 ± 250 | 0.29 ± 0.31 | 1182 ± 68 | 4.3 ± 1.2 | 0.41 ± 0.03 | 2.5 ± 1.6 | 6.3 ± 5.5 |
| OSO (immediate) | 1 | 0.15 | 6.6 ± 0.6 | 0.62 | 744 ± 255 | 0.15 ± 0.23 | 1186 ± 56 | 3.4 ± 1.1 | 0.41 ± 0.02 | 5.5 ± 2.2 | 14.1 ± 6.9 |

Code: commit `88a4b32` (with uncommitted changes). Experiment: [config/experiments/costly-sharing.yaml](../../config/experiments/costly-sharing.yaml). Command: `npm run sim -- costly-sharing --seeds 100 --save`. Every run: `runs.jsonl`; every parameter: `config.json`.

</details>
