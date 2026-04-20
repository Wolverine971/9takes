<!-- docs/email-sequences/reactivation-sequence-copy.md -->

# Reactivation Sequence — Email Copy (Draft v1)

**Status:** Directional draft for DJ review
**Created:** 2026-04-20
**Owner:** DJ Wayne
**Related:** [reactivation-sequence-plan.md](./reactivation-sequence-plan.md)

Voice reference: `src/lib/email/welcome-sequence-content.ts` — DJocrates voice. Short paragraphs, declarative, provocative framing, one clear CTA, hook → insight → action.

**Personalization tokens used below:**

- `{{first_name}}` — may be null for signups-table contacts; fallback rendering needed
- `{{signup_month_year}}` — e.g. "November 2024"
- `{{signup_year}}` — e.g. "2024"
- `{{signup_months_ago}}` — e.g. "18"
- `{{questions_url}}` — segment-aware like welcome sequence
- `{{hero_url}}` — `https://9takes.com/community/enneagram-and-mental-illness` (top-traffic; flagged as open question in plan §10)
- `{{re_permission_yes_url}}` — one-click confirm
- `{{re_permission_no_url}}` — one-click off

---

## Email 1 — Re-introduce (bucket-specific)

> **Note:** Email 1 has three subject lines and three opening paragraphs — one per bucket. Body from paragraph 2 onward is identical.

### Subject lines

| Bucket            | Subject                                                                              | Preheader                                                                              |
| ----------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| Cold (30–90d)     | `{{first_name}}, you signed up in {{signup_month_year}}. Here's what 9takes is now.` | One situation, nine ways to see it. Here's the best thread we've had since you joined. |
| Dormant (90–365d) | `You signed up for 9takes in {{signup_month_year}}. Quick re-introduction.`          | It's been a while. Here's what it's become.                                            |
| Zombies (365+d)   | `You signed up for 9takes back in {{signup_year}}.`                                  | I owe you a better intro than the silence you got.                                     |

### Bucket-specific opening paragraph

**Cold opener:**

> You signed up a couple months back, and I want to use the moment to actually show you what 9takes is — not what it was the day you joined.

**Dormant opener:**

> You signed up for 9takes a while ago. I'll be honest: the product on the day you registered was half of what it is now. Here's the short version of what changed.

**Zombies opener:**

> You signed up for 9takes in {{signup_year}}. That's {{signup_months_ago}} months of me not writing to you, which is on me. Before I start, one line of honesty: if this email is a surprise, the unsubscribe link at the bottom works on click one. No guilt, no trick.

### Shared body (all buckets)

> Here's the loop the whole platform runs on:
>
> 1. Pick a question that feels real.
> 2. Answer before seeing what anyone else thinks.
> 3. Compare your read with other people's.
>
> The value is the gap — what you noticed, what other people noticed, what everyone assumed too fast.
>
> The piece I'd start with: [Enneagram and Mental Illness]({{hero_url}}). It's the most-read thing on 9takes and the cleanest example of why I care about this work.
>
> [Answer one live question]({{questions_url}})
>
> More next week — a personal note about why I built this in the first place.
>
> DJocrates
> 9takes.com

### Plain text (shared body, all buckets)

```
Here's the loop the whole platform runs on:

1. Pick a question that feels real.
2. Answer before seeing what anyone else thinks.
3. Compare your read with other people's.

The value is the gap — what you noticed, what other people noticed, what everyone assumed too fast.

The piece I'd start with: Enneagram and Mental Illness. It's the most-read thing on 9takes and the cleanest example of why I care about this work.
{{hero_url}}

Answer one live question: {{questions_url}}

More next week — a personal note about why I built this in the first place.

DJocrates
9takes.com
```

---

## Email 2 — Founder story

> **Send:** +5 days after Email 1
> **Note to DJ:** This is a placeholder. Replace the story paragraph with the real one — the moment that made you build 9takes. 150–250 words total. Plain-text feel.

### Subject & preheader

- **Subject:** `why I'm obsessed with this`
- **Preheader:** `A personal note. 200 words, one reply button.`

### Body

