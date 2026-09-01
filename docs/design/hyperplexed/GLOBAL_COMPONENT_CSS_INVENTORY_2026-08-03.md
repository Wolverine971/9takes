<!-- docs/design/hyperplexed/GLOBAL_COMPONENT_CSS_INVENTORY_2026-08-03.md -->

# Global Component CSS Inventory

Date: 2026-08-03; updated 2026-09-01
Status: Wave 3 complete; the legacy global component library is retired
Source: `src/scss/components.scss`

## Why this file matters

`src/scss/index.scss` loads `components.scss`, so every selector in this file reaches every route.
That is useful for tokens and universal utilities, but risky for generic component names such as
`.modal-content`, `.badge`, `.logo-text`, and `.question-meta`. Several of those names also appeared
in unrelated admin or asset-generator components, where global declarations could combine with
scoped declarations without an explicit dependency.

The goal is to move component semantics to their owning Svelte components, then keep only genuinely
global foundations in `index.scss`.

## Inventory method

- Enumerated top-level selectors and internal `@extend` relationships in `components.scss`.
- Searched Svelte class attributes for literal and interpolated class-token consumers.
- Separated explicit component ownership from generic-name collisions.
- Checked the current worktree before selecting each migration slice. The 2026-09-01 follow-up was
  explicitly coordinated with the dialog and radius workstream.

This inventory is conservative: a class-token match proves exposure, not necessarily that a route
intentionally depends on the global rule.

## Family inventory

| Family                    | Global selectors / relationships         | Literal consumers or exposed surfaces                                                            | Disposition                                                                                                                                                                         |
| ------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Base cards                | Removed from the global bundle           | No exact class-token consumer remained                                                           | **Removed:** the dormant extension chain and stone-on-stone high-contrast rule are gone                                                                                             |
| Listing image card        | Removed from the global bundle           | `enneagram-corner/mental-health/+page.svelte` now owns the complete card                         | **Moved:** route-scoped card, media, scrim, content, focus, hover, and reduced-motion rules                                                                                         |
| Legacy PopCard skin       | Removed from the global bundle           | `PopCard.svelte` owns its skin and keyframes; `SmallPopCard.svelte` already owned its animations | **Moved:** component-scoped layout, image, scanline, type, responsive, focus, and reduced-motion rules; dead subtitle/info helpers removed                                          |
| Forms                     | Removed from the global bundle           | All prior consumers now use canonical `Field`, `Input`, `Textarea`, and `Select`                 | **Moved:** email compose and the admin user status field completed the migration; the form compatibility family is gone                                                             |
| Modals                    | Removed from the global bundle           | Canonical `Modal` plus locally styled admin/marketing dialogs                                    | **Removed:** the canonical shell owns its presentation; remaining hand-built dialogs retain explicit local CSS and are tracked for behavioral migration                             |
| Loading                   | Removed from the global bundle           | QuestionSearch and personality dossier discussion loader                                         | **Removed:** both consumers now use canonical `Spinner`                                                                                                                             |
| Accessibility utilities   | Removed from the global bundle           | Eight screen-reader labels; one question clamp                                                   | **Removed here:** Tailwind already owns both utilities                                                                                                                              |
| Toast                     | Removed from the global bundle           | `Toast.svelte` only                                                                              | **Moved:** scoped to `Toast.svelte` with data-driven variants                                                                                                                       |
| Legacy question card      | Removed from the global bundle           | No remaining component consumer; admin routes own scoped `.question-meta` rules                  | **Removed:** deleted unreferenced `QuestionTags.svelte` and the global family                                                                                                       |
| Badge/tag                 | Removed from the global bundle           | Six scoped badge owners, two public dot owners, one dormant component dot, and one article tag   | **Moved:** numeric, status, article-tag, and indicator meanings stay with their existing owners; unused `.badge-glow` removed; shared admin `StatusBadge` remains a Wave 4 decision |
| Tabs                      | Removed from the global bundle           | Seven admin/search/email/marketing/asset-generator routes now own their tab styles               | **Moved:** route-scoped layout, interaction, focus, and content rules; the admin mobile adaptation remains intentionally layout-scoped                                              |
| Enneagram frame           | Removed with the dormant base-card chain | No exact class-token consumer remained                                                           | **Removed:** active `EnneagramDiagram` presentation was already component-owned                                                                                                     |
| Header/navigation         | Removed from the global bundle           | Header and MobileNav; admin nav and poster generator collided on generic names                   | **Removed:** public rules are component-owned; admin focus/type and poster wordmark type are explicit                                                                               |
| Accessibility media rules | Removed from the global bundle           | No compatibility selector remains                                                                | **Removed:** active controls and surfaces own their contrast behavior                                                                                                               |

