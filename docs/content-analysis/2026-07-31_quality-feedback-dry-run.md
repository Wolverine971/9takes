<!-- docs/content-analysis/2026-07-31_quality-feedback-dry-run.md -->

# T-10 QUALITY_FEEDBACK removal dry run

**Generated:** 2026-07-31  
**Mode:** No blog source writes  
**Approval received:** DJ approved starting Rank 2 on 2026-07-31  
**Matched:** 78 files / 78 opening markers / 78 closing markers; all 78 currently published  
**Patch validation:** `git apply --check` passes against the current worktree  
**Current frontmatter baselines:** 85 files with flat `quality_*` keys; 458 files with `content_quality:`

This replaces the stale 86-file July 15 dry run. Eight of those blocks were removed incidentally by later per-file work, so the old patch must not be applied. The proposed patch removes only each delimited HTML comment plus the blank line immediately after it. It does not edit frontmatter, visible body text, or `lastmod`.

- Full preserved feedback: `docs/content-analysis/2026-07-15_quality-feedback-salvage.md`
- Full current proposed patch: `docs/content-analysis/2026-07-31_quality-feedback-removal.diff`
- Previous dry run, retained for history: `docs/content-analysis/2026-07-15_quality-feedback-dry-run.md`
- Dirty target overlap at generation time: none

## Files cleared since the previous dry run

- `src/blog/enneagram/biggest-compliments-to-give-each-enneagram-type.md`
- `src/blog/enneagram/enneagram-type-1.md`
- `src/blog/enneagram/enneagram-type-2.md`
- `src/blog/enneagram/enneagram-types-in-relationships.md`
- `src/blog/enneagram/enneagram-types-in-stress.md`
- `src/blog/enneagram/enneagram-types-on-a-first-date.md`
- `src/blog/enneagram/first-impression-enneagram-playbook.md`
- `src/blog/enneagram/why-therapy-doesnt-work-the-same-for-every-type.md`

## Proposed file and line ranges

