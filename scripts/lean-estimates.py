#!/usr/bin/env python3
"""Estimates for the Lean experiments, from the raw runs (lean/runs/<id>-r<rep>-<setup>/).

Usage: python3 scripts/lean-estimates.py <experiment id> [setups, comma-separated] [base setup]
Means with 95% ranges (Student t); differences against the base setup (runs not paired, degrees of freedom
from the smaller group, a cautious choice); rates with Wilson ranges and differences with Newcombe ranges.

Definitions:
- lemmas: accepted lemma actions, without those the checker marked trivial (they earn nothing);
- rounds a lab worked: the last round in which it took an action that was not a pass and not empty;
- built on another lab: results whose proof used another lab's result, counting only the first proof of each statement;
- never passed: share of labs that did not pass in the run;
- lemmas cited later: first proofs of lemmas, not trivial, that some other result's proof used;
- median lemma size: symbols in a lemma's proof, median over the run (to spot padding; runs from M3 on).
"""
import glob, json, math, re, statistics as st, sys

T95 = [math.nan, 12.71, 4.3, 3.18, 2.78, 2.57, 2.45, 2.36, 2.31, 2.26, 2.23, 2.2, 2.18, 2.16, 2.14, 2.13, 2.12, 2.11, 2.1, 2.09, 2.09]
t95 = lambda df: math.nan if df < 1 else T95[df] if df < len(T95) else 1.96 + 2.4 / df

def mean_range(xs):
    m = st.mean(xs); h = t95(len(xs) - 1) * st.stdev(xs) / math.sqrt(len(xs))
    return m, m - h, m + h

def diff_range(a, b):
    d = st.mean(a) - st.mean(b); h = t95(min(len(a), len(b)) - 1) * math.sqrt(st.variance(a) / len(a) + st.variance(b) / len(b))
    return d, d - h, d + h

def wilson(k, n, z=1.96):
    p = k / n; c = (p + z * z / 2 / n) / (1 + z * z / n); h = z * math.sqrt(p * (1 - p) / n + z * z / 4 / n / n) / (1 + z * z / n)
    return max(0, c - h), min(1, c + h)

def newcombe(k1, n1, k2, n2):
    l1, u1 = wilson(k1, n1); l2, u2 = wilson(k2, n2); p1, p2 = k1 / n1, k2 / n2; d = p1 - p2
    return d, d - math.sqrt((p1 - l1) ** 2 + (u2 - p2) ** 2), d + math.sqrt((u1 - p1) ** 2 + (p2 - l2) ** 2)

def first_proofs(lib):
    seen, out = set(), []
    for e in lib:
        k = ' '.join(e['signature'].split())
        if k not in seen: seen.add(k); out.append(e)
    return out

def run(path):
    R = json.load(open(f'{path}/result.json'))
    acts = [json.loads(l) for l in open(f'{path}/actions.jsonl')]
    lib = R.get('library', [])
    by = {f"{e['ns']}.{e['name']}": e for e in lib}
    labs = sorted({a['agent'] for a in acts})
    worked = [max([a['round'] for a in acts if a['agent'] == i and a['kind'] not in ('pass', 'none')] or [0]) for i in labs]
    passed = [any(a['agent'] == i and a['kind'] == 'pass' for a in acts) for i in labs]
    spent = sum(a.get('cost') or 0 for a in acts)
    cited = {u for e in lib for u in e.get('uses', [])}
    own = [e for e in first_proofs(lib) if not e.get('target') and not e.get('conjecture') and not e.get('trivial')]
    sizes = [e['size'] for e in own if e.get('size')]
    targets = {e['target'] for e in lib if e.get('target')}
    return {
        'targets': len(targets), 'spent': spent, 'per $': len(targets) / spent if spent else 0,
        'lemmas': sum(1 for a in acts if a['kind'] == 'lemma' and a.get('ok') and 'trivial' not in (a.get('reason') or '')),
        'built on another lab': sum(1 for e in first_proofs(lib) if any(u in by and by[u]['author'] != e['author'] for u in e.get('uses', []))),
        'lemmas cited later': sum(1 for e in own if f"{e['ns']}.{e['name']}" in cited),
        'median lemma size': st.median(sizes) if sizes else None,
        'rounds a lab worked': st.mean(worked), 'never passed': 1 - sum(passed) / len(labs),
        'B5': 'B5' in targets, 'A5': 'A5' in targets,
    }

def load(exp, setup):
    paths = [p for p in glob.glob(f'lean/runs/{exp}-r*-{setup}') if re.fullmatch(rf'.*/{re.escape(exp)}-r\d+-{re.escape(setup)}', p) and glob.glob(f'{p}/result.json')]
    return [run(p) for p in sorted(paths, key=lambda p: int(re.search(r'-r(\d+)-', p).group(1)))]

if __name__ == '__main__':
    exp = sys.argv[1]
    setups = sys.argv[2].split(',') if len(sys.argv) > 2 else ['traditional', 'shared', 'oso', 'oso-0.2']
    base = sys.argv[3] if len(sys.argv) > 3 else 'shared'
    data = {s: load(exp, s) for s in setups}
    data = {s: v for s, v in data.items() if v}
    keys = ['targets', 'spent', 'per $', 'lemmas', 'lemmas cited later', 'median lemma size', 'built on another lab', 'rounds a lab worked', 'never passed']
    keys = [k for k in keys if all(x[k] is not None for v in data.values() for x in v)]
    for s, v in data.items():
        print(f'\n{s} ({len(v)} runs)')
        for k in keys:
            m, lo, hi = mean_range([x[k] for x in v]); print(f'  {k:22} {m:7.2f}  ({lo:.2f} to {hi:.2f})')
        for k in ['B5', 'A5']:
            n = sum(x[k] for x in v); lo, hi = wilson(n, len(v)); print(f'  {k} proved {n} of {len(v)} ({lo:.2f} to {hi:.2f})')
    if base in data:
        for s, v in data.items():
            if s == base: continue
            print(f'\n{s} minus {base}')
            for k in keys:
                d, lo, hi = diff_range([x[k] for x in v], [x[k] for x in data[base]]); print(f'  {k:22} {d:+7.2f}  ({lo:+.2f} to {hi:+.2f})')
            for k in ['B5', 'A5']:
                d, lo, hi = newcombe(sum(x[k] for x in v), len(v), sum(x[k] for x in data[base]), len(data[base])); print(f'  {k} rate {d:+.2f}  ({lo:+.2f} to {hi:+.2f})')
