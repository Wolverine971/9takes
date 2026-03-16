<!-- docs/development/welcome-email-sequence-spec.md -->

# Welcome Email Sequence — Implementation Spec

_Implementation plan for the Gmail-based post-registration welcome sequence._

**Status:** Working v1 spec  
**Date:** 2026-03-16  
**Companion doc:** `docs/marketing/WELCOME_SEQUENCE_STRATEGY.md`

---

## Locked Decisions

- This sequence is for **successful 9takes account registrations**, not legacy waitlist signups.
- Trigger it from `src/routes/register/+page.server.ts` immediately after a successful `auth.signUp()`.
- Use the **existing Gmail sender + tracking + suppression** stack already in production.
- Launch with **4 emails over 10 days**.
- Exit the sequence on:
  - first successful question creation
  - first successful answer on a question
  - first successful reply comment
  - unsubscribe
  - manual admin exit/pause
- Historical waitlist membership does **not** suppress this sequence. If someone registers, they qualify for welcome.
- v1 does **not** include branching, A/B tests, timezone send windows, or a public enrollment API.

---

## Current System Reality

| Capability             | Location                                                                                            | Notes                                                    |
| ---------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Gmail sender           | `src/lib/email/sender.ts`                                                                           | Working; supports tracked sends and unsubscribe headers  |
| Suppression checks     | `src/lib/email/suppression.ts`                                                                      | Working; re-checks unsubscribes at send time             |
| Scheduled cron pattern | `src/routes/api/cron/send-scheduled-emails/+server.ts`                                              | Good reference for auth, batching, and processing states |
| Registration trigger   | `src/routes/register/+page.server.ts`                                                               | Real signup server action                                |
| Question creation      | `src/routes/questions/create/+page.server.ts`                                                       | Real first-question hook point                           |
| Comment creation       | `src/routes/questions/[slug]/+page.server.ts`                                                       | Real first-comment hook point                            |
| Unsubscribe endpoint   | `src/routes/api/track/unsubscribe/[tracking_id]/+server.ts`                                         | Real unsubscribe hook point                              |
| Admin email dashboard  | `src/routes/admin/email-dashboard/+page.server.ts`, `src/routes/admin/email-dashboard/+page.svelte` | Existing email UI that can gain a Sequences tab later    |

Important reality checks:

- There is **no** `src/routes/signup/+page.server.ts` to wire today.
- The current sender expects `recipient.source` and `recipient.source_id`, so sequence sends must map cleanly into the existing `email_sends` schema.
- The current scheduled-email cron path marks rows as `processing` before send. The sequence processor needs the same concurrency protection.

---

## Scope

### What v1 must do

1. Enroll a newly registered user into `welcome_sequence`.
2. Send the next due welcome email through the existing Gmail pipeline.
3. Track sends in `email_sends`.
4. Stop the sequence when the user engages or unsubscribes.
5. Be safe under overlapping cron runs.

### What v1 does not need

- Waitlist re-engagement migration
- Conditional branching
- Dynamic celebrity selection
- Timezone-aware delivery windows
- Public sequence enrollment endpoints
- Full admin authoring UI before launch

---

## Database Design

### `email_sequences`

One row per sequence definition.

```sql
CREATE TABLE email_sequences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,                 -- "welcome_sequence"
    display_name TEXT NOT NULL,               -- "Registered User Welcome Sequence"
    description TEXT,
    trigger_type TEXT NOT NULL CHECK (
        trigger_type IN ('user_registration', 'manual')
    ),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (
        status IN ('draft', 'active', 'paused')
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### `email_sequence_steps`

Step timing is stored as **delay from the previous step**, not absolute day number.

```sql
CREATE TABLE email_sequence_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sequence_id UUID NOT NULL REFERENCES email_sequences(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    delay_days_after_previous INT NOT NULL DEFAULT 0,
    subject TEXT NOT NULL,
    html_content TEXT NOT NULL,
    plain_text TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (sequence_id, step_number)
);
```

### `email_sequence_enrollments`

Tracks a user inside a sequence and is shaped to work with the existing email sender.

```sql
CREATE TABLE email_sequence_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sequence_id UUID NOT NULL REFERENCES email_sequences(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    recipient_email TEXT NOT NULL,
    recipient_source TEXT NOT NULL CHECK (
        recipient_source IN ('profiles', 'signups', 'coaching_waitlist')
    ),
    recipient_source_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (
        status IN ('active', 'processing', 'paused', 'completed', 'exited', 'errored')
    ),
    current_step_number INT NOT NULL DEFAULT 0,
    next_step_number INT,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    next_send_at TIMESTAMPTZ,
    last_sent_at TIMESTAMPTZ,
    last_email_send_id UUID REFERENCES email_sends(id) ON DELETE SET NULL,
    processing_started_at TIMESTAMPTZ,
    failure_count INT NOT NULL DEFAULT 0,
    exit_reason TEXT,
    last_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (sequence_id, user_id)
);

