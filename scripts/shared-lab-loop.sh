#!/bin/sh
# Keeps a local lab in the shared run going: `sh scripts/shared-lab-loop.sh <github user> <join issue> [tries]`.
# Each pass reads the board's step lists from GitHub (so it sees proofs merged since the last pass), takes every
# step not yet proved whose `after` steps are all proved, and runs scripts/shared-local.ts on them with --submit.
# Waits while another local lab runs, keeps the Mac awake (caffeinate), and stops once every step is proved.
# For launchd (restart on crash and at login), see shared-run/README.md.
set -u
lab=${1:?usage: sh scripts/shared-lab-loop.sh <github user> <join issue> [tries]}; issue=${2:?join issue number}; tries=${3:-3}
root=$(cd "$(dirname "$0")/.." && pwd); cd "$root"
jobs="$root/shared-run/.lab-jobs.json"
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.elan/bin:$PATH"
while :; do
  while pgrep -f "scripts/shared-local.ts" >/dev/null; do sleep 60; done
  if ! curl -sf "https://raw.githubusercontent.com/open-science-org/experiment/master/shared-run/state/summary.json?t=$(date +%s)" -o "$jobs.summary"; then
    echo "$(date '+%F %T') no network; retry in 5 min"; sleep 300; continue
  fi
  n=$(node -e "
    const s = require('$jobs.summary');
    const out = [];
    for (const l of s.steps ?? []) {
      const done = new Set(l.steps.filter((x) => x.provedBy).map((x) => x.id));
      for (const x of l.steps) if (!done.has(x.id) && x.after.every((a) => done.has(a)))
        out.push({ kind: 'lemma', name: 'step_' + l.target.split('.')[0] + '_' + x.id, statement: x.statement, open: l.open, problem: l.target.split('.')[0] });
    }
    require('fs').writeFileSync('$jobs', JSON.stringify(out, null, 1));
    console.log(out.length);")
  if [ "$n" = "0" ]; then echo "$(date '+%F %T') every step is proved; stopping"; exit 0; fi
  echo "$(date '+%F %T') pass: $n open steps"
  git pull -q --rebase --autostash 2>/dev/null
  caffeinate -is node scripts/shared-local.ts "$jobs" --lab "$lab" --tries "$tries" --submit --issue "$issue"
  sleep 60
done
