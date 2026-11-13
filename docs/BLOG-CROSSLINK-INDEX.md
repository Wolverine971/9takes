# Blog Cross-Link Index

_Generated: 2026-11-12 by `pnpm gen:crosslinks` (scripts/generate-crosslink-report.js)_
_Search data: GSC 2026-08-10 → 2026-11-08 (pulled 2026-11-10)_

**Scope.** Link counts cover **live posts only**: files a route actually serves with `published: true`
(the same rule the `[slug]` loaders use). Links to the 9 type pages and to personality-analysis pages count.
"In" = unique live blog posts + people pages linking to the page. Drafts, redirects, research notes and
social variants are listed separately at the bottom and never inflate the health numbers.

Link ideas to act on: [`docs/crosslinks/link-opportunities.md`](crosslinks/link-opportunities.md)
(worked weekly by `/crosslink-queue`). Publish gate: `pnpm crosslinks:check`
(every live post needs 3+ in and 3+ out; older gaps are grandfathered in `docs/crosslinks/baseline.json`).

---

## Health (live posts)

| Metric | Count |
|---|---|
| Live blog posts | 150 (+ 9 type pages) |
| Published people pages | 464 |
| Completely isolated (0 in, 0 out) | 0 |
| 0 incoming | 0 |
| 0 outgoing | 0 |
| Below gate (<3 in or <3 out) | 0 (0 not grandfathered) |
| Broken internal links (live post → non-live page) | 0 |
| Links that go through a 301 | 0 |
| Broken/redirected links on people pages (draft mirror) | 0 |
| Body links: blog → blog / blog → people | 1,655 / 402 |

---

## Section flow

Where body links go. Rows = linking section, columns = linked section.

| From \ To | enneagram-corner | community | how-to-guides | pop-culture | people | Stays in section | Posts | Median in |
|---|---|---|---|---|---|---|---|---|
| enneagram-corner | 1,175 | 23 | 14 | 27 | 159 | 84% | 96 | 8 |
| community | 60 | 50 | 1 | 6 | 3 | 42% | 18 | 4 |
| how-to-guides | 59 | 3 | 21 | 0 | 0 | 25% | 11 | 3 |
| pop-culture | 108 | 3 | 0 | 105 | 240 | 23% | 34 | 3 |

---

## Under-linked pages with search demand

Live posts at Google position 4–30 with 1,000+ impressions, sorted by how few links they get
relative to demand. These are where an internal link is most likely to move a ranking.

| Page | Impressions | Clicks | Position | In | Out |
|---|---|---|---|---|---|
| `/enneagram-corner/astrology-and-the-enneagram` | 12,004 | 194 | 6.9 | 9 | 16 |
| `/pop-culture/kardashian-family-enneagram-analysis` | 4,380 | 47 | 7.5 | 3 | 17 |
| `/enneagram-corner/how-common-is-each-enneagram-type` | 5,324 | 55 | 7.7 | 5 | 9 |
| `/enneagram-corner/toxic-traits-relationships-warning-signs` | 2,507 | 30 | 8.5 | 4 | 20 |
| `/enneagram-corner/enneagram-and-mental-illness` | 12,500 | 290 | 8.7 | 25 | 22 |
| `/enneagram-corner/enneagram-compatibility-matrix` | 10,468 | 135 | 11.5 | 21 | 8 |
| `/enneagram-corner/which-enneagram-type-is-most-likely-to-be-a-narcissist` | 2,675 | 12 | 7.1 | 5 | 13 |
| `/enneagram-corner/enneagram-and-adhd-which-types-struggle-most` | 4,302 | 221 | 4.9 | 9 | 22 |
| `/enneagram-corner/mental-health/enneagram-neurodivergence-guide` | 4,714 | 93 | 6.7 | 11 | 8 |
| `/enneagram-corner/enneagram-test-comparison-2026` | 2,848 | 12 | 10.6 | 7 | 4 |
| `/enneagram-corner/toxic-traits-of-each-enneagram-type` | 6,647 | 69 | 9.3 | 20 | 19 |
| `/enneagram-corner/what-is-a-love-language` | 1,218 | 6 | 11.3 | 3 | 7 |
| `/enneagram-corner/love-languages-and-enneagram-types` | 3,926 | 9 | 8.3 | 12 | 16 |
| `/enneagram-corner/enneagram-and-religion` | 1,462 | 13 | 23.7 | 4 | 3 |
| `/enneagram-corner/attachment-styles-and-enneagram-types` | 5,244 | 52 | 7.9 | 21 | 16 |
| `/enneagram-corner/biggest-compliments-to-give-each-enneagram-type` | 1,176 | 22 | 7.0 | 4 | 15 |
| `/enneagram-corner/depression-patterns-by-enneagram-type` | 5,699 | 113 | 7.2 | 26 | 3 |
| `/enneagram-corner/enneagram-types-and-career-choices` | 2,066 | 20 | 12.6 | 9 | 13 |
| `/enneagram-corner/how-each-enneagram-type-manipulates` | 3,919 | 31 | 7.1 | 21 | 21 |
| `/enneagram-corner/mental-health/enneagram-addiction-recovery-guide` | 1,892 | 46 | 8.1 | 12 | 15 |
| `/enneagram-corner/enneagram-vs-personality-frameworks-comparison` | 2,034 | 3 | 8.5 | 15 | 6 |
| `/enneagram-corner/mental-health/enneagram-science-mental-health` | 2,496 | 5 | 9.2 | 19 | 6 |
| `/enneagram-corner/how-to-apologize-like-a-pro` | 1,213 | 23 | 7.3 | 11 | 6 |
| `/enneagram-corner/enneagram-instinctual-subtypes` | 13,556 | 75 | 10.7 | 165 | 16 |
| `/enneagram-corner/why-you-cant-stop-overthinking-enneagram` | 1,039 | 7 | 7.0 | 17 | 23 |

## Dead ends with traffic

Live posts with 3 or fewer outgoing links, sorted by impressions. Readers land here and have nowhere to go.

| Page | Impressions | Clicks | Out | In |
|---|---|---|---|---|
| `/enneagram-corner/depression-patterns-by-enneagram-type` | 5,699 | 113 | 3 | 26 |
| `/enneagram-corner/enneagram-and-religion` | 1,462 | 13 | 3 | 4 |
| `/enneagram-corner/enneagram-social-styles` | 768 | 0 | 3 | 6 |
| `/enneagram-corner/enneagram-team-dynamics` | 727 | 0 | 3 | 5 |
| `/enneagram-corner/first-impression-cheat-sheet` | 325 | 6 | 3 | 3 |
| `/enneagram-corner/enneagram-influences` | 177 | 1 | 3 | 3 |
| `/pop-culture/epstein-psychology-part-2` | 80 | 1 | 3 | 3 |
| `/community/questions-are-the-engine-of-moral-awakening` | — | — | 3 | 3 |
| `/enneagram-corner/situations-change-emotions-dont` | — | — | 3 | 3 |
| `/how-to-guides/guide-to-fighting-depression` | — | — | 3 | 3 |
| `/pop-culture/reddit-moderators-type-1-internet` | — | — | 3 | 3 |

