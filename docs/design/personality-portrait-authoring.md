<!-- docs/design/personality-portrait-authoring.md -->

# Personality Portrait Authoring Contract

Use this checklist when adding or replacing an individual portrait for a personality-analysis page.
The production interface contains the legacy portrait violet through CSS; do not bake the
surrounding amber, theme well, border, corner marks, or Enneagram type color into the asset. This
media treatment is separate from semantic purple used for explicitly labeled Type 4 or heart-triad
data.

## Prepare The Source

- Start with a legally usable, high-resolution portrait and keep the original outside
  `static/types/`.
- Prefer a transparent background or a controlled, quiet background with a clean silhouette.
- Keep the established violet eye mark consistent enough to identify the portrait family. Do not
  recolor it to the person's type or to streetlamp amber.
- Avoid clipped hair, blown highlights, crushed dark clothing, and a crop that depends on one card
  aspect ratio.
- Use a filename-safe `Person-Name` slug without a leading `s-`.

Generate the full and thumbnail assets with the existing script:

```sh
./scripts/prepare-personality-image.sh /path/to/source.png 3 Person-Name
```

The command writes `static/types/3s/Person-Name.webp` and
`static/types/3s/s-Person-Name.webp`. It keeps the established full/thumbnail naming contract used by
the personality image resolver.

Run the publishing preflight immediately afterward:

```sh
pnpm portrait:check -- 3 Person-Name
```

The check is read-only. It requires both WebPs, rejects `s-s-*` duplicates, verifies the 1200px/480px
pipeline ceilings and matching aspect ratios, and prints the exact `/styleguide` URL for that pair.
It exits non-zero when the asset contract is broken.

## Wire The Portrait Semantically

- Use the existing personality image-path helper instead of hand-building `/types/` URLs.
- Add `.personality-portrait-well` to the owned media container and
  `.personality-portrait-image` to the image, or use a component's typed
  `imageTreatment="personality"` option.
- Keep the default component treatment for non-personality images. Never target an image by a
  `/types/` URL substring in CSS.
- Preserve `filter: var(--personality-portrait-filter)` in hover and focus states; compose any
  additional brightness or contrast after the token instead of resetting the filter.
- Keep text-over-image contrast in a stable scrim. Do not depend on the source pixels being dark.

## Review Before Publishing

1. Run `pnpm portrait:check -- <type> <Person-Name>` and open its printed preview URL.
2. Review both the full hero crop and square thumbnail crop, toggle the styleguide theme, and repeat.
3. Check the new portrait on its real detail page and at least one production card.
4. Confirm violet is recognizable but quieter than amber action/illumination and the type color reads
   only as data.
5. Check skin tone, light hair/clothing, dark hair/clothing, transparency, and the missing-image
   fallback.
6. Test hover, focus-visible, mobile, and desktop. Confirm there is no overflow, broken image,
   filter snap, duplicate image layer, or text contrast regression.
7. Confirm the generated full and `s-` thumbnail files are both present before publishing metadata.

Multi-person editorial composites keep their authored treatment until reviewed as a group. Open
Graph, Twitter, JSON-LD, admin, and email thumbnails intentionally continue using the unchanged
source asset in the first release.

## Protected Asset Boundary

Presentation changes must not rewrite the portrait library. Before and after a CSS/component-only
change, this command should produce the same aggregate digest:

```sh
rg --files -0 static/types | sort -z | xargs -0 shasum -a 256 | shasum -a 256
```

Locked baseline on 2026-08-02:
`2fec6f780ecb79de17606572d25e2f34deaf5bfeba65a8061ec946870304401c`.
