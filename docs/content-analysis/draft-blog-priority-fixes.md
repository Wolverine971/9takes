---
title: 'Draft Blog Priority Fixes'
description: 'Prioritized action plan for fixing draft celebrity blog quality gaps'
last_modified: 2025-12-21
status: active
category: guide
related:
  - ./draft-blog-quality-assessment.md
  - ../content-generation/celebrity-page-optimization-instructions.md
  - ../writing-system/02-blog-optimization-framework.md
  - ../30-DAY-ACTION-PLAN-DEC-2025.md
path: docs/content-analysis/draft-blog-priority-fixes.md
---

# Draft Blog Priority Fixes

_Generated: 2025-12-21_
_Source: [Draft Blog Quality Assessment](./draft-blog-quality-assessment.md)_

---

## Overview

This document provides a prioritized action plan for fixing quality gaps in the 79 draft celebrity blog posts. Fixes are ordered by impact and effort, with critical SEO issues first.

**Related Documentation:**

- [Quality Assessment](./draft-blog-quality-assessment.md) — Full audit data
- [Celebrity Page Optimization Instructions](../content-generation/celebrity-page-optimization-instructions.md) — Optimization protocol
- [Blog Optimization Framework](../writing-system/02-blog-optimization-framework.md) — General optimization guide
- [30-Day Action Plan](../30-DAY-ACTION-PLAN-DEC-2025.md) — Current execution plan

---

## Critical Numbers at a Glance

| Issue                           | Count        | Severity    |
| ------------------------------- | ------------ | ----------- |
| Missing QuickAnswer             | 74/79 (94%)  | 🔴 Critical |
| Missing FAQ section             | 75/79 (95%)  | 🔴 Critical |
| Titles NOT question/hook format | 79/79 (100%) | 🔴 Critical |
| Missing meta_title              | 26/79 (33%)  | 🟠 High     |
| Title > 60 chars                | 57/79 (72%)  | 🟠 High     |
| Description wrong length        | 63/79 (80%)  | 🟡 Medium   |
| Below 2,500 words               | 39/79 (49%)  | 🟡 Medium   |
| < 3 internal links              | 4/79 (5%)    | 🔴 Critical |

---

## TIER 1: Fix Immediately (5 files)

These have multiple critical issues intersecting:

| File                   | Issues                                                         | Word Count | Priority Reason           |
| ---------------------- | -------------------------------------------------------------- | ---------- | ------------------------- |
| **Jeff-Bezos.md**      | 0 links, no meta_title, no QuickAnswer, no FAQ, no firstLetter | 1,475      | Shortest + most gaps      |
| **Tucker-Carlson.md**  | 0 links, no meta_title, no QuickAnswer, no FAQ                 | 2,412      | Zero links + gaps         |
| **Jordan-Peterson.md** | 1 link, no meta_title, no QuickAnswer, no FAQ                  | 2,400      | Minimal links + gaps      |
| **Peter-Thiel.md**     | 24 hedging terms, 4,793 words, no QuickAnswer, no FAQ          | 4,793      | Published + worst hedging |
| **Jared-Leto.md**      | 2 links, 2,344 words, no QuickAnswer, no FAQ                   | 2,344      | Low links + short         |

### Fix Checklist for TIER 1 Files

For each file, apply:

- [ ] Add `meta_title` (clickbait, max 60 chars)
- [ ] Fix `description` (150-160 chars, Problem + Promise + Curiosity)
- [ ] Add QuickAnswer component at top
- [ ] Add FAQ section (4-5 real search questions) before disclaimer
- [ ] Add 3-5 internal links (type page + related people + mental health)
- [ ] Remove hedging language (tend to, might, can be, perhaps)
- [ ] Ensure word count 2,500-3,500
- [ ] Add "What is [Person]'s Personality Type?" H2 if missing
- [ ] Update `lastmod` date

---

## TIER 2: High-Impression Pending Celebrities

These are from the [Celebrity Page Optimization Instructions](../content-generation/celebrity-page-optimization-instructions.md) TIER 2 list:

| Person        | Impressions | CTR   | Key Angle                    | Status     |
| ------------- | ----------- | ----- | ---------------------------- | ---------- |
| Drake         | 4,684       | 0.45% | Emotional vulnerability      | ⬜ Pending |
| Ryan Gosling  | 4,539       | 0.55% | Silent intensity             | ⬜ Pending |
| Justin Bieber | 4,165       | 0.38% | Mental health journey        | ⬜ Pending |
| Johnny Depp   | 3,977       | 0.20% | Eccentricity explained       | ⬜ Pending |
| Lana Del Rey  | 3,907       | 0.33% | Melancholy persona           | ⬜ Pending |
| Keanu Reeves  | 3,877       | 0.57% | Why is he so kind?           | ⬜ Pending |
| Bob Dylan     | 4,035       | 1.31% | Already decent - light touch | ⬜ Pending |

---

## TIER 3: Published Files Needing Fixes

These are already published (`published: true`) but have quality issues:

| File                | Issues                                                           | Action                   |
| ------------------- | ---------------------------------------------------------------- | ------------------------ |
| **Taylor-Swift.md** | Title 95 chars, no meta_title, missing "What is" H2, 4,655 words | Trim + restructure       |
| **Peter-Thiel.md**  | 24 hedging terms, 4,793 words                                    | De-hedge + trim to 3,500 |

---

## TIER 4: Hedging Hotspots (10+ occurrences)

These files have excessive hedging language that weakens authority:

