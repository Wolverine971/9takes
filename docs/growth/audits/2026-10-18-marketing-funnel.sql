-- docs/growth/audits/2026-10-18-marketing-funnel.sql
-- 9takes marketing audit, 2026-10-18. Run with scripts/db-query.sh.
-- Read-only diagnostics. Headline snapshot uses admin_engagement_trends_weekly_v2(26).
-- Visitor rollup observed at 2026-10-18 04:35 UTC; it can refresh after this audit.
-- Date boundaries use America/New_York. Production behavioral cutoff is 13:12 UTC,
-- before the audit browser exercise. Fingerprints are approximate people.
-- Sections: daily traffic; equal Mon-Sat traffic; entry sources; page depth;
-- gate by surface; launch-to-date celebrity exposure; operational diagnostics.

WITH admin_profiles AS (
		SELECT p.id, lower(btrim(p.email)) AS email
		FROM public.profiles p
		WHERE p.admin IS TRUE
	),
	admin_fingerprints AS (
		SELECT v.fingerprint
		FROM public.page_analytics_visits v
		WHERE v.user_id IN (SELECT ap.id FROM admin_profiles ap)
			AND v.fingerprint IS NOT NULL
		UNION
		SELECT c.fingerprint
		FROM public.comments c
		WHERE c.author_id IN (SELECT ap.id FROM admin_profiles ap)
			AND c.fingerprint IS NOT NULL
		UNION
		SELECT g.fingerprint
		FROM public.give_first_funnel_events g
		WHERE g.user_id IN (SELECT ap.id FROM admin_profiles ap)
			AND g.fingerprint IS NOT NULL
		UNION
		SELECT p.first_touch_fingerprint
		FROM public.profiles p
		WHERE p.admin IS TRUE
			AND p.first_touch_fingerprint IS NOT NULL
	) SELECT a.activity_date, count(distinct a.fingerprint) FILTER(where a.engaged_ms_total>=10000) as human_visitors, count(distinct a.fingerprint) as raw_visitors FROM visitor_day_activity a WHERE activity_date>='2026-10-01' AND activity_date<='2026-10-18' AND NOT EXISTS (select 1 from admin_fingerprints f where f.fingerprint=a.fingerprint) GROUP BY 1 ORDER BY 1;

WITH admin_profiles AS (
		SELECT p.id, lower(btrim(p.email)) AS email
		FROM public.profiles p
		WHERE p.admin IS TRUE
	),
	admin_fingerprints AS (
		SELECT v.fingerprint
		FROM public.page_analytics_visits v
		WHERE v.user_id IN (SELECT ap.id FROM admin_profiles ap)
			AND v.fingerprint IS NOT NULL
		UNION
		SELECT c.fingerprint
		FROM public.comments c
		WHERE c.author_id IN (SELECT ap.id FROM admin_profiles ap)
			AND c.fingerprint IS NOT NULL
		UNION
		SELECT g.fingerprint
		FROM public.give_first_funnel_events g
		WHERE g.user_id IN (SELECT ap.id FROM admin_profiles ap)
			AND g.fingerprint IS NOT NULL
		UNION
		SELECT p.first_touch_fingerprint
		FROM public.profiles p
		WHERE p.admin IS TRUE
			AND p.first_touch_fingerprint IS NOT NULL
	), humans AS (select distinct date_trunc('week',a.activity_date::timestamp)::date as week, a.fingerprint from visitor_day_activity a where activity_date>='2026-10-05' and activity_date<='2026-10-18' and engaged_ms_total>=10000 and extract(isodow from activity_date)<=6 and not exists(select 1 from admin_fingerprints f where f.fingerprint=a.fingerprint)) SELECT h.week,count(*) as humans_mon_sat FROM humans h GROUP BY 1 ORDER BY 1;

