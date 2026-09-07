-- Views are blind atomic increments; no viewer ledger or per-read view aggregation.
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS view_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.host_reply_drafts ADD COLUMN IF NOT EXISTS low_effort BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.host_reply_drafts ADD COLUMN IF NOT EXISTS take_rank_at_post INTEGER;

-- Retain the host desk's classification independently of future text edits.
UPDATE public.host_reply_drafts d SET low_effort = true
FROM public.comments c WHERE c.id = d.comment_id AND (
  length(btrim(coalesce(c.comment, ''))) < 3 OR c.comment !~ '[[:alnum:]]' OR
  (btrim(c.comment) !~ '[[:space:]]' AND length(btrim(c.comment)) <= 12)
);

-- Private, service-only projection. Never return fingerprints, IPs, or draft text to readers.
CREATE OR REPLACE FUNCTION public.get_question_take_data(
  p_question_id BIGINT, p_viewer_id UUID DEFAULT NULL, p_fingerprint TEXT DEFAULT NULL,
  p_host_user_id UUID DEFAULT NULL, p_limit INTEGER DEFAULT 100,
  p_before TIMESTAMPTZ DEFAULT NULL, p_before_id BIGINT DEFAULT NULL
) RETURNS JSONB LANGUAGE sql STABLE SECURITY INVOKER SET search_path = '' AS $$
  WITH live AS MATERIALIZED (
    SELECT c.*, coalesce((p_viewer_id IS NOT NULL AND c.author_id = p_viewer_id) OR
      (nullif(p_fingerprint, '') IS NOT NULL AND c.fingerprint = p_fingerprint), false) AS is_own
    FROM public.comments c WHERE c.parent_type = 'question' AND c.parent_id = p_question_id
      AND c.removed = false
  ), page AS (
    SELECT id FROM live WHERE p_before IS NULL OR (created_at, id) < (p_before, p_before_id)
    ORDER BY created_at DESC, id DESC LIMIT greatest(1, least(p_limit, 100))
  ), projected AS MATERIALIZED (
    SELECT c.id, c.created_at, c.is_own, jsonb_build_object(
      'id', c.id, 'comment', c.comment, 'author_id', c.author_id,
      'parent_id', c.parent_id, 'parent_type', c.parent_type, 'created_at', c.created_at,
      'modified_at', c.modified_at, 'comment_count', coalesce(c.comment_count, 0),
      'like_count', coalesce(c.like_count, 0), 'view_count', c.view_count, 'is_own', c.is_own,
      'ranking_low_effort', coalesce(d.low_effort, false) AND d.status <> 'posted' AND NOT EXISTS (
        SELECT 1 FROM public.comments reply WHERE reply.parent_type = 'comment' AND reply.parent_id = c.id
          AND reply.author_id = p_host_user_id AND reply.removed = false
      ),
      'profiles', (SELECT jsonb_build_object('external_id', p.external_id, 'enneagram', p.enneagram)
        FROM public.profiles p WHERE p.id = c.author_id),
      'comment_like', coalesce((SELECT jsonb_agg(jsonb_build_object('id', l.id, 'comment_id', l.comment_id, 'user_id', l.user_id))
        FROM public.comment_like l WHERE l.comment_id = c.id), '[]'::jsonb)
    ) AS take
    FROM live c LEFT JOIN public.host_reply_drafts d ON d.comment_id = c.id
    WHERE c.id IN (SELECT id FROM page) OR (p_before IS NULL AND c.is_own)
  ) SELECT jsonb_build_object(
    'takes', coalesce((SELECT jsonb_agg(take ORDER BY created_at DESC, id DESC) FROM projected WHERE id IN (SELECT id FROM page)), '[]'::jsonb),
    'own_takes', coalesce((SELECT jsonb_agg(take ORDER BY created_at DESC, id DESC) FROM projected WHERE is_own), '[]'::jsonb),
    'total_count', (SELECT count(*) FROM live)
  );
