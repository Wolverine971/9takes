<!-- docs/marketing/marketing-log.md -->

# 9takes Marketing Log

**Append-only.** Newest entries on top of each section. Never overwrite past entries — that's what dated snapshots are for.

Maintained by the `marketing-pm` agent + DJ. Cross-link to `docs/growth/growth-log.md` for experiment-level detail rather than duplicating.

---

## Active workstreams

### 2026-08-05 — Status brief: Reels E1 confirmed (26–45x) with nothing acting on it; IG drafting theory falsified; create recovered but all 3 new drafts below bar

- Brief: [`docs/daily-briefs/2026-08-05_marketing-status.md`](../daily-briefs/2026-08-05_marketing-status.md).
- **Reels E1 CONFIRMED, stronger than hypothesized** (08-03 insights pull in `docs/instagram/reels/experiment-log.md`): one 2-second Reel reached 375 accounts vs 8–21 views for every carousel — 26–45x; 98.4% of account views from Reels; 94.3% non-followers. Logged decision: promote Reels to the spine. **Not yet acted on:** queue still 16 carousels / 6 Reels, native 9takes Reel never posted, Chappell Roan Reel missed its 08-04 target (`copy_ready`), One Take ep 1 frozen since 07-25. Robert Greene carousel confirmed the ceiling: 8 views / 1 like at 24h.
- **Time-boxed opening:** Nolan's Odyssey — both major niche accounts posted Odyssey personality content within 24h; a nine-character Odyssey cast read is the most native available idea, stale in ~a month. Recommendation #1: ship it as the first native 9takes Reel.
- **IG comment leg: v6 falsified the drafting theory.** 3 final-copy comments delivered 08-04 + 3 more 08-05, none posted; 7 sessions, 0 comments total. Agent's fork to DJ: authorize auto-posting the top suggestion, or retire the leg. It also recommends retiring the 48/43-day owed replies. Counter-evidence on record: the one posted comment (Jul 02) drew 86 likes.
- **Create pipeline recovered** (stableronaldo filename bug resolved): StableRonaldo 8.4 B (image-blocked), Nara-Smith 8.1 (perspective fail_after_revision, manual 08-04 run), Caitlin-Clark 7.9 C (regrade dropped from 8.4) — **all below the 8.5 gate.** Publish at 6 straight zero days (nothing since jack-antonoff 07-30); the 08-05 publisher run died silently (53-byte log, new failure signature). Standing no-Canva unblocks for the 3rd brief: victoria-justice, keira-knightley (supervised regrades); christopher-nolan images-only. `missing_full_image` 54 → 56.
- **NEW outreach artifact:** `docs/outreach/2026-08-04_nine-mirrors-podcast-pilot.md` — Nine Mirrors audience-signal-map pilot (Huberman / Ferriss / Theo Von), drafting only, nothing sent.
- **Unchanged:** Quora 78 days dark (7th brief); 14 distribution assets unfired; pop-culture 18 unpublished (5th brief); growth bets #1/#2 + NineChorus fix un-green-lit (3rd audit); reactivation pause pending (stop condition met 08-03); GSC still short of T-09 clean window; content-ops 0/10 approved.
- **Owner:** DJ. Top asks: green-light Odyssey Reel, answer the IG auto-post-or-retire question, green-light growth bets, pause reactivation, fire the two regrades.

### 2026-08-03 — DJ closed the Instagram fork; Robert Greene published with weak early traction

- **Decision:** fold reply drafting into `/instagram-warmup`, but keep posting manual/asynchronous. The new contract returns 0–3 grounded suggestions and is allowed to return zero; generic comments that could fit another post are rejected.
- **Why:** DJ uses the suggestions opportunistically, but the prior split workflow produced too much generic, inauthentic copy and too little value.
- **Robert Greene:** published on Instagram 08-02. The existing dashboard snapshot confirms the weak start: **8 views / 1 like** at ~24 hours. Queue moved `qa` → `published`; the live URL and 7-day metrics are still needed. The current experiment read points to carousel distribution, not necessarily the Greene creative itself.
- **Create pipeline:** canonical filename resolution approved across both the pipeline and nightly wrapper; `stableronaldo` should resume the existing `Stable-Ronaldo.md` after create rather than spend retry 3/3 or overwrite the draft.

### 2026-08-03 — Unattended status brief: DJ broke the publish drought by hand, then it re-jammed on image debt; create hit a filename bug; growth reversed

