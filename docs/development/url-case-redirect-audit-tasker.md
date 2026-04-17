<!-- docs/development/url-case-redirect-audit-tasker.md -->

# Tasker: Personality URL Case Redirect Audit

**For:** the agent assigned to fix the title-case vs. lowercase URL split on `/personality-analysis/*`.
**Owner:** DJ
**Created:** 2026-04-17
**Status:** Code + local audits complete 2026-04-17. Deploy + GSC re-crawl remain — see §8.
**Related:** `docs/development/rabbit-hole-retrofit-traffic-analysis.md` §1.1 (where this was surfaced).

---

## 0. What and why

Google Search Console shows the same personality pages indexed under both title-case and lowercase slugs — e.g. `Ryan-Gosling` _and_ `ryan-gosling`, `Tom-Hiddleston` _and_ `tom-hiddleston`, ~12 known pairs from the 3-month + 1-month GSC data. Each pair is splitting clicks, impressions, and authority across two URLs that should be one.

**The canonical form is lowercase.** Confirmed by:

- `src/lib/utils/personalityAnalysis.ts:4` — `normalizePersonalitySlug()` lowercases and strips whitespace. This is the authoritative normalizer.
- `static/sitemap.xml` — all 900+ `/personality-analysis/*` entries emit lowercase slugs. No title-case entries.
- `src/lib/components/blog/PeopleBlogPageHead.svelte:139` — the `<link rel="canonical">` tag renders `canonicalUrl`, which flows from `data.loc` or falls back to `buildPersonalityAnalysisUrl()` (which lowercases).

**The gap:** `src/routes/personality-analysis/[slug]/+page.server.ts:44` uses `.ilike('person', requestedSlug)` — case-insensitive — so `/personality-analysis/Ryan-Gosling` returns 200 with full content instead of redirecting to `/personality-analysis/ryan-gosling`. Google crawled both, indexed both, and has no permanent-redirect signal telling it to consolidate.

The rel=canonical tag is the last line of defence, and it's evidently not enough on its own — we still see CTR split across cases in GSC over 3 months. 301 redirects are the fix.

**Expected impact:** consolidating cases lifts CTR on every affected page because impression/click volume aggregates instead of splitting. On Tom-Hiddleston alone (4,793 combined impressions across cases), even a conservative 20% aggregation lift would be material. This is a one-shot infrastructure fix that benefits every personality page forever.

---

## 1. Required reading

1. `docs/development/rabbit-hole-retrofit-traffic-analysis.md` §1.1 — the GSC evidence showing the case split.
2. `src/lib/utils/personalityAnalysis.ts` — the normalization utility. Canonical form lives here.
3. `src/routes/personality-analysis/[slug]/+page.server.ts` — the route that currently accepts both cases.
4. `src/lib/components/blog/PeopleBlogPageHead.svelte` — canonical/og:url rendering.
5. `static/sitemap.xml` — truth table for what's in the sitemap.
6. `scripts/normalize-personality-slugs.js` — the existing DB-side normalizer. Run history unknown; may need re-running.
7. `scripts/normalize-internal-personality-links.js` (via `pnpm seo:normalize-internal-personality-links`) — internal-link rewriter.

---

## 2. Known affected URL pairs (from 3-month + 1-month GSC data)

Both variants of each pair appeared in DJ's GSC exports. This list is the minimum — there are likely others below the GSC reporting threshold.

| Title-case (to redirect)                    | Lowercase (canonical)                       |
| ------------------------------------------- | ------------------------------------------- |
| `/personality-analysis/Ryan-Gosling`        | `/personality-analysis/ryan-gosling`        |
| `/personality-analysis/Tom-Hiddleston`      | `/personality-analysis/tom-hiddleston`      |
| `/personality-analysis/Hasan-Piker`         | `/personality-analysis/hasan-piker`         |
| `/personality-analysis/Sam-Altman`          | `/personality-analysis/sam-altman`          |
| `/personality-analysis/Dario-Amodei`        | `/personality-analysis/dario-amodei`        |
| `/personality-analysis/Alexis-Bledel`       | `/personality-analysis/alexis-bledel`       |
| `/personality-analysis/Timothee-Chalamet`   | `/personality-analysis/timothee-chalamet`   |
| `/personality-analysis/Sydney-Sweeney`      | `/personality-analysis/sydney-sweeney`      |
| `/personality-analysis/Gavin-Newsom`        | `/personality-analysis/gavin-newsom`        |
| `/personality-analysis/Robert-Pattinson`    | `/personality-analysis/robert-pattinson`    |
| `/personality-analysis/Margot-Robbie`       | `/personality-analysis/margot-robbie`       |
| `/personality-analysis/Sabrina-Carpenter`   | `/personality-analysis/sabrina-carpenter`   |
| `/personality-analysis/John-Coogan`         | `/personality-analysis/john-coogan`         |
| `/personality-analysis/Clavicular`          | `/personality-analysis/clavicular`          |
| `/personality-analysis/Kourtney-Kardashian` | `/personality-analysis/kourtney-kardashian` |

