-- supabase/migrations/20261122170000_question_topics.sql
--
-- Question topics: a curated directory (src/lib/data/questionTaxonomy.json) that
-- Jev files questions under, replacing the 492-node AI-generated category tree.
--
-- Additive and safe to apply before the app build that uses it: nothing reads the
-- new columns or calls the new functions until that build is live, and existing
-- category pages keep working until `pnpm questions:classify -- --write` runs.
--
--   * question_categories.topic_key  marks a row as part of the current directory.
--     Rows without it are the legacy tree; they stay for history and redirects.
--   * question_category_tags.source  says who filed the question there. Jev never
--     overwrites topics an owner or admin picked.
--   * question_classifications       keeps Jev's latest scores per question, so a
--     changed question or a changed directory is re-scored and nothing else is.
--   * apply_question_topics          the one writer for topic membership.

ALTER TABLE public.question_categories
	ADD COLUMN IF NOT EXISTS topic_key text,
	ADD COLUMN IF NOT EXISTS scope text;

CREATE UNIQUE INDEX IF NOT EXISTS question_categories_topic_key_key
	ON public.question_categories (topic_key)
	WHERE topic_key IS NOT NULL;

ALTER TABLE public.question_category_tags
	ADD COLUMN IF NOT EXISTS fit smallint,
	ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'legacy';

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint WHERE conname = 'question_category_tags_source_check'
	) THEN
		ALTER TABLE public.question_category_tags
			ADD CONSTRAINT question_category_tags_source_check
			CHECK (source IN ('legacy', 'jev', 'owner', 'admin'));
	END IF;
END
$$;

CREATE INDEX IF NOT EXISTS question_category_tags_tag_id_idx
	ON public.question_category_tags (tag_id);

-- What every question was filed under before the first switch.
CREATE TABLE IF NOT EXISTS public.question_category_tags_backup_20261122 AS
SELECT mapping.question_id, mapping.tag_id, category.category_name, now() AS captured_at
FROM public.question_category_tags AS mapping
LEFT JOIN public.question_categories AS category ON category.id = mapping.tag_id;

