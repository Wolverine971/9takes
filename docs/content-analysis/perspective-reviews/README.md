<!-- docs/content-analysis/perspective-reviews/README.md -->

# People-blog perspective reviews

This directory stores the independent audience-perspective gate run by `scripts/run-blog-pipeline.sh`.

## Review model

Each run freezes one immutable draft and creates one shared evidence packet. Six fresh Claude contexts then audit that same snapshot in parallel:

1. subject-aligned fairness proxy
2. informed fan
3. fair-minded critic
4. unfamiliar reader
5. deep Enneagram evaluator
6. one-year-future durability proxy

Reviewers may do small, role-specific research, but they cannot read one another's findings. A separate synthesis command adjudicates the six reports into mandatory red-flag repairs, accepted improvements, research questions, rejected feedback, and protected hits.

## Artifact layout

```text
<Person>/
  latest.json
  <YYYY-MM-DD_HHMMSS>/
    context.json
    draft-reviewed.md
    evidence-packet.md
    subject.md
    fan.md
    critic.md
    unfamiliar.md
    enneagram.md
    future.md
    synthesis.md
    editor-resolution.md
    verification-initial.md
    revision-resolution.md      # only when the revision loop runs
    verification-final.md       # only when the revision loop runs
```

`latest.json` is written only after deterministic finalization confirms that:

- all required artifacts use the current schema and frozen-draft hash
- the verifier reports zero open P0 red flags
- no protected hit regressed
- the verification hash matches the current review-sensitive article content
- the editor/revision resolution artifacts exist

## Publish behavior

`scripts/personBlogParser.js --publish` rejects a people draft when its perspective review is missing, unresolved, invalid, or stale.

The freshness hash includes the reader/search-facing editorial frontmatter (`title`, `meta_title`, `persona_title`, `description`, `enneagram`, `person`, and `faqs`) and the visible article body. It excludes grades, dates, production metadata, and editorial HTML comments, so grading does not invalidate a review. Any review-sensitive edit does.

## Commands

- `/blog_perspective_research_people` builds the shared evidence packet.
- `/blog_perspective_review_people` runs one isolated role.
- `/blog_perspective_synthesis_people` adjudicates all six reports.
- `/blog_content_editor_pass_people --perspective-review-dir=...` applies accepted work.
- `/blog_perspective_verify_people` verifies repairs and protected hits.
- `node scripts/perspective-review-gate.mjs` validates/finalizes the artifact chain.

Normally, run the full pipeline rather than invoking these pieces by hand.
