<!-- .claude/commands/blog_content_publish_people.md -->

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
- Require `content_quality.rubric_version: 2` — v1 grades were inflated and discoverability-blind; a v1-graded draft must be re-graded with `/grade_blog` before it can publish
- Require `content_quality.discoverability >= 7` (the v2 discoverability gate, enforced at publish, not just at grading)
- Require `content_quality.caps_applied` to be empty
- Require `content_quality.needs_review` to be false or absent
- Require grade stability as `content_quality.grade_stability_delta <= 0.3`, or as `first_overall` / `regrade_overall` with absolute delta <= 0.3
- Require `scripts/blog-source-audit.mjs` to find zero untagged quotes in the epigraph or cold open
- Require a completed six-perspective review whose final verification passed and whose reader-visible content hash still matches the draft
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

The perspective-review gate hashes reader/search-facing editorial frontmatter (`title`, `meta_title`, `persona_title`, `description`, `enneagram`, `person`, and `faqs`) plus the visible body. It ignores grades, dates, production metadata, and editorial HTML comments. Any review-sensitive title, FAQ, prose, or structural edit requires reverification/finalization by the full blog pipeline.

**The same gate now runs on the update paths.** Until 2026-09-01 it guarded only `--publish`, so a post could publish clean, get substantially rewritten, and be pushed back to production through `--sync` or `--apply` with its verification pointing at text that no longer existed. Ten of the thirty most recent published posts reached production that way, seven of them after rewrites touching 12–49% of the body. `--sync` and `--apply` now refuse to update reader-visible fields on a published row when the verification is stale or missing. A dry run prints `would block:` so you see it before the apply cycle. `--skip-perspective-gate` exists as a deliberate, logged override; it is not for getting past a stale gate you have not read.

The script rejects candidates with:

- Missing required frontmatter
- Missing or invalid `content_quality`
- `content_quality.overall < 8.5`
- Stale grade: `rubric_version` missing or < 2 (blocker says `stale_grade_rubric_v1:re-run /grade_blog`)
- `discoverability` missing or < 7
- Active caps in `content_quality.caps_applied`
- `content_quality.needs_review: true`
- Missing or unstable grade-stability delta
- Untagged load-bearing quote in the epigraph or cold open from `scripts/blog-source-audit.mjs`
- Missing, unresolved, invalid, or stale perspective-review verification at `docs/content-analysis/perspective-reviews/[Person]/latest.json`
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

### Step 4: Attach the Chorus Question (REQUIRED)

A personality-analysis page with no Chorus question has **no call to action at all**. The
`NineChorus` component opens with `{#if question}`, so a missing question renders nothing — not a
weaker ask, nothing. Between 2026-07-01 and the 2026-09-01 audit, 67 consecutive posts published
this way and every one of them shipped with the give-first funnel switched off.

Generate a candidate and show it to DJ:

```bash
node scripts/generate-chorus.mjs --slug=[person-slug]
```

This is read-only; it writes nothing. Print the winning question for approval. Once DJ approves the
exact wording (his edit wins over the generated copy), publish it and its nine takes:

```bash
node scripts/generate-chorus.mjs --slug=[person-slug] \
  --question="[exact approved copy]" --publish
```

Then confirm the row actually carries it:

```bash
./scripts/db-query.sh "SELECT person, chorus_question, chorus_question_url FROM blogs_famous_people WHERE person='[person-slug]'"
```

If `chorus_question_url` is null, the page has no CTA. **Report this as a blocker, not a warning.**
The post is published but incomplete until the question is attached.

### Step 5: Report

Use this format:

```text
Published people blog.

Person: [person]
Draft: src/blog/people/drafts/[Person].md
Date/lastmod: YYYY-MM-DD
Supabase: published=true
Images: full + thumbnail present
Chorus question: "[approved question]" -> /questions/[url]
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
