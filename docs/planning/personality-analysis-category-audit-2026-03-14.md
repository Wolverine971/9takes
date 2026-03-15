<!-- docs/planning/personality-analysis-category-audit-2026-03-14.md -->

# Personality Analysis Category Audit

_Last updated: 2026-03-14_

## Goal

Audit `src/blog/people/drafts/*.md` against the current category hub map in `src/lib/personalityCategories.ts`, using the older people taxonomy as a secondary reference.

This audit is focused on category-page coverage first:

1. Which people do not land in any current hub
2. Which people are missing a hub they previously implied in the legacy taxonomy
3. Which people still land in the right hub, but have weaker raw tags than the legacy structure suggests

## Sources Used

- `docs/planning/personality-analysis-category-index-plan.md`
- `src/lib/personalityCategories.ts`
- `src/blog/people/drafts/*.md`
- legacy `src/blog/people/<folder>/<slug>.md` paths from git history

## Method

For each current draft:

1. Read the `type[]` frontmatter
2. Derive current hub membership from the live hub map
3. Look up any older people-folder matches in git history
4. Convert legacy folder names into the closest raw tags
5. Compare current hub membership vs legacy-implied hub membership

Important limitation:

- Legacy folder evidence is helpful, but not absolute truth. It is strongest when it points to a missing broad hub.
- When legacy evidence only suggests a more precise raw tag inside the same broad hub, that is treated as lower-priority cleanup.

## First-Pass Status

An additive metadata cleanup pass has already been applied after this audit was written.

Current state after the first pass:

- No current hub coverage: `1`
- Missing broad hub vs legacy taxonomy: `0`
- Raw-tag precision gaps inside the same hub: `1`
- Unmapped secondary tags still present: `3`

Resolved in the first pass:

- `Dave-Chappelle`: added `celebrity`
- `Kim-Kardashian`: added `creator`
- `Kylie-Jenner`: added `lifestyleInfluencer`
- `Madison-Beer`: added `lifestyleInfluencer`
- `Tim-Robinson`: already had the needed `comedian` tag by the time edits began
- `Abraham-Lincoln`: added `politician`
- `Tony-Robbins`: replaced placeholder `other` with `creator`, `entrepreneur`
- `Addison-Rae`: added `tiktoker`
- `Amy-Poehler`: added `movieStar`
- `Bella-Poarch`: added `tiktoker`
- `Emma-Stone`: added `movieStar`
- `Emma-Watson`: added `newMovieStar`
- `Henry-Cavill`: added `movieStar`
- `James-Charles`: added `lifestyleInfluencer`
- `Princess-Diana`: added `politician`
- `Robert-Pattinson`: added `newMovieStar`
- `Sydney-Sweeney`: added `celebrity`
- `Timothee-Chalamet`: added `movieStar`
- `Zendaya`: added `movieStar`

Still unresolved after the first pass:

- `Cristiano-Ronaldo`: still only `athlete`, because the current hub model does not yet have a sports bucket
- `PewDiePie`: legacy history suggests `tiktoker`, but that tag is not clearly defensible and should stay a manual decision
- `Andrew-Tate` keeps unmapped `sports`
- `Taylor-Swift` keeps unmapped `cultural icon`

## Summary

- Drafts audited: `182`
- No current hub coverage: `2`
- Missing broad hub vs legacy taxonomy: `5`
- Raw-tag precision gaps inside the same hub: `14`
- Unmapped secondary tags still present: `4`

## Priority 1: No Hub Coverage

These people do not appear in any current `/personality-analysis/categories/[slug]` hub.

| Person              | Current raw tags | Problem                                                                                                         | Recommendation                                                                                                        |
| ------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `Cristiano-Ronaldo` | `['athlete']`    | `athlete` is intentionally outside the current hub map, so this profile is orphaned from category browse pages. | Decide whether to leave him outside hubs until a future sports hub exists, or manually assign a secondary browse tag. |
| `Tony-Robbins`      | `['other']`      | `other` is outside the current hub map, so this profile is also orphaned.                                       | Manual review. `other` is too weak for browse pages.                                                                  |

File references:

