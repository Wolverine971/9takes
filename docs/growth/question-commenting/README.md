<!-- docs/growth/question-commenting/README.md -->

# Question Commenting Growth Workstream

Status: active  
Owner: DJ  
Started: 2026-08-12

This folder is the operating home for improving the path from a new question to a first response, then from a first-time commenter to a returning participant.

Start with [`00-START-HERE.md`](./00-START-HERE.md), then use [`01-PRIORITIZED-PLAN.md`](./01-PRIORITIZED-PLAN.md) to select the next tasker.

## Working documents

| Document                                                                             | Purpose                                                                       |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| [`00-START-HERE.md`](./00-START-HERE.md)                                             | Origin, goals, decisions, PostHog method, and operating rules                 |
| [`01-PRIORITIZED-PLAN.md`](./01-PRIORITIZED-PLAN.md)                                 | Ordered execution plan and dependency map                                     |
| [`02-BASELINE-2026-08-12.md`](./02-BASELINE-2026-08-12.md)                           | Evidence snapshot, corrected email attribution, and current caveats           |
| [`05-POST-DEPLOY-AUDIT-2026-08-13.md`](./05-POST-DEPLOY-AUDIT-2026-08-13.md)         | Production verification and first post-deploy signals                         |
| [`06-POST-DEPLOY-FOLLOW-UP-2026-08-14.md`](./06-POST-DEPLOY-FOLLOW-UP-2026-08-14.md) | Deployment follow-up, reconciled analytics, and the new distribution boundary |
| [`STATUS.md`](./STATUS.md)                                                           | Small live tracker for task state and decisions                               |
| [`taskers/README.md`](./taskers/README.md)                                           | Tasker queue and ownership boundaries                                         |

## Scope

This workstream owns:

- Question creation and impression analytics.
- Comment conversion and time-to-first-response measurement.
- A gentle, optional reply-notification opt-in for anonymous commenters.
- End-to-end reply email delivery, deep linking, suppression, and tracking.
- The return visit experience after a notification.
- Welcome-email attribution and reactivation-list closeout.
- Distribution rules for new and unanswered questions.
- A stable commenter-retention scorecard.

It does not own broad newsletter strategy, unrelated signup capture, general SEO, or a redesign of the entire questions product.

## Current next gates

The analytics and reply implementation is deployed. The newest application release is blocked by a portrait-budget ratchet; its verified local correction must be redeployed first. After that, the next safe gates are to inspect the next organic confirmed comment, select the first manual 30-impression feature run from the reset public inventory, and complete one controlled reply-email return journey. Automatic rotation and the weekly retention dashboard remain intentionally off until the sample matures.
