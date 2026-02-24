<!-- docs/performance-audit-2026-02-23.md -->

# 9takes Performance Audit (2026-02-23)

## Executive Summary

- Microsoft Clarity is removed from runtime code paths and no Clarity script references remain in `src/` (verified by code search).
- Removing Clarity is a good tradeoff for your current stack: lower third-party JS, better privacy posture, fewer external calls, and you already have native analytics + Google Search Console.
- Biggest measured win in this pass: `/blog/__data.json` dropped from `275160` bytes to `6062` bytes (`-97.8%`) by returning only needed fields.
- `/blog` HTML response dropped from `699825` bytes to `431378` bytes (`-38.4%`) after data projection.
- Homepage `__data.json` dropped from `7293` bytes to `1420` bytes (`-80.5%`) after trimming unused homepage load data.
- Deploy runtime issue is fixed by explicitly pinning adapter runtime to Node 22.
- Enneagram index loader was moved to server-only load and hardened to avoid metadata crashes.
- Remaining top bottlenecks are heavy admin-only JS libraries, large global CSS, and variable homepage TTFB.

## Scope and Method

- Environment: local dev server (`pnpm dev`) on `http://127.0.0.1:4174`.
- Route checks: `curl` measurements across key pages (status, bytes, TTFB, total).
- Data checks: SvelteKit `__data.json` payload sizes.
- Bundle checks: `pnpm build` output size analysis from `/tmp/build-final2.log` and `/tmp/build-after-pass2.log`.
- Note: full production build now succeeds end-to-end with adapter-vercel after runtime pinning.

## Clarity Removal Decision

- Recommendation: keep Clarity removed.
- Why this is a good idea now:
- You already capture page views and engaged time in-house.
- You keep Google Search Console for index/SEO visibility.
- You eliminate replay/heatmap overhead and reduce third-party data sharing.
- Tradeoff:
- You lose turnkey session replay/heatmaps.
- If you later need replay-style debugging, prefer sampled, short-retention, self-hosted or explicit-consent tooling.

## Changes Applied In This Audit

- `src/routes/blog/+page.server.ts`
- Projected md metadata to card-only fields.
- Changed `blogs_famous_people` query from `select('*')` to `select('person,enneagram')`.
- Result: major `/blog` payload reduction.
- `src/routes/enneagram-corner/+page.server.ts`
- Added safe metadata guards so malformed/non-post modules do not crash route load.
- Kept returned shape (`enneagramBlogs`, `featured`, `recentlyUpdated`).
- `src/routes/enneagram-corner/+page.ts`
- Deleted so this route is server-load driven (prevents duplicative universal load work).
- `src/lib/components/molecules/Header.svelte`
- Changed `AdminMessageReceiver` to dynamic import for authenticated users only, reducing baseline unauthenticated client cost.
- `svelte.config.js`
- Set `adapter({ runtime: 'nodejs22.x' })` so local/build environments do not depend on host Node auto-detection.
- `src/routes/+page.server.ts`
- Removed unused featured people query from homepage load.
- Reduced top-question query from `select('*')` to `select('url,question_formatted,comment_count')`.
- Removed unused `top9Questions` payload from homepage response.
- `src/routes/questions/categories/[slug]/+page.server.ts`
- Reduced `canAskQuestion` query payload from `select('*')` to `select('id')`.
- Reduced category tag fetch to `select('category_name')`.

## Route Snapshot (Post-change, warm)

| Route                                                              | HTML bytes | TTFB (s) | Total (s) |
| ------------------------------------------------------------------ | ---------: | -------: | --------: |
| `/`                                                                |     462552 | 1.3305\* |    1.3312 |
| `/blog`                                                            |     431378 |   0.0913 |    0.0916 |
| `/about`                                                           |     431984 |   0.0793 |    0.0796 |
| `/community/introducing-9takes`                                    |     451747 |   0.0991 |    0.1000 |
| `/enneagram-corner`                                                |     493872 |   0.1000 |    0.1003 |
| `/enneagram-corner/enneagram-wings-complete-guide`                 |     557896 |   0.0853 |    0.0885 |
| `/enneagram-corner/enneagram-vs-personality-frameworks-comparison` |     522548 |   0.1022 |    0.1026 |
| `/personality-analysis`                                            |     464620 |   0.1048 |    0.1052 |
| `/personality-analysis/type/4`                                     |     441764 |   0.1013 |    0.1016 |
| `/questions`                                                       |     631046 |   0.2390 |    0.2397 |
| `/questions/what-are-you-thinking-about-these-days`                |     439145 |   0.5444 |    0.5447 |
| `/book-session`                                                    |     437923 |   0.1073 |    0.1076 |

