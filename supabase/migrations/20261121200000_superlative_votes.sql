-- supabase/migrations/20261121200000_superlative_votes.sql
--
-- Reader votes on the "Which Enneagram type is the most…" hub
-- (/enneagram-corner/enneagram-type-rankings). Two kinds per trait:
--   me    "This is me": the reader says the trait fits them, with their type.
--   pick  "Wrong pick?": the reader's own answer to the trait, optionally with
--         their type and a short reason (kept private; for DJ's revisions).
--
-- One row per visitor per trait per kind, so a reader can change a vote but
-- not stack them. Only the server touches this table (service role): RLS is on
-- with no policies, and the summary function is service-role only.
--
-- Additive. Apply with: psql "$SUPABASE_DB_URL" -1 -f <this file>

CREATE TABLE IF NOT EXISTS public.superlative_votes (
	id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	trait text NOT NULL CHECK (trait ~ '^[a-z0-9-]{2,60}$'),
	kind text NOT NULL CHECK (kind IN ('me', 'pick')),
	voter_type smallint CHECK (voter_type BETWEEN 1 AND 9),
	picked_type smallint CHECK (picked_type BETWEEN 1 AND 9),
	reason text CHECK (char_length(reason) <= 500),
	fingerprint text NOT NULL CHECK (char_length(fingerprint) BETWEEN 1 AND 100),
	user_id uuid,
	created_at timestamptz NOT NULL DEFAULT now(),
	updated_at timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT superlative_votes_one_per_visitor UNIQUE (trait, kind, fingerprint),
	CONSTRAINT superlative_votes_me_has_type CHECK (kind <> 'me' OR voter_type IS NOT NULL),
	CONSTRAINT superlative_votes_pick_has_pick CHECK (kind <> 'pick' OR picked_type IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS superlative_votes_trait_idx ON public.superlative_votes (trait, kind);

ALTER TABLE public.superlative_votes ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.superlative_votes FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.superlative_votes TO service_role;

-- Everything the hub shows, in one round trip:
--   rows  vote counts by trait, kind, voter type and picked type
--   base  distinct voters per self-reported type, across the whole hub (the
--         denominator for "x% of 4s say this is them")
CREATE OR REPLACE FUNCTION public.superlative_vote_summary()
RETURNS jsonb
LANGUAGE sql
STABLE
AS $$
	SELECT jsonb_build_object(
		'rows', COALESCE((
			SELECT jsonb_agg(r)
			FROM (
				SELECT trait, kind, voter_type, picked_type, count(*)::int AS votes
				FROM public.superlative_votes
				GROUP BY trait, kind, voter_type, picked_type
			) r
		), '[]'::jsonb),
		'base', COALESCE((
			SELECT jsonb_agg(b)
			FROM (
				SELECT voter_type, count(DISTINCT fingerprint)::int AS voters
				FROM public.superlative_votes
				WHERE voter_type IS NOT NULL
				GROUP BY voter_type
			) b
		), '[]'::jsonb)
	)
$$;

REVOKE EXECUTE ON FUNCTION public.superlative_vote_summary() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.superlative_vote_summary() TO service_role;