WITH admin_profiles AS (
		SELECT p.id, lower(btrim(p.email)) AS email
		FROM public.profiles p
		WHERE p.admin IS TRUE
	),
	admin_fingerprints AS (
		SELECT v.fingerprint
		FROM public.page_analytics_visits v
		WHERE v.user_id IN (SELECT ap.id FROM admin_profiles ap)
			AND v.fingerprint IS NOT NULL
		UNION
		SELECT c.fingerprint
		FROM public.comments c
		WHERE c.author_id IN (SELECT ap.id FROM admin_profiles ap)
			AND c.fingerprint IS NOT NULL
		UNION
		SELECT g.fingerprint
		FROM public.give_first_funnel_events g
		WHERE g.user_id IN (SELECT ap.id FROM admin_profiles ap)
			AND g.fingerprint IS NOT NULL
		UNION
		SELECT p.first_touch_fingerprint
		FROM public.profiles p
		WHERE p.admin IS TRUE
			AND p.first_touch_fingerprint IS NOT NULL
	), humans AS (select distinct date_trunc('week',a.activity_date::timestamp)::date as week, a.fingerprint from visitor_day_activity a where activity_date>='2026-10-05' and activity_date<='2026-10-18' and engaged_ms_total>=10000 and not exists(select 1 from admin_fingerprints f where f.fingerprint=a.fingerprint)), entry AS (select h.*,v.acquisition_source,v.referrer_host,v.path from humans h cross join lateral(select * from page_analytics_visits v where v.fingerprint=h.fingerprint and v.started_at >= h.week::timestamp at time zone 'America/New_York' and v.started_at < (h.week+7)::timestamp at time zone 'America/New_York' order by started_at limit 1) v) SELECT week,coalesce(acquisition_source,'unknown') as source,count(*),count(*) filter(where path like '/personality-analysis/%') as celebrity_landings,count(*) filter(where path='/') as home_landings FROM entry GROUP BY 1,2 ORDER BY 1,3 desc;

WITH admin_profiles AS (
		SELECT p.id, lower(btrim(p.email)) AS email
		FROM public.profiles p
		WHERE p.admin IS TRUE
	),
	admin_fingerprints AS (
		SELECT v.fingerprint
		FROM public.page_analytics_visits v
		WHERE v.user_id IN (SELECT ap.id FROM admin_profiles ap)
			AND v.fingerprint IS NOT NULL
		UNION
		SELECT c.fingerprint
		FROM public.comments c
		WHERE c.author_id IN (SELECT ap.id FROM admin_profiles ap)
			AND c.fingerprint IS NOT NULL
		UNION
		SELECT g.fingerprint
		FROM public.give_first_funnel_events g
		WHERE g.user_id IN (SELECT ap.id FROM admin_profiles ap)
			AND g.fingerprint IS NOT NULL
		UNION
		SELECT p.first_touch_fingerprint
		FROM public.profiles p
		WHERE p.admin IS TRUE
			AND p.first_touch_fingerprint IS NOT NULL
	) SELECT date_trunc('week',v.started_at at time zone 'America/New_York')::date as week,case when path='/' then 'home' when path like '/personality-analysis/%' then 'celebrity' when path like '/questions/%' then 'question detail' else path end as surface,count(distinct fingerprint) as raw_fps,count(distinct fingerprint) filter(where engaged_ms>=10000) as engaged_10s,count(distinct fingerprint) filter(where engaged_ms>=30000) as engaged_30s FROM page_analytics_visits v WHERE started_at>='2026-10-05 04:00+00' and started_at<'2026-10-18 13:12+00' and (path in ('/','/register','/login','/questions','/questions/create','/enneagram-test','/book-session') or path like '/personality-analysis/%' or path like '/questions/%') and not exists(select 1 from admin_fingerprints f where f.fingerprint=v.fingerprint) GROUP BY 1,2 ORDER BY 1,2;

WITH admin_profiles AS (
		SELECT p.id, lower(btrim(p.email)) AS email
		FROM public.profiles p
		WHERE p.admin IS TRUE
	),
	admin_fingerprints AS (
		SELECT v.fingerprint
		FROM public.page_analytics_visits v
		WHERE v.user_id IN (SELECT ap.id FROM admin_profiles ap)
			AND v.fingerprint IS NOT NULL
		UNION
		SELECT c.fingerprint
		FROM public.comments c
		WHERE c.author_id IN (SELECT ap.id FROM admin_profiles ap)
			AND c.fingerprint IS NOT NULL
		UNION
		SELECT g.fingerprint
		FROM public.give_first_funnel_events g
		WHERE g.user_id IN (SELECT ap.id FROM admin_profiles ap)
			AND g.fingerprint IS NOT NULL
		UNION
		SELECT p.first_touch_fingerprint
		FROM public.profiles p
		WHERE p.admin IS TRUE
			AND p.first_touch_fingerprint IS NOT NULL
	) SELECT date_trunc('week',g.created_at at time zone 'America/New_York')::date as week,case when path='/' then 'home' when path like '/personality-analysis/%' then 'celebrity' when path like '/questions/%' or path is null then 'question' else 'blog embed' end as surface,count(distinct fingerprint) filter(where event_type='gate_shown') as gate_fps,count(distinct fingerprint) filter(where event_type='contribution') as contribution_fps FROM give_first_funnel_events g WHERE g.created_at>='2026-10-03 04:00+00' and g.created_at<'2026-10-18 13:12+00' and not exists(select 1 from admin_fingerprints f where f.fingerprint=g.fingerprint) and not exists(select 1 from admin_profiles p where p.id=g.user_id) GROUP BY 1,2 ORDER BY 1,2;

