<!-- docs/development/rabbit-hole-baseline-snapshot.md -->

# Rabbit Hole + URL Fix — Baseline Snapshot

**Baseline captured:** 2026-04-17 (pre-deploy of URL case fix; Elon rabbit hole already live)
**Follow-up scheduled:** 2026-05-01 (~2 weeks)
**Purpose:** establish pre-intervention GSC + LLM citation numbers so we can attribute CTR/citation changes to the right intervention (rabbit hole vs. URL fix vs. both).

> **Timing matters.** The URL case fix is deployed-pending as of this writing. Capture GSC numbers _before_ it lands in production. Once the 301 redirects start firing, title-case impressions collapse into lowercase URLs and the pre/post comparison gets muddy.

---

## 0. Attribution plan

Three interventions are landing within days of each other. We need to separate their effects:

| Intervention                                 | Landed                               | Expected signal                                                                                |
| -------------------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------- |
| Elon rabbit hole live in DB                  | 2026-04-17 (pre-baseline)            | Elon CTR lift; LLM citation accuracy lift on wing/subtype/arrow queries                        |
| URL case 301 redirects                       | Post-deploy (imminent)               | Impression + click consolidation from title-case → lowercase URLs across all personality pages |
| Class A retrofits (Caleb, Dario, Pete, Depp) | 2026-04-17 drafts; Depp DB-published | CTR + LLM citation lift on those specific pages (Depp live, others pending DB push)            |

**Attribution method:**

1. **Elon is the headline datapoint.** High traffic, rabbit hole live, control-matched by pulling an equivalent high-traffic _non-retrofitted_ page (Dua Lipa or Tom Hiddleston).
2. **Compare deltas, not absolutes.** Elon delta minus control delta = rabbit hole effect, net of URL fix.
3. **LLM citations are the cleaner measurement.** They don't get confounded by URL consolidation — they test whether the rabbit hole _content_ changed what models surface.
4. **CTR on the 4 Tier-4 retrofits** is noisy (low-traffic pages) — use as directional signal, not proof.

---

## 1. GSC snapshot — baseline (fill in from Search Console today)

### 1.1 Retrofit targets (rabbit hole applied)

| Page          | URL variant                           | Clicks (past 28d) | Impressions (past 28d) | CTR | Avg position |
| ------------- | ------------------------------------- | ----------------- | ---------------------- | --- | ------------ |
| Elon Musk     | `/personality-analysis/elon-musk`     |                   |                        |     |              |
| Elon Musk     | `/personality-analysis/Elon-Musk`     |                   |                        |     |              |
| Caleb Hearon  | `/personality-analysis/caleb-hearon`  |                   |                        |     |              |
| Dario Amodei  | `/personality-analysis/dario-amodei`  |                   |                        |     |              |
| Dario Amodei  | `/personality-analysis/Dario-Amodei`  |                   |                        |     |              |
| Pete Davidson | `/personality-analysis/pete-davidson` |                   |                        |     |              |
| Johnny Depp   | `/personality-analysis/johnny-depp`   |                   |                        |     |              |

**Note:** Caleb/Dario/Pete drafts are retrofitted but DB state uncertain. Depp is DB-published but the retrofit needs to be re-pushed. Confirm which are actually live in DB before interpreting deltas.

### 1.2 Controls (no retrofit, high traffic — matched pair for Elon)

| Page            | URL variant                             | Clicks (past 28d) | Impressions (past 28d) | CTR | Avg position |
| --------------- | --------------------------------------- | ----------------- | ---------------------- | --- | ------------ |
| Dua Lipa        | `/personality-analysis/dua-lipa`        |                   |                        |     |              |
| Tom Hiddleston  | `/personality-analysis/tom-hiddleston`  |                   |                        |     |              |
| Tom Hiddleston  | `/personality-analysis/Tom-Hiddleston`  |                   |                        |     |              |
| Sydney Sweeney  | `/personality-analysis/sydney-sweeney`  |                   |                        |     |              |
| Sydney Sweeney  | `/personality-analysis/Sydney-Sweeney`  |                   |                        |     |              |
| Gwyneth Paltrow | `/personality-analysis/gwyneth-paltrow` |                   |                        |     |              |

### 1.3 URL case pairs to watch for consolidation

Record both variants today; expect title-case → 0 after URL fix ships.

| Pair              | Title-case clicks | Title-case impr | Lowercase clicks | Lowercase impr |
| ----------------- | ----------------- | --------------- | ---------------- | -------------- |
| Ryan-Gosling      |                   |                 |                  |                |
| Tom-Hiddleston    |                   |                 |                  |                |
| Hasan-Piker       |                   |                 |                  |                |
| Sam-Altman        |                   |                 |                  |                |
| Dario-Amodei      |                   |                 |                  |                |
| Alexis-Bledel     |                   |                 |                  |                |
| Timothee-Chalamet |                   |                 |                  |                |
| Sydney-Sweeney    |                   |                 |                  |                |

