<!-- docs/design/2026-05-01-question-categories-audit.md -->

# Question Categories — UI Audit & Fix Log

> Living doc. Source of truth for the question-categories cleanup pass started 2026-05-01.
> Status: **All three waves shipped.** Awaiting browser verification.

## 0. Why this exists

DJ asked for an audit of the `/questions`, `/questions/categories`, and `/questions/categories/[slug]` surfaces. The hierarchical category tree (root → topic → subtopic → leaf) is well-modeled in the database, and empty-branch pruning works correctly, but the UI does not surface the hierarchy. Breadcrumbs in particular are computed server-side and then never rendered. This doc captures the audit + tracks the fix work.

## 1. Confirmed working

### Empty-branch pruning

- `buildVisibleQuestionCategoryTree` → `pruneEmptyBranches` (`src/lib/server/questionCategoryTree.ts:192-222`) walks every root and drops any node whose total subtree has zero non-removed questions.
- Used by both `/questions/categories/+page.server.ts:47` and `/questions/categories/[slug]/+page.server.ts:95`.
- The pill rail on `/questions` uses a stricter filter (`listQuestionCategoriesWithDirectQuestions`) which only surfaces categories that have _direct_ questions. Both behaviors are correct; just two different rules for two different surfaces.

## 2. Findings

### F1 — Breadcrumbs computed but never rendered (CRITICAL)

`/questions/categories/[slug]/+page.server.ts:101-106` builds a full `parents` chain (id, name, slug, level for every ancestor up to and including the current category) and returns it. **`+page.svelte` never reads it.** A user landing on a deep leaf like _Salary Negotiation_ sees:

- An `<h1>` with the category name
- Children below it
- No indication of what it sits under, no link back up the tree, no link back to `/questions/categories`

A polished `Breadcrumbs.svelte` already exists in `src/lib/components/blog/` that takes `BreadcrumbItem[]` and emits microdata. Drop it in above the `<h1>` using `data.parents`.

### F2 — JSON-LD breadcrumb on category page is flat

`/questions/categories/[slug]/+page.svelte:80-108` emits `Home › Questions › Categories › {leaf}` regardless of depth. With `parents` already loaded, this should be `Home › Questions › Categories › {root} › {mid} › {leaf}` — same fix powers both the visible breadcrumb and the structured data, which helps Google sitelinks.

### F3 — Question detail page has the same problem

`/questions/[slug]/+page.svelte:407-411` emits only `Home › Questions › {question text}` — the question's category is never in the breadcrumb. The page has `data.questionTags` (already loaded with `question_categories` joined) so we have everything needed to insert a category-aware breadcrumb between _Questions_ and the question text. Pick the deepest leaf tag (highest `level`), reconstruct its ancestor chain, slot it in.

### F4 — No "back to parent" anywhere on a category page

Even a single chip ("← Career & Money") would help orient on mobile, where the header nav is a hamburger. Solved by F1 in practice.

### F5 — `<h1>` on the category page has no count

Tree shows `12 questions` on the way in, then disappears. Adding a small meta line under the `<h1>` (`3 directly tagged · 12 in this branch`) answers the obvious next question.

### F6 — `CategoryBrowseBranch` recursion creates visual weight at depth ≥3

Every middle node gets its own padded/bordered card. A 3-level chain ends up as card-in-card-in-card. Consider collapsing depth ≥2 into a flat indented list (or a `<details>` toggle) to reduce nesting noise.

### F7 — Mobile leaf links wrap to two lines

`.leaf-link` switches to `flex-direction: column` at <640px (`CategoryBrowseBranch.svelte:225-244`). Every leaf becomes ~80px tall. Keeping name + pill on one line with `min-width: 0` + `text-overflow: ellipsis` would tighten the list significantly.

### F8 — Hero copy on `/questions/categories` is misleading

> "larger pills usually mean a deeper library."

