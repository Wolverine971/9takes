---
person: 'Frank-Lloyd-Wright'
audited_at: '2026-08-26'
classification: 'pass'
recommended_action: 'pass'
score: 40
biography_intent: true
personal_wikipedia: true
source_gate: 'pass'
path: docs/content-analysis/entity-gaps/Frank-Lloyd-Wright.md
---

# Emerging Entity Gap Packet: Frank Lloyd Wright

**Headline:** Frank Lloyd Wright is the structural opposite of an Emerging Entity Gap. Demand is real
and durable, the source record is among the deepest in the corpus, and there is a genuinely ownable
thesis — but the exact-name SERP is one of the most thoroughly owned on the biography web. `PASS`
here means "do not spend pipeline cycles acquiring this entity for search," not "the finished draft
is worthless." See **Editorial note** below, which is a separate decision from the entity-gap score.

## Why now

There is a real, dated 2026 catalyst cluster — but note that it drives _building_ searches more than
_person_ searches:

- **Fallingwater reopened for the 2026 tour season** after a three-year, $7.5M preservation project
  ("World Heritage Preserved"), coinciding with the house's **90th anniversary**. The reopening was
  covered by Archinect; the underlying leak problem was covered by Smithsonian, AOL and MSN.
- **Martin House, "Collecting Ourselves"** — opened 27 March 2026, runs to 7 September 2026
  (Wallpaper\*).
- **Storyland Studios × Imagine** announced a major touring immersive Wright exhibition, curated by
  the Taliesin Institute at the Frank Lloyd Wright Foundation under Dr. Jennifer Gray.
- **Scottsdale / Phoenix**: five days of tours and talks, 4–8 November 2026.
- MOWA (Wisconsin) furniture-design exhibition running in the same window.

**Demand is directional, not measured.** No Google Trends or keyword-volume figure was available and
none is asserted. Two independent attention signals: the Fallingwater preservation-and-leak story
carried into national general-interest press (Smithsonian, MSN, AOL), and four separate institutions
are mounting Wright programming in the same calendar year.

**Local GSC demand is zero.** `grep -i "wright"` across `docs/data/gsc/2026-08-13-queries.csv`,
`-pages.csv` and `-page-query.csv` returns nothing, and Frank Lloyd Wright does not appear in
`scripts/emerging-entity-gap-candidates.mjs --limit 40`. That is expected and not a negative signal:
the 9takes row is **unpublished**, so there is no URL to accrue impressions.

**Current 9takes state:** `src/blog/people/drafts/Frank-Lloyd-Wright.md` exists (42,222 bytes,
dated 2026-05-13) and `blogs_famous_people` has a matching row — `person: frank-lloyd-wright`,
`published: f`, `content_chars: 30184`, `published_at: NULL`. There is **no indexed 9takes page**,
so RETROFIT and PROTECT are both structurally unavailable.

## Exact-name SERP map

Checked 2026-08-26, US-only, unpersonalized web search, desktop. Results vary by location, device
and date. **No backlink data was available — treat competitor authority as qualitative, unknown in
absolute terms.**

### `Frank Lloyd Wright`

| Result                                                                                                   | Type                              |
| -------------------------------------------------------------------------------------------------------- | --------------------------------- |
| Frank Lloyd Wright Foundation — `franklloydwright.org` (multiple: `/`, `/work/`, `/frank-lloyd-wright/`) | official org, dedicated biography |
| Frank Lloyd Wright Trust — `flwright.org`                                                                | official org                      |
| Guggenheim — Wright and the Guggenheim                                                                   | institutional, dedicated          |
| Illinois Historic Preservation Division                                                                  | government archive                |
| Phi Delta Theta "Famous Phis"                                                                            | thin directory                    |
| Wikipedia — _Frank Lloyd (disambiguation)_                                                               | knowledge/disambiguation          |

