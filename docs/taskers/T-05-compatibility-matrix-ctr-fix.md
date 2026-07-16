<!-- docs/taskers/T-05-compatibility-matrix-ctr-fix.md -->

# Tasker: CTR Fix and Guide Merge for `enneagram-compatibility-matrix`

**For:** the agent assigned to fix the CTR collapse on `src/blog/enneagram/enneagram-compatibility-matrix.md` and fold the compatibility-guide's salvage asset into it.
**Owner:** DJ
**Created:** 2026-07-15
**Status:** Blocked at Step 2 on 2026-07-15. The cited source no longer supports the salvage asset. Step 8 (the 301) remains blocked on T-07 sequencing.
**Related:** `docs/content-analysis/2026-07-15_enneagram-blog-audit.md` §6.2 (this fix), §6.3 (the pattern behind it), §5 (the merge/kill list). Taskers `T-04` (astrology, same disease), `T-06` (the editorial rule both fixes produce), `T-07` (merge dependency order). Sibling idea `T-08` (tritype) is **blocked by this tasker**, see §5.

---

## 0. What and why

`enneagram-compatibility-matrix` is the biggest impression driver in enneagram-corner that is not already winning, and it converts at 0.75%. Roughly 7 hours of work for an estimated +177 clicks. That is the second-highest ROI on the site, behind only the astrology fix in T-04.

Verified from `docs/data/gsc/2026-07-06-pages.csv` on 2026-07-15:

| Page                             | Clicks | Impressions | CTR   | Position |
| -------------------------------- | -----: | ----------: | ----- | -------: |
| `enneagram-compatibility-matrix` |     81 |      10,735 | 0.75% |     11.9 |
| `enneagram-compatibility-guide`  |      0 |         246 | 0.00% |     10.2 |

Four problems, all fixable in one pass:

1. **"Matrix" versus "Chart".** The top query is "enneagram compatibility chart" at 971 impressions, position 8.0, 1.24% CTR. The query says chart. The title says Matrix. See §2 for the exact demand split, which is more nuanced than "nobody searches matrix."
2. **The chart is not above the fold.** Same disease as T-04. Google surfaces the anchor and the searcher does not click, because the page does not visibly promise a chart at the top. The anchor `#the-complete-compatibility-matrix-all-81-combinations` earns **587 impressions, 0 clicks, at position 7.8**. Google has read the page, decided that section is the answer, offered it on the SERP, and nobody takes it.
3. **The thesis contradicts the body.** The article argues type compatibility does not matter, then spends 4,000 words ranking it. Pick one. The resolution is in Step 5.
4. **It promises 81 combinations and ships 45.** Verified by count. The anchor literally reads `all-81-combinations` and delivers 45. That is a trust break Google can see.

**The merge is the elegant part.** `enneagram-compatibility-guide` (0 clicks, 246 impressions) contains one genuine asset: a cited study of 457 married couples whose four most common pairings account for 73.4% of the sample. The guide cites that data and then concludes it proves pairings do **not** cluster. That is backwards. Folding the data into the matrix **with the inversion corrected** does three things at once:

- Gives the matrix real, falsifiable evidence, which it currently lacks entirely.
- Resolves the matrix's thesis-versus-body war. The honest thesis becomes "compatibility does cluster, here is the evidence, and here is what that actually means," instead of "compatibility does not matter (now let me rank it for 4,000 words)."
- Retires a 0-click page by folding its one good asset into a 10,735-impression page.

**Lift the salvage asset BEFORE the 301.** Sequence matters. See T-07 for full merge order.

---

## 1. Required reading

1. `docs/content-analysis/2026-07-15_enneagram-blog-audit.md` §6.2, §6.3, §5. The source report.
2. `src/blog/enneagram/enneagram-compatibility-matrix.md` (6,112 words). Read the whole file. The target.
3. `src/blog/enneagram/enneagram-compatibility-guide.md` (3,712 words). The merge source, including its JSON-LD block.
4. `docs/data/gsc/2026-07-06-pages.csv`, `2026-07-06-queries.csv`, `2026-07-06-page-query.csv`. The demand truth.
5. `docs/taskers/T-04-*.md`. Same disease, different page. Do not re-derive the diagnosis.
6. `.claude/skills/9takes-editorial-standards/`. The em-dash ban and voice rules.

---

## 2. Verify before you build

Four claims in the originating brief did not survive checking. **The file and the CSV win over the brief. These are corrected below, but re-verify rather than trusting this table.**

