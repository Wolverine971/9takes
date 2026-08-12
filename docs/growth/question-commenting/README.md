<!-- docs/growth/question-commenting/README.md -->

# Question Commenting Growth Workstream

Status: active  
Owner: DJ  
Started: 2026-08-12

This folder is the operating home for improving the path from a new question to a first response, then from a first-time commenter to a returning participant.

Start with [`00-START-HERE.md`](./00-START-HERE.md), then use [`01-PRIORITIZED-PLAN.md`](./01-PRIORITIZED-PLAN.md) to select the next tasker.

## Working documents

| Document                                                   | Purpose                                                             |
| ---------------------------------------------------------- | ------------------------------------------------------------------- |
| [`00-START-HERE.md`](./00-START-HERE.md)                   | Origin, goals, decisions, PostHog method, and operating rules       |
| [`01-PRIORITIZED-PLAN.md`](./01-PRIORITIZED-PLAN.md)       | Ordered execution plan and dependency map                           |
| [`02-BASELINE-2026-08-12.md`](./02-BASELINE-2026-08-12.md) | Evidence snapshot, corrected email attribution, and current caveats |
| [`STATUS.md`](./STATUS.md)                                 | Small live tracker for task state and decisions                     |
| [`taskers/README.md`](./taskers/README.md)                 | Tasker queue and ownership boundaries                               |

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

## Current next task

Start with [`QC-01`](./taskers/QC-01-analytics-event-model.md). Do not ship the email opt-in or distribution algorithm until its measurement contract is implemented and verified.
