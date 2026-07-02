<!-- .claude/commands/weekly-growth-audit.md -->

# Weekly Growth Audit

Run the 9takes weekly growth audit. This command is fired every Monday 6:00 AM ET by the OpenClaw cron job "9takes Weekly Marketing Automation" (a command payload running `scripts/run-weekly-marketing-automation.sh` → `scripts/run-weekly-growth-audit.sh`; manage with `openclaw cron`) and can also be run manually. The wrapper script verifies that `docs/growth/growth-log.md` actually gained a `### YYYY-MM-DD` entry for today — that dated entry is the success signal, so always write it.

## What to do

Launch the `growth-analyst` agent (Agent tool, `subagent_type: growth-analyst`) with this task:

> Run your "Weekly growth audit mode" exactly as defined in your agent instructions: read the last growth-log entry, pull this week's core numbers via `scripts/db-query.sh`, compare against the prior audit, check running experiments, and write a dated entry to `docs/growth/growth-log.md` (newest on top, append-only — never rewrite history). Keep the entry under one page. If `scripts/db-query.sh` reports SUPABASE_DB_URL is missing, do a repo-evidence-only audit and put a SETUP NEEDED flag at the top of the log entry.

## After the agent returns

1. Confirm the growth log was actually updated (read the top of `docs/growth/growth-log.md`).
2. Print the agent's summary (biggest leak + recommended bets) as the final output so it lands in the cron log.
3. Do NOT commit, push, or modify anything outside `docs/growth/`.
