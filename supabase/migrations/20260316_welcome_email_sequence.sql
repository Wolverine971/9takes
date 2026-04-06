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
      'Welcome to 9takes',
      $$<p>Hi {{first_name}},</p>
<p>Welcome to 9takes.</p>
<p>Here's how it works: you see a question, you answer it, then you see what everyone else said.</p>
<p><strong>You have to go first. That's the whole thing.</strong></p>
<p>Most platforms let you lurk and read the room before you say anything. We flip that. You put your take out there first, then you get to see how other people read the same situation.</p>
<p><a href="{{questions_url}}">Pick a question and answer it.</a> Takes about two minutes.</p>
<p>DJocrates<br />9takes.com</p>
<p>P.S. If your first answer feels a little uncomfortable, you're probably doing it right.</p>$$,
      $$Hi {{first_name}},

Welcome to 9takes.

Here's how it works: you see a question, you answer it, then you see what everyone else said.

You have to go first. That's the whole thing.

Most platforms let you lurk and read the room before you say anything. We flip that. You put your take out there first, then you get to see how other people read the same situation.

Pick a question and answer it: {{questions_url}}

Takes about two minutes.

DJocrates
9takes.com

P.S. If your first answer feels a little uncomfortable, you're probably doing it right.$$,
      NOW(),
      NOW()
    ),
    (
      v_sequence_id,
      2,
      2,
      'He thinks she''s cold. She thinks he''s needy.',
      $$<p>Hi {{first_name}},</p>
<p>He sees her go quiet after a long day and thinks she's pulling away.</p>
<p>She sees him double-text after an hour and thinks he's being clingy.</p>
<p><strong>Neither is right.</strong> They're reading the same moment through totally different filters.</p>
<p>That's what 9takes shows you. Same situation, different people, different reads.</p>
<ul>
  <li>One person sees silence as rejection. Another sees it as needing space to think.</li>
  <li>One person sees a follow-up text as pressure. Another sees it as care.</li>
</ul>
<p>It's not about who's right. It's about seeing that people aren't reacting from the same place you are.</p>
<p><a href="{{questions_url}}">Check out a live question</a> and see how different people read the same thing.</p>
<p>DJocrates<br />9takes.com</p>$$,
      $$Hi {{first_name}},

He sees her go quiet after a long day and thinks she's pulling away.

She sees him double-text after an hour and thinks he's being clingy.

Neither is right. They're reading the same moment through totally different filters.

That's what 9takes shows you. Same situation, different people, different reads.

- One person sees silence as rejection. Another sees it as needing space to think.
- One person sees a follow-up text as pressure. Another sees it as care.

It's not about who's right. It's about seeing that people aren't reacting from the same place you are.

Check out a live question: {{questions_url}}

DJocrates
9takes.com$$,
      NOW(),
      NOW()
    ),
    (
      v_sequence_id,
      3,
      3,
      'We need your take',
      $$<p>Hi {{first_name}},</p>
<p>You've seen how 9takes works by now.</p>
<p><strong>Now we need you in the mix.</strong></p>
<p>Not because we need filler. Because you notice things other people miss. Different people catch different signals, read the same event differently. The conversation gets better when more real people show up.</p>
<p>If you're not sure where to start, pick one:</p>
<ol>
  <li><a href="{{ask_question_url}}">Ask your own question</a></li>
  <li><a href="{{questions_url}}">Answer a live one</a></li>
  <li><a href="{{questions_url}}">Just browse a bit more</a></li>
</ol>
<p>You don't need the perfect answer. Just an honest one.</p>
<p>DJocrates<br />9takes.com</p>
<p>P.S. The best 9takes users aren't personality experts. They're just people willing to share one real take.</p>$$,
      $$Hi {{first_name}},

You've seen how 9takes works by now.

Now we need you in the mix.

Not because we need filler. Because you notice things other people miss. Different people catch different signals, read the same event differently. The conversation gets better when more real people show up.

If you're not sure where to start, pick one:
1. Ask your own question: {{ask_question_url}}
2. Answer a live one: {{questions_url}}
3. Just browse a bit more: {{questions_url}}

You don't need the perfect answer. Just an honest one.

DJocrates
9takes.com

P.S. The best 9takes users aren't personality experts. They're just people willing to share one real take.$$,
      NOW(),
      NOW()
    ),
    (
      v_sequence_id,
      4,
      5,
      'Is 9takes clicking for you?',
      $$<p>Hi {{first_name}},</p>
<p>You've had some time with 9takes now so I'll just ask: is it clicking?</p>
<p>Usually one of three things is true:</p>
<ol>
  <li>You're getting it. You've started noticing how differently people read the same situation.</li>
  <li>You're interested but not sure how to use it. If that's you, reply to this email. I read every one.</li>
  <li>It's not for you. That's fine too.</li>
</ol>
<p>If you're in the second camp, here's the simplest way to use 9takes:</p>
<ul>
  <li>find a question that feels real</li>
  <li>answer before reading everyone else</li>
  <li>compare what you saw with what they saw</li>
</ul>
<p>That one loop is the whole product.</p>
<p>If you want to give it one more shot: <a href="{{questions_url}}">browse current questions</a>.</p>
<p>DJocrates<br />9takes.com</p>
<p>P.S. If it's not a fit, no hard feelings. Better to unsubscribe than let it clutter your inbox.</p>$$,
      $$Hi {{first_name}},

You've had some time with 9takes now so I'll just ask: is it clicking?

Usually one of three things is true:
1. You're getting it. You've started noticing how differently people read the same situation.
2. You're interested but not sure how to use it. If that's you, reply to this email. I read every one.
3. It's not for you. That's fine too.

If you're in the second camp, here's the simplest way to use 9takes:
- find a question that feels real
- answer before reading everyone else
- compare what you saw with what they saw

That one loop is the whole product.

If you want to give it one more shot, browse current questions: {{questions_url}}

DJocrates
9takes.com

P.S. If it's not a fit, no hard feelings. Better to unsubscribe than let it clutter your inbox.$$,
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
