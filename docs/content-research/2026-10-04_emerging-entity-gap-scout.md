<!-- docs/content-research/2026-10-04_emerging-entity-gap-scout.md -->

# Emerging Entity Gap Scout — 2026-10-04

> **Follow-up applied 2026-10-04 (DJ approved):**
>
> - **Jordi Hays snippet shipped.** `meta_title` is now `Jordi Hays: The TBPN Showman Who Takes the
Work Seriously` and the description is identity-first. Only those two fields were applied, via
>   `personBlogParser.js --apply --expected-content-hash=cbe2d4c17379878cc440e91e62dac73e
--approve-fields=meta_title,description --skip-perspective-gate`. The perspective gate was
>   skipped on purpose: the body is unchanged (same content hash), and the gate reviews body
>   content. `lastmod` stayed 2026-03-21. Verified live (title and description served, Vercel cache
>   HIT). Read the snippet check at ~2026-11-01 against `2026-10-04-entity-gap-check.json`.
> - **Queued for the nightly pipeline:** codie-sanchez (92), shyam-sankar (90), dylan-patel (88,
>   lifts the 09-01 hold), dan-ives (75). Each has a seed brief in
>   `docs/content-analysis/research/<slug>.md`, which the v3 research stage reads as
>   `research_notes`, and a packet in `docs/content-analysis/entity-gaps/`.
> - **Gate saved as `pnpm gate:entities`** (`scripts/entity-gap-gate.mjs`). Step 1.5 of the command
>   now uses it.

## Top actions

| Rank | Person         | Action                           | Score | Catalyst                                                                   | Why the SERP is winnable                                                                                                |
| ---: | -------------- | -------------------------------- | ----: | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
|    1 | Jordi Hays     | PROTECT — snippet repair         |     — | Sustained TBPN/OpenAI demand; exact-name CTR fell after the 08-15 rewrite  | Still no personal Wikipedia; 9takes sits at position ~6.5 on the bare name. The defect is our snippet, not the SERP     |
|    2 | Codie Sanchez  | CREATE                           |    85 | _Own or Be Owned_ launched 2026-09-18; first child due December            | Wikipedia 404. Page one is author/speaker pages, her own sites, and generated bio farms. One real dedicated profile     |
|    3 | Shyam Sankar   | CREATE                           |    81 | _Mobilize_ (NYT bestseller, 2026-03-17); Palantir CTO; Army Reserve Lt Col | Wikipedia 404, no draft. Top ten is think-tank/speaker/publisher bios, a Substack profile, and news clips               |
|    4 | Dylan Patel    | CREATE — on hold, window closing |    80 | SemiAnalysis ~$100M 2026 revenue; Yotta + AI Infra Summit keynotes in Sept | Still Wikipedia 404, **but** an AfC draft was declined 06-21 and Substrate Magazine published a dedicated profile 09-18 |
|    5 | Ashby Florence | CROSS-LINK                       |     — | Retrofit worked on CTR; rank stuck at ~10.5                                | Personal Wikipedia stub (2.9 KB) created 2026-06-07. Snippet is fixed; the page has one inbound blog link               |
|    6 | Dan Ives       | CREATE if capacity               |    70 | Left Wedbush 2026-07-01; AI closed-end fund filed (Bloomberg, 09-23)       | Wikipedia 404. Bloomberg/Wedbush/TipRanks profiles plus two campus features; family queries answered only by farms      |

**Single highest-ROI action:** the Jordi Hays snippet. It is a two-field change (`meta_title`,
`description`) on the page that has carried the entity-gap thesis since March. It goes against the
biggest pool of exact-name demand 9takes already ranks for, and the body rewrite that came with
it stays.

**Single highest-ROI new subject:** Codie Sanchez. She is a business creator with no personal
Wikipedia article, the same profile as Leila Hormozi, whose retrofit is the clearest win in this
measurement read. Her catalyst is two weeks old and a second one is due in December.

## The finding that should change the process

**The people-corpus title rule regressed the best entity-gap page.** The T-14 / 07-18 corpus pilot
rebuilt `jordi-hays` at Lane D. That rebuild was justified: the old page invented childhood,
marriage, Shanghai, and acquisition-price claims. The pilot's SEO audit also enforced the corpus
title pattern for the personality head term. The live `<title>` went from
`Why Jordi Hays Can't Stop Building (The Pattern Nobody Talks About)` to
`Jordi Hays Personality Type: Enneagram Type 3`, and the description went from identity-first to
typology-first. The live sync landed 2026-08-15 (`blogs_famous_people_history`, 30,139 chars).

