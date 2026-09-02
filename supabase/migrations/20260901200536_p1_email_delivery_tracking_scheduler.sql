-- supabase/migrations/20260901200536_p1_email_delivery_tracking_scheduler.sql
-- P1 email delivery, truthful engagement metrics, and atomic scheduling.

-- ---------------------------------------------------------------------------
-- Provider correlation and lifecycle state
-- ---------------------------------------------------------------------------

ALTER TABLE public.email_sends
  ADD COLUMN IF NOT EXISTS provider TEXT,
  ADD COLUMN IF NOT EXISTS provider_message_id TEXT,
  ADD COLUMN IF NOT EXISTS idempotency_key TEXT,
  ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS delivery_delayed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS complained_at TIMESTAMPTZ;

UPDATE public.email_sends
SET provider = 'gmail'
WHERE provider IS NULL
  AND status <> 'pending';

ALTER TABLE public.email_sends
  DROP CONSTRAINT IF EXISTS email_sends_status_check;
ALTER TABLE public.email_sends
  ADD CONSTRAINT email_sends_status_check
  CHECK (status IN (
    'pending', 'sent', 'delivered', 'delayed', 'bounced', 'complained', 'failed'
  ));

CREATE UNIQUE INDEX IF NOT EXISTS email_sends_provider_message_uidx
  ON public.email_sends(provider, provider_message_id)
  WHERE provider IS NOT NULL AND provider_message_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS email_sends_idempotency_key_uidx
  ON public.email_sends(idempotency_key)
  WHERE idempotency_key IS NOT NULL;

-- ---------------------------------------------------------------------------
-- Raw event retention and explicit classification
-- ---------------------------------------------------------------------------

ALTER TABLE public.email_tracking_events
  ADD COLUMN IF NOT EXISTS classification TEXT NOT NULL DEFAULT 'unknown',
  ADD COLUMN IF NOT EXISTS classification_reason TEXT,
  ADD COLUMN IF NOT EXISTS classifier_version TEXT NOT NULL DEFAULT 'email-event-v1',
  ADD COLUMN IF NOT EXISTS provider_event_id TEXT;

ALTER TABLE public.email_tracking_events
  DROP CONSTRAINT IF EXISTS email_tracking_events_classification_check;
ALTER TABLE public.email_tracking_events
  ADD CONSTRAINT email_tracking_events_classification_check
  CHECK (classification IN ('human', 'automated', 'unknown'));