Note: the personal Wikipedia article exists and is the entity anchor — `en.wikipedia.org/wiki/Frank_Lloyd_Wright`,
**Wikidata Q5604** (already in the draft's frontmatter). The disambiguation page surfacing above it in
one sample is a retrieval artifact, not evidence of a weak entity.

### `Frank Lloyd Wright biography`

| Result                                                                        | Type                    |
| ----------------------------------------------------------------------------- | ----------------------- |
| **Britannica** — full dedicated biography                                     | encyclopedic, dedicated |
| Meryle Secrest, _Frank Lloyd Wright: A Biography_ — U. Chicago Press + Amazon | book, authoritative     |
| Frank Lloyd Wright Foundation — About                                         | official, dedicated     |
| Milwaukee Art Museum biography PDF                                            | institutional           |
| UChicago Smart Collection                                                     | institutional           |

### `Frank Lloyd Wright wife`

Wikipedia pages for **Olgivanna Lloyd Wright**, **Mamah Borthwick**, **Eric Lloyd Wright**; NPR;
HISTORY (Taliesin murders); Keiran Murphy (Taliesin historian); Clever Podcast. Fully answered,
including the hard parts.

### `Frank Lloyd Wright` parents / background

Frank Lloyd Wright Foundation ("The God Almighty Lloyd Joneses"), Wikipedia (Jenkin Lloyd Jones),
Unity Chapel, Keiran Murphy, U. Michigan student project, Fandom. Fully answered.

### `Frank Lloyd Wright personality` — **the one soft SERP**

| Result                                                               | Type                       |
| -------------------------------------------------------------------- | -------------------------- |
| Common Edge — legacy essay                                           | opinion essay              |
| EBSCO Research Starters                                              | reference summary          |
| National Trust — "Where Does Frank Lloyd Wright's Genius Come From?" | institutional essay        |
| TheArtStory                                                          | reference                  |
| Psychology Today — "Anatomy of an Egotist"                           | psychology blog, one angle |
| The Geographical Cure — "A Modern Day Henry VIII"                    | travel blog                |
| House Digest — "The Untold Truth Of…"                                | content-farm listicle      |
| ArchDaily quotes roundup                                             | quotes page                |

No single page owns "what was Frank Lloyd Wright actually like, and why." It is split between an
institutional-hagiography lane and a he-was-a-narcissist lane.

### `Frank Lloyd Wright enneagram type` — **the genuinely open lane**

| Result                                                                                             | Type                                           | Verdict                                        |
| -------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- |
| So Syncd                                                                                           | thin typology aggregator                       | **types him 5w4**, no evidence                 |
| Sakinorva `dm.sakinorva.net`                                                                       | crowd-vote database                            | no argument                                    |
| MBTI Lounge                                                                                        | thin aggregator                                | no argument                                    |
| Typology Central forum thread                                                                      | forum                                          | no argument                                    |
| **Enneagram Monthly** — Tim Vreeland, "The Life and Work of a Self-preservation Seven," 8 Jul 2024 | substantive essay                              | **types him a self-pres 7 — and is PAYWALLED** |
| Remainder of page 1                                                                                | Wikipedia pages for individual Wright _houses_ | name-collision noise                           |

### The five questions

1. **How many top-ten results are dedicated, substantial biographies?** For `biography`: at least
   four (Britannica, Secrest's book, the Foundation, the MAM PDF). This is a saturated SERP.
2. **Personal Wikipedia page?** **Yes** — Q5604, plus separate articles for both surviving wives,
   his mistress, several children, and dozens of individual buildings.
3. **Does a strong publisher own general biography intent?** Yes, several: Britannica, two official
   foundations, Guggenheim, Fallingwater, National Trust, PBS/Ken Burns.
4. **Would a reader still need multiple searches?** For biography, no. For _"why was he like that,
   and what does it add up to"_ — **yes**. That question currently returns a Psychology Today post,
   a travel blog, and a paywall.
5. **Can 9takes offer the strongest general-interest page?** **No.** It can offer the strongest free
   page on one narrow sub-question. Those are very different claims.

## Biography-intent map

**Core identity** — who he was, why he matters, Fallingwater / Guggenheim / Prairie Style / Usonian.
_Verdict: fully served elsewhere. Cover briefly for orientation; do not compete._

**Life and career** — Welsh Lloyd Jones family and Anna's prophecy; Adler & Sullivan and the 1893
firing over the bootleg Harlan House; Oak Park and the Prairie years; the 1909 departure with Mamah
Borthwick; the 1914 Taliesin murders; the fallow 1920s; the Mann Act charge; the 1932 autobiography
and Taliesin Fellowship; Fallingwater (1935–37); the Guggenheim (commissioned 1943, opened October
1959, posthumously). _Verdict: served by Britannica and the Foundation, but this is the spine our
argument needs. Carry it as evidence, not as a resume._

**Fact queries** — all answerable from the record:

| Query           | Sourced answer                                                                                                                                                                      |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Born / died     | 8 June 1867, Richland Center, Wisconsin; died 9 April 1959, Phoenix, Arizona                                                                                                        |
| Wives           | Three: Catherine "Kitty" Tobin (m. 1889), Miriam Noel, Olgivanna Lazović (met Nov 1924, m. 1928)                                                                                    |
| Mamah Borthwick | Not a wife — the partner murdered at Taliesin in 1914                                                                                                                               |
| Parents         | William Cary Wright (1825–1904), preacher/musician/itinerant lawyer; Anna Lloyd Jones (b. 1838/39, d. 1923), Welsh-born schoolteacher; separated when Wright was ~14, divorced 1885 |
| Name change     | Born Frank **Lincoln** Wright; changed his middle name to Lloyd for his mother's family                                                                                             |
| Buildings       | ~1,114 designs, 532 realized (Foundation's figure). Britannica gives ~800/380 — **cite whichever you use and note the discrepancy; do not silently pick one**                       |
| UNESCO          | Eight buildings inscribed in 2019                                                                                                                                                   |

**Do not add** net worth, height, or any relationship claim beyond the documented three marriages and
Mamah Borthwick. There is no defensible sourcing for a Wright net-worth figure and the celebrity-SEO
version of that query should go unanswered.

## Source inventory

**Source gate: PASS**, comfortably. Wright is among the best-documented subjects the pipeline will
ever touch.

_First-person (≥2 required):_

- _An Autobiography_ (1932, rev. 1943) — the primary self-mythologizing text, and itself evidence
- _A Testament_ (1957)
- **Mike Wallace ABC interviews, filmed 1 and 28 September 1957** — Wright at ninety; excerpts
  hosted by the Foundation at `franklloydwright.org/a-man-100-years-ahead-of-his-time-excerpts-from-the-mike-wallace-interview/`
  (already in the draft's citations). This is the load-bearing first-person source.

_Named third-party (≥2 required):_

- Meryle Secrest, _Frank Lloyd Wright: A Biography_ (University of Chicago Press)
- Brendan Gill, _Many Masks_
- Ada Louise Huxtable, _Frank Lloyd Wright: A Life_
- Keiran Murphy — Taliesin historian, independently published research
- Herbert "Hib" Johnson — the Wingspread leak exchange, 1937
- Philip Johnson — the "greatest architect of the nineteenth century" jab

_Current source tied to the catalyst:_

- Smithsonian, "Fallingwater's Roof Is Leaking. Can This $7 Million Renovation Protect Frank Lloyd
  Wright's Masterpiece?"; Archinect on the reopening.

_Signature contradiction:_ documented and unusually clean — the man who spent seventy years insisting
he was the greatest architect alive told Mike Wallace, on camera at ninety, that the arrogance was a
shell. That is a first-person admission, not an inference.

## Protected strengths (existing pages only)

**Not applicable — no published 9takes page.** For the unpublished draft, these passages are the
asset and should survive any revision: the Wallace brittle-shell exchange, the Wingspread "move your
chair" reply, the two-hour Fallingwater drawing after nine months of procrastination, the curtains-
cut-into-handkerchiefs detail, and the Philip Johnson jab answered rather than dodged.

## Content requirements

If this is ever published, the page must be built for the **typology and "why was he like that"**
lane, not the biography lane:

1. **H1 stays the plain person name.** SEO title carries the falsifiable thesis — the existing
   `meta_title` ("Why Frank Lloyd Wright Could Never Stop Performing His Genius") already does this.
2. **Rebut Type 5 explicitly. This is the single biggest gap in the current draft.** The draft
   defeats a Type 4 reading (line 272) but never addresses Type 5 — and 5w4 is what _every free
   aggregator on page one_ says. A reader who searches the type and lands on us will arrive holding
   the 5w4 answer. Add a short, named "why not a Five" passage: the Five withdraws to conserve
   energy and hoards competence privately; Wright spent seventy years converting every collapse into
   a public performance and founded a school so people would pay to be near him. Failing to name
   the competing reading reads as not knowing it exists.
3. **Do not expand toward general biography.** Britannica and the Foundation have that. Every
   paragraph of resume displaces a paragraph of argument and pushes the draft toward the 4,500-word
   ceiling for nothing.
4. **Keep the fact queries in FAQ metadata and prose**, answered in one or two sentences with a
   source — enough that a reader does not bounce, not enough to become a fact farm.
5. **Lead with orientation.** Assume a reader who knows "Fallingwater guy" and nothing else.
6. **Cite the Vreeland corroboration.** Enneagram Monthly's Tim Vreeland independently reached
   Type 7 self-preservation in July 2024. Our draft's FAQ already asserts 7w8 self-pres. Citing a
   paywalled independent expert who reached the same subtype is a real credibility asset against the
   free aggregators' unevidenced 5w4 — and honest, since we cannot read the paywalled argument.
7. Canonical `https://9takes.com/personality-analysis/frank-lloyd-wright`, citations, author
   identity, and `same_as` entity links are already correct in the draft's frontmatter.

## Claims to avoid or qualify

- **"World's greatest architect" under oath.** The courtroom-testimony anecdote is repeated
  everywhere and sourced almost nowhere. If used, attribute it as a widely-repeated anecdote, not as
  a court record. The draft currently uses the _sentiment_ in narration (lines 173–175) rather than
  the anecdote — keep it that way.
- **"That's how you can tell it's a roof."** Circulating as a stock Wright line without a firm
  primary source. The **Wingspread / "move your chair"** exchange with Hib Johnson is far better
  attested — the draft correctly uses that one. Do not add the other.
- **Building counts.** 1,114 designed / 532 built (Foundation) vs ~800 / ~380 (Britannica). Pick one,
  attribute it, and do not present either as settled.
- **Narcissism and psychopathy.** Psychology Today, a ResearchGate first draft, and a narcissism
  podcast all diagnose Wright at a distance. Do **not** import clinical labels. Enneagram type is a
  pattern claim; NPD is a diagnosis, and we are not qualified to make one about a man dead since 1959.
- **Anna's "prophecy."** The story that Anna Lloyd Jones declared before his birth that her son would
  be a great architect and hung engravings in his nursery comes substantially from Wright's own
  autobiography — a text whose whole subject is self-mythology. The draft's line 220 handles this
  well. Keep the framing that this is what Wright _said_, and that the saying is itself the evidence.
- **Fallingwater's $7M renovation is about leaks, not collapse.** Do not imply structural failure.
- **Mamah Borthwick's murder** (1914, seven dead) must be handled as documented history, not
  true-crime color.

## Baseline and 28-day prediction (existing pages only)

**Not applicable.** No published page, no GSC baseline, no prediction. If the draft is ever
published, capture the pre-publication state — currently zero exact-name impressions — and measure at
28 and 56 days, separating exact-name demand, position and CTR.

## Scorecard and caveats

| Dimension                                                                 |             Score | Evidence                                                                                                                                                                                                                             |
| ------------------------------------------------------------------------- | ----------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Demand trajectory                                                         |             13/20 | Evergreen name plus four dated 2026 catalysts (Fallingwater 90th + reopening, Martin House to 7 Sep, Nov Scottsdale, Storyland/Imagine). Docked: catalysts point at buildings more than at the person, and local GSC demand is zero. |
| Exact-name SERP weakness                                                  |          **2/25** | Wikipedia + Britannica + two official foundations + Guggenheim + Fallingwater + National Trust + PBS. Among the most thoroughly owned biography SERPs the pipeline will encounter.                                                   |
| Biography-intent breadth                                                  |             11/15 | Real, verified query families across identity, life/career and facts — all of them already answered authoritatively by someone else.                                                                                                 |
| Source depth                                                              |         **15/15** | Autobiography, _A Testament_, the 1957 Wallace interviews; Secrest, Gill, Huxtable, Murphy; Smithsonian on the current catalyst.                                                                                                     |
| 9takes angle and niche fit                                                |              9/10 | Clean first-person contradiction (the brittle-shell admission) plus an un-owned typology lane where the only substantive competitor is paywalled. Historical-artist is a niche that performs.                                        |
| Timing / index advantage                                                  |              5/10 | Draft is complete and the Fallingwater season runs through 2026 — but nothing is indexed, so there is no refresh advantage to exploit.                                                                                               |
| Entity clarity                                                            |               5/5 | Effectively unambiguous; Frank Lloyd (director) and Frank Wright are already disambiguated by Google.                                                                                                                                |
| **Subtotal**                                                              |            **60** |                                                                                                                                                                                                                                      |
| Penalty: personal Wikipedia + several authoritative dedicated biographies |           **−20** | Applies unambiguously.                                                                                                                                                                                                               |
| **Total**                                                                 | **40/100 — PASS** |                                                                                                                                                                                                                                      |

Penalties considered and **not** applied: attention peaked (demand is evergreen and durable);
inadequate source trail (the opposite); name ambiguity (none); gossip-only intent (the affair and the
Taliesin murders are documented history, responsibly answerable).

### Editorial note — separate from the entity-gap score

`PASS` is the correct entity-gap verdict and the arithmetic was not bent to avoid it. It means: **do
not prioritize Frank Lloyd Wright as a search-acquisition target.** 9takes cannot become the
biography of record for a man with a personal Wikipedia page, two official foundations and a
Britannica entry.

It does **not** mean the finished 42KB draft should be discarded. That draft was written before this
audit and its actual value is corpus and cluster value, not entity capture: a defensible, contrarian
Type 7w8 argument in a lane where the free web offers only unevidenced 5w4 aggregator entries and one
paywalled essay that independently agrees with us. Its realistic ceiling is the long tail — the
typology and "why was he like that" queries — not `frank lloyd wright`.

**Recommendation for DJ:** publishing is a cheap, low-risk call since the draft is already complete
and the source gate passes — but do the Type 5 rebuttal first (Content requirement #2), because
shipping a 7w8 thesis that never mentions the 5w4 consensus is the one way this page loses an
argument it should win. Do not queue new research cycles, and do not let the entity-gap score justify
promoting Wright above genuinely gap-shaped candidates in `backlog-queue.json`.

### Caveats

- Search checked 2026-08-26, US-only, desktop, unpersonalized. Results vary by location, device,
  personalization and date.
- No Google Trends values, keyword volumes, result counts or backlink data are asserted anywhere in
  this packet. Demand is labelled directional and the evidence for it is named.
- The Enneagram Monthly / Vreeland Type 7 corroboration is drawn from the article's **title and
  visible preview only**; the full argument is paywalled and was not read.
- The prefilter (`scripts/emerging-entity-gap-candidates.mjs`) returns local signals only and cannot
  see the live SERP. Its silence on Wright reflects the unpublished page, not SERP conditions.
