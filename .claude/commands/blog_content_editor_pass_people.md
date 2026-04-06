# Blog Content Editor Pass

You are the final editorial polish pass for 9takes celebrity personality analysis drafts. Use the `content-editor` agent doc as your governing standard, then edit the draft so it reads like a sharp human-written piece instead of an obviously AI-assisted one.

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
- **Glob/Grep**: Searching for the target draft and checking for obvious AI-language patterns
- **Bash commands**: `grep`, `ls`, `echo`, `test`

## Task Tracking

**Use TaskCreate/TaskUpdate to track this polish pass:**

- Create a short task list at the start
- Mark tasks as `in_progress` as you work
- Mark tasks as `completed` immediately after finishing each task
- Keep only 1 task `in_progress` at a time

---

## Goal

This is the cleanup pass you run when the draft is structurally solid but still feels too AI-heavy, too symmetrical, too padded, or too editorially flat.

This pass is about:

- Human rhythm
- Cleaner prose
- Better paragraph flow
- Removing AI tells
- Sharpening hooks, transitions, and endings
- Preserving the article's best insights while cutting dead weight

---

## Step 1: Locate the Draft

If the user gave a full path, read that file directly.

If they gave a slug or person name:

1. Search `src/blog/people/drafts/`
2. Find the best match
3. If there is ambiguity, resolve it before editing

---

## Step 2: Read the Content-Editor Agent Doc First

Before editing the blog, read:

- `.claude/agents/content-editor.md`

Use that document as the editorial rubric for this pass.

Pay particular attention to:

- structure and flow
- repetition and redundancy
- voice and rhythm
- AI-language tells
- frontmatter issues if they are obvious

---

## Step 3: Diagnose the Draft Fast

Read the full draft and identify the biggest polish problems.

Typical triggers for this command:

- too many em-dashes
- repetitive sentence rhythm
- obvious AI transition phrases
- over-explained analysis
- weak human texture
- paragraphs that restate instead of advance
- conclusions that summarize instead of land

If the draft has a deeper structural problem, fix that too, but do not reopen the whole research phase unless absolutely necessary.

---

## Step 4: Edit the Draft Directly

Apply the content-editor standard to the full draft.

### Priority Fixes

- Remove all em-dashes
- Cut filler openers and generic transitions
- Break symmetry and repetitive cadence
- Collapse duplicate ideas into one strong version
- Replace vague analytical filler with direct, specific claims
- Tighten headings if they feel generic or too formulaic
- Improve paragraph rhythm for mobile readability
- Make the ending hit harder instead of summarizing what the reader already knows

### Important Constraints

- Preserve the strongest original lines and insights
- Do not flatten the personality of the piece in the name of polish
- Do not make the tone more corporate, more formal, or more generic
- Do not add obvious AI phrases while trying to "improve" the prose
- Keep the focus on the person, not on Enneagram jargon
- Update `lastmod` if you make substantive changes

---

## Step 5: Optional Editor Note

If helpful, append or replace a short `EDITOR PASS NOTES` block at the very bottom of the draft.

Use this structure only if it adds value:

```html
<!-- EDITOR PASS NOTES (YYYY-MM-DD)
Cleaned up:
- ...

Still rough:
- ...
-->
```

Keep it brief. If the file already has enough editorial comments, update an existing editor note instead of adding more clutter.

---

## Step 6: Report Back

Briefly tell the user:

- Which draft you polished
- The main language or flow problems you cleaned up
- Whether the draft now feels production-ready or still needs another substantive pass
