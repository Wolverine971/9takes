<!-- docs/seo/corpus-inventory-gaps-2026-05-06.md -->

# 9takes Content Corpus Audit — Inventory & Gap Map

**Date:** 2026-05-06
**Scope:** Internal corpus-only audit. External SERP view lives in `competitor-serp-brief-2026-05-06.md`; cluster strategy lives in `master-topic-cluster-map-2026-05-06.md`.

---

## Executive Summary

1. **Personality-analysis is the dominant pillar by volume but distorted by category.** 319 published profiles + 126 drafts. Type 3 (20.1%) and Type 4 (35% of musicians) are over-represented. Type 1 and Type 5 each sit at only 6.9% of the corpus — both under-built relative to demand.
2. **Drafts pipeline is healthy but skewed.** 126 drafts including 27 brand-new figures not yet in the famousTypes index (Einstein, Lincoln, Hemingway, Gandhi, Mandela, Shakespeare, Mother Teresa, Stephen Hawking, Robin Williams, Britney Spears, Pamela Anderson, Clint Eastwood, etc.). Heavy historical/literary push happening this week.
3. **Enneagram-corner has the 9 type pages but no wing pages, no subtype pages, no tritype page, no levels-of-development page.** This is the single biggest structural gap — the 18 wing URLs and 27 subtype URLs are missing landing pages despite the topical guides existing.
4. **Pop-culture leans heavily on tech/politics/influencers/Epstein, with almost zero TV-show or film-franchise coverage.** No Succession (despite a "succession-personality-trap" piece that's actually about CEOs), Severance, Bear, Office, Friends, Yellowstone, Game of Thrones, Stranger Things, House MD, Breaking Bad, Mad Men. No Barbie/Oppenheimer/Dune. No anime, no gaming.
5. **How-to-guides is the thinnest pillar (12–14 published guides).** Missing the obvious "how to find your type" / "how to type someone else" / "enneagram for managers" / "enneagram for parents" / "enneagram for couples therapy" workhorses.
6. **Community pillar is voice/manifesto-driven (~17 published) — strong identity, weak SEO surface.** It's where DJ writes essays; not where rankings come from. Tone is opinionated, philosophical, first-person — distinctly different from enneagram-corner's didactic tone.
7. **Internal linking is uneven.** Pillar pages link well (`enneagram-types-in-relationships.md` has 27 internal links, `productivity-systems-by-enneagram-type.md` has 24), but newer community essays (`edgy-rebellion-new-punk.md` has 2) and several pop-culture analyses (`marvel-universe...` has 6) are link-orphans relative to their potential cluster role.
8. **There are 32 famousTypes entries that are `link: false, hasImage: true` — drafted but not pushed live.** These are the lowest-effort wins (drafts are written, images exist) and include high-traffic names: Anna Wintour, Brené Brown, Hayao Miyazaki, Glen Powell, Jonah Hill, Reese Witherspoon, Ray Dalio, Cathie Wood, Conan O'Brien, Markiplier, Jamie Dimon, Nicki Minaj, Rupert Murdoch, Adam Sandler, Harrison Ford, Robert De Niro, Seth Rogen, Megan Fox, SZA.
9. **Frontmatter health is good but inconsistent.** Most files have title, description, type, lastmod. ~30% lack `meta_title` (the SEO title). Quality grading (`quality_score`) is partially rolled out — present on enneagram-corner files, mostly absent from community/pop-culture.
10. **Missing pillar landing pages.** No `/personality-analysis/categories/[slug]` content audit per category, no per-type personality-analysis index pages with strong narrative, no wings hub, no subtypes hub. Enneagram-corner has type pages but lacks "Type X at work / in love / parenting / under stress" sub-pages as dedicated URLs (covered only via cross-cutting topical posts).

---

## Pillar 1: Personality Analysis (Famous People)

### Coverage Map

Source: `src/lib/components/molecules/famousTypes.ts` (446 entries) + `docs/data/corpus-stats.md` + `src/blog/people/drafts/`.

| Type              | Published live (link:true) | In famousTypes but not live | Total famousTypes | Corpus share | Most common domain          |
| ----------------- | -------------------------- | --------------------------- | ----------------- | ------------ | --------------------------- |
| 1 — Reformer      | 22                         | 9                           | 31                | 6.9%         | Film & TV                   |
| 2 — Helper        | 25                         | 5                           | 30                | 7.8%         | Film & TV                   |
| 3 — Achiever      | 64                         | 29                          | 93                | 20.1%        | Film & TV / Creators (tied) |
| 4 — Individualist | 45                         | 17                          | 62                | 14.1%        | Musicians                   |
| 5 — Investigator  | 22                         | 9                           | 31                | 6.9%         | Tech / Founders             |
| 6 — Loyalist      | 31                         | 12                          | 43                | 9.7%         | Film & TV                   |
| 7 — Enthusiast    | 43                         | 19                          | 62                | 13.5%        | Creators / Internet         |
| 8 — Challenger    | 37                         | 13                          | 50                | 11.6%        | Film & TV                   |
| 9 — Peacemaker    | 30                         | 13                          | 43                | 9.4%         | Film & TV                   |

Drafts in `src/blog/people/drafts/` by enneagram frontmatter (392 .md files; some are research/duplicate variants): T1=26, T2=24, T3=77, T4=49, T5=30, T6=39, T7=54, T8=42, T9=39.

### Quick-win Republish Queue (32 drafts already written + image, just need to flip `link:true`)

Type 1: anna-wintour, brene-brown, hayao-miyazaki
Type 3: glen-powell, jonah-hill, nikki-glaser, reese-witherspoon, teyana-taylor, vivek-ramaswamy
Type 4: lili-reinhart, megan-fox, riz-ahmed, sza, the-weeknd
Type 5: leonardo-da-vinci, ray-dalio
Type 6: david-goggins, mark-twain
Type 7: anna-kendrick, bert-kreischer, callum-turner, cathie-wood, channing-tatum, conan-obrien, corinna-kopf, markiplier
Type 8: jamie-dimon, nicki-minaj, rupert-murdoch
Type 9: adam-sandler, austin-butler, harrison-ford, robert-de-niro, seth-rogen

### Brand-New Drafts Not Yet in famousTypes (27 names — recent batch)

albert-einstein (T5), anthony-hopkins, antonio-banderas, britney-spears (T9), charli-d'amelio, clint-eastwood, dixie-d'amelio, ernest-hemingway, kacey-musgraves, mahatma-gandhi (T1), mother-teresa, nelk-boys, nelson-mandela, noah-kahan, pamela-anderson (T7), robin-williams (T7), stephen-hawking (T5), william-shakespeare, zooey-deschanel. Plus research-only files: jeff-bezos-research, sam-altman-research, sam-altman-new-yorker, napoleon-bonaparte-research, tom-holland-research, taylor-swift-updated-sections, david-perrel-thiel-essay, POLITICIAN_FACT_CHECK_REPORT.

### High-Value Figures NOT Covered (Wishlist — Cross-Checked Against Both Live + Drafts)

**Athletes (huge gap — only Ronaldo/Messi/Maher/McGregor/Liu live)**
Serena Williams (T8), LeBron James (T3), Tom Brady (T3), Michael Jordan (T8), Kobe Bryant (T8), Tiger Woods (T3), Simone Biles (T1/3), Caitlin Clark (T8), Patrick Mahomes (T7), Shohei Ohtani (T9), Naomi Osaka (T4), Roger Federer (T9), Rafael Nadal (T6), Usain Bolt (T7), Muhammad Ali (T7).

**Tech founders (Type 5 light, no Wozniak/Brin/Page)**
Sergey Brin, Larry Page, Steve Wozniak, Brian Chesky, Patrick Collison, Jensen Huang (deep dive — only mentioned in succession piece), Demis Hassabis, Sundar Pichai, Arvind Krishna, Lisa Su, Andy Jassy, Drew Houston, Tobi Lütke.

**Politicians (gaps in global figures)**
Theodore Roosevelt, FDR, Eisenhower, JFK is in drafts, LBJ, Nixon, Margaret Thatcher, Tony Blair, Angela Merkel, Emmanuel Macron, Volodymyr Zelensky, Narendra Modi, Pete Buttigieg (in famousTypes, no link/image), Cory Booker, Tulsi Gabbard, Ron DeSantis, Marjorie Taylor Greene, AOC live but not as solo profile (only in pop-culture aoc-and-the-squad), Ted Cruz, Mitch McConnell.

**Authors (huge gap — only 13 in this category)**
Stephen King in drafts but not live, Toni Morrison, Cormac McCarthy, James Baldwin, Hunter S. Thompson, David Foster Wallace, Joan Didion, Maya Angelou, Margaret Atwood, Neil Gaiman, Brandon Sanderson, Colleen Hoover, Sally Rooney, Ta-Nehisi Coates, Malcolm Gladwell in drafts not live, Ryan Holiday, Cal Newport.

**Philosophers/thinkers**
Plato, Aristotle, Marcus Aurelius, Nietzsche, Kierkegaard, Socrates, Camus, Sartre, Simone de Beauvoir, Carl Jung, Viktor Frankl, Sam Harris, Daniel Kahneman.

**Musicians (gap in classic rock + global)**
David Bowie, Freddie Mercury, John Lennon (in drafts, not live), Prince, Michael Jackson, Madonna, Mariah Carey, Whitney Houston, Bob Dylan, Bruce Springsteen, Paul McCartney, Stevie Wonder, Frank Ocean, Lana Del Rey (in drafts), Rosalía, Bad Bunny (in drafts), Karol G, Peso Pluma, Tyler the Creator (in drafts), Phoebe Bridgers, Mitski.

**Actors (newer / younger talent)**
Anya Taylor-Joy (in drafts), Florence Pugh, Saoirse Ronan (in drafts variant), Ana de Armas, Jessica Chastain, Viola Davis, Frances McDormand, Cate Blanchett, Idris Elba, Mahershala Ali, Adam Driver, Andrew Garfield, Rami Malek, Lakeith Stanfield, Daniel Kaluuya, Rachel Sennott, Ayo Edebiri, Jeremy Strong, Brian Cox, Sarah Snook (Succession cast).

**Comedians / hosts**
Jerry Seinfeld, Larry David, Bill Burr, Joe Pera, Hannah Gadsby, Sebastian Maniscalco, Roy Wood Jr., John Mulaney, Bo Burnham, Sarah Silverman, Tig Notaro, Chelsea Handler (in drafts).

**Historical / dead figures (gap is huge — only ~10)**
Genghis Khan, Cleopatra (in famousTypes no content), Joan of Arc, Frederick Douglass, Harriet Tubman, Queen Elizabeth I, Queen Elizabeth II, Princess Margaret, Marcus Aurelius, Carl Sagan, Richard Feynman (T7), Nikola Tesla, Thomas Edison, Henry Ford, Walt Disney, Jim Henson, Fred Rogers (in famousTypes), Carl Rogers, B.F. Skinner, Sigmund Freud, Hannah Arendt, MLK Jr (in drafts), Malcolm X (in drafts).

**Internet / creator class (rapidly evolving)**
Hank Green, John Green, Ludwig, Pokimane (in drafts), Valkyrae, Disguised Toast, Dream, Technoblade, Jack Doherty, Sketch, Adam Ragusea, Kenji López-Alt, Joshua Weissman, Babish, Marques Brownlee (MKBHD), Linus Sebastian, Mark Rober, Veritasium, CGP Grey.

(Wishlist deliberately exceeds 30 — pick by traffic + brand fit.)

---

## Pillar 2: Enneagram Corner — Topic Inventory

89 files in `src/blog/enneagram/`, 88 published.

### Coverage Matrix

| Topic Area                                        | Coverage                                  | URL/file evidence                                                                                                                                                                                                                |
| ------------------------------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Type 1–9 deep dives                               | **Covered** (all 9)                       | `enneagram-type-{1..9}.md`                                                                                                                                                                                                       |
| Wings (18 total: 1w9, 1w2, 2w1, 2w3, …)           | **MISSING individual URLs**               | Only `enneagram-wings-complete-guide.md` (single hub)                                                                                                                                                                            |
| Instinctual subtypes (27 total: sp/so/sx × 9)     | **MISSING individual URLs**               | Only `enneagram-instinctual-subtypes.md` overview + `drafts/27-enneagram-subtypes.md` outline                                                                                                                                    |
| Tritype                                           | **MISSING entirely**                      | No file                                                                                                                                                                                                                          |
| Levels of development (9 levels per type)         | **MISSING entirely**                      | No file                                                                                                                                                                                                                          |
| Type at work (per type)                           | **Partial**                               | Only `enneagram-types-and-career-choices.md` + `enneagram-types-working-in-teams.md` (cross-cutting, not per-type)                                                                                                               |
| Type in love / relationships (per type)           | **Partial**                               | `enneagram-types-in-relationships.md`, `enneagram-types-on-a-first-date.md`, `red-flags-dating-each-enneagram-type.md` (cross-cutting)                                                                                           |
| Type compatibility (each pair, 36 pairs)          | **Partial**                               | `enneagram-compatibility-guide.md` + `enneagram-compatibility-matrix.md` (not per-pair URLs)                                                                                                                                     |
| Type under stress (per type)                      | **Partial**                               | `enneagram-types-in-stress.md` + `enneagram-stress-number.md` cross-cutting                                                                                                                                                      |
| Growth / integration paths (per type)             | **Partial**                               | `enneagram-personal-growth.md`, `shadow-work-by-enneagram-type.md` cross-cutting                                                                                                                                                 |
| Connecting lines / arrows                         | **Covered**                               | `enneagram-connecting-lines.md`                                                                                                                                                                                                  |
| Mistyping (per type or pair)                      | **MISSING**                               | No mistype-specific file                                                                                                                                                                                                         |
| Comparisons (vs MBTI, Big Five, DISC, attachment) | **Partial**                               | `enneagram-vs-meyers-briggs.md`, `enneagram-vs-personality-frameworks-comparison.md`, `attachment-styles-and-enneagram-types.md`, `astrology-and-the-enneagram.md`. Missing: vs Big Five, vs DISC, vs HEXACO, vs Strengthsfinder |
| Triads (Head/Heart/Gut)                           | **Partial**                               | `fear-triad-intellectual-fortress-or-prison.md` (community) covers fear triad. No dedicated head-triad / heart-triad / gut-triad page.                                                                                           |
| Harmonic groups                                   | **Covered**                               | `enneagram-harmonic-approaches.md`                                                                                                                                                                                               |
| Object relations / horneyvian                     | **Covered**                               | `enneagram-object-relations.md`, `enneagram-social-styles.md`                                                                                                                                                                    |
| Childhood patterns                                | **Covered**                               | `enneagram-childhood-stereotypes.md`                                                                                                                                                                                             |
| Parenting (per type)                              | **Partial**                               | `enneagram-parenting-styles.md` (cross-cutting only) + `mental-health/enneagram-parenting-mental-health.md`                                                                                                                      |
| Mental health & disorders                         | **Strong** (full mental-health subfolder) | anxiety, depression, addiction, trauma, ADHD, neurodivergence, therapy, therapy-resistance, medication, science, crisis                                                                                                          |
| Communication                                     | **Covered**                               | 3 files (guide, styles, tips)                                                                                                                                                                                                    |
| Test / how to find type                           | **Partial**                               | `beginners-guide-to-determining-your-enneagram-type.md`, `enneagram-test-comparison-2025.md`. Missing: dedicated "how to find your enneagram type if all tests give different results"                                           |
| Religion / spirituality                           | **Covered**                               | `enneagram-and-religion.md`, `philosophy-psychology-and-the-enneagram.md`                                                                                                                                                        |
| Workplace / leadership                            | **Strong**                                | `enneagram-leadership.md`, `enneagram-team-diversity.md`, `enneagram-team-dynamics.md`, `enneagram-workplace-team-building.md`                                                                                                   |

### Top Missing Enneagram-Corner URLs (impact-ranked)

1. **18 wings pages** (e.g., `/enneagram-corner/4w3`, `/enneagram-corner/4w5`, `/enneagram-corner/6w5`, `/enneagram-corner/9w8`) — these are some of the highest-volume keyword searches in the entire Enneagram space.
2. **27 subtype pages** (e.g., `/enneagram-corner/sp-4`, `/enneagram-corner/so-9`, `/enneagram-corner/sx-8`) — high-intent search. Outline exists in drafts; build them.
3. **Levels of development overview + 9 type-specific levels pages** (Riso-Hudson). Currently zero coverage.
4. **Tritype hub + per-tritype pages.** Tritype is its own keyword universe.
5. **9 "Type X at Work"** pages — atomized from the cross-cutting career file.
6. **9 "Type X in Love"** pages — same atomization.
7. **9 "Type X Under Stress"** pages.
8. **9 "Type X Growth Path / Integration"** pages.
9. **36 type-pair compatibility pages** ("4 and 8 compatibility", "5 and 9 compatibility"). Matrix exists; pages don't.
10. **Mistyping series** — "Am I a 4 or a 9?", "Am I a 6 or a 1?", "Why I keep retyping" — high-intent confused-user content.
11. **Triad pages** — Head/Heart/Gut as distinct landing pages (only fear triad has a community spinoff).

---

## Pillar 3: Pop Culture (~46 published files)

### Coverage Tally

**Tech / business / Silicon Valley (overweighted — 11 files):** tech-titans-\* (8 variants/series including AI wars, disruptors, founders-vs-stewards, paypal-mafia, platform-emperors, leadership-styles), silicon-valley-power-players, musk-vs-altman-trial, succession-personality-trap.

**Politics / power dynamics (7 files):** us-presidents, world-leaders, trump-vs-biden, AOC and the Squad, breaking-points (Krystal/Saagar), royal-family.

**Internet / creator culture (10 files):** podcast-bros, podcaster-personality-map, online-gurus, streaming-royalty, influencer-enneagram-types-instagram, onlyfans-creators, kardashian-family, alex-cooper-vs-alix-earle, twitter-x-personality-types-toxic, reddit-moderators-type-1.

**Crime / dark psych (4 files):** epstein-psychology-1+2, epstein-web-of-manipulation, ghislaine-maxwell-psychology, dark-triad-meets-enneagram, depp-vs-heard.

**Cinema (3 files only):** marvel-universe-enneagram-analysis, hollywood-heartthrobs, oscar-contenders.

**Music (1 file):** pop-queens.

**Comedy (1 file):** comedy-kings.

**Cultural commentary (5 files):** cancel-culture, masculinity-strength, incel-blackpill, parasocial-relationships, incel-exit-post.

### Massive Pop-Culture Gaps (15+ obvious missing properties)

**Prestige TV (zero coverage):**

1. Succession (Roy family — Logan, Kendall, Shiv, Roman, Connor by type)
2. The Bear (Carmy, Sydney, Richie, Marcus by type)
3. Severance (Mark, Helly, Irving, Dylan; innie vs. outie as personality split)
4. Yellowstone (the Dutton family)
5. White Lotus (each season's cast as type ensembles)
6. House of the Dragon / Game of Thrones (Targaryens, Starks, Lannisters)
7. Mad Men (Don Draper Type 3 deep dive — iconic SEO bait)
8. Breaking Bad (Walter White Type 3, Jesse Type 6, Skyler, Saul)
9. Better Call Saul (Jimmy/Saul as Type 7 — wild gap)

**Sitcoms / classics (zero):** 10. The Office (Michael, Dwight, Jim, Pam, Kevin — perennial top search) 11. Friends (Ross, Rachel, Monica, Chandler, Joey, Phoebe — perennial) 12. Parks & Rec 13. Seinfeld 14. New Girl, How I Met Your Mother

**Recent film:** 15. Barbie / Greta Gerwig film personalities 16. Oppenheimer (the cast) 17. Dune (Paul, Chani, Lady Jessica) 18. Everything Everywhere All At Once 19. Past Lives, Anatomy of a Fall, Poor Things 20. Saltburn (Oliver = Type 3 con-artist)

**Anime (zero coverage — huge missed audience):** 21. Naruto cast, One Piece cast, Demon Slayer, Attack on Titan, Jujutsu Kaisen, My Hero Academia, Death Note (Light vs L is gold), Studio Ghibli protagonists.

**Gaming (zero):** 22. League of Legends streamer types, Valorant pros, esports personality types, Twitch streamer archetypes (have podcaster-personality-map but no gaming version), gaming-personality-by-genre (FPS/MOBA/RPG players).

**Music (only 1 file):** 23. Hip-hop dynasties (Kendrick vs Drake battle by type), country music personalities, K-pop personality types (BTS members by type, Blackpink), pop diva archetypes beyond pop-queens, classic rock personalities.

**Reality TV:** 24. Bachelor/Bachelorette personality types, Love Island, Survivor archetypes, Real Housewives by city/type.

**Sports culture:** 25. NFL QB personality types, NBA superstars by type, Formula 1 driver types, soccer rivalries.

---

## Pillar 4: How-To Guides (12 published)

### What's Covered

Relationship conflict (parts 1+2), 5 tough conversations, dating dynamics by type, productivity systems by type, depression-fighting, self-efficacy, active listening, hidden strengths, emotions crash course, how-to-psychoanalyze-people, using-enneagram-for-self-development, personality-maxing-notes.

### Drafts in `guides/drafts/` (11 files mostly stalled): all-kinds-of-conflict, conflict-in-the-workplace, finding-the-right-words, guide-to-active-listening, how-to-get-along-with-your-relatives, how-to-psychoanalyze-a-person, how-to-solve-relationship-conflict, mental-health, psychology, the-crash-course-on-emotions, notes.

### Missing How-To-Guide Targets (high search volume, all writeable)

1. **"How to find your Enneagram type" definitive guide** (one of the highest-volume ego-bait queries — currently scattered)
2. **"How to type someone else without asking"** — read-people content gap; the closest is `how-to-psychoanalyze-people` (different angle)
3. **"Enneagram for managers"** — manager-onboarding kit
4. **"Enneagram for parents"** — parenting-by-child-type guide
5. **"Enneagram for couples / couples therapy"**
6. **"Enneagram for dating apps"** (corner has `why-dating-apps-are-harder-for-certain-personality-types.md` but no how-to)
7. **"Enneagram for job interviews"** — resume/interview prep
8. **"Enneagram for sales"** — selling to each type
9. **"How to motivate each Enneagram type"** — pairs with productivity guide
10. **"How to apologize to each Enneagram type"** (corner has `how-to-apologize-like-a-pro.md`, but a per-type how-to is missing as a guide)
11. **"How to set boundaries by Enneagram type"**
12. **"How to give feedback by Enneagram type"** — workplace
13. **"Enneagram for therapists / coaches" toolkit**
14. **"How to use the Enneagram in your marriage"** — long-form
15. **"30-day type discovery challenge"** — gamified guide

---

## Pillar 5: Community (17 published)

### Voice / Format

First-person essays from DJ. Tone is opinionated, philosophical, often contrarian. Distinct from enneagram-corner's didactic-explainer voice. Themes: framework critique (`mbti-vs-enneagram`, `personality-frameworks-map-not-territory`), product manifesto (`introducing-9takes`, `inspiration-for-9takes`, `why-the-greek-vibe`, `how-minds-change-on-9takes`), social commentary (`edgy-rebellion-new-punk`, `societal-ticking-time-bombs`, `memetic-comments`, `reddit-deep-connections-limitations`), epistemics (`kantian-filters-and-nine-perspectives`, `consensus-on-human-nature`, `software-and-hardware-of-the-mind`, `what-winning-online-arguments-looks-like`, `questions-are-the-engine-of-moral-awakening`).

`type` frontmatter values used: `idea`, `inspiration`, `opinion`. **No SEO target on most — these are voice/brand pieces.**

Drafts (~17 in `community/drafts/`) include 9takes-bridge-protocol, manifesto, three-sided-die, hidden-truths, reading-people-101, how-to-crowdsource-solutions-to-conflict — these are author-voice pieces meant to compound brand, not rank.

---

## Pillar 6: Cross-Pillar Pattern Findings

### Missing Pillar/Hub Pages

- **No `/enneagram-corner/wings`** hub page that links to 18 wing detail pages (because they don't exist).
- **No `/enneagram-corner/subtypes`** hub linking to 27 subtype pages.
- **No `/enneagram-corner/triads`** hub.
- **No `/enneagram-corner/levels`** hub.
- **No `/personality-analysis/type/{1..9}`** narrative hub\*\* — code routes exist but they're list-pages, not editorial. This is huge unrealized SEO real estate. A "Type 8 Famous People — The Complete List" page should be a flagship.
- **No per-Enneagram-category index editorial** in `/personality-analysis/categories/[slug]` — the 7 corpus-stats categories (film-tv, music, tech-business, politics-public, creator-media, comedy, authors-thinkers) deserve editorial intros.

### Orphan Patterns (Concrete Examples)

- `community/edgy-rebellion-new-punk.md` — only 2 internal links, marked as PLACEHOLDER spinoff but never linked to from `societal-ticking-time-bombs.md` it spun off from.
- `pop-culture/marvel-universe-enneagram-analysis.md` — 6 internal links but no link out to individual Marvel actor profiles (RDJ, Hemsworth, etc. all live).
- Research-only files in drafts (`jeff-bezos-research.md`, `Sam-Altman-research.md`, `Tom-Holland-research.md`, `david-perrel-thiel-essay.md`, `POLITICIAN_FACT_CHECK_REPORT.md`, `Napoleon-Bonaparte-research.md`, `taylor-swift-updated-sections.md`) — 0 internal links each, look like working drafts left in tree.
- `pop-culture/tech-titans-*` series — 8 files but cross-linking between them appears uneven; some have only 4 internal links despite being a series.

### Broken Cluster Patterns

- Tech-titans series exists 8 ways but no master hub page consolidating the series.
- Epstein content (3 files) has no overview hub.
- "By Enneagram Type" naming convention is inconsistent: some files are `[topic]-by-enneagram-type.md`, others `enneagram-types-[verb]-[noun].md`.

---

## Pillar 7: Question Categories

DB-driven via `src/lib/server/questionCategoryTree.ts` (categories table in Supabase). Tree has `category_name`, `slug`, `parent_id`, `level` — hierarchical. The eligibility threshold is `MIN_QUESTION_COUNT_FOR_CATEGORY_INTRO = 3`. Recommend cross-referencing question categories with blog `type` frontmatter values (`overview`, `nine-types`, `situational`, `idea`, `inspiration`, `opinion`, `historical`, `celebrity`, `musician`, `movieStar`, etc.) to build cluster cross-links.

---

## Pillar 8: Frontmatter / Metadata Health (10-File Sample)

| File                                           | title | meta_title | description | quality_score     | type[]        |
| ---------------------------------------------- | ----- | ---------- | ----------- | ----------------- | ------------- |
| enneagram/enneagram-type-1.md                  | yes   | **yes**    | yes         | 8.8               | nine-types    |
| enneagram/enneagram-wings-complete-guide.md    | yes   | no         | yes         | 8.4               | overview      |
| enneagram/enneagram-instinctual-subtypes.md    | yes   | no         | yes         | 9.3               | overview      |
| enneagram/enneagram-stress-number.md           | yes   | no         | yes         | n/a sampled       | overview      |
| community/why-the-greek-vibe.md                | yes   | **yes**    | yes         | n/a               | idea          |
| community/edgy-rebellion-new-punk.md           | yes   | no         | yes         | n/a (placeholder) | idea          |
| community/societal-ticking-time-bombs.md       | yes   | no         | yes         | n/a               | idea          |
| pop-culture/podcast-bros-enneagram-analysis.md | yes   | **yes**    | yes         | n/a               | situational   |
| pop-culture/succession-personality-trap.md     | yes   | **yes**    | yes         | n/a               | situational   |
| guides/dating-dynamics-by-enneagram-type.md    | yes   | no         | yes         | n/a               | (no type tag) |

### Findings

- **`meta_title` coverage: ~40%** — many high-quality pieces missing the SEO title override.
- **`type[]` array values are inconsistent** — `idea` vs `opinion` vs `situational` vs `nine-types` vs `overview`. No taxonomy doc; needs consolidation for filterable archives.
- **`quality_score` only on enneagram-corner files** — missing from community, pop-culture, guides, and some people drafts.
- **`pic` is filled** on most; **`pic_alt`** is inconsistently filled (only some files).
- **Some published files have `published: false`** in frontmatter (`edgy-rebellion-new-punk.md`, `societal-ticking-time-bombs.md` had mismatched flags) — risk of accidental noindex. Spot-check needed.
- **Several drafts contain `production_pretext` blocks** with `requires: db_sync, db_verify, regenerate_famous_types, image_check` — these are the "how to ship" handoff steps. Good system, but no audit dashboard surfaces what's blocked where.

---

## Top 25 Next-To-Write (Impact / Effort Ranked)

| #   | Item                                                                                                                                            | Pillar               | Impact (1-5) | Effort (1-5) | Notes                                                                                                                                                                                                                   |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ------------ | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Flip 32 already-drafted-with-image profiles to `link:true`                                                                                      | personality-analysis | 5            | 1            | Anna Wintour, Brené Brown, Hayao Miyazaki, Glen Powell, Jonah Hill, Reese Witherspoon, Ray Dalio, Conan O'Brien, Markiplier, Jamie Dimon, Rupert Murdoch, Adam Sandler, Harrison Ford, Robert De Niro, Seth Rogen, etc. |
| 2   | 18 wings pages (4w3, 4w5, 6w5, 6w7, 9w1, 9w8, 8w7, 8w9, 1w9, 1w2, 2w1, 2w3, 3w2, 3w4, 5w4, 5w6, 7w6, 7w8)                                       | enneagram-corner     | 5            | 3            | Hub already written; spin off 18 atomic pages. Highest single-cluster volume win.                                                                                                                                       |
| 3   | "How to find your Enneagram type" definitive guide                                                                                              | how-to-guides        | 5            | 2            | Top-of-funnel ego-bait keyword.                                                                                                                                                                                         |
| 4   | The Office characters by Enneagram                                                                                                              | pop-culture          | 5            | 2            | Perennial top search; Marvel piece exists, Office doesn't.                                                                                                                                                              |
| 5   | Friends characters by Enneagram                                                                                                                 | pop-culture          | 5            | 2            | Same logic.                                                                                                                                                                                                             |
| 6   | 9 "Type X at Work" pages                                                                                                                        | enneagram-corner     | 5            | 3            | Atomize from career file.                                                                                                                                                                                               |
| 7   | 9 "Type X in Love / Relationships" pages                                                                                                        | enneagram-corner     | 5            | 3            | Atomize from relationships file.                                                                                                                                                                                        |
| 8   | 27 subtype pages (sp-1, so-1, sx-1 … sx-9)                                                                                                      | enneagram-corner     | 4            | 4            | Outline already in `enneagram/drafts/27-enneagram-subtypes.md`.                                                                                                                                                         |
| 9   | Succession (Roy family) by Enneagram                                                                                                            | pop-culture          | 4            | 2            | Piggyback on existing `succession-personality-trap.md` which is actually about CEOs.                                                                                                                                    |
| 10  | The Bear by Enneagram                                                                                                                           | pop-culture          | 4            | 2            | Massive cultural moment; zero coverage.                                                                                                                                                                                 |
| 11  | Severance by Enneagram (innie/outie split)                                                                                                      | pop-culture          | 4            | 2            | Unique angle: dual-personality lens.                                                                                                                                                                                    |
| 12  | LeBron James, Tom Brady, Michael Jordan, Serena Williams, Simone Biles solo profiles                                                            | personality-analysis | 4            | 3            | Athlete category is the biggest demographic gap.                                                                                                                                                                        |
| 13  | Sergey Brin, Larry Page, Brian Chesky, Jensen Huang (deep solo), Patrick Collison                                                               | personality-analysis | 4            | 3            | Tech founder gap; deepens the "founders" cluster.                                                                                                                                                                       |
| 14  | Levels of Development (overview + 9 type-specific)                                                                                              | enneagram-corner     | 4            | 4            | Riso-Hudson framework; missing entirely.                                                                                                                                                                                |
| 15  | Tritype hub + 5 most-searched tritype combos (e.g., 478, 125, 369)                                                                              | enneagram-corner     | 4            | 3            | Tritype is its own keyword universe.                                                                                                                                                                                    |
| 16  | 36 compatibility pair pages (4-8, 5-9, 1-7, etc.)                                                                                               | enneagram-corner     | 4            | 5            | Matrix exists; atomize. Defer to phase 2.                                                                                                                                                                               |
| 17  | Enneagram for Managers (workhorse guide)                                                                                                        | how-to-guides        | 4            | 2            | Workplace cluster anchor.                                                                                                                                                                                               |
| 18  | Enneagram for Parents (per-child-type)                                                                                                          | how-to-guides        | 4            | 3            | Big evergreen audience.                                                                                                                                                                                                 |
| 19  | "Am I a 4 or a 9?" / "Am I a 6 or a 1?" mistype series (5–7 pieces)                                                                             | enneagram-corner     | 4            | 3            | High-intent confused-user content.                                                                                                                                                                                      |
| 20  | Game of Thrones / House of the Dragon by Enneagram                                                                                              | pop-culture          | 4            | 3            | Evergreen + still-airing.                                                                                                                                                                                               |
| 21  | Mad Men / Don Draper Type 3 deep dive                                                                                                           | pop-culture          | 3            | 2            | Iconic Type 3 archetype anchor.                                                                                                                                                                                         |
| 22  | Breaking Bad / Walter White Type 3 deep dive                                                                                                    | pop-culture          | 4            | 2            | Same — iconic archetype.                                                                                                                                                                                                |
| 23  | Anime hub: Naruto / One Piece / Death Note types                                                                                                | pop-culture          | 4            | 3            | Untapped audience.                                                                                                                                                                                                      |
| 24  | Author/philosopher batch: Plato, Aristotle, Marcus Aurelius, Nietzsche, Carl Jung, James Baldwin, Toni Morrison                                 | personality-analysis | 3            | 4            | Authors & Thinkers category is only n=13.                                                                                                                                                                               |
| 25  | 7 personality-analysis category-page editorial intros (film-tv, music, tech-business, politics-public, creator-media, comedy, authors-thinkers) | cross-pillar         | 4            | 2            | Routes exist; need narrative content.                                                                                                                                                                                   |

---

## Files Cited

- `docs/data/corpus-stats.md` — 319 published / 126 drafts, full type + category breakdown
- `src/lib/components/molecules/famousTypes.ts` — 446-entry master index of all profiles (live + drafted)
- `src/blog/people/drafts/` — 392 markdown files (drafts pipeline)
- `src/blog/enneagram/` — 89 enneagram-corner files (88 published)
- `src/blog/pop-culture/` — 46 pop-culture files
- `src/blog/guides/` — 14 how-to-guide files (12 published)
- `src/blog/community/` — 19 community files (17 published)
- `src/blog/topic-map.md` — DJ's old keyword strategy notes
- `src/lib/server/questionCategoryTree.ts` — DB-driven question taxonomy
- `src/routes/personality-analysis/type/[slug]/+page.server.ts` — Type landing pages exist as routes but lack editorial
- `src/routes/personality-analysis/categories/[slug]/+page.server.ts` — Category pages exist as routes but lack editorial
