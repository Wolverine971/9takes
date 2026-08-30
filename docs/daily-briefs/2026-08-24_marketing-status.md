<!-- docs/daily-briefs/2026-08-24_marketing-status.md -->

# 9takes Marketing Status — 2026-08-24

**Unattended weekly run (marketing-pm, via `/weekly-marketing-brief`).** Prior status brief: `2026-08-17_marketing-status.md` (7 days). Growth data is **fresh** — the weekly audit ran this morning (`docs/growth/growth-log.md` newest entry `2026-08-24`, log `logs/growth-automation/audit-2026-08-24.log`, exit 0 at 06:17). Its headline and biggest leak are folded verbatim, not re-derived. No drafts, `published:` flags, distribution packets, product code, git operations, or external services were touched.

## TL;DR

- **Growth headline (verbatim, 2026-08-24 audit):** _"the record week did not compound (17 -> 3 comments, 0 of 6 returned) — and the reason is now a specific row: 9takes exited its best-ever user from its only nurture sequence with `exit_reason = 'answered_question'`."_
- **Correction to the growth record, and it is the best news in this brief: DJ shipped type capture on 2026-08-21, and the audit missed it.** The audit states _"Product shipped this week: nothing on any standing bet. 13 commits, all content."_ That is wrong. Commit `e62c71c55` (2026-08-21 11:59) added an **optional Enneagram selector to `/register` that persists to `profiles.enneagram`**, a **type selector on the `StrategicQuestion` post-contribution reveal**, a new `marketingEvents.ts` analytics module, server-side `posthogCapture.ts`, and a homepage chorus-readiness migration. This is the 08-17 brief's Recommendation #1 and growth's two-audit-old #1 bet. It landed three days before the audit ran and is recorded as unshipped.
- **The reveal half is measurement-only, and that is the gap worth closing.** `/register` writes the type to the profile (`+page.server.ts:169-173`). The reveal selector does not — `selectType()` fires a PostHog `type_selected` event and renders "Saved for this visit," nothing more. The surface with 35 weekly gate fingerprints captures nothing durable; the surface with ~1 does.
- **The auto-publisher has now been autonomously dark for 25 days** (last self-published `jack-antonoff`, 07-30) and failed all 7 mornings 08-18 → 08-24 — 24 of the last 25 days. Six profiles still shipped, all by DJ's hand: Keira Knightley, Alexandr Wang, Victoria Justice, Margaret Qualley, Yang Zhilin, James Clear. **Victoria Justice and Keira Knightley were named unblocks in five consecutive briefs and are now closed.**
- **New failure mode, third distinct unbounded-runtime outage in three weeks: the machine went to sleep.** Both of 08-24's nightly runs died on `API Error: Your computer went to sleep mid-response`, burning **6,248s + 1,555s** and then **1,989s + 1,287s** — roughly 3 hours for zero output. `nate-bargatze` is at retry 2/3. The 600s Stage-1 ceiling has now failed to fire on 08-08 (ENOTFOUND, 5,664s), 08-10 (credit exhaustion) and 08-24 (sleep).
- **Instagram is still unscheduled — second consecutive brief.** `openclaw cron list` returns 9 jobs and **zero Instagram**. Sessions dark **17 days** (last artifact 08-07), warmup logs dark 14 days, engagement-targets doc unwritten for 17 days. The content-ops queue is frozen 21 days with **15 overdue items** and still 0/10 approved.
- **The perspective-review backlog is not draining and structurally cannot.** Blocked count moved **89 → 86**, and only because drafts were published out from under it. Perspective-review directories grew 25 → 34, but all **+9 went to new nightly drafts**. Zero backfill occurred. Aging alongside it: pop-culture 18 unpublished (7th brief), Quora **97 days dark** (9th brief), 14 distribution assets unfired (33 days).

## The actual work — DJ shipped the acquisition half of typing; the return leg is still open

The last five audits ranked identity/type capture at or near the top. This week it partially shipped, and the two halves landed in opposite states.

