<!-- docs/taskers/T-24-desktop-cls-template-fix.md -->

# Tasker: Fix the Shared Desktop CLS Regression

**For:** Svelte performance and frontend agent  
**Owner:** DJ  
**Created:** 2026-08-13  
**Status:** Ready  
**Related:** `docs/seo/2026-08-13-free-seo-execution-roadmap.md`, personality-analysis routes and shared layout components

## 0. What and why

Google Search Console reports 187 desktop URLs in `Needs improvement`, with no poor URLs and no good desktop URLs in the affected group. The reported issue is CLS greater than 0.1. The example group uses `/personality-analysis/jordi-hays` and reports group CLS 0.14. Mobile has 187 good URLs, which strongly suggests a shared desktop-only template or loading behavior.

Find the visible source of layout movement, make the smallest shared fix, and verify that the change does not damage mobile or the personality-analysis layout.

## 1. Required reading

1. `CLAUDE.md`
2. `docs/taskers/README.md`
3. `docs/seo/2026-08-13-free-seo-execution-roadmap.md`
4. The personality-analysis route, its layouts, hero, media, ads or embeds, fonts, navigation, and below-fold async components
5. Any existing performance or Lighthouse scripts

Run `git status --short` first. Load the required Svelte skills before analyzing or editing `.svelte` or Svelte module files.

## 2. Reproduce and identify the shifting element

Use a production-like local build and desktop viewport. Capture before evidence with a layout-shift trace, screenshots or video, and the affected DOM nodes. Test `/personality-analysis/jordi-hays` plus at least two other personality pages with meaningfully different content and media.

Inspect likely shared causes:

- images or embeds without reserved dimensions or aspect ratio;
- desktop navigation, consent, banners, or sticky elements inserted after paint;
- font swaps that change heading or body geometry;
- hydration or client-only components that replace server markup;
- late-loading cards, ads, tables of contents, or related content above the fold; and
- responsive CSS that reserves space on mobile but not desktop.

Do not guess from Lighthouse score alone. Name the element and the event that moves it.

## 3. Implement the smallest shared fix

Prefer reserved space, stable dimensions, consistent server and client markup, and font metrics over hiding content. Avoid page-specific patches unless the evidence proves the issue is not shared. Preserve accessibility, responsive behavior, and content order.

## 4. Verification checklist

- [ ] Before evidence identifies the shifting element and trigger.
- [ ] The production-like desktop test is stable across at least three personality pages.
- [ ] Mobile layout and interaction remain correct.
- [ ] Relevant Svelte checks, build, and tests pass.
- [ ] No unrelated files or `lastmod` values are changed.
- [ ] A post-deploy GSC validation plan is recorded, but validation is not claimed before Google remeasures the site.

## 5. Deliverable

Implement the fix and create `docs/seo/2026-08-13-desktop-cls-fix.md` with the root cause, affected shared component, before and after evidence, test URLs, and the date to check field data again.

## Risks and gotchas

GSC field data has a long reporting delay and groups similar URLs. A clean lab test does not instantly clear the GSC issue. Do not remove useful content to improve a score, and do not start a GSC validation request before the fix is deployed.

## Definition of done

The desktop layout-shift source is evidenced and fixed at the correct shared layer, the representative pages remain visually and functionally sound, and the repository checks pass.
