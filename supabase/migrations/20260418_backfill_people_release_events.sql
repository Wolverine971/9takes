-- supabase/migrations/20260418_backfill_people_release_events.sql
-- Backfill publish events for personality releases created before release-event automation.

INSERT INTO public.content_release_events (
	content_type,
	content_slug,
	path,
	event_type,
	event_at,
	source,
	metadata
)
SELECT
	'people' AS content_type,
	public.analytics_normalize_content_slug(b.person) AS content_slug,
	'/personality-analysis/' || public.analytics_normalize_content_slug(b.person) AS path,
	'published' AS event_type,
	COALESCE(
		b.first_published_at,
		b.published_at,
		b.created_at,
		CASE
			WHEN b.date::TEXT ~ '^\d{4}-\d{2}-\d{2}$'
			THEN ((b.date::DATE + TIME '12:00') AT TIME ZONE 'America/New_York')
			ELSE NOW()
		END
	) AS event_at,
	'release-event-backfill' AS source,
	jsonb_build_object(
		'blog_id',
		b.id,
		'title',
		b.title,
		'backfilled',
		TRUE
	) AS metadata
FROM public.blogs_famous_people b
WHERE b.published IS TRUE
	AND COALESCE(NULLIF(BTRIM(b.person), ''), '') <> ''
	AND NOT EXISTS (
		SELECT 1
		FROM public.content_release_events e
		WHERE e.content_type = 'people'
			AND e.content_slug = public.analytics_normalize_content_slug(b.person)
			AND e.event_type = 'published'
	);
