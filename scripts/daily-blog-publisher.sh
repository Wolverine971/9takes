#!/usr/bin/env bash
# scripts/daily-blog-publisher.sh
# Deterministic wrapper for the 6 AM people-blog publisher.
#
# OpenClaw should run this as a command payload, not as an agent turn. The
# wrapper preserves the publish command's exit code through tee so "no eligible
# draft" is a visible scheduler failure instead of a green agent summary.

set -uo pipefail

REPO="/Users/djwayne/9takes"
LOG_DIR="$REPO/logs/blog-automation"
LOG="$LOG_DIR/publish-people-$(date +%Y-%m-%d).log"

mkdir -p "$LOG_DIR"
cd "$REPO" || exit 1

echo "[$(date '+%Y-%m-%d %H:%M:%S')] People blog publisher starting" | tee -a "$LOG"
node scripts/personBlogParser.js --publish 2>&1 | tee -a "$LOG"
publish_exit="${PIPESTATUS[0]}"

if [[ "$publish_exit" -eq 0 ]]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] People blog publisher finished successfully" | tee -a "$LOG"
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] People blog publisher failed (exit=$publish_exit)" | tee -a "$LOG"
fi

exit "$publish_exit"
