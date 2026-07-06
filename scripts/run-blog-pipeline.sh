#!/usr/bin/env bash
# scripts/run-blog-pipeline.sh
#
# Run the full 9takes personality-blog pipeline for one person.
# Each stage runs as a separate `claude -p` invocation, so every stage gets
# a fresh context. The markdown draft in src/blog/people/drafts/<Person>.md
# is the only state passed between stages.
#
# Pipeline:
#   1. create             - /blog_content_creator_people_v2 (non-interactive)
#   2. fresh_eyes         - /blog_content_fresh_eyes_people
#   3. second_pass        - /blog_content_second_pass_people
#   4. cohesion           - /cohesion-check
#   5. editor_pass        - /blog_content_editor_pass_people
#   6. enrich_frontmatter - /blog_content_frontmatter_enrich_people
#   6.5 lint              - scripts/blog-lint.sh (deterministic checks, no LLM)
#   7. grade              - /grade_blog
#   8. revise             - /blog_content_revision_pass_people  (CONDITIONAL — only if
#                           overall < 8.5, discoverability < 7, or lint failed)
#   8.5 lint (re-run)     - scripts/blog-lint.sh
#   9. regrade            - /grade_blog (after stripping the stage-7 grade)
#
# The revise loop runs AT MOST ONCE. If the re-grade still lands below the bar,
# the draft stays below the bar and a human decides — no infinite polishing.
#
# Usage:
#   ./scripts/run-blog-pipeline.sh <Person-Name>
#   e.g. ./scripts/run-blog-pipeline.sh Martha-Stewart
#
# Notes:
#   - Run-all-then-report: if a stage errors, the pipeline keeps going.
#     Check the per-stage log files for failures.
#   - Re-running on an already-graded blog: the pipeline strips any existing
#     `content_quality:` block from the draft frontmatter just before each grade
#     stage, so re-runs always produce a fresh score with no prompt collision.
#

set -uo pipefail

PERSON="${1:-}"
if [[ -z "$PERSON" ]]; then
  echo "Usage: $0 <Person-Name>" >&2
  echo "  e.g. $0 Martha-Stewart" >&2
  exit 1
fi

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
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
echo "Person:  $PERSON"
echo "Draft:   $DRAFT_PATH"
echo "Logs:    $LOG_DIR"
echo "Started: $(date)"
echo "═════════════════════════════════════════════════════"
echo

clear_grading_frontmatter() {
  local file="$REPO_ROOT/$DRAFT_PATH"
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
  "$REPO_ROOT/scripts/blog-lint.sh" "$PERSON" 2>&1 | tee "$log_file"
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
REVISION_REASONS=""
REVISED=0

run_stage 1 create             "/blog_content_creator_people_v2 $PERSON --non-interactive"
run_stage 2 fresh_eyes         "/blog_content_fresh_eyes_people $PERSON"
run_stage 3 second_pass        "/blog_content_second_pass_people $PERSON"
run_stage 4 cohesion           "/cohesion-check $DRAFT_PATH"
run_stage 5 editor_pass        "/blog_content_editor_pass_people $PERSON"
run_stage 6 enrich_frontmatter "/blog_content_frontmatter_enrich_people $PERSON"
run_lint 6.5
run_report_stage 6.6 quality_report node "$REPO_ROOT/scripts/blog-quality-report.mjs" "$PERSON"
run_report_stage 6.7 source_audit node "$REPO_ROOT/scripts/blog-source-audit.mjs" "$PERSON" --fail-on-untagged-load-bearing
run_report_stage 6.8 same_type_similarity node "$REPO_ROOT/scripts/same-type-similarity.mjs" "$PERSON" --n 8 --fail-on-trip
clear_grading_frontmatter
run_stage 7 grade              "/grade_blog $PERSON"

# ── Stage 8/9: revise-and-regrade loop (at most once) ─────────────────────
FIRST_OVERALL="$(read_quality_field overall)"
FIRST_DISC="$(read_quality_field discoverability)"

if revision_needed; then
  REVISED=1
  echo "[Stage 8] Revision loop triggered: ${REVISION_REASONS}"
  run_stage 8 revise           "/blog_content_revision_pass_people $PERSON"
  run_lint 8.5
  clear_grading_frontmatter
  run_stage 9 regrade          "/grade_blog $PERSON"
else
  if [[ -n "$REVISION_REASONS" ]]; then
    echo "[Stage 8] Skipped revision loop: ${REVISION_REASONS}"
  else
    echo "[Stage 8] No revision needed (overall ${FIRST_OVERALL:-?} >= 8.5, discoverability ${FIRST_DISC:-?} >= 7, lint clean)"
  fi
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
if [[ "$REVISED" -eq 1 ]]; then
  FINAL_OVERALL="$(read_quality_field overall)"
  run_report_stage 9.5 quality_report_after_revision node "$REPO_ROOT/scripts/blog-quality-report.mjs" "$PERSON"
  run_report_stage 9.6 source_audit_after_revision node "$REPO_ROOT/scripts/blog-source-audit.mjs" "$PERSON" --fail-on-untagged-load-bearing
  run_report_stage 9.7 same_type_similarity_after_revision node "$REPO_ROOT/scripts/same-type-similarity.mjs" "$PERSON" --n 8 --fail-on-trip
  echo "REVISION LOOP: ran once (trigger: ${REVISION_REASONS%; })"
  echo "GRADE: ${FIRST_OVERALL:-?} → ${FINAL_OVERALL:-?} (first grade → after revision)"
  if [[ -n "$FINAL_OVERALL" ]] && awk -v o="$FINAL_OVERALL" 'BEGIN { exit !(o < 8.5) }'; then
    echo "STILL BELOW BAR after one revision — human review needed; the loop does not repeat."
  fi
else
  echo "REVISION LOOP: not needed"
fi
echo

FULL_DRAFT="$REPO_ROOT/$DRAFT_PATH"
if [[ -f "$FULL_DRAFT" ]]; then
  echo "Final draft frontmatter (grade summary):"
  awk '/^---$/{c++; next} c==1' "$FULL_DRAFT" | grep -E "^\s*(hook|enneagram|evidence|writing|originality|discoverability|overall|letter|rubric_version|graded_at):" || \
    echo "  (no content_quality block found — grade stage may have failed)"
fi

FINAL_OVERALL="$(read_quality_field overall)"
FINAL_DISC="$(read_quality_field discoverability)"
SUMMARY_PATH="$LOG_DIR/summary.json" \
PERSON="$PERSON" \
DRAFT_PATH="$DRAFT_PATH" \
PIPELINE_LOG_DIR="$LOG_DIR" \
FIRST_OVERALL="${FIRST_OVERALL:-}" \
FINAL_OVERALL="${FINAL_OVERALL:-}" \
FINAL_DISCOVERABILITY="${FINAL_DISC:-}" \
LINT_EXIT="${LINT_EXIT:-0}" \
REVISED="$REVISED" \
HAS_STAGE_WARNINGS="$([[ -f "$LOG_DIR/STAGE_WARNINGS" ]] && echo true || echo false)" \
node -e '
const fs = require("fs");
const env = process.env;
const num = (value) => value === "" || value == null ? null : Number(value);
const summary = {
  person: env.PERSON,
  draft_path: env.DRAFT_PATH,
  log_dir: env.PIPELINE_LOG_DIR,
  completed: true,
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

# Clean, full completion — the EXIT trap must NOT write a false FAILED_AT_STAGE.
# Any death before this line is a real failure and should leave the sentinel.
PIPELINE_COMPLETED=1

echo "═════════════════════════════════════════════════════"
