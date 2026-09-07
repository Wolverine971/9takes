-- Run weekly with the service role / SQL editor after the ranking migration.
-- Save result 2 as CSV each week for changes over time. Counts are cumulative.
-- Change the host UUID if PRIVATE_HOST_USER_ID is configured differently.
WITH starter_ranks AS (
  SELECT q.id AS question_id, q.starter_rank, r.*
  FROM public.questions q
  CROSS JOIN LATERAL public.get_question_take_ranking(q.id, '9ce7ff91-d7f8-4397-b00d-8716e335aaee') r
  WHERE q.starter_rank IS NOT NULL AND q.removed IS NOT TRUE AND q.flagged IS NOT TRUE
), per_question AS (
  SELECT question_id, starter_rank, count(*) AS takes, sum(views) AS total_views,
    count(*) FILTER (WHERE NOT below_floor) AS above_floor_takes,
    min(views) FILTER (WHERE NOT below_floor) AS min_above_floor_views,
    max(views) FILTER (WHERE NOT below_floor) AS max_above_floor_views,
    count(*) FILTER (WHERE NOT below_floor AND views = 0) AS unseen_above_floor,
    count(*) FILTER (WHERE rank <= 8 AND below_floor)::numeric /
      nullif(count(*) FILTER (WHERE rank <= 8), 0) AS first_screen_floor_rate
  FROM starter_ranks GROUP BY question_id, starter_rank
)
SELECT *, max_above_floor_views::numeric / nullif(min_above_floor_views, 0) AS exposure_ratio,
  total_views >= 50 AND unseen_above_floor = 0
    AND max_above_floor_views <= 3 * min_above_floor_views AS exposure_target_met
FROM per_question ORDER BY starter_rank;

-- Snapshot export: one row per take, without comment text or viewer identities.
SELECT now() AS snapshot_at, q.id AS question_id, r.id AS comment_id, r.views, r.likes,
  r.replies, r.round, r.quality, r.below_floor, r.rank
FROM public.questions q
CROSS JOIN LATERAL public.get_question_take_ranking(q.id, '9ce7ff91-d7f8-4397-b00d-8716e335aaee') r
WHERE q.starter_rank IS NOT NULL AND q.removed IS NOT TRUE AND q.flagged IS NOT TRUE
ORDER BY q.starter_rank, r.rank;