| File                        | Hedging Count | Action             |
| --------------------------- | ------------- | ------------------ |
| Peter-Thiel.md              | 24            | Find/replace sweep |
| Henry-Cavill.md             | 12            | Find/replace sweep |
| Joe-Biden.md                | 12            | Find/replace sweep |
| Tim-Robinson.md             | 12            | Find/replace sweep |
| Ariana-Grande.md            | 11            | Find/replace sweep |
| Sam-Altman.md               | 11            | Find/replace sweep |
| Alexandria-Ocasio-Cortez.md | 10            | Find/replace sweep |

**Hedging terms to replace:**

| Find             | Replace With          |
| ---------------- | --------------------- |
| "tend to"        | "typically"           |
| "might"          | "often"               |
| "can be"         | "are"                 |
| "may experience" | "commonly experience" |
| "some people"    | "many people"         |
| "it seems"       | [delete or rewrite]   |
| "could be"       | "is likely"           |
| "perhaps"        | [delete or rewrite]   |

---

## TIER 5: Word Count Issues

### Below 2,500 Words (Need Expansion)

Priority order (shortest first):

1. Jeff-Bezos.md (1,475) ← TIER 1
2. PewDiePie.md (1,575)
3. Princess-Diana.md (1,787)
4. Reed-Hastings.md (1,850)
5. Xi-Jinping.md (1,919)
6. Bad-Bunny.md (1,959)
7. Sam-Altman.md (2,008)
8. James-Charles.md (2,053)
9. Timothee-Chalamet.md (2,046)
10. Amy-Poehler.md (2,072)

### Above 3,500 Words (Consider Trimming)

1. Peter-Thiel.md (4,793) ← TIER 1/3
2. Taylor-Swift.md (4,655) ← TIER 3
3. Druski.md (4,332)
4. IShowSpeed.md (4,107)
5. Marilyn-Monroe.md (3,724)
6. Sydney-Sweeney.md (3,671)
7. Joe-Biden.md (3,631)
8. Palmer-Luckey.md (3,617)
9. Tom-Cruise.md (3,539)

---

## TIER 6: Internal Link Gaps

Files with fewer than 3 internal links:

| File               | Current Links | Target |
| ------------------ | ------------- | ------ |
| Jeff-Bezos.md      | 0             | 5      |
| Tucker-Carlson.md  | 0             | 5      |
| Jordan-Peterson.md | 1             | 5      |
| Jared-Leto.md      | 2             | 5      |

**Required links for each file:**

1. Enneagram type page (e.g., `/enneagram-corner/enneagram-type-8`)
2. Related mental health content (`/enneagram-corner/enneagram-and-mental-illness`)
3. 2-3 related celebrities of same type or similar profile

---

## Non-Blog Drafts (Need Full Structure)

These files need frontmatter and blog structure:

- POLITICIAN_FACT_CHECK_REPORT.md
- Taylor-Swift-updated-sections.md
- jeff-bezos-research.md

---

## Effort Estimates

| Fix Type           | Time/File | Impact    | Files |
| ------------------ | --------- | --------- | ----- |
| Add QuickAnswer    | 10 min    | 🔴 High   | 74    |
| Add FAQ            | 15 min    | 🔴 High   | 75    |
| Add meta_title     | 5 min     | 🟠 Medium | 26    |
| Add internal links | 10 min    | 🔴 High   | 4     |
| Expand content     | 60+ min   | 🟡 Medium | 39    |
| Remove hedging     | 20 min    | 🟠 Medium | 7     |
| Trim content       | 30 min    | 🟡 Low    | 9     |

---

## Execution Schedule

### Week of Dec 22-28

| Day    | Files              | Focus                        |
| ------ | ------------------ | ---------------------------- |
| Dec 21 | Jeff-Bezos.md      | Full optimization + research |
| Dec 22 | Tucker-Carlson.md  | QuickAnswer + FAQ + links    |
| Dec 23 | Jordan-Peterson.md | QuickAnswer + FAQ + links    |
| Dec 24 | Light day          | Review + planning            |
| Dec 27 | Peter-Thiel.md     | De-hedging + trim            |
| Dec 28 | Jared-Leto.md      | Expand + optimize            |

### Week of Dec 29 - Jan 4

| Day       | Files              | Focus                                    |
| --------- | ------------------ | ---------------------------------------- |
| Dec 29-31 | TIER 2 celebrities | Drake, Johnny Depp, Justin Bieber        |
| Jan 1-3   | Continue TIER 2    | Ryan Gosling, Lana Del Rey, Keanu Reeves |

---

## Progress Tracking

### TIER 1 Status

| File               | QuickAnswer | FAQ | meta_title | Links | Words | Status               |
| ------------------ | ----------- | --- | ---------- | ----- | ----- | -------------------- |
| Jeff-Bezos.md      | ✅          | ✅  | ✅         | ✅    | ✅    | ✅ Complete (Dec 21) |
| Tucker-Carlson.md  | ✅          | ✅  | ✅         | ✅    | ✅    | ✅ Complete (Dec 21) |
| Jordan-Peterson.md | ✅          | ✅  | ✅         | ✅    | ✅    | ✅ Complete (Dec 21) |
| Peter-Thiel.md     | ✅          | ✅  | ✅         | ✅    | ✅    | ✅ Complete (Dec 21) |
| Jared-Leto.md      | ✅          | ✅  | ✅         | ✅    | ✅    | ✅ Complete (Dec 21) |

---

_Last updated: 2025-12-21_