> Quick personal note.
>
> The reason 9takes exists is pattern-recognition, not a product idea. I spent years watching people I loved — friends, family, myself — misread each other with total confidence. Same moment, two completely different internal movies playing. Both people certain they saw it clearly. Both wrong about the other's read.
>
> The Enneagram is the first lens I found that actually decoded the pattern. Not "what personality are you." More like: what are you protecting, what are you scanning for, what assumption are you making about the other person's motive that isn't true.
>
> I don't need you to believe in the Enneagram. I just want you to notice the pattern once. That's the whole pitch.
>
> _[DJ — insert the specific story here. 2–3 sentences. The moment where you saw two people misreading each other and realized the pattern. Keep it concrete. Name the situation. Don't abstract it.]_
>
> If any of that resonates — or disagrees with how you see things — hit reply. I read every response.
>
> DJocrates
> 9takes.com

---

## Email 3 — Provocative take

> **Send:** +7 days after Email 2
> **Voice:** Pattern-recognition Focused. Lift structure from welcome Email 2 ("The 3 questions I ask before I decide someone's being rude").

### Subject & preheader

- **Subject:** `"he thinks she's cold. she thinks he's needy."`
- **Preheader:** `Same moment. Two reads. Which one's yours?`

### Body

> Here's the situation people on 9takes keep circling back to.
>
> Two people texting. She replies within the hour, warm but brief. He reads it as cold. Meanwhile, he takes a day to respond because he's actually thinking about what to say. She reads it as needy-in-reverse — why so dramatic about a text.
>
> Both of them are doing the thing they think is considerate. Both of them are sure the other person started it.
>
> This is the shape of 80% of relationship conflict. Not malice. Not even bad communication. Two different internal rulebooks, neither one labeled.
>
> The 9takes move here isn't "who's right." It's: what were each of them scanning for, and what did they assume the other person meant?
>
> [Read the full thread and add your take]({{questions_url}})
>
> If you've ever been on either side of this one, your read is useful.
>
> DJocrates
> 9takes.com

---

## Email 4 — Re-permission

> **Send:** +7 days after Email 3
> **Voice:** Blunt. Short. No charm.

### Subject & preheader

- **Subject:** `Do you still want emails from 9takes?`
- **Preheader:** `One click either direction.`

### Body

> Short one.
>
> You've gotten three emails from me over the last few weeks after a long stretch of nothing. Fair for me to ask where you want this to land.
>
> [Yes, keep me on the list]({{re_permission_yes_url}})
>
> [No, take me off]({{re_permission_no_url}})
>
> If you say yes, here's what you're opting into: roughly one email every week or two. New questions worth answering. Occasional notes from me. Nothing automated-feeling, nothing daily.
>
> If you say no — no problem. Click once, you're off, we're good.
>
> If you don't click either, I'll take you off the list in a few days to keep things clean.
>
> DJocrates
> 9takes.com

---

## Email 5 — Goodbye

> **Send:** +5 days after Email 4, only to non-clickers
> **Voice:** Short, final, one-link rescue

### Subject & preheader

- **Subject:** `You've been unsubscribed from 9takes.`
- **Preheader:** `Easy to reverse if that's wrong.`

### Body

> You didn't click yes or no on the last one, so I took you off the list.
>
> No hard feelings. Inbox space is real.
>
> If that was the wrong call, [put me back on]({{re_permission_yes_url}}).
>
> Either way — good luck out there.
>
> DJocrates
> 9takes.com

---

## Review checklist for DJ

Before this copy gets converted into the TypeScript content module:

- [ ] **Email 2 story** — fill in the concrete personal story (2–3 sentences). This is the one email I couldn't draft without you.
- [ ] **Hero content choice** — confirm `enneagram-and-mental-illness` for Email 1, or swap to a question thread / celebrity analysis.
- [ ] **Example in Email 3** — the "he thinks she's cold / she thinks he's needy" example: is there a real 9takes thread this maps to? If yes, link that specific thread instead of the generic questions URL.
- [ ] **Cadence promise in Email 4** — "one email every week or two" — set the real expectation. Is there a post-reactivation newsletter plan, or is this just "whenever DJ writes"?
- [ ] **Zombie opener tone** — the "one line of honesty" framing is unusual. Does it feel right or too apologetic?
- [ ] **Signoff consistency** — sticking with `DJocrates / 9takes.com` to match welcome sequence. Confirm.
- [ ] **Voice pass** — any of these lines feel off-brand or marketing-flavored? Mark for rewrite.

---

## Appendix A — Altered flow for `signups`-table contacts

### Context

The 38 rows in the `signups` table are email-only leads — no account, no `profiles` row. They came in via blog-page signup forms (`EnneagramCTASidebar`, `Email-Signup` components). The CTAs they clicked promised **content updates**, not access to the Q&A platform:

- "Get the next personality breakdown by email"
- "Get enneagram guides by email"
- "Get enneagram mental health guides by email"
- "Get type-by-type enneagram insights by email"
- "Get new pop culture personality reads by email"
- "Get the next community take by email"
- "Get practical psychology guides by email"
- Generic: "Get enneagram insights by email. No account required."

They got one welcome email and nothing since. The existing `signupWelcomeEmail` copy (in `src/emails/index.ts:471`) said "You are on the 9takes update list" and pointed at questions, enneagram corner, and personality analyses.

### Why the main flow needs to change for them

The draft Email 1 above opens with _"Here's the loop the whole platform runs on: answer before seeing what anyone else thinks…"_ — that's pitching the Q&A platform mechanic. A signups contact never asked for that. They asked for **new writing**. Pushing the platform loop at them feels like a bait-and-switch from what they opted into.

**Two changes only. Everything else stays shared with the `profiles` flow:**

1. **Email 1 opener** — single variant regardless of bucket. Content-led, not platform-led.
2. **Email 3 CTA** — swap the `{{questions_url}}` link for a second piece of content (another hero blog). They're not here for live threads.

Emails 2, 4, and 5 work as-is for signups. The founder note (Email 2) is even more relevant here — they signed up for writing from someone, and this is the note from that someone. The re-permission (Email 4) and goodbye (Email 5) are source-agnostic.

### Signups Email 1 — replacement copy

**Subject:** `Quick note on the emails you signed up for`
**Preheader:** `You're on the 9takes update list. Here's what's worth reading first.`

**Body:**

> You signed up for 9takes emails back in {{signup_month_year}} — you probably came in off a blog post or a personality breakdown. I sent you one welcome note and then went quiet, which isn't what you asked for. Starting this week, that's changing.
>
> The most-read thing on 9takes right now is ["Enneagram and Mental Illness"]({{hero_url}}). If you signed up because the psychology side of this stuff interests you, that's the place to start. It's the cleanest example of what I mean by "pattern-recognition, not personality tests."
>
> More next week — a personal note about why I'm obsessed with this in the first place. After that, one Enneagram piece per week or two, roughly.
>
> If this isn't what you want in your inbox, the unsubscribe at the bottom works on one click. I'd rather lose you than mis-serve you.
>
> DJocrates
> 9takes.com

**Plain text:**

```
You signed up for 9takes emails back in {{signup_month_year}} — you probably came in off a blog post or a personality breakdown. I sent you one welcome note and then went quiet, which isn't what you asked for. Starting this week, that's changing.

The most-read thing on 9takes right now is "Enneagram and Mental Illness". If you signed up because the psychology side of this stuff interests you, that's the place to start. It's the cleanest example of what I mean by "pattern-recognition, not personality tests."
{{hero_url}}

More next week — a personal note about why I'm obsessed with this in the first place. After that, one Enneagram piece per week or two, roughly.

If this isn't what you want in your inbox, the unsubscribe at the bottom works on one click. I'd rather lose you than mis-serve you.

DJocrates
9takes.com
```

### Signups Email 3 — altered CTA

Email 3's body is the same ("he thinks she's cold. she thinks he's needy."), but the closing CTA swaps from questions to a second piece of content.

**Replace this line:**

> [Read the full thread and add your take]({{questions_url}})

**With (for signups):**

> There's a longer write-up on exactly this dynamic: ["How Minds Actually Change on 9takes"]({{secondary_content_url}}). If the text-pattern example above tracks for you, that piece takes it further.

**New token needed:** `{{secondary_content_url}}` — default `https://9takes.com/community/how-minds-change-on-9takes` (or similar; DJ to choose). For `profiles` contacts this token isn't used (they get the questions CTA unchanged).

### Bucket behavior for signups

Signups still get bucketed into Cold / Dormant / Zombies by `created_at` age, and the batch schedule (plan §9) applies to them the same way. Only the content of Email 1's opener and Email 3's CTA differ — bucket still drives timing and warmup batching.

At 38 signups, the likely distribution roughly mirrors the overall campaign: a few in Cold, most in Dormant or Zombies. The bucket query will confirm.

### Rollout checklist for signups

- [ ] Confirm the signups Email 1 opener reads right — does "you signed up for the emails" feel honest given the only-one-email history?
- [ ] Pick the `{{secondary_content_url}}` — second hero blog for Email 3 signups variant.
- [ ] Decide: should signups get the re-permission Email 4 framed differently? Current version says "You've gotten three emails from me over the last few weeks after a long stretch of nothing." That's accurate for signups too. Keep as-is unless DJ sees a mismatch.

---

## Changelog

- **2026-04-20 (PM)** — Added Appendix A: altered flow for `signups`-table contacts. Two-email divergence (Email 1 opener + Email 3 CTA) with rest shared.
- **2026-04-20** — Initial draft v1. Email 2 personal story left as placeholder. All other copy directional, written in welcome-sequence voice.
