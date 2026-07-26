<!-- docs/taskers/news-refresh-2026-07/README.md -->

# News Refresh Batch, July 2026

**For:** one agent per tasker, run independently
**Owner:** DJ
**Created:** 2026-07-25
**Status:** open
**Related:** `docs/taskers/README.md` (T-16), `docs/data/gsc/2026-07-25-*.csv`, `src/lib/components/molecules/famousTypes.ts`

---

## 0. What this batch is

Twelve published personality-analysis blogs are stale against events that happened after their last edit. Each one has a tasker file in this directory. Each tasker is self-sufficient: an agent with no memory of the analysis that produced it can open one file, read it top to bottom, and execute.

The batch came out of a 2026-07-25 join of live Search Console data (90-day window, 24 Apr to 23 Jul) against all 523 people in `famousTypes.ts`, plus news verification per person.

**The analysis is written up in [`docs/content-analysis/2026-07-25_people-corpus-triage.md`](../../content-analysis/2026-07-25_people-corpus-triage.md)** and is reproducible with `node scripts/analyze-people-corpus.mjs --with-titles`. Read its §6 before quoting any number back: two join bugs were found and fixed, and one earlier finding about historical figures was withdrawn.

The headline diagnosis:

- 391 published analyses produced **176,834 impressions and 940 clicks** in 90 days.
- Nearly every page ranks **position 8 to 12** on queries that match it exactly.
- **Twelve pages carry 27% of all impressions** from 3.1% of the corpus. This batch is those twelve.

**One hypothesis was tested and killed. Do not re-litigate it.** Splitting all 391 pages by whether the SERP title contains _personality / enneagram / type / mbti_ gives 0.391% CTR **with** the keyword and 0.585% **without**. Keyword titles perform worse. Do not retitle pages toward keywords, and do not replace persona titles. The lever is rank, and freshness is the cheapest rank lever on person queries with live news cycles.

---

## 1. The doctrine, read this before writing a word

**9takes is not a news station.** The news is the door. The psychology is the room. If a paragraph in your refresh would sit comfortably in People magazine, it does not belong here.

### 1.0 The main rule: the personality analysis is the product

**News earns space on the page only when it adds depth to the personality analysis.** Nobody arrives here to learn what happened. They arrive to understand what kind of person this is. An event belongs in the piece only if a reader finishes that passage understanding the subject better than they did before it.

Added 2026-07-25, after the Hasan Piker refresh exposed the mechanism. Every rule below is machinery for enforcing this one sentence.

**Run every candidate event through the admission test. Write down the tier.**

| Tier            | What it is                                                                                                                                       | What it earns                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| **1, Deepens**  | Reveals a facet the page has not shown, complicates the type read, or is the first real evidence for something the page was asserting without it | Prose. A subsection, sometimes a section.                          |
| **2, Confirms** | More evidence for a pattern the page already establishes with other examples                                                                     | A clause, a bullet, a date in a timeline. **Never a new section.** |
| **3, Neither**  | It happened, it got covered, it says nothing about who this person is                                                                            | **Nothing. It does not go in the blog.**                           |

Most news is Tier 2 or Tier 3. If your triage comes back mostly Tier 1, you are grading yourself generously. Redo it.

The tell for a Tier 3 item that snuck through: a paragraph that reports what happened, who objected, and what the subject said back, without once naming a behavior pattern, a feeling underneath, or a cost. That paragraph belongs in a news roundup. Cut it.

### 1.1 The length ceiling: 4,500 words

`scripts/blog-lint.sh` now **fails** any draft whose prose body exceeds 4,500 words. Three operating rules:

1. **A page already over 4,500 must come down.** You may not add net words to it.
2. **Near the ceiling, spend deliberately.** Adding 400 words at 4,300 is a decision to cut 200 elsewhere, not a surprise at lint time.
3. **Under the ceiling is not a quota.** A 3,200-word page that says everything worth saying stays 3,200 words.

