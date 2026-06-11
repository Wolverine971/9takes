<!-- docs/audits/2026-06-11_state-of-9takes.md -->

# State of 9takes — Evidence Snapshot

**Date:** 2026-06-11
**Prepared by:** growth-analyst (read-only audit)
**Primary sources:** live Supabase production DB (queried 2026-06-11 via REST + admin RPCs), `docs/analytics/google-search-results-last-3-months.md` (GSC export, 2026-02-21), `docs/development/rabbit-hole-retrofit-traffic-analysis.md` (GSC, 2026-04-17), `docs/content-analysis/personality-analysis-performance-deep-dive-2026-05-29.md`, `docs/data/corpus-stats.md` (auto-generated 2026-06-11), `docs/growth/growth-log.md` (updated 2026-06-11)

**Measurement caveats (read first):**

- In-house page analytics (`page_analytics_visits`) begins **2026-03-13** — earliest row in the table. No in-house traffic data exists before that. Year-over-year and pre-March trends are unknowable from the DB.
- The freshest true GSC export in the repo is **2026-02-21** (3-month window). A partial GSC pull dated **2026-04-17** exists in the rabbit-hole analysis. Nothing newer. Where "organic" is cited for May–June, the proxy is `page_analytics_visits.referrer_host ILIKE '%google%'`. This approximates GSC clicks but is not identical.
- `median_time_on_page_ms` returns 0 in all analytics RPCs — known instrumentation bug, so dwell-time numbers use averages only.
- There is no unified events table; retention numbers are stitched from contribution tables and are all-time unless dated.

---

## 1. Personality Analysis (`/personality-analysis`)

**Corpus size** (DB + `docs/data/corpus-stats.md`, both as of 2026-06-11):

- 496 total rows in `blogs_famous_people`; **358 published**, ~133–138 drafts in pipeline.

**Traffic level** (in-house analytics, 30 days 2026-05-12 → 2026-06-11):

- **8,407 visits / 7,994 uniques** to `/personality-analysis*` — the largest section, **~45% of all site visits** (site total: 18,636 visits, 14,709 uniques).
- 395 individual analysis pages received at least one visit; together 7,341 visits.
- **Distribution is flat, not hit-driven:** top 10 slugs = only **10%** of slug visits. Top performers: sabrina-carpenter (111), ishowspeed (93), elon-musk (80), alex-karp (78), prince (71), ryan-gosling (66), marilyn-monroe (61), sam-altman (59), jordi-hays (58), clavicular (50). Only 30 pages had ≤2 visits in 30 days — the long tail is shallow but alive.
- **Only ~11% of section visits are Google-referred** (988 of 8,831 raw visits, last 30d). The bulk is internal navigation/direct — consistent with the 2026-05-29 deep dive finding that bottom-quartile pages live on internal links.

**Organic quality** (GSC, as of 2026-02-21): 235 indexed pages, **1,217 clicks / 407,158 impressions / 0.30% CTR** over 3 months (~406 clicks/mo). The section drives **77% of site impressions** but converts them at one-fifth the rate of enneagram-corner. The 2026-04-17 GSC pull confirms: Elon Musk at 0.087% CTR on 22,870 impressions.

**Trend:** Site-wide Google-referred visits grew **2,011 → 2,929 (+46%)** between the 30-day windows ending 2026-05-12 and 2026-06-12 (in-house proxy). Section-level prior-window split not computed, but the deep dive (2026-05-29) shows organic search visit count correlates 0.71 with total views while quality grade correlates 0.11.

**Verdict inputs:** Massive impression engine, weak click converter, healthy long tail, growing. The known fix queue (rabbit-hole/fan-out retrofit, title/meta intent rewrites) targets exactly the impression-to-click gap.

---

## 2. Enneagram Authority Content (`/enneagram-corner`, `/community`, `/how-to-guides`, stories)

**Traffic level** (in-house, last 30d, as of 2026-06-11):

- `/enneagram-corner`: **6,301 visits / 4,759 uniques** (~34% of site)
- `/pop-culture`: 650 visits; `/community`: 227; `/how-to-guides`: 195
- enneagram-corner is **the organic click engine**: 1,564 of 6,358 raw visits Google-referred (**~25%**) — 1.6x personality-analysis's absolute Google-referred volume on fewer visits.

