#!/bin/sh
# Copies the OSO ledger from the app repository into vendor/oso-ledger/, pinned to one commit.
# The simulator's tests check that its waterfall pays exactly what this ledger pays.
#   scripts/sync-ledger.sh [path to app checkout] [commit]     (defaults: ../app, its HEAD)
set -e
APP=${1:-../app}
REF=$(git -C "$APP" rev-parse --short "${2:-HEAD}")
DEST=$(dirname "$0")/../vendor/oso-ledger
FILES="ledger/chain.ts ledger/crypto.ts ledger/ledger.ts ledger/state.ts ledger/versions.ts ledger/waterfall.ts api/demo.ts"
mkdir -p "$DEST/ledger" "$DEST/api"
for f in $FILES; do git -C "$APP" show "$REF:$f" > "$DEST/$f"; done
cat > "$DEST/README.md" <<MD
# OSO ledger (pinned copy)

A copy of the ledger from [open-science-org/app](https://github.com/open-science-org/app) at commit
[\`$REF\`](https://github.com/open-science-org/app/tree/$REF), used only by the tests, which check
that the simulator's waterfall pays exactly what the ledger pays. Do not edit it here: change the
app, then run \`scripts/sync-ledger.sh\` and commit the result.

Files: $FILES
MD
echo "vendor/oso-ledger pinned to app@$REF"
