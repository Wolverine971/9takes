<!-- docs/daily-briefs/2026-08-05_marketing-status.md -->

# 9takes Marketing Status — 2026-08-05

**DJ-invoked run (marketing-pm).** Prior status brief: `2026-08-03_marketing-status.md`. Growth data is 2 days old (weekly audit ran Monday 2026-08-03) — used as-is, not re-derived. No drafts, flags, product code, or external services touched.

## TL;DR

- **The biggest signal in the system is the Reels E1 result, and nothing is acting on it.** The 08-03 dashboard pull confirmed E1 "stronger than hypothesized": a 2-second off-topic Reel reached **375 accounts (549 views)** vs 8–21 for every designed carousel — **26–45x reach, 98.4% of all account views from Reels, 94.3% non-followers**. Decision already logged: promote Reels to the spine. Yet a native 9takes Reel has **never been posted**, the content-ops queue is still 16 carousels / 6 Reels, the Chappell Roan Reel missed its 08-04 target (still `copy_ready`), and One Take ep 1 (MrBeast, script ready since 07-25) hasn't moved in 11 days.
- **A time-boxed opening is live:** Nolan's Odyssey is manufacturing "one story, nine ways to see it" content — both big niche accounts (@typeishofficial 48.5K, @vvanedwards 1.2M) posted Odyssey personality content within 24 hours. A nine-character Odyssey cast read is the most native content idea available and goes stale within ~a month.
- **Instagram comment leg: theory falsified, decision forced.** Warmup v6 delivered 3 final-copy comments on 08-04 and 3 more today; none posted. Seven sessions, seven queues, **zero comments posted**. The agent's own verdict: drafting cost was never the bottleneck — the only untested lever is automating the post action, or retiring the leg. Counter-evidence it cites: the one comment that WAS posted (Jul 02) drew 86 likes.
- **Create pipeline recovered; quality bar is now the choke.** The stableronaldo filename bug is resolved — three drafts completed since the last brief (StableRonaldo 8.4 B, Nara-Smith 8.1, Caitlin-Clark 7.9 C) and **all three landed below the 8.5 gate**. Publish is at **6 straight days of zero** (nothing since jack-antonoff 07-30), and this morning's publisher run died silently after one log line.
- **Robert Greene carousel published 08-02 → 8 views, 1 like.** Consistent with E1: it's not the creative, it's the surface.
- **Unchanged / rotting:** Quora 78 days dark; 14 distribution assets unfired; pop-culture 18 unpublished (5th brief); reactivation email pause decision still pending (stop condition met 08-03); growth bets #1/#2 (identity capture + type-at-reveal) still un-green-lit, third consecutive audit; GSC still not at T-09's clean window.

## The actual work — everything converges on one gap: distribution via Reels

Every surface is telling the same story from a different angle:

