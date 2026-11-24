#!/bin/sh
# Streams an experiment to the Live page on oso.network: `sh scripts/live-push.sh <experiment id> [seconds]`.
# Every minute (default 60; the Live page checks once a minute) it writes experiments/<id>.json (scripts/live-snapshot.ts) to the `live` branch,
# rebuilds index.json (every experiment on the branch, so several can stream at once) and pushes that branch only.
# The branch is one commit, replaced each time; master is never touched. A lock keeps two streams from pushing at
# once. Stops when every run of the experiment has finished, after a last push.
set -e
id=$1; every=${2:-60}
[ -n "$id" ] || { echo "usage: sh scripts/live-push.sh <experiment id> [seconds]"; exit 1; }
root=$(cd "$(dirname "$0")/.." && pwd); live="$root/.live"; lock="$root/.live.lock"
cd "$root"
if [ ! -d "$live" ]; then
  if git ls-remote --exit-code --heads origin live >/dev/null 2>&1; then git fetch -q origin live && git worktree add -q "$live" live
  else git worktree add -q --orphan -b live "$live"; fi
fi
total=$(node -e "const p=require('./lean/runs/$id.plan.json');console.log(p.societies.length*p.repeats)")
while :; do
  until mkdir "$lock" 2>/dev/null; do sleep 5; done
  mkdir -p "$live/experiments"
  node scripts/live-snapshot.ts "$id" "$live/experiments/$id.json" >/dev/null
  node scripts/live-index.ts "$live" >/dev/null
  done=$(ls lean/runs/"$id"-r*/result.json 2>/dev/null | wc -l | tr -d ' ')
  (cd "$live" && git add -A . && { git rev-parse -q --verify HEAD >/dev/null && git commit -q --amend -m "live: $id" || git commit -q -m "live: $id"; } && git push -q -f origin live) \
    && echo "$(date '+%H:%M') pushed: $done of $total runs done" || true
  rmdir "$lock"
  [ "$done" -ge "$total" ] && break
  sleep "$every"
done
