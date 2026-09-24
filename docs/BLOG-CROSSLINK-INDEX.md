# Blog Cross-Link Index

_Generated: 2026-09-23 by `pnpm gen:crosslinks` (scripts/generate-crosslink-report.js)_
_Search data: GSC 2026-06-24 → 2026-09-22 (pulled 2026-09-24)_

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
| Live blog posts | 143 (+ 9 type pages) |
| Published people pages | 450 |
| Completely isolated (0 in, 0 out) | 0 |
| 0 incoming | 0 |
| 0 outgoing | 0 |
| Below gate (<3 in or <3 out) | 8 (0 not grandfathered) |
| Broken internal links (live post → non-live page) | 0 |
| Links that go through a 301 | 0 |
| Broken/redirected links on people pages (draft mirror) | 0 |
| Body links: blog → blog / blog → people | 1,514 / 278 |

---

## Section flow

Where body links go. Rows = linking section, columns = linked section.

| From \ To | enneagram-corner | community | how-to-guides | pop-culture | people | Stays in section | Posts | Median in |
|---|---|---|---|---|---|---|---|---|
| enneagram-corner | 1,122 | 19 | 13 | 14 | 66 | 91% | 93 | 8 |
| community | 53 | 33 | 1 | 6 | 1 | 35% | 16 | 3 |
| how-to-guides | 56 | 3 | 20 | 0 | 0 | 25% | 11 | 3 |
| pop-culture | 82 | 3 | 0 | 89 | 211 | 23% | 32 | 3 |

---

## Under-linked pages with search demand

Live posts at Google position 4–30 with 1,000+ impressions, sorted by how few links they get
relative to demand. These are where an internal link is most likely to move a ranking.

| Page | Impressions | Clicks | Position | In | Out |
|---|---|---|---|---|---|
| `/enneagram-corner/astrology-and-the-enneagram` | 10,901 | 147 | 8.4 | 8 | 15 |
| `/pop-culture/kardashian-family-enneagram-analysis` | 3,186 | 41 | 8.2 | 2 | 17 |
| `/enneagram-corner/enneagram-and-mental-illness` | 12,607 | 319 | 9.7 | 24 | 19 |
| `/enneagram-corner/toxic-traits-relationships-warning-signs` | 1,887 | 39 | 10.3 | 3 | 17 |
| `/enneagram-corner/enneagram-and-adhd-which-types-struggle-most` | 4,235 | 251 | 5.2 | 9 | 22 |
| `/enneagram-corner/enneagram-compatibility-matrix` | 8,470 | 89 | 13.4 | 19 | 7 |
| `/enneagram-corner/mental-health/enneagram-neurodivergence-guide` | 4,688 | 93 | 7.2 | 11 | 5 |
| `/pop-culture/ghislaine-maxwell-psychology` | 1,131 | 10 | 8.0 | 2 | 6 |
| `/enneagram-corner/enneagram-and-religion` | 1,448 | 9 | 27.8 | 3 | 3 |
| `/enneagram-corner/toxic-traits-of-each-enneagram-type` | 5,398 | 73 | 10.6 | 16 | 19 |
| `/enneagram-corner/mental-health/enneagram-science-mental-health` | 4,929 | 5 | 9.6 | 15 | 6 |
| `/enneagram-corner/enneagram-vs-personality-frameworks-comparison` | 3,598 | 3 | 8.5 | 11 | 6 |
| `/enneagram-corner/enneagram-test-comparison-2026` | 1,882 | 14 | 9.9 | 6 | 4 |
| `/enneagram-corner/attachment-styles-and-enneagram-types` | 5,178 | 41 | 9.1 | 20 | 10 |
| `/enneagram-corner/depression-patterns-by-enneagram-type` | 5,390 | 128 | 7.8 | 22 | 4 |
| `/enneagram-corner/enneagram-types-and-career-choices` | 2,020 | 15 | 14.9 | 8 | 12 |
| `/enneagram-corner/love-languages-and-enneagram-types` | 2,431 | 7 | 9.0 | 11 | 15 |
| `/enneagram-corner/how-each-enneagram-type-manipulates` | 3,654 | 34 | 7.3 | 20 | 20 |
| `/pop-culture/tech-titans-ai-wars` | 1,164 | 6 | 9.6 | 7 | 14 |
| `/enneagram-corner/how-to-apologize-like-a-pro` | 1,131 | 23 | 7.9 | 7 | 5 |
| `/enneagram-corner/mental-health/enneagram-addiction-recovery-guide` | 1,762 | 45 | 8.8 | 12 | 13 |
| `/enneagram-corner/enneagram-strengths-and-weaknesses` | 1,437 | 25 | 9.2 | 24 | 15 |
| `/enneagram-corner/mental-health/enneagram-anxiety-complete-guide` | 1,586 | 9 | 12.4 | 30 | 9 |
| `/enneagram-corner/enneagram-instinctual-subtypes` | 7,263 | 29 | 14.4 | 156 | 16 |
| `/enneagram-corner/enneagram-wings-complete-guide` | 6,953 | 40 | 9.2 | 191 | 39 |

## Dead ends with traffic

Live posts with 3 or fewer outgoing links, sorted by impressions. Readers land here and have nowhere to go.

