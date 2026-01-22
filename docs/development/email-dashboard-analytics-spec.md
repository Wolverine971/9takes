---
title: 'Email Dashboard Analytics and Sent Flow Specification'
description: 'Spec to surface sent emails, fix tracking, and expand analytics in /admin/email-dashboard'
last_modified: 2026-01-21
status: in_progress
category: spec
related:
  - email-management-system-spec.md
path: docs/development/email-dashboard-analytics-spec.md
---

# Email Dashboard Analytics and Sent Flow Specification

## Intent Summary

Upgrade `/admin/email-dashboard` so admins can reliably see what was sent, inspect delivery and engagement, and trust the metrics. This spec focuses on the sent-email experience and analytics fidelity while preserving the existing send/schedule/draft flows.

---

## Current State Analysis

### What Exists

- UI tabs: Users, Drafts, Scheduled, Sent (Sent is a placeholder message).
- Stats row uses `get_email_analytics` (sent/opened/clicked/unsubscribed).
- Backend endpoints:
  - `GET /api/admin/email-dashboard/sent` (returns email_sends + analytics summary)
  - `POST /api/admin/email-dashboard/send` (send immediately)
  - `POST /api/admin/email-dashboard/schedule` (schedule send)
  - `POST /api/admin/email-dashboard/drafts` (save draft)
- Data model: `email_sends`, `email_tracking_events`, `email_unsubscribes`, `scheduled_emails`, `email_drafts`.
- Tracking endpoints: `/api/track/open`, `/api/track/click`, `/api/track/unsubscribe`.

### Gaps and Risks

- Sent tab is not implemented, so there is no visibility into what was sent.
- Tracking endpoints use an anon Supabase client while RLS only permits admin writes for `email_sends` and `email_unsubscribes`. This likely blocks open/click/unsubscribe updates and undermines analytics.
- No UI for filtering by date range, status, campaign, or subject.
- No drilldown for per-email events (open/click/unsubscribe history).
- No grouping for "send batches" (one send action across many recipients), making it hard to inspect a single send.
- `email_sends` does not store provider message id or send batch id, limiting traceability.

---

## Goals

- Show sent emails (at minimum) with status, recipient, subject, and timestamps.
- Provide reliable metrics: sent, opened, clicked, unsubscribed, bounced, failed, plus rates.
- Allow filtering and drilldown for campaign/date/recipient/subject.
- Fix tracking writes so open/click/unsubscribe are reflected in `email_sends` and analytics.

## Non-Goals

- Full marketing automation or multi-step journeys.
- ESP migration (Mailchimp/SendGrid) or bounce webhooks in this phase.
- Public subscriber preference center beyond basic unsubscribe.

---

## Proposed UX (Admin)

### 1. Sent Tab (MVP)

**List View**

- Table columns: Sent At, Subject, Recipient, Source, Status, Opens, Clicks, Unsubscribed.
- Search: subject or recipient email.
- Filters: status (sent/failed/bounced), date range, source, campaign (if set).
- Pagination (reuse existing limit=50 behavior).

**Row Actions**

- View details (opens a side panel or modal).
- Copy tracking id (for debugging).

### 2. Sent Detail Panel

- Email header: subject, sent_at, sent_by, campaign (if present).
- Recipient: email, name, source.
- Content preview: HTML rendered; raw HTML toggle.
- Event timeline: opens, clicks (with link_url), unsubscribes.

### 3. Analytics Header

- Date range selector (Last 7/30/90, custom).
- Stat chips: Sent, Opened, Clicked, Unsubscribed, Bounced, Failed.
- Rates: Open Rate, Click Rate, Unsubscribe Rate.

### 4. Optional Phase 2 Views

- Batch view (group by send action).
- Campaign summary view (open/click trends per campaign).
- Export CSV for filtered results.

---

## Data Model Updates

### Required

1. **Tracking-safe write path**
   - Add SECURITY DEFINER RPCs for tracking updates (preferred), or use a service-role Supabase client in tracking endpoints.
   - Ensure opens/clicks/unsubscribes update `email_sends` and insert `email_tracking_events`.