|   # | File                                                                             | Published |                   Lines removed |
| --: | -------------------------------------------------------------------------------- | :-------: | ------------------------------: |
|   1 | `src/blog/enneagram/90-day-personality-maxing-blueprint.md`                      |    yes    | 23-29 plus following blank line |
|   2 | `src/blog/enneagram/anxiety-and-enneagram-types-guide.md`                        |    yes    | 23-29 plus following blank line |
|   3 | `src/blog/enneagram/attachment-styles-and-enneagram-types.md`                    |    yes    | 24-30 plus following blank line |
|   4 | `src/blog/enneagram/beginners-guide-to-determining-your-enneagram-type.md`       |    yes    | 23-29 plus following blank line |
|   5 | `src/blog/enneagram/enneagram-and-adhd-which-types-struggle-most.md`             |    yes    | 24-30 plus following blank line |
|   6 | `src/blog/enneagram/enneagram-and-mental-illness.md`                             |    yes    | 23-29 plus following blank line |
|   7 | `src/blog/enneagram/enneagram-and-religion.md`                                   |    yes    | 23-29 plus following blank line |
|   8 | `src/blog/enneagram/enneagram-anxiety-management-guide.md`                       |    yes    | 25-31 plus following blank line |
|   9 | `src/blog/enneagram/enneagram-books-websites-podcasts.md`                        |    yes    | 24-30 plus following blank line |
|  10 | `src/blog/enneagram/enneagram-childhood-stereotypes.md`                          |    yes    | 23-29 plus following blank line |
|  11 | `src/blog/enneagram/enneagram-coach-toolkit.md`                                  |    yes    | 24-30 plus following blank line |
|  12 | `src/blog/enneagram/enneagram-communication-guide.md`                            |    yes    | 23-29 plus following blank line |
|  13 | `src/blog/enneagram/enneagram-communication-styles.md`                           |    yes    | 23-29 plus following blank line |
|  14 | `src/blog/enneagram/enneagram-communication-tips.md`                             |    yes    | 23-29 plus following blank line |
|  15 | `src/blog/enneagram/enneagram-compatibility-guide.md`                            |    yes    | 24-30 plus following blank line |
|  16 | `src/blog/enneagram/enneagram-compatibility-matrix.md`                           |    yes    | 36-42 plus following blank line |
|  17 | `src/blog/enneagram/enneagram-concepts.md`                                       |    yes    | 23-29 plus following blank line |
|  18 | `src/blog/enneagram/enneagram-connecting-lines.md`                               |    yes    | 23-29 plus following blank line |
|  19 | `src/blog/enneagram/enneagram-criticisms.md`                                     |    yes    | 23-29 plus following blank line |
|  20 | `src/blog/enneagram/enneagram-dating-guide-for-women.md`                         |    yes    | 23-29 plus following blank line |
|  21 | `src/blog/enneagram/enneagram-faqs.md`                                           |    yes    | 25-31 plus following blank line |
|  22 | `src/blog/enneagram/enneagram-influences.md`                                     |    yes    | 23-29 plus following blank line |
|  23 | `src/blog/enneagram/enneagram-instinctual-subtypes.md`                           |    yes    | 23-29 plus following blank line |
|  24 | `src/blog/enneagram/enneagram-leadership.md`                                     |    yes    | 23-29 plus following blank line |
|  25 | `src/blog/enneagram/enneagram-mental-health-flags.md`                            |    yes    | 23-29 plus following blank line |
|  26 | `src/blog/enneagram/enneagram-parenting-styles.md`                               |    yes    | 25-31 plus following blank line |
|  27 | `src/blog/enneagram/enneagram-party-planner.md`                                  |    yes    | 23-29 plus following blank line |
|  28 | `src/blog/enneagram/enneagram-personal-growth.md`                                |    yes    | 23-29 plus following blank line |
|  29 | `src/blog/enneagram/enneagram-positive-self-talk.md`                             |    yes    | 25-31 plus following blank line |
|  30 | `src/blog/enneagram/enneagram-self-development.md`                               |    yes    | 23-29 plus following blank line |
|  31 | `src/blog/enneagram/enneagram-strengths-and-weaknesses.md`                       |    yes    | 24-30 plus following blank line |
|  32 | `src/blog/enneagram/enneagram-stress-number.md`                                  |    yes    | 23-29 plus following blank line |
|  33 | `src/blog/enneagram/enneagram-team-diversity.md`                                 |    yes    | 23-29 plus following blank line |
|  34 | `src/blog/enneagram/enneagram-team-dynamics.md`                                  |    yes    | 23-29 plus following blank line |
|  35 | `src/blog/enneagram/enneagram-test-comparison-2025.md`                           |    yes    | 24-30 plus following blank line |
|  36 | `src/blog/enneagram/enneagram-tldr.md`                                           |    yes    | 23-29 plus following blank line |
|  37 | `src/blog/enneagram/enneagram-type-3.md`                                         |    yes    | 23-29 plus following blank line |
|  38 | `src/blog/enneagram/enneagram-type-4.md`                                         |    yes    | 23-29 plus following blank line |
|  39 | `src/blog/enneagram/enneagram-type-5.md`                                         |    yes    | 23-29 plus following blank line |
|  40 | `src/blog/enneagram/enneagram-type-6.md`                                         |    yes    | 23-29 plus following blank line |
|  41 | `src/blog/enneagram/enneagram-type-7.md`                                         |    yes    | 23-29 plus following blank line |
|  42 | `src/blog/enneagram/enneagram-type-8.md`                                         |    yes    | 23-29 plus following blank line |
|  43 | `src/blog/enneagram/enneagram-type-9.md`                                         |    yes    | 23-29 plus following blank line |
|  44 | `src/blog/enneagram/enneagram-types-and-career-choices.md`                       |    yes    | 23-29 plus following blank line |
|  45 | `src/blog/enneagram/enneagram-types-at-party.md`                                 |    yes    | 23-29 plus following blank line |
|  46 | `src/blog/enneagram/enneagram-types-being-ghosted.md`                            |    yes    | 23-29 plus following blank line |
|  47 | `src/blog/enneagram/enneagram-types-working-in-teams.md`                         |    yes    | 23-29 plus following blank line |
|  48 | `src/blog/enneagram/enneagram-vs-meyers-briggs.md`                               |    yes    | 22-28 plus following blank line |
|  49 | `src/blog/enneagram/enneagram-wings-complete-guide.md`                           |    yes    | 24-30 plus following blank line |
|  50 | `src/blog/enneagram/enneagram-workplace-team-building.md`                        |    yes    | 23-29 plus following blank line |
|  51 | `src/blog/enneagram/how-each-enneagram-flexes.md`                                |    yes    | 23-29 plus following blank line |
|  52 | `src/blog/enneagram/how-each-enneagram-type-manipulates.md`                      |    yes    | 23-29 plus following blank line |
|  53 | `src/blog/enneagram/how-each-enneagram-type-self-sabotages-success.md`           |    yes    | 23-29 plus following blank line |
|  54 | `src/blog/enneagram/how-each-enneagram-type-unwinds.md`                          |    yes    | 23-29 plus following blank line |
|  55 | `src/blog/enneagram/how-to-apologize-like-a-pro.md`                              |    yes    | 23-29 plus following blank line |
|  56 | `src/blog/enneagram/how-to-navigate-early-relationship-stages.md`                |    yes    | 23-29 plus following blank line |
|  57 | `src/blog/enneagram/how-type-8-challengers-actually-succeed.md`                  |    yes    | 24-30 plus following blank line |
|  58 | `src/blog/enneagram/love-languages-and-enneagram-types.md`                       |    yes    | 24-30 plus following blank line |
|  59 | `src/blog/enneagram/mental-health/enneagram-addiction-recovery-guide.md`         |    yes    | 24-31 plus following blank line |
|  60 | `src/blog/enneagram/mental-health/enneagram-crisis-management-guide.md`          |    yes    | 23-29 plus following blank line |
|  61 | `src/blog/enneagram/mental-health/enneagram-medication-mental-health.md`         |    yes    | 44-51 plus following blank line |
|  62 | `src/blog/enneagram/mental-health/enneagram-neurodivergence-guide.md`            |    yes    | 25-32 plus following blank line |
|  63 | `src/blog/enneagram/mental-health/enneagram-parenting-mental-health.md`          |    yes    | 24-31 plus following blank line |
|  64 | `src/blog/enneagram/mental-health/enneagram-therapy-guide.md`                    |    yes    | 24-31 plus following blank line |
|  65 | `src/blog/enneagram/mental-health/enneagram-trauma-response-guide.md`            |    yes    | 24-31 plus following blank line |
|  66 | `src/blog/enneagram/mental-health/enneagram-workplace-mental-health.md`          |    yes    | 25-31 plus following blank line |
|  67 | `src/blog/enneagram/oversharing-psychology-shame-boundaries.md`                  |    yes    | 23-29 plus following blank line |
|  68 | `src/blog/enneagram/personality-maxing.md`                                       |    yes    | 23-29 plus following blank line |
|  69 | `src/blog/enneagram/philosophy-psychology-and-the-enneagram.md`                  |    yes    | 23-29 plus following blank line |
|  70 | `src/blog/enneagram/red-flags-dating-each-enneagram-type.md`                     |    yes    | 23-29 plus following blank line |
|  71 | `src/blog/enneagram/relationship-communication-guide.md`                         |    yes    | 23-29 plus following blank line |
|  72 | `src/blog/enneagram/shadow-work-by-enneagram-type.md`                            |    yes    | 24-30 plus following blank line |
|  73 | `src/blog/enneagram/situations-change-emotions-dont.md`                          |    yes    | 23-29 plus following blank line |
|  74 | `src/blog/enneagram/toxic-traits-of-each-enneagram-type.md`                      |    yes    | 23-29 plus following blank line |
|  75 | `src/blog/enneagram/toxic-traits-relationships-warning-signs.md`                 |    yes    | 23-29 plus following blank line |
|  76 | `src/blog/enneagram/why-dating-apps-are-harder-for-certain-personality-types.md` |    yes    | 24-30 plus following blank line |
|  77 | `src/blog/enneagram/why-the-next-thing-wont-fix-it-type-7.md`                    |    yes    | 24-30 plus following blank line |
|  78 | `src/blog/enneagram/why-you-cant-stop-overthinking-enneagram.md`                 |    yes    | 23-29 plus following blank line |

## Required approval before write

Review the full `.diff` artifact. If approved, apply its 78 deletions in reviewable batches, promote the historical marker from warning to failure in `scripts/blog-lint.sh`, then verify zero source/build markers, unchanged visible content, unchanged frontmatter counts, unchanged `lastmod`, and a fresh production build.
