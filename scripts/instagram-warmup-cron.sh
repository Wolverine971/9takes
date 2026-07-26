#!/usr/bin/env bash
# scripts/instagram-warmup-cron.sh
#
# Deterministic cron wrapper for the daily /instagram-warmup run.
# Same architecture as nightly-blog-cron.sh, for the same reason: the
# OpenClaw agentTurn wrapper that used to run this (a) killed the claude
# process ~5 minutes in, long before a real warmup finishes, and (b) read
# the shared append-log afterwards and re-announced day-old summaries as
# fresh "COMPLETED" results.
#
# This script:
#   1. Opens the brand's dedicated Chrome profile so its Claude extension
#      instance is awake and connectable.
#   2. Runs claude --chrome "/instagram-warmup" with output going ONLY to a
#      per-day log file.
#   3. Prints a truthful, compact summary (status header + tail of THIS
#      day's log) to stdout — which OpenClaw announce delivers to Telegram.
#   4. Exits nonzero when the run actually failed, so the cron job status
#      and failure alerts are accurate.
#
# Scheduling: OpenClaw cron job "9takes Instagram Warmup" runs this via a
# command payload (sh -lc, no agent turn). Manage with `openclaw cron`.
#
# Browser mapping (see docs/instagram/instagram-cron-browser-setup.md):
#   Chrome profile "Profile 2" (display name "9takes.com") holds the
#   @9takesdotcom Instagram session and a Claude extension instance.

set -uo pipefail
export PATH="$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"

REPO="/Users/djwayne/9takes"
BRAND="9takes"
IG_HANDLE="9takesdotcom"
CHROME_PROFILE="Profile 2"   # Chrome display name: "9takes.com"
LOG_DIR="$REPO/logs/instagram-warmup"
LOG="$LOG_DIR/warmup-$(date +%Y-%m-%d).log"
LOCK="$LOG_DIR/.warmup.lock"
SUMMARY_BYTES=3500

mkdir -p "$LOG_DIR"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$1] ${*:2}" >> "$LOG"
}

# --- single-run lock -------------------------------------------------------
if [[ -f "$LOCK" ]]; then
  lock_pid="$(cat "$LOCK" 2>/dev/null || true)"
  if [[ -n "$lock_pid" ]] && kill -0 "$lock_pid" 2>/dev/null; then
    echo "[SKIPPED] $BRAND instagram warmup: previous run (pid $lock_pid) still active."
    exit 0
  fi
fi
echo $$ > "$LOCK"
trap 'rm -f "$LOCK"' EXIT

log INFO "Instagram warmup cron starting for @$IG_HANDLE"

# --- wake the dedicated Chrome profile ------------------------------------
# Opens (or focuses) a window of the brand profile so its Claude extension
# service worker is running and connectable. Harmless if already open.
open -na "Google Chrome" --args --profile-directory="$CHROME_PROFILE" 2>> "$LOG" \
  || log WARN "Could not open Chrome profile '$CHROME_PROFILE' (continuing; it may already be running)"
sleep 12

# --- run the warmup --------------------------------------------------------
start_size=$(stat -f%z "$LOG" 2>/dev/null || echo 0)
cd "$REPO" || { echo "[FAILED] $BRAND instagram warmup: cannot cd $REPO"; exit 1; }

claude --chrome --dangerously-skip-permissions "/instagram-warmup" >> "$LOG" 2>&1
rc=$?

log INFO "claude exited with code $rc"

# --- truthful summary to stdout (OpenClaw announces this) ------------------
# Tail only THIS run's portion of the log so a same-day rerun can never
# re-announce an earlier run's summary.
end_size=$(stat -f%z "$LOG" 2>/dev/null || echo 0)
produced=$(( end_size - start_size ))
run_output="$(tail -c "+$(( start_size + 1 ))" "$LOG" 2>/dev/null | tail -c "$SUMMARY_BYTES")"

if [[ $rc -eq 0 && $produced -gt 200 ]]; then
  echo "[OK] $BRAND instagram warmup $(date +%Y-%m-%d) — claude exit 0. Summary tail:"
  echo "$run_output"
  exit 0
elif [[ $rc -eq 0 ]]; then
  echo "[FAILED] $BRAND instagram warmup $(date +%Y-%m-%d) — claude exited 0 but produced no output (browser/extension likely not connected in Chrome profile '$CHROME_PROFILE')."
  exit 1
else
  echo "[FAILED] $BRAND instagram warmup $(date +%Y-%m-%d) — claude exit $rc. This run's log tail:"
  echo "$run_output"
  exit "$rc"
fi
