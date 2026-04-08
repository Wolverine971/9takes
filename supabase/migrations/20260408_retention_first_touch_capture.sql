-- supabase/migrations/20260408_retention_first_touch_capture.sql
-- Adds canonical first-touch capture for retention instrumentation and extends
-- raw telemetry retention to 90 days.

ALTER TABLE public.profiles
	ADD COLUMN IF NOT EXISTS first_touch_fingerprint TEXT NULL,
	ADD COLUMN IF NOT EXISTS first_visit_at TIMESTAMPTZ NULL,
	ADD COLUMN IF NOT EXISTS first_landing_path TEXT NULL,
	ADD COLUMN IF NOT EXISTS first_referrer_host TEXT NULL,
	ADD COLUMN IF NOT EXISTS first_acquisition_source TEXT NULL,
	ADD COLUMN IF NOT EXISTS first_entry_surface TEXT NULL;

ALTER TABLE public.signups
	ADD COLUMN IF NOT EXISTS first_touch_fingerprint TEXT NULL,
	ADD COLUMN IF NOT EXISTS first_visit_at TIMESTAMPTZ NULL,
	ADD COLUMN IF NOT EXISTS first_landing_path TEXT NULL,
	ADD COLUMN IF NOT EXISTS first_referrer_host TEXT NULL,
	ADD COLUMN IF NOT EXISTS first_acquisition_source TEXT NULL,
	ADD COLUMN IF NOT EXISTS first_entry_surface TEXT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_first_touch_fingerprint
	ON public.profiles (first_touch_fingerprint)
	WHERE first_touch_fingerprint IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_signups_first_touch_fingerprint
	ON public.signups (first_touch_fingerprint)
	WHERE first_touch_fingerprint IS NOT NULL;

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

CREATE INDEX IF NOT EXISTS idx_visitor_first_touch_first_visit_date
	ON public.visitor_first_touch (first_visit_date DESC);

CREATE INDEX IF NOT EXISTS idx_visitor_first_touch_entry_surface
	ON public.visitor_first_touch (first_entry_surface, first_visit_date DESC);

CREATE INDEX IF NOT EXISTS idx_visitor_first_touch_acquisition_source
	ON public.visitor_first_touch (first_acquisition_source, first_visit_date DESC);

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
	engaged_ms_total_within_d7 BIGINT NOT NULL DEFAULT 0,
	refreshed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	PRIMARY KEY (cohort_date, entry_surface, acquisition_source)
);

CREATE INDEX IF NOT EXISTS idx_daily_visitor_cohorts_week_surface
	ON public.daily_visitor_cohorts (cohort_date DESC, entry_surface, acquisition_source);

CREATE OR REPLACE FUNCTION public.analytics_local_date(
	p_ts TIMESTAMPTZ
)
RETURNS DATE
LANGUAGE sql
IMMUTABLE
AS $$
	SELECT timezone('America/New_York', p_ts)::DATE;
$$;

CREATE OR REPLACE FUNCTION public.normalize_entry_surface(
	p_path TEXT,
	p_content_type TEXT
)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
	SELECT CASE
		WHEN COALESCE(p_path, '/') = '/' THEN 'home'
		WHEN COALESCE(p_content_type, '') IN (
			'people',
			'community',
			'guides',
			'enneagram',
			'pop-culture',
			'question',
			'other'
		) THEN COALESCE(p_content_type, 'other')
		ELSE 'other'
	END;
$$;

