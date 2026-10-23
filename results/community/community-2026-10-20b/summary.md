# First AI test, OSO vs traditional

**Question:** For the same money, does an OSO community of AI agents solve more targets than a traditional one?

**Answer:** Both communities solved 4 targets for the same money.

![First AI test, OSO vs traditional](figures/progress.svg)

| rules | targets solved | spent | ROI (value per $) | lemmas accepted | duplicated work |
| --- | --- | --- | --- | --- | --- |
| Traditional | 4 of 8 | $0.76 of $1.60 | 154 | 0 | 1 |
| OSO | 4 of 8 | $1.04 of $1.60 | 111 | 3 | 1 |

**Design** (fixed before the run): compared traditional rules and OSO rules · held the same: the same 4 agents, $0.4 each, no personas · measure: targets solved, higher is better · 1 run per side.

**Caveats:**
- One run per side: no verdict either way.
- One OSO run stopped partway and was rerun from the start.

<details><summary>Details</summary>


**Both communities solved 4 targets for the same money.** One OSO run stopped partway and was rerun from the start.

| rules | targets solved | deepest target | spent | value gained | ROI (value per $) | actions | lemmas accepted | duplicated work | trivial | failed attempts | never published |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Traditional | 4 of 8 | 5 | $0.76 of $1.60 | 116 | 154 | 29 | 0 | 1 | 0 | 24 | 1 |
| OSO | 4 of 8 | 5 | $1.04 of $1.60 | 116 | 111 | 44 | 3 | 1 | 0 | 36 | 1 |

- **Agents:** agent 1: `deepseek/deepseek-v4.1-flash`, agent 2: `google/gemini-3.8-flash`, agent 3: `openai/gpt-5.6-terra`, agent 4: `deepseek/deepseek-v4.1-flash`; each with $0.4 at list prices; reasoning effort medium.
- **Each round,** every agent with budget left takes one action: prove a target, or state and prove a new lemma; up to 2 repairs on Lean's errors.
- **Traditional:** lemmas stay private until their author proves a target; the target and the lemmas it rests on are then published and the author takes the bounty. **OSO:** every idea is published at once; mint 1, c = 0.15, α = 0.8.
- **Duplicated work:** a lemma proved again when another agent already had it (privately, under traditional rules), or a target solved twice, for example by two agents in the same round. **Trivial:** one basic tactic proves it; it can be cited but earns no mint. **Agents may pass** when nothing seems worth their budget, and keep the rest.
- **One run per setting:** results vary from run to run; several runs are needed before reading much into a difference.

Runs: community-2026-10-20b-traditional, community-2026-10-20b-oso. Transcripts (with proofs) are private.


</details>
