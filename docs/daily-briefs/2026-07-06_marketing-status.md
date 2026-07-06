<!-- docs/daily-briefs/2026-07-06_marketing-status.md -->

# 9takes Marketing Status — 2026-07-06

**Unattended run (marketing-pm).** DJ not present. No actions taken that require confirmation; all pending decisions routed to "Open questions for DJ." No blog drafts, `published:` flags, product code, git mutations, or external services touched. Prior status brief: `2026-07-01_marketing-status.md`.

## TL;DR

- **⚠️ STALE GROWTH DATA (last audit 2026-07-01).** Growth data is 5 days stale. The Monday audit expected before this brief did not produce a 2026-07-06 entry, so this brief does **not** present old funnel numbers as current.
- **The people pipeline lost reliability after the 07-01 win.** It shipped through 07-04, then `oliver-tree` failed on both 07-05 and 07-06 before draft creation because of API connection failures. Both runs still advanced downstream stages against a missing draft, so the old "silent cycle" failure mode is still live.
- **Signup spam hardening exists now; activation still needs fresh measurement.** Direct inspection shows `/api/signups` has honeypot, 2.5s time-trap, bot-user-agent blocks, malformed-local blocking, per-IP/per-email rate limits, auth-abuse checks, and `newsletter_signup_security_events`. There is still no recaptcha on signups, but the prior "unprotected endpoint" state is no longer accurate.
- **Instagram cadence exists, but the account layer is unreliable again.** Today's warmup is blocked: @9takesdotcom is not in the account picker. The warmup doc says 5 of the last 7 mornings blocked and only 07-01 / 07-04 fully worked.
- **Distribution and Quora are still idle.** 9 distribution packets remain queued; Quora is ~48 days dark since 2026-05-19. New 06-29 outreach assets exist for Bartlett, Ferriss, Schulz, and a Diary of a CEO Reddit reply, but no send/post evidence was observed.
- **SEO infrastructure refreshed today, but GSC is stale.** `corpus-stats.md` and `BLOG-CROSSLINK-INDEX.md` were generated 2026-07-06; GSC export is still 2026-06-11.

## The actual work — automation reliability is now the bottleneck

The 07-01 brief said the publish gate was unjammed. That was true through 07-04, but the newest logs show the automation system is fragile again. This is no longer the old grade-gate backlog; it is a reliability problem across create, publish-generation, and account-session tooling.

| Artifact / surface                                               | Observed state                                                                                                                                                                             | Why it matters                                                                                       |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `logs/blog-automation/cron-2026-07-06.log`                       | `oliver-tree` has no draft; Stage 1 failed with `API Error: Connection closed mid-response`; stages 2-7 still advanced against a missing draft.                                            | Daily people creation is not currently producing content, and failure propagation is still noisy.    |
| `logs/blog-automation/cron-2026-07-05.log`                       | Prior `oliver-tree` run failed Stage 1 with `ConnectionRefused`, then stages 2-7 advanced against a missing draft.                                                                         | Old "silent 6-hour cycle" failure mode also appeared on 07-05.                                       |
| `logs/blog-automation/publish-people-2026-07-04.log`             | Seth Rogen published, but `pnpm gen:all` failed at `pnpm gen:types` because the `supabase` CLI binary is missing from `node_modules`. Manual `gen:famous-types` + `gen:sitemap` succeeded. | Publishing can complete, but the generator chain is not clean end-to-end.                            |
| `docs/instagram/daily-engagement/2026-07-06_instagram-warmup.md` | Blocked before scan: `instagram_account_not_in_picker`.                                                                                                                                    | The strongest social channel cannot run reliably without DJ re-login or a dedicated browser profile. |
| `docs/growth/growth-log.md`                                      | Newest entry is 2026-07-01, not today.                                                                                                                                                     | Activation/capture status is stale; do not optimize against old numbers.                             |

## Tooling state

