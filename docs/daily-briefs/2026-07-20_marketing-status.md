<!-- docs/daily-briefs/2026-07-20_marketing-status.md -->

# 9takes Marketing Status — 2026-07-20

**Unattended run (marketing-pm).** DJ not present. No actions taken that require confirmation; all pending decisions routed to "Open questions for DJ." No blog drafts, `published:` flags, product code, git mutations, or external services touched. Prior status brief: `2026-07-13_marketing-status.md`.

## TL;DR

- **Growth data is FRESH (audit ran today, 2026-07-20).** Headline, verbatim from the growth audit: _"the give-first loop finally turned — 9-comment week, native funnel live, one full loop turn — but only on the ~0.6% of traffic it reaches."_ Comments went **0 → 9** (highest contribution week in the window), the native `contribution` event now fires end-to-end, and `nine_user_takes` (Chorus) moved **1 → 3** — **the "Chorus is a likely silent bug" caveat from every prior audit is resolved: the mechanic works.**
- **Biggest leak, verbatim:** _"the give-first loop is now PROVEN to work, but it is quarantined to ~0.6% of traffic… The leak is no longer 'does the path work' (it does) — it is 'the working path isn't where the traffic is.'"_ The 4,260-visitor firehose still lands on personality-analysis, which has **0 signups / 0 reachable identity for the 3rd straight week** (coaching waitlist: 0 for 8 weeks).
- **Publish valve REOPENED.** Last brief's 3-day publish jam is cleared: **10+ people posts shipped in the last 3 days** (Benny Blanco, Joe Lonsdale, Kacey Musgraves, **Kaia Gerber**, Lamine Yamal, Madonna, **Milly Alcock** [the 07-13 scout pick], **Oliver Tree**, Pete Hegseth, PinkPantheress) plus **julia-fox published today** (Type 4, grade 8.5, row 1088). Kaia Gerber and Oliver Tree were both publish-blocked last brief and have now cleared.
- **But the CREATE engine failed again.** Tonight's cron target `travis-kelce` produced **no draft** — Stage 1 create timed out (background research agent didn't return inside the 600s ceiling; ran 957s, halted). `halt_reason: draft_missing_after_stage_1_create`. Queued for retry 1/3. Same net result as the earlier `oliver-tree` failures, different signature (timeout, not API refusal).
- **Instagram is fully dark AND has escalated — 17 of the last 20 mornings blocked.** Every warmup 07-14 → 07-19 is `BLOCKED`. On 07-19 @9takesdotcom **dropped out of the account picker entirely** — the one-tap re-login is gone; DJ must now go through "Log into an Existing Account" and retype the full handle + password.
- **Quora ~62 days dark** (last activity 2026-05-19). **Distribution: 9 packets + 2 carousels + 2 IG variants still queued, none fired.** Both unchanged.

## The actual work — the pipeline split: publish recovered, create broke

The content funnel is create → grade/gate → publish. Last week publish was jammed and create was healthy. **This week the two swapped state.** Publish fully recovered and is flowing the scout picks through; create hit a fresh failure mode (a background-research timeout) and shipped nothing tonight.

This matters because the growth audit says the working give-first mechanic is starved for traffic on `questions` while personality-analysis takes the firehose — so keeping fresh, indexed person-posts landing on PA remains the marketing lane's main contribution to the funnel. Publish delivering again is the good half; create stalling is the risk to watch.

