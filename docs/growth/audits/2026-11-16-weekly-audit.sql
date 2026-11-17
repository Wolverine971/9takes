-- docs/growth/audits/2026-11-16-weekly-audit.sql
-- Weekly growth audit, 2026-11-16 (run morning ET). Read-only; run each statement with scripts/db-query.sh.
-- Headline: admin_engagement_trends_weekly_v2(26) -> 2026-11-16-v2-snapshot.csv.
-- "This week" = 2026-11-09..11-15 (Monday start, America/New_York). UTC window: 11-09 05:00 .. 11-16 05:00.
-- Outside event: Google November 2026 core update, rollout began 2026-11-10 (up to 2 weeks).
-- GSC pulls: 2026-11-16-gsc-daily.mjs and 2026-11-16-gsc-pages.mjs (dataState 'all'; fresh days can be partial).
-- <A> = the admin-exclusion CTE used since the 10-18 audit (see 2026-11-09-weekly-audit.sql header).

select * from admin_engagement_trends_weekly_v2(26);

-- Gate by surface, human only, weeks after the 10-02 crawler break.
<A> SELECT date_trunc('week',g.created_at at time zone 'America/New_York')::date as week,
  case when path='/' then 'home' when path like '/personality-analysis/%' then 'celebrity'
       when path like '/questions/%' or path is null then 'question' else 'blog embed' end as surface,
  count(distinct fingerprint) filter(where event_type='gate_shown') gate_fps,
  count(distinct fingerprint) filter(where event_type='contribution') contrib_fps
FROM give_first_funnel_events g WHERE g.created_at>='2026-10-12 04:00+00'
  and not exists(select 1 from admin_fingerprints f where f.fingerprint=g.fingerprint)
  and not exists(select 1 from admin_profiles p where p.id=g.user_id) GROUP BY 1,2 ORDER BY 1,2;
-- Same, grouped by question_id for 11-09 week (q573 100 gate fps -> 0; q203 home 21 -> 2).
-- Exact 95% CIs (Clopper-Pearson): 0/100 -> 0-3.6%; 2/21 -> 1.2-30.4%; q573 two-week 3/224 -> 0.3-3.9%.
-- Fisher q573 3/224 vs q118 substantive 7/295: p = 0.53.

-- Comments since 11-02 with removed/admin flags, replies, admin reply lag.
SELECT c.id, c.created_at at time zone 'America/New_York', c.parent_type, c.parent_id, c.author_id is not null logged_in,
  coalesce(p.admin,false) adm, c.removed, length(c.comment) len, left(c.fingerprint,8) fp,
  (select count(*) from comments r where r.parent_type='comment' and r.parent_id=c.id and r.removed is not true) replies
FROM comments c LEFT JOIN profiles p on p.id=c.author_id WHERE c.created_at>='2026-11-02 05:00+00' ORDER BY c.id;
-- blog_comments since 11-02: 0 rows.

-- Contribution events this week with gate lead time.
select g.id, g.created_at, g.path, g.question_id, left(g.fingerprint,8), g.user_id is not null,
  (select min(gs.created_at) from give_first_funnel_events gs where gs.fingerprint=g.fingerprint and gs.event_type='gate_shown'
     and gs.created_at<=g.created_at and gs.created_at>g.created_at-interval '1 day') - g.created_at
from give_first_funnel_events g where g.created_at>='2026-11-09 05:00+00' and event_type='contribution' order by id;

-- Contributor return (+24 h..+7 d visit days, second take, reachability) for 779..788.
-- Same query as 2026-11-09-weekly-audit.sql with c.id between 779 and 788 and c.id not in (780,783).
-- Base rate (new engaged humans, D1..D7): 10-26 cohort 6.1%, 11-02 cohort 5.6%.

-- This week's registrant and contributor trails (no emails selected).
select p.id, p.created_at, p.enneagram, p.first_acquisition_source, p.first_entry_surface, left(p.first_touch_fingerprint,8)
from profiles p where p.created_at>='2026-11-02 05:00+00';
select (started_at at time zone 'America/New_York')::date, count(*), sum(engaged_ms)/1000, string_agg(distinct path,' | ')
from page_analytics_visits where fingerprint like '3aee04b7%' group by 1 order by 1;   -- also 288d7205, ce9505da, 5031bba8 (11-05 lead)

-- Engaged-human entry source by week, and by day from 11-01 (see 2026-11-09 SQL; daily variant groups visitor_day_activity by activity_date).
-- Google-referred page_analytics_visits rows per day (bot-inclusive, diagnostic only):
select (started_at at time zone 'America/New_York')::date d, count(*), count(*) filter (where referrer_host ilike '%google%') g_rows,
  count(*) filter (where coalesce(referrer_host,'')='') direct from page_analytics_visits where started_at>='2026-11-08 05:00+00' group by 1 order by 1;

-- Homepage engaged humans; celebrity gate-viewer depth guardrail (same as 11-09).

-- Host desk, digest, opt-ins, outbox.
SELECT status,count(*),max(acted_at),max(created_at) FROM host_reply_drafts GROUP BY status;
select created_at, level, message, context->>'olderPending', context->>'alarm' from app_error_events where source='host_digest' order by id desc limit 10;
select comment_id, created_at, notification_count from comment_reply_subscriptions order by 1;
select count(*), max(created_at) from reply_notification_outbox;

-- Email, signups, beta card, bookings, tests, errors.
select e.created_at, e.recipient_source, e.recipient_source_id, e.status, e.opened_at is not null, left(e.subject,60)
from email_sends e where e.created_at>='2026-11-02 05:00+00' order by 1;
select count(*), max(created_at) from signups;
select date_trunc('week', created_at at time zone 'America/New_York')::date, event, count(distinct fingerprint)
from cta_experiment_events where created_at>='2026-10-26 04:00+00' group by 1,2 order by 1,2;
select 'waitlist', count(*), max(created_at) from coaching_waitlist union all select 'talk_notes', count(*), max(created_at) from talk_notes
union all select 'consulting_sessions', count(*), max(created_at) from consulting_sessions;
select date_trunc('week', created_at at time zone 'America/New_York')::date, count(*) from enneagram_test_results where created_at>='2026-10-12' group by 1 order by 1;
SELECT source, error_name, count(*) FROM app_error_events WHERE created_at>='2026-11-09 05:00+00' AND source <> 'host_digest' GROUP BY 1,2;
