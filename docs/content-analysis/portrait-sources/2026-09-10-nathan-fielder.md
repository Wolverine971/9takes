<!-- docs/content-analysis/portrait-sources/2026-09-10-nathan-fielder.md -->

# Nathan Fielder personality portrait (2026-09-10)

The source photograph was explicitly approved before formatting on 10 September 2026. No
generative image model, face reconstruction, generative fill, or synthetic face alteration was
used. Every person pixel comes from the authentic photograph listed below. Processing was limited
to Apple Vision foreground segmentation, landmark-guided placement, grayscale and contrast
adjustment, alpha-edge contraction, resizing, and compositing the repository's unchanged
`face-line-template.png`.

| Person         | Type / production slug | Authentic source and author                                                                                                                              | Source SHA-256                                                     | Rights note                                                                                                                                                                |
| -------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nathan Fielder | `6 / Nathan-Fielder`   | [Ian White: _Nathan for You for Comedy Central_](https://www.behance.net/gallery/18724847/NATHAN-FOR-YOU-FOR-COMEDY-CENTRAL), published 3 September 2014 | `e9d943b4860abcefd82c9906c0f442110f04459ead5c6647ff83a1bc5d2e69dd` | Official advertising photography for Comedy Central. The project does not state an open-content license; obtain permission or complete a rights review before publication. |

The original source rendition was downloaded from the photographer's Behance project at
2,038 x 3,000 pixels. It contains the complete head, hair, shoulders, arms, and upper body against
a controlled white studio background. The source was selected because it provides substantially
cleaner edges, more usable resolution, and more framing latitude than the previously considered
Wikimedia photographs.

## Composition record

| Corrective rotation | Subject height | Face-center anchor X | Eye-center anchor Y | Target       | Edge contraction | Tonal settings              | Production files                                                               |
| ------------------- | -------------: | -------------------: | ------------------: | ------------ | ---------------: | --------------------------- | ------------------------------------------------------------------------------ |
| none                |           2400 |             1048.793 |             514.975 | `(540, 490)` |             8 px | brightness 1, contrast 1.08 | `static/types/6s/Nathan-Fielder.webp`, `static/types/6s/s-Nathan-Fielder.webp` |

Apple Vision detected one foreground instance and one face with confidence 1.0. The compositor
placed the resized 1,321 x 2,400 subject at canvas `(-145, 144)`. Nathan Fielder's full head and
hair remain inside the 1,080 x 1,080 canvas; the tighter upper-torso crop enlarges his face so the
unchanged purple template spans ear to ear while remaining centered over the measured eye
landmarks. The template is composited last.

The production pair passed `pnpm portrait:check -- 6 Nathan-Fielder`: the full asset is 1,080 x
1,080 (66.3 KiB) and the thumbnail is 480 x 480 (13.5 KiB), both WebP with alpha transparency.
