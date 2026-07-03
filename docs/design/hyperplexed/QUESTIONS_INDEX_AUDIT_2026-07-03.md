<!-- docs/design/hyperplexed/QUESTIONS_INDEX_AUDIT_2026-07-03.md -->

# Questions Index HyperPlexed Audit - 2026-07-03

Target: `/questions`, covering `src/routes/questions/+page.svelte`, `src/routes/+layout.svelte`, `src/lib/components/questions/SearchQuestion.svelte`, and the shared `ComboBox` path used by the page search.

Prior art stacked: `docs/design/2026-06-09-design-audit.md`, `docs/design/2026-06-11-mobile-audit.md`, `docs/audits/2026-06-11_state-of-9takes.md`, `docs/archives/questions-page-analysis.md`, and `docs/marketing/questions-page-optimization-summary.md`.

Regions audited: root shell, hero, open-floor header, search, category navigation, question rows, empty/load-more states, guest signup nudge, and light-mode treatment.

## Tier 1 - cheap, high-impact (alignment/padding/labels)

- [root shell] `/questions` is still inside the root `max-w-4xl` clamp even though the page defines its own 1280px hero shell and 880px list shell. Live desktop rendered `main` at 896px and `.hero` at 864px, which squeezes the first viewport and makes category chips wrap into four rows before the list. Add `/questions` to `FULL_WIDTH_PAGES` or give the route a deliberate full-width shell while keeping `/questions/[slug]` detail pages clamped. -> P3
- [category navigation] Search is correctly the primary interaction, but the secondary category chips take four rows on desktop and eleven rows at 390px before the first question. Replace the chip wall with a `Filters` button plus visible selected chips, and keep only a tiny set of top-level shortcuts if they actually improve scanning. -> P7+P6
- [question rows] Mobile row metadata spends too much space on parent/category breadcrumbs. The first two rows measured 128px tall with 63px of metadata, and the path text truncates into partial labels plus `+N`. Show the leaf category plus `+N` on mobile, demote the rest to subtext, and keep all user-supplied/category text in an explicit overflow-safe row. -> P6+P4+P1
- [hero CTA] For guests, the hero says "Drop yours first" but only exposes "Browse open questions"; the ask/sign-up action appears later in the search row. Render a guest-safe primary CTA such as "Sign up to ask" or "Ask anonymously" beside Browse, while authenticated users can keep "Drop a question." -> P8+P6

## Tier 2 - structural within the surface (declutter/hierarchy)

- [search control] The page's primary control still relies on `SearchQuestion` patching a shared `ComboBox` with route-level `:global(... !important)` styles, while the submit button bypasses the `Button` atom. The 2026-06-11 mobile audit already flags the same ComboBox token/focus issues and JS width branch; this route is where that debt is most visible. Migrate the shared ComboBox to V5 tokens and stable 16px input text, then remove the page patch layer and make the mobile/desktop button label CSS-driven. -> P13+P6
- [search state] Local verification could not validate populated typeahead results: `/api/questions/typeahead?q=what` returned `{"results":[],"categories":[]}` and the dropdown showed "No results available." Before polishing result rows, verify the service/index state and make sure "No results" appears only after a completed search rather than during debounce/loading. -> P13

## Tier 3 - polish/signature (motion/effects, at most one per surface)

- [hero image] The bottom mono caption is readable in dark mode because the image has a dark vignette, but the light-mode override removes the bottom scrim and the caption becomes low-contrast over the image. Restore a predictable text-over-image scrim in both themes or hide the decorative caption in light mode. -> P10

## Shipped Fixes - 2026-07-03

- [root shell] Added `/questions` to the full-width route set and exempted the index from the root `max-w-4xl` clamp while keeping question detail pages clamped. Live desktop now measured `main` at 1440px, `mainMaxWidth: none`, and `.hero-inner` at 1280px. -> P3
- [category navigation] Replaced the always-visible chip wall with a `Filters (42)` button, one selected `ALL QUESTIONS` chip, and a `FULL TREE` link. The full category set is now an on-demand panel. Closed filter height measured 32px on desktop and 72px on mobile open-floor. -> P7+P6
- [question rows] Replaced full category breadcrumbs with leaf category labels plus `+N`, kept the full path in `title`/`aria-label`, and tightened overflow-safe row constraints. First five rows measured 69px desktop and 84px mobile. -> P6+P4+P1
- [hero CTA] Guests now get a primary `Sign up to ask` CTA in the hero, matching the "Drop yours first" copy instead of only offering Browse. -> P8+P6
- [search control] Migrated `SearchQuestion` submit to the canonical `Button` atom, removed JS viewport branching and route-level ComboBox `!important` overrides, and moved shared ComboBox defaults onto V5 tokens with 16px mobile input text. -> P13+P6
- [search state] Shared `ComboBox` now renders `Searching...` while the list is open with `loading=true` and no options, then `No results available` after loading clears. Local typeahead still returned no options for `type`, so search indexing/result quality remains a service-level follow-up. -> P13
- [hero image] Restored a bottom scrim in light mode and forced the decorative mono caption to white over the image. Browser verification confirmed the light vignette includes the bottom scrim and the caption computed as white. -> P10

