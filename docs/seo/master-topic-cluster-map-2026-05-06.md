<!-- docs/seo/master-topic-cluster-map-2026-05-06.md -->

# 9takes SEO Strategy: Master Topic Cluster Map + AEO + 30/60/90

**Author:** SEO content strategist pass
**Date:** 2026-05-06
**Owner:** DJ
**Goal:** Drive 6+ months of content + optimization work from a single map.
**Save to:** `/Users/djwayne/9takes/docs/seo/master-topic-cluster-map-2026-05-06.md`

---

## 0. Diagnostic snapshot (so the strategy is grounded)

What the corpus already looks like:

| Section                   | Live URLs in sitemap | Source                                                           |
| ------------------------- | -------------------- | ---------------------------------------------------------------- |
| `/personality-analysis/*` | 337                  | Supabase (319 published + 7 categories + 9 types + hub)          |
| `/enneagram-corner/*`     | 108                  | MDsvex                                                           |
| `/questions/*`            | 107                  | Supabase Q&A                                                     |
| `/pop-culture/*`          | 22                   | MDsvex (55 files exist; only ~22 are surfacing in sitemap — gap) |
| `/community/*`            | 17                   | MDsvex (35 files exist — gap)                                    |
| `/how-to-guides/*`        | 12                   | MDsvex (24 files exist — gap)                                    |
| `/corpus-stats`           | 1                    | dynamic, AEO-ready                                               |
| Total                     | **608**              |                                                                  |

**The four observations that frame the rest of this report:**

1. **The sitemap under-counts pop-culture, community, and how-to-guides by 50–70%.** Either those `published: true` flags are wrong, the build-time glob is excluding files, or `scripts/generate-sitemap.js` isn't picking them up. This is the single biggest pre-content fix on the entire site. Names of the missing files: `incel-blackpill-radicalization-enneagram`, `dark-triad-meets-enneagram`, `breaking-points-enneagram-analysis`, `cancel-culture-enneagram-type`, `succession-personality-trap`, `kardashian-family-enneagram-analysis`, `marvel-universe-enneagram-analysis`, `royal-family-enneagram-analysis`, `oscar-contenders-enneagram-analysis`, `parasocial-relationships-enneagram-type`, `streaming-royalty-enneagram-analysis`, `pop-queens-enneagram-analysis`, `tech-titans-enneagram-analysis` and ~20 more — **these are the strongest pop-culture spokes the site has and they're invisible to Google.**
2. **319 personality profiles is genuinely the largest English-speaking online corpus that ties Enneagram to first-party domain stats.** Boo (Personality Database) is bigger by raw count but treats Enneagram as one of seven systems — not their wedge. Truity, Enneagram Institute, Eclectic Energies don't do celebrity content systematically. Personality Hacker is MBTI-skewed. **The moat is "Enneagram + pop culture + first-party stats," not any one of those alone.**
3. **The corpus stats file is the single most valuable SEO/AEO asset on the site and it's barely cross-linked.** 8 pre-computed first-party claims, percentage-point deltas, sample sizes — that's exactly what ChatGPT/Perplexity/Claude cite. Right now the page is great but its claims aren't woven into the broader content graph.
4. **The /questions silo is real.** 107 question pages indexed; not many internal links from blog corpus → questions, and almost none in the reverse direction except via the global header. This is leaving authority on the table for both halves.

---

## 1. Master topic cluster map (per-pillar)

Notation:

- **PP** = pillar page (existing if URL is live, proposed otherwise)
- **DIFF** = qualitative difficulty: Low (long tail, weak SERPs), Med (real competition but winnable), High (entrenched authority sites)
- **STATUS** = ✅ exists, 🟡 partial/needs upgrade, 🔴 gap
- **INTENT** = Info / Comm / Nav

Where I list spokes, the format is `Primary keyword | secondary 1 / secondary 2 / secondary 3 | INTENT | DIFF | STATUS`.

---

### PILLAR 1 — `/personality-analysis` (DB-driven, 319 published)

**Pillar page:** `/personality-analysis` (✅) — keep this as the corpus hub and entity index.

This pillar has **head-term volume in three patterns**: `[name] enneagram type`, `[type] celebrities`, `[domain] enneagram`. The 9takes wedge is that you've already got 319 figures _with a corpus stat showing the type skew per domain_. Use that.

#### Cluster 1A — Money keyword: "[Celebrity] Enneagram type"

Pillar page: `/personality-analysis` (already an Index/CollectionPage)
Sub-pillars: `/personality-analysis/categories/[slug]` (✅ all 7) and `/personality-analysis/type/[1-9]` (✅).

Spokes (the 319 individual profiles). The 9takes pattern is good. Don't change it. **Do** check that each profile carries:

- `meta_title` in the dual-title pattern (CTR-optimized)
- `Person` JSON-LD with `additionalProperty` for Enneagram type, wing, tritype guess, instinctual stack guess
- `sameAs` to Wikipedia + IMDb + official site (entity confirmation — huge AEO win, very few celebrity Enneagram sites do this)
- 2 internal cross-links to `/personality-analysis/type/N`, 1 to `/personality-analysis/categories/[domain]`, 1 to a related person, 1 to a relevant `enneagram-corner` post

**The 126-name pipeline.** Prioritize by SERP difficulty × monthly searches (qualitative) — see "Pipeline triage" in section 12.

#### Cluster 1B — "[Type N] celebrities" head-term cluster

Pillar pages: `/personality-analysis/type/[1-9]` (✅, 9 pages)
**This is the highest-value cluster on the entire site you're not maximizing.** "Type 8 celebrities" and "Enneagram 4 celebrities" pull steady search volume and 9takes has the largest list per type with verified profiles.

Required upgrades to each `/personality-analysis/type/N` page:

| Section                                                                                          | Why                                |
| ------------------------------------------------------------------------------------------------ | ---------------------------------- |
| H1 = "Enneagram Type N Celebrities: [list size] Verified Profiles"                               | Direct SERP match                  |
| First-party stat callout: "Type N is X% of the 9takes corpus"                                    | AEO citation bait                  |
| `Most common domains for Type N` (already in corpus stats — feature it)                          | Internal data nobody else has      |
| Sortable/filterable list of all profiles for that type                                           | Solves "list-style" search intent  |
| FAQ block: "Who's the most famous Type N? / Are most CEOs Type N? / Is Type N rare?"             | Long-tail capture + FAQPage schema |
| 5 internal links to `/enneagram-corner/enneagram-type-N` and to corpus-stats `#per-type-domains` | Internal authority flow            |

Spokes:

| Spoke              | Primary                      | Secondary                                                                         | INTENT | DIFF | STATUS                                             |
| ------------------ | ---------------------------- | --------------------------------------------------------------------------------- | ------ | ---- | -------------------------------------------------- |
| Type 1 celebrities | enneagram type 1 celebrities | famous enneagram 1 / type 1 actors / type 1 reformer celebrities                  | Info   | Med  | 🟡 (page exists; needs the upgrades above)         |
| Type 2 celebrities | enneagram type 2 celebrities | enneagram 2 famous people / type 2 helper celebrities / female type 2 celebrities | Info   | Med  | 🟡                                                 |
| Type 3 celebrities | enneagram type 3 celebrities | type 3 achiever famous / enneagram 3 celebrities women / enneagram 3 athletes     | Info   | Med  | 🟡                                                 |
| Type 4 celebrities | enneagram type 4 celebrities | enneagram 4 musicians / famous individualists / enneagram 4 actors                | Info   | Med  | 🟡 (own this — Type 4 is 35% of your music corpus) |
| Type 5 celebrities | enneagram type 5 celebrities | enneagram 5 tech CEOs / famous investigators / type 5 founders                    | Info   | Med  | 🟡 (own this — 20% of your tech corpus is Type 5)  |
| Type 6 celebrities | enneagram type 6 celebrities | famous loyalists / enneagram 6 actors / type 6 athletes                           | Info   | Med  | 🟡                                                 |
| Type 7 celebrities | enneagram type 7 celebrities | famous enthusiasts / type 7 comedians / enneagram 7 celebrities women             | Info   | Med  | 🟡 (own this — 40% of your comedians are Type 7)   |
| Type 8 celebrities | enneagram type 8 celebrities | famous challengers / enneagram 8 actors / type 8 athletes                         | Info   | Med  | 🟡                                                 |
| Type 9 celebrities | enneagram type 9 celebrities | famous peacemakers / enneagram 9 actors / type 9 musicians                        | Info   | Med  | 🟡                                                 |

