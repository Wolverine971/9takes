<!-- docs/growth/baselines/2026-11-20-qa-motion-pass-baseline.md -->
# Baseline: question-page motion pass (give-first funnel)

- **Recorded:** 2026-11-21 (queries run 2026-11-21 ~23:10 UTC, read-only, `scripts/db-query.sh`)
- **Change being measured:** commit `98fa9e5f7` ("updates"), committed 2026-11-20 16:16:45 UTC (11:16 ET). On the question page: your take glides into place and the others unblur, "The room, revealed." appears, likes are instant (optimistic), takes animate when sorted or filtered. Components: `Comment.svelte`, `Comments.svelte`, `Interact.svelte`, `SortComments.svelte`, `QuestionContent.svelte`, `RankedComments.svelte`, `takeHandoff.ts`, `questionMorph.ts`. The Vercel deploy time was not checked; the commit time is the earliest it could be live.
- **Treated surface:** `/questions/[slug]` only. Celebrity pages render `BlogComments`/`BlogInteract` and the live-question widget, and the homepage uses its own live-take box. None of these were changed.
- **Baseline window:** `[2026-10-21 00:00 UTC, 2026-11-20 00:00 UTC)`, 30 days, ending 16 h before the commit.
- **Weekly noise bins:** 7-day UTC bins counted back from the window end: W1 10-23, W2 10-30, W3 11-06, W4 11-13. The `total` row also includes 10-21 and 10-22.
- **Matured cohorts:** a metric with an outcome window only counts cohort events whose outcome window closes before the window end. 24 h metrics (M1, M2) use cohorts through 11-19 00:00, so W4 is 6 days. The 7-day metric (M3) uses cohorts through 11-13 00:00, so it has no W4. No outcome in this baseline falls after the deploy.

## Read this first

The question page is a small surface. In 30 days it logged **24 browser-verified gated visitors, 4 of whom answered**. Across all surfaces there were **29 human answers, 0 human likes and 0 human replies**. A 2–3 week comparison can only show a big change, such as post-reveal engagement going from zero to several, or a breakage, such as conversion falling to zero. It cannot detect a 10–30% lift. Each number below has a 95% Wilson interval so the comparison isn't read as a trend when it's noise.

## Headline metrics

| Metric                                                                                                        | W1 10-23               | W2 10-30 | W3 11-06 | W4 11-13 | 30-day total                                        | 95% CI (total) |
| ------------------------------------------------------------------------------------------------------------- | ---------------------- | -------- | -------- | -------- | --------------------------------------------------- | -------------- |
| **M1a** Wall → answer, visitors (all question-page gate fingerprints, answered the same question within 24 h) | 0/13                   | 1/12     | 1/8      | 2/5      | **4/39 = 10.3%**                                    | 4.1–23.6%      |
| **M1b** Wall → answer, browser-verified visitors                                                              | 0/8                    | 1/6      | 1/5      | 2/4      | **4/24 = 16.7%**                                    | 6.7–35.9%      |
| M1c Wall → answer, gate _pairs_ (visitor × question)                                                          | 0/22                   | 1/27     | 1/15     | 3/15     | 5/80 = 6.3%                                         | 2.7–13.8%      |
| M1 split: anonymous visitors (all / verified)                                                                 | 0/13                   | 1/12     | 1/7      | 2/5      | 4/38 = 10.5% / 4/23 = 17.4%                         | —              |
| M1 split: logged-in users                                                                                     | –                      | –        | 0/1      | 1/1      | 1/2                                                 | —              |
| **M2** Answerers who liked, replied, or posted another take in the same question within 24 h (all surfaces)   | 0/7                    | 0/8      | 0/3      | 0/7      | **0/28 = 0%**                                       | 0–12.1%        |
| M2, question-page answerers only                                                                              | –                      | 0/2      | 0/1      | 0/2      | 0/5                                                 | 0–43.4%        |
| M2, logged-in answerers (the only ones able to like)                                                          | –                      | –        | –        | 0/2      | 0/2                                                 | —              |
| **M3a** Answerers active on a _different_ question within 7 days (any signal, same session included)          | 1/7                    | 3/8      | 0/3      | n/a      | **4/21 = 19.0%**                                    | 7.7–40.0%      |
| **M3b** …in a _new_ session (a true return)                                                                   | 0/7                    | 0/8      | 0/3      | n/a      | **0/21 = 0%**                                       | 0–15.5%        |
| M3 context: came back to 9takes at all (any page, new session) within 7 days                                  | 2/7                    | 2/8      | 0/3      | n/a      | 5/21 = 23.8%                                        | —              |
| **M4** Human likes per 100 revealed take views                                                                | snapshot only (see M4) |          |          |          | 0.17 (1 like ÷ 595 views since view tracking began) | —              |
| **M5** Human answers (all surfaces)                                                                           | 7                      | 8        | 3        | 8        | **29**                                              | —              |
| M5 …posted from a question page                                                                               | 0                      | 2        | 1        | 2        | 5                                                   | —              |
| M5 Human replies                                                                                              | 0                      | 0        | 0        | 0        | **0**                                               | —              |
| M5 Human likes                                                                                                | 0                      | 0        | 0        | 0        | **0**                                               | —              |
| M5 context: DJ/admin replies (excluded)                                                                       | 1                      | 0        | 0        | 1        | 3                                                   | —              |

