# The Lean problem set

The problems for the AI-model tests (see [the design](../docs/design.md)). Agents prove theorems in Lean 4.35.0, with Lean's core library and no Mathlib; Lean checks every proof, and a proof records exactly which earlier theorems it uses.

**Public here:** the definitions every agent sees ([Problems/Defs.lean](Problems/Defs.lean)) and the posted targets ([Problems/Targets.lean](Problems/Targets.lean)). Three areas: a number sequence (A), sorting (B) and 2 × 2 integer matrices (C), with targets that join areas.

**Private:** the reference proofs, the lemma tree they give, and agents' transcripts. They would give agents the answers, and models trained later could memorize them, so they are not in this repository (see `.gitignore`). The shape of the reference tree, with anonymous ids, is public in [worlds/lean-reference.json](../worlds/lean-reference.json).

| Target | Area | Statement | Bounty |
| --- | --- | --- | --- |
| C3 | C | det(xy) = det(x)·det(y) | 4 |
| A3 | A | u(m) divides u(m·k) | 8 |
| C4 | C | x^(m·n) = (x^m)^n | 16 |
| X1 | A + C | Cassini: u(n+1)² − u(n+2)·u(n) = (−3)^n | 16 |
| B3 | B | insertion sort returns a sorted list with the same counts | 32 |
| B5 | B | merge sort and insertion sort agree | 64 |
| X2 | A + B | sorting u(0), …, u(n−1) leaves them unchanged | 64 |
| A5 | A | strong divisibility: gcd(u(m), u(n)) = u(gcd(m, n)) | 256 |

**Rules for agents:** core lemmas and tactics may be cited freely (they play the role of existing literature). Not allowed: `grind` (it proves the polynomial identities by brute force and would flatten the tree), `sorry`, `native_decide`, search tactics, commands that run code, and new declarations.

**The pilot** (`npm run pilot`, in [src/lean/](../src/lean/)) measures how hard each theorem is for a real model:

```sh
npm run pilot -- selftest                       # every reference proof through the checker
npm run pilot -- calibrate --dry-run            # how many attempts and calls a run makes
npm run pilot -- calibrate                      # the real run; needs an API key in .env
```

- **An attempt** is a first proof plus up to three repairs, each sent back with Lean's errors. Each theorem is tried with its lemmas given as a library, and each target also alone, to test whether it really needs them.
- **The checker** ([src/lean/checker.ts](../src/lean/checker.ts)) imports only the public definitions and states the agent's library as axioms. `#print axioms` then lists exactly which library theorems a proof used: the soundness check and the attribution in one. A check takes about 0.3 seconds. All 42 reference proofs pass, using exactly the theorems the reference tree says.
- **Transcripts** contain proofs, so they stay in `lean/runs/` (private); public summaries use anonymous ids.
