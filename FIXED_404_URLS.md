# Fixed 404 URLs in Codebase

## Summary
Fixed all broken URL references directly in the source files rather than using redirects.

## URLs Fixed

### 1. In `/src/blog/pop-culture/dark-triad-meets-enneagram.md`
- Fixed: `/enneagram-corner/manipulation-tactics-by-type` → `/pop-culture/dark-triad-meets-enneagram`
- Fixed: `/enneagram-corner/narcissism-enneagram` → `/pop-culture/dark-triad-meets-enneagram`

### 2. In `/src/blog/enneagram/mental-health/enneagram-anxiety-complete-guide.md`
- Removed broken link: `/enneagram-corner/mental-health/enneagram-social-anxiety-guide`
- Removed broken link: `/enneagram-corner/mental-health/enneagram-generalized-anxiety-guide`
- Removed broken link: `/enneagram-corner/mental-health/enneagram-emotional-regulation-guide`
- Removed broken link: `/enneagram-corner/mental-health/enneagram-perfectionism-guide`
- Fixed: `/enneagram-corner/mental-health/enneagram-depression-guide` → `/enneagram-corner/depression-patterns-by-enneagram-type`

### 3. In `/src/blog/enneagram/enneagram-anxiety-management-guide.md`
- Fixed: `/enneagram-corner/enneagram-trauma-response` → `/enneagram-corner/mental-health/enneagram-trauma-response-guide`
- Fixed: `/enneagram-corner/enneagram-relationship-dynamics` → `/enneagram-corner/enneagram-types-in-relationships`

### 4. In `/static/sitemap.xml`
- Fixed: `https://9takes.com/guides/dating-dynamics-by-enneagram-type` → `https://9takes.com/how-to-guides/dating-dynamics-by-enneagram-type`

## Notes

All broken URLs have been fixed at the source. The URLs now point to:
- Existing content that is most relevant
- The correct paths where the content actually lives

No redirects were needed since we fixed the references directly in the files where they occur.