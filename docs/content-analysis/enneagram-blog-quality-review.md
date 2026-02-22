<!-- docs/content-analysis/enneagram-blog-quality-review.md -->

# Enneagram Blog Quality Review

Generated: 2026-02-22
Scope: published Enneagram blogs with `blog:true` and `published:true` in `src/blog/enneagram/` (excluding explicitly out-of-scope artifacts).
Rubric: `docs/content-analysis/enneagram-blog-grading-rubric.md` (Core 6 + category modifiers + safety gate).

## Portfolio Snapshot

| Metric                              | Value |
| ----------------------------------- | ----: |
| In-scope posts graded               |    92 |
| Publishable (>=8.5 and safety pass) |    62 |
| Below 8.0                           |    13 |
| Mental-health safety gate fails     |     9 |

## Calibration Scenarios (Pre-Full-Pass)

| Scenario            | Post                                    | Result   | Notes                                       |
| ------------------- | --------------------------------------- | -------- | ------------------------------------------- |
| Strong baseline     | `why-the-next-thing-wont-fix-it-type-7` | 8.2 (B)  | overall 8.2 (B)                             |
| Likely weak-pattern | `enneagram-influences`                  | 8.3 (B)  | overall 8.3 (B)                             |
| Likely weak-pattern | `enneagram-team-diversity`              | 8.5 (B+) | overall 8.5 (B+)                            |
| High-stakes safety  | `enneagram-medication-mental-health`    | 6.9 (D)  | overall 6.9 (D); safety fail; modifier -0.3 |

## Grading Order and Category Rollout

1. Mental Health
2. Foundation
3. Nine Types
4. Relationships
5. Workplace
6. Development
7. Situational
8. Cross-category weakest summary

## Mental Health (12)

Average overall: **7.4** | Publishable: **3/12** | Safety fails: **9**

| Rank | Blog                                              | Overall | Grade | Priority | Safety | Weakest Set | Weakness Tags                          | Modifier                                                                                                                                          |
| ---: | ------------------------------------------------- | ------: | :---: | :------: | :----: | :---------: | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
|    1 | `enneagram-addiction-recovery-guide`              |     6.9 |   D   | rebuild  |  fail  |     yes     | safety-boundary-risk                   | 0                                                                                                                                                 |
|    2 | `enneagram-anxiety-complete-guide`                |     6.9 |   D   | rebuild  |  fail  |     yes     | template-fatigue, safety-boundary-risk | -0.2 (Multi-type template fatigue detected (type section repetition); applied -0.2. Safety gate failed: educationalBoundary.)                     |
|    3 | `enneagram-medication-mental-health`              |     6.9 |   D   | rebuild  |  fail  |     yes     | template-fatigue, safety-boundary-risk | -0.3 (Multi-type template fatigue detected (type section repetition); applied -0.3. Safety gate failed: noDiagnosticAsFact.)                      |
|    4 | `enneagram-neurodivergence-guide`                 |     6.9 |   D   | rebuild  |  fail  |     yes     | template-fatigue, safety-boundary-risk | -0.2 (Multi-type template fatigue detected (type section repetition); applied -0.2. Safety gate failed: educationalBoundary, noDiagnosticAsFact.) |
|    5 | `enneagram-parenting-mental-health`               |     6.9 |   D   | rebuild  |  fail  |     yes     | safety-boundary-risk                   | 0                                                                                                                                                 |
|    6 | `enneagram-therapy-guide`                         |     6.9 |   D   | rebuild  |  fail  |     yes     | safety-boundary-risk                   | 0                                                                                                                                                 |
|    7 | `enneagram-trauma-response-guide`                 |     6.9 |   D   | rebuild  |  fail  |     yes     | weak-hook, safety-boundary-risk        | 0                                                                                                                                                 |
|    8 | `enneagram-workplace-mental-health`               |     6.9 |   D   | rebuild  |  fail  |     yes     | safety-boundary-risk                   | 0                                                                                                                                                 |
|    9 | `why-therapy-doesnt-work-the-same-for-every-type` |     6.9 |   D   | rebuild  |  fail  |     yes     | safety-boundary-risk                   | 0                                                                                                                                                 |
|   10 | `depression-patterns-by-enneagram-type`           |     8.7 |  B+   |   none   |  pass  |             | template-fatigue                       | -0.2 (Multi-type template fatigue detected (type section repetition); applied -0.2.)                                                              |
|   11 | `enneagram-crisis-management-guide`               |       9 |   A   |   none   |  pass  |             | weak-hook                              | 0                                                                                                                                                 |
|   12 | `enneagram-science-mental-health`                 |     9.5 |  A+   |   none   |  pass  |             | —                                      | 0                                                                                                                                                 |

### Weakest in Category

| Blog                                              | Overall | Priority | Primary Gaps                           |
| ------------------------------------------------- | ------: | :------: | -------------------------------------- |
| `enneagram-addiction-recovery-guide`              |     6.9 | rebuild  | safety-boundary-risk                   |
| `enneagram-anxiety-complete-guide`                |     6.9 | rebuild  | template-fatigue, safety-boundary-risk |
| `enneagram-medication-mental-health`              |     6.9 | rebuild  | template-fatigue, safety-boundary-risk |
| `enneagram-neurodivergence-guide`                 |     6.9 | rebuild  | template-fatigue, safety-boundary-risk |
| `enneagram-parenting-mental-health`               |     6.9 | rebuild  | safety-boundary-risk                   |
| `enneagram-therapy-guide`                         |     6.9 | rebuild  | safety-boundary-risk                   |
| `enneagram-trauma-response-guide`                 |     6.9 | rebuild  | weak-hook, safety-boundary-risk        |
| `enneagram-workplace-mental-health`               |     6.9 | rebuild  | safety-boundary-risk                   |
| `why-therapy-doesnt-work-the-same-for-every-type` |     6.9 | rebuild  | safety-boundary-risk                   |

## Foundation (16)

Average overall: **8.6** | Publishable: **7/16** | Safety fails: **0**

| Rank | Blog                                                 | Overall | Grade | Priority | Safety | Weakest Set | Weakness Tags                                            | Modifier                                                                                                                                                                   |
| ---: | ---------------------------------------------------- | ------: | :---: | :------: | :----: | :---------: | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    1 | `enneagram-test-comparison-2025`                     |     7.9 |   C   |  major   |  n/a   |     yes     | unsupported-claims                                       | -0.8 (Research-heavy claims lacked sufficient sourcing density; applied -0.8 and capped at B.)                                                                             |
|    2 | `enneagram-wings-complete-guide`                     |     7.9 |   C   |  major   |  n/a   |     yes     | unsupported-claims, template-fatigue                     | -1 (Research-heavy claims lacked sufficient sourcing density; applied -0.8 and capped at B. Multi-type template fatigue detected (type section repetition); applied -0.2.) |
|    3 | `enneagram-faqs`                                     |       8 |   B   |  light   |  n/a   |     yes     | unsupported-claims, style-friction                       | -0.8 (Research-heavy claims lacked sufficient sourcing density; applied -0.8 and capped at B.)                                                                             |
|    4 | `enneagram-connecting-lines`                         |     8.1 |   B   |  light   |  n/a   |     yes     | weak-hook, low-utility, style-friction, template-fatigue | -0.4 (Multi-type template fatigue detected (type section repetition); applied -0.4.)                                                                                       |
|    5 | `enneagram-criticisms`                               |     8.1 |   B   |  light   |  n/a   |             | weak-hook, low-utility, style-friction                   | 0                                                                                                                                                                          |
|    6 | `philosophy-psychology-and-the-enneagram`            |     8.2 |   B   |  light   |  n/a   |             | weak-hook, low-utility, style-friction                   | 0                                                                                                                                                                          |
|    7 | `enneagram-influences`                               |     8.3 |   B   |  light   |  n/a   |             | weak-hook, low-utility, style-friction                   | 0                                                                                                                                                                          |
|    8 | `enneagram-vs-meyers-briggs`                         |     8.3 |   B   |  light   |  n/a   |             | style-friction                                           | -0.5 (Research-heavy claims had moderate sourcing precision; applied -0.5 and capped at B.)                                                                                |
|    9 | `enneagram-tldr`                                     |     8.4 |   B   |  light   |  n/a   |             | —                                                        | -0.5 (Research-heavy claims had moderate sourcing precision; applied -0.5 and capped at B.)                                                                                |
|   10 | `enneagram-stress-number`                            |     8.7 |  B+   |   none   |  n/a   |             | weak-hook, template-fatigue                              | -0.4 (Multi-type template fatigue detected (type section repetition); applied -0.4.)                                                                                       |
|   11 | `enneagram-concepts`                                 |     8.9 |  B+   |   none   |  n/a   |             | weak-hook                                                | 0                                                                                                                                                                          |
|   12 | `beginners-guide-to-determining-your-enneagram-type` |       9 |   A   |   none   |  n/a   |             | —                                                        | 0                                                                                                                                                                          |
|   13 | `enneagram-and-religion`                             |     9.2 |   A   |   none   |  n/a   |             | —                                                        | 0                                                                                                                                                                          |
|   14 | `enneagram-books-websites-podcasts`                  |     9.3 |   A   |   none   |  n/a   |             | —                                                        | 0                                                                                                                                                                          |
|   15 | `enneagram-instinctual-subtypes`                     |     9.3 |   A   |   none   |  n/a   |             | —                                                        | 0                                                                                                                                                                          |
|   16 | `enneagram-coach-toolkit`                            |     9.5 |  A+   |   none   |  n/a   |             | —                                                        | 0                                                                                                                                                                          |

