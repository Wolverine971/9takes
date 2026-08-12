#!/usr/bin/env bash
# scripts/run-blog-pipeline.sh
#
# Run the full 9takes personality-blog pipeline for one person.
# Each stage runs as a separate `claude -p` invocation, so every stage gets
# a fresh context. The markdown draft and its non-served grade-feedback sidecar
# under docs/content-analysis/grades/ pass state between the grading stages.
#
# Three modes. `--refresh` updates an existing live page instead of creating a draft.
# It exists because refreshes used to be hand-rolled from taskers, taskers are written
# as lists of things to ADD, and by 2026-07-25 the most-refreshed pages in the corpus
# were also the longest (hasan-piker had reached 8,881 words; 90 of 391 published
# pages sat over the 4,500-word ceiling). Creation had gates. Maintenance had prose.
# `--resume` skips stage 1 for a draft already created by a partial run. Refresh mode
# swaps stage 1 and skips stage 3; every other gate is identical.
#
# Pipeline:
#   0.5 entity_gap_brief  - live SERP + biography-intent packet used by writing stages
#   1. create             - /blog_content_creator_people_v2 (non-interactive)
#      (--refresh)        - /blog_refresh_people
#   2. fresh_eyes         - /blog_content_fresh_eyes_people
#   3. second_pass        - /blog_content_second_pass_people  (SKIPPED in --refresh)
#   4. cohesion           - /cohesion-check
#   4.1 snapshot          - freeze the exact draft all perspective reviewers audit
#   4.2 evidence_packet   - shared factual baseline (one research pass)
#   4.4 perspective_jury  - six isolated role reviews in parallel
#   4.6 synthesis         - adjudicate flags, improvements, conflicts, and protected hits
#   5. editor_pass        - /blog_content_editor_pass_people
#   6. enrich_frontmatter - /blog_content_frontmatter_enrich_people
#   6.1 perspective_verify- independently verify final editorial metadata, repairs,
#                           and protected-hit regressions
#   6.5 lint              - scripts/blog-lint.sh (deterministic checks, no LLM)
#   7. grade              - /grade_blog
#   8. revise             - /blog_content_revision_pass_people  (CONDITIONAL — only if
#                           overall < 8.5, discoverability < 7, or lint failed)
#   8.5 lint (re-run)     - scripts/blog-lint.sh
#   9. regrade            - /grade_blog (after revision when needed, otherwise as
#                           the independent stability pass required by the gate)
#   9.1 stability regrade - /grade_blog (revision path only; grades the final text
#                           a second time so improvement is not called instability)
#   9.2 stability record  - deterministic same-version first/regrade/delta write
#   9.8 perspective final - bind the passing review to the final reader-visible body;
#                           publishing rejects missing, unresolved, or stale reviews
#
# The revise loop runs AT MOST ONCE. If the re-grade still lands below the bar,
# the draft stays below the bar and a human decides — no infinite polishing.
#
# Usage:
#   ./scripts/run-blog-pipeline.sh <Person-Name>              # create a new draft
#   ./scripts/run-blog-pipeline.sh <Person-Name> --resume     # continue an existing draft
#   ./scripts/run-blog-pipeline.sh <Person-Name> --refresh    # update a live page
#   e.g. ./scripts/run-blog-pipeline.sh Martha-Stewart
#        ./scripts/run-blog-pipeline.sh Hasan-Piker --refresh
#
# Notes:
#   - Run-all-then-report: if a stage errors, the pipeline keeps going.
#     Check the per-stage log files for failures.
#   - Re-running on an already-graded blog: the pipeline strips any existing
#     `content_quality:` block from the draft frontmatter and the prior review
#     sidecar just before each grade stage, so re-runs start without grade anchoring.
#

set -uo pipefail

PERSON=""
MODE="create"
for arg in "$@"; do
  case "$arg" in
    --refresh) MODE="refresh" ;;
    --resume)  MODE="resume" ;;
    --create)  MODE="create" ;;
    -*) echo "Unknown flag: $arg" >&2; exit 1 ;;
    *) if [[ -z "$PERSON" ]]; then PERSON="$arg"; fi ;;
  esac
done
if [[ -z "$PERSON" ]]; then
  echo "Usage: $0 <Person-Name> [--resume | --refresh]" >&2
  echo "  create  (default): $0 Martha-Stewart" >&2
  echo "  resume           : $0 StableRonaldo --resume" >&2
  echo "  refresh          : $0 Hasan-Piker --refresh" >&2
  echo >&2
  echo "  --refresh updates an existing live page instead of writing a new draft." >&2
  echo "  It swaps stage 1 to /blog_refresh_people and skips stage 3 (second_pass," >&2
  echo "  which deepens a fresh draft and has nothing to do on an established one)." >&2
  echo "  Every gate, the grade, and the revise-and-regrade loop are identical." >&2
  exit 1
fi

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DRAFTS_DIR="$REPO_ROOT/src/blog/people/drafts"
# shellcheck source=scripts/lib/person-draft-path.sh
source "$REPO_ROOT/scripts/lib/person-draft-path.sh"
TIMESTAMP="$(date +%Y-%m-%d_%H%M%S)"
LOG_DIR="$REPO_ROOT/docs/content-analysis/pipeline-logs/${TIMESTAMP}_${PERSON}"

