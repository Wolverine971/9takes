<!-- docs/design/hyperplexed/SITE_WIDE_AUDIT_2026-07-04.md -->

# Site-Wide Audit - 2026-07-04

Scope: broad local scan of the current 9takes workspace across public routes, copy, styling,
performance signals, tests, and loose ends. This is intentionally a rollup doc; focused route audits
should still get their own HyperPlexed audit files.

## Summary

The rendered public UX is generally stable. A local crawl of core routes and sampled detail routes
returned `200`, showed no mobile or desktop horizontal overflow, and exposed coherent route-level
headings. The largest risks are not obvious page crashes; they are verification breakage, content
loose ends, visual drift, and oversized static assets.

## Tier 1 - cheap, high-impact

- Auth headings: `/login` and `/register` both announce the switcher copy `Login / Register`, which
  weakens route identity. Rename the primary H1 on each route and keep cross-navigation secondary.
  -> P6
- Header search tests: `HeaderSearch` now exposes an ARIA combobox, but the test still queries a
  `searchbox`. Update the tests to match the shipped control contract. -> P13
- Comment interaction tests: `Interact` reads `window.matchMedia` for reduced-motion state, while
  the jsdom test setup does not provide it. Add a test shim or defensive component guard. -> P11
- Radius ratchet: `pnpm lint:radius` reported seven off-scale raw radii in blog widgets and
  personality-detail surfaces. Normalize to the two-radius rule. -> P2
- Glass drift: booking, blog index navigation, mental-health navigation, question items, interaction
  surfaces, and personality portrait chrome still use `backdrop-filter` for ordinary UI structure.
  Replace routine glass with V5 stone surfaces and reserve special effects for earned moments.
  -> P11+P13

## Tier 2 - structural within the site

- Smoke tests can hit the wrong app because Playwright reuses `localhost:5173`. Make the web server
  config honor the smoke base URL or stop reusing arbitrary existing servers. -> P13
- Typechecking failed on D3 typings in `LineChart` and `WordCloud`. The lockfile had D3 type entries,
  but the workspace could not resolve them during `pnpm check`. -> verification
- ESLint could not start because `@eslint/js` was not resolvable from `eslint.config.js`. -> verification
- Published content quality needs cleanup: `tech-titans-disruptors.md` is published but still reads
  skeletal, and adjacent series copy was stale. -> content
- `.md.bak` blog files contain `published: true` frontmatter. They may not route today, but they are
  risky for future content importers, search, or sitemap scripts. -> content

## Tier 3 - performance and polish

- Static assets are oversized: `static/` is roughly 653 MB, several blog PNGs are 5-9 MB, and
  `static/9takes-preview.svg` is about 9.8 MB. Compress, resize, and convert heavy media to responsive
  WebP/AVIF where appropriate. -> performance
- Build output is heavy: the local client output was roughly 802 MB, global CSS was about 320 KB, and
  the admin content-board server chunk was about 800 KB. Run a bundle pass after tooling is green.
  -> performance
- Visual verification gap: this audit included rendered route checks for status and overflow, but not
  saved before/after screenshots for every changed surface. Focused screenshots are still owed for
  any surface that receives design changes. -> verification

## Verification Snapshot

- `pnpm build`: pass.
- `pnpm check`: fail, 20 errors and 137 warnings at audit time.
- `pnpm lint`: fail before ESLint starts because `@eslint/js` is not resolvable.
- `pnpm lint:radius`: fail, 7 radius violations at audit time.
- `pnpm test -- --run`: fail, 308 passing and 4 failing tests at audit time.
- Rendered crawl: pass for sampled public routes; no measured horizontal overflow.

## Follow-Up Order

1. Repair verification first: D3 types, ESLint package resolution, smoke-test targeting, stale unit tests.
2. Burn down cheap visual drift: P2 radii, P6 auth copy, and routine `backdrop-filter` surfaces.
3. Clean published content loose ends and risky backup markdown frontmatter.
4. Run an asset compression and bundle-size pass.
5. Schedule focused HyperPlexed audits for `/search`, `/book-session`, blog index/template, and admin
   content-board.

## 2026-07-04 Fix Pass

Status: initial pass shipped.

- [x] P6 auth heading split.
- [x] P11/P13 test fixes for `HeaderSearch` and `Interact`.
- [x] P2/P11/P13 focused visual debt pass for the listed surfaces.
- [x] Re-run targeted checks and record results.

### Fixes Shipped

- `/login` and `/register` now use single-purpose H1 copy and secondary route-switch links.
- `HeaderSearch.spec.ts` now queries the ARIA combobox contract and handles the visible status plus
  screen-reader live region.
- `Interact.svelte` now guards `window.matchMedia`, and `Interact.spec.ts` opens the current
  answer-to-unlock composer before asserting textarea behavior.
- Routine `backdrop-filter` usage was removed from booking panels, blog quick nav, mental-health
  quick nav, question cards, interaction composer surfaces, and the personality-detail portrait
  overlay. Translucent bases were replaced with V5 stone surfaces or a stronger image scrim.

### Post-Fix Verification

- `pnpm check`: pass, 0 errors and 137 warnings.
- `pnpm test`: pass, 72 files and 312 tests.
- `pnpm lint:radius`: pass, 0 violations.
- Targeted Prettier check for changed files: pass.
- `pnpm lint`: still blocked by unrelated Prettier drift in
  `src/blog/pop-culture/tech-titans-disruptors.md`.
