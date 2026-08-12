<!-- .claude/commands/find-emerging-entity-gaps.md -->

# Find Emerging Entity Gaps

Find people whose public importance and search demand are growing faster than the web's biography
coverage, then decide whether 9takes should create, retrofit, or hold a personality profile.

This command looks for the pattern behind the Jordi Hays result: a rising person, a weak exact-name
SERP, substantial biography intent, enough primary evidence for a memorable profile, and a domain
with enough topical authority to become one of the best pages about that person.

This is not a generic trend scout. `/find-surging-people` answers **who is hot?** This command answers
**where can 9takes plausibly become the biography of record before the rest of the web catches up?**

## Input and modes

`$ARGUMENTS`

- No person supplied: **discovery mode**. Find and rank new and already-covered opportunities.
- A person/slug plus `--single`: **single-subject mode**. Produce a durable intent/SERP packet for the
  blog pipeline.
- `--non-interactive`: never pause for confirmation. Research, save the appropriate artifact, report,
  and exit.

## Pre-approved operations

- WebSearch / WebFetch: live exact-name SERPs, query variants, catalysts, biographies, source depth
- Read / Glob / Grep: drafts, GSC exports, queue, research files, corpus metadata
- Bash: read-only commands, `node scripts/emerging-entity-gap-candidates.mjs`,
  `./scripts/db-query.sh` read-only queries
- Write:
  - discovery: `docs/content-research/YYYY-MM-DD_emerging-entity-gap-scout.md`
  - single: `docs/content-analysis/entity-gaps/[Canonical-Person-Name].md`

Do not edit a blog, queue, database row, sitemap, or generated file. Selection and intent research are
this command's job; writing and publishing belong to later stages.

## The model

An Emerging Entity Gap exists when these conditions overlap:

1. **Demand is rising.** A current, durable catalyst is causing people to search the person's name.
2. **The exact-name SERP is weak.** Social profiles and thin directories dominate; few strong,
   dedicated biographies answer the query.
3. **Biography intent is visible.** Searchers want `who is`, age, spouse/partner, family, education,
   background, career, company/show, or a closely related fact.
4. **Evidence depth is strong.** Long-form first-person interviews and named third-party testimony can
   support a sourced psychological profile.
5. **9takes can add something memorable.** There is a real contradiction or pattern, not merely a
   collection of facts.

The opportunity is the intersection. A famous person with rising demand but Wikipedia, an official
bio, IMDb, Forbes, People, and major profiles is not an entity gap. An obscure person with no search
demand is not an entity gap. A viral person with no credible source trail is not yet writable.

## Step 1: Load local evidence

Read `docs/data/gsc/latest.json`, then run:

```bash
node scripts/emerging-entity-gap-candidates.mjs --limit 40
```

Treat this as a prefilter only. Its score is based on observed local signals and does not know whether
the live SERP is weak. Never report it as an SEO difficulty score.

Load existing coverage and backlog:

```bash
ls src/blog/people/drafts/*.md | sed 's#.*/##; s#\.md$##' | sort
./scripts/db-query.sh "SELECT person, title, meta_title, description, lastmod, published_at, type,
  length(content) AS content_chars, faqs FROM blogs_famous_people WHERE published = true ORDER BY person"
cat docs/blog-automation/backlog-queue.json
```

In discovery mode, also use the current `/find-surging-people` research sweeps to generate names that
9takes does not cover yet. Existing-page data alone cannot find tomorrow's new entity.

## Step 2: Verify demand and timing

For each candidate, identify:

- The dated catalyst and whether it is rising, sustained, peaked, or fading.
- At least two independent signs that people are paying attention. Prefer primary announcements,
  reputable coverage, platform growth, current releases/deals/roles, or GSC demand.
- Whether the person's name is unambiguous. Penalize common-name collisions and spelling confusion
  unless 9takes can disambiguate cleanly.

Never invent Google Trends numbers, keyword volumes, traffic, or result counts. When no hard trend
tool is available, label demand as directional and name the evidence used.

