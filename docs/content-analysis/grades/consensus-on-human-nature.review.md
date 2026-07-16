<!-- docs/content-analysis/grades/consensus-on-human-nature.review.md -->

# Grade feedback: Consensus on Human Nature

Extracted from `src/blog/community/consensus-on-human-nature.md` on 2026-07-15 before removing the feedback from public page source.

Grade: B+ (8.7), rubric v2, adapted for an idea essay
Evidence: 9 | Originality: 8.5 | Discoverability: 9 | Enneagram: 8 | Writing: 9 | Hook: 8

This is a community idea-essay, not a celebrity personality blog. Person-specific dimensions (Hook-on-a-moment, Enneagram emotional-interior check) were adapted to the essay form. The `content_quality` block is inert for community blogs (the JSONB column lives on `blogs_famous_people`); it is recorded here as a quality marker only.

## Elevation pass from 2026-06-14

Research-backed upgrade from B (8.0) to B+ (8.7).

### Discoverability 7 to 9

- Added `meta_title` ("The 3 Parts of Human Nature: Plato to the Enneagram", 51 chars) — front-loads the head term while the H1 keeps the editorial title. BlogPageHead consumes meta_title for `<title>`.
- Replaced the hand-rolled BlogPosting JSON-LD (a duplicate because BlogPageHead.svelte already emits BlogPosting + BreadcrumbList for every community post) with FAQPage structured data (8 Q&As on real search queries), mirrored by a visible "## Frequently asked questions" section.
- Added a search-intent H2 + extractable answer block ("The three dimensions of human nature: thinking, feeling, and instinct") right after the thesis.
- Keyword-echoed 3 editorial H2s (Hume / Kahneman / the four-tradition convergence) without losing the voice line. Updated description to lead with "thinking, feeling, instinct" + a curiosity hook.

### Evidence 8 to 9

- FIXED a likely fabrication: the "blue pen vs. black pen" deliberation is not in Descartes' Error; replaced with Damasio's verified appointment-date anecdote.
- Added 3 verbatim, sourced quotes at the marquee moments: Damasio's "I never saw a tinge of emotion..." and "reduction in emotion may constitute an equally important source of irrational behavior," plus Pinker's own instrumental definition ("a kit of cognitive tools") — which turns Pinker into a witness for the thesis.
- Hedged two contested claims: attributed Pinker's "decline in violence" to him (Taleb/historians dispute it); flagged spirit->superego as the looser of the three Plato/Freud mappings.

### System integration

6 new contextual outbound links (mbti-vs-enneagram, software-and-hardware-of-the-mind, overthinking/head, oversharing/heart, instinctual-subtypes/gut, enneagram-tldr) + 3 bidirectional backlinks added from philosophy-psychology-and-the-enneagram, enneagram-concepts, and mbti-vs-enneagram.

## Why it remains below A

Enneagram Integration is 8 (idea-essay — names the alarms fear/shame/anger but renders no single person's felt interior, which is correct for the genre, not a flaw to fix). Hook 8 and Originality 8.5 are the remaining ceiling; the core synthesis is unchanged, just better sourced. To push toward A would mean a sharper single-sentence thesis up top and one more genuinely novel turn — optional, not needed for publication.
