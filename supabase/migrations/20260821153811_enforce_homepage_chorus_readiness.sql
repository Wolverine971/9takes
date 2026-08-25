-- supabase/migrations/20260821153811_enforce_homepage_chorus_readiness.sql
-- A homepage answer is submitted through /api/nine/mirror, which can only
-- complete when the backing question has exactly nine cached takes. Keep the
-- distributor's eligibility contract aligned with that endpoint so a public
-- question can never be featured before its chorus is ready.

CREATE OR REPLACE FUNCTION public.is_question_chorus_ready(p_question_id BIGINT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
	SELECT EXISTS (
		SELECT 1
		FROM public.questions q
		JOIN public.nine_takes n
			ON n.subject_type = 'question'
			AND n.subject_slug = q.url
		WHERE q.id = p_question_id
			AND COALESCE(q.removed, FALSE) = FALSE
			AND COALESCE(q.flagged, FALSE) = FALSE
			AND COALESCE(
				NULLIF(BTRIM(q.question_formatted), ''),
				NULLIF(BTRIM(q.question), '')
			) IS NOT NULL
			AND NULLIF(BTRIM(COALESCE(q.url, '')), '') IS NOT NULL
			AND CASE
				WHEN jsonb_typeof(n.takes) = 'array' THEN jsonb_array_length(n.takes) = 9
				ELSE FALSE
			END
	);
$$;

COMMENT ON FUNCTION public.is_question_chorus_ready(BIGINT) IS
	'True only when a public question has the complete nine-take chorus required by /api/nine/mirror.';

CREATE OR REPLACE FUNCTION public.get_current_homepage_feature()
RETURNS TABLE (
	run_id BIGINT,
	question_id BIGINT,
	question_text TEXT,
	question_url TEXT,
	started_at TIMESTAMPTZ,
	ends_at TIMESTAMPTZ,
	target_unique_impressions INTEGER,
	qualified_unique_impressions INTEGER,
	selection_mode TEXT,
	is_fallback BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
	v_run public.question_feature_runs%ROWTYPE;
BEGIN
	PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('homepage-question-feature-run'));

	UPDATE public.question_feature_runs AS r
	SET status = 'ended',
		ended_at = NOW(),
		ended_reason = CASE
			WHEN r.qualified_unique_impressions >= r.target_unique_impressions THEN 'impression_target'
			ELSE 'duration_limit'
		END,
		paused_at = NULL,
		updated_at = NOW()
	WHERE r.status = 'active'
		AND (
			r.qualified_unique_impressions >= r.target_unique_impressions
			OR r.ends_at <= NOW()
		);

	UPDATE public.question_feature_runs AS r
	SET status = 'ended',
		ended_at = NOW(),
		ended_reason = 'ineligible',
		paused_at = NULL,
		updated_at = NOW()
	WHERE r.status = 'active'
		AND NOT public.is_question_chorus_ready(r.question_id);

	SELECT r.*
	INTO v_run
	FROM public.question_feature_runs r
	WHERE r.status = 'active'
	LIMIT 1;

	IF FOUND THEN
		RETURN QUERY
		SELECT
			v_run.id,
			q.id,
			COALESCE(NULLIF(BTRIM(q.question_formatted), ''), NULLIF(BTRIM(q.question), '')),
			q.url,
			v_run.started_at,
			v_run.ends_at,
			v_run.target_unique_impressions,
			v_run.qualified_unique_impressions,
			v_run.selection_mode,
			FALSE
		FROM public.questions q
		WHERE q.id = v_run.question_id
			AND public.is_question_chorus_ready(q.id);
		RETURN;
	END IF;

	RETURN QUERY
	SELECT
		NULL::BIGINT,
		q.id,
		COALESCE(NULLIF(BTRIM(q.question_formatted), ''), NULLIF(BTRIM(q.question), '')),
		q.url,
		NULL::TIMESTAMPTZ,
		NULL::TIMESTAMPTZ,
		s.default_target_unique_impressions,
		0,
		'fallback'::TEXT,
		TRUE
	FROM public.question_distribution_settings s
	JOIN public.questions q ON q.id = s.fallback_question_id
	WHERE s.id = TRUE
		AND public.is_question_chorus_ready(q.id)
	LIMIT 1;
END;
$$;

CREATE OR REPLACE FUNCTION public.start_question_feature_run(
	p_question_id BIGINT,
	p_reason_selected TEXT,
	p_selection_mode TEXT DEFAULT 'manual',
	p_target_unique_impressions INTEGER DEFAULT NULL,
	p_max_duration_days INTEGER DEFAULT NULL,
	p_operator_notes TEXT DEFAULT NULL,
	p_created_by UUID DEFAULT NULL
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
	v_settings public.question_distribution_settings%ROWTYPE;
	v_target INTEGER;
	v_days INTEGER;
	v_run_id BIGINT;
BEGIN
	PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('homepage-question-feature-run'));

	SELECT * INTO v_settings
	FROM public.question_distribution_settings
	WHERE id = TRUE;

	v_target := COALESCE(p_target_unique_impressions, v_settings.default_target_unique_impressions, 30);
	v_days := COALESCE(p_max_duration_days, v_settings.default_max_duration_days, 7);

	IF p_selection_mode NOT IN ('manual', 'queue', 'fallback') THEN
		RAISE EXCEPTION 'Invalid selection mode';
	END IF;
	IF CHAR_LENGTH(BTRIM(COALESCE(p_reason_selected, ''))) NOT BETWEEN 1 AND 500 THEN
		RAISE EXCEPTION 'Selection reason is required and must be at most 500 characters';
	END IF;
	IF v_target NOT BETWEEN 1 AND 100000 THEN
		RAISE EXCEPTION 'Impression target must be between 1 and 100000';
	END IF;
	IF v_days NOT BETWEEN 1 AND 90 THEN
		RAISE EXCEPTION 'Maximum duration must be between 1 and 90 days';
	END IF;
	IF CHAR_LENGTH(COALESCE(p_operator_notes, '')) > 2000 THEN
		RAISE EXCEPTION 'Operator notes must be at most 2000 characters';
	END IF;
	IF NOT public.is_question_chorus_ready(p_question_id) THEN
		RAISE EXCEPTION 'Question is not eligible to be featured: a complete nine-take chorus is required';
	END IF;

	UPDATE public.question_feature_runs
	SET status = 'ended',
		ended_at = NOW(),
		ended_reason = 'replaced',
		paused_at = NULL,
		updated_at = NOW()
	WHERE status IN ('active', 'paused');

	INSERT INTO public.question_feature_runs (
		question_id,
		started_at,
		ends_at,
		reason_selected,
		selection_mode,
		target_unique_impressions,
		max_duration_days,
		operator_notes,
		created_by
	) VALUES (
		p_question_id,
		NOW(),
		NOW() + pg_catalog.make_interval(days => v_days),
		BTRIM(p_reason_selected),
		p_selection_mode,
		v_target,
		v_days,
		NULLIF(BTRIM(COALESCE(p_operator_notes, '')), ''),
		p_created_by
	)
	RETURNING id INTO v_run_id;

	RETURN v_run_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.control_question_feature_run(
	p_run_id BIGINT,
	p_action TEXT,
	p_extension_days INTEGER DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
	v_run public.question_feature_runs%ROWTYPE;
	v_pause_duration INTERVAL;
BEGIN
	PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext('homepage-question-feature-run'));

	SELECT * INTO v_run
	FROM public.question_feature_runs
	WHERE id = p_run_id
	FOR UPDATE;

	IF NOT FOUND THEN
		RAISE EXCEPTION 'Feature run not found';
	END IF;

	IF p_action = 'pause' THEN
		IF v_run.status <> 'active' THEN
			RAISE EXCEPTION 'Only an active run can be paused';
		END IF;
		UPDATE public.question_feature_runs
		SET status = 'paused', paused_at = NOW(), updated_at = NOW()
		WHERE id = p_run_id;
	ELSIF p_action = 'resume' THEN
		IF v_run.status <> 'paused' OR v_run.paused_at IS NULL THEN
			RAISE EXCEPTION 'Only a paused run can be resumed';
		END IF;
		IF EXISTS (
			SELECT 1 FROM public.question_feature_runs
			WHERE status = 'active' AND id <> p_run_id
		) THEN
			RAISE EXCEPTION 'Another feature run is already active';
		END IF;
		IF NOT public.is_question_chorus_ready(v_run.question_id) THEN
			RAISE EXCEPTION 'Question is no longer eligible to be featured: a complete nine-take chorus is required';
		END IF;
		v_pause_duration := NOW() - v_run.paused_at;
		UPDATE public.question_feature_runs
		SET status = 'active',
			paused_at = NULL,
			ends_at = ends_at + v_pause_duration,
			updated_at = NOW()
		WHERE id = p_run_id;
	ELSIF p_action = 'extend' THEN
		IF v_run.status NOT IN ('active', 'paused') THEN
			RAISE EXCEPTION 'Only an active or paused run can be extended';
		END IF;
		IF p_extension_days IS NULL OR p_extension_days NOT BETWEEN 1 AND 90 THEN
			RAISE EXCEPTION 'Extension must be between 1 and 90 days';
		END IF;
		IF v_run.max_duration_days + p_extension_days > 90 THEN
			RAISE EXCEPTION 'Total feature duration cannot exceed 90 days';
		END IF;
		UPDATE public.question_feature_runs
		SET ends_at = ends_at + pg_catalog.make_interval(days => p_extension_days),
			max_duration_days = max_duration_days + p_extension_days,
			updated_at = NOW()
		WHERE id = p_run_id;
	ELSIF p_action = 'stop' THEN
		IF v_run.status NOT IN ('active', 'paused') THEN
			RAISE EXCEPTION 'Run has already ended';
		END IF;
		UPDATE public.question_feature_runs
		SET status = 'ended',
			ended_at = NOW(),
			ended_reason = 'operator_stopped',
			paused_at = NULL,
			updated_at = NOW()
		WHERE id = p_run_id;
	ELSE
		RAISE EXCEPTION 'Invalid feature run action';
	END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_homepage_fallback_question(
	p_question_id BIGINT,
	p_updated_by UUID DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
	IF NOT public.is_question_chorus_ready(p_question_id) THEN
		RAISE EXCEPTION 'Question is not eligible to be the fallback: a complete nine-take chorus is required';
	END IF;

	UPDATE public.question_distribution_settings
	SET fallback_question_id = p_question_id,
		updated_at = NOW(),
		updated_by = p_updated_by
	WHERE id = TRUE;
END;
$$;

-- End any currently broken run as soon as this migration lands instead of
-- waiting for another homepage request to invoke get_current_homepage_feature.
UPDATE public.question_feature_runs AS r
SET status = 'ended',
	ended_at = NOW(),
	ended_reason = 'ineligible',
	paused_at = NULL,
	updated_at = NOW()
WHERE r.status = 'active'
	AND NOT public.is_question_chorus_ready(r.question_id);

REVOKE ALL ON FUNCTION public.is_question_chorus_ready(BIGINT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_current_homepage_feature() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.start_question_feature_run(BIGINT, TEXT, TEXT, INTEGER, INTEGER, TEXT, UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.control_question_feature_run(BIGINT, TEXT, INTEGER) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_homepage_fallback_question(BIGINT, UUID) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.is_question_chorus_ready(BIGINT) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_current_homepage_feature() TO service_role;
GRANT EXECUTE ON FUNCTION public.start_question_feature_run(BIGINT, TEXT, TEXT, INTEGER, INTEGER, TEXT, UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.control_question_feature_run(BIGINT, TEXT, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION public.set_homepage_fallback_question(BIGINT, UUID) TO service_role;
