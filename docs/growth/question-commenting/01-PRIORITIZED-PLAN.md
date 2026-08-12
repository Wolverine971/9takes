<!-- docs/growth/question-commenting/01-PRIORITIZED-PLAN.md -->

# Prioritized Execution Plan

**Owner:** DJ  
**Created:** 2026-08-12  
**Status:** Active

## Order of work

| Order | Tasker                                                                                                | Priority | Why now                                                                                                     | Depends on                       |
| ----: | ----------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------- |
|     1 | [`QC-01 Analytics event model`](./taskers/QC-01-analytics-event-model.md)                             | P0       | Every later decision depends on trustworthy supply, impression, and conversion data.                        | None                             |
|     2 | [`QC-02 Email attribution and list closeout`](./taskers/QC-02-email-attribution-and-list-closeout.md) | P0       | Small implementation, corrects the false reactivation interpretation, and makes future sends attributable.  | QC-01 event vocabulary           |
|     3 | [`QC-03 Gentle anonymous reply opt-in`](./taskers/QC-03-gentle-reply-opt-in.md)                       | P1       | Turns an anonymous first comment into permission for a relevant second visit without interrupting the user. | QC-01                            |
|     4 | [`QC-04 Reply email delivery`](./taskers/QC-04-reply-email-delivery.md)                               | P1       | Makes the opt-in promise real, suppressed, deduplicated, and measurable end to end.                         | QC-03                            |
|     5 | [`QC-05 Notification return experience`](./taskers/QC-05-notification-return-experience.md)           | P1       | A click is wasted if it lands at the top of a generic page and hides what changed.                          | QC-04                            |
|     6 | [`QC-06 Question distribution system`](./taskers/QC-06-question-distribution-system.md)               | P2       | New questions need deliberate exposure, but rotation should not begin before impressions are trustworthy.   | QC-01, preferably QC-07 baseline |
|     7 | [`QC-07 Retention scorecard`](./taskers/QC-07-retention-scorecard.md)                                 | P2       | Turns the event contract into a weekly operating view after the first implementation data is flowing.       | QC-01, QC-02                     |

## Release slices

### Slice A: make the system observable

Ship QC-01 and QC-02 together or back to back.

Exit gate:

- A created question produces one canonical `question_created` event.
- A qualified view produces one deduplicated `question_impression` per question, surface, and session.
- Welcome links carry sequence and step attribution.
- A smoke-test journey can be reconstructed from email click to question impression to confirmed comment.

### Slice B: earn the second visit

Ship QC-03, QC-04, and QC-05 in order.

Exit gate:

- An eligible anonymous first commenter can ignore the ask without friction.
- An opted-in commenter receives exactly one email after a qualifying direct reply.
- The email opens the exact reply context.
- Suppression prevents every later send after opt-out.
- The full path is visible in PostHog without storing an email address there.

### Slice C: distribute question supply

Ship QC-06 only after qualified impressions have passed production smoke tests.

Exit gate:

- The homepage feature is data-backed instead of hard-coded.
- A question remains featured until an exposure or time threshold is met.
- Unanswered questions receive deliberate exposure without rapid rotation.
- An operator can override or pause the queue.

### Slice D: operate weekly

Ship QC-07 after at least one week of the new event model. Retention panels should initially display cohort maturity and low-sample warnings.

## What not to do yet

- Do not send another broad reactivation batch to manufacture sample size.
- Do not auto-rotate the homepage question daily.
- Do not request browser notifications.
- Do not place the anonymous email field before comment submission.
- Do not create a broad weekly digest in the first notification release.
- Do not call same-session multi-comment behavior retention.
- Do not pick a winning question category before category data exists.

## Suggested first working session

1. Implement the QC-01 event constants and property types.
2. Add `question_created` to the confirmed creation path.
3. Add the homepage and question-page qualified impression helper.
4. Add focused unit tests.
5. Verify the event payloads locally before expanding to the questions index or blog surfaces.