# ── Lock: one pipeline at a time (mkdir is atomic; macOS has no flock) ──────
LOCK_DIR="$REPO_ROOT/docs/content-analysis/pipeline-logs/.pipeline.lock"
if ! mkdir "$LOCK_DIR" 2>/dev/null; then
  LOCK_PID="$(cat "$LOCK_DIR/pid" 2>/dev/null || echo "")"
  if [[ -n "$LOCK_PID" ]] && kill -0 "$LOCK_PID" 2>/dev/null; then
    echo "Another pipeline run (pid $LOCK_PID, $(cat "$LOCK_DIR/person" 2>/dev/null)) is active. Exiting." >&2
    exit 2
  fi
  echo "Stale lock found (pid ${LOCK_PID:-unknown} not running) — taking over." >&2
  rm -rf "$LOCK_DIR"
  mkdir "$LOCK_DIR" || { echo "Could not acquire lock after stale cleanup." >&2; exit 2; }
fi
echo $$ > "$LOCK_DIR/pid"
echo "$PERSON" > "$LOCK_DIR/person"

# ── Failure sentinel: if we exit before COMPLETED=1, record where we died ──
CURRENT_STAGE="startup"
PIPELINE_COMPLETED=0
on_exit() {
  local code=$?
  if [[ "$PIPELINE_COMPLETED" -ne 1 ]]; then
    echo "stage=$CURRENT_STAGE exit=$code died_at=$(date '+%Y-%m-%d %H:%M:%S')" > "$LOG_DIR/FAILED_AT_STAGE" 2>/dev/null
  fi
  rm -rf "$LOCK_DIR"
}
trap on_exit EXIT

mkdir -p "$LOG_DIR"

DRAFT_PATH="src/blog/people/drafts/${PERSON}.md"
DRAFT_SUBJECT="$PERSON"
DRAFT_EXISTS=0

set_canonical_draft_path() {
  local resolved rc
  resolved="$(resolve_person_draft_path "$DRAFTS_DIR" "$PERSON")"
  rc=$?
  if [[ "$rc" -eq 0 ]]; then
    DRAFT_PATH="${resolved#$REPO_ROOT/}"
    DRAFT_SUBJECT="$(basename "$resolved" .md)"
    DRAFT_EXISTS=1
    return 0
  fi
  if [[ "$rc" -eq 2 ]]; then
    echo "Cannot safely resolve draft for '$PERSON'; see ambiguity above." >&2
    exit 1
  fi
  DRAFT_EXISTS=0
  return 1
}

set_canonical_draft_path || true

run_stage() {
  local stage_num="$1"
  local stage_name="$2"
  local command="$3"
  local log_file="$LOG_DIR/${stage_num}_${stage_name}.log"
  local started_at start_epoch
  started_at="$(date +%H:%M:%S)"
  start_epoch="$(date +%s)"

  CURRENT_STAGE="${stage_num}_${stage_name}"

  echo "─────────────────────────────────────────────────────"
  echo "[Stage $stage_num] $stage_name  (started $started_at)"
  echo "Command: $command"
  echo "Log:     $log_file"
  echo "─────────────────────────────────────────────────────"

  claude -p "$command" --dangerously-skip-permissions 2>&1 | tee "$log_file"
  local exit_code="${PIPESTATUS[0]}"

  local finished_at dur
  finished_at="$(date +%H:%M:%S)"
  dur=$(( $(date +%s) - start_epoch ))
  echo "[Stage $stage_num] $stage_name finished $finished_at (exit=$exit_code, ${dur}s)"
  echo

  # Structured per-stage record: one tab-separated line per stage.
  printf '%s\t%s\t%s\t%ss\n' "$stage_num" "$stage_name" "$exit_code" "$dur" \
    >> "$LOG_DIR/stage-summary.tsv"
  # A stage that errored but did NOT kill the run is a warning, not a crash.
  if [[ "$exit_code" -ne 0 ]]; then
    printf 'stage=%s_%s exit=%s dur=%ss at=%s\n' \
      "$stage_num" "$stage_name" "$exit_code" "$dur" "$(date '+%Y-%m-%d %H:%M:%S')" \
      >> "$LOG_DIR/STAGE_WARNINGS"
  fi

  # Always continue — user chose run-all-then-report.
  return 0
}

echo "═════════════════════════════════════════════════════"
echo "9takes blog pipeline"
echo "Mode:    $MODE"
echo "Person:  $PERSON"
echo "Draft:   $DRAFT_PATH"
echo "Logs:    $LOG_DIR"
echo "Started: $(date)"
echo "═════════════════════════════════════════════════════"
echo

