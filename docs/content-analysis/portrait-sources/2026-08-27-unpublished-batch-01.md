<!-- docs/content-analysis/portrait-sources/2026-08-27-unpublished-batch-01.md -->

# Unpublished personality portraits — batch 01 (2026-08-27)

> Historical record: the Ryan Holiday asset in this batch was superseded after visual review on
> 2026-08-28. The active photograph and processing record are documented in
> `2026-08-28-unpublished-refresh-batch-03.md`.

This batch covers the five newest unpublished personality analyses that did not have production
portrait pairs when the batch started. The order comes from `blogs_famous_people.lastmod` in
descending order.

No generative image model or face reconstruction was used. Every person pixel comes from the real
source photograph listed below. Processing was limited to Apple Vision foreground segmentation,
landmark-guided placement, grayscale and contrast adjustment, edge contraction, resizing, and
compositing the repository's unchanged `face-line-template.png`.

| Last modified | Person          | Type / production slug | Authentic source and author                                                                                                                                                   | Source SHA-256                                                     | Rights note                                                                                                                                                                                                                                            |
| ------------- | --------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-08-27    | Aaron Pierre    | `1 / Aaron-Pierre`     | [Wikimedia Commons: Aaron Pierre at San Diego Comic Con 2026-2.jpg](https://commons.wikimedia.org/wiki/File:Aaron_Pierre_at_San_Diego_Comic_Con_2026-2.jpg), Kevin Paul, 2026 | `fc24abd721efe802286dc36d3ffb73a9c70204e5d911bc8d589f5df9deccc72c` | CC BY 4.0. Modified as described above.                                                                                                                                                                                                                |
| 2026-08-26    | Ryan Holiday    | `1 / Ryan-Holiday`     | [Wikimedia Commons: RyanHoliday.jpg](https://commons.wikimedia.org/wiki/File:RyanHoliday.jpg), Luiz Berengue, 2012                                                            | `261c3a920d94e34cba310406e96b37e80134989d4de580b6741d066684d8fbad` | CC BY-SA 2.0. Modified as described above; the resulting portrait is distributed under the same license.                                                                                                                                               |
| 2026-08-25    | Nate Bargatze   | `9 / Nate-Bargatze`    | [Wikimedia Commons: Nate Bargatze.jpg](https://commons.wikimedia.org/wiki/File:Nate_Bargatze.jpg), Lisa Gansky, 2017                                                          | `f31fa28532bafc95f65141eb6c92267a6eaa0a40309f50b22b66d14fc2ea1eda` | CC BY-SA 2.0. Modified as described above; the resulting portrait is distributed under the same license.                                                                                                                                               |
| 2026-08-23    | Patrick Mahomes | `6 / Patrick-Mahomes`  | [Wikimedia Commons: Patrick Mahomes 2023 (cropped).jpg](<https://commons.wikimedia.org/wiki/File:Patrick_Mahomes_2023_(cropped).jpg>), Senior Airman Alec Risser, 2023        | `4a634d6543c96673273204ad85076c846d10ee48e4687afbc427e93f5b03045e` | U.S. Air Force work in the public domain in the United States. Cropped derivative of [the 3024×4032 source photograph](https://commons.wikimedia.org/wiki/File:Patrick_Mahomes_Chiefs_Military_Appreciation_8123166.jpg); modified as described above. |
| 2026-08-21    | Jonathan Bailey | `3 / Jonathan-Bailey`  | [Wikimedia Commons: Jonathan Bailey in November 22, 2024.png](https://commons.wikimedia.org/wiki/File:Jonathan_Bailey_in_November_22,_2024.png), Barbie Simons, 2024          | `7f02b7e7ec1f4f3176713b314901d5c7f47d1b3f88ab2cba736231930b17a6e0` | CC BY-SA 3.0. Modified as described above; the resulting portrait is distributed under the same license. This source was first documented in `2026-08-25-real-photo-replacements.md`.                                                                  |

## Composition record

All new cutouts used the largest detected face center for horizontal alignment and the detected eye
center for the fixed template line. The compositor's default target `(540, 490)`, edge contraction
of 3 px, brightness of 1, and contrast of 1.08 were retained.

| Person          |                            Subject height |     Face-center anchor X |      Eye-center anchor Y | Production files                                                                 |
| --------------- | ----------------------------------------: | -----------------------: | -----------------------: | -------------------------------------------------------------------------------- |
| Aaron Pierre    |                                      1200 |                 819.8158 |                 587.8132 | `static/types/1s/Aaron-Pierre.webp`, `static/types/1s/s-Aaron-Pierre.webp`       |
| Ryan Holiday    |                                      1220 |                2109.0738 |                1130.9322 | `static/types/1s/Ryan-Holiday.webp`, `static/types/1s/s-Ryan-Holiday.webp`       |
| Nate Bargatze   | 2220 after a 2° clockwise source rotation |                1483.2067 |                 692.4883 | `static/types/9s/Nate-Bargatze.webp`, `static/types/9s/s-Nate-Bargatze.webp`     |
| Patrick Mahomes |                                      1160 |                 506.7803 |                 450.8151 | `static/types/6s/Patrick-Mahomes.webp`, `static/types/6s/s-Patrick-Mahomes.webp` |
| Jonathan Bailey |                  Existing approved master | Existing approved master | Existing approved master | `static/types/3s/Jonathan-Bailey.webp`, `static/types/3s/s-Jonathan-Bailey.webp` |

Each production pair passed `pnpm portrait:check` with a 1080×1080 full asset, a 480×480
thumbnail, matching aspect ratios, and no warnings.

## Review revision — 2026-08-27

After visual review, Aaron Pierre and Ryan Holiday were reduced in scale. Nate Bargatze was reduced
in scale and rotated 2° clockwise before landmark measurement and composition. Patrick Mahomes was
replaced with the real, public-domain 2023 Air Force photograph above so that he faces the camera
directly and more of his upper body remains visible. Jonathan Bailey was intentionally unchanged.
The repository's purple line template was not resized, recolored, or otherwise altered.
