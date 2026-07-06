<!-- docs/design/hyperplexed/HYPERPLEXED_AUDIT_TRACKER.md -->

# HyperPlexed Audit Tracker

> Rollup for the audit program driven by the
> [HyperPlexed Design Playbook](./HYPERPLEXED_DESIGN_PLAYBOOK.md) and
> [HyperPlexed Fix Patterns](./HYPERPLEXED_FIX_PATTERNS.md).
>
> One row per surface: what was audited, what shipped, what was deferred, and whether live visual
> verification has run. Every new `/hyperplexed-audit <surface>` pass should update this file.

## 1. Audited Surfaces

| Surface                       | Audit doc                                                                                  | Audited    | Fix status                                                                                                                    | Live verify                                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------------ | ---------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Home page `/`                 | [`HOME_PAGE_AUDIT_2026-07-03.md`](HOME_PAGE_AUDIT_2026-07-03.md)                           | 2026-07-03 | Tier 1, Tier 2, and Tier 3 homepage findings shipped: P2, P3, P8+P1, P8, P11                                                  | Pass, mock slow-Supabase browser check plus screenshots                                               |
| `/personality-analysis` index | [`PERSONALITY_ANALYSIS_AUDIT_2026-07-03.md`](PERSONALITY_ANALYSIS_AUDIT_2026-07-03.md)     | 2026-07-03 | Tier 1, Tier 2, and Tier 3 PA index fixes shipped: P3, P8+P1, P5+P6, P2+P13, P6+P8, P11                                       | Pass, desktop/mobile light+dark/reduced-motion browser checks plus screenshots                        |
| `/questions` index            | [`QUESTIONS_INDEX_AUDIT_2026-07-03.md`](QUESTIONS_INDEX_AUDIT_2026-07-03.md)               | 2026-07-03 | Shipped: P3, P7+P6, P6+P4+P1, P8+P6, P13+P6, P10; deferred typeahead service/index: P13                                       | Pass, desktop/mobile dark, desktop light, filters, and search-state captures                          |
| `/questions/[slug]` thread    | [`QUESTION_DETAIL_THREAD_AUDIT_2026-07-03.md`](QUESTION_DETAIL_THREAD_AUDIT_2026-07-03.md) | 2026-07-03 | Tier 1 shipped: P6+P4+P1, P8+P13+P11, P6+P13, P13; deferred Tier 2/3: P4+P6+P8, P8+P11, P7+P13+P11, P4+P9+P13, P6+P10+P1, P11 | Pass, post-fix desktop dark, mobile dark, composer open, Articles tab, and mobile light screenshots   |
| Site-wide scan                | [`SITE_WIDE_AUDIT_2026-07-04.md`](SITE_WIDE_AUDIT_2026-07-04.md)                           | 2026-07-04 | Initial pass shipped: P6 auth headings, P11/P13 tests, P2 radius ratchet, and routine glass cleanup                           | `pnpm check`, `pnpm test`, and `pnpm lint:radius` pass; full lint blocked by unrelated content format |

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
| Home page `/`                                    | First impression; verify hero, content hierarchy, CTA clarity, and signature effects       |
| Header + mobile nav + footer                     | Global chrome; stack with existing header/footer design work                               |
| Blog article template                            | Reading measure, callouts, related posts, TOC, imagery scrims                              |
| Blog index pages                                 | Card grids, filters/categories, metadata hierarchy, responsive behavior                    |
| `/personality-analysis` slug/type/category pages | Dossier mode; type colors as data, portrait/card treatment, database-driven content states |
| Admin dashboard and content-board                | High-density operational UI; tables, filters, modals, destructive actions                  |
| Email/dashboard admin flows                      | Forms, previews, scheduling states, empty/error/success states                             |
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
