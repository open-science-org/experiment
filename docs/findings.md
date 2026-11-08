# Findings so far

Last updated: 2026-11-08. Plain summaries; each links to its full result. **Finding** means it was the measure fixed in advance; **lead** means it was noticed afterwards or is from a small or exploratory run.

## Simulation

- **Finding: sharing at once is the big saving.** To solve half the targets, traditional research needs 3.5× to 5.7× the money OSO needs, across five difficulties, mostly because work is repeated. [Overview](../README.md)
- **Finding: flow-back makes agents choose to share.** When agents decide whether to publish, they share 24% of their ideas at α 1 and 66% at α 0.2. With the rules deciding, α changes little. [Overview](../README.md)
- **Lead: the knowledge reward matters once agents choose and money follows earnings** (α 0.8: 1.8 of 2 targets with it, 0.4 without). [Result](../results/knowledge-reward-by-step/summary.md)

## AI agents on Lean problems

- **Finding: lemmas help weaker models:** with the lemmas a target needs, 3 of 5 models proved targets they never proved alone (DeepSeek: 4 of 16 tries alone, 12 of 16 with lemmas). Claude Opus and Sonnet proved everything alone. [Panel](../results/pilot/panel-2026-10-19/summary.md)
- **Finding, OSO against traditional (5 runs each): about the same** in hard targets (OSO 2.0 of 4, traditional 1.6). Lead: traditional proved the same work twice about 20 times a run, OSO about 2. [Race](../results/community/race-cheap/summary.md)
- **Finding, Spend all, labs cannot stop (20 runs per setup):** targets proved about the same (OSO α 0.2 against shared library +0.4, 95% range −0.1 to +0.9). **Lead:** the more value flowed back, the more lemmas labs proved (7.2 → 13.8 a run) and the more they built on each other. [Results](ai-agent-results.md)
- **Finding, May quit, labs may stop early (10 runs per setup):** targets proved about the same (about 5 of 8 everywhere; OSO α 0.2 against shared library +0.0, range −0.8 to +0.8). Labs stopped after 5 to 8 rounds with half their money left. With flow-back they proved more lemmas (α 0.2: +2.2 a run, range +1.4 to +3.0). [Results](ai-agent-results.md)
- **Finding, Fair-prompt check (10 runs per setup, fair prompts, more money than Spend all):** B5 much closer than in Spend all (OSO α 0.2: 4 of 10, shared library 3 of 10; difference +0.10, range −0.28 to +0.45), so the B5 question is open. Lemmas about doubled with flow-back (+8.7 a run, range +3.4 to +14.0). Labs' thinking often mentions flow-back pay; whether it drives their choices is not shown. [Results](ai-agent-results.md)

- **Finding, labs choose what to publish (M3, 10 runs per setup):** AI labs published nearly every lemma at every α (99–100%; the simulation predicted 17% at α 1 and 93% at α 0.2). Their thinking shows why: the new-result reward is paid only on publishing, and they rarely weigh helping rivals. **Lead:** B5 proved in 8 of 10 runs at α 0.2, 4 of 10 at α 1. [Results](ai-agent-results.md)

**Correction (2026-11-08):** every Lean run so far split flow-back by money spent instead of by graph weights (lines saved). Only 1–5% of earnings would have gone elsewhere and the counted measures are unaffected, but labs saw slightly wrong earnings. [Details](ai-agent-results.md)

**Not yet tested:** AI labs choosing when keeping is worth something (the new-result reward off), other models, and real mathematics designed by others. See the roadmap.