### 1.4 Top 10 query list for each retrofit target

GSC → URL Inspection → Performance → filter by page → export top queries. Needed because if a retrofit lifts CTR, we want to see _which queries_ got better — that tells us whether fan-out is working. Paste top-10 per page:

```
Elon Musk (past 28d):
  1. ____________________________ — clicks __, impr __, CTR __, pos __
  2. ____________________________ — ...
  (up to 10)
```

Repeat for Caleb / Dario / Pete / Depp.

---

## 2. LLM citation snapshot — baseline

Collected via the Chrome browser tasker — see `docs/development/llm-citation-baseline-tasker.md`.

Summary results table to fill in once the agent runs:

| Page           | Query type           | Claude cites 9takes? | ChatGPT cites 9takes? | Perplexity cites 9takes? | Answer accuracy (matches page's typing) |
| -------------- | -------------------- | -------------------- | --------------------- | ------------------------ | --------------------------------------- |
| Elon Musk      | Primary type         |                      |                       |                          |                                         |
| Elon Musk      | Wing                 |                      |                       |                          |                                         |
| Elon Musk      | Subtype              |                      |                       |                          |                                         |
| Elon Musk      | Stress/growth arrows |                      |                       |                          |                                         |
| Elon Musk      | Counterargument      |                      |                       |                          |                                         |
| Caleb Hearon   | (5 queries)          |                      |                       |                          |                                         |
| Dario Amodei   | (5 queries)          |                      |                       |                          |                                         |
| Johnny Depp    | (5 queries)          |                      |                       |                          |                                         |
| **Controls:**  |                      |                      |                       |                          |                                         |
| Dua Lipa       | Wing                 |                      |                       |                          |                                         |
| Tom Hiddleston | Subtype              |                      |                       |                          |                                         |
| Sydney Sweeney | Counterargument      |                      |                       |                          |                                         |

---

## 3. Follow-up (2026-05-01)

Re-run §1 and §2 with the same pages and queries. Compute:

- **ΔCTR** per page (post − pre)
- **ΔCTR for retrofit set minus ΔCTR for control set** → rabbit hole effect
- **Citation-rate delta** per query type on retrofit pages (more meaningful than absolute rate)
- **URL consolidation** — title-case clicks should trend to zero; lowercase should absorb

### 3.1 Decision criteria for Phase 3

- **Green (ship Phase 3 Class B authoring):** Elon ΔCTR − control ΔCTR ≥ +0.3 pp; OR citation-rate on wing/subtype queries on retrofit pages ≥ 2× control rate.
- **Yellow (iterate before Phase 3):** Elon ΔCTR flat, but LLM citations improved on retrofit pages. Investigate: is the rabbit hole invisible to human snippet-scanners? Does the `<summary>` need rewording?
- **Red (pause, diagnose):** No movement on either dimension. Likely the DB hadn't fully propagated, or Google hasn't re-crawled. Push indexing requests and extend the measurement window 2 more weeks before deciding.

---

## 4. Known confounders

- **Depp DB push pending.** If Depp's draft isn't pushed before baseline, his baseline measurement is of the _pre-retrofit_ page, and his follow-up will show the retrofit delta. Document push date here: `_______`
- **Tier 4 drafts (Caleb, Dario, Pete) are draft-only.** Their `blogs_famous_people` rows may not have the retrofit yet. If they're still draft-only on 2026-05-01, they're _not_ measurement targets — just inventory.
- **Google's own crawl cadence** for low-impression pages can be weeks. Consider requesting indexing in GSC for all 4 retrofit targets after the baseline is captured.
- **Seasonal/topical traffic spikes** (a celebrity news event) can swamp the signal. Note any spikes in the follow-up.

---

## 5. Status

| Step                                    | Status                                   |
| --------------------------------------- | ---------------------------------------- |
| GSC §1.1 baseline captured              | ⏸ DJ action                             |
| GSC §1.2 control baseline captured      | ⏸ DJ action                             |
| GSC §1.3 URL pairs captured             | ⏸ DJ action                             |
| GSC §1.4 top queries per page           | ⏸ DJ action                             |
| LLM baseline via Chrome tasker          | ⏸ See `llm-citation-baseline-tasker.md` |
| Depp DB push                            | ⏸ DJ action                             |
| Indexing requests submitted in GSC      | ⏸ Optional today                        |
| 2-week follow-up scheduled (2026-05-01) | ⏸ Calendar it                           |
