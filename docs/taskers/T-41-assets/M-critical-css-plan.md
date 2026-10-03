<!-- docs/taskers/T-41-assets/M-critical-css-plan.md -->

# T-41 item M: Critical CSS plan (proposal, not implemented)

**Status:** Proposal for DJ, 2026-10-03. No code changed.
**Measured with:** `docs/taskers/T-41-assets/lcp-probe.cjs` against production (412 px, 150 ms RTT, 1.6 Mbps, 4x CPU, analytics blocked, median of 5 loads).

## The recommendation in one paragraph

Critical CSS is not the biggest LCP lever on the top post. **The hero image is.** On every MDsvex blog post (Enneagram Corner, mental health, community, how-to, pop culture) the hero `PopCard` renders with `loading="lazy"`, so the browser cannot even request the LCP image until CSS has loaded and layout has run. Making that one image eager and high priority took the top post's LCP from **5.2 s to 2.4 s** in the probe, with no CSS change at all. Ship that first (a one-prop change in five route files), then the two cheap CSS fixes below, then re-measure. Full critical CSS (inline the first screen, load the rest later) mainly speeds up **when the page first appears** (FCP: about 1.5 s sooner on both page types), but it fights the site's CSP and the ISR setup, so it should come last and only if the cheaper steps leave LCP above 2.5 s.

## What we measured

| Page                                             | Variant                                 |   FCP |       LCP | Notes                                                                       |
| ------------------------------------------------ | --------------------------------------- | ----: | --------: | --------------------------------------------------------------------------- |
| `/enneagram-corner/enneagram-and-mental-illness` | As served                               | 2.7 s | **5.2 s** | LCP element: hero image. Its request starts at 2.7 s, after CSS and layout. |
|                                                  | All CSS free (ceiling for any CSS work) | 1.1 s |     3.4 s | Image still starts late (1.1 s) because it is lazy.                         |
|                                                  | Hero eager + preload, CSS unchanged     | 2.4 s | **2.4 s** | Image request starts at 0.45 s.                                             |
|                                                  | Both                                    | 0.8 s |     3.0 s | Within run-to-run noise of hero-only: CSS and image share the bandwidth.    |
| `/personality-analysis/zendaya`                  | As served                               | 2.9 s | **3.0 s** | Portrait is already eager, preloaded, high priority. Paint waits on CSS.    |
|                                                  | All CSS free                            | 1.4 s |     2.3 s |                                                                             |
|                                                  | All fonts free                          | 2.2 s |     2.2 s | Font downloads compete with CSS for the same thin pipe.                     |

The tasker's 5.1 s for personality pages came from a different lab run (Lighthouse's simulated throttling). This probe gives about 3.0 s. Use one harness for before and after, never mix the two.

### Render-blocking CSS per page (production, 2026-10-03)

| Page               | Stylesheets | Raw    | Compressed |
| ------------------ | ----------: | ------ | ---------- |
| Top Enneagram post |          30 | 283 KB | 71 KB      |
| Zendaya            |          17 | 280 KB | 67 KB      |
| Homepage           |           7 | 194 KB | 46 KB      |

Correction to the tasker: `blog.css` (34 KB raw, 6 KB compressed) is **not** on every page. `TableOfContents.svelte` imports it, so it loads on blog posts and personality pages, not the homepage.

### What is in the 147 KB root stylesheet (`0.*.css`, 36 KB compressed)

