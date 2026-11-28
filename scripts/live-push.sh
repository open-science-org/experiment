#!/bin/sh
# Streams an experiment to the Live page on oso.network: `sh scripts/live-push.sh <experiment id> [seconds]`.
# Every minute (default 60; the Live page checks once a minute) it writes experiments/<id>.json (scripts/live-snapshot.ts) to the `live` branch,
# rebuilds index.json (every experiment on the branch, so several can stream at once) and pushes that branch only.
# The branch is one commit, replaced each time; master is never touched. A lock keeps two streams from pushing at
# once; a push gives up after about 30 seconds without the network (a Mac waking briefly from sleep), so it cannot hold the lock. Stops when every run of the experiment has finished, after a last push.
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
  # Which hidden steps the labs have proved (new lemmas only; a failure leaves the graph as it was). In the background,
  # one at a time per run: on a big run it takes minutes, so each push carries the matches saved so far.
  for d in lean/runs/"$id"-r*/; do
    [ -f "$d/options.json" ] && ! pgrep -f "match-steps.ts $d" >/dev/null && { node scripts/match-steps.ts "$d" >/dev/null 2>&1 & }
  done; true
  until mkdir "$lock" 2>/dev/null; do sleep 5; done
  mkdir -p "$live/experiments"
  node scripts/live-snapshot.ts "$id" "$live/experiments/$id.json" >/dev/null
  node scripts/live-index.ts "$live" >/dev/null
  done=$(ls -d lean/runs/"$id"-r*/ 2>/dev/null | while read -r d; do [ -f "$d/result.json" ] || [ -f "$d/stopped.json" ] && echo; done | wc -l | tr -d ' ')
  (cd "$live" && git add -A . && { git rev-parse -q --verify HEAD >/dev/null && git commit -q --amend -m "live: $id" || git commit -q -m "live: $id"; } && git -c core.sshCommand='ssh -o ConnectTimeout=20 -o ServerAliveInterval=15 -o ServerAliveCountMax=2' push -q -f origin live) \
    && echo "$(date '+%H:%M') pushed: $done of $total runs done" || true
  rmdir "$lock"
  # The last push waits for the final matches.
  if [ "$done" -ge "$total" ]; then
    [ -n "${final:-}" ] && break
    while pgrep -f "match-steps.ts lean/runs/$id-r" >/dev/null; do sleep 10; done; final=1; continue
  fi
  sleep "$every"
done
