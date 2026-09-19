---
person: 'Elizabeth-Holmes'
audited_at: '2026-09-19'
classification: 'pass'
recommended_action: 'retrofit'
score: 41
biography_intent: true
personal_wikipedia: true
source_gate: 'pass'
existing_page: 'https://9takes.com/personality-analysis/elizabeth-holmes'
retrofit_scope: 'factual correction plus personality lane; no biography expansion'
retrofit_applied_at: null
do_not_optimize: false
next_demand_event: '2026-10-16'
path: docs/content-analysis/entity-gaps/Elizabeth-Holmes.md
---

# Emerging Entity Gap Packet: Elizabeth Holmes

**Verdict: PASS as an Emerging Entity Gap (41/100). Action: a scoped RETROFIT, which the 2026-09-09
refresh draft already contains and which should ship before the October 16 theatrical release.**

Elizabeth Holmes fails the Wikipedia gate as hard as any subject can. She has a full personal article, a
second Wikipedia article just for her trial, a Britannica biography, a Biography.com page updated for the
documentary, IMDb, and a DOJ case page. 9takes cannot become her biography of record and should not
try. The documentary catalyst is real and growing, but it drives traffic to an entity the web has
covered thoroughly since 2015.

The action is `retrofit` for one reason the rubric names explicitly: **the live page has factual and
source problems.** Those are listed below. The retrofit is limited to correcting facts and running the
personality analysis. It is not a license to add biography sections.

Written by pipeline stage 0.5 inside `run-blog-pipeline.sh Elizabeth-Holmes --legacy --resume`
(log dir `docs/content-analysis/pipeline-logs/2026-09-19_170138_Elizabeth-Holmes/`). This supersedes
the `entity_gap_packet_missing` limitation recorded in the 2026-09-09 refresh ledger.

## Ship state and live-page defects (verified 2026-09-19)

| Check                        | Finding                                                                                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Packet `retrofit_applied_at` | None existed before this run. Set to `null`.                                                                                                     |
| Git                          | Refresh committed (`0d658bf74` "content: refresh Elizabeth Holmes personality profile", then `02b469175`). Working tree clean for the draft.     |
| Draft `production_pretext`   | `status: blocked`, `ready_for_production: false`. Blockers: pipeline approval, fresh grades, six-perspective review.                             |
| Live DB row                  | **Still the May version.** `lastmod 2026-05-07`, `meta_title` "The Real Reason Elizabeth Holmes Couldn't Stop Performing", 21,631 content chars. |

The refresh exists in git but **has not reached the database.** Readers currently get the May text,
which contains these defects:

1. **Wrong release date.** Live text: "current Bureau of Prisons projected release: late 2032." The BOP
   locator showed **February 22, 2030** on 2026-09-09 (direct observation in
   `docs/content-analysis/research/Elizabeth-Holmes-legal-independent-2026-09-09.md`). Several results
   in today's searches repeat that date, including Yahoo's "When does she get out?" explainer. (Search
   summaries blended sources, so the date is not attributed here to any other single outlet.) The
   draft is correct.
2. **Relationship stated as marriage.** Live text: "She had a husband, William "Billy" Evans." In her
   February 2025 PEOPLE prison interview, Holmes said they had not officially married ("Maybe we'll get
   married someday. But our bond is more than a piece of paper," as quoted in TV Insider and
   HollywoodLife coverage; people.com could not be fetched from this session). Evans is a private third
   party. The draft calls him Billy Evans, with no marital label. Keep it that way.
3. **Claims about her inner life stated as fact.** Live text: "There was no Elizabeth underneath the
   costume." The live meta description asks "Why is there nothing left of Elizabeth Holmes when the
   costume comes off?" The 09-09 refresh cut these claims as unknowable. That is the documented reason
   the refresh had to **rewrite the page's central argument rather than make small fixes**, which the
   refresh rule allows only when the packet records that the old argument was wrong. This packet
   records that.
4. **Unverified current claim.** Live text: "She has begun warning the public, from prison, about an
   imminent AI-driven privacy apocalypse." The refresh rejected it as unverified tier-3 material. Her X
   account says "Mostly my words, posted by others," so even real posts cannot safely be attributed to
   her as authorship.
