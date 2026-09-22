-- docs/growth/the-nine/scorecard.sql
-- Run: ./scripts/db-query.sh "$(cat docs/growth/the-nine/scorecard.sql)"
--
-- The Nine scorecard: weekly Reddit/X arrivals and the takes they produced.
-- via_bio_link = arrived through the UTM-tagged link in DJ's Reddit bio (the only
-- traffic this playbook can claim). Baseline before 2026-09-22: ~20 Reddit
-- visitors/month from other sources, so untagged arrivals are mostly noise.
WITH admin_fps AS (
	SELECT DISTINCT v.fingerprint
	FROM page_analytics_visits v
	JOIN profiles p ON p.id = v.user_id
	WHERE p.admin IS TRUE AND v.fingerprint IS NOT NULL
),
arrivals AS (
	SELECT fingerprint,
		min(started_at) AS first_seen,
		min(acquisition_source) AS source,
		bool_or(utm_source = 'reddit' AND utm_medium = 'profile') AS via_bio_link
	FROM page_analytics_visits
	WHERE started_at >= now() - interval '30 days'
		AND acquisition_source IN ('social/reddit', 'social/x')
		AND fingerprint IS NOT NULL
		AND fingerprint NOT IN (SELECT fingerprint FROM admin_fps)
	GROUP BY fingerprint
)
SELECT date_trunc('week', a.first_seen)::date AS wk,
	a.source,
	count(DISTINCT a.fingerprint) AS visitors,
	count(DISTINCT a.fingerprint) FILTER (WHERE a.via_bio_link) AS via_bio_link,
	count(DISTINCT c.id) AS takes,
	count(DISTINCT c.id) FILTER (WHERE a.via_bio_link) AS takes_via_bio_link
FROM arrivals a
LEFT JOIN comments c
	ON c.fingerprint = a.fingerprint
	AND c.created_at >= a.first_seen
	AND c.removed IS NOT TRUE
GROUP BY 1, 2
ORDER BY 1 DESC, 2;