The M5 W4 bin is a full 7 days (11-13 to 11-19). M1 and M2 W4 bins stop at 11-19 00:00 UTC.

Historical reference for M2 (same SQL with `win_start = 2026-05-01`): **2/114 answerers (1.8%)** engaged post-reveal, both by liking while logged in. Ignore that run's surface split: before 2026-10-02, question-page contributions have `path IS NULL` and land in "other_surface".

Where the 29 answers came from (M0): celebrity page 11, homepage 9, **question page 5**, enneagram test result 3, blog embed 1.

## How to compare (in 2–3 weeks)

1. Re-run M0, M1, M2, M3 and M5 **verbatim**, changing only the `params` row: `win_start = '2026-11-21 00:00:00+00'` (first full UTC day after the commit) and `win_end` = the run date at 00:00 UTC. A 21-day window (`win_end = '2026-12-12 00:00:00+00'`) gives M3 a 14-day cohort. Keep M1/M2 horizons at 24 h and M3 at 7 d.
2. Compare rates, not counts, because the windows differ in length. Use the weekly range above as the noise band. A post value inside both the W1–W4 range and the baseline CI is "no detectable change".
3. **The one readable signal is M2.** At the historical 1.8% rate, 3 or more engaged answerers out of about 20 has roughly a 0.6% chance of happening by noise. M1b moving from about 17% to 40%+ would also be notable, but the post-window n will be about 15–20 visitors.
4. Use other-surface answerers as a rough concurrent control. They were not exposed to the pass unless they later opened the question page. If M2 rises for question-page answerers and not for the others, the pass is the likelier cause. The control is weak because the counts are tiny.
5. For M4, re-run the snapshot query and compute `(nonadmin_likes_since_view_tracking@T1 − 1) ÷ (views_all_takes@T1 − 595)`. That gives the like rate per revealed view for the period between the two snapshots. It starts at 2026-11-21 23:13 UTC, about 31 h after the commit, so the first day after deploy is lost.

## M4 snapshot (T0)

| snapshot_at (UTC)   | takes (all, incl. removed) | views_all_takes | non-admin likes (lifetime) | non-admin likes since view tracking | admin likes | last non-admin like |
| ------------------- | -------------------------- | --------------- | -------------------------- | ----------------------------------- | ----------- | ------------------- |
| 2026-11-21 23:13:40 | 396                        | 595             | 4                          | 1                                   | 72          | 2026-09-20 22:08    |

## M5 daily counts (UTC)

| day        | answers | from question page | logged-in answers | replies | likes | admin replies (context) |
| ---------- | ------- | ------------------ | ----------------- | ------- | ----- | ----------------------- |
| 2026-10-21 | 1       | 0                  | 0                 | 0       | 0     | 0                       |
| 2026-10-22 | 2       | 0                  | 0                 | 0       | 0     | 1                       |
| 2026-10-23 | 0       | 0                  | 0                 | 0       | 0     | 0                       |
| 2026-10-24 | 1       | 0                  | 0                 | 0       | 0     | 0                       |
| 2026-10-25 | 1       | 0                  | 0                 | 0       | 0     | 0                       |
| 2026-10-26 | 3       | 0                  | 0                 | 0       | 0     | 0                       |
| 2026-10-27 | 1       | 0                  | 0                 | 0       | 0     | 0                       |
| 2026-10-28 | 0       | 0                  | 0                 | 0       | 0     | 0                       |
| 2026-10-29 | 1       | 0                  | 0                 | 0       | 0     | 1                       |
| 2026-10-30 | 0       | 0                  | 0                 | 0       | 0     | 0                       |
| 2026-10-31 | 5       | 1                  | 0                 | 0       | 0     | 0                       |
| 2026-11-01 | 0       | 0                  | 0                 | 0       | 0     | 0                       |
| 2026-11-02 | 0       | 0                  | 0                 | 0       | 0     | 0                       |
| 2026-11-03 | 1       | 1                  | 0                 | 0       | 0     | 0                       |
| 2026-11-04 | 2       | 0                  | 0                 | 0       | 0     | 0                       |
| 2026-11-05 | 0       | 0                  | 0                 | 0       | 0     | 0                       |
| 2026-11-06 | 0       | 0                  | 0                 | 0       | 0     | 0                       |
| 2026-11-07 | 0       | 0                  | 0                 | 0       | 0     | 0                       |
| 2026-11-08 | 0       | 0                  | 0                 | 0       | 0     | 0                       |
| 2026-11-09 | 1       | 0                  | 0                 | 0       | 0     | 0                       |
| 2026-11-10 | 1       | 1                  | 0                 | 0       | 0     | 0                       |
| 2026-11-11 | 1       | 0                  | 0                 | 0       | 0     | 0                       |
| 2026-11-12 | 0       | 0                  | 0                 | 0       | 0     | 0                       |
| 2026-11-13 | 2       | 1                  | 2                 | 0       | 0     | 0                       |
| 2026-11-14 | 0       | 0                  | 0                 | 0       | 0     | 0                       |
| 2026-11-15 | 0       | 0                  | 0                 | 0       | 0     | 0                       |
| 2026-11-16 | 2       | 0                  | 0                 | 0       | 0     | 0                       |
| 2026-11-17 | 1       | 0                  | 0                 | 0       | 0     | 1                       |
| 2026-11-18 | 2       | 1                  | 0                 | 0       | 0     | 0                       |
| 2026-11-19 | 1       | 0                  | 0                 | 0       | 0     | 0                       |

