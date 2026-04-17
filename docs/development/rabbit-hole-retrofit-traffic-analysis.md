<!-- docs/development/rabbit-hole-retrofit-traffic-analysis.md -->

# Traffic Analysis — Rabbit Hole Retrofit Prioritization

**Analyzed:** 2026-04-17
**Source data:** Google Search Console, past 3 months + past 1 month (supplied by DJ)
**Purpose:** Normalize traffic signal, cross-reference with the existing-mention signal tier, and produce a prioritized retrofit queue for the rabbit hole + fan-out strategy.

---

## 0. Executive summary

**The core finding:** personality analysis pages have a massive impression-to-click gap. Google is already surfacing these pages for broad and varied queries, but the click-through rate is brutal — Elon Musk at 0.087% (20 clicks on 22,870 impressions), most top-traffic celebrity pages under 0.5% CTR, versus `/enneagram-corner/` content routinely clearing 2–5%. This gap **is** the fan-out opportunity: Google is fanning queries to these pages, and the pages aren't matching well enough on sub-queries to convert. The rabbit hole + fan-out retrofit is targeted directly at this problem.

**The strategic implication:** highest-leverage retrofits are the pages with the biggest _wasted impressions_ (high imp × low CTR), not necessarily the pages with the most raw material. Raw-material richness reduces per-page effort; impression volume determines the size of the lift.

**Recommended sequencing:**

1. **Validation first.** Elon Musk already has a rabbit hole block in its draft but it's unclear whether that version is actually live in the DB. Push to DB, measure 2-week CTR delta. This is our one real datapoint. Do not scale until we have it.
2. **Class A quick wins** (6–8 pages, ~4 hours): Tier 3/4 pages where raw material already exists — proves the Distribution Rule workflow on low-stakes traffic.
3. **Class B high-value authoring** (6–10 pages, ~12 hours): the big-impression pages with thin raw material. These require authored-from-scratch rabbit holes and are where the CTR lift actually pays off.
4. **Class C rising content**: watch the trajectory on recently-published pages (Jordi-Hays, Kara-Swisher, Alex-Karp) and retrofit as they grow into relevance.

---

## 1. Data quality caveats (read first)

### 1.1 URL case duplication

Google has indexed both title-case and lowercase versions of many personality URLs as separate pages. Examples from the supplied data:

| Person              | Title-case clicks / impressions | Lowercase clicks / impressions |
| ------------------- | ------------------------------- | ------------------------------ |
| Ryan-Gosling        | 5 / 709                         | 13 / 814                       |
| Tom-Hiddleston      | 16 (3mo) / 4,335                | 5 / 458                        |
| Hasan-Piker         | 4 / 877                         | 3 / 404                        |
| Sam-Altman          | 2 / 553                         | 1 / 328                        |
| Dario-Amodei        | 2 / 194                         | 2 / 401                        |
| Alexis-Bledel       | 2 / 357                         | 1 / 462                        |
| Timothee-Chalamet   | 1 / 431                         | 1 / 378                        |
| Sydney-Sweeney      | 1 / 358                         | 1 / 292                        |
| Gavin-Newsom        | —                               | 2 / 134                        |
| Kourtney-Kardashian | 1 / 313                         | —                              |

This is almost certainly a side-effect of the personality-slug normalization work (per `pnpm supabase:normalize-personality-slugs` in CLAUDE.md + the normalize script in `scripts/`). Google is still crawling the old lowercase URLs.

**Action items surfaced by this finding (not part of the retrofit itself):**

- Audit 301s from lowercase → canonical case. Every split URL is leaking authority.
- Verify `rel=canonical` tags on personality pages point to the canonical title-case URL.
- This is a separate workstream from the rabbit hole, but worth logging — the URL split probably depresses CTR independent of content quality.

All traffic numbers below are **merged across case duplicates**.

### 1.2 Growth trajectory normalization

DJ flagged correctly: some of these pages weren't published for the full 3-month window. Without exact publish dates we use a proxy — **past-month share of past-3-month clicks**:

- **~33% share** = steady state (1 month out of 3 contributing proportionally)
- **>50% share** = accelerating, or published mid-window
- **100% share** = brand new (appears only in past-month)
- **<20% share** = decelerating

### 1.3 What this data _doesn't_ tell us

