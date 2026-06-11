<!-- .claude/commands/weekly-marketing-brief.md -->

# Weekly Marketing Brief

Produce the 9takes weekly marketing status brief. This command is fired by cron every Monday (see `scripts/run-weekly-marketing-brief.sh`) and can also be run manually.

## What to do

Launch the `marketing-pm` agent (Agent tool, `subagent_type: marketing-pm`) with this task:

> Run your default status-check workflow: read the rolling log and most recent brief, scan all default surfaces, and produce a dated brief at `docs/daily-briefs/YYYY-MM-DD_marketing-status.md` plus the append-only update to `docs/marketing/marketing-log.md`. This is an UNATTENDED run: DJ is not present to approve actions, so take NO action that requires confirmation per your operator guardrails — observe, write the brief, update the log, and put anything needing DJ's decision in the "Open questions for DJ" section. Never touch blog drafts, `published:` flags, or git.

## After the agent returns

1. Confirm the dated brief file exists and the marketing log was appended.
2. Print the brief's TL;DR section as the final output so it lands in the cron log.
3. Do NOT commit, push, or modify anything outside `docs/daily-briefs/` and `docs/marketing/marketing-log.md`.
