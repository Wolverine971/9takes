#!/usr/bin/env bash
# scripts/run-weekly-crosslinks.sh
#
# Weekly internal-link pass: runs /crosslink-queue headlessly, then verifies the
# result deterministically. Scheduled by the OpenClaw cron job
# "9takes Weekly Crosslinks" (Thursdays 7:00 AM ET) as a command payload (no agent
# turn), same pattern as scripts/run-weekly-marketing-automation.sh. Can also be
# run manually.
#
# Success = ALL of:
#   - docs/crosslinks/crosslink-log.md gained a "### YYYY-MM-DD" entry for today
#   - `pnpm crosslinks:check` passes after the run (no broken links, no new gate failures)
# claude's exit code alone is never trusted.
#
# Edits are left uncommitted in the working tree for DJ's next commit.
#
# Env:
#   SKIP_CLAUDE=1       skip the claude run; verify + summarize TODAY's existing log entry
#                       (plumbing test — fails on a day with no entry, by design)
#   CROSSLINK_BUDGET=N  links to add this run (default 12)

set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$REPO_ROOT/logs/crosslinks"
mkdir -p "$LOG_DIR"
TODAY="$(date +%Y-%m-%d)"
LOG_FILE="$LOG_DIR/crosslinks-$TODAY.log"
CROSSLINK_LOG="$REPO_ROOT/docs/crosslinks/crosslink-log.md"
BUDGET="${CROSSLINK_BUDGET:-12}"
TELEGRAM_TOKEN_FILE="${TELEGRAM_TOKEN_FILE:-${HOME:-/nonexistent}/.openclaw/credentials/telegram-ninetakes.token}"
TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID:--1003724832638}"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >> "$LOG_FILE"; }

notify() {
  local text="$1"
  [[ -f "$TELEGRAM_TOKEN_FILE" ]] || { echo "WARN — no Telegram token file; summary printed only"; return 0; }
  local token
  token="$(tr -d '[:space:]' < "$TELEGRAM_TOKEN_FILE")"
  curl -s -m 20 "https://api.telegram.org/bot${token}/sendMessage" \
    --data-urlencode "chat_id=${TELEGRAM_CHAT_ID}" \
    --data-urlencode "text=${text}" > /dev/null 2>&1 \
    || echo "WARN — Telegram send failed (summary printed above)"
}

finish() {
  local status="$1" msg="$2"
  local line="9takes weekly crosslinks — $TODAY — $msg"
  log "$line"
  echo "$line"
  notify "${line:0:3800}"
  exit "$status"
}

cd "$REPO_ROOT" || finish 1 "FAILED: repo not found"
log "Starting weekly crosslinks (budget $BUDGET)"

LOG_LINES_BEFORE="$(wc -l < "$CROSSLINK_LOG" 2>/dev/null || echo 0)"

if [[ "${SKIP_CLAUDE:-0}" != "1" ]]; then
  RUN_OUT="$(mktemp)"
  claude -p "/crosslink-queue $BUDGET" --dangerously-skip-permissions > "$RUN_OUT" 2>&1
  CLAUDE_EXIT=$?
  cat "$RUN_OUT" >> "$LOG_FILE"
  log "claude exited $CLAUDE_EXIT"
  if grep -q "Not logged in" "$RUN_OUT"; then
    rm -f "$RUN_OUT"
    finish 1 "FAILED ❌ claude is not authenticated in this context ('Not logged in'). Transcript: $LOG_FILE"
  fi
  SUMMARY="$(grep -m1 '^Crosslinks [0-9-]*:' "$RUN_OUT" || true)"
  rm -f "$RUN_OUT"
  [[ $CLAUDE_EXIT -ne 0 ]] && finish 1 "FAILED ❌ claude exited $CLAUDE_EXIT. Transcript: $LOG_FILE"
  # A same-day rerun must append a NEW entry; an earlier entry for today doesn't count.
  LOG_LINES_AFTER="$(wc -l < "$CROSSLINK_LOG" 2>/dev/null || echo 0)"
  [[ "$LOG_LINES_AFTER" -gt "$LOG_LINES_BEFORE" ]] \
    || finish 1 "FAILED ❌ crosslink-log.md did not grow this run (no new entry). Transcript: $LOG_FILE"
else
  SUMMARY="(SKIP_CLAUDE=1 plumbing test)"
fi

# Artifact check: the log must have a dated entry for today.
grep -q "^### $TODAY" "$CROSSLINK_LOG" 2>/dev/null \
  || finish 1 "FAILED ❌ no '### $TODAY' entry in docs/crosslinks/crosslink-log.md (run produced no artifact). Transcript: $LOG_FILE"

# Gate check: the run must leave the site passing.
GATE_OUT="$(node scripts/check-crosslinks.mjs 2>&1)"
GATE_STATUS=$?
echo "$GATE_OUT" >> "$LOG_FILE"
if [[ $GATE_STATUS -ne 0 ]]; then
  finish 1 "ATTENTION ❌ crosslinks:check fails after the run — $(echo "$GATE_OUT" | grep -m3 '✖' | tr '\n' ' ')"
fi

HEADLINE="$(grep -m1 "^### $TODAY" "$CROSSLINK_LOG" | sed "s/^### $TODAY[ —-]*//")"
finish 0 "OK ✅ ${SUMMARY:-$HEADLINE}. Edits are uncommitted; review with: git diff -- src/blog"
