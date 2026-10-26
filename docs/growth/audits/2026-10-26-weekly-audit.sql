-- docs/growth/audits/2026-10-26-weekly-audit.sql
-- Weekly growth audit, 2026-10-26 (run ~06:00 ET). Read-only; run each statement with scripts/db-query.sh.
-- Headline: admin_engagement_trends_weekly_v2(26) -> 2026-10-26-v2-snapshot.csv.
-- "This week" = 2026-10-19..10-25 (Monday start, America/New_York; UTC 10-19 04:00 .. 10-26 04:00, still EDT).
-- visitor_day_activity already holds 10-26 rows, so the 10-19 week has no visitor lag.
-- Every diagnostic below prefixes this admin-exclusion CTE (same as the 10-18 and 10-19 audits):
--   WITH admin_profiles AS (SELECT p.id FROM public.profiles p WHERE p.admin IS TRUE),
--   admin_fingerprints AS (
--     SELECT v.fingerprint FROM public.page_analytics_visits v WHERE v.user_id IN (SELECT id FROM admin_profiles) AND v.fingerprint IS NOT NULL
--     UNION SELECT c.fingerprint FROM public.comments c WHERE c.author_id IN (SELECT id FROM admin_profiles) AND c.fingerprint IS NOT NULL
--     UNION SELECT g.fingerprint FROM public.give_first_funnel_events g WHERE g.user_id IN (SELECT id FROM admin_profiles) AND g.fingerprint IS NOT NULL
--     UNION SELECT p.first_touch_fingerprint FROM public.profiles p WHERE p.admin IS TRUE AND p.first_touch_fingerprint IS NOT NULL)

select * from admin_engagement_trends_weekly_v2(26);

-- Gate by surface since the 10-03 launch (human only; after the 10-02 crawler break).
-- Homepage gate counts after 10-18 ~21:00 ET include first-visit browsers (fix build): not comparable to earlier weeks.
SELECT date_trunc('week',g.created_at at time zone 'America/New_York')::date as week,
  case when path='/' then 'home' when path like '/personality-analysis/%' then 'celebrity'
       when path like '/questions/%' or path is null then 'question' else 'blog embed' end as surface,
  count(distinct fingerprint) filter(where event_type='gate_shown') as gate_fps,
  count(distinct fingerprint) filter(where event_type='contribution') as contrib_fps
FROM give_first_funnel_events g WHERE g.created_at>='2026-10-03 04:00+00'
  and not exists(select 1 from admin_fingerprints f where f.fingerprint=g.fingerprint)
  and not exists(select 1 from admin_profiles p where p.id=g.user_id)
GROUP BY 1,2 ORDER BY 1,2;

-- Celebrity gate by question this week (q118 week 1).
SELECT g.question_id, event_type, count(distinct fingerprint) fps, min(created_at), max(created_at)
FROM give_first_funnel_events g WHERE g.created_at>='2026-10-19 04:00+00' and g.created_at<'2026-10-26 04:00+00'
  and path like '/personality-analysis/%'
  and not exists(select 1 from admin_fingerprints f where f.fingerprint=g.fingerprint)
  and not exists(select 1 from admin_profiles p where p.id=g.user_id)
GROUP BY 1,2 ORDER BY 1,2;

-- Contributions this week with path, and the first gate_shown for the same fingerprint in the prior 24 h (gate -> take time).
select g.id, g.created_at, g.path, g.question_id, left(g.fingerprint,8) fp,
  (select min(gs.created_at) from give_first_funnel_events gs where gs.fingerprint=g.fingerprint and gs.event_type='gate_shown'
     and gs.created_at<=g.created_at and gs.created_at>g.created_at-interval '1 day') first_gate
from give_first_funnel_events g where g.created_at>='2026-10-19 04:00+00' and event_type='contribution' order by id;

-- Celebrity gate-viewer depth (guardrail: median engaged time >= 3.5 min).
-- (CTE) , g1 AS (first celebrity gate_shown per (fingerprint, path) in 10-12..10-25)
--        , d AS (max page_analytics_visits.engaged_ms on the same fingerprint+path within [-30 min, +2 h])
-- select wk, count(*), percentile_cont(0.5) within group (order by ems)/60000.0 median_min from d group by 1;

-- Human takes since 10-12 with reply status and admin reply lag; admin replies since 10-03.
SELECT c.id, c.created_at, c.parent_type, c.parent_id, c.author_id is not null as logged_in, length(c.comment) len,
  (select count(*) from comments r where r.parent_type='comment' and r.parent_id=c.id and r.removed is not true) replies,
  (select min(r.created_at) - c.created_at from comments r join profiles rp on rp.id=r.author_id
     where rp.admin and r.parent_type='comment' and r.parent_id=c.id) admin_reply_after
