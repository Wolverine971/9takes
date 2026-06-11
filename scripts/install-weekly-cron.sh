#!/usr/bin/env bash
# scripts/install-weekly-cron.sh
#
# One-time installer for the two 9takes weekly automation cron jobs:
#   - Monday 6:00 AM  weekly growth audit   (growth-analyst agent)
#   - Monday 7:00 AM  weekly marketing brief (marketing-pm agent)
#
# Idempotent: skips entries that are already installed. Backs up the current
# crontab to /tmp first. Run this yourself in a terminal (macOS blocks
# programmatic crontab edits from sandboxed processes):
#
#   ./scripts/install-weekly-cron.sh

set -euo pipefail

GROWTH_LINE="0 6 * * 1 /Users/djwayne/9takes/scripts/run-weekly-growth-audit.sh"
BRIEF_LINE="0 7 * * 1 /Users/djwayne/9takes/scripts/run-weekly-marketing-brief.sh"

CURRENT="$(crontab -l 2>/dev/null || true)"
BACKUP="/tmp/crontab-backup-$(date +%Y%m%d-%H%M%S).txt"
printf '%s\n' "$CURRENT" > "$BACKUP"
echo "Backed up current crontab to $BACKUP"

NEW="$CURRENT"
if ! grep -qF "run-weekly-growth-audit.sh" <<< "$CURRENT"; then
  NEW="$NEW

# 9takes weekly growth audit (Mondays 6:00 AM)
$GROWTH_LINE"
  echo "Adding: weekly growth audit (Mon 6:00 AM)"
else
  echo "Already installed: weekly growth audit"
fi

if ! grep -qF "run-weekly-marketing-brief.sh" <<< "$CURRENT"; then
  NEW="$NEW

# 9takes weekly marketing brief (Mondays 7:00 AM, after growth audit)
$BRIEF_LINE"
  echo "Adding: weekly marketing brief (Mon 7:00 AM)"
else
  echo "Already installed: weekly marketing brief"
fi

printf '%s\n' "$NEW" | crontab -
echo
echo "Installed. Current crontab:"
crontab -l
