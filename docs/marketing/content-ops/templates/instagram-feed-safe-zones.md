<!-- docs/marketing/content-ops/templates/instagram-feed-safe-zones.md -->

# Instagram Feed Carousel Safe Zones

Use this contract for static 9takes feed carousels intended for direct upload to Instagram.

## Primary canvas

- Export every slide at **1080×1440 (3:4)**. Instagram added native 3:4 support for single-image and carousel posts in May 2025, and Meta's current resolution guidance accepts images up to 3:4 at 1080 px wide.
- Keep every slide in a carousel at the same aspect ratio.
- Use PNG for type-heavy graphics.

## 9takes organic-feed safe area

On a 1080×1440 canvas:

- Left/right critical-content margin: **72 px**.
- Top critical-content margin: **88 px**.
- Bottom critical-content margin: **128 px**.
- Reserve the top-right **136 px** beyond the normal margin for Instagram's carousel counter/icon. Do not put a title, type label, or source there.
- Keep CTAs and concluding questions at least **174 px** above the bottom edge.
- Treat the outer zone as atmosphere only: background, portrait bleed, texture, and nonessential framing may extend into it.

These are conservative 9takes authoring margins, not pixel measurements published by Meta. Instagram UI varies by device, account, and experiment.

## Compatibility export

If a third-party scheduler rejects 3:4, export a separate **1080×1350 (4:5)** version. Do not ask Instagram or the scheduler to crop the 3:4 master automatically. Reflow the design and preserve the same 72 px side margin, 88 px top margin, top-right counter reserve, and at least 128 px below critical content.

## QA

Before approval:

1. Inspect the complete 3:4 image at phone size.
2. Confirm the top-right counter area contains no critical text.
3. Confirm headings and footers sit inside the safe area.
4. Confirm all slides share identical dimensions.
5. Preview the cover in the vertical profile grid.
6. If the post may be boosted, make a separate ad-safe version because paid CTA overlays can occupy more of the bottom edge.

## Platform references

- [Meta: Instagram photo resolution and supported aspect ratios](https://www.facebook.com/help/1631821640426723/)
- [Instagram carousel help](https://www.facebook.com/help/instagram/269314186824048)
- [Instagram's 3:4 support announcement, reported from Adam Mosseri's Threads post](https://9to5mac.com/2025/05/29/instagram-changes-standard-photo-aspect-ratio/)