#### Cluster 1C — Domain × type cross-lists

Pillar: `/personality-analysis/categories` (✅ exists as an index)

Each of the 7 category pages can host **multiple high-intent long-tail spokes** by simply slicing the list:

| Spoke                                  | Example URL                                         | Intent | Status                                                                                   |
| -------------------------------------- | --------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------- |
| "Enneagram types of musicians"         | `/personality-analysis/categories/music` (✅)       | Info   | 🟡 — add type-skew callout: "35% of profiled musicians are Type 4 — 21pp above baseline" |
| "Comedian Enneagram types"             | `/personality-analysis/categories/comedy`           | Info   | 🟡 — add "40% are Type 7" callout                                                        |
| "Tech CEO Enneagram types"             | `/personality-analysis/categories/tech-business`    | Info   | 🟡 — add "20% are Type 5" callout                                                        |
| "Politician Enneagram types"           | `/personality-analysis/categories/politics-public`  | Info   | 🟡                                                                                       |
| "Author Enneagram types"               | `/personality-analysis/categories/authors-thinkers` | Info   | 🟡                                                                                       |
| "Influencer / creator Enneagram types" | `/personality-analysis/categories/creator-media`    | Info   | 🟡 — add "28% Type 3" callout                                                            |
| "Actor Enneagram types"                | `/personality-analysis/categories/film-tv`          | Info   | 🟡                                                                                       |

Each one of these should ALSO publish a sister blog at `/pop-culture/[domain]-enneagram-types-2026` to get a second URL ranking with editorial framing (the listicle/article variant of the database page). **Two URLs ranking for the same head term is normal and good when one is a database page and the other is editorial.**

#### Cluster 1D — Couple/pair/relationship pages (proposed, gap)

Examples already drafted in pop-culture but not as a cluster: `/personality-analysis/pair/[slug1]-and-[slug2]`. Would slot under personality-analysis cleanly.

| Spoke                                 | Primary                               | INTENT | DIFF | STATUS |
| ------------------------------------- | ------------------------------------- | ------ | ---- | ------ |
| Taylor Swift & Travis Kelce Enneagram | "taylor swift travis kelce enneagram" | Info   | Low  | 🔴 gap |
| Beyoncé & Jay-Z Enneagram             | "beyonce jay-z enneagram types"       | Info   | Low  | 🔴 gap |
| Harry & Meghan Enneagram              | "harry meghan enneagram"              | Info   | Low  | 🔴 gap |
| Kim & Kanye Enneagram                 | "kim kanye enneagram"                 | Info   | Low  | 🔴 gap |
| Bezos & Sanchez Enneagram             | "bezos sanchez enneagram"             | Info   | Low  | 🔴 gap |

(15–25 of these would saturate a rich long-tail head.)

---

### PILLAR 2 — `/pop-culture` (MDsvex, 55 files, 22 indexed)

**Pillar page:** `/pop-culture` (✅) — first thing: fix the sitemap gap.

This is the _cheapest_ head-term capture on the site. SERPs for "[Show] characters Enneagram" are dominated by Reddit threads, low-quality blogs, and Personality Database which doesn't write editorial.

#### Cluster 2A — "[Show/Movie] characters Enneagram"

| Spoke                            | Primary                         | Secondary                                                        | INTENT | DIFF | STATUS                                                    |
| -------------------------------- | ------------------------------- | ---------------------------------------------------------------- | ------ | ---- | --------------------------------------------------------- |
| Succession characters Enneagram  | "succession enneagram types"    | logan roy enneagram / kendall roy enneagram / shiv roy enneagram | Info   | Low  | ✅ exists (`succession-personality-trap`) — needs sitemap |
| Marvel characters Enneagram      | "marvel enneagram types"        | tony stark enneagram / steve rogers enneagram / thor enneagram   | Info   | Med  | ✅ exists — needs sitemap                                 |
| The Bear characters Enneagram    | "the bear enneagram"            | carmy berzatto enneagram / sydney enneagram / richie enneagram   | Info   | Low  | 🔴 gap                                                    |
| Severance characters Enneagram   | "severance enneagram"           | mark scout enneagram / helly r enneagram                         | Info   | Low  | 🔴 gap                                                    |
| White Lotus characters Enneagram | "white lotus enneagram"         | season-by-season character types                                 | Info   | Low  | 🔴 gap                                                    |
| Stranger Things Enneagram        | "stranger things enneagram"     | eleven enneagram / will byers enneagram                          | Info   | Low  | 🔴 gap                                                    |
| Ted Lasso characters Enneagram   | "ted lasso enneagram"           | ted enneagram / roy kent enneagram                               | Info   | Low  | 🔴 gap (likely already drafted somewhere)                 |
| Game of Thrones Enneagram        | "game of thrones enneagram"     | tyrion enneagram / cersei enneagram / jon snow enneagram         | Info   | Med  | 🔴 gap                                                    |
| Yellowstone Enneagram            | "yellowstone enneagram"         | john dutton enneagram / beth dutton enneagram                    | Info   | Low  | 🔴 gap                                                    |
| Euphoria characters Enneagram    | "euphoria enneagram"            | rue enneagram / cassie enneagram                                 | Info   | Low  | 🔴 gap                                                    |
| House of the Dragon Enneagram    | "house of the dragon enneagram" | rhaenyra enneagram / alicent enneagram                           | Info   | Low  | 🔴 gap                                                    |
| Avatar Last Airbender Enneagram  | "atla enneagram"                | aang enneagram / zuko enneagram / katara enneagram               | Info   | Low  | 🔴 gap                                                    |
| Bridgerton Enneagram             | "bridgerton enneagram"          | daphne enneagram / anthony enneagram                             | Info   | Low  | 🔴 gap                                                    |
| Wednesday characters Enneagram   | "wednesday addams enneagram"    | enid enneagram                                                   | Info   | Low  | 🔴 gap                                                    |

**Pattern:** every show that's currently top-of-Twitter gets a 1500-word post with 6–10 character profiles, each with a callout box. Cross-link to existing celebrity profiles where the actor exists (`Pedro Pascal` → "The Last of Us Enneagram").

#### Cluster 2B — Cultural moment / news jacking

Already a 9takes strength. Expand:

| Spoke                                                        | Status                 |
| ------------------------------------------------------------ | ---------------------- |
| "Trump Type 8 vs Biden Type 2"                               | ✅ exists              |
| "Kardashian family Enneagram"                                | ✅ exists, sitemap gap |
| "Royal family Enneagram"                                     | ✅ exists, sitemap gap |
| "Tech titans AI wars Enneagram"                              | ✅ exists, sitemap gap |
| "Depp vs Heard Enneagram"                                    | ✅ exists, sitemap gap |
| "Musk vs Altman Enneagram"                                   | ✅ exists, sitemap gap |
| "Pop queens Enneagram" (Taylor / Beyoncé / Olivia / Sabrina) | ✅ exists, sitemap gap |
| "Hollywood heartthrobs Enneagram"                            | ✅ exists, sitemap gap |

#### Cluster 2C — Subculture / archetype Enneagram

| Spoke                       | Primary                           | Status    |
| --------------------------- | --------------------------------- | --------- |
| Influencer Enneagram        | "influencer enneagram types"      | ✅ exists |
| Podcast bro Enneagram       | "podcast bros enneagram"          | ✅ exists |
| Online gurus Enneagram      | "online gurus enneagram"          | ✅ exists |
| OnlyFans creator Enneagram  | "onlyfans enneagram"              | ✅ exists |
| Reddit moderator Enneagram  | "reddit mod enneagram"            | ✅ exists |
| Incel Enneagram             | "incel enneagram"                 | ✅ exists |
| Twitter/X personality types | "twitter personalities enneagram" | ✅ exists |
| **Gym bros Enneagram**      | "gym bro enneagram"               | 🔴 gap    |
| **Crypto bros Enneagram**   | "crypto bro enneagram"            | 🔴 gap    |
| **Trad wives Enneagram**    | "trad wife enneagram"             | 🔴 gap    |
| **Booktok Enneagram**       | "booktok enneagram"               | 🔴 gap    |

#### Cluster 2D — Music & album-as-Enneagram

The Type 4 + 35% music skew is genuinely cite-worthy. Build a music sub-cluster.

