-- supabase/migrations/20261010120000_inline_analytics_helpers.sql
-- Speed up /admin/analytics (every tab) by letting the planner inline the per-row helpers.
--
-- Why: 20260903230508_security_rls_storage_rpc.sql added `SET search_path` to
-- is_analytics_utility_path, analytics_scope_match, analytics_local_date and
-- analytics_normalize_content_slug. A SQL function with a SET clause is never inlined, so
-- every analytics query began paying a real function call (search_path switch included,
-- ~25us) per helper, per visit row. With ~65k rows in page_analytics_visits that is 1.4s for
-- one helper and far more where two or three stack up.
--
-- Measured on prod as the signed-in admin, warm (2026-10-10 before -> 2026-10-11 after):
--   get_first_session_next_paths               16-20s    -> 0.85s
--   get_page_analytics_timing_heatmap          4-8s      -> 0.4s
--   get_content_release_performance (30 days)  4-6s      -> 0.02s  (cache, see 3)
--   private.get_content_release_performance    2-7s      -> 0.75s
--   get_page_analytics_pages_sorted_windowed   1.5s      -> 0.33s
--   get_page_analytics_top_pages_timeseries    1.6s      -> 0.14s
--   get_page_analytics_timeseries              1.4s      -> 0.26s
--   get_page_analytics_pages_by_duration       1.4s      -> 0.15s
--   get_page_analytics_overview                1.5s      -> 0.14s
--   get_page_analytics_trending_pages          0.4-0.55s -> 0.06s
-- The `authenticated` role has an 8s statement timeout, so the first one never finished: the
-- Acquisition & Retention tab waited 8s and then rendered without its next-path data.
--
-- 1. The four helpers are redefined with SQL-standard bodies (RETURN ...) and no SET clause,
--    which is how they were (inlinable) when the analytics queries were tuned in August.
--    A SQL-standard body is parsed when the function is created, so each operator below is
--    bound to its pg_catalog definition at that moment and the caller's search_path no longer
--    affects it. That is the protection the SET clause was added for, without blocking
--    inlining. Results are unchanged (same expressions, checked row by row on prod).
--
--    DO NOT add `SET search_path` (or any SET clause) back to these four. Supabase's linter
--    (0011_function_search_path_mutable) only checks for the clause, so it lists them again;
--    that is expected. src/lib/server/analyticsHelperInlining.spec.ts guards this.
--
--    All four, not some: with only three inlined, plans that used to be dominated by the
--    utility-path call switched to hashing every people visit through the still-slow slug
--    helper (get_content_release_growth_curve went 74ms -> 1.5s).
--
-- 2. get_first_session_next_paths is planned per call with its real arguments. As a
--    LANGUAGE sql function it ran one generic plan that assumes its optional filters leave
--    ~2 visitors (really ~33k), and once the utility-path predicate was inlined that plan
--    probed idx_page_visits_nonutility_utc_day_fingerprint by its second column once per
--    visitor: a full index scan each, minutes in total. RETURN QUERY EXECUTE ... USING plans
--    with the argument values, the same fix 20260812010200 applied to trending pages. The
--    query text is unchanged.
--
-- 3. get_content_release_performance answered only unfiltered requests from the hourly cache
--    (private.content_release_performance_cache, the newest 200 releases). The admin page
--    always sends a date range, so its default view ran the full calculation on every open.
--    A date range that sits entirely inside the cached window now reads the cache too; the
--    rows are identical to the full calculation for those ranges (compared on prod). Older
--    ranges, and ranges with no lower bound, still run the full calculation.

CREATE OR REPLACE FUNCTION public.is_analytics_utility_path(p_path TEXT)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
RETURN (
	COALESCE(p_path, '') = ''
	OR p_path ~ '^/(admin|api)(/|$)'
	OR p_path = '/logout'
	OR p_path LIKE '/account/unsubscribe%'
);

