<!-- docs/growth/question-commenting/taskers/QC-07-retention-scorecard.md -->

# Tasker: Question and Commenter Retention Scorecard

**For:** the agent turning the canonical events and database rows into a small weekly operating view.  
**Owner:** DJ  
**Created:** 2026-08-12  
**Status:** Waiting for one stable week of canonical production data
**Related:** [`../00-START-HERE.md`](../00-START-HERE.md), [`QC-01`](./QC-01-analytics-event-model.md)

## 0. What and why

The workstream needs one repeatable answer to whether question supply, response coverage, reachability, and later-day retention are improving. This task creates that view after the new event contract has production data.

The scorecard is an operating tool, not a vanity dashboard. Every panel must lead to a decision.

## 1. Required reading

1. `docs/growth/question-commenting/00-START-HERE.md`
2. `docs/growth/question-commenting/02-BASELINE-2026-08-12.md`
3. QC-01's final event contract and database queries.
4. QC-02's final email-to-comment report.
5. Existing PostHog dashboards and repository growth-log conventions.

## 2. Canonical weekly panels

### Supply and coverage

- Questions created.
- Questions with at least one qualified impression.
- Questions with first response within 24 hours.
- Questions unanswered after 24 hours and seven days.
- Median and p75 time to first response.

### Activation

- Qualified unique impressions by surface.
- Unique first-time commenters.
- Unique commenters per 100 impressions.
- Comment-start to confirmed-comment conversion.
- Comment failures by bounded category.

### Depth and reachability

- Same-session questions answered per commenter.
- Eligible anonymous first commenters.
- Reply opt-in shown, succeeded, and dismissed.
- Opt-in success rate.
- Replies per original comment.

### Return

- Mature seven-day revisit rate.
- Mature seven-day repeat-comment rate.
- Notification click-to-target-visible rate.
- Notification return-to-comment rate.
- Returning commenters as a share of weekly commenters.

### Acquisition

- Unique commenters by campaign, sequence, step, and surface.
- Comments per acquired commenter, reported separately.
- Welcome Email 1 journeys.
- Reactivation journeys kept in a separate panel.

## 3. Metric definitions

- Comment actor: `coalesce(author_id::text, fingerprint)` in the database.
- First-time commenter: actor's first non-removed confirmed comment.
- Same-session depth: additional confirmed comments within the first PostHog session or, when reconciling in the database, within a clearly labeled short-session proxy.
- Seven-day repeat commenter: another confirmed comment strictly more than 24 hours and no more than seven days after first comment.
- Mature cohort: first comment occurred at least seven complete days before report end.
- Qualified impression: QC-01's visibility and duration rule.
- First response: earliest non-removed top-level comment on the question.

## 4. Presentation rules

- Show numerator and denominator beside every percentage.
- Label immature cohorts.
- Add low-sample warnings below 25 eligible actors.
- Compare latest completed seven days to the previous completed seven days.
- Keep same-session depth separate from later-day retention.
- Keep comments separate from unique commenters.
- Use PostHog links where available and store reproducible SQL in the repo.

## 5. Alerts and decisions

Do not add alerts until two weeks of stable data exist. Candidate alerts after validation:

- A question remains unanswered for 24 hours after receiving at least 10 qualified impressions.
- Comment failure rate exceeds 5 percent with at least 20 starts.
- Reply notification send failures exceed 5 percent.
- Duplicate notification sends are greater than zero.

## Verification checklist

- [ ] Every metric has a written numerator and denominator.
- [ ] Database comment totals reconcile with PostHog confirmed unique comment IDs.
- [ ] Anonymous-to-profile reconciliation does not double-count the known August 10 journey.
- [ ] Legacy pre-July-25 events are excluded from current canonical panels.
- [ ] Mature and immature cohorts are visibly separated.
- [ ] Email reports identify sequence and step rather than Gmail referrer alone.
- [ ] No PII is present in saved insights, SQL output, or docs.
- [ ] One weekly update can be produced without hand-editing counts.

## Risks and gotchas

- PostHog person IDs are not yet sufficient for canonical anonymous retention.
- Small numbers can create dramatic percentages. Always show counts.
- The project timezone must be explicit when bucketing days.
- Historical and canonical event regimes cannot be graphed as one uninterrupted series without a labeled cutoff.

## Definition of done

- [ ] A compact PostHog dashboard or equivalent saved insight set exists.
- [ ] Reproducible database SQL is checked into this workstream.
- [ ] Weekly supply, activation, reachability, and return metrics are available.
- [ ] Low-sample and cohort-maturity rules are enforced.
- [ ] The scorecard is linked from `STATUS.md` and the workstream README.