clear_grading_frontmatter() {
  local file="$REPO_ROOT/$DRAFT_PATH"
  local feedback_file="$REPO_ROOT/docs/content-analysis/grades/${DRAFT_SUBJECT}.review.md"
  if [[ ! -f "$file" ]]; then
    echo "[pre-grade] Draft not found at $file, skipping grade-block cleanup"
    return 0
  fi
  if grep -q "^content_quality:" "$file"; then
    echo "[pre-grade] Stripping existing content_quality block from $DRAFT_PATH for a clean re-grade"
    awk '
      /^---$/ { fm_boundary++; print; next }
      fm_boundary == 1 && /^content_quality:[[:space:]]*$/ { in_block = 1; next }
      fm_boundary == 1 && in_block && /^[[:space:]]/ { next }
      fm_boundary == 1 && in_block { in_block = 0 }
      { print }
    ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
  else
    echo "[pre-grade] No existing content_quality block on draft"
  fi
  # Also strip prior QUALITY GRADE HTML comments so the re-grade is not
  # anchored by the previous grader's scores (and stacked comments don't
  # accumulate). Removes every such comment, wherever it sits in the body.
  if grep -q "<!-- QUALITY GRADE" "$file"; then
    echo "[pre-grade] Stripping prior QUALITY GRADE comment(s) from $DRAFT_PATH"
    awk '
      /^<!-- QUALITY GRADE/ { in_grade = 1 }
      in_grade { if (/-->[[:space:]]*$/) in_grade = 0; next }
      { print }
    ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
  fi
  if [[ -f "$feedback_file" ]]; then
    echo "[pre-grade] Removing prior grade-feedback sidecar for $DRAFT_SUBJECT"
    rm -f "$feedback_file"
  fi
}

write_summary() {
  local completed="$1"
  local halt_reason="${2:-}"
  local final_overall final_disc
  final_overall="$(read_quality_field overall)"
  final_disc="$(read_quality_field discoverability)"

  SUMMARY_PATH="$LOG_DIR/summary.json" \
  PERSON="$PERSON" \
  DRAFT_PATH="$DRAFT_PATH" \
  ENTITY_GAP_BRIEF_REL="${ENTITY_GAP_BRIEF_REL:-}" \
  PIPELINE_LOG_DIR="$LOG_DIR" \
  PERSPECTIVE_REVIEW_DIR="${PERSPECTIVE_REVIEW_DIR_REL:-}" \
  PERSPECTIVE_INITIAL_STATUS="${PERSPECTIVE_INITIAL_STATUS:-not_run}" \
  PERSPECTIVE_FINAL_STATUS="${PERSPECTIVE_FINAL_STATUS:-not_run}" \
  FIRST_OVERALL="${STABILITY_FIRST_OVERALL:-${FIRST_OVERALL:-}}" \
  FINAL_OVERALL="${final_overall:-}" \
  FINAL_DISCOVERABILITY="${final_disc:-}" \
  LINT_EXIT="${LINT_EXIT:-0}" \
  REVISED="$REVISED" \
  COMPLETED="$completed" \
  HALT_REASON="$halt_reason" \
  HAS_STAGE_WARNINGS="$([[ -f "$LOG_DIR/STAGE_WARNINGS" ]] && echo true || echo false)" \
  node -e '
const fs = require("fs");
const env = process.env;
const num = (value) => value === "" || value == null ? null : Number(value);
const summary = {
  person: env.PERSON,
  draft_path: env.DRAFT_PATH,
  entity_gap_brief: env.ENTITY_GAP_BRIEF_REL || null,
  log_dir: env.PIPELINE_LOG_DIR,
  perspective_review_dir: env.PERSPECTIVE_REVIEW_DIR || null,
  perspective_initial_status: env.PERSPECTIVE_INITIAL_STATUS || "not_run",
  perspective_final_status: env.PERSPECTIVE_FINAL_STATUS || "not_run",
  completed: env.COMPLETED === "true",
  halt_reason: env.HALT_REASON || null,
  revised: env.REVISED === "1",
  lint_exit: Number(env.LINT_EXIT || 0),
  first_overall: num(env.FIRST_OVERALL),
  final_overall: num(env.FINAL_OVERALL),
  final_discoverability: num(env.FINAL_DISCOVERABILITY),
  grade_stability_delta:
    env.FIRST_OVERALL && env.FINAL_OVERALL
      ? Math.abs(Number(env.FIRST_OVERALL) - Number(env.FINAL_OVERALL))
      : null,
  has_stage_warnings: env.HAS_STAGE_WARNINGS === "true",
  generated_at: new Date().toISOString()
};
fs.writeFileSync(env.SUMMARY_PATH, JSON.stringify(summary, null, 2) + "\n");
'
  echo "Summary JSON: $LOG_DIR/summary.json"
}

