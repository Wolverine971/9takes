<!-- docs/daily-briefs/2026-07-01_marketing-status.md -->

# 9takes Marketing Status — 2026-07-01

**Unattended run (marketing-pm).** DJ not present. No actions taken that require confirmation; all pending decisions routed to "Open questions for DJ." No blog drafts, `published:` flags, or git touched. Prior status brief: `2026-06-20_marketing-status.md`.

## TL;DR

- **The publish gate is UNJAMMED — the #2 bottleneck from 06-20 is resolved.** The 355-draft v1-grade backlog got worked down and the auto-publisher has shipped a person nearly every day since 06-21: John-Goodman, adam-sandler, lily-allen, keith-lee, bert-kreischer, odessa-azion, megan-fox, nicki-minaj, and leonardo-da-vinci today (grade 8.6, 5,877 words). The daily pipeline is now creating AND shipping.
- **Instagram fully recovered — daily cadence is holding.** Warmups every day through 2026-07-01 plus replies (06-29). No longer "fragile"; this is the healthiest channel on the board.
- **Signups spam leak is STILL OPEN — this is now the #1 unresolved item.** `/api/signups` still has no recaptcha (confirmed: zero recaptcha reference in the server files). The bot-stuffing flagged 06-20 (75 of 79 signups spam) remains unblocked. Product code, DJ's/eng's call.
- **Quora is still DEAD — now ~43 days dark** (last session + question-log + cron all stop 2026-05-19). No change since 06-20. Decision still pending: revive or retire.
- **Growth audit did NOT run this Monday (06-29).** growth-log's newest entry is still 2026-06-20; the weekly Monday cron appears to have skipped. Growth numbers in this brief are 11 days stale.
- **Two fresh planning docs landed today:** a Tier-1 personality-analysis refresh plan (6 stale blogs to rebuild) and a candidate-scout list (new high-virality people to add, e.g. Lamine Yamal, Rosé). Both uncommitted.

## The actual work — the gate reopened; capture is now the constraint

On 06-20 the story was "the engine writes daily but ships nothing." That gate is now open. The daily people pipeline both authored and published throughout the period, so **content throughput is no longer the bottleneck.** The binding constraint has moved downstream to two places the blog engine cannot fix on its own:

1. **Lead capture is still leaking** — the signups endpoint takes bot spam with no recaptcha, so every real email is diluted and sender reputation is at risk.
2. **Distribution is idle** — 9 packets sit unfired and Quora (the old highest-cadence channel) is dark. Published blogs are landing with no amplification push behind them.

### Publish pipeline — recent daily outcomes (from `publish-people` logs)

| Date       | Published person  | Note                                        |
| ---------- | ----------------- | ------------------------------------------- |
| 2026-07-01 | leonardo-da-vinci | Grade 8.6, 5,877 words, both images present |
| 2026-06-29 | nicki-minaj       |                                             |
| 2026-06-28 | megan-fox         |                                             |
| 2026-06-27 | odessa-azion      |                                             |
| 2026-06-26 | bert-kreischer    |                                             |
| 2026-06-25 | keith-lee         |                                             |
| 2026-06-24 | lily-allen        |                                             |
| 2026-06-23 | adam-sandler      |                                             |
| 2026-06-22 | (succeeded)       |                                             |
| 2026-06-21 | John-Goodman      | Type 9 — first ship after the 06-20 jam     |
| 2026-06-20 | none selected     | The jammed run flagged in the last brief    |

Create side is also live: today's cron launched the zac-efron draft (Type 3) cleanly. Draft count on disk: **464** (was 437 on 06-20).

## Cross-surface status

### Blogs

- **People (automated):** Healthy on both ends — authoring AND publishing daily. 464 drafts on disk. A `jim-carrey-recovery` run appears in the 06-30 logs (pipeline recovery, not a failure signal). New uncommitted draft batch staged: Alex-Warren, Demi-Lovato, Ellen-DeGeneres, Jimmy-Carter, Jimmy-Fallon, Mr-Rogers, Nancy-Reagan, Queen-Elizabeth-II (a historical/wholesome cluster, aligns with the Tier-1 refresh work).
- **Pop-culture (bottleneck, barely moved):** 30 published / 21 unpublished (was 29/22 — one shipped since 06-20). The 3+-month-old Mar-2026 cluster is still sitting. No `/blog_content_publish_pop_culture` runs evident.
- **Tier-1 refresh (NEW):** `docs/content-analysis/tier1-blog-refresh-plan-2026-07-01.md` — plan to rebuild the 6 highest-priority stale personality-analysis blogs (27 of 372 published carry no content grade; 3 are 2023-ancient). Matches the standing MEMORY tier1-refresh workstream.

### Distribution