## Definitions and exclusions

- **Admin exclusion** (same as `admin_engagement_trends_weekly_v2`): the 5 `profiles.admin` accounts plus every fingerprint ever tied to them (page visits, comments, give-first events, first touch). This removes DJ's own takes, replies, likes and gate hits (for example comment 783 on q573 and 4 DJ replies).
- **Test accounts:** searched `profiles` for `%test%`, `@9takes.com` and `example.com`. The only non-admin hit is a substring false positive, so there is no extra exclusion. Demo tables (`comment_like_demo` etc.) are never read.
- **AI comments:** AI takes live in `comments_ai` and `nine_takes`, never in `comments`, so every query here excludes them by construction.
- **Removed comments** (`removed = true`) are excluded everywhere. 2 were removed in the window (778, 780).
- **Answer** = a non-removed, non-admin top-level row in `comments` (`parent_type='question'`). Its surface comes from the matching `give_first_funnel_events` contribution `path`.
- **Gate (M1)** = `give_first_funnel_events.event_type='gate_shown'` with `path like '/questions/%'`. It is logged server-side when a question page loads for someone who hasn't answered it, after the 2026-10-02 crawler-UA filter. The table keeps the earliest row per (fingerprint, event, question), so a gate row means the first time ever that visitor was shown that question's wall. **Browser-verified** = the same fingerprint has a `page_analytics_visits` row on the same path within ±30 min. 50 of 80 gate pairs have no client-side visit. Many come in bursts: one fingerprint "opens" 5–6 questions within a minute and no analytics beacon fires. These look like browser-UA crawlers or scanners, but they could also be real visitors who block analytics. Report both M1a and M1b.
- **M1 conversion** = an answer to the gated question, by the same fingerprint (or the same user_id when logged in), posted within 24 h of the gate. It counts on any surface. One answer (q203, 11-13) was gated on the question page and posted through the homepage box.
- **Logged-in vs anonymous** is set at the event: `gate.user_id` for M1, `comments.author_id` for M2/M3. One visitor logged in partway through a session, so they appear in both segments.
- **M2 outcomes:** a `comment_like` by the answerer's user_id on any take or reply in that question, a non-removed reply at any depth in that question, or another non-removed top-level take in that question. Each must fall within (answer, answer + 24 h]. The cohort is the first-ever answer per person per question.
- **M3 cohort:** the person's first answer in the window. Person = author_id, else fingerprint, else IP. **Other-question activity:** a `page_analytics_visits` row on `/questions/<url>` of a different question (matched by fingerprint, or by user_id when logged in), a gate hit, an answer or reply, or a like on a different question, within (answer, answer + 7 d]. **New session** = a `page_analytics_visits.session_id` different from the session the answer happened in. **Identity:** fingerprint (`9tfingerprint` cookie) for everyone, plus user_id for logged-in answerers. Cross-device returns by anonymous people are invisible.

## Caveats

