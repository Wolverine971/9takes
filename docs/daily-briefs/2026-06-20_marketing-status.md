<!-- docs/daily-briefs/2026-06-20_marketing-status.md -->

# 9takes Marketing Status — 2026-06-20

**Unattended run (weekly cron via marketing-pm).** DJ not present. No actions taken that require confirmation; all pending decisions routed to "Open questions for DJ." Prior status brief: `2026-05-09_marketing-status.md` (42-day gap; a `2026-05-14_pickup-brief.md` exists in between but is an outreach handoff, not a status brief).

## TL;DR

- **Growth came alive this week, but the headline win is half-poisoned.** The 2026-06-20 growth audit confirms the signups RLS fix works (0 → 79 signups), comments broke a 3-week zero streak (0 → 4), and email sends jumped (10 → 81/wk). BUT ~75 of 79 signups are bot spam against the still-unprotected `/api/signups` (no recaptcha). Net real capture ≈ 6 emails. This is the single most urgent fix on the board.
- **People blog pipeline is healthy and running daily** (cron through 2026-06-19, nick-offerman). 437 drafts on disk.
- **The publish gate is fully jammed.** The 2026-06-19 publish run found 0 publishable drafts out of 429: **355 are stuck on the stale v1 grade rubric** and need `/grade_blog` re-grades. Nothing can ship until a draft is re-graded.
- **Quora cadence is DEAD — last session 2026-05-19, ~32 days dark.** Quora automation cron stopped the same day. This was a daily channel; it is now a month-long gap.
- **Instagram just recovered** — first live @9takesdotcom session in 40+ days landed 2026-06-17; 3 consecutive passes since. Fragile but moving.
- **Pop-culture bottleneck unchanged: 22 unpublished drafts**, 12 of them 3+ months old (Mar 2026 cluster). Same backlog flagged in May.

## The actual work — two jammed gates blocking everything downstream

The blog engine writes daily but ships nothing, because both the auto-publish gate and the Quora distribution channel are stalled. The growth audit independently confirms content isn't the constraint — capture and activation are.

### Publish-gate blocker breakdown (from 2026-06-19 `publish-people` run)

| Blocker                                                | Drafts | Note                                                                      |
| ------------------------------------------------------ | -----: | ------------------------------------------------------------------------- |
| `stale_grade_rubric_v1` (needs `/grade_blog`)          |    355 | **Dominant blocker.** v1→v2 rubric migration left these stale             |
| `missing_full_image`                                   |     63 | Manual Canva pipeline (per memory: type images are manual)                |
| `missing_thumbnail_image`                              |     63 | Same                                                                      |
| `missing_content_quality`                              |     40 | Never graded                                                              |
| `content_quality_below_8.5`                            |     23 | Graded, failed gate                                                       |
| `missing_frontmatter`                                  |      7 |                                                                           |
| `too_few_sections` / `too_short` / `unfinished_marker` |     11 |                                                                           |
| **Parse error (separate):** `Jason-Sudeikis.md`        |      1 | Script flags `anchor:` multiline key at line 59; file is skipped entirely |

Only 1 draft (selena-gomez) is content-eligible and it's already published in Supabase. Net: the pipeline produces drafts daily but **zero can auto-publish** until the v1 grade backlog is worked down.

**Note on Jason-Sudeikis YAML:** On inspection the body `''` quote-escaping is actually valid YAML. The publish parser is tripping on the `anchor:` key structure, not on bad escaping — so this is a parser-edge-case, not the `\'` build-break class from the people-pipeline-YAML memory. Still skips the file. Worth a parser check, but it is not (yet) a deploy-breaker.

## Cross-surface status

### Blogs

- **People (automated):** Healthy. Cron 2026-06-19 created nick-offerman (Type 5). 437 drafts on disk. Pipeline holds the turn open correctly (no orphan recurrence visible in logs).
- **Pop-culture (bottleneck):** 29 published / 22 unpublished. Age buckets among unpublished: 12 are 3+ months old (Mar-04 cluster: us-presidents, royal-family, pop-queens, silicon-valley-power-players, streaming-royalty, oscar-contenders, online-gurus, marvel-universe, depp-vs-heard + paypal-mafia, plus Dec-2025/Jan-2025 stragglers world-leaders, aoc-and-the-squad, onlyfans-creators). 2 newest are 2026-05-19 (hormozi-marriage, my-first-million-shaan-sam). 3 have no date frontmatter (incel-exit-post, two tech-titans-twitter files) — flag.
- **Other categories:** community 2, enneagram 4, guides 3, topical 1, life-situations 1 unpublished. Low volume, not urgent.

### Distribution

- **9 packets in `docs/distribution-assets/`, all still unfired** (same as May): tim-ferriss, justin-bieber, tech-titans-disruptors, shawn-ryan (+instagram), chris-williamson, benson-boone, john-coogan. tim-ferriss is new since the May snapshot. Pure execution work, no writing needed.

### Social

