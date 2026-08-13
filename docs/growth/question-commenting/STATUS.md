<!-- docs/growth/question-commenting/STATUS.md -->

# Workstream Status

Last updated: 2026-08-12

| ID    | State                          | Owner      | Next gate                                                                       |
| ----- | ------------------------------ | ---------- | ------------------------------------------------------------------------------- |
| QC-01 | Production core verified       | Codex      | Observe the next organic `question_created` and `comment_created` payloads      |
| QC-02 | Deployed; verification pending | Codex      | Run one controlled attributed journey and choose reactivation closeout option   |
| QC-03 | Database deployed; app pending | Codex      | Deploy, then run an anonymous first-answer production smoke test                |
| QC-04 | Database deployed; app pending | Codex      | Deploy and run one controlled direct-reply delivery journey                     |
| QC-05 | Database deployed; app pending | Codex      | Deploy with QC-04, then smoke-test exact return on mobile and desktop           |
| QC-06 | Database deployed; app pending | DJ / Codex | Deploy, verify the fallback, then start the first manual feature run            |
| QC-07 | Waiting for mature baseline    | Unassigned | Complete QC-02 verification and collect one week of canonical production events |

## Decision log

### 2026-08-12

- Created this workstream from the PostHog commenting investigation.
- Chose a post-comment inline tray for anonymous reply-email opt-in.
- Rejected modal, blocking, and browser-notification treatments.
- Confirmed Welcome Sequence Email 1 as the source of the 10 Gmail-attributed comments.
- Reclassified those comments from three PostHog people to two reconciled humans.
- Kept reactivation acquisition separate from welcome-email acquisition.
- Made event-model work the first implementation task.
- Completed QC-01's local implementation and focused verification: canonical events, qualified impressions, server-derived comment outcome metadata, and anonymous-to-identified continuity are ready for deployment verification.
- Kept QC-03 and QC-06 blocked until the migration and app are deployed and the live PostHog schema plus browser smoke journeys pass.
- Completed QC-02's local attribution and reporting work without sending email or changing sequence state.
- Recommended enforcing no new broad reactivation enrollment while the 75 active recipients finish their remaining 131 sends; closeout state changes still require DJ approval.
- Verified the deployed QC-01 build on production: the expected Git commit and database RPC are live, the question index and question detail smoke journeys render, and PostHog received privacy-safe `question_impression` and `comment_started` events with the controlled campaign value. No fake public question or comment was created merely to manufacture mutation events.
- Unblocked QC-03 on that production evidence while retaining a follow-up to inspect the next organic `question_created` and `comment_created` payloads.
- Completed QC-03 locally: the polite post-comment tray, purpose-specific consent persistence, suppression, idempotency, and privacy-safe analytics are covered by focused tests and a disposable PostgreSQL migration exercise. Deployment remains a separate gate.
- Completed QC-04 locally: a private outbox and suppression-aware cron worker send narrow direct-reply emails through the existing Gmail sender, preserve conversation-only unsubscribe semantics, attribute clicks, and emit privacy-safe PostHog events. Retry-safe failures are bounded, while uncertain Gmail attempts are quarantined instead of riskily resent.
- Hardened QC-04 after reviewing the shared email tracking RLS: tracking rows are now created and attached atomically, and their stored content redacts the private conversation-management URL. A disposable PostgreSQL exercise verified dedupe, final suppression, unsubscribe, stale-attempt quarantine, and role boundaries; all 663 repository tests pass. Production deployment and one controlled delivery journey remain separate gates.
- Completed QC-05 locally with a private return token that is separate from the legacy tracking ID, a short-lived signed server handoff, and a clean final question URL. The verified return unlocks the discussion without login, renders the subscribed take next to the exact direct reply, focuses and scrolls politely, handles reduced motion and removed replies, distinguishes revisits, and exposes one measured next action only after the target is visible. Browser and production smoke verification remain.
- Applied production migration `20260813014408_reply_notification_delivery_and_return` transactionally and recorded it in the Supabase migration ledger. Production verification confirmed the private return token, delivery/return RPCs, role privileges, and an empty outbox; no live email was sent. The click tracker now also redacts the private return URL before storing it in the legacy tracking table.
- Rechecked PostHog before starting QC-06. The current schema inventory did not expose `question_impression`, so there is not yet an organic sample suitable for automatic rotation. Automatic queue advancement remains off.
- Completed the local QC-06 manual-pilot slice: the homepage selection is database-backed, feature runs are operator-controlled, fallback state is explicit, qualified homepage impressions are deduplicated into a private counter, and feature-run IDs join impressions and canonical homepage comment events. Disposable PostgreSQL verification covered target completion, pause/resume/extend/stop, moderation invalidation, fallback recovery, concurrency protection, and privileges. Deployment is a separate gate.
- Reconciled and stamped production migration `20260813030000_question_feature_runs`. The three additive tables already existed without a ledger row; they matched the tested schema and were empty. The idempotent migration and ledger insert then completed in one transaction. Production now resolves question 567 as the explicit fallback, has no run or impression rows, enables RLS on all three tables, denies anon reads/RPC execution, and grants the selector only to the service role. No feature run was started.

## Update rule

When a task changes state, update this file and the tasker's own status line. Put new numeric evidence in a dated baseline or result document, not only in a chat or commit message.