| Brief claim                                         | What verification found                                                                                                                                                                                                                                                     | Verdict                                               |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| The 457-couple data is "first-party" evidence       | It is **not**. The guide cites it to an external link, `https://enneagram-personality.com/en/types/compatibility` (guide line 104). 9takes did not collect it.                                                                                                              | **Corrected. Load-bearing.**                          |
| "73.4% of them"                                     | The figure is **not literal in the file**. It is the sum of the guide's own table: 20.7 + 17.9 + 17.5 + 17.3 = 73.4. The arithmetic is correct, but you are deriving it, not quoting it.                                                                                    | Derived, holds                                        |
| "roughly 9x chance"                                 | **Does not hold as stated.** Against a uniform null over 45 unordered pairings, 4 pairings are expected at 8.89% and observed at 73.4%, which is **8.26x**. Against a uniform-type-marginal null it is **7.43x**. 9.3x holds only for the single top pairing (20.7 / 2.22). | **Corrected. Do not print 9x for the four combined.** |
| "enneagram compatibility": 587 impressions, pos 9.3 | That is the **sitewide** query row across all pages. The page-query row for this page is **4 clicks / 486 impressions / 0.82% / pos 12.1**. The 587 coincidentally matches the anchor row's impressions.                                                                    | **Corrected.**                                        |

**Verify the inversion by reading, not by trusting.** It is at guide lines 119 to 121 ("No single pairing exceeded 20.7%... Instead, successful marriages spread across all combinations") and in the QuickAnswer at line 45 ("That means 80% of successful marriages involve other combinations"). Confirm both passages before building an argument on them.

**Then verify the study itself resolves and says what the guide claims.** T-01 exists because this site has shipped fabricated citations before. Do not inherit this study's credibility from the guide. Open the link. If it 404s, or if the numbers do not match, **stop and report**. Do not build a thesis on an unverifiable third-party stat, and do not launder it into 9takes voice as though it were our own.

### The chart-versus-matrix demand split, precisely

"Nobody searches matrix" is directionally right but not literally true. From `2026-07-06-page-query.csv`, for this page:

| Wording  | Queries                                                                                                                                                                                                  | Impressions | Clicks |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------: | -----: |
| "chart"  | "enneagram compatibility chart" (971), "detail common scenarios requiring a compatibility chart" (122), "enneagram relationship compatibility chart" (40), "marriage enneagram compatibility chart" (15) |       1,148 |     13 |
| "matrix" | "matrix enneagram" (46, pos 9.0), "enneagram matrix" (30, pos 10.7), "enneagram relationship compatibility matrix and marriage advice" (33, pos 4.9)                                                     |         109 |  **0** |

Chart demand is 10.5x matrix demand, and matrix demand converts at **zero**, including one row at position 4.9. That is the argument for the retitle, and it is stronger than the brief's version. Use this table, not the slogan.

---

## 3. The work (in order)

### Step 1: Baseline before touching anything

See §6. Do this first or the measurement is worthless.

### Step 2: Verify the salvage asset

Per §2. Confirm the inversion, confirm the study resolves, recompute the multiple against an explicit null. If any of the three fails, report before proceeding to Step 5.

### Step 3: Retitle

Current: `The Complete Enneagram Compatibility Matrix: All 81 Type Combinations Decoded`

Move "Chart" into the title and drop the 81 claim unless Step 6 makes it true. Do not change the slug. The slug carries 10,735 impressions and is not the problem. Suggested direction, not a mandate:

> `The Enneagram Compatibility Chart: All 45 Pairings, and What the Data Says`

Also rewrite `description`. The current one says "all 81 Enneagram pairings," which will be false after Step 6.

### Step 4: Deliver the chart above the fold

The Quick Reference Compatibility Table already exists at line 134 and is a genuine chart. It sits roughly 1,300 words deep, below the QuickAnswer, the lede, "How Compatibility Actually Works," and "Why Opposites Attract."

Promote it. The searcher who typed "enneagram compatibility chart" should see a chart without scrolling. The essay about consciousness is the payoff, not the toll booth.

### Step 5: Resolve the thesis and merge the data

This is the substance of the tasker and the reason it is 7 hours rather than 2.

The current thesis ("compatibility does not matter") is contradicted by the article's own 4,000 words of ranking, and now also by the 457-couple data. Replace it with the thesis the evidence actually supports:

> Pairings cluster hard. Four of the 45 possible combinations account for 73.4% of 457 married couples, roughly 8x what chance predicts. Clustering is real. What it does **not** tell you is whether those marriages are good ones. Frequency is not success.

That last move is the 9takes angle and it is what keeps this from being just another compatibility chart. The data shows what pairs form, not what pairs work. The article can then rank pairings honestly (satisfying the searcher and its own body) while making a sharper point than either source article managed.

Per T-06 and audit §6.3: **the caveat qualifies the chart, it does not cancel it.** Do not repeat the guide's mistake of building the apparatus and then disowning it.

