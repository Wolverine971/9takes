#!/usr/bin/env bash
# scripts/nightly-blog-watchdog.sh
#
# Runs at 3:30 AM (OpenClaw command payload), 90 min after the nightly blog
# cron. Pure alerting — it never relaunches anything (the pipeline lock makes
# relaunch safe but a human should decide). Checks that tonight's run actually
# happened and didn't die silently, and alerts via Telegram if not.
#
# Silent-death cases this catches that the wrapper itself cannot report:
#   - the wrapper never ran (gateway down, job disabled by accident)
#   - the wrapper AND pipeline were both killed (machine slept, group kill)

set -uo pipefail

REPO="/Users/djwayne/9takes"
QUEUE="$REPO/docs/blog-automation/backlog-queue.json"
OVERRIDE="$REPO/docs/blog-automation/override.json"
DRAFTS="$REPO/src/blog/people/drafts"
CRON_LOG="$REPO/logs/blog-automation/cron-$(date +%Y-%m-%d).log"
PIPELINE_LOCK="$REPO/docs/content-analysis/pipeline-logs/.pipeline.lock"
TELEGRAM_TOKEN_FILE="${TELEGRAM_TOKEN_FILE:-$HOME/.openclaw/credentials/telegram-ninetakes.token}"
TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID:--1003724832638}"

alert() {
  local text="9takes blog watchdog: $1"
  echo "$text"
  [[ -f "$TELEGRAM_TOKEN_FILE" ]] || return 0
  local token
  token="$(tr -d '[:space:]' < "$TELEGRAM_TOKEN_FILE")"
  curl -s -m 20 "https://api.telegram.org/bot${token}/sendMessage" \
    --data-urlencode "chat_id=${TELEGRAM_CHAT_ID}" \
    --data-urlencode "text=🐕 ${text}" > /dev/null 2>&1 || true
}

# Paused automation is a deliberate no-run; stay quiet.
if [[ "$(jq -r '.pause' "$OVERRIDE" 2>/dev/null)" == "true" ]]; then
  echo "Automation paused — watchdog exiting quietly."
  exit 0
fi

# A live pipeline this late is fine (long run) — say nothing.
lock_pid="$(cat "$PIPELINE_LOCK/pid" 2>/dev/null || echo "")"
if [[ -n "$lock_pid" ]] && kill -0 "$lock_pid" 2>/dev/null; then
  echo "Pipeline pid $lock_pid still running — OK."
  exit 0
fi

# Case 1: the wrapper never ran tonight.
if [[ ! -f "$CRON_LOG" ]] || ! grep -q "Nightly blog cron starting" "$CRON_LOG"; then
  alert "no nightly run tonight — cron log missing or empty ($CRON_LOG). Check the OpenClaw job."
  exit 0
fi

# Case 2: the wrapper started but never logged a finish, and nothing is running.
if ! grep -q "Nightly blog cron finished" "$CRON_LOG"; then
  in_progress="$(jq -r '.inProgress.name // empty' "$QUEUE")"
  detail=""
  if [[ -n "$in_progress" ]]; then
    if [[ -f "$DRAFTS/$in_progress.md" ]]; then
      detail="inProgress=$in_progress, draft EXISTS (queue was never reconciled — tomorrow's run will fix it)"
    else
      detail="inProgress=$in_progress, NO draft (dead launch — tomorrow's run will retry it)"
    fi
  fi
  alert "nightly run started but died before finishing (no live pipeline). $detail Log: $CRON_LOG"
  exit 0
fi

# Case 3: finished, but a stage failed hard enough to leave a sentinel.
latest_dir="$(ls -dt "$REPO/docs/content-analysis/pipeline-logs/"*/ 2>/dev/null | head -1)"
if [[ -n "$latest_dir" && -f "$latest_dir/FAILED_AT_STAGE" ]]; then
  alert "last pipeline run left FAILED_AT_STAGE: $(cat "$latest_dir/FAILED_AT_STAGE") — see $latest_dir"
  exit 0
fi

echo "Watchdog: tonight's run looks healthy."
