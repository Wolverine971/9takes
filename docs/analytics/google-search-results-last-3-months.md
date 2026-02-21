<!-- docs/analytics/google-search-results-last-3-months.md -->

# 9takes Google Search Performance (Last 3 Months)

## Cleaned export

This file is reformatted from the raw Google export so it is easier to read and analyze:

- Original format was alternating URL / metric lines.
- URLs are normalized to a single row per URL.
- Metrics are grouped and sorted for readability.

## Snapshot

| Metric                            |   Value |
| --------------------------------- | ------: |
| Total indexed pages               |     402 |
| Total clicks                      |   2,873 |
| Total impressions                 | 528,678 |
| Overall CTR                       |   0.54% |
| Zero-click pages                  |     156 |
| Non-zero pages                    |     246 |
| Impressions from zero-click pages |  22,412 |
| Share from zero-click pages       |   4.24% |

## Section-level performance

| Section              | Pages | Clicks | Impressions |   CTR |
| -------------------- | ----: | -----: | ----------: | ----: |
| blog                 |     1 |      2 |         105 | 1.90% |
| enneagram-corner     |   103 |   1605 |      115974 | 1.38% |
| home                 |     1 |     29 |         982 | 2.95% |
| how-to-guides        |    12 |      3 |         977 | 0.31% |
| about                |     1 |      1 |          83 | 1.20% |
| types                |    34 |      0 |          58 | 0.00% |
| community            |     6 |      0 |         127 | 0.00% |
| book-session         |     1 |      0 |          14 | 0.00% |
| questions            |     1 |      0 |          71 | 0.00% |
| personality-analysis |   235 |   1217 |      407158 | 0.30% |
| pop-culture          |     7 |     16 |        3129 | 0.51% |

## Key observations

1. **Traffic concentration is strong**: Top 50 pages by impressions account for ~62.45% of total impressions.
2. **CTR is generally low overall**: Overall CTR is only 0.54%, suggesting broad visibility but weak click conversion.
3. **Section differences are significant**:
   - `personality-analysis` drives 77.01% of impressions but only 0.30% CTR.
   - `enneagram-corner` drives 21.94% of impressions and much better CTR at 1.38%.
4. **Zero-click volume is meaningful**: 156 pages have 0 clicks. Top zero-click opportunities are mostly below ~2,100 impressions, so they are low-effort quick wins.
5. **Top-performing clicks are concentrated in `enneagram-corner` pages**: this section has several standout CTR pages and the highest-click page is not the highest-impression page.

## Prioritized content updates by impact

Use this queue as an execution plan. Start with `personality-analysis` entries first because that section carries most traffic but has weak CTR.

### Priority 1 — Immediate (very high impressions + CTR below 0.30%)

| Priority | URL                                                       | Impressions |   CTR | What to update                                                                                                                                                              |
| -------- | --------------------------------------------------------- | ----------: | ----: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1        | https://9takes.com/personality-analysis/Elon-Musk         |      64,748 | 0.08% | Rewrite title + meta toward search intent (enneagram + leadership/decision style), add a 3–4 line answer at the top, then FAQ schema with 4 high-intent questions.          |
| 1        | https://9takes.com/personality-analysis/IShowSpeed        |      13,439 | 0.19% | Clarify ambiguity in title/description, add “one-line personality answer” section in first 120 words, and improve internal links to related personality pages.              |
| 1        | https://9takes.com/personality-analysis/Emma-Watson       |      13,638 | 0.26% | Add a stronger lead and a clearly labeled key-takeaways section, then answer likely FAQ queries (`core motivations`, `communication`, `decision style`) with schema blocks. |
| 2        | https://9takes.com/personality-analysis/Palmer-Luckey     |      11,011 | 0.11% | Improve first-paragraph readability, tighten heading structure, and add 2 short FAQ items plus anchor links to related enneagram pages.                                     |
| 2        | https://9takes.com/personality-analysis/Billie-Eilish     |       8,229 | 0.29% | Refresh title/meta for intent alignment, add concise personality summary before long-form content, add `Article` + `FAQ` structured snippets.                               |
| 2        | https://9takes.com/personality-analysis/Sabrina-Carpenter |       7,705 | 0.18% | Add practical section (“how this profile behaves in conflict”), add internal links to related analyses and high-CTR enneagram-corner content.                               |
| 2        | https://9takes.com/personality-analysis/Mark-Zuckerberg   |       7,444 | 0.28% | Rework metadata around leadership + decision patterns, then add short scannable top findings and related page links.                                                        |
| 2        | https://9takes.com/personality-analysis/Tom-Hiddleston    |       7,368 | 0.30% | Add search-intent keyword variants, simplify section transitions, and include a quick “how to work with this type” subsection.                                              |

### Priority 2 — Fast wins (high impressions, 0 clicks)

| Priority | URL                                                       | Impressions |   CTR | What to update                                                                                               |
| -------- | --------------------------------------------------------- | ----------: | ----: | ------------------------------------------------------------------------------------------------------------ |
| 2        | https://9takes.com/pop-culture/dark-triad-meets-enneagram |       2,065 | 0.00% | Rewrite title/meta with exact user query language and add a direct value proposition in the first paragraph. |
| 2        | https://9takes.com/personality-analysis/Bill-Gates        |       1,797 | 0.00% | Add an immediate answer block and FAQ schema (`motivation`, `working style`, `communication`).               |
| 2        | https://9takes.com/personality-analysis/Will-Smith        |       1,555 | 0.00% | Improve heading intent, include a concise type-summary at top, and add 3 internal links to related profiles. |
| 2        | https://9takes.com/enneagram-corner/enneagram-type-3      |       1,353 | 0.00% | Improve snippet quality by adding `what this means` intro + mini checklist before the first fold.            |
| 2        | https://9takes.com/personality-analysis/Taylor-Swift      |       1,029 | 0.00% | Rework title/description and add scannable personality takeaways so users can see value in the SERP.         |

### Priority 3 — Next tranche (meaningful potential after tier 1/2)

| Priority | URL                                                        | Impressions |   CTR | What to update                                                                                                              |
| -------- | ---------------------------------------------------------- | ----------: | ----: | --------------------------------------------------------------------------------------------------------------------------- |
| 3        | https://9takes.com/personality-analysis/Aubrey-Plaza       |       5,644 | 0.14% | Clean intent wording in title/meta, add top 5 behavior bullet list, then FAQ schema + relationship implications section.    |
| 3        | https://9takes.com/personality-analysis/Jeff-Bezos         |       5,219 | 0.10% | Add more concrete opening summary, structured headings, and links to related business/leadership enneagram pages.           |
| 3        | https://9takes.com/personality-analysis/Kevin-Hart         |       5,080 | 0.20% | Refresh metadata and intro, add short practical section on strengths/weaknesses and relationship behavior.                  |
| 3        | https://9takes.com/personality-analysis/Lex-Fridman        |       3,426 | 0.06% | Clarify search intent in title, add 4-point quick summary + FAQ schema.                                                     |
| 3        | https://9takes.com/personality-analysis/Robert-Oppenheimer |       2,687 | 0.04% | Rewrite for query intent, add brief “what people usually misunderstand” + links to 2 related profiles.                      |
| 3        | https://9takes.com/personality-analysis/Johnny-Depp        |       2,610 | 0.04% | Add stronger intro and explicit sections for communication, risk, and motivation; reduce passive voice and long paragraphs. |

### Canonicalization and technical follow-up (do now)

1. Merge duplicate URL variants into one canonical URL (remove `www` + trailing slash splits), then 301 redirect to canonical.
2. For every updated page, set:
   - unique, intent-aligned title
   - metadata description with one clear click-through benefit
   - FAQ/HowTo schema where the content supports it
3. Re-run Search Console after each batch and compare top 20 pages by impressions and CTR.

## Duplicate URL normalization note

Some URLs appear twice due host/trailing-slash differences (`www` vs no-www, slash variations).

| Canonical URL                                                    | Duplicate rows | Clicks | Impressions |
| ---------------------------------------------------------------- | -------------: | -----: | ----------: |
| https://9takes.com/enneagram-corner/enneagram-and-mental-illness |              2 |    493 |       12237 |
| https://9takes.com/personality-analysis/Dave-Portnoy             |              2 |      9 |        1829 |
| https://9takes.com/personality-analysis/Emma-Watson              |              2 |     35 |       13639 |
| https://9takes.com/personality-analysis/Gwyneth-Paltrow          |              2 |     19 |        3944 |
| https://9takes.com/personality-analysis/IShowSpeed               |              2 |     26 |       13462 |
| https://9takes.com/personality-analysis/Timothee-Chalamet        |              2 |     36 |        4168 |

## Top 50 pages by impressions

