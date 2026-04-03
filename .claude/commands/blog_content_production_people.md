# Blog Content Production

You are tasked with handling the production handoff for celebrity personality analysis drafts on 9takes. This command exists to take a reviewed draft and move it through the operational steps that happen before or around publishing.

## Pre-Approved Operations

The following operations are pre-approved and should be executed automatically without requesting user approval:

- **Read operations**: All file reads in project directories
- **Write operations**: Updating generated local files such as `src/lib/components/molecules/famousTypes.ts`
- **Bash node commands**: `node scripts/personBlogParser.js` and `node scripts/generate-famous-types.js`
- **Bash curl commands**: Read-only verification queries to Supabase
- **Bash commands**: `grep`, `env`, `echo`, `ls`, `test`

## Task Tracking

**ALWAYS use TaskCreate/TaskUpdate to track progress through the workflow:**

- Create an initial task list when starting production handoff
- Mark tasks as `in_progress` when starting them
- Mark tasks as `completed` immediately after finishing them
- Keep only 1 task `in_progress` at a time

---

## Scope

This command owns the **production workflow after draft review**:

- Preflight checks on the finalized draft
- Database sync via `scripts/personBlogParser.js`
- Row verification in Supabase
- `famousTypes.ts` regeneration
- Image presence checks and follow-up notes
- Production status reporting

This command does **not** own substantive writing work:

- New research
- Re-typing the person
- Major structural rewrites
- Tone or narrative fixes
- Deep section regeneration

If the draft still needs meaningful editorial work, stop and hand it back to `blog_content_creator_people`.

---

# Part 1: Reference Guide

These sections define the operational rules. The workflows in Part 2 should follow them.

---

## When To Run This Command

Run `blog_content_production_people` only after:

1. The draft exists in `src/blog/people/drafts/`
2. The user has reviewed the draft or explicitly approved it for handoff
3. The draft is ready to be synced operationally

This command should be the step that happens **after `blog_content_creator_people` and before publishing**.

---

## Accepted Inputs

The user can provide one of:

- A person's slug, like `Taylor-Swift`
- A draft file path
- `current draft`
- `batch changed`
- `grades only`

Default behavior: if there is an obvious current person draft in context, treat that as the target.

---

## Preflight Rules

Before syncing anything:

1. Read the draft file.
2. Confirm the required frontmatter is present:
   - `title`
   - `meta_title`
   - `persona_title`
   - `description`
   - `lastmod`
   - `published`
   - `enneagram`
   - `type`
   - `person`
   - `suggestions`
3. Check whether the draft still looks editorially unfinished.
4. If `content_quality.overall` exists and is below `8.5`, warn the user that the draft is below handoff threshold.
5. If the draft clearly still needs writing work, stop and direct the user back to `blog_content_creator_people`.

**Important:** Production handoff is not the place to fix a weak hook, flatten repetition, or rewrite whole sections. Those go back to the writing command.

---

## Database Sync Method

Use `scripts/personBlogParser.js` for all writes to `blogs_famous_people`.

### Standard Commands

```bash
# Push only changed drafts in src/blog/people/drafts
node scripts/personBlogParser.js --changed

# Push one changed person draft
node scripts/personBlogParser.js --changed [Person-Name]

# Push one person by slug (fallback if draft is not currently changed)
node scripts/personBlogParser.js [Person-Name]

# Push only content_quality grades for changed drafts
node scripts/personBlogParser.js --grades-only --changed

# Push only content_quality grades for one person
node scripts/personBlogParser.js --grades-only [Person-Name]
```

### Selection Rules

- **Single reviewed draft**: use `node scripts/personBlogParser.js --changed [Person-Name]`
- **Fallback when draft is not currently changed**: use `node scripts/personBlogParser.js [Person-Name]`
- **Batch sync for multiple changed drafts**: use `node scripts/personBlogParser.js --changed`
- **Grade-only sync**: use `--grades-only`

### Publish-Safe Behavior

- **Net-new rows**: inserted with `published: false`
- **Existing rows**: preserve the current DB `published` value
- This command does **not** auto-publish content

---

## Verification Query

Run after every single-person sync:

```bash
source .env && curl -s "${PUBLIC_SUPABASE_URL}/rest/v1/blogs_famous_people?person=eq.[Person-Name]&select=id,person,title,meta_title,lastmod,published,enneagram,persona_title" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}"
```

