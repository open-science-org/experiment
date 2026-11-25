# Handoff notes

## 2026-11-24 17:13 · Deep Fermat set and run, live page graphs, step matcher, stay-awake
Session: c47e3b16-8be4-4ac2-81b3-3c703bdb6a60 · branch master · last commit 9408854

**Done**
- Deep problem set `--problems deep`, "Peano to Fermat": its own numbers, no Mathlib, one target P1 (Fermat's little theorem), depth 11, 95 hidden results (c67808a). All reference proofs pass; stand-in labs solve it in round 27.
- Paid run `deep-fermat-1` (OSO α 0.2, 4 DeepSeek V4.1 Flash, $2 each, 100 rounds) is RUNNING on the Mac since 2026-11-23 23:07, streaming every minute. At 17:13: round 47, about 76 lemmas, $1.7 spent, no target try. The labs are stuck on (k+1)·C(n+1,k+1) = (n+1)·C(n,k): 15+ failed tries.
- Empty-reply test done and pushed (68ecb02): medium, low and capped thinking all leave 71–75% of replies cut off; the thinking cap seems ignored.
- `--think N` and `--only` options; the local lab sees library lemmas (f4af264).
- Live page (site repo): About this run; problems and lemmas plots; one DAG where proved steps take the lab's colour and off-map lemmas sit in a lane (site 16eda69, UNPUSHED).
- `scripts/match-steps.ts` (9408854, UNPUSHED): Lean checks which hidden steps a lab lemma gives (apply, with_reducible, positive #print axioms only, -DmaxErrors). Runs in live-push.sh each minute; writes <run dir>/matches.json. Works on deep and big sets.
- Stay-awake: `src/lean/awake.ts`. Every run uses caffeinate -i -s and warns on battery (screen + text to OSO_TEXT_TO in .env) (bdab2d2). live-push.sh: SSH timeouts so a push can't hang and hold the lock (b8f60da).
- Goedel local lab run-4 finished: 3 lemmas accepted (PRs #11–13); the 1052 target failed.

**Decisions**
- No 50-deep set: chains grow slowly with size; padding would be fake. Fermat at depth 11 was approved.
- Push rule (memory): results push at once, in their own commit; code and site wait for "push".
- Two plots, not a second y-axis.

**Open threads**
1. Push 9408854 (experiment) and 16eda69 (site) when the user says "push".
2. When deep-fermat-1 ends: text the user, write the TL;DR + findings, push the results. Report whether any lab broke the binomial identity.
3. Offered, waiting for a go: a traditional comparison run on the deep set ($8 max); running paid runs on GitHub Actions (the Mac is for testing).
4. Older offers: fix the stale join issue #2; DeepSeek lab on 1052 ($2); remove the lab-2 worktree; Pages auto-retry.

**Watch out**
- The Mac was on battery at 15:11: the run stalls when it sleeps (rounds 8–15 took 12 hours). The deep-fermat-1 run started before awake.ts, so it gets no battery warning; a `caffeinate -s -w 7730` hold was added by hand.
- Matches skip steps proved in another shape or split over several lemmas: grey means "not proved in this form".
- Ollama Goedel is idle; no local lab running.

## 2026-11-08 17:32 · Lean M1–M3 done, app rework, flow-back fix, money follows earnings, epochs
Session: 25a0cabb-cf52-4331-b873-073049b023d5 · branch master · last commit 6a71d76

**Done**
- App: menu grouped (Simulation, AI agents (Lean), About); Home page (question, running now, money, milestones, findings); Money page with cost per experiment (7fc60c9, 9d0e174, 3c4f3cd).
- Lean "labs choose what to publish" (PUBLISH yes/no) and a proof-length knowledge reward, reviewed twice (170dadd, e245416, c972b30).
- Experiments renamed: Spend all (lean-main-b), May quit (lean-part-a), Fair-prompt check (lean-b5), Labs choose what to publish (lean-m3) (3f7631b).
- Results written up in docs/ai-agent-results.md 4a–4c with 95% ranges from scripts/lean-estimates.py (8da8dd8, afecc49).
- Flow-back now split by graph weights from lines saved (361b9e7); the earlier money-spent split is documented as a correction, replayed by scripts/lean-resplit.ts (07e4d0e).
- --follow f: money follows earnings in Lean (a0e8900). Simulation epochs setting and result results/epochs (a14577c, 6a71d76).
- Pushed up to f24b640 only.

**Decisions**
- Estimates with 95% ranges, no clear/not-clear verdicts.
- Lemma counts leave out trivial ones.
- Labs choose: 99–100% published at every α, because the knowledge reward pays only on publishing.

**Open threads**
1. Core test: labs choose with the knowledge reward off, α 1 vs α 0.2, 10 each (~$12). Needs the user's go; write the plan in notes first.
2. B5 at low α as a planned measure (~$16).
3. M4b: weak OSO community vs one strong model, same money; check first that the problems are hard enough.
4. Push the local commits since f24b640 when the user says.

**Watch out**
- Untracked results (bench, m3-smoke, pilot-societies-1, planner-trial-*) are not committed.
- Credit is about $49.
- The viewer runs on :8791 (node src/viewer/server.ts); restart it after server.ts or names.ts changes.

## 2026-10-25 19:29 · model v5, step by step, deep graphs, docs cut, UI fixes
Session: 325534a2-fc59-4bd5-9a6c-c5af07c5d3b1 · branch master · last commit 5d5841f

**Done**
- Model versioning: `src/engine/version.ts`, `docs/model-versions.md`; every result card has `modelVersion`; History has a Model column, Results flags older models (79c260a).
- v4 knowledge reward: `rules.mintPerBit` (pay per new bit on publication), `rules.alpha0` (its absorption rate, null = α) (79c260a). v5: flat mint off everywhere, knowledge reward 1 per bit everywhere (cd9fb92).
- Measures: knowledge found / published / per money, in bits (10c7482).
- Step by step tab on New and Equations (`STEPS`, `withStep` in `src/viewer/design.ts`, `docs/equations-steps.md`): 1 simple, 2 agents choose, 3 f = 0.5, 4 agent kinds, 5 gamer + validation; step 5 = full model's agents and mechanisms (5d5841f). Results view "sharing and this measure, by α" for steps 2–5 (5a1854d).
- Generator option `newBits` (each step equally hard); deep sweeps at 10/20/40/80 levels; depth meta-analysis: traditional ÷ OSO 7.6× → 14.9× (99f92ba, 8d9bed7).
- Presets renamed `example-deep-field`, `example-narrow-stages`, `example-tightly-linked`; old reports archived in `reports/earlier/*-2026-10-25` (eea61cd).
- Docs cut from ~21,400 to ~9,600 words: README, design.md, simulator.md (now a code guide) (7c2d388).
- UI fixes: one-chain chart and answer, route aliases, Live panels in society colours, meta-analysis labels (`basedOn`) (682761f, 2f2d184, 64ab334).
- All results rerun at v5; pushed up to 1184e6b. The 10 commits since are local.

**Decisions**
- Flat mint off; the knowledge reward replaces it (gaming earns nothing; it removed a spam-funded concentration that propped up traditional in the full model).
- From step 2, β is an outcome (agents choose), not a setting.
- Presets are examples, not evidence.
- Every experiment includes a low α (0.2) society.
- Saved experiment YAMLs carry their own fixed settings; when fixed settings change, update the saved files too.

**Open threads**
1. Push the 10 local commits when the user says so.
2. Offered, not answered: a "fund one lab heavily" traditional baseline (money concentration reduces repeated work).
3. Offered: make scaling meta-analyses interactive; chart thumbnails on Results cards; interactive charts on preset reports.
4. Offered: relabel the log–log slope table as "× per doubling".
5. Waste is higher (51–58%) when agents choose than with imposed sharing (31%); worth a look.
6. Depth gap exceeds 12× at 80 levels; cause not checked.
7. Older open items in `../notes/experiment.md` (per-idea α, averaging over many graphs, AI tests at scale, collaborator update).

**Watch out**
- Never use `rm` (denied); move files to the scratchpad instead.
- The viewer server dies on restart from some shells; start it detached: `nohup caffeinate -i node --env-file-if-exists=.env src/viewer/server.ts > /tmp/claude-501/viewer.log 2>&1 & disown`.
- Puppeteer checks: hash-only navigation does not reload the page; load `about:blank` first.

