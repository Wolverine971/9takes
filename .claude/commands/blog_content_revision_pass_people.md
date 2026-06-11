<!-- .claude/commands/blog_content_revision_pass_people.md -->

# Blog Content Revision Pass (Grade-Feedback Loop)

You are the targeted revision pass for 9takes celebrity personality analysis drafts. You run **after** `/grade_blog` when the grade came back below the publication bar, or after `scripts/blog-lint.sh` reported failures. Your inputs are the grader's own feedback and the lint report — not your taste. Fix what they name, preserve everything else.

This is the stage that closes the loop the 2026-06-10 audit found missing: the grader writes actionable "NEEDS WORK" / "TO REACH" feedback, and before this command existed, nobody consumed it.

## Input

The user will provide one of:

- A person's slug, like `Chappell-Roan`
- A draft file path
- `current draft`

`$ARGUMENTS`

## Pre-Approved Operations

- **Read**: All file reads in project directories
- **Write / Edit**: Editing the target draft file in `src/blog/people/drafts/`
- **WebSearch**: Only when a grader note requires a specific missing fact, quote, or source (e.g. "unattributed quote — find the source or cut")
- **Glob/Grep**: Locating the draft and review blocks
- **Bash**: `grep`, `ls`, `echo`, `test`, `awk`, `./scripts/blog-lint.sh`

## Task Tracking

Use TaskCreate/TaskUpdate. One task `in_progress` at a time.

---

## Goal

One disciplined revision iteration. Not a rewrite, not a re-research, not a second opinion on the grade.

You succeed when:

- Every **FAIL** from `blog-lint.sh` is fixed
- Every item in the grader's **NEEDS WORK** and **TO REACH [NEXT GRADE]** lists is either fixed or explicitly rejected with a one-line reason
- The draft's existing strengths (the grader's positive observations) are untouched

---

## Step 1: Locate the Draft and Gather the Inputs

1. Find the draft in `src/blog/people/drafts/` (resolve slug variations).
2. Read the full draft.
3. Extract the **QUALITY GRADE** HTML comment (immediately after the frontmatter). This contains the per-dimension scores and the grader's feedback. If there is no QUALITY GRADE comment, stop and report — this command needs grader feedback to act on.
4. Run the lint and capture the failures:

```bash
./scripts/blog-lint.sh [Person-Name]
```

5. Build a single work list: lint FAILs first (mechanical, unambiguous), then grader NEEDS WORK items, then TO REACH items.

---

## Step 2: Triage the Work List

For each item, decide:

- **Fix now** — clearly correct and inside this draft's scope
- **Reject** — would bloat or weaken the piece, or contradicts a deliberate choice (e.g. the grader asks for a summary ending but the Ending Rule says cut to black). Note the rejection and reason.

**Never reject lint FAILs.** They are mechanical rule violations (missing rabbit hole, prose em-dashes, missing ledgers, templated FAQs, self-loops). If one seems wrong, fix the draft anyway and flag the rule concern in your report.

---

## Step 3: Apply the Fixes

Work through the list. Rules of engagement:

### Scope discipline

- **Targeted edits only.** Touch the sections the feedback names. Do not reflow untouched sections.
- **No new research phase.** One or two WebSearches to chase a specific named gap is fine; reopening Step 1 of the creator workflow is not.
- **The lowest-scoring weighted dimension gets the most attention.** Evidence, Originality, and Discoverability are weighted 1.5×; a point there moves the overall three times as much as a Hook point.

### Quality rules still apply

All creator v2 rules bind here, especially:

- **AI Language Ban (canonical list in creator v2)** — no prose em-dashes (quote attributions exempt), no banned words/structures. Do not introduce tells while fixing other tells.
- **The emotional layer** — if the grader dinged Enneagram Integration for "pattern named, fear never felt," the fix is the emotional thesis / empathy turn / interior beat, not more type theory.
- **Distribution Rule, Ending Rule, Hook Test, Repetition Prevention** — fixes must not regress these.
- **Update the ledgers** (Testimony, Heading Mix, Distribution, Formula Fingerprint) if your edits changed what they enumerate.
- **Never modify `lastmod`** — DJ manages that field manually.
- **Never touch `content_quality`** — the pipeline strips and re-grades after this pass. Do not pre-fill or edit grades.

### Discoverability fixes specifically

If Discoverability < 7 drove the loop: check `meta_title` length (35–65), `description` (120–170, target 145–160), early extractable type answer, search-intent headings, and `faqs` quality. These are usually cheap, high-leverage fixes.

---

## Step 4: Verify Mechanically

Re-run the lint before finishing:

```bash
./scripts/blog-lint.sh [Person-Name]
```

All FAILs must be gone. If a FAIL remains, keep working — do not report success with open lint failures.

---

## Step 5: Leave a Revision Note

Append or replace a `REVISION PASS NOTES` block at the very bottom of the draft (after any existing review blocks):

```html
<!-- REVISION PASS NOTES (YYYY-MM-DD)
Triggered by: [grade X.X / discoverability X / lint failures]
Fixed:
- ...

Rejected (with reason):
- ...

Lint: clean
-->
```

Keep it short. Replace an older block rather than stacking duplicates.

---

## Step 6: Report Back

- Which draft you revised and what triggered the loop
- The fixes applied, mapped to the grader/lint items they address
- Any rejected feedback and why
- Confirmation that lint is clean
- Note that the pipeline will now strip the old grade and re-grade

Do **not** grade the blog yourself. `/grade_blog` owns grading.

---

## File References

- Grader: `/.claude/commands/grade_blog.md` (writes the QUALITY GRADE comment you consume)
- Lint: `/scripts/blog-lint.sh`
- Creator rules (canonical): `/.claude/commands/blog_content_creator_people_v2.md`
- Rubric: `/docs/content-analysis/blog-grading-rubric.md`