| Artifact / log                                                  | Observed state                                                                                                                                                      | Why it matters                                                                                                                                                 |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `logs/blog-automation/cron-2026-07-20.log`                      | `travis-kelce` selected; Stage 1 create ran 957s then terminated ("Background tasks still running after 600s"); **draft never written**; `RETRY 1/3` queued.        | Create regressed from "healthy." Failure is a research-agent timeout, not the old API refusal — but no draft ships either way.                                 |
| `.../pipeline-logs/2026-07-20_020000_travis-kelce/summary.json` | `completed:false`, `halt_reason:"draft_missing_after_stage_1_create"`, grades all null.                                                                             | Confirms the halt; `src/blog/people/drafts/travis-kelce.md` does not exist on disk.                                                                            |
| `logs/blog-automation/publish-people-2026-07-20.log`            | **julia-fox published** — Type 4, grade 8.5, 2,828 words, Supabase row 1088, images + sitemap verified. `Blockers: none`.                                           | The publish gate ships again. julia-fox was image-blocked last brief; image now present.                                                                       |
| People drafts (disk, lastmod 07-18→07-20)                       | Benny Blanco, Joe Lonsdale, Kacey Musgraves, **Kaia Gerber**, Lamine Yamal, Madonna, **Milly Alcock**, **Oliver Tree**, Pete Hegseth, PinkPantheress (+ julia-fox). | Strong publish cadence resumed; **both prior blockers (Kaia Gerber grade-delta, Oliver Tree image) cleared**, and the 07-13 scout pick (Milly Alcock) shipped. |
| `docs/blog-automation/backlog-queue.json`                       | 127 unpublished / 266 published / **67.7%** completion. `rateLimit.currentWeek=1`, week start 2026-07-19. Not paused.                                               | Automation is live and inside its rate limit; the limiter is not the blocker.                                                                                  |
| `docs/blog-automation/override.json`                            | `pause=false`, `maxPerWeek=5`, `currentWeekCount=1`, `forceNext=null`, week start 2026-07-19.                                                                       | Nothing is force-queued; create can be steered by setting `forceNext` if travis-kelce keeps timing out.                                                        |

## Tooling state

- **Blog publish gate:** Healthy again. Resumed daily-ish shipping; both human-in-loop blockers from last brief (grade-stability delta on Kaia Gerber; manual image on Oliver Tree / julia-fox) were satisfied and cleared without marketing-pm intervention.
- **Blog create engine:** Regressed. `travis-kelce` timed out in Stage 1 (deep-research agent exceeded the 600s background ceiling). If retry 1/3 fails the same way tomorrow, this is a real research-timeout regression, not a one-off — the fix is either a longer create ceiling or `forceNext` to a lower-research person.
- **Instagram tooling:** Unchanged code path; the account-persistence blocker escalated. @9takesdotcom is now fully evicted from the Chrome account picker (not just its cookie). Per memory `[[instagram-session-eviction]]`, another device (phone app?) is the leading suspect for re-claiming/invalidating the login.
- **Weekly automation:** Both Monday jobs ran on schedule — growth audit 06:00 (OK, exit 0), marketing brief 06:05 (this run).

## Cross-surface status

### Blogs

- **People pipeline (disk):** 483 markdown files — **391 `published: true`, 85 `published: false`** (was 480 / 382 / 91 last brief: **+9 published, −6 unpublished**). Publishing is net-draining the backlog again.
- **Pop-culture:** 54 top-level files; grep finds 32 published / 18 unpublished (4 files lack a parseable top-level `published:` flag). **Stale cohort unchanged:** the Dec 2025 pair (`aoc-and-the-squad`, `onlyfans-creators`) plus the eight 2026-03-04 `*-enneagram-analysis` drafts remain unpublished — same chronic bottleneck flagged every brief. Two pop-culture files (`influencer-enneagram-types-instagram`, `reddit-moderators-type-1-internet`) show as uncommitted/modified in `git status` — **parallel work in progress; not touched.**

### Distribution

- **9 packets + 2 carousels + 2 IG variants still queued, none fired:** benson-boone, chris-williamson, john-coogan, justin-bieber, lana-del-rey, shawn-ryan (+IG), steven-bartlett (+IG), tech-titans-disruptors, tim-ferriss; carousels robert-greene + enneagram-in-your-own-way. No fired-packet evidence. Unchanged.

### Social

