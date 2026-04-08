---
title: 'Retention Instrumentation Plan'
date: '2026-04-08'
status: 'draft'
owner: 'DJ'
related:
  - docs/planning/universal-search-and-library-plan-2026-04-08.md
  - docs/planning/experiment-a-anonymous-email-capture-2026-04-08.md
path: docs/planning/retention-instrumentation-plan-2026-04-08.md
---

# Retention Instrumentation Plan

> **One-line goal.** Be able to answer "is 9takes retaining new users, by entry surface and acquisition source, this week vs. last?" from `/admin/analytics`, without writing ad hoc SQL.

## Executive summary

The original direction was right, but it had three blocking problems:

1. **The visitor identity is not stable enough today to join visits, comments, and signup cleanly.**
2. **The proposed retention refresh depended on raw `page_analytics_*` scans even though raw telemetry is pruned after 60 days.**
3. **The proposed profile-attribution write path (`/register`) is not the most reliable place to attach first-touch data.**

So the plan of record is now:

1. **Fix visitor identity first** so one browser session uses one stable visitor key everywhere.
2. **Capture first touch once** in a small permanent table.
3. **Materialize daily visitor activity** so retention does not depend on repeated raw pageview scans.
4. **Roll up cohorts nightly** from the materialized visitor-day facts.
5. **Expose only decision-driving admin views**: entry-surface overview, retention curve, acquisition mix, and first-session next paths.

This keeps the system fast, rebuildable within the raw-data window, and usable for Experiment A and later growth work.

## Why this exists

The growth problem is not just traffic. It is that 9takes cannot currently answer:

- Which entry surfaces create returning visitors.
- Which acquisition sources create returning visitors.
- Whether activation changes improve D1 / D7 retention.
- Whether last week got better or worse than the week before.

Today:

- `/admin` shows broad totals plus a vague `activeUsers`.
- `/admin/analytics` shows pageviews, timeseries, and top pages.
- There is no first-touch attribution.
- There is no cohort model.
- There is no retention view inside the admin surface.

That means every growth experiment is partially blind.

## Non-goals

- Replacing GA / Plausible / Clarity.
- Multi-touch attribution.
- Marketing-grade attribution modeling. In v1 we will capture first-touch UTM and click-id fields, but we are not building a full attribution system.
- Real-time streaming analytics.
- Arbitrary funnel-builder UI.
- Per-post cohort analytics in v1.

## Current constraints (verified, 2026-04-08)

### What exists

- `page_analytics_visits` and `page_analytics_sessions` were added in `supabase/migrations/20260220_site_page_analytics.sql`.
- `/admin/analytics` already loads analytics via RPCs in `src/routes/admin/analytics/+page.server.ts`.
- Path classification already exists in `src/lib/analytics/pageAnalytics.ts`.
- Anonymous comments already carry a `fingerprint`.
- `profiles.created_at` exists and is reliable for account creation timing.

### What will break this plan if we ignore it

1. **Raw telemetry is pruned.**

   `supabase/migrations/20260328_reduce_self_generated_usage.sql` currently deletes `page_analytics_visits` older than 60 days. This plan changes that cleanup window to **90 days**, but raw pageviews still are **not** the permanent source of truth.

2. **Visitor identity is inconsistent today.**

   In `src/routes/+layout.svelte`, analytics can emit an initial pageview using a generated fallback `anon-*` ID before FingerprintJS has finished loading. In `src/lib/components/molecules/Interact.svelte`, anonymous comment creation loads FingerprintJS directly and uses that result. That means the same human can show up under different "fingerprints" across pageviews and comments.

3. **`/register` is not the cleanest attribution hook.**

   `src/routes/register/+page.server.ts` calls `auth.signUp()` and welcome-sequence helpers, but it is not the most reliable place to do a follow-up `profiles` attribution write. The better hook is the first authenticated request after signup/login.

4. **The current admin UI already round-trips to the database.**

   That is fine. The real requirement is "no manual SQL outside admin", not "no DB queries from admin."

## Decision: what we will measure

### Canonical dimensions

