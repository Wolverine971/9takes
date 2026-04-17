<!-- 9takes-strat.md -->

# 9takes Distribution & Citation Strategy: Agent Handoff Document

**Purpose:** Research and action plan for growing 9takes (9takes.com) in the post-SEO, LLM-mediated discovery era. This document briefs an agent working on the 9takes platform and its distribution surface.

**Author context:** DJ, operator of 9takes. The site is a Reddit-style Q&A forum featuring Enneagram-based psychological profiles and analysis of celebrities and public figures. Enneagram Type 8 himself. Also runs BuildOS. Prefers first-principles thinking, direct feedback, and specific actionable work over generic marketing advice.

**Status:** Strategy defined, research validated, implementation not yet started. DJ already produces Canva-based Instagram carousels around Enneagram themes and maintains fresh content. This document extends that into multi-channel entity authority.

---

<!-- =====================================================================
ACTIONABLE PRIORITIES — added 2026-04-16 after audit of existing tooling
What follows is the strat. This section maps strat sections to existing
commands/skills so we know what's already partially solved vs. what's
greenfield. Priorities are reordered around what we can actually ship
this week vs. what needs more groundwork.
===================================================================== -->

## Actionable Priorities (Mapped to Existing Tooling)

### Tier 0 — Ship this week (high leverage, low new infra)

1. **Update v2 personality blog command with the "Enneagram Rabbit Hole" furniture pattern.**
   - File: `.claude/commands/blog_content_creator_people_v2.md`
   - Add a new HTML furniture element to the Step 6 Furniture Pass: a collapsed `<details>` block titled **"Enneagram Rabbit Hole: Wings, Subtypes & Connecting Lines for [Person]"** that contains the wing analysis, instinctual subtype, and arrow patterns. This keeps casual readers in narrative flow (per the Distribution Rule) while satisfying power users + capturing the long-tail SEO/LLM-fanout queries (`[Person] wing 3w4`, `[Person] sx/so subtype`, etc.).
   - Link out from inside the rabbit hole to the existing pillar pages: `/enneagram-corner/enneagram-wings-complete-guide` and `/enneagram-corner/enneagram-instinctual-subtypes` — both already published.
   - This directly serves Part 4 (Query Fan-Out) without diluting the body of the blog.