1. **Small n.** Every rate rests on single-digit numerators. Each weekly bin is within noise of the others.
2. **The pass may barely touch the funnel.** About 80% of answers (24/29) happen off the question page. Most answerers never see the new reveal unless they click through to the question.
3. **Likes need a login.** `comment_like` has no fingerprint, and 2 of 29 answerers were logged in, so "instant likes" helps a behaviour almost no answerer can perform. Un-liking deletes the row, so only likes that survived are counted. The optimistic-like change also blocks double taps (`likePending`), which may slightly change like and unlike row patterns.
4. **Views are a lifetime counter.** `comments.view_count` has no timestamps. `increment_comment_views` counts a take when it is at least 50% visible to someone who already answered, excludes the take's own author, and does not exclude admins, so DJ's views are in the denominator. Each browser dedupes through localStorage. View tracking began with migration `20260907175553`, which is the file timestamp, not a verified apply time. The pass did not change view firing (`src/lib/browser/commentViews.ts` was untouched), but the new reveal animation could shift when take cards cross the 50% visibility threshold.
5. **Identity is split.** The same human can appear under an `anon-*` fallback ID and a FingerprintJS visitorId, so M3 returns are a lower bound.
6. **Deploy time is unverified.** Starting the post window at 2026-11-21 00:00 UTC avoids any part-day mix.

## Not computable

- **M4 as a windowed pre-deploy rate:** there are no view timestamps. Only the T0 snapshot and the snapshot-diff method above are possible.
- **Anonymous likes:** not possible by design.
- **Logged-in M2/M3:** n = 2 and 0. Reported, but meaningless.
- **Sort/filter usage, "The room, revealed." impressions, and time or scroll after reveal:** no first-party events exist. `SortComments.svelte` logs nothing. PostHog loads with `defaults: '2026-01-30'` (autocapture on by default; `src/lib/analytics/posthog.ts`), so click data _may_ exist there. That is unverified and cannot be queried from here.

## Exact SQL

All queries were run with `./scripts/db-query.sh <file-or-string>`. Change only the `params` row when re-running.

### M0. Answers by surface (context)

```sql
-- M0 (context). Where human answers were posted from, by the contribution event's path.
-- Edit only the params row to re-run on another window.
with params as (
  select timestamptz '2026-10-21 00:00:00+00' as win_start,
         timestamptz '2026-11-20 00:00:00+00' as win_end
),
admin_profiles as (select id from public.profiles where admin is true),
admin_fps as (
  select fingerprint from public.page_analytics_visits where user_id in (select id from admin_profiles) and fingerprint is not null
  union select fingerprint from public.comments where author_id in (select id from admin_profiles) and fingerprint is not null
  union select fingerprint from public.give_first_funnel_events where user_id in (select id from admin_profiles) and fingerprint is not null
  union select first_touch_fingerprint from public.profiles where admin is true and first_touch_fingerprint is not null
),
answers as (
  select c.id,
         (select g.path from public.give_first_funnel_events g
           where g.event_type = 'contribution' and g.fingerprint = c.fingerprint and g.question_id = c.parent_id
           order by g.created_at limit 1) as contrib_path
  from public.comments c cross join params p
  where c.parent_type = 'question' and c.removed is not true
    and c.created_at >= p.win_start and c.created_at < p.win_end
    and (c.author_id is null or c.author_id not in (select id from admin_profiles))
    and (c.fingerprint is null or c.fingerprint not in (select fingerprint from admin_fps))
)
select case when contrib_path like '/questions/%' then 'question page'
            when contrib_path = '/' then 'homepage'
            when contrib_path like '/personality-analysis/%' then 'celebrity page'
            when contrib_path like '/enneagram-test/%' then 'enneagram test result'
            when contrib_path is null then 'unknown (no contribution event)'
            else 'blog embed' end as surface,
       count(*) as answers
from answers
group by 1
order by 2 desc;
```

### M1. Question-page give-first wall

