<!-- docs/development/rabbit-hole-retrofit-tracker.md -->

# Enneagram Rabbit Hole Retrofit — Tracker

**Created:** 2026-04-17
**Owner:** DJ
**Related specs:**

- `docs/development/enneagram-rabbit-hole-furniture-task.md` — implementation + rollout plan
- `docs/development/rabbit-hole-retrofit-tasker.md` — **delegation doc for the retrofit agent**
- `docs/development/rabbit-hole-retrofit-candidates.md` — prioritized retrofit queue (traffic-normalized)
- `docs/development/rabbit-hole-retrofit-traffic-analysis.md` — GSC analysis + CTR opportunity sizing
- `docs/development/url-case-redirect-audit-tasker.md` — **delegation doc for the URL case fix** (parallel workstream)
- `docs/development/rabbit-hole-baseline-snapshot.md` — pre-intervention GSC + LLM snapshot (fill-in template)
- `docs/development/llm-citation-baseline-tasker.md` — **delegation doc for the Chrome-browser LLM baseline agent**
- `9takes-strat.md` Part 4 — Fan-Out Audit
- `docs/daily-briefs/2026-04-17_pickup-brief.md` §2.2 — current state

---

## Goal

Retrofit the `.enneagram-rabbit-hole` furniture block onto the highest-leverage personality analysis pages, pairing the retrofit with a Fan-Out Audit so each updated page covers the long-tail LLM sub-queries (`[Person] 3w4`, `[Person] sx/so subtype`, `[Person] actually type X or Y`).

## Workstreams

### A. Existing-mention scan (THIS SESSION)

Scan local personality drafts in `src/blog/people/drafts/` for mentions of:

- Wings (`wing`, `3w4`/`6w7`-style codes)
- Instinctual subtypes (`subtype`, `sp/so`, `sx/sp`, `instinctual`)
- Counter-typing (`counter-type`, `countertype`, `counter-typ`)
- Arrows (`integration`, `disintegration`, `stress arrow`, `growth arrow`)

**Why:** pages that already discuss these topics are the cleanest retrofit targets — the raw material exists, we just need to lift it into the rabbit hole block and enforce the four-section structure. Lower effort per page, higher coverage gain per hour.

**Caveat:** published content lives in `blogs_famous_people` (DB), not the drafts folder. Drafts may lag DB edits made via `/admin/content-board`. Use this list as a strong-signal candidate pool, then verify against DB state before editing.

**Output:** `docs/development/rabbit-hole-retrofit-candidates.md` — ranked candidate list with which of the four signals each page has.

### B. Top-traffic list (SEPARATE, DJ pulling manually)

DJ will pull top personality pages from analytics for:

- Past 3 months
- Past 1 month

Source: `get_page_analytics_pages` RPC with `p_scope='people'` (available via `/admin/analytics/top-pages` or direct RPC).

**Output:** merge top-traffic list with the existing-mention list → prioritized retrofit queue.

### C. Fan-Out Strategy (AFTER B)

For the merged top-10 list:

1. Per page, enumerate top 5 LLM fan-out sub-queries.
2. Mark which sub-queries the current page covers vs misses.
3. Produce a gap report feeding the rabbit hole content for each page.

**Output:** `docs/research/fan-out-audit-top-10.md`.

### D. Validation prerequisite (BLOCKS RETROFIT)

Per the furniture spec Step 3, the rabbit hole has **not yet been validated on a real published blog**. Before retrofitting at scale, hand-insert one on Elon / Taylor Swift / Peter Thiel via `/admin/content-board` and run the visual + SEO + LLM checks.

---

## Status

