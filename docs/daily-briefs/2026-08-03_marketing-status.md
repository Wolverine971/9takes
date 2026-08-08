<!-- docs/daily-briefs/2026-08-03_marketing-status.md -->

# 9takes Marketing Status — 2026-08-03

**Unattended run (marketing-pm).** DJ not present. No actions taken that require confirmation; all pending decisions routed to "Open questions for DJ." No blog drafts, `published:` flags, product code, git mutations, or external services touched. Prior status brief: `2026-07-27_marketing-status.md`.

## TL;DR

- **Growth data is FRESH (audit ran today, 2026-08-03).** Headline, verbatim: _"the 07-20 spike did not compound — contributions 14 -> 4, and the matured cohort returned 0 of 9. Root cause candidate found: 82% of registered profiles have no Enneagram type."_ Last week's "best contribution week ever" reversed: native gate conversion 16.3% → **5.4%**, six straight days of zero contributions, and last week's 22% contributor-return number was an artifact that corrects to **0%** under a strict `>24h` window.
- **DJ personally broke the publish drought — and it re-jammed in one day.** Ten drafts carry publish dates 07-27 → 07-30 (disk `published: true` went **392 → 401**), but the auto-publisher shipped only **one** of them (jack-antonoff, 07-30). The other nine were manual: Mira-Murati went 8.4 → 8.6 and Jason-Sudeikis 8.1 → 8.5 on v2 rubric, so supervised regrades happened. That was exactly last brief's Recommendation #2, executed. Then publish failed **four straight days** (07-31 → 08-03).
- **The publish gate's #1 blocker flipped from stale grades to missing images.** Top blocker today is `missing_full_image=54` / `missing_thumbnail_image=54`, overtaking `stale_grade_rubric_v1` (34 → 30). Per memory `[[type-image-pipeline]]`, type images are **manual Canva only** — the automated pipeline was removed 2026-06-10 and must not be rebuilt. The dominant blocker now has no automation path.
- **NEW: the create pipeline has a filename-resolution bug and burns its last retry tonight.** `scripts/run-blog-pipeline.sh:109` builds `DRAFT_PATH="src/blog/people/drafts/${PERSON}.md"` from the queue name. The cron passed `stableronaldo`; the create stage correctly wrote `Stable-Ronaldo.md`. Nine downstream stages have now been skipped **twice** (08-02, 08-03) on a draft that exists on disk and is good. `retryCount: 2` — the 02:00 run tonight is retry 3/3.
- **Instagram: sourcing healthy, output still zero — and the agent is now asking DJ to pick a fork.** Warmups ran clean 07-30 → 08-02 on the dedicated profile. But **zero comments have been posted for 4+ consecutive sessions**; the newest replies doc is `2026-07-26`, 8 days old. Melissa's owed reply is ~46 days; Candice's first touch has been queued **8 consecutive scans**. New failure mode on 07-28/07-29: `You've hit your weekly limit` (Claude usage cap, not session eviction).
- **New surface, RED:** the Instagram content-ops queue is live (22 items) and **0/10 approved or scheduled**. Robert Greene is in `qa` with a target date of **today**; Chappell Roan Reel targets 08-04. Nothing is approved.
- **Unchanged:** Quora **76 days dark**; 14 distribution assets unfired (none since the 07-22 blackpill package); pop-culture 18 unpublished for the 4th brief running; signups 0 (5th week); coaching waitlist 0 (10 weeks).

## The actual work — the content engine broke at both ends this week

Last brief the story was one-sided: create at cap, publish at zero. This week both ends failed, in different ways, and DJ's manual intervention is the only reason anything shipped.

