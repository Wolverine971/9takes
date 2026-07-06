<!-- docs/seo/2026-05-06-research-synthesis.md -->

# 9takes SEO Research — Synthesis (read this first)

**Date:** 2026-05-06
**What this is:** The on-ramp doc for the May 2026 SEO research pass. Three specialized agents ran in parallel; this synthesizes their findings into the smallest set of actionable conclusions. Detail and citations live in the source reports below.

## Source reports

1. **[`master-topic-cluster-map-2026-05-06.md`](master-topic-cluster-map-2026-05-06.md)** — The keyword + topic-cluster map. Five pillars × ~30 clusters × 200+ specific spoke topics with intent, difficulty, status. Includes 25 specific AEO citation surfaces, 15 quick wins, full 30/60/90-day execution plan.
2. **[`competitor-serp-brief-2026-05-06.md`](competitor-serp-brief-2026-05-06.md)** — External SERP landscape. Where 9takes already wins, where the SERPs are locked, where the soft underbelly is. Top 15 winnable queries, 15 first-party-data queries, competitor weakness map.
3. **[`corpus-inventory-gaps-2026-05-06.md`](corpus-inventory-gaps-2026-05-06.md)** — Internal coverage audit. What exists, what's drafted, what's missing. Top 25 next-to-write list with impact/effort scores.

## What the three reports agree on (the converged conclusions)

### 1. The moat is "Enneagram × pop culture × first-party stats" — not any one of those alone

- **Enneagram Institute, Truity, Personality Path** own pure-Enneagram SERPs and we won't dislodge them in 12 months — _and we shouldn't try_.
- **Personality Database (PDB) and boo.world** own pop-culture personality but their pages are voting widgets with no editorial. PDB returns 403 on web fetch (likely crawl-quality penalty).
- **Nobody publishes a real, refreshable, domain-by-domain Enneagram distribution dataset.** 9takes does (319 published profiles, 7 categories, monthly refresh via `pnpm gen:corpus-stats`).

The intersection is where 9takes already has top-3 SERPs (Doechii, Sabrina Carpenter, Sam Altman, Pedro Pascal, Pete Davidson, Sydney Sweeney). Compound it.

### 2. The single biggest pre-content fix: **the sitemap is undercounting by ~75 URLs**

`static/sitemap.xml` is missing roughly:

- 33 of 55 pop-culture pages (incl. `succession-personality-trap`, `marvel-universe-enneagram-analysis`, `kardashian-family-enneagram-analysis`, `tech-titans-*` series, `pop-queens-enneagram-analysis`)
- 18 of 35 community pages
- 12 of 24 how-to-guides

These are some of the strongest pop-culture spokes the site has, and **they're invisible to Google**. One-day eng fix in `scripts/generate-sitemap.js` + `published: true` audit on the missing files. Do this before anything else; it makes every other lever more valuable.

### 3. The corpus-stats file is 9takes' AEO superweapon and it's barely cross-linked

`docs/data/corpus-stats.md` already contains pre-computed citation-ready sentences:

- Type 4 = 35.1% of musicians (+21pp baseline)
- Type 7 = 40% of comedians (+27pp)
- Type 5 = 20% of tech founders (+13pp)
- Type 2 = 17% of politicians (+9.2pp) — counterintuitive, AI-Overview honey
- Type 3 = 28.4% of creators (+8.3pp)
- Type 5 = 30.8% of authors (+24pp; small n)

**LLMs cite extractable numerical claims with stable URLs.** Crystal Knows beats deeper sites in AI Overviews because they include "Type 5 is 4.8% of users." 9takes has structurally identical claims with a _larger sample_ and _isn't using them on most pages._ Master report Section 3 lists 25 specific URLs/sections that should embed `Quotation` schema with these stats.

### 4. There are four silos and the bridges don't exist

The site has four loosely-connected graphs:

1. `/personality-analysis` (319 profiles + 7 categories + 9 type pages) — internally well-linked
2. `/enneagram-corner` (108 indexed) — well-linked post the recent audit
3. `/pop-culture` + `/community` + `/how-to-guides` — sparsely linked; 28 posts have **zero** outgoing links per the cross-link report
4. `/questions` (107 indexed) — almost entirely isolated from 1–3

Specific bridges to build are listed in the master map Section 7 (9 bridge classes, ~700+ link insertions automatable via the existing `getRelatedBlogs` utility).

### 5. The biggest _content_ gaps are wings, subtypes, and TV-show casts

- **18 wing pages** (4w3, 4w5, 6w5, 9w8, etc.) — currently only one mega-guide. Highest single-cluster volume win.
- **27 instinctual subtype pages** (sp-4, so-9, sx-8, etc.) — competitor SERPs here are weak (Beatrice Chestnut, Integrative9, Narrative Enneagram). Outline already drafted in `enneagram/drafts/27-enneagram-subtypes.md`.
- **TV-show character casts** — The Office, Friends, Succession, The Bear, Severance, Yellowstone, GoT/HOTD, White Lotus, Stranger Things, Ted Lasso, Mad Men, Breaking Bad — _all_ zero coverage on 9takes. Top results are 7-year-old Medium posts and personal Tumblrs. Easy land grab.

### 6. The Q&A platform is leaking authority both directions

107 question URLs indexed; almost no internal links from blog → questions and almost none from questions → blog. The 2026-04-07 question-page audit recommendations are still partially open (preserve full question in `<title>`, render `context` publicly, switch to `DiscussionForumPosting` schema, add related-questions block). See master map Section 5.

---

## Top 10 priorities (synthesized across all three reports)

Ranked by ROI = impact × already-done-effort.

