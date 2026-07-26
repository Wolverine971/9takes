<!-- docs/content-analysis/2026-07-25_people-corpus-triage.md -->

# People Corpus Triage

**Date:** 2026-07-25
**Scope:** all 523 people in `src/lib/components/molecules/famousTypes.ts`, joined against a fresh Search Console pull.
**GSC window:** 2026-04-24 to 2026-07-23 (90 days, pulled 2026-07-25).
**Reproduce:** `node scripts/analyze-people-corpus.mjs --with-titles`
**Machine-readable:** [`2026-07-25_people-corpus-triage.json`](2026-07-25_people-corpus-triage.json)

**Downstream work this produced:** the twelve refresh taskers in [`docs/taskers/news-refresh-2026-07/`](../taskers/news-refresh-2026-07/README.md) and the publishing diagnosis in [`docs/blog-automation/publish-queue.md`](../blog-automation/publish-queue.md).

---

## 1. Verdict

The people corpus does not have a coverage problem. It has a **rank problem**.

391 published analyses drew **179,696 impressions and 946 clicks** in 90 days. That is a **0.526% sitewide CTR** against a median position of **9.4**, on queries that match the pages almost perfectly (`ishowspeed personality`, `messi personality type`, `sabrina carpenter enneagram`). The demand is real, the intent match is exact, and the pages sit at the bottom of page one or the top of page two, where clicks barely exist.

**118 of 391 published pages drew zero impressions.** Twelve pages carry **29.3%** of all demand; fifty carry **63.2%**.

The second finding is about who to write about, not how well. **Category median impressions range from 979 (streamer) to 0 (activist, movement-leader, campaign-politician, historical-artist).** Grade correlates with traffic at roughly _r_ = 0.11. Picking the subject is a bigger lever than writing the piece well, and the publish backlog is not sorted that way.

---

## 2. A hypothesis that was tested and refuted

The obvious explanation for a 0.5% CTR is that the persona titles do not match search intent: the query says `sabrina carpenter personality type`, the title says "Why Sabrina Carpenter's Humor Hides an Achievement Machine."

Split all 391 published pages by whether the SERP title (`meta_title`, falling back to `title`) contains _personality_, _enneagram_, _type N_, or _mbti_:

| SERP title           | Pages | CTR        |
| -------------------- | ----- | ---------- |
| Contains the keyword | 82    | **0.394%** |
| Does not             | 309   | **0.576%** |

**Keyword titles convert worse.** Retitling toward keywords is not the lever, and the persona titles should be left alone. A ~0.5% CTR across the board at position 8 to 12 is what page-two-plus-AI-Overviews looks like in 2026. The only thing that moves clicks is moving rank, and on person queries with live news cycles, freshness is the cheapest rank lever available.

This test is wired into the script behind `--with-titles` so it can be re-checked rather than re-assumed.

---

## 3. Category yield: who to write about

Median impressions per published page, by type tag. Medians, not means, so one breakout cannot carry a category. Tags with fewer than 5 published pages are not scored.

| Tag                 | Pages | Median  | Mean  | Max    |
| ------------------- | ----- | ------- | ----- | ------ |
| streamer            | 8     | **979** | 2,441 | 12,312 |
| pop-star            | 12    | **616** | 1,172 | 7,268  |
| rising-star         | 18    | **398** | 981   | 3,452  |
| newMovieStar        | 19    | **343** | 941   | 3,452  |
| techie              | 42    | **246** | 507   | 2,681  |
| investor            | 9     | **201** | 354   | 1,027  |
| celebrity           | 69    | **132** | 486   | 3,460  |
| movieStar           | 80    | **114** | 424   | 3,452  |
| creator             | 74    | **93**  | 613   | 12,312 |
| historical          | 22    | **75**  | 289   | 1,182  |
| musician            | 72    | **47**  | 491   | 1,954  |
| rapper              | 8     | **9**   | 163   | 600    |
| tiktoker            | 6     | **3**   | 14    | 59     |
| politician          | 34    | **2**   | 198   | 1,827  |
| singer-songwriter   | 5     | **1**   | 7     | 30     |
| campaign-politician | 10    | **0**   | 83    | 305    |
| activist            | 5     | **0**   | 6     | 24     |
| movement-leader     | 5     | **0**   | 3     | 8      |
| historical-artist   | 5     | **0**   | 16    | 81     |

