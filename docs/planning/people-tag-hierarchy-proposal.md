# How people are grouped on 9takes (taxonomy v3)

Decided 2026-11-19 after four stress tests: two blind taxonomies built from scratch, an adversarial review of the draft, and 640 people not yet on the site. This replaces the earlier proposal (git history has it).

## The model: Jev labels facts, pages compute groups

Each person gets one record in `src/lib/data/personClassifications.json`:

| Fact                 | What it is                                                                                           |
| -------------------- | ---------------------------------------------------------------------------------------------------- |
| `home`               | One path: Field › Niche › optional Sub. Decides where they sit on a type page.                       |
| `also`               | Up to 2 second careers with their own public body of work, each with evidence. Never the home field. |
| `platforms`, `roles` | Closed lists (YouTube, podcast…; founder, host, notorious…). Power filters, not categories.          |
| `breakout`           | Year + the work that first made them widely known ("1990s movie stars" is a filter on this).         |
| `born`               | Birth year. Generation is computed from it.                                                          |
| `era`                | Only for people whose breakout predates 1950.                                                        |

Collections like "YouTubers", "1990s movie stars" or "former child stars" are saved filters over these facts, never tags. The vocabulary lives in `src/lib/data/peopleTaxonomy.json` (code: `src/lib/peopleTaxonomy.ts`).

## The 15 fields

Film, TV & Stage · Music · Comedy · Internet Creators · Hosts & Media · Sports · Tech · Business & Money · Politics & Government · Royals, Famous Families & Reality · Ideas & Art · Style, Food & Home · Self-Help & Wellness · Faith & Spirituality · Crime & Notoriety.

Max three levels. Niches name what someone does inside the field (genre, sport, format), never how famous they are or where they are in their career.

## Labeling rules (in priority order)

1. **Field = the shelf a reader would look on; it names what they do, never the platform.** Internet Creators only when the product is the person themselves online.
   - Tech covers software, AI, all crypto and game studios, coder or not.
   - Clothing, beauty and luxury companies go to Style; other companies go to Business. People who sell business advice as content go to Business › Business creators.
   - All late-night and satire hosts go to Comedy. Daytime and talk hosts go to Media.
   - Self-help is secular. Religious or spiritual teaching goes to Faith.
   - Royals and famous non-political families go to Royals & Reality. Reigning sovereigns and historical rulers go to Politics › Kings, queens & emperors. Presidents' families go to Politics › First families.
   - Crime & Notoriety is only for people known _solely_ for crimes, cons or cults. Anyone with a real career keeps their industry and gets the `notorious` role.
2. **Home = the occupation named first in the opening line of their English Wikipedia article.** Override only when a newer career has had about 2+ years of headline work, and say so in `why`.
3. **Also** needs its own public body of work (a pro career, a show, a catalog, a company). Former careers count. Cameos, single works and brand deals don't.
4. **No honest slot means home is null** and a `new_label` proposal goes in. Never publish a nearest path that reads as a false claim.

## On a type page

- A field gets its own circle only with 3+ people on that page. Smaller fields fold into "More", each kept as its own labeled cluster.
- Inside a field, a niche (or sub-niche) becomes a labeled lane only with 3+ people. Sub-niches open only if nobody is left stranded in a lane of 1–2.
- A lane with more than 10 people splits by generation (Boomers, Gen X, Millennials…), each part 3+.
- Crossover faces come from `also` fields and never count toward the 3-person minimum.

## Keeping it current

- `pnpm people:classify` lists published people with no label.
- `pnpm people:classify -- --write` has Jev label them: field, then niche. Jev returns choices with probabilities and writes no text, so `also`, platforms and breakout stay empty with `source: "jev"` until an agent or DJ fills them.
- `pnpm people:classify -- --check` fails if anyone is unlabeled. The unit tests check this too.

The 469 current labels are an agent draft (`source: "agent-draft"`). Breakout years are unverified, and 8 people are low confidence: adela, ashby, carina-zavline, dhar-mann, ella-beatty, hailey-bieber, inde-navarrette, stella-lefty.

## Where the labels show up

- **Type pages** (`/personality-analysis/type/N`): the field map (rules above), plus a Map | Timeline switch. The timeline groups everyone by generation, oldest on the left, each group spanning its oldest to youngest birth year (`src/lib/peopleTimeline.ts`, `PeopleTimeline.svelte`).
- **Category pages** (`/personality-analysis/categories/<page>`): one per field, with the URL stored as `page` in `peopleTaxonomy.json`. Existing URLs kept their fields: `film-tv` = Film, TV & Stage, `fashion` = Style, Food & Home, `authors-thinkers` = Ideas & Art, `creator-media` = Internet Creators, `politics-public` = Politics & Government. New pages: `hosts-media`, `sports`, `royals-reality`, `self-help`, `faith-spirituality`, `crime-notoriety`. A page holds everyone filed there plus "Also in" second careers. Groups are niches with 3+ people, sub-niches split out at 3+, groups over 24 split by generation, and the rest pool into "More …". Each page has a birth-year timeline. Under 3 people, a page is noindex and stays out of the listing and sitemap; with 0 people it returns a 404 (Crime & Notoriety until its first profile).
- **Famous-people lists in the Type 1–9 articles** (`FamousTypes`): grouped by home field. The field is written into `famousTypes.ts` by `pnpm gen:famous-types`, so browsers never load the 170KB labels file. A unit test fails if they drift.
- **Sitemap and corpus stats** (`generate-sitemap.js`, `generate-corpus-stats.js`) use the same membership.

Still on the old DB `type` tags: similar-people ranking on profiles (`personalitySimilarity.ts`) and the cluster-tag audit scripts.
