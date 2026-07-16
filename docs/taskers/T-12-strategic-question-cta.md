<!-- docs/taskers/T-12-strategic-question-cta.md -->

# Tasker: One Strategic Question Per Blog (Extend the Chorus to Markdown Blogs)

**For:** the agent assigned to pilot the strategic-question CTA on enneagram-corner blogs.
**Owner:** DJ
**Created:** 2026-07-15
**Status:** GO. Wave 1 approved by DJ 2026-07-15 ("Let's do it"): the masking question on `enneagram-and-adhd`, `depression-patterns`, `neurodiversity-vs-personality`. All five decisions resolved. Question creation workflow: DJ authors the question himself via `/questions/create` under his own account (DJWayne35) for real provenance, then posts the first answer so it never sits at zero; the executing agent wires the slug and builds everything else (see Phase C step 7). Independent of the T-01..T-11 queue.
**Related:** `docs/content-research/2026-07-15-enneagram-demand-gap-research.md` (the research that motivated this), `docs/product/the-chorus-vision.md`, `docs/product/the-mirror-moment.md`, memory `enneagram-positioning-difference-pitch` (the do-not-write list applies to question copy too). This tasker absorbs the "ADHD-cluster give-first test" proposed in the demand-gap synthesis: they are the same experiment.

---

## 0. What and why

DJ's vision (2026-07-15): each blog gets ONE strategic question as its primary call to action, placed at the moment in the piece where the reader has been built up to answer it. Not "sign up for this, sign up for that." A thought-provoking question that grabs the reader at the moment they are ready to give their take, acting as a window into the rest of the questions platform. Bottom-of-post blog suggestions stay; the CTA pile goes.

Question craft bar, in DJ's own example: for a Tim Ferriss (Type 1) analysis, a bad question is "Do you have perfectionistic tendencies?" A good question is "How do you react to people when you notice they're being too perfectionistic?"

Two constraints DJ added on review (2026-07-15 evening): email capture must NOT be traded away for contributions (the pilot is additive, and email capture moves downstream of the answer, see step 5b), and the current Chorus UI failed its most important user test: DJ himself did not understand what it was doing and found it visually goofy. Clean, minimal, self-explanatory is a hard requirement (step 5a). His framing for placement: like a YouTube ad, shown at the exact moment interest peaks, except it must read as the article's own next beat, never as an interruption.

**The core discovery of the spike: this feature already exists in production.** The `NineChorus` widget on `/personality-analysis/[slug]` is exactly this mechanic:

- One evergreen question per person, stored in `blogs_famous_people.chorus_question` + `chorus_question_url` (migration `supabase/migrations/20260615_chorus.sql:64-74`).
- Answer-in-place: textarea gated at 3+ words, submit hits `POST /api/nine/mirror` (`src/lib/components/blog/NineChorus.svelte:46-60`).
- The answer is written as a REAL comment on the backing `questions` row via `create_comment_atomic` (`src/routes/api/nine/mirror/+server.ts:72-85`), so it also unlocks the give-first wall on `/questions/[slug]`.
- Reveal: the reader's take, an LLM mirror reflection with a resonant type, nine pre-seeded typed takes, a share block, and a link to the full question page (`NineChorus.svelte:230-260`).
- Seeding machinery exists: `scripts/generate-chorus.mjs` pre-generates the question + nine takes per subject and creates the backing `questions` row DORMANT (`data.source='chorus'`, hidden from the questions feed until `comment_count>0`, un-hidden by the `tag-chorus-questions` cron).

So this tasker is NOT "design a new feature." It is: **extend the Chorus pattern from the DB-driven personality-analysis template to the markdown blogs (enneagram-corner first), with author-controlled placement at the earned moment, and strip the competing CTAs on pilot pages.**

What the markdown blogs run today instead (`src/routes/enneagram-corner/[slug]/+page.svelte:133-147`): 4 to 5 competing CTAs per page. `TestYourTypeCTA` (quiz card), `EnneagramCTASidebar` (scroll-triggered email capture, logged-out), `EmailSignup` join block (logged-out), `SuggestionsBlog`, plus typically one bare `/questions` text link in the body. Only 4 of ~43 `/questions` links across all blog markdown deep-link to a specific question. No markdown blog embeds a question.

