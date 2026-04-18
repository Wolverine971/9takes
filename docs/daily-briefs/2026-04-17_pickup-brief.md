<!-- docs/daily-briefs/2026-04-17_pickup-brief.md -->

# Pickup Brief — Morning of 2026-04-17

**Covers:** work done on 2026-04-15 and 2026-04-16 (plus ~00:36 on 04-17)
**Author:** Claude, for DJ
**How to read this:** Sections 1–3 are what shipped. Section 4 is uncommitted state on disk right now. Section 5 is the open items ranked by leverage. Pick the top of Section 5 first thing.

---

## 0. TL;DR

- **Shipped a lot.** Corpus-stats page + homepage panel is live. Enneagram Rabbit Hole furniture is in SCSS + furniture guide. v2 blog command got a major rewrite. 5 new celebrity drafts landed. 1 new blog auto-published (Jeremy Allen White).
- **One uncommitted file + one untracked spec (plus this brief).** `src/lib/email/welcome-sequence-content.ts` has small copy tweaks to emails 1–3, not committed. `docs/specs/email-welcome-sequence-system.md` is a brand-new 461-line replication spec you wrote at 00:43 — never added. This brief itself at `docs/daily-briefs/2026-04-17_pickup-brief.md` is untracked too.
- **Biggest unfinished thing:** Corpus Stats Phase 3b — the "Comparison to public Enneagram data" section is spec'd in detail but not built. That's the section that makes `/corpus-stats` genuinely citable.
- **Smallest quick win:** decide what to do with the welcome-email copy tweaks (commit or revert) and the replication spec (commit in place or move to `docs/replication/`).

---

## 1. What shipped in the last two days

Commits on `main`, newest first:

| SHA        | Time             | Summary                                                                                                                                                                                                                             |
| ---------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `e24f0c5a` | 2026-04-17 00:36 | `/corpus-stats` page polish + homepage tile content refresh + Elon/Taylor drafts touched + v2 command update                                                                                                                        |
| `b198be33` | 2026-04-16 23:05 | Corpus stats **Phase 2 + 3 shipped** — CorpusStatsPanel + CorpusStatsTable + `/corpus-stats` route + raw JSON endpoint + sitemap entry; Anna Kendrick + Jeremy Allen White drafts                                                   |
| `285bf854` | 2026-04-16 17:41 | v2 command big rewrite (1,026 lines) + copywriting-audit/pass commands + `9takes-strat.md` priorities added + corpus-stats spec + rabbit-hole task doc + blog-furniture-guide + Meghan Trainor draft + big SCSS blog.scss additions |
| `b085cbbf` | 2026-04-15 21:45 | Neurodiversity blog polish + TableOfContents / ArticleSubTitle tweaks                                                                                                                                                               |
| `039f20f0` | 2026-04-15 17:12 | Neurodiversity blog sources doc expanded                                                                                                                                                                                            |
| `83e56b8d` | 2026-04-15 16:43 | **Admin users page expansion** (+860 lines across server + svelte) + Robert Oppenheimer draft tightened                                                                                                                             |
| `8278d70f` | 2026-04-15 15:46 | copywriting-audit + copywriting-pass **created** + David Dobrik draft + personality-frameworks community post + content-editor/content-polish agents                                                                                |
| `bc4471d6` | 2026-04-15 13:26 | Dua Lipa + Lady Gaga + Lana Del Rey + Rooney Mara + Robert Oppenheimer drafts + **welcome-sequence admin UI expansion** (+920 lines across server + svelte) + unsubscribe test-preview API                                          |
| `14e749a4` | 2026-04-15 11:19 | Jensen Huang draft + **welcome-sequence-content.ts introduced** (welcome emails moved into code-override pattern) + base-template tests + sender.ts overhaul + unsubscribe endpoint rework                                          |
| `31788efe` | 2026-04-15 07:55 | Rachel Brosnahan draft + quora-warmup-night session log                                                                                                                                                                             |

Ten commits across the two days — not small. A lot of what's here is the tail end of several multi-day threads.

---

## 2. Major workstreams, by theme

### 2.1 Corpus Stats on Site — SPEC PHASES 0–3 DONE, 3b + 4 PENDING

**Spec:** `docs/specs/corpus-stats-on-site.md` (579 lines).

**What's live:**