run_lint() {
  local stage_label="${1:-6.5}"
  local log_file="$LOG_DIR/${stage_label}_lint.log"
  local start_epoch
  start_epoch="$(date +%s)"
  echo "─────────────────────────────────────────────────────"
  echo "[Stage $stage_label] lint (deterministic checks — scripts/blog-lint.sh)"
  echo "Log:     $log_file"
  echo "─────────────────────────────────────────────────────"
  "$REPO_ROOT/scripts/blog-lint.sh" "$DRAFT_PATH" 2>&1 | tee "$log_file"
  LINT_EXIT="${PIPESTATUS[0]}"
  if [[ "$LINT_EXIT" -ne 0 ]]; then
    echo "[Stage $stage_label] lint FAILED (exit=$LINT_EXIT) — failures listed above; pipeline continues (run-all-then-report)"
  else
    echo "[Stage $stage_label] lint passed"
  fi
  local dur
  dur=$(( $(date +%s) - start_epoch ))
  printf '%s\t%s\t%s\t%ss\n' "$stage_label" "lint" "$LINT_EXIT" "$dur" \
    >> "$LOG_DIR/stage-summary.tsv"
  if [[ "$LINT_EXIT" -ne 0 ]]; then
    printf 'stage=%s_lint exit=%s dur=%ss at=%s\n' \
      "$stage_label" "$LINT_EXIT" "$dur" "$(date '+%Y-%m-%d %H:%M:%S')" \
      >> "$LOG_DIR/STAGE_WARNINGS"
  fi
  echo
}

run_report_stage() {
  local stage_label="$1"
  local stage_name="$2"
  shift 2
  local log_file="$LOG_DIR/${stage_label}_${stage_name}.log"
  local started_at start_epoch
  started_at="$(date +%H:%M:%S)"
  start_epoch="$(date +%s)"

  CURRENT_STAGE="${stage_label}_${stage_name}"

  echo "─────────────────────────────────────────────────────"
  echo "[Stage $stage_label] $stage_name  (started $started_at)"
  echo "Command: $*"
  echo "Log:     $log_file"
  echo "─────────────────────────────────────────────────────"

  "$@" 2>&1 | tee "$log_file"
  local exit_code="${PIPESTATUS[0]}"
  LAST_REPORT_EXIT="$exit_code"

  local dur
  dur=$(( $(date +%s) - start_epoch ))
  printf '%s\t%s\t%s\t%ss\n' "$stage_label" "$stage_name" "$exit_code" "$dur" \
    >> "$LOG_DIR/stage-summary.tsv"
  if [[ "$exit_code" -ne 0 ]]; then
    REPORT_WARNINGS=1
    printf 'stage=%s_%s exit=%s dur=%ss at=%s\n' \
      "$stage_label" "$stage_name" "$exit_code" "$dur" "$(date '+%Y-%m-%d %H:%M:%S')" \
      >> "$LOG_DIR/STAGE_WARNINGS"
  fi
  echo "[Stage $stage_label] $stage_name finished (exit=$exit_code, ${dur}s)"
  echo

  return 0
}

run_parallel_perspective_reviews() {
  local stage_label="4.4"
  local perspectives=(subject fan critic unfamiliar enneagram future)
  local pids=()
  local starts=()
  local logs=()
  local i perspective command log_file rc dur

  CURRENT_STAGE="${stage_label}_perspective_jury"
  PERSPECTIVE_PARALLEL_EXIT=0

  echo "─────────────────────────────────────────────────────"
  echo "[Stage $stage_label] perspective_jury (six isolated reviews in parallel)"
  echo "Snapshot: $PERSPECTIVE_REVIEW_DIR_REL/draft-reviewed.md"
  echo "Evidence: $PERSPECTIVE_REVIEW_DIR_REL/evidence-packet.md"
  echo "─────────────────────────────────────────────────────"

  for i in "${!perspectives[@]}"; do
    perspective="${perspectives[$i]}"
    command="/blog_perspective_review_people $DRAFT_SUBJECT --perspective=$perspective --review-dir=$PERSPECTIVE_REVIEW_DIR_REL --draft-sha=$PERSPECTIVE_DRAFT_SHA"
    log_file="$LOG_DIR/${stage_label}_perspective_${perspective}.log"
    logs[$i]="$log_file"
    starts[$i]="$(date +%s)"
    echo "  starting $perspective → $log_file"
    (
      claude -p "$command" --dangerously-skip-permissions 2>&1 | tee "$log_file" >/dev/null
      exit "${PIPESTATUS[0]}"
    ) &
    pids[$i]=$!
  done

  for i in "${!perspectives[@]}"; do
    perspective="${perspectives[$i]}"
    if wait "${pids[$i]}"; then
      rc=0
    else
      rc=$?
      PERSPECTIVE_PARALLEL_EXIT=1
      REPORT_WARNINGS=1
    fi
    dur=$(( $(date +%s) - starts[$i] ))
    printf '%s\t%s\t%s\t%ss\n' "$stage_label" "perspective_$perspective" "$rc" "$dur" \
      >> "$LOG_DIR/stage-summary.tsv"
    if [[ "$rc" -ne 0 ]]; then
      printf 'stage=%s_perspective_%s exit=%s dur=%ss at=%s\n' \
        "$stage_label" "$perspective" "$rc" "$dur" "$(date '+%Y-%m-%d %H:%M:%S')" \
        >> "$LOG_DIR/STAGE_WARNINGS"
      echo "  $perspective FAILED (exit=$rc, ${dur}s) — see ${logs[$i]}"
    else
      echo "  $perspective finished (${dur}s)"
    fi
  done
  echo
}

