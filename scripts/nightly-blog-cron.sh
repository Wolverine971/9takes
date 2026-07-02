#!/usr/bin/env bash
# scripts/nightly-blog-cron.sh
#
# Deterministic nightly orchestrator for the 9takes blog pipeline.
# Replaces the LLM orchestration layer (OpenClaw agentTurn → claude -p
# "/daily-blog-creator") that caused 13 of 18 overnight failures through
# June 2026: agent turns ended (or were aborted by the scheduler) while the
# pipeline was still running, SIGKILLing it mid-stage and leaving
# backlog-queue.json's inProgress stuck.
#
# Everything the 2 AM job needs is deterministic, so it is all done here in
# bash/jq: preflight, person selection, queue state, pipeline launch, grade
# capture, Telegram alert. `claude -p` is used ONLY inside the pipeline
# stages (run-blog-pipeline.sh), where it has always worked.
#
# Usage:
#   ./scripts/nightly-blog-cron.sh             # normal nightly run
#   ./scripts/nightly-blog-cron.sh --dry-run   # preflight + selection only;
#                                              # no queue writes, no pipeline
#
# Scheduling: OpenClaw cron job "9takes Daily Blog Creator" runs this via a
# command payload (sh -lc, no agent turn). Manage with `openclaw cron`.
#
# The /daily-blog-creator command remains for MANUAL runs only.

set -uo pipefail

REPO="/Users/djwayne/9takes"
QUEUE="$REPO/docs/blog-automation/backlog-queue.json"
OVERRIDE="$REPO/docs/blog-automation/override.json"
DRAFTS="$REPO/src/blog/people/drafts"
LOG_DIR="$REPO/logs/blog-automation"
LOG="$LOG_DIR/cron-$(date +%Y-%m-%d).log"
PIPELINE_LOCK="$REPO/docs/content-analysis/pipeline-logs/.pipeline.lock"
TELEGRAM_TOKEN_FILE="${TELEGRAM_TOKEN_FILE:-$HOME/.openclaw/credentials/telegram-ninetakes.token}"
TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID:--1003724832638}"
NOW_ISO="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
DRY_RUN=0
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=1

mkdir -p "$LOG_DIR"

log() {
  local level="$1"; shift
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$level] $*" | tee -a "$LOG"
}

# Send a Telegram message directly via the Bot API. Never fails the run.
notify() {
  local text="$1"
  log INFO "NOTIFY: $text"
  [[ "$(jq -r '.notifications.enabled' "$OVERRIDE")" == "true" ]] || return 0
  [[ -f "$TELEGRAM_TOKEN_FILE" ]] || { log WARN "No Telegram token file at $TELEGRAM_TOKEN_FILE — alert logged only"; return 0; }
  local token
  token="$(tr -d '[:space:]' < "$TELEGRAM_TOKEN_FILE")"
  curl -s -m 20 "https://api.telegram.org/bot${token}/sendMessage" \
    --data-urlencode "chat_id=${TELEGRAM_CHAT_ID}" \
    --data-urlencode "text=${text}" > /dev/null 2>&1 \
    || log WARN "Telegram send failed (message logged above)"
}

# Atomic queue write: jq program + args, validate before replacing.
queue_update() {
  local tmp
  tmp="$(mktemp)"
  if jq "$@" "$QUEUE" > "$tmp" && jq empty "$tmp" 2>/dev/null; then
    mv "$tmp" "$QUEUE"
  else
    rm -f "$tmp"
    log ERROR "Queue update failed jq validation — queue NOT modified (args: $*)"
    notify "9takes nightly blog: queue update FAILED validation; manual check needed."
    exit 1
  fi
}

override_update() {
  local tmp
  tmp="$(mktemp)"
  if jq "$@" "$OVERRIDE" > "$tmp" && jq empty "$tmp" 2>/dev/null; then
    mv "$tmp" "$OVERRIDE"
  else
    rm -f "$tmp"
    log ERROR "override.json update failed jq validation — NOT modified (args: $*)"
  fi
}

log INFO "Nightly blog cron starting (dry-run=$DRY_RUN)"

# ── Preflight 1: manual pause ───────────────────────────────────────────────
if [[ "$(jq -r '.pause' "$OVERRIDE")" == "true" ]]; then
  log INFO "AUTOMATION PAUSED: $(jq -r '.reason // "no reason given"' "$OVERRIDE")"
  log INFO "Nightly blog cron finished"
  exit 0
fi