| Spoke                                                                    | Primary                       | DIFF | STATUS |
| ------------------------------------------------------------------------ | ----------------------------- | ---- | ------ |
| Why most musicians are Type 4 (data piece)                               | "musicians enneagram type 4"  | Low  | 🔴 gap |
| Taylor Swift's eras as Enneagram types (already a Truity post — beat it) | "taylor swift eras enneagram" | Med  | 🔴 gap |
| Pop queens Enneagram                                                     | exists ✅                     |      |        |
| Rap Enneagram types                                                      | "rapper enneagram"            | Low  | 🔴 gap |
| Sad girl pop Enneagram                                                   | "sad girl pop enneagram"      | Low  | 🔴 gap |
| Country Enneagram                                                        | "country music enneagram"     | Low  | 🔴 gap |

---

### PILLAR 3 — `/enneagram-corner` (MDsvex, 160 files, 108 indexed)

**Pillar page:** `/enneagram-corner` (✅, recently audited and shipped — strong baseline).

Sub-pillars are the 8 subtopic pages:
`/enneagram-corner/subtopic/{nine-types,overview,development,relationships,workplace,situational,resources}` + `/enneagram-corner/mental-health` (✅).

This pillar's gaps aren't about _more topics_ — it's about **filling the SERP-money long tail you've already half-covered** and **finally turning each individual type into a real spoke with the corpus-stats backing**.

#### Cluster 3A — The 9 type pillar pages

Each of `/enneagram-corner/enneagram-type-N` already exists. Required upgrades:

| Section to add                                                                                | Reason                                             |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| First-party callout: "Type N is X% of 9takes' corpus of 319 public figures"                   | AEO citation, internal link to corpus-stats anchor |
| Wing sub-section linked to `/enneagram-corner/enneagram-wings-complete-guide#Nw(N-1)`         | Wing keyword absorption                            |
| Instinctual subtype sub-section linked to `/enneagram-corner/enneagram-instinctual-subtypes`  | Subtype keyword absorption                         |
| "Famous Type N" — list of 5–10 with link to `/personality-analysis/type/N`                    | Internal link bridge                               |
| "How Type N shows up in [music/comedy/tech/film]" with corpus stats                           | Cross-pillar bridge                                |
| FAQ Schema with 6 questions: rare? mistype? best wing? best career? compatibility? celebrity? | SERP feature capture                               |

#### Cluster 3B — Wings (large search demand, 9takes coverage thin per-wing)

You have one mega-guide (`enneagram-wings-complete-guide`). Build per-wing pages that link back to it:

| Wing      | Search demand                                        | STATUS |
| --------- | ---------------------------------------------------- | ------ |
| 1w9 / 1w2 | High aggregate                                       | 🔴 gap |
| 2w1 / 2w3 | High aggregate                                       | 🔴 gap |
| 3w2 / 3w4 | High aggregate                                       | 🔴 gap |
| 4w3 / 4w5 | **Highest aggregate** — also matches your music skew | 🔴 gap |
| 5w4 / 5w6 | High aggregate                                       | 🔴 gap |
| 6w5 / 6w7 | High aggregate                                       | 🔴 gap |
| 7w6 / 7w8 | High aggregate                                       | 🔴 gap |
| 8w7 / 8w9 | High aggregate ("8w9 The Bear")                      | 🔴 gap |
| 9w8 / 9w1 | High aggregate                                       | 🔴 gap |

That's 18 spoke pages. Cookie-cutter is fine — they're long-tail, intent-led, and each one cites your corpus.

#### Cluster 3C — Instinctual subtypes (27 subtypes — major underserved keyword cluster)

Already drafted in `drafts/27-enneagram-subtypes-outline`. Ship this. **The competitor SERPs here are weak** — Beatrice Chestnut's site, Integrative9, Narrative Enneagram are all academic/coaching-priced. 9takes can win with practical voice + first-party celebrity examples per subtype.

| Spoke                  | Primary                                                | DIFF | STATUS                                         |
| ---------------------- | ------------------------------------------------------ | ---- | ---------------------------------------------- |
| 27 subtypes overview   | "27 enneagram subtypes"                                | Low  | 🟡 (drafted)                                   |
| SP/SO/SX explained     | "instinctual variants enneagram"                       | Med  | 🟡 (you have `enneagram-instinctual-subtypes`) |
| Per-subtype pages × 27 | "sp 5 enneagram" / "so 9 enneagram" / "sx 4 enneagram" | Low  | 🔴 gap                                         |

A 27-page programmatic build using the same template (anchor: `enneagram-corner/subtypes/[type]-[instinct]`) would be a huge SERP land grab. Each page needs a real example or two from your celebrity corpus.

#### Cluster 3D — Type vs. type comparisons (head-term, very common SERP)

Truity, Psychology Junkie, Enneagram Institute all rank for "Enneagram 4 vs 5". 9takes has zero of these.

The 36 unique pairs are:

| Pair pattern                           | All 36 |
| -------------------------------------- | ------ |
| 1v2, 1v3, 1v4, 1v5, 1v6, 1v7, 1v8, 1v9 | (8)    |
| 2v3, 2v4, 2v5, 2v6, 2v7, 2v8, 2v9      | (7)    |
| 3v4, 3v5, 3v6, 3v7, 3v8, 3v9           | (6)    |
| 4v5, 4v6, 4v7, 4v8, 4v9                | (5)    |
| 5v6, 5v7, 5v8, 5v9                     | (4)    |
| 6v7, 6v8, 6v9                          | (3)    |
| 7v8, 7v9                               | (2)    |
| 8v9                                    | (1)    |

Don't ship 36. Ship **the 12 highest-volume**: 4v5, 5v6, 6v7, 2v3, 3v4, 8v9, 1v2, 7v8, 1v9, 2v6, 3v7, 4v9. Each `/enneagram-corner/type-N-vs-type-M`. Cookie-cutter template:

1. Quick comparison table
2. Core motivations (different)
3. Where they overlap (mistype warning)
4. Famous examples on both sides — pulled from `blogs_famous_people`
5. How to tell yourself apart
6. FAQ schema

#### Cluster 3E — Mistypes ("often mistaken for")

Sister cluster to 3D. Each of the 9 types gets a "Type N often mistyped as…" page. 9 pages, low difficulty, captures the disambiguation searcher who's already typed.

| Spoke           | Primary                                                  | STATUS |
| --------------- | -------------------------------------------------------- | ------ |
| Type 1 mistypes | "type 1 mistype"                                         | 🔴 gap |
| Type 2 mistypes | "type 2 mistype"                                         | 🔴 gap |
| Type 3 mistypes | "type 3 mistype"                                         | 🔴 gap |
| Type 4 mistypes | "type 4 mistype" / "am i a 4 or a 9" / "am i a 4 or a 6" | 🔴 gap |
| Type 5 mistypes | "type 5 mistype" / "am i a 5 or a 6"                     | 🔴 gap |
| Type 6 mistypes | "type 6 mistype" / "am i a 6 or a 9"                     | 🔴 gap |
| Type 7 mistypes | "type 7 mistype" / "am i a 7 or a 3"                     | 🔴 gap |
| Type 8 mistypes | "type 8 mistype" / "am i an 8 or a 1"                    | 🔴 gap |
| Type 9 mistypes | "type 9 mistype" / "am i a 9 or a 4"                     | 🔴 gap |

#### Cluster 3F — Tritype (very weak SERPs, low competition)

Tritype searches go mostly to Katherine Fauvre's gated test. 9takes can publish:

| Spoke                                                                                   | Primary                     | STATUS |
| --------------------------------------------------------------------------------------- | --------------------------- | ------ |
| Tritype 101                                                                             | "what is enneagram tritype" | 🔴 gap |
| Tritype + center                                                                        | "tritype heart head gut"    | 🔴 gap |
| 27 tritype combinations                                                                 | "all tritype combinations"  | 🔴 gap |
| Per-tritype pages (top 12 — 478, 125, 729, 369, 145, 258, 369, 468, 578, 631, 729, 943) | "478 tritype" etc.          | 🔴 gap |

#### Cluster 3G — Cross-system bridges (high search demand, weak SERPs)

These pull volume from the _other_ system's audience.

