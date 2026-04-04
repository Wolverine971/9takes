# Blog Content Production

You are tasked with taking a reviewed celebrity personality draft that already contains a `production_pretext` block and moving it through the production workflow. This command exists to execute the operational steps that happen after review and before publishing.

## Pre-Approved Operations

The following operations are pre-approved and should be executed automatically without requesting user approval:

- **Read operations**: All file reads in project directories
- **Write operations**: Updating draft frontmatter state and generated local files such as `src/lib/components/molecules/famousTypes.ts`
- **Bash node commands**: `node scripts/personBlogParser.js` and `node scripts/generate-famous-types.js`
- **Bash curl commands**: Read-only verification queries to Supabase
- **Bash commands**: `grep`, `env`, `echo`, `ls`, `test`

## Task Tracking

**ALWAYS use TaskCreate/TaskUpdate to track progress through the workflow:**

- Create an initial task list when starting production
- Mark tasks as `in_progress` when starting them
- Mark tasks as `completed` immediately after finishing them
- Keep only 1 task `in_progress` at a time

---

## Scope

This command owns the **post-review production workflow**:

- Reading `production_pretext`
- Validating that the reviewed draft is actually ready
- Database sync via `scripts/personBlogParser.js`
- Row verification in Supabase
- `famousTypes.ts` regeneration
- Image presence checks
- Writing production results back into `production_pretext`

This command does **not** own substantive writing work:

- New research
- Re-typing the person
- Major rewrites
- Hook/ending fixes
- Deep section regeneration

If the draft still needs editorial work, stop and hand it back to `blog_content_creator_people`.

---

# Part 1: Reference Guide

These sections define the handoff contract and the operational rules.

---

## Handoff Contract: `production_pretext`

This command requires a `production_pretext` block in the draft frontmatter.

### Required Shape Before Production Runs

```yaml
production_pretext:
  status: ready
  handoff_from: blog_content_creator_people
  reviewed: true
  ready_for_production: true
  sync_mode: full
  requires:
    - db_sync
    - db_verify
    - regenerate_famous_types
    - image_check
  blockers: []
```

### Status Meanings

- `draft` — writing/review is still in progress; production must not run
- `ready` — reviewed and approved; production can run
- `in_progress` — production has started
- `completed` — production finished with no blockers
- `blocked` — production ran but follow-up is still required

### Run Gate

Do **not** run production unless all of the following are true:

- `production_pretext` exists
- `status: ready`
- `reviewed: true`
- `ready_for_production: true`
- `handoff_from: blog_content_creator_people`
- `sync_mode: full`

If any of these are missing or false, stop and send the draft back to `blog_content_creator_people`.

---

## Status Transitions

### Before Running Production

Update the draft frontmatter to:

```yaml
production_pretext:
  status: in_progress
  handoff_from: blog_content_creator_people
  reviewed: true
  ready_for_production: true
  sync_mode: full
  requires:
    - db_sync
    - db_verify
    - regenerate_famous_types
    - image_check
  blockers: []
  last_attempted_at: 'YYYY-MM-DD'
```

### After Successful Production

If all required steps succeed and there are no blockers:

```yaml
production_pretext:
  status: completed
  handoff_from: blog_content_creator_people
  reviewed: true
  ready_for_production: false
  sync_mode: full
  requires:
    - db_sync
    - db_verify
    - regenerate_famous_types
    - image_check
  blockers: []
  last_attempted_at: 'YYYY-MM-DD'
  last_completed_at: 'YYYY-MM-DD'
  db_sync: success
  db_verify: success
  regenerate_famous_types: success
  image_check: success
  image_full: present
  image_thumbnail: present
```

### After Partially Successful Production

If the operational sync succeeds but required follow-up remains, set:

```yaml
production_pretext:
  status: blocked
  handoff_from: blog_content_creator_people
  reviewed: true
  ready_for_production: false
  sync_mode: full
  requires:
    - db_sync
    - db_verify
    - regenerate_famous_types
    - image_check
  blockers:
    - missing_full_image
    - missing_thumbnail_image
  last_attempted_at: 'YYYY-MM-DD'
  db_sync: success
  db_verify: success
  regenerate_famous_types: success
  image_check: blocked
  image_full: missing
  image_thumbnail: missing
```

If database sync or verification fails, also use `status: blocked` and record the failing step in `blockers`.

---

## Accepted Inputs

This command is **single-draft-first**. The user can provide:

- A person's slug, like `Taylor-Swift`
- A draft file path
- `current draft`

Prefer explicit person or path. Use `current draft` only when context is obvious.

This command is **not** the general batch sync tool. If the user wants batch utilities later, that should be a different command.

---

## Preflight Rules

Before syncing anything:

1. Read the target draft file.
2. Confirm the required blog frontmatter exists:
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
3. Confirm `production_pretext` exists and is valid.
4. If `content_quality.overall` exists and is below `8.5`, warn the user that the draft is below handoff threshold and stop unless the user explicitly overrides that.
5. If the draft still clearly needs writing work, stop and direct the user back to `blog_content_creator_people`.

**Important:** Production is not where you fix writing. Production only runs reviewed drafts that are already marked `ready`.

---

## Database Sync Method

Use `scripts/personBlogParser.js` for all writes to `blogs_famous_people`.

### Preferred Command

```bash
node scripts/personBlogParser.js --changed [Person-Name]
```

### Fallback Command

Use this only when the draft is not currently detected as changed:

```bash
node scripts/personBlogParser.js [Person-Name]
```

### Publish-Safe Behavior