| Surface                                                | What shipped 08-21                                                          | Persists a type?                            | Weekly reach           |
| ------------------------------------------------------ | --------------------------------------------------------------------------- | ------------------------------------------- | ---------------------- |
| `/register`                                            | Optional `Select`, "Not sure yet" + Types 1–9                               | **Yes** — `profiles.enneagram`              | ~1 fingerprint/week    |
| `StrategicQuestion` reveal                             | "Optional: which type feels most like you?" 1–9 button group                | **No** — event only, "Saved for this visit" | 35 gate fps/week       |
| `marketingEvents.ts` (new)                             | `reveal_completed`, `email_signup_completed`, `type_selected`               | n/a — instrumentation                       | all marketing surfaces |
| `posthogCapture.ts` (new)                              | Server-side capture path                                                    | n/a                                         | n/a                    |
| `20260821153551_enforce_homepage_chorus_readiness.sql` | Homepage distributor can only feature questions with exactly 9 cached takes | n/a                                         | homepage               |

Read plainly: the product now has a typing step for the 0.03% of visitors who reach `/register`, and a demand test for the 0.88% who reach a gate. Growth's `enneagram_type_prompt` sequence — already built, sitting in `draft`, addressable list of **137 untyped profiles with an email** — would reach more people than both new surfaces combined and requires a status flip, not a build.

The half that did not ship is the one this week's audit located in code. `src/lib/server/welcomeSequenceGuards.ts:8-15` still maps a top-level answer to `exit_reason = 'answered_question'`. It has fired exactly once in the table's history, on `hinder_86@hotmail.com` — last week's anonymous → register → 9-contribution star — and bought him 14 days of silence. He has not returned. Five consecutive matured cohorts have now returned 0%.

**Biggest leak (verbatim, 2026-08-24 audit):** _"9takes systematically silences the users it activates. The loop has no return leg at all — and this week the code that does it was located."_ A contributor's entire post-give experience is (a) a **91.5%** chance nobody ever replies (59 comments, 5 replies, last 10 weeks) and (b) if they registered, being removed from the only nurture sequence the moment they contribute.

## Tooling state

- **NEW failure class: host sleep.** `logs/blog-automation/cron-2026-08-24.log` shows two full pipeline launches (02:07 and 04:26) killed by `API Error: Your computer went to sleep mid-response` at Stage 0.5 and Stage 1 both times. Neither produced a draft. Combined with 08-08 (`ENOTFOUND`, 5,664s) and 08-10 (credit exhaustion), the nightly create engine has lost three nights in three weeks to failures that a wall-clock kill and a `caffeinate -i` wrapper would have contained or surfaced immediately. No guard exists for any of the three classes.
- **`9takes Daily Blog Creation` job now reports `error (2x)`** in `openclaw cron list`. The other 8 jobs are `ok` or `running`. The weekly growth audit and weekly marketing brief both fired on schedule this morning.
- **Wrapper still killing runs post-pipeline.** `RECONCILING: patrick-mahomes has a draft but was never moved to completed (wrapper likely killed post-pipeline)` on 08-24. Recurring and self-healing, but drafts land with `needsReview` rather than clean.
- **Liang Wenfeng (08-22) ran degraded.** Started 14:13 rather than 02:00, took 129 minutes, and left **7 stage warnings** (`6.8_same_type_similarity`, `8_revise`, `8.4_perspective_reverify`, `8.45_perspective_reverification_gate`, `9_post_revision_grade`, `9.7`, `9.8` all exit=1). Result: `fail_after_revision`, ungraded, publish-blocked on four classes.
- **Citation lint noise unchanged and now shipping on a published row.** Every publisher run since at least 08-13 emits `[alexandr-wang] rejected non-ISO date: 1997-01` and `[khabib-nurmagomedov:citations] rejected non-HTTPS or invalid URL: http://ufcstats.com/...`. Alexandr Wang is now published with that date defect live.
- **New SEO tooling shipped quietly:** `scripts/audit-internal-anchor-text.mjs` plus `docs/content-analysis/internal-link-anchor-audit.md` (generated 08-22). Result across 575 published markdown files, 220 Svelte surfaces, 4,127 internal links and 497 destinations: **0 high / 0 medium / 0 review**. Internal-link health is clean.
- **Uncommitted work in tree (untouched per parallel-work safety):** `docs/blog-automation/backlog-queue.json`, `docs/data/corpus-stats.md`, `docs/growth/growth-log.md`, `src/lib/components/molecules/famousTypes.ts`, `src/lib/data/corpus-stats.json`, plus two untracked `docs/content-analysis/pipeline-logs/2026-08-24_*_nate-bargatze/` directories.

