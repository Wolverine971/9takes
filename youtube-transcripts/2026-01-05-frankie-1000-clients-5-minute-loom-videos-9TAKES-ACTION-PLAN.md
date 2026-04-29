---
title: '9takes Action Plan: Adapting Frankie''s Hand-Raiser + 5-Minute Video System'
companion_doc: youtube-transcripts/2026-01-05-frankie-1000-clients-5-minute-loom-videos-ANALYSIS.md
source_video: 'https://www.youtube.com/watch?v=RPd_3-CRyts'
created: '2026-04-27'
status: draft-action-plan
priority_areas:
  - book-session-funnel
  - twitter-quora-instagram-hand-raisers
  - blog-offer-validation
  - homepage-hero-rewrite
  - async-coaching-tier
tags:
  - action-plan
  - growth
  - conversion
  - coaching-funnel
  - content-strategy
  - companion-doc
path: youtube-transcripts/2026-01-05-frankie-1000-clients-5-minute-loom-videos-9TAKES-ACTION-PLAN.md
---

# 9takes Action Plan — Adapting the Frankie Playbook

> **Companion to:** [Frankie's 1,000-Clients-via-Loom Analysis](./2026-01-05-frankie-1000-clients-5-minute-loom-videos-ANALYSIS.md)
> **Source video:** https://www.youtube.com/watch?v=RPd_3-CRyts

This is the *what-9takes-actually-does* doc. The companion doc captures the playbook; this one translates it into specific routes, copy, files, and a phased rollout. Read the analysis first if you want the framework; come here if you want the punch list.

---

## TL;DR — The 5 Bets, Ranked by Leverage

| # | Bet | Where it lives in the codebase | Why it's high-leverage |
|---|---|---|---|
| 1 | **Rebuild `/book-session` around a 5-minute close video** | `src/routes/book-session/` | Highest-revenue conversion path. Currently a waitlist; turning it into a Frankie-style close is a near-1:1 mapping. |
| 2 | **Launch an "Async Loom Read" coaching tier** | New `/book-session/async-read` route | Productizes async — matches Frankie's *clients prefer to be sold this way* insight, opens a low-friction price point below full coaching. |
| 3 | **Add hand-raiser variants to Twitter / Quora / Instagram warmup skills** | `.claude/skills/instagram.skill.md`, `.claude/commands/{twitter,quora,instagram}-warmup.md` | We already run daily warmups. Adding a hand-raiser format costs ~1 post/day and doubles as offer validation. |
| 4 | **Use hand-raiser posts to validate famous-people blog drafts before writing** | `docs/blog-automation/backlog-queue.json`, `src/blog/people/drafts/` | We have ~5+ celebrity drafts in flight at any time. Letting the audience vote in advance saves wasted effort and biases the content toward demand. |
| 5 | **Rewrite the homepage hero + welcome-sequence email #1 to pass the 1–3 sentence test** | `src/routes/+page.svelte`, `src/lib/email/sequences/welcome*.ts` | Cheap, fast, applies the offer-summary discipline to our top-of-funnel copy. |

Below: each bet expanded with specific copy, file targets, success metrics, and rollout order.

---

## Bet 1 — Rebuild `/book-session` Around a 5-Minute Close Video

### Current state
`/book-session` is a coaching-waitlist signup. Lead drops email → goes into a sequence → eventually DJ books a session manually. There's no real close mechanism on the page itself.

### Frankie-style redesign

Replace (or stage *next to*) the waitlist with a single landing-page video that does the entire close, in the order Frankie prescribes:

**Video structure (target: 4–6 minutes):**

1. **Hook (0:00–0:20)** — One sentence on the outcome: *"In 60 minutes I'll decode the one Enneagram blind spot that's costing you the most in [your work / your relationship]."* Pass the 1–3 sentence test.
2. **Demonstrate the outcome (0:20–2:30)** — Not "what happens in a session" (the *service*). Instead: a **real artifact**. Pick one:
   - A 30-second anonymized voice memo from a past client describing their *aha* moment.
   - A screen-share of an actual session output / map / personalized brief (with names blurred).
   - A before/after: "Here's the email she was about to send. Here's the email she sent instead, after we mapped her Type 6 anxiety pattern."
3. **Contextualized price (2:30–3:30)** — Show the price next to the quantified outcome. Frankie's rule: never present price bare.
   - Bad: *"Sessions are $X."*
   - Good: *"$X for one 60-minute session. By the end you'll have a one-page map of your dominant type, your wing, your stress/growth lines, and the three specific scripts to use in the next conversation that's been driving you crazy."*
4. **How to buy (3:30–4:30)** — Literal mechanics. *"Click the teal button below. Pick a time on the calendar. Pay via Stripe. You'll get a confirmation email + a 5-question intake form."* Don't assume.
5. **Question prompt (4:30–end)** — *"Got a question? Reply to the email below or DM me on [X]. The most common one is 'will this work for my situation?' — and the answer is almost always yes, here's why…"*

### Concrete files to touch
- `src/routes/book-session/+page.svelte` — embed video above the fold; keep the waitlist as a fallback CTA below.
- `src/routes/book-session/+page.server.ts` — track video-watch events via the existing analytics pipe (`src/lib/analytics/`).
- `src/routes/api/track/+server.ts` — confirm we can log `book_session_video_played`, `book_session_video_complete`, `book_session_cta_clicked`.
- Stripe checkout: `src/routes/stripe/` already wired — this just needs a price-id mapped to the coaching session SKU.

### Production checklist (the video itself)
- Record in Loom or QuickTime (face cam in corner, screen-share for the artifact section).
- Cap at **6 minutes max** (Frankie's rule; longer = drop-off).
- Get **at least one signed client release** for the demo artifact, or anonymize aggressively.
- Stage as a custom video for the first ~5 leads (per Frankie: *custom until you've heard yes*), then promote the best one to evergreen on the page.

### Success metrics (read at 30 days)
- `book_session_video_play_rate` — % of `/book-session` visitors who hit play
- `book_session_video_60s_rate` — % who pass the 60-second mark (the demo artifact)
- `book_session_cta_click_rate` — % who click the buy/booking button
- `book_session_paid_conversion_rate` — % who actually pay
- Compare against current waitlist → paid conversion baseline (pull from Supabase `coaching_waitlist` + Stripe webhook events).

---

## Bet 2 — The "Async Loom Read" Tier

### Why it exists
Frankie's deepest insight: *clients prefer async because they don't have to schedule.* 9takes currently has one coaching SKU (live 60-min). Adding an async tier unlocks:
- A lower price point that converts cold traffic.
- A way to handle international leads (no calendar friction).
- A scalable stepping-stone *into* the live tier ("liked the read? upgrade to a session").

### The product
**"Send DJ a 5-minute Loom about your situation. Get a 10–15 minute typed-up Enneagram analysis + voice memo back within 72 hours. $X (target: ~25–35% of live-session price)."**

### Concrete files / new surface
- New route: `src/routes/book-session/async-read/+page.svelte` (with its own `+page.server.ts`).
- Reuses Stripe wiring from `src/routes/stripe/`.
- New Supabase table or extension to `coaching_waitlist`: `async_reads` with `id`, `profile_id`, `intake_loom_url`, `delivery_status`, `delivered_at`, `delivery_audio_url`.
- Intake form: piggyback on existing `src/routes/intake/[token]/` pattern — generate a token on Stripe success, redirect to a token-gated upload page.
- Delivery: send via existing email pipeline (`src/lib/email/`), with a private R2/Supabase storage URL for the voice memo.

### Same Frankie video pattern, miniaturized
The `/book-session/async-read` page also gets its own 3-minute close video (because per Frankie, every offer should have one). That video plays a sample of an actual async read so prospects can hear what they'll get.

### Open question to resolve before building
Does DJ want async-read to be a real ongoing service or a one-time experiment? If the answer is "experiment," ship it as a manually-fulfilled landing page (Stripe + a Google Form intake) before building the polished version.

---

## Bet 3 — Hand-Raiser Posts in Daily Warmups

### Where this plugs in
We already run daily warmups via these skills/commands:
- `.claude/skills/instagram.skill.md`
- `.claude/commands/instagram-warmup.md`
- `.claude/commands/instagram-reply.md`
- `.claude/commands/quora-warmup.md`
- (Twitter via the `twitter-warmup` skill — `.claude/skills/twitter-warmup` equivalent)

Each of these currently focuses on *replying* / *commenting* on others' content. Per Frankie: that's the most crowded channel. We should add a **hand-raiser variant** to each warmup as an explicit step.

### Hand-raiser templates by platform

**Twitter / X (1 per day, max):**
> "If I could decode the exact reason your Type 1 boss flips during Friday standup using just their Enneagram fixation, want the breakdown? Drop a 🧠 and I'll send it."

> "If I could tell you the one Enneagram-based reason you keep dating the same person in different bodies, would you actually want to know? Reply 'yes' and I'll pull a thread."

**Quora (rarer — 1–2 per week as standalone questions or self-answered posts):**
> Self-answer pattern: post a high-intent question, then drop a 9takes-flavored answer that ends with a hand-raiser hook.

**Instagram (1 per week as a carousel hook on the last slide):**
> Last slide: "Want me to map your specific situation in 60 seconds? Comment your Type number + the situation and I'll reply with one move you can try this week."

### What to add to each warmup command file
Per memory note ([Claude commands should be self-sufficient](memory)), these need to be **inlined** into the command files, not linked out:

1. A `## Hand-Raiser Post (Optional — 1 per session)` section.
2. 3–5 templates per platform with the *promise → quantified outcome → drop-X-to-respond* structure.
3. Explicit guidance: **rotate which type / situation you target** so we get distribution data on what resonates (informs Bet 4 below).
4. Track which posts drove DMs/comments → feeds the offer-validation loop.

### Success metric
After 2 weeks: which type-or-topic hand-raisers got >5 hand-raises? That's the offer/blog topic to ship next. Log to `docs/quora/question-log.md` and a new `docs/hand-raisers/log.md`.

### Caveats
- Per [Instagram comment style](memory): **don't make every post a hand-raiser** — mix tones, keep the warmup feed natural, no AI patterns.
- Per [Contrarian sharpness is contextual](memory): hand-raisers should be earned-sharp, not contrarian-by-default. Default tone: *curious + specific*, not *combative*.

---

## Bet 4 — Use Hand-Raisers to Pre-Validate Famous-People Blogs

### The current waste
We have draft celebrity analyses staged in `src/blog/people/drafts/` (Cardi-B, Emma-Myers, Matt-Rife, Sandra-Bullock, Shakira at the moment). The blog automation queue (`docs/blog-automation/backlog-queue.json`) decides what ships next, but ranking is driven by SEO/topical guesses, not demand signal.

### Frankie's principle applied
*Don't build the website until somebody raises a hand.* Translation: don't burn 4 hours on a celebrity Enneagram analysis until the audience signals they want it.

### The mechanism
Before promoting a draft from `backlog-queue.json` → published, post a hand-raiser on Twitter / IG / Quora:

> "If I broke down [Celebrity]'s reaction to [recent thing they did] using their Enneagram type — and actually explained the emotional logic underneath it — would you read it? Drop their initials and I'll write it next."

### Lightweight scoring rule
- ≥ 5 hand-raises in 24 hours → promote that draft to publish next.
- ≤ 2 hand-raises → re-frame the angle (different recent event, different promise) before publishing, or push down the queue.

### File hooks
- `docs/blog-automation/override.json` — already exists. Use it to manually re-rank the queue when a hand-raiser wins.
- New file: `docs/blog-automation/hand-raiser-log.md` — date, celebrity, post link, hand-raise count, decision (promote / reframe / kill).

### Caveat
This applies to *new* celebrity drafts only. Per memory: **never apply this to `enneagram-and-mental-illness`** or other top-traffic existing posts. Don't touch SEO-ranked URLs based on hand-raiser feedback.

---

## Bet 5 — The 1–3 Sentence Test on Homepage + Welcome Email #1

### What to audit
Pull every public-facing "what is 9takes" surface and run it through Frankie's mentor's test: *if you can't sell the offer in 1–3 sentences, no amount of copy downstream will save it.*

Surfaces to test:
1. `src/routes/+page.svelte` — homepage hero
2. `src/lib/email/` — welcome sequence email #1
3. `src/routes/book-session/+page.svelte` — coaching landing
4. RSS / sitemap meta-description
5. The `<meta name="description">` for the root document

### Bad (current pattern, generic Enneagram)
> "9takes is a personality-based Q&A platform built around the Enneagram. Discover yourself through 9 perspectives."

(That's the *service*. Frankie would gut it.)

### Better (promise-first, quantified, specific)
> "9takes decodes why people in your life — your boss, your partner, your kid — react the way they do, using the Enneagram. One situation. 9 emotional logics. You stop guessing and start moving."

(Promise: stop guessing. Quantified: 9 emotional logics. Specific: boss / partner / kid.)

### Method
- Don't rewrite blindly. Draft 3 candidates per surface.
- Run them past the [DJ Communication Guide](docs/brand/dj-communication-guide.md) and the [Brand Style Guide v2](docs/brand/brand-style-guide-v2.md) before shipping.
- A/B test the homepage hero via a feature-flag in `admin_settings` if the existing analytics support it.

### Success metric
- Homepage → email signup conversion rate (track via existing analytics).
- Welcome-email #1 → reply rate (proxy for "did the offer summary land?").

---

## Phased Rollout (8 Weeks)

| Week | Focus | Deliverable |
|---|---|---|
| 1 | **Bet 5** — sentence test | 3 candidate hero rewrites; pick one; ship. Same for welcome email #1. |
| 1 | **Bet 3** — hand-raiser templates | Update 4 warmup command files with hand-raiser sections + templates. Start running 1/day. |
| 2 | **Bet 4** — blog validation | Set up `hand-raiser-log.md`; run validation post on 2 staged celebrity drafts. |
| 2–3 | **Bet 1** — record close video | Record v1 (custom-feel, sent to first 5 leads). Iterate based on objections received. |
| 4 | **Bet 1** — promote to evergreen | Best version goes live on `/book-session`. Track video metrics. |
| 5–6 | **Bet 2** — async tier MVP | Manual fulfillment first: Stripe checkout + Google Form intake. Promote to a small list. |
| 7 | **Bet 2** — async tier polish | Build the proper `/book-session/async-read` route + intake token flow if MVP shows demand. |
| 8 | **Review** | Pull all metrics. What worked? Kill what didn't. |

---

## Cross-Cutting Caveats

- **Don't apply to top-traffic blogs.** Per memory: `enneagram-and-mental-illness` and similarly ranked URLs are off-limits for promise-rewrites. SEO trumps cleverness.
- **Don't make warmups feel like a sales channel.** Per memory: Instagram comments must stay short / mixed-tone / non-AI. Hand-raisers are at most 1/day on each platform; the rest of the warmup stays human.
- **Frankie targets transactional buyers** (roofers, plumbers, attorneys) where outcome = leads = revenue. 9takes targets emotional buyers — the "outcome" is *understanding*, which is harder to demo. Bet 1's success hinges on whether we can render an emotional outcome as concretely as Frankie renders a phone call.
- **Survivorship bias** on Frankie's numbers. Treat his framework as the takeaway, not the headline counts.
- **Parallel-work safety.** Per memory: other agents and DJ edit this repo in parallel. Don't bulk-rewrite warmup files without checking for in-progress edits.

---

## Open Questions for DJ

1. Is `/book-session` getting enough traffic right now to A/B-test a video? If not, Bet 1 needs a traffic-driving sub-bet first.
2. Are you willing to put your own face on a 5-minute close video, or should we test with text-only / animated demos first?
3. What's the price ceiling for the async-read tier? (Setting it determines the video script.)
4. Is there at least one past client comfortable being quoted/anonymized in the demo artifact?
5. Should hand-raiser performance influence the actual `daily-blog-creator` automation, or stay a manual override-only signal?

---

## Source Material

- Companion analysis: [Frankie's 1,000-Clients-via-Loom Analysis](./2026-01-05-frankie-1000-clients-5-minute-loom-videos-ANALYSIS.md)
- Original video: https://www.youtube.com/watch?v=RPd_3-CRyts
- Frankie's channel: https://www.youtube.com/@beyondagencyprofits