### Weakest in Category

| Blog                             | Overall | Priority | Primary Gaps                                             |
| -------------------------------- | ------: | :------: | -------------------------------------------------------- |
| `enneagram-test-comparison-2025` |     7.9 |  major   | unsupported-claims                                       |
| `enneagram-wings-complete-guide` |     7.9 |  major   | unsupported-claims, template-fatigue                     |
| `enneagram-faqs`                 |       8 |  light   | unsupported-claims, style-friction                       |
| `enneagram-connecting-lines`     |     8.1 |  light   | weak-hook, low-utility, style-friction, template-fatigue |

## Nine Types (9)

Average overall: **8.8** | Publishable: **9/9** | Safety fails: **0**

| Rank | Blog               | Overall | Grade | Priority | Safety | Weakest Set | Weakness Tags          | Modifier |
| ---: | ------------------ | ------: | :---: | :------: | :----: | :---------: | ---------------------- | -------- |
|    1 | `enneagram-type-4` |     8.6 |  B+   |   none   |  n/a   |     yes     | weak-hook              | 0        |
|    2 | `enneagram-type-8` |     8.6 |  B+   |   none   |  n/a   |     yes     | weak-hook, low-utility | 0        |
|    3 | `enneagram-type-1` |     8.8 |  B+   |   none   |  n/a   |             | weak-hook              | 0        |
|    4 | `enneagram-type-3` |     8.8 |  B+   |   none   |  n/a   |             | weak-hook              | 0        |
|    5 | `enneagram-type-7` |     8.8 |  B+   |   none   |  n/a   |             | weak-hook              | 0        |
|    6 | `enneagram-type-2` |     8.9 |  B+   |   none   |  n/a   |             | weak-hook              | 0        |
|    7 | `enneagram-type-5` |     8.9 |  B+   |   none   |  n/a   |             | weak-hook              | 0        |
|    8 | `enneagram-type-9` |     8.9 |  B+   |   none   |  n/a   |             | weak-hook              | 0        |
|    9 | `enneagram-type-6` |       9 |   A   |   none   |  n/a   |             | weak-hook              | 0        |

### Weakest in Category

| Blog               | Overall | Priority | Primary Gaps           |
| ------------------ | ------: | :------: | ---------------------- |
| `enneagram-type-4` |     8.6 |   none   | weak-hook              |
| `enneagram-type-8` |     8.6 |   none   | weak-hook, low-utility |

## Relationships (12)

Average overall: **8.6** | Publishable: **9/12** | Safety fails: **0**

| Rank | Blog                                                       | Overall | Grade | Priority | Safety | Weakest Set | Weakness Tags                                                        | Modifier                                                                             |
| ---: | ---------------------------------------------------------- | ------: | :---: | :------: | :----: | :---------: | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
|    1 | `how-to-apologize-like-a-pro`                              |     7.8 |   C   |  major   |  n/a   |     yes     | weak-hook, unsupported-claims, style-friction, template-fatigue      | -0.3 (Multi-type template fatigue detected (type section repetition); applied -0.3.) |
|    2 | `love-languages-and-enneagram-types`                       |     8.4 |   B   |  light   |  n/a   |     yes     | weak-hook, unsupported-claims, template-fatigue, overlap-duplication | -0.2 (Multi-type template fatigue detected (type section repetition); applied -0.2.) |
|    3 | `why-dating-apps-are-harder-for-certain-personality-types` |     8.4 |   B   |  light   |  n/a   |     yes     | weak-hook, template-fatigue                                          | -0.2 (Multi-type template fatigue detected (type section repetition); applied -0.2.) |
|    4 | `enneagram-compatibility-matrix`                           |     8.6 |  B+   |   none   |  n/a   |             | template-fatigue, overlap-duplication                                | -0.2 (Multi-type template fatigue detected (type section repetition); applied -0.2.) |
|    5 | `enneagram-types-in-relationships`                         |     8.6 |  B+   |   none   |  n/a   |             | weak-hook, template-fatigue, overlap-duplication                     | -0.4 (Multi-type template fatigue detected (type section repetition); applied -0.4.) |
|    6 | `enneagram-dating-guide-for-women`                         |     8.7 |  B+   |   none   |  n/a   |             | weak-hook                                                            | 0                                                                                    |
|    7 | `enneagram-compatibility-guide`                            |     8.8 |  B+   |   none   |  n/a   |             | template-fatigue, overlap-duplication                                | -0.2 (Multi-type template fatigue detected (type section repetition); applied -0.2.) |
|    8 | `enneagram-dating-guide-for-men`                           |     8.8 |  B+   |   none   |  n/a   |             | weak-hook                                                            | 0                                                                                    |
|    9 | `how-to-navigate-early-relationship-stages`                |     8.8 |  B+   |   none   |  n/a   |             | weak-hook                                                            | 0                                                                                    |
|   10 | `relationship-communication-guide`                         |     8.8 |  B+   |   none   |  n/a   |             | template-fatigue, overlap-duplication                                | -0.2 (Multi-type template fatigue detected (type section repetition); applied -0.2.) |
|   11 | `enneagram-types-on-a-first-date`                          |     8.9 |  B+   |   none   |  n/a   |             | —                                                                    | 0                                                                                    |
|   12 | `attachment-styles-and-enneagram-types`                    |       9 |   A   |   none   |  n/a   |             | template-fatigue, overlap-duplication                                | -0.2 (Multi-type template fatigue detected (type section repetition); applied -0.2.) |

### Weakest in Category

| Blog                                                       | Overall | Priority | Primary Gaps                                                         |
| ---------------------------------------------------------- | ------: | :------: | -------------------------------------------------------------------- |
| `how-to-apologize-like-a-pro`                              |     7.8 |  major   | weak-hook, unsupported-claims, style-friction, template-fatigue      |
| `love-languages-and-enneagram-types`                       |     8.4 |  light   | weak-hook, unsupported-claims, template-fatigue, overlap-duplication |
| `why-dating-apps-are-harder-for-certain-personality-types` |     8.4 |  light   | weak-hook, template-fatigue                                          |

## Workplace (6)

Average overall: **8.7** | Publishable: **6/6** | Safety fails: **0**

| Rank | Blog                                 | Overall | Grade | Priority | Safety | Weakest Set | Weakness Tags             | Modifier                                                                             |
| ---: | ------------------------------------ | ------: | :---: | :------: | :----: | :---------: | ------------------------- | ------------------------------------------------------------------------------------ |
|    1 | `enneagram-team-diversity`           |     8.5 |  B+   |   none   |  n/a   |     yes     | weak-hook, style-friction | 0                                                                                    |
|    2 | `enneagram-leadership`               |     8.6 |  B+   |   none   |  n/a   |     yes     | template-fatigue          | -0.3 (Multi-type template fatigue detected (type section repetition); applied -0.3.) |
|    3 | `enneagram-types-working-in-teams`   |     8.7 |  B+   |   none   |  n/a   |             | weak-hook, style-friction | 0                                                                                    |
|    4 | `enneagram-team-dynamics`            |     8.8 |  B+   |   none   |  n/a   |             | weak-hook, style-friction | 0                                                                                    |
|    5 | `enneagram-types-and-career-choices` |     8.8 |  B+   |   none   |  n/a   |             | template-fatigue          | -0.4 (Multi-type template fatigue detected (type section repetition); applied -0.4.) |
|    6 | `enneagram-workplace-team-building`  |     8.8 |  B+   |   none   |  n/a   |             | weak-hook                 | 0                                                                                    |

### Weakest in Category

| Blog                       | Overall | Priority | Primary Gaps              |
| -------------------------- | ------: | :------: | ------------------------- |
| `enneagram-team-diversity` |     8.5 |   none   | weak-hook, style-friction |
| `enneagram-leadership`     |     8.6 |   none   | template-fatigue          |

## Development (10)

Average overall: **8.8** | Publishable: **9/10** | Safety fails: **0**

| Rank | Blog                                  | Overall | Grade | Priority | Safety | Weakest Set | Weakness Tags                                        | Modifier                                                                             |
| ---: | ------------------------------------- | ------: | :---: | :------: | :----: | :---------: | ---------------------------------------------------- | ------------------------------------------------------------------------------------ |
|    1 | `enneagram-positive-self-talk`        |     8.1 |   B   |  light   |  n/a   |     yes     | unsupported-claims, style-friction, template-fatigue | -0.3 (Multi-type template fatigue detected (type section repetition); applied -0.3.) |
|    2 | `90-day-personality-maxing-blueprint` |     8.5 |  B+   |   none   |  n/a   |     yes     | template-fatigue                                     | -0.3 (Multi-type template fatigue detected (type section repetition); applied -0.3.) |
|    3 | `situations-change-emotions-dont`     |     8.5 |  B+   |   none   |  n/a   |             | style-friction                                       | 0                                                                                    |
|    4 | `enneagram-personal-growth`           |     8.7 |  B+   |   none   |  n/a   |             | weak-hook                                            | 0                                                                                    |
|    5 | `enneagram-strengths-and-weaknesses`  |     8.8 |  B+   |   none   |  n/a   |             | weak-hook, template-fatigue                          | -0.3 (Multi-type template fatigue detected (type section repetition); applied -0.3.) |
|    6 | `enneagram-communication-guide`       |     8.9 |  B+   |   none   |  n/a   |             | weak-hook, template-fatigue, overlap-duplication     | -0.2 (Multi-type template fatigue detected (type section repetition); applied -0.2.) |
|    7 | `shadow-work-by-enneagram-type`       |     8.9 |  B+   |   none   |  n/a   |             | unsupported-claims                                   | 0                                                                                    |
|    8 | `enneagram-communication-tips`        |     9.2 |   A   |   none   |  n/a   |             | —                                                    | 0                                                                                    |
|    9 | `enneagram-communication-styles`      |     9.3 |   A   |   none   |  n/a   |             | —                                                    | 0                                                                                    |
|   10 | `enneagram-self-development`          |     9.3 |   A   |   none   |  n/a   |             | —                                                    | 0                                                                                    |