| #   | Priority                                                                                                                                                                                                                                                              | Why                                                                                                                             | Source                                                  |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| 1   | **Fix the sitemap** (surface ~75 missing pop-culture/community/how-to-guides files)                                                                                                                                                                                   | Makes every other lever more valuable. One-day eng fix.                                                                         | Master Q1, Quick Win #1                                 |
| 2   | **Flip the 32 already-drafted-with-image profile drafts** to `link:true` (Anna Wintour, Brené Brown, Hayao Miyazaki, Glen Powell, Jonah Hill, Reese Witherspoon, Ray Dalio, Conan O'Brien, Markiplier, Adam Sandler, Harrison Ford, Robert De Niro, Seth Rogen, etc.) | Drafts written, images exist — single config flip per name.                                                                     | Corpus Audit, Quick-Win Republish Queue                 |
| 3   | **Upgrade the 9 `/personality-analysis/type/N` pages** with corpus-stat callout + `Quotation` schema + FAQ block (rare? famous? career? wing? compatibility? mistype?) + 3 cross-links to corpus-stats anchors                                                        | Highest-value cluster on the site you're not maximizing. Each is a head-term page already, just under-built for AEO.            | Master Cluster 1B, Quick Win #2                         |
| 4   | **Add corpus-stat callouts to the 7 `/personality-analysis/categories/[slug]` pages** ("Type 4 is 35% of profiled musicians, +21pp above baseline" on `/music`; "Type 7 is 40% of comedians" on `/comedy`; etc.)                                                      | First-party data play. No competitor can match. AI-Overview citation bait.                                                      | SERP Brief Section "First-Party Data," Master Section 3 |
| 5   | **Ship the TV-show character casts cluster** — start with The Office, Friends, Succession (5 names already in corpus), The Bear, Severance                                                                                                                            | 7-year-old Medium posts and Tumblrs hold top 5; zero quality competition. Cross-link to existing actor profiles.                | SERP Brief Cluster E, Corpus Audit Pop-Culture Gaps     |
| 6   | **Ship the 18 wings pages + 9 mistype pages + 12 highest-volume Type-vs-Type pages** (cookie-cutter templates)                                                                                                                                                        | Three clusters, ~39 cookie-cutter pages, all low-difficulty long-tail head terms.                                               | Master Clusters 3B, 3D, 3E                              |
| 7   | **Bridge the four graphs.** Add `RelatedPosts` to all 22 pop-culture pages (110 links). Wire `question_keywords` into related-blogs lookup. Cross-link every profile to corpus-stats anchor.                                                                          | Cross-link report shows 28 isolated posts. Existing utility (`getRelatedBlogs`) automates most of this.                         | Master Section 7, Quick Win #7                          |
| 8   | **Mental-health expansion cluster** — write `/enneagram-corner/enneagram-and-adhd`, `/enneagram-and-trauma`, `/enneagram-childhood-wounds-by-type`. Tie to celebrity case studies (Robin Williams, Britney Spears, Pete Davidson — all in current draft pipeline)     | `/stories/enneagram-and-mental-illness` is already #1 SERP and top traffic. Sibling pages get the same lift.                    | SERP Brief Top 15 Opportunities #6, #7, #8              |
| 9   | **Title + meta description budget pass** (still open from 2026-04-07 audit — 269 over-length titles, 125 over-length descriptions). Switch all article templates from `summary` to `summary_large_image` Twitter card.                                                | One PR. Sitewide CTR lift.                                                                                                      | Master Quick Wins #10, #11                              |
| 10  | **Launch the parenting vertical** (`/how-to-guides/enneagram-parenting` pillar + 9 "Type N parent" + 9 "Type N child" pages)                                                                                                                                          | Per `domain-authority/00-master-index.md` this is the most untapped vertical relative to demand. Almost no quality competition. | Master Section 8 (Days 61–90, P0)                       |

## What we're explicitly NOT chasing

- **Pure definitional Enneagram queries** ("enneagram", "enneagram test", "enneagram type 1") — Enneagram Institute / Truity / Wikipedia fortress. 12+ months minimum to dent and not the highest-ROI fight.
- **Tritype** — Katherine Fauvre owns the keyword and gates her test. Niche, defensible, but small upside vs. wings/subtypes.
- **Generic vs-MBTI advice content** — already saturated; add corpus stats to existing `/community/mbti-vs-enneagram` page instead of writing more.
- **MBTI-curious crossover** — Personality Hacker / 16personalities own this. We stay Enneagram-native.

## The positioning sentence

> _"The largest editorial Enneagram-meets-pop-culture database online — with first-party domain stats nobody else has, and a give-first community where the typing gets debated, not just declared."_

Build everything around this. Master report Section 6 has the full competitor positioning matrix.

---

## Methodology note

This research pass used three parallel agents:

- **seo-content-strategist** — read existing 9takes SEO docs (`docs/seo/*`, `docs/audits/seo-audit-9takes-2026-04-07.md`, `docs/data/corpus-stats.md`, `docs/archives/domain-authority-feb-2026/`), then mapped clusters across all five pillars with WebSearch SERP sanity-checks.
- **research-analyst** — sampled 35+ live SERPs via WebSearch + page-level fetches. Focused entirely on external competitor + AI Overview view.
- **general-purpose corpus auditor** — read-only inventory of `src/blog/`, `src/lib/components/molecules/famousTypes.ts`, `docs/data/corpus-stats.md`, route files. No external sources.

The three reports were synthesized into this document. Source agents' reasoning and citations are preserved in their respective files; this synthesis intentionally summarizes rather than restates.

**Refresh cadence:** Re-run when corpus-stats refreshes (monthly via `pnpm gen:corpus-stats`) or when a major content batch ships. The three source files can be regenerated independently.