Why one contextual question should beat the pile (evidence detail in section 3): in-content contextual CTAs produce 47 to 93 percent of a post's conversions versus roughly 6 percent for end-of-post banners (HubSpot); pages with one link convert at 13.5 percent versus 10.5 percent with five or more (Unbounce, 18,639 pages); engaged attention concentrates below the fold and median abandonment hits at 50 to 60 percent of article depth, so the question must land mid-article, not at the end.

---

## 1. Required reading

1. This file, top to bottom.
2. `docs/content-research/2026-07-15-enneagram-demand-gap-research.md`, sections 4, 5, 7 (the do-not-write list, the difference pitch, the pathway). Question copy must comply with section 4.
3. `docs/product/the-chorus-vision.md` (the product thesis this executes).
4. `src/lib/components/blog/NineChorus.svelte` + `src/routes/api/nine/mirror/+server.ts` + `src/lib/server/nineTakes.ts` (the existing implementation).
5. `scripts/generate-chorus.mjs` (question + seed generation, dormant-question mechanism).
6. `supabase/migrations/20260613_give_first_funnel_events.sql` and `supabase/migrations/20260615_chorus.sql`.
7. `docs/taskers/README.md` hard rules: never touch `lastmod`, zero em-dashes, `enneagram-and-mental-illness` is frozen, no wide operations (other agents and DJ edit in parallel).

---

## 2. Decisions DJ must make before execution

| #   | Decision                      | Options                                                                                                                                                                                                                                         | Recommendation                                                                                                                                                                                                                                                                                                       |
| --- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Widget depth                  | (a) Full Chorus inline (answer + mirror + nine takes reveal, like personality-analysis). (b) Lighter teaser: answer-in-place posts the comment, then routes to the now-unlocked `/questions/[slug]` for the reveal.                             | RESOLVED 2026-07-15: (a), the full mechanic, behind a REDESIGNED minimal UI (step 5a). DJ did not understand the current widget and found the UI goofy; clean, minimal, self-explanatory is a hard requirement, not a polish item.                                                                                   |
| 2   | Seed authorship               | (a) AI-generated nine takes (current `generate-chorus.mjs` behavior). (b) Human-written seeds (DJ, typed friends, anonymized coaching material). (c) AI-drafted, DJ-edited.                                                                     | (c) for the pilot's 1 to 2 questions. Every cold-start precedent (Reddit, Quora, Stack Overflow) says quality and real voice made seeding work. At pilot scale, editing nine takes per question is cheap and sets the tone the clustering hypothesis needs.                                                          |
| 3   | Which CTAs die on pilot pages | Candidates: `TestYourTypeCTA`, `EnneagramCTASidebar` (email), `EmailSignup` join block. `SuggestionsBlog` stays per DJ.                                                                                                                         | RESOLVED 2026-07-15: email capture is NOT traded away (DJ). The pilot is additive: the question is the primary in-flow ask, competing CTAs may be visually demoted but capture surfaces stay, and a post-contribution email hook is added (step 5b). Guardrail: email signups per pilot page hold steady or improve. |
| 4   | Pilot set                     | Proposed: `enneagram-and-adhd-which-types-struggle-most` (252 clicks, 4.84% CTR, 5,205 impressions), `mental-health/enneagram-neurodivergence-guide` (141 clicks), `neurodiversity-vs-personality` (just repositioned to the difference pitch). | MAP CONFIRMS (2026-07-15): the set ranks #1 corpus-wide. One change: swap the safety-flagged `neurodivergence-guide` OUT and `depression-patterns-by-enneagram-type` IN, giving three clean pages (~337 clicks reach). The guide joins after its rebuild. Awaiting DJ final sign-off.                                |
| 5   | The pilot question itself     | Candidates in section 4.3, now feeding into the Phase 0 map rather than bypassing it.                                                                                                                                                           | MAP RECOMMENDS (2026-07-15): #1 "What's something you do every day to seem 'fine' that nobody knows is costing you effort?" (masking; serves the wave-1 set). Alternate for the same pages: the oversized-reaction question (map #5). Wave 2: the partner-quiet question on the relationship pages. DJ picks.        |