Do not hard-code this list in the fix — implement a generic uppercase-detector redirect that catches all of them plus any future regressions.

---

## 3. The fix (in order)

### Step 1 — Add a server-level 301 redirect for non-canonical slugs

**Where:** `src/routes/personality-analysis/[slug]/+page.server.ts`, before the Supabase query.

**Logic:**

1. Read `event.params.slug`.
2. Compute `canonical = normalizePersonalitySlug(slug)` using the existing utility.
3. If `slug !== canonical`, return a `redirect(301, buildPersonalityAnalysisPath(canonical))`. Use SvelteKit's `redirect` helper from `@sveltejs/kit`, with status code **301** (permanent). Preserve any querystring on `event.url.search`.
4. Otherwise continue to the existing `.ilike()` query.

**Sketch:**

```ts
import { error, redirect } from '@sveltejs/kit';
import {
	buildPersonalityAnalysisPath,
	normalizePersonalitySlug
} from '$lib/utils/personalityAnalysis';

export const load: PageServerLoad = async (event) => {
	const requestedSlug = event.params.slug;
	const canonicalSlug = normalizePersonalitySlug(requestedSlug);

	if (requestedSlug !== canonicalSlug) {
		const target = buildPersonalityAnalysisPath(canonicalSlug) + event.url.search;
		throw redirect(301, target);
	}

	// …existing code
};
```

**Why server-level and not `vercel.json`:** the set of valid personality slugs is DB-driven and changes on publish. A static redirect rule in `vercel.json` would require hard-coding every case pair. The server-level redirect generalizes.

**Side effect to confirm:** the existing `.ilike()` query was relied upon to handle case variants from _legacy internal links_ as well. After this change, any internal `<a href="/personality-analysis/Ryan-Gosling">` will 301 on click. That's correct behavior (we want old internal links to redirect once and settle), but Step 3 below removes them proactively.

### Step 2 — Narrow the `.ilike()` to `.eq()` after canonicalization

Once Step 1 guarantees the incoming slug is lowercase, the `.ilike('person', requestedSlug)` at `+page.server.ts:44` can be tightened to `.eq('person', canonicalSlug)`. This removes case-insensitive lookup as a fallback path and forces the redirect.

**Gotcha:** the DB column `blogs_famous_people.person` may itself still hold title-case values for some rows. Verify before tightening:

```sql
SELECT person FROM blogs_famous_people WHERE person != lower(person);
```

If any rows return, run `scripts/normalize-personality-slugs.js --write` (dry-run first without `--write`) to lowercase them. This script is already built and handles `person`, `suggestions`, and `loc` in one pass.

### Step 3 — Audit and fix internal links

Non-canonical internal links regenerate the split every time they're crawled. Fix them at source.

1. Run `pnpm seo:normalize-internal-personality-links` to rewrite any title-case internal links to lowercase across all content. Check `scripts/normalize-internal-personality-links.js` for scope (probably covers `blogs_famous_people.content` and `suggestions`).
2. Also grep the MDsvex blogs for stragglers:
   ```
   grep -rE "personality-analysis/[A-Z]" src/blog/ --include="*.md"
   ```
   Any matches should be manually rewritten to lowercase. These won't be caught by the DB-focused normalizer.
3. Grep Svelte components for hard-coded title-case references:
   ```
   grep -rE "personality-analysis/[A-Z]" src/lib/ src/routes/ --include="*.svelte" --include="*.ts"
   ```

### Step 4 — Confirm sitemap + structured data

Already correct based on audit — documenting so the agent can verify in one pass, not re-discover:

- **Sitemap** (`static/sitemap.xml`) — 100% lowercase. No action needed. Regenerate anyway via `pnpm gen:sitemap` after any DB normalization to pick up changes.
- **Canonical tag** (`PeopleBlogPageHead.svelte:139`) — renders `canonicalUrl`, which derives from `data.loc` or `buildPersonalityAnalysisUrl()`. Both paths lowercase. No change needed, but verify after Step 1 that `data.loc` in the DB is lowercase for every row (the normalize script covers this).
- **og:url + twitter:url** — same source. Same verification.
- **BreadcrumbList + Article JSON-LD** — same `canonicalUrl` source. Same verification.

### Step 5 — Request re-crawl from Google Search Console

For each of the high-impression title-case URLs in §2:

1. Open GSC → URL Inspection.
2. Paste the title-case URL, confirm it now responds with 301 to the lowercase URL.
3. Click "Request Indexing" on the lowercase canonical.

Prioritize the high-impression pairs first:

- Tom-Hiddleston (4,335 + 458 impressions)
- Sydney-Sweeney (358 + 292)
- Hasan-Piker (877 + 404)
- Ryan-Gosling (709 + 814)
- Sam-Altman (553 + 328)
- Dario-Amodei (194 + 401)
- Alexis-Bledel (357 + 462)
- Timothee-Chalamet (431 + 378)

The lower-impression pairs will auto-consolidate as Googlebot recrawls on its own schedule. Manual reindexing is only worth the effort for the top impression-weighted URLs.

---

## 4. Verification checklist

Before marking this done:

- [ ] `curl -I https://9takes.com/personality-analysis/Ryan-Gosling` returns **HTTP 301** with `Location: /personality-analysis/ryan-gosling`
- [ ] `curl -I https://9takes.com/personality-analysis/ryan-gosling` returns **HTTP 200** (no redirect loop)
- [ ] Querystring preserved: `curl -I "https://9takes.com/personality-analysis/Ryan-Gosling?utm_source=test"` returns `Location: /personality-analysis/ryan-gosling?utm_source=test`
- [ ] 404 cases still 404: `curl -I https://9takes.com/personality-analysis/not-a-real-person` returns 404 (not a redirect to a lowercased 404)
- [ ] All rows in `blogs_famous_people` have `person = lower(person)` (SQL check from Step 2)
- [ ] Grep for `personality-analysis/[A-Z]` across `src/` returns zero matches (excluding comments/docs/this tasker)
- [ ] `static/sitemap.xml` has zero uppercase `/personality-analysis/*` URLs
- [ ] `<link rel="canonical">` renders lowercase on a sampled page (view-source on `/personality-analysis/elon-musk`)
- [ ] `og:url` and `twitter:url` same check
- [ ] GSC re-crawl requested for the 8 high-impression title-case URLs in §3 Step 5

---

## 5. Risks and gotchas

- **Risk: redirect loop.** If `normalizePersonalitySlug()` ever returns a value different from what we compare against, we loop. Mitigated by the explicit `requestedSlug !== canonicalSlug` guard — only redirects when the input is _actually_ non-canonical.
- **Risk: breaking existing title-case internal links.** Those links now 301 instead of 200-ing. This is correct behavior (link equity transfers through 301s, user experience is unchanged) but browsers will briefly show the old URL during the redirect. Not a real issue; noting it to avoid surprise during QA.
- **Risk: DB rows with legacy title-case in the `person` column.** Step 2 covers this. Do not tighten `.ilike()` to `.eq()` until the SQL audit confirms zero uppercase `person` values.
- **Risk: external inbound links pointing to title-case URLs.** These will 301 correctly, so no link-equity loss. Googlebot will follow the 301 on recrawl and consolidate the index entry.
- **Non-risk: trailing-slash variants.** SvelteKit's router handles trailing slashes separately from case. Not in scope for this tasker.
- **Scope guard: only personality-analysis URLs.** This tasker is narrow. Do not extend the redirect logic to `/questions/*`, `/community/*`, or other routes without a separate decision — those routes may intentionally preserve case or have different canonical rules.

---

## 6. Measurement

Before deploying:

- Snapshot current GSC: clicks, impressions, CTR for the 15 affected title-case URLs in §2.
- Snapshot current GSC: same metrics for their lowercase canonical counterparts.
- Record today's date in `docs/development/rabbit-hole-retrofit-tracker.md` under "URL case redirect — baseline."

After 2 weeks:

