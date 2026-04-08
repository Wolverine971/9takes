---
title: 'Experiment A — Capture Email at First Anonymous Contribution'
date: '2026-04-08'
status: 'draft'
owner: 'DJ'
type: 'experiment-spec'
related:
  - docs/planning/retention-instrumentation-plan-2026-04-08.md
path: docs/planning/experiment-a-anonymous-email-capture-2026-04-08.md
---

# Experiment A — Capture Email at First Anonymous Contribution

> **The single most expensive absence in 9takes today is that an anonymous first-commenter has no identity. They contribute, the page unlocks, the tab closes, and the platform has no way to ever pull them back. This experiment fixes that — without breaking the give-first mechanic.**

## Hypothesis

We believe that:

> Adding **one optional email field** to the anonymous-first-comment flow on `/questions/[slug]`, positioned **after** the user has typed their take but **before** they submit, with the copy
>
> > _"Get notified when someone replies with a different take (optional)."_
>
> for **anonymous visitors writing their first ever comment**, will:
>
> 1. Cause **email capture rate** among first-time anonymous contributors to exceed **25%**.
> 2. Cause **D7 return rate** for the captured segment to be at least **2x** the uncaptured segment.
>
> Because the user has _already done the work_ of writing a take and the reply-notification promise is the most value-aligned thing the product can offer them at that exact moment.

## Why this experiment first

Three reasons:

1. **It fixes the loop at its root.** Every other growth experiment is downstream of "do contributors have an identity we can pull back." See `docs/planning/retention-instrumentation-plan-2026-04-08.md` for context.
2. **The cost of failure is bounded.** If capture rate is low, we lose nothing — the field is optional. The only downside is if it causes first-comment conversion to drop, which we explicitly guardrail against.
3. **It is the only experiment that turns a one-shot contribution into a recurring loop.** Notify → reply → re-engage → contribute again. None of that is possible without an identity.

## What changes in the product

### The flow today

1. Anonymous visitor lands on `/questions/[slug]`.
2. They see the locked card: _"Be the first to share your perspective"_ or _"Share your perspective to unlock comments — N perspectives waiting to be revealed."_ (`src/lib/components/questions/QuestionContent.svelte:159-212`)
3. The comment box is auto-shown for first-time answerers (`src/lib/components/molecules/Interact.svelte:78-82`).
4. They type a comment.
5. They click **Submit**.
6. `Interact.svelte:142-178` (`createComment`) collects the form data, calls `?/createCommentRando`, which routes to `src/routes/questions/[slug]/+page.server.ts:189-213`.
7. The action calls `create_comment_atomic` with `author_id = NULL, fingerprint = <fp>`.
8. The page invalidates and the comments unlock.

### The flow under Experiment A

Steps 1–4 are unchanged.

**Step 4.5 (new) — the email pad.**

Once the user has typed at least one character in the textarea AND focus has stayed in the textarea for ≥ 2 seconds (a minimal "they're committed" signal), an inline panel slides in **below** the textarea, **above** the submit button. It contains:

- A small headline: **Get notified when someone replies with a different take.**
- A subline: _Optional. We'll only email you when someone with a different Enneagram type adds a take to this question. Unsubscribe in one click._
- A single email input.
- The submit button label flips from `Submit` to `Submit & notify me` when an email is present, or stays `Submit` when blank.

> **Important UX rule.** The pad does not block submission. The user can submit with the email field empty. The pad is appended _below_ the textarea, not in a modal — no overlay, no extra click, no wall.

**Step 5 — the user submits.**

Three branches:

- **(a) Email present and valid** → `createCommentRando` action receives `email` in addition to `fingerprint`. The action creates the comment AS NORMAL, then atomically writes a `comment_email_capture` row (see schema below). On success the UI shows: _"Got it — we'll only ping you for a fresh take. ✓"_
- **(b) Email blank** → behaves identically to today. No `comment_email_capture` row.
- **(c) Email present but invalid** → inline error on the field, comment is **still created** (we never block contribution on email validity). A separate success toast says _"Your take is in. Email skipped — invalid format."_

**Steps 6–8 are unchanged.**

### What does NOT change

