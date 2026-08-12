<!-- docs/growth/question-commenting/taskers/QC-02-email-attribution-and-list-closeout.md -->

# Tasker: Email Attribution and Reactivation List Closeout

**For:** the agent making welcome-email participation attributable and closing the finite reactivation-list learning loop.  
**Owner:** DJ  
**Created:** 2026-08-12  
**Status:** Ready  
**Related:** [`../02-BASELINE-2026-08-12.md`](../02-BASELINE-2026-08-12.md)

## 0. What and why

The initial PostHog read incorrectly made Gmail look like a broad channel signal. Reconciliation shows that 10 Gmail-attributed comments came from two people immediately after Welcome Sequence Email 1. The broad reactivation sequences sent 253 messages to 90 recipients and produced only two tracked clicked sends.

This task makes every welcome link attributable, creates a reproducible email-to-comment report, and records a clear decision about the remaining finite reactivation population. It does not authorize a new send.

## 1. Required reading

1. `docs/growth/question-commenting/02-BASELINE-2026-08-12.md`
2. `src/lib/email/welcome-sequence-content.ts`
3. `src/lib/email/reactivation-sequence-content.ts`
4. `src/lib/email/sequences.ts`
5. `src/lib/email/base-template.ts`
6. `src/lib/email/sender.ts`
7. Existing sequence and template specs.
8. `docs/email-sequences/reactivation-sequence-plan.md`

## 2. Preserve the proven welcome pattern

Do not rewrite Welcome Email 1 before attribution is fixed. The current pattern is:

- One personal, concrete question.
- One primary CTA.
- A direct question-page link.
- A clear two-minute expectation.
- An answer-first, reveal-after promise.

Treat its 10 comments from two people as encouraging qualitative evidence, not a statistically reliable conversion rate.

## 3. Add structured attribution to welcome links

Extend the existing `EmailLinkAttribution` path so welcome sequence links receive:

- `utm_source=welcome`
- `utm_medium=email`
- `utm_campaign=welcome-sequence`
- `utm_content=welcome_sequence_step_<n>_link_<n>`

Requirements:

- Preserve caller-supplied UTM values.
- Attribute both HTML and plain-text links.
- Ensure the brand/logo link is attributable or explicitly excluded from campaign conclusions.
- Keep click tracking and destination safety validation intact.
- Add tests for every welcome step and the brand link behavior.

## 4. Build the sequence-to-comment report

Use read-only production SQL to report, per sequence and step:

- Recipients sent.
- Delivered or non-bounced sends where available.
- Opens as directional only.
- Unique clickers.
- Unique question-page landings when PostHog attribution exists.
- Unique commenters within 24 hours and seven days.
- Confirmed comments within 24 hours and seven days.
- Questions answered per commenter.
- Later-day repeat commenters.

Join identified recipients through normalized email and profile ID. Reconcile anonymous-to-profile journeys through the existing first-touch fingerprint only in the database. Do not export identities.

## 5. Close out reactivation deliberately

Prepare a decision note with three options:

1. Pause new reactivation enrollment while current enrollments finish.
2. Stop remaining steps for active recipients.
3. Continue the already-enrolled cadence with no new enrollment.

For each option, show remaining recipients, expected sends, unsubscribes, clicks, and attributable later comments. Do not mutate sequence status without DJ's explicit approval.

The default recommendation should be no new broad enrollment until a clear click-to-comment pattern appears. `reactivation_cold` remains unused and must not be treated as free experiment inventory.

## Verification checklist

- [ ] Welcome HTML links receive correct sequence and step UTMs.
- [ ] Welcome plain-text links receive equivalent UTMs.
- [ ] Existing reactivation attribution tests remain green.
- [ ] Caller-supplied attribution is preserved.
- [ ] Brand-link behavior is tested and documented.
- [ ] A test click appears in `email_tracking_events` with its final destination.
- [ ] A test landing appears in PostHog with welcome campaign properties.
- [ ] The report reconciles the two known Welcome Email 1 journeys.
- [ ] No PII is written to docs or PostHog.
- [ ] `pnpm test -- src/lib/email`
- [ ] `pnpm check`

## Risks and gotchas

- Gmail referrer is not sequence attribution.
- Open pixels are noisy and privacy-proxied. Clicks and comments matter more.
- The template shell may add links after content links are rewritten. Verify the final MIME HTML, not only the content fragment.
- A comment after an old reactivation click is not necessarily caused by that click when a newer welcome email exists.
- The list is finite. Do not optimize for send volume.

## Definition of done

- [ ] Welcome links are attributable by sequence, step, and link.
- [ ] The email-to-comment report is reproducible and privacy-safe.
- [ ] The proven Welcome Email 1 learning is documented.
- [ ] A reactivation closeout decision is ready for DJ.
- [ ] No sequence state was changed without approval.
