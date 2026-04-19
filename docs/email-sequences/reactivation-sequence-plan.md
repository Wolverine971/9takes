<!-- docs/email-sequences/reactivation-sequence-plan.md -->

# Reactivation Email Sequence — Plan

**Status:** Spec / Draft
**Owner:** DJ Wayne
**Created:** 2026-04-18
**Target ship:** TBD (blocked on pre-launch action items — see §9)

---

## 1. Context

A large share of 9takes signups predate the welcome sequence and have never received any follow-up email. This plan specs a **reactivation / win-back sequence** to re-introduce 9takes, share what's grown, and give dormant users a reason to come back — or a clean way to leave.

### Audience size (current snapshot)

| Source                              | Count    | Notes                                                    |
| ----------------------------------- | -------- | -------------------------------------------------------- |
| `profiles` (registered users)       | 136      | Has `created_at`, `first_name`, `enneagram`              |
| `signups` (email-only, no account)  | 38       | Email list, fewer personalization fields                 |
| **Total candidates**                | **~174** | Before dedupe + suppression + welcome-sequence exclusion |
| Already received welcome sequence   | ~10–15   | Exclude from reactivation                                |
| **Estimated reactivation-eligible** | **~160** |                                                          |

Because the list is small, **deliverability warm-up concerns are minimal** (Gmail API limits are not a constraint at this scale), but **list validation matters more than usual** — a handful of bad addresses is a meaningful complaint-rate percentage on a send of 50–100.

### Explicit non-goals

- **No coaching / consultation CTAs.** This sequence is purely content-driven re-engagement.
- Not a newsletter replacement — one-time sequence, sunsets non-engagers at the end.

---

## 2. Goals & success metrics

### Primary goals

1. Re-introduce dormant users to what 9takes has become.
2. Reactivate a meaningful slice (target: 5–15% engagement — industry "good" range).
3. Clean the list — anyone who doesn't engage after 4 emails should be suppressed so future sends are healthier.

### Success metrics

| Metric                              | Healthy                              | Danger                        |
| ----------------------------------- | ------------------------------------ | ----------------------------- |
| Open rate (dormant list)            | 8–15%                                | <5%                           |
| Click rate                          | 1–3%                                 | <0.5%                         |
| Unsubscribe rate                    | 0.5–2% (expected higher than normal) | >3%                           |
| Spam complaints                     | **<0.1%**                            | >0.3% = pause immediately     |
| Hard bounce rate                    | <0.5%                                | >2% = list-validation failure |
| Reply rate on founder email         | 1–5%                                 | —                             |
| Overall winback (clicked + visited) | 5–15%                                | <2% = list is dead            |

Complaint rate must be **monitored after every batch**, not at end-of-campaign. Gmail's 2026-era rules (carryover from 2024+) can torch domain reputation in hours on a stale list.

---

## 3. Audience segmentation — three buckets

Bucketing is by **signup age as of campaign start**. Bucket drives only the **framing of Email 1**; the rest of the sequence is the same content across all three buckets.

| Bucket      | Signup age  | Approx count (TBC) | Email 1 framing                                                                                                                                                   |
| ----------- | ----------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cold**    | 30–90 days  | ?                  | "Welcome back — here's what's new since you signed up on [date]." Growth story fits naturally here.                                                               |
| **Dormant** | 90–365 days | ?                  | "It's been a while — here's what 9takes has become." Classic "here's what you missed" play.                                                                       |
| **Zombies** | 365+ days   | ?                  | **Lead with re-permission honesty.** "You signed up [X months] ago. Still want to be here? Here's what you'd get if yes." Treat as consent renewal, not win-back. |

**Excluded from the campaign entirely:**

- Users in the welcome sequence (still active or within last 14 days of completion)
- Anyone in `email_unsubscribes` or with `unsubscribed_date`
- Hard bounces or past complaints (once bounce tracking is in place — see §9 action item)
- Users under 30 days old (still fresh; welcome sequence is their onboarding)

---

## 4. Sequence structure

**4 emails + 1 goodbye.** Cadence: ~24 days end-to-end.