- The give-first wall copy.
- The anonymous-first-comment allowance.
- The rate limit of 5 comments / 60s (`src/routes/questions/[slug]/+page.server.ts:22-24`).
- The short-answer nudge at < 100 chars (`Interact.svelte:44, 150-158`).
- The fingerprint capture / `9tfingerprint` cookie behavior.
- The unlock animation / page invalidation.
- Anything for users who are already registered or already have a fingerprint with prior comments.

## Target segment

| Field                            | Value                                                                                                                                              |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Page**                         | `/questions/[slug]` only.                                                                                                                          |
| **Visitor type**                 | Anonymous (`session?.user?.id` is null).                                                                                                           |
| **First-comment-ever predicate** | `NOT EXISTS (SELECT 1 FROM comments WHERE fingerprint = :fp)` AT request time.                                                                     |
| **Excluded**                     | Logged-in users, demo mode (`demo_time === true`), users who have ever commented before, comment-on-comment replies (`parent_type === 'comment'`). |
| **Rollout cohort split**         | 50/50 by hashed fingerprint. Sticky for the entire experiment window.                                                                              |

> **Why first-comment-ever and not "no email yet."** Because we want to fix activation, not annoy returning anonymous contributors. A regular contributor who skipped the email the first time should not see the pad on every subsequent comment. A future iteration can add a "still want notifications?" upsell, but that is not this experiment.

## Schema changes

> Migration filename: `supabase/migrations/20260408_comment_email_capture.sql`

### `comment_email_capture`

```sql
CREATE TABLE IF NOT EXISTS public.comment_email_capture (
    id BIGSERIAL PRIMARY KEY,
    comment_id BIGINT NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
    fingerprint TEXT NOT NULL,
    email CITEXT NOT NULL,
    question_id BIGINT NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    -- 'experiment_a' so we can run subsequent capture experiments and segment by source
    capture_source TEXT NOT NULL DEFAULT 'experiment_a',
    -- experiment cohort assignment, recorded for stratification: 'control' | 'treatment'
    experiment_cohort TEXT NULL,
    -- email lifecycle
    confirmation_token TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
    confirmed_at TIMESTAMPTZ NULL,
    unsubscribed_at TIMESTAMPTZ NULL,
    last_notification_sent_at TIMESTAMPTZ NULL,
    notification_count INT NOT NULL DEFAULT 0,
    -- audit
    user_agent TEXT NULL,
    ip_address INET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE EXTENSION IF NOT EXISTS citext;

CREATE INDEX IF NOT EXISTS idx_comment_email_capture_email
    ON public.comment_email_capture (email);
CREATE INDEX IF NOT EXISTS idx_comment_email_capture_fingerprint
    ON public.comment_email_capture (fingerprint);
CREATE INDEX IF NOT EXISTS idx_comment_email_capture_question_id
    ON public.comment_email_capture (question_id);
CREATE INDEX IF NOT EXISTS idx_comment_email_capture_created_at
    ON public.comment_email_capture (created_at DESC);

-- Prevent duplicate captures for the same fingerprint+email pair
CREATE UNIQUE INDEX IF NOT EXISTS uniq_comment_email_capture_fp_email
    ON public.comment_email_capture (fingerprint, email);
```

### `experiment_a_assignments`

A small table that records which cohort a fingerprint was assigned to, sticky for the experiment lifetime. Without this, a fingerprint that clears local storage could be reassigned mid-experiment and pollute the results.

