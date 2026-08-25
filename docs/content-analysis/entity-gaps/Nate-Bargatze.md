---
person: 'Nate-Bargatze'
audited_at: '2026-08-25'
classification: 'pass'
recommended_action: 'create'
score: 41
biography_intent: true
personal_wikipedia: true
source_gate: 'pass'
path: docs/content-analysis/entity-gaps/Nate-Bargatze.md
---

# Emerging Entity Gap Packet: Nate Bargatze

> **Read the divergence first.** The 41/100 answers this command's question — _can 9takes become the
> biography of record for Nate Bargatze?_ No. He has a personal Wikipedia page, a dedicated IMDb bio,
> a Biography.com feature, an official `natebargatze.com/bio`, a second official bio at
> `nateland.com/pages/nate`, a Premiere Speakers bio, and a Grokipedia entry. The general-biography
> surface is closed and nothing changes that. But `classification: pass` and
> `recommended_action: create` are not in conflict. The **psychology** surface is emptier than Bill
> Burr's was, the comedy cluster is the strongest cluster 9takes owns, and — unlike Burr — Bargatze
> has a **live, unresolved, three-month-old character test** that nobody has written the psychological
> read of. See "Rubric divergence" before drafting. It changes what the page should be about.

## Why now

**One catalyst is running, one just broke, and one is behind us. The broken one is the story.**