**Create** stopped producing consumable output because of a path bug, not a content or API failure. The 08-03 log is worth reading in full: the create agent diagnosed the bug itself, correctly scoped it (macOS APFS case-insensitivity means `caitlin-clark` still resolves to `Caitlin-Clark.md`; it only breaks on **single-token handles that are really two words**, which is why `penguinz0` and `jynxzi` passed), and declined to fix it as out of scope. It also used the wasted run as a verify pass and caught three factual errors the 08-02 run had self-certified as clean: the 2026 viewer average (45k was the last-30-days figure, not the year), the Twitch ban count (four → five), and an unprovenanced "hundreds of thousands watched." The draft is now better than it was and still invisible to the pipeline.

**Publish** shipped 10 posts in four days and then nothing for four more. The manual flush worked; the structural problem underneath moved rather than closed.

| Artifact / log                                       | Observed state                                                                                                                                                                                                                                             | Why it matters                                                                                               |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `logs/blog-automation/cron-2026-08-03.log`           | `[Stage 1] create finished (exit=0, 305s)` then `did not produce src/blog/people/drafts/stableronaldo.md; halting remaining stages`. `RETRY 2/3`.                                                                                                          | Exit code 0, nine stages skipped. The failure is a string mismatch, not a content failure.                   |
| `docs/blog-automation/backlog-queue.json`            | `stableronaldo` still head of queue, `retryCount: 2`, added 07-25. Next in line: caitlin-clark, kate-middleton, duke-dennis.                                                                                                                               | Tonight is the last retry. A third failure burns the top queue entry.                                        |
| `docs/blog-automation/override.json`                 | `pause=false`, week started **2026-08-02**, `currentWeekCount=0/5`, `forceNext=null`.                                                                                                                                                                      | Rate limit is not the constraint. Five create slots available this week and the engine cannot use the first. |
| `logs/blog-automation/publish-people-2026-08-03.log` | 0 published. 490 checked, **89 unpublished, zero eligible.** Blockers: `missing_full_image=54`, `missing_thumbnail_image=54`, `source_standard_failed=50`, `missing_grade_stability_delta=41`, `stale_grade_rubric_v1=30`, `content_quality_below_8.5=29`. | Image debt is now the largest single blocker class and it is manual-only work.                               |
| Closest publishable candidates (08-01 and 08-03)     | **victoria-justice** and **keira-knightley**: `missing_grade_stability_delta` + `untagged_epigraph_or_cold_open`, **no image work**. **christopher-nolan**: images only.                                                                                   | Two same-day unblocks that need no Canva time; one that needs only Canva time.                               |
| People drafts (disk)                                 | 498 files (491 with `published:` frontmatter; 7 are research/report scratch files). **401 `true` / 90 `false`** (was 392/94).                                                                                                                              | +9 net published in 7 days. Real progress, entirely DJ-driven.                                               |
| `docs/data/corpus-stats.md` (regenerated 08-03)      | 401 published profiles, 136 drafts in pipeline. Type 3 = 17.5%, Type 4 = 14.5%, Type 7 = 14.7%.                                                                                                                                                            | Corpus stats are current; `backlog-queue.json` stats (391/132) lag by a day.                                 |

## Tooling state

- **Create pipeline filename bug (NEW, actionable tonight).** `scripts/run-blog-pipeline.sh:109`. Two clean fixes: (a) narrow — rename the queue entry to `Stable-Ronaldo` so the derived path matches; (b) structural — make stage 1 resolve the real filename it wrote instead of assuming `${PERSON}.md`. Per DJ's standing preference (solve the class, not the instance), (b) is the right one. Neither was applied; this is an unattended run.
- **Instagram cron hit a Claude weekly usage cap** on 07-28 and 07-29 (`You've hit your weekly limit · resets 5pm`). This is a new failure mode, distinct from the session-eviction class in memory `[[instagram-session-eviction]]`. Two lost sessions. Warmups resumed clean 07-30.
- **Instagram content-ops queue is live** (`docs/marketing/content-ops/queue.json`, validator `scripts/check-marketing-content-queue.mjs`). 22 items, states: `briefed=8, copy_ready=9, design_ready=2, qa=1, blocked=1`, plus 1 approved. Runway **RED** on approved/scheduled.
- **Browser rename still owed** for the third consecutive brief: extension browsers connect as "Browser 1" / "Browser 2". Every session verifies @9takesdotcom by reading the sidebar rather than by name-match. Fragile but working.
- **QUALITY GRADE leak (T-10/T-11) is still a treadmill.** T-10 is implemented locally (07-31, approved dry run, uncommitted), but `<!-- QUALITY GRADE:` markers remain on **212 people drafts**, and T-11 — the `grade_blog.md` instruction that writes them — is still open. The README's own argument applies: without T-11, T-10 regenerates.
- **Dirty worktree: 181 changed paths.** Includes T-10's local implementation, T-07's anxiety/communication cluster work (08-01), an e2e portrait preflight spec, two new scripts, and the `Stable-Ronaldo.md` draft itself. Per memory `[[parallel-work-safety]]`, nothing was touched, staged, or reset.

