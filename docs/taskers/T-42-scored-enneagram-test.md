<!-- docs/taskers/T-42-scored-enneagram-test.md -->

# Tasker: Scored Enneagram Test

**For:** whoever builds a real, scored Enneagram test on 9takes (DJ, or an agent working from DJ's design).
**Owner:** DJ
**Created:** 2026-10-06
**Status:** Design interview done 2026-10-06. DJ described his process and settled the four forks (§3). The user flow, a draft copy bank and a clickable prototype are in `docs/taskers/T-42-assets/user-flow.md`. Next: DJ edits the draft copy, then the build. This tasker records why the test matters, the evidence, the constraints and what "done" means for search and list inclusion.
**Related:** `docs/seo/2026-10-06-keyword-and-outreach-map.md` (Decision 2); `docs/taskers/T-41-assets/N-seo-proposals.md` §N2 (earlier analysis of `/enneagram-test`, including one test idea; reference only, not a decision); `src/routes/enneagram-test/+page.svelte`; `src/lib/components/blog/TestYourTypeCTA.svelte`; `src/blog/enneagram/enneagram-test-comparison-2026.md`; the private outreach board (link in the SEO doc), "Get listed" play.

---

## 0. What and why

Since 2026-07-18, `/enneagram-test` has been "The Enneagram Test, Reframed". It's deliberately unscored: the page says "No scoring" and "No assigned label", gives three steps, and links to questions and type pages. That stance costs four things:

1. **Search.** `/enneagram-test` gets 0–4 impressions a month. Test-intent queries are among the largest 9takes already touches. "best free enneagram test" and "best enneagram test free" together got 1,780 impressions in the 90 days to 2026-10-02 (up 2.7x since July). They land on the comparison post at position ~11–12 with about zero clicks. Google's top 10 on 2026-10-06: truity, reddit, personalitypath, enneagram-personality, talkenneagram (Substack), cloverleaf, enneagramgift, youtube, openpsychometrics, jobcannon.
2. **List inclusion.** Every "best free Enneagram test" roundup checked on 2026-10-06 lists only scored tests:
   - Simply.Coach "Top 10 Enneagram Tests in 2026" (criteria: free, 10–15 minutes, privacy-safe, good for reflection; it already lists the indie Enneagram Universe test)
   - High5Test
   - TestGorilla
   - AhaSlides
   - The Muse's free-personality-tests list
   - Totem's 25-test roundup
   - AlternativeTo's personality-test pages

   9takes qualifies for none of them today. With a scored test, about 6 become pitchable.

3. **A promise that isn't true.** `TestYourTypeCTA.svelte` renders below every Enneagram Corner and pop-culture post. Its default copy, still live on 2026-10-06, says: "Take the free 9takes Enneagram test — five minutes, no email wall, returns your dominant pattern with confidence scores." It links to `/enneagram-test`, which has no test and no scores. The scored test makes the promise true. Until it ships, consider the interim copy fix in §N2 (DJ's call).
4. **Activation.** Test-takers are high-intent first-time visitors arriving from the site's main traffic surface. Whether and how the test hands people into a give-first question is part of DJ's design.

## 1. Required reading

1. `src/routes/enneagram-test/+page.svelte`: the current reframed page. Its thesis line, "A quiz can only score the person you decided to be for five minutes", needs reconciling with a scored test. Ask DJ whether it stays, changes or goes.
2. `docs/taskers/T-41-assets/N-seo-proposals.md` §N2: why the page gets no impressions, the comparison-post cannibalization history (2025 → 2026 301 on 2026-09-21), and the salvage gap (Beth McCord, Crystal, Personality Path, 16Personalities).
3. `src/blog/enneagram/enneagram-test-comparison-2026.md`: once the test exists, it should appear here with honest disclosure that it's ours.
4. `docs/brand/messaging-hierarchy.md` (the five locked levels) and the `9takes-editorial-standards` skill.
5. `docs/seo/2026-10-06-keyword-and-outreach-map.md`: the test keyword rows and the list targets.

## 2. Constraints

- **Free, and the result is shown without an email.** This is both the roundup criteria and the CTA's existing promise. Sign-up can be offered after the result, never before.
- **No overclaiming.** Wikipedia and Google's AI Overviews frequently surface the critique that the Enneagram lacks scientific validation. Don't claim accuracy percentages or validity the test hasn't earned. Say what a self-report test can and can't tell you.
- **Brand:** stay inside the five-level message hierarchy. Don't invent a new master concept.
- **Privacy:** don't tie answers to an identity without consent. Any analytics events follow the existing tracking conventions.
- **Build budget:** `pnpm build` enforces an asset budget. Keep the test light.
- **Hidden questions:** if the test reuses question content, filter out the 358 AI-seeded questions DJ flagged on 2026-08-14. They're hidden on purpose.

## 3. Design: DJ's vision (interview first)

Open with: "Describe what you're envisioning for the test." Then ask narrowing questions only where his answer leaves real forks. Likely forks, to raise only if his answer doesn't settle them:

- question format and count (time to complete)
- scoring model and how the result is expressed (one type, top three, wings or instincts?)
- whether the result says "you are Type N" or keeps some of the "nobody assigns you a type" stance
- where it ends (a type page, a give-first question, sign-up)
- whether results get shareable URLs
- whether it lives at `/enneagram-test` or a new URL

