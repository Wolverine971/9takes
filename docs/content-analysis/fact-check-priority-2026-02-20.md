<!-- docs/content-analysis/fact-check-priority-2026-02-20.md -->

# Blog Fact-Check Priority Queue

_Generated: 2026-02-20_  
_Sources:_

- `youtube-transcripts/transcript-coverage-index.md`
- `youtube-transcripts/*-review.md`
- `docs/content-analysis/culturally-relevant-blog-update-priority-2026-02-19.md`
- `src/blog/people/drafts/*.md`

## Scope

- Goal: prioritize factual claims that need verification/citation.
- Out of scope: Enneagram interpretation, tone, and opinion framing.
- Rule: verify unusual claims, numbers, dates, rankings, “record” claims, and direct quotes first.

## Queue A: Transcript-Backed Blogs (Use Review Docs First)

Scoring bias:

- Published posts first.
- More unsupported `[HIGH]` claims first.
- Then unsupported `[MEDIUM]`.
- Then transcript coverage depth.

| Rank | Person             | Published | Direct transcripts | Unsupported HIGH | Unsupported MEDIUM | Priority score |
| ---- | ------------------ | --------- | -----------------: | ---------------: | -----------------: | -------------: |
| 1    | `Paris-Hilton`     | true      |                  3 |                6 |                  8 |            152 |
| 2    | `Alex-Cooper`      | true      |                  4 |                4 |                 10 |            150 |
| 3    | `Chappell-Roan`    | true      |                  2 |                1 |                 13 |            135 |
| 4    | `Joe-Rogan`        | true      |                  2 |                1 |                 13 |            135 |
| 5    | `Kristen-Bell`     | true      |                  6 |                3 |                 11 |            126 |
| 6    | `Jake-Paul`        | false     |                  3 |                7 |                  7 |            125 |
| 7    | `Kim-Kardashian`   | true      |                  3 |                5 |                  6 |            124 |
| 8    | `Aubrey-Plaza`     | true      |                  3 |                3 |                 11 |            121 |
| 9    | `John-Coogan`      | false     |                  4 |                6 |                  8 |            120 |
| 10   | `Logan-Paul`       | false     |                  4 |                6 |                  8 |            120 |
| 11   | `Jordan-Peterson`  | false     |                  2 |                5 |                  9 |            115 |
| 12   | `Shaan-Puri`       | false     |                  1 |                5 |                  9 |            115 |
| 13   | `Tom-Cruise`       | true      |                  4 |                1 |                 13 |            111 |
| 14   | `Krystal-Ball`     | false     |                  3 |                4 |                 10 |            110 |
| 15   | `Zohran-Mamdani`   | false     |                  6 |                2 |                 12 |            108 |
| 16   | `Dave-Portnoy`     | false     |                  4 |                4 |                 10 |            102 |
| 17   | `Shawn-Ryan`       | false     |                  4 |                4 |                 10 |             92 |
| 18   | `Pete-Davidson`    | false     |                  3 |                2 |                 12 |             91 |
| 19   | `Ali-Abdaal`       | false     |                  3 |                3 |                 11 |             90 |
| 20   | `Keke-Palmer`      | false     |                  3 |                3 |                 11 |             84 |
| 21   | `Dax-Shepard`      | false     |                  2 |                3 |                 11 |             81 |
| 22   | `Robert-Pattinson` | false     |                  4 |                2 |                 12 |             79 |
| 23   | `Chris-Williamson` | false     |                  5 |                2 |                  9 |             75 |
| 24   | `Malcolm-Gladwell` | false     |                  6 |                1 |                 13 |             70 |
| 25   | `Theo-Von`         | false     |                  3 |                1 |                 13 |             65 |
| 26   | `Jocko-Willink`    | false     |                  5 |                1 |                  9 |             60 |
| 27   | `Jacob-Elordi`     | false     |                  6 |                0 |                 11 |             52 |

## Queue B: Published Blogs Without Transcript Review Docs

These need manual fact-check passes from external sources.

