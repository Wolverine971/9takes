<!-- docs/planning/seo-follow-up-plan-2026-03-27.md -->

# SEO Follow-Up Plan

## Batch 1

- [x] Add `noindex` to low-value auth and utility pages so they do not compete for index coverage.
- [x] Cap newly generated question slugs so fresh question URLs stay readable and avoid future long-URL drift.
- [x] Normalize mixed-case internal `/personality-analysis/...` links in published content and public data files.

## Batch 2

- [x] Drop `WebSite.SearchAction` from the SEO plan because Google no longer supports the sitelinks search box feature.
- [ ] Decide whether a user-facing search results page is still worth building for UX and content discovery.
- [ ] Review remaining account and utility pages for `noindex` coverage where they are still missing.

## Batch 3

- [ ] Split anonymous public article rendering from personalized state so public pages can use CDN HTML caching.
- [ ] Add explicit cache policy for anonymous article traffic (`s-maxage` plus revalidation strategy).
- [ ] Recheck sitemap and crawl outputs after the cache/search changes land.

## Ongoing

- [ ] Run the internal-link normalization script whenever new blog content is added that references personality pages.
- [ ] Keep generated sitemap output lowercase for all personality-analysis URLs.