- GSC shows pages Google is already surfacing. Pages that haven't ranked yet (Pete-Davidson, Johnny-Depp, and most Tier 4 drafts) are invisible here.
- CTR is a lagging, query-matching signal. It captures how well the snippet matches intent, not pure content quality.
- Impressions are query-count driven, so topical celebrities with recent news events will spike regardless of page quality.

Don't over-rotate on month-over-month noise for small-numerator pages (anything under ~5 clicks/month is noisy).

---

## 2. Merged traffic ranking — personality pages only

### 2.1 Past 3 months, top personality pages by clicks (merged cases)

| Rank | Person            | Clicks 3mo | Impr 3mo   | CTR        | 1mo share           | Signal tier | Has RH     |
| ---- | ----------------- | ---------- | ---------- | ---------- | ------------------- | ----------- | ---------- |
| 1    | Timothee-Chalamet | 25         | 2,379      | 1.05%      | ~8% (decel)         | 2/4         | .          |
| 2    | Ryan-Gosling      | 23         | 3,139      | 0.73%      | ~78% ⬆             | 0/4         | .          |
| 3    | Dua-Lipa          | 21         | 4,190      | 0.50%      | ~24%                | 0/4         | .          |
| 4    | Elon-Musk         | 20         | **22,870** | **0.087%** | —                   | —           | ✅ (draft) |
| 5    | Gwyneth-Paltrow   | 20         | 3,965      | 0.50%      | ~0% (decel)         | 1/4         | .          |
| 6    | IShowSpeed        | 17+3 = 20  | 8,398      | 0.24%      | ~15%                | 3/4         | .          |
| 7    | Madison-Beer      | 18         | 3,823      | 0.47%      | ~22%                | 2/4         | .          |
| 8    | Tom-Hiddleston    | 16+5 = 21  | 4,793      | 0.44%      | ~24%                | 0/4         | .          |
| 9    | Sydney-Sweeney    | 16+2 = 18  | 4,805      | 0.37%      | ~11%                | 1/4         | .          |
| 10   | Jordi-Hays        | 16         | 552        | 2.90%      | **100% 🔥**         | 1/4         | .          |
| 11   | Jackie-Kennedy    | 15         | 1,630      | 0.92%      | ~40% ⬆             | 1/4         | .          |
| 12   | Jennifer-Lopez    | 14+2 = 16  | 3,557      | 0.45%      | ~13%                | 1/4         | .          |
| 13   | Druski            | 14         | 2,815      | 0.50%      | ~57% ⬆             | 0/4         | .          |
| 14   | Jack-Black        | 14         | 1,886      | 0.74%      | ~64% ⬆             | 2/4         | .          |
| 15   | Hasan-Piker       | 4+3 = 7    | 1,281      | 0.55%      | (1mo only surfaced) | 2/4         | .          |

Notable sub-top-15 names that appear in 1-month data but were below 3-month radar — likely recently-published or spiking:

- **Kara-Swisher** — 6 clicks / 311 impr past month, **not in drafts folder** (authored in DB?). Signal tier 0.
- **Alex-Karp** — 5 / 330 past month, Tier 0
- **Agatha-Christie** — 5 / 283 past month, **not in drafts folder**
- **Caleb-Hearon** — 3 / 102 past month, **Tier 4** 🎯
- **Dario-Amodei** — 2+2 = 4 / 595 past month, **Tier 4** 🎯
- **Peter-Thiel** — 1 / 479 past month, Tier 0 (but listed in furniture spec as validation candidate)
- **Emma-Watson** — 1 / 1,003 past month, Tier 1
- **Palmer-Luckey** — 1 / 848 past month, Tier 0
- **Friedrich-Nietzsche** — 1 / 708 past month, not in drafts
- **Chappell-Roan** — 1 / 599 past month, Tier 0

### 2.2 Biggest CTR-opportunity pages (impressions × missed clicks)

Pages ranked by **wasted impressions** = impressions × (1 − CTR). These are where the surface area is largest and the match quality is weakest — exactly what fan-out is designed to fix.