---

## 3. Evidence base (from the 2026-07-15 research sweep)

Placement and count:

- HubSpot's anchor-text CTA study: in-content anchor CTAs drove 47 to 93 percent of each post's leads; end-of-post banner CTAs averaged 6 percent. The winning format worked because it did not look like a CTA. (Original page since rewritten; numbers verified via secondary citations.)
- Grow & Convert placement benchmarks: contextual, content-tailored placement converted roughly 300 percent better than bottom-of-post; sidebars run 0.5 to 1.5 percent.
- Unbounce, 18,639 landing pages: one link = 13.5 percent conversion, 2 to 4 links = 11.9 percent, 5+ links = 10.5 percent. Fewer competing asks wins.
- Chartbeat: 55 percent of visits last under 15 seconds, but for readers who stay, 66 percent of attention lands below the fold. Median reader stops at 50 to 60 percent of article depth. Only about a third of loaders ever see end-of-article real estate.
- Nielsen Norman eyetracking (2018): 74 percent of viewing time falls within the first two screenfuls.
- Net placement guidance: the question belongs in the 25 to 60 percent depth band, at the earned moment, styled as content rather than a boxed banner. A quiet repeat of the same question at the end is acceptable (same single ask).

Question format:

- Center for Media Engagement controlled studies: embedded question interactions increase time on page versus the same information presented statically.
- Times of London: commenters read 3x as many articles as non-commenters, the most valuable visitor segment.
- r/AskReddit (~57M members) is structural proof that situational anyone-can-answer questions scale.
- Nielsen's 90-9-1 rule: ~90 percent of a community lurks. The give-first gate is a deliberate bet against that default. Expect single-digit contribution rates and judge against that baseline, not against pageviews.

Seeding:

- Reddit: ~99 percent of early submissions were the founders under pseudonyms; faked identity, never faked quality.
- Quora: founders and hand-picked experts wrote the first Q&A under real names.
- Stack Overflow: private-beta seeded critical mass before public launch; Spolsky: without it "questions go unanswered and the site becomes a ghost town."
- No published numeric seed ratio exists. Practice-derived rule: several substantive answers live BEFORE any blog points traffic at the question. The Chorus's always-complete Nine satisfies this by construction.

---

## 4. Question design

### 4.1 Principles (apply to every strategic question, ever)

1. **Answerable by anyone in 60 seconds, no homework.** No Enneagram knowledge, no self-typing, no diagnosis required to have a take.
2. **Situational, not self-diagnostic.** Ask about a moment, not an identity. "How do you react when..." beats "Are you a...". Self-diagnostic questions have one boring answer; situational questions have nine interesting ones.
3. **Other-facing or scene-facing lowers the bar at the door.** DJ's Tim Ferriss example: asking how you react to SOMEONE ELSE'S perfectionism is easier to answer than confessing your own, and the answer still reveals the answerer.
4. **The blog must earn the question.** It lands immediately after the passage that made the reader feel seen, in the 25 to 60 percent depth band. The paragraph before it does the setup work. Never cold at the top, never a footer.
5. **The question is the blog's thesis turned outward.** It should read as the inevitable next sentence of the piece, not an ad break.
6. **Divergence-rich.** The test: can you imagine a distinctly different Type 1 answer and Type 9 answer? If everyone would answer the same way, it is a poll, not a window into the nine.
7. **Native problem-language, zero jargon.** The question page can eventually rank for the native-language query (this is the translation-gap play). Do-not-write compliance: no typing strangers from one behavior, no etiology claims, no first-party stats presented as answers.

### 4.2 Anti-patterns

- "Do you have X tendencies?" (yes/no, self-diagnostic)
- "What's your Enneagram type?" (homework required, no story in the answer)
- "What do you think?" (no specific moment, invites mush)
- Any question that requires having read the blog to answer (the question page has visitors who never saw the blog)

### 4.3 Pilot question candidates (one shared question for all three ADHD/neurodivergence pilot pages; DJ picks or rewrites)