- **Instagram: fully dark, escalated.** Warmups 07-14 → 07-19 all `BLOCKED` (`instagram_account_not_in_picker` / `instagram_session_logged_out`). Blocked **17 of the last 20 runs**. 07-19 regression: the remembered @9takesdotcom row is gone from the picker, so re-login now requires the full handle + password via "Log into an Existing Account." Every sibling account persists indefinitely; only 9takes is ever purged.
- **Quora: dead ~62 days.** Sessions dir holds only `README.md`; latest cron log 2026-05-19. No revive.
- **Twitter/X:** No persistent session log; no current signal.

### SEO

- `docs/data/corpus-stats.md` **regenerated today (2026-07-20T10:01Z):** 30 published in last 30 days, 87 in last 90, 55 updated in last 30. Fresh. `BLOG-CROSSLINK-INDEX.md` and `corpus-stats.json` also modified in `git status` (regenerated this run).
- `docs/data/gsc/latest.json` **still runDate 2026-07-06** (window ends 2026-07-04) — unchanged from last brief, now **~16 days stale**. Next GSC pull would refresh the seo-content-strategist's inputs.

### Growth (FRESH — audit ran 2026-07-20)

- **The loop turned positive for the first time.** 0 → 9 comments (all real: 7 distinct questions, one a reply, 0 removed); native `contribution` event live on masking question 567 (T-12 wave 1); Chorus `nine_user_takes` 1 → 3. One full loop turn (n=1, real): profile `07d2e6c9` registered 07-16 → welcome_sequence same second → 5 comments in ~90 min → **returned 07-18** for 3 more. Wall conversion **12% inferred** (25 gate fps → 3 contributors), 8.3% native on q567.
- **Honesty flag (verbatim from audit):** the 9 comments are concentrated in essentially one new human — do not read it as a trend yet.
- **Biggest leak:** the proven mechanic is quarantined to ~0.6% of traffic. PA takes the 4,260-visitor firehose with no contribution/capture mechanic → 0 signups / 0 identity, 3rd straight week; coaching waitlist 0 for 8 weeks.
- **Growth's #1 bet:** port the now-proven give-first / Chorus reveal onto personality-analysis, above the fold, before the ~12s dwell cliff. Success = ≥1% of PA sessions fire a native `gate_shown → contribution` in 30 days (~35/wk vs ~0); guardrail = bounce not worse by >3 pts. **Product/eng scope — routed to Open questions.**

### Outreach

- Unchanged. Long-Form cluster staged; Gmail audit (07-14 log) confirmed Williamson emailed 05-15 and Schulz 06-30 (no replies); Abdaal + Bartlett drafts still safe to send. No new send evidence.

### Email

- Small tick up but still starved: **4 sends / 3 opens / 1 click** last week (from 2 sends/wk). `welcome_sequence` now has a live enrollment fueled by the 07-16 new profile. Reactivation sequences (`reactivation_cold/dormant/zombies`) still `draft` / 0 enrollments — NOT running.

## What changed since the last brief (2026-07-13)

- **Growth flipped from "biggest week → nothing" to "the loop provably works."** Last brief: 5,357-visitor week converted to 0. This week: give-first + Chorus fired end-to-end for the first time, one full register→contribute→return turn, 12% wall conversion. The prior "half-blind / likely silent Chorus bug" caveat is **resolved**.
- **Publish unjammed on its own.** The 3-day jam cleared: 10+ people posts shipped 07-18→07-20 (incl. the two prior blockers Kaia Gerber + Oliver Tree, and the scout pick Milly Alcock); julia-fox published today. People disk moved 382 → 391 published.
- **Create regressed.** `travis-kelce` produced no draft (Stage 1 research-agent timeout, 957s > 600s ceiling). Retry 1/3 queued.
- **Instagram got worse, not better.** From "7/7 blocked" to "17/20 blocked" with an escalation: the account is now fully dropped from the picker, raising the re-login friction.
- **SEO infra refreshed today** (corpus-stats + crosslink index). GSC export unchanged (still 07-06, ~16 days stale).
- **Quora crossed ~62 days dark; distribution still 13 unfired.** No change.

## Recommendation (ranked by leverage)

