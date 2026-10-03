<!-- .claude/commands/weekly-growth-audit.md -->

# Weekly Growth Audit

Run the 9takes weekly growth audit. This command is fired every Monday 6:00 AM ET by the OpenClaw cron job "9takes Weekly Marketing Automation" (a command payload running `scripts/run-weekly-marketing-automation.sh` → `scripts/run-weekly-growth-audit.sh`; manage with `openclaw cron`) and can also be run manually. The wrapper script verifies that `docs/growth/growth-log.md` actually gained a `### YYYY-MM-DD` entry for today — that dated entry is the success signal, so always write it.

## What to do

Launch the `growth-analyst` agent (Agent tool, `subagent_type: growth-analyst`) with this task:

> Run your "Weekly growth audit mode" exactly as defined in your agent instructions: read the last growth-log entry, pull this week's numbers via `scripts/db-query.sh`, compare against the prior audit, check running experiments, and write a dated entry to `docs/growth/growth-log.md` (newest on top, append-only — never rewrite history). Keep the entry under one page. If `scripts/db-query.sh` reports SUPABASE_DB_URL is missing, do a repo-evidence-only audit and put a SETUP NEEDED flag at the top of the log entry.
>
> HONEST NUMBERS RULE. Every headline number comes from `./scripts/db-query.sh "select * from admin_engagement_trends_weekly_v2(26)"` (one row per Monday-start America/New_York week, oldest first; the last row is the current partial week, so "this week" means the last complete week). Lead the numbers table with the last 8 complete weeks of `human_visitors` (`returning_human_visitors`), `human_comments`, `contributors` (`returning_contributors`), `real_signups`, `registrations`, `bookings`, and use all 26 weeks to say whether a number dropped or was always this low. Name the RPC in the entry. Definitions, inlined so you do not need to open the migration:
>
> - Admin = `profiles.admin` plus every fingerprint ever tied to an admin; excluded everywhere.
> - Human visitor = non-admin fingerprint with at least 10 s engaged time on at least one day that week (`raw_visitors` = every fingerprint, about 85% bots).
> - Human comment = `comments` + `blog_comments`, minus removed rows, admin authors and admin fingerprints; AI takes never count.
> - Contributor = distinct author id, else fingerprint, else IP, with a human comment that week; returning = had one in an earlier week.
> - Real signup = signup minus bot-quarantined emails, flagged waitlist bots, admin and `@9takes.com` addresses, auth-page-first internal landings (the Jun 2026 wave), dotted-Gmail (3+ dots), and emails with a failed `auth_security_events` row within 10 minutes.
> - Booking = real `coaching_waitlist` add + non-admin `talk_notes` + `consulting_sessions`.
>
> Raw counters (`raw_*` columns, `admin_engagement_trends_30_days`, `visitors_last_30_days`, `comments_last_30_days`, raw `page_analytics_visits` or `comments` counts) may appear only as a secondary diagnostic labelled "(bot-inclusive)", never in the headline, the direction-change lead, or the biggest-leak sentence.
>
> SERIES BREAKS. Name any break that falls inside a comparison window, next to the number:
>
> - 2026-09-21: personality-page rows in `content_access_events` stop (pages became ISR-cached). A drop there is not a user change.
> - 2026-10-02: `give_first_funnel_events.gate_shown` stops counting crawlers. Do not compare raw gate counts across this date.
> - 2026-10-02: every `contribution` event carries `path`. Before it, question-page contributions have `path IS NULL` (treat NULL as "question page"); the old homepage and blog embeds did set it.
> - 2026-10-03: the homepage answer box posts real takes to q203, and celebrity pages ask a live question mid-article. Report contributions with `path = '/'` and `path like '/personality-analysis/%'` separately.
>
> Old log entries before 2026-10-05 used raw or hand-filtered counts. Compare against the v2 RPC's own history, not those tables.

## After the agent returns

1. Confirm the growth log was actually updated (read the top of `docs/growth/growth-log.md`) and that today's entry cites `admin_engagement_trends_weekly_v2`.
2. Print the agent's summary (biggest leak + recommended bets) as the final output so it lands in the cron log.
3. Do NOT commit, push, or modify anything outside `docs/growth/`.