| Person            | Impr 3mo | CTR    | Wasted impr | Signal tier    |
| ----------------- | -------- | ------ | ----------- | -------------- |
| **Elon-Musk**     | 22,870   | 0.087% | 22,850      | has RH (draft) |
| IShowSpeed        | 8,398    | 0.24%  | 8,378       | 3/4            |
| Tom-Hiddleston    | 4,793    | 0.44%  | 4,772       | 0/4            |
| Sydney-Sweeney    | 4,805    | 0.37%  | 4,787       | 1/4            |
| Dua-Lipa          | 4,190    | 0.50%  | 4,169       | 0/4            |
| Gwyneth-Paltrow   | 3,965    | 0.50%  | 3,945       | 1/4            |
| Madison-Beer      | 3,823    | 0.47%  | 3,805       | 2/4            |
| Jennifer-Lopez    | 3,557    | 0.45%  | 3,541       | 1/4            |
| Ryan-Gosling      | 3,139    | 0.73%  | 3,116       | 0/4            |
| Druski            | 2,815    | 0.50%  | 2,801       | 0/4            |
| Timothee-Chalamet | 2,379    | 1.05%  | 2,354       | 2/4            |
| Jack-Black        | 1,886    | 0.74%  | 1,872       | 2/4            |

**Interpretation:** a 0.5 pp CTR lift on Elon Musk (from 0.087% to 0.59%) = **114 additional clicks per 3 months** — more than the next five personality pages combined. A similar lift on IShowSpeed ≈ 42 additional clicks. The asymmetry is stark.

---

## 3. Cross-reference: signal tier × traffic

Pulls from `rabbit-hole-retrofit-candidates.md` + re-scan of names surfaced by traffic data.

### 3.1 Class A — Raw material exists AND has traffic (low effort, moderate lift)

Cleanest retrofits. Extract the existing jargon into the rabbit hole, apply the Distribution Rule, ship.

| Person             | Tier | 3mo clicks | 3mo impr | 1mo share | Notes                                                                                |
| ------------------ | ---- | ---------- | -------- | --------- | ------------------------------------------------------------------------------------ |
| **IShowSpeed**     | 3/4  | 20         | 8,398    | ~15%      | Biggest Class A opportunity. 4 wing codes, counter-typing, arrows in existing draft. |
| **Madison-Beer**   | 2/4  | 18         | 3,823    | ~22%      | 6 wing codes — heavy raw material.                                                   |
| **Jack-Black**     | 2/4  | 14         | 1,886    | ~64% ⬆   | Rising.                                                                              |
| **Hasan-Piker**    | 2/4  | 7          | 1,281    | 100%      | 12 wing mentions — heavy raw material; traffic growing.                              |
| **Caleb-Hearon**   | 4/4  | 3          | 102      | 100%      | Tier 4 pilot from original candidates list.                                          |
| **Dario-Amodei**   | 4/4  | 4          | 595      | 100%      | Tier 4 pilot. Rising.                                                                |
| **Henry-Cavill**   | 3/4  | 1          | 447      | —         | Heavy raw material (5 wing codes), modest traffic.                                   |
| **Sam-Altman**     | 3/4  | 3          | 881      | 100%      | Counter-typing rich; traffic growing.                                                |
| **xQc**            | 3/4  | 1          | 370      | —         | Rich across all four signals.                                                        |
| **Jackie-Kennedy** | 1/4  | 15         | 1,630    | ~40% ⬆   | Only 1 signal in draft but decent traffic — marginal Class A.                        |
| **Pete-Davidson**  | 4/4  | —          | —        | —         | Tier 4 but no GSC signal. Retrofit value is for future traffic.                      |
| **Johnny-Depp**    | 4/4  | 2          | 54       | 100%      | Tier 4.                                                                              |

### 3.2 Class B — Big traffic, thin raw material (author from scratch)

These pages will need the rabbit hole built from observed behavior in the existing blog body, not lifted from existing typology prose. Higher per-page effort (roughly 2×) but bigger CTR payoff.

| Person                | Tier | 3mo clicks | 3mo impr | 1mo share | Notes                                                              |
| --------------------- | ---- | ---------- | -------- | --------- | ------------------------------------------------------------------ |
| **Tom-Hiddleston**    | 0/4  | 21         | 4,793    | ~24%      | 0 signals in draft. Full scratch author.                           |
| **Dua-Lipa**          | 0/4  | 21         | 4,190    | ~24%      | Full scratch.                                                      |
| **Sydney-Sweeney**    | 1/4  | 18         | 4,805    | ~11%      | Near-scratch.                                                      |
| **Gwyneth-Paltrow**   | 1/4  | 20         | 3,965    | ~0%       | Decelerating — lower priority within Class B.                      |
| **Jennifer-Lopez**    | 1/4  | 16         | 3,557    | ~13%      | Scratch.                                                           |
| **Ryan-Gosling**      | 0/4  | 23         | 3,139    | ~78% ⬆   | Full scratch. Accelerating.                                        |
| **Druski**            | 0/4  | 14         | 2,815    | ~57% ⬆   | Full scratch. Accelerating.                                        |
| **Timothee-Chalamet** | 2/4  | 25         | 2,379    | ~8%       | Highest-traffic personality page; decelerating; some raw material. |

