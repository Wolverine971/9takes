<!-- docs/development/email-sequence-health-audit-2026-03-04.md -->

# Email Sequence Health Audit and Remediation Spec

Date: 2026-03-04  
Owner: Admin/Email System

## Scope

This audit covers:

- Email open/click/deliverability tracking
- Unsubscribe flow correctness and compliance
- Suppression guarantees (do not send to unsubscribed users)

It includes live production checks and code-path review.

## Production Snapshot (as of 2026-03-04)

- Total `email_sends` rows: `10`
- Sent (all time): `9`
- Failed (all time): `1`
- Sent (last 7 days): `0`
- Sent (last 30 days): `1`
- Tracking events rows: `0`
- Scheduler health: `never_run`
- Scheduled rows by status: pending `0`, processing `0`, completed `0`, failed `0`, cancelled `0`
- Audience source rows: profiles `120`, signups `36`, coaching_waitlist `17` (total `173`)
- Deduped blast audience (`Email Everyone` effective): `160` unique emails (`13` duplicates removed, `0` unsubscribed excluded)

## Implemented in This Pass (2026-03-04)

- Enabled unsubscribe footer for immediate admin sends in `/api/admin/email-dashboard/send`.
- Enabled unsubscribe footer for scheduled sends executed by `/api/cron/send-scheduled-emails`.
- Added `List-Unsubscribe` and `List-Unsubscribe-Post` headers to outbound tracked emails.
- Added `POST` support on `/api/track/unsubscribe/[tracking_id]` to support one-click mailbox unsubscribe.

## Status Update (2026-03-04, follow-up pass)

The following are now implemented and active:

- Unsubscribe endpoint safety:
  - `/api/track/unsubscribe/[tracking_id]` is now non-mutating on `GET` (confirmation page).
  - Mutation happens on `POST` only (one-click compatible).
- Suppression hardening across send paths:
  - Immediate send (`/api/admin/email-dashboard/send`) checks suppression by normalized email.
  - Schedule creation (`/api/admin/email-dashboard/schedule`) excludes suppressed recipients.
  - Cron send-time (`/api/cron/send-scheduled-emails`) re-checks suppression right before delivery.
  - Legacy `/email` bulk action now enforces suppression before sending.
- Unified suppression helpers in DB:
  - Added `normalize_email_text`, `unsubscribe_email_direct`, and `get_suppressed_emails`.
  - Backfilled legacy `signups.unsubscribed_date` rows into `email_unsubscribes`.
  - Rebound `track_email_unsubscribe` to the unified suppression helper.
- Admin unsubscribe visibility:
  - Added `/api/admin/email-dashboard/unsubscribes` with pagination and search.
  - Added **Unsubscribed** tab in `/admin/email-dashboard` to view who unsubscribed, source, reason, and timestamp.

Current outcome:

- Unsubscribed users are tracked in `email_unsubscribes`.
- Admin can review unsubscribed users in dashboard UI.
- Send-now, schedule, cron, and legacy bulk paths block/suppress unsubscribed emails.

## Findings (Ordered by Severity)

Note: findings below are the original audit set; resolved/partial statuses are updated inline and in the Status Update section above.

### Critical

1. Resolved (2026-03-04): dashboard/cron emails now include unsubscribe by default.

- Evidence: [send/+server.ts](/Users/djwayne/9takes/src/routes/api/admin/email-dashboard/send/+server.ts:70) now sets `includeFooter: true`.
- Evidence: [send-scheduled-emails/+server.ts](/Users/djwayne/9takes/src/routes/api/cron/send-scheduled-emails/+server.ts:91) now sets `includeFooter: true`.
- Evidence: footer unsubscribe link render path: [base-template.ts](/Users/djwayne/9takes/src/lib/email/base-template.ts:120), [base-template.ts](/Users/djwayne/9takes/src/lib/email/base-template.ts:130).
- Impact addressed: blast emails now include visible unsubscribe footer link.

2. Resolved (2026-03-04): scheduled emails now re-check suppression at send time.

- Evidence: cron send path resolves suppressed recipients before send: [send-scheduled-emails/+server.ts](/Users/djwayne/9takes/src/routes/api/cron/send-scheduled-emails/+server.ts:84).
- Evidence: suppressed recipients are skipped and logged: [send-scheduled-emails/+server.ts](/Users/djwayne/9takes/src/routes/api/cron/send-scheduled-emails/+server.ts:129).
- Impact addressed: unsubscribe-after-scheduling is now honored before delivery.