- [Cristiano-Ronaldo.md](/Users/djwayne/9takes/src/blog/people/drafts/Cristiano-Ronaldo.md#L14)
- [Tony-Robbins.md](/Users/djwayne/9takes/src/blog/people/drafts/Tony-Robbins.md#L14)

## Priority 2: Missing Broad Hub Membership

These are the strongest actionable fixes. The current tags place the person in fewer broad hubs than the older taxonomy suggests.

| Person           | Current raw tags | Current hubs    | Legacy evidence                  | Missing hub     | Recommended tag addition  |
| ---------------- | ---------------- | --------------- | -------------------------------- | --------------- | ------------------------- |
| `Dave-Chappelle` | `['comedian']`   | `comedy`        | legacy `celebrities`             | `film-tv`       | add `celebrity`           |
| `Kim-Kardashian` | `['celebrity']`  | `film-tv`       | legacy `celebrities`, `creators` | `creator-media` | add `creator`             |
| `Kylie-Jenner`   | `['celebrity']`  | `film-tv`       | legacy `lifestyle-influencers`   | `creator-media` | add `lifestyleInfluencer` |
| `Madison-Beer`   | `['musician']`   | `music`         | legacy `lifestyle-influencers`   | `creator-media` | add `lifestyleInfluencer` |
| `Tim-Robinson`   | `['creator']`    | `creator-media` | legacy `commedians`              | `comedy`        | add `comedian`            |

File references:

- [Dave-Chappelle.md](/Users/djwayne/9takes/src/blog/people/drafts/Dave-Chappelle.md#L14)
- [Kim-Kardashian.md](/Users/djwayne/9takes/src/blog/people/drafts/Kim-Kardashian.md#L13)
- [Kylie-Jenner.md](/Users/djwayne/9takes/src/blog/people/drafts/Kylie-Jenner.md#L14)
- [Madison-Beer.md](/Users/djwayne/9takes/src/blog/people/drafts/Madison-Beer.md#L14)
- [Tim-Robinson.md](/Users/djwayne/9takes/src/blog/people/drafts/Tim-Robinson.md#L13)

## Priority 3: Raw-Tag Precision Cleanup

These people already land in the correct broad hub, but the older taxonomy suggests their raw tags could be more precise. This matters less for hub pages, but still affects related-post logic and future filtering.

| Person              | Current raw tags          | Suggested addition/refinement from legacy taxonomy                   |
| ------------------- | ------------------------- | -------------------------------------------------------------------- |
| `Abraham-Lincoln`   | `['historical']`          | add `politician`                                                     |
| `Addison-Rae`       | `['creator', 'musician']` | add `tiktoker`                                                       |
| `Amy-Poehler`       | `['celebrity']`           | add `movieStar`                                                      |
| `Bella-Poarch`      | `['creator']`             | add `tiktoker`                                                       |
| `Emma-Stone`        | `['newMovieStar']`        | add `movieStar`                                                      |
| `Emma-Watson`       | `['celebrity']`           | add `newMovieStar`                                                   |
| `Henry-Cavill`      | `['celebrity']`           | add `movieStar`                                                      |
| `James-Charles`     | `['creator']`             | add `lifestyleInfluencer`                                            |
| `PewDiePie`         | `['creator']`             | add `tiktoker` only if you still want that legacy grouping preserved |
| `Princess-Diana`    | `['historical']`          | add `politician`                                                     |
| `Robert-Pattinson`  | `['movieStar']`           | add `newMovieStar`                                                   |
| `Sydney-Sweeney`    | `['newMovieStar']`        | add `celebrity`                                                      |
| `Timothee-Chalamet` | `['newMovieStar']`        | add `movieStar`                                                      |
| `Zendaya`           | `['newMovieStar']`        | add `movieStar`                                                      |

File references:

- [Abraham-Lincoln.md](/Users/djwayne/9takes/src/blog/people/drafts/Abraham-Lincoln.md#L12)
- [Addison-Rae.md](/Users/djwayne/9takes/src/blog/people/drafts/Addison-Rae.md#L13)
- [Amy-Poehler.md](/Users/djwayne/9takes/src/blog/people/drafts/Amy-Poehler.md#L12)
- [Bella-Poarch.md](/Users/djwayne/9takes/src/blog/people/drafts/Bella-Poarch.md#L13)
- [Emma-Stone.md](/Users/djwayne/9takes/src/blog/people/drafts/Emma-Stone.md#L14)
- [Emma-Watson.md](/Users/djwayne/9takes/src/blog/people/drafts/Emma-Watson.md#L14)
- [Henry-Cavill.md](/Users/djwayne/9takes/src/blog/people/drafts/Henry-Cavill.md#L14)
- [James-Charles.md](/Users/djwayne/9takes/src/blog/people/drafts/James-Charles.md#L14)
- [PewDiePie.md](/Users/djwayne/9takes/src/blog/people/drafts/PewDiePie.md#L14)
- [Princess-Diana.md](/Users/djwayne/9takes/src/blog/people/drafts/Princess-Diana.md#L12)
- [Robert-Pattinson.md](/Users/djwayne/9takes/src/blog/people/drafts/Robert-Pattinson.md#L14)
- [Sydney-Sweeney.md](/Users/djwayne/9takes/src/blog/people/drafts/Sydney-Sweeney.md#L13)
- [Timothee-Chalamet.md](/Users/djwayne/9takes/src/blog/people/drafts/Timothee-Chalamet.md#L14)
- [Zendaya.md](/Users/djwayne/9takes/src/blog/people/drafts/Zendaya.md#L13)

## Unmapped Secondary Tags

These tags are still not represented in the current hub model.

| Person              | Current raw tags                                | Unmapped tag    | Note                                                                   |
| ------------------- | ----------------------------------------------- | --------------- | ---------------------------------------------------------------------- |
| `Andrew-Tate`       | `['creator', 'sports']`                         | `sports`        | Still appears in `creator-media`, so this is not a browse blocker.     |
| `Cristiano-Ronaldo` | `['athlete']`                                   | `athlete`       | Browse blocker because there is no mapped hub.                         |
| `Taylor-Swift`      | `['musician', 'entrepreneur', 'cultural icon']` | `cultural icon` | Not a blocker because she already maps to `music` and `tech-business`. |
| `Tony-Robbins`      | `['other']`                                     | `other`         | Browse blocker because there is no mapped hub.                         |

File references:

- [Andrew-Tate.md](/Users/djwayne/9takes/src/blog/people/drafts/Andrew-Tate.md#L14)
- [Cristiano-Ronaldo.md](/Users/djwayne/9takes/src/blog/people/drafts/Cristiano-Ronaldo.md#L14)
- [Taylor-Swift.md](/Users/djwayne/9takes/src/blog/people/drafts/Taylor-Swift.md#L13)
- [Tony-Robbins.md](/Users/djwayne/9takes/src/blog/people/drafts/Tony-Robbins.md#L14)

## Recommended Fix Order

1. Fix the `5` missing broad-hub profiles first.
2. Decide what to do with the `2` no-hub profiles.
3. Clean up the `14` raw-tag precision cases if you still want legacy granularity preserved for related-post logic.
4. Leave unmapped secondary tags alone unless you plan to introduce a future sports/athletes hub.

## High-Confidence Batch

If you want a conservative first pass, these additions are the clearest:

- `Dave-Chappelle`: add `celebrity`
- `Kim-Kardashian`: add `creator`
- `Kylie-Jenner`: add `lifestyleInfluencer`
- `Madison-Beer`: add `lifestyleInfluencer`
- `Tim-Robinson`: add `comedian`
- `Abraham-Lincoln`: add `politician`
- `Princess-Diana`: add `politician`
- `Emma-Watson`: add `newMovieStar`
- `Henry-Cavill`: add `movieStar`
- `Zendaya`: add `movieStar`
- `Timothee-Chalamet`: add `movieStar`

## Notes

- This audit is intentionally additive. In most cases, the safer move is to add a missing raw tag rather than replace the existing one.
- The broad hub architecture in `src/lib/personalityCategories.ts` looks mostly sound. The main debt is in the source `type[]` tags, not the hub definitions.