| Rank | URL                                                                               | Clicks | Impressions |   CTR |
| ---- | --------------------------------------------------------------------------------- | -----: | ----------: | ----: |
| 1    | https://9takes.com/personality-analysis/Elon-Musk                                 |     52 |       64748 | 0.08% |
| 2    | https://9takes.com/personality-analysis/Emma-Watson                               |     35 |       13638 | 0.26% |
| 3    | https://9takes.com/personality-analysis/IShowSpeed                                |     26 |       13439 | 0.19% |
| 4    | https://9takes.com/enneagram-corner/enneagram-and-mental-illness                  |    493 |       12235 | 4.03% |
| 5    | https://9takes.com/personality-analysis/Palmer-Luckey                             |     12 |       11011 | 0.11% |
| 6    | https://9takes.com/enneagram-corner/enneagram-test-comparison-2025                |     38 |       10249 | 0.37% |
| 7    | https://9takes.com/enneagram-corner/astrology-and-the-enneagram                   |    122 |        9508 | 1.28% |
| 8    | https://9takes.com/personality-analysis/Billie-Eilish                             |     24 |        8229 | 0.29% |
| 9    | https://9takes.com/enneagram-corner/enneagram-instinctual-subtypes                |     95 |        8000 | 1.19% |
| 10   | https://9takes.com/personality-analysis/Sabrina-Carpenter                         |     14 |        7705 | 0.18% |
| 11   | https://9takes.com/personality-analysis/Mark-Zuckerberg                           |     21 |        7444 | 0.28% |
| 12   | https://9takes.com/personality-analysis/Tom-Hiddleston                            |     22 |        7368 | 0.30% |
| 13   | https://9takes.com/personality-analysis/Sydney-Sweeney                            |     42 |        6387 | 0.66% |
| 14   | https://9takes.com/personality-analysis/Ryan-Gosling                              |     25 |        6301 | 0.40% |
| 15   | https://9takes.com/enneagram-corner/enneagram-compatibility-matrix                |     61 |        6197 | 0.98% |
| 16   | https://9takes.com/personality-analysis/Meghan-Markle                             |     33 |        6084 | 0.54% |
| 17   | https://9takes.com/personality-analysis/Aubrey-Plaza                              |      8 |        5644 | 0.14% |
| 18   | https://9takes.com/personality-analysis/Jimmy-Fallon                              |     18 |        5421 | 0.33% |
| 19   | https://9takes.com/personality-analysis/Zayn-Malik                                |     26 |        5375 | 0.48% |
| 20   | https://9takes.com/personality-analysis/Dua-Lipa                                  |     33 |        5279 | 0.63% |
| 21   | https://9takes.com/personality-analysis/Jeff-Bezos                                |      5 |        5219 | 0.10% |
| 22   | https://9takes.com/enneagram-corner/enneagram-wings-complete-guide                |     24 |        5173 | 0.46% |
| 23   | https://9takes.com/personality-analysis/Kevin-Hart                                |     10 |        5080 | 0.20% |
| 24   | https://9takes.com/enneagram-corner/mental-health/enneagram-science-mental-health |      6 |        4884 | 0.12% |
| 25   | https://9takes.com/personality-analysis/Jennifer-Lopez                            |     22 |        4658 | 0.47% |
| 26   | https://9takes.com/personality-analysis/Drake                                     |     18 |        4396 | 0.41% |
| 27   | https://9takes.com/personality-analysis/Lady-Gaga                                 |     15 |        4202 | 0.36% |
| 28   | https://9takes.com/enneagram-corner/toxic-traits-of-each-enneagram-type           |    102 |        4172 | 2.44% |
| 29   | https://9takes.com/personality-analysis/Timothee-Chalamet                         |     36 |        4167 | 0.86% |
| 30   | https://9takes.com/personality-analysis/John-F-Kennedy                            |     10 |        4089 | 0.24% |
| 31   | https://9takes.com/personality-analysis/type/9                                    |     16 |        4006 | 0.40% |
| 32   | https://9takes.com/personality-analysis/Gwyneth-Paltrow                           |     19 |        3942 | 0.48% |
| 33   | https://9takes.com/personality-analysis/Madison-Beer                              |     16 |        3695 | 0.43% |
| 34   | https://9takes.com/personality-analysis/Kai-Cenat                                 |     15 |        3628 | 0.41% |
| 35   | https://9takes.com/personality-analysis/Lana-Del-Rey                              |      8 |        3592 | 0.22% |
| 36   | https://9takes.com/personality-analysis/Joaquin-Phoenix                           |     13 |        3557 | 0.37% |
| 37   | https://9takes.com/personality-analysis/Lex-Fridman                               |      2 |        3426 | 0.06% |
| 38   | https://9takes.com/personality-analysis/Cillian-Murphy                            |     12 |        3311 | 0.36% |
| 39   | https://9takes.com/personality-analysis/Joe-Rogan                                 |     13 |        3150 | 0.41% |
| 40   | https://9takes.com/enneagram-corner/enneagram-tldr                                |      6 |        3121 | 0.19% |
| 41   | https://9takes.com/personality-analysis/Zendaya                                   |     12 |        3120 | 0.38% |
| 42   | https://9takes.com/personality-analysis/Mr-Beast                                  |     10 |        3015 | 0.33% |
| 43   | https://9takes.com/personality-analysis/Bob-Dylan                                 |     22 |        2973 | 0.74% |
| 44   | https://9takes.com/enneagram-corner/enneagram-types-and-career-choices            |     10 |        2898 | 0.35% |
| 45   | https://9takes.com/personality-analysis/Olivia-Rodrigo                            |      5 |        2884 | 0.17% |
| 46   | https://9takes.com/personality-analysis/Margot-Robbie                             |     14 |        2778 | 0.50% |
| 47   | https://9takes.com/enneagram-corner/mental-health/enneagram-neurodivergence-guide |     93 |        2764 | 3.36% |
| 48   | https://9takes.com/personality-analysis/Robert-Oppenheimer                        |      1 |        2687 | 0.04% |
| 49   | https://9takes.com/personality-analysis/Selena-Gomez                              |      5 |        2662 | 0.19% |
| 50   | https://9takes.com/personality-analysis/Kylie-Jenner                              |      5 |        2624 | 0.19% |

## Top 50 pages by clicks

| Rank | URL                                                                                 | Clicks | Impressions |   CTR |
| ---- | ----------------------------------------------------------------------------------- | -----: | ----------: | ----: |
| 1    | https://9takes.com/enneagram-corner/enneagram-and-mental-illness                    |    493 |       12235 | 4.03% |
| 2    | https://9takes.com/enneagram-corner/astrology-and-the-enneagram                     |    122 |        9508 | 1.28% |
| 3    | https://9takes.com/enneagram-corner/toxic-traits-of-each-enneagram-type             |    102 |        4172 | 2.44% |
| 4    | https://9takes.com/enneagram-corner/enneagram-instinctual-subtypes                  |     95 |        8000 | 1.19% |
| 5    | https://9takes.com/enneagram-corner/mental-health/enneagram-neurodivergence-guide   |     93 |        2764 | 3.36% |
| 6    | https://9takes.com/enneagram-corner/depression-patterns-by-enneagram-type           |     66 |        2129 | 3.10% |
| 7    | https://9takes.com/enneagram-corner/enneagram-compatibility-matrix                  |     61 |        6197 | 0.98% |
| 8    | https://9takes.com/personality-analysis/Elon-Musk                                   |     52 |       64748 | 0.08% |
| 9    | https://9takes.com/personality-analysis/Sydney-Sweeney                              |     42 |        6387 | 0.66% |
| 10   | https://9takes.com/enneagram-corner/biggest-compliments-to-give-each-enneagram-type |     38 |        1695 | 2.24% |
| 11   | https://9takes.com/enneagram-corner/enneagram-test-comparison-2025                  |     38 |       10249 | 0.37% |
| 12   | https://9takes.com/personality-analysis/Timothee-Chalamet                           |     36 |        4167 | 0.86% |
| 13   | https://9takes.com/enneagram-corner/toxic-traits-relationships-warning-signs        |     35 |        1696 | 2.06% |
| 14   | https://9takes.com/personality-analysis/Emma-Watson                                 |     35 |       13638 | 0.26% |
| 15   | https://9takes.com/personality-analysis/Dua-Lipa                                    |     33 |        5279 | 0.63% |
| 16   | https://9takes.com/personality-analysis/Meghan-Markle                               |     33 |        6084 | 0.54% |
| 17   | https://9takes.com/enneagram-corner/enneagram-strengths-and-weaknesses              |     32 |        2210 | 1.45% |
| 18   | https://9takes.com/                                                                 |     29 |         982 | 2.95% |
| 19   | https://9takes.com/enneagram-corner/enneagram-mental-health-flags                   |     29 |        1233 | 2.35% |
| 20   | https://9takes.com/personality-analysis/IShowSpeed                                  |     26 |       13439 | 0.19% |
| 21   | https://9takes.com/personality-analysis/Zayn-Malik                                  |     26 |        5375 | 0.48% |
| 22   | https://9takes.com/enneagram-corner/enneagram-and-adhd-which-types-struggle-most    |     25 |         851 | 2.94% |
| 23   | https://9takes.com/personality-analysis/Ryan-Gosling                                |     25 |        6301 | 0.40% |
| 24   | https://9takes.com/enneagram-corner/enneagram-medication-mental-health              |     24 |        1467 | 1.64% |
| 25   | https://9takes.com/enneagram-corner/enneagram-wings-complete-guide                  |     24 |        5173 | 0.46% |
| 26   | https://9takes.com/personality-analysis/Billie-Eilish                               |     24 |        8229 | 0.29% |
| 27   | https://9takes.com/personality-analysis/Agatha-Christie                             |     23 |        1284 | 1.79% |
| 28   | https://9takes.com/personality-analysis/Bob-Dylan                                   |     22 |        2973 | 0.74% |
| 29   | https://9takes.com/personality-analysis/Jennifer-Lopez                              |     22 |        4658 | 0.47% |
| 30   | https://9takes.com/personality-analysis/Tom-Hiddleston                              |     22 |        7368 | 0.30% |
| 31   | https://9takes.com/enneagram-corner/enneagram-addiction-recovery-guide              |     21 |        1520 | 1.38% |
| 32   | https://9takes.com/personality-analysis/Mark-Zuckerberg                             |     21 |        7444 | 0.28% |
| 33   | https://9takes.com/enneagram-corner/how-to-apologize-like-a-pro                     |     19 |         689 | 2.76% |
| 34   | https://9takes.com/personality-analysis/Gwyneth-Paltrow                             |     19 |        3942 | 0.48% |
| 35   | https://9takes.com/personality-analysis/Drake                                       |     18 |        4396 | 0.41% |
| 36   | https://9takes.com/personality-analysis/Jimmy-Fallon                                |     18 |        5421 | 0.33% |
| 37   | https://9takes.com/enneagram-corner/attachment-styles-and-enneagram-types           |     17 |        1988 | 0.86% |
| 38   | https://9takes.com/enneagram-corner/enneagram-types-at-party                        |     17 |         361 | 4.71% |
| 39   | https://9takes.com/personality-analysis/Sam-Altman                                  |     17 |        2610 | 0.65% |
| 40   | https://9takes.com/enneagram-corner/enneagram-types-in-relationships                |     16 |        1389 | 1.15% |
| 41   | https://9takes.com/personality-analysis/Madison-Beer                                |     16 |        3695 | 0.43% |
| 42   | https://9takes.com/personality-analysis/type/9                                      |     16 |        4006 | 0.40% |
| 43   | https://9takes.com/enneagram-corner/neurodiversity-vs-personality                   |     15 |         194 | 7.73% |
| 44   | https://9takes.com/personality-analysis/Kai-Cenat                                   |     15 |        3628 | 0.41% |
| 45   | https://9takes.com/personality-analysis/Lady-Gaga                                   |     15 |        4202 | 0.36% |
| 46   | https://9takes.com/personality-analysis/Jackie-Kennedy                              |     14 |        1866 | 0.75% |
| 47   | https://9takes.com/personality-analysis/Kourtney-Kardashian                         |     14 |        2118 | 0.66% |
| 48   | https://9takes.com/personality-analysis/Margot-Robbie                               |     14 |        2778 | 0.50% |
| 49   | https://9takes.com/personality-analysis/Prince-Harry                                |     14 |        1795 | 0.78% |
| 50   | https://9takes.com/personality-analysis/Sabrina-Carpenter                           |     14 |        7705 | 0.18% |