| Slice                                                     | Raw   | Compressed (approx.) | Where it comes from                                                                                                                                                                                                                                                           |
| --------------------------------------------------------- | ----- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@font-face`, including **inlined base64 fonts**          | 25 KB | **~13 KB (37%)**     | Vite's 4 KB `assetsInlineLimit` inlines six JetBrains Mono subsets (Cyrillic-ext, Vietnamese) as base64. Nobody reading 9takes needs those glyphs, and base64 does not compress. Plus 19 `@font-face` rules for Greek, Cyrillic and Vietnamese subsets and `.woff` fallbacks. |
| Header, nav, footer, search, toast and other custom rules | 38 KB | ~6 KB                | `src/scss/index.scss`, `components.scss`, Flowbite component bits                                                                                                                                                                                                             |
| Tailwind utilities                                        | 34 KB | ~5.5 KB              | `content` glob scans all of `src/`, so admin-only utilities ship to every reader                                                                                                                                                                                              |
| Element and base rules                                    | 20 KB | ~4.5 KB              | Tailwind preflight, Flowbite forms plugin base                                                                                                                                                                                                                                |
| `.prose` (Tailwind typography)                            | 26 KB | ~2.5 KB              | Used only on blog templates, shipped to every page including the homepage                                                                                                                                                                                                     |
| Dark mode overrides                                       | 3 KB  | ~0.5 KB              |                                                                                                                                                                                                                                                                               |

Fonts downloaded per page: Inter latin (48 KB) plus one or two JetBrains Mono weights (21 to 22 KB each). None are preloaded; the browser finds them only after the root stylesheet arrives.

## Options, ranked by gain per hour

| #   | Change                                                                                                                                                                                                                                    | Expected user-visible gain                                                                                                                   | Effort      | Risk                                                                                                         |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------ |
| 0   | **Hero image priority** (not CSS). Pass `priority` (already supported by `PopCard.svelte`) to the hero `PopCard` in the five MDsvex `[slug]/+page.svelte` routes. Optionally add a `<link rel="preload" as="image">` in the post head.    | **LCP 5.2 s to about 2.4 s** on the top post (measured). Same pattern on every post with a `pic` and no dossier.                             | 30 min      | Low. Does not touch the frozen `.md` file. Check posts whose hero sits below a dossier stay lazy.            |
| 1   | **Stop inlining fonts into the root stylesheet.** Set `build.assetsInlineLimit` to a function that returns `false` for `.woff`/`.woff2`, and import latin-only Fontsource files (for example `@fontsource/jetbrains-mono/latin-400.css`). | Root CSS drops about 13 KB compressed (about 37%) on **every page**. Roughly 70 to 100 ms sooner first paint on slow 4G.                     | 1 hr        | Cyrillic or Vietnamese text would fall back to a system font. Near zero for this audience.                   |
| 2   | **Font diet (design call, DJ).** Keep Inter, but either drop JetBrains Mono for system `ui-monospace`, or keep only the one weight that matters, and preload Inter latin.                                                                 | Up to about 0.2 to 0.4 s on personality pages (removing all font cost moved LCP 3.0 s to 2.2 s, so the mono share is part of that).          | 1 hr        | Typography is locked in `design-system.md` section 6. Mono labels would look different. Your veto.           |
| 3   | **Item L** (already in T-41): compile components embedded in posts with injected CSS.                                                                                                                                                     | Top post goes from 30 to about 15 sheets, about 10 KB compressed off the critical path.                                                      | 0.5 day     | Needs the full-corpus diff below. A spot check missed about 15 regressions last time.                        |
| 4   | **Trim the root sheet:** move `.prose` into a blog-only stylesheet; split `.blog-evidence` out of `blog.css` (personality only).                                                                                                          | About 3 to 4 KB compressed off non-blog pages and posts. Tens of milliseconds.                                                               | 0.5 day     | Tailwind 3 builds one utility layer; splitting typography needs a second entry. Low value; skip unless free. |
| 5   | **True critical CSS:** inline the first-screen rules per template (header, article column, hero, portrait), load the remaining sheets without blocking render.                                                                            | Ceiling measured: **FCP about 1.5 s sooner** on both templates; LCP 3.0 s to 2.3 s on personality pages; little extra on posts after step 0. | 2 to 3 days | High. See below.                                                                                             |

### Why step 5 is hard here

- **CSP blocks the usual trick.** The standard non-blocking pattern is `<link media="print" onload="this.media='all'">`. Our CSP sets `script-src-attr 'none'`, so the `onload` attribute never runs and the styles would never apply. We would need a small hashed inline script (CSP `mode: 'hash'` already supports this) that flips the links, plus `<noscript>` fallbacks.
- **Personality pages are ISR, not prerendered.** Build-time tools (Beasties, formerly Critters) only process static HTML, so they would never see the 450 celebrity pages. The options are a hand-maintained critical file per template, or extracting critical rules at render time inside `transformPageChunk` (costs CPU once per ISR render, then cached).
- **Cascade order.** `src/lib/server/injectedStyleOrder.ts` moves each post's injected `<style>` to the end of `<head>` so it beats `blog.css` at equal specificity. Async links keep their position in the DOM, so the final cascade holds, but between first paint and the swap, post styles apply without the base sheets. That is a visible flash on every post unless the critical slice covers those rules.
- **Client-side navigation and hydration.** SvelteKit adds route CSS on navigation; the critical slice must not duplicate or reorder those.

## Recommended sequence

1. Step 0 (hero priority). Re-run the probe on five post types.
2. Step 1 (fonts out of the root sheet).
3. DJ decides step 2 (mono font).
4. Item L.
5. Re-measure. **Decision gate:** if posts and personality pages are at or under 2.5 s LCP in the probe, skip step 5 and close M. If not, prototype step 5 on the personality template only (biggest remaining gap, one template), behind a flag.

## Verification (required for any CSS change)

1. **Full-corpus computed-style diff** with `docs/taskers/T-41-assets/visual-diff/`: every published MDsvex post plus all published personality pages (pull slugs from `blogs_famous_people where published`), at 412 px and 1280 px, JavaScript off (`strict-all.mjs`) and on (`compare.mjs`). Baseline build on port 4181, candidate on 4182. Pass bar: 0 differing properties, or every difference explained in writing.
2. **Mid-load check for step 5 only:** a screenshot at first paint with CSS throttled, compared to the final render, on 20 pages per template. The strict diff only checks the final state, so it cannot catch a flash.
3. **Probe before and after** (`lcp-probe.cjs`) on the top post, Zendaya, the homepage, one how-to guide and one pop-culture post. Report medians of 5 and the LCP element.
4. `pnpm build` must pass `check:server-runtime`.
5. Field check two weeks later: LCP and CLS from the in-house web-vitals data, mobile only, against the two weeks before.