| Evidence                                                                    | Source                                               | Read                                                                                                                                      |
| --------------------------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Reel = 375 reached; carousels = 8–21 views                                  | `docs/instagram/reels/experiment-log.md` 08-03 entry | E1 CONFIRMED. Reach is a surface problem, not a quality problem.                                                                          |
| Robert Greene carousel (rendered, QA'd, color-harmonized): 8 views / 1 like | content-ops queue + marketing log 08-03              | High production effort into the wrong surface.                                                                                            |
| Reel had 0 saves / 0 comments / 0 follows off 375 reached                   | experiment-log 08-03                                 | Reach without payload doesn't convert. The intended test — a **native 9takes Reel** (hook → nine beats → question close) — has never run. |
| Odyssey personality content posted by 2 niche accounts in 24h               | `2026-08-05_instagram-warmup.md`                     | Time-boxed catalyst perfectly shaped for the 9takes premise.                                                                              |
| One Take ep 1 script ready since 07-25; page + nine takes live; dir empty   | `docs/marketing/one-take-format.md`                  | The on-camera Reel format already exists and is stalled at "film it."                                                                     |
| Content-ops queue: 0/10 approved, Reel items still `copy_ready` past target | `check-marketing-content-queue.mjs` (RED)            | The production system is pointed at carousels the data says don't travel.                                                                 |

The blog engine (create + publish + SEO) is a supply chain into a site with proven traffic (3,559 new visitors/wk) and a proven-broken retention loop (growth: return = 0%, 82% untyped). More supply doesn't move the needle this week. Reels + the reveal-moment fixes are where the leverage is.

## Tooling state

- **Publish-people crashed silently this morning:** `logs/blog-automation/publish-people-2026-08-05.log` is 53 bytes — one "starting" line at 06:11:46, no result, no error, no running process. New failure signature (prior failures at least logged blocker counts). Needs a look.
- **Create filename bug from the 08-03 brief is RESOLVED** — StableRonaldo ran the full pipeline 08-04 (revision loop fired: 7.6 → 8.0 → 8.4) and caitlin-clark ran clean overnight 08-05. Pipeline lock cleared. `override.json`: 1/5 weekly slots used, week started 08-02 — capacity is not the constraint.
- **Warmup v6 shipped and works as designed** (first sessions 08-04, 08-05): reply drafting folded in, 3 final-copy suggestions per session, no separate `/instagram-reply` pass needed. The tooling side of the IG fork DJ chose on 08-03 is done; only the posting action remains manual.
- **Nara-Smith daytime run (08-04 15:30) is uncommitted work in the tree** — completed, `perspective_final_status: fail_after_revision`, final 8.1. Caitlin-Clark artifacts also uncommitted. Per parallel-work safety, untouched.
- **Observed, unowned:** `Peter_Thiel_Secrets_Fear_and_Power.pptx` (+ inspect ndjson) untracked at repo root — new DJ work product, not in any pipeline. Noting so it doesn't get lost.

## Cross-surface status

### Blogs — people

- Disk: **401 published / 95 unpublished** (was 401/90 — three new drafts plus reclassified files).
- **Create:** recovered and producing, but all three completions since 08-03 graded below 8.5: StableRonaldo **8.4 B** (also image-blocked), Nara-Smith **8.1** (perspective fail_after_revision — human review), Caitlin-Clark **7.9 C** (regrade dropped it from 8.4; review at `docs/content-analysis/grades/Caitlin-Clark.review.md`). Matches the known structural ceiling (8.2–8.5). Queue next: kate-middleton, duke-dennis, lebron-james. The Type 2 anchor gap (Dolly Parton / Mister Rogers, flagged 08-03) is still not in the top of the queue.
- **Publish: 0 for 6 straight days.** 08-04 blockers: `missing_full_image=56` / `missing_thumbnail=56` (still #1, still Canva-manual-only), `source_standard_failed=50`, `missing_grade_stability_delta=41`. Standing no-Canva unblocks unchanged: **victoria-justice** and **keira-knightley** (supervised regrade + epigraph tag each); **christopher-nolan** needs images only. These three have now been the named unblocks across three briefs.

### Blogs — pop-culture and other

- Pop-culture: **18 unpublished, 5th consecutive brief unchanged.** Oldest ~7.7 months.

### Instagram

- **Cadence: healthiest ever** — clean daily warmups 07-30 → 08-05, dedicated profile stable, saves engine producing (2 new saves today incl. both Odyssey posts).
- **Output: still zero.** v6's 3+3 final-copy comments unposted. Agent verdict (08-05, verbatim): _"Seven sessions, seven queues, zero comments... The only untested lever is automating the post action itself."_ It asks DJ to either (a) authorize the cron to post the top-ranked suggestion directly, or (b) retire the comment leg and reallocate to the saves/content engine.
- **Owed replies:** agent now recommends **retiring** the 48-day (Melissa) and 43-day owed volleys and re-approaching on next caption-carried posts — closes a debt that's been carried since June.
- **Content-ops:** RED — 0/10 approved/scheduled; `briefed=8, copy_ready=9, design_ready=2, published=1, blocked=1`. Robert Greene `published` (weak: 8 views/1 like at 24h; 7-day pull still owed). Chappell Roan Reel missed 08-04, Pedro Pascal carousel targets 08-06. The queue's 16-carousel/6-Reel mix now contradicts the E1 decision on record.
- Followers: 30 (+1 since 07-24 baseline).

### One Take / video

- Frozen at "ready to film" since 07-25: spec + MrBeast ep 1 script done, question page + nine takes live, `docs/marketing/one-take/` empty. E1 makes this the highest-leverage stalled asset in the whole portfolio — it IS the native Reel format.

### Distribution / Quora / Twitter

- 14 unfired distribution assets (unchanged since 07-22). Quora **78 days dark** — 7th consecutive brief carrying revive-or-retire. Twitter: no session artifacts since 05-19.

### SEO

- GSC `latest.json` runDate 2026-08-01 (window 05-01 → 07-30; still straddles the 05-04 URL fix — T-09 unmet). corpus-stats regenerated 08-04. T-07 cluster work implemented locally, deploy pending; T-10 local/uncommitted; T-11 (grade-marker leak source) still open.

### Growth (audit 2026-08-03, folded not re-derived)

- Headline: 07-20 spike didn't compound (14 → 4 contributions, matured cohort returned 0/9); **82% of registrants untyped** is the root-cause candidate. Bets: (1) post-contribution identity capture — **third consecutive audit at #1, unshipped**; (2) type-at-the-reveal; (3) fix NineChorus light-mode contrast **before** any PA port. All three await DJ green-light.

### Email

- `reactivation_dormant` LOSING (119 sends / 0 clicks — stop condition met); `reactivation_zombies` launched against the hold (bet violation), 29 sends / 1 click. Growth recommends **pausing both**; decision pending since Monday. `welcome_sequence` remains best (39% open).

### Outreach

- **NEW since last brief:** `docs/outreach/2026-08-04_nine-mirrors-podcast-pilot.md` — Nine Mirrors audience-signal-map pilot for Huberman / Ferriss / Theo Von. Drafting only, nothing sent, quality-bar tests defined. First new outreach artifact since 07-15. Long-Form cluster still 2/12 sent (Williamson 05-15, Schulz 06-30 — per Gmail audit, do not resend).

## What changed since the last brief (2026-08-03)

- Create-pipeline filename bug fixed; StableRonaldo + Caitlin-Clark completed; Nara-Smith manual run completed. All three below the publish bar.
- Publish drought extended 4 → 6 days; image blocker grew 54 → 56; today's publisher run failed silently (new signature).
- Warmup v6 went live and **falsified the drafting-cost theory** — the IG bottleneck is now proven to be the posting action itself.
- Reels E1 answered (08-03 insight pull): 26–45x reach, decision "promote Reels to spine" logged — not yet reflected in the queue or schedule.
- Robert Greene shipped and validated the carousel-reach ceiling (8 views).
- Odyssey window opened (time-boxed).
- New outreach concept (Nine Mirrors podcast pilot) drafted.
- Agent recommends retiring the two long-owed IG replies.
- Unchanged: Quora, distribution, pop-culture, growth-bet green-lights, reactivation pause.

## What needs to be done

### (a) DJ personally — short list, ranked by growth impact

1. **Ship the first native 9takes Reel this week — make it the Odyssey nine-character read.** This is where E1 (26–45x reach), the time-boxed Nolan catalyst, and the empty native-Reel slot all intersect. ~40 min film/assemble once the script lands (delegation below). Impact: first real shot at non-follower reach; every other channel is capped without it. Risk: visible, low — worst case is a low-play Reel like everyone's first.
2. **Answer the IG comment-leg question (2 min) — and post today's 3 comments (~5 min) either way.** Options on the table from the agent: (a) authorize auto-posting of the top-ranked suggestion per session, or (b) retire the leg. Seven sessions of known-zero return says don't leave it unanswered an eighth time. The Jul 02 comment's 86 likes says the activity works when it ships.
3. **Green-light growth bets #1 + #2 (identity capture + type-at-the-reveal) and the NineChorus contrast fix.** Third consecutive audit with #1 unshipped; the mechanism (82% untyped → nothing to personalize → 0% return) is now well-evidenced. Small eng sprint; highest ceiling in the system.
4. **Pause both reactivation sequences** (dormant + zombies) per growth's recommendation — stop condition met, 90 people touched → 1 click, 0 returns. ~5 min in admin.
5. **Unjam publish with one 20-min pass:** run supervised `/grade_blog` regrades on victoria-justice + keira-knightley (no Canva needed), and batch Canva images for christopher-nolan when convenient. Third brief these exact names have been the unblock.

### (b) Delegable to agents/automation now

1. **Odyssey Reel script + Reels-first queue inversion** → `instagram-content-ops` via `/marketing-content-sprint` (with `short-form-video-producer` for the script). Deliverable: shot-ready Odyssey nine-beat script + Chappell Roan Reel finished + queue re-sequenced Reels-first per the E1 decision already on record.
2. **Diagnose the silent publish-people crash** (53-byte 08-05 log) → grunt/Explore task against `scripts/personBlogParser.js` and the cron wrapper. Cheap, prevents a new invisible-failure class.
3. **Editor pass on the three below-bar drafts** → `editor` (Caitlin-Clark 7.9 has a written review to work from; Nara-Smith failed perspective after revision; StableRonaldo at 8.4 needs the least). Converts this week's create output into publishable supply.
4. **Robert Greene 7-day metrics pull + E2 send-CTA check** on next warmup → already in `instagram-content-ops` lane; closes the experiment row.
5. **Nine Mirrors pilot QA** → `tyler-archer` (outreach review lane) against the doc's own quality-bar tests before anything is considered for sending. No sends without DJ.

Not proposed this cycle (parked deliberately): Quora revive/retire and the 14 distribution assets — both still open standing calls, but neither beats the items above on expected impact, and firing distribution into carousel-era IG contradicts the E1 read.

## Open questions for DJ

1. Odyssey Reel: green-light production today? (Script delegation fires on your yes.)
2. IG comment leg: auto-post the top suggestion, or retire the leg? And OK to retire the two owed replies per the agent's 08-04/08-05 recommendation?
3. Growth bets #1/#2 + NineChorus fix: green-light eng scope?
4. Reactivation: pause dormant + zombies now?
5. Publish gate: fire the victoria-justice / keira-knightley regrades this week? And do you want a standing weekly Canva batch, or should the publisher stop counting image-blocked drafts as candidates?
6. Type 2 anchor (Dolly Parton / Mister Rogers): bump above kate-middleton in the create queue?
7. Standing calls, 7th brief: Quora revive or formally retire; distribution assets hold-or-fire.

## Assumptions

- Counts are disk scans at run time today; growth/email numbers are verbatim from the 2026-08-03 growth-log entry (no DB queried this run).
- "Zero comments posted" is per the warmup docs' own status fields; external Instagram state not queried.
- The publish-people 08-05 run is read as a silent crash from the 53-byte log + no live process; root cause not investigated this run.
- Robert Greene's 8 views / 1 like is the ~24h snapshot from the 08-03 log; no fresher pull exists on disk.
