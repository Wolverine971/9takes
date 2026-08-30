-- supabase/migrations/20260812010900_enneagram_type_prompt_campaign.sql
-- Stage a one-step, manual campaign for registered users who have not added
-- a valid Enneagram type. It is intentionally created in draft status: draft
-- sequences cannot enroll recipients and cannot be claimed by the email cron.

DO $seed$
DECLARE
  v_sequence_id UUID;
BEGIN
  INSERT INTO public.email_sequences (
    key,
    display_name,
    description,
    trigger_type,
    status,
    created_at,
    updated_at
  )
  VALUES (
    'enneagram_type_prompt',
    'Missing Enneagram Type — One-Off',
    'One-email invitation for confirmed registered users who still lack an Enneagram type and have not been emailed in the previous seven days.',
    'manual',
    'draft',
    NOW(),
    NOW()
  )
  ON CONFLICT (key) DO UPDATE
    SET display_name = EXCLUDED.display_name,
        description = EXCLUDED.description,
        trigger_type = EXCLUDED.trigger_type,
        updated_at = NOW()
  RETURNING id INTO v_sequence_id;

  INSERT INTO public.email_sequence_steps (
    sequence_id,
    step_number,
    delay_days_after_previous,
    subject,
    html_content,
    plain_text,
    created_at,
    updated_at
  )
  VALUES (
    v_sequence_id,
    1,
    0,
    'Do you know your Enneagram type?',
    $html$<p>Hi {{first_name}},</p>
<p>We noticed you haven’t added an Enneagram type to your 9takes profile. If you don’t know it yet, that’s completely normal.</p>
<p>The Enneagram starts with three centers of intelligence, each connected to a core emotion:</p>
<ul>
  <li><strong>Instinctual intelligence</strong> — anger, boundaries, autonomy, and action</li>
  <li><strong>Emotional intelligence</strong> — shame, connection, image, and worth</li>
  <li><strong>Intellectual intelligence</strong> — fear, security, anticipation, and possibility</li>
</ul>
<p>You use all three. Each Enneagram type develops a different strategy for handling those emotional pressures. That strategy can become both a blind spot and something that feels like a superpower.</p>
<p style="margin:20px 0;"><a class="button" href="https://9takes.com/enneagram-corner/beginners-guide-to-determining-your-enneagram-type">Find your starting point</a></p>
<p>Already know your type? <a href="https://9takes.com/account">Add it to your 9takes profile</a>.</p>
<p>Knowing your type doesn’t mean everyone with that number sees the world exactly as you do. Two Type 5s can disagree completely. But their takes often reveal a recognizable lens—and that’s where the conversation gets interesting.</p>
<p><a href="https://9takes.com/questions">Browse a question and share your take</a> when you’re ready.</p>
<p>DJ<br />9takes.com</p>$html$,
    $text$Hi {{first_name}},

We noticed you haven’t added an Enneagram type to your 9takes profile. If you don’t know it yet, that’s completely normal.

The Enneagram starts with three centers of intelligence, each connected to a core emotion:

- Instinctual intelligence — anger, boundaries, autonomy, and action
- Emotional intelligence — shame, connection, image, and worth
- Intellectual intelligence — fear, security, anticipation, and possibility

You use all three. Each Enneagram type develops a different strategy for handling those emotional pressures. That strategy can become both a blind spot and something that feels like a superpower.

Find your starting point:
https://9takes.com/enneagram-corner/beginners-guide-to-determining-your-enneagram-type

Already know your type? Add it to your 9takes profile:
https://9takes.com/account

Knowing your type doesn’t mean everyone with that number sees the world exactly as you do. Two Type 5s can disagree completely. But their takes often reveal a recognizable lens—and that’s where the conversation gets interesting.

Browse a question and share your take when you’re ready:
https://9takes.com/questions

DJ
9takes.com$text$,
    NOW(),
    NOW()
  )
  ON CONFLICT (sequence_id, step_number) DO UPDATE
    SET delay_days_after_previous = EXCLUDED.delay_days_after_previous,
        subject = EXCLUDED.subject,
        html_content = EXCLUDED.html_content,
        plain_text = EXCLUDED.plain_text,
        updated_at = NOW();
END;
$seed$;

