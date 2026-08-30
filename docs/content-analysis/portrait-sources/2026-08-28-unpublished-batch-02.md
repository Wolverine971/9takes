<!-- docs/content-analysis/portrait-sources/2026-08-28-unpublished-batch-02.md -->

# Unpublished personality portraits — batch 02 (2026-08-28)

This batch covers every remaining unpublished personality analysis that did not have a production
portrait pair when the batch started. The order comes from `blogs_famous_people.lastmod` in
descending order. There are four entries rather than five because the next unpublished record,
Michael Jordan (`2026-08-14`), already had both production assets.

No generative image model, face reconstruction, or generative fill was used. Every person pixel
comes from the real source photograph listed below. Processing was limited to Apple Vision
foreground segmentation, landmark-guided placement, grayscale and contrast adjustment, edge
contraction, deterministic rotation, resizing, and compositing the repository's unchanged
`face-line-template.png`.

| Last modified | Person          | Type / production slug | Authentic source and author                                                                                                                                                                                                                                        | Source SHA-256                                                     | Rights note                                                                                                                                                                                                                                                                |
| ------------- | --------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-08-20    | Ms. Rachel      | `2 / Ms-Rachel`        | [Us Weekly: “Ms. Rachel Shares Relatable Mom Moment”](https://www.usmagazine.com/celebrity-moms/news/ms-rachel-shares-relatable-mom-moment-with-fans/), source credited to Songs for Littles / YouTube, 2025                                                       | `91aa99af1b38fbfc2af40838e7955214429e1327e102c339a2e47b7d51e0ace0` | Us Weekly identifies the source but provides no open reuse license. The portrait is a transformed editorial-identification use; obtain permission or complete a rights review before publication if the intended use is not covered by the site's terms or applicable law. |
| 2026-08-19    | Bill Burr       | `6 / Bill-Burr`        | [Wikimedia Commons: Bill Burr by Gage Skidmore.jpg](https://commons.wikimedia.org/wiki/File:Bill_Burr_by_Gage_Skidmore.jpg), Gage Skidmore, 2018                                                                                                                   | `d82aa7bea6bd5fc1a986289e0a575a75e04ea0f3e7b2f3e228c8d7a52fa04c7e` | CC BY-SA 3.0. Modified as described above; attribute Gage Skidmore, link the license, indicate changes, and distribute the derivative under the same or a compatible license.                                                                                              |
| 2026-08-17    | Charlize Theron | `8 / Charlize-Theron`  | [Wikimedia Commons: Charlize Theron.jpg](https://commons.wikimedia.org/wiki/File:Charlize_Theron.jpg), Republic of Korea / Korea.net, 2026                                                                                                                         | `6303ea5134a78b136239b3698615bb9d5a41bd653672f051321989d420fb29c3` | CC BY-SA 4.0. Modified as described above; attribute the Republic of Korea / Korea.net, link the license, indicate changes, and distribute the derivative under the same or a compatible license.                                                                          |
| 2026-08-15    | Tyla            | `7 / Tyla`             | [News24: Tyla at the 2025 Nickelodeon Kids' Choice Awards](https://www.news24.com/life/arts-and-entertainment/music/tyla-to-perform-at-global-citizen-festival-in-new-york-alongside-the-weeknd-shakira-20250724-0568), photograph by JC Olivera / WireImage, 2025 | `9a496a90782f3fa6d5b3b1a33c8a52ecf168e82ecf0e14ec3c7d4552f2cb7ed5` | News24 and WireImage provide no open reuse license. The portrait is a transformed editorial-identification use; obtain permission or complete a rights review before publication if the intended use is not covered by the site's terms or applicable law.                 |

## Composition record

All cutouts used the largest detected face center for horizontal alignment and the detected eye
center for the fixed template line. The compositor's default target `(540, 490)`, brightness of 1,
and contrast of 1.08 were retained. Edge contraction was set to 2 px to preserve fine hair detail.

| Person          |    Corrective rotation | Subject height | Face-center anchor X | Eye-center anchor Y | Production files                                                                 |
| --------------- | ---------------------: | -------------: | -------------------: | ------------------: | -------------------------------------------------------------------------------- |
| Ms. Rachel      | 15.5° counterclockwise |           1450 |              720.501 |             337.588 | `static/types/2s/Ms-Rachel.webp`, `static/types/2s/s-Ms-Rachel.webp`             |
| Bill Burr       |         0.8° clockwise |           1050 |             1427.270 |            1001.450 | `static/types/6s/Bill-Burr.webp`, `static/types/6s/s-Bill-Burr.webp`             |
| Charlize Theron |                   none |           1750 |              481.091 |             204.688 | `static/types/8s/Charlize-Theron.webp`, `static/types/8s/s-Charlize-Theron.webp` |
| Tyla            |         8.5° clockwise |           1500 |              565.940 |             334.674 | `static/types/7s/Tyla.webp`, `static/types/7s/s-Tyla.webp`                       |

Each staged pair passed `pnpm portrait:check` with a 1080×1080 full asset, a 480×480
thumbnail, matching aspect ratios, and no warnings.

## Review revision

After visual review on 2026-08-28, Ms. Rachel and Tyla were replaced with the stronger live-source
photographs documented above. Ms. Rachel, Bill Burr, and Tyla received small deterministic
rotations to level their eyes. Bill Burr and Charlize Theron were enlarged while retaining the
landmark-guided eye-line alignment and the unchanged purple-line template.

After a second visual review, Bill Burr, Ms. Rachel, and Tyla were each replaced again with a
different real photograph. The final Bill Burr crop contains no microphone, the final Ms. Rachel
crop contains no hands, and the final Tyla crop contains no raised hands. All three were tightened
around the face and shoulders and re-aligned to the fixed eye-line template.
