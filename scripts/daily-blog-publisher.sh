#!/usr/bin/env bash
# scripts/daily-blog-publisher.sh
# Deterministic wrapper for the 6 AM, two-people-per-day publisher.
#
# The Codex daily publishing automation runs this command. The wrapper preserves
# the exit code through tee so an incomplete daily batch is a visible failure.

set -uo pipefail

REPO="/Users/djwayne/9takes"
LOG_DIR="$REPO/logs/blog-automation"
LOG="$LOG_DIR/publish-people-$(date +%Y-%m-%d).log"

mkdir -p "$LOG_DIR"
cd "$REPO" || exit 1

# Scheduled processes inherit their launcher's PATH. A launcher
# started before a Homebrew upgrade can hand out a node that no longer loads
# (2026-10-23..26: dyld "libada.3.dylib" crash). Use the first node that runs,
# preferring node@24 (the project's engines policy).
NODE_BIN=""
for candidate in /opt/homebrew/opt/node@24/bin/node /opt/homebrew/bin/node "$(command -v node || true)"; do
  if [[ -n "$candidate" && -x "$candidate" ]] && "$candidate" --version >/dev/null 2>&1; then
    NODE_BIN="$candidate"
    break
  fi
done
if [[ -z "$NODE_BIN" ]]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] People blog publisher failed: no working node binary" | tee -a "$LOG"
  exit 127
fi
# Child processes (source audit, gates) resolve `node` from PATH too.
export PATH="$(dirname "$NODE_BIN"):$PATH"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] People blog publisher starting ($("$NODE_BIN" --version) at $NODE_BIN)" | tee -a "$LOG"
"$NODE_BIN" scripts/publish-people-daily.mjs --apply 2>&1 | tee -a "$LOG"
publish_exit="${PIPESTATUS[0]}"

if [[ "$publish_exit" -eq 0 ]]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] People blog publisher finished successfully" | tee -a "$LOG"
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] People blog publisher failed (exit=$publish_exit)" | tee -a "$LOG"
fi

exit "$publish_exit"