**GSC** (2026-02-21 export): enneagram-corner 103 pages, **1,605 clicks / 115,974 impressions / 1.38% CTR** (~535 clicks/mo) — the highest-CTR section and the highest-click section despite 22% of impressions. how-to-guides: 3 clicks/3mo on 12 pages. community: 0 clicks on 6 pages — these two sub-sections contribute essentially nothing organically.

**Annual target check** (`docs/planning/2026-annual-strategy.md`: ~960 monthly organic clicks Dec 2025 → 5,000+ by Dec 2026):

- Feb 2026 GSC: 2,873 clicks / 3 months ≈ **958/mo** — flat at baseline as of late Feb.
- June 2026 proxy: **~2,929 Google-referred visits in the last 30 days** (in-house, all sections). If the proxy tracks GSC clicks even loosely, that is ~3x the Dec baseline and slightly **ahead of the linear pace** needed to reach 5,000 by December (~2,800 required by mid-June).
- **This is a proxy, not GSC.** The single most valuable 10-minute action in this whole audit: pull a fresh GSC 28-day export and put it in `docs/analytics/`. Nothing in the repo confirms organic clicks after 2026-04-17.

---

## 3. Q&A Platform (`/questions`)

All from production DB, queried 2026-06-11:

- **60 questions all-time.** Monthly: a 2023 burst (27 in Sep–Dec 2023), sporadic 2024, then **8 in Feb 2026, 2 in Mar, 1 in Apr, 0 in May, 0 in June.**
- **292 comments all-time** (12 removed). 2026 YTD: 42 comments (Jan 9, Feb 12, Mar 11, Apr 5, May 5, Jun 0).
- **Comments per ISO week, last 8 weeks with any activity:** W14: 2, W15: 2, W16: 1, W17: 0, W18: 2, W19: 0, W20: 1, W21: 0, W22: 2, W23–24 (June): **0**. Run rate ≈ **1 comment/week**.
- **Contributor mix:** all-time 147 registered (`author_id` set) vs 145 anonymous — a near-perfect 50/50. In 2026: 23 of 42 registered (55%).
- **Return signal (all-time, only signal available):** 28 distinct registered authors, **14 (50%) commented 2+ times**; 84 distinct anonymous fingerprints, **18 (21%) commented 2+ times**. No D7/D30 cohort curve is computable — retention rollups (Phase 1 of the instrumentation plan) never shipped.
- **Traffic:** 285 visits / 227 uniques to `/questions*` in the last 30 days — **1.5% of site traffic**. The content engine and the product are not connected.
- 146 profiles all-time; registrations: Nov 2025: 13, Dec: 20, then 2026: Jan 7, Feb 5, Mar 10, Apr 9, May 5, Jun 3 (to date). Site-wide authenticated visits last 30d: 223 of 18,636 (1.2%).
- Known unfixed leak (growth log, verified 2026-06-11): `EnneagramCTASidebar` built but imported nowhere; Experiment A (email capture at first anonymous comment) speced but never implemented.

---

## 4. Coaching (`/book-session`)

Production DB, 2026-06-11:

- `coaching_waitlist`: **18 rows all-time.** 2 in Mar 2025, **15 in a single burst Nov 19 – Dec 1, 2025**, then **exactly 1 signup in all of 2026** (2026-04-06). `coaching_waitlist_metadata` shows no UTM attribution on the burst (all `source: 9takes.com`, empty utm_campaign) — what drove it is not recoverable from the DB.
- `consulting_clients`: **1 row.** `consulting_sessions`: **0.** `consulting_intake_forms`: **0** — no intake tokens have ever produced a form.
- `/book-session` traffic: **18 visits / 18 uniques in the last 30 days.**
- GSC (2026-02-21): the page had 0 clicks / 14 impressions over 3 months.

The funnel is structurally complete (waitlist → promote RPC → intake → sessions) and almost entirely unused: 1 lead in 6 months, 0 sessions ever recorded.

---

## 5. Email

Production DB, 2026-06-11:

- **List size:** `signups` table = 36 rows, **all from 2023** (Feb–Dec 2023; the table has captured nothing since). `profiles` = 146. `coaching_waitlist` = 18. Combined addressable list ≤ ~200, overlap unknown. No new top-of-funnel email capture mechanism is live (Experiment A unimplemented; blog CTA sidebar unwired).
- **All-time sending** (`get_email_analytics` RPC): **93 sent, 13 opened (14.0% open rate), 1 clicked, 0 unsubscribed, 1 failed.** Sends by month: Dec 2025: 4, Jan: 4, Feb: 1, Mar: 8, **Apr: 46**, May: 15, Jun: 15.
- **Welcome sequence** (`email_sequence_enrollments`, live since 2026-03-16): **22 enrollments** (Mar 5, Apr 9, May 5, Jun 3) — 19 completed, 3 active, 0 errored. Enrollment tracks registration volume, i.e., ~5/month.
- **Per-step performance** (sends grouped by subject; denominators tiny): best openers — "Why are people so fake?…" 3/9 opened, "…you answer before you read" 3/8, "Should I keep sending these?" 2/3, "The 3 questions I ask…" 2/10. The only click ever recorded: "You answer before you read. Here's why that matters" (1 click on 2 sends). Several steps have 0 opens on 4–10 sends. Caveat: pixel-based opens undercount, and the admin's return-visit join only counts logged-in sessions (documented in growth log 2026-04-08), so true engagement is somewhat above measured.

---

## Verdict Table

| Pillar                         | Key metric (source, as-of)                                                                                                  | Trend                                                                | Verdict                                                                                                                           |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 1. Personality-analysis blogs  | 8,407 visits/30d, 45% of site (in-house, 2026-06-11); 358 published; 0.30% GSC CTR on 407k impressions/3mo (GSC 2026-02-21) | Visits growing; site Google-referred visits +46% MoM (proxy)         | **WORKING** as traffic/impression engine; **PARTIAL** as click converter — the CTR fix queue is correctly aimed                   |
| 2. Enneagram authority content | 6,301 visits/30d; 1,564 Google-referred/30d (in-house, 2026-06-11); 1.38% CTR, 535 clicks/mo (GSC 2026-02-21)               | Up; site organic proxy ~2,929/mo ≈ on/ahead of the 5,000-by-Dec pace | **WORKING** — but confirmed only by proxy; pull fresh GSC. `/community` + `/how-to-guides` sub-sections: NOT WORKING (≈0 organic) |
| 3. Q&A platform                | 60 questions all-time, 0 since April; ~1 comment/week, 0 in June (DB, 2026-06-11); 285 visits/30d = 1.5% of traffic         | Flat-to-dead; Feb 2026 mini-revival not sustained                    | **NOT WORKING** — content flywheel does not hand off to the product; known activation fixes unshipped                             |
| 4. Coaching `/book-session`    | 18 waitlist all-time; 1 signup in 2026; 0 sessions, 0 intake forms, 1 client (DB, 2026-06-11); 18 page visits/30d           | Dead since the unattributed Nov 2025 burst                           | **NOT WORKING** (dormant — infrastructure exists, demand gen does not)                                                            |
| 5. Email                       | List ≤ ~200; 93 sends ever, 14% open, 1 click (DB, 2026-06-11); 22 welcome enrollments since March                          | Enrollment flat at ~5/mo, capped by registrations                    | **PARTIAL** — machinery works, but there is no capture top-of-funnel; `signups` table dead since 2023                             |

**Cross-cutting reads:** (1) New-user cohort retention is still **NO DATA** — the instrumentation plan's Phase 1 rollups never shipped, so the single most important number for pillars 3–5 remains unknowable. (2) The site is one pillar wide: 79% of traffic is two blog sections; everything downstream (Q&A, coaching, email) captures under 2% of it. (3) The anti-pattern to avoid in this evaluation: judging pillar 1 by visits (vanity) — judge it by Google-referred clicks and what those clicks are handed to next.

**Three queries/actions DJ should run that this audit could not:** fresh GSC 28-day export (confirms target pace with real clicks, not proxy); a one-time D7/D30 cohort stitch of `profiles.created_at` × `page_analytics_visits.user_id` (only possible for cohorts after 2026-03-13); identify what caused the Nov 24–Dec 1 2025 coaching burst from memory/calendar, since the DB carries no attribution.
