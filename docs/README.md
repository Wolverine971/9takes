---
title: '9takes Documentation Hub'
description: 'Master index and phonebook for all 9takes documentation'
last_modified: 2025-12-05
status: active
category: hub
path: docs/README.md
---

# 9takes Documentation Hub

**Start Here:** [`START-HERE.md`](./START-HERE.md) — Current strategy and priorities

**For AI Agents:** [`AGENT-PROMPT.md`](./AGENT-PROMPT.md) — Condensed instructions

**Active Plan:** [`30-DAY-ACTION-PLAN-DEC-2025.md`](./30-DAY-ACTION-PLAN-DEC-2025.md)

---

## Quick Navigation by Task

### Writing New Content

| Task                           | Go To                                                                                                    |
| ------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Full content creation workflow | [`writing-system/01-content-creation-workflow.md`](./writing-system/01-content-creation-workflow.md)     |
| Blog optimization techniques   | [`writing-system/02-blog-optimization-framework.md`](./writing-system/02-blog-optimization-framework.md) |
| Editing method (McPhee)        | [`writing-system/03-mcphee-editing-method.md`](./writing-system/03-mcphee-editing-method.md)             |
| Content patterns & examples    | [`writing-system/04-content-patterns-library.md`](./writing-system/04-content-patterns-library.md)       |

### Optimizing Existing Pages

| Task                        | Go To                                                                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Celebrity page optimization | [`content-generation/celebrity-page-optimization-instructions.md`](./content-generation/celebrity-page-optimization-instructions.md) |
| AI search optimization      | [`content-analysis/ai-search-optimization-guide.md`](./content-analysis/ai-search-optimization-guide.md)                             |
| SEO checklist               | [`content-analysis/seo-optimization-checklist.md`](./content-analysis/seo-optimization-checklist.md)                                 |
| Blog crosslink index        | [`content-analysis/blog-crosslink-index.md`](./content-analysis/blog-crosslink-index.md)                                             |

### Creating Images

| Task                       | Go To                                                                                                      |
| -------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Midjourney prompting guide | [`content-generation/midjourney.md`](./content-generation/midjourney.md)                                   |
| Prompt templates           | [`content-generation/midjourney_prompt_templates.md`](./content-generation/midjourney_prompt_templates.md) |
| Blog image prompts         | [`content-generation/image-prompts/`](./content-generation/image-prompts/)                                 |

### Managing Celebrity Content

| Task                                | Go To                                                                                                |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------- |
| CRUD operations for celebrity blogs | [`blogs-famous-people/mcp-blogs-famous-people.md`](./blogs-famous-people/mcp-blogs-famous-people.md) |
| Research prompt                     | [`blogs-famous-people/prompts/research-prompt.md`](./blogs-famous-people/prompts/research-prompt.md) |
| Writing prompt                      | [`blogs-famous-people/prompts/writing-prompt.md`](./blogs-famous-people/prompts/writing-prompt.md)   |

### Understanding Brand Voice

| Task                       | Go To                                                                  |
| -------------------------- | ---------------------------------------------------------------------- |
| Full brand style guide     | [`brand/brand-style-guide-v2.md`](./brand/brand-style-guide-v2.md)     |
| Communication style for DJ | [`brand/dj-communication-guide.md`](./brand/dj-communication-guide.md) |

### Content Strategy & Gaps

| Task                      | Go To                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| Current strategy overview | [`START-HERE.md`](./START-HERE.md)                                                                     |
| Content gap analysis      | [`domain-authority/00-master-index.md`](./domain-authority/00-master-index.md)                         |
| Blog ideas December 2025  | [`content-generation/blog-suggestions-dec-2025.md`](./content-generation/blog-suggestions-dec-2025.md) |

### Marketing & Social

| Task                    | Go To                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| Twitter/X hub           | [`twitter/README.md`](./twitter/README.md)                                                       |
| Twitter master strategy | [`twitter/strategy/master-strategy.md`](./twitter/strategy/master-strategy.md)                   |
| Strategic frameworks    | [`marketing/viral-coach-framework-reference.md`](./marketing/viral-coach-framework-reference.md) |
| Reddit plan             | [`reddit/reddit-plan.md`](./reddit/reddit-plan.md)                                               |

---

## Folder Reference

