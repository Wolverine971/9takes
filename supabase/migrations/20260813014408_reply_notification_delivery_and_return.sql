-- supabase/migrations/20260813014408_reply_notification_delivery_and_return.sql
-- Forward-only upgrade for the reply notification worker and return experience.
-- The base outbox migration was already applied before delivery was implemented,
-- so all schema changes below explicitly upgrade that recorded version.

ALTER TABLE public.reply_notification_outbox
  ADD COLUMN IF NOT EXISTS return_token UUID;

UPDATE public.reply_notification_outbox
SET return_token = gen_random_uuid()
WHERE return_token IS NULL;

ALTER TABLE public.reply_notification_outbox
  ALTER COLUMN return_token SET DEFAULT gen_random_uuid(),
  ALTER COLUMN return_token SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS reply_notification_outbox_return_token_uidx
  ON public.reply_notification_outbox (return_token);

ALTER TABLE public.reply_notification_outbox
  DROP CONSTRAINT IF EXISTS reply_notification_outbox_status_check;

ALTER TABLE public.reply_notification_outbox
  ADD CONSTRAINT reply_notification_outbox_status_check
  CHECK (
    status IN (
      'pending',
      'processing',
      'retry',
      'sent',
      'failed',
      'ambiguous',
      'suppressed',
      'cancelled'
    )
  );

ALTER TABLE public.reply_notification_outbox
  DROP CONSTRAINT IF EXISTS reply_notification_outbox_error_category_check;

ALTER TABLE public.reply_notification_outbox
  ADD CONSTRAINT reply_notification_outbox_error_category_check
  CHECK (
    error_category IS NULL OR error_category IN (
      'suppressed',
      'removed',
      'self_reply',
      'provider_rejected',
      'provider_rate_limited',
      'provider_unavailable',
      'provider_ambiguous',
      'configuration',
      'persistence',
      'unknown'
    )
  );

DROP INDEX IF EXISTS public.reply_notification_outbox_ready_idx;
CREATE INDEX reply_notification_outbox_ready_idx
  ON public.reply_notification_outbox (available_at, id)
  WHERE status IN ('pending', 'retry');

-- Durable, privacy-preserving outbox for the first version of anonymous
-- direct-reply email notifications. The trigger only queues work; network
-- delivery remains outside the comment transaction.

