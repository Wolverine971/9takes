<!-- docs/growth/question-commenting/05-POST-DEPLOY-AUDIT-2026-08-13.md -->

# Post-deploy audit: 2026-08-13

**Sources:** PostHog project 35460, read-only production database queries, Vercel deployment state, and repository verification  
**PostHog timezone:** UTC  
**Status:** Implementation healthy; behavioral sample immature

## Production and database verification

- The production deployment reports `READY`, and `9takes.com` points to it.
- Homepage and questions-index smoke checks return `200`.
- The question-distribution admin route redirects anonymous visitors to login.
- The reply-notification cron returns `401` without its secret.
- All 14 migrations in the modern timestamped chain are recorded through `20260813030000_question_feature_runs`.
- Production contains zero reply-email subscriptions, zero notification outbox rows, zero question feature runs, and zero durable feature-run impressions.
- The homepage therefore remains on the explicit fallback. No live email was sent and no feature run was started during this audit.

## Repository verification

- Full unit suite after the audit fixes: 145 files and 675 tests passed.
- Svelte's autofixer reported no issue in the reviewed workstream components.
- The strict project check exposed one workstream test-fixture type error and one unrelated content-pipeline JavaScript typing error. Both are corrected; `svelte-check` now reports zero errors. Existing repository warnings remain non-blocking.
- The workstream fixture now supplies the required page `params` prop, and the content helper now declares its frontmatter map type without changing runtime behavior.
- The reply-return highlight now remains in its `New reply` state for four seconds before settling to `Reply`; reduced-motion visitors settle immediately.
- Focused tests cover the corrected fixture and highlight timing.
- The production build and all asset-budget ratchets pass.

## First PostHog signals

The new event model is ingesting. Since `question_impression` first appeared on 2026-08-12:

| Surface         | Qualified impressions | PostHog people | Distinct questions | Interpretation                                                                   |
| --------------- | --------------------: | -------------: | -----------------: | -------------------------------------------------------------------------------- |
| Questions index |                    37 |              3 |                 30 | A small number of viewers saw many cards; count per question, not per page load. |
| Homepage        |                     2 |              2 |                  1 | Too small to judge question conversion.                                          |
| Question page   |                     1 |              1 |                  1 | Tagged QC-01 deployment verification traffic.                                    |

Traffic context over the same initial window:

| Surface         | Pageviews | PostHog people |
| --------------- | --------: | -------------: |
| Questions index |        12 |              4 |
| Homepage        |         9 |              6 |
| Question page   |         3 |              1 |

The impression implementation is working, but 40 impressions from five people are not a decision-quality distribution sample. Thirty-seven impressions came from only three questions-index viewers.

## Commenting and retention signals

- The only post-launch `comment_started` event is the tagged QC-01 verification event.
- No `comment_created` event has arrived since the new server-derived outcome properties shipped, so `is_first_comment_ever`, `is_first_comment_on_question`, `question_age_hours`, and `responses_before_comment` still need their first organic payload verification.
- The older canonical window contains 20 server-confirmed, non-duplicated `comment_created` events from 12 PostHog people.
- Three of those people commented more than once; only one commented on multiple calendar days. The maximum was seven comments by one PostHog person.
- Ten of the 20 comments carried Gmail as the referring domain. Database reconciliation still shows those as two humans reached by Welcome Email 1, not a broad Gmail acquisition channel.
- The latest completed seven-day database window, 2026-08-06 through 2026-08-12 UTC, had nine commenters: seven first-time and two returning. This is only 9/25 of the tasker's minimum sample threshold, so the 22% returning share is directional only.
- Only two questions were created in the last 30 days, both before the current deployment. Both received a first response within 24 hours, but the sample is too small to optimize categories or distribution rules.

## Reply and distribution readiness

- PostHog does not yet show reply-opt-in, delivery, or notification-return events.
- The database also has no reply-email subscriptions or outbox rows, confirming that absence is expected rather than a reporting mismatch.
- No manual question feature run exists. PostHog's two homepage impressions belong to the fallback question and therefore do not increment the private feature-run counter.

## Decisions and next gates

1. Observe the next organic comment and verify all server-derived `comment_created` properties before using first-comment or time-to-response panels.
2. Select one editorially appropriate question for the first manual 30-impression feature run; do not enable automatic rotation.
3. Complete one controlled reply-email journey only when it can be done without creating fake public conversation noise.
4. Wait for one stable week and at least 25 eligible actors before promoting QC-07 percentages into operating decisions.