## Zero-click opportunities (top 40 pages by impressions)

These are pages receiving impressions but no clicks.

| Rank | URL                                                                                          | Impressions |
| ---- | -------------------------------------------------------------------------------------------- | ----------: |
| 1    | https://9takes.com/pop-culture/dark-triad-meets-enneagram                                    |        2065 |
| 2    | https://9takes.com/personality-analysis/Bill-Gates                                           |        1797 |
| 3    | https://9takes.com/personality-analysis/Will-Smith                                           |        1555 |
| 4    | https://9takes.com/enneagram-corner/enneagram-type-3                                         |        1353 |
| 5    | https://9takes.com/personality-analysis/Taylor-Swift                                         |        1029 |
| 6    | https://9takes.com/personality-analysis/Jordan-Peterson                                      |         860 |
| 7    | https://9takes.com/personality-analysis/Martin-Luther-King-Jr                                |         858 |
| 8    | https://9takes.com/personality-analysis/Kendrick-Lamar                                       |         749 |
| 9    | https://9takes.com/enneagram-corner/enneagram-team-dynamics                                  |         740 |
| 10   | https://9takes.com/personality-analysis/Harry-Styles                                         |         689 |
| 11   | https://9takes.com/personality-analysis/Tim-Dillon                                           |         598 |
| 12   | https://9takes.com/personality-analysis/Natalie-Portman                                      |         594 |
| 13   | https://9takes.com/personality-analysis/type/3                                               |         457 |
| 14   | https://9takes.com/enneagram-corner/relationship-communication-guide                         |         411 |
| 15   | https://9takes.com/personality-analysis/Cristiano-Ronaldo                                    |         404 |
| 16   | https://9takes.com/personality-analysis/Jason-Calacanis                                      |         364 |
| 17   | https://9takes.com/personality-analysis/Amber-Heard                                          |         342 |
| 18   | https://9takes.com/personality-analysis/Bad-Bunny                                            |         326 |
| 19   | https://9takes.com/personality-analysis/George-RR-Martin                                     |         303 |
| 20   | https://9takes.com/personality-analysis/Hillary-Clinton                                      |         303 |
| 21   | https://9takes.com/personality-analysis/Saoirse-Ronan                                        |         232 |
| 22   | https://9takes.com/personality-analysis/Mr-Rogers                                            |         225 |
| 23   | https://9takes.com/personality-analysis/Chelsea-Handler                                      |         193 |
| 24   | https://9takes.com/personality-analysis/Ruth-Bader-Ginsburg                                  |         193 |
| 25   | https://9takes.com/personality-analysis/Tim-Cook                                             |         193 |
| 26   | https://9takes.com/how-to-guides/using-the-enneagram-for-self-development                    |         166 |
| 27   | https://9takes.com/personality-analysis/Addison-Rae                                          |         166 |
| 28   | https://9takes.com/personality-analysis/Bernie-Sanders                                       |         165 |
| 29   | https://9takes.com/personality-analysis/Malcolm-X                                            |         154 |
| 30   | https://9takes.com/personality-analysis/Leila-Hormozi                                        |         144 |
| 31   | https://9takes.com/personality-analysis/Theo-Von                                             |         144 |
| 32   | https://9takes.com/enneagram-corner/why-dating-apps-are-harder-for-certain-personality-types |         136 |
| 33   | https://9takes.com/personality-analysis/Sundar-Pichai                                        |         136 |
| 34   | https://9takes.com/enneagram-corner/oversharing-psychology-shame-boundaries                  |         135 |
| 35   | https://9takes.com/personality-analysis/xQc                                                  |         135 |
| 36   | https://9takes.com/how-to-guides/definitive-guide-to-relationship-conflict-part-1            |         130 |
| 37   | https://9takes.com/personality-analysis/Bella-Hadid                                          |         122 |
| 38   | https://9takes.com/personality-analysis/Andrew-Tate                                          |         112 |
| 39   | https://9takes.com/enneagram-corner/enneagram-trauma-response-guide                          |         111 |
| 40   | https://9takes.com/personality-analysis/Paul-Graham                                          |         111 |

## Full page-level list (sorted by impressions)