Record DJ's answers here before building:

> **DJ's design notes (2026-10-06).** The test is the conversation DJ has when someone asks how to find their type, turned into a flow. It deduces one or two types.
>
> 1. **Groundwork.** Personality forms around one of three hard emotions: anger, shame, fear. Most other negative feelings are versions of them (anger: resentful, frustrated; fear: anxious, worried, stressed; shame: insecure, less than, "other than"). Everyone feels all three. One shows up most.
> 2. **Find the emotion.** Which one comes up most day to day? Alternate: which one do you empathize with most in other people?
> 3. **Its strength.** Each emotion builds a strength: shame → emotional intelligence, fear → intellectual intelligence, anger → instinctual intelligence.
> 4. **Three ways to relate to it.** Use it (it gives you energy), push it down ("I don't want to feel this right now"), or don't notice it (it drives you from the background). DJ's map: **uses it 8 / 4 / 6, pushes it down 1 / 2 / 7, unaware 9 / 3 / 5.**
> 5. **Meet the three types** in that emotion: core fear, relationship to the emotion, patterns, special intelligence. The person picks. Relating to two is fine.
> 6. **Tiebreak:** go back to each type's core fear and core motivation.
> 7. **Still unsure:** ask a friend, a parent, someone who knows you well.
>
> **Forks DJ settled:** pure self-pick at every step (no rated statements, no percentages); "ask someone" is a friend link (the friend answers about you before seeing your pick, and both see the comparison); the result offers three exits: answer a question as your type, read your type page, send the friend link.
>
> **Full flow, copy bank, defaults Claude picked (veto-able) and risks:** `docs/taskers/T-42-assets/user-flow.md`. **Clickable prototype (private):** https://claude.ai/artifact/D7txmWh3hqBDAjs8CWWBn3
>
> **Naming note:** with self-pick, "scored" in this tasker's title now means "ends in a typed result", not a numeric score. The `TestYourTypeCTA` promise of "confidence scores" has to change at launch (user-flow §8).

## 4. Definition of done (search and lists)

1. The test page's title and H1 name the intent ("free Enneagram test"). The meta description states that it's free, how long it takes, and that there's no email wall.
2. The intro and explanatory content are server-rendered, so Google sees a real page, not an empty app shell.
3. The comparison post (`enneagram-test-comparison-2026.md`) lists the 9takes test with disclosure. `/enneagram-test` links to the comparison post for people who want other options.
4. `TestYourTypeCTA` copy matches what the test actually does.
5. Passes `pnpm check`, `pnpm test`, `pnpm build` and `pnpm crosslinks:check`. Verified on mobile.
6. Outreach after launch: work the test roundups on the outreach board ("Get listed" play: Simply.Coach, High5Test, TestGorilla, AhaSlides, The Muse, Totem, AlternativeTo). DJ sends.
7. Measure against the GSC baseline in `docs/data/gsc/2026-10-04-queries.csv`:
   - `best free enneagram test`: 817 impressions, position 11.9
   - `best enneagram test free`: 963 impressions, 10.3
   - `best enneagram test`: 90, 31.3
   - `most accurate enneagram test`: 63, 24.1
   - `free enneagram test`: 18, 40.3

   Read again 28 and 56 days after launch.

## 5. Out of scope

- Designing the test without DJ.
- Paid or email-gated results.
- Claims of scientific validity.

## 6. What was actually done

**2026-10-06: built and verified locally, not yet deployed.**

- `/enneagram-test` is now the test (DJ's flow, `docs/taskers/T-42-assets/user-flow.md`). The title and H1 name the intent. The intro, how-it-works section, honest limits, nine-type list and FAQ (with FAQPage JSON-LD) are server-rendered.
- Private result page at `/enneagram-test/result/[token]` and friend link at `/enneagram-test/read/[token]`. Both are noindex and no-store. The friend sees the test-taker's picks only after answering.
- The email ask is optional, comes after the result, and only covers "email me when someone answers." It skips suppressed addresses and caps at 20 emails per result. A stop link is included.
- **Migration `20261006120000_enneagram_test.sql` is applied to production** (two new tables, RLS on, admin-only policy) and recorded in `supabase_migrations.schema_migrations`.
- `TestYourTypeCTA` copy no longer promises confidence scores.
- The comparison post lists the 9takes test as section 6 with a disclosure, plus a table row and a "which test" pick. `lastmod` is untouched (DJ manages it).
- Verified: `pnpm check` 0 errors, `pnpm test` 1655 passing (38 new), `pnpm build` and the server-runtime check pass, lint gates pass (the only Prettier warning is in someone else's `docs/blog-automation/backlog-queue.json`). Walked through end to end on a dev server against the real database: the mismatch branch, both groups, two picks, the tiebreak "both", a saved result, the name save, the friend flow and reveal, and the read landing on the result page. Checked at 390px with no horizontal scroll. Test rows were deleted afterward.
- Still open: deploy; DJ's per-type question picks (`CURATED_QUESTION_SLUGS` in `src/lib/enneagramTest/content.ts`, empty means fall back to the most-answered unflagged questions); the outreach in §4.6; the 28/56-day GSC readout.
