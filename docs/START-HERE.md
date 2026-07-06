<!-- docs/START-HERE.md -->

# 9takes Start Here

Last updated: 2026-07-06  
Status: active operating brief

## One Sentence Strategy

9takes has working content demand, especially personality-analysis and
Enneagram authority pages. The current bottleneck is converting that attention
into reliable product action, email capture, distribution, and repeatable
publishing.

## Current Truths

Use dated evidence. Do not repeat old December 2025 or Q1 2026 numbers as
current.

| Area                  | Current read                                                                                                                                                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| People/profile corpus | [`docs/data/corpus-stats.md`](./data/corpus-stats.md) generated 2026-07-06: 378 published profiles, 131 drafts, 22 profiles published in the last 30 days, 106 in the last 90 days.                                                                           |
| Blog cross-links      | [`docs/BLOG-CROSSLINK-INDEX.md`](./BLOG-CROSSLINK-INDEX.md) generated 2026-07-06: 190 posts analyzed, 26 completely isolated, 27 with no outgoing links, 42 with no incoming links.                                                                           |
| Marketing status      | [`docs/daily-briefs/2026-07-06_marketing-status.md`](./daily-briefs/2026-07-06_marketing-status.md): people automation regressed on `oliver-tree`, Instagram session is blocked, Quora is dark since 2026-05-19, distribution packets are queued but unfired. |
| Growth data           | [`docs/growth/growth-log.md`](./growth/growth-log.md) newest audit is 2026-07-01, so activation metrics are stale as of 2026-07-06. Signup spam hardening exists, but real activation still needs fresh measurement.                                          |
| Product pillars       | [`docs/audits/2026-06-11_state-of-9takes.md`](./audits/2026-06-11_state-of-9takes.md): content works as a traffic engine; Q&A, coaching, and email capture are under-converting.                                                                              |
| Design system         | [`docs/design-system.md`](./design-system.md): Streetlamp Symposium V5 is the current source of truth. Old purple, teal-primary, Solo Leveling, and Noticia Text docs are historical only unless explicitly called out.                                       |

## Current Priorities

1. Stabilize people automation before increasing volume.
   The July 6 brief shows two failed `oliver-tree` runs where Stage 1 failed but later stages still advanced against a missing draft. Fix hard-stop behavior first, then fix the `pnpm gen:all` path if the Supabase CLI dependency is still missing.

2. Convert content attention above the fold.
   Personality-analysis and Enneagram pages have the traffic. The June growth review says the signup/give-first mechanics are too low on the page and under-instrumented. Put one high-intent action near the first viewport and instrument `shown -> submitted`.

3. Repair internal-link gaps.
   Start with the 26 isolated posts in [`BLOG-CROSSLINK-INDEX.md`](./BLOG-CROSSLINK-INDEX.md), especially the pop-culture cluster.

4. Restore distribution only after the publishing path is stable.
   Nine launch packets are queued in [`distribution-assets/LAUNCH-CHECKLIST.md`](./distribution-assets/LAUNCH-CHECKLIST.md). Do not add more strategy docs until there is send/post evidence.

5. Pull fresh GSC before making SEO performance claims.
   The July 6 brief says the repo GSC export is still dated 2026-06-11.

## What To Stop Doing

- Do not cite old December 2025 dashboards as current state.
- Do not create new plans when an existing active plan or status brief already names the bottleneck.
- Do not publish content without a distribution or internal-link follow-up.
- Do not use archived design docs for current UI guidance.
- Do not hand-write corpus totals. Use [`data/corpus-stats.md`](./data/corpus-stats.md).

## Content Guidance

The durable content insight still holds: people search for problems, not static
type descriptions.

For Enneagram/topical posts:

- Lead with the problem the reader is trying to solve.
- Add a direct `<QuickAnswer>` near the top for snippet and AI-search clarity.
- Use type-specific application only after the reader knows why the topic matters.
- Add 3-5 internal links before publishing.

For personality-analysis posts:

- Keep the dual-title model: `title` for the page, `meta_title` for search/social.
- Use a concrete life moment as the entry point, then tie it to the Enneagram pattern.
- Prefer respectful analysis over certainty theater. The type is the lens, not the person.
- After publish, update launch packets and internal links.

Current component notes:

- `<QuickAnswer>` renders through the shared [`Callout`](../src/lib/components/blog/callouts/Callout.svelte) shell with the `lamp` tone by default. It is not the retired pre-V5 box anymore.
- `<TypeQuotes>` also renders through the shared callout shell unless `variant="minimal"` is used.
- `PopCard` is for image/person cards, not plain text quotes.

## Daily Operating Loop

1. Check the newest status brief or relevant generated file.
2. Pick one bottleneck: automation, conversion, cross-links, distribution, or content quality.
3. Make the smallest concrete change that moves that bottleneck.
4. Update the relevant tracker or status doc with date and evidence.
5. Avoid new strategy docs unless the existing docs cannot answer the decision.

## Active Docs

| Need                     | Link                                                                                           |
| ------------------------ | ---------------------------------------------------------------------------------------------- |
| Docs hub                 | [`README.md`](./README.md)                                                                     |
| Project overview         | [`project-docs/00-project-overview.md`](./project-docs/00-project-overview.md)                 |
| Current marketing status | [`daily-briefs/2026-07-06_marketing-status.md`](./daily-briefs/2026-07-06_marketing-status.md) |
| Growth log               | [`growth/growth-log.md`](./growth/growth-log.md)                                               |
| Writing workflow         | [`writing-system/README.md`](./writing-system/README.md)                                       |
| SEO/content analysis     | [`content-analysis/README.md`](./content-analysis/README.md)                                   |
| Distribution checklist   | [`distribution-assets/LAUNCH-CHECKLIST.md`](./distribution-assets/LAUNCH-CHECKLIST.md)         |
| Design system            | [`design-system.md`](./design-system.md)                                                       |
| Annual strategy          | [`planning/2026-annual-strategy.md`](./planning/2026-annual-strategy.md)                       |

## Historical Context

Old plans remain useful for context, but they are not current operating truth:

- [`archives/30-DAY-ACTION-PLAN-DEC-2025.md`](./archives/30-DAY-ACTION-PLAN-DEC-2025.md)
- [`planning/q1-2026-content-pipeline.md`](./planning/q1-2026-content-pipeline.md)
- [`archives/domain-authority-feb-2026/00-master-index.md`](./archives/domain-authority-feb-2026/00-master-index.md)
