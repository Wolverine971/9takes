<!-- docs/content-analysis/2026-08-13-strengths-weaknesses-evidence-repair.md -->

# Enneagram Strengths and Weaknesses Evidence Repair

**Date:** 2026-08-13  
**Page:** `src/blog/enneagram/enneagram-strengths-and-weaknesses.md`  
**Tasker:** `docs/taskers/T-29-strengths-weaknesses-evidence-repair.md`  
**Status:** Implemented; local verification recorded below

## 1. Decision and scope

The page still answers the comparison query across all nine Enneagram types, but it no longer presents invented people or outcomes as evidence. The repair preserves the page title, URL, publication state, type headings, high-impression passage fragments, links, and explicit integration fragment. It changes the inaccurate description and preview copy because both treated type patterns as guaranteed traits.

This article now distinguishes three levels:

1. **Research fact:** A systematic review found mixed evidence for the Enneagram's reliability and validity.
2. **9takes editorial interpretation:** The type strength and shadow patterns are practical hypotheses to compare with observation.
3. **Advice or hypothetical illustration:** Counter-moves are bounded experiments, and the two illustrations are labeled hypothetical with no claimed result.

The required T-27 deliverable, `docs/seo/2026-08-13-winners-and-declines-refresh.md`, did not exist in this worktree or the source checkout during implementation. The T-29 search baseline and the current clean GSC exports were available and are recorded in section 7.

## 2. Evidence inventory and disposition

### Search-facing and opening claims

| Original claim or claim group                                                                                                                           | Classification before repair             | Disposition                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Description: every type has a fatal flaw that sabotages success, Type 1s self-destruct, and Type 7s cannot focus                                        | Unsupported categorical and causal claim | Replaced with an accurate comparison promise covering common strengths, shadows, and practical counter-moves |
| Preview: knowing type reveals natural strengths and hidden weaknesses                                                                                   | Unsupported categorical claim            | Replaced with an observational comparison promise                                                            |
| Title language, "Fatal Flaw" and "Secret Superpower"                                                                                                    | Search-facing editorial shorthand        | Title preserved; the QuickAnswer now says explicitly that a fatal flaw is not a guaranteed defect            |
| QuickAnswer: every type has a specific weakness that consistently sabotages success                                                                     | Unsupported categorical and causal claim | Replaced with "No" and a context-dependent explanation                                                       |
| Type 1 perfectionism creates excellence and paralysis; Type 3 drive achieves the impossible and destroys relationships; Type 9 calm enables dysfunction | Unsupported causal claims                | Replaced with conditional examples showing that context changes the cost or value of a behavior              |
| Public speaking is oxygen or slow death; solitude recharges or suffocates                                                                               | Unsupported categorical hyperbole        | Removed                                                                                                      |
| The Enneagram shows what a person is good at and how the gift becomes a fatal flaw                                                                      | Unsupported predictive claim             | Reframed as the article's editorial strength-to-shadow idea                                                  |

### Fabricated named examples and outcomes

All nine items below were unsupported. None was sourced, labeled hypothetical, or traceable to 9takes data.

| Type | Removed anecdote          | Removed outcome or proof claim                                                                                  |
| ---- | ------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 1    | Sarah, operations manager | Completion criteria doubled team productivity and reduced her stress by 50 percent                              |
| 2    | Marcus, HR director       | Office hours and a strategic focus increased his influence                                                      |
| 3    | Jennifer, CEO             | Redefining success and modeling work-life integration increased employee retention                              |
| 4    | Alex, marketing director  | An authenticity-first campaign went viral and proved that depth and authenticity drive engagement               |
| 5    | David, data scientist     | A child-explanation test made his influence skyrocket                                                           |
| 6    | Lisa, project manager     | Anxiety produced the industry's best risk frameworks and made her the preferred person for high-stakes projects |
| 7    | Tom, consultant           | A restructured delivery model made completion rate and satisfaction soar                                        |
| 8    | Maria, CEO                | Showing uncertainty strengthened authority and team performance                                                 |
| 9    | James, team lead          | Caring confrontation improved team performance by 40 percent                                                    |

No anecdote was converted into a composite. Type 4 and Type 8 now contain short, explicitly labeled hypothetical examples. Each describes a choice, not a person, client, measurement, or promised outcome.

### Unsupported numerical claims

The three invented measured results above were removed. Two additional numeric aphorisms were also removed:

- A finished 80 percent is better than an unfinished 100 percent.
- Using 10 percent power produces 100 percent results.

The old child-explanation label and five-minute discomfort exercise were editorial metaphors or instructions rather than measured outcomes, but they were removed with the repeated advice template. The old read-time estimate was also removed rather than presented as evidence-like precision.

### Type-section doctrine and workplace claims

