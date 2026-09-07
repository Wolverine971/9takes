-- supabase/migrations/20260906121000_starter_set_and_pins_data.sql
-- Created: 2026-09-06
--
-- DATA migration: the first "Start here" set and the pinned reveal trio for
-- each starter. Depends on 20260906120100_question_starters_and_pins.sql
-- (adds questions.starter_rank, questions.pinned_comment_ids).
--
-- Why these five (see docs/product/2026-09-06-engagement-brainstorm-response.md):
-- the front door should be light and specific, then step down. Production data
-- says the most-answered question in site history is "kid in 3 words" (38),
-- while the deep homepage question (567) draws one-word toll answers from cold
-- visitors. Ladder: instant -> playful -> relational -> deep -> deepest.
--
-- Why these pins: three answers per question chosen because they see it
-- DIFFERENTLY (distinct emotional logic), not because they are the best.
-- Every pinned id was verified non-removed and top-level on 2026-09-06.
-- DJ can change any of this from /admin/questions; nothing here is load-bearing.

BEGIN;

-- Reset any previous starter set so ranks stay unique.
UPDATE public.questions SET starter_rank = NULL WHERE starter_rank IS NOT NULL;

-- 1. what were you like as a kid in 3 words
--    375 "Shy considerate silly" (the quiet kid)
--    372 "energetic stubborn and my mom called me a devil" (the wild kid)
--    661 "never a child, always thought very logically" (the old soul)
UPDATE public.questions
SET starter_rank = 1, pinned_comment_ids = ARRAY[375, 372, 661]::BIGINT[]
WHERE id = 118;

-- 2. if you had to be trapped somewhere where would you choose
--    662 big supermarket, you'd be found fast (provision + safety logic)
--    602 a room with a genie so I can wish my way out (loophole logic)
--    388 my parents' pantry (comfort logic)
UPDATE public.questions
SET starter_rank = 2, pinned_comment_ids = ARRAY[662, 602, 388]::BIGINT[]
WHERE id = 119;

-- 3. what's your criteria for considering someone a friend
--    640 "they need to be able to handle my intensity" (I set the terms)
--    660 authenticity, few friends, high bar (depth over breadth)
--    726 they know what's happening in my life and show they care (attention)
UPDATE public.questions
SET starter_rank = 3, pinned_comment_ids = ARRAY[640, 660, 726]::BIGINT[]
WHERE id = 203;

-- 4. what's your biggest fear
--    633 losing my friends and the group chat dying (belonging)
--    668 not being up to the task, not worthy of success (worth)
--    474 "Public embarrassment." (shame, and proof two words is a fine answer)
UPDATE public.questions
SET starter_rank = 4, pinned_comment_ids = ARRAY[633, 668, 474]::BIGINT[]
WHERE id = 137;

-- 5. what's something you do every day to seem fine that nobody knows is costing you effort
--    702 watching who is left out and drawing them in (caretaking)
--    703 telling myself to push through, I'll rest later (endurance)
--    719 "not consciously aware of doing anything... except physical pain?" (denial with a crack)
UPDATE public.questions
SET starter_rank = 5, pinned_comment_ids = ARRAY[702, 703, 719]::BIGINT[]
WHERE id = 567;

-- Time-bound / political prompts out of browse (the brainstorm's "old election
-- and year-specific prompts"). 98 and 168 are handled in the schema migration.
--   172 main fear with Trump getting elected
--   197 the murder of Charlie Kirk
--   206 real objective of the US war with Iran
--   166 biggest lesson learned this year 2024
UPDATE public.questions
SET flagged = TRUE
WHERE id IN (172, 197, 206, 166) AND flagged IS NOT TRUE;

-- Moderation on starter pages (soft delete; strike any line to keep it):
--   515, 516  DJ's own bare Quora/Mumsnet research links posted as answers on 118
--   638, 639  meta-complaints on 203 ("how do i put my question into a category",
--             "stop blogging and attend to the social part of your site");
--             the same user's real answer, 637, stays.
UPDATE public.comments
SET removed = TRUE, removed_at = NOW()
WHERE id IN (515, 516, 638, 639) AND removed IS NOT TRUE;

-- Homepage fallback stays on 567 for now. Swapping it to the lightest starter
-- (118) is the recommended next step, but /api/nine/mirror requires a complete
-- nine-take chorus and is_question_chorus_ready(118) is FALSE as of 2026-09-06.
-- Follow-up: generate the chorus for 118 (pnpm gen:chorus), then call
-- public.set_homepage_fallback_question(118) from the admin tooling.

COMMIT;
