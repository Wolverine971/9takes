<!-- docs/growth/priestley-lead-gen-audit-2026-04-27.md -->

# 9takes Audit — Priestley "$1M Landing Page" Framework

**Date:** 2026-04-27
**Source video:** Daniel Priestley — _The $1 Million Landing Page_ ([transcript](../../youtube-transcripts/2025-10-11-daniel-priestley-1m-landing-page.md), [analysis](../../youtube-transcripts/2025-10-11-daniel-priestley-1m-landing-page-ANALYSIS.md))
**Framework recap:** Landing page (frustration/readiness hook + 3-area value prop + credibility + 4-stack CTA) → 15-question quiz (contact / 10 best-practices / "Big 5" qualifying) → dynamic results page that segments leads to 1-on-1 / group / content. Target: **20–40% of landing-page visitors start the quiz.**

---

## TL;DR

9takes has the _raw material_ for a Priestley-grade scorecard funnel — strong brand voice, deep credibility content (200+ pieces, 95 Enneagram articles, 80+ celebrity analyses), a give-first mechanic that already mimics quiz behavior, and a coaching offer. But the **scorecard layer is missing**, and the most strategic page on the site (`/enneagram-test`) is currently a 30-line redirect. Three changes would move the needle hard:

1. **Build an actual `/enneagram-test`** that follows Priestley's structure (and replaces the redirect to `/questions`).
2. **Add the "Big 5" qualifying questions to `/book-session`** — especially the budget-implier ("which solution would suit you best?").
3. **Make blog-page CTAs dynamic per-type**, not generic "subscribe" boxes.

The biggest immediate leak: people search "enneagram test", land on `/enneagram-test`, get redirected to `/questions`, and bounce. SEO traffic ≠ qualified leads when the destination doesn't match intent.

---

## What 9takes Already Does Well (vs Priestley)

| Priestley element                                 | Where 9takes nails it                                                                                                                                |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision-fork hook**                            | Homepage `+page.svelte` "I'm new" / "I know my type" panel. Two distinct paths.                                                                      |
| **Give-first mechanic**                           | The Question-of-the-Day forces an answer before showing other takes — mechanically identical to a 1-question quiz.                                   |
| **Credibility section**                           | `/book-session` has fit-checks (4 specific scenarios), proof stats (200+/95/80+), focus areas, and "read first" links to existing work. Strong.      |
| **Open-text final question**                      | `/book-session` already has the `sessionGoal` textarea with a placeholder modeling great answers. This _is_ Priestley's Q5.                          |
| **No-payment, low-friction CTA**                  | "No payment today. Waitlist gets first invite." matches Priestley's stack.                                                                           |
| **Structured data + segmentation infrastructure** | Site already routes by Enneagram type (1-9), has `coaching_waitlist` + `coaching_waitlist_metadata` tables, captures UTMs. The plumbing is in place. |

---

## Gaps — What's Missing or Weak

### 1. `/enneagram-test` is a redirect (CRITICAL)

`src/routes/enneagram-test/+page.svelte` — 30 lines, immediately redirects to `/questions`. The page that should be the **single highest-leverage Priestley funnel on the site** is currently a no-op.

This is the single biggest lead-gen leak on 9takes. People searching "enneagram test", "personality test", "what type am I" land here expecting a quiz, get bounced to a Q&A feed, and leave.

> _Priestley benchmark:_ 20–40% of landing-page visitors start the quiz. Right now, the conversion is 0% — there's no quiz to start.

### 2. Homepage hook is a question, not a frustration or readiness sentence

Current hero H1: **"Do you know your Enneagram type?"**

It's a friendly opener but it's not Priestley-style. Compare:

| Style                            | Example                                                                                                 |
| -------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Frustration hook** (Priestley) | "Frustrated that you keep misreading the same person — even though you've read every personality book?" |
| **Readiness hook** (Priestley)   | "Ready to finally understand the pattern in your relationships, conflicts, and decisions?"              |
| **Current 9takes**               | "Do you know your Enneagram type?"                                                                      |

