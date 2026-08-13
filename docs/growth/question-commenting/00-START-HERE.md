<!-- docs/growth/question-commenting/00-START-HERE.md -->

# Start Here: Question Commenting Growth

**Owner:** DJ  
**Created:** 2026-08-12  
**Status:** Active source of truth

## Origin

9takes has begun receiving comments on questions often enough to investigate the behavior as a product loop instead of isolated activity. The initial PostHog review found a promising activation signal and a weak retention signal:

- New visitors are willing to comment quickly.
- Comment volume recently increased, but it was concentrated on two days and a small number of people.
- Signed-in commenters sometimes answer several questions in one sitting.
- Almost nobody returns to comment on a later day.
- The existing event model can count confirmed comments, but it cannot reliably measure new-question supply, impressions, unanswered questions, or time to first response.

The workstream therefore has two connected jobs:

1. Make the question-to-comment system measurable.
2. Build a respectful reason for a first-time commenter to return.

## Product principle

The intended loop is:

`question created -> question seen -> first response -> relevant reply -> polite notification -> exact-thread return -> another meaningful action`

The product should earn the second visit by telling someone that something personally relevant changed. It should not manufacture urgency or repeatedly ask for an email.

## UX decision: gentle, never interruptive

The anonymous reply-notification ask must follow these rules:

- No modal.
- No page-covering overlay.
- No focus stealing.
- No blocking the comment submission or reveal.
- No repeated prompt after dismissal.
- No notification permission request from the browser.
- No vague newsletter language.
- No claim that an email will be sent until delivery exists end to end.

The preferred treatment is a small inline tray that expands near the newly posted comment after server confirmation. It should feel like an optional continuation of the success state, not a conversion gate.

Working copy:

> **Want a note if someone replies?**  
> Leave an email if you'd like. Your take stays anonymous, and we'll only email about this conversation.

Primary action: `Keep me posted`  
Secondary action: `Not now`

The final copy can be refined during implementation, but the promise cannot become broader or more aggressive without DJ's approval.

## How to analyze PostHog for this workstream

### 1. Discover before querying

Use the live PostHog schema before writing a query. Event and property names have changed during the pilot period. Do not infer names from old planning documents.

Current canonical success event:

- `comment_created`
- Require `server_confirmed = true`.
- Deduplicate with `comment_id` when counting comments.
- Use `comment_kind` to separate answers, comments, and replies.
- Use `surface` to separate homepage from question-page behavior.

### 2. Treat the July 25 tracking change explicitly

`comment_created` began on 2026-07-25. Before that cutoff, homepage and strategic-question responses were tracked with older answer events. After the cutoff, those older events overlap with `comment_created` and must not be added together.

Historical response rule:

- Before the first `comment_created`: count `homepage_question_answered` and `strategic_question_answered`.
- On and after the first `comment_created`: count only confirmed `comment_created` events.

### 3. Separate event volume from people

Always report at least:

- Confirmed unique comments.
- Unique commenters.
- Unique questions receiving a comment.
- Active calendar days.
- Same-session depth.
- Later-day return.

Seven comments from one person in one session is useful depth. It is not seven acquired community members and it is not retention.

### 4. Use mature retention cohorts

The canonical seven-day repeat-comment metric includes only first-time commenters whose full seven-day observation window has elapsed.

A return requires a new confirmed comment strictly more than 24 hours and no more than seven days after the person's first confirmed comment. Same-day depth is reported separately.

For database analysis, identify an actor as:

`coalesce(author_id::text, fingerprint)`

PostHog person identity currently under-merges at least one anonymous-to-signed-in journey. Do not use raw PostHog person counts as the only retention source until identity capture is repaired.

### 5. Use PostHog and the product database for different truths

PostHog is the primary source for:

- Impressions and surfaces.
- Sessions and paths.
- Acquisition parameters.
- UI interaction events.
- Funnel behavior.

The production database is the primary source for:

- Confirmed question and comment rows.
- Exact creation timestamps.
- Time to first response.
- Email send and click records.
- Suppression and unsubscribe state.
- Anonymous fingerprint to later profile reconciliation.

Use `./scripts/db-query.sh` for read-only production queries. Never write email addresses, fingerprints, tokens, or IP addresses into this folder.

### 6. Do not equate Gmail referrer with an email campaign

`com.google.android.gm` proves that Gmail was in the navigation chain. It does not identify a sequence or message by itself. Confirm campaign attribution using tracked links or by joining an identified recipient's email send and click timestamps to the comment timestamp.

The corrected email finding is recorded in [`02-BASELINE-2026-08-12.md`](./02-BASELINE-2026-08-12.md).

## Measurement contract

The workstream will use these primary outcomes:

| Stage              | Primary measure                                                |
| ------------------ | -------------------------------------------------------------- |
| Question supply    | Questions created per day                                      |
| Distribution       | Unique qualified impressions per question and surface          |
| First response     | Percentage receiving a response within 24 hours                |
| Response speed     | Median time from question creation to first confirmed response |
| Activation         | Unique commenters per 100 qualified impressions                |
| Same-session depth | Questions answered per commenter in the first session          |
| Reachability       | Reply-email opt-ins per eligible anonymous first commenters    |
| Return             | Mature seven-day revisit and repeat-comment rates              |
| Conversation       | Replies per original comment                                   |

Guardrails:

- Comment completion must not decline because of the email ask.
- The email ask must not block, cover, or move focus away from the revealed discussion.
- Every reply email must have one-click unsubscribe or equivalent signed suppression control.
- No duplicate email for the same reply event.
- Anonymous status must remain anonymous in the public UI and email content.

## Existing systems to reuse

- `src/lib/analytics/commentEvents.ts` already emits the canonical confirmed comment event.
- `src/lib/components/molecules/Interact.svelte` owns the question-page composer and signed-in subscription toolbar.
- `supabase/migrations/20260725_notifications.sql` already creates signed-in in-app notifications for replies, new takes, and likes.
- `src/lib/email/sender.ts` and `src/lib/email/base-template.ts` already provide tracked email delivery and suppression plumbing.
- `src/lib/email/welcome-sequence-content.ts` contains the currently proven question email.
- `src/routes/questions/create/+page.server.ts` is the confirmed question write path.
- `src/routes/+page.server.ts` now reads the homepage question from the QC-06 feature-run selector, with an explicit database fallback and a final application emergency fallback.

The taskers extend these systems. They should not build a parallel notification or email framework.

## Decisions already made

1. Instrumentation precedes automated distribution.
2. The reply-email ask is post-comment and inline, not pre-submit and not a modal.
3. Initial notification scope is direct replies to the subscribed comment. Broader digests require a separate decision.
4. Welcome Email 1 is the current acquisition pattern worth preserving and measuring.
5. The nearly exhausted reactivation list is not a renewable acquisition channel.
6. Question categories remain optional until the data has a reliable category source.
7. Small samples will be reported descriptively. No A/B decision will be made from a handful of commenters.

## Definition of success for this workstream

This effort succeeds when 9takes can answer, without forensic reconstruction:

- How many questions were created this week?
- Which questions were actually seen?
- How many received a first response within 24 hours?
- How long did the first response take?
- Which surfaces and campaigns created unique commenters?
- How many eligible anonymous commenters requested reply emails?
- Did notifications bring them back to the exact thread?
- Did they comment again on a later day?
