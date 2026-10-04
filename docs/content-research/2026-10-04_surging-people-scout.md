<!-- docs/content-research/2026-10-04_surging-people-scout.md -->

# Surging People Scout — 2026-10-04

## TL;DR — top moves this week

**The constraint is finishing, not finding.** All seven CREATE picks from the 09-09 scout became drafts (plus two held runs), and **none is published**. Three stalled on the 8.5 gate, two died on session limits, and one failed a repair turn cap. Meanwhile three of those drafts are entering their search windows now. Before adding fifteen new names, clear the time-boxed finishes.

1. **Joseph Zada — FINISH / PUBLISH — 89.** Two catalysts seven weeks apart: _East of Eden_ (Cal Trask, Netflix, Oct 1, RT 87%) and _Sunrise on the Reaping_ (Haymitch, Nov 20). Wikipedia views went from 891/day in June to 13,237/day over Oct 1–3. Held at 8.4. The draft already covers the _East of Eden_ shoot but predates its release.
2. **Florence Pugh — CREATE (fill the empty DB stub) — 96.** About 59K Wikipedia views/day for Oct 1–3, plus _East of Eden_ (lead, EP) on Oct 1, then **_Avengers: Doomsday_ and _Dune: Part Three_ both on Dec 18**. The DB row `florence-pugh` is a 2025-06-25 placeholder with no content. There is no local draft.
3. **Dario Amodei — UPDATE — 95, with Daniela Amodei — CREATE — 84.** GSC first-party impressions went 213 (Jun) → 780 → 1,127 → **3,652 (Sep)**. Queries are biographical ("parents", "girlfriend", "is … neurodivergent"), sitting at positions ~10–11. Anthropic's reported IPO ladder: investor day Oct 14, roadshow week of Nov 9, listing before Thanksgiving.
4. **The _Artificial_ cluster — Andrew Garfield FINISH (88), Sam Altman UPDATE (86), Greg Brockman CREATE (85), Ilya Sutskever CREATE (80).** Guadagnino's OpenAI film (Neon) premieres at NYFF **tomorrow, Oct 5**, then goes wide **Dec 25**. Garfield plays Altman, Cooper Hoffman plays Brockman, Yura Borisov plays Sutskever. Garfield's 8.7 draft is unpublished and never mentions the film. Brockman and Sutskever sit in the frontier-builder niche, which has the best median performance (178).
5. **Stella Lefty — CREATE — 85.** The biggest uncovered music name: "Boston" is #2 on the Hot 100. Wikipedia went from ~950/day in June to ~14.5K/day, sustained for two months. Tour Oct 30–Nov 23, Best New Artist contender for Nov 16 nominations, 2027 tour. The plagiarism claims are **allegations** and must stay that way.

~~Zero-effort move: Ben Shelton only needs the publish step.~~ **Correction (same day):** Ben Shelton is marked `reviewed: true` / `ready_for_production: true` (8.5, run `eligible`), but `node scripts/blog-editorial-check.mjs … --release` returns `editorial_v3:stale_or_invalid_release`. The draft changed after the Sept 19 release manifest (content hash 8332… → 71a0…). He also has no portrait images and an `http://` asapsports citation the 6 AM publisher rejects. He needs a `--resume`/`--refresh` re-verify, a portrait, and a citation fix. His spike has faded (434K views on Sept 12 → ~1.2K/day), so this is low priority.

## CREATE (new blogs, ranked by search-demand × niche strength)

Ranked by D × N (demand trajectory × niche prior). Scores are in Method.

