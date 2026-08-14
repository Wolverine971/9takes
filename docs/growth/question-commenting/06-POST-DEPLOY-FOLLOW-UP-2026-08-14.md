<!-- docs/growth/question-commenting/06-POST-DEPLOY-FOLLOW-UP-2026-08-14.md -->

# Post-deploy follow-up: 2026-08-14

**Sources:** PostHog project 35460, read-only production database queries, Vercel deployment state, and live route smoke checks  
**PostHog timezone:** UTC  
**Status:** Analytics implementation healthy; behavioral sample still immature; newest application release blocked by an asset ratchet

## Production state

- `9takes.com` is healthy and currently serves ready deployment `dpl_98SjzNJgcZEmvn8DYq1xXYy9jsxc`, built from commit `9aa6e63` and completed at 2026-08-13 19:08 UTC.
- Homepage and questions index return `200`, the question-distribution admin route redirects anonymous visitors to login, and the reply-notification cron returns `401` without its secret.
- The attempted deployment of commit `f31661a` failed before the application build because the revised Carl Jung portraits exceeded the protected portrait-library budget by 466.01 KiB.
- Local `main` subsequently advanced to commit `998d5196`, which adds the Adela portrait and records the complete 1,114-file portrait baseline. The current commit passes the static gate, Vite production build, and final budget gate.
- Production has recorded 16 modern timestamped migrations through `20260813213000_quarantine_failed_question_rewrites`.
- The database-driven editorial reset is therefore live even though the matching application commit is not. The public questions RPC currently reports 53 eligible questions and 761 answers; 292 unanswered chorus questions are `needs_review`, 66 are `needs_redesign`, and one stale prompt is rejected.
- The homepage fallback question, ID 567, remains public, unflagged, and answered.

## PostHog movement since the previous audit

Cumulative qualified impressions since the event launched increased from 40 to 102, a net gain of 62:

| Surface         | Impressions | PostHog people | Distinct questions | Bot-classified events |
| --------------- | ----------: | -------------: | -----------------: | --------------------: |
| Questions index |          96 |              8 |                 45 |                     2 |
| Homepage        |           3 |              3 |                  1 |                     0 |
| Question page   |           3 |              1 |                  2 |                     0 |

After the currently serving deployment completed, PostHog recorded 55 questions-index impressions and one question-page impression. Among non-bot index visitors, one person generated 44 qualified card impressions while the other two generated five and four. The new volume therefore demonstrates working instrumentation and inventory exposure, not broad reach.

One mobile homepage visitor arrived from Brave Search and qualified for the fallback question impression. The two new question-detail impressions were on questions 567 and 568. There was no corresponding comment start or completed comment.

## Database reconciliation

Since the previous audit cutoff at 2026-08-13 11:52 UTC, production contains:

- Zero new comments.
- Zero new questions.
- Zero reply-email subscriptions.
- Zero reply-notification outbox rows.
- Zero feature runs.
- Zero durable feature-run impressions.

This reconciles with PostHog's absence of new comment, reply-opt-in, delivery, and return events. There is no evidence that the canonical comment event stopped firing; there has simply been no production comment to emit it.

## Decisions and next gates

1. Push and deploy the current verified commit after the concurrent content work is ready; do not treat the `f31661a` application changes as live until a ready deployment replaces commit `9aa6e63`.
2. Treat the editorial reset as a new distribution boundary. Pre-reset impression counts can validate instrumentation, but should not rank the new 53-question public inventory.
3. Keep automatic rotation off. Select one question for the first manual 30-impression feature run after the application deployment is healthy.
4. Continue waiting for the next organic comment to verify the new server-derived outcome properties.
5. Keep the reply-subscription and notification return journeys in smoke-pending state until a real eligible journey or a no-noise controlled journey occurs.
