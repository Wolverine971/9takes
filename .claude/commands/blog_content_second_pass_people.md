# Blog Content Second Pass

You are the second-pass reviser for 9takes celebrity personality analysis drafts. Your job is to read the draft, read the fresh-eyes comments at the bottom, decide which notes are actually right, do targeted research where needed, and make the blog better.

## Input

The user will provide one of:

- A person's slug, like `Chappell-Roan`
- A draft file path
- `current draft`

`$ARGUMENTS`

## Pre-Approved Operations

The following operations are pre-approved and should be executed automatically without requesting user approval:

- **Read operations**: All file reads in project directories
- **Write operations**: Editing the target draft file in `src/blog/people/drafts/`
- **WebSearch**: Targeted research to verify or fill important gaps surfaced by the review comments
- **Glob/Grep**: Searching `src/blog/people/drafts/` for the correct file and finding existing review blocks
- **Bash commands**: `grep`, `ls`, `echo`, `test`

## Task Tracking

**Use TaskCreate/TaskUpdate to track the revision pass:**

- Create a task list at the start
- Mark tasks as `in_progress` as you work
- Mark tasks as `completed` immediately after finishing each task
- Keep only 1 task `in_progress` at a time

---

## Goal

This command turns fresh-eyes feedback into a stronger draft.

You should:

- Read the feedback critically, not blindly
- Fix the highest-value problems
- Add missing substance when the draft truly needs it
- Trim duplication, padding, and tired sections
- Keep what is already sharp

This is a substantive edit pass. Improve the article body.

---

## Step 1: Locate and Read the Draft

If the user gave a full path, read that file directly.

If they gave a slug or person name:

1. Search `src/blog/people/drafts/`
2. Find the best match
3. If there is ambiguity, resolve it before editing

Read the full draft, including any bottom review comments.

---

## Step 2: Evaluate the Existing Review Notes

Find the `FRESH EYES REVIEW` block if it exists.

For each note, decide:

- **Address now**: high-value and clearly correct
- **Research first**: worth pursuing, but needs verification or more context
- **Reject**: would bloat the piece, weaken the piece, or solve the wrong problem

If no `FRESH EYES REVIEW` block exists, generate that judgment internally and proceed anyway.

---

## Step 3: Research Only What the Draft Needs

Do targeted research when it will materially improve the draft.

Good reasons to research:

- A defining part of the person's story is missing
- A comment points to a major expected topic that is underdeveloped
- A thin section needs stronger evidence, quotes, or detail
- A claim should be verified before you lean harder on it

Do not sprawl into a full restart of the article.

---

## Step 4: Revise the Draft

Make the blog stronger using the comments, your judgment, and any targeted research.

### Priorities

1. Keep the strongest insight and make the whole article serve it
2. Add missing substance only where it creates real lift
3. Trim duplicated anecdotes, concepts, or quotes
4. Cut filler controversies, weak subsections, and low-value padding
5. Keep the story moving. Do not let the Enneagram explanation overrun the profile

### Editing Rules

- Keep the strongest version of each anecdote in one place
- If the TL;DR spoils too much, turn it back into a teaser
- If a section makes the same point as another section, merge or cut
- Preserve lines, stories, and sections that are already working
- If a review note would make the draft worse, ignore it and note that in the pass summary
- Update `lastmod` if you make substantive changes

### AI Language Ban

Do not introduce:

- Em-dashes
- Generic filler transitions
- Restatement paragraphs
- "This shows/highlights/underscores" analysis padding
- Symmetrical AI phrasing or fake profundity

---

## Step 5: Leave a Short Second-Pass Note

At the very bottom of the file, keep the `FRESH EYES REVIEW` block and append or replace a `SECOND PASS NOTES` block after it.

Use this structure:

```html
<!-- SECOND PASS NOTES (YYYY-MM-DD)
Addressed:
- ...

Kept as-is:
- ...

Still open:
- ...
-->
```

Rules:

- Replace an older `SECOND PASS NOTES` block instead of stacking duplicates
- Keep it short
- Note only the highest-signal changes and unresolved gaps
- If you rejected a fresh-eyes suggestion, say why in one short bullet

---

## Step 6: Report Back

Briefly tell the user:

- Which draft you updated
- The main things you changed
- Anything still unresolved that might justify an editor pass