The pill is `subtreeQuestionCount`, which measures _breadth_ (# of questions), not depth (# of nesting levels). Either drop the sentence or change "deeper" to "more questions".

### F9 — Redundant H2 on category detail

`Subcategories With Live Questions` is redundant after the tree-wide promise. "Browse subcategories" is enough.

### F10 — Stat chips on the categories landing read as duplicative jargon

"Visible categories" + "topic groups" — a single line of prose (`47 categories across 6 topics`) would be cleaner than two pill stats.

### F11 — Inconsistent surface conventions

The `/questions` pill rail (atoms-style chips) and `/questions/categories` (cards + nested cards + pills) feel like two different products. Picking one visual vocabulary would help if users are expected to switch between them.

### F12 — Loader N+1 risk (not UI, but worth noting)

Both category endpoints select `question_category_tags` and the full `questions` id list on every request. As tags grow, this should move to an RPC. Not blocking.

## 3. Plan / Status

Sequential. Update status as work proceeds. Items marked **(now)** are in the first wave.

### Wave 1 — Breadcrumbs (shipped)

- [x] F1 · Render `<Breadcrumbs items={...} />` from `data.parents` on `/questions/categories/[slug]` — _done 2026-05-01_
- [x] F2 · Extend JSON-LD breadcrumb on category page with parents chain — _done 2026-05-01_
- [x] F3 · Add category-aware breadcrumb (visible + JSON-LD) on `/questions/[slug]` — _done 2026-05-01_

**What changed**

- `src/routes/questions/categories/[slug]/+page.svelte` — imports `Breadcrumbs` + `BreadcrumbItem`, builds `breadcrumbItems` from `data.parents`, renders the chain above the `<h1>`, and feeds the same chain into the JSON-LD `BreadcrumbList`.
- `src/routes/questions/[slug]/+page.svelte` — derives the question's deepest tagged category from `data.questionTags`, builds a `Home › Questions › Categories › {Category} › {Question}` chain, renders it above `QuestionDisplay`, and updates `questionStructuredData` to emit the same chain. (Question detail breadcrumb stops at the deepest leaf category — the category page itself shows the full ancestor chain via F1, so users get the full hierarchy with one extra click.)
- `src/lib/types/questions.ts` — extended `QuestionCategory` with `parent_id` and `level` (DB columns that were already returned by the loader's `select(*, question_categories(*))`).

**Verification**

- `pnpm exec svelte-check` — 0 errors after fix.
- Browser verification: pending DJ refresh — no dev server started by Claude, no screenshot taken.

### Wave 2 — Quick wins (shipped)

- [x] F5 · Add direct + nested count line under category H1 — _done 2026-05-01_
- [x] F8 · Fix hero copy on `/questions/categories` ("deeper" → "more questions") — _done 2026-05-01_
- [x] F9 · Rename H2 to "Browse subcategories" — _done 2026-05-01_
- [x] F7 · Keep mobile leaf links on a single line with truncation — _done 2026-05-01_

**What changed**

- `src/routes/questions/categories/[slug]/+page.server.ts` — loader now returns `currentCategory: { directQuestionCount, subtreeQuestionCount }` from the already-computed `currentCategoryNode`, so the view can show counts without a second query.
- `src/routes/questions/categories/[slug]/+page.svelte` — renders a `category-meta` line under the H1 (`12 questions directly tagged · 35 more in subcategories`); collapses to just the direct count when there's no nested overflow; renamed the children H2 to **Browse subcategories**.
- `src/routes/questions/categories/+page.svelte` — hero note rewritten so "bigger pills mean more questions" instead of the misleading "deeper library."
- `src/lib/components/questions/CategoryBrowseBranch.svelte` — leaf links keep `flex-direction: row` at all breakpoints; the label gets `min-width: 0` + `text-overflow: ellipsis`; only `.root-head` / `.branch-head` (the kicker + title pair) still stack vertically on mobile.

**Verification**

- `pnpm exec svelte-check` — 0 errors after Wave 2.
- Browser verification: pending DJ refresh.

### Wave 3 — Visual cleanup (shipped)

- [x] F10 · Collapse duplicate stat chips into a single prose line — _done 2026-05-01_
- [x] F6 · Flatten `CategoryBrowseBranch` chrome at depth ≥2 — _done 2026-05-01_
- [x] F11 · Cross-link the rail and the tree — _done 2026-05-01_

**What changed**

- `src/routes/questions/categories/+page.svelte` — replaced the two `.stat-chip` blocks with a single prose line (`47 categories across 6 topic groups`); removed the now-unused `.stat-chip` styles and their mobile breakpoints; appended an inline `Or filter the questions feed →` link to the tree note for the F11 cross-link back to `/questions`.
- `src/routes/questions/+page.svelte` — replaced the static `{n} categories` count next to the **Browse by Category** rail with a `Browse the full tree →` link to `/questions/categories`. Same surface count is already implicit in the rail itself; the cross-link is more useful.
- `src/lib/components/questions/CategoryBrowseBranch.svelte` — `.nested-card` (full padded card) replaced with `.branch-card--flat` for any branch at depth >1: drops the border + background + radius and uses an indented left border + uppercase eyebrow heading instead. A 4-level chain now reads as one card → one card → indented heading → leaf, instead of card-in-card-in-card. `.branch-link--flat` styles the deep heading; `.leaf-list--flat` adds breathing room.

**F11 scope note**

The two surfaces serve different purposes (rail = filter the feed, tree = browse the hierarchy), so I aligned them through cross-links + shared `--primary-subtle` tokens rather than forcing identical visuals. If you'd rather collapse them into one component, that's Wave 4 territory.

**Verification**

- `pnpm exec svelte-check` — 0 errors after Wave 3.
- Browser verification: pending DJ refresh.

### Out of scope (logged, not actioned)

- F12 · Loader N+1 — backend perf, not UI.

## 4. Change log

| Date       | Change                                                                                 |
| ---------- | -------------------------------------------------------------------------------------- |
| 2026-05-01 | Doc created. Audit complete. Wave 1 (breadcrumbs) underway.                            |
| 2026-05-01 | F1, F2, F3 shipped — breadcrumbs visible on category + question pages, JSON-LD too.    |
| 2026-05-01 | F5, F7, F8, F9 shipped — count line, mobile leaf truncation, hero copy fix, H2 rename. |
| 2026-05-01 | F6, F10, F11 shipped — flat depth ≥2, prose stats, cross-links between rail and tree.  |