`*` Homepage TTFB is variable: repeated samples after warmup were `0.267s` and `0.242s`.

### Latest warm sample after runtime + homepage-query pass

| Route                   | HTML bytes | TTFB (s) | Total (s) |
| ----------------------- | ---------: | -------: | --------: |
| `/`                     |     456909 |   0.5222 |    0.5225 |
| `/blog`                 |     431378 |   0.1223 |    0.1226 |
| `/questions`            |     631046 |   0.3688 |    0.3692 |
| `/personality-analysis` |     464620 |   0.1717 |    0.1719 |
| `/enneagram-corner`     |     493872 |   0.2269 |    0.2272 |

## Data Payload Snapshot (`__data.json`)

| Route                                                           | Bytes | TTFB (s) |
| --------------------------------------------------------------- | ----: | -------: |
| `/blog/__data.json`                                             |  6062 |   0.2142 |
| `/__data.json`                                                  |  1420 |   0.4354 |
| `/enneagram-corner/__data.json`                                 | 19401 |   0.0965 |
| `/personality-analysis/__data.json`                             |  4392 |   0.1019 |
| `/personality-analysis/type/4/__data.json`                      |  5726 |   0.2023 |
| `/questions/__data.json`                                        | 35411 |   0.2177 |
| `/questions/what-are-you-thinking-about-these-days/__data.json` |  4242 |   0.5271 |

### Notable before/after deltas measured during this audit cycle

- `/blog/__data.json`: `275160` -> `6062` bytes (`-97.8%`).
- `/blog` HTML: `699825` -> `431378` bytes (`-38.4%`).
- `/__data.json` (home): `7293` -> `1420` bytes (`-80.5%`).

## Bundle Hotspots

### Largest client JS chunks

- `352.36 kB` `jspdf` (`_app/immutable/chunks/BWB6bUV9.js`)
- `201.04 kB` `html2canvas` (`_app/immutable/chunks/DXEQVQnt.js`)
- `179.64 kB` `nodes/30` (route `/admin/marketing`)
- `158.54 kB` `canvg` (`_app/immutable/chunks/BUvDThdZ.js`)
- `130.26 kB` `supabase` (`_app/immutable/chunks/Cbe8ooKb.js`)

### Largest client CSS

- `286.02 kB` (`gzip 40.16 kB`) global app stylesheet: `_app/immutable/assets/app.BMh7YnYj.css`

### Largest server chunk

- `698.83 kB` `src/routes/admin/content-board/+page.server.ts`

## Current Bottlenecks

- Admin toolchain libs (`jspdf/html2canvas/canvg`) are very heavy, even if dynamically loaded.
- Global stylesheet remains large in raw bytes (`286 kB`) and is loaded widely.
- Homepage shows occasional TTFB spikes (likely dynamic server/data path variance).
- Questions pages still render large HTML payloads due rich SSR output volume.

## Prioritized Next Steps

1. Continue loader field projection everywhere.
   Audit remaining `select('*')` and md metadata spreads and trim to render-needed fields only.
2. Split global CSS.
   Move route-specific/admin-only styles out of `app.scss` so non-admin routes avoid loading unused CSS.
3. Keep heavy admin libs strictly interaction-gated.
   Only import poster/export libraries after explicit user action (button click), not on page mount.
4. Reduce SSR volume on questions pages.
   Cap initial category/question blocks and fetch additional groups client-side.
5. Add performance budgets in CI.
   Track max `__data.json` size per route and max initial JS/CSS budgets to catch regressions early.

## Validation Commands Used

- `pnpm dev --host 127.0.0.1 --port 4174`
- `curl` route sweeps (status, size, TTFB, total)
- `curl <route>/__data.json` size checks
- `pnpm build` (adapter step now passes with explicit runtime)
