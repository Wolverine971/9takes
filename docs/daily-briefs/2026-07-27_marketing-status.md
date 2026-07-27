<!-- docs/daily-briefs/2026-07-27_marketing-status.md -->

# 9takes Marketing Status — 2026-07-27

**Unattended run (marketing-pm).** DJ not present. No actions taken that require confirmation; all pending decisions routed to "Open questions for DJ." No blog drafts, `published:` flags, product code, git mutations, or external services touched. Prior status brief: `2026-07-20_marketing-status.md`.

## TL;DR

- **Growth data is FRESH (audit ran today, 2026-07-27).** Headline, verbatim: _"best contribution week ever (14 comments, 10 humans), the gate escaped the questions ghetto and converts 15-19% — but 9 of 10 contributors evaporate as unreachable fingerprints."_ Last week's #1/#2 bets partially shipped and immediately worked: the q567 prompt now fires on the **homepage at 18.8% native conversion**, and the first personality-analysis Chorus take since June landed organically (robert-pattinson). Reactivation email FINALLY launched (50 enrollments, 12 opens, 0 clicks).
- **Biggest leak, verbatim:** _"anonymous contribution evaporation. The gate now converts 14-19% wherever it's placed and produced 9 new contributors — but 9 of 10 contributing humans are unreachable fingerprints, 0 emails were captured, and the only person who returned on a later day is the one registered profile. Each loop turn burns out at the moment of maximum engagement (just contributed, awaiting the reveal) because nothing asks for identity."_
- **The pipeline swapped states again: create fully recovered, publish jammed 7 straight days.** Create shipped 6 drafts since last brief (Travis Kelce 8.6 — the timeout resolved on retry — Nolan 8.9, Yang Zhilin 8.7, Sadie Sink 8.3, CaseOh 8.6, PlaqueBoyMax 8.4 needs-review) and hit its 5/5 weekly rate limit. Publish shipped **zero posts since julia-fox on 07-20** — every day blocked on grade-stability deltas, missing Canva images, or stale v1-rubric grades (92 of 94 unpublished drafts).
- **Instagram REVERSED — the session problem is fixed.** The dedicated per-brand Chrome profile went live 07-26 PM and ran the first clean warmup on the new architecture. The bottleneck moved from login to posting: reply drafts are queued across two docs but **nothing has posted in 5+ passes** (Candice first-touch queued 5x, Melissa's owed reply now ~38+ days).
- **GSC refreshed** (latest.json runDate 2026-07-25 — closes last brief's open question #7); corpus-stats + crosslink index regenerated 07-26.
- **Unchanged:** Quora ~69 days dark; distribution now **14 unfired assets** (new: blackpill social package, 07-22); 0 signups 4th straight week; coaching waitlist 0 for 9 weeks.

## The actual work — the publish gate is the drought; create is at full rate

Last brief the risk was create (travis-kelce timeout). That resolved itself on retry the next night. The real story this week is the opposite end: **the publish gate rejected every candidate for 7 consecutive days** while create ran at its weekly cap. People disk went 483 → 493 files but published only moved 391 → 392. The engine writes daily and ships ~nothing — the same failure shape as the June v1-rubric jam, now structural: 92 of 94 unpublished drafts carry stale v1 grades that hard-block until a `/grade_blog` regrade.

This matters because fresh person-posts landing on personality-analysis remain marketing's main feed into the funnel — and growth just proved PA readers will use the Chorus mechanic when they find it (robert-pattinson fired the first PA contribution since June).

| Artifact / log                                       | Observed state                                                                                                                                                                                                                                           | Why it matters                                                                               |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `logs/blog-automation/publish-people-2026-07-27.log` | 0 published. 485 candidates checked, 94 unpublished, **zero eligible**. Closest: **victoria-justice** (v2 grade 9.0, needs only a supervised regrade delta + epigraph tag — **no image work**) and **plaqueboymax** (8.4, needs revision + both images). | Names the two fastest unblocks explicitly.                                                   |
| Publish logs 07-21 → 07-26                           | Blocked every day: Nolan (images), Yang-Zhilin (gate), and by 07-25 the pool diagnosis — 52 drafts sit at v1 grades ≥8.5 (Eastwood 9.3, FLW 9.3, Britney 9.2…) all hard-blocked as `stale_grade_rubric_v1`.                                              | The jam is not one draft; it is the v1-rubric backlog. One-off regrades buy days, not a fix. |
| `logs/blog-automation/cron-2026-07-27.log`           | PlaqueBoyMax created, 70 min, revision loop fired once (7.8 → 8.4), **needsReview=true**, `docs/content-analysis/grades/PlaqueBoyMax.review.md` written.                                                                                                 | Create healthy; this draft is below bar and awaiting human review.                           |
| `docs/blog-automation/override.json`                 | `pause=false`, week started 07-26, `currentWeekCount=2/5`, `forceNext=null`.                                                                                                                                                                             | Create has 3 slots left this week; the limiter is not the blocker — the gate is.             |
| People drafts (disk)                                 | 493 files — 392 `published: true`, 94 `published: false` (was 483/391/85).                                                                                                                                                                               | +10 drafts, +1 published in 7 days. Net throughput ≈ zero.                                   |

## Tooling state

- **Instagram automation re-architected and VERIFIED:** per-brand Chrome profiles live; 07-26 PM was the first clean unattended-style session (same-day catch on @enneagrampaths). One nice-to-have flagged by the run itself: the extension browsers are named "Browser 1"/"Browser 2" — rename Browser 1 → "9takes.com" so cron runs can select by name instead of verifying by navigation. The 07-26 AM cron still hit the old shared profile and blocked; PM path is the working one.
- **Blog create engine:** recovered. The 600s-ceiling timeout on travis-kelce did not recur; 6 clean creates since. Rate limit (5/wk) is the pacing constraint, not failures.
- **Weekly automation:** both Monday jobs ran on schedule — growth audit 06:00 (exit 0), marketing brief 06:05 (this run).
- **New parallel workstream observed (untouched):** blog **evidence enrichment** — `EvidenceFigure.svelte`, `src/lib/blogEvidenceMedia.*`, `docs/blog-enrichment/` (Elon Musk pilot, `enriched-local`, 5 visual-evidence hooks), a design-preview route, and a HyperPlexed evidence audit (07-26). All uncommitted product/design work in flight; `Elon-Musk.md` draft is modified as part of it — left alone.

## Cross-surface status

### Blogs

- **People:** create at cap, publish at zero (see above). PlaqueBoyMax awaiting review; victoria-justice is the named fastest publish.
- **Pop-culture:** unchanged chronic — 54 files, 18 unpublished; oldest cohort still Dec 2025 (`aoc-and-the-squad`, `onlyfans-creators`) plus the eight 2026-03-04 `*-enneagram-analysis` drafts. 16 of 18 are 2+ months old.

### Distribution

- **14 unfired assets** — 9 packets + 2 carousels + 2 IG variants + **new: `blackpill-social-package-2026-07-22/`** (README + social copy + assets, landed since last brief). Nothing fired. IG variants are now actually fireable for the first time since May (session works).

### Social

- **Instagram: session FIXED, posting still zero.** Warmups ran 07-25 and 07-26 PM on the new dedicated profile. Reply queues are drafted and sequenced across `2026-07-25_instagram-replies.md` (run FIRST: Melissa owed candy reply ~38d, Candice first-touch — 5th consecutive queue) and `2026-07-26_instagram-replies-pm.md`. The 07-26 run's own verdict: "the queue-execution gap is now the entire bottleneck." Also pending: 4 saves in inbox for `/instagram-saves` triage; content arc frozen 3+ weeks (last anchor post Chappell Roan ~07-04; Robert Greene and Pedro Pascal carousels unshipped).
- **Quora: ~69 days dark** (last activity 2026-05-19). Unchanged.
- **Twitter/X:** no persistent session log; no signal this run.

### SEO

- **GSC refreshed:** `docs/data/gsc/latest.json` runDate **2026-07-25** (was 07-06 / 16 days stale last brief). The seo-content-strategist's inputs are current again.
- `corpus-stats.md` regenerated 2026-07-26; crosslink index modified same pass.

### Growth (FRESH — audit ran 2026-07-27)

- **Best contribution week ever:** 14 comments from **10 distinct humans** (9 first-ever contributors — widest week in the log). Gate conversion 14% overall; **homepage placement 18.8% native** (32 fps → 6 contributions). q568 live and gated. Chorus `nine_user_takes` 3 → 11, including the first PA-page take since June.
- **Biggest leak (verbatim in TL;DR):** anonymous contribution evaporation — 9 of 10 contributors are unreachable fingerprints; 0 emails captured; only the registered profile returned on a later day.
- **Growth's ranked bets:** (1) **post-contribution identity capture** — one email field ("get notified when someone answers you") right after contribute/reveal; success ≥15% of anon contributors leave an email; (2) port the proven prompt to PA above the fold (~64% of traffic, 1 contribution all week); (3) judge `reactivation_dormant` on clicks/returns — hold cold/zombies until it produces ≥1.
- **Still dead upstream:** 0 signups (4th straight week), waitlist 0 (9 weeks), traffic 4,260 → 3,868 (−9%).

### Email

- **Reactivation launched — closes a 5-week-old flag.** `reactivation_dormant` active with 50 enrollments; 54 sends this week (51 = reactivation step-1), 12 opens (~22%), **0 clicks**, 1 unsub. `reactivation_cold`/`zombies` still 0 enrollments (per growth: hold). `welcome_sequence` 26 enrollments; newest profile (Type 5, reg 07-23) enrolled same-day but hasn't commented.

### Outreach

- Unchanged since 07-15 (`2026-07-14_reply-likelihood-top-10.md` newest artifact). No new send evidence. Abdaal + Bartlett drafts still safe to send per the 07-14 Gmail audit.

## What changed since the last brief (2026-07-20)

- **Create and publish swapped states — again.** Last brief: publish flowing, create timed out. This week: create recovered same-night (Travis Kelce retry succeeded 07-21) and ran to its weekly cap; publish shipped 0 for 7 days. The v1-rubric backlog (92 drafts) is now the named structural blocker.
- **Instagram flipped from "fully dark, escalated" to "session fixed, first clean run."** The dedicated-profile re-architecture shipped and was verified 07-26 PM. The blocker moved downstream: drafted replies have never been posted.
- **Growth escalated from "loop proven on 0.6% of traffic" to "gate escaped the ghetto":** homepage placement live at 18.8%, first PA Chorus conversion, 10 contributing humans (was ~1). New leak named: identity capture at the moment of contribution.
- **Reactivation email went from `draft`/0 enrollments to `active`/50 enrollments.**
- **GSC export refreshed (07-25)** — last brief's staleness flag cleared.
- **New distribution asset** (blackpill social package, 07-22) → 13 → 14 unfired.
- **New evidence-enrichment workstream appeared** (Elon Musk pilot + EvidenceFigure component) — product/design scope, in flight, uncommitted.

## Recommendation (ranked by leverage)

1. **Green-light growth's #1 bet: post-contribution identity capture.** Why: the gate converts 15-19% wherever it's placed and produced 10 real humans this week — then lost 9 of them as unreachable fingerprints. One email field at the reveal moment converts the system's only working loop into reachable identity; it's also the prerequisite for the reactivation/welcome sequences to ever have fuel. First step: DJ green-lights eng scope (field + `signups` write + suppression check), instrumented against the ≥15% capture / ≥1 return-in-30d success gate. Effort: small eng sprint. Risk: guardrail — contribution completion must not drop >10%.
2. **Unjam the publish gate with one supervised regrade session — victoria-justice first.** Why: 7-day publish drought while create runs at cap; victoria-justice is grade 9.0 v2 and needs only the stability delta + one epigraph tag — no image work — so it's a same-day publish. Then decide the structural question: batch-regrade the 52 v1-rubric drafts sitting ≥8.5, or accept a trickle. First step: DJ runs `/grade_blog victoria-justice`, then `/blog_content_publish_people`. Effort: ~30-45 min for the first publish. Risk: low; regrades can land below 8.5 (that's the gate working).
3. **Fire the first `/instagram-reply` session off the 07-25 doc.** Why: the session infrastructure finally works after ~3 months of eviction fights, and the run's own diagnosis is that posting is now the entire bottleneck — Melissa's owed reply is ~38+ days old and Candice's first-touch has been queued 5 straight times. Nothing on IG compounds until something posts. First step: `/instagram-reply docs/instagram/daily-engagement/2026-07-25_instagram-replies.md` (items 1-2 first, per the docs' own sequencing), then the 07-26 PM doc. Effort: ~20-30 min. Risk: minimal — drafts are pre-vetted against the comment-style memory.

