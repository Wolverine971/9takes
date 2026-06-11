<!-- .claude/commands/blog_content_publish_pop_culture.md -->
# Blog Content Publisher (Pop-Culture)

You are tasked with publishing one ready pop-culture personality analysis draft for 9takes. This command is intentionally operational: it does not rewrite the article, re-research the topic, or fix substantive editorial gaps.

This is the **pop-culture sibling** of `/blog_content_publish_people`. Pop-culture blogs are MDsvex files under `src/blog/pop-culture/` (not the database-driven famous-people pipeline), so the publish workflow is file-based: validate the draft, flip `published: true`, bump dates, regenerate sitemap, sync the search index.

## Input

The user can provide one of:

- A draft file path (preferred), like `src/blog/pop-culture/the-office-enneagram-types.md`
- A slug, like `the-office-enneagram-types`
- No argument, which auto-selects the top eligible unpublished draft (oldest `date:` first, skipping templates and stubs)

`$ARGUMENTS`

## Pre-Approved Operations

The following operations are pre-approved and should be executed automatically without requesting user approval:

- **Read operations**: All file reads in project directories
- **Write operations**: Updating the selected draft's frontmatter (`published`, `date`, `lastmod` fields only — never touch the body or other frontmatter fields)
- **Bash pnpm commands**: `pnpm gen:sitemap`, `pnpm index:blogs`, `pnpm gen:crosslinks`, `pnpm gen:all`
- **Bash commands**: `grep`, `rg`, `ls`, `test`, `wc`, `git diff`, `git status`

NOT pre-approved (must ask DJ first):

- `git commit` / `git push`
- Editing the draft body, removing fields, or rewriting frontmatter beyond the three publish fields
- Publishing multiple drafts in one run (one per invocation)

## Task Tracking

Use TaskCreate/TaskUpdate to track progress:

- Resolve target or candidate pool
- Run validation gates
- Flip frontmatter
- Regenerate sitemap + search index
- Verify diff
- Report result

Keep only one task `in_progress` at a time.

---

## Scope

This command owns the final release step for one pop-culture draft:

- Pick one eligible unpublished pop-culture draft
- Validate frontmatter completeness
- Validate body quality (length, section count, no placeholder markers)
- Validate `picGroup` images exist on disk
- Validate `loc` URL matches the file slug
- Set frontmatter `published: true`, `date: <today>`, `lastmod: <today>`
- Preserve the draft's existing frontmatter quote style, inline arrays, field order, and text casing
- Run `pnpm gen:sitemap` to add the URL to the sitemap
- Run `pnpm index:blogs` to sync the post to Supabase blog search FTS
- Verify the diff

This command does NOT own:

- New research
- Editorial rewrites (call `/blog_content_editor_pass_people` is not applicable — use `editor` for pop-culture too)
- Image generation
- Manual Supabase patches outside `index-blogs-to-supabase.js`
- Firing distribution / social posts (DJ runs distribution commands)
- Bulk publishing of multiple drafts

If validation blocks the draft, stop and report the blockers. Do not bypass any gate unless DJ explicitly asks.

### Parallel-work safety

Before any write:

1. Run `git status` and confirm the target file has no uncommitted body changes you'd clobber.
2. If the target draft already shows uncommitted edits, stop and ask DJ whether to publish the disk state or wait.
3. NEVER mass-flip flags across multiple drafts in one run.

---

## Workflow

### Step 1: Resolve target

If the user supplied a slug:

- Resolve to `src/blog/pop-culture/<slug>.md`
- If the file doesn't exist, stop and report.

If the user supplied a file path:

- Use it directly. Confirm it lives under `src/blog/pop-culture/`.

If the user supplied no argument:

- Scan `src/blog/pop-culture/*.md`
- Skip: `template.md`, files with no frontmatter, files with `published: true`, and files whose names appear in §"Not real drafts" of the most recent marketing-status brief
- Among the remaining, pick the one with the oldest `date:` value (oldest first to flush the queue)
- Report the selection and continue

### Step 2: Validate the draft (the gate)

Reject the draft if ANY of the following fails. Report every blocker (not just the first one).

**Frontmatter completeness — all of these must be present:**

- `title` (non-empty string)
- `meta_title` (non-empty string)
- `description` (non-empty string)
- `author` (non-empty string)
- `date` (ISO string `YYYY-MM-DD`)
- `loc` (URL of form `https://9takes.com/pop-culture/<slug>`)
- `lastmod` (ISO date)
- `changefreq` (string, typically `monthly`)
- `priority` (string, typically `'0.6'`)
- `published` (must currently be `false` or missing — if already `true`, the draft is already published; abort)
- `type` (array, non-empty)
- `blog: true`
- `pic` (string, slug of the composite image)
- `picGroup` (array with at least 1 entry, each having `image`, `text`, `enneagramType`)
- `path` (string matching the file path)
- `popCulture` (object with `category`, `subcategory`, `series`)

**Body quality — all of these must hold:**

