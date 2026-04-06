<!-- docs/content-analysis/em-dash-audit-2026-04-06.md -->

# Em Dash Overuse Audit — People Blog Drafts

**Date**: 2026-04-06
**Scope**: `src/blog/people/drafts/` (291 files)
**Issue**: Excessive em dash (—) usage is a strong AI-writing tell that makes content sound robotic and formulaic.

## Summary Stats

| Metric                | Value           |
| --------------------- | --------------- |
| Total files audited   | 291             |
| Total em dashes found | 9,206           |
| Average per file      | 31.6            |
| Median per file       | 37              |
| Natural benchmark     | 0–5 per article |

## Top 20 Worst Offenders (Remediated)

| Rank | File                     | Before | After (prose) | Notes                                  |
| ---- | ------------------------ | ------ | ------------- | -------------------------------------- |
| 1    | Sam-Altman.md            | 101    | 0             | 5 remain in direct quotes              |
| 2    | Tim-Dillon.md            | 79     | 2             | Kept for dramatic punch                |
| 3    | Reid-Hoffman.md          | 79     | 3             | 1 in direct quote, 2 dramatic          |
| 4    | Frida-Kahlo.md           | 79     | 2             | 5 in timeline HTML formatting          |
| 5    | Kyle-Forgeard.md         | 72     | 2             | Kept for dramatic punch                |
| 6    | John-Lennon.md           | 72     | 2             | 2 kept for genuine emphasis            |
| 7    | Lex-Fridman.md           | 71     | 3             | 1 in direct quote                      |
| 8    | John-Travolta.md         | 70     | 2             | 1 quote attribution, 1 dramatic        |
| 9    | Tim-Ferriss.md           | 69     | 2             | 3 in direct quotes                     |
| 10   | Jennifer-Lopez.md        | 68     | 0             | 17 in timeline formatting (structural) |
| 11   | Ryan-Gosling.md          | 67     | 3             | All dramatic, well-placed              |
| 12   | Leonardo-da-Vinci.md     | 67     | 2             | 8 in timeline HTML formatting          |
| 13   | Arnold-Schwarzenegger.md | 67     | 2             | Kept for closing dramatic beat         |
| 14   | Gavin-Newsom.md          | 66     | 2             | Both in direct quotes                  |
| 15   | Trevor-Noah.md           | 63     | 2             | Kept for genuine dramatic punch        |
| 16   | Marc-Andreessen.md       | 63     | 1             | Single dramatic punchline              |
| 17   | kanye.md                 | 63     | 1             | Single dramatic pivot                  |
| 18   | Sarah-J-Maas.md          | 62     | 1             | 8 in editorial comment block           |
| 19   | Stephen-Colbert.md       | 61     | 3             | All in direct Colbert quotes           |
| 20   | Paul-Graham.md           | 61     | 1             | In direct PG essay quote               |

**Total reduction: 1,399 em dashes down to ~82 total (including timeline formatting, editorial comments, and direct quotes). Prose-only em dashes reduced to ~33 across all 20 files.**

## Remaining Files (not yet addressed)

Files ranked 21-50 have 50-60 em dashes each. Files ranked 51+ have 46-50. All 271 remaining files need attention eventually.

## Remediation Strategy Used

Replaced em dashes with natural alternatives:

- **Commas** for light asides and appositives (most common replacement)
- **Periods** to break run-on thoughts into punchy sentences
- **Colons** when introducing an explanation or list
- **Parentheses** for true parenthetical asides
- **Conjunctions** ("and", "but", "because", "so") where natural
- **Restructured sentences** when the em dash was masking a clunky construction
- **Preserved** em dashes in direct quotes (speaker's actual words)
- **Preserved** em dashes in timeline/structural HTML formatting

Goal achieved: 0-3 em dashes per article in author's prose, only where they genuinely add dramatic effect.
