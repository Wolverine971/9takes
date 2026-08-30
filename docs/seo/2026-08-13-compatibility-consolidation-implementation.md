<!-- docs/seo/2026-08-13-compatibility-consolidation-implementation.md -->

# Compatibility Guide Retirement Implementation

**Date:** 2026-08-13  
**Decision:** Option C approved by DJ  
**Status:** Implemented and locally verified on `main`; production deployment and live search-index synchronization remain pending

## Production baseline before implementation

The decision capture found both compatibility URLs returning HTTP 200, self-canonical, `index, follow` HTML and appearing in the sitemap. The compatibility guide had no defensible separate search job and exposed unsupported claims about a 457-couple study. The compatibility matrix was the clear search winner.

The full evidence and traffic baseline is preserved in `docs/seo/2026-08-13-compatibility-consolidation-decision.md`.

## Implemented package

1. Set `published: false` on `src/blog/enneagram/enneagram-compatibility-guide.md`.
2. Preserved the guide source file for audit history.
3. Added a permanent redirect from `/enneagram-corner/enneagram-compatibility-guide` to `/enneagram-corner/enneagram-compatibility-matrix` in the existing Enneagram redirect map.
4. Preserved query strings through the existing `url.search` redirect behavior.
5. Repointed the guide link in `enneagram-books-websites-podcasts.md` to the matrix.
6. Removed the copied 457-couple paragraph from `how-to-navigate-early-relationship-stages.md` and replaced it with bounded editorial guidance.
7. Repointed that article's compatibility CTA directly to the matrix.
8. Repointed the Type 2 link in `EnneagramTypeBottom.svelte` to the matrix and narrowed its description to pairing dynamics.
9. Left the matrix article, title, metadata, canonical, publication state, and `lastmod` unchanged.
10. Left the guide's `lastmod` unchanged.

## Derived state

- Regenerated `static/sitemap.xml` through `node scripts/generate-sitemap.js`.
- Sitemap total: 666 URLs.
- The guide is absent from the generated sitemap.
- The matrix remains in the generated sitemap.
- The dry-run blog index proposes three content updates and one stale-row unpublish:
  - `enneagram-books-websites-podcasts`
  - `enneagram-strengths-and-weaknesses`
  - `how-to-navigate-early-relationship-stages`
  - unpublish `enneagram-compatibility-guide`
- No live blog-index write was run because DJ's deployment work was still in progress.

## Verification

- No source-visible internal link to the guide remains outside the redirect map.
- The copied 457-couple claim is gone from the published early-relationship article.
- The withdrawn figures remain only in the unpublished guide source and audit records.
- Local production preview returns one HTTP 301 from the guide to the matrix.
- `?utm_source=t31-check` survives the redirect.
- The redirect destination returns HTTP 200.
- Svelte check: 0 errors and 132 pre-existing warnings.
- Vitest: 145 files and 676 tests passed.
- Vite production compile: 6,246 server modules and 6,304 client modules transformed successfully.
- Full build and runtime-asset budget check passed.
- Target formatting and `git diff --check` passed.

The Svelte autofixer reported the component's existing project-wide pattern of internal `href` values without `resolve()`; it offered no targeted suggestion. This implementation did not broaden into a 36-link component refactor.

## Post-deploy actions

1. Confirm production returns one 301 from the guide to the matrix and preserves query strings.
2. Confirm the matrix remains HTTP 200, self-canonical, and `index, follow`.
3. Confirm the guide is absent from the live sitemap and site search.
4. Run the live blog-index synchronization only after the deployment containing this package is ready.
5. In Search Console, inspect the old guide URL and confirm Google sees the redirect.
6. Monitor the combined guide-and-matrix cluster at 14 days, 28 days, and with a clean 28-day comparison.
