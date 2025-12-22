---
title: 'Content Creation Checklist'
description: 'Complete checklist for creating problem-focused blog posts'
last_modified: 2025-12-20
status: active
category: template
path: docs/templates/content-creation-checklist.md
---

# Content Creation Checklist

**Post Title:** **\*\***\_\_\_**\*\***
**Target URL:** **\*\***\_\_\_**\*\***
**Target Publish Date:** **\*\***\_\_\_**\*\***
**Word Count Target:** 3,500-4,500 words

---

## Phase 1: Research (1-2 hours)

### Keyword Research

- [ ] Primary keyword identified: **\*\***\_\_\_**\*\***
- [ ] Search volume checked: **\*\***\_\_\_**\*\***
- [ ] ## Related keywords documented (10+):
  -
  -

### Competitor Analysis

- [ ] Top 3 competitors analyzed:
      | Competitor | Word Count | Structure | Gaps |
      |------------|------------|-----------|------|
      | | | | |
      | | | | |
      | | | | |

- [ ] ## What are they missing that we can provide?

### Search Intent

- [ ] ## Questions people ask documented:
  -
  -

- [ ] AI Overview check: Does this query trigger AI?
  - [ ] Yes - optimize for direct answers
  - [ ] No - standard optimization

### Research Sources

- [ ] ## Psychology sources gathered:
- [ ] ## Expert quotes found:
- [ ] ## Real examples/data collected:

**Research saved to:** `/docs/content-research/[topic]-research.md`

---

## Phase 2: Outline (30 min)

### Structure Template

```markdown
## Quick Answer (50 words)

[Direct answer to title question]

## Opening Hook (150 words)

[Problem → Validation → Promise]

## Why This Matters (300 words)

[Psychology, context]

## Type-by-Type Breakdown (2,000-2,500 words)

[Each type: ~250 words with specific examples]

## Practical Application (400-600 words)

[What to actually do]

## FAQs (400-500 words)

[5 questions from real searches]

## Related Reading

[3-5 internal links]
```

- [ ] Outline follows structure template
- [ ] Each section has clear purpose
- [ ] Unique angle identified vs. competitors

**Outline saved to:** `/docs/content-research/[topic]-outline.md`

---

## Phase 3: Writing (3-4 hours)

### Quick Answer Box

- [ ] Direct answer in first 2 sentences
- [ ] Under 100 words
- [ ] Uses `<QuickAnswer>` component
- [ ] Answers the title's implied question

### Opening (First 150 words)

- [ ] Names the problem emotionally
- [ ] Uses `<p class="firstLetter">` for first paragraph
- [ ] No preamble ("In this article...")
- [ ] Reader sees themselves in first sentence

### Body Content

- [ ] All 9 types covered (if type-by-type post)
- [ ] Consistent structure per type
- [ ] Specific behaviors, not vague descriptions
- [ ] Psychological depth (childhood → adult patterns)
- [ ] Actionable advice included

### Language Quality

- [ ] NO hedging language:
  - [ ] "tend to" → "typically" or remove
  - [ ] "might" → "often"
  - [ ] "can be" → "are"
  - [ ] "may experience" → "commonly experience"
  - [ ] "it seems" → [delete]
- [ ] Confident, authoritative tone
- [ ] Short sentences and paragraphs
- [ ] Subheadings every 200-300 words

### FAQs

- [ ] 5 FAQs from actual search queries
- [ ] Each answer starts with direct response
- [ ] JSON-LD FAQPage schema included

---

## Phase 4: SEO Optimization (30 min)

### Title & Meta

- [ ] Title under 60 characters
- [ ] Title is problem-focused (not descriptive)
- [ ] Meta description 150-160 characters
- [ ] Meta description includes curiosity hook

### Content SEO

- [ ] Primary keyword in first 100 words
- [ ] Primary keyword in at least one H2
- [ ] Related keywords used naturally
- [ ] H2s are questions or benefit-focused

### Internal Linking

- [ ] 5+ internal links TO other 9takes content
- [ ] Links use descriptive anchor text
- [ ] Links to power pages included:
  - [ ] → enneagram-and-mental-illness
  - [ ] → toxic-traits-of-each-enneagram-type
  - [ ] → [related problem-focused post]

### External Linking

- [ ] 2-3 external authority links
- [ ] Links have `rel="noopener"` and `target="_blank"`
- [ ] Links to legitimate sources (studies, books)

### Structured Data

- [ ] JSON-LD BlogPosting schema present
- [ ] JSON-LD FAQPage schema present
- [ ] datePublished correct
- [ ] dateModified correct
- [ ] Author information complete

---

## Phase 5: Image (15 min)

### Image Creation

- [ ] Midjourney prompt created
- [ ] Follows Greek statue aesthetic
- [ ] 16:9 aspect ratio
- [ ] Saved as `.webp` format
- [ ] Filename matches `pic` field in frontmatter
- [ ] Thumbnail version created (`s-[filename].webp`)

**Prompt saved to:** `/docs/content-generation/image-prompts/[post-name]-prompt.md`
**Image saved to:** `/static/blogs/[filename].webp`

---

## Phase 6: Final Review (20 min)

### Quality Check

- [ ] Read entire post aloud
- [ ] No typos or grammar errors
- [ ] Tone is confident throughout
- [ ] Each section delivers value
- [ ] Post answers the title question

### Technical Check

- [ ] Frontmatter complete:
  ```yaml
  title: ''
  description: ''
  author: 'DJ Wayne'
  date: 'YYYY-MM-DD'
  lastmod: 'YYYY-MM-DD'
  published: true
  pic: ''
  ```
- [ ] All links work
- [ ] Images load correctly
- [ ] Mobile preview looks good
- [ ] No console errors

---

## Phase 7: Publish & Promote (15 min)

### Publish Steps

- [ ] Set `published: true`
- [ ] Verify page is accessible
- [ ] Submit URL to Google Search Console
- [ ] Check indexing request submitted

### Internal Linking (FROM other pages)

Add links TO this post from:

- [ ] Power page 1: **\*\***\_\_\_**\*\***
- [ ] Power page 2: **\*\***\_\_\_**\*\***
- [ ] Related post 1: **\*\***\_\_\_**\*\***
- [ ] Related post 2: **\*\***\_\_\_**\*\***
- [ ] Related post 3: **\*\***\_\_\_**\*\***

### MarqueeHorizontal Updates

Add this post to MarqueeHorizontal on related posts:

- [ ] ***
- [ ] ***
- [ ] ***

---

## Post-Publish Tracking

| Date   | Impressions | Clicks | CTR | Position | Notes |
| ------ | ----------- | ------ | --- | -------- | ----- |
| Day 1  |             |        |     |          |       |
| Day 7  |             |        |     |          |       |
| Day 14 |             |        |     |          |       |
| Day 30 |             |        |     |          |       |

---

**Total Time Estimate:** 6-8 hours

**Files Created:**

- [ ] Research: `/docs/content-research/[topic]-research.md`
- [ ] Outline: `/docs/content-research/[topic]-outline.md`
- [ ] Image prompt: `/docs/content-generation/image-prompts/[post-name]-prompt.md`
- [ ] Blog post: `/src/blog/enneagram/[post-slug].md`
- [ ] Image: `/static/blogs/[image-name].webp`