CREATE INDEX idx_email_sequence_enrollments_due
    ON email_sequence_enrollments (next_send_at)
    WHERE status = 'active' AND next_send_at IS NOT NULL;
```

Why this shape:

- `user_id` is the true dedupe key for registered-user welcome.
- `recipient_email`, `recipient_source`, and `recipient_source_id` let us call `sendEmailWithTracking()` without inventing a new sender path.
- `processing_started_at` and `failure_count` support safe claims and retries.

---

## RPC / SQL Helpers

These helpers should be created as `SECURITY DEFINER` functions so they can be called from existing server-side Supabase clients without creating RLS dead ends.

### `enroll_user_in_sequence`

Purpose:

- Find an active sequence by key
- Deduplicate on `(sequence_id, user_id)`
- Insert the enrollment with `next_step_number = 1`
- Set `next_send_at = now()` so step 1 is immediately eligible

Signature:

```sql
enroll_user_in_sequence(
    p_user_id UUID,
    p_email TEXT,
    p_sequence_key TEXT,
    p_recipient_source TEXT DEFAULT 'profiles',
    p_recipient_source_id TEXT DEFAULT NULL
) RETURNS UUID
```

Behavior notes:

- `p_recipient_source_id` should default to `p_user_id::TEXT` when omitted.
- Return the existing enrollment id if the user is already enrolled.
- Do not enroll into paused or draft sequences.

### `claim_pending_sequence_sends`

Purpose:

- Atomically claim due enrollments
- Prevent double-send during overlapping cron runs
- Return all data needed to render and send the next step

Signature:

```sql
claim_pending_sequence_sends(p_limit INT DEFAULT 10)
RETURNS TABLE (
    enrollment_id UUID,
    sequence_key TEXT,
    user_id UUID,
    recipient_email TEXT,
    recipient_source TEXT,
    recipient_source_id TEXT,
    recipient_name TEXT,
    enneagram TEXT,
    step_number INT,
    subject TEXT,
    html_content TEXT,
    plain_text TEXT
)
```

Implementation requirements:

- Use `FOR UPDATE SKIP LOCKED`
- Update claimed rows to `status = 'processing'`
- Stamp `processing_started_at = now()`
- Join `profiles` so the processor receives `first_name`/name fallback data and `enneagram`

### `complete_sequence_send`

Purpose:

- Mark the current step as sent
- Advance to the next step or complete the enrollment

Signature:

```sql
complete_sequence_send(
    p_enrollment_id UUID,
    p_email_send_id UUID DEFAULT NULL
) RETURNS VOID
```

Behavior:

- Set `current_step_number = next_step_number`
- Store `last_sent_at` and `last_email_send_id`
- If another step exists:
  - set `next_step_number` to that step
  - set `next_send_at = now() + delay_days_after_previous`
  - set `status = 'active'`
- If no later step exists:
  - set `status = 'completed'`
  - set `exit_reason = 'completed'`
  - null out `next_step_number` and `next_send_at`

### `retry_or_fail_sequence_send`

Purpose:

- Recover safely from send failures

Signature:

```sql
retry_or_fail_sequence_send(
    p_enrollment_id UUID,
    p_error TEXT
) RETURNS VOID
```

Behavior:

- Increment `failure_count`
- Save `last_error`
- If `failure_count < 3`:
  - set `status = 'active'`
  - set `next_send_at = now() + interval '30 minutes'`
- Else:
  - set `status = 'errored'`
  - clear `next_send_at`

### `exit_user_from_sequence`

Purpose:

- Exit a specific sequence for a user after first engagement

Signature:

```sql
exit_user_from_sequence(
    p_user_id UUID,
    p_sequence_key TEXT,
    p_reason TEXT
) RETURNS INT
```

This must exit only the named sequence, not every active sequence for the user.

### `exit_email_from_sequence`

Purpose:

- Exit a specific sequence by normalized email after unsubscribe

Signature:

```sql
exit_email_from_sequence(
    p_email TEXT,
    p_sequence_key TEXT,
    p_reason TEXT
) RETURNS INT
```

---

## Processor Endpoint

### Route

`GET|POST /api/cron/process-sequences`

Keep it compatible with both Vercel Cron and pg_cron, following the existing pattern in `src/routes/api/cron/send-scheduled-emails/+server.ts`.

### Auth

Same auth pattern as the existing cron route:

```text
Authorization: Bearer {PRIVATE_CRON_SECRET}
```

### Flow

1. Verify `PRIVATE_CRON_SECRET`.
2. Call `claim_pending_sequence_sends(10)`.
3. For each claimed enrollment:
   - Check suppression with `getSuppressedEmailSet()`.
   - If suppressed:
     - call `exit_email_from_sequence(..., 'welcome_sequence', 'unsubscribed')`
     - continue
   - Render tokens into subject/html/plain text.
   - Send via `sendEmailWithTracking()` with:
     - `source: recipient_source`
     - `source_id: recipient_source_id`
     - `includeFooter: true`
     - `sentBy: 'system-sequence'`
   - On success:
     - call `complete_sequence_send(enrollment_id, emailSend.id)`
   - On failure:
     - call `retry_or_fail_sequence_send(enrollment_id, error)`
4. Return summary counts.

### Personalization / Rendering

Create a shared helper, for example `src/lib/email/sequences.ts`, that:

- replaces tokens
- centralizes sequence keys
- maps claimed rows into the existing sender contract

Recommended v1 tokens:

- `{{first_name}}` -> `profiles.first_name`, then `username`, then `"there"`
- `{{email}}` -> recipient email
- `{{questions_url}}` -> `https://9takes.com/questions`
- `{{ask_question_url}}` -> `https://9takes.com/questions/create`

