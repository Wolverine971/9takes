<!-- docs/growth/question-commenting/taskers/QC-05-notification-return-experience.md -->

# Tasker: Notification Return Experience

**For:** the agent ensuring a reply-email click returns to the exact change and leads naturally to another meaningful action.  
**Owner:** DJ  
**Created:** 2026-08-12  
**Status:** Deployed; controlled mobile and desktop return verification pending
**Related:** [`QC-04`](./QC-04-reply-email-delivery.md)

## 0. What and why

A notification click is not a successful return if the person lands at the top of a page and must hunt for the reply. This task makes the return immediately legible, preserves anonymity, and offers one relevant next action after the reply is read.

## 1. Required reading

1. Question-page routing and comment rendering components.
2. Existing comment IDs and anchor behavior.
3. Signed-in notification feed deep links.
4. QC-04's signed notification URL and token contract.
5. Question recommendation or list-query helpers.

## 2. Exact-thread landing

The signed email URL must:

- Open the root question.
- Validate and consume only the notification token needed for attribution and suppression state.
- Scroll to the exact new reply after rendering.
- Place keyboard focus on a sensible thread heading or the reply only when the user explicitly followed the link and doing so will not disrupt screen-reader navigation.
- Add a subtle temporary highlight that does not flash.
- Keep the original subscribed comment visible nearby.
- Degrade to the question thread with a clear message if the reply was removed.

Do not open a modal or force a login.

## 3. Show what changed

Use a small inline label such as `New reply` and remove or soften it after the reply has been visible. Do not expose the reply author's identity beyond the current product rules.

The page must distinguish:

- Direct reply still available.
- Reply removed.
- Link already used but still safe to revisit.
- Subscription stopped.

## 4. One next action

After the visitor has viewed the reply, offer one of:

1. Reply, if their current identity state permits it.
2. Read the rest of this thread.
3. Answer one related unanswered question.

Do not show a generic homepage CTA. Limit the surface to one recommendation and explain why it is relevant.

## 5. Analytics

Required core events:

- `reply_notification_landed`
- `reply_target_visible`
- `reply_notification_return_action`

If the related-question option is chosen, also emit:

- `related_question_shown`
- `related_question_opened`

Properties must distinguish notification ID, question ID, target comment ID, action type, and whether the target existed. No token or PII.

## Verification checklist

- [ ] A notification click lands on the exact reply on mobile and desktop.
- [x] Removed reply fallback is calm and useful.
- [x] No login is required to read the reply.
- [x] No modal appears.
- [x] Reduced-motion users do not receive animated scrolling or flashing highlight.
- [x] Keyboard and screen-reader flows are usable in focused component coverage.
- [x] One related action appears only after target visibility.
- [x] Attribution survives redirect and page load without exposing the token to PostHog.
- [ ] Focused tests and `pnpm check` pass. Focused tests pass; the repository check remains blocked only by pre-existing `scripts/lib/perspectiveReview.js:48`.

## Implementation update: 2026-08-12

- Replaced the unusable raw nested-comment hash with a protected return route. Each outbox row owns a private random return token that is separate from the ordinary email tracking ID.
- The return route resolves only bounded thread context, writes a ten-minute HMAC-signed HttpOnly cookie, and redirects to a clean question URL. The return token, tracking ID, email address, fingerprint, and management token never reach page data or PostHog.
- Because the legacy email tracking table permits anonymous tracking lookup, both the private reply URL and conversation stop URL are redacted from its stored HTML and plain text. Only the provider payload contains the working links.
- A verified return temporarily satisfies the give-first gate for that page load, including on another device, without linking the anonymous comment to a profile or requiring login.
- Added a dedicated inline return surface that keeps the subscribed take and exact reply together, moves focus to a descriptive heading, scrolls with reduced-motion support, uses a subtle settling highlight, and shows a calm fallback when either source comment is removed.
- The same-browser revisit changes `New reply` to `Reply from your email`. A stopped subscription gets a quiet inline status, and the link remains safe to revisit.
- Added privacy-safe `reply_notification_landed`, `reply_target_visible`, and `reply_notification_return_action` events. The single `Read the rest of the discussion` action appears only after the target or fallback surface is visible.
- Focused signing, route, component, delivery, and click suites pass (5 files, 17 tests). Disposable PostgreSQL verification confirms the private return-token lookup and the existing delivery safeguards.

## Risks and gotchas

- Comments can be nested. Resolve the root question server-side.
- Svelte rendering and invalidation can attempt to scroll before the reply exists in the DOM.
- A raw token in analytics, referrer logs, or client errors is a security leak.
- “Related” must initially use a transparent deterministic rule. Do not add opaque AI ranking in this task.

## Production migration update: 2026-08-12

- The private `return_token` column and return-context RPC are live in production through `20260813014408_reply_notification_delivery_and_return`.
- Production privileges confirm that anon can resolve only the bounded return context through the RPC and cannot read the outbox. The route and question-page app code still require deployment before mobile and desktop smoke verification.

## Definition of done

- [ ] Exact target landing works across supported devices. Local behavior is covered; production mobile and desktop smoke tests remain.
- [x] What changed is obvious without being loud.
- [x] Removed and reused-link states work.
- [x] One contextually relevant next action is measured.
- [x] The complete email-to-target journey is instrumented without PII; live PostHog verification remains.