CREATE OR REPLACE FUNCTION public.analytics_scope_match(
	p_scope TEXT,
	p_path TEXT,
	p_content_type TEXT
)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
RETURN (
	CASE
		WHEN COALESCE(p_scope, 'all') = 'all' THEN TRUE
		WHEN p_scope = 'blog' THEN (
			p_path LIKE '/personality-analysis%'
			OR p_path LIKE '/community%'
			OR p_path LIKE '/how-to-guides%'
			OR p_path LIKE '/enneagram-corner%'
			OR p_path LIKE '/pop-culture%'
			OR p_path LIKE '/blog%'
		)
		WHEN p_scope = 'people' THEN COALESCE(p_content_type, '') = 'people'
		WHEN p_scope = 'community' THEN COALESCE(p_content_type, '') = 'community'
		WHEN p_scope = 'guides' THEN COALESCE(p_content_type, '') = 'guides'
		WHEN p_scope = 'enneagram' THEN COALESCE(p_content_type, '') = 'enneagram'
		WHEN p_scope = 'pop-culture' THEN COALESCE(p_content_type, '') = 'pop-culture'
		WHEN p_scope = 'question' THEN COALESCE(p_content_type, '') = 'question'
		WHEN p_scope = 'other' THEN COALESCE(p_content_type, '') = 'other'
		ELSE TRUE
	END
);

CREATE OR REPLACE FUNCTION public.analytics_local_date(p_ts TIMESTAMPTZ)
RETURNS DATE
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
RETURN (timezone('America/New_York', p_ts))::DATE;