| Rank | URL                                                                                                               | Clicks | Impressions |   CTR |
| ---- | ----------------------------------------------------------------------------------------------------------------- | -----: | ----------: | ----: |
| 1    | https://9takes.com/personality-analysis/Elon-Musk                                                                 |     52 |       64748 | 0.08% |
| 2    | https://9takes.com/personality-analysis/Emma-Watson                                                               |     35 |       13638 | 0.26% |
| 3    | https://9takes.com/personality-analysis/IShowSpeed                                                                |     26 |       13439 | 0.19% |
| 4    | https://9takes.com/enneagram-corner/enneagram-and-mental-illness                                                  |    493 |       12235 | 4.03% |
| 5    | https://9takes.com/personality-analysis/Palmer-Luckey                                                             |     12 |       11011 | 0.11% |
| 6    | https://9takes.com/enneagram-corner/enneagram-test-comparison-2025                                                |     38 |       10249 | 0.37% |
| 7    | https://9takes.com/enneagram-corner/astrology-and-the-enneagram                                                   |    122 |        9508 | 1.28% |
| 8    | https://9takes.com/personality-analysis/Billie-Eilish                                                             |     24 |        8229 | 0.29% |
| 9    | https://9takes.com/enneagram-corner/enneagram-instinctual-subtypes                                                |     95 |        8000 | 1.19% |
| 10   | https://9takes.com/personality-analysis/Sabrina-Carpenter                                                         |     14 |        7705 | 0.18% |
| 11   | https://9takes.com/personality-analysis/Mark-Zuckerberg                                                           |     21 |        7444 | 0.28% |
| 12   | https://9takes.com/personality-analysis/Tom-Hiddleston                                                            |     22 |        7368 | 0.30% |
| 13   | https://9takes.com/personality-analysis/Sydney-Sweeney                                                            |     42 |        6387 | 0.66% |
| 14   | https://9takes.com/personality-analysis/Ryan-Gosling                                                              |     25 |        6301 | 0.40% |
| 15   | https://9takes.com/enneagram-corner/enneagram-compatibility-matrix                                                |     61 |        6197 | 0.98% |
| 16   | https://9takes.com/personality-analysis/Meghan-Markle                                                             |     33 |        6084 | 0.54% |
| 17   | https://9takes.com/personality-analysis/Aubrey-Plaza                                                              |      8 |        5644 | 0.14% |
| 18   | https://9takes.com/personality-analysis/Jimmy-Fallon                                                              |     18 |        5421 | 0.33% |
| 19   | https://9takes.com/personality-analysis/Zayn-Malik                                                                |     26 |        5375 | 0.48% |
| 20   | https://9takes.com/personality-analysis/Dua-Lipa                                                                  |     33 |        5279 | 0.63% |
| 21   | https://9takes.com/personality-analysis/Jeff-Bezos                                                                |      5 |        5219 | 0.10% |
| 22   | https://9takes.com/enneagram-corner/enneagram-wings-complete-guide                                                |     24 |        5173 | 0.46% |
| 23   | https://9takes.com/personality-analysis/Kevin-Hart                                                                |     10 |        5080 | 0.20% |
| 24   | https://9takes.com/enneagram-corner/mental-health/enneagram-science-mental-health                                 |      6 |        4884 | 0.12% |
| 25   | https://9takes.com/personality-analysis/Jennifer-Lopez                                                            |     22 |        4658 | 0.47% |
| 26   | https://9takes.com/personality-analysis/Drake                                                                     |     18 |        4396 | 0.41% |
| 27   | https://9takes.com/personality-analysis/Lady-Gaga                                                                 |     15 |        4202 | 0.36% |
| 28   | https://9takes.com/enneagram-corner/toxic-traits-of-each-enneagram-type                                           |    102 |        4172 | 2.44% |
| 29   | https://9takes.com/personality-analysis/Timothee-Chalamet                                                         |     36 |        4167 | 0.86% |
| 30   | https://9takes.com/personality-analysis/John-F-Kennedy                                                            |     10 |        4089 | 0.24% |
| 31   | https://9takes.com/personality-analysis/type/9                                                                    |     16 |        4006 | 0.40% |
| 32   | https://9takes.com/personality-analysis/Gwyneth-Paltrow                                                           |     19 |        3942 | 0.48% |
| 33   | https://9takes.com/personality-analysis/Madison-Beer                                                              |     16 |        3695 | 0.43% |
| 34   | https://9takes.com/personality-analysis/Kai-Cenat                                                                 |     15 |        3628 | 0.41% |
| 35   | https://9takes.com/personality-analysis/Lana-Del-Rey                                                              |      8 |        3592 | 0.22% |
| 36   | https://9takes.com/personality-analysis/Joaquin-Phoenix                                                           |     13 |        3557 | 0.37% |
| 37   | https://9takes.com/personality-analysis/Lex-Fridman                                                               |      2 |        3426 | 0.06% |
| 38   | https://9takes.com/personality-analysis/Cillian-Murphy                                                            |     12 |        3311 | 0.36% |
| 39   | https://9takes.com/personality-analysis/Joe-Rogan                                                                 |     13 |        3150 | 0.41% |
| 40   | https://9takes.com/enneagram-corner/enneagram-tldr                                                                |      6 |        3121 | 0.19% |
| 41   | https://9takes.com/personality-analysis/Zendaya                                                                   |     12 |        3120 | 0.38% |
| 42   | https://9takes.com/personality-analysis/Mr-Beast                                                                  |     10 |        3015 | 0.33% |
| 43   | https://9takes.com/personality-analysis/Bob-Dylan                                                                 |     22 |        2973 | 0.74% |
| 44   | https://9takes.com/enneagram-corner/enneagram-types-and-career-choices                                            |     10 |        2898 | 0.35% |
| 45   | https://9takes.com/personality-analysis/Olivia-Rodrigo                                                            |      5 |        2884 | 0.17% |
| 46   | https://9takes.com/personality-analysis/Margot-Robbie                                                             |     14 |        2778 | 0.50% |
| 47   | https://9takes.com/enneagram-corner/mental-health/enneagram-neurodivergence-guide                                 |     93 |        2764 | 3.36% |
| 48   | https://9takes.com/personality-analysis/Robert-Oppenheimer                                                        |      1 |        2687 | 0.04% |
| 49   | https://9takes.com/personality-analysis/Selena-Gomez                                                              |      5 |        2662 | 0.19% |
| 50   | https://9takes.com/personality-analysis/Kylie-Jenner                                                              |      5 |        2624 | 0.19% |
| 51   | https://9takes.com/personality-analysis/Johnny-Depp                                                               |      1 |        2610 | 0.04% |
| 52   | https://9takes.com/personality-analysis/Sam-Altman                                                                |     17 |        2610 | 0.65% |
| 53   | https://9takes.com/personality-analysis/Kim-Kardashian                                                            |      6 |        2582 | 0.23% |
| 54   | https://9takes.com/personality-analysis/Brad-Pitt                                                                 |     11 |        2441 | 0.45% |
| 55   | https://9takes.com/personality-analysis/Ryan-Reynolds                                                             |      8 |        2431 | 0.33% |
| 56   | https://9takes.com/personality-analysis/Marilyn-Monroe                                                            |      9 |        2391 | 0.38% |
| 57   | https://9takes.com/personality-analysis/Peter-Thiel                                                               |      6 |        2389 | 0.25% |
| 58   | https://9takes.com/personality-analysis/Beyonce-Knowles                                                           |      6 |        2352 | 0.26% |
| 59   | https://9takes.com/personality-analysis/Keanu-Reeves                                                              |      6 |        2265 | 0.26% |
| 60   | https://9takes.com/personality-analysis/type/2                                                                    |      6 |        2234 | 0.27% |
| 61   | https://9takes.com/personality-analysis/Hugh-Jackman                                                              |     11 |        2212 | 0.50% |
| 62   | https://9takes.com/enneagram-corner/enneagram-strengths-and-weaknesses                                            |     32 |        2210 | 1.45% |
| 63   | https://9takes.com/personality-analysis/Henry-Cavill                                                              |      2 |        2159 | 0.09% |
| 64   | https://9takes.com/enneagram-corner/depression-patterns-by-enneagram-type                                         |     66 |        2129 | 3.10% |
| 65   | https://9takes.com/personality-analysis/Druski                                                                    |     12 |        2124 | 0.56% |
| 66   | https://9takes.com/personality-analysis/Jenna-Ortega                                                              |      5 |        2119 | 0.24% |
| 67   | https://9takes.com/personality-analysis/Kourtney-Kardashian                                                       |     14 |        2118 | 0.66% |
| 68   | https://9takes.com/personality-analysis/Steve-Jobs                                                                |      5 |        2100 | 0.24% |
| 69   | https://9takes.com/personality-analysis/Friedrich-Nietzsche                                                       |      6 |        2099 | 0.29% |
| 70   | https://9takes.com/pop-culture/dark-triad-meets-enneagram                                                         |      0 |        2065 | 0.00% |
| 71   | https://9takes.com/enneagram-corner/enneagram-type-4                                                              |      8 |        2026 | 0.39% |
| 72   | https://9takes.com/personality-analysis/Millie-Bobby-Brown                                                        |      4 |        2001 | 0.20% |
| 73   | https://9takes.com/enneagram-corner/attachment-styles-and-enneagram-types                                         |     17 |        1988 | 0.86% |
| 74   | https://9takes.com/personality-analysis/Nicole-Kidman                                                             |     12 |        1946 | 0.62% |
| 75   | https://9takes.com/personality-analysis/Tom-Hardy                                                                 |     14 |        1879 | 0.75% |
| 76   | https://9takes.com/personality-analysis/Jackie-Kennedy                                                            |     14 |        1866 | 0.75% |
| 77   | https://9takes.com/personality-analysis/Dwayne-Johnson                                                            |      3 |        1855 | 0.16% |
| 78   | https://9takes.com/personality-analysis/Robert-Downey-Jr                                                          |      1 |        1837 | 0.05% |
| 79   | https://9takes.com/personality-analysis/Dave-Portnoy                                                              |      9 |        1828 | 0.49% |
| 80   | https://9takes.com/personality-analysis/Tom-Holland                                                               |      2 |        1819 | 0.11% |
| 81   | https://9takes.com/personality-analysis/Justin-Bieber                                                             |      2 |        1804 | 0.11% |
| 82   | https://9takes.com/personality-analysis/Bill-Gates                                                                |      0 |        1797 | 0.00% |
| 83   | https://9takes.com/personality-analysis/Prince-Harry                                                              |     14 |        1795 | 0.78% |
| 84   | https://9takes.com/personality-analysis/Winston-Churchill                                                         |      8 |        1786 | 0.45% |
| 85   | https://9takes.com/personality-analysis/Charlie-Puth                                                              |      5 |        1758 | 0.28% |
| 86   | https://9takes.com/personality-analysis/Tom-Hanks                                                                 |      3 |        1755 | 0.17% |
| 87   | https://9takes.com/enneagram-corner/enneagram-types-in-stress                                                     |     13 |        1738 | 0.75% |
| 88   | https://9takes.com/personality-analysis/Nikola-Tesla                                                              |      5 |        1733 | 0.29% |
| 89   | https://9takes.com/personality-analysis/Denzel-Washington                                                         |      4 |        1699 | 0.24% |
| 90   | https://9takes.com/enneagram-corner/toxic-traits-relationships-warning-signs                                      |     35 |        1696 | 2.06% |
| 91   | https://9takes.com/enneagram-corner/biggest-compliments-to-give-each-enneagram-type                               |     38 |        1695 | 2.24% |
| 92   | https://9takes.com/personality-analysis/Michelle-Obama                                                            |      4 |        1688 | 0.24% |
| 93   | https://9takes.com/personality-analysis/Jennifer-Lawrence                                                         |      3 |        1652 | 0.18% |
| 94   | https://9takes.com/personality-analysis/Khloe-Kardashian                                                          |      5 |        1617 | 0.31% |
| 95   | https://9takes.com/personality-analysis/Ariana-Grande                                                             |      4 |        1607 | 0.25% |
| 96   | https://9takes.com/personality-analysis/Ronald-Reagan                                                             |     11 |        1590 | 0.69% |
| 97   | https://9takes.com/enneagram-corner/enneagram-anxiety-complete-guide                                              |      4 |        1579 | 0.25% |
| 98   | https://9takes.com/personality-analysis/Will-Smith                                                                |      0 |        1555 | 0.00% |
| 99   | https://9takes.com/enneagram-corner/enneagram-addiction-recovery-guide                                            |     21 |        1520 | 1.38% |
| 100  | https://9takes.com/personality-analysis/Chappell-Roan                                                             |      3 |        1519 | 0.20% |
| 101  | https://9takes.com/personality-analysis/type/1                                                                    |      7 |        1517 | 0.46% |
| 102  | https://9takes.com/enneagram-corner/enneagram-medication-mental-health                                            |     24 |        1467 | 1.64% |
| 103  | https://9takes.com/personality-analysis/type/4                                                                    |     10 |        1429 | 0.70% |
| 104  | https://9takes.com/personality-analysis/Rihanna                                                                   |      6 |        1399 | 0.43% |
| 105  | https://9takes.com/personality-analysis/type/8                                                                    |      3 |        1396 | 0.21% |
| 106  | https://9takes.com/enneagram-corner/enneagram-types-in-relationships                                              |     16 |        1389 | 1.15% |
| 107  | https://9takes.com/personality-analysis/Anya-Taylor-Joy                                                           |      3 |        1370 | 0.22% |
| 108  | https://9takes.com/personality-analysis/Eminem                                                                    |      9 |        1361 | 0.66% |
| 109  | https://9takes.com/personality-analysis/Robert-Pattinson                                                          |     10 |        1360 | 0.74% |
| 110  | https://9takes.com/personality-analysis/Oprah-Winfrey                                                             |      1 |        1355 | 0.07% |
| 111  | https://9takes.com/enneagram-corner/enneagram-type-3                                                              |      0 |        1353 | 0.00% |
| 112  | https://9takes.com/enneagram-corner/enneagram-type-8                                                              |     13 |        1351 | 0.96% |
| 113  | https://9takes.com/personality-analysis/Katy-Perry                                                                |      3 |        1332 | 0.23% |
| 114  | https://9takes.com/enneagram-corner/enneagram-type-9                                                              |      6 |        1325 | 0.45% |
| 115  | https://9takes.com/personality-analysis/Paris-Hilton                                                              |      5 |        1322 | 0.38% |
| 116  | https://9takes.com/enneagram-corner/enneagram-type-6                                                              |      7 |        1287 | 0.54% |
| 117  | https://9takes.com/personality-analysis/Agatha-Christie                                                           |     23 |        1284 | 1.79% |
| 118  | https://9takes.com/personality-analysis/Scarlett-Johansson                                                        |      5 |        1254 | 0.40% |
| 119  | https://9takes.com/enneagram-corner/enneagram-mental-health-flags                                                 |     29 |        1233 | 2.35% |
| 120  | https://9takes.com/personality-analysis/Arnold-Schwarzenegger                                                     |      4 |        1185 | 0.34% |
| 121  | https://9takes.com/personality-analysis/Grimes                                                                    |      1 |        1185 | 0.08% |
| 122  | https://9takes.com/personality-analysis/Tom-Cruise                                                                |      4 |        1132 | 0.35% |
| 123  | https://9takes.com/enneagram-corner/enneagram-type-5                                                              |      7 |        1124 | 0.62% |
| 124  | https://9takes.com/personality-analysis/Leonardo-DiCaprio                                                         |      2 |        1102 | 0.18% |
| 125  | https://9takes.com/personality-analysis/Adin-Ross                                                                 |      2 |        1094 | 0.18% |
| 126  | https://9takes.com/personality-analysis/Xi-Jinping                                                                |      1 |        1045 | 0.10% |
| 127  | https://9takes.com/personality-analysis/Taylor-Swift                                                              |      0 |        1029 | 0.00% |
| 128  | https://9takes.com/                                                                                               |     29 |         982 | 2.95% |
| 129  | https://9takes.com/personality-analysis/Blake-Lively                                                              |      8 |         966 | 0.83% |
| 130  | https://9takes.com/personality-analysis/Jennifer-Garner                                                           |      5 |         961 | 0.52% |
| 131  | https://9takes.com/enneagram-corner/enneagram-types-working-in-teams                                              |      2 |         954 | 0.21% |
| 132  | https://9takes.com/personality-analysis/Miley-Cyrus                                                               |      2 |         951 | 0.21% |
| 133  | https://9takes.com/enneagram-corner/enneagram-vs-meyers-briggs                                                    |      3 |         921 | 0.33% |
| 134  | https://9takes.com/personality-analysis/Tina-Fey                                                                  |      8 |         909 | 0.88% |
| 135  | https://9takes.com/pop-culture/epstein-psychology-part-1                                                          |     14 |         901 | 1.55% |
| 136  | https://9takes.com/personality-analysis/Jake-Paul                                                                 |      7 |         873 | 0.80% |
| 137  | https://9takes.com/personality-analysis/Jordan-Peterson                                                           |      0 |         860 | 0.00% |
| 138  | https://9takes.com/personality-analysis/Martin-Luther-King-Jr                                                     |      0 |         858 | 0.00% |
| 139  | https://9takes.com/personality-analysis/Halsey                                                                    |      2 |         857 | 0.23% |
| 140  | https://9takes.com/personality-analysis/type/6                                                                    |      4 |         854 | 0.47% |
| 141  | https://9takes.com/enneagram-corner/enneagram-and-adhd-which-types-struggle-most                                  |     25 |         851 | 2.94% |
| 142  | https://9takes.com/personality-analysis/Meryl-Streep                                                              |      4 |         847 | 0.47% |
| 143  | https://9takes.com/enneagram-corner/enneagram-type-2                                                              |      2 |         827 | 0.24% |
| 144  | https://9takes.com/personality-analysis/Anne-Hathaway                                                             |      1 |         822 | 0.12% |
| 145  | https://9takes.com/personality-analysis/Hailey-Bieber                                                             |      1 |         795 | 0.13% |
| 146  | https://9takes.com/enneagram-corner/enneagram-and-religion                                                        |      8 |         793 | 1.01% |
| 147  | https://9takes.com/personality-analysis/Prince                                                                    |      1 |         787 | 0.13% |
| 148  | https://9takes.com/personality-analysis/Travis-Scott                                                              |      1 |         787 | 0.13% |
| 149  | https://9takes.com/personality-analysis/Kristen-Bell                                                              |      1 |         781 | 0.13% |
| 150  | https://9takes.com/personality-analysis/Kendrick-Lamar                                                            |      0 |         749 | 0.00% |
| 151  | https://9takes.com/enneagram-corner/enneagram-team-dynamics                                                       |      0 |         740 | 0.00% |
| 152  | https://9takes.com/personality-analysis/Miles-Teller                                                              |      3 |         737 | 0.41% |
| 153  | https://9takes.com/personality-analysis/type/5                                                                    |      1 |         731 | 0.14% |
| 154  | https://9takes.com/personality-analysis/Robert-Greene                                                             |      5 |         711 | 0.70% |
| 155  | https://9takes.com/enneagram-corner/how-to-apologize-like-a-pro                                                   |     19 |         689 | 2.76% |
| 156  | https://9takes.com/personality-analysis/Harry-Styles                                                              |      0 |         689 | 0.00% |
| 157  | https://9takes.com/personality-analysis/Kanye                                                                     |      3 |         674 | 0.45% |
| 158  | https://9takes.com/enneagram-corner/enneagram-type-1                                                              |      4 |         671 | 0.60% |
| 159  | https://9takes.com/enneagram-corner/enneagram-science-mental-health                                               |      2 |         662 | 0.30% |
| 160  | https://9takes.com/personality-analysis/Jon-Stewart                                                               |      3 |         660 | 0.45% |
| 161  | https://9takes.com/enneagram-corner/enneagram-type-7                                                              |     12 |         652 | 1.84% |
| 162  | https://9takes.com/personality-analysis/Alex-Cooper                                                               |      4 |         639 | 0.63% |
| 163  | https://9takes.com/personality-analysis/Vladimir-Putin                                                            |      1 |         639 | 0.16% |
| 164  | https://9takes.com/personality-analysis/type/7                                                                    |      1 |         639 | 0.16% |
| 165  | https://9takes.com/personality-analysis/Barack-Obama                                                              |      2 |         634 | 0.32% |
| 166  | https://9takes.com/personality-analysis/Jack-Dorsey                                                               |      1 |         604 | 0.17% |
| 167  | https://9takes.com/personality-analysis/Tim-Dillon                                                                |      0 |         598 | 0.00% |
| 168  | https://9takes.com/personality-analysis/Alexandria-Ocasio-Cortez                                                  |      3 |         594 | 0.51% |
| 169  | https://9takes.com/personality-analysis/Natalie-Portman                                                           |      0 |         594 | 0.00% |
| 170  | https://9takes.com/enneagram-corner/enneagram-workplace-team-building                                             |      1 |         593 | 0.17% |
| 171  | https://9takes.com/enneagram-corner/how-each-enneagram-type-manipulates                                           |     11 |         565 | 1.95% |
| 172  | https://9takes.com/enneagram-corner/enneagram-communication-styles                                                |     10 |         561 | 1.78% |
| 173  | https://9takes.com/personality-analysis/Mikey-Madison                                                             |      3 |         559 | 0.54% |
| 174  | https://9takes.com/personality-analysis                                                                           |      1 |         535 | 0.19% |
| 175  | https://9takes.com/personality-analysis/Elton-John                                                                |      2 |         521 | 0.38% |
| 176  | https://9takes.com/personality-analysis/Logan-Paul                                                                |      3 |         516 | 0.58% |
| 177  | https://9takes.com/enneagram-corner/enneagram-personal-growth                                                     |      1 |         508 | 0.20% |
| 178  | https://9takes.com/personality-analysis/Hasan-Piker                                                               |      2 |         507 | 0.39% |
| 179  | https://9takes.com/personality-analysis/Alex-Hormozi                                                              |      3 |         486 | 0.62% |
| 180  | https://9takes.com/personality-analysis/Donald-Trump                                                              |      9 |         481 | 1.87% |
| 181  | https://9takes.com/personality-analysis/Emma-Chamberlain                                                          |      3 |         476 | 0.63% |
| 182  | https://9takes.com/personality-analysis/Rooney-Mara                                                               |      8 |         476 | 1.68% |
| 183  | https://9takes.com/enneagram-corner/enneagram-types-on-a-first-date                                               |     11 |         475 | 2.32% |
| 184  | https://9takes.com/personality-analysis/Trevor-Noah                                                               |      4 |         464 | 0.86% |
| 185  | https://9takes.com/personality-analysis/type/3                                                                    |      0 |         457 | 0.00% |
| 186  | https://9takes.com/personality-analysis/Zoe-Kravitz                                                               |      3 |         455 | 0.66% |
| 187  | https://9takes.com/personality-analysis/Matthew-McConaughey                                                       |      2 |         442 | 0.45% |
| 188  | https://9takes.com/personality-analysis/Frida-Kahlo                                                               |      2 |         441 | 0.45% |
| 189  | https://9takes.com/enneagram-corner/enneagram-communication-tips                                                  |      3 |         436 | 0.69% |
| 190  | https://9takes.com/enneagram-corner/enneagram-connecting-lines                                                    |      1 |         433 | 0.23% |
| 191  | https://9takes.com/enneagram-corner/enneagram-crisis-management-guide                                             |      2 |         426 | 0.47% |
| 192  | https://9takes.com/enneagram-corner/relationship-communication-guide                                              |      0 |         411 | 0.00% |
| 193  | https://9takes.com/enneagram-corner/enneagram-types-being-ghosted                                                 |     11 |         406 | 2.71% |
| 194  | https://9takes.com/personality-analysis/Cristiano-Ronaldo                                                         |      0 |         404 | 0.00% |
| 195  | https://9takes.com/enneagram-corner/enneagram-dating-guide-for-men                                                |     11 |         381 | 2.89% |
| 196  | https://9takes.com/personality-analysis/Ellen-Degeneres                                                           |      1 |         373 | 0.27% |
| 197  | https://9takes.com/personality-analysis/Demi-Lovato                                                               |      3 |         372 | 0.81% |
| 198  | https://9takes.com/personality-analysis/Jason-Calacanis                                                           |      0 |         364 | 0.00% |
| 199  | https://9takes.com/enneagram-corner/enneagram-childhood-stereotypes                                               |      3 |         363 | 0.83% |
| 200  | https://9takes.com/enneagram-corner/enneagram-types-at-party                                                      |     17 |         361 | 4.71% |
| 201  | https://9takes.com/enneagram-corner/enneagram-stress-number                                                       |      2 |         357 | 0.56% |
| 202  | https://9takes.com/personality-analysis/Kamala-Harris                                                             |      1 |         357 | 0.28% |
| 203  | https://9takes.com/enneagram-corner/love-languages-and-enneagram-types                                            |      1 |         351 | 0.28% |
| 204  | https://9takes.com/personality-analysis/Shia-LaBeouf                                                              |      2 |         349 | 0.57% |
| 205  | https://9takes.com/personality-analysis/Amber-Heard                                                               |      0 |         342 | 0.00% |
| 206  | https://9takes.com/personality-analysis/Doechii                                                                   |      1 |         341 | 0.29% |
| 207  | https://9takes.com/personality-analysis/Pete-Davidson                                                             |      4 |         341 | 1.17% |
| 208  | https://9takes.com/personality-analysis/Bad-Bunny                                                                 |      0 |         326 | 0.00% |
| 209  | https://9takes.com/enneagram-corner/enneagram-influences                                                          |      1 |         315 | 0.32% |
| 210  | https://9takes.com/personality-analysis/George-RR-Martin                                                          |      0 |         303 | 0.00% |
| 211  | https://9takes.com/personality-analysis/Hillary-Clinton                                                           |      0 |         303 | 0.00% |
| 212  | https://9takes.com/enneagram-corner/enneagram-compatibility-guide                                                 |      2 |         292 | 0.68% |
| 213  | https://9takes.com/how-to-guides/5-tough-conversations-you-need-to-have-with-your-partner                         |      1 |         288 | 0.35% |
| 214  | https://9takes.com/personality-analysis/George-W-Bush                                                             |      1 |         277 | 0.36% |
| 215  | https://9takes.com/personality-analysis/George-H-W-Bush                                                           |      1 |         269 | 0.37% |
| 216  | https://9takes.com/enneagram-corner/beginners-guide-to-determining-your-enneagram-type                            |      3 |         265 | 1.13% |
| 217  | https://9takes.com/personality-analysis/Jerad-Leto                                                                |      3 |         263 | 1.14% |
| 218  | https://9takes.com/enneagram-corner/why-you-cant-stop-overthinking-enneagram                                      |      3 |         257 | 1.17% |
| 219  | https://9takes.com/enneagram-corner/how-each-enneagram-type-self-sabotages-success                                |      1 |         251 | 0.40% |
| 220  | https://9takes.com/personality-analysis/Casey-Neistat                                                             |      1 |         251 | 0.40% |
| 221  | https://9takes.com/enneagram-corner/enneagram-leadership                                                          |      1 |         246 | 0.41% |
| 222  | https://9takes.com/enneagram-corner/first-impression-cheat-sheet                                                  |      3 |         242 | 1.24% |
| 223  | https://9takes.com/personality-analysis/Emily-Ratajkowski                                                         |      1 |         235 | 0.43% |
| 224  | https://9takes.com/personality-analysis/Joe-Biden                                                                 |      1 |         235 | 0.43% |
| 225  | https://9takes.com/personality-analysis/Saoirse-Ronan                                                             |      0 |         232 | 0.00% |
| 226  | https://9takes.com/personality-analysis/Mr-Rogers                                                                 |      0 |         225 | 0.00% |
| 227  | https://9takes.com/personality-analysis/Nancy-Pelosi                                                              |      1 |         221 | 0.45% |
| 228  | https://9takes.com/enneagram-corner/red-flags-dating-each-enneagram-type                                          |      1 |         220 | 0.45% |
| 229  | https://9takes.com/personality-analysis/Amy-Poehler                                                               |      1 |         217 | 0.46% |
| 230  | https://9takes.com/personality-analysis/Jimmy-Carter                                                              |      1 |         211 | 0.47% |
| 231  | https://9takes.com/personality-analysis/David-Dobrik                                                              |      1 |         210 | 0.48% |
| 232  | https://9takes.com/enneagram-corner/mental-health/enneagram-trauma-response-guide                                 |      2 |         209 | 0.96% |
| 233  | https://9takes.com/enneagram-corner/neurodiversity-vs-personality                                                 |     15 |         194 | 7.73% |
| 234  | https://9takes.com/how-to-guides/dating-dynamics-by-enneagram-type                                                |      1 |         194 | 0.52% |
| 235  | https://9takes.com/personality-analysis/Chelsea-Handler                                                           |      0 |         193 | 0.00% |
| 236  | https://9takes.com/personality-analysis/Ruth-Bader-Ginsburg                                                       |      0 |         193 | 0.00% |
| 237  | https://9takes.com/personality-analysis/Tim-Cook                                                                  |      0 |         193 | 0.00% |
| 238  | https://9takes.com/enneagram-corner/enneagram-anxiety-management-guide                                            |      1 |         192 | 0.52% |
| 239  | https://9takes.com/enneagram-corner/mental-health/enneagram-workplace-mental-health                               |      1 |         178 | 0.56% |
| 240  | https://9takes.com/personality-analysis/Greta-Thunberg                                                            |      3 |         171 | 1.75% |
| 241  | https://9takes.com/how-to-guides/using-the-enneagram-for-self-development                                         |      0 |         166 | 0.00% |
| 242  | https://9takes.com/personality-analysis/Addison-Rae                                                               |      0 |         166 | 0.00% |
| 243  | https://9takes.com/personality-analysis/Bernie-Sanders                                                            |      0 |         165 | 0.00% |
| 244  | https://9takes.com/personality-analysis/Alexis-Bledel                                                             |      1 |         159 | 0.63% |
| 245  | https://9takes.com/personality-analysis/Jacob-Elordi                                                              |      3 |         157 | 1.91% |
| 246  | https://9takes.com/personality-analysis/Malcolm-X                                                                 |      0 |         154 | 0.00% |
| 247  | https://9takes.com/enneagram-corner/how-each-enneagram-flexes                                                     |      3 |         150 | 2.00% |
| 248  | https://9takes.com/personality-analysis/Tucker-Carlson                                                            |      2 |         150 | 1.33% |
| 249  | https://9takes.com/enneagram-corner                                                                               |      5 |         148 | 3.38% |
| 250  | https://9takes.com/personality-analysis/Jack-Black                                                                |      2 |         148 | 1.35% |
| 251  | https://9takes.com/enneagram-corner/philosophy-psychology-and-the-enneagram                                       |      1 |         145 | 0.69% |
| 252  | https://9takes.com/personality-analysis/Abraham-Lincoln                                                           |      1 |         144 | 0.69% |
| 253  | https://9takes.com/personality-analysis/Leila-Hormozi                                                             |      0 |         144 | 0.00% |
| 254  | https://9takes.com/personality-analysis/Theo-Von                                                                  |      0 |         144 | 0.00% |
| 255  | https://9takes.com/enneagram-corner/why-dating-apps-are-harder-for-certain-personality-types                      |      0 |         136 | 0.00% |
| 256  | https://9takes.com/personality-analysis/Sundar-Pichai                                                             |      0 |         136 | 0.00% |
| 257  | https://9takes.com/enneagram-corner/oversharing-psychology-shame-boundaries                                       |      0 |         135 | 0.00% |
| 258  | https://9takes.com/personality-analysis/xQc                                                                       |      0 |         135 | 0.00% |
| 259  | https://9takes.com/how-to-guides/definitive-guide-to-relationship-conflict-part-1                                 |      0 |         130 | 0.00% |
| 260  | https://9takes.com/personality-analysis/Bella-Hadid                                                               |      0 |         122 | 0.00% |
| 261  | https://9takes.com/personality-analysis/Bobbi-Althoff                                                             |      1 |         122 | 0.82% |
| 262  | https://9takes.com/personality-analysis/Andrew-Tate                                                               |      0 |         112 | 0.00% |
| 263  | https://9takes.com/enneagram-corner/enneagram-criticisms                                                          |      1 |         111 | 0.90% |
| 264  | https://9takes.com/enneagram-corner/enneagram-trauma-response-guide                                               |      0 |         111 | 0.00% |
| 265  | https://9takes.com/personality-analysis/Paul-Graham                                                               |      0 |         111 | 0.00% |
| 266  | https://9takes.com/enneagram-corner/enneagram-self-development                                                    |      0 |         110 | 0.00% |
| 267  | https://9takes.com/personality-analysis/Charli-D'Amelio                                                           |      1 |         110 | 0.91% |
| 268  | https://9takes.com/enneagram-corner/how-each-enneagram-type-unwinds                                               |      1 |         108 | 0.93% |
| 269  | https://9takes.com/personality-analysis/Hozier                                                                    |      0 |         108 | 0.00% |
| 270  | https://9takes.com/personality-analysis/Ashby                                                                     |      1 |         107 | 0.93% |
| 271  | https://9takes.com/enneagram-corner/how-to-navigate-early-relationship-stages                                     |      3 |         106 | 2.83% |
| 272  | https://9takes.com/blog                                                                                           |      2 |         105 | 1.90% |
| 273  | https://9takes.com/enneagram-corner/enneagram-communication-guide                                                 |      0 |         105 | 0.00% |
| 274  | https://9takes.com/personality-analysis/Shane-Gillis                                                              |      0 |         105 | 0.00% |
| 275  | https://9takes.com/personality-analysis/Michael-B-Jordan                                                          |      0 |         104 | 0.00% |
| 276  | https://9takes.com/personality-analysis/Princess-Diana                                                            |      1 |         104 | 0.96% |
| 277  | https://9takes.com/personality-analysis/Dave-Chappelle                                                            |      0 |         103 | 0.00% |
| 278  | https://9takes.com/personality-analysis/Tim-Ferriss                                                               |      0 |         103 | 0.00% |
| 279  | https://9takes.com/personality-analysis/Doja-Cat                                                                  |      1 |         100 | 1.00% |
| 280  | https://9takes.com/enneagram-corner/enneagram-party-planner                                                       |      3 |          96 | 3.12% |
| 281  | https://9takes.com/enneagram-corner/personality-maxing                                                            |      1 |          93 | 1.08% |
| 282  | https://9takes.com/personality-analysis/Andrew-Huberman                                                           |      0 |          93 | 0.00% |
| 283  | https://9takes.com/personality-analysis/J.K.-Rowling                                                              |      0 |          92 | 0.00% |
| 284  | https://9takes.com/personality-analysis/PewDiePie                                                                 |      0 |          90 | 0.00% |
| 285  | https://9takes.com/enneagram-corner/anxiety-and-enneagram-types-guide                                             |      0 |          89 | 0.00% |
| 286  | https://9takes.com/enneagram-corner/enneagram-parenting-mental-health                                             |      0 |          86 | 0.00% |
| 287  | https://9takes.com/enneagram-corner/90-day-personality-maxing-blueprint                                           |      1 |          85 | 1.18% |
| 288  | https://9takes.com/pop-culture/epstein-psychology-part-2                                                          |      1 |          85 | 1.18% |
| 289  | https://9takes.com/about                                                                                          |      1 |          83 | 1.20% |
| 290  | https://9takes.com/personality-analysis/Jared-Leto                                                                |      0 |          83 | 0.00% |
| 291  | https://9takes.com/personality-analysis/Justin-Trudeau                                                            |      1 |          81 | 1.23% |
| 292  | https://9takes.com/enneagram-corner/subtopic/situational                                                          |      1 |          80 | 1.25% |
| 293  | https://9takes.com/personality-analysis/Tony-Robbins                                                              |      0 |          79 | 0.00% |
| 294  | https://9takes.com/how-to-guides/ultimate-guide-to-active-listening                                               |      0 |          77 | 0.00% |
| 295  | https://9takes.com/personality-analysis/Nancy-Reagan                                                              |      0 |          77 | 0.00% |
| 296  | https://9takes.com/personality-analysis/Post-Malone                                                               |      0 |          77 | 0.00% |
| 297  | https://9takes.com/personality-analysis/David-Sacks                                                               |      0 |          76 | 0.00% |
| 298  | https://9takes.com/enneagram-corner/subtopic/relationships                                                        |      0 |          74 | 0.00% |
| 299  | https://9takes.com/personality-analysis/Malcolm-Gladwell                                                          |      0 |          74 | 0.00% |
| 300  | https://9takes.com/personality-analysis/Pokimane                                                                  |      0 |          74 | 0.00% |
| 301  | https://9takes.com/personality-analysis/Tim-Robinson                                                              |      0 |          74 | 0.00% |
| 302  | https://9takes.com/personality-analysis/Paul-Rudd                                                                 |      0 |          73 | 0.00% |
| 303  | https://9takes.com/personality-analysis/Pedro-Pascal                                                              |      0 |          73 | 0.00% |
| 304  | https://9takes.com/personality-analysis/Steven-Bartlett                                                           |      0 |          73 | 0.00% |
| 305  | https://9takes.com/questions                                                                                      |      0 |          71 | 0.00% |
| 306  | https://9takes.com/personality-analysis/Andrew-Callaghan                                                          |      0 |          67 | 0.00% |
| 307  | https://9takes.com/personality-analysis/Gary-Vee                                                                  |      0 |          67 | 0.00% |
| 308  | https://9takes.com/how-to-guides/definitive-guide-to-relationship-conflict-part-2                                 |      0 |          66 | 0.00% |
| 309  | https://9takes.com/personality-analysis/Alix-Earle                                                                |      2 |          61 | 3.28% |
| 310  | https://9takes.com/enneagram-corner/subtopic/nine-types                                                           |      1 |          60 | 1.67% |
| 311  | https://9takes.com/personality-analysis/Jocko-Willink                                                             |      0 |          60 | 0.00% |
| 312  | https://9takes.com/personality-analysis/Reed-Hastings                                                             |      0 |          60 | 0.00% |
| 313  | https://9takes.com/enneagram-corner/first-impression-enneagram-playbook                                           |      0 |          56 | 0.00% |
| 314  | https://9takes.com/enneagram-corner/enneagram-team-diversity                                                      |      0 |          50 | 0.00% |
| 315  | https://9takes.com/personality-analysis/Bella-Poarch                                                              |      0 |          48 | 0.00% |
| 316  | https://9takes.com/enneagram-corner/enneagram-concepts                                                            |      0 |          46 | 0.00% |
| 317  | https://9takes.com/enneagram-corner/enneagram-parenting-styles                                                    |      0 |          40 | 0.00% |
| 318  | https://9takes.com/community                                                                                      |      0 |          39 | 0.00% |
| 319  | https://9takes.com/enneagram-corner/why-therapy-doesnt-work-the-same-for-every-type                               |      0 |          38 | 0.00% |
| 320  | https://9takes.com/personality-analysis/John-Coogan                                                               |      0 |          36 | 0.00% |
| 321  | https://9takes.com/personality-analysis/Brittany-Broski                                                           |      0 |          35 | 0.00% |
| 322  | https://9takes.com/personality-analysis/James-Charles                                                             |      0 |          34 | 0.00% |
| 323  | https://9takes.com/enneagram-corner/enneagram-faqs                                                                |      0 |          33 | 0.00% |
| 324  | https://9takes.com/personality-analysis/Dixie-D'Amelio                                                            |      0 |          32 | 0.00% |
| 325  | https://9takes.com/personality-analysis/Shawn-Ryan                                                                |      1 |          32 | 3.12% |
| 326  | https://9takes.com/enneagram-corner/subtopic/development                                                          |      1 |          30 | 3.33% |
| 327  | https://9takes.com/community/why-im-selective-sharing-enneagram                                                   |      0 |          28 | 0.00% |
| 328  | https://9takes.com/community/consensus-on-human-nature                                                            |      0 |          26 | 0.00% |
| 329  | https://www.9takes.com/personality-analysis/IShowSpeed                                                            |      0 |          23 | 0.00% |
| 330  | https://9takes.com/enneagram-corner/enneagram-dating-guide-for-women                                              |      0 |          22 | 0.00% |
| 331  | https://9takes.com/pop-culture                                                                                    |      0 |          22 | 0.00% |
| 332  | https://9takes.com/pop-culture/parasocial-relationships-enneagram-type                                            |      1 |          22 | 4.55% |
| 333  | https://9takes.com/enneagram-corner/enneagram-books-websites-podcasts                                             |      1 |          21 | 4.76% |
| 334  | https://9takes.com/community/mbti-vs-enneagram                                                                    |      0 |          20 | 0.00% |
| 335  | https://9takes.com/personality-analysis/ariana-grande                                                             |      0 |          20 | 0.00% |
| 336  | https://9takes.com/personality-analysis/Andrew-Schulz                                                             |      0 |          19 | 0.00% |
| 337  | https://9takes.com/personality-analysis/Dolly-Parton                                                              |      0 |          19 | 0.00% |
| 338  | https://9takes.com/how-to-guides/how-to-psychoanalyze-people                                                      |      0 |          18 | 0.00% |
| 339  | https://9takes.com/pop-culture/incel-blackpill-radicalization-enneagram                                           |      0 |          18 | 0.00% |
| 340  | https://9takes.com/personality-analysis/Ali-Abdaal                                                                |      0 |          16 | 0.00% |
| 341  | https://9takes.com/pop-culture/reddit-moderators-type-1-internet                                                  |      0 |          16 | 0.00% |
| 342  | https://9takes.com/book-session                                                                                   |      0 |          14 | 0.00% |
| 343  | https://9takes.com/types/8s/IShowSpeed.webp                                                                       |      0 |          14 | 0.00% |
| 344  | https://9takes.com/enneagram-corner/subtopic/overview                                                             |      0 |          13 | 0.00% |
| 345  | https://9takes.com/how-to-guides/productivity-systems-by-enneagram-type                                           |      1 |          13 | 7.69% |
| 346  | https://9takes.com/enneagram-corner/enneagram-therapy-guide                                                       |      0 |          11 | 0.00% |
| 347  | https://9takes.com/how-to-guides/guide-to-fighting-depression                                                     |      0 |          11 | 0.00% |
| 348  | https://9takes.com/personality-analysis/Benson-Boone                                                              |      0 |          11 | 0.00% |
| 349  | https://9takes.com/personality-analysis/elon-musk-why-elon-musk-cant-stop-inside-the-psychology-driving-his-chaos |      0 |          11 | 0.00% |
| 350  | https://9takes.com/enneagram-corner/situations-change-emotions-dont                                               |      0 |          10 | 0.00% |
| 351  | https://9takes.com/how-to-guides                                                                                  |      0 |           9 | 0.00% |
| 352  | https://9takes.com/community/reddit-deep-connections-limitations                                                  |      0 |           8 | 0.00% |
| 353  | https://9takes.com/community/what-winning-online-arguments-looks-like                                             |      0 |           6 | 0.00% |
| 354  | https://9takes.com/enneagram-corner/subtopic/resources                                                            |      0 |           5 | 0.00% |
| 355  | https://9takes.com/how-to-guides/the-crash-course-on-emotions-that-we-missed-in-kindergarten                      |      0 |           4 | 0.00% |
| 356  | https://9takes.com/types/4s/Johnny-Depp.webp                                                                      |      0 |           4 | 0.00% |
| 357  | https://9takes.com/types/6s/Aubrey-Plaza.webp                                                                     |      0 |           4 | 0.00% |
| 358  | https://9takes.com/enneagram-corner/how-type-8-challengers-actually-succeed                                       |      0 |           3 | 0.00% |
| 359  | https://9takes.com/personality-analysis/Ben-Shapiro                                                               |      0 |           3 | 0.00% |
| 360  | https://9takes.com/types/8s/Druski.webp                                                                           |      0 |           3 | 0.00% |
| 361  | https://9takes.com/enneagram-corner/mental-health/enneagram-crisis-management-guide                               |      0 |           2 | 0.00% |
| 362  | https://9takes.com/enneagram-corner/shadow-work-by-enneagram-type                                                 |      0 |           2 | 0.00% |
| 363  | https://9takes.com/enneagram-corner/why-the-next-thing-wont-fix-it-type-7                                         |      0 |           2 | 0.00% |
| 364  | https://9takes.com/personality-analysis/Dax-Shepard                                                               |      0 |           2 | 0.00% |
| 365  | https://9takes.com/personality-analysis/Gwyneth-Paltrow/                                                          |      0 |           2 | 0.00% |
| 366  | https://9takes.com/types/5s/Lex-Fridman.webp                                                                      |      0 |           2 | 0.00% |
| 367  | https://9takes.com/types/7s/s-Hugh-Jackman.webp                                                                   |      0 |           2 | 0.00% |
| 368  | https://9takes.com/types/9s/s-Brad-Pitt.webp                                                                      |      0 |           2 | 0.00% |
| 369  | https://www.9takes.com/enneagram-corner/enneagram-and-mental-illness                                              |      0 |           2 | 0.00% |
| 370  | https://9takes.com/enneagram-corner/mental-health/enneagram-anxiety-complete-guide                                |      0 |           1 | 0.00% |
| 371  | https://9takes.com/how-to-guides/definitive-guide-to-self-efficacy                                                |      0 |           1 | 0.00% |
| 372  | https://9takes.com/personality-analysis/Emma-Watson/                                                              |      0 |           1 | 0.00% |
| 373  | https://9takes.com/personality-analysis/dua-lipa                                                                  |      0 |           1 | 0.00% |
| 374  | https://9takes.com/types/1s/Jeff-Bezos.webp                                                                       |      0 |           1 | 0.00% |
| 375  | https://9takes.com/types/1s/s-Anne-Hathaway.webp                                                                  |      0 |           1 | 0.00% |
| 376  | https://9takes.com/types/2s/Jennifer-Garner.webp                                                                  |      0 |           1 | 0.00% |
| 377  | https://9takes.com/types/2s/Meryl-Streep.webp                                                                     |      0 |           1 | 0.00% |
| 378  | https://9takes.com/types/2s/Oprah-Winfrey.webp                                                                    |      0 |           1 | 0.00% |
| 379  | https://9takes.com/types/3s/Adin-Ross.webp                                                                        |      0 |           1 | 0.00% |
| 380  | https://9takes.com/types/3s/Ariana-Grande.webp                                                                    |      0 |           1 | 0.00% |
| 381  | https://9takes.com/types/3s/Hailey-Bieber.webp                                                                    |      0 |           1 | 0.00% |
| 382  | https://9takes.com/types/3s/s-Adin-Ross.webp                                                                      |      0 |           1 | 0.00% |
| 383  | https://9takes.com/types/4s/Joaquin-Phoenix.webp                                                                  |      0 |           1 | 0.00% |
| 384  | https://9takes.com/types/4s/Lana-Del-Rey.webp                                                                     |      0 |           1 | 0.00% |
| 385  | https://9takes.com/types/4s/Madison-Beer.webp                                                                     |      0 |           1 | 0.00% |
| 386  | https://9takes.com/types/4s/s-Casey-Neistat.webp                                                                  |      0 |           1 | 0.00% |
| 387  | https://9takes.com/types/4s/s-Lana-Del-Rey.webp                                                                   |      0 |           1 | 0.00% |
| 388  | https://9takes.com/types/4s/s-Nicole-Kidman.webp                                                                  |      0 |           1 | 0.00% |
| 389  | https://9takes.com/types/5s/Cillian-Murphy.webp                                                                   |      0 |           1 | 0.00% |
| 390  | https://9takes.com/types/5s/Elon-Musk.webp                                                                        |      0 |           1 | 0.00% |
| 391  | https://9takes.com/types/6s/s-Tom-Hanks.webp                                                                      |      0 |           1 | 0.00% |
| 392  | https://9takes.com/types/7s/Grimes.webp                                                                           |      0 |           1 | 0.00% |
| 393  | https://9takes.com/types/7s/John-F-Kennedy.webp                                                                   |      0 |           1 | 0.00% |
| 394  | https://9takes.com/types/7s/Palmer-Luckey.webp                                                                    |      0 |           1 | 0.00% |
| 395  | https://9takes.com/types/7s/s-Alex-Cooper.webp                                                                    |      0 |           1 | 0.00% |
| 396  | https://9takes.com/types/7s/s-Kevin-Hart.webp                                                                     |      0 |           1 | 0.00% |
| 397  | https://9takes.com/types/8s/Mr-Beast.webp                                                                         |      0 |           1 | 0.00% |
| 398  | https://9takes.com/types/8s/Rihanna.webp                                                                          |      0 |           1 | 0.00% |
| 399  | https://9takes.com/types/8s/Tom-Hardy.webp                                                                        |      0 |           1 | 0.00% |
| 400  | https://9takes.com/types/8s/s-IShowSpeed.webp                                                                     |      0 |           1 | 0.00% |
| 401  | https://www.9takes.com/personality-analysis/Dave-Portnoy                                                          |      0 |           1 | 0.00% |
| 402  | https://www.9takes.com/personality-analysis/Timothee-Chalamet                                                     |      0 |           1 | 0.00% |