- Brief: [`docs/daily-briefs/2026-08-03_marketing-status.md`](../daily-briefs/2026-08-03_marketing-status.md).
- **Growth freshness gate PASSED:** weekly audit ran today (growth-log newest entry `2026-08-03`); headline + biggest leak folded verbatim.
- **Growth headline (verbatim):** _"the 07-20 spike did not compound — contributions 14 -> 4, and the matured cohort returned 0 of 9. Root cause candidate found: 82% of registered profiles have no Enneagram type."_ Native gate conversion 16.3% → **5.4%**; six straight days of zero contributions (07-29 → 08-03) on 23 gate fps, with gate volume holding (conversion drop, not exposure drop); last week's 22% contributor return was an artifact and corrects to **0%** under a strict `>24h` window. New leak: **the loop turns once and dies** because the reveal has nothing to personalize with. Register-page conversion is strong and starved (4 fps → 3 profiles; 0.1% of visitors reach it). PA dwell best in window (25.6s) and converts ~0.
- **Publish drought BROKE — by hand, not by cron.** Ten drafts carry publish dates 07-27 → 07-30 (disk `published: true` **392 → 401**), but the auto-publisher shipped only jack-antonoff (07-30). The other nine were manual, with supervised regrades visible in frontmatter (Mira-Murati 8.4 → 8.6, Jason-Sudeikis 8.1 → 8.5, both v2). This executed the 07-27 brief's Recommendation #2.
- **Then it re-jammed: 4 straight publish failures 07-31 → 08-03.** Top blocker class **flipped from stale grades to missing images** — `missing_full_image=54` / `missing_thumbnail=54` now beats `stale_grade_rubric_v1` (34 → 30). Images are manual Canva only per `[[type-image-pipeline]]`, so the dominant blocker has no automation path. No-image unblocks available: **victoria-justice** and **keira-knightley** (regrade delta + epigraph tag each); **christopher-nolan** needs images only.
- **NEW create bug, deadline-bound:** `scripts/run-blog-pipeline.sh:109` builds `DRAFT_PATH="src/blog/people/drafts/${PERSON}.md"` from the queue name. Cron passed `stableronaldo`; create wrote `Stable-Ronaldo.md`. Nine downstream stages skipped **twice** (08-02, 08-03) on a good draft sitting on disk. `retryCount: 2` — tonight is retry 3/3. Narrow class: only breaks on single-token handles that are really two words (APFS case-insensitivity covers `caitlin-clark`). The 08-03 wasted run doubled as a verify pass and caught three factual errors the 08-02 run self-certified clean.
- **Instagram: sourcing healthiest ever, output still ZERO.** Clean warmups 07-30 → 08-02 on the dedicated profile; **new failure mode 07-28/07-29 — Claude weekly usage cap** (`You've hit your weekly limit`), not session eviction. Zero comments posted for 4+ consecutive sessions; newest replies doc is 07-26 (8 days). Melissa owed ~46 days; Candice first touch queued on the 8th consecutive scan. **The warmup agent escalated a two-option fork to DJ:** fold reply-drafting into the warmup cron, or cut the job to 2-3x/week and accept sourcing-only. It recommends the former.
- **Content-ops queue live and RED:** 22 items, **0/10 approved or scheduled**; Robert Greene in `qa` targeting 08-03 (today) awaiting only DJ's review; Chappell Roan Reel targets 08-04.
- **Growth's standing PA port is now BLOCKED:** `NineChorus.svelte` retokenized 07-29 (`84c055bd`) removed hardcoded fallbacks for `--night-900` / `--ink-50`, which are undefined in `src/scss/index.scss`; light-mode PA visitors get a near-white panel with a ghost CTA. Verified still unfixed on disk. Fix contrast before porting.
- **SEO:** GSC refreshed 08-01 (runDate 2026-08-01) but window starts 05-01, straddling the 05-04 URL fix by 3 days — T-09's clean `--days 69` spec still unmet. corpus-stats + sitemap + crosslinks regenerated 08-02/08-03.
- **Unchanged:** Quora **76 days dark**; 14 distribution assets unfired; pop-culture 18 unpublished (4th brief running); signups 0 (5th week); waitlist 0 (10 weeks); outreach unchanged since 07-15.
- **Owner:** DJ. Open decisions in brief §"Open questions for DJ": create-bug fix tonight, publish image-debt policy, IG fork, Robert Greene approval, growth bets + NineChorus sequencing, pause reactivation, T-11 treadmill, GSC clean window, Type 2 anchor gap, Quora + distribution standing calls.

### 2026-08-02 — Instagram content-ops agent and single production queue launched

- Created focused `instagram-content-ops` agent plus `/marketing-content-sprint`; the existing `marketing-pm` remains the cross-channel status owner.
- Canonical queue: [`docs/marketing/content-ops/queue.json`](./content-ops/queue.json). Validation: `node scripts/check-marketing-content-queue.mjs`.
- Baseline is honest and RED: **0/10 approved or scheduled**, **12/15 copy-ready or later**, **20/20 triaged or later**, design WIP **3/3**. The bottleneck is rendering/QA/approval, not ideas.
- Seeded five campaigns and the first three weeks of target dates. Operating default: 5 feed posts/week split 3 carousels + 2 Reels, with story support and a 14-day approved buffer.
- First item advanced: Robert Greene two-slide lore carousel moved from `copy_ready` to `design_ready`; locked production brief at [`docs/marketing/content-ops/briefs/robert-greene-lore-carousel.md`](./content-ops/briefs/robert-greene-lore-carousel.md).
- Next: render and QA Robert Greene before opening more design WIP; then Chappell Roan Reel and Pedro Pascal lore carousel.
- Owner: `instagram-content-ops`; DJ retains approval and publishing boundary.
- **Same-run production update:** Robert Greene is now rendered and passed internal visual/dimension QA at 1080x1350. Queue moved to `qa` with exact assets recorded; current WIP is design **2/3**, QA **1/2**. DJ's review is the only gate before `approved`.
- **Format refinement:** Personality Lore Stack is now a three-slide contract: cover → lore → **“A Window Inside.”** The third slide is an evidence trail—not an analysis grid: four to six dated moments, exact short quotes, concrete choices, documented evolution, and one final open question. Reusable contract: [`docs/marketing/content-ops/templates/window-inside-slide.md`](./content-ops/templates/window-inside-slide.md). Robert Greene is the first test case, rebuilt around five records from 1960s Baldwin Hills through the 2018 stroke and his post-stroke work on the sublime.
- **Color-harmony pass:** The complete Robert Greene carousel now follows the approved contained-violet portrait plan. The source violet stays inside a `#2C1F28` media well under the calibrated filter; the competing amber eye bar is gone. Amber is limited to illuminated kickers and closing question fields, canonical Type 5 sky carries dossier data, and passive chrome/dividers are neutral stone and ink. All three exports passed full-size and 25%-scale visual review without modifying `static/types/`.
- **Layout cleanup after review:** Removed the visible portrait card and centered Greene in a borderless full-width well; expanded the six lore rows to the safe-area edges; replaced the evidence diamonds with circular markers centered on the timeline; aligned headers back to the brand chrome while preserving the wider data rows.

### 2026-07-27 — Unattended status brief: best contribution week ever; publish jammed 7 days; IG session FIXED but posting at zero

