<!-- docs/taskers/T-04-astrology-enneagram-ctr-fix.md -->

# Tasker: Retitle `astrology-and-the-enneagram` to the Lookup Intent

**For:** the agent assigned to fix the click-through rate on `src/blog/enneagram/astrology-and-the-enneagram.md`.
**Owner:** DJ
**Created:** 2026-07-15
**Status:** Not started. Unblocked. Roughly 4 hours of work. This is the highest-ROI item on the site.
**Related:** `docs/content-analysis/2026-07-15_enneagram-blog-audit.md` §6.1 (this page), §6.3 (the editorial pattern behind it), §6.6 (the section-wide anchor finding). Sister taskers: `T-05` (`enneagram-compatibility-matrix`, same disease), `T-06` (the editorial rule that prevents the next dozen), `T-09` (fresh GSC pull). Those three are planned in parallel and may not exist on disk yet. Do not do their work here.

---

## 0. What and why

`astrology-and-the-enneagram` earns **86 clicks from 11,691 impressions (0.74% CTR) at average position 7.7.**

It ranks. It does not convert. Position 7.7 is not the problem, and no amount of ranking work is the fix.

**The content searchers want already exists on the page, and the title hides it.**

Here is the whole argument, and it is not an inference. Google is surfacing the page's own section jump-links directly on the SERP and getting nothing back:

| Anchor row (GSC, Apr 7 to Jul 6)                                   | Impressions | Clicks | Position |
| ------------------------------------------------------------------ | ----------: | -----: | -------: |
| `#what-enneagram-type-is-your-zodiac-sign`                         |       1,387 |  **0** |      7.1 |
| `#why-each-enneagram-type-matches-its-zodiac-sign`                 |       1,319 |  **0** |      7.1 |
| `#enneagram-types-and-zodiac-signs-the-complete-correlation-chart` |         987 |      1 |      7.3 |

Google has read the article, decided the correlation chart is the answer, is offering that section directly in the results, and nobody clicks through. The single hardest-surfaced anchor, at 1,387 impressions, is the heading **"What Enneagram Type Is Your Zodiac Sign?"**. Google has already told us what this page is.

The title says something else. Current title: **"Astrology vs. the Enneagram: When vs. Why."** The actual query set is a lookup, not an essay:

| Query                                | Impressions | Clicks |   CTR | Position |
| ------------------------------------ | ----------: | -----: | ----: | -------: |
| `enneagram and astrology`            |          79 |      3 | 3.80% |      7.8 |
| `enneagram astrology`                |          72 |      1 | 1.39% |      7.3 |
| `astrology enneagram`                |          69 |      0 | 0.00% |      7.4 |
| `enneagram zodiac`                   |          38 |      1 | 2.63% |      7.2 |
| `taurus enneagram type`              |          18 |      0 | 0.00% |     10.3 |
| `capricorn enneagram`                |          11 |      0 | 0.00% |     11.4 |
| `enneagram type for aquarius zodiac` |           8 |      0 | 0.00% |      7.5 |
| `zodiac signs as enneagram types`    |           7 |      0 | 0.00% |      6.7 |

They want a chart. "vs." signals an essay, so the searcher skips it. Note that `enneagram vs astrology` exists but is tiny (10 impressions). We built the title for the smallest query on the list.

**Expected impact: +85 to +195 clicks.** Arithmetic in §6. Roughly 4 hours of work.

---

## 1. Required reading

1. `docs/content-analysis/2026-07-15_enneagram-blog-audit.md` §6, all of it. §6.1 is this page, §6.3 is the pattern, §6.6 is why this page is the pilot. The methodology note at the top of §6 is load-bearing and is restated in §6 below.
2. `src/blog/enneagram/astrology-and-the-enneagram.md`. Read the whole file including the JSON-LD block at the bottom. It is 5,031 words across 13 H2 sections, graded 7/10, verdict **light edit**. It is a good article wearing the wrong sign.
3. `docs/data/gsc/2026-07-06-pages.csv`, `2026-07-06-queries.csv`, `2026-07-06-page-query.csv`. The evidence above. Re-derive it yourself before committing to a title.
4. `src/lib/utils/seoBudget.ts` and `src/lib/components/blog/BlogPageHead.svelte`. Non-obvious and load-bearing. See §3 Step 1 and §5.
5. The `9takes-editorial-standards` skill. Em-dash ban, banned phrases, voice.

---

## 2. Why this page, and only this page, can win it

9takes sells no test and no birth chart. That is the entire moat here and the fix depends on it.

