<!-- docs/email-sequences/signups-reengagement-flow.md -->

# Signups Re-engagement Flow — Plan

**Status:** Spec / Pre-build
**Created:** 2026-04-20
**Owner:** DJ Wayne
**Related:** [reactivation-sequence-plan.md](./reactivation-sequence-plan.md) · [reactivation-implementation-spec.md](./reactivation-implementation-spec.md)

Separate path from the main reactivation sequence. The `signups`-table contacts opted into **content updates**, not the Q&A platform — they deserve a flow that honors that promise.

---

## 1. Context

### Who these are

The 38 rows in the `signups` table are email-only leads. They came in via blog-page signup forms:

- `src/lib/components/blog/EnneagramCTASidebar.svelte` — floating sidebar on blog pages
- `src/lib/components/molecules/Email-Signup.svelte` — embedded component
- `src/lib/components/molecules/Email-Invite.svelte` — invite variant

The CTA they clicked promised **content updates**, especially future blog/personality-analysis material — page-specific copy like:

- "Get the next breakdown" / "Celebrity types, relationship patterns, and plain-English Enneagram context." (personality-analysis sidebar)
- "Get the next personality breakdown by email" (personality-analysis)
- "Get enneagram mental health guides by email" (enneagram-mental-health)
- "Get type-by-type enneagram insights by email" (enneagram-type)
- "Get new pop culture personality reads by email" (pop-culture)
- "Get the next community take by email" (community)
- "Get practical psychology guides by email" (how-to-guides)

They got one welcome email (`signupWelcomeEmail` in `src/emails/index.ts:471`) that said "You are on the 9takes update list" — and nothing since.

### Code trace: what they actually signed up for

- `src/lib/components/blog/enneagramSidebarCopy.ts` maps blog paths to content-led promises like "Get the next breakdown", "Get new culture reads", "Get the next reader take", and "Get practical people guides".
- `src/lib/components/blog/EnneagramCTASidebar.svelte` renders that copy and submits the email to `/email?/submit`.
- `src/lib/components/molecules/Email-Signup.svelte` uses default copy of "Get 9takes updates in your inbox" and is embedded on personality-analysis, Enneagram, pop-culture, community, and how-to pages.
- `src/routes/email/+page.server.ts` handles `/email?/submit`, inserts a row in `signups`, and sends `signupWelcomeEmail()`.

So these contacts are **warm content leads**. They asked to hear when the next relevant 9takes/personality-analysis piece comes out. They did not create an account, enter the Q&A product, or ask for platform onboarding.

### Why this is a separate path (not the reactivation sequence)

Three reasons:

1. **Different promise.** Signups opted into content, not platform engagement. The reactivation sequence's "here's the Q&A loop" framing is misaligned.
2. **Different infrastructure fit.** `email_sequence_enrollments.user_id` is `UUID NOT NULL` — signups don't have auth UUIDs. Keeping them off the sequence engine entirely (**Option C from implementation-spec §1.1**) avoids touching welcome-sequence schema.
3. **Different opportunity.** At 38 contacts, this is the ideal moment to capture content preferences. The reactivation sequence is about winning back; this is about tuning what we send going forward.

---

## 2. Flow structure

**2 emails + silent sunset.** Decided 2026-04-20.

| #   | Day | Purpose                                                                                                                                                        | Voice             |
| --- | --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| 1   | T+0 | **Content ping.** Honor the original promise — here's new + recently updated blogs. No ask beyond "read this."                                                 | Warm, content-led |
| 2   | +7  | **Questionnaire invite.** "2 quick questions to make these emails worth your inbox." Link to the preferences form.                                             | Curious, direct   |
| —   | +21 | **Silent sunset.** Anyone who didn't click any link or submit the questionnaire → added to `email_unsubscribes` with a dormant-lapse reason. No goodbye email. | —                 |

**Why no re-permission and no goodbye email:** signups never had heavy engagement to retire, and they opted into content that didn't reliably arrive. A third email after two that didn't land just adds noise. Silent sunset is cleaner. Engagement with either email counts as re-permission.

---

## 3. Email 1 — Content ping

