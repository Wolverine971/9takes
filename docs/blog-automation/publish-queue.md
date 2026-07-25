<!-- docs/blog-automation/publish-queue.md -->

# Publish Queue for people blogs

_Created: 2026-07-25. Companion to `backlog-queue.json`._

**The two queues are different jobs and confusing them wastes work:**

- **`backlog-queue.json`**: people who need a draft _written_. The nightly cron reads it, writes one draft per night, and skips anyone who already has a file in `src/blog/people/drafts/`.
- **This file**: drafts that already exist and are stuck. Nothing here needs writing. Everything here needs a specific unblock.

---

## Why nothing has published since 20 July

The cron is not broken. `openclaw cron list` shows all four 9takes jobs reporting `ok`, and both the creator and the publisher ran this morning.

**The publisher runs every day and finds nothing it is allowed to ship.** From `logs/blog-automation/publish-people-2026-07-25.log`:

> Result: No publishable draft found. Checked 481 candidate(s).

That is the whole diagnosis. Publishing cadence collapsed because the **publish gate got stricter and the ready pool was never re-graded to match it**.

The gate now requires all of the following (`scripts/personBlogParser.js`, lines 164 to 168 and 1037 to 1090):

| Gate                             | Requirement                                                 |
| -------------------------------- | ----------------------------------------------------------- |
| `content_quality.overall`        | ≥ 8.5                                                       |
| `content_quality.rubric_version` | **≥ 2**                                                     |
| `discoverability`                | ≥ 7                                                         |
| `grade_stability_delta`          | present, and ≤ 0.3                                          |
| `caps_applied`                   | empty                                                       |
| Images                           | `static/types/[N]s/[Person].webp` **and** `s-[Person].webp` |

The rubric-v2 requirement is the one that emptied the pool. A 2026-06-10 audit found v1 grades clustered 8.5 to 9.4 and were discoverability-blind, so v1 grades stopped counting. **Roughly 52 drafts sitting at 8.5 or above are v1 and are therefore hard-blocked**, including the highest-graded work in the backlog: Britney Spears 9.2, Ninja 9.2, Frank Lloyd Wright 9.3, Clint Eastwood 9.3.

Only about 40 of 98 unpublished drafts carry a v2 grade at all.

**So the fix is not a cron fix. It is a regrade backlog.** Until a batch of drafts is re-run through `/grade_blog` under rubric v2, the publisher will keep waking up daily and finding nothing, exactly as designed.

Publishing history confirms the shape: 45 in April, 37 in May, 21 in June, 17 in July, and 10 of July's 17 landed on a single day (19 July) as a manual batch. There has not been a daily cadence for months; there have been occasional hand-run bursts.

---

## Tier 1: unblock these first

Ordered by effort to unblock, cheapest first.

### Needs only a supervised regrade (image already made)

| Draft              | Grade | Rubric | Disc | Stability | Blocker                                       | Action                                                                       |
| ------------------ | ----- | ------ | ---- | --------- | --------------------------------------------- | ---------------------------------------------------------------------------- |
| **Alex Warren**    | 8.9   | v2 ✅  | 9 ✅ | _missing_ | `missing_grade_stability_delta`               | One supervised regrade. **Closest to shippable of anything in the backlog.** |
| **Jason Sudeikis** | 8.8   | v2 ✅  | 8 ✅ | _missing_ | `missing_grade_stability_delta`               | One supervised regrade.                                                      |
| **Jack Antonoff**  | 8.9   | v2 ✅  | 9 ✅ | **0.5**   | `grade_unstable:0.5_delta` (threshold is 0.3) | Regrade to settle the score. DJ-requested.                                   |

**Ship Alex Warren first.** His second album _Wildchild_ lands in August 2026, "Ordinary" was the top-selling song of 2025, and he is a Grammy Best New Artist nominee. Publishing into that release window is the best timing available in the whole backlog.

### Needs a full rubric-v2 regrade (v1 grade, image already made)

All of these have images and strong v1 scores. Each needs `/grade_blog` re-run under v2, which will also produce the discoverability score and stability delta the gate wants.

| Draft                  | v1 grade | Note                                                                                                                                                                                                            |
| ---------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ninja**              | 9.2      | Just lost the most-followed-Twitch crown to Kai Cenat. [NR-09](../taskers/news-refresh-2026-07/NR-09-kai-cenat.md) is researching that handover; wait for its completion note and publish with the fresh angle. |
| **Britney Spears**     | 9.2      | Durable evergreen demand, no news dependency.                                                                                                                                                                   |
| **Jeremy Allen White** | 9.0      | Rising-star tag, the third-best category in the corpus (median 398).                                                                                                                                            |
| **Camila Cabello**     | 8.8      | Swift wedding guest. Publish in the same week as [NR-11 Taylor Swift](../taskers/news-refresh-2026-07/NR-11-taylor-swift.md) and Antonoff for a linked cluster.                                                 |
| **Jensen Huang**       | 8.7      | Pair with Mira Murati; one Nvidia/Thinking Machines research pass covers both.                                                                                                                                  |

