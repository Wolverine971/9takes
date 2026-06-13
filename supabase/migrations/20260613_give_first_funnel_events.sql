-- supabase/migrations/20260613_give_first_funnel_events.sql
-- Created: 2026-06-13
-- Instruments the give-first wall so the lurker activation funnel is queryable:
--   gate_shown   -> an anonymous (or not-yet-answered) visitor was shown the
--                   locked comments wall on a question
--   contribution -> that same visitor (joined by fingerprint) submitted their
--                   first comment, unlocking the wall
--
-- Unlike content_access_events (which self-purges after 7 days for rate-limiting),
-- this table is durable so we can track conversion trends over time.
--
-- Canonical funnel query (copy into the weekly growth audit):
--   WITH gate AS (
--     SELECT DISTINCT fingerprint FROM give_first_funnel_events WHERE event_type = 'gate_shown'
--   ), contrib AS (
--     SELECT DISTINCT fingerprint FROM give_first_funnel_events WHERE event_type = 'contribution'
--   )
--   SELECT
--     (SELECT count(*) FROM gate)                                                   AS gate_shown,
--     (SELECT count(*) FROM contrib)                                                AS contributed,
--     (SELECT count(*) FROM contrib WHERE fingerprint IN (SELECT fingerprint FROM gate)) AS gate_then_contributed;
--
-- Time-to-first-contribution (median seconds):
--   SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (c.first_at - g.first_at)))
--   FROM (SELECT fingerprint, min(created_at) first_at FROM give_first_funnel_events WHERE event_type='gate_shown' GROUP BY 1) g
--   JOIN (SELECT fingerprint, min(created_at) first_at FROM give_first_funnel_events WHERE event_type='contribution' GROUP BY 1) c
--     USING (fingerprint)
--   WHERE c.first_at >= g.first_at;

CREATE TABLE IF NOT EXISTS public.give_first_funnel_events (
	id BIGSERIAL PRIMARY KEY,
	fingerprint TEXT NOT NULL,
	event_type TEXT NOT NULL CHECK (event_type IN ('gate_shown', 'contribution')),
	question_id BIGINT NOT NULL,
	path TEXT,
	user_id UUID,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One row per (visitor, event, question): keeps the table small and makes
-- "distinct fingerprints" the natural funnel grain. Earliest occurrence wins
-- (ON CONFLICT DO NOTHING below) so time-to-first-contribution stays accurate.
CREATE UNIQUE INDEX IF NOT EXISTS uq_give_first_funnel_event
	ON public.give_first_funnel_events (fingerprint, event_type, question_id);

CREATE INDEX IF NOT EXISTS idx_give_first_funnel_event_type_created_at
	ON public.give_first_funnel_events (event_type, created_at DESC);

ALTER TABLE public.give_first_funnel_events ENABLE ROW LEVEL SECURITY;

-- No RLS policies: writes go through the SECURITY DEFINER RPC below, reads go
-- through the service role / direct DB connection (analytics). The anon and
-- authenticated roles can only reach the table via record_give_first_event.

CREATE OR REPLACE FUNCTION public.record_give_first_event(
	p_fingerprint TEXT,
	p_event_type TEXT,
	p_question_id BIGINT,
	p_path TEXT DEFAULT NULL,
	p_user_id UUID DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
	IF COALESCE(BTRIM(p_fingerprint), '') = ''
		OR p_event_type NOT IN ('gate_shown', 'contribution')
		OR p_question_id IS NULL THEN
		RETURN;
	END IF;

	INSERT INTO public.give_first_funnel_events (
		fingerprint,
		event_type,
		question_id,
		path,
		user_id
	) VALUES (
		p_fingerprint,
		p_event_type,
		p_question_id,
		NULLIF(BTRIM(COALESCE(p_path, '')), ''),
		p_user_id
	)
	ON CONFLICT (fingerprint, event_type, question_id) DO NOTHING;
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_give_first_event(
	TEXT,
	TEXT,
	BIGINT,
	TEXT,
	UUID
) TO anon, authenticated;
