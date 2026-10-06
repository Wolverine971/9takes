<!-- docs/content-strategy/2026-10-05-ahrefs-flagged-page-review.md -->

# Ahrefs-flagged page review (2026-10-05)

The Ahrefs crawl of 2026-10-05 flagged 25 content pages under "Organic traffic dropped" or "Pages
dropped from Top 10". Seven read-only research agents fact-checked each page against current sources
and checked real Search Console data (`docs/data/gsc/2026-10-04-page-trends.csv`,
`docs/data/gsc/2026-10-04-page-query.csv`; the query window is 2026-07-04 to 10-02).

This file is the fix spec. Every error lists the claim, the correction and a source. Items marked
**unverified** were not confirmed (several agents ran out of web searches) and need a second look
before anyone writes them as fact or deletes them.

## What we learned

1. **Ahrefs' drop flags are mostly noise.** Ahrefs traffic is a model. In GSC, 17 of the 25 pages are
   flat or growing; several "drops" are pages crossing position 10 and back. Real declines: Paris
   Hilton (Q3 impressions 3,772 → 269 year over year), Aubrey Plaza (Jul–Sep clicks 81 → 9 year over
   year), Jennifer Lopez (position 5–6 → 9–10 since March), toxic-traits (clicks 61–71/mo → 16–30/mo
   on steady impressions: a CTR problem), Khloé (impressions fell, but clicks never exceeded 3/mo),
   Kara Swisher (small: 13 → 4 clicks Aug → Sep).
