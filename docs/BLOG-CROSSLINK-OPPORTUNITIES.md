# Blog Crosslink Opportunities

_Generated: 2026-01-18_
_Source: `docs/BLOG-CROSSLINK-INDEX.md`_

## What’s Missing

- Per `docs/BLOG-CROSSLINK-INDEX.md:1`: 0 isolated posts and 0 posts with 0 outgoing links (baseline internal crosslinking is in good shape).
- The remaining “0 incoming” list is only the nine Enneagram type pages; this is expected because the report intentionally excludes type pages from link counts.
- `src/blog/life-situations/before-your-next-fight.md:1` was an outline/draft and is now marked `published: false`, so it’s excluded from the report.

## Report Caveats

- `scripts/generate-crosslink-report.js:1` counts relative links and same-domain `https://9takes.com/...` links, and recognizes `/pop-culture` and `/life-situations`.
- Type pages (enneagram-type-1 through 9) are excluded from link counting, so they’ll naturally appear under “0 incoming”.

## Crosslink Opportunities

Spread links out and keep them natural: aim for ~1 new link per source post (avoid piling too many internal links into one blog update).

- [x] `src/blog/guides/productivity-systems-by-enneagram-type.md:1` (0 incoming): link in from `src/blog/enneagram/enneagram-types-and-career-choices.md:1`, `src/blog/enneagram/how-each-enneagram-type-self-sabotages-success.md:1`, and `src/blog/enneagram/mental-health/enneagram-workplace-mental-health.md:1` → `/how-to-guides/productivity-systems-by-enneagram-type`.
- [x] `src/blog/enneagram/enneagram-types-and-career-choices.md:1` (0 incoming): link in from `src/blog/guides/productivity-systems-by-enneagram-type.md:1` and `src/blog/enneagram/mental-health/enneagram-workplace-mental-health.md:1` → `/enneagram-corner/enneagram-types-and-career-choices`.
- [x] `src/blog/enneagram/enneagram-parenting-styles.md:1` (0 incoming): link in from `src/blog/enneagram/mental-health/enneagram-parenting-mental-health.md:1` (kids’ patterns → parent’s pattern) and `src/blog/guides/the-crash-course-on-emotions-that-we-missed-in-kindergarten.md:1` (emotional education/childhood → parenting autopilot) → `/enneagram-corner/enneagram-parenting-styles`.
- [x] `src/blog/guides/the-crash-course-on-emotions-that-we-missed-in-kindergarten.md:1` (0 incoming): link in from `src/blog/community/mbti-vs-enneagram.md:1` (the “schools teach emotional literacy” moment) and `src/blog/guides/ultimate-guide-to-active-listening.md:1` → `/how-to-guides/the-crash-course-on-emotions-that-we-missed-in-kindergarten`.
- [x] `src/blog/enneagram/oversharing-psychology-shame-boundaries.md:1` (0 incoming): link in from `src/blog/enneagram/enneagram-communication-styles.md:1` (boundaries / “too much” framing) and `src/blog/guides/ultimate-guide-to-active-listening.md:1` (consent + boundaries) → `/enneagram-corner/oversharing-psychology-shame-boundaries`.
- [x] `src/blog/community/why-im-selective-sharing-enneagram.md:1` (0 incoming): link in from `src/blog/enneagram/enneagram-types-at-party.md:1` (typing people at parties) and `src/blog/enneagram/oversharing-psychology-shame-boundaries.md:1` (oversharing vs vulnerability) → `/community/why-im-selective-sharing-enneagram`.
- [x] `src/blog/community/mbti-vs-enneagram.md:1` (0 incoming): link in from `src/blog/enneagram/enneagram-vs-meyers-briggs.md:1`, `src/blog/enneagram/enneagram-faqs.md:1`, and `src/blog/enneagram/enneagram-test-comparison-2025.md:1` → `/community/mbti-vs-enneagram`.
- [x] `src/blog/enneagram/enneagram-influences.md:1` (0 incoming in report): swap the existing `https://9takes.com/...` link in `src/blog/enneagram/enneagram-concepts.md:1` to `/enneagram-corner/enneagram-influences`, and add a link from `src/blog/enneagram/enneagram-and-religion.md:1` → `/enneagram-corner/enneagram-influences`.
- [x] `src/blog/enneagram/situations-change-emotions-dont.md:1` (0 incoming): link in from `src/blog/enneagram/enneagram-stress-number.md:1` (same “trigger changes, pattern doesn’t” point) and optionally `src/blog/enneagram/mental-health/enneagram-workplace-mental-health.md:1` → `/enneagram-corner/situations-change-emotions-dont`.
- [x] `src/blog/community/memetic-comments.md:1` (0 incoming): link in from `src/blog/community/introducing-9takes.md:1` (first comments set the frame) and `src/blog/community/reddit-deep-connections-limitations.md:1` (echo chamber section) → `/community/memetic-comments`.
- [x] `src/blog/community/what-winning-online-arguments-looks-like.md:1` (0 incoming): link in from `src/blog/community/memetic-comments.md:1` (mimesis/priming → why “winning” fails) and `src/blog/community/reddit-deep-connections-limitations.md:1` → `/community/what-winning-online-arguments-looks-like`.
- [x] `src/blog/community/consensus-on-human-nature.md:1` (0 incoming): link in from `src/blog/community/software-and-hardware-of-the-mind.md:1` and `src/blog/community/why-the-greek-vibe.md:1` → `/community/consensus-on-human-nature`.
- [x] `src/blog/community/why-the-greek-vibe.md:1` (0 incoming): link in from `src/blog/community/introducing-9takes.md:1` and `src/blog/community/inspiration-for-9takes.md:1` → `/community/why-the-greek-vibe`.
- [x] `src/blog/pop-culture/reddit-moderators-type-1-internet.md:1` (0 incoming): link in from `src/blog/community/reddit-deep-connections-limitations.md:1` and `src/blog/community/memetic-comments.md:1` → `/pop-culture/reddit-moderators-type-1-internet`.
- [x] 0-outgoing fixes: add 3–5 in-body links in `src/blog/enneagram/enneagram-concepts.md:1` and `src/blog/enneagram/enneagram-instinctual-subtypes.md:1` using relative URLs (so they’re counted), pointing to hubs like `/enneagram-corner/enneagram-tldr`, `/enneagram-corner/beginners-guide-to-determining-your-enneagram-type`, `/enneagram-corner/enneagram-wings-complete-guide`, `/enneagram-corner/enneagram-stress-number`.

## Next Step

- Re-run `node scripts/generate-crosslink-report.js` after future blog edits to surface new “0 outgoing” / “0 incoming” candidates.
