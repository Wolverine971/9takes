-- docs/growth/audits/2026-11-09-weekly-audit.sql
-- Weekly growth audit, 2026-11-09 (run morning ET). Read-only; run each statement with scripts/db-query.sh.
-- Headline: admin_engagement_trends_weekly_v2(26) -> 2026-11-09-v2-snapshot.csv (identical to the live RPC at run time).
-- "This week" = 2026-11-02..11-08 (Monday start, America/New_York). UTC window: 11-02 05:00 .. 11-09 05:00.
-- Series break: 11-02 ~15:15 ET celebrity starter q118 -> q573 (src/lib/data/chorusStarter.ts); ISR served q118 up to a day.
-- Every diagnostic below prefixes the same admin-exclusion CTE as the 10-18 .. 11-02 audits:
--   WITH admin_profiles AS (SELECT p.id FROM public.profiles p WHERE p.admin IS TRUE),
--   admin_fingerprints AS (
--     SELECT v.fingerprint FROM public.page_analytics_visits v WHERE v.user_id IN (SELECT id FROM admin_profiles) AND v.fingerprint IS NOT NULL
--     UNION SELECT c.fingerprint FROM public.comments c WHERE c.author_id IN (SELECT id FROM admin_profiles) AND c.fingerprint IS NOT NULL
--     UNION SELECT g.fingerprint FROM public.give_first_funnel_events g WHERE g.user_id IN (SELECT id FROM admin_profiles) AND g.fingerprint IS NOT NULL
--     UNION SELECT p.first_touch_fingerprint FROM public.profiles p WHERE p.admin IS TRUE AND p.first_touch_fingerprint IS NOT NULL)

select * from admin_engagement_trends_weekly_v2(26);

-- Gate by surface (human only; all weeks after the 10-02 crawler break).
SELECT date_trunc('week',g.created_at at time zone 'America/New_York')::date as week,
  case when path='/' then 'home' when path like '/personality-analysis/%' then 'celebrity'
       when path like '/questions/%' or path is null then 'question' else 'blog embed' end as surface,
  count(distinct fingerprint) filter(where event_type='gate_shown') as gate_fps,
  count(distinct fingerprint) filter(where event_type='contribution') as contrib_fps
FROM give_first_funnel_events g WHERE g.created_at>='2026-10-12 04:00+00'
  and not exists(select 1 from admin_fingerprints f where f.fingerprint=g.fingerprint)
  and not exists(select 1 from admin_profiles p where p.id=g.user_id)
GROUP BY 1,2 ORDER BY 1,2;

-- Gate by question and surface, this week (shows q118 ISR tail vs q573).
SELECT g.question_id, <surface case> surface, event_type, count(distinct fingerprint) fps
FROM give_first_funnel_events g WHERE g.created_at>='2026-11-02 05:00+00' and g.created_at<'2026-11-09 05:00+00'
  and <admin exclusions> GROUP BY 1,2,3 ORDER BY 2,1,3;
-- Exact (Clopper-Pearson) 95% CIs, python3 stdlib: 3/124 -> 0.5-6.9%; 5/137 -> 1.2-8.3%; 0/38 -> 0-9.3%.

-- Contributions this week with first gate_shown in the prior 24 h (gate -> take time).
select g.id, g.created_at, g.path, g.question_id, left(g.fingerprint,8) fp, g.user_id is not null logged_in,
  (select min(gs.created_at) from give_first_funnel_events gs where gs.fingerprint=g.fingerprint and gs.event_type='gate_shown'
     and gs.created_at<=g.created_at and gs.created_at>g.created_at-interval '1 day') first_gate
from give_first_funnel_events g where g.created_at>='2026-11-02 05:00+00' and event_type='contribution' order by id;

-- All comments since 10-26 with removed flag, admin flag, replies and admin reply lag (explains the 10-26 restatement: 778 removed).
SELECT c.id, c.created_at, c.parent_type, c.parent_id, c.author_id is not null as logged_in, coalesce(p.admin,false) adm, c.removed,
  length(c.comment) len, left(regexp_replace(c.comment,'\s+',' ','g'),70) snippet, left(c.fingerprint,8) fp,
  (select count(*) from comments r where r.parent_type='comment' and r.parent_id=c.id and r.removed is not true) replies,
  (select min(r.created_at) - c.created_at from comments r join profiles rp on rp.id=r.author_id
     where rp.admin and r.parent_type='comment' and r.parent_id=c.id) admin_reply_after
FROM comments c LEFT JOIN profiles p on p.id=c.author_id WHERE c.created_at>='2026-10-26 04:00+00' ORDER BY c.id;

-- Contributor return (+24 h..+7 d visit days, second take) and reachability.
SELECT c.id, round(extract(epoch from (now()-c.created_at))/86400.0,1) observed_days,
  (SELECT count(distinct (v.started_at at time zone 'America/New_York')::date) FROM page_analytics_visits v
    WHERE v.fingerprint=c.fingerprint AND v.started_at>=c.created_at+interval '24 hours' AND v.started_at<c.created_at+interval '7 days') AS return_days,
  EXISTS (SELECT 1 FROM comments r WHERE r.id<>c.id and r.created_at>c.created_at+interval '10 minutes' AND r.created_at<c.created_at+interval '7 days'
    AND r.removed IS NOT TRUE AND (r.fingerprint=c.fingerprint OR (c.author_id IS NOT NULL AND r.author_id=c.author_id))) AS second_take,
  exists(select 1 from signups s where s.first_touch_fingerprint=c.fingerprint) fp_signup,
  exists(select 1 from profiles p where p.first_touch_fingerprint=c.fingerprint) fp_profile,
  exists(select 1 from comment_reply_subscriptions s where s.comment_id=c.id) opted_in