For existing pages, distinguish three different movements:

- **Rank improvement:** average position moves materially.
- **Demand expansion:** impressions rise while rank is roughly stable, as happened with Jordi Hays.
- **Snippet improvement:** CTR rises at roughly stable demand and position.

GSC exports are overlapping rolling windows. Use changes directionally; do not add them together or
present them as independent periods.

## Step 3: Audit the exact-name SERP

Run, at minimum:

- `[Person Name]`
- `"[Person Name]"`
- `[Person Name] bio`
- `[Person Name] biography`
- `[Person Name] age`
- `[Person Name] spouse` plus wife/husband/partner when appropriate
- `[Person Name] parents`
- `[Person Name] background`
- `[Person Name] [company/show/project]`

Record the first page by result type, not just domain:

- official/social profile
- Wikipedia or Wikidata-backed knowledge result
- dedicated, reputable biography/profile
- company/team directory
- database/people-search page
- news article about one event
- video/podcast/social post
- thin affiliate, merch, or obviously generated page
- irrelevant/name-collision result

Answer these questions explicitly:

1. How many top-ten results are dedicated, substantial biographies of this exact person?
2. Is there a personal Wikipedia page? A company/show page does not count.
3. Does a strong publisher own the general biography intent?
4. Would a reader still need multiple searches after opening the current results?
5. Can 9takes offer the strongest general-interest page without pretending to be an encyclopedia?

Do not infer backlink counts from web search. If no backlink data is available, say unknown.

## Step 4: Audit biography intent and source depth

Map verified search needs into three buckets:

- **Core identity:** who they are, why they matter now, signature company/show/work.
- **Life and career:** upbringing, education, timeline, formative work, failures, collaborators.
- **Fact queries:** age, partner, parents/family, location, net worth, height, or similar.

Only recommend a fact query when a reliable answer exists. Do not let celebrity-SEO bait introduce
unsourced birthdays, relationships, family claims, net-worth guesses, body measurements, diagnoses,
or private details. A sourced “not publicly established” answer is valid when that genuinely resolves
the query.

Then verify the evidence record:

- two or more substantive first-person sources
- two or more named third-party sources
- one current source tied to the catalyst
- one signature moment or contradiction that can support an ownable thesis

Thin source depth is a hard editorial penalty even when the SERP is weak.

## Step 5: Score the opportunity

Score each dimension and show the arithmetic. This is a decision rubric, not a claim about Google's
algorithm.

| Dimension                  | Points | What earns the points                                                     |
| -------------------------- | -----: | ------------------------------------------------------------------------- |
| Demand trajectory          |   0-20 | current, sustained increase with a concrete catalyst                      |
| Exact-name SERP weakness   |   0-25 | few/no substantial dedicated biographies; thin directories/social results |
| Biography-intent breadth   |   0-15 | multiple real identity/life/fact query needs                              |
| Source depth               |   0-15 | strong first-person record plus named third-party testimony               |
| 9takes angle and niche fit |   0-10 | memorable contradiction and a historically strong content niche           |
| Timing / index advantage   |   0-10 | early enough to lead; or an existing indexed URL can be refreshed         |
| Entity clarity             |    0-5 | exact name is unambiguous or cleanly disambiguated                        |

Apply penalties:

- `-20`: personal Wikipedia plus several authoritative dedicated biographies
- `-15`: attention already peaked or catalyst is unlikely to create durable name searches
- `-15`: inadequate source trail
- `-10`: serious name/entity ambiguity
- `-10`: search need is primarily gossip that cannot be answered responsibly

Classify:

- **75-100 — DIAMOND:** act now
- **60-74 — PROMISING:** act if capacity and source depth hold
- **45-59 — WATCHLIST:** monitor or improve evidence first
- **Below 45 — PASS:** not an Emerging Entity Gap

Jordi is the calibration case, not a score template. Do not reverse-engineer every candidate into a
high score.

## Step 6: Choose the action