| Page | Impressions | Clicks | Out | In |
|---|---|---|---|---|
| `/enneagram-corner/enneagram-and-religion` | 1,448 | 9 | 3 | 3 |
| `/enneagram-corner/enneagram-team-dynamics` | 751 | 1 | 3 | 4 |
| `/enneagram-corner/first-impression-cheat-sheet` | 301 | 8 | 3 | 3 |
| `/how-to-guides/5-tough-conversations-you-need-to-have-with-your-partner` | 145 | 1 | 3 | 3 |
| `/pop-culture/epstein-psychology-part-2` | 131 | 0 | 3 | 3 |
| `/enneagram-corner/enneagram-influences` | 79 | 0 | 3 | 3 |
| `/enneagram-corner/enneagram-social-styles` | 49 | 0 | 3 | 3 |
| `/community/questions-are-the-engine-of-moral-awakening` | — | — | 3 | 3 |
| `/enneagram-corner/personality-maxing` | — | — | 3 | 3 |
| `/enneagram-corner/situations-change-emotions-dont` | — | — | 3 | 3 |
| `/how-to-guides/guide-to-fighting-depression` | — | — | 3 | 3 |
| `/pop-culture/reddit-moderators-type-1-internet` | — | — | 3 | 2 |

## People bridge

People pages by search impressions and how many **blog posts** link to them in prose
(the FamousTypes block on type pages links every person, but that is not a contextual link).
163 of 450 people pages have at least one blog link.

| Person | Impressions | Clicks | Position | Blog links in | People links in |
|---|---|---|---|---|---|
| [Sky Bri](/personality-analysis/sky-bri) | 16,351 | 122 | 9.4 | 0 | 2 |
| [IShowSpeed](/personality-analysis/ishowspeed) | 15,229 | 34 | 7.4 | 0 | 3 |
| [Jordi Hays](/personality-analysis/jordi-hays) | 10,830 | 216 | 6.5 | 2 | 1 |
| [Zendaya](/personality-analysis/zendaya) | 6,631 | 34 | 9.2 | 1 | 9 |
| [Shawn Ryan](/personality-analysis/shawn-ryan) | 5,641 | 52 | 8.8 | 2 | 1 |
| [Sabrina Carpenter](/personality-analysis/sabrina-carpenter) | 5,262 | 19 | 6.8 | 0 | 2 |
| [Lionel Messi](/personality-analysis/lionel-messi) | 5,144 | 29 | 8.9 | 0 | 3 |
| [Ashby](/personality-analysis/ashby) | 3,788 | 22 | 9.5 | 1 | 0 |
| [Ariana Grande](/personality-analysis/ariana-grande) | 3,749 | 19 | 9.7 | 0 | 6 |
| [Jack Black](/personality-analysis/jack-black) | 3,606 | 31 | 7.8 | 1 | 3 |
| [Kai Cenat](/personality-analysis/kai-cenat) | 3,480 | 7 | 8.1 | 1 | 10 |
| [Dario Amodei](/personality-analysis/dario-amodei) | 3,433 | 36 | 8.7 | 3 | 2 |
| [Ryan Gosling](/personality-analysis/ryan-gosling) | 3,356 | 31 | 8.0 | 1 | 3 |
| [Emma Watson](/personality-analysis/emma-watson) | 3,284 | 12 | 8.7 | 0 | 3 |
| [Meghan Markle](/personality-analysis/meghan-markle) | 3,205 | 38 | 7.3 | 0 | 4 |
| [Asmongold](/personality-analysis/asmongold) | 3,166 | 18 | 9.0 | 0 | 1 |
| [Kara Swisher](/personality-analysis/kara-swisher) | 3,145 | 32 | 8.2 | 0 | 2 |
| [Hasan Piker](/personality-analysis/hasan-piker) | 3,120 | 17 | 9.2 | 0 | 2 |
| [Selena Gomez](/personality-analysis/selena-gomez) | 3,091 | 19 | 7.7 | 1 | 4 |
| [Sydney Sweeney](/personality-analysis/sydney-sweeney) | 3,044 | 10 | 7.5 | 0 | 1 |
| [Cillian Murphy](/personality-analysis/cillian-murphy) | 2,938 | 17 | 10.5 | 0 | 2 |
| [Tom Holland](/personality-analysis/tom-holland) | 2,840 | 13 | 9.3 | 2 | 4 |
| [Oliver Tree](/personality-analysis/oliver-tree) | 2,716 | 12 | 7.4 | 0 | 0 |
| [John Coogan](/personality-analysis/john-coogan) | 2,629 | 23 | 7.0 | 2 | 1 |
| [David Friedberg](/personality-analysis/david-friedberg) | 2,574 | 20 | 13.6 | 1 | 3 |

---

## Hubs

| In | Out | Impressions | Page |
|---|---|---|---|
| 204 | 14 | 1,399 | `/enneagram-corner/enneagram-types-in-stress` |
| 191 | 39 | 6,953 | `/enneagram-corner/enneagram-wings-complete-guide` |
| 156 | 16 | 7,263 | `/enneagram-corner/enneagram-instinctual-subtypes` |
| 140 | 14 | 3,917 | `/enneagram-corner/enneagram-type-3` |
| 128 | 14 | 1,283 | `/enneagram-corner/enneagram-type-6` |
| 128 | 13 | 504 | `/enneagram-corner/enneagram-type-7` |
| 127 | 15 | 2,166 | `/enneagram-corner/enneagram-type-4` |
| 122 | 14 | 1,629 | `/enneagram-corner/enneagram-type-5` |
| 120 | 15 | 1,207 | `/enneagram-corner/enneagram-type-8` |
| 118 | 17 | 2,563 | `/enneagram-corner/enneagram-type-9` |
| 104 | 14 | 395 | `/enneagram-corner/enneagram-type-1` |
| 100 | 16 | 857 | `/enneagram-corner/enneagram-type-2` |
| 64 | 23 | 2,133 | `/enneagram-corner/relationship-communication-guide` |
| 53 | 15 | 235 | `/enneagram-corner/enneagram-connecting-lines` |
| 32 | 15 | 4,695 | `/enneagram-corner/enneagram-types-in-relationships` |