3. Resolved (2026-03-04): unsubscribe is non-mutating on `GET`, mutating on `POST`.

- Evidence: GET renders confirmation view only: [unsubscribe/[tracking_id]/+server.ts](/Users/djwayne/9takes/src/routes/api/track/unsubscribe/[tracking_id]/+server.ts:63).
- Evidence: POST performs mutation: [unsubscribe/[tracking_id]/+server.ts](/Users/djwayne/9takes/src/routes/api/track/unsubscribe/[tracking_id]/+server.ts:141).
- Impact addressed: reduces scanner/prefetch accidental unsubscribe risk.

### High

4. Resolved (2026-03-04): legacy `/email` admin send paths now use shared sender stack.

- Evidence: legacy single/template sends now route through tracked sender helper in route: [+page.server.ts](/Users/djwayne/9takes/src/routes/email/+page.server.ts:61).
- Evidence: legacy bulk send now routes through `sendBatchEmails`: [+page.server.ts](/Users/djwayne/9takes/src/routes/email/+page.server.ts:425).
- Impact addressed: removed direct raw-Gmail sender implementation from this route.

5. Resolved (2026-03-04): suppression matching is normalized/canonicalized.

- Evidence: API send path normalizes emails before suppression comparison: [send/+server.ts](/Users/djwayne/9takes/src/routes/api/admin/email-dashboard/send/+server.ts:52).
- Evidence: DB helpers normalize with `normalize_email_text`: [20260304_email_suppression_helpers.sql](/Users/djwayne/9takes/supabase/migrations/20260304_email_suppression_helpers.sql:6).
- Impact addressed: case/whitespace variants no longer bypass suppression checks.

6. Resolved (2026-03-04): unsubscribe systems are now bridged through unified helpers.

- Evidence: `track_email_unsubscribe` now calls `unsubscribe_email_direct`: [20260304_email_suppression_helpers.sql](/Users/djwayne/9takes/supabase/migrations/20260304_email_suppression_helpers.sql:215).
- Evidence: legacy signup unsubscribe page syncs into unified suppression list: [unsubscribe/[slug]/+page.server.ts](/Users/djwayne/9takes/src/routes/account/unsubscribe/[slug]/+page.server.ts:83).
- Impact addressed: suppression state convergence across tracking + legacy unsubscribe paths.

### Medium

7. Deliverability metrics are not truly implemented.

- Evidence: status is set to `sent`/`failed` only in sender update path: [sender.ts](/Users/djwayne/9takes/src/lib/email/sender.ts:215).
- Evidence: system exposes `delivered`/`bounced` metrics but no provider webhook ingestion currently updates those statuses.
- Impact: dashboard "deliverability" is incomplete (mostly send-attempt status).

8. Scheduler is configured but not running in production.

- Evidence: live `email_cron_status` reports `never_run`; health logic is defined here: [20251204_pg_cron_scheduled_emails.sql](/Users/djwayne/9takes/supabase/migrations/20251204_pg_cron_scheduled_emails.sql:183).
- Impact: scheduled campaigns will not process automatically.

## Remaining Issues (Open)

1. Deliverability telemetry is still incomplete (no delivered/bounced provider event ingestion).
2. Recipient deduplication is not enforced in `send`/`schedule` APIs (same email can be included multiple times).
3. Cron endpoint auth is optional when `PRIVATE_CRON_SECRET` is unset.
4. `email_sends` anon read policy is broad and should be tightened to least privilege.

## Open Tracking and Deliverability Research Notes

### What we verified in this codebase

- Open and click tracking endpoints exist:
  - Open pixel endpoint: [open/[tracking_id]/+server.ts](/Users/djwayne/9takes/src/routes/api/track/open/[tracking_id]/+server.ts:13)
  - Click redirect endpoint: [click/[tracking_id]/[encoded_url]/+server.ts](/Users/djwayne/9takes/src/routes/api/track/click/[tracking_id]/[encoded_url]/+server.ts:7)
- Tracking URLs are injected during send:
  - Link rewriting and pixel URL: [sender.ts](/Users/djwayne/9takes/src/lib/email/sender.ts:120)
  - URL generation: [base-template.ts](/Users/djwayne/9takes/src/lib/email/base-template.ts:210)
- RPC tracking functions exist and are callable with publishable-key context.
- A synthetic publishable-key RPC test for `track_email_event` succeeded, and the generated test event/counter was immediately removed to keep production analytics clean.

### Why open metrics can still be imperfect even when working

