# Round, try and epoch

A run is made of epochs, and an epoch of rounds. In each round, every lab still working picks one task and gets up to 3 tries at it.

## Round and try

```
                     ROUND 1 (all labs act at once)         ROUND 2
                  ┌──────────────────────────────┐   ┌──────────────────────┐
  Lab 1           │ target A3                    │   │ lemma L2             │
                  │  try 1 ✓                     │   │  try 1 ✗  try 2 ✓    │
                  ├──────────────────────────────┤   ├──────────────────────┤
  Lab 2           │ lemma L1                     │   │ target B5            │
                  │  try 1 ✓                     │   │  (can now cite L1)   │
                  │                              │   │  try 1 ✓             │
                  ├──────────────────────────────┤   ├──────────────────────┤
  Lab 3           │ target X2                    │   │ target X2            │
                  │  try 1 ✗  try 2 ✗  try 3 ✗   │   │  try 1 ✓             │
                  ├──────────────────────────────┤   ├──────────────────────┤
  Lab 4           │ lemma L3                     │   │ (out of money:       │
                  │  try 1 ✗  try 2 ✗  try 3 ✓   │   │  no task)            │
                  └──────────────────────────────┘   └──────────────────────┘
                                 │                              ▲
                                 └── L1 is published, and ──────┘
                                     other labs can use it next round

  Counted so far:   ROUNDS 2    TRIES 12 (8 + 4)
```

- **Round:** a column, one step of time. Every lab still working picks one task, all at once: prove a target, prove a lemma or, where allowed, pass.
- **Try:** one proof attempt checked by Lean (✓ accepted, ✗ rejected). A task gets up to 3 replies from the model: the first attempt and up to 2 repairs after seeing the errors. A reply with no proof, or one turned away for its format before Lean sees it, uses up a reply but is not a try.

This example is made up. L1 is published at once under the shared library and OSO. Under traditional rules it stays private until its author proves a target that rests on it.

A round with fewer labs still counts as a full round (only 3 labs worked in round 2), so rounds show how fast things happen, not how much effort they took.

## Epoch

An **epoch** is one cycle of the funding loop: the funder looks at what each lab earned and sets its share of the next money. The total money stays fixed.

```
  Example: 12 rounds, 3 epochs, f = 0.5
  (half the money split equally, half by earnings in the epoch before)

       EPOCH 1              EPOCH 2              EPOCH 3
    rounds 1–4           rounds 5–8           rounds 9–12
  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
  │ Money shares │     │ Money shares │     │ Money shares │
  │ Lab 1  25%   │     │ Lab 1  42.5% │     │ set from     │
  │ Lab 2  25%   │     │ Lab 2  22.5% │     │ earnings so  │
  │ Lab 3  25%   │     │ Lab 3  22.5% │     │ far          │
  │ Lab 4  25%   │     │ Lab 4  12.5% │     │              │
  └──────┬───────┘     └──────▲──┬────┘     └──────▲───────┘
         │                    │  │                 │
         └── labs earned ─────┘  └─── and again ───┘
             60 / 20 / 20 / 0
```

- **One epoch:** shares are set once, before anyone has earned, so money never moves. Every Lean run so far is one epoch.
- **Several epochs:** money moves towards the labs whose work earned more, and they get to do more. The simulation has an epochs setting.
- **Every round:** the Lean setting `--follow` works this way, so each round is an epoch. It has not been used in a real run yet.

Earnings are smoothed: 0.7 of the old value and 0.3 of the new. In the example the labs start from zero, so the shares after epoch 1 follow those earnings exactly.
