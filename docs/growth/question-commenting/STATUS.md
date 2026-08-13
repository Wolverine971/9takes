<!-- docs/growth/question-commenting/STATUS.md -->

# Workstream Status

Last updated: 2026-08-12

| ID    | State                          | Owner      | Next gate                                                                         |
| ----- | ------------------------------ | ---------- | --------------------------------------------------------------------------------- |
| QC-01 | Production core verified       | Codex      | Observe the next organic `question_created` and `comment_created` payloads        |
| QC-02 | Deployed; verification pending | Codex      | Run one controlled attributed journey and choose reactivation closeout option     |
| QC-03 | Local implementation complete  | Codex      | Apply migration, deploy, then run an anonymous first-answer production smoke test |
| QC-04 | In progress: outbox ready      | Codex      | Add the suppression-aware delivery worker and conversation-level one-click stop   |
| QC-05 | Blocked by QC-04               | Unassigned | Exact-thread return UX review                                                     |
| QC-06 | Collecting production data     | DJ / Codex | Accumulate one week of trustworthy qualified impressions                          |
| QC-07 | Waiting for mature baseline    | Unassigned | Complete QC-02 verification and collect one week of canonical production events   |

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
- Started QC-04 with a durable, private outbox. Disposable PostgreSQL verification confirmed that a direct reply queues once while top-level comments, removed replies, globally suppressed recipients, and reconciled self-replies do not; later moderation cancels pending delivery.

## Update rule

When a task changes state, update this file and the tasker's own status line. Put new numeric evidence in a dated baseline or result document, not only in a chat or commit message.