- **Q1: "What's something you blamed on your brain that turned out to be just... you?"** Native cluster language (`adhd-remainder`: "my meds fixed the focus thing, so why am I still like this?"), answerable by diagnosed and undiagnosed readers alike, story-shaped, divergence-rich.
- **Q2: "If a treatment fixed part of how your brain works tomorrow, what part of you would still be there?"** More reflective, slightly higher effort, very on-thesis for the difference pitch.
- **Q3: "Is this an ADHD thing, or an everybody thing? Name the thing."** Closest to the raw cluster (`is-it-just-me-denominator`), invites list-style answers, lowest effort to answer, weakest for clustering contrast.

Reuse check before creating anything new: 4 deep-linked questions already exist in blog markdown (`something-going-change-yourself`, `what-productivity-method-failed-for-you`, `typically-handle-disagreements-close-friends-family`, one duplicate). None fits this cluster; a new question is justified.

---

## 5. Implementation steps, in order

### Phase 0: the strategic question map (research, launched 2026-07-15)

0. Deliverable: `docs/content-research/2026-07-15-strategic-question-map.md`. For each of the top ~20 content pages by GSC clicks: the page's emotional thesis, the exact mirror-moment passage where the question belongs (quoted, with location), the demand cluster(s) it maps to, 1 to 2 question candidates written to section 4.1 principles, and shared-question groupings (several pages, one question). The map ranks opportunities by traffic reached x cluster demand x divergence-richness, and honestly flags pages where no good question exists (forcing one is worse than none). Frozen and in-flight pages (`enneagram-and-mental-illness`, T-04 astrology, T-05 compatibility matrix) are mapped but not pilot-eligible.

**PHASE 0 COMPLETE 2026-07-15: the map is written and ranked.** Headline: DJ's conditional holds, the ADHD/neurodivergence set feeds the #1-ranked question, but the winning question is the masking question ("What's something you do every day to seem 'fine' that nobody knows is costing you effort?"), not an ADHD-specific question. Recommended wave 1: that question on `enneagram-and-adhd`, `depression-patterns`, and `neurodiversity-vs-personality` (~337 clicks monthly reach, zero flags). The neurodivergence guide joins after its safety-flag rebuild. The map also surfaced a structural bug: the enneagram-corner route globs `src/blog/enneagram/**/*` recursively, so every `mental-health/` file is served at two live URLs, splitting GSC equity; fix canonicals before measuring any pilot on those pages.

### Phase A: instrumentation first (nothing ships unmeasured)

1. The mirror endpoint (`src/routes/api/nine/mirror/+server.ts`) records `nine_user_takes` and the question comment but does NOT emit `give_first_funnel_events`. Add a `contribution` event emission there (wrapper exists: `src/lib/server/giveFirstFunnel.ts`), and a widget-impression event or reuse of `gate_shown` semantics for "widget seen" so the funnel reads widget_seen -> contribution per source page. Keep the existing unique-constraint semantics.
2. Stamp UTMs on every outbound link the widget renders (`utm_source=blog&utm_medium=strategic_question&utm_campaign=<pilot>&utm_content=<blog-slug>`). Pattern to copy: `src/lib/components/blog/callouts/BookSessionCTA.svelte:19-27`.
3. Write the canonical measurement query (per source blog: widget impressions, answers, question-page click-throughs, email signups on the page) and save it in this file's section 8 when done. Blog-to-question attribution for link-out traffic joins `give_first_funnel_events` to page analytics on `fingerprint` (`9tfingerprint` cookie, `src/lib/analytics/visitorIdentity.ts`).

### Phase B: generalize the Chorus to markdown blogs

4. `getChorus` (`src/lib/server/nineTakes.ts:107-137`) currently reads `blogs_famous_people` by slug. Generalize: markdown blogs declare their question in frontmatter (proposed field: `strategic_question_url: <questions.url slug>`), and `nine_takes` rows key by question rather than person-slug (check the current key shape and migrate additively if needed; never break the personality-analysis path).
5. Create the MDsvex-usable component (thin wrapper around `NineChorus` or a `subjectType="blog"` mode). Authors import it in the markdown script block (same pattern as `QuickAnswer`) and place it AT THE EARNED MOMENT in the body. Placement is editorial, per-blog, by hand. Style it as content, not a banner (evidence: banner blindness).

