<!-- docs/content-analysis/pipeline-logs/2026-06-28_140744_Matt-Smith/tasks/TASK-3-cohesion-trim-regrade.md -->

# TASK 3 — Cohesion, Trim, Discoverability & Regrade (Matt Smith blog)

**Run order:** 3 of 3 (do LAST, after Task 2's developmental edit is complete)
**Suggested agent:** `editor` at line-edit depth, using the `cohesion-check` then `grade_blog` commands
**Touches the blog file:** YES — `src/blog/people/drafts/Matt-Smith.md`

---

## Why this exists

Task 2 reworked structure and added material, which means the prose now needs a unifying pass:
trim the over-used imagery, dedupe refrains, fix the one discoverability blocker, then confirm the
piece cleared the quality bar. This is voice-preserving cleanup, NOT new structural work — if you
find a structural hole, note it for a follow-up rather than rebuilding here.

## Inputs to read first

- The draft after Task 2: `src/blog/people/drafts/Matt-Smith.md`
- The `<!-- DEVELOPMENTAL EDIT NOTES -->` block Task 2 appended — know what just changed.
- The `9takes-editorial-standards` skill — load and obey.

## What to do (in order)

1. **Cohesion + trim** (run the `cohesion-check` command, then act on it):
   - **Spine metaphor:** the spondylosis "still inside the body / riding in his spine" image should land
     only at the intro and the ending. Cut any mid-piece echoes that dilute the closing image.
   - **Door / exit / room cluster:** "collects exits," "next room," "visit the trap and keep the key,"
     "country he can emigrate to," "The Door That Never Reopened" — this is the central metaphor but it
     recurs on nearly every page. Thin it by ~30% so the closing "door" image stays the sharpest instance.
   - **Refrains:** "the grief gets a costume" / "the next room is always already waiting" should land once,
     not near-verbatim in two sections.
   - Watch for NEW redundancy introduced by Task 2's additions (e.g. the joy beat restating a point made elsewhere).

2. **Discoverability — fix `meta_title`** (the one item the grade flagged):
   Current `meta_title` is "Why Matt Smith Can't Stop Disappearing Into Other Men" — clever but carries no
   search term, so the SERP `<title>` loses the query match. Rewrite to include a search term while keeping a hook.
   Suggested: `"Matt Smith's Enneagram Type: TV's Restless Escape Artist"` or
   `"Why Matt Smith Is an Enneagram 7 (and Plays Trapped Men)"`. Do not change the H1 `title:`.

3. **Final editorial-standards sweep:** em-dash check (`./scripts/blog-lint.sh Matt-Smith` if available),
   banned words, AI tells.

4. **Regrade** (run the `grade_blog` command):
   - Update the `content_quality:` frontmatter block and the `<!-- QUALITY GRADE -->` comment with the new scores.
   - Target: clear the previous B+ (8.6) — Discoverability should rise from 8 once `meta_title` is fixed,
     and Evidence should rise if Task 2 sourced the previously-paraphrased claims.

## Guardrails

- **Voice-preserving only.** Do not restructure sections or remove the beats flagged as working
  (physio-room cold open, inner-thought, Morbius empathy turn, Collett quote, pay-gap beat, counterarguments).
- **Do NOT touch `lastmod`** — DJ manages it manually. (You DO update `content_quality` and `meta_title`.)
- **Parallel safety:** only edit `Matt-Smith.md`; no wide reformatting or git stash/reset.

## Acceptance criteria

- [ ] Spine metaphor lands only at intro + ending.
- [ ] Door/room metaphor thinned ~30%; closing "door" image is the sharpest instance.
- [ ] "Grief gets a costume" refrain lands once.
- [ ] `meta_title` contains a search term and a hook; `title:` H1 unchanged.
- [ ] Em-dash / banned-word / AI-tell check clean.
- [ ] `content_quality` block and `<!-- QUALITY GRADE -->` comment updated; piece clears 8.6.
- [ ] `lastmod` untouched.

## Do NOT

- Do not add new sections or new factual claims (that was Task 2).
- Do not edit `lastmod`.
- If you spot a structural gap, leave a note comment rather than rebuilding — flag it for DJ.
