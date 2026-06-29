<!-- docs/content-analysis/pipeline-logs/2026-06-28_140744_Matt-Smith/tasks/TASK-2-developmental-edit.md -->

# TASK 2 — Developmental Edit (Matt Smith blog)

**Run order:** 2 of 3 (do AFTER Task 1's research brief exists)
**Suggested agent:** `editor` at developmental depth (or the `blog_content_revision_pass_people` command)
**Touches the blog file:** YES — `src/blog/people/drafts/Matt-Smith.md`

---

## Why this exists

The draft grades B+ (8.6) but a reader review found structural problems no line-edit can fix: the
piece is joyless for a "joy type," over-attributes everything to one childhood injury, cherry-picks
the filmography, under-serves Doctor Who, and teases the Lily James relationship without paying it off.
This task does the substance/structure surgery. Trimming and polish come later in Task 3 — do not
get pulled into metaphor-trimming here.

## Inputs to read first (all required)

- The draft: `src/blog/people/drafts/Matt-Smith.md`
- The research brief: `docs/content-analysis/pipeline-logs/2026-06-28_140744_Matt-Smith/tasks/RESEARCH-BRIEF-output.md`
  (Task 1's output — every new factual claim you add must come from here, with its source.)
- The `<!-- READER FRESH-EYES COMMENT -->` block in the draft — that's the spec for what's wrong.
- The `9takes-editorial-standards` skill — load it and obey it (banned words, AI tells, em-dash ban, voice).

## The five fixes (in priority order)

1. **Add the joy. (Highest leverage.)**
   This is a Type 7, the Enthusiast — the joy-and-appetite type — and the article currently reads as
   unrelieved melancholy. Every instance of lightness is explained away as "scar tissue" or "a costume
   over grief." Add a beat (or rework an existing one) that lets him be _genuinely fun/warm/goofy_ —
   sourced from the brief — without immediately undercutting it as a defense mechanism. The reader
   should leave liking him, not just pitying him.

2. **De-monocausalize.**
   Right now intro + FAQ + two sections + ending all route every trait back to the football injury at 16.
   Loosen the grip in 1–2 places so it reads as a person, not a thesis being enforced. Keep the injury
   as the spine of the piece — just stop making it the sole explanation for literally everything.

3. **Fix the cherry-picked gallery.**
   The "he only plays trapped men" argument skips the inconvenient roles (Last Night in Soho, Terminator
   Genisys, lighter/comedic + stage work). Name at least one off-thesis role and either fold it in
   honestly or show the pattern still holds. A reader who knows his filmography must not catch you hiding
   the counterexamples.

4. **Pay off or cut Lily James.**
   The current name-drop closes the door instantly ("declines to discuss") and goes nowhere. Using the
   brief, give the relationship ONE real human beat, or remove the tease. Don't leave it dangling.

5. **Beef up Doctor Who.**
   It's the single thing the most readers know him for and it's the most under-served section (mostly
   about the audition). Add why the Eleventh Doctor was _beloved_ — the physicality, the old-soul-in-a-
   young-body quality, what he did with the part — using the brief.

## Guardrails

- **Sourcing:** any new factual claim must trace to the research brief with its publication + date.
  Do not add unsourced assertions. If the brief marked the "still lives with the condition" line
  `UNVERIFIED`, soften or attribute it accordingly — do not state it as confident fact.
- **Preserve what works** (the reader review and prior ledgers flagged these — keep them):
  the physio-room cold open, the 16-year-old `<p class="inner-thought">`, the Morbius empathy turn,
  the Harry Collett Daemon quote, the Crown pay-gap loyalty beat, the Type 4 / Type 3 counterarguments.
- **Editorial standards:** no em-dashes in prose (quote attributions excepted), obey the banned-word
  and AI-tell lists in the `9takes-editorial-standards` skill.
- **Frontmatter:** you may improve body content and the FAQ answers, but **do not touch `lastmod`**
  (DJ manages it manually). Leave `meta_title` for Task 3.
- **Parallel safety:** other agents/DJ may be editing this repo. Only edit `Matt-Smith.md`. No wide
  reformatting, no git stash/reset.

## Leave a record

Append a `<!-- DEVELOPMENTAL EDIT NOTES (date) -->` comment block at the bottom of the draft listing
what you changed per fix, what you sourced it to, and anything you deliberately left for Task 3.

## Acceptance criteria

- [ ] All five fixes addressed (joy, de-monocausalize, filmography, Lily James, Doctor Who).
- [ ] Every new fact cites a source from the brief; no new unsourced claims.
- [ ] All "preserve what works" beats still present.
- [ ] `lastmod` and `meta_title` untouched.
- [ ] Editorial-standards clean (em-dash, banned words).
- [ ] Change-notes comment block appended.

## Do NOT

- Do not do the metaphor/redundancy trimming — that's Task 3 (trimming now wastes work, since this task
  changes the surrounding text).
- Do not re-grade — that's Task 3.
- Do not edit `lastmod`.
