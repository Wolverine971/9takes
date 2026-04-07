<!-- docs/question-page-seo-recommendations-2026-04-07.md -->

# Question Page SEO Recommendations

Date: 2026-04-07

## Goal

Keep `/questions/[slug]` pages indexable and make them stronger long-tail landing pages without exposing the full community thread to anonymous visitors.

## Current Baseline

Question pages now have a better SEO floor than they did before:

- They are indexable and back in the sitemap
- They have canonical URLs, unique titles, descriptions, and a `WebPage` + breadcrumb JSON-LD baseline
- Anonymous visitors see a public overview section and a small preview of AI-generated perspectives
- Category pages are indexable and now included in the sitemap

The remaining opportunity is not “basic indexing.” It is improving how well each question page explains search intent and how much trustworthy, public, crawlable content it exposes.

## What 9takes Already Has That Can Be Extended

The current question pipeline already creates or stores useful SEO inputs:

- `question_formatted`
- `context`
- category tags
- AI perspective outputs in `comments_ai`
- AI-generated `seo_keywords` stored in `question_keywords`
- public user profile pages at `/users/[externalId]`

That means the best next step is to productize and render more of this information, not build a parallel SEO system from scratch.

## Recommendations

### 1. Make question context a first-class public field

Highest leverage.

Right now the database supports `questions.context`, but the question creation UI still submits an empty string. That is a missed opportunity. For ambiguous long-tail searches, context is what tells Google and users what the question is really about.

Recommendation:

- Add an optional but strongly encouraged context field in the ask flow
- Prompt users for clarifying detail when the question is broad or underspecified
- Render that context publicly on the question page when present
- Use it in the title/description only as support, not as a keyword dump

Why it matters:

- It increases unique visible body copy
- It disambiguates intent
- It gives the page a better chance to rank for more specific searches

Implementation note:

- The field already exists in the schema and question route
- The current frontend ask flow is the bottleneck

### 2. Use existing `question_keywords` for retrieval and visible support copy, not hidden stuffing

The AI tagging flow already creates `seo_keywords`, but those keywords are not visibly used on the page today.

Recommendation:

- Use `question_keywords` to improve related-question retrieval and internal linking
- Optionally expose a small visible block such as “Related angles” or “This question touches on...”
- Keep the copy human-readable and sparse
- Do not inject keyword lists into hidden markup or invisible page elements

Why it matters:

- It improves topical clustering
- It helps 9takes connect semantically similar questions
- It creates more useful internal links without relying only on manual categories

Guardrail:

- If AI keywords are low quality, repetitive, or unnatural, do not render them directly
- Treat them as retrieval features first, public copy second

### 3. Add a public “what people are saying” summary once a page has enough answers

This is likely the most important medium-term improvement.

If a question has enough real answers, you do not need to expose every full comment publicly in order to create stronger SEO value. A public summary of the main themes can do a lot of work.

Recommendation:

- When a question reaches a threshold such as `3+` or `5+` real comments, generate a short public summary
- Base it on visible question text, categories, and the real answer set
- Keep it short, factual, and theme-based
- Review or moderate before publishing if needed

Why it matters:

- It turns the page from “question + gate” into “question + insight”
- It adds original, page-specific text grounded in first-party user discussion
- It creates a path toward stronger forum/discussion markup later

Guardrail:

- Do not generate generic filler summaries
- Do not summarize pages with too little evidence

### 4. Prefer `DiscussionForumPosting` over `QAPage` unless the page truly becomes public Q&A

For 9takes, this is the key structured-data decision.

Google’s current guidance says:

- use `QAPage` when the page is one question followed by its answers
- use `DiscussionForumPosting` when the page is better understood as a forum-style discussion

For 9takes today, `WebPage` is the safe baseline. If you later expose more public discussion content, `DiscussionForumPosting` is more likely to fit than `QAPage`, because the product is an opinion forum, not just a standard answer box.

Recommendation:

- Keep `WebPage` + breadcrumb as the default baseline for now
- Move to `DiscussionForumPosting` only when the page contains the full public post text and visible response content
- Use `QAPage` only for question pages where the visible page really is a public question followed by public answers

Guardrail:

- Never put answer markup around gated comments
- Never use AI-only answer markup as a substitute for visible public discussion

### 5. Turn profile pages into part of the question-page SEO graph

9takes already has public profile pages. That is an underused asset.

Recommendation:

- Add `ProfilePage` structured data to `/users/[externalId]`
- Link question and comment authors to their public profile pages where appropriate
- Show light-weight credibility/context cues such as type, join date, and contribution count

Why it matters:

- It helps Google understand the creator graph around your community
- It strengthens the “real people with perspectives” model
- It supports discussion/forum understanding across the site, not just on one URL