- Re-snapshot the same URLs. Title-case clicks/impressions should be approaching zero (residual longtail). Lowercase canonical clicks/impressions should be ~sum of the previous pair.
- CTR on lowercase canonicals should be meaningfully higher on average (no longer split).
- Log the result in the tracker.

This dataset also becomes useful context for the rabbit-hole retrofit measurement — we'll want to attribute CTR changes to the right intervention (redirect fix vs. rabbit hole vs. both).

---

## 7. Definition of done

- [x] Server-level 301 redirect implemented in `+page.server.ts` (done 2026-04-17; curl checks pending deploy)
- [x] DB audited — zero uppercase `person` values in `blogs_famous_people` (dry-run of normalize script returned 0 updates)
- [x] Internal links normalized across DB content and MDsvex blogs (normalizer found 0 links to rewrite)
- [ ] Sitemap regenerated and verified clean (already lowercase per audit; `pnpm gen:sitemap` to re-emit after deploy)
- [ ] 8 high-impression title-case URLs submitted to GSC for reindexing
- [ ] Baseline snapshot recorded in tracker; 2-week follow-up scheduled
- [x] Change summarized in the tracker under "URL case redirect — completed" (see §8 and tracker row F)

---

## 8. What was actually done (2026-04-17)

### Code changes

**File:** `src/routes/personality-analysis/[slug]/+page.server.ts`

1. Imported `redirect` from `@sveltejs/kit` and `buildPersonalityAnalysisPath` from `$lib/utils/personalityAnalysis`.
2. Added early-return 301 redirect at the top of `load`:

   ```ts
   const canonicalSlugParam = normalizePersonalitySlug(requestedSlug);
   if (canonicalSlugParam && requestedSlug !== canonicalSlugParam) {
   	throw redirect(301, buildPersonalityAnalysisPath(canonicalSlugParam) + event.url.search);
   }
   ```

   Guarded with truthy `canonicalSlugParam` so an empty/invalid slug falls through to the existing 404 path instead of redirecting to `/personality-analysis` (which would be wrong).

3. Tightened the Supabase query from `.ilike('person', requestedSlug)` to `.eq('person', canonicalSlugParam)`. Safe because the DB audit (below) confirmed zero title-case values in the `person` column.

### Local audits run

| Check                                               | Result                                                                                                                                                                                                                    |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `node scripts/normalize-personality-slugs.js` (dry) | **0 people row updates, 0 comment updates** — DB clean                                                                                                                                                                    |
| `pnpm seo:normalize-internal-personality-links`     | **0 links across 0 files** — MDsvex + calendar clean                                                                                                                                                                      |
| Grep `personality-analysis/[A-Z]` across `src/`     | All matches in `src/blog/people/drafts/**` (excluded by design; local-only, pushed-to-DB content is already normalized) or in `.spec.ts` files deliberately testing title-case → lowercase normalization. Nothing to fix. |
| `svelte-check` on touched file                      | 0 errors                                                                                                                                                                                                                  |
| `pnpm test:unit` for `personalityAnalysis.spec.ts`  | 190 pass. 2 pre-existing failures in unrelated specs (pop-culture, sequences); confirmed pre-existing by stashing the change.                                                                                             |

### Remaining handoff for DJ

1. **Deploy** — redirect only activates in production.
2. **Post-deploy curl verification** (see §4 checklist): `Ryan-Gosling → 301 → ryan-gosling`, lowercase still returns 200, querystring preserved, 404s still 404.
3. **`pnpm gen:sitemap`** — defensive regen; no DB changes expected, but re-emits as a safety net.
4. **GSC re-crawl** for the 8 high-impression title-case URLs in §3 Step 5.
5. **Baseline snapshot** in `docs/development/rabbit-hole-retrofit-tracker.md` under "URL case redirect — baseline"; re-snapshot in 2 weeks.

### Notes on scope boundary

- `src/blog/people/drafts/**` was **not** touched. Drafts are local working files, not served; the DB (source of truth for `/personality-analysis/*`) is already lowercase. The internal-link normalizer explicitly ignores drafts by design, so leaving them as-is preserves DJ's working state. Drafts get normalized on push via `pnpm push:people`, so any title-case in drafts dies on write to DB.
- Two spec files (`personalityAnalysis.spec.ts`, `personBlogParser.spec.ts`) keep title-case string literals as deliberate test inputs for the normalizer — not fixed.