| Workstream                 | Status                         | Next step                                                                                                                                                                                                                                                                                                                                                                  |
| -------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A. Existing-mention scan   | ✅ Done                        | See `rabbit-hole-retrofit-candidates.md`                                                                                                                                                                                                                                                                                                                                   |
| B. Top-traffic pull        | ✅ Done (GSC)                  | See `rabbit-hole-retrofit-traffic-analysis.md`                                                                                                                                                                                                                                                                                                                             |
| C. Merged priority queue   | ✅ Done                        | See `rabbit-hole-retrofit-candidates.md` §1                                                                                                                                                                                                                                                                                                                                |
| D. Single-blog validation  | ✅ Live                        | Elon Musk pushed to DB (confirmed 2026-04-17). Snapshot baseline CTR + re-measure in 2 weeks                                                                                                                                                                                                                                                                               |
| E. Phase 2-2g retrofits    | ✅ 36 drafts retrofitted; commit + DB verify + dev render pending | Phases 2 through 2g edited locally. `personBlogParser.js --changed` reported 29 DB updates, preserving existing published rows. Remaining: git commit, `/admin/content-board` spot-check, desktop/mobile visual QA. Phase 3 Class B scratch authoring still gated on 2026-05-01 measurement. |
| F. URL case redirect audit | 🟡 Code merged, deploy pending | 301 redirect + `.eq()` tightening landed in `src/routes/personality-analysis/[slug]/+page.server.ts` on 2026-04-17. Audits confirmed DB clean and internal links clean. Remaining: baseline GSC snapshot (MUST precede deploy) → deploy → curl verify → GSC re-crawl for 8 high-impression URLs. See `url-case-redirect-audit-tasker.md` §8. |
| G. Baseline snapshot       | ⏸ Blocks measurement          | GSC + LLM baseline template at `rabbit-hole-baseline-snapshot.md` (fill-in). Chrome LLM agent at `llm-citation-baseline-tasker.md`. Must be captured before URL redirect deploys.                                                                                                                                                                                                   |
| H. FAQPage JSON-LD         | ⏸ Queued                      | New tasker at `docs/planning/people-blog-faqpage-jsonld-tasker-2026-04-17.md` — P0 per strat Tier 0 #3. Pairs with rabbit hole's four H3s.                                                                                                                                                                                                                                         |

---

## Current state — end of 2026-04-17

**36 drafts now contain the rabbit hole block**, up from 4 at morning. Expansion went well beyond the original Phase 2 plan — most of the Tier 3 candidate pool was retrofitted in consecutive batches 2 through 2g.

### What's complete

- ✅ **Phase 1 (validation):** Elon Musk live in DB.
- ✅ **Phase 2 Class A (all 6):** IShowSpeed, Madison-Beer, Jack-Black, Hasan-Piker, Caleb-Hearon, Dario-Amodei.
- ✅ **Tier 4 pilot (all 4):** Caleb, Dario, Pete-Davidson, Johnny-Depp.
- ✅ **Tier 3 bonus batch (22 pages):** Andrew-Schulz, Bobbi-Althoff, Scarlett-Johansson, Xi-Jinping, xQc, Henry-Cavill, Billie-Eilish, Princess-Diana, AOC, Donald-Trump, Napoleon-Bonaparte, Pedro-Pascal, Saagar-Enjeti, Sam-Altman, JD-Vance, Bella-Hadid, Marilyn-Monroe, Cillian-Murphy, Meghan-Markle, Abraham-Lincoln, Gavin-Newsom, Shawn-Ryan, Tara-Yummy, plus Timothee-Chalamet (partial Class B, raw material supported it).
- ✅ **URL redirect code** merged (301 + `.eq()` tightening in `+page.server.ts`).
- ✅ **Parser sync** reported 29 rows updated via `personBlogParser.js --changed`.

### What's left for DJ (ranked by leverage)