The ceiling is a **bloat alarm, not a performance target.** Per-page variance is enormous: the best-converting page in the corpus (`jordi-hays`, 2.23% CTR) runs 4,771 words. What the ceiling reliably catches is _accretion_, a page that got long by having things added rather than by being written that way.

Why it exists, from the 2026-07-25 corpus join against live GSC:

- `corr(words, position) = 0.02`. **Length buys no rank.**
- Controlling for search demand, the longer half of every impression tier converts **12 to 31% worse** at effectively identical rank.
- `corr(words, impressions) = +0.375`. The longest pages are the highest-traffic ones, because those are the ones that get refreshed. **That is the ratchet**, and this batch sits at the top of it: pokimane 8,062 words, sam-altman 7,865, ishowspeed 7,731, zendaya 6,981, sydney-sweeney 6,832, against a corpus median of 3,885.

Deliberate exceptions use `BLOG_LINT_WORD_CEILING=<n>` and require an argument for why this page needs the room, recorded in the refresh ledger. Never use it to silence a page you have not examined.

### 1.2 Cut before you add

Write the **cut list before the add list**. On a page near the ceiling, an add list longer than the cut list means you have not finished triaging. Cheapest cuts, in order:

- Duplicated quotes and anecdotes (the creator spec: quotes appear once, including the epigraph)
- Type-theory exposition beyond the **4-paragraph ceiling** outside the diagnosis section and the Rabbit Hole
- Chronological controversy lists. Three instances sharing one mechanism beat six in date order at half the words.
- Colour that does not carry the argument
- Prior refreshes' Tier 2 material that was given prose when it deserved a clause

### 1.3 Integrate, do not append

The failure this doctrine exists to prevent is a sharp new section bolted onto the back of a stale page, leaving two documents stapled together with the argument starting halfway down. Hasan Piker reached 8,881 words with its psychological spine beginning at word 4,559.

New material goes **where the argument needs it**. If the news changes the spine, rewire the page around it rather than leaving the old thesis in the first half and the new one in the second.

### 1.4 Use the pipeline

Refreshes are no longer hand-rolled. Run:

```bash
./scripts/run-blog-pipeline.sh <Person-Name> --refresh
```

This swaps stage 1 to `/blog_refresh_people`, skips stage 3, and applies every gate, the grade, and the revise-and-regrade loop that new drafts get. It reports the word delta at the end. To do a single stage by hand, invoke `/blog_refresh_people <Person-Name>` directly.

### The eight questions

Every refresh answers the same eight questions. Person-specific versions are in each tasker; these are the general forms.

**1. What is the feeling underneath?**
Not what happened. What emotion is driving the behavior. Anchor it to the center of intelligence:

| Center     | Types   | Core emotion |
| ---------- | ------- | ------------ |
| Gut / body | 8, 9, 1 | Anger        |
| Heart      | 2, 3, 4 | Shame        |
| Head       | 5, 6, 7 | Fear         |

Name which one is showing and what it looks like in this specific person, in this specific event. "Anger" is not an answer. "Anger routed into work so it never has to be aimed at a person" is.

**2. What is the inner dialogue?**
Write the sentence this person is plausibly saying to themselves right now, in their own idiom. Not a fabricated quote, and never presented as one. An inferred self-talk line that the type makes predictable. This is usually the most quotable thing in the piece.

**3. Is this evidence for, against, or complicating the type read?**
Say it out loud in the piece. If every news event conveniently confirms the type, that is motivated reasoning and readers can smell it. The strongest pieces name what does not fit. A refresh that only confirms is a weak refresh.

**4. Stress or integration?**
Under this specific pressure, which way is the arrow pointing? This is the most falsifiable claim the Enneagram lets you make about a live event. Use it.

