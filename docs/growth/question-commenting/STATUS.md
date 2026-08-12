<!-- docs/growth/question-commenting/STATUS.md -->

# Workstream Status

Last updated: 2026-08-12

| ID    | State                         | Owner      | Next gate                                                                            |
| ----- | ----------------------------- | ---------- | ------------------------------------------------------------------------------------ |
| QC-01 | Ready for deploy verification | Codex      | Apply migration, deploy app, then verify production payloads and browser smoke tests |
| QC-02 | Ready for deploy verification | Codex      | Deploy attribution, run controlled test, and choose reactivation closeout option     |
| QC-03 | Blocked by QC-01              | Unassigned | Approve final inline copy during implementation review                               |
| QC-04 | Blocked by QC-03              | Unassigned | Delivery and suppression design review                                               |
| QC-05 | Blocked by QC-04              | Unassigned | Exact-thread return UX review                                                        |
| QC-06 | Blocked by QC-01              | Unassigned | One week of trustworthy impressions                                                  |
| QC-07 | Blocked by QC-01 and QC-02    | Unassigned | Canonical events flowing in production                                               |

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

## Update rule

When a task changes state, update this file and the tasker's own status line. Put new numeric evidence in a dated baseline or result document, not only in a chat or commit message.