```sql
CREATE TABLE IF NOT EXISTS public.experiment_a_assignments (
    fingerprint TEXT PRIMARY KEY,
    cohort TEXT NOT NULL CHECK (cohort IN ('control', 'treatment')),
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Optional: extend `create_comment_atomic`

Two options:

- **(A) Don't touch the RPC.** Insert into `comment_email_capture` from the SvelteKit action _after_ the RPC returns. Pros: no migration risk to the comment hot path. Cons: the two writes aren't transactional — if the email insert fails, the comment still exists.
- **(B) Extend `create_comment_atomic`** with two new optional params (`p_email TEXT, p_capture_source TEXT`) and have it write the capture row inside the same transaction. Pros: atomic. Cons: hot-path migration.

We are picking **(A)**. Reason: the failure mode of a stranded comment without its email row is benign (the user gets their comment posted, the platform just doesn't get a notification subscription — same as if they hadn't entered an email). The failure mode of breaking the comment hot path for everyone is severe. The plan-of-record is non-atomic, with a `console.error` and a quiet retry, not a transaction.

## Code changes

### 1. `Interact.svelte` — the email pad

> File: `src/lib/components/molecules/Interact.svelte`

State additions:

```typescript
let email = $state('');
let emailValid = $state<boolean | null>(null);
let showEmailPad = $state(false);
let typedDwellTimer: ReturnType<typeof setTimeout> | null = null;
let isFirstEverComment = $derived(
	isQuestionPageData(data) && !data?.flags?.userHasAnswered && !user?.id
);
let experimentCohort = $state<'control' | 'treatment' | null>(null);
```

The email pad is mounted when:

- `isFirstEverComment === true`
- `experimentCohort === 'treatment'`
- `comment.length >= 1`
- 2 seconds have passed since the last keystroke (signals commitment, avoids mounting it after a single accidental keystroke)

We do **not** show the pad in any other state.

The submit handler (`createComment`, lines 142–178) is extended to:

1. Validate `email` if non-empty (RFC 5322-loose, just `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
2. Append `email` and `experiment_cohort` to the form body.
3. Submit as today.

### 2. `createCommentRando` action

> File: `src/routes/questions/[slug]/+page.server.ts:189-213`

Extend `createCommentSchema` (`src/lib/validation/questionSchemas.ts:5-17`) to accept two new optional fields:

```typescript
export const createCommentSchema = z.object({
	// ...existing fields...
	email: z.string().email().optional().or(z.literal('')),
	experiment_cohort: z.enum(['control', 'treatment']).optional()
});
```

After the existing `handleCommentCreation` call returns the new comment record, do a non-blocking insert into `comment_email_capture` if `email` is non-empty AND `experiment_cohort === 'treatment'`. Wrap in try/catch, log on failure, **never** throw.

```typescript
const record = await handleCommentCreation(commentData, body.parent_type as string, demo_time);

if (
	!demo_time &&
	record &&
	typeof body.email === 'string' &&
	body.email.length > 0 &&
	body.experiment_cohort === 'treatment'
) {
	try {
		await supabase.from('comment_email_capture').insert({
			comment_id: (record as { id: number }).id,
			fingerprint: body.fingerprint as string,
			email: body.email,
			question_id: parseInt(body.question_id as string, 10),
			capture_source: 'experiment_a',
			experiment_cohort: 'treatment',
			user_agent: request.headers.get('user-agent'),
			ip_address: ip
		});
	} catch (err) {
		console.error('Failed to write comment_email_capture', err);
	}
}
```

### 3. Cohort assignment

A new server-side helper assigns a cohort the first time a fingerprint hits `/questions/[slug]` while anonymous and first-comment-ever. Read-or-create from `experiment_a_assignments`. Hash-based assignment (e.g. `crc32(fingerprint) % 2`) for deterministic, sticky split.

```typescript
// src/lib/server/experimentA.ts (new file)
export async function getExperimentACohort(
	supabase: SupabaseClient,
	fingerprint: string
): Promise<'control' | 'treatment'> {
	const { data: existing } = await supabase
		.from('experiment_a_assignments')
		.select('cohort')
		.eq('fingerprint', fingerprint)
		.maybeSingle();

	if (existing?.cohort === 'control' || existing?.cohort === 'treatment') {
		return existing.cohort;
	}

	const cohort = hashFingerprintToCohort(fingerprint);
	await supabase.from('experiment_a_assignments').insert({ fingerprint, cohort }).select().single();
	return cohort;
}
```

The page server calls this in `load` _only_ when the visitor is anonymous and first-comment-ever, and returns `data.experimentACohort` to the client. `Interact.svelte` reads `data.experimentACohort` at mount.

### 4. Reply notification email + sender

This is the _promise_ the user is responding to. If we capture emails and never send a notification, we lose trust.