## Cross-surface status

### Blogs — people

- Disk: **423 published / 92 unpublished** (was 417/92). Net +6 published.
- **All six publishes were manual.** Keira Knightley (08-17), Alexandr Wang (08-18), Victoria Justice (08-19), Margaret Qualley (08-20), Yang Zhilin (08-22), James Clear. Rate ~0.86/day, down from 1.7/day last week. The auto-publisher shipped nothing.
- **Blocker movement 08-17 → 08-24:**

| Blocker class                   | 08-17 |  08-24 | Read                                                                |
| ------------------------------- | ----: | -----: | ------------------------------------------------------------------- |
| `missing_perspective_review`    |    89 |     86 | -3, entirely via publishes. No backfill occurred.                   |
| `source_standard_failed`        |    47 |     47 | Flat, second week.                                                  |
| `missing_grade_stability_delta` |    38 |     37 | Flat. Supervised-regrade class, unchanged ~5 weeks.                 |
| `content_quality_below_8.5`     |    34 |     35 | The 8.2–8.5 structural ceiling.                                     |
| `stale_grade_rubric_v1`         |    29 |     29 | Flat.                                                               |
| `missing_content_quality`       |    14 |     15 | Ungraded drafts.                                                    |
| `missing_full_image`            | **7** | **12** | **Regressing.** +5 in a week — new drafts outrun the portrait step. |
| `missing_thumbnail_image`       | **7** | **12** | **Regressing.**                                                     |

- **Perspective-review arithmetic:** directories on disk 25 → **34** (+9), every one produced by the nightly pipeline for a _new_ draft. 86 legacy drafts remain unreachable, and at 1 pipeline slot/night consumed by creates, the backfill rate is structurally zero. This is the second brief carrying the same unanswered fork.
- **Create quality is strong.** Clean runs 08-18 → 08-23: Alexandr Wang 8.6 B+ pass, **Bill Burr 8.9 B+ pass** (best in weeks), Ms Rachel 8.1 B pass, Jonathan Bailey 8.7 B+ pass, Liang Wenfeng fail_after_revision (ungraded), Patrick Mahomes 8.6 B+ pass. Then 08-24 produced nothing.
- **The Type 2 anchor arrived and does not clear the gate.** `ms-rachel` — flagged for four briefs as the missing Instagram type-pond anchor — graded **8.1 with a 0.5 instability delta** (first 8.6, regrade 8.1). It is below the 8.5 publish gate and would need a supervised regrade or revision pass.
- **Closest to publish today** (08-24 log): `jonathan-bailey` and `simone-biles` — **images only**, no other blocker. Then six drafts at `content_quality_below_8.5:8.4` + `missing_perspective_review` (hunter-biden, jynxzi, ksi, penguinz0, plaqueboymax, rose-blackpink).
- Backlog queue: `nate-bargatze` (retry 2/3), `ryan-holiday`, `nara-smith`, `marcus-aurelius`. Weekly create cap 0/5, week started 08-23. Capacity is not the constraint. Queue stats report 391 published / 132 unpublished — that is the DB view and lags disk.

### Blogs — pop-culture and other categories

- Pop-culture: **18 unpublished, 7th consecutive brief unchanged.** By `date:` frontmatter — 0–4 weeks: **0**; 1–3 months: **1** (`world-leaders-enneagram-personality-dynamics`, 06-30); **3+ months: 17**. Oldest is `aoc-and-the-squad-enneagram-types` at **2025-12-15, eight months old**.
- Other categories, outside the people publisher entirely: community **16 of 35**, enneagram **16 of 167**, guides **8 of 25**, topical 1 of 1, life-situations 1 of 1 — roughly **42 finished non-people drafts** with no gate and no automation.

### Instagram

