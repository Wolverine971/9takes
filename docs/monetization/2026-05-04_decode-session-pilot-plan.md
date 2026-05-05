<!-- docs/monetization/2026-05-04_decode-session-pilot-plan.md -->

# Decode Session Pilot — Implementation Plan

**Status:** Draft for DJ review — no code yet
**Companion doc:** [`2026-05-02_decode-a-person-offering.md`](./2026-05-02_decode-a-person-offering.md) (the brainstorm trail)

---

## Goal

Add a single end-of-blog primary CTA to every `/personality-analysis/*` post that funnels readers to `/book-session`. Measure whether the funnel produces qualified waitlist signups before investing in pricing, scheduling, or async-dossier follow-ups.

---

## Scope

### In

- New `BookSessionCTA` callout component
- Auto-injection at the **end** of every personality-analysis slug page (`/personality-analysis/[slug]`)
- Tracking instrumentation: impression (in-view) + click events
- Light copy/coherence tweak on `/book-session` to bridge from the blog
- Reconcile with existing `EnneagramCTASidebar` so the new CTA is the **only primary CTA** on these pages

### Out (deferred)

- Inline mid-blog placement
- Session-specific landing page (DJ flagged "maybe" — held for later)
- Async written dossier product
- Pair dynamics / "what's next" add-ons
- Auto-injection on other blog routes (`/community`, `/enneagram-corner`, `/how-to-guides`, `/pop-culture`)
- Live booking flow / payments (waitlist remains the destination for v1)

---

## Audit Findings

Quick scan of what's currently on personality-analysis blogs and the surrounding component patterns:

- **Route:** `src/routes/personality-analysis/[slug]/+page.svelte` (753 lines — substantial template)
- **Existing CTA:** `EnneagramCTASidebar` is shown only to non-logged-in users (`!data?.user`), as either an embedded block or a left-side sticky sidebar. References at lines 166–167, 316–318, 430–435.
- **Callout components:** `src/lib/components/blog/callouts/` — `QuickAnswer`, `InsightBox`, `Checklist`, `EnneagramTypingFlow`, `TypeQuotes`, `VisualMetaphor`
- **Component conventions observed:**
  - SCSS scoped styles, accent-stripe + glow pattern (see `InsightBox`)
  - CSS variables: `--bg-surface`, `--bg-deep`, `--primary-dark`, `--primary-lighter`, `--text-primary`, `--text-secondary`
  - Older callouts use `export let` (Svelte 4); per `CLAUDE.md` **new components should use Svelte 5 runes** (`$props`, `$state`)
- **Tracking:** `/api/track/click` and `/api/track/open` already exist — good fit for click + impression events

---

## Key Decision (Needs DJ Input)

**The `EnneagramCTASidebar` problem.** That component is currently the primary conversion path on personality-analysis blogs (for logged-out readers). Adding a second primary CTA violates the "only primary CTA" rule.

Three options:

| Option                                      | What it means                                                                                                                                         | Tradeoff                                                                                                                                                                                                     |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **A. Replace on personality-analysis only** | `BookSessionCTA` shows on personality-analysis pages for everyone; `EnneagramCTASidebar` is removed from this route only (still runs everywhere else) | Cleanest hierarchy. Loses the type-test signup funnel from these blogs, but those readers already self-selected into deep personality content — book-session is the more valuable next step                  |
| **B. Stack: keep both**                     | `EnneagramCTASidebar` stays for logged-out, `BookSessionCTA` added below                                                                              | Violates the "only primary CTA" rule. Diluted attention. Don't recommend                                                                                                                                     |
| **C. Conditional swap by user state**       | Logged-out → `EnneagramCTASidebar`. Logged-in → `BookSessionCTA`                                                                                      | Logged-in users are warmer and more likely to book; logged-out get pulled into the typing funnel. Defensible, but the higher-intent cohort (logged-out reading a deep dossier) misses the book-session pitch |