### 3.3 Class C — Rising content, small current traffic

Watch these. Retrofit may not pay off yet, but if their trajectory holds they'll be Class B in 1–2 months.

| Person              | Tier | 3mo clicks | 1mo clicks | 1mo impr | Notes                                                    |
| ------------------- | ---- | ---------- | ---------- | -------- | -------------------------------------------------------- |
| Jordi-Hays          | 1/4  | 16         | 16         | 552      | 🔥 Published recently; CTR 2.9% is **anomalously high**. |
| Kara-Swisher        | 0/4  | —          | 6          | 311      | Not in drafts folder — authored in DB?                   |
| Alex-Karp           | 0/4  | —          | 5          | 330      | New.                                                     |
| Agatha-Christie     | —    | —          | 5          | 283      | Not in drafts folder.                                    |
| Peter-Thiel         | 0/4  | —          | 1          | 479      | Furniture-spec validation candidate.                     |
| Emma-Watson         | 1/4  | —          | 1          | 1,003    | High impressions for a single click — CTR-fix candidate. |
| Palmer-Luckey       | 0/4  | —          | 1          | 848      | Same.                                                    |
| Friedrich-Nietzsche | —    | —          | 1          | 708      | Not in drafts folder.                                    |
| Chappell-Roan       | 0/4  | —          | 1          | 599      | Same.                                                    |
| John-Coogan         | 0/4  | —          | 3+1 = 4    | 775      | Rising.                                                  |

### 3.4 Already has rabbit hole in draft (verify DB state)

| Person             | 3mo clicks | 3mo impr | Notes                                                                                                                  |
| ------------------ | ---------- | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Elon-Musk**      | 20         | 22,870   | **#1 validation target.** Confirm DB state, measure 2-week delta.                                                      |
| Taylor-Swift       | —          | —        | Not in top GSC data — lower traffic than expected; validation target per furniture spec but limited measurement value. |
| Anna-Kendrick      | —          | —        | Not in top GSC data.                                                                                                   |
| Jeremy-Allen-White | —          | —        | Not in top GSC data; v2-cron draft, may not be published.                                                              |

---

## 4. Prioritized retrofit queue (merged across effort × traffic × trajectory)

### Phase 1 — Validation (blocks all scale-out)

| #   | Action                                                                                                                                                                         | Est. time               |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| 1   | Verify Elon Musk draft is pushed to the `blogs_famous_people` DB row. If not, push via `/admin/content-board`.                                                                 | 15 min                  |
| 2   | Run `/personality-analysis/Elon-Musk` through Rich Results Test + 3 LLM spot-checks ("What is Elon's wing?" / "Is Elon a 5 or an 8?" / "What is Elon's instinctual subtype?"). | 30 min                  |
| 3   | Baseline GSC CTR + impressions snapshot. Check again in 2 weeks.                                                                                                               | 5 min now + 5 min later |

**Gate:** do not proceed past Phase 1 until the Elon page is confirmed live with the rabbit hole and we have a baseline snapshot. If the draft is not yet pushed, that is the highest-priority micro-task on the list.

### Phase 2 — Class A quick wins (prove the workflow, ~4 hours)

Order is by impression volume × raw-material richness:

| #   | Person           | Tier | Impr (3mo) | Estimate               |
| --- | ---------------- | ---- | ---------- | ---------------------- |
| 1   | **IShowSpeed**   | 3/4  | 8,398      | 45 min                 |
| 2   | **Madison-Beer** | 2/4  | 3,823      | 45 min                 |
| 3   | **Jack-Black**   | 2/4  | 1,886      | 45 min                 |
| 4   | **Hasan-Piker**  | 2/4  | 1,281      | 45 min                 |
| 5   | **Caleb-Hearon** | 4/4  | 102        | 30 min (Tier 4 = fast) |
| 6   | **Dario-Amodei** | 4/4  | 595        | 30 min (Tier 4 = fast) |

