<!-- docs/growth/question-commenting/taskers/QC-03-gentle-reply-opt-in.md -->

# Tasker: Gentle Anonymous Reply Opt-in

**For:** the agent adding a tasteful, optional way for an anonymous first commenter to request a reply email.  
**Owner:** DJ  
**Created:** 2026-08-12  
**Status:** Local implementation complete; deployment verification pending
**Related:** `docs/planning/experiment-a-anonymous-email-capture-2026-04-08.md`, [`../00-START-HERE.md`](../00-START-HERE.md)

## 0. What and why

Anonymous contributors currently post, reveal the thread, and become unreachable. This task captures explicit permission for a direct-reply email without interrupting the successful contribution flow.

This task supersedes the older Experiment A placement. The email field must appear after confirmed comment creation, not before submission.

## 1. Required reading

1. `docs/growth/question-commenting/00-START-HERE.md`
2. `docs/planning/experiment-a-anonymous-email-capture-2026-04-08.md`
3. `src/lib/components/molecules/Interact.svelte`
4. `src/lib/components/questions/QuestionContent.svelte`
5. `src/routes/questions/[slug]/+page.server.ts`
6. `src/lib/analytics/commentEvents.ts`
7. Email suppression helpers and tables.

## 2. Eligibility

Show the ask only when all conditions are true:

- Production, not demo mode.
- The server confirmed a new top-level answer.
- The commenter is anonymous.
- It is the actor's first comment ever, using the server result rather than a client guess.
- No reply-email subscription already exists for the comment or fingerprint.
- The visitor has not dismissed the ask previously in the same journey.

Do not show it for signed-in users, replies, failed comments, repeat anonymous commenters, or page reloads after dismissal.

## 3. Interaction design

After the answer posts and the conversation reveals, expand a compact inline tray near the new comment or reveal confirmation.

Requirements:

- No modal, overlay, toast-only prompt, or browser permission request.
- Do not steal focus or scroll the page.
- Use `aria-live="polite"`, not `assertive`.
- Animate with a small opacity/height transition no longer than 250 milliseconds.
- Disable animation for reduced-motion users.
- Keep the revealed discussion visible and usable.
- `Not now` dismisses immediately and quietly.
- The prompt must not reappear after dismissal during the same visitor journey.

Working copy:

> **Want a note if someone replies?**  
> Leave an email if you'd like. Your take stays anonymous, and we'll only email about this conversation.

Actions:

- `Keep me posted`
- `Not now`

Do not promise notifications for every new take or a newsletter in this release.

## 4. Persistence and privacy

Create a purpose-specific subscription table. It must include:

- The original comment ID.
- Root question ID.
- Fingerprint stored only in the database.
- Normalized email.
- Consent source and consent timestamp.
- Signed confirmation or management token.
- Unsubscribed timestamp.
- Last notification timestamp and count.
- Created and updated timestamps.

Requirements:

- Unique active subscription per comment and normalized email.
- RLS denies public reads.
- Writes go through a validated server action or security-definer RPC.
- Check the unified suppression list before accepting or sending.
- Never place the email, fingerprint, or token in PostHog.
- An invalid or suppressed email changes only the opt-in result. The comment remains successful.

## 5. Analytics

Emit privacy-safe events:

- `reply_opt_in_shown`
- `reply_opt_in_focused`
- `reply_opt_in_submitted`
- `reply_opt_in_succeeded`
- `reply_opt_in_dismissed`
- `reply_opt_in_failed`

Stable properties:

- `question_id`
- `question_url`
- `comment_id`
- `surface`
- `is_first_comment_ever`
- `failure_category` when relevant

## 6. Tests

Cover eligibility, successful persistence, dismissal memory, invalid email, suppression, duplicate submit, page reload, reduced motion, and keyboard/screen-reader behavior.

## Verification checklist

- [x] Comment submission succeeds with no opt-in interaction.
- [x] The inline tray appears only after server confirmation.
- [x] The tray does not move focus or cover the thread.
- [x] `Not now` dismisses and remains dismissed.
- [x] A valid email creates one subscription in disposable-database verification.
- [x] Duplicate submission is idempotent.
- [x] Invalid or suppressed email does not affect the comment.
- [x] Analytics payload tests confirm PostHog receives no email, fingerprint, or token.
- [x] Semantic-region, polite live-region, focus, and native-control tests pass.
- [x] Reduced-motion behavior passes.
- [x] Focused tests and `pnpm check` pass.

## Local implementation update: 2026-08-12

- Added an inline, non-modal tray that appears only after a confirmed anonymous first top-level answer. It does not autofocus or scroll, uses `aria-live="polite"`, and reduces its 220 ms transition to zero for reduced-motion users.
- Added a separate server action and security-definer RPC, so email validation or persistence failure cannot change the already-successful comment result.
- Added a purpose-specific RLS-protected subscription table with normalized email, consent metadata, a private management token, unsubscribe state, and delivery counters. Anonymous/authenticated clients cannot read or insert directly.
- Added suppression checks and a transaction-scoped actor lock. Disposable PostgreSQL verification returned `subscribed`, then `already_subscribed` for a duplicate; a suppressed address returned `suppressed`, a forged fingerprint returned `ineligible`, and only one normalized row existed.
- Added `reply_opt_in_*` events with bounded status fields and no PII.
- Focused Vitest result: 18 tests passed across the component, server action, and analytics helper files. The final repository-wide `pnpm check` completed successfully.

## Risks and gotchas

- The older Experiment A spec places the field before submit. Do not copy that placement.
- Existing success toasts are not a suitable container for the opt-in.
- A promise to email on “different takes” is broader than direct replies and can become noisy. Keep version one narrow.
- Anonymous status is a public presentation rule as well as an analytics property. Email content must not reveal profile linkage if the person later signs in.

## Definition of done

- [x] The post-comment inline treatment is implemented and accessible.
- [x] Consent is persisted safely and idempotently.
- [x] Every interaction is tracked without PII.
- [x] Comment completion remains independent of opt-in success.
- [x] QC-04 has a stable subscription record to consume.
