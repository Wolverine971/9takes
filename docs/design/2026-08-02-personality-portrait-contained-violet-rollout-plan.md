<!-- docs/design/2026-08-02-personality-portrait-contained-violet-rollout-plan.md -->

# Contained-Violet Personality Portrait Rollout Plan

**Decision:** Option A — contained violet  
**Approved:** 2026-08-02  
**Status:** Core, adjacent callers, and publishing preflight implemented locally  
**Permanent visual reference:** `/styleguide#s13`  
**Related audit:** `docs/design/hyperplexed/PERSONALITY_ANALYSIS_SLUG_AUDIT_2026-07-29.md`

## Outcome

Keep the existing violet eye mark as a recognizable personality-analysis signature, but make it a
quiet part of the portrait rather than a third interface accent competing with sodium amber and the
Enneagram type colors.

The production color hierarchy will be:

1. **Amber** — illumination, primary actions, focus states, and compact section kickers.
2. **Enneagram type color** — data only: case-file stripe, type label, and dossier annotations.
3. **Legacy portrait violet** — contained inside portrait imagery, with reduced saturation and no
   matching UI chrome. This does not prohibit purple when it is explicitly labeled Type 4 or
   heart-triad data.
4. **Stone and ink** — portrait frame, corner marks, caption border, and passive furniture.
5. **Teal** — statistical/data moments only.

This is a presentation-layer rollout. The source portraits remain unchanged.

## Implementation Progress — 2026-08-02

Both production implementation slices are complete in the working tree:

- Dark/light portrait-well and portrait-filter tokens are live in the shared SCSS layer.
- The semantic `.personality-portrait-well` and `.personality-portrait-image` opt-ins are live.
- `CaseCard` exposes a typed personality-only image treatment whose default remains unchanged.
- The personality index, detail hero, related profiles, type libraries, and category cards opt in.
- The `/blog` personality-analysis cards now use real, accessible portrait images so their pixels
  can be filtered without affecting the title scrim or surrounding card.
- `PersonSuggestion`, `SuggestionsPeople`, `Carousel`, `PeopleBoard`, `PopCard`, `SmallPopCard`, and
  `rubixGrid` now expose or apply the same semantic treatment where they represent an individual
  personality-analysis portrait.
- Personality-article `PopCard` placeholders receive an explicit route-level treatment through the
  content processor; the default component behavior remains unchanged for other article families.
- Thumbnail paths now preserve an existing `s-` prefix instead of producing invalid `s-s-*` paths.
- `/styleguide` §13 covers one representative portrait for each Enneagram type in both themes.
- HyperPlexed pattern P20 documents the reusable non-destructive media-containment technique.
- `docs/design/personality-portrait-authoring.md` records the publishing contract for new assets.
- `pnpm portrait:check -- <type> <Person-Name>` validates the generated WebP pair and prints an
  exact-portrait styleguide URL for hero/card crop review.
- `/styleguide?portraitType=<type>&portraitSlug=<Person-Name>#portrait-preflight` renders the checked
  full and thumbnail files through the production treatment and canonical theme store.

The authored-content inventory found no live first-party individual portrait module outside the
owned `PopCard` path. Multi-person `PopCardGroup` composites, the archived `/old-home` route, social
and SEO images, and admin/email thumbnails remain explicit first-release exceptions. The dormant
suggestion/carousel/people-board callers were updated defensively so reactivating them cannot restore
the retired color treatment. The publishing preflight now makes `/styleguide` §13 an exact-asset gate
instead of relying only on the nine representative samples.

Verification completed for the core route matrix and the live `/blog` surface at 1440 × 1000 and
390 × 844 in dark and light mode. Every owned individual `/types/` portrait found on those routes
used the semantic treatment, while ordinary blog artwork and the Podcast Bros `PopCardGroup`
composite remained untreated. The tested pages had no overflow or broken images. The aggregate
`static/types/` checksum remained
`2fec6f780ecb79de17606572d25e2f34deaf5bfeba65a8061ec946870304401c`.

## Non-Goals And Guardrails

- Do not regenerate, overwrite, rename, move, or recompress anything under `static/types/`.
- Do not recolor the violet to each person's Enneagram type; that was Option C.
- Do not replace violet with amber. Amber must remain the light/action color.
- Do not change the canonical Enneagram type colors.
- Do not apply a global filter to every `CaseCard`; the component also serves non-personality routes.
- Do not use a URL-prefix CSS selector such as `img[src*="/types/"]`; callers must opt in semantically.
- Do not combine this color pass with the larger hero-ordering, TOC, or related-card redesign backlog.
- Keep all SEO paths, JSON-LD image URLs, database fields, and image-slug resolution unchanged in the
  first release.

## Locked Design Contract

The values below were locked after the nine-type visual calibration in Phase 1.

```css
:root {
	--personality-portrait-well: #2c1f28;
	--personality-portrait-filter: contrast(1.08) brightness(0.92) saturate(0.68);
}

:root.light {
	--personality-portrait-well: #f6f3fb;
	--personality-portrait-filter: contrast(1.02) brightness(0.99) saturate(0.58);
}
```

