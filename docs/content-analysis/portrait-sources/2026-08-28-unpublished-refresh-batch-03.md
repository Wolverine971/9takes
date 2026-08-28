<!-- docs/content-analysis/portrait-sources/2026-08-28-unpublished-refresh-batch-03.md -->

# Unpublished personality portraits — refresh batch 03 (2026-08-28)

This review batch replaces Ryan Holiday after visual review and refreshes the next five unpublished
profiles in descending `blogs_famous_people.lastmod` order: Michael Jordan, Mel Robbins, Chase
Infiniti, Stable Ronaldo, and Penguinz0. Those five profiles already had files, but the inherited
assets were not supported by an acceptable end-to-end real-photo source record.

> Supersession note (2026-08-28): the Michael Jordan, Chase Infiniti, and Penguinz0 assets in this
> record were replaced during [refresh batch 04](./2026-08-28-unpublished-refresh-batch-04.md).
> Ryan Holiday, Mel Robbins, and Stable Ronaldo remain the active assets from this batch.

No generative image model, face reconstruction, generative fill, or synthetic face alteration was
used. Every person pixel comes from the live-source photograph or video frame listed below.
Processing was limited to deterministic source cropping, Apple Vision foreground segmentation,
landmark-guided rotation and placement, grayscale/tonal adjustment, alpha-edge contraction,
resizing, and compositing the repository's unchanged `face-line-template.png`.

| Last modified | Person         | Type / production slug | Authentic source and author                                                                                                                                                   | Source SHA-256                                                     | Rights note                                                                                                                                                                                                   |
| ------------- | -------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-08-26    | Ryan Holiday   | `1 / Ryan-Holiday`     | [VaynerSpeakers: Ryan Holiday](https://vaynerspeakers.com/speakers/ryan-holiday/), agency headshot, photographer not listed                                                   | `4a9651ac329abeb4f1181cc362b18164bccaac11592f46f5e356ddf49450ed3f` | The agency page provides no open reuse license. Obtain permission or complete a rights review before publication if the intended use is not covered by the site's terms or applicable law.                    |
| 2026-08-14    | Michael Jordan | `3 / Michael-Jordan`   | [Wikimedia Commons: Michael Jordan.jpg](https://commons.wikimedia.org/wiki/File:Michael_Jordan.jpg), original Flickr photograph by Joshua Massel, 2006                        | `46565a78d5e2a9f6df92a7eb8fb0dab29bb5bd24b468ccc9841770d59290cc3f` | CC BY-SA 2.0. Attribute Joshua Massel, link the license, indicate changes, and distribute the derivative under the same or a compatible license.                                                              |
| 2026-08-12    | Mel Robbins    | `3 / Mel-Robbins`      | [Mel Robbins press page](https://www.melrobbins.com/press/), approved press image by Jenny Sherman                                                                            | `67fcbc369ed2cc7edc40563c435cc9c8606c6bd5ab47ffda674e78c9df1e8310` | Official approved press image, credited © Jenny Sherman; no open reuse license is stated. Confirm that this publication falls within the press-image permission or obtain separate permission.                |
| 2026-08-11    | Chase Infiniti | `3 / Chase-Infiniti`   | [Chase Infiniti official site](https://chaseinfinitiofficial.com/), official-site headshot, photographer not listed, 2022                                                     | `800fb4b481a54c3a7b0e5ad2a24437176a7e74c6872b718d59f2b50c5f544824` | The official site provides no open reuse license. Obtain permission or complete a rights review before publication if the intended use is not covered by the site's terms or applicable law.                  |
| 2026-08-02    | Stable Ronaldo | `3 / Stable-Ronaldo`   | [Stable Ronaldo's own X post](https://x.com/StableRonaldo/status/1864398494666248483), self-posted photograph, 2024                                                           | `77249b5b4b03934a3c32a2ac44448daac8f87452447a8b6fb7285714c5d8843a` | Self-posted by the subject, but no open reuse license is stated. Obtain permission or complete a rights review before publication if the intended use is not covered by the platform terms or applicable law. |
| 2026-08-01    | Penguinz0      | `9 / Penguinz0`        | [WIRED: “MoistCr1TiKaL Answers The Web's Most Searched Questions”](https://www.youtube.com/watch?v=5lEp4djm4s0), clean auto-generated frame from the authentic 2023 interview | `21557d54d74aea9e49b651bcb1ca9caac1c150effc5fae4f405427c60cfb84f9` | WIRED provides no open reuse license for the interview frame. Obtain permission or complete a rights review before publication if the intended use is not covered by the platform terms or applicable law.    |

The table is a provenance and rights ledger, not blanket legal clearance.

## Composition record

All cutouts use the largest detected face center for horizontal alignment and the detected eye
center for the fixed purple line. The compositor target remained `(540, 490)`.

| Person         |      Corrective rotation | Subject height | Face-center anchor X | Eye-center anchor Y | Edge contraction | Tonal settings                 | Production files                                                               |
| -------------- | -----------------------: | -------------: | -------------------: | ------------------: | ---------------: | ------------------------------ | ------------------------------------------------------------------------------ |
| Ryan Holiday   |         2.579° clockwise |           1959 |              591.449 |             320.893 |             4 px | brightness 1, contrast 1.08    | `static/types/1s/Ryan-Holiday.webp`, `static/types/1s/s-Ryan-Holiday.webp`     |
| Michael Jordan |        12.557° clockwise |           1122 |             1832.080 |            1282.844 |             4 px | brightness 1.18, contrast 0.90 | `static/types/3s/Michael-Jordan.webp`, `static/types/3s/s-Michael-Jordan.webp` |
| Mel Robbins    |  4.778° counterclockwise |           1575 |              480.035 |             253.095 |             3 px | brightness 1, contrast 1.08    | `static/types/3s/Mel-Robbins.webp`, `static/types/3s/s-Mel-Robbins.webp`       |
| Chase Infiniti | 11.538° counterclockwise |           1421 |             1335.165 |            1077.611 |             4 px | brightness 1, contrast 1.08    | `static/types/3s/Chase-Infiniti.webp`, `static/types/3s/s-Chase-Infiniti.webp` |
| Stable Ronaldo |         5.567° clockwise |           1667 |              643.969 |             226.463 |             8 px | brightness 1, contrast 1.08    | `static/types/3s/Stable-Ronaldo.webp`, `static/types/3s/s-Stable-Ronaldo.webp` |
| Penguinz0      |  2.221° counterclockwise |           1110 |              626.473 |             245.815 |             4 px | brightness 1, contrast 1.08    | `static/types/9s/Penguinz0.webp`, `static/types/9s/s-Penguinz0.webp`           |

Each production pair passed `pnpm portrait:check` with a 1080×1080 full asset, a 480×480
thumbnail, matching aspect ratios, no alpha channel, and no warnings. The protected portrait-library
budget also passed. The separate client deploy-output budget remains 21.55 KiB over its existing
global limit; this is unrelated to these portrait assets.
