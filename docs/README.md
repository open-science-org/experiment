# How it works

**The question:** for the same money, does research get further when ideas are shared at once and credit flows back to what they built on (OSO), than under traditional rules?

**One design, two ways to run it.** Every test has the same parts: a tree of ideas to find, a team of agents, a budget, and the rules. Traditional research and OSO differ only in the rules.

| | Simulation | AI models |
| --- | --- | --- |
| The ideas | made-up ideas in a tree | real theorems in Lean |
| Who does the work | simple formula agents | AI models (Claude, GPT, DeepSeek, …) |
| Does an attempt work? | a dice roll | Lean checks the proof |
| Cost | free, 100 runs in seconds | real money per call |

**The two sets of rules:**
- **Traditional:** ideas stay private until a big piece of work is finished. The author keeps all the credit.
- **OSO:** every idea is published at once. Each idea absorbs a share α of the credit for its author (0.8), called the absorption rate; the rest flows back to the ideas it built on.

**What a test measures:** how far the team gets (the hardest idea found), how many targets it solves, and how much money that takes.

**Every test is planned before it runs:** the question, what is compared, what stays the same, and the one main number. The answer is worked out from that number, never written by hand.

## Words

One word for each idea, used everywhere in this repository.

| Word | Meaning | Not |
| --- | --- | --- |
| **idea** | a node of the tree: something to find, built on earlier ideas. In Lean, a theorem or lemma | result, node |
| **target** | an idea with a bounty | |
| **bounty** | the reward posted on an idea | prize, reward |
| **mint** | the tokens each new idea earns its author | |
| **attempt** | one go at an idea; it costs money and works with some chance | try |
| **budget** / **money** | the total a funder spends / what an attempt costs | compute |
| **publish** | make an idea public; **sharing** is how much agents publish | |
| **take up** | learn a published idea so you can build on it; the trait is **reuse** | absorb |
| **flow-back** | credit passing from an idea to the ideas it built on | waterfall |
| **link weight** | how much an idea owes each parent | attribution weight |
| **level** | how far an idea is from the start; higher is harder | depth |
| **agent** | who does the work: a formula or an AI model | lab |
| **result** | what a test produces (a result card, the Results page) | |

## Read more

- [Equations](equations.md): every rule as a formula, on one page.
- [The full design](design.md): every part defined once, for both kinds of test.
- [Not yet measured](design.md#12-not-yet-measured): what the tests still use a stand-in or a guess for.
- [The simulation in detail](simulator.md): the agents, one round step by step, how agents decide, and what the results say.
- [The default settings](../config/scenarios/default.yaml), each with a comment.
- [The Lean problems](../lean/README.md): the AI-model tests.
- [The repository](../README.md): commands, layout and the app.