## Cross-surface status

### Blogs

- **People:** covered above. Create blocked on a path bug; publish blocked on image debt. 90 unpublished on disk.
- **Pop-culture: unchanged for the 4th consecutive brief.** 54 files, 18 unpublished. Oldest: `aoc-and-the-squad` (2025-12-15, ~7.6 months) and `onlyfans-creators` (2025-12-21). The eight `2026-03-04 *-enneagram-analysis` drafts are 5 months old. 16 of 18 are 2+ months.
- **Other categories:** enneagram 7 unpublished, guides 2, community 1, topical 1, life-situations 1.

### Distribution

- **14 unfired assets**, unchanged. Nothing added since `blackpill-social-package-2026-07-22`; most recent file touch is john-coogan on 07-14. The Instagram variants have been fireable since the session fix on 07-26 and remain unfired.

### Social

- **Instagram — sourcing is the healthiest it has ever been; output is zero.** Clean warmups 07-30, 07-31, 08-01, 08-02 on the dedicated profile (no 08-03 log yet; cron fires 08:00, this scan ran 06:09). Two sessions lost 07-28/07-29 to the Claude weekly cap. Standing debt: Melissa's owed reply ~46 days; @candicemichelleenneagram first touch queued on the 8th consecutive scan. The 08-02 log's own verdict: _"Execution debt is now 4 sessions with zero comments posted... the sourcing leg runs daily and the reply leg doesn't run at all, so trimming just slows the decay."_ It escalated a two-option fork to DJ (see Recommendation 2).
  - **Two real intel wins this week worth keeping:** (1) a method change — Nines do not post about themselves, they self-describe inside couples/attachment threads, so work the 9 pond by commenter-mining rather than keyword search; (2) the Type 2 pond is the largest addressable audience with **no published celebrity anchor**, which argues for moving Dolly Parton / Mister Rogers up the create queue.
- **Instagram content-ops: RED.** 0/10 approved or scheduled, 12/15 copy-ready or later, 20/20 triaged. Robert Greene (3-slide lore carousel, rendered, QA-passed at 1080x1350) targets **today** and needs only DJ's review to move to `approved`. Chappell Roan Reel targets 08-04. The buffer is empty at the moment the schedule starts.
- **Quora: 76 days dark** (last activity 2026-05-19). `docs/quora/sessions/` now holds only a README; `question-log.md` last entry 2026-05-19; no cron logs since 05-19. This is the 6th consecutive brief carrying "revive or retire."
- **Twitter/X:** no session artifacts since 2026-05-19. No signal this run.

### SEO

- **GSC refreshed 08-01** (`latest.json` runDate 2026-08-01, 90-day window 2026-05-01 → 2026-07-30). Caveat: T-09 specifies a clean `--days 69` window because the 2026-05-04 URL fix contaminates anything earlier. The current export starts **05-01**, so ~3 days of pre-fix data are included and T-09 is still formally unmet. T-04, T-05 and T-07 inherit that.
- `corpus-stats.md`, `sitemap.xml` and `BLOG-CROSSLINK-INDEX.md` all regenerated 2026-08-02 21:56 / 08-03 01:56. Sitemap carries 418 personality-analysis URLs against 401 published profiles — expected, since category and hub pages are included; no drift flagged.
- **Taskers:** T-07 in progress (anxiety + communication clusters implemented locally 08-01, deploy and search-index sync pending). T-10 implemented locally, uncommitted. T-09 still marked "Not started."

