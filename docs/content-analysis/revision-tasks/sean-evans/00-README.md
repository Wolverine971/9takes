<!-- docs/content-analysis/revision-tasks/sean-evans/00-README.md -->

# Sean Evans Blog — Revision Task Pack

Goal: elevate `src/blog/people/drafts/Sean-Evans.md` (currently an A-grade Type 6 / 6w5
analysis, overall 9.1) by closing fan-expectation gaps, trimming repetition, fixing one
fact inconsistency, and deepening the Enneagram read — **without bloating word count or
losing the existing voice.**

The spec for all of this is the `READER FRESH-EYES REVIEW` HTML comment block at the
bottom of the article file. Every task below traces back to it.

## How to run this pack (IMPORTANT — read before assigning)

Everything lands in **one file**. So:

- **Phase 1 — Research (run in PARALLEL):** tasks `research-1` … `research-5`.
  These are read-only. None of them edit the article. Each returns a short sourced brief.
  Recommended agent: `research-analyst`.

- **Phase 2 — Writing (run SERIALLY, one agent, after all research is in):**
  `writer-revision-brief.md` does passes A → B → C → D in order, in one session.
  Recommended agent: `editor`.

Do **not** assign multiple writer agents to the file at once — they will clobber each
other, and this draft is bundled into the production build, so a bad save can fail a deploy.

## Global guardrails (paste into every task)

- **Never modify the `lastmod` frontmatter field.** DJ manages it manually.
- **No em-dashes** anywhere in added prose. House ban. Use commas, periods, or restructure.
- **YAML safety:** this draft is bundled into the build. If you touch frontmatter, validate
  it (no stray `\'`, balanced quotes) before saving. One bad draft fails the whole deploy.
- **Surgical, voice-preserving edits.** The piece is already 9.1/A. This is not a rewrite.
- **Net-neutral length.** Additions are paid for by the trims in Pass B. Don't grow the article.
- **Source everything new.** No invented quotes or unverifiable claims. If it can't be
  sourced, flag it; don't ship it.

## Target file

`/Users/djwayne/9takes/src/blog/people/drafts/Sean-Evans.md`

Subject: Sean Evans (Hot Ones host). Typed Enneagram 6, 6w5, counterphobic on camera.

## Task index

| File                     | Phase        | Agent            | Edits article? |
| ------------------------ | ------------ | ---------------- | -------------- |
| research-1-paul-rudd.md  | 1 (parallel) | research-analyst | no             |
| research-2-rituals.md    | 1 (parallel) | research-analyst | no             |
| research-3-intro.md      | 1 (parallel) | research-analyst | no             |
| research-4-health.md     | 1 (parallel) | research-analyst | no             |
| research-5-birthplace.md | 1 (parallel) | research-analyst | no             |
| writer-revision-brief.md | 2 (serial)   | editor           | YES            |