- `src/lib/data/corpus-stats.json` — generated data file, now imported by the app bundle (Phase 0 ✅).
- `pnpm gen:corpus-stats` is in `build:vercel` (Phase 1 ✅).
- `src/lib/components/marketing/CorpusStatsPanel.svelte` — homepage "By the Numbers" tile grid, wired in at `src/routes/+page.svelte:834` between famous-types and coaching (Phase 2 ✅).
- `src/lib/components/marketing/CorpusStatsTable.svelte` — shared 9-row type table (Phase 3 ✅).
- `src/routes/corpus-stats/+page.svelte` + `+page.server.ts` + `+page.ts` — dedicated page with hero, TL;DR, pipeline, full type distribution, per-domain breakdowns in `<details>`, per-type top domains, methodology, citable claims (Phase 3 ✅).
- `src/routes/corpus-stats.json/+server.ts` — raw JSON endpoint (✅).
- Sitemap entry added (`scripts/generate-sitemap.js`) + `static/sitemap.xml` regenerated (✅).
- `Dataset` + `BreadcrumbList` JSON-LD is emitted; spec called for `WebPage` too but the current implementation omits it — minor gap.

**What's NOT done (and where the highest ROI is now):**

- **Phase 3b — Comparison to public Enneagram data.** This is the differentiator. Spec has the table shape, candidate sources (Truity, iEQ9, Enneagram Institute, Wagner 1981, Newgent 2004, Sutton 2007, Brown & Bartram 2005), and the "honest-sample caveat" text. **Two sub-tracks:**
  - 3b.1 Research (2–3 hr) — produce `docs/research/enneagram-public-distributions.md` with verified per-type shares from primary sources. Can delegate to `best-practices-researcher` or `research-analyst`.
  - 3b.2 Build (2–3 hr) — hand-curate `src/lib/data/corpus-stats-external.json` + build `CorpusStatsComparisonSection.svelte` + wire it in after the per-type-domains section on `/corpus-stats` + extend the Dataset JSON-LD description.
- **Phase 4 polish (~45 min total):**
  - Add "Corpus" link to `Footer.svelte`.
  - Update blog command's numerical-claim guidance to point at `/corpus-stats` as the canonical public source.
  - Add a one-line README pointer.
