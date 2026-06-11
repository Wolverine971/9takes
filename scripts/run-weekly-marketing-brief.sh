#!/usr/bin/env bash
# scripts/run-weekly-marketing-brief.sh
#
# Weekly marketing status brief: runs the marketing-pm agent headlessly via the
# /weekly-marketing-brief slash command. Fired by cron Monday mornings (after
# the growth audit, so the PM can reference fresh growth numbers).
# Output: docs/daily-briefs/YYYY-MM-DD_marketing-status.md + marketing-log append.
# Run transcript lands in logs/marketing-automation/brief-YYYY-MM-DD.log.

set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$REPO_ROOT/logs/marketing-automation"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/brief-$(date +%Y-%m-%d).log"

{
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting weekly marketing brief"
  cd "$REPO_ROOT"
  claude -p "/weekly-marketing-brief" --dangerously-skip-permissions
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Weekly marketing brief finished (exit=$?)"
} 2>&1 | tee -a "$LOG_FILE"