## Verification

- Static pass: route and child components read directly from `src/routes/questions/+page.svelte`, `src/routes/+layout.svelte`, `src/lib/components/questions/SearchQuestion.svelte`, and `src/lib/components/molecules/ComboBox.svelte`.
- Prior-art pass: stacked against the June design/mobile audits and the existing questions optimization docs.
- Live pass: `./node_modules/.bin/vite dev --host 127.0.0.1` served the app at `http://127.0.0.1:5176/questions`. `pnpm dev` was not used because the wrapper prompted to reinstall `node_modules`, and that was declined.
- Desktop dark, 1440x1000: page loaded; root clamp measured at 896px main width; category chips wrapped to four rows.
- Mobile dark, 390x844: no page-level horizontal overflow; hero image correctly hidden; category chips wrapped to eleven rows; first question rows showed 63px metadata blocks.
- Search interaction: typed mobile query rendered a stable dropdown, but local typeahead returned no results for a broad query.
- Light mode: text contrast held for main copy; hero-image caption needs a scrim.
- Screenshots captured:
  - `/private/tmp/9takes-questions-hyperplexed-2026-07-03/questions-desktop-dark-full.png`
  - `/private/tmp/9takes-questions-hyperplexed-2026-07-03/questions-mobile-dark-top.png`
  - `/private/tmp/9takes-questions-hyperplexed-2026-07-03/questions-mobile-search-dark.png`
  - `/private/tmp/9takes-questions-hyperplexed-2026-07-03/questions-desktop-light-top.png`

## Fix Verification - 2026-07-03

- Formatting: `./node_modules/.bin/prettier --write` ran on the touched Svelte files and this audit/tracker pair.
- Svelte: `./node_modules/.bin/svelte-kit sync` passed. `./node_modules/.bin/svelte-check --tsconfig ./tsconfig.json` passed with 0 errors and the existing repo warning backlog (137 warnings in 42 files after the questions changes).
- Radius: `node scripts/lint-radius.js` failed on unrelated existing/staged drift outside `/questions`: `src/lib/components/blog/EnneagramDiagram.svelte`, `src/lib/components/blog/NineChorus.svelte`, and `src/routes/personality-analysis/[slug]/+page.svelte`.
- Live pass: `./node_modules/.bin/vite dev --host 127.0.0.1 --port 5177` served `http://127.0.0.1:5177/questions`.
- Desktop 1440x1200: no horizontal overflow; `mainMaxWidth: none`; `.hero-inner` 1280px; closed filter shell 32px; first five rows 69px; visible category text reduced to leaf labels plus `+N`.
- Desktop centering follow-up: lowered the page reset specificity with `:where(...)` so `.question-list` auto margins win in the full-width shell; the list now measures 880px wide at `left: 280px` in a 1440px viewport, matching the toolbar shell.
- Search interaction: real click/type opened the ComboBox list; local result state for `type` ended at `No results available` with 0 options after loading.
- Light mode: theme toggled through the app control, screenshot captured, and original theme title restored. Caption computed white; bottom scrim present.
- Mobile 390x844: no horizontal overflow; `mainMaxWidth: none`; search form stacked to column; open-floor row heights measured 84px; filters are closed by default and the full category panel opens on demand.
- After screenshots captured:
  - `/private/tmp/9takes-questions-hyperplexed-2026-07-03-fixed/questions-desktop-1440.png`
  - `/private/tmp/9takes-questions-hyperplexed-2026-07-03-fixed/questions-desktop-filters-open.png`
  - `/private/tmp/9takes-questions-hyperplexed-2026-07-03-fixed/questions-desktop-search-state.png`
  - `/private/tmp/9takes-questions-hyperplexed-2026-07-03-fixed/questions-desktop-light-1440.png`
  - `/private/tmp/9takes-questions-hyperplexed-2026-07-03-fixed/questions-mobile-390.png`
  - `/private/tmp/9takes-questions-hyperplexed-2026-07-03-fixed/questions-mobile-open-floor-390.png`
  - `/private/tmp/9takes-questions-hyperplexed-2026-07-03-fixed/questions-mobile-filters-open-390.png`