CREATE OR REPLACE FUNCTION public.analytics_normalize_content_slug(p_slug TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
RETURN LOWER(REGEXP_REPLACE(COALESCE(NULLIF(BTRIM(p_slug), ''), ''), '\s+', '-', 'g'));

-- idx_page_visits_normalized_content_slug_started_at is built on the slug helper. The planner
-- matches a query against the inlined form of an index expression, and each session caches
-- that form the first time it opens the index. Resetting an option that was never set changes
-- nothing about the index but makes every session reload it, so sessions that opened it
-- before this migration keep using it. (Takes a lock that does not block reads or writes.)
ALTER INDEX public.idx_page_visits_normalized_content_slug_started_at RESET (fillfactor);

CREATE OR REPLACE FUNCTION public.get_first_session_next_paths(
	p_from DATE DEFAULT NULL,
	p_to DATE DEFAULT NULL,
	p_entry_surface TEXT DEFAULT NULL,
	p_limit INTEGER DEFAULT 10,
	p_acquisition_source TEXT DEFAULT NULL
)
RETURNS TABLE(
	next_path TEXT,
	visitor_count BIGINT,
	share_pct NUMERIC,
	avg_engaged_ms INTEGER
)
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $function$
BEGIN
	-- $1 p_from, $2 p_to, $3 p_entry_surface, $4 p_limit, $5 p_acquisition_source
	RETURN QUERY EXECUTE $query$
	WITH bounds AS (
		SELECT
			COALESCE($1, public.analytics_local_date(NOW()) - 56) AS from_date,
			COALESCE($2, public.analytics_local_date(NOW()) - 1) AS to_date
	),
	cohort_visitors AS (
		SELECT v.fingerprint
		FROM public.visitor_first_touch v
		CROSS JOIN bounds b
		WHERE v.first_visit_date BETWEEN b.from_date AND b.to_date
			AND (
				COALESCE(BTRIM($3), '') = ''
				OR v.first_entry_surface = $3
			)
			AND (
				COALESCE(BTRIM($5), '') = ''
				OR v.first_acquisition_source = $5
			)
	),
	first_session AS (
		SELECT DISTINCT ON (v.fingerprint)
			v.fingerprint,
			v.session_id
		FROM public.page_analytics_visits v
		INNER JOIN cohort_visitors c
			ON c.fingerprint = v.fingerprint
		WHERE NOT public.is_analytics_utility_path(v.path)
		ORDER BY v.fingerprint, v.started_at ASC, v.id ASC
	),
	session_steps AS (
		SELECT
			fs.fingerprint,
			v.path,
			v.engaged_ms,
			ROW_NUMBER() OVER (
				PARTITION BY v.session_id
				ORDER BY v.started_at ASC, v.id ASC
			) AS session_step
		FROM first_session fs
		INNER JOIN public.page_analytics_visits v
			ON v.session_id = fs.session_id
		WHERE NOT public.is_analytics_utility_path(v.path)
	),
	session_base AS (
		SELECT COUNT(*)::BIGINT AS first_session_count
		FROM first_session
	)
	SELECT
		s.path AS next_path,
		COUNT(*)::BIGINT AS visitor_count,
		CASE
			WHEN sb.first_session_count > 0
			THEN ROUND(COUNT(*)::NUMERIC / sb.first_session_count::NUMERIC * 100, 2)
			ELSE 0
		END AS share_pct,
		COALESCE(ROUND(AVG(s.engaged_ms))::INT, 0) AS avg_engaged_ms
	FROM session_steps s
	CROSS JOIN session_base sb
	WHERE s.session_step = 2
	GROUP BY s.path, sb.first_session_count
	ORDER BY visitor_count DESC, next_path ASC
	LIMIT LEAST(GREATEST(COALESCE($4, 10), 1), 50)
	$query$
	USING p_from, p_to, p_entry_surface, p_limit, p_acquisition_source;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_content_release_performance(
	p_from_date DATE DEFAULT NULL,
	p_to_date DATE DEFAULT NULL,
	p_limit INTEGER DEFAULT 50
)
RETURNS TABLE(
	id BIGINT,
	slug TEXT,
	path TEXT,
	title TEXT,
	published_at TIMESTAMPTZ,
	first_view_at TIMESTAMPTZ,
	minutes_to_first_view INTEGER,
	views_1h BIGINT,
	views_6h BIGINT,
	views_24h BIGINT,
	unique_24h BIGINT,
	views_7d BIGINT,
	unique_7d BIGINT,
	views_30d BIGINT,
	unique_30d BIGINT,
	total_views BIGINT,
	total_unique_visitors BIGINT,
	avg_time_on_page_ms INTEGER,
	median_time_on_page_ms INTEGER,
	avg_scroll_pct INTEGER,
	bounce_rate NUMERIC,
	views_24h_percentile NUMERIC,
	views_7d_percentile NUMERIC,
	views_30d_percentile NUMERIC,
	benchmark_score NUMERIC,
	benchmark_sample_size INTEGER,
	benchmark_basis TEXT,
	performance_band TEXT,
	release_stage TEXT,
	growth_slope_7d NUMERIC,
	decay_rate_after_spike NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
DECLARE
	-- Row cap of private.refresh_content_release_performance_cache().
	c_cache_capacity CONSTANT INTEGER := 200;
	v_cached_rows INTEGER;
	v_cache_floor DATE;
BEGIN
	IF COALESCE((SELECT auth.jwt() ->> 'role'), '') <> 'service_role'
		AND NOT EXISTS (
			SELECT 1
			FROM public.profiles p
			WHERE p.id = (SELECT auth.uid())
				AND p.admin IS TRUE
		)
	THEN
		RAISE EXCEPTION 'admin access required';
	END IF;

	SELECT
		COUNT(*)::INTEGER,
		public.analytics_local_date(MIN(c.published_at))
	INTO v_cached_rows, v_cache_floor
	FROM private.content_release_performance_cache c;

	-- The cache holds the newest releases by published_at. It can answer:
	--   * an unfiltered request (the newest rows are exactly what it stores);
	--   * any request when it is not full, because then it holds every release;
	--   * a range starting after its oldest publish date. That date itself may be cut off by
	--     the row cap, so a range starting on it runs the full calculation.
	IF v_cached_rows > 0
		AND (
			(p_from_date IS NULL AND p_to_date IS NULL)
			OR v_cached_rows < c_cache_capacity
			OR (p_from_date IS NOT NULL AND p_from_date > v_cache_floor)
		)
	THEN
		RETURN QUERY
		SELECT
			c.id,
			c.slug,
			c.path,
			c.title,
			c.published_at,
			c.first_view_at,
			c.minutes_to_first_view,
			c.views_1h,
			c.views_6h,
			c.views_24h,
			c.unique_24h,
			c.views_7d,
			c.unique_7d,
			c.views_30d,
			c.unique_30d,
			c.total_views,
			c.total_unique_visitors,
			c.avg_time_on_page_ms,
			c.median_time_on_page_ms,
			c.avg_scroll_pct,
			c.bounce_rate,
			c.views_24h_percentile,
			c.views_7d_percentile,
			c.views_30d_percentile,
			c.benchmark_score,
			c.benchmark_sample_size,
			c.benchmark_basis,
			c.performance_band,
			c.release_stage,
			c.growth_slope_7d,
			c.decay_rate_after_spike
		FROM private.content_release_performance_cache c
		WHERE (p_from_date IS NULL OR public.analytics_local_date(c.published_at) >= p_from_date)
			AND (p_to_date IS NULL OR public.analytics_local_date(c.published_at) <= p_to_date)
		ORDER BY c.published_at DESC, c.id DESC
		LIMIT LEAST(GREATEST(COALESCE(p_limit, 50), 1), 200);
		RETURN;
	END IF;

	RETURN QUERY
	SELECT *
	FROM private.get_content_release_performance(p_from_date, p_to_date, p_limit);
END;
$$;

REVOKE ALL ON FUNCTION public.get_content_release_performance(DATE, DATE, INTEGER)
	FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_content_release_performance(DATE, DATE, INTEGER)
	TO authenticated, service_role;
