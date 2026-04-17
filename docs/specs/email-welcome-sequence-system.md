<!-- docs/specs/email-welcome-sequence-system.md -->

# Welcome Email Sequence System — Replication Spec

A production-grade, queue-driven welcome email sequence built on Supabase + SvelteKit + Gmail API. This spec documents the full system as it runs in 9takes so it can be replicated on another project.

**Why it's worth replicating:** most "welcome sequence" implementations are cron loops that pick rows by `sent = false`. That design races under concurrency, silently duplicates sends on retries, and has no graceful way to edit copy without a redeploy. The 9takes system solves all three with a `claim → process → complete` RPC pattern, a code-overrides-DB content hatch, a per-enrollment exit reason, and end-to-end open/click/unsubscribe tracking.

---

## 1. TL;DR — what this system does

- **Enrolls** every registered user in a multi-step email sequence at signup.
- **Queues** each step with a `next_send_at` timestamp (step N+1 fires N days after step N).
- **Processes** due enrollments every 15 minutes via a Vercel cron that hits a Supabase RPC which atomically claims rows (`FOR UPDATE SKIP LOCKED`), so two cron runs can't double-send.
- **Exits** enrollments the moment a user takes a completion action (asks a question, answers one, comments) so the sequence stops nagging.
- **Tracks** every send in `email_sends` with opens (pixel), clicks (rewritten links), unsubscribes, and bounces.
- **Suppresses** emails on the suppression list at send time, not at enrollment time.
- **Edits** copy two ways: (a) DB row edit via admin UI, (b) code-managed override (`welcome-sequence-content.ts`) that wins over the DB row. The code override is the production pattern — the DB seed exists for disaster recovery.
- **Previews** every step with real token rendering in the admin UI, and sends test emails to any address.

---

## 2. System architecture

```
┌─────────────────┐    signup     ┌────────────────────────┐
│  /register      │──────────────▶│ enroll_user_in_sequence│ RPC (Postgres)
│  +page.server   │               └──────────────┬─────────┘
└─────────────────┘                              │ inserts row
                                                 ▼
                           ┌──────────────────────────────────────┐
                           │ email_sequence_enrollments           │
                           │  status=active, next_send_at=NOW()   │
                           └──────────────────┬───────────────────┘
                                              │
      ┌───────── every 15 min ────────────────┴─────────────────────┐
      │                                                              │
      ▼                                                              │
┌──────────────────────────┐                                         │
│ /api/cron/process-seqs   │ Vercel cron                             │
│   CRON_SECRET guarded    │                                         │
└──────────┬───────────────┘                                         │
           │                                                         │
           ▼                                                         │
┌──────────────────────────┐   FOR UPDATE SKIP LOCKED               │
│ claim_pending_sequence_  │◀──────────────────────────┐            │
│   sends(limit=10)        │  atomically flips rows    │            │
└──────────┬───────────────┘  to status='processing'   │            │
           │                                                         │
           ▼                                                         │
┌──────────────────────────┐                                         │
│ suppression check        │─ if suppressed ─▶ exit_email_from_seq   │
│ (email_unsubscribes,     │                                         │
│  signups.unsubscribed)   │                                         │
└──────────┬───────────────┘                                         │
           │ not suppressed                                          │
           ▼                                                         │
┌──────────────────────────┐                                         │
│ prepareSequenceSend      │ token replace, code override wins       │
└──────────┬───────────────┘                                         │
           │                                                         │
           ▼                                                         │
┌──────────────────────────┐                                         │
│ sendEmailWithTracking    │ Gmail API + tracking pixel + click      │
│   → email_sends row      │ rewrites + unsubscribe header           │
└──────────┬───────────────┘                                         │
           │                                                         │
           ├── success ─▶ complete_sequence_send ──▶ set next_send_at┘
           │                                         to step N+1 date
           │
           └── failure ─▶ retry_or_fail_sequence_send
                           (3 attempts, 30 min backoff)
```

User-action exit hooks run independently of the cron:

```
/questions/create  ──▶ safelyExitWelcomeSequenceForQuestionCreation
/questions/[slug]  ──▶ safelyExitWelcomeSequenceForCommentCreation
                        (sets status='exited', exit_reason='...')
```

---

## 3. Data models

All three tables plus the shared `email_sends` table. RLS is on; only admins can read/write via authenticated client. The cron uses the service-role client which bypasses RLS.

### 3.1 `email_sequences`

