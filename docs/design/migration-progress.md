<!-- docs/design/migration-progress.md -->

# 9takes Design Migration — Progress Tracker

**Companion to:** `docs/design/2026-05-04-rollout-plan.md` (the plan)
**Spec:** `docs/design-system.md` (the lock)
**Visual ground truth:** `/design-preview/v5`
**Last audited:** 2026-05-05

---

## At a glance — DONE 🎉

| Phase | Title                                    | Status                                       |
| ----- | ---------------------------------------- | -------------------------------------------- |
| 1     | Lock spec, kill drift                    | ✅ done (2026-05-04)                         |
| 2     | Inter swap + glow cleanup                | ✅ done (2026-05-05)                         |
| 3     | `/styleguide` route + canonical atoms    | ✅ done (2026-05-05)                         |
| 4     | Production homepage migration            | ✅ done (DJ smoke-tested live)               |
| 5     | Top-traffic pages — mechanical migration | ✅ done (2026-05-05)                         |
| 6     | Asset generators (user + admin)          | ✅ done (2026-05-05)                         |
| 7a    | Token cleanup — user-visible components  | ✅ done (2026-05-05)                         |
| 7b    | Token cleanup — full sweep across src/   | ✅ done (2026-05-05) — 0 legacy refs in code |
| 7c    | Bridge demolition + preview cleanup      | ✅ done (2026-05-05)                         |

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

## What's open

- **Phase 5 #6 visual redesign** — "Greek imagery as section anchors" reading layout is a separate design exploration. Mechanical migration done; design spec needed before implementation.
- **Admin Streetlamp polish** — 2026-05-14 sweep migrated all admin chrome from leftover Solo Leveling / hex-mix to V5 tokens (see `docs/admin-style-audit.md` § "V5 Streetlamp Symposium pass — 2026-05-14"). Mechanical only; still open: section kickers in JetBrains Mono, `<EmptyState>`/`<ErrorState>` atom adoption, residual `--primary-subtle`/`--primary-glow` aliases in `content-board/*`, and a real visual redesign of `asset-generators/question-print` + `zine-creator` (still on old Noticia Text aesthetic).

## Closed in 2026-05-05 final pass

- ✅ **`<EmptyState>` / `<ErrorState>` styleguide examples** — added side-by-side spec + live-atom comparison in `/styleguide §11`. Both atoms render alongside the inline visual spec so the canonical rendering is visible.
- ✅ **`/personality-analysis/categories/[slug]` styled for V5** — verified the page already used V5 tokens correctly. Upgraded inline `.section-kicker` and `.eyebrow` markup to use the canonical `<SectionKicker>` atom (matching sibling pages `/personality-analysis/+page.svelte` and `/personality-analysis/[slug]/+page.svelte`). Sections now have proper `§NN · LABEL` JetBrains Mono kickers (§01 SUBCATEGORIES, §02 FEATURED, §03 LIBRARY, §04 ADJACENT). `tone="data"` (teal) on the Type Spread kicker, `tone="dim"` on group-card profile counts. `corpus-insight-eyebrow` switched to mono + `--data-teal`.

## Closed in 2026-05-05 polish pass

- ✅ **ESLint plugin for `.svelte` files** — `eslint-plugin-svelte` + `svelte-eslint-parser` installed and configured. `pnpm lint` now lints `.svelte` files. Recommended-config noise rules silenced (existing legacy code triggers them but they're not migration-blockers).
- ✅ **Tailwind ban rule active** — custom `no-restricted-syntax` rule blocks raw `bg-gray-500`, `text-blue-700`, etc. across 15 banned color roots × 11 shades × 14 utility prefixes. New code introducing these fails lint. 10 pre-existing files grandfathered with explicit override (listed in `eslint.config.js`).
- ✅ **Atom font-weight resolved** — `EmptyState` + `ErrorState` bumped to `font-weight: 700` to match the styleguide `sg-state-title` spec. `Button` stays at 600 since the styleguide `sg-btn` spec is also 600 (no mismatch).
- ✅ **Markdown drafts swept** — `src/blog/community/drafts/introducing-9takes-original.md` migrated to V5 tokens. `src/blog/` now has 0 legacy `var(--primary)` references.
- ✅ **Files with svelte-eslint-parser limitations** — 11 files with `<script>` tags inside `{@html template literals}` (JSON-LD) added to ignore list. Lint still works on the rest of the codebase.

---

## Audit log

| Date       | Audit notes                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-05-05 | Initial creation. Phase 5 8/13 routes already migrated.                                                                                                                                                                                                                                                                                                                                                                                  |
| 2026-05-05 | Phase 5 mechanical complete. Phase 6 done. Packages removed.                                                                                                                                                                                                                                                                                                                                                                             |
| 2026-05-05 | Phase 7a high-traffic components swept. 2,409 → 1,967.                                                                                                                                                                                                                                                                                                                                                                                   |
| 2026-05-05 | Phase 7b major sweep across admin surfaces. 1,492 → 489.                                                                                                                                                                                                                                                                                                                                                                                 |
| 2026-05-05 | Phase 7b complete. Sed sweep cleaned long tail. Nav + search files verified. 2,409 → 0 legacy refs in src/ code.                                                                                                                                                                                                                                                                                                                         |
| 2026-05-05 | **Phase 7c complete.** Legacy SCSS tokens redirected to V5 aliases (V5 is now single source of truth). Body styles use V5 directly. `/design-preview/v2\|v3\|v4` deleted (~7,853 lines). svelte-check: 0 errors, 47 files. **Migration is complete.**                                                                                                                                                                                    |
| 2026-05-14 | **Admin follow-up sweep.** All 20+ admin pages migrated from leftover Solo Leveling tokens / hardcoded slate-indigo hex to V5 Streetlamp Symposium tokens. Status maps in JS now hold `var(--...)` strings; dead `:global(.dark)` blocks deleted; enneagram colors swapped to canonical `--type-N-color`. Asset-generator print output deliberately preserved. 0 svelte-check errors. Open items tracked in `docs/admin-style-audit.md`. |
