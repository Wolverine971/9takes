-- docs/growth/audits/2026-11-02-weekly-audit.sql
-- Weekly growth audit, 2026-11-02 (run ~06:00 ET). Read-only; run each statement with scripts/db-query.sh.
-- Headline: admin_engagement_trends_weekly_v2(26) -> 2026-11-02-v2-snapshot.csv.
-- "This week" = 2026-10-26..11-01 (Monday start, America/New_York).
-- UTC window: 10-26 04:00 .. 11-02 05:00 (DST ended 11-01, so the week closes at 05:00 UTC, not 04:00).
-- The 11-02 row is a ~6 h partial; visitor_day_activity has no 11-02 rows yet (visitor columns read 0).
-- Every diagnostic below prefixes this admin-exclusion CTE (same as the 10-18 .. 10-26 audits):
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

-- Gate by question and surface, this week.
SELECT g.question_id, <surface case as above> surface, event_type, count(distinct fingerprint) fps, min(created_at), max(created_at)
FROM give_first_funnel_events g WHERE g.created_at>='2026-10-26 04:00+00' and g.created_at<'2026-11-02 05:00+00'
  and <admin exclusions as above> GROUP BY 1,2,3 ORDER BY 2,1,3;

-- Two-week read for the q118 (celebrity) and q203 (home) experiments, 10-19..11-01.
select case when path='/' then 'home' else 'celebrity' end surf, question_id,
 count(distinct fingerprint) filter (where event_type='gate_shown') gate_fps,
 count(distinct fingerprint) filter (where event_type='contribution') contrib_fps
from give_first_funnel_events g where g.created_at>='2026-10-19 04:00+00' and g.created_at<'2026-11-02 05:00+00'
 and (path like '/personality-analysis/%' or path='/') and question_id in (118,203) and <admin exclusions> group by 1,2;
-- Exact (Clopper-Pearson) 95% CIs computed in python3 stdlib: 5/137 -> 1.2-8.3%; 9/295 -> 1.4-5.7%; 7/295 -> 1.0-4.8%.

-- Contributions this week, with the first gate_shown for the same fingerprint in the prior 24 h (gate -> take time).
select g.id, g.created_at, g.path, g.question_id, left(g.fingerprint,8) fp, g.user_id is not null logged_in,
  (select min(gs.created_at) from give_first_funnel_events gs where gs.fingerprint=g.fingerprint and gs.event_type='gate_shown'
     and gs.created_at<=g.created_at and gs.created_at>g.created_at-interval '1 day') first_gate
from give_first_funnel_events g where g.created_at>='2026-10-26 04:00+00' and event_type='contribution' order by id;

-- Celebrity gate-viewer depth (guardrail: median engaged time >= 3.5 min).
-- g1 = first celebrity gate_shown per (fingerprint, path), 10-12..11-01, admin-excluded;
-- d  = max page_analytics_visits.engaged_ms on the same fingerprint+path within [-30 min, +2 h];
-- select wk, count(*), percentile_cont(0.5) within group (order by ems)/60000.0, count(*) filter (where ems>=30000) from d group by 1;

-- Human takes since 10-19 with reply status and admin reply lag; admin replies since 10-19; blog comments.
SELECT c.id, c.created_at, c.parent_type, c.parent_id, c.author_id is not null as logged_in, length(c.comment) len,
  left(regexp_replace(c.comment,'\s+',' ','g'),60) snippet,
  (select count(*) from comments r where r.parent_type='comment' and r.parent_id=c.id and r.removed is not true) replies,
  (select min(r.created_at) - c.created_at from comments r join profiles rp on rp.id=r.author_id
     where rp.admin and r.parent_type='comment' and r.parent_id=c.id) admin_reply_after
FROM comments c LEFT JOIN profiles p on p.id=c.author_id
WHERE c.created_at>='2026-10-19 04:00+00' and c.removed is not true and coalesce(p.admin,false)=false ORDER BY c.id;
SELECT c.id, c.created_at, c.parent_type, c.parent_id FROM comments c JOIN profiles p on p.id=c.author_id
WHERE p.admin and c.created_at>='2026-10-19 04:00+00' ORDER BY c.id;
select id, created_at, blog_link from blog_comments where created_at>='2026-10-19 04:00+00';