# Pull a numeric score out of the draft's content_quality block ("" if absent).
read_quality_field() {
  local field="$1"
  local file="$REPO_ROOT/$DRAFT_PATH"
  [[ -f "$file" ]] || { echo ""; return 0; }
  awk -v key="$field" '
    /^---$/ { fm++; next }
    fm == 1 && /^content_quality:/ { in_cq = 1; next }
    fm == 1 && in_cq && $0 !~ /^[[:space:]]/ { in_cq = 0 }
    fm == 1 && in_cq && $1 == key":" { gsub(/[^0-9.]/, "", $2); print $2; exit }
  ' "$file"
}

# Decide whether the revise loop should fire. Prints the reason(s), returns 0 if needed.
revision_needed() {
  REVISION_REASONS=""
  local overall disc
  overall="$(read_quality_field overall)"
  disc="$(read_quality_field discoverability)"

  if [[ -z "$overall" ]]; then
    REVISION_REASONS="no grade found (grade stage may have failed)"
    return 1  # nothing to revise against — skip the loop rather than revise blind
  fi
  if awk -v o="$overall" 'BEGIN { exit !(o < 8.5) }'; then
    REVISION_REASONS+="overall $overall < 8.5; "
  fi
  if [[ -n "$disc" ]] && awk -v d="$disc" 'BEGIN { exit !(d < 7) }'; then
    REVISION_REASONS+="discoverability $disc < 7; "
  fi
  if [[ "$LINT_EXIT" -ne 0 ]]; then
    REVISION_REASONS+="lint failures; "
  fi
  if [[ "$REPORT_WARNINGS" -ne 0 ]]; then
    REVISION_REASONS+="deterministic report warnings; "
  fi
  [[ -n "$REVISION_REASONS" ]]
}

LINT_EXIT=0
REPORT_WARNINGS=0
LAST_REPORT_EXIT=0
REVISION_REASONS=""
REVISED=0
FIRST_OVERALL=""
FIRST_DISC=""
POST_REVISION_FIRST_OVERALL=""
STABILITY_FIRST_OVERALL=""
PERSPECTIVE_REVIEW_DIR=""
PERSPECTIVE_REVIEW_DIR_REL=""
PERSPECTIVE_DRAFT_SHA=""
PERSPECTIVE_READY=0
PERSPECTIVE_PARALLEL_EXIT=0
PERSPECTIVE_INITIAL_STATUS="not_run"
PERSPECTIVE_FINAL_STATUS="not_run"
PERSPECTIVE_VERIFICATION_FILE=""
ENTITY_GAP_BRIEF_REL="docs/content-analysis/entity-gaps/${DRAFT_SUBJECT}.md"

# The entity-gap packet is advisory, not a publication gate. Strong-serp subjects can
# still deserve profiles; the packet tells later stages which biography intent exists,
# which competitors are entrenched, and which unsupported facts to avoid.
mkdir -p "$REPO_ROOT/docs/content-analysis/entity-gaps"
run_stage 0.5 entity_gap_brief \
  "/find-emerging-entity-gaps $DRAFT_SUBJECT --single --non-interactive"

if [[ "$MODE" == "refresh" ]]; then
  # A refresh edits a live page. If the draft is missing there is nothing to refresh,
  # and running the creator instead would silently overwrite a ranking page.
  if [[ ! -f "$REPO_ROOT/$DRAFT_PATH" ]]; then
    echo "[Stage 1] --refresh requires an existing draft at $DRAFT_PATH; nothing to refresh."
    write_summary false "draft_missing_for_refresh"
    exit 1
  fi
  BASELINE_WORDS="$(awk '/^---$/{c++; next} c>=2' "$REPO_ROOT/$DRAFT_PATH" \
    | awk 'BEGIN{inc=0} /<!--/{inc=1} inc{if (/-->/) inc=0; next} {print}' \
    | sed -E 's/<[^>]+>/ /g' | wc -w | tr -d ' ')"
  echo "[refresh] baseline body length: ${BASELINE_WORDS} words (ceiling 4500)"
  run_stage 1 refresh          "/blog_refresh_people $DRAFT_SUBJECT --entity-gap-brief=$ENTITY_GAP_BRIEF_REL"
elif [[ "$MODE" == "resume" ]]; then
  if [[ "$DRAFT_EXISTS" -ne 1 || ! -f "$REPO_ROOT/$DRAFT_PATH" ]]; then
    echo "[Stage 1] --resume requires an existing draft matching '$PERSON'; nothing to resume."
    write_summary false "draft_missing_for_resume"
    exit 1
  fi
  echo "[Stage 1] create skipped in resume mode; continuing existing draft at $DRAFT_PATH"
  echo
else
  if [[ "$DRAFT_EXISTS" -eq 1 ]]; then
    echo "[Stage 1] Existing draft resolved at $DRAFT_PATH; refusing to run the creator over it."
    echo "Use --resume to continue the pipeline or --refresh to update a live page."
    write_summary false "existing_draft_requires_explicit_mode"
    exit 1
  fi
  run_stage 1 create           "/blog_content_creator_people_v2 $PERSON --non-interactive --entity-gap-brief=$ENTITY_GAP_BRIEF_REL"
  if ! set_canonical_draft_path || [[ ! -f "$REPO_ROOT/$DRAFT_PATH" ]]; then
    echo "[Stage 1] create did not produce a draft matching '$PERSON'; halting remaining stages."
    write_summary false "draft_missing_after_stage_1_create"
    exit 1
  fi
