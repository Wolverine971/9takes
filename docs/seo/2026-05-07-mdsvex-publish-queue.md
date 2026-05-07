<!-- docs/seo/2026-05-07-mdsvex-publish-queue.md -->

# MDsvex Publishing Queue (2026-05-07)

Runbook for clearing the unpublished MDsvex backlog at **1 MDsvex / day** (paired with 1 personality-analysis / day from the existing daily-blog-creator cron).

## Context

The 2026-05-06 SEO research pass flagged "75 missing sitemap URLs." Ground-truth audit on 2026-05-07 showed the real backlog is smaller and more bimodal:

- **8 files publish-as-is** (or after a 2-min frontmatter/picGroup fix)
- **2 files need a light edit** (~30 min each) — sensitive topics
- **11 files are skeletons** with TODO body sections, not finished drafts (heavy rewrite required)
- **2 files should likely be killed** (off-brand or legal-risk without thesis)
- **6 files are not blogs** (templates, tweet drafts, fact-check working docs, source material)

The sitemap script (`scripts/generate-sitemap.js:846`) correctly gates on `metadata.published`. **The fix is content quality, not a script change.**

## Per-day publish plan (Tier A: ready)

Pair each MDsvex publish with the personality-analysis daily cron (Tue 2026-05-07 = `gal-gadot` next per the cron log).

| Date          | MDsvex publish                                                     | Pre-publish action                                          |
| ------------- | ------------------------------------------------------------------ | ----------------------------------------------------------- |
| 2026-05-07 ✅ | `pop-culture/tech-titans-leadership-styles`                        | Done. Hub link verified live; flipped published:true.       |
| 2026-05-08    | `pop-culture/depp-vs-heard-enneagram-analysis`                     | None — strongest piece in batch (9.8/10 avg).               |
| 2026-05-09    | `pop-culture/succession-personality-trap`                          | Fix picGroup label/image mismatches (Buffett→Gates etc).    |
| 2026-05-10    | `pop-culture/kardashian-family-enneagram-analysis`                 | Optional: expand picGroup beyond Kim/Kourtney.              |
| 2026-05-11    | `pop-culture/alex-cooper-alix-earle-beef-enneagram-analysis`       | None — agent gave 9.8/10 avg, no issues.                    |
| 2026-05-12    | `pop-culture/world-leaders-enneagram-personality-dynamics`         | Reconcile Trump frontmatter Type 3 vs body Type 8.          |
| 2026-05-13    | `pop-culture/us-presidents-enneagram-analysis`                     | Add 1-2 source links to Iran strike + SCOTUS claims.        |
| 2026-05-14    | `guides/enneagram-hidden-strengths-and-gifts`                      | Fill empty `pic:` field with referenced webp.               |
| 2026-05-15    | `pop-culture/cancel-culture-enneagram-type` (after light edit)     | Add 2-3 named cancellation cases; replace fictional opener. |
| 2026-05-16+   | `pop-culture/aoc-and-the-squad-enneagram-types` (after sens. edit) | Hold for slow news week. Sensitivity polish.                |

## Per-publish checklist

For each MDsvex publish:

1. Apply the per-file fix from the table above.
2. Update frontmatter: `published: true` and `lastmod: '<today>'` (leave `date` as-authored).
3. Commit with message `publish(pop-culture): <slug>` or `publish(guides): <slug>`.
4. Run `pnpm gen:sitemap` (or rely on `pnpm build:vercel`).
5. Run `pnpm index:blogs` to sync into Supabase FTS.
6. Optional: `/distribute` for Instagram/Twitter assets on the higher-priority pieces.

## Tier B — Light edit (publishes after editing)

