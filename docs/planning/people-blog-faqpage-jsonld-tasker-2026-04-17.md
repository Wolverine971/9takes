<!-- docs/planning/people-blog-faqpage-jsonld-tasker-2026-04-17.md -->

# Tasker: FAQPage JSON-LD for Personality Analysis Blog Pages

_Created: 2026-04-17_
_Owner: next agent_
_Priority: P0 (strat Tier 0 #3)_

## TL;DR for the next agent

The `/personality-analysis/[slug]` pages (celebrity analyses) currently ship `Article` + `BreadcrumbList` JSON-LD, but **no `FAQPage` schema**. The strat ([`9takes-strat.md`](../../9takes-strat.md) section 7.1) calls this out as the single biggest remaining technical citation-boost.

**Before writing code, do the research pass below.** There are at least three overlapping JSON-LD surfaces on these pages and a DB-sourced `jsonld_snippet` override path that can be either a single node or a full `@graph`. Getting the integration shape right matters more than the schema itself.

**Do not add a visible FAQ section to the page.** The v2 blog content command explicitly forbids one ([see constraint below](#hard-constraints)). This is JSON-LD-only.

---

## Hard Constraints

1. **No visible FAQ block** on the rendered page. v2 rule lives at `.claude/commands/blog_content_creator_people_v2.md` line 717 ("No visible FAQ section at the bottom") and line 739 ("FAQ coverage for SEO lives in structured data only").
2. **No double-counted schema.** If the DB `jsonld_snippet` already contains a `FAQPage` node, do not add a second one.
3. **Don't break existing Article or Person schema.** Those are shipping, shaping LLM retrieval, and not safe to refactor as a side-effect.
4. **Respect the existing `@id` pattern.** Breadcrumb + Article currently use no `@id`; if you introduce a graph, keep identifiers consistent and distinct per node.
5. **No invented Q&A.** Questions must be derived from actual content on the page — real H2/H3 headings or real `<QuickAnswer>` component instances. Synthetic FAQs damage trust and make claims unverifiable (strat Part 3 #2).

---

## Why This Matters (strat context)

Pulled from `9takes-strat.md`:

- **Part 3 #4:** "Structured markup (JSON-LD). FAQPage, Article, Person schemas measurably reduce model hallucination risk, which increases citation rate."
- **Part 7.1 P0:** "Add `FAQPage` schema if the page includes Q&A sections about the person's type. This is the single biggest technical citation-boost available."
- **Audit note (2026-04-16, lines 374–385):** "`PeopleBlogPageHead.svelte` already emits: Article, Person, Organization, BreadcrumbList, WebPage. Missing: FAQPage schema."

Related work already shipped (2026-04-16/17):

- Category index pages (`/personality-analysis/categories/[slug]`) now have `FAQPage` + `Dataset` + stat-grounded claims. Use that file as a **reference implementation for JSON-LD graph shape** — see `src/routes/personality-analysis/categories/[slug]/+page.svelte` lines 59–220.
- Helper pattern: `src/lib/server/personalityCategoryStats.ts` shows how to cleanly feed structured data from a source of truth.

---

## Current JSON-LD Landscape on `/personality-analysis/[slug]`

The agent must understand this before editing. There are three overlapping surfaces:

### Surface 1: `PeopleBlogPageHead.svelte` (`src/lib/components/blog/PeopleBlogPageHead.svelte`)

Emits **two separate `<script type="application/ld+json">` blocks** at lines 189–194:

```svelte
{#if jsonLdString}
	{@html `<script type="application/ld+json">${jsonLdString}</script>`}
{/if}
{#if breadcrumbJsonLd}
	{@html `<script type="application/ld+json">${breadcrumbJsonLd}</script>`}
{/if}
```

**`jsonLdString`** (lines 115–134) has two code paths:

- **Path A — DB override:** If `data.jsonld_snippet` (column on `blogs_famous_people`) parses successfully, use that. It gets patched by `updateJsonLdDateModified` and `mergePersonSameAsIntoJsonLd`. **The DB snippet can be either a single node or a full `@graph` — the parse helper handles both.**
- **Path B — Auto-built:** If no DB snippet (or parse fails), build from `buildCommonJsonLdFields()` at line 68. That's where `Article` + `Person` + `Organization` + `WebPage` all live.

**`breadcrumbJsonLd`** (lines 38–46) is always built from scratch via `buildBreadcrumbSchema([Home, Personality Analysis, PersonName])`.

**Verify before coding:** Query Supabase for how many `blogs_famous_people.jsonld_snippet` rows are non-null, and sample 3–5 of them to see whether they're single nodes or `@graph` arrays. The integration strategy depends on this.

### Surface 2: Page-level microdata

`/personality-analysis/[slug]/+page.svelte` line 351:

```svelte
<article itemscope itemtype="https://schema.org/BlogPosting" class="blog">
```

And line 361:

```svelte
<div class="featured-image" itemprop="image" itemscope itemtype="https://schema.org/ImageObject">
```

And the `<QuickAnswer>` component emits `itemscope itemtype="https://schema.org/Answer"` microdata inline. These are microdata — separate from JSON-LD but something Google/LLMs also parse. **Do not introduce a duplicate Article in JSON-LD that conflicts with the existing BlogPosting microdata — this is already a soft inconsistency (Article JSON-LD says Article, microdata says BlogPosting). Flag in the write-up; don't try to fix as part of this task.**

### Surface 3: DB `jsonld_snippet` column

- Populated by the blog publishing pipeline (check `scripts/push-people.*` and `src/routes/admin/content-board/`).
- Shape varies per row. Some may already contain FAQPage nodes for older posts.

---

## Source of FAQ Q&As (pick at most one path, don't combine naively)

### Path A: H2/H3 question-format headings (strat's preferred approach)

v2 blog command enforces 2–3 search-intent headings shaped as real queries:

- `Why [Person] ...` — line 387 of v2
- `How [Person] ...` — line 388
- `What is [Person]'s personality type?` — line 381 (REQUIRED structural heading, always present)

**Heading data is already extracted server-side.** `src/lib/server/blogContentProcessor.ts` lines 13–17 defines:

```ts
interface TocHeading {
	level: number;
	text: string;
	id: string;
}
```

And returns it on page load — consumed by `TableOfContents`. **Reuse `data.headings`.** Don't re-parse the content.

**Answer derivation is the hard part.** Options:

- **Option A1 — First paragraph under each matching heading.** Requires HTML/DOM parsing of `post.content` server-side. Reliable but adds dependency.
- **Option A2 — Short answer derived from `persona_title` + first sentence of `description`.** Less accurate per-question, but zero new parsing.
- **Option A3 — Pair each question-format H2 with the section's first `<QuickAnswer>` block if one exists.** Most faithful but only covers headings that have a QuickAnswer nearby.

Research output should recommend one of A1/A2/A3 with reasoning.

### Path B: `<QuickAnswer>` components inside the post content

`src/lib/components/blog/callouts/QuickAnswer.svelte` already emits `itemtype="https://schema.org/Answer"` microdata. Posts that use this component have explicit Q&A pairs in-line.

- **Pro:** Authors have already selected these as the "quotable answer" units.
- **Con:** Not every post uses `<QuickAnswer>`. Coverage varies.

Extract during `processBlogContent` (already the server-side placeholder pass — the `<QuickAnswer>` tag is parsed and placeholder-ized at line 67ff). Capture `question` prop + the inner text as the answer.

### Path C: Hybrid

QuickAnswer instances when present (Path B), fall back to top 2–3 question-format H2s with Option A2 answers when there are no QuickAnswers. Most coverage, most complexity.

---

## Integration Strategy Options (pick in the research pass)

### Option 1: Third separate `<script>` tag

Simplest. `PeopleBlogPageHead.svelte` just gets a third conditional block:

```svelte
{#if faqJsonLdString}
	{@html `<script type="application/ld+json">${faqJsonLdString}</script>`}
{/if}
```

- **Pro:** Zero interaction with the existing snippet logic. Works whether DB snippet is node, graph, or missing.
- **Pro:** Already matches the existing "multiple script tags" pattern.
- **Con:** Three loose scripts is messier than one graph; Google doesn't care, but it's untidy.

### Option 2: Merge into `@graph` when DB snippet is a graph; otherwise emit separately

- **Pro:** Cleaner final DOM when possible.
- **Con:** More code paths, more edge cases, more test surface.

### Option 3: Refactor `PeopleBlogPageHead` to always emit a single `@graph`

- **Pro:** Matches the category-index pattern. Unified output.
- **Con:** Big refactor. Risks regressing Article/Person/Breadcrumb on hundreds of published pages. **Out of scope for this task** — note as follow-up.

**Recommended default:** Option 1 unless research shows a strong reason to do Option 2.

---

## Implementation Research Pass (do this before writing code)

1. **DB snippet shape audit.** Run a Supabase query or use the admin UI to answer:
   - How many `blogs_famous_people` rows have non-null `jsonld_snippet`?
   - What % are single nodes vs. `@graph` arrays?
   - Do any already contain a `FAQPage` node?
   - Do any contain an `@type` that conflicts with what we'd add?

2. **Heading coverage audit.** Pull 10 recently-published posts. For each:
   - Count question-format H2s and H3s (match patterns `Why `, `How `, `What is `, `?` in text).
   - Count `<QuickAnswer>` components (grep the DB `content` column).
   - Mark which of Path A / B / C would produce the best 3–5 Q&A pairs.

3. **Freshness signal decision.** Should the FAQPage carry `dateModified`? Google doesn't require it on FAQPage but LLMs weight freshness heavily (strat Part 3 #3). Likely yes — inherit from `post.lastmod`.

4. **Answer length policy.** Google's FAQ rich-result guidelines cap answers around 1,000 characters. Enforce a max length and truncate with a "…read full analysis" sentence if needed.

5. **HTML-in-answer policy.** Decide: strip all HTML from answers, or allow a narrow whitelist (`<a>`, `<strong>`, `<em>`). Stripping is safer. The `itemtype="https://schema.org/Answer"` microdata on `<QuickAnswer>` allows block-level children — JSON-LD text does not.

---

## Deliverables

The next agent should ship:

1. **Research write-up** (append to this file under a `## Research Findings` section, or create a sibling doc). Should answer: chosen path (A/B/C), chosen integration option (1/2/3), DB snippet stats, heading coverage sample, rationale.
2. **New helper module**: `src/lib/server/peopleBlogFaqExtractor.ts` (or similar). Exports a function that takes `{ headings, content, persona_title, description, person }` and returns `FAQItem[]` (type lives at `src/lib/types/faq.ts` — confirm path and import).
3. **Wire into page load** in `src/routes/personality-analysis/[slug]/+page.server.ts`. Pass `faqs` as part of `post` (or as a sibling field).
4. **Emit JSON-LD** in `PeopleBlogPageHead.svelte`:
   - Import `buildFAQSchema` from `$lib/utils/schema.ts` (already defined at lines 9–22).
   - Build `faqJsonLdString` only when `faqs.length >= 2` (don't ship a 1-question FAQ, looks thin).
   - Emit via the third-script pattern.
5. **Unit tests** for the extractor. Follow the pattern at `src/lib/utils/schema.spec.ts`. Cover: empty headings, no QuickAnswers, happy-path 3 questions, truncation behavior, HTML stripping.
6. **Smoke test on 3 representative posts** (run `pnpm dev`, open the page, view source, paste into Google's Rich Results Test at <https://search.google.com/test/rich-results>). Confirm FAQPage is detected and no errors.

---

## Files to Read First

In this order:

1. `9takes-strat.md` — Parts 3 + 7.1 for strategic context.
2. `src/lib/components/blog/PeopleBlogPageHead.svelte` — current JSON-LD output (the file to modify).
3. `src/lib/utils/schema.ts` — existing `buildFAQSchema` + `parseJsonLdSnippet` helpers.
4. `src/lib/server/blogContentProcessor.ts` — `TocHeading` type + how headings are extracted.
5. `src/lib/components/blog/callouts/QuickAnswer.svelte` — microdata already shipping.
6. `src/routes/personality-analysis/[slug]/+page.svelte` — how `PeopleBlogPageHead` is wired.
7. `src/routes/personality-analysis/[slug]/+page.server.ts` — where to inject extracted FAQs.
8. `src/routes/personality-analysis/categories/[slug]/+page.svelte` — **reference implementation** for JSON-LD graph shape (recently shipped, 2026-04-16).
9. `.claude/commands/blog_content_creator_people_v2.md` lines 356–405 + 717 + 739 — heading rules + "no visible FAQ" constraint.

---

## Acceptance Criteria

- [ ] 3–5 FAQ Q&A pairs extracted per post, derived from real content (no invented questions).
- [ ] `FAQPage` JSON-LD validates in Google Rich Results Test on 3 sample posts.
- [ ] No visible FAQ markup on the rendered page.
- [ ] Existing Article, Person, BreadcrumbList schemas still validate (regression check — same 3 sample posts).
- [ ] DB `jsonld_snippet` path still works: posts with a DB-supplied `@graph` and posts without both render correctly.
- [ ] `pnpm check` passes.
- [ ] Unit tests cover the extractor (5+ cases).
- [ ] One follow-up TODO filed: resolve the Article-vs-BlogPosting inconsistency between JSON-LD and microdata (out of scope here, but needs a ticket).

---

## Out of Scope

- Retrofitting FAQ schema into the DB `jsonld_snippet` column itself. If we ever want that, it's a separate admin-tool task.
- The Article-vs-BlogPosting microdata inconsistency. Flag and file a follow-up.
- `llms.txt` file (strat 7.6, explicitly P3/skip).
- Wikipedia / Wikidata (strat Part 3 checklist, separate tracks).
- Anything on category index pages — those shipped 2026-04-16.

---

## Success Looks Like

A Perplexity/Claude/ChatGPT query for _"What Enneagram type is [Taylor Swift / IShowSpeed / etc.]?"_ is more likely to surface 9takes as a cited source because:

1. The page now carries question-answer pairs in LLM-legible schema.
2. Freshness signals (dateModified) reinforce recency weighting.
3. The answer text contains the exact citation-grade sentences the model wants to quote.

Pair with the Tier 1 LLM citation monitor (strat task #5) to measure whether this moves the needle.