- **Unscheduled for a second week.** 9 OpenClaw jobs, none Instagram. The only IG-adjacent entries remain two `systemEvent` text nudges (`Daily Engagement Reminder` 09:30, `Monday Content Batching Reminder` 10:00).
- Sessions dark **17 days** (last artifact `2026-08-07_instagram-warmup-2.md`). Warmup logs dark 14 days (last 08-10). `instagram-engagement-targets.md` unwritten since 08-07.
- **Content-ops queue frozen 21 days** (`queue.json` untouched since 08-03) and still RED: 0/10 approved or scheduled; `briefed=8, copy_ready=9, design_ready=2, published=1, blocked=1`. **15 of 22 items are past their target date**, worst first: `ig-chappell-roan-reel` (copy_ready, 20 days over), `ig-pedro-pascal-lore` (18), `ig-nine-ways-self-sabotage` (16, design_ready), `ig-lana-del-rey-reel` (15), `ig-tim-ferriss-lore` (14).
- **Reels E1 has produced nothing in 21 days.** `docs/instagram/reels/experiment-log.md` untouched since 08-03. No native 9takes Reel has ever been posted. The Odyssey window flagged as time-boxed on 08-05 is now effectively expired.
- Comment leg: unchanged at zero posted, and moot while the crons are absent.

### One Take / video

- `docs/marketing/one-take/founder-origin-arc.md` untouched since 08-13. Ep 1 (MrBeast) still unfilmed, **30 days** after being declared ready.

### Distribution / Quora / Twitter

- **14 distribution assets unfired**; directory untouched since 07-22 (**33 days**). Oldest packets date to February.
- **Quora: 97 days dark.** Last session, cron log and question-log entry all stop at 2026-05-19. Ninth consecutive brief carrying a revive-or-retire call that has never been answered.
- Twitter: no session artifacts since 05-19. Last content work was 08-13 (`docs/twitter/voice-and-tone.md`). Nothing new this window.

### SEO

- GSC `latest.json` runDate **2026-08-13**, window 2026-05-05 → 08-11. Eleven days old but **the T-09 clean window still holds** — `seo-content-strategist` remains runnable on uncontaminated data and has not been run since the window opened.
- corpus-stats, crosslink index and sitemap regenerated **08-23 15:30**. Sitemap **679 URLs** (was 674), 440 personality-analysis entries.
- Internal-link anchor audit (new, 08-22): **0 high / 0 medium / 0 review** across 4,127 internal links.
- Corpus stats show **137 profiles in the review pipeline**, 30 published in the last 30 days, trailing average 24.3 new profiles/month.

### Growth (audit 2026-08-24 — folded, not re-derived)

- **Headline (verbatim):** _"the record week did not compound (17 -> 3 comments, 0 of 6 returned) — and the reason is now a specific row: 9takes exited its best-ever user from its only nurture sequence with `exit_reason = 'answered_question'`."_
- **Biggest leak (verbatim):** _"9takes systematically silences the users it activates. The loop has no return leg at all — and this week the code that does it was located."_
- Complete week 2026-08-17 (Mon–Sun): **3,972 new visitors, 0 signups, 0 profiles, 3 comments**, gate 35 → 3 = **8.6%** (was 12.0%). The 08-10 cohort matured at **0 of 6 returned** — the fifth consecutive matured cohort at 0%.
- **The structural ceiling that reframes three audits of gate-tuning: the gate reaches 0.88% of traffic.** `StrategicQuestion` is embedded in **3 of 824** blog markdown files — verified on disk this run (`depression-patterns-by-enneagram-type`, `enneagram-and-adhd-which-types-struggle-most`, `neurodiversity-vs-personality`). The site's highest-dwell page, `/enneagram-corner/enneagram-and-mental-illness` (62 fps, 67.4s), has no gate.
- Honest counterweight the audit supplies itself: blog embeds convert **~10x worse** than the homepage — homepage 107 gate fps → 18 contributions (**16.8%**), the three gated enneagram-corner pages 58 → 1 (**1.7%**), native `/questions` 57 → 0 (**0%**). Scale-out is a volume bet at 2–5%, not a 17% bet.
- `reactivation_dormant` sent **48 more emails** this week against last audit's explicit stop recommendation: 5 opens, 0 clicks, 0 returns. Cumulative **275 sends / 43 opens / 1 click / 4 unsubs / 0 real returns**, and the single cross-join "return" is DJ's own account. `reactivation_zombies` open rate collapsed 34.4% → **8.6%** on its 4th send.
- **Attribution bug unfixed and worse: 3,428 of 3,972 first-touch fingerprints (86.3%) labelled `9takes.com`** (was 84%). `src/routes/api/analytics/page-view/+server.ts:12-25`. Real identifiable sources this week: Google 391, DuckDuckGo 96, Bing 54, Ecosia 21, Brave 13, claude.ai 3. **No channel-attribution question in this brief or the last eight is answerable.**
- Coaching waitlist dead **20 weeks** (last row 2026-04-06); `/book-session` drew 0 fingerprints.

