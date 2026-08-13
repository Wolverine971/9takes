<!-- docs/growth/question-commenting/taskers/QC-06-question-distribution-system.md -->

# Tasker: Measured Question Distribution System

**For:** the agent replacing the hard-coded homepage question with a controlled, impression-aware distribution queue.  
**Owner:** DJ  
**Created:** 2026-08-12  
**Status:** Production migration applied; app deployment pending
**Related:** [`QC-01`](./QC-01-analytics-event-model.md), `src/routes/+page.server.ts`

## 0. What and why

As question creation increases, new questions need deliberate exposure. Current homepage traffic is too small for daily rotation. Rapid rotation would give each question only a few impressions and create the illusion that most questions do not convert.

This task creates a controlled feature queue with an operator override and uses qualified impressions to decide when a question has received a fair test.

## 1. Required reading

1. `src/routes/+page.server.ts` and `+page.svelte`.
2. `src/routes/questions/+page.server.ts` and `+page.svelte`.
3. Question moderation and removal rules.
4. QC-01's production impression contract.
5. Existing admin question tooling.

## 2. Start with a manual pilot

Do not begin with a fully automatic ranking algorithm.

Create a feature-run record containing:

- Question ID.
- Start and end timestamps.
- Reason selected.
- Selection mode: `manual`, `queue`, or `fallback`.
- Target unique impressions.
- Maximum feature duration.
- Paused or ended state.
- Operator notes.

The first default rule:

- Keep one question featured until it reaches 30 qualified unique homepage impressions or seven days, whichever comes first.
- Allow DJ to extend, stop, or replace it.
- Never feature removed or flagged questions.

The thresholds are pilot defaults, not permanent product constants. Keep them configurable.

## 3. Queue eligibility

Candidate questions should be:

- Published and not removed or flagged.
- Understandable without private context.
- Not already given a completed feature run unless deliberately recycled.
- Preferably unanswered or low-response when the goal is first-response support.
- Old enough that post-processing and tagging have completed.

Question quality remains an editorial gate. Do not auto-feature solely because a question is newest.

## 4. Additional distribution surfaces

After the homepage pilot is stable:

- Add a `New questions` section to the questions index.
- Offer one unanswered question after a confirmed comment.
- Allow an email editor to select a question independently of the homepage feature.

Each surface must emit the same `question_impression` event with a distinct `surface` value.

## 5. Measures

Per feature run:

- Qualified unique impressions.
- Unique commenters.
- Commenters per 100 impressions.
- Time to first response during the run.
- Anonymous versus signed-in participation.
- Same-session additional questions answered.
- Later-day returns.

Do not rank questions by raw comments alone.

## Verification checklist

- [x] Homepage question is selected from an active feature run, not a source-code constant.
- [x] Safe fallback exists if no run is active.
- [x] Removed or flagged questions cannot be selected.
- [x] Impression target and time limit end a run deterministically.
- [x] DJ can pause, resume, extend, stop, or replace a run.
- [x] Concurrent requests cannot create multiple active runs.
- [x] Every existing surface emits the canonical impression event; homepage events also carry `feature_run_id` when a run is active.
- [x] Focused database, route, analytics, and component tests pass.
- [ ] `pnpm check` passes. QC-06 adds no diagnostics; the repository remains blocked by pre-existing `scripts/lib/perspectiveReview.js:48`.

## Local implementation update: 2026-08-12

- Added `question_distribution_settings`, private feature-run and deduplicated-impression tables, transaction-locked control RPCs, and service-role-only access in `20260813030000_question_feature_runs.sql`.
- The selector ends an active run when it reaches its unique-impression target, exceeds its time window, or becomes removed/flagged. It then uses the explicit database fallback; the application constant is retained only as a final outage fallback.
- The homepage records the same 50%-visible-for-750-ms qualified impression in PostHog and, for active runs, a private server counter keyed by a SHA-256 browser-fingerprint hash. Raw fingerprints do not enter the feature-run tables or PostHog.
- Added a dedicated admin page for starting/replacing a manual run, setting the fallback, and pausing, resuming, extending, or stopping the current run. It visibly labels automatic advancement as off.
- `feature_run_id` is attached to qualified homepage impressions, comment starts/failures/conversions, and the legacy homepage answer/open events so a run can be analyzed without relying only on question ID and timestamps.
- Disposable PostgreSQL verification passed target completion, duplicate suppression, fallback recovery, moderation invalidation, operator controls, and role privileges. Eight focused files pass 32 tests, all 145 repository test files pass 674 tests, and Svelte autofix reports no issue on the new admin page.
- A fresh PostHog schema read did not expose `question_impression`, despite the earlier controlled production verification. Until organic events appear and the sample is reviewed, this implementation remains a manual pilot and does not auto-advance a queue.

## Production migration update: 2026-08-12

- Production already contained the three QC-06 tables and five RPC signatures without a `20260813030000` ledger row. All run and impression tables were empty, and the singleton settings row held fallback question 567 with the 30-impression/seven-day defaults.
- Reapplied the idempotent migration and inserted its ledger record in one transaction. Verification confirms question 567 resolves as the fallback, no run is active, all three tables have RLS enabled, anon cannot read the run table or execute the selector, and the service role can execute it.
- Applying the schema did not start a pilot or enable queue automation. The app deployment and first manual operator-selected run remain explicit next gates.

## Risks and gotchas

- Qualified impressions must be stable before this task starts.
- A feature run needs database state so deploys do not reset it.
- Questions can be moderated after selection. Validate on every load and when advancing the queue.
- Thirty impressions is not enough for sophisticated ranking. It is enough to avoid giving a question only two or three views.
- Question category scoring is out of scope until category data is reliable.

## Definition of done

- [x] The homepage feature is data-backed and operator-controllable locally.
- [x] Every selected question receives a measurable exposure window.
- [x] Safe eligibility and fallback rules are enforced.
- [x] First-response outcomes can be compared per run through `feature_run_id`.
- [x] Automatic expansion beyond the pilot remains disabled until reviewed.