Carry over from the guide only what earns its place: the 457-couple table, the health-level table, the childhood-wound table. Leave the rest to die with the 301.

### Step 6: Fix the 81-versus-45 promise

The article delivers 45 pairings. Verified by count: 9 + 8 + 7 + 6 + 5 + 4 + 3 + 2 + 1 = 45.

Three options, in order of preference:

- **Option A (recommended): fix the promise.** 45 unordered pairings **is** every cell of the 9x9 grid, because the grid is symmetric. 1+2 and 2+1 are the same pairing. Say "all 45 pairings" and, if useful, note that this covers all 81 cells. This is honest, costs an hour, and is arguably a better claim than 81.
- **Option B: keep 81 and earn it.** Only if you can defend that 1+2 read from the One's side genuinely differs from 2+1 read from the Two's side. That is a real argument, but it is 36 new sections and blows the 7-hour estimate to pieces. Do not choose this without DJ.
- **Option C: leave it.** Not acceptable. It is the trust break.

If you take Option A, the H2 anchor `#the-complete-compatibility-matrix-all-81-combinations` changes, and that anchor currently holds 587 impressions at position 7.8. It earns 0 clicks, so the cost of breaking it is zero clicks. Note the change in the measurement log so the anchor's disappearance is not later misread as a regression.

### Step 7: Lint

- **Em-dashes: zero.** The matrix currently has 0. The guide has **3** (lines 3, 96, 275). Do not carry any across.
- Run `blog-lint.sh` but read §5 first. It is people/drafts-calibrated and will emit false positives here.

### Step 8: 301 the guide (blocked on T-07)

Only after Steps 2 through 7 are complete and the salvage asset is verifiably lifted, 301 `enneagram-compatibility-guide` to `enneagram-compatibility-matrix`. Cost of retiring it: **0 clicks**. Confirm the sequencing against T-07 before executing.

---

## 4. Verification checklist

- [ ] The 457-couple source link resolves and states what the guide claims. If not, reported and stopped.
- [ ] The inversion confirmed by reading guide lines 45 and 119 to 121.
- [ ] The multiple recomputed against an explicit, stated null. **9x does not appear in the article** for the four combined pairings.
- [ ] 73.4% either sourced or shown as a derived sum. Not presented as a quote.
- [ ] The 457 study is attributed to its third-party source, not implied to be 9takes data.
- [ ] Title contains "Chart". Slug unchanged: `enneagram-compatibility-matrix`.
- [ ] `description` rewritten and no longer claims 81 pairings.
- [ ] A chart is visible above the fold.
- [ ] Thesis and body agree. The article no longer argues against the thing it spends 4,000 words doing.
- [ ] The 81-versus-45 promise resolved via Option A or B. Count re-verified.
- [ ] `grep -cP "\x{2014}" src/blog/enneagram/enneagram-compatibility-matrix.md` returns **0**.
- [ ] `lastmod` unchanged (`2026-01-16`).
- [ ] `pnpm check` passes. The file is bundled into the build; bad YAML fails the whole deploy.
- [ ] No tritype content added. See §5.
- [ ] Baseline snapshot recorded before deploy.

---

## 5. Risks and gotchas

- **Risk: the tritype cannibalization trap. Read this before writing anything.** The matrix contains the word "tritype" **exactly zero times** (verified). Yet Google ranks it at **position 6.0 for "tritype compatibility" at 7.23% CTR**, plus "enneagram tritype compatibility" at 5.00% and position 5.3. Combined: 7 clicks from 103 impressions, a 6.8% CTR. **That is the best CTR this page earns anywhere, and it comes from content that does not exist.** Two consequences: (a) it is a textbook content gap, and (b) a future standalone tritype post competes head-on with this page's best-converting query. **Do not create a tritype post here, and do not add tritype sections to this page.** Sequence T-08 after this fix lands and stabilizes.
- **Risk: the estimate is softer than T-04's. Say so.** This page sits at position 11.9. Astrology sits at 7.7. Part of this gap is the position curve, not the title. A title fix alone may not reach 2.40% without the ranking also improving. T-04 is the higher-confidence bet; this one has a real chance of underdelivering. Do not let the +177 headline hide that.
- **Risk: scope creep into `enneagram-types-in-relationships`.** It is a **ranking** failure, not a CTR failure: 8 clicks / 5,387 impressions / 0.15% / **position 32.8**, 7,345 words, with demand queries at positions 30 to 82. No title rewrite saves it. It should eventually consolidate into compatibility-matrix, which already outranks it on the same queries. **That is T-07's scope, not this tasker's.** Flag it and move on.
- **Gotcha: frontmatter quality grades are stale and will contradict this tasker.** The matrix self-certifies `quality_score: 8.6 (B+)`; the audit grades it 7.5. The guide self-certifies `8.8 (B+)`; the audit grades it 5.5. Both were graded 2026-02-22 by a pipeline known to inflate. **Trust the audit.** See T-03 for the root cause.
- **Gotcha: `blog-lint.sh` is people/drafts-calibrated.** On enneagram-corner posts most FAILs are false positives. Only these checks are universal: em-dash, contrast-pair, banned phrases, description length.
- **Hard constraint: never modify `lastmod`.** DJ manages it manually. This applies to both files, including the guide before its 301.
- **Hard constraint: `enneagram-and-mental-illness` is frozen** (287 clicks). Not in scope. Do not touch it for any reason, including internal links.
- **Non-risk: retiring the guide.** 0 clicks, 246 impressions, and its page-query rows are 3 and 2 impressions. The merge costs nothing measurable.