| #   | Day | Purpose                                                                                 | Voice              | Length        |
| --- | --- | --------------------------------------------------------------------------------------- | ------------------ | ------------- |
| 1   | T+0 | Re-introduce + 1 specific piece of signature content. Signup-date personalization.      | Warm, direct       | 200–300 words |
| 2   | +5  | **Founder story.** Why DJ built 9takes, why the Enneagram obsession. Plain-text styled. | Personal, DJ-voice | 150–250 words |
| 3   | +7  | One provocative Enneagram take or "9 ways people see X" teaser → CTA to questions.      | Tactically direct  | 150–200 words |
| 4   | +7  | **Re-permission.** "Do you still want emails from 9takes?" One-click confirm.           | Blunt, short       | 75–125 words  |
| 5   | +5  | Goodbye to non-clickers. "You've been unsubscribed from 9takes."                        | Short, final       | 50–75 words   |

### Why this structure

- **3–5 emails, 5–7 days apart** is the research consensus (Inbox Collective's documented 3-email campaign won back 18.3% of an inactive list).
- **Re-permission lands in slot 4, not slot 1.** Validity data: re-permission emails get ~1.8% read rate if sent cold, but ~64% CTR when sent after 3 value-first emails. Never lead with it.
- **Founder story in slot 2** rather than slot 1 because the first email needs to prove 9takes still exists and has something worth reading before asking for emotional buy-in.
- **Goodbye email** sometimes reactivates 8–15% at the last moment; and for those it doesn't, it cleanly closes the loop.

---

## 5. Email-by-email spec

> Copy is directional, not final. DJ to write/edit each one in his voice.

### Email 1 — Re-introduce (framing varies by bucket)

**Subject (Cold):** `Hey {{first_name}} — been a minute since {{signup_month}}`
**Subject (Dormant):** `You signed up for 9takes in {{signup_month_year}} — here's what it's become`
**Subject (Zombies):** `You signed up for 9takes back in {{signup_year}}` _(or re-permission lead — see §4)_

**Preheader:** `One situation, nine ways to see it. Here's the best thing we've published since.`

**Body sketch:**

- Greet by first name. Call out the signup date specifically (not vague "a while ago").
- One sentence: remind them what 9takes is.
- "Here's what's new / what you missed" — **reader-centric framing**, not platform-centric:
  - Bad: "9takes has grown 10x."
  - Good: "Since you signed up, [specific thing readers can engage with now]."
- Link to ONE hero piece of content. Options:
  - Top traffic blog (`enneagram-and-mental-illness`)
  - A provocative Q&A thread
  - A celebrity personality analysis
- Single CTA. No kitchen-sink links.

**Personalization tokens needed:**

- `{{first_name}}`, `{{signup_date}}`, `{{signup_month}}`, `{{signup_month_year}}`, `{{signup_year}}`
- `{{enneagram}}` (optional — only fire if set)

### Email 2 — Founder story

**Subject:** `why I'm obsessed with this` _(lowercase, plain-feeling)_
**Preheader:** `A personal note from DJ.`

**Body sketch (DJ writes):**

- Plain-text styled (no big headers, no images).
- Why you built 9takes. The moment / problem that made you start.
- Why the Enneagram matters to you personally — one specific story, one insight, one "I didn't expect this" beat.
- Acknowledge that Enneagram skepticism is fair. One line: "I'm not asking you to believe in it. I'm asking you to notice the pattern once."
- Soft CTA: "If you ever want to tell me what shaped how you see things, just reply."
- Reply rate is a key signal here — keep the ask low-friction.

**Length:** 150–250 words. Shorter wins. Anything over 300 flops.

### Email 3 — Provocative take / hook

**Subject:** `"he thinks she's cold. she thinks he's needy."` _(or similar — lift from existing welcome sequence pattern)_
**Preheader:** `Same situation, two reads. Which one's yours?`

**Body sketch:**

- One short, pointed example of multi-perspective emotional logic.
- Frame: "9 people can read the same moment 9 different ways. Here's one we've been arguing about this week."
- CTA to a live question or a high-engagement thread.

### Email 4 — Re-permission

**Subject:** `Do you still want emails from 9takes?`
**Preheader:** `No pressure either way. One click either direction.`

**Body sketch:**

- Blunt, honest. No cute copy.
- Two equally-weighted buttons: **"Yes, keep me in"** / **"No, take me off the list"**
- One sentence on what "keep me in" means (frequency expectation — weekly? monthly? set this honestly).
- No guilt-tripping, no "we'll miss you" framing.

**Technical:** The "Yes" button pings a confirm endpoint that marks the user as actively re-permissioned (separate flag — we'll use this for future sends).

### Email 5 — Goodbye

**Subject:** `You've been unsubscribed from 9takes.`
**Preheader:** `One link if you change your mind.`

**Body sketch:**

- 50–75 words.
- "You didn't open the last few emails, so I've taken you off the list. No hard feelings."
- One small link: "Changed your mind? Click here to stay."
- This email alone sometimes reactivates 8–15% of non-engagers.

---

## 6. Bucket-specific framing details

### Cold (30–90 days)

- **Tone:** Warmer, presumes some recall.
- **Email 1 hook:** "Since you signed up on [date], we've been building in public — here's the best thing we've published."
- **Growth story:** Direct and unapologetic. Works here.
- **Expected performance:** Highest open/click rate of the three buckets.

### Dormant (90–365 days)

- **Tone:** Re-introduce without assuming recall.
- **Email 1 hook:** "You signed up for 9takes in [month year]. A lot's changed since. Here's what it's become."
- **Growth story:** Frame as reader-relevant, not platform-brag.
- **This is the bucket DJ's original framing fits best.**

### Zombies (365+ days)

- **Tone:** Honest, almost apologetic. Acknowledge the silence.
- **Email 1 variant — option A (value-first):** "I know it's been [X] months since you signed up and radio silence from us. Here's what happened in the meantime." Then single hero piece.
- **Email 1 variant — option B (re-permission-first):** "You signed up for 9takes in [year]. I'm reaching out now because I want to be honest — you haven't heard from us in a long time. Still want to be here? If yes, here's what you get."
- **Recommendation:** Start with **Option A** for this bucket too (consistent with the 3-value-emails-before-re-permission pattern), but compress the sequence if complaint rate spikes. Re-permission is still Email 4 — it just has heavier weight psychologically for this bucket.

---

## 7. Exclusions & sunset logic

### Who doesn't get enrolled

- Anyone in `email_unsubscribes`
- Anyone with a past hard bounce or complaint (requires §9 infra)
- Anyone currently in `welcome_sequence` (active or completed within last 14 days)
- Anyone under 30 days old

### Who exits mid-sequence

- User clicks any link in emails 1–3 → exit with status `reactivated` (they got the message, stop pushing)
- User clicks "Yes, keep me in" on Email 4 → exit with status `re_permissioned` (separate flag: they've opted back in explicitly)
- User clicks "No, take me off" on Email 4 → suppress immediately, skip Email 5
- User unsubscribes at any point → suppress, exit sequence
- User hard-bounces → suppress, exit sequence

### Post-campaign sunset

- Anyone who completes all 4 emails without any open or click → suppress after Email 5 (move to `dormant_suppressed` state, don't delete)
- Hold for 180 days minimum before any future send to suppressed users.

---

## 8. Infrastructure work needed

From the codebase scan (2026-04-18), existing infra supports most of this, but the following is needed:

### 8.1 — New sequence definition

- Migration: create `email_sequences` row with `key = 'reactivation_sequence'`
- Add 5 rows to `email_sequence_steps` with appropriate `delay_days_after_previous`
- Content module: `src/lib/email/reactivation-sequence-content.ts` (mirror pattern from `welcome-sequence-content.ts`)

### 8.2 — Bucketed enrollment function

- New function in `src/lib/server/emailSequences.ts`: `enrollDormantUsersInReactivationSequence()`
- Logic:
  1. Union `profiles` + `signups` into a candidate list
  2. Filter: exclude welcome-sequence actives, suppressed, <30d, >already-in-reactivation
  3. Tag bucket on each candidate based on signup age at enrollment time
  4. Pass bucket as a template token so Email 1 can branch on it
- Alternative: three separate sequence keys (`reactivation_cold`, `reactivation_dormant`, `reactivation_zombie`) — simpler content-wise, cleaner admin dashboard, but more duplication. **Recommend separate keys** for clarity.

### 8.3 — New personalization tokens

- `{{signup_date}}`, `{{signup_month}}`, `{{signup_month_year}}`, `{{signup_year}}` — need to compute from `profiles.created_at` / `signups.created_at` at send time.

### 8.4 — Re-permission click handler

- New endpoint: `POST /api/email/re-permission/[tracking_id]`
- Sets a flag on profile/signup: `re_permissioned_at`
- Optional admin view for who re-permissioned vs. who passively stayed.

### 8.5 — Known gap: bounce + complaint handling

- Current code has no webhook handlers for bounces or complaints (see §9 action item).
- Gmail API doesn't push these proactively; requires polling Gmail's sent-message status or using a different sending path (SendGrid/Postmark) for reactivation specifically.
- **Strong recommendation:** handle this before sending to Zombies bucket.

### 8.6 — Admin UI (optional, lower priority)

- Mirror `/admin/welcome-sequence` at `/admin/reactivation-sequence` showing per-step metrics + bucket breakdown.
- Not strictly required for launch — can watch metrics via existing email dashboard.

---

## 9. Action items (DJ — pre-launch, blocking)

These are **non-negotiable before sending to the 365+ bucket** and strongly recommended for all buckets:

- [ ] **Run all reactivation-eligible addresses through ZeroBounce or NeverBounce.** Drop invalid, disposable, role-based, catch-all, and spam-trap addresses. At ~160 candidates this costs <$5 and prevents a single bad batch from spiking complaint rate.
- [ ] **Verify SPF, DKIM, DMARC records on 9takes.com.** Tools: [mxtoolbox.com](https://mxtoolbox.com/SuperTool.aspx), [dmarcian.com](https://dmarcian.com/). DMARC should be at least `p=none` with reporting before first send.
- [ ] **Decide on sending address.** Options:
  - Keep `usersup@9takes.com` (simplest, but any reputation damage affects transactional/welcome sends)
  - Create a separate `hello@9takes.com` or `dj@9takes.com` for reactivation (quarantines reputation risk; recommended)
- [ ] **Warm-up plan** _(lower-risk at this scale but still worth structuring)_:
  - Day 1: Cold bucket only (30–90d), 50% of it
  - Day 2: Remainder of Cold bucket, if complaint rate <0.1%
  - Day 4: Dormant bucket (90–365d), 50%
  - Day 5: Remainder of Dormant, if metrics hold
  - Day 7+: Zombies bucket, only after review
- [ ] **Complaint-rate monitoring cadence.** Check after every batch, not end-of-campaign. Any batch exceeding 0.3% complaints: pause sequence, investigate.
- [ ] **Set up bounce tracking.** See §8.5. At minimum, scan Gmail API sent-message status after each batch for `550`/`553`/`554` responses and flag those addresses as bounced.

---

## 10. Open questions

1. **Bucket breakdown** — what's the actual distribution across 30–90d / 90–365d / 365+? Query `profiles.created_at` + `signups.created_at` to find out before finalizing.
2. **Email 2 personal story** — DJ drafts; may want editorial pass. What's the one story? The "why Enneagram" moment.
3. **Hero content for Email 1** — which piece? Top candidate is `enneagram-and-mental-illness` (known top-traffic blog, per memory). Alt options: a signature question thread, a celebrity analysis.
4. **Weekly cadence promise in Email 4** — if someone says "yes, keep me in," what are they opting into? Need to define the ongoing newsletter/send cadence before asking.
5. **Re-permission flag usage** — how does `re_permissioned_at` gate future sends? Is it required for all future non-transactional email, or just informative?
6. **Sequence cloning vs. single-sequence-with-bucket-token** — see §8.2. Recommend separate keys per bucket.
7. **Send timing** — day of week, time of day. Tuesday–Thursday, 10am-ish local time is the consensus. Worth testing.

---

## 11. References

- Research brief (internal, 2026-04-18) — win-back best practices synthesis
- [Inbox Collective — Reactivation Campaign Playbook](https://inboxcollective.com/how-to-set-up-a-reactivation-campaign-to-win-back-inactive-email-subscribers/) — **single highest-signal source for this plan**
- [Validity — 7 Email Reactivation Campaign Insights](https://www.validity.com/blog/7-email-reactivation-campaign-insights/)
- [Mailflow Authority — Email Sunset Policies Guide](https://mailflowauthority.com/list-hygiene/sunset-policies-guide)
- [Klaviyo — Win-Back Email Examples](https://www.klaviyo.com/blog/winback-email-campaign-examples)
- [welcome-email-assessment.md](./welcome-email-assessment.md) — existing welcome sequence assessment (pattern to mirror)

---

## 12. Changelog

- **2026-04-18** — Initial draft. Plan spec'd out. Blocked on pre-launch action items (§9).