2. **Tweak v1 + v2 to strongly encourage statistical claims with cited sources (Part 3, point #2).** ✅ DONE 2026-04-16
   - Both commands now have a dedicated "Statistical Claims & Cited Sources (Strongly Encouraged, Not Required)" section in Part 1 that explains the GEO/AEO citation-lift rationale (Princeton's ~40% visibility-lift finding), defines what counts as a citation-grade stat, lists where to place them (hook, type diagnosis, counterarguments, accomplishments), and specifies citation format.
   - Quality Checklist now includes a softened "Stat check (strongly encouraged, not required)" item. A blog with zero stats can still ship if the rest is strong — the goal is to surface verifiable, sourced numbers when they exist, not to force fake ones.
   - Rationale for softening: a hard requirement produces invented or forced-in numbers that damage credibility. 1–2 well-placed sourced stats beat 5 mandatory ones.
   - Tier 1 task #4 (corpus stats data file) remains useful for when corpus-level numbers are the right fit — it unlocks one of the four citation-grade stat categories, not the floor.

3. **Audit `PeopleBlogPageHead.svelte` for FAQPage schema.**
   - Already implements: `Article`, `Person`, `Organization`, `BreadcrumbList`, `datePublished`/`dateModified`. So strat section 7.1 is **half done** — Person + Article schema is shipped.
   - Missing: `FAQPage` JSON-LD. The blogs don't currently have visible FAQ sections (by design — see v2 line "no visible FAQ"), so this would need an invisible JSON-LD-only FAQ derived from the H2/H3 question headings. Worth ~1 day of work.

### Tier 1 — Ship this month

4. **Build a "9takes Corpus Stats" data file.**
   - One JSON or markdown file the blog command can read at write-time to pull verifiable numbers ("of 847 profiles, 23% are Type 3", "the most over-represented type among musicians is 4 at 19%"). Without this, requirement #2 above produces fake numbers.
   - Auto-generate from `famousTypes.ts` + `blogs_famous_people` query. One-shot script, refreshed monthly.

5. **Create a `/llm-citation-monitor` skill or weekly cron.**
   - Strat Part 10 measurement is currently manual. Build a script that hits ChatGPT/Claude/Perplexity APIs with the standardized prompt set ("What Enneagram type is X?", "Best Enneagram analysis site", etc.) and logs whether 9takes appears, in what position. Store in `logs/llm-citation/`.
   - This is the only way we'll know if any of this strategy is working.

6. **Quora / Twitter / Instagram warmup commands → tighten the loop with Part 5/6.**
   - We already have: `.claude/commands/quora-warmup.md`, `.claude/commands/quora-answer.md`, `.claude/commands/twitter-warmup.md`, `.claude/commands/instagram-warmup.md`, `.claude/commands/instagram-reply.md`.
   - **Gap:** no Reddit equivalent. The strat says Reddit is the #1 channel. Build `.claude/commands/reddit-warmup.md` modeled on the quora-warmup workflow (subreddit watch list, value-first comment drafting, founder disclosure boilerplate, karma tracker).
   - **Gap:** none of these warmup commands currently track whether mentions get cited by LLMs later. Tier 1 task #5 closes that loop.

### Tier 1.5 — Skills already half-doing this work

These exist and are underused. Lower-cost wins than building new commands:

- **`distribute`** — Celebrity Blog Distribution Asset Generator. Already designed for the "1 blog → many channel artifacts" multiplier in strat Part 9. **Action:** verify it outputs Reddit + Twitter + Instagram variants together; if not, extend it.
- **`content-repurposing-engine`** — overlaps with `distribute`. Decide which one is the canonical multi-channel pipeline; deprecate the other.
- **`daily-blog-creator`** — automated workflow. **Action:** wire it through the v2 personality blog command + the new Enneagram Rabbit Hole furniture so daily output ships with both improvements.
- **`copywriting-audit`** + **`copywriting-pass`** + **`grade_blog`** — quality gates already exist. **Action:** add stat-claim awareness to the `grade_blog` rubric — reward 1–2 sourced, verifiable numbers (especially in hook / type diagnosis); dock only invented or unsourced numbers. Consistent with the softened Tier 0 #2 encourage-not-enforce framing. `copywriting-pass` now carries a light-touch stat/citation check alongside Harry Dry's three rules.
- **`seobeast-audit`** — full-site SEO audit skill. **Action:** run once on 9takes.com to baseline the AEO score before any Tier 0 changes ship, then re-run after for delta measurement. Pairs with Tier 1 #5 LLM citation monitor.
- **`blog_content_fresh_eyes_people`** + **`blog_content_editor_pass_people`** + **`blog_content_second_pass_people`** — three review skills. **Action:** make sure each one knows about the new Enneagram Rabbit Hole furniture so reviews don't strip it out as "deep typology debate."

### Tier 2 — Backlog

7. **Wikidata entry for 9takes.** One-off, ~1 hour. Strat Part 3 checklist.
8. **r/9takes subreddit creation + seeding.** Strat Part 5. Squat-prevention.
9. **Statistical Analysis Pieces** (strat Part 8). One per month, distribute across channels. Build a `.claude/commands/stat-analysis-piece.md` workflow that wraps research + Reddit/Twitter/Instagram repurposing.
10. **Wikipedia article feasibility research.** Needs independent coverage first → don't start until Tier 0/1 mentions accumulate.

### What we are NOT doing (deprioritized from the strat)

- **`llms.txt` file.** Strat already calls this P3. Skip.
- **Custom schema.org typing vocabulary** (strat 7.7). Long-shot, low ROI right now.
- **Question-based H2 reformatting at scale** (strat 7.4). Already partially baked into v2's heading mix rule; further retrofitting is lower-ROI than the rabbit-hole furniture and stats additions.

---

## Part 1: Strategic Context

### The Shift: From SEO to Trust Routing

Old-school SEO is functionally dead for new content sites in competitive niches. Google AI Overviews answer ~half of queries directly. Reddit and YouTube dominate the results that remain. Domain authority compounds, disadvantaging newcomers structurally.

We've moved from the **monopoly aggregator era** (Google indexes everything, ranks by algorithm) to the **trust-routing era** (humans route through people, communities, and AI models they trust).

For 9takes, this means:

- Stop optimizing purely for Google rankings. Start optimizing to be the _cited source_ when someone asks an LLM about an Enneagram type, a specific person's typing, or Enneagram theory.
- Stop treating Reddit and Twitter as promotion channels. Treat them as _entity-authority-building_ channels where the goal is to become the name that gets mentioned when these topics come up.
- Every piece of content should simultaneously serve multiple surfaces: Google indexing, LLM training/retrieval, community discovery, social share.

### Why 9takes is Well-Positioned

9takes has a specific, unusual advantage: **it sits at the intersection of a high-interest topic (Enneagram) and a high-volume topic (celebrities/public figures).** This combination is exactly what LLMs get asked about — "What Enneagram type is [famous person]?" is a query with meaningful tail volume and almost no authoritative source trying to own it. We can own it.

Reddit and Twitter have active Enneagram communities. LLMs get asked Enneagram questions constantly. Personality typing is a topic people discuss socially, which means Instagram carousels have a natural place here. **The channel mix for 9takes is more favorable than for most content sites.**

---

## Part 2: The Core Insight (Read This First)

The research on LLM citation optimization (called GEO, AEO, or LLMO) is noisy — half of what's published is repackaged SEO consulting. Filtering for what's consistent across independent studies, there's a clear power law.

**The headline finding:** Only ~7% of ChatGPT's cited results appear in Google's top 10. About 83% of AI Overview citations come from outside the organic top 10. The old SEO game and the LLM citation game are different games with different winners.

Implication for 9takes: the work of getting 9takes ranking on Google and the work of getting 9takes cited by Claude/ChatGPT/Perplexity overlap only partially. Both matter. They require different tactics.

---

## Part 3: How to Become a "Mentioned Entity"

LLMs build authority maps by seeing the same entity referenced consistently across many unaffiliated sources in a topic domain. One page on your own site, no matter how optimized, barely moves the needle. Ten independent mentions of "9takes" in Reddit threads, Twitter posts, Substacks, Wikipedia mentions, Discord communities, and podcast transcripts moves the needle enormously.

This is the #1 thing to internalize: **our own site cannot make us an authority. Only other sources can.**

### What Drives LLM Citations (Power Law, Ranked)

1. **Being mentioned by unaffiliated sources in context of the topic.** Reddit threads, forum posts, Twitter discussions, YouTube transcripts, Wikipedia references, Substack articles — all of these feed the LLM's model of "who's authoritative on this topic." This is why Reddit and Twitter matter for 9takes more than blog posts on 9takes itself do.

2. **Statistics and named numbers.** Princeton's GEO research identified "Statistics Addition" and "Cite Sources" as the top-performing techniques, with reported visibility boosts up to 40%. LLMs preferentially cite content with specific numerical claims because they anchor synthesis. "Across 847 profiles analyzed on 9takes, 23% of Type 8s in leadership roles exhibit a 9-wing" gets cited. "9takes has lots of Enneagram content" does not.

   <!-- ACTION: Tier 0 #2 shipped 2026-04-16. Both v1 and v2 now have a
   "Statistical Claims & Cited Sources (Strongly Encouraged, Not Required)"
   section + softened Quality Checklist item that encourages 1–2 sourced,
   falsifiable numbers with citations. Not a hard gate — forcing fake
   numbers is worse than no numbers. Tier 1 #4 (corpus stats data file)
   is still worth building because it unlocks a whole category of
   citation-grade stats (corpus-level claims), but it's no longer the
   blocker it would have been under a hard requirement. -->

3. **Content freshness.** Content updated within the last 13 weeks is significantly more likely to be cited. LLMs weight recency heavily. This is where the HTML meta tag / structured data fix (see section 7) directly matters.

4. **Structured markup (JSON-LD).** FAQPage, Article, Person schemas measurably reduce model hallucination risk, which increases citation rate.

5. **Query fan-out coverage.** LLMs decompose a prompt into multiple sub-queries. Someone asking "What Enneagram type is Taylor Swift?" triggers sub-queries like "Taylor Swift personality," "Swift Enneagram analysis," "Type 3 musicians," "Swift public persona." Content that covers the fan-out wins more citation slots than content that only targets the head query.

   <!-- ACTION: This is exactly what the Enneagram Rabbit Hole furniture
   element solves (Tier 0 #1). Wing/subtype/arrow content was being
   suppressed by v2's Distribution Rule "no insider typology debate" —
   moving it into a collapsed details block keeps the body clean AND
   captures the long-tail fan-out queries. Best of both worlds. -->

Everything else — llms.txt files, SpeakableSpecification markup, voice search — is lower-order. Don't rabbit-hole.

### Entity Authority Checklist for 9takes

To become a recognized entity in the LLM knowledge graph:

- [ ] **Wikipedia / Wikidata presence.** If 9takes has no Wikipedia entry or Wikidata entity, it's invisible to a large class of LLM retrieval. Research feasibility of a Wikipedia page (needs independent coverage). Create Wikidata entry regardless — lower bar, still feeds entity graphs.
- [ ] **Consistent entity info across platforms.** Our website, social profiles, any directory listings must all describe 9takes identically. LLMs cross-reference these to confirm entity identity.
- [ ] **Mentions in Enneagram-adjacent authoritative sources.** The Enneagram Institute, Integrative9, Personality Hacker, any academic Enneagram papers, etc. Goal: at least 3 independent authoritative sources mention 9takes within 6 months.
- [ ] **Reddit mentions in r/Enneagram and adjacent subs.** Not spammed — earned through genuinely helpful participation (see Part 5).
- [ ] **Twitter/X presence with consistent handle and active engagement in Enneagram conversations.**
- [ ] **YouTube transcripts mentioning 9takes** (via guest appearances, creator mentions, etc.).

---

## Part 4: Query Fan-Out Thinking Applied to 9takes

Instead of optimizing for head terms, cover the sub-queries LLMs generate.

Example: "What Enneagram type is [celebrity]?"
Likely sub-queries:

- "[celebrity] personality traits"
- "[celebrity] behavioral patterns"
- "[celebrity] public statements about [topic]"
- "Enneagram type [N] characteristics"
- "Enneagram type [N] famous examples"
- "[celebrity] interviews"
- "[celebrity] documented behavior"

Implication for personality analysis pages: each celebrity page should naturally cover:

- The type assessment and confidence level
- Specific observed behaviors supporting the typing
- Comparable typings (who else shows this pattern)
- Wing and tritype analysis
- Stress/growth arrow observations
- Counterarguments (why they might be a different type)
- Links to primary sources (interviews, documented behavior)

The counterargument section is especially valuable — it covers "is [celebrity] actually type N or type M?" sub-queries and signals intellectual honesty that LLMs weight favorably.

### Research Task: Fan-Out Audit

Pick 10 of the highest-traffic celebrity pages on 9takes. For each:

1. List the top 5 sub-queries an LLM would fan out to when answering "What Enneagram type is [celebrity]?"
2. Check which sub-queries the current page addresses vs misses.
3. Produce a gap report with recommended additions.

<!-- ACTION: Top-traffic celebrity pages are queryable from
`blogs_famous_people` ordered by analytics views. We can build a one-shot
agent that runs this audit and outputs gap reports as draft updates that
feed into the v2 "Update Existing Draft" workflow. Pair with retrofitting
the Enneagram Rabbit Hole furniture to those 10 pages first. -->

---

<!-- ACTION: We have ZERO Reddit tooling. Existing warmup commands cover
Quora (.claude/commands/quora-warmup.md, quora-answer.md), Twitter
(twitter-warmup.md, twitter.md, next-tweet.md, tweet-reply.md), and
Instagram (instagram-warmup.md, instagram-reply.md, distribute-instagram.md).
Build .claude/commands/reddit-warmup.md modeled on quora-warmup. The
quora-warmup workflow already enforces value-first commenting + founder
disclosure + a question log — same pattern transfers cleanly to Reddit. -->

## Part 5: Reddit Strategy (Deep Dive)

Reddit is the single highest-ROI non-product distribution channel for 9takes in 2026. Three compounding reasons:

1. **Google heavily surfaces Reddit threads.** Reddit appears in a very high percentage of product/review/recommendation queries. A well-placed Reddit mention ranks on Google for years.
2. **Reddit is a top LLM training data source.** Every model from GPT to Claude weighs Reddit heavily because it contains high-quality human discussion with voting-based quality signals.
3. **Reddit's Enneagram and personality communities are real, active, and our exact audience.**

**This means: a good Reddit comment is simultaneously a Google ranking, a piece of LLM training data, and a community reach. Three-for-one distribution from a single artifact.**

### The 90/10 Rule (Non-Negotiable)

The rule that matters more than any other: **90% value contribution, 10% subtle promotion.** Violate this and get banned in under a month. ~80% of businesses attempting Reddit get banned their first month because they treat it like every other marketing channel. Reddit users and mods are sophisticated — they detect marketing accounts instantly.

Signs of being a marketing account (what to avoid):

- Brand-named username ("9takes_official")
- Only posting/commenting about one topic (the brand's topic)
- Never engaging in unrelated discussions
- Corporate language, buzzwords, press-release tone
- Pushing links in every comment
- Self-promotion ratio > 10% of activity

Signs of being a legitimate Redditor (what to cultivate):

- Real-sounding username, unbranded
- Diverse posting history across multiple interests
- Mostly comments, fewer posts
- Conversational, informal tone
- Admits uncertainty, changes mind, upvotes disagreement
- Discloses founder relationship WHEN mentioning 9takes, always

### Target Subreddits for 9takes (Research and Validate)

**Primary (core Enneagram communities):**

- r/Enneagram (main sub)
- r/EnneagramType8 (and all other type-specific subs 1-9)
- r/mbti (typology-adjacent, careful because Enneagram vs MBTI debates happen)
- r/JungianTypology

**Secondary (personality/psychology adjacent):**

- r/psychology
- r/selfimprovement
- r/therapy (careful — strict rules)
- r/BigFive

**Tertiary (celebrity/pop culture intersections):**

- r/popculture
- r/FanTheories
- Celebrity-specific subs (only when a 9takes analysis page is directly relevant to an active discussion)

**Platform-native opportunity:**

- Create and own r/9takes. Low effort, prevents squatting, gives users a home, gets indexed by Google. Do this in week one.

### Reddit Research Tasks

For each target subreddit, produce a brief containing:

1. Subscriber count + daily active estimate
2. Self-promotion rules (verbatim quote from sidebar)
3. Moderator stance on personality analysis sites (search mod comments)
4. Top 10 posts of the last year — what topics resonate
5. 5-10 evergreen threads currently ranking on Google for Enneagram queries where a 9takes-relevant comment could be added
6. Typical posting cadence of active community members

### Reddit Content Targets

**Comment targets (gold — these are where most of the win is):**

- "What type is [celebrity]?" threads → thoughtful analysis with honest uncertainty, linking to 9takes page if relevant
- "How do I figure out my type?" threads → helpful framework, optional mention of 9takes' analysis approach
- "I've been typed as X but feel like Y" threads → genuine guidance
- Type-specific subreddit discussions about characteristic patterns

**Post targets (after karma threshold):**

- Deep analysis posts: "I analyzed 50 public Type 8 CEOs — here's the wing distribution pattern I found" (exactly the kind of stat-rich content LLMs cite)
- Framework posts: Original thinking about Enneagram wings, tritypes, instinctual variants
- AMA posts if 9takes builds enough profile
- Cross-pollination posts: "Enneagram + other framework" intersections

**Avoid:**

- "Check out my site" posts (instant ban)
- Linking to 9takes in every comment (spam signal)
- Commenting only on Enneagram topics (narrow activity pattern)

### Account Hygiene

- Build karma for 2-3 months via comments before any promotional activity
- Participate in multiple subreddits, not just Enneagram ones — makes the account look like a real person
- Target ~500 comment karma in r/Enneagram specifically before first post there
- When mentioning 9takes, always disclose relationship: "Full disclosure, I run 9takes, but I think [honest opinion]..."

---

<!-- ACTION: Twitter tooling exists (twitter-warmup.md, twitter.md,
next-tweet.md, tweet-reply.md). Gaps to close:
1. Tie tweet drafts to a 9takes URL (link-back step is implicit, not enforced)
2. Add a "thread from blog" mode to twitter.md that takes a personality blog
   slug and outputs an 8-12 tweet thread per the strat's content cadence
3. Cross-pollination: each Instagram carousel from distribute-instagram.md
   should auto-generate a Twitter thread variant -->

## Part 6: Twitter/X Strategy

Twitter's personality / Enneagram / psychology community is active and LLMs increasingly pull from Twitter for citation. The strategy differs from Reddit:

**Twitter mechanics:**

- Reply-first strategy. Replies to established Enneagram accounts get seen. Cold posts don't.
- Thread strategy for original content. One 8-12 tweet thread per week > daily shitposting.
- Quote-tweets with analysis > retweets.

**Target accounts to engage with (research and validate):**

- Major Enneagram educators on Twitter (Beatrice Chestnut, Personality Hacker team, Truity, etc.)
- Psychology Twitter (the broader community)
- Celebrity / pop culture analysis accounts that occasionally touch personality topics
- "Threads Twitter" accounts that do character analysis

**Content cadence:**

- 1 substantive thread per week, tied to a 9takes page
- Daily reply engagement in the Enneagram/personality conversation
- Weekly "type of the week" or "analysis spotlight" format
- Cross-pollinate with Instagram carousels — each carousel becomes a Twitter thread with different pacing

**Cross-reference strategy:**

- Every Instagram carousel → Twitter thread version
- Every Reddit analysis post → Twitter thread version
- Every 9takes deep-dive blog → Twitter thread with the key insights
- Link back to 9takes as the canonical, detailed source

**The compound goal:** someone researching an Enneagram topic in 2026 should encounter "9takes" on Reddit, on Twitter, on Google, and in Claude/ChatGPT/Perplexity answers. Ubiquity in trust networks is the game.

---

## Part 7: Technical SEO / GEO Fixes on 9takes Site

DJ has identified specific gaps. Here's the prioritized list:

### 7.1 Structured Data on Personality Analysis Blogs (P0)

**Current state:** Blog posts have JSON-LD / FAQ structured data. Personality analysis pages do NOT.

**Fix needed:**

- Audit all personality analysis page templates. Identify which pages lack structured data.
- Add `Person` schema for the subject of the analysis
- Add `Article` schema for the analysis content itself (with accurate `datePublished` and `dateModified`)
- Add `FAQPage` schema if the page includes Q&A sections about the person's type
- Add `BreadcrumbList` schema for site structure

This is the single biggest technical citation-boost available.

<!-- ACTION / STATUS UPDATE: This is HALF DONE as of audit on 2026-04-16.
src/lib/components/blog/PeopleBlogPageHead.svelte already emits:
  - Article schema (with datePublished + dateModified from frontmatter)
  - Person schema (with sameAs links via buildPersonSameAsUrls)
  - Organization schema
  - BreadcrumbList schema
  - WebPage schema
What's still missing:
  - FAQPage schema (v2 explicitly hides visible FAQs — derive invisible
    JSON-LD FAQ from H2/H3 question-format headings instead)
  - Verification that dateModified flows from DB blogs_famous_people.lastmod
    into the rendered tag (Tier 0 #3 audit). -->

### 7.2 Meta Tag Freshness (P0)

**Current issue:** When content updates, the rendered HTML meta tags (og:updated_time, article:modified_time, Twitter card metadata) may not be updating.

**Fix needed:**

- Audit the full meta tag set on personality analysis pages.
- Ensure `dateModified` in JSON-LD matches actual last-update timestamp.
- Ensure `article:modified_time` Open Graph tag updates.
- Ensure Twitter card metadata reflects current content.
- Add a smoke test that verifies these update when content changes.

Freshness signals are weighted heavily by both Google and LLMs. Stale meta tags silently undermine fresh content.

### 7.3 Statistics and Named Numbers (P1)

Going forward, every piece of analysis content should include specific numerical claims where possible:

- "Across 847 profiles analyzed on 9takes..."
- "Of the 124 Type 8 CEOs profiled..."
- "23% of [subgroup] exhibit [pattern]..."
- Confidence scores on typings ("85% confidence based on documented evidence")

Retrofit the highest-traffic 20 pages with statistical framing where possible. These are the pages LLMs are most likely to already be pulling from; making them more quotable compounds.

<!-- ACTION: v2's heading mix rule (Reference Guide → "Heading Strategy:
SEO vs. Copywriting Balance") already requires 2-3 search-intent headings
per blog with patterns like "Why [Person] ...", "How [Person] ...". So
new blogs going through v2 ship with this. Retrofit task is for OLD blogs
that pre-date v2 — pair with the Fan-Out Audit on top-traffic pages. -->

### 7.4 Question-Based Headers (P1)

Reformat page headers as questions users actually ask:

- "Taylor Swift Enneagram Analysis" → "What Enneagram Type is Taylor Swift?"
- "Type 8 Leadership Patterns" → "How Do Enneagram Type 8s Lead?"

LLMs preferentially extract content under question-formatted H2/H3 headers.

### 7.5 Fan-Out Query Coverage (P2)

For each top celebrity page, ensure coverage of the natural sub-queries (see Part 4). Add sections as needed. This is a content task, not a technical one, but it's the highest-value content task.

### 7.6 llms.txt File (P3, Low Priority)

There's a small emerging trend of sites adding `/llms.txt` files to indicate content preferences for AI crawlers. Low effort, unclear benefit, worth adding but not prioritizing.

### 7.7 Schema for Person Typings (Research Task)

Research: is there a schema.org vocabulary that supports typing claims? If so, implement. If not, document the gap for the schema.org community. This is a long-shot play but potentially a signature move that gets 9takes cited as the canonical source for typology metadata.

---

<!-- ACTION: This is greenfield — no command exists for stat-analysis pieces.
Build .claude/commands/stat-analysis-piece.md after Tier 1 #4 (corpus stats
data file) is in place. The command should:
1. Take a slice (e.g. "Type 8 musicians") + pull stats from corpus file
2. Produce blog draft + Reddit post variant + Twitter thread variant +
   Instagram carousel outline in one workflow
3. Save the canonical blog to src/blog/community/ or src/blog/topical/
   (NOT personality-analysis — these aren't person profiles) -->

## Part 8: Content Strategy — Statistical Analysis Pieces

The single highest-value content format for 9takes going forward: **data-rich analyses of typing patterns.**

Why: LLMs cite content with specific numerical claims at much higher rates. 9takes has the corpus (847+ profiles) to produce these analyses. Nobody else has that data.

### Piece ideas (ranked):

1. "Enneagram Type Distribution Among [category]: What 9takes' 847-Profile Corpus Shows"
   (e.g., Fortune 500 CEOs, Pop Musicians, NBA Champions, Authors, Political Leaders)
2. "Wing Distribution Analysis: How [Type X] Breaks Down by Wing in Public Figures"
3. "Tritype Patterns Among High Performers"
4. "Stress and Growth Arrows in Public Behavior: 50 Documented Cases"
5. "Type Mistyping Analysis: The 10 Most Commonly Mistyped Celebrities and Why"

Each piece:

- 2,500-4,000 words
- At least 10 specific numerical claims
- Full methodology section (how we typed, confidence intervals, limitations)
- Counterarguments / where we might be wrong
- JSON-LD Article schema
- Distributed across Reddit (one thread), Twitter (one long thread), Instagram (one carousel), 9takes blog as canonical

One of these per month is enough. Don't dilute.

---

<!-- ACTION: Existing Instagram tooling — distribute-instagram.md,
instagram-warmup.md, instagram-reply.md — handles the carousel side well.
The cross-platform multiplier (1 carousel → 4 artifacts) is NOT yet
automated. Best path: extend distribute-instagram.md so it accepts a
target list (twitter|reddit|blog) and produces the variants together. -->

## Part 9: Instagram Carousel Strategy (Extending Current Work)

DJ already produces Canva-based Instagram carousels. Extend with systematic cross-platform distribution:

- Every carousel → Twitter thread (different pacing, more text)
- Every carousel → Reddit post (where subreddit rules allow) or Reddit comment reference
- Every carousel → a blog post on 9takes (canonical source, with JSON-LD)
- Every carousel → a TikTok talking-head video (optional, higher effort)

The goal: each piece of analysis work produces 4+ distribution artifacts, not 1. Maximum leverage per unit of creative work.

---

<!-- ACTION: Tier 1 #5 — build the LLM citation monitor as a weekly cron.
Without this we have no feedback loop and can't tell which strat moves are
actually working. Could be a .claude/commands/llm-citation-check.md run via
the /loop or /schedule skill on a Mon AM cadence. -->

## Part 10: Measurement

### Monthly tracking:

- **LLM citations.** Query ChatGPT, Claude, Perplexity with standardized prompts:
  - "What Enneagram type is [popular public figure]?"
  - "Where can I find Enneagram analysis of celebrities?"
  - "What's a good Enneagram typing resource?"
  - "How do I figure out a celebrity's Enneagram type?"
  - "Best Enneagram analysis site"
    Record: does 9takes appear, in what position, with what framing.
- **Reddit mentions:** Google `site:reddit.com 9takes` plus Reddit native search. Track independent mentions (not ours), sentiment, conversion signals.
- **Twitter mentions:** Native search for "9takes" plus domain mentions.
- **Google rankings:** For branded queries and top 20 celebrity typing queries.
- **Organic traffic from AI referrals.** Check referrer data for chatgpt.com, claude.ai, perplexity.ai.

### What NOT to track:

- Vanity metrics (follower counts in isolation)
- Keyword ranking for head terms (wrong game now)
- Blog traffic without conversion context

---

## Part 11: Execution Sequencing

**First 30 days:**

- Technical: JSON-LD on personality analysis pages, meta tag freshness fix
- Research: all research tasks in Parts 4, 5, 6
- Reddit: account hygiene begins, karma building
- Baseline: LLM citation measurement, current Google ranking snapshot
- Content: first statistical analysis piece drafted

**Days 30-90:**

- Reddit: first comments in target subs (value-contributing, not promotional)
- Twitter: engagement with Enneagram Twitter begins
- Content: first statistical analysis piece published + distributed across channels
- Wikidata entry created for 9takes
- Fan-out coverage retrofitted on top 20 celebrity pages

**Days 90-180:**

- Reddit: first posts (after karma threshold)
- r/9takes created and seeded
- Monthly statistical analysis cadence established
- Wikipedia article feasibility researched and pursued if viable

**Days 180+:**

- Established multi-channel presence maintained
- Measure, iterate, double down on highest-citation-yield channels

---

## Closing Note for the Agent

9takes has an unusual advantage: a topic (Enneagram applied to public figures) that is genuinely under-covered by authoritative sources, combined with a corpus large enough to produce stat-rich analysis that LLMs love to cite.

The meta-strategy: **ensure that anyone researching Enneagram-related topics in 2026 — whether via Google, Reddit, Twitter, or an LLM — encounters 9takes as a trusted, specific, statistically-grounded source.** Ubiquity across trust networks is the goal. Each artifact of work should serve multiple channels simultaneously.

When in doubt, bias toward: specificity over breadth, statistics over vibes, honest uncertainty over confident claims, helping over selling, community participation over promotion.