CREATE TABLE IF NOT EXISTS public.reply_notification_outbox (
  id BIGSERIAL PRIMARY KEY,
  subscription_id BIGINT NOT NULL
    REFERENCES public.comment_reply_subscriptions(id) ON DELETE CASCADE,
  reply_comment_id INTEGER NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (
      status IN (
        'pending',
        'processing',
        'retry',
        'sent',
        'failed',
        'ambiguous',
        'suppressed',
        'cancelled'
      )
    ),
  attempt_count INTEGER NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  available_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  claimed_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  return_token UUID NOT NULL DEFAULT gen_random_uuid(),
  provider_message_id TEXT,
  email_send_id UUID REFERENCES public.email_sends(id) ON DELETE SET NULL,
  error_category TEXT CHECK (
    error_category IS NULL OR error_category IN (
      'suppressed',
      'removed',
      'self_reply',
      'provider_rejected',
      'provider_rate_limited',
      'provider_unavailable',
      'provider_ambiguous',
      'configuration',
      'persistence',
      'unknown'
    )
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT reply_notification_outbox_source_uidx
    UNIQUE (subscription_id, reply_comment_id),
  CONSTRAINT reply_notification_outbox_return_token_uidx UNIQUE (return_token)
);

CREATE INDEX IF NOT EXISTS reply_notification_outbox_ready_idx
  ON public.reply_notification_outbox (available_at, id)
  WHERE status IN ('pending', 'retry');

CREATE INDEX IF NOT EXISTS reply_notification_outbox_reply_idx
  ON public.reply_notification_outbox (reply_comment_id);

ALTER TABLE public.reply_notification_outbox ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.reply_notification_outbox FROM anon, authenticated;
REVOKE ALL ON SEQUENCE public.reply_notification_outbox_id_seq FROM anon, authenticated;

-- The shared tracking table's source vocabulary predates reply subscriptions.
-- Keep one tracking row per notification while making its purpose explicit.
ALTER TABLE public.email_sends
  DROP CONSTRAINT IF EXISTS email_sends_recipient_source_check;

ALTER TABLE public.email_sends
  ADD CONSTRAINT email_sends_recipient_source_check
  CHECK (
    recipient_source IN (
      'profiles',
      'signups',
      'coaching_waitlist',
      'comment_reply_subscription'
    )
  );

CREATE OR REPLACE FUNCTION public.enqueue_anonymous_reply_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_subscription public.comment_reply_subscriptions%ROWTYPE;
  v_parent_author_id UUID;
BEGIN
  IF NEW.parent_type <> 'comment' OR NEW.removed IS TRUE THEN
    RETURN NEW;
  END IF;

  SELECT parent_comment.author_id
  INTO v_parent_author_id
  FROM public.comments parent_comment
  WHERE parent_comment.id = NEW.parent_id
    AND parent_comment.removed IS NOT TRUE;

  FOR v_subscription IN
    SELECT subscription.*
    FROM public.comment_reply_subscriptions subscription
    WHERE subscription.comment_id = NEW.parent_id
      AND subscription.unsubscribed_at IS NULL
  LOOP
    -- Do not notify the original actor if their anonymous journey can be
    -- reconciled through the current fingerprint, claimed comment, or profile.
    IF (
      NULLIF(BTRIM(COALESCE(NEW.fingerprint, '')), '') = v_subscription.fingerprint
      OR (
        NEW.author_id IS NOT NULL
        AND (
          NEW.author_id IS NOT DISTINCT FROM v_parent_author_id
          OR EXISTS (
            SELECT 1
            FROM public.profiles profile
            WHERE profile.id = NEW.author_id
              AND profile.first_touch_fingerprint = v_subscription.fingerprint
          )
        )
      )
    ) THEN
      CONTINUE;
    END IF;

    -- Recheck global suppression at queue time. The delivery worker must check
    -- again immediately before sending.
    IF EXISTS (
      SELECT 1
      FROM public.email_unsubscribes unsubscribe
      WHERE public.normalize_email_text(unsubscribe.email) = v_subscription.normalized_email
    ) OR EXISTS (
      SELECT 1
      FROM public.signups signup
      WHERE signup.unsubscribed_date IS NOT NULL
        AND public.normalize_email_text(signup.email) = v_subscription.normalized_email
    ) THEN
      CONTINUE;
    END IF;

    INSERT INTO public.reply_notification_outbox (
      subscription_id,
      reply_comment_id,
      question_id
    ) VALUES (
      v_subscription.id,
      NEW.id,
      v_subscription.question_id
    )
    ON CONFLICT (subscription_id, reply_comment_id) DO NOTHING;
  END LOOP;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Email queueing must never make an otherwise valid reply fail.
    RAISE WARNING 'Failed to queue anonymous reply notification for comment %: %', NEW.id, SQLSTATE;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enqueue_anonymous_reply_notification ON public.comments;
CREATE TRIGGER trg_enqueue_anonymous_reply_notification
  AFTER INSERT ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.enqueue_anonymous_reply_notification();

CREATE OR REPLACE FUNCTION public.cancel_anonymous_reply_notification_on_removal()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.reply_notification_outbox
  SET
    status = 'cancelled',
    error_category = 'removed',
    updated_at = NOW()
  WHERE reply_comment_id = NEW.id
    AND status IN ('pending', 'retry', 'processing');

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_cancel_anonymous_reply_notification_on_removal ON public.comments;
CREATE TRIGGER trg_cancel_anonymous_reply_notification_on_removal
  AFTER UPDATE OF removed ON public.comments
  FOR EACH ROW
  WHEN (NEW.removed IS TRUE AND OLD.removed IS DISTINCT FROM NEW.removed)
  EXECUTE FUNCTION public.cancel_anonymous_reply_notification_on_removal();

REVOKE ALL ON FUNCTION public.enqueue_anonymous_reply_notification() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.cancel_anonymous_reply_notification_on_removal() FROM PUBLIC;

-- Claim ready work with SKIP LOCKED so overlapping cron invocations cannot
-- process the same notification. Private recipient and management fields are
-- returned only to the service role.
CREATE OR REPLACE FUNCTION public.claim_reply_notification_outbox(p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  outbox_id BIGINT,
  subscription_id BIGINT,
  comment_id INTEGER,
  reply_comment_id INTEGER,
  question_id INTEGER,
  question_url TEXT,
  recipient_email TEXT,
  management_token UUID,
  return_token UUID,
  attempt_count INTEGER,
  email_send_id UUID,
  tracking_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_outbox public.reply_notification_outbox%ROWTYPE;
  v_subscription public.comment_reply_subscriptions%ROWTYPE;
BEGIN
  -- Gmail does not provide an idempotency key for sends. If a worker dies
  -- while a row is in flight, it is safer to quarantine that row for manual
  -- review than to retry and possibly send the same notification twice.
  UPDATE public.reply_notification_outbox
  SET
    status = 'ambiguous',
    error_category = 'provider_ambiguous',
    updated_at = NOW()
  WHERE status = 'processing'
    AND claimed_at < NOW() - INTERVAL '30 minutes';

  FOR v_outbox IN
    SELECT candidate.*
    FROM public.reply_notification_outbox candidate
    WHERE candidate.status IN ('pending', 'retry')
      AND candidate.available_at <= NOW()
      AND candidate.attempt_count < 3
    ORDER BY candidate.available_at ASC, candidate.id ASC
    FOR UPDATE OF candidate SKIP LOCKED
    LIMIT LEAST(GREATEST(COALESCE(p_limit, 10), 1), 50)
  LOOP
    SELECT subscription.*
    INTO v_subscription
    FROM public.comment_reply_subscriptions subscription
    WHERE subscription.id = v_outbox.subscription_id;

    IF NOT FOUND OR v_subscription.unsubscribed_at IS NOT NULL THEN
      UPDATE public.reply_notification_outbox
      SET status = 'cancelled', updated_at = NOW()
      WHERE id = v_outbox.id;
      CONTINUE;
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM public.comments reply
      WHERE reply.id = v_outbox.reply_comment_id
        AND reply.parent_type = 'comment'
        AND reply.parent_id = v_subscription.comment_id
        AND reply.removed IS NOT TRUE
    ) THEN
      UPDATE public.reply_notification_outbox
      SET status = 'cancelled', error_category = 'removed', updated_at = NOW()
      WHERE id = v_outbox.id;
      CONTINUE;
    END IF;

    IF EXISTS (
      SELECT 1
      FROM public.email_unsubscribes unsubscribe
      WHERE public.normalize_email_text(unsubscribe.email) = v_subscription.normalized_email
    ) OR EXISTS (
      SELECT 1
      FROM public.signups signup
      WHERE signup.unsubscribed_date IS NOT NULL
        AND public.normalize_email_text(signup.email) = v_subscription.normalized_email
    ) THEN
      UPDATE public.reply_notification_outbox
      SET status = 'suppressed', error_category = 'suppressed', updated_at = NOW()
      WHERE id = v_outbox.id;
      CONTINUE;
    END IF;

    UPDATE public.reply_notification_outbox AS claimed
    SET
      status = 'processing',
      attempt_count = claimed.attempt_count + 1,
      claimed_at = NOW(),
      error_category = NULL,
      updated_at = NOW()
    WHERE id = v_outbox.id;

    RETURN QUERY
    SELECT
      v_outbox.id,
      v_subscription.id,
      v_subscription.comment_id,
      v_outbox.reply_comment_id,
      v_outbox.question_id,
      question.url,
      v_subscription.normalized_email,
      v_subscription.management_token,
      v_outbox.return_token,
      v_outbox.attempt_count + 1,
      v_outbox.email_send_id,
      email_send.tracking_id
    FROM public.questions question
    LEFT JOIN public.email_sends email_send ON email_send.id = v_outbox.email_send_id
    WHERE question.id = v_outbox.question_id;
  END LOOP;
END;
$$;

-- Create and attach the shared tracking record in the same transaction. The
-- caller supplies already-redacted content; recipient and source IDs are
-- derived from the private subscription row rather than trusted input.
CREATE OR REPLACE FUNCTION public.create_reply_notification_tracking(
  p_outbox_id BIGINT,
  p_subject TEXT,
  p_html_content TEXT,
  p_plain_text_content TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_outbox public.reply_notification_outbox%ROWTYPE;
  v_subscription public.comment_reply_subscriptions%ROWTYPE;
  v_email_send public.email_sends%ROWTYPE;
BEGIN
  SELECT * INTO v_outbox
  FROM public.reply_notification_outbox
  WHERE id = p_outbox_id
  FOR UPDATE;

  IF NOT FOUND OR v_outbox.status <> 'processing' THEN
    RETURN jsonb_build_object('status', 'cancelled');
  END IF;

  IF v_outbox.email_send_id IS NOT NULL THEN
    SELECT * INTO v_email_send
    FROM public.email_sends
    WHERE id = v_outbox.email_send_id;

    IF FOUND THEN
      RETURN jsonb_build_object(
        'status', 'ready',
        'id', v_email_send.id,
        'tracking_id', v_email_send.tracking_id
      );
    END IF;
  END IF;

  SELECT * INTO v_subscription
  FROM public.comment_reply_subscriptions
  WHERE id = v_outbox.subscription_id;

  IF NOT FOUND OR v_subscription.unsubscribed_at IS NOT NULL THEN
    UPDATE public.reply_notification_outbox
    SET status = 'cancelled', updated_at = NOW()
    WHERE id = p_outbox_id;
    RETURN jsonb_build_object('status', 'cancelled');
  END IF;

  INSERT INTO public.email_sends (
    recipient_email,
    recipient_name,
    recipient_source,
    recipient_source_id,
    subject,
    html_content,
    plain_text_content,
    status
  ) VALUES (
    v_subscription.normalized_email,
    NULL,
    'comment_reply_subscription',
    v_outbox.id::TEXT,
    LEFT(COALESCE(p_subject, ''), 998),
    COALESCE(p_html_content, ''),
    COALESCE(p_plain_text_content, ''),
    'pending'
  )
  RETURNING * INTO v_email_send;

  UPDATE public.reply_notification_outbox
  SET email_send_id = v_email_send.id, updated_at = NOW()
  WHERE id = p_outbox_id;

  RETURN jsonb_build_object(
    'status', 'ready',
    'id', v_email_send.id,
    'tracking_id', v_email_send.tracking_id
  );
END;
$$;

-- Final pre-send gate. It repeats all consent and suppression checks after the
-- tracking row has been prepared and immediately before the provider call.
CREATE OR REPLACE FUNCTION public.prepare_reply_notification_delivery(p_outbox_id BIGINT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_outbox public.reply_notification_outbox%ROWTYPE;
  v_subscription public.comment_reply_subscriptions%ROWTYPE;
BEGIN
  SELECT * INTO v_outbox
  FROM public.reply_notification_outbox
  WHERE id = p_outbox_id
  FOR UPDATE;

  IF NOT FOUND OR v_outbox.status <> 'processing' THEN
    RETURN jsonb_build_object('status', 'cancelled');
  END IF;

  SELECT * INTO v_subscription
  FROM public.comment_reply_subscriptions
  WHERE id = v_outbox.subscription_id;

  IF NOT FOUND OR v_subscription.unsubscribed_at IS NOT NULL THEN
    UPDATE public.reply_notification_outbox
    SET status = 'cancelled', updated_at = NOW()
    WHERE id = p_outbox_id;
    RETURN jsonb_build_object('status', 'cancelled');
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.comments reply
    WHERE reply.id = v_outbox.reply_comment_id
      AND reply.parent_type = 'comment'
      AND reply.parent_id = v_subscription.comment_id
      AND reply.removed IS NOT TRUE
  ) THEN
    UPDATE public.reply_notification_outbox
    SET status = 'cancelled', error_category = 'removed', updated_at = NOW()
    WHERE id = p_outbox_id;
    RETURN jsonb_build_object('status', 'cancelled');
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.email_unsubscribes unsubscribe
    WHERE public.normalize_email_text(unsubscribe.email) = v_subscription.normalized_email
  ) OR EXISTS (
    SELECT 1
    FROM public.signups signup
    WHERE signup.unsubscribed_date IS NOT NULL
      AND public.normalize_email_text(signup.email) = v_subscription.normalized_email
  ) THEN
    UPDATE public.reply_notification_outbox
    SET status = 'suppressed', error_category = 'suppressed', updated_at = NOW()
    WHERE id = p_outbox_id;
    RETURN jsonb_build_object('status', 'suppressed');
  END IF;

  RETURN jsonb_build_object(
    'status', 'ready',
    'recipient_email', v_subscription.normalized_email,
    'management_token', v_subscription.management_token
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.complete_reply_notification_delivery(
  p_outbox_id BIGINT,
  p_email_send_id UUID,
  p_provider_message_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_subscription_id BIGINT;
BEGIN
  UPDATE public.reply_notification_outbox
  SET
    status = 'sent',
    email_send_id = p_email_send_id,
    provider_message_id = NULLIF(BTRIM(p_provider_message_id), ''),
    sent_at = NOW(),
    error_category = NULL,
    updated_at = NOW()
  WHERE id = p_outbox_id
  RETURNING subscription_id INTO v_subscription_id;

  IF v_subscription_id IS NULL THEN
    RETURN jsonb_build_object('status', 'missing');
  END IF;

  UPDATE public.comment_reply_subscriptions
  SET
    last_notification_at = NOW(),
    notification_count = notification_count + 1,
    updated_at = NOW()
  WHERE id = v_subscription_id;

  RETURN jsonb_build_object('status', 'sent');
END;
$$;

CREATE OR REPLACE FUNCTION public.fail_reply_notification_delivery(
  p_outbox_id BIGINT,
  p_email_send_id UUID,
  p_error_category TEXT,
  p_retry_safe BOOLEAN,
  p_provider_attempted BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_attempt_count INTEGER;
  v_next_status TEXT;
  v_category TEXT;
BEGIN
  v_category := CASE p_error_category
    WHEN 'provider_rejected' THEN p_error_category
    WHEN 'provider_rate_limited' THEN p_error_category
    WHEN 'provider_unavailable' THEN p_error_category
    WHEN 'provider_ambiguous' THEN p_error_category
    WHEN 'configuration' THEN p_error_category
    WHEN 'persistence' THEN p_error_category
    ELSE 'unknown'
  END;

  SELECT attempt_count INTO v_attempt_count
  FROM public.reply_notification_outbox
  WHERE id = p_outbox_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('status', 'missing');
  END IF;

  v_next_status := CASE
    WHEN p_retry_safe IS TRUE AND v_attempt_count < 3 THEN 'retry'
    WHEN p_provider_attempted IS TRUE
      AND v_category IN ('provider_unavailable', 'unknown') THEN 'ambiguous'
    ELSE 'failed'
  END;

  UPDATE public.reply_notification_outbox
  SET
    status = v_next_status,
    email_send_id = COALESCE(p_email_send_id, email_send_id),
    error_category = CASE
      WHEN v_next_status = 'ambiguous' THEN 'provider_ambiguous'
      ELSE v_category
    END,
    available_at = CASE
      WHEN v_next_status = 'retry'
        THEN NOW() + make_interval(secs => LEAST(POWER(2, v_attempt_count)::INTEGER * 60, 900))
      ELSE available_at
    END,
    updated_at = NOW()
  WHERE id = p_outbox_id;

  RETURN jsonb_build_object('status', v_next_status);
END;
$$;

-- Conversation-level stop. GET routes only render confirmation; POST calls
-- this function. It does not add a global email suppression.
CREATE OR REPLACE FUNCTION public.unsubscribe_comment_reply_subscription(p_management_token UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_subscription public.comment_reply_subscriptions%ROWTYPE;
  v_outbox_id BIGINT;
  v_status TEXT;
BEGIN
  SELECT * INTO v_subscription
  FROM public.comment_reply_subscriptions
  WHERE management_token = p_management_token
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('status', 'invalid');
  END IF;

  v_status := CASE
    WHEN v_subscription.unsubscribed_at IS NULL THEN 'unsubscribed'
    ELSE 'already_unsubscribed'
  END;

  UPDATE public.comment_reply_subscriptions
  SET unsubscribed_at = COALESCE(unsubscribed_at, NOW()), updated_at = NOW()
  WHERE id = v_subscription.id;

  UPDATE public.reply_notification_outbox
  SET status = 'cancelled', updated_at = NOW()
  WHERE subscription_id = v_subscription.id
    AND status IN ('pending', 'retry', 'processing');

  SELECT outbox.id INTO v_outbox_id
  FROM public.reply_notification_outbox outbox
  WHERE outbox.subscription_id = v_subscription.id
  ORDER BY outbox.created_at DESC, outbox.id DESC
  LIMIT 1;

  RETURN jsonb_build_object(
    'status', v_status,
    'subscription_id', v_subscription.id,
    'question_id', v_subscription.question_id,
    'comment_id', v_subscription.comment_id,
    'outbox_id', v_outbox_id
  );
END;
$$;

-- Safe context lookup for the click route. No recipient, fingerprint, or token
-- can leave this RPC.
CREATE OR REPLACE FUNCTION public.get_reply_notification_analytics_context(p_tracking_id UUID)
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT jsonb_build_object(
    'outbox_id', outbox.id,
    'subscription_id', outbox.subscription_id,
    'question_id', outbox.question_id,
    'comment_id', subscription.comment_id,
    'reply_comment_id', outbox.reply_comment_id
  )
  FROM public.email_sends email_send
  JOIN public.reply_notification_outbox outbox ON outbox.email_send_id = email_send.id
  JOIN public.comment_reply_subscriptions subscription ON subscription.id = outbox.subscription_id
  WHERE email_send.tracking_id = p_tracking_id
    AND email_send.recipient_source = 'comment_reply_subscription'
  LIMIT 1;
$$;

-- Server-side handoff context for the clean notification-return route. It
-- exposes only public-thread IDs and bounded states; never recipient data,
-- fingerprints, or the conversation management token.
CREATE OR REPLACE FUNCTION public.get_reply_notification_return_context(p_return_token UUID)
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT jsonb_build_object(
    'outbox_id', outbox.id,
    'subscription_id', outbox.subscription_id,
    'question_id', outbox.question_id,
    'question_url', question.url,
    'comment_id', subscription.comment_id,
    'reply_comment_id', outbox.reply_comment_id,
    'target_status', CASE
      WHEN parent_comment.id IS NULL
        OR parent_comment.removed IS TRUE
        OR reply.id IS NULL
        OR reply.removed IS TRUE THEN 'removed'
      ELSE 'available'
    END,
    'subscription_status', CASE
      WHEN subscription.unsubscribed_at IS NULL THEN 'active'
      ELSE 'stopped'
    END
  )
  FROM public.reply_notification_outbox outbox
  JOIN public.comment_reply_subscriptions subscription ON subscription.id = outbox.subscription_id
  JOIN public.questions question ON question.id = outbox.question_id
  LEFT JOIN public.comments parent_comment
    ON parent_comment.id = subscription.comment_id
    AND parent_comment.parent_type = 'question'
    AND parent_comment.parent_id = outbox.question_id
  LEFT JOIN public.comments reply
    ON reply.id = outbox.reply_comment_id
    AND reply.parent_type = 'comment'
    AND reply.parent_id = subscription.comment_id
  WHERE outbox.return_token = p_return_token
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.claim_reply_notification_outbox(INTEGER) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.create_reply_notification_tracking(BIGINT, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.prepare_reply_notification_delivery(BIGINT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.complete_reply_notification_delivery(BIGINT, UUID, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fail_reply_notification_delivery(BIGINT, UUID, TEXT, BOOLEAN, BOOLEAN) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_reply_notification_outbox(INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION public.create_reply_notification_tracking(BIGINT, TEXT, TEXT, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.prepare_reply_notification_delivery(BIGINT) TO service_role;
GRANT EXECUTE ON FUNCTION public.complete_reply_notification_delivery(BIGINT, UUID, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.fail_reply_notification_delivery(BIGINT, UUID, TEXT, BOOLEAN, BOOLEAN) TO service_role;

REVOKE ALL ON FUNCTION public.unsubscribe_comment_reply_subscription(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.unsubscribe_comment_reply_subscription(UUID) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.get_reply_notification_analytics_context(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_reply_notification_analytics_context(UUID) TO anon, authenticated;

REVOKE ALL ON FUNCTION public.get_reply_notification_return_context(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_reply_notification_return_context(UUID) TO anon, authenticated;
