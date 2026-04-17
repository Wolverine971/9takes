<!-- docs/research/enneagram-public-distributions.md -->

# Public Enneagram Type Distribution — Research Brief

**Created:** 2026-04-17
**Purpose:** Source-of-truth for `src/lib/data/corpus-stats-external.json` feeding the `/corpus-stats` comparison section on 9takes.

---

## Summary of Findings

**What's actually available:** Public, complete per-type distributions (9 numbers summing to ~100%) are thin on the ground. Only one source — **enneagram-personality.com** (n ≈ 200,000, self-selected online test) — publishes a full, verifiable table with sample size, date, and methodology. Truity publishes large-n survey data (54,000 – 88,000 test-takers) but only in fragments across blog posts: they disclose Type 8 ≈ 15%, Type 9 ≈ 13%, Type 7 ≈ 9%, Type 5 ≈ 10%, and general ranges for the rest, but they have never (as of this research pass) published a single consolidated per-type table. Academic studies (Wagner 1981, Newgent 2004, Sutton 2007, Bartram & Brown 2005) are about **validity/reliability and Big-Five correlations**, not population distributions — they report sample sizes but not type-share tables.

**Where the research is weakest:** Integrative9/iEQ9, often cited as the most methodologically rigorous Enneagram assessment (adaptive questionnaire, 5,910-person validation study, 350,000+ administrations), does **not** publish a per-type global distribution in any public-facing URL verified during this pass. Their distribution data appears to live in a paid "Statistical Manual" referenced by their validity white paper. The Enneagram Institute (Riso-Hudson) similarly does not publish population percentages — they explicitly decline to, and their community often asserts a theoretical "11.11% equal distribution" baseline rather than empirical data.

**Headline numbers where sources actually agree:**

- **Type 9 is consistently on the high end** across sources (Truity: 13%; enneagram-personality.com: 16.5%). Both data sets are self-selected online test-takers.
- **Type 5 is consistently on the low end** (enneagram-personality.com: 4.6%; Truity describes it as "as low as 6 percent" and among the rarest).
- **Type 7 disagrees sharply:** Truity says Type 7 is the **rarest** at 9% while enneagram-personality.com says Type 7 is among the **most common** at 13.6% — a very likely artifact of how their tests are worded and who takes them.

---

## Conflicts & Caveats

