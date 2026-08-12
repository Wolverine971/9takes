<!-- docs/growth/question-commenting/taskers/README.md -->

# Question Commenting Taskers

Each file is a bounded work order that should be executable without the conversation that created it.

| ID    | Tasker                                                                                  | Status                     | Main output                                                   |
| ----- | --------------------------------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------- |
| QC-01 | [`Analytics event model`](./QC-01-analytics-event-model.md)                             | Ready                      | Canonical question, impression, and comment funnel events     |
| QC-02 | [`Email attribution and list closeout`](./QC-02-email-attribution-and-list-closeout.md) | Ready                      | Welcome attribution plus an evidence-backed sequence decision |
| QC-03 | [`Gentle reply opt-in`](./QC-03-gentle-reply-opt-in.md)                                 | Blocked by QC-01           | Post-comment inline email permission and persistence          |
| QC-04 | [`Reply email delivery`](./QC-04-reply-email-delivery.md)                               | Blocked by QC-03           | Deduplicated direct-reply email with suppression              |
| QC-05 | [`Notification return experience`](./QC-05-notification-return-experience.md)           | Blocked by QC-04           | Exact-thread landing and next meaningful action               |
| QC-06 | [`Question distribution system`](./QC-06-question-distribution-system.md)               | Blocked by QC-01           | Measured featured-question queue and override controls        |
| QC-07 | [`Retention scorecard`](./QC-07-retention-scorecard.md)                                 | Blocked by QC-01 and QC-02 | Weekly mature-cohort operating view                           |

## Shared rules

- Read [`../00-START-HERE.md`](../00-START-HERE.md) before implementation.
- Preserve unrelated uncommitted work.
- Never put email addresses, fingerprints, tokens, IP addresses, or comment text into analytics payloads.
- Use `comment_created` with `server_confirmed = true` as the canonical comment success event.
- Prefer the existing notification and email infrastructure over a parallel system.
- Every Svelte task must use the repository's Svelte skills and run focused tests plus `pnpm check`.
- Every database migration must include RLS, indexes, suppression behavior where relevant, and a rollback or disable strategy.
- Update [`../STATUS.md`](../STATUS.md) when a task changes state.
