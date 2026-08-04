<!-- .claude/commands/blog_content_revision_pass_people.md -->

# Blog Content Revision Pass (Grade-Feedback Loop)

You are the targeted revision pass for 9takes celebrity personality analysis drafts. You run **after** `/grade_blog` when the grade came back below the publication bar, or after `scripts/blog-lint.sh` reported failures. Your inputs are the grader's review sidecar and the lint report, not your taste. Fix what they name, preserve everything else.

This is the stage that closes the loop the 2026-06-10 audit found missing: the grader writes actionable "NEEDS WORK" / "TO REACH" feedback, and before this command existed, nobody consumed it.

## Input

The user will provide one of:

- A person's slug, like `Chappell-Roan`
- A draft file path
- `current draft`
- Any of the above followed by `--perspective-review-dir=<repo-relative-dir>` when an audience-perspective verification needs another targeted repair

`$ARGUMENTS`

## Pre-Approved Operations

- **Read**: All file reads in project directories
- **Write / Edit**: Editing the target draft file in `src/blog/people/drafts/`
- **Perspective artifacts**: Reading the supplied review directory and writing `revision-resolution.md`
- **WebSearch**: Only when a grader note or unresolved perspective item requires a specific missing fact, quote, or source (e.g. "unattributed quote — find the source or cut")
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
3. Read `docs/content-analysis/grades/[Person-Name].review.md`, using the draft filename without `.md`. This contains the per-dimension scores and the grader's feedback. If the sidecar is missing, stop and report because this command needs grader feedback to act on. Do not fall back to a legacy HTML comment in the draft.
4. Run the lint and capture the failures:

```bash
./scripts/blog-lint.sh [Person-Name]
```

5. Build a single work list: lint FAILs first (mechanical, unambiguous), then grader NEEDS WORK items, then TO REACH items.

When `--perspective-review-dir` is supplied:

6. Read `context.json`, `synthesis.md`, `editor-resolution.md`, and the newest available verification artifact (`verification-final.md` before `verification-initial.md`).
7. Add every unresolved `P0-*` and every protected-hit regression to the work list immediately after lint FAILs and before ordinary grader feedback.
8. Add an accepted `P1-*` only when the verifier says the attempted repair remains incomplete. Do not reopen already resolved or deliberately rejected P1 preferences.

---

## Step 2: Triage the Work List

For each item, decide:

- **Fix now** — clearly correct and inside this draft's scope
- **Reject** — would bloat or weaken the piece, or contradicts a deliberate choice (e.g. the grader asks for a summary ending but the Ending Rule says cut to black). Note the rejection and reason.

**Never reject lint FAILs.** They are mechanical rule violations (missing rabbit hole, prose em-dashes, missing ledgers, templated FAQs, self-loops). If one seems wrong, fix the draft anyway and flag the rule concern in your report.

**Never silently reject a perspective P0.** Fix it, mark it `research_needed`, or mark it `needs_human` with the exact unresolved decision. The later perspective verifier, not this revision pass, closes the gate.

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
- **Protect the jury's hits** — every `PROTECT-*` item in `synthesis.md` is a regression check. Preserve the passage or its essential function while fixing nearby P0/P1 items.

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

## Step 5: Write the Perspective Revision Resolution

When `--perspective-review-dir` is supplied, write `<review-dir>/revision-resolution.md` with:

```yaml
---
artifact: perspective-revision-resolution
schema_version: 1
subject: <exact context subject>
draft_sha256: <frozen snapshot sha>
resolution_status: complete
resolved_at: <ISO-8601 timestamp>
---
```

Map each verifier-named `P0-*`, incomplete accepted `P1-*`, and `PROTECT-*` regression to its exact edit and status. Allowed statuses are `fixed`, `research_needed`, and `needs_human`. Do not declare the gate passed; the pipeline reruns `/blog_perspective_verify_people`.

Use these exact H2 headings:

```markdown
## Resolution log

## Protected hits checked

## Unresolved decisions
```

## Step 6: Leave a Revision Note

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

## Step 7: Report Back

- Which draft you revised and what triggered the loop
- The fixes applied, mapped to the grader/lint items they address
- Any rejected feedback and why
- Confirmation that lint is clean
- Note that the pipeline will clear the consumed review sidecar and re-grade
- In perspective mode: note the resolution artifact and that targeted perspective verification must rerun

Do **not** grade the blog yourself. `/grade_blog` owns grading.

---

## File References

- Grader: `/.claude/commands/grade_blog.md` (writes the review sidecar you consume)
- Lint: `/scripts/blog-lint.sh`
- Creator rules (canonical): `/.claude/commands/blog_content_creator_people_v2.md`
- Rubric: `/docs/content-analysis/blog-grading-rubric.md`
