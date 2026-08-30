-- supabase/migrations/20260812235500_reply_notification_outbox.sql
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
    CHECK (status IN ('pending', 'processing', 'sent', 'failed', 'suppressed', 'cancelled')),
  attempt_count INTEGER NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  available_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  claimed_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
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
      'configuration',
      'unknown'
    )
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT reply_notification_outbox_source_uidx
    UNIQUE (subscription_id, reply_comment_id)
);

CREATE INDEX IF NOT EXISTS reply_notification_outbox_ready_idx
  ON public.reply_notification_outbox (available_at, id)
  WHERE status IN ('pending', 'failed');

CREATE INDEX IF NOT EXISTS reply_notification_outbox_reply_idx
  ON public.reply_notification_outbox (reply_comment_id);

ALTER TABLE public.reply_notification_outbox ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.reply_notification_outbox FROM anon, authenticated;
REVOKE ALL ON SEQUENCE public.reply_notification_outbox_id_seq FROM anon, authenticated;

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
    AND status IN ('pending', 'failed');

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