## People bridge

People pages by search impressions and how many **blog posts** link to them in prose
(the FamousTypes block on type pages and the `/personality-analysis/categories/*` listings link
nearly every person, but those are not contextual links).
214 of 464 people pages have at least one blog link.

| Person | Impressions | Clicks | Position | Blog links in | People links in |
|---|---|---|---|---|---|
| [Sky Bri](/personality-analysis/sky-bri) | 33,046 | 228 | 12.1 | 0 | 2 |
| [Ashby](/personality-analysis/ashby) | 15,180 | 81 | 8.8 | 1 | 0 |
| [IShowSpeed](/personality-analysis/ishowspeed) | 12,761 | 29 | 7.1 | 0 | 3 |
| [Jordi Hays](/personality-analysis/jordi-hays) | 8,794 | 151 | 6.0 | 3 | 1 |
| [Shawn Ryan](/personality-analysis/shawn-ryan) | 8,576 | 83 | 9.6 | 2 | 1 |
| [Zendaya](/personality-analysis/zendaya) | 5,779 | 22 | 9.3 | 2 | 10 |
| [Asmongold](/personality-analysis/asmongold) | 5,657 | 33 | 8.5 | 0 | 1 |
| [Ariana Grande](/personality-analysis/ariana-grande) | 5,156 | 17 | 9.1 | 0 | 6 |
| [Tara Yummy](/personality-analysis/tara-yummy) | 5,152 | 21 | 8.6 | 0 | 0 |
| [Dario Amodei](/personality-analysis/dario-amodei) | 4,902 | 40 | 8.6 | 5 | 3 |
| [Selena Gomez](/personality-analysis/selena-gomez) | 4,852 | 24 | 7.1 | 1 | 4 |
| [Oliver Tree](/personality-analysis/oliver-tree) | 4,636 | 14 | 7.6 | 0 | 0 |
| [Jack Black](/personality-analysis/jack-black) | 4,278 | 30 | 7.2 | 1 | 5 |
| [Sydney Sweeney](/personality-analysis/sydney-sweeney) | 3,943 | 24 | 7.1 | 0 | 1 |
| [Emma Watson](/personality-analysis/emma-watson) | 3,737 | 7 | 8.0 | 0 | 3 |
| [Kara Swisher](/personality-analysis/kara-swisher) | 3,653 | 24 | 7.8 | 1 | 3 |
| [Sabrina Carpenter](/personality-analysis/sabrina-carpenter) | 3,609 | 22 | 6.4 | 0 | 4 |
| [David Friedberg](/personality-analysis/david-friedberg) | 3,585 | 16 | 8.7 | 2 | 3 |
| [Cillian Murphy](/personality-analysis/cillian-murphy) | 3,448 | 18 | 9.5 | 0 | 2 |
| [Lana Del Rey](/personality-analysis/lana-del-rey) | 3,283 | 16 | 8.2 | 1 | 10 |
| [Ella Langley](/personality-analysis/ella-langley) | 3,050 | 27 | 8.4 | 0 | 2 |
| [Meghan Markle](/personality-analysis/meghan-markle) | 2,987 | 33 | 6.5 | 0 | 4 |
| [Kai Cenat](/personality-analysis/kai-cenat) | 2,948 | 6 | 7.4 | 1 | 10 |
| [Rihanna](/personality-analysis/rihanna) | 2,937 | 27 | 8.9 | 2 | 2 |
| [Lionel Messi](/personality-analysis/lionel-messi) | 2,783 | 12 | 9.0 | 0 | 3 |

## People pages that need links

A people page "needs links" with 2 or fewer contextual links in (blog posts + other people pages).
**201 of 464** people pages need links; 62 have none.
Unlinked mentions on other people pages are queued in `link-opportunities.md` §4.

