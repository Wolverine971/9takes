<!-- docs/design/hyperplexed/GLOBAL_COMPONENT_CSS_INVENTORY_2026-08-03.md -->

# Global Component CSS Inventory

Date: 2026-08-03  
Status: Wave 3 inventory complete; seven ownership slices shipped in the working tree  
Source: `src/scss/components.scss`

## Why this file matters

`src/scss/index.scss` loads `components.scss`, so every selector in this file reaches every route.
That is useful for tokens and universal utilities, but risky for generic component names such as
`.modal-content`, `.badge`, `.logo-text`, and `.question-meta`. Several of those names
also appear in unrelated admin or asset-generator components, where global declarations can combine
with scoped declarations without an explicit dependency.

The goal is to move component semantics to their owning Svelte components, then keep only genuinely
global foundations in `index.scss`.

## Inventory method

- Enumerated top-level selectors and internal `@extend` relationships in `components.scss`.
- Searched Svelte class attributes for literal and interpolated class-token consumers.
- Separated explicit component ownership from generic-name collisions.
- Checked the current worktree before selecting a migration slice. Dialog and radius files remain a
  separate active workstream.

This inventory is conservative: a class-token match proves exposure, not necessarily that a route
intentionally depends on the global rule.

## Family inventory

| Family                    | Global selectors / relationships                                                                           | Literal consumers or exposed surfaces                                                             | Disposition                                                                                                                                                                         |
| ------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Base cards                | `.card-base`                                                                                               | No literal markup; inherited internally by `.enneagram-container`                                 | Keep temporarily; dissolve with the Enneagram frame after radius coordination                                                                                                       |
| Listing image card        | Removed from the global bundle                                                                             | `enneagram-corner/mental-health/+page.svelte` now owns the complete card                          | **Moved:** route-scoped card, media, scrim, content, focus, hover, and reduced-motion rules                                                                                         |
| Legacy PopCard skin       | Removed from the global bundle                                                                             | `PopCard.svelte` owns its skin and keyframes; `SmallPopCard.svelte` already owned its animations  | **Moved:** component-scoped layout, image, scanline, type, responsive, focus, and reduced-motion rules; dead subtitle/info helpers removed                                          |
| Forms                     | `.form-input`, `.form-textarea`, `.form-select`                                                            | Compatibility exposure remains in `EmailComposeModal` and admin users                             | **Public routes migrated:** login, register, forgot/reset password, and book-session use canonical controls; global removal waits for email/admin dialog coordination               |
| Modals                    | `.modal-overlay`, `-content`, `-header`, `-body`                                                           | Email compose plus consulting, users, comments, links, content-editor and marketing dialog markup | Deferred to the active dialog workstream; generic collision risk is high                                                                                                            |
| Loading                   | `.loading-spinner`, global `spin` keyframes                                                                | QuestionSearch and personality dossier discussion loader                                          | **Removed:** both consumers now use canonical `Spinner`                                                                                                                             |
| Accessibility utilities   | `.sr-only`, `.line-clamp-2`                                                                                | Eight screen-reader labels; one question clamp                                                    | **Removed here:** Tailwind already owns both utilities                                                                                                                              |
| Toast                     | `.notifications`, `.toast`, `.toast__*`, `.toast--*`                                                       | `Toast.svelte` only                                                                               | **Moved:** scoped to `Toast.svelte` with data-driven variants                                                                                                                       |
| Legacy question card      | `.question-card`, `.question-display`, `.comment-span-display`, `.question-meta`, `.date-span`             | No remaining component consumer; admin routes own scoped `.question-meta` rules                   | **Removed:** deleted unreferenced `QuestionTags.svelte` and the global family                                                                                                       |
| Badge/tag                 | Removed from the global bundle                                                                             | Six scoped badge owners, two public dot owners, one dormant component dot, and one article tag    | **Moved:** numeric, status, article-tag, and indicator meanings stay with their existing owners; unused `.badge-glow` removed; shared admin `StatusBadge` remains a Wave 4 decision |
| Tabs                      | Removed from the global bundle                                                                             | Seven admin/search/email/marketing/asset-generator routes now own their tab styles                | **Moved:** route-scoped layout, interaction, focus, and content rules; the admin mobile adaptation remains intentionally layout-scoped                                              |
| Enneagram frame           | `.enneagram-container`                                                                                     | `EnneagramDiagram.svelte` only                                                                    | Move directly into the component                                                                                                                                                    |
| Header/navigation         | `.nav-main`, `.nav-link`, `.active-link`, `.logo-link`, `.logo-text`, `.account-button`, `.dropdown-arrow` | Header and MobileNav; admin nav and poster generator collided on generic names                    | **Removed:** public rules are component-owned; admin focus/type and poster wordmark type are explicit                                                                               |
| Accessibility media rules | high-contrast form/card borders                                                                            | Remaining global base-card/form selectors                                                         | Remove alongside the owning families, not independently; image-card motion is now component-scoped                                                                                  |

## Internal dependency graph

```text
card-base
  -> enneagram-container

form-input
  -> form-textarea
  -> form-select

```

The image-card `@extend` and shared-animation chains are gone. `PopCard` and `SmallPopCard` now each
scope their own keyframes, so neither component has a hidden dependency on the global bundle.

## Shipped reduction slices

Before Wave 3, `components.scss` was 886 lines. It is now 156 lines: 730 global lines removed (82.4%).
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
   containment. The global form compatibility family now serves only email/admin consumers.
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

## Recommended next slices

1. **Enneagram frame after radius coordination:** move the remaining inherited `.enneagram-container`
   card declarations into `EnneagramDiagram.svelte`. It has one owner, but the global declaration
   includes the radius contract and therefore overlaps the active radius workstream.
2. **Form compatibility after dialog coordination:** migrate `EmailComposeModal` and the admin user
   select, then delete `.form-input`, `.form-textarea`, and `.form-select` from the global bundle.
3. **Bare-element reach:** inventory layout semantics still exposed through `index.scss`, starting
   with the generic anchor-effect contract and surface borders; migrate only verified owners.

## Guardrail recommendation

The `lint:global-css` budget is active at the verified 156-line count and is part of `pnpm lint`. It
also rejects any reintroduced global `.badge`, `.badge-glow`, `.badge-dot`, or `.tag` selector. Lower
the line budget after every removal slice. The budget measures `components.scss` only; moving the
same rules wholesale into another global file does not count as progress.
