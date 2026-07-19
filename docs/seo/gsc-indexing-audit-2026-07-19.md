<!-- docs/seo/gsc-indexing-audit-2026-07-19.md -->

# Google Search Console — Page Indexing Audit & Fixes (2026-07-19)

Handoff doc. Everything needed to continue is inline (don't rely on chat history).

**Source:** GSC → Page indexing for `sc-domain:9takes.com`
`https://search.google.com/u/5/search-console/index?resource_id=sc-domain%3A9takes.com&hl=en`
(Google account index `/u/5/` = djwayne3@gmail.com. GSC "last update" at audit time: 7/9/26.)

**Snapshot at audit:** 464 indexed / **764 not indexed** across 11 reasons.

---

## TL;DR

The 764 "not indexed" is **mostly benign or already-fixed-and-stale**, not 764 live problems.

- 1 real root-cause bug found and fixed: **malformed personality slugs** (apostrophes/dots/accents). **DB fix is LIVE**; code hardening + redirects committed & pushed (deploys on next Vercel build).
- 2 clean redirects added.
- Soft-404 category policy implemented locally: categories without substantive intro copy are
  `noindex, follow` and excluded from the generated sitemap.
- First priority category repaired in production: **Relationships** now has a reviewed manual intro.
- 1 data-debt flag: duplicate Brené Brown rows.

---

## Full 11-reason triage

| Reason                                      | Count | Source  | Verdict                                                          |
| ------------------------------------------- | ----: | ------- | ---------------------------------------------------------------- |
| Crawled – currently not indexed             |   256 | Google  | Content quality / Google's call. Not a code bug. Biggest bucket. |
| Not found (404)                             |   233 | Website | Mostly **stale** + a few real — see breakdown below              |
| Page with redirect                          |   192 | Website | Working redirects. Benign.                                       |
| Discovered – currently not indexed          |    28 | Google  | Passed/queued. Benign.                                           |
| Excluded by 'noindex' tag                   |    21 | Website | Intentional.                                                     |
| Soft 404                                    |    15 | Website | **REAL** — thin `/questions/categories/*` pages. Open decision.  |
| Blocked by robots.txt                       |     7 | Website | Intentional.                                                     |
| Server error (5xx)                          |     5 | Website | Transient cold-starts; 4 already 200; 5th = slug bug (fixed).    |
| Duplicate, Google chose different canonical |     5 | Google  | Google's canonical choice. Benign.                               |
| Redirect error                              |     1 | Website | Stale — `/blog/enneagram/subtopic/overview` now 301→200.         |
| Alternate page w/ proper canonical          |     1 | Website | Benign.                                                          |

### The 233 "Not found (404)" breakdown

- **~140** malformed external citation URLs (`/watch?v=…)`, `/wiki/…)`, `/2016/…​.html)`, note trailing `)` = markdown-link artifacts). These are from **old versions** of people pages. Verified: the live `jared-leto` page emits 107 links, all external URLs well-formed, **zero** leaked relative paths. `blogContentProcessor.ts` does not strip domains; DB `content`/`citations`/`same_as` are clean. **Stale — will age out.**
- **~40** legacy `/blog/famous-enneagram-types/*` — already 308→301→**200** (redirects in `vercel.json`). Stale.
- **~5** slug-format bugs (`charli-d`, `dixie-d` apostrophe-truncated; `Ben-Shapiro`, `kanye-west`) → root cause fixed (below).
- **~8** real people 404s:
  - `kanye-west` → real page is at slug `kanye`. **Redirect added.**
  - `ben-shapiro`, `edgar-allan-poe` → exist in DB but `published=false`. 404 is correct for drafts; Google indexed them when live. Optional: republish or redirect for equity.
  - `marilyn-manson`, `miranda-lambert`, `lainey-wilson`, `riley-green` → **not in DB** (deleted/never existed). 404 correct.
- Misc: `/enneagram-corner/neurodiversity-vs-personality-enneagram` (stale slug; live is `…/neurodiversity-vs-personality`) → **redirect added**. `/blog/enneagram-and-religion` → 404, no redirect (minor gap, likely content gone).

---

## What was fixed (committed + pushed to origin/main in `a3face86`)

> ⚠️ That commit was created by a **parallel process** (another agent's admin-mobile work got swept in with these changes). All GSC-fix files are present and correct. HEAD == origin/main, so Vercel auto-deploys. At time of writing the build had **not** finished (see "verify" below).

### 1. Malformed personality slugs — the real root-cause bug

`normalizePersonalitySlug` only lowercased + hyphenated whitespace; it did **not** strip apostrophes, periods, or accents. So 3 published pages had un-indexable slugs and the clean URLs Google indexed all 404'd:

| Malformed slug (was in DB) | Clean slug (now) |
| -------------------------- | ---------------- |
| `charli-d'amelio`          | `charli-damelio` |
| `dixie-d'amelio`           | `dixie-damelio`  |
| `j.k.-rowling`             | `jk-rowling`     |

Route resolution: `src/routes/personality-analysis/[slug]/+page.server.ts` normalizes the requested slug, 301-redirects if it differs, then looks up `.eq('person', canonicalSlug)`. With the old normalize, clean URLs never matched `person` → 404.

**Changes made:**

- Hardened `normalizePersonalitySlug` in **both** copies (they must stay in sync):
  - `src/lib/utils/personalityAnalysis.ts`
  - `scripts/lib/personalitySeo.js`
  - Now: `trim → toLowerCase → NFD → strip combining diacritics → drop `['’.]`→`[^a-z0-9]+`→`-` → trim hyphens`. Accents fold (é→e), apostrophes/dots drop. Idempotent on already-clean slugs.
- Normalized the 3 rows in **production DB** via the sanctioned script (see below). Also cleaned 6 rows' `suggestions` cross-links. 0 comment rows affected.
- Added `--published-only` flag to `scripts/normalize-personality-slugs.js` (needed to skip an unpublished collision — see Brené Brown below).
- J.K. Rowling image: copied `static/types/1s/J.K.-Rowling.webp` → `JK-Rowling.webp` (+ `s-` thumb) so the URL-safe slug resolves, then regenerated `src/lib/generated/personalityImageSlugMap.json` (added key `jk-rowling → JK-Rowling`). charli/dixie clean-slug images already existed.
- Tests: `src/lib/utils/personalityAnalysis.spec.ts` (edge cases + updated the `j.k.-rowling` display-name expectation to `JK Rowling`). `pnpm check` = 0 errors.

**The DB write command that was run:**

```bash
node scripts/normalize-personality-slugs.js --published-only          # dry run
node scripts/normalize-personality-slugs.js --published-only --write   # applied
```

**Status: DB fix is LIVE** (pages read live DB via SSR). Clean URLs return 200 now. The old apostrophe/dot URLs 404 on current prod and will 301→clean once the hardened util deploys.

### 2. Two redirects in `vercel.json`

```
/personality-analysis/kanye-west                            → /personality-analysis/kanye
/enneagram-corner/neurodiversity-vs-personality-enneagram   → /enneagram-corner/neurodiversity-vs-personality
```

Live on next deploy.

---

## Verify current state

```bash
# 1. Clean slug URLs — should be 200 (DB fix already live)
for s in charli-damelio dixie-damelio jk-rowling; do
  curl -s -o /dev/null -w "%{http_code}  $s\n" "https://9takes.com/personality-analysis/$s"; done

# 2. Has the code deployed yet? Old malformed URL: 404 = not deployed, 301 = deployed
curl -s -o /dev/null -w "%{http_code}  charli-d'amelio (encoded)\n" \
  "https://9takes.com/personality-analysis/charli-d%27amelio"

# 3. J.K. Rowling hero image — 404 until the regenerated image map deploys, then 200
curl -s "https://9takes.com/personality-analysis/jk-rowling" \
  | grep -oE '/types/[0-9]+s/[^"]*\.webp' | head -1
```

---

## Follow-up work completed later on 2026-07-19

These changes are in the working tree and are **not committed or deployed yet** unless explicitly
described as live below.

### Category indexing policy

- Added one shared `hasSubstantiveQuestionCategoryIntro` predicate.
- `/questions/categories/[slug]` now emits `index, follow` only when saved intro markdown is
  substantive; otherwise it emits `noindex, follow`.
- `scripts/generate-sitemap.js` applies the same predicate, so no-intro category URLs are omitted
  from the next generated sitemap.
- Added focused coverage in the category SEO, sitemap, and public-delivery test suites.
- Added explicit redirects for the encoded Charli and Dixie D'Amelio URL variants.
- DJ is regenerating the sitemap separately; do not treat the current generated file as part of
  this handoff.

### Category intro production work

- The admin queue showed 25 eligible categories: 22 missing/failed and 3 stale AI intros.
- The first live AI attempt for `relationships` exposed a runtime bug. Production bundles the route
  into a 15-second Vercel function while the OpenRouter client can wait 120 seconds. Vercel killed
  the request and left run `509d5c08-f4b8-4008-a165-49a979e41c74` in `processing`.
- Local hardening now:
  - isolates single and batch generation in a 60-second function;
  - uses the fast JSON model route with a 25-second provider timeout and 1,024-token cap;
  - limits batches to four and runs those four concurrently;
  - recovers orphaned runs on retry;
  - prevents late AI responses from overwriting newer manual edits;
  - closes processing runs when a manual save supersedes generation.
- A production build completed and the emitted Vercel function config was verified at
  `maxDuration: 60`.
- Since the runtime fix is not deployed, `relationships` was completed through the existing manual
  editor. It is **LIVE**, `intro_status=completed`, `intro_source=manual`, reviewed, and the public
  page returns 200 with the intro, meta description, canonical, and `index, follow`.

## OPEN ITEMS (next agent picks up here)

### A. Deploy and verify the category intro runtime fix

After the working-tree changes deploy:

1. Retry one missing category from `/admin/categories` and confirm it completes in under 60 seconds.
2. Confirm the old Relationships run is recovered or close it through a sanctioned admin workflow.
3. Generate a small batch and inspect every draft before marking it reviewed.
4. Continue priority order by subtree count; avoid overwriting the reviewed manual Relationships
   intro.

### B. Soft 404 background — 15 thin `/questions/categories/*` pages

Investigated. All 15 have **0 intro content** (`intro_status='missing'`) and **1–6 questions**
(`relationships` has 33 via descendants but 0 direct). Google reads near-empty category pages as soft-404.

**Systemic:** **489 of 492** categories have no intro (`intro_status`: missing=489, stale=3). Google has only flagged the 15 it crawled; more are at risk.

Route: `src/routes/questions/categories/[slug]/+page.server.ts` (+ `+page.svelte`). No existing noindex/robots logic there. Intro system: `intro_markdown`/`intro_status`/`intro_description` columns on `question_categories`; `src/lib/server/questionCategoryIntro.ts`. No ready CLI generator found (only `generate-sitemap.js` reads intro fields).

**Policy now implemented locally:**

1. `noindex, follow` every category without substantive intro markdown.
2. Generate and review intros for categories worth ranking; a saved intro automatically makes the
   page indexable and eligible for the generated sitemap.

Query used to count questions per category (join `question_category_tags.tag_id` → `question_categories.id`; recurse `parent_id` for descendants):

```sql
-- counts per category incl. descendants, for the 15 flagged slugs — see chat/history
```

The 15 flagged slugs (question count incl. descendants):
`ethics(1) business-ethics(1) engaging-with-community-and-neighbors(1) intimacy-and-connection(1)
legal-procedures-and-practices(1) traditions-and-customs(1) technology-and-innovation(2)
skill-acquisition(2) social-movements(3) life-events(4) friendships(4)
self-awareness-and-self-understanding(5) romantic-relationships(6) relationships(33 via children, 0 direct)`
(+1 more not captured; pull the full list from the GSC Soft 404 drilldown.)

### C. Data debt — duplicate Brené Brown rows

`blogs_famous_people`: id **824** = `brené-brown` (empty draft, no content, `published=false`) and id **974** = `brene-brown` (real 21K-word draft, `published=false`). Both unpublished → no live/GSC impact. 824 is a dead duplicate; delete when convenient. This collision is why `--published-only` was needed (824 normalizes to `brene-brown` and collides with 974).

### D. Optional GSC action (DJ, in the GSC UI)

Hit **"Validate Fix"** on Server error (5xx), Redirect error, and the personality-analysis 404s to nudge re-crawl. Not required — they clear on their own.

---

## Key facts / gotchas for whoever continues

- `scripts/db-query.sh "<SQL>"` = **read-only** production SQL (CSV out). The only sanctioned **write** path for personality slugs is `scripts/normalize-personality-slugs.js` (service-role; `--write` to apply, `--published-only` to scope to live rows, optional bare arg = person filter but note the filter normalizes the arg so it won't match a still-malformed DB value).
- Personality-analysis pages are **DB-driven** (`blogs_famous_people`, keyed by `person`/`loc`) and SSR with `no-store`, so DB edits are live immediately — but code/asset changes need a Vercel deploy.
- The two `normalizePersonalitySlug` copies (`src/lib/utils/personalityAnalysis.ts` + `scripts/lib/personalitySeo.js`) **must stay identical**.
- `personalityImageSlugMap.json` is generated by `scripts/generate-personality-image-slug-map.js` from image filenames (basename lowercased = key). To give a slug an image, the file basename must lowercase to that slug.
- Parallel editing is normal here — never `git stash`/reset/bulk ops (see memory `feedback_parallel_work_safety`). Commits may be swept up by other processes.
