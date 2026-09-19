<!-- docs/seo/gsc-indexing-audit-2026-09-19.md -->

# Google Search Console — Page Indexing Audit (2026-09-19)

Handoff doc. Everything needed to continue is inline. Previous audit:
`docs/seo/gsc-indexing-audit-2026-07-19.md` (read it for the buckets that were already
triaged and closed — this pass does not re-litigate them).

**Source:** GSC → Page indexing for `sc-domain:9takes.com` (Google account index `/u/5/`).
**Report freshness at audit time:** last update 9/13/26.

---

## Snapshot

| Metric      | 2026-07-19 | 2026-09-19 |
| ----------- | ---------: | ---------: |
| Indexed     |        464 |    **524** |
| Not indexed |        764 |    **490** |

Every bucket that was "real" in July is now smaller or gone. 404s fell 233 → 15, the 5xx and
redirect-error buckets are at 0 and marked Passed, soft 404 fell 15 → 12.

| Reason                             | Pages | Verdict                                                       |
| ---------------------------------- | ----: | ------------------------------------------------------------- |
| Page with redirect                 |   207 | Working redirects (mostly old uppercase slugs). Benign.       |
| Crawled – currently not indexed    |   161 | Google's quality call + 34 URLs that now redirect/404.        |
| Discovered – currently not indexed |    65 | Queued, never crawled. Benign.                                |
| Excluded by 'noindex' tag          |    28 | 17 intentional, **11 are the deploy-skew bug below**.         |
| Not found (404)                    |    15 | All stale/expected. No action.                                |
| Soft 404                           |    12 | 11 thin question categories (already noindexed/gone) + 1 bug. |
| Blocked by robots.txt              |     2 | Intentional.                                                  |

Sitemap is healthy: `https://9takes.com/sitemap.xml`, status Success, 709 URLs discovered,
last read 9/15/26.

---

## The one real bug: deploy skew silently `noindex`es good pages

**Symptom.** Pages that are live, 200, and emit `index, follow` were recorded by Google as
"Excluded by 'noindex' tag" — including recently crawled ones: `/pop-culture/trump-type-8-vs-biden-type-2`
(9/13), `/personality-analysis/jared-kushner` (9/6), `/personality-analysis/jensen-huang` (9/3).
GSC's URL Inspection for jared-kushner shows the tell: **Page fetch: Successful**, **user-declared
canonical: the correct URL**, and **"No: 'noindex' detected in 'robots' meta tag"**. A live test of
the same URL says "Page can be indexed". The trump page was recrawled 9/18 and is indexed again.
So the noindex is transient and unrelated to page content — it is a render-time artifact.

**Mechanism.**

1. Vercel serves only the newest deployment's files from `9takes.com`, and every deploy re-hashes
   the chunks whose content changed. Verified: chunks from the 4-days-ago production deploy return
   **404** on `9takes.com` today (`_app/immutable/chunks/BHJpZ6Fu.js`, `BKIe-NMC.js`).
2. Googlebot fetches HTML from deploy A and renders it later. If deploy B has shipped in between,
   the `import('./nodes/NN.js')` that SvelteKit runs during hydration 404s. MDsvex blog routes are
   doubly exposed: `src/routes/pop-culture/[slug]/+page.ts` (same pattern in `community`,
   `how-to-guides`, `enneagram-corner`) re-imports the markdown chunk in the browser.
3. SvelteKit catches that and renders the root error page —
   `node_modules/@sveltejs/kit/src/runtime/client/client.js:3076-3091` does
   `load_root_error_page(...)` then `target.textContent = ''`.
4. `src/routes/+error.svelte` emits `<meta name="robots" content="noindex, nofollow">`. The
   server-rendered `<head>` keeps the canonical. Google records: good canonical + noindex. Exactly
   what the inspection shows.

This also explains the one non-category soft 404, `/enneagram-corner/neurodiversity-vs-personality`
(3,396 words, 200, `index, follow`, no "not found" text anywhere): when the body is replaced by the
error card, the rendered page looks like an error to Google.

**Blast radius.** ~11 of the 28 noindex URLs, spread across five months and across every route type
(personality-analysis, pop-culture, enneagram-corner, questions) — consistent with a race, not a
content problem. Each one self-heals on recrawl, but a recrawl can take weeks (jared-kushner was
still out 13 days later). Real visitors on stale HTML hit the same error card.

**Fix shipped (this pass):** `scripts/carry-over-immutable-assets.mjs`, wired into `build:vercel`.
After the build, it reads the asset manifest published by the deploy that is live right now,
downloads any still-fresh file the new build doesn't already contain, and publishes a merged
manifest at `/_app/carryover-manifest.json` for the next build. Old hashed URLs therefore keep
resolving for `RETENTION_DAYS` (10).

- Content-hashed names only change when content changes, so a normal deploy carries a handful of
  files, not the whole 28 MB. Measured: only **2 of 40** chunks from the 4-day-old deploy were
  missing on production.
- Fail-open: any network/parse problem logs a warning and exits 0. A missing carry-over is a slow
  SEO leak; a failed build is an outage.
- Caps: 600 files / 60 MB / 15s per fetch, newest-first, `.js` and `.css` only.
- Skips unless `process.env.VERCEL` (use `--force` or `--dry-run` locally).
- Pruning logic is unit-tested: `scripts/carry-over-immutable-assets.spec.mjs` (vitest `include`
  now covers `scripts/**`).

**Verify after the next deploy:**