- **Quora: DEAD.** Last session 2026-05-19 (`question-log.md` last entry same date, mtime May 19). Automation cron last log 2026-05-19. ~32 days dark. This was the highest-cadence distribution channel.
- **Instagram: RECOVERING.** Block resolved 2026-06-17 (first live session in 40+ days), 3 consecutive passes through 2026-06-19 incl. first pond-first v5 warmup. Engagement-targets doc append-only preserved.
- **Twitter:** No session log; no `/tweet`/`/twitter` commits in 30 days. Effectively dormant.
- **IG recovery todo** `instagram-recovery-todo-2026-05-07.md` still on disk — likely superseded by the 06-17 recovery but not closed/archived.

### SEO

- One commit in 21 days: `82797e9d SEO/GEO: dedupe blog JSON-LD, internal-link pass, fix build break`. corpus-stats.md refreshed Jun 19 (pipeline-driven). SEO engine is quiet; effort has shifted to people-draft authoring + growth instrumentation.

### Growth

- Fresh audit landed today (`docs/growth/growth-log.md`, 2026-06-20, currently uncommitted). Headline folded into TL;DR. Key durable findings: signups fix CONFIRMED working; give-first wall now emits `gate_shown` telemetry (53 rows, 46 this week) but still has NO `contribution`/`comment_submitted` event — can't measure in-funnel drop-off natively. First readable wall signal: ~22 gated fps → 3 contributed ≈ 13.6% (inferred by fingerprint join, caveat-heavy).

### Outreach

- Long-Form Network cluster (12 emails) still 0/12 sent per the rolling log. Bartlett still not published (was the #1 unblock-move on 2026-05-14). No new outreach activity in git this period.

### Email

- Sends jumped 10 → 81/wk (opens 30.9%, clicks 16.0% this week) — but spam signups will pollute these metrics and burn sender reputation if `/api/signups` stays unprotected. Welcome enrollments still only 11 over 8 weeks.

## What changed since the last status brief (2026-05-09)

- **Growth surfaces moved hard:** signups 0 → 79 (RLS fix confirmed), comments 0 → 4, email 10 → 81/wk. Spam exploitation of unprotected signups endpoint began.
- **Give-first wall instrumented** (`give_first_funnel_events` live, capturing `gate_shown`).
- **Quora died** (was running daily through 2026-05-19, now ~32 days dark).
- **Instagram outage + recovery** (40+ day block, resolved 2026-06-17).
- **Publish gate hardened to v2 rubric**, which jammed 355 v1-graded drafts.
- People pipeline kept running daily the entire period (healthy).
- Pop-culture bottleneck unchanged (still ~22 unpublished).
- Outreach frozen (0/12 cluster emails sent; Bartlett still unpublished).

## Recommendation (ranked by leverage)

1. **Add recaptcha to `/api/signups` — highest leverage, blocks active harm.** Why: an unprotected public POST is being bot-stuffed right now (75 of 79 signups spam), poisoning every email metric and risking sender reputation. This is product code (`src/routes/api/signups/`), so it's DJ's/an engineer's call, not yours to edit. First step: DJ scopes a recaptcha-verify on the signups POST (server already verifies recaptcha elsewhere via `RECAPTCHA_SECRET_KEY`). ~30–60 min eng. Risk: none; pure hardening.

2. **Unjam the publish gate by re-grading the freshest unpublished people draft.** Why: the daily pipeline is producing content that can never ship — 355 drafts stuck on the v1 rubric. You don't need to clear all 355; re-grading even the freshest few lets the auto-publisher resume. First step: DJ runs `/grade_blog` on the newest re-gradeable draft (or a chosen high-priority person), then `/blog_content_publish_people`. ~minutes per draft. Risk: low.

3. **Decide Quora's fate — revive or formally retire.** Why: it was the highest-cadence distribution channel and has been dark a month; the question-log shows it was producing high-quality targeted answers (Type-pond strategy). A dead channel that looks alive in docs is worse than a retired one. First step: DJ decides revive (`/quora-warmup` + fix the cron) vs. retire (archive the cadence). If reviving, check why the automation cron stopped on 2026-05-19.

## Open questions for DJ

1. **Signups recaptcha:** Approve adding recaptcha to `/api/signups`? This is the active-harm fix. (Product code — needs your go; not in marketing-pm scope to edit.)
2. **Publish gate:** Want me to propose a batch `/grade_blog` re-grade plan for the v1 backlog (e.g. freshest N drafts), or do you want to hand-pick which people ship first?
3. **Quora:** Revive or retire? If revive, do you want the cron failure investigated first?
4. **Bartlett:** Still the standing #1 outreach unblock from 2026-05-14 (publish `/blog_content_publish_people Steven-Bartlett` → unblocks cluster email #6). Still relevant, or has the Long-Form Network campaign been shelved?
5. **Distribution:** 9 unfired packets. Want a ranked "fire these 2–3 first" pick, or are these deprioritized behind the growth/publish fixes?

## Assumptions

- The 2026-06-20 growth-log entry is authoritative for all growth numbers (read directly, not re-derived).
- "Quora dead" inferred from session-dir + question-log + cron-log all stopping at 2026-05-19; not separately confirmed with DJ.
- Jason-Sudeikis YAML judged valid-but-parser-tripping from reading lines 55–62; the publish script's own report calls it invalid, so treat as unverified until a parser run.
