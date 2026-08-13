<!-- docs/seo/2026-08-13-indexation-recovery-first-batch.md -->
# Indexation Recovery First Batch Change Log

**Date:** 2026-08-13  
**Scope:** One reversible sitemap-submission cleanup  
**Disposition inventory:** [`docs/seo/data/2026-08-13-indexation-recovery-inventory.csv`](data/2026-08-13-indexation-recovery-inventory.csv)

## Implemented

- Removed the static `https://9takes.com/questions/categories` entry from `buildStaticPages()` in `scripts/generate-sitemap.js`.
- Removed the now-unused route-date plumbing for that one static entry.
- Added a focused regression test proving that the browse-only index is absent from static sitemap entries.
- Left all 22 current dynamic `/questions/categories/[slug]` sitemap entries unchanged.
- Left the live route, navigation, robots directive, canonical, publication state, and content unchanged.

## Evidence

The URL was part of the submitted GSC exclusion inventory but is a browse utility rather than a search landing page. It has no measured 98-day GSC demand, no GSC-reported external incoming links, and no distinct query intent that justifies sitemap submission. It remains accessible to users and crawlers through internal navigation.

This batch changes future sitemap output only. It does not delete, redirect, reslug, merge, publish, or noindex anything.

## Protected work

`static/sitemap.xml` already contained staged changes from another workstream. T-23 did not regenerate or overwrite that file. The generated artifact will reflect this source change only when the owning workstream or deployment process next performs a coordinated sitemap generation.

## Verification

Closeout checks:

```sh
pnpm exec vitest run src/lib/server/generateSitemap.spec.ts
pnpm check
git diff --check
```

Results:

- Focused sitemap suite: 1 test file and 4 tests passed.
- Project check: 0 errors and 132 existing warnings across the repository.
- Diff whitespace check: passed.
- Isolated production-data sitemap generation: completed with 667 URLs.
- Generated `<loc>` validation: 667 unique URLs, 0 duplicates, `/questions/categories` absent, and all 22 current dynamic question-category URLs present.

Full sitemap generation was run in an isolated copy using the current repository and production data. The output:

- completed successfully;
- contained no duplicate `<loc>` values;
- omitted `/questions/categories`;
- preserved the dynamic question-category URLs; and
- left the shared working tree's `static/sitemap.xml` byte-for-byte untouched by T-23.

## Deployment and measurement

No deployment or GSC validation request is part of this batch. After deployment, check the live sitemap on 2026-08-27. Use 2026-09-10 as the primary GSC comparison date, comparing 2026-08-12 through 2026-09-08 with the baseline 2026-07-15 through 2026-08-11.
