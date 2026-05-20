<!-- docs/twitter/2026-05-19_engagement-audit/02-home-feed-raw.md -->

# Home Feed Scan (Following + For You) — 2026-05-19

## CRITICAL FINDING: Following feed is essentially dead

DJ follows 179 accounts. After 15+ scroll attempts and full page reload, the **Following** tab returned only **5 unique tweets** in the visible timeline:

| Account                                                        | Post                                                                          | Views | Likes | Replies | RTs |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----- | ----- | ------- | --- |
| Logan Karnow (@LoganKarnow)                                    | "Since I drive a $500 Ridgeline with 320k miles..." (personal life)           | 1,995 | 42    | 6       | 0   |
| Jim Bisenius (@jim_bisenius)                                   | "what's gonna get the girls now, logan" (reply)                               | 7     | 0     | 0       | 0   |
| Mott & Bow (@MottandBow)                                       | jeans ad (promoted)                                                           | 17.9M | 1421  | 70      | 107 |
| Will Oremus (@WillOremus) — reposted by Dr. Daniel J. Winarick | "My first story for The Atlantic about ed tech slop..."                       | 140K  | 2205  | 32      | 193 |
| Tim Ferriss (@tferriss)                                        | "You shouldn't be trying to do more in each day..." (productivity philosophy) | 9,184 | 137   | 29      | 16  |

**Translation:** Of 179 people DJ follows, only 5 had visible posts surfacing today, and **zero of them are enneagram or personality accounts**. The "Mott & Bow" appearance is a paid promoted ad, not organic activity. This isn't a bug — it's a strong signal the people DJ is following are not posting frequently enough to fill a feed, OR they're posting but the algorithm has demoted them, OR DJ's behavior signals to the algorithm he doesn't engage so it stops surfacing the feed.

## For You (algorithmic) feed — what X _thinks_ DJ wants

15 unique posts captured. Ranked by views:

| #   | Account                               | Post snippet                                                                                                                                 | Views     | Likes      | Topic                               |
| --- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------- | ----------------------------------- |
| 1   | Elon Musk                             | "Where will AI be in 1, 2 or 3 years?" + video                                                                                               | **38.7M** | 109K       | AI/celebrity                        |
| 2   | Mo (@atmoio)                          | "I don't think people managers will have any value in the future — Airbnb CEO on AI"                                                         | 917K      | 2,226      | AI/business                         |
| 3   | NASCAR                                | "Trouble strikes the field again..." + video                                                                                                 | 853K      | 799        | Sports                              |
| 4   | Apeel Sciences                        | "Two Facebook posts. One online mob. And no one could stop it."                                                                              | 418K      | 221        | Story/business                      |
| 5   | FOX One                               | Indy 500 promo + video                                                                                                                       | 247K      | 7          | Promoted                            |
| 6   | **CooperBaggs (@edgaralandough)**     | **"Unpopular opinion: half of parenting is learning to regulate yourself, not your child."**                                                 | **186K**  | **13,059** | **Psychology / one-liner**          |
| 7   | Sulekha Tripathi (@sulekhat95)        | "A man spends 50 years teaching at MIT. He knows his time is running out. So he records one last lecture..." (story-thread)                  | 183K      | 1,731      | Inspiration/story                   |
| 8   | TradeOdds                             | Product promo                                                                                                                                | 79K       | 10         | Finance/promo                       |
| 9   | anu (@anuatluru)                      | "It's the era of the polymathic individual contributor."                                                                                     | 25.5K     | 666        | Hot take one-liner                  |
| 10  | Rahul Pandita (@rahulpandita)         | "One of Freud's early followers, Alfred Adler, in an early consultation with a patient would ask them: What would you do if you were cured?" | **9,691** | **183**    | **Psychology / classic theory**     |
| 11  | Frannyfanny (@proud_penelope)         | "Kernberg did us a solid by describing how borderline should _not_ be reduced to 'hysterical female.' His BPO concept..."                    | **7,228** | **140**    | **Psychology / contrarian framing** |
| 12  | Dr David Vernon (@DrDavidVernon)      | "my favourite little corner of the world: where i write my books."                                                                           | 6,298     | 296        | Aesthetic/personal                  |
| 13  | Allen Frances MD (@AllenFrancesMD)    | "Chatbots provide best window into how humans think. They are biomimicry creations..."                                                       | 3,604     | 28         | Psychology/AI                       |
| 14  | Medicating Normal (@MedicatingNorm1)  | Article share about psychiatric drug withdrawal                                                                                              | 1,255     | 23         | Mental health                       |
| 15  | Grant H Brenner MD (@GrantHBrennerMD) | "'What do you want?' Can be a surprisingly disoriented question for people who aren't used to hearing it authentically."                     | 692       | 11         | Psychology insight                  |

## Key pattern observations

### What's hitting in DJ's algorithmic feed (relevant to 9takes)

**Psychology/personality content IS in DJ's For You feed** — at least 6 of 15 posts (40%) are psychology/personality/mental-health related. So the algorithm has correctly identified DJ's interest cluster. The problem is _no one in this cluster is engaging with him_.

### Engagement multipliers (across all 15 For You posts)

| Format                             | Avg Views | Best example                                        |
| ---------------------------------- | --------- | --------------------------------------------------- |
| **"Unpopular opinion" one-liner**  | 186K      | CooperBaggs parenting take (13K likes)              |
| **Story-thread (mystery hook)**    | 183K      | Sulekha's MIT lecture story                         |
| **Hot take / status-of-the-world** | 917K      | Mo: "people managers won't have value"              |
| **Classic theory + question**      | 9.7K      | Rahul: Adler "what would you do if you were cured?" |
| **Contrarian reframe**             | 7.2K      | Frannyfanny: Kernberg / borderline reframing        |
| **Personal sensory snapshot**      | 6.3K      | Dr David Vernon: "my favourite little corner"       |

### Underperformers (low likes per view ratio)

- TradeOdds: 79K views, only 10 likes — clearly promoted/distributed but no organic resonance
- FOX One: 247K views, 7 likes — pure promoted, no engagement
- Allen Frances MD: 3.6K views but only 28 likes (~0.7%) — his takes are too abstract; lacks hook
- Medicating Normal: 1.3K views, 23 likes — article share format dies (link tax)

### Overperformers (high engagement-to-views ratio)

- **CooperBaggs**: 13,059 likes / 186K views = **7.0% like rate** — viral-tier
- **Frannyfanny**: 140 likes / 7,228 views = **1.9%** — strong for niche psychology
- **anu**: 666 likes / 25K views = **2.6%** — one-liner outperforms
- **Rahul Pandita**: 183 likes / 9,691 views = **1.9%** — classic theory reframe

## Takeaway from home feed scan

1. **The "enneagram community is dead on X" hypothesis is half right.** Enneagram-specific content isn't surfacing, but the _adjacent_ community (psychology, psychiatry, personality theory, parenting, attachment, self-work) IS active and engaging.
2. **DJ's Following list is the wrong shape.** He follows productivity/tech people (Tim Ferriss, Logan Karnow, tech feeds) who don't engage with personality content. He's not in any of the right rooms.
3. **The formats that win in DJ's actual algorithmic feed** are exactly what he isn't doing: unpopular opinions, story-threads with mystery hooks, contrarian reframes of classic theory, sensory/personal snapshots, and one-liner hot takes.
