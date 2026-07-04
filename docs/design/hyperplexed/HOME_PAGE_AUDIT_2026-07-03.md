<!-- docs/design/hyperplexed/HOME_PAGE_AUDIT_2026-07-03.md -->

# Home Page HyperPlexed Audit - 2026-07-03

Target: `/`, covering `src/routes/+page.svelte`, `src/routes/+page.server.ts`, shared root layout data, and the homepage library/open-question sections.

## Tier 1 - cheap, high-impact

- Mobile path CTA spacing created extra vertical air after the flow cards. Shipped by resetting mobile `.path-cta` margin. -> P3
- Mobile flow cards used an off-scale `8px` radius while the surface otherwise uses V5 `16px` cards. Shipped by moving the mobile card shells to `1rem`. -> P2

## Tier 2 - structural within the surface

- Homepage data reads could block first paint or empty the library grid when Supabase/RPC was slow. Shipped by timeboxing the top-question and recent-people reads, preserving the locked type representatives, and adding stable fallback representatives for every other type. -> P8+P1
- Root layout demo-time lookup could add avoidable latency to the public homepage. Shipped by adding optional timeout support to `checkDemoTime` and using a 1200ms layout timeout. -> P8

## Tier 3 - polish/signature

- Library card hover used transform motion without a reduced-motion gate. Shipped by keeping color/border feedback for all users and applying the translate hover only under `prefers-reduced-motion: no-preference`. -> P11

## Verification

- `./node_modules/.bin/prettier --check src/routes/+page.svelte src/routes/+page.server.ts src/routes/+layout.server.ts src/utils/api.ts`: pass.
- `./node_modules/.bin/svelte-kit sync`: pass.
- `./node_modules/.bin/svelte-check --tsconfig ./tsconfig.json`: pass, 0 errors and 135 existing warnings.
- `node scripts/lint-radius.js`: still fails on 7 existing non-homepage declarations; no homepage declarations remain in the failure list.
- Live mock browser pass: delayed Supabase homepage endpoints rendered the fallback homepage in 2236ms with 9 library cards. Normal hover transform was `matrix(1, 0, 0, 1, 0, -2)` and reduced-motion hover transform stayed `none`.
- Screenshots captured:
  - `/private/tmp/9takes-homepage-tier23-desktop.png`
  - `/private/tmp/9takes-homepage-tier23-mobile-reduced.png`