WITH admin_profiles AS (
		SELECT p.id, lower(btrim(p.email)) AS email
		FROM public.profiles p
		WHERE p.admin IS TRUE
	),
	admin_fingerprints AS (
		SELECT v.fingerprint
		FROM public.page_analytics_visits v
		WHERE v.user_id IN (SELECT ap.id FROM admin_profiles ap)
			AND v.fingerprint IS NOT NULL
		UNION
		SELECT c.fingerprint
		FROM public.comments c
		WHERE c.author_id IN (SELECT ap.id FROM admin_profiles ap)
			AND c.fingerprint IS NOT NULL
		UNION
		SELECT g.fingerprint
		FROM public.give_first_funnel_events g
		WHERE g.user_id IN (SELECT ap.id FROM admin_profiles ap)
			AND g.fingerprint IS NOT NULL
		UNION
		SELECT p.first_touch_fingerprint
		FROM public.profiles p
		WHERE p.admin IS TRUE
			AND p.first_touch_fingerprint IS NOT NULL
	) SELECT count(distinct fingerprint) filter(where event_type='gate_shown') as gate_fps,count(distinct fingerprint) filter(where event_type='contribution') as contribution_fps FROM give_first_funnel_events g WHERE g.created_at>='2026-10-03 04:00+00' and g.created_at<'2026-10-18 13:12+00' and path like '/personality-analysis/%' and not exists(select 1 from admin_fingerprints f where f.fingerprint=g.fingerprint) and not exists(select 1 from admin_profiles p where p.id=g.user_id);

-- Last week's six contributors: seven-day return and replies (no contact details).
SELECT c.id,
  EXISTS (SELECT 1 FROM page_analytics_visits v WHERE v.fingerprint=c.fingerprint
    AND v.started_at>=c.created_at+interval '24 hours'
    AND v.started_at<c.created_at+interval '7 days') AS returned_visit,
  EXISTS (SELECT 1 FROM comments r WHERE r.created_at>c.created_at+interval '24 hours'
    AND r.created_at<c.created_at+interval '7 days' AND r.removed IS NOT TRUE
    AND (r.fingerprint=c.fingerprint OR (c.author_id IS NOT NULL AND r.author_id=c.author_id))) AS returned_contribution,
  (SELECT count(*) FROM comments r WHERE r.parent_type='comment' AND r.parent_id=c.id
    AND r.removed IS NOT TRUE AND r.created_at<'2026-10-18 13:12+00') AS replies
FROM comments c WHERE c.id BETWEEN 753 AND 758 ORDER BY c.id;

SELECT status,count(*),min(created_at),max(created_at),max(acted_at)
FROM host_reply_drafts WHERE created_at<'2026-10-18 13:12+00' GROUP BY status;
SELECT count(*) AS optins,count(*) FILTER(WHERE notification_count>0) AS notified,max(created_at)
FROM comment_reply_subscriptions WHERE created_at<'2026-10-18 13:12+00';
SELECT subject_type,subject_slug,updated_at FROM nine_takes WHERE subject_type='question';

-- Fresh application errors and digest results.
SELECT source,level,error_name,route,left(coalesce(error_message,message),160) AS error,
  count(*),min(created_at),max(created_at)
FROM app_error_events
WHERE created_at>='2026-10-12 04:00+00' AND created_at<'2026-10-18 13:12+00'
GROUP BY 1,2,3,4,5 ORDER BY count(*) DESC LIMIT 25;
SELECT created_at,context->>'status' AS status,context->>'candidates' AS candidates,
  context->>'olderPending' AS older_pending,context->>'alarm' AS alarm
FROM app_error_events WHERE source='host_digest'
  AND created_at>='2026-10-12 04:00+00' AND created_at<'2026-10-18 13:12+00'
ORDER BY created_at;

-- Question creation: admins excluded; this is a secondary diagnostic, not in the v2 RPC.
SELECT date_trunc('week',q.created_at AT TIME ZONE 'America/New_York')::date AS week,
  count(*) AS all_questions,
  count(*) FILTER(WHERE p.admin IS NOT TRUE AND q.removed IS NOT TRUE) AS human_questions
