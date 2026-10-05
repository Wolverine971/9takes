# Blog Cross-Link Index

_Generated: 2026-10-05 by `pnpm gen:crosslinks` (scripts/generate-crosslink-report.js)_
_Search data: GSC 2026-07-04 → 2026-10-02 (pulled 2026-10-04)_

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
| Live blog posts | 147 (+ 9 type pages) |
| Published people pages | 451 |
| Completely isolated (0 in, 0 out) | 0 |
| 0 incoming | 0 |
| 0 outgoing | 0 |
| Below gate (<3 in or <3 out) | 0 (0 not grandfathered) |
| Broken internal links (live post → non-live page) | 0 |
| Links that go through a 301 | 0 |
| Broken/redirected links on people pages (draft mirror) | 0 |
| Body links: blog → blog / blog → people | 1,576 / 296 |

---

## Section flow

Where body links go. Rows = linking section, columns = linked section.

| From \ To | enneagram-corner | community | how-to-guides | pop-culture | people | Stays in section | Posts | Median in |
|---|---|---|---|---|---|---|---|---|
| enneagram-corner | 1,140 | 23 | 13 | 20 | 77 | 90% | 95 | 8 |
| community | 57 | 50 | 1 | 6 | 2 | 43% | 18 | 4 |
| how-to-guides | 56 | 3 | 20 | 0 | 0 | 25% | 11 | 3 |
| pop-culture | 87 | 3 | 0 | 97 | 217 | 24% | 32 | 3 |

---

## Under-linked pages with search demand

Live posts at Google position 4–30 with 1,000+ impressions, sorted by how few links they get
relative to demand. These are where an internal link is most likely to move a ranking.

| Page | Impressions | Clicks | Position | In | Out |
|---|---|---|---|---|---|
| `/enneagram-corner/astrology-and-the-enneagram` | 10,859 | 146 | 8.2 | 8 | 15 |
| `/pop-culture/kardashian-family-enneagram-analysis` | 3,228 | 43 | 8.2 | 3 | 17 |
| `/enneagram-corner/enneagram-and-mental-illness` | 11,948 | 305 | 9.7 | 24 | 22 |
| `/enneagram-corner/enneagram-and-adhd-which-types-struggle-most` | 4,121 | 244 | 5.2 | 9 | 22 |
| `/enneagram-corner/enneagram-compatibility-matrix` | 8,180 | 89 | 13.4 | 20 | 7 |
| `/enneagram-corner/mental-health/enneagram-neurodivergence-guide` | 4,576 | 86 | 7.1 | 11 | 8 |
| `/enneagram-corner/toxic-traits-relationships-warning-signs` | 1,839 | 33 | 10.2 | 4 | 17 |
| `/enneagram-corner/enneagram-and-religion` | 1,382 | 10 | 27.0 | 3 | 3 |
| `/enneagram-corner/toxic-traits-of-each-enneagram-type` | 5,702 | 75 | 10.5 | 18 | 19 |
| `/enneagram-corner/enneagram-test-comparison-2026` | 2,112 | 14 | 9.8 | 7 | 4 |
| `/pop-culture/ghislaine-maxwell-psychology` | 1,051 | 9 | 8.0 | 3 | 6 |
| `/enneagram-corner/mental-health/enneagram-science-mental-health` | 4,400 | 5 | 9.6 | 16 | 6 |
| `/enneagram-corner/enneagram-vs-personality-frameworks-comparison` | 3,354 | 3 | 8.4 | 12 | 6 |
| `/enneagram-corner/depression-patterns-by-enneagram-type` | 5,353 | 125 | 7.8 | 22 | 4 |
| `/enneagram-corner/attachment-styles-and-enneagram-types` | 4,817 | 40 | 8.8 | 21 | 16 |
| `/enneagram-corner/love-languages-and-enneagram-types` | 3,017 | 8 | 8.7 | 13 | 16 |
| `/enneagram-corner/enneagram-types-and-career-choices` | 1,889 | 18 | 14.8 | 8 | 12 |
| `/enneagram-corner/how-each-enneagram-type-manipulates` | 3,571 | 32 | 7.4 | 21 | 21 |
| `/enneagram-corner/mental-health/enneagram-addiction-recovery-guide` | 1,778 | 47 | 8.7 | 12 | 14 |
| `/enneagram-corner/how-to-apologize-like-a-pro` | 1,110 | 26 | 7.8 | 9 | 5 |
| `/enneagram-corner/enneagram-strengths-and-weaknesses` | 1,362 | 20 | 9.1 | 24 | 15 |
| `/enneagram-corner/mental-health/enneagram-anxiety-complete-guide` | 1,571 | 7 | 12.4 | 30 | 9 |
| `/enneagram-corner/enneagram-instinctual-subtypes` | 6,880 | 27 | 14.2 | 154 | 16 |
| `/enneagram-corner/enneagram-types-being-ghosted` | 1,029 | 27 | 7.2 | 26 | 17 |
| `/enneagram-corner/enneagram-wings-complete-guide` | 6,730 | 40 | 9.1 | 188 | 40 |

## Dead ends with traffic

Live posts with 3 or fewer outgoing links, sorted by impressions. Readers land here and have nowhere to go.

| Page | Impressions | Clicks | Out | In |
|---|---|---|---|---|
| `/enneagram-corner/enneagram-and-religion` | 1,382 | 10 | 3 | 3 |
| `/enneagram-corner/enneagram-team-dynamics` | 695 | 1 | 3 | 3 |
| `/enneagram-corner/enneagram-social-styles` | 316 | 0 | 3 | 3 |
| `/enneagram-corner/first-impression-cheat-sheet` | 296 | 6 | 3 | 3 |
| `/how-to-guides/5-tough-conversations-you-need-to-have-with-your-partner` | 140 | 1 | 3 | 3 |
| `/pop-culture/epstein-psychology-part-2` | 122 | 0 | 3 | 3 |
| `/enneagram-corner/enneagram-influences` | 85 | 0 | 3 | 3 |
| `/community/questions-are-the-engine-of-moral-awakening` | — | — | 3 | 3 |
| `/enneagram-corner/personality-maxing` | — | — | 3 | 3 |
| `/enneagram-corner/situations-change-emotions-dont` | — | — | 3 | 3 |
| `/how-to-guides/guide-to-fighting-depression` | — | — | 3 | 3 |
| `/pop-culture/reddit-moderators-type-1-internet` | — | — | 3 | 3 |

