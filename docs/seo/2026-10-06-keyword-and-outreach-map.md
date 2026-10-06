<!-- docs/seo/2026-10-06-keyword-and-outreach-map.md -->

# Keyword and Outreach Map (2026-10-06)

DJ asked for a broad SEO pass: what 9takes should rank for, who ranks for it now, and which of those owners are worth reaching out to.

- **Outreach board (private, with contacts):** https://claude.ai/artifact/Nxe4Jrd3EyBJVW48TXhjNL. Contact details are kept out of this public repo.
- **Data:** `docs/seo/data/2026-10-06/`. `google_serps.json` holds 17 real Google SERPs. `keyword-map.csv` is the keyword map. `autocomplete_raw.txt` has 163 autocomplete seeds.
- **Builds on:** `keyword-research-2026-07-06.md` (July), `competitor-serp-brief-2026-05-06.md` (May), `2026-08-13-backlink-hygiene-baseline.md` (DR 19, 51 followed referring domains), and `docs/content-strategy/2026-10-03-search-cleanup-and-gap-plan.md`.

## Executive read

1. **9takes ranks on page 1 for its niche and pages 3–6 for the core terms.**
   - **Core Enneagram terms** ("enneagram type 9", "enneagram and relationships", "enneagram in the workplace", "enneagram and parenting"): about 25,000 impressions over 90 days at an average position of about 35, for 86 clicks. These SERPs belong to the Enneagram Institute, Truity, integrative9, the Narrative Enneagram and a handful of counselors. Better content won't move these pages. Links will.
   - **Celebrity "personality" queries** (44k impressions at position ~9) and **famous-by-type queries** (6.6k at ~11) are already on page 1. The fix there is titles and snippets, plus a few links.
2. **The Q&A product is invisible to Google.** Question pages render about 1,300 characters to Googlebot: the question and nothing else. The give-first gate hides answers from crawlers too, which is why all question pages together have 144 impressions. This needs a product decision (Decision 1 below).
3. **Reddit appears on 16 of the 17 real Google SERPs.** AI Overviews appear on 16 of 17 and cite YouTube (9) and Reddit (8) most. None cites 9takes, including on queries where 9takes ranks #1 or #2.
4. **The best outreach targets fall into two groups:**
   - **Sites that already link to 9takes:** Enneagram Universe (on 6 of 17 SERPs) and The Meaning Movement (a followed link with "9takes" as the anchor).
   - **Shows and writers who need what only 9takes has:** typings of 451 public figures and a type distribution by domain.
5. **Search isn't the bottleneck.** September brought 1,465 clicks, a 15-month high. The leak is after the click (see the growth audit of 2026-09-30). This work raises the ceiling on traffic. It doesn't fix activation.

## Since July

| July priority                                | Status 2026-10-06                                                                                               |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Sabrina Carpenter "personality type" snippet | Position improved 6.4 → 5.5, now #2 on Google behind PDB. CTR still ~0.3%.                                      |
| `/corpus-stats` packaging                    | 1,488 impressions, 5 clicks. The new `how-common-is-each-enneagram-type` page is #3 for "enneagram statistics". |
| Compatibility chart                          | 6.3 and 28 clicks (up from 12), #3 on Google.                                                                   |
| Publish The Office post                      | **Not done.** Still `published: false`. Google page 1 is Medium, Tumblr and a 2020 Reddit thread.               |
| sp blind                                     | Flat at 10.4. Impressions up 148 → 265.                                                                         |
| Best free test                               | Impressions up 2.7x (670 → 1,780), position ~11–12, clicks ~0.                                                  |
| Messi                                        | Impressions up 4x (320 → 1,254), #2 on Google.                                                                  |

## Keyword map

Full table: `data/2026-10-06/keyword-map.csv` (35 rows). Tiers:

- **Defend** (top 5 on Google: fix snippets, win the AI Overview, add a few links):
  - mental illness #1
  - ADHD 3.3
  - depression 4.3
  - compatibility chart #3
  - famous enneagram 1 #3
  - Sabrina / Messi #2
  - statistics #3
  - worst type #4
  - narcissist #5 (new page from 10-04)
  - most manipulative 5.9
- **Push** (positions 8–25; 3–5 relevant links plus an on-page fix):
  - best free test (~12, 1,780 impressions)
  - type compatibility 15.5
  - career 15.0
  - personal growth 21
  - famous-by-type family
  - enneagram celebrities 20.8 (needs a hub page for all nine types)
  - sp blind 10.4
  - most likely to cheat 8.7
  - Zendaya 10.2
  - Taylor Swift 9.9 (her title has no type word; check the query mix first per the Jordi rule)
