---
title: 'Site Page Analytics Specification'
description: 'In-house page visit and time-on-page analytics for all 9takes pages with admin reporting'
last_modified: 2026-02-20
status: proposed
category: spec
related:
  - email-dashboard-analytics-spec.md
  - content-command-center-spec.md
path: docs/development/site-page-analytics-spec.md
---

# Site Page Analytics Specification

## Intent Summary

Build a first-party analytics system inside 9takes that tracks:

1. Page visits for all site pages (including blog pages)
2. Active time spent on each page
3. Admin reporting in a dedicated analytics screen

This should follow normal analytics behavior (sessions, page views, time on page) while staying fully in-house.

---

## Current State Analysis

### What Exists

- Client generates fingerprint in `src/routes/+layout.svelte` and posts to `POST /api/adder`.
- `POST /api/adder` upserts into `visitors` (`fingerprint`, timestamps).
- Admin dashboard (`src/routes/admin/+page.server.ts`) reads `visitors_last_30_days`.

### Gaps

- No page-level view data (only visitor identity count).
- No time-on-page tracking.
- No per-page performance breakdown (top pages, blog page performance, trends).
- No dedicated admin analytics page for content/page behavior.

---

## Goals

- Track page visits for all public site pages.
- Track active time spent per page view.
- Provide admin UI to inspect visits/time by page, with date filtering.
- Keep system first-party (9takes-owned data flow and storage).
- Reuse existing fingerprint/session patterns where possible.

## Non-Goals (V1)

- Replacing Google Analytics/Clarity immediately.
- Full funnel attribution or multi-touch marketing attribution.
- Real-time streaming dashboards.
- Pixel-perfect parity with enterprise analytics tools.

---

## Scope

### Included (V1)

- All non-admin pages (`/`, question pages, blog pages, account/public utility pages).
- Blog-specific filtering in analytics UI.
- Session-aware page view tracking.
- Active time computation using visibility + user activity.

### Excluded (V1)

- `/admin/*` internal tool traffic (excluded by default).
- Bot traffic perfection (basic bot filtering only in V1).
- Cross-device identity resolution.

---

## Key Definitions

- **Page View**: A route load/navigation to a page path.
- **Visit Session**: Continuous browsing window grouped by session key (30m inactivity timeout).
- **Active Time**: Time when tab is visible and user is recently active.
- **Time on Page**: Sum of active-time deltas captured for a page view.
- **Unique Visitor**: Distinct `fingerprint` over selected time range.

---

## Proposed Architecture

```text
Browser Tracker (SvelteKit layout + navigation hooks)
  -> /api/analytics/page-view
  -> /api/analytics/page-ping
  -> /api/analytics/page-exit (sendBeacon)
      -> Supabase RPC / DB writes
          -> page_analytics_sessions
          -> page_analytics_visits
              -> Admin APIs
                  -> /admin/analytics UI
```

### Why This Shape

- `page-view` creates canonical rows.
- `page-ping` makes time-on-page robust for long visits.
- `page-exit` finalizes end-of-view when available.
- If exit is missed (tab kill), ping data still preserves most active time.

---

## Data Model (Supabase)

### 1) `page_analytics_sessions`

Session-level grouping.

```sql
id UUID PK DEFAULT gen_random_uuid()
session_key TEXT UNIQUE NOT NULL
fingerprint TEXT NOT NULL
user_id UUID NULL
started_at TIMESTAMPTZ NOT NULL DEFAULT now()
last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
ended_at TIMESTAMPTZ NULL
entry_path TEXT NULL
exit_path TEXT NULL
page_count INT NOT NULL DEFAULT 0
created_at TIMESTAMPTZ NOT NULL DEFAULT now()
updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
```

### 2) `page_analytics_visits`

One row per page view.