**Recommendation: Option A.** The personality-analysis reader has already engaged with deep, specific personality content — the enneagram-test pitch is _upstream_ of where they are. The book-session pitch is _downstream_ and matches their state. Logged-out users still see `EnneagramCTASidebar` everywhere else (`/enneagram-corner`, `/community`, etc.), so total exposure barely changes.

**DJ decision needed before code starts.** ← _flag_

---

## Architecture

### Component: `BookSessionCTA.svelte`

Location: `src/lib/components/blog/callouts/BookSessionCTA.svelte`

- Built with **Svelte 5 runes** (`$props`, `$state`, `$effect`)
- Visual: branded card, accent stripe + soft glow (consistent with `InsightBox` pattern), uses brand teal/rose tokens
- Self-contained — no required props for v1; optional prop for `slug`/`source` to enrich tracking
- Uses `IntersectionObserver` to fire one-time impression event when the CTA scrolls into view
- Click handler fires click event before navigating (or rely on standard `<a>` + analytics endpoint, see "Tracking" below)
- Mobile-responsive (matches existing callout breakpoint at 640px)

### Injection point

Inside `src/routes/personality-analysis/[slug]/+page.svelte`, render `<BookSessionCTA />` at the **end of the article body** — after blog content, before the related-people / footer area. Replace the bottom `EnneagramCTASidebar` instance per Option A above (and remove the `embedded` variant from this route).

### Tracking

- **Impression event:** `POST /api/track/open` with `{ kind: 'session_cta', slug, surface: 'personality_analysis' }` when the CTA enters the viewport (deduped per page-view)
- **Click event:** `POST /api/track/click` with the same payload before the link navigates
- **Outbound URL:** `/book-session?utm_source=blog&utm_medium=session_cta&utm_campaign=personality_analysis&utm_content=<slug>`

This gives us three measurable funnels:

1. Page views → CTA impressions (scroll-depth proxy)
2. CTA impressions → CTA clicks (interest)
3. CTA clicks → waitlist signups (intent)

### `/book-session` page tweak

Light edits only — no redesign:

- Hero/title: weave the word **"decode"** at least once so the bridge from the blog feels coherent
- One paragraph that names the combo framing: "decode yourself, decode the people in your life, or both"
- Keep all current waitlist mechanics, recaptcha, copy structure intact
- Goal: when a reader clicks the CTA, the destination _echoes_ the language of the blog they came from, not pivots to a different vocabulary

---

## Implementation Steps

### Step 0 — Confirm the EnneagramCTASidebar decision

DJ confirms Option A (replace on personality-analysis only) before any code is written.

### Step 1 — Build `BookSessionCTA.svelte`

- Create the component with Svelte 5 runes
- Visual treatment: branded card, accent stripe, brand teal/rose
- Copy: locked-in CTA from the brainstorm doc:

  > **Want to take this further?**
  >
  > Book a 1:1 session with me. We can dig into yourself, into someone in your life who's hard to figure out, or both — they usually weave together. The same depth you just read, applied to the people you actually deal with (including you).
  >
  > I love this kind of conversation. Let's have it.
  >
  > **[Book a session →]**

- Optional `slug` prop for tracking attribution
- Mobile + desktop styles parity with existing callouts

### Step 2 — Wire into `/personality-analysis/[slug]`

- Import `BookSessionCTA` (lazy-import pattern matches existing `EnneagramCTASidebar`)
- Render at end-of-article, replacing the bottom `EnneagramCTASidebar` block (Option A)
- Pass current slug as the `slug` prop
- Verify the side `EnneagramCTASidebar` (`sidePosition="left"`) is also handled per Option A — likely removed from this route too, since it's the same primary CTA

### Step 3 — Add tracking

- Wire impression + click events to existing `/api/track/*` endpoints
- IntersectionObserver fires once per page-view
- UTM-tagged outbound link to `/book-session`