FROM comments c LEFT JOIN profiles p on p.id=c.author_id
WHERE c.created_at>='2026-10-12 04:00+00' and c.removed is not true and coalesce(p.admin,false)=false ORDER BY c.id;
SELECT c.id, c.created_at, c.parent_type, c.parent_id FROM comments c JOIN profiles p on p.id=c.author_id
WHERE p.admin and c.created_at>='2026-10-03 04:00+00' ORDER BY c.id;
select id, created_at, blog_link from blog_comments where created_at>='2026-10-12 04:00+00';

-- Contributor return (+24 h..+7 d visit days, second take) and reachability (signup / profile on the same fingerprint).
SELECT c.id, (now()-c.created_at) observed,
  (SELECT count(distinct (v.started_at at time zone 'America/New_York')::date) FROM page_analytics_visits v
    WHERE v.fingerprint=c.fingerprint AND v.started_at>=c.created_at+interval '24 hours' AND v.started_at<c.created_at+interval '7 days') AS return_days,
  EXISTS (SELECT 1 FROM comments r WHERE r.id<>c.id and r.created_at>c.created_at+interval '10 minutes' AND r.created_at<c.created_at+interval '7 days'
    AND r.removed IS NOT TRUE AND (r.fingerprint=c.fingerprint OR (c.author_id IS NOT NULL AND r.author_id=c.author_id))) AS second_take
FROM comments c WHERE c.id in (759,760,761,762,763,765,766,767) ORDER BY c.id;
select c.id, exists(select 1 from signups s where s.first_touch_fingerprint=c.fingerprint) fp_has_signup,
  exists(select 1 from profiles p where p.first_touch_fingerprint=c.fingerprint) fp_has_profile
from comments c where c.id between 759 and 767 and c.id<>764;

-- Engaged-human entry source and landing class by week.
-- (CTE) , humans AS (visitor_day_activity fingerprints with engaged_ms_total>=10000, admin-excluded, by week)
--        , entry AS (first page_analytics_visits row of the week per fingerprint)
-- SELECT week, acquisition_source, count(*), count(*) filter(where path like '/personality-analysis/%') FROM entry GROUP BY 1,2;
-- Homepage denominator: distinct admin-excluded fingerprints on '/' with engaged_ms>=10000, by week.

-- Host desk, opt-ins, digest runs.
SELECT status,count(*),max(acted_at) FROM host_reply_drafts GROUP BY status;
select s.comment_id, s.created_at, s.notification_count from comment_reply_subscriptions s order by 1;
select created_at, level, message, context->>'olderPending' older_pending, context->>'alarm' alarm
from app_error_events where source = 'host_digest' order by id desc limit 10;

-- Email (no addresses selected), sequences, signup 211 confirmation, this week's signup.
SELECT date_trunc('week',e.created_at AT TIME ZONE 'America/New_York')::date AS week, coalesce(s.key,'non-sequence') AS sequence,
  e.status, count(*), count(*) FILTER(WHERE opened_at IS NOT NULL) opened
FROM email_sends e LEFT JOIN email_sequences s ON s.id=e.sequence_id WHERE e.created_at>='2026-10-12 04:00+00' GROUP BY 1,2,3 ORDER BY 1,2,3;
SELECT s.key,s.status,count(e.id) FILTER(WHERE e.status='active') FROM email_sequences s
LEFT JOIN email_sequence_enrollments e ON e.sequence_id=s.id GROUP BY 1,2;
SELECT created_at,status FROM email_sends WHERE recipient_source_id='211' ORDER BY created_at;
select id, created_at, first_landing_path, first_acquisition_source, first_entry_surface from signups where created_at>='2026-10-19 04:00+00';

-- Beta card (client-side), auth pages (raw_fps is bot-inclusive), errors.
select date_trunc('week', created_at at time zone 'America/New_York')::date wk, event, count(distinct fingerprint)
from cta_experiment_events where created_at>='2026-10-12 04:00+00' group by 1,2 order by 1,2;
select path, count(distinct fingerprint) raw_fps, count(distinct fingerprint) filter (where engaged_ms>=10000) eng10
from page_analytics_visits where started_at>='2026-10-19 04:00+00' and started_at<'2026-10-26 04:00+00'
  and path in ('/register','/login','/book-session','/enneagram-test','/') group by 1;
SELECT source,error_name,left(coalesce(error_message,message),100), count(*) FROM app_error_events
WHERE created_at>='2026-10-19 04:00+00' AND source <> 'host_digest' GROUP BY 1,2,3 ORDER BY 4 DESC;