```sql
id BIGSERIAL PK
visit_key UUID UNIQUE NOT NULL               -- client-generated idempotency key
session_id UUID NOT NULL REFERENCES page_analytics_sessions(id)
fingerprint TEXT NOT NULL
user_id UUID NULL
path TEXT NOT NULL                           -- actual pathname
route_id TEXT NULL                           -- SvelteKit route id (e.g. /personality-analysis/[slug])
path_group TEXT NOT NULL                     -- normalized grouping key
content_type TEXT NULL                       -- people/community/pop-culture/etc
content_slug TEXT NULL                       -- if route is slug-based
referrer_host TEXT NULL
started_at TIMESTAMPTZ NOT NULL DEFAULT now()
ended_at TIMESTAMPTZ NULL
engaged_ms INT NOT NULL DEFAULT 0
max_scroll_pct SMALLINT NOT NULL DEFAULT 0
is_exit BOOLEAN NOT NULL DEFAULT false
created_at TIMESTAMPTZ NOT NULL DEFAULT now()
updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
```

### Indexes

- `idx_page_visits_started_at` on `started_at desc`
- `idx_page_visits_path_group_started_at` on `(path_group, started_at desc)`
- `idx_page_visits_content_type_started_at` on `(content_type, started_at desc)`
- `idx_page_visits_fingerprint_started_at` on `(fingerprint, started_at desc)`
- `idx_page_sessions_fingerprint_last_seen` on `(fingerprint, last_seen_at desc)`

### Optional View (recommended)

`v_page_analytics_daily`:

- day
- path_group
- visits
- unique_visitors
- avg_engaged_ms
- median_engaged_ms

---

## Instrumentation Strategy (Client)

Implement in `src/routes/+layout.svelte` (or extracted analytics client module):

1. On initial load and each route navigation (`afterNavigate`), call `page-view`.
2. Maintain per-view `visit_key` and in-memory timer state.
3. Track activity signals (`pointerdown`, `keydown`, `scroll`) and visibility (`visibilitychange`).
4. Every 15s (when visible + active), send `page-ping` with `engaged_ms_delta`.
5. On navigation away/unload, send `page-exit` via `navigator.sendBeacon` fallback to `fetch`.

### Active-Time Rules (V1)

- Count time only when:
  - document is visible
  - user has activity within last 30s
- Ping interval: 15s
- Max delta per ping: 15,000ms
- Cap per-page engaged time at 30 minutes in V1 to reduce outliers

### Path Classification

Derive and send:

- `path` (actual path, e.g. `/personality-analysis/chamath-palihapitiya`)
- `route_id` (`$page.route.id`)
- `path_group` (`/personality-analysis/[slug]`)
- `content_type` inferred by prefix (people, community, guides, enneagram, pop-culture, question, other)
- `content_slug` for `[slug]` routes

---

## API Contract

### Public Tracking Endpoints

#### `POST /api/analytics/page-view`

Request:

```json
{
	"visit_key": "uuid",
	"session_key": "string",
	"fingerprint": "string",
	"path": "/personality-analysis/chamath-palihapitiya",
	"route_id": "/personality-analysis/[slug]",
	"path_group": "/personality-analysis/[slug]",
	"content_type": "people",
	"content_slug": "chamath-palihapitiya",
	"referrer_host": "google.com"
}
```

Response:

```json
{ "ok": true, "session_id": "uuid", "visit_id": 12345 }
```

#### `POST /api/analytics/page-ping`

```json
{
	"visit_key": "uuid",
	"engaged_ms_delta": 15000,
	"max_scroll_pct": 62
}
```

#### `POST /api/analytics/page-exit`

```json
{
	"visit_key": "uuid",
	"engaged_ms_delta": 4000,
	"max_scroll_pct": 80,
	"ended_at": "2026-02-20T18:54:00.000Z",
	"is_exit": true
}
```

### Admin Endpoints

#### `GET /api/admin/analytics/overview?from=YYYY-MM-DD&to=YYYY-MM-DD&scope=all|blog`

Returns headline metrics:

