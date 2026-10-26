// The model's version. Bump it whenever a change alters what runs produce (not for new optional settings
// that are off by default, or new measures). Every simulation result records the version it ran on, so
// results from an older model are flagged until rerun. The history is in docs/model-versions.md.
export const MODEL_VERSION = 6;

export const MODEL_HISTORY: { version: number; date: string; change: string }[] = [
  { version: 1, date: '2026-10-21', change: 'Random-layer world: every parent required, a fixed chance per level, areas.' },
  { version: 2, date: '2026-10-24', change: 'The idea graph generator (ideas as coin-toss sequences); waste counts all repeated work.' },
  { version: 3, date: '2026-10-24', change: 'Bounties go to ideas among the half resting on the most earlier work, not fixed positions.' },
  { version: 4, date: '2026-10-25', change: 'Knowledge reward: paid per new bit when an idea is published, flowing back with α0 (= α by default); on in the simple model (1 per bit).' },
  { version: 5, date: '2026-10-25', change: 'The flat mint is off everywhere and the knowledge reward (1 per new bit) is on in every model, including the full model. New: the model step by step.' },
  { version: 6, date: '2026-10-26', change: 'Rivals are counted from published work only: an idea resting on unpublished work shows no rivals, since nobody can see who holds it privately.' },
];
