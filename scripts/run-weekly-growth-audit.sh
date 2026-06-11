#!/usr/bin/env bash
# scripts/run-weekly-growth-audit.sh
#
# Weekly growth audit: runs the growth-analyst agent headlessly via the
# /weekly-growth-audit slash command. Fired by cron Monday mornings.
# Output appends to docs/growth/growth-log.md; run transcript lands in
# logs/growth-automation/audit-YYYY-MM-DD.log.

set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$REPO_ROOT/logs/growth-automation"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/audit-$(date +%Y-%m-%d).log"

{
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting weekly growth audit"
  cd "$REPO_ROOT"
  claude -p "/weekly-growth-audit" --dangerously-skip-permissions
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Weekly growth audit finished (exit=$?)"
} 2>&1 | tee -a "$LOG_FILE"