$$;
REVOKE ALL ON FUNCTION public.get_question_take_data(BIGINT, UUID, TEXT, UUID, INTEGER, TIMESTAMPTZ, BIGINT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_question_take_data(BIGINT, UUID, TEXT, UUID, INTEGER, TIMESTAMPTZ, BIGINT) TO service_role;

-- Validation and increments share one statement, including own-take and gate checks.
CREATE OR REPLACE FUNCTION public.increment_comment_views(
  p_question_id BIGINT, p_comment_ids BIGINT[], p_viewer_id UUID DEFAULT NULL, p_fingerprint TEXT DEFAULT NULL
) RETURNS INTEGER LANGUAGE sql VOLATILE SECURITY INVOKER SET search_path = '' AS $$
  WITH updated AS (
    UPDATE public.comments c SET view_count = c.view_count + 1
    WHERE cardinality(p_comment_ids) BETWEEN 1 AND 40
      AND c.id = ANY(p_comment_ids) AND c.parent_type = 'question'
      AND c.parent_id = p_question_id AND c.removed = false
      AND (p_viewer_id IS NOT NULL OR nullif(p_fingerprint, '') IS NOT NULL)
      AND (p_viewer_id IS NULL OR c.author_id IS DISTINCT FROM p_viewer_id)
      AND (nullif(p_fingerprint, '') IS NULL OR c.fingerprint IS DISTINCT FROM p_fingerprint)
      AND EXISTS (SELECT 1 FROM public.questions q WHERE q.id = p_question_id AND q.removed IS NOT TRUE AND q.flagged IS NOT TRUE)
      AND EXISTS (SELECT 1 FROM public.comments own WHERE own.parent_type = 'question'
        AND own.parent_id = p_question_id AND (
          (p_viewer_id IS NOT NULL AND own.author_id = p_viewer_id) OR
          (nullif(p_fingerprint, '') IS NOT NULL AND own.fingerprint = p_fingerprint)))
    RETURNING c.id
  ) SELECT count(*)::integer FROM updated;
$$;
REVOKE ALL ON FUNCTION public.increment_comment_views(BIGINT, BIGINT[], UUID, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_comment_views(BIGINT, BIGINT[], UUID, TEXT) TO service_role;

-- Shared SQL readout for weekly reports and a historical rank when DJ posts a reply.
-- Mirrors commentRanking.ts; browser rendering never calls this function.
CREATE OR REPLACE FUNCTION public.get_question_take_ranking(p_question_id BIGINT, p_host_user_id UUID)
RETURNS TABLE(id BIGINT, views INTEGER, likes INTEGER, replies INTEGER, round BIGINT,
  quality NUMERIC, below_floor BOOLEAN, rank BIGINT)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = '' AS $$
  WITH metrics AS (
    SELECT c.id, c.created_at, c.view_count AS views, coalesce(c.like_count, 0)::integer AS likes,
      coalesce(c.comment_count, 0)::integer AS replies,
      (c.view_count::bigint + 3 * coalesce(c.like_count, 0)::bigint) / 5 AS round,
      (CASE WHEN c.id = ANY(q.pinned_comment_ids) THEN 1 ELSE 0 END) +
        (coalesce(c.like_count, 0) + 1)::numeric / (c.view_count::numeric + 6) +
        least(coalesce(c.comment_count, 0), 3) * 0.05 AS quality,
      NOT coalesce(c.id = ANY(q.pinned_comment_ids), false) AND (
        length(btrim(coalesce(c.comment, ''))) < 3 OR c.comment !~ '[[:alnum:]]' OR
        (btrim(c.comment) !~ '[[:space:]]' AND length(btrim(c.comment)) <= 12) OR
        (coalesce(d.low_effort, false) AND d.status <> 'posted' AND NOT EXISTS (
          SELECT 1 FROM public.comments r WHERE r.parent_type = 'comment' AND r.parent_id = c.id
            AND r.author_id = p_host_user_id AND r.removed = false
        ))
      ) AS below_floor,
      array_position(q.pinned_comment_ids, c.id) AS boost_order, count(*) OVER () AS total
    FROM public.comments c JOIN public.questions q ON q.id = c.parent_id
    LEFT JOIN public.host_reply_drafts d ON d.comment_id = c.id
    WHERE c.parent_type = 'question' AND c.parent_id = p_question_id AND c.removed = false
  ) SELECT id, views, likes, replies, round, quality, below_floor,
    row_number() OVER (ORDER BY
      CASE WHEN total <= 9 THEN boost_order END ASC NULLS LAST,
      CASE WHEN total <= 9 THEN likes END DESC,
      CASE WHEN total <= 9 THEN created_at END DESC,
      CASE WHEN total > 9 THEN below_floor END ASC,
      CASE WHEN total > 9 THEN round END ASC,
      CASE WHEN total > 9 THEN quality END DESC,
      CASE WHEN total > 9 THEN created_at END ASC,
      CASE WHEN total <= 9 THEN id END DESC, id ASC)
    FROM metrics;
$$;
REVOKE ALL ON FUNCTION public.get_question_take_ranking(BIGINT, UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_question_take_ranking(BIGINT, UUID) TO service_role;

-- Hook every posting path (admin and signed digest link), inside the existing post transaction.
CREATE OR REPLACE FUNCTION public.capture_host_reply_take_rank()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE v_host UUID;
BEGIN
  IF NEW.status = 'posted' AND OLD.status IS DISTINCT FROM 'posted' THEN
    SELECT author_id INTO v_host FROM public.comments WHERE id = NEW.posted_comment_id;
    SELECT r.rank INTO NEW.take_rank_at_post
    FROM public.get_question_take_ranking(NEW.question_id, v_host) r WHERE r.id = NEW.comment_id;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.capture_host_reply_take_rank() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.capture_host_reply_take_rank() TO service_role;
DROP TRIGGER IF EXISTS capture_host_reply_take_rank ON public.host_reply_drafts;
CREATE TRIGGER capture_host_reply_take_rank BEFORE UPDATE OF status ON public.host_reply_drafts
  FOR EACH ROW EXECUTE FUNCTION public.capture_host_reply_take_rank();

-- The only new ledger is the required admin reset audit; it is not an impression ledger.
CREATE TABLE IF NOT EXISTS public.comment_view_reset_audit (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  question_id BIGINT NOT NULL, actor_id UUID NOT NULL,
  reset_take_count INTEGER NOT NULL, previous_view_count BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.comment_view_reset_audit ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.comment_view_reset_audit FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT ON public.comment_view_reset_audit TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.comment_view_reset_audit_id_seq TO service_role;

CREATE OR REPLACE FUNCTION public.reset_question_comment_views(p_question_id BIGINT, p_actor_id UUID)
RETURNS INTEGER LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE v_count INTEGER; v_views BIGINT;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_actor_id AND admin = true) THEN
    RAISE EXCEPTION 'Admin required' USING ERRCODE = '42501';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.questions WHERE id = p_question_id) THEN
    RAISE EXCEPTION 'Question not found' USING ERRCODE = 'P0002';
  END IF;
  WITH locked AS MATERIALIZED (
    SELECT id, view_count FROM public.comments
    WHERE parent_type = 'question' AND parent_id = p_question_id FOR UPDATE
  ), updated AS (
    UPDATE public.comments c SET view_count = 0 FROM locked l WHERE c.id = l.id RETURNING l.view_count
  ) SELECT count(*), coalesce(sum(view_count), 0) INTO v_count, v_views FROM updated;
  INSERT INTO public.comment_view_reset_audit(question_id, actor_id, reset_take_count, previous_view_count)
  VALUES (p_question_id, p_actor_id, v_count, v_views);
  RETURN v_count;
END;
$$;
REVOKE ALL ON FUNCTION public.reset_question_comment_views(BIGINT, UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reset_question_comment_views(BIGINT, UUID) TO service_role;
