<!-- docs/design/hyperplexed/PERSONALITY_ARTICLE_EVIDENCE_AUDIT_2026-07-26.md -->

# Personality Article Evidence Cards HyperPlexed Audit — 2026-07-26

Target: the reusable `EvidenceFigure` visual hook for Supabase-backed and MDsvex blog content, with
the Elon Musk evidence set as its first proof.

## Regions Audited

- Image and evidence relationship.
- Quote, speaker, and context hierarchy.
- Quote-source and image-rights attribution.
- Portrait, time-anchor, and mobile card layouts.
- Server fallback and client-mounted component parity.

## Tier 1 — cheap, high-impact (alignment/padding/labels)

- [metadata hierarchy] Quote and image citations were previously detached from the visual context.
  The card now keeps both records under the evidence with quiet mono metadata. → P4
- [evidence labels] The second pass removes loud category language such as `WITNESS` and
  `FIRST-PERSON ACCOUNT`. Compact rows lead with the person's name and relationship; feature labels
  state only the useful time or relationship anchor. → P4+P5+P6

## Tier 2 — structural within the surface (declutter/hierarchy)

- [card hierarchy] The original equal-size card system made every citation compete with the article.
  The revised system defaults to a compact face-and-quote row and reserves the feature scale for an
  image whose setting, relationship, or period carries evidence. → P2+P4+P19
- [truthful imagery] Exact-event, same-period, speaker-portrait, and source-portrait are distinct
  evidence kinds. The Model 3 launch caption rejects an exact-scene implication, and the Talulah
  Riley/Elon Musk photograph is explicitly labeled as relationship-era context rather than the night
  she describes. → P10+P6
- [progressive rendering] Supabase markdown receives a semantic server fallback before the identical
  Svelte component mounts, so citations and imagery are not dependent on client JavaScript. → P8

## Tier 3 — polish/signature

- [restraint] No motion or signature interaction was added. The editorial image, quote, and explicit
  evidence label are the focal treatment. → P11

## Verification

- Visual proof route: `/design-preview/blog-evidence` (`noindex, nofollow`).
- Desktop: pass at 1100px and 1440px; two feature hooks plus three compact rows, five loaded images,
  and no horizontal overflow.
- Mobile: pass at 390×844; compact faces remain beside their quotes, feature crops retain their
  subjects, and there is no horizontal overflow.
- Browser console: zero errors in both captures.
- Focused Vitest: 8 tests passed across the registry and server renderer.
- `svelte-check`: 0 errors; 142 pre-existing warnings in 44 files remain outside this component.
- `lint:radius`: the new evidence surface is on-scale; the repo command remains blocked by one
  unrelated existing `0.875rem` declaration in `src/routes/account/+page.svelte`.
- Svelte autofixer: run on `EvidenceFigure`. Its three `resolve()` suggestions are intentionally not
  applied: all three destinations are external registry URLs, while SvelteKit's `resolve()` rejects
  external URLs at runtime and instructs callers to use them directly. `svelte-check` accepts the
  direct links, and both preview routes return 200.
- Captures: `/private/tmp/elon-evidence-v2-desktop.png`,
  `/private/tmp/elon-evidence-v2-mobile.png`, and focused figure captures prefixed with
  `/private/tmp/desktop-elon-` and `/private/tmp/mobile-elon-`.

## Deferred Publish Check

The local Elon draft contains the five component tags, but Supabase remains the live source of truth.
The production article must be compared, synced, and visually rechecked before the enrichment tracker
moves from `enriched-local` to `published`.

## Editorial Portrait Follow-up — 2026-08-15

A live-article review showed that the compact face-and-quote rows were too small at reading scale. The
speaker image read as a thumbnail, the quote sat in a separate white strip, and the public attribution
resembled implementation metadata rather than an editorial caption. This follow-up supersedes the
compact treatment for quoted people.

- [x] **Portrait hierarchy:** every quote-bearing evidence hook now uses one portrait-led composition.
      The image owns roughly two-thirds of the desktop card and becomes the full-width lead image on mobile;
      the quote, speaker relationship, context, and sources follow in a fixed priority order. → P4+P10
- [x] **Speaker relevance:** the final portrait pass replaces Talulah Riley's costume photograph with a
      formal LIMS portrait, Justine Musk's domestic couch photograph with a 2014 speaking still, and
      Kimbal Musk's casual restaurant image with a licensed official headshot. All three use face-first
      4:5 crops and source-specific rights records. → P6+P10
- [x] **Caption cleanup:** redundant labels were removed from quote cards. Attribution is now two quiet,
      human-readable lines (`Quote source` and `Photo`) with the publication year, license or fair-use
      status, and a concise `edited for web` change notice. The full rights ledger remains in the registry.
      → P4+P6
- [x] **Responsive geometry:** portrait cards use a stable 800×544 maximum desktop frame and a stacked
      mobile fallback. The picture remains the dominant region, quotes scale up to 1.7rem, and context
      plus attribution step down to 0.7rem/0.65rem. → P1+P2+P4+P10

### Follow-up verification

- Full Elon article preview passes in light mode at 1440×1000 and 390×844.
- Desktop portrait cards render at 768×512 with a 470×510 image region; mobile renders a 324×374 lead
  image above the caption.
- All five evidence images load at natural dimensions after lazy scrolling; no duplicate IDs,
  horizontal overflow, or browser warnings/errors.
- Focused tests pass as part of the 693-test Vitest run; Svelte autofixer and `lint:colors` pass.
- `lint:radius` remains blocked by two unrelated existing admin-page declarations in
  `admin/enneagram-campaign/+page.svelte` and `admin/question-distribution/+page.svelte`.
- Captures: `/private/tmp/elon-evidence-editorial-desktop-light.png` and
  `/private/tmp/elon-evidence-editorial-mobile-light.png`.
