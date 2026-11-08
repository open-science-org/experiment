#!/usr/bin/env python3
"""How often labs' saved thinking mentions flow-back pay, on turns where they proved or tried a lemma.

Usage: python3 scripts/lean-thinking.py <experiment id> <setup> [first run] [last run]
A rough keyword count: check a sample by hand before quoting it. Mentioning the rule is not the same as acting on it.
"""
import json, re, sys
FLOW = re.compile(r'flow(s|ing)? back|flow-back|flows to|keeps? (only )?20|80% (flows|goes)|share of (later|future)|earn when (others|other labs)|paid when', re.I)
exp, setup = sys.argv[1], sys.argv[2]
first, last = (int(sys.argv[3]), int(sys.argv[4])) if len(sys.argv) > 4 else (1, 10)
n = k = 0
for rep in range(first, last + 1):
    base = f'lean/runs/{exp}-r{rep}-{setup}'
    try:
        acts = [json.loads(l) for l in open(f'{base}/actions.jsonl')]
        thinking = [json.loads(l) for l in open(f'{base}/reasoning.jsonl')]
    except FileNotFoundError:
        continue
    for x in thinking:
        a = acts[x['action']] if x['action'] < len(acts) else None
        if not a or a['kind'] != 'lemma': continue
        text = ' '.join(t for t in (x.get('reasoning') or []) if t)
        n += 1; k += bool(FLOW.search(text))
print(f'{exp} {setup}: {n} lemma turns with thinking; {k} ({k / max(n, 1):.0%}) mention flow-back pay')
