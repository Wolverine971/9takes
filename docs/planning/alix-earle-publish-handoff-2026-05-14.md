<!-- docs/planning/alix-earle-publish-handoff-2026-05-14.md -->

# Alix Earle — Publish Handoff

**Date:** 2026-05-14
**Status:** Draft, fresh-eyes reviewed, not yet published
**File:** `src/blog/people/drafts/Alix-Earle.md`
**Slug:** `/personality-analysis/Alix-Earle`

## What's done

- Initial draft published to `drafts/` directory (handoff from `blog_content_creator_people`)
- Content quality graded A (overall 9.0; hook 9.2, originality 9.2)
- Fresh-eyes reader review pass incorporated on 2026-05-14:
  - **Added:** Tyler Wade as first documented merger-pattern relationship; Ashtin Earle (sister) mention; plastic surgery candor paragraph (boob job + veneers + Elle quote); brief Hot Mess podcast format description; "Hi babes" voice texture; Ashley Dupré relationship depth ("years and years of us fighting") — which also expanded the Positive Outlook reframing point
  - **Trimmed:** Princeton GEO research parenthetical (off-topic); Cooper feud reference from intro (was 4 mentions, now 3); Tom Brady from lede (kept relationship-section mention as merger evidence); Spitzer re-explanation in babysitting section; redundant clinical-Enneagram-literature sentence in DWTS section
  - **Not adopted:** sorority origin point — research could not confirm Sigma Kappa (likely Zeta per LinkedIn sleuthing, unconfirmed). Lower priority than the additions made.

## What's left to do

The article frontmatter still flags `published: false`, `ready_for_production: false`, and the following `requires` are pending:

1. **db_sync** — Push article to `blogs_famous_people` Supabase table. Run `pnpm push:people` (parses + pushes famous-people blog drafts).
2. **db_verify** — Verify the row landed correctly in `blogs_famous_people`. Spot-check title, slug, content body, metadata fields, frontmatter, and that history snapshot was written to `blogs_famous_people_history`.
3. **regenerate_famous_types** — Run `pnpm gen:famous-types` to regenerate type data so the new article appears in static type indexes and personality similarity maps.
4. **image_check** — Verify Alix Earle has a personality image at the expected path; run `pnpm gen:personality-image-map` if anything new was added.
5. **Flip publish flag** — Set `published: true` in frontmatter (and update `production_pretext.ready_for_production: true` + `status: published`).
6. **Sitemap regen** — `pnpm gen:sitemap` to add the new slug to `static/sitemap.xml`.
7. **Search index** — `pnpm index:blogs` to update the FTS index in Supabase so the article becomes searchable.
8. **Crosslinks** — `pnpm gen:crosslinks` to refresh internal cross-link report (this article links to Alex Cooper, Joe Rogan, Hailey Bieber, Type 9 and Type 6 enneagram-corner pages).

A faster path: `pnpm push:people` then `pnpm gen:all` covers most generators + index in one shot.

## Watch-outs

- **Suggestions array:** Article lists `['Alex-Cooper', 'Emma-Chamberlain', 'Hailey-Bieber', 'Addison-Rae']`. Confirm all four are live slugs before publish so related-content tiles don't 404.
- **Cooper feud recency:** The April 13, 2026 Cooper-vs-Earle feud is load-bearing in the "How Alix Earle handles a fight" section and the closing. If the situation evolves materially (resolution, new statement from either party), the section should be updated before publish. As of 2026-05-14, Alix's May 12 Today show comment ("It's exaggerated. I love everyone.") is the most recent beat.
- **Tom Brady mention:** Currently anchored to the Dec 31 / NYE 2026 St. Barths photo. If that escalates into a confirmed relationship (or definitively fizzles), the relationship-section paragraph should be revisited.
- **Tyler Wade fact check:** Article describes the Sep 2022 "Be my GF?" rose-petals proposal and "He wouldn't post me" breakup line on TikTok live. Both are well-documented (Yahoo, E!, StyleCaster, HerCampus), but a spot-check against the original TikTok live timestamp before publish is cheap insurance.
- **Plastic surgery details:** "275cc saline implants" and "ten veneers" are sourced (NewBeauty, HuffPost). Quote attribution to Elle (August 2023) is correct per Yahoo coverage.

## Provenance / source trail

Research sources used in the 2026-05-14 revision pass:

- Tyler Wade timeline: Yahoo, E! News, StyleCaster, HerCampus, Sportskeeda
- Ashtin Earle: Wikipedia, Famous Birthdays, Interview Magazine, Yahoo, HerCampus
- Plastic surgery candor: Yahoo (Elle quote), NewBeauty (breast aug details), HuffPost (veneer regret), E! News
- Hot Mess podcast format: Spotify, Apple Podcasts, iHeart show descriptions
- Ashley Dupré relationship: E! News, Today, BroBible, Yahoo

## Companion checklist

When ready to ship, the cleanest order is:

```bash
pnpm push:people                     # push to blogs_famous_people
pnpm gen:famous-types                # regenerate type data
pnpm gen:personality-image-map       # if image was added
pnpm gen:sitemap                     # add new slug
pnpm index:blogs                     # FTS index
pnpm gen:crosslinks                  # refresh crosslink report
```

Then in the file:

- Set `published: true`
- Set `production_pretext.status: published`
- Set `production_pretext.ready_for_production: true`
- Move the file out of `drafts/` per the project's publish convention (or leave per existing pipeline; check recent published examples in `src/blog/people/` for the current pattern).