CREATE INDEX IF NOT EXISTS email_tracking_events_classification_idx
  ON public.email_tracking_events(event_type, classification, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS email_tracking_events_provider_event_uidx
  ON public.email_tracking_events(provider_event_id)
  WHERE provider_event_id IS NOT NULL;

DROP FUNCTION IF EXISTS public.track_email_event(UUID, TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.track_email_event(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT);

CREATE FUNCTION public.track_email_event(
  p_tracking_id UUID,
  p_event_type TEXT,
  p_link_url TEXT DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_classification TEXT DEFAULT 'unknown',
  p_classification_reason TEXT DEFAULT NULL,
  p_classifier_version TEXT DEFAULT 'email-event-v1'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email_send_id UUID;
  v_event_id UUID;
  v_event_created_at TIMESTAMPTZ;
  v_event_count INTEGER;
  v_distinct_link_count INTEGER;
BEGIN
  IF p_tracking_id IS NULL OR p_event_type NOT IN ('open', 'click') THEN
    RETURN FALSE;
  END IF;

  IF p_classification NOT IN ('human', 'automated', 'unknown') THEN
    p_classification := 'unknown';
    p_classification_reason := 'invalid_classification_fallback';
  END IF;

  SELECT id INTO v_email_send_id
  FROM public.email_sends
  WHERE tracking_id = p_tracking_id
  LIMIT 1;

  IF v_email_send_id IS NULL THEN
    RETURN FALSE;
  END IF;

  IF p_event_type = 'click' THEN
    -- Serialize each request fingerprint so concurrent scanner requests see
    -- the complete burst before classification.
    PERFORM pg_advisory_xact_lock(hashtextextended(
      v_email_send_id::TEXT || '|' ||
      COALESCE(p_ip_address, '') || '|' ||
      COALESCE(p_user_agent, ''),
      0
    ));
  END IF;

  INSERT INTO public.email_tracking_events (
    email_send_id,
    event_type,
    link_url,
    ip_address,
    user_agent,
    classification,
    classification_reason,
    classifier_version
  ) VALUES (
    v_email_send_id,
    p_event_type,
    p_link_url,
    p_ip_address,
    p_user_agent,
    p_classification,
    p_classification_reason,
    COALESCE(NULLIF(BTRIM(p_classifier_version), ''), 'email-event-v1')
  )
  RETURNING id, created_at INTO v_event_id, v_event_created_at;

  IF p_event_type = 'open' THEN
    -- Opens are raw pixel loads. Retain their aggregate for directional use,
    -- while classification columns expose what is known about automation.
    UPDATE public.email_sends send
    SET opened_at = aggregate.first_opened_at,
        open_count = aggregate.open_count
    FROM (
      SELECT MIN(created_at) AS first_opened_at, COUNT(*)::INTEGER AS open_count
      FROM public.email_tracking_events
      WHERE email_send_id = v_email_send_id
        AND event_type = 'open'
    ) aggregate
    WHERE send.id = v_email_send_id;

    RETURN TRUE;
  END IF;

  -- Clean-UA security scanners are caught behaviorally. A three-distinct-link
  -- burst, or four repeated requests, from the same request fingerprint inside
  -- sixty seconds retroactively classifies the whole burst as automated.
  SELECT COUNT(*)::INTEGER, COUNT(DISTINCT COALESCE(link_url, ''))::INTEGER
    INTO v_event_count, v_distinct_link_count
  FROM public.email_tracking_events
  WHERE email_send_id = v_email_send_id
    AND event_type = 'click'
    AND COALESCE(ip_address, '') = COALESCE(p_ip_address, '')
    AND COALESCE(user_agent, '') = COALESCE(p_user_agent, '')
    AND created_at BETWEEN v_event_created_at - INTERVAL '60 seconds'
                       AND v_event_created_at + INTERVAL '60 seconds';

  IF v_distinct_link_count >= 3 OR v_event_count >= 4 THEN
    UPDATE public.email_tracking_events
    SET classification = 'automated',
        classification_reason = CASE
          WHEN v_distinct_link_count >= 3 THEN 'multi_link_burst'
          ELSE 'repeated_click_burst'
        END,
        classifier_version = 'email-event-v1'
    WHERE email_send_id = v_email_send_id
      AND event_type = 'click'
      AND COALESCE(ip_address, '') = COALESCE(p_ip_address, '')
      AND COALESCE(user_agent, '') = COALESCE(p_user_agent, '')
      AND created_at BETWEEN v_event_created_at - INTERVAL '60 seconds'
                         AND v_event_created_at + INTERVAL '60 seconds';
  END IF;

  -- clicked_at/click_count are intentionally qualified-human aggregates only.
  UPDATE public.email_sends send
  SET clicked_at = aggregate.first_clicked_at,
      click_count = aggregate.click_count
  FROM (
    SELECT
      MIN(created_at) FILTER (WHERE classification = 'human') AS first_clicked_at,
      COUNT(*) FILTER (WHERE classification = 'human')::INTEGER AS click_count
    FROM public.email_tracking_events
    WHERE email_send_id = v_email_send_id
      AND event_type = 'click'
  ) aggregate
  WHERE send.id = v_email_send_id;

  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.track_email_event(
  UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.track_email_event(
  UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) TO service_role;

CREATE OR REPLACE FUNCTION public.qualify_pending_email_clicks(
  p_min_age INTERVAL DEFAULT INTERVAL '2 minutes',
  p_limit INTEGER DEFAULT 500
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_send_ids UUID[];
  v_qualified_count INTEGER := 0;
  v_exited_count INTEGER := 0;
BEGIN
  WITH candidates AS (
    SELECT id
    FROM public.email_tracking_events
    WHERE event_type = 'click'
      AND classification = 'unknown'
      AND created_at <= NOW() - GREATEST(p_min_age, INTERVAL '1 minute')
    ORDER BY created_at
    LIMIT LEAST(GREATEST(COALESCE(p_limit, 500), 1), 5000)
    FOR UPDATE SKIP LOCKED
  ), qualified AS (
    UPDATE public.email_tracking_events event
    SET classification = 'human',
        classification_reason = 'no_automation_signal_after_holdback',
        classifier_version = 'email-event-v1'
    FROM candidates
    WHERE event.id = candidates.id
    RETURNING event.email_send_id
  )
  SELECT
    COALESCE(ARRAY_AGG(DISTINCT email_send_id), ARRAY[]::UUID[]),
    COUNT(*)::INTEGER
  INTO v_send_ids, v_qualified_count
  FROM qualified;

  IF COALESCE(ARRAY_LENGTH(v_send_ids, 1), 0) = 0 THEN
    RETURN jsonb_build_object('qualified', 0, 'sequence_exits', 0);
  END IF;

  UPDATE public.email_sends send
  SET clicked_at = aggregate.first_clicked_at,
      click_count = aggregate.click_count
  FROM (
    SELECT
      event.email_send_id,
      MIN(event.created_at) AS first_clicked_at,
      COUNT(*)::INTEGER AS click_count
    FROM public.email_tracking_events event
    WHERE event.email_send_id = ANY(v_send_ids)
      AND event.event_type = 'click'
      AND event.classification = 'human'
    GROUP BY event.email_send_id
  ) aggregate
  WHERE send.id = aggregate.email_send_id;

  -- Business state changes only after the holdback has qualified the click.
  UPDATE public.email_sequence_enrollments enrollment
  SET status = 'exited',
      exit_reason = 'reactivated_click',
      next_send_at = NULL,
      processing_started_at = NULL,
      updated_at = NOW()
  FROM public.email_sequences sequence, public.email_sends send
  WHERE sequence.id = enrollment.sequence_id
    AND send.id = enrollment.last_email_send_id
    AND send.id = ANY(v_send_ids)
    AND sequence.key LIKE 'reactivation\_%' ESCAPE '\'
    AND enrollment.current_step_number BETWEEN 1 AND 3
    AND enrollment.status IN ('active', 'processing', 'paused');

  GET DIAGNOSTICS v_exited_count = ROW_COUNT;

  RETURN jsonb_build_object(
    'qualified', v_qualified_count,
    'sequence_exits', v_exited_count
  );
END;
$$;

REVOKE ALL ON FUNCTION public.qualify_pending_email_clicks(INTERVAL, INTEGER)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.qualify_pending_email_clicks(INTERVAL, INTEGER)
  TO service_role;

-- Conservative historical classification: identify obvious automation and
-- behavior bursts first, then qualify the remaining aged clicks.
UPDATE public.email_tracking_events
SET classification = 'automated',
    classification_reason = 'known_automation_user_agent',
    classifier_version = 'email-event-backfill-v1'
WHERE event_type IN ('open', 'click')
  AND COALESCE(user_agent, '') ~* '(bot\M|crawl|spider|scanner|safe.?links|proofpoint|mimecast|googleimageproxy|headless|puppeteer|playwright|curl|wget)';

UPDATE public.email_tracking_events event
SET classification = 'automated',
    classification_reason = 'historical_click_burst',
    classifier_version = 'email-event-backfill-v1'
WHERE event.event_type = 'click'
  AND EXISTS (
    SELECT 1
    FROM public.email_tracking_events peer
    WHERE peer.email_send_id = event.email_send_id
      AND peer.event_type = 'click'
      AND COALESCE(peer.ip_address, '') = COALESCE(event.ip_address, '')
      AND COALESCE(peer.user_agent, '') = COALESCE(event.user_agent, '')
      AND peer.created_at BETWEEN event.created_at - INTERVAL '60 seconds'
                              AND event.created_at + INTERVAL '60 seconds'
    GROUP BY peer.email_send_id
    HAVING COUNT(DISTINCT COALESCE(peer.link_url, '')) >= 3
        OR COUNT(*) >= 4
  );

UPDATE public.email_tracking_events
SET classification = 'human',
    classification_reason = 'historical_no_burst_signal',
    classifier_version = 'email-event-backfill-v1'
WHERE event_type = 'click'
  AND classification = 'unknown';

UPDATE public.email_sends send
SET clicked_at = aggregate.first_clicked_at,
    click_count = aggregate.click_count
FROM (
  SELECT
    base.id AS email_send_id,
    MIN(event.created_at) FILTER (WHERE event.classification = 'human') AS first_clicked_at,
    COUNT(event.id) FILTER (WHERE event.classification = 'human')::INTEGER AS click_count
  FROM public.email_sends base
  LEFT JOIN public.email_tracking_events event
    ON event.email_send_id = base.id
   AND event.event_type = 'click'
  GROUP BY base.id
) aggregate
WHERE send.id = aggregate.email_send_id;

CREATE OR REPLACE FUNCTION public.get_email_analytics(
  p_campaign_id UUID DEFAULT NULL,
  p_from_date TIMESTAMPTZ DEFAULT NULL,
  p_to_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS JSON
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  WITH scoped_sends AS (
    SELECT *
    FROM public.email_sends
    WHERE (p_campaign_id IS NULL OR campaign_id = p_campaign_id)
      AND (p_from_date IS NULL OR sent_at >= p_from_date)
      AND (p_to_date IS NULL OR sent_at <= p_to_date)
  ), send_counts AS (
    SELECT
      COUNT(*) FILTER (
        WHERE status IN ('sent', 'delivered', 'delayed', 'bounced', 'complained')
      )::INTEGER AS total_sent,
      COUNT(*) FILTER (WHERE opened_at IS NOT NULL)::INTEGER AS total_opened,
      COUNT(*) FILTER (WHERE clicked_at IS NOT NULL)::INTEGER AS total_clicked,
      COUNT(*) FILTER (WHERE bounced_at IS NOT NULL OR status = 'bounced')::INTEGER AS total_bounced,
      COUNT(*) FILTER (WHERE complained_at IS NOT NULL OR status = 'complained')::INTEGER AS total_complained,
      COUNT(*) FILTER (WHERE unsubscribed_at IS NOT NULL)::INTEGER AS total_unsubscribed,
      COUNT(*) FILTER (WHERE status = 'failed')::INTEGER AS total_failed,
      COALESCE(SUM(open_count), 0)::INTEGER AS total_open_count,
      COALESCE(SUM(click_count), 0)::INTEGER AS total_click_count
    FROM scoped_sends
  ), event_counts AS (
    SELECT
      COUNT(*) FILTER (WHERE event.event_type = 'open')::INTEGER AS raw_open_events,
      COUNT(*) FILTER (
        WHERE event.event_type = 'open' AND event.classification = 'automated'
      )::INTEGER AS automated_open_events,
      COUNT(*) FILTER (
        WHERE event.event_type = 'open' AND event.classification = 'unknown'
      )::INTEGER AS unknown_open_events,
      COUNT(*) FILTER (WHERE event.event_type = 'click')::INTEGER AS raw_click_events,
      COUNT(*) FILTER (
        WHERE event.event_type = 'click' AND event.classification = 'human'
      )::INTEGER AS qualified_click_events,
      COUNT(*) FILTER (
        WHERE event.event_type = 'click' AND event.classification = 'automated'
      )::INTEGER AS automated_click_events,
      COUNT(*) FILTER (
        WHERE event.event_type = 'click' AND event.classification = 'unknown'
      )::INTEGER AS unknown_click_events
    FROM public.email_tracking_events event
    JOIN scoped_sends send ON send.id = event.email_send_id
  )
  SELECT json_build_object(
    'total_sent', sends.total_sent,
    'total_opened', sends.total_opened,
    'total_clicked', sends.total_clicked,
    'total_bounced', sends.total_bounced,
    'total_complained', sends.total_complained,
    'total_unsubscribed', sends.total_unsubscribed,
    'total_failed', sends.total_failed,
    'total_open_count', sends.total_open_count,
    'total_click_count', sends.total_click_count,
    'open_rate', CASE WHEN sends.total_sent > 0
      THEN ROUND(sends.total_opened::NUMERIC / sends.total_sent::NUMERIC * 100, 2)
      ELSE 0 END,
    'click_rate', CASE WHEN sends.total_sent > 0
      THEN ROUND(sends.total_clicked::NUMERIC / sends.total_sent::NUMERIC * 100, 2)
      ELSE 0 END,
    'click_to_open_rate', CASE WHEN sends.total_opened > 0
      THEN ROUND(sends.total_clicked::NUMERIC / sends.total_opened::NUMERIC * 100, 2)
      ELSE 0 END,
    'unsubscribe_rate', CASE WHEN sends.total_sent > 0
      THEN ROUND(sends.total_unsubscribed::NUMERIC / sends.total_sent::NUMERIC * 100, 2)
      ELSE 0 END,
    'raw_open_events', events.raw_open_events,
    'automated_open_events', events.automated_open_events,
    'unknown_open_events', events.unknown_open_events,
    'raw_click_events', events.raw_click_events,
    'qualified_click_events', events.qualified_click_events,
    'automated_click_events', events.automated_click_events,
    'unknown_click_events', events.unknown_click_events
  )
  FROM send_counts sends CROSS JOIN event_counts events;
$$;

REVOKE ALL ON FUNCTION public.get_email_analytics(UUID, TIMESTAMPTZ, TIMESTAMPTZ)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_email_analytics(UUID, TIMESTAMPTZ, TIMESTAMPTZ)
  TO service_role;

-- ---------------------------------------------------------------------------
-- Signed provider webhooks with at-least-once deduplication
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.email_provider_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  event_id TEXT NOT NULL,
  provider_message_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL,
  payload JSONB NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  processing_error TEXT,
  UNIQUE(provider, event_id)
);

ALTER TABLE public.email_provider_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.email_provider_events FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.email_provider_events TO service_role;

CREATE INDEX IF NOT EXISTS email_provider_events_unprocessed_idx
  ON public.email_provider_events(received_at)
  WHERE processed_at IS NULL;

CREATE OR REPLACE FUNCTION public.process_email_provider_event(
  p_provider TEXT,
  p_event_id TEXT,
  p_provider_message_id TEXT,
  p_event_type TEXT,
  p_occurred_at TIMESTAMPTZ,
  p_payload JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_event public.email_provider_events%ROWTYPE;
  v_send public.email_sends%ROWTYPE;
  v_reason TEXT;
  v_normalized_email TEXT;
  v_email_send_tag TEXT;
BEGIN
  IF NULLIF(BTRIM(p_event_id), '') IS NULL
     OR NULLIF(BTRIM(p_provider_message_id), '') IS NULL THEN
    RAISE EXCEPTION 'Provider event and message IDs are required';
  END IF;

  INSERT INTO public.email_provider_events (
    provider,
    event_id,
    provider_message_id,
    event_type,
    occurred_at,
    payload
  ) VALUES (
    LOWER(BTRIM(p_provider)),
    BTRIM(p_event_id),
    BTRIM(p_provider_message_id),
    BTRIM(p_event_type),
    COALESCE(p_occurred_at, NOW()),
    COALESCE(p_payload, '{}'::JSONB)
  )
  ON CONFLICT (provider, event_id) DO UPDATE
  SET payload = EXCLUDED.payload
  RETURNING * INTO v_event;

  IF v_event.processed_at IS NOT NULL THEN
    RETURN jsonb_build_object('status', 'duplicate', 'email_send_id', NULL);
  END IF;

  SELECT * INTO v_send
  FROM public.email_sends
  WHERE provider = v_event.provider
    AND provider_message_id = v_event.provider_message_id
  LIMIT 1
  FOR UPDATE;

  -- The application email_sends UUID is included as a provider tag. This
  -- closes the narrow race where a webhook arrives before the send response
  -- can persist provider_message_id, and also heals a transient DB update
  -- failure without risking another delivery.
  IF v_send.id IS NULL THEN
    v_email_send_tag := NULLIF(v_event.payload #>> '{data,tags,email_send_id}', '');
    IF v_email_send_tag ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' THEN
      SELECT * INTO v_send
      FROM public.email_sends
      WHERE id = v_email_send_tag::UUID
      LIMIT 1
      FOR UPDATE;

      IF v_send.id IS NOT NULL THEN
        UPDATE public.email_sends
        SET provider = v_event.provider,
            provider_message_id = v_event.provider_message_id
        WHERE id = v_send.id;
      END IF;
    END IF;
  END IF;

  IF v_send.id IS NULL THEN
    UPDATE public.email_provider_events
    SET processing_error = 'email_send_not_found'
    WHERE id = v_event.id;
    RETURN jsonb_build_object('status', 'unmatched', 'email_send_id', NULL);
  END IF;

  IF v_event.event_type = 'email.sent' THEN
    UPDATE public.email_sends
    SET status = CASE WHEN status = 'pending' THEN 'sent' ELSE status END,
        sent_at = COALESCE(sent_at, v_event.occurred_at)
    WHERE id = v_send.id;
  ELSIF v_event.event_type = 'email.delivered' THEN
    UPDATE public.email_sends
    SET status = CASE
          WHEN status IN ('bounced', 'complained') THEN status
          ELSE 'delivered'
        END,
        delivered_at = COALESCE(delivered_at, v_event.occurred_at)
    WHERE id = v_send.id;
  ELSIF v_event.event_type = 'email.delivery_delayed' THEN
    UPDATE public.email_sends
    SET status = CASE
          WHEN status IN ('pending', 'sent') THEN 'delayed'
          ELSE status
        END,
        delivery_delayed_at = COALESCE(delivery_delayed_at, v_event.occurred_at)
    WHERE id = v_send.id;
  ELSIF v_event.event_type = 'email.failed' THEN
    UPDATE public.email_sends
    SET status = CASE
          WHEN status IN ('delivered', 'bounced', 'complained') THEN status
          ELSE 'failed'
        END,
        error_message = COALESCE(
          NULLIF(v_event.payload #>> '{data,reason}', ''),
          NULLIF(v_event.payload #>> '{data,message}', ''),
          'Resend reported email.failed'
        )
    WHERE id = v_send.id;
  ELSIF v_event.event_type IN ('email.bounced', 'email.complained') THEN
    v_reason := CASE
      WHEN v_event.event_type = 'email.bounced' THEN COALESCE(
        NULLIF(v_event.payload #>> '{data,bounce,message}', ''),
        NULLIF(v_event.payload #>> '{data,bounce,subType}', ''),
        'Permanent bounce reported by Resend'
      )
      ELSE 'Spam complaint reported by Resend'
    END;

    UPDATE public.email_sends
    SET status = CASE
          WHEN v_event.event_type = 'email.bounced' AND status = 'complained' THEN status
          WHEN v_event.event_type = 'email.bounced' THEN 'bounced'
          ELSE 'complained'
        END,
        bounced_at = CASE
          WHEN v_event.event_type = 'email.bounced'
          THEN COALESCE(bounced_at, v_event.occurred_at)
          ELSE bounced_at
        END,
        bounce_reason = CASE
          WHEN v_event.event_type = 'email.bounced' THEN v_reason
          ELSE bounce_reason
        END,
        complained_at = CASE
          WHEN v_event.event_type = 'email.complained'
          THEN COALESCE(complained_at, v_event.occurred_at)
          ELSE complained_at
        END
    WHERE id = v_send.id;

    v_normalized_email := public.unsubscribe_email_direct(
      v_send.recipient_email,
      v_send.recipient_source,
      v_send.recipient_source_id,
      CASE
        WHEN v_event.event_type = 'email.bounced' THEN 'provider_hard_bounce'
        ELSE 'provider_spam_complaint'
      END
    );

    INSERT INTO public.email_tracking_events (
      email_send_id,
      event_type,
      classification,
      classification_reason,
      classifier_version,
      provider_event_id
    ) VALUES (
      v_send.id,
      CASE
        WHEN v_event.event_type = 'email.bounced' THEN 'bounce'
        ELSE 'complaint'
      END,
      'automated',
      'verified_provider_webhook',
      'provider-event-v1',
      v_event.event_id
    )
    ON CONFLICT (provider_event_id) WHERE provider_event_id IS NOT NULL DO NOTHING;

    UPDATE public.email_sequence_enrollments enrollment
    SET status = 'exited',
        exit_reason = CASE
          WHEN v_event.event_type = 'email.bounced' THEN 'hard_bounce'
          ELSE 'spam_complaint'
        END,
        next_send_at = NULL,
        processing_started_at = NULL,
        updated_at = NOW()
    WHERE public.normalize_email_text(enrollment.recipient_email) = v_normalized_email
      AND enrollment.status IN ('active', 'processing', 'paused');
  END IF;

  UPDATE public.email_provider_events
  SET processed_at = NOW(),
      processing_error = NULL
  WHERE id = v_event.id;

  RETURN jsonb_build_object('status', 'processed', 'email_send_id', v_send.id);
END;
$$;

REVOKE ALL ON FUNCTION public.process_email_provider_event(
  TEXT, TEXT, TEXT, TEXT, TIMESTAMPTZ, JSONB
) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.process_email_provider_event(
  TEXT, TEXT, TEXT, TEXT, TIMESTAMPTZ, JSONB
) TO service_role;

CREATE OR REPLACE FUNCTION public.reprocess_email_provider_events(p_limit INTEGER DEFAULT 100)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_event RECORD;
  v_result JSONB;
  v_processed INTEGER := 0;
  v_unmatched INTEGER := 0;
BEGIN
  FOR v_event IN
    SELECT *
    FROM public.email_provider_events
    WHERE processed_at IS NULL
    ORDER BY received_at
    LIMIT LEAST(GREATEST(COALESCE(p_limit, 100), 1), 1000)
    FOR UPDATE SKIP LOCKED
  LOOP
    v_result := public.process_email_provider_event(
      v_event.provider,
      v_event.event_id,
      v_event.provider_message_id,
      v_event.event_type,
      v_event.occurred_at,
      v_event.payload
    );
    IF v_result ->> 'status' = 'processed' THEN
      v_processed := v_processed + 1;
    ELSE
      v_unmatched := v_unmatched + 1;
    END IF;
  END LOOP;

  RETURN jsonb_build_object('processed', v_processed, 'unmatched', v_unmatched);
END;
$$;

REVOKE ALL ON FUNCTION public.reprocess_email_provider_events(INTEGER)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reprocess_email_provider_events(INTEGER)
  TO service_role;

-- ---------------------------------------------------------------------------
-- Atomic scheduled-email claims owned by Vercel Cron
-- ---------------------------------------------------------------------------

ALTER TABLE public.scheduled_emails
  ADD COLUMN IF NOT EXISTS processing_started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS claim_token UUID;

CREATE OR REPLACE FUNCTION public.claim_due_scheduled_emails(p_limit INTEGER DEFAULT 5)
RETURNS SETOF public.scheduled_emails
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH due AS (
    SELECT scheduled.id
    FROM public.scheduled_emails scheduled
    WHERE (
        scheduled.status = 'pending'
        AND scheduled.scheduled_for <= NOW()
      ) OR (
        scheduled.status = 'processing'
        AND scheduled.processing_started_at < NOW() - INTERVAL '30 minutes'
      )
    ORDER BY scheduled.scheduled_for
    LIMIT LEAST(GREATEST(COALESCE(p_limit, 5), 1), 25)
    FOR UPDATE SKIP LOCKED
  )
  UPDATE public.scheduled_emails scheduled
  SET status = 'processing',
      processing_started_at = NOW(),
      claim_token = gen_random_uuid()
  FROM due
  WHERE scheduled.id = due.id
  RETURNING scheduled.*;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_due_scheduled_emails(INTEGER)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_due_scheduled_emails(INTEGER)
  TO service_role;

CREATE OR REPLACE VIEW public.email_cron_status
WITH (security_invoker = true)
AS
SELECT
  enabled,
  last_run_at,
  last_run_status,
  api_endpoint,
  updated_at,
  CASE
    WHEN last_run_at IS NULL THEN 'never_run'
    WHEN last_run_at > NOW() - INTERVAL '10 minutes' THEN 'healthy'
    WHEN last_run_at > NOW() - INTERVAL '30 minutes' THEN 'stale'
    ELSE 'unhealthy'
  END AS health_status
FROM public.email_cron_config
WHERE id = 1;

UPDATE public.email_cron_config
SET api_endpoint = 'https://9takes.com/api/cron/send-scheduled-emails',
    updated_at = NOW()
WHERE id = 1;