### Email

- `welcomeSequenceGuards.ts` **unchanged** — the `answered_question` / `created_comment` exit is still live and is growth's #1 bet to invert.
- `enneagram_type_prompt` ("Missing Enneagram Type — One-Off") is **built and sitting in `draft`**. Addressable list: 137 untyped profiles with an email. Untyped share holds at **88%**.
- The reactivation pause decision has now been pending since 08-03 — three weeks and two audit recommendations.

### Outreach

- No new artifacts since `2026-08-04_nine-mirrors-podcast-pilot.md`. Nothing sent. Long-Form cluster still 2/12.

## What changed since the last brief (2026-08-17)

- **Type capture partially shipped on 08-21** (`e62c71c55`): `/register` selector persisting to `profiles.enneagram`, `StrategicQuestion` reveal selector (event-only), `marketingEvents.ts`, `posthogCapture.ts`, homepage chorus-readiness migration, register spec coverage. **The 08-24 growth audit records this as unshipped.**
- **Growth reversed:** 17 → 3 contributions, gate 12.0% → 8.6%, gate exposure 50 → 35 fps, and the 08-10 cohort matured at 0/6.
- **The welcome-sequence exit guard was located in code** and identified as the mechanism silencing the best user on record.
- **Six profiles published, all manually.** Victoria Justice and Keira Knightley — five-brief-old named unblocks — finally cleared.
- **Auto-publisher extended its autonomous drought to 25 days** and failed all 7 mornings this window.
- **New host-sleep failure class** cost both of 08-24's nightly runs, ~3 hours of compute, and left `nate-bargatze` at retry 2/3.
- **Image debt began regressing** (7 → 12 on both classes) after being declared solved last week.
- **Ms Rachel, the long-missing Type 2 anchor, was created but graded 8.1** and cannot publish.
- **Internal-link anchor audit tooling shipped**, returning a clean bill across 4,127 links.
- **Unchanged and now aging:** Instagram unscheduled (2nd brief), content-ops queue frozen 21 days with 15 overdue, Reels E1 dormant 21 days, One Take ep 1 unfilmed 30 days, Quora 97 days dark, 14 distribution assets 33 days idle, pop-culture 18 unpublished (7th brief), perspective backfill undecided (2nd brief), reactivation pause pending 3 weeks, attribution bug unfixed.

## Recommendation

Three, ranked by leverage. All require DJ's decision; nothing was executed this run.

**1. Close the loop DJ opened on 08-21 — invert the welcome exit and flip `enneagram_type_prompt` out of `draft`.** This is the first time this recommendation has a genuinely new shape: the acquisition half of typing now exists in production, so the argument is no longer "build type capture," it is "stop discarding the users who already gave you everything." Both remaining pieces are already built. The exit guard is a one-line change at `src/lib/server/welcomeSequenceGuards.ts:8-15`; the typing sequence needs a status flip and reaches **137 addressable untyped profiles** — more than both new surfaces combined. Growth's success bar: ≥1 of the next 10 contributors returns and contributes again within 7 days (baseline 0 of 21 across five matured cohorts). _First step:_ decide whether contributing should promote a user into a contributor sequence instead of ejecting them; if yes, hand `welcomeSequenceGuards.ts` and the sequence copy to eng in one ticket. ~Half a day. Highest ceiling on the board and the cheapest item on it. Risk: the contributor sequence copy does not exist yet, so step one ships as "do not exit" before the new emails land.

**2. Answer the perspective-review fork — it is the second brief and the backlog provably cannot drain itself.** Last week's read has now been confirmed by a week of data: 9 new perspective-review directories were produced and **all 9 went to new drafts**; the blocked count fell only because DJ hand-published out from under it. There is no path where 86 finished, graded, largely image-complete assets become publishable without a decision. Two clean options unchanged: **(a) grandfather** drafts created before the gate landed (~08-04) with a date check so the publisher can select them on the old criteria, or **(b) authorize a batch `scripts/run-blog-pipeline.sh <Person> --resume` campaign**, which at one run per night competes directly with creates. _First step:_ pick (a) or (b). ~10 minutes to decide. Until then the 06:00 failure alert stays permanently red and is training everyone to ignore it.

