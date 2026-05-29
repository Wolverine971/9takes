-- supabase/migrations/20260529_backfill_acquisition_source.sql
-- Created: 2026-05-29
--
-- Fixes the analytics search-attribution bug surfaced in the personality-analysis performance
-- deep dive: ~43% of people visits had acquisition_source = NULL, and ~53% of visits with a clear
-- search-engine referrer were mis-bucketed into "other"/"unknown" because the daily rollup
-- (content_analytics_daily.source_breakdown) keys purely on acquisition_source. The column was added
-- 2026-04-12 and historical rows were never backfilled (only the 2026-05-14 AI migration touched a
-- subset). New rows are fine (ingest computes acquisition_source at insert via
-- normalize_acquisition_source, which never returns NULL), so this is a one-time historical backfill
-- plus a rollup refresh. Real organic-search share for people content was ~15%, not the ~7% the
-- dashboard showed.

-- 1. Backfill any visit missing an acquisition_source, deriving it from the referrer/utm/click data
--    we already store. normalize_acquisition_source recognizes google/bing/duckduckgo/yahoo-via-utm,
--    AI hosts, social, email, internal, and falls back to 'direct'/'other' — never NULL.
UPDATE public.page_analytics_visits
SET acquisition_source = public.normalize_acquisition_source(
	referrer_host,
	utm_source,
	utm_medium,
	click_id_type
)
WHERE acquisition_source IS NULL
	OR BTRIM(acquisition_source) = '';

-- 2. Same backfill for the first-touch attribution table.
UPDATE public.visitor_first_touch
SET first_acquisition_source = public.normalize_acquisition_source(
	first_referrer_host,
	first_utm_source,
	first_utm_medium,
	first_click_id_type
)
WHERE first_acquisition_source IS NULL
	OR BTRIM(first_acquisition_source) = '';

-- 3. Rebuild the people daily rollups across the full benchmark history so source_breakdown reflects
--    the corrected acquisition_source values (ON CONFLICT DO UPDATE overwrites the stale "unknown"-heavy
--    breakdowns). 2026-02-20 is the rollup epoch used by get_content_release_performance benchmarks.
SELECT public.refresh_content_analytics_daily(
	DATE '2026-02-20',
	public.analytics_local_date(NOW()),
	'people'
);