5a. **Minimal-UI redesign (hard requirement).** DJ did not understand what the current widget was doing and found the UI goofy. The blog-embedded state is exactly three elements set in article typography: the question, a textarea, one button, plus one quiet line stating the deal ("Give your take. Then see how nine different minds answered it."). No card chrome, no QR code, no share block, no type badges in the pre-answer state. The post-answer reveal may stay richer (mirror + nine takes); the QR and share extras move to the question page. Acceptance test: a first-time reader understands from one glance, without scrolling, what will happen when they hit the button. Run the `ui-reviewer` agent on the redesign before the pilot ships, and have DJ approve a screenshot.

5b. **Post-contribution email capture.** After a reader submits a take, offer one quiet email hook tied to what they just did: "Get notified when someone answers you" (new takes on this question). This converts the contribution moment into a better email moment than a scroll-triggered sidebar (sidebar benchmarks: 0.5 to 1.5 percent). Reuse `/api/signups` with a distinct source tag so it is measurable. This is how the pilot stays email-positive rather than email-neutral. 6. Wire the frontmatter field into the enneagram-corner `[slug]` route so that when `strategic_question_url` is present, the route suppresses the CTAs DJ chose to remove in decision 3 (`src/routes/enneagram-corner/[slug]/+page.svelte:133-147`). One frontmatter field both mounts the question and demotes the competition.

### Phase C: question + seeds

7. Backing question creation, wave-1 workflow (resolved with DJ 2026-07-15): DJ creates the question through the normal `/questions/create` UI under his own account (DJWayne35). Rationale: real human authorship (the Quora seeding lesson), final wording control at the moment of creation, and the UI path runs the full production pipeline (slug generation, async tagging, ES indexing) that a hand-inserted row would skip. Immediately after creating, DJ posts the FIRST answer himself (his real take), so the question is never live at zero answers; that replaces the dormant flag for wave 1. The scripted dormant path (`data.source`, feed-hidden until answered; see `20260615_chorus.sql:141` and the `tag-chorus-questions` cron) remains the right mechanism for scale-out waves where DJ is not hand-authoring. Never create a feed-visible empty question. One wave at a time: do NOT pre-create the wave 2 and 3 questions.
8. Generate nine takes, then DJ edits them per decision 2. Wave-1 drafts live at `docs/content-research/2026-07-15-wave1-seed-takes.md`. **Seed authenticity spec (DJ, 2026-07-16):** takes must sound like nine different humans, not nine paraphrases. Each take is written from a hidden persona (job, age, situation; never displayed) with a per-type response profile governing propensity, LENGTH, and texture: types differ in how much they would even say to a vulnerability question (a 4 writes long and interior, a 5 writes three precise sentences, an 8 barely answers, a 9 meanders and trails off). Uniform length or uniform polish is an automatic fail. **Labeling rule:** takes render as anonymous, type-labeled voices only, no usernames or avatars, never posted as comments or fake accounts; on an anonymous platform an unnamed take is the same artifact a real user produces. **Lifecycle rule:** seeds are scaffolding; as real answers accumulate, the best real take per type replaces the seed (DJ curates), so seeds are expected to disappear over time.

### Phase D: pilot placement