The article already contains the honest finding, buried at section 12 of 13 (`## Are Astrology and the Enneagram Scientific?`, line 321): researcher Lynn Roulo found **no statistical correlation** between Enneagram type and zodiac sign. The article then admits its own correlations are "pattern-based, not empirical."

At section 12 of 13, after 5,000 words of zodiac apparatus, that reads as a betrayal. The reader built a model and the author knocked it down on the way out.

At the top, framed, it becomes the 9takes angle. It is the one thing Truity and every astrology site structurally cannot publish, because they are selling the test or the chart. We can say: **these correlations are not real, here is the chart anyway, and here is what the pattern actually tells you about how people self-describe.**

That is not a hedge. It is the differentiator, and it is currently filed as a footnote.

---

## 3. The work (in order)

### Step 1: Retitle to the lookup (the whole ballgame)

Target: **"What Enneagram Type Is Your Zodiac Sign? The Complete Correlation Chart"**, verbatim from the H2 Google already surfaces hardest.

**Verify against the CSVs before committing.** The brief is a recommendation, not a decree. If the query data supports a closer variant, take it.

**The non-obvious part, verified 2026-07-15 by reading the code.** Do not skip this.

`src/routes/enneagram-corner/[slug]/+page.svelte:106` renders `BlogPageHead`, which at line 29 computes `serpTitle = capTitleForSnippet(formattedTitle)`. `seoBudget.ts` sets `TITLE_SNIPPET_BUDGET = 60` and **hard-truncates the `<title>` tag at 60 characters with an ellipsis.**

The recommended title is 71 characters. Our own code renders it as:

```
"What Enneagram Type Is Your Zodiac Sign? The Complete…"
```

The word **"Chart"** gets truncated away. That is the one word the retitle exists to add. Shipping the long title alone silently defeats the entire tasker.

**The fix is the split the component already provides.** `BlogPageHead.svelte:24-25` derives `articleTitle` from `title` (the visible H1, which the Article JSON-LD stays aligned to) and `seoTitle` from `meta_title` with fallback to `title`. So set both:

```yaml
title: 'What Enneagram Type Is Your Zodiac Sign? The Complete Correlation Chart'
meta_title: 'What Enneagram Type Is Your Zodiac Sign? Full Chart'
```

`meta_title` is 51 characters and renders whole. `title` carries the full promise as the H1. Confirm your chosen `meta_title` is 60 characters or fewer by running it through `truncateForSnippet(value, 60)` and checking the output is unchanged. If it comes back with an ellipsis, it is too long.

### Step 2: Promote the correlation chart above the fold

The chart exists at line 58 and is good. The problem is what sits in front of it.

Current order: QuickAnswer, then a ~300-word essay intro, then `## Enneagram vs Astrology: What's the Difference?` **with its own comparison table**, and only then the correlation chart at section 2.

So the first table the reader meets is the "vs." table, which is the essay framing. The lookup they came for is the second table, below the fold on mobile, behind a competing one.

**Do:** make the correlation chart the first substantive thing after the QuickAnswer. Move the "vs." comparison section down to sit near the "how to use both" material where the distinction is actually useful. Trim the intro hard. Someone searching `taurus enneagram type` should hit the chart row without scrolling.

The reverse-lookup section (`## What Enneagram Type Is Your Zodiac Sign?`, line 114, currently section 4 of 13) is the exact title we are shipping and the exact anchor Google surfaces at 1,387 impressions. It should sit immediately after the chart, not at 27% depth.

### Step 3: Move the honest finding to a framed position near the top

Take the Roulo "no statistical correlation" finding out of section 12 and place it near the top, right after the chart, framed as the angle rather than the retraction. See §2.

Keep the full science section where it is for the readers who want it. What moves up is the framed version: short, confident, and positioned as the reason to trust the chart rather than the reason to abandon it.

**The rule from audit §6.3, which T-06 will generalize: the caveat qualifies the promise, it does not cancel it.** If the title promises a chart, the page ships the chart above the fold and the caveat tells you how to read it.

### Step 4: Rewrite the meta description

The current description has two independent problems, both verified:

1. **It carries a banned em-dash.** Frontmatter line 3, in the clause joining `aren't the same thing` and `but they aren't unrelated either`. House rule is zero per document.
2. **It is 251 characters against a 155-character budget**, so `capDescriptionForSnippet` truncates it. The rendered SERP snippet today cuts off after "The Enneagram" and **never reaches the words "the complete chart."** The chart promise does not currently survive to the SERP at all. The em-dash does.

Write a replacement at 155 characters or fewer that leads with the chart and carries the honest angle. Two candidates verified to fit:

```
All 12 zodiac signs mapped to their Enneagram types in one chart. Plus the honest part: the correlations are not statistically real. Here is what they are.
```

