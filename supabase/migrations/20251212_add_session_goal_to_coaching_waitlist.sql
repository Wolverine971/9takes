-- supabase/migrations/20251212_add_session_goal_to_coaching_waitlist.sql
-- Capture what people want from coaching during signup

-- Add the new column to store the coaching goal/intent
ALTER TABLE public.coaching_waitlist
ADD COLUMN IF NOT EXISTS session_goal TEXT;

-- Recreate the convenience view (drop first to allow column/name changes)
DROP VIEW IF EXISTS public.coaching_waitlist_view;
CREATE VIEW public.coaching_waitlist_view AS
SELECT
  cw.created_at,
  cw.email,
  cw.enneagram_type,
  cw.id,
  cw.name,
  cw.session_goal,
  cwm.source,
  cwm.utm_campaign,
  cwm.utm_content,
  cwm.utm_medium
FROM public.coaching_waitlist cw
LEFT JOIN public.coaching_waitlist_metadata cwm ON cwm.waitlist_id = cw.id;