-- Final delivery guard for the one-off. The application calls this after a
-- sequence enrollment is claimed and immediately before any Gmail request.
-- It deliberately reads live profile and send data so an old audience export
-- can never override a newly added type or the seven-day email buffer.
CREATE OR REPLACE FUNCTION public.get_enneagram_type_prompt_send_guard(
  p_user_id UUID,
  p_email TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_enneagram TEXT;
  v_profile_found BOOLEAN := FALSE;
  v_last_email_sent_at TIMESTAMPTZ;
  v_next_eligible_at TIMESTAMPTZ;
  v_reason TEXT;
BEGIN
  SELECT profile.enneagram, TRUE
    INTO v_enneagram, v_profile_found
  FROM public.profiles AS profile
  WHERE profile.id = p_user_id
  LIMIT 1;

  SELECT MAX(send.sent_at)
    INTO v_last_email_sent_at
  FROM public.email_sends AS send
  WHERE public.normalize_email_text(send.recipient_email) =
        public.normalize_email_text(p_email)
    AND send.sent_at IS NOT NULL;

  v_next_eligible_at := v_last_email_sent_at + INTERVAL '7 days';
  v_reason := CASE
    WHEN NOT v_profile_found THEN 'profile_missing'
    WHEN COALESCE(BTRIM(v_enneagram), '') ~ '^[1-9]$' THEN 'enneagram_added'
    WHEN v_next_eligible_at > NOW() THEN 'recent_email'
    ELSE 'eligible'
  END;

  RETURN jsonb_build_object(
    'eligible', v_reason = 'eligible',
    'reason', v_reason,
    'enneagram', v_enneagram,
    'last_email_sent_at', v_last_email_sent_at,
    'next_eligible_at', v_next_eligible_at
  );
END;
$$;

REVOKE ALL ON FUNCTION public.get_enneagram_type_prompt_send_guard(UUID, TEXT)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_enneagram_type_prompt_send_guard(UUID, TEXT)
  TO service_role;

-- The registration flow stores "unknown" until a user chooses 1–9. The old
-- admin filter treated every non-null value as a completed type, which hid the
-- entire campaign audience from the "No Enneagram" view.
CREATE OR REPLACE FUNCTION public.get_admin_users_page(
  p_search TEXT DEFAULT '',
  p_filter TEXT DEFAULT 'all',
  p_sort_by TEXT DEFAULT 'last_sign_in_at',
  p_sort_direction TEXT DEFAULT 'desc',
  p_limit INTEGER DEFAULT 100,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  email TEXT,
  aud TEXT,
  role TEXT,
  phone TEXT,
  confirmation_sent_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  invited_at TIMESTAMPTZ,
  last_sign_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  enneagram TEXT,
  external_id TEXT,
  admin BOOLEAN,
  total_rows BIGINT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_search TEXT := LEFT(BTRIM(COALESCE(p_search, '')), 200);
  v_filter TEXT := LOWER(COALESCE(p_filter, 'all'));
  v_sort_by TEXT := LOWER(COALESCE(p_sort_by, 'last_sign_in_at'));
  v_sort_direction TEXT := LOWER(COALESCE(p_sort_direction, 'desc'));
  v_limit INTEGER := LEAST(GREATEST(COALESCE(p_limit, 100), 1), 100);
  v_offset INTEGER := GREATEST(COALESCE(p_offset, 0), 0);
  v_order_expression TEXT;
BEGIN
  IF auth.role() IS DISTINCT FROM 'service_role' AND NOT EXISTS (
    SELECT 1
    FROM public.profiles AS actor
    WHERE actor.id = auth.uid()
      AND actor.admin IS TRUE
  ) THEN
    RAISE EXCEPTION 'Administrator access required' USING ERRCODE = '42501';
  END IF;

  IF v_filter NOT IN ('all', 'admins', 'with-type', 'no-type') THEN
    v_filter := 'all';
  END IF;

  IF v_sort_by NOT IN ('last_sign_in_at', 'created_at', 'email', 'enneagram', 'admin') THEN
    v_sort_by := 'last_sign_in_at';
  END IF;

  IF v_sort_direction NOT IN ('asc', 'desc') THEN
    v_sort_direction := 'desc';
  END IF;

  v_order_expression := CASE v_sort_by
    WHEN 'created_at' THEN 'auth_user.created_at'
    WHEN 'email' THEN 'COALESCE(profile.email, auth_user.email)'
    WHEN 'enneagram' THEN 'profile.enneagram'
    WHEN 'admin' THEN 'profile.admin'
    ELSE 'auth_user.last_sign_in_at'
  END;

  RETURN QUERY EXECUTE FORMAT(
    $query$
      SELECT auth_user.id,
             COALESCE(profile.email, auth_user.email)::TEXT AS email,
             auth_user.aud::TEXT,
             auth_user.role::TEXT,
             auth_user.phone::TEXT,
             auth_user.confirmation_sent_at,
             auth_user.confirmed_at,
             auth_user.invited_at,
             auth_user.last_sign_in_at,
             auth_user.created_at,
             profile.username,
             profile.first_name,
             profile.last_name,
             profile.enneagram,
             profile.external_id::TEXT,
             profile.admin IS TRUE AS admin,
             COUNT(*) OVER()::BIGINT AS total_rows
      FROM auth.users AS auth_user
      LEFT JOIN public.profiles AS profile ON profile.id = auth_user.id
      WHERE (
        $1 = ''
        OR POSITION(LOWER($1) IN LOWER(COALESCE(profile.email, auth_user.email, ''))) > 0
        OR POSITION(LOWER($1) IN LOWER(COALESCE(profile.username, ''))) > 0
        OR POSITION(LOWER($1) IN LOWER(COALESCE(profile.first_name, ''))) > 0
        OR POSITION(LOWER($1) IN LOWER(COALESCE(profile.last_name, ''))) > 0
      )
      AND CASE $2
        WHEN 'admins' THEN profile.admin IS TRUE
        WHEN 'with-type' THEN COALESCE(BTRIM(profile.enneagram), '') ~ '^[1-9]$'
        WHEN 'no-type' THEN COALESCE(BTRIM(profile.enneagram), '') !~ '^[1-9]$'
        ELSE TRUE
      END
      ORDER BY %s %s NULLS LAST, auth_user.id %s
      LIMIT $3
      OFFSET $4
    $query$,
    v_order_expression,
    UPPER(v_sort_direction),
    UPPER(v_sort_direction)
  ) USING v_search, v_filter, v_limit, v_offset;
END;
$$;

REVOKE ALL ON FUNCTION public.get_admin_users_page(TEXT, TEXT, TEXT, TEXT, INTEGER, INTEGER)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_admin_users_page(TEXT, TEXT, TEXT, TEXT, INTEGER, INTEGER)
  TO authenticated, service_role;

CREATE INDEX IF NOT EXISTS idx_profiles_missing_valid_enneagram
  ON public.profiles (created_at DESC)
  WHERE email IS NOT NULL
    AND COALESCE(BTRIM(enneagram), '') !~ '^[1-9]$';
