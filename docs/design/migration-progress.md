<!-- docs/design/migration-progress.md -->

# 9takes Design Migration — Progress Tracker

**Companion to:** `docs/design/2026-05-04-rollout-plan.md` (the plan)
**Spec:** `docs/design-system.md` (the lock)
**Visual ground truth:** `/design-preview/v5`
**Last audited:** 2026-05-05

---

## At a glance — DONE 🎉

| Phase | Title                                             | Status                                       |
| ----- | ------------------------------------------------- | -------------------------------------------- |
| 1     | Lock spec, kill drift                             | ✅ done (2026-05-04)                         |
| 2     | Inter swap + glow cleanup                         | ✅ done (2026-05-05)                         |
| 3     | `/styleguide` route + canonical atoms             | ✅ done (2026-05-05)                         |
| 4     | Production homepage migration                     | ✅ done (DJ smoke-tested live)               |
| 5     | Top-traffic pages — mechanical migration          | ✅ done (2026-05-05)                         |
| 6     | Asset generators (user + admin)                   | ✅ done (2026-05-05)                         |
| 7a    | Token cleanup — user-visible components           | ✅ done (2026-05-05)                         |
| 7b    | Token cleanup — full sweep across src/            | ✅ done (2026-05-05) — 0 legacy refs in code |
| 7c    | Bridge demolition + preview cleanup               | ✅ done (2026-05-05)                         |

---

## Final state (2026-05-05)

### Code
- **0 legacy** `var(--bg-*)` / `var(--text-*)` / `var(--primary*)` / `var(--accent*)` / `var(--border-color)` references in any `.svelte`, `.scss`, `.svg`, or `.ts` file in `src/`.
- `svelte-check` → **0 errors**, 156 warnings (all pre-existing CSS selector warnings).
- 47 svelte files type-checked (down from 50 after deleting `/design-preview/v2|v3|v4`).

### SCSS bridge demolition (Phase 7c)
- Legacy token NAMES still exist in `src/scss/index.scss` as **one-line aliases** to V5 tokens:
  - `--bg-base: var(--night-deep);`
  - `--text-primary: var(--ink-bright);`
  - `--primary: var(--lamp-glow);`
  - `--accent: var(--lamp-glow);`
  - etc.
- This keeps internal derived tokens (`--neutral-*`, `--card-background`, `--lightest-gray`, `--dark-gray`, etc.) functional — they continue to chain through legacy → V5.
- V5 tokens are now the **single source of truth** for color values. Legacy names are kept only as backwards-compat aliases for the derived token graph.
- `body { background-color, color }` switched to V5 tokens directly (`--night-deep` / `--ink-bright`).
- Both dark + light theme blocks updated.

### Preview route cleanup
- Deleted `/design-preview/v2/` (~2,398 lines)
- Deleted `/design-preview/v3/` (~2,575 lines)
- Deleted `/design-preview/v4/` (~2,880 lines)
- Total: **~7,853 lines of dead code removed**.
- `/design-preview/v5/` retained for rollback window.

### Nav + search files (DJ-verified)
All clean and visually consistent under V5:

- `Header.svelte` — top nav bar
- `HeaderSearch.svelte` — search bar in header
- `MobileNavNew.svelte` — mobile nav drawer
- `NavbarLinks.svelte` — nav links
- `QuestionSearch.svelte` — typeahead dropdown
- `SearchQuestion.svelte` — full search UI

### Packages
- `@fontsource/rajdhani` removed
- `@fontsource/space-grotesk` removed
- Inter Variable + JetBrains Mono are the only loaded font families

---

## Cumulative migration scoreboard

- **2,409 → 0** legacy core token refs migrated across src/ codebase
- **47** distinct files swept with V5 tokens this session
- **3** asset-generator admin pages migrated (~4,632 lines)
- **22** high-traffic user-visible components migrated (Phase 7a)
- **30+** admin pages + marketing components + charts (Phase 7b)
- **All 9** Phase 5 page categories migrated to V5 + Svelte 5 runes
- **2** font packages removed
- **3** preview routes deleted (~7,853 lines)
- **0** errors throughout — every batch type-checked clean

---

## What's open (non-blocking polish)

These are deliberate skip items, not migration debt:

- **Phase 5 #6 visual redesign** — "Greek imagery as section anchors" reading layout is a separate design exploration. Mechanical migration done; design spec needed before implementation.
- **ESLint plugin for `.svelte` files** — current ESLint config ignores `**/*.svelte`. Adding `eslint-plugin-svelte` would enable lint rules to ban raw Tailwind grays/colors going forward. Future tooling task.
- **Atom font-weight** — atoms (`Button`, `EmptyState`, `ErrorState`) use `font-weight: 600`; styleguide spec uses 700. Pick one.
- **`<EmptyState>` / `<ErrorState>` styleguide examples** — `/styleguide` intentionally inlines spec markup. Add live atom comparison rows or leave inline.
- **Markdown drafts under `src/blog/`** — some unpublished drafts contain inline `var(--primary)` HTML. Content, not design.

---

## Audit log

| Date       | Audit notes                                                                                                                                                                                                                                                                                                                              |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-05-05 | Initial creation. Phase 5 8/13 routes already migrated.                                                                                                                                                                                                                                                                                  |
| 2026-05-05 | Phase 5 mechanical complete. Phase 6 done. Packages removed.                                                                                                                                                                                                                                                                             |
| 2026-05-05 | Phase 7a high-traffic components swept. 2,409 → 1,967.                                                                                                                                                                                                                                                                                   |
| 2026-05-05 | Phase 7b major sweep across admin surfaces. 1,492 → 489.                                                                                                                                                                                                                                                                                 |
| 2026-05-05 | Phase 7b complete. Sed sweep cleaned long tail. Nav + search files verified. 2,409 → 0 legacy refs in src/ code.                                                                                                                                                                                                                         |
| 2026-05-05 | **Phase 7c complete.** Legacy SCSS tokens redirected to V5 aliases (V5 is now single source of truth). Body styles use V5 directly. `/design-preview/v2\|v3\|v4` deleted (~7,853 lines). svelte-check: 0 errors, 47 files. **Migration is complete.** |
