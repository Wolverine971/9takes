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

## Follow-up - 2026-07-09

### Tier 1 - cheap, high-impact

- The open-floor take list was pinned to the section's left padding because the homepage-wide
  `ul`/`ol` reset had higher specificity than the list's `margin: 0 auto`. Lowered the reset with
  `:where()` so the take list, question header, and CTA share the intended centerline. -> P3

### Verification

- `pnpm check`: pass, 0 errors and 126 existing warnings.
- `pnpm lint:radius`: pass, 0 class violations and CSS backlog 0/0.
- Targeted Prettier check for the homepage and audit docs: pass.
- Desktop at `2048x1223`: the open-floor header, `880px` take list, and CTA all measured at the
  viewport center (`0px` centerline delta).
- Mobile at `390x844`: the take list measured at the viewport center and the document stayed
  `390px` wide, with no horizontal overflow.
- Screenshots captured:
  - `/private/tmp/9takes-homepage-centered-desktop.png`
  - `/private/tmp/9takes-homepage-centered-mobile.png`

## Follow-up - 2026-07-13 brand-story Tier 1

### Tier 1 - cheap, high-impact

- The resting header wordmark used the same fully saturated amber as the Login CTA, section
  kickers, focus states, and active chrome. Moved it into a warm-marble mix while retaining amber
  on interaction, so the search and Library edge treatments read as the shared source of light. -> P19
- The hero opened with the clinical label `OBSERVATION` and feature-inventory support copy. Renamed
  it to `THE CIRCLE` and tightened the two support lines into the give-first story: one situation,
  nine perspectives, then entering the room to hear the rest. -> P6
- The existing statue media slot remains unchanged while the paired modern/Greek gathering assets
  are being finalized; media composition and scrim treatment are deliberately deferred. -> P10

### Verification

- `pnpm check`: pass, 0 errors and 126 existing warnings.
- `pnpm lint:radius`: pass, 0 class violations and CSS backlog 0/0.
- Targeted ESLint and Prettier checks for the touched source/docs: pass.
- Full `pnpm lint`: blocked in the repository-wide Prettier stage by eight pre-existing unrelated
  markdown files; none of the files in this pass are in the failure list.
- Live desktop at `1440x900`: header hierarchy and hero copy reviewed; document width matched the
  viewport with no horizontal overflow.
- Live mobile at `390x844`: wordmark, search edge, hero label, and support-copy wrapping reviewed;
  document width remained `390px` with no horizontal overflow.

## Follow-up - 2026-07-13 brand-story Phase 2

### Tier 2 - structural within the surface

- The §04 mechanism section presented the product as a large feature schematic, then maintained a
  second stacked implementation for phones. Replaced both with one semantic three-beat story rail:
  enter alone, let the room open, then see the emotional pattern underneath the takes. -> P6+P4+P3
- The shared structure now turns from three columns into one connected mobile timeline without
  duplicating content or scaling diagram text below a readable size. This resolves the homepage M1
  finding in the 2026-06-11 mobile audit. -> P3+P4
- The final line, `ONE SITUATION · NINE PERSPECTIVES · NO CONSENSUS REQUIRED`, makes the product's
  social contract explicit before the live open-question section begins. -> P6+P19
- The paired modern/Greek gathering media remains deferred until approved assets exist; this pass
  does not wire a temporary image into the hero. -> P10

### Verification

- `pnpm check`: pass, 0 errors and 126 existing warnings.
- `pnpm lint:radius`: pass, 0 class violations and CSS backlog 0/0.
- Targeted ESLint and Prettier checks for the homepage and audit docs: pass.
- Live desktop at `1440x900`, dark and light: three equal beats, connector rhythm, hierarchy, and
  section handoff reviewed; no horizontal overflow.
- Live mobile at `390x844`, dark and light: one readable connected timeline, clean transition into
  §05, and no horizontal overflow.

## Follow-up - 2026-07-13 brand-story Phase 3

### Tier 3 - polish/signature

- Added one earned signature effect to §04: a restrained streetlamp pool follows the pointer across
  the gathering rail. One pointer listener writes bounded local coordinates; CSS owns the warm-to-
  teal radial illumination, with a quieter mix in light mode. -> P14+P15+P19
- The illumination never changes layout, elevates one voice, or dims the other perspectives. Touch,
  coarse-pointer, no-hover, and reduced-motion contexts receive the static rail. -> P11
- Animated gradient text and peer-dimming were deliberately rejected: both would compete with the
  equal-voice premise and overspend the page's accent budget. -> P16+P18+P19
- The paired modern/Greek gathering media remains the only deferred brand-story item. -> P10

### Verification

- `pnpm check`: pass, 0 errors and 126 existing warnings.
- `pnpm lint:radius`: pass, 0 class violations and CSS backlog 0/0.
- Targeted ESLint and Prettier checks for the homepage and audit docs: pass.
- Live desktop at `1440x900`, dark and light: pointer coordinates moved across the rail, the
  illumination reached full computed opacity, and the light-mode mix remained restrained.
- Live mobile at `390x844`: the vertical story rail remained readable at a 16px body-copy floor with
  no horizontal overflow. Touch/coarse-pointer and reduced-motion no-op gates were verified in code
  and CSS. No browser console errors were reported.