| Spoke                         | Primary                          | DIFF | STATUS                                                                                   |
| ----------------------------- | -------------------------------- | ---- | ---------------------------------------------------------------------------------------- |
| Enneagram + MBTI correlation  | "enneagram mbti correlation"     | Med  | 🟡 (`enneagram-vs-meyers-briggs` ✅, but doesn't include the correlation table — add it) |
| Enneagram + Big Five          | "enneagram big five correlation" | Low  | 🔴 gap                                                                                   |
| Enneagram + Astrology         | "enneagram astrology"            | Med  | ✅ exists                                                                                |
| Enneagram + Attachment styles | "enneagram attachment styles"    | Med  | ✅ exists                                                                                |
| Enneagram + Love Languages    | "enneagram love languages"       | Med  | ✅ exists                                                                                |
| Enneagram + Human Design      | "enneagram human design"         | Low  | 🔴 gap (huge growing search)                                                             |
| Enneagram + DISC              | "enneagram disc"                 | Low  | 🔴 gap                                                                                   |
| Enneagram + Strengths Finder  | "enneagram cliftonstrengths"     | Low  | 🔴 gap                                                                                   |

#### Cluster 3H — Levels of development (massive gap; Enneagram Institute moat)

Riso-Hudson's 9 levels are a head-term cluster everyone except Enneagram Institute treats badly.

| Spoke                             | Primary                                         | DIFF | STATUS |
| --------------------------------- | ----------------------------------------------- | ---- | ------ |
| Levels of development overview    | "enneagram levels of development"               | High | 🔴 gap |
| Healthy vs unhealthy Type N (× 9) | "healthy type N enneagram" / "unhealthy type N" | Med  | 🔴 gap |

---

### PILLAR 4 — `/how-to-guides` (MDsvex, 24 files, 12 indexed)

**Pillar page:** `/how-to-guides` (✅) — fix sitemap gap first; half the section is invisible.

Practical guide pillar. The voice DJ wants here is _Tactically Direct + Results-Driven_. SEO-wise, this section captures **commercial-intent** searchers (people about to buy a coaching session, a course, or an info product).

#### Cluster 4A — Communication & conflict scripts (commercial intent)

| Spoke                               | Primary                         | DIFF | STATUS                                           |
| ----------------------------------- | ------------------------------- | ---- | ------------------------------------------------ |
| 5 tough conversations w/ partner    | exists ✅                       |      |                                                  |
| Conflict resolution scripts by type | "enneagram conflict resolution" | Med  | 🔴 gap                                           |
| Apology by type                     | "how to apologize enneagram"    | Low  | 🟡 (in `/enneagram-corner` — promote/cross-link) |
| Boundary scripts by type            | "enneagram boundaries"          | Low  | 🔴 gap                                           |
| Active listening guide              | "active listening enneagram"    | Low  | ✅ exists, draft                                 |
| Difficult feedback by type          | "give feedback enneagram type"  | Low  | 🔴 gap                                           |

#### Cluster 4B — Productivity / personality-maxing (commercial intent + brand-distinctive)

| Spoke                        | Primary                     | DIFF | STATUS |
| ---------------------------- | --------------------------- | ---- | ------ |
| Productivity systems by type | exists ✅                   |      |        |
| Morning routines by type     | "enneagram morning routine" | Low  | 🔴 gap |
| Habit formation by type      | "habits by enneagram type"  | Low  | 🔴 gap |
| Focus / deep work by type    | "enneagram focus"           | Low  | 🔴 gap |
| Goal setting by type         | "enneagram goal setting"    | Low  | 🔴 gap |

#### Cluster 4C — Self-development / shadow work

| Spoke                          | Primary                      | DIFF | STATUS                        |
| ------------------------------ | ---------------------------- | ---- | ----------------------------- |
| Definitive self-efficacy guide | exists ✅                    |      |                               |
| Shadow work by type            | "shadow work enneagram type" | Med  | ✅ exists in enneagram-corner |
| Hidden strengths by type       | exists ✅                    |      |                               |
| Self-talk by type              | "enneagram self-talk"        | Low  | ✅ exists in enneagram-corner |

#### Cluster 4D — Mental health practical (high-volume, sensitive)

| Spoke                      | Primary                       | DIFF | STATUS                                                        |
| -------------------------- | ----------------------------- | ---- | ------------------------------------------------------------- |
| Fighting depression guide  | exists ✅                     |      |                                                               |
| Anxiety management by type | exists ✅ in enneagram-corner |      |                                                               |
| ADHD by type               | "adhd enneagram"              | Low  | ✅ exists in enneagram-corner                                 |
| Burnout by type            | "burnout enneagram"           | Low  | 🔴 gap                                                        |
| Therapy by type            | "therapy enneagram type"      | Low  | 🟡 exists ("why-therapy-doesnt-work-the-same-for-every-type") |
| Sleep by type              | "enneagram sleep"             | Low  | 🔴 gap                                                        |

---

### PILLAR 5 — `/community` (MDsvex, 35 files, 17 indexed)

**Pillar page:** `/community` (✅) — sitemap gap (50% missing).

This is the **brand voice / philosophy** pillar. It's not where head terms live — it's where the _9takes worldview_ gets indexed and where AI search engines learn what 9takes uniquely thinks. Light SEO, heavy AEO.

#### Cluster 5A — The 9takes worldview (low-volume, high-trust)

Already strong:

- introducing-9takes ✅
- consensus-on-human-nature ✅
- mbti-vs-enneagram ✅
- personality-frameworks-map-not-territory ✅
- inspiration-for-9takes ✅
- why-the-greek-vibe ✅

Action: link **into** these from the rest of the site, not the other way around. They're _destination_ pages for "what does 9takes believe about X."

#### Cluster 5B — "Circumstances layer" content (per domain-authority master index, this is your TOP gap)

The Trust Onion outer layer (per `/Users/djwayne/9takes/docs/domain-authority/00-master-index.md`). These are basically op-eds with first-party data:

| Spoke                                        | Primary                      | DIFF | STATUS                                  |
| -------------------------------------------- | ---------------------------- | ---- | --------------------------------------- |
| Why dating apps are harder for some types    | "dating apps enneagram"      | Low  | ✅ exists in enneagram-corner — promote |
| Algorithm-by-type                            | "algorithm personality type" | Low  | 🔴 gap                                  |
| Workplace policies that favor certain types  | "workplace bias personality" | Med  | 🔴 gap                                  |
| Hustle culture burns out 2s and 9s           | "hustle culture enneagram"   | Low  | 🔴 gap                                  |
| Therapy doesn't work the same for every type | exists ✅                    |      |                                         |
| Education system failed these types          | "education enneagram"        | Low  | 🔴 gap                                  |
| Why 7s designed social media                 | "social media enneagram 7"   | Low  | 🔴 gap                                  |

These are perfect for community — they validate before they teach.

---

## 2. Cross-pillar keyword clusters

### 2A — "[Celebrity] Enneagram type" — already covered above (Cluster 1A). 319 published, 126 in pipeline.

**Trending names not yet in your published corpus that are SERP gold (sample, not exhaustive — re-run when pipeline is reviewed):**

- Pedro Pascal (you have him ✅)
- Sabrina Carpenter (check)
- Chappell Roan
- Charli XCX (Brat era keyword peak)
- Sydney Sweeney
- Glen Powell
- Jacob Elordi
- Anya Taylor-Joy
- Bad Bunny
- Karol G
- Olivia Rodrigo
- Doja Cat
- Tate McRae
- Jenna Ortega
- Hailey Bieber
- Alex Cooper (call her her own — not just in beef post)
- Nara Smith / trad wife stars
- Bobbi Althoff
- Rachel Zegler
- Mikey Madison
- Greta Gerwig
- Ayo Edebiri (Bear)
- Quinta Brunson
- Tom Holland (separate from Zendaya)
- Mr Beast (check)
- Hasan Piker
- Ben Shapiro / Tim Pool / political YouTubers
- Sam Hyde / Theo Von / Bert Kreischer (comedy)
- Joe Burrow / Patrick Mahomes / Caitlin Clark / WNBA stars
- Andrew Tate (you may have him in tech-titans / online gurus — confirm individual page)
- Pavel Durov / Brian Armstrong / Vitalik Buterin (crypto founders)

DJ should run his pipeline `Britney-Spears`, `Clint-Eastwood`, `Robin-Williams`, `Stephen-Hawking`, `Mahatma-Gandhi`, `Mother-Teresa`, `Pamela-Anderson` etc. against current SERP volume — most are evergreen. **Highest-leverage drafts in current pipeline: Stephen Hawking (Type 5 cite for the 30.8% Authors stat), Mahatma Gandhi (Type 1/2 — Politics skew), Mother Teresa (Type 2 — Politics skew), Britney Spears (Type 4 — Music skew).**

### 2B — "[Show] characters Enneagram" — covered in Cluster 2A.

### 2C — "[Type] vs [Type]" — covered in Cluster 3D.

### 2D — "[Type] in [context]" — context-specific clusters

| Context                       | Pages needed            | STATUS                                                     |
| ----------------------------- | ----------------------- | ---------------------------------------------------------- |
| Type N in relationships (× 9) | One per type, evergreen | 🟡 partial (compatibility matrix exists; per-type doesn't) |
| Type N at work (× 9)          | One per type            | 🟡 partial                                                 |
| Type N parenting (× 9)        | One per type            | 🔴 gap (per master index, completely untapped)             |
| Type N as a child (× 9)       | One per type            | 🔴 gap                                                     |
| Type N friendship (× 9)       | One per type            | 🔴 gap                                                     |
| Type N dating apps (× 9)      | One per type            | 🔴 gap                                                     |
| Type N in conflict (× 9)      | One per type            | 🔴 gap                                                     |

### 2E — Subtypes / wings / instinctual stackings — covered in Clusters 3B + 3C + 3F.

### 2F — Tritype combos — covered in Cluster 3F.

### 2G — Enneagram + [other system]

Covered in Cluster 3G. Note that **"Enneagram + Astrology" + "Enneagram + Human Design"** are growing fastest.

### 2H — Mistyped as / often mistaken for — covered in Cluster 3E.

### 2I — Generational + Enneagram

Almost no competitor coverage. 9takes can own this:

| Spoke                            | Primary                 | DIFF | STATUS                   |
| -------------------------------- | ----------------------- | ---- | ------------------------ |
| Gen Z Enneagram distribution     | "gen z enneagram"       | Low  | 🔴 gap                   |
| Millennial Enneagram trends      | "millennial enneagram"  | Low  | 🔴 gap                   |
| Boomer Enneagram                 | "boomer enneagram"      | Low  | 🔴 gap                   |
| Gen Alpha early signals          | "gen alpha personality" | Low  | 🔴 gap                   |
| "Why Gen Z gravitates to type 4" | "gen z type 4"          | Low  | 🔴 gap (op-ed, AEO bait) |

---

## 3. AEO / LLM-citation strategy

The corpus stats file is _the_ AEO play. Here's how to weaponize it across the site so when a user asks ChatGPT/Claude/Perplexity an Enneagram question, **the first first-party data the model has indexed is 9takes'**.

### Why it works

LLMs cite pages that have:

1. Discrete, machine-extractable claims (numbers, percentages, sample sizes)
2. Stable URLs with deep-link anchors
3. Schema.org typing (Dataset, FAQPage, Quotation)
4. Reciprocal cross-citations from authoritative editorial pages

You already have (1) and (2) on `/corpus-stats`. The work is propagating (3) and (4) across the rest of the site.

### 25 specific citation-bait surfaces

For each row: where to put it / the exact stat / the question it answers / the schema type.

| #   | Surface (URL/section)                                       | Stat to feature                                                                                                                                                                    | Question answered                                                                                                                  | Schema                                                               |
| --- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 1   | `/personality-analysis/type/3` hero                         | "Type 3 is the most common type in 9takes' corpus at 20.1% of 319 figures."                                                                                                        | What's the most common Enneagram type?                                                                                             | `Quotation` + `Person.additionalProperty`                            |
| 2   | `/personality-analysis/type/4` hero                         | "Type 4 is over-represented in music — 35.1% of profiled musicians, +21pp above baseline."                                                                                         | Are most musicians Type 4?                                                                                                         | `Quotation`                                                          |
| 3   | `/personality-analysis/type/5` hero                         | "Type 5 is over-represented in tech — 20% of profiled founders, +13pp above baseline."                                                                                             | Are tech founders Type 5?                                                                                                          | `Quotation`                                                          |
| 4   | `/personality-analysis/type/7` hero                         | "Type 7 is over-represented in comedy — 40% of profiled comedians, +27pp above baseline."                                                                                          | Are most comedians Type 7?                                                                                                         | `Quotation`                                                          |
| 5   | `/personality-analysis/categories/music` lede               | Same Type 4 / 35.1% / 21pp stat                                                                                                                                                    | What Enneagram type are musicians?                                                                                                 | `Dataset` reference + `Quotation`                                    |
| 6   | `/personality-analysis/categories/comedy` lede              | Type 7 / 40% / 27pp                                                                                                                                                                | What Enneagram type are comedians?                                                                                                 | `Quotation`                                                          |
| 7   | `/personality-analysis/categories/tech-business` lede       | Type 5 / 20% / 13pp                                                                                                                                                                | Are tech founders Type 5?                                                                                                          | `Quotation`                                                          |
| 8   | `/personality-analysis/categories/politics-public` lede     | Type 2 / 17% / 9pp                                                                                                                                                                 | What Enneagram type are politicians?                                                                                               | `Quotation`                                                          |
| 9   | `/personality-analysis/categories/authors-thinkers` lede    | Type 5 / 30.8% / 24pp                                                                                                                                                              | What type are most authors?                                                                                                        | `Quotation`                                                          |
| 10  | `/personality-analysis/categories/film-tv` lede             | Type 9 / 14.9% / 5.5pp; Type 2 / 12.3% / 4.4pp                                                                                                                                     | What type are actors?                                                                                                              | `Quotation`                                                          |
| 11  | `/personality-analysis/categories/creator-media` lede       | Type 3 / 28.4% / 8.3pp; Type 7 / 21.6% / 8.1pp                                                                                                                                     | What type are influencers?                                                                                                         | `Quotation`                                                          |
| 12  | `/enneagram-corner/enneagram-tldr` body                     | Corpus stats overview ("319 figures, Type 3 most common")                                                                                                                          | What's the rarest Enneagram type? (you actually have small-sample evidence here — Type 1 absent in music, Type 5 absent in comedy) | `Quotation`                                                          |
| 13  | `/enneagram-corner/enneagram-faqs` (already FAQPage)        | Add 3 stat-driven Qs                                                                                                                                                               | Is Type 5 rare? Are most artists Type 4?                                                                                           | `FAQPage`                                                            |
| 14  | `/enneagram-corner/enneagram-types-and-career-choices`      | Domain-by-domain breakdown sourced from corpus                                                                                                                                     | What jobs are best for Type N?                                                                                                     | `Quotation`                                                          |
| 15  | `/enneagram-corner/enneagram-leadership`                    | "Type 3 dominates corporate corpus (28% in tech-business); Type 8 second"                                                                                                          | What Enneagram is best for leadership?                                                                                             | `Quotation`                                                          |
| 16  | `/community/mbti-vs-enneagram`                              | Cross-cite the corpus + sample size                                                                                                                                                | How does 9takes' corpus compare to MBTI distribution?                                                                              | `Quotation`                                                          |
| 17  | `/personality-analysis` hub above-the-fold                  | Overall corpus headline ("Largest first-party Enneagram-by-domain dataset online: 319 figures, 7 categories")                                                                      | How big is 9takes' celebrity Enneagram database?                                                                                   | `Dataset` (already shipped on /corpus-stats — link, don't duplicate) |
| 18  | `/pop-culture` hub                                          | Domain skew teasers                                                                                                                                                                | Why do certain Enneagram types cluster in entertainment?                                                                           | `Quotation`                                                          |
| 19  | `/enneagram-corner/enneagram-vs-meyers-briggs`              | First-party rebuttal of "MBTI is more rigorous": cite corpus methodology                                                                                                           | Is the Enneagram scientific?                                                                                                       | `Quotation`                                                          |
| 20  | `/enneagram-corner/enneagram-criticisms`                    | Use corpus methodology section as response to "no evidence" critique                                                                                                               | Does the Enneagram have evidence?                                                                                                  | `Quotation`                                                          |
| 21  | `/how-to-guides/personality-maxing-notes`                   | Cite domain skews as proof of "nature of the niche"                                                                                                                                | Do certain Enneagram types pick certain careers?                                                                                   | `Quotation`                                                          |
| 22  | New page `/enneagram-corner/which-enneagram-type-is-rarest` | First-party take: "In 9takes' 319-figure corpus, Types 1 and 5 tie for least represented at 6.9%, but methodologically that may reflect public visibility, not population rarity." | What is the rarest Enneagram type?                                                                                                 | `Quotation` + `FAQPage`                                              |
| 23  | New page `/enneagram-corner/most-common-enneagram-type`     | First-party take: "Type 3 is most common in 9takes' corpus at 20.1%, dominating Tech (28%), Creators (28%), and Film & TV (18%)."                                                  | Most common Enneagram type                                                                                                         | `Quotation` + `FAQPage`                                              |
| 24  | `/corpus-stats#per-type-domains` (existing anchor)          | Already AEO-optimized                                                                                                                                                              | Where does each Enneagram type cluster?                                                                                            | `Dataset` (shipped)                                                  |
| 25  | New page `/enneagram-corner/enneagram-statistics-2026`      | Annual update post pulling all corpus stats with chart screenshots — link to fresh corpus-stats anchor                                                                             | Enneagram type statistics                                                                                                          | `Dataset` reference + `Article`                                      |

### Schema patterns to adopt site-wide

**`Quotation` JSON-LD** wherever you embed a corpus-stat callout. Sample shape:

```json
{
	"@type": "Quotation",
	"text": "Type 4 is over-represented among musicians at 35.1% — 21 percentage points above the 9takes corpus baseline.",
	"isBasedOn": { "@id": "https://9takes.com/corpus-stats#dataset" },
	"creator": { "@id": "https://9takes.com/#organization" }
}
```

**`Person.additionalProperty`** on every personality-analysis page (you already do this for type — extend to wing, instinctual stack guess, tritype guess).

**`HowTo` schema** on the practical guides — almost no one in this niche uses it. Each `/how-to-guides/*` should be `HowTo` with explicit `step` items.

**`speakable` + voice-friendly TLDR boxes** at the top of every type page. Models trained on TTS data weight these.

---

## 4. Quick wins (next 30 days)

10 specific edits, ranked by ROI.

| #   | URL / file                                                                                                       | Edit                                                                                                                                                                                                                                     | Reason                                                                                                               |
| --- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 1   | `scripts/generate-sitemap.js` + `static/sitemap.xml`                                                             | Surface ALL 35 community + 24 how-to-guides + 55 pop-culture files. Audit `published: true` flags.                                                                                                                                       | The single biggest miss on the site. ~75 indexable URLs are invisible to Google.                                     |
| 2   | `/personality-analysis/type/[1-9]` (9 pages)                                                                     | Add corpus-stat callout (e.g., "Type 4 is 14.1% of 9takes' 319-figure corpus and 35% of musicians"), 3 internal links to corpus-stats anchors, FAQ block (rare/famous/career/wing/compatibility/mistype)                                 | These pages already exist and rank for high-volume head terms. Each callout/FAQ adds AEO + SERP feature eligibility. |
| 3   | `/personality-analysis/categories/[slug]` (7 pages)                                                              | Already strong post your audit. Add per-category corpus-stat callout if not present (LP3 covers it; double-check delta % is in body copy).                                                                                               | Consolidates your domain-skew moat.                                                                                  |
| 4   | `/enneagram-corner/enneagram-faqs`                                                                               | Add 6 corpus-stat FAQs (most common type? rarest? are musicians 4s? are tech founders 5s? etc.) and update FAQPage schema                                                                                                                | FAQ rich-result eligibility for very-high-volume queries.                                                            |
| 5   | `/enneagram-corner/enneagram-types-and-career-choices`                                                           | Rewrite using domain skews as the first-party hook. "Truity says X. Our corpus of 319 figures shows…"                                                                                                                                    | Beat Truity/Brainmanager/Insightglobal SERPs with first-party data.                                                  |
| 6   | `/community/mbti-vs-enneagram`                                                                                   | Insert a corpus-stats sidebar referencing your sample size; cross-link to `/corpus-stats` and `/enneagram-corner/enneagram-vs-personality-frameworks-comparison`                                                                         | High-traffic cross-system page; underexploited.                                                                      |
| 7   | `/pop-culture/marvel-universe-enneagram-analysis` + 17 other pop-culture posts                                   | Fix sitemap (#1) + add `RelatedPosts` block (existing component) at the bottom, 5 links each, including 1 to `/personality-analysis/type/N` and 1 to corpus-stats                                                                        | Your 28 isolated pop-culture posts have zero internal incoming links per the audit. Compounds with #1.               |
| 8   | All 24 `/how-to-guides/*`                                                                                        | Add `HowTo` JSON-LD with explicit steps. Cite first-party stat at the top.                                                                                                                                                               | No competitor uses HowTo schema in this niche. Free SERP differentiation.                                            |
| 9   | `/stories/enneagram-and-mental-illness`                                                                          | **Light touch only** (per memory). Add a single corpus-stats callout box ("This article cites internal data from 9takes' 319-profile corpus — see /corpus-stats") and one `Quotation` JSON-LD. Don't change the URL, title, H1, or meta. | Top-traffic page; sharing AEO signal upward.                                                                         |
| 10  | Title/meta hygiene pass — `src/lib/components/blog/BlogPageHead.svelte` and `PeopleBlogPageHead.svelte`          | 269 titles + 125 meta descriptions over snippet length per 2026-04-07 audit. Set hard budgets (60/155 chars), cut.                                                                                                                       | Already flagged in audit; still open.                                                                                |
| 11  | Twitter cards: switch all article templates from `summary` to `summary_large_image`                              | Per 2026-04-07 audit, still open.                                                                                                                                                                                                        | CTR lift on social SERP previews.                                                                                    |
| 12  | Add `/enneagram-test` to internal-link sidebar of every `/personality-analysis/*` and `/enneagram-corner/*` page | Bridge to a high-conversion page that currently leaks authority.                                                                                                                                                                         | Connects an under-linked conversion asset.                                                                           |
| 13  | `/personality-analysis` hub                                                                                      | Ensure the ItemList of categories includes corpus deltas (not just names).                                                                                                                                                               | Hub becomes a self-explanatory entity tree for crawlers.                                                             |
| 14  | All celebrity profiles: confirm `sameAs` (Wikipedia/IMDb/Wikidata) on `Person` schema                            | Most of the niche skips this. Wikidata sameAs is the strongest entity-resolution signal you can give Google.                                                                                                                             | Compounds across 319 pages.                                                                                          |
| 15  | `/enneagram-test` page itself                                                                                    | Verify it's emitting `WebApplication` or `Quiz`-class JSON-LD; add a TLDR + 3 FAQs to capture "enneagram test" queries (246k/mo per your domain-authority doc)                                                                           | Currently the test landing is a major head-term funnel and likely under-monetized for SEO.                           |

---

## 5. Search-intent ladder for `/questions`

The Q&A platform is _not_ a blog. It's a give-first product. SEO has to respect that. But there's real long-tail demand the platform can capture.

### Question-page archetypes by intent

| Archetype                                            | Example                                           | Search demand           | What the page must show publicly to rank                                                                                                                |
| ---------------------------------------------------- | ------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Disambiguation question ("Why does my partner do X") | "Why does my partner shut down during arguments?" | High long-tail          | Question, context, AI perspective preview, related questions, related blog post (e.g., `enneagram-stress-number`)                                       |
| Identity question ("Am I a 4 or a 9")                | "Am I a Type 4 or a Type 9?"                      | Steady volume           | Question, mistype framework, link to `/enneagram-corner/type-4-vs-type-9` (when it exists), preview perspectives                                        |
| Situation question ("How do I deal with X")          | "How do I deal with a Type 8 boss?"               | Medium long-tail        | Question, link to `/how-to-guides/communication`, related question cluster, AI perspective preview                                                      |
| Belief question ("Does the Enneagram work")          | "Is the Enneagram scientifically valid?"          | Medium head-term        | Question, link to `/enneagram-corner/enneagram-criticisms` and `/community/personality-frameworks-map-not-territory`, AI preview, corpus-stats citation |
| Pop culture question ("What type is X")              | "What Enneagram is Pedro Pascal?"                 | High head-term per name | Question, **direct link** to the live celebrity profile, AI preview, FAQ                                                                                |

### Siloing problems and bridges to add

The 107 indexed question pages and the 460+ blog/profile pages currently barely connect. Add these bridges:

1. **From every blog post** with a "but this depends on context" theme → a "discuss this on /questions" CTA linking to the topical category page (`/questions/categories/relationships`, `/questions/categories/mental-health`).
2. **From every question detail page** → 3–5 related blog posts via `question_keywords` retrieval (your audit recommended this; still open).
3. **From every question category page** → the matching enneagram-corner / how-to-guides / pop-culture pillar (e.g., `/questions/categories/relationships` → `/enneagram-corner/enneagram-compatibility-matrix` + `/how-to-guides/dating-dynamics-by-enneagram-type`).
4. **From `/personality-analysis/type/N` pages** → "Questions about Type N" filtered listing (a new `/questions/categories/type-N` if it doesn't exist, otherwise filter).
5. **From `/corpus-stats` FAQ** → relevant question category pages so the AEO signal flows downward into the give-first product.

### Metadata patterns that would make question pages rank

(Synthesized from the existing 2026-04-07 question-page recommendations doc, plus what's not yet shipped.)

1. **Preserve the full question in `<title>`** — long-tail head matching matters more than 60-char hygiene on these pages.
2. **Render `context` publicly** — the schema field exists, the UI doesn't submit. Until that ships, every question page is text-thin.
3. **Add a "What people are saying" public summary** once a question has 3+ real comments. AI-generated, human-reviewed, factual.
4. **Move from `WebPage` → `DiscussionForumPosting`** once the page exposes any visible answer text. Don't use `QAPage` until answers are fully public.
5. **Internal-link block: 3–8 related questions + 2 blog posts.**

### High-priority question category pages

Per your sitemap there are 107 question URLs but only some category pages. Each category page should be a **mini-pillar**:

- `/questions/categories/relationships` — link out to enneagram-corner relationships content
- `/questions/categories/work` — link to workplace content
- `/questions/categories/dating` — link to dating guides
- `/questions/categories/mental-health` — link to mental-health subdirectory
- `/questions/categories/family-parenting` — link to (not yet existing) parenting content
- `/questions/categories/personality-typing` — link to mistype/comparison pages
- `/questions/categories/celebrity` (or "pop culture") — link to `/personality-analysis` and `/pop-culture`

Each category page = 200-word intro, list of top 10 questions, 3 outbound links to blog content.

---

## 6. Competitor positioning (brief — research analyst is doing the deep dive)

| Competitor                       | Their strength                                    | 9takes' counter                                                                                                                       |
| -------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Enneagram Institute              | Theory authority, Riso-Hudson levels, original IP | Modern voice, real celebrity data, no paywall                                                                                         |
| Truity                           | Test funnel, listicles, broad volume              | First-party domain stats they don't have; sharper voice                                                                               |
| Personality Hacker               | MBTI-skewed coaching                              | Enneagram-native; pop-culture-native                                                                                                  |
| Eclectic Energies                | Free test, type descriptions                      | Same SERP space, but 9takes adds celebrity entity graph + AEO data                                                                    |
| Personality Database (boo.world) | Massive crowdsourced database, 50+ systems        | They're horizontal; 9takes goes vertical-deep on Enneagram. They don't write editorial. 9takes' moat = editorial + first-party stats. |
| Reddit r/Enneagram               | Fresh long-tail thread coverage, community        | Reddit threads can't be cited or linked-to with confidence; 9takes can be the "stable URL" alternative                                |
| Psychology Junkie                | Strong listicles, type comparisons                | Same content shape but 9takes can publish first-party stats — a thing she literally cannot                                            |
| Crystal Knows                    | Workplace API integrations (B2B)                  | 9takes wins on consumer/cultural side; not their fight                                                                                |

**The 9takes positioning sentence:** _"The largest editorial Enneagram-meets-pop-culture database online — with first-party domain stats nobody else has, and a give-first community where the typing gets debated, not just declared."_ That's the moat. Build everything around it.

---

## 7. Internal-link architecture recommendations

The site has four "graphs" that don't talk to each other enough:

1. **Personality-analysis graph** (319 profiles + 7 categories + 9 type pages + hub) — internally well-connected.
2. **Enneagram-corner graph** (108 pages) — well-connected post your audit.
3. **Pop-culture / community / how-to-guides graph** — sparsely connected per the cross-link report (40 isolated, 28 with zero outgoing).
4. **Questions graph** — almost entirely isolated from 1-3.

### The 9 bridge classes that need to exist

| Bridge                          | From                                     | To                                                       | Volume            |
| ------------------------------- | ---------------------------------------- | -------------------------------------------------------- | ----------------- |
| Type pillar ↔ profile cards    | `/enneagram-corner/enneagram-type-N`     | `/personality-analysis/type/N` (and 5 sample profiles)   | 9 × ~6 = 54 links |
| Type pillar ↔ wing             | `/enneagram-corner/enneagram-type-N`     | `/enneagram-corner/Nw(N-1)` and `Nw(N+1)` (when shipped) | 9 × 2 = 18        |
| Type pillar ↔ subtypes         | `/enneagram-corner/enneagram-type-N`     | `/enneagram-corner/subtypes/N-sp`, `-so`, `-sx`          | 9 × 3 = 27        |
| Profile ↔ type pillar          | `/personality-analysis/[name]`           | `/enneagram-corner/enneagram-type-N`                     | 319 × 1 = 319     |
| Profile ↔ category             | `/personality-analysis/[name]`           | `/personality-analysis/categories/[domain]`              | 319               |
| Profile ↔ corpus-stats         | `/personality-analysis/[name]`           | `/corpus-stats#domain-{slug}` (hash anchor)              | 319               |
| Pop-culture ↔ profiles         | `/pop-culture/[show]-enneagram-analysis` | 5 profile pages each                                     | 22 × 5 = 110      |
| Pop-culture ↔ enneagram-corner | `/pop-culture/[show]`                    | 2 corner pages each                                      | 22 × 2 = 44       |
| Questions ↔ blog               | Each question page or category           | 3 related blog posts                                     | scale per page    |

Use the existing `getRelatedBlogs` / `getCrossLinkSuggestions` utilities (`src/lib/components/molecules/blogIndex.ts`) to automate (1)–(4). For (7)–(9), wire `question_keywords` into a retrieval lookup.

### Hub pages to add or upgrade

- `/personality-analysis/type/[1-9]` — already pillar pages; treat as "Type N hub" formally with 5-link sidebar to: corner type page, wings, subtypes, top profiles, corpus deltas.
- New `/enneagram-corner/wings` — pillar page over the 18 wing spokes (one mega-guide already exists; needs dedicated index page format).
- New `/enneagram-corner/subtypes` — pillar page over the 27 subtype spokes.
- New `/enneagram-corner/comparisons` — pillar page over the 12 vs. comparison spokes.
- New `/enneagram-corner/mistypes` — pillar page over the 9 mistype spokes.

---

## 8. 30 / 60 / 90-day execution plan

### Days 1–30 (foundation + AEO)

| Priority | Task                                                                                                              | Owner        | Outcome                                            |
| -------- | ----------------------------------------------------------------------------------------------------------------- | ------------ | -------------------------------------------------- |
| P0       | Fix sitemap to surface all pop-culture, community, how-to-guides files                                            | DJ / scripts | +75 indexable URLs                                 |
| P0       | Title + meta description budget pass on `BlogPageHead` + `PeopleBlogPageHead`                                     | Eng          | 394 over-length tags fixed                         |
| P0       | Switch article templates from `twitter:card=summary` → `summary_large_image`                                      | Eng          | CTR lift                                           |
| P1       | Upgrade 9 `/personality-analysis/type/[1-9]` pages with corpus stat callout + FAQ + cross-links                   | Content      | 9 pages move on head terms                         |
| P1       | Quick wins #4, #5, #6 (faqs, careers, mbti-vs page corpus tie-ins)                                                | Content      | AEO citation density                               |
| P1       | Fix isolated pop-culture cluster — add `RelatedPosts` to all 22+ pop-culture pages                                | Content      | 110 new internal links                             |
| P1       | Quotation schema embeds on the 25 AEO surfaces in section 3                                                       | Eng          | LLM-citation eligibility                           |
| P2       | Ship `/enneagram-corner/which-enneagram-type-is-rarest` + `/most-common-enneagram-type` (AEO bait)                | Content      | 2 high-intent low-difficulty wins                  |
| P2       | Run `gen:crosslinks` and audit; add internal links to the 27 isolated posts                                       | Content      | Crawl depth improves                               |
| P2       | Promote the "Britney Spears, Stephen Hawking, Mahatma Gandhi, Mother Teresa" drafts (corpus-evidence celebrities) | Content      | 4 new published profiles supporting the AEO claims |
| P3       | Question category pages get pillar-style intros + outbound bridges                                                | Content      | Bridge graphs 4 ↔ 1-3                             |

### Days 31–60 (content cluster expansion)

| Priority | Task                                                                                                                                             | Outcome                                         |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| P0       | Ship 12 "Type N vs Type M" comparison pages (cluster 3D — top 12 only)                                                                           | 12 head-term wins                               |
| P0       | Ship 9 "Type N mistypes" pages (cluster 3E)                                                                                                      | 9 disambiguation captures                       |
| P1       | Ship 8 "Show characters Enneagram" pages from list 2A (The Bear, Severance, White Lotus, Stranger Things, Ted Lasso, GoT, Yellowstone, Euphoria) | 8 long-tail head terms                          |
| P1       | Ship `/enneagram-corner/enneagram-statistics-2026` annual update post                                                                            | 1 evergreen AEO anchor + cite from corpus-stats |
| P1       | Add corpus stats `Quotation` schema to 6 highest-traffic enneagram-corner pages                                                                  | AEO across pillar 3                             |
| P2       | Ship 18 wing pages (cluster 3B) — cookie-cutter ok                                                                                               | 18 wing keyword captures                        |
| P2       | Ship `/personality-analysis/pair/[slug]` template + 6 couple pages                                                                               | 6 long-tail couple-keyword wins                 |
| P2       | `Person.sameAs` Wikipedia/IMDb/Wikidata pass on top 100 profiles                                                                                 | 100 entity-graph wins                           |
| P3       | Convert `/questions/[slug]` → `DiscussionForumPosting` on pages with 3+ public answers                                                           | Schema upgrade for qualifying pages             |

### Days 61–90 (depth + new vertical)

| Priority | Task                                                                                                                              | Outcome                                                                 |
| -------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| P0       | Ship "Parenting by Type" vertical: 9 "Type N parent" pages + 9 "Type N child" pages + pillar `/how-to-guides/enneagram-parenting` | 19-page new vertical, completely uncontested SERPs in some sub-clusters |
| P0       | Ship 12 most-searched of the 27 instinctual subtypes (3F)                                                                         | 12 underserved head terms                                               |
| P1       | "Generational Enneagram" cluster: 5 op-eds (cluster 2I)                                                                           | New AEO cluster, very low competition                                   |
| P1       | Ship 6 "Type N relationships," 6 "Type N at work," 6 "Type N friendship" pages (cluster 2D)                                       | 18-page contextual cluster                                              |
| P1       | Build `/enneagram-corner/wings`, `/subtypes`, `/comparisons`, `/mistypes` hub pages                                               | 4 new pillars                                                           |
| P2       | New cross-system pages: Enneagram + Human Design, Enneagram + Big Five, Enneagram + DISC                                          | 3 cross-system entries                                                  |
| P2       | Levels of development pillar (cluster 3H) — 1 overview + 3 example type pages                                                     | First competitive entry into the levels SERP                            |
| P3       | Question retrieval: wire `question_keywords` into the related-questions block on every question page                              | Internal link density across `/questions`                               |

---

## 9. If I only do five things (one-page digest)

1. **Fix the sitemap.** ~75 of your strongest pop-culture, community, and how-to-guides pages are not in `static/sitemap.xml`. This is a one-day eng fix that makes everything else more valuable. Your single biggest pre-content lever.
2. **Weaponize corpus stats across the type pages.** 9 type pillar pages each get a first-party callout + FAQPage block. This is your moat — Truity, Brainmanager, Insightglobal can't write "Type 4 is 35% of our musicians, +21pp above baseline" because they don't have the data. Cite that everywhere with `Quotation` schema.
3. **Ship the 12 Type-vs-Type pages and 9 Mistype pages.** 21 pages, cookie-cutter template, low SERP difficulty, head-term volume. Each one is a SERP land grab against weak competitors. Use existing celebrity examples to differentiate.
4. **Bridge the 4 graphs.** Pop-culture → personality-analysis. Personality-analysis → corpus-stats. All blog → questions. Questions → all blog. Specifically the 28 pop-culture posts with 0 outgoing links and 40 with 0 incoming links. Use the existing `getRelatedBlogs` utility plus `question_keywords` retrieval.
5. **Launch the parenting vertical.** Per your own domain-authority master index this is the most untapped vertical relative to demand. 19 pages (9 parent + 9 child + 1 pillar) with the `HowTo` schema layered in — almost no quality competition exists.

---

## Files referenced

- `/Users/djwayne/9takes/docs/seo/corpus-stats-seo.md`
- `/Users/djwayne/9takes/docs/seo/enneagram-corner-seo.md`
- `/Users/djwayne/9takes/docs/seo/personality-analysis-categories-seo.md`
- `/Users/djwayne/9takes/docs/seo-audit-9takes-2026-04-07.md`
- `/Users/djwayne/9takes/docs/question-page-seo-recommendations-2026-04-07.md`
- `/Users/djwayne/9takes/docs/data/corpus-stats.md`
- `/Users/djwayne/9takes/docs/domain-authority/00-master-index.md`
- `/Users/djwayne/9takes/docs/domain-authority/01-enneagram-core.md`
- `/Users/djwayne/9takes/docs/brand/README.md`
- `/Users/djwayne/9takes/static/sitemap.xml`
- `/Users/djwayne/9takes/scripts/generate-sitemap.js` (referenced for the sitemap-coverage fix)
- `/Users/djwayne/9takes/src/lib/components/molecules/blogIndex.ts` (existing cross-link utility — use for bridges)
- `/Users/djwayne/9takes/src/blog/pop-culture/` (35+ files; ~22 in sitemap)
- `/Users/djwayne/9takes/src/blog/community/` (35 files; 17 in sitemap)
- `/Users/djwayne/9takes/src/blog/guides/` (24 files; 12 in sitemap)
- `/Users/djwayne/9takes/src/blog/enneagram/` (160 files; 108 in sitemap)
- `/Users/djwayne/9takes/src/blog/people/drafts/` (126-name pipeline)

**Save this report to:** `/Users/djwayne/9takes/docs/seo/master-topic-cluster-map-2026-05-06.md`

Sources:

- [Misidentifying 4 and 5 — The Enneagram Institute](https://www.enneagraminstitute.com/misidentifying-4-and-5/)
- [Instinctual Subtypes — The Narrative Enneagram](https://www.narrativeenneagram.org/instinctual-subtypes/)
- [The Three Instincts — Enneagrammer](https://www.enneagrammer.com/the-three-instincts)
- [Introduction to the 27 Subtypes — Integrative9](https://www.integrative9.com/enneagram/27-subtypes/)
- [Enneagram and MBTI Correlation — Typology Wiki](https://www.typologycentral.com/wiki/index.php/Enneagram_and_MBTI_Correlation)
- [The Most Common Enneagram Types For Each Myers-Briggs Type — Enneagram Explained](https://enneagramexplained.com/the-most-common-enneagram-types-for-each-myers-briggs-type/)
- [Enneagram Tritype Test — Katherine Fauvre](https://enneagramtritypetest.com/)
- [Sakinorva Enneagram Test](https://sakinorva.net/test/enneagram)
- [Common Enneagram Mistypes — Enneagram Test](https://enneagramtest.com/blog/enneagram-mistypes)
- [Taylor Swift Enneagram 3w2 — Upbuild](https://www.upbuild.com/enneagram/celebrity-personality/taylor-swift)
- [Pedro Pascal Personality — Boo](https://boo.world/database/profile/15425/pedro-pascal-personality-type)
- [Database List — Enneagrammer](https://www.enneagrammer.com/database-list)
- [The Personality Database — Boo.world](https://boo.world/database)
- [Which Enneagram Is Rarest — Enneagram Universe](https://enneagramuniverse.com/blog/which-enneagram-is-the-rarest-why)
- [Population Distribution of Enneagram Types — Enneagram Personality](https://enneagram-personality.com/en/test/stats/1-enneagram-population-distribution)
- [Enneagram Triads Explained — Enneagram Universe](https://enneagramuniverse.com/enneagram/test/enneagram-triads)
- [Best Careers For Your Enneagram Type — Brainmanager](https://brainmanager.io/blog/career/best-careers-for-your-enneagram-type)
- [Enneagram Parenting Style — The Every Mom](https://theeverymom.com/parenting-based-on-your-enneagram/)
- [Type 5 Instinctual Subtypes — Psychology Junkie](https://www.psychologyjunkie.com/the-enneagram-5-subtypes-instinctual-variants-an-in-depth-guide/)
- [Enneagram Type 4 The Individualist — Thalira](https://thalira.com/blogs/quantum-codex/enneagram-type-4)
- [Enneagram 8w9 The Bear — Enneagram Universe](https://enneagramuniverse.com/enneagram/learn/enneagram-wings/enneagram_8w9)
- [Relationships Type Combinations — The Enneagram Institute](https://www.enneagraminstitute.com/the-enneagram-type-combinations/)
- [Enneagram Compatibility Chart — Enneagram Test](https://enneagramtest.com/blog/enneagram-compatibility)
- [Discussion Forum Structured Data — Google](https://developers.google.com/search/docs/appearance/structured-data/discussion-forum)
- [FAQPage Structured Data — Google](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
