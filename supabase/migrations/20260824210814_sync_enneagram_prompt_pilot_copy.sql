-- supabase/migrations/20260824210814_sync_enneagram_prompt_pilot_copy.sql
-- Keep the database-side review copy aligned with the code-managed pilot.
-- The sender still resolves this sequence from
-- src/lib/email/enneagram-type-prompt-content.ts at delivery time.

UPDATE public.email_sequence_steps AS step
SET
  subject = 'Make 9takes more useful to you',
  html_content = $html$<p>Hi {{first_name}},</p>
<p>9takes gets more interesting when the same question is answered from nine different perspectives. If we know your Enneagram type, we can place your take in that conversation and show you where the other types see it differently.</p>
<p>If you already know your number, adding it takes less than a minute.</p>
<p style="margin:20px 0;"><a class="button" href="https://9takes.com/account">Add my type</a></p>
<p>Not sure yet? Use the <a href="https://9takes.com/enneagram-corner/beginners-guide-to-determining-your-enneagram-type">10-minute guide to finding your starting point</a>. No quiz score gets to decide for you—choose the pattern you recognize in yourself.</p>
<p>DJ<br />9takes</p>$html$,
  plain_text = $text$Hi {{first_name}},

9takes gets more interesting when the same question is answered from nine different perspectives. If we know your Enneagram type, we can place your take in that conversation and show you where the other types see it differently.

If you already know your number, adding it takes less than a minute.

Add my type:
https://9takes.com/account

Not sure yet? Use the 10-minute guide to finding your starting point:
https://9takes.com/enneagram-corner/beginners-guide-to-determining-your-enneagram-type

No quiz score gets to decide for you—choose the pattern you recognize in yourself.

DJ
9takes$text$,
  updated_at = NOW()
FROM public.email_sequences AS sequence
WHERE step.sequence_id = sequence.id
  AND sequence.key = 'enneagram_type_prompt'
  AND step.step_number = 1;

UPDATE public.email_sequences
SET
  description = 'One-email invitation for confirmed registered users who still lack an Enneagram type. Variant A is the current pilot; candidate variants remain review-only until a cohort is approved.',
  updated_at = NOW()
WHERE key = 'enneagram_type_prompt';