**3. Restore the Instagram crons or retire the channel — and add the missing runtime guards while you are in the scheduler.** Second brief with zero Instagram jobs registered; the channel is now 17 days dark and the queue has 15 overdue items with nobody to work them. Bundle the cheap reliability fix here: the nightly create engine has lost three nights in three weeks to unbounded runtime (ENOTFOUND 5,664s, credit exhaustion, host sleep 6,248s) and the 600s Stage-1 ceiling has never once fired. _First step:_ re-create the three warmup jobs on the 07-26 command-payload pattern (never wrapped in `agentTurn`, per memory `[[blog-automation-scheduler]]`), then wrap `nightly-blog-cron.sh` in `caffeinate -i` and a hard `timeout`, and make the wrapper alert on the `out of usage credits` / `went to sleep` / `ENOTFOUND` strings. ~30 minutes total. If Instagram is honestly not getting attention this quarter, retire it explicitly and stop carrying it and the 15 overdue queue items in briefs.

Deliberately not proposed again: Quora revival and the 14 distribution packets. Both were recommended for formal retirement last week and neither was answered. They are carried below rather than re-argued.

## Open questions for DJ

1. **Does the 08-21 shipping change the growth plan?** The audit ranked its bets assuming nothing shipped. Should `growth-analyst` be told to re-baseline next week around the live `/register` and reveal selectors — and should the reveal selector be made to **persist** a type rather than fire an event, given it sees 35x the traffic of `/register`?
2. **Welcome exit guard:** invert `answered_question` / `created_comment` from an exit into a promotion? (Growth bet #1, one-line change, unshipped.)
3. **`enneagram_type_prompt`:** flip it out of `draft` and send to the 137 untyped profiles? It is built. This is the third audit asking.
4. **Perspective-review backfill:** grandfather pre-08-04 drafts, or authorize a batch `--resume` campaign? Second brief; 86 assets frozen; the backlog does not drain on its own.
5. **Instagram:** re-create the three warmup crons, or formally retire the channel and its 15 overdue queue items? Second brief with zero jobs registered.
6. **Pipeline runtime guards:** authorize `caffeinate -i` + a hard `timeout` on the nightly cron and a wrapper alert on the three known failure strings? Three lost nights in three weeks.
7. **Reactivation email:** stop `reactivation_dormant`? Pending since 08-03; 48 more sends went out this week against an explicit stop recommendation, cumulative 275 sends for 1 click and 0 real returns.
8. **Analytics attribution:** authorize the `page-view/+server.ts:12-25` referrer fix? Now 86.3% self-referral, up from 84%. No channel decision in this brief is defensible until it lands.
9. **Ms Rachel:** the long-sought Type 2 Instagram anchor graded 8.1 with a 0.5 instability delta. Supervised regrade, revision pass, or drop the Type 2 pond plan?
10. **Standing calls, now unanswered for two consecutive briefs:** Quora (97 days dark, 9 briefs), 14 distribution assets (33 days, 5 briefs), 18 pop-culture drafts (7 briefs), Reels E1 / Odyssey (window expired), One Take ep 1 (30 days). Retire them or assign dates — re-listing them a tenth time has no information value.

## Assumptions

- Publish counts are read from disk frontmatter in `src/blog/people/drafts/`, not from `blogs_famous_people`. `backlog-queue.json` reports 391/132, which is the DB view and lags disk; disk is treated as authoritative for pipeline state.
- Growth numbers are folded verbatim from this morning's audit and were not independently verified against the database. The one item independently verified this run is the `StrategicQuestion` embed count (3 of 824), which matches.
- The 08-21 shipping claim is verified from the commit diff and current file contents, not from production behaviour. Whether the `/register` selector has been exercised by a real user is unknown — it landed mid-week and `/register` drew 1 fingerprint in the measured window, so there is no data yet either way.
- The six publishes are inferred from commit subjects plus disk `published: false → true` deltas against `ac3923e4a`; the exact mechanism (admin content-board vs. `pnpm push:people`) was not verified.
- Instagram cron absence is observed (0 of 9 jobs) but the cause remains unknown, unchanged from last week.
- Pop-culture age buckets use the `date:` frontmatter field, not `lastmod` or file mtime.
