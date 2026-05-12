<!-- docs/marketing/marketing-log.md -->

# 9takes Marketing Log

**Append-only.** Newest entries on top of each section. Never overwrite past entries — that's what dated snapshots are for.

Maintained by the `marketing-pm` agent + DJ. Cross-link to `docs/growth/growth-log.md` for experiment-level detail rather than duplicating.

---

## Active workstreams

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

### 2026-05-11 — Daily brief cadence

- Only 2 briefs total exist: `2026-04-17_pickup-brief.md`, `2026-05-09_marketing-status.md` (gap of ~3 weeks).
- Decision needed: restart cadence (daily? weekly?) or formalize retirement.

---

## Decisions

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