## People bridge

People pages by search impressions and how many **blog posts** link to them in prose
(the FamousTypes block on type pages and the `/personality-analysis/categories/*` listings link
nearly every person, but those are not contextual links).
173 of 451 people pages have at least one blog link.

| Person | Impressions | Clicks | Position | Blog links in | People links in |
|---|---|---|---|---|---|
| [Sky Bri](/personality-analysis/sky-bri) | 22,216 | 149 | 10.4 | 0 | 2 |
| [IShowSpeed](/personality-analysis/ishowspeed) | 14,806 | 35 | 7.3 | 0 | 3 |
| [Jordi Hays](/personality-analysis/jordi-hays) | 11,132 | 219 | 6.5 | 2 | 1 |
| [Zendaya](/personality-analysis/zendaya) | 6,518 | 32 | 9.2 | 2 | 10 |
| [Ashby](/personality-analysis/ashby) | 5,915 | 32 | 9.5 | 1 | 0 |
| [Shawn Ryan](/personality-analysis/shawn-ryan) | 5,755 | 59 | 9.2 | 2 | 1 |
| [Lionel Messi](/personality-analysis/lionel-messi) | 5,069 | 27 | 8.8 | 0 | 3 |
| [Sabrina Carpenter](/personality-analysis/sabrina-carpenter) | 4,507 | 19 | 6.4 | 0 | 3 |
| [Ariana Grande](/personality-analysis/ariana-grande) | 3,949 | 22 | 9.6 | 0 | 6 |
| [Dario Amodei](/personality-analysis/dario-amodei) | 3,864 | 45 | 8.6 | 3 | 3 |
| [Jack Black](/personality-analysis/jack-black) | 3,633 | 32 | 7.7 | 1 | 4 |
| [Asmongold](/personality-analysis/asmongold) | 3,567 | 22 | 9.0 | 0 | 1 |
| [Selena Gomez](/personality-analysis/selena-gomez) | 3,540 | 21 | 7.4 | 1 | 4 |
| [Kai Cenat](/personality-analysis/kai-cenat) | 3,397 | 6 | 8.0 | 1 | 10 |
| [Kara Swisher](/personality-analysis/kara-swisher) | 3,391 | 30 | 8.1 | 0 | 3 |
| [Ryan Gosling](/personality-analysis/ryan-gosling) | 3,238 | 28 | 8.1 | 1 | 3 |
| [Emma Watson](/personality-analysis/emma-watson) | 3,228 | 9 | 8.7 | 0 | 3 |
| [Meghan Markle](/personality-analysis/meghan-markle) | 3,188 | 38 | 7.2 | 0 | 4 |
| [Sydney Sweeney](/personality-analysis/sydney-sweeney) | 3,166 | 16 | 7.4 | 0 | 1 |
| [Cillian Murphy](/personality-analysis/cillian-murphy) | 3,153 | 18 | 10.3 | 0 | 2 |
| [Oliver Tree](/personality-analysis/oliver-tree) | 3,107 | 15 | 7.4 | 0 | 0 |
| [Tom Holland](/personality-analysis/tom-holland) | 2,843 | 13 | 9.3 | 2 | 5 |
| [Hasan Piker](/personality-analysis/hasan-piker) | 2,727 | 15 | 9.4 | 0 | 3 |
| [David Friedberg](/personality-analysis/david-friedberg) | 2,682 | 20 | 13.4 | 1 | 3 |
| [John Coogan](/personality-analysis/john-coogan) | 2,682 | 26 | 6.8 | 2 | 1 |

## People pages that need links

A people page "needs links" with 2 or fewer contextual links in (blog posts + other people pages).
**204 of 451** people pages need links; 72 have none.
Unlinked mentions on other people pages are queued in `link-opportunities.md` §4.