### Needs a grade from scratch (content exists, never graded)

| Draft      | Content            | Image | Note                                                                                                                                                                                                                           |
| ---------- | ------------------ | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Tyler1** | 21,231 chars in DB | ✅    | **No `content_quality` block at all.** DJ-requested. The only streamer draft with an image already made, and streamer is the top category in the corpus (median 979 impressions vs 156 for screen icons). Grade it, then ship. |
| **n3on**   | 19,064 chars in DB | ❌    | Second streamer draft. Needs a grade **and** an image. DJ-requested. Highest projected return of anything in the needs-image pile.                                                                                             |

---

## Tier 2: blocked only on images

**These three clear every editorial gate.** v2 rubric, above threshold, discoverability 9, stable. The only thing between them and production is DJ's manual Canva step. The automated type-image pipeline was removed in June 2026 and is not coming back.

| Draft                 | Grade | Rubric | Disc | Stability | Needs                                                                   |
| --------------------- | ----- | ------ | ---- | --------- | ----------------------------------------------------------------------- |
| **Christopher Nolan** | 8.8   | v2     | 9    | 0.1       | `static/types/[N]s/Christopher-Nolan.webp` + `s-Christopher-Nolan.webp` |
| **Travis Kelce**      | 8.6   | v2     | 9    | 0.0       | same pattern                                                            |
| **David Beckham**     | 8.6   | v2     | 9    | 0.0       | same pattern                                                            |

**Travis Kelce is the timely one.** He married Taylor Swift on 3 July 2026 in the year's largest celebrity story, the draft is finished and passes every check, and it has never reached the database. One image ships it.

Christopher Nolan directed _The Odyssey_, released 17 July 2026, which also puts him in the middle of the [Zendaya refresh](../taskers/news-refresh-2026-07/NR-02-zendaya.md).

---

## Tier 3: needs a full draft, not a publish

These have database rows but the rows are stubs. They belong in `backlog-queue.json`, and have been added there.

| Person            | Row content | Status                                                                                                |
| ----------------- | ----------- | ----------------------------------------------------------------------------------------------------- |
| **KSI**           | 409 chars   | Added to `backlog-queue.json` at priority 72 on 2026-07-25.                                           |
| **The Weeknd**    | 395 chars   | Stub. `famousTypes.ts` reports an image exists; the writing does not.                                 |
| **Khaby Lame**    | 0 chars     | Empty row. TikToker category medians 0 impressions across 6 published pages, so this is low priority. |
| **jacksepticeye** | 0 chars     | Empty row.                                                                                            |

---

## Do not publish these

Four drafts have images made and carry the **highest grades in the entire backlog**. They are in dead categories and should stay unpublished.

| Draft              | Grade | Category             | Category median impressions |
| ------------------ | ----- | -------------------- | --------------------------- |
| Frank Lloyd Wright | 9.3   | historical-artist    | **16**                      |
| Marie Curie        | 8.9   | historical-scientist | **9**                       |
| Edgar Allan Poe    | 8.7   | historical-artist    | 16                          |
| Mark Twain         | 8.2   | historical-artist    | 16                          |

Measured across 391 published pages (GSC, 90 days to 23 July 2026): grade correlates with traffic at roughly _r_ = 0.11. Category and search demand are what move it. Frank Lloyd Wright is the highest-graded unpublished draft on the site and would likely earn nothing.

The same applies to the 21 needs-image drafts in dead categories: Zelensky, Gandhi, Cleopatra, DeSantis, RFK Jr., Buttigieg, Marie Antoinette, Nelson Mandela and the rest. Politician median: **0**. Activist median: **0**. Commissioning images for these spends the scarcest resource on the lowest-return slots.

---

## Restoring a real cadence

Three things, in order:

1. **Clear the regrade backlog.** This is the actual blocker. A batch pass of `/grade_blog` under rubric v2 across the ~52 v1 drafts sitting at 8.5+ would refill the publishable pool in one session. Nothing else matters until this happens.
2. **Batch the image step.** Three finished drafts are waiting on Canva files, and six more Tier-1 drafts will land behind them. Images are now the second bottleneck and they are entirely manual.
3. **Then let the cron work.** The publisher already runs daily and already picks the best eligible candidate. Give it eligible candidates and the cadence returns without touching the automation.

**Do not loosen the gate to force a cadence.** It was tightened deliberately after the June audit found v1 grades were inflated and discoverability-blind, and a separate July blind-regrade found six of nine v2 grades at 8.5+ collapsed to 7.0 to 7.9 on re-scoring. The gate is doing its job. The backlog is what is out of date.
