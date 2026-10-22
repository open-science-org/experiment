# How it works

**The question:** for the same money, does research get further when results are shared at once and credit flows back to what they built on (OSO), than under traditional rules?

**One design, two ways to run it.** Every test has the same parts: a tree of results to find, a team of agents, a budget, and the rules. Traditional research and OSO differ only in the rules.

| | Simulation | AI models |
| --- | --- | --- |
| The results | made-up results in a tree | real theorems in Lean |
| Who does the work | simple formula agents | AI models (Claude, GPT, DeepSeek, …) |
| Does a try work? | a dice roll | Lean checks the proof |
| Cost | free, 100 runs in seconds | real money per call |

**The two sets of rules:**
- **Traditional:** results stay private until a big piece of work is finished. The author keeps all the credit.
- **OSO:** every result is published at once. The author keeps a share α of the credit (0.8); the rest flows back to the results it built on.

**What a test measures:** how far the team gets (the hardest result found), how many targets it solves, and how much money that takes.

**Every test is planned before it runs:** the question, what is compared, what stays the same, and the one main number. The answer is worked out from that number, never written by hand.

## Read more

- [Equations](equations.md): every rule as a formula, on one page.
- [The full design](design.md): every part defined once, for both kinds of test.
- [Not yet measured](design.md#12-not-yet-measured): what the tests still use a stand-in or a guess for.
- [The simulation in detail](simulator.md): the agents, one round step by step, how agents decide, and what the results say.
- [The default settings](../config/scenarios/default.yaml), each with a comment.
- [The Lean problems](../lean/README.md): the AI-model tests.
- [The repository](../README.md): commands, layout and the app.