-- Contributor return (+24 h..+7 d visit days, second take) and reachability (signup / profile / opt-in on the same fingerprint).
SELECT c.id, round(extract(epoch from (now()-c.created_at))/86400.0,1) observed_days,
  (SELECT count(distinct (v.started_at at time zone 'America/New_York')::date) FROM page_analytics_visits v
    WHERE v.fingerprint=c.fingerprint AND v.started_at>=c.created_at+interval '24 hours' AND v.started_at<c.created_at+interval '7 days') AS return_days,
  EXISTS (SELECT 1 FROM comments r WHERE r.id<>c.id and r.created_at>c.created_at+interval '10 minutes' AND r.created_at<c.created_at+interval '7 days'
    AND r.removed IS NOT TRUE AND (r.fingerprint=c.fingerprint OR (c.author_id IS NOT NULL AND r.author_id=c.author_id))) AS second_take,
  exists(select 1 from signups s where s.first_touch_fingerprint=c.fingerprint) fp_has_signup,
  exists(select 1 from profiles p where p.first_touch_fingerprint=c.fingerprint) fp_has_profile,
  exists(select 1 from comment_reply_subscriptions s where s.comment_id=c.id) opted_in
FROM comments c WHERE c.id between 759 and 778 and c.id not in (764,772) ORDER BY c.id;

-- Base rate: new engaged humans (first-ever visitor_day_activity day, >=10 s engaged, admin-excluded) with any visit day in D1..D7.
-- firsts = min(activity_date) per fingerprint; cohort = first days 10-05..10-25; result 6.0% / 6.0% / 7.1% for the 10-05 / 10-12 / 10-19 cohorts.

-- Engaged-human entry source and landing class by week (reproduces the 10-26 audit's 10-12 and 10-19 rows exactly).
-- humans = visitor_day_activity fingerprints with engaged_ms_total>=10000, admin-excluded, by week (activity_date 10-12..11-01);
-- entry  = first page_analytics_visits row of the week per fingerprint (ET date);
-- select wk, count(*), google, all search, direct, other, celebrity landings, celebrity from Google from entry group by 1.
-- Homepage denominator: distinct admin-excluded fingerprints on '/' with engaged_ms>=10000, by ET week.

-- Host desk, named-take drafts, opt-ins, digest runs.
SELECT status,count(*),max(acted_at),max(created_at) FROM host_reply_drafts GROUP BY status;
select comment_id, status, low_effort, digest_sent_at::date, (draft_a is not null) has_draft from host_reply_drafts
 where comment_id in (733,743,749,746,747,748,754,756,768,769,770,771,773,774,775,776,777,778) order by comment_id;
select s.comment_id, s.created_at, s.notification_count from comment_reply_subscriptions s order by 1;
select created_at, level, message, context->>'olderPending' older_pending, context->>'alarm' alarm
from app_error_events where source = 'host_digest' order by id desc limit 10;

-- Email (no addresses selected), sequences, signup 211 confirmation, recent signups.
SELECT date_trunc('week',e.created_at AT TIME ZONE 'America/New_York')::date AS week, coalesce(s.key,'non-sequence') AS sequence,
  e.status, count(*), count(*) FILTER(WHERE opened_at IS NOT NULL) opened
FROM email_sends e LEFT JOIN email_sequences s ON s.id=e.sequence_id WHERE e.created_at>='2026-10-19 04:00+00' GROUP BY 1,2,3 ORDER BY 1,2,3;
select recipient_source_id, created_at, status from email_sends where created_at>='2026-10-26 04:00+00' order by created_at;
SELECT s.key,s.status,count(e.id) FILTER(WHERE e.status='active') FROM email_sequences s
LEFT JOIN email_sequence_enrollments e ON e.sequence_id=s.id GROUP BY 1,2;
SELECT created_at,status FROM email_sends WHERE recipient_source_id='211' ORDER BY created_at;
select id, created_at, first_landing_path, first_acquisition_source, first_entry_surface from signups where created_at>='2026-10-19 04:00+00' order by id;

-- Beta card (client-side), errors, post-deploy gate check (runes migration faf8aa897 deployed 11-01 evening ET).
select date_trunc('week', created_at at time zone 'America/New_York')::date wk, event, count(distinct fingerprint)
from cta_experiment_events where created_at>='2026-10-12 04:00+00' group by 1,2 order by 1,2;
SELECT source,error_name,left(coalesce(error_message,message),100), count(*) FROM app_error_events
WHERE created_at>='2026-10-26 04:00+00' AND source <> 'host_digest' GROUP BY 1,2,3 ORDER BY 4 DESC;
select event_type, count(*), max(created_at) from give_first_funnel_events where created_at>=now()-interval '12 hours' group by 1;
