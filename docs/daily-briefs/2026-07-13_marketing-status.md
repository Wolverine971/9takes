<!-- docs/daily-briefs/2026-07-13_marketing-status.md -->

# 9takes Marketing Status — 2026-07-13

**Unattended run (marketing-pm).** DJ not present. No actions taken that require confirmation; all pending decisions routed to "Open questions for DJ." No blog drafts, `published:` flags, product code, git mutations, or external services touched. Prior status brief: `2026-07-06_marketing-status.md`.

## TL;DR

- **Growth data is FRESH (audit ran today, 2026-07-13).** Headline, verbatim from the growth audit: _"the traffic surge made the activation leak more expensive. The now-complete week of 2026-07-06 drew 5,357 new visitors — the highest week in the 8-week window (+48% WoW) — almost entirely onto personality-analysis, and converted it to 0 signups, 0 comments, 1 profile, 0 waitlist, 0/6 wall conversion."_ The single biggest attention week in the window produced essentially nothing.
- **The bottleneck flipped: create is fixed, PUBLISH is now jammed.** Last week's `oliver-tree` API failures are gone — the nightly cron shipped clean drafts (David Beckham, Type 3, grade 8.6 B+, 69 min; N3on, Type 3) on 07-13. But `publish-people` shipped **0 posts on 07-10, 07-11, and 07-12** — every unpublished draft is rejected by the gate on missing grade-stability deltas, missing manual Canva images, or grades 0.1 under 8.5. The engine writes daily and ships nothing.
- **Instagram is fully dark — 7 of the last 7 mornings blocked** (07-06 → 07-12, all `instagram_account_not_in_picker`). Regression from "5 of 7" last brief. @9takesdotcom is evicted from the shared Chrome profile; only DJ can re-login.
- **Quora is ~55 days dark** (last activity 2026-05-19). Distribution: 9 packets still queued, none fired. Both unchanged.
- **SEO infra is current, and GSC refreshed.** corpus-stats + crosslink index regenerated 07-12; GSC `latest.json` is now runDate 2026-07-06 (90-day window ending 07-04) — fresher than the 06-11 export flagged last brief.
- **New front-of-funnel scout landed 07-13.** Top new pick: **Michael Truell** (Cursor/Anysphere CEO, SpaceX's $60B acquisition) — highest-ROI create target; backlog queue was down to 1 entry at scan time, so there is room to feed it.

## The actual work — the publish valve is closed on a full tank

The content funnel has three stages: create → grade/gate → publish. Last week create was broken; it is fixed now (deterministic nightly cron, clean runs). The jam has moved downstream to the **publish gate**, which has shipped nothing in at least three days while the create engine keeps stacking graded drafts.

This matters more than usual this week because the growth audit says personality-analysis just pulled the biggest visitor week in the window (5,357) — that surface is starved of fresh, indexed posts at the exact moment it is getting the most attention.

| Artifact / log                                       | Observed state                                                                                                                                                                                                           | Why it matters                                                                                                   |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `logs/blog-automation/cron-2026-07-13.log`           | David Beckham (Type 3) completed clean, grade 8.6 (B+), disc 9, 69 min, `needsReview=true`. Two `same_type_similarity` stages exit=1 (STAGE_WARNINGS) but run continued and finished code=0.                             | Create engine is healthy again — no repeat of the 07-05/07-06 `oliver-tree` API failures. Warnings are cosmetic. |
| `logs/blog-automation/publish-people-2026-07-12.log` | Blocked. `Xochitl-Gomez` fails at `content_quality_below_8.5:8.4` (0.1 short). Command stopped rather than bypass.                                                                                                       | Publish gate rejects the freshest draft over a rounding-margin grade.                                            |
| `logs/blog-automation/publish-people-2026-07-11.log` | Blocked. All 87 unpublished drafts rejected. Nearest: `hailee-steinfeld` (missing grade-stability delta only), `oliver-tree`/`julia-fox` (missing manual images only), `carina-zavline`/`kiernan-shipka` (never graded). | The blockers are systemic and un-clearable unattended: supervised regrades + manual Canva images.                |
| `logs/blog-automation/publish-people-2026-07-10.log` | Blocked. `Kaia-Gerber` graded 8.7 (passes quality) but rejected on `missing_grade_stability_delta` — needs a supervised `/grade_blog` regrade to record the delta.                                                       | Even grade-passing drafts can't ship without a human-run regrade to log the stability delta.                     |
| `docs/blog-automation/backlog-queue.json`            | 127 unpublished / 266 published (67.7% completion). Held only 1 entry (`david-beckham`) at scout scan time.                                                                                                              | Queue is nearly drained of ready targets; the scout exists to refill it.                                         |
| `docs/blog-automation/override.json`                 | `pause=false`, `rateLimit.maxPerWeek=5`, `currentWeekCount=2`, week start 2026-07-12.                                                                                                                                    | Automation is not paused; the limiter is not the blocker.                                                        |

**Fastest paths to resume the publish cadence** (from the publish logs themselves): supervised `/grade_blog` regrade on `hailee-steinfeld` and `Kaia-Gerber` (both grade-passing, need only the stability delta); add manual Canva images for `oliver-tree` / `julia-fox` (grades already pass). Any one of these clears a publish.

## Tooling state

- **Blog create automation:** Healthy. The deterministic nightly cron (`nightly-blog-cron.sh`) is producing graded drafts reliably; the 07-05/07-06 API-failure mode did not recur.
- **Blog publish gate:** Effectively stalled. The gate is working as designed (it refuses to ship un-regraded or image-less drafts), but nothing has satisfied it in 3+ days, so the daily-ship cadence from the 06-21→07-04 run has stopped. This is a human-in-the-loop dependency, not a code break.
- **Instagram tooling:** Browser bridge works; @9takesdotcom session persistence is the hard blocker. Picker now shows `dj_pew_pew / djwayne3 / build.os` — no 9takesdotcom. Recurring eviction per memory `[[instagram-session-eviction]]`.

## Cross-surface status

### Blogs

- **People pipeline (disk):** 480 markdown files in `src/blog/people/drafts/` — 382 `published: true`, 91 `published: false`. Two new drafts from the 07-13 cron: `David-Beckham.md` (grade 8.6) and `N3on.md` (grade not recorded in summary), both `published: false`.
- **Pop-culture:** 49 top-level files — 31 published / 18 unpublished. Age buckets unchanged/chronic: ~1 in 0–4 weeks (`world-leaders`, 06-30), ~5 in 1–3 months (05-07/05-19/04-30 cohort), ~12 in 3+ months (the 03-04 batch of 8 plus the Dec 2025 pair). Same stale cohort as every prior brief.
- **Other categories:** No change signal this run beyond the people/pop-culture surfaces.

### Distribution

- **9 packets still queued, none fired:** benson-boone, chris-williamson, john-coogan, justin-bieber, lana-del-rey, shawn-ryan, steven-bartlett, tech-titans-disruptors, tim-ferriss. Plus two carousels (robert-greene, enneagram-in-your-own-way) and IG variants for shawn-ryan + steven-bartlett. No fired-packet evidence observed.

### Social

- **Instagram: fully dark.** 7 consecutive blocked mornings (07-06 → 07-12), all `instagram_account_not_in_picker`. No scanning performed any of those days. This is worse than the 07-06 brief's "5 of 7." The durable fix (dedicated Chrome profile for @9takesdotcom) remains open.
- **Quora: dead ~55 days.** Last session/log/question-log activity 2026-05-19. No revive.
- **Twitter/X:** No persistent session log; no current signal.

### SEO

- `docs/data/corpus-stats.md` regenerated 07-12: 382 published profiles, 135 drafts in pipeline, 20 published in the last 30 days.
- `docs/BLOG-CROSSLINK-INDEX.md` regenerated 07-12.
- `docs/data/gsc/latest.json` runDate 2026-07-06, window 2026-04-05 → 2026-07-04 (90 days) — refreshed since the last brief's 06-11 export. GSC data is now ~9 days old.

### Growth (FRESH — audit ran 2026-07-13)

- **Biggest leak (verbatim):** _"the surge made the activation leak more expensive. 9takes pulled its largest visitor week in the window (5,357) onto its highest-traffic surface and converted it to 0 signups, 0 comments, 1 profile."_ The extra ~1,700 visitors vs the prior week were 38% shallower on dwell.
- personality-analysis took 3,575 fps but engaged dwell fell to **11.7s — the 8-week low** (from 18.8s); 99% one-page bounce. Partly real search reads, partly likely shallow/bot inflation.
- **Give-first still half-blind, Chorus still dead:** `give_first_funnel_events` has only `gate_shown` (no native `contribution` event); `nine_user_takes` = 1 row ever (2026-06-15) — the audit reads this as a likely silent bug, not disuse.
- **Signups flat:** 0 new signups in 2 weeks; hardening holding (honeypot blocks 11→17, 2 successes). Capture is starved, not leaking spam.
- **One positive:** first new profile in weeks registered ~07-09 and enrolled in `welcome_sequence` (1 active enrollment) — first welcome fuel since mid-June.
- **Growth's #1 bet:** ship an above-fold, page-matched, one-field email/reveal capture on personality-analysis (CTA must fire before the ~12-second dwell cliff; today it sits below the fold). Target ≥1% session capture (~36/wk vs ~0). This is product/eng work, not marketing-pm scope — routed to Open questions.

### Outreach

- Unchanged. 06-29 one-off assets exist for Bartlett, Ferriss, Schulz + a Diary of a CEO Reddit reply. No send evidence. Long-Form cluster remains staged/DJ-triggered.

### Email

- Starved: 2 sends/week for 3 straight weeks (1 open, 0 clicks). `welcome_sequence` running with its first active enrollment since mid-June. Reactivation sequences (`reactivation_cold/dormant/zombies`) authored but `draft` / 0 enrollments — NOT running.

## What changed since the last brief (2026-07-06)

- **Growth audit ran on schedule** (fresh 07-13 data vs the stale 07-01 data last brief flagged). The story: biggest visitor week in the window converted to ~nothing.
- **Content bottleneck moved downstream.** Create recovered fully (no repeat of the `oliver-tree` API failures; Beckham + N3on shipped clean 07-13). Publish jammed: 0 posts shipped 07-10/11/12, all blocked on grade-stability deltas, manual images, or sub-8.5 grades.
- **Instagram regressed further:** 5/7 blocked → 7/7 blocked. A full week dark.
- **GSC refreshed:** latest.json moved from 06-11 to a 07-06 run. SEO infra (corpus-stats, crosslink index) regenerated 07-12.
- **New surging-people scout (07-13):** Michael Truell (top create pick), Josh O'Connor, Milly Alcock (update), Ella Langley (ride the wave). Backlog queue had drained to 1 entry at scan.
- **Quora crossed ~55 days dark; distribution still 9 unfired.** No change.

## Recommendation (ranked by leverage)

1. **Unblock the publish gate — it is the cheapest, highest-leverage marketing move this week.** Why: the create engine ships graded drafts nightly, but publish has shipped nothing in 3+ days, and this happens exactly as personality-analysis takes its biggest traffic week. The blockers are known and small. First step for DJ: run supervised `/grade_blog` on `hailee-steinfeld` and `Kaia-Gerber` (both grade-passing; need only the stability delta), then `/blog_content_publish_people` on whichever clears first; separately add Canva images for `oliver-tree` / `julia-fox`. Effort: ~10–20 min per draft. Risk: none — resumes a proven cadence.
2. **Fix the Instagram session (re-login + dedicated Chrome profile).** Why: the account has been fully dark for a week; every warmup and reply is blocked until DJ re-authenticates. First step: Switch accounts → "Log into an Existing Account" as @9takesdotcom, re-run `/instagram-warmup` same day, and stand up a dedicated profile so it stops getting evicted. Effort: 10–20 min. Risk: none; credential work only DJ can do.
3. **Green-light the top scout pick (Michael Truell) to refill a near-empty queue.** Why: the backlog queue drained to 1 entry, and Truell is the scout's highest-ROI create target (strongest niche + a $60B live catalyst). Feeding the queue keeps the (now-healthy) create engine productive. First step: DJ confirms, then the create command / nightly cron picks it up. Effort: minutes to approve. Risk: low.

_(The single highest-EV action overall is growth's #1 bet — an above-fold capture on personality-analysis — but that is product/eng scope, not marketing-pm's. It is routed as Open question #1.)_

## Open questions for DJ

1. **Growth's #1 bet (product/eng):** Do you want to prioritize an above-fold, page-matched, one-field email/reveal capture on personality-analysis? The biggest traffic week in the window (5,357 visitors) converted to 0 signups because the CTA sits below the ~12-second dwell cliff. Highest-EV growth move, but outside marketing-pm scope.
2. **Publish gate:** Should I (or you) run supervised `/grade_blog` regrades on `hailee-steinfeld` / `Kaia-Gerber` to record stability deltas and resume the daily publish cadence? Both are grade-passing and only need the delta.
3. **Manual images:** `oliver-tree` and `julia-fox` are publish-blocked only on missing Canva images (grades pass). Do you want to generate those so they can ship?
4. **Instagram:** Can you re-login @9takesdotcom and stand up a dedicated Chrome profile? It's been fully dark 7 days.
5. **Scout pick:** Approve `Michael Truell` (and/or Josh O'Connor) as the next create target(s), and the Milly Alcock refresh? Queue is down to ~1 entry.
6. **Give-first / Chorus (product/eng):** The audit flags `nine_user_takes` = 1 row ever as a likely silent bug and give-first as half-blind (no native `contribution` event). Do you want eng to smoke-test `/api/nine/mirror` and ship submit-side instrumentation?
7. **Standing decisions unchanged:** Distribution (9 packets, fire the freshest — Bartlett/Ferriss/Lana — or keep paused?) and Quora (revive or retire at ~55 days dark?).

## Assumptions

- File counts are frontmatter scans on disk, not live DB counts. Draft published/unpublished totals drift from the backlog-queue.json source-of-truth stats because they count different sets.
- "Distribution unfired" and "no send evidence" mean nothing was found in default repo surfaces; external channels were not queried.
- No product behavior was tested live; growth numbers are taken from the 2026-07-13 growth-log entry, not re-derived.
- N3on's grade is not recorded in its pipeline summary (nulls); its draft exists on disk as `published: false`.