`{{enneagram}}` can exist as an optional token, but v1 content should not depend on it.

---

## Trigger Integration

### 1. Registration

**File:** `src/routes/register/+page.server.ts`

Current code only captures `error` from `auth.signUp()`. Update it to keep `data` as well:

```ts
const { data: signUpData, error: err } = await locals.supabase.auth.signUp({
	email,
	password,
	options: {
		emailRedirectTo: 'https://9takes.com/login'
	}
});
```

After a successful signup:

```ts
const newUserId = signUpData.user?.id;

if (newUserId) {
	await locals.supabase.rpc('enroll_user_in_sequence', {
		p_user_id: newUserId,
		p_email: email,
		p_sequence_key: 'welcome_sequence',
		p_recipient_source: 'profiles',
		p_recipient_source_id: newUserId
	});
}
```

Rules:

- Enrollment must be **best-effort**. If the RPC fails, log it, but do not fail registration.
- No waitlist lookup or exclusion logic in v1. Registration is the trigger.

### 2. Exit on First Question

**File:** `src/routes/questions/create/+page.server.ts`

After a successful question insert, best-effort exit:

```ts
await locals.supabase.rpc('exit_user_from_sequence', {
	p_user_id: author_id,
	p_sequence_key: 'welcome_sequence',
	p_reason: 'created_question'
});
```

### 3. Exit on First Comment

**File:** `src/routes/questions/[slug]/+page.server.ts`

Update the `createComment` action signature to include `locals`. After `handleCommentCreation(...)` succeeds in the real `createComment` action, best-effort exit:

```ts
const record = await handleCommentCreation(commentData, body.parent_type as string, demo_time);

const exitReason =
	commentData.parent_type === 'question' ? 'answered_question' : 'created_comment';

await locals.supabase.rpc('exit_user_from_sequence', {
	p_user_id: commentData.author_id,
	p_sequence_key: 'welcome_sequence',
	p_reason: exitReason
});

return record;
```

This should not run for demo-only comment flows.

### 4. Exit on Unsubscribe

**File:** `src/routes/api/track/unsubscribe/[tracking_id]/+server.ts`

After `track_email_unsubscribe` succeeds and returns `recipientEmail`, best-effort exit:

```ts
await supabase.rpc('exit_email_from_sequence', {
	p_email: recipientEmail,
	p_sequence_key: 'welcome_sequence',
	p_reason: 'unsubscribed'
});
```

---

## Welcome Sequence v1 Content Map

Strategy doc is the source of the message drafts. The step timing below is the implementation truth.

