<!-- docs/seo/what-enneagram-type-are-most-musicians-tasker-2026-07-06.md -->

# Tasker: Draft "What Enneagram Type Are Most Musicians?"

**Requested by:** DJ Wayne / 9takes
**Created:** 2026-07-06
**Purpose:** Draft a data-led SEO post that uses the 9takes corpus to answer the query "What Enneagram type are most musicians?"
**Recommended target file:** `src/blog/pop-culture/what-enneagram-type-are-most-musicians.md`
**Recommended URL:** `/pop-culture/what-enneagram-type-are-most-musicians`

## 1. Objective

Create a publishable 9takes article that owns the data-backed answer:

> In the 9takes corpus of public figures, musicians are most likely to be Enneagram Type 4. Type 4 makes up 38.8% of the 67 musician and artist profiles, which is +24.29 percentage points above the sitewide baseline.

This post should support the broader `/corpus-stats` SEO push by turning the raw dataset into a reader-friendly, internally linked article.

## 2. Keyword Targeting

### Primary keyword

- `what enneagram type are most musicians`

### Secondary keywords

- `what enneagram are musicians`
- `enneagram musicians`
- `enneagram 4 musicians`
- `type 4 musicians`
- `famous enneagram 4 musicians`
- `are most musicians type 4`
- `what personality type are musicians`

### Search intent

Informational. The reader wants a quick answer, a list of examples, and a believable reason the pattern exists. They are not looking for abstract Enneagram theory first.

## 3. Source Data

Use only current generated corpus data from:

- `docs/data/corpus-stats.md`
- `src/lib/data/corpus-stats.json`
- `/corpus-stats`

Current required stats as of 2026-07-06:

| Claim                           |                    Value |
| ------------------------------- | -----------------------: |
| Published 9takes profiles       |                      379 |
| Musician and artist profiles    |                       67 |
| Type 4 musicians/artists        |                       26 |
| Type 4 musician/artist share    |                    38.8% |
| Type 4 delta vs corpus baseline | +24.29 percentage points |
| Corpus-wide Type 4 share        |                    14.5% |
| Type 3 musician/artist share    |                    20.9% |
| Type 7 musician/artist share    |                    11.9% |
| Type 8 musician/artist share    |                    10.4% |
| Type 9 musician/artist share    |                     9.0% |

Hard constraint: Frame this as "among public figures profiled by 9takes," not "among all musicians in the world." The corpus is editorial, not a population survey.

## 4. Recommended Frontmatter

```yaml
---
title: 'What Enneagram Type Are Most Musicians? 9takes Data Says Type 4'
meta_title: 'What Enneagram Type Are Most Musicians? Type 4, by the Data'
description: 'Across 67 musician and artist profiles in the 9takes corpus, Type 4 is the most common Enneagram type at 38.8%. Here is what the data says and why the pattern makes sense.'
author: 'DJ Wayne'
date: '2026-07-06'
loc: 'https://9takes.com/pop-culture/what-enneagram-type-are-most-musicians'
lastmod: '2026-07-06'
changefreq: monthly
priority: '0.7'
published: true
type: ['music', 'data']
popCulture:
  category: entertainment-media
  subcategory: music
blog: true
path: src/blog/pop-culture/what-enneagram-type-are-most-musicians.md
---
```

Adjust `date`, `lastmod`, and image fields if the publishing workflow requires generated art before going live.

## 5. Required Article Structure

### H1

`What Enneagram Type Are Most Musicians?`

### Opening direct answer

Start with the answer in the first 80 words. Suggested shape:

> Among public figures profiled by 9takes, musicians are most often Type 4. In the current corpus, 26 of 67 musician and artist profiles are Type 4, or 38.8%. That is +24.29 percentage points above Type 4's sitewide baseline, making music the clearest Type 4-skewed category in the dataset.

### H2 outline

1. `The Short Answer: Musicians Over-Index as Type 4`
2. `The 9takes Music Corpus, by Enneagram Type`
3. `Why Type 4 Shows Up So Often in Music`
4. `Famous Type 4 Musicians in the 9takes Corpus`
5. `The Runner-Up Patterns: Type 3, Type 7, Type 8, and Type 9`
6. `What This Does Not Prove`
7. `How to Use This If You Are Typing a Musician`
8. `FAQ`

## 6. Required Internal Links

Link naturally to:

- `/corpus-stats`
- `/personality-analysis/categories/music`
- `/personality-analysis/type/4`
- `/enneagram-corner/enneagram-type-4`
- `/enneagram-corner/enneagram-wings-complete-guide`
- `/enneagram-corner/enneagram-instinctual-subtypes`

Use specific musician examples from live pages where available. Confirm slugs against `src/lib/components/molecules/famousTypes.ts` before linking.

Likely example pool:

- Billie Eilish
- Lana Del Rey
- Bob Dylan
- Charli XCX
- Adele
- Elton John
- Olivia Rodrigo
- Lady Gaga
- Madison Beer
- Zayn Malik

Do not include a person as an example unless their profile is published and the type shown by the site supports the claim.

## 7. Required Data Table

Include a compact table near the top:

| Enneagram type | Musician count | Musician share | Delta vs baseline |
| -------------- | -------------: | -------------: | ----------------: |
| Type 4         |             26 |          38.8% |         +24.29 pp |
| Type 3         |             14 |          20.9% |          +2.95 pp |
| Type 7         |              8 |          11.9% |          -3.10 pp |
| Type 8         |              7 |          10.4% |          -0.90 pp |
| Type 9         |              6 |           9.0% |          -1.07 pp |

Include the full 9-type table only if it does not slow the article down. The compact table is enough for the first draft.

## 8. FAQ Targets

Add visible FAQ content and JSON-LD if the local blog pattern supports it.

Required questions:

1. `What Enneagram type are most musicians?`
2. `Are most musicians Type 4?`
3. `Why are so many musicians Type 4?`
4. `Are singers usually different from rappers or producers?`
5. `What Enneagram types are least common among musicians?`
6. `Does this prove Type 4s are better musicians?`

Answer style: direct, cautious, data-led. Do not overclaim causality.

## 9. Voice And Positioning

Write in 9takes voice:

- Tactically direct
- Pattern-recognition forward
- Specific examples over generic theory
- Data first, interpretation second

Avoid:

- "All artists are Type 4"
- "Type 4s are more talented"
- "The Enneagram scientifically proves..."
- Long throat-clearing about Enneagram history
- Generic "creative people are emotional" filler

Preferred framing:

> Music rewards the Type 4 move: turn private emotional weather into a public object other people can recognize.

## 10. Publish Checklist

- [ ] Stats checked against the latest `docs/data/corpus-stats.md`
- [ ] Every numeric claim links or points back to `/corpus-stats`
- [ ] At least 5 published musician profiles linked
- [ ] `/personality-analysis/categories/music` linked in the first third
- [ ] `/personality-analysis/type/4` linked before the first musician example list
- [ ] FAQ block included
- [ ] Frontmatter includes `meta_title`, `description`, `loc`, `lastmod`, and `published`
- [ ] Article does not claim the 9takes corpus represents all musicians globally
- [ ] After publish, regenerate sitemap and track GSC for:
  - `what enneagram type are most musicians`
  - `what enneagram are musicians`
  - `enneagram 4 musicians`
  - `type 4 musicians`

## 11. Definition Of Done

A draft exists at the recommended target path or equivalent, can be reviewed by DJ, cites the current corpus stats accurately, answers the primary keyword in the first fold, and is ready for editing/publishing without additional keyword research.