Shared treatment rules:

- Portrait pixels use `--personality-portrait-filter`.
- The portrait's containing media well uses `--personality-portrait-well`.
- Blend mode is normal; remove the detail hero's `--statue-blend` dependency.
- Frames and dividers use `--stone-edge`.
- Corner marks and passive annotations use `--ink-dim`.
- Text over imagery keeps a predictable dark scrim and `--text-on-image`.
- Hover may scale or strengthen an existing scrim, but must not reset or replace the base filter.
- No new glow, shadow, animated wash, or second violet UI accent is added.

Implementation should expose this as a semantic, opt-in portrait treatment in the shared SCSS layer.
Components can then apply the image and media-well classes without duplicating raw filter values.

## Surface Inventory

### Tier 1 — Required For The First Production Release

| Surface                         | Main source                                                                                    | Required change                                                                                                                                            |
| ------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Personality index cards         | `src/routes/personality-analysis/+page.svelte`, `src/lib/components/marketing/CaseCard.svelte` | Add an opt-in personality image treatment prop to `CaseCard`; pass it only from the personality route. Keep type stripes unchanged.                        |
| Personality detail hero         | `src/routes/personality-analysis/[slug]/+page.svelte`                                          | Apply the shared filter/well; remove blend-mode variance; neutralize amber portrait corners and caption border; preserve the type stripe and amber kicker. |
| Detail-page related profiles    | `src/lib/components/molecules/RelatedPosts.svelte`                                             | Apply the shared treatment to both related grids; ensure hover does not replace the filter.                                                                |
| Type libraries                  | `src/routes/personality-analysis/type/[slug]/+page.svelte`                                     | Apply the shared treatment to the profile grid and retain the existing name scrim.                                                                         |
| Category featured/profile cards | `src/routes/personality-analysis/categories/[slug]/+page.svelte`                               | Apply the shared treatment to featured and standard portraits; retain guaranteed text scrims.                                                              |

### Tier 2 — Required Before Calling The System Site-Wide

Audit each live caller of `buildPersonalityImagePath` and opt in wherever the image represents a
personality-analysis portrait:

- `src/lib/components/blog/PersonSuggestion.svelte`
- `src/lib/components/blog/SuggestionsPeople.svelte`
- `src/lib/components/molecules/Carousel.svelte`
- `src/lib/components/molecules/PeopleBoard.svelte`
- the `PopCard` and `SmallPopCard` paths used by those modules
- personality cards on `src/routes/blog/+page.svelte`
- any live article module that renders individual `/types/` portraits

Special handling:

- The blog index uses a CSS `background-image` for personality cards. Convert that personality-only
  branch to a real `<img>` so the filter does not affect overlaid text.
- `rubixGrid.svelte` has its own sepia/hue-rotate animation. Review it separately and either replace
  that effect with the contained treatment or document it as an intentional exception.
- `old-home` is not part of the first release unless route analytics or navigation show it remains a
  user-facing destination.
- Do not blanket-style raw Markdown images by URL. Route them through an owned portrait/media
  component or annotate them during content rendering.

### Explicit First-Release Exceptions

- Open Graph, Twitter, and JSON-LD images continue using the unchanged source portrait. CSS cannot
  affect external previews, and Option A deliberately preserves the violet identity.
- Email and admin thumbnails remain unchanged unless they are found in a public-facing user flow.
- Multi-person editorial composites keep their authored treatment until reviewed as a group.

If external social previews later feel too saturated, add a versioned treatment parameter to
`/social-image.png` and let Sharp produce a derived response. Never overwrite the source WebP, and
change the URL when changing the derived treatment so caches invalidate safely.

## Implementation Phases

### Phase 0 — Freeze The Baseline

1. Capture dark/light desktop and mobile screenshots of:
   - `/personality-analysis`
   - `/personality-analysis/anna-wintour`
   - one type library
   - one category page
   - the related-profile section on a detail page
2. Record computed portrait filters, well colors, and frame colors.
3. Record LCP, CLS, broken-image count, console errors, and page-level overflow.
4. Record a manifest/checksum for `static/types/` so the no-asset-change boundary is verifiable.

### Phase 1 — Build And Calibrate The Shared Treatment

1. Add dark/light semantic portrait tokens to `src/scss/index.scss`.
2. Add reusable opt-in image and media-well treatment classes in the shared SCSS layer.
3. Extend `CaseCard` with a typed image-treatment prop whose default preserves every current
   non-personality caller.
4. Add a styleguide fixture containing one representative portrait from each of the nine types.
5. Calibrate dark and light values against all nine type stripes, especially:
   - Type 3 and Type 7, where the stripe is close to amber;
   - Type 4, where the stripe is in the violet family;
   - Type 8, where red can compete for dominance;
   - very light hair/clothing, dark hair/clothing, and varied skin tones.
6. Lock the final values only when amber reads first, type color reads as data, and violet remains
   recognizable without looking fluorescent.

