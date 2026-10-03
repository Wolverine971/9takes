#!/usr/bin/env bash
# scripts/run-weekly-growth-audit.sh
#
# Weekly growth audit: runs the growth-analyst agent headlessly via the
# /weekly-growth-audit slash command. Scheduled by the OpenClaw cron job
# "9takes Weekly Marketing Automation" (Mondays 6:00 AM ET) through
# scripts/run-weekly-marketing-automation.sh — a command payload, no agent
# turn. Can also be run manually.
#
# (Raw crontab was retired 2026-07-01: `claude -p` can't reach keychain
# credentials under cron, so every crontab run since 2026-06-15 died at
# "Not logged in" while logging exit=0.)
#
# Full claude transcript: logs/growth-automation/audit-YYYY-MM-DD.log
# stdout stays compact (status + headline) so callers can forward it to
# Telegram. Exits 0 ONLY if docs/growth/growth-log.md actually gained a
# dated entry for today — the artifact is the success signal, not claude's
# exit code.
#
# Env:
#   SKIP_CLAUDE=1   skip the claude run; just verify + summarize today's
#                   artifact (plumbing test)

set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$REPO_ROOT/logs/growth-automation"
mkdir -p "$LOG_DIR"
TODAY="$(date +%Y-%m-%d)"
LOG_FILE="$LOG_DIR/audit-$TODAY.log"
GROWTH_LOG="$REPO_ROOT/docs/growth/growth-log.md"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >> "$LOG_FILE"; }

fail() {
  log "FAIL: $*"
  echo "FAILED — growth audit: $* (transcript: $LOG_FILE)"
  exit 1
}

log "Starting weekly growth audit"

if [[ "${SKIP_CLAUDE:-0}" != "1" ]]; then
  cd "$REPO_ROOT"
  RUN_OUT="$(mktemp)"
  claude -p "/weekly-growth-audit" --dangerously-skip-permissions > "$RUN_OUT" 2>&1
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

# Artifact check: the growth log must have gained a dated entry for today.
grep -q "^### $TODAY" "$GROWTH_LOG" \
  || fail "no '### $TODAY' entry in docs/growth/growth-log.md — run produced no artifact"

HEADLINE="$(grep -m1 "^### $TODAY" "$GROWTH_LOG" | sed "s/^### $TODAY[ -]*//")"
LEAK="$(awk "/^### $TODAY/{found=1} found && /Biggest leak/{print; exit}" "$GROWTH_LOG" \
  | sed 's/^[- ]*//; s/\*\*//g' | cut -c1-400)"

# Honest-numbers check (non-fatal): headline numbers must come from
# admin_engagement_trends_weekly_v2. An entry that never names it was likely
# built from raw, bot-inclusive counters, which is how a flat line read as a
# drop before 2026-10-02.
ENTRY="$(awk -v today="### $TODAY" 'index($0, today) == 1 {found=1; print; next} found && /^### /{exit} found {print}' "$GROWTH_LOG")"
HONEST_WARN=""
if ! grep -q "admin_engagement_trends_weekly_v2" <<< "$ENTRY"; then
  HONEST_WARN="WARN: today's entry does not cite admin_engagement_trends_weekly_v2; its numbers may be raw (bot-inclusive)"
  log "$HONEST_WARN"
fi

log "Weekly growth audit OK: $HEADLINE"
echo "OK — growth audit: $HEADLINE"
[[ -n "$LEAK" ]] && echo "$LEAK"
[[ -n "$HONEST_WARN" ]] && echo "$HONEST_WARN"
exit 0
