-- Replace NULL with the actual Ranked activation timestamp, not the code release date.
-- An unset activation timestamp intentionally produces no comparison.
WITH config AS (SELECT NULL::timestamptz AS ranked_enabled_at), starters AS (
  SELECT id FROM public.questions WHERE starter_rank IS NOT NULL
    AND removed IS NOT TRUE AND flagged IS NOT TRUE
)
SELECT c.parent_id AS question_id,
  CASE WHEN c.created_at < config.ranked_enabled_at THEN 'before' ELSE 'after' END AS period,
  count(*) AS takes,
  percentile_cont(0.5) WITHIN GROUP (ORDER BY length(btrim(c.comment))) AS median_characters
FROM public.comments c JOIN starters s ON s.id = c.parent_id CROSS JOIN config
WHERE c.parent_type = 'question' AND c.removed = false AND config.ranked_enabled_at IS NOT NULL
  AND c.created_at >= config.ranked_enabled_at - interval '2 weeks'
  AND c.created_at < config.ranked_enabled_at + interval '2 weeks'
GROUP BY c.parent_id, period ORDER BY c.parent_id, period;