1. **Commit the 33 modified drafts + 1 new draft (Asmongold) + the parser/analytics changes.** One clean commit before anything else moves. (`git add -p` + HEREDOC message.)
2. **Deploy the URL redirect fix, then snapshot GSC baseline.** Order matters — baseline must happen **before** deploy or pre/post comparison gets confounded. See `rabbit-hole-baseline-snapshot.md` §1 for the fill-in template, and `url-case-redirect-audit-tasker.md` §8 for the deploy verification checklist.
3. **Run the Chrome LLM baseline tasker.** Open a fresh Chrome session logged in to Claude/ChatGPT/Perplexity, hand the agent `llm-citation-baseline-tasker.md`. Not confounded by URL deploy — can happen any time before ~2026-04-28.
4. **Sample-verify 3–4 retrofits in `/admin/content-board`.** The parser reported success on all 29 rows; spot-check high-traffic pages (IShowSpeed, Madison-Beer, Scarlett-Johansson, Donald-Trump) to confirm the DB reflects the retrofit.
5. **Dev render pass on sampled pages.** None of the 36 retrofits have been visually QA'd. Run `pnpm dev`, load 4–5 representative slugs, check desktop + mobile + open/closed rabbit-hole states. Furniture spec §3c has the exact checklist.
6. **Phase 3 Class B stragglers (7 pages).** Tom-Hiddleston, Dua-Lipa, Sydney-Sweeney, Jennifer-Lopez, Ryan-Gosling, Druski, Gwyneth-Paltrow. Still formally gated on 2026-05-01 measurement; given the pace and the fact that Timothée crossed the line already, worth deciding whether to keep the gate or proceed. These need scratch-authored rabbit holes (~2× the per-page effort).
7. **Tier 3 gaps.** J.K.-Rowling and Mr-Beast had 3/4 signals in the original scan but were not retrofitted. Verify they're either intentionally skipped or queue them.
8. **FAQPage JSON-LD workstream.** New tasker at `docs/planning/people-blog-faqpage-jsonld-tasker-2026-04-17.md` — P0 per strat Tier 0 #3, pairs with the rabbit hole. Separate workstream; delegate when bandwidth allows.
9. **Calendar the 2026-05-01 measurement.** Re-run both baseline taskers and compute deltas per `rabbit-hole-baseline-snapshot.md` §3.

### Original scan tier-breakdown (for reference)

Scanned 326 drafts in `src/blog/people/drafts/`. Full ranked list in `rabbit-hole-retrofit-candidates.md`.

- **Tier 4 — 4 pages** (all retrofitted).
- **Tier 3 — 27 pages** (25 retrofitted; J.K.-Rowling + Mr-Beast remain).
- **Tier 2 — 82 pages** (partial — Jack-Black, Madison-Beer, Hasan-Piker, Tara-Yummy, Timothée retrofitted; rest deferred).
- **Tier 1 — 132 pages** (deprioritized).

---

## Retrofits completed

### Tier 4 pilot batch (2026-04-17)

| Person        | Date       | Placement anchor (H2 name)                | Word count | Notes                                                                                  |
| ------------- | ---------- | ----------------------------------------- | ---------- | -------------------------------------------------------------------------------------- |
| Caleb Hearon  | 2026-04-17 | What is Caleb Hearon's Personality Type?  | ~660       | Draft-only (`published: false`). Renamed "Social Seven" H3 to "Community as Mission".  |
| Dario Amodei  | 2026-04-17 | What is Dario Amodei's personality type?  | ~610       | Draft-only. Deleted jargon-only wing paragraph; kept institution narrative in body.    |
| Pete Davidson | 2026-04-17 | What is Pete Davidson's Personality Type? | ~640       | Draft-only. Renamed "The 9w8" H3 to "The Furnace Beneath the Floorboards".             |
| Johnny Depp   | 2026-04-17 | "Winona Forever"                          | ~645       | **DB-published** (`published: true`) — DJ must re-push through `/admin/content-board`. |

**Gotchas:**

- **Johnny Depp is published in DB.** Draft version edited; the DB row at `blogs_famous_people` was not diffed (no DB access from agent). DJ must diff and push.
- **Arrow URL.** Tasker references `/enneagram-corner/enneagram-integration-disintegration`. That URL doesn't exist in the sitemap. Used `/enneagram-corner/enneagram-connecting-lines` (the live pillar) for all four Arrows sub-sections.
- **Frame line variant.** Used baseline frame line for Caleb/Dario/Pete; used personalized variant ("For Enneagram readers going deep on Johnny Depp. Skip if you're here for the story") for Depp only.
- **Counterarguments — no retypings.** All four preserved the existing Enneagram number in frontmatter. Alternate types proposed (Caleb: Type 2; Dario: Type 6/1; Pete: Type 4; Depp: Type 7/9) are framed as "why people mistype, and why the current typing holds."
- **Step 6 dev render not executed.** Agent did not run `pnpm dev` or load pages in a browser. Visual verification on desktop + mobile deferred to DJ.

