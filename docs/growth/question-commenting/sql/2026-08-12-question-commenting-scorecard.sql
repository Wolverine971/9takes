-- docs/growth/question-commenting/sql/2026-08-12-question-commenting-scorecard.sql
-- Canonical read-only question/commenting scorecard.
-- Run against production with a read-only role. All day boundaries are UTC.
-- Direct responses are comments whose polymorphic parent is the question itself.

-- 1. Questions created per day.
select
  date_trunc('day', q.created_at at time zone 'UTC')::date as created_day,
  count(*) as questions_created
from public.questions q
where coalesce(q.removed, false) = false
group by 1
order by 1 desc;

-- 2. First-response speed and unanswered inventory by question.
with first_responses as (
  select
    c.parent_id as question_id,
    min(c.created_at) as first_response_at,
    count(*) as confirmed_direct_comments
  from public.comments c
  where c.parent_type = 'question'
    and coalesce(c.removed, false) = false
  group by c.parent_id
)
select
  q.id as question_id,
  q.url as question_url,
  q.created_at as question_created_at,
  fr.first_response_at,
  extract(epoch from (fr.first_response_at - q.created_at)) / 3600.0
    as hours_to_first_response,
  coalesce(fr.confirmed_direct_comments, 0) as confirmed_direct_comments,
  (fr.first_response_at <= q.created_at + interval '24 hours')
    as first_response_within_24_hours,
  (now() >= q.created_at + interval '24 hours' and fr.first_response_at is null)
    as unanswered_after_24_hours,
  (now() >= q.created_at + interval '7 days' and fr.first_response_at is null)
    as unanswered_after_7_days
from public.questions q
left join first_responses fr on fr.question_id = q.id
where coalesce(q.removed, false) = false
order by q.created_at desc;

-- 3. Daily cohort rollup: response coverage and median first-response time.
with first_responses as (
  select
    c.parent_id as question_id,
    min(c.created_at) as first_response_at
  from public.comments c
  where c.parent_type = 'question'
    and coalesce(c.removed, false) = false
  group by c.parent_id
), question_outcomes as (
  select
    date_trunc('day', q.created_at at time zone 'UTC')::date as created_day,
    q.created_at,
    fr.first_response_at,
    extract(epoch from (fr.first_response_at - q.created_at)) / 3600.0
      as hours_to_first_response
  from public.questions q
  left join first_responses fr on fr.question_id = q.id
  where coalesce(q.removed, false) = false
)
select
  created_day,
  count(*) as questions_created,
  count(*) filter (
    where first_response_at <= created_at + interval '24 hours'
  ) as questions_answered_within_24_hours,
  percentile_cont(0.5) within group (order by hours_to_first_response)
    filter (where hours_to_first_response is not null) as median_hours_to_first_response,
  count(*) filter (
    where now() >= created_at + interval '24 hours' and first_response_at is null
  ) as unanswered_after_24_hours,
  count(*) filter (
    where now() >= created_at + interval '7 days' and first_response_at is null
  ) as unanswered_after_7_days
from question_outcomes
group by created_day
order by created_day desc;

-- 4. First-time actors per day. This actor key is the canonical retention key.
-- Rows without either identity field are excluded because they cannot be reconciled.
with actor_comments as (
  select
    c.id,
    c.created_at,
    coalesce(nullif(c.author_id::text, ''), nullif(c.fingerprint, '')) as actor_key
  from public.comments c
  where coalesce(c.removed, false) = false
), ranked as (
  select
    id,
    created_at,
    actor_key,
    row_number() over (partition by actor_key order by created_at, id) as actor_comment_number
  from actor_comments
  where actor_key is not null
)
select
  date_trunc('day', created_at at time zone 'UTC')::date as first_comment_day,
  count(*) as first_time_actors
from ranked
where actor_comment_number = 1
group by 1
order by 1 desc;
