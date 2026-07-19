-- supabase/migrations/20260718_harden_people_content_update.sql
-- Fail-closed, atomic update path for non-publish people-profile refreshes.
--
-- The caller must provide both the reviewed live content hash and a snapshot of
-- every parser-managed field. The function locks the row before comparing
-- either value, rejects protected/unknown fields, and updates only the explicit
-- approved patch. Release metadata and identity fields cannot be changed here.

CREATE OR REPLACE FUNCTION public.update_blogs_famous_people_if_unchanged(
	p_id BIGINT,
	p_expected_content_hash TEXT,
	p_expected_managed JSONB,
	p_patch JSONB
)
RETURNS public.blogs_famous_people
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
	v_existing public.blogs_famous_people%ROWTYPE;
	v_candidate public.blogs_famous_people%ROWTYPE;
	v_updated public.blogs_famous_people%ROWTYPE;
	v_actual_managed JSONB;
	v_allowed_keys CONSTANT TEXT[] := ARRAY[
		'title',
		'meta_title',
		'persona_title',
		'description',
		'author',
		'changefreq',
		'priority',
		'suggestions',
		'wikipedia',
		'twitter',
		'instagram',
		'tiktok',
		'content',
		'jsonld_snippet',
		'content_quality',
		'keywords',
		'same_as',
		'faqs',
		'wikidata_qid',
		'imdb_id',
		'birth_date',
		'birth_place',
		'nationality',
		'occupation',
		'knows_about',
		'citations'
	];
	v_unknown_keys TEXT[];
BEGIN
	IF p_id IS NULL THEN
		RAISE EXCEPTION 'People update requires a row id' USING ERRCODE = '22023';
	END IF;
	IF p_expected_content_hash IS NULL OR p_expected_content_hash !~ '^[0-9a-f]{32}$' THEN
		RAISE EXCEPTION 'People update requires a lowercase MD5 content hash'
			USING ERRCODE = '22023';
	END IF;
	IF p_expected_managed IS NULL OR jsonb_typeof(p_expected_managed) <> 'object' THEN
		RAISE EXCEPTION 'People update requires a managed-field snapshot'
			USING ERRCODE = '22023';
	END IF;
	IF p_patch IS NULL OR jsonb_typeof(p_patch) <> 'object' THEN
		RAISE EXCEPTION 'People update patch must be a JSON object'
			USING ERRCODE = '22023';
	END IF;

	SELECT ARRAY_AGG(key ORDER BY key)
	INTO v_unknown_keys
	FROM jsonb_object_keys(p_patch) AS key
	WHERE NOT (key = ANY (v_allowed_keys));

	IF COALESCE(array_length(v_unknown_keys, 1), 0) > 0 THEN
		RAISE EXCEPTION 'People update contains protected or unknown fields: %',
			array_to_string(v_unknown_keys, ', ')
			USING ERRCODE = '22023';
	END IF;

	-- FOR UPDATE makes the comparison and write one atomic transaction. A
	-- concurrent writer cannot slip between the reviewed snapshot and UPDATE.
	SELECT *
	INTO v_existing
	FROM public.blogs_famous_people
	WHERE id = p_id
	FOR UPDATE;

	IF NOT FOUND THEN
		RAISE EXCEPTION 'People row % does not exist; insert refused', p_id
			USING ERRCODE = 'P0002';
	END IF;

	v_actual_managed := jsonb_build_object(
		'title', v_existing.title,
		'meta_title', v_existing.meta_title,
		'persona_title', v_existing.persona_title,
		'description', v_existing.description,
		'author', v_existing.author,
		'date', v_existing.date,
		'loc', v_existing.loc,
		'lastmod', v_existing.lastmod,
		'changefreq', v_existing.changefreq,
		'priority', v_existing.priority,
		'published', v_existing.published,
		'enneagram', v_existing.enneagram,
		'type', v_existing.type,
		'person', v_existing.person,
		'suggestions', v_existing.suggestions,
		'wikipedia', v_existing.wikipedia,
		'twitter', v_existing.twitter,
		'instagram', v_existing.instagram,
		'tiktok', v_existing.tiktok,
		'content', v_existing.content,
		'jsonld_snippet', v_existing.jsonld_snippet,
		'content_quality', v_existing.content_quality,
		'keywords', v_existing.keywords,
		'same_as', v_existing.same_as,
		'faqs', v_existing.faqs,
		'wikidata_qid', v_existing.wikidata_qid,
		'imdb_id', v_existing.imdb_id,
		'birth_date', v_existing.birth_date,
		'birth_place', v_existing.birth_place,
		'nationality', v_existing.nationality,
		'occupation', v_existing.occupation,
		'knows_about', v_existing.knows_about,
		'citations', v_existing.citations
	);

	IF md5(COALESCE(v_existing.content, '')) <> p_expected_content_hash
		OR v_actual_managed IS DISTINCT FROM p_expected_managed THEN
		RAISE EXCEPTION 'People row % changed after preview; update refused', p_id
			USING ERRCODE = '40001';
	END IF;

	-- jsonb_populate_record applies PostgreSQL's real column coercions to the
	-- already-whitelisted patch. The explicit SET list remains the second,
	-- database-level defense against identity or release-field changes.
	SELECT *
	INTO v_candidate
	FROM jsonb_populate_record(v_existing, p_patch);

	UPDATE public.blogs_famous_people
	SET
		title = v_candidate.title,
		meta_title = v_candidate.meta_title,
		persona_title = v_candidate.persona_title,
		description = v_candidate.description,
		author = v_candidate.author,
		changefreq = v_candidate.changefreq,
		priority = v_candidate.priority,
		suggestions = v_candidate.suggestions,
		wikipedia = v_candidate.wikipedia,
		twitter = v_candidate.twitter,
		instagram = v_candidate.instagram,
		tiktok = v_candidate.tiktok,
		content = v_candidate.content,
		jsonld_snippet = v_candidate.jsonld_snippet,
		content_quality = v_candidate.content_quality,
		keywords = v_candidate.keywords,
		same_as = v_candidate.same_as,
		faqs = v_candidate.faqs,
		wikidata_qid = v_candidate.wikidata_qid,
		imdb_id = v_candidate.imdb_id,
		birth_date = v_candidate.birth_date,
		birth_place = v_candidate.birth_place,
		nationality = v_candidate.nationality,
		occupation = v_candidate.occupation,
		knows_about = v_candidate.knows_about,
		citations = v_candidate.citations
	WHERE id = p_id
	RETURNING * INTO v_updated;

	RETURN v_updated;
END;
$$;

REVOKE ALL ON FUNCTION public.update_blogs_famous_people_if_unchanged(
	BIGINT,
	TEXT,
	JSONB,
	JSONB
) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.update_blogs_famous_people_if_unchanged(
	BIGINT,
	TEXT,
	JSONB,
	JSONB
) TO service_role;

COMMENT ON FUNCTION public.update_blogs_famous_people_if_unchanged(
	BIGINT,
	TEXT,
	JSONB,
	JSONB
) IS 'Atomically updates an existing people article after content-hash and full parser-managed snapshot checks. Cannot change publish, lastmod, identity, date, loc, enneagram, or type.';