## Internal dependency graph

There is no remaining internal dependency graph. The image-card, card-base, form-control, modal, and
shared-animation chains are gone. `PopCard` and `SmallPopCard` each scope their own keyframes, and
the canonical `Modal` no longer inherits the retired overlay blur/spacing contract.

## Shipped reduction slices

Before Wave 3, `components.scss` was 886 lines. It is now 6 comment-only lines: 880 global lines
removed (99.3%).
The first ownership slice reduced it to 781 lines; the dead-question cleanup removed another 61;
the header ownership slice removed another 106; the image-card ownership slice removed another 365;
the tab ownership slice removed another 37; the badge/tag ownership slice removed another 56.

Shipped changes:

1. Replaced the QuestionSearch and personality-dossier loaders with the canonical `Spinner` atom.
2. Removed the global `.loading-spinner` and `spin` keyframes.
3. Removed duplicate `.sr-only` and `.line-clamp-2` declarations; Tailwind remains their owner.
4. Moved all toast layout and variant CSS into `Toast.svelte`.
5. Confirmed `QuestionTags.svelte` had no code imports, deleted it, and removed its five global
   selectors. This also stopped the generic `.question-meta` rule from leaking into scoped admin
   surfaces.
6. Migrated the complete public auth/booking bundle to `Field`, `Input`, `Select`, and `Textarea`;
   removed its route-local control CSS; added durable login errors and shared overflow-safe CAPTCHA
   containment. That slice left only email/admin consumers for the final coordinated migration.
7. Moved public header, logo, account action, nav link, and dropdown-arrow declarations into Header
   and MobileNav. Made the admin nav focus/type contract and poster wordmark font explicit, then
   removed the full 106-line global header family including the unused `.active-link` selector.
8. Moved the mental-health listing card into its route and the complete legacy PopCard skin into
   `PopCard.svelte`. Removed the global image-card families, extension-only hover/interactive card
   helpers, global pan utilities, and dead subtitle/Enneagram info rules. Both card owners now honor
   reduced motion; the listing card also uses an explicit transition set and visible keyboard focus.
9. Moved the complete tab contract into seven admin/search/email/marketing/asset-generator routes.
   Hidden global gap, border, font-size, hover, focus, and positioning dependencies are now explicit;
   broad `transition: all` declarations were narrowed before the global tab family was removed.
10. Classified badge/tag consumers by meaning and kept their presentation with their current owners.
    Six `.badge` owners now explicitly carry the inherited geometry they use; the public article tag
    and two public dot indicators were already scoped; `CorpusStatsPanel` now owns its dormant dot;
    and the unreferenced `.badge-glow` modifier is gone.
11. Migrated `EmailComposeModal` and the admin user-status field to canonical controls, then removed
    `.form-input`, `.form-textarea`, and `.form-select`. The email composer and nested AI flow now use
    the canonical modal lifecycle with durable inline errors.
12. Removed the legacy global modal family after confirming raw admin/marketing consumers own local
    styling. This ended the hidden `.modal-overlay` collision that restored old blur and spacing on
    the canonical shell. Removed the dormant card-base/Enneagram extension chain at the same time.

## Recommended next slices

1. **Canonicalize remaining dialog behavior:** migrate the four raw `role="dialog"` admin surfaces
   onto `Modal`; their styling is local, but they still duplicate focus/escape/scroll lifecycle.
2. **Bare-element reach:** inventory layout semantics still exposed through `index.scss`, starting
   with the generic anchor-effect contract and surface borders; migrate only verified owners.
3. **Admin primitives:** establish shared Panel, Toolbar, FilterBar, DataTable, and StatusBadge roles
   before consolidating more authenticated-route CSS.

## Guardrail recommendation

The `lint:global-css` budget is active at the verified 6-line count and is part of `pnpm lint`. It
rejects reintroduced global badge/tag, form-control, modal, card-base, or Enneagram-frame selectors.
The budget measures `components.scss` only; moving the same rules wholesale into another global file
does not count as progress.