- Brief: [`docs/daily-briefs/2026-07-27_marketing-status.md`](../daily-briefs/2026-07-27_marketing-status.md).
- **Growth freshness gate PASSED:** weekly audit ran today (growth-log newest entry `2026-07-27`); headline + biggest leak folded verbatim.
- **Growth headline (verbatim):** _"best contribution week ever (14 comments, 10 humans), the gate escaped the questions ghetto and converts 15-19% — but 9 of 10 contributors evaporate as unreachable fingerprints."_ Homepage placement of q567 converts **18.8% native**; first PA Chorus take since June (robert-pattinson); `nine_user_takes` 3 → 11; reactivation_dormant LAUNCHED (50 enrollments, 12 opens, 0 clicks). New #1 leak: **anonymous contribution evaporation** — 0 emails captured at the contribute/reveal moment. Growth's #1 bet: post-contribution identity capture (one email field). Still dead upstream: 0 signups 4th week, waitlist 0 for 9 weeks.
- **Pipeline swapped states again — create recovered, publish jammed 7 straight days.** Create shipped 6 (Travis Kelce 8.6 on retry, Nolan 8.9, Yang Zhilin 8.7, Sadie Sink 8.3, CaseOh 8.6, PlaqueBoyMax 8.4 needsReview) and hit its 5/wk cap; publish shipped **0 since julia-fox 07-20**. Structural blocker: 92 of 94 unpublished drafts on stale v1-rubric grades (52 of them ≥8.5). Fastest unblock named by today's log: **victoria-justice** (v2 9.0, needs only supervised regrade delta + epigraph tag, no images).
- **Instagram REVERSED:** dedicated per-brand Chrome profile live; first clean session 07-26 PM (matches memory `[[instagram-session-eviction]]`). Bottleneck moved to posting: reply queues drafted (07-25 + 07-26 PM docs) but nothing posted in 5+ passes — Melissa owed ~38+ days, Candice first-touch queued 5x. Standing order: `/instagram-reply` on the 07-25 doc FIRST.
- **SEO refreshed:** GSC `latest.json` now runDate 2026-07-25 (closes last brief's staleness flag); corpus-stats + crosslinks regenerated 07-26.
- **Distribution grew to 14 unfired** (new: `blackpill-social-package-2026-07-22/`); Quora ~69 days dark; outreach unchanged.
- **New parallel workstream observed (untouched):** blog evidence enrichment — `docs/blog-enrichment/` Elon Musk pilot (`enriched-local`), `EvidenceFigure.svelte`, blogEvidenceMedia lib; uncommitted product/design work in flight.
- **Owner:** DJ. Open decisions in brief §"Open questions for DJ": identity capture green-light, PA above-fold port, victoria-justice regrade + v1 batch-regrade call, PlaqueBoyMax review, IG reply execution + browser rename, reactivation segment hold, fire distribution, Quora revive/retire.

### 2026-07-20 — Unattended status brief: growth loop PROVEN to work; publish valve reopened; create timed out; IG escalated dark

- Brief: [`docs/daily-briefs/2026-07-20_marketing-status.md`](../daily-briefs/2026-07-20_marketing-status.md).
- **Growth freshness gate PASSED:** the weekly audit ran today (growth-log newest entry `2026-07-20`), so the brief folds its headline + biggest leak verbatim.
- **Growth flipped positive for the first time.** Comments **0 → 9** (highest contribution week in the window), the native `contribution` event fired end-to-end on masking question 567 (T-12 wave 1), and Chorus `nine_user_takes` moved **1 → 3** — the "likely silent Chorus bug" caveat from every prior audit is **resolved: the mechanic works.** One full loop turn (n=1, real): profile `07d2e6c9` registered 07-16 → welcome_sequence → 5 comments in ~90 min → returned 07-18 for 3 more. Wall conversion 12% inferred / 8.3% native. **Honesty flag:** the 9 comments are ~one new human — not a trend yet.
- **Biggest leak (verbatim):** _"the give-first loop is now PROVEN to work, but it is quarantined to ~0.6% of traffic… the working path isn't where the traffic is."_ PA takes the 4,260-visitor firehose with no capture → **0 signups / 0 identity for the 3rd straight week** (waitlist 0 for 8 weeks). Growth's #1 bet: port the proven give-first/Chorus reveal above the fold on personality-analysis (product/eng scope).
- **Publish valve REOPENED** (last brief's 3-day jam cleared). 10+ people posts shipped 07-18→07-20: Benny Blanco, Joe Lonsdale, Kacey Musgraves, **Kaia Gerber**, Lamine Yamal, Madonna, **Milly Alcock** (07-13 scout pick), **Oliver Tree**, Pete Hegseth, PinkPantheress; **julia-fox published today** (Type 4, grade 8.5, row 1088). Kaia Gerber (grade-delta) and Oliver Tree (image) were both blocked last brief and cleared without marketing-pm intervention. People disk 382 → 391 published.
- **CREATE regressed.** Tonight's cron target `travis-kelce` produced **no draft** — Stage 1 create timed out (research agent exceeded the 600s background ceiling; ran 957s). `halt_reason: draft_missing_after_stage_1_create`; retry 1/3 queued. Different signature from the earlier `oliver-tree` API refusals (timeout, not refusal); same net result.
- **Instagram fully dark and ESCALATED:** every warmup 07-14→07-19 `BLOCKED`; **17 of last 20 runs** blocked. 07-19 regression — @9takesdotcom dropped out of the account picker entirely; one-tap re-login gone, DJ must retype full handle + password via "Log into an Existing Account." Matches memory `[[instagram-session-eviction]]`.
- **SEO refreshed today:** corpus-stats.md + crosslink index regenerated 2026-07-20. GSC `latest.json` unchanged (still runDate 07-06, ~16 days stale).
- **Unchanged:** 13 distribution assets unfired (9 packets + 2 carousels + 2 IG variants); Quora ~62 days dark; email starved (4 sends/3 opens/1 click, welcome_sequence live).
- **Owner:** DJ. Open decisions in brief §"Open questions for DJ": PA give-first port, scale q567, create-timeout fix (`forceNext`/raise ceiling), IG re-login + dedicated profile, fire distribution, Quora revive/retire, GSC refresh.

### 2026-07-14 — Gmail audit corrected Long-Form outreach send history

- Gmail Sent confirms **Chris Williamson was emailed 2026-05-15** via `jonathan@chriswillx.com`; no reply found.
- Gmail Sent confirms **Andrew Schulz outreach was emailed to Jamiel Hibbert on 2026-06-30**; no reply found. Do not resend the first-touch email.
- No matching Gmail Sent messages were found for **Ali Abdaal** or **Steven Bartlett** across the known recipient addresses, subject hooks, names, and profile URLs. Their polished drafts remain safe to send. This does not rule out an unlogged website contact-form submission.
- Earlier `0/12 sent` / `no send evidence` entries below were based on repo evidence only and are superseded by this direct Gmail audit.

### 2026-07-13 — Unattended status brief: growth FRESH (biggest week → nothing); publish gate jammed; IG fully dark

- Brief: [`docs/daily-briefs/2026-07-13_marketing-status.md`](../daily-briefs/2026-07-13_marketing-status.md).
- **Growth freshness gate PASSED:** the weekly audit ran today (growth-log newest entry `2026-07-13`), so the brief folds its headline + biggest leak verbatim instead of re-deriving numbers.
- **Growth headline:** the now-complete 2026-07-06 week drew **5,357 new visitors — the highest in the 8-week window (+48% WoW)**, almost entirely onto personality-analysis, and converted it to **0 signups, 0 comments, 1 profile, 0 waitlist, 0/6 wall conversion.** PA dwell fell to **11.7s (8-week low)** from 18.8s at 99% bounce. Give-first still half-blind (only `gate_shown`), Chorus still dead (`nine_user_takes` = 1 row ever — likely silent bug). Growth's #1 bet: above-fold, page-matched, one-field capture on personality-analysis (product/eng scope).
- **Bottleneck flipped create → publish.** Last week's `oliver-tree` API failures are gone: the nightly cron shipped clean drafts 07-13 (David Beckham T3, grade 8.6 B+, 69 min; N3on T3). But `publish-people` shipped **0 posts 07-10/07-11/07-12** — every unpublished draft rejected on missing grade-stability deltas, missing manual Canva images, or grades 0.1 under 8.5. Engine writes daily, ships nothing. Fastest unblocks: supervised `/grade_blog` regrade on `hailee-steinfeld` + `Kaia-Gerber` (both grade-passing, need only the delta); add images for `oliver-tree` / `julia-fox`.
- **Instagram fully dark:** 7 of 7 recent mornings blocked (07-06 → 07-12, `instagram_account_not_in_picker`). Regression from "5/7" last brief. @9takesdotcom evicted from shared Chrome profile; only DJ can re-login.
- **SEO refreshed:** corpus-stats + crosslink index regenerated 07-12; GSC `latest.json` now runDate 2026-07-06 (was 06-11).
- **New scout 07-13** (`docs/content-research/2026-07-13_surging-people-scout.md`): top create pick **Michael Truell** ($60B Cursor/SpaceX), then Josh O'Connor; Milly Alcock refresh. Backlog queue drained to ~1 entry.
- **Unchanged:** 9 distribution packets unfired; Quora ~55 days dark; Long-Form outreach staged (06-29 Bartlett/Ferriss/Schulz assets, no send evidence); email starved (2 sends/wk, welcome_sequence now 1 active enrollment).
- **Owner:** DJ. Open decisions in brief §"Open questions for DJ": PA above-fold capture, publish-gate regrades, manual images for oliver-tree/julia-fox, IG re-login, approve Truell/O'Connor/Alcock, Chorus/give-first smoke-test, distribution + Quora standing calls.

### 2026-07-06 — Unattended status brief: growth stale; people pipeline reliability broke; IG session unstable

- Brief: [`docs/daily-briefs/2026-07-06_marketing-status.md`](../daily-briefs/2026-07-06_marketing-status.md).
- **Growth freshness gate:** newest growth-log entry is 2026-07-01, not today, so the brief leads with `⚠️ STALE GROWTH DATA (last audit 2026-07-01)` and does not present old funnel numbers as current.
- **Biggest operational change:** people automation shipped through 07-04, then `oliver-tree` failed on both 07-05 and 07-06 before draft creation because of API connection failures. Both runs still advanced downstream stages against a missing draft, so the old "silent cycle" failure mode is still live.
- **Signup status corrected:** `/api/signups` still has no recaptcha, but direct inspection shows layered hardening now exists (honeypot, 2.5s time-trap, bot-user-agent blocks, malformed-local blocking, per-IP/per-email rate limits, auth-abuse checks, and `newsletter_signup_security_events`). Needs fresh growth audit to verify real-world effect.
- **Instagram regressed from "healthy" to "cadence present, account blocked":** 2026-07-06 warmup blocked at `instagram_account_not_in_picker`; latest warmup says 5 of last 7 mornings blocked and only 07-01 / 07-04 worked.
- **Still idle:** 9 distribution packets remain queued; Quora is ~48 days dark since 2026-05-19; Long-Form outreach remains staged, with new 06-29 Bartlett/Ferriss/Schulz/Diary-of-a-CEO assets but no send evidence.
- **SEO state:** corpus stats + cross-link index generated 2026-07-06; GSC export still 2026-06-11.
- **Owner:** DJ. Open decisions in brief §"Open questions for DJ": Oliver Tree retry vs advance queue, whether current `scripts/run-blog-pipeline.sh` edit is the Stage-1 hard-stop fix, Instagram re-login/dedicated profile, fresh growth audit, distribution priority, Quora revive/retire.

### 2026-07-01 — Unattended status brief: publish gate UNJAMMED; IG healthy; signups leak + Quora still open

- Brief: [`docs/daily-briefs/2026-07-01_marketing-status.md`](../daily-briefs/2026-07-01_marketing-status.md).
- **Biggest swing:** the 06-20 publish-gate jam (0/429 publishable, 355 stuck on v1 rubric) is RESOLVED. Auto-publisher shipped a person nearly every day 06-21→07-01: John-Goodman, adam-sandler, lily-allen, keith-lee, bert-kreischer, odessa-azion, megan-fox, nicki-minaj, leonardo-da-vinci (07-01, grade 8.6). Create + publish both live. Drafts on disk 437 → 464.
- **Instagram graduated to HEALTHY:** unbroken daily warmups through 07-01 + replies (06-29). Strongest channel now.
- **Still open (carried from 06-20):** `/api/signups` still has NO recaptcha (bot-spam leak unfixed — confirmed zero recaptcha ref in server files); Quora still DEAD (~43 days, since 2026-05-19); Long-Form cluster still 0/12.
- **New flag:** weekly growth audit did NOT run Monday 06-29 (growth-log newest entry still 2026-06-20). Growth numbers 11 days stale.
- **New this period:** Tier-1 personality-analysis refresh plan (`docs/content-analysis/tier1-blog-refresh-plan-2026-07-01.md`, 6 stale blogs to rebuild) + candidate scout (`docs/blog-automation/personality-analysis-candidates-2026-07-01.md`, e.g. Lamine Yamal, Rosé). Both uncommitted. Distribution set now includes steven-bartlett + lana-del-rey packets (still 9 total, all unfired).
- **Owner:** DJ. Open decisions in brief §"Open questions for DJ": signups recaptcha, fire distribution (gate now open → blogs landing silent), Quora revive/retire, rerun growth audit, green-light Tier-1 rebuild + new candidates.

### 2026-06-20 — Unattended status brief (42-day gap closed); two jammed gates + spam leak

- Brief: [`docs/daily-briefs/2026-06-20_marketing-status.md`](../daily-briefs/2026-06-20_marketing-status.md). First status brief since 2026-05-09.
- **#1 urgent (product, not marketing-pm scope):** `/api/signups` is being bot-stuffed — 75 of 79 weekly signups are spam, endpoint has no recaptcha. Poisoning email metrics + sender reputation. Needs DJ/eng to add recaptcha. Cross-ref growth-log 2026-06-20.
- **#2 bottleneck:** publish gate fully jammed — 2026-06-19 run found 0/429 publishable; **355 drafts stuck on stale v1 grade rubric** needing `/grade_blog`. People pipeline writes daily but ships nothing. Unblock = re-grade freshest draft(s), then `/blog_content_publish_people`.
- **#3 channel dead:** Quora dark ~32 days (last session + cron + question-log all stop 2026-05-19). Decision needed: revive or retire.
- **Recovered:** Instagram back live 2026-06-17 after 40+ day block; 3 consecutive passes since.
- **Healthy:** people blog cron running daily (06-19 nick-offerman, 437 drafts on disk).
- **Unchanged:** pop-culture 22 unpublished (12 are 3+ months old); 9 distribution packets unfired; Long-Form Network cluster still 0/12 sent + Bartlett still unpublished.
- **Note:** `Jason-Sudeikis.md` skipped by publish parser (`anchor:` key at line 59); body YAML reads valid on inspection — parser edge case, not the `\'` build-break class. Worth a parser check.
- **Owner:** DJ. Open decisions in brief §"Open questions for DJ": signups recaptcha, publish re-grade plan, Quora revive/retire, Bartlett, distribution priority.

### 2026-05-14 — Session close: outreach drafts handed off via pickup brief

- Pickup brief: [`docs/daily-briefs/2026-05-14_pickup-brief.md`](../daily-briefs/2026-05-14_pickup-brief.md). Use it as the single starting point on next outreach session.
- **#1 move on resume:** publish Bartlett — `/blog_content_publish_people Steven-Bartlett`. Grade 8.8 (above 8.5 gate); disk still `published: false`. Unblocks email #6 in the cluster.
- **#2 move on resume:** tighten the 12 cluster emails against the new outreach doctrine (see next entry). Sample tightened email in pickup brief §3.
- **#3 move on resume:** publish 3 remaining stale Dec 2025 / Jan 2025 pop-culture drafts (`world-leaders-enneagram-personality-dynamics`, `aoc-and-the-squad-enneagram-types`, `onlyfans-creators-enneagram-digital-intimacy`) via `/blog_content_publish_pop_culture`.
- Long-Form Network campaign: 0/12 sent. Drafts in flight at `docs/outreach/2026-05-11_long-form-network-emails.md`. DJ has been iterating these — do not mass-edit without checking diffs.

### 2026-05-14 — New cold-outreach doctrine codified (memories live)

- DJ added three memory entries that change how all future cold outreach gets drafted:
  - `feedback_cold_outreach_principles` — 50–125 words, **1 link max**, 5–7 day follow-up cadence (not 14), 1–3% realistic reply ceiling for cold-to-high-profile. Never ask for a call. Subject lines 4–7 words / 36–50 chars.
  - `feedback_outreach_inevitability_voice` — "Already published" frame. "With or without you" energy. No supplication. Patterns: _"It's already up — felt strange to write N words about someone without telling them."_ / _"If you'd refine anything, I'd love that. If not, glad you saw it."_
  - `reference_enneagram_type_3_outreach` — wing-specific (3w2/3w4/3w8) cold-outreach tuning. Applies to half the cluster (Williamson, Hormozi, Bartlett, Abdaal).
- **Implication for existing 2026-05-11 drafts:** All 12 cluster emails violate all three new rules (150–220 words each, 3–4 links each, "would value the correction" supplication tone). Need a tightening pass before any send.
- **For future agents and sessions:** Default to these constraints. DJ will reject supplication tone.

### 2026-05-14 — Guerrilla marketing playbook drafted (STRATEGY, not yet executing)

- New doc: [`guerrilla-marketing-playbook-2026-05-14.md`](./guerrilla-marketing-playbook-2026-05-14.md) captures the 80/20 frame, four high-leverage moves, Reddit thread archetypes, and channels-to-skip.
- Core 30-day loop proposed: **5 celebrity newsjacks/week → 24-hr blog → 1 Reddit comment per blog into existing threads on r/popculturechat or r/Fauxmoi.**
- Builds on existing [`docs/reddit/reddit-plan.md`](../reddit/reddit-plan.md) (which has the sub list) — this doc adds the strategic frame, archetypes, and what-to-skip.
- **Status:** strategy captured; nothing executing yet. See "Work still to do" section in the playbook for the 7 concrete next actions.
- **Owner:** DJ to decide cadence commitment + pick the first 5 newsjack targets. No automation built; loop is manual until proven.
- **Open questions:** automate newsjack loop or stay manual? Referral-traffic attribution before running? Relationship to existing 1-on-1 personality-analysis outreach.

### 2026-05-14 — Cancel Culture post (PUBLISHED after major rewrite)

- **File:** `src/blog/pop-culture/cancel-culture-enneagram-type.md` — flipped to `published: true` with `date: 2026-05-11`.
- **Rewrite shipped:** Addressed full reader-review punch-list in one pass — added Justine Sacco opener, real-name anchors (Hasan Minhaj, Roseanne, Joe Rogan), three new sections (Platform Mechanics, In-Group Cancellation, Past Peak Cancel), expanded cancelled-type coverage from 3 types to 6 (added 1/7/9), unpacked the Type 2 victimhood line, linked all 9 types internally, strengthened disclaimer.
- **De-dup pass:** Killed the original's overlapping "What Each Type Thinks" + duplicate "How to Survive by Type" sections. Word count 2251 → 2122 despite adding three new sections.
- **Image:** Reusing `twitter-toxic-psychology.webp` (best existing thematic match; shared hero with `twitter-x-personality-types-toxic.md`). Custom `mjPrompt` for a unique tribunal scene still preserved in frontmatter for a future render.
- **Follow-ups doc:** [`docs/planning/cancel-culture-blog-followups-2026-05-14.md`](../planning/cancel-culture-blog-followups-2026-05-14.md) — distribution packets, cross-linking targets, optional unique-hero render, pipeline housekeeping check.
- **Next:** confirm `/blog_content_publish_pop_culture` was run (would handle sitemap + FTS + crosslinks). If flipped manually, run `pnpm gen:sitemap && pnpm index:blogs && pnpm gen:crosslinks`. Then distribution packets (Instagram / Twitter thread / Quora / newsletter).
- **Owner:** DJ.

### 2026-05-11 — Pop-culture publish queue (BOTTLENECK; unblocker shipped today)

- Current state on disk: **26 published, 19 unpublished** (snapshot from `grep ^published: src/blog/pop-culture/*.md`)
- The 2026-05-09 brief said 17 stuck drafts; the kardashian draft has since been flipped to `published: true` with `date: 2026-05-09`. Disk drift between brief and reality.
- **2026-05-11 unblocker:** `/blog_content_publish_pop_culture` command now exists. Validates draft + flips frontmatter + regenerates sitemap + syncs Supabase FTS in one shot.
- SEO scaffolding (corpus-stat callouts, type-pillar wiring, JSON-LD) is already in place — each post published now gets full amplification benefit
- **Next:** DJ can now `/blog_content_publish_pop_culture` against the 5 stale Dec 2025 / Jan 2026 drafts, one per session. Distribution packets follow (6 still queued in `docs/distribution-assets/`).
- **Owner:** DJ runs the command per draft; the command does the work.

### 2026-05-11 — People blog pipeline (HEALTHY, automated)

- Cron last ran 2026-05-11 02:15 (cron log) + 06:01 (publish log). Daily cadence holding.
- 3 new drafts added since the May 9 brief: `Alex-Lieberman.md`, `Salma-Hayek.md`, `Sean-Evans.md` (currently uncommitted on disk)
- Ana de Armas draft + research brief landed in commit `54f41c38`
- **Next:** nothing required — pipeline runs itself. Monitor for cron failures.

### 2026-05-11 — Quora daily cadence (RUNNING, with one gap)

- Sessions present: `2026-05-10_quora-warmup.md`, `2026-05-10_quora-answers.md`, `2026-05-11_quora-warmup.md`
- Quora automation cron log on 2026-05-11 is **1 byte (empty)** — likely a skipped run or upstream failure. Worth checking.
- **Next:** investigate empty cron log; otherwise cadence is holding.

### 2026-05-11 — Instagram daily warmup (RUNNING)

- `2026-05-11_instagram-warmup.md` present.
- Engagement targets doc was appended to since the May 9 brief (append-only preserved).
- `instagram-recovery-todo-2026-05-07.md` still present — status unknown.
- **Next:** confirm whether the May 7 recovery todo is closed or still open.

### 2026-05-11 — Distribution packets (QUEUED, UNFIRED)

- 6 packets sit in `docs/distribution-assets/`: Benson Boone, Chris Williamson, John Coogan, Justin Bieber, Shawn Ryan (+ Instagram variant), Tech Titans Disruptors
- Pure execution work. No writing required.
- **Next:** DJ picks 2–3 to fire, runs them through the respective channel commands.

### 2026-05-11 — Long-Form Network email drafts (12, ready-to-send)

- File: `docs/outreach/2026-05-11_long-form-network-emails.md`.
- All 12 cluster emails drafted with signature specifics pulled from each piece's FEEDBACK comments (the curated golden lines). Williamson first per DJ.
- Each opener references a concrete moment from the actual published piece — shoulder-bag (Williamson), Tony Robbins confession (Hormozi), 13 pounds in the chicken shop (Bartlett), King Kong/Godzilla age-5 scene (Rogan), "You're morally obligated to do remarkable things" (Peterson), 7-Eleven opening (Fridman), etc.
- **Typing correction caught:** Tim Ferriss earlier guessed 5w4 (wrong). Actual piece types him Type 1 ("Self-Help's Relentless Reformer"). Email opener rewritten around the suicide disclosure / forgotten address change. Cluster doc DM also patched.
- **Bartlett step:** Disk still `published: false`; grade now 8.8. Email is drafted but won't deliver value until `/blog_content_publish_people Steven-Bartlett` is run.
- **CAN-SPAM mitigation:** Each email closes with "If you'd rather not hear from me again on this, just reply 'no thanks' and I'll stop." Cheap insurance now that cluster send count > 5.
- **Owner:** DJ verifies each URL renders before sending; pulls subject line + fires email.

### 2026-05-11 — Long-Form Network cluster campaign (DRAFTED, awaiting review)

- File: `docs/outreach/2026-05-11_long-form-network-cluster.md`.
- Editorial frame: "The Long-Form Network" — 9takes positions as the publication seriously analyzing the 12 people running the most consequential long-form interview shows of this era.
- Cluster: Chris Williamson, Joe Rogan, Jordan Peterson, Alex Hormozi, Lex Fridman, Shawn Ryan, Theo Von, Tim Ferriss, Andrew Huberman, Ali Abdaal, Andrew Schulz, Steven Bartlett.
- Strategy: Network-proof private outreach (Strategy A). No public moment yet.
- Sequencing: 3 weeks. Week 1 = engagement-likely (Hormozi, Williamson, Abdaal). Week 2 = connectors (Huberman, Ferriss, Bartlett, Theo). Week 3 = heavyweights (Peterson, Fridman, Rogan, Shawn Ryan, Schulz).
- Adjacent-link rotation designed so no two recipients see the same trio.
- Steven Bartlett special case: not live (grade 8.0 < 8.5 publish gate). Kept as recipient, no own-profile link. Future: upgrade his draft to A-grade, then publish + re-fold.
- Voice: every send leads with a sharp specific from their piece, names 2–3 other cluster members as proof, ends with fairness ask.
- **Open before-send:** typing verification (Pre-send check on every draft), Hormozi vs Williamson as first send, public-moment decision (deferred 2 weeks), sender identity for Peterson email.

### 2026-05-11 — Chris Williamson outreach campaign (DRAFTED, awaiting review)

- 10-recipient campaign drafted at `docs/outreach/2026-05-11_chris-williamson-campaign.md`.
- Strategy grounded in `docs/planning/personality-analysis-outreach-positioning-2026-05-11.md` + `personality-analysis-outreach-workflow-2026-05-06.md`.
- Channel mix: X DM for subject + podcasters/creators (Chris, Bartlett, Bilyeu, Hormozi, Abdaal); email for commentators (Clouse, Kocak, Peterson); Reddit posts for communities (r/Enneagram, r/DecodingTheGurus).
- Voice: distribution-packet-grade specifics (shoulder-bag, Love Island Coriolis, 2025 mold/Lyme) leading every opener. Fairness frame baked in per positioning doc.
- Default adjacent links: Alex Hormozi + Robert Greene (both verified live).
- CAN-SPAM decision: skipped (1:1 relationship pitches, not commercial broadcast).
- **Open before-send:** sender email identity, Peterson vs swap, Draft A vs B for the subject DM, Ali Abdaal URL verification, sequencing (same day vs staggered).
- **Owner:** DJ approves draft + sends; campaign doc has reply-handling cheat sheet + tracking columns.

### 2026-05-09 — SEO infrastructure push (LANDED, may now be quieter)

- May 5–9 commits added: corpus-stat citations across 9 type pages, FAQ JSON-LD, HowTo schema on guides, Quotation JSON-LD on 7 personality-analysis categories, bridge-links sidebar, /enneagram-test CTA below enneagram-corner posts, pop-culture → type-pillar wiring
- Since 2026-05-09, SEO commits have quieted; engine has shifted to people-side draft authoring
- **Next:** none required. Amplification is now in place for the pop-culture queue.

---

## Blocked / waiting

### 2026-08-03 — Current blockers needing DJ / eng decision

- **Create engine, hard deadline tonight:** `stableronaldo` at `retryCount: 2`; the 02:00 run is retry 3/3. Root cause confirmed at `scripts/run-blog-pipeline.sh:109` (`${PERSON}.md` path assumption vs the `Stable-Ronaldo.md` the create stage actually writes). Fix the resolution or rename the queue entry.
- **Publish gate, structural (blocker class changed):** `missing_full_image=54` is now the largest class, ahead of `stale_grade_rubric_v1=30`. Images are manual Canva only — no automation path exists or should be built. Needs a standing batch decision from DJ, or a gate change so image-blocked drafts stop masking real near-misses.
- **Instagram, decision not execution:** the warmup agent asked DJ to choose between folding reply-drafting into the warmup cron or cutting the job to 2-3x/week. Four consecutive sessions produced zero posted comments; a fifth queue is worse than either answer. Also still owed: browser rename ("Browser 1" → "9takes.com"), 3rd brief running.
- **Growth PA port BLOCKED by a UI regression:** NineChorus light-mode contrast (see 07-29 `84c055bd`). Restore explicit contrast before the standing port bet, or it lands invisible.
- **Reactivation email is losing and over-enrolled:** `reactivation_zombies` launched against the explicit hold condition; 90 people touched → 1 click, 0 returns. Growth recommends pausing both dormant and zombies and rewriting the CTA.
- **Content-ops runway RED:** 0/10 approved; Robert Greene's target date is today and DJ's review is the only gate.
- **Carried:** Quora 76 days dark (revive or retire, 6th brief); 14 distribution assets unfired; T-11 unfixed so the QUALITY GRADE leak regenerates (212 people drafts still carry the marker); GSC window still straddles the 05-04 URL fix.
- **Resolved since 07-27:** the 7-day publish drought (DJ cleared 9 by hand with supervised regrades); GSC staleness; Instagram session eviction stays fixed.

### 2026-07-20 — Current blockers needing DJ / eng decision

- **Growth activation (product/eng) — NOW the top move:** the give-first/Chorus mechanic is proven (12% wall, full loop turn) but quarantined to ~0.6% of traffic. Port it above the fold onto personality-analysis, where the ~4,260-visitor firehose lands with 0 capture. Also: scale masking-question 567 (the only native `contribution` source).
- **Create engine timeout (NEW):** `travis-kelce` produced no draft — Stage 1 create exceeded the 600s research-agent ceiling. Retry 1/3 tomorrow. If it repeats, raise the create ceiling or `forceNext` a lower-research person in `override.json`. Publish backlog (85 unpublished drafts) gives runway.
- **Instagram fully dark + escalated:** 17/20 mornings blocked; @9takesdotcom now fully evicted from the picker (full-handle re-login required). DJ re-login + dedicated Chrome profile.
- **Carried:** 13 distribution assets unfired (IG variants also gated on the IG re-login); Quora ~62 days dark (revive or retire); GSC export ~16 days stale (refresh for seo-content-strategist).
- **Resolved since 07-13:** publish gate unjammed on its own (10+ posts shipped 07-18→07-20, incl. both prior blockers Kaia Gerber + Oliver Tree). Chorus "silent bug" resolved — `nine_user_takes` and native `contribution` both firing.

### 2026-07-13 — Current blockers needing DJ / eng decision

- **Publish gate jammed (NEW primary bottleneck):** create engine healthy but `publish-people` shipped 0 posts 07-10/07-11/07-12. Blockers are human-in-loop: supervised `/grade_blog` regrades to record stability deltas (`hailee-steinfeld`, `Kaia-Gerber` — both grade-passing) + manual Canva images (`oliver-tree`, `julia-fox` — grades pass). Any one clears a publish.
- **Instagram fully dark:** 7/7 recent mornings blocked (`instagram_account_not_in_picker`). DJ re-login + dedicated Chrome profile required.
- **Growth activation (product/eng):** biggest visitor week (5,357) converted to 0 signups; growth's #1 bet is an above-fold PA capture. Also: `nine_user_takes`=1 row ever flagged as likely silent Chorus bug — smoke-test `/api/nine/mirror` + ship submit-side give-first instrumentation.
- **Backlog queue drained to ~1 entry:** approve scout picks (Michael Truell top) to keep the create engine fed.
- **Carried:** 9 distribution packets unfired; Quora ~55 days dark (revive or retire).

### 2026-07-06 — Current blockers needing DJ / eng decision

- **Growth audit stale:** newest growth-log entry is 2026-07-01; weekly 2026-07-06 audit did not append before this brief.
- **Blog automation:** `oliver-tree` failed twice before draft creation (07-05 `ConnectionRefused`; 07-06 connection closed mid-response). Decide retry vs advance queue after fixing the API/tooling issue.
- **Instagram:** @9takesdotcom not in picker on 2026-07-06; manual re-login or dedicated Chrome profile required before warmups can reliably clear the owed @enneagrampaths reply.
- **Quora:** no session/question-log/cron activity after 2026-05-19; revive or retire.

### 2026-05-11 — Daily brief cadence

- Only 2 briefs total exist: `2026-04-17_pickup-brief.md`, `2026-05-09_marketing-status.md` (gap of ~3 weeks).
- Decision needed: restart cadence (daily? weekly?) or formalize retirement.

---

## Decisions

### 2026-06-11 — Agent overhaul: merged editors, merged growth analysts, weekly automation, GSC + DB data access

- **`editor` agent** replaces `content-editor` + `content-polish` (both archived at `docs/archives/agents/`). One editor with three depths: diagnose / line edit / developmental edit. Calibrates first; honors an explicit depth as a hard ceiling. Shared rulebook extracted to `.claude/skills/9takes-editorial-standards/SKILL.md` (also now governs `/deai`, `/copywriting-pass`, `/blog_content_editor_pass_people`); hard rules codified: never touch `lastmod`, zero em-dashes, 8.5 grade gate.
- **`growth-analyst`** is the single growth agent (v1 + v2 merged; originals archived). New capability: read-only SQL via `scripts/db-query.sh` — needs DJ to add `SUPABASE_DB_URL` to `.env.local` (Supabase dashboard → Connect → Session pooler URI).
- **Weekly automation**: `/weekly-growth-audit` (growth-analyst → growth-log) and `/weekly-marketing-brief` (marketing-pm → dated brief + this log), via `scripts/run-weekly-*.sh`, cron Mondays 6:00/7:00 AM. DJ must run `./scripts/install-weekly-cron.sh` once (macOS blocks programmatic crontab edits).
- **GSC data feed**: `scripts/fetch-gsc-data.mjs` pulls Search Console queries/pages into `docs/data/gsc/` for the `seo-content-strategist`. One-time setup in `docs/data/gsc/README.md` (enable API + add service account to the GSC property).
- All slash-command references to retired agent names updated.

### 2026-05-11 — Created `/blog_content_publish_pop_culture` slash command

- Resolves the blocker flagged in the 2026-05-09 brief.
- Implementation: command-only, no new script. Mirrors `/blog_content_publish_people` workflow but adapted for MDsvex file-based pop-culture pipeline (no Supabase row, just frontmatter flip + sitemap regen + index-blogs).
- Date behavior: bumps `date` and `lastmod` to today on publish (matches the people command convention; SEO freshness benefit for stale drafts).
- Gates: frontmatter completeness, body ≥ 1000 words, ≥ 5 `##` sections, no placeholder markers, `picGroup` image files exist on disk, `loc` slug matches filename.
- File: `.claude/commands/blog_content_publish_pop_culture.md`.
- Next: unblocks just-ship-it batch on the 5 stale Dec 2025 / Jan 2026 drafts.

### 2026-05-11 — Created `marketing-pm` agent

- Full operator scope (can edit drafts, flip flags) with explicit per-action confirmation gates.
- Append-only log model (this file) + dated briefs in `docs/daily-briefs/`.
- Scans all four surfaces: blog pipelines, distribution + social, SEO + growth, outreach + email + funnel.
- File: `.claude/agents/marketing-pm.md`.

---

## Status snapshots

- [2026-08-03](../daily-briefs/2026-08-03_marketing-status.md) — growth reversed (contributions 14 → 4, gate 16.3% → 5.4%, contributor return corrects to 0%, 82% of registrants untyped); DJ broke the publish drought by hand (392 → 401 published, 9 manual with regrades) and it re-jammed in a day with image debt (54) overtaking stale grades (30); NEW create filename bug at `run-blog-pipeline.sh:109` burning retry 3/3 tonight; IG sourcing clean but zero comments posted 4+ sessions (agent escalated a fork) + new Claude weekly-cap failure mode; content-ops queue RED 0/10 approved; PA port blocked by NineChorus light-mode regression; Quora 76 days dark.
- [2026-07-27](../daily-briefs/2026-07-27_marketing-status.md) — best contribution week ever (14 comments, 10 humans; gate 15-19%, homepage 18.8%) but 9/10 contributors evaporate unreached; publish jammed 7 days (0 since julia-fox; 92 drafts on v1 rubric, victoria-justice fastest unblock); create recovered to cap; IG session FIXED (dedicated profile live 07-26 PM) but replies still unposted; GSC refreshed 07-25; reactivation launched (50 enrolled, 0 clicks).
- [2026-07-20](../daily-briefs/2026-07-20_marketing-status.md) — growth loop PROVEN (0→9 comments, native funnel + Chorus live, one full loop turn) but quarantined to ~0.6% of traffic; publish valve reopened (10+ posts, both prior blockers cleared); create timed out (travis-kelce, no draft); IG escalated dark 17/20.
- [2026-07-13](../daily-briefs/2026-07-13_marketing-status.md) — growth fresh (biggest visitor week converted to ~nothing); bottleneck flipped create→publish (0 posts 3 days); IG fully dark 7/7; GSC refreshed; new scout (Truell top pick).
- [2026-07-06](../daily-briefs/2026-07-06_marketing-status.md) — stale growth data; people pipeline failed twice on Oliver Tree; IG session blocked again; distribution/Quora still idle.
- [2026-07-01](../daily-briefs/2026-07-01_marketing-status.md) — publish gate unjammed (shipping daily again); IG healthy; signups leak + Quora + growth-audit-skip still open.
- [2026-06-20](../daily-briefs/2026-06-20_marketing-status.md) — two jammed gates (publish + Quora) + signups spam leak.
- [2026-05-09](../daily-briefs/2026-05-09_marketing-status.md) — first full marketing-state brief. Identified pop-culture queue as bottleneck.
- [2026-04-17](../daily-briefs/2026-04-17_pickup-brief.md) — pickup brief.

---

## Experiment + campaign log

Cross-link only. Detail lives in `docs/growth/growth-log.md`.

### 2026-04-08 — Full-stack growth audit (`growth-analyst-2`)

- Three concrete bugs identified: (1) `EnneagramCTASidebar` commented out + console.log handler, (2) stale "join the waitlist" copy in blog footers, (3) split visitor identity between `anon-*` and FingerprintJS `visitorId`.
- See `docs/growth/growth-log.md` "Experiment Log" for full hypothesis + metric plan.

---

## Conventions

- Dates are ISO `YYYY-MM-DD`. Today is set by the runtime, not invented.
- "Owner" is who pulls the next trigger (almost always DJ for external-firing actions).
- Cross-link rather than duplicate. Growth experiments live in `docs/growth/growth-log.md`; this log references them.
- The `marketing-pm` agent appends after every substantive run. If you (a human or another agent) edit this log, leave the dated entries intact.