- Apple Mail Privacy Protection affects open reliability (opens can be prefetched/proxied):  
  https://support.apple.com/en-us/102602
- Open tracking should be treated as directional, not exact.

### Deliverability reality

- Current Gmail API path does not provide robust delivered/bounce/complaint webhooks by itself.
- If true deliverability telemetry is required, either:
  - Add mailbox-based bounce processing for Gmail, or
  - Move outbound marketing to a provider with event webhooks (Resend/SES/Postmark/etc).

## Unsubscribe/Compliance Research Notes

- RFC 8058 recommends one-click unsubscribe via HTTPS POST to reduce anti-spam fetcher side effects:  
  https://www.rfc-editor.org/rfc/rfc8058
- Google bulk sender guidance references one-click unsubscribe and prompt processing for large senders:  
  https://support.google.com/a/answer/14229414
- FTC CAN-SPAM requires honoring opt-out requests (up to 10 business days):  
  https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business

## Remediation Spec

### Goal A: Reliable open/click analytics

#### A1. Instrumentation hardening

- Keep current pixel/click tracking endpoints.
- Add bot/user-agent flagging on events so analytics can distinguish likely bot traffic.
- Add event counters by campaign/source/date in admin API.

#### A2. Deliverability telemetry

- Add provider event ingestion path (`delivered`, `bounced`, `complaint`) and status transitions.
- If staying on Gmail API, implement bounce mailbox parsing as fallback.

Acceptance criteria:

- For a test campaign, sent/open/click counts are visible in `/admin/email-dashboard/sent`.
- At least one deliverability signal (delivered or bounced) is persisted per message or explicitly marked unavailable by provider mode.

### Goal B: Proper unsubscribe flow

#### B1. Footer and headers

- Default `includeFooter: true` for marketing/admin blast paths.
- Add `List-Unsubscribe` and `List-Unsubscribe-Post` headers in raw email body builder for mailbox-native unsubscribe.

#### B2. Endpoint behavior

- Change `/api/track/unsubscribe/[tracking_id]` GET to non-mutating confirmation view.
- Add POST action that performs unsubscribe mutation.
- Keep one-click POST endpoint for header-driven unsubscribe.

Acceptance criteria:

- Every blast email has a visible unsubscribe control.
- One-click unsubscribe works and updates suppression before next send.

### Goal C: Suppression must be airtight

#### C1. Canonicalization

- Normalize emails (`trim().toLowerCase()`) in all send/suppress paths.
- Enforce uniqueness by normalized email in `email_unsubscribes`.

#### C2. Unified suppression source of truth

- Create DB function `is_email_suppressed(email)` that checks:
  - `email_unsubscribes`
  - `signups.unsubscribed_date` (legacy)
- Use this function in:
  - immediate sends
  - scheduling
  - cron processing (re-check right before send)

#### C3. Remove dangerous bypasses

- Disable or gate legacy `/email?/sendCustomEmailToEveryone` path, or route it through the same suppression-checked pipeline.

Acceptance criteria:

- A user who unsubscribes after scheduling and before execution does not receive the scheduled send.
- Case-variant email (`User@X.com` vs `user@x.com`) cannot bypass suppression.

## Implementation Plan (Phased)

### Phase 0 (Hotfix, 1 day)

- Enable unsubscribe footer on dashboard + cron sends.
- Add suppression re-check in cron before calling `sendBatchEmails`.
- Disable legacy mass-send action or rewire it to new API.

### Phase 1 (Correctness, 1-2 days)

- Unsubscribe endpoint redesign: GET confirm + POST mutate + one-click endpoint.
- Normalize/sanitize email matching end-to-end.
- Backfill `email_unsubscribes` from `signups.unsubscribed_date` where missing.

### Phase 2 (Analytics/Deliverability, 2-4 days)

- Deliverability event ingestion path.
- Admin dashboard additions for delivery/bounce/complaint visibility.
- Alerts for scheduler health and failed scheduled jobs.

## Test Plan

- Unit tests:
  - email normalization
  - suppression check function
  - unsubscribe endpoint behavior (GET non-mutating, POST mutating)
- Integration tests:
  - send-now excludes unsubscribed recipients
  - schedule-then-unsubscribe-then-cron send excludes recipient
  - footer contains unsubscribe link
- Manual QA:
  - send test campaign to seed recipients
  - open/click/unsubscribe from real mailbox
  - verify corresponding `email_tracking_events` and `email_sends` counters

## Recommendation

Execute Phase 0 immediately before the next blast.  
Then complete Phase 1 before relying on scheduled campaigns at larger volume.
