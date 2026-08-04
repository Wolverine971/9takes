<!-- .claude/commands/marketing-content-sprint.md -->

# Marketing Content Sprint

Maintain the always-on Instagram content runway.

Input: **$ARGUMENTS**

Accepted modes:

- `replenish` (default) — move the queue toward its inventory floors
- `next` — advance the next item one defensible production state
- `plan` — repair the next 14 days, format mix, and campaign balance
- `measure` — record supplied or verified 24-hour/7-day results

Launch the `instagram-content-ops` agent (`subagent_type: instagram-content-ops`) with this task:

> Run the Instagram content operations workflow in `$ARGUMENTS` mode. If no mode was supplied, use `replenish`. Read the content-ops README, queue, campaigns, marketing log, and every source file needed for the item you touch. Run `node scripts/check-marketing-content-queue.mjs` before and after. Advance real work rather than generating an extra idea list. Update `docs/marketing/content-ops/queue.json` whenever state, ownership, dates, paths, blockers, or next actions change. Never promote an item beyond the artifacts that actually exist. Do not post, schedule, DM, email, comment, commit, or push without DJ's explicit approval.

After the agent returns:

1. Confirm `node scripts/check-marketing-content-queue.mjs` passes validation.
2. Report the runway, the item advanced, and the next human action.
3. List changed artifact paths.
