<!-- docs/growth/question-commenting/04-QC-01-PRODUCTION-VERIFICATION-2026-08-12.md -->

# QC-01 Production Verification — 2026-08-12

## Outcome

The deployed analytics foundation is working on the production question journey. Qualified impressions and composer starts reached PostHog with the controlled campaign attribution and without PII. No public test question or comment was created.

## Verified

- Production deployment built commit `eb53bc9d`, became ready, and was promoted to `9takes.com`.
- The analytics-aware `create_comment_atomic` RPC is present in production with anonymous and authenticated execution access.
- `/questions` and a question-detail page rendered successfully after promotion.
- The question-detail composer accepted and cleared a smoke-test draft without submission.
- `question_impression`: one event for campaign `qc01_deploy_verification_20260812`.
- `comment_started`: one event for the same campaign.
- `$pageview`: two attributable pageviews when PostHog test-account filtering was disabled.
- The impression payload contained only expected context such as question ID/URL, surface, source path, campaign, creation time, response count, and answered state.

## Deliberately not manufactured

We did not submit a fake public question, fake comment, or forced failure simply to generate `question_created`, `comment_created`, or `comment_failed`. The next organic mutation events should be inspected to finish that part of the production schema audit.

## Decision

QC-03 can proceed because the production client capture path, qualified-impression path, server mutation contract, and database migration are live. QC-06 may begin collecting its one-week impression baseline. The organic mutation-event inspection remains an explicit QC-01 closeout item.