FROM comments c WHERE c.id between 765 and 784 and c.id not in (772,783) ORDER BY c.id;

-- Base rate: new engaged humans (first-ever visitor_day_activity day >=10 s engaged, admin-excluded) with any visit in D1..D7.
<admin CTE>, firsts AS (select fingerprint, min(activity_date) fd from visitor_day_activity group by 1),
cohort AS (select f.fingerprint, f.fd from firsts f join visitor_day_activity d on d.fingerprint=f.fingerprint and d.activity_date=f.fd
  and d.engaged_ms_total>=10000 where f.fd>='2026-10-19' and f.fd<'2026-11-02' and not exists(select 1 from admin_fingerprints a where a.fingerprint=f.fingerprint))
select date_trunc('week',fd)::date wk, count(*), round(100.0*count(*) filter (where exists(select 1 from visitor_day_activity d
  where d.fingerprint=c.fingerprint and d.activity_date between c.fd+1 and c.fd+7))/count(*),1) d1_7 from cohort c group by 1 order by 1;
-- -> 10-19: 843, 7.1% ; 10-26: 771, 6.1%

-- Engaged-human entry source by week (first visit of the week per human fingerprint).
<admin CTE>, humans AS (select date_trunc('week', activity_date)::date wk, fingerprint from visitor_day_activity d
  where activity_date>='2026-10-19' and activity_date<'2026-11-09' and engaged_ms_total>=10000
  and not exists(select 1 from admin_fingerprints f where f.fingerprint=d.fingerprint) group by 1,2),
entry AS (select distinct on (h.wk,h.fingerprint) h.wk, h.fingerprint, v.path, v.referrer_host from humans h join page_analytics_visits v
  on v.fingerprint=h.fingerprint and (v.started_at at time zone 'America/New_York')::date >= h.wk and (v.started_at at time zone 'America/New_York')::date < h.wk+7
  order by h.wk,h.fingerprint,v.started_at)
select wk, count(*), count(*) filter (where referrer_host ilike '%google%') google,
  count(*) filter (where referrer_host is null or referrer_host='') direct,
  count(*) filter (where path like '/personality-analysis/%' and referrer_host ilike '%google%') celeb_google,
  count(*) filter (where path='/') home_entry from entry group by 1 order by 1;
-- Homepage denominator: distinct admin-excluded fingerprints on '/' with engaged_ms>=10000, by ET week.

-- Celebrity gate-viewer depth (guardrail median >= 3.5 min): first celebrity gate_shown per (fingerprint, path),
-- joined to max page_analytics_visits.engaged_ms on the same fingerprint+path within [-30 min, +2 h], by ET week.

-- The one registration + booking (no emails selected): profile -> waitlist (email join) -> metadata -> visit trail -> gate events.
select p.id, p.created_at, p.enneagram, p.first_acquisition_source, p.first_entry_surface, left(p.first_touch_fingerprint,8) fp,
  exists(select 1 from coaching_waitlist w where lower(w.email)=lower(p.email)) on_waitlist
from profiles p where p.created_at>='2026-11-05';
select w.created_at, w.flagged_at, m.source, m.utm_campaign, m.utm_medium, m.utm_content
from coaching_waitlist w left join coaching_waitlist_metadata m on m.waitlist_id=w.id where w.created_at>='2026-11-05';
select (started_at at time zone 'America/New_York')::date d, count(*), sum(engaged_ms)/1000 eng_s, string_agg(distinct path,' | ')
from page_analytics_visits where fingerprint like '5031bba8%' group by 1 order by 1;
select event_type, path, question_id, created_at from give_first_funnel_events where fingerprint like '5031bba8%' order by created_at;
select 'talk_notes', max(created_at) from talk_notes union all select 'consulting_clients', max(created_at) from consulting_clients;

-- Host desk, opt-ins, digest runs.
SELECT status,count(*),max(acted_at),max(created_at) FROM host_reply_drafts GROUP BY status;
select comment_id, status, low_effort, digest_sent_at::date from host_reply_drafts where comment_id between 743 and 784 order by 1;
select s.comment_id, s.created_at, s.notification_count from comment_reply_subscriptions s order by 1;
select created_at, level, message, context->>'olderPending', context->>'alarm' from app_error_events where source='host_digest' order by id desc limit 10;

-- Email, signups, beta card, errors.
SELECT date_trunc('week',e.created_at AT TIME ZONE 'America/New_York')::date AS week, coalesce(s.key,'non-sequence'), e.status, count(*),
  count(*) FILTER(WHERE opened_at IS NOT NULL) FROM email_sends e LEFT JOIN email_sequences s ON s.id=e.sequence_id
WHERE e.created_at>='2026-10-26 04:00+00' GROUP BY 1,2,3 ORDER BY 1,2,3;
SELECT created_at,status FROM email_sends WHERE recipient_source_id='211' ORDER BY created_at;
select id, created_at, first_landing_path, first_acquisition_source from signups where created_at>='2026-10-26 04:00+00' order by id;
select date_trunc('week', created_at at time zone 'America/New_York')::date wk, event, count(distinct fingerprint)
from cta_experiment_events where created_at>='2026-10-19 04:00+00' group by 1,2 order by 1,2;
SELECT source,error_name,left(coalesce(error_message,message),90), count(*) FROM app_error_events
WHERE created_at>='2026-11-02 05:00+00' AND source <> 'host_digest' GROUP BY 1,2,3 ORDER BY 4 DESC;
