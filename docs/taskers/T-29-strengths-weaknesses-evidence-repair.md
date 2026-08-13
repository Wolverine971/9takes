<!-- docs/taskers/T-29-strengths-weaknesses-evidence-repair.md -->

# Tasker: Repair the Evidence in Enneagram Strengths and Weaknesses

**For:** Evidence audit and editorial repair agent  
**Owner:** DJ  
**Created:** 2026-08-13  
**Status:** Done 2026-08-13. Evidence repair and audit report implemented; `pnpm check` and production compilation passed.
**Related:** `docs/content-analysis/2026-07-15_enneagram-blog-audit.md`, `docs/seo/2026-08-13-winners-and-declines-refresh.md`, `src/blog/enneagram/enneagram-strengths-and-weaknesses.md`

## 0. What and why

The live strengths-and-weaknesses page ranks near the first page, but its body contains nine invented named case studies presented as real-world evidence. The clearest fabricated outcomes include a team's productivity doubling, stress falling 50 percent, and team performance improving 40 percent. Other sections use unsupported claims such as influence skyrocketing, a campaign going viral, and completion rates soaring.

This task repairs the evidence and the repetitive nine-slot structure without sacrificing the search promise. The reader should still get a practical comparison of all nine types, but no fictional person, invented result, or unsupported causal claim may masquerade as observed evidence.

The current search baseline from T-27 was 6 clicks, 518 impressions, 1.16 percent CTR, and average position 9.0 in the latest 28-day window. Preserve the useful headings and passage anchors unless a change is necessary for accuracy.

## 1. Required reading

1. `CLAUDE.md`
2. `docs/taskers/README.md`
3. `docs/content-analysis/2026-07-15_enneagram-blog-audit.md`, especially the finding for this page
4. `docs/seo/2026-08-13-winners-and-declines-refresh.md`
5. `docs/taskers/T-13-deai-top-traffic-enneagram-pages.md`
6. The complete current `src/blog/enneagram/enneagram-strengths-and-weaknesses.md`
7. Current GSC rows for this page and its passage fragments

Run `git status --short` first. Never modify `lastmod`. Preserve unrelated work.

## 2. Evidence audit

Inventory every item in the body, FAQ, structured data, and frontmatter that falls into one of these classes:

- a named anecdote or purported real-world example;
- a percentage, rate, multiplier, timeframe, or quantified outcome;
- a claim that a tactic caused productivity, retention, influence, engagement, performance, or satisfaction to improve;
- an external psychological or workplace claim;
- a categorical statement about what a type always does; and
- a search-visible claim that the article cannot support.

Classify each as sourced and verified, 9takes editorial interpretation, explicitly hypothetical illustration, or unsupported. Unsupported material must be removed or rewritten. Do not add citations merely to decorate generic Enneagram doctrine.

## 3. Repair contract

Remove all nine fabricated named examples, including Sarah, Marcus, Jennifer, Alex, David, Lisa, Tom, Maria, and James when they are acting as purported case studies. Remove every invented outcome attached to them.

Replace the repeated case-study slot with a more honest and useful pattern:

1. the strength in a concrete context;
2. how the same strength becomes a shadow;
3. an observable warning sign;
4. one bounded counter-move; and
5. a plain hypothetical example only when needed, labeled as an example rather than a real person or measured result.

Do not promise that a tactic will produce a numerical or guaranteed outcome. Do not turn each type into a diagnosis. Break enough of the repeated template that the sections read as nine distinct patterns rather than one paragraph with the type number swapped.

Preserve any newly deployed, accurate `meta_title` and description unless fresh GSC evidence shows a problem. Do not retitle, reslug, change publication state, or rewrite the page into a different search intent.

## 4. Source and editorial rules

- Use primary or authoritative sources for any research claim that survives.
- A useful editorial interpretation can remain without pretending to be scientific evidence.
- Make observation, interpretation, and advice visibly distinct.
- No em dashes.
- No internal quality comments or reviewer notes in the published source.
- Do not change FAQ or JSON-LD claims without checking that the visible article supports the same answer.
- Keep advice practical, non-clinical, and free of guaranteed outcomes.

## 5. Deliverable

Implement the repair and create `docs/content-analysis/2026-08-13-strengths-weaknesses-evidence-repair.md` containing:

1. every removed or corrected unsupported claim;
2. any external sources retained;
3. the structural changes made;
4. search-facing fields preserved or changed;
5. before and after counts for named anecdotes, unsupported metrics, em dashes, and internal notes; and
6. a 28-day measurement plan.

## Verification checklist

- [x] All nine fabricated named case studies are gone.
- [x] No unsupported percentage, multiplier, or causal outcome remains.
- [x] Visible article, FAQ, and structured data agree.
- [x] Search-relevant headings and fragments are preserved unless the report explains the change.
- [x] `lastmod`, slug, canonical, and publication state are unchanged.
- [x] Zero em dashes and no quality-comment markers remain.
- [x] Relevant content lint, formatting, `pnpm check`, and production compilation pass.
- [x] The report distinguishes facts, editorial interpretation, and hypothetical examples.

## Risks and gotchas

The page already ranks. A total rewrite can erase useful passage relevance while fixing the evidence. Repair the liabilities first, then improve structure only where repetition obstructs comprehension. Do not replace fake case studies with fake composites, unattributed client stories, or invented 9takes community data.

## Definition of done

The page still satisfies the strengths-and-weaknesses query, all fabricated evidence and invented outcomes are removed, the nine sections are materially less templated, checks pass, and the change log makes every evidence decision auditable.

## What was actually done

The nine fabricated case studies and their claimed outcomes were removed. Each type section now uses a concrete context, a shadow, an observable warning sign, and a bounded counter-move. Type 4 and Type 8 retain only clearly labeled hypothetical illustrations with no measured result. The inaccurate description and preview copy changed; title, headings, fragment anchors, links, URL, publication state, date, and `lastmod` stayed fixed.

The full evidence inventory, retained source, before-and-after counts, current GSC passage baseline, field-level change log, and 28-day plan are in `docs/content-analysis/2026-08-13-strengths-weaknesses-evidence-repair.md`.

Verification returned zero fabricated names, unsupported outcome markers, em dashes, en dashes, and article HTML comments. JSON-LD parses with seven FAQs. `pnpm check` passed with 0 errors and 132 pre-existing warnings. The production server and client builds passed. The final budget step reported a protected portrait library of 57.96 MiB against 57.60 MiB and 1,112 files against 1,110, an unrelated overage of 364.61 KiB and 2 files.

DJ's subsequent portrait-budget pipeline fix in commit `9aa6e63c` accepted the intentional portrait baseline. The current full budget check passes.

The flat `quality_*` metadata remains unchanged because T-03 prohibits editing it until DJ decides whether to delete or wire that schema.
