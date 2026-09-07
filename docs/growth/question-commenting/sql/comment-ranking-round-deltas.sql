-- Paste two saved weekly snapshot arrays into the JSON literals below.
-- Empty arrays return no data; no persistent table or viewer ledger is needed.
WITH previous AS (
  SELECT * FROM jsonb_to_recordset('[]'::jsonb)
    AS x(question_id bigint, comment_id bigint, views integer, likes integer, round bigint)
), current AS (
  SELECT * FROM jsonb_to_recordset('[]'::jsonb)
    AS x(question_id bigint, comment_id bigint, views integer, likes integer, round bigint)
), changes AS (
  SELECT c.question_id, coalesce(p.round, 0) AS starting_round,
    c.views - coalesce(p.views, 0) AS views, c.likes - coalesce(p.likes, 0) AS likes
  FROM current c LEFT JOIN previous p USING(question_id, comment_id)
  -- Reset intervals cannot be interpreted as reading. Exclude them.
  WHERE c.views >= coalesce(p.views, 0)
)
SELECT question_id, CASE WHEN starting_round = 0 THEN 'first turn' ELSE 'later turn' END AS cohort,
  sum(views) AS added_views, sum(likes) AS net_added_likes,
  sum(likes)::numeric / nullif(sum(views), 0) AS net_likes_per_view
FROM changes GROUP BY question_id, cohort ORDER BY question_id, cohort;