### Phase 2 Class A batch (2026-04-17)

Traffic-normalized work order from candidates §1.2. Caleb and Dario counted here as well (completed in the Tier 4 batch above). This adds the remaining four.

| #   | Person       | Date       | Placement anchor (H2 name)  | Word count | Notes                                                                                                               |
| --- | ------------ | ---------- | --------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------- |
| 1   | IShowSpeed   | 2026-04-17 | How He Is Changing          | ~665       | **DB-published.** Stripped 8w7 from TL;DR title + H3; parser sync later reported DB update.                         |
| 2   | Madison Beer | 2026-04-17 | The Discipline Nobody Sees  | ~610       | **DB-published.** Stripped 4w3 wing argument; parser sync later reported DB update.                                 |
| 3   | Jack Black   | 2026-04-17 | When the Showman Goes Quiet | ~610       | Frontmatter `published: false`, but parser sync reported existing DB row `published=true`; verify in content-board. |
| 4   | Hasan Piker  | 2026-04-17 | Burnout and the Softer Side | ~695       | Frontmatter `published: false`, but parser sync reported existing DB row `published=true`; verify in content-board. |

**Gotchas (Phase 2):**

- **DB sync reported after this pass.** `node scripts/personBlogParser.js --changed` reported updates for IShowSpeed, Madison Beer, Jack Black, and Hasan Piker, preserving existing DB `published=true`. Verify via `/admin/content-board`.
- **Madison Beer JSON-LD FAQPage.** The `<svelte:head>` structured data still contains `4w3` wing-code references. Left intact because it's SEO metadata, not main-body prose — the rabbit hole's purpose (surface typology to LLMs/search) is already being served by the schema. Flag for review if DJ wants it stripped.
- **Jack Black was the highest-jargon-density retrofit.** 12 inline wing/arrow references scattered through the body, including arrow labels on half a dozen mid-paragraph sentences. Strip-and-reword pass was mechanical but heavy; flag for editorial read.
- **Hasan Piker H2 rename.** Original H2 was "The Stress and Security of a Type 8" with sub-H3s "Under Stress: Moving Toward 5" and "In Security: Moving Toward 2." Renamed to "Burnout and the Softer Side" / "Under Pressure: The Withdrawal" / "In Health: The Warmer Register." All arrow content moved to rabbit hole.
- **Counterarguments.** Alternate types proposed: IShowSpeed — 7/3; Madison — 2; Jack — 3; Hasan — 1. All framed as "why people mistype, and why the current typing holds."

### Phase 2b raw-material / high-traffic extension (2026-04-17)

This batch continues with remaining Class A raw-material pages plus Timothée Chalamet, a high-traffic 2/4 page with existing counterargument and arrows content. It does **not** replace the Phase 3 gate; full scratch authoring should still wait for the 2026-05-01 CTR/LLM measurement.

| #   | Person            | Date       | Placement anchor (H2 name)                | Word count | Notes                                                                                                                |
| --- | ----------------- | ---------- | ----------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------- |
| 1   | Henry Cavill      | 2026-04-17 | The Witcher: When Helpers Read Every Book | ~565       | **DB-published.** Moved 2w1, sp/so, stress/growth, and Type 6/9 counterarguments; parser sync reported DB update.    |
| 2   | Sam Altman        | 2026-04-17 | The $76,000 Question                      | ~545       | **DB-published.** Stripped self-preservation/counter-type explanation from body; parser sync reported DB update.     |
| 3   | xQc               | 2026-04-17 | The $100 Million Bet                      | ~505       | Frontmatter `published: false`, but parser sync reported existing DB row `published=true`; verify in content-board.  |
| 4   | Timothée Chalamet | 2026-04-17 | Learning to Set Vigilance Down            | ~505       | **DB-published.** Partial Class B page; authored 6w5 + sp/so from existing evidence; parser sync reported DB update. |

**Gotchas (Phase 2b):**

