<!-- docs/growth/question-commenting/taskers/QC-06-question-distribution-system.md -->

# Tasker: Measured Question Distribution System

**For:** the agent replacing the hard-coded homepage question with a controlled, impression-aware distribution queue.  
**Owner:** DJ  
**Created:** 2026-08-12  
**Status:** Blocked by QC-01  
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

- [ ] Homepage question is selected from an active feature run, not a source-code constant.
- [ ] Safe fallback exists if no run is active.
- [ ] Removed or flagged questions cannot be selected.
- [ ] Impression target and time limit end a run deterministically.
- [ ] DJ can pause, extend, or replace a run.
- [ ] Concurrent requests cannot create multiple active runs.
- [ ] Every surface emits the canonical impression event.
- [ ] Focused database, route, and component tests pass.
- [ ] `pnpm check` passes.

## Risks and gotchas

- Qualified impressions must be stable before this task starts.
- A feature run needs database state so deploys do not reset it.
- Questions can be moderated after selection. Validate on every load and when advancing the queue.
- Thirty impressions is not enough for sophisticated ranking. It is enough to avoid giving a question only two or three views.
- Question category scoring is out of scope until category data is reliable.

## Definition of done

- [ ] The homepage feature is data-backed and operator-controllable.
- [ ] Every selected question receives a measurable exposure window.
- [ ] Safe eligibility and fallback rules are enforced.
- [ ] First-response outcomes can be compared per run.
- [ ] Automatic expansion beyond the pilot remains disabled until reviewed.