### Weakest in Category

| Blog                                  | Overall | Priority | Primary Gaps                                         |
| ------------------------------------- | ------: | :------: | ---------------------------------------------------- |
| `enneagram-positive-self-talk`        |     8.1 |  light   | unsupported-claims, style-friction, template-fatigue |
| `90-day-personality-maxing-blueprint` |     8.5 |   none   | template-fatigue                                     |

## Situational (27)

Average overall: **8.7** | Publishable: **19/27** | Safety fails: **0**

| Rank | Blog                                              | Overall | Grade | Priority | Safety | Weakest Set | Weakness Tags                                                   | Modifier                                                                             |
| ---: | ------------------------------------------------- | ------: | :---: | :------: | :----: | :---------: | --------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
|    1 | `neurodiversity-vs-personality`                   |     7.8 |   C   |  major   |  n/a   |     yes     | weak-hook, low-utility, style-friction                          | 0                                                                                    |
|    2 | `enneagram-types-at-party`                        |       8 |   B   |  light   |  n/a   |     yes     | template-fatigue                                                | -0.7 (Multi-type template fatigue detected (type section repetition); applied -0.7.) |
|    3 | `biggest-compliments-to-give-each-enneagram-type` |     8.1 |   B   |  light   |  n/a   |     yes     | style-friction, template-fatigue                                | -0.4 (Multi-type template fatigue detected (type section repetition); applied -0.4.) |
|    4 | `anxiety-and-enneagram-types-guide`               |     8.2 |   B   |  light   |  n/a   |     yes     | weak-hook, unsupported-claims, style-friction, template-fatigue | -0.2 (Multi-type template fatigue detected (type section repetition); applied -0.2.) |
|    5 | `enneagram-childhood-stereotypes`                 |     8.2 |   B   |  light   |  n/a   |     yes     | low-utility, style-friction                                     | 0                                                                                    |
|    6 | `enneagram-party-planner`                         |     8.2 |   B   |  light   |  n/a   |     yes     | template-fatigue                                                | -0.4 (Multi-type template fatigue detected (type section repetition); applied -0.4.) |
|    7 | `why-the-next-thing-wont-fix-it-type-7`           |     8.2 |   B   |  light   |  n/a   |             | unsupported-claims, low-utility                                 | 0                                                                                    |
|    8 | `oversharing-psychology-shame-boundaries`         |     8.3 |   B   |  light   |  n/a   |             | low-utility, template-fatigue                                   | -0.2 (Multi-type template fatigue detected (type section repetition); applied -0.2.) |
|    9 | `how-each-enneagram-flexes`                       |     8.6 |  B+   |   none   |  n/a   |             | weak-hook, low-utility                                          | 0                                                                                    |
|   10 | `enneagram-anxiety-management-guide`              |     8.7 |  B+   |   none   |  n/a   |             | unsupported-claims                                              | 0                                                                                    |
|   11 | `how-type-8-challengers-actually-succeed`         |     8.7 |  B+   |   none   |  n/a   |             | weak-hook                                                       | 0                                                                                    |
|   12 | `toxic-traits-relationships-warning-signs`        |     8.7 |  B+   |   none   |  n/a   |             | template-fatigue                                                | -0.2 (Multi-type template fatigue detected (type section repetition); applied -0.2.) |
|   13 | `astrology-and-the-enneagram`                     |     8.8 |  B+   |   none   |  n/a   |             | style-friction                                                  | 0                                                                                    |
|   14 | `enneagram-and-adhd-which-types-struggle-most`    |     8.8 |  B+   |   none   |  n/a   |             | weak-hook, template-fatigue                                     | -0.2 (Multi-type template fatigue detected (type section repetition); applied -0.2.) |
|   15 | `how-each-enneagram-type-unwinds`                 |     8.8 |  B+   |   none   |  n/a   |             | weak-hook                                                       | 0                                                                                    |
|   16 | `personality-maxing`                              |     8.8 |  B+   |   none   |  n/a   |             | weak-hook                                                       | 0                                                                                    |
|   17 | `enneagram-mental-health-flags`                   |     8.9 |  B+   |   none   |  n/a   |             | weak-hook                                                       | 0                                                                                    |
|   18 | `enneagram-parenting-styles`                      |     8.9 |  B+   |   none   |  n/a   |             | —                                                               | 0                                                                                    |
|   19 | `first-impression-enneagram-playbook`             |       9 |   A   |   none   |  n/a   |             | —                                                               | 0                                                                                    |
|   20 | `how-each-enneagram-type-self-sabotages-success`  |     9.1 |   A   |   none   |  n/a   |             | weak-hook                                                       | 0                                                                                    |
|   21 | `enneagram-types-in-stress`                       |     9.2 |   A   |   none   |  n/a   |             | —                                                               | 0                                                                                    |
|   22 | `how-each-enneagram-type-manipulates`             |     9.2 |   A   |   none   |  n/a   |             | weak-hook                                                       | 0                                                                                    |
|   23 | `red-flags-dating-each-enneagram-type`            |     9.2 |   A   |   none   |  n/a   |             | —                                                               | 0                                                                                    |
|   24 | `toxic-traits-of-each-enneagram-type`             |     9.2 |   A   |   none   |  n/a   |             | —                                                               | 0                                                                                    |
|   25 | `enneagram-types-being-ghosted`                   |     9.3 |   A   |   none   |  n/a   |             | —                                                               | 0                                                                                    |
|   26 | `why-you-cant-stop-overthinking-enneagram`        |     9.3 |   A   |   none   |  n/a   |             | weak-hook                                                       | 0                                                                                    |
|   27 | `enneagram-and-mental-illness`                    |     9.5 |  A+   |   none   |  n/a   |             | —                                                               | 0                                                                                    |

### Weakest in Category

| Blog                                              | Overall | Priority | Primary Gaps                                                    |
| ------------------------------------------------- | ------: | :------: | --------------------------------------------------------------- |
| `neurodiversity-vs-personality`                   |     7.8 |  major   | weak-hook, low-utility, style-friction                          |
| `enneagram-types-at-party`                        |       8 |  light   | template-fatigue                                                |
| `biggest-compliments-to-give-each-enneagram-type` |     8.1 |  light   | style-friction, template-fatigue                                |
| `anxiety-and-enneagram-types-guide`               |     8.2 |  light   | weak-hook, unsupported-claims, style-friction, template-fatigue |
| `enneagram-childhood-stereotypes`                 |     8.2 |  light   | low-utility, style-friction                                     |
| `enneagram-party-planner`                         |     8.2 |  light   | template-fatigue                                                |

## Cross-Category Weakest Summary

| Rank | Blog                                              | Category      | Overall | Grade | Priority | Safety | Primary Gaps                                                    |
| ---: | ------------------------------------------------- | ------------- | ------: | :---: | :------: | :----: | --------------------------------------------------------------- |
|    1 | `enneagram-addiction-recovery-guide`              | mental-health |     6.9 |   D   | rebuild  |  fail  | safety-boundary-risk                                            |
|    2 | `enneagram-anxiety-complete-guide`                | mental-health |     6.9 |   D   | rebuild  |  fail  | template-fatigue, safety-boundary-risk                          |
|    3 | `enneagram-medication-mental-health`              | mental-health |     6.9 |   D   | rebuild  |  fail  | template-fatigue, safety-boundary-risk                          |
|    4 | `enneagram-neurodivergence-guide`                 | mental-health |     6.9 |   D   | rebuild  |  fail  | template-fatigue, safety-boundary-risk                          |
|    5 | `enneagram-parenting-mental-health`               | mental-health |     6.9 |   D   | rebuild  |  fail  | safety-boundary-risk                                            |
|    6 | `enneagram-therapy-guide`                         | mental-health |     6.9 |   D   | rebuild  |  fail  | safety-boundary-risk                                            |
|    7 | `enneagram-trauma-response-guide`                 | mental-health |     6.9 |   D   | rebuild  |  fail  | weak-hook, safety-boundary-risk                                 |
|    8 | `enneagram-workplace-mental-health`               | mental-health |     6.9 |   D   | rebuild  |  fail  | safety-boundary-risk                                            |
|    9 | `why-therapy-doesnt-work-the-same-for-every-type` | mental-health |     6.9 |   D   | rebuild  |  fail  | safety-boundary-risk                                            |
|   10 | `how-to-apologize-like-a-pro`                     | relationships |     7.8 |   C   |  major   |  n/a   | weak-hook, unsupported-claims, style-friction, template-fatigue |
|   11 | `neurodiversity-vs-personality`                   | situational   |     7.8 |   C   |  major   |  n/a   | weak-hook, low-utility, style-friction                          |
|   12 | `enneagram-test-comparison-2025`                  | foundation    |     7.9 |   C   |  major   |  n/a   | unsupported-claims                                              |
|   13 | `enneagram-wings-complete-guide`                  | foundation    |     7.9 |   C   |  major   |  n/a   | unsupported-claims, template-fatigue                            |
|   14 | `enneagram-faqs`                                  | foundation    |       8 |   B   |  light   |  n/a   | unsupported-claims, style-friction                              |
|   15 | `enneagram-types-at-party`                        | situational   |       8 |   B   |  light   |  n/a   | template-fatigue                                                |
|   16 | `biggest-compliments-to-give-each-enneagram-type` | situational   |     8.1 |   B   |  light   |  n/a   | style-friction, template-fatigue                                |
|   17 | `enneagram-connecting-lines`                      | foundation    |     8.1 |   B   |  light   |  n/a   | weak-hook, low-utility, style-friction, template-fatigue        |
|   18 | `enneagram-criticisms`                            | foundation    |     8.1 |   B   |  light   |  n/a   | weak-hook, low-utility, style-friction                          |
|   19 | `enneagram-positive-self-talk`                    | development   |     8.1 |   B   |  light   |  n/a   | unsupported-claims, style-friction, template-fatigue            |