**Send:** Manual, via admin (one-off; 38 contacts doesn't justify automation).

**Subject:** `Quick note about the 9takes emails you signed up for`
**Preheader:** `You're on the list. Here's what's worth reading first.`

### Body sketch

> You signed up for 9takes emails back in {{signup_month_year}} — you came in off a blog post or a personality piece. I sent you one welcome note and then went quiet, which isn't what you asked for. Starting this week, that's changing.
>
> Three things worth reading right now, in order of traffic:
>
> 1. [Enneagram and Mental Illness]({{blog_1_url}}) — the most-read thing on 9takes. Type-by-type look at anxiety, burnout, and emotional patterns.
> 2. [{{blog_2_title}}]({{blog_2_url}}) — {{blog_2_one_liner}}
> 3. [{{blog_3_title}}]({{blog_3_url}}) — {{blog_3_one_liner}}
>
> Next email in a week: two quick questions so the writing I send you is actually what you want. If the answer is "stop emailing me," the unsubscribe at the bottom works on one click.
>
> DJocrates
> 9takes.com

### Content selection logic

For this send, DJ hand-picks 3 pieces:

- **#1 — always:** top-traffic evergreen (currently `enneagram-and-mental-illness`).
- **#2 — recent:** most-recent published blog (from `blogs_content` or `blogs_famous_people` ordered by `published_at DESC`).
- **#3 — variety:** a piece from a different category than #2. Personal pick.

Not worth automating selection for 38 contacts one-time. Future sends to the questionnaire-segmented list can be more mechanical.

---

## 4. Email 2 — Questionnaire invite

**Send:** 7 days after Email 1, to all signups (not just non-clickers of Email 1 — the questionnaire is universally useful).

**Subject:** `Two quick questions to tune your 9takes emails`
**Preheader:** `90 seconds. You tell me what you want, I send that.`

### Body sketch

> Follow-up from last week.
>
> I want to get better at making 9takes emails actually land — which means I need to hear what you'd want more of. Four questions, takes about 90 seconds:
>
> [Take the 90-second survey]({{preferences_url}})
>
> Topics you care about, how often you want to hear from me, whether you know your Enneagram type (no problem if you don't). Your answers go straight to me and shape what I send next.
>
> If this isn't landing in your inbox the way you'd hoped, the unsubscribe link below is there. No wrong answer.
>
> DJocrates
> 9takes.com

### `{{preferences_url}}` structure

Unique-token link: `https://9takes.com/preferences/{{token}}`

Token pattern: reuse the existing `signups.unsubscribe_id` + `unsubscribe_iv` pair (already generated for unsubscribe links). Pre-fills the form with the signup's email/identity. Alternative: issue a fresh token at send time stored on a new table.

---

## 5. The questionnaire (hybrid design)

Decided 2026-04-20: **hybrid** — topics + goals + type + frequency.

### Questions

**Q1. What drew you to 9takes in the first place?** _(multi-select, optional)_

- [ ] Curiosity about myself
- [ ] Understanding people in my life
- [ ] Navigating relationships (romantic, family, work)
- [ ] Pop culture / celebrity reads
- [ ] Mental health patterns
- [ ] Just kind of stumbled in

**Q2. Which topics do you want more of?** _(multi-select, required)_

- [ ] Personality analysis (celebrities, public figures)
- [ ] Enneagram guides (type-by-type)
- [ ] Enneagram + mental health
- [ ] Pop culture takes
- [ ] Relationship dynamics
- [ ] Practical how-to guides
- [ ] Community questions / multi-perspective threads

**Q3. Do you know your Enneagram type?** _(single-select, required)_

- ( ) Yes — I'm type **\_** (1/2/3/4/5/6/7/8/9)
- ( ) I think so but not certain
- ( ) No idea, haven't looked into it
- ( ) I don't care about typing, I'm here for the writing

**Q4. How often do you want to hear from 9takes?** _(single-select, required)_

- ( ) Weekly
- ( ) Every 2 weeks
- ( ) Monthly
- ( ) Only when something big drops

**Q5. Anything you'd want to see more of that isn't above?** _(free text, optional)_

---

### Why these questions (strategic layer)

- **Q1 (goals)** — tells DJ _why_ people are here. Shapes content strategy, not just per-user sends. Gold for planning next quarter's editorial direction.
- **Q2 (topics)** — direct segmentation. Can literally filter future sends by this.
- **Q3 (Enneagram type)** — unlocks "your type would probably care about this" sends. Also tells DJ the ratio of Enneagram-believers vs. just-here-for-the-writing types — meaningful for positioning.
- **Q4 (frequency)** — respects their inbox. Reduces unsubscribes. Any answer here = explicit re-permission.
- **Q5 (free text)** — reply-rate equivalent. Where the real signal lives when anyone bothers.

---

## 6. Data model

### New table

```sql
CREATE TABLE content_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL CHECK (source IN ('signups', 'profiles')),
  source_id TEXT NOT NULL,
  email TEXT NOT NULL,
  goals TEXT[] DEFAULT '{}',
  topics TEXT[] DEFAULT '{}',
  enneagram_type TEXT,        -- '1'..'9' | 'unsure' | 'none' | 'dontcare'
  frequency TEXT CHECK (frequency IN ('weekly', 'biweekly', 'monthly', 'major_only')),
  free_text TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (source, source_id)
);

CREATE INDEX idx_content_preferences_email ON content_preferences (LOWER(email));
CREATE INDEX idx_content_preferences_topics_gin ON content_preferences USING GIN (topics);
```

### Why this shape

- **`(source, source_id)` polymorphic reference** — same table serves `signups` (int id cast to text) and `profiles` (UUID cast to text). No separate tables needed when we extend to profile users later.
- **`goals` + `topics` as TEXT[]** — easy to query (`WHERE 'pop_culture' = ANY(topics)`), no JOINs needed. GIN index for fast multi-select filtering.
- **`UNIQUE (source, source_id)`** — one preferences row per person. Re-submit updates, not duplicates.
- **No FK to signups/profiles** — intentional. Lets us keep preferences even if a signup row is deleted. Email stored redundantly for that reason.

### Canonical value lists (centralize in code)

```ts
// src/lib/content/preferences.ts
export const TOPICS = [
	'personality_analysis',
	'enneagram_guides',
	'enneagram_mental_health',
	'pop_culture',
	'relationships',
	'how_to_guides',
	'community_questions'
] as const;

export const GOALS = [
	'self_curiosity',
	'understanding_others',
	'navigating_relationships',
	'pop_culture',
	'mental_health',
	'stumbled_in'
] as const;
```

Use these on both the form and the server to validate.

---

## 7. Implementation — in-house Svelte page

### 7.1 — Route structure

| Path                                                               | Purpose                                                 |
| ------------------------------------------------------------------ | ------------------------------------------------------- |
| `src/routes/preferences/[token]/+page.server.ts`                   | Validate token, load signup/profile, serve form         |
| `src/routes/preferences/[token]/+page.svelte`                      | The form UI (Svelte 5 runes)                            |
| `src/routes/preferences/[token]/+page.server.ts` — `submit` action | Validate, insert/update `content_preferences`, redirect |
| `src/routes/preferences/thanks/+page.svelte`                       | Confirmation landing                                    |

### 7.2 — Token strategy

**Option 1 (recommended):** Reuse the existing `signups.unsubscribe_id` + `unsubscribe_iv` pair for signups. Already generated, already signed. Token looks like `sig_{{id}}_{{unsubscribe_id}}` or similar — match the pattern already used at `src/routes/account/unsubscribe/[slug]/`.

**Option 2:** Issue a new short-lived signed JWT at send time. More secure (can expire), more infrastructure. Overkill for 38 users.

Look at `src/routes/account/unsubscribe/[slug]/+page.server.ts` to mirror the pattern.

### 7.3 — Form UI behavior

- Pre-fill email (read-only, displayed for confirmation)
- All multi-select questions use checkboxes, not dropdowns (faster perception, more-clickable)
- `required` enforced client-side and server-side for Q2, Q3, Q4
- Submit → redirect to `/preferences/thanks` with a light confetti-or-nothing confirmation
- If the token has an existing preferences row, pre-fill the form and flip the header to "Update your preferences"

### 7.4 — Admin visibility

New admin view: `/admin/email-dashboard/preferences` (or similar) — tabular display of all submitted preferences with filters. Not blocking launch — can ship in a follow-up.

### 7.5 — Re-permission as side effect

Submitting the form is an explicit act of re-permission. On submit:

1. Insert/update `content_preferences`
2. If the email is in `email_unsubscribes`, REMOVE it (they're actively opting in)
3. Mark the signup as engaged (track `last_engaged_at` on `signups` — new column)

---

## 8. Sunset logic (silent)

**Trigger:** 21 days after Email 2 sent.

**Logic (daily cron or one-off script):**

```sql
-- Pseudo: find signups who were sent Email 1 or Email 2 but never clicked, opened, or submitted
WITH engaged AS (
  SELECT DISTINCT email FROM email_events
  WHERE event_type IN ('click', 'open')
    AND sent_at > '2026-04-XX'  -- campaign start
  UNION
  SELECT email FROM content_preferences WHERE source = 'signups'
)
INSERT INTO email_unsubscribes (email, reason, source)
SELECT LOWER(TRIM(s.email)), 'signups_reengagement_no_response', 'signups'
FROM signups s
WHERE s.email IS NOT NULL
  AND s.unsubscribed_date IS NULL
  AND LOWER(TRIM(s.email)) NOT IN (SELECT email FROM engaged)
  AND NOT EXISTS (SELECT 1 FROM email_unsubscribes u WHERE LOWER(TRIM(u.email)) = LOWER(TRIM(s.email)));
```

Run once manually after the campaign window closes. Not worth automating for 38 contacts.

---

## 9. File change summary

| Path                                                                         | Action            | Purpose                                                               |
| ---------------------------------------------------------------------------- | ----------------- | --------------------------------------------------------------------- |
| `supabase/migrations/20260421_content_preferences.sql`                       | NEW               | Table + indexes                                                       |
| `src/lib/content/preferences.ts`                                             | NEW               | Canonical value lists (topics, goals)                                 |
| `src/routes/preferences/[token]/+page.server.ts`                             | NEW               | Load + submit                                                         |
| `src/routes/preferences/[token]/+page.svelte`                                | NEW               | Form UI (Svelte 5 runes)                                              |
| `src/routes/preferences/thanks/+page.svelte`                                 | NEW               | Confirmation                                                          |
| `src/emails/index.ts` or new `src/lib/email/signups-reengagement-content.ts` | NEW/MODIFY        | Content ping + questionnaire invite templates                         |
| `src/routes/admin/email-dashboard/+page.server.ts`                           | MODIFY            | Add "Send signups content ping" + "Send questionnaire invite" actions |
| `src/routes/email/+page.server.ts`                                           | MODIFY (optional) | Reuse existing bulk-send pattern or add dedicated action              |
| `docs/email-sequences/README.md`                                             | MODIFY            | Link this doc                                                         |

**Total new files:** 5–6. **Modifications:** 2–3. Smaller PR than the main reactivation sequence.

---

## 10. Execution order

1. ✅ DJ locked: hybrid questionnaire, 2-email flow, in-house form (2026-04-20).
2. DJ runs pre-launch action items (list validation for signups emails specifically — 38 addresses, cheap).
3. Build migration + preferences route + email templates (one PR).
4. Pick the 3 hero pieces for Email 1 content ping.
5. Send Email 1 manually via admin → 38 signups.
6. Monitor for 7 days (opens, clicks, any replies).
7. Send Email 2 manually → 38 signups.
8. Let the preferences form collect submissions for 21 days.
9. Run sunset query. Suppress non-responders.
10. Use the preferences data to drive ongoing content sends.

---

## 11. Decisions locked (2026-04-20)

- ✅ Separate path from reactivation sequence (Option C in reactivation-implementation-spec.md §1.1)
- ✅ 2 emails + silent sunset (no re-permission email, no goodbye email)
- ✅ Hybrid questionnaire: topics + goals + type + frequency + optional free text
- ✅ In-house Svelte page + Supabase `content_preferences` table
- ✅ Token pattern: reuse existing `signups.unsubscribe_id`

## 12. Open questions

- **Email 1 content slots** — which 3 pieces? #1 is `enneagram-and-mental-illness` (locked). #2 and #3 TBD at send time.
- **Admin preferences dashboard** — ship in initial PR or follow-up? Recommend follow-up to keep PR tight.
- **Frequency enforcement** — once someone says "monthly," what mechanism ensures they get monthly sends? Is there a scheduled send system, or is it enforced by DJ's manual cadence for now? Recommend manual for now; formalize if preferences grow beyond 50 people.

---

## 13. Changelog

- **2026-04-20** — Initial spec. All three strategic decisions locked via structured decision. Ready for build.
