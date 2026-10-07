-- supabase/migrations/20261006120000_enneagram_test.sql
--
-- The 9takes Enneagram test (T-42). Two tables:
--   enneagram_test_results  one row per finished test. Anonymous: no user id,
--                           no answers beyond the picks. Email is stored only
--                           when the test-taker opts in to hear about reads.
--   enneagram_test_reads    one row per friend who answered the test-taker's
--                           link ("ask someone who knows you").
-- Two tokens per result, so the link a friend gets never opens the private
-- result page:
--   result_token  the test-taker's private result URL
--   read_token    the link they send to friends
-- Written and read only with the service role. Admins can read like the other
-- audit tables.

CREATE TABLE IF NOT EXISTS public.enneagram_test_results (
	id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	result_token TEXT NOT NULL UNIQUE CHECK (result_token ~ '^[A-Za-z0-9_-]{20,64}$'),
	read_token TEXT NOT NULL UNIQUE CHECK (read_token ~ '^[A-Za-z0-9_-]{10,64}$'),
	types SMALLINT[] NOT NULL CHECK (
		cardinality(types) BETWEEN 1 AND 2
		AND types <@ ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9]::SMALLINT[]
	),
	emotion TEXT NOT NULL CHECK (emotion IN ('anger', 'shame', 'fear')),
	strength TEXT NOT NULL CHECK (strength IN ('anger', 'shame', 'fear')),
	path JSONB NOT NULL DEFAULT '{}'::JSONB,
	display_name TEXT CHECK (char_length(display_name) <= 40),
	notify_email TEXT CHECK (char_length(notify_email) <= 254),
	notify_opted_in_at TIMESTAMPTZ,
	notify_sent_count INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS enneagram_test_results_created_at_idx
	ON public.enneagram_test_results (created_at DESC);

CREATE TABLE IF NOT EXISTS public.enneagram_test_reads (
	id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	result_id BIGINT NOT NULL REFERENCES public.enneagram_test_results (id) ON DELETE CASCADE,
	picked_type SMALLINT NOT NULL CHECK (picked_type BETWEEN 1 AND 9),
	emotion TEXT NOT NULL CHECK (emotion IN ('anger', 'shame', 'fear')),
	strength TEXT NOT NULL CHECK (strength IN ('anger', 'shame', 'fear')),
	reader_name TEXT CHECK (char_length(reader_name) <= 40),
	note TEXT CHECK (char_length(note) <= 280),
	notified_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS enneagram_test_reads_result_id_created_at_idx
	ON public.enneagram_test_reads (result_id, created_at);

ALTER TABLE public.enneagram_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enneagram_test_reads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS audit_admin_management ON public.enneagram_test_results;
CREATE POLICY audit_admin_management ON public.enneagram_test_results
	FOR ALL TO authenticated
	USING ((SELECT public.is_admin()))
	WITH CHECK ((SELECT public.is_admin()));

DROP POLICY IF EXISTS audit_admin_management ON public.enneagram_test_reads;
CREATE POLICY audit_admin_management ON public.enneagram_test_reads
	FOR ALL TO authenticated
	USING ((SELECT public.is_admin()))
	WITH CHECK ((SELECT public.is_admin()));

COMMENT ON TABLE public.enneagram_test_results IS
	'Enneagram test results (T-42). Anonymous; email only on opt-in. Service-role writes only.';
COMMENT ON TABLE public.enneagram_test_reads IS
	'Friend reads on an Enneagram test result (the "ask someone who knows you" link).';