CREATE OR REPLACE FUNCTION public.normalize_acquisition_source(
	p_referrer_host TEXT DEFAULT NULL,
	p_utm_source TEXT DEFAULT NULL,
	p_utm_medium TEXT DEFAULT NULL,
	p_click_id_type TEXT DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
	v_referrer_host TEXT := LOWER(COALESCE(NULLIF(BTRIM(p_referrer_host), ''), ''));
	v_utm_source TEXT := LOWER(COALESCE(NULLIF(BTRIM(p_utm_source), ''), ''));
	v_utm_medium TEXT := LOWER(COALESCE(NULLIF(BTRIM(p_utm_medium), ''), ''));
	v_click_id_type TEXT := LOWER(COALESCE(NULLIF(BTRIM(p_click_id_type), ''), ''));
BEGIN
	IF v_utm_source <> '' THEN
		IF v_utm_medium IN ('cpc', 'ppc', 'paid', 'paid-search', 'paid_social', 'paid-social') THEN
			CASE
				WHEN v_utm_source IN ('google', 'googleads', 'adwords') THEN
					RETURN 'paid/google';
				WHEN v_utm_source IN ('bing', 'microsoft', 'msn') THEN
					RETURN 'paid/bing';
				WHEN v_utm_source IN ('facebook', 'fb', 'instagram', 'meta') THEN
					RETURN 'paid/meta';
				WHEN v_utm_source IN ('tiktok', 'tt') THEN
					RETURN 'paid/tiktok';
				WHEN v_utm_source = 'reddit' THEN
					RETURN 'paid/reddit';
			END CASE;
		END IF;

		CASE
			WHEN v_utm_source IN ('google', 'bing', 'duckduckgo') THEN
				RETURN 'search/' || v_utm_source;
			WHEN v_utm_source IN ('twitter', 'x', 't.co') THEN
				RETURN 'social/x';
			WHEN v_utm_source = 'reddit' THEN
				RETURN 'social/reddit';
			WHEN v_utm_source IN ('facebook', 'fb') THEN
				RETURN 'social/facebook';
			WHEN v_utm_source = 'instagram' THEN
				RETURN 'social/instagram';
			WHEN v_utm_source = 'linkedin' THEN
				RETURN 'social/linkedin';
			WHEN v_utm_source = 'youtube' THEN
				RETURN 'social/youtube';
			WHEN v_utm_source = 'substack' AND v_utm_medium = 'email' THEN
				RETURN 'email/substack';
			WHEN v_utm_medium = 'email' THEN
				RETURN 'email';
		END CASE;
	END IF;

	IF v_click_id_type <> '' THEN
		CASE v_click_id_type
			WHEN 'gclid' THEN RETURN 'paid/google';
			WHEN 'msclkid' THEN RETURN 'paid/bing';
			WHEN 'fbclid' THEN RETURN 'social/meta';
			WHEN 'ttclid' THEN RETURN 'social/tiktok';
		END CASE;
	END IF;

	IF v_referrer_host = '' THEN
		RETURN 'direct';
	END IF;

	IF v_referrer_host LIKE '%9takes.com%' OR v_referrer_host IN ('localhost', '127.0.0.1') THEN
		RETURN 'internal';
	END IF;

	IF v_referrer_host LIKE '%google.%' THEN RETURN 'search/google'; END IF;
	IF v_referrer_host LIKE '%bing.%' THEN RETURN 'search/bing'; END IF;
	IF v_referrer_host LIKE '%duckduckgo.%' THEN RETURN 'search/duckduckgo'; END IF;
	IF v_referrer_host LIKE '%reddit.%' THEN RETURN 'social/reddit'; END IF;
	IF v_referrer_host LIKE '%twitter.%' OR v_referrer_host LIKE '%x.com%' OR v_referrer_host LIKE '%t.co%' THEN RETURN 'social/x'; END IF;
	IF v_referrer_host LIKE '%facebook.%' OR v_referrer_host LIKE '%fb.%' THEN RETURN 'social/facebook'; END IF;
	IF v_referrer_host LIKE '%instagram.%' THEN RETURN 'social/instagram'; END IF;
	IF v_referrer_host LIKE '%linkedin.%' THEN RETURN 'social/linkedin'; END IF;
	IF v_referrer_host LIKE '%youtube.%' OR v_referrer_host LIKE '%youtu.be%' THEN RETURN 'social/youtube'; END IF;
	IF v_referrer_host LIKE '%substack.%' THEN RETURN 'email/substack'; END IF;
	IF v_referrer_host LIKE '%mail.%' OR v_referrer_host LIKE '%outlook.%' OR v_referrer_host LIKE '%gmail.%' THEN RETURN 'email'; END IF;

	RETURN 'other';
END;
$$;

CREATE OR REPLACE FUNCTION public.record_visitor_first_touch(
	p_fingerprint TEXT,
	p_path TEXT,
	p_path_group TEXT,
	p_content_type TEXT,
	p_content_slug TEXT,
	p_referrer_host TEXT,
	p_landing_query TEXT DEFAULT NULL,
	p_utm_source TEXT DEFAULT NULL,
	p_utm_medium TEXT DEFAULT NULL,
	p_utm_campaign TEXT DEFAULT NULL,
	p_utm_term TEXT DEFAULT NULL,
	p_utm_content TEXT DEFAULT NULL,
	p_click_id_type TEXT DEFAULT NULL,
	p_click_id_value TEXT DEFAULT NULL,
	p_visit_started_at TIMESTAMPTZ DEFAULT NOW()
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_visit_started_at TIMESTAMPTZ := COALESCE(p_visit_started_at, NOW());
BEGIN
	IF COALESCE(BTRIM(p_fingerprint), '') = '' THEN
		RETURN;
	END IF;

	INSERT INTO public.visitor_first_touch (
		fingerprint,
		first_visit_at,
		first_visit_date,
		first_path,
		first_landing_query,
		first_path_group,
		first_content_type,
		first_content_slug,
		first_referrer_host,
		first_utm_source,
		first_utm_medium,
		first_utm_campaign,
		first_utm_term,
		first_utm_content,
		first_click_id_type,
		first_click_id_value,
		first_acquisition_source,
		first_entry_surface
	) VALUES (
		p_fingerprint,
		v_visit_started_at,
		public.analytics_local_date(v_visit_started_at),
		COALESCE(p_path, '/'),
		NULLIF(BTRIM(p_landing_query), ''),
		COALESCE(p_path_group, '/'),
		COALESCE(NULLIF(BTRIM(p_content_type), ''), 'other'),
		NULLIF(BTRIM(p_content_slug), ''),
		NULLIF(BTRIM(p_referrer_host), ''),
		NULLIF(BTRIM(p_utm_source), ''),
		NULLIF(BTRIM(p_utm_medium), ''),
		NULLIF(BTRIM(p_utm_campaign), ''),
		NULLIF(BTRIM(p_utm_term), ''),
		NULLIF(BTRIM(p_utm_content), ''),
		NULLIF(BTRIM(p_click_id_type), ''),
		NULLIF(BTRIM(p_click_id_value), ''),
		public.normalize_acquisition_source(
			p_referrer_host,
			p_utm_source,
			p_utm_medium,
			p_click_id_type
		),
		public.normalize_entry_surface(p_path, p_content_type)
	)
	ON CONFLICT (fingerprint) DO NOTHING;
END;
$$;

CREATE OR REPLACE FUNCTION public.attach_profile_first_touch(
	p_profile_id UUID,
	p_fingerprint TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_updated BOOLEAN := FALSE;
BEGIN
	IF p_profile_id IS NULL OR COALESCE(BTRIM(p_fingerprint), '') = '' THEN
		RETURN FALSE;
	END IF;

	UPDATE public.profiles p
	SET first_touch_fingerprint = v.fingerprint,
		first_visit_at = v.first_visit_at,
		first_landing_path = v.first_path,
		first_referrer_host = v.first_referrer_host,
		first_acquisition_source = v.first_acquisition_source,
		first_entry_surface = v.first_entry_surface
	FROM public.visitor_first_touch v
	WHERE p.id = p_profile_id
		AND v.fingerprint = p_fingerprint
		AND p.first_visit_at IS NULL
	RETURNING TRUE INTO v_updated;

	RETURN COALESCE(v_updated, FALSE);
END;
$$;

CREATE OR REPLACE FUNCTION public.attach_signup_first_touch(
	p_signup_id BIGINT,
	p_fingerprint TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_updated BOOLEAN := FALSE;
BEGIN
	IF p_signup_id IS NULL OR COALESCE(BTRIM(p_fingerprint), '') = '' THEN
		RETURN FALSE;
	END IF;

	UPDATE public.signups s
	SET first_touch_fingerprint = v.fingerprint,
		first_visit_at = v.first_visit_at,
		first_landing_path = v.first_path,
		first_referrer_host = v.first_referrer_host,
		first_acquisition_source = v.first_acquisition_source,
		first_entry_surface = v.first_entry_surface
	FROM public.visitor_first_touch v
	WHERE s.id = p_signup_id
		AND v.fingerprint = p_fingerprint
		AND s.first_touch_fingerprint IS NULL
	RETURNING TRUE INTO v_updated;

	RETURN COALESCE(v_updated, FALSE);
END;
$$;

CREATE OR REPLACE FUNCTION public.refresh_visitor_day_activity(
	p_from DATE DEFAULT NULL,
	p_to DATE DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_today DATE := public.analytics_local_date(NOW());
	v_from DATE := COALESCE(p_from, v_today - 45);
	v_to DATE := COALESCE(p_to, v_today);
	v_rows INTEGER := 0;
BEGIN
	IF v_from > v_to THEN
		RETURN 0;
	END IF;

	DELETE FROM public.visitor_day_activity
	WHERE activity_date BETWEEN v_from AND v_to;

	INSERT INTO public.visitor_day_activity (
		fingerprint,
		activity_date,
		visit_count,
		session_count,
		engaged_ms_total,
		engaged_session_count,
		comment_count,
		signup_count,
		registration_count,
		first_path,
		last_path,
		refreshed_at
	)
	WITH visit_rows AS (
		SELECT
			v.id,
			v.fingerprint,
			public.analytics_local_date(v.started_at) AS activity_date,
			v.session_id,
			v.path,
			v.engaged_ms,
			v.started_at
		FROM public.page_analytics_visits v
		WHERE COALESCE(BTRIM(v.fingerprint), '') <> ''
			AND NOT public.is_analytics_utility_path(v.path)
			AND public.analytics_local_date(v.started_at) BETWEEN v_from AND v_to
	),
	session_day_rollup AS (
		SELECT
			v.fingerprint,
			v.activity_date,
			v.session_id,
			COUNT(*)::INT AS page_count,
			COALESCE(SUM(v.engaged_ms), 0)::INT AS engaged_ms_total
		FROM visit_rows v
		GROUP BY v.fingerprint, v.activity_date, v.session_id
	),
	visit_rollup AS (
		SELECT
			s.fingerprint,
			s.activity_date,
			COALESCE(SUM(s.page_count), 0)::INT AS visit_count,
			COUNT(DISTINCT s.session_id)::INT AS session_count,
			COALESCE(SUM(s.engaged_ms_total), 0)::INT AS engaged_ms_total,
			COUNT(*) FILTER (
				WHERE s.page_count >= 2
					AND s.engaged_ms_total >= 30000
			)::INT AS engaged_session_count
		FROM session_day_rollup s
		GROUP BY s.fingerprint, s.activity_date
	),
	first_paths AS (
		SELECT DISTINCT ON (v.fingerprint, v.activity_date)
			v.fingerprint,
			v.activity_date,
			v.path AS first_path
		FROM visit_rows v
		ORDER BY v.fingerprint, v.activity_date, v.started_at ASC, v.id ASC
	),
	last_paths AS (
		SELECT DISTINCT ON (v.fingerprint, v.activity_date)
			v.fingerprint,
			v.activity_date,
			v.path AS last_path
		FROM visit_rows v
		ORDER BY v.fingerprint, v.activity_date, v.started_at DESC, v.id DESC
	),
	comment_rollup AS (
		SELECT
			activity.fingerprint,
			activity.activity_date,
			COUNT(*)::INT AS comment_count
		FROM (
			SELECT
				c.fingerprint,
				public.analytics_local_date(COALESCE(c.created_at, NOW())) AS activity_date
			FROM public.comments c
			WHERE COALESCE(BTRIM(c.fingerprint), '') <> ''
				AND COALESCE(c.removed, FALSE) = FALSE
				AND public.analytics_local_date(COALESCE(c.created_at, NOW())) BETWEEN v_from AND v_to

			UNION ALL

			SELECT
				bc.fingerprint,
				public.analytics_local_date(bc.created_at) AS activity_date
			FROM public.blog_comments bc
			WHERE COALESCE(BTRIM(bc.fingerprint), '') <> ''
				AND public.analytics_local_date(bc.created_at) BETWEEN v_from AND v_to
		) activity
		GROUP BY activity.fingerprint, activity.activity_date
	),
	signup_rollup AS (
		SELECT
			s.first_touch_fingerprint AS fingerprint,
			public.analytics_local_date(COALESCE(s.created_at, NOW())) AS activity_date,
			COUNT(*)::INT AS signup_count
		FROM public.signups s
		WHERE COALESCE(BTRIM(s.first_touch_fingerprint), '') <> ''
			AND public.analytics_local_date(COALESCE(s.created_at, NOW())) BETWEEN v_from AND v_to
		GROUP BY
			s.first_touch_fingerprint,
			public.analytics_local_date(COALESCE(s.created_at, NOW()))
	),
	registration_rollup AS (
		SELECT
			p.first_touch_fingerprint AS fingerprint,
			public.analytics_local_date(COALESCE(p.created_at, NOW())) AS activity_date,
			COUNT(*)::INT AS registration_count
		FROM public.profiles p
		WHERE COALESCE(BTRIM(p.first_touch_fingerprint), '') <> ''
			AND public.analytics_local_date(COALESCE(p.created_at, NOW())) BETWEEN v_from AND v_to
		GROUP BY
			p.first_touch_fingerprint,
			public.analytics_local_date(COALESCE(p.created_at, NOW()))
	),
	all_keys AS (
		SELECT v.fingerprint, v.activity_date
		FROM visit_rollup v

		UNION

		SELECT c.fingerprint, c.activity_date
		FROM comment_rollup c

		UNION

		SELECT s.fingerprint, s.activity_date
		FROM signup_rollup s

		UNION

		SELECT r.fingerprint, r.activity_date
		FROM registration_rollup r
	)
	SELECT
		k.fingerprint,
		k.activity_date,
		COALESCE(v.visit_count, 0),
		COALESCE(v.session_count, 0),
		COALESCE(v.engaged_ms_total, 0),
		COALESCE(v.engaged_session_count, 0),
		COALESCE(c.comment_count, 0),
		COALESCE(s.signup_count, 0),
		COALESCE(r.registration_count, 0),
		fp.first_path,
		lp.last_path,
		NOW()
	FROM all_keys k
	LEFT JOIN visit_rollup v
		ON v.fingerprint = k.fingerprint
		AND v.activity_date = k.activity_date
	LEFT JOIN comment_rollup c
		ON c.fingerprint = k.fingerprint
		AND c.activity_date = k.activity_date
	LEFT JOIN signup_rollup s
		ON s.fingerprint = k.fingerprint
		AND s.activity_date = k.activity_date
	LEFT JOIN registration_rollup r
		ON r.fingerprint = k.fingerprint
		AND r.activity_date = k.activity_date
	LEFT JOIN first_paths fp
		ON fp.fingerprint = k.fingerprint
		AND fp.activity_date = k.activity_date
	LEFT JOIN last_paths lp
		ON lp.fingerprint = k.fingerprint
		AND lp.activity_date = k.activity_date
	ORDER BY k.activity_date, k.fingerprint;

	GET DIAGNOSTICS v_rows = ROW_COUNT;
	RETURN v_rows;
END;
$$;

CREATE OR REPLACE FUNCTION public.refresh_daily_visitor_cohorts(
	p_from DATE DEFAULT NULL,
	p_to DATE DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_today DATE := public.analytics_local_date(NOW());
	v_from DATE := COALESCE(p_from, v_today - 35);
	v_to DATE := COALESCE(p_to, v_today);
	v_rows INTEGER := 0;
BEGIN
	IF v_from > v_to THEN
		RETURN 0;
	END IF;

	DELETE FROM public.daily_visitor_cohorts
	WHERE cohort_date BETWEEN v_from AND v_to;

	INSERT INTO public.daily_visitor_cohorts (
		cohort_date,
		entry_surface,
		acquisition_source,
		cohort_size,
		commented_d0,
		commented_within_d7,
		signed_up_d0,
		signed_up_within_d7,
		registered_d0,
		registered_within_d7,
		engaged_d0,
		engaged_within_d7,
		retained_d1,
		retained_d3,
		retained_d7,
		retained_d14,
		retained_d30,
		engaged_ms_total_within_d7,
		refreshed_at
	)
	WITH cohort_rows AS (
		SELECT
			v.fingerprint,
			v.first_visit_date AS cohort_date,
			COALESCE(NULLIF(BTRIM(v.first_entry_surface), ''), 'other') AS entry_surface,
			COALESCE(NULLIF(BTRIM(v.first_acquisition_source), ''), 'direct') AS acquisition_source
		FROM public.visitor_first_touch v
		WHERE v.first_visit_date BETWEEN v_from AND v_to
	),
	joined_activity AS (
		SELECT
			c.fingerprint,
			c.cohort_date,
			c.entry_surface,
			c.acquisition_source,
			a.activity_date,
			(a.activity_date - c.cohort_date) AS day_offset,
			COALESCE(a.visit_count, 0) AS visit_count,
			COALESCE(a.comment_count, 0) AS comment_count,
			COALESCE(a.signup_count, 0) AS signup_count,
			COALESCE(a.registration_count, 0) AS registration_count,
			COALESCE(a.engaged_session_count, 0) AS engaged_session_count,
			COALESCE(a.engaged_ms_total, 0) AS engaged_ms_total
		FROM cohort_rows c
		LEFT JOIN public.visitor_day_activity a
			ON a.fingerprint = c.fingerprint
			AND a.activity_date BETWEEN c.cohort_date AND (c.cohort_date + 30)
	)
	SELECT
		j.cohort_date,
		j.entry_surface,
		j.acquisition_source,
		COUNT(DISTINCT j.fingerprint)::INT,
		COUNT(DISTINCT j.fingerprint) FILTER (
			WHERE j.day_offset = 0
				AND j.comment_count > 0
		)::INT,
		COUNT(DISTINCT j.fingerprint) FILTER (
			WHERE j.day_offset BETWEEN 0 AND 7
				AND j.comment_count > 0
		)::INT,
		COUNT(DISTINCT j.fingerprint) FILTER (
			WHERE j.day_offset = 0
				AND j.signup_count > 0
		)::INT,
		COUNT(DISTINCT j.fingerprint) FILTER (
			WHERE j.day_offset BETWEEN 0 AND 7
				AND j.signup_count > 0
		)::INT,
		COUNT(DISTINCT j.fingerprint) FILTER (
			WHERE j.day_offset = 0
				AND j.registration_count > 0
		)::INT,
		COUNT(DISTINCT j.fingerprint) FILTER (
			WHERE j.day_offset BETWEEN 0 AND 7
				AND j.registration_count > 0
		)::INT,
		COUNT(DISTINCT j.fingerprint) FILTER (
			WHERE j.day_offset = 0
				AND j.engaged_session_count > 0
		)::INT,
		COUNT(DISTINCT j.fingerprint) FILTER (
			WHERE j.day_offset BETWEEN 0 AND 7
				AND j.engaged_session_count > 0
		)::INT,
		COUNT(DISTINCT j.fingerprint) FILTER (
			WHERE j.day_offset = 1
				AND j.visit_count > 0
		)::INT,
		COUNT(DISTINCT j.fingerprint) FILTER (
			WHERE j.day_offset = 3
				AND j.visit_count > 0
		)::INT,
		COUNT(DISTINCT j.fingerprint) FILTER (
			WHERE j.day_offset = 7
				AND j.visit_count > 0
		)::INT,
		COUNT(DISTINCT j.fingerprint) FILTER (
			WHERE j.day_offset = 14
				AND j.visit_count > 0
		)::INT,
		COUNT(DISTINCT j.fingerprint) FILTER (
			WHERE j.day_offset = 30
				AND j.visit_count > 0
		)::INT,
		COALESCE(SUM(
			CASE
				WHEN j.day_offset BETWEEN 0 AND 7 THEN j.engaged_ms_total
				ELSE 0
			END
		), 0)::BIGINT,
		NOW()
	FROM joined_activity j
	GROUP BY j.cohort_date, j.entry_surface, j.acquisition_source
	ORDER BY j.cohort_date, j.entry_surface, j.acquisition_source;

	GET DIAGNOSTICS v_rows = ROW_COUNT;
	RETURN v_rows;
END;
$$;

CREATE OR REPLACE FUNCTION public.refresh_retention_rollups(
	p_from DATE DEFAULT NULL,
	p_to DATE DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_today DATE := public.analytics_local_date(NOW());
	v_from DATE := COALESCE(p_from, v_today - 45);
	v_to DATE := COALESCE(p_to, v_today);
	v_activity_rows INTEGER := 0;
	v_cohort_rows INTEGER := 0;
BEGIN
	IF v_from > v_to THEN
		RETURN jsonb_build_object(
			'activity_rows', 0,
			'cohort_rows', 0,
			'from', v_from,
			'to', v_to,
			'ran_at', NOW()
		);
	END IF;

	v_activity_rows := public.refresh_visitor_day_activity(v_from, v_to);
	v_cohort_rows := public.refresh_daily_visitor_cohorts(v_from, v_to);

	RETURN jsonb_build_object(
		'activity_rows', v_activity_rows,
		'cohort_rows', v_cohort_rows,
		'from', v_from,
		'to', v_to,
		'ran_at', NOW()
	);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_entry_surface_overview(
	p_from DATE DEFAULT NULL,
	p_to DATE DEFAULT NULL,
	p_acquisition_source TEXT DEFAULT NULL
)
RETURNS TABLE(
	entry_surface TEXT,
	new_visitors BIGINT,
	commented_within_d7 BIGINT,
	comment_rate_pct NUMERIC,
	signed_up_within_d7 BIGINT,
	signup_rate_pct NUMERIC,
	registered_within_d7 BIGINT,
	registration_rate_pct NUMERIC,
	retained_d1 BIGINT,
	retained_d1_denominator BIGINT,
	retained_d1_pct NUMERIC,
	retained_d7 BIGINT,
	retained_d7_denominator BIGINT,
	retained_d7_pct NUMERIC,
	retained_d30 BIGINT,
	retained_d30_denominator BIGINT,
	retained_d30_pct NUMERIC,
	avg_engaged_minutes_within_d7 NUMERIC
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
	WITH bounds AS (
		SELECT
			COALESCE(p_from, public.analytics_local_date(NOW()) - 56) AS from_date,
			COALESCE(p_to, public.analytics_local_date(NOW()) - 1) AS to_date,
			public.analytics_local_date(NOW()) AS today
	),
	filtered AS (
		SELECT d.*, b.today
		FROM public.daily_visitor_cohorts d
		CROSS JOIN bounds b
		WHERE d.cohort_date BETWEEN b.from_date AND b.to_date
			AND (
				COALESCE(BTRIM(p_acquisition_source), '') = ''
				OR d.acquisition_source = p_acquisition_source
			)
	)
	SELECT
		f.entry_surface,
		COALESCE(SUM(f.cohort_size), 0)::BIGINT AS new_visitors,
		COALESCE(SUM(f.commented_within_d7), 0)::BIGINT AS commented_within_d7,
		CASE
			WHEN COALESCE(SUM(f.cohort_size), 0) > 0
			THEN ROUND(SUM(f.commented_within_d7)::NUMERIC / SUM(f.cohort_size)::NUMERIC * 100, 2)
			ELSE 0
		END AS comment_rate_pct,
		COALESCE(SUM(f.signed_up_within_d7), 0)::BIGINT AS signed_up_within_d7,
		CASE
			WHEN COALESCE(SUM(f.cohort_size), 0) > 0
			THEN ROUND(SUM(f.signed_up_within_d7)::NUMERIC / SUM(f.cohort_size)::NUMERIC * 100, 2)
			ELSE 0
		END AS signup_rate_pct,
		COALESCE(SUM(f.registered_within_d7), 0)::BIGINT AS registered_within_d7,
		CASE
			WHEN COALESCE(SUM(f.cohort_size), 0) > 0
			THEN ROUND(SUM(f.registered_within_d7)::NUMERIC / SUM(f.cohort_size)::NUMERIC * 100, 2)
			ELSE 0
		END AS registration_rate_pct,
		COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 1 THEN f.retained_d1 ELSE 0 END), 0)::BIGINT AS retained_d1,
		COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 1 THEN f.cohort_size ELSE 0 END), 0)::BIGINT AS retained_d1_denominator,
		CASE
			WHEN COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 1 THEN f.cohort_size ELSE 0 END), 0) > 0
			THEN ROUND(
				SUM(CASE WHEN f.cohort_date <= f.today - 1 THEN f.retained_d1 ELSE 0 END)::NUMERIC
				/
				SUM(CASE WHEN f.cohort_date <= f.today - 1 THEN f.cohort_size ELSE 0 END)::NUMERIC
				* 100,
				2
			)
			ELSE 0
		END AS retained_d1_pct,
		COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 7 THEN f.retained_d7 ELSE 0 END), 0)::BIGINT AS retained_d7,
		COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 7 THEN f.cohort_size ELSE 0 END), 0)::BIGINT AS retained_d7_denominator,
		CASE
			WHEN COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 7 THEN f.cohort_size ELSE 0 END), 0) > 0
			THEN ROUND(
				SUM(CASE WHEN f.cohort_date <= f.today - 7 THEN f.retained_d7 ELSE 0 END)::NUMERIC
				/
				SUM(CASE WHEN f.cohort_date <= f.today - 7 THEN f.cohort_size ELSE 0 END)::NUMERIC
				* 100,
				2
			)
			ELSE 0
		END AS retained_d7_pct,
		COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 30 THEN f.retained_d30 ELSE 0 END), 0)::BIGINT AS retained_d30,
		COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 30 THEN f.cohort_size ELSE 0 END), 0)::BIGINT AS retained_d30_denominator,
		CASE
			WHEN COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 30 THEN f.cohort_size ELSE 0 END), 0) > 0
			THEN ROUND(
				SUM(CASE WHEN f.cohort_date <= f.today - 30 THEN f.retained_d30 ELSE 0 END)::NUMERIC
				/
				SUM(CASE WHEN f.cohort_date <= f.today - 30 THEN f.cohort_size ELSE 0 END)::NUMERIC
				* 100,
				2
			)
			ELSE 0
		END AS retained_d30_pct,
		CASE
			WHEN COALESCE(SUM(f.cohort_size), 0) > 0
			THEN ROUND(COALESCE(SUM(f.engaged_ms_total_within_d7), 0)::NUMERIC / SUM(f.cohort_size)::NUMERIC / 60000, 2)
			ELSE 0
		END AS avg_engaged_minutes_within_d7
	FROM filtered f
	GROUP BY f.entry_surface
	ORDER BY new_visitors DESC, f.entry_surface ASC;