### Growth (FRESH — audit ran 2026-08-03)

- **Headline (verbatim):** _"the 07-20 spike did not compound — contributions 14 -> 4, and the matured cohort returned 0 of 9. Root cause candidate found: 82% of registered profiles have no Enneagram type."_
- **Biggest leak (verbatim):** _"the contribution loop turns once and dies — contributor return is structurally zero, and the likely root cause is that the reveal has nothing to personalize with. 9takes has now proven the gate converts (5-16%) and produced 19 first-time contributors in 6 weeks. Exactly one came back on a later day, and both multi-day returners in the entire window are registered profiles, never anonymous fingerprints. Underneath that: 82% of registrants never get typed, so the give-first payoff ("see how your type sees it") degrades to a generic nine-take dump. A give-first gate that collects a stranger's most vulnerable answer and returns an impersonal, unattributed reveal has no second turn to offer. Anonymous evaporation (last week's headline) is the symptom; no identity and no type is the mechanism."_
- Complete week 2026-07-27: 3,559 new visitors, 0 signups, 3 profiles (all 3 untyped), **4 comments**, native gate 37 fps → 2 = **5.4%**, contributor return **0%**, waitlist 0, email 117/34/1, Chorus cumulative 13, PA 2,371 fps at **25.6s dwell (best in window)**.
- **Six straight days of zero contributions (07-29 → 08-03)** on 23 gate fps. Gate volume did not collapse (3-8 fps/day held through 08-03) — it is a conversion drop, not an exposure drop. The audit looked for a code cause on the converting surfaces and **did not find one**; treat as unverified regression / probable small-n variance.
- **Register-page conversion is strong and starved:** `/register*` drew 4 fps and produced 3 profiles. The form is not the leak; traffic to it is (0.1% of visitors). `/enneagram-test` drew 6 fps all week (0.2% of traffic).
- **The standing "port the prompt to PA" bet is now BLOCKED.** `NineChorus.svelte` (PA-only) was retokenized on 07-29 in `84c055bd`; the hardcoded fallbacks in `var(--night-900, #0f0f10)` / `var(--ink-50, #fafafa)` were removed, and those legacy tokens are undefined in `src/scss/index.scss`. In light mode the panel is now near-white on near-white with a ghost CTA. Confirmed as still unfixed on disk this run (no uncommitted change to the file). Growth's bet #3 is to restore explicit contrast **before** porting.
- **Growth's ranked bets:** (1) post-contribution identity capture — **third consecutive audit as bet #1, still unshipped**; (2) **NEW** — type the user at the reveal, not at registration (3-question guess inside the reveal); (3) fix the NineChorus light-mode salience regression before the PA port.

### Email

- `reactivation_dormant`: **119 sends / 61 recipients / 24 opens (20%) / 0 clicks / 3 unsubs / 0 returns.** Last audit's stop condition (≥1 click or ≥1 return) was **not met**.
- `reactivation_zombies`: launched despite the explicit hold-until-dormant-clicks condition — the audit flags this as a **bet violation**. 29 sends, 1 click, 0 returns. Growth recommends pausing both and rewriting the CTA before further enrollment.
- `welcome_sequence`: best-performing — 44 sends / 29 recipients / 17 opens (39%) / 1 click / 0 unsubs, fires same-day on registration.
- Across 90 people touched by reactivation: **1 click, 0 returns.**

### Outreach

- Unchanged since 07-15. Newest artifact remains `2026-07-14_reply-likelihood-top-10.md`. No new send evidence. Abdaal and Bartlett drafts still safe to send per the 07-14 Gmail audit.

## What changed since the last brief (2026-07-27)