- **Blog automation:** Not healthy today. Queue file updated 2026-07-06, but the selected item (`oliver-tree`) failed twice before draft creation. `override.json` is not paused.
- **Publishing generators:** The 07-04 publish notes a missing `node_modules/supabase/bin/supabase`, breaking `pnpm gen:all` at `gen:types`. Manual downstream generators completed, but the all-in-one publish path remains dirty.
- **Instagram tooling:** Browser bridge works, but @9takesdotcom session persistence is the blocker. The warmup doc recommends a dedicated Chrome profile for @9takesdotcom.

## Cross-surface status

### Blogs

- **People pipeline:** 469 markdown files in `src/blog/people/drafts/` by frontmatter scan: 376 `published: true`, 86 `published: false`. Recent successful publish logs: Cathie Wood (07-02), Andrew Ross Sorkin (07-03), Seth Rogen (07-04). No 07-05 or 07-06 publish log observed.
- **Backlog queue:** `docs/blog-automation/backlog-queue.json` last updated 2026-07-06, with 127 unpublished / 266 published in its own source-of-truth stats. Top queue now starts Julia Fox, Madelaine Petsch, Kaia Gerber, Kiernan Shipka, Xochitl Gomez, David Beckham.
- **Pop-culture:** 51 top-level files: 30 published / 18 unpublished. Unpublished age buckets: 1 in 0-4 weeks, 5 in 1-3 months, 12 in 3+ months. The chronic stale cohort remains.
- **Other categories:** Frontmatter scan found 35 `published: false` files outside pop-culture: community 16, enneagram 9, guides 8, topical 1, life-situations 1.
- **Sitemap drift:** Pop-culture is clean after URL normalization. People has real drift: `Milly-Alcock.md` is `published: true` but missing from `static/sitemap.xml` / `famousTypes` link state; `Charlie-Puth.md`, `Elizabeth-Holmes.md`, and `Jimmy-Fallon.md` are `published: false` but still present in the sitemap and generated type index. Four published files also have frontmatter `loc` casing mismatches against the lower-case sitemap (`Charli-D'Amelio`, `Dixie-DAmelio`, `Matt-Smith`, `Tobey-Maguire`).

### Distribution

- **9 packets remain queued:** benson-boone, chris-williamson, john-coogan, justin-bieber, lana-del-rey, shawn-ryan, steven-bartlett, tech-titans-disruptors, tim-ferriss.
- Launch checklist still ranks Shawn Ryan, Chris Williamson, John Coogan, Benson Boone, Tech Titans, Justin Bieber, Tim Ferriss, Steven Bartlett, Lana Del Rey. No fired-packet evidence observed.

### Social

- **Instagram:** Not healthy today despite daily docs. `2026-07-06_instagram-warmup.md` is blocked at `instagram_account_not_in_picker`. The doc says 5 blocked mornings in the last 7 days; only 07-01 and 07-04 restored the session. Priority open loop: @enneagrampaths candy reply-to-reply has sat ~2.5 weeks.
- **Quora:** Still dead. `docs/quora/question-log.md` newest entry is 2026-05-19; `docs/quora/sessions/` only has README; `logs/quora-automation/` ends 2026-05-19. That is ~48 days dark.
- **Twitter/X:** No persistent session log observed; no current surface signal.

### SEO

- `docs/data/corpus-stats.md` generated today: 378 published profiles, 131 drafts in pipeline, 22 published in the last 30 days, 106 in the last 90 days.
- `docs/BLOG-CROSSLINK-INDEX.md` generated today: 190 posts analyzed, 26 completely isolated, 27 with zero outgoing links, 42 with zero incoming links.
- GSC data is stale: `docs/data/gsc/latest.json` run date 2026-06-11 for the 2026-05-12 to 2026-06-09 window.

### Growth

- **Stale.** Newest growth-log entry is 2026-07-01. Last known audit headline was "signup spam is suppressed, but real activation went quiet again," but that is **not current data** for 2026-07-06.
- Direct code inspection confirms signup hardening exists; a fresh growth audit is needed to verify whether the hardening protected signup quality and whether real capture/activation recovered.