- **DB sync reported after this pass.** `node scripts/personBlogParser.js --changed` reported updates for all four Phase 2b pages and preserved existing DB `published=true`; verify via `/admin/content-board`.
- **Frontmatter vs DB mismatch.** xQc has `published: false` locally, but the parser reported an existing DB row with `published=true`.
- **Timothée Chalamet crosses into partial Class B.** The page had strong arrows/counterargument material but no existing wing/subtype prose, so the rabbit hole uses existing behavioral evidence to author those two subsections.
- **Arrow URL.** Continued using `/enneagram-corner/enneagram-connecting-lines`, the live pillar used in earlier batches.
- **Step 6 dev render not executed.** Mechanical content checks passed, but desktop/mobile visual verification remains deferred.

### Phase 2c raw-material extension (2026-04-17)

This batch continues with the next highest-signal raw-material pages while still avoiding full Phase 3 scratch authoring. Donald Trump is included because the page already had strong arrows/counterargument material and an explicit need for subtype analysis.

| #   | Person       | Date       | Placement anchor (H2 name)             | Word count | Notes                                                                                                                                            |
| --- | ------------ | ---------- | -------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Shawn Ryan   | 2026-04-17 | When Data Overrides Loyalty            | ~470       | Frontmatter `published: false`, but parser sync reported existing DB row `published=true`; Operation Red Wings is a false-positive `wing` match. |
| 2   | Gavin Newsom | 2026-04-17 | The Winter of Love                     | ~480       | Frontmatter `published: false`, but parser sync reported existing DB row `published=true`; moved 3w2, so/sp, arrows, Type 7/8 countercase.       |
| 3   | Tara Yummy   | 2026-04-17 | What is Tara Yummy's Personality Type? | ~470       | Frontmatter `published: false`, but parser sync reported existing DB row `published=true`; moved 2w3, so/sx, arrows, Type 7/3 countercase.       |
| 4   | Donald Trump | 2026-04-17 | The Gilded Stage: Performance at Scale | ~445       | **DB-published.** Moved 3w2, so/sp, stress/growth, and Type 8 countercase; retained plain-English loyalty/listening sections in body.            |

**Gotchas (Phase 2c):**

- **DB sync reported after this pass.** `node scripts/personBlogParser.js --changed` reported updates for all 12 changed draft rows and preserved existing DB `published=true`; verify via `/admin/content-board`.
- **Frontmatter vs DB mismatch.** Shawn Ryan, Gavin Newsom, and Tara Yummy have `published: false` locally, but the parser reported existing DB rows with `published=true`.
- **Shawn Ryan false-positive.** `Operation Red Wings` remains in the main body as a military operation title, not Enneagram wing jargon.
- **Donald Trump body sections retained.** The explicit arrow/countertype labels were moved into the rabbit hole; the plain-English loyalty/listening narrative remains because it is core body evidence.
- **Step 6 dev render not executed.** Mechanical content checks passed, but desktop/mobile visual verification remains deferred.

### Phase 2d raw-material extension (2026-04-17)

This batch continues down the Tier 3 raw-material queue. It is still a retrofit pass, not full Phase 3 scratch authoring: each page already had enough wing/arrow/counterargument material or strong adjacent evidence to support a sealed rabbit-hole block.

| #   | Person             | Date       | Placement anchor (H2 name)                         | Word count | Notes                                                                                                                                                     |
| --- | ------------------ | ---------- | -------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Andrew Schulz      | 2026-04-17 | His Unusual Relationship with Insecurity           | ~480       | Frontmatter `published: false`, but parser sync reported existing DB row `published=true`; moved 7w8, sp/so, arrows, and Type 8/3 countercase.            |
| 2   | Bobbi Althoff      | 2026-04-17 | The Persona as Transformation                      | ~475       | Frontmatter `published: false`, but parser sync reported existing DB row `published=true`; replaced the Type 4w5 specialist section with the rabbit hole. |
| 3   | Scarlett Johansson | 2026-04-17 | What Is Scarlett Johansson's Personality Type?     | ~455       | **DB-published.** Moved 9w8, sp/sx, arrows, and Type 6/4 countercase; kept the Disney/OpenAI narrative plain-English in body.                             |
| 4   | Xi Jinping         | 2026-04-17 | Rise to Power: The Cave, The Rejections, The Climb | ~465       | **DB-published.** Moved 8w9, sp/so, arrows, and Type 1/5 countercase; stripped FAQ wing language from body.                                               |