| Person                    | Score | D×N | Niche                          | Horizon   | Catalyst / spike ladder                                                                                                        | Demand signal type                                                                                             | Enneagram hypothesis                                                                                                   | Confidence                                     |
| ------------------------- | ----: | --: | ------------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Maleah Joi Moon (24)      |    80 | 330 | rising-star                    | NOW       | _A Different World_ sequel, Netflix Sept 24, No. 1, reported renewed → Tony/Grammy profile → awards                            | PLATFORM GROWTH (Wikipedia 149/day Jun → 17.7K/day last 7, still climbing)                                     | Unassigned. Watch for achievement framing vs. lineage/legacy-role pressure.                                            | High demand; medium source depth               |
| Ella Beatty (26)          |    80 | 315 | rising-star                    | NOW       | _Monster: The Lizzie Borden Story_ (first lead), Netflix Sept 17, No. 1 → Globes noms Dec 7 (speculative)                      | PLATFORM GROWTH (4.8K Jun → 83K/day Sept 16–30 → 31K last 3; past peak)                                        | Unassigned. Test the inherited-fame vs. self-made-proof question. Do not read Lizzie Borden into her.                  | High demand; thin long-form record             |
| Florence Pugh             |    96 | 312 | newMovieStar                   | NOW/NEXT  | _East of Eden_ Oct 1 (lead, EP) + Vanity Fair Oct cover → **Dec 18 _Avengers: Doomsday_ + _Dune: Part Three_** → awards        | PLATFORM GROWTH (5.3K Jun → 59K/day last 3) + RELATED SEARCH CLUSTER (`east of eden` 200K+, Pugh in breakdown) | Unassigned. Ample interview record (cooking videos, press, boundary-setting on press tours).                           | High                                           |
| Mike Faist (34)           |    80 | 286 | rising-star / movieStar        | NOW       | _East of Eden_ (Charles Trask) Oct 1 → Globes Dec 7; _Challengers_ base                                                        | PLATFORM GROWTH (845 Jun → 23K/day last 3, rising)                                                             | Unassigned. Role-selection and withdrawal patterns are the angle (IndieWire interview).                                | High demand; good sources                      |
| Dakota Johnson (37 today) |    77 | 253 | movieStar                      | NOW       | _Verity_ Oct 2 (mixed reviews; $15.1M opening day/early) + 3rd SNL host Oct 3 → directorial debut TBA                          | VERIFIED SEARCH (direct name trend 50K+ in 24h and 7d) + PLATFORM GROWTH (6.8K → 52.8K peak Oct 3)             | Unassigned. Large archive of famously awkward/candid interviews. Avoid parental-trauma armchairing.                    | High demand; thin forward runway               |
| sombr (21)                |    78 | 238 | rising-star / alternative      | NOW/NEXT  | First arena tour → **MSG Nov 23**; VMA George Michael tribute Sept 27; Grammy noms Nov 16 (possible)                           | PLATFORM GROWTH (5.8K → 13.9K/day Sept 16–30)                                                                  | Unassigned.                                                                                                            | Medium                                         |
| Sienna Spiro (21)         |    80 | 234 | rising-star                    | NOW/NEXT  | VMA Best New Artist Sept 27 → NA tour **Oct 13–Nov 12** → **Grammy BNA noms Nov 16** (Kalshi #2) → Feb 7                       | PLATFORM GROWTH (4K → 65.5K peak Sept 28 → 7K last 3)                                                          | Unassigned. "Next Adele" framing is press, not evidence.                                                               | Medium-high                                    |
| Josh Hartnett (48)        |    79 | 231 | movieStar (comeback)           | NOW       | _Verity_ Oct 2 → **_Below_ Netflix Oct 8**                                                                                     | PLATFORM GROWTH (2.75K → 39.5K/day last 3)                                                                     | Unassigned. "Walked away from Hollywood" is the obvious hook; test it against his own accounts (NPR Oct 2).            | Medium-high                                    |
| Daniela Amodei            |    84 | 225 | frontier-builder               | NEXT      | Forbes 400 Sept 15 → S-1 leak Sept 29 → **Oct 14 investor day → week of Nov 9 roadshow → pre-Thanksgiving listing** (reported) | CALENDAR FORECAST + PLATFORM GROWTH (5.5–7K/day) + GSC FIRST-PARTY sibling demand (Dario page 3,652 impr)      | Unassigned. Operator-president beside a founder-scientist sibling: the contrast is the piece.                          | High catalyst; medium person-intent            |
| Stella Lefty (24)         |    85 | 220 | rising-star (country-pop edge) | NOW/NEXT  | #2 Hot 100 "Boston" → tour **Oct 30–Nov 23** → **Grammy BNA Nov 16** → 2027 tour Jan 9–Feb 20                                  | PLATFORM GROWTH (947 → 14.5K/day, sustained ~10 weeks) + NEWS VELOCITY                                         | Unassigned. Plagiarism claims are **alleged**; father is Eric Lefkofsky. Neither is personality evidence.              | High demand; niche prior uncertain             |
| Christopher Abbott (40)   |    81 | 216 | movieStar / alternative        | NOW/EARLY | Professor X casting (D23, Aug) + baby with Aubrey Plaza (Aug) → _East of Eden_ Oct 1 → X-Men 2028                              | PLATFORM GROWTH (149.8K peak Aug 15; 34K/day last 3)                                                           | Unassigned. Free crosslink to Aubrey Plaza (published).                                                                | Medium-high                                    |
| Greg Brockman             |    85 | 210 | frontier-builder               | NOW/NEXT  | "Astra is AGI" Sept 3 → Forbes 400 Sept 14 → super-PAC reversal Sept 30 → **_Artificial_ NYFF Oct 5 → wide Dec 25**            | PLATFORM GROWTH (819 → 3.2K/day) + NEWS VELOCITY + CALENDAR FORECAST                                           | Unassigned. Stratechery (Sept 4) and Odd Lots (Sept 14) give fresh first-person material.                              | High                                           |
| Larry Ellison             |    75 | 169 | big-tech-founder               | NOW       | **Paramount–WBD closes Oct 6 (renamed Skydance, NYSE: SKYD)** + Oracle debt scrutiny + TIME100 AI                              | PLATFORM GROWTH (8.8K/day) + NEWS VELOCITY                                                                     | Unassigned. Evergreen gap: a top-5 richest founder uncovered on 9takes. David Ellison is the catalyst holder but thin. | Medium                                         |
| Ilya Sutskever            |    80 | 150 | frontier-builder               | NEXT      | SSI–Nvidia (July) → **_Artificial_ NYFF Oct 5 → Dec 25** → SSI first model (unscheduled; Oct "announcement" tease unverified)  | PLATFORM GROWTH (2.3–3.8K/day) + CALENDAR FORECAST                                                             | Unassigned. Very deep record (Dwarkesh 2025, Lex).                                                                     | High sources; medium demand                    |
| Olivia Dean               |    77 | 144 | pop-star                       | NEXT      | Two Hot 100 top-10s → tour ends Oct 17 → **Grammy AOTY noms Nov 16** → Feb 7                                                   | PLATFORM GROWTH (6–10K/day steady) + CALENDAR FORECAST                                                         | Unassigned. Oct 1 Bill Withers publisher suit is an **allegation** against UMG.                                        | Medium                                         |
| Paapa Essiedu             |    76 | 104 | rising-star / movieStar        | NEXT      | **HBO _Harry Potter_ Dec 25** (Snape; reworked backstory) → weekly into January                                                | CALENDAR FORECAST (baseline 1.2–3.3K/day)                                                                      | Unassigned. Sunday Times interview on the racist casting backlash is the key first-person source.                      | High catalyst; forecast only                   |
| James Talarico            |    77 |  90 | politician                     | NEXT      | Texas Senate race, Fox debate offer (unscheduled) → **Nov 3** → 2028 talk if he wins                                           | PLATFORM GROWTH (9.6K → 23K → 14K/day) + CALENDAR FORECAST                                                     | Unassigned. Rogan #2352 (2h42m) is the anchor source.                                                                  | High demand, **weak 9takes prior** (see notes) |

**Recommended queue tranche (pipeline cap is 5/week):**

- **Week 1:** Florence Pugh, Daniela Amodei, Stella Lefty, Maleah Joi Moon, Greg Brockman.
- **Week 2:** Mike Faist, Sienna Spiro, Ilya Sutskever, Ella Beatty, Christopher Abbott.
- **Week 3:** Dakota Johnson, sombr, Josh Hartnett, **Paapa Essiedu (must be live by ~Dec 1)**, Olivia Dean.
- Larry Ellison and Talarico only if DJ wants the business/politics lanes.

## FINISH / PUBLISH (existing drafts, ranked by opportunity × readiness)

| Person          | Score | Grade                               | Production state                                                                                         | Current catalyst                                                                                                       | Smallest next action                                                                                                                                            |
| --------------- | ----: | ----------------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Joseph Zada     |    89 | 8.4 (held: `overall_below_8.5`)     | Local + DB unpublished; held in queue since Sept 14; `reviewed: false`                                   | _East of Eden_ out Oct 1 (RT 87%) + _Sunrise on the Reaping_ Nov 20; Wikipedia 13.2K/day                               | One targeted revision to clear 8.5, plus release-state facts (reviews, Cal performance). Then DJ review → production. **Publish by ~Oct 20** for Nov 20 runway. |
| Andrew Garfield |    88 | 8.7                                 | Local + DB unpublished since June 9; `reviewed: false`                                                   | _Artificial_ (as Sam Altman) NYFF Oct 5 → Dec 25; Wikipedia 32K/day, peak Oct 2                                        | Currency pass: add _Artificial_, _The Magic Faraway Tree_, _Wild Things_ (0 mentions now). Then DJ review → production. Quality already clears the gate.        |
| Nathan Fielder  |    82 | 7.9                                 | Local + DB unpublished; four Sept 9 runs                                                                 | _You Can See Everything_ (A24) **Oct 16**; Wikipedia ~15K/day sustained since Telluride                                | Revision pass to 8.5 in the next 10 days. Link to the Elizabeth Holmes page, which already covers the doc.                                                      |
| Madonna         |    80 | none (stopped at stage 6–7)         | July 18 run hit the session limit during enrich/grade; DB row unpublished                                | 7 VMAs incl. Artist of the Year (Sept 27); _Confessions II_ (July 3); Trends **`madonna` 1M+** and `madonna age` 100K+ | Resume enrich + grade, add VMA/album facts, DJ review. **Exclude** the anonymous "disoriented backstage" reports: unverified and health-speculative.            |
| Austin Abrams   |    79 | 8.1 (held: overall + enneagram 7.5) | Held since Sept 12                                                                                       | _Resident Evil_ spike (34.7K/day Sept 16–30) → **_Whalefall_ Oct 16**; 16.5K/day now                                   | Needs a real typing rework, not a polish. The Oct 16 window is tight. If it can't clear by ~Oct 14, aim for post-release refresh demand instead.                |
| Inde Navarrette |    75 | 8.1 (enneagram 7.5)                 | Local + DB unpublished since Sept 10                                                                     | **Hosts SNL Oct 31**; Wikipedia 15K/day (down from 59K in June)                                                        | Revision for typing confidence → DJ review. Target live by Oct 28.                                                                                              |
| Jim Carrey      |    67 | 7.4                                 | Unpublished since June 30                                                                                | Married Min Ah (rep-confirmed, Sept 30); Trends `jim carrey` 100K+; 28.8K/day last 3                                   | Low priority. A personal-news spike with no dated project. Revise when capacity allows.                                                                         |
| Rod Wave        |    64 | none                                | Sept 17 run **failed** at verify-repair (60-turn cap); open legal/Lil Poppa passages need the full panel | Arena tour through Nov 19; leads Google Trends among the 09-09 names, but Wikipedia only ~800/day                      | One targeted repair + re-verify (findings say rewording only, no new research). Sensitive: legal facts must be court-record precise.                            |
| Ben Shelton     |    58 | 8.5                                 | **`reviewed: true`, `ready_for_production: true`, run `eligible`**                                       | Faded (1.2K/day); ATP Finals Nov; Australian Open Jan                                                                  | Not zero-work (see TL;DR correction): release manifest stale, no portrait, one `http://` citation. Re-verify, then portrait.                                    |
| Arthur Mensch   |    55 | none                                | Sept 10 run hit the session limit at post-revision grade/finalize                                        | Flat (~300/day)                                                                                                        | Resume grade + finalize when idle. Low urgency.                                                                                                                 |

Also unpublished but not prioritized: **Shakira** (9.0, Apr 27, 8.6K/day, no catalyst), **Glen Powell** (8.5, Apr 6, _Chad Powers_ S2 already past), **Chase Infiniti** (8.2, TIFF _The Julia Set_, 3.4K/day).

## UPDATE (already covered, re-surging or stale)

| Person        | Last updated / grade | What re-surged                                                                                                           | Why update beats new                                                       | Suggested angle                                                                                                                                                                                    |
| ------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dario Amodei  | Mar 23; 9.2→8.8 DB   | **GSC FIRST-PARTY 213 → 3,652 impressions (Jun→Sep), 24 clicks.** Anthropic S-1 leak + IPO ladder; Wikipedia ~15–21K/day | URL already earns impressions at ~position 10; refresh compounds index age | IPO/S-1 section (attributed, reported dates). Answer biographical queries factually (family, Daniela). For "neurodivergent": state there is no public diagnosis, **no speculation**. Link Daniela. |
| Sam Altman    | Mar 1; 9.5           | _Artificial_ portrays him (Garfield). NYFF Oct 5 → Dec 25; Astra "AGI" claim; no 2026 IPO                                | Strongest existing AI page; film will drive "is it accurate" searches      | Short "What _Artificial_ gets right/wrong" section after NYFF reviews. Keep film dramatization separate from evidence. Ship by ~Dec 1.                                                             |
| Mikey Madison | Apr 3; 9.2           | _The Social Reckoning_ Oct 9; Best Actress contender; GSC 23 → 660 impressions (Jun→Sep)                                 | Rising first-party impressions on a published URL                          | Add the new role + awards context after the Oct 9 release; refresh FAQ.                                                                                                                            |
| Tom Cruise    | Feb 15; 8.7          | _Digger_ (Iñárritu) Oct 2 + first GQ cover in 20 yrs; GSC 352 → 1,740 impressions (Jun→Sep); Wikipedia 28K/day           | Impressions already rising at position ~8.7                                | Current-work section (Digger, GQ). Light touch.                                                                                                                                                    |
| Ella Langley  | Jul 3; 8.9           | Top CMA nominee (Nov 18), Kalshi BNA favorite (Nov 16 noms), "Choosin' Texas" 24 weeks at #1                             | Published URL; awards ladder is dated                                      | Pre-Nov 16 refresh with chart/awards facts.                                                                                                                                                        |
| Anne Hathaway | Mar 27; 9.1          | _Verity_ Oct 2; Trends `anne hathaway` 200K+; Wikipedia 51K/day                                                          | High-demand URL                                                            | Light currency pass only. Mixed reviews, no runway.                                                                                                                                                |

## CROSS-REFERENCE / DISTRIBUTION (covered + healthy, ride the wave)

- **Elizabeth Holmes:** already updated with _You Can See Everything_ (local + DB content both reference Fielder). Wikipedia is still ~41K/day, **but GSC shows only 86 impressions in September**. The page isn't ranking for the surge, so this is an authority/linking problem, not a content one. Distribute on **Oct 16** and link it from the Fielder page once published.
- **Aubrey Plaza ↔ Christopher Abbott:** link both if Abbott is created.
- **Dolly Parton:** died Aug 25. The page was updated the same day. Tributes are likely at the CMAs (Nov 18) and Grammys (Feb 7). Distribution only.
- **Zach Bryan:** published Sept 10. Spike (22.9K/day, peak Oct 3) is a political-shirt controversy. No rewrite; restraint.
- **Jeremy Allen White:** _The Social Reckoning_ Oct 9. Link with Mikey Madison.
- **Colleen Hoover / Anne Hathaway / Dakota Johnson / Josh Hartnett:** a _Verity_ cluster for internal links once new pages exist. Hoover's DB row is an empty placeholder (author niche, weak prior).
- **Mira Murati / Elon Musk / Sam Altman:** _Artificial_ characters. Interlink with Brockman/Sutskever when created.
- **Shane Gillis (SNL host Oct 10), Gracie Abrams (SNL Oct 31), Adéla ("Nicole Kidman" #22→#11, BNA contender):** social/distribution moments only.

## SKIPPED (and why)

- **Gypsy-Rose Blanchard:** the largest raw spike in this scout (217K Wikipedia/day, Trends 1M+). It is driven by Ken Urker's death on Oct 1 and his family disputing her account. Death spike plus disputed claims (−15, −10) and a trauma/crime premise.
- **Anthony Head:** died June 1, 2026. The current 200K+ trend is the _Ted Lasso_ tribute episode. Death spike, no forward catalyst.
- **Jackie Chan:** the 200K+ trend is a debunked "1954–2026" death hoax. One-day curiosity. He is an **evergreen gap** (5K/day baseline), not a surge; revisit with _The Shadow's Edge 2_.
- **Christa Pike (5M+), Chad Lowe (1M+), "cornell 7 case":** execution, family tragedy, and a criminal case. Not personality subjects.
- **Macklemore:** 1.08M views in Sept from the Gillette/"Free Palestine" removal. Fading (5.8K/day), no catalyst, weak music-crossover prior.
- **Candace Owens:** steady high demand, but it is entirely defamation suits and conspiracy claims (−10).
- **Michael Truell:** spike faded; solo first-person record thin. **Brett Adcock:** ~300–400/day.
- **Graham Platner, Erika Kirk:** allegation- and assassination-driven demand.
- **TheBurntPeanut, EsDeeKid:** age and identity unverifiable, so the minors guardrail can't be cleared.
- **Minors:** HBO _Harry Potter_ child leads, Walker Scobell, and any _Dune_ cast member who may be under 18.
- **Jaafar Jackson:** fading (26K → 5.7K/day).

## Lay of the land (intel notes)

- **Netflix's fall is a person-search machine.** _Monster: Lizzie Borden_ (Sept 17), _A Different World_ (Sept 24), and _East of Eden_ (Oct 1) each pushed one or more relatively unknown adults past 10K Wikipedia views/day within a week. Prestige-limited-series casts are the best "unfamiliar lead" vein right now.
- **The AI cluster now has a Hollywood calendar.** _Artificial_ (NYFF Oct 5 → Dec 25), the Anthropic IPO (Oct 14 → pre-Thanksgiving), Roose's _The AGI Chronicles_ (Oct 6), and the Skydance close (Oct 6) all hit the frontier-builder niche, the best-performing niche on 9takes.
- **Grammy nominations Nov 16 are the music forcing date.** Lefty, Spiro, sombr, Olivia Dean, Ella Langley (covered), and Geese/Cameron Winter all sit on BNA/AOTY prediction lists. Pages need to be live and indexed by early November.
- **9takes is under-indexed on rising-star music.** Stella Lefty, sombr, and Sienna Spiro each draw 7–15K Wikipedia views/day and are uncovered.
- **First-party data says skip politics and athletes.** Over 90 days, `zohran-mamdani` earned 178 impressions despite ~17–25K Wikipedia views/day, and `alexandria-ocasio-cortez` earned 305. `caitlin-clark` earned 97 and `ilona-maher` 713. This matches DJ's 09-09 "non-athlete subjects prioritized" note. Talarico, Ossoff, Mike Tyson, and Tyson Fury are demoted on this evidence.
- **Google Trends "Trending now" is a poor person-finder this week.** The past-7-days U.S. list (2,000 rows; ~400 screened) was dominated by college football, MLB playoffs, USA–Mexico soccer, and true crime. Wikipedia pageviews (bot-filtered, daily) did more of the work.

## 30–120 day catalyst calendar

| Date/window                   | Person                                                | Catalyst                                           | Current action                           | Recheck trigger                                   |
| ----------------------------- | ----------------------------------------------------- | -------------------------------------------------- | ---------------------------------------- | ------------------------------------------------- |
| **Oct 5**                     | Garfield, Altman, Brockman, Sutskever, Murati         | _Artificial_ NYFF premiere                         | FINISH Garfield; CREATE Brockman         | First reviews (accuracy framing)                  |
| Oct 6                         | Larry / David Ellison                                 | Paramount–WBD close → Skydance (SKYD)              | Optional CREATE (Larry)                  | CNN leadership changes                            |
| Oct 7                         | Eleazar, Creed-Miles, Summer H. Howell                | Variety 10 Actors to Watch issue; _Carrie_ (Prime) | WATCH                                    | Post-premiere pageviews                           |
| Oct 8                         | Josh Hartnett                                         | _Below_ (Netflix)                                  | CREATE (week 3)                          | Netflix Top 10                                    |
| Oct 9                         | Mikey Madison, Jeremy Allen White; Cameron Winter     | _The Social Reckoning_; _Live at Carnegie Hall_    | UPDATE Madison; WATCH Winter             | Reviews / chart entry                             |
| Oct 13                        | Sienna Spiro; Mike Tyson                              | NA tour opens; Netflix _TYSON_ docuseries          | CREATE Spiro; WATCH Tyson                | Doc reception                                     |
| **Oct 14**                    | Dario & Daniela Amodei                                | Anthropic investor day (reported)                  | UPDATE Dario; CREATE Daniela             | S-1 public filing                                 |
| **Oct 16**                    | Nathan Fielder, Elizabeth Holmes; Austin Abrams       | _You Can See Everything_ (A24); _Whalefall_        | FINISH Fielder/Abrams; distribute Holmes | Opening-weekend coverage                          |
| Oct 23                        | Tom Rhys Harries                                      | _Clayface_                                         | Pipeline failed (no draft); WATCH        | Opening weekend; re-queue only if it breaks out   |
| Oct 30–Nov 23                 | Stella Lefty                                          | Lefty Live tour                                    | CREATE (week 1)                          | —                                                 |
| **Oct 31**                    | Inde Navarrette                                       | Hosts SNL                                          | FINISH by Oct 28                         | —                                                 |
| Nov 3                         | Talarico, Ossoff; Brockman (PAC)                      | U.S. midterms                                      | WATCH (weak prior)                       | Win → 2028 national curiosity                     |
| Nov 6 / Nov 20                | Anthony Ippolito                                      | _I Play Rocky_ limited / wide                      | WATCH → PREP                             | Review-driven name searches                       |
| Week of Nov 9 → before Nov 26 | Amodei siblings                                       | Anthropic roadshow → listing (reported)            | Pages live before Nov 9                  | Official pricing date                             |
| Nov 12                        | Rosalía, Karol G                                      | Latin Grammys                                      | WATCH (evergreen gaps)                   | Wins                                              |
| **Nov 16**                    | Lefty, Spiro, sombr, Olivia Dean, Langley, Geese      | Grammy nominations                                 | Live + indexed before                    | Nominations list                                  |
| Nov 18                        | Ella Langley; Dolly Parton                            | CMA Awards                                         | UPDATE Langley                           | —                                                 |
| **Nov 20**                    | Joseph Zada; Andrew Scott                             | _Sunrise on the Reaping_; _Elsinore_               | FINISH Zada by ~Oct 20                   | Tracking / reviews                                |
| Nov 23                        | sombr                                                 | Madison Square Garden                              | CREATE (week 3)                          | —                                                 |
| Nov 25                        | Hunter Schafer                                        | _Blade Runner 2099_ (Prime)                        | WATCH                                    | Premiere response                                 |
| Dec 7                         | Faist, Beatty, Abbott, Eleazar                        | Golden Globe nominations                           | Pages live before                        | Nominations                                       |
| Dec 11                        | Tyson Fury, Anthony Joshua                            | Fight on Netflix                                   | WATCH (athlete prior)                    | —                                                 |
| **Dec 18**                    | Florence Pugh                                         | _Avengers: Doomsday_ + _Dune: Part Three_          | CREATE (week 1)                          | —                                                 |
| **Dec 25**                    | Paapa Essiedu; _Artificial_ cast                      | HBO _Harry Potter_; _Artificial_ wide              | CREATE Essiedu by ~Dec 1                 | Episode cadence                                   |
| Jan 21 / Feb 7 / Feb 14       | Awards contenders; music nominees; halftime headliner | Oscar noms; Grammys; Super Bowl LXI                | —                                        | Halftime announcement (Miley Cyrus 63% on Kalshi) |

## WATCHLIST

- **Anthony Ippolito:** _I Play Rocky_ (Nov 6 limited / Nov 20 wide). Showed he can spike (61.7K views on trailer day), now 2.2K/day, thin record. Trigger: a long-form personal interview plus reviews singling him out. **Recheck Oct 28.**
- **Rosalind Eleazar:** four catalysts (_Slow Horses_ S6, _Misty Green_ Oct 9, Variety 10 to Watch, Best Actress chatter); 3.8K/day. Trigger: >8K/day after Oct 9 or a Globes nomination. **Recheck Oct 14.**
- **Cameron Winter (Geese):** strongest niche (alternative-artist). Carnegie Hall album Oct 9 and PTA concert film Nov–Jan. Searches split with the band. The documented Wired "psyop" marketing report is reportable fact. Trigger: concert-film release date plus BNA nomination. **Recheck Nov 17.**
- **Mike Tyson:** Netflix doc Oct 13. Evergreen 6.5K/day, uncovered, deep record. Demoted only by the athlete prior. DJ call. **Recheck Oct 20** for a doc-driven rise.
- **Rosalía / Karol G:** evergreen pop gaps with Latin Grammy (Nov 12) and SNL (Rosalía, Oct 10) moments. **Recheck Nov 13.**
- **Hunter Schafer:** _Blade Runner 2099_ Nov 25, high baseline (5–8K/day). **Recheck Nov 26.**
- **Summer H. Howell (22):** _Carrie_ title role Oct 7, thin record. **Recheck Oct 14.**
- **Jon Ossoff / James Talarico:** watch only for a national post-election moment. **Recheck Nov 4.**
- **Ari Emanuel:** memoir _Roll the Calls_ (Sept 22), strong first-person source; spike fading (36K → 6K/day). UFC dates Nov 14 / Dec 12. **Recheck Nov 15.**
- **Miley Cyrus (covered):** UPDATE trigger = Super Bowl LXI halftime announcement.
- **Joe Anders (22), Sophie Wilde, Hoon Lee, Esmé Creed-Miles, Hudson Williams, Dominic Fike, Malcolm Todd, 2hollis, Hannah Berner:** rising but sub-threshold, or thin on sources. **Recheck Oct 21.**

These are proposed editorial recheck dates, not scheduled reminders.

## Queue-ready entries (for backlog-queue.json)

The queue's `queue` array is **empty** (lastUpdated Sept 21). The two held items sit at priority 89/88 (Abrams/Zada). Priorities below start above them so new surges lead the next run. **Only append after DJ picks.** Florence Pugh's DB row already exists as an empty stub, so creation must update that row, not insert a new one.

```json
[
	{
		"name": "florence-pugh",
		"displayName": "Florence Pugh",
		"type": null,
		"priority": 96,
		"priorityReason": "East of Eden lead (Netflix Oct 1) + Avengers: Doomsday and Dune: Part Three both Dec 18. Wikipedia 5.3K/day Jun -> 59K/day Oct 1-3; East of Eden 200K+ Trends cluster. NOTE: empty DB stub row exists (2025-06-25) - fill it, do not insert a duplicate.",
		"estimatedTraffic": "high",
		"searchVolume": "high",
		"personaTitle": null,
		"addedToQueue": "2026-10-04",
		"retryCount": 0,
		"strategicValue": "east-of-eden-dune-marvel-cluster"
	},
	{
		"name": "daniela-amodei",
		"displayName": "Daniela Amodei",
		"type": null,
		"priority": 95,
		"priorityReason": "Anthropic IPO ladder (reported): investor day Oct 14, roadshow week of Nov 9, listing before Thanksgiving. Forbes 400 newcomer. Sibling Dario page GSC impressions 213 -> 3,652 (Jun -> Sep). Must be live before Nov 9.",
		"estimatedTraffic": "high",
		"searchVolume": "medium",
		"personaTitle": null,
		"addedToQueue": "2026-10-04",
		"retryCount": 0,
		"strategicValue": "anthropic-ipo-cluster"
	},
	{
		"name": "stella-lefty",
		"displayName": "Stella Lefty",
		"type": null,
		"priority": 94,
		"priorityReason": "'Boston' #2 Hot 100; Wikipedia ~950/day Jun -> ~14.5K/day sustained 10 weeks; tour Oct 30-Nov 23; Grammy BNA contender (noms Nov 16). Plagiarism claims are allegations - attribute, never use as personality evidence.",
		"estimatedTraffic": "high",
		"searchVolume": "high",
		"personaTitle": null,
		"addedToQueue": "2026-10-04",
		"retryCount": 0,
		"strategicValue": "grammy-bna-2027-cluster"
	},
	{
		"name": "maleah-joi-moon",
		"displayName": "Maleah Joi Moon",
		"type": null,
		"priority": 93,
		"priorityReason": "A Different World sequel (Netflix Sept 24, No. 1, reported renewed); Wikipedia 149/day Jun -> 17.7K/day last 7 and still climbing; Tony + Grammy winner at 24.",
		"estimatedTraffic": "high",
		"searchVolume": "medium",
		"personaTitle": null,
		"addedToQueue": "2026-10-04",
		"retryCount": 0,
		"strategicValue": "netflix-fall-breakout-cluster"
	},
	{
		"name": "greg-brockman",
		"displayName": "Greg Brockman",
		"type": null,
		"priority": 92,
		"priorityReason": "Played by Cooper Hoffman in Guadagnino's Artificial (NYFF Oct 5, wide Dec 25); 'Astra is AGI' claim Sept 3; Forbes 400 Sept 14; super-PAC reversal Sept 30. Wikipedia 819 -> 3.2K/day. Stratechery + Odd Lots Sept interviews.",
		"estimatedTraffic": "high",
		"searchVolume": "medium",
		"personaTitle": null,
		"addedToQueue": "2026-10-04",
		"retryCount": 0,
		"strategicValue": "artificial-openai-film-cluster"
	},
	{
		"name": "mike-faist",
		"displayName": "Mike Faist",
		"type": null,
		"priority": 91,
		"priorityReason": "East of Eden (Charles Trask) Oct 1; Wikipedia 845/day Jun -> 23K/day Oct 1-3, rising; Globes noms Dec 7.",
		"estimatedTraffic": "medium",
		"searchVolume": "medium",
		"personaTitle": null,
		"addedToQueue": "2026-10-04",
		"retryCount": 0,
		"strategicValue": "east-of-eden-dune-marvel-cluster"
	},
	{
		"name": "sienna-spiro",
		"displayName": "Sienna Spiro",
		"type": null,
		"priority": 90,
		"priorityReason": "VMA Best New Artist Sept 27; NA tour Oct 13-Nov 12; Kalshi #2 for Grammy BNA (noms Nov 16). Wikipedia 4K -> 65.5K peak Sept 28.",
		"estimatedTraffic": "medium",
		"searchVolume": "medium",
		"personaTitle": null,
		"addedToQueue": "2026-10-04",
		"retryCount": 0,
		"strategicValue": "grammy-bna-2027-cluster"
	},
	{
		"name": "ilya-sutskever",
		"displayName": "Ilya Sutskever",
		"type": null,
		"priority": 89,
		"priorityReason": "Played by Yura Borisov in Artificial (NYFF Oct 5, wide Dec 25); SSI-Nvidia deal; TIME100 AI 2026. Deep first-person record (Dwarkesh 2025). Frontier-builder niche.",
		"estimatedTraffic": "high",
		"searchVolume": "medium",
		"personaTitle": null,
		"addedToQueue": "2026-10-04",
		"retryCount": 0,
		"strategicValue": "artificial-openai-film-cluster"
	},
	{
		"name": "ella-beatty",
		"displayName": "Ella Beatty",
		"type": null,
		"priority": 88,
		"priorityReason": "First lead in Monster: The Lizzie Borden Story (Netflix Sept 17, No. 1); Wikipedia 4.8K -> 83K/day Sept 16-30, now ~31K. Past peak - thin long-form record; research must widen sources.",
		"estimatedTraffic": "high",
		"searchVolume": "high",
		"personaTitle": null,
		"addedToQueue": "2026-10-04",
		"retryCount": 0,
		"strategicValue": "netflix-fall-breakout-cluster"
	},
	{
		"name": "christopher-abbott",
		"displayName": "Christopher Abbott",
		"type": null,
		"priority": 87,
		"priorityReason": "Professor X casting (Aug), East of Eden (Adam Trask) Oct 1, baby with Aubrey Plaza (published page - crosslink). Wikipedia 34K/day Oct 1-3.",
		"estimatedTraffic": "medium",
		"searchVolume": "medium",
		"personaTitle": null,
		"addedToQueue": "2026-10-04",
		"retryCount": 0,
		"strategicValue": "east-of-eden-dune-marvel-cluster"
	},
	{
		"name": "dakota-johnson",
		"displayName": "Dakota Johnson",
		"type": null,
		"priority": 86,
		"priorityReason": "Verity Oct 2 + third SNL host Oct 3; direct Google Trends name entry 50K+ (24h and 7d); Wikipedia 6.8K -> 52.8K peak Oct 3. High evergreen demand, thin forward runway.",
		"estimatedTraffic": "high",
		"searchVolume": "high",
		"personaTitle": null,
		"addedToQueue": "2026-10-04",
		"retryCount": 0,
		"strategicValue": "verity-cluster"
	},
	{
		"name": "sombr",
		"displayName": "sombr",
		"type": null,
		"priority": 85,
		"priorityReason": "First arena tour ending at Madison Square Garden Nov 23; VMA tribute Sept 27; possible Grammy noms Nov 16. Wikipedia 5.8K -> 13.9K/day Sept 16-30.",
		"estimatedTraffic": "medium",
		"searchVolume": "medium",
		"personaTitle": null,
		"addedToQueue": "2026-10-04",
		"retryCount": 0,
		"strategicValue": "grammy-bna-2027-cluster"
	},
	{
		"name": "josh-hartnett",
		"displayName": "Josh Hartnett",
		"type": null,
		"priority": 84,
		"priorityReason": "Verity Oct 2 + Below (Netflix) Oct 8; Wikipedia 2.75K -> 39.5K/day Oct 1-3.",
		"estimatedTraffic": "medium",
		"searchVolume": "medium",
		"personaTitle": null,
		"addedToQueue": "2026-10-04",
		"retryCount": 0,
		"strategicValue": "verity-cluster"
	},
	{
		"name": "paapa-essiedu",
		"displayName": "Paapa Essiedu",
		"type": null,
		"priority": 83,
		"priorityReason": "Snape in HBO Harry Potter (premieres Dec 25, weekly into January). Forecast only (baseline 1.2-3.3K/day). Must be live by ~Dec 1 for index runway.",
		"estimatedTraffic": "high",
		"searchVolume": "medium",
		"personaTitle": null,
		"addedToQueue": "2026-10-04",
		"retryCount": 0,
		"strategicValue": "harry-potter-hbo-cluster"
	},
	{
		"name": "olivia-dean",
		"displayName": "Olivia Dean",
		"type": null,
		"priority": 82,
		"priorityReason": "Two Hot 100 top-10s; 2026 BNA winner predicted for Album of the Year (noms Nov 16, show Feb 7). Wikipedia 6-10K/day steady. Oct 1 Withers-publisher suit is an allegation against UMG.",
		"estimatedTraffic": "medium",
		"searchVolume": "medium",
		"personaTitle": null,
		"addedToQueue": "2026-10-04",
		"retryCount": 0,
		"strategicValue": "grammy-bna-2027-cluster"
	}
]
```

## Method / caveats

### Coverage and state checks

- Workflow: `.claude/commands/find-surging-people.md`, full scout (no flags).
- DB via forced-read-only `scripts/db-query.sh`: **584 rows, 450 published, 134 unpublished.** 540 Markdown files in `src/blog/people/drafts/` (includes research/helper files). A 601-slug "covered" set (drafts + DB + every queue array) was used to screen candidates. All CREATE names were absent from it, except **Florence Pugh**, whose DB row exists but is an empty 2025-06-25 placeholder with no local draft.
- Queue: `queue` empty, `inProgress` null, `held` = austin-abrams (89), joseph-zada (88); `failed` includes tom-rhys-harries and lebron-james. Pipeline logs read for Rod Wave (verify-repair hit the 60-turn cap), Arthur Mensch and Madonna (session limit mid-run), Ben Shelton (`completed` / `eligible`).
- A parallel entity-gap scout ran the same day (see memory `project_entity_gap_scout_2026_10_04`) and recommends **Codie Sanchez** and **Shyam Sankar** as CREATEs. Neither overlaps this list. Combine both lists when queueing so the 5/week cap isn't double-booked.
- `git status` before writing: one untracked file belonging to parallel work (`docs/data/gsc/experiments/2026-10-04-entity-gap-check.json`), left untouched. Only this brief was added. No draft, DB row, or queue entry was modified.

### Demand evidence and labels

- **VERIFIED SEARCH:** Google Trends "Trending now", U.S., read in the browser at the **Oct 4, 12:26 a.m.** snapshot. Past 7 days: ~400 of 2,000 rows screened, relevance-sorted, sports filtered out. Past 24 hours: first page of 440. Person-name titles observed: `dakota johnson` 50K+ (both windows), `madonna` 1M+ and `madonna age` 100K+, `jim carrey` 100K+, `anne hathaway` 200K+, `jackie chan` 200K+, `anthony head` 200K+, `gypsy rose` 1M+, `zach bryan` 50K+, `cailee spaeny` 10K+. Cluster titles: `east of eden` 200K+ (breakdown: florence pugh, "east of eden netflix cast") and `verity movie` 200K+ (breakdown: digger, tom cruise). The category filter would not apply, so the full list was screened.
- **Trends Explore (U.S., past 3 months, relative):**
  - Dakota Johnson avg 6, spiking to ~100 on the partial latest day; Florence Pugh avg 5 and rising in October; Fielder spike ~42 on Sept 7; Zada and Abrams near the floor.
  - Rod Wave far above Abrams, Zada, Harries, and Mensch.
  - Relative indices only; no absolute volume claimed.
- **PLATFORM GROWTH (Wikipedia pageviews):** Wikimedia REST API, en.wikipedia, `user` agent (bot-filtered), daily Jun 1–Oct 3, 2026. Script: `scratchpad/pageviews.mjs` (windows: Jun, Aug, Sep 1–15, Sep 16–30, last 7, last 3, peak). Pageviews are a lookup proxy, not search volume. Two music titles (Cameron Winter, Malcolm Todd) didn't resolve to the right article, so their figures come from the research sub-sweep's monthly reads.
- **GSC FIRST-PARTY:** `docs/data/gsc/2026-10-04-page-trends.csv` (monthly) and `2026-10-04-page-query.csv` / `-pages.csv` (90 days, Jul 4–Oct 2). Used for Dario Amodei, Tom Cruise, Mikey Madison, Elizabeth Holmes, Anne Hathaway, Sam Altman, and the politician/athlete prior.
- **CALENDAR FORECAST / NEWS VELOCITY:** three parallel research sub-sweeps (film/TV, music/creators, founders/politics/athletes) plus direct Wikipedia fetches for _Verity_, _East of Eden_, _Artificial_ (2026 film), _Clayface_, Nathan Fielder, Florence Pugh, Joseph Zada, Dakota Johnson, Andrew Garfield, Gypsy-Rose Blanchard, and Anthony Head.
- **Reported, not official:** Anthropic IPO dates (Bloomberg via Yahoo, Oct 2) and the _A Different World_ renewal. The SSI "October announcement" tease is **unverified** (not from an official account).
- **Search-budget limit:** the session's 200 WebSearch calls ran out mid-run. Later verification used direct page fetches, Google News RSS (in the music sweep), and the browser. Paywalled Billboard/Rolling Stone/Variety facts were cross-checked through secondary coverage where possible.

### Key sources

- Trends: [U.S. past 7 days](https://trends.google.com/trending?geo=US&hl=en&hours=168), [U.S. past 24 hours](https://trends.google.com/trending?geo=US&hl=en&hours=24) (live pages; will change).
- Film/TV:
  - [_East of Eden_ (2026 miniseries)](<https://en.wikipedia.org/wiki/East_of_Eden_(2026_miniseries)>) · [Netflix date](https://www.whats-on-netflix.com/news/east-of-eden-netflix-release-date-florence-pugh-first-look/)
  - [_Verity_ (film)](<https://en.wikipedia.org/wiki/Verity_(film)>) · [SNL Oct 3](https://www.nbc.com/nbc-insider/is-snl-new-tonight-october-3-host-musical-guest)
  - [_Artificial_ (2026 film)](<https://en.wikipedia.org/wiki/Artificial_(2026_film)>)
  - [Nathan Fielder / _You Can See Everything_](https://en.wikipedia.org/wiki/Nathan_Fielder) · [_Clayface_](<https://en.wikipedia.org/wiki/Clayface_(film)>)
  - [Ella Beatty Forbes Q&amp;A](https://www.forbes.com/sites/danafeldman/2026/09/18/monster-the-lizzie-borden-story-ella-beatty-on-playing-a-notorious-murder-suspect/) · [Maleah Joi Moon (TheGrio)](https://thegrio.com/2026/09/28/at-24-maleah-joi-moon-has-a-tony-a-grammy-and-netflixs-no-1-show/)
  - [Mike Faist (IndieWire)](https://www.indiewire.com/features/interviews/mike-faist-east-of-eden-choosing-roles-interview-1235218489/) · [Josh Hartnett (NPR)](https://www.npr.org/2026/10/02/nx-s1-5788798/josh-hartnett-reflects-on-verity-and-living-a-much-less-hollywood-existence) · [_Below_ date (Collider)](https://collider.com/josh-hartnett-below-netflix-miniseries-release-date-october-2026/)
  - [Abbott as Professor X (Deadline)](https://deadline.com/2026/08/x-men-christopher-abbott-adam-driver-1237012957/) · [HBO _Harry Potter_ date](https://www.tvinsider.com/1123843/harry-potter-tv-series-2026-premiere-date-cast-plot-details/) · [_I Play Rocky_](https://en.wikipedia.org/wiki/I_Play_Rocky)
- Founders/politics:
  - [Brockman "Astra is AGI" (WaPo)](https://www.washingtonpost.com/technology/2026/09/03/openai-greg-brockman-says-its-new-model-astra-is-agi/) · [Brockman Stratechery interview](https://stratechery.com/2026/an-interview-with-openai-president-greg-brockman-about-astra-and-alignment/) · [super-PAC reversal (Forbes)](https://www.forbes.com/sites/siladityaray/2026/09/30/openai-billionaire-wont-make-pledged-25-million-donation-to-pro-ai-super-pac-after-backlash/)
  - [Anthropic IPO timing (Bloomberg via Yahoo)](https://finance.yahoo.com/markets/stocks/articles/anthropic-targets-pre-thanksgiving-ipo-111436118.html) · [S-1 leak (Fortune)](https://fortune.com/2026/09/29/anthropic-leaked-ipo-prospectus-losses-growth-ai-end-humanity/)
  - [Skydance name / close (Wash. Times)](https://www.washingtontimes.com/news/2026/oct/2/paramount-warner-bros-discovery-merger-gets-name-skydance/) · [Talarico on Rogan #2352](https://podcasts.apple.com/us/podcast/2352-james-talarico/id360084272?i=1000717982651)
- Music:
  - [Lefty tour (Consequence)](https://consequence.net/2026/08/stella-lefty-lefty-live-tour-tickets/) · [Lefty backlash (Rolling Stone)](https://www.rollingstone.com/music/music-features/stella-lefty-song-stealing-nashville-responds-1235625583/) · [BobbyCast #649](https://www.iheart.com/podcast/834-bobby-bones-presents-the-b-27722337/episode/649-stella-lefty-on-boston-339736969/)
  - [Spiro tour (Consequence)](https://consequence.net/2026/06/sienna-spiro-my-house-world-tour/) · [sombr arena tour (Billboard)](https://www.billboard.com/music/pop/sombr-2026-north-american-fall-arena-tour-dates-1236221493/) · [Grammy nominations date](https://www.grammy.com/news/2027-grammys-show-air-date-nominations-announced/)
- Context:
  - [Madonna VMAs (CBS)](https://www.cbsnews.com/news/2026-vmas-highlights-madonna-taylor-swift/) · [_Confessions II_](https://en.wikipedia.org/wiki/Confessions_II) · [Jim Carrey marriage (TMZ)](https://www.tmz.com/2026/09/30/jim-carrey-married/)
  - [Jackie Chan hoax debunk (Gulf News)](https://gulfnews.com/entertainment/jackie-chan-is-alive-fake-1954-2026-death-posts-go-viral-worldwide-1.500691505) · [Gypsy-Rose Blanchard](https://en.wikipedia.org/wiki/Gypsy-Rose_Blanchard) · [Anthony Head](https://en.wikipedia.org/wiki/Anthony_Head)

### Reproducible editorial scores

D = demand trajectory /25; C = catalyst reach /20; N = niche prior /15; R = runway/repeats /15; S = source depth /10; I = person-name intent /10; T = timing /5. These are editorial judgments, not probabilities.

**Niche priors:**

- Measured medians: frontier-builder 15, rising-star 15, alternative 14, newMovieStar 13, big-tech 13, pop-star 12.
- `movieStar` and `screen-icon` are unmeasured in the deep dive, so they get 11.
- Politician and athlete get 4–5, from the GSC evidence above.

| Person / action             |   D |   C |   N |   R |   S |   I |   T | Penalty | Total | Interpretation                     |
| --------------------------- | --: | --: | --: | --: | --: | --: | --: | ------: | ----: | ---------------------------------- |
| Florence Pugh / CREATE      |  24 |  19 |  13 |  15 |  10 |  10 |   5 |       0 |    96 | ACT NOW                            |
| Dario Amodei / UPDATE       |  22 |  20 |  15 |  15 |  10 |   8 |   5 |       0 |    95 | ACT NOW                            |
| Joseph Zada / FINISH        |  20 |  20 |  13 |  15 |   7 |   9 |   5 |       0 |    89 | ACT NOW                            |
| Andrew Garfield / FINISH    |  21 |  18 |  11 |  14 |  10 |   9 |   5 |       0 |    88 | ACT NOW                            |
| Sam Altman / UPDATE         |  15 |  19 |  15 |  14 |  10 |   9 |   4 |       0 |    86 | ACT NOW                            |
| Greg Brockman / CREATE      |  14 |  19 |  15 |  14 |  10 |   8 |   5 |       0 |    85 | ACT NOW                            |
| Stella Lefty / CREATE       |  20 |  17 |  11 |  14 |   9 |  10 |   4 |       0 |    85 | ACT NOW                            |
| Daniela Amodei / CREATE     |  15 |  20 |  15 |  15 |   8 |   6 |   5 |       0 |    84 | ACT NOW                            |
| Nathan Fielder / FINISH     |  20 |  17 |  14 |   9 |  10 |   8 |   4 |       0 |    82 | ACT NOW                            |
| Christopher Abbott / CREATE |  18 |  18 |  12 |  12 |   9 |   9 |   3 |       0 |    81 | ACT NOW                            |
| Maleah Joi Moon / CREATE    |  22 |  15 |  15 |  10 |   6 |   9 |   3 |       0 |    80 | ACT NOW                            |
| Ella Beatty / CREATE        |  21 |  17 |  15 |   9 |   6 |  10 |   2 |       0 |    80 | ACT NOW                            |
| Mike Faist / CREATE         |  22 |  16 |  13 |   9 |   9 |   8 |   3 |       0 |    80 | ACT NOW                            |
| Sienna Spiro / CREATE       |  18 |  15 |  13 |  14 |   7 |   8 |   5 |       0 |    80 | ACT NOW                            |
| Ilya Sutskever / CREATE     |  10 |  18 |  15 |  13 |  10 |   9 |   5 |       0 |    80 | ACT NOW                            |
| Madonna / FINISH            |  22 |  17 |  12 |   8 |  10 |  10 |   2 |       0 |    81 | ACT NOW                            |
| Austin Abrams / FINISH      |  19 |  15 |  13 |  12 |   8 |   8 |   4 |       0 |    79 | QUEUE / PREP                       |
| Josh Hartnett / CREATE      |  21 |  16 |  11 |  10 |   8 |   9 |   4 |       0 |    79 | QUEUE / PREP                       |
| sombr / CREATE              |  17 |  16 |  14 |  12 |   7 |   8 |   4 |       0 |    78 | QUEUE / PREP                       |
| Dakota Johnson / CREATE     |  23 |  15 |  11 |   7 |  10 |  10 |   1 |       0 |    77 | QUEUE / PREP                       |
| Olivia Dean / CREATE        |  12 |  17 |  12 |  14 |   9 |   8 |   5 |       0 |    77 | QUEUE / PREP                       |
| James Talarico / CREATE     |  18 |  17 |   5 |  13 |   9 |  10 |   5 |       0 |    77 | QUEUE / PREP*                      |
| Paapa Essiedu / CREATE      |   8 |  20 |  13 |  14 |   6 |  10 |   5 |       0 |    76 | QUEUE / PREP                       |
| Mikey Madison / UPDATE      |  14 |  16 |  13 |  12 |   9 |   8 |   4 |       0 |    76 | QUEUE / PREP                       |
| Larry Ellison / CREATE      |  13 |  18 |  13 |  10 |   8 |   9 |   4 |       0 |    75 | QUEUE / PREP                       |
| Tom Cruise / UPDATE         |  18 |  17 |  11 |   8 |  10 |   9 |   2 |       0 |    75 | QUEUE / PREP                       |
| Inde Navarrette / FINISH    |  18 |  15 |  13 |   8 |   8 |   9 |   4 |       0 |    75 | QUEUE / PREP                       |
| Ella Langley / UPDATE       |  16 |  16 |   6 |  13 |   9 |   8 |   5 |       0 |    73 | QUEUE / PREP                       |
| Anne Hathaway / UPDATE      |  17 |  15 |  11 |   6 |  10 |   9 |   2 |       0 |    70 | QUEUE / PREP                       |
| Mike Tyson / CREATE         |  12 |  17 |   4 |   9 |  10 |  10 |   4 |       0 |    66 | QUEUE → WATCH*                     |
| Jim Carrey / FINISH         |  18 |  10 |  11 |   6 |  10 |  10 |   2 |       0 |    67 | QUEUE / PREP                       |
| Rod Wave / FINISH           |  15 |  14 |   6 |  10 |   9 |   8 |   2 |       0 |    64 | WATCH (repair)                     |
| Ben Shelton / FINISH        |   6 |  14 |   5 |   9 |   9 |   8 |   2 |       0 |    53 | WATCH (stale release, no portrait) |
| Arthur Mensch / FINISH      |   3 |  15 |  15 |   6 |   9 |   5 |   2 |       0 |    55 | WATCH                              |
| Gypsy-Rose Blanchard / —    |  25 |  12 |   5 |   3 |   6 |  10 |   1 |     −25 |    37 | SKIP                               |
| Jackie Chan / —             |  12 |  10 |  11 |   6 |  10 |  10 |   1 |     −20 |    40 | SKIP (evergreen gap noted)         |

\* Talarico scores 77 on the rubric but ranks last on D × N. First-party GSC shows politician and athlete pages earn almost no search on 9takes. Commission only as a deliberate lane bet. The same applies to Tyson.

Penalties screened: fading/one-day −20, death/health spike −15, thin first-person record −15, exact-name ambiguity −10, allegation-dependent demand −10. Notes:

- **Ella Beatty** and **Summer H. Howell** have thin long-form records but enough to begin research, so no penalty. The research stage must widen sources.
- **Stella Lefty's** demand is not mainly allegation-driven (#2 single, tour), so no penalty. The allegations stay attributed.
- **Entity Gap Audit:** no CREATE was flagged. Every shortlisted name has a personal Wikipedia page. Cameron Winter's searches split with Geese and could be checked via `/find-emerging-entity-gaps` if he advances.

### Next handoff

DJ picks:

1. Which FINISH items to push now. Recommended: Zada, Garfield, Fielder, Madonna. Ben Shelton needs a re-verify first.
2. Which UPDATEs to commission. Recommended: Dario, then Sam Altman after NYFF reviews.
3. Which CREATE entries to append. Recommended: the week-1 tranche.

After that selection, re-read the queue, append without reordering, leave `held`/`inProgress` untouched, and update `lastUpdated`. Existing drafts use finish/update handoffs, never the new-creation queue. Nothing was queued, published, or scheduled by this scout.

## Decisions taken (2026-10-04, DJ)

DJ chose the ambitious version: the AI/_Artificial_ cluster plus the full CREATE tranche.

- **Dario Amodei:** surgical refresh via `/blog_refresh_people` (agent). Local draft only; DB sync awaits DJ approval.
- **Sam Altman:** `/blog_refresh_people` for an _Artificial_ passage (agent). Local only.
- **_Artificial_ hub:** new pop-culture draft, "the real people behind _Artificial_" (agent), `published: false`.
- **Joseph Zada, then Andrew Garfield:** `scripts/run-blog-pipeline.sh <Person> --refresh`, run back to back once the shared pipeline lock is free. Florence Pugh's run (DJ's separate chat) held it at 01:12.
- **Florence Pugh:** written in a separate chat. Not queued, to avoid a duplicate nightly run.
- **Queue:** 14 CREATE entries appended after the Oct 4 02:00 nightly, so that run couldn't launch into the held lock and burn a retry. Order: Daniela Amodei 95, Brockman 94, Sutskever 93, Lefty 92, Moon 91, Spiro 90, Faist 89, Beatty 88, Abbott 87, Essiedu 86, sombr 85, Johnson 84, Hartnett 83, Dean 82. Garfield is excluded (existing draft → finish run, not the creation queue).
- **Publishing gate reminder:** the 6 AM `9takes Blog Content Publish People` job auto-publishes only drafts that pass every gate, including **manual portrait images** (`static/types/<N>s/<Person>.webp` + `s-<Person>.webp`). Zada has no portrait yet; Garfield does (type 4).

### Outcomes (2026-10-04, 07:00)

- **Andrew Garfield:** `--refresh` completed, `eligible`, v3 grade 8.5 (was 8.7 legacy), 4,452 words, covers _Artificial_, release check valid, portraits present. A read-only `readPublishCandidate` shows **0 publish blockers**, so the 6 AM `daily-blog-publisher.sh` should publish it on Oct 5 (NYFF premiere day) unless DJ holds it. Note: a manual `--sync` dry run flags protected-field drift on `type` (live `[movieStar]`, local `[movieStar, celebrity]`); a reviewed `--sync` preserves the live value.
- **Joseph Zada:** `--refresh` **held**, `insufficient_evidence`. Overall 7.9 and enneagram 7 (down from 8.4). The verifier found that Type 6 does not beat 3 or 9 on a non-routine discriminator in the current record (verify-01/02). The held candidate is now in the working draft; the 8.4 version is in git HEAD. Plan: rerun once the _Sunrise on the Reaping_ press tour adds long-form first-person interviews (target rerun ~Oct 27, publish by ~Nov 10). A same-week rerun would face the same record.
- **Dario Amodei / Sam Altman:** local refreshes done (agents). DB sync awaits DJ.
- **_Artificial_ hub:** draft at `src/blog/pop-culture/artificial-movie-real-people.md`, `published: false`.
- **Nightly wrapper fix:** `scripts/nightly-blog-cron.sh` now skips the night when any live PID holds the pipeline lock, instead of charging the selected entry a retry. Codie Sanchez's unearned retry was reset to 0.