| Field                    | Definition                                                                                                 |
| ------------------------ | ---------------------------------------------------------------------------------------------------------- |
| **Visitor**              | A stable browser-level visitor key stored in the existing `fingerprint` columns.                           |
| **Analytics timezone**   | `America/New_York` for cohort dates, D1/D7/D30, and weekly admin views.                                    |
| **First touch**          | The first non-utility tracked visit for a visitor.                                                         |
| **Entry surface**        | One of `people`, `community`, `guides`, `enneagram`, `pop-culture`, `question`, `home`, `other`.           |
| **Acquisition source**   | Normalized from first-touch attribution inputs using precedence `UTM > click-id > referrer host > direct`. |
| **Comment activation**   | First comment written by the visitor.                                                                      |
| **Email signup**         | First row in `signups` tied to the visitor key.                                                            |
| **Account registration** | First `profiles` row tied to the visitor key.                                                              |
| **Engaged session**      | A session where total `engaged_ms >= 30000` and total pageviews `>= 2`.                                    |
| **D-N retained**         | At least one visit on exact local day N after first touch.                                                 |

### Important interpretation rules

- **D7 and D30 are maturity-gated.** Recent cohorts do not count toward D7/D30 until those windows have elapsed.
- **The dashboard defaults to weekly aggregation.** Daily cohorts will be too noisy at current traffic.
- **Percentages always show raw counts nearby.** Growth decisions should not be made on tiny denominators.

### How acquisition buckets are found

We do not need magic here. We already get most of what we need from the first landing request.

On the first tracked pageview, persist:

