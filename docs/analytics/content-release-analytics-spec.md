<!-- docs/analytics/content-release-analytics-spec.md -->

# Content Release Analytics Spec

Created: 2026-04-12

## Goal

Make 9takes analytics useful for content timing, release performance, and blog growth analysis.

The main questions this system should answer:

- What time of day and day of week bring the most visitors?
- Which blogs get the most traffic after release?
- How long does a new personality analysis take to get its first view?
- How do views accumulate during the first hour, day, week, and month?
- Which releases are above normal, near normal, or below normal?
- Which source, referrer, or campaign patterns correlate with stronger releases?
- Which content updates, newsletters, social posts, or sitemap/indexing events correlate with spikes?

## Current State

9takes already has a first-party analytics system.

Raw page visits are stored in `page_analytics_visits` with:

- `started_at`
- `ended_at`
- `path`
- `path_group`
- `content_type`
- `content_slug`
- `fingerprint`
- `user_id`
- `referrer_host`
- `engaged_ms`
- `max_scroll_pct`
- `is_exit`

Sessions are stored in `page_analytics_sessions` with:

- `session_key`
- `fingerprint`
- `entry_path`
- `exit_path`
- `page_count`
- `started_at`
- `last_seen_at`
- `ended_at`

The client already sends UTM and click-id fields on page views. The latest first-touch system uses those fields for visitor acquisition attribution, but raw per-visit analytics should also persist them so individual content releases can be analyzed by source over time.

The admin analytics page already has:

- Overall visits and unique visitors.
- Daily visit timeseries.
- Page breakdown tables.
- Top pages this week/month.
- Top pages over time.
- Acquisition and retention cohorts.

## Implementation Status

- Phase 1 raw-data reports are implemented.
- Phase 2 durable content rollups are implemented in the next migration:
  - `content_analytics_daily`
  - `refresh_content_analytics_daily`
  - cleanup refresh before raw visit deletion
  - release performance/growth RPCs backed by daily rollups plus raw data for unrolled recent days
- Phase 3 event correlation is implemented for personality releases:
  - `record_content_release_event`
  - `get_content_release_event_impact`
  - admin API support for fetching and recording release events
  - Release Performance event impact panel
  - database-level admin guard and direct table access lockdown for release events
- Phase 4 release benchmarks are implemented for personality releases:
  - 24h, 7d, and 30d percentile benchmarks
  - composite benchmark score and basis
  - 7-day growth slope
  - post-launch decay after week 1
  - benchmark comparisons use all mature releases, not only the visible date filter

## Gaps

### 1. Release timestamps are implicit

Personality publishing currently updates `date`, `lastmod`, and historically used `created_at` as a publish timestamp. This works for some analysis but overloads `created_at`.

Recommendation:

- Add `published_at`.
- Add `first_published_at`.
- Keep `date` for public/frontmatter date.
- Stop relying on `created_at` for release analytics.

### 2. No release-cohort analytics

Current page analytics rank pages inside calendar windows. They do not normalize by “time since publish.”

Recommendation:

- Add release-performance RPCs that join personality posts to visits by content slug.
- Measure first view, first hour, first 6 hours, first 24 hours, first 7 days, and first 30 days.
- Compare releases against the distribution of previous mature releases.

### 3. No day/hour trend report

The raw timestamps support this, but no admin report exposes it.

Recommendation:

- Add a day-of-week x hour-of-day heatmap using `America/New_York` local time.
- Keep filters aligned with existing analytics scopes.

### 4. Raw visits are retained for only 90 days

The telemetry cleanup keeps raw visits bounded. This is good operationally, but release curves need durable history.

Recommendation:

- Add daily content analytics rollups in a later phase.
- Refresh rollups before raw visit cleanup.

### 5. Release events are not recorded

Publishing, sitemap generation, newsletter sends, social posts, and major internal-link updates should become explicit events.

Recommendation:

- Keep `content_release_events` as the source of release actions.
- Automatically record `published`/`republished`.
- Record operational events such as `sitemap_generated`, `newsletter_sent`, `social_posted`, `major_update`, and `internal_links_added` through the admin event API until the specific scripts/integrations are wired directly.

## Phase Plan

### Phase 1: Raw-Data Reports

Purpose: get useful reports quickly from existing visit data.

Deliverables:

- Add `published_at` and `first_published_at` to `blogs_famous_people`.
- Update the personality publish script to set explicit publish timestamps.
- Record a `published` or `republished` event when the personality publish script runs.
- Store UTM/click-id/acquisition fields on raw page visits.
- Add traffic timing RPC:
  - visits by local day of week and hour.
  - unique visitors by local day of week and hour.
  - average engagement by local day of week and hour.
- Add release performance RPC:
  - first view timestamp.
  - minutes to first view.
  - views/uniques in 1h, 6h, 24h, 7d, 30d.
  - total views/uniques since publish.
  - average engagement, median engagement, scroll, bounce.
  - 7-day percentile and performance band.