FROM questions q LEFT JOIN profiles p ON p.id=q.author_id
WHERE q.created_at>='2026-07-01' AND q.created_at<'2026-10-18 13:12+00'
GROUP BY 1 ORDER BY 1;

-- Auth and newsletter rejection counts are bot-inclusive diagnostics.
SELECT date_trunc('week',created_at AT TIME ZONE 'America/New_York')::date AS week,
  flow,outcome,count(*)
FROM auth_security_events
WHERE created_at>='2026-10-05 04:00+00' AND created_at<'2026-10-18 13:12+00'
GROUP BY 1,2,3 ORDER BY 1,2,3;
SELECT date_trunc('week',created_at AT TIME ZONE 'America/New_York')::date AS week,
  outcome,count(*),count(DISTINCT fingerprint) AS fingerprints
FROM newsletter_signup_security_events
WHERE created_at>='2026-09-28 04:00+00' AND created_at<'2026-10-18 13:12+00'
GROUP BY 1,2 ORDER BY 1,2;
SELECT e.created_at,e.outcome,e.context->>'timeToken' AS time_token_ms,
  coalesce(v.engaged_ms,0) AS nearby_engaged_ms,v.path,v.acquisition_source,v.max_scroll_pct
FROM newsletter_signup_security_events e
LEFT JOIN LATERAL (SELECT v.engaged_ms,v.path,v.acquisition_source,v.max_scroll_pct
  FROM page_analytics_visits v WHERE v.fingerprint=e.fingerprint
    AND v.started_at BETWEEN e.created_at-interval '30 minutes' AND e.created_at+interval '5 minutes'
  ORDER BY v.engaged_ms DESC LIMIT 1) v ON TRUE
WHERE e.created_at>='2026-10-12 04:00+00' AND e.created_at<'2026-10-18 13:12+00'
  AND (e.outcome='too_fast' OR v.engaged_ms>=10000)
ORDER BY e.created_at;

-- Email delivery state; no recipient addresses are selected.
SELECT date_trunc('week',e.created_at AT TIME ZONE 'America/New_York')::date AS week,
  coalesce(s.key,'non-sequence') AS sequence,e.status,count(*),
  count(*) FILTER(WHERE opened_at IS NOT NULL) AS opened,
  count(*) FILTER(WHERE clicked_at IS NOT NULL) AS clicked,
  count(*) FILTER(WHERE unsubscribed_at IS NOT NULL) AS unsubscribed,
  left(max(error_message),200) AS error
FROM email_sends e LEFT JOIN email_sequences s ON s.id=e.sequence_id
WHERE e.created_at>='2026-10-05 04:00+00' AND e.created_at<'2026-10-18 13:12+00'
GROUP BY 1,2,3 ORDER BY 1,2,3;
SELECT s.key,s.status,count(e.id) FILTER(WHERE e.status='active') AS active_enrollments
FROM email_sequences s LEFT JOIN email_sequence_enrollments e ON e.sequence_id=s.id
GROUP BY s.key,s.status;
SELECT created_at,status,subject,recipient_source_id,left(error_message,160) AS error
FROM email_sends WHERE recipient_source_id='211' ORDER BY created_at;

-- Celebrity exposure depth. Event is client-visible; dwell is 50% visibility for 750 ms.
WITH gates AS (
  SELECT DISTINCT ON(fingerprint,path) fingerprint,path,created_at
  FROM give_first_funnel_events WHERE event_type='gate_shown'
    AND path LIKE '/personality-analysis/%' AND created_at>='2026-10-12 04:00+00'
    AND created_at<'2026-10-18 13:12+00'
  ORDER BY fingerprint,path,created_at
)
SELECT count(*) AS gates,count(*) FILTER(WHERE v.engaged_ms>=30000) AS engaged_30s,
  percentile_cont(.5) WITHIN GROUP(ORDER BY v.engaged_ms/60000.0) AS median_minutes,
  count(*) FILTER(WHERE v.max_scroll_pct>=75) AS scroll_75
FROM gates g LEFT JOIN LATERAL (
  SELECT engaged_ms,max_scroll_pct FROM page_analytics_visits v
  WHERE v.fingerprint=g.fingerprint AND v.path=g.path
    AND v.started_at BETWEEN g.created_at-interval '30 minutes' AND g.created_at+interval '2 hours'
  ORDER BY engaged_ms DESC LIMIT 1
) v ON TRUE;
