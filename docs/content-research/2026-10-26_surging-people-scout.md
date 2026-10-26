<!-- docs/content-research/2026-10-26_surging-people-scout.md -->

# Surging People Scout: 2026-10-26

## TL;DR: top moves this week

**Two plumbing bugs are keeping four finished, DJ-reviewed pages off the site.** Fix those before queueing anything new. After that, the biggest live wave is one 9takes already half-owns: the Fielder/Holmes documentary.

0. **Unblock the publisher (two fixes, ~10 min).**
   - **(a) The release hash counts the `path:` field.** `pnpm label-paths` (run inside `gen:all`) adds a `path:` line to every draft's frontmatter. `editorialHash()` in `scripts/lib/blogEditorial.js` hashes every non-bookkeeping frontmatter key, so each run silently invalidates every pending v3 release. It last ran in DJ's Oct 21 and Oct 26 commits.
     - Verified: removing just that line restores a valid release for **Paapa Essiedu, Stella Lefty, Ella Beatty, Ben Shelton and Dhar Mann**.
     - `readPublishCandidate` shows that is the **only** blocker for the first four. Dhar Mann also lacks a portrait.
   - **(b) The 6 AM publisher crashes before starting** (Oct 23–26 logs: `dyld: Library not loaded … libada.3.dylib`).
     - The OpenClaw gateway (PID 812) has run since **Oct 7** on Homebrew `node/26.5.0`. Homebrew upgraded `ada-url` to `libada.4` on **Oct 22**, so that binary can no longer load.
     - Fix: pin `/opt/homebrew/bin/node` (node@24, matching the project's engines policy) in `scripts/daily-blog-publisher.sh`, and/or restart the gateway.
1. **Nathan Fielder — FINISH — 88.** He co-directed _You Can See Everything_ (A24, Oct 16), the Holmes/Billy Evans meta-doc.
   - Wikipedia: **1,007/day in June → ~80K/day, sustained for 10 days** (115K peak Oct 19).
   - His draft (7.9) is unpublished and was written before the release.
   - Action: `--refresh` with release facts → clear 8.5 → DJ review. Every day costs part of the wave.
2. **Florence Pugh — FINISH — 90.** _Avengers: Doomsday_ and _Dune: Part Three_ both open **Dec 18**.
   - Wikipedia L30 39.9K/day (5.3K in June).
   - The Oct 4 run was held as `insufficient_evidence` on one load-bearing quote (verify-01).
   - Action: one targeted quote repair + re-verify. Must be live by ~Dec 1.
3. **Daniela Amodei — CREATE (re-run held research) — 83.**
   - **Anthropic filed its public S-1 today** (EDGAR, Oct 26; Nasdaq "ANT"). It names her President and Chair, age 39, one of seven founder-share holders.
   - IPO reported for **Nov 19–20** (Fox Business via Investing.com; unconfirmed).
   - Trends: `anthropic ipo` 50K+ in the last 24h (VERIFIED SEARCH, related cluster).
   - Her Oct 6 run was held at research for a thin typing discriminator, and the gate itself said to re-check after the public S-1. New sources: the S-1 and the Isaacson _The Builders_ podcast (Oct 20). If the record is still thin, use the Open Case format.
4. **Joseph Zada — FINISH — 79.** _Sunrise on the Reaping_ (Haymitch, lead) opens **Nov 20**.
   - His Oct 5 `--refresh` died mid-draft (`run.json` still says `running`).
   - Action: relaunch tonight. Index runway is already short.
5. **New CREATE tranche (13 names), led by deadline:** Mckenna Grace (Nov 20), Anthony Ippolito (_I Play Rocky_, Nov 6/20), Hunter Schafer (_Blade Runner 2099_, Nov 25), Dominic Fike (first top 10 + album Oct 30), Paul Bettany (_VisionQuest_ finale Nov 10), Geoffrey Hinton (_Artificial_, Dec 25). Full table below.

**Capacity caveat:** the nightly pipeline runs one subject a day. Of the 41 pipeline runs since Oct 4 (nightly + manual), **11 reached `eligible`**. The rest: 11 `insufficient_evidence`, 10 `needs_revision`, 5 pending/timed out, 4 other. Of the 7 pages live since Oct 4, only Garfield (Oct 5) and Dakota Johnson (Oct 9) went out through the 6 AM publisher; the other 5 were published by hand. Queueing 14 names fills two weeks, but the finish fixes above are worth more than any single CREATE.

## FINISH / PUBLISH (existing drafts, ranked by opportunity × readiness)

All rows below were checked with `readPublishCandidate` / `blog-editorial-check.mjs --release` and each run's `summary.json` on 2026-10-26.

| Person                          |   Score |     Grade | Production state                                                                             | Current catalyst                                                               | Smallest next action                                                                                                                                                    |
| ------------------------------- | ------: | --------: | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Paapa Essiedu                   |      75 |       8.6 | **`reviewed: true`, ready, portrait OK; only blocker is the `path`-stale release**           | HBO _Harry Potter_ (Snape) **Dec 25**                                          | Fix #0 → auto-publishes. Ideal timing: 8 weeks of runway.                                                                                                               |
| Stella Lefty                    |      65 |       8.4 | **Same: reviewed, portrait OK, `path`-only blocker**                                         | Tour Oct 30–Nov 23; Grammy noms Nov 16 (she isn't in the BNA markets)          | Fix #0.                                                                                                                                                                 |
| Ella Beatty                     |      54 |       8.2 | **Same**                                                                                     | Past peak (L7 9.9K vs 154K on Sep 20); Globes Dec 7 (speculative)              | Fix #0. Free page.                                                                                                                                                      |
| Ben Shelton                     |      34 |       8.5 | **Same** (2 `http://` citations are dropped with a warning, not blocked)                     | Faded; athlete niche                                                           | Fix #0. Let it publish. It's done.                                                                                                                                      |
| Dhar Mann                       |      43 |       8.6 | Reviewed + ready; `path`-stale + **no portrait**                                             | Evergreen creator (L7 765)                                                     | Fix #0 + portrait (manual Canva).                                                                                                                                       |
| **Nathan Fielder**              |  **88** |       7.9 | Unpublished; last run Sep 9 (before release)                                                 | _You Can See Everything_: A24 doc opening record, wide Oct 23; Oscar doc race  | `run-blog-pipeline.sh Nathan-Fielder --refresh` today. Add directing credit (with Lance Oppenheim), release/reviews. Cross-link to the published Elizabeth Holmes page. |
| **Florence Pugh**               |  **90** |       8.4 | Held `insufficient_evidence` (verify-01: the most personal quote + "people pleaser" frame)   | **Dec 18 ×2** tentpoles; L30 39.9K                                             | Targeted repair of the one quote, re-verify, DJ review. Live by ~Dec 1.                                                                                                 |
| **Joseph Zada**                 |  **79** |       7.9 | Oct 5 `--refresh` died at draft stage                                                        | _Sunrise on the Reaping_ **Nov 20** (lead); L7 6.5K                            | Relaunch `--refresh` tonight. Aim to publish by ~Nov 8.                                                                                                                 |
| Sienna Spiro                    |      70 |       8.3 | Needs `--refresh --expanded-review` (type-thesis scope change)                               | Grammy BNA noms **Nov 16** (~24% in prediction markets)                        | Expanded-review rerun this week, before Nov 16.                                                                                                                         |
| Greg Brockman                   |      69 |       8.3 | Needs revision (enneagram 7.8). **Local `published: true` but DB unpublished**: fix the flag | _Artificial_ (Cooper Hoffman) **Dec 25**                                       | One typing-discriminator revision → DJ review.                                                                                                                          |
| Christopher Abbott              |      67 |         — | Oct 19 run: stage timed out                                                                  | L7 20K; _East of Eden_; X-Men (2028)                                           | Resume the run.                                                                                                                                                         |
| Mike Faist                      |      56 |       8.4 | Needs revision (verification: revise)                                                        | Fading (L7 ~5K); Globes Dec 7                                                  | Low priority.                                                                                                                                                           |
| Stable Ronaldo                  |      56 |       8.4 | Aug pre-v3 draft, held < 8.5                                                                 | **Streamer Awards Nov 12** (Streamer of the Year nominee)                      | Optional: streamer niche converts well (see Lay of the land).                                                                                                           |
| Olivia Dean                     |      53 |       8.2 | `insufficient_evidence`, enneagram 7.5                                                       | Won BNA 2026, so not eligible for BNA again; other Grammy noms possible Nov 16 | Park.                                                                                                                                                                   |
| Austin Abrams / Maleah Joi Moon | 50 / 45 | 8.1 / 8.0 | Held                                                                                         | Past peak                                                                      | Park.                                                                                                                                                                   |

## CREATE (new blogs, ranked by search-demand × niche strength)

Wikipedia figures are daily user pageviews, June avg → last 30 → last 7 (PLATFORM GROWTH). No covered person is in this table.

| Person                | Score | Niche                                 | Horizon  | Catalyst / spike ladder                                                                                                                               | Demand signal type                                                          | Enneagram angle (hypothesis only)                                                                                                                        | Confidence                    |
| --------------------- | ----: | ------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| Mckenna Grace (20)    |    77 | rising-star / newMovieStar            | NEXT     | _Sunrise on the Reaping_ (Maysilee) **Nov 20** → Globes Dec 7 → music releases                                                                        | CALENDAR FORECAST + PLATFORM GROWTH (8.4K → 9.6K → 11.9K, rising)           | Unassigned. Use **adult-era** first-person material only; much of her record is from childhood.                                                          | High                          |
| Hunter Schafer (27)   |    79 | movieStar / rising-star               | NOW/NEXT | NYCC trailer Oct 10 → **_Blade Runner 2099_ all 8 eps Nov 25** (Prime)                                                                                | PLATFORM GROWTH (11.7K → 16.2K → **42.1K**, peak 118K Oct 20) + CALENDAR    | Unassigned. The Oct 20 spike came from a personal-life interview: not personality evidence; handle identity topics with care.                            | High                          |
| Dominic Fike (30)     |    75 | **alternative-artist** (strong prior) | NOW      | "Babydoll" first Hot 100 top 10 (#10, Oct 24 chart) → **album _How To Quit Smoking_ Oct 30** → Billboard 200 debut → Europe tour Feb 2027; _Euphoria_ | PLATFORM GROWTH (4K → 3.1K → 6.1K; 15K Oct 20) + NEWS                       | Unassigned. Deep interview record.                                                                                                                       | Medium-high                   |
| Paul Bettany (55)     |    74 | movieStar                             | NOW      | _VisionQuest_ (Disney+) premiered Oct 13/14, weekly → **finale Nov 10**; _Avengers: Doomsday_ Dec 18 (his return **unconfirmed**; he dodged on GMA)   | PLATFORM GROWTH (3.5K → 10.9K → 15.8K, peak 43.6K **Oct 25**, still rising) | Unassigned. Reuters premiere interview: "career over" story before the Vision offer.                                                                     | High                          |
| Geoffrey Hinton (78)  |    74 | **frontier-builder**                  | NEXT     | Capitol Hill warning Sep 17 → **_Artificial_ Dec 25** (Mark Rylance plays him) → Globes Dec 7 / Oscars noms ~Jan 21                                   | PLATFORM GROWTH (1.7K → 3.2K → 2.4K) + CALENDAR                             | Unassigned. Very deep record (60 Minutes, Diary of a CEO, Nobel lecture).                                                                                | Medium-high                   |
| Anthony Ippolito (27) |    73 | newMovieStar                          | NEXT     | TIFF People's Choice nominee → **_I Play Rocky_ (Stallone) limited Nov 6, wide Nov 20** → Globes                                                      | PLATFORM GROWTH (208 → 2.8K → 4.8K) + CALENDAR + NEWS                       | Unassigned. TheWrap casting interview. **ENTITY GAP AUDIT.**                                                                                             | Medium                        |
| Tom Rhys Harries (36) |    72 | newMovieStar                          | NOW      | _Clayface_ (first franchise lead) **#1, $24M, Oct 23** → 2nd weekend Oct 30 → PVOD (date TBD)                                                         | PLATFORM GROWTH (1.3K → 9.7K → **24.3K**, still rising) + NEWS              | Unassigned. Medium record (SDCC interviews). **ENTITY GAP AUDIT.**                                                                                       | Medium                        |
| Jay-Z (56)            |    75 | music (rap/business)                  | NEXT     | **Super Bowl LXI halftime, Feb 14** (Puck, Oct 20: **reported, unconfirmed**) → Grammys Feb 7                                                         | NEWS + CALENDAR (reported); PLATFORM GROWTH steady 5.4–6.8K                 | Unassigned. _Decoded_ memoir. A large evergreen gap; the SERP is saturated (see conversion note).                                                        | Medium (catalyst unconfirmed) |
| Chris Olah            |    68 | frontier-builder                      | NEXT     | **S-1 Oct 26 names him a co-founder** with founder stock → IPO ~Nov 19–20 (reported)                                                                  | NEWS + CALENDAR; PLATFORM GROWTH ~600–1.1K                                  | Unassigned. Deep (colah.github.io, Lex #452).                                                                                                            | Medium                        |
| Josie Totah (25)      |    67 | rising-star                           | NOW      | _Carrie_ (Prime, Oct 7, #1 ~1 week) → S2 renewal pending                                                                                              | PLATFORM GROWTH (793 → 21.5K → 18.3K)                                       | Unassigned. Deep record. Gender identity is not personality evidence.                                                                                    | Medium                        |
| Larry Ellison (82)    |    67 | big-tech-founder                      | NOW      | Paramount–WBD → "Skydance" (Oct 19) + Oracle debt coverage (WSJ Oct 20) + Musk ~$1B into Skydance (reported Oct 22)                                   | PLATFORM GROWTH (5.8K → 7.6K → 6.6K) + NEWS                                 | Unassigned. Deep (keynotes, _Softwar_). Evergreen top-5-richest gap.                                                                                     | Medium                        |
| Ludwig Ahgren (31)    |    65 | **streamer**                          | NOW      | Married QTCinderella (Oct) → **Streamer Awards Nov 12** (she hosts)                                                                                   | PLATFORM GROWTH (1K → 1.2K → 2K) + CALENDAR                                 | Unassigned. Deep (streams, _The Yard_).                                                                                                                  | Medium                        |
| QTCinderella (32)     |    64 | **streamer**                          | NOW      | Hosts Streamer Awards **Nov 12**; married Ludwig                                                                                                      | PLATFORM GROWTH (755 → 1K → 2K) + CALENDAR                                  | Unassigned. Pair with Ludwig for cross-links.                                                                                                            | Medium                        |
| Linda Cardellini (51) |    65 | movieStar                             | NOW      | _Crystal Lake_ (Peacock, #1, Oct 15) → _Way of the Warrior Kid_ (Apple) **Nov 20**                                                                    | PLATFORM GROWTH (7.2K → 16K → 29K) + CALENDAR                               | Unassigned. Deep record.                                                                                                                                 | Medium                        |
| Billy Evans (34)      |    65 | business operator                     | NOW      | Doc subject; Wikipedia article created Oct 20 → **95.6K views on Oct 25, still rising**; streaming release TBD; Oscars                                | PLATFORM GROWTH + RELATED SEARCH CLUSTER (Theranos/Holmes)                  | Hold. Ambiguity −10; press calls Haemanthus "Theranos 2.0", which is a characterization, not a finding. If made: Open Case format. **ENTITY GAP AUDIT.** | Low-medium                    |

**Recommended queue order** (deadline-led; the pipeline does 1/night): Daniela Amodei → Mckenna Grace → Anthony Ippolito → Hunter Schafer → Dominic Fike → Paul Bettany → Tom Rhys Harries → Geoffrey Hinton → Jay-Z → Chris Olah → Ludwig Ahgren → QTCinderella → Josie Totah → Larry Ellison. Linda Cardellini and Billy Evans are optional.

## UPDATE (already covered, re-surging or stale)

| Person                  | Last updated                                                          | What re-surged                                                                                                                                                      | Why update beats new                          | Suggested angle                                                                                             |
| ----------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Dario Amodei            | 2026-03-23 lastmod (Oct 4 refresh synced; live page mentions the IPO) | **Public S-1 Oct 26**; IPO ~Nov 19–20 (reported). GSC 213 (Jun) → 3,826 (Sep), position 8.8                                                                         | Already ranks page-1-adjacent for bio queries | S-1 facts: CEO, age 43, control structure (Class T / founder Class F). Second currency pass when it prices. |
| Sam Altman              | 2026-03-01                                                            | _Artificial_ wide **Dec 25** (Garfield). **Neither DB nor local draft mentions the film** (the Oct 4 "refresh done" didn't land it). Texas suit Oct 23 (allegation) | Old URL; GSC 800 (Sep)                        | Add _Artificial_ + the board-crisis portrayal. Allegations stay attributed. Before ~Dec 1.                  |
| Ella Langley            | 2026-07-03                                                            | "Choosin' Texas" 24 weeks at #1; BNA favorite (~61%); **CMAs Nov 18 (9 noms)**; Grammy noms Nov 16                                                                  | GSC 1,427 (Sep), already strong               | Chart run + nominations; update before Nov 16.                                                              |
| Druski                  | 2026-04-29 (grade 8.0)                                                | **Hosts SNL Nov 7**; Forbes Top Creators #7                                                                                                                         | GSC 833 (Sep)                                 | Add SNL + Forbes; a raise toward 8.5 while there.                                                           |
| Adéla                   | 2026-08-14                                                            | "Nicole Kidman" #6 Hot 100; BNA contender (~10%)                                                                                                                    | GSC 470 (Sep)                                 | Update right after Nov 16 noms if nominated.                                                                |
| Mira Murati / Elon Musk | Jul 28 / Feb 18                                                       | Portrayed in _Artificial_ (Barbaro / Barinholtz); neither page mentions it                                                                                          | Existing URLs                                 | Bundle with the Altman pass: one line + cross-links.                                                        |

## CROSS-REFERENCE / DISTRIBUTION (covered + healthy, ride the wave)

- **Elizabeth Holmes:** Wikipedia **214K/day (L7)**. The page already covers the doc and Billy Evans. But 9takes earned only **87 GSC impressions in Sep and 31 for Oct 1–19**: the name SERP is saturated, so a refresh won't move rankings. Ride it with distribution (a Reel/carousel on the doc's "can she change?" question), and link Holmes ↔ Fielder the day Fielder publishes. Also link Holmes ↔ Sam Bankman-Fried ahead of Netflix's _The Altruists_ (**Nov 19**, Julia Garner as Caroline Ellison).
- **Oct 31 SNL:** Inde Navarrette hosts (published Oct 22), and Gracie Abrams is the musical guest (published; GSC 1,401 Sep). One social asset that weekend.
- **Streamer Awards, Nov 12:** IShowSpeed (GSC 5,772 Sep), CaseOh and Jynxzi are all published Streamer of the Year nominees. Nominee-roundup distribution plus cross-links. Jynxzi drift: **DB published, local draft says `published: false`**.
- **_Artificial_ cluster (Dec 25):** Garfield, Sutskever, Brockman, Murati, Musk, Dario. Add a cluster link block once Hinton is live.
- **Dune 3 / Doomsday (Dec 18):** Zendaya (GSC 3,500 Sep) and Robert Pattinson (1,684). Link to Pugh when she publishes.
- **sombr** (published today): Grammy noms Nov 16 → MSG Nov 23.

## SKIPPED (and why)

- **Deaths:** Tom Skerritt (d. Oct 21; 406K peak Oct 23) and RJ Mitte (d. Oct 12). Obituary spikes; guardrail.
- **Ethan Klein:** 7-day spike (Trends 500K+) driven by a separation and **alleged** affair; H3 is on indefinite hiatus (Oct 22). Allegation-driven, no forward catalyst. −10. Recheck if he returns with a new show.
- **Sunny Balwani:** L7 41.6K, but no first-person record (trial record only). −15.
- **Summer H. Howell (22):** _Carrie_ lead, L7 17K from 210 in June, but one interview. Thin record (−15 → 49). On the WATCHLIST.
- **Candice Swanepoel, Emily Osment:** Oct 25 spikes with no catalyst found.
- **Politicians and athletes** (Vivek Ramaswamy, Jared Kushner, Cooper Flagg, Kimi Antonelli, Mark Carney): first-party prior of near-zero 9takes search traffic.
- **Minors:** HBO _Harry Potter_ child leads; Nakoa-Wolf Momoa (17); the child roles in _Crystal Lake_ and _Narnia_.
- **Lisa (BLACKPINK):** EP Oct 23, but severe name ambiguity.
- **Low demand:** Jack Clark, Sam McCandlish, Yura Borisov, Kelvin Harrison Jr., 2hollis.

## Lay of the land (intel notes)

- **The doc wave is the biggest cultural moment in our lane.** _You Can See Everything_ put Holmes (214K/day), Fielder (80K), Billy Evans (96K), Sunny Balwani (42K) and Tyler Shultz (9.8K) all on the Wikipedia top lists. We own Holmes, which barely ranks, and have an unpublished Fielder draft. Fielder is the pick: a creator/director whose SERP isn't a news wall.
- **Conversion beats raw demand.** Raw Wikipedia demand is a poor proxy for what 9takes can capture. Sept GSC impressions vs Wikipedia demand:
  - Jynxzi: 247 impressions from ~850 views/day.
  - Dario Amodei: 3,826 from ~19K/day.
  - Elizabeth Holmes: 87 from >100K/day.
  - Of the 122 pages launched May–Sep, the winners are streamers (Asmongold 2,380, CaseOh, Duke Dennis), pop/alt musicians (Selena Gomez 2,187, Oliver Tree 1,619, Gracie Abrams 1,401) and frontier-builders. New movie stars land mid-pack (Callum Turner 261, Aaron Pierre 228). The median is 64.
  - Measured across all published pages: Sep GSC impressions per 1,000 Sep Wikipedia views (402 of 457 pages matched a Wikipedia title; only pages with ≥3K Sep views; medians):

    | Niche bucket       |   n | Impressions per 1K views |
    | ------------------ | --: | -----------------------: |
    | streamer / creator |  55 |                     2.27 |
    | frontier / tech    |  55 |                     1.91 |
    | musician           |  62 |                     0.78 |
    | movie / TV         | 100 |                     0.77 |
    | historical/author  |  16 |                     0.47 |
    | politician/athlete |  30 |                     0.34 |

  - Read: a movie star needs ~3× a streamer's public demand to earn the same 9takes traffic, and a politician or athlete ~6×. Caveats: titles were guessed from slugs (a disambiguation hit inflates a ratio, e.g. "Drake"), and pages published in October have no September GSC.
- **AI cluster timing is perfect.** Public S-1 today → IPO ~Nov 19–20 (reported) → _Artificial_ Dec 25 → awards.
- **Awards calendar in window:** Streamer Awards Nov 12, Latin Grammys Nov 12, **Grammy noms Nov 16**, CMAs Nov 18, Globes noms Dec 7, Globes Jan 10, Grammys Feb 7, Super Bowl Feb 14, Oscars Mar 14. Oscar nominations ~Jan 21 is unconfirmed.
- **Under-indexed:** streamers (strong conversion, few new entries since Aug) and alternative artists (Dominic Fike, Cameron Winter/Geese, Remi Wolf).

## 30–120 day catalyst calendar

| Date/window           | Person                                                                         | Catalyst                        | Current action                    | Recheck trigger                      |
| --------------------- | ------------------------------------------------------------------------------ | ------------------------------- | --------------------------------- | ------------------------------------ |
| Oct 30                | Dominic Fike                                                                   | Album _How To Quit Smoking_     | CREATE (queue)                    | Billboard 200 debut                  |
| Oct 31                | Inde Navarrette, Gracie Abrams                                                 | SNL host / musical guest        | Distribution                      | —                                    |
| Nov 6 / Nov 20        | Anthony Ippolito                                                               | _I Play Rocky_ limited / wide   | CREATE                            | Opening reviews                      |
| Nov 7                 | Druski                                                                         | SNL host                        | UPDATE                            | —                                    |
| Nov 10                | Paul Bettany                                                                   | _VisionQuest_ finale            | CREATE                            | Doomsday cast confirmation           |
| Nov 12                | Ludwig, QTCinderella, Stable Ronaldo, IShowSpeed, CaseOh, Jynxzi               | Streamer Awards                 | CREATE ×2 / FINISH / distribution | Winners                              |
| Nov 16                | Sienna Spiro, Stella Lefty, Ella Langley, Adéla, Slayyyter, Olivia Dean, sombr | Grammy nominations              | FINISH / UPDATE / WATCH           | Nomination list                      |
| Nov 18                | Ella Langley                                                                   | CMAs (9 noms)                   | UPDATE                            | —                                    |
| ~Nov 19–20 (reported) | Daniela + Dario Amodei, Chris Olah                                             | Anthropic IPO                   | CREATE / UPDATE / CREATE          | Pricing date announced               |
| Nov 19                | Julia Garner, SBF                                                              | _The Altruists_ (Netflix)       | WATCH / distribution              | Reviews                              |
| Nov 20                | Joseph Zada, Mckenna Grace                                                     | _Sunrise on the Reaping_        | FINISH / CREATE                   | Opening weekend                      |
| Nov 20                | Linda Cardellini                                                               | _Way of the Warrior Kid_        | optional CREATE                   | —                                    |
| Nov 25                | Hunter Schafer                                                                 | _Blade Runner 2099_             | CREATE                            | —                                    |
| Dec 7                 | many                                                                           | Golden Globe nominations        | —                                 | Nominee list                         |
| Dec 18                | Florence Pugh, Zendaya, Pattinson                                              | _Doomsday_ + _Dune: Part Three_ | FINISH / cross-link               | —                                    |
| Dec 25                | Garfield, Altman, Hinton, Brockman, Murati, Helen Toner                        | _Artificial_ wide               | UPDATE / CREATE / FINISH          | Box office                           |
| Dec 25                | Paapa Essiedu                                                                  | HBO _Harry Potter_              | FINISH (fix #0)                   | Weekly cadence                       |
| Feb 14, 2027          | Jay-Z (reported)                                                               | Super Bowl LXI halftime         | CREATE                            | Official NFL/Roc Nation announcement |

## WATCHLIST

- **Summer H. Howell:** first lead, demand 80× June. Trigger: _Carrie_ S2 renewal or 2+ long-form interviews. Recheck: Nov 15. Route to `/find-emerging-entity-gaps`.
- **Curry Barker / Kane Parsons:** YouTuber-turned-directors with $523M / $400M horror hits. Demand is fading from summer peaks. Trigger: _Backrooms 2_ confirmation, Globes box-office nomination (Dec 7), or a _Texas Chain Saw_ trailer. Recheck: Dec 8.
- **Slayyyter:** trigger: BNA nomination Nov 16 (Kalshi ~79%), album Dec 4. Recheck: Nov 16.
- **Helen Toner:** trigger: _Artificial_ marketing that features the board-coup storyline. Recheck: Dec 1.
- **Tyler Shultz:** deep record; Holmes-cluster SERP risk. Trigger: sustained >5K/day after Nov 15. Recheck: Nov 15.
- **Vanillamace, Joe Bartolozzi, Marlon:** streamer breakouts. Trigger: Streamer Awards wins Nov 12. Recheck: Nov 13. Route to the entity-gap audit.
- **Callina Liang / Keri Russell / Mackenzie Davis:** current hits but no next dated catalyst. Recheck: Dec 1.
- **Dove Cameron:** album Nov 6, married Sep 24. Recheck: Nov 10.
- **Ethan Klein:** see SKIPPED. Recheck: Dec 1.

## Queue-ready entries (for backlog-queue.json)

The current queue maximum is 68 (`drew-afualo`); 70 is in progress (`dhar-mann`). Priorities below start above that, in deadline order. **Append only after DJ picks.**

```json
[
	{
		"name": "daniela-amodei",
		"displayName": "Daniela Amodei",
		"type": null,
		"priority": 90,
		"priorityReason": "Anthropic public S-1 filed Oct 26 (President + Chair, founder shares); IPO reported Nov 19-20; 'anthropic ipo' trending 50K+. Oct 6 run held for a thin discriminator; new sources: S-1 + Isaacson The Builders podcast (Oct 20). Open Case format if still thin.",
		"estimatedTraffic": "high",
		"searchVolume": "medium",
		"personaTitle": null,
		"addedToQueue": "2026-10-26",
		"retryCount": 0,
		"strategicValue": "ai-founders-cluster"
	},
	{
		"name": "mckenna-grace",
		"displayName": "Mckenna Grace",
		"type": null,
		"priority": 88,
		"priorityReason": "Sunrise on the Reaping (Maysilee) Nov 20; Wikipedia 8.4K->11.9K/day rising. Adult-era sources only.",
		"estimatedTraffic": "high",
		"searchVolume": "high",
		"personaTitle": null,
		"addedToQueue": "2026-10-26",
		"retryCount": 0,
		"strategicValue": "hunger-games-cluster"
	},
	{
		"name": "anthony-ippolito",
		"displayName": "Anthony Ippolito",
		"type": null,
		"priority": 87,
		"priorityReason": "First lead: plays Stallone in I Play Rocky (limited Nov 6, wide Nov 20); TIFF People's Choice nominee; Wikipedia 208->4.8K/day.",
		"estimatedTraffic": "medium",
		"searchVolume": "medium",
		"personaTitle": null,
		"addedToQueue": "2026-10-26",
		"retryCount": 0,
		"strategicValue": "awards-season-breakouts"
	},
	{
		"name": "hunter-schafer",
		"displayName": "Hunter Schafer",
		"type": null,
		"priority": 86,
		"priorityReason": "Blade Runner 2099 (Prime) all episodes Nov 25; Wikipedia 11.7K->42.1K/day L7. Oct 20 personal-life spike is not personality evidence.",
		"estimatedTraffic": "high",
		"searchVolume": "high",
		"personaTitle": null,
		"addedToQueue": "2026-10-26",
		"retryCount": 0,
		"strategicValue": "streaming-leads"
	},
	{
		"name": "dominic-fike",
		"displayName": "Dominic Fike",
		"type": null,
		"priority": 85,
		"priorityReason": "First Hot 100 top 10 (Babydoll #10, Oct 24 chart); album How To Quit Smoking Oct 30; Europe tour Feb 2027. Alternative-artist niche.",
		"estimatedTraffic": "high",
		"searchVolume": "medium",
		"personaTitle": null,
		"addedToQueue": "2026-10-26",
		"retryCount": 0,
		"strategicValue": "alternative-artist-cluster"
	},
	{
		"name": "paul-bettany",
		"displayName": "Paul Bettany",
		"type": null,
		"priority": 84,
		"priorityReason": "VisionQuest (Disney+) weekly to Nov 10 finale; Wikipedia 3.5K->15.8K/day, peak Oct 25. Doomsday return unconfirmed.",
		"estimatedTraffic": "medium",
		"searchVolume": "medium",
		"personaTitle": null,
		"addedToQueue": "2026-10-26",
		"retryCount": 0,
		"strategicValue": "marvel-cluster"
	},
	{
		"name": "tom-rhys-harries",
		"displayName": "Tom Rhys Harries",
		"type": null,
		"priority": 83,
		"priorityReason": "Clayface lead, #1 opening $24M Oct 23; Wikipedia 1.3K->24.3K/day and rising. Run the entity-gap audit.",
		"estimatedTraffic": "medium",
		"searchVolume": "medium",
		"personaTitle": null,
		"addedToQueue": "2026-10-26",
		"retryCount": 0,
		"strategicValue": "dc-cluster"
	},
	{
		"name": "geoffrey-hinton",
		"displayName": "Geoffrey Hinton",
		"type": null,
		"priority": 82,
		"priorityReason": "Portrayed by Mark Rylance in Artificial (Dec 25); AI-risk testimony Sep 17; deep record. Frontier-builder niche.",
		"estimatedTraffic": "medium",
		"searchVolume": "medium",
		"personaTitle": null,
		"addedToQueue": "2026-10-26",
		"retryCount": 0,
		"strategicValue": "ai-founders-cluster"
	},
	{
		"name": "jay-z",
		"displayName": "Jay-Z",
		"type": null,
		"priority": 80,
		"priorityReason": "Reported Super Bowl LXI halftime headliner (Puck, Oct 20; unconfirmed) Feb 14; evergreen gap; Decoded memoir.",
		"estimatedTraffic": "high",
		"searchVolume": "high",
		"personaTitle": null,
		"addedToQueue": "2026-10-26",
		"retryCount": 0,
		"strategicValue": "music-legends"
	},
	{
		"name": "chris-olah",
		"displayName": "Chris Olah",
		"type": null,
		"priority": 79,
		"priorityReason": "Named Anthropic co-founder with founder stock in Oct 26 S-1; IPO reported Nov 19-20; deep first-person record.",
		"estimatedTraffic": "low",
		"searchVolume": "low",
		"personaTitle": null,
		"addedToQueue": "2026-10-26",
		"retryCount": 0,
		"strategicValue": "ai-founders-cluster"
	},
	{
		"name": "ludwig-ahgren",
		"displayName": "Ludwig Ahgren",
		"type": null,
		"priority": 78,
		"priorityReason": "Married QTCinderella (Oct); Streamer Awards Nov 12; streamer niche converts well on 9takes.",
		"estimatedTraffic": "medium",
		"searchVolume": "medium",
		"personaTitle": null,
		"addedToQueue": "2026-10-26",
		"retryCount": 0,
		"strategicValue": "streamer-cluster"
	},
	{
		"name": "qtcinderella",
		"displayName": "QTCinderella",
		"type": null,
		"priority": 77,
		"priorityReason": "Hosts Streamer Awards Nov 12; married Ludwig (Oct). Pair page.",
		"estimatedTraffic": "medium",
		"searchVolume": "medium",
		"personaTitle": null,
		"addedToQueue": "2026-10-26",
		"retryCount": 0,
		"strategicValue": "streamer-cluster"
	},
	{
		"name": "josie-totah",
		"displayName": "Josie Totah",
		"type": null,
		"priority": 76,
		"priorityReason": "Carrie (Prime) #1 Oct; Wikipedia 793->18.3K/day; deep record. S2 renewal pending.",
		"estimatedTraffic": "medium",
		"searchVolume": "medium",
		"personaTitle": null,
		"addedToQueue": "2026-10-26",
		"retryCount": 0,
		"strategicValue": "streaming-leads"
	},
	{
		"name": "larry-ellison",
		"displayName": "Larry Ellison",
		"type": null,
		"priority": 75,
		"priorityReason": "Paramount-WBD now Skydance (Oct 19), Oracle debt coverage, Musk investment (reported); evergreen top-5-richest gap.",
		"estimatedTraffic": "medium",
		"searchVolume": "high",
		"personaTitle": null,
		"addedToQueue": "2026-10-26",
		"retryCount": 0,
		"strategicValue": "big-tech-founders"
	}
]
```

**As appended (2026-10-26):** Daniela Amodei was left out (see Decisions taken), and the other 13 were re-prioritized 90→78 in deadline order: Grace 90, Ippolito 89, Schafer 88, Bettany 87, Fike 86, Rhys Harries 85, Hinton 84, Olah 83, Jay-Z 82, Ludwig 81, QTCinderella 80, Totah 79, Ellison 78.

## Decisions for DJ

1. **Fix #0 (path hash + publisher Node)? Recommended: yes.** Effect: Paapa Essiedu, Stella Lefty, Ella Beatty and Ben Shelton start auto-publishing at 6 AM (one per run), all already `reviewed: true` by you. The hash fix should accept both the with-`path` and without-`path` form, so releases that were frozen after a `path` line existed stay valid. (Four live pages have `path` in their release hash.)
2. **Run the three time-boxed finishes now** (Fielder `--refresh`, Zada `--refresh`, Pugh quote repair)? They share the pipeline lock with the nightly run.
3. **Which CREATE picks to queue?** Recommended: the 14 above, in that order.
4. **Updates:** Dario (S-1), Sam Altman + Murati + Musk (_Artificial_), Ella Langley (before Nov 16), Druski (before Nov 7).

## Decisions taken (2026-10-26, DJ: "fix all the issues… add people to the backlog queue")

- **Fix #0a (release hash):** `path` is now bookkeeping in `editorialHash()`. A new `matchesEditorialHash()` also accepts hashes frozen the old way, and is used for the release manifest, the verification record and frozen reviews (`scripts/lib/blogEditorial.js`, `scripts/run-blog-pipeline.mjs`), with 3 regression tests in `blogEditorial.spec.mjs`.
  - Result: Paapa Essiedu, Stella Lefty and Ella Beatty have **zero** publish blockers. Dhar Mann needs only a portrait.
  - Ben Shelton now stops at a later, separate check (`changed_artifact:research`: his run-dir evidence changed after release).
  - Garfield, Inde Navarrette, Dakota Johnson and Josh Hartnett stay valid.
  - Sutskever and sombr show stale only because of uncommitted body edits from a parallel session; their HEAD versions validate.
- **Fix #0b (publisher Node):** `scripts/daily-blog-publisher.sh` now picks the first node that runs (node@24 first) instead of trusting the gateway's PATH.
  - Root cause: the OpenClaw publisher job runs its argv directly, while the nightly job runs via `sh -lc`, which is why the nightly still worked.
  - Verified by reproducing the dyld crash with the gateway's PATH and confirming the resolver picks v24.22.1.
  - Not run live now: a publish triggers repo-wide `pnpm gen:all` while another session is editing drafts. First live run: 6 AM Oct 27.
- **Queue:** 13 CREATE entries appended (priorities 90→78, deadline order), `lastUpdated` bumped, nothing else touched. Dry run: tonight selects `mckenna-grace`.
  - The weekly cap is 5, so the Nov-deadline names (Grace, Ippolito, Schafer, Bettany, Fike) take this week's slots.
  - **Daniela Amodei was not re-queued.** She sits in `held` with a manual research list (paywalled _The Information_ profile, six long interviews, a Two/Six/One discriminator) that a fresh nightly create can't see. Do it as a manual run.
  - Tom Rhys Harries was re-queued from `failed`: the Sep 16 failure was "no draft after pipeline run" (infrastructure).
- **Flag drift:** `greg-brockman.md` `published: true` → `false` (DB unpublished; created that way Oct 7). `Jynxzi.md` `published: false` → `true` (DB live). `published` is bookkeeping, so no release hash changes.

## Method / caveats

- **Coverage.** 564 local drafts, 603 DB rows (457 published) and the backlog queue (3 items + 1 in progress) were loaded 2026-10-26. Draft frontmatter was parsed with gray-matter. Release validity was checked with `scripts/lib/blogEditorial.js#editorialHash` against each `release.json`, and publish gates with `scripts/personBlogParser.js#readPublishCandidate` (read-only). Run states come from each subject's latest `pipeline-logs/*/summary.json`.
- **Path bug proof.** For all 5 ready drafts, `editorialHash(current) !== manifest` while `editorialHash(current minus the path line) === manifest`. Across all v3 drafts: 5 unpublished + 2 published are path-stale; 4 published are valid as-is with `path` included.
- **Publisher crash.**
  - `logs/blog-automation/publish-people-2026-10-2{3,4,5,6}.log` show the dyld crash.
  - Through Oct 22, the logs show normal "No publishable draft" failures; Oct 22's closest candidate was `ben-shelton: editorial_v3:stale_or_invalid_release`.
  - Gateway PID 812 started Oct 7. `/opt/homebrew/opt/node` was relinked to 26.12.1 on Oct 22 12:27. Only `libada.4` exists under `/opt/homebrew/opt/ada-url/lib`.
- **Google Trends "Trending now" (US).** Read via Chrome, past 7 days (first 125 of 3,404 trends) and past 24 hours (first 50 of 591). The week is sports-dominated. Person-name trends:
  - Ethan Klein 500K+
  - Tom Skerritt 500K+
  - Eric Bauza 200K+
  - Nicki Minaj 100K+
  - Emily Osment 100K+
  - Candice Swanepoel 100K+
  - John Krasinski, Paul Bettany, Bill Maher, Keyshia Cole, Chris Brown (10K+ to 20K+)
  - Related cluster: `anthropic ipo` 50K+ (24h)
- **Wikipedia pageviews.** Wikimedia REST, `user` agent, daily, via `scratchpad/wpv.mjs`. Labeled PLATFORM GROWTH. The API rate-limited (429) during parallel use, so some values came from the subagents' batched queries.
- **GSC first-party.** `docs/data/gsc/2026-10-19-page-trends.csv` (Oct is partial: Oct 1–19).
- **Subagent sweeps.** Three subagents, each capped at 22 WebSearches:
  - Film/TV: release grids, Netflix Top 10, Box Office Mojo, Wikimedia top-viewed for Oct 18/21/24/25.
  - Music/creators: Hot 100/Billboard 200 via Wikipedia lists, prediction markets, Streamer Awards nominees.
  - Tech/news: SEC EDGAR, Reuters, Fortune, Google News RSS.
- **Verified by me directly:**
  - Anthropic S-1: `data.sec.gov/submissions/CIK0002130357.json` shows `S-1, 2026-10-26`, and the filing text says "applied to list … Nasdaq Global Select Market under the symbol 'ANT'".
  - _You Can See Everything_ directors (Fielder + Oppenheim) and Billy Evans' role, from the Wikipedia summary API.
  - Paul Bettany's _VisionQuest_ timing (search).
  - Ethan Klein's hiatus (Wikipedia via search).
- **Reported / unverified:**
  - IPO date Nov 19–20 (Fox Business via Investing.com)
  - Jay-Z halftime (Puck)
  - Paul Bettany in _Doomsday_
  - Oscar nominations ~Jan 21
  - Carrie S2 renewal
  - _Clayface_ PVOD date
  - Helen Toner / Tasha McCauley / Adam D'Angelo roles in _Artificial_ (Wikipedia-only)
  - Ages marked from memory by the film agent: Josie Totah, Linda Cardellini, Paul Bettany, Hunter Schafer
- **Score arithmetic (D/C/N/R/S/I/T − penalties):**
  - Nathan Fielder: 25/18/11/12/10/9/3 = 88
  - Florence Pugh: 22/20/10/15/10/8/5 = 90
  - Daniela Amodei: 15/20/15/15/6/7/5 = 83
  - Dario Amodei: 18/20/15/15/10/7/5 = 90
  - Joseph Zada: 15/20/12/14/6/9/3 = 79
  - Paapa Essiedu: 8/20/12/15/7/8/5 = 75
  - Hunter Schafer: 20/15/10/10/10/9/5 = 79
  - Mckenna Grace: 12/18/12/12/9/9/5 = 77
  - Dominic Fike: 14/14/13/12/9/9/4 = 75
  - Jay-Z: 8/20/9/14/10/9/5 = 75
  - Paul Bettany: 20/16/8/10/10/7/3 = 74
  - Geoffrey Hinton: 10/15/15/13/10/6/5 = 74
  - Anthony Ippolito: 14/14/11/13/6/10/5 = 73
  - Tom Rhys Harries: 22/14/11/7/6/9/3 = 72
  - Sienna Spiro: 10/15/12/14/5/9/5 = 70
  - Greg Brockman: 6/16/15/12/9/6/5 = 69
  - Chris Olah: 8/14/15/12/9/5/5 = 68
  - Josie Totah: 20/10/12/5/9/9/2 = 67
  - Larry Ellison: 12/14/10/10/10/8/3 = 67
  - Christopher Abbott: 15/14/9/10/8/8/3 = 67
  - Stella Lefty: 12/12/12/10/6/9/4 = 65
  - Ludwig Ahgren: 10/10/14/8/10/9/4 = 65
  - Linda Cardellini: 18/12/8/9/9/6/3 = 65
  - Billy Evans: 25/16/7/8/5/10/4 − 10 = 65
  - QTCinderella: 10/10/14/8/9/9/4 = 64
  - Summer H. Howell: 20/12/12/5/3/10/2 − 15 = 49
  - Ethan Klein: 14/8/11/3/10/9/2 − 10 = 47
- **Niche prior N.** Taken from the May deep dive, adjusted by the Sep GSC calibration on 122 pages published May–Sep (see Lay of the land).
