<!-- docs/design/hyperplexed/BLACKPILL_ARTICLE_AUDIT_2026-07-22.md -->

# Blackpill Article Audit — 2026-07-22

## Scope

Audited the rewritten article at
`/pop-culture/incel-blackpill-radicalization-enneagram` as an editorial system: the argument's
sequence, the full downward-spiral map, the exit map, the fixed table of contents, and responsive
reading in dark and light themes.

## Findings and shipped fixes

| Priority | Finding                                                                                      | Pattern | Resolution                                                                                                                          |
| -------- | -------------------------------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| P1       | The old article had many observations but no single causal spine readers could hold onto.    | P5, P6  | Reoriented the article around pain becoming shame, a fatal story, defensive behavior, confirming evidence, and a downward spiral.   |
| P1       | A text-only explanation could not make the two feedback loops immediately legible.           | P4, P6  | Added semantic HTML diagrams for the complete pipeline and for the practical route out, with explicit social and economic branches. |
| P1       | The first wide diagram could slide beneath the desktop table of contents at large viewports. | P1, P3  | Capped the wide breakout when the fixed rail is present while preserving a fuller breakout on medium screens.                       |
| P2       | The argument risked treating real constraints as either destiny or mere mindset.             | P5, P6  | Separated pain from story and paired counter-evidence with concrete relational, work, training, and support actions.                |
| P2       | Dense diagram cards could become an unreadable miniature on phones.                          | P3, P4  | Reflowed both diagrams into a single-column sequence with preserved order, labels, and causal connectors at 390px.                  |
| P2       | Decorative shapes could weaken the seriousness of the subject.                               | P2, P11 | Used the V5 amber/stone system, restrained depth, semantic regions, and no ornamental motion.                                       |

No signature animation was added. The earned visual move is the contrast between the downward loop
and the upward loop; motion would not make the argument clearer.

## Verification

- The live route returns 200 with no browser console errors.
- Fresh 1440px dark and light captures pass for the introduction, pipeline diagram, and exit diagram.
- Fresh 390px dark captures pass with no horizontal overflow; diagram order and text remain readable.
- The desktop table of contents and wide diagrams no longer collide.
- Both Svelte components pass the Svelte autofixer with no issues or suggestions.
- `pnpm check` passes with 0 errors; the repository's existing 140-warning backlog is unchanged.
- The repository radius lint remains blocked by unrelated drift in
  `QuestionSocialCardTemplate.svelte` and `enneagram-test/+page.svelte`; neither new diagram adds a
  radius violation.

## Deferred

- Broader blog-template treatment remains a separate backlog item; this audit covers one article.
- Social derivatives belong in the follow-on social-assets task so platform compression does not
  distort the article's distinctions.