- **The publish drought broke, by hand.** Nine of the ten posts dated 07-27 → 07-30 were published outside the cron, with supervised regrades visible in the frontmatter (Mira-Murati 8.4 → 8.6, Jason-Sudeikis 8.1 → 8.5, both v2). Last brief's Recommendation #2 was executed. Disk published 392 → 401.
- **And it re-jammed within a day.** Four consecutive publish failures 07-31 → 08-03, with the top blocker class flipping from `stale_grade_rubric_v1` (34 → 30) to `missing_full_image` (49 → 54). Manual regrading is a treadmill against image debt.
- **Create developed a new, narrow, fully-diagnosed bug** — the `${PERSON}.md` path assumption. Two nights burned, last retry tonight.
- **Growth reversed.** 14 comments → 4, gate conversion 16.3% → 5.4%, and last week's headline return number corrected from 22% to **0%**. A new root-cause candidate replaced the old one: 82% of registrants are untyped.
- **A new blocker appeared on growth's standing #1-2 bet:** the NineChorus light-mode regression means the PA port would land on an invisible widget.
- **Instagram tooling gained a new failure mode** (Claude weekly cap, 2 sessions lost) and the execution gap widened from "5+ passes" to "4 consecutive sessions with zero comments" plus 8 days since the last replies doc.
- **Instagram content-ops went from a fresh workstream to a live RED queue** with today as its first target date and nothing approved.
- **GSC refreshed again (07-25 → 08-01)**, though not to T-09's clean-window spec.
- **Quora crossed 76 days dark.** Distribution, pop-culture and outreach are all unchanged.

## Recommendation (ranked by leverage)

1. **Fix the create-pipeline filename resolution before tonight's 02:00 run.** Why: it is the only item on this list with a hard deadline. `stableronaldo` is at `retryCount: 2`; tonight is retry 3/3, and a good, fact-checked draft is already sitting on disk being ignored. The fix is one line and it solves a class, not an instance. First step: in `scripts/run-blog-pipeline.sh:109`, replace the `DRAFT_PATH="src/blog/people/drafts/${PERSON}.md"` assumption with a resolve step that finds the file the create stage actually wrote (case- and hyphen-insensitive match on the drafts dir), then re-run the pipeline against `stableronaldo` in `--resume` mode so the nine skipped stages run. Fallback if you want zero script edits tonight: rename the queue entry's `name` from `stableronaldo` to `Stable-Ronaldo`. Speed: ~10 min. Impact: unblocks the create engine and recovers a finished draft. Risk: low, but it is automation code in a 181-file dirty worktree — check `git status` on that file first.
2. **Pick the Instagram fork the warmup agent escalated — do not let a fifth queue get written.** Why: the sourcing leg has run daily and produced zero external output for 8+ days while consuming a cron slot; the agent's own read is that trimming the queue treats the symptom. Two options it put up: (a) fold reply-drafting into the warmup cron so one job produces posted comments instead of a queue, or (b) accept sourcing-only and cut the job to 2-3x/week. The agent recommends (a); (b) is the honest fallback. Either beats the status quo. First step: state the choice, then run `/instagram-reply docs/instagram/daily-engagement/2026-08-02_instagram-warmup.md` once to clear the standing debt (Melissa's owed reply first, then Candice's first touch). Speed: decision ~2 min, one reply session ~20-30 min. Impact: converts a daily-burning process into either output or reclaimed time. Risk: minimal; drafts are pre-vetted against `[[instagram-comment-style]]`.
3. **Green-light growth's bet #1 (identity capture) together with the new bet #2 (type at the reveal) — and fix NineChorus before any PA port.** Why: identity capture is now the top bet for the third consecutive audit and the evidence hardened from "9 of 10 evaporate" to "0 of 9 returned, and both multi-day returners in the entire window are registered profiles." The new finding — 82% of registrants untyped — explains why the loop has nothing to offer on turn two, and the two bets share one surface: the reveal. Sequencing note: the PA port that ranked #1-2 in the last two briefs is **blocked** until the NineChorus light-mode contrast regression is restored, so do that first or the port lands invisible. First step: DJ green-lights eng scope for the reveal-moment email field plus a 3-question type guess, instrumented against ≥15% capture and ≥40% of new profiles typed in 30 days, with the ≤10% contribution-completion guardrail. Speed: small eng sprint. Impact: highest ceiling in the system.