- **Net-new rows**: inserted with `published: false`
- **Existing rows**: preserve the current DB `published` value
- This command does **not** auto-publish content

---

## Verification Query

Run after every sync:

```bash
source .env && curl -s "${PUBLIC_SUPABASE_URL}/rest/v1/blogs_famous_people?person=eq.[Person-Name]&select=id,person,title,meta_title,lastmod,published,enneagram,persona_title" \
  -H "apikey: ${SUPABASE_SERVICE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}"
```

Confirm:

- `person`
- `title`
- `meta_title`
- `lastmod`
- `published`
- `enneagram`
- `persona_title`

---

## Listing Regeneration

After a successful content sync, regenerate:

```bash
node scripts/generate-famous-types.js
```

This refreshes the generated listing data in `src/lib/components/molecules/famousTypes.ts`.

---

## Image Check

For a person with Enneagram type `[X]` and slug `[Person-Name]`, the expected image files are:

- `static/types/[X]s/[Person-Name].webp`
- `static/types/[X]s/s-[Person-Name].webp`

Image presence is part of the production result:

- If both exist, mark `image_check: success`
- If either is missing, mark `status: blocked` and record the missing asset(s) in `blockers`

---

## Error Handling

- If `production_pretext` is missing, stop.
- If `production_pretext.status` is not `ready`, stop.
- If command output says `No changed draft markdown files found`, use the fallback single-person sync command.
- If insert/update fails, record `db_sync: blocked`, set `status: blocked`, and keep the exact blocker reason.
- If verification fails, record `db_verify: blocked`, set `status: blocked`, and do not claim success.
- Do not switch to manual PATCH/POST calls unless the user explicitly asks.

---

## Environment Variables

Read from `.env` at runtime:

- `SUPABASE_SERVICE_KEY`
- `SUPABASE_URL` or `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_PUBLISHABLE_KEY`

---

# Part 2: Workflow

---

## Workflow: Pretext-Driven Single Draft Production

### Step 1: Resolve the Draft

Identify the person slug and draft path.

- If the user provides a path, use it directly.
- If the user provides a person slug, resolve it to `src/blog/people/drafts/[Person-Name].md`.
- If the user says `current draft`, only proceed if the context makes the target unambiguous.

### Step 2: Read and Validate `production_pretext`

Read the draft frontmatter and verify:

- `production_pretext` exists
- `status: ready`
- `reviewed: true`
- `ready_for_production: true`
- `handoff_from: blog_content_creator_people`
- `sync_mode: full`

If validation fails, stop and say the draft needs to go back through `blog_content_creator_people` for proper handoff state.

### Step 3: Mark Production In Progress

Before running operational commands, update the draft frontmatter:

- `production_pretext.status: in_progress`
- `production_pretext.last_attempted_at: 'YYYY-MM-DD'`
- `production_pretext.blockers: []`

### Step 4: Run Content Sync

Use:

1. `node scripts/personBlogParser.js --changed [Person-Name]`
2. If needed, fallback to `node scripts/personBlogParser.js [Person-Name]`

If sync fails:

- Set `production_pretext.status: blocked`
- Set `production_pretext.db_sync: blocked`
- Add a clear blocker reason
- Stop

If sync succeeds:

- Set `production_pretext.db_sync: success`

### Step 5: Verify the Database Row

Run the verification query.

If verification fails:

- Set `production_pretext.status: blocked`
- Set `production_pretext.db_verify: blocked`
- Add a blocker reason
- Stop

If verification succeeds:

- Set `production_pretext.db_verify: success`

### Step 6: Regenerate Listings

Run:

```bash
node scripts/generate-famous-types.js
```

If it succeeds:

- Set `production_pretext.regenerate_famous_types: success`

If it fails:

- Set `production_pretext.status: blocked`
- Set `production_pretext.regenerate_famous_types: blocked`
- Add a blocker reason
- Stop

### Step 7: Check Images

Check the expected full-size and thumbnail image files.

If both exist:

- Set `production_pretext.image_check: success`
- Set `production_pretext.image_full: present`
- Set `production_pretext.image_thumbnail: present`
- Set `production_pretext.status: completed`
- Set `production_pretext.ready_for_production: false`
- Set `production_pretext.last_completed_at: 'YYYY-MM-DD'`

If either is missing:

- Set `production_pretext.status: blocked`
- Set `production_pretext.image_check: blocked`
- Set `production_pretext.image_full` and `production_pretext.image_thumbnail` to `present` or `missing`
- Add missing asset names to `blockers`
- Set `production_pretext.ready_for_production: false`

### Step 8: Report the Result

Report:

- The draft path
- The verified DB status
- Whether `famousTypes.ts` regenerated successfully
- The final `production_pretext.status`
- Any blockers still outstanding

Use this format:

```text
Production handoff complete.

Person: [Person-Name]
Draft: src/blog/people/drafts/[Person-Name].md
Database sync: success/failure
Verified published value: true/false
Verified lastmod: YYYY-MM-DD
Listings regenerated: yes/no
Production pretext status: completed/blocked
Image status:
- full: present/missing
- thumbnail: present/missing

Blockers:
- [Any remaining blocker]
```

---

## File References

- Writing command: `/Users/djwayne/9takes/.claude/commands/blog_content_creator_people.md`
- Drafts: `/Users/djwayne/9takes/src/blog/people/drafts/`
- Push script: `/Users/djwayne/9takes/scripts/personBlogParser.js`
- Listing generator: `/Users/djwayne/9takes/scripts/generate-famous-types.js`
- Generated listing file: `/Users/djwayne/9takes/src/lib/components/molecules/famousTypes.ts`