**Why this order:** IShowSpeed first — high wasted-impressions, moderate tier (3/4), existing raw material. If the workflow holds there, Madison-Beer / Jack-Black / Hasan-Piker are all similar shape. Tier 4 pages (Caleb-Hearon, Dario-Amodei) are the cleanest mechanical retrofits even if their traffic is small — good for the agent to build muscle memory on.

**Skipped from Phase 2:**

- Johnny-Depp (Tier 4) — near-zero traffic, low ROI even though easy. Defer unless the agent wants extra reps.
- Pete-Davidson (Tier 4) — no GSC traffic at all. Defer.
- Henry-Cavill, xQc, Sam-Altman — good raw material but small traffic; keep for Phase 3 batching.

### Phase 3 — Class B high-value authoring (~12 hours)

**Decision point before Phase 3:** review the Phase 1 Elon CTR delta. If the rabbit hole moved CTR meaningfully (+0.2 pp or more), greenlight Phase 3 and author scratch rabbit holes for the Class B queue below. If no movement, pause and diagnose before investing the bigger authoring budget.

Order is by wasted-impressions, with deceleration tiebreakers:

| #   | Person            | Tier | Impr  | Trajectory               |
| --- | ----------------- | ---- | ----- | ------------------------ |
| 1   | Tom-Hiddleston    | 0/4  | 4,793 | steady                   |
| 2   | Dua-Lipa          | 0/4  | 4,190 | steady                   |
| 3   | Sydney-Sweeney    | 1/4  | 4,805 | soft-decel               |
| 4   | Jennifer-Lopez    | 1/4  | 3,557 | decel                    |
| 5   | Ryan-Gosling      | 0/4  | 3,139 | **accelerating**         |
| 6   | Druski            | 0/4  | 2,815 | **accelerating**         |
| 7   | Timothee-Chalamet | 2/4  | 2,379 | decel                    |
| 8   | Gwyneth-Paltrow   | 1/4  | 3,965 | **decelerating** — defer |

### Phase 4 — Class C watchlist

Revisit in 4 weeks. If Jordi-Hays, Kara-Swisher, Alex-Karp, Peter-Thiel, or any other Class C name crosses ~1,500 impressions, promote to Class B.

---

## 5. Derived action items (adjacent, not strictly retrofit)

Surfaced by the analysis but separate from the rabbit hole work:

1. **URL case redirect audit.** Every title-case/lowercase split is leaking authority. Confirm 301s + canonicals across `personality-analysis/*`. Probably 30 minutes of work; could lift CTR across all personality pages independent of content changes.
2. **Verify Kara-Swisher / Agatha-Christie / Friedrich-Nietzsche / Emma-Chamberlain / Charlie-Puth provenance.** These have traffic but no draft file. Either authored directly in `blogs_famous_people` via content-board, or drafts were deleted after push. Reconcile.
3. **Publish-date column for `blogs_famous_people`.** If we had `first_published_at` on the table, the growth-trajectory normalization above would be clean instead of inferred. Small schema addition; unblocks future "new vs. steady-state" traffic analysis.
4. **CTR alarms for personality pages.** Anything < 0.5% with > 3,000 impressions is evidence of a query-match gap. Worth building into a weekly report once the retrofit is underway — it tells us where the next retrofit should land after Phase 3.

---

## 6. Open questions for DJ

1. **Is the Elon Musk rabbit hole live in the DB?** The draft has it; the pickup brief says Step 3 validation on a real published blog was never executed. If the draft hasn't been pushed, Phase 1 is actually "push the draft," not "measure CTR." This blocks everything downstream.
2. **Risk tolerance on Class B authoring.** Authoring rabbit holes from scratch on high-traffic pages carries some content risk (new claims, sourcing burden). Are we okay with "behavioral evidence already in the blog, re-interpreted through the subtype/wing lens" as the sourcing bar, or do we need independent research per page?
3. **Budget for the URL case audit.** Item #1 under Derived action items above may do more for CTR than any single retrofit. Worth slotting in parallel or sequentially?

---

## 7. Suggested next step

Push Elon Musk's rabbit hole draft to the DB (if not already) and snapshot GSC impressions + clicks today. In parallel, hand the retrofit agent the Phase 2 queue (IShowSpeed, Madison-Beer, Jack-Black, Hasan-Piker, Caleb-Hearon, Dario-Amodei) and let it execute using the tasker doc. That's ~4 hours of work across 6 pages and a real measurement point on the highest-traffic page we own. Phase 3 decision can be made with two weeks of data in hand.
