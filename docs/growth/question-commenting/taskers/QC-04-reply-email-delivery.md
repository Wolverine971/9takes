<!-- docs/growth/question-commenting/taskers/QC-04-reply-email-delivery.md -->

# Tasker: Direct Reply Email Delivery

**For:** the agent making the anonymous reply-notification promise work end to end.  
**Owner:** DJ  
**Created:** 2026-08-12  
**Status:** Deployed; controlled direct-reply delivery verification pending
**Related:** `supabase/migrations/20260725_notifications.sql`, [`QC-03`](./QC-03-gentle-reply-opt-in.md)

## 0. What and why

An email opt-in is harmful if delivery is unreliable, duplicated, impossible to stop, or broader than the promise. This task sends one tasteful email when another person directly replies to the subscribed anonymous comment.

Version one does not send on likes, unrelated comments, every new answer, or a weekly digest.

## 1. Required reading

1. `supabase/migrations/20260725_notifications.sql`
2. `src/lib/email/sender.ts`
3. `src/lib/email/base-template.ts`
4. Email suppression and unsubscribe routes.
5. Comment creation RPCs and server actions.
6. QC-03's final subscription schema.

## 2. Trigger and dedupe

Queue an email only when:

- A non-removed comment is inserted with `parent_type = 'comment'`.
- The parent comment has an active anonymous reply subscription.
- The replying actor is not the subscribed actor after fingerprint/profile reconciliation where possible.
- The email is not suppressed.
- The same reply source ID has not already queued or sent an email.

Use a durable outbox or job row with a unique key based on subscription ID and reply comment ID. Do not send directly inside the database trigger.

## 3. Email content

Keep the message narrow and calm:

- Subject: `Someone replied to your take on 9takes`
- One sentence saying a new reply was added.
- One primary link: `Read the reply`.
- No author's name.
- No inferred Enneagram type unless the product has explicitly decided it is safe and useful.
- Avoid quoting sensitive comment text in the email for version one.
- Include why the recipient received the message.
- Include a signed one-click stop link for this conversation.

The CTA must deep-link to the root question and exact reply context required by QC-05.

## 4. Delivery and suppression

- Reuse the current sender and tracking infrastructure.
- Record queued, attempted, sent, failed, clicked, and unsubscribed states.
- Check suppression both when queuing and immediately before sending.
- Make retries idempotent.
- Cap retries and record bounded failure categories.
- A one-click stop must suppress this subscription immediately.
- Decide separately whether it also creates a global email suppression. Default to conversation-level stop unless the copy explicitly offers global unsubscribe.

## 5. Analytics

Do not put an email address or token in PostHog.

Required product events:

- `reply_notification_queued`
- `reply_notification_sent`
- `reply_notification_failed`
- `reply_notification_clicked`
- `reply_notification_unsubscribed`

Include stable IDs and bounded status properties only.

## Verification checklist

- [x] One direct reply creates one outbox row.
- [x] Replay-safe unique source keys prevent a second outbox row.
- [x] A non-reply comment creates no outbox work.
- [x] A removed reply creates no outbox work; later moderation cancels pending work.
- [x] A self-reply creates no outbox work where identity can be reconciled.
- [x] Suppressed email creates no outbox work.
- [x] Unsubscribe prevents a later qualifying reply send.
- [x] The final HTML and plain-text links are safe and attributable.
- [x] No comment text or PII appears in PostHog.
- [x] Focused email, migration, and integration tests pass.
- [ ] `pnpm check` passes. QC-04 introduces no diagnostics; the repository remains blocked by the pre-existing `scripts/lib/perspectiveReview.js:48` error.

## Implementation update: 2026-08-12

- Added `reply_notification_outbox` as an RLS-protected durable queue keyed uniquely by subscription and reply comment. It stores stable IDs and delivery state but no recipient email or management token.
- Added an `AFTER INSERT` comments trigger for direct replies only. The trigger rechecks active consent and global suppression, excludes current-fingerprint, claimed-comment, and first-touch-profile self-replies, and never performs network delivery inside the transaction.
- Made queueing best-effort so an email-system failure cannot roll back a valid reply.
- Added moderation cleanup that cancels pending or failed work if the source reply is removed.
- Disposable PostgreSQL verification produced exactly one pending row for the qualifying direct reply. Top-level, removed, suppressed, and reconciled self-reply cases produced none; removing the qualifying reply changed the pending row to `cancelled` with bounded category `removed`.
- Added a cron worker that claims rows with `SKIP LOCKED`, rechecks consent, removal, and global suppression immediately before send, and uses the existing Gmail sender and tracking infrastructure.
- Added narrow HTML and plain-text content with no author name or comment excerpt, a tracked exact-reply link, and a conversation-only stop URL. GET renders a calm confirmation page; POST performs the stop and supports one-click email-client semantics.
- Added bounded safe retries for pre-provider and rate-limit failures. Provider-unavailable and stale in-flight Gmail attempts are marked `ambiguous` for review instead of automatically resent because Gmail supplies no idempotency key.
- Added server-side `reply_notification_queued`, `sent`, `failed`, `clicked`, and `unsubscribed` capture with stable IDs, bounded categories, `$process_person_profile: false`, and no email address, fingerprint, comment text, or token.
- Created and attached each shared `email_sends` tracking row atomically. Because the legacy table permits anonymous tracking lookups, stored HTML and plain text redact both private return and management URLs; only the actual provider payload contains them.
- Disposable PostgreSQL verification covered queue dedupe, atomic tracking-row reuse, final pre-send gating, successful completion, conversation unsubscribe, prevention of later queueing, stale-processing quarantine, and anon/service-role boundaries.
- Six focused delivery suites pass (23 tests), the opt-in component suite passes (6 tests), and the complete repository suite passes (140 files, 663 tests).

## Provider note

The repository's current sender uses Gmail, not Resend. The queue provides durable application-level dedupe, but provider-level idempotency must be solved in the worker before automatic retries are enabled. Do not silently switch providers; either use a Gmail draft/send strategy with explicit ambiguous-delivery handling or make a deliberate Resend migration decision.

## Production migration update: 2026-08-12

- Applied `20260813014408_reply_notification_delivery_and_return` transactionally and recorded it in `supabase_migrations.schema_migrations` after the Supabase CLI could not use this checkout's unlinked project metadata and malformed `.env.local`.
- Verified the production outbox upgrade, claim/delivery/return RPCs, anon/service-role privilege boundaries, and an empty outbox. No provider send was attempted.
- The legacy click tracker now stores a redacted placeholder for private return links while preserving the real redirect target. Focused click tests confirm the return token is never sent to the tracking RPC.

## Risks and gotchas

- Existing signed-in in-app notifications are database-triggered. Reuse their root-question and actor-safety logic, but keep email sending out of the transaction.
- Email “delivery” may only mean accepted by the provider. Label provider states accurately.
- Anonymous comments can later be linked to a profile internally. Never reveal that linkage publicly.
- Multiple rapid replies can become noisy. Version one may send one per direct reply, but add a configurable cooldown before broader notification types are introduced.

## Definition of done

- [x] Direct replies queue and send exactly one email in local integration coverage; production provider verification remains.
- [x] Suppression and conversation-level stop work before and after send.
- [x] Failures are retryable and observable without duplication.
- [x] Clicks are attributable to a notification event.
- [x] QC-05 can identify the exact target reply.