**Gotchas (Phase 2d):**

- **DB sync reported after this pass.** `node scripts/personBlogParser.js --changed` reported updates for all 16 changed draft rows and preserved existing DB `published=true`; verify via `/admin/content-board`.
- **Frontmatter vs DB mismatch.** Andrew Schulz and Bobbi Althoff have `published: false` locally, but the parser reported existing DB rows with `published=true`.
- **Published pages in batch.** Scarlett Johansson and Xi Jinping have `published: true` in local frontmatter, so DB verification matters especially on those two.
- **Bobbi Althoff section removal.** The old "Psychological Complexity of Type 4w5" body section was replaced by the rabbit hole rather than duplicated. This keeps the body from repeating specialist material.
- **Arrow URL.** Continued using `/enneagram-corner/enneagram-connecting-lines`, the live pillar used in earlier batches.
- **Step 6 dev render not executed yet.** Mechanical content checks passed locally, but desktop/mobile visual verification remains deferred.

### Phase 2e raw-material extension (2026-04-17)

This batch continues the Tier 3 queue after skipping stale rows already completed in earlier batches (`xQc`, `Henry-Cavill`, `IShowSpeed`, `Sam-Altman`). It remains a retrofit pass: each page had enough existing specialist material or direct behavioral evidence to support the sealed block without full Phase 3 scratch authoring.

| #   | Person                   | Date       | Placement anchor (H2 name)                           | Word count | Notes                                                                                                                                                               |
| --- | ------------------------ | ---------- | ---------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Billie Eilish            | 2026-04-17 | What is Billie Eilish's Personality Type?            | ~435       | **DB-published.** Moved 4w3, so/sx, stress/growth, and Type 6/3 countercase; stripped one literal `wings` phrase from body.                                         |
| 2   | Princess Diana           | 2026-04-17 | Depth Over Breadth                                   | ~435       | Frontmatter `published: false`, but parser sync reported existing DB row `published=true`; moved 2w3, so/sx, stress/growth, and Type 4/3 countercase.               |
| 3   | Alexandria Ocasio-Cortez | 2026-04-17 | What is Alexandria Ocasio-Cortez's Personality Type? | ~420       | **DB-published.** Moved 6w7, so/sp, counterphobic/stress/growth material, and Type 8/3 countercase.                                                                 |
| 4   | Napoleon Bonaparte       | 2026-04-17 | What is Napoleon's personality type?                 | ~405       | Frontmatter `published: false`, but parser sync reported existing DB row `published=true`; moved 8w7, sp/so, Elba stress/growth material, and Type 3/5 countercase. |

**Gotchas (Phase 2e):**

- **DB sync reported after this pass.** `node scripts/personBlogParser.js --changed` reported updates for all 20 changed draft rows and preserved existing DB `published=true`; verify via `/admin/content-board`.
- **Frontmatter vs DB mismatch.** Princess Diana and Napoleon Bonaparte have `published: false` locally, but the parser reported existing DB rows with `published=true`.
- **Published pages in batch.** Billie Eilish and Alexandria Ocasio-Cortez have `published: true` in local frontmatter.
- **Napoleon word count is close to floor.** The panel is ~405 words, still inside the 400-700 range.
- **AOC stricter jargon cleanup.** Treated "counterphobic" as specialist copy and moved it into the rabbit hole even though the original scan did not flag it as a separate distribution term.
- **Arrow URL.** Continued using `/enneagram-corner/enneagram-connecting-lines`, the live pillar used in earlier batches.
- **Step 6 dev render not executed yet.** Mechanical content checks passed locally, but desktop/mobile visual verification remains deferred.

### Phase 2f raw-material extension (2026-04-17)

This batch continues the remaining Tier 3 queue after skipping fragment rows and stale rows already completed in earlier passes. It moves existing specialist sections into the rabbit hole where possible, with light authoring only where the source page already supplied direct behavioral evidence.