### Phase 2 — Ship The Core Personality Surfaces

1. Opt the personality index's `CaseCard` instances into the treatment.
2. Update the detail hero:
   - shared filter and dusk well;
   - normal blend mode;
   - neutral frame/corners/caption border;
   - unchanged type stripe, amber kicker, text scrim, crop, and loading priority.
3. Update type and category grids.
4. Update related-profile grids and remove hover rules that replace the base filter.
5. Keep this slice color-only; do not mix in the broader structural audit work.

### Phase 3 — Converge Adjacent Portrait Callers — Shipped Locally 2026-08-02

1. Apply the same opt-in treatment to live suggestions, carousels, people boards, and blog person
   cards.
2. Replace personality-only CSS background images with real images where required for isolated
   filtering and meaningful alt text.
3. Inventory direct portrait usage in authored blog content and migrate only owned, individual
   portrait modules.
4. Record every deliberate exception beside the caller so future audits do not treat it as drift.

### Phase 4 — Future Portrait Pipeline — Shipped Locally 2026-08-02

1. Keep `scripts/prepare-personality-image.sh` producing the same full and thumbnail files.
2. Add an authoring note for new portraits: transparent or controlled background, consistent legacy
   violet mark, no baked amber UI treatment, and a preview against both theme wells.
3. Add a small portrait-treatment fixture/check command so a newly added portrait can be reviewed in
   dark and light mode before publishing. The shipped command validates the pair, dimensions, format,
   aspect ratio, and naming before opening the exact full/thumbnail fixture.
4. Do not make selective recoloring or AI regeneration part of the normal publishing workflow.

### Phase 5 — Documentation And Cleanup

After production verification:

1. Add the portrait color-role contract to `docs/design-system.md`.
2. Update `PERSONALITY_ANALYSIS_SLUG_AUDIT_2026-07-29.md` and the HyperPlexed tracker from pending to
   shipped with P10 + P19 citations.
3. Add a new reusable HyperPlexed pattern for containing legacy media color if the treatment is used
   across the multiple surfaces above.
4. Keep the noindex Anna comparison route as the visual decision record, relabel Option A as the
   production baseline, and remove it only if the styleguide fixture fully replaces its purpose.

## Verification Matrix

### Visual

- Dark and light mode at 1440 × 1000 and 390 × 844.
- One representative portrait for all nine type colors.
- Full hero, featured card, standard card, square grid, text-overlay card, and related card crops.
- Hair/clothing and skin-tone sampling to catch washed highlights or crushed shadows.
- Transparent and opaque-background portrait samples.
- Hover, focus-visible, loading, missing-image stub, and reduced-motion states.

### Acceptance Criteria

- The violet mark remains visible but is not the most saturated interface element.
- Amber is reserved for illumination/action and wins the visual hierarchy.
- Type color remains clearly legible as data without becoming card chrome everywhere.
- Portrait frames and annotations read as neutral dossier furniture.
- Light mode does not make violet louder than dark mode.
- Skin, hair, and clothing do not look gray, muddy, clipped, or color-shifted.
- Text over images passes contrast because of the scrim, not because of the source image.
- No portrait filter disappears on hover or focus.
- No horizontal overflow, broken images, hydration errors, or browser-console errors.
- LCP and CLS remain within the current baseline; no duplicate image layer is introduced.

### Automated And Repository Checks

- Svelte autofixer on every changed Svelte component.
- `pnpm check`
- `pnpm lint`
- `pnpm lint:radius`
- targeted component tests for the default and personality `CaseCard` treatments
- existing personality-image path and social-image tests
- smoke tests for the core route matrix
- Prettier on touched files
- `git diff --check`
- `git diff --name-only -- static/types` must be empty
- static-asset and build-budget ratchets must remain green

## Rollout Shape

Use two implementation slices:

1. **Foundation + core routes:** tokens, semantic treatment, `CaseCard` opt-in, styleguide fixture,
   personality index/detail/type/category/related surfaces.
2. **Adjacent convergence + documentation:** public suggestions/carousels/blog cards, exceptions,
   publishing guidance, final audits, and tracker updates.

Deploy each slice to a preview environment and capture the full visual matrix before production.
Because the assets and database are unchanged, rollback is limited to removing the opt-in classes or
restoring the previous token values. The CSS bundle is content-hashed, so no portrait cache purge is
needed.

## Definition Of Done

- Every public, first-party personality portrait caller either uses the contained-violet treatment or
  has a documented reason not to.
- All nine type colors have been visually approved against the portrait treatment in both themes.
- The detail hero uses one accent budget: type color as data, amber as illumination, and legacy
  portrait violet in the image only.
- The full portrait library is byte-for-byte unchanged.
- Core and adjacent route screenshots pass at desktop/mobile in dark/light mode.
- Performance, accessibility, Svelte, lint, smoke, asset-budget, and formatting checks pass.
- Design-system, audit, tracker, and future portrait-authoring documentation reflect the shipped
  contract.