| Person | Impressions | Position | Blog links in | People links in |
|---|---|---|---|---|
| [Sky Bri](/personality-analysis/sky-bri) | 33,046 | 12.1 | 0 | 2 |
| [Ashby](/personality-analysis/ashby) | 15,180 | 8.8 | 1 | 0 |
| [Asmongold](/personality-analysis/asmongold) | 5,657 | 8.5 | 0 | 1 |
| [Tara Yummy](/personality-analysis/tara-yummy) | 5,152 | 8.6 | 0 | 0 |
| [Oliver Tree](/personality-analysis/oliver-tree) | 4,636 | 7.6 | 0 | 0 |
| [Sydney Sweeney](/personality-analysis/sydney-sweeney) | 3,943 | 7.1 | 0 | 1 |
| [Cillian Murphy](/personality-analysis/cillian-murphy) | 3,448 | 9.5 | 0 | 2 |
| [Ella Langley](/personality-analysis/ella-langley) | 3,050 | 8.4 | 0 | 2 |
| [Madison Beer](/personality-analysis/madison-beer) | 2,619 | 8.7 | 0 | 0 |
| [Charli D'Amelio](/personality-analysis/charli-damelio) | 2,569 | 8.2 | 0 | 2 |
| [Benson Boone](/personality-analysis/benson-boone) | 2,554 | 8.1 | 1 | 0 |
| [CaseOh](/personality-analysis/caseoh) | 1,897 | 8.3 | 0 | 1 |
| [Leila Hormozi](/personality-analysis/leila-hormozi) | 1,811 | 7.3 | 1 | 1 |
| [Alexis Bledel](/personality-analysis/alexis-bledel) | 1,747 | 9.0 | 0 | 0 |
| [Clavicular](/personality-analysis/clavicular) | 1,705 | 12.7 | 0 | 1 |
| [Marcello Hernández](/personality-analysis/marcello-hernandez) | 1,696 | 7.6 | 0 | 0 |
| [Casey Neistat](/personality-analysis/casey-neistat) | 1,599 | 9.9 | 0 | 0 |
| [John Travolta](/personality-analysis/john-travolta) | 1,425 | 7.4 | 0 | 0 |
| [Neil Strauss](/personality-analysis/neil-strauss) | 1,422 | 7.5 | 0 | 2 |
| [Mikey Madison](/personality-analysis/mikey-madison) | 1,402 | 8.0 | 0 | 1 |
| [Tom Hardy](/personality-analysis/tom-hardy) | 1,361 | 8.0 | 1 | 1 |
| [Adéla](/personality-analysis/adela) | 1,303 | 8.1 | 0 | 0 |
| [Bernard Arnault](/personality-analysis/bernard-arnault) | 1,269 | 8.1 | 1 | 0 |
| [Jason Sudeikis](/personality-analysis/jason-sudeikis) | 1,197 | 7.3 | 0 | 0 |
| [David Goggins](/personality-analysis/david-goggins) | 1,135 | 8.6 | 1 | 1 |

---

## Hubs

| In | Out | Impressions | Page |
|---|---|---|---|
| 213 | 17 | 1,870 | `/enneagram-corner/enneagram-types-in-stress` |
| 194 | 41 | 7,552 | `/enneagram-corner/enneagram-wings-complete-guide` |
| 165 | 16 | 13,556 | `/enneagram-corner/enneagram-instinctual-subtypes` |
| 156 | 15 | 2,678 | `/enneagram-corner/enneagram-type-3` |
| 140 | 26 | 1,531 | `/enneagram-corner/enneagram-type-6` |
| 139 | 12 | 422 | `/enneagram-corner/enneagram-type-7` |
| 134 | 16 | 2,356 | `/enneagram-corner/enneagram-type-4` |
| 130 | 18 | 2,547 | `/enneagram-corner/enneagram-type-9` |
| 127 | 13 | 1,895 | `/enneagram-corner/enneagram-type-5` |
| 123 | 14 | 883 | `/enneagram-corner/enneagram-type-8` |
| 108 | 13 | 365 | `/enneagram-corner/enneagram-type-1` |
| 105 | 16 | 951 | `/enneagram-corner/enneagram-type-2` |
| 63 | 25 | 2,257 | `/enneagram-corner/relationship-communication-guide` |
| 56 | 14 | 171 | `/enneagram-corner/enneagram-connecting-lines` |
| 35 | 10 | 456 | `/enneagram-corner/beginners-guide-to-determining-your-enneagram-type` |

---

## Not live (excluded from every number above)

| Status | Files | Meaning |
|---|---|---|
| draft | 23 | Routable, `published` is false |
| redirected | 8 | Unpublished and the route 301s the slug to a newer post |
| no-frontmatter | 2 | Routable folder but no frontmatter (notes); 404s |
| excluded | 49 | Social variants and notes the route globs skip (`.instagram/.twitter/.reddit/.review`, `-twitter`) |
| not-routable | 10 | Folders no route serves (templates, research notes) |

### Drafts

Unpublished posts in routable folders. Word count ≥2,500 with links already in place usually means close to done.

| Words | Date | Links out | Title | File |
|---|---|---|---|---|
| 5,185 | 2026-06-30 | 8 | Why World Leaders Can't Read Each Other: The Psychology of Global Pow… | `pop-culture/world-leaders-enneagram-personality-dynamics.md` |
| 4,492 | 2026-03-04 | 8 | Depp vs Heard: Why a Type 4 and a Type 3 Were Built to Destroy Each O… | `pop-culture/depp-vs-heard-enneagram-analysis.md` |
| 4,401 | 2026-05-07 | 12 | Succession Enneagram: Why Logan Roy Bred Four Different Personality D… | `pop-culture/succession-roy-siblings-enneagram-types.md` |
| 4,083 | 2026-05-19 | 5 | Alex and Leila Hormozi: What a Marriage Between Two Type 3s Actually … | `pop-culture/hormozi-marriage-two-type-3s-enneagram.md` |
| 3,675 | 2026-06-12 | 16 | How to Stand Up for Yourself: Why Your Personality Type Makes It Worse | `guides/how-to-stand-up-for-yourself.md` |
| 3,537 | 2026-05-19 | 7 | My First Million's Real Engine: What Happens When a Type 7 and a Type… | `pop-culture/my-first-million-shaan-sam-enneagram-dynamic.md` |
| 3,369 | 2026-10-28 | 7 | Dario and Daniela Amodei: Why a CEO Who Plans for the Worst Trusts Hi… | `pop-culture/dario-daniela-amodei-enneagram-dynamic.md` |
| 3,122 | 2026-04-30 | 2 | You Can't Inherit a Personality: The Succession Trap That Topples Fou… | `pop-culture/succession-personality-trap.md` |
| 2,538 | 2026-02-06 | 4 | Your Hidden Superpower: How the Enneagram Reveals the Gifts You Canno… | `guides/enneagram-hidden-strengths-and-gifts.md` |
| 2,386 | 2026-07-15 | 6 | Enneagram and Autism: Why Masking Makes You Mistype as a 5, 9, or 1 | `enneagram/enneagram-and-autism-why-you-keep-mistyping.md` |
| 2,370 | 2026-04-01 | 15 | The Missing Middle: You're Not Broken, You're Just Not Fine Either | `enneagram/the-missing-middle.md` |
| 2,094 | 2025-12-15 | 5 | AOC and the Squad: The Enneagram Types of Millennial Politicians Resh… | `pop-culture/aoc-and-the-squad-enneagram-types.md` |
| 1,787 | 2025-12-21 | 0 | OnlyFans Creators by Enneagram: The Psychology of Digital Intimacy | `pop-culture/onlyfans-creators-enneagram-digital-intimacy.md` |
| 848 | 2026-03-04 | 7 | Pop Queens: The Personality Types Ruling Music Right Now | `pop-culture/pop-queens-enneagram-analysis.md` |
| 845 | 2026-03-04 | 6 | Online Gurus: The Personality Types Selling You a Better Life | `pop-culture/online-gurus-enneagram-analysis.md` |
| 804 | 2026-02-03 | 0 | Jeffrey Epstein's Web of Manipulation: How He Lured the Powerful and … | `pop-culture/epstein-web-of-manipulation.md` |
| 795 | 2026-03-04 | 4 | The Royal Family: Four Enneagram Types, One Fractured Dynasty | `pop-culture/royal-family-enneagram-analysis.md` |
| 713 | 2026-03-04 | 5 | Streaming Royalty: The Personality Types That Built Empires From Bedr… | `pop-culture/streaming-royalty-enneagram-analysis.md` |
| 691 | 2026-03-04 | 4 | Marvel's Avengers IRL: The Enneagram Types Behind the MCU's Biggest S… | `pop-culture/marvel-universe-enneagram-analysis.md` |
| 668 | 2026-03-21 | 4 | The PayPal Mafia: How One Company Produced More Tech Billionaires Tha… | `pop-culture/tech-titans-paypal-mafia.md` |
| 665 | 2026-03-04 | 4 | Silicon Valley Power Players: The All-In Pod and the Psychology of Te… | `pop-culture/silicon-valley-power-players-enneagram-analysis.md` |
| 651 | 2026-03-04 | 4 | Oscar Contenders: The Personality Types That Win Academy Awards | `pop-culture/oscar-contenders-enneagram-analysis.md` |
| 244 | 2026-02-20 | 0 | Edgy Racism Is the New Punk: How Transgression Switched Sides | `community/edgy-rebellion-new-punk.md` |

### Redirected (superseded)

- `enneagram/anxiety-and-enneagram-types-guide.md` → `/enneagram-corner/mental-health/enneagram-anxiety-complete-guide`
- `enneagram/enneagram-anxiety-management-guide.md` → `/enneagram-corner/mental-health/enneagram-anxiety-complete-guide`
- `enneagram/enneagram-communication-guide.md` → `/enneagram-corner/relationship-communication-guide`
- `enneagram/enneagram-communication-styles.md` → `/enneagram-corner/relationship-communication-guide`
- `enneagram/enneagram-communication-tips.md` → `/enneagram-corner/relationship-communication-guide`
- `enneagram/enneagram-compatibility-guide.md` → `/enneagram-corner/enneagram-compatibility-matrix`
- `enneagram/enneagram-stress-number.md` → `/enneagram-corner/enneagram-types-in-stress`
- `enneagram/enneagram-test-comparison-2025.md` → `/enneagram-corner/enneagram-test-comparison-2026`

### No frontmatter / not routable

- `enneagram/enneagram-dating-guide-captivate-deeper.md` (no-frontmatter)
- `enneagram/enneagram-dating-guide-captivate.md` (no-frontmatter)
- `generational/template.md` (not-routable)
- `historical/template.md` (not-routable)
- `life-situations/before-your-next-fight.md` (not-routable)
- `life-situations/template.md` (not-routable)
- `life-style/template.md` (not-routable)
- `overview/template.md` (not-routable)
- `situational/template.md` (not-routable)
- `topic-map.md` (not-routable)
- `topical/psychology-ideas.md` (not-routable)
- `topical/template.md` (not-routable)

---

## Complete live index

Sorted by impressions. In = blog + people pages linking in. Out = links to live blog + people pages.

| Impr. | Pos. | In (blog/people) | Out (blog/people) | Title | Page |
|---|---|---|---|---|---|
| 13,556 | 10.7 | 165 (20/145) | 16 (16/0) | Enneagram Instinctual Subtypes: Why You Don't Fully Match Your Type | `/enneagram-corner/enneagram-instinctual-subtypes` |
| 12,500 | 8.7 | 25 (22/3) | 22 (22/0) | The Enneagram and Mental Illness: Understand Each Type's Predispositi… | `/enneagram-corner/enneagram-and-mental-illness` |
| 12,004 | 6.9 | 9 (9/0) | 16 (16/0) | What Enneagram Type Is Your Zodiac Sign? The Complete Correlation Cha… | `/enneagram-corner/astrology-and-the-enneagram` |
| 10,468 | 11.5 | 21 (21/0) | 8 (8/0) | The Complete Enneagram Compatibility Matrix: All 45 Type Pairings Dec… | `/enneagram-corner/enneagram-compatibility-matrix` |
| 7,552 | 8.7 | 194 (15/179) | 41 (7/34) | Enneagram Wings: Compare All 18 Combinations and Find Your Pattern | `/enneagram-corner/enneagram-wings-complete-guide` |
| 6,647 | 9.3 | 20 (20/0) | 19 (19/0) | Toxic Traits of Each Enneagram Type (and Which One Is the Worst) | `/enneagram-corner/toxic-traits-of-each-enneagram-type` |
| 5,699 | 7.2 | 26 (14/12) | 3 (3/0) | Depression Patterns by Enneagram Type | `/enneagram-corner/depression-patterns-by-enneagram-type` |
| 5,324 | 7.7 | 5 (5/0) | 9 (9/0) | How Common Is Each Enneagram Type? (Rarest to Most Common, and Why th… | `/enneagram-corner/how-common-is-each-enneagram-type` |
| 5,244 | 7.9 | 21 (13/8) | 16 (16/0) | Attachment Styles and Enneagram Types: A Map | `/enneagram-corner/attachment-styles-and-enneagram-types` |
| 4,714 | 6.7 | 11 (11/0) | 8 (8/0) | Enneagram and Neurodivergence: ADHD, Autism, and Motivation | `/enneagram-corner/mental-health/enneagram-neurodivergence-guide` |
| 4,529 | 30.6 | 31 (24/7) | 17 (17/0) | Enneagram Types in Relationships: How Each Type Loves, Fights, and Re… | `/enneagram-corner/enneagram-types-in-relationships` |
| 4,380 | 7.5 | 3 (3/0) | 17 (9/8) | The Kardashian Family Enneagram: How Each Type Built a Billion Dollar… | `/pop-culture/kardashian-family-enneagram-analysis` |
| 4,302 | 4.9 | 9 (7/2) | 22 (22/0) | Enneagram and ADHD: Which Types Struggle Most (And Why) | `/enneagram-corner/enneagram-and-adhd-which-types-struggle-most` |
| 3,926 | 8.3 | 12 (12/0) | 16 (16/0) | Love Languages & Enneagram Types: The 45-Combination Compatibility Gu… | `/enneagram-corner/love-languages-and-enneagram-types` |
| 3,919 | 7.1 | 21 (21/0) | 21 (21/0) | How Each Enneagram Type Manipulates (And How to Spot It) | `/enneagram-corner/how-each-enneagram-type-manipulates` |
| 3,473 | 36.5 | 24 (24/0) | 40 (40/0) | What's My Enneagram Type? (The 5-Minute Answer You Actually Need) | `/enneagram-corner/enneagram-tldr` |
| 2,848 | 10.6 | 7 (7/0) | 4 (4/0) | Best Free Enneagram Tests (2026): An Honest Comparison | `/enneagram-corner/enneagram-test-comparison-2026` |
| 2,678 | 27.0 | 156 (55/101) | 15 (15/0) | Enneagram Type 3: Achiever - Success Becomes Identity | `/enneagram-corner/enneagram-type-3` |
| 2,675 | 7.1 | 5 (5/0) | 13 (13/0) | Which Enneagram Type Is Most Likely to Be a Narcissist? (Every Type H… | `/enneagram-corner/which-enneagram-type-is-most-likely-to-be-a-narcissist` |
| 2,547 | 33.0 | 130 (55/75) | 18 (18/0) | Enneagram Type 9: Peacemaker - Finding Your Voice | `/enneagram-corner/enneagram-type-9` |
| 2,507 | 8.5 | 4 (4/0) | 20 (20/0) | Your Enneagram Guide to Toxic Traits in a Relationship (and the Early… | `/enneagram-corner/toxic-traits-relationships-warning-signs` |
| 2,496 | 9.2 | 19 (19/0) | 6 (6/0) | Is the Enneagram Scientifically Valid? What Research Says | `/enneagram-corner/mental-health/enneagram-science-mental-health` |
| 2,356 | 38.7 | 134 (50/84) | 16 (16/0) | Enneagram Type 4: Individualist - The Missing Piece | `/enneagram-corner/enneagram-type-4` |
| 2,257 | 31.3 | 63 (51/12) | 25 (25/0) | Relationship Communication Guide: The Enneagram Key | `/enneagram-corner/relationship-communication-guide` |
| 2,066 | 12.6 | 9 (8/1) | 13 (13/0) | Enneagram Careers: Find the Working Conditions That Fit You | `/enneagram-corner/enneagram-types-and-career-choices` |
| 2,034 | 8.5 | 15 (15/0) | 6 (6/0) | The Enneagram's Place in Personality Science: An Honest Audit | `/enneagram-corner/enneagram-vs-personality-frameworks-comparison` |
| 1,895 | 11.8 | 127 (55/72) | 13 (13/0) | Enneagram Type 5: Observer - Inside the Fortress Mind | `/enneagram-corner/enneagram-type-5` |
| 1,892 | 8.1 | 12 (7/5) | 15 (15/0) | Enneagram and Addiction: Why Each Type Self-Medicates Differently | `/enneagram-corner/mental-health/enneagram-addiction-recovery-guide` |
| 1,870 | 18.2 | 213 (71/142) | 17 (17/0) | Enneagram Types in Stress: Stress Points, Arrows, and the Loop Undern… | `/enneagram-corner/enneagram-types-in-stress` |
| 1,560 | 11.1 | 30 (15/15) | 9 (9/0) | Why Type 6 Isn't the Only Anxious Type (Every Type's Hidden Anxiety P… | `/enneagram-corner/mental-health/enneagram-anxiety-complete-guide` |
| 1,531 | 51.9 | 140 (51/89) | 26 (15/11) | Enneagram Type 6: Loyalist - Search for Solid Ground | `/enneagram-corner/enneagram-type-6` |
| 1,472 | 51.6 | 5 (5/0) | 19 (19/0) | The 9 Coworker Types: Each Enneagram as Boss, Peer, Report | `/enneagram-corner/enneagram-types-working-in-teams` |
| 1,462 | 23.7 | 4 (4/0) | 3 (3/0) | Is the Enneagram Religious? (The Truth About Its Spiritual Origins) | `/enneagram-corner/enneagram-and-religion` |
| 1,404 | 6.7 | 26 (26/0) | 17 (17/0) | Why They Ghosted You (Based on Their Enneagram Type) | `/enneagram-corner/enneagram-types-being-ghosted` |
| 1,300 | 8.1 | 24 (22/2) | 21 (18/3) | Enneagram Strengths and Weaknesses: Why Each Type's Superpower Is Als… | `/enneagram-corner/enneagram-strengths-and-weaknesses` |
| 1,218 | 11.3 | 3 (3/0) | 7 (7/0) | What Is a Love Language in a Relationship? (And Why Two People With t… | `/enneagram-corner/what-is-a-love-language` |
| 1,213 | 7.3 | 11 (11/0) | 6 (6/0) | How to Apologize by Enneagram Type: The Nine Scripts Each Type Skips | `/enneagram-corner/how-to-apologize-like-a-pro` |
| 1,176 | 7.0 | 4 (4/0) | 15 (15/0) | Best Compliments for Each Enneagram Type | `/enneagram-corner/biggest-compliments-to-give-each-enneagram-type` |
| 1,039 | 7.0 | 17 (17/0) | 23 (23/0) | Why You Can't Stop Overthinking (Your Enneagram Type Explains It) | `/enneagram-corner/why-you-cant-stop-overthinking-enneagram` |
| 978 | 8.3 | 26 (25/1) | 25 (25/0) | How Each Enneagram Type Self-Sabotages Success (And How to Stop) | `/enneagram-corner/how-each-enneagram-type-self-sabotages-success` |
| 951 | 35.5 | 105 (53/52) | 16 (16/0) | Enneagram Type 2: Helper - The One-Way Mirror | `/enneagram-corner/enneagram-type-2` |
| 929 | 11.1 | 10 (9/1) | 5 (5/0) | 9 Childhood Stereotypes Based on the Enneagram | `/enneagram-corner/enneagram-childhood-stereotypes` |
| 915 | 18.7 | 3 (2/1) | 17 (17/0) | Enneagram Parenting Styles: Why You Parent the Way You Do | `/enneagram-corner/enneagram-parenting-styles` |
| 883 | 10.1 | 123 (50/73) | 14 (14/0) | Enneagram Type 8: Challenger - Behind the Armor | `/enneagram-corner/enneagram-type-8` |
| 833 | 10.1 | 4 (4/0) | 18 (18/0) | Enneagram Mental Health Red Flags: Early Warning Signs for All 9 Types | `/enneagram-corner/enneagram-mental-health-flags` |
| 826 | 24.0 | 18 (16/2) | 14 (14/0) | Enneagram for Personal Growth: The Advice That Fixed You Can Break Th… | `/enneagram-corner/enneagram-personal-growth` |
| 824 | 7.6 | 3 (3/0) | 6 (5/1) | Ghislaine Maxwell: The Hostage Princess Who Became the Enabler-in-Chi… | `/pop-culture/ghislaine-maxwell-psychology` |
| 768 | 8.7 | 6 (6/0) | 3 (3/0) | Enneagram Social Styles: The Hornevian Triads, Decoded | `/enneagram-corner/enneagram-social-styles` |
| 727 | 32.0 | 5 (5/0) | 3 (3/0) | Enneagram Team Dynamics: Which Pairs Click, Which Implode | `/enneagram-corner/enneagram-team-dynamics` |
| 718 | 9.9 | 7 (7/0) | 33 (8/25) | Tech Leadership by Personality Type: How Each Enneagram Type Runs a C… | `/pop-culture/tech-titans-leadership-styles` |
| 701 | 11.2 | 4 (4/0) | 16 (7/9) | Google's Three Personality Eras: Why the Founders Had to Come Back | `/pop-culture/google-leadership-evolution` |
| 668 | 9.2 | 8 (8/0) | 4 (4/0) | Why Dating Apps Are Harder for Certain Personality Types | `/enneagram-corner/why-dating-apps-are-harder-for-certain-personality-types` |
| 647 | 8.8 | 8 (8/0) | 15 (7/8) | The AI Wars: Why Personality Types Determine Who Gets to Build God | `/pop-culture/tech-titans-ai-wars` |
| 645 | 8.6 | 9 (9/0) | 8 (8/0) | Crisis Management by Enneagram Type: A Mental Health Toolkit | `/enneagram-corner/mental-health/enneagram-crisis-management-guide` |
| 605 | 21.9 | 9 (9/0) | 12 (12/0) | How Your Enneagram Type Shapes Your Therapy Experience | `/enneagram-corner/mental-health/enneagram-therapy-guide` |
| 597 | 34.2 | 11 (8/3) | 24 (24/0) | Enneagram Concepts: The Personality Box You're Living In | `/enneagram-corner/enneagram-concepts` |
| 557 | 51.1 | 6 (4/2) | 11 (9/2) | Enneagram Leadership: Why Your Approach Keeps Backfiring | `/enneagram-corner/enneagram-leadership` |
| 496 | 22.3 | 3 (3/0) | 5 (5/0) | Dating Dynamics by Enneagram Type: 9 Patterns That Sabotage Love (and… | `/how-to-guides/dating-dynamics-by-enneagram-type` |
| 478 | 6.6 | 7 (7/0) | 8 (8/0) | Dark Triad Celebrities and the Enneagram: What We Can Actually Say | `/pop-culture/dark-triad-meets-enneagram` |
| 456 | 18.4 | 35 (35/0) | 10 (10/0) | Find Your Enneagram Type in 10 Minutes (4 Simple Steps) | `/enneagram-corner/beginners-guide-to-determining-your-enneagram-type` |
| 430 | 14.9 | 3 (3/0) | 10 (7/3) | The Psychology of Jeffrey Epstein: Understanding the Dark Helper (Par… | `/pop-culture/epstein-psychology-part-1` |
| 422 | 19.6 | 139 (53/86) | 12 (12/0) | Enneagram Type 7: Enthusiast - The Possibility Engine | `/enneagram-corner/enneagram-type-7` |
| 405 | 16.2 | 3 (3/0) | 10 (10/0) | How Each Enneagram Type Resists Therapy | `/enneagram-corner/mental-health/enneagram-therapy-resistance-guide` |
| 400 | 8.5 | 12 (12/0) | 19 (19/0) | Enneagram Types on a First Date: What to Expect | `/enneagram-corner/enneagram-types-on-a-first-date` |
| 395 | 10.8 | 27 (27/0) | 21 (21/0) | The Party Test: What Your Social Style Reveals About Your Type | `/enneagram-corner/enneagram-types-at-party` |
| 365 | 13.3 | 108 (49/59) | 13 (13/0) | Enneagram Type 1: Perfectionist - The Inner Courtroom | `/enneagram-corner/enneagram-type-1` |
| 362 | 11.4 | 3 (3/0) | 17 (17/0) | How All 9 Enneagram Types Flex (And What They Need) | `/enneagram-corner/how-each-enneagram-flexes` |
| 354 | 13.4 | 3 (3/0) | 5 (5/0) | How Each Enneagram Type Unwinds: Your Stress-Relief Formula | `/enneagram-corner/how-each-enneagram-type-unwinds` |
| 351 | 24.8 | 7 (7/0) | 16 (16/0) | Enneagram vs Myers-Briggs: Which Actually Explains You Better? | `/enneagram-corner/enneagram-vs-meyers-briggs` |
| 332 | 6.0 | 5 (5/0) | 35 (4/31) | What Enneagram Type Are Most Musicians? The Data Says Type 4 | `/pop-culture/what-enneagram-type-are-most-musicians` |
| 325 | 8.2 | 3 (3/0) | 3 (3/0) | Enneagram First Impression Cheat Sheet: All 9 Types | `/enneagram-corner/first-impression-cheat-sheet` |
| 322 | 10.0 | 3 (3/0) | 11 (11/0) | Enneagram Dating Guide for Men: Blind Spots and Practical Moves | `/enneagram-corner/enneagram-dating-guide-for-men` |
| 301 | 8.8 | 12 (11/1) | 14 (14/0) | Enneagram Harmonic Approaches: How Each Type Handles Conflict | `/enneagram-corner/enneagram-harmonic-approaches` |
| 293 | 5.5 | 5 (5/0) | 85 (10/75) | What Enneagram Type Are Most CEOs? Data From 80 Business Profiles | `/enneagram-corner/what-enneagram-type-are-most-ceos` |
| 291 | 9.7 | 11 (11/0) | 10 (10/0) | How Your Enneagram Type Shapes Your Relationship with Medication | `/enneagram-corner/mental-health/enneagram-medication-mental-health` |
| 261 | 9.7 | 9 (9/0) | 9 (9/0) | Why You're Burning Out at Work (Your Enneagram Type Reveals It) | `/enneagram-corner/mental-health/enneagram-workplace-mental-health` |
| 261 | 18.9 | 3 (3/0) | 4 (4/0) | 5 Conversations That Separate Thriving Couples From Everyone Else | `/how-to-guides/5-tough-conversations-you-need-to-have-with-your-partner` |
| 217 | 8.4 | 6 (6/0) | 32 (8/24) | Tech Titans Through the Enneagram: A Series on the Personality Types … | `/pop-culture/tech-titans-enneagram-analysis` |
| 187 | 9.2 | 3 (3/0) | 10 (5/5) | Alex Cooper vs Alix Earle: Why the Mentor-Protegee Pipeline Always Ex… | `/pop-culture/alex-cooper-alix-earle-beef-enneagram-analysis` |
| 177 | 31.3 | 3 (2/1) | 3 (3/0) | Who Built the Enneagram? Mystics, Psychiatrists, Philosophers | `/enneagram-corner/enneagram-influences` |
| 171 | 15.3 | 56 (9/47) | 14 (14/0) | Enneagram Connecting Lines: Growth and Stress | `/enneagram-corner/enneagram-connecting-lines` |
| 170 | 19.6 | 15 (6/9) | 25 (9/16) | Why the Next Thing Won't Fix It (How Type 7s Actually Find What They'… | `/enneagram-corner/why-the-next-thing-wont-fix-it-type-7` |
| 162 | 7.9 | 4 (4/0) | 27 (16/11) | The Fallen Founders: What Holmes, Neumann, and Bankman-Fried Reveal A… | `/pop-culture/fallen-founders-enneagram-analysis` |
| 153 | 22.3 | 4 (4/0) | 37 (37/0) | Enneagram Books, Websites, Podcasts & Influencers | `/enneagram-corner/enneagram-books-websites-podcasts` |
| 145 | 9.0 | 3 (3/0) | 9 (4/5) | John Coogan and Jordi Hays Built TBPN by Wanting Different Things | `/pop-culture/tbpn-john-coogan-jordi-hays-enneagram-dynamic` |
| 144 | 24.6 | 3 (3/0) | 4 (4/0) | The Blackpill Downward Spiral: How Pain Becomes Fate | `/pop-culture/incel-blackpill-radicalization-enneagram` |
| 143 | 7.7 | 3 (3/0) | 14 (12/2) | Cancel Culture by Enneagram Type: Who Cancels and Who Gets Cancelled | `/pop-culture/cancel-culture-enneagram-type` |
| 136 | 9.2 | 6 (6/0) | 7 (7/0) | Philosophy and Psychology Gave Birth to the Enneagram | `/enneagram-corner/philosophy-psychology-and-the-enneagram` |
| 123 | 10.7 | 4 (4/0) | 17 (17/0) | Why You Keep Sabotaging New Relationships (Your Enneagram Knows) | `/enneagram-corner/how-to-navigate-early-relationship-stages` |
| 92 | 7.8 | 3 (3/0) | 12 (2/10) | Inside the Heartthrob Machine: What Fame Does to the Men Women Obsess… | `/pop-culture/hollywood-heartthrobs-enneagram-analysis` |
| 80 | 10.3 | 3 (3/0) | 3 (3/0) | How Epstein Trapped the Powerful and the Vulnerable (Part 2) | `/pop-culture/epstein-psychology-part-2` |
| 79 | 6.4 | 4 (4/0) | 6 (6/0) | The Enneagram Changed My Life, But I Learned to Shut Up About It | `/community/why-im-selective-sharing-enneagram` |
| 75 | 7.6 | 3 (3/0) | 8 (8/0) | How to Throw a Party Everyone Actually Wants to Attend | `/enneagram-corner/enneagram-party-planner` |
| 68 | 8.1 | 5 (5/0) | 16 (5/11) | The Podcaster Personality Map: Why Hosts Return to the Same Topics | `/pop-culture/podcaster-personality-map` |
| 66 | 22.3 | 14 (14/0) | 15 (15/0) | Enneagram Self-Development: What I Got Wrong as a Type 8 | `/enneagram-corner/enneagram-self-development` |
| 64 | 11.8 | 3 (3/0) | 13 (13/0) | Neurodiversity vs. Personality: Stop Looking for Labels, Start Lookin… | `/enneagram-corner/neurodiversity-vs-personality` |
| 58 | 7.4 | 4 (4/0) | 16 (6/10) | US Presidents by Enneagram Type: The Psychology of the Oval Office | `/pop-culture/us-presidents-enneagram-analysis` |
| 48 | 7.0 | 3 (3/0) | 10 (3/7) | The Disruptors: Why Type 8s Break Industries and Type 5s Decode Them | `/pop-culture/tech-titans-disruptors` |
| 40 | 8.6 | 3 (3/0) | 14 (5/9) | Trump's Type 3 vs Biden's Type 2: Why They Could Never Understand Eac… | `/pop-culture/trump-type-3-vs-biden-type-2` |
| 38 | 7.6 | 5 (5/0) | 17 (8/9) | Comedy Kings: Why the Funniest Men Alive Are Wired Completely Differe… | `/pop-culture/comedy-kings-enneagram-analysis` |
| 31 | 8.2 | 3 (3/0) | 20 (20/0) | Productivity Systems by Enneagram Type | `/how-to-guides/productivity-systems-by-enneagram-type` |
| 30 | 5.9 | 5 (5/0) | 14 (5/9) | Founders vs Stewards: The Personality Types That Replace Tech Visiona… | `/pop-culture/tech-titans-founders-vs-stewards` |
| 26 | 6.5 | 3 (3/0) | 5 (5/0) | Kant Said Reality Is Filtered. The Enneagram Shows the Other 8 Filter… | `/community/kantian-filters-and-nine-perspectives` |
| 25 | 7.6 | 6 (6/0) | 11 (11/0) | When 'I'm Fine' Isn't: Reading Your Child's Mental Health by Type | `/enneagram-corner/mental-health/enneagram-parenting-mental-health` |
| 21 | 13.0 | 5 (5/0) | 16 (16/0) | Enneagram First Impressions: What Each Type Is Scanning For | `/enneagram-corner/first-impression-enneagram-playbook` |
| 21 | 7.9 | 3 (3/0) | 10 (10/0) | Enneagram Dating Guide for Women: Decode Your Perfect Match Formula | `/enneagram-corner/enneagram-dating-guide-for-women` |
| 18 | 9.8 | 3 (3/0) | 4 (4/0) | Why You Don't Believe in Yourself (And How to Fix It in 30 Days) | `/how-to-guides/definitive-guide-to-self-efficacy` |
| 12 | 20.8 | 3 (3/0) | 12 (12/0) | How to Use the Enneagram for Self-Development (Past the Test) | `/how-to-guides/using-the-enneagram-for-self-development` |
| 8 | 7.6 | 4 (4/0) | 8 (3/5) | Musk vs Altman Trial: The Verdict, the Vibes, and the Personality Cla… | `/pop-culture/musk-vs-altman-trial-personality-dynamics` |
| 5 | 7.0 | 3 (3/0) | 4 (4/0) | Personality Maxing: Looksmaxxing for What People Experience | `/enneagram-corner/personality-maxing` |
| 5 | 3.2 | 3 (3/0) | 5 (5/0) | How to Read People: The 4-Step Guide to Understanding Anyone | `/how-to-guides/how-to-psychoanalyze-people` |
| 4 | 8.5 | 6 (6/0) | 8 (7/1) | Be Gentle When You're Right | `/community/be-gentle-when-youre-right` |
| 3 | 10.0 | 3 (3/0) | 9 (9/0) | Why Your Team Keeps Having the Same Ideas (Enneagram Fix) | `/enneagram-corner/enneagram-team-diversity` |
| 2 | 6.5 | 5 (5/0) | 5 (5/0) | Memetic Comments: Why Your Online Opinions Aren't Really Yours | `/community/memetic-comments` |
| 2 | 6.5 | 5 (5/0) | 17 (17/0) | Is the Enneagram Real? 27 Questions Everyone Asks (Finally Answered) | `/enneagram-corner/enneagram-faqs` |
| 2 | 8.5 | 4 (4/0) | 15 (14/1) | The Office Enneagram Types: Why Dunder Mifflin Was a Personality Disa… | `/pop-culture/the-office-enneagram-types` |
| 1 | 11.0 | 3 (3/0) | 7 (7/0) | You Didn't Find Yourself in the Enneagram. You Found a Map. | `/community/personality-frameworks-map-not-territory` |
| 1 | 15.0 | 3 (3/0) | 11 (11/0) | The Crash Course on Emotions We All Missed in Kindergarten | `/how-to-guides/the-crash-course-on-emotions-that-we-missed-in-kindergarten` |
| — | — | 22 (22/0) | 22 (22/0) | Red Flags You Are Dating Each Enneagram Type (And What to Do) | `/enneagram-corner/red-flags-dating-each-enneagram-type` |
| — | — | 17 (14/3) | 9 (9/0) | How Each Enneagram Type Survives Trauma | `/enneagram-corner/mental-health/enneagram-trauma-response-guide` |
| — | — | 12 (11/1) | 22 (21/1) | Shadow Work by Enneagram Type: Your Dark Side Has a Pattern | `/enneagram-corner/shadow-work-by-enneagram-type` |
| — | — | 8 (8/0) | 7 (7/0) | How Minds Actually Change | `/community/how-minds-change-on-9takes` |
| — | — | 8 (8/0) | 6 (6/0) | Parasocial Relationships Through the Enneagram | `/pop-culture/parasocial-relationships-enneagram-type` |
| — | — | 7 (6/1) | 5 (5/0) | The Intellectual Fortress That Becomes a Prison | `/community/fear-triad-intellectual-fortress-or-prison` |
| — | — | 7 (7/0) | 5 (5/0) | The Enneagram Under Fire: Common Criticisms Addressed | `/enneagram-corner/enneagram-criticisms` |
| — | — | 6 (6/0) | 9 (9/0) | The Consensus on Human Nature | `/community/consensus-on-human-nature` |
| — | — | 6 (6/0) | 13 (13/0) | Why MBTI Failed and What to Use Instead | `/community/mbti-vs-enneagram` |
| — | — | 6 (6/0) | 5 (5/0) | Why Therapy Doesn't Work the Same for Every Personality Type | `/enneagram-corner/why-therapy-doesnt-work-the-same-for-every-type` |
| — | — | 5 (5/0) | 10 (10/0) | Introducing 9takes: Answer First, Then Compare Perspectives | `/community/introducing-9takes` |
| — | — | 5 (2/3) | 22 (7/15) | How Type 8 Challengers Actually Succeed (It's Not What You Think) | `/enneagram-corner/how-type-8-challengers-actually-succeed` |
| — | — | 5 (5/0) | 5 (5/0) | The Definitive Guide to Relationship Conflict [Part 1] | `/how-to-guides/definitive-guide-to-relationship-conflict-part-1` |
| — | — | 4 (4/0) | 8 (8/0) | Where to Find an Enneagram Community That Doesn't Just Type You | `/community/enneagram-community` |
| — | — | 4 (4/0) | 6 (6/0) | What Was The Inspiration For 9takes? | `/community/inspiration-for-9takes` |
| — | — | 4 (4/0) | 5 (5/0) | What Winning Online Arguments Looks Like | `/community/what-winning-online-arguments-looks-like` |
| — | — | 4 (4/0) | 6 (5/1) | The 90-Day Personality Maxing Blueprint | `/enneagram-corner/90-day-personality-maxing-blueprint` |
| — | — | 4 (4/0) | 6 (6/0) | Active Listening Guide: Why Your Personality Type Sabotages It | `/how-to-guides/ultimate-guide-to-active-listening` |
| — | — | 4 (4/0) | 13 (5/8) | Podcast Bros: Inside the Movement That Replaced Mainstream Media | `/pop-culture/podcast-bros-enneagram-analysis` |
| — | — | 4 (4/0) | 13 (4/9) | The Anatomy of Public Shame: What We're Actually Doing When We "Cance… | `/pop-culture/psychology-of-public-shame` |
| — | — | 3 (3/0) | 3 (3/0) | The Bible Doesn't Start With Answers. It Starts With a Question. | `/community/questions-are-the-engine-of-moral-awakening` |
| — | — | 3 (3/0) | 6 (6/0) | 5 Reasons Reddit Can't Help You Find Deep Connections | `/community/reddit-deep-connections-limitations` |
| — | — | 3 (3/0) | 6 (6/0) | 3 Societal Ticking Time Bombs Nobody Is Connecting | `/community/societal-ticking-time-bombs` |
| — | — | 3 (3/0) | 7 (5/2) | The Hardware and Software of the Mind | `/community/software-and-hardware-of-the-mind` |
| — | — | 3 (3/0) | 4 (4/0) | Why the Greek vibe? | `/community/why-the-greek-vibe` |
| — | — | 3 (3/0) | 11 (11/0) | Why Your Enneagram Clients Aren't Changing (And the Homework That Act… | `/enneagram-corner/enneagram-coach-toolkit` |
| — | — | 3 (3/0) | 13 (13/0) | Attachment, Frustration, Rejection: Object Relations by Type | `/enneagram-corner/enneagram-object-relations` |
| — | — | 3 (3/0) | 6 (6/0) | Online Dating, Decoded: A Guide for Real Connection | `/enneagram-corner/enneagram-online-dating-guide` |
| — | — | 3 (3/0) | 5 (5/0) | The Voice in Your Head: Self-Talk by Enneagram Type | `/enneagram-corner/enneagram-positive-self-talk` |
| — | — | 3 (3/0) | 17 (17/0) | Enneagram at Work: What Each Type Needs, Fears, Brings | `/enneagram-corner/enneagram-workplace-team-building` |
| — | — | 3 (2/1) | 16 (16/0) | Why People Overshare: Shame, Boundaries, and Safe Spaces | `/enneagram-corner/oversharing-psychology-shame-boundaries` |
| — | — | 3 (3/0) | 3 (2/1) | The Stress Paradox: Why Emotional Patterns Outlast Situations | `/enneagram-corner/situations-change-emotions-dont` |
| — | — | 3 (3/0) | 8 (8/0) | Why Your Arguments Keep Repeating (And the Exercises That Actually Fi… | `/how-to-guides/definitive-guide-to-relationship-conflict-part-2` |
| — | — | 3 (3/0) | 3 (3/0) | The Pattern-Breaking Guide to Fighting Depression | `/how-to-guides/guide-to-fighting-depression` |
| — | — | 3 (3/0) | 11 (4/7) | Is Artificial a True Story? The Real People Behind Guadagnino's OpenA… | `/pop-culture/artificial-movie-real-people` |
| — | — | 3 (3/0) | 9 (6/3) | Breaking Points: How a Type 1 and a Type 7 Built Media's Most Unlikel… | `/pop-culture/breaking-points-enneagram-analysis` |
| — | — | 3 (3/0) | 5 (5/0) | Influencer Enneagram Types: Nine Creator Pressure Patterns | `/pop-culture/influencer-enneagram-types-instagram` |
| — | — | 3 (3/0) | 8 (8/0) | Masculinity, Strength, and Emotional Maturity | `/pop-culture/masculinity-strength-and-the-enneagram` |
| — | — | 3 (3/0) | 3 (3/0) | Reddit Moderators and Enneagram: What Actually Motivates Mods | `/pop-culture/reddit-moderators-type-1-internet` |
| — | — | 3 (3/0) | 13 (3/10) | The Platform Emperors: How Personality Types Shape the Products Billi… | `/pop-culture/tech-titans-platform-emperors` |
| — | — | 3 (3/0) | 14 (14/0) | Why Is Twitter/X So Toxic? 6 Reasons Conflict Spreads | `/pop-culture/twitter-x-personality-types-toxic` |