---

## 6. Measurement

**Before deploy**, snapshot from `docs/data/gsc/2026-07-06-*.csv` and record the date:

- The page: 81 clicks / 10,735 impressions / 0.75% / pos 11.9.
- The merge source: 0 clicks / 246 impressions / 0.00% / pos 10.2.
- The anchor rows, especially `#the-complete-compatibility-matrix-all-81-combinations` (587 imp, 0 clicks, pos 7.8) and `#quick-reference-compatibility-table` (176 imp, 0 clicks, pos 8.9).
- The queries: "enneagram compatibility chart" (12 / 971 / 1.24% / 8.0), "enneagram type compatibility" (0 / 680 / 15.8), "enneagram compatibility" page-query row (4 / 486 / 0.82% / 12.1), and both tritype rows.

**Re-snapshot at 2 weeks and 4 weeks.** Title changes take 2 to 6 weeks to reflect in GSC. Do not call it at 2 weeks.

### The arithmetic, and why it is conservative

**Do not use a textbook 10% position-3 CTR.** 9takes has no non-brand data at position 3. Applying textbook curves to these pages manufactures roughly 700 imaginary clicks across the backlog.

Use the site's own proven ceiling of **2.40%**, bracketed by two real pages:

- `enneagram-and-mental-illness`: 2.35% at pos 8.2.
- `mental-health/enneagram-neurodivergence-guide`: 2.83% at pos 7.3.

```
10,735 impressions x 2.40% = 258 clicks
258 - 81 (today)           = +177 clicks
```

One note that cuts in favor of the estimate: `enneagram-and-adhd-which-types-struggle-most` earns **4.84% at position 5.6** on 5,205 impressions. A non-brand 9takes page does clear 2.40% when the title matches the query. That makes 2.40% a conservative ceiling rather than an optimistic one. It does not, however, fix the position-11.9 problem noted in §5.

---

## 7. Definition of done

- [ ] Salvage asset verified (source resolves, inversion confirmed, multiple recomputed against a stated null) or the blocker reported.
- [ ] Title carries "Chart"; slug unchanged; description rewritten.
- [ ] A chart renders above the fold.
- [ ] The 457-couple data lives in the matrix, correctly attributed to its third-party source, with the inversion corrected.
- [ ] Thesis and body agree; the caveat qualifies the chart rather than cancelling it.
- [ ] 81-versus-45 promise resolved and the count re-verified.
- [ ] Zero em-dashes; `lastmod` untouched; `pnpm check` green.
- [ ] No tritype content added; T-08 explicitly sequenced after this.
- [ ] Baseline recorded; 2-week and 4-week follow-ups scheduled.
- [ ] Guide 301'd to the matrix, **after** T-07 confirms merge order.
- [ ] Result logged, including whether +177 landed, so T-06's rule is calibrated against two data points (this and T-04) rather than one.

---

## 8. What was actually done

Work stopped at the tasker's mandatory source-verification gate on 2026-07-15.

- Recorded the pre-edit GSC baseline: matrix 81 clicks / 10,735 impressions / 0.75% CTR / position 11.9; guide 0 / 246 / 0.00% / position 10.2.
- Recorded the two high-impression zero-click anchors: `#the-complete-compatibility-matrix-all-81-combinations` at 587 impressions / position 7.8, and `#quick-reference-compatibility-table` at 176 impressions / position 8.9.
- Opened the guide's cited source, `https://enneagram-personality.com/en/types/compatibility`. The live page now describes a different dataset of 2,250 people and relationship duration, updated 2026-04-16.
- Confirmed the live source does not contain the claimed 457-couple sample or the 20.7%, 17.9%, 17.5%, and 17.3% pairing frequencies. Its methodology is not a replacement for the claimed study.

Per Step 2, no title, description, chart, thesis, article body, or redirect was changed. The task remains blocked until the 457-couple figures can be verified from a trustworthy source or the merge plan is rewritten without them.