```bash
# 1. The manifest should now exist (it 404s until the first build with this script ships)
curl -s https://9takes.com/_app/carryover-manifest.json | head -c 200

# 2. After the deploy AFTER that one, chunks from the previous deploy should still resolve.
#    Grab an asset from the previous production deployment and re-request it from the apex:
vercel ls 9takes --prod           # take the second URL in the list
curl -s <previous-deploy-url>/pop-culture/trump-type-8-vs-biden-type-2 \
  | grep -oE '_app/immutable/entry/[A-Za-z0-9._-]+\.js' | sort -u \
  | while read p; do curl -s -o /dev/null -w "%{http_code}  $p\n" "https://9takes.com/$p"; done
# Before the fix: 404. After: 200.

# 3. Build log line to look for:
#    [carry-over] build has N assets; carried M from the live deploy (X MB)
```

**Not done / open:** Vercel Skew Protection was considered and rejected as the primary fix.
`@sveltejs/adapter-vercel` implements it with a `__vdpl` cookie set on responses that carry
`Sec-Fetch-Dest: document` (`node_modules/@sveltejs/adapter-vercel/index.js:642-676`). Googlebot's
crawler is not a browser and its resource fetches go through Google's own cache, so cookie-pinning
is unlikely to reach the case we actually care about. The carry-over is URL-based and therefore
works for every client. Enabling Skew Protection as well would not conflict.

---

## Everything else, and why it needs no action

**Not found (404) — 15.** All previously triaged classes: malformed external-citation URLs with a
trailing `)` from old page versions (`/watch?v=…)`, `/wiki/…)`, `/episodes/sam-altman/)`), deleted
people (`marilyn-manson`, `miranda-lambert`, `lainey-wilson`, `riley-green`), and drafts that were
once live (`edgar-allan-poe`, `Ben-Shapiro`). 404 is the correct answer for all of them.

**Soft 404 — 12, validation Failed 8/15.** Eleven are thin `/questions/categories/*` pages Google
last crawled in **April**, before the July noindex-thin-categories policy shipped. Checked live
today: 6 now serve `noindex, follow` (correct — they'll move to the noindex bucket on recrawl), 2
now 404 (`law-and-justice`, `legal-procedures-and-practices`), 3 now have real intros and serve
`index, follow` (`life-events`, `self-awareness-and-self-understanding`, `romantic-relationships`).
Nothing to fix; the validation just predates the fixes. The 12th is the deploy-skew bug above.

**Crawled – currently not indexed — 161.** Breakdown by live status: 127 are 200, 30 now
redirect (26 old uppercase person slugs like `/personality-analysis/Harry-Styles` → 308 to
lowercase, plus renamed enneagram-corner posts), 4 are 404 (deleted questions/categories).
Confirmed the uppercase URLs are **not** linked internally anywhere and are **not** in the sitemap —
they're historical, and the 308s are correct. The remaining ~112 indexable pages are Google's
quality/priority call, not a bug. Fifteen more are question categories that are intentionally
noindexed.

**404 category slugs** (`economy-and-work`, `law-and-justice`, `legal-procedures-and-practices`,
`global-economy`) and `/personality-analysis/sarah-safari` (misspelling of `sara-saffari`): verified
no internal links and not in the sitemap. Historical only. Redirects optional, low value.

**Discovered – currently not indexed — 65.** Validation Passed. Mostly `/community/*`,
`/enneagram-corner/*` (incl. `mental-health/*` and `subtopic/*`) and `/questions/*`. Queued, not a
defect.

---

## Reindexing requested (9 URLs, 2026-09-19)

Daily quota is ~10 per property, and it was spent on the pages that are demonstrably wrongly
excluded rather than on thin ones. All 9 are in the sitemap and all serve `index, follow`.

| URL                                                           | Was                   |  Words |
| ------------------------------------------------------------- | --------------------- | -----: |
| `/personality-analysis/jared-kushner`                         | Excluded by 'noindex' |  8,059 |
| `/personality-analysis/jensen-huang`                          | Excluded by 'noindex' |  6,403 |
| `/personality-analysis/jocko-willink`                         | Excluded by 'noindex' | 12,187 |
| `/personality-analysis/noam-chomsky`                          | Excluded by 'noindex' | 12,500 |
| `/enneagram-corner/enneagram-harmonic-approaches`             | Excluded by 'noindex' |  4,641 |
| `/enneagram-corner/enneagram-social-styles`                   | Crawled – not indexed |  5,357 |
| `/enneagram-corner/neurodiversity-vs-personality`             | Soft 404              |  3,396 |
| `/pop-culture/tech-titans-founders-vs-stewards`               | Excluded by 'noindex' |  5,430 |
| `/pop-culture/alex-cooper-alix-earle-beef-enneagram-analysis` | Excluded by 'noindex' |  6,045 |

Still queued for a later day (same phantom-noindex class): `/pop-culture/twitter-x-personality-types-toxic`
(4,026 words) and `/manifesto`.

---

## Reusable tooling notes

- The live-status sweep used for this audit (status + robots meta + canonical + word count for a
  list of paths) is at
  `/private/tmp/.../scratchpad/gsc/check.sh` — a 12-line curl loop worth re-creating rather than
  eyeballing URLs one at a time.
- GSC UI scraping: the drilldown tables render rows that `offsetParent` reports as hidden. Grab them
  with `[...document.querySelectorAll('table')]`, pick the table with the most `9takes.com` rows,
  and read `innerText`. The rows-per-page control needs a real click on the option element and a
  couple of seconds to re-render. JS return values are truncated around 1 KB, so slice the output.
- `node scripts/fetch-gsc-data.mjs` (service-account API pull) is the non-UI path for performance
  data; see `docs/data/gsc/README.md`.
