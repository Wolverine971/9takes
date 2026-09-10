-- docs/audits/question-purge-2026-09-10/verification.sql
-- Read-only audit; contains no cleanup or mutation commands.
BEGIN READ ONLY;
SET LOCAL statement_timeout = '20s';

SELECT count(*) AS total_questions,
 count(*) FILTER (WHERE removed IS TRUE) AS removed,
 count(*) FILTER (WHERE removed IS NOT TRUE AND flagged IS TRUE) AS flagged_not_removed,
 count(*) FILTER (WHERE removed IS NOT TRUE AND flagged IS NOT TRUE) AS visible
FROM public.questions;

-- Confirm the intended accounts; the last two are identity matches requiring
-- user confirmation, not automatic additions to the deletion identity set.
SELECT email, first_name, last_name
FROM public.profiles
WHERE lower(email) IN ('djwayne3@gmail.com','djwayne35@gmail.com',
 'mrwayner@protonmail.com','dj@build-os.com');

-- Traverse replies as well as direct answers. Anonymous comments remain
-- non-owner/unknown; only explicitly confirmed Gmail identities are grouped.
WITH RECURSIVE
owners AS (SELECT id FROM public.profiles WHERE lower(email) IN
 ('djwayne3@gmail.com','djwayne35@gmail.com')),
shortlist AS (SELECT * FROM public.questions WHERE id IN
 (86,132,144,154,165,166,172,173,158,568)),
thread AS (
 SELECT c.id,c.parent_id AS question_id,c.author_id,c.removed,c.created_at,
 true AS top_level,ARRAY[c.id] AS seen
 FROM public.comments c JOIN shortlist q ON q.id=c.parent_id
 WHERE c.parent_type='question'
 UNION ALL
 SELECT c.id,t.question_id,c.author_id,c.removed,c.created_at,
 false,t.seen||c.id
 FROM public.comments c JOIN thread t ON c.parent_id=t.id
 WHERE c.parent_type='comment' AND NOT c.id=ANY(t.seen)
)
SELECT q.id,COALESCE(q.question_formatted,q.question) AS question,
 q.removed,q.flagged,q.created_at,q.starter_rank,q.pinned_comment_ids,
 q.comment_count AS stored_answer_count,
 count(t.id) FILTER (WHERE NOT t.removed AND t.top_level) AS live_answers,
 count(t.id) FILTER (WHERE NOT t.removed AND NOT t.top_level) AS live_replies,
 count(t.id) FILTER (WHERE NOT t.removed AND
  (t.author_id IS NULL OR t.author_id NOT IN (SELECT id FROM owners)))
  AS non_gmail_or_anonymous_comments,
 count(t.id) FILTER (WHERE t.removed) AS removed_comments,
 max(t.created_at) FILTER (WHERE NOT t.removed) AS last_live_comment
FROM shortlist q LEFT JOIN thread t ON t.question_id=q.id
GROUP BY q.id,q.question_formatted,q.question,q.removed,q.flagged,q.created_at,
 q.starter_rank,q.pinned_comment_ids,q.comment_count
ORDER BY q.id;

-- Stored-versus-actual top-level counts, including only visible questions.
SELECT q.id,q.comment_count AS stored,count(c.id) AS actual
FROM public.questions q
LEFT JOIN public.comments c ON c.parent_type='question'
 AND c.parent_id=q.id AND c.removed=false
WHERE q.removed IS NOT TRUE AND q.flagged IS NOT TRUE
GROUP BY q.id,q.comment_count
HAVING q.comment_count <> count(c.id)
ORDER BY q.id;

-- Expected public subtree counts for the five-question scenario.
-- #144 remains conditional on account confirmation; this only simulates removal.
WITH RECURSIVE ancestry AS (
 SELECT id AS descendant_id,id AS ancestor_id FROM public.question_categories
 UNION ALL
 SELECT a.descendant_id,c.parent_id FROM ancestry a
 JOIN public.question_categories c ON c.id=a.ancestor_id
 WHERE c.parent_id IS NOT NULL
), live AS (
 SELECT DISTINCT t.question_id,t.tag_id FROM public.question_category_tags t
 JOIN public.questions q ON q.id=t.question_id
 WHERE q.removed IS FALSE AND q.flagged IS NOT TRUE
)
SELECT c.id,c.category_name,
 count(DISTINCT live.question_id) AS before,
 count(DISTINCT live.question_id) FILTER (WHERE live.question_id NOT IN
  (86,132,144,166,172)) AS after
FROM public.question_categories c
JOIN ancestry a ON a.ancestor_id=c.id
JOIN live ON live.tag_id=a.descendant_id
GROUP BY c.id,c.category_name
HAVING count(DISTINCT live.question_id) <> count(DISTINCT live.question_id)
 FILTER (WHERE live.question_id NOT IN (86,132,144,166,172))
ORDER BY c.id;

-- Confirm both live count triggers rather than relying on migration history.
SELECT tgname,pg_get_triggerdef(oid) AS definition
FROM pg_trigger WHERE NOT tgisinternal
 AND tgrelid='public.comments'::regclass
 AND tgname IN ('trg_update_question_comment_count','update_question_comment_count');

ROLLBACK;
