<!-- docs/design/2026-05-04-rollout-plan.md -->

# 9takes Design — Rollout Plan

**Date:** 2026-05-04
**Status:** Active. Phase 1 in progress.
**Companion docs:** `docs/design-system.md` (locked spec), `docs/design/2026-05-04-streetlamp-symposium-v5.md` (visual reference), `/design-preview/v5` (live prototype).

---

## What's locked (the contract)

As of 2026-05-04:

- **Brand mood:** Streetlamp Symposium — warm-tech baseline + tech-spec dossier variant for `/personality-analysis/*`
- **Color:** V5 token set (`--lamp-glow`, `--night-deep`, `--stone-warm`, `--data-teal`, `--ink-bright`, etc.) as the canonical brand palette. Sodium-amber primary replaces the de-facto teal.
- **Typography:** Inter (variable, weights 400–800) + JetBrains Mono. Rajdhani / Space Grotesk / Noticia Text retired.
- **Glow tokens:** cut from 6 → 2 (`--glow-sm`, `--glow-md` only).
- **Already locked from prior work:** radius scale (sm/md/xl/full, lint-enforced), shadow scale (Kole's recipe, theme-aware).

The lock candidate prototype lives at `/design-preview/v5`. Production migrates to it in Phase 4.

---

## Two strategic decisions (locked)

| Decision                     | Choice                                                                                                                                                    |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Token migration approach** | **Bridge first, clean up at the end.** V5 tokens added alongside legacy tokens in Phase 1. Pages migrate one at a time. Legacy tokens deleted in Phase 7. |
| **Solo Leveling skin**       | **Fully retire.** Poster generator, zine creator, Instagram assets, question-print all migrate to V5 in Phase 6. No surviving secondary skin.             |

---

## Phase 1 — Lock the spec, kill drift (this session)

| Move                                                                                                                     | Status  | Touches                       |
| ------------------------------------------------------------------------------------------------------------------------ | ------- | ----------------------------- |
| §4 Brand mood locked in `docs/design-system.md`                                                                          | ✅ done | `docs/design-system.md`       |
| §5 Color locked in `docs/design-system.md`                                                                               | ✅ done | `docs/design-system.md`       |
| §6 Typography locked in `docs/design-system.md`                                                                          | ✅ done | `docs/design-system.md`       |
| Glow tokens lock decision recorded                                                                                       | ✅ done | `docs/design-system.md`       |
| Audit table + build order updated to reflect locks                                                                       | ✅ done | `docs/design-system.md`       |
| Change-log entry added                                                                                                   | ✅ done | `docs/design-system.md`       |
| ARCHIVED headers on contradicting docs (7 files: `BRAND-KIT.md`, `9takes-style-guide-for-assets.md`, 5 solo-leveling-\*) | ✅ done | `docs/brand/`, `docs/design/` |
| V5 tokens added to global SCSS alongside legacy (the bridge)                                                             | ✅ done | `src/scss/index.scss`         |
| Rollout plan doc created                                                                                                 | ✅ done | this file                     |

**Risk:** zero. Pure documentation + CSS variable additions. No existing pages change visually.

---

## Phase 2 — Single high-impact change

The first user-visible change. Sequenced together because typography + glow cleanup affect every page; doing them as one disruption is cleaner than two.

| Move                                                                                                                                            | Effort | Touches                                     |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------- |
| Install `@fontsource-variable/inter`; load via `src/app.scss` (or root layout)                                                                  | 30 min | `package.json`, `src/app.scss`              |
| Update `tailwind.config.ts` `fontFamily.{sans,heading,display}` to use Inter                                                                    | 15 min | `tailwind.config.ts`                        |
| Update `src/scss/index.scss` `--font-family`, `--font-display` to `'Inter'`                                                                     | 15 min | `src/scss/index.scss`                       |
| Remove Rajdhani + Space Grotesk loading                                                                                                         | 10 min | wherever they're loaded                     |
| Strip glow chains: delete `--glow-lg`, `--glow-secondary`, `--glow-accent`, `--glow-subtle`; delete Tailwind `glow-teal`, `glow-rose` utilities | 1 hr   | `src/scss/index.scss`, `tailwind.config.ts` |
| Sweep all `box-shadow: var(--glow-{lg,secondary,accent,subtle})` references — replace with `--glow-md` or remove                                | 2 hr   | many components                             |
| Remove gradient backgrounds on functional buttons (Comment.svelte, /questions/create)                                                           | 1 hr   | 3-4 component files                         |
| Remove `filter: drop-shadow` on icons + text (StatCard, QuestionDisplay, etc.)                                                                  | 30 min | 4-5 components                              |

**Risk:** medium. Visible across every page. Best deployed end-of-week so users see the change after a quiet pause; not on top of other launches.

**Verification:** `pnpm dev` + visual sweep of `/`, `/questions`, `/personality-analysis`, `/community` in both modes.

---

## Phase 3 — `/styleguide` route + canonical atoms

Without this, drift returns within a month. The atoms are what stops route files from re-rolling their own buttons.

| Move                                                                                                            | Effort |
| --------------------------------------------------------------------------------------------------------------- | ------ |
| Build `/styleguide` route — renders every locked V5 token + every base component, both modes, with theme toggle | 4–6 hr |
| Build canonical `<Button>` atom (replaces inline gradient buttons + `LoadingButton`)                            | 2 hr   |
| Add `@lucide/svelte` for icons; replace `Header.svelte` inline SVGs first                                       | 2 hr   |
| Build `<EmptyState>` atom (used by question search, blog search)                                                | 1 hr   |
| Build `<SectionKicker>` atom (for the `§NN · LABEL` mono pattern that V5 uses everywhere)                       | 30 min |
| Rename `Modal2.svelte` → `Modal.svelte` (12 import-path updates)                                                | 30 min |

---

## Phase 4 — Production homepage migration

The big visible move. Users see the new design.

| Move                                                                                       | Effort |
| ------------------------------------------------------------------------------------------ | ------ |
| Migrate V5 markup + styles into `src/routes/+page.svelte`                                  | 3–4 hr |
| Reuse existing `+page.server.ts` (already loads `questionOfTheDay`, `typeRepresentatives`) | 30 min |
| Wire library section to real famous-people data                                            | 1 hr   |
| Production homepage smoke-test in both modes                                               | 30 min |
| Keep `/design-preview/v5` alive 2 weeks for rollback                                       | -      |

After Phase 4, the homepage reads as Streetlamp Symposium. The rest of the site still uses legacy tokens.

---

## Phase 5 — Top-traffic pages, in priority order

Each row is a 2–4 hour migration once Phases 1–4 are done.

| #   | Page                                                                     | V5 pattern applied                                                                       |
| --- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| 1   | `/personality-analysis` index                                            | Library grid (V5 §08) — case-file dossier previews, real data from `blogs_famous_people` |
| 2   | `/personality-analysis/[slug]`                                           | Deep dossier card (V5 §10) — Tech Spec mode at full size, real breakdown copy            |
| 3   | `/questions` index                                                       | Open-floor cards (V5 §06) for the live questions list                                    |
| 4   | `/questions/[slug]`                                                      | Single question + takes (V5 §06 + give-first lock visualization)                         |
| 5   | `/enneagram-corner`, `/community`, `/how-to-guides`, `/pop-culture`      | Blog index pages — V5 typography + section rhythm                                        |
| 6   | Individual blog post layout                                              | Reading layout — Inter body, Greek imagery as section anchors                            |
| 7   | `/book-session`                                                          | Coaching landing — quiet hero + form, can borrow §02 path-split language                 |
| 8   | `/account/*`, `/login`, `/register`, `/forgotPassword`, `/resetPassword` | Form pages — V5 typography, no decorative effects                                        |
| 9   | `/intake/[token]`                                                        | Token-gated intake — V5 forms + reverent tone                                            |

---

## Phase 6 — Solo Leveling asset generators migration

Per the user's lock decision: Solo Leveling fully retires, asset-generation tools get the V5 treatment too.

| Move                                                                                                                           | Effort | Touches                                               |
| ------------------------------------------------------------------------------------------------------------------------------ | ------ | ----------------------------------------------------- |
| Migrate `/admin/asset-generators/poster-generator` to V5 styles                                                                | 3 hr   | `src/routes/admin/asset-generators/poster-generator/` |
| Migrate `/admin/asset-generators/zine-creator` to V5 styles                                                                    | 3 hr   | `src/routes/admin/asset-generators/zine-creator/`     |
| Migrate `/admin/asset-generators/question-print` to V5 styles                                                                  | 2 hr   | `src/routes/admin/asset-generators/question-print/`   |
| Migrate `src/lib/instagram/`, `src/lib/posters/`, `src/lib/socialCards/` outputs to V5 colors + typography                     | 4 hr   | those dirs                                            |
| Update `docs/instagram/`, social-asset templates and content guides                                                            | 2 hr   | `docs/instagram/`                                     |
| Delete Solo Leveling source SCSS / decorative components no longer used (`FloatingParticles`, `MarqueeHorizontal`, `scribble`) | 1 hr   | `src/lib/components/atoms/`                           |

**Why now and not Phase 5:** asset generators are admin-only and don't impact public site visuals. Doing this last keeps the public-site rollout focused.

---

## Phase 7 — Token cleanup (the bridge demolition)

Final cleanup. Legacy tokens get deleted. Bridge ends.

| Move                                                                                                                               | Effort | Touches                      |
| ---------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------------------------- |
| Audit `src/` for any remaining legacy token references (`var(--primary)`, `var(--bg-base)`, etc. that should be V5 names)          | 2 hr   | grep + manual review         |
| Migrate any laggards to V5 tokens                                                                                                  | 2-4 hr | varies                       |
| Delete legacy tokens from `src/scss/index.scss` (`--bg-*`, `--text-*` if they still exist as legacy, `--primary-*` if not aliased) | 1 hr   | `src/scss/index.scss`        |
| Delete legacy aliases (`--color-theme-purple`, `--accent-rgb`, etc.)                                                               | 30 min | `src/scss/index.scss`        |
| Delete unused font files (Noticia Text in `static/fonts/`)                                                                         | 5 min  | `static/fonts/`              |
| Remove `/design-preview/v1`–`v5` (preview routes no longer needed)                                                                 | 5 min  | `src/routes/design-preview/` |
| Update Tailwind palette ramps if needed (drop `primary` teal ramp if unused)                                                       | 1 hr   | `tailwind.config.ts`         |
| Add ESLint rules: ban raw Tailwind `gray-*`, `slate-*`, `zinc-*`, `blue-*`, `green-*`, `red-*` classes                             | 1 hr   | `eslint.config.js`           |
| Add lint to ban arbitrary spacing values (`p-[Npx]`, etc.)                                                                         | 30 min | `eslint.config.js`           |

After Phase 7, the codebase contains exactly one set of tokens (V5), one set of fonts (Inter + JetBrains Mono), and one canonical visual identity (Streetlamp Symposium). Drift is hard to reintroduce because lint blocks it.

---

## Cumulative timeline (realistic, not optimistic)

| Phase | Effort estimate                          | Calendar  |
| ----- | ---------------------------------------- | --------- |
| 1     | 1–2 hours (this session)                 | Day 1     |
| 2     | 5–6 hours                                | Week 1    |
| 3     | 8–10 hours                               | Week 2    |
| 4     | 5 hours                                  | Week 2    |
| 5     | 24–36 hours (8 page categories × 3-4 hr) | Weeks 3–5 |
| 6     | 12–15 hours                              | Week 6    |
| 7     | 6–8 hours                                | Week 7    |

Total: roughly **6–8 weeks of part-time work** to fully migrate. If shipped piecemeal (one page per day), users get a steadily improving site rather than a single big-bang relaunch.

---

## Decision log (locked, not for relitigation without explicit revisit)

These are the calls already made. Documenting so future contributors don't reopen them without intent:

1. **Brand mood: Streetlamp Symposium** — locked 2026-05-04 after V1–V5 prototype iteration with DJ.
2. **Sodium-amber over teal as primary** — locked 2026-05-04. Teal lives on as `--data-teal` for tech-spec annotations only.
3. **Inter as the only sans-serif** — locked 2026-05-04. No serif. No third sans.
4. **No "dossier" in user-facing copy** — locked 2026-05-04. Internal language only.
5. **Bridge migration approach over hard cutover** — locked 2026-05-04 by DJ.
6. **Solo Leveling fully retires (no surviving skin)** — locked 2026-05-04 by DJ. Asset generators migrate in Phase 6.

---

## What this doc isn't

- An accessibility audit. Color contrast (WCAG sweep) is its own work.
- A performance audit. Inter swap should reduce font payload (variable file vs 3 separate); measure post-Phase-2.
- A copy/voice rewrite. Brand voice is already locked in `docs/brand/brand-positioning.md` + `brand-style-guide-v2.md` and is unchanged.
- A test-coverage plan. E2E tests for the new homepage + styleguide route should be added in Phase 4 / Phase 3 respectively but aren't enumerated here.