(155 characters, renders whole.)

```
The complete chart pairing all 9 Enneagram types to zodiac signs, planets, and houses. Plus the part nobody selling you a test will say: it is not real.
```

(152 characters, renders whole.)

Use one, or write better. Verify the length before committing.

### Step 5: Em-dash sweep

The file contains **54 em-dashes** across 49 lines. One is in the frontmatter description (Step 4). The rest are in the body, heavily concentrated in the wings table at lines 269 to 286.

Sweep all of them. Zero per document, no exceptions.

```bash
rg '\x{2014}' src/blog/enneagram/astrology-and-the-enneagram.md   # must print nothing
```

The Unicode escape is deliberate. Grepping for a literal em-dash means typing one, which puts the banned character into whatever file, commit message, or tasker the command gets pasted into. `\x{2014}` is the same check without the contamination.

Do not mechanically swap every em-dash for a comma. Re-read each sentence and pick the punctuation the sentence actually wants. The wings table entries mostly want a colon.

---

## 4. Scope guard: what not to do

- **Do not change the slug.** `/enneagram-corner/astrology-and-the-enneagram` ranks at 7.7 and has accumulated authority since 2024. Title and meta only. A slug change throws away the only asset this page has.
- **Do not touch `lastmod`.** DJ manages it manually. This is an SEO edit. The `lastmod` field is not yours to bump, and no title change justifies it.
- **Do not touch `enneagram-and-mental-illness`.** It is frozen at 287 clicks and is the site's crown jewel. It appears in this tasker only as a CTR comparable.
- **Do not fix `enneagram-compatibility-matrix`.** Same disease, different ticket. That is T-05.
- **Do not write the editorial rule.** That is T-06. Just do this page.
- **Do not chase the other 451 anchor rows.** This page is the pilot. Prove the play here first.
- **Do not rewrite the article.** The verdict is light edit at 7/10. The prose is fine. The structure and the sign on the door are the job.

---

## 5. Verification checklist

- [ ] `rg '\x{2014}' src/blog/enneagram/astrology-and-the-enneagram.md` prints **nothing**
- [ ] `lastmod` in the frontmatter is byte-identical to before the edit (`git diff` shows no change to that line)
- [ ] `loc` and the file path are unchanged. The slug did not move.
- [ ] `meta_title` is 60 characters or fewer, confirmed by passing it through `truncateForSnippet(value, 60)` and getting the input back unchanged
- [ ] `description` is 155 characters or fewer, same check against `truncateForSnippet(value, 155)`
- [ ] The rendered `<title>` on the built page contains the word "Chart" (view source, do not assume)
- [ ] The correlation chart is the first table on the page, above the "vs." comparison table
- [ ] The Roulo "no statistical correlation" finding appears above the 25% depth mark, framed as the angle
- [ ] The H1 and the `title` frontmatter match
- [ ] The FAQPage JSON-LD block at the bottom still parses and its answers do not contradict the new framing
- [ ] `pnpm build` succeeds. Bad YAML in a blog frontmatter fails the whole deploy.
- [ ] `pnpm index:blogs` run after the edit so the FTS index picks up the new title
- [ ] Baseline snapshot recorded per §6 **before** deploy

---

## 6. Risks and gotchas

- **Risk: the 60-character title truncation silently eats "Chart."** Covered in Step 1. This is the single most likely way to do all the work and get none of the benefit. Verify the rendered tag, not the frontmatter.
- **Risk: modelling this with a textbook CTR curve.** Do not. **9takes has no non-brand data at position 3.** Only three pages sit at position 4 or better with 100+ impressions (`/about` at 0.55%, `/blog` at 0.57%, `Jenna-Ortega` at 1.98%), and the only query at position 3.5 or better is the brand term `9takes` at 72.41%. Applying a textbook 10% position-3 CTR across the audit manufactures roughly 700 imaginary clicks. Use the **site's own proven ceiling of 2.40%**, bracketed by two real 9takes pages at comparable positions: `enneagram-and-mental-illness` (2.35% at position 8.2) and `enneagram-neurodivergence-guide` (2.83% at position 7.3).

  The arithmetic, holding position 7.7 constant, because this is a CTR fix and not a ranking fix:

  ```
  Today:    11,691 impressions x 0.74% =  86 clicks   (actual)
  Ceiling:  11,691 impressions x 2.40% = 280 clicks   ->  +194, call it +195
  Floor:    11,691 impressions x 1.46% = 171 clicks   ->   +85
  ```

  The floor assumes the retitle only partially lands: CTR roughly doubles but reaches only about 61% of the site ceiling. **+85 to +195 is the honest bracket.** Do not quote a number outside it.