1. **Port the now-proven give-first / Chorus reveal onto personality-analysis (growth's #1 bet).** Why: the identical mechanic already converts 8–12% on the tiny `questions` surface and produced a full loop turn this week, while PA — which takes ~4,260 visitors/week — converts ~0. Moving the working mechanic to the traffic is the single highest-EV move in the whole system. First step: DJ green-lights eng to surface a masking-question / reveal prompt above the fold on person pages, instrumented with the native `gate_shown → contribution` event. **Product/eng scope — routed as Open question #1.** Effort: eng sprint. Risk: guardrail bounce ≤3 pts.
2. **Re-login @9takesdotcom and stand up a dedicated Chrome profile.** Why: IG has been dark 17 of 20 mornings and just escalated — the one-tap re-login is gone. Every warmup and reply is blocked until DJ re-authenticates, and the eviction will keep recurring on the shared profile. First step: Instagram → Switch accounts → "Log into an Existing Account" → type `9takesdotcom` + password → **check "Save login info"**; then run `/instagram-warmup` same day and audit which other device keeps re-claiming the login. Effort: 10–20 min. Risk: none — credential work only DJ can do.
3. **Watch the create engine; if travis-kelce fails retry 2 tomorrow, force-advance the queue.** Why: create shipped nothing tonight on a research-agent timeout. Publish is healthy but will run dry if create keeps halting. First step: if the 07-21 retry times out again, set `forceNext` in `override.json` to a lower-research-load person (or raise the Stage-1 create ceiling). Effort: minutes. Risk: low — publish backlog (85 unpublished drafts) gives runway.

_(The Instagram and create items are the actions DJ can take directly this week; the PA give-first port is the highest EV but is product/eng and is routed below.)_

## Open questions for DJ

1. **Growth's #1 bet (product/eng):** Green-light eng to port the proven give-first / Chorus reveal onto personality-analysis, above the fold? The mechanic converts 8–12% on `questions` and turned a full loop this week, but PA (the traffic firehose) has no capture and produced 0 signups for the 3rd straight week. Highest-EV move in the system; outside marketing-pm scope.
2. **Scale masking-question 567 (product/eng):** q567 is the only surface emitting native `contribution` events (2 this week). Replicate the instrumented prompt on more high-traffic questions/blogs to scale the one working native funnel?
3. **Create timeout:** `travis-kelce` produced no draft (research-agent exceeded the 600s create ceiling). Want to raise the Stage-1 ceiling, or `forceNext` a lower-research person if the 07-21 retry times out again?
4. **Instagram:** Re-login @9takesdotcom (now full-handle-retype via "Log into an Existing Account") and stand up a dedicated Chrome profile? Dark 17/20 mornings and escalating.
5. **Distribution (standing):** 13 assets queued (9 packets + 2 carousels + 2 IG variants), none fired. Fire the freshest (Bartlett / Ferriss / Lana), or keep paused? Note: IG variants can't fire until #4 is resolved.
6. **Quora (standing):** Revive or formally retire at ~62 days dark?
7. **GSC refresh:** Pull a fresh GSC export? `latest.json` is ~16 days stale (still 07-06), which is the seo-content-strategist's input.

## Assumptions

- File counts are frontmatter scans on disk, not live DB counts. Disk published/unpublished totals drift from `backlog-queue.json` stats because they count different sets (disk drafts vs queue targets).
- "Distribution unfired" and "no send evidence" mean nothing was found in default repo surfaces; external channels were not queried.
- No product behavior was tested live; growth numbers are taken verbatim from the 2026-07-20 growth-log entry, not re-derived.
- `travis-kelce` is inferred failed (no draft on disk, `completed:false` in summary.json); the retry outcome is not yet known this run.
- Uncommitted files in `git status` (julia-fox.md, two pop-culture drafts, famousTypes.ts, sitemap.xml, corpus-stats, growth-log, backlog-queue, crosslink index) are automation/parallel-work outputs and were left untouched.