### Step 4 — Tweak `/book-session`

- Add "decode" language in hero and one body paragraph
- Add the combo-framing line ("decode yourself, decode the people in your life, or both")
- No structural changes to the form, recaptcha, or signup flow
- Spot-check spec: `book-session.page.server.spec.ts`

### Step 5 — QA

- Local `pnpm dev`, walk through 3–5 personality-analysis posts
- Verify CTA renders, looks branded, fires events (network tab)
- Verify only **one** primary CTA visible per page on personality-analysis
- Verify other blog routes (`/community`, `/enneagram-corner`, `/how-to-guides`, `/pop-culture`) are **untouched**
- Verify `/book-session` still submits correctly after copy tweak
- `pnpm check` (type-check) and `pnpm lint` clean
- Mobile responsive check (DevTools)

### Step 6 — Ship + watch

- Merge during a normal cycle (no rush)
- Watch metrics for 2 weeks: impressions, clicks, signups, source attribution
- Re-evaluate at the 2-week mark using the brainstorm doc's open questions

---

## Acceptance Criteria

- [ ] `BookSessionCTA` component exists at `src/lib/components/blog/callouts/BookSessionCTA.svelte`, written in Svelte 5 runes
- [ ] Component renders at end-of-article on **every** `/personality-analysis/[slug]` page
- [ ] It is the **only primary CTA** on personality-analysis pages (no competing `EnneagramCTASidebar` on this route)
- [ ] Outbound link points to `/book-session` with UTM params (`utm_source=blog`, `utm_medium=session_cta`, `utm_campaign=personality_analysis`, `utm_content=<slug>`)
- [ ] Impression event fires once per page-view via `IntersectionObserver`
- [ ] Click event fires before navigation
- [ ] Tracking payloads include `kind`, `slug`, `surface`
- [ ] `/book-session` includes "decode" language and combo-framing line, with no regressions to the form
- [ ] No visual or behavioral changes on `/community`, `/enneagram-corner`, `/how-to-guides`, `/pop-culture`, or any non-blog page
- [ ] `pnpm check` and `pnpm lint` pass
- [ ] Mobile + desktop visual parity with existing callouts

---

## Files Touched

- `src/lib/components/blog/callouts/BookSessionCTA.svelte` (new)
- `src/routes/personality-analysis/[slug]/+page.svelte` (modify: import, render, remove competing CTA)
- `src/routes/book-session/+page.svelte` (modify: light copy tweak)
- Possibly `src/routes/api/track/click/+server.ts` and `/open/+server.ts` (verify they accept the new payload shape — likely no changes needed)

Estimated effort: **one focused session**, ~2–3 hours including QA.

---

## Open Decisions Before Code Starts

1. **EnneagramCTASidebar resolution** — Option A confirmed? _(my recommendation: yes)_
2. **Visual treatment** — Branded teal/rose card with accent stripe to match `InsightBox` style? Or different visual to distinguish "this is the conversion moment, not just an aside"? _(my lean: distinct treatment — slightly more weight, brand color block, but same DNA as other callouts)_
3. **`/book-session` tweak scope** — Hero + one paragraph only? Or extend to the `fitChecks` / `focusAreas` lists? _(my lean: hero + one paragraph for v1)_
4. **Success threshold for "the pilot worked"** — Define the rough number now so we don't move goalposts later. Suggested directional bar: 5–10 qualified waitlist signups attributable to the CTA in 2 weeks
5. **Skip flag?** — Not needed for v1: the off-limits high-traffic blog (`enneagram-and-mental-illness`) lives at `/stories/`, not `/personality-analysis/`. No conflict.

---

## What This Does NOT Commit Us To

- Any specific session price
- Any specific session length
- Any specific delivery format (video vs. phone)
- Building the async written dossier
- Removing `EnneagramCTASidebar` from any other route
- A second-pass on `/book-session` design

Each of these is a follow-up decision after we see Phase 1 numbers.
