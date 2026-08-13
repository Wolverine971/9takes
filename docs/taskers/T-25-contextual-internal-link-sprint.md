<!-- docs/taskers/T-25-contextual-internal-link-sprint.md -->

# Tasker: Ship a Contextual Internal-Link Sprint

**For:** SEO content and information-architecture agent  
**Owner:** DJ  
**Created:** 2026-08-13  
**Status:** Ready, coordinate targets with T-23  
**Related:** `docs/seo/2026-08-13-free-seo-execution-roadmap.md`, `docs/BLOG-CROSSLINK-INDEX.md`, `docs/taskers/T-23-seo-indexation-recovery.md`, `docs/taskers/T-05-compatibility-matrix-ctr-fix.md`

## 0. What and why

The site has 10,541 internal links, but the top recipients are dominated by global navigation and hubs. Ahrefs found contextual opportunities where relevant source pages mention concepts without linking to the strongest target.

The clearest cluster points to `/personality-analysis/type/5`, with an estimated position near 14 for `type 5`, volume 2.5K, and KD 7. Suggested sources include Enneagram concept articles and relevant public-figure analyses. Another high-value opportunity connects the astrology article's phrase `enneagram pairings` to the compatibility matrix, which already has verified GSC demand for `enneagram compatibility chart`.

Add useful in-context links in a bounded batch. The links must help readers, use natural anchors, and avoid targets that T-23 recommends merging or excluding.

## 1. Required reading

1. `CLAUDE.md`
2. `docs/taskers/README.md`
3. `docs/seo/2026-08-13-free-seo-execution-roadmap.md`
4. `docs/taskers/T-23-seo-indexation-recovery.md` and any available disposition output
5. `docs/taskers/T-05-compatibility-matrix-ctr-fix.md`
6. `docs/BLOG-CROSSLINK-INDEX.md`
7. Existing link-checking and content-generation code

Run `git status --short` first. Never modify `lastmod` frontmatter.

## 2. Build and score the opportunity list

Recreate or export the free Ahrefs Internal Link Opportunities list where possible, then supplement it from the repository. Score candidates on:

- target search demand and current GSC position;
- source and target semantic fit;
- whether the sentence genuinely benefits from the link;
- target indexability and T-23 disposition;
- existing contextual inlinks to the target; and
- anchor diversity without forced keyword variation.

Start with the Type 5 hub and compatibility matrix, then identify the next small cluster. Do not treat every celebrity mention of Type 5 as permission to add a link. Prefer explanatory sentences where the link answers the reader's likely next question.

## 3. Implement a bounded first batch

Add a small, reviewable batch across distinct source types. Preserve the author's voice and surrounding meaning. Do not add links inside quotes, structured data, headings solely for SEO, or sentences where the anchor is ambiguous. Do not create sitewide footer links.

Record source URL, target URL, anchor, rationale, and whether the source is indexed. If sources are database-generated, change the canonical source through the established workflow rather than editing generated files blindly.

## Verification checklist

- [ ] Every target is indexable, canonical, and approved by T-23 or independently verified.
- [ ] Every link is contextually useful when read in its full paragraph.
- [ ] No source receives duplicate links to the same target without a reader reason.
- [ ] Internal links resolve locally and after build.
- [ ] Content checks pass and no `lastmod` field changes.
- [ ] The batch is small enough for human review.

## Deliverable

Create `docs/seo/2026-08-13-contextual-internal-link-sprint.md` with the scored backlog, the implemented batch, rejected suggestions, and a 28-day GSC measurement plan for the primary targets.

## Risks and gotchas

Ahrefs suggestions are lexical and can be awkward. Excessive repeated exact-match anchors look mechanical and make the site worse. Global navigation totals do not prove contextual authority. The compatibility target remains subject to T-05's evidence constraints.

## Definition of done

A high-confidence contextual-link batch is implemented and verified, the rest of the opportunity list is ranked, and every change has a reader-centered rationale.