For batch syncs, verify the rows that were actually processed if the batch is small enough to inspect individually. Otherwise summarize the script output and note that the DB sync completed.

---

## Listing Regeneration

After a successful content sync, regenerate `src/lib/components/molecules/famousTypes.ts`:

```bash
node scripts/generate-famous-types.js
```

This refreshes:

- `link`
- `hasImage`
- `lastmod`
- `personaTitle`
- `contentGrade`

for the listing pages.

---

## Image Check

For a person with Enneagram type `[X]` and slug `[Person-Name]`, the expected image files are:

- `static/types/[X]s/[Person-Name].webp`
- `static/types/[X]s/s-[Person-Name].webp`

After syncing the draft:

1. Check whether both image files exist.
2. Report what is present and what is missing.
3. If images are missing, tell the user the draft was synced but image work is still outstanding.
4. If images are added later, rerun `blog_content_production_people` or at minimum rerun `node scripts/generate-famous-types.js`.

---

## Error Handling

- If command output says `No changed draft markdown files found`, either use the fallback single-person command or confirm that the draft was actually saved.
- If insert/update fails, report the exact script error.
- If verification fails, report that clearly and do not claim success.
- Do not switch to manual PATCH/POST calls unless the user explicitly asks.

---

## Environment Variables

Read from `.env` at runtime:

- `SUPABASE_SERVICE_KEY`
- `SUPABASE_URL` or `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_PUBLISHABLE_KEY` (used by `generate-famous-types.js`)

---

# Part 2: Workflows

---

## Workflow: Single Draft Handoff

### Step 1: Resolve the Target

Identify the person slug and draft path.

- If the user provides a path, use it directly.
- If the user provides a person slug, resolve it to `src/blog/people/drafts/[Person-Name].md`.
- If the current draft is obvious from context, use that.

### Step 2: Run Preflight

Read the draft and verify:

- Required frontmatter exists
- The file appears finalized enough for handoff
- `content_quality` does not indicate an obviously below-threshold draft, unless the user explicitly wants to continue anyway

If the draft still needs substantive writing work, stop and say it should go back through `blog_content_creator_people` first.

### Step 3: Sync the Draft

Use the safest applicable command:

1. Try `node scripts/personBlogParser.js --changed [Person-Name]`
2. If there are no changed draft files, use `node scripts/personBlogParser.js [Person-Name]`

### Step 4: Verify the Row

Run the verification query and confirm:

- `person`
- `title`
- `meta_title`
- `lastmod`
- `published`
- `enneagram`
- `persona_title`

### Step 5: Check Images

Check whether the expected full-size and thumbnail image files exist for the person's type and slug.

### Step 6: Regenerate Listings

Run `node scripts/generate-famous-types.js`.

### Step 7: Report Production Status

Report:

- Draft synced successfully or not
- Verified DB values
- Whether `famousTypes.ts` was regenerated successfully
- Which image files exist or are missing
- Any remaining production follow-up needed

Use this format:

```text
Production handoff complete.

Person: [Person-Name]
Draft: src/blog/people/drafts/[Person-Name].md
Database sync: success/failure
Verified published value: true/false
Verified lastmod: YYYY-MM-DD
Listings regenerated: yes/no
Image status:
- full: present/missing
- thumbnail: present/missing

Next steps:
- [Any remaining follow-up]
```

---

## Workflow: Batch Changed Drafts

Use this when the user explicitly asks to sync all changed people drafts.

1. Run `node scripts/personBlogParser.js --changed`
2. Summarize which drafts were processed
3. Run `node scripts/generate-famous-types.js`
4. Report any obvious failures from script output

If batch image checking would be noisy, summarize only the production sync and note that image follow-up may still be required per person.

---

## Workflow: Grades Only

Use this only when the user explicitly wants to sync grading without syncing content.

1. Single person: `node scripts/personBlogParser.js --grades-only [Person-Name]`
2. Batch changed: `node scripts/personBlogParser.js --grades-only --changed`
3. Report which rows were updated or skipped

---

## File References

- Writing command: `/Users/djwayne/9takes/.claude/commands/blog_content_creator_people.md`
- Drafts: `/Users/djwayne/9takes/src/blog/people/drafts/`
- Push script: `/Users/djwayne/9takes/scripts/personBlogParser.js`
- Listing generator: `/Users/djwayne/9takes/scripts/generate-famous-types.js`
- Generated listing file: `/Users/djwayne/9takes/src/lib/components/molecules/famousTypes.ts`
