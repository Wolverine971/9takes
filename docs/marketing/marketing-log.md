<!-- docs/marketing/marketing-log.md -->

# 9takes Marketing Log

**Append-only.** Newest entries on top of each section. Never overwrite past entries — that's what dated snapshots are for.

Maintained by the `marketing-pm` agent + DJ. Cross-link to `docs/growth/growth-log.md` for experiment-level detail rather than duplicating.

---

## Active workstreams

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