### Outreach

- New 2026-06-29 assets exist: Steven Bartlett cold email, Tim Ferriss cold email, Andrew Schulz cold email, and a Diary of a CEO Reddit reply.
- Long-Form Network email table still reads as staged/drafted; no send evidence observed. The 12-email cluster remains a DJ-triggered action, not something to fire unattended.

### Email

- Reactivation docs remain partially implemented / draft-state on disk. `src/lib/email/reactivation-sequence-content.ts` exists, but this run did not audit code behavior or query live sequence metrics.
- Because growth data is stale, no current claim about opens, clicks, active enrollments, or signup quality should be made from this brief.

## What changed since the last brief (2026-07-01)

- **Growth freshness improved once, then went stale again.** A make-up audit landed 2026-07-01, but there is no 2026-07-06 audit entry.
- **Signup status corrected:** the prior "no recaptcha/unprotected endpoint" shorthand is incomplete now. There is still no recaptcha on signups, but layered anti-spam hardening is present in code.
- **People automation regressed:** successful publishes through 07-04, then 07-05/07-06 `oliver-tree` failures before draft creation.
- **Instagram regressed:** 07-01 and 07-04 were healthy, but 07-06 is blocked again and the latest doc says the account picker issue is now chronic.
- **SEO docs refreshed today:** corpus stats and cross-link index are current as of 2026-07-06; GSC remains 25 days old.
- **Outreach assets expanded:** 06-29 one-off outreach drafts exist for Bartlett, Ferriss, Schulz, plus the Diary of a CEO Reddit reply.

## Recommendation (ranked by leverage)

1. **Stabilize the content automation before adding more volume.** Why: the people engine just produced two consecutive no-draft runs for the same target, and 07-04 exposed a broken `gen:all` dependency. First step for DJ/eng: fix the API connection failure path and ensure the pipeline hard-stops whenever Stage 1 fails; then fix/reinstall the missing Supabase CLI dependency if `pnpm gen:all` is expected to pass. Expected effort: 30-90 minutes. Visible risk: low if scoped to tooling, high if ignored because the pipeline burns cycles and ships nothing.
2. **Restore @9takesdotcom Instagram session durability.** Why: Instagram had become the healthiest channel, but 5/7 recent mornings were blocked. First step: DJ manually re-adds @9takesdotcom and moves it to a dedicated Chrome profile; next successful warmup clears the @enneagrampaths owed reply first. Expected effort: 10-20 minutes. Visible risk: none, credential/session work only DJ can do.
3. **Run a fresh growth audit before deciding activation work.** Why: code inspection says signup hardening exists, but activation/capture state is stale. First step: run `/weekly-growth-audit` or inspect why the Monday automation did not append 2026-07-06. Expected effort: minutes if credentials are ready. Visible risk: none; without it, marketing decisions are flying on 5-day-old data.

## Open questions for DJ

1. **Oliver Tree / blog automation:** Do you want the pipeline retried for `oliver-tree` after the API issue is addressed, or should the queue advance to Julia Fox?
2. **Automation tooling:** Should the current `scripts/run-blog-pipeline.sh` uncommitted change be treated as the fix for the Stage-1 hard-stop problem, or is that unrelated work by another agent?
3. **Instagram:** Can you re-login @9takesdotcom and/or move it to a dedicated Chrome profile so warmups stop losing the account?
4. **Growth audit:** Should the Monday growth audit be kicked manually today, or should the cron be investigated first?
5. **Distribution:** Once automation is stable, do you want to fire the freshest ready packets first (Steven Bartlett, Tim Ferriss, Lana Del Rey), or keep distribution paused?
6. **Quora:** Revive or retire? The channel is now ~48 days dark.

## Assumptions

- File counts are from frontmatter scans on disk, not live database counts.
- "Distribution unfired" means no send/post evidence was found in the default repo surfaces; external channels were not queried.
- No product behavior was tested live. Product-code reads were limited to confirming signup hardening exists.
