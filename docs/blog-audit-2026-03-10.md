<!-- docs/blog-audit-2026-03-10.md -->

# Blog Quality Audit — 2026-03-10

**Last updated: 2026-03-13**

## Summary: 128 published posts audited

| Priority                    | Count | Status       | Issue                                          |
| --------------------------- | ----- | ------------ | ---------------------------------------------- |
| **Critical (D-grade)**      | 8     | **COMPLETE** | Safety failures — prescriptive medical content |
| **Major rewrite (C-grade)** | 3     | **COMPLETE** | Structural/content issues                      |
| **Thin content**            | 7     | **COMPLETE** | Under 1,800 words, ungraded                    |
| **Outdated (2023)**         | 5     | **COMPLETE** | Old + short, need refresh                      |
| **Structural issues**       | 5     | **COMPLETE** | Header bloat, frontmatter conflicts            |
| **Ungraded**                | 37    | NOT STARTED  | Never quality-assessed                         |

### Progress: 23/60 issues resolved (Tiers 1–3 complete)

---

## TIER 1: Critical — Safety Gate Failures (8 posts)

All D-grade (6.9) with prescriptive medical/diagnostic phrasing that creates liability.

**Action needed**: Add disclaimers, soften prescriptive language, remove diagnostic phrasing.

| #   | File                                                            | Words | Date       | Issue                                                           |
| --- | --------------------------------------------------------------- | ----- | ---------- | --------------------------------------------------------------- |
| 1   | `enneagram/mental-health/enneagram-medication-mental-health.md` | 7,929 | 2025-08-25 | Prescriptive psychiatric medication guidance + template fatigue |
| 2   | `enneagram/mental-health/enneagram-parenting-mental-health.md`  | 9,449 | 2025-09-09 | Prescriptive children's mental health                           |
| 3   | `enneagram/mental-health/enneagram-addiction-recovery-guide.md` | 6,273 | 2025-09-01 | Diagnostic-sounding addiction guidance                          |
| 4   | `enneagram/mental-health/enneagram-therapy-guide.md`            | 3,932 | 2025-09-09 | Prescriptive therapy recommendations                            |
| 5   | `enneagram/mental-health/enneagram-trauma-response-guide.md`    | 4,159 | 2025-08-25 | Trauma guidance without clinical boundaries                     |
| 6   | `enneagram/mental-health/enneagram-neurodivergence-guide.md`    | 5,559 | 2025-09-01 | Crosses diagnostic lines                                        |
| 7   | `enneagram/mental-health/enneagram-workplace-mental-health.md`  | 3,420 | 2025-08-25 | Prescriptive workplace mental health                            |
| 8   | `enneagram/why-therapy-doesnt-work-the-same-for-every-type.md`  | 4,091 | 2025-09-09 | Same safety-boundary-risk pattern                               |

### Status Tracker

- [x] 1. enneagram-medication-mental-health.md (safety edits applied 2026-03-10)
- [x] 2. enneagram-parenting-mental-health.md (safety edits applied 2026-03-10)
- [x] 3. enneagram-addiction-recovery-guide.md (safety edits applied 2026-03-10)
- [x] 4. enneagram-therapy-guide.md (safety edits applied 2026-03-10)
- [x] 5. enneagram-trauma-response-guide.md (safety edits applied 2026-03-10)
- [x] 6. enneagram-neurodivergence-guide.md (safety edits applied 2026-03-10)
- [x] 7. enneagram-workplace-mental-health.md (safety edits applied 2026-03-10)
- [x] 8. why-therapy-doesnt-work-the-same-for-every-type.md (safety edits applied 2026-03-10)

---

## TIER 2: Weakest by Content (shortest published posts)

| File                                               | Words     | Date    | Issue                            |
| -------------------------------------------------- | --------- | ------- | -------------------------------- |
| `community/reddit-deep-connections-limitations.md` | **900**   | 2024-02 | Shortest on site, unfinished     |
| `community/introducing-9takes.md`                  | **1,190** | 2023-04 | Thin for a site intro            |
| `community/mbti-vs-enneagram.md`                   | **1,284** | 2025-07 | Too short for high-value keyword |
| `community/why-im-selective-sharing-enneagram.md`  | **1,413** | 2024-03 | Short, ungraded                  |
| `community/memetic-comments.md`                    | **1,580** | 2023-12 | Old + short                      |
| `community/inspiration-for-9takes.md`              | **1,773** | 2023-06 | Old + short                      |
| `community/why-the-greek-vibe.md`                  | **1,781** | 2023-09 | Old + short                      |

