<!-- docs/marketing/marketing-log.md -->

# 9takes Marketing Log

**Append-only.** Newest entries on top of each section. Never overwrite past entries — that's what dated snapshots are for.

Maintained by the `marketing-pm` agent + DJ. Cross-link to `docs/growth/growth-log.md` for experiment-level detail rather than duplicating.

---

## Active workstreams

### 2026-05-11 — Pop-culture publish queue (BOTTLENECK, unchanged since 2026-05-09 brief)

- 17 real drafts sitting `published: false` in `src/blog/pop-culture/`
- 5 of those date to Dec 2025 / Jan 2026 (4–10 months stale)
- 11 date to Feb–Mar 2026
- 1 went live since the brief: confirm `succession-roy-siblings-enneagram-types.md` + `the-office-enneagram-types.md` frontmatter actually says `published: true` (sitemap suggested yes on May 9; disk needs verification)
- SEO scaffolding (corpus-stat callouts, type-pillar wiring, JSON-LD) shipped before this queue did — each post published now gets full amplification benefit
- **Next:** decide A (triage table → top 3–5) or B (just-ship the Dec 2025 cohort)
- **Owner:** DJ (manual; no automation for pop-culture)

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

### 2026-05-09 — SEO infrastructure push (LANDED, may now be quieter)

- May 5–9 commits added: corpus-stat citations across 9 type pages, FAQ JSON-LD, HowTo schema on guides, Quotation JSON-LD on 7 personality-analysis categories, bridge-links sidebar, /enneagram-test CTA below enneagram-corner posts, pop-culture → type-pillar wiring
- Since 2026-05-09, SEO commits have quieted; engine has shifted to people-side draft authoring
- **Next:** none required. Amplification is now in place for the pop-culture queue.

---

## Blocked / waiting

### 2026-05-11 — Pop-culture publish command
- Open question: does a `/blog_content_publish_people` equivalent exist for pop-culture, or is publishing manual (flip `published: true` + run indexer)?
- Blocks: just-ship-it batch on the pop-culture queue.

### 2026-05-11 — Daily brief cadence
- Only 2 briefs total exist: `2026-04-17_pickup-brief.md`, `2026-05-09_marketing-status.md` (gap of ~3 weeks).
- Decision needed: restart cadence (daily? weekly?) or formalize retirement.

---

## Decisions

*(none yet — DJ has not committed to A vs B on the pop-culture queue or to a brief cadence)*

---

## Status snapshots

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
