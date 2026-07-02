#!/usr/bin/env bash
# scripts/run-weekly-marketing-automation.sh
#
# Monday marketing chain: weekly growth audit → weekly marketing brief →
# Telegram summary. Replaces the two independent crontab entries (retired
# 2026-07-01 — they never once succeeded; every run died at "Not logged in"
# because crontab can't reach claude's keychain credentials).
#
# Scheduled by the OpenClaw cron job "9takes Weekly Marketing Automation"
# (Mondays 6:00 AM ET) as a command payload — sh -lc, no agent turn — the
# same pattern as scripts/nightly-blog-cron.sh and for the same reason:
# agent-turn babysitting is the thing that fails.
#
# The brief runs even if the audit fails (status awareness is still worth
# having; the /weekly-marketing-brief command flags stale growth data), but
# the job exits non-zero if EITHER leg fails so OpenClaw records the error.
#
# Manual test of the plumbing without burning a claude run:
#   SKIP_CLAUDE=1 ./scripts/run-weekly-marketing-automation.sh

set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TODAY="$(date +%Y-%m-%d)"
TELEGRAM_TOKEN_FILE="${TELEGRAM_TOKEN_FILE:-$HOME/.openclaw/credentials/telegram-ninetakes.token}"
TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID:--1003724832638}"

# Send a Telegram message directly via the Bot API. Never fails the run.
notify() {
  local text="$1"
  [[ -f "$TELEGRAM_TOKEN_FILE" ]] || { echo "WARN — no Telegram token file at $TELEGRAM_TOKEN_FILE; summary printed only"; return 0; }
  local token
  token="$(tr -d '[:space:]' < "$TELEGRAM_TOKEN_FILE")"
  curl -s -m 20 "https://api.telegram.org/bot${token}/sendMessage" \
    --data-urlencode "chat_id=${TELEGRAM_CHAT_ID}" \
    --data-urlencode "text=${text}" > /dev/null 2>&1 \
    || echo "WARN — Telegram send failed (summary printed above)"
}

AUDIT_OUT="$("$REPO_ROOT/scripts/run-weekly-growth-audit.sh" 2>&1)"
AUDIT_STATUS=$?

BRIEF_OUT="$("$REPO_ROOT/scripts/run-weekly-marketing-brief.sh" 2>&1)"
BRIEF_STATUS=$?

STATUS_LINE="9takes weekly marketing automation — $TODAY"
if [[ $AUDIT_STATUS -eq 0 && $BRIEF_STATUS -eq 0 ]]; then
  STATUS_LINE="$STATUS_LINE — all good ✅"
else
  STATUS_LINE="$STATUS_LINE — ATTENTION NEEDED ❌"
fi

MSG="$STATUS_LINE

— Growth audit —
$AUDIT_OUT

— Marketing brief —
$BRIEF_OUT"

# Telegram message cap is 4096 chars; keep headroom.
MSG="${MSG:0:3800}"

echo "$MSG"
notify "$MSG"

[[ $AUDIT_STATUS -eq 0 && $BRIEF_STATUS -eq 0 ]] || exit 1
exit 0
