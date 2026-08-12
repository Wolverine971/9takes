<!-- docs/growth/question-commenting/taskers/QC-04-reply-email-delivery.md -->

# Tasker: Direct Reply Email Delivery

**For:** the agent making the anonymous reply-notification promise work end to end.  
**Owner:** DJ  
**Created:** 2026-08-12  
**Status:** Blocked by QC-03  
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

- [ ] One direct reply creates one outbox row.
- [ ] Retry does not create a second row or send.
- [ ] A non-reply comment creates no email.
- [ ] A removed reply creates no email.
- [ ] A self-reply creates no email where identity can be reconciled.
- [ ] Suppressed email creates no send.
- [ ] Unsubscribe prevents a later qualifying reply send.
- [ ] The final HTML and plain-text links are safe and attributable.
- [ ] No comment text or PII appears in PostHog.
- [ ] Focused email, migration, and integration tests pass.
- [ ] `pnpm check` passes.

## Risks and gotchas

- Existing signed-in in-app notifications are database-triggered. Reuse their root-question and actor-safety logic, but keep email sending out of the transaction.
- Email “delivery” may only mean accepted by the provider. Label provider states accurately.
- Anonymous comments can later be linked to a profile internally. Never reveal that linkage publicly.
- Multiple rapid replies can become noisy. Version one may send one per direct reply, but add a configurable cooldown before broader notification types are introduced.

## Definition of done

- [ ] Direct replies queue and send exactly one email.
- [ ] Suppression and conversation-level stop work before and after send.
- [ ] Failures are retryable and observable without duplication.
- [ ] Clicks are attributable to a notification event.
- [ ] QC-05 can identify the exact target reply.
