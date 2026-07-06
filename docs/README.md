---
title: '9takes Documentation Hub'
description: 'Master index and phonebook for active 9takes documentation'
last_modified: 2026-07-06
status: active
category: hub
path: docs/README.md
---

# 9takes Documentation Hub

This is the active docs phonebook. Dated audits, old channel logs, and completed
plans belong in `docs/archives/` or a dated subfolder; do not treat archived docs
as current operating guidance unless a live doc links to them explicitly.

## Start Here

| Need                                         | Go to                                                                                                                                                                                                 |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Current priorities and operating status      | [`START-HERE.md`](./START-HERE.md)                                                                                                                                                                    |
| Product, architecture, and business overview | [`project-docs/00-project-overview.md`](./project-docs/00-project-overview.md)                                                                                                                        |
| Current marketing/channel status             | [`daily-briefs/2026-07-06_marketing-status.md`](./daily-briefs/2026-07-06_marketing-status.md)                                                                                                        |
| Evidence snapshot across product pillars     | [`audits/2026-06-11_state-of-9takes.md`](./audits/2026-06-11_state-of-9takes.md)                                                                                                                      |
| Documentation cleanup history                | [`audits/2026-06-11_documentation-audit.md`](./audits/2026-06-11_documentation-audit.md) and [`development/project-cleanup-report-2026-07-06.md`](./development/project-cleanup-report-2026-07-06.md) |

## Workflows

| Task                              | Primary docs                                                                                                                                                                                                                                                                                                   |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Write or refresh a blog           | [`writing-system/README.md`](./writing-system/README.md), [`writing-system/01-content-creation-workflow.md`](./writing-system/01-content-creation-workflow.md), [`templates/content-creation-checklist.md`](./templates/content-creation-checklist.md)                                                         |
| Optimize SEO / AI citations       | [`content-analysis/README.md`](./content-analysis/README.md), [`content-analysis/ai-search-optimization-guide.md`](./content-analysis/ai-search-optimization-guide.md), [`content-analysis/seo-optimization-checklist.md`](./content-analysis/seo-optimization-checklist.md)                                   |
| Fix internal links                | [`BLOG-CROSSLINK-INDEX.md`](./BLOG-CROSSLINK-INDEX.md)                                                                                                                                                                                                                                                         |
| Work on people/profile automation | [`blog-automation/automation-plan.md`](./blog-automation/automation-plan.md), [`blog-automation/backlog-queue.json`](./blog-automation/backlog-queue.json), [`content-analysis/pipeline-audit-2026-07-04/automation-report.md`](./content-analysis/pipeline-audit-2026-07-04/automation-report.md)             |
| Manage famous people content      | [`blogs-famous-people/mcp-blogs-famous-people.md`](./blogs-famous-people/mcp-blogs-famous-people.md), [`blogs-famous-people/prompts/research-prompt.md`](./blogs-famous-people/prompts/research-prompt.md), [`blogs-famous-people/prompts/writing-prompt.md`](./blogs-famous-people/prompts/writing-prompt.md) |
| Plan distribution / outreach      | [`distribution-assets/LAUNCH-CHECKLIST.md`](./distribution-assets/LAUNCH-CHECKLIST.md), [`outreach/personality-analysis-outreach-playbook.md`](./outreach/personality-analysis-outreach-playbook.md), [`outreach/outreach-plan.md`](./outreach/outreach-plan.md)                                               |
| Work on Instagram                 | [`instagram/daily-engagement/README.md`](./instagram/daily-engagement/README.md), [`instagram/instagram-engagement-targets.md`](./instagram/instagram-engagement-targets.md), [`instagram/account-profiles/README.md`](./instagram/account-profiles/README.md)                                                 |
| Work on Quora                     | [`quora/question-log.md`](./quora/question-log.md), [`quora/sessions/README.md`](./quora/sessions/README.md)                                                                                                                                                                                                   |
| Work on growth / activation       | [`growth/growth-log.md`](./growth/growth-log.md), [`planning/retention-instrumentation-plan-2026-04-08.md`](./planning/retention-instrumentation-plan-2026-04-08.md)                                                                                                                                           |
| Work on design / UI               | [`design-system.md`](./design-system.md), [`design/migration-progress.md`](./design/migration-progress.md), [`design/hyperplexed/HYPERPLEXED_AUDIT_TRACKER.md`](./design/hyperplexed/HYPERPLEXED_AUDIT_TRACKER.md)                                                                                             |
| Work on brand voice               | [`brand/brand-positioning.md`](./brand/brand-positioning.md), [`brand/brand-style-guide-v2.md`](./brand/brand-style-guide-v2.md), [`brand/dj-communication-guide.md`](./brand/dj-communication-guide.md)                                                                                                       |

## Current Generated Sources

These are regenerated outputs and should be cited instead of hand-counted
statistics:

| Source                                                 | What it is                                                           |
| ------------------------------------------------------ | -------------------------------------------------------------------- |
| [`data/corpus-stats.md`](./data/corpus-stats.md)       | Published profile counts, type distribution, recent publish velocity |
| [`BLOG-CROSSLINK-INDEX.md`](./BLOG-CROSSLINK-INDEX.md) | Blog internal-link health and orphan priorities                      |
| [`data/gsc/README.md`](./data/gsc/README.md)           | Search Console export notes and freshness caveats                    |

## Folder Reference

| Folder                                        | Purpose                                                 |
| --------------------------------------------- | ------------------------------------------------------- |
| `audits/`                                     | Current and recent audits worth reading before new work |
| `archives/`                                   | Historical reference only; not active instructions      |
| `brand/`                                      | Voice, positioning, founder story, asset guidance       |
| `design/`                                     | Design audits, migration notes, HyperPlexed work        |
| `development/`                                | Engineering specs, taskers, technical reports           |
| `content-analysis/`                           | SEO, quality, pipeline, and content refresh analysis    |
| `content-generation/`                         | Writing resources, prompts, and creation systems        |
| `content-research/`                           | Active research notes for posts and people              |
| `blog-automation/`                            | People-profile automation inventory and queue state     |
| `distribution-assets/`                        | Ready-to-use launch packets and source images           |
| `outreach/`                                   | Outreach systems, campaigns, and message drafts         |
| `instagram/`, `twitter/`, `quora/`, `reddit/` | Channel-specific strategy and execution logs            |
| `planning/`                                   | Strategy, taskers, and implementation plans             |
| `project-docs/`                               | Project context and onboarding docs                     |
| `seo/`                                        | SEO research, briefs, buckets, and handoffs             |
| `templates/`                                  | Reusable planning and audit templates                   |

## Documentation Rules

- Prefer current hub docs, generated stats, and dated status briefs over older plans.
- Move obsolete but potentially useful docs to `docs/archives/` instead of leaving
  them in an active folder.
- Update links when moving files. Use relative links for internal docs.
- Add dates to operational claims. If a metric is stale, say so.
- Keep generated files marked as generated; do not edit them by hand.

Last updated: 2026-07-06.