| Rank | Person               | 3M impressions | Priority tag                              | Current grade | Lastmod    |
| ---- | -------------------- | -------------: | ----------------------------------------- | ------------- | ---------- |
| 1    | `Elon-Musk`          |          64748 | P3                                        | B+ (8.9)      | 2026-02-18 |
| 2    | `IShowSpeed`         |          13439 | P3                                        | A (9.1)       | 2026-02-19 |
| 3    | `Palmer-Luckey`      |          11011 | P1                                        | UNGRADED      | 2025-12-05 |
| 4    | `Sabrina-Carpenter`  |           7705 | P2                                        | B (8)         | 2026-02-06 |
| 5    | `Sydney-Sweeney`     |           6387 | P1                                        | C (7.6)       | 2026-01-29 |
| 6    | `Zayn-Malik`         |           5375 | P1                                        | UNGRADED      | 2025-12-09 |
| 7    | `Jeff-Bezos`         |           5219 | P2                                        | B (8)         | 2026-01-18 |
| 8    | `Mr-Beast`           |           3015 | P1                                        | UNGRADED      | 2026-01-29 |
| 9    | `Olivia-Rodrigo`     |           2884 | P1                                        | UNGRADED      | 2025-12-21 |
| 10   | `Sam-Altman`         |           2610 | P0                                        | F (5.4)       | 2026-01-18 |
| 11   | `Henry-Cavill`       |           2159 | P2                                        | B (8.3)       | 2026-02-18 |
| 12   | `Druski`             |           2124 | P2                                        | B (8.4)       | 2025-12-21 |
| 13   | `Millie-Bobby-Brown` |           2001 | P1                                        | UNGRADED      | 2025-12-03 |
| 14   | `Taylor-Swift`       |           1029 | P3                                        | B+ (8.8)      | 2026-02-18 |
| 15   | `Vladimir-Putin`     |            639 | Needs significant revision before publish | C (7.8)       | 2026-01-17 |
| 16   | `Donald-Trump`       |            481 | P3                                        | A (9)         | 2026-02-19 |
| 17   | `Joe-Biden`          |            235 | P3                                        | A (9)         | 2026-02-19 |

## First Detailed Pass: John Coogan

Files:

- Blog: `src/blog/people/drafts/John-Coogan.md`
- Review: `youtube-transcripts/john-coogan-review.md`

Immediate transcript-citation targets (`[HIGH]` and supported):

- `src/blog/people/drafts/John-Coogan.md:87`
- `src/blog/people/drafts/John-Coogan.md:103`
- `src/blog/people/drafts/John-Coogan.md:113`
- `src/blog/people/drafts/John-Coogan.md:117`
- `src/blog/people/drafts/John-Coogan.md:129`
- `src/blog/people/drafts/John-Coogan.md:131`
- `src/blog/people/drafts/John-Coogan.md:133`
- `src/blog/people/drafts/John-Coogan.md:145`
- `src/blog/people/drafts/John-Coogan.md:151`

External-source-required targets (`[HIGH]` unsupported by direct transcripts):

- `src/blog/people/drafts/John-Coogan.md:107`
- `src/blog/people/drafts/John-Coogan.md:109`
- `src/blog/people/drafts/John-Coogan.md:157`
- `src/blog/people/drafts/John-Coogan.md:201`
- `src/blog/people/drafts/John-Coogan.md:205`
- `src/blog/people/drafts/John-Coogan.md:213`

## Execution Order (One-by-One)

1. `Paris-Hilton` (`youtube-transcripts/paris-hilton-review.md`)
2. `Alex-Cooper` (`youtube-transcripts/alex-cooper-review.md`)
3. `Kristen-Bell` (`youtube-transcripts/kristen-bell-review.md`)
4. `Kim-Kardashian` (`youtube-transcripts/kim-kardashian-review.md`)
5. `John-Coogan` (`youtube-transcripts/john-coogan-review.md`)

## Batch 1: What To Verify First

- `Paris-Hilton` (`src/blog/people/drafts/Paris-Hilton.md`): fragrance revenue totals, DJ fee/rate claims, ADHD productivity framing quotes, reform timeline (Oct 2021 onward), June 26 2024 testimony details, relationship abuse/engagement history details.
- `Alex-Cooper` (`src/blog/people/drafts/Alex-Cooper.md`): “nine-figure empire” framing, school bullying/trauma claims, 2025 Hulu allegations and BU response details, Sofia/Portnoy deal timeline and quote attribution, follower-loss and election fallout metrics, SiriusXM/valuation deal figures.
- `Kristen-Bell` (`src/blog/people/drafts/Kristen-Bell.md`): award/nomination claims, mental health diagnosis/medication quotes, Hello Bello founding and affordability claims, biographical childhood details and direct family quotes, Oct 2025 social-media controversy timeline.
- `Kim-Kardashian` (`src/blog/people/drafts/Kim-Kardashian.md`): SKIMS valuation and Coty transaction details, “Kimono” rebrand logistics (inventory/scale), 2016 Paris robbery details and stolen-value claims, co-parenting/public quote claims tied to Kanye timeline.
- `John-Coogan` (`src/blog/people/drafts/John-Coogan.md`): transcript-backed business-history claims first, then unsupported high-risk claims around Soylent controversy virality quote, CTO scaling details, “white space/Cesar Pena” metric claim, “Evil Coogan/wireheading” quotes, and Renteln-role claims.

## Per-Blog Workflow

1. Apply transcript citations for all supported `[HIGH]` claims first.
2. For unsupported `[HIGH]` claims, add external source or soften/remove claim.
3. Then process `[MEDIUM]` unsupported claims.
4. Keep citations minimal and strategic: numbers, dates, major quotes, controversy claims, rankings, and “record” statements.
5. Mark completion by reducing unsupported counts in the corresponding `youtube-transcripts/*-review.md` file.