# ── Preflight 2: inProgress reconciliation ─────────────────────────────────
# Deterministic version of the rule that LLM runs applied inconsistently.
in_progress_name="$(jq -r '.inProgress.name // empty' "$QUEUE")"
if [[ -n "$in_progress_name" ]]; then
  lock_pid="$(cat "$PIPELINE_LOCK/pid" 2>/dev/null || echo "")"
  if [[ -n "$lock_pid" ]] && kill -0 "$lock_pid" 2>/dev/null; then
    log INFO "BLOG IN PROGRESS: $in_progress_name — pipeline pid $lock_pid is alive; skipping tonight"
    log INFO "Nightly blog cron finished"
    exit 0
  fi
  # No live pipeline. Draft present → finished but never reconciled; absent → dead launch.
  if [[ -f "$DRAFTS/$in_progress_name.md" ]]; then
    log WARN "RECONCILING: $in_progress_name has a draft but was never moved to completed (wrapper likely killed post-pipeline). Moving to completed with needsReview."
    [[ "$DRY_RUN" -eq 1 ]] || queue_update \
      --arg now "$NOW_ISO" \
      '.completed = ([.inProgress + {completedAt: $now, needsReview: true, recoveryNote: "Reconciled by nightly-blog-cron: draft existed but queue was never updated."}] + .completed) | .inProgress = null | .lastUpdated = $now'
  else
    log WARN "DEAD LAUNCH: $in_progress_name has no draft and no live pipeline. Returning to queue with retryCount+1."
    [[ "$DRY_RUN" -eq 1 ]] || queue_update \
      --arg now "$NOW_ISO" \
      '.queue = ([.inProgress
          | .retryCount = ((.retryCount // 0) + 1)
          | .recoveryNote = "Returned to queue by nightly-blog-cron after a dead launch (no draft, no live pipeline)."
          | del(.startedAt)] + .queue)
        | .inProgress = null | .lastUpdated = $now'
  fi
fi

# ── Preflight 3: weekly rate limit ──────────────────────────────────────────
week_start="$(jq -r '.rateLimit.weekStartDate' "$OVERRIDE")"
max_per_week="$(jq -r '.rateLimit.maxPerWeek // 5' "$OVERRIDE")"
week_start_ts="$(date -j -f "%Y-%m-%d" "$week_start" +%s 2>/dev/null || echo 0)"
if (( $(date +%s) - week_start_ts >= 7*24*3600 )); then
  log INFO "Rate-limit week rolled over (was $week_start) — resetting count"
  [[ "$DRY_RUN" -eq 1 ]] || override_update --arg today "$(date +%Y-%m-%d)" \
    '.rateLimit.currentWeekCount = 0 | .rateLimit.weekStartDate = $today'
fi
week_count="$(jq -r '.rateLimit.currentWeekCount' "$OVERRIDE")"
if (( week_count >= max_per_week )); then
  log INFO "RATE LIMIT HIT: $week_count/$max_per_week blogs this week — exiting"
  log INFO "Nightly blog cron finished"
  exit 0
fi

# ── Selection: forceNext, else highest priority without an existing draft ──
person=""
force_next="$(jq -r '.forceNext // empty' "$OVERRIDE")"
if [[ -n "$force_next" ]]; then
  person="$force_next"
  log INFO "Using forced selection: $person"
  [[ "$DRY_RUN" -eq 1 ]] || override_update '.forceNext = null'
else
  while IFS= read -r candidate; do
    if [[ -f "$DRAFTS/$candidate.md" ]]; then
      log INFO "SKIPPED: $candidate — draft already exists"
      [[ "$DRY_RUN" -eq 1 ]] || queue_update --arg name "$candidate" --arg now "$NOW_ISO" \
        '.skipped = ([(.queue[] | select(.name == $name)) + {skippedAt: $now, skipReason: "draft already exists"}] + .skipped)
          | .queue = [.queue[] | select(.name != $name)] | .lastUpdated = $now'
      continue
    fi
    person="$candidate"
    break
  done < <(jq -r '.queue | sort_by(-.priority) | .[].name' "$QUEUE")
fi

if [[ -z "$person" ]]; then
  log ERROR "Queue is empty (or every candidate already has a draft) — nothing to run"
  notify "9takes nightly blog: queue is EMPTY — refill docs/blog-automation/backlog-queue.json"
  log INFO "Nightly blog cron finished"
  exit 0
fi

display_name="$(jq -r --arg n "$person" '.queue[] | select(.name == $n) | .displayName // $n' "$QUEUE")"
etype="$(jq -r --arg n "$person" '.queue[] | select(.name == $n) | .type // "?"' "$QUEUE")"
log INFO "SELECTED: $person (Type $etype)"

if [[ "$DRY_RUN" -eq 1 ]]; then
  log INFO "DRY RUN complete — would run pipeline for $person"
  log INFO "Nightly blog cron finished"
  exit 0
fi

# Move selection to inProgress.
queue_update --arg name "$person" --arg now "$NOW_ISO" \
  '.inProgress = ((.queue[] | select(.name == $name)) + {startedAt: $now})
    | .queue = [.queue[] | select(.name != $name)] | .lastUpdated = $now'

