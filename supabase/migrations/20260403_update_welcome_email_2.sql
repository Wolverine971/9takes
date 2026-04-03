-- supabase/migrations/20260403_update_welcome_email_2.sql
-- Created: 2026-04-03
-- Rewrites welcome sequence Email 2 to use gender-balanced framing.
-- Old version used "She's not acting cold" which assumed a male reader.
-- New version shows both sides: guys misreading girls AND girls misreading guys.
-- See: docs/email-sequences/welcome-email-assessment.md

UPDATE email_sequence_steps
SET
  subject = 'He thinks she''s cold. She thinks he''s needy.',
  html_content = $$<p>Hi {{first_name}},</p>
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
  plain_text = $$Hi {{first_name}},

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
  updated_at = NOW()
WHERE sequence_id = (
  SELECT id FROM email_sequences WHERE key = 'welcome_sequence'
)
AND step_number = 2;
