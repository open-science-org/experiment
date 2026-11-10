#!/usr/bin/env python3
"""Flow-back in the labs' own words: on each turn with saved thinking, does the lab think about what a result
gets when another lab's proof uses it? Used by docs/flow-back.md.

Usage: python3 scripts/lean-flowback.py [--sample N]
A rough keyword count over sentences. It does not tell "it earns when others use it" from "it earns nothing
then": the rules lines are quoted both ways. Label a sample by hand (--sample prints matching sentences).
"""
import collections, glob, json, random, re, sys

EXPERIMENTS = ['lean-b5', 'lean-part-a', 'lean-m3', 'lean-hard', 'lean-hard-2']
# A sentence where some other lab uses or builds on a result, and earning, value or flow-back comes up.
OTHERS = re.compile(r'\b(another lab|other labs?|others?|someone|somebody|they|the solver|lab \d)\b[^.?!]{0,80}\b(use[sd]?|using|build[s]? on|cite[sd]?|need[s]?)\b', re.I)
PAY = re.compile(r'\b(earn\w*|flow\w*|share of|value|bounty|paid|get \d+%|\d+% of)\b', re.I)
sample = int(sys.argv[sys.argv.index('--sample') + 1]) if '--sample' in sys.argv else 0

def about_use(text):
    """The first sentence that says what a result gets when others use it, or None."""
    return next((s for s in re.split(r'(?<=[.?!])\s+|\n+', text) if OTHERS.search(s) and PAY.search(s)), None)

turns, hits = collections.defaultdict(collections.Counter), collections.defaultdict(list)
for exp in EXPERIMENTS:
    for f in sorted(glob.glob(f'lean/runs/{exp}-r*/reasoning.jsonl')):
        setup = re.sub(rf'^{exp}-r\d+-', '', f.split('/')[-2])
        acts = [json.loads(l) for l in open(f.replace('reasoning.jsonl', 'actions.jsonl'))]
        for line in open(f):
            x = json.loads(line)
            a = acts[x['action']] if x['action'] < len(acts) else None
            if not a or a['kind'] not in ('lemma', 'target'): continue
            text = ' '.join(t for t in (x.get('reasoning') or []) if t)
            if not text.strip(): continue
            k = (exp, setup, a['kind']); s = about_use(text)
            turns[k]['n'] += 1; turns[k]['use'] += bool(s)
            if s: hits[k].append(s.strip()[:300])

print('| Experiment | Setup | Lemma turns | thinks about others using it | Target turns | thinks about others using it |')
print('| --- | --- | --- | --- | --- | --- |')
for exp in EXPERIMENTS:
    for setup in sorted({s for (e, s, _) in turns if e == exp}):
        L, T = turns[(exp, setup, 'lemma')], turns[(exp, setup, 'target')]
        pct = lambda c: f"{c['use']} ({c['use'] / c['n']:.0%})" if c['n'] else '–'
        print(f"| {exp} | {setup} | {L['n']} | {pct(L)} | {T['n']} | {pct(T)} |")
if sample:
    random.seed(7)
    for k, v in sorted(hits.items()):
        print(f'\n## {k}'); [print('-', s) for s in random.sample(v, min(sample, len(v)))]
