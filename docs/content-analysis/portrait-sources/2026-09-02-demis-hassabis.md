<!-- docs/content-analysis/portrait-sources/2026-09-02-demis-hassabis.md -->

# Demis Hassabis personality portrait (2026-09-02)

No generative image model, face reconstruction, generative fill, or synthetic face alteration was
used. Every person pixel comes from the licensed real photograph listed below. Processing was
limited to Apple Vision foreground segmentation, landmark-guided placement, grayscale and contrast
adjustment, alpha-edge contraction, resizing, and compositing the repository's unchanged
`face-line-template.png`.

| Person         | Type / production slug | Authentic source and author                                                                                                                                                                         | Source SHA-256                                                     | Rights note                                                                                                                                                     |
| -------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Demis Hassabis | `5 / Demis-Hassabis`   | [Wikimedia Commons: _Demis Hassabis in 2025 by Christopher Michel.jpg_](https://commons.wikimedia.org/wiki/File:Demis_Hassabis_in_2025_by_Christopher_Michel.jpg), Christopher Michel, 14 July 2025 | `feddf521607bed5eab7c47b243997f6003a77fdba6b7ec305ce61bcd1a97836f` | CC BY-SA 4.0. Attribute Christopher Michel, link the license, indicate the changes below, and distribute the derivative under the same or a compatible license. |

License: [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/).

The downloaded 3,840 × 5,757 Wikimedia derivative was foreground-segmented, converted to grayscale,
adjusted to the standard portrait contrast, resized, cropped, and composited with the unchanged
violet eye-line template. The derivative portrait remains available under CC BY-SA 4.0.

## Composition record

| Subject height | Face-center anchor X | Eye-center anchor Y | Target       | Edge contraction | Tonal settings              | Production files                                                               |
| -------------: | -------------------: | ------------------: | ------------ | ---------------: | --------------------------- | ------------------------------------------------------------------------------ |
|           1200 |             2232.722 |            1414.949 | `(540, 490)` |             3 px | brightness 1, contrast 1.08 | `static/types/5s/Demis-Hassabis.webp`, `static/types/5s/s-Demis-Hassabis.webp` |

The production pair must pass `pnpm portrait:check -- 5 Demis-Hassabis` before publication.