9. Place the question on the three pilot pages at the earned moment. For `enneagram-and-adhd-which-types-struggle-most` that is immediately after the passage on what medication does not fix (locate it; it is the page's mirror moment). Do not touch `lastmod`. Zero em-dashes in any copy.
10. Re-read each pilot page top to bottom after placement. The question must read as the next sentence of the piece.

### Phase E: run and judge

11. Run 3 to 4 weeks. Success gates (set against the 90-9-1 baseline and current near-zero): CONTINUE if 10+ organic answers per week across the three pages by week 2, or clear week-over-week growth. ITERATE PLACEMENT if impressions are healthy but answers are near zero (move the widget, change the question). STOP AND RETHINK if widget impressions themselves are near zero (traffic is not reaching the depth band; the placement assumption is wrong).
12. Guardrails: email signups per pilot page hold steady or improve (the step 5b hook should make the pilot email-positive), organic clicks/impressions per GSC unchanged (no SEO harm), question feed not polluted (dormant flag held).

---

## 6. Verification checklist

```bash
# frontmatter present on exactly the pilot pages
grep -rl "strategic_question_url" src/blog | sort

# no lastmod modified (diff against main for pilot files)
git diff main -- src/blog/enneagram/enneagram-and-adhd-which-types-struggle-most.md | grep -c "^[+-]lastmod"   # must be 0

# zero em-dashes introduced anywhere
git diff main -- 'src/blog/**/*.md' | grep "^+" | grep -c "—"   # must be 0

# build + types
pnpm check && pnpm build

# gated comments never in SSR markup for the backing question (view-source guardrail)
curl -s https://9takes.com/questions/<pilot-question-slug> | grep -c "COMMENTS HIDDEN"   # gate present for fresh visitor

# dormant question hidden from feed until answered
# (SQL) select url, comment_count, data->>'source' from questions where url = '<pilot-question-slug>';

# funnel is recording with source attribution
# (SQL) select event_type, count(*) from give_first_funnel_events where question_id = <id> group by 1;
```

## 7. Risks and gotchas

- **Dual-URL bug on `mental-health/` pages (found by Phase 0).** The enneagram-corner `[slug]` route resolves subdirectory files at both `/enneagram-corner/<slug>` and `/enneagram-corner/mental-health/<slug>`; GSC indexes both. Canonicalize or redirect before measuring any pilot on those pages, or the traffic guardrail reads noise. Not owned by any tasker yet.
- **Safety-flagged hosts.** `neurodivergence-guide` and `addiction-recovery-guide` carry quality D / safety-gate FAIL frontmatter. No give-first widget on safety-flagged mental-health pages until their rebuilds land, unless DJ explicitly overrides.
- **Parallel work.** T-04/T-05 are actively rewriting the astrology and compatibility pages; do not pilot there. The neurodivergence guide has a known em-dash lint violation in its description frontmatter (README loose thread); fixing it is in-scope for whoever touches that file first, but do not let it expand this tasker.
- **`enneagram-and-mental-illness` is frozen.** Highest-traffic page, tempting target, do not pilot there without DJ's explicit call.
- **Do not mass-create questions.** One shared question for the pilot. An orphan question with zero answers is negative social proof. The many-to-one mapping (several blogs, one question) is a feature, not a compromise.
- **Anonymous answering is one top-level answer per question per fingerprint** (`src/routes/questions/[slug]/+page.server.ts:644-666`); a second answer requires signup. That is the built-in account-creation loop; do not "fix" it.
- **Mirror endpoint costs an LLM call per answer** (throttled 1 per 3s per identity). Fine at pilot scale; note it before wide rollout.
- **CTA dilution now runs the other way.** DJ has ruled out trading email captures for contributions, so the pilot ADDS a primary ask to pages that keep their capture surfaces. The single-CTA evidence (13.5 vs 10.5 percent, Unbounce) says dilution is real. Mitigate by visually demoting (not removing) competing CTAs on pilot pages, lean on the step 5b post-contribution hook, and let the pilot measure both email capture and contributions before deciding anything permanent.
- **Seed authenticity.** Seeds are labeled honestly if surfaced on the question page, and DJ-edited per decision 2. Never fabricate engagement stats about them (do-not-write list, item 5).
- **The widget must not leak gated comments into SSR markup or JSON-LD** (existing guardrail comment at `src/routes/questions/[slug]/+page.svelte:471-481` explains the contract; the blog widget inherits it).

## 8. What was actually done

**2026-07-15/16, wave 1 build (Phases A, B, D implemented; Phase C script written, NOT run).**

- **No migration needed.** `nine_takes` already keys by `(subject_type, subject_slug)`; the blog path uses `subject_type = 'question'`, `subject_slug = questions.url`. `nine_takes.situation` carries the punctuated question text (the DB question row for id 567 lost its punctuation in the create UI), and the mirror prompt prefers it.
- **Server:** `getChorusForQuestion()` added to `src/lib/server/nineTakes.ts` (additive; personality-analysis path untouched). `/api/nine/mirror` now accepts `subjectType: 'question'` + `questionUrl` + optional `sourcePath`, reuses `generateMirror` and the `create_comment_atomic` write-through, keeps the 3s throttle, and emits a `contribution` funnel event (both subject types, path-attributed).
- **Impressions:** the enneagram-corner `[slug]` server load emits `gate_shown` (via new `recordStrategicQuestionImpression` in `giveFirstFunnel.ts`) when frontmatter declares `strategic_question_url`; unique-constraint semantics intact (one row per visitor per question, earliest path wins). Depth-band "actually scrolled to it" is a client-side PostHog event `strategic_question_seen` fired by the widget's IntersectionObserver.
- **Component:** `src/lib/components/blog/StrategicQuestion.svelte` (minimal per 5a: question as content heading, deal line, textarea, one amber button; reveal = your take + mirror + nine takes + ONE UTM-stamped question-page link; 5b email hook below the nine, dismissible, posts to `/api/signups` with a `source=strategic_question` field and a PostHog `strategic_question_email_signup` event). UTMs: `utm_source=blog&utm_medium=strategic_question&utm_campaign=wave1-masking&utm_content=<blog-slug>`.
- **Placement:** frontmatter + widget on the three pilot pages at the mapped seams (ADHD page after the Type 4 flooding passage, depression page after the Type 7 hidden-depression passage, neurodiversity page after the "asked to be explained" section). `lastmod` untouched, zero em-dashes. `TestYourTypeCTA` demoted to compact (not removed) on pages with the frontmatter field; email capture surfaces untouched.
- **Seeds:** `scripts/seed-strategic-question.mjs` written (idempotent upsert, dry-run flag, em-dash guard). NOT run; awaits DJ's edit pass on `docs/content-research/2026-07-15-wave1-seed-takes.md`.

### Canonical measurement queries

```sql
-- Per-source-blog funnel for the wave-1 question (id 567).
-- One row per visitor per event per question; path = page of first occurrence.
SELECT
  path,
  count(*) FILTER (WHERE event_type = 'gate_shown')   AS widget_impressions,
  count(*) FILTER (WHERE event_type = 'contribution') AS contributions
FROM give_first_funnel_events
WHERE question_id = 567
GROUP BY path
ORDER BY widget_impressions DESC;

-- Visitor-level conversion, widget served -> contributed:
WITH gate AS (
  SELECT DISTINCT fingerprint FROM give_first_funnel_events
  WHERE question_id = 567 AND event_type = 'gate_shown'
    AND path LIKE '/enneagram-corner/%'
), contrib AS (
  SELECT DISTINCT fingerprint FROM give_first_funnel_events
  WHERE question_id = 567 AND event_type = 'contribution'
)
SELECT
  (SELECT count(*) FROM gate) AS widget_served,
  (SELECT count(*) FROM contrib WHERE fingerprint IN (SELECT fingerprint FROM gate)) AS converted;

-- Email signups attributable to pilot pages (first-touch approximation):
SELECT first_landing_path, count(*)
FROM signups
WHERE first_landing_path IN (
  '/enneagram-corner/enneagram-and-adhd-which-types-struggle-most',
  '/enneagram-corner/depression-patterns-by-enneagram-type',
  '/enneagram-corner/neurodiversity-vs-personality'
)
GROUP BY 1;
```

PostHog (not SQL): `strategic_question_seen` by `blog_slug` = depth-band impressions; `strategic_question_email_signup` by `blog_slug` = per-page email conversions from the widget; question-page click-throughs = pageviews of the question URL filtered on `utm_medium=strategic_question`, broken out by `utm_content`. Note the in-house page analytics strip query strings, so click-through UTM attribution lives in PostHog and in `visitor_first_touch` (first-touch only). The `signups` table has no per-signup source column; the widget sends `source=strategic_question` (currently ignored by the endpoint, forward-compatible) and the PostHog event is the measurable channel.

### Go-live order (remaining)

1. DJ edits/approves the seed takes, then: `node scripts/seed-strategic-question.mjs --dry-run` and, if happy, without the flag.
2. Deploy (no migration to apply).
3. Verify: widget renders on the three pages, an answer lands as a comment on `/questions/whats-something-every-day-seem-fine-nobody-knows-costing-effort`, funnel rows appear for question 567.
4. Run the ui-reviewer screenshot pass for DJ approval (5a acceptance test).