- **Wall** (pages 3–6; only months of link-earning move these, so don't rewrite):
  - type 9, type 3, type 6
  - relationships
  - teams / workplace
  - parenting
  - instinctual variants
  - leadership
  - Skip spirituality: the SERP is Christian and contemplative, a poor fit for the 9takes voice.
- **Claim** (open SERPs where 9takes has no page or the wrong one):
  - The Office (publish)
  - "enneagram community" (retitle `/questions`; 356 impressions currently land on `/enneagram-corner` at 33)
  - "what enneagram type are most CEOs" (no ranking page has data). Founders: Type 3 is most common at 25%, and Type 5 is most over-represented at +15 percentage points (n=80).
  - "how to talk to an enneagram N" / "questions to ask an enneagram N" (Crystal and enneagramtest.com templates; build in-their-own-words pages)
  - enneagram anxiety / trauma (needs a clinician co-author)
  - compatibility calculator / tritype (spam SERPs)
- **Blocked:** every `/questions/*` page (see Decision 1).

## Who owns the SERPs (17 real Google SERPs, top 10)

| Domain                   | SERPs | Read                                                                                                 |
| ------------------------ | ----: | ---------------------------------------------------------------------------------------------------- |
| reddit.com               |    16 | #1 on personal growth, worst type, statistics, community. Participate there; it's not a link source. |
| 9takes.com               |     9 | Top 5 on 8 of them.                                                                                  |
| enneagraminstitute.com   |     8 | Fortress.                                                                                            |
| truity.com               |     8 | Fortress.                                                                                            |
| youtube.com              |     7 | The source AI Overviews cite most.                                                                   |
| enneagramuniverse.com    |     6 | **Already links to 9takes.** Best partner.                                                           |
| psychologyjunkie.com     |     5 | Susan Storm. Reachable.                                                                              |
| jobcannon.io             |     4 | Programmatic competitor that copies the "81 pairings" framing. Cited in an AI Overview.              |
| personalitycafe.com      |     4 | Old forum threads.                                                                                   |
| enneagramtest.com        |     3 | Mirrors 9takes' mental-health and situation topics with unsigned template pages.                     |
| personality-database.com |     2 | #1 above 9takes on Sabrina and Messi.                                                                |

People Also Ask for "What Enneagram type is Donald Trump?" on 10 of 17 SERPs, and for the narcissist question on 6. The Trump page (T-38) is in a position to capture that PAA if it opens with a direct answer.

## Outreach plays

53 targets. The private board has the ask, the hook, a verified contact and a source URL for each.

1. **Warm links:** Enneagram Universe (update their 2025 link to the 2026 comparison page, then offer the public-figure dataset to their Celebrities section). The Meaning Movement (guest on Dan Cumberland's podcast with career-by-type data).
2. **Get listed** (about an hour of forms):
   - FeedSpot Enneagram blogs (3 entries)
   - FeedSpot Enneagram RSS
   - FeedSpot Psychology and Self-Discovery lists
   - AlternativeTo: create a 9takes listing, then add it as an alternative to Sakinorva, 16personalities, Truity, MyPersonality and Quora
   - Curlie Enneagram category
   - Product Hunt
   - Pitch: an Enneagram Monthly data article, Simply.Coach's 2026 test list, Capacity Building Solutions (a Maryland coach), the Tacoma CC LibGuide, Totem
3. **Podcasts:**
   - Enneagram at Work (aired "Using AI + the Enneagram at Work" on 10-05, so DJ is the natural follow-up)
   - Type·ish
   - Around the Circle (live one-question-by-type segment)
   - Typology
   - Personality Hacker
   - Do It For The Gram (host Milton Stewart is now IEA President)
   - Movie Typing
   - Let's Type About It
   - People Who Read People
   - ADHD reWired
   - Early Access (returns Nov 1)
   - The AI Movement (FDE story)
   - Inactive, don't pitch: Enneagram & Coffee, Your Enneagram Coach, The Psychology Podcast, Big Hormone Enneagram. The Feb 2026 Sarajane Case draft is stale.
4. **Data pitch:**
   - Carolyn Steber (Bustle; her "type most likely to get rich" piece quotes only an astrologer)
   - Sarah Regan (mindbodygreen)
   - Sara Moniuszko (USA TODAY)
   - Holly Wainwright (Mamamia)
   - Maxine Harrison (The List)
   - Jenn Lisak Golding (Indy Maven)
   - enneagram-personality.com (co-publish a test-takers vs. public figures comparison)
   - Stat aggregator pages (zipdo, gitnux, wifitalents), TestGorilla, WeCreateProblems
   - Free journalist-request tiers: Source of Sources, Qwoted, Featured
5. **Creator collab** (co-run a give-first question and publish the answers by type):
   - Abbey Howe (Talk Enneagram To Me; #5 on Google for "best free enneagram test", already crowdsources examples)
   - Psychology Junkie
   - Empathy Architects (Sterlin Mosley)
   - Ashton Whitmoyer-Ober
   - Elisabeth Bennett
6. **Clinician swap** (referral first: therapists don't link out, so 9takes links them as the professional next step, then asks):
   - OliveMe Counseling
   - Hanna Woody (trauma co-author)
   - Lifeologie
   - Heights Family Counseling
   - Full Bloom
   - Cumberland Heights
   - Shimmer
7. **Peer sites:**
   - theenneagramtypes.com
   - Shay Bocks
   - Ali Dunn
   - Relevant Magazine (once the Office page is live)

Dataset hooks (from `docs/data/corpus-stats.md`, 451 profiles, generated 2026-10-05). These are 9takes' editorial typings, not test results:

- Type 3 is the most common type at 18.0%. Types 1 and 2 are the rarest at 6.4% each.
- Comedians: 42.9% Type 7 (n=35).
- Musicians and artists: 37.4% Type 4 (n=83).
- Tech, founders and business: Type 3 is most common (25.0%), and Type 5 is most over-represented (23.8%, +15.3 percentage points vs. the corpus; n=80).
- Politics: Type 2 is over-represented (+9.7 percentage points; n=62).

Narrow the old claim that no competitor publishes a distribution. JobCannon publishes a refreshable test-taker distribution (10,639 people, updated 2026-09-29). The defensible claim is: the only refreshable **public-figure** distribution.

## Decisions (DJ, 2026-10-06)

1. **Let Google see the Q&A? Yes, but for Google only.** DJ: no visible preview, because seeing answers would bias people's own answers. JSON-LD-only answer text breaks Google's structured-data policy and ignores `data-nosnippet`, so the compliant version serves answers only to IP-verified Googlebot, behind paywall markup and `data-nosnippet`. Humans keep the zero-answer wall. Tasker: `docs/taskers/T-43-crawlable-gated-answers.md` (open fork: index existing takes, or only new ones).
2. **Ship a scored test? Yes, later, from DJ's own design.** Tasker: `docs/taskers/T-42-scored-enneagram-test.md`.
3. **Who sends the outreach? DJ sends.** Fifteen personalized drafts are in the `dj@9takes.com` Gmail Drafts folder. Every opener fact and contact was re-verified on 2026-10-06. Three journalists were swapped out (Steber has likely left Bustle; Regan and Golding are no longer writing Enneagram pieces) for Enneagram Monthly, OliveMe Counseling and Capacity Building Solutions. Follow up once at 5–7 days, then stop.

## On-site fixes

- Publish `src/blog/pop-culture/the-office-enneagram-types.md`.
- Retitle `/questions` around "Enneagram community Q&A".
- **Done this session (uncommitted):** `vercel.json` 301 from `/blog/enneagram-lineage` → `/enneagram-corner/enneagram-influences`. DJ's LinkedIn comment on a Ray Dalio post links to the dead URL. That post was deleted in b48844ecf (2023) and its content now lives at `enneagram-influences`.
- On the compatibility matrix, add a pick-two-types selector and a tritype section.
- Write a "what Enneagram type are most CEOs" data page.
- Build an "all nine types: 451 public figures" hub.
- Add direct answers on "worst type" and "most likely to cheat".
- Make celebrity snippets name the type. Wait for the Jordi read around 11-01 before any bulk title pass.
- Give `/book-session` a searchable title ("free Enneagram coaching session"). "Talk it through" is not a searched phrase.

## Method notes and gotchas

- GSC is the source of truth for 9takes' positions. The research agents' search tool is **not Google**: it never showed 9takes even where GSC has it at #1–7, and it surfaces hacked-domain spam. Use it only to find domains.
- Real Google SERPs came from DJ's signed-in Chrome, personalized to Maryland. Google showed a CAPTCHA after 17 searches.
- Agent false flags corrected during synthesis. Each of these pages ranks; it just doesn't rank for the exact title phrase:
  - Toxic-traits page (75 clicks at ~10.5)
  - Kardashian page (43 clicks at ~8.2)
  - Wings guide (6.7k impressions at ~9)
- Two unrelated "9takes" movie-review blogs (on Substack and WordPress) rank for "9takes.com" queries. Press and show-notes links help Google tell the brands apart.
- The session's web-search budget (~200 calls) ran out before Instagram/TikTok follow-lists, app roundups and newsletter roundups were fully covered.