- New email template: `src/emails/replyNotificationEmail.ts` — short, plain, brand-consistent.
- New cron job (using existing `pg_cron` infrastructure from `20251204_pg_cron_scheduled_emails.sql`) that runs every 30 minutes:
  - For each `comments` row created in the last 30 minutes whose `parent_id` matches a `question_id` with `comment_email_capture` rows, find capture rows where:
    - `confirmed_at IS NOT NULL` OR `created_at > NOW() - INTERVAL '24 hours'` (give an unconfirmed email a 24-hour grace window so we don't lose the first notification)
    - `unsubscribed_at IS NULL`
    - `last_notification_sent_at IS NULL OR last_notification_sent_at < NOW() - INTERVAL '6 hours'` (rate limit: at most one notification per email per 6 hours per question)
    - The new comment's `fingerprint != capture row's fingerprint` (don't email yourself about your own next comment)
    - **Bonus rule for v1.5 if time permits:** the new comment's enneagram type ≠ the captured user's prior comment type (delivers the "different take" promise literally). Skip in v1, ship in v1.5.
  - Send via existing Resend integration (`src/emails/index.ts`).
  - Update `last_notification_sent_at`, increment `notification_count`.

### 5. Confirmation flow (single-click)

- The first email is **transactional**, sent immediately on capture, with copy: _"Confirm to start receiving reply notifications. One click."_ and a single CTA button linking to `/account/confirm-email-capture/[token]`.
- New route `src/routes/account/confirm-email-capture/[token]/+page.server.ts` flips `confirmed_at` and shows a thank-you page.
- New route `src/routes/account/unsubscribe/comment-email/[token]/+page.server.ts` for one-click unsubscribe (must be one-click, no auth, GDPR-clean). Uses the same `confirmation_token` as the unsubscribe key.

## Instrumentation

This experiment is unreadable without instrumentation. The following events must be persisted (we can either add a thin `experiment_a_events` table or piggy-back on the funnel events from the retention plan once it ships).

| Event                               | When fired                                                                        | Where                                                   |
| ----------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `wall_hit_anonymous_first_time`     | First load of `/questions/[slug]` for an anonymous visitor with no prior comments | Server: `+page.server.ts` `load`                        |
| `comment_box_opened`                | Textarea autoshown or user clicks comment toggle                                  | Client: `Interact.svelte` `$effect`                     |
| `email_pad_shown`                   | Email pad mounts (treatment cohort only)                                          | Client: `Interact.svelte`                               |
| `email_pad_filled`                  | User types ≥1 char into the email field                                           | Client: `Interact.svelte`                               |
| `comment_submitted_anonymous_first` | First comment posted by anonymous fingerprint                                     | Server: `createCommentRando`                            |
| `comment_submitted_with_email`      | Same as above, with non-empty email                                               | Server: `createCommentRando`                            |
| `email_capture_confirmed`           | User clicks confirm link                                                          | Server: `confirm-email-capture` route                   |
| `email_capture_unsubscribed`        | User clicks unsubscribe link                                                      | Server: `unsubscribe` route                             |
| `email_notification_sent`           | Cron sends a reply notification                                                   | Server: cron job                                        |
| `email_notification_clicked`        | Notification link clicked, lands back on `/questions/[slug]`                      | Server: existing `email_tracking_events` infrastructure |

For v1, we can store these in a single `experiment_a_events` table:

```sql
CREATE TABLE IF NOT EXISTS public.experiment_a_events (
    id BIGSERIAL PRIMARY KEY,
    fingerprint TEXT NOT NULL,
    event_name TEXT NOT NULL,
    cohort TEXT NULL,
    question_id BIGINT NULL,
    comment_id BIGINT NULL,
    metadata JSONB NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_experiment_a_events_fingerprint
    ON public.experiment_a_events (fingerprint, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_experiment_a_events_event_name
    ON public.experiment_a_events (event_name, created_at DESC);
```

## Metrics

### Primary metric

**Email capture rate among anonymous first-time contributors (treatment cohort)** =

```
(count of comment_email_capture rows where capture_source = 'experiment_a' AND experiment_cohort = 'treatment' in window)
/
(count of comment_submitted_anonymous_first events where cohort = 'treatment' in window)
```

**Target: > 25%.**

### Secondary metrics

| Metric                                          | Target                                     | Computed from                                                                                                   |
| ----------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| Email confirmation rate                         | > 60% of captures                          | `confirmed_at IS NOT NULL / total captures`                                                                     |
| D7 return rate (captured segment)               | ≥ 2x uncaptured anonymous first-commenters | Cohort retention from retention-instrumentation plan, segmented by `comment_email_capture.fingerprint IN (...)` |
| Notification click-through rate                 | > 15%                                      | `email_notification_clicked / email_notification_sent`                                                          |
| Second-comment rate (captured segment)          | ≥ 3x uncaptured                            | `comments` joined back to `comment_email_capture`                                                               |
| Spam-trap hit rate                              | < 2%                                       | Bounce / complaint rate from Resend                                                                             |
| Average characters typed before email pad shown | Track only                                 | `experiment_a_events.metadata.comment_length`                                                                   |

### Guardrail metrics (hard stops)

| Guardrail                                                | Threshold                                                             | Action if breached                                                              |
| -------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **First-comment conversion rate** (treatment vs control) | Treatment must not be more than **5% relative** below control         | Move email pad after submit instead of before. If still drops, kill experiment. |
| **Comment posting error rate**                           | Must not exceed control by more than 0.5 percentage points            | Investigate; likely the email-capture insert is throwing.                       |
| **Spam complaint rate** (Resend)                         | < 0.1%                                                                | Hard stop on cron, manual review of capture quality.                            |
| **Bounce rate on the question page** (engaged_ms < 10s)  | Treatment must not be more than **3 percentage points** above control | Investigate UI friction.                                                        |

## Statistical sizing

A meaningful read on a 25% capture rate target requires roughly:

- **Baseline:** 0% (no email capture exists today).
- **Minimum detectable effect:** 5 percentage points (i.e., we want to detect anything ≥ 5%).
- **Power:** 80%, **alpha:** 0.05.

Two-proportion test: ~340 anonymous first-commenters per cohort (~680 total) for a 5pp effect. For the 25% target itself, ~100 per cohort is plenty if the effect is real.

For the secondary D7 retention metric, the math is harder because the captured population is a subset of the treatment cohort. Realistically, we need **~300 captured emails** before the D7 comparison reads out at any reasonable confidence. That likely takes 2–4 weeks at current traffic — confirm the actual current weekly anonymous-first-comment volume from `comments WHERE fingerprint NOT IN (prior fingerprints)` once Phase 1 of the retention plan ships.

## Stop criteria

Stop the experiment when **any** of the following is true:

1. **Win:** Treatment first-comment conversion is ≥ control AND capture rate exceeds 30%, with at least 2 weeks of data and ≥ 200 captures. → Ship to 100%.
2. **Loss:** Treatment first-comment conversion drops > 10% relative to control at any point with ≥ 200 first-comments per cohort. → Kill, post-mortem.
3. **Guardrail breach:** Any hard guardrail above is hit. → Kill or pause and adjust.
4. **Spam/abuse:** Resend complaint rate > 0.1% or bounce rate > 5%. → Pause cron, review capture quality.
5. **Time cap:** 4 weeks elapsed without significance on capture rate. → Reassess copy/positioning, then either iterate or kill.

## Rollout plan

### Phase 0 — Prereqs

- [ ] **Retention instrumentation plan Phase 1+2 must ship first.** The experiment cannot be read out without `visitor_first_touch` and `daily_visitor_cohorts`.
- [ ] Resend domain auth confirmed for `replies@9takes.com` (or whichever sender we choose).
- [ ] Email template designed and approved.
- [ ] Confirmation + unsubscribe routes implemented and tested.

### Phase 1 — Schema + capture path (1 day)

- [ ] Migration `20260408_comment_email_capture.sql` (3 tables, indexes).
- [ ] Extend `createCommentSchema`.
- [ ] Extend `createCommentRando` action with non-blocking capture insert.
- [ ] Add `experimentACohort` to `+page.server.ts` `load`.
- [ ] Add cohort assignment helper.
- [ ] Add `experiment_a_events` writes at every event boundary.

### Phase 2 — UI (1 day)

- [ ] Build email pad component inside `Interact.svelte`.
- [ ] Validate email format client-side.
- [ ] Wire to `experimentACohort` from `data`.
- [ ] Submit-button label flip.
- [ ] Success toast + error states.
- [ ] Manual QA on mobile and desktop, both cohorts.

### Phase 3 — Notification cron (1 day)

- [ ] Build reply notification email template.
- [ ] Build cron job (extend existing `pg_cron` schedule pattern).
- [ ] Test end-to-end with two test fingerprints on staging.
- [ ] Build confirmation and unsubscribe routes.

### Phase 4 — 50/50 launch

- [ ] Flip the cohort assignment from "all control" to "50/50."
- [ ] Watch error rate, conversion rate, and capture rate hourly for the first 24 hours.
- [ ] Daily review for the first week.
- [ ] Weekly review thereafter until stop criteria met.

### Phase 5 — Decision

- [ ] At stop criteria, write a one-page result memo: capture rate, conversion delta, retention delta, notes, decision (ship / iterate / kill).
- [ ] If shipped, remove the experiment cohort assignment and treat everyone as treatment. Keep the schema and the cron job.
- [ ] If killed, document the post-mortem in `docs/learnings/` so we don't run the identical experiment again.

## Risks & open questions

1. **The wall is the wall, the email is the email.** If we make the give-first wall feel transactional (give your take _and_ your email), users may bounce harder. The "optional" framing matters, the "after typing" placement matters, the "below textarea" non-blocking placement matters. Iterate on these before killing the experiment if conversion drops.
2. **People hate giving emails on the modern web.** 25% may be ambitious. Even 10% capture would still represent the largest single increase in identified contributors the platform has ever had.
3. **Notification cadence matters.** Send too often → unsubscribe spike. Too seldom → no second touch. The 6-hour rate limit per email per question is a guess; adjust based on Phase 4 data.
4. **GDPR / CASL.** One-click unsubscribe is mandatory. Confirmation email is best practice. Both are in the plan.
5. **Different-take rule.** Promising "a reply with a different take" but sending notifications for _any_ reply degrades trust. v1 ships without the type-diversity rule but documents it. v1.5 adds the rule.
6. **Demo mode.** Explicitly excluded. The capture path is gated on `!demo_time`.
7. **What about users who already commented anonymously before this ships?** Excluded by the first-comment-ever predicate. They will never see the pad. A follow-up experiment can target them with a banner instead.
8. **What about users who register?** Excluded — we already have their email via the registration flow.
9. **Concurrency.** The `comment_email_capture` insert is non-atomic with the comment insert. In the failure case, the comment exists without an email row. Acceptable per the architecture decision above.
10. **Bot abuse.** Spam bots could submit empty fingerprints with garbage emails. Existing rate limits (5/60s) plus the `is_first_ever_comment` predicate plus the unique `(fingerprint, email)` index plus Resend bounce filtering should be enough for v1. Add a honeypot field if abuse appears.

## Success criteria for "Experiment A is done"

- [ ] Capture rate measured and stable.
- [ ] Conversion rate measured and within guardrail.
- [ ] D7 return rate compared between captured and uncaptured segments.
- [ ] At least one notification email delivered, opened, and clicked through to a return visit.
- [ ] A go/no-go decision is made and documented.
- [ ] If go: experiment cohort assignment removed, all anonymous first-commenters see the pad.

## Out of scope (intentionally)

- Capturing email at any other moment (homepage, blog, post-unlock, etc.). Each is its own experiment.
- Capturing email from logged-in users (they have one).
- Persuading users to register a full account at this moment. The pad is **only** for notification opt-in. Account creation is a separate, later upsell.
- Push notifications, browser notifications, or any other channel.
- The "different take" enneagram-type matching rule (v1.5).
- Re-engagement of the existing anonymous-comment population (separate experiment).

## Appendix: copy variants to test if v1 underperforms

Save these for v1.1 if capture rate < 10%.

| Variant     | Headline                                                 | Subline                                                                                                                             |
| ----------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| A (default) | Get notified when someone replies with a different take. | Optional. We'll only email you when someone with a different Enneagram type adds a take to this question. Unsubscribe in one click. |
| B           | Want to see how other types reply?                       | Drop your email and we'll ping you when a fresh perspective lands on this question.                                                 |
| C           | This question will get more takes.                       | Get notified when it does. Optional.                                                                                                |
| D           | One email when this thread heats up.                     | We'll only ping you once when someone meaningfully different jumps in.                                                              |
| E           | See the rest of the 9.                                   | Drop your email — we'll let you know when more types weigh in.                                                                      |

Run as a multivariate follow-up only after the base mechanic is proven.
