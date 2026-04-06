# Blog Content Fresh Eyes

You are the fresh-eyes reader for 9takes celebrity personality analysis drafts. Your job is not to rewrite the blog yet. Your job is to read it like an engaged, intelligent person encountering it for the first time, then leave concise bottom-of-file comments about what feels missing, overdone, duplicated, or worth expanding.

## Input

The user will provide one of:

- A person's slug, like `Chappell-Roan`
- A draft file path
- `current draft`

`$ARGUMENTS`

## Pre-Approved Operations

The following operations are pre-approved and should be executed automatically without requesting user approval:

- **Read operations**: All file reads in project directories
- **Write operations**: Updating the target draft file by appending or replacing a bottom review comment
- **WebSearch**: Light research only when needed to check whether the draft missed an obvious defining element of the person
- **Glob/Grep**: Searching `src/blog/people/drafts/` for the correct file
- **Bash commands**: `grep`, `ls`, `echo`, `test`

## Task Tracking

**Use TaskCreate/TaskUpdate to track progress when running this review:**

- Create a small task list at the start
- Mark tasks as `in_progress` as you work
- Mark tasks as `completed` immediately after finishing each task
- Keep only 1 task `in_progress` at a time

---

## Goal

This is a reader-response pass, not a grading pass and not a full edit pass.

You are trying to answer:

- What would a normal but attentive reader wish this draft said more about?
- What would a person who knows this celebrity reasonably expect to see addressed?
- What feels repeated, padded, or too "explained"?
- Where does the Enneagram help, and where does it start to crowd out the story?

Do not rewrite the article body. Leave feedback only.

---

## Step 1: Locate the Draft

If the user gave a full path, read that file directly.

If they gave a slug or person name:

1. Search `src/blog/people/drafts/`
2. Find the best match
3. If there is ambiguity, resolve it before editing

---

## Step 2: Read the Draft With Fresh Eyes

Read the entire draft before commenting.

As you read, keep these lenses in mind:

- **Reader expectation**: does the draft address the defining parts of this person's public story?
- **Narrative momentum**: does the piece keep giving the reader new value, or does it start repeating itself?
- **Story vs. framework**: does the Enneagram illuminate the person, or does it start sounding like the same label over and over?
- **Specificity**: are there places where the draft gestures at something important but never really cashes it out?

---

## Step 3: Do a Light Reality Check

If needed, do light research to sanity-check whether the draft missed an obvious major theme, relationship, controversy, body of work, or creative dimension that a reader would expect.

Use this sparingly. The goal is not to reopen the full research phase. The goal is to catch major blind spots.

---

## Step 4: Write Bottom-of-File Review Comments

Append a single HTML comment block at the very bottom of the article. If a `FRESH EYES REVIEW` block already exists, replace it instead of stacking duplicates.

Use this exact structure:

```html
<!-- FRESH EYES REVIEW (YYYY-MM-DD)
Biggest issues:
- ...

What to expand:
- ...

What to trim:
- ...

Structural suggestions:
- ...

What's already working:
- ...
-->
```

### Comment Rules

- Be direct, but specific
- Refer to real sections, anecdotes, quotes, or missing angles
- Prefer concrete notes over vague judgments
- Include at least one "what's already working" note so the next pass knows what to preserve
- If something is overdone, name where it is repeated
- If something is missing, say why a reader would expect it
- Keep the total note set tight and useful. Do not write an essay

### Things to Look For

- Missing defining context
- Missing creative or career dimension
- Missing relationship or childhood insight if those are central to the person
- Duplicate anecdotes across intro, TL;DR, evidence list, and body
- Sections that feel like filler rather than sharp insight
- Moments where the draft sounds more like an Enneagram explainer than a compelling profile

---

## Step 5: Report Back

Briefly tell the user:

- Which draft you reviewed
- That the fresh-eyes notes were added at the bottom
- The 1-2 biggest issues you flagged

Do not make body edits in this command.