- **Phase 5 verify + measure:** submit `/corpus-stats` to Google Search Console, run `seobeast-audit` skill for baseline AEO score, add the URL to the LLM citation monitor (which itself doesn't exist yet — see 2.6).

**Homepage tile bug-watch:** verify the tiles look right in prod on 320/768/1280. The JSON got refreshed at 00:00 on 04-17 so numbers may have shifted slightly since you last looked.

### 2.2 Enneagram Rabbit Hole furniture — SHIPPED, ROLLOUT PENDING

**Spec:** `docs/development/enneagram-rabbit-hole-furniture-task.md`.

**What's live:**

- SCSS block `.enneagram-rabbit-hole` added to `src/scss/blog.scss:633` with the rabbit emoji 🐇, cyan-teal accent, and mobile override at line 859.
- Furniture guide entry added in `docs/content-generation/blog-furniture-guide.md` under "CSS Furniture Elements" and in the "Usage Guide" checklist at the bottom.
- v2 blog creator command references it in the Step 6 Furniture Pass.
- Jeremy Allen White draft (auto-generated last night) includes the rabbit hole with all four sub-sections — cron log confirms testimony gate passed, heading mix ok, rabbit hole present.

**What's NOT done:**

- **Validation on a real published blog.** Spec Step 3 says pick a Type 5/8 test (suggested: Elon Musk, Peter Thiel, Taylor Swift), edit the DB row via `/admin/content-board`, insert a hand-written rabbit hole, then visual/SEO/LLM check. Never executed.
- **Retrofit onto top 10 traffic personality pages.** Pair with the Fan-Out Audit in `9takes-strat.md` Part 4. The top-traffic blog is `enneagram-and-mental-illness` per memory — but that's not a personality page. For personality pages, query `blogs_famous_people` ordered by analytics views.
- **JSON-LD `FAQPage` derived from the four sub-sections** — out of scope for this task but listed as a follow-up in `9takes-strat.md` Tier 0 #3.

### 2.3 Blog creator command v2 — REWRITE SHIPPED

**Files:** `.claude/commands/blog_content_creator_people_v2.md` (now 1,146 lines), `.claude/commands/blog_content_creator_people.md`, `blog-creator-restructure-plan.md`.

**What landed:**

- Four unified craft principles (Show/Point/Story/Sound) merging show-don't-tell with Harry Dry's three rules.
- "Heading mix" rule — 1–2 signature / 2–3 search-intent / remainder hybrids — resolving the SEO vs. copywriting tension.
- New Step 6 Furniture Pass with explicit call-out for the Enneagram Rabbit Hole.
- "Statistical Claims & Cited Sources (Strongly Encouraged, Not Required)" section in Part 1 — this is the softened version after you realized a hard requirement was producing invented stats. The softening is explicitly documented in `9takes-strat.md` Tier 0 #2.

**`blog-creator-restructure-plan.md` at repo root** is the design doc that preceded the rewrite — it's committed but sits at the top level. Consider moving it to `docs/content-generation/` once you're done referencing it.

### 2.4 Welcome email sequence — CODE-OVERRIDE PATTERN SHIPPED, COPY TWEAKS UNCOMMITTED

**What shipped on 04-15:**

- `src/lib/email/welcome-sequence-content.ts` introduced (commit `14e749a4`) — this is the code-override file described in the replication spec. Holds the 4-step welcome sequence copy. Wins over the DB rows at send time.
- `src/lib/email/sender.ts` overhauled: cleaner multipart/alternative builder, `List-Unsubscribe-Post: List-Unsubscribe=One-Click` header added, test coverage in `base-template.spec.ts`.
- `src/lib/email/sequences.ts` + `sequences.spec.ts` — token replacement renderer with HTML-escape on injection.
- `src/routes/api/track/unsubscribe/[tracking_id]/+server.ts` rewritten + new `test-preview/+server.ts` endpoint for previewing the unsubscribe page.
- `/admin/welcome-sequence` page grew by ~920 lines across `+page.server.ts` + `+page.svelte` — per-step metrics (sent/opened/clicked via subject-matching), live preview, send-test-email, live queue table, funnel counts, return-visit attribution.

**Uncommitted right now (`git status` shows modified):**

- `src/lib/email/welcome-sequence-content.ts` — copy tweaks on emails 1–3:
  - Email 1 hook rewritten: "Reading the room feels like wisdom. Most of the time it is mimicry with extra steps. 9takes inverts that on purpose."
  - Email 2 line softened: "Fair warning" instead of "A warning though"
  - Email 3 restructured — the "sign up to ask" separate CTA is gone, replaced with a primary `Ask your own question` CTA + secondary `Or answer a current one first` link
- These are small, deliberate voice refinements. **Decide tomorrow:** commit or revert.

**Untracked right now:**

- `docs/specs/email-welcome-sequence-system.md` — **461-line full replication spec you wrote at 00:43 this morning.** This is a gem: it documents the claim→process→complete RPC pattern, the code-override-wins content pattern, the exit-on-user-action design, subject-based metrics, the whole cron architecture. Useful for future you, future engineers, or for porting the system to another project (BuildOS?). **Decide tomorrow:** commit in place, or move to `docs/replication/email-welcome-sequence-system.md` if you want a dedicated folder for these ports.

### 2.5 Celebrity drafts created or revised

Past two days, new drafts (all in `src/blog/people/drafts/`):

- **Dua Lipa** (206 lines, new) — Type 7, 2026-04-15
- **Lady Gaga** (255 lines, new) — 2026-04-15
- **Lana Del Rey** (276 lines, new) — 2026-04-15
- **Rooney Mara** (204 lines, new) — 2026-04-15
- **Robert Oppenheimer** (285 lines, new) — 2026-04-15
- **Meghan Trainor** (267 lines, new) — 2026-04-16
- **Anna Kendrick** (199 lines, new) — 2026-04-16
- **Jeremy Allen White** (246 lines, new, auto-generated by daily-blog-creator cron) — 2026-04-16
- **Addison Rae / David Dobrik / Harry Styles / Elon Musk / Taylor Swift** — substantive edits
- **Rachel Brosnahan** — shipped 04-15 morning
- **Jensen Huang** — shipped 04-15 morning
- **Malcolm Gladwell / Robert Oppenheimer / Hilary Duff** — tightened 04-15 afternoon

✅ **Anna Kendrick** — the 04-16 cron log warned she might need reconciliation (draft on disk, still in queue). Checked just now: she's no longer in the `queue` array of `docs/blog-automation/backlog-queue.json`. Looks like someone already removed her or she was never re-added after the draft landed. No action needed.

⚠ **Failed blog:** Brené Brown failed on 2026-04-06 — "Process interrupted - Claude Code session terminated." Sits in the `failed` array with `retryCount: 1`. She's not been re-queued.

### 2.6 Strategy + measurement — `9takes-strat.md` updated

**What landed (2026-04-16):**

- Whole new "Actionable Priorities" section at the top mapping strat sections to existing tooling.
- Tier 0 #2 ("strongly encourage stat claims") — **marked ✅ DONE**.
- Inline ACTION comments throughout Parts 3–10 pointing at matching commands/skills.

**What's still Tier 0 / Tier 1 open:**

- **Tier 0 #3** — Audit `PeopleBlogPageHead.svelte` for `FAQPage` schema (Article + Person already ship). ~1 day. Pairs with the rabbit-hole rollout.
- **Tier 1 #4** — Corpus stats data file. **Mostly done** — the JSON exists and feeds `/corpus-stats`. Residual: hand-curated `corpus-stats-external.json` for Phase 3b (see 2.1).
- **Tier 1 #5** — `/llm-citation-monitor` skill/cron. **Greenfield.** Without it the whole strat has no feedback loop.
- **Tier 1 #6** — `.claude/commands/reddit-warmup.md` modeled on `quora-warmup.md`. **Greenfield.** Reddit is the #1 strat channel and there's zero tooling.
- **Tier 2** — Wikidata entry, r/9takes subreddit, stat-analysis-piece command, Wikipedia feasibility research. All backlog.

### 2.7 Copywriting infra — CREATED 2026-04-15

- `.claude/commands/copywriting-audit.md` (new, 232 lines then expanded) — identifies blogs that need work.
- `.claude/commands/copywriting-pass.md` (new, 239 lines then expanded) — Harry Dry's three-rule framework applied to prose, headings, subheaders.
- `.claude/agents/content-editor.md` + `content-polish.md` refined.

Both commands are wired to be callable on any blog slug or file path. Not yet run through the existing top-traffic blogs at scale.

### 2.8 Neurodiversity blog work

- `src/blog/enneagram/neurodiversity-vs-personality.md` — copy + fact-check tightening over two commits on 04-15.
- `docs/neurodiversity-blog-sources.md` — expanded to 4+ claims with primary-source verification (LifeStance/Researchscape 2025, Yeung et al. 2022, Koi 2021, Psyche 2025). The "55% from non-professionals" figure was removed after fact-check surfaced a dispute.

This is the model for what "stat-check" should look like on future blogs. Keep a sources doc per blog for any stat-rich piece.

### 2.9 Quora + Instagram + Daily Blog Cron

- **Quora:** `docs/quora/sessions/2026-04-14_quora-warmup-night.md` + `docs/quora/sessions/2026-04-16_quora-warmup.md` (5 queued questions, targets Types 2/5/7/9 gaps — Stage 1 complete, `/quora-answer` not yet run).
- **Instagram:** `docs/instagram/daily-engagement/2026-04-15_instagram-warmup.md`.
- **Daily blog cron:** ran successfully 04-15 (no auto-publish needed, you had manual drafts) and 04-16 (Jeremy Allen White auto-drafted). Rate limit: **1/5 this week** as of 2026-04-16 21:23. Next queue: snoop-dogg → cardi-b → sandra-bullock → shakira → jennifer-coolidge.

### 2.10 Admin users + admin welcome-sequence — EXPANDED

Two big admin pages got a lot of capability this cycle (the diffs are big, worth a quick skim):

- `src/routes/admin/users/+page.{server,svelte}.ts` — ~860 lines added across both on 04-15 afternoon.
- `src/routes/admin/welcome-sequence/+page.{server,svelte}.ts` — ~920 lines added 04-15 morning + afternoon.

The welcome-sequence admin is now essentially feature-complete per the replication spec. The users admin expansion is worth a visual QA pass — no spec doc for what it added.

### 2.11 YouTube transcript cloud research

`docs/youtube-transcript-cloud.md` (544 lines) — reference doc for porting the local `youtube-transcript` skill to a cloud environment. Not wired to anything yet, this is planning/research.

---

## 3. State of each spec/plan doc

| Doc                                                        | Status                                               | Next action                                                             |
| ---------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------- |
| `docs/specs/corpus-stats-on-site.md`                       | Phases 0–3 shipped; 3b + 4 pending                   | Start Phase 3b.1 research OR bang out Phase 4 polish (45 min)           |
| `docs/specs/email-welcome-sequence-system.md`              | **Untracked**, 462 lines, written last night         | Commit in place or move to `docs/replication/`                          |
| `docs/development/enneagram-rabbit-hole-furniture-task.md` | SCSS + guide shipped, validation + rollout pending   | Validate on Elon/Taylor/Thiel blog via `/admin/content-board` (~30 min) |
| `blog-creator-restructure-plan.md`                         | Executed → v2 command rewritten                      | Move to `docs/content-generation/` or archive; it's served its purpose  |
| `docs/neurodiversity-blog-sources.md`                      | Living doc, up to date through 04-15                 | Template for future stat-check companion docs                           |
| `9takes-strat.md`                                          | Priorities + ACTION annotations shipped 04-16        | Pick next Tier 0 / Tier 1 item (see §5)                                 |
| `docs/content-generation/blog-furniture-guide.md`          | Rabbit Hole entry added                              | None — reference doc                                                    |
| `docs/youtube-transcript-cloud.md`                         | Research complete, no implementation                 | Decide if/when to build                                                 |
| `docs/data/corpus-stats.md`                                | Regenerated 04-17 00:00 (292 published / 102 drafts) | Auto, no action                                                         |

---

## 4. Current working-copy state (do this first tomorrow)

```
$ git status
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  modified:   src/lib/email/welcome-sequence-content.ts

Untracked files:
  docs/daily-briefs/                             # this brief
  docs/specs/email-welcome-sequence-system.md    # replication spec
```

Two decisions to make before anything else:

1. **`welcome-sequence-content.ts`** — the diff is 88 lines, voice tweaks to the opening lines of emails 1–3. Do you like the new phrasings? If yes, commit. If no, `git restore src/lib/email/welcome-sequence-content.ts`.
2. **`email-welcome-sequence-system.md`** — the replication spec. You wrote this at ~00:43 this morning, never added. This is valuable documentation — either commit it in `docs/specs/` where it sits now, or move into a `docs/replication/` folder if you want to start a library of these.

Neither decision needs more than two minutes.

---

## 5. Prioritized pickup list (do tomorrow)

Ranked by leverage. Top of list is what I'd do first if I were you.

### Pick one — 15 min or less

1. **Commit or revert the welcome-email copy tweaks.** (5 min)
2. **Commit or move the email-welcome-sequence-system.md spec.** (2 min)
3. **Reconcile Anna Kendrick in the backlog queue** — draft exists, still listed at priority 60. Move to `completed` in `docs/blog-automation/backlog-queue.json`. (3 min)
4. **Re-queue or drop Brené Brown** — sitting in `failed` with retryCount 1 since 2026-04-06. Either retry or mark permanently skipped. (2 min)

### Ship something visible today — 30–90 min

5. **Validate the Enneagram Rabbit Hole on a real published page.** Pick Elon or Taylor Swift, open `/admin/content-board`, hand-write a rabbit hole block, save, check `/personality-analysis/[slug]` on desktop + mobile + run through Google Rich Results Test. ~30–45 min.
6. **Corpus Stats Phase 4 polish.** Footer link + README pointer + point the blog command's stat-claim guidance at `/corpus-stats`. ~45 min.
7. **Run `copywriting-pass` on the top-traffic personality blog you identify** — gives you a real-world test of the new three-rule framework. ~60 min.

### The big one — multi-session

8. **Corpus Stats Phase 3b — Public-data comparison section.** This is the piece that makes `/corpus-stats` genuinely citable by LLMs asking "what's the general-population Enneagram distribution?" Research (2–3 hr, delegable to research-analyst agent) → hand-curate `corpus-stats-external.json` (30 min) → build `CorpusStatsComparisonSection.svelte` + wire in (2 hr) → extend Dataset JSON-LD description. Total ~4–6 hr. **Highest-ROI unfinished item right now.**

### The deferred strat moves — pick one if you're in build-mode

9. **Build `/llm-citation-monitor`** (Tier 1 #5). Without it, you have no way to know if any of this is working. ~3–4 hr for a first version hitting ChatGPT/Claude/Perplexity APIs with standardized prompts + logging to `logs/llm-citation/`.
10. **Build `.claude/commands/reddit-warmup.md`** (Tier 1 #6). Model on the existing `quora-warmup.md` pattern. Reddit is the #1 strat channel and you have zero tooling. ~2 hr.
11. **FAQPage JSON-LD on personality-analysis pages** (Tier 0 #3). Derive invisible FAQ from H2/H3 question-format headings inside the rabbit hole. ~1 day.

### Backlog / research — no pressure, just on the radar

12. Fan-Out Audit on top 10 personality pages (pair with rabbit-hole retrofit).
13. Wikidata entry for 9takes. ~1 hour, one-off.
14. r/9takes subreddit creation + seeding. Squat-prevention.
15. Stat-analysis piece monthly cadence (first piece: "Type Distribution Among Musicians: What 292 Profiles Show" — the corpus now has the data for this).
16. Admin users page visual QA — big expansion on 04-15, no spec doc, confirm it looks right.
17. YouTube transcript cloud implementation — research doc is done, no code yet.

---

## 6. Sharp edges to watch

- **Corpus stats are regenerated on every Vercel deploy.** If Supabase is unreachable at build time, the script `warn-and-continue`s and ships the last-good JSON. That's by design but keep it in mind if numbers look stale.
- **Jeremy Allen White is a DRAFT, not published.** `production_pretext.status: draft`. Runs through `blog_content_production_people` after your review.
- **Rabbit Hole placement rule:** never stack it directly under the TL;DR `<details>` — at least one full narrative H2 must sit between them. The furniture guide repeats this three times because you'll forget.
- **Welcome sequence exit hooks are idempotent** — if you tweak the exit-call sites, remember the sequence already tolerates multiple exits gracefully; over-engineering new guards is wasted effort.
- **Subject changes break historical email metrics** (documented sharp edge §15 of the replication spec). If you rename an email subject in `welcome-sequence-content.ts`, the admin UI will show 0 sent/opened for the new subject until sends accumulate.

---

## 7. Where to start tomorrow

If mentally fresh: **item 8 (Corpus Stats Phase 3b research)** — delegate 3b.1 to the `research-analyst` agent, then come back and curate `corpus-stats-external.json` and build the comparison section. That's the single biggest leverage move on the list.

If you just want to clear chores: items 1–4 in order, then validate the rabbit hole on one blog (item 5). Total ~45 minutes, you'll have a clean working tree and a real-world validation of the rabbit hole in production.

If you want to ship a feature fast: item 6 (Phase 4 polish, 45 min). Shippable in one sitting, closes out the corpus-stats epic except for 3b.

Good luck, future DJ. Today-you shipped a lot.

---

## 8. Addendum — progress on 2026-04-17

**Item 8 (Corpus Stats Phase 3b) — shipped same day.**

- Research brief (3b.1): `docs/research/enneagram-public-distributions.md` — delegated to `research-analyst` agent. Only enneagram-personality.com (n≈200k, 2026-04-07) publishes a complete per-type table; Truity (n≈54k) has partial anchors for Types 5/7/8/9; iEQ9 and peer-reviewed studies are credibility backbone only (distributions not public).
- Data file (3b.2a): `src/lib/data/corpus-stats-external.json` — 2 sources + 6 credibility references, primary shares sum to 1.000, `last_reviewed: 2026-04-17`.
- Component (3b.2b): `src/lib/components/marketing/CorpusStatsComparisonSection.svelte` — honest-sample caveat, joined 9takes vs enneagram-personality.com vs Truity table, auto-ordered per-type interpretations for Types 3/8/9/1/6/7, equal-distribution-myth debunk, sources + academic context lists.
- Wiring (3b.2c): inserted on `/corpus-stats` after the per-type-domains section. Dataset JSON-LD extended: description references 2 datasets + 6 refs; `citation` array exposes all 8 as `CreativeWork`/`ScholarlyArticle` nodes; `delta_vs_public_test_taker_distributions` added to `variableMeasured`; plus `publisher`/`license`/`isAccessibleForFree`/`inLanguage`.

**Cross-link pass (same day).** Inbound links added from:

- `src/blog/enneagram/enneagram-vs-meyers-briggs.md` — Validity Question section.
- `src/blog/community/mbti-vs-enneagram.md` — "What It Doesn't Get Right (Yet)" honesty-check.
- `src/blog/enneagram/enneagram-books-websites-podcasts.md` — new "Data & Research" subsection under Websites + sentence appended to the scientific-validation FAQ (which already cited Hook et al. 2021, same paper as our research brief).
- `src/blog/enneagram/enneagram-faqs.md` — "Is the Enneagram scientifically valid?" FAQ.

**Spec + strat updated.** `docs/specs/corpus-stats-on-site.md` Phase 3b marked shipped with file list. `9takes-strat.md` Tier 1 #4 marked ✅ DONE.

**Still open from item 5 list (none of this moved):**

- Phase 4 polish (Footer "Corpus" link, README pointer, blog-command stat-claim guidance pointing at `/corpus-stats`) — ~45 min.
- Phase 5 verify/measure (Search Console submission, `seobeast-audit` baseline, LLM citation monitor entry) — depends on Tier 1 #5 still being greenfield.
- Rabbit-Hole validation on a real published page (item 5).
- Welcome-email copy tweak commit/revert decision (item 1).
- Replication spec commit-or-move decision (item 2).
- Anna Kendrick queue reconciliation + Brené Brown retry decision (items 3, 4).

Type-check: 0 new errors introduced by Phase 3b changes.

---

## 9. Addendum — end-of-day state 2026-04-17 (rabbit hole + residuals)

### 9.1 Items from §5 — crossed off ✅ vs still open ❌

| #   | Item                                                                              | Status                                                                                                                                                                                                                                                                                                                                                                                |
| --- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Commit/revert welcome-email copy tweaks                                           | ✅ Committed in `410a691e`                                                                                                                                                                                                                                                                                                                                                            |
| 2   | Commit/move `email-welcome-sequence-system.md`                                    | ✅ Committed in-place at `docs/specs/` in `410a691e`                                                                                                                                                                                                                                                                                                                                  |
| 3   | Reconcile Anna Kendrick in backlog queue                                          | ✅ No longer in `queue`; not in `completed` either but effectively cleared                                                                                                                                                                                                                                                                                                            |
| 4   | Re-queue or drop Brené Brown                                                      | ✅ Re-queued at priority 98 with `retryCount: 0`; `failed` array cleared. Slug normalized from `brené-brown` → `brene-brown` to dodge Unicode NFC/NFD hazards across shell/URL/FS/DB (display name keeps the é). `famousTypes.ts` updated to match.                                                                                                                                   |
| 5   | Validate rabbit hole on real published page                                       | ✅ Elon Musk pushed to DB (tracker §D confirms)                                                                                                                                                                                                                                                                                                                                       |
| 6   | Corpus Stats Phase 4 polish (Footer "Corpus" link, README pointer, blog cmd cite) | ✅ Done — Footer already had `/corpus-stats` in nav (`Footer.svelte:12`); README §"Blog sections" pointer refreshed to match post-3b reality (dropped stale "quality + freshness" wording, added external-data file + cite-canonical line); v1 blog creator (`blog_content_creator_people.md`) got the missing "About the 9takes corpus" stat bullet so the daily cron writes like v2 |
| 7   | Run `copywriting-pass` on top-traffic personality blog                            | ❌ Not done                                                                                                                                                                                                                                                                                                                                                                           |
| 8   | Corpus Stats Phase 3b (public-data comparison)                                    | ✅ Shipped — see §8 above                                                                                                                                                                                                                                                                                                                                                             |
| 9   | Build `/llm-citation-monitor` (Tier 1 #5)                                         | ❌ Not built. `llm-citation-baseline-tasker.md` is a manual precursor, not the cron                                                                                                                                                                                                                                                                                                   |
| 10  | Build `.claude/commands/reddit-warmup.md` (Tier 1 #6)                             | ❌ Not done                                                                                                                                                                                                                                                                                                                                                                           |
| 11  | FAQPage JSON-LD on personality-analysis pages (Tier 0 #3)                         | ⏸ Tasker created at `docs/planning/people-blog-faqpage-jsonld-tasker-2026-04-17.md`; not built                                                                                                                                                                                                                                                                                       |

### 9.2 Rabbit Hole retrofit — what actually shipped today

Between ~09:30 and ~14:45 the rabbit-hole rollout went far beyond §5 item 5. Full detail in `docs/development/rabbit-hole-retrofit-tracker.md`.

**Done:**

- 🎉 **36 drafts retrofitted with the `.enneagram-rabbit-hole` block** across Phase 2 Class A, Tier 4 pilot, and Tier 3 bonus batches 2b–2g. All committed in `d035dfb4`.
- ✅ Elon Musk DB push confirmed (validation gate cleared).
- ✅ `scripts/personBlogParser.js --changed` reported 29 DB row updates (published rows preserved).
- ✅ URL case redirect code merged to `main` in `410a691e` (301 + `.eq()` tightening in `src/routes/personality-analysis/[slug]/+page.server.ts`). Internal-link audit clean; DB slug dry-run returned 0 updates.
- ✅ Six new planning/tracking docs written and staged:
  - `docs/development/rabbit-hole-retrofit-tasker.md` (agent delegation doc)
  - `docs/development/rabbit-hole-retrofit-candidates.md` (ranked queue)
  - `docs/development/rabbit-hole-retrofit-traffic-analysis.md` (GSC CTR sizing)
  - `docs/development/rabbit-hole-retrofit-tracker.md` (status of record)
  - `docs/development/rabbit-hole-baseline-snapshot.md` (fill-in template)
  - `docs/development/llm-citation-baseline-tasker.md` (Chrome-LLM delegation doc)
  - `docs/development/url-case-redirect-audit-tasker.md` (URL case fix delegation doc)
- ✅ FAQPage JSON-LD workstream opened — `docs/planning/people-blog-faqpage-jsonld-tasker-2026-04-17.md` (committed in `d035dfb4`). Build not started.

**Still open (ranked by leverage):**

1. ✅ **Staged tree committed in `425cc7e4` (2026-04-17 15:59).** All 19 files landed in one commit: 7 rabbit-hole / URL-fix / LLM-baseline docs, this brief, `scripts/personBlogParser.js`, `src/lib/server/personBlogParser.spec.ts`, admin analytics page changes (`+page.server.ts`, `+page.svelte`, both specs), `api/admin/analytics/releases/+server.ts` + spec, instagram-warmup tweaks, enneagram-public-distributions tweaks, and `supabase/migrations/20260417_fix_release_analytics_freshness.sql`.
2. ❌ **Baseline GSC snapshot — BEFORE the URL redirect deploy.** Order matters. Fill in `rabbit-hole-baseline-snapshot.md` §1 (retrofit targets + controls + URL-case pairs) pulling 28-day GSC numbers for each row. Once the 301s fire, title-case impressions collapse into lowercase and pre/post attribution is muddy.
3. ❌ **Deploy the URL redirect fix**, then run the post-deploy curl verification in `url-case-redirect-audit-tasker.md` §8 (Ryan-Gosling → 301 → ryan-gosling; querystring preserved; 404s still 404). After deploy, submit the 8 high-impression title-case URLs for GSC re-crawl.
4. ❌ **Run the Chrome LLM baseline tasker.** Not confounded by the URL deploy, so it can happen anytime before ~2026-04-28. Open a fresh logged-in Chrome session on Claude/ChatGPT/Perplexity, hand the agent `llm-citation-baseline-tasker.md`. 135 prompt executions (9 people × 5 queries × 3 models). Results land in `rabbit-hole-baseline-snapshot.md` §2.
5. ❌ **Sample-verify 3–4 retrofits in `/admin/content-board`.** Parser sync reported 29 updates — spot-check high-traffic pages (IShowSpeed, Madison-Beer, Scarlett-Johansson, Donald-Trump) to confirm the DB reflects the retrofit. Pay special attention to any draft with `published: false` locally but `published: true` in DB (Jack-Black, Hasan-Piker, Shawn-Ryan, Gavin-Newsom, Tara-Yummy, JD-Vance, Bella-Hadid, Saagar-Enjeti, Cillian-Murphy, Andrew-Schulz, Bobbi-Althoff, xQc, Princess-Diana, Napoleon-Bonaparte — frontmatter/DB mismatch list from the tracker).
6. ❌ **Dev render pass on 4–5 representative retrofits.** None of the 36 retrofits have been visually QA'd. Run `pnpm dev`, hit desktop + mobile + open/closed states per furniture spec §3c.
7. ❌ **Tier 3 gaps — J.K. Rowling and Mr. Beast.** Both drafts grep clean of `enneagram-rabbit-hole` (confirmed). They had 3/4 signals in the original scan but were skipped. Either retrofit or formally deprioritize.
8. ✅ **Brené Brown re-queued** at priority 98 with normalized slug `brene-brown` (display keeps the é). `failed` array cleared; `retryCount` reset to 0. `famousTypes.ts` updated to the ASCII slug. Ready for the next daily-blog-creator pass to pick her up.
9. ⏸ **Phase 3 Class B stragglers (7 pages):** Tom-Hiddleston, Dua-Lipa, Sydney-Sweeney, Jennifer-Lopez, Ryan-Gosling, Druski, Gwyneth-Paltrow. Gated on 2026-05-01 CTR/LLM measurement. Given Timothée already crossed the line mid-retrofit, reconsider whether the gate is still the right call.
10. ⏸ **FAQPage JSON-LD build** (`docs/planning/people-blog-faqpage-jsonld-tasker-2026-04-17.md`) — P0 per strat Tier 0 #3; pairs with the rabbit hole's four H3s. Delegate when bandwidth allows.
11. ❌ **Calendar the 2026-05-01 measurement.** Re-run both baseline taskers (GSC + LLM) and compute deltas per `rabbit-hole-baseline-snapshot.md` §3. If there's no calendar hold, this will slip.

### 9.3 Net state of the rabbit-hole epic

**Done:** furniture shipped → validation cleared on Elon → 36 drafts retrofitted → parser sync → URL fix coded → 7 planning/tasker docs written.

**The rabbit-hole rollout itself is effectively complete for the top-leverage pool** (Tier 4 + Class A + Tier 3 bonus). Staged tree is now committed (`425cc7e4`). What's left is operational plumbing: capture the pre-deploy GSC baseline, deploy the URL fix, run the LLM baseline, visual-QA the retrofits, close the two Tier-3 gaps, and calendar the 2-week re-measurement. None of this is design work — it's all execution on already-written delegation docs.

**If you pick one thing tomorrow:** baseline GSC + deploy URL fix in that order. That closes the measurement-attribution window cleanly and lets the 2-week clock start.

**Current working tree (for reference):** small uncommitted set — `README.md` (Phase 4 polish), `docs/specs/corpus-stats-on-site.md` (Phase 4 status stamp), `.claude/commands/blog_content_creator_people.md` (v1 corpus bullet), `docs/blog-automation/backlog-queue.json` (Brené Brown re-queue), `src/lib/components/molecules/famousTypes.ts` (slug normalization), and this brief itself. Commit when convenient — no dependencies block other work.
