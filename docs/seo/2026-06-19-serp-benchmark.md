<!-- docs/seo/2026-06-19-serp-benchmark.md -->

# SERP / GEO benchmark — 2026-06-19

Target-query benchmark run as iteration 2 of the SEO/GEO audit loop.
Data source: `docs/data/gsc/2026-06-11-*` (GSC, 28-day window 2026-05-12 → 2026-06-09).

## Headline conclusion

The **technical SEO foundation is solid** (verified iteration 1: crawler content-serving,
sitemap, templated titles + SERP budgets, multi-schema JSON-LD, and now complete
`llms.txt`/`llms-full.txt`). **Every remaining high-impact gap is content / editorial,
not a code bug.** Quick technical fixes will not move these numbers — they need ranking
authority, snippet/intent work, or content-architecture decisions, all with multi-week
feedback loops.

## Section performance (28d, page-level)

| Section              | Impressions | Clicks | CTR   | Read |
| -------------------- | ----------- | ------ | ----- | ---- |
| enneagram-corner     | 75,340      | 494    | 0.66% | Educational hub. Best positions (many pos 5–12). Most movable. |
| personality-analysis | 59,073      | 294    | 0.50% | Big impression base but a ranking ceiling at pos 6–15 vs. entrenched competitors. |

## Ranked gaps (by realistic leverage)

### 1. Striking-distance educational pages — HIGHEST realistic leverage, in-lane

File-based MDsvex pages sitting at the **top of page 2** with thousands of impressions.
These are the most movable (pos 8–15 → page 1) and editable directly.

| Page | Imp | Pos | CTR | Clicks |
| ---- | --- | --- | --- | ------ |
| enneagram-and-mental-illness | 4,283 | 8.3 | 2.36% | 101 |
| enneagram-compatibility-matrix | 3,799 | 11.5 | 0.76% | 29 |
| astrology-and-the-enneagram | 3,236 | 8.5 | 0.65% | 21 |
| enneagram-wings-complete-guide | 3,080 | 14.9 | 0.16% | 5 |
| enneagram-instinctual-subtypes | 2,806 | 14.5 | 0.25% | 7 |
| enneagram-test-comparison-2025 | 2,766 | 14.4 | 0.22% | 6 |
| enneagram-vs-personality-frameworks-comparison | 1,631 | 8.6 | 0.06% | 1 |

Levers: content depth, answer-first H2 blocks for the exact query, internal links with
exact-match anchor text, freshness. Note: `enneagram-and-mental-illness` is the
top-traffic page — light-touch only (no title/slug/structure changes).

### 2. Personality-page CTR + ranking ceiling — huge in aggregate, slow per-page

Celebrity pages rank pos 6–15 and convert ~0.2–0.5%. **66 query-pairs / 5,451 impressions**
leak at pos 4–15 with <1.5% CTR. Standout: `sabrina-carpenter` — **2,623 imp at pos 5.9,
5 clicks (0.19%)**; on the exact query "sabrina carpenter personality" pos 5.6 / 0.40%.

Two sub-causes:

- **meta_title intent-keyword gap.** The catalog mixes two styles. Intent-matched
  (`emma-watson`: "Why Is Emma Watson So Private? Her **Type 1 Personality** Explained";
  `ishowspeed`: "Why Is IShowSpeed So Loud? His **Personality** Explained") vs.
  clever-but-opaque (`sabrina-carpenter`: "Why Sabrina Carpenter's Humor Hides an
  Achievement Machine"; `ryan-gosling`, `tom-hardy`, `dua-lipa`, `timothee-chalamet` — no
  "personality"/"type"/"Enneagram" keyword). The opaque titles can't win the bolded
  exact-match for "[name] personality type" queries.
  **Winning template (already in use): provocative hook + "[Name]'s Type N Personality, explained" tail.**
- **Ranking ceiling.** Even intent-matched pages (emma-watson, ishowspeed) sit at pos 9–11
  with ~0% CTR, so position — not just snippet — caps these. Competitors (Personality
  Database, famous-birthdays) own the top spots. This is slow authority work.

Caveat: because intent-matched titles also under-convert at pos 9–11, a meta_title sweep is
a real but **modest** lever until ranking improves. Worth doing for pos 4–7 pages where the
snippet is the only lever.

### 3. Keyword cannibalization

`enneagram-types-in-relationships` (7,500 words, 41 inbound internal links, exact-match
title) ranks **pos 48–66** for its own core queries ("enneagram types in relationships"
pos 48.5; "enneagram type compatibility" pos 66 / 160 imp), while
`enneagram-compatibility-matrix` ranks pos 11.5 for the compatibility cluster. Google has
chosen the matrix page and buried the relationships page. Needs a content-architecture
decision: differentiate intent (relationships ≠ compatibility), consolidate, or fix
internal-anchor signals. (lastmod 2026-03-20 — may also be in post-update re-evaluation.)

### 4. Answer-first content gap (specific, fact-gated)

"kara swisher amanda katz age difference" — the single largest non-brand query,
**~2,600 impressions across page + fragments, pos 7–9, ~0% CTR**. The page ranks but does
not directly answer the age-difference question, so it neither earns the click nor the
AI-overview citation. Needs a fact-checked answer-first block (research required — do not
fabricate the ages).

## Recommended next actions (with owners)

1. **Editor / content** — striking-distance enrichment on gap #1 pages (answer-first H2s +
   internal links). Highest realistic ROI. Slow feedback (re-benchmark in 3–4 weeks).
2. **DJ decision (brand voice)** — approve a meta_title sweep to the winning template for
   the ~opaque celebrity titles (gap #2a). Outward-facing; needs sign-off before SQL.
3. **Content architecture** — resolve gap #3 cannibalization.
4. **Research + editor** — fact-checked answer-first block for gap #4.

## How to re-run this benchmark

1. `node scripts/fetch-gsc-data.mjs` (refresh GSC drop) — or drop a new CSV export.
2. Re-read `docs/data/gsc/latest.json` and re-run the striking-distance / CTR-leak / gap
   queries against the new `*-pages.csv` and `*-page-query.csv`.