2. **The real finding is accuracy: 23 of 25 pages have at least one verified factual error.** The
   errors cluster into classes that will recur across all 451 profiles:
   - Ages written as numbers go stale (Tom Cruise "62" ×5, Arnold "77", J.Lo "56", Khloé's kids).
     Write birth years instead.
   - "Upcoming" phrasing outlives the event (Margot Robbie's _Wuthering Heights_, released 2026-02-13).
   - Quotes paraphrased inside quote marks, or credited to the wrong outlet.
   - Internal contradictions (a date in the body vs. the FAQ vs. the timeline box).
   - Childhood causes stated as certain (Kardashian, Jackie Kennedy, Hugh Jackman), against the
     hedging rule.
3. **Searchers type "<name> personality" / "personality type", and many titles and metas never say
   it** (J.Lo, Hugh Jackman, Bob Dylan, the Kardashian post; Denzel and Tom Cruise metas never name
   the type). Hold title changes until the Jordi identity-first title test reads out (~2026-11-01),
   then batch them using the identity-first pattern ("<Name>'s Personality: <hook>").

## Time-sensitive

| Page                                                | Deadline          | Why                                                       |
| --------------------------------------------------- | ----------------- | --------------------------------------------------------- |
| `/pop-culture/kardashian-family-enneagram-analysis` | 2026-10-08        | _The Kardashians_ season 8 premieres                      |
| `/personality-analysis/tom-cruise`                  | now               | _Digger_ opened 2026-10-02 (his worst opening since 2007) |
| `/personality-analysis/jennifer-lawrence`           | 2026-11-20        | _Sunrise on the Reaping_ opens                            |
| `/personality-analysis/kara-swisher`                | before 2026-12-31 | Her CNN exit takes effect                                 |

## Ranked fix list

| #   | Page                                 | Verdict                   | Real search decline?                                   |
| --- | ------------------------------------ | ------------------------- | ------------------------------------------------------ |
| 1   | kardashian-family-enneagram-analysis | Needs fixes               | No (impressions 633 → 2,072, May–Sep)                  |
| 2   | tom-cruise                           | Needs fixes               | No (growing: 2,436 impressions / 15 clicks in 90 days) |
| 3   | jennifer-lopez                       | Needs fixes               | Yes                                                    |
| 4   | stephen-hawking                      | Needs fixes + visible bug | No (never had clicks)                                  |
| 5   | jackie-kennedy                       | Needs fixes (most errors) | No                                                     |
| 6   | aubrey-plaza                         | Needs fixes               | Yes                                                    |
| 7   | kara-swisher                         | Needs fixes               | Small                                                  |
| 8   | paris-hilton                         | Needs fixes               | Yes (the one collapse)                                 |
| 9   | khloe-kardashian                     | Needs fixes               | Impressions only                                       |
| 10  | hugh-jackman                         | Needs fixes               | Post-peak decay                                        |
| 11  | corpus-stats                         | Needs fixes (code)        | No                                                     |
| 12  | leila-hormozi                        | Needs fixes               | No (growing)                                           |
| 13  | denzel-washington                    | Needs fixes               | No                                                     |
| 14  | arnold-schwarzenegger                | Needs fixes               | No                                                     |
| 15  | lex-fridman                          | Needs fixes               | No                                                     |
| 16  | love-languages-and-enneagram-types   | Light refresh             | No (impressions rising; intent mismatch)               |
| 17  | type hubs 3 / 5 / 9                  | Light refresh (template)  | No                                                     |
| 18  | bob-dylan                            | Needs fixes (small)       | Impressions fading, rank fine                          |
| 19  | rachel-mcadams                       | Needs fixes (low stakes)  | No (new page)                                          |
| 20  | margot-robbie                        | Light refresh             | News-cycle decay                                       |
| 21  | matthew-mcconaughey                  | Needs fixes (small)       | No                                                     |
| 22  | jennifer-lawrence                    | Light refresh             | Recovering                                             |
| 23  | michael-seibel                       | Needs fixes (low traffic) | No (2 clicks/mo all year)                              |
| 24  | toxic-traits-of-each-enneagram-type  | OK; re-read GSC ~11-01    | CTR decline                                            |

People drafts live in `src/blog/people/drafts/<First-Last>.md`; agents confirmed every draft matches
the live page, so every error below is in both. Sync with `pnpm push:people -- <Person> --sync`
(never `--publish`; never edit `lastmod`).

---

## Pop culture and blogs

### kardashian-family-enneagram-analysis — Needs fixes before 2026-10-08

File: `src/blog/pop-culture/kardashian-family-enneagram-analysis.md`

Errors:

- L183 "leaving four teenagers" → the children were 24, 22, 19 and 16 when Robert Sr. died.
  https://en.wikipedia.org/wiki/Kardashian_family
- L377 "placed on camera at ten" → Kendall was 11 at the 2007-10-14 premiere (Kylie was 10).
- L232 "SKIMS valuation $4 billion (2023)" → $5B (Nov 2025).
  https://www.cnbc.com/2025/11/12/skims-5-billion-valuation-funding-round.html
- L235 "KKW Beauty sale $200 million to Coty" → Coty bought a 20% stake for $200M, then sold it to
  SKIMS for $74M in March 2025.
  https://money.usnews.com/investing/news/articles/2025-03-21/coty-sells-its-stake-in-kim-kardashians-beauty-brand-to-skims
- L225 heading "Law Student" → Kim finished her apprenticeship in 2025, failed the July 2025 bar and
  is skipping 2026. https://abovethelaw.com/2026/05/kim-kardashian-esq-delayed-till-at-least-2027/
- L399 "most-followed woman" → Kylie (~391M) is second to Selena Gomez (~415M).
  https://greyjournal.net/play/entertainment/top-10-most-followed-women-on-instagram-in-the-world-2026/
- L233 "360+ million" → trackers show 343M–364M; use "about 350 million".
- L381 Kendall had the "fewest appearances of any sibling" → unverified, and the Rob section (L333)
  contradicts it.

Risk:

- L159 and L202 state that Kris saw a distribution opportunity in the sex tape as fact. It is
  contested, and Kris and Kim sued Ray J for defamation over related claims on 2025-10-01.
  https://ktla.com/entertainment/kim-kardashian-kris-jenner-sue-ray-j-for-defamation-over-rico-claims/
- Childhood causes stated as certain at L181, L187, L401, L418, L553, L561. Hedge them.
- L161 eating-disorder causation has no source.
- The FAQ says there is no Type 5 in the family (L555) but types Caitlyn as "3 or 5" (L585).

Missing (add a "Where they are in 2026" section):

- Season 8 premieres 2026-10-08, with Kim hospitalized for esophagitis.
  https://deadline.com/2026/09/the-kardashians-season-8-release-date-trailer-1237106720/
- Kim has been dating Lewis Hamilton since early 2026.
  https://www.nbclosangeles.com/entertainment/entertainment-news/lewis-hamilton-kim-kardashian-monaco-grand-prix/3901763/
- Kim's Hulu drama _All's Fair_, her aneurysm disclosure, and her Paris robbery trial testimony.
  https://en.wikipedia.org/wiki/Kim_Kardashian
- Kourtney's marriage to Travis Barker and their son Rocky; Barker is a counterexample to the "curse"
  section.
- Rob's rare season 7 appearance. https://www.today.com/popculture/tv/rob-kardashian-now-rcna240719

Search: queries are per person ("kim kardashian personality type" 40 at 9.5, "kris jenner personality
type" 33 at 7.9); the title has no names and no "personality type". Proposed meta_title: "Kardashian
Personality Types: Kim, Kris & Family Enneagram" (58). Description, once the 2026 section ships: "Kim
and Kris read as Type 3s, Kourtney a 1, Khloé a 2, Kendall a 6, Kylie and Rob 9s. The pattern behind
each, updated for The Kardashians season 8." (148)

Unverified (search budget ran out): Kylie Cosmetics' $600M deal; the date Travis Scott and Kylie split.

### love-languages-and-enneagram-types — Light refresh

File: `src/blog/enneagram/love-languages-and-enneagram-types.md`

- L43 cites Egbert & Polk (2006) as failing to confirm Chapman's "one primary language" claim. That
  study tested whether the five categories hold up as separate factors. The primary-language finding
  is Flicker, Sancier-Barbosa & Impett (2025): fewer than half had an identifiable primary language,
  and 7–10 categories fit better than five. https://pubmed.ncbi.nlm.nih.gov/40977357/ (the sibling
  `what-is-a-love-language.md` L205/L217/L224 already gets this right).
- L435 Type 2 request "Tell me you appreciate what I do" contradicts L145 and the matrix at L395.
- L573 "not just how to love each other, but _why_" is a soft return of the banned how/why split.
  Rephrase as "same language, different motive".
- The vignettes at L151, L230, L321 and the L474 claim that these pairings "come up in coaching
  conversations more than any others" can't be verified (0 coaching sessions as of 09-18). DJ to
  confirm, or label them as composites.

Search: impressions rising (Apr 370 → Sep 2,262) at position 8–11, 0–4 clicks a month. About 90% of
impressions are generic "what is love language in a relationship" (939 at 7.9), which the new sibling
`/enneagram-corner/what-is-a-love-language` (live 10-03) targets. Expect this page's impressions to
fall as the sibling ranks; that is intended. Don't retitle toward the generic query. GSC does not
back the "highest-traffic" label: 8 clicks in 90 days vs 75 for toxic-traits.

Recommended: meta_title "Enneagram Love Languages: What Each of the 9 Types Needs" (56); description
"Same love language, different motive. See the love language each Enneagram type often leans on, how
they give love, and which gestures land or misfire." (151). The current title is 79 characters and
the description 164 (truncated). Add a one-line link to the sibling page above the opening.

### toxic-traits-of-each-enneagram-type — OK; re-read GSC around 2026-11-01

- L70 and L415 "Research has not linked any type to Dark Triad traits" → reword to "we found no
  peer-reviewed study".
- L31, L52, L403 "health level predicts the damage better than type" reads like a research finding;
  say "matters more than".
- CTR began falling in Dec 2025 (1.41%), months before the 2026-05-07 title change, so the 10-03
  title fix alone may not restore it. No post-fix GSC data yet.

---

## Type hubs and corpus stats (code fixes)

### Type hub template (`src/routes/personality-analysis/type/[slug]/`) — covers type/3, type/5, type/9

Counts, links (164 profiles + 34 internal, all 200), images and every profile's typing all check out.

- **T1:** the FAQ JSON-LD "dominant lane" (`+page.svelte:305`) names the most over-represented
  domain, not the most common. Type 3 says Tech, actually Film & TV (27/81). Type 5 says Authors &
  Thinkers, actually Tech (19/38). Type 9 says Comedians, actually Film & TV (26/45). "How rare is
  Type N" never gives a share or rank.
- **T2:** the list sorts newest first (`+page.server.ts:41`), so the first row and the FAQ "famous
  Type Ns" answer show recent additions (N3on, Jynxzi, Alexandr Wang) while Taylor Swift is #77 of
  81, Einstein #12 of 38 and Obama #37 of 45. Lead with the best-known 8–12, ranked by profile clicks
  or Wikipedia pageviews, and feed the FAQ from the same list.
- **T3:** the stat callout says "Type 3 · n=80", where 80 is the Tech category size, not the 81
  Type 3s.
- **T4:** "More analyses of Type N coming soon" (`+page.svelte:490`) on pages listing 38–81 people.

Search: type/3 clicks 4 → 8 → 12 (Jul–Sep), position 11.1 → 7.7; type/5 3 → 7 → 11, position
39 → 9.0; type/9 7 → 20 → 9 (August was the outlier; 15-month median ≈7). The issue is CTR on
celebrity queries (about 1,100 impressions → 2 clicks on type/3). Title test idea: "81 Famous
Enneagram 3s: Type 3 Celebrities, Analyzed", with a meta that names Taylor Swift, Tom Cruise, Kim
Kardashian and Dwayne Johnson.

### corpus-stats — Needs fixes

The "451" title is correct (451 published rows, 451 distinct people; per-type counts match).

- Hand-written percentages in `src/lib/components/marketing/CorpusStatsComparisonSection.svelte:100-120`
  contradict the live table: Type 9 says 9.2% and "one of the least-represented" (live 10.0%, 6th of
  9); Type 6 says 9.6% (live 12.0%); Type 1 says 7.2% (6.4%); Type 8 says 11.9% (10.6%); Type 7 says
  14.3% (13.8%); Type 3 says "near 20%" (18.0%). Replace them with the live values the component
  already computes.
- "Drafts in pipeline: 0" is a bug: `scripts/generate-corpus-stats.js:28,44` uses the public key,
  and RLS returns published rows only. The DB has 134 unpublished rows (84 with >2,000 characters).
  The FAQ at `src/routes/corpus-stats/+page.server.ts:158` repeats the 0. Hide the tile, or compute
  drafts with the service key.
- "Type 2 is the rarest at 6.4%": Types 1 and 2 tie at 29 (`+page.server.ts:101`, `+page.svelte:90`).
- "Type 5 consistently rare" (L258) contradicts the page's own Truity column (Type 5 10% > Type 7 9%).
- Causal lines stated as fact (the Type 3, 8 and 6 notes; FAQ `+page.server.ts:152` "the gap reflects
  sample bias") never mention editor-typing bias. Rewrite them as hypotheses.

---

## Personality profiles

### tom-cruise — Needs fixes

- "at 62" ×5 (an H2, the TL;DR, body, FAQ) → 64 (born 1962-07-03). Rename the H2.
- "Across seven Mission: Impossible films" → eight.
- "the real issue wasn't the Scientology controversies" → Redstone publicly cited Cruise's conduct.
  Present it as interpretation or cut it. https://en.wikipedia.org/wiki/Tom_Cruise
- Final Reckoning: best franchise domestic opening ($64.0M), but about $598M worldwide on a reported
  ~$400M budget, below Fallout's $791M.
  https://www.the-numbers.com/movie/Mission-Impossible-The-Final-Reckoning-(2025)
- Missing: the honorary Oscar (2025-11-16), "Making films is not what I do, it is who I am"
  https://variety.com/2025/awards/news/tom-cruise-honorary-oscar-speech-1236583348/ ; _Digger_ opened
  2026-10-02 to about $8M domestic / $20M worldwide on $160–180M
  https://variety.com/2026/film/box-office/digger-box-office-majorly-bombs-verity-scores-1236898521/ ;
  Top Gun 3 in development and Days of Thunder 2 dated 2028-06-02
  https://variety.com/2026/film/news/anne-hathaway-tom-cruise-days-of-thunder-sequel-1236839347/ ;
  Suri is legally "Noelle" (July 2026)
  https://www.foxnews.com/entertainment/tom-cruise-katie-holmes-daughter-suri-legally-changes-famous-last-name
- Unverified: the $149M Maverick backend, 17 mph, "295 runs in 44 films".
- Search: growing. Meta never says "Type 3"; add it.

### jennifer-lopez — Needs fixes (real decline)

- FAQ "the Vegas dance studio she slept on at 18" → a Manhattan studio (Ballet Hispánico).
  https://www.rte.ie/entertainment/2013/0710/461603-lopez-reveals-she-was-homeless-as-a-teenager/
- "Michael Apted, seven-time Oscar nominee" → Apted was never nominated; _Coal Miner's Daughter_ got
  seven nominations. https://en.wikipedia.org/wiki/Coal_Miner%27s_Daughter_(film)
- "seven Razzie nominations" → _Gigli_ got 9 nominations and 6 wins, including Lopez for Worst
  Actress. https://en.wikipedia.org/wiki/24th_Golden_Raspberry_Awards
- "married in 2022, divorced in 2024" → the judge approved it 2025-01-06; effective 2025-02-21.
  https://www.hollywoodreporter.com/lifestyle/lifestyle-news/jennifer-lopez-ben-affleck-officially-divorced-1236144537/
- "She's 56 now" → 57. Use the birth year.
- "In March 2026, launching a new Las Vegas residency" → it ran 2025-12-30 to 2026-03-28.
  https://en.wikipedia.org/wiki/Jennifer_Lopez:_Up_All_Night_Live_in_Las_Vegas
- The timeline says the first Affleck engagement ended in 2003; the body says 2004.
- Missing: _Kiss of the Spider Woman_ ($1.8M gross on $30M, no Oscar nomination)
  https://en.wikipedia.org/wiki/Kiss_of_the_Spider_Woman_(2025_film) ; the twins turned 18 and left
  for college (fits the "alone for the first time" ending); _Office Romance_ (Netflix, 2026-06-05).
- Unverified: the "On the Floor" sales claim, the "billion Google searches" study, the 2007 demands
  list, "six-picture deals".
- Search: Dec–Feb 1,566–1,775 impressions/mo at position 5–6.4; now position ~9–10. Top query
  "jennifer lopez personality" (336). The title lacks "personality" and "J.Lo". Add a 2–3 sentence
  traits answer near the top. Merge the two FAQ blocks.

### stephen-hawking — Needs fixes + visible bug

- **Bug:** the TL;DR shows a raw Markdown link `[Albert Einstein](/personality-analysis/albert-einstein)`,
  and claims the "same wing" (5w6), but the live Einstein page types him 5w4. Drop the comparison.
  (Draft line 158.)
- "An eccentric Oxford household" → Highgate, then St Albans from 1950.
  https://en.wikipedia.org/wiki/Stephen_Hawking
- "With his sister Mary… one of his own design called Risk" → board games with school friends; Risk
  is commercial.
- "They got engaged the following year" → October 1964.
- "For thirty years she was his physical caregiver" / "thirty years inside that room" → married 1965,
  separated 1990, about 25 years. https://en.wikipedia.org/wiki/Jane_Hawking
- "Thirty-five years signing his initials with a single eye-twitch" → hand switch until 2005, then
  cheek control. It also contradicts the page's own "cheek-twitch" line.
- "Years before Elon Musk made it a cause" → both warned about AI in 2014–15.
- "At 21, decided…" → he left Oxford at 20.
- Unverified: post-diagnosis "drinking" (Hawking reportedly called it exaggerated), the Geneva
  tracheotomy, the 1976 Prince Charles story, the Dirac quote wording, Jane's "four partners" quote,
  "emperor/puppeteer", both Lucy quotes, "a PPE first" for his mother.
- Search: about 950 impressions at position 11 and 0 clicks for "stephen hawking before als" and
  variants. Add an answer-first H2 + FAQ "What was Stephen Hawking like before ALS?" (born 1942,
  Oxford 1959–62, coxed the crew, met Jane 1962, diagnosed 1963 at 21) and a short traits list. The
  page is filed under "Politics"; recategorize.

### jackie-kennedy — Needs fixes (most errors)

- "The Thursday she walked off Air Force One" → 1963-11-22 was a Friday.
- "Procession from the Capitol to St. Matthew's" → she walked from the White House.
  https://en.wikipedia.org/wiki/State_funeral_of_John_F._Kennedy
- "Quietly arranged to be his third birthday" → the funeral fell on John Jr.'s birthday (born
  1960-11-25). https://en.wikipedia.org/wiki/John_F._Kennedy_Jr.
- White "was forty-seven" → 48 (born May 1915).
- "Edited Carly Simon's autobiography" → Simon's children's books.
  https://www.aarp.org/entertainment/celebrities/carly-simon-on-her-pal-jackie-o-interview-2019/
- "Diana Vreeland's memoir" → _Allure_ (1980), a photo book.
  https://www.anothermag.com/fashion-beauty/8989/reflecting-on-diana-vreelands-cult-book-allure
- "In 1975… a fifty-nine-story tower" → proposed 1968–69 at 55 stories; 1975 is when a court voided
  the landmark status. https://en.wikipedia.org/wiki/Grand_Central_Tower
- "Caroline has extended the embargo once" (×3) → no evidence; the 2103 date comes from her 2003 deed
  of gift. https://wwd.com/pop-culture/celebrity-news/feature/jackie-kennedy-pink-suit-1237052750/
- "Forty years after her death" → 32 (died 1994).
- "Executive Office Building" and "twenty-four hours" → Bethesda Naval Hospital that night.
  https://en.wikipedia.org/wiki/Autopsy_of_John_F._Kennedy
- "Khrushchev… in their own languages" → she didn't speak Russian.
- The "outsider in the WASP social circle" line is quoted as hers but is Wikipedia's paraphrase.
- Sources disagree (pick one and cite): TV-tour viewers 46M vs 56M; salary $25 vs $42.50 a week.
- Missing: credit Taraborrelli's 2023 _Jackie: Public, Private, Secret_ (the page's central quote and
  title come from it) https://en.wikipedia.org/wiki/Jackie_-_Public,_Private,_Secret ; FX's _Love
  Story_ (Feb–Mar 2026, Naomi Watts); granddaughter Tatiana Schlossberg died 2025-12-30.
- Hedge "This is how a Four is made" and the TL;DR "divorce… taught her".

### aubrey-plaza — Needs fixes (real decline)

- "Hillary Duff" (×3) → Hilary Duff.
- "five films: … and the series Cinema Toast" → four films and one series.
- Missing fact: the medical examiner reported she and Jeff Baena had been separated since September 2024. https://abcnews.com/GMA/Culture/jeff-baena-aubrey-plaza-separated-months-prior-baenas/story?id=119967830
  Add one neutral sentence; the current framing reads as if they were together.
- Missing: with Christopher Abbott; pregnancy confirmed 2026-04-07, daughter born late July 2026
  https://playbill.com/article/aubrey-plaza-and-christopher-abbott-have-welcomed-their-first-child-together ;
  _The Accompanist_ premiered at Tribeca 2026-06-04.
- Search: Jul–Sep 2025 81 clicks / 8.5k impressions at ~5.5 → Jul–Sep 2026 9 / 1.8k at 8.2–8.9. Meta
  opens with the stroke, not the answer; lead with "counterphobic Enneagram 6". Add FAQs "Is Aubrey
  Plaza nice?" and "Why is she so weird?" (no ADHD/autism speculation).

### kara-swisher — Needs fixes

- "They have a daughter together, born in 2019" → Swisher and Amanda Katz have two children; Swisher
  has four in all. https://en.wikipedia.org/wiki/Kara_Swisher
- "She was 49" at the stroke → 48 (October 2011; born 1962-12-11). Most coverage calls it a
  "mini-stroke". http://www.huffingtonpost.com/2011/10/19/kara-swisher-stroke_n_1019427.html
- "Each move was… toward platforms she owned outright" → overstated: sold Recode to Vox (2015), NYT
  (2018–22), CNN contributor since 2023.
- Missing: asked to be released from her CNN contract (ends 12-31) rather than work for the Ellisons
  https://barrettmedia.com/2026/09/23/kara-swisher-asks-cnn-release-her/ ; CNN series _Kara Swisher
  Wants to Live Forever_ (spring 2026)
  https://variety.com/2026/tv/news/kara-swisher-cnn-documentary-longevity-anti-aging-1236644503/ ;
  her 2022 "11 years later, I still fear another" tweet; _The Devil Wears Prada 2_ cameo.
- Search: nearly all demand is "kara swisher amanda katz age difference". Google already sends it to
  the #stroke jump link because the marriage paragraph sits under the stroke heading. Move it under a
  new H2 "Kara Swisher's Marriages: Megan Smith and Amanda Katz" with a direct answer (married
  2020-10-03; two children; Katz's birth date isn't public, so the ~20-year gap is an estimate).
  Rename the current "Love Life" heading (it's about _Burn Book_).

### paris-hilton — Needs fixes (the one collapse)

- "Dax Shepard's podcast in 2024" (×2) → aired 2023-04-30. https://armchairexpertpod.com/pods/paris-hilton
- "the memoir in 2024" → published 2023-03-14.
  https://www.npr.org/2023/03/18/1163964122/paris-hilton-book-memoir-interview
- "the 2004 sex tape leak" / "The Simple Life was already running" → surfaced late 2003, weeks before
  the 2003-12-02 premiere. https://en.wikipedia.org/wiki/The_Simple_Life
- "Baron Hilton, founder of Hilton Hotels" → Barron; the founder was his father Conrad.
  https://en.wikipedia.org/wiki/Barron_Hilton (exact quote wording unverified).
- Missing: DEFIANCE Act push at the Capitol, 2026-01-22 ("People called it a scandal. It wasn't. It
  was abuse.") https://19thnews.org/2026/01/paris-hilton-aoc-deepfakes/ ; _Infinite Icon: A Visual
  Memoir_ (2026-01-30); Malibu home burned January 2025; married Carter Reum (November 2021).
- Search: Q3 2025 3,772 impressions / 14 clicks → Q3 2026 269 / 0. Position held at ~8–12, so the
  page lost queries, not rank; the lost queries predate our export. Rewrite the deepfake section
  around the DEFIANCE Act.

### khloe-kardashian — Needs fixes

- "She was twenty-four" (several times) → 25; met September 2009, married 2009-09-27.
  https://www.aol.com/articles/inside-lamar-odom-khlo-kardashians-220000480.html
- "married nine days later" → about a month after meeting; nine days was engagement to wedding.
- "Six weeks" → about eight weeks. https://en.wikipedia.org/wiki/Robert_Kardashian
- "in March 2021, Tristan fathered a child" → conceived March 2021; Theo born 2021-12-01.
- "Tatum is now three" → 4. "a four-year-old" (True) → 8. "forty-one years" → 42. Use birth years.
- Missing: _Untold: The Death & Life of Lamar Odom_ (2026-03-31) and the fallout, both sides (her
  "I feel so dumb… I'm not paid one penny"; his July denial)
  https://www.eonline.com/news/1433778/lamar-odom-clarifies-khloe-kardashian-marriage-comments ; her
  January 2026 words on dating ("so safe… so scary to get back in there")
  https://www.realitytea.com/2026/01/29/khloe-kardashian-dating-scary-tough-world-podcast/
  (replace "three years deliberately alone").

### hugh-jackman — Needs fixes

- "Christopher Jackman raised five children alone" → Hugh and two brothers; the sisters went to
  England with their mother (the page says so earlier). https://en.wikipedia.org/wiki/Hugh_Jackman
- The intro puts the "betrayal" statement in September 2023 → separation 2023, the statement May 2025.
  https://extratv.com/2025/05/28/hugh-jackman-s-ex-deborra-lee-furness-speaks-out-on-betrayal-after-filing-for-divorce/
- "He makes his own coffee and his wife's tea" (present tense) → divorce granted 2025-06-03.
  https://abcnews.com/GMA/Culture/hugh-jackman-deborra-lee-furness-finalize-divorce-after/story?id=123167993
- The Guinness record has been beaten; say "once held".
- Unverified: "He was twenty-seven. She was forty." (birthdates suggest 26 and 39 in 1995).
- Missing: _Song Sung Blue_ (Dec 2025; Kate Hudson Oscar-nominated)
  https://en.wikipedia.org/wiki/Song_Sung_Blue_(2025_film) ; _The Sheep Detectives_ (May 2026,
  $132.9M). Leave out the tabloid Sutton Foster engagement reports.
- Hedge the childhood causation ("The warmth has a source", the "decided…" ending). The page is
  missing the standard disclaimer. Title/meta lack "personality" and the type.

### leila-hormozi — Needs fixes

- "Leila didn't escalate at 19" → the suicide attempt was at 15 (the page's own timeline).
- The FAQ says she graduated in 2014 and moved "the following year"; the body says the day after
  graduating. Acquisition.com dates her fitness career to 2015.
  https://www.acquisition.com/team/bio-leila-2
- The CEO-transition quote is paraphrased in quote marks. Reported wording: "When one person tries to
  hold both the present and the future of a company, neither gets their full attention."
  https://enterprisezone.cc/leila-hormozi-transitions-to-executive-chairwoman-role-at-acquisition-com/
- The blog post is titled "What's Rising Reveals" (2026-01-05); "multiple surgeries" and "lawsuits"
  aren't in it. https://leilahormozi.com/p/what-rising-reveals
- Guinness credits the record to Alex, not both.
  https://www.guinnessworldrecords.com/world-records/78599-fastest-selling-non-fiction-book
- Revenue conflicts: $200M / $250M+ on the page vs "$85M+ yearly" in her official bio.
- **Unverified and risky:** the Glassdoor drop (4.9 → 2.2), the HR-director leak, "41 hires in a
  quarter". The only search hit was 9takes itself. Source or cut.
- Missing: expecting their first baby (PEOPLE, 2026-05-22)
  https://www.aol.com/articles/acquisition-founders-alex-leila-hormozi-160000000.html ; signed with
  CAA (2026-05-20); Executive Chairwoman as of 2026-03-16; "Persian (Iranian-American)" answers a top
  query.

### denzel-washington — Needs fixes

- "three days before his seventieth birthday" (×3) → baptized 2024-12-21, a week before 12-28.
  https://www.tmz.com/2024/12/22/denzel-washington-baptized-receives-ministers-license/
- "Ethan Hawke, asked about losing the Oscar to Denzel" → Hawke lost Supporting to Jim Broadbent.
  https://variety.com/2024/film/news/denzel-washington-ethan-hawke-lose-oscar-training-day-1235983929/
- "Hannibal with Steve McQueen" → Hannibal is Antoine Fuqua's Netflix film; McQueen is separate.
  https://www.indiewire.com/news/breaking-news/denzel-washington-star-antoine-fuqua-hannibal-netflix-1234925862/
- "Century Cycle… for HBO" → Netflix. https://www.netflix.com/tudum/articles/august-wilson-plays-films-explained
- "In 2013, when Denzel was fifty-nine" → drop the year; Esquire says he quit at 60.
- Unverified: "God put me on this planet to preach", the Viola "making a living, not a life" quote,
  "30–40% improvised".
- Missing: Presidential Medal of Freedom (2025-01-04); _Gladiator II_; _Here Comes the Flood_ moved
  to 2027; _Black Panther 3_ dated 2028-12-15.
- Meta never names "Enneagram 8"; the 8w9 wing only appears in the FAQ/JSON-LD.

### arnold-schwarzenegger — Needs fixes

- "At 77" (×2) → 79 (born 1947-07-30).
- "33%, lower than the governor he'd replaced" (body + FAQ) → Davis was ~22% when recalled; Arnold
  left at 23%. https://en.wikipedia.org/wiki/Arnold_Schwarzenegger
- "After leaving office, he championed redistricting" → he backed Prop 11 (2008) and Prop 20 (2010)
  as governor. https://en.wikipedia.org/wiki/Governorship_of_Arnold_Schwarzenegger
- "three open-heart surgeries" → open-heart in 1997 and 2018 plus a 2020 valve procedure; soften.
- **Unverified and high risk:** "I had others" (other affairs). Primary source or cut. Also
  unverified: "highest-paid actor of the 1990s".
- Missing: led the opposition to Prop 50, which passed with 64.4% on 2025-11-04
  https://en.wikipedia.org/wiki/2025_California_Proposition_50 ; FUBAR canceled after season 2; _The
  Man with the Bag_ (Prime Video, 2026-12-02).

### lex-fridman — Needs fixes

- "walked away from a paid academic post" → his MIT role became unpaid after 2019 and he is still a
  research scientist at LIDS. https://en.wikipedia.org/wiki/Lex_Fridman
- "His Ph.D. work… machine learning for robotics" → behavioral biometrics for identity
  authentication (2014).
- "launched a lecture series… 'The Artificial Intelligence Podcast'" → a podcast from the start.
- "Episode #3 of his podcast" → "Lex Solo #3" (2020-09-07); episode #3 was Steven Pinker.
  https://lexfridman.com/feed/podcast/
- The "January 2025" opener says he had already interviewed Modi; the episode was 2025-03-16.
- Unverified: the CJR article "titled 'The Idiot'", the CJR "threat to journalism" line, the
  Atlantic's "tech-world whisperer", the "Charles River" run (he lives in Texas).
- Missing: episode #500 (Khabib, Aug 2026), Jensen Huang (Mar 2026), Pavel Durov (Oct 2025); birth
  date 1983-08-15.

### bob-dylan — Needs fixes (small)

- "He answered by playing louder" (TL;DR, body, FAQ schema) → at Newport he came back acoustic with
  "It's All Over Now, Baby Blue"; "play it loud" was Manchester 1966.
  https://www.setlist.fm/setlist/bob-dylan/1965/festival-field-newport-ri-3bd7b098.html
- "What fans named the Never Ending Tour" → named by journalist Adrian Deevoy (1989); 3,700+ shows.
  https://en.wikipedia.org/wiki/Never_Ending_Tour
- Unverified: the epigraph credited to _I'm Not There_ (the film opens with Kristofferson narration).
- Minor: he collected the Nobel privately in Stockholm, April 2017.
- Missing: Rough and Rowdy Ways tour ended 2026-05-01 after 303 shows; Bootleg Series Vol. 18 (Oct
  2025); Dylan's own "believable as me. Or a younger me" post; his denial that _Blood on the Tracks_ is
  autobiographical (pair with the Jakob quote).

### rachel-mcadams — Needs fixes (low stakes)

- "$2.5 billion" (body + FAQ) → about $2.16B (616 + 585 + 398 + 326 + 230 million).
- The "split personality" quote isn't in the 2023 Bustle interview; it's from an older interview.
- "Acting doesn't feel easy" was said to CBS News, not Bustle.
  https://www.cbsnews.com/news/rachel-mcadams-talks-are-you-there-god-its-me-margaret/
- York graduation in 2001 at 22, not 23.
- _Mary Jane_ runs 1h35–1h40, not ninety minutes.
- "Mcadams" capitalization in the H1, FAQ heading and JSON-LD.
- Missing: _2034_ (Netflix); _The Families Stone_ shooting this fall.

### margot-robbie — Light refresh

- No verified errors.
- _Wuthering Heights_ is still written as upcoming. It came out 2026-02-13 and grossed $241.7M on
  $80M, with mixed reviews (RT 57%) and Heathcliff casting criticism.
  https://en.wikipedia.org/wiki/Wuthering_Heights_(2026_film) Rewrite that section, the TL;DR and the
  FAQ in past tense.
- Missing: _A Big Bold Beautiful Journey_ flopped ($20.2M); the _Ocean's_ prequel with Bradley
  Cooper (June 2027).
- The meta description is truncated; trim to ≤155 characters.

### matthew-mcconaughey — Needs fixes (small)

- "when Matthew was twenty-three" → 22 (father died 1992-08-17).
- "studying law at the University of Texas" → Radio-Television-Film undergrad who had planned on law
  school.
- "returned to film in 2025 with The Lost Bus… first live-action role in six years" → _The Rivals of
  Amziah King_ came first (SXSW, March 2025).
- The timeline contradicts itself (opening says "In 2011… twenty months" of silence, elsewhere "two
  months after"; _The Lincoln Lawyer_ came out 2011-03-18). In his telling the drought came first and
  the offer after.
- "romantic comedy" → he calls it an action-comedy.
- The Oscar-speech quote is shortened but presented as verbatim; check against the transcript.
- Unverified: the bongo arrest plea, "45 more times", RateMyProfessors 5.0.
- Missing: _Poems & Prayers_ (2025-09-16); voice/likeness trademarks against AI misuse.
- "matthew mcconaughey mbti" sits at position 4.7 with 0 clicks; the page never mentions MBTI.

### jennifer-lawrence — Light refresh (before 2026-11-20)

- No errors that matter. Minor: born in Louisville; the page says Indian Hills (where she grew up).
- The body says "As of August 2026"; change it and add: joined Instagram 2026-09-09
  https://www.yahoo.com/entertainment/celebrity/articles/jennifer-lawrence-joins-instagram-warns-191500676.html ;
  cast in Zach Cregger's _The Flood_ (2028-08-11); _One Month Mark_ with Gene Stupnitsky directing;
  Golden Globe nomination for _Die My Love_. Update the "working on" FAQ.

### michael-seibel — Needs fixes (low traffic)

- "In 2026, he is in Washington" / "By September 2025… in Washington helping Promise… software for
  criminal-justice systems" → no source. The documented event was a 2025-07-17 fireside chat in
  Oakland, and Promise helps people "access government services".
  https://promise-pay-5332344.hs-sites-na2.com/engineering-for-real-impact Rewrite the ending from
  verified facts only.
- "keeps doing office hours" → "I retired from Y Combinator in 2026." https://www.michaelseibel.com/
- "In January 2023, YC named Garry Tan" → announced 2022-08-29.
  https://techcrunch.com/2022/08/29/garry-tan-is-the-next-president-and-ceo-of-y-combinator
- Slips: "thirteen years" vs 12; "He was 30" in 2014 (he was 31).
- Missing: board seats at Reddit, Dropbox (since Dec 2020) and Kalshi. Soften the meta's "built
  Twitch and ran YC": he co-founded Justin.tv and led YC's accelerator.

## Site-wide notes

- None of the three blog posts outputs the FAQPage structured data present in its source (low
  priority, site-wide).
- No page raised a typing question. Type and wing are consistent across title, meta, body, FAQ and
  JSON-LD everywhere, except the Hawking TL;DR's wrong claim about Einstein's wing.