- **9 packets in `docs/distribution-assets/`, still all unfired.** Composition changed since 06-20: **steven-bartlett** and **lana-del-rey** packets now exist (bartlett's is the long-standing outreach unblock). Full set: benson-boone, chris-williamson, john-coogan, justin-bieber, lana-del-rey, shawn-ryan, steven-bartlett, tech-titans-disruptors, tim-ferriss. Pure execution work.

### Social

- **Instagram: HEALTHY.** Daily warmups through 2026-07-01, replies on 06-29. Cadence is solid and consistent — the strongest channel right now. `instagram-recovery-todo-2026-05-07.md` still on disk (stale, can be archived).
- **Quora: DEAD, ~43 days.** Sessions dir holds only README; question-log frozen at May 19; automation cron last logged May 19. Unchanged from 06-20 and getting worse by attrition.
- **Twitter:** No session log, no `/tweet`/`/twitter` commits. Dormant.

### SEO

- Quiet. corpus-stats refreshed today (pipeline-driven, uncommitted). No dedicated SEO commits this period; effort remains on people-draft authoring + the Tier-1 refresh planning.

### Growth

- **Stale — the Monday 06-29 weekly audit did not run.** growth-log newest entry is still 2026-06-20. Carrying forward those findings: signups fix works (0→79) but ~75/79 are spam; give-first wall emits `gate_shown` but still no `contribution`/`comment_submitted` event; email sends jumped to 81/wk. All 11 days old — treat as unverified drift until the audit reruns.

### Outreach

- Long-Form Network cluster (12 emails) still 0/12 sent per the rolling log. Bartlett's blog status not re-confirmed this run, but a **bartlett distribution packet now exists**, suggesting movement toward publishing him. No new outreach sends in git.

### Email

- No fresh data (growth audit stale). Standing risk unchanged: spam signups will pollute open/click metrics and sender reputation until `/api/signups` is protected.

## What changed since the last brief (2026-06-20)

- **Publish gate unjammed** — from 0/429 publishable to a person shipping nearly every day (06-21 → 07-01). Biggest positive swing on the board.
- **People drafts 437 → 464** (~27 new in 11 days); create pipeline uninterrupted.
- **Instagram graduated from "recovering" to "healthy"** — unbroken daily cadence + replies.
- **Two new planning docs** — Tier-1 refresh plan + candidate scout (Lamine Yamal, Rosé, etc.), both dated today, both uncommitted.
- **Distribution set shifted** — steven-bartlett + lana-del-rey packets added (still 9 total, still all unfired).
- **Quora still dead** (now ~43 days), signups recaptcha still absent, growth audit skipped its Monday run — three items carried forward unresolved.

## Recommendation (ranked by leverage)

1. **Add recaptcha to `/api/signups` — still the highest-leverage fix, still unresolved.** Why: an unprotected public POST is being bot-stuffed, poisoning email metrics and sender reputation, and it has now survived two briefs. Product code (`src/routes/api/signups/`) — DJ's/eng's call, not marketing-pm scope to edit. First step: scope a recaptcha-verify on the signups POST (server already verifies recaptcha elsewhere via `RECAPTCHA_SECRET_KEY`). ~30–60 min eng. Risk: none; pure hardening.
2. **Now that the gate is open, turn on distribution — the published blogs are landing silent.** Why: the pipeline ships a person daily but nothing amplifies them; 9 packets sit ready and Quora is dark. Highest-EV move is to pair each fresh publish with one distribution push. First step: DJ picks 2–3 packets to fire (bartlett + lana-del-rey are freshest and ride current-moment relevance) via their channel commands, and decides Quora's fate (revive `/quora-warmup` or formally retire). ~minutes per packet.
3. **Rerun the weekly growth audit — it skipped Monday and the numbers are 11 days stale.** Why: growth is the surface where the real constraint now lives (capture/activation), and we're flying on 06-20 data. First step: DJ runs `/weekly-growth-audit` (or checks why the Monday cron didn't fire). ~minutes. Risk: none.

## Open questions for DJ

1. **Signups recaptcha:** Approve adding recaptcha to `/api/signups`? Two briefs old now; still the active-harm fix. (Product code — needs your go.)
2. **Distribution:** The gate is open and blogs are shipping silent. Want a ranked "fire these 2–3 first" pick from the 9 packets (I'd lead with bartlett + lana-del-rey), or are packets still deprioritized?
3. **Quora:** Revive or formally retire? ~43 days dark. A dead channel that looks alive in docs is worse than a retired one.
4. **Growth audit:** The Monday 06-29 weekly audit didn't run (no new growth-log entry). Want me to flag the cron for investigation, or will you kick `/weekly-growth-audit` manually?
5. **Tier-1 refresh + candidate scout:** Both plans landed today. Want to green-light the 6-blog Tier-1 rebuild and/or seed the new candidate names (Lamine Yamal, Rosé) into the pipeline queue, or hold?

## Assumptions

- Publish-gate "unjammed" inferred from `publish-people` logs showing a named person published nearly every day 06-21→07-01; not separately reconciled against Supabase row counts.
- "Growth audit skipped Monday" inferred from growth-log's newest entry being 2026-06-20 with no 06-29 entry; the cron may have run and failed silently, or the entry may be pending.
- Quora-dead and signups-no-recaptcha carried from direct inspection this run (sessions dir empty of dated files; no recaptcha string in signups server files).
- Bartlett blog publish status not re-verified this run; the existence of a bartlett distribution packet is suggestive, not confirmation.
