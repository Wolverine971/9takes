#!/usr/bin/env bash
# scripts/run-weekly-marketing-brief.sh
#
# Weekly marketing status brief: runs the marketing-pm agent headlessly via
# the /weekly-marketing-brief slash command. Scheduled by the OpenClaw cron
# job "9takes Weekly Marketing Automation" (Mondays 6:00 AM ET) through
# scripts/run-weekly-marketing-automation.sh, which runs it AFTER the growth
# audit and only chains the two — a command payload, no agent turn. Can also
# be run manually.
#
# (Raw crontab was retired 2026-07-01: `claude -p` can't reach keychain
# credentials under cron, so every crontab run died at "Not logged in".)
#
# Full claude transcript: logs/marketing-automation/brief-YYYY-MM-DD.log
# stdout stays compact (status + TL;DR) so callers can forward it to
# Telegram. Exits 0 ONLY if the dated brief file actually exists — the
# artifact is the success signal, not claude's exit code.
#
# Env:
#   SKIP_CLAUDE=1   skip the claude run; just verify + summarize today's
#                   artifact (plumbing test)

set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$REPO_ROOT/logs/marketing-automation"
mkdir -p "$LOG_DIR"
TODAY="$(date +%Y-%m-%d)"
LOG_FILE="$LOG_DIR/brief-$TODAY.log"
BRIEF_FILE="$REPO_ROOT/docs/daily-briefs/${TODAY}_marketing-status.md"
MARKETING_LOG="$REPO_ROOT/docs/marketing/marketing-log.md"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >> "$LOG_FILE"; }

fail() {
  log "FAIL: $*"
  echo "FAILED — marketing brief: $* (transcript: $LOG_FILE)"
  exit 1
}

log "Starting weekly marketing brief"

if [[ "${SKIP_CLAUDE:-0}" != "1" ]]; then
  cd "$REPO_ROOT"
  RUN_OUT="$(mktemp)"
  claude -p "/weekly-marketing-brief" --dangerously-skip-permissions > "$RUN_OUT" 2>&1
  CLAUDE_EXIT=$?
  cat "$RUN_OUT" >> "$LOG_FILE"
  log "claude exited $CLAUDE_EXIT"
  if grep -q "Not logged in" "$RUN_OUT"; then
    rm -f "$RUN_OUT"
    fail "claude is not authenticated in this context ('Not logged in')"
  fi
  rm -f "$RUN_OUT"
  [[ $CLAUDE_EXIT -ne 0 ]] && fail "claude exited $CLAUDE_EXIT"
fi

# Artifact check: the dated brief file must exist and be non-trivial.
[[ -s "$BRIEF_FILE" ]] \
  || fail "docs/daily-briefs/${TODAY}_marketing-status.md missing or empty — run produced no artifact"

# Soft check: marketing log should mention today (warn only; brief is the deliverable).
grep -q "$TODAY" "$MARKETING_LOG" \
  || echo "WARN — brief exists but marketing-log.md has no $TODAY entry"

# TL;DR extraction for the announce (first 12 lines of the TL;DR section).
TLDR="$(sed -n '/^## TL;DR/,/^## /p' "$BRIEF_FILE" | sed '1d; $d' | grep -v '^$' | head -12)"

log "Weekly marketing brief OK: $BRIEF_FILE"
echo "OK — marketing brief: ${TODAY}_marketing-status.md"
[[ -n "$TLDR" ]] && echo "$TLDR"
exit 0
