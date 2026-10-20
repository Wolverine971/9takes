-- docs/growth/audits/2026-10-19-weekly-audit.sql
-- Weekly growth audit, 2026-10-19 (run ~06:00 ET). Read-only; run each statement with scripts/db-query.sh.
-- Headline: admin_engagement_trends_weekly_v2(26) -> 2026-10-19-v2-snapshot.csv.
-- "This week" = 2026-10-12..10-18 (Monday start, America/New_York).
-- Every diagnostic below prefixes this admin-exclusion CTE (same as the 10-18 audit):
--   WITH admin_profiles AS (SELECT p.id FROM public.profiles p WHERE p.admin IS TRUE),
--   admin_fingerprints AS (
--     SELECT v.fingerprint FROM public.page_analytics_visits v WHERE v.user_id IN (SELECT id FROM admin_profiles) AND v.fingerprint IS NOT NULL
--     UNION SELECT c.fingerprint FROM public.comments c WHERE c.author_id IN (SELECT id FROM admin_profiles) AND c.fingerprint IS NOT NULL
--     UNION SELECT g.fingerprint FROM public.give_first_funnel_events g WHERE g.user_id IN (SELECT id FROM admin_profiles) AND g.fingerprint IS NOT NULL
--     UNION SELECT p.first_touch_fingerprint FROM public.profiles p WHERE p.admin IS TRUE AND p.first_touch_fingerprint IS NOT NULL)

select * from admin_engagement_trends_weekly_v2(26);

-- Gate by surface since the 10-03 launch (human only; after the 10-02 crawler break).
SELECT date_trunc('week',g.created_at at time zone 'America/New_York')::date as week,
  case when path='/' then 'home' when path like '/personality-analysis/%' then 'celebrity'
       when path like '/questions/%' or path is null then 'question' else 'blog embed' end as surface,
  count(distinct fingerprint) filter(where event_type='gate_shown') as gate_fps,
  count(distinct fingerprint) filter(where event_type='contribution') as contrib_fps
FROM give_first_funnel_events g WHERE g.created_at>='2026-10-03 04:00+00'
  and not exists(select 1 from admin_fingerprints f where f.fingerprint=g.fingerprint)
  and not exists(select 1 from admin_profiles p where p.id=g.user_id)
GROUP BY 1,2 ORDER BY 1,2;

-- Celebrity gate by question and day (q567 -> q118 swap). Event 1983 (10-18 14:57 ET, jack-black,
-- fingerprint with zero page_analytics_visits) is treated as a local-dev inspection, not a reader.
SELECT (g.created_at at time zone 'America/New_York')::date as day, g.question_id, event_type, count(distinct fingerprint)
FROM give_first_funnel_events g WHERE g.created_at>='2026-10-15 04:00+00' and path like '/personality-analysis/%'
  and not exists(select 1 from admin_fingerprints f where f.fingerprint=g.fingerprint)
GROUP BY 1,2,3 ORDER BY 1,2,3;
select g.id, g.created_at, g.path, (select count(*) from page_analytics_visits v where v.fingerprint=g.fingerprint) visits
from give_first_funnel_events g where g.question_id=118 and g.created_at>='2026-10-15' order by g.created_at;

-- Celebrity since launch, distinct fingerprints (10-03..10-18, minus event 1983).
SELECT count(distinct fingerprint) filter(where event_type='gate_shown') gate_fps,
  count(distinct fingerprint) filter(where event_type='contribution') contrib_fps
FROM give_first_funnel_events g WHERE g.created_at>='2026-10-03 04:00+00' and g.created_at<'2026-10-19 04:00+00'
  and path like '/personality-analysis/%' and g.id<>1983
  and not exists(select 1 from admin_fingerprints f where f.fingerprint=g.fingerprint);

-- Human takes since 10-05 with reply status; admin replies since 10-03.
SELECT c.id, c.created_at, c.parent_id, c.author_id is not null as logged_in, length(c.comment) len,
  (select count(*) from comments r where r.parent_type='comment' and r.parent_id=c.id and r.removed is not true) replies
FROM comments c LEFT JOIN profiles p on p.id=c.author_id
WHERE c.created_at>='2026-10-05 04:00+00' and c.removed is not true and coalesce(p.admin,false)=false ORDER BY c.id;
SELECT c.id, c.created_at FROM comments c JOIN profiles p on p.id=c.author_id
WHERE p.admin and c.created_at>='2026-10-03 04:00+00' ORDER BY c.id;

-- Contributor 7-day return (visit days and second take between +24 h and +7 d).
SELECT c.id, (SELECT count(distinct (v.started_at at time zone 'America/New_York')::date) FROM page_analytics_visits v
    WHERE v.fingerprint=c.fingerprint AND v.started_at>=c.created_at+interval '24 hours' AND v.started_at<c.created_at+interval '7 days') AS return_days,
  EXISTS (SELECT 1 FROM comments r WHERE r.created_at>c.created_at+interval '10 minutes' AND r.created_at<c.created_at+interval '7 days'
    AND r.removed IS NOT TRUE AND (r.fingerprint=c.fingerprint OR (c.author_id IS NOT NULL AND r.author_id=c.author_id))) AS second_take
FROM comments c WHERE c.id BETWEEN 753 AND 759 ORDER BY c.id;

-- Engaged-human entry source and landing class by week.
-- humans = visitor_day_activity fingerprints with engaged_ms_total>=10000 that week, admin-excluded;
-- entry = first page_analytics_visits row of the week per fingerprint (see 10-18 SQL for the full form).

-- Host desk, opt-ins, digest runs.
SELECT status,count(*),max(acted_at) FROM host_reply_drafts GROUP BY status;
SELECT count(*) optins, count(*) FILTER(WHERE notification_count>0) notified FROM comment_reply_subscriptions;
select created_at, level, message, context->>'olderPending' older_pending, context->>'alarm' alarm
from app_error_events where source = 'host_digest' order by id desc limit 10;

-- Email (no addresses selected), sequences, signup 211 confirmation.
SELECT date_trunc('week',e.created_at AT TIME ZONE 'America/New_York')::date AS week, coalesce(s.key,'non-sequence') AS sequence,
  e.status, count(*), count(*) FILTER(WHERE opened_at IS NOT NULL) opened
FROM email_sends e LEFT JOIN email_sequences s ON s.id=e.sequence_id WHERE e.created_at>='2026-10-05 04:00+00' GROUP BY 1,2,3 ORDER BY 1,2,3;
SELECT s.key,s.status,count(e.id) FILTER(WHERE e.status='active') FROM email_sequences s
LEFT JOIN email_sequence_enrollments e ON e.sequence_id=s.id GROUP BY 1,2;
SELECT created_at,status FROM email_sends WHERE recipient_source_id='211' ORDER BY created_at;

-- Beta card (client-side) and auth-page engagement (raw columns are bot-inclusive).
select date_trunc('week', created_at at time zone 'America/New_York')::date wk, event, count(distinct fingerprint)
from cta_experiment_events where created_at>='2026-10-05 04:00+00' group by 1,2 order by 1,2;
select path, count(distinct fingerprint) raw_fps, count(distinct fingerprint) filter (where engaged_ms>=10000) eng10
from page_analytics_visits where started_at>='2026-10-12 04:00+00' and started_at<'2026-10-19 04:00+00'
  and path in ('/register','/login','/book-session','/enneagram-test') group by 1;
SELECT source,error_name,left(coalesce(error_message,message),110), count(*) FROM app_error_events
WHERE created_at>='2026-10-12 04:00+00' AND source <> 'host_digest' GROUP BY 1,2,3 ORDER BY 4 DESC;