| #   | Person        | Date       | Placement anchor (H2 name)                  | Word count | Notes                                                                                                                                                          |
| --- | ------------- | ---------- | ------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Pedro Pascal  | 2026-04-17 | Public Vulnerability, Private Boundaries    | ~425       | **DB-published.** Moved 6w7, so/sx, stress/growth, and Type 2/4 countercase; renamed the old 7-wing body section.                                              |
| 2   | Saagar Enjeti | 2026-04-17 | What is Saagar Enjeti's Personality Type?   | ~435       | Frontmatter `published: false`, but parser sync reported existing DB row `published=true`; replaced the Five-mistype/stress/growth block with the rabbit hole. |
| 3   | JD Vance      | 2026-04-17 | The Mask and the Man Beneath It             | ~425       | Frontmatter `published: false`, but parser sync reported existing DB row `published=true`; moved 3w4, so/sp, stress/growth, and Type 8/1 countercase.          |
| 4   | Bella Hadid   | 2026-04-17 | Orebella: Building Something From the Ashes | ~415       | Frontmatter `published: false`, but parser sync reported existing DB row `published=true`; moved 4w3, so/sp, stress/growth, and Type 3/6 countercase.          |

**Gotchas (Phase 2f):**

- **DB sync reported after this pass.** `node scripts/personBlogParser.js --changed` reported updates for all 24 changed draft rows and preserved existing DB `published=true`; verify via `/admin/content-board`.
- **Frontmatter vs DB mismatch.** Saagar Enjeti, JD Vance, and Bella Hadid have `published: false` locally, but the parser reported existing DB rows with `published=true`.
- **Published page in batch.** Pedro Pascal has `published: true` in local frontmatter.
- **Saagar/JD panels were initially below floor.** Expanded with substantive detail; final mechanical counts are all inside 400-700.
- **Saagar section replacement.** The old "Why Everyone Thinks He's a Five" aside was removed and reworked into the rabbit hole counterargument to prevent duplicated specialist copy.
- **Arrow URL.** Continued using `/enneagram-corner/enneagram-connecting-lines`, the live pillar used in earlier batches.
- **Step 6 dev render not executed yet.** Mechanical content checks passed locally, but desktop/mobile visual verification remains deferred.

### Phase 2g raw-material extension (2026-04-17)

This batch clears the next four Tier 3 pages in the raw-material queue. Three are published in local frontmatter; Cillian Murphy is a local draft mismatch where the parser found and updated an existing published DB row.

| #   | Person          | Date       | Placement anchor (H2 name)                  | Word count | Notes                                                                                                                                                 |
| --- | --------------- | ---------- | ------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Marilyn Monroe  | 2026-04-17 | What is Marilyn Monroe's personality type?  | ~426       | **DB-published.** Moved 6w7, sx/so, stress/growth, and Type 3/4 countercase; stripped the counterphobic TL;DR copy and Type 6 stress aside from body. |
| 2   | Cillian Murphy  | 2026-04-17 | How Cillian Murphy Became a Leading Man     | ~412       | Frontmatter `published: false`, but parser sync reported existing DB row `published=true`; moved 5w4, sp/sx, stress/growth, and Type 9/4 countercase. |
| 3   | Meghan Markle   | 2026-04-17 | What is Meghan Markle's Personality Type?   | ~416       | **DB-published.** Moved 2w3, so/sx, stress/growth, and Type 3/8 countercase; replaced the Type 3 contrast panel with a plain-English diagnostic line. |
| 4   | Abraham Lincoln | 2026-04-17 | What is Abraham Lincoln's personality type? | ~407       | **DB-published.** Moved 9w1, so/sp, stress/growth, and Type 1/6 countercase; stripped the old `types-in-stress` body link.                            |

**Gotchas (Phase 2g):**