fi
run_stage 2 fresh_eyes         "/blog_content_fresh_eyes_people $DRAFT_SUBJECT --entity-gap-brief=$ENTITY_GAP_BRIEF_REL"
if [[ "$MODE" != "refresh" ]]; then
  run_stage 3 second_pass      "/blog_content_second_pass_people $DRAFT_SUBJECT"
else
  echo "[Stage 3] second_pass skipped in refresh mode (it deepens a fresh draft)"
  echo
fi
run_stage 4 cohesion           "/cohesion-check $DRAFT_PATH"

# ── Stage 4.1–4.7: independent audience-perspective jury ────────────────
# Every reviewer receives the same immutable draft snapshot and shared evidence
# packet, but no reviewer sees another review. The six calls run concurrently.
PERSPECTIVE_REVIEW_DIR="$REPO_ROOT/docs/content-analysis/perspective-reviews/$DRAFT_SUBJECT/$TIMESTAMP"
PERSPECTIVE_REVIEW_DIR_REL="${PERSPECTIVE_REVIEW_DIR#$REPO_ROOT/}"

run_report_stage 4.1 perspective_snapshot \
  node "$REPO_ROOT/scripts/perspective-review-gate.mjs" \
  --phase snapshot --draft "$DRAFT_PATH" --review-dir "$PERSPECTIVE_REVIEW_DIR_REL" --subject "$DRAFT_SUBJECT"

if [[ "$LAST_REPORT_EXIT" -eq 0 && -f "$PERSPECTIVE_REVIEW_DIR/draft-reviewed.md" ]]; then
  PERSPECTIVE_DRAFT_SHA="$(shasum -a 256 "$PERSPECTIVE_REVIEW_DIR/draft-reviewed.md" | awk '{print $1}')"
  run_stage 4.2 perspective_evidence \
    "/blog_perspective_research_people $DRAFT_SUBJECT --review-dir=$PERSPECTIVE_REVIEW_DIR_REL --draft-sha=$PERSPECTIVE_DRAFT_SHA"
  run_report_stage 4.3 perspective_packet_gate \
    node "$REPO_ROOT/scripts/perspective-review-gate.mjs" \
    --phase packet --review-dir "$PERSPECTIVE_REVIEW_DIR_REL"

  if [[ "$LAST_REPORT_EXIT" -eq 0 ]]; then
    run_parallel_perspective_reviews
    run_report_stage 4.5 perspective_reviews_gate \
      node "$REPO_ROOT/scripts/perspective-review-gate.mjs" \
      --phase reviews --review-dir "$PERSPECTIVE_REVIEW_DIR_REL"

    if [[ "$LAST_REPORT_EXIT" -eq 0 ]]; then
      run_stage 4.6 perspective_synthesis \
        "/blog_perspective_synthesis_people $DRAFT_SUBJECT --review-dir=$PERSPECTIVE_REVIEW_DIR_REL --draft-sha=$PERSPECTIVE_DRAFT_SHA"
      run_report_stage 4.7 perspective_synthesis_gate \
        node "$REPO_ROOT/scripts/perspective-review-gate.mjs" \
        --phase synthesis --review-dir "$PERSPECTIVE_REVIEW_DIR_REL"
      if [[ "$LAST_REPORT_EXIT" -eq 0 ]]; then
        PERSPECTIVE_READY=1
      else
        PERSPECTIVE_FINAL_STATUS="synthesis_invalid"
      fi
    else
      PERSPECTIVE_FINAL_STATUS="reviews_incomplete"
    fi
  else
    PERSPECTIVE_FINAL_STATUS="packet_invalid"
  fi
else
  PERSPECTIVE_FINAL_STATUS="snapshot_failed"
fi

EDITOR_COMMAND="/blog_content_editor_pass_people $DRAFT_SUBJECT"
if [[ "$PERSPECTIVE_READY" -eq 1 ]]; then
  EDITOR_COMMAND+=" --perspective-review-dir=$PERSPECTIVE_REVIEW_DIR_REL"
fi
run_stage 5 editor_pass "$EDITOR_COMMAND"

if [[ "$PERSPECTIVE_READY" -eq 1 ]]; then
  run_report_stage 5.05 perspective_editor_resolution_gate \
    node "$REPO_ROOT/scripts/perspective-review-gate.mjs" \
    --phase resolution --review-dir "$PERSPECTIVE_REVIEW_DIR_REL" \
    --resolution-file editor-resolution.md
fi

run_stage 6 enrich_frontmatter "/blog_content_frontmatter_enrich_people $DRAFT_SUBJECT"

