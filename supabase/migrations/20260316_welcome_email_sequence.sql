-- supabase/migrations/20260316_welcome_email_sequence.sql
-- Created: 2026-03-16
-- Adds the v1 welcome email sequence infrastructure and seed content.

CREATE TABLE IF NOT EXISTS email_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('user_registration', 'manual')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_sequence_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID NOT NULL REFERENCES email_sequences(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  delay_days_after_previous INTEGER NOT NULL DEFAULT 0,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  plain_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (sequence_id, step_number)
);

CREATE TABLE IF NOT EXISTS email_sequence_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID NOT NULL REFERENCES email_sequences(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  recipient_email TEXT NOT NULL,
  recipient_source TEXT NOT NULL CHECK (
    recipient_source IN ('profiles', 'signups', 'coaching_waitlist')
  ),
  recipient_source_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (
    status IN ('active', 'processing', 'paused', 'completed', 'exited', 'errored')
  ),
  current_step_number INTEGER NOT NULL DEFAULT 0,
  next_step_number INTEGER,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  next_send_at TIMESTAMPTZ,
  last_sent_at TIMESTAMPTZ,
  last_email_send_id UUID REFERENCES email_sends(id) ON DELETE SET NULL,
  processing_started_at TIMESTAMPTZ,
  failure_count INTEGER NOT NULL DEFAULT 0,
  exit_reason TEXT,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (sequence_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_email_sequence_enrollments_due
  ON email_sequence_enrollments(next_send_at)
  WHERE status = 'active' AND next_send_at IS NOT NULL;

ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequence_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequence_enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS admin_email_sequences ON email_sequences;
CREATE POLICY admin_email_sequences ON email_sequences
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.admin = true)
  );

DROP POLICY IF EXISTS admin_email_sequence_steps ON email_sequence_steps;
CREATE POLICY admin_email_sequence_steps ON email_sequence_steps
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.admin = true)
  );

DROP POLICY IF EXISTS admin_email_sequence_enrollments ON email_sequence_enrollments;
CREATE POLICY admin_email_sequence_enrollments ON email_sequence_enrollments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.admin = true)
  );