```sql
-- M1. Question-page give-first wall: gate shown -> answered the same question within 24h.
-- Edit only the params row to re-run on another window.
with params as (
  select timestamptz '2026-10-21 00:00:00+00' as win_start,
         timestamptz '2026-11-20 00:00:00+00' as win_end,
         interval '24 hours' as horizon
),
admin_profiles as (select id from public.profiles where admin is true),
admin_fps as (
  select fingerprint from public.page_analytics_visits where user_id in (select id from admin_profiles) and fingerprint is not null
  union select fingerprint from public.comments where author_id in (select id from admin_profiles) and fingerprint is not null
  union select fingerprint from public.give_first_funnel_events where user_id in (select id from admin_profiles) and fingerprint is not null
  union select first_touch_fingerprint from public.profiles where admin is true and first_touch_fingerprint is not null
),
-- 'total' = whole window; weekly bins are 7-day UTC bins counted back from win_end (clamped to win_start).
-- Every bin stops at win_end - horizon so each gate's 24h outcome closes before win_end.
bins as (
  select 'total' as bin, p.win_start as b_start, p.win_end - p.horizon as b_end from params p
  union all
  select to_char(greatest(gs, p.win_start), 'YYYY-MM-DD'), greatest(gs, p.win_start), least(gs + interval '7 days', p.win_end - p.horizon)
  from params p, generate_series(p.win_end - interval '28 days', p.win_end - interval '7 days', interval '7 days') gs
),
gates as (
  select g.fingerprint, g.question_id, g.created_at, g.user_id, g.path,
         g.user_id is not null as logged_in,
         -- browser-verified: the same fingerprint has a client-side page visit on the same path
         -- within 30 min. Drops server renders with no client-side visit: browser-UA crawlers and
         -- rapid-fire scanners (also any real visitor whose analytics beacon was blocked).
         exists (select 1 from public.page_analytics_visits v
                 where v.fingerprint = g.fingerprint and v.path = g.path
                   and v.started_at between g.created_at - interval '30 minutes' and g.created_at + interval '30 minutes') as verified
  from public.give_first_funnel_events g cross join params p
  where g.event_type = 'gate_shown'
    and g.path like '/questions/%'
    and g.created_at >= p.win_start and g.created_at < p.win_end - p.horizon
    and g.fingerprint not in (select fingerprint from admin_fps)
    and (g.user_id is null or g.user_id not in (select id from admin_profiles))
),
scored as (
  select gt.*,
         exists (select 1 from public.comments c cross join params p
                 where c.parent_type = 'question' and c.parent_id = gt.question_id
                   and c.removed is not true
                   and (c.fingerprint = gt.fingerprint or (gt.user_id is not null and c.author_id = gt.user_id))
                   and c.created_at >= gt.created_at and c.created_at < gt.created_at + p.horizon) as answered
  from gates gt
),
segmented as (
  select s.*, 'all' as segment from scored s
  union all select s.*, case when s.logged_in then 'logged_in' else 'anon' end from scored s
  union all select s.*, 'verified_all' from scored s where s.verified
  union all select s.*, case when s.logged_in then 'verified_logged_in' else 'verified_anon' end from scored s where s.verified
)
select b.bin, sg.segment,
       count(*) as gate_pairs,
       count(*) filter (where sg.answered) as answered_pairs,
       round(100.0 * count(*) filter (where sg.answered) / nullif(count(*), 0), 1) as pair_conv_pct,
       count(distinct sg.fingerprint) as gate_fps,
       count(distinct sg.fingerprint) filter (where sg.answered) as answered_fps,
       round(100.0 * count(distinct sg.fingerprint) filter (where sg.answered) / nullif(count(distinct sg.fingerprint), 0), 1) as fp_conv_pct
from bins b
join segmented sg on sg.created_at >= b.b_start and sg.created_at < b.b_end
group by b.bin, sg.segment
order by b.bin = 'total' desc, b.bin, sg.segment;
```

### M2. Post-reveal engagement within 24 h

