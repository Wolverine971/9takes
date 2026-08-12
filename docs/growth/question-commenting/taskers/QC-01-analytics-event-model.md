<!-- docs/growth/question-commenting/taskers/QC-01-analytics-event-model.md -->

# Tasker: Analytics Event Model for Questions and Comments

**For:** the agent implementing the measurement foundation for question supply, exposure, commenting, and first-response speed.  
**Owner:** DJ  
**Created:** 2026-08-12  
**Status:** Ready for deploy verification; production migration and browser smoke tests pending  
**Related:** [`../00-START-HERE.md`](../00-START-HERE.md), [`../02-BASELINE-2026-08-12.md`](../02-BASELINE-2026-08-12.md)

## 0. What and why

9takes can count confirmed comments but cannot reliably answer how many questions are created, which questions receive qualified impressions, how many remain unanswered, or how long a first response takes. This task creates the canonical event contract required by every later tasker.

The database remains the source of truth for created rows and response timestamps. PostHog becomes the source for exposure, surface, session, campaign, and UI behavior.

## 1. Required reading

1. `docs/growth/question-commenting/00-START-HERE.md`
2. `src/lib/analytics/commentEvents.ts` and its spec.
3. `src/lib/analytics/posthog.ts`.
4. `src/routes/questions/create/+page.server.ts` and `+page.svelte`.
5. `src/lib/components/molecules/Interact.svelte`.
6. `src/routes/+page.svelte` and `+page.server.ts`.
7. `src/lib/components/blog/StrategicQuestion.svelte`.
8. Existing analytics helpers and tests under `src/lib/analytics/`.

## 2. Define one typed event contract

Create or extend a focused analytics module rather than scattering raw event strings and property shapes across components.

Required events:

### `question_created`

Emit only after the production server has confirmed the insert and returned the final collision-safe ID and URL.

Properties:

- `question_id`
- `question_url`
- `surface = 'question_create'`
- `source_path`
- `has_context`
- `server_confirmed = true`
- `is_demo = false`

Do not include the question text or context in PostHog.

### `question_impression`

An impression is not a component mount. Count it when at least 50 percent of the question card or question header is visible for at least 750 milliseconds. Emit once per question, surface, and browser session.

Properties:

- `question_id`
- `question_url`
- `surface`: `homepage`, `question_page`, `questions_index`, or `strategic_blog`
- `source_path`
- `position` when the surface is a list
- `campaign` when already available
- `question_created_at` when supplied by server data
- `responses_visible_before_impression`
- `is_answered_by_viewer` when known

Use an IntersectionObserver helper with a session-scoped dedupe key. Honor reduced motion, although the observer itself must not depend on animation.

### `comment_started`

Emit once when a composer changes from blank to non-whitespace input. This is a diagnostic event, not a success event.

Properties:

- `question_id`
- `question_url`
- `surface`
- `comment_kind`
- `is_anonymous`

### `comment_failed`

Emit when a server submission fails. Use a bounded error category, never a raw exception or comment text.

Properties:

- The same stable context as `comment_started`.
- `failure_stage`
- `error_category`

### `comment_created`

Keep the existing event name and server-confirmed rule. Add precise booleans when the server can provide them:

- `is_first_comment_ever`
- `is_first_comment_on_question`
- `is_reply`
- `question_age_hours`
- `responses_before_comment`

Keep `is_first_contribution` for compatibility, but document its old meaning and stop treating it as a retention predicate.

## 3. Identity and attribution

- Ensure signed-in users are identified before their first eligible impression event.
- Preserve the anonymous visitor ID through sign-in so PostHog can merge the journey where supported.
- Keep the existing first-touch fingerprint linkage in the database.
- Forward existing UTM and invite identifiers through stable properties.
- Do not send email addresses or raw fingerprints to PostHog.

## 4. Database measurement queries

The first read-only report is [`../sql/2026-08-12-question-commenting-scorecard.sql`](../sql/2026-08-12-question-commenting-scorecard.sql).

Add a dated SQL or reproducible query section for:

- Questions created per day.
- Questions receiving a first response within 24 hours.
- Median time to first response.
- Questions still unanswered after 24 hours and seven days.
- Confirmed comments per question.
- First-time actors using `coalesce(author_id::text, fingerprint)`.

