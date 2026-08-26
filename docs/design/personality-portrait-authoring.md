<!-- docs/design/personality-portrait-authoring.md -->

# Personality Portrait Authoring Contract

Use this checklist when adding or replacing an individual portrait for a personality-analysis page.
The production interface contains the legacy portrait violet through CSS; do not bake the
surrounding amber, theme well, border, corner marks, or Enneagram type color into the asset. This
media treatment is separate from semantic purple used for explicitly labeled Type 4 or heart-triad
data.

## Prepare The Source

- Start with a real, legally usable, high-resolution photograph and keep the original outside
  `static/types/`. Do not use an AI-generated or face-reconstructed likeness as a personality
  portrait.
- Record the source page, author or photographer, license/rights status, source-file SHA-256, and
  modifications in `docs/content-analysis/portrait-sources/` before publishing.
- Prefer a transparent background or a controlled, quiet background with a clean silhouette.
- Keep the established violet eye mark consistent enough to identify the portrait family. Do not
  recolor it to the person's type or to streetlamp amber.
- Avoid clipped hair, blown highlights, crushed dark clothing, and a crop that depends on one card
  aspect ratio.
- Use a filename-safe `Person-Name` slug without a leading `s-`.

For a source photograph that needs its background removed, the repository includes a local,
non-generative Apple Vision foreground-segmentation helper. It creates an alpha mask without
retouching or reconstructing the subject:

```sh
swiftc -module-cache-path /tmp/9takes-swift-module-cache \
  scripts/remove-photo-background.swift -o /tmp/remove-photo-background
/tmp/remove-photo-background /path/to/source.jpg /path/to/cutout.png
```

Compose the approved cutout on black, convert it to grayscale, size it, and apply the exact purple
template with the deterministic compositor:

```sh
node scripts/compose-personality-portrait.mjs \
  /path/to/cutout.png /path/to/master.png \
  --height 1200 --offset-y 0
```

Do not center the whole silhouette: shoulders, hair, gestures, or microphones can pull the face
off-axis. Measure the largest photographed face and its eye landmarks with Apple Vision:

```sh
swiftc -module-cache-path /tmp/9takes-swift-module-cache \
  scripts/measure-photo-face.swift -o /tmp/measure-photo-face
/tmp/measure-photo-face /path/to/cutout.png
```

Use the reported face `center.x` as `--anchor-x` and the reported eye `center.y` as `--anchor-y`.
The compositor then places the face at x=540 and the eye line at y=490 by default:

```sh
node scripts/compose-personality-portrait.mjs \
  /path/to/cutout.png /path/to/master.png \
  --height 1200 --anchor-x 540 --anchor-y 420
```

Visually inspect the 1080×1080 master before generating the WebPs. The compositor uses
`face-line-template.png` unchanged; placement flags adjust the photographed subject, not the
template.

Generate the full and thumbnail assets with the existing script:

```sh
./scripts/prepare-personality-image.sh /path/to/source.png 3 Person-Name
```

When the command writes to the repository's `static/types` directory, it also updates the exact
portrait byte and file-count baseline in `scripts/build-budgets.json`. The portrait byte delta is
applied to the client-output and runtime-asset ceilings so their existing non-portrait headroom is
preserved. This keeps intentional portrait additions on the production deploy path without
weakening the other asset ratchets. Custom output roots used for tests or previews do not change
the repository baseline.

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