5. **Loss figure without qualification.** Live text: "defrauded investors out of more than $700
   million." She was convicted on specific counts, and restitution was set at about $452M. The draft uses
   the narrower framing from the verdict. Keep it.

Rewriting the page carries almost no ranking risk, because nothing is ranking. In more than four months
the page has earned **0 clicks** (see baseline). Protecting the live wording is not a consideration.

## Why now

- **Premiere:** _You Can See Everything_ (Nathan Fielder and Lance Oppenheim, A24) premiered at a secret
  Telluride screening on **Sunday, September 6, 2026**. Many articles are dated September 7; that is the
  coverage date, not the screening date.
- **Theatrical release:** **October 16, 2026** per Wikipedia's film article, Iowa Public Radio (09-11),
  Yahoo (09-15), ANI (09-18) and NBC San Diego. [A24's film page](https://a24films.com/films/you-can-see-everything)
  **still lists "2026 (TBD)" on 2026-09-19**. A24's teaser says October. Attribute the 16th to the
  reporting, or use "October."
- **Reviews are out:** Hollywood Reporter, Variety, IndieWire, Deadline, RogerEbert.com, The Playlist,
  Iowa Public Radio. Several frame the film's question as what makes Holmes tick. That is the
  personality question, raised by the press, one month before a wide release.
- **Filmmaker testimony about the partner:** at the Telluride Q&A, per Vanity Fair via
  [Oxygen, 09-08](https://www.oxygen.com/crime-news/elizabeth-holmes-boyfriend-nathan-fielder-disagreed-over-documentary),
  Fielder said "Billy was trying to exert, we felt, a lot of control over the process."
- **Image and clemency activity:** [Yahoo, 09-15](https://www.yahoo.com/news/us/articles/elizabeth-holmes-just-posted-prison-184814062.html)
  reports that her X account (reactivated August 2025, bio "Mostly my words, posted by others") posted a
  2019 glamour selfie captioned "The answer to every challenge lies in your heart." Forbes reports that
  the account posts pro-Trump content and clemency appeals. The DOJ lists a 2025 commutation petition
  as pending (checked 09-09).
- **Search demand:** on 2026-09-09 an independent researcher observed a Google Trends US "Trending Now"
  cluster for the name: 1M+ bucket, +1,000%, with related queries including "who is elizabeth holmes"
  and "nathan fielder elizabeth holmes." That observation was **not re-verified today.** It is a
  bucket for the whole cluster, not a count of searches.
- **Trajectory:** rising into a second, likely larger wave at the October 16 release, and possibly
  sustained if the film enters awards coverage. This is renewed demand for a well-known person. She is
  not newly emerging.

## Exact-name SERP map

Method: live WebSearch run on 2026-09-19 for `Elizabeth Holmes`, `Elizabeth Holmes biography`,
`Elizabeth Holmes age parents background`, `Elizabeth Holmes husband Billy Evans married children`,
`where is Elizabeth Holmes now net worth`, `Elizabeth Holmes now 2026 documentary release date prison`,
`Elizabeth Holmes personality type enneagram`, and a voice query. The tool returns grouped results, not
a ranked, unpersonalized Google top ten, so **positions and top-ten counts are unknown and must not be
stated.** Backlinks: unknown.

| Result type                   | Examples observed                                                                                                                                                            | Implication                                                                        |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Personal Wikipedia            | [Elizabeth Holmes](https://en.wikipedia.org/wiki/Elizabeth_Holmes) plus [Trial of Elizabeth Holmes](https://en.wikipedia.org/wiki/Trial_of_Elizabeth_Holmes), Simple English | **Gate failed.** Birth date, named parents, Stanford, career, personal life.       |
| Dedicated reputable biography | [Britannica Money](https://www.britannica.com/money/Elizabeth-Holmes), [Biography.com](https://www.biography.com/business-leaders/elizabeth-holmes) (updated for the film)   | General biography intent is fully covered.                                         |
| Official/government record    | [DOJ case page](https://www.justice.gov/usao-ndca/us-v-elizabeth-holmes-et-al), sentencing release, BOP locator                                                              | Custody and legal facts are answered at the source.                                |
| Database                      | IMDb name and bio pages, Forbes profile                                                                                                                                      | Covers fact queries.                                                               |
| Social                        | Instagram @eholmes (ownership not verified here), X account posted "by others"                                                                                               | No need to cite.                                                                   |
| News about one event          | Newsweek (whereabouts), ABC/GMA explainer, Fox Business, Today, Yahoo                                                                                                        | Heavy coverage of the documentary wave.                                            |
| Film coverage                 | [Film Wikipedia](https://en.wikipedia.org/wiki/You_Can_See_Everything), reviews listed above                                                                                 | The film is well covered.                                                          |
| Thin or generated pages       | feaforall, ifann, infotopbio, bollywoodshaadis, gazettedirect, usprisonguide, houseandwhips, usahousinginformation, legalunitedstates, truenorthbrief, poptvculture          | Mostly net worth, "husband," and "is she in jail." A warning sign, not an opening. |
| Name collision                | Elizabeth Holmes (writer), Betty Holmes, FamilySearch 1776/1875 records on the "age parents" query                                                                           | Minor. The Theranos founder dominates.                                             |

**Personality-type SERP (9takes' real lane):** sakinorva, two Personality Database profiles (one for
the Hulu _Dropout_ character), Boo, Upbuild ("Type 3 with 4 Wing"), mbtilounge, and two blogspot spam
pages. **None is an evidence-based analysis.** They are crowd votes or unsourced trait lists. 9takes
shows up at an average position of about 9.4 for `elizabeth holmes personality type`, the only query
where it has measurable visibility. This is the winnable lane.

Required answers:

1. Substantial dedicated biographies in a ranked top ten: **not measurable with this tool.** At least
   three (Wikipedia, Britannica, Biography.com) are clearly present, plus a separate trial article.
2. Personal Wikipedia: **yes.**
3. Does a strong publisher own general biography intent? **Yes, completely.**
4. Would a reader still need more searches? For facts, no. For **"what makes her tick / is she ever
   being real,"** yes. That is the question the documentary asks, and no result on the page answers it
   with evidence.
5. Can 9takes offer the strongest general-interest page? **No.** It can offer the strongest
   evidence-based **personality** page, a lane currently held by crowd-typing sites.

## Biography-intent map

| Family        | Query                                | Reliable answer                                                                                          | 9takes treatment                                                                               |
| ------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Core identity | who is Elizabeth Holmes              | Theranos founder, convicted in 2022 of investor fraud (DOJ)                                              | Opening already does this. Keep.                                                               |
| Core identity | elizabeth holmes documentary         | _You Can See Everything_, Fielder/Oppenheim, A24; Telluride 09-06; October release                       | Already a section and an FAQ. Update the "as of" date at ship time.                            |
| Core identity | nathan fielder elizabeth holmes      | Same                                                                                                     | Covered by the documentary section.                                                            |
| Life/career   | parents, background, Houston move    | Wikipedia and New Yorker 2014 name her parents and the move                                              | Draft uses the family's "greatness" story. Do not add a parents biography.                     |
| Life/career   | Sunny Balwani                        | Trial testimony (NPR 2021), his denial, separate verdicts                                                | Draft section is well qualified. Keep.                                                         |
| Life/career   | voice real or fake                   | Disputed: Carreyrou's account, the 2023 Chozick profile, family counterclaim (TMZ, weak)                 | Draft section is well qualified. Keep. See the NYT caveat below.                               |
| Fact query    | where is she now / release date      | FPC Bryan; BOP projection 2030-02-22, subject to change                                                  | FAQ present. **Re-check BOP on ship day.**                                                     |
| Fact query    | married / husband / partner          | Not officially married, per Holmes (February 2025)                                                       | Use "partner Billy Evans" if a label is needed. No marriage FAQ; the query is gossip-adjacent. |
| Fact query    | children                             | Two children, born 2021 and 2023                                                                         | Mention only as the draft does. **Never name the children.**                                   |
| Fact query    | age                                  | Born 1984-02-03 (Wikipedia/Wikidata)                                                                     | Frontmatter `birth_date` already feeds the schema. No prose needed.                            |
| Fact query    | net worth                            | No reliable figure. Farms derive "-$226M" from restitution arithmetic                                    | **Do not answer.** Restitution (~$452M) may appear only as a court fact.                       |
| Fact query    | pardon / clemency                    | DOJ: commutation petition pending (checked 09-01/09-09); LA Times reported a pardon campaign in Dec 2025 | FAQ present. No odds or intent.                                                                |
| Personality   | personality type / enneagram         | Interpretive                                                                                             | **The product.** Answer early (the draft's 56-word answer block does).                         |
| Personality   | "is she lying" / "always being real" | Interpretive; teaser exchange 09-06; reviewers' readings                                                 | The page's thesis. Attribute any review claim.                                                 |

## Source inventory

Source gate: **pass, easily.**

- **First-person (well over 2):** New Yorker profile by Auletta (2014); Glamour interview (2015); SEC
  testimony (2017, via ABC 2019); trial testimony (Nov 2021, NPR); NYT profile by Chozick (May 2023);
  PEOPLE prison interview (Feb 2025); A24 teaser exchange "You're being real right now?" / "I'm always
  being real" (09-06-2026).
- **Named third parties (well over 2):** Tyler Shultz (ABC 2019, CBS 2022), Avie Tevanian (ABC 2019),
  Phyllis Gardner (Vanity Fair 2016), Henry Kissinger (TIME 2015), Roger Parloff (Fortune 2015), John
  Carreyrou (_Bad Blood_, WSJ), Judge Davila's Sept 2022 order, the Ninth Circuit opinion (Dec 2025),
  Nathan Fielder's Telluride Q&A (09-06-2026).
- **Current, tied to the catalyst:** A24 page and teaser, TheWrap (09-06/09-07), Oxygen/Vanity Fair
  (09-08), reviews (09-07 onward), Yahoo/Forbes on the X account (09-15).
- **Signature contradiction:** a founder who describes her whole manner as sincerity ("I'm always being
  real"), against a court record of investor deception after she received internal warnings (the
  Nov 2014 "disaster zone" text, left out of the Murdoch binder). The draft's thesis, that she turned
  personal credibility into technical trust, is ownable and fits the documentary's question.

Access limits this session: people.com and rogerebert.com returned blocked/403. Hollywood Reporter
and IndieWire redirect to tollbit paywalls. nytimes.com is not fetchable. Use syndicated copies
(Yahoo/AOL) or search-snippet text for review quotes, and mark them as such.

## Protected strengths (existing page)

There is no ranking to protect. What is worth protecting is the **09-09 refresh draft**, not the live
text:

- URL `/personality-analysis/elizabeth-holmes` and the displayed name "Elizabeth Holmes."
- **Keep the Enneagram head term in `meta_title`** ("Elizabeth Holmes: Enneagram Type 3 and the Cost of
  Belief"). Biography intent is owned elsewhere, so a biography-first title would compete where 9takes
  cannot win and give up the one query where it can. **No `head_term_exception`.**
- The central argument (borrowed authority; personal credibility converted into technical trust;
  protecting the promise after contradicting evidence arrived).
- The careful handling of the Balwani allegations, the voice dispute, and the difference between the
  verdict and her acquittals.
- The dated custody and clemency facts sourced to BOP and DOJ.
- The answer block, the FAQ set, and the documentary section with its attribution limits.

## Content requirements (for the remaining resume stages)

1. **Ship before October 16.** Timing is the biggest lever on this page. The refresh has been blocked
   since 09-09. Crawl and index lag means shipping in September matters more than any further wording
   polish.
2. **Refresh the dated facts on ship day:** BOP projection (currently 2030-02-22), DOJ clemency status,
   and A24's release field. The draft's "as of September 9" wording will be stale. If A24 still shows
   TBD, write "in theaters in October (reported as October 16)" with attribution.
3. **Link the film in the first screen.** Readers arriving from the October wave will be asking about
   the film. The TL;DR mentions it, but the opening paragraphs do not. One sourced sentence connecting
   the film's question to the page's thesis is allowed. Fresh-eyes should judge whether it helps; do
   not add a news roundup.
4. **Reviews may now be cited, with attribution.** The draft's line that it has not watched the full
   film must stay true. Reviewers' readings (for example, that she "lies to herself") are opinion. Cite
   them as the reviewer's view, never as fact about her mind.
5. **Fielder on Evans (tier-2 candidate).** "Billy was trying to exert, we felt, a lot of control over
   the process" is on-record testimony from a named director about the filming process. It can
   complicate the Balwani/control thread only if it deepens the analysis. It must not become an
   assessment of Evans as a person.
6. **The X account (tier-3 by default).** Authorship is explicitly shared ("posted by others"). Admit
   it only if the refresh can make a claim about managing her image that holds without assuming she
   wrote the post.
7. **Keep the partner wording as the draft has it.** No "husband," no "wife," no names for the
   children.
8. **Do not add a biography section** (parents, Stanford timeline, net worth, age). Other pages cover
   all of it.

## Claims to avoid or qualify

| Claim                                                                                    | Status                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Release "late 2032" (live page); Wikipedia text reportedly also gives 2032               | **Wrong/stale.** Use BOP (2030-02-22, can change). Do not take release dates from Wikipedia.                                                                                                                                                                                                                                                                                                                |
| Evans is her "husband" (live page, Yahoo 09-15, farms)                                   | **Contradicted by Holmes (Feb 2025).** Use "partner."                                                                                                                                                                                                                                                                                                                                                       |
| "No Elizabeth underneath the costume" / "nothing left"                                   | **Unsupported claim about her inner life.** Already cut in the draft; must not return in `description`.                                                                                                                                                                                                                                                                                                     |
| AI "privacy apocalypse" warnings from prison                                             | Unverified, and authorship is shared. Omit.                                                                                                                                                                                                                                                                                                                                                                 |
| "$700M+" fraud as though it were the conviction                                          | Qualify: conviction on specific counts; restitution about $452M.                                                                                                                                                                                                                                                                                                                                            |
| Net worth figures (positive or negative)                                                 | Farm arithmetic. Omit.                                                                                                                                                                                                                                                                                                                                                                                      |
| October 16 as A24's official date                                                        | Reported, not on A24's page as of 09-19. Attribute.                                                                                                                                                                                                                                                                                                                                                         |
| NYT (Sperling, 2026-09-07): Holmes and Evans dispute Chozick's 2023 quotes               | **Still unverified.** The 09-09 research reached it only through an odd `monorepo-sample2.nyt.net` search hostname. Today's search did not surface the dispute, and the Oxygen piece does not mention it. **Treat as at-risk.** If it cannot be confirmed on nytimes.com or a named syndication before shipping, cut the dispute sentence and the matching FAQ clause and keep the 2023 profile attributed. |
| NYT (via search snippet): Holmes and Evans plan "a new and improved version of Theranos" | Snippet only. Evans's Haemanthus startup is documented (Fortune, NPR, May 2025); any link to Holmes's plans needs a primary source.                                                                                                                                                                                                                                                                         |
| Voice was "proven fake" by the teaser (forums)                                           | Forum claim. Omit.                                                                                                                                                                                                                                                                                                                                                                                          |
| Children's names                                                                         | Private. Omit.                                                                                                                                                                                                                                                                                                                                                                                              |

## Baseline and 28-day prediction

Pulled live from the Search Console API on 2026-09-19 (read-only, page filter `elizabeth-holmes`,
`dataState: all`, so the last 2–3 days may still be revised). The local `latest.json` export
(May 5–Aug 11) is stale, and the page falls outside its capped top-1000 page list.

| Window                                 | Clicks | Impressions | CTR | Avg position |
| -------------------------------------- | -----: | ----------: | --: | -----------: |
| 2026-05-05 → 09-17 (since publish)     |      0 |         165 |  0% |         10.6 |
| 2026-07-20 → 08-18 (30d, pre-catalyst) |      0 |          17 |  0% |          9.7 |
| **2026-08-21 → 09-17 (28d baseline)**  |  **0** |      **56** |  0% |      **9.2** |
| of which 09-06 → 09-17 (post-premiere) |      0 |          51 |  0% |        ~9–10 |

Daily: 13 impressions on 09-07, 13 on 09-08, 7 on 09-09, then 0–6 a day. **The premiere spike was
visible on the page but small and short.**

Query families: only two query rows can be attributed since 09-01 (`elizabeth holmes personality`, 1
impression at position 10; `elizabeth holmes personality type`, 1 at 9). The other ~49 impressions are
anonymized queries. **Exact-name and biography-query impressions cannot be observed. Do not report them
as zero.** Since May, `elizabeth holmes personality type` has 8 impressions at position 9.4. An
`elizabeth holmes uncle` row (1 impression, position 1) came from the old uncle section, which the
refresh cut as unsupported. Losing it is correct. Engaged time was not pulled.

**Prediction for the 28 days after shipping (assuming it ships by about October 1, so the window
includes October 16):**

- Page impressions: 56 → **80–600**. Most of any increase will come from film-driven demand, not from
  the refresh.
- Page clicks: 0 → **0–10**.
- `elizabeth holmes personality type` position: 9.4 → **6–12**.
- Exact-name `elizabeth holmes`: expect at most **~30 attributable impressions, below position 30,
  and about 0 clicks.** The page cannot compete for the name alone.
- CTR: not meaningful at this volume.

To tell the effects apart: rising impressions at a flat position means demand grew. A position gain on
the personality-type query means the refresh helped. A first click at a flat position is a snippet
effect. The October 16 release confounds any before/after comparison. Check again at 28 days and at
56 days (the second check covers the tail after the release and any awards coverage).

## Scorecard and caveats

| Dimension                  |  Score | Evidence                                                                                                                                                                             |
| -------------------------- | -----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Demand trajectory          |  15/20 | Dated catalyst (09-06 premiere), second wave due 10-16, Trends cluster 09-09 (not re-verified), page impressions 9 → 51 across the premiere. Renewed demand for an established name. |
| Exact-name SERP weakness   |   0/25 | Personal and trial Wikipedia articles, Britannica, Biography.com, DOJ, IMDb, heavy news coverage.                                                                                    |
| Biography-intent breadth   |  14/15 | Identity, film, family, partner, children, custody, release, clemency, voice, net worth.                                                                                             |
| Source depth               |  15/15 | Court record, depositions, trial testimony, books, long-form profiles, a named-director Q&A, reviews.                                                                                |
| 9takes angle and niche fit |   7/10 | The film's own question is the personality question; competitors for the type query are crowd-typing sites. The voice/persona angle is heavily covered elsewhere.                    |
| Timing / index advantage   |   6/10 | Indexed URL at about position 9 on the type query; 27 days before release; refresh blocked 10 days.                                                                                  |
| Entity clarity             |    4/5 | A few name collisions (writer, genealogy records); the founder dominates.                                                                                                            |
| **Subtotal**               | **61** |                                                                                                                                                                                      |
| Penalty                    |    −20 | Personal Wikipedia plus several authoritative dedicated biographies.                                                                                                                 |
| **Total**                  | **41** | **PASS.** Not an Emerging Entity Gap.                                                                                                                                                |

No gossip penalty: most of the demand is for legitimate topics (custody, the film, the case). The
partner and net-worth queries are gossip-adjacent and handled above by not answering them. No
"peaked" penalty: the larger wave has not happened yet.

Caveats:

- Search results vary by location, device and date. Searches were run on 2026-09-19 with a US-only web
  search tool that groups results. No rank positions, result counts, volumes, or backlink data are
  claimed.
- The Trends observation is from 2026-09-09 (a different researcher) and was not repeated.
- Search Console hides rare queries, so the query-family breakdown is incomplete by design.
- Review contents came from search snippets and one full fetch (Iowa Public Radio). The main review
  outlets were paywalled or blocked.
- Holmes's February 2025 marriage statement is taken from TV Insider/HollywoodLife quoting PEOPLE;
  people.com itself could not be fetched.
