# Real-photo portrait replacements — 2026-08-25

These five portraits replace synthetic likenesses created during the August 2026 publishing run.
No generative image model was used for these replacements. Every face and body pixel comes from
the source photograph recorded below. Processing was limited to foreground segmentation, cropping,
grayscale/contrast adjustment, resizing, and compositing the repository's unchanged
`face-line-template.png` (`SHA-256 74b6538bbdbf61cb61ce29a7c8e7a97041108f7fdc20851291c1cd388da09344`).

| Person | Type / slug | Authentic source and author | Source SHA-256 | Rights note |
| --- | --- | --- | --- | --- |
| Simone Biles | `6 / Simone-Biles` | [Wikimedia Commons: Simone Biles Olympic Trials 24.jpg](https://commons.wikimedia.org/wiki/File:Simone_Biles_Olympic_Trials_24.jpg), Ocoudis, 2024 | `760d1365e491a95573ff5a8011f26f8371be12605a0e10237a14b794c25b82b4` | Dedicated to the public domain under CC0 1.0. Modified as described above. |
| Jonathan Bailey | `3 / Jonathan-Bailey` | [Wikimedia Commons: Jonathan Bailey in November 22, 2024.png](https://commons.wikimedia.org/wiki/File:Jonathan_Bailey_in_November_22,_2024.png), Barbie Simons, 2024 | `7f02b7e7ec1f4f3176713b314901d5c7f47d1b3f88ab2cba736231930b17a6e0` | CC BY-SA 3.0. Modified as described above; the resulting portrait is distributed under the same license. |
| Alexandr Wang | `3 / alexandr-wang` | [Wikimedia Commons: Alexandr Wang, Chief A.I. Officer, Meta.jpg](https://commons.wikimedia.org/wiki/File:Alexandr_Wang,_Chief_A.I._Officer,_Meta.jpg), Meta Platforms | `b9e2de7b751a273f8f8cd97207c1c9b3a61d724942a893f07ecac3e1fd37f2ac` | CC BY-SA 4.0; permission is VRT-confirmed on the source page. Modified as described above; the resulting portrait is distributed under the same license. |
| Yang Zhilin | `5 / Yang-Zhilin` | [2026 Zhongguancun Forum speaker profile](https://www.zgcforum.com.cn/en2026/guest/t23806/962869), official event portrait | `a7c54d778633c0949de9859fec98f8368080ac9cf37562a77a46a0a736ef1903` | Official subject-identifying press/event image. The source page does not state an open-content license. |
| Liang Wenfeng | `5 / Liang-Wenfeng` | [2019 Golden Bull Awards speech documentation](https://finance.sina.com.cn/money/smjj/smgd/2019-08-31/doc-iicezzrq2536765.shtml), China Securities Journal photograph by Che Liang; [higher-resolution reproduction](https://www.gzeromedia.com/media-library/deepseek-founder-liang-wenfeng.jpg?height=698&id=56712638&width=1200) used for the portrait | `fc8188f9112c8ac22ae9bdb7547c595663249d226e53007b58039a948bd2f8d5` | Editorial event photograph. The source pages do not state an open-content license. This documented 2019 appearance avoids the unrelated stock photograph that has sometimes been misidentified as Liang. |

The Jonathan Bailey asset remains in the portrait-approval staging area and is not marked as
published. The other four replace the corresponding full and `s-` production assets.

The 2026-08-25 alignment pass measures the largest photographed face and its eye landmarks with
Apple Vision, then places the face center at x=540 and the eye line at y=490 on the 1080×1080
master. This keeps asymmetric shoulders, hair, microphones, and gestures from pulling the face
off-center. No pixels were generated or reconstructed during the alignment pass.

On 2026-08-26, Alexandr Wang's subject height was increased from 1280px to 1650px while retaining
the same landmark anchors. This makes his face approximately 29% larger without changing the
source photograph, template, or processing method.