The current copy assumes the visitor already knows what the Enneagram is. Priestley's hooks meet the visitor inside their problem.

### 3. `/book-session` is missing the Big 5 qualifying questions

Current form fields:

- Name (required)
- Email (required)
- Enneagram type (optional dropdown)
- "Anything you already know you want help with?" (optional textarea — this is Q5)

Missing the four highest-leverage Priestley questions:

| Priestley question                               | 9takes-flavored version                                                                                                  | What it gives you                                             |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| Q1 — Current situation                           | "Which best describes you?" → in a relationship / leading a team / mid-career pivot / coming out of burnout              | Lets you tailor first-session framing                         |
| Q2 — Desired outcome (90 days)                   | "What do you most want to walk away with?" → fix a relationship loop / land a role / make a hard call / type clarity     | Tells you their **#1 buying driver**                          |
| Q3 — Obstacle                                    | "What's gotten in the way before?" → wrong type guess / advice didn't stick / over-thought it / never tried it seriously | Tells you what to handle on the call                          |
| Q4 — **Preferred solution (the budget-implier)** | "What kind of help do you want?" → just resources / 1-on-1 sessions / a 3-month engagement / done-with-me intensive      | Implies budget without asking. **Highest-leverage question.** |

These are 4 dropdowns. They'd take ~20 seconds extra to fill out and would dramatically improve lead quality + reply rate.

### 4. No dynamic results page

When someone joins the waitlist they get a static "You're on the waitlist." panel. Priestley's whole point is: **the success page is the most personalized real estate in the funnel.**

A dynamic results page would:

- Show the type they selected (or guessed) with a custom write-up
- Pull 3 insights based on their answers
- Recommend a tailored next step:
  - High-intent (picked "1-on-1" or wrote a real situation in the textarea) → "Reply to this email — I usually respond within 48 hours"
  - Mid-intent → recommend the specific blog series matching their stated outcome
  - Low-intent / type-curious → send them to the right `/enneagram-corner/enneagram-type-N` guide + invite to the Question-of-the-Day

### 5. Blog-page CTA sidebar is generic

`EnneagramCTASidebar.svelte` is a fixed/embedded email-capture box across all blog posts. It collects email, period.

Priestley would say: each blog post is a **type-specific landing page** in disguise. A reader on `/enneagram-corner/enneagram-type-5` is signaling type/curiosity. The CTA should say:

> _"You're reading about Type 5. Take the 3-minute scorecard to find out if you actually are one — and what to do if you are."_

…with the form pre-routing into a 5-themed quiz path. Same component, dynamic per-post.

### 6. The Question-of-the-Day is _almost_ a Priestley quiz — but doesn't capture intent

The QotD mechanic is brilliant: forces a give-first answer, then reveals how each type responded. But:

- It doesn't ask the user _their own type_
- It doesn't surface a "next step" tailored to their answer
- It doesn't feed any segmentation system

This is one good-quality answer away from being a per-day mini-scorecard. Add: "Which type best describes how you answered?" → tag the response → recommend a specific guide based on their pick.

### 7. CTA timing — value before capture, not after

9takes generally asks for an email _before_ delivering the personalized goods (waitlist, sidebar). Priestley's pattern is: **deliver the score (= value) first, then offer the upgrade.** This builds trust and dramatically lifts opt-in rates because the user has already received something useful.

---

## Recommendations — Prioritized

### Tier 1 — Do these now (highest ROI, lowest effort)

**1. Build a real `/enneagram-test` scorecard** (this is the project)

- 15 questions, Priestley structure
- Best-practices questions = type-indicator items (which read directly informs the score)
- Big 5 qualifying questions at the end
- Dynamic results page that delivers the type + 3 insights + next step (book / coaching / specific guide)
- Wire it to ScoreApp (10–30 min setup per Priestley) **OR** build native — given 9takes is SvelteKit + Supabase, native is probably the right call (full control of the data, zero vendor lock-in, fits existing stack)
- Replace the current redirect

