# Handoff notes

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