| Type | Stress → | Integration → |
| ---- | -------- | ------------- |
| 1    | 4        | 7             |
| 2    | 8        | 4             |
| 3    | 9        | 6             |
| 4    | 2        | 1             |
| 5    | 7        | 8             |
| 6    | 3        | 9             |
| 7    | 1        | 5             |
| 8    | 5        | 2             |
| 9    | 6        | 3             |

**5. Does this add to their story or subtract from it?**
Growth, regression, or the same old loop running again? Place the event on the person's arc. "He did the thing he has always done, at a larger scale" is a finding. So is "this is the first time he has not."

**6. What did it cost them?**
Every type buys something with its strategy and pays for it somewhere else. What did this event cost this person that a different type would not have paid? The cost is usually where the piece earns its keep.

**7. What would the other eight see?**
The 9takes mechanic. At minimum, name the two or three types who would read this moment completely differently, and how. This is what makes the piece ours and not a psychology-blog take.

**8. What does the reader do with this?**
The mirror turn. Which reader recognizes themselves in this pattern, and what do they now see about their own? End on the reader, not the celebrity.

### Discipline rules

- **Observable behavior is evidence. Feelings are interpretation. Keep them visibly separate.** Write "he did X," then "which reads as Y." Never "he felt Y." The distinction is the whole credibility of the format.
- **Report the event in the fewest sentences that make the psychology legible.** Compress the news hard. A reader who already knows the news should not have to wade.
- **No mind-reading presented as fact.** Hedge the interpretation, not the observation, and do it with sentence structure, not with the banned hedge words (`perhaps`, `somewhat`, `might`, `tend to`).
- **Write so it still reads in twelve months.** Date-stamp the event once, then stop saying "recently," "this week," "currently."
- **No armchair diagnosis of mental illness.** Personality patterns, not pathology. This is a hard line.
- **Do not moralize.** The type is not good or bad. The strategy has costs. Report the costs, skip the verdict.
- **Do not let the news reset the thesis.** These pages already have a type read that ranks. You are adding evidence to an existing argument, not rewriting the person. If the news genuinely contradicts the existing type, say so in the tasker's completion notes and stop rather than silently re-typing them.

---

## 2. Mechanics, how to actually ship the edit

These are live, ranking pages. The rules are not optional.

**Editing a live blog:**

```bash
node scripts/personBlogParser.js <Person-Name>     # e.g. Zendaya
```

This pushes draft changes to the live DB row and **preserves `lastmod`**.

- **Never** run `--publish` against an already-live blog. It rewrites `lastmod` to today, which breaks DJ's manual-lastmod rule. `--publish` is the first-release workflow for new drafts only.
- **Never** edit the `lastmod` frontmatter field by hand. DJ manages it.
- The single-person form is parallel-work-safe. Use it. Do not run corpus-wide passes.

**Content rules that fail the build or leak in production:**

- **Zero em-dashes** in blog content. Not one.
- **Never leave `<!-- QUALITY GRADE:` or `QUALITY_FEEDBACK` HTML comments in the file.** 88 published pages already broadcast their own grades in page source (see `docs/taskers/T-10-*`). Do not add to it.
- Watch YAML quoting in FAQ frontmatter. A `\'` instead of `''` produces invalid YAML, and drafts are bundled into the build, so one bad file fails the whole deploy.
- Do not touch `enneagram-and-mental-illness`. It is frozen.

**Parallel-work safety:** DJ and other agents edit this repo at the same time. Never `git stash`, never a wide reset, never a bulk operation that could clobber uncommitted work.

**Sources:** every factual claim you add needs a real, checkable source. This corpus has a documented history of fabricated citations (`docs/taskers/T-01-*`) and a published legal-risk claim. If you cannot source it, cut it.

---

## 3. The queue

Ordered by impressions × staleness × confirmed news. Run them independently; there are no dependencies between taskers except the two noted pairs.