1. **_The Breadwinner_ — released 2026-05-29, and it failed.** His feature debut, which he co-wrote
   with Dan Lagana and produced, distributed by TriStar/Sony, directed by Eric Appel, co-starring
   Mandy Moore, Colin Jost, Kumail Nanjiani, and Will Forte. Critics: **19–20% on Rotten Tomatoes**,
   **36/100 Metacritic** across 11 critics. Audiences: **86% RT audience score**, **CinemaScore A−**.
   Opening weekend roughly **$7.5M worldwide** against a projection that had been cut from ~$18M
   ([Deseret](https://www.deseret.com/entertainment/2026/06/04/the-breadwinner-nate-bargatze-clean-comedy-critics-audience-divided/),
   [Forbes](https://www.forbes.com/sites/timlammers/2026/05/28/breadwinner-rotten-tomatoes-reviews-say-bargatze-brings-home-stale-comedy/),
   [Yahoo](https://www.yahoo.com/entertainment/movies/articles/too-clean-critics-hated-nate-213037668.html)).
   **The critics attacked the exact thing that is his identity.** THR: _"inoffensive to the point of
   total boredom."_ AV Club: material aimed at _"white upper-class suburbanites,"_ which _"defangs"_
   the film. This is the first time the clean-comedy thesis has been publicly stress-tested at scale,
   and the verdict split cleanly along critic/audience lines.
2. **The 2026 _Big Dumb Eyes World Tour_ — 62 announced dates, mid-flight right now.** Arena-scale,
   all-new material, generating venue-level press in secondary markets every month. Live August 2026
   stops include UBS Arena (08-07), Prudential Center (08-08), Little Caesars Arena (08-14), OKC Zoo
   Amphitheatre (08-20)
   ([Prudential Center](https://www.prucenter.com/news/comedian-nate-bargatze-announces-his-2026-big-dumb-eyes-world-tour),
   [313 Presents](https://www.313presents.com/events/detail/nate-bargatze)).
3. **The 77th Primetime Emmys, 2025-09-14 — hosted, and it's over.** The single largest name-search
   event of his career, now eleven months stale. **Mariska Hargitay hosts the 78th on NBC in
   September 2026** ([Variety](https://variety.com/2026/tv/news/mariska-hargitay-host-emmys-nbc-first-woman-in-15-years-1236803622/)).
   Do not build the page around an Emmys hook that has already expired — but do mine the night itself
   (see "Source inventory").

Two independent attention signals: an active 62-date arena tour with continuous venue press through
August 2026, and national film-trade/entertainment coverage of _The Breadwinner_ across Forbes,
Deseret, Yahoo, RogerEbert.com, CinemaBlend, and Breitbart in late May–June 2026.

**But the demand shape is wrong for this command.** Bargatze is not emerging. He has been a
high-volume, continuously-covered search entity since the 2023 SNL host slot, and by 2024 he was the
highest-grossing stand-up in America. Demand here is **large, durable, and saturated** — the inverse
of the Jordi Hays pattern. Demand is directional; no Trends data or keyword volume was consulted and
none is claimed.

**Local GSC: zero signal.** No `bargatze` query or page appears in any 9takes GSC export through
2026-08-13. No draft exists at `src/blog/people/drafts/`, and `blogs_famous_people` has no matching
row published or unpublished. He is currently `inProgress` in `docs/blog-automation/backlog-queue.json`
at priority 46 with `retryCount: 2` after two dead launches.

## Exact-name SERP map

Checked **2026-08-25, US, via WebSearch** (non-personalized, no location or device refinement).
Composition, not positions. Backlink data: **unknown** — no backlink tool available, and none inferred
from search.

| Query                            | First-page composition                                                                                                                                                                           |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Nate Bargatze`                  | IMDb, **Wikipedia**, Amazon Prime (_Hello World_), **Ticketmaster**, Facebook, **nateland.com/pages/nate** (official), plus venue press (Auburn Athletics)                                       |
| `Nate Bargatze biography`        | **IMDb dedicated bio page**, IMDb main, **Wikipedia**, **Biography.com feature**, **natebargatze.com/bio** (official), nateland.com bio, Premiere Speakers bio, AllMusic                         |
| `Nate Bargatze wife`             | **The Knot**, IMDb news, **Yahoo/People-syndicated**, a YouTube exclusive interview, plus `scienceoflearning.jhu.edu/tof/...` — a **hijacked Johns Hopkins subdomain** serving generated content |
| `Nate Bargatze parents`          | **Wikipedia**, **Biography.com**, **WSMV Nashville**, iHeart/Apple Podcasts (_Got It From My Momma_ ep. 44 — **his actual mother, on the record**), Grokipedia, tvovermind, boredpanda           |
| `Nate Bargatze net worth / age`  | **Entirely estimate-farm** — Celebrity Net Worth ($40M), Parade, HELLO!, legit.ng, Primetimer, celebritiesfaq, biographiestart, guidenetworth, famouspeopletoday                                 |
| `Nate Bargatze 2026 tour`        | Venue/promoter pages — Prudential Center, 313 Presents, Pechanga, Toyota Center, PeoplesBank Arena, LiveNation, StubHub, plus `philadelphiawatch.com` scraper                                    |
| `Nate Bargatze personality type` | **boo.world**, **personalitylist.com**, a **hijacked `monitor.biology.washington.edu` WordPress subdomain**, and three name collisions — Big Nate, Nate Archibald, Nate Jacobs. **That is it.**  |

Answering the five required questions:

1. **How many top-ten results are dedicated, substantial biographies?** On the biography query, at
   least six: Wikipedia, IMDb's dedicated bio page, Biography.com's feature, two official bios
   (natebargatze.com and nateland.com), and Premiere Speakers. This is a **more** thoroughly served
   fact surface than Bill Burr's, not less.
2. **Personal Wikipedia page?** **Yes.** Plus a separate Wikipedia article for _The Breadwinner_.
3. **Does a strong publisher own general biography intent?** Yes, several, non-displaceably — and he
   owns two of them himself.
4. **Would a reader need multiple searches after opening current results?** **For biography, no.**
   **For interpretation, yes.** Nothing on page one asks why a man whose entire brand is
   _being unremarkable_ is building a vertically integrated entertainment company with a theme park
   in the plan. The personality SERP asserts "Type 9, Peacemaker" with zero evidence and moves on.
5. **Can 9takes offer the strongest general-interest page?** **No.** It can offer the strongest
   _psychological_ page by a very wide margin — wider than for Burr, because Burr at least had a
   Personality Database profile and a contested typology debate. Bargatze has two thin database stubs
   and a hijacked .edu subdomain.

**The exploitable asymmetry:** the fact surface is over-served by real publishers _and_ by his own
two official bios, while the interpretation surface is served by nobody — and the most interesting
evidence about him (the May 2026 flop, the Emmys donation bit going into the red) postdates every
typology page ranking on the query.

## Biography-intent map

**Core identity** — who he is, why he matters now.

- Stand-up comedian, actor, writer, producer; born **1979-03-25**, Nashville, Tennessee; raised in
  the Old Hickory neighborhood. Age 47 as of 2026-08-25.
- Known for deadpan, monotone delivery and clean material. Netflix specials _The Tennessee Kid_
  (2019), _The Greatest Average American_ (2021, Grammy-nominated), Amazon's _Hello World_ (2023),
  and _Your Friend, Nate Bargatze_ (Netflix, 2024-12-24).
- Hosted **SNL twice** (2023, 2024) and the **77th Primetime Emmy Awards** (2025-09-14, CBS).
- Founder of **Nateland Entertainment** (2023), a family-friendly production company.
- **Current hook:** the 62-date _Big Dumb Eyes World Tour_ is running now, and his feature debut
  _The Breadwinner_ just failed with critics while audiences graded it A−.

**Life and career** — where 9takes can add real value in prose.

- Father **Stephen Bargatze**: working magician for 40+ years, former birthday-party clown, member of
  the International Brotherhood of Magicians, motivational speaker. Mother **Carol Bargatze**: worked
  the Vanderbilt Commodores ticket office. Three children raised in a strict Christian household —
  Nate, brother **Derek**, sister **Abigail**.
- College: **flunked out.** Sources disagree on which school — Volunteer State Community College in
  Gallatin for about a year, and/or Western Kentucky University. Verify against Wikipedia at draft.
- Odd jobs before comedy: construction, a Walmart cellphone kiosk, furniture delivery, Applebee's
  host, **water-meter reader in Mount Juliet, Tennessee**.
- Met **Laura** (née Baines) at that Applebee's — he hosted, she served. Married **2006-10-13**. She
  is from Huntsville, Alabama, took a business administration degree from **Middle Tennessee State
  University in 2005**, worked as a corporate event planner, and now works in his business as a
  producer and talent manager. One daughter.
- Comedy from 2002. Chicago and New York clubs mid-2000s. Broke out via Netflix's _The Standups_
  (2017). **14 appearances on _The Tonight Show_** — claimed as the most by any comedian; see cautions.
- **2024: highest-grossing stand-up comic in America**, 1.2M+ tickets on the _Be Funny_ tour.
  Currently billed as Pollstar's **#1 comedian in the world**.
- **2025-05: _Big Dumb Eyes: Stories from a Simpler Mind_** (Hachette), a **#1 New York Times
  bestseller** — written, by his own account, by a man who had never finished reading a book.
- **2025-09-14: hosts the Emmys.** Pledges $100,000 to Boys & Girls Clubs of America, with money
  deducted for every speech over 45 seconds and added for short ones. **The pot ends the night at
  −$60,000.** CBS puts in $100,000; Bargatze puts in **$250,000 of his own money** he later says on
  his podcast he had never planned to spend, having _"pictured it as they could then go long, but
  then be a hero"_ — a **$350,000** total
  ([THR](https://www.hollywoodreporter.com/tv/tv-news/nate-bargatze-did-not-plan-boys-girls-clubs-donation-emmys-1236378732/),
  [CNN](https://www.cnn.com/2025/09/25/entertainment/nate-bargatze-emmys-bit)).
- **2026-05-29: _The Breadwinner_.** See "Why now."
- **The stated endgame:** Nateland as a full media company — a Nashville production facility, a talent
  incubator for other clean comics, a 2026 Norwegian Cruise Line voyage, and an amusement park. He has
  said out loud he is trying to build a Disney-shaped thing
  ([Deseret](https://www.deseret.com/entertainment/2025/06/26/nate-bargatze-nateland-entertainment/),
  [Deadline](https://deadline.com/2025/06/nate-bargatze-emmys-the-breadwinner-nateland-comedy-means-business-1236438428/)).

**Fact queries** — answer only these, only in prose or FAQ metadata, only from the sources named.

| Query          | Answerable?                                     | Source discipline                                                                                           |
| -------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Age / birthday | **Yes** — 1979-03-25, Nashville TN              | Wikipedia, Biography.com. He turned 47 in March 2026.                                                       |
| Wife           | **Yes** — Laura Bargatze, married 2006-10-13    | The Knot, IMDb. **Never cite the `scienceoflearning.jhu.edu` page — hijacked subdomain.**                   |
| Children       | **Yes, carefully** — one daughter               | Prefer "his daughter." Do not build a section around her.                                                   |
| Parents        | **Yes** — Stephen (magician) and Carol          | Wikipedia, Biography.com, WSMV, and Carol's own podcast appearance                                          |
| Siblings       | **Yes** — brother Derek, sister Abigail         | Biography.com. Verify against Wikipedia; do not go past names.                                              |
| Hometown       | **Yes** — Old Hickory, Nashville                | Wikipedia, WSMV                                                                                             |
| Education      | **Qualify** — flunked out of college            | Sources split between Volunteer State CC and Western Kentucky. State the fact, hedge the institution.       |
| Faith          | **Yes, as his framing** — strict Christian home | His own interviews. He rejects the "Christian comedian" label; see cautions.                                |
| Net worth      | **NO — do not answer**                          | Celebrity Net Worth says $40M with no methodology; the rest of the page is estimate farms. Nothing citable. |
| Height         | **NO — do not answer**                          | Only body-stat farms carry it. Skip.                                                                        |

## Source inventory

**Source gate: PASS.**

First-person (≥2 required):

- **_Nateland Podcast_, weekly since 2020** — roughly six years of unscripted first-person audio with
  a recurring cast. This is where the Emmys-donation post-mortem lives and where the Breadwinner
  reaction, if he gave one, will be. Mine it directly; do not summarize it from articles.
- **_Big Dumb Eyes: Stories from a Simpler Mind_ (Hachette, 2025-05)** — a book-length first-person
  account, #1 NYT bestseller. The single densest self-authored source on his childhood, his father,
  and his self-concept. There is also an author-read audiobook.
- **Deadline _Comedy Means Business_ podcast, 2025-06** — the clearest on-record statement of the
  Nateland business plan, the Emmys prep, and _The Breadwinner_ before it shipped.
- **THR long-form, 2025** — Emmys hosting, ADHD, a period of wanting to quit stand-up, the theme park.
  ⚠️ `hollywoodreporter.com` 307-redirects to `tollbit.*` and dies at HTTP 402. Use Yahoo/AOL
  syndication or search-snippet extraction (see `project_tollbit_paywall_workaround`).
- **CBS News, "Stand-up Nate Bargatze on operating in 'the chaos'"** and **Fox News** on the
  "higher calling" framing of his career.
- **Four hour-long specials**, all substantially autobiographical.

Named third-party:

- **Bill Burr** — quoted in The Atlantic's 2021 profile on why Bargatze's Southern-stereotype persona
  works, and on their shared disdain for New York's cultural self-seriousness. A named peer read from
  someone 9takes will also be covering.
- **Carol Bargatze**, his mother — a full episode of _Got It From My Momma_ (ep. 44). A first-hand
  observer with her own voice on the record. Rare and underused.
- **Stephen Bargatze**, his father — a public figure in his own right with a documented motivational-
  speaking career. His story is independently sourceable and is the origin of the family's frame.
- **Named critics of _The Breadwinner_** — William Bibbiani ("stale"), Frank Scheck ("lazy"), Matt
  Schimkowitz (AV Club, on "clean" defanging the film), plus THR's "inoffensive to the point of total
  boredom."
- **Lorne Michaels** — co-producer of _Nate Bargatze's Nashville Christmas_ for CBS.
- **Boys & Girls Clubs of America CEO** — on the record about the Emmys donation.
- **Institutions of record:** Television Academy (Emmy host), Recording Academy (Grammy nomination),
  Pollstar (touring rank), CinemaScore (A−), Rotten Tomatoes / Metacritic.

Current source tied to the catalyst: Deseret, Forbes, Yahoo, CinemaBlend, and RogerEbert.com coverage
of _The Breadwinner_, May–June 2026; venue press through August 2026.

**Signature contradiction (documented, not inferred).** The persona is "The Greatest Average
American" — simple mind, big dumb eyes, a guy who flunked out of college and read water meters and
whose whole comic posture is _I am not remarkable and I am not trying to be_. Underneath it is one of
the most aggressive vertical-integration plays in modern comedy: his own production company, his own
talent incubator to manufacture more comics like him, a Nashville studio facility, a branded cruise,
a theme park, a feature film he co-wrote and produced, and two official biography pages he controls.
**The averageness is the product, and the product is being scaled with unusual deliberateness.**

Two documented stress-tests of that contradiction, both recent, both unwritten psychologically:

- **The Emmys donation bit (2025-09).** He designed a mechanism where other people's self-indulgence
  would visibly cost children money. He predicted it would produce heroes. It produced a −$60,000
  scoreboard and a $250,000 personal bill he says he never intended to pay — and he paid it rather
  than let the bit end in public failure. Then he explained the miscalculation on his own podcast.
- **_The Breadwinner_ (2026-05).** Critics did not say the movie was badly made. They said it was
  _too clean_ — that the identity itself is the defect. Audiences gave it an A−. He is now holding a
  verdict where the thing that made him the #1 comedian in the world is the thing the establishment
  named as the flaw.

## Protected strengths (existing pages only)

**Not applicable.** No 9takes page exists. `blogs_famous_people` has no `%barg%` row, published or
unpublished, and `src/blog/people/drafts/` has no Bargatze draft.

## Content requirements

- **H1 stays `Nate Bargatze`.** No cleverness in the visible headline.
- **SEO title = name + falsifiable thesis.** The thesis must be arguable and specific — the gap
  between the average-guy persona and the deliberateness of the machine being built around it. Do not
  ship a pure-typology title; it reads as database bait and loses to database bait.
- **Open with who he is and why he matters now** — Nashville comedian, deadpan and clean, hosted SNL
  twice and the 2025 Emmys, highest-grossing stand-up in America, currently on a 62-date arena tour,
  and just took his first public loss with _The Breadwinner_ — **before** assuming fandom.
- **One organizing contradiction**, not a trait list: the man selling unremarkableness is executing an
  unusually ambitious empire plan, and 2026 is the first year the market pushed back.
- **Argue the type against the databases.** Name that the consensus reads him as **Enneagram 9,
  "Peacemaker"** (Boo, personalitylist) and **ISTJ** on the MBTI side, then show the evidence and
  where it strains. A 9 read is the easy inference from a low-conflict surface; the theme park, the
  talent incubator, the $250,000 refusal to let a bit die, and a self-image built and marketed with
  this much precision are all things the 9 reading has to explain rather than assume. Present the
  competing reading honestly — do not simply declare a different number and move on. A page that
  merely asserts a type is indistinguishable from boo.world.
- **Use _The Breadwinner_ as the live character test**, held in tension rather than resolved. Give the
  critic quotes and the audience numbers both. **Do not adjudicate whether the movie is good.** Read
  the pattern: what he chose to make, what he refused to change, and who he was making it for.
- **Use the Emmys donation bit as the second test.** It is a small, perfectly legible decision-under-
  pressure and it is already on the record in his own words. It is more diagnostic than any special.
- **Mine the book and the podcast directly.** _Big Dumb Eyes_ plus six years of _Nateland_ is the moat
  no competitor has touched. A page assembled from secondary articles wastes it.
- **Answer only the safe fact queries** — age, wife, parents, siblings, hometown, one daughter,
  education (hedged), faith (as his framing). Skip net worth and height entirely.
- Canonical URL, citations, author identity, and real-entity links (Laura Bargatze, Nateland
  Entertainment, TriStar Pictures, Television Academy, Boys & Girls Clubs of America, Middle Tennessee
  State University) must be correct.
- **Cross-link into the comedy cluster — this is the strongest cluster on the site.** Ten published
  comedians already live in `blogs_famous_people`: Joe Rogan, Dave Chappelle, Andrew Schulz, Kevin
  Hart, Trevor Noah, Tina Fey, Theo Von, Shane Gillis, Matt Rife, Bert Kreischer. Bill Burr is
  packeted and unpublished. Bargatze links contextually to **Burr** (quoted about him in The Atlantic)
  and sits as the clean-comedy counterweight to the Rogan/Schulz/Gillis/Rife pole — which makes the
  cluster an argument rather than a list.
- No word count prescribed.

## Claims to avoid or qualify

- **Net worth — publish no figure.** Celebrity Net Worth's $40M carries no methodology and the rest of
  that SERP is estimate farms.
- **Promotional touring superlatives — attribute or drop.** "Highest-grossing stand-up comic of 2024,"
  "1.2M+ tickets," "20+ venue records," "#1 comedian in the world," "14 _Tonight Show_ appearances,
  the most by any comedian," and "only comedian to sell out three consecutive Bridgestone Arena shows
  in a calendar year, matched only by Taylor Swift and Garth Brooks" all originate in **venue and
  promoter press releases**, which are marketing copy. Anchor the touring rank to **Pollstar** directly
  or attribute in-line as a promoter claim. (See `project_source_audit_outlet_list_chinese_subjects`
  and the list-vs-promo rate trap in `project_wayback_unreachable_converging_sources`.)
- **_The Breadwinner_ numbers — verify at draft.** RT critic score is reported as both **19%** and
  **20%** across sources; opening weekend as **~$7.5M worldwide** with a **$25M budget**; Wikipedia
  carries a final gross near **$20M**. Metacritic 36/100 from only 11 critics is a thin sample. Pick
  one sourced set and cite it.
- **_The Breadwinner_ release date — verify.** An IMDb news item announced a **March 2026** release;
  Wikipedia and the review cycle both support **2026-05-29**. It appears to have moved. Do not state
  a date without checking.
- **Do not claim a taped 2026 Netflix special.** The two-special Netflix deal (announced 2024-10) is
  real and the second special is real but **untitled and undated**. The only "already taped" claim
  found in this audit came from a **fan Facebook page** and is not citable.
- **Do not call him a "Christian comedian."** He explicitly frames it as clean-and-family-inclusive,
  not faith-branded: _"a clean comedian that people can watch with their grandparents or their
  12-year-old... I'm not making entertainment specifically for kids, but I want your family to come to
  this."_ The strict Christian upbringing is a sourced biographical fact; the label is his to refuse
  and he has refused it.
- **Do not diagnose.** ADHD is **his** self-description in **his** interview — attribute it to him
  every time and never build a typology claim on it. Flunking out of college is a fact, not evidence
  of anything clinical.
- **Do not name or characterize his daughter beyond "his daughter."** The Knot names her; that is not
  a reason for 9takes to.
- **Education is contested.** Volunteer State Community College and Western Kentucky University both
  appear, in low-quality sources, with different stories. State that he flunked out; hedge the school
  unless Wikipedia settles it.
- **Do not cite `scienceoflearning.jhu.edu`, `monitor.biology.washington.edu`, `philadelphiawatch.com`,
  `euvolution.com`, or `guidenetworth.com`.** The first two are **hijacked institutional subdomains**
  serving generated content; the rest are scrapers. The euvolution page is a scraped mirror of The
  Atlantic's 2021 profile — find the original at theatlantic.com before quoting from it.
- **The Atlantic's "Nicest Man in Stand-Up" (2021) is five years old.** It is load-bearing for the
  persona but predates the empire, the Emmys, the book, and the film. Do not present it as current
  characterization.
- **Do not launder _The Breadwinner_ in either direction.** Not "critics were snobs," not "he can't
  act." Report the critic quotes, the 86% audience score and the A− CinemaScore, and analyze the
  choice — not the quality.

## Baseline and 28-day prediction

**No existing 9takes page.** Save the baseline as zero and track these families separately.

**Local comparables from the 2026-08-13 GSC window — read both halves of this:**

| Page                                    | Published         | Clicks |                Impressions |   CTR | Position |
| --------------------------------------- | ----------------- | -----: | -------------------------: | ----: | -------: |
| `/personality-analysis/tina-fey`        | 2025-04           |     22 |                      1,711 | 1.29% |      7.3 |
| `/personality-analysis/joe-rogan`       | 2025-03           |      2 |                        947 | 0.21% |      9.9 |
| `/personality-analysis/trevor-noah`     | 2025-03           |      5 |                        650 | 0.77% |     10.3 |
| `/personality-analysis/Dave-Chappelle`  | 2025-06           |      0 |                         20 | 0.00% |      8.6 |
| `/personality-analysis/Andrew-Schulz`   | 2026-01           |      0 |                         12 | 0.00% |      5.8 |
| `/personality-analysis/bert-kreischer`  | 2026-06           |      0 |                          7 | 0.00% |      7.1 |
| `theo-von`, `shane-gillis`, `matt-rife` | 2025-12 → 2026-04 |      — | **absent from the window** |     — |        — |

The honest reading: **every comedian page that works was published in March–April 2025.** Every
comedian page published since December 2025 is at or near zero, and three do not appear in the export
at all. That is a **six-to-twelve-month ramp**, not a 28-day one, and it is the single most important
calibration in this packet. Do not predict a fast win.

The proof the surface converts is real but old: the query `joe rogan personality type` sat at
**position 7.7 with 72 impressions and 1.39% CTR** — 9takes on page one for exactly this query shape
against exactly these competitors (boo.world, personalitylist, PDB).

Track, separately:

- **Exact-name family** (`nate bargatze`, `nate bargatze bio`, `nate bargatze biography`) — expect
  near-nothing. Wikipedia, IMDb, Biography.com, and two official bios are not displaceable. **Do not
  read this as failure.**
- **Psychology family** (`nate bargatze personality type`, `nate bargatze enneagram`,
  `nate bargatze mbti`) — **this is the real test.** The incumbents are two database stubs and a
  hijacked .edu WordPress. Position 8–15 with double-digit impressions by **day 56, not day 28**
  would match the Rogan/Fey trajectory. Anything faster is upside, not the plan.
- **Interpretive long-tail** (`why is nate bargatze so popular`, `nate bargatze clean comedy why`,
  `is nate bargatze a christian comedian`, `nate bargatze breadwinner reviews why`) — the family with
  the least incumbency and the best fit to what the page actually argues. Watch it first.
- **Catalyst family** (`nate bargatze breadwinner`, `nate bargatze netflix special`,
  `nate bargatze tour 2026`) — commercially owned by Ticketmaster and the studios; a page indexed now
  can catch the untitled-Netflix-special spike whenever it dates.

Check at 28 days, again at 56, and again at 90 given the observed comedian-cluster ramp. Separate
demand growth from rank movement from CTR before concluding anything.

## Scorecard

| Dimension                | Score |                                                                                                                                                                                                                                   |
| ------------------------ | ----: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Demand trajectory        | 13/20 | Live 62-date arena tour with continuous venue press, plus a fresh May 2026 film cycle. But he is not emerging — saturated since 2023 — and the biggest catalyst (Emmys) expired eleven months ago.                                |
| Exact-name SERP weakness |  3/25 | Wikipedia, IMDb's dedicated bio, Biography.com's feature, **two official bios he controls**, Premiere Speakers, Grokipedia. Parents and wife are held by real publishers. Only the psychology slice is empty.                     |
| Biography-intent breadth | 12/15 | Broad verified need — wife, parents, siblings, age, hometown, education, net worth, tour, film, faith. Breadth is high; capturability is near zero.                                                                               |
| Source depth             | 14/15 | Six years of weekly _Nateland_, a #1 NYT first-person book, Deadline/THR/CBS/Fox long-form, his mother on the record, Bill Burr as a named peer, four named critics, four institutions of record.                                 |
| 9takes angle / niche fit | 10/10 | Average-guy persona vs. a theme-park-scale empire plan, with **two dated, documented stress tests in the last twelve months** that no incumbent has read psychologically. Ten-comedian cluster with a proven page-one comparable. |
| Timing / index advantage |  5/10 | No existing URL, zero incumbency, tour mid-flight and an undated Netflix special ahead. But late to both big catalysts, and the local cluster shows a 6–12 month ramp.                                                            |
| Entity clarity           |   4/5 | "Bargatze" is a genuinely rare surname with no real-world collision. Docked one point: the **target** query pulls in Big Nate, Nate Archibald, and Nate Jacobs, and RogerEbert.com's own review URL misspells him "bergatze."     |
| **Subtotal**             |    61 |                                                                                                                                                                                                                                   |
| Penalty                  |   −20 | Personal Wikipedia **plus** several authoritative dedicated biographies. Applies flatly.                                                                                                                                          |
| **Total**                |    41 | **PASS** on the Emerging Entity Gap question                                                                                                                                                                                      |

Penalties not applied: no `−15` for peaked attention (name demand is durable and enormous, and the
tour is live); no `−15` for source trail (14/15); no `−10` for ambiguity (rare surname); no `−10` for
gossip-only intent — net worth is the only gossip-shaped family and this packet declines it outright.

## Rubric divergence — read before drafting

The 41 answers **one** question: can this page become the biography of record? No, and it is not close.

A different question — **is Nate Bargatze a good 9takes personality-analysis subject?** — comes back
a stronger yes than Bill Burr's did, for three concrete reasons:

1. **The psychology SERP is emptier than Burr's.** Burr faced boo.world, So Syncd, sakinorva,
   Personality Database, SunSigns, cognitivetype, and personalitylist — seven typology properties with
   an actual contested debate. Bargatze faces **two** (boo.world, personalitylist), a hijacked
   university subdomain, and three name collisions. Nobody has staked this query.
2. **The best evidence postdates every ranking page.** The Emmys donation bit (Sept 2025) and
   _The Breadwinner_'s critic/audience split (May 2026) are the two most diagnostic things he has ever
   done in public, and neither appears on any personality page ranking today. A 9takes page that reads
   both is not competing on the same axis as a database stub.
3. **The cluster is real and it is the site's strongest.** Ten published comedians, with Tina Fey at
   1,711 impressions / position 7.3 and Rogan holding position 7.7 on the exact analogous query.

**But apply the counter-signal honestly.** Six of those ten comedian pages are at or near zero
impressions, and every one of them was published after December 2025. Whatever worked in spring 2025
has not been reproducing. That is a reason to publish Bargatze with a **sharper thesis than the recent
cluster entries had**, and a reason to expect a 56–90 day ramp rather than a 28-day one. It is not a
reason to hold — but if the drafting stage cannot land the contradiction, this is a page that will
join the zero-impression half of the cluster.

**Conclusion:** proceed on a narrowed target. Do not write "the definitive Nate Bargatze biography."
Write the page that argues, from his own book and his own podcast, why the most average man in comedy
is the most deliberate — and what happened in the twelve months when that deliberateness first got
tested in public and did not fully win.

## Caveats

- SERP composition captured **2026-08-25, US, non-personalized WebSearch**, without location or device
  refinement. Results vary by locale and date. Positions were not recorded; composition was.
- No Trends data, keyword volume, result counts, or backlink data was available. Every demand statement
  is directional and names its evidence.
- Local GSC contains **zero** Bargatze signal, so no demand claim here rests on 9takes data. The Fey
  and Rogan comparables are structural analogies with independently different baseline demand — not
  forecasts.
- The prefilter `scripts/emerging-entity-gap-candidates.mjs` was not run for this subject: it scores
  from observed local signals and Bargatze has none, so it has nothing to say here.
- `hollywoodreporter.com` is unreachable via WebFetch (307 → `tollbit.*`, HTTP 402). THR content in
  this packet came from syndication and search snippets. Re-verify THR quotes at draft time through
  Yahoo/AOL mirrors.
- Wikipedia's _Breadwinner_ financials were read via WebFetch summary, not from the article's cited
  sources. Treat the $20M / $25M figures as unverified until checked against Box Office Mojo or
  The Numbers.
