# Blog Content Publisher

You are tasked with publishing one ready celebrity personality analysis draft for 9takes. This command is intentionally operational: it does not rewrite the article, re-type the person, or fix substantive editorial gaps.

## Input

The user can provide one of:

- A person's slug, like `Ed-Sheeran`
- A draft file path
- No argument, which publishes the top eligible unpublished draft automatically

`$ARGUMENTS`

## Pre-Approved Operations

The following operations are pre-approved and should be executed automatically without requesting user approval:

- **Read operations**: All file reads in project directories
- **Write operations**: Updating the selected draft's frontmatter publish state
- **Bash node commands**: `node scripts/personBlogParser.js ... --publish`
- **Bash pnpm commands**: `pnpm gen:all`, when invoked by the publish script
- **Bash commands**: `grep`, `rg`, `ls`, `test`, `git diff`

## Task Tracking

Use TaskCreate/TaskUpdate to track progress:

- Resolve target or candidate pool
- Run publish command
- Verify generated files changed as expected
- Report result

Keep only one task `in_progress` at a time.

---

## Scope

This command owns the final release step:

- Pick one eligible unpublished people draft
- Require complete frontmatter
- Require `content_quality.overall >= 8.5`
- Require the draft to look like a real article, not a skeleton or outline
- Require both personality image files:
  - `static/types/[type]s/[Person].webp`
  - `static/types/[type]s/s-[Person].webp`
- Set frontmatter `date`, `lastmod`, and `published`
- Preserve the selected draft's existing frontmatter quote style, inline arrays, field order, and text casing
- Sync the post to Supabase
- Set Supabase `published: true`
- Set Supabase `date`, `lastmod`, and `created_at` to the publish date/time
- Run `pnpm gen:all`

This command does not own:

- New research
- Major rewrites
- Image generation
- Manual Supabase patches outside the publish script

If the publish script blocks the draft, stop and report the blockers. Do not bypass the gate unless the user explicitly asks.

---

## Workflow

### Step 1: Resolve Invocation

If the user supplied a person slug or name:

```bash
node scripts/personBlogParser.js [Person-Name] --publish
```

If the user supplied no argument:

```bash
node scripts/personBlogParser.js --publish
```

If the user supplied a draft file path, derive the person from the file's `person` frontmatter, then run the person form.

### Step 2: Let the Script Gate the Publish

The script performs the publish checks. Do not duplicate those rules manually unless troubleshooting a blocker.

The script rejects candidates with:

- Missing required frontmatter
- Missing or invalid `content_quality`
- `content_quality.overall < 8.5`
- Too little article body content
- Too few `##` sections
- TODO/placeholder/outline markers
- Missing full image
- Missing thumbnail image
- Already published rows when auto-selecting with no person argument

### Step 3: Verify Local Generated Files

After the command finishes, inspect the relevant diff:

```bash
git diff -- src/blog/people/drafts scripts/personBlogParser.js src/lib/components/molecules/famousTypes.ts static/sitemap.xml
```

Confirm:

- The selected draft now has `published: true`
- The selected draft has today's `date` and `lastmod`
- `src/lib/components/molecules/famousTypes.ts` has `link: true`, `hasImage: true`, and today's `lastmod`
- `static/sitemap.xml` includes the selected personality-analysis URL

### Step 4: Report

Use this format:

```text
Published people blog.

Person: [person]
Draft: src/blog/people/drafts/[Person].md
Date/lastmod: YYYY-MM-DD
Supabase: published=true
Images: full + thumbnail present
Generated files: pnpm gen:all completed

Blockers:
- none
```

If blocked, report the exact blockers from the script and stop.

---

## File References

- Publish script: `/Users/djwayne/9takes/scripts/personBlogParser.js`
- Drafts: `/Users/djwayne/9takes/src/blog/people/drafts/`
- Generated listing file: `/Users/djwayne/9takes/src/lib/components/molecules/famousTypes.ts`
- Sitemap: `/Users/djwayne/9takes/static/sitemap.xml`