2. **Email analytics RPC v2**
   - Extend analytics to include `total_failed`, `total_bounced`, `unsubscribe_rate`, and optionally total open/click counts (sum of open_count/click_count).

### Optional (Phase 2)

3. **Send batch grouping**

```
email_send_batches
- id (uuid)
- subject
- html_content
- campaign_id (nullable)
- created_by
- created_at
- recipient_count
- status (pending/sent/failed)
```

- Add `batch_id` to `email_sends` and `scheduled_emails`.
- Enables a "Sent" view that mirrors a single send action instead of per-recipient rows.

4. **Provider traceability**

- Add `provider_message_id` to `email_sends` (store Gmail message id returned by send).

---

## Backend/API Changes

### Existing (reuse)

- `GET /api/admin/email-dashboard/sent` for list data + summary.
  - Add filters: `search`, `from_date`, `to_date`, `status`, `source`, `campaign_id`.

### New/Extended

- `GET /api/admin/email-dashboard/sent/:id`
  - Returns the email_send record + tracking events.

- `GET /api/admin/email-dashboard/analytics`
  - Returns summary + time-series breakdown (daily counts) for charts.

- `RPC track_email_event(tracking_id, event_type, link_url, ip, user_agent)`
  - Updates `email_sends` counters and inserts `email_tracking_events`.

- `RPC track_email_unsubscribe(tracking_id, ip, user_agent)`
  - Inserts into `email_unsubscribes`, updates `email_sends.unsubscribed_at`.

---

## Metrics Definitions

- **Sent**: status in ('sent', 'delivered')
- **Opened**: `opened_at IS NOT NULL`
- **Clicked**: `clicked_at IS NOT NULL`
- **Open Rate**: opened / sent
- **Click Rate**: clicked / opened (CTOR)
- **Unsubscribe Rate**: unsubscribed / sent
- **Bounce Rate**: status = 'bounced' / sent
- **Failure Rate**: status = 'failed' / sent

---

## Implementation Plan

### Phase 1 (MVP)

1. Fix tracking writes via SECURITY DEFINER RPCs or service-role client.
2. Implement Sent tab UI using existing `/sent` endpoint.
3. Add sent detail panel + event list.
4. Expand analytics header with new stats and date range filter.

### Phase 2 (Enhanced)

1. Add send batches and campaign grouping.
2. Add analytics charts and CSV export.
3. Add provider message id for troubleshooting.

---

## Testing Plan

- Send a test email to two recipients; verify two `email_sends` rows.
- Open and click the email; verify `email_sends.opened_at` and `email_sends.clicked_at` update.
- Unsubscribe; verify `email_unsubscribes` insert and `email_sends.unsubscribed_at` update.
- Validate analytics summary matches the sent list for a filtered date range.

---

## Open Questions

- Do we want Sent view to default to per-recipient rows or grouped by send batch?
- Should analytics be scoped by "campaign" or by "send batch" first?
- Do we need per-source metrics (profiles vs signups vs coaching_waitlist) in v1?

---

## Implementation Progress (2026-01-21)

### Completed

- Added migration for tracking RPCs and expanded analytics fields (`supabase/migrations/20260121_email_tracking_analytics_updates.sql`).
- Updated tracking endpoints to use RPCs for open/click/unsubscribe writes.
- Added analytics summary endpoint (`GET /api/admin/email-dashboard/analytics`).
- Added sent detail endpoint (`GET /api/admin/email-dashboard/sent/:id`).
- Extended sent list endpoint with search/source/status filters.
- Built Sent tab UI with filters, pagination, and detail panel.
- Added analytics date-range controls and new stat chips (bounced/failed/unsubscribe rate).
- Tuned sent detail email preview styling to render with a light, readable palette.

### Remaining

- Optional: extend analytics summary to reflect sent list filters (status/source/search).
- Phase 2 items (batch grouping, charts, CSV export, provider message id).
