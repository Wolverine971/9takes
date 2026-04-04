<!-- docs/content-analysis/recent-people-drafts-seo-audit-2026-04-03.md -->

# Recent People Drafts SEO Audit

**Date:** 2026-04-03  
**Scope:** `src/blog/people/drafts/*.md` modified on or after 2026-04-01  
**Focus:** Header and subheader SEO quality, with supporting checks on metadata, internal links, FAQ/snippet readiness, and draft completeness

## Executive Summary

- **56** people drafts were modified on or after 2026-04-01.
- **14** of those are effectively shell drafts: frontmatter + disclaimer with no real body content.
- The remaining **42** are real drafts, but the SEO failures split into **two different patterns**:
  - **Template-generic headers**: clear, but not differentiated enough
  - **Magazine-style poetic headers**: strong writing, weak query matching

The biggest process tension is in the current creator flow:

- [`blog_content_creator_people.md`](/Users/djwayne/9takes/.claude/commands/blog_content_creator_people.md#L748) requires an SEO H2/H3 type section
- [`blog_content_creator_people.md`](/Users/djwayne/9takes/.claude/commands/blog_content_creator_people.md#L759) also strongly pushes highly specific, non-generic section names
- [`celebrity-page-optimization-instructions.md`](/Users/djwayne/9takes/docs/content-generation/celebrity-page-optimization-instructions.md#L21) pushes problem-focused search intent and CTR optimization
- [`seo-optimization-checklist.md`](/Users/djwayne/9takes/docs/content-analysis/seo-optimization-checklist.md#L13) also expects keyword-bearing H2s and an FAQ section

In practice, that means some drafts are too generic and others are too literary. The flow is not consistently producing search-intent-friendly headings.

## Scoring Method

Each recent draft was scored out of 100 with extra weight on headers and subheaders:

- **45** Header SEO
  - Required personality-type H2/H3
  - H2/H3 hierarchy
  - Heading uniqueness vs template repetition across the draft corpus
  - Scannable number of H2s
- **15** Search intent / snippet readiness
  - Query-style headings
  - FAQ presence
  - TL;DR presence
  - First-100-word keyword alignment
- **20** Metadata
  - `title`
  - `meta_title`
  - `description`
  - character-length sanity
- **10** Internal linking
- **10** Depth / maintenance
  - usable word count
  - `lastmod`
  - triple-title completeness

This is a structural SEO audit, not a traffic-based impact forecast.

## Tier 0: Shell Drafts

These are the worst recent files from an SEO standpoint, but they are not really optimization candidates yet. They need actual content before header work matters.

| File                     | Score | Words | Why they rank worst                                             |
| ------------------------ | ----- | ----: | --------------------------------------------------------------- |
| `Adam-Sandler.md`        | 22    |    26 | No body, no H2/H3 structure, no `meta_title`, no internal links |
| `Anthony-Hopkins.md`     | 22    |    26 | Same pattern                                                    |
| `Antonio-Banderas.md`    | 22    |    26 | Same pattern                                                    |
| `Bradley-Martyn.md`      | 22    |    26 | Same pattern                                                    |
| `John-Travolta.md`       | 22    |    26 | Same pattern                                                    |
| `Lana-Rhoades.md`        | 22    |    26 | Same pattern                                                    |
| `Mike-Majlak.md`         | 22    |    26 | Same pattern                                                    |
| `Nelk-Boys.md`           | 22    |    27 | Same pattern                                                    |
| `Ninja.md`               | 22    |    26 | Same pattern                                                    |
| `Sarah-Safari.md`        | 22    |    26 | Same pattern                                                    |
| `Sky-Bri.md`             | 22    |    26 | Same pattern                                                    |
| `Stephen-A-Smith.md`     | 22    |    28 | Same pattern                                                    |
| `Steve-Carell.md`        | 22    |    26 | Same pattern                                                    |
| `William-Shakespeare.md` | 22    |    26 | Same pattern                                                    |

## Highest-Priority Full Drafts

These are the **real drafts** where SEO work on headers/subheaders would likely pay off fastest.

### 1. IShowSpeed

- **File:** [`IShowSpeed.md`](/Users/djwayne/9takes/src/blog/people/drafts/IShowSpeed.md)
- **Score:** 69
- **Why it matters:** This is a strong, high-energy piece with lots of evidence, but it has the weakest search-intent alignment among the complete drafts.
- **Main issues:**
  - No required `## What is [Person]'s personality type?` section
  - No required `### [Person] is an Enneagram Type X` subheader
  - Nearly every H2 is evocative but non-query-driven: `The Wiring`, `The Empty Desk`, `Anger as Architecture`
  - No FAQ block
  - Meta description is too long
- **Why prioritize it:** The content is already strong. This is mostly a structural SEO pass, not a rewrite.

### 2. Hailey Bieber

- **File:** [`Hailey-Bieber.md`](/Users/djwayne/9takes/src/blog/people/drafts/Hailey-Bieber.md)
- **Score:** 73
- **Why it matters:** This one has the opposite problem from IShowSpeed. It follows the type-section structure, but many H2s still sound like old template headings.
- **Main issues:**
  - Missing `meta_title`
  - Template-ish H2s: `Hailey Bieber's Upbringing`, `Hailey Bieber's Rise to Fame`, `Hailey Bieber's Personality Quirks and Mental Patterns`
  - No FAQ block
  - `lastmod` is stale relative to the current audit date
- **Why prioritize it:** Easy win. It does not need a full rewrite, just a stronger metadata pass and sharper, more search-aware H2/H3 language.

### 3. Joe Rogan

- **File:** [`Joe-Rogan.md`](/Users/djwayne/9takes/src/blog/people/drafts/Joe-Rogan.md)
- **Score:** 73
- **Why it matters:** Excellent article, but the heading system is optimized for editorial voice more than search.
- **Main issues:**
  - Most H2s are rich but query-light: `The Dojo Saved Him`, `The Cost of Seeing Too Clearly`, `The Conversation That Never Ends`
  - No FAQ block
  - Meta description is too short
  - Slight overuse of H2 count relative to a tighter search structure
- **Why prioritize it:** Another strong-content / weak-search-framing case.

### 4. Kai Cenat

- **File:** [`Kai-Cenat.md`](/Users/djwayne/9takes/src/blog/people/drafts/Kai-Cenat.md)
- **Score:** 81
- **Main issues:**
  - Better than the three above, but still lacks FAQ coverage
  - Some H2s lean heavily literary instead of matching real search phrasing
  - Description is slightly short
- **Why prioritize it:** Smaller lift than a rewrite and likely a good CTR/query-match gain.

### 5. Jennifer Lopez

- **File:** [`Jennifer-Lopez.md`](/Users/djwayne/9takes/src/blog/people/drafts/Jennifer-Lopez.md)
- **Score:** 83
- **Main issues:**
  - Great H2 craft, but several are too metaphorical for search: `Three Girls, One Bed`, `The Diva and the Wound`, `The Silence She'd Been Running From`
  - Description is short
  - No FAQ block
- **Why prioritize it:** The article is good. This is a classic “editorially strong, SEO under-signaled” candidate.

### 6. Kara Swisher

- **File:** [`Kara-Swisher.md`](/Users/djwayne/9takes/src/blog/people/drafts/Kara-Swisher.md)
- **Score:** 82
- **Main issues:**
  - `meta_title` is too long
  - H2s are vivid but mostly not search phrasing
  - No FAQ block
- **Why prioritize it:** Good opportunity if you want a business/media-personality profile to pick up clearer search coverage.

### 7. Shaan Puri

- **File:** [`Shaan-Puri.md`](/Users/djwayne/9takes/src/blog/people/drafts/Shaan-Puri.md)
- **Score:** 81
- **Main issues:**
  - `meta_title` slightly too long
  - Description slightly too long
  - No FAQ block
  - Search-intent terms show up mostly in the type section, not across the rest of the H2 set

### 8. John F. Kennedy

- **File:** [`John-F-Kennedy.md`](/Users/djwayne/9takes/src/blog/people/drafts/John-F-Kennedy.md)
- **Score:** 82
- **Main issues:**
  - `meta_title` too long
  - H2 set is highly literary
  - No FAQ block

## Secondary Queue

These are in decent shape, but still have one or two recurring SEO gaps:

- [`Alex-Karp.md`](/Users/djwayne/9takes/src/blog/people/drafts/Alex-Karp.md)
- [`Leila-Hormozi.md`](/Users/djwayne/9takes/src/blog/people/drafts/Leila-Hormozi.md)
- [`Daniel-Day-Lewis.md`](/Users/djwayne/9takes/src/blog/people/drafts/Daniel-Day-Lewis.md)
- [`Tim-Ferriss.md`](/Users/djwayne/9takes/src/blog/people/drafts/Tim-Ferriss.md)
- [`Troye-Sivan.md`](/Users/djwayne/9takes/src/blog/people/drafts/Troye-Sivan.md)
- [`Mikey-Madison.md`](/Users/djwayne/9takes/src/blog/people/drafts/Mikey-Madison.md)

These are mostly missing FAQ coverage, running long on metadata, or leaning too far into poetic section names without enough search language.

## What the Flow Is Producing

### Failure Mode A: Too Generic

Example: [`Hailey-Bieber.md`](/Users/djwayne/9takes/src/blog/people/drafts/Hailey-Bieber.md)

The structure is understandable, but the H2s read like a template:

- `Hailey Bieber's Upbringing`
- `Hailey Bieber's Rise to Fame`
- `Hailey Bieber's Personality Quirks and Mental Patterns`
- `Hailey Bieber's Controversies and Public Struggles`

These are safe, but weak for differentiation and CTR.

### Failure Mode B: Too Poetic

Examples:

- [`IShowSpeed.md`](/Users/djwayne/9takes/src/blog/people/drafts/IShowSpeed.md)
- [`Joe-Rogan.md`](/Users/djwayne/9takes/src/blog/people/drafts/Joe-Rogan.md)
- [`Jennifer-Lopez.md`](/Users/djwayne/9takes/src/blog/people/drafts/Jennifer-Lopez.md)

These have strong magazine-profile H2s, but not enough query language. Good writing is doing too much of the work by itself.

## Systemic SEO Gaps Across the Recent Cohort

1. **FAQ coverage is mostly missing.**  
   The checklist expects it, but the current creator flow does not enforce it.

2. **Search intent is over-concentrated in the type section.**  
   Many drafts only become keyword-explicit once they hit the personality-type H2/H3.

3. **Metadata length drift is common.**  
   Several `meta_title` values run long, while some descriptions are too short or too long.

4. **A subset of newly created drafts are shells.**  
   These should not enter any SEO queue until they have real body content.

## Recommended Priority Order

### Immediate

1. Finish or delete the 14 shell drafts from the active recent queue.
2. Fix [`IShowSpeed.md`](/Users/djwayne/9takes/src/blog/people/drafts/IShowSpeed.md) first.
3. Fix [`Hailey-Bieber.md`](/Users/djwayne/9takes/src/blog/people/drafts/Hailey-Bieber.md) second.
4. Fix [`Joe-Rogan.md`](/Users/djwayne/9takes/src/blog/people/drafts/Joe-Rogan.md) third.

### Next Wave

5. [`Jennifer-Lopez.md`](/Users/djwayne/9takes/src/blog/people/drafts/Jennifer-Lopez.md)
6. [`Kai-Cenat.md`](/Users/djwayne/9takes/src/blog/people/drafts/Kai-Cenat.md)
7. [`Kara-Swisher.md`](/Users/djwayne/9takes/src/blog/people/drafts/Kara-Swisher.md)
8. [`Shaan-Puri.md`](/Users/djwayne/9takes/src/blog/people/drafts/Shaan-Puri.md)
9. [`John-F-Kennedy.md`](/Users/djwayne/9takes/src/blog/people/drafts/John-F-Kennedy.md)

## Best Fix Direction

The fix is not “make everything generic.”

The fix is:

- keep **1-2 vivid, signature H2s**
- keep the required type H2/H3
- add **2-3 search-intent-bearing H2s** that mirror what people actually ask
- add a short FAQ section near the bottom
- tighten `meta_title` and `description` lengths

That gets you the literary profile feel **and** stronger SEO coverage.