```sql
-- M2. Post-reveal engagement: of people who answered a question (first answer per person per
-- question), the share who liked a take, replied, or posted another top-level take in the
-- SAME question within 24h. Edit only the params row to re-run on another window.
with recursive params as (
  select timestamptz '2026-10-21 00:00:00+00' as win_start,
         timestamptz '2026-11-20 00:00:00+00' as win_end,
         interval '24 hours' as horizon
),
admin_profiles as (select id from public.profiles where admin is true),
admin_fps as (
  select fingerprint from public.page_analytics_visits where user_id in (select id from admin_profiles) and fingerprint is not null
  union select fingerprint from public.comments where author_id in (select id from admin_profiles) and fingerprint is not null
  union select fingerprint from public.give_first_funnel_events where user_id in (select id from admin_profiles) and fingerprint is not null
  union select first_touch_fingerprint from public.profiles where admin is true and first_touch_fingerprint is not null
),
-- every comment (take or reply at any depth) mapped to its root question
roots (id, root_qid) as (
  select c.id, c.parent_id from public.comments c where c.parent_type = 'question'
  union all
  select c.id, r.root_qid from public.comments c join roots r on c.parent_type = 'comment' and c.parent_id = r.id
),
bins as (
  select 'total' as bin, p.win_start as b_start, p.win_end - p.horizon as b_end from params p
  union all
  select to_char(greatest(gs, p.win_start), 'YYYY-MM-DD'), greatest(gs, p.win_start), least(gs + interval '7 days', p.win_end - p.horizon)
  from params p, generate_series(p.win_end - interval '28 days', p.win_end - interval '7 days', interval '7 days') gs
),
human_answers as (
  select c.id, c.parent_id as qid, c.created_at, c.author_id, c.fingerprint,
         coalesce(c.author_id::text, c.fingerprint, c.ip) as person
  from public.comments c
  where c.parent_type = 'question' and c.removed is not true
    and (c.author_id is null or c.author_id not in (select id from admin_profiles))
    and (c.fingerprint is null or c.fingerprint not in (select fingerprint from admin_fps))
),
-- first-ever answer per person per question (a later second take is an outcome, not a new cohort row)
first_answers as (
  select distinct on (person, qid) * from human_answers order by person, qid, created_at, id
),
cohort as (
  select fa.*,
         fa.author_id is not null as logged_in,
         (select g.path from public.give_first_funnel_events g
           where g.event_type = 'contribution' and g.fingerprint = fa.fingerprint and g.question_id = fa.qid
           order by g.created_at limit 1) as contrib_path
  from first_answers fa cross join params p
  where fa.created_at >= p.win_start and fa.created_at < p.win_end - p.horizon
),
scored as (
  select co.*,
         case when co.contrib_path like '/questions/%' then 'question_page' else 'other_surface' end as surface,
         -- likes need a session (comment_like has user_id only): anon answerers can never score here
         exists (select 1 from public.comment_like l join roots r on r.id = l.comment_id cross join params p
                 where r.root_qid = co.qid and co.author_id is not null and l.user_id = co.author_id
                   and l.created_at > co.created_at and l.created_at <= co.created_at + p.horizon) as liked,
         exists (select 1 from public.comments x join roots r on r.id = x.id cross join params p
                 where x.parent_type = 'comment' and r.root_qid = co.qid and x.removed is not true
                   and (x.author_id = co.author_id or x.fingerprint = co.fingerprint)
                   and x.created_at > co.created_at and x.created_at <= co.created_at + p.horizon) as replied,
         exists (select 1 from public.comments x cross join params p
                 where x.parent_type = 'question' and x.parent_id = co.qid and x.id <> co.id and x.removed is not true
                   and (x.author_id = co.author_id or x.fingerprint = co.fingerprint)
                   and x.created_at > co.created_at and x.created_at <= co.created_at + p.horizon) as another_take
  from cohort co
),
segmented as (
  select s.*, 'all' as segment from scored s
  union all select s.*, s.surface from scored s
  union all select s.*, case when s.logged_in then 'logged_in' else 'anon' end from scored s
)
select b.bin, sg.segment,
       count(*) as answerers,
       count(*) filter (where sg.logged_in) as logged_in_answerers,
       count(*) filter (where sg.liked) as liked,
       count(*) filter (where sg.replied) as replied,
       count(*) filter (where sg.another_take) as another_take,
       count(*) filter (where sg.liked or sg.replied or sg.another_take) as any_engagement,
       round(100.0 * count(*) filter (where sg.liked or sg.replied or sg.another_take) / nullif(count(*), 0), 1) as any_engagement_pct
from bins b
join segmented sg on sg.created_at >= b.b_start and sg.created_at < b.b_end
group by b.bin, sg.segment
order by b.bin = 'total' desc, b.bin, sg.segment;
```

### M3. 7-day return to another question