**2. Add the Big 5 to `/book-session`**

- 4 new dropdowns + keep the existing Q5 textarea
- Save to a new `coaching_waitlist_qualifiers` table (or extend the existing one)
- Surface qualifiers in the admin notification email so you can read the lead's intent before the first reply

**3. Rewrite the homepage H1 with a Priestley-style hook**

- A/B test 2–3 versions:
  - "Frustrated that personality tests describe you but never _help_?"
  - "Ready to read people — including yourself — without the guesswork?"
  - Keep current as control

### Tier 2 — Higher leverage, more effort

**4. Make `EnneagramCTASidebar` type-aware**

- Detect type from URL/frontmatter (Type-N pages, type-specific blog posts)
- Render type-specific copy + a "find out if you really are a Type N" mini-quiz CTA
- Falls back to generic copy on non-type pages

**5. Add a dynamic results page to `/book-session`**

- Personalized success state, not a static panel
- Branch the next step on the qualifier answers
- This is mostly a `+page.svelte` rewrite — backend already captures everything

**6. Extend QotD into a per-day micro-scorecard**

- Add "which type best describes how you answered?" after the user submits
- Use this as soft type-data over time → recommend the type guide they're closest to
- Long-term: builds a per-user cumulative type signal across many days

### Tier 3 — Strategic / longer-horizon

**7. Per-celebrity mini-quiz on personality-analysis pages**

- "How similar are you to [Cardi B]?" — 5 questions
- Routes results to: closest celebrity analysis they haven't read / Type-N guide / `/book-session`
- Each celebrity page becomes its own entry-point funnel
- 80+ celebrities × this pattern = 80+ landing pages with quizzes

**8. Wire qualifiers into the email sequence engine**

- The existing `src/lib/email/` system runs sequences. Today they're roughly type-driven.
- Add a second axis: outcome (Q2) and solution-preference (Q4) drive sequence routing
- Someone who picked "done-with-me intensive" gets a different drip than someone who picked "just resources"

---

## What NOT to Change

- **Don't kill the Question-of-the-Day.** It's already doing 80% of what Priestley wants — just needs the segmentation layer added.
- **Don't replace `/book-session`'s contextual page (FAQs, focus areas, fit-checks) with a bare quiz.** Priestley's framework assumes the landing page is the credibility layer; 9takes already has that locked in. Add the quiz _to_ the page, don't replace it.
- **Don't gate existing content behind the quiz.** The library of 200+ pieces _is_ the credibility moat. Priestley's give-first principle says: if it earns trust, leave it ungated.

---

## The One-Sentence Verdict

> 9takes has every Priestley funnel ingredient already on the shelf — but the most-searched route on the site (`/enneagram-test`) is a redirect, the highest-converting question (Q4 budget-implier on `/book-session`) is missing, and the success states are static instead of personalized. Fixing those three is the highest-leverage week of growth work on the roadmap.

---

## Appendix — File-Level Findings

| File                                                 | Status                       | Key issue                                                                                     |
| ---------------------------------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------- |
| `src/routes/enneagram-test/+page.svelte`             | 🔴 Redirect only             | 30 lines → `window.location.href = '/questions'`. No quiz exists.                             |
| `src/routes/book-session/+page.svelte`               | 🟡 Strong but incomplete     | Excellent credibility layer, missing Big 5 qualifiers                                         |
| `src/routes/book-session/+page.server.ts`            | 🟡 Solid backend             | Captures name/email/type/goal + UTMs + IP. Ready to extend with qualifier columns.            |
| `src/routes/+page.svelte`                            | 🟡 Good structure            | Hook is question-style not frustration/readiness; coaching CTA is strong but late in the page |
| `src/lib/components/blog/EnneagramCTASidebar.svelte` | 🟡 Generic                   | Email-only capture; not type-aware                                                            |
| `src/routes/personality-analysis/+page.svelte`       | ⚪ Out of scope (index page) | Could host a "find your celeb match" quiz long-term                                           |