Full table of all 38 scored tags is in the JSON.

**What holds:** streamer, pop-star and rising-star are genuinely strong and the corpus is thin in all three (8, 12 and 18 pages). Politicians, activists, TikTokers and historical-artists genuinely earn nothing, across 34, 5, 6 and 5 pages respectively.

### The caveat that limits this finding

**Tag assignment is inconsistent, and it is doing some of the work the categories appear to be doing.**

`musician` (72 pages, median 47) and `pop-star` (12 pages, median 616) are both applied to pop artists, and nothing in the data explains which artist got which tag. Sabrina Carpenter carries `pop-star` and 7,268 impressions. Alex Warren, the top-selling singles artist of 2025, carries `musician, creator`. That is a thirteen-fold difference in projected yield produced by a tagging decision, not by a difference between the two people.

So: **trust the extremes, not the middle.** Streamer-versus-activist is a real finding across a real sample. Musician-versus-pop-star is mostly a tagging artifact. Any recommendation that leans on a mid-table tag should be justified by search demand and newsworthiness instead, and a tag-hygiene pass over the corpus would make the next run of this analysis considerably sharper.

### Where this corrected an earlier read

An earlier pass of this analysis reported `historical` at a median of **9** and used it to argue against publishing four high-grade drafts (Frank Lloyd Wright 9.3, Marie Curie 8.9, Edgar Allan Poe 8.7, Mark Twain 8.2). With the join corrected (see §6), **`historical` medians 75**, which is above `musician`. That advice was overstated and is withdrawn.

What survives is narrower: the `historical-artist` tag specifically medians **0** across 5 pages, which is a thin sample. Wright, Poe and Twain carry it; Curie does not. Treat them as unremarkable rather than as traps, and decide on search demand for the individual.

The drafts that do trip the trap test now (strong grade, best-case category projection under 50 impressions) are all `musician`-tagged: **Shakira 9.0, Camila Cabello 8.8, Bruno Mars 8.5**. Per the caveat above, that is as likely to be a tagging problem as a demand problem.

---

## 4. The refresh queue

Ranked by impressions × staleness. News weighting is a human judgement and deliberately not modelled in the script; this ranks candidates to research, and the twelve taskers carry the verified events.

| Slug              | Type | Impressions | Clicks | CTR        | Position | Age  | Top query                       |
| ----------------- | ---- | ----------- | ------ | ---------- | -------- | ---- | ------------------------------- |
| ishowspeed        | 8    | 12,312      | 19     | 0.154%     | 8.1      | 114d | `ishowspeed personality`        |
| zendaya           | 6    | 3,452       | 18     | 0.521%     | 9.0      | 190d | `zendaya personality`           |
| hasan-piker       | 8    | 3,074       | 10     | 0.325%     | 9.7      | 181d | `hasan piker mbti`              |
| sabrina-carpenter | 3    | 7,268       | 12     | 0.165%     | 6.7      | 68d  | `sabrina carpenter personality` |
| jordi-hays        | 3    | 3,634       | 79     | **2.174%** | 7.9      | 127d | `jordi hays`                    |
| jack-black        | 7    | 2,827       | 17     | 0.601%     | 8.3      | 158d | `jack black personality type`   |
| elon-musk         | 5    | 2,568       | 3      | 0.117%     | 13.7     | 158d | `elon musk enneagram type`      |
| shawn-ryan        | 5    | 2,433       | 13     | 0.534%     | 9.0      | 166d | `sean palmisano`                |
| sam-altman        | 4    | 2,681       | 11     | 0.410%     | 8.8      | 147d | `sam altman personality`        |
| ryan-gosling      | 9    | 3,448       | 29     | 0.841%     | 8.1      | 114d | `ryan gosling personality`      |

Top 30 in the JSON.

**Two pages deserve separate mention.**

**Jordi Hays** converts at **2.174%**, roughly four times the corpus average and the best-performing page in the people corpus. It is not stale and does not need a refresh. It is worth studying structurally and worth not breaking.

**Elon Musk** is the inverse: the most-searched person on earth (~4.4M/month), 3 clicks from 2,568 impressions, position **13.7**, and page-two on the broad queries (`elon musk personality type` sits at 27.8). That is a competitiveness problem, not a freshness problem, and it will not be fixed by adding recent events.

