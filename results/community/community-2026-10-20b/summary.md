# Real agents, OSO vs traditional: community-2026-10-20b

**Both communities solved 4 targets for the same money.** The traditional and OSO communities ran one after the other on 2026-10-20; an earlier OSO run stopped partway (kept privately) and was rerun from the start.

![Targets solved for the money](figures/progress.svg)

| rules | targets solved | deepest target | spent | actions | lemmas accepted | duplicated work | trivial | failed attempts | never published |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 4 of 8 | 5 | $0.76 of $1.60 | 29 | 0 | 1 | 0 | 24 | 1 |
| OSO | 4 of 8 | 5 | $1.04 of $1.60 | 44 | 3 | 1 | 0 | 36 | 1 |

- **Agents:** lab 1: `deepseek/deepseek-v4.1-flash`, lab 2: `google/gemini-3.8-flash`, lab 3: `openai/gpt-5.6-terra`, lab 4: `deepseek/deepseek-v4.1-flash`; each with $0.4 at list prices; reasoning effort medium.
- **Each round,** every lab with budget left takes one action: prove a target, or state and prove a new lemma; up to 2 repairs on Lean's errors.
- **Traditional:** lemmas stay private until their author proves a target; the target and the lemmas it rests on are then published and the author takes the bounty. **OSO:** every result is published at once; mint 1, c = 0.15, α = 0.8.
- **Duplicated work:** a lemma proved again when another lab already had it (privately, under traditional rules), or a target solved twice, for example by two labs in the same round. **Trivial:** one basic tactic proves it; it can be cited but earns no mint. **Labs may pass** when nothing seems worth their budget, and keep the rest.
- **One run per setting:** results vary from run to run; several runs are needed before reading much into a difference.

Runs: community-2026-10-20b-traditional, community-2026-10-20b-oso. Transcripts (with proofs) are private.
