<!-- docs/seo/2026-05-06-review-summary.md -->

# 9takes SEO Research — Review Summary (2026-05-06)

All four reports are saved to `docs/seo/`. Here's what's there and what to read in what order.

## Deliverables (read in this order)

1. **[`2026-05-06-research-synthesis.md`](2026-05-06-research-synthesis.md)** (10 KB) — start here. Top 10 priorities, the 6 converged conclusions, what we're explicitly NOT chasing.
2. **[`master-topic-cluster-map-2026-05-06.md`](master-topic-cluster-map-2026-05-06.md)** (57 KB, 798 lines) — the keyword + topic-cluster map across all 5 pillars. 200+ specific spoke topics with intent/difficulty/status. 25 AEO citation surfaces. Full 30/60/90-day execution plan. "If I only do 5 things" digest at the bottom.
3. **[`competitor-serp-brief-2026-05-06.md`](competitor-serp-brief-2026-05-06.md)** (25 KB) — external SERP landscape from 35+ live searches. Where 9takes already wins (Doechii, Sabrina Carpenter, Sam Altman, Pete Davidson, Sydney Sweeney top-3). Top 15 winnable queries + 15 first-party-data queries. PDB weakness map.
4. **[`corpus-inventory-gaps-2026-05-06.md`](corpus-inventory-gaps-2026-05-06.md)** (29 KB) — internal coverage audit. Top 25 next-to-write list with impact/effort scores. 32 already-drafted profiles ready to flip live (Anna Wintour, Brené Brown, Hayao Miyazaki, Glen Powell, Conan O'Brien, Adam Sandler, Harrison Ford, Robert De Niro, Seth Rogen, etc.).

## The headline findings

- **Sitemap is missing ~75 URLs** (33 pop-culture, 18 community, 12 how-to-guides) — including `succession-personality-trap`, `marvel-universe-enneagram-analysis`, `kardashian-family`, `tech-titans-*` series. One-day eng fix in `scripts/generate-sitemap.js`. Single biggest lever on the site.
- **Corpus-stats is the AEO superweapon and it's barely cross-linked.** Type 4 = 35% musicians (+21pp), Type 7 = 40% comedians (+27pp), Type 5 = 20% tech founders (+13pp), Type 2 = 17% politicians (+9pp, counterintuitive). Crystal Knows wins AI Overviews with thinner numerical claims; we have a larger sample and aren't surfacing it.
- **The moat is Enneagram × pop-culture × first-party stats** — already proven by top-3 SERPs on Doechii, Sabrina Carpenter, Sam Altman, Pedro Pascal, Pete Davidson. Don't try to dislodge Enneagram Institute on definitional terms.
- **The biggest content gaps are wings (18 pages), subtypes (27 pages), TV-show casts** (Office, Friends, Succession, Bear, Severance — all zero coverage; top SERPs are 7-year-old Medium posts).
- **Four graphs barely talk to each other.** `/questions` is almost entirely orphaned from the blog corpus despite 107 indexed URLs.

## Top 10 priorities (synthesized across all three reports)

| #   | Priority                                                                                                                                                                                                                                                          | Why                                                                                                                             |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Fix the sitemap** (surface ~75 missing pop-culture/community/how-to-guides files)                                                                                                                                                                               | Makes every other lever more valuable. One-day eng fix.                                                                         |
| 2   | **Flip the 32 already-drafted-with-image profile drafts** to `link:true`                                                                                                                                                                                          | Drafts written, images exist — single config flip per name.                                                                     |
| 3   | **Upgrade the 9 `/personality-analysis/type/N` pages** with corpus-stat callout + `Quotation` schema + FAQ block + 3 cross-links to corpus-stats anchors                                                                                                          | Highest-value cluster on the site you're not maximizing. Each is a head-term page already, just under-built for AEO.            |
| 4   | **Add corpus-stat callouts to the 7 `/personality-analysis/categories/[slug]` pages**                                                                                                                                                                             | First-party data play. No competitor can match. AI-Overview citation bait.                                                      |
| 5   | **Ship the TV-show character casts cluster** — start with The Office, Friends, Succession, The Bear, Severance                                                                                                                                                    | 7-year-old Medium posts and Tumblrs hold top 5; zero quality competition. Cross-link to existing actor profiles.                |
| 6   | **Ship the 18 wings pages + 9 mistype pages + 12 highest-volume Type-vs-Type pages** (cookie-cutter templates)                                                                                                                                                    | Three clusters, ~39 cookie-cutter pages, all low-difficulty long-tail head terms.                                               |
| 7   | **Bridge the four graphs.** Add `RelatedPosts` to all 22 pop-culture pages (110 links). Wire `question_keywords` into related-blogs lookup. Cross-link every profile to corpus-stats anchor.                                                                      | Cross-link report shows 28 isolated posts. Existing utility (`getRelatedBlogs`) automates most of this.                         |
| 8   | **Mental-health expansion cluster** — write `/enneagram-corner/enneagram-and-adhd`, `/enneagram-and-trauma`, `/enneagram-childhood-wounds-by-type`. Tie to celebrity case studies (Robin Williams, Britney Spears, Pete Davidson — all in current draft pipeline) | `/stories/enneagram-and-mental-illness` is already #1 SERP and top traffic. Sibling pages get the same lift.                    |
| 9   | **Title + meta description budget pass** (still open from 2026-04-07 audit — 269 over-length titles, 125 over-length descriptions). Switch all article templates from `summary` to `summary_large_image` Twitter card.                                            | One PR. Sitewide CTR lift.                                                                                                      |
| 10  | **Launch the parenting vertical** (`/how-to-guides/enneagram-parenting` pillar + 9 "Type N parent" + 9 "Type N child" pages)                                                                                                                                      | Per `domain-authority/00-master-index.md` this is the most untapped vertical relative to demand. Almost no quality competition. |

## What we're explicitly NOT chasing

- **Pure definitional Enneagram queries** ("enneagram", "enneagram test", "enneagram type 1") — Enneagram Institute / Truity / Wikipedia fortress. 12+ months minimum to dent and not the highest-ROI fight.
- **Tritype** — Katherine Fauvre owns the keyword and gates her test. Niche, defensible, but small upside vs. wings/subtypes.
- **Generic vs-MBTI advice content** — already saturated; add corpus stats to existing `/community/mbti-vs-enneagram` page instead of writing more.
- **MBTI-curious crossover** — Personality Hacker / 16personalities own this. We stay Enneagram-native.

## The positioning sentence

> _"The largest editorial Enneagram-meets-pop-culture database online — with first-party domain stats nobody else has, and a give-first community where the typing gets debated, not just declared."_

## Next move

Want me to start executing any of these — sitemap fix, the 32 profile-flip batch, type-page corpus-stat upgrades, or kick off one of the cookie-cutter clusters (wings / mistypes / TV casts)?