### Queries the audience is actually asking

The iShowSpeed query mix is the clearest signal in the dataset that readers arrive wanting psychology, not news:

| Query                                     | Impressions | Position |
| ----------------------------------------- | ----------- | -------- |
| `ishowspeed personality`                  | 792         | 8.7      |
| `does ishowspeed have anger issues`       | 402         | 8.0      |
| `ishowspeed personality type`             | 189         | 8.9      |
| `is ishowspeed kind`                      | 83          | 9.2      |
| `how does ishowspeed have so much energy` | 66          | 7.8      |

Anger, kindness and energy: gut-center regulation, the 8-to-2 integration arrow, and the type's engine. Three of the top six queries on the site's biggest page are Enneagram questions in plain language. That observation is what the editorial doctrine in the tasker batch is built on.

---

## 5. Publishing is blocked, and the cron is not the reason

132 drafts are unpublished; 47 already have images.

All four 9takes OpenClaw jobs report `ok`. A publish job runs daily. From `logs/blog-automation/publish-people-2026-07-25.log`:

> Result: No publishable draft found. Checked 481 candidate(s).

The publish gate in `scripts/personBlogParser.js` now requires `rubric_version >= 2`, `overall >= 8.5`, `discoverability >= 7`, a present `grade_stability_delta` at or under 0.3, no active caps, and both image variants. The rubric-v2 requirement is the one that emptied the pool: roughly **52 drafts at 8.5 or above still carry v1 grades** and are hard-blocked, and only about 40 of 98 unpublished drafts carry a v2 grade at all.

**The fix is a regrade backlog, not an automation fix.** Full tiered unblock list in [`publish-queue.md`](../blog-automation/publish-queue.md).

Publishing history confirms the shape: 45 in April, 37 in May, 21 in June, 17 in July, with 10 of July's 17 landing on 19 July as a hand-run batch.

---

## 6. Method, and two bugs this analysis had to fix

The first pass of this work ran as inline `node -e` one-liners. Two join bugs came out of that, both now fixed in `scripts/analyze-people-corpus.mjs`, which is why the script exists at all.

**Bug 1: exact filename matching.** Draft files were joined to database rows by exact lowercased filename. `Charli-D'Amelio.md` and `J.K.-Rowling.md` therefore failed to match `charli-damelio` and `jk-rowling`, and both published people were reported as "written but never pushed to the database." This is the same apostrophe-and-period slug class already recorded in the 2026-07-19 GSC indexing audit. The script now uses the canonical `normalizePersonalitySlug()` from `scripts/lib/personalitySeo.js` on both sides of every join.

**Bug 2: URL variants overwriting instead of aggregating.** A single page appears in the GSC export as several rows: a canonical URL, mixed-case variants (`/personality-analysis/David-Friedberg`), and anchor rows (`/personality-analysis/agatha-christie#how-did-...`). The first pass silently dropped the variants; a naive `Map.set` fix then kept only whichever row was read last. Both undercounted. The script now **sums clicks and impressions across all variants of a slug and computes an impression-weighted position**, so a 3-impression anchor row cannot drag a page's reported rank.

Net effect of bug 2 on the headline numbers: 176,834 impressions and 940 clicks became **179,696 and 946**, and the top-12 concentration moved from 27% to **29.3%**. Category medians were unaffected at the top of the table (streamer 979, pop-star 616, rising-star 398 all reproduce exactly) but changed materially in the middle, which is what produced the `historical` correction in §3.

**Known limitations:**

- GSC reports the top 1,000 pages and top 5,000 page+query pairs. Long-tail pages below that cutoff read as zero impressions and are indistinguishable from genuinely dead pages.
- `/personality-analysis/type/N` index pages carry 19,217 impressions between them and are excluded from every person-level figure here. They are a separate surface and worth their own analysis.
- The refresh score is `impressions × min(ageDays / 90, 2.5)`. It has no news term, so it cannot see that a page is factually wrong. Lionel Messi ranks 20th on this score and was first in the tasker queue, because his page was edited five days before the World Cup final it describes.
- Category medians are computed only over published pages, so a category the site has never tried is invisible rather than unpromising.