## Open questions for DJ

1. **Identity capture (growth #1 bet, product/eng):** Green-light the post-contribution email field ("get notified when someone answers you")? Highest-EV move in the system this week; the loop works and then burns every anonymous contributor.
2. **PA above-fold port (growth #2, standing):** The homepage placement proves the prompt travels (18.8%); PA still holds ~64% of traffic with 1 contribution all week. Schedule the port?
3. **Publish gate:** Run the supervised regrade on victoria-justice this week? And the structural call — batch-regrade the 52 v1-rubric drafts ≥8.5, or let them sit hard-blocked?
4. **PlaqueBoyMax:** needsReview=true at 8.4 (review at `docs/content-analysis/grades/PlaqueBoyMax.review.md`). Revise to clear 8.5, or leave in the pool?
5. **Instagram execution (standing order):** Run `/instagram-reply` on the 07-25 doc first? Also two 2-minute items from the run itself: rename extension "Browser 1" → "9takes.com"; triage the 4 saves in inbox.
6. **Reactivation segments:** Per growth #3 — hold `reactivation_cold`/`zombies` until dormant produces ≥1 click or return? (Currently 12 opens / 0 clicks / 1 unsub.)
7. **Distribution (standing):** 14 assets queued, none fired — and the IG variants are fireable for the first time since May now that the session works. Fire the freshest (blackpill package / Bartlett / Ferriss), or keep paused?
8. **Quora (standing):** Revive or formally retire at ~69 days dark?

## Assumptions

- File counts are frontmatter scans on disk today; they drift from `backlog-queue.json` stats (391 published there vs 392 on disk) because the sets differ and the queue snapshot lags.
- Growth numbers are taken verbatim from the 2026-07-27 growth-log entry, not re-derived; no live product behavior was tested.
- "Nothing posted" on Instagram is inferred from the reply docs' `DRAFTS READY` status and the 07-26 run's own "queue-execution gap" verdict; external IG state was not queried.
- The evidence-enrichment workstream's scope/intent is read from `docs/blog-enrichment/README.md` only; its uncommitted code (`blogContentProcessor.ts`, `+page.svelte`, `blog.scss`, `Elon-Musk.md`) was not reviewed or touched.
- "Distribution unfired" means no fired-packet evidence in default repo surfaces; external channels were not checked.