if [[ "$PERSPECTIVE_READY" -eq 1 ]]; then
  run_stage 6.1 perspective_verify \
    "/blog_perspective_verify_people $DRAFT_SUBJECT --review-dir=$PERSPECTIVE_REVIEW_DIR_REL --draft-sha=$PERSPECTIVE_DRAFT_SHA --output=verification-initial.md"
  run_report_stage 6.2 perspective_verification_gate \
    node "$REPO_ROOT/scripts/perspective-review-gate.mjs" \
    --phase verification --draft "$DRAFT_PATH" --review-dir "$PERSPECTIVE_REVIEW_DIR_REL" \
    --verification-file verification-initial.md
  PERSPECTIVE_VERIFICATION_FILE="verification-initial.md"
  if [[ "$LAST_REPORT_EXIT" -eq 0 ]]; then
    PERSPECTIVE_INITIAL_STATUS="pass"
    PERSPECTIVE_FINAL_STATUS="pass_pending_finalization"
  else
    PERSPECTIVE_INITIAL_STATUS="fail"
    PERSPECTIVE_FINAL_STATUS="needs_revision"
  fi
fi

run_lint 6.5
run_report_stage 6.6 quality_report node "$REPO_ROOT/scripts/blog-quality-report.mjs" "$DRAFT_PATH"
run_report_stage 6.7 source_audit node "$REPO_ROOT/scripts/blog-source-audit.mjs" "$DRAFT_PATH" --fail-on-untagged-load-bearing
run_report_stage 6.8 same_type_similarity node "$REPO_ROOT/scripts/same-type-similarity.mjs" "$DRAFT_PATH" --n 8 --fail-on-trip
clear_grading_frontmatter
run_stage 7 grade              "/grade_blog $DRAFT_SUBJECT"

# ── Stage 8/9: revise-and-regrade loop (at most once) ─────────────────────
FIRST_OVERALL="$(read_quality_field overall)"
FIRST_DISC="$(read_quality_field discoverability)"

if revision_needed; then
  REVISED=1
  echo "[Stage 8] Revision loop triggered: ${REVISION_REASONS}"
  REVISION_COMMAND="/blog_content_revision_pass_people $DRAFT_SUBJECT"
  if [[ "$PERSPECTIVE_READY" -eq 1 ]]; then
    REVISION_COMMAND+=" --perspective-review-dir=$PERSPECTIVE_REVIEW_DIR_REL"
  fi
  run_stage 8 revise "$REVISION_COMMAND"
  if [[ "$PERSPECTIVE_READY" -eq 1 ]]; then
    run_report_stage 8.2 perspective_revision_resolution_gate \
      node "$REPO_ROOT/scripts/perspective-review-gate.mjs" \
      --phase resolution --review-dir "$PERSPECTIVE_REVIEW_DIR_REL" \
      --resolution-file revision-resolution.md
    run_stage 8.4 perspective_reverify \
      "/blog_perspective_verify_people $DRAFT_SUBJECT --review-dir=$PERSPECTIVE_REVIEW_DIR_REL --draft-sha=$PERSPECTIVE_DRAFT_SHA --output=verification-final.md"
    run_report_stage 8.45 perspective_reverification_gate \
      node "$REPO_ROOT/scripts/perspective-review-gate.mjs" \
      --phase verification --draft "$DRAFT_PATH" --review-dir "$PERSPECTIVE_REVIEW_DIR_REL" \
      --verification-file verification-final.md
    PERSPECTIVE_VERIFICATION_FILE="verification-final.md"
    if [[ "$LAST_REPORT_EXIT" -eq 0 ]]; then
      PERSPECTIVE_FINAL_STATUS="pass_pending_finalization"
    else
      PERSPECTIVE_FINAL_STATUS="fail_after_revision"
    fi
  fi
  run_lint 8.5
  clear_grading_frontmatter
  run_stage 9 post_revision_grade "/grade_blog $DRAFT_SUBJECT"
  POST_REVISION_FIRST_OVERALL="$(read_quality_field overall)"
  if [[ -n "$POST_REVISION_FIRST_OVERALL" ]]; then
    STABILITY_FIRST_OVERALL="$POST_REVISION_FIRST_OVERALL"
    echo "[Stage 9.1] Running independent stability regrade on the final revised text"
    clear_grading_frontmatter
    run_stage 9.1 stability_regrade "/grade_blog $DRAFT_SUBJECT"
  else
    echo "[Stage 9.1] Stability regrade skipped because the post-revision grade produced no overall score"
  fi
else
  if [[ -n "$REVISION_REASONS" ]]; then
    echo "[Stage 8] Skipped revision loop: ${REVISION_REASONS}"
  else
    echo "[Stage 8] No revision needed (overall ${FIRST_OVERALL:-?} >= 8.5, discoverability ${FIRST_DISC:-?} >= 7, lint clean)"
  fi
  echo
  if [[ -n "$FIRST_OVERALL" ]]; then
    STABILITY_FIRST_OVERALL="$FIRST_OVERALL"
    echo "[Stage 9] Running mandatory independent stability regrade required by the publish gate"
    clear_grading_frontmatter
    run_stage 9 regrade "/grade_blog $DRAFT_SUBJECT"
  else
    echo "[Stage 9] Stability regrade skipped because stage 7 produced no overall score"
  fi
fi

