-- Purpose-specific, privacy-preserving reply subscriptions for anonymous
-- first commenters. Public clients can write only through the validated RPC;
-- direct reads and writes remain closed by RLS.

CREATE TABLE IF NOT EXISTS public.comment_reply_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  comment_id INTEGER NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  fingerprint TEXT NOT NULL,
  normalized_email TEXT NOT NULL,
  consent_source TEXT NOT NULL DEFAULT 'question_post_comment_inline',
  consent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  management_token UUID NOT NULL DEFAULT gen_random_uuid(),
  unsubscribed_at TIMESTAMPTZ,
  last_notification_at TIMESTAMPTZ,
  notification_count INTEGER NOT NULL DEFAULT 0 CHECK (notification_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT comment_reply_subscriptions_email_normalized
    CHECK (normalized_email = public.normalize_email_text(normalized_email)),
  CONSTRAINT comment_reply_subscriptions_consent_source
    CHECK (consent_source = 'question_post_comment_inline')
);

CREATE UNIQUE INDEX IF NOT EXISTS comment_reply_subscriptions_active_comment_email_uidx
  ON public.comment_reply_subscriptions (comment_id, normalized_email)
  WHERE unsubscribed_at IS NULL;

CREATE INDEX IF NOT EXISTS comment_reply_subscriptions_question_idx
  ON public.comment_reply_subscriptions (question_id, created_at DESC);

CREATE INDEX IF NOT EXISTS comment_reply_subscriptions_fingerprint_idx
  ON public.comment_reply_subscriptions (fingerprint, created_at DESC);

ALTER TABLE public.comment_reply_subscriptions ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.comment_reply_subscriptions FROM anon, authenticated;
REVOKE ALL ON SEQUENCE public.comment_reply_subscriptions_id_seq FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.create_comment_reply_subscription(
  p_comment_id INTEGER,
  p_question_id INTEGER,
  p_fingerprint TEXT,
  p_email TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_email TEXT := public.normalize_email_text(p_email);
  v_fingerprint TEXT := NULLIF(BTRIM(p_fingerprint), '');
  v_subscription_id BIGINT;
BEGIN
  IF v_email IS NULL OR v_email !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' THEN
    RETURN jsonb_build_object('status', 'invalid');
  END IF;

  IF v_fingerprint IS NULL OR LENGTH(v_fingerprint) > 100 THEN
    RETURN jsonb_build_object('status', 'ineligible');
  END IF;

  -- Serialize opt-in attempts for one anonymous actor. This closes the small
  -- race between the eligibility/existing checks and the insert, making a
  -- rapid duplicate submit idempotent without exposing a database error.
  PERFORM pg_advisory_xact_lock(hashtext('comment-reply-opt-in:' || v_fingerprint));

  IF EXISTS (
    SELECT 1
    FROM public.email_unsubscribes unsubscribe
    WHERE public.normalize_email_text(unsubscribe.email) = v_email
  ) OR EXISTS (
    SELECT 1
    FROM public.signups signup
    WHERE signup.unsubscribed_date IS NOT NULL
      AND public.normalize_email_text(signup.email) = v_email
  ) THEN
    RETURN jsonb_build_object('status', 'suppressed');
  END IF;

  -- Bind consent to the exact anonymous top-level comment just created. The
  -- actor must still have exactly one comment, preventing forged/replayed
  -- requests from turning later contributions into first-comment consent.
  IF NOT EXISTS (
    SELECT 1
    FROM public.comments comment
    WHERE comment.id = p_comment_id
      AND comment.parent_type = 'question'
      AND comment.parent_id = p_question_id
      AND comment.author_id IS NULL
      AND comment.fingerprint = v_fingerprint
      AND comment.removed IS NOT TRUE
  ) OR EXISTS (
    SELECT 1
    FROM public.comments prior_comment
    WHERE prior_comment.fingerprint = v_fingerprint
      AND prior_comment.id <> p_comment_id
  ) THEN
    RETURN jsonb_build_object('status', 'ineligible');
  END IF;

  SELECT subscription.id
  INTO v_subscription_id
  FROM public.comment_reply_subscriptions subscription
  WHERE subscription.unsubscribed_at IS NULL
    AND (
      subscription.comment_id = p_comment_id
      OR subscription.fingerprint = v_fingerprint
    )
  ORDER BY subscription.created_at ASC
  LIMIT 1;

  IF v_subscription_id IS NOT NULL THEN
    RETURN jsonb_build_object('status', 'already_subscribed');
  END IF;

  INSERT INTO public.comment_reply_subscriptions (
    comment_id,
    question_id,
    fingerprint,
    normalized_email,
    consent_source
  ) VALUES (
    p_comment_id,
    p_question_id,
    v_fingerprint,
    v_email,
    'question_post_comment_inline'
  );

  RETURN jsonb_build_object('status', 'subscribed');
END;
$$;

REVOKE ALL ON FUNCTION public.create_comment_reply_subscription(INTEGER, INTEGER, TEXT, TEXT)
  FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_comment_reply_subscription(INTEGER, INTEGER, TEXT, TEXT)
  TO anon, authenticated;
