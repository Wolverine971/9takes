<!-- docs/design/hyperplexed/HYPERPLEXED_AUDIT_TRACKER.md -->

# HyperPlexed Audit Tracker

> Rollup for the audit program driven by the
> [HyperPlexed Design Playbook](./HYPERPLEXED_DESIGN_PLAYBOOK.md) and
> [HyperPlexed Fix Patterns](./HYPERPLEXED_FIX_PATTERNS.md).
>
> One row per surface: what was audited, what shipped, what was deferred, and whether live visual
> verification has run. Every new `/hyperplexed-audit <surface>` pass should update this file.

## 1. Audited Surfaces

| Surface                       | Audit doc                                                                                  | Audited    | Fix status                                                                                                                                                                    | Live verify                                                                                                                                            |
| ----------------------------- | ------------------------------------------------------------------------------------------ | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Home page `/`                 | [`HOME_REIMAGINED_PREVIEW_2026-07-13.md`](HOME_REIMAGINED_PREVIEW_2026-07-13.md)           | 2026-07-16 | Tiers 1-3 and production promotion shipped P3+P4+P6+P8+P10+P11+P13+P15+P19; live Chorus answer flow and SEO active                                                            | Pass, fresh 1440x900/390x844 dark/light, form readiness, anchor, time mirror, overflow, metadata, and console                                          |
| Archived home `/old-home`     | [`HOME_PAGE_AUDIT_2026-07-03.md`](HOME_PAGE_AUDIT_2026-07-03.md)                           | 2026-07-16 | Previous production homepage preserved with visible archive notice, current-home route, and `noindex, nofollow` P6+P8+P13                                                     | Pass, fresh 390x844 archive label, metadata, landmark, and overflow review; old preview returns 308 to `/`                                             |
| `/personality-analysis` index | [`PERSONALITY_ANALYSIS_AUDIT_2026-07-03.md`](PERSONALITY_ANALYSIS_AUDIT_2026-07-03.md)     | 2026-07-03 | Tier 1, Tier 2, and Tier 3 PA index fixes shipped: P3, P8+P1, P5+P6, P2+P13, P6+P8, P11                                                                                       | Pass, desktop/mobile light+dark/reduced-motion browser checks plus screenshots                                                                         |
| `/questions` index            | [`QUESTIONS_INDEX_AUDIT_2026-07-03.md`](QUESTIONS_INDEX_AUDIT_2026-07-03.md)               | 2026-07-03 | Shipped: P3, P7+P6, P6+P4+P1, P8+P6, P13+P6, P10; deferred typeahead service/index: P13                                                                                       | Pass, desktop/mobile dark, desktop light, filters, and search-state captures                                                                           |
| `/questions/create` flow      | [`QUESTION_CREATE_FLOW_AUDIT_2026-07-16.md`](QUESTION_CREATE_FLOW_AUDIT_2026-07-16.md)     | 2026-07-16 | Shipped: modal lifecycle guard, stable loading handoff, render-safe social card, bounded capture, duplicate-safe retry P11+P13                                                | Client integration pass; local live route auth-gated and signed-in browser bridge blocks localhost                                                     |
| `/questions/[slug]` thread    | [`QUESTION_DETAIL_THREAD_AUDIT_2026-07-03.md`](QUESTION_DETAIL_THREAD_AUDIT_2026-07-03.md) | 2026-07-16 | Tier 1 + composer + voice capture flow shipped: P6+P4+P1, P8+P13+P11, P6+P13, P1+P4+P8+P13; Tier 2/3 unchanged                                                                | Static/tests + permission and 5,000-word overflow pass; fresh post-fix active-recording capture owed                                                   |
| Site-wide scan                | [`SITE_WIDE_AUDIT_2026-07-04.md`](SITE_WIDE_AUDIT_2026-07-04.md)                           | 2026-07-16 | Passes 1–9 shipped; 682 sitemap URLs healthy, public render checks clean, and performance/asset ratchets pass                                                                 | Check/430 tests/build/budgets/radius/ESLint pass; 14 mobile smoke tests plus production render crawl pass                                              |
| Admin surfaces                | [`ADMIN_SURFACES_AUDIT_2026-07-09.md`](ADMIN_SURFACES_AUDIT_2026-07-09.md)                 | 2026-07-18 | P0.1/P0.4 and P1 shipped; mobile command center, route rail/adaptation layer, category/client cards, consulting nav, and asset bench shipped; P0.2/P0.3/P2 remainder deferred | Representative 390x844 dark/light command-menu + Categories/Clients/Assets overflow, controls, and long-string pass; authenticated real-data pass owed |

## 2. Prior Audits To Stack With

These are not HyperPlexed-format audits, but they define important baseline work. Read them before
re-reporting the same findings.

| Doc                                                                                 | Notes                                                                                       |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [`docs/design/2026-06-09-design-audit.md`](../2026-06-09-design-audit.md)           | V5 execution audit: tokens, radius, callouts, header/footer, question thread, prose measure |
| [`docs/design/2026-06-11-mobile-audit.md`](../2026-06-11-mobile-audit.md)           | Mobile-specific design findings and follow-up work                                          |
| [`docs/design/admin-style-audit.md`](../admin-style-audit.md)                       | Admin styling baseline where relevant                                                       |
| [`docs/development/STYLE_AUDIT_REPORT.md`](../../development/STYLE_AUDIT_REPORT.md) | Older style migration context                                                               |
| [`docs/development/css-audit-findings.md`](../../development/css-audit-findings.md) | CSS/token drift context                                                                     |

## 3. Open Verification Gap

Most existing 9takes design work has strong static/code verification, but not every visual claim has
fresh before/after screenshots. For HyperPlexed audits, track whether the live pass happened:

1. Start `pnpm dev`.
2. Capture desktop and iPhone-width views for the target surface.
3. Check dark and light mode when the route supports both.
4. Confirm text fit, spacing, contrast, hover/focus state, and mobile fallbacks.
5. Add the result to the surface row above.

## 4. Unaudited Backlog

Roughly ordered by user exposure and leverage:

| Surface                                          | Notes                                                                                      |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| Header + mobile nav + footer                     | Global chrome; stack with existing header/footer design work                               |
| Blog article template                            | Reading measure, callouts, related posts, TOC, imagery scrims                              |
| Blog index pages                                 | Card grids, filters/categories, metadata hierarchy, responsive behavior                    |
| `/personality-analysis` slug/type/category pages | Dossier mode; type colors as data, portrait/card treatment, database-driven content states |
| Auth, waitlist, and coaching flows               | Small surfaces every user or lead sees                                                     |
| Asset generators/poster tools                    | Canvas-like UI where one signature interaction might be earned                             |

## 5. In-Repo Reference Bar

Use these as the current local standard, but verify they have not regressed before citing them:

- `docs/design-system.md` - source of truth for V5 tokens, radius, shadow, typography, atoms.
- `src/lib/components/atoms/Button.svelte` - canonical button: amber primary, no gradients, focus-visible ring, loading state.
- `src/lib/components/atoms/Modal.svelte` - canonical modal shell, body scroll lock, Escape close.
- `src/lib/components/blog/callouts/Callout.svelte` - canonical blog callout shell.
- `src/lib/components/molecules/Header.svelte`, `MobileNavNew.svelte`, `Footer.svelte` - global chrome.
- `src/routes/styleguide/+page.svelte` - rendered token/component reference when checking system fit.
- `src/lib/components/molecules/Comment.svelte` - type-color stripe pattern for comments.

Add to this list when an audit finds a new exemplar; prune if one regresses.
