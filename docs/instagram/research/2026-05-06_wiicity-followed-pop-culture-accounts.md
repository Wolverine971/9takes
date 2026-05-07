<!-- docs/instagram/research/2026-05-06_wiicity-followed-pop-culture-accounts.md -->

# wiicity-followed Pop Culture Accounts — Data Pull

**Date pulled:** 2026-05-06
**Source signal:** accounts followed by [@wiicity](https://www.instagram.com/wiicity)
**Sample size:** last 12 grid posts per account (Instagram web feed API capped at ~12)
**Method:** Instagram web feed API (`/api/v1/feed/user/{id}/`), logged-in session
**Outlier definition:** any post whose like count is materially higher than the account's recent like median (multiple-of-median shown as `Nx`)

---

## 1. Quick reference table

| Handle                                                        | Display name    | Followers | Following | Verified | Posts | Profile type                                |
| ------------------------------------------------------------- | --------------- | --------: | --------: | -------- | ----: | ------------------------------------------- |
| [rollingstone](https://www.instagram.com/rollingstone/)       | Rolling Stone   | 8,583,637 |       628 | ✓        |   16K | **Mainstream music magazine**               |
| [hidden.ny](https://www.instagram.com/hidden.ny/)             | HIDDEN®        | 3,035,667 |     4,828 | ✓        |   15K | NY culture / streetwear archive             |
| [spaceykacey](https://www.instagram.com/spaceykacey/)         | Kacey Musgraves | 2,800,088 |     2,127 | ✓        |   941 | **Celebrity musician** (country/pop)        |
| [velvetcoke](https://www.instagram.com/velvetcoke/)           | velvey          | 2,027,496 |       399 | –        | 5,479 | Pop culture / fashion archive               |
| [welcome.jpeg](https://www.instagram.com/welcome.jpeg/)       | welcome         | 1,539,448 |     1,187 | –        | 6,612 | "Digital museum" — film/art/culture         |
| [ihategum](https://www.instagram.com/ihategum/)               | 𝑮𝑼𝑴             | 1,139,895 |     2,136 | –        | 5,735 | Pop culture / aesthetic curation            |
| [libraries](https://www.instagram.com/libraries/)             | (no name)       |   717,327 |       840 | ✓        | 3,076 | "Internet culture" curation                 |
| [downloaded](https://www.instagram.com/downloaded/)           | (no name)       |   646,892 |     5,150 | –        | 2,713 | **Private** — culture documentation         |
| [tonsil](https://www.instagram.com/tonsil/)                   | tonsil®        |   491,925 |       777 | –        | 8,029 | Pop culture facts / aesthetic               |
| [lost.in.pieces](https://www.instagram.com/lost.in.pieces/)   | Lost In Pieces  |   437,514 |        36 | –        | 2,002 | Music lyrics / pop fan content              |
| [hiiihorse](https://www.instagram.com/hiiihorse/)             | hihorse         |   421,807 |     1,939 | ✓        | 4,445 | Pop culture / niche internet                |
| [driptriangle](https://www.instagram.com/driptriangle/)       | Drip Triangle ☆ |   225,087 |        99 | –        | 1,409 | "We post about everything interesting"      |
| [weloveurban](https://www.instagram.com/weloveurban/)         | urban           |   188,808 |       529 | ✓        | 3,240 | Music / urban culture                       |
| [staatues](https://www.instagram.com/staatues/)               | ✦ Staatues      |   173,386 |       884 | ✓        | 3,199 | Aesthetic / nostalgia archive               |
| [relewans](https://www.instagram.com/relewans/)               | rel             |   155,609 |       592 | ✓        | 3,223 | Online archive (Budapest)                   |
| [godblessfaketan](https://www.instagram.com/godblessfaketan/) | cyber diva      |   117,756 |       449 | –        | 2,431 | Y2K / Kardashian-era nostalgia              |
| [elevenfourr](https://www.instagram.com/elevenfourr/)         | elevenfour ①①④  |    81,668 |     1,222 | –        |     – | Music / hip-hop culture (Ken Carson, Drake) |
| [flawdofficial](https://www.instagram.com/flawdofficial/)     | FLAWD           |    53,295 |       177 | –        | 1,062 | Art / weird internet / culture              |
| [xfolderr](https://www.instagram.com/xfolderr/)               | X Folder        |    51,173 |       247 | –        |   469 | "Vault of art" archive                      |
| [huedmade](https://www.instagram.com/huedmade/)               | (none)          |         3 |         1 | –        |     0 | **Empty / placeholder**                     |

> Note: `downloaded` is set to private (no public posts even though follower count is high). `huedmade` is essentially empty (3 followers, 0 posts). Both excluded from per-post analysis below.

---

## 2. Standout outlier posts (best signals across the entire pull)

These are posts where the like count was a huge multiple of that account's typical post — meaning the topic / format clearly hit way harder than baseline. Sorted by raw outlier multiplier:

| Multiplier | Account         |   Likes | Comments | What it was                                                          | Link                                     |
| ---------: | --------------- | ------: | -------: | -------------------------------------------------------------------- | ---------------------------------------- |
|   **323x** | staatues        | 606,762 |    1,113 | "GTAV came out 11 years ago today" — gaming nostalgia                | https://www.instagram.com/p/DAA1aJrOpKq/ |
|   **230x** | xfolderr        | 299,811 |      411 | The "Bliss" Windows XP wallpaper, deep dive carousel                 | https://www.instagram.com/p/DSykCSRCDeY/ |
|   **167x** | staatues        | 313,209 |      761 | "Reasons to wear a helmet" motorbike fail compilation                | https://www.instagram.com/p/C9huuLjIqQZ/ |
|   **127x** | relewans        | 725,739 |      377 | "Is originality still a goal, or just a performance?" essay carousel | https://www.instagram.com/p/DJlMvXKIaUb/ |
|   **114x** | staatues        | 213,409 |    1,727 | Power Rangers nostalgia — favorite ranger growing up                 | https://www.instagram.com/p/C9K8Pw3IVUx/ |
|    **96x** | flawdofficial   | 128,478 |      589 | Japanese "Masquerade" talent show ping-pong performance              | https://www.instagram.com/p/DXiDmF_DeYh/ |
|    **79x** | flawdofficial   | 104,925 |      487 | Ulric Collette's "Genetic Portraits" — splicing relatives' faces     | https://www.instagram.com/p/DXYDsYiDdYv/ |
|    **62x** | rollingstone    | 758,461 |    6,831 | BTS May 2026 cover ("biggest cover ever")                            | https://www.instagram.com/p/DXE3wjcFQNV/ |
|    **61x** | driptriangle    | 801,541 |      934 | "Asking AI to make different characters during PS1 Chief Keef era"   | https://www.instagram.com/p/DDxR1ghqH__/ |
|    **52x** | flawdofficial   |  69,843 |      540 | John McAfee — "one of the strangest figures tech ever produced"      | https://www.instagram.com/p/DXImZjGDbEV/ |
|    **46x** | xfolderr        |  59,220 |       23 | Cats share 95.6% DNA with tigers (animal facts)                      | https://www.instagram.com/p/DTT3eTUgLWp/ |
|    **42x** | godblessfaketan | 327,748 |      377 | "Kim Kardashian, Superstar" tape directed by Freddie Fro             | https://www.instagram.com/p/C8U-0dauvB6/ |
|    **31x** | elevenfourr     |  21,968 |      104 | James Goldstein, NBA-courtside millionaire superfan                  | https://www.instagram.com/p/DX7lmnGjYT0/ |
|    **28x** | lost.in.pieces  |  89,198 |       25 | Bad Bunny "BAILE INoLVIDABLE" lyrics card                            | https://www.instagram.com/p/DUYxNoBklpm/ |
|    **27x** | velvetcoke      | 988,773 |    4,869 | Naomi Osaka with butterfly on her nose (2024 first-post-of-year)     | https://www.instagram.com/p/C1kFqeWIs6L/ |
|    **22x** | xfolderr        |  28,883 |      100 | History of Yu-Gi-Oh! the manga, 1996 Kazuki Takahashi                | https://www.instagram.com/p/DX2wZTXiPk6/ |
|    **16x** | godblessfaketan | 121,009 |      614 | Kim K's 26th birthday w/ Paris Hilton, Nick Cannon, Kourtney         | https://www.instagram.com/p/DMaT6ppoONM/ |
|    **15x** | staatues        | 313,209 |      761 | (helmet post — also listed above)                                    | (same as above)                          |
|    **11x** | lost.in.pieces  |  36,254 |       37 | Gracie Abrams new single "hit the wall" tease                        | https://www.instagram.com/p/DX8oHhSlWVz/ |

---

## 3. Per-account top 5 posts

URL pattern: `https://www.instagram.com/p/{code}/` — just append the code to that.

### xfolderr — 51K followers — like median: 1,301

"a vault of art / creator of @oldmemesarchivee @artixiology"

| Code        |   Likes | Cmts | Type     |     xMed | Topic                                    |
| ----------- | ------: | ---: | -------- | -------: | ---------------------------------------- |
| DSykCSRCDeY | 299,811 |  411 | carousel | **230x** | Windows XP "Bliss" wallpaper history     |
| DTT3eTUgLWp |  59,220 |   23 | carousel |  **46x** | Cats share 95.6% DNA with tigers         |
| DX2wZTXiPk6 |  28,883 |  100 | carousel |  **22x** | Yu-Gi-Oh! manga origin (1996)            |
| DXz_LU4AFOF |   2,861 |    3 | carousel |     2.2x | Dog noses have 300M olfactory receptors  |
| DX7SpldiGBT |   1,350 |    0 | carousel |     1.0x | Vagabond illustrations by Takehiko Inoue |

### welcome.jpeg — 1.54M followers — like median: 16,276 / view median: 577,799

"digital museum"

| Code        |  Likes | Cmts |   Views | Type     | xMed | Topic                                                      |
| ----------- | -----: | ---: | ------: | -------- | ---: | ---------------------------------------------------------- |
| DX9gw2ahN8w | 24,650 |   68 | 538,085 | vid      | 1.5x | DiCaprio quaalude scene's 2009 YouTube inspiration         |
| DX4nTLFESii | 23,923 |   51 |       – | carousel | 1.5x | Fine paintings recreated in film                           |
| DX2Ai0SxNRI | 23,748 |   81 | 577,799 | vid      | 1.5x | "The Limits of Control" by Robert Barta (2011)             |
| DX2iW2FlIVv | 21,075 |  180 |       – | carousel | 1.3x | John Lennon signed autograph for his murderer 5 hrs before |
| DX29nT-Fpw4 | 19,972 |   51 |       – | carousel | 1.2x | "We Are Experienced" Danielle Levitt photos                |

> No huge outliers in last 12 — account is consistently in the 16K–25K range. Stable topic mix: film history + art/photography.

### relewans — 156K followers — like median: 5,723

"online archive from budapest / for more -> @msic"

| Code        |   Likes | Cmts | Type     |     xMed | Topic                                                         |
| ----------- | ------: | ---: | -------- | -------: | ------------------------------------------------------------- |
| DJlMvXKIaUb | 725,739 |  377 | carousel | **127x** | "Is originality still a goal, or just a performance?"         |
| DNEOMlBobC6 |  55,446 |   50 | carousel | **9.7x** | Hope is a built-in survival instinct                          |
| DNX4sHjI8YF |  18,912 |   20 | carousel |     3.3x | Anxiety often just a phase, even when it doesn't feel like it |
| DX-v4tkinwP |  17,001 |   24 | carousel |       3x | Upside-down cigarette = good luck folklore                    |
| DX5-lSACuIR |   6,633 |    2 | carousel |     1.2x | Sleep marks explained                                         |

> Big takeaway: **introspective, philosophical carousels** wildly outperform.

### rollingstone — 8.58M followers — like median: 12,326 / view median: 70,380

The actual magazine. Not curation.

| Code        |   Likes |  Cmts | Type             |    xMed | Topic                                        |
| ----------- | ------: | ----: | ---------------- | ------: | -------------------------------------------- |
| DXE3wjcFQNV | 758,461 | 6,831 | carousel         | **62x** | BTS May 2026 cover (declared "biggest ever") |
| DX9Tb2Wh9L2 |  79,182 |   232 | img              |    6.4x | Noah Kahan June 2026 cover                   |
| DX9818Qj43N |  39,186 |   219 | carousel         |    3.2x | Met Gala interior moments                    |
| DX-DecFp3Qh |  15,974 |   159 | vid (282K views) |    1.3x | Noah Kahan opens up about OCD                |
| DX-W95glMOn |  12,704 |    37 | carousel         |    1.0x | Noah Kahan / Vermont relationship            |

> Pattern: cover stars, especially **K-pop / global fandom**, dwarf everything else.

### hiiihorse — 422K followers — like median: 4,962

"hop off your hihorse / extension of @d0mcab"

| Code        |  Likes | Cmts | Type     | xMed | Topic                                                              |
| ----------- | -----: | ---: | -------- | ---: | ------------------------------------------------------------------ |
| DX2kYX9ARfO | 19,132 |  115 | carousel | 3.9x | Death Grips' ExMilitary cover photo origin (1968 aboriginal photo) |
| DXu56nzCRFs | 12,913 |   88 | carousel | 2.6x | Wendy's "lil ugly dude" receipt incident (2016)                    |
| DXuVnHdkeHq | 10,073 |   67 | carousel |   2x | "The CRT Collective" Facebook group spotting old TVs               |
| DXsxmdmDcQn |  5,474 |   24 | carousel | 1.1x | "When We Meet Again" plush by honey lambs                          |
| DXw6EeYkRB9 |  5,092 |   12 | carousel | 1.0x | "Smoke Me" by John Yuyi (2023)                                     |

### velvetcoke — 2.03M followers — like median: 37,326 / view median: 4.6M

"virgo, skinny, rich and a little bit of bitch"

| Code        |   Likes |  Cmts | Type             |    xMed | Topic                                                |
| ----------- | ------: | ----: | ---------------- | ------: | ---------------------------------------------------- |
| C1kFqeWIs6L | 988,773 | 4,869 | carousel         | **27x** | Naomi Osaka + butterfly first post of 2024           |
| DX41k3SiL9Q | 114,717 |   424 | carousel         |    3.1x | Claire Danes 2016 Met Gala light-up gown anniversary |
| DXtpJJ8FWqZ |  64,960 |    97 | carousel         |    1.7x | Not For Radio show in London                         |
| DX5M2PcouJx |  42,440 | 1,512 | vid (4.6M views) |    1.1x | Tyla carried up Met stairs in Balmain                |
| DX5AaMriKZF |  42,040 |   316 | carousel         |    1.1x | Karlie Kloss 2019 Met camp moment retrospective      |

### elevenfourr — 82K followers — like median: 718

"11 4 the culture / curated by @jjjjjjjonasssssss"

| Code        |  Likes | Cmts | Type     |    xMed | Topic                                                   |
| ----------- | -----: | ---: | -------- | ------: | ------------------------------------------------------- |
| DX7lmnGjYT0 | 21,968 |  104 | carousel | **31x** | James Goldstein, NBA millionaire superfan, $500K/season |
| DX-CIMEDeCe |  2,456 |   53 | carousel |    3.4x | Meta cracking down on archive pages — commentary        |
| DV_mHLlDbYX |  2,263 |   32 | carousel |    3.1x | Ken Carson London show, 00pium team                     |
| DX-U5IIjWhX |  1,313 |  127 | carousel |    1.8x | Drake "ICEMAN" music video shoot in Toronto             |
| DXATkyMDaDs |  1,111 |  171 | carousel |    1.5x | Personal birthday post                                  |

### tonsil — 492K followers — like median: 4,561

"enjoy!"

| Code        |  Likes | Cmts | Type     |     xMed | Topic                                                  |
| ----------- | -----: | ---: | -------- | -------: | ------------------------------------------------------ |
| DX7cFImDT_c | 42,068 |   48 | carousel | **9.2x** | Hugh Laurie developed real limp from playing House     |
| DX5o1fmCBkO | 14,020 |   64 | carousel |     3.1x | 1998 anti-drug pencils that backfired                  |
| DX5H7FRDXD- | 13,563 |   60 | carousel |       3x | Angus Cloud discovered walking down Brooklyn street    |
| DX-oYVDCNSJ |  9,759 |  157 | carousel |     2.1x | Met Gala "no phone" rule (2015)                        |
| DX-T5nPjT00 |  5,624 |   22 | carousel |     1.2x | Anthony Bourdain's secret Reddit account "nooyawkcity" |

### spaceykacey (Kacey Musgraves) — 2.8M followers — like median: 67,503 / view median: 1.67M

Album promo phase ("Middle of Nowhere", May 1).

| Code        |   Likes |  Cmts | Type              |     xMed | Topic                                           |
| ----------- | ------: | ----: | ----------------- | -------: | ----------------------------------------------- |
| DVwAhuuFE4w | 354,697 | 5,672 | carousel          | **5.3x** | "Middle of Nowhere" album announcement          |
| DX4gRPXu_4Z | 164,280 | 2,293 | vid (1.8M views)  |     2.4x | "I don't recognize that name" reel              |
| DXt26Syjv4n | 161,411 | 3,279 | img               |     2.4x | "See you in the Middle of Nowhere" early-access |
| DX0QUd1Cf4k | 126,002 | 1,136 | carousel          |     1.9x | Happy middle of nowhere                         |
| DX3BhYvufpD |  97,463 | 1,117 | vid (1.66M views) |     1.4x | "lern it dern it"                               |

> Single artist account during a launch cycle, not a curation account — included for completeness.

### driptriangle — 225K followers — like median: 13,050

"We Post About Everything Interesting"

| Code          |   Likes | Cmts | Type     |    xMed | Topic                                                                          |
| ------------- | ------: | ---: | -------- | ------: | ------------------------------------------------------------------------------ |
| DDxR1ghqH\_\_ | 801,541 |  934 | carousel | **61x** | "Asking AI to make different characters during PS1 Chief Keef era (2012-2013)" |
| DX13LFSjZZH   |  31,893 |   45 | carousel |    2.4x | Edi Okoro creative engagement-photo proposal series (2019)                     |
| DX5DnZfDUsW   |  22,584 |  246 | carousel |    1.7x | Market Basket employee revolt of 2014                                          |
| DXzCbjKDUj2   |  16,012 |   46 | carousel |    1.2x | "Michael" biopic cast vs real people                                           |
| DXtzpUhDTBh   |  13,499 |  137 | carousel |    1.0x | Bruce Willis family donating his brain to science                              |

### weloveurban — 189K followers — like median: 2,770

"Music is peace in a world of chaos"

| Code        |  Likes | Cmts | Type     | xMed | Topic                                               |
| ----------- | -----: | ---: | -------- | ---: | --------------------------------------------------- |
| DCTyc3uulpf | 13,554 |  117 | carousel | 4.9x | "Happy 100K" milestone post                         |
| DX9k-VvES3x | 12,785 |   25 | carousel | 4.6x | "Michael" movie affirmations breakdown              |
| DX5WClPEdPg |  8,181 |    6 | carousel |   3x | malasnoticiastextrañoylosiento — Spanish music post |
| DX7mMzlEVCa |  6,565 |   47 | carousel | 2.4x | "Many versions of Not Like Us" by Kendrick Lamar    |
| DX7vZa8ET97 |  4,451 |    6 | carousel | 1.6x | Frank Ocean's Cody robot at 2021 Met Gala           |

### libraries — 717K followers — like median: 23,019

"internet culture"

| Code        |   Likes | Cmts | Type     |     xMed | Topic                                                           |
| ----------- | ------: | ---: | -------- | -------: | --------------------------------------------------------------- |
| DX5lPx4DlbA | 171,614 |   74 | carousel | **7.5x** | 2009 Tomodachi Life history (Japan-only origins)                |
| DX3A3GKDpdU | 135,882 |  168 | carousel |     5.9x | Eternal Sunshine of the Spotless Mind deleted character         |
| DX269QXjsPB |  84,631 |  103 | carousel |     3.7x | Kendrick Lamar bringing young fan also named Kendrick backstage |
| DX5pSMfDs17 |  51,422 |  186 | carousel |     2.2x | China = world's largest tobacco consumer + producer             |
| DX3DxWPjpJE |  33,455 |  110 | carousel |     1.5x | Regular Show creator JG Quintel started directing animation     |

### godblessfaketan — 118K followers — like median: 7,762

"your fav glitch in the y2k matrix"

| Code        |   Likes | Cmts | Type     |    xMed | Topic                                                         |
| ----------- | ------: | ---: | -------- | ------: | ------------------------------------------------------------- |
| C8U-0dauvB6 | 327,748 |  377 | img      | **42x** | "Kim Kardashian, Superstar" tape directed by Freddie Fro fact |
| DMaT6ppoONM | 121,009 |  614 | carousel | **16x** | Kim K's 26th bday w/ Paris Hilton, Nick Cannon, Kourtney      |
| DX2ogrzF-fQ |  57,755 |  149 | carousel |    7.4x | Kardashians at Kim's 27th bday Vegas jet club, 2007           |
| DNMV4S0ISsd |  43,709 |  583 | img      |    5.6x | (no caption — likely paparazzi/Kardashian shot)               |
| DX-ZKZqiJh7 |   7,857 |  133 | carousel |    1.0x | Pamela Anderson leaving LA party, 2010                        |

> **Y2K-Kardashian-era nostalgia** is this account's lane and it's hugely effective.

### ihategum — 1.14M followers — like median: 20,415

"hey, i'm gum"

| Code        |   Likes | Cmts | Type     | xMed | Topic                                                           |
| ----------- | ------: | ---: | -------- | ---: | --------------------------------------------------------------- |
| DXcfSeJmlMZ | 118,390 |  491 | carousel | 5.8x | Justin Bieber's old IG posts since 2010 (8,913 posts breakdown) |
| DXhkbc6FHPU |  74,466 |   93 | carousel | 3.7x | Origin of Nintendo Mii character design (Miyamoto)              |
| DXkSMTWDx8m |  57,192 |  234 | carousel | 2.8x | Wordplay artworks by Anatol Knotek                              |
| DX7tPVNitHO |  42,108 |  513 | carousel | 2.1x | Shotaro Odate, Honda chief engineer, hairstyle/sign             |
| DX5cIeTinRf |  32,175 |   65 | carousel | 1.6x | (no caption captured)                                           |

### staatues — 173K followers — like median: 1,874

"@statuesarchive"

| Code         |   Likes |  Cmts | Type     |     xMed | Topic                                              |
| ------------ | ------: | ----: | -------- | -------: | -------------------------------------------------- |
| DAA1aJrOpKq  | 606,762 | 1,113 | carousel | **324x** | "GTAV came out 11 years ago today"                 |
| C9huuLjIqQZ  | 313,209 |   761 | carousel | **167x** | "Reasons to wear a helmet" — motorbike near-misses |
| C9K8Pw3IVUx  | 213,409 | 1,727 | carousel | **114x** | Power Rangers nostalgia / favorite ranger          |
| DX5YJtJiNw\_ |   2,770 |    11 | carousel |     1.5x | "Michael" movie cast vs real life                  |
| DX7EW3JiLHF  |   1,890 |     2 | carousel |     1.0x | Ben 10 franchise has generated $7.85B              |

> **Three massive, much-older posts** still fully overshadow their recent grid (recent posts are mostly 1k–3k likes). This account had viral hits and never quite re-hit. Worth studying the format that worked: video/multi-image gaming/childhood nostalgia.

### flawdofficial — 53K followers — like median: 1,336

"be flawed. have fun. fall in love. regret nothing."

| Code        |   Likes | Cmts | Type     |    xMed | Topic                                                        |
| ----------- | ------: | ---: | -------- | ------: | ------------------------------------------------------------ |
| DXiDmF_DeYh | 128,478 |  589 | carousel | **96x** | Japanese "Masquerade" talent show ping-pong stunt            |
| DXYDsYiDdYv | 104,925 |  487 | carousel | **79x** | Ulric Collette "Genetic Portraits" — face splice photography |
| DXImZjGDbEV |  69,843 |  540 | carousel | **52x** | John McAfee profile — "strangest figure tech ever produced"  |
| DX2CILpFF9X |  12,504 |   29 | carousel |    9.4x | Cowboy Bebop creator Watanabe (1998)                         |
| DXrlAE6jf3N |  11,414 |   95 | carousel |    8.5x | 2-yr-old Turkish boy missing 10 hours found by village       |

> This is the most striking account in the entire pull. **Three posts in the recent grid hit 50–100× the median.** Long-form story carousels with a strong hook are the formula.

### hidden.ny — 3.04M followers — like median: 30,914 / view median: 133,762

"Past, Present & Future / Manhattan, New York"

| Code        |   Likes | Cmts | Type     | xMed | Topic                                              |
| ----------- | ------: | ---: | -------- | ---: | -------------------------------------------------- |
| DX7E8pLgHFG | 153,237 |  422 | carousel |   5x | Alysa Liu's "strangely fast" rise (figure skater)  |
| DX5O3HlAKqk |  69,830 |  106 | carousel | 2.3x | Lucki "shhhhh" meme + birthday cakes               |
| DX63_8cgGhG |  69,680 |  188 | carousel | 2.2x | Christopher Moltisanti from The Sopranos as a vibe |
| DX-FzqXmZva |  45,117 |  137 | carousel | 1.5x | Anthony Bourdain Reddit AMA highlights (2016)      |
| DX-fCG2ADnA |  31,525 |   67 | carousel | 1.0x | "Sonder" — every stranger lives a vivid life       |

### lost.in.pieces — 438K followers — like median: 3,234

"for the dreamers"

| Code        |  Likes | Cmts | Type     |      xMed | Topic                                         |
| ----------- | -----: | ---: | -------- | --------: | --------------------------------------------- |
| DUYxNoBklpm | 89,198 |   25 | img      | **27.6x** | Bad Bunny "BAILE INoLVIDABLE" lyrics graphic  |
| DX8oHhSlWVz | 36,254 |   37 | carousel | **11.2x** | Gracie Abrams new single "hit the wall" tease |
| DX4fUS2FH8y | 14,697 |   21 | carousel |      4.5x | Olivia Rodrigo new song "begged" on SNL       |
| DX77PbgmHaZ |  4,182 |    6 | carousel |      1.3x | Sabrina Carpenter Met Gala film-strip dress   |
| DXOG9spFQS8 |  3,781 |    1 | carousel |      1.2x | "drop dead" lyrics — Olivia Rodrigo           |

> Lyric cards (not album-art posts) are the format that scales. Bad Bunny / pop-girlie names dominate the top.

---

## 4. Patterns I noticed (rough — for your analysis)

A few things that jump out across the outliers, just to flag:

1. **Carousels dominate.** Almost every outlier is a carousel. Single image and video posts rarely land at the very top.
2. **Long-form story carousels** with a strong fact-as-hook (the McAfee post, the Hugh Laurie limp post, the Windows XP "Bliss" post, the GTAV anniversary, the Naomi Osaka butterfly) consistently hit huge multipliers — usually because the title/first slide is a flex of obscure-but-instantly-comprehensible knowledge.
3. **Gaming nostalgia / childhood touchstones** are top-tier: GTAV, Power Rangers, Tomodachi Life, Yu-Gi-Oh!, Ben 10, Eternal Sunshine. These cross every demographic.
4. **Met Gala / cover star moments** spike major accounts (Rolling Stone BTS, velvetcoke Met content).
5. **Y2K-era Kardashian / Paris Hilton** reliably outperforms for godblessfaketan and similar accounts.
6. **Lyrics + identifiable artist** (Bad Bunny, Olivia Rodrigo, Gracie Abrams) is the lost.in.pieces formula.
7. **Philosophical / introspective writing** on relewans hit 127× — there's appetite for "essay slides" if the hook is right.
8. Several outlier posts are months or years old (`C8U-0...`, `C9huuLj...`, `C1kF...`, `DDxR...`, `DAA1...`) — meaning these accounts have one or two viral hits that haven't been replicated. Useful to study what was different in those vs. their everyday grid.

---

## 5. Caveats

- API returned only **12 most recent posts** per account (asked for 24, server capped). For the eight biggest accounts I attempted pagination but the cursor approach didn't yield more posts, so the sample is consistently the last ~12. Outliers within the recent grid are still meaningful; outliers from older posts are flagged via shortcode prefix (`C...` codes are roughly 2024-and-earlier, `DX...` codes are recent).
- `downloaded` is a private account.
- `huedmade` is empty (3 followers, 0 posts, 1 following) — likely a placeholder or abandoned handle.
- All like/comment/view counts are snapshot values from 2026-05-06. They will continue to grow.
- This was logged-in scraping via your own session — the numbers are exactly what your account sees.
