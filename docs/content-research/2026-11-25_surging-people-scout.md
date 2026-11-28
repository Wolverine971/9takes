<!-- docs/content-research/2026-11-25_surging-people-scout.md -->

# Surging People Scout: 2026-11-25

## TL;DR: top moves this week

**The nightly queue is empty.** Kate Middleton was the last entry, so tonight's run has nothing to create. Meanwhile **9 passed pages are waiting only on a portrait** and 27 more are held. The publisher itself is healthy (Nov 24 and 25 logs: it runs, finds 0 releasable drafts, exits).

The three biggest waves this week all land on pages 9takes already has, and none of those pages mention the news.

1. **Robert Pattinson — UPDATE.** Amazon MGM named him the next James Bond on Nov 16 (Villeneuve directing). Wikipedia went from ~12K/day to **1.36M on Nov 16** and is still at 137K/day. _Dune: Part Three_ opens Dec 18. The live page (last touched Feb 10, grade 9.0) has no Bond line. It already earns 2,238 impressions at position 8.4, so this is the highest-ROI move on the board.
2. **Jensen Huang — UPDATE (currency + restraint).** He resigned as Nvidia CEO on Nov 11–12 and the board reinstated him on Nov 22 (both in 8-Ks). 1.07M Wikipedia views on Nov 12, 109K/day now. The live page (Jul 28) says none of it. The affair and espionage reporting is allegation-driven: state the two filings as fact, attribute everything else, and don't use any of it as type evidence.
3. **Florence Pugh — FINISH — 86.** _Doomsday_ and _Dune: Part Three_ both open Dec 18. The hand-repaired draft (~8.5 on the editor re-score) still needs your owner override or a `--refresh --expanded-review`. The target was live by Dec 1.
4. **Mckenna Grace (83) and Joseph Zada (80) — FINISH.** _Sunrise on the Reaping_ opened at $119.3M on Nov 20. Zada is at 67K/day (896 in June), Grace at 61K/day. Both were held for thin evidence before the press tour; the tour has now happened. Run `--refresh` on each.
5. **Daniela Amodei — FINISH — 80.** Anthropic priced at $83 on Nov 18 and listed Nov 19. She hit 92K views that day. This is your manual run; it also unblocks the Dario/Daniela founder-duos post.
6. **New CREATE tranche, led by deadline:** Caroline Ellison (Netflix's _The Altruists_, 40K/day from 1.4K), Johnny Flynn (three stacked catalysts through Dec 25), Andrew Scott (Best Actor frontrunner), Denis Villeneuve, Whitney Peak, Dan Houser, Jack Clark, RAYE. Full table below.

**Single highest-ROI pick: the Pattinson refresh.** It is a covered page with index age, the demand step is permanent (he is Bond until at least 2028), and the next spike is 23 days out.

**Capacity note.** The weekly create cap is 5. Finishing is still the constraint: of the 13 names queued on Oct 26, 4 are live, 3 are passed and waiting on a portrait, 1 needs a re-verify and 5 are held.

## FINISH / PUBLISH (existing drafts, ranked by opportunity × readiness)

State comes from `pnpm people:ready`, each draft's frontmatter and the queue's `held` entries, all read 2026-11-25. Wikipedia figures are daily views: June average → last 7 days.

### Passed, waiting only on your portrait (9)

| Person            | Score | Grade | Current catalyst                                                          | Demand            | Note                                                                     |
| ----------------- | ----: | ----: | ------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------ |
| Amanda Seyfried   |    71 |   8.3 | Plays a prominent role in the Fielder/Holmes doc; Oscar shortlists Dec 15 | 5.4K → **23.9K**  | Reviewed and ready. Highest live demand of the nine. Read it first.      |
| Chris Olah        |    70 |   8.6 | Anthropic listed Nov 19; named co-founder in the wealth coverage          | 1.1K → 4.1K       | Best-converting niche. One `http://` citation is dropped with a warning. |
| Dominic Fike      |    63 |   8.5 | "Babydoll" back up to #13; Europe tour Feb 2027                           | 4.1K → 4.2K       | Strong niche (alternative-artist).                                       |
| Kate Middleton    |    60 |   8.3 | Evergreen royal news flow                                                 | 4.2K → 5.8K       | Finished tonight. Read it first.                                         |
| Aspyn Ovard       |    55 |   8.2 | _Mormon Wives: Orange County_ premiered Nov 12                            | 0.4K (Oct) → 2.4K | Fading from a 17.9K peak on Nov 14. Every week costs part of the wave.   |
| Tom Rhys Harries  |    50 |   8.5 | _Clayface_ (Oct 23); no next date found                                   | 1.3K → 2.0K       | Past peak (13K/day in October). Free page.                               |
| Steve Wozniak     |     — |   8.2 | Evergreen (reader request)                                                | 2.0K → 1.7K       | Read it first.                                                           |
| Drew Afualo       |     — |   8.3 | Evergreen                                                                 | 0.3K → 0.2K       | Read it first.                                                           |
| Quenlin Blackwell |     — |   8.1 | Evergreen                                                                 | 0.3K → 0.5K       | Read it first.                                                           |

Smallest next action for all nine: `./scripts/prepare-personality-image.sh <portrait.png> <type> <slug> && node scripts/personBlogParser.js <slug> --publish`. Portrait order by demand: Seyfried, Olah, Kate Middleton, Fike, Ovard.

### Held or unfinished, with a live catalyst

| Person                 |  Score | Grade | Production state                                                                     | Current catalyst                                                                          | Smallest next action                                                                                         |
| ---------------------- | -----: | ----: | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Florence Pugh**      | **86** |   8.4 | Hand-repaired Oct 26 (~8.5 on re-score); gate blocks on the stale 8.4 and no release | **Dec 18 ×2**; 5.3K → 22.5K/day                                                           | Your call: owner override on the repaired draft, or `--refresh --expanded-review` (may re-hedge the answer). |
| **Mckenna Grace** (20) | **83** |     — | Research held Oct 27 (6 vs 3); no draft yet                                          | _Sunrise_ (Maysilee) opened Nov 20; 8.5K → **60.6K/day**                                  | `--refresh` now: the hold was written to be rerun after the press tour. Adult-era sources only.              |
| **Joseph Zada**        | **80** |   7.9 | `insufficient_evidence`, 6 open items                                                | _Sunrise_ lead (Haymitch); 0.9K → **67.2K/day**, peak 98.9K Nov 22                        | `--refresh`. The press tour is the long-form record the September run lacked.                                |
| **Daniela Amodei**     | **80** |   8.0 | Oct 28 research says Type 1, medium; draft 8.0, 5 open items                         | Listed Nov 19; 6.0K → 31.9K/day (92K peak); next: first public earnings (date unverified) | Your manual run. Unblocks the founder-duos post.                                                             |
| Bruno Mars             |     76 |   8.5 | April draft, never reviewed (pre-v3)                                                 | Record, Album and Song Grammy noms; **Feb 7**; 8.2K → 18.6K/day (60.6K on Nov 20)         | `--refresh` through v3. 10 weeks of runway.                                                                  |
| Jay-Z                  |     76 |   8.4 | `needs_revision`, 2 open items                                                       | **Super Bowl LXI halftime confirmed Oct 26**; game Feb 14; 5.7K → 3.8K/day                | `--reverify` (~40 min). Saturated SERP, so don't expect Wikipedia-scale capture.                             |
| Olivia Wilde           |     73 |   8.8 | June draft, never reviewed (pre-v3)                                                  | _The Invite_: on all four AwardsWatch Best Actress ballots; Globe noms **Dec 7**          | `--refresh` this week so it is live before Dec 7.                                                            |
| Anthony Ippolito       |     68 |   8.3 | Eligible, but edited since it passed                                                 | _I Play Rocky_ wide Nov 20 (#2, $9.3M); 0.2K → 16.6K/day                                  | `--reverify`, then portrait. ENTITY GAP AUDIT still worth running.                                           |
| Sienna Spiro           |     64 |   8.3 | Needs `--refresh --expanded-review` (type-thesis change)                             | **Best New Artist nominee**; Feb 7                                                        | Expanded-review rerun; no rush before January.                                                               |
| Greg Brockman          |     63 |   8.3 | `needs_revision`, 2 open items                                                       | _Artificial_ limited Dec 25, wide Jan 8; 0.8K → 2.7K/day                                  | `--reverify`.                                                                                                |
| Olivia Dean            |     62 |   8.2 | `insufficient_evidence`, 3 open items                                                | Record, Album, Song and Pop Vocal Album noms; Feb 7                                       | `--refresh` in December.                                                                                     |
| Lily-Rose Depp         |     62 |   8.2 | `needs_revision`, 2 open items                                                       | _Werwulf_ (Eggers) wide Dec 25                                                            | `--reverify` by ~Dec 10.                                                                                     |
| Glen Powell            |     62 |   8.5 | April draft, never reviewed (pre-v3)                                                 | _The Comeback King_ wide Feb 5; 5.9K → 8.6K/day                                           | `--refresh` in early January.                                                                                |
| Ashton Kutcher         |     60 |   9.0 | May draft, never reviewed (pre-v3)                                                   | **Spike not identified:** 4.9K → 19.6K/day, peak 35.9K Nov 20                             | Find the cause first (one search), then decide.                                                              |
| Stable Ronaldo         |     50 |   8.4 | August pre-v3 draft                                                                  | Won Best Reality Streamer and Best Marathon Stream, Nov 12; 0.5K/day                      | Optional. Streamers convert about 3× movie stars per view.                                                   |
| QTCinderella           |     50 |   8.4 | `needs_revision`, 3 open items                                                       | Streamer Awards are past; 0.9K/day                                                        | `--reverify` when a slot is free.                                                                            |

Parked, no live catalyst: Josie Totah, Larry Ellison, Christopher Abbott, Mike Faist, Austin Abrams, Maleah Joi Moon and the rest of the held list.

## CREATE (new blogs, ranked by search-demand × niche strength)

None of these has a draft, a DB row or a queue entry. Wikipedia figures are daily views: 30-day baseline ending late October → last 7 days (PLATFORM GROWTH). Ages marked ~ are approximate.

| Person                  | Score | Niche                      | Horizon    | Catalyst / spike ladder                                                                                                                              | Demand signal type                                                                            | Enneagram angle (hypothesis only)                                                                                                                | Confidence  |
| ----------------------- | ----: | -------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| Johnny Flynn (43)       |    84 | movieStar / musician       | NOW + NEXT | _MobLand_ S2 finale Nov 20 → _Elsinore_ wide **Dec 4** → HBO _Harry Potter_ (Lucius Malfoy) **Dec 25**, 8 weekly episodes                            | PLATFORM GROWTH (1.0K Jun → 8.9K Oct → **33.3K**) + CALENDAR ×2                               | Unassigned. Deep record across two careers (actor, folk musician).                                                                               | High        |
| Andrew Scott (50)       |    78 | movieStar                  | NEXT       | _Elsinore_ wide **Dec 4** → Gotham Nov 30 → Globe noms **Dec 7** → Globes Jan 10 → Oscar noms Jan 21 → Oscars Mar 14. AwardsWatch calls him "locked" | PLATFORM GROWTH (5.2K → 16.1K) + CALENDAR + NEWS                                              | Unassigned. Very deep interview record.                                                                                                          | High        |
| Denis Villeneuve (59)   |    75 | director                   | NEXT       | Named Bond 26 director Nov 16 → _Dune: Part Three_ **Dec 18** → DGA noms Jan 7 → Oscar noms Jan 21                                                   | PLATFORM GROWTH (2.7K → 10.2K; 65K Nov 16) + CALENDAR                                         | Unassigned. Deep record. Pairs with the Pattinson, Zendaya and Nolan pages.                                                                      | Medium-high |
| RAYE (29)               |    74 | pop-star                   | NEXT       | **Leads the Grammys with 11 nominations** (Nov 16) → ceremony **Feb 7**                                                                              | NEWS + CALENDAR; PLATFORM flat (8.6K/day, 45K peak Oct 23)                                    | Unassigned. Deep record on leaving her label and going independent.                                                                              | Medium      |
| Whitney Peak (23)       |    73 | rising-star / newMovieStar | NOW        | _Sunrise on the Reaping_ (Lenore Dove, second-billed) Nov 20, plus the soundtrack                                                                    | PLATFORM GROWTH (0.5K Jun → **15.6K**)                                                        | Unassigned. Thin-to-medium record: expect the same evidence hold Zada and Grace hit unless the press tour produced long-form sit-downs.          | Medium      |
| Rosalía (34)            |    71 | pop-star                   | NEXT       | 9 Grammy noms incl. Record and Album (_LUX_) → Feb 7                                                                                                 | NEWS + CALENDAR; PLATFORM flat (8.0K/day)                                                     | Unassigned. Deep record, much of it in Spanish.                                                                                                  | Medium      |
| Jack Clark              |    71 | **frontier-builder**       | NOW + NEXT | Anthropic listed Nov 19 (one of seven co-founders) → first public earnings (date unverified)                                                         | PLATFORM GROWTH (26/day → 3.1K; 10K Nov 20) + NEWS                                            | Unassigned. Years of weekly first-person writing (Import AI). Completes the Anthropic cluster.                                                   | Medium      |
| Dan Houser (~52)        |    70 | game founder / writer      | NOW        | _GTA VI_ released **Nov 19** without him; he says he is avoiding it (Variety podcast); two Absurd Ventures games in development                      | PLATFORM GROWTH (1.6K → **25.2K**) + RELATED SEARCH CLUSTER (`gta 6 update` 50K+)             | Unassigned. Deep recent record after years of near-silence.                                                                                      | Medium      |
| Caroline Ellison (~32)  |    67 | business / other           | NOW        | Netflix _The Altruists_ **Nov 19** (Julia Garner plays her). Released from custody Jan 2026; joined Manifund Aug 2026                                | PLATFORM GROWTH (1.4K → **40.4K**, peak 61K Nov 22) + VERIFIED SEARCH (`the altruists` 100K+) | Unassigned. Use her testimony, sentencing statement and published writing. Her conviction is fact; leaked private diaries are not fair material. | Medium-high |
| Kieran Culkin (44)      |    67 | movieStar                  | NOW        | _Sunrise_ (Caesar Flickerman) Nov 20                                                                                                                 | PLATFORM GROWTH (3.7K → 20.4K)                                                                | Unassigned. Deep record. Evergreen gap.                                                                                                          | Medium      |
| Stephen Wilson Jr. (47) |    65 | country / alternative      | NOW        | **CMA New Artist of the Year**, Nov 18                                                                                                               | PLATFORM GROWTH (3.0K → 69K L7; 328K Nov 19; ~13K/day now)                                    | Unassigned. Medium-deep record. One catalyst, decaying.                                                                                          | Medium      |
| Slayyyter (30)          |    65 | **alternative-artist**     | NEXT       | First Grammy noms incl. **Best New Artist** (the Oct watchlist trigger) → album _wor$t man in america_ **Dec 4** → Feb 7                             | NEWS + CALENDAR ×2; PLATFORM flat (3.8K/day)                                                  | Unassigned. Medium record.                                                                                                                       | Medium      |
| Ben Wang (~26)          |    65 | newMovieStar               | NOW        | _Sunrise_ (Wyatt) Nov 20; led _Karate Kid: Legends_ in 2025                                                                                          | PLATFORM GROWTH (1.0K → 13.5K)                                                                | Unassigned. Medium record.                                                                                                                       | Medium      |

**Recommended queue order** (deadline-led, one per night, cap 5 per week): Caroline Ellison → Johnny Flynn → Andrew Scott → Denis Villeneuve → Whitney Peak → Dan Houser → Jack Clark → RAYE → Kieran Culkin → Rosalía. Stephen Wilson Jr., Slayyyter and Ben Wang are a second tranche.

Ellison goes first despite her score because a Netflix wave lasts two to four weeks and she is already at the peak. She also carries the one direct search signal in this table.

## UPDATE (already covered, re-surging or stale)

Search Console figures are impressions and average position for Aug 10 – Nov 8.

| Person                           | Last updated            | What re-surged                                                                                                                       | Why update beats new                                                                 | Suggested angle                                                                                                                                 |
| -------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Robert Pattinson**             | 2026-02-10 (9.0)        | **Named James Bond Nov 16**; 12K → 137K/day (1.36M peak). _Dune: Part Three_ Dec 18; Bond 26 shoots 2027                             | 2,238 impressions at position 8.4. No Bond mention on the page                       | The actor who spent 15 years running from a franchise takes the biggest one. Add Bond + update the Dune paragraph (it still reads as upcoming). |
| **Jensen Huang**                 | 2026-07-28 (8.5)        | Resigned Nov 11–12, reinstated Nov 22 (8-Ks); 7.7K → 109K/day                                                                        | The page is now factually stale on its central subject. Only 111 impressions, though | Currency pass: the two filings as fact, everything else attributed and marked alleged. Keep it out of the type argument.                        |
| **Ella Langley**                 | 2026-07-03 (8.9)        | CMA Entertainer of the Year (Nov 18), 7 Grammy noms incl. Best New Artist, "Choosin' Texas" #1 for a record 29th week; 14K → 49K/day | 3,050 impressions at position 8.4. Page still says "four CMA Awards"                 | Add the Nov 18 sweep and the Grammy field. The Oct 26 scout asked for this before Nov 16; it has not landed.                                    |
| **IShowSpeed**                   | 2026-04-03              | Streamer of the Year for a third straight year (Nov 12), Esports Awards (Nov 17), Game Awards nominee (**Dec 10**)                   | **12,761 impressions, 0.23% CTR**: the most-seen page here and the worst click rate  | Update "back-to-back" to three in a row, and test a new title and description.                                                                  |
| Sam Bankman-Fried                | 2026-05-07 (9.4)        | _The Altruists_ Nov 19; 3K → 50K/day                                                                                                 | 447 impressions at position 13.1                                                     | One section on the series and what it gets right or wrong against his own record. Link to Ellison when she is live.                             |
| Dario Amodei                     | 2026-11-17              | Priced Nov 18 ($83), listed Nov 19; 12K → 66K/day                                                                                    | 4,902 impressions at position 8.6. Already refreshed in IPO week                     | Two-line currency pass with the pricing and listing facts.                                                                                      |
| Sam Altman + Elon Musk           | 2026-03-01 / 2026-09-17 | _Artificial_: limited **Dec 25**, wide **Jan 8** (corrected from "wide Dec 25")                                                      | Altman has 1,054 impressions. Musk's page has no mention of the film                 | One line each plus cluster links (Garfield, Murati, Sutskever, Hinton, Brockman). By ~Dec 15.                                                   |
| Nathan Fielder                   | 2026-10-26 (7.9)        | Still 25K/day five weeks after release; Oscar shortlists **Dec 15**                                                                  | 902 impressions at position 7.7. Published under the bar                             | Quality raise toward 8.5 before Dec 15.                                                                                                         |
| Callum Turner                    | 2026-05-23              | Reported Bond contender; _Neuromancer_ (Apple) **Jan 22**                                                                            | 2,648 impressions, 1.47% CTR                                                         | Update by early January.                                                                                                                        |
| Zohran Mamdani                   | 2026-02-18              | TIME Person of the Year co-favorite (Kalshi 25%); announcement ~Dec 6–12 (inferred from prior years)                                 | 138 impressions; politician niche                                                    | Low priority. Refresh only if he is named.                                                                                                      |
| Phoebe Bridgers / Olivia Rodrigo | 2026-08-15 / 2026-02-20 | 7 Grammy noms each; Rodrigo's album four weeks at #1                                                                                 | Existing URLs                                                                        | January, ahead of Feb 7.                                                                                                                        |

## CROSS-REFERENCE / DISTRIBUTION (covered + healthy, ride the wave)

- **Hunter Schafer:** _Blade Runner 2099_ dropped all eight episodes today; 48K/day. Published Nov 17. One social asset this week.
- **James Talarico:** published Nov 18; leads the Polymarket Person of the Year market (24.9%). He had 1.26M views on Nov 4. Link him with Mamdani.
- **_Sunrise on the Reaping_ cluster:** Jennifer Lawrence (reprises Katniss; 2× last week) is live. Add cluster links when Zada and Grace publish.
- **Holmes doc cluster:** Holmes (70K/day), Fielder, and Seyfried once she has a portrait. Link all three; Oscar shortlists Dec 15.
- **_Dune: Part Three_ / _Doomsday_ (Dec 18):** Zendaya, Pattinson, Pedro Pascal. Link to Pugh when she publishes.
- **Grammys (Feb 7):** Ella Langley, Stella Lefty ("Boston" at #2), Adéla (#7), sombr, Bridgers, Rodrigo. One nominee-roundup asset.
- **Paapa Essiedu:** _Harry Potter_ Dec 25. Link to Flynn when he is live.
- **Inde Navarrette:** on three of four Best Actress ballots; 21K/day. Globe noms Dec 7.
- **Streamer Awards winners already live:** IShowSpeed, Kai Cenat, Jynxzi, CaseOh.

## SKIPPED (and why)

- **Alice Huang:** a private individual whose attention is entirely allegation-driven. Not a subject.
- **Colette Kress, Lisa Su, Chris Malachowsky:** collateral from the Nvidia story, already fading (Kress 141K → 20K/day).
- **Sam Houser:** same demand as his brother, but almost no first-person record. −15.
- **Russell Brand:** conviction-driven attention. No.
- **Deaths and health:** Andy Taylor (trending today), Tyson Fury's diagnosis. Guardrail.
- **One-offs:** Maxx Morando and the Cyrus family (wedding report), Ezra Frech (_Dancing with the Stars_ winner, 1M+ searches), the Bond halo (Suki Waterhouse, Daniel Craig, Pierce Brosnan, Kristen Stewart).
- **UK reality:** the _I'm a Celebrity_ cast (Mariella Frostrup, Leigh Francis, Ade Adepitan, AJ Odudu, Sharky).
- **Politicians and athletes:** Abdul El-Sayed (1.4M views on Nov 4), Jon Ossoff, Hakeem Jeffries, Mark Carney, plus the usual NFL names. First-party prior is near zero.
- **Jeff Bezos:** no spike. He sits at 50–60K/day for the whole 60-day window.
- **Minors:** the _Harry Potter_ trio (Dominic McLaughlin, Arabella Stanton, Alastair Stout) and Mason Reeves.
- **Unidentified:** Sara Boustany, Kristina Bogic, Geena Meszaros, Levent Alpöge. New Wikipedia articles with flat 25–50K/day and no news trail. That pattern usually means automated traffic.
- **Low demand:** Cameron Winter / Geese (2.3K/day, flat despite the Best New Artist nomination), JENNIE (name ambiguity), Karol G, Koe Wetzel, Vlad Tenev, Shayne Coplan, Sarah Friar.

## Lay of the land (intel notes)

- **The news came to our pages this time.** Bond, Nvidia and the Anthropic listing all hit people 9takes already covers. Three of the top six moves are refreshes, not new writing.
- **The October pattern repeated.** Zada, Grace and Daniela Amodei were all flagged on Oct 26, all held for evidence, and all three spiked on schedule without a live page. The forecast was right; the finish was not. When a hold says "rerun after the press tour," it needs a dated rerun in the queue, not a note.
- **Portraits are now the widest bottleneck.** Nine passed pages wait on them, including the two with the most live demand (Seyfried and Olah).
- **Awards season is a 15-week ladder.** Globe noms Dec 7, Oscar shortlists Dec 15, Globes Jan 10, Oscar noms Jan 21, Grammys Feb 7, Super Bowl Feb 14, Actor Awards Feb 28, Oscars Mar 14. Scott, Wilde, Navarrette, Villeneuve, RAYE, Rosalía, Langley, Bruno Mars and Jay-Z each ride several rungs.
- **Under-indexed.** Directors (only Nolan, Gerwig and Miyazaki are live) and the Anthropic bench (Clark; later Kaplan, Brown, McCandlish if records exist). Streamers stay the best converters, but this week's breakouts (Vanillamace, Katie B, E11ysa) have thin records and unverified ages.
- **Grammy nominations barely moved Wikipedia.** RAYE, Rosalía, Slayyyter and Geese are flat week over week. Treat their rows as calendar forecasts; the observed demand is not there yet.

## 30–120 day catalyst calendar

| Date/window    | Person                                                                             | Catalyst                                            | Current action                 | Recheck trigger          |
| -------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------ | ------------------------ |
| Nov 30         | Andrew Scott                                                                       | Gotham Awards                                       | CREATE                         | Win                      |
| Dec 4          | Andrew Scott, Johnny Flynn; Slayyyter; Pedro Pascal                                | _Elsinore_ wide; album; _Behemoth!_                 | CREATE ×3 / cross-link         | Opening weekend          |
| Dec 7          | Scott, Olivia Wilde, Inde Navarrette, Julia Garner, Anthony Ippolito               | Golden Globe nominations                            | CREATE / FINISH / distribution | Nominee list             |
| ~Dec 6–12      | Zohran Mamdani, James Talarico                                                     | TIME Person of the Year (date inferred)             | UPDATE if named                | Announcement             |
| Dec 10         | IShowSpeed                                                                         | Game Awards (Content Creator nominee)               | UPDATE                         | Result                   |
| Dec 15         | Nathan Fielder, Amanda Seyfried, Elizabeth Holmes, Billy Evans                     | Oscar shortlists (documentary)                      | UPDATE / FINISH / WATCH        | Shortlist                |
| Dec 18         | Pattinson, Villeneuve, Florence Pugh, Zendaya, Pascal                              | _Dune: Part Three_ + _Avengers: Doomsday_           | UPDATE / CREATE / FINISH       | —                        |
| Dec 25         | Paapa Essiedu, Johnny Flynn                                                        | HBO _Harry Potter_, 8 episodes                      | distribution / CREATE          | Weekly cadence           |
| Dec 25 → Jan 8 | Garfield, Altman, Brockman, Murati, Hinton, Musk                                   | _Artificial_ limited, then wide                     | UPDATE / FINISH                | Box office               |
| Dec 25         | Lily-Rose Depp; David Corenswet, Isabel May                                        | _Werwulf_; _Mr. Irrelevant_                         | FINISH / WATCH                 | —                        |
| Jan 10         | many                                                                               | Golden Globes                                       | —                              | Winners                  |
| Jan 21         | Scott, Wilde, Villeneuve                                                           | Oscar nominations                                   | —                              | Nominee list             |
| Jan 22         | Callum Turner                                                                      | _Neuromancer_ (Apple)                               | UPDATE                         | —                        |
| Feb 5          | Glen Powell                                                                        | _The Comeback King_                                 | FINISH                         | —                        |
| Feb 7          | RAYE, Rosalía, Langley, Bruno Mars, Olivia Dean, Sienna Spiro, Slayyyter, Bridgers | Grammys                                             | CREATE / UPDATE / FINISH       | Performer list (January) |
| Feb 14         | Jay-Z                                                                              | Super Bowl LXI halftime                             | FINISH                         | —                        |
| Feb–Mar        | Dario and Daniela Amodei, Olah, Clark                                              | Anthropic's first public earnings (date unverified) | UPDATE / FINISH / CREATE       | Date announced           |
| Mar 14         | many                                                                               | 99th Oscars                                         | —                              | —                        |

## WATCHLIST

- **Manni L. Perez / Dylan Rourke:** the reported _GTA VI_ leads. Perez went from 5 views/day to 51K, Rourke from 2 to 25K. Almost no first-person record (−15 → 52). Trigger: Rockstar confirms the cast and two long-form interviews exist. Recheck: Dec 9. **Route to `/find-emerging-entity-gaps`.**
- **Billy Evans:** still 28.6K/day five weeks on, and he has now answered the documentary publicly. Trigger: Oscar shortlist (Dec 15) or a streaming date. Recheck: Dec 16. Open Case format if made.
- **Michelle Randolph (29):** 4K → 26.9K on Nov 24 and climbing; cause not identified (_Landman_?). Recheck: Dec 2.
- **Leighton Meester / Jared Padalecki:** _Guarding Stars_ is Netflix's #1 film (27.6M views); 40K and 30K/day. One catalyst with a one-to-two-week life. Trigger: a third week in the Top 10 or a sequel order. Recheck: Dec 2.
- **Isabel May (26):** two wide releases (_Mr. Irrelevant_ Dec 25, _Karoshi_ Feb 5, first-billed). Trigger: press-tour sit-downs. Recheck: Dec 10.
- **Holden Karnofsky:** 1.2K → 9.3K/day in IPO week; deep written record. Make him only after the Daniela page is live. Recheck: when she publishes.
- **Vanillamace / Dean Withers:** Streamer Awards winners. Trigger: age confirmed 18+ and two long-form interviews. Recheck: Dec 11.
- **Julia Garner, Maya Hawke, Elle Fanning, Jesse Plemons, Sylvester Stallone:** evergreen gaps with a current bump (10–39K/day) and no second dated catalyst. Recheck after Globe noms, Dec 8.
- **Cameron Winter / Geese, Remi Wolf, Don Toliver:** Best New Artist nominees with flat demand. Trigger: a Grammy performance slot. Recheck: Jan 15.
- **Timnit Gebru:** memoir _Deep Unlearning_, Feb 16. Recheck: Jan 15.
- **Carried from Oct 26, not rechecked this run:** Summer H. Howell, Curry Barker / Kane Parsons (Dec 8), Helen Toner (Dec 1), Tyler Shultz.

## Queue-ready entries (for backlog-queue.json)

The queue is empty, so there is no current maximum. Priorities continue the Oct 26 scale (95 → 78) in deadline order. **Append only after DJ picks.**

```json
[
	{
		"name": "caroline-ellison",
		"displayName": "Caroline Ellison",
		"type": null,
		"priority": 92,
		"priorityReason": "Netflix The Altruists (Nov 19; Julia Garner plays her). Wikipedia 1.4K -> 40.4K/day, peak 61K Nov 22; 'the altruists' 100K+ on Trends. Pairs with the live SBF page. Use testimony, sentencing statement and published writing only; no leaked diaries.",
		"estimatedTraffic": "high",
		"searchVolume": "high",
		"personaTitle": null,
		"addedToQueue": "2026-11-25",
		"retryCount": 0,
		"strategicValue": "ftx-altruists-cluster"
	},
	{
		"name": "johnny-flynn",
		"displayName": "Johnny Flynn",
		"type": null,
		"priority": 91,
		"priorityReason": "Three stacked catalysts: MobLand S2 finale Nov 20, Elsinore wide Dec 4, HBO Harry Potter (Lucius Malfoy) Dec 25. Wikipedia 1.0K Jun -> 33.3K/day L7.",
		"estimatedTraffic": "high",
		"searchVolume": "high",
		"personaTitle": null,
		"addedToQueue": "2026-11-25",
		"retryCount": 0,
		"strategicValue": "harry-potter-hbo-cluster"
	},
	{
		"name": "andrew-scott",
		"displayName": "Andrew Scott",
		"type": null,
		"priority": 90,
		"priorityReason": "Best Actor frontrunner for Elsinore (wide Dec 4); Globe noms Dec 7, Oscar noms Jan 21, Oscars Mar 14. Wikipedia 5.2K -> 16.1K/day. Very deep interview record.",
		"estimatedTraffic": "high",
		"searchVolume": "high",
		"personaTitle": null,
		"addedToQueue": "2026-11-25",
		"retryCount": 0,
		"strategicValue": "awards-season-breakouts"
	},
	{
		"name": "denis-villeneuve",
		"displayName": "Denis Villeneuve",
		"type": null,
		"priority": 88,
		"priorityReason": "Dune: Part Three Dec 18; named Bond 26 director Nov 16 (65K views that day). Wikipedia 2.7K -> 10.2K/day. Pairs with Pattinson, Zendaya, Nolan.",
		"estimatedTraffic": "high",
		"searchVolume": "medium",
		"personaTitle": null,
		"addedToQueue": "2026-11-25",
		"retryCount": 0,
		"strategicValue": "director-auteur-cluster"
	},
	{
		"name": "whitney-peak",
		"displayName": "Whitney Peak",
		"type": null,
		"priority": 86,
		"priorityReason": "Sunrise on the Reaping (Lenore Dove, second-billed) opened $119.3M Nov 20. Wikipedia 0.5K Jun -> 15.6K/day. Record is thin-to-medium: look for long-form press-tour sit-downs before drafting.",
		"estimatedTraffic": "high",
		"searchVolume": "medium",
		"personaTitle": null,
		"addedToQueue": "2026-11-25",
		"retryCount": 0,
		"strategicValue": "hunger-games-cluster"
	},
	{
		"name": "dan-houser",
		"displayName": "Dan Houser",
		"type": null,
		"priority": 85,
		"priorityReason": "GTA VI released Nov 19 without him; he says he is avoiding it. Wikipedia 1.6K -> 25.2K/day. Deep recent record (Variety podcast, long-form interviews) after years of silence.",
		"estimatedTraffic": "high",
		"searchVolume": "medium",
		"personaTitle": null,
		"addedToQueue": "2026-11-25",
		"retryCount": 0,
		"strategicValue": "creator-economy-cluster"
	},
	{
		"name": "jack-clark",
		"displayName": "Jack Clark",
		"type": null,
		"priority": 84,
		"priorityReason": "Anthropic co-founder; company listed Nov 19. Wikipedia 26/day -> 3.1K (10K peak Nov 20). Years of weekly first-person writing (Import AI). Completes the Anthropic cluster.",
		"estimatedTraffic": "medium",
		"searchVolume": "medium",
		"personaTitle": null,
		"addedToQueue": "2026-11-25",
		"retryCount": 0,
		"strategicValue": "ai-founders-cluster"
	},
	{
		"name": "raye",
		"displayName": "RAYE",
		"type": null,
		"priority": 82,
		"priorityReason": "Leads the 2027 Grammys with 11 nominations (Nov 16); ceremony Feb 7. Demand is a forecast: Wikipedia is flat at 8.6K/day. Deep record.",
		"estimatedTraffic": "high",
		"searchVolume": "medium",
		"personaTitle": null,
		"addedToQueue": "2026-11-25",
		"retryCount": 0,
		"strategicValue": "contemporary-pop-cluster"
	},
	{
		"name": "kieran-culkin",
		"displayName": "Kieran Culkin",
		"type": null,
		"priority": 80,
		"priorityReason": "Sunrise on the Reaping (Caesar Flickerman) Nov 20. Wikipedia 3.7K -> 20.4K/day. Deep record; evergreen gap.",
		"estimatedTraffic": "medium",
		"searchVolume": "high",
		"personaTitle": null,
		"addedToQueue": "2026-11-25",
		"retryCount": 0,
		"strategicValue": "hunger-games-cluster"
	},
	{
		"name": "rosalia",
		"displayName": "Rosalía",
		"type": null,
		"priority": 79,
		"priorityReason": "9 Grammy noms incl. Record and Album (LUX); ceremony Feb 7. Demand is a forecast: Wikipedia flat at 8.0K/day. Deep record, much of it in Spanish.",
		"estimatedTraffic": "medium",
		"searchVolume": "medium",
		"personaTitle": null,
		"addedToQueue": "2026-11-25",
		"retryCount": 0,
		"strategicValue": "contemporary-pop-cluster"
	},
	{
		"name": "stephen-wilson-jr",
		"displayName": "Stephen Wilson Jr.",
		"type": null,
		"priority": 78,
		"priorityReason": "CMA New Artist of the Year Nov 18. Wikipedia 3.0K -> 328K on Nov 19, about 13K/day now. One catalyst, decaying.",
		"estimatedTraffic": "medium",
		"searchVolume": "medium",
		"personaTitle": null,
		"addedToQueue": "2026-11-25",
		"retryCount": 0,
		"strategicValue": "alternative-artist-cluster"
	},
	{
		"name": "slayyyter",
		"displayName": "Slayyyter",
		"type": null,
		"priority": 77,
		"priorityReason": "First Grammy noms incl. Best New Artist (Nov 16); album wor$t man in america Dec 4; ceremony Feb 7. Wikipedia flat at 3.8K/day. Strong niche.",
		"estimatedTraffic": "medium",
		"searchVolume": "medium",
		"personaTitle": null,
		"addedToQueue": "2026-11-25",
		"retryCount": 0,
		"strategicValue": "grammy-bna-2027-cluster"
	},
	{
		"name": "ben-wang",
		"displayName": "Ben Wang",
		"type": null,
		"priority": 75,
		"priorityReason": "Sunrise on the Reaping (Wyatt) Nov 20; led Karate Kid: Legends in 2025. Wikipedia 1.0K -> 13.5K/day.",
		"estimatedTraffic": "medium",
		"searchVolume": "medium",
		"personaTitle": null,
		"addedToQueue": "2026-11-25",
		"retryCount": 0,
		"strategicValue": "hunger-games-cluster"
	}
]
```

Not for the create queue: Mckenna Grace, Joseph Zada, Daniela Amodei, Florence Pugh and every other FINISH row. They are already in `held` or have drafts; they need a `--refresh` or `--reverify`, not a new entry.

## Decisions for DJ

1. **Which CREATE picks to queue?** Recommended: the first ten, in the order above. With nothing queued, tonight's run is idle.
2. **Portraits.** Nine pages wait on them. Suggested order: Seyfried, Olah, Kate Middleton, Fike, Ovard.
3. **Pugh.** Owner override on the repaired draft, or a full `--refresh --expanded-review`? Dec 18 is 23 days out.
4. **Refreshes.** Pattinson and Jensen Huang this week; Ella Langley and IShowSpeed next.
5. **Held reruns.** Grace and Zada `--refresh` now; Daniela is yours.

## Method / caveats

- **Coverage.** 586 local drafts, 627 DB rows (470 published) and the queue (0 queued, 18 held, 2 failed, 24 skipped) were loaded 2026-11-25 with the read-only `scripts/db-query.sh`. `git status` before writing showed your uncommitted queue edit (Kate Middleton moved from `failed` to `completed`); nothing in the queue or any draft was changed by this run.
- **Nowcast.** Wikimedia's top-1,000 list for each day Nov 11–25, filtered to articles in `Category:Living people` (1,145 people; 973 with no 9takes row) and matched to coverage by slug. Slug matching misses differently titled articles (Kate Middleton's is "Catherine, Princess of Wales").
- **Demand figures.** Two Wikipedia sources, both labeled PLATFORM GROWTH:
  - REST per-article daily views (June 1 – Nov 25, `user` agent) for the drafts and the first film/TV names.
  - The action API's 60-day `pageviews` (Sep 27 – Nov 24) for everything else, so those baselines are late September to late October, not June.
  - The REST endpoint rate-limited hard (429), which is why the June baseline is missing for most CREATE rows.
- **Google Trends "Trending now" (US).** Read through Chrome for the past 7 days (about 550 of 3,154 trends) plus the 24-hour RSS feed. The week is Thanksgiving and NFL. Direct person trends: Ezra Frech 1M+, Maxx Morando 1M+, Andy Taylor 200K+, Bruno Mars 50K+. Clusters: `nvidia stock` 1M+, `ant stock price` 200K+, `the altruists` 100K+, `avengers doomsday` 100K+, `blade runner 2099` 50K+, `gta 6 update` 50K+, `mobland season 3` 20K+. No name in the CREATE table appeared as its own trend title.
- **Search Console.** `docs/data/gsc/2026-11-10-pages.csv` (Aug 10 – Nov 8). It predates the Nov 13–14 core-update drop, so current impressions are lower than shown.
- **Subagent sweeps.** Three, each capped near 22 web calls (they ran 25–29): film/TV (Box Office Mojo, The Numbers, AwardsWatch, Netflix Tudum), music/creators (Fader, GMA, Official Charts, Complex, Hypebeast) and tech/news (SEC 8-Ks, Axios, Fortune, Reuters via secondary pages).
- **Verified by me directly.**
  - Pattinson as Bond, Huang's resignation and reinstatement, and Anthropic's November IPO, against current Wikipedia article text.
  - Caroline Ellison's January 2026 release and Manifund role, and Seyfried's part in the Holmes documentary, from the same source.
  - _MobLand_ S2 dates (Paramount press materials via search) and Flynn's casting as Lucius Malfoy.
  - Slayyyter's Dec 4 album (Fader).
  - Each UPDATE row's "page doesn't mention it" claim, by grep of the local draft.
- **Reported, not verified.**
  - Ages marked ~.
  - Anthropic's lockup terms and first earnings date.
  - TIME Person of the Year and Forbes 30 Under 30 dates (inferred from prior years).
  - The _GTA VI_ lead cast: pre-launch reporting called it rumoured, and I found no Rockstar confirmation.
  - _GTA VI_ day-one revenue (Sensor Tower estimate).
  - Whether the House briefing on Nvidia happened.
  - Huang's reported admission to employees (press reports only; the 8-Ks cover the resignation and reinstatement).
- **Not swept.** Major album and tour announcements for Dec–Mar, podcast and creator breakouts in the last 30 days, the March 2027 film grid, and new-founder breakouts beyond the Nvidia and Anthropic stories. The Oct 26 watchlist items were carried, not rechecked.
- **Score arithmetic** (demand 25 / reach 20 / niche 15 / runway 15 / depth 10 / intent 10 / timing 5; no penalties applied to any CREATE or FINISH row):

  | Person             | Dem | Reach | Niche | Runway | Depth | Intent | Timing | Total |
  | ------------------ | --: | ----: | ----: | -----: | ----: | -----: | -----: | ----: |
  | Florence Pugh      |  20 |    20 |    10 |     13 |    10 |      9 |      4 |    86 |
  | Johnny Flynn       |  23 |    17 |    10 |     14 |     8 |      8 |      4 |    84 |
  | Mckenna Grace      |  25 |    19 |    13 |      8 |     8 |      9 |      1 |    83 |
  | Joseph Zada        |  25 |    19 |    13 |      7 |     5 |     10 |      1 |    80 |
  | Daniela Amodei     |  21 |    19 |    15 |     10 |     6 |      8 |      1 |    80 |
  | Andrew Scott       |  16 |    14 |    10 |     15 |    10 |      8 |      5 |    78 |
  | Bruno Mars         |  15 |    17 |    12 |     13 |    10 |      5 |      4 |    76 |
  | Jay-Z              |  12 |    20 |     8 |     15 |    10 |      6 |      5 |    76 |
  | Denis Villeneuve   |  14 |    19 |     8 |     13 |    10 |      6 |      5 |    75 |
  | RAYE               |  12 |    15 |    12 |     13 |    10 |      7 |      5 |    74 |
  | Whitney Peak       |  21 |    18 |    13 |      6 |     5 |      9 |      1 |    73 |
  | Olivia Wilde       |  13 |    13 |    10 |     15 |    10 |      7 |      5 |    73 |
  | Rosalía            |  11 |    15 |    12 |     12 |     9 |      7 |      5 |    71 |
  | Jack Clark         |  14 |    16 |    15 |      9 |     9 |      6 |      2 |    71 |
  | Amanda Seyfried    |  20 |    13 |    10 |      9 |    10 |      7 |      2 |    71 |
  | Dan Houser         |  20 |    18 |     9 |      7 |     8 |      7 |      1 |    70 |
  | Chris Olah         |  13 |    16 |    15 |      9 |     9 |      6 |      2 |    70 |
  | Anthony Ippolito   |  22 |    11 |    12 |      7 |     4 |     10 |      2 |    68 |
  | Caroline Ellison   |  24 |    13 |     7 |      5 |     7 |     10 |      1 |    67 |
  | Kieran Culkin      |  17 |    16 |    10 |      6 |    10 |      7 |      1 |    67 |
  | Stephen Wilson Jr. |  20 |    11 |    11 |      6 |     8 |      8 |      1 |    65 |
  | Slayyyter          |   9 |     9 |    14 |     13 |     7 |      8 |      5 |    65 |
  | Ben Wang           |  18 |    15 |    12 |      5 |     6 |      8 |      1 |    65 |

  Penalties were applied only on the watchlist: Perez and Rourke (thin record, −15) and Billy Evans (name ambiguity, −10).