A sequence is a named container (e.g. `welcome_sequence`, `paid_user_onboarding`, `reengagement`).

| column         | type        | notes                                                                                     |
| -------------- | ----------- | ----------------------------------------------------------------------------------------- |
| `id`           | UUID PK     |                                                                                           |
| `key`          | TEXT UNIQUE | Stable identifier used in code (`WELCOME_SEQUENCE_KEY`).                                  |
| `display_name` | TEXT        | Admin UI label.                                                                           |
| `description`  | TEXT        |                                                                                           |
| `trigger_type` | TEXT CHECK  | `'user_registration' \| 'manual'`. Future triggers (e.g. `'purchase'`) would extend this. |
| `status`       | TEXT CHECK  | `'draft' \| 'active' \| 'paused'`. Only `active` is eligible for enrollment + sending.    |
| timestamps     |             |                                                                                           |

See `supabase/migrations/20260316_welcome_email_sequence.sql` lines 5–14.

### 3.2 `email_sequence_steps`

Ordered steps belonging to a sequence.

| column                                  | type    | notes                                              |
| --------------------------------------- | ------- | -------------------------------------------------- |
| `sequence_id`                           | UUID FK | `ON DELETE CASCADE`.                               |
| `step_number`                           | INT     | Unique per sequence.                               |
| `delay_days_after_previous`             | INT     | 0 for the first step (send immediately).           |
| `subject`, `html_content`, `plain_text` | TEXT    | DB-seeded content. Code override can win (see §5). |
| `UNIQUE (sequence_id, step_number)`     |         |                                                    |

See migration lines 16–27.

### 3.3 `email_sequence_enrollments`

The actual queue. One row per (sequence, user). This is the source of truth for who gets what, when.

| column                          | type        | notes                                                                                                                                               |
| ------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sequence_id`                   | UUID FK     |                                                                                                                                                     |
| `user_id`                       | UUID        |                                                                                                                                                     |
| `recipient_email`               | TEXT        | Snapshotted at enrollment.                                                                                                                          |
| `recipient_source`              | TEXT CHECK  | Polymorphic: `'profiles' \| 'signups' \| 'coaching_waitlist'`. Lets the same sequence infra serve newsletter signups and consulting waitlist leads. |
| `recipient_source_id`           | TEXT        |                                                                                                                                                     |
| `status`                        | TEXT CHECK  | `'active' \| 'processing' \| 'paused' \| 'completed' \| 'exited' \| 'errored'`.                                                                     |
| `current_step_number`           | INT         | Last _successfully sent_ step.                                                                                                                      |
| `next_step_number`              | INT         | Step that will be attempted next. `NULL` when completed.                                                                                            |
| `next_send_at`                  | TIMESTAMPTZ | The queue key. Indexed.                                                                                                                             |
| `last_sent_at`                  | TIMESTAMPTZ |                                                                                                                                                     |
| `last_email_send_id`            | UUID FK     | → `email_sends.id`, ties the enrollment to the tracked delivery.                                                                                    |
| `processing_started_at`         | TIMESTAMPTZ | When a cron run claimed the row. Reaped after 2 hours.                                                                                              |
| `failure_count`                 | INT         | Resets on success.                                                                                                                                  |
| `exit_reason`                   | TEXT        | e.g. `'created_question'`, `'unsubscribed'`, `'completed'`, `'manual'`.                                                                             |
| `last_error`                    | TEXT        | Last 1000 chars of the failure message.                                                                                                             |
| `UNIQUE (sequence_id, user_id)` |             | Prevents double-enrollment.                                                                                                                         |

Critical index (migration lines 56–58):

```sql
CREATE INDEX idx_email_sequence_enrollments_due
  ON email_sequence_enrollments(next_send_at)
  WHERE status = 'active' AND next_send_at IS NOT NULL;