| Person | Impressions | Position | Blog links in | People links in |
|---|---|---|---|---|
| [Sky Bri](/personality-analysis/sky-bri) | 22,216 | 10.4 | 0 | 2 |
| [Ashby](/personality-analysis/ashby) | 5,915 | 9.5 | 1 | 0 |
| [Asmongold](/personality-analysis/asmongold) | 3,567 | 9.0 | 0 | 1 |
| [Sydney Sweeney](/personality-analysis/sydney-sweeney) | 3,166 | 7.4 | 0 | 1 |
| [Cillian Murphy](/personality-analysis/cillian-murphy) | 3,153 | 10.3 | 0 | 2 |
| [Oliver Tree](/personality-analysis/oliver-tree) | 3,107 | 7.4 | 0 | 0 |
| [Tara Yummy](/personality-analysis/tara-yummy) | 2,632 | 9.0 | 0 | 0 |
| [Madison Beer](/personality-analysis/madison-beer) | 2,612 | 8.8 | 0 | 0 |
| [Benson Boone](/personality-analysis/benson-boone) | 2,489 | 8.4 | 1 | 0 |
| [Ella Langley](/personality-analysis/ella-langley) | 2,247 | 8.5 | 0 | 2 |
| [Robert Greene](/personality-analysis/robert-greene) | 2,034 | 9.9 | 0 | 2 |
| [Clavicular](/personality-analysis/clavicular) | 2,013 | 12.5 | 0 | 1 |
| [Charli D'Amelio](/personality-analysis/charli-damelio) | 1,641 | 8.4 | 0 | 2 |
| [Neil Strauss](/personality-analysis/neil-strauss) | 1,353 | 7.9 | 0 | 2 |
| [Leila Hormozi](/personality-analysis/leila-hormozi) | 1,322 | 8.6 | 0 | 1 |
| [Casey Neistat](/personality-analysis/casey-neistat) | 1,320 | 10.8 | 0 | 0 |
| [Bernard Arnault](/personality-analysis/bernard-arnault) | 1,242 | 8.3 | 0 | 0 |
| [Millie Bobby Brown](/personality-analysis/millie-bobby-brown) | 1,225 | 9.7 | 0 | 1 |
| [Druski](/personality-analysis/druski) | 1,140 | 8.5 | 1 | 1 |
| [Mikey Madison](/personality-analysis/mikey-madison) | 1,135 | 8.7 | 0 | 1 |
| [Tom Hardy](/personality-analysis/tom-hardy) | 1,077 | 8.5 | 1 | 1 |
| [Caleb Hearon](/personality-analysis/caleb-hearon) | 1,047 | 8.1 | 0 | 1 |
| [Nikola Tesla](/personality-analysis/nikola-tesla) | 1,030 | 10.1 | 0 | 2 |
| [Alexis Bledel](/personality-analysis/alexis-bledel) | 981 | 8.7 | 0 | 0 |
| [John Travolta](/personality-analysis/john-travolta) | 977 | 7.0 | 0 | 0 |

---

## Hubs

| In | Out | Impressions | Page |
|---|---|---|---|
| 211 | 17 | 1,284 | `/enneagram-corner/enneagram-types-in-stress` |
| 188 | 40 | 6,730 | `/enneagram-corner/enneagram-wings-complete-guide` |
| 154 | 16 | 6,880 | `/enneagram-corner/enneagram-instinctual-subtypes` |
| 145 | 14 | 3,674 | `/enneagram-corner/enneagram-type-3` |
| 130 | 12 | 456 | `/enneagram-corner/enneagram-type-7` |
| 129 | 24 | 1,329 | `/enneagram-corner/enneagram-type-6` |
| 128 | 14 | 2,057 | `/enneagram-corner/enneagram-type-4` |
| 123 | 13 | 1,620 | `/enneagram-corner/enneagram-type-5` |
| 122 | 14 | 1,050 | `/enneagram-corner/enneagram-type-8` |
| 122 | 17 | 2,499 | `/enneagram-corner/enneagram-type-9` |
| 107 | 13 | 372 | `/enneagram-corner/enneagram-type-1` |
| 102 | 15 | 854 | `/enneagram-corner/enneagram-type-2` |
| 63 | 24 | 2,122 | `/enneagram-corner/relationship-communication-guide` |
| 53 | 14 | 207 | `/enneagram-corner/enneagram-connecting-lines` |
| 34 | 10 | 365 | `/enneagram-corner/beginners-guide-to-determining-your-enneagram-type` |

---

## Not live (excluded from every number above)

| Status | Files | Meaning |
|---|---|---|
| draft | 24 | Routable, `published` is false |
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
| 4,401 | 2026-05-07 | 11 | Succession Enneagram: Why Logan Roy Bred Four Different Personality D… | `pop-culture/succession-roy-siblings-enneagram-types.md` |
| 4,083 | 2026-05-19 | 5 | Alex and Leila Hormozi: What a Marriage Between Two Type 3s Actually … | `pop-culture/hormozi-marriage-two-type-3s-enneagram.md` |
| 3,675 | 2026-06-12 | 16 | How to Stand Up for Yourself: Why Your Personality Type Makes It Worse | `guides/how-to-stand-up-for-yourself.md` |
| 3,674 | 2026-05-07 | 13 | The Office Enneagram Types: Why Dunder Mifflin Was a Personality Disa… | `pop-culture/the-office-enneagram-types.md` |
| 3,537 | 2026-05-19 | 7 | My First Million's Real Engine: What Happens When a Type 7 and a Type… | `pop-culture/my-first-million-shaan-sam-enneagram-dynamic.md` |
| 3,122 | 2026-04-30 | 2 | You Can't Inherit a Personality: The Succession Trap That Topples Fou… | `pop-culture/succession-personality-trap.md` |
| 2,717 | 2026-10-04 | 9 | Artificial: The Real People Behind Luca Guadagnino's OpenAI Movie | `pop-culture/artificial-movie-real-people.md` |
| 2,538 | 2026-02-06 | 4 | Your Hidden Superpower: How the Enneagram Reveals the Gifts You Canno… | `guides/enneagram-hidden-strengths-and-gifts.md` |
| 2,386 | 2026-07-15 | 6 | Enneagram and Autism: Why Masking Makes You Mistype as a 5, 9, or 1 | `enneagram/enneagram-and-autism-why-you-keep-mistyping.md` |
| 2,370 | 2026-04-01 | 15 | The Missing Middle: You're Not Broken, You're Just Not Fine Either | `enneagram/the-missing-middle.md` |
| 2,094 | 2025-12-15 | 5 | AOC and the Squad: The Enneagram Types of Millennial Politicians Resh… | `pop-culture/aoc-and-the-squad-enneagram-types.md` |
| 1,787 | 2025-12-21 | 0 | OnlyFans Creators by Enneagram: The Psychology of Digital Intimacy | `pop-culture/onlyfans-creators-enneagram-digital-intimacy.md` |
| 845 | 2026-03-04 | 6 | Online Gurus: The Personality Types Selling You a Better Life | `pop-culture/online-gurus-enneagram-analysis.md` |
| 831 | 2026-03-04 | 7 | Pop Queens: The Personality Types Ruling Music Right Now | `pop-culture/pop-queens-enneagram-analysis.md` |
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
| 11,948 | 9.7 | 24 (21/3) | 22 (22/0) | The Enneagram and Mental Illness: Understand Each Type's Predispositi… | `/enneagram-corner/enneagram-and-mental-illness` |
| 10,859 | 8.2 | 8 (8/0) | 15 (15/0) | What Enneagram Type Is Your Zodiac Sign? The Complete Correlation Cha… | `/enneagram-corner/astrology-and-the-enneagram` |
| 8,180 | 13.4 | 20 (20/0) | 7 (7/0) | The Complete Enneagram Compatibility Matrix: All 45 Type Pairings Dec… | `/enneagram-corner/enneagram-compatibility-matrix` |
| 6,880 | 14.2 | 154 (16/138) | 16 (16/0) | Enneagram Instinctual Subtypes: Why You Don't Fully Match Your Type | `/enneagram-corner/enneagram-instinctual-subtypes` |
| 6,730 | 9.1 | 188 (14/174) | 40 (7/33) | Why You Don't Match Your Enneagram Description (It's Your Wing) | `/enneagram-corner/enneagram-wings-complete-guide` |
| 5,702 | 10.5 | 18 (18/0) | 19 (19/0) | Toxic Traits of Each Enneagram Type (and Which One Is the Worst) | `/enneagram-corner/toxic-traits-of-each-enneagram-type` |
| 5,353 | 7.8 | 22 (10/12) | 4 (4/0) | Depression Patterns by Enneagram Type | `/enneagram-corner/depression-patterns-by-enneagram-type` |
| 4,817 | 8.8 | 21 (13/8) | 16 (16/0) | Attachment Styles and Enneagram Types: A Map | `/enneagram-corner/attachment-styles-and-enneagram-types` |
| 4,576 | 7.1 | 11 (11/0) | 8 (8/0) | Enneagram and Neurodivergence: ADHD, Autism, and Motivation | `/enneagram-corner/mental-health/enneagram-neurodivergence-guide` |
| 4,400 | 9.6 | 16 (16/0) | 6 (6/0) | Is the Enneagram Scientifically Valid? What Research Says | `/enneagram-corner/mental-health/enneagram-science-mental-health` |
| 4,314 | 37.3 | 31 (24/7) | 17 (17/0) | Enneagram Types in Relationships: How Each Type Loves, Fights, and Re… | `/enneagram-corner/enneagram-types-in-relationships` |
| 4,121 | 5.2 | 9 (7/2) | 22 (22/0) | Enneagram and ADHD: Which Types Struggle Most (And Why) | `/enneagram-corner/enneagram-and-adhd-which-types-struggle-most` |
| 3,674 | 27.8 | 145 (53/92) | 14 (14/0) | Enneagram Type 3: Achiever - Success Becomes Identity | `/enneagram-corner/enneagram-type-3` |
| 3,571 | 7.4 | 21 (21/0) | 21 (21/0) | How Each Enneagram Type Manipulates (And How to Spot It) | `/enneagram-corner/how-each-enneagram-type-manipulates` |
| 3,354 | 8.4 | 12 (12/0) | 6 (6/0) | The Enneagram's Place in Personality Science: An Honest Audit | `/enneagram-corner/enneagram-vs-personality-frameworks-comparison` |
| 3,228 | 8.2 | 3 (3/0) | 17 (9/8) | The Kardashian Family Enneagram: How Each Type Built a Billion Dollar… | `/pop-culture/kardashian-family-enneagram-analysis` |
| 3,017 | 8.7 | 13 (13/0) | 16 (16/0) | Love Languages & Enneagram Types: The 45-Combination Compatibility Gu… | `/enneagram-corner/love-languages-and-enneagram-types` |
| 2,499 | 36.9 | 122 (53/69) | 17 (17/0) | Enneagram Type 9: Peacemaker - Finding Your Voice | `/enneagram-corner/enneagram-type-9` |
| 2,122 | 40.6 | 63 (51/12) | 24 (24/0) | Relationship Communication Guide: The Enneagram Key | `/enneagram-corner/relationship-communication-guide` |
| 2,112 | 9.8 | 7 (7/0) | 4 (4/0) | Best Free Enneagram Tests (2026): An Honest Comparison | `/enneagram-corner/enneagram-test-comparison-2026` |
| 2,057 | 40.3 | 128 (48/80) | 14 (14/0) | Enneagram Type 4: Individualist - The Missing Piece | `/enneagram-corner/enneagram-type-4` |
| 1,889 | 14.8 | 8 (7/1) | 12 (12/0) | Why You Hate Your Job (It's Not the Boss, It's Your Enneagram Type) | `/enneagram-corner/enneagram-types-and-career-choices` |
| 1,839 | 10.2 | 4 (4/0) | 17 (17/0) | Red Flags You're Dating a Toxic Version of Each Enneagram Type | `/enneagram-corner/toxic-traits-relationships-warning-signs` |
| 1,778 | 8.7 | 12 (7/5) | 14 (14/0) | Enneagram and Addiction: Why Each Type Self-Medicates Differently | `/enneagram-corner/mental-health/enneagram-addiction-recovery-guide` |
| 1,620 | 14.5 | 123 (53/70) | 13 (13/0) | Enneagram Type 5: Observer - Inside the Fortress Mind | `/enneagram-corner/enneagram-type-5` |
| 1,619 | 43.1 | 24 (24/0) | 40 (40/0) | What's My Enneagram Type? (The 5-Minute Answer You Actually Need) | `/enneagram-corner/enneagram-tldr` |
| 1,571 | 12.4 | 30 (15/15) | 9 (9/0) | Why Type 6 Isn't the Only Anxious Type (Every Type's Hidden Anxiety P… | `/enneagram-corner/mental-health/enneagram-anxiety-complete-guide` |
| 1,499 | 52.6 | 4 (4/0) | 17 (17/0) | The 9 Coworker Types: Each Enneagram as Boss, Peer, Report | `/enneagram-corner/enneagram-types-working-in-teams` |
| 1,382 | 27.0 | 3 (3/0) | 3 (3/0) | Is the Enneagram Religious? (The Truth About Its Spiritual Origins) | `/enneagram-corner/enneagram-and-religion` |
| 1,362 | 9.1 | 24 (22/2) | 15 (15/0) | Your Type's Fatal Flaw (And Secret Superpower) Based on Enneagram | `/enneagram-corner/enneagram-strengths-and-weaknesses` |
| 1,329 | 56.6 | 129 (50/79) | 24 (14/10) | Enneagram Type 6: Loyalist - Search for Solid Ground | `/enneagram-corner/enneagram-type-6` |
| 1,284 | 26.0 | 211 (70/141) | 17 (17/0) | Enneagram Types in Stress: Stress Points, Arrows, and the Loop Undern… | `/enneagram-corner/enneagram-types-in-stress` |
| 1,110 | 7.8 | 9 (9/0) | 5 (5/0) | How to Apologize by Enneagram Type: The Nine Scripts Each Type Skips | `/enneagram-corner/how-to-apologize-like-a-pro` |
| 1,051 | 8.0 | 3 (3/0) | 6 (5/1) | Ghislaine Maxwell: The Hostage Princess Who Became the Enabler-in-Chi… | `/pop-culture/ghislaine-maxwell-psychology` |
| 1,050 | 11.0 | 122 (49/73) | 14 (14/0) | Enneagram Type 8: Challenger - Behind the Armor | `/enneagram-corner/enneagram-type-8` |
| 1,029 | 7.2 | 26 (26/0) | 17 (17/0) | Why They Ghosted You (Based on Their Enneagram Type) | `/enneagram-corner/enneagram-types-being-ghosted` |
| 984 | 7.2 | 4 (4/0) | 15 (15/0) | Best Compliments for Each Enneagram Type | `/enneagram-corner/biggest-compliments-to-give-each-enneagram-type` |
| 983 | 9.0 | 7 (7/0) | 14 (7/7) | The AI Wars: Why Personality Types Determine Who Gets to Build God | `/pop-culture/tech-titans-ai-wars` |
| 926 | 24.4 | 18 (16/2) | 14 (14/0) | Enneagram for Personal Growth: The Advice That Fixed You Can Break Th… | `/enneagram-corner/enneagram-personal-growth` |
| 868 | 10.9 | 8 (8/0) | 5 (5/0) | Why Dating Apps Are Harder for Certain Personality Types | `/enneagram-corner/why-dating-apps-are-harder-for-certain-personality-types` |
| 854 | 41.2 | 102 (52/50) | 15 (15/0) | Enneagram Type 2: Helper - The One-Way Mirror | `/enneagram-corner/enneagram-type-2` |
| 804 | 11.6 | 4 (4/0) | 15 (7/8) | Google's Three Personality Eras: Why the Founders Had to Come Back | `/pop-culture/google-leadership-evolution` |
| 803 | 27.3 | 3 (2/1) | 17 (17/0) | Enneagram Parenting Styles: Why You Parent the Way You Do | `/enneagram-corner/enneagram-parenting-styles` |
| 801 | 8.9 | 9 (9/0) | 7 (7/0) | Crisis Management by Enneagram Type: A Mental Health Toolkit | `/enneagram-corner/mental-health/enneagram-crisis-management-guide` |
| 798 | 7.7 | 17 (17/0) | 22 (22/0) | Why You Can't Stop Overthinking (Your Enneagram Type Explains It) | `/enneagram-corner/why-you-cant-stop-overthinking-enneagram` |
| 728 | 8.7 | 26 (25/1) | 24 (24/0) | How Each Enneagram Type Self-Sabotages Success (And How to Stop) | `/enneagram-corner/how-each-enneagram-type-self-sabotages-success` |
| 697 | 11.5 | 4 (4/0) | 18 (18/0) | Enneagram Mental Health Red Flags: Early Warning Signs for All 9 Types | `/enneagram-corner/enneagram-mental-health-flags` |
| 695 | 32.2 | 3 (3/0) | 3 (3/0) | Enneagram Team Dynamics: Which Pairs Click, Which Implode | `/enneagram-corner/enneagram-team-dynamics` |
| 559 | 16.1 | 10 (9/1) | 5 (5/0) | 9 Childhood Stereotypes Based on the Enneagram | `/enneagram-corner/enneagram-childhood-stereotypes` |
| 553 | 29.1 | 3 (3/0) | 5 (5/0) | Dating Dynamics by Enneagram Type: 9 Patterns That Sabotage Love (and… | `/how-to-guides/dating-dynamics-by-enneagram-type` |
| 531 | 29.2 | 9 (9/0) | 12 (12/0) | How Your Enneagram Type Shapes Your Therapy Experience | `/enneagram-corner/mental-health/enneagram-therapy-guide` |
| 503 | 9.9 | 12 (12/0) | 18 (18/0) | Enneagram Types on a First Date: What to Expect | `/enneagram-corner/enneagram-types-on-a-first-date` |
| 489 | 15.1 | 3 (3/0) | 10 (7/3) | The Psychology of Jeffrey Epstein: Understanding the Dark Helper (Par… | `/pop-culture/epstein-psychology-part-1` |
| 484 | 10.5 | 6 (6/0) | 31 (6/25) | Tech Leadership by Personality Type: How Each Enneagram Type Runs a C… | `/pop-culture/tech-titans-leadership-styles` |
| 479 | 40.3 | 11 (8/3) | 23 (23/0) | Enneagram Concepts: The Personality Box You're Living In | `/enneagram-corner/enneagram-concepts` |
| 456 | 19.2 | 130 (52/78) | 12 (12/0) | Enneagram Type 7: Enthusiast - The Possibility Engine | `/enneagram-corner/enneagram-type-7` |
| 394 | 43.0 | 5 (3/2) | 9 (8/1) | Enneagram Leadership: Why Your Approach Keeps Backfiring | `/enneagram-corner/enneagram-leadership` |
| 385 | 29.7 | 7 (7/0) | 15 (15/0) | Enneagram vs Myers-Briggs: Which Actually Explains You Better? | `/enneagram-corner/enneagram-vs-meyers-briggs` |
| 382 | 17.9 | 3 (3/0) | 4 (4/0) | The Blackpill Downward Spiral: How Pain Becomes Fate | `/pop-culture/incel-blackpill-radicalization-enneagram` |
| 372 | 16.2 | 107 (48/59) | 13 (13/0) | Enneagram Type 1: Perfectionist - The Inner Courtroom | `/enneagram-corner/enneagram-type-1` |
| 370 | 18.9 | 3 (3/0) | 10 (10/0) | How Each Enneagram Type Resists Therapy | `/enneagram-corner/mental-health/enneagram-therapy-resistance-guide` |
| 369 | 6.8 | 4 (4/0) | 33 (3/30) | What Enneagram Type Are Most Musicians? The Data Says Type 4 | `/pop-culture/what-enneagram-type-are-most-musicians` |
| 365 | 27.9 | 34 (34/0) | 10 (10/0) | Find Your Enneagram Type in 10 Minutes (4 Simple Steps) | `/enneagram-corner/beginners-guide-to-determining-your-enneagram-type` |
| 337 | 12.1 | 27 (27/0) | 21 (21/0) | The Party Test: What Your Social Style Reveals About Your Type | `/enneagram-corner/enneagram-types-at-party` |
| 316 | 9.6 | 3 (3/0) | 3 (3/0) | Enneagram Social Styles: The Hornevian Triads, Decoded | `/enneagram-corner/enneagram-social-styles` |
| 313 | 11.9 | 3 (3/0) | 11 (11/0) | Enneagram Dating Guide for Men: Blind Spots and Practical Moves | `/enneagram-corner/enneagram-dating-guide-for-men` |
| 302 | 12.4 | 3 (3/0) | 17 (17/0) | How All 9 Enneagram Types Flex (And What They Need) | `/enneagram-corner/how-each-enneagram-flexes` |
| 296 | 9.6 | 3 (3/0) | 3 (3/0) | Enneagram First Impression Cheat Sheet: All 9 Types | `/enneagram-corner/first-impression-cheat-sheet` |
| 282 | 10.9 | 11 (11/0) | 10 (10/0) | How Your Enneagram Type Shapes Your Relationship with Medication | `/enneagram-corner/mental-health/enneagram-medication-mental-health` |
| 240 | 9.1 | 5 (5/0) | 32 (8/24) | Tech Titans Through the Enneagram: A Series on the Personality Types … | `/pop-culture/tech-titans-enneagram-analysis` |
| 230 | 16.3 | 3 (3/0) | 5 (5/0) | How Each Enneagram Type Unwinds: Your Stress-Relief Formula | `/enneagram-corner/how-each-enneagram-type-unwinds` |
| 225 | 9.3 | 3 (3/0) | 8 (4/4) | John Coogan and Jordi Hays Built TBPN by Wanting Different Things | `/pop-culture/tbpn-john-coogan-jordi-hays-enneagram-dynamic` |
| 216 | 10.5 | 9 (9/0) | 9 (9/0) | Why You're Burning Out at Work (Your Enneagram Type Reveals It) | `/enneagram-corner/mental-health/enneagram-workplace-mental-health` |
| 207 | 16.2 | 53 (9/44) | 14 (14/0) | Enneagram Connecting Lines: Growth and Stress | `/enneagram-corner/enneagram-connecting-lines` |
| 160 | 16.6 | 9 (1/8) | 26 (9/17) | Why the Next Thing Won't Fix It (How Type 7s Actually Find What They'… | `/enneagram-corner/why-the-next-thing-wont-fix-it-type-7` |
| 154 | 6.1 | 7 (7/0) | 7 (7/0) | Dark Triad Celebrities and the Enneagram: What We Can Actually Say | `/pop-culture/dark-triad-meets-enneagram` |
| 144 | 9.2 | 3 (3/0) | 13 (12/1) | Cancel Culture by Enneagram Type: Who Cancels and Who Gets Cancelled | `/pop-culture/cancel-culture-enneagram-type` |
| 140 | 32.0 | 3 (3/0) | 3 (3/0) | 5 Conversations That Separate Thriving Couples From Everyone Else | `/how-to-guides/5-tough-conversations-you-need-to-have-with-your-partner` |
| 123 | 8.3 | 3 (3/0) | 12 (2/10) | Inside the Heartthrob Machine: What Fame Does to the Men Women Obsess… | `/pop-culture/hollywood-heartthrobs-enneagram-analysis` |
| 122 | 9.1 | 3 (3/0) | 3 (3/0) | How Epstein Trapped the Powerful and the Vulnerable (Part 2) | `/pop-culture/epstein-psychology-part-2` |
| 117 | 13.7 | 4 (4/0) | 17 (17/0) | Why You Keep Sabotaging New Relationships (Your Enneagram Knows) | `/enneagram-corner/how-to-navigate-early-relationship-stages` |
| 102 | 30.2 | 4 (4/0) | 37 (37/0) | Enneagram Books, Websites, Podcasts & Influencers | `/enneagram-corner/enneagram-books-websites-podcasts` |
| 100 | 20.4 | 14 (14/0) | 14 (14/0) | Enneagram Self-Development: What I Got Wrong as a Type 8 | `/enneagram-corner/enneagram-self-development` |
| 100 | 10.0 | 6 (6/0) | 7 (7/0) | Philosophy and Psychology Gave Birth to the Enneagram | `/enneagram-corner/philosophy-psychology-and-the-enneagram` |
| 87 | 8.3 | 3 (3/0) | 23 (14/9) | The Fallen Founders: What Holmes, Neumann, and Bankman-Fried Reveal A… | `/pop-culture/fallen-founders-enneagram-analysis` |
| 85 | 28.3 | 3 (2/1) | 3 (3/0) | Who Built the Enneagram? Mystics, Psychiatrists, Philosophers | `/enneagram-corner/enneagram-influences` |
| 75 | 5.9 | 4 (4/0) | 5 (5/0) | The Enneagram Changed My Life, But I Learned to Shut Up About It | `/community/why-im-selective-sharing-enneagram` |
| 63 | 8.9 | 3 (3/0) | 9 (4/5) | Alex Cooper vs Alix Earle: Why the Mentor-Protegee Pipeline Always Ex… | `/pop-culture/alex-cooper-alix-earle-beef-enneagram-analysis` |
| 60 | 8.9 | 5 (5/0) | 13 (5/8) | The Podcaster Personality Map: Why Hosts Return to the Same Topics | `/pop-culture/podcaster-personality-map` |
| 55 | 9.4 | 11 (10/1) | 14 (14/0) | Enneagram Harmonic Approaches: How Each Type Handles Conflict | `/enneagram-corner/enneagram-harmonic-approaches` |
| 53 | 8.5 | 3 (3/0) | 8 (8/0) | How to Throw a Party Everyone Actually Wants to Attend | `/enneagram-corner/enneagram-party-planner` |
| 51 | 8.8 | 4 (4/0) | 16 (7/9) | Comedy Kings: Why the Funniest Men Alive Are Wired Completely Differe… | `/pop-culture/comedy-kings-enneagram-analysis` |
| 42 | 11.7 | 3 (3/0) | 13 (13/0) | Neurodiversity vs. Personality: Stop Looking for Labels, Start Lookin… | `/enneagram-corner/neurodiversity-vs-personality` |
| 42 | 7.4 | 3 (3/0) | 10 (3/7) | The Disruptors: Why Type 8s Break Industries and Type 5s Decode Them | `/pop-culture/tech-titans-disruptors` |
| 38 | 7.9 | 4 (4/0) | 16 (6/10) | US Presidents by Enneagram Type: The Psychology of the Oval Office | `/pop-culture/us-presidents-enneagram-analysis` |
| 28 | 7.2 | 3 (3/0) | 5 (5/0) | Kant Said Reality Is Filtered. The Enneagram Shows the Other 8 Filter… | `/community/kantian-filters-and-nine-perspectives` |
| 25 | 11.9 | 4 (4/0) | 16 (16/0) | Enneagram First Impressions: What Each Type Is Scanning For | `/enneagram-corner/first-impression-enneagram-playbook` |
| 23 | 10.3 | 3 (3/0) | 4 (4/0) | Why You Don't Believe in Yourself (And How to Fix It in 30 Days) | `/how-to-guides/definitive-guide-to-self-efficacy` |
| 22 | 17.2 | 3 (3/0) | 11 (11/0) | How to Use the Enneagram for Self-Development (Past the Test) | `/how-to-guides/using-the-enneagram-for-self-development` |
| 12 | 8.9 | 3 (3/0) | 5 (2/3) | Musk vs Altman Trial: The Verdict, the Vibes, and the Personality Cla… | `/pop-culture/musk-vs-altman-trial-personality-dynamics` |
| 7 | 10.7 | 3 (3/0) | 6 (6/0) | 3 Societal Ticking Time Bombs Nobody Is Connecting | `/community/societal-ticking-time-bombs` |
| 5 | 9.2 | 4 (4/0) | 11 (4/7) | Podcast Bros: Inside the Movement That Replaced Mainstream Media | `/pop-culture/podcast-bros-enneagram-analysis` |
| 4 | 5.5 | 3 (3/0) | 7 (7/0) | You Didn't Find Yourself in the Enneagram. You Found a Map. | `/community/personality-frameworks-map-not-territory` |
| 3 | 4.0 | 4 (4/0) | 14 (5/9) | Founders vs Stewards: The Personality Types That Replace Tech Visiona… | `/pop-culture/tech-titans-founders-vs-stewards` |
| 1 | 6.0 | 5 (5/0) | 10 (10/0) | Introducing 9takes: Answer First, Then Compare Perspectives | `/community/introducing-9takes` |
| 1 | 9.0 | 4 (4/0) | 11 (4/7) | The Anatomy of Public Shame: What We're Actually Doing When We "Cance… | `/pop-culture/psychology-of-public-shame` |
| 1 | 15.0 | 3 (3/0) | 11 (11/0) | The Crash Course on Emotions We All Missed in Kindergarten | `/how-to-guides/the-crash-course-on-emotions-that-we-missed-in-kindergarten` |
| — | — | 21 (21/0) | 22 (22/0) | Red Flags You Are Dating Each Enneagram Type (And What to Do) | `/enneagram-corner/red-flags-dating-each-enneagram-type` |
| — | — | 17 (14/3) | 9 (9/0) | How Each Enneagram Type Survives Trauma | `/enneagram-corner/mental-health/enneagram-trauma-response-guide` |
| — | — | 12 (11/1) | 21 (21/0) | Shadow Work by Enneagram Type: Your Dark Side Has a Pattern | `/enneagram-corner/shadow-work-by-enneagram-type` |
| — | — | 8 (8/0) | 7 (7/0) | How Minds Actually Change | `/community/how-minds-change-on-9takes` |
| — | — | 8 (8/0) | 6 (6/0) | Parasocial Relationships Through the Enneagram | `/pop-culture/parasocial-relationships-enneagram-type` |
| — | — | 7 (6/1) | 5 (5/0) | The Intellectual Fortress That Becomes a Prison | `/community/fear-triad-intellectual-fortress-or-prison` |
| — | — | 7 (7/0) | 5 (5/0) | Why Therapy Doesn't Work the Same for Every Personality Type | `/enneagram-corner/why-therapy-doesnt-work-the-same-for-every-type` |
| — | — | 6 (6/0) | 8 (7/1) | Be Gentle When You're Right | `/community/be-gentle-when-youre-right` |
| — | — | 6 (6/0) | 9 (9/0) | The Consensus on Human Nature | `/community/consensus-on-human-nature` |
| — | — | 6 (6/0) | 12 (12/0) | Why MBTI Failed and What to Use Instead | `/community/mbti-vs-enneagram` |
| — | — | 6 (6/0) | 5 (5/0) | The Enneagram Under Fire: Common Criticisms Addressed | `/enneagram-corner/enneagram-criticisms` |
| — | — | 6 (6/0) | 11 (11/0) | When 'I'm Fine' Isn't: Reading Your Child's Mental Health by Type | `/enneagram-corner/mental-health/enneagram-parenting-mental-health` |
| — | — | 5 (5/0) | 5 (5/0) | Memetic Comments: Why Your Online Opinions Aren't Really Yours | `/community/memetic-comments` |
| — | — | 5 (2/3) | 22 (7/15) | How Type 8 Challengers Actually Succeed (It's Not What You Think) | `/enneagram-corner/how-type-8-challengers-actually-succeed` |
| — | — | 4 (4/0) | 7 (7/0) | Where to Find an Enneagram Community That Doesn't Just Type You | `/community/enneagram-community` |
| — | — | 4 (4/0) | 6 (6/0) | What Was The Inspiration For 9takes? | `/community/inspiration-for-9takes` |
| — | — | 4 (4/0) | 5 (5/0) | What Winning Online Arguments Looks Like | `/community/what-winning-online-arguments-looks-like` |
| — | — | 4 (4/0) | 5 (5/0) | The 90-Day Personality Maxing Blueprint | `/enneagram-corner/90-day-personality-maxing-blueprint` |
| — | — | 4 (4/0) | 17 (17/0) | Is the Enneagram Real? 27 Questions Everyone Asks (Finally Answered) | `/enneagram-corner/enneagram-faqs` |
| — | — | 4 (4/0) | 12 (12/0) | Which Enneagram Type Is Most Likely to Be a Narcissist? (Every Type H… | `/enneagram-corner/which-enneagram-type-is-most-likely-to-be-a-narcissist` |
| — | — | 4 (4/0) | 5 (5/0) | The Definitive Guide to Relationship Conflict [Part 1] | `/how-to-guides/definitive-guide-to-relationship-conflict-part-1` |
| — | — | 3 (3/0) | 3 (3/0) | The Bible Doesn't Start With Answers. It Starts With a Question. | `/community/questions-are-the-engine-of-moral-awakening` |
| — | — | 3 (3/0) | 6 (6/0) | 5 Reasons Reddit Can't Help You Find Deep Connections | `/community/reddit-deep-connections-limitations` |
| — | — | 3 (3/0) | 6 (5/1) | The Hardware and Software of the Mind | `/community/software-and-hardware-of-the-mind` |
| — | — | 3 (3/0) | 4 (4/0) | Why the Greek vibe? | `/community/why-the-greek-vibe` |
| — | — | 3 (3/0) | 11 (11/0) | Why Your Enneagram Clients Aren't Changing (And the Homework That Act… | `/enneagram-corner/enneagram-coach-toolkit` |
| — | — | 3 (3/0) | 9 (9/0) | Enneagram Dating Guide for Women: Decode Your Perfect Match Formula | `/enneagram-corner/enneagram-dating-guide-for-women` |
| — | — | 3 (3/0) | 13 (13/0) | Attachment, Frustration, Rejection: Object Relations by Type | `/enneagram-corner/enneagram-object-relations` |
| — | — | 3 (3/0) | 6 (6/0) | Online Dating, Decoded: A Guide for Real Connection | `/enneagram-corner/enneagram-online-dating-guide` |
| — | — | 3 (3/0) | 5 (5/0) | The Voice in Your Head: Self-Talk by Enneagram Type | `/enneagram-corner/enneagram-positive-self-talk` |
| — | — | 3 (3/0) | 7 (7/0) | Why Your Team Keeps Having the Same Ideas (Enneagram Fix) | `/enneagram-corner/enneagram-team-diversity` |
| — | — | 3 (3/0) | 16 (16/0) | Enneagram at Work: What Each Type Needs, Fears, Brings | `/enneagram-corner/enneagram-workplace-team-building` |
| — | — | 3 (3/0) | 8 (8/0) | How Common Is Each Enneagram Type? (Rarest to Most Common, and Why th… | `/enneagram-corner/how-common-is-each-enneagram-type` |
| — | — | 3 (2/1) | 16 (16/0) | Why People Overshare: Shame, Boundaries, and Safe Spaces | `/enneagram-corner/oversharing-psychology-shame-boundaries` |
| — | — | 3 (3/0) | 3 (3/0) | Personality Maxing: Looksmaxxing for What People Experience | `/enneagram-corner/personality-maxing` |
| — | — | 3 (3/0) | 3 (2/1) | The Stress Paradox: Why Emotional Patterns Outlast Situations | `/enneagram-corner/situations-change-emotions-dont` |
| — | — | 3 (3/0) | 7 (7/0) | What Is a Love Language in a Relationship? (And Why Two People With t… | `/enneagram-corner/what-is-a-love-language` |
| — | — | 3 (3/0) | 6 (6/0) | Why Your Arguments Keep Repeating (And the Exercises That Actually Fi… | `/how-to-guides/definitive-guide-to-relationship-conflict-part-2` |
| — | — | 3 (3/0) | 3 (3/0) | The Pattern-Breaking Guide to Fighting Depression | `/how-to-guides/guide-to-fighting-depression` |
| — | — | 3 (3/0) | 5 (5/0) | How to Read People: The 4-Step Guide to Understanding Anyone | `/how-to-guides/how-to-psychoanalyze-people` |
| — | — | 3 (3/0) | 20 (20/0) | Productivity Systems by Enneagram Type | `/how-to-guides/productivity-systems-by-enneagram-type` |
| — | — | 3 (3/0) | 6 (6/0) | Active Listening Guide: Why Your Personality Type Sabotages It | `/how-to-guides/ultimate-guide-to-active-listening` |
| — | — | 3 (3/0) | 9 (6/3) | Breaking Points: How a Type 1 and a Type 7 Built Media's Most Unlikel… | `/pop-culture/breaking-points-enneagram-analysis` |
| — | — | 3 (3/0) | 5 (5/0) | Influencer Enneagram Types: Nine Creator Pressure Patterns | `/pop-culture/influencer-enneagram-types-instagram` |
| — | — | 3 (3/0) | 7 (7/0) | Masculinity, Strength, and Emotional Maturity | `/pop-culture/masculinity-strength-and-the-enneagram` |
| — | — | 3 (3/0) | 3 (3/0) | Reddit Moderators and Enneagram: What Actually Motivates Mods | `/pop-culture/reddit-moderators-type-1-internet` |
| — | — | 3 (3/0) | 13 (3/10) | The Platform Emperors: How Personality Types Shape the Products Billi… | `/pop-culture/tech-titans-platform-emperors` |
| — | — | 3 (3/0) | 14 (5/9) | Trump's Type 3 vs Biden's Type 2: Why They Could Never Understand Eac… | `/pop-culture/trump-type-3-vs-biden-type-2` |
| — | — | 3 (3/0) | 14 (14/0) | Why Is Twitter/X So Toxic? 6 Reasons Conflict Spreads | `/pop-culture/twitter-x-personality-types-toxic` |