That rule is right for most celebrity pages, whose traffic is `[name] personality type`. It is
wrong for entity-gap pages, whose traffic is the bare name. In the current 90-day export,
`jordi-hays` has **7,118 name-query impressions and 0 typology-query impressions**. The 07-25 triage
had already flagged Jordi as "worth not breaking".

Exact-name query `jordi hays` on the canonical URL only (fragments excluded):

| Window                               | Weeks | Clicks | Impressions |   CTR | Avg position |
| ------------------------------------ | ----: | -----: | ----------: | ----: | -----------: |
| Pre-spike baseline (May 25 – Jul 26) |     9 |     29 |       1,252 | 2.32% |         ~9.0 |
| Catalyst spike (Jul 27 – Aug 16)     |     3 |     90 |       3,676 | 2.45% |          6.8 |
| Post-rewrite (Aug 17 – Oct 2)        |     7 |     20 |       1,470 | 1.36% |         ~6.4 |

Weekly demand after the rewrite is similar to before it (~210 vs ~140 impressions a week), and the
position is **better** by about 2.5 spots. CTR still fell about 40%. A better position should raise
CTR, not lower it. The new snippet tells a bare-name searcher "this is a typology page" before it
tells them "this is who he is". Confidence is moderate: 49 clicks across both windows, and the
SERP may have shifted too (a Grokipedia page and a merch-site "Wikipedia" farm now rank).

**Class fix (recommended, not applied):** any people-corpus pass that rewrites titles should exempt
pages where bare-name + biography impressions exceed typology impressions, and every page with an
entity-gap packet. A census of the current export finds Jordi is the only large page in that state.
Three small ones carry typology-first titles despite name-dominant traffic: `oliver-tree`
(590 name / 352 typology), `caleb-hearon` (272 / 71), and `mike-majlak` (179 / 0). Fix them only
if the rule changes; none is worth a one-off pass.

## Measurement read — August 12 retrofits and the Friedberg fix

Captured today: `docs/data/gsc/experiments/2026-10-04-entity-gap-check.json`
(Sep 5 – Oct 2, 28 days). The weekly series below come from live GSC queries on the canonical URL.
The pre window is Jul 6 – Aug 9. The post window is Aug 17 – Oct 2, which skips the ship week.

| Page            | Scope            | Pre (clicks / imp / CTR / pos)   | Post (clicks / imp / CTR / pos) | Read                                                                  |
| --------------- | ---------------- | -------------------------------- | ------------------------------- | --------------------------------------------------------------------- |
| ashby           | `ashby florence` | 1 / 922 / 0.11% / ~9.8           | 11 / 2,219 / 0.50% / ~10.5      | **CTR ×4.5 at flat rank; demand still expanding.** Snippet fix worked |
| leila-hormozi   | all queries      | 5 / 347 / 1.44% / ~9.8           | 20 / 856 / 2.34% / ~8.0         | **Win on all three axes:** demand, rank (last 3 weeks ~6), CTR        |
| john-coogan     | all queries      | 10 / 979 / 1.02% / ~6.4          | 15 / 1,407 / 1.07% / ~7.5       | Neutral. CTR flat, rank slipped ~1 spot                               |
| david-friedberg | biography family | 1 / 182 / 0.55% / 9.9 (Aug 3–30) | 0 / 85 / 0.00% / 9.9            | Prediction (0.9–1.8%) missed; demand halved. Too small to read        |

- **Ashby:** the August 12 identity deck did what it was built to do. Exact-name CTR rose about
  4.5× at a slightly worse position while demand doubled (the last two weeks ran ~600 exact-name
  impressions a week). The remaining constraint is rank. Ashby sits at 10–11, the bottom of page
  one, behind a personal Wikipedia stub created 2026-06-07. The page has one inbound blog link
  (`why-the-next-thing-wont-fix-it-type-7`). Next lever: **CROSS-LINK**, not another rewrite. Run
  `pnpm gen:crosslinks -- --target /personality-analysis/ashby` and add 3+ contextual inbound links
  from Type 7 and comedian/creator pages.
