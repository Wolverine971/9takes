<!-- docs/content-analysis/personality-analysis-performance-deep-dive-2026-05-29.md -->

# Personality-Analysis Performance Deep Dive — 2026-05-29

Independent analysis of the `/admin/analytics` release-performance over/under-performers.
Pulled live data via `get_content_release_performance` (343 published people blogs) +
`content_analytics_daily` source rollups + 25.6k raw `page_analytics_visits` (last 120d).

## TL;DR — what actually drives traffic

| Signal                                | Correlation with total views (mature, n≈305) |
| ------------------------------------- | -------------------------------------------- |
| **Organic search visit count**        | **0.71** ← the whole game                    |
| Scroll depth (avg_scroll_pct)         | 0.40                                         |
| Age in days                           | 0.40                                         |
| Word count                            | 0.18                                         |
| Suggestions count                     | 0.12                                         |
| **Content-quality grade (overall)**   | **0.11** ← basically noise                   |
| Evidence sub-score                    | 0.24                                         |
| Hook sub-score                        | **0.02** ← zero                              |
| Originality sub-score                 | 0.07                                         |
| FAQs / same_as / citations / keywords | 0.04–0.07 each                               |

**Traffic is almost entirely an SEO outcome, and our quality grade does not predict it.**
The grade measures craft; Google ranks demand + authority + maturity. Those are nearly orthogonal.

## Finding 1 — The quality grade is cookie-cutter (DJ was right)

Graded blogs cluster in a razor-thin band:

- 88% of graded blogs (244/278) score **8.5–9.4 overall**.
- Top-traffic quartile avg grade **8.93**; bottom-traffic quartile avg **8.84**. Statistically identical.
- Hook sub-score correlation with traffic = **0.016** (none). Every blog "hooks" the same.

The grader has almost no variance, so it cannot discriminate winners from losers. It's a
floor-check ("is this competently written?"), not a performance predictor. We're optimizing a
metric that's already maxed out while the metric that matters (search demand capture) is unmanaged.

The one quality dimension with a real (if modest) signal is **evidence** (r=0.24; top quartile 8.92
vs bottom 8.50). Depth of specific, verifiable evidence is the part of craft that may actually feed
rankings/AEO. That's where grading rigor should concentrate.

## Finding 2 — Underperformance = no organic search, not bad writing

Source mix, top vs bottom traffic quartile (mature blogs):

|                            | Search | Internal | Other/uncategorized | Zero-search blogs | >60% internal   |
| -------------------------- | ------ | -------- | ------------------- | ----------------- | --------------- |
| **Top quartile** (n=78)    | strong | 42%      | 48%                 | **1%**            | 5/78            |
| **Bottom quartile** (n=78) | weak   | **66%**  | 29%                 | **28%**           | **45/78 (58%)** |

- Bottom-quartile blogs survive almost entirely on **internal links**. 28% have _never_ received a
  single organic search visit; 58% are >60% internal traffic.
- The internal-linking machine works — every blog gets internal traffic — but internal traffic has a
  low ceiling (~30 lifetime views). The winners are the ones Google also feeds.
- **Search-visit count → total-views correlation is 0.71.** Nothing else comes close.

Implication: an underperformer is rarely "a bad blog." It's a blog that never ranked — because the
**subject has little search demand**, the post is **too young to have matured in the index**, or
both. See Findings 4 and 5.

## Finding 3 — Subject selection is the biggest lever

Top 20 by lifetime views are dominated by globally-searched names: iShowSpeed (296), Sabrina
Carpenter (266), Alex Karp (247, only 64 days old), Ryan Gosling (220), Sam Altman, Elon Musk,
Sydney Sweeney, Billie Eilish, Mark Zuckerberg, Marilyn Monroe.

By niche tag (median lifetime views, mature, ≥4 blogs):

- **Winners:** frontier-builder 178, alternative-artist 107, rising-star 100, streamer 98,
  newMovieStar 82, big-tech-founder 79, pop-star 75.
- **Losers:** activist 36, influencer 37, tiktoker 39, music-crossover 38, author 42,
  singer-songwriter 46, lifestyle-builder 50.

`alex-karp` (64d, grade 8.9) already beats almost every 430-day-old post — because Palantir was a hot
search topic in its window. `morgan-freeman` is **1,385 words, ungraded**, and still has 132 views on
pure name demand. Picking a high-search-demand subject at a moment of rising interest beats craft and
beats age. **A briefly-trending or evergreen-searched subject is worth more than a perfect blog about
someone nobody googles.**

## Finding 4 — A lot of "underperformance" is just immaturity

Top-traffic quartile avg age = **375 days**; bottom quartile = **144 days**. Age correlates 0.40 with
traffic because organic rankings compound over 6–12 months. ~235 of 343 blogs are still
`insufficient_history` for benchmarking. Many flagged "underperformers" are simply <5 months old and
haven't aged into the index yet. The dashboard should separate "genuinely weak" (mature + low search)
from "still cooking" (young) — right now they blur together in the below-norm band.