## Open questions for DJ

1. **Create bug (deadline tonight):** Fix `run-blog-pipeline.sh:109` to resolve the real filename, or just rename the queue entry to `Stable-Ronaldo` for one night? Retry 3/3 fires at 02:00.
2. **Publish gate, structural:** `missing_full_image=54` is now the largest blocker class and images are manual Canva work only (`[[type-image-pipeline]]` — do not rebuild the automated pipeline). Do you want a standing weekly Canva batch, or should the gate stop counting image-blocked drafts as candidates so the log surfaces real near-misses? The two no-image unblocks available right now are **victoria-justice** and **keira-knightley** (regrade delta + epigraph tag each); **christopher-nolan** needs images only.
3. **Instagram fork (the agent asked directly):** fold reply-drafting into the warmup cron, or cut the warmup to 2-3x/week and accept sourcing-only?
4. **Instagram content-ops:** Robert Greene is in `qa` with today's target date and your review is the only gate to `approved`. Approve, or does the schedule slip?
5. **Growth bets:** green-light identity capture + type-at-the-reveal? And confirm the NineChorus contrast fix goes **before** the PA port.
6. **Reactivation:** `reactivation_zombies` launched against the explicit hold condition, and 90 touched people produced 1 click and 0 returns. Pause both dormant and zombies and rewrite the CTA, per growth's recommendation?
7. **T-11 (the leak treadmill):** 212 people drafts still carry `<!-- QUALITY GRADE:` markers and `grade_blog.md` still instructs the behavior. Schedule T-11 before the next T-10-style cleanup?
8. **GSC window:** the 08-01 export runs 05-01 → 07-30 and straddles the 05-04 URL fix by 3 days. Re-pull at `--days 69` to satisfy T-09 before T-04/T-05/T-07, or accept the contamination?
9. **Type 2 anchor gap (from the IG warmup):** the Type 2 pond is the largest addressable audience with no published celebrity anchor. Move Dolly Parton / Mister Rogers up the create queue ahead of caitlin-clark / kate-middleton?
10. **Standing calls, 6th brief:** Quora at 76 days — revive or formally retire? And 14 distribution assets still unfired with the IG variants fireable since 07-26.

## Assumptions

- File counts are frontmatter scans on disk at 06:09 EDT today. Seven files in `src/blog/people/drafts/` carry no `published:` key (research notes and a fact-check report) and are excluded from the 401/90 split.
- Growth numbers are taken verbatim from the 2026-08-03 growth-log entry, not re-derived; no live product behavior or database was queried by this run.
- "Nine of ten posts published manually" is inferred from the gap between the publish-people logs (which record only jack-antonoff on 07-30 and failures on 07-28/07-29) and the ten drafts carrying 07-27 → 07-30 publish dates with post-cron mtimes. The regrade evidence (Mira-Murati 8.4 → 8.6, Jason-Sudeikis 8.1 → 8.5 between the 07-28 log and disk) supports it, but the exact command DJ ran was not observed.
- "Zero comments posted on Instagram" is taken from the 08-02 warmup log's own verdict plus the absence of any `*-instagram-replies*.md` doc newer than 2026-07-26. External Instagram state was not queried.
- The `run-blog-pipeline.sh:109` root cause was independently verified against the file this run; the fix was **not** applied and the surrounding pipeline logic was not reviewed for other path assumptions.
- "Distribution unfired" means no fired-packet evidence in default repo surfaces; external channels were not checked.
- The 08:00 Instagram warmup for 2026-08-03 had not yet run at scan time and is not reflected here.