| #   | Tasker                                          | Type | Impressions | Position | Stale | The event                                                |
| --- | ----------------------------------------------- | ---- | ----------- | -------- | ----- | -------------------------------------------------------- |
| 01  | [iShowSpeed](NR-01-ishowspeed.md)               | 8    | 12,312      | 8.1      | 113d  | World Cup closing ceremony, hit single, TIME100          |
| 02  | [Zendaya](NR-02-zendaya.md)                     | 6    | 3,452       | 9.0      | 189d  | Secret marriage confirmed, five 2026 releases, retreat   |
| 03  | [Hasan Piker](NR-03-hasan-piker.md)             | 8    | 3,074       | 9.7      | 180d  | Seventh ban, federal inquiry, congressional resolution   |
| 04  | [Sabrina Carpenter](NR-04-sabrina-carpenter.md) | 3    | 7,263       | 6.7      | 67d   | _Man's Best Friend_ era; best-ranked page you own        |
| 05  | [Lionel Messi](NR-05-lionel-messi.md)           | 9    | 3,460       | 8.8      | ,     | **Factually wrong.** Edited 14 Jul; final was 19 Jul     |
| 06  | [Sam Altman](NR-06-sam-altman.md)               | 4    | 2,681       | 8.8      | 146d  | ~$1T IPO, public self-reversal                           |
| 07  | [Elon Musk](NR-07-elon-musk.md)                 | 5    | 2,568       | 13.7     | 157d  | Most-searched person alive, worst-ranked major page      |
| 08  | [Dario Amodei](NR-08-dario-amodei.md)           | 5    | 1,585       | 7.8      | 124d  | ~$1T IPO, walked back the jobs claim                     |
| 09  | [Kai Cenat](NR-09-kai-cenat.md)                 | 7    | 2,621       | 8.3      | 113d  | Now #1 on Twitch, passed Ninja                           |
| 10  | [Sydney Sweeney](NR-10-sydney-sweeney.md)       | 3    | 3,227       | 7.6      | 67d   | Full reputation arc in one year                          |
| 11  | [Taylor Swift](NR-11-taylor-swift.md)           | 3    | 311         | 10.4     | 157d  | Married Kelce 3 Jul. **Rewrite already drafted on disk** |
| 12  | [MrBeast](NR-12-mrbeast.md)                     | 8    | 1,532       | 9.9      | 156d  | Beast Games S2/S3, 1 click from 1,532 impressions        |

**Two pairs share research. Run them together to halve the work:**

- **NR-06 + NR-08** (Altman, Amodei), same IPO wave, same G7 appearance, same public reversal on AI and jobs.
- **NR-01 + NR-09** (iShowSpeed, Cenat), overlapping creator-economy sources; Cenat's rise is partly Ninja's fall, which also feeds the Ninja publish.

**Suggested order:** NR-05 first and alone. It is the only page in the batch that is currently _wrong_ rather than merely dated, and it is a short fix. Then NR-01, which is the single biggest traffic win on the site. Then the rest in table order.

---

## 4. Do not break this one

**Jordi Hays**: 3,539 impressions, **79 clicks at position 7.9**. A 2.2% CTR, roughly four times the corpus average, and the best-converting page in the entire people corpus. It is not in this batch and it does not need a refresh. If you are looking for a model of what a converting page looks like structurally, read it. Do not edit it.

---

## 5. Definition of done, per tasker

A tasker is complete when:

1. Every research question in its §2 has an answer with a checkable source, or is explicitly marked "no evidence found."
2. The refreshed sections answer all eight doctrine questions, with question 3 (for / against / complicating) answered _in the published text_, not just in notes.
3. Zero em-dashes, zero quality-comment markers, valid YAML.
4. `node scripts/personBlogParser.js <Person>` runs clean and `lastmod` is unchanged.
5. The tasker file's Status line is updated to `done` with a one-paragraph completion note covering: what changed, what evidence complicated the type read, and anything the next agent should know.
