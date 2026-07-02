<!-- .claude/commands/weekly-marketing-brief.md -->

# Weekly Marketing Brief

Produce the 9takes weekly marketing status brief. This command is fired every Monday 6:00 AM ET by the OpenClaw cron job "9takes Weekly Marketing Automation" (a command payload running `scripts/run-weekly-marketing-automation.sh`, which runs the growth audit first and then this; manage with `openclaw cron`) and can also be run manually. The wrapper script verifies that `docs/daily-briefs/YYYY-MM-DD_marketing-status.md` actually exists — that dated file is the success signal, so always write it.

## What to do

Launch the `marketing-pm` agent (Agent tool, `subagent_type: marketing-pm`) with this task:

> Run your default status-check workflow: read the rolling log and most recent brief, scan all default surfaces, and produce a dated brief at `docs/daily-briefs/YYYY-MM-DD_marketing-status.md` plus the append-only update to `docs/marketing/marketing-log.md`. This is an UNATTENDED run: DJ is not present to approve actions, so take NO action that requires confirmation per your operator guardrails — observe, write the brief, update the log, and put anything needing DJ's decision in the "Open questions for DJ" section. Never touch blog drafts, `published:` flags, or git.
>
> GROWTH-DATA FRESHNESS GATE: before writing, check the date of the newest `### YYYY-MM-DD` entry in `docs/growth/growth-log.md`. The growth audit is supposed to run right before you on Mondays. If the newest entry IS from today, fold its headline + biggest leak into the brief verbatim instead of re-deriving growth numbers. If it is NOT from today, lead the TL;DR with a "⚠️ STALE GROWTH DATA (last audit YYYY-MM-DD)" flag, say how stale, and do not present old growth numbers as current.

## After the agent returns

1. Confirm the dated brief file exists and the marketing log was appended.
2. Print the brief's TL;DR section as the final output so it lands in the cron log.
3. Do NOT commit, push, or modify anything outside `docs/daily-briefs/` and `docs/marketing/marketing-log.md`.
