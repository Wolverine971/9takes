<!-- docs/content-analysis/portrait-sources/2026-09-02-demis-hassabis.md -->

# Demis Hassabis personality portrait (2026-09-02)

No generative image model, face reconstruction, generative fill, or synthetic face alteration was
used. Every person pixel comes from the licensed real photograph listed below. Processing was
limited to Apple Vision foreground segmentation, landmark-guided placement, grayscale and contrast
adjustment, alpha-edge contraction, resizing, and compositing the repository's unchanged
`face-line-template.png`.

| Person         | Type / production slug | Authentic source and author                                                                                                                                                                                                                                                           | Source SHA-256                                                     | Rights note                                                                                                                                                 |
| -------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Demis Hassabis | `5 / Demis-Hassabis`   | [Wikimedia Commons: _Demis Hassabis, 2024 Nobel Prize Laureate in Chemistry.jpg_](https://commons.wikimedia.org/wiki/File:Demis_Hassabis,_2024_Nobel_Prize_Laureate_in_Chemistry.jpg), Arthur Petron, 8 December 2024 | `9fbccadb86d6749383305b98ec4d249231135a497af3fb41a475b9655a373b86` | CC BY-SA 4.0. Attribute Arthur Petron, link the license, indicate the changes below, and distribute the derivative under the same or a compatible license. |

License: [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/).

The downloaded 1,819 × 1,778 Wikimedia original was foreground-segmented, converted to grayscale,
adjusted to the standard portrait contrast, resized, cropped, and composited with the unchanged
`face-line-template.png`. The wider source keeps both shoulder contours inside the portrait's
lateral bounds. The derivative portrait remains available under CC BY-SA 4.0.

## Composition record

| Corrective rotation | Subject height | Face-center anchor X | Eye-center anchor Y | Target       | Optical X offset | Edge contraction | Tonal settings              | Production files                                                               |
| ------------------- | -------------: | -------------------: | ------------------: | ------------ | ---------------: | ---------------: | --------------------------- | ------------------------------------------------------------------------------ |
| none                |           1050 |             1035.395 |             507.257 | `(540, 490)` |          +50 px |             3 px | brightness 1, contrast 1.08 | `static/types/5s/Demis-Hassabis.webp`, `static/types/5s/s-Demis-Hassabis.webp` |

The production pair must pass `pnpm portrait:check -- 5 Demis-Hassabis` before publication.