- **Data caveat: the GSC window is stale and straddles a fix.** The `2026-07-06` export covers Apr 7 to Jul 6 and closed 2026-07-04. It straddles a May 4 URL fix, which contaminates mental-health page comparisons. It does **not** materially affect this page, but the baseline in §7 must come from a fresh pull, not from this export. See T-09.
- **Risk: the reframe reads as hedging instead of confidence.** Moving the "it is not real" finding up is the highest-variance edit here. Done badly it tells the reader at word 200 not to bother. Done right it says: everyone else needs you to believe this, we do not, here is the chart and here is what it actually measures. If the framed version cannot carry that tone in under 120 words, leave it where it is and ship Steps 1, 2, 4, and 5. Those alone carry most of the value.
- **Risk: FAQ JSON-LD drift.** The seven-question FAQPage block at the bottom encodes the old "complementary, not identical" framing. If the top of the article now leads with "not statistically real," the JSON-LD should not be arguing the other side. Reconcile them.
- **Non-risk: losing "vs." rankings.** `enneagram vs astrology` is 10 impressions with 1 click. There is nothing to lose.
- **Gotcha: this is bundled into the build.** Invalid YAML in the frontmatter fails the entire Vercel deploy, not just this page. Watch the quoting when you rewrite `title`, `meta_title`, and `description`.

---

## 7. Measurement

**Before deploy**, pull a fresh GSC export (do not reuse `2026-07-06`, see §6) into `docs/data/gsc/<YYYY-MM-DD>-pages.csv` and friends, then record clicks, impressions, CTR, and position for these four rows:

| Row                                                                 | Clicks | Impressions | CTR | Position |
| ------------------------------------------------------------------- | -----: | ----------: | --: | -------: |
| `/enneagram-corner/astrology-and-the-enneagram`                     |        |             |     |          |
| `…#what-enneagram-type-is-your-zodiac-sign`                         |        |             |     |          |
| `…#why-each-enneagram-type-matches-its-zodiac-sign`                 |        |             |     |          |
| `…#enneagram-types-and-zodiac-signs-the-complete-correlation-chart` |        |             |     |          |

For reference, the `2026-07-06` values are 86/11,691/0.74%/7.7, then 0/1,387/0.00%/7.1, then 0/1,319/0.00%/7.1, then 1/987/0.10%/7.3.

**Log the baseline as a new dated section appended to the bottom of this tasker.** Do not overwrite the table above. Living documents here are append-only with dated snapshots.

**Re-snapshot at 2 weeks and at 4 weeks.**

**Do not judge this at week 1.** Title changes take **2 to 6 weeks** to fully reflect in GSC, because Google has to recrawl the page and then re-evaluate the SERP snippet, and the reported position and CTR average across the whole window including the pre-change days. A flat week-1 reading means nothing. A flat week-4 reading is a real signal.

**What success looks like:** page CTR moving off 0.74% toward the 2.40% ceiling at roughly unchanged position. Watch the anchor rows too: if the sections start earning clicks instead of showing zeros, that is the strongest possible confirmation, because it is the exact mechanism this fix targets.

**Why anyone should care beyond one page.** Across `enneagram-corner`, **452 anchor jump-link rows carry 59,899 impressions and 4 clicks (0.01% CTR)**, against 90 real article pages at 162,538 impressions and 1,610 clicks (0.99%). Google is offering section-level answers on the SERP at scale across the entire section, and the sections are not earning the click. This page is the **pilot**. If retitling to the lookup plus chart-above-fold moves it, the same play applies to the other 451 rows, and this stops being one ticket and becomes a program.

---

## 8. Definition of done

- [ ] Title and `meta_title` rewritten to the lookup intent, verified against the live query set in the CSVs, with the rendered `<title>` confirmed to survive the 60-character cap with "Chart" intact
- [ ] Correlation chart promoted above the fold, ahead of the "vs." comparison table
- [ ] Roulo finding reframed near the top as the 9takes angle, or explicitly deferred per the §6 escape hatch with a one-line note saying why
- [ ] Meta description rewritten: 155 characters or fewer, chart-forward, zero em-dashes
- [ ] All 54 em-dashes gone. `rg '\x{2014}'` prints nothing.
- [ ] `lastmod` untouched, slug untouched, `enneagram-and-mental-illness` untouched
- [ ] `pnpm build` green, `pnpm index:blogs` run
- [ ] Baseline snapshot from a fresh GSC pull appended to §7, dated
- [ ] 2-week and 4-week re-snapshots scheduled
- [ ] One-line handoff to T-05 and T-06 stating whether the play worked, so the pattern fix has evidence behind it