| File                                            | Editor TODO                                                                                                                                                                                                                                      |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pop-culture/cancel-culture-enneagram-type`     | Add 2-3 named real cancellations mapped to Type 1/6/8 instigators; replace fictional "tweet was three years old" opener; tighten "How to Survive" so it doesn't read as advice for offenders.                                                    |
| `pop-culture/aoc-and-the-squad-enneagram-types` | Add a parallel "right-side analog" sentence to lock in non-partisan framing; soften or contextualize Pressley sexual abuse mention; verify Pelosi "just four people" quote + Trump "go back" tweet attribution; stronger non-endorsement closer. |

## Tier C — Heavy rewrite backlog (skeletons, all `published: false` at root)

These have frontmatter, hook, table, and rabbit-holes generated, but the body sections are HTML TODO comments. Need full prose drafts before triage. **Leave at root with `published: false`** (the user's call — sitemap correctly excludes them).

Ranked by SEO impact + urgency:

1. `pop-culture/oscar-contenders-enneagram-analysis` — **time-urgent** (loses thesis after 2026 Oscars cycle); rebrand to "Oscar winners" if benched past awards season.
2. `pop-culture/tech-titans-paypal-mafia` — high SEO value, ties to Type 5 corpus stat.
3. `pop-culture/tech-titans-disruptors` — Type 8 angle, complements leadership-styles already published.
4. `pop-culture/silicon-valley-power-players-enneagram-analysis` — All-In Pod hosts; cultural moment.
5. `pop-culture/streaming-royalty-enneagram-analysis` — Internet/creator gap.
6. `pop-culture/marvel-universe-enneagram-analysis` — high search volume; cinema gap (only 3 cinema files exist).
7. `pop-culture/pop-queens-enneagram-analysis` — music gap (only 1 music file); fresh-eyes review embedded in file flags 3-Type-3 problem + SZA omission.
8. `pop-culture/royal-family-enneagram-analysis` — evergreen.
9. `pop-culture/online-gurus-enneagram-analysis` — Hormozi/Gary Vee/Huberman — needs evidence.
10. `community/edgy-rebellion-new-punk` — outline only; **retitle required** before publish (current title invites screenshot-attack; agent recommended "Why Transgression Switched Sides").

## Tier D — Kill or rewrite-with-thesis

| File                                                       | Verdict         | Reason                                                                                                                                                                |
| ---------------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pop-culture/onlyfans-creators-enneagram-digital-intimacy` | KILL or rewrite | Generic listicle, no named creators, no sourced research. Off-brand for "tactically direct, evidence-based" voice. Sex-work topic without evidence = moralizing risk. |
| `pop-culture/epstein-web-of-manipulation`                  | KILL or rewrite | Title promises Enneagram analysis; body is a generic manipulation explainer. Under 1500 words. Highest legal/reputational risk in the batch.                          |

Bench-decision recommendation: kill both unless DJ commits to a full thesis-driven rewrite (e.g., for OnlyFans: actual interviews/research; for Epstein: the type-by-type breakdown of Maxwell + how each type is targeted by the playbook).

## Tier E — Not blogs (left in place per current call)

These are `published: false` and gated by the sitemap script, so they don't ship. Future cleanup option: move to appropriate non-`/blog` locations, but not urgent.

| File                                                      | What it actually is                                      | Future home                                    |
| --------------------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------- |
| `community/societal-ticking-time-bombs-fact-check.md`     | Fact-checker patch list for the parent blog              | `docs/fact-checks/`                            |
| `guides/personality-maxing-notes.md`                      | Revision notes for `90-day-personality-maxing-blueprint` | `docs/planning/`                               |
| `pop-culture/template.md`                                 | Empty template stub                                      | Delete (or leave; harmless)                    |
| `pop-culture/tech-titans-founders-vs-stewards-twitter.md` | Tweet drafts                                             | `docs/twitter/drafts/` or `/distribute` output |
| `pop-culture/tech-titans-ai-wars-twitter.md`              | Tweet drafts                                             | Same                                           |
| `pop-culture/incel-exit-post.md`                          | Reddit source material + analysis (working doc)          | `docs/planning/blog-research/`                 |

## What this queue does NOT cover

- The **32 personality-analysis drafts ready to flip `link:true`** (Anna Wintour, Brené Brown, Hayao Miyazaki, etc.) — those are handled by the existing `daily-blog-creator` cron at 1/day.
- The **27 brand-new people drafts** not yet in `famousTypes.ts` — same cron pipeline.
- The **9 type-pillar page upgrades** with corpus-stat callouts (Quick Win #2 from the master cluster map). Separate engineering task.
- The **sitemap script audit** — confirmed not needed; script correctly gates on `published: true`.

## Refresh

Re-rank Tier C as drafts get fleshed out. Re-rank Tier A if a new cluster strategy bumps something. Update after each Tier A publish.