- **Type 7 rarity/commonness contradiction.** Truity (n=54,000+) explicitly calls Type 7 the rarest at 9%. Enneagram-personality.com (n=200,000) ranks Type 7 as the third-most-common at 13.6%. This is the single biggest divergence in the data and cannot be reconciled without inspecting each test's items for type-bias.
- **Type 8 gender divergence.** Truity reports Type 8 at ~15% overall but 18% among men (vs. ~12% among women). Any single population number hides this.
- **"Equal distribution" myth.** Community lore (including statements in the Enneagram Institute's orbit) often claims each of the 9 types represents ~11.11% of the general population. No primary empirical source supports this; it's a theoretical prior, not a finding.
- **Self-selection bias is universal.** Every large-n source is online test-takers who found an Enneagram site and opted in. None is representative of the general population. The 9takes corpus of 293 public figures is third-party-typed celebrities — a different bias axis entirely (high-achievement, high-visibility, historically male-skewed), which is exactly why the comparison is interesting.
- **HiPeople reuses enneagram-personality.com data without citation.** The 189,957-sample figure circulating on HiPeople, Quora, Pinterest, etc. is the same data set that enneagram-personality.com publishes (formerly at n=189,957, now updated to n=200,000 in April 2026). Do not treat HiPeople as an independent source.
- **Academic papers report correlations, not distributions.** Wagner 1981 (n=390), Newgent 2004 (RHETI reliability), Sutton 2007 (n=416), and Bartram & Brown 2005 (n=241) all test the Enneagram's validity and overlap with Big Five — none publishes a headline "X% of people are Type N" table. They are useful for _credibility context_, not for the comparison chart data.
- **Integrative9's 5,910-person validation sample.** Their 2019 validity paper does break out factor loadings and reliability metrics by type, but it does not publish what fraction of the 5,910 were each type. Treat as "sample size acknowledged, distribution not disclosed."

---

## Sources

### Source 1: enneagram-personality.com — Population distribution page

- **ID:** `enneagram_personality_com`
- **URL:** https://enneagram-personality.com/en/test/stats/1-enneagram-population-distribution
- **Methodology:** Online self-administered Enneagram test on enneagram-personality.com. Results are filtered for "unique IP filtering, anti-bot filters, and a sufficiently high primary type score (>6% above the second-highest type)."
- **Sample size (n):** 200,000 (100,000 men + 100,000 women)
- **Date range:** Test-takers between 2025-01-20 and 2026-04-04. Page last updated 2026-04-07.
- **Per-type shares:**

  | Type | Share  | Notes                           |
  | ---- | ------ | ------------------------------- |
  | 1    | 11.5%  |                                 |
  | 2    | 11.5%  |                                 |
  | 3    | 10.0%  |                                 |
  | 4    | 12.2%  |                                 |
  | 5    | 4.6%   | Rarest                          |
  | 6    | 13.8%  | 2nd most common                 |
  | 7    | 13.6%  | Contradicts Truity (Truity: 9%) |
  | 8    | 6.3%   | 2nd rarest                      |
  | 9    | 16.5%  | Most common                     |
  |      | 100.0% |                                 |

- **Exact quote:** "Sample: 100,000 men and 100,000 women who took this Enneagram test between 01/20/2025 and 04/04/2026." Filtering is described: "unique IP filtering, anti-bot filters, and a sufficiently high primary type score (>6% above the second-highest type)."
- **Notes:** This is the only source verified in this pass with a **complete per-type table + sample size + date + methodology** all on one public URL. It is self-selected online test-takers (same bias class as Truity), not a representative general-population sample. Also note: widely re-cited by secondary sites (HiPeople, Quora, Pinterest) usually with the older n=189,957 figure and no attribution.

### Source 2: Truity — Multiple blog posts (composite)

- **ID:** `truity`
- **URL (primary):** https://www.truity.com/blog/what-most-common-enneagram-type
- **URL (secondary):** https://www.truity.com/blog/what-rarest-enneagram-type
- **URL (88k relationship study):** https://www.truity.com/blog/enneagram-and-love-what-we-learned-surveying-88000-enneagram-test-takers
- **Methodology:** Free online Truity Enneagram Personality Test; respondents are self-selected Truity users.
- **Sample size (n):** 54,000+ for the most-common/rarest-type analysis; 88,000 for the 2021 relationship survey.
- **Date range:** Most-common / rarest blog posts dated October 2022; relationship survey dated January 2021.
- **Per-type shares (partial — Truity has NOT published a consolidated table):**

  | Type | Share                    | Source quote                                                                                      |
  | ---- | ------------------------ | ------------------------------------------------------------------------------------------------- |
  | 1    | not disclosed            | —                                                                                                 |
  | 2    | not disclosed            | —                                                                                                 |
  | 3    | not disclosed            | —                                                                                                 |
  | 4    | not disclosed            | —                                                                                                 |
  | 5    | ~10% (to "as low as 6%") | "population results measuring at around 10 percent, to as low as 6 percent on some online forums" |
  | 6    | not disclosed            | —                                                                                                 |
  | 7    | 9% (rarest)              | "Type 7 represented 9 percent of the population, making it the least common"                      |
  | 8    | ~15% (most common)       | "Type 8 represents about 15 percent of the population"; 18% men, ~12% women                       |
  | 9    | ~13%                     | "13% of the population, with 14% of women and 12% of men"                                         |

- **Exact quotes:** "In Truity's survey of over 54,000 people, Type 7 represented 9 percent of the population, making it the least common of the nine types." / "The Enneagram Type 8 represents about 15 percent of the population, according to a survey conducted by Truity." / Relationship study: "Sample size: 88,000 test-takers" (Jan 2021).
- **Notes:** Truity's numbers sum to approximately 47% for the 4 disclosed types (9 + 10 + 15 + 13), leaving 53% to be distributed across the 5 undisclosed types — so each of types 1, 2, 3, 4, 6 would average ~10.6%. Truity's "rare types reflect about 10 to 12 percent of the population, while more common ones weigh in a bit higher" statement is consistent with this. **For the comparison table, Truity should be used as a sanity check (Type 7, 8, 9, and 5 anchors) rather than a full 9-type source.**

### Source 3: Integrative9 / iEQ9 — Validity white paper

- **ID:** `integrative9`
- **URL:** https://www.integrative9.com/media/articles/35/testing-the-ieq9-reliability-and-validity
- **Methodology:** iEQ9 adaptive Enneagram questionnaire administered to workplace samples across Client Services, Medical, Insurance, Financial Services, and Technical Services.
- **Sample size (n):** 5,910 in the validation study; ~350,000 cumulative iEQ9 administrations since 2011.
- **Date range:** Validation study commissioned June 2019.
- **Per-type shares:** **Not disclosed on any public URL verified.** The white paper contains Cronbach Alpha reliability tables by type, factor loadings, and inter-item correlations, but no "X% of the 5,910 are Type N" table.
- **Exact quote (sample size):** "Our study drew on a sample of 5910 people across various organisations and industries to investigate the validity and reliability of the iEQ9 Questionnaire."
- **Notes:** iEQ9 is widely cited as the most methodologically rigorous Enneagram assessment (adaptive test, tri-validation with behavioral markers, large professional-coach network). Its distribution data likely exists in the paid iEQ9 Statistical Manual but is not public. **Cannot populate the comparison table from public Integrative9 sources without outreach.**

### Source 4: Academic / peer-reviewed studies (context only)

- **ID:** `academic_context`
- **URLs:**
  - Wagner 1981 dissertation (Loyola): https://ecommons.luc.edu/luc_diss/2109/
  - Newgent et al. 2004 (RHETI reliability, Measurement and Evaluation in Counseling and Development): https://www.tandfonline.com/doi/abs/10.1080/07481756.2004.11909744
  - Sutton 2007 / 2012 IEA Journal literature review: https://ieaninepoints.com/wp-content/uploads/2019/01/2012-IEA-Journal_Anna-Sutton.pdf
  - Bartram & Brown 2005 (SHL / OPQ-Enneagram): https://kar.kent.ac.uk/98017/1/Bartram%20&%20Brown%20(2005)%20-%20Putting%20the%20Person%20into%20Personality%20-%20white%20paper.pdf
  - Hook et al. 2021 systematic review, J. Clinical Psychology: https://onlinelibrary.wiley.com/doi/10.1002/jclp.23097
- **What they report (sample sizes, not distributions):**
  - Wagner 1981: n=390 (311 women, 79 men, ages 19–82). Built the 135-item Wagner Enneagram Personality Inventory; correlated it to Millon's 8 types. **No per-type distribution published.**
  - Newgent et al. 2004: RHETI reliability study. Cronbach alphas ranged .56 (Achiever/Investigator) to .82 (Helper); only 6 of 9 scales reached α ≥ .70. Factor analysis did **not** recover a 9-factor structure; factors resembled Big Five dimensions.
  - Sutton 2007 / 2013: n=416 working-age UK adults. Found significant Big Five differences by Enneagram type; classified people into correct type 75% of the time.
  - Bartram & Brown 2005 (SHL white paper): n=241 adults who knew their Enneagram type. Found significant correlations between self-reported Enneagram type and Big 5 / OPQ factors.
  - Hook et al. 2021 (systematic review): Summarizes the literature; concludes mixed but improving evidence for Enneagram construct validity.
- **Why this matters for the page:** Cite these as **the credibility backbone** (this is a real, researched typology; not just pop-culture) while being explicit that **none of them publishes a per-type population distribution**. The distribution data only exists in online test corpora.

### Source 5: Enneagram Institute (Riso-Hudson)

- **ID:** `enneagram_institute`
- **URL:** https://www.enneagraminstitute.com/interpreting-your-enneagram-test-results/
- **Methodology:** Publishes the RHETI (Riso-Hudson Enneagram Type Indicator v2.5), 144-item forced-choice test.
- **Sample size (n):** Not disclosed for distribution purposes.
- **Per-type shares:** **Not published.** The Enneagram Institute does not publish population percentages on any verified URL.
- **Notes:** The community around the Institute often asserts a theoretical "each type ≈ 11.11% of the population" baseline, but this is a prior, not an empirical finding. Include as a reference URL for the RHETI instrument, but do not source distribution numbers from here.

### Source 6: Personality Hacker

- **ID:** `personality_hacker`
- **URL:** https://personalityhacker.com/
- **Methodology:** Personality Hacker publishes Enneagram content and podcasts combining MBTI and Enneagram frames.
- **Per-type shares:** **Not published.** No aggregate test-taker distribution data located in this pass.
- **Notes:** Skip for the comparison table.

---

## Sources attempted but unavailable

- **iEQ9 Statistical Manual** — referenced in the Integrative9 validity paper but paywalled/behind-sales. Not verifiable without direct outreach to Integrative Enneagram Solutions.
- **Wagner 1981 dissertation full text** — available on Loyola eCommons but full-text PDFs returned non-parseable binary in web-fetch. The published abstracts and secondary summaries do not give a per-type distribution.
- **Newgent et al. 2004 full paper** — paywalled on Taylor & Francis; secondary summaries give reliability figures, not distributions.
- **Bartram & Brown 2005 white paper** — PDF fetched but returned non-parseable binary; secondary summaries confirm n=241 and correlation focus, not distribution.
- **Sutton 2007 IEA Journal piece** — PDF returned non-parseable binary; sample size (n=416) and validity findings are well-documented in secondary summaries.
- **Enneagram Institute population estimates** — not published.
- **Personality Hacker aggregate type data** — not published.
- **Truity consolidated 9-type table** — does not exist on any verified URL; data is scattered across multiple blog posts covering "most common," "rarest," gender breakdowns, and relationship status.

---

## Recommended citation set for `corpus-stats-external.json`

Rank by credibility × sample size × completeness:

1. **enneagram_personality_com** (n ≈ 200,000, self-selected online, full 9-type table, 2026-04-07) — **LEAD DATA SET.** The only verified complete distribution. Use this as the primary "general test-taker" comparison line.
2. **truity** (n ≈ 54,000, self-selected online, 2022, partial but trustworthy anchors for types 5, 7, 8, 9) — **SECONDARY / SANITY CHECK.** Include as a second line in the comparison chart where the types overlap. Flag Type 7 explicitly as the sharpest contradiction with source 1.
3. **academic_context** (Wagner 1981 n=390, Sutton 2007 n=416, Bartram & Brown 2005 n=241, Newgent 2004 RHETI reliability) — **CREDIBILITY BACKBONE, NOT TABLE DATA.** Reference these in the page copy to establish that the Enneagram has been studied in peer-reviewed psychology, while being explicit that none of them reports a per-type population distribution.
4. **integrative9** — **NAME-DROP ONLY.** Mention as the most methodologically rigorous assessment (5,910-person validity study, 350,000+ administrations) but note their distribution data is not public; consider this an open research opportunity/outreach target.

**Suggested framing for the copy:**

> "Published Enneagram distributions all come from self-selected online test-takers — there is no representative general-population sample. The two largest public data sets (Truity, n=54,000; enneagram-personality.com, n=200,000) agree that Type 5 is rare and Type 9 is common, but they disagree sharply on Type 7 (9% vs. 13.6%). Academic studies (Wagner, Newgent, Sutton, Bartram & Brown) validate the construct but do not report distributions. Against this noisy baseline, the 9takes corpus of 293 public-figure profiles is a different beast entirely: it's third-party-typed celebrities and historical figures, biased toward high-achievement and high-visibility, so divergence is expected and is the point of the comparison."