- Body (everything after the closing `---` of frontmatter) has at least **1000 words**
- Body has at least **5 `##` H2 sections**
- Body contains **no placeholder markers**: case-insensitive matches for `TODO`, `TBD`, `PLACEHOLDER`, `XXX`, `[FIXME]`, `<!-- TODO`, `<!-- placeholder`. (HTML comments that are not placeholders, e.g., the file-path comment, are fine.)

**Asset checks:**

- For every entry in `picGroup`, the file at `static<picGroup[i].image>` must exist. (e.g., `picGroup` entry `/types/9s/Steve-Carell.webp` → `static/types/9s/Steve-Carell.webp`.)
- The `loc` URL slug must match the file's basename (without `.md`). E.g., file `the-office-enneagram-types.md` requires `loc` to end with `/pop-culture/the-office-enneagram-types`.

If any gate fails, stop and report the full blocker list. Use this format:

```text
Cannot publish: <slug>

Blockers:
- <one-line blocker>
- <one-line blocker>

Next step: <one short suggestion, e.g., "Add 3 more ## sections" or "Generate static/types/9s/Steve-Carell.webp">
```

Do not flip the publish flag if anything fails.

### Step 3: Flip frontmatter

Use Edit to make the minimum necessary changes:

- `published: false` → `published: true`
- `date: '<old>'` → `date: '<today, YYYY-MM-DD>'`
- `lastmod: '<old>'` → `lastmod: '<today, YYYY-MM-DD>'`

Today's date comes from the runtime's `currentDate`, not from invention. If you cannot determine today's date reliably, ask DJ.

Preserve:

- Quote style (single vs double; pop-culture uses single quotes)
- Field order
- Indentation
- All other frontmatter fields
- The entire body (do not touch it)

Confirm the file state with a quick `git diff -- <file>` after editing. If the diff shows any change beyond the three target lines, stop and ask DJ before continuing.

### Step 4: Regenerate sitemap + search index

Run these in order (sequential; the second depends on the first being clean):

```bash
pnpm gen:sitemap
pnpm index:blogs
```

If either fails, stop and report the error. Do not try to revert the frontmatter automatically — surface the error so DJ can decide.

### Step 5: Verify

Check the diff:

```bash
git diff --stat -- src/blog/pop-culture static/sitemap.xml docs/BLOG-CROSSLINK-INDEX.md
```

Confirm:

- The selected draft has `published: true`
- The selected draft has today's `date` and `lastmod`
- `static/sitemap.xml` now contains the post's `loc` URL (grep for the slug)
- `index-blogs-to-supabase.js` output indicated the post was upserted (look for the slug in stdout)

If sitemap doesn't contain the URL: stop and report. The post is half-published.

### Step 6: Report

```text
Published pop-culture blog.

File: src/blog/pop-culture/<slug>.md
Title: <title>
Date/lastmod: YYYY-MM-DD
Sitemap: URL present
Search index: upserted to Supabase blogs_content
picGroup: N images, all present on disk

Blockers: none

Suggested follow-up:
- Distribution: does a packet exist in docs/distribution-assets/? If yes, name it. If no, /distribute may apply.
- Internal links: pnpm gen:crosslinks (optional; included in pnpm gen:all)
- Commit: not done. To commit, ask DJ — sample message below.
  publish(pop-culture): <slug>
```

If a distribution packet exists matching the slug, name it explicitly. Do not fire it.

---

## Common blocker recipes (what to recommend when gated)

| Blocker                   | Fix recipe                                                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Body < 1000 words         | Call the `editor` agent or `/blog_content_fresh_eyes_people` (pop-culture adaptation) to expand                                             |
| < 5 `##` sections         | Add structural headers; this is usually a thin outline, not a real article                                                                  |
| `picGroup` image missing  | Either generate the asset, swap to an existing portrait under `static/types/`, or remove the entry                                          |
| `loc` slug mismatch       | Edit `loc` to match the file's basename; never rename the file just to fit the URL                                                          |
| `popCulture` missing      | Fill in `category`, `subcategory`, `series` from `src/blog/pop-culture/template.md` if present, or by analogy with a sibling published post |
| Placeholder markers       | Find the TODO/TBD, finish the section, or remove the bracket                                                                                |
| Already `published: true` | Abort. The draft is already live. Check sitemap to confirm.                                                                                 |

---

## File References

- Drafts + published posts: `/Users/djwayne/9takes/src/blog/pop-culture/`
- Sitemap generator: `/Users/djwayne/9takes/scripts/generate-sitemap.js`
- Search indexer: `/Users/djwayne/9takes/scripts/index-blogs-to-supabase.js`
- Sitemap output: `/Users/djwayne/9takes/static/sitemap.xml`
- Crosslink index (regenerated by `pnpm gen:crosslinks`): `/Users/djwayne/9takes/docs/BLOG-CROSSLINK-INDEX.md`
- Related: `.claude/commands/blog_content_publish_people.md` (sibling command for people drafts)
- Marketing orchestrator: `.claude/agents/marketing-pm.md`
