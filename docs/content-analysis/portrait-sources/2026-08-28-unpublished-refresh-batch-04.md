<!-- docs/content-analysis/portrait-sources/2026-08-28-unpublished-refresh-batch-04.md -->

# Unpublished personality portraits — refresh batch 04 (2026-08-28)

This review batch incorporates the requested revisions for Michael Jordan, Chase Infiniti, and
Penguinz0, then continues the unpublished queue with the two newest profiles that had no portrait
pair: Freddie Mercury and Marcus Aurelius. In the final review pass, Chase Infiniti and Marcus
Aurelius remained unchanged as approved; Michael Jordan, Penguinz0, and Freddie Mercury were
re-sourced and recomposed.

No generative image model, face reconstruction, generative fill, or synthetic face alteration was
used. Every person or sculpture pixel comes from the live-source photograph listed below.
Processing was limited to deterministic source cropping, Apple Vision foreground segmentation,
landmark-guided rotation and placement, grayscale/tonal adjustment, a mild unsharp mask for the
licensed Penguinz0 frame, alpha-edge contraction, resizing, and compositing the repository's
unchanged `face-line-template.png`.

| Last modified | Person          | Type / production slug | Authentic source and author                                                                                                                                                                        | Source SHA-256                                                     | Rights note                                                                                                                                                                                                                               |
| ------------- | --------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-08-28    | Freddie Mercury | `4 / Freddie-Mercury`  | [Rock Cult: Freddie Mercury profile](https://rockcult.ru/person/freddie-mercury/), recognizable mustached-era editorial portrait; photographer and capture date not listed                         | `5f9452e0a5829eae72be81f85e4e8d76a5a6ec87a777d3e55ca4d9dd5b246365` | Rock Cult does not provide an open reuse license and states that copying requires permission and attribution. Obtain permission or complete a rights review before publication.                                                           |
| 2026-08-27    | Marcus Aurelius | `1 / Marcus-Aurelius`  | [Wikimedia Commons: _MarkAurelFront.jpg_](https://commons.wikimedia.org/wiki/File:MarkAurelFront.jpg), frontal museum photograph by Rabax63, 2016                                                  | `b6fdeaa58451e4ce09df51c849ace4c4ece6bcd797fc358b28ffb18e5a2f077b` | CC BY-SA 4.0. Attribute Rabax63, link the license, indicate changes, and distribute the derivative under the same or a compatible license.                                                                                                |
| 2026-08-14    | Michael Jordan  | `3 / Michael-Jordan`   | [Corriere del Ticino: “Il segreto di Michael Jordan”](https://www.cdt.ch/sport/il-segreto-di-michael-jordan-308535), 2023 editorial portrait credited to KEYSTONE / AP Photo / Marcus Eriksson     | `c981d049dd8a281b48e129082e825a0a5699b26242421158ac194b135bc38f20` | The photograph is explicitly copyrighted and has no open reuse license. Obtain permission or complete a rights review before publication.                                                                                                 |
| 2026-08-11    | Chase Infiniti  | `3 / Chase-Infiniti`   | [Chase Infiniti official site](https://chaseinfinitiofficial.com/), official-site headshot, photographer not listed, 2022; same source as batch 03                                                 | `800fb4b481a54c3a7b0e5ad2a24437176a7e74c6872b718d59f2b50c5f544824` | The official site provides no open reuse license. Obtain permission or complete a rights review before publication if the intended use is not covered by the site's terms or applicable law.                                              |
| 2026-08-01    | Penguinz0       | `9 / Penguinz0`        | [Wikimedia Commons: _Cr1TiKaL in 2022.jpg_](https://commons.wikimedia.org/wiki/File:Cr1TiKaL_in_2022.jpg), pre-AI-upscale 639×712 historical revision of a March 26, 2022 YouTube frame by Ruxin34 | `2ea9f6b9f228c12e3f1c6c62ef9f2a1d7f2faa36b4277fdc7001eaa07f889cc8` | CC BY 3.0. Attribute Ruxin34, link the license, and indicate the crop, rotation, grayscale conversion, sharpening, and compositing changes. The selected revision predates the later AI-upscaled revision documented in the file history. |

The table is a provenance and rights ledger, not blanket legal clearance.

## Composition record

Cutouts use the largest detected face center for horizontal alignment and the detected eye center
for the fixed purple line. The default compositor target was `(540, 490)`; Chase Infiniti remains
at `(590, 490)` as approved.

| Person          |      Corrective rotation | Subject height | Face-center anchor X | Eye-center anchor Y | Target       | Edge contraction | Tonal settings                                                    | Production files                                                                 |
| --------------- | -----------------------: | -------------: | -------------------: | ------------------: | ------------ | ---------------: | ----------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Michael Jordan  |  4.835° counterclockwise |           1100 |             1036.843 |             489.060 | `(540, 490)` |             8 px | brightness 1.02, contrast 1.08                                    | `static/types/3s/Michael-Jordan.webp`, `static/types/3s/s-Michael-Jordan.webp`   |
| Chase Infiniti  | 11.538° counterclockwise |           1510 |             1335.165 |            1077.611 | `(590, 490)` |             4 px | brightness 1, contrast 1.08                                       | `static/types/3s/Chase-Infiniti.webp`, `static/types/3s/s-Chase-Infiniti.webp`   |
| Penguinz0       |        11.410° clockwise |           1405 |              369.239 |             245.710 | `(540, 490)` |             8 px | brightness 1, contrast 1.06; mild unsharp mask before compositing | `static/types/9s/Penguinz0.webp`, `static/types/9s/s-Penguinz0.webp`             |
| Freddie Mercury |            none required |           1260 |              369.125 |             221.751 | `(540, 490)` |            14 px | brightness 0.98, contrast 1.08                                    | `static/types/4s/Freddie-Mercury.webp`, `static/types/4s/s-Freddie-Mercury.webp` |
| Marcus Aurelius |         0.932° clockwise |           1415 |             1786.397 |            1045.546 | `(540, 490)` |            10 px | brightness 1.02, contrast 1.08                                    | `static/types/1s/Marcus-Aurelius.webp`, `static/types/1s/s-Marcus-Aurelius.webp` |

Each staged and production pair passed `pnpm portrait:check` with a 1080×1080 full asset, a
480×480 thumbnail, matching aspect ratios, no alpha channel, and no warnings.
