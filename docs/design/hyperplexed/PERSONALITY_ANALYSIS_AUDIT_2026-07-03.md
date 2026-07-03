<!-- docs/design/hyperplexed/PERSONALITY_ANALYSIS_AUDIT_2026-07-03.md -->

# Personality Analysis HyperPlexed Audit - 2026-07-03

Target: `/personality-analysis`, covering `src/routes/personality-analysis/+page.svelte`,
`src/routes/personality-analysis/+page.server.ts`, `src/routes/+layout.svelte`, and the shared
`CaseCard`, `CaseGrid`, `IndexHero`, and `EmailSignup` components used by the index.

Implementation pass shipped after approval. Fixes applied to the PA index, root shell, `CaseGrid`,
`CaseCard`, `EmailSignup`, and the PA server load.

## Regions Audited

- Global shell and full-width band behavior.
- Hero / observation section.
- Featured and recently-updated card grids.
- By-type library blocks and per-type CTAs.
- Bottom email signup.
- Dark/light theme behavior and mobile density at 390px and 360px.

## Tier 1 - cheap, high-impact (alignment/padding/labels)

- [global shell] `/personality-analysis` is listed as a full-width page, but global `main` styling still applied `max-width: 1200px`, centered margin, and layout padding. Live desktop at 1440px rendered the PA hero at 1168px wide, so the route's 1280px inner grids never reached their intended geometry; mobile also kept 8px gutters around every "full-bleed" band. Shipped a PA-index-owned shell override in `src/routes/+layout.svelte`; live desktop now renders `main` at 1440px and `.hero-inner` / card grids at 1280px. -> P3
- [mobile card grids] `CaseGrid columns={3}` collapsed to one column below 540px. Live audit pass: 62 cards produced a 30,749px page at 390px and each type block became roughly 2.5k-2.7k px tall. Shipped an opt-in `compactMobile` mode for `CaseGrid` and `CaseCard`, then applied it to PA recent/type grids; live 390px page height is now 16,345px, with recent/type grids at `168px 168px`. -> P8+P1
- [type labels] The page-level section sequence ran `§01` through `§05`, but the nested type blocks restarted at `§01` through `§09` inside `§04`. That made the signup's `§05` look like it followed nine new top-level sections. Shipped label-only nested type kickers like `TYPE 1 · THE PERFECTIONIST`. -> P5+P6

## Tier 2 - structural within the surface (declutter/hierarchy)

- [signup] The signup area was a card inside another card: `.signup-form` added a bordered 16px shell, then `EmailSignup` rendered its own bordered 16px `waitlist-section` with a gradient. Shipped an `embedded` mode for `EmailSignup`, moved the submit to the Button atom, and rendered the PA signup as a single card surface inside the by-type section. -> P2+P13
- [signup / funnel placement] The only email capture on the index appeared after the full by-type library, which was around 29k px down on mobile. The CTA copy was generic despite route-specific traffic value and existing CTA-audit evidence that PA is the site's largest section. Shipped a context-aware "case file dispatch" signup before the nine type blocks. -> P6+P8
- [server data state] The route waited for the full published famous-people read before rendering and threw a 404 on data errors. In this sandbox the direct route request took about 23 seconds before returning 200. Shipped a 2500ms query timeout plus curated fallback rows so the index still paints. Final live `domcontentloaded` timings were 431ms desktop, 177ms at 390px, and 105ms at 360px after warmup. -> P8+P1

## Tier 3 - polish/signature (motion/effects, at most one per surface)

- [card and CTA motion] `CaseCard` hover lifted every card with `transform: translateY(-2px)`, the type CTA hover lifted with `translateY(-1px)`, and `EmailSignup`'s submit hover also lifted. Shipped reduced-motion gating for card and PA type CTA transforms; the signup submit now uses the Button atom without a custom transform. Reduced-motion browser check held card/button transform at `none`. -> P11
- [signature restraint] No new signature effect was added. The page's biggest gains were width, density, labels, and CTA structure; a cursor glow or spotlight effect remains premature until the card grid is dense enough to scan. -> P14-P16

## Live Verification

- Dev server: `npm run dev -- --host 127.0.0.1`, rendered at `http://127.0.0.1:5173/personality-analysis`.
- HTTP: 200 for `/personality-analysis`.
- Console: no warnings or errors captured in Playwright at desktop, 390px, or 360px.
- Overflow: no page-level horizontal overflow at 1440, 390, or 360px. The only desktop child overflow is the known decorative `FloatingParticles` glow container; document width stays 1440px.
- Geometry: desktop `.hero-inner`, recent grid, and type grids now render at 1280px. Mobile recent/type grids render two-up at 390px and 360px.
- Density: mobile 390px full-page height dropped from 30,749px to 16,345px.
- Theme: dark mode rendered with correct V5 surface/text colors; dark signup CTA text computed as `rgb(10, 8, 7)` on amber.
- Reduced motion: card and type CTA hover transforms stayed `none`.
- Source checks:
  - `./node_modules/.bin/svelte-kit sync`: pass.
  - `./node_modules/.bin/svelte-check --tsconfig ./tsconfig.json`: pass, 0 errors and 140 existing warnings.
  - `node scripts/lint-radius.js`: fails on 7 existing off-scale declarations outside the touched files (`EnneagramDiagram`, `NineChorus`, and `/personality-analysis/[slug]`).
- Screenshots captured:
  - `/private/tmp/pa-fix-final-desktop.png`
  - `/private/tmp/pa-fix-final-mobile390.png`
  - `/private/tmp/pa-fix-final-mobile360.png`
  - `/private/tmp/pa-fix-final-mobile-reduced.png`
  - `/private/tmp/pa-fix-final-dark-mobile390.png`

## Static References

- `src/routes/+layout.svelte` now sets a PA-index-owned shell style when `$page.route.id === '/personality-analysis'`.
- `src/lib/components/marketing/CaseGrid.svelte` now exposes opt-in `compactMobile`.
- `src/lib/components/marketing/CaseCard.svelte` now exposes opt-in `compactMobile` and gates hover transform under `prefers-reduced-motion: no-preference`.
- `src/lib/components/molecules/Email-Signup.svelte` now supports `embedded` mode and uses the Button atom for submit.
- `src/routes/personality-analysis/+page.server.ts` now timeboxes the DB query and falls back to curated published-style rows.
- `src/routes/personality-analysis/+page.svelte` now moves signup before the long type library, uses compact mobile grids, and uses label-only nested type kickers.