- total_visits
- unique_visitors
- avg_time_on_page_ms
- median_time_on_page_ms
- bounce_rate

#### `GET /api/admin/analytics/timeseries?...`

Daily points for charting:

- day
- visits
- unique_visitors
- avg_time_on_page_ms

#### `GET /api/admin/analytics/pages?...`

Paginated page breakdown:

- path_group / path
- visits
- unique_visitors
- avg_time_on_page_ms
- median_time_on_page_ms
- bounce_rate

Filters: date range, scope (`all`, `blog`, `people`, etc.), search.

---

## Admin UX Specification

### Route

- New page: `src/routes/admin/analytics/+page.server.ts`
- UI: `src/routes/admin/analytics/+page.svelte`
- Add nav item in `src/routes/admin/+layout.svelte` (`/admin/analytics`)

### Layout (V1)

1. Header with date range and scope filter
2. Metric cards:
   - Visits
   - Unique Visitors
   - Avg Time on Page
   - Median Time on Page
3. Trend chart (daily visits + avg time)
4. Top pages table (sortable by visits/time)
5. Blog pages table (or scope toggle using same table)

### Blog Filter Definition (V1)

Scope `blog` includes path prefixes:

- `/personality-analysis`
- `/community`
- `/how-to-guides`
- `/enneagram-corner`
- `/pop-culture`
- `/blog`

---

## Validation, Security, and Privacy

- Validate all payloads with Zod in tracking endpoints.
- Reject invalid/oversized strings and impossible values (`engaged_ms_delta < 0`, scroll outside 0-100).
- Ignore `/admin/*` and known non-content routes in tracker client and/or server guard.
- Store minimal personal data: no raw email in analytics rows.
- Keep `fingerprint` as existing identity primitive; do not add new PII fields.
- Basic bot suppression in V1: skip obvious bot user-agents (`bot|crawler|spider`).

---

## Migration and Backward Compatibility

- Keep existing `visitors` + `/api/adder` path during rollout.
- No historical page-level backfill is possible from current `visitors` data.
- After V1 stabilizes, optional step: derive old visitor dashboard metric from `page_analytics_visits`.

---

## Implementation Plan

### Phase 1: Tracking Foundation

1. Add migration for new analytics tables/indexes/views.
2. Create public tracking API endpoints (`page-view`, `page-ping`, `page-exit`).
3. Add client tracker module and wire into root layout/navigation.
4. Add basic tests for endpoint validation and write behavior.

### Phase 2: Admin Analytics Page

1. Add `/api/admin/analytics/*` endpoints.
2. Build `/admin/analytics` page and nav item.
3. Ship date range + scope filtering + top pages table.

### Phase 3: Hardening

1. Improve bot filtering and outlier handling.
2. Add drilldown per path (single-page trends).
3. Evaluate deprecating duplicated visitor metrics paths.

---

## Testing Plan

- Unit tests: validation schemas and classification helpers.
- API tests:
  - page-view insert works and idempotent by `visit_key`
  - ping accumulates `engaged_ms`
  - exit finalizes `ended_at` and `is_exit`
- Integration tests:
  - navigate across 3 pages -> 3 visit rows
  - hidden tab time does not inflate engaged time
  - unload without exit still keeps pinged time
- Admin tests:
  - date filter changes metrics
  - scope `blog` returns only blog paths
  - top pages sorting works

---

## Success Criteria

- Admin can open `/admin/analytics` and see visits/time-on-page for all pages.
- Admin can filter to blog pages and identify top-performing posts.
- Metrics are stable enough that repeated refreshes produce consistent results.
- Tracking overhead remains lightweight (no noticeable UX/perf regression).

---

## Decisions (2026-02-20)

1. Authenticated users are shown separately from anonymous visitors in V1.
2. Utility routes are excluded from default reporting (including `/logout` and `/account/unsubscribe*`).
3. V1 tables expose raw `path` values, with `path_group` retained for grouping context.