- **Leila Hormozi:** the cleanest success in the program. Biography impressions went from 4 to 94
  at position 5.1. Leave it alone.
- **John Coogan:** no measurable effect. The bare name `john coogan` still collides with Jackie
  Coogan (Wikipedia redirects there), and the wife query remains his best performer. No action.
- **David Friedberg:** the fix was a sourcing correction, not a CTR play, so it stands regardless.
  No further action.

**Method warning for every future read.** GSC reports Google's jump-link impressions as separate
`page#fragment` URLs, each counted as its own impression. During the spike, `jordi-hays` showed
six fragment URLs with ~1,200 impressions each next to 3,676 on the real URL. The monthly
`page-trends` CSV and any `contains`-filtered page total include these, which is why it reported
17,683 August impressions and a 0.31% September CTR for Jordi. Both are artifacts.
`capture-entity-gap-experiment.mjs` already excludes fragments correctly. Use it, or filter on the
exact canonical URL.

## Scorecards

### Codie Sanchez — 85/100 — DIAMOND — CREATE

- **Demand trajectory: 16/20.** _Own or Be Owned_ launched 2026-09-18 with a livestream that drew
  140,000+ registrants (her press release). She announced her pregnancy as a PEOPLE exclusive in
  June 2026 (due December), and a December birth is a second scheduled name-search catalyst. She
  has about 3.4M Instagram followers. This is directional: no Trends or volume tool was used.
- **SERP weakness: 21/25.** `en.wikipedia.org/wiki/Codie_Sanchez` returns HTTP 404 with no deletion
  history. `Draft:Codie_Sanchez` is a 261-byte stub last touched by a revert against a blocked
  editor, so there is no live threat. The exact-name top ten is Entrepreneur's author page, the
  Amazon author store, a speaker-bureau bio, her own sites, Facebook, Famous Birthdays, and one
  real dedicated profile (Hispanic Executive). `codie sanchez biography` adds Goodreads, beacons.ai,
  and Concordia. The `husband/age` queries return only generated farms (thepunthought,
  biographybrief, guidenix, beastmagzine, wealthyspy).
- **Biography intent: 14/15.** Google autocomplete shows 29 biography suggestions: age, husband,
  "who is codie sanchez married to", ex husband, father, net worth, wikipedia, and ethnicity.
- **Source depth: 12/15.** Two first-person books, a large first-person video archive, a PEOPLE
  exclusive, Inc. (Lucia Auerbach, on the slowdown), Hispanic Executive, and Hola. Named
  third-party testimony is the thin part: so far only Chris Petkas's public X post.
- **9takes fit: 9/10.** The contradiction is the book's own thesis. _Own or Be Owned_ teaches owners
  to build "a business so good it doesn't need you", while Contrarian Thinking runs on her face and
  voice. Inc.'s headline adds the second layer: an empire built on "outworking anything", then a
  pregnancy that forced her to slow down. Niche: business creator, the Leila Hormozi lane.
- **Timing / index advantage: 8/10.** The catalyst is two weeks old and the next one is scheduled.
  There is no existing URL.
- **Entity clarity: 5/5.**
- **Penalties: 0.** 16 + 21 + 14 + 12 + 9 + 8 + 5 = **85**.

### Shyam Sankar — 81/100 — DIAMOND — CREATE

- **Demand trajectory: 13/20.** _Mobilize_ (co-written with Madeline Hart, Bombardier Books,
  2026-03-17) hit the NYT, LA Times, and USA Today bestseller lists. C-SPAN aired his book talk on
  2026-04-25, followed by a 2026 podcast run (a16z on 03-20, Joe Lonsdale's _American Optimist_
  in May, _School of War_). He was commissioned as an Army Reserve lieutenant colonel. Demand is
  sustained rather than spiking; no September catalyst was found.
- **SERP weakness: 22/25.** HTTP 404, no deletion log, no draft. The top ten is the Hudson Institute
  expert page, the Amazon author store, a speaker page, a Shortform podcast summary, Fox Business
  video, Revolving Door Project (critical), Benzinga, Simon & Schuster, and a YouTube short.
  `shyam sankar biography` adds a speaker bureau, a Trinity Prep alumni page, and one Substack
  profile. No major publisher owns his biography.
- **Biography intent: 13/15.** 23 autocomplete biography suggestions: wikipedia, wife, religion,
  nationality, parents, education, age, salary.