## Finding 5 — The render is mostly clean, with two real issues

Good news: the analysis body (`{@html post.content}`) renders server-side for everyone. Only the
**comments** are give-first gated (lazy-loaded via IntersectionObserver). Search-preview bots
(Googlebot, Bingbot, Applebot, GPTBot, ClaudeBot, PerplexityBot…) are explicitly allow-listed and get
the full page + a 1h edge cache. So there is **no cloaking / no gated-content SEO problem**. Content is
indexable. 👍

Two issues worth fixing:

**5a. Scroll depth is a broken signal — and the demand score weights it 35%.**
`+layout.svelte` computes `scrollTop / (scrollHeight − innerHeight)`. The formula is fine, but on these
pages the **related-posts and comments sections lazy-load below the article**, inflating `scrollHeight`
after the reader has already passed the content. Result: avg recorded scroll is **5–15% even on top
performers** — implausibly low. Yet `releasePerformanceScoring.ts` computes
`engagementValue = min(avgEngagedMs/60000,1)*45 + min(avgScrollPct/60,1)*35 + engagedShare*20`.
A genuine 9% scroll contributes only ~5 of 35 points, and **longer/deeper articles are penalized
hardest** because they're tallest. The "quality-demand" score is being dragged down by a metric that
mostly measures page height. Recommend: measure scroll against the article element height only (not the
full document), or drop scroll's weight to ~10–15% and lean on engaged_ms.

**5b. Acquisition-source attribution under-reports search by ~2x (dashboard bug).**
Of 25,644 people visits (120d), **10,907 (43%) have `acquisition_source = NULL`.** Of 3,871 visits with
a clear search-engine referrer, only 1,775 are classified `search/*` — **2,050 search visits (53%) are
mis-bucketed** into "other"/"unknown" because `acquisition_source` is null while `referrer_host` is
literally `www.google.com`. The daily `source_breakdown` rollup keys purely on `acquisition_source` with
no referrer fallback, so the dashboard shows "search ~7%" when reality is ~15%. `normalize_acquisition_source`
isn't catching `www.google.com`/`bing`/`yahoo`/`brave`/`yandex`/android-quicksearch/AI hosts (or
referrer_host isn't populated at insert). This means **the over/under-performer view systematically
hides how much of the winners' edge is organic search.** Fix the normalization + add a referrer fallback
to the rollup, then re-evaluate the bands.

## Finding 6 — Distribution isn't reaching the blogs

Social = **0.1%** of people traffic despite heavy Instagram/Twitter/Quora warmup work. AI engines
(claude.ai, chatgpt, perplexity, gemini) are present but tiny (~50 visits/120d). Either the social
funnel doesn't link through to analyses, or it's not attributed (see 5b). Worth a UTM audit on every
distribution asset so we can actually see what social/AEO sends.

## Recommendations (ranked by expected leverage)

1. **Pick subjects by search demand, not vibes.** Before writing, check that the person has real,
   ideally rising, search volume (trending news, new release, awards run). One Alex-Karp-timed post >
   ten perfectly-crafted posts about low-demand names. Build a "who's surging" intake instead of a flat
   queue.
2. **Stop trusting the quality grade as a performance metric.** Keep it as a floor check. Re-point
   grading rigor at _evidence depth and specificity_ (the only craft dimension that correlates) and at
   _title/description search-intent match_, not at hook polish.
3. **Fix the two analytics bugs (5a scroll, 5b search attribution)** so the dashboard tells the truth.
   Until then, mentally double the search share of your winners and discount the scroll-driven part of
   the demand score.
4. **Re-cut the under-performer view by age.** Only act on _mature_ (≥120d) + low-search blogs. Leave
   young posts alone to mature.
5. **For mature + low-search blogs, the fix is search-side, not rewrite-side:** sharper
   keyword-targeted title/H1/description matched to how people actually search the person, more
   _incoming_ internal links from high-traffic siblings, and refreshed `lastmod`. A rewrite that
   doesn't change search-intent targeting won't move traffic.
6. **AEO bet:** AI-engine referrals are small but the fastest-growing channel and we already allow the
   crawlers. Tighten the evidence ledger + FAQ schema (the structured, citable parts) to win AI answers
   — that's the version of "quality" that maps to the next traffic wave.
7. **Close the distribution→blog loop:** UTM-tag every social/Quora/IG asset so traffic is attributed,
   and make sure those assets actually deep-link to the analysis.

## Method notes / caveats

- "Mature" = published ≥30d ago (305–309 blogs depending on join). Quartiles by lifetime `total_views`.
- Search-share numbers in Finding 2 use the (buggy) rollup buckets, so they _understate_ search for
  both groups — but the top/bottom _gap_ and the zero-search counts hold regardless.
- Correlation ≠ causation; age/search/demand are entangled. The robust takeaway is directional:
  search-capture and subject-demand dominate; craft-grade does not.