$$;

CREATE OR REPLACE FUNCTION public.get_cohort_retention_curve(
	p_from DATE DEFAULT NULL,
	p_to DATE DEFAULT NULL,
	p_entry_surface TEXT DEFAULT NULL,
	p_acquisition_source TEXT DEFAULT NULL
)
RETURNS TABLE(
	cohort_week DATE,
	new_visitors BIGINT,
	retained_d1 BIGINT,
	retained_d1_denominator BIGINT,
	retained_d1_pct NUMERIC,
	retained_d3 BIGINT,
	retained_d3_denominator BIGINT,
	retained_d3_pct NUMERIC,
	retained_d7 BIGINT,
	retained_d7_denominator BIGINT,
	retained_d7_pct NUMERIC,
	retained_d14 BIGINT,
	retained_d14_denominator BIGINT,
	retained_d14_pct NUMERIC,
	retained_d30 BIGINT,
	retained_d30_denominator BIGINT,
	retained_d30_pct NUMERIC
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
	WITH bounds AS (
		SELECT
			COALESCE(p_from, public.analytics_local_date(NOW()) - 56) AS from_date,
			COALESCE(p_to, public.analytics_local_date(NOW()) - 1) AS to_date,
			public.analytics_local_date(NOW()) AS today
	),
	filtered AS (
		SELECT d.*, b.today
		FROM public.daily_visitor_cohorts d
		CROSS JOIN bounds b
		WHERE d.cohort_date BETWEEN b.from_date AND b.to_date
			AND (
				COALESCE(BTRIM(p_entry_surface), '') = ''
				OR d.entry_surface = p_entry_surface
			)
			AND (
				COALESCE(BTRIM(p_acquisition_source), '') = ''
				OR d.acquisition_source = p_acquisition_source
			)
	)
	SELECT
		DATE_TRUNC('week', f.cohort_date::TIMESTAMP)::DATE AS cohort_week,
		COALESCE(SUM(f.cohort_size), 0)::BIGINT AS new_visitors,
		COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 1 THEN f.retained_d1 ELSE 0 END), 0)::BIGINT AS retained_d1,
		COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 1 THEN f.cohort_size ELSE 0 END), 0)::BIGINT AS retained_d1_denominator,
		CASE
			WHEN COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 1 THEN f.cohort_size ELSE 0 END), 0) > 0
			THEN ROUND(
				SUM(CASE WHEN f.cohort_date <= f.today - 1 THEN f.retained_d1 ELSE 0 END)::NUMERIC
				/
				SUM(CASE WHEN f.cohort_date <= f.today - 1 THEN f.cohort_size ELSE 0 END)::NUMERIC
				* 100,
				2
			)
			ELSE 0
		END AS retained_d1_pct,
		COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 3 THEN f.retained_d3 ELSE 0 END), 0)::BIGINT AS retained_d3,
		COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 3 THEN f.cohort_size ELSE 0 END), 0)::BIGINT AS retained_d3_denominator,
		CASE
			WHEN COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 3 THEN f.cohort_size ELSE 0 END), 0) > 0
			THEN ROUND(
				SUM(CASE WHEN f.cohort_date <= f.today - 3 THEN f.retained_d3 ELSE 0 END)::NUMERIC
				/
				SUM(CASE WHEN f.cohort_date <= f.today - 3 THEN f.cohort_size ELSE 0 END)::NUMERIC
				* 100,
				2
			)
			ELSE 0
		END AS retained_d3_pct,
		COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 7 THEN f.retained_d7 ELSE 0 END), 0)::BIGINT AS retained_d7,
		COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 7 THEN f.cohort_size ELSE 0 END), 0)::BIGINT AS retained_d7_denominator,
		CASE
			WHEN COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 7 THEN f.cohort_size ELSE 0 END), 0) > 0
			THEN ROUND(
				SUM(CASE WHEN f.cohort_date <= f.today - 7 THEN f.retained_d7 ELSE 0 END)::NUMERIC
				/
				SUM(CASE WHEN f.cohort_date <= f.today - 7 THEN f.cohort_size ELSE 0 END)::NUMERIC
				* 100,
				2
			)
			ELSE 0
		END AS retained_d7_pct,
		COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 14 THEN f.retained_d14 ELSE 0 END), 0)::BIGINT AS retained_d14,
		COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 14 THEN f.cohort_size ELSE 0 END), 0)::BIGINT AS retained_d14_denominator,
		CASE
			WHEN COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 14 THEN f.cohort_size ELSE 0 END), 0) > 0
			THEN ROUND(
				SUM(CASE WHEN f.cohort_date <= f.today - 14 THEN f.retained_d14 ELSE 0 END)::NUMERIC
				/
				SUM(CASE WHEN f.cohort_date <= f.today - 14 THEN f.cohort_size ELSE 0 END)::NUMERIC
				* 100,
				2
			)
			ELSE 0
		END AS retained_d14_pct,
		COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 30 THEN f.retained_d30 ELSE 0 END), 0)::BIGINT AS retained_d30,
		COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 30 THEN f.cohort_size ELSE 0 END), 0)::BIGINT AS retained_d30_denominator,
		CASE
			WHEN COALESCE(SUM(CASE WHEN f.cohort_date <= f.today - 30 THEN f.cohort_size ELSE 0 END), 0) > 0
			THEN ROUND(
				SUM(CASE WHEN f.cohort_date <= f.today - 30 THEN f.retained_d30 ELSE 0 END)::NUMERIC
				/
				SUM(CASE WHEN f.cohort_date <= f.today - 30 THEN f.cohort_size ELSE 0 END)::NUMERIC
				* 100,
				2
			)
			ELSE 0
		END AS retained_d30_pct
	FROM filtered f
	GROUP BY DATE_TRUNC('week', f.cohort_date::TIMESTAMP)::DATE
	ORDER BY cohort_week ASC;