| Step | Absolute Day | Stored Delay | Subject                                                     | Goal                                      |
| ---- | ------------ | ------------ | ----------------------------------------------------------- | ----------------------------------------- |
| 1    | Day 0        | `0`          | Welcome to 9takes — your authentic perspective matters      | Explain give-first and drive first browse |
| 2    | Day 2        | `2`          | She's not "acting cold" — here's what Type 5s actually need | Demonstrate pattern-recognition value     |
| 3    | Day 5        | `3`          | Your perspective is missing from this conversation          | Ask for first question or comment         |
| 4    | Day 10       | `5`          | How's your 9takes experience going?                         | Re-engage, invite reply, or cleanly exit  |

Note on timing:

- The strategy doc talks in **absolute days since signup**.
- The database stores **delay from the previous step**.
- That means the seed data for v1 is `0, 2, 3, 5`, not `0, 2, 5, 10`.

---

## Rollout Order

### Phase 1: Launch the welcome engine

1. Add migration for sequences tables + functions.
2. Seed `welcome_sequence` and its 4 steps.
3. Add `src/lib/email/sequences.ts` helper.
4. Add `src/routes/api/cron/process-sequences/+server.ts`.
5. Wire registration enrollment in `src/routes/register/+page.server.ts`.
6. Wire exit hooks in:
   - `src/routes/questions/create/+page.server.ts`
   - `src/routes/questions/[slug]/+page.server.ts`
   - `src/routes/api/track/unsubscribe/[tracking_id]/+server.ts`
7. Add tests for enrollment, claim locking, progression, unsubscribe exit, and engagement exit.

### Phase 2: Turn it on

Recommended launch path:

- Use **Vercel Cron** first.
- Keep the endpoint GET/POST compatible so pg_cron can be enabled later without changing the handler.

Suggested schedule:

```json
{
	"crons": [
		{
			"path": "/api/cron/process-sequences",
			"schedule": "*/15 * * * *"
		}
	]
}
```

### Phase 3: Admin visibility

After launch data exists, add a **Sequences** tab to `/admin/email-dashboard` with:

- sequence list
- active/completed/exited counts
- recent enrollment activity
- pause/resume
- enrollment detail view

Do not block launch on the full authoring UI.

---

## File Changes

### New files for v1

| File                                                      | Purpose                                                        |
| --------------------------------------------------------- | -------------------------------------------------------------- |
| `supabase/migrations/YYYYMMDD_welcome_email_sequence.sql` | Sequences tables, functions, and seed data                     |
| `src/lib/email/sequences.ts`                              | Shared sequence constants, token rendering, and sender mapping |
| `src/routes/api/cron/process-sequences/+server.ts`        | Cron processor                                                 |

### Modified files for v1

| File                                                        | Change                                            |
| ----------------------------------------------------------- | ------------------------------------------------- |
| `src/routes/register/+page.server.ts`                       | Enroll successful signups into `welcome_sequence` |
| `src/routes/questions/create/+page.server.ts`               | Exit welcome sequence on first question           |
| `src/routes/questions/[slug]/+page.server.ts`               | Exit welcome sequence on first answer/comment     |
| `src/routes/api/track/unsubscribe/[tracking_id]/+server.ts` | Exit welcome sequence on unsubscribe              |

### Deferred admin files

| File                                               | Purpose                        |
| -------------------------------------------------- | ------------------------------ |
| `src/routes/admin/email-dashboard/+page.server.ts` | Load sequence summary data     |
| `src/routes/admin/email-dashboard/+page.svelte`    | Add Sequences tab              |
| `src/routes/api/admin/sequences/*`                 | Admin sequence management APIs |

---

## Testing Checklist

- A new registration creates exactly one enrollment for `welcome_sequence`.
- Running two cron requests at the same time does not double-send step 1.
- A suppressed email is exited before send.
- A successful step send creates an `email_sends` row and advances the enrollment correctly.
- A failed send retries, then errors out after the retry threshold.
- Creating the first question exits only `welcome_sequence`.
- Answering a question exits only `welcome_sequence` with `exit_reason = 'answered_question'`.
- Creating a reply comment exits only `welcome_sequence` with `exit_reason = 'created_comment'`.
- Unsubscribe exits the enrollment and blocks future sends.

---

## Related Documents

- [Welcome Sequence Strategy](/Users/djwayne/9takes/docs/marketing/WELCOME_SEQUENCE_STRATEGY.md)
- [Email Management System Spec](/Users/djwayne/9takes/docs/development/email-management-system-spec.md)
- [Email Sequence Health Audit](/Users/djwayne/9takes/docs/development/email-sequence-health-audit-2026-03-04.md)
- [Waitlist Re-engagement Sequence](/Users/djwayne/9takes/docs/marketing/email-sequence-value-prop.md)