### 6. Add related questions and related reading on every question page

Question pages need stronger internal-link neighborhoods.

Recommendation:

- Add `3-8` related questions based on category overlap, `question_keywords`, and ES similarity
- Link to the relevant category page prominently
- Where relevant, link to matching Pop Culture / Community / Enneagram / Guide content that deepens the topic

Why it matters:

- Better crawl paths
- Better topical clustering
- More ways for Google to understand what each page is about
- Lower bounce risk for visitors arriving from search

Priority:

- Start with category-based related questions
- Add semantic retrieval later

### 7. Revisit the title strategy for long-tail questions

Question pages are naturally long-tail pages. That means the exact wording of the question often matters more than classic snippet-length heuristics.

Recommendation:

- Test preserving more of the full question in the `<title>`
- Keep the brand suffix short
- Make sure the `<title>` and the visible `h1` stay aligned

Why it matters:

- Hard truncation can cut off the exact phrase a searcher used
- Long-tail pages often benefit from preserving the original language of the query

Good direction:

- Main query first
- Short brand suffix second
- Minimal boilerplate

### 8. Add visible freshness and discussion state signals

Question pages should look alive and current.

Recommendation:

- Show asked date
- Show last updated or last discussion activity date
- Show perspective count above the fold
- Add `datePublished` and `dateModified` when you expand structured data

Why it matters:

- It improves user trust
- It gives Google stronger temporal signals
- It makes the page look less like a thin static stub

### 9. Use AI to enrich, not overwrite, the original question

You mentioned using AI to update the question or add metadata. That can work, but it needs tight guardrails.

Recommendation:

- Keep the original user question as the canonical source text
- Let AI produce support fields:
  - punctuation / formatting
  - concise synopsis
  - disambiguating context suggestion
  - related intents
  - related-question candidates
  - summary of themes once there are enough answers
- If AI text is used in metadata, make sure the same meaning is visible on the page

Do not:

- rewrite questions into a different intent just to chase search traffic
- create large volumes of generic summaries
- add structured data fields that are not backed by visible content

Best use of AI here:

- improve clarity
- improve retrieval
- improve linking
- improve summaries after real discussion exists

### 10. Consider selective quality thresholds later

You do want question pages indexed, which makes sense. But over time, not every question page should necessarily get the same crawl and ranking attention.

Recommendation:

- Define a “high-quality question page” threshold
- Example inputs:
  - formatted question
  - at least one category
  - context present, or enough discussion, or a public summary, or AI preview plus strong related links
- Use those thresholds to decide which pages receive richer enrichment, stronger internal linking, or structured-data upgrades

Why it matters:

- It prevents SEO effort from being spread evenly across weak pages
- It keeps the strategy focused on pages with genuine search value

This does not have to mean de-indexing. It can simply mean prioritizing which pages get the richest public presentation.

## Recommended Schema Roadmap

### Phase 1

Keep:

- `WebPage`
- `BreadcrumbList`

Add later:

- `datePublished`
- `dateModified`

### Phase 2

If question pages expose real public discussion content:

- `DiscussionForumPosting`
- nested `Comment` items for the visible public responses

### Phase 3

Only for pages that genuinely behave like public Q&A pages:

- `QAPage`
- `Question`
- `Answer`

## Recommended AI Metadata Roadmap

If you extend the AI question pipeline, these are the best additional fields to generate:

1. `question_summary`
2. `intent_notes`
3. `related_question_ids`
4. `related_article_urls`
5. `public_discussion_summary`
6. `quality_score`

Order of value:

1. `public_discussion_summary`
2. `related_question_ids`
3. `question_summary`
4. `quality_score`
5. `intent_notes`

`seo_keywords` should remain supportive, not central.

## Measurement Plan

Before changing templates again, set up a simple measurement loop in Search Console:

- Create a `/questions/` page filter
- Track impressions, clicks, CTR, and average position
- Track query diversity, not just total clicks
- Compare pages with:
  - context
  - no context
  - public summary
  - no public summary
  - related links
  - no related links

The goal is to learn which additions actually increase eligible queries and clicks.

## Practical Next Sequence

1. Add and render real `context` from the ask flow
2. Add related questions on question detail pages
3. Expose a reviewed public discussion summary on pages with enough answers
4. Add `ProfilePage` structured data to user profiles
5. Evaluate a move from `WebPage` to `DiscussionForumPosting` for qualifying question pages

## Sources

- [Discussion forum structured data](https://developers.google.com/search/docs/appearance/structured-data/discussion-forum)
- [QAPage structured data](https://developers.google.com/search/docs/appearance/structured-data/qapage)
- [ProfilePage structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [Title link guidance](https://developers.google.com/search/docs/appearance/title-link)
- [Guidance on generative AI content](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content)
- [Helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