FINAL_OVERALL="$(read_quality_field overall)"
if [[ -n "$STABILITY_FIRST_OVERALL" && -n "$FINAL_OVERALL" ]]; then
  run_report_stage 9.2 record_grade_stability \
    node "$REPO_ROOT/scripts/personBlogParser.js" "$DRAFT_SUBJECT" \
    --record-grade-stability "--first-overall=$STABILITY_FIRST_OVERALL"
else
  echo "[Stage 9.2] Grade stability not recorded — same-version first=${STABILITY_FIRST_OVERALL:-missing}, regrade=${FINAL_OVERALL:-missing}"
  echo
fi

echo "═════════════════════════════════════════════════════"
echo "Pipeline complete for: $PERSON"
echo "Finished: $(date)"
echo "All logs: $LOG_DIR"
if [[ "$LINT_EXIT" -ne 0 ]]; then
  echo "LINT: FAILED — see the latest lint log in $LOG_DIR (deterministic rule violations need fixing before publish)"
else
  echo "LINT: passed"
fi
if [[ "$MODE" == "refresh" && -f "$REPO_ROOT/$DRAFT_PATH" ]]; then
  FINAL_WORDS="$(awk '/^---$/{c++; next} c>=2' "$REPO_ROOT/$DRAFT_PATH" \
    | awk 'BEGIN{inc=0} /<!--/{inc=1} inc{if (/-->/) inc=0; next} {print}' \
    | sed -E 's/<[^>]+>/ /g' | wc -w | tr -d ' ')"
  DELTA=$(( FINAL_WORDS - BASELINE_WORDS ))
  printf 'LENGTH: %s -> %s words (%+d, ceiling 4500)\n' "$BASELINE_WORDS" "$FINAL_WORDS" "$DELTA"
  if (( DELTA > 0 )); then
    echo "        A refresh that grew the page is the failure mode this mode exists to catch."
    echo "        Check the REFRESH LEDGER: what was admitted as Tier 1, and what paid for it?"
  fi
fi
if [[ "$REVISED" -eq 1 ]]; then
  run_report_stage 9.5 quality_report_after_revision node "$REPO_ROOT/scripts/blog-quality-report.mjs" "$DRAFT_PATH"
  run_report_stage 9.6 source_audit_after_revision node "$REPO_ROOT/scripts/blog-source-audit.mjs" "$DRAFT_PATH" --fail-on-untagged-load-bearing
  run_report_stage 9.7 same_type_similarity_after_revision node "$REPO_ROOT/scripts/same-type-similarity.mjs" "$DRAFT_PATH" --n 8 --fail-on-trip
  echo "REVISION LOOP: ran once (trigger: ${REVISION_REASONS%; })"
  echo "GRADE: ${FIRST_OVERALL:-?} pre-revision → ${POST_REVISION_FIRST_OVERALL:-?} post-revision → ${FINAL_OVERALL:-?} stability regrade"
  if [[ -n "$FINAL_OVERALL" ]] && awk -v o="$FINAL_OVERALL" 'BEGIN { exit !(o < 8.5) }'; then
    echo "STILL BELOW BAR after one revision — human review needed; the loop does not repeat."
  fi
else
  echo "REVISION LOOP: not needed"
fi

if [[ "$PERSPECTIVE_READY" -eq 1 && -n "$PERSPECTIVE_VERIFICATION_FILE" ]]; then
  run_report_stage 9.8 perspective_finalize \
    node "$REPO_ROOT/scripts/perspective-review-gate.mjs" \
    --phase finalize --draft "$DRAFT_PATH" --review-dir "$PERSPECTIVE_REVIEW_DIR_REL" \
    --verification-file "$PERSPECTIVE_VERIFICATION_FILE"
  if [[ "$LAST_REPORT_EXIT" -eq 0 ]]; then
    PERSPECTIVE_FINAL_STATUS="pass"
  elif [[ "$PERSPECTIVE_FINAL_STATUS" == "pass_pending_finalization" ]]; then
    PERSPECTIVE_FINAL_STATUS="finalization_failed"
  fi
fi

echo "PERSPECTIVE REVIEW: $PERSPECTIVE_FINAL_STATUS"
if [[ -n "$PERSPECTIVE_REVIEW_DIR_REL" ]]; then
  echo "PERSPECTIVE ARTIFACTS: $PERSPECTIVE_REVIEW_DIR_REL"
fi
echo

FULL_DRAFT="$REPO_ROOT/$DRAFT_PATH"
if [[ -f "$FULL_DRAFT" ]]; then
  echo "Final draft frontmatter (grade summary):"
  awk '/^---$/{c++; next} c==1' "$FULL_DRAFT" | grep -E "^\s*(hook|enneagram|evidence|writing|originality|discoverability|overall|first_overall|regrade_overall|grade_stability_delta|letter|rubric_version|graded_at):" || \
    echo "  (no content_quality block found — grade stage may have failed)"
fi

write_summary true

# Clean, full completion — the EXIT trap must NOT write a false FAILED_AT_STAGE.
# Any death before this line is a real failure and should leave the sentinel.
PIPELINE_COMPLETED=1

echo "═════════════════════════════════════════════════════"