Prefer a read-only report query before creating a materialized view. Volume is currently low.

## 5. Tests

Add focused tests for:

- No event before confirmed question creation.
- One `question_created` payload with no question text.
- Impression threshold and duration.
- Impression dedupe by question, surface, and session.
- Separate impressions for the same question on two surfaces.
- One `comment_started` per composer lifecycle.
- Bounded `comment_failed` payload.
- Existing `comment_created` compatibility.
- Anonymous-to-identified visitor continuity helper.

## Verification checklist

- [x] `pnpm test -- src/lib/analytics`
- [x] Focused analytics, route, API, and component tests pass; the full Vitest suite also passes.
- [ ] `pnpm check`
- [ ] Local smoke test creates one question and produces exactly one `question_created` event.
- [ ] Local smoke test holds a card below the threshold and produces no impression.
- [ ] Local smoke test crosses the threshold and produces one impression.
- [x] Unit-level payload inspection confirms no question text, comment text, email, fingerprint, token, or IP address.
- [ ] Post-deploy PostHog schema shows all new events and expected properties.
- [x] Update `docs/growth/question-commenting/STATUS.md`.

## Local implementation update: 2026-08-12

- Added typed helpers for confirmed question creation, qualified impressions, composer starts, bounded failures, and precise success context.
- Wired impressions to the homepage, question page, questions index, and strategic blog question.
- Wired composer start and failure tracking to the homepage, question-page answer/comment composers, nested replies, and strategic blog question.
- Added transactionally derived comment-success metadata to `create_comment_atomic`, so first-comment, first-response, reply, response-order, and question-age properties come from the successful database write rather than browser guesses.
- Repaired the PostHog identity transition: anonymous route loads no longer reset the visitor ID, signed-in identity resolution gates eligible custom captures, and email is excluded from identify properties.
- A second-pass audit now also clears an identified `$user_id` persisted across a full reload when server auth resolves anonymous, and resets before a shared browser switches directly between two authenticated accounts. Ordinary anonymous visits still retain their device journey.
- Propagated an available `utm_campaign` into qualified question impressions and canonical comment events on the homepage, questions index, question page, and nested replies.
- Added the read-only SQL scorecard linked above.
- Focused result: 41 tests passed across nine files, including identity continuity, server analytics normalization, all comment mutation paths, and confirmed question creation. The full Vitest run also passed: 615 tests across 130 files.
- Applied the migration to a disposable PostgreSQL database and exercised first response, later response, returning actor on a new question, and nested reply cases. The returned analytics values and parent reply count matched the contract.
- The live PostHog schema does not show the four new event names yet, which is expected before deployment and is the remaining production gate.
- Fresh verification after the second-pass fixes: the full Vitest suite passes with 627 tests across 131 files, including direct wrapper tests for anonymous reloads and shared-browser account switches.
- `pnpm check` reported no diagnostics in this workstream's changed files. The repository-wide command remains red on the unrelated existing `scripts/lib/perspectiveReview.js` string-index type error.
- Production PostHog verification and browser smoke tests remain open; do not unblock QC-03 or QC-06 until those pass.

## Risks and gotchas

- SvelteKit client navigation can remount or reuse components. Dedupe cannot rely only on component-local state.
- Homepage answers currently emit both legacy and canonical events. Do not remove legacy events in this task unless a compatibility report proves it is safe.
- Server timestamps are canonical for time to first response. Do not calculate that duration solely from browser events.
- Question categories do not yet have a reliable single source. Emit a nullable category only when one exists; do not infer it from question text in the client.
- PostHog identity has already under-merged an anonymous-to-signed-in commenter. Verify identity flow instead of assuming `identify` repaired history.

## Definition of done

- [x] Typed event helpers are in place.
- [x] Question creation and qualified impressions are tracked on the first agreed surfaces.
- [x] Comment start, failure, and server-derived precise success properties are tracked.
- [x] Database queries reproduce supply and first-response metrics.
- [x] Focused tests, database-boundary checks, and local payload inspection pass.
- [ ] Production events are verified before QC-03 or QC-06 begins.
