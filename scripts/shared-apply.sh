#!/bin/sh
# The OSO shared run, step 2 (run by .github/workflows/shared-apply.yml, trusted, master's code only): record every
# checked pull request that is still open, oldest first. GitHub keeps at most one waiting run per concurrency group
# and drops the rest, so each run catches up on all of them rather than only the one that started it; a closed pull
# request has been recorded. A check counts only if it ran on the pull request's current head.
# For each: the pull request and its author come from GitHub (not from the check's files); a pass counts only if it
# matches a file of the pull request exactly; it goes into the library, credit is recomputed, then comment and close.
set -e
repo=$GITHUB_REPOSITORY
git config user.name "oso-shared-run"
git config user.email "shared-run@users.noreply.github.com"
gh run list --repo "$repo" --workflow "Shared run check" --event pull_request --status success --limit 100 \
  --json databaseId,headSha,createdAt --jq 'sort_by(.createdAt) | .[] | "\(.databaseId) \(.headSha)"' |
while read -r run head; do
  pr=$(gh pr list --repo "$repo" --state open --json number,headRefOid --jq ".[] | select(.headRefOid==\"$head\") | .number" | head -1)
  [ -n "$pr" ] || continue
  echo "== pull request #$pr (check run $run)"
  work=$(mktemp -d)
  gh run download "$run" --repo "$repo" -n shared-verdict -D "$work" || { echo "no verdict for run $run"; continue; }
  lab=$(gh pr view "$pr" --repo "$repo" --json author --jq .author.login)
  opened=$(gh pr view "$pr" --repo "$repo" --json createdAt --jq .createdAt)
  mkdir -p "$work/prfiles"
  gh api "repos/$repo/pulls/$pr/files" --paginate --jq '.[] | select(.filename | startswith("shared-run/submissions/")) | .filename' | while read -r f; do
    gh api "repos/$repo/contents/$f?ref=$head" --jq .content | base64 -d > "$work/prfiles/$(basename "$f")" || true
  done
  git pull -q --rebase origin master
  # One bad pull request must not block the others: skip it, and the next run tries it again.
  node scripts/shared.ts apply "$work/verdicts.json" --lab "$lab" --pr "$pr" --pr-at "$opened" --files "$work/prfiles" || { echo "could not record #$pr"; git checkout -q -- shared-run/state; continue; }
  node -e '
    const v = require(process.argv[1]);
    const lines = v.map((x) => x.ok ? `PASS ${x.file.split("/").pop()}${x.uses.length ? ` (builds on ${x.uses.join(", ")})` : ""}` : `FAIL ${x.file.split("/").pop()}\n\n\`\`\`\n${x.errors.join("\n").slice(0, 3000)}\n\`\`\``);
    require("fs").writeFileSync(process.argv[2], `**Shared run checker**\n\n${lines.join("\n\n")}\n\nPassing proofs are now in the public library (shared-run/state/library.json); credit is on https://www.oso.network/shared.html. This pull request is closed either way: the library keeps the record.`);' "$work/verdicts.json" "$work/comment.md"
  git add shared-run/state
  git commit -q -m "Shared run: verdict for #$pr by $lab" || echo "nothing to commit"
  git push -q origin master
  gh pr comment "$pr" --repo "$repo" --body-file "$work/comment.md"
  gh pr close "$pr" --repo "$repo"
done
