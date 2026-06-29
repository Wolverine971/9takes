<!-- docs/content-analysis/pipeline-logs/2026-06-28_140744_Matt-Smith/tasks/TASK-1-research-brief.md -->

# TASK 1 — Research Brief (Matt Smith blog)

**Run order:** 1 of 3 (do this FIRST; tasks 2 and 3 depend on it)
**Suggested agent:** `research-analyst`
**Touches the blog file:** NO. This task produces a research brief only. Do not edit `Matt-Smith.md`.

---

## Why this exists

A fresh-eyes reader review of `src/blog/people/drafts/Matt-Smith.md` found that the article's
whole thesis hangs on facts that are currently _asserted, not sourced_, and that several
reader-expected angles are missing. The downstream rewrite (Task 2) cannot proceed responsibly
until those facts are verified and the missing material is gathered. That is this task.

## Inputs to read first

- The draft: `src/blog/people/drafts/Matt-Smith.md`
- The reader comment inside it: the `<!-- READER FRESH-EYES COMMENT (2026-06-28) -->` block near the bottom.
- The existing `<!-- TESTIMONY LEDGER -->` and `citations:` frontmatter — know what's already sourced so you don't re-gather it.

## What to produce

A markdown brief saved to:
`docs/content-analysis/pipeline-logs/2026-06-28_140744_Matt-Smith/tasks/RESEARCH-BRIEF-output.md`

Every factual claim must carry a **source (publication + date) and a direct quote or link** so Task 2
can cite it. Flag anything you could NOT verify as `UNVERIFIED` — do not paper over gaps.

Gather, in this order of importance:

1. **The football / injury spine of the piece (load-bearing — verify hard).**
   - Was he genuinely on the books at Nottingham Forest and then Leicester City youth? Source it.
   - The spondylosis diagnosis ending the career at 16 — source it.
   - A real, datable on-record quote for "still lives with the back condition today." Right now the
     draft paraphrases this with no attribution. If no such quote exists, say so — that changes the rewrite.

2. **Genuine playfulness / joy (raw material for the single biggest fix).**
   - 3–4 concrete moments showing him as actually _fun, warm, goofy_ — on-set stories, interview
     moments, the Doctor Who silliness — NOT framed as a defense mechanism, just who he is.
   - This feeds the "where's the fun?" fix. A Type 7 article that's joyless is self-refuting.

3. **Lily James relationship.**
   - Timeline (roughly 2014–2019), how they met (Doctor Who? No — verify), any on-record line worth quoting.
   - Goal: enough to give it ONE real beat, or to justify cutting the current name-drop tease.

4. **Off-thesis roles (to fix the "cherry-picked filmography" critique).**
   - Last Night in Soho (2021, Edgar Wright), Terminator Genisys (2015), An Enemy of the People (West End, 2024),
     plus any notable comedic/lighter turns.
   - For each: one line on the character, so Task 2 can name a role that _complicates_ the "only plays
     trapped men" pattern and either fold it in honestly or show the pattern still holds.

5. **Doctor Who depth (the reader's main entry point, currently under-served).**
   - Material on WHY the Eleventh Doctor was beloved — the physicality, the "old man in a young body"
     quality, signature bits, fandom response. Quotes from cast/showrunner/critics welcome.

## Acceptance criteria

- [ ] Every claim has publication + date + quote/link, OR is explicitly marked `UNVERIFIED`.
- [ ] The football/spondylosis "still lives with it today" claim is either sourced or flagged as unsourceable.
- [ ] At least 3 concrete joy/playfulness moments captured.
- [ ] At least one off-thesis role documented well enough to address in prose.
- [ ] Output saved to the path above. The blog file is untouched.

## Do NOT

- Do not edit `Matt-Smith.md` or any frontmatter (especially not `lastmod` — DJ manages that manually).
- Do not invent quotes or soften an unverified claim into a confident one.
