<!-- docs/content-analysis/blog-content-creator-people-assessment-2026-04-03.md -->

# Assessment: `blog_content_creator_people.md`

**Date:** 2026-04-03  
**File:** `.claude/commands/blog_content_creator_people.md`

## Overview

This prompt is strongest when it behaves like an editorial director for celebrity personality profiles. Its best material is the voice guidance, the anti-generic writing standards, the emphasis on primary-source research, and the insistence on a clear narrative through-line.

Its main risks are overreach and overconfidence. When one prompt tries to do research, diagnosis, drafting, QA, metadata, linking, and production operations at once, reliability drops. The model starts optimizing for whichever instructions feel loudest rather than following the whole system cleanly.

## Strengths

- Strong house voice. The tone rules are unusually specific and help suppress generic AI writing.
- Clear anti-slop standards. The swap test, repetition prevention, and narrative-first rules are high-value constraints.
- Good sourcing instincts. The prompt pushes toward long-form interviews, direct quotes, testimony from other people, and specific small moments.
- Good editorial ambition. It aims for a compelling profile, not a Wikipedia rewrite with type labels pasted on top.
- Useful Enneagram framing. The prompt tries to use the system as a lens rather than as jargon for its own sake.

## Weaknesses

- Too many jobs in one prompt. Research, writing, revision, metadata, linking, grading, and production tasks compete for attention.
- Still prone to overconfident psychological claims when evidence is thin.
- Long prompts reduce compliance. As the document grows, later instructions and edge-case rules become easier for the model to miss.
- Some instructions push toward thesis-forcing. “Every person has a core tension” is good editorial pressure, but it can also encourage overfitting.
- Quote guidance can drift into transcript-stitching if not carefully bounded.

## What It Will Likely Be Good At

- Writing strong first drafts on famous people with rich interview and podcast material.
- Producing a distinctive 9takes voice consistently.
- Finding a narrative arc and building a sharper through-line than generic celebrity bios.
- Improving existing drafts that already have decent raw material.
- Making the Enneagram feel interpretive rather than purely descriptive.

## What It Will Likely Not Be Great At

- Subjects with thin source material or weak first-person evidence.
- Cases where the type is genuinely ambiguous.
- Sensitive or controversial subjects that require unusually cautious framing.
- Fast one-pass execution across the full publishing pipeline.
- Perfect structural compliance when too many technical tasks are bundled into the same command.

## Gaps

- No hard anti-fabrication rule for interiority or reconstructed moments.
- No strict source hierarchy defining what counts as acceptable evidence and what should be avoided.
- No consistent citation standard for quotes and factual claims inside the final draft.
- No explicit fallback for insufficient evidence.
- No defamation/allegation handling rule for risky celebrity material.
- No explicit length budget, which can encourage sprawling drafts.

## Recommended Scope Split

### Keep in `blog_content_creator_people`

- Research
- Enneagram analysis
- Transcript recommendations and transcript synthesis
- Draft writing
- Draft revision
- Frontmatter quality
- Internal linking within the draft
- Draft quality grading

### Move to a Separate Production Workflow or Command

- Database checks and writes
- Stale blog audits
- `famousTypes.ts` regeneration or listing maintenance
- Image handling
- Publication-state changes
- Post-write verification and deployment-style steps

### Recommendation

Start with a **separate companion command** rather than a more complex agent. A second command is easier to reason about, easier to maintain, and easier to test. If the production workflow later becomes more stateful or multi-step, that is the time to consider promoting it into a dedicated agent.

Suggested companion scope:

- Read the finalized draft
- Push or sync to the database
- Verify the row
- Update downstream listing artifacts
- Handle image requirements
- Report production status cleanly

## Fixes Applied On 2026-04-03

- Removed the contradiction that implied the blog should end with an engaging question.
- Reframed the command as a writing-focused workflow instead of a full production pipeline.
- Removed database and push-operation instructions from this command.
- Added an explicit scope boundary so production tasks are treated as a separate workflow.
- Created a companion production command: `blog_content_production_people`.
- Updated the writing workflow so reviewed drafts write a `production_pretext` handoff block and then hand off to `blog_content_production_people` before publishing.
- Reworked the production command so it is driven by `production_pretext` state instead of rediscovering context from scratch.
- Softened the quote-density guidance so it encourages strong evidence without pushing the model into transcript-stitching.
- Preserved the Enneagram-accessibility changes so the prompt stays focused on general readers rather than typology debates.

## Next Good Moves

1. Add a hard source-quality and citation policy to the writing command.
2. Add a nonfiction safety rule banning invented inner thoughts, recreated dialogue, or composite scenes unless clearly labeled and sourced.
3. Add an “insufficient evidence” fallback so the prompt knows when to narrow claims instead of forcing certainty.
4. Decide whether `blog_content_production_people` should eventually absorb stale-blog audits or stay narrowly focused on handoff and sync.