- **DB sync reported after this pass.** `node scripts/personBlogParser.js --changed` processed 29 changed draft rows and preserved existing DB `published=true` for all four Phase 2g pages; verify via `/admin/content-board`.
- **Pre-existing dirty draft also synced.** The parser inserted `Asmongold.md` as `published=false`. It was already in the changed-draft set and was not part of this rabbit-hole pass; verify that insertion was intended before publishing.
- **Frontmatter vs DB mismatch.** Cillian Murphy has `published: false` locally, but the parser reported an existing DB row with `published=true`.
- **Published pages in batch.** Marilyn Monroe, Meghan Markle, and Abraham Lincoln have `published: true` in local frontmatter.
- **Meghan body simplification.** The old Type 3 contrast panel was moved conceptually into the rabbit hole counterargument to prevent duplicated specialist material.
- **Arrow URL.** Continued using `/enneagram-corner/enneagram-connecting-lines`, the live pillar used in earlier batches.
- **Step 6 dev render not executed yet.** Mechanical content checks passed locally, but desktop/mobile visual verification remains deferred.

---

## URL case redirect — completed (2026-04-17)

**Change:** `src/routes/personality-analysis/[slug]/+page.server.ts`

- Added early-return 301 redirect from any non-canonical slug (anything that differs from `normalizePersonalitySlug(slug)`) to the lowercase canonical path. Querystring preserved via `event.url.search`. Guarded with truthy check so empty/invalid slugs fall through to the existing 404 instead of redirecting to the index.
- Tightened the Supabase lookup from `.ilike('person', requestedSlug)` to `.eq('person', canonicalSlugParam)`. Safe because the dry-run of `scripts/normalize-personality-slugs.js` returned 0 row updates — every `blogs_famous_people.person` is already lowercase.

**Audits:**

- `pnpm seo:normalize-internal-personality-links` → 0 links across 0 files. MDsvex blogs (non-drafts) and `src/routes/calendar/events.json` clean.
- Grep `personality-analysis/[A-Z]` across `src/` → all matches in `src/blog/people/drafts/**` (local-only; excluded from normalizer by design; DB-pushed content is already lowercase) or in `.spec.ts` files testing normalization (deliberate fixtures).
- `svelte-check` on touched file: 0 errors. `pnpm test:unit`: 190 pass; 2 pre-existing failures in unrelated specs (pop-culture, sequences) confirmed pre-existing by stashing change.

**Remaining for DJ:**

1. Deploy.
2. Post-deploy curl verification per tasker §4 checklist (Ryan-Gosling → 301 → ryan-gosling; querystring preserved; 404s still 404).
3. `pnpm gen:sitemap` (defensive regen).
4. GSC re-crawl for the 8 high-impression title-case URLs in tasker §3 Step 5.
5. Baseline snapshot below, then re-snapshot 2 weeks post-deploy.

**Baseline snapshot slot (fill at deploy):**

| Snapshot date | Title-case total clicks | Title-case total impressions | Lowercase total clicks | Lowercase total impressions | Notes                                                    |
| ------------- | ----------------------- | ---------------------------- | ---------------------- | --------------------------- | -------------------------------------------------------- |
| TBD (deploy)  |                         |                              |                        |                             | Pre-deploy baseline across 15 pairs from tasker §2       |
| TBD (+2w)     |                         |                              |                        |                             | Title-case should approach zero; lowercase ≈ sum of pair |

---

## Decisions & notes

- **Caveat on scan source.** Drafts folder is not the source of truth — published content lives in `blogs_famous_people` (DB). Before editing, diff each candidate against the DB row. **The Elon Musk DB row is ahead of the local draft** — the rabbit hole is live in the DB but the local draft is outdated. Expect similar drift on other high-traffic pages.
- **Fragment files flagged.** `Sam-Altman-research.md`, `Napoleon-Bonaparte-research.md`, `Clavicular.md`, `Taylor-Swift-updated-sections.md`, `jeff-bezos-research.md`, `sam-altman-new-yorker.md`, `david-perrel-thiel-essay.md` look like work-in-progress fragments. Skip unless verified as publishable blogs.
- **False-positive risk on arrows.** `integration`/`disintegration` appear outside Enneagram context. Eyeball each Tier 3+ page before promoting it to the retrofit queue.
- **Elon is live.** Validation is no longer blocking scale rollout. Next gate is the 2-week CTR measurement on Elon to confirm the pattern lifts CTR before committing Phase 3 authoring budget.
- **Two parallel workstreams.** Rabbit hole retrofit (E) and URL case redirect (F) are independent and can be delegated simultaneously. Both affect personality-page CTR; attribute carefully when measuring.