The old repeated grids asserted many patterns as facts. They included claims that Type 1s catch what everyone misses, Type 2 warmth creates psychological safety, Type 3 confidence motivates others, Type 4s immediately detect inauthenticity, Type 5 distance produces objectivity and breakthroughs, Type 6s spot hidden danger, Type 7 energy lifts teams, people follow Type 8 authority, and Type 9s see every perspective.

Those claims were not retained as measured psychology or workplace findings. Each type section now:

- names a strength in a concrete setting as a possibility;
- explains how the same pattern may become a shadow;
- gives an observable warning sign;
- offers one bounded counter-move; and
- avoids diagnosing the reader or promising a result.

The old context section also said some types naturally excel, thrive, innovate, connect deeply, or show predictable stress behavior. It now describes possible contributions and specific costs, and tells readers to trust observation over a mismatched label.

### Growth, FAQ, and structured data

| Area                              | Unsupported or overstated claim                                     | Correction                                                                                                                          |
| --------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Growth and connecting lines       | Growth and stress points show where a person will expand            | Identified as a secondary Enneagram tradition with limited research support; replaced with an observational response-range exercise |
| Visible QuickAnswer               | Every type has a fatal flaw                                         | Answer is now "No" and matches the article's caveat                                                                                 |
| FAQ JSON-LD, Enneagram definition | Types describe an ego structure that manages shame, fear, and anger | Replaced with a neutral typology definition and the mixed-evidence boundary visible in the article                                  |
| FAQ JSON-LD, help                 | Type reveals strengths and growth areas                             | Reframed as questions to test in specific situations                                                                                |
| FAQ JSON-LD, fatal flaw           | A type-specific weakness consistently sabotages success             | Replaced with the visible non-predictive answer                                                                                     |
| FAQ JSON-LD, biggest weakness     | A deterministic weakness for every type                             | Rewritten as a possible shadow to observe                                                                                           |
| FAQ JSON-LD, hidden superpower    | A unique guaranteed superpower for every type                       | Rewritten as editorial shorthand for a common strength                                                                              |
| FAQ JSON-LD, change               | Type weakness can be managed by a generic strategy                  | Rewritten as an observe, test, and compare process                                                                                  |

The seven structured-data questions remain, and every answer is supported by visible article language.

### Frontmatter audit boundary

Technical values such as `date`, `priority`, and `wordCount` are not study results or reader outcomes. The flat `quality_*` block is an internal February grading artifact, not evidence offered in the article. It remains unchanged because `docs/taskers/T-03-quality-frontmatter-is-not-a-gate.md` explicitly prohibits editing any such field before DJ chooses whether to wire or delete that schema. This is the only DJ-gated evidence-adjacent decision found in frontmatter.

## 3. External source retained

One research source remains because it establishes the article's evidence boundary rather than decorating Enneagram doctrine:

- Hook, J. N., Hall, T. W., Davis, D. E., Van Tongeren, D. R., and Conner, M. (2021), ["The Enneagram: A systematic review of the literature and directions for future research"](https://pubmed.ncbi.nlm.nih.gov/33332604/), _Journal of Clinical Psychology_, 77(4), 865-883, DOI `10.1002/jclp.23097`. The review covered 104 independent samples and reported mixed evidence of reliability and validity, with little research supporting secondary theory such as wings and intertype movement.

No external workplace, retention, productivity, engagement, influence, satisfaction, or performance claim was retained.

## 4. Structural changes

The nine type sections no longer repeat the same Energizers, Drainers, Natural Strengths, Shadow Sides, advice list, and case-study slot. They use distinct practical forms instead:

- Type 1 uses completion criteria.
- Type 2 uses a boundary audit.
- Type 3 uses a scoreboard test.
- Type 4 uses a labeled creative-work hypothetical.
- Type 5 uses a research decision line.
- Type 6 uses a two-column risk review.
- Type 7 uses a completion contract.
- Type 8 uses an intensity dial and a labeled meeting hypothetical.
- Type 9 uses three checks separating peace from avoidance.

The shared editorial contract remains consistent, but the reading experience is not a nine-slot noun swap.

## 5. Search-facing fields and passage preservation

| Field                     | Result              | Reason                                                                                                                          |
| ------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `title`                   | Preserved exactly   | Avoid disturbing a page already near page one; body now explains the metaphor                                                   |
| `description`             | Changed             | Removed guaranteed sabotage, self-destruction, and inability claims while preserving the strengths-and-weaknesses query promise |
| `previewHtml`             | Changed             | Removed "reveals natural strengths" certainty and matched the new observational article                                         |
| `loc` and canonical route | Preserved exactly   | No URL change authorized or needed                                                                                              |
| `published`               | Preserved as `true` | The page remains live content                                                                                                   |
| `date`                    | Preserved exactly   | No publication reset                                                                                                            |
| `lastmod`                 | Preserved exactly   | DJ-managed field                                                                                                                |
| `wordCount`               | Preserved           | Existing non-consumed metadata left outside the evidence repair                                                                 |

Preserved search-relevant headings and fragments:

- `#strengths-in-different-contexts`
- `#type-1---the-perfectionist` through `#type-9---the-peacemaker`
- `#working-with-your-weaknesses-a-strategic-approach`
- explicit compatibility fragment `#the-integration-journey`

All nine type-detail links, the Marquee component and its five links, the self-development link, and the community-questions link remain.

## 6. Before and after counts

Counts use the pre-repair repository version and the final repaired source. "Unsupported metrics" means the three invented measured outcomes plus the two unsupported numeric aphorisms listed in section 2.

| Check                                    | Before | After |
| ---------------------------------------- | -----: | ----: |
| Named anecdotes                          |      9 |     0 |
| Unsupported metrics                      |      5 |     0 |
| Unsupported causal anecdote blocks       |      9 |     0 |
| U+2014 em dashes                         |      0 |     0 |
| Internal-note HTML comment blocks        |      3 |     0 |
| Explicitly labeled hypothetical examples |      0 |     2 |

The three removed internal-note blocks contained image-generation prompts, a keyword/source scratch note, and an unfinished update scaffold. No `QUALITY_FEEDBACK` block was present at baseline.

## 7. Search baseline

T-29 records the latest 28-day baseline as **6 clicks, 518 impressions, 1.16 percent CTR, and average position 9.0**.

The current clean long-window export identified by `docs/data/gsc/latest.json` covers 2026-05-05 through 2026-08-11 and records:

- Page: 27 clicks, 1,861 impressions, 1.45 percent CTR, position 9.8.
- Query `enneagram strengths and weaknesses`: 5 clicks, 92 impressions, 5.43 percent CTR, position 5.0.
- `#strengths-in-different-contexts`: 243 impressions, position 7.5.
- Type fragments: 374, 249, 219, 296, 166, 71, 67, 121, and 90 impressions for Types 1 through 9 respectively. Average positions range from 7.1 to 8.3.
- `#working-with-your-weaknesses-a-strategic-approach`: 375 impressions, position 7.3.

These rows are why the repair preserved the headings and fragments even while replacing the evidence underneath them.

## 8. Verification

Content and integrity checks passed:

- zero occurrences of all nine fabricated names;
- zero `Real-World Example` labels;
- zero unsupported percentages, multipliers, or claimed causal outcomes;
- zero U+2014 and U+2013 characters in the article and report;
- zero HTML comments or internal quality markers in the article;
- JSON-LD parses and retains seven FAQ questions;
- visible QuickAnswer and JSON-LD fatal-flaw answers agree;
- `title`, `loc`, `date`, `published`, and `lastmod` match the pre-repair source;
- all original headings that own GSC fragments remain exact;
- all original internal link destinations remain; and
- freshly compiled target chunks contain none of the removed names, outcomes, example labels, or internal-note markers.

Command results:

- Target Prettier check: passed for the article, report, and completed tasker.
- `pnpm check`, run with the checked-in `.env.example` so isolated-worktree static env modules exist: passed with 0 errors and 132 pre-existing warnings in 40 files.
- Vite/MDsvex production compilation, run with the source checkout's deployment env loaded read-only: passed. Server and client builds transformed 6,246 and 6,304 modules respectively.
- The final `pnpm build` wrapper exited only at the unrelated asset budget gate. The protected portrait library is 57.96 MiB against a 57.60 MiB budget, and 1,112 files against a 1,110-file budget. The overages are 364.61 KiB and 2 files. This content repair changed no portrait or asset file.

## 9. Twenty-eight-day measurement plan

Use deployment, not commit, as day zero.

1. Save the deployment date and a same-day GSC snapshot for the page, target query, and preserved fragments.
2. During the first 28 days, make no broad title or heading change unless a factual error appears. This protects attribution.
3. At day 28, compare the first full post-deploy 28-day window with the immediately preceding 28 days.
4. Evaluate page clicks, impressions, CTR, and average position together. Separate a demand change from a rank or snippet change.
5. Compare the main query plus `enneagram types strengths and weaknesses`, `enneagram weaknesses`, and the available type-specific strengths-and-weaknesses queries.
6. Review every preserved fragment row. A fragment losing visibility while the page remains stable suggests a passage-level issue, not a title problem.
7. Compare CTR only at similar positions and query mix. Do not treat raw CTR movement as proof that the evidence repair helped or hurt.
8. If both impressions and average position decline materially across the page and target-query rows, inspect indexing, the rendered description, passage extraction, and competing landing pages before editing copy again.
9. Record the result in this report or its SEO successor, including a no-change decision when performance remains within ordinary variation.

## 10. DJ-gated decisions

No publication, slug, title, canonical, redirect, or merge decision is needed for this repair.

One separate decision remains under T-03: whether to delete or wire the stale flat `quality_*` frontmatter schema. This repair neither relies on nor changes the page's `B+`, `8.8`, or `n/a` grading fields.