$$;

CREATE OR REPLACE FUNCTION public.get_acquisition_mix_by_week(
	p_from DATE DEFAULT NULL,
	p_to DATE DEFAULT NULL,
	p_entry_surface TEXT DEFAULT NULL
)
RETURNS TABLE(
	cohort_week DATE,
	acquisition_source TEXT,
	new_visitors BIGINT
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
	WITH bounds AS (
		SELECT
			COALESCE(p_from, public.analytics_local_date(NOW()) - 56) AS from_date,
			COALESCE(p_to, public.analytics_local_date(NOW()) - 1) AS to_date
	)
	SELECT
		DATE_TRUNC('week', d.cohort_date::TIMESTAMP)::DATE AS cohort_week,
		d.acquisition_source,
		COALESCE(SUM(d.cohort_size), 0)::BIGINT AS new_visitors
	FROM public.daily_visitor_cohorts d
	CROSS JOIN bounds b
	WHERE d.cohort_date BETWEEN b.from_date AND b.to_date
		AND (
			COALESCE(BTRIM(p_entry_surface), '') = ''
			OR d.entry_surface = p_entry_surface
		)
	GROUP BY DATE_TRUNC('week', d.cohort_date::TIMESTAMP)::DATE, d.acquisition_source
	ORDER BY cohort_week ASC, new_visitors DESC, d.acquisition_source ASC;
$$;

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
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
	WITH bounds AS (
		SELECT
			COALESCE(p_from, public.analytics_local_date(NOW()) - 56) AS from_date,
			COALESCE(p_to, public.analytics_local_date(NOW()) - 1) AS to_date
	),
	cohort_visitors AS (
		SELECT v.fingerprint
		FROM public.visitor_first_touch v
		CROSS JOIN bounds b
		WHERE v.first_visit_date BETWEEN b.from_date AND b.to_date
			AND (
				COALESCE(BTRIM(p_entry_surface), '') = ''
				OR v.first_entry_surface = p_entry_surface
			)
			AND (
				COALESCE(BTRIM(p_acquisition_source), '') = ''
				OR v.first_acquisition_source = p_acquisition_source
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
	LIMIT LEAST(GREATEST(COALESCE(p_limit, 10), 1), 50);
$$;

CREATE OR REPLACE FUNCTION public.get_admin_retention_summary(
	p_anchor_date DATE DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
	v_today DATE := COALESCE(p_anchor_date, public.analytics_local_date(NOW()));
	v_current_week_start DATE := DATE_TRUNC('week', v_today::TIMESTAMP)::DATE;
	v_last_full_week_start DATE := v_current_week_start - 7;
	v_last_full_week_end DATE := v_current_week_start - 1;
	v_last_mature_d7_week_start DATE := v_current_week_start - 14;
	v_last_mature_d7_week_end DATE := v_current_week_start - 8;
	v_new_visitors_this_week BIGINT := 0;
	v_full_week_denominator BIGINT := 0;
	v_comment_numerator BIGINT := 0;
	v_signup_numerator BIGINT := 0;
	v_registration_numerator BIGINT := 0;
	v_d7_denominator BIGINT := 0;
	v_d7_numerator BIGINT := 0;
	v_active_contributors BIGINT := 0;
BEGIN
	SELECT COALESCE(SUM(d.cohort_size), 0)::BIGINT
	INTO v_new_visitors_this_week
	FROM public.daily_visitor_cohorts d
	WHERE d.cohort_date BETWEEN v_current_week_start AND v_today;

	SELECT
		COALESCE(SUM(d.cohort_size), 0)::BIGINT,
		COALESCE(SUM(d.commented_within_d7), 0)::BIGINT,
		COALESCE(SUM(d.signed_up_within_d7), 0)::BIGINT,
		COALESCE(SUM(d.registered_within_d7), 0)::BIGINT
	INTO
		v_full_week_denominator,
		v_comment_numerator,
		v_signup_numerator,
		v_registration_numerator
	FROM public.daily_visitor_cohorts d
	WHERE d.cohort_date BETWEEN v_last_full_week_start AND v_last_full_week_end;

	SELECT
		COALESCE(SUM(d.cohort_size), 0)::BIGINT,
		COALESCE(SUM(d.retained_d7), 0)::BIGINT
	INTO
		v_d7_denominator,
		v_d7_numerator
	FROM public.daily_visitor_cohorts d
	WHERE d.cohort_date BETWEEN v_last_mature_d7_week_start AND v_last_mature_d7_week_end;

	SELECT COUNT(DISTINCT contributors.contributor_key)::BIGINT
	INTO v_active_contributors
	FROM (
		SELECT COALESCE(c.author_id::TEXT, NULLIF(BTRIM(c.fingerprint), '')) AS contributor_key
		FROM public.comments c
		WHERE COALESCE(c.removed, FALSE) = FALSE
			AND public.analytics_local_date(COALESCE(c.created_at, NOW())) BETWEEN v_current_week_start AND v_today

		UNION

		SELECT COALESCE(bc.author_id::TEXT, NULLIF(BTRIM(bc.fingerprint), '')) AS contributor_key
		FROM public.blog_comments bc
		WHERE public.analytics_local_date(bc.created_at) BETWEEN v_current_week_start AND v_today
	) contributors
	WHERE COALESCE(BTRIM(contributors.contributor_key), '') <> '';

	RETURN jsonb_build_object(
		'anchor_date', v_today,
		'new_visitors_this_week', v_new_visitors_this_week,
		'current_week_start', v_current_week_start,
		'current_week_end', v_today,
		'first_comment_rate_last_full_week', jsonb_build_object(
			'week_start', v_last_full_week_start,
			'week_end', v_last_full_week_end,
			'numerator', v_comment_numerator,
			'denominator', v_full_week_denominator,
			'pct', CASE
				WHEN v_full_week_denominator > 0
				THEN ROUND(v_comment_numerator::NUMERIC / v_full_week_denominator::NUMERIC * 100, 2)
				ELSE 0
			END
		),
		'email_signup_rate_last_full_week', jsonb_build_object(
			'week_start', v_last_full_week_start,
			'week_end', v_last_full_week_end,
			'numerator', v_signup_numerator,
			'denominator', v_full_week_denominator,
			'pct', CASE
				WHEN v_full_week_denominator > 0
				THEN ROUND(v_signup_numerator::NUMERIC / v_full_week_denominator::NUMERIC * 100, 2)
				ELSE 0
			END
		),
		'registered_rate_last_full_week', jsonb_build_object(
			'week_start', v_last_full_week_start,
			'week_end', v_last_full_week_end,
			'numerator', v_registration_numerator,
			'denominator', v_full_week_denominator,
			'pct', CASE
				WHEN v_full_week_denominator > 0
				THEN ROUND(v_registration_numerator::NUMERIC / v_full_week_denominator::NUMERIC * 100, 2)
				ELSE 0
			END
		),
		'd7_retention_last_mature_week', jsonb_build_object(
			'week_start', v_last_mature_d7_week_start,
			'week_end', v_last_mature_d7_week_end,
			'numerator', v_d7_numerator,
			'denominator', v_d7_denominator,
			'pct', CASE
				WHEN v_d7_denominator > 0
				THEN ROUND(v_d7_numerator::NUMERIC / v_d7_denominator::NUMERIC * 100, 2)
				ELSE 0
			END
		),
		'active_contributors_this_week', v_active_contributors
	);
END;
$$;

CREATE OR REPLACE FUNCTION public.cleanup_site_telemetry(
	p_now TIMESTAMPTZ DEFAULT NOW()
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_now TIMESTAMPTZ := COALESCE(p_now, NOW());
	v_page_cutoff TIMESTAMPTZ := v_now - INTERVAL '90 days';
	v_access_cutoff TIMESTAMPTZ := v_now - INTERVAL '7 days';
	v_visitors_cutoff TIMESTAMPTZ := v_now - INTERVAL '45 days';
	v_deleted_page_visits INTEGER := 0;
	v_deleted_page_sessions INTEGER := 0;
	v_deleted_access_events INTEGER := 0;
	v_deleted_visitors INTEGER := 0;
BEGIN
	DELETE FROM public.page_analytics_visits
	WHERE started_at < v_page_cutoff;
	GET DIAGNOSTICS v_deleted_page_visits = ROW_COUNT;

	DELETE FROM public.page_analytics_sessions s
	WHERE COALESCE(s.last_seen_at, s.started_at, s.created_at) < v_page_cutoff
		AND NOT EXISTS (
			SELECT 1
			FROM public.page_analytics_visits v
			WHERE v.session_id = s.id
		);
	GET DIAGNOSTICS v_deleted_page_sessions = ROW_COUNT;

	DELETE FROM public.content_access_events
	WHERE requested_at < v_access_cutoff;
	GET DIAGNOSTICS v_deleted_access_events = ROW_COUNT;

	DELETE FROM public.visitors v
	WHERE COALESCE(v.updated_at, v.created_at) < v_visitors_cutoff
		AND NOT EXISTS (
			SELECT 1
			FROM public.blog_comments bc
			WHERE bc.fingerprint = v.fingerprint
		);
	GET DIAGNOSTICS v_deleted_visitors = ROW_COUNT;

	RETURN jsonb_build_object(
		'page_analytics_visits_deleted', v_deleted_page_visits,
		'page_analytics_sessions_deleted', v_deleted_page_sessions,
		'content_access_events_deleted', v_deleted_access_events,
		'visitors_deleted', v_deleted_visitors,
		'ran_at', v_now
	);
END;
$$;

DROP FUNCTION IF EXISTS public.upsert_page_analytics_visit(
	UUID,
	TEXT,
	TEXT,
	UUID,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT
);

CREATE OR REPLACE FUNCTION public.upsert_page_analytics_visit(
	p_visit_key UUID,
	p_session_key TEXT,
	p_fingerprint TEXT,
	p_user_id UUID DEFAULT NULL,
	p_path TEXT DEFAULT '/',
	p_route_id TEXT DEFAULT NULL,
	p_path_group TEXT DEFAULT '/',
	p_content_type TEXT DEFAULT NULL,
	p_content_slug TEXT DEFAULT NULL,
	p_referrer_host TEXT DEFAULT NULL,
	p_landing_query TEXT DEFAULT NULL,
	p_utm_source TEXT DEFAULT NULL,
	p_utm_medium TEXT DEFAULT NULL,
	p_utm_campaign TEXT DEFAULT NULL,
	p_utm_term TEXT DEFAULT NULL,
	p_utm_content TEXT DEFAULT NULL,
	p_click_id_type TEXT DEFAULT NULL,
	p_click_id_value TEXT DEFAULT NULL
)
RETURNS TABLE(session_id UUID, visit_id BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_session_id UUID;
	v_visit_id BIGINT;
	v_now TIMESTAMPTZ := NOW();
BEGIN
	IF p_visit_key IS NULL OR p_session_key IS NULL OR p_fingerprint IS NULL OR p_path IS NULL THEN
		RETURN;
	END IF;

	INSERT INTO public.page_analytics_sessions (
		session_key,
		fingerprint,
		user_id,
		entry_path,
		last_seen_at
	) VALUES (
		p_session_key,
		p_fingerprint,
		p_user_id,
		p_path,
		v_now
	)
	ON CONFLICT (session_key)
	DO UPDATE SET
		fingerprint = EXCLUDED.fingerprint,
		user_id = COALESCE(public.page_analytics_sessions.user_id, EXCLUDED.user_id),
		last_seen_at = v_now,
		ended_at = NULL
	RETURNING id INTO v_session_id;

	UPDATE public.page_analytics_sessions
	SET entry_path = p_path
	WHERE id = v_session_id
		AND entry_path IS NULL;

	INSERT INTO public.page_analytics_visits (
		visit_key,
		session_id,
		fingerprint,
		user_id,
		path,
		route_id,
		path_group,
		content_type,
		content_slug,
		referrer_host,
		started_at
	) VALUES (
		p_visit_key,
		v_session_id,
		p_fingerprint,
		p_user_id,
		p_path,
		p_route_id,
		p_path_group,
		p_content_type,
		p_content_slug,
		p_referrer_host,
		v_now
	)
	ON CONFLICT (visit_key) DO NOTHING
	RETURNING id INTO v_visit_id;

	IF v_visit_id IS NULL THEN
		SELECT id INTO v_visit_id
		FROM public.page_analytics_visits
		WHERE visit_key = p_visit_key
		LIMIT 1;
	ELSE
		UPDATE public.page_analytics_sessions
		SET page_count = page_count + 1,
			last_seen_at = v_now
		WHERE id = v_session_id;

		PERFORM public.record_visitor_first_touch(
			p_fingerprint,
			p_path,
			p_path_group,
			p_content_type,
			p_content_slug,
			p_referrer_host,
			p_landing_query,
			p_utm_source,
			p_utm_medium,
			p_utm_campaign,
			p_utm_term,
			p_utm_content,
			p_click_id_type,
			p_click_id_value,
			v_now
		);
	END IF;

	IF public.claim_telemetry_cleanup_slot(
		'site_telemetry_cleanup',
		v_now,
		INTERVAL '6 hours'
	) THEN
		PERFORM public.cleanup_site_telemetry(v_now);
	END IF;

	RETURN QUERY SELECT v_session_id, v_visit_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_page_analytics_visit(
	UUID,
	TEXT,
	TEXT,
	UUID,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT,
	TEXT
) TO anon, authenticated;

GRANT EXECUTE ON FUNCTION public.attach_profile_first_touch(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.attach_signup_first_touch(BIGINT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_entry_surface_overview(DATE, DATE, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_cohort_retention_curve(DATE, DATE, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_acquisition_mix_by_week(DATE, DATE, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_first_session_next_paths(DATE, DATE, TEXT, INTEGER, TEXT)
	TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_retention_summary(DATE) TO authenticated;
