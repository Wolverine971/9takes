<!-- docs/content-strategy/emerging-entity-gap-playbook.md -->

# Emerging Entity Gap Playbook

## The strategy

An Emerging Entity Gap appears when a person's relevance and name-search demand grow faster than the
web's ability to explain who they are. 9takes can win these searches by publishing the best sourced,
general-interest psychological profile before Wikipedia and major publishers fill the gap.

Jordi Hays is the calibration case:

- rising demand tied to TBPN and the OpenAI acquisition
- no personal Wikipedia page
- a first page dominated by LinkedIn, social posts, directories, and thin profiles
- broad identity, age, spouse, parents, background, and TBPN query intent
- a long first-person interview record plus third-party coverage
- an ownable thesis: the spectacle is the delivery system for a disciplined operating machine

The page works because it satisfies biography intent first and makes personality analysis the reason
it is more memorable than a normal biography.

## What to copy

### Subject selection

1. Track rising people, then separately score exact-name SERP weakness.
2. Prefer concrete, ongoing catalysts: breakout roles, acquisitions, launches, funding, press tours,
   controversies with staying power, viral series, promotions, awards, or cultural crossovers.
3. Favor strong 9takes niches: frontier builders, rising stars, streamers, business creators,
   podcasters, big-tech founders, pop stars, and people translating a niche into mainstream culture.
4. Require enough public record to write responsibly. A weak SERP without interviews is a trap.
5. Move before a personal Wikipedia page and authoritative biography stack arrive.

### Search-intent architecture

1. Keep the exact person name as the visible H1.
2. Use a distinct SEO title: `Name + a falsifiable, curiosity-producing thesis`.
3. Explain who the person is and why they matter in the opening screen.
4. Give the reader a sourced life-and-career spine: formation, important work, failure/pressure,
   current relevance, and collaborators.
5. Answer verified biography queries directly. Age, partner, education, parents, and similar facts
   belong only when a reliable source exists; an honest uncertainty answer is better than invention.
6. Use search-intent headings where they help, but organize the article around one memorable
   contradiction rather than a generic `Early Life / Career / Personal Life` template.
7. Put typology depth in the diagnosis/rabbit-hole sections. The main body should work for readers who
   have never heard of the Enneagram.

### Editorial quality

1. Open on a concrete, falsifiable scene or object.
2. Make the subject's own words carry the analysis.
3. Include named third-party testimony and a visible source trail.
4. Separate observation from interpretation.
5. Pressure-test the type against contrary evidence.
6. Preserve the sharp central thesis during refreshes; integrate corrections rather than replacing a
   winning article with an unrelated rewrite.
7. Do not target a word count. Write until the searcher's real identity question is resolved.

### Technical foundation

1. One lowercase canonical URL and permanent redirects from variants.
2. Server-rendered content, index/follow, sitemap inclusion, crawlable internal links.
3. Reviewed SEO title consistently used by `<title>`, Open Graph, Twitter, and Article headline.
4. Exact name visible in H1 and Person JSON-LD.
5. Only real `sameAs` identity URLs. Never synthesize Wikipedia, IMDb, social, or Wikidata entities.
6. Honest `dateModified`: change it when the reader-visible article materially changes.
7. Explicit author, citations, image metadata, Article/Person/Breadcrumb schema; FAQ metadata only for
   real on-page questions and answers, never as a ranking superstition.

### Cluster reinforcement

1. Link profiles for cohosts, cofounders, spouses who are public collaborators, and direct rivals.
2. Publish a relationship/dynamic article only when it answers a distinct question.
3. Add the subject to accurate category/type hubs.
4. Use descriptive internal anchors such as `Jordi Hays's Type 3 personality analysis`.
5. Do not manufacture near-duplicate articles solely to create links.

## What not to copy

- sensational claims unsupported by primary or reputable reported sources
- invented childhood motives or private interior states
- fake precision for birthdays, net worth, deal prices, family history, or diagnoses
- formulaic “can't stop” titles on every subject
- 5,000 words as a target
- FAQ/schema stuffing
- freshness dates without substantive updates
- wholesale rewrites of pages already winning their exact-name query

## Operating workflow

1. `/find-surging-people` generates rising names.
2. `/find-emerging-entity-gaps` verifies SERP weakness, biography intent, source depth, and timing.
3. `scripts/emerging-entity-gap-candidates.mjs` prefilters existing pages from local GSC signals.
4. `scripts/run-blog-pipeline.sh` produces a single-subject entity-gap packet before create/refresh.
5. Creator/refresh stages use that packet to integrate biography intent without turning the page into a
   fact farm.
6. Save the baseline, change log, hypothesis, and check date before publishing.
7. Evaluate after 28 days; extend to 56 days when data is sparse.

## Experiment design

Use a small cohort rather than changing the entire corpus at once.

### Cohort

- 2-3 `RETROFIT` pages with weak exact-name SERPs and enough current impressions to measure
- 1 `PROTECT` page such as Jordi for factual/technical cleanup only
- 2 matched comparison pages left unchanged when possible

### Baseline

For each page, record the latest 28-day:

- total clicks, impressions, CTR, and average position
- exact-name query metrics
- biography-query-family metrics
- engaged time and scroll where available
- current title, description, H1, word count, FAQ coverage, and last modification date

### Hypotheses

Predict ranges before editing. Default expectations for a real retrofit:

- exact-name CTR: +20% to +60% relative after recrawl
- biography-query impressions: +25% to +100% as Google tests new relevance
- total organic clicks: +15% to +50%, conditional on demand
- exact-name position: improve 0.5-2.0 places, usually slower than CTR
- engaged time: no more than a 10% decline; aim for an increase

These are experiment hypotheses, not promises. Low-volume pages will be noisy.

### Diagnosis at check-in

Separate four outcomes:

1. **Demand win:** impressions rise while position is stable.
2. **Ranking win:** position improves at roughly stable demand.
3. **Snippet win:** CTR improves at roughly stable position and demand.
4. **Content win:** engaged time/scroll improves after landing.

Do not call a loss from clicks alone when name demand fell. Do not call a win from impressions alone
when average position collapsed.

## Jordi-specific protected actions

- Preserve `/personality-analysis/jordi-hays` and the serious-showman thesis.
- Preserve broad biography coverage and exact-name H1.
- Merge verified corrections into the live article rather than replacing it with the narrower draft.
- Keep age/spouse/TBPN answers sourced and cautious.
- Remove false entity links, align search/schema title surfaces, and update `lastmod` only when the
  reader-visible merge ships.
- Watch exact name, `age`, `wife`, `parents`, `background`, `bio`, and `tbpn` separately.