- **Source depth: 14/15.** First-person: the book, the Shawn Ryan Show (#190), a16z, American
  Optimist, School of War, and the C-SPAN talk. Third-party: the Revolving Door Project critique, a
  Substack biographical profile, and Palantir leadership statements.
- **9takes fit: 8/10.** His family left Lagos after a violent robbery and resettled in Orlando. He
  became Palantir employee #13 and invented the forward-deployed engineer: the engineer who goes
  to the customer instead of staying at a desk. Now he argues America must mobilize for war. The
  page should test whether that is one consistent drive or two. The techie niche is 9takes'
  strongest CTR cluster.
- **Timing / index advantage: 6/10.** The book catalyst is about six months old, but no competitor
  has filled the gap.
- **Entity clarity: 5/5.**
- **Penalties: 0.** 13 + 22 + 13 + 14 + 8 + 6 + 5 = **81**.
- **Career-story flag for DJ:** Sankar coined "Forward Deployed Engineering". A sourced profile of
  the person who defined the FDE role is directly useful for DJ's FDE interviews, as content and
  as a story to tell.

### Dylan Patel — 80/100 — DIAMOND — CREATE (on hold since 2026-09-01; re-ask)

- Demand trajectory: 15/20. SemiAnalysis projects $100M+ in 2026 revenue (The Information). He spoke
  at AI Infra Summit on 09-15 and gave a Yotta main-stage keynote on 09-28 to 09-30.
- SERP weakness: 20/25, down from 23. Wikipedia still returns 404, **but** `Draft:Dylan_Patel` (15.9 KB)
  was submitted 2026-05-04 and declined 06-21 as LLM output. It can be resubmitted at any time.
  Substrate Magazine also published the first dedicated profile on 2026-09-18.
- Biography intent: 13/15. 17 autocomplete biography suggestions: age, net worth, wikipedia, education,
  background, "who is dylan patel semianalysis".
- Source depth: 14/15 (Lex Fridman #459 transcript, Latent Space, his own writing). 9takes fit: 9/10.
- Timing: 6/10, down from 7: the window is narrowing. Entity clarity: 3/5 (common name).
- 15 + 20 + 13 + 14 + 9 + 6 + 3 = **80**.

### Dan Ives — 70/100 — PROMISING — CREATE if capacity

- Demand 14/20: he left Wedbush on 2026-07-01 to launch a "modern merchant bank" (CNBC, GlobeNewswire),
  and Bloomberg reported on 09-23 that his AI closed-end fund is seeking $200M. Constant TV presence.
- SERP 17/25: Wikipedia 404, no draft. Bloomberg profile, a UMD Smith alumni feature, CNBC,
  TipRanks, a tradersunion bio, an Onward State profile, and the Wedbush profile. Two campus
  features count as partial dedicated biographies.
- Biography intent 12/15: 17 suggestions (wife, married to, partner, family, age, net worth).
- Source depth 10/15: mostly TV hits and quotes; few long-form first-person sources. The family
  details exist only on farms.
- 9takes fit 6/10: the career-long bull whose job became being bullish on camera. The analyst niche
  is untested on 9takes.
- Timing 7/10. Entity clarity 4/5. **14 + 17 + 12 + 10 + 6 + 7 + 4 = 70.**

### Sahil Bloom — 69/100 — score says PROMISING, action WATCH

- Wikipedia: the article was **deleted 2026-04-26** (CSD A7 + G15, LLM-generated), so search indexes
  still list a dead `en.wikipedia.org/wiki/Sahil_Bloom` URL. That makes the gap more durable.
- Demand 9 (no dated catalyst; book two is still in manuscript), SERP 18, biography intent 13 (19
  suggestions: wife, parents, father, ethnicity), source depth 13, fit 7, timing 4, entity 5.
- WATCH until the second book has a publication date, then re-score.

### CaseOh — 59/100 — WATCHLIST — existing page, retrofit gated

- 9takes has `/personality-analysis/caseoh` but **zero** bare-name impressions. Wikipedia: HTTP 404.
- Demand 12, SERP 22 (fandom wikis plus farms only: briefly.co.za, stan.store, unilink,
  instabionetwork, starsunfolded, beacons), biography intent 12, source depth 6 (few long-form
  first-person interviews), fit 6, timing 6, entity 5 = 69, then **−10** because the biography
  intent is dominated by weight, height, and dating queries.
- The farm-only SERP is the warning case. "Case Dylan Baker, born May 9, 1998" appears only on farm
  and fandom pages. Do not use it until a primary source confirms it.

### Brianna LaPaglia — 55/100 — WATCHLIST

- No personal article; `Brianna Chickenfry` redirects to the _BFFs_ podcast article. 24 biography
  suggestions, but they are led by boyfriend, ex, "meatball man", and the Zach Bryan relationship.
- 10 + 15 + 12 + 12 + 7 + 5 + 4 = 65, then **−10** for gossip-dominant intent that involves
  allegations about a named third party.

## Retrofit briefs

### Jordi Hays — PROTECT (snippet repair only)

- **Baseline:** captured in `2026-10-04-entity-gap-check.json`. Exact-name query on the canonical
  URL: 20 clicks / 1,470 impressions / 1.36% / ~6.4 over the seven post-rewrite weeks.
- **Protected strengths:** keep the whole rebuilt body. It removed fabricated claims, answers age,
  wife, and the OpenAI acquisition with sourced prose, and the page's position improved after it
  shipped.
- **Change:** `meta_title` and `description` only, identity-first, built on the thesis the pilot
  itself named (an unserious-looking show made through an unusually serious daily process).
  Draft options:
  - `Jordi Hays: Why TBPN's Loudest Host Is Its Most Serious` (54 chars)
  - `Jordi Hays: The TBPN Co-Host Who Sold His Show to OpenAI` (57 chars)
  - Description: `Jordi Hays co-hosts TBPN, the live tech show OpenAI acquired in April 2026. Six-hour prep days, daily postmortems, and a Type 3 scoreboard explain the act.`
- **Do not** restore the old "Pattern Nobody Talks About" title. It was clickbait, and the corpus
  standards rejected it for good reason.
- **Factual watch:** search summaries currently assert a wife's name and a co-founder role sourced
  to a merch-site "Wikipedia" farm (`merchtbpn.com`). Do not let that farm claim into the page; the
  current wife section should keep citing only primary sources.
- **Predicted 28-day effect:** exact-name CTR 1.36% → 1.8–2.6% at position 6–7.5, with demand
  roughly flat at ~200 impressions a week. If position holds and CTR does not move, the SERP shift
  is the cause, not the snippet.
- **Ship path:** `pnpm push:people -- Jordi-Hays --sync` after the draft frontmatter edit; approve
  only `meta_title` and `description`. Preserve `lastmod`. Never `--publish`.

### Sky Bri — PROTECT, mark do_not_optimize

- 14,912 name-query impressions and 83 clicks in 90 days. That is the largest name pool on any
  9takes page, and she has no Wikipedia article. But the bare-name query (7,970 impressions,
  position 14.1) is navigational to her adult content, and `sky bri porn` runs 1,199 impressions.
- The legitimate career-status questions (`did sky bri retire`, `is sky bri retired`, `did sky bri
quit onlyfans`) are already answered by an existing sourced FAQ at positions 8–9.
- Raising CTR on the rest would mean promising adult or gossip content. Write a packet with
  `do_not_optimize: true` so future scouts stop surfacing this page.

## Creates and watchlist

- **Codie Sanchez — CREATE (85).** Page strategy:
  - H1 `Codie Sanchez`. Working SEO title: `Codie Sanchez: The Owner Who Says Your Business Shouldn't Need You`
    (the pipeline will tighten it).
  - Open with who she is now: Contrarian Thinking, _Main Street Millionaire_, _Own or Be Owned_
    (09-18).
  - Life spine: ASU journalism, Juárez reporting, Vanguard in 2008, then Goldman Sachs, State
    Street, and First Trust, then "boring businesses".
  - Answer `age`, `husband`, and `who is codie sanchez` in sourced FAQ prose. **Claims to avoid or
    qualify:** her birth date conflicts across sources (Aug 23 vs Aug 24, 1986). Say "turned 40 in
    August 2026" only if her own post confirms it. Name Chris Petkas only as PEOPLE and his own post
    establish him (husband, Navy SEAL veteran, Contrarian Thinking Capital partner). **Do not touch
    the `ex husband` query.** Attribute "three nine-figure businesses" to her as her own claim. No
    net-worth figures.
- **Shyam Sankar — CREATE (81).** Page strategy:
  - H1 `Shyam Sankar`. Working SEO title: `Shyam Sankar: The Palantir CTO Who Invented the Forward-Deployed Engineer`.
  - Open with Palantir employee #13, CTO, _Mobilize_, and the Army Reserve commission.
  - Life spine: Mumbai → Lagos → Orlando, Trinity Prep '00, Cornell, Stanford, Xoom, Palantir.
    Source the childhood to his own tellings (Shawn Ryan #190, the C-SPAN talk), not the Substack
    profile.
  - Wife Pooja Sankar is a public figure as Piazza's founder. State the marriage only from a primary
    source. Answer `religion` only if he has stated it on record; otherwise leave it.
  - Represent the critics (Revolving Door Project) fairly.
- **Dylan Patel — CREATE (80), held at DJ's direction.** Re-ask now: a declined AfC draft and a
  fresh Substrate profile mean the gap could close this quarter.
- **Dan Ives — CREATE if capacity (70).** Keep family off the page (farm-only sourcing).
- **Watch:** Sahil Bloom (re-score when book two has a date), CaseOh (gated on a primary source for
  real name and age), Brianna LaPaglia (gossip-dominant), Augustus Doricko (18 biography suggestions
  and no article, but no current catalyst), Sholto Douglas (18 suggestions; collides with Scottish
  peers).

## Rejected false positives

**Wikipedia gate (scripted this session; ~115 names).** The gate works and is lane-dependent:

- **Creator/streamer/comedian lane: ~85% eliminated.** Personal articles exist for Jake Shane,
  Benito Skinner, Drew Afualo, Hannah Berner, Paige DeSorbo, Kam Patterson, Alex Consani, Tinx,
  Jools Lebron, Grace Kuhlenschmidt, Kai Trump, Ryan Trahan, Max Fosh, Brittany Broski, Bobbi
  Althoff, Kylie Kelce, Alix Earle, Livvy Dunne, Theo Von, Andrew Schulz, Druski, Adin Ross, N3on,
  Kai Cenat, Duke Dennis, Agent00, Jynxzi, PlaqueBoyMax, Stable Ronaldo, Marlon, Caleb Hearon, and
  Callum Turner.
- **Tech/business media lane: ~55% survive.** Eliminated: Dwarkesh Patel, Delian Asparouhov, Joe
  Weisenthal, Tracy Alloway, Kyla Scanlon, Mike Solana, Emily Sundberg (created 2026-03-02), Boris
  Cherny (created 2026-06-19), Logan Kilpatrick, Jakub Pachocki, Amanda Askell, Chris Olah, Mati
  Staniszewski, Brett Adcock, Trae Stephens, Lucy Guo, Mario Nawfal, Zack Kass, Peter Steinberger,
  Roy Lee, Jack Altman, and Katherine Boyle.
- **Survived the gate but no current catalyst (not scored):** Packy McCormick, Ben Gilbert, Erik
  Torenberg, Turner Novak, Trenton Bricken, Lulu Cheng Meservey, Will Manidis, Sam Lessin, Gaby
  Goldberg, Tae Kim, Lenny Rachitsky, Greg Isenberg, Tyler Denk, Gene Munster, Marc Lou, Cat Wu,
  Molly O'Shea, Alex Kantrowitz, Mark Chen (OpenAI), and Nick Turley (OpenAI). Sam Parr and Shaan
  Puri are already covered and draw ~0 search impressions.

**Implication:** when generating candidates, start in the tech/business-media and business-creator
lanes. Creator-lane candidates almost all have articles by the time they matter.

## Method and caveats

- **GSC:** `docs/data/gsc/latest.json` (90 days, 2026-07-04 to 2026-10-02) for the prefilter and
  census. Live API pulls for weekly canonical-URL series. A new checkpoint was saved at
  `docs/data/gsc/experiments/2026-10-04-entity-gap-check.json`; it is a data capture, not a content
  edit. All windows are overlapping or rolling, so they are compared on ratios, not summed.
- **Wikipedia gate:** REST summary API plus direct `en.wikipedia.org/wiki/<Name>` HTTP status for
  every shortlisted name, the deletion log, and `Draft:` namespace checks. The MediaWiki action API
  rate-limited the batch run partway through. Every shortlisted verdict was re-confirmed by direct
  HTTP status, and Caleb Hearon served as a known-200 control.
- **Biography intent:** Google autocomplete (`suggestqueries.google.com`, US/en, run 2026-10-04),
  counting only suggestions that contain the name plus a biography term. These are real
  suggestions, not invented ones, but they show the presence of intent, not its volume.
- **SERP composition** comes from WebSearch on 2026-10-04 (US). Results vary by location, device,
  personalization, and date. Backlink counts are unknown and play no part in any score.
- **Prefilter:** `node scripts/emerging-entity-gap-candidates.mjs --limit 40`. Its scores are local
  signals, not SEO difficulty. Its top names (Kaia Gerber, Caleb Hearon, Kai Cenat, Cristiano
  Ronaldo, Theo Von) all fail the Wikipedia gate.
- **Ship-state** comes from the packets' `retrofit_applied_at`, the DB history table, and the live
  page `<title>` fetched by curl. `lastmod` was not used.
- **No blog, queue, DB row, sitemap, or generated file was edited.**

## Sources

- TBPN acquisition: [OpenAI](https://openai.com/index/openai-acquires-tbpn/), [TechCrunch](https://techcrunch.com/2026/04/02/openai-acquires-tbpn-the-buzzy-founder-led-business-talk-show/), [TBPN on Wikipedia](https://en.wikipedia.org/wiki/TBPN)
- Codie Sanchez: [press release](https://codiesanchez.com/own-or-be-owned-press-release/), [PEOPLE via AOL](https://www.aol.com/articles/entrepreneur-codie-sanchez-pregnant-expecting-140000000.html), [Inc.](https://www.inc.com/lucia-auerbach/she-built-a-multi-million-dollar-empire-on-outworking-anything-major-life-event-forced-step-back/91364145), [Hispanic Executive](https://hispanicexecutive.com/codie-sanchez/), [Contrarian Thinking about](https://www.contrarianthinking.co/about)
- Shyam Sankar: [Hudson](https://www.hudson.org/experts/shyam-sankar), [Mobilize (S&S)](https://www.simonandschuster.com/books/Mobilize/Shyam-Sankar/9798895655160), [C-SPAN via Archive](https://archive.org/details/CSPAN3_20260426_005900_Shyam_Sankar_Mobilize), [a16z](https://a16z.com/podcast/inside-palantir-building-software-that-matters-with-shyam-sankar/), [Substack profile](https://kbssidhu.substack.com/p/introducing-lt-col-shyam-sankar-the), [Revolving Door Project](https://therevolvingdoorproject.org/shyam-sankar-ai-trump-administration-villains/)
- Dylan Patel: [The Information](https://www.theinformation.com/briefings/dylan-patels-semianalysis-projects-100-million-2026-revenue), [Substrate](https://substratemag.com/dylanpatel/), [Yotta 2026](https://www.yotta-event.com/decoding-the-future-of-ai-compute-a-conversation-with-dylan-patel/)
- Dan Ives: [CNBC](https://www.cnbc.com/2026/07/01/tech-analyst-dan-ives-is-exiting-wedbush-for-a-new-venture.html), [Bloomberg](https://www.bloomberg.com/news/articles/2026-09-23/dan-ives-joins-closed-end-fund-wave-with-ai-focused-vehicle), [Onward State](https://onwardstate.com/2025/03/28/the-seeds-of-all-that-was-penn-state-wall-street-personality-dan-ives-journey-from-penn-state-to-tv/)
- CaseOh SERP sample: [fandom](https://caseoh.fandom.com/wiki/CaseOh), [briefly.co.za](https://briefly.co.za/facts-lifehacks/celebrities-biographies/199159-how-caseoh-weigh-bio-family-height-age-more/)

## Measurement plan

- **Jordi snippet:** if shipped, read 28 days after the push with
  `node scripts/capture-entity-gap-experiment.mjs --label <date>-jordi-snippet-check --days 28 --slugs jordi-hays`.
  Compare against the exact-name canonical-URL row in today's checkpoint, not page totals.
- **Ashby cross-links:** read position on `ashby florence` 28 and 56 days after the links land. The
  success condition is rank (10.5 → <8), since the snippet already fixed CTR.
- **New creates:** capture a first checkpoint 28 days after publish. Expect the bare name to
  register only after indexing settles; Aaron Pierre shows no exact-name impressions after five
  weeks.
