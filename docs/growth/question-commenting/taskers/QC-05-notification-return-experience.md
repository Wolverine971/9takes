<!-- docs/growth/question-commenting/taskers/QC-05-notification-return-experience.md -->

# Tasker: Notification Return Experience

**For:** the agent ensuring a reply-email click returns to the exact change and leads naturally to another meaningful action.  
**Owner:** DJ  
**Created:** 2026-08-12  
**Status:** Blocked by QC-04  
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

Required events:

- `reply_notification_landed`
- `reply_target_visible`
- `reply_notification_return_action`
- `related_question_shown`
- `related_question_opened`

Properties must distinguish notification ID, question ID, target comment ID, action type, and whether the target existed. No token or PII.

## Verification checklist

- [ ] A notification click lands on the exact reply on mobile and desktop.
- [ ] Removed reply fallback is calm and useful.
- [ ] No login is required to read the reply.
- [ ] No modal appears.
- [ ] Reduced-motion users do not receive animated scrolling or flashing highlight.
- [ ] Keyboard and screen-reader flows are usable.
- [ ] One related action appears only after target visibility.
- [ ] Attribution survives redirect and page load without exposing the token to PostHog.
- [ ] Focused tests and `pnpm check` pass.

## Risks and gotchas

- Comments can be nested. Resolve the root question server-side.
- Svelte rendering and invalidation can attempt to scroll before the reply exists in the DOM.
- A raw token in analytics, referrer logs, or client errors is a security leak.
- “Related” must initially use a transparent deterministic rule. Do not add opaque AI ranking in this task.

## Definition of done

- [ ] Exact target landing works across supported devices.
- [ ] What changed is obvious without being loud.
- [ ] Removed and reused-link states work.
- [ ] One contextually relevant next action is measured.
- [ ] The complete email-to-target journey is visible in PostHog without PII.