| Folder                 | Purpose                         | Key Files                               |
| ---------------------- | ------------------------------- | --------------------------------------- |
| `brand/`               | Voice, tone, visual identity    | `brand-style-guide-v2.md`               |
| `writing-system/`      | Content creation workflows      | `01-content-creation-workflow.md`       |
| `content-generation/`  | Content creation resources      | Midjourney prompts, image templates     |
| `content-analysis/`    | SEO, optimization, traffic data | `ai-search-optimization-guide.md`       |
| `content-research/`    | Active research for blog posts  | Per-topic research files                |
| `domain-authority/`    | Content gaps & opportunities    | `00-master-index.md`                    |
| `blogs-famous-people/` | Celebrity blog management       | Supabase CRUD, prompts                  |
| `twitter/`             | Twitter/X strategy & content    | `README.md`, `strategy/`, `execution/`  |
| `marketing/`           | Marketing frameworks & plans    | `viral-coach-framework-reference.md`    |
| `development/`         | Technical docs & specs          | CSS guide, component docs               |
| `project-docs/`        | Platform overview & context     | `00-project-overview.md`                |
| `research/`            | Competitor analysis, audits     | Dated research files                    |
| `security/`            | Security & credentials          | `CREDENTIAL_ROTATION_GUIDE.md`          |
| `archives/`            | Historical reference only       | Old audits, daily progress, legacy docs |

---

## Documentation Conventions

### Frontmatter Standard

Every documentation file should include this YAML frontmatter:

```yaml
---
title: 'Document Title'
description: 'Brief description of the document purpose'
last_modified: YYYY-MM-DD
status: active | draft | archived
category: hub | strategy | reference | guide | research
related:
  - ./path/to/related-doc.md
---
```

### File Naming

| Type         | Pattern               | Example                             |
| ------------ | --------------------- | ----------------------------------- |
| Hub/Index    | `README.md`           | `twitter/README.md`                 |
| Strategy doc | `kebab-case.md`       | `master-strategy.md`                |
| Research     | `topic-research.md`   | `red-flags-dating-research.md`      |
| Dated doc    | `topic-YYYY-MM-DD.md` | `competitor-analysis-2025-12-04.md` |

### Folder Structure

- **Keep flat when possible** — Avoid deep nesting (max 2-3 levels)
- **Use README.md** — Each major folder should have a README.md as its index
- **Archive old content** — Move outdated docs to `archives/` instead of deleting
- **Consolidate related docs** — Group by function, not by date

### Linking

- Use **relative links** for internal docs: `[text](./folder/file.md)`
- Use **absolute paths** in descriptions: `/docs/folder/file.md`
- Update links when moving files

---

## Key Brand Concepts (Quick Reference)

**Primary Tagline:** "See the emotions behind every take"

**Secondary Tagline:** "One situation, 9 ways to see it"

**Core Mechanic:** Give-first unlock (comment before seeing others)

**Voice Traits:**

- Tactically Direct
- Socially Savvy
- Respectfully Provocative
- Pattern-Recognition Focused
- Results-Driven Coach

**Content Philosophy:** "Clickbait to the door, quality inside"

- `meta_title` = Clickbait for search results
- `title` = Evergreen for the page
- Content = Deep research, comprehensive analysis

---

## When You're Stuck

### "I don't know what to write"

1. Check `content-generation/blog-suggestions-dec-2025.md`
2. Review `domain-authority/00-master-index.md` for gaps
3. Look at GSC data for high-impression/low-click pages

### "I don't know the brand voice"

1. Read `brand/brand-style-guide-v2.md` (full guide)
2. Quick reference: Direct, socially savvy, pattern-focused

### "I need to optimize a page"

1. For celebrities: `content-generation/celebrity-page-optimization-instructions.md`
2. For blog posts: `content-analysis/ai-search-optimization-guide.md`
3. Apply: Quick Answer box, remove hedging, add FAQ

### "I need to create an image"

1. Check existing prompts in `content-generation/image-prompts/`
2. Use templates from `content-generation/midjourney_prompt_templates.md`
3. Style: Greek statue aesthetic, 16:9 ratio

### "I need to post on Twitter"

1. Go to `twitter/README.md` for the hub
2. Check `twitter/execution/posts-queue.md` for ready content
3. Use `/twitter` command for AI assistance

---

_This README is the master index. If a doc isn't listed here, check `archives/` or use `/docs` search._

_Last updated: December 5, 2025_