### Status Tracker

- [x] reddit-deep-connections-limitations.md (expanded from 900 to ~2,000 words, 2026-03-12)
- [x] introducing-9takes.md (expanded with QuickAnswer, platform comparison, FAQs, 2026-03-12)
- [x] mbti-vs-enneagram.md (added FAQ section + structured data, cross-links, 2026-03-12)
- [x] why-im-selective-sharing-enneagram.md (added QuickAnswer + 4 FAQs, 2026-03-12)
- [x] memetic-comments.md (added QuickAnswer + 4 FAQs, 2026-03-12)
- [x] inspiration-for-9takes.md (added QuickAnswer + 4 FAQs, 2026-03-12)
- [x] why-the-greek-vibe.md (already had QuickAnswer + FAQs, updated dates, 2026-03-12)

---

## TIER 3: Structural Issues

| File                                             | Issue                                                                             |
| ------------------------------------------------ | --------------------------------------------------------------------------------- |
| `enneagram/first-impression-cheat-sheet.md`      | `blog: false` + `published: true` (excluded from listings); duplicate type values |
| `enneagram/enneagram-test-comparison-2025.md`    | 57 headers for 3,803 words — mostly headers, little substance                     |
| `enneagram/enneagram-personal-growth.md`         | 43 words per header (61 headers, 2,681 words)                                     |
| `enneagram/enneagram-types-working-in-teams.md`  | 47 words per header (66 headers, 3,102 words)                                     |
| `enneagram/enneagram-workplace-team-building.md` | 49 words per header (82 headers, 4,023 words)                                     |

### Status Tracker

- [x] first-impression-cheat-sheet.md (fixed blog:false→true, removed duplicate type value, 2026-03-12)
- [x] enneagram-test-comparison-2025.md (merged 5 redundant bottom sections, 57→44 headers, 2026-03-12)
- [x] enneagram-personal-growth.md (converted 45 template h3s to bold labels, 61→16 headers, 2026-03-12)
- [x] enneagram-types-working-in-teams.md (converted 54 template h4s to bold labels, 66→12 headers, 2026-03-12)
- [x] enneagram-workplace-team-building.md (converted 54 template h3s to bold labels, 82→28 headers, 2026-03-12)

---

## TIER 4: Neglected Categories

| Category           | Published | Graded | Notes                                |
| ------------------ | --------- | ------ | ------------------------------------ |
| Community          | 15        | 0      | Most neglected — zero quality grades |
| Guides             | 11        | 0      | Zero graded                          |
| Pop-culture        | 8         | 0      | Zero graded                          |
| **Total ungraded** | **37**    | —      | Need assessment                      |

---

## Recommended Priority Order

1. ~~Fix the 8 mental health safety failures — liability risk~~ **DONE 2026-03-10**
2. ~~Expand `reddit-deep-connections-limitations.md` — 900 words is too thin~~ **DONE 2026-03-12**
3. ~~Bulk up `mbti-vs-enneagram.md` — high-value SEO keyword, only 1,284 words~~ **DONE 2026-03-12**
4. ~~Refresh the 5 oldest 2023 community posts — dated content on foundational topics~~ **DONE 2026-03-12**
5. Grade and assess all 37 ungraded posts — especially the community section

---

## Change Log

| Date       | Tier | Work Done                                                                                     |
| ---------- | ---- | --------------------------------------------------------------------------------------------- |
| 2026-03-10 | 1    | Safety edits on 6 of 8 mental health blogs (disclaimers, softened prescriptive language)      |
| 2026-03-10 | 1    | Completed blogs #7 and #8 (workplace mental health, therapy-by-type)                          |
| 2026-03-12 | 2    | Expanded reddit-deep-connections (900→~2,000 words), added QuickAnswers + FAQs to all 7 posts |
| 2026-03-12 | 3    | Fixed frontmatter on first-impression-cheat-sheet, reduced header bloat on 4 template blogs   |