## Test Case Results

1. Safety gate cap test: posts with `safety_gate = fail` were capped at `6.9` max.
2. Modifier fairness test: short posts were not auto-penalized unless the affected dimension quality dropped.
3. Repetition divergence test: similarly structured multi-type posts diverged by utility/evidence/originality and fatigue modifier strength.
4. Consistency test: deterministic re-grade on a 3-post sample produced score deltas within ±0.5 (observed 0.0).

## Full Grading Objects (JSON)

```json
[
	{
		"slug": "depression-patterns-by-enneagram-type",
		"path": "src/blog/enneagram/depression-patterns-by-enneagram-type.md",
		"category": "mental-health",
		"scores": {
			"framing": 7.8,
			"enneagram_depth": 9.7,
			"evidence": 7.8,
			"utility": 9.6,
			"writing": 7.6,
			"originality": 6.3
		},
		"modifier_adjustment": -0.2,
		"modifier_reason": "Multi-type template fatigue detected (type section repetition); applied -0.2.",
		"safety_gate": "pass",
		"overall": 8.7,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["template-fatigue"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-addiction-recovery-guide",
		"path": "src/blog/enneagram/mental-health/enneagram-addiction-recovery-guide.md",
		"category": "mental-health",
		"scores": {
			"framing": 7.8,
			"enneagram_depth": 9.7,
			"evidence": 8.2,
			"utility": 9.9,
			"writing": 8,
			"originality": 7
		},
		"modifier_adjustment": 0,
		"modifier_reason": "Safety gate failed: educationalBoundary.",
		"safety_gate": "fail",
		"overall": 6.9,
		"letter": "D",
		"publishable": false,
		"weakness_tags": ["safety-boundary-risk"],
		"rewrite_priority": "rebuild",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-anxiety-complete-guide",
		"path": "src/blog/enneagram/mental-health/enneagram-anxiety-complete-guide.md",
		"category": "mental-health",
		"scores": {
			"framing": 7.8,
			"enneagram_depth": 9.7,
			"evidence": 7.8,
			"utility": 9.6,
			"writing": 8,
			"originality": 6.5
		},
		"modifier_adjustment": -0.2,
		"modifier_reason": "Multi-type template fatigue detected (type section repetition); applied -0.2. Safety gate failed: educationalBoundary.",
		"safety_gate": "fail",
		"overall": 6.9,
		"letter": "D",
		"publishable": false,
		"weakness_tags": ["template-fatigue", "safety-boundary-risk"],
		"rewrite_priority": "rebuild",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-crisis-management-guide",
		"path": "src/blog/enneagram/mental-health/enneagram-crisis-management-guide.md",
		"category": "mental-health",
		"scores": {
			"framing": 7.5,
			"enneagram_depth": 9.7,
			"evidence": 7.8,
			"utility": 9.9,
			"writing": 7.8,
			"originality": 6.6
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "pass",
		"overall": 9,
		"letter": "A",
		"publishable": true,
		"weakness_tags": ["weak-hook"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-medication-mental-health",
		"path": "src/blog/enneagram/mental-health/enneagram-medication-mental-health.md",
		"category": "mental-health",
		"scores": {
			"framing": 7.9,
			"enneagram_depth": 9.7,
			"evidence": 7.8,
			"utility": 9.9,
			"writing": 7.6,
			"originality": 4.9
		},
		"modifier_adjustment": -0.3,
		"modifier_reason": "Multi-type template fatigue detected (type section repetition); applied -0.3. Safety gate failed: noDiagnosticAsFact.",
		"safety_gate": "fail",
		"overall": 6.9,
		"letter": "D",
		"publishable": false,
		"weakness_tags": ["template-fatigue", "safety-boundary-risk"],
		"rewrite_priority": "rebuild",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-neurodivergence-guide",
		"path": "src/blog/enneagram/mental-health/enneagram-neurodivergence-guide.md",
		"category": "mental-health",
		"scores": {
			"framing": 7.8,
			"enneagram_depth": 9.7,
			"evidence": 8.1,
			"utility": 9.9,
			"writing": 8,
			"originality": 6.8
		},
		"modifier_adjustment": -0.2,
		"modifier_reason": "Multi-type template fatigue detected (type section repetition); applied -0.2. Safety gate failed: educationalBoundary, noDiagnosticAsFact.",
		"safety_gate": "fail",
		"overall": 6.9,
		"letter": "D",
		"publishable": false,
		"weakness_tags": ["template-fatigue", "safety-boundary-risk"],
		"rewrite_priority": "rebuild",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-parenting-mental-health",
		"path": "src/blog/enneagram/mental-health/enneagram-parenting-mental-health.md",
		"category": "mental-health",
		"scores": {
			"framing": 7.9,
			"enneagram_depth": 9.7,
			"evidence": 7.8,
			"utility": 9.9,
			"writing": 7.6,
			"originality": 6.3
		},
		"modifier_adjustment": 0,
		"modifier_reason": "Safety gate failed: educationalBoundary.",
		"safety_gate": "fail",
		"overall": 6.9,
		"letter": "D",
		"publishable": false,
		"weakness_tags": ["safety-boundary-risk"],
		"rewrite_priority": "rebuild",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-science-mental-health",
		"path": "src/blog/enneagram/mental-health/enneagram-science-mental-health.md",
		"category": "mental-health",
		"scores": {
			"framing": 7.8,
			"enneagram_depth": 9.7,
			"evidence": 9.6,
			"utility": 9.9,
			"writing": 8,
			"originality": 7.2
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "pass",
		"overall": 9.5,
		"letter": "A+",
		"publishable": true,
		"weakness_tags": [],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-therapy-guide",
		"path": "src/blog/enneagram/mental-health/enneagram-therapy-guide.md",
		"category": "mental-health",
		"scores": {
			"framing": 7.9,
			"enneagram_depth": 9.2,
			"evidence": 8.2,
			"utility": 9.4,
			"writing": 8,
			"originality": 7.1
		},
		"modifier_adjustment": 0,
		"modifier_reason": "Safety gate failed: educationalBoundary.",
		"safety_gate": "fail",
		"overall": 6.9,
		"letter": "D",
		"publishable": false,
		"weakness_tags": ["safety-boundary-risk"],
		"rewrite_priority": "rebuild",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-trauma-response-guide",
		"path": "src/blog/enneagram/mental-health/enneagram-trauma-response-guide.md",
		"category": "mental-health",
		"scores": {
			"framing": 6.9,
			"enneagram_depth": 9.7,
			"evidence": 9.1,
			"utility": 9.5,
			"writing": 7.7,
			"originality": 7.2
		},
		"modifier_adjustment": 0,
		"modifier_reason": "Safety gate failed: educationalBoundary.",
		"safety_gate": "fail",
		"overall": 6.9,
		"letter": "D",
		"publishable": false,
		"weakness_tags": ["weak-hook", "safety-boundary-risk"],
		"rewrite_priority": "rebuild",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-workplace-mental-health",
		"path": "src/blog/enneagram/mental-health/enneagram-workplace-mental-health.md",
		"category": "mental-health",
		"scores": {
			"framing": 8,
			"enneagram_depth": 9.1,
			"evidence": 7.8,
			"utility": 9.9,
			"writing": 7.7,
			"originality": 5.7
		},
		"modifier_adjustment": 0,
		"modifier_reason": "Safety gate failed: educationalBoundary.",
		"safety_gate": "fail",
		"overall": 6.9,
		"letter": "D",
		"publishable": false,
		"weakness_tags": ["safety-boundary-risk"],
		"rewrite_priority": "rebuild",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "why-therapy-doesnt-work-the-same-for-every-type",
		"path": "src/blog/enneagram/why-therapy-doesnt-work-the-same-for-every-type.md",
		"category": "mental-health",
		"scores": {
			"framing": 8.1,
			"enneagram_depth": 9.7,
			"evidence": 7.8,
			"utility": 9.5,
			"writing": 8,
			"originality": 6.7
		},
		"modifier_adjustment": 0,
		"modifier_reason": "Safety gate failed: educationalBoundary.",
		"safety_gate": "fail",
		"overall": 6.9,
		"letter": "D",
		"publishable": false,
		"weakness_tags": ["safety-boundary-risk"],
		"rewrite_priority": "rebuild",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-type-1",
		"path": "src/blog/enneagram/enneagram-type-1.md",
		"category": "nine-types",
		"scores": {
			"framing": 7.4,
			"enneagram_depth": 9.3,
			"evidence": 8,
			"utility": 8.6,
			"writing": 8,
			"originality": 6.9
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.8,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["weak-hook"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-type-2",
		"path": "src/blog/enneagram/enneagram-type-2.md",
		"category": "nine-types",
		"scores": {
			"framing": 7.4,
			"enneagram_depth": 9.4,
			"evidence": 8,
			"utility": 8.9,
			"writing": 8,
			"originality": 7
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.9,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["weak-hook"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-type-3",
		"path": "src/blog/enneagram/enneagram-type-3.md",
		"category": "nine-types",
		"scores": {
			"framing": 7.4,
			"enneagram_depth": 9.4,
			"evidence": 8,
			"utility": 8.4,
			"writing": 8,
			"originality": 6.7
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.8,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["weak-hook"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-type-4",
		"path": "src/blog/enneagram/enneagram-type-4.md",
		"category": "nine-types",
		"scores": {
			"framing": 7.4,
			"enneagram_depth": 9.3,
			"evidence": 7.9,
			"utility": 7.7,
			"writing": 8.2,
			"originality": 6.5
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.6,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["weak-hook"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-type-5",
		"path": "src/blog/enneagram/enneagram-type-5.md",
		"category": "nine-types",
		"scores": {
			"framing": 7.4,
			"enneagram_depth": 9.2,
			"evidence": 8,
			"utility": 8.8,
			"writing": 8,
			"originality": 7.1
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.9,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["weak-hook"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-type-6",
		"path": "src/blog/enneagram/enneagram-type-6.md",
		"category": "nine-types",
		"scores": {
			"framing": 7.4,
			"enneagram_depth": 9.4,
			"evidence": 8,
			"utility": 9.3,
			"writing": 8,
			"originality": 6.9
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 9,
		"letter": "A",
		"publishable": true,
		"weakness_tags": ["weak-hook"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-type-7",
		"path": "src/blog/enneagram/enneagram-type-7.md",
		"category": "nine-types",
		"scores": {
			"framing": 7.4,
			"enneagram_depth": 9.3,
			"evidence": 8,
			"utility": 8.9,
			"writing": 8,
			"originality": 6.6
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.8,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["weak-hook"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-type-8",
		"path": "src/blog/enneagram/enneagram-type-8.md",
		"category": "nine-types",
		"scores": {
			"framing": 7.4,
			"enneagram_depth": 9.3,
			"evidence": 8,
			"utility": 7.3,
			"writing": 8,
			"originality": 7
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.6,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["weak-hook", "low-utility"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-type-9",
		"path": "src/blog/enneagram/enneagram-type-9.md",
		"category": "nine-types",
		"scores": {
			"framing": 7.4,
			"enneagram_depth": 9.4,
			"evidence": 8,
			"utility": 9,
			"writing": 8,
			"originality": 6.9
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.9,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["weak-hook"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "beginners-guide-to-determining-your-enneagram-type",
		"path": "src/blog/enneagram/beginners-guide-to-determining-your-enneagram-type.md",
		"category": "foundation",
		"scores": {
			"framing": 8.2,
			"enneagram_depth": 9.5,
			"evidence": 8,
			"utility": 9.9,
			"writing": 8.2,
			"originality": 5.6
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 9,
		"letter": "A",
		"publishable": true,
		"weakness_tags": [],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-and-religion",
		"path": "src/blog/enneagram/enneagram-and-religion.md",
		"category": "foundation",
		"scores": {
			"framing": 7.8,
			"enneagram_depth": 9.6,
			"evidence": 8.6,
			"utility": 9.6,
			"writing": 8,
			"originality": 7.1
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 9.2,
		"letter": "A",
		"publishable": true,
		"weakness_tags": [],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-books-websites-podcasts",
		"path": "src/blog/enneagram/enneagram-books-websites-podcasts.md",
		"category": "foundation",
		"scores": {
			"framing": 7.9,
			"enneagram_depth": 9.1,
			"evidence": 9.6,
			"utility": 9.9,
			"writing": 7.6,
			"originality": 6.7
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 9.3,
		"letter": "A",
		"publishable": true,
		"weakness_tags": [],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-coach-toolkit",
		"path": "src/blog/enneagram/enneagram-coach-toolkit.md",
		"category": "foundation",
		"scores": {
			"framing": 8.1,
			"enneagram_depth": 9.3,
			"evidence": 9.6,
			"utility": 9.7,
			"writing": 8.2,
			"originality": 7.4
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 9.5,
		"letter": "A+",
		"publishable": true,
		"weakness_tags": [],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-concepts",
		"path": "src/blog/enneagram/enneagram-concepts.md",
		"category": "foundation",
		"scores": {
			"framing": 7.4,
			"enneagram_depth": 7.9,
			"evidence": 9.6,
			"utility": 8.6,
			"writing": 7.7,
			"originality": 7.6
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.9,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["weak-hook"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-connecting-lines",
		"path": "src/blog/enneagram/enneagram-connecting-lines.md",
		"category": "foundation",
		"scores": {
			"framing": 7.1,
			"enneagram_depth": 9.7,
			"evidence": 8.2,
			"utility": 6.7,
			"writing": 7.2,
			"originality": 7.3
		},
		"modifier_adjustment": -0.4,
		"modifier_reason": "Multi-type template fatigue detected (type section repetition); applied -0.4.",
		"safety_gate": "n/a",
		"overall": 8.1,
		"letter": "B",
		"publishable": false,
		"weakness_tags": ["weak-hook", "low-utility", "style-friction", "template-fatigue"],
		"rewrite_priority": "light",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-criticisms",
		"path": "src/blog/enneagram/enneagram-criticisms.md",
		"category": "foundation",
		"scores": {
			"framing": 7.5,
			"enneagram_depth": 7.4,
			"evidence": 8,
			"utility": 6.8,
			"writing": 6.8,
			"originality": 7.4
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.1,
		"letter": "B",
		"publishable": false,
		"weakness_tags": ["weak-hook", "low-utility", "style-friction"],
		"rewrite_priority": "light",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-faqs",
		"path": "src/blog/enneagram/enneagram-faqs.md",
		"category": "foundation",
		"scores": {
			"framing": 7.6,
			"enneagram_depth": 9.4,
			"evidence": 7,
			"utility": 9.5,
			"writing": 7.4,
			"originality": 6.9
		},
		"modifier_adjustment": -0.8,
		"modifier_reason": "Research-heavy claims lacked sufficient sourcing density; applied -0.8 and capped at B.",
		"safety_gate": "n/a",
		"overall": 8,
		"letter": "B",
		"publishable": false,
		"weakness_tags": ["unsupported-claims", "style-friction"],
		"rewrite_priority": "light",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-influences",
		"path": "src/blog/enneagram/enneagram-influences.md",
		"category": "foundation",
		"scores": {
			"framing": 6.9,
			"enneagram_depth": 8.4,
			"evidence": 8.9,
			"utility": 5.7,
			"writing": 7.4,
			"originality": 7.6
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.3,
		"letter": "B",
		"publishable": false,
		"weakness_tags": ["weak-hook", "low-utility", "style-friction"],
		"rewrite_priority": "light",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-instinctual-subtypes",
		"path": "src/blog/enneagram/enneagram-instinctual-subtypes.md",
		"category": "foundation",
		"scores": {
			"framing": 8,
			"enneagram_depth": 9.1,
			"evidence": 8.6,
			"utility": 9.9,
			"writing": 8,
			"originality": 7.5
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 9.3,
		"letter": "A",
		"publishable": true,
		"weakness_tags": [],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-stress-number",
		"path": "src/blog/enneagram/enneagram-stress-number.md",
		"category": "foundation",
		"scores": {
			"framing": 7.4,
			"enneagram_depth": 9.7,
			"evidence": 8.2,
			"utility": 9.5,
			"writing": 7.9,
			"originality": 7
		},
		"modifier_adjustment": -0.4,
		"modifier_reason": "Multi-type template fatigue detected (type section repetition); applied -0.4.",
		"safety_gate": "n/a",
		"overall": 8.7,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["weak-hook", "template-fatigue"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-test-comparison-2025",
		"path": "src/blog/enneagram/enneagram-test-comparison-2025.md",
		"category": "foundation",
		"scores": {
			"framing": 7.9,
			"enneagram_depth": 8.4,
			"evidence": 7,
			"utility": 9.6,
			"writing": 8,
			"originality": 6.7
		},
		"modifier_adjustment": -0.8,
		"modifier_reason": "Research-heavy claims lacked sufficient sourcing density; applied -0.8 and capped at B.",
		"safety_gate": "n/a",
		"overall": 7.9,
		"letter": "C",
		"publishable": false,
		"weakness_tags": ["unsupported-claims"],
		"rewrite_priority": "major",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-tldr",
		"path": "src/blog/enneagram/enneagram-tldr.md",
		"category": "foundation",
		"scores": {
			"framing": 7.9,
			"enneagram_depth": 9.6,
			"evidence": 8.1,
			"utility": 9.4,
			"writing": 8.2,
			"originality": 7.2
		},
		"modifier_adjustment": -0.5,
		"modifier_reason": "Research-heavy claims had moderate sourcing precision; applied -0.5 and capped at B.",
		"safety_gate": "n/a",
		"overall": 8.4,
		"letter": "B",
		"publishable": false,
		"weakness_tags": [],
		"rewrite_priority": "light",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-vs-meyers-briggs",
		"path": "src/blog/enneagram/enneagram-vs-meyers-briggs.md",
		"category": "foundation",
		"scores": {
			"framing": 8.3,
			"enneagram_depth": 9.4,
			"evidence": 7.9,
			"utility": 8.2,
			"writing": 7.3,
			"originality": 7
		},
		"modifier_adjustment": -0.5,
		"modifier_reason": "Research-heavy claims had moderate sourcing precision; applied -0.5 and capped at B.",
		"safety_gate": "n/a",
		"overall": 8.3,
		"letter": "B",
		"publishable": false,
		"weakness_tags": ["style-friction"],
		"rewrite_priority": "light",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-wings-complete-guide",
		"path": "src/blog/enneagram/enneagram-wings-complete-guide.md",
		"category": "foundation",
		"scores": {
			"framing": 8.3,
			"enneagram_depth": 9.7,
			"evidence": 6.7,
			"utility": 9.6,
			"writing": 7.9,
			"originality": 6.2
		},
		"modifier_adjustment": -1,
		"modifier_reason": "Research-heavy claims lacked sufficient sourcing density; applied -0.8 and capped at B. Multi-type template fatigue detected (type section repetition); applied -0.2.",
		"safety_gate": "n/a",
		"overall": 7.9,
		"letter": "C",
		"publishable": false,
		"weakness_tags": ["unsupported-claims", "template-fatigue"],
		"rewrite_priority": "major",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "philosophy-psychology-and-the-enneagram",
		"path": "src/blog/enneagram/philosophy-psychology-and-the-enneagram.md",
		"category": "foundation",
		"scores": {
			"framing": 6.8,
			"enneagram_depth": 7.4,
			"evidence": 9.1,
			"utility": 6.8,
			"writing": 7,
			"originality": 7.5
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.2,
		"letter": "B",
		"publishable": false,
		"weakness_tags": ["weak-hook", "low-utility", "style-friction"],
		"rewrite_priority": "light",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "attachment-styles-and-enneagram-types",
		"path": "src/blog/enneagram/attachment-styles-and-enneagram-types.md",
		"category": "relationships",
		"scores": {
			"framing": 8.3,
			"enneagram_depth": 9.7,
			"evidence": 8,
			"utility": 9.6,
			"writing": 8.2,
			"originality": 6.5
		},
		"modifier_adjustment": -0.2,
		"modifier_reason": "Multi-type template fatigue detected (type section repetition); applied -0.2.",
		"safety_gate": "n/a",
		"overall": 9,
		"letter": "A",
		"publishable": true,
		"weakness_tags": ["template-fatigue", "overlap-duplication"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-compatibility-guide",
		"path": "src/blog/enneagram/enneagram-compatibility-guide.md",
		"category": "relationships",
		"scores": {
			"framing": 7.9,
			"enneagram_depth": 9.7,
			"evidence": 8.1,
			"utility": 8.6,
			"writing": 8,
			"originality": 7
		},
		"modifier_adjustment": -0.2,
		"modifier_reason": "Multi-type template fatigue detected (type section repetition); applied -0.2.",
		"safety_gate": "n/a",
		"overall": 8.8,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["template-fatigue", "overlap-duplication"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-compatibility-matrix",
		"path": "src/blog/enneagram/enneagram-compatibility-matrix.md",
		"category": "relationships",
		"scores": {
			"framing": 7.8,
			"enneagram_depth": 9.4,
			"evidence": 7.8,
			"utility": 8.5,
			"writing": 8,
			"originality": 6.5
		},
		"modifier_adjustment": -0.2,
		"modifier_reason": "Multi-type template fatigue detected (type section repetition); applied -0.2.",
		"safety_gate": "n/a",
		"overall": 8.6,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["template-fatigue", "overlap-duplication"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-dating-guide-for-men",
		"path": "src/blog/enneagram/enneagram-dating-guide-for-men.md",
		"category": "relationships",
		"scores": {
			"framing": 7.3,
			"enneagram_depth": 9.2,
			"evidence": 7.8,
			"utility": 9.5,
			"writing": 7.9,
			"originality": 6.1
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.8,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["weak-hook"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-dating-guide-for-women",
		"path": "src/blog/enneagram/enneagram-dating-guide-for-women.md",
		"category": "relationships",
		"scores": {
			"framing": 6.9,
			"enneagram_depth": 9.7,
			"evidence": 8,
			"utility": 9.2,
			"writing": 7.9,
			"originality": 5.8
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.7,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["weak-hook"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-types-in-relationships",
		"path": "src/blog/enneagram/enneagram-types-in-relationships.md",
		"category": "relationships",
		"scores": {
			"framing": 7.4,
			"enneagram_depth": 9.7,
			"evidence": 8,
			"utility": 9.9,
			"writing": 7.7,
			"originality": 6.7
		},
		"modifier_adjustment": -0.4,
		"modifier_reason": "Multi-type template fatigue detected (type section repetition); applied -0.4.",
		"safety_gate": "n/a",
		"overall": 8.6,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["weak-hook", "template-fatigue", "overlap-duplication"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-types-on-a-first-date",
		"path": "src/blog/enneagram/enneagram-types-on-a-first-date.md",
		"category": "relationships",
		"scores": {
			"framing": 7.9,
			"enneagram_depth": 9.7,
			"evidence": 8,
			"utility": 8.5,
			"writing": 8,
			"originality": 6.6
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.9,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": [],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "how-to-apologize-like-a-pro",
		"path": "src/blog/enneagram/how-to-apologize-like-a-pro.md",
		"category": "relationships",
		"scores": {
			"framing": 6.8,
			"enneagram_depth": 9,
			"evidence": 5.4,
			"utility": 9.2,
			"writing": 7.4,
			"originality": 6
		},
		"modifier_adjustment": -0.3,
		"modifier_reason": "Multi-type template fatigue detected (type section repetition); applied -0.3.",
		"safety_gate": "n/a",
		"overall": 7.8,
		"letter": "C",
		"publishable": false,
		"weakness_tags": ["weak-hook", "unsupported-claims", "style-friction", "template-fatigue"],
		"rewrite_priority": "major",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "how-to-navigate-early-relationship-stages",
		"path": "src/blog/enneagram/how-to-navigate-early-relationship-stages.md",
		"category": "relationships",
		"scores": {
			"framing": 6.9,
			"enneagram_depth": 9.7,
			"evidence": 7.8,
			"utility": 9.5,
			"writing": 7.9,
			"originality": 6.1
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.8,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["weak-hook"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "love-languages-and-enneagram-types",
		"path": "src/blog/enneagram/love-languages-and-enneagram-types.md",
		"category": "relationships",
		"scores": {
			"framing": 7.1,
			"enneagram_depth": 9.7,
			"evidence": 6.7,
			"utility": 9.2,
			"writing": 7.6,
			"originality": 6.2
		},
		"modifier_adjustment": -0.2,
		"modifier_reason": "Multi-type template fatigue detected (type section repetition); applied -0.2.",
		"safety_gate": "n/a",
		"overall": 8.4,
		"letter": "B",
		"publishable": false,
		"weakness_tags": ["weak-hook", "unsupported-claims", "template-fatigue", "overlap-duplication"],
		"rewrite_priority": "light",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "relationship-communication-guide",
		"path": "src/blog/enneagram/relationship-communication-guide.md",
		"category": "relationships",
		"scores": {
			"framing": 7.7,
			"enneagram_depth": 9.4,
			"evidence": 9.4,
			"utility": 8.2,
			"writing": 7.7,
			"originality": 6.8
		},
		"modifier_adjustment": -0.2,
		"modifier_reason": "Multi-type template fatigue detected (type section repetition); applied -0.2.",
		"safety_gate": "n/a",
		"overall": 8.8,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["template-fatigue", "overlap-duplication"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "why-dating-apps-are-harder-for-certain-personality-types",
		"path": "src/blog/enneagram/why-dating-apps-are-harder-for-certain-personality-types.md",
		"category": "relationships",
		"scores": {
			"framing": 7.5,
			"enneagram_depth": 8.3,
			"evidence": 7.8,
			"utility": 8.3,
			"writing": 8,
			"originality": 6.7
		},
		"modifier_adjustment": -0.2,
		"modifier_reason": "Multi-type template fatigue detected (type section repetition); applied -0.2.",
		"safety_gate": "n/a",
		"overall": 8.4,
		"letter": "B",
		"publishable": false,
		"weakness_tags": ["weak-hook", "template-fatigue"],
		"rewrite_priority": "light",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-leadership",
		"path": "src/blog/enneagram/enneagram-leadership.md",
		"category": "workplace",
		"scores": {
			"framing": 7.8,
			"enneagram_depth": 9.7,
			"evidence": 8.2,
			"utility": 9.6,
			"writing": 8,
			"originality": 5.5
		},
		"modifier_adjustment": -0.3,
		"modifier_reason": "Multi-type template fatigue detected (type section repetition); applied -0.3.",
		"safety_gate": "n/a",
		"overall": 8.6,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["template-fatigue"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-team-diversity",
		"path": "src/blog/enneagram/enneagram-team-diversity.md",
		"category": "workplace",
		"scores": {
			"framing": 7.3,
			"enneagram_depth": 7.7,
			"evidence": 8.2,
			"utility": 7.7,
			"writing": 7.4,
			"originality": 7.7
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.5,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["weak-hook", "style-friction"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-team-dynamics",
		"path": "src/blog/enneagram/enneagram-team-dynamics.md",
		"category": "workplace",
		"scores": {
			"framing": 7.1,
			"enneagram_depth": 9.4,
			"evidence": 8.1,
			"utility": 8.1,
			"writing": 7.4,
			"originality": 7.7
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.8,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["weak-hook", "style-friction"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-types-and-career-choices",
		"path": "src/blog/enneagram/enneagram-types-and-career-choices.md",
		"category": "workplace",
		"scores": {
			"framing": 7.8,
			"enneagram_depth": 9.6,
			"evidence": 8.2,
			"utility": 9.9,
			"writing": 7.7,
			"originality": 6.9
		},
		"modifier_adjustment": -0.4,
		"modifier_reason": "Multi-type template fatigue detected (type section repetition); applied -0.4.",
		"safety_gate": "n/a",
		"overall": 8.8,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["template-fatigue"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-types-working-in-teams",
		"path": "src/blog/enneagram/enneagram-types-working-in-teams.md",
		"category": "workplace",
		"scores": {
			"framing": 7.2,
			"enneagram_depth": 8.7,
			"evidence": 8,
			"utility": 9.3,
			"writing": 7.2,
			"originality": 6.8
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.7,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["weak-hook", "style-friction"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-workplace-team-building",
		"path": "src/blog/enneagram/enneagram-workplace-team-building.md",
		"category": "workplace",
		"scores": {
			"framing": 6.7,
			"enneagram_depth": 9.6,
			"evidence": 8,
			"utility": 9.1,
			"writing": 7.7,
			"originality": 6.8
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.8,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["weak-hook"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "90-day-personality-maxing-blueprint",
		"path": "src/blog/enneagram/90-day-personality-maxing-blueprint.md",
		"category": "development",
		"scores": {
			"framing": 7.8,
			"enneagram_depth": 9.7,
			"evidence": 8,
			"utility": 9.2,
			"writing": 7.5,
			"originality": 5.5
		},
		"modifier_adjustment": -0.3,
		"modifier_reason": "Multi-type template fatigue detected (type section repetition); applied -0.3.",
		"safety_gate": "n/a",
		"overall": 8.5,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["template-fatigue"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-communication-guide",
		"path": "src/blog/enneagram/enneagram-communication-guide.md",
		"category": "development",
		"scores": {
			"framing": 7.4,
			"enneagram_depth": 9.7,
			"evidence": 8.5,
			"utility": 9.9,
			"writing": 7.6,
			"originality": 6.4
		},
		"modifier_adjustment": -0.2,
		"modifier_reason": "Multi-type template fatigue detected (type section repetition); applied -0.2.",
		"safety_gate": "n/a",
		"overall": 8.9,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["weak-hook", "template-fatigue", "overlap-duplication"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-communication-styles",
		"path": "src/blog/enneagram/enneagram-communication-styles.md",
		"category": "development",
		"scores": {
			"framing": 7.9,
			"enneagram_depth": 9.3,
			"evidence": 8.2,
			"utility": 9.9,
			"writing": 8.2,
			"originality": 7.4
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 9.3,
		"letter": "A",
		"publishable": true,
		"weakness_tags": [],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-communication-tips",
		"path": "src/blog/enneagram/enneagram-communication-tips.md",
		"category": "development",
		"scores": {
			"framing": 8.5,
			"enneagram_depth": 9,
			"evidence": 8.2,
			"utility": 9.5,
			"writing": 8.2,
			"originality": 7
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 9.2,
		"letter": "A",
		"publishable": true,
		"weakness_tags": [],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-personal-growth",
		"path": "src/blog/enneagram/enneagram-personal-growth.md",
		"category": "development",
		"scores": {
			"framing": 6.7,
			"enneagram_depth": 9.3,
			"evidence": 7.9,
			"utility": 9.2,
			"writing": 7.9,
			"originality": 6.4
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.7,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["weak-hook"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-positive-self-talk",
		"path": "src/blog/enneagram/enneagram-positive-self-talk.md",
		"category": "development",
		"scores": {
			"framing": 7.7,
			"enneagram_depth": 9.7,
			"evidence": 6.6,
			"utility": 9.2,
			"writing": 7,
			"originality": 5.3
		},
		"modifier_adjustment": -0.3,
		"modifier_reason": "Multi-type template fatigue detected (type section repetition); applied -0.3.",
		"safety_gate": "n/a",
		"overall": 8.1,
		"letter": "B",
		"publishable": false,
		"weakness_tags": ["unsupported-claims", "style-friction", "template-fatigue"],
		"rewrite_priority": "light",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-self-development",
		"path": "src/blog/enneagram/enneagram-self-development.md",
		"category": "development",
		"scores": {
			"framing": 7.9,
			"enneagram_depth": 9.7,
			"evidence": 8.2,
			"utility": 9.9,
			"writing": 8,
			"originality": 7.2
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 9.3,
		"letter": "A",
		"publishable": true,
		"weakness_tags": [],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-strengths-and-weaknesses",
		"path": "src/blog/enneagram/enneagram-strengths-and-weaknesses.md",
		"category": "development",
		"scores": {
			"framing": 7.4,
			"enneagram_depth": 9.7,
			"evidence": 8.2,
			"utility": 9.9,
			"writing": 8,
			"originality": 6.5
		},
		"modifier_adjustment": -0.3,
		"modifier_reason": "Multi-type template fatigue detected (type section repetition); applied -0.3.",
		"safety_gate": "n/a",
		"overall": 8.8,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["weak-hook", "template-fatigue"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "shadow-work-by-enneagram-type",
		"path": "src/blog/enneagram/shadow-work-by-enneagram-type.md",
		"category": "development",
		"scores": {
			"framing": 7.8,
			"enneagram_depth": 9.7,
			"evidence": 7.3,
			"utility": 9.9,
			"writing": 7.5,
			"originality": 6.3
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.9,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["unsupported-claims"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "situations-change-emotions-dont",
		"path": "src/blog/enneagram/situations-change-emotions-dont.md",
		"category": "development",
		"scores": {
			"framing": 7.9,
			"enneagram_depth": 7.9,
			"evidence": 7.6,
			"utility": 7.8,
			"writing": 7,
			"originality": 7.7
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.5,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["style-friction"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "anxiety-and-enneagram-types-guide",
		"path": "src/blog/enneagram/anxiety-and-enneagram-types-guide.md",
		"category": "situational",
		"scores": {
			"framing": 5.9,
			"enneagram_depth": 9.7,
			"evidence": 7,
			"utility": 9.2,
			"writing": 7.2,
			"originality": 6.6
		},
		"modifier_adjustment": -0.2,
		"modifier_reason": "Multi-type template fatigue detected (type section repetition); applied -0.2.",
		"safety_gate": "n/a",
		"overall": 8.2,
		"letter": "B",
		"publishable": false,
		"weakness_tags": ["weak-hook", "unsupported-claims", "style-friction", "template-fatigue"],
		"rewrite_priority": "light",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "astrology-and-the-enneagram",
		"path": "src/blog/enneagram/astrology-and-the-enneagram.md",
		"category": "situational",
		"scores": {
			"framing": 8.2,
			"enneagram_depth": 9.7,
			"evidence": 8.1,
			"utility": 7.5,
			"writing": 7.3,
			"originality": 7.4
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.8,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["style-friction"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "biggest-compliments-to-give-each-enneagram-type",
		"path": "src/blog/enneagram/biggest-compliments-to-give-each-enneagram-type.md",
		"category": "situational",
		"scores": {
			"framing": 7.8,
			"enneagram_depth": 8.9,
			"evidence": 7.8,
			"utility": 7.7,
			"writing": 7.4,
			"originality": 6.6
		},
		"modifier_adjustment": -0.4,
		"modifier_reason": "Multi-type template fatigue detected (type section repetition); applied -0.4.",
		"safety_gate": "n/a",
		"overall": 8.1,
		"letter": "B",
		"publishable": false,
		"weakness_tags": ["style-friction", "template-fatigue"],
		"rewrite_priority": "light",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-and-adhd-which-types-struggle-most",
		"path": "src/blog/enneagram/enneagram-and-adhd-which-types-struggle-most.md",
		"category": "situational",
		"scores": {
			"framing": 7.4,
			"enneagram_depth": 9.7,
			"evidence": 8,
			"utility": 9.9,
			"writing": 8.2,
			"originality": 6.3
		},
		"modifier_adjustment": -0.2,
		"modifier_reason": "Multi-type template fatigue detected (type section repetition); applied -0.2.",
		"safety_gate": "n/a",
		"overall": 8.8,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["weak-hook", "template-fatigue"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-and-mental-illness",
		"path": "src/blog/enneagram/enneagram-and-mental-illness.md",
		"category": "situational",
		"scores": {
			"framing": 7.9,
			"enneagram_depth": 9.7,
			"evidence": 9.3,
			"utility": 9.9,
			"writing": 8,
			"originality": 7.1
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 9.5,
		"letter": "A+",
		"publishable": true,
		"weakness_tags": [],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-anxiety-management-guide",
		"path": "src/blog/enneagram/enneagram-anxiety-management-guide.md",
		"category": "situational",
		"scores": {
			"framing": 7.9,
			"enneagram_depth": 9.7,
			"evidence": 6.6,
			"utility": 9.9,
			"writing": 8,
			"originality": 5.2
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.7,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["unsupported-claims"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-childhood-stereotypes",
		"path": "src/blog/enneagram/enneagram-childhood-stereotypes.md",
		"category": "situational",
		"scores": {
			"framing": 7.9,
			"enneagram_depth": 8.2,
			"evidence": 7.6,
			"utility": 5.9,
			"writing": 7.3,
			"originality": 7.3
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.2,
		"letter": "B",
		"publishable": false,
		"weakness_tags": ["low-utility", "style-friction"],
		"rewrite_priority": "light",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-mental-health-flags",
		"path": "src/blog/enneagram/enneagram-mental-health-flags.md",
		"category": "situational",
		"scores": {
			"framing": 6.9,
			"enneagram_depth": 9,
			"evidence": 8.1,
			"utility": 9.5,
			"writing": 7.7,
			"originality": 7.3
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.9,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["weak-hook"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-parenting-styles",
		"path": "src/blog/enneagram/enneagram-parenting-styles.md",
		"category": "situational",
		"scores": {
			"framing": 7.9,
			"enneagram_depth": 9.7,
			"evidence": 8,
			"utility": 9.9,
			"writing": 8,
			"originality": 5.4
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.9,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": [],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-party-planner",
		"path": "src/blog/enneagram/enneagram-party-planner.md",
		"category": "situational",
		"scores": {
			"framing": 8,
			"enneagram_depth": 8.4,
			"evidence": 8,
			"utility": 8,
			"writing": 7.7,
			"originality": 6.8
		},
		"modifier_adjustment": -0.4,
		"modifier_reason": "Multi-type template fatigue detected (type section repetition); applied -0.4.",
		"safety_gate": "n/a",
		"overall": 8.2,
		"letter": "B",
		"publishable": false,
		"weakness_tags": ["template-fatigue"],
		"rewrite_priority": "light",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-types-at-party",
		"path": "src/blog/enneagram/enneagram-types-at-party.md",
		"category": "situational",
		"scores": {
			"framing": 7.9,
			"enneagram_depth": 9.6,
			"evidence": 8.2,
			"utility": 8.5,
			"writing": 7.7,
			"originality": 5.5
		},
		"modifier_adjustment": -0.7,
		"modifier_reason": "Multi-type template fatigue detected (type section repetition); applied -0.7.",
		"safety_gate": "n/a",
		"overall": 8,
		"letter": "B",
		"publishable": false,
		"weakness_tags": ["template-fatigue"],
		"rewrite_priority": "light",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-types-being-ghosted",
		"path": "src/blog/enneagram/enneagram-types-being-ghosted.md",
		"category": "situational",
		"scores": {
			"framing": 8,
			"enneagram_depth": 9.7,
			"evidence": 8.2,
			"utility": 9.8,
			"writing": 8.2,
			"originality": 7.1
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 9.3,
		"letter": "A",
		"publishable": true,
		"weakness_tags": [],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "enneagram-types-in-stress",
		"path": "src/blog/enneagram/enneagram-types-in-stress.md",
		"category": "situational",
		"scores": {
			"framing": 7.9,
			"enneagram_depth": 9.6,
			"evidence": 8.2,
			"utility": 9.9,
			"writing": 8,
			"originality": 7
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 9.2,
		"letter": "A",
		"publishable": true,
		"weakness_tags": [],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "first-impression-enneagram-playbook",
		"path": "src/blog/enneagram/first-impression-enneagram-playbook.md",
		"category": "situational",
		"scores": {
			"framing": 7.5,
			"enneagram_depth": 9.6,
			"evidence": 7.8,
			"utility": 9.5,
			"writing": 7.9,
			"originality": 6.7
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 9,
		"letter": "A",
		"publishable": true,
		"weakness_tags": [],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "how-each-enneagram-flexes",
		"path": "src/blog/enneagram/how-each-enneagram-flexes.md",
		"category": "situational",
		"scores": {
			"framing": 7.2,
			"enneagram_depth": 9.1,
			"evidence": 8.1,
			"utility": 6.6,
			"writing": 7.9,
			"originality": 7.5
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.6,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["weak-hook", "low-utility"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "how-each-enneagram-type-manipulates",
		"path": "src/blog/enneagram/how-each-enneagram-type-manipulates.md",
		"category": "situational",
		"scores": {
			"framing": 7.4,
			"enneagram_depth": 9.7,
			"evidence": 8.1,
			"utility": 9.9,
			"writing": 8,
			"originality": 7.2
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 9.2,
		"letter": "A",
		"publishable": true,
		"weakness_tags": ["weak-hook"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "how-each-enneagram-type-self-sabotages-success",
		"path": "src/blog/enneagram/how-each-enneagram-type-self-sabotages-success.md",
		"category": "situational",
		"scores": {
			"framing": 7.4,
			"enneagram_depth": 9.7,
			"evidence": 8,
			"utility": 9.9,
			"writing": 8,
			"originality": 6.7
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 9.1,
		"letter": "A",
		"publishable": true,
		"weakness_tags": ["weak-hook"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "how-each-enneagram-type-unwinds",
		"path": "src/blog/enneagram/how-each-enneagram-type-unwinds.md",
		"category": "situational",
		"scores": {
			"framing": 7,
			"enneagram_depth": 9.7,
			"evidence": 8,
			"utility": 9.2,
			"writing": 7.9,
			"originality": 6.2
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.8,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["weak-hook"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "how-type-8-challengers-actually-succeed",
		"path": "src/blog/enneagram/how-type-8-challengers-actually-succeed.md",
		"category": "situational",
		"scores": {
			"framing": 7.4,
			"enneagram_depth": 9.7,
			"evidence": 8,
			"utility": 7.6,
			"writing": 7.6,
			"originality": 6.8
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.7,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["weak-hook"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "neurodiversity-vs-personality",
		"path": "src/blog/enneagram/neurodiversity-vs-personality.md",
		"category": "situational",
		"scores": {
			"framing": 6.1,
			"enneagram_depth": 8.4,
			"evidence": 8.5,
			"utility": 5.9,
			"writing": 6.4,
			"originality": 7.1
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 7.8,
		"letter": "C",
		"publishable": false,
		"weakness_tags": ["weak-hook", "low-utility", "style-friction"],
		"rewrite_priority": "major",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "oversharing-psychology-shame-boundaries",
		"path": "src/blog/enneagram/oversharing-psychology-shame-boundaries.md",
		"category": "situational",
		"scores": {
			"framing": 8.3,
			"enneagram_depth": 8.6,
			"evidence": 7.8,
			"utility": 7,
			"writing": 8,
			"originality": 6.6
		},
		"modifier_adjustment": -0.2,
		"modifier_reason": "Multi-type template fatigue detected (type section repetition); applied -0.2.",
		"safety_gate": "n/a",
		"overall": 8.3,
		"letter": "B",
		"publishable": false,
		"weakness_tags": ["low-utility", "template-fatigue"],
		"rewrite_priority": "light",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "personality-maxing",
		"path": "src/blog/enneagram/personality-maxing.md",
		"category": "situational",
		"scores": {
			"framing": 7.3,
			"enneagram_depth": 9.7,
			"evidence": 8,
			"utility": 9.2,
			"writing": 7.9,
			"originality": 5.9
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.8,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["weak-hook"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "red-flags-dating-each-enneagram-type",
		"path": "src/blog/enneagram/red-flags-dating-each-enneagram-type.md",
		"category": "situational",
		"scores": {
			"framing": 7.9,
			"enneagram_depth": 9.7,
			"evidence": 8,
			"utility": 9.9,
			"writing": 8.2,
			"originality": 6.7
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 9.2,
		"letter": "A",
		"publishable": true,
		"weakness_tags": [],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "toxic-traits-of-each-enneagram-type",
		"path": "src/blog/enneagram/toxic-traits-of-each-enneagram-type.md",
		"category": "situational",
		"scores": {
			"framing": 8,
			"enneagram_depth": 9.7,
			"evidence": 8,
			"utility": 9.9,
			"writing": 8,
			"originality": 6.9
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 9.2,
		"letter": "A",
		"publishable": true,
		"weakness_tags": [],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "toxic-traits-relationships-warning-signs",
		"path": "src/blog/enneagram/toxic-traits-relationships-warning-signs.md",
		"category": "situational",
		"scores": {
			"framing": 8.1,
			"enneagram_depth": 9.7,
			"evidence": 8,
			"utility": 8.2,
			"writing": 8,
			"originality": 6.8
		},
		"modifier_adjustment": -0.2,
		"modifier_reason": "Multi-type template fatigue detected (type section repetition); applied -0.2.",
		"safety_gate": "n/a",
		"overall": 8.7,
		"letter": "B+",
		"publishable": true,
		"weakness_tags": ["template-fatigue"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "why-the-next-thing-wont-fix-it-type-7",
		"path": "src/blog/enneagram/why-the-next-thing-wont-fix-it-type-7.md",
		"category": "situational",
		"scores": {
			"framing": 7.9,
			"enneagram_depth": 9.1,
			"evidence": 6.4,
			"utility": 6.6,
			"writing": 7.6,
			"originality": 6.9
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 8.2,
		"letter": "B",
		"publishable": false,
		"weakness_tags": ["unsupported-claims", "low-utility"],
		"rewrite_priority": "light",
		"graded_at": "2026-02-22"
	},
	{
		"slug": "why-you-cant-stop-overthinking-enneagram",
		"path": "src/blog/enneagram/why-you-cant-stop-overthinking-enneagram.md",
		"category": "situational",
		"scores": {
			"framing": 7.5,
			"enneagram_depth": 9.7,
			"evidence": 8.8,
			"utility": 9.9,
			"writing": 8.2,
			"originality": 7.1
		},
		"modifier_adjustment": 0,
		"modifier_reason": "None",
		"safety_gate": "n/a",
		"overall": 9.3,
		"letter": "A",
		"publishable": true,
		"weakness_tags": ["weak-hook"],
		"rewrite_priority": "none",
		"graded_at": "2026-02-22"
	}
]
```