- raw `referrer_host`
- landing query string
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_term`
- `utm_content`
- common click IDs such as `gclid`, `msclkid`, `fbclid`, `ttclid`

Then normalize with this precedence:

1. **UTM fields present**  
   Example: `utm_source=reddit&utm_medium=social` becomes `social/reddit`.
2. **Known click ID present**  
   Example: `gclid` becomes `paid/google`; `msclkid` becomes `paid/bing`; `fbclid` becomes `social/meta`; `ttclid` becomes `social/tiktok`.
3. **Known external referrer host**  
   Example: `google.com` becomes `search/google`; `t.co` or `x.com` becomes `social/x`; `reddit.com` becomes `social/reddit`; `substack.com` can become `email/substack` or `referral/substack`.
4. **Internal referrer**  
   `9takes.com` becomes `internal`.
5. **No referrer / no signals**  
   `direct`.

The important implementation rule is: **store the raw first-touch fields and the normalized bucket**. The raw fields let us re-bucket later without losing history.

This requires extending the first pageview payload in:

- `src/routes/+layout.svelte`
- `src/routes/api/analytics/page-view/+server.ts`
- `src/lib/validation/analyticsSchemas.ts`

so the server receives the landing query string / UTM / click-id fields on first touch.

## Phase 0: identity hygiene (must happen first)

Without this phase, every downstream metric is contaminated.

### Plan

Keep the existing cookie name `9tfingerprint`, but make it the **single canonical visitor key**:

1. If the cookie is missing, generate a UUID synchronously before the first analytics event.
2. Put that logic in one shared helper, for example `src/lib/analytics/visitorIdentity.ts`.
3. Make both page analytics and anonymous comment flows use the same helper.
4. If FingerprintJS is still useful for abuse heuristics, keep it separate. Do **not** replace the canonical cookie later with the FingerprintJS value.

### Why this is the right tradeoff

- Retention does not require probabilistic fingerprinting.
- A stable first-party visitor key is enough for trend analysis.
- It is simpler, faster, and easier to reason about.
- It makes `page_analytics_visits`, `comments`, and future profile attribution joinable.

### Files affected

- `src/routes/+layout.svelte`
- `src/lib/components/molecules/Interact.svelte`
- `src/lib/components/blog/BlogInteract.svelte`
- Any other place still generating its own visitor identifier independently

## Architecture decision: first touch + visitor-day facts + cohort rollup

We are **not** going to compute retention by repeatedly scanning raw `page_analytics_visits` for each dashboard request.

We are going to materialize three small layers:

1. **`visitor_first_touch`**: one row per visitor.
2. **`visitor_day_activity`**: one row per visitor per local day.
3. **`daily_visitor_cohorts`**: one row per cohort date + segment.

This is the minimum structure that survives the 90-day raw-telemetry cleanup and still keeps the admin page fast.

## Schema additions

> Prefer two migrations instead of one monolith:
>
> - `supabase/migrations/20260408_visitor_identity_and_activity.sql`
> - `supabase/migrations/20260408_retention_rollups_and_rpcs.sql`

### 1. `visitor_first_touch`

Permanent source of truth for "where did this visitor first enter?"

```sql
CREATE TABLE IF NOT EXISTS public.visitor_first_touch (
    fingerprint TEXT PRIMARY KEY,
    first_visit_at TIMESTAMPTZ NOT NULL,
    first_visit_date DATE NOT NULL,
    first_path TEXT NOT NULL,
    first_landing_query TEXT NULL,
    first_path_group TEXT NOT NULL,
    first_content_type TEXT NOT NULL,
    first_content_slug TEXT NULL,
    first_referrer_host TEXT NULL,
    first_utm_source TEXT NULL,
    first_utm_medium TEXT NULL,
    first_utm_campaign TEXT NULL,
    first_utm_term TEXT NULL,
    first_utm_content TEXT NULL,
    first_click_id_type TEXT NULL,
    first_click_id_value TEXT NULL,
    first_acquisition_source TEXT NOT NULL,
    first_entry_surface TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visitor_first_touch_visit_date
    ON public.visitor_first_touch (first_visit_date DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_first_touch_surface_date
    ON public.visitor_first_touch (first_entry_surface, first_visit_date DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_first_touch_source_date
    ON public.visitor_first_touch (first_acquisition_source, first_visit_date DESC);
```

### 2. `visitor_day_activity`

Permanent daily fact table used by retention and activation queries.

```sql
CREATE TABLE IF NOT EXISTS public.visitor_day_activity (
    fingerprint TEXT NOT NULL,
    activity_date DATE NOT NULL,
    visit_count INT NOT NULL DEFAULT 0,
    session_count INT NOT NULL DEFAULT 0,
    engaged_ms_total INT NOT NULL DEFAULT 0,
    engaged_session_count INT NOT NULL DEFAULT 0,
    comment_count INT NOT NULL DEFAULT 0,
    signup_count INT NOT NULL DEFAULT 0,
    registration_count INT NOT NULL DEFAULT 0,
    first_path TEXT NULL,
    last_path TEXT NULL,
    refreshed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (fingerprint, activity_date)
);

CREATE INDEX IF NOT EXISTS idx_visitor_day_activity_date
    ON public.visitor_day_activity (activity_date DESC);
```

### 3. First-touch columns on `profiles`

We still want permanent attribution on the user record, plus a durable join back to the originating visitor.

```sql
ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS first_touch_fingerprint TEXT NULL,
    ADD COLUMN IF NOT EXISTS first_visit_at TIMESTAMPTZ NULL,
    ADD COLUMN IF NOT EXISTS first_landing_path TEXT NULL,
    ADD COLUMN IF NOT EXISTS first_referrer_host TEXT NULL,
    ADD COLUMN IF NOT EXISTS first_acquisition_source TEXT NULL,
    ADD COLUMN IF NOT EXISTS first_entry_surface TEXT NULL;
```

### 4. First-touch columns on `signups`

The current `signups` table cannot be tied back to acquisition or cohorts because it does not store a visitor key. Fix that.

```sql
ALTER TABLE public.signups
    ADD COLUMN IF NOT EXISTS first_touch_fingerprint TEXT NULL,
    ADD COLUMN IF NOT EXISTS first_visit_at TIMESTAMPTZ NULL,
    ADD COLUMN IF NOT EXISTS first_landing_path TEXT NULL,
    ADD COLUMN IF NOT EXISTS first_referrer_host TEXT NULL,
    ADD COLUMN IF NOT EXISTS first_acquisition_source TEXT NULL,
    ADD COLUMN IF NOT EXISTS first_entry_surface TEXT NULL;
```

### 5. `daily_visitor_cohorts`

Small aggregate table for admin reads.

```sql
CREATE TABLE IF NOT EXISTS public.daily_visitor_cohorts (
    cohort_date DATE NOT NULL,
    entry_surface TEXT NOT NULL,
    acquisition_source TEXT NOT NULL,
    cohort_size INT NOT NULL DEFAULT 0,
    commented_d0 INT NOT NULL DEFAULT 0,
    commented_within_d7 INT NOT NULL DEFAULT 0,
    signed_up_d0 INT NOT NULL DEFAULT 0,
    signed_up_within_d7 INT NOT NULL DEFAULT 0,
    registered_d0 INT NOT NULL DEFAULT 0,
    registered_within_d7 INT NOT NULL DEFAULT 0,
    engaged_d0 INT NOT NULL DEFAULT 0,
    engaged_within_d7 INT NOT NULL DEFAULT 0,
    retained_d1 INT NOT NULL DEFAULT 0,
    retained_d3 INT NOT NULL DEFAULT 0,
    retained_d7 INT NOT NULL DEFAULT 0,
    retained_d14 INT NOT NULL DEFAULT 0,
    retained_d30 INT NOT NULL DEFAULT 0,
    refreshed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (cohort_date, entry_surface, acquisition_source)
);
```

## DB helpers and refresh jobs

### Helper functions

Add four small helpers in the migration:

```sql
public.analytics_local_date(ts TIMESTAMPTZ) RETURNS DATE
public.normalize_acquisition_source(referrer_host TEXT) RETURNS TEXT
public.normalize_entry_surface(path TEXT, content_type TEXT) RETURNS TEXT
public.extract_first_touch_attribution(
    p_landing_query TEXT,
    p_referrer_host TEXT
) RETURNS JSONB
```

`analytics_local_date()` should explicitly use `America/New_York` so cohort dates stay stable and explainable.

### Write-path function

`record_visitor_first_touch(...)`

- Called from `upsert_page_analytics_visit`.
- Idempotent: `ON CONFLICT (fingerprint) DO NOTHING`.
- Must use the visit row's timestamp, not a fresh unrelated `NOW()` call.
- Must persist raw first-touch attribution fields as well as the normalized acquisition bucket.

### Refresh functions

`refresh_visitor_day_activity(p_from DATE DEFAULT NULL, p_to DATE DEFAULT NULL)`

- Recomputes a date range into `visitor_day_activity`.
- Default window: trailing 45 local days.
- Reads from `page_analytics_visits`, `page_analytics_sessions`, `comments`, `signups`, and `profiles`.
- This is the layer that bridges the 90-day raw retention limit.

`refresh_daily_visitor_cohorts(p_from DATE DEFAULT NULL, p_to DATE DEFAULT NULL)`

- Reads from `visitor_first_touch` + `visitor_day_activity`.
- Recomputes the selected cohort date range.
- Default window: trailing 35 local days.
- Read-side queries hit this table, not raw pageview tables.
- Rollups must count three milestone families separately: comment, email signup, and registered account.

### Cron schedule

Create a wrapper function such as `public.refresh_retention_rollups()` that calls both refreshes, then schedule that wrapper daily after the local day has fully closed.

```sql
SELECT cron.schedule(
    'refresh_retention_rollups_nightly',
    '15 9 * * *',
    $$SELECT public.refresh_retention_rollups();$$
);
```

`09:15 UTC` is safely after midnight `America/New_York` year-round.

## Profile attribution: do it lazily on the first authenticated request

Do **not** rely on `src/routes/register/+page.server.ts` for first-touch attachment.

### Add RPC

```sql
public.attach_profile_first_touch(
    p_profile_id UUID,
    p_fingerprint TEXT
) RETURNS BOOLEAN
```

Behavior:

- Copy `first_touch_fingerprint`, `first_visit_at`, `first_path`, `first_referrer_host`, `first_acquisition_source`, and `first_entry_surface` from `visitor_first_touch` into `profiles`.
- No-op if the profile already has `first_visit_at`.
- Return `FALSE` if no `visitor_first_touch` row exists.

### Call site

Call it from `src/routes/+layout.server.ts` when:

- `session.user.id` exists
- `cookies.get('9tfingerprint')` exists
- `profiles.first_visit_at IS NULL`

This is safer because:

- the user is already authenticated
- the cookie is available
- the write can be idempotent
- signup/login/confirmation flows stay simple

## Signup attribution: attach first touch at email capture time

Add a companion helper:

```sql
public.attach_signup_first_touch(
    p_signup_id BIGINT,
    p_fingerprint TEXT
) RETURNS BOOLEAN
```

Behavior:

- Copy `first_touch_fingerprint`, `first_visit_at`, `first_path`, `first_referrer_host`, `first_acquisition_source`, and `first_entry_surface` from `visitor_first_touch` into `signups`.
- No-op if the signup row already has `first_touch_fingerprint`.

Call it from `src/routes/email/+page.server.ts` by changing the `submit` action to read `cookies.get('9tfingerprint')` and attach first-touch metadata after a successful insert.

## Dashboard scope: keep v1 tight

The earlier draft had a few useful ideas, but v1 should only include views that directly drive growth decisions.

### New tab in `/admin/analytics`

Reuse the existing admin tab styling pattern already used elsewhere in admin routes. Do **not** invent a new `TabBar` abstraction unless the page actually needs it.

Two tabs:

1. **Pageviews** (existing)
2. **Cohorts & Sources** (new)

### "Cohorts & Sources" layout

1. **Entry-surface overview table**

   Columns:
   - Entry surface
   - New visitors
   - Comment within 7d
   - Email signup within 7d
   - Registered within 7d
   - D1 return
   - D7 return
   - D30 return
   - Avg engaged minutes

   Rules:
   - Default range: last 8 completed weeks, then expand to 12 once enough history exists
   - Show count + percentage
   - Hide or mute D7/D30 when the cohort window is not mature
   - Add a low-sample warning when denominator `< 25`

2. **Retention curve**
   - Weekly aggregation by default
   - Days shown: 1, 3, 7, 14, 30
   - Filterable by entry surface and acquisition source

3. **Acquisition mix by week**
   - Weekly stacked bars
   - Split by normalized `acquisition_source`
   - Click segment to filter the rest of the tab

4. **First-session next paths**
   - For visitors entering on the selected surface
   - Compute the **second pageview in the first session**, not the second pageview ever
   - Columns: next path, visitor count, share of first sessions, avg engaged ms on that step

### Views explicitly deferred to v2

- Top dwell visitors
- Per-content-slug retention
- Arbitrary cohort builders
- Experiment-specific overlays beyond first-touch/source/surface

## `/admin` home dashboard cleanup

Replace the misleading `activeUsers` card with explicit metrics:

1. **New visitors this week**
2. **First-comment rate, last full cohort week**
3. **Email-signup rate, last full cohort week**
4. **Registered-account rate, last full cohort week**
5. **D7 retention, last full cohort week**

If you still want the contributor count, keep it as a separate "Active contributors this week" metric and label it honestly.

## Read-side RPCs

Add the minimum read layer needed by the admin screens:

| RPC                                                                                                   | Purpose                                                               |
| ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `get_entry_surface_overview(p_from DATE, p_to DATE)`                                                  | Overview table, aggregated only across mature cohorts where relevant. |
| `get_cohort_retention_curve(p_from DATE, p_to DATE, p_entry_surface TEXT, p_acquisition_source TEXT)` | Returns numerator, denominator, and pct for D1 / D3 / D7 / D14 / D30. |
| `get_acquisition_mix_by_week(p_from DATE, p_to DATE, p_entry_surface TEXT)`                           | Weekly new-visitor counts by acquisition source.                      |
| `get_first_session_next_paths(p_from DATE, p_to DATE, p_entry_surface TEXT, p_limit INT)`             | Second pageview in the first session for first-touch cohorts.         |
| `get_admin_retention_summary(p_anchor_date DATE)`                                                     | Small summary payload for `/admin` home cards.                        |

All of these should be `SECURITY DEFINER`, `STABLE`, and set `search_path = public`.

## Backfill plan

### Step 1: fix canonical visitor identity

Ship Phase 0 first. New data collected after this point is trustworthy.

Add a small admin note such as:

> Identity normalized on `YYYY-MM-DD`. Cohorts before this date are directional, especially for activation and signup attribution.

### Step 2: backfill first touch from current raw pageviews

One-time backfill from `2026-02-20` forward:

```sql
INSERT INTO public.visitor_first_touch (
    fingerprint,
    first_visit_at,
    first_visit_date,
    first_path,
    first_path_group,
    first_content_type,
    first_content_slug,
    first_referrer_host,
    first_acquisition_source,
    first_entry_surface
)
SELECT DISTINCT ON (v.fingerprint)
    v.fingerprint,
    v.started_at,
    public.analytics_local_date(v.started_at),
    v.path,
    v.path_group,
    COALESCE(v.content_type, 'other'),
    v.content_slug,
    v.referrer_host,
    public.normalize_acquisition_source(v.referrer_host),
    public.normalize_entry_surface(v.path, v.content_type)
FROM public.page_analytics_visits v
WHERE COALESCE(BTRIM(v.fingerprint), '') <> ''
  AND NOT public.is_analytics_utility_path(v.path)
ORDER BY v.fingerprint, v.started_at ASC
ON CONFLICT (fingerprint) DO NOTHING;
```

Historical backfill can only recover referrer-host-based acquisition. Old `page_analytics_visits` rows do not contain raw query-string, UTM, or click-id fields, so those richer attribution fields will only be complete from the new instrumentation cutover forward.

### Step 3: backfill daily activity and cohorts

```sql
SELECT public.refresh_visitor_day_activity('2026-02-20'::DATE, CURRENT_DATE);
SELECT public.refresh_daily_visitor_cohorts('2026-02-20'::DATE, CURRENT_DATE);
```

### Step 4: extend raw telemetry retention to 90 days

Patch `supabase/migrations/20260328_reduce_self_generated_usage.sql` behavior in a new migration so:

- `page_analytics_visits` retention becomes 90 days
- `page_analytics_sessions` retention follows the same 90-day horizon where appropriate

### Important note

Because raw pageviews will still be pruned after 90 days, the permanent truth after cutover is:

- `visitor_first_touch`
- `visitor_day_activity`
- `daily_visitor_cohorts`

Those tables must be retained indefinitely.

## Verification checklist

This work is not done when the migration applies. It is done when the joins are trustworthy.

### Identity checks

- New anonymous visit creates one stable `9tfingerprint` cookie before the first pageview RPC.
- The same visitor's first comment uses the same value as the pageview row.
- A revisit on the next day still uses the same value.

### Data checks

- `visitor_first_touch` row count grows roughly with new visitors, not pageviews.
- `visitor_day_activity` has one row per visitor/day, not multiple duplicates.
- `daily_visitor_cohorts.cohort_size` matches `visitor_first_touch` counts for the same date/segment.
- D1 and D7 percentages ignore immature cohorts.

### Product checks

- A visitor landing on `/personality-analysis/[slug]` from Google shows up under `people` + `search/google`.
- If that visitor comments on day 0, `commented_d0` increases for that cohort.
- If that visitor submits an email signup on day 0 or day 7, the corresponding signup metric increments for that cohort.
- If that visitor returns on day 7, `retained_d7` increments after the next refresh.
- If that visitor registers, `profiles.first_*` fields populate on the first authenticated request and the registration metric increments for that cohort.

## Rollout phases

### Phase 0 - identity hygiene (same day)

- [ ] Add shared visitor-identity helper.
- [ ] Make analytics + anonymous comments use the same visitor key.
- [ ] Spot-check pageview/comment joins in production.

### Phase 1 - write path + backfill (1 to 2 days)

- [ ] Add `visitor_first_touch`, `visitor_day_activity`, `daily_visitor_cohorts`, `profiles.first_*`, and `signups.first_*` columns.
- [ ] Add normalization helpers, raw first-touch attribution capture, `attach_profile_first_touch`, and `attach_signup_first_touch`.
- [ ] Patch `upsert_page_analytics_visit` to call `record_visitor_first_touch`.
- [ ] Patch email signup flow to attach `signups` to the same visitor key.
- [ ] Extend raw telemetry cleanup from 60 days to 90 days.
- [ ] Backfill first touch, daily activity, and cohorts.
- [ ] Regenerate `database.types.ts`.

### Phase 2 - read path + admin UI (1 to 2 days)

- [ ] Add the read RPCs.
- [ ] Extend `src/routes/admin/analytics/+page.server.ts`.
- [ ] Build the "Cohorts & Sources" tab in `src/routes/admin/analytics/+page.svelte`.
- [ ] Replace `/admin` `activeUsers` with honest retention metrics.

### Phase 3 - experiment overlays (after Experiment A)

- [ ] Add experiment-segment filters on top of the same first-touch/cohort model.
- [ ] Do **not** explode the base rollup key with experiment columns until Experiment A is actually live and decision-relevant.

## Decisions locked

1. **Raw telemetry retention:** extend from 60 days to 90 days.
2. **Activation ladder:** measure three milestones separately: first comment, first email signup, and first registered account.
3. **Admin default view:** weekly cohorts by default.
4. **Acquisition bucketing:** use first-touch raw attribution inputs with precedence `UTM > click-id > referrer host > direct`, and keep the raw fields for re-bucketing later.

## Success criteria

This plan is successful when:

- [ ] `/admin/analytics` can show D1 / D7 / D30 retention by entry surface and acquisition source without ad hoc SQL.
- [ ] The metrics are based on a stable visitor identity, not mixed fallback IDs.
- [ ] The admin surface can also show first-comment, email-signup, and account-registration rates for the same weekly cohorts.
- [ ] Immature cohorts do not silently drag down D7 / D30.
- [ ] `/admin` stops using `activeUsers` as a vague stand-in for retention.
- [ ] Experiment A can plug into the same model without re-architecting retention again.