ALTER TABLE public.question_category_tags_backup_20261122 ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.question_classifications (
	question_id bigint PRIMARY KEY REFERENCES public.questions (id) ON DELETE CASCADE,
	input_hash text NOT NULL,
	taxonomy_hash text NOT NULL,
	model text NOT NULL,
	-- applied: Jev's topics were filed. abstained: nothing fit; a person should look.
	-- kept_manual: an owner or admin already chose topics, so Jev's are only recorded.
	status text NOT NULL CHECK (status IN ('applied', 'abstained', 'kept_manual')),
	topics jsonb NOT NULL DEFAULT '[]'::jsonb,
	candidates jsonb NOT NULL DEFAULT '[]'::jsonb,
	scores jsonb NOT NULL DEFAULT '{}'::jsonb,
	classified_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS question_classifications_taxonomy_hash_idx
	ON public.question_classifications (taxonomy_hash);

ALTER TABLE public.question_classifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS question_classifications_admin_read ON public.question_classifications;
CREATE POLICY question_classifications_admin_read
	ON public.question_classifications
	FOR SELECT
	TO authenticated
	USING ((SELECT public.is_admin()));

-- Make question_categories match the directory file. Topics arrive parents first as
-- [{ key, parent, label, scope, depth }]. A legacy row that already owns a topic's
-- URL is adopted (it keeps its id, slug and intro) instead of duplicated.
CREATE OR REPLACE FUNCTION public.sync_question_taxonomy(p_topics jsonb)
RETURNS TABLE (topic_key text, category_id integer, slug text, action text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'pg_catalog', 'public', 'pg_temp'
AS $function$
#variable_conflict use_column
DECLARE
	topic jsonb;
	v_key text;
	v_label text;
	v_scope text;
	v_level integer;
	v_parent_id integer;
	v_id integer;
	v_action text;
BEGIN
	IF auth.role() IS DISTINCT FROM 'service_role' AND NOT public.is_admin() THEN
		RAISE EXCEPTION 'sync_question_taxonomy is limited to admins';
	END IF;
	IF jsonb_typeof(p_topics) IS DISTINCT FROM 'array' OR jsonb_array_length(p_topics) = 0 THEN
		RAISE EXCEPTION 'sync_question_taxonomy needs a non-empty topic list';
	END IF;

	FOR topic IN SELECT value FROM jsonb_array_elements(p_topics)
	LOOP
		v_key := topic ->> 'key';
		v_label := topic ->> 'label';
		v_scope := topic ->> 'scope';
		v_level := (topic ->> 'depth')::integer;
		v_parent_id := NULL;

		IF topic ->> 'parent' IS NOT NULL THEN
			SELECT category.id INTO v_parent_id
			FROM public.question_categories AS category
			WHERE category.topic_key = topic ->> 'parent';
			IF v_parent_id IS NULL THEN
				RAISE EXCEPTION 'Topic % lists parent % before it was synced', v_key, topic ->> 'parent';
			END IF;
		END IF;

		SELECT category.id INTO v_id
		FROM public.question_categories AS category
		WHERE category.topic_key = v_key;
		v_action := 'unchanged';

		IF v_id IS NULL THEN
			SELECT category.id INTO v_id
			FROM public.question_categories AS category
			WHERE category.topic_key IS NULL
				AND category.slug = public.slugify_question_category_name(v_label);

			IF v_id IS NOT NULL THEN
				v_action := 'adopted';
			ELSE
				SELECT GREATEST(COALESCE(MAX(category.id), 0), 1000) + 1 INTO v_id
				FROM public.question_categories AS category;
				INSERT INTO public.question_categories (id, category_name, parent_id, level, topic_key, scope)
				VALUES (v_id, v_label, v_parent_id, v_level, v_key, v_scope);
				v_action := 'created';
			END IF;
		END IF;

		UPDATE public.question_categories AS category
		SET category_name = v_label,
			parent_id = v_parent_id,
			level = v_level,
			topic_key = v_key,
			scope = v_scope
		WHERE category.id = v_id
			AND (category.category_name, category.parent_id, category.level, category.topic_key, category.scope)
				IS DISTINCT FROM (v_label, v_parent_id, v_level, v_key, v_scope);
		IF FOUND AND v_action = 'unchanged' THEN
			v_action := 'updated';
		END IF;

		RETURN QUERY
		SELECT v_key, category.id, category.slug, v_action
		FROM public.question_categories AS category
		WHERE category.id = v_id;
	END LOOP;

	-- A topic dropped from the file leaves the directory but keeps its row.
	RETURN QUERY
	WITH retired AS (
		UPDATE public.question_categories AS category
		SET topic_key = NULL
		WHERE category.topic_key IS NOT NULL
			AND NOT EXISTS (
				SELECT 1 FROM jsonb_array_elements(p_topics) AS listed
				WHERE listed.value ->> 'key' = category.topic_key
			)
		RETURNING category.id, category.slug
	)
	SELECT NULL::text, retired.id, retired.slug, 'retired'::text FROM retired;
END;
$function$;

-- File one question under topics, in one transaction: the live mapping, the two
-- legacy mapping tables older readers still use, stale category intros, and (for
-- Jev) the stored scores. It never touches flagged, tagged or removed.
--
--   p_topics          [{ "key": "parenting", "fit": 99 }] or [{ "id": 1012 }]
--   p_source          'jev' | 'owner' | 'admin'
--   p_classification  { input_hash, taxonomy_hash, model, candidates, scores } for Jev
CREATE OR REPLACE FUNCTION public.apply_question_topics(
	p_question_id bigint,
	p_topics jsonb,
	p_source text,
	p_classification jsonb DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'pg_catalog', 'public', 'extensions', 'pg_temp'
AS $function$
DECLARE
	v_author uuid;
	v_is_service boolean := auth.role() IS NOT DISTINCT FROM 'service_role';
	v_is_admin boolean := public.is_admin();
	v_requested integer;
	v_new_ids integer[];
	v_new_fits smallint[];
	v_old_ids integer[];
	v_kept_manual boolean := false;
	v_changed boolean := false;
	v_status text;
BEGIN
	IF p_source NOT IN ('jev', 'owner', 'admin') THEN
		RAISE EXCEPTION 'Unknown topic source %', p_source;
	END IF;

	SELECT question.author_id INTO v_author
	FROM public.questions AS question
	WHERE question.id = p_question_id;
	IF NOT FOUND THEN
		RAISE EXCEPTION 'Question % not found', p_question_id;
	END IF;

	IF NOT (
		v_is_service
		OR v_is_admin
		OR (p_source = 'owner' AND v_author IS NOT NULL AND v_author = auth.uid())
	) THEN
		RAISE EXCEPTION 'Not allowed to change topics for question %', p_question_id;
	END IF;

	p_topics := COALESCE(p_topics, '[]'::jsonb);
	IF jsonb_typeof(p_topics) <> 'array' THEN
		RAISE EXCEPTION 'p_topics must be an array';
	END IF;
	v_requested := jsonb_array_length(p_topics);

	SELECT COALESCE(array_agg(resolved.id ORDER BY resolved.id), '{}'),
		COALESCE(array_agg(resolved.fit ORDER BY resolved.id), '{}')
	INTO v_new_ids, v_new_fits
	FROM (
		SELECT category.id, MAX(ROUND((listed.value ->> 'fit')::numeric))::smallint AS fit
		FROM jsonb_array_elements(p_topics) AS listed
		JOIN public.question_categories AS category
			ON (listed.value ? 'key' AND category.topic_key = listed.value ->> 'key')
			OR (NOT listed.value ? 'key' AND category.id = (listed.value ->> 'id')::integer)
		GROUP BY category.id
	) AS resolved;

	IF COALESCE(array_length(v_new_ids, 1), 0) <> v_requested THEN
		RAISE EXCEPTION 'One or more topics are unknown or repeated';
	END IF;

	-- An owner picks from the current directory, below its seven headings.
	IF p_source = 'owner' AND NOT (v_is_service OR v_is_admin) THEN
		IF v_requested = 0 OR v_requested > 3 THEN
			RAISE EXCEPTION 'Pick between one and three topics';
		END IF;
		IF EXISTS (
			SELECT 1
			FROM public.question_categories AS category
			WHERE category.id = ANY (v_new_ids)
				AND (category.topic_key IS NULL OR category.parent_id IS NULL)
		) THEN
			RAISE EXCEPTION 'Pick topics from the current directory';
		END IF;
	END IF;

	SELECT COALESCE(array_agg(mapping.tag_id ORDER BY mapping.tag_id), '{}')
	INTO v_old_ids
	FROM public.question_category_tags AS mapping
	WHERE mapping.question_id = p_question_id;

	v_kept_manual := p_source = 'jev' AND EXISTS (
		SELECT 1
		FROM public.question_category_tags AS mapping
		WHERE mapping.question_id = p_question_id
			AND mapping.source IN ('owner', 'admin')
	);

	IF NOT v_kept_manual THEN
		v_changed := v_old_ids IS DISTINCT FROM v_new_ids;

		DELETE FROM public.question_category_tags AS mapping
		WHERE mapping.question_id = p_question_id;

		INSERT INTO public.question_category_tags (question_id, tag_id, fit, source)
		SELECT p_question_id, requested.category_id, requested.fit, p_source
		FROM unnest(v_new_ids, v_new_fits) AS requested (category_id, fit);

		INSERT INTO public.question_tag (tag_id, tag_name, subcategory_id)
		SELECT category.id, category.category_name, NULL
		FROM public.question_categories AS category
		WHERE category.id = ANY (v_new_ids)
		ON CONFLICT (tag_id) DO UPDATE SET tag_name = EXCLUDED.tag_name;

		DELETE FROM public.question_tags AS legacy
		WHERE legacy.question_id = p_question_id;

		INSERT INTO public.question_tags (question_id, tag_id)
		SELECT p_question_id, requested.category_id
		FROM unnest(v_new_ids) AS requested (category_id);

		IF v_changed THEN
			WITH RECURSIVE affected AS (
				SELECT category.id, category.parent_id
				FROM public.question_categories AS category
				WHERE category.id = ANY (v_old_ids || v_new_ids)

				UNION

				SELECT parent.id, parent.parent_id
				FROM public.question_categories AS parent
				JOIN affected ON affected.parent_id = parent.id
			)
			UPDATE public.question_categories AS category
			SET intro_status = CASE
					WHEN NULLIF(btrim(COALESCE(category.intro_markdown, '')), '') IS NOT NULL THEN 'stale'
					ELSE 'missing'
				END,
				intro_context = (
					CASE
						WHEN jsonb_typeof(category.intro_context) = 'object' THEN category.intro_context
						ELSE '{}'::jsonb
					END
				) || jsonb_build_object(
					'lastError', NULL,
					'staleAt', CASE
						WHEN NULLIF(btrim(COALESCE(category.intro_markdown, '')), '') IS NOT NULL
							THEN to_jsonb(now())
						ELSE 'null'::jsonb
					END
				)
			WHERE category.id IN (SELECT affected.id FROM affected);
		END IF;
	END IF;

	IF p_source = 'jev' AND p_classification IS NOT NULL THEN
		v_status := CASE
			WHEN v_kept_manual THEN 'kept_manual'
			WHEN v_requested = 0 THEN 'abstained'
			ELSE 'applied'
		END;

		INSERT INTO public.question_classifications AS stored (
			question_id, input_hash, taxonomy_hash, model, status, topics, candidates, scores, classified_at
		)
		VALUES (
			p_question_id,
			p_classification ->> 'input_hash',
			p_classification ->> 'taxonomy_hash',
			p_classification ->> 'model',
			v_status,
			p_topics,
			COALESCE(p_classification -> 'candidates', '[]'::jsonb),
			COALESCE(p_classification -> 'scores', '{}'::jsonb),
			now()
		)
		ON CONFLICT (question_id) DO UPDATE
		SET input_hash = EXCLUDED.input_hash,
			taxonomy_hash = EXCLUDED.taxonomy_hash,
			model = EXCLUDED.model,
			status = EXCLUDED.status,
			topics = EXCLUDED.topics,
			candidates = EXCLUDED.candidates,
			scores = EXCLUDED.scores,
			classified_at = EXCLUDED.classified_at;
	END IF;

	RETURN jsonb_build_object(
		'applied', NOT v_kept_manual,
		'changed', v_changed,
		'kept_manual', v_kept_manual,
		'topic_ids', to_jsonb(CASE WHEN v_kept_manual THEN v_old_ids ELSE v_new_ids END),
		'previous_topic_ids', to_jsonb(v_old_ids)
	);
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.sync_question_taxonomy(jsonb) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.apply_question_topics(bigint, jsonb, text, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.sync_question_taxonomy(jsonb) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.apply_question_topics(bigint, jsonb, text, jsonb) TO authenticated, service_role;
