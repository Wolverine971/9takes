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
