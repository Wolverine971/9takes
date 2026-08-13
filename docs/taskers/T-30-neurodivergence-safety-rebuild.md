<!-- docs/taskers/T-30-neurodivergence-safety-rebuild.md -->

# Tasker: Rebuild the Enneagram and Neurodivergence Guide Safely

**For:** Medical-safety research and editorial agent  
**Owner:** DJ  
**Created:** 2026-08-13  
**Status:** Ready for careful implementation  
**Related:** `docs/content-analysis/2026-07-15_enneagram-blog-audit.md`, `docs/taskers/T-03-quality-frontmatter-is-not-a-gate.md`, `docs/taskers/T-08-enneagram-and-autism-blog.md`, `src/blog/enneagram/mental-health/enneagram-neurodivergence-guide.md`

## 0. What and why

The neurodivergence guide is an important search asset and a safety-sensitive page. It previously earned 141 clicks in the older audit window, then declined by 14 clicks in the latest 28-day comparison while average position stayed roughly flat. Its current body is a large, repetitive type-by-condition grid with many statements that can blur personality interpretation, clinical presentation, accommodations, and medical advice.

The rebuild must preserve the page, URL, search intent, and useful distinction between motivation and neurological processing. It must make the clinical boundary unmistakable, remove unsupported type-condition mappings, and give readers safer ways to use personality language without diagnosing themselves or others.

This page must remain published. Do not merge it with the ADHD article or the autism draft, and do not reverse the established redirect into the mental-health subdirectory.

## 1. Required reading

1. `CLAUDE.md`
2. `docs/taskers/README.md`
3. `docs/content-analysis/2026-07-15_enneagram-blog-audit.md`
4. `docs/content-analysis/enneagram-blog-quality-review.md`
5. `docs/taskers/T-03-quality-frontmatter-is-not-a-gate.md`
6. `docs/taskers/T-07-merge-and-301-consolidation-plan.md`
7. `docs/taskers/T-08-enneagram-and-autism-blog.md`
8. `docs/taskers/T-12-strategic-question-cta.md`
9. The complete current neurodivergence guide and its review/meta sidecars
10. Fresh GSC query, page, country, and device rows for the canonical URL

Run `git status --short` first. Never modify `lastmod`. Do not unpublish the page.

## 2. Mandatory current-source research

Because this is medical and disability-adjacent content, browse current authoritative sources before editing. Prefer:

- official clinical or public-health guidance;
- primary diagnostic manuals or the official bodies that publish them;
- peer-reviewed primary or systematic research when a specific factual claim requires it;
- official employment-disclosure and accommodation guidance for the relevant jurisdiction; and
- first-person disability-led sources for language and lived-experience framing, clearly separated from clinical evidence.

Verify the current status and meaning of ADHD, autism, dyslexia, developmental coordination disorder or dyspraxia, sensory processing differences, twice exceptionality, masking, executive dysfunction, and rejection sensitivity. State clearly when a term such as RSD is community shorthand rather than a formal diagnosis.

Do not use generic SEO health sites, unsourced summaries, or AI-generated explanations as evidence.

## 3. Claim-by-claim safety audit

Audit the body, QuickAnswer, disclaimer, FAQs, structured data, related-content links, and frontmatter for:

- statements that imply an Enneagram type causes, predicts, masks, or intensifies a diagnosis;
- advice about medication, formal evaluation, disclosure, accommodations, or treatment;
- stereotypes about autistic empathy, social understanding, sensory needs, or rigidity;
- ADHD claims that conflate motivation with executive functioning;
- condition labels that are outdated, overly broad, or not diagnoses;
- type-specific strategies presented as clinically supported; and
- legal or workplace advice without current official sourcing.

Classify each claim as clinically supported, carefully bounded editorial hypothesis, lived-experience framing, or remove.

## 4. Rebuild contract

Make the motivation-versus-processing distinction load-bearing near the top:

- The Enneagram is a non-clinical personality framework about interpreted motives and coping patterns.
- Neurodevelopmental conditions concern development and patterns of functioning assessed through clinical criteria and lived impairment or support needs.
- Similar outward behavior can arise from very different mechanisms.
- An Enneagram interpretation cannot diagnose, rule out, or explain away a neurodevelopmental condition.

Replace the repetitive 24-cell certainty with a smaller, safer framework. It may include examples of questions a reader can ask, but it must not imply that each type has a known ADHD, autism, dyslexia, or sensory profile. Practical suggestions should be framed as options to discuss, test, or adapt, not prescriptions.

Preserve genuinely useful reader navigation and existing high-value anchors where feasible. Remove or replace links to unsafe neighboring content if their advice would undermine this rebuild.

Do not edit the separate ADHD page, autism draft, frozen mental-illness page, redirects, or other mental-health articles in this task.

## 5. Metadata and quality fields

Keep the canonical URL, slug, publication state, and `lastmod` unchanged. Do not treat the old `quality_safety_gate` value as a publication switch. Leave quality metadata untouched unless the current repository workflow produces a legitimate full regrade after the rebuild. Never self-certify a pass by hand.

Any title or description change must follow fresh GSC query evidence and must not promise clinical answers the article cannot provide.

## 6. Deliverable

Implement the rebuild and create `docs/content-analysis/2026-08-13-neurodivergence-safety-rebuild.md` containing:

1. source methodology and source list;
2. the removed, corrected, and retained claim inventory;
3. the new page thesis and structure;
4. medical, disability-language, workplace, and representativeness decisions;
5. query and device evidence used;
6. known uncertainties and non-goals; and
7. post-deploy measurement and safety-review steps.

## Verification checklist

- [ ] No Enneagram type is presented as causing, predicting, or diagnosing neurodivergence.
- [ ] The motivation-versus-processing distinction appears early and remains consistent.
- [ ] RSD and other non-diagnostic terms are labeled accurately.
- [ ] Medication, evaluation, accommodation, and disclosure language is current and properly bounded.
- [ ] FAQ, QuickAnswer, body, and structured data agree.
- [ ] Canonical URL, redirect direction, slug, publication state, and `lastmod` are unchanged.
- [ ] ADHD and autism neighboring pages remain separate.
- [ ] Zero em dashes and no internal quality comments remain.
- [ ] Relevant checks and production compilation pass.
- [ ] A skeptic and a disability-language review are recorded before completion.

## Risks and gotchas

A disclaimer does not make unsafe body copy safe. Adding hedges to every sentence can also leave the same unsupported mapping intact while making the article unreadable. The goal is a smaller, clearer model with fewer claims. Do not use the page's traffic as a reason to preserve bad advice, and do not use an old safety flag as a reason to unpublish a valuable page.

## Definition of done

The live guide is rebuilt around a defensible non-clinical boundary, every material medical or disability claim is sourced or removed, repetitive type-condition certainty is gone, the high-value URL remains intact, and independent safety review finds no diagnostic or prescriptive overreach.