- Add release growth RPC:
  - day number since publish.
  - daily visits.
  - daily unique visitors.
  - cumulative visits.
  - cumulative unique visitors.
- Add admin API endpoints for timing and releases.
- Add admin UI tabs for:
  - Traffic Timing.
  - Release Performance.

### Phase 2: Durable Rollups

Purpose: preserve analytics past raw visit retention.

Recommended table: `content_analytics_daily`.

Fields:

- `metric_date`
- `content_type`
- `content_slug`
- `path`
- `published_at`
- `days_since_publish`
- `visits`
- `unique_visitors`
- `engaged_ms_total`
- `avg_engaged_ms`
- `median_engaged_ms`
- `bounce_rate`
- `avg_scroll_pct`
- `source_breakdown`
- `referrer_breakdown`
- `created_at`
- `updated_at`

Refresh strategy:

- Refresh the last 45 days daily.
- Refresh before telemetry cleanup runs.
- Keep raw visits at 90 days, but keep rollups indefinitely.

### Phase 3: Event Correlation

Purpose: correlate spikes with known publishing and promotion events.

Use `content_release_events`.

Recommended event types:

- `published`
- `republished`
- `sitemap_generated`
- `indexed`
- `newsletter_sent`
- `social_posted`
- `internal_links_added`
- `major_update`
- `title_meta_updated`
- `manual_note`

Reports:

- Views before/after event.
- Event-attributed lift versus prior 24h/7d baseline.
- Source mix changes after event.

Implemented:

- Event-impact RPC compares 7-day before/after windows for each release event.
- Release Performance detail panel shows event timing, before/after views, lift, and lift percentage.
- Admin API can record newsletter, social, sitemap, indexing, internal-link, major-update, title/meta, and manual-note events.

Remaining:

- Wire specific scripts/integrations to call `record_content_release_event` automatically when sitemap, newsletter, social, and internal-link actions happen.
- Add source-mix delta reporting after enough event data exists.

### Phase 4: Better Benchmarks

Purpose: make above/below norm classifications statistically useful.

Recommended metrics:

- First 24h percentile.
- First 7d percentile.
- First 30d percentile.
- Day 0-7 growth slope.
- Decay rate after initial spike.
- Engagement-adjusted performance score.
- Source-adjusted performance score.

Recommended banding:

- `collecting`: release is too new for benchmark window.
- `above_norm`: top quartile against mature comparable releases.
- `near_norm`: middle 50%.
- `below_norm`: bottom quartile.
- `insufficient_history`: too few mature releases to benchmark.

Implemented:

- Release Performance now reports 24h, 7d, and 30d percentiles when each release is old enough for that benchmark.
- `performance_band` is based on a composite benchmark score:
  - 24h only for releases older than 24 hours but younger than 7 days.
  - 24h + 7d for releases older than 7 days but younger than 30 days.
  - 24h + 7d + 30d for mature releases.
- Benchmark samples are calculated across all mature personality releases, independent of the admin date filter.
- Benchmark samples exclude releases published before durable launch-window data is available.
- Growth metrics include first-week daily slope and post-launch decay after week 1.

Remaining:

- Add engagement-adjusted performance scoring.
- Add source-adjusted performance scoring.
- Add category/type-specific benchmark cohorts once enough history exists per category.

### Phase 5: Content Pattern Analysis

Purpose: identify why some releases outperform.

Candidate dimensions:

- Enneagram type.
- Personality category/type tags.
- Content quality grade.
- Word count.
- Title length.
- Description length.
- Internal link count.
- Incoming internal link count.
- Social source mix.
- Search source mix.
- Release day/hour.
- Timeliness or news relevance.

Potential outputs:

- Best release windows by day/hour.
- Category-level release benchmarks.
- High-performing source/channel combinations.
- Blogs with strong views but weak engagement.
- Blogs with weak views but strong engagement.
- Blogs needing more internal links.

## Implementation Notes

- Use `America/New_York` for admin-facing daily/hourly analytics.
- Keep report RPCs `SECURITY DEFINER`, but grant execution only to roles that need them, such as `authenticated` for admin-session routes and `service_role` for server scripts; route-level admin checks still protect admin APIs.
- Writable/admin-only analytics RPCs should also enforce admin access in the database because authenticated users may be able to call Supabase RPCs directly.
- Avoid adding new raw-event volume unless it directly supports reporting.
- Prefer rollups for durable history rather than extending raw visit retention indefinitely.
- Keep initial reports read-only and additive.

## Open Questions

- Should release benchmarks compare only personality analysis blogs, or all blog types once static markdown blogs have explicit publish events?
- Should non-publish release events be manual from admin, automatic from scripts, or both?
- Should source mix use first-touch source, per-visit source, or both?
- Should bot/AI crawler traffic be included in content release analytics or split into a separate report?