```

This partial index is what makes the claim RPC fast — it only indexes rows that could possibly be due.

### 3.4 `email_sends` (shared with the broadcast email system)

Every send — sequence or broadcast — writes one row here. This is where all the tracking lives.

| column                                                                         | notes                                                            |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `campaign_id`                                                                  | Nullable. Sequence sends leave this null.                        |
| `recipient_email`, `recipient_name`, `recipient_source`, `recipient_source_id` | Polymorphic recipient ref.                                       |
| `subject`, `html_content`, `plain_text_content`                                | Snapshot at send time.                                           |
| `tracking_id`                                                                  | UUID, unique. Embedded in pixel + click URLs + unsubscribe link. |
| `status`                                                                       | `'pending' \| 'sent' \| 'delivered' \| 'bounced' \| 'failed'`.   |
| `opened_at`, `open_count`                                                      | Pixel hit.                                                       |
| `clicked_at`, `click_count`                                                    | Any rewritten link.                                              |
| `unsubscribed_at`                                                              | Unsubscribe endpoint hit.                                        |
| `bounced_at`, `bounce_reason`                                                  | Populated on Gmail API failure.                                  |
| `sent_at`, `sent_by`                                                           |                                                                  |
| `error_message`, `retry_count`                                                 |                                                                  |

See `supabase/migrations/20251202_email_management_system.sql`.

---

## 4. Postgres RPC functions (the important ones)

All in `supabase/migrations/20260316_welcome_email_sequence.sql`.

| RPC                                                                                                      | Purpose                                                                                                                                                         | Safety                                                                                                                               |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `enroll_user_in_sequence(p_user_id, p_email, p_sequence_key, p_recipient_source, p_recipient_source_id)` | Insert an enrollment row if one doesn't exist. Idempotent — returns existing enrollment id if called twice.                                                     | `SECURITY DEFINER`, validates sequence is `active`.                                                                                  |
| `claim_pending_sequence_sends(p_limit)`                                                                  | Atomically flip up to N due rows from `active` → `processing` and return them with step content + recipient profile data (first name, enneagram) joined in.     | Uses `FOR UPDATE SKIP LOCKED` so parallel cron runs can't claim the same row. Also reaps stuck `processing` rows older than 2 hours. |
| `claim_specific_sequence_send(p_enrollment_id)`                                                          | Same claim semantics but for one row. Used by the "send step 1 immediately at signup" flow.                                                                     | See `supabase/migrations/20260406_claim_specific_sequence_send.sql`.                                                                 |
| `complete_sequence_send(p_enrollment_id, p_email_send_id)`                                               | After a successful send, advance to the next step — or mark `completed` if this was the last step. Computes `next_send_at = NOW() + delay_days_after_previous`. | Only transitions rows in `processing`.                                                                                               |
| `retry_or_fail_sequence_send(p_enrollment_id, p_error)`                                                  | Increment `failure_count`. <3 failures → requeue `next_send_at = NOW() + 30min`. ≥3 → `errored`.                                                                |                                                                                                                                      |
| `exit_user_from_sequence(p_user_id, p_sequence_key, p_reason)`                                           | Mark all active/processing/paused enrollments as `exited` for a user.                                                                                           |                                                                                                                                      |
| `exit_email_from_sequence(p_email, p_sequence_key, p_reason)`                                            | Same but keyed by email (used by suppression). Normalizes email first.                                                                                          |                                                                                                                                      |

**The `FOR UPDATE SKIP LOCKED` pattern** (migration lines 207–217) is the piece most DIY sequence systems get wrong. It lets you run the cron every 15 minutes with `limit=10` and even run two instances simultaneously without risking duplicate sends.

---

## 5. Content management — the DB + code override pattern

This is one of the best design decisions in the system and worth preserving.

**Problem:** You want content to be editable by admins without a deploy (argues for DB), but you also want it in source control with code review, tests, and grep-ability (argues for code files).

**Solution:** Both. DB rows exist as a fallback (seeded by migration, editable via admin UI). Code in `src/lib/email/welcome-sequence-content.ts` defines a `WELCOME_SEQUENCE_CONTENT` array. At send time, `prepareSequenceSend()` calls `getManagedSequenceContent(sequenceKey, stepNumber)` — if a code entry exists, **it wins**. The DB row is only used if the code array has no entry for that step.

```typescript
// src/lib/email/sequences.ts:66
export function prepareSequenceSend(row: SequenceSendRow) {
  const managedContent = getManagedSequenceContent(row.sequence_key, row.step_number);
  // ...
  const subjectTemplate = managedContent?.subject ?? row.subject;
  const htmlTemplate = managedContent?.htmlContent ?? row.html_content;
  const plainTextTemplate = getPlainTextTemplate(managedContent, row.plain_text);
```

**Why this design is good:**

- Production copy is version-controlled and reviewable in PRs.
- You still get a disaster-recovery seed if the code file is lost.
- Admin UI can edit DB rows for experimentation, and you can flip to code-managed later by copying the row into the TS file.
- Each step in the admin preview is tagged "Copy managed in code" when `getManagedSequenceContent` returns a hit — so admins know not to edit the DB row.

**Files:**

- Code content: [`src/lib/email/welcome-sequence-content.ts`](../../src/lib/email/welcome-sequence-content.ts) — exports `WELCOME_SEQUENCE_CONTENT`, `WELCOME_SEQUENCE_KEY`, `getManagedSequenceContent`.
- DB seed + schema: [`supabase/migrations/20260316_welcome_email_sequence.sql`](../../supabase/migrations/20260316_welcome_email_sequence.sql).

### 5.1 Token replacement

Render pipeline is in [`src/lib/email/sequences.ts`](../../src/lib/email/sequences.ts). Pattern: `{{token_name}}` (spaces allowed, case-insensitive).

Tokens provided automatically:

- `{{first_name}}` — profile first_name, falls back to username, then `'there'`.
- `{{email}}` — recipient email.
- `{{questions_url}}` — hardcoded `https://9takes.com/questions`.
- `{{ask_question_url}}` — hardcoded `https://9takes.com/questions/create`.
- `{{enneagram}}` — profile enneagram type, empty string if unknown.

HTML values are **HTML-escaped** on injection. Plain-text values are not. Unknown tokens are left as-is (not stripped) so you can spot them in QA.

To add a new token: extend the `tokens` object in `prepareSequenceSend` (sequences.ts:71). For dynamic values (per-user), extend `claim_pending_sequence_sends`'s `RETURNS TABLE` and JOIN in the data; then add a field to `SequenceSendRow` and pass it through.

---

## 6. Enrollment and exit triggers

### 6.1 Enrollment

Only happens at registration, inside the register `+page.server.ts` action:

```typescript
// src/routes/register/+page.server.ts:153
const enrollmentId = await safelyEnrollUserInWelcomeSequence({
  userId: newUserId,
  email: normalizedEmail,
  onError: (e) => logger.error('Failed to enroll...', e, {...})
});
await safelyProcessWelcomeSequenceEnrollmentNow({ enrollmentId, ... });
```

Two-step pattern:

1. `safelyEnrollUserInWelcomeSequence` — creates the DB row with `next_send_at = NOW()`.
2. `safelyProcessWelcomeSequenceEnrollmentNow` — synchronously sends step 1 _before_ the HTTP response returns, so the user sees a welcome email in their inbox within seconds instead of waiting up to 15 minutes for the cron.

Both wrappers swallow errors and log them. A failed welcome email never blocks registration. This is critical — your auth flow must not be coupled to your email provider's uptime.

File: [`src/lib/server/welcomeSequenceGuards.ts`](../../src/lib/server/welcomeSequenceGuards.ts).

### 6.2 Exit

Exits are the _entire point_ of this sequence design. The welcome sequence tries to get the user to take an action; once they do, nagging stops.

| Call site                                                                 | Exit reason         |
| ------------------------------------------------------------------------- | ------------------- |
| `src/routes/questions/create/+page.server.ts:245`                         | `created_question`  |
| `src/routes/questions/[slug]/+page.server.ts:177` (comment on a question) | `answered_question` |
| `src/routes/questions/[slug]/+page.server.ts:177` (comment on a comment)  | `created_comment`   |
| Unsubscribe endpoint (via suppression check inside cron)                  | `unsubscribed`      |
| Cron completes final step                                                 | `completed`         |

The `getWelcomeSequenceExitReasonForComment(parentType)` helper picks the right reason based on what the user commented on (question vs. nested comment). See `welcomeSequenceGuards.ts` lines 12–16.

**Design note:** exit is **idempotent**. If the user does three exit-worthy actions in quick succession, only the first matters; the rest no-op because the enrollment is already in `exited` state.

---

## 7. The cron

Single cron endpoint, guarded by `CRON_SECRET`:

- **File:** [`src/routes/api/cron/process-sequences/+server.ts`](../../src/routes/api/cron/process-sequences/+server.ts)
- **Schedule:** `*/15 * * * *` (every 15 minutes) — see `vercel.json`.
- **Auth:** `isAuthorizedCronRequest(authHeader, [CRON_SECRET])` — shared helper in `src/lib/server/cronAuth.ts`.
- **Batch size:** 10 per run.
- **Accepts both GET and POST** so you can trigger it manually with `curl -H "Authorization: Bearer $CRON_SECRET" ...`.

The 15-minute cadence is a trade-off:

- Fast enough that a step-2 email due at 2:00am gets sent by 2:15am.
- Slow enough that a downstream Gmail blip recovers without burning through the retry budget.
- Combined with the signup-time immediate send, users see step 1 instantly.

**Scaling note:** if you need to send more than 10 emails per 15 minutes at peak, either bump `p_limit` or lower the cron interval. The claim RPC scales linearly because the partial index only contains due rows.

---

## 8. Sender, tracking, suppression

### 8.1 Sender

[`src/lib/email/sender.ts`](../../src/lib/email/sender.ts) — Gmail API via `googleapis` library, service-account JWT auth, impersonates `usersup@9takes.com`. Builds RFC 2822 multipart/alternative messages with both plaintext and HTML.

Key headers set automatically:

- `Reply-To: usersup@9takes.com`
- `List-ID: 9takes <emails.9takes.com>`
- `List-Unsubscribe: <https+unsubscribe-url>, <mailto:usersup@9takes.com?subject=unsubscribe>`
- `List-Unsubscribe-Post: List-Unsubscribe=One-Click` — Gmail/Apple Mail one-click unsubscribe compliance.

Two entry points:

- `sendEmail(options)` — raw send, no DB tracking. Used for admin test previews.
- `sendEmailWithTracking(supabase, options)` — creates an `email_sends` row with a fresh `tracking_id`, injects pixel + rewritten links, persists the record. Used by the sequence cron.

### 8.2 Tracking

In [`src/lib/email/base-template.ts`](../../src/lib/email/base-template.ts):

- **Open tracking:** `<img src="/api/track/open/{trackingId}" 1x1>` at the bottom of the email. Hit sets `opened_at`, increments `open_count`.
- **Click tracking:** `rewriteLinksForTracking` rewraps every `href` as `/api/track/click/{trackingId}/{url-encoded-destination}`. That endpoint records the event then 302-redirects. Unsubscribe and tracking links themselves are excluded from rewriting to avoid loops.
- **Unsubscribe:** `/api/track/unsubscribe/{trackingId}` — one-click, no confirmation.
- **Tracking endpoints:** `src/routes/api/track/{open,click,unsubscribe}/`.

Aggregate analytics are exposed via the `get_email_analytics(campaign_id, from, to)` RPC (see `supabase/migrations/20260121_email_tracking_analytics_updates.sql`) — returns open rate, click rate, unsubscribe rate, bounce rate.

### 8.3 Suppression

Suppression is checked at **send time** (inside the cron processing loop), not at enrollment time. This is important: a user might enroll today, unsubscribe tomorrow from a different campaign, and then hit step 2 next week. Checking at send guarantees we respect the latest state.

Implementation: [`src/lib/email/suppression.ts`](../../src/lib/email/suppression.ts). The `get_suppressed_emails(p_emails[])` RPC (migration `20260304_email_suppression_helpers.sql`) unions two sources:

- `email_unsubscribes` — the canonical suppression list.
- `signups.unsubscribed_date IS NOT NULL` — legacy newsletter suppressions.

If a sequence send hits a suppressed email, the enrollment is marked `exited` with reason `unsubscribed` and no email is sent. No retry.

---

## 9. Admin UI

Single page at `/admin/welcome-sequence` — file: [`src/routes/admin/welcome-sequence/+page.svelte`](../../src/routes/admin/welcome-sequence/+page.svelte) (1280 lines; the monolith is intentional, easier to iterate on than split).

### 9.1 Capabilities

- **Step list** with per-step metrics: sent, opened (with %), clicked (with %). Computed by matching `email_sends.subject` to the step's effective subject (see below).
- **"Copy managed in code" badge** on each step that has a code override, so admins don't try to edit DB copy that will be ignored at send time.
- **Live HTML preview** — each step renders through the full `generateEmailHtml` template with a fake recipient name (`"DJ"`), preheader, tracking pixel placeholder, and footer. Click "View email content" on a step and you get the exact HTML that goes out.
- **Send test email** — to any address, either a single step or the full flow. Subject is prefixed `[TEST]`. Uses `sendEmail` (not `sendEmailWithTracking`), so test sends don't pollute analytics.
- **Live queue table** — up to 100 active enrollments, sorted by `next_send_at`. Shows which are "due now" vs upcoming, what the next subject is, and the current step.
- **Funnel counts** — `total_enrolled`, `reached_step_1..4`, `completed`, `exited`, `errored`, `active`. Gives you drop-off at a glance.
- **Return-visit attribution** — joins enrollments against `page_analytics_sessions` (by user_id and by fingerprint) to show whether each enrolled user came back to the site after their last email send. Headline number: `returnRate` — % of enrollments with `last_sent_at` where the user visited after the send.
- **Scheduled emails queue** — lists pending broadcasts from the shared `scheduled_emails` table (the broader email-dashboard system).

### 9.2 Metric join design

The per-step metrics use subject-matching rather than a direct FK. Why: `email_sends.campaign_id` is null for sequence sends, and adding a sequence_step_id FK would have been a bigger refactor. Subject-match works because step subjects are unique within a sequence. If you change a subject line, the old metric rows still match under the old subject — the page queries both the code-effective subject and the DB subject and unions the results. See `+page.server.ts` lines 219–229.

**Trade-off:** changing a subject resets its historical metrics count after ~send-log retention horizon. Acceptable for this use case; revisit if you hit a scale where history matters.

---

## 10. Testing / tests

Good coverage of the state machine logic. See:

- `src/lib/server/emailSequences.spec.ts`
- `src/lib/server/welcomeSequenceGuards.spec.ts`
- `src/lib/server/welcomeSequenceReturns.spec.ts`
- `src/lib/email/sequences.spec.ts` (token replacement)
- `src/lib/email/base-template.spec.ts` (HTML generation, link rewriting)
- `src/lib/server/emailAdminSequences.spec.ts`

Run with `pnpm test:unit`.

---

## 11. Environment variables

| Variable                          | Purpose                                                                                                      |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `PRIVATE_gmail_private_key`       | Gmail service account JSON, base64 or raw. The sender parses it with `JSON.parse` and extracts `privateKey`. |
| `CRON_SECRET`                     | Bearer token for the cron endpoint. Also on Vercel cron config.                                              |
| `SUPABASE_SERVICE_KEY`            | Service-role Supabase client for cron RPCs.                                                                  |
| `PUBLIC_SUPABASE_URL`             | Used by both admin client and service client.                                                                |
| `EMAIL_FOOTER_ADDRESS` (optional) | Physical address shown in email footer for CAN-SPAM compliance.                                              |

---

## 12. File map (replication checklist)

Port these in this order:

### Database (migrations)

1. `supabase/migrations/20251202_email_management_system.sql` — `email_campaigns`, `email_templates`, `email_sends`, `scheduled_emails`.
2. `supabase/migrations/20251204_pg_cron_scheduled_emails.sql` — scheduled broadcast cron (optional if you only need sequences).
3. `supabase/migrations/20260121_email_tracking_analytics_updates.sql` — `get_email_analytics`, `track_email_event`.
4. `supabase/migrations/20260304_email_suppression_helpers.sql` — `get_suppressed_emails`, `normalize_email_text`.
5. `supabase/migrations/20260316_welcome_email_sequence.sql` — the sequence tables + RPCs + seed.
6. `supabase/migrations/20260406_claim_specific_sequence_send.sql` — the single-row claim variant used for signup-time sends.

### Email core (`src/lib/email/`)

- `base-template.ts` — HTML wrapper, escaping, pixel/click/unsubscribe URL builders.
- `sender.ts` — `sendEmail`, `sendEmailWithTracking`. Gmail JWT auth.
- `suppression.ts` — `getSuppressedEmailSet`, `normalizeEmail`.
- `sequences.ts` — `prepareSequenceSend`, token renderer.
- `welcome-sequence-content.ts` — the actual copy.

### Server glue (`src/lib/server/`)

- `supabaseAdmin.ts` — service-role client factory.
- `cronAuth.ts` — `isAuthorizedCronRequest`.
- `emailSequences.ts` — `processPendingSequenceSends`, `processSequenceEnrollmentNow`, `enrollUserInWelcomeSequence`, `exitWelcomeSequenceForUser`, `exitWelcomeSequenceForEmail`.
- `emailAdminSequences.ts` — admin-side helpers for the UI page.
- `welcomeSequenceGuards.ts` — the four `safely*` wrappers used by register + exit sites.
- `welcomeSequenceReturns.ts` — `buildReturnVisitsByUser` for the admin page return-attribution widget.

### Routes

- `src/routes/api/cron/process-sequences/+server.ts` — the cron.
- `src/routes/api/track/open/[tracking_id]/+server.ts`
- `src/routes/api/track/click/[tracking_id]/[url]/+server.ts`
- `src/routes/api/track/unsubscribe/[tracking_id]/+server.ts`
- `src/routes/admin/welcome-sequence/+page.server.ts` and `+page.svelte` — admin UI.

### Call sites (port the _pattern_, not the files)

- `src/routes/register/+page.server.ts` — where enrollment + immediate-send is called.
- `src/routes/questions/create/+page.server.ts` — where `created_question` exit is called.
- `src/routes/questions/[slug]/+page.server.ts` — where `answered_question` / `created_comment` exits are called.

### Infra

- `vercel.json` — the `crons` array entry pointing at `/api/cron/process-sequences` every 15 min.

---

## 13. Design decisions worth preserving (and why)

1. **Claim-then-process, not select-then-update.** Using `FOR UPDATE SKIP LOCKED` inside a `claim_*` RPC means you can parallelize the cron and never double-send. If you instead select rows and update them from app code, there's always a window where two workers both see the same "due" row.
2. **Separate `status='processing'` state.** Timestamps alone can't express "currently being worked on" unambiguously. The `processing_started_at` + 2h reaper pattern recovers stuck rows from crashed workers.
3. **`current_step_number` = last successfully sent step.** Advance only after the send succeeds AND the tracking row is written. Failure between those steps is what `last_email_send_id` being nullable buys you — you can reconcile.
4. **Suppression check at send, not at enrollment.** Users unsubscribe throughout the sequence's lifetime. Checking at enrollment only would miss the majority of unsubscribes.
5. **Exit on user action, not just on unsubscribe.** The sequence has a specific conversion goal (get them to answer/ask/comment). Once that happens, every remaining email is noise. This is what makes the sequence feel respectful instead of drip-spammy.
6. **Code-override-wins content pattern.** Gets you "editable by admins in theory, version-controlled in practice."
7. **Signup-time immediate first send.** Users expect confirmation. Don't make them wait for the cron's next tick — call `claim_specific_sequence_send` synchronously in the register action, wrapped in a try/catch that never fails registration.
8. **Polymorphic `recipient_source`.** Writing sequences for newsletter signups, coaching waitlist, and registered users all through the same infra has saved a massive amount of duplication.
9. **Subject-based metric matching.** Simple, correct-enough, and resilient to schema drift.
10. **Test sends use raw `sendEmail`, not `sendEmailWithTracking`.** Previews don't pollute analytics.

---

## 14. What to change when replicating

- Hardcoded URLs (`https://9takes.com/...`) in `sequences.ts` → move to env.
- Gmail service account → your provider's equivalent. Postmark, Resend, SES are drop-in alternatives; you'd replace `sender.ts`'s core only.
- `profiles` table join in `claim_pending_sequence_sends` — rename to your user table, and drop the `enneagram` column from the join if you don't have it.
- The `normalize_email_text` Postgres function (expected by `enroll_user_in_sequence`) lives in `20260304_email_suppression_helpers.sql` — port it too or inline the lowercase+trim logic.
- `page_analytics_sessions` (used by the return-visit widget) is 9takes-specific. Replace with your analytics source or cut the widget; the sequence system does not depend on it.
- The `/admin/welcome-sequence` page uses `adminAuth` via layout guard. Port whatever admin gate you use.

---

## 15. Known sharp edges

- **Subject changes break historical metrics.** If you rename a subject, the admin UI will show 0 sent/opened for the new subject and the old subject's history orphans. Acceptable in practice; document it.
- **The `sequence_key` is a magic string.** It's exported as `WELCOME_SEQUENCE_KEY` from `welcome-sequence-content.ts` and must match the DB row. A typo here silently breaks enrollment (the RPC throws "Sequence not found or inactive").
- **`enroll_user_in_sequence` is idempotent on (sequence, user)** — if you need to let a user re-enter a sequence, you'd need to either delete the old enrollment or add a `resume` RPC that resets `status`, `current_step_number=0`, `next_step_number=first_step`, `next_send_at=NOW()`.
- **The 2-hour stuck-processing reaper** is inside `claim_pending_sequence_sends`. If no cron run happens for 2+ hours, a stuck row stays stuck until the next run. Not a problem on a 15-minute cron, but worth knowing.
- **No pause-per-enrollment UI.** There's a `paused` status in the schema but nothing in the admin UI sets it. Add an action if you need that.
