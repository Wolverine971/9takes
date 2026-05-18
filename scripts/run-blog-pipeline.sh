# scripts/run-blog-pipeline.sh
#!/usr/bin/env bash
#
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
#   7. grade              - /grade_blog
#
# Usage:
#   ./scripts/run-blog-pipeline.sh <Person-Name>
#   e.g. ./scripts/run-blog-pipeline.sh Martha-Stewart
#
# Notes:
#   - Run-all-then-report: if a stage errors, the pipeline keeps going.
#     Check the per-stage log files for failures.
#   - Re-running on an already-graded blog: the pipeline strips any existing
#     `content_quality:` block from the draft frontmatter just before stage 6
#     (grade), so re-runs always produce a fresh score with no prompt collision.
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
mkdir -p "$LOG_DIR"

DRAFT_PATH="src/blog/people/drafts/${PERSON}.md"

run_stage() {
  local stage_num="$1"
  local stage_name="$2"
  local command="$3"
  local log_file="$LOG_DIR/${stage_num}_${stage_name}.log"
  local started_at
  started_at="$(date +%H:%M:%S)"

  echo "─────────────────────────────────────────────────────"
  echo "[Stage $stage_num] $stage_name  (started $started_at)"
  echo "Command: $command"
  echo "Log:     $log_file"
  echo "─────────────────────────────────────────────────────"

  claude -p "$command" --dangerously-skip-permissions 2>&1 | tee "$log_file"
  local exit_code="${PIPESTATUS[0]}"

  local finished_at
  finished_at="$(date +%H:%M:%S)"
  echo "[Stage $stage_num] $stage_name finished $finished_at (exit=$exit_code)"
  echo

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
  if ! grep -q "^content_quality:" "$file"; then
    echo "[pre-grade] No existing content_quality block on draft, nothing to clear"
    return 0
  fi
  echo "[pre-grade] Stripping existing content_quality block from $DRAFT_PATH for a clean re-grade"
  awk '
    /^---$/ { fm_boundary++; print; next }
    fm_boundary == 1 && /^content_quality:[[:space:]]*$/ { in_block = 1; next }
    fm_boundary == 1 && in_block && /^[[:space:]]/ { next }
    fm_boundary == 1 && in_block { in_block = 0 }
    { print }
  ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
}

run_stage 1 create             "/blog_content_creator_people_v2 $PERSON --non-interactive"
run_stage 2 fresh_eyes         "/blog_content_fresh_eyes_people $PERSON"
run_stage 3 second_pass        "/blog_content_second_pass_people $PERSON"
run_stage 4 cohesion           "/cohesion-check $DRAFT_PATH"
run_stage 5 editor_pass        "/blog_content_editor_pass_people $PERSON"
run_stage 6 enrich_frontmatter "/blog_content_frontmatter_enrich_people $PERSON"
clear_grading_frontmatter
run_stage 7 grade              "/grade_blog $PERSON"

echo "═════════════════════════════════════════════════════"
echo "Pipeline complete for: $PERSON"
echo "Finished: $(date)"
echo "All logs: $LOG_DIR"
echo

FULL_DRAFT="$REPO_ROOT/$DRAFT_PATH"
if [[ -f "$FULL_DRAFT" ]]; then
  echo "Final draft frontmatter (grade summary):"
  awk '/^---$/{c++; next} c==1' "$FULL_DRAFT" | grep -E "^\s*(hook|enneagram|evidence|writing|originality|overall|letter|graded_at):" || \
    echo "  (no content_quality block found — grade stage may have failed)"
fi

echo "═════════════════════════════════════════════════════"