```sql
-- M3. 7-day cross-question return: of people who answered (first answer per person in the
-- window), the share who did anything on a DIFFERENT question within 7 days.
-- Identity = fingerprint (9tfingerprint cookie), plus user_id when the answer was logged in.
-- Edit only the params row to re-run on another window.
with recursive params as (
  select timestamptz '2026-10-21 00:00:00+00' as win_start,
         timestamptz '2026-11-20 00:00:00+00' as win_end,
         interval '7 days' as horizon
),
admin_profiles as (select id from public.profiles where admin is true),
admin_fps as (
  select fingerprint from public.page_analytics_visits where user_id in (select id from admin_profiles) and fingerprint is not null
  union select fingerprint from public.comments where author_id in (select id from admin_profiles) and fingerprint is not null
  union select fingerprint from public.give_first_funnel_events where user_id in (select id from admin_profiles) and fingerprint is not null
  union select first_touch_fingerprint from public.profiles where admin is true and first_touch_fingerprint is not null
),
roots (id, root_qid) as (
  select c.id, c.parent_id from public.comments c where c.parent_type = 'question'
  union all
  select c.id, r.root_qid from public.comments c join roots r on c.parent_type = 'comment' and c.parent_id = r.id
),
-- weekly cohort bins; every bin stops at win_end - 7d so each 7-day outcome closes before win_end
bins as (
  select 'total' as bin, p.win_start as b_start, p.win_end - p.horizon as b_end from params p
  union all
  select to_char(greatest(gs, p.win_start), 'YYYY-MM-DD'), greatest(gs, p.win_start), least(gs + interval '7 days', p.win_end - p.horizon)
  from params p, generate_series(p.win_end - interval '28 days', p.win_end - interval '14 days', interval '7 days') gs
),
human_answers as (
  select c.id, c.parent_id as qid, c.created_at, c.author_id, c.fingerprint,
         coalesce(c.author_id::text, c.fingerprint, c.ip) as person
  from public.comments c cross join params p
  where c.parent_type = 'question' and c.removed is not true
    and c.created_at >= p.win_start and c.created_at < p.win_end - p.horizon
    and (c.author_id is null or c.author_id not in (select id from admin_profiles))
    and (c.fingerprint is null or c.fingerprint not in (select fingerprint from admin_fps))
),
cohort as (
  select distinct on (person) ha.*, ha.author_id is not null as logged_in,
         -- the page-analytics session the answer happened in (latest visit started at or before it)
         (select v.session_id from public.page_analytics_visits v
           where v.fingerprint = ha.fingerprint and v.started_at <= ha.created_at
           order by v.started_at desc limit 1) as answer_session
  from human_answers ha order by person, created_at, id
),
other_q_views as (
  -- question-page visits to a different question, by fingerprint or (logged-in) user id
  select co.person, v.started_at as at, v.session_id
  from cohort co cross join params p
  join public.page_analytics_visits v
    on (v.fingerprint = co.fingerprint or (co.author_id is not null and v.user_id = co.author_id))
   and v.started_at > co.created_at and v.started_at <= co.created_at + p.horizon
  join public.questions q2 on v.path = '/questions/' || q2.url and q2.id <> co.qid
),
other_q_actions as (
  -- answers or replies on a different question
  select co.person, x.created_at as at, 'contribution' as kind
  from cohort co cross join params p
  join public.comments x on (x.fingerprint = co.fingerprint or (co.author_id is not null and x.author_id = co.author_id))
   and x.created_at > co.created_at and x.created_at <= co.created_at + p.horizon and x.removed is not true
  join roots r on r.id = x.id and r.root_qid <> co.qid
  union all
  -- likes on a different question (logged-in only)
  select co.person, l.created_at, 'like'
  from cohort co cross join params p
  join public.comment_like l on co.author_id is not null and l.user_id = co.author_id
   and l.created_at > co.created_at and l.created_at <= co.created_at + p.horizon
  join roots r on r.id = l.comment_id and r.root_qid <> co.qid
  union all
  -- question-page wall hits on a different question (server-logged; may include crawler renders)
  select co.person, g.created_at, 'gate_view'
  from cohort co cross join params p
  join public.give_first_funnel_events g on g.fingerprint = co.fingerprint and g.question_id <> co.qid
   and g.path like '/questions/%' and g.event_type = 'gate_shown'
   and g.created_at > co.created_at and g.created_at <= co.created_at + p.horizon
),
scored as (
  select co.*,
         exists (select 1 from other_q_views o where o.person = co.person)
           or exists (select 1 from other_q_actions a where a.person = co.person) as any_other_q,
         exists (select 1 from other_q_views o where o.person = co.person
                 and o.session_id is distinct from co.answer_session) as return_visit_other_q,
         exists (select 1 from other_q_actions a where a.person = co.person
                 and a.kind = 'contribution') as contributed_other_q,
         -- context: came back to 9takes at all (any page, new session) within 7 days
         exists (select 1 from public.page_analytics_visits v cross join params p
                 where (v.fingerprint = co.fingerprint or (co.author_id is not null and v.user_id = co.author_id))
                   and v.started_at > co.created_at and v.started_at <= co.created_at + p.horizon
                   and v.session_id is distinct from co.answer_session) as returned_any_page
  from cohort co
),
segmented as (
  select s.*, 'all' as segment from scored s
  union all select s.*, case when s.logged_in then 'logged_in' else 'anon' end from scored s
)
select b.bin, sg.segment,
       count(*) as answerers,
       count(*) filter (where sg.any_other_q) as any_other_q_7d,
       round(100.0 * count(*) filter (where sg.any_other_q) / nullif(count(*), 0), 1) as any_other_q_pct,
       count(*) filter (where sg.return_visit_other_q) as new_session_other_q_7d,
       round(100.0 * count(*) filter (where sg.return_visit_other_q) / nullif(count(*), 0), 1) as new_session_pct,
       count(*) filter (where sg.contributed_other_q) as contributed_other_q_7d,
       count(*) filter (where sg.returned_any_page) as returned_any_page_7d
from bins b
join segmented sg on sg.created_at >= b.b_start and sg.created_at < b.b_end
group by b.bin, sg.segment
order by b.bin = 'total' desc, b.bin, sg.segment;
```

### M4. Like-per-view snapshot