CREATE OR REPLACE FUNCTION enroll_user_in_sequence(
  p_user_id UUID,
  p_email TEXT,
  p_sequence_key TEXT,
  p_recipient_source TEXT DEFAULT 'profiles',
  p_recipient_source_id TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sequence_id UUID;
  v_enrollment_id UUID;
  v_first_step_number INTEGER;
  v_email TEXT;
BEGIN
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'p_user_id is required';
  END IF;

  v_email := normalize_email_text(p_email);
  IF v_email IS NULL THEN
    RAISE EXCEPTION 'p_email is required';
  END IF;

  SELECT id
    INTO v_sequence_id
  FROM email_sequences
  WHERE key = p_sequence_key
    AND status = 'active'
  LIMIT 1;

  IF v_sequence_id IS NULL THEN
    RAISE EXCEPTION 'Sequence not found or inactive: %', p_sequence_key;
  END IF;

  SELECT id
    INTO v_enrollment_id
  FROM email_sequence_enrollments
  WHERE sequence_id = v_sequence_id
    AND user_id = p_user_id
  LIMIT 1;

  IF v_enrollment_id IS NOT NULL THEN
    RETURN v_enrollment_id;
  END IF;

  SELECT step_number
    INTO v_first_step_number
  FROM email_sequence_steps
  WHERE sequence_id = v_sequence_id
  ORDER BY step_number ASC
  LIMIT 1;

  IF v_first_step_number IS NULL THEN
    RAISE EXCEPTION 'Sequence has no steps: %', p_sequence_key;
  END IF;

  INSERT INTO email_sequence_enrollments (
    sequence_id,
    user_id,
    recipient_email,
    recipient_source,
    recipient_source_id,
    status,
    current_step_number,
    next_step_number,
    enrolled_at,
    next_send_at,
    created_at,
    updated_at
  )
  VALUES (
    v_sequence_id,
    p_user_id,
    v_email,
    p_recipient_source,
    COALESCE(NULLIF(TRIM(p_recipient_source_id), ''), p_user_id::TEXT),
    'active',
    0,
    v_first_step_number,
    NOW(),
    NOW(),
    NOW(),
    NOW()
  )
  RETURNING id INTO v_enrollment_id;

  RETURN v_enrollment_id;
END;
$$;

CREATE OR REPLACE FUNCTION claim_pending_sequence_sends(p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  enrollment_id UUID,
  sequence_key TEXT,
  user_id UUID,
  recipient_email TEXT,
  recipient_source TEXT,
  recipient_source_id TEXT,
  recipient_name TEXT,
  enneagram TEXT,
  step_number INTEGER,
  subject TEXT,
  html_content TEXT,
  plain_text TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE email_sequence_enrollments
  SET status = 'errored',
      next_send_at = NULL,
      processing_started_at = NULL,
      last_error = 'Sequence processing timed out before completion',
      updated_at = NOW()
  WHERE status = 'processing'
    AND processing_started_at IS NOT NULL
    AND processing_started_at < NOW() - INTERVAL '2 hours';

  RETURN QUERY
  WITH due AS (
    SELECT e.id
    FROM email_sequence_enrollments e
    JOIN email_sequences s ON s.id = e.sequence_id
    WHERE e.status = 'active'
      AND e.next_send_at IS NOT NULL
      AND e.next_send_at <= NOW()
      AND s.status = 'active'
    ORDER BY e.next_send_at ASC
    FOR UPDATE SKIP LOCKED
    LIMIT GREATEST(COALESCE(p_limit, 10), 0)
  ),
  claimed AS (
    UPDATE email_sequence_enrollments e
    SET status = 'processing',
        processing_started_at = NOW(),
        updated_at = NOW()
    FROM due
    WHERE e.id = due.id
    RETURNING e.*
  )
  SELECT
    c.id AS enrollment_id,
    s.key AS sequence_key,
    c.user_id,
    c.recipient_email,
    c.recipient_source,
    c.recipient_source_id,
    COALESCE(NULLIF(p.first_name, ''), NULLIF(p.username, ''), 'there') AS recipient_name,
    p.enneagram,
    st.step_number,
    st.subject,
    st.html_content,
    st.plain_text
  FROM claimed c
  JOIN email_sequences s ON s.id = c.sequence_id
  JOIN email_sequence_steps st
    ON st.sequence_id = c.sequence_id
   AND st.step_number = c.next_step_number
  LEFT JOIN profiles p ON p.id = c.user_id
  ORDER BY c.next_send_at ASC;
END;
$$;

CREATE OR REPLACE FUNCTION complete_sequence_send(
  p_enrollment_id UUID,
  p_email_send_id UUID DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sequence_id UUID;
  v_completed_step INTEGER;
  v_next_step_number INTEGER;
  v_next_delay INTEGER;
BEGIN
  SELECT sequence_id, next_step_number
    INTO v_sequence_id, v_completed_step
  FROM email_sequence_enrollments
  WHERE id = p_enrollment_id
    AND status = 'processing'
  LIMIT 1;

  IF v_sequence_id IS NULL OR v_completed_step IS NULL THEN
    RETURN;
  END IF;

  SELECT step_number, delay_days_after_previous
    INTO v_next_step_number, v_next_delay
  FROM email_sequence_steps
  WHERE sequence_id = v_sequence_id
    AND step_number > v_completed_step
  ORDER BY step_number ASC
  LIMIT 1;

  IF v_next_step_number IS NULL THEN
    UPDATE email_sequence_enrollments
    SET current_step_number = v_completed_step,
        next_step_number = NULL,
        next_send_at = NULL,
        last_sent_at = NOW(),
        last_email_send_id = p_email_send_id,
        processing_started_at = NULL,
        failure_count = 0,
        status = 'completed',
        exit_reason = 'completed',
        last_error = NULL,
        updated_at = NOW()
    WHERE id = p_enrollment_id
      AND status = 'processing';
  ELSE
    UPDATE email_sequence_enrollments
    SET current_step_number = v_completed_step,
        next_step_number = v_next_step_number,
        next_send_at = NOW() + make_interval(days => COALESCE(v_next_delay, 0)),
        last_sent_at = NOW(),
        last_email_send_id = p_email_send_id,
        processing_started_at = NULL,
        failure_count = 0,
        status = 'active',
        last_error = NULL,
        updated_at = NOW()
    WHERE id = p_enrollment_id
      AND status = 'processing';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION retry_or_fail_sequence_send(
  p_enrollment_id UUID,
  p_error TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_failure_count INTEGER;
BEGIN
  UPDATE email_sequence_enrollments
  SET failure_count = failure_count + 1,
      last_error = LEFT(COALESCE(p_error, 'Unknown error'), 1000),
      updated_at = NOW()
  WHERE id = p_enrollment_id
    AND status = 'processing'
  RETURNING failure_count INTO v_failure_count;

  IF v_failure_count IS NULL THEN
    RETURN;
  END IF;

  IF v_failure_count < 3 THEN
    UPDATE email_sequence_enrollments
    SET status = 'active',
        next_send_at = NOW() + INTERVAL '30 minutes',
        processing_started_at = NULL,
        updated_at = NOW()
    WHERE id = p_enrollment_id
      AND status = 'processing';
  ELSE
    UPDATE email_sequence_enrollments
    SET status = 'errored',
        next_send_at = NULL,
        processing_started_at = NULL,
        updated_at = NOW()
    WHERE id = p_enrollment_id
      AND status = 'processing';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION exit_user_from_sequence(
  p_user_id UUID,
  p_sequence_key TEXT,
  p_reason TEXT
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  UPDATE email_sequence_enrollments e
  SET status = 'exited',
      exit_reason = LEFT(COALESCE(p_reason, 'manual'), 255),
      next_send_at = NULL,
      processing_started_at = NULL,
      updated_at = NOW()
  FROM email_sequences s
  WHERE s.id = e.sequence_id
    AND s.key = p_sequence_key
    AND e.user_id = p_user_id
    AND e.status IN ('active', 'processing', 'paused');

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

CREATE OR REPLACE FUNCTION exit_email_from_sequence(
  p_email TEXT,
  p_sequence_key TEXT,
  p_reason TEXT
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
  v_email TEXT;
BEGIN
  v_email := normalize_email_text(p_email);
  IF v_email IS NULL THEN
    RETURN 0;
  END IF;

  UPDATE email_sequence_enrollments e
  SET status = 'exited',
      exit_reason = LEFT(COALESCE(p_reason, 'manual'), 255),
      next_send_at = NULL,
      processing_started_at = NULL,
      updated_at = NOW()
  FROM email_sequences s
  WHERE s.id = e.sequence_id
    AND s.key = p_sequence_key
    AND normalize_email_text(e.recipient_email) = v_email
    AND e.status IN ('active', 'processing', 'paused');

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

DO $seed$
DECLARE
  v_sequence_id UUID;
BEGIN
  INSERT INTO email_sequences (
    key,
    display_name,
    description,
    trigger_type,
    status,
    created_at,
    updated_at
  )
  VALUES (
    'welcome_sequence',
    'Registered User Welcome Sequence',
    'Gmail-based welcome sequence for newly registered 9takes users.',
    'user_registration',
    'active',
    NOW(),
    NOW()
  )
  ON CONFLICT (key) DO UPDATE
    SET display_name = EXCLUDED.display_name,
        description = EXCLUDED.description,
        trigger_type = EXCLUDED.trigger_type,
        status = EXCLUDED.status,
        updated_at = NOW()
  RETURNING id INTO v_sequence_id;

  INSERT INTO email_sequence_steps (
    sequence_id,
    step_number,
    delay_days_after_previous,
    subject,
    html_content,
    plain_text,
    created_at,
    updated_at
  )
  VALUES
    (
      v_sequence_id,
      1,
      0,
      'Welcome to 9takes - your authentic perspective matters',
      $$<p>Hi {{first_name}},</p>
<p>Welcome to 9takes.</p>
<p>You just joined a place built around one simple idea:</p>
<p><strong>your honest take matters more when it arrives before everyone else''s.</strong></p>
<p>Most platforms train you to absorb the room first and think second.</p>
<p>9takes works the other way around:</p>
<ul>
  <li>you see a question</li>
  <li>you give your take first</li>
  <li>then you unlock the other perspectives</li>
</ul>
<p>That friction is intentional. It helps you notice what you actually think, where your blind spots are, and how differently other people interpret the same situation.</p>
<p><a href="{{questions_url}}">Browse current questions</a> and answer one before reading the room.</p>
<p>Two minutes is enough.</p>
<p>DJocrates<br />9takes.com</p>
<p>P.S. If your first take feels a little vulnerable, that usually means you are doing it right.</p>$$,
      $$Hi {{first_name}},

Welcome to 9takes.

You just joined a place built around one simple idea: your honest take matters more when it arrives before everyone else's.

Most platforms train you to absorb the room first and think second.

9takes works the other way around:
- you see a question
- you give your take first
- then you unlock the other perspectives

That friction is intentional. It helps you notice what you actually think, where your blind spots are, and how differently other people interpret the same situation.

Browse current questions: {{questions_url}}

Two minutes is enough.

DJocrates
9takes.com$$,
      NOW(),
      NOW()
    ),
    (
      v_sequence_id,
      2,
      2,
      'He thinks she''s cold. She thinks he''s needy.',
      $$<p>Hi {{first_name}},</p>
<p>He sees her go quiet after a long day and thinks: <em>she''s pulling away.</em></p>
<p>She sees him double-text after an hour and thinks: <em>he''s being clingy.</em></p>
<p><strong>Neither is right.</strong> They are just reading the same moment through completely different filters.</p>
<p>That is the kind of gap 9takes is built to surface: <strong>same situation, different internal logic.</strong></p>
<ul>
  <li>One person reads silence as rejection. Another reads it as &quot;I need space to think.&quot;</li>
  <li>One person reads a follow-up message as pressure. Another reads it as care.</li>
</ul>
<p>The gap is not about who is right. It is about recognizing that people are rarely reacting from the same inner pattern you are.</p>
<p><a href="{{questions_url}}">Browse a live question</a> and compare how different people are reading the same situation.</p>
<p>DJocrates<br />9takes.com</p>$$,
      $$Hi {{first_name}},

He sees her go quiet after a long day and thinks: she's pulling away.

She sees him double-text after an hour and thinks: he's being clingy.

Neither is right. They are just reading the same moment through completely different filters.

That is the kind of gap 9takes is built to surface: same situation, different internal logic.

- One person reads silence as rejection. Another reads it as "I need space to think."
- One person reads a follow-up message as pressure. Another reads it as care.

The gap is not about who is right. It is about recognizing that people are rarely reacting from the same inner pattern you are.

Browse a live question: {{questions_url}}

DJocrates
9takes.com$$,
      NOW(),
      NOW()
    ),
    (
      v_sequence_id,
      3,
      3,
      'Your perspective is missing from this conversation',
      $$<p>Hi {{first_name}},</p>
<p>By now you''ve seen how 9takes works.</p>
<p><strong>Now we need your take in the mix.</strong></p>
<p>Not because the platform needs filler. Because your perspective notices things other people miss.</p>
<p>That is the whole point of the product:</p>
<ul>
  <li>different people catch different signals</li>
  <li>different types interpret the same event differently</li>
  <li>the conversation gets smarter when more real perspectives show up</li>
</ul>
<p>If you are not sure where to start, pick one:</p>
<ol>
  <li><a href="{{ask_question_url}}">Ask your own question</a></li>
  <li><a href="{{questions_url}}">Comment on a live question</a></li>
  <li><a href="{{questions_url}}">Browse more examples first</a></li>
</ol>
<p>You do not need the perfect take. You just need the honest one.</p>
<p>DJocrates<br />9takes.com</p>
<p>P.S. The best 9takes users are not the ones with the most personality theory. They are the ones willing to contribute one real perspective.</p>$$,
      $$Hi {{first_name}},

By now you've seen how 9takes works.

Now we need your take in the mix.

Not because the platform needs filler. Because your perspective notices things other people miss.

That is the whole point of the product:
- different people catch different signals
- different types interpret the same event differently
- the conversation gets smarter when more real perspectives show up

If you are not sure where to start, pick one:
1. Ask your own question: {{ask_question_url}}
2. Comment on a live question: {{questions_url}}
3. Browse more examples first: {{questions_url}}

You do not need the perfect take. You just need the honest one.

DJocrates
9takes.com$$,
      NOW(),
      NOW()
    ),
    (
      v_sequence_id,
      4,
      5,
      'How''s your 9takes experience going?',
      $$<p>Hi {{first_name}},</p>
<p>You''ve had some time with 9takes now, so here is the real question:</p>
<p><strong>is it clicking yet?</strong></p>
<p>Usually one of three things is true:</p>
<ol>
  <li>You are getting it. You have started noticing how differently people interpret the same situation.</li>
  <li>You are interested, but a little unsure how to use it. If that''s you, just reply to this email. I read replies.</li>
  <li>It is not landing for you. That is fine too. Not every tool is for every person.</li>
</ol>
<p>If you are in bucket 2, here is the simplest way to use 9takes:</p>
<ul>
  <li>find a question that feels real</li>
  <li>answer before reading everyone else</li>
  <li>compare what you saw with what they saw</li>
</ul>
<p>That one pattern is the whole product.</p>
<p>If you want to give it one more real try: <a href="{{questions_url}}">browse current questions</a>.</p>
<p>DJocrates<br />9takes.com</p>
<p>P.S. If it is not a fit, no hard feelings. Better a clean unsubscribe than inbox clutter.</p>$$,
      $$Hi {{first_name}},

You've had some time with 9takes now, so here is the real question: is it clicking yet?

Usually one of three things is true:
1. You are getting it. You have started noticing how differently people interpret the same situation.
2. You are interested, but a little unsure how to use it. If that's you, just reply to this email. I read replies.
3. It is not landing for you. That is fine too. Not every tool is for every person.

If you are in bucket 2, here is the simplest way to use 9takes:
- find a question that feels real
- answer before reading everyone else
- compare what you saw with what they saw

That one pattern is the whole product.

If you want to give it one more real try, browse current questions: {{questions_url}}

DJocrates
9takes.com$$,
      NOW(),
      NOW()
    )
  ON CONFLICT (sequence_id, step_number) DO UPDATE
    SET delay_days_after_previous = EXCLUDED.delay_days_after_previous,
        subject = EXCLUDED.subject,
        html_content = EXCLUDED.html_content,
        plain_text = EXCLUDED.plain_text,
        updated_at = NOW();
END $seed$;