---

## Not live (excluded from every number above)

| Status | Files | Meaning |
|---|---|---|
| draft | 23 | Routable, `published` is false |
| redirected | 7 | Unpublished and the route 301s the slug to a newer post |
| no-frontmatter | 2 | Routable folder but no frontmatter (notes); 404s |
| excluded | 49 | Social variants and notes the route globs skip (`.instagram/.twitter/.reddit/.review`, `-twitter`) |
| not-routable | 10 | Folders no route serves (templates, research notes) |

### Drafts

Unpublished posts in routable folders. Word count ≥2,500 with links already in place usually means close to done.

| Words | Date | Links out | Title | File |
|---|---|---|---|---|
| 4,745 | 2026-06-30 | 7 | Why World Leaders Can't Read Each Other: The Psychology of Global Pow… | `pop-culture/world-leaders-enneagram-personality-dynamics.md` |
| 4,492 | 2026-03-04 | 8 | Depp vs Heard: Why a Type 4 and a Type 3 Were Built to Destroy Each O… | `pop-culture/depp-vs-heard-enneagram-analysis.md` |
| 4,401 | 2026-05-07 | 11 | Succession Enneagram: Why Logan Roy Bred Four Different Personality D… | `pop-culture/succession-roy-siblings-enneagram-types.md` |
| 4,083 | 2026-05-19 | 5 | Alex and Leila Hormozi: What a Marriage Between Two Type 3s Actually … | `pop-culture/hormozi-marriage-two-type-3s-enneagram.md` |
| 3,675 | 2026-06-12 | 16 | How to Stand Up for Yourself: Why Your Personality Type Makes It Worse | `guides/how-to-stand-up-for-yourself.md` |
| 3,674 | 2026-05-07 | 13 | The Office Enneagram Types: Why Dunder Mifflin Was a Personality Disa… | `pop-culture/the-office-enneagram-types.md` |
| 3,537 | 2026-05-19 | 7 | My First Million's Real Engine: What Happens When a Type 7 and a Type… | `pop-culture/my-first-million-shaan-sam-enneagram-dynamic.md` |
| 3,122 | 2026-04-30 | 2 | You Can't Inherit a Personality: The Succession Trap That Topples Fou… | `pop-culture/succession-personality-trap.md` |
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
| 12,607 | 9.7 | 24 (21/3) | 19 (19/0) | The Enneagram and Mental Illness: Understand Each Type's Predispositi… | `/enneagram-corner/enneagram-and-mental-illness` |
| 10,901 | 8.4 | 8 (8/0) | 15 (15/0) | What Enneagram Type Is Your Zodiac Sign? The Complete Correlation Cha… | `/enneagram-corner/astrology-and-the-enneagram` |
| 8,470 | 13.4 | 19 (19/0) | 7 (7/0) | The Complete Enneagram Compatibility Matrix: All 81 Type Combinations… | `/enneagram-corner/enneagram-compatibility-matrix` |
| 7,263 | 14.4 | 156 (15/141) | 16 (16/0) | Why You Don't Fully Match Your Enneagram Type (It's Your Subtype) | `/enneagram-corner/enneagram-instinctual-subtypes` |
| 6,953 | 9.2 | 191 (14/177) | 39 (7/32) | Why You Don't Match Your Enneagram Description (It's Your Wing) | `/enneagram-corner/enneagram-wings-complete-guide` |
| 5,398 | 10.6 | 16 (16/0) | 19 (19/0) | 9 Toxic Personality Traits: The Dark Side of Each Type | `/enneagram-corner/toxic-traits-of-each-enneagram-type` |
| 5,390 | 7.8 | 22 (10/12) | 4 (4/0) | Depression Patterns by Enneagram Type | `/enneagram-corner/depression-patterns-by-enneagram-type` |
| 5,178 | 9.1 | 20 (12/8) | 10 (10/0) | Attachment Styles and Enneagram Types: A Map | `/enneagram-corner/attachment-styles-and-enneagram-types` |
| 4,929 | 9.6 | 15 (15/0) | 6 (6/0) | Is the Enneagram Scientifically Valid? What Research Says | `/enneagram-corner/mental-health/enneagram-science-mental-health` |
| 4,695 | 37.2 | 32 (25/7) | 15 (15/0) | Enneagram Types in Relationships: How Each Type Loves, Fights, and Re… | `/enneagram-corner/enneagram-types-in-relationships` |
| 4,688 | 7.2 | 11 (11/0) | 5 (5/0) | Enneagram and Neurodivergence: ADHD, Autism, and Motivation | `/enneagram-corner/mental-health/enneagram-neurodivergence-guide` |
| 4,235 | 5.2 | 9 (7/2) | 22 (22/0) | Enneagram and ADHD: Which Types Struggle Most (And Why) | `/enneagram-corner/enneagram-and-adhd-which-types-struggle-most` |
| 3,917 | 26.9 | 140 (50/90) | 14 (14/0) | Enneagram Type 3: Achiever - Success Becomes Identity | `/enneagram-corner/enneagram-type-3` |
| 3,654 | 7.3 | 20 (20/0) | 20 (20/0) | How Each Enneagram Type Manipulates (And How to Spot It) | `/enneagram-corner/how-each-enneagram-type-manipulates` |
| 3,598 | 8.5 | 11 (11/0) | 6 (6/0) | The Enneagram's Place in Personality Science: An Honest Audit | `/enneagram-corner/enneagram-vs-personality-frameworks-comparison` |
| 3,186 | 8.2 | 2 (2/0) | 17 (9/8) | The Kardashian Family Enneagram: How Each Type Built a Billion Dollar… | `/pop-culture/kardashian-family-enneagram-analysis` |
| 2,563 | 37.0 | 118 (51/67) | 17 (17/0) | Enneagram Type 9: Peacemaker - Finding Your Voice | `/enneagram-corner/enneagram-type-9` |
| 2,431 | 9.0 | 11 (11/0) | 15 (15/0) | Love Languages & Enneagram Types: The 45-Combination Compatibility Gu… | `/enneagram-corner/love-languages-and-enneagram-types` |
| 2,166 | 39.9 | 127 (48/79) | 15 (15/0) | Enneagram Type 4: Individualist - The Missing Piece | `/enneagram-corner/enneagram-type-4` |
| 2,133 | 40.9 | 64 (52/12) | 23 (23/0) | Relationship Communication Guide: The Enneagram Key | `/enneagram-corner/relationship-communication-guide` |
| 2,020 | 14.9 | 8 (7/1) | 12 (12/0) | Why You Hate Your Job (It's Not the Boss, It's Your Enneagram Type) | `/enneagram-corner/enneagram-types-and-career-choices` |
| 1,887 | 10.3 | 3 (3/0) | 17 (17/0) | Red Flags You're Dating a Toxic Version of Each Enneagram Type | `/enneagram-corner/toxic-traits-relationships-warning-signs` |
| 1,882 | 9.9 | 6 (6/0) | 4 (4/0) | Best Free Enneagram Tests (2026): An Honest Comparison | `/enneagram-corner/enneagram-test-comparison-2026` |
| 1,762 | 8.8 | 12 (7/5) | 13 (13/0) | Enneagram and Addiction: Why Each Type Self-Medicates Differently | `/enneagram-corner/mental-health/enneagram-addiction-recovery-guide` |
| 1,629 | 14.7 | 122 (52/70) | 14 (14/0) | Enneagram Type 5: Observer - Inside the Fortress Mind | `/enneagram-corner/enneagram-type-5` |
| 1,599 | 45.0 | 23 (23/0) | 40 (40/0) | What's My Enneagram Type? (The 5-Minute Answer You Actually Need) | `/enneagram-corner/enneagram-tldr` |
| 1,586 | 12.4 | 30 (15/15) | 9 (9/0) | Why Type 6 Isn't the Only Anxious Type (Every Type's Hidden Anxiety P… | `/enneagram-corner/mental-health/enneagram-anxiety-complete-guide` |
| 1,572 | 53.9 | 3 (3/0) | 17 (17/0) | The 9 Coworker Types: Each Enneagram as Boss, Peer, Report | `/enneagram-corner/enneagram-types-working-in-teams` |
| 1,448 | 27.8 | 3 (3/0) | 3 (3/0) | Is the Enneagram Religious? (The Truth About Its Spiritual Origins) | `/enneagram-corner/enneagram-and-religion` |
| 1,437 | 9.2 | 24 (22/2) | 15 (15/0) | Your Type's Fatal Flaw (And Secret Superpower) Based on Enneagram | `/enneagram-corner/enneagram-strengths-and-weaknesses` |
| 1,399 | 25.1 | 204 (68/136) | 14 (14/0) | Enneagram Types in Stress: Trigger → Fear → Defense → Backfire | `/enneagram-corner/enneagram-types-in-stress` |
| 1,283 | 57.1 | 128 (51/77) | 14 (14/0) | Enneagram Type 6: Loyalist - Search for Solid Ground | `/enneagram-corner/enneagram-type-6` |
| 1,207 | 11.1 | 120 (48/72) | 15 (15/0) | Enneagram Type 8: Challenger - Behind the Armor | `/enneagram-corner/enneagram-type-8` |
| 1,164 | 9.6 | 7 (7/0) | 14 (7/7) | The AI Wars: Why Personality Types Determine Who Gets to Build God | `/pop-culture/tech-titans-ai-wars` |
| 1,131 | 7.9 | 7 (7/0) | 5 (5/0) | How to Apologize by Enneagram Type: The Nine Scripts Each Type Skips | `/enneagram-corner/how-to-apologize-like-a-pro` |
| 1,131 | 8.0 | 2 (2/0) | 6 (5/1) | Ghislaine Maxwell: The Hostage Princess Who Became the Enabler-in-Chi… | `/pop-culture/ghislaine-maxwell-psychology` |
| 997 | 24.0 | 18 (16/2) | 14 (14/0) | Enneagram for Personal Growth: The Advice That Fixed You Can Break Th… | `/enneagram-corner/enneagram-personal-growth` |
| 992 | 7.5 | 27 (27/0) | 17 (17/0) | Why They Ghosted You (Based on Their Enneagram Type) | `/enneagram-corner/enneagram-types-being-ghosted` |
| 924 | 7.2 | 4 (4/0) | 15 (15/0) | How to Compliment Each Enneagram Type (Words That Actually Land) | `/enneagram-corner/biggest-compliments-to-give-each-enneagram-type` |
| 883 | 11.5 | 7 (7/0) | 5 (5/0) | Why Dating Apps Are Harder for Certain Personality Types | `/enneagram-corner/why-dating-apps-are-harder-for-certain-personality-types` |
| 857 | 41.2 | 100 (52/48) | 16 (16/0) | Enneagram Type 2: Helper - The One-Way Mirror | `/enneagram-corner/enneagram-type-2` |
| 856 | 27.6 | 3 (2/1) | 17 (17/0) | Enneagram Parenting Styles: Why You Parent the Way You Do | `/enneagram-corner/enneagram-parenting-styles` |
| 854 | 34.8 | 21 (15/6) | 17 (17/0) | Your Dark Side Has a Number (And It's About to Ruin Your Day) | `/enneagram-corner/enneagram-stress-number` |
| 813 | 9.0 | 9 (9/0) | 7 (7/0) | Crisis Management by Enneagram Type: A Mental Health Toolkit | `/enneagram-corner/mental-health/enneagram-crisis-management-guide` |
| 792 | 7.9 | 17 (17/0) | 22 (22/0) | Why You Can't Stop Overthinking (Your Enneagram Type Explains It) | `/enneagram-corner/why-you-cant-stop-overthinking-enneagram` |
| 751 | 31.4 | 4 (4/0) | 3 (3/0) | Enneagram Team Dynamics: Which Pairs Click, Which Implode | `/enneagram-corner/enneagram-team-dynamics` |
| 741 | 11.9 | 3 (3/0) | 15 (7/8) | Google's Three Personality Eras: Why the Founders Had to Come Back | `/pop-culture/google-leadership-evolution` |
| 710 | 8.7 | 26 (25/1) | 24 (24/0) | How Each Enneagram Type Self-Sabotages Success (And How to Stop) | `/enneagram-corner/how-each-enneagram-type-self-sabotages-success` |
| 708 | 11.6 | 4 (4/0) | 18 (18/0) | Enneagram Mental Health Red Flags: Early Warning Signs for All 9 Types | `/enneagram-corner/enneagram-mental-health-flags` |
| 678 | 30.0 | 3 (3/0) | 5 (5/0) | Dating Dynamics by Enneagram Type: 9 Patterns That Sabotage Love (and… | `/how-to-guides/dating-dynamics-by-enneagram-type` |
| 577 | 14.8 | 3 (3/0) | 10 (7/3) | The Psychology of Jeffrey Epstein: Understanding the Dark Helper (Par… | `/pop-culture/epstein-psychology-part-1` |
| 570 | 17.7 | 3 (3/0) | 4 (4/0) | The Blackpill Downward Spiral: How Pain Becomes Fate | `/pop-culture/incel-blackpill-radicalization-enneagram` |
| 544 | 10.0 | 13 (13/0) | 18 (18/0) | Enneagram Types on a First Date: What to Expect | `/enneagram-corner/enneagram-types-on-a-first-date` |
| 542 | 29.8 | 8 (8/0) | 12 (12/0) | How Your Enneagram Type Shapes Your Therapy Experience | `/enneagram-corner/mental-health/enneagram-therapy-guide` |
| 504 | 18.7 | 128 (51/77) | 13 (13/0) | Enneagram Type 7: Enthusiast - The Possibility Engine | `/enneagram-corner/enneagram-type-7` |
| 499 | 17.1 | 10 (9/1) | 5 (5/0) | 9 Childhood Stereotypes Based on the Enneagram | `/enneagram-corner/enneagram-childhood-stereotypes` |
| 424 | 11.1 | 6 (6/0) | 30 (5/25) | Tech Leadership by Personality Type: How Each Enneagram Type Runs a C… | `/pop-culture/tech-titans-leadership-styles` |
| 423 | 45.3 | 11 (8/3) | 23 (23/0) | Enneagram Concepts: The Personality Box You're Living In | `/enneagram-corner/enneagram-concepts` |
| 409 | 30.8 | 7 (7/0) | 15 (15/0) | Enneagram vs Myers-Briggs: Which Actually Explains You Better? | `/enneagram-corner/enneagram-vs-meyers-briggs` |
| 395 | 16.3 | 104 (46/58) | 14 (14/0) | Enneagram Type 1: Perfectionist - The Inner Courtroom | `/enneagram-corner/enneagram-type-1` |
| 390 | 46.4 | 5 (3/2) | 9 (8/1) | Enneagram Leadership: Why Your Approach Keeps Backfiring | `/enneagram-corner/enneagram-leadership` |
| 379 | 30.1 | 31 (31/0) | 10 (10/0) | Find Your Enneagram Type in 10 Minutes (4 Simple Steps) | `/enneagram-corner/beginners-guide-to-determining-your-enneagram-type` |
| 370 | 20.4 | 3 (3/0) | 10 (10/0) | How Each Enneagram Type Resists Therapy | `/enneagram-corner/mental-health/enneagram-therapy-resistance-guide` |
| 341 | 11.8 | 28 (28/0) | 21 (21/0) | The Party Test: What Your Social Style Reveals About Your Type | `/enneagram-corner/enneagram-types-at-party` |
| 330 | 6.9 | 3 (3/0) | 33 (3/30) | What Enneagram Type Are Most Musicians? The Data Says Type 4 | `/pop-culture/what-enneagram-type-are-most-musicians` |
| 322 | 12.0 | 3 (3/0) | 11 (11/0) | Enneagram Dating Guide for Men: Blind Spots and Practical Moves | `/enneagram-corner/enneagram-dating-guide-for-men` |
| 301 | 9.4 | 3 (3/0) | 3 (3/0) | Enneagram First Impression Cheat Sheet: All 9 Types | `/enneagram-corner/first-impression-cheat-sheet` |
| 286 | 11.4 | 11 (11/0) | 10 (10/0) | How Your Enneagram Type Shapes Your Relationship with Medication | `/enneagram-corner/mental-health/enneagram-medication-mental-health` |
| 273 | 13.5 | 3 (3/0) | 17 (17/0) | How All 9 Enneagram Types Flex (And What They Need) | `/enneagram-corner/how-each-enneagram-flexes` |
| 251 | 9.1 | 5 (5/0) | 32 (8/24) | Tech Titans Through the Enneagram: A Series on the Personality Types … | `/pop-culture/tech-titans-enneagram-analysis` |
| 235 | 16.4 | 53 (7/46) | 15 (15/0) | Enneagram Connecting Lines: Growth and Stress | `/enneagram-corner/enneagram-connecting-lines` |
| 215 | 9.5 | 2 (2/0) | 8 (4/4) | John Coogan and Jordi Hays Built TBPN by Wanting Different Things | `/pop-culture/tbpn-john-coogan-jordi-hays-enneagram-dynamic` |
| 211 | 16.8 | 3 (3/0) | 5 (5/0) | How Each Enneagram Type Unwinds: Your Stress-Relief Formula | `/enneagram-corner/how-each-enneagram-type-unwinds` |
| 191 | 10.6 | 9 (9/0) | 9 (9/0) | Why You're Burning Out at Work (Your Enneagram Type Reveals It) | `/enneagram-corner/mental-health/enneagram-workplace-mental-health` |
| 155 | 16.6 | 9 (1/8) | 25 (8/17) | Why the Next Thing Won't Fix It (How Type 7s Actually Find What They'… | `/enneagram-corner/why-the-next-thing-wont-fix-it-type-7` |
| 145 | 32.6 | 3 (3/0) | 3 (3/0) | 5 Conversations That Separate Thriving Couples From Everyone Else | `/how-to-guides/5-tough-conversations-you-need-to-have-with-your-partner` |
| 143 | 8.3 | 3 (3/0) | 12 (2/10) | Inside the Heartthrob Machine: What Fame Does to the Men Women Obsess… | `/pop-culture/hollywood-heartthrobs-enneagram-analysis` |
| 133 | 9.3 | 3 (3/0) | 12 (12/0) | Cancel Culture by Enneagram Type: Who Cancels and Who Gets Cancelled | `/pop-culture/cancel-culture-enneagram-type` |
| 131 | 12.2 | 3 (3/0) | 3 (3/0) | How Epstein Trapped the Powerful and the Vulnerable (Part 2) | `/pop-culture/epstein-psychology-part-2` |
| 123 | 14.2 | 3 (3/0) | 17 (17/0) | Why You Keep Sabotaging New Relationships (Your Enneagram Knows) | `/enneagram-corner/how-to-navigate-early-relationship-stages` |
| 96 | 43.0 | 3 (3/0) | 36 (36/0) | Enneagram Books, Websites, Podcasts & Influencers | `/enneagram-corner/enneagram-books-websites-podcasts` |
| 95 | 21.8 | 13 (13/0) | 14 (14/0) | Enneagram Self-Development: What I Got Wrong as a Type 8 | `/enneagram-corner/enneagram-self-development` |
| 91 | 10.0 | 6 (6/0) | 7 (7/0) | Philosophy and Psychology Gave Birth to the Enneagram | `/enneagram-corner/philosophy-psychology-and-the-enneagram` |
| 79 | 29.2 | 3 (2/1) | 3 (3/0) | Who Built the Enneagram? Mystics, Psychiatrists, Philosophers | `/enneagram-corner/enneagram-influences` |
| 63 | 9.0 | 1 (1/0) | 23 (14/9) | The Fallen Founders: What Holmes, Neumann, and Bankman-Fried Reveal A… | `/pop-culture/fallen-founders-enneagram-analysis` |
| 57 | 5.4 | 3 (3/0) | 5 (5/0) | The Enneagram Changed My Life, But I Learned to Shut Up About It | `/community/why-im-selective-sharing-enneagram` |
| 55 | 8.2 | 3 (3/0) | 14 (5/9) | Comedy Kings: Why the Funniest Men Alive Are Wired Completely Differe… | `/pop-culture/comedy-kings-enneagram-analysis` |
| 52 | 9.1 | 5 (5/0) | 11 (5/6) | The Podcaster Personality Map: Why Hosts Return to the Same Topics | `/pop-culture/podcaster-personality-map` |
| 52 | 8.2 | 3 (3/0) | 8 (8/0) | How to Throw a Party Everyone Actually Wants to Attend | `/enneagram-corner/enneagram-party-planner` |
| 49 | 9.0 | 3 (3/0) | 3 (3/0) | Enneagram Social Styles: The Hornevian Triads, Decoded | `/enneagram-corner/enneagram-social-styles` |
| 43 | 11.7 | 3 (3/0) | 13 (13/0) | Neurodiversity vs. Personality: Stop Looking for Labels, Start Lookin… | `/enneagram-corner/neurodiversity-vs-personality` |
| 37 | 7.9 | 3 (3/0) | 8 (2/6) | The Disruptors: Why Type 8s Break Industries and Type 5s Decode Them | `/pop-culture/tech-titans-disruptors` |
| 36 | 15.0 | 4 (4/0) | 11 (4/7) | Podcast Bros: Inside the Movement That Replaced Mainstream Media | `/pop-culture/podcast-bros-enneagram-analysis` |
| 33 | 9.8 | 3 (3/0) | 5 (5/0) | Kant Said Reality Is Filtered. The Enneagram Shows the Other 8 Filter… | `/community/kantian-filters-and-nine-perspectives` |
| 32 | 7.9 | 3 (3/0) | 16 (6/10) | US Presidents by Enneagram Type: The Psychology of the Oval Office | `/pop-culture/us-presidents-enneagram-analysis` |
| 31 | 9.1 | 2 (2/0) | 8 (4/4) | Alex Cooper vs Alix Earle: Why the Mentor-Protegee Pipeline Always Ex… | `/pop-culture/alex-cooper-alix-earle-beef-enneagram-analysis` |
| 26 | 7.0 | 2 (2/0) | 12 (3/9) | Trump's Type 8 vs Biden's Type 2: Why They Could Never Understand Eac… | `/pop-culture/trump-type-8-vs-biden-type-2` |
| 25 | 7.8 | 5 (5/0) | 6 (6/0) | Dark Triad and Enneagram: What We Can Actually Say | `/pop-culture/dark-triad-meets-enneagram` |
| 24 | 10.1 | 3 (3/0) | 4 (4/0) | Why You Don't Believe in Yourself (And How to Fix It in 30 Days) | `/how-to-guides/definitive-guide-to-self-efficacy` |
| 22 | 16.5 | 3 (3/0) | 11 (11/0) | How to Use the Enneagram for Self-Development (Past the Test) | `/how-to-guides/using-the-enneagram-for-self-development` |
| 20 | 12.8 | 4 (4/0) | 16 (16/0) | Enneagram First Impressions: What Each Type Is Scanning For | `/enneagram-corner/first-impression-enneagram-playbook` |
| 18 | 8.4 | 11 (10/1) | 14 (14/0) | Enneagram Harmonic Approaches: How Each Type Handles Conflict | `/enneagram-corner/enneagram-harmonic-approaches` |
| 12 | 8.9 | 3 (3/0) | 4 (1/3) | Musk vs Altman Trial: The Verdict, the Vibes, and the Personality Cla… | `/pop-culture/musk-vs-altman-trial-personality-dynamics` |
| 9 | 10.4 | 4 (4/0) | 11 (4/7) | The Anatomy of Public Shame: What We're Actually Doing When We "Cance… | `/pop-culture/psychology-of-public-shame` |
| 7 | 10.7 | 1 (1/0) | 6 (6/0) | 3 Societal Ticking Time Bombs Nobody Is Connecting | `/community/societal-ticking-time-bombs` |
| 5 | 6.4 | 3 (3/0) | 6 (6/0) | You Didn't Find Yourself in the Enneagram. You Found a Map. | `/community/personality-frameworks-map-not-territory` |
| 2 | 11.5 | 3 (3/0) | 13 (13/0) | Attachment, Frustration, Rejection: Object Relations by Type | `/enneagram-corner/enneagram-object-relations` |
| 2 | 3.0 | 3 (3/0) | 13 (3/10) | The Platform Emperors: How Personality Types Shape the Products Billi… | `/pop-culture/tech-titans-platform-emperors` |
| 1 | 6.0 | 4 (4/0) | 10 (10/0) | Introducing 9takes: Answer First, Then Compare Perspectives | `/community/introducing-9takes` |
| 1 | 15.0 | 3 (3/0) | 11 (11/0) | The Crash Course on Emotions We All Missed in Kindergarten | `/how-to-guides/the-crash-course-on-emotions-that-we-missed-in-kindergarten` |
| — | — | 21 (21/0) | 22 (22/0) | Red Flags You Are Dating Each Enneagram Type (And What to Do) | `/enneagram-corner/red-flags-dating-each-enneagram-type` |
| — | — | 17 (14/3) | 9 (9/0) | How Each Enneagram Type Survives Trauma | `/enneagram-corner/mental-health/enneagram-trauma-response-guide` |
| — | — | 11 (10/1) | 21 (21/0) | Shadow Work by Enneagram Type: Your Dark Side Has a Pattern | `/enneagram-corner/shadow-work-by-enneagram-type` |
| — | — | 8 (8/0) | 6 (6/0) | Parasocial Relationships Through the Enneagram | `/pop-culture/parasocial-relationships-enneagram-type` |
| — | — | 7 (7/0) | 5 (5/0) | Why Therapy Doesn't Work the Same for Every Personality Type | `/enneagram-corner/why-therapy-doesnt-work-the-same-for-every-type` |
| — | — | 6 (6/0) | 9 (9/0) | The Consensus on Human Nature | `/community/consensus-on-human-nature` |
| — | — | 6 (5/1) | 4 (4/0) | The Intellectual Fortress That Becomes a Prison | `/community/fear-triad-intellectual-fortress-or-prison` |
| — | — | 6 (6/0) | 6 (6/0) | How Minds Actually Change | `/community/how-minds-change-on-9takes` |
| — | — | 6 (6/0) | 12 (12/0) | Why MBTI Failed and What to Use Instead | `/community/mbti-vs-enneagram` |
| — | — | 6 (6/0) | 5 (5/0) | The Enneagram Under Fire: Common Criticisms Addressed | `/enneagram-corner/enneagram-criticisms` |
| — | — | 6 (6/0) | 11 (11/0) | When 'I'm Fine' Isn't: Reading Your Child's Mental Health by Type | `/enneagram-corner/mental-health/enneagram-parenting-mental-health` |
| — | — | 5 (2/3) | 22 (7/15) | How Type 8 Challengers Actually Succeed (It's Not What You Think) | `/enneagram-corner/how-type-8-challengers-actually-succeed` |
| — | — | 4 (4/0) | 5 (5/0) | The 90-Day Personality Maxing Blueprint | `/enneagram-corner/90-day-personality-maxing-blueprint` |
| — | — | 4 (4/0) | 15 (15/0) | Is the Enneagram Real? 27 Questions Everyone Asks (Finally Answered) | `/enneagram-corner/enneagram-faqs` |
| — | — | 4 (4/0) | 5 (5/0) | The Definitive Guide to Relationship Conflict [Part 1] | `/how-to-guides/definitive-guide-to-relationship-conflict-part-1` |
| — | — | 4 (4/0) | 13 (5/8) | Founders vs Stewards: The Personality Types That Replace Tech Visiona… | `/pop-culture/tech-titans-founders-vs-stewards` |
| — | — | 3 (3/0) | 5 (5/0) | What Was The Inspiration For 9takes? | `/community/inspiration-for-9takes` |
| — | — | 3 (3/0) | 4 (4/0) | Memetic Comments: Why Your Online Opinions Aren't Really Yours | `/community/memetic-comments` |
| — | — | 3 (3/0) | 3 (3/0) | The Bible Doesn't Start With Answers. It Starts With a Question. | `/community/questions-are-the-engine-of-moral-awakening` |
| — | — | 3 (3/0) | 6 (6/0) | 5 Reasons Reddit Can't Help You Find Deep Connections | `/community/reddit-deep-connections-limitations` |
| — | — | 3 (3/0) | 5 (4/1) | The Hardware and Software of the Mind | `/community/software-and-hardware-of-the-mind` |
| — | — | 3 (3/0) | 4 (4/0) | What Winning Online Arguments Looks Like | `/community/what-winning-online-arguments-looks-like` |
| — | — | 3 (3/0) | 4 (4/0) | Why the Greek vibe? | `/community/why-the-greek-vibe` |
| — | — | 3 (3/0) | 11 (11/0) | Why Your Enneagram Clients Aren't Changing (And the Homework That Act… | `/enneagram-corner/enneagram-coach-toolkit` |
| — | — | 3 (3/0) | 9 (9/0) | Enneagram Dating Guide for Women: Decode Your Perfect Match Formula | `/enneagram-corner/enneagram-dating-guide-for-women` |
| — | — | 3 (3/0) | 6 (6/0) | Online Dating, Decoded: A Guide for Real Connection | `/enneagram-corner/enneagram-online-dating-guide` |
| — | — | 3 (3/0) | 5 (5/0) | The Voice in Your Head: Self-Talk by Enneagram Type | `/enneagram-corner/enneagram-positive-self-talk` |
| — | — | 3 (3/0) | 7 (7/0) | Why Your Team Keeps Having the Same Ideas (Enneagram Fix) | `/enneagram-corner/enneagram-team-diversity` |
| — | — | 3 (3/0) | 16 (16/0) | Enneagram at Work: What Each Type Needs, Fears, Brings | `/enneagram-corner/enneagram-workplace-team-building` |
| — | — | 3 (2/1) | 16 (16/0) | Why People Overshare: Shame, Boundaries, and Safe Spaces | `/enneagram-corner/oversharing-psychology-shame-boundaries` |
| — | — | 3 (3/0) | 3 (3/0) | Personality Maxing: Looksmaxxing for What People Experience | `/enneagram-corner/personality-maxing` |
| — | — | 3 (3/0) | 3 (2/1) | The Stress Paradox: Why Emotional Patterns Outlast Situations | `/enneagram-corner/situations-change-emotions-dont` |
| — | — | 3 (3/0) | 6 (6/0) | Why Your Arguments Keep Repeating (And the Exercises That Actually Fi… | `/how-to-guides/definitive-guide-to-relationship-conflict-part-2` |
| — | — | 3 (3/0) | 3 (3/0) | The Pattern-Breaking Guide to Fighting Depression | `/how-to-guides/guide-to-fighting-depression` |
| — | — | 3 (3/0) | 5 (5/0) | How to Read People: The 4-Step Guide to Understanding Anyone | `/how-to-guides/how-to-psychoanalyze-people` |
| — | — | 3 (3/0) | 20 (20/0) | Productivity Systems by Enneagram Type | `/how-to-guides/productivity-systems-by-enneagram-type` |
| — | — | 3 (3/0) | 6 (6/0) | Active Listening Guide: Why Your Personality Type Sabotages It | `/how-to-guides/ultimate-guide-to-active-listening` |
| — | — | 3 (3/0) | 7 (4/3) | Breaking Points: How a Type 1 and a Type 7 Built Media's Most Unlikel… | `/pop-culture/breaking-points-enneagram-analysis` |
| — | — | 3 (3/0) | 4 (4/0) | Influencer Enneagram Types: Nine Creator Pressure Patterns | `/pop-culture/influencer-enneagram-types-instagram` |
| — | — | 3 (3/0) | 6 (6/0) | Masculinity, Strength, and Emotional Maturity | `/pop-culture/masculinity-strength-and-the-enneagram` |
| — | — | 3 (3/0) | 13 (13/0) | Why Is Twitter/X So Toxic? 6 Reasons Conflict Spreads | `/pop-culture/twitter-x-personality-types-toxic` |
| — | — | 2 (2/0) | 3 (3/0) | Reddit Moderators and Enneagram: What Actually Motivates Mods | `/pop-culture/reddit-moderators-type-1-internet` |