# ── Run the pipeline in its own process group ───────────────────────────────
# set -m gives the child its own process group, so a signal aimed at this
# wrapper (scheduler timeout, group kill) cannot take the pipeline down with
# it. If the wrapper dies while the pipeline lives, the pipeline finishes and
# tomorrow's Preflight 2 reconciles the queue from the draft + lock state.
started_ts="$(date +%s)"
log INFO "Launching pipeline for $person"
set -m
nohup "$REPO/scripts/run-blog-pipeline.sh" "$person" >> "$LOG" 2>&1 &
PIPELINE_PID=$!
set +m
wait "$PIPELINE_PID"
pipeline_exit=$?
duration_min=$(( ($(date +%s) - started_ts) / 60 ))
log INFO "Pipeline exited code=$pipeline_exit after ${duration_min} min"

# ── Verify + reconcile queue ────────────────────────────────────────────────
NOW_ISO="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
draft="$DRAFTS/$person.md"
if [[ -f "$draft" ]]; then
  overall="$(awk '/^---$/{fm++;next} fm==1 && /^content_quality:/{cq=1;next} fm==1 && cq && $0!~/^[[:space:]]/{cq=0} fm==1 && cq && $1=="overall:"{gsub(/[^0-9.]/,"",$2); print $2; exit}' "$draft")"
  letter="$(awk '/^---$/{fm++;next} fm==1 && /^content_quality:/{cq=1;next} fm==1 && cq && $0!~/^[[:space:]]/{cq=0} fm==1 && cq && $1=="letter:"{gsub(/['"'"']/,"",$2); print $2; exit}' "$draft")"
  disc="$(awk '/^---$/{fm++;next} fm==1 && /^content_quality:/{cq=1;next} fm==1 && cq && $0!~/^[[:space:]]/{cq=0} fm==1 && cq && $1=="discoverability:"{gsub(/[^0-9.]/,"",$2); print $2; exit}' "$draft")"
  needs_review="false"
  # No grade, or a low one, means a human should look before anything downstream.
  if [[ -z "$overall" ]] || awk -v o="${overall:-0}" 'BEGIN { exit !(o < 8.5) }'; then
    needs_review="true"
  fi
  latest_log_dir="$(ls -dt "$REPO/docs/content-analysis/pipeline-logs/"*"_$person" 2>/dev/null | head -1)"
  if [[ -n "$latest_log_dir" && -f "$latest_log_dir/FAILED_AT_STAGE" ]]; then
    needs_review="true"
    log WARN "Pipeline left a FAILED_AT_STAGE sentinel: $(cat "$latest_log_dir/FAILED_AT_STAGE")"
  fi
  queue_update --arg now "$NOW_ISO" --arg grade "${overall:-ungraded}" --arg letter "${letter:-?}" \
    --arg disc "${disc:-?}" --arg dur "~${duration_min} min" --argjson review "$needs_review" \
    '.completed = ([.inProgress + {completedAt: $now, contentGrade: $grade, letter: $letter, discoverability: $disc, duration: $dur, needsReview: $review}] + .completed)
      | .inProgress = null | .lastUpdated = $now'
  override_update '.rateLimit.currentWeekCount = (.rateLimit.currentWeekCount + 1)'
  log SUCCESS "Completed: $display_name — grade ${overall:-ungraded} (${letter:-?})"
  notify "✅ 9takes nightly blog: $display_name (Type $etype) — grade ${overall:-ungraded} (${letter:-?}), disc ${disc:-?}, ${duration_min} min. needsReview=$needs_review"
else
  retry_count="$(jq -r '.inProgress.retryCount // 0' "$QUEUE")"
  new_retry=$(( retry_count + 1 ))
  if (( new_retry >= 3 )); then
    queue_update --arg now "$NOW_ISO" --argjson rc "$new_retry" \
      '.failed = ((.failed // []) + [.inProgress + {failedAt: $now, retryCount: $rc, error: "no draft after pipeline run"}])
        | .inProgress = null | .lastUpdated = $now'
    log ERROR "MOVED TO FAILED: $person after $new_retry attempts (no draft)"
    notify "❌ 9takes nightly blog: $display_name FAILED permanently ($new_retry attempts, no draft). Check pipeline logs."
  else
    queue_update --arg now "$NOW_ISO" --argjson rc "$new_retry" \
      '.queue = ([.inProgress | .retryCount = $rc | del(.startedAt)] + .queue)
        | .inProgress = null | .lastUpdated = $now'
    log ERROR "RETRY $new_retry/3: $person returned to queue (no draft)"
    notify "⚠️ 9takes nightly blog: $display_name produced no draft (exit=$pipeline_exit). Retry $new_retry/3 tomorrow."
  fi
fi

log INFO "Nightly blog cron finished"