- **CREATE:** no existing 9takes profile, score at least 60, source gate passes.
- **RETROFIT:** an indexed 9takes page exists but misses general biography intent, its snippet is too
  typology-first, or it has factual/source problems. Preserve the URL and strong passages.
- **PROTECT:** the page already owns the opportunity. Fix factual/technical defects surgically; avoid
  a wholesale rewrite that risks the ranking thesis.
- **CROSS-LINK:** the profile is healthy; build a collaborator/company/dynamic cluster around it.
- **WATCH:** promising demand but timing, evidence, or SERP conditions are not ready.
- **PASS:** a strong SERP or weak/unsafe evidence makes the opportunity illusory.

For every CREATE or RETROFIT recommendation, name the page strategy:

- exact person name remains the visible H1
- SEO title uses `Name + distinctive, falsifiable thesis`
- opening explains who the person is and why they matter now before assuming fandom
- body supplies a sourced life/career spine, not a resume dump
- one memorable contradiction organizes the analysis
- relevant biography queries receive concise, sourced answers in prose or FAQ metadata
- personality analysis is the differentiator layered onto a satisfying general-interest profile
- canonical URL, citations, author identity, and explicit real entity links are correct

Do not prescribe a word count. Completeness and source quality matter; length is an outcome.

## Step 7A: Discovery-mode artifact

Write `docs/content-research/YYYY-MM-DD_emerging-entity-gap-scout.md`:

```markdown
# Emerging Entity Gap Scout — YYYY-MM-DD

## Top actions

| Rank | Person | Action | Score | Catalyst | Why the SERP is winnable |
| ---: | ------ | ------ | ----: | -------- | ------------------------ |

## Scorecards

### Person Name — 82/100 — DIAMOND

- Demand trajectory: 17/20 — evidence
- SERP weakness: 23/25 — top-result composition
- Biography intent: 12/15 — verified query families
- Source depth: 13/15 — source inventory
- 9takes fit: 9/10 — central contradiction
- Timing/index advantage: 5/10 — evidence
- Entity clarity: 3/5 — evidence
- Penalties: 0

## Retrofit briefs

For each existing page: current GSC baseline, missing intent, protected strengths, factual risks,
specific cuts/additions, and predicted 28-day effect.

## Creates and watchlist

## Rejected false positives

## Method and caveats
```

## Step 7B: Single-subject pipeline packet

Write `docs/content-analysis/entity-gaps/[Canonical-Person-Name].md` with machine-readable YAML first:

```markdown
---
person: 'Person-Name'
audited_at: 'YYYY-MM-DD'
classification: 'diamond | promising | watchlist | pass | protect'
recommended_action: 'create | retrofit | protect | cross-link | watch | pass'
score: 0
biography_intent: true
personal_wikipedia: false
source_gate: 'pass | fail'
---

# Emerging Entity Gap Packet: Person Name

## Why now

## Exact-name SERP map

## Biography-intent map

## Source inventory

## Protected strengths (existing pages only)

## Content requirements

## Claims to avoid or qualify

## Baseline and 28-day prediction (existing pages only)

## Scorecard and caveats
```

The packet must be useful even when the classification is `pass`: the pipeline still learns which
biography questions matter and which strong competitors make generic coverage pointless.

## Measurement protocol

For a retrofit, save the pre-change 28-day GSC baseline by page and query family. Predict ranges, not
false precision:

- exact-name impressions
- average exact-name position
- exact-name CTR
- total page clicks and impressions
- biography-query impressions/clicks
- engaged time if locally available

Check after 28 days, then again after 56 days if impressions are still low. Separate demand, ranking,
and CTR changes. A page can succeed by capturing expanding demand before its average position moves.

## Guardrails

- Never fabricate search volume, Trends values, backlinks, SERP positions, or query suggestions.
- Search results vary by location, device, personalization, and date. Record when and how checked.
- Preserve a winning URL and central thesis unless evidence requires a change.
- Do not convert a personality profile into an SEO fact farm.
- Do not publish speculation as biography.
- A weak SERP is an opportunity only when the resulting page would deserve to rank.