```sql
-- M4. Like rate per revealed take view: SNAPSHOT (comments.view_count is a lifetime counter with
-- no timestamps, so a windowed rate can only come from the difference between two snapshots).
-- Views count only for viewers who have answered that question (increment_comment_views), i.e.
-- they are revealed-thread take impressions. Run as-is at each snapshot; nothing to edit.
with admin_profiles as (select id from public.profiles where admin is true),
takes as (
  -- every top-level take ever, removed included, so the view sum only ever goes up
  select c.id, c.view_count, c.removed, c.created_at from public.comments c where c.parent_type = 'question'
)
select now() as snapshot_at,
       (select count(*) from takes) as takes_all,
       (select sum(view_count) from takes) as views_all_takes,
       (select count(*) from public.comment_like l join takes t on t.id = l.comment_id
         where l.user_id not in (select id from admin_profiles)) as nonadmin_likes_all_takes,
       (select count(*) from public.comment_like l join takes t on t.id = l.comment_id
         where l.user_id in (select id from admin_profiles)) as admin_likes_all_takes,
       (select max(l.created_at) from public.comment_like l join takes t on t.id = l.comment_id
         where l.user_id not in (select id from admin_profiles)) as last_nonadmin_like_at,
       round(100.0 * (select count(*) from public.comment_like l join takes t on t.id = l.comment_id
         where l.user_id not in (select id from admin_profiles))
         / nullif((select sum(view_count) from takes), 0), 2) as nonadmin_likes_per_100_views_lifetime,
       -- view counting shipped in migration 20260907175553; likes before that have no matching views
       (select count(*) from public.comment_like l join takes t on t.id = l.comment_id
         where l.user_id not in (select id from admin_profiles)
           and l.created_at >= timestamptz '2026-09-07 17:55:53+00') as nonadmin_likes_since_view_tracking,
       round(100.0 * (select count(*) from public.comment_like l join takes t on t.id = l.comment_id
         where l.user_id not in (select id from admin_profiles)
           and l.created_at >= timestamptz '2026-09-07 17:55:53+00')
         / nullif((select sum(view_count) from takes), 0), 2) as nonadmin_likes_per_100_views_since_tracking;
```

### M5. Daily raw counts

```sql
-- M5. Raw daily counts (UTC days): human answers (top-level takes), of which posted from a
-- question page, human replies, human likes on question takes; DJ/admin replies shown separately
-- for context only. Edit only the params row to re-run on another window.
with recursive params as (
  select timestamptz '2026-10-21 00:00:00+00' as win_start,
         timestamptz '2026-11-20 00:00:00+00' as win_end
),
admin_profiles as (select id from public.profiles where admin is true),
admin_fps as (
  select fingerprint from public.page_analytics_visits where user_id in (select id from admin_profiles) and fingerprint is not null
  union select fingerprint from public.comments where author_id in (select id from admin_profiles) and fingerprint is not null
  union select fingerprint from public.give_first_funnel_events where user_id in (select id from admin_profiles) and fingerprint is not null
  union select first_touch_fingerprint from public.profiles where admin is true and first_touch_fingerprint is not null
),
roots (id, root_qid) as (
  select c.id, c.parent_id from public.comments c where c.parent_type = 'question'
  union all
  select c.id, r.root_qid from public.comments c join roots r on c.parent_type = 'comment' and c.parent_id = r.id
),
days as (
  select gs::date as day from params p, generate_series(p.win_start, p.win_end - interval '1 day', interval '1 day') gs
),
win_comments as (
  select c.*,
         (c.author_id is not null and c.author_id in (select id from admin_profiles))
           or (c.fingerprint is not null and c.fingerprint in (select fingerprint from admin_fps)) as is_admin,
         exists (select 1 from public.give_first_funnel_events g
                 where g.event_type = 'contribution' and g.fingerprint = c.fingerprint
                   and g.question_id = c.parent_id and g.path like '/questions/%') as from_question_page
  from public.comments c cross join params p
  where c.removed is not true and c.created_at >= p.win_start and c.created_at < p.win_end
),
win_likes as (
  select l.* from public.comment_like l join roots r on r.id = l.comment_id cross join params p
  where l.created_at >= p.win_start and l.created_at < p.win_end
    and l.user_id not in (select id from admin_profiles)
)
select d.day,
       count(c.id) filter (where c.parent_type = 'question' and not c.is_admin) as answers,
       count(c.id) filter (where c.parent_type = 'question' and not c.is_admin and c.from_question_page) as answers_question_page,
       count(c.id) filter (where c.parent_type = 'question' and not c.is_admin and c.author_id is not null) as answers_logged_in,
       count(c.id) filter (where c.parent_type = 'comment' and not c.is_admin) as replies,
       (select count(*) from win_likes l where l.created_at::date = d.day) as likes,
       count(c.id) filter (where c.parent_type = 'comment' and c.is_admin) as admin_replies_context
from days d
left join win_comments c on c.created_at::date = d.day
group by d.day
order by d.day;
```
