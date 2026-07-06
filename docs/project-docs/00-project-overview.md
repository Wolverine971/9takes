<!-- docs/project-docs/00-project-overview.md -->

# 9takes Project Overview

Last modified: 2026-07-06  
Purpose: current platform overview for onboarding, strategy, and agent context

## What 9takes Is

9takes is a personality-based Q&A and content platform built around the
Enneagram. The core promise is: one situation, nine ways to see it.

The product combines:

- Anonymous questions and comments with a give-first mechanic.
- SEO-driven Enneagram and personality-analysis content.
- A large database of famous-person personality analyses.
- Admin tooling for content, analytics, email, and publishing workflows.
- Early coaching/consulting infrastructure that is built but not yet proven as a channel.

For the detailed route, API, server module, and command map, use
[`../../CLAUDE.md`](../../CLAUDE.md).

## Current State

Use these dated sources before making claims:

| Source                                                                                             | Why it matters                                              |
| -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| [`../daily-briefs/2026-07-06_marketing-status.md`](../daily-briefs/2026-07-06_marketing-status.md) | Freshest cross-channel operating brief.                     |
| [`../audits/2026-06-11_state-of-9takes.md`](../audits/2026-06-11_state-of-9takes.md)               | Evidence snapshot across content, Q&A, coaching, and email. |
| [`../data/corpus-stats.md`](../data/corpus-stats.md)                                               | Generated people-corpus stats.                              |
| [`../BLOG-CROSSLINK-INDEX.md`](../BLOG-CROSSLINK-INDEX.md)                                         | Generated internal-link health.                             |
| [`../growth/growth-log.md`](../growth/growth-log.md)                                               | Growth experiments and activation audits.                   |

As of the July 2026 docs:

- Content is the working demand engine.
- Personality-analysis and Enneagram authority pages carry most of the attention.
- Q&A, coaching, and email capture are under-converting relative to traffic.
- People-profile automation is productive but currently fragile.
- Distribution and Quora have stalled; Instagram depends on session reliability.

## Product Pillars

| Pillar                      | Current read                                                                                                                       |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Personality analysis        | Largest content surface and strongest discovery engine. Current generated corpus stats list 378 published profiles and 131 drafts. |
| Enneagram authority content | Highest-quality organic attention surface in the June state audit. Use problem-led posts, not static type descriptions.            |
| Q&A platform                | Structurally central to the concept, but low current usage. Give-first mechanics need better placement and instrumentation.        |
| Email                       | Sequence machinery exists, but list growth is constrained by weak capture and signup quality history.                              |
| Coaching / consulting       | Infrastructure exists; demand generation is dormant. Do not describe this as a validated revenue line without fresh evidence.      |
| Distribution                | Launch assets exist, but send/post evidence is missing for queued packets.                                                         |

## Architecture

| Layer      | Current implementation                                                                        |
| ---------- | --------------------------------------------------------------------------------------------- |
| Framework  | SvelteKit 2, Svelte 5, TypeScript                                                             |
| Database   | Supabase/Postgres with generated `database.types.ts` at repo root                             |
| Search     | Elasticsearch for questions, Supabase FTS/blog indexing for content                           |
| Content    | MDsvex for most blog sections; `blogs_famous_people` table for published personality analyses |
| Styling    | TailwindCSS + SCSS; Streetlamp Symposium V5 tokens are canonical                              |
| Email      | Custom sequence engine in `src/lib/email/` and cron endpoints                                 |
| Deployment | Vercel via `@sveltejs/adapter-vercel`                                                         |

## Content Sources

| Route family            | Source                                                                                 |
| ----------------------- | -------------------------------------------------------------------------------------- |
| `/community`            | `src/blog/community/` MDsvex                                                           |
| `/enneagram-corner`     | `src/blog/enneagram/` MDsvex                                                           |
| `/how-to-guides`        | `src/blog/guides/` MDsvex                                                              |
| `/pop-culture`          | `src/blog/pop-culture/` MDsvex                                                         |
| `/personality-analysis` | Supabase `blogs_famous_people` table; drafts are mirrored in `src/blog/people/drafts/` |

## Current Engineering Priorities

1. Stabilize blog/person automation failure handling.
2. Fix or document the `pnpm gen:all` dependency path if the Supabase CLI remains missing.
3. Instrument give-first conversion flows end to end.
4. Keep generated data files current: corpus stats, sitemap, famous types, and cross-link index.
5. Continue CSS/design cleanup from the current V5 design system, not archived visual directions.

## Current Growth Priorities

1. Move a high-intent action above the fold on content pages.
2. Repair isolated posts and no-outgoing-link posts.
3. Restore Instagram session durability before counting daily warmups as reliable.
4. Decide whether to revive or retire Quora after the 2026-05-19 stall.
5. Pull fresh GSC before judging current SEO pace.

## Key Docs

| Need              | Link                                                                                                             |
| ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| Docs hub          | [`../README.md`](../README.md)                                                                                   |
| Operating brief   | [`../START-HERE.md`](../START-HERE.md)                                                                           |
| Technical map     | [`../../CLAUDE.md`](../../CLAUDE.md)                                                                             |
| Writing system    | [`../writing-system/README.md`](../writing-system/README.md)                                                     |
| Content analysis  | [`../content-analysis/README.md`](../content-analysis/README.md)                                                 |
| SEO audit         | [`../audits/seo-audit-9takes-2026-04-07.md`](../audits/seo-audit-9takes-2026-04-07.md)                           |
| Brand positioning | [`../brand/brand-positioning.md`](../brand/brand-positioning.md)                                                 |
| Design system     | [`../design-system.md`](../design-system.md)                                                                     |
| Admin style audit | [`../design/admin-style-audit.md`](../design/admin-style-audit.md)                                               |
| Outreach playbook | [`../outreach/personality-analysis-outreach-playbook.md`](../outreach/personality-analysis-outreach-playbook.md) |

## Notes

- Do not use the old project overview's unvalidated revenue targets or product
  SKUs. Those claims were removed because the newer audits do not support them.
- If a metric has no fresh source, label it stale or unknown.
- If a doc contradicts `docs/design-system.md` on UI identity, treat it as
  historical unless it has a newer date and explicitly says otherwise.
