-- docs/growth/audits/2026-11-23-weekly-audit.sql
-- Weekly growth audit, 2026-11-23 (run morning ET). Read-only; run each statement with scripts/db-query.sh.
-- Headline: admin_engagement_trends_weekly_v2(26) -> 2026-11-23-v2-snapshot.csv. The 11-23 row is a partial day; ignored.
-- "This week" = 2026-11-16..11-22 (Monday start, America/New_York). UTC window: 11-16 05:00 .. 11-23 05:00.
-- Outside event: Google November 2026 core update (rollout began 11-10). Q&A motion/runes pass shipped 11-20 11:16 ET (98fa9e5f7).
-- <A> = the admin-exclusion CTE from 2026-11-09-weekly-audit.sql (admin_profiles + admin_fingerprints).
-- Note: the RPC hung client-side twice under a foreground shell; writing to a file in the background returned it fine.

select * from admin_engagement_trends_weekly_v2(26);

-- Gate by surface (human only, after the 10-02 crawler break). Same query as 2026-11-16.
-- 11-16 week: celebrity 61 -> 0; home 21 -> 2; question 4 -> 1; "blog embed" bucket 18 -> 4 (it now holds /enneagram-test/result).

-- Non-home, non-celebrity gate rows by path and question (splits the test-result surface out of "blog embed").
<A> SELECT date_trunc('week',g.created_at at time zone 'America/New_York')::date wk,
  regexp_replace(coalesce(path,'(null)'),'^(/[^/]+(/[^/]+)?).*','\1') p, question_id,
  count(distinct fingerprint) filter(where event_type='gate_shown') gate_fps,
  count(distinct fingerprint) filter(where event_type='contribution') contrib_fps
FROM give_first_funnel_events g WHERE g.created_at>='2026-11-09 05:00+00' and g.created_at<'2026-11-23 05:00+00'
  and not (path='/' or path like '/personality-analysis/%')
  and not exists(select 1 from admin_fingerprints f where f.fingerprint=g.fingerprint)
  and not exists(select 1 from admin_profiles p where p.id=g.user_id) GROUP BY 1,2,3 ORDER BY 1,2,3;

-- Test-result surface, distinct fingerprints, with first-ever entry source and path.
<A>, t AS (select distinct fingerprint, bool_or(event_type='contribution') c from give_first_funnel_events g
 where g.created_at>='2026-11-16 05:00+00' and g.created_at<'2026-11-23 05:00+00' and path like '/enneagram-test/result%'
 and not exists(select 1 from admin_fingerprints f where f.fingerprint=g.fingerprint) group by 1)
select count(*) fps, count(*) filter (where c) contrib from t;   -- 14 fps, 4 contributors
-- Clopper-Pearson 95%: 4/14 -> 8.4-58.1%; celebrity 0/61 -> 0-5.9%. Fisher 4/14 vs 0/61: p ~ 0.001 (different, self-selected populations).

-- Comments since 11-09 with replies (DJ in-thread replies: 792 -> 789, 806 -> 805, 807 -> 642).
SELECT c.id, c.created_at at time zone 'America/New_York', c.parent_type, c.parent_id, c.author_id is not null logged_in,
  coalesce(p.admin,false) adm, c.removed, length(c.comment) len, left(c.fingerprint,8) fp,
  (select count(*) from comments r where r.parent_type='comment' and r.parent_id=c.id and r.removed is not true) replies
FROM comments c LEFT JOIN profiles p on p.id=c.author_id WHERE c.created_at>='2026-11-09 05:00+00' ORDER BY c.id;
-- blog_comments since 11-09: 0 rows.

-- Contribution events this week with gate lead time (same query as 2026-11-16, window from 11-16 05:00 UTC).

-- Contributor return (+24 h..+7 d visit days, second take, reachability), takes 781..805 on questions.
SELECT c.id, left(c.fingerprint,8) fp, round(extract(epoch from (now()-c.created_at))/86400.0,1) obs_days,
  (SELECT count(distinct (v.started_at at time zone 'America/New_York')::date) FROM page_analytics_visits v
    WHERE v.fingerprint=c.fingerprint AND v.started_at>=c.created_at+interval '24 hours' AND v.started_at<c.created_at+interval '7 days') AS return_days,
  EXISTS (SELECT 1 FROM comments r WHERE r.id<>c.id and r.created_at>c.created_at+interval '10 minutes' AND r.created_at<c.created_at+interval '7 days'
    AND r.removed IS NOT TRUE AND (r.fingerprint=c.fingerprint OR (c.author_id IS NOT NULL AND r.author_id=c.author_id))) AS second_take,
  exists(select 1 from signups s where s.first_touch_fingerprint=c.fingerprint) fp_signup,
  exists(select 1 from profiles p where p.first_touch_fingerprint=c.fingerprint) fp_profile,
  exists(select 1 from comment_reply_subscriptions s where s.comment_id=c.id) opted_in
FROM comments c WHERE c.id between 781 and 805 and c.id not in (783,792) and c.parent_type='question' ORDER BY c.id;
-- 787->788 and 793->794 are same-session (31 and 17 min), not returns.

-- Engaged-human entry source by week (same as 2026-11-09 SQL, window 11-02..11-22, plus bing and corner columns).

-- Test completions and email capture on the result page.
select date_trunc('week', created_at at time zone 'America/New_York')::date wk, count(*) n, count(notify_email) with_email
from enneagram_test_results where created_at>='2026-10-26' group by 1 order by 1;
select count(*), count(notify_email) from enneagram_test_results;   -- 57 lifetime, 1 with email

-- Host desk, digest, opt-ins, outbox; email; signups; beta card; bookings; registrants; errors: same statements as 2026-11-16 SQL,
-- windows moved to 11-16 05:00 UTC. KeepThisPage (Corner, shipped 11-13) posts to /api/signups, so 0 signups rows since 10-29 = 0 submits.
