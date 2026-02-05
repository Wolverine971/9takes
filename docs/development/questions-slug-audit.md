<!-- docs/development/questions-slug-audit.md -->
# UI/UX & Code Quality Audit: `/questions/[slug]` Page

**Audit Date:** 2026-02-05
**Auditor:** Senior Engineering Review
**Scope:** Main page + 15 sub-components

---

## Executive Summary

The `/questions/[slug]` page is a sophisticated Q&A interface with a "give-first" commenting system. While functionally solid, there are several bugs, inconsistencies, and UX issues that should be addressed. This audit identifies **12 bugs**, **18 code quality issues**, and **15 UI/UX improvements**.

_Verification note (2026-02-05): A code-level verification pass found that several items in the BUGS list are type-safety or code-quality issues rather than runtime defects. See the Verification Summary below for confirmed vs. unconfirmed items and added findings._

---

## 1. BUGS (Functional Issues)

### Verification Summary (2026-02-05)

| Bug ID  | Status                   | Verification Notes                                                                                                        |
| ------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| BUG-001 | Fixed (2026-02-05)       | Removed invalid `quality` from PNG QR options in both question page and `QuestionDisplay.svelte`.                         |
| BUG-002 | Fixed (2026-02-05)       | `SortComments` now posts `data.question.id` and uses `?/sortComments`.                                                    |
| BUG-003 | Fixed (2026-02-05)       | Standardized on `aiComments` (removed `ai_comments` alias + updated AIComments component).                                |
| BUG-004 | Fixed (2026-02-05)       | Added `/links` endpoint and updated `Links.svelte` to fetch links, not comments.                                          |
| BUG-005 | Fixed (2026-02-05)       | `FormData.append('parent_id', ...)` now passes strings.                                                                   |
| BUG-006 | Not reproduced           | UI only renders when `_commentComment` exists; `getModal` IDs are always strings. No `getModal(undefined)` call observed. |
| BUG-007 | Not a bug (code quality) | Svelte 5 migration item; move to Code Quality section.                                                                    |
| BUG-008 | Not a bug (code quality) | Prop mutation is an anti-pattern; risk of state confusion but no direct failure verified.                                 |
| BUG-009 | Not a bug (code quality) | JSON clone is a data-integrity/perf risk, not a functional failure in current flows.                                      |
| BUG-010 | Not a bug (code quality) | Huge z-index is maintainability issue; not a functional defect.                                                           |
| BUG-011 | Not reproduced           | `innerWidth` is unused in `+page.svelte`; SSR note doesn’t apply.                                                         |
| BUG-012 | Fixed (2026-02-05)       | Removed comments now gated behind `userHasAnswered`.                                                                      |
| BUG-013 | Fixed (2026-02-05)       | Added `sortComments` action on slug route.                                                                                |
| BUG-014 | Fixed (2026-02-05)       | Links pagination no longer uses comment timestamps; uses `/links` range paging.                                           |

### Fixes Applied (2026-02-05)

- Removed invalid QR PNG `quality` option in `src/routes/questions/[slug]/+page.svelte` and `src/lib/components/questions/QuestionDisplay.svelte`.
- Standardized AI comments to `aiComments` across `src/lib/components/molecules/AIComments.svelte`, `src/routes/questions/[slug]/+page.svelte`, `src/routes/questions/[slug]/+page.server.ts`, and `src/lib/types/questions.ts`.
- Implemented `sortComments` action in `src/routes/questions/[slug]/+page.server.ts` and fixed client call in `src/lib/components/molecules/SortComments.svelte`.
- Added `/links` endpoint at `src/routes/links/+server.ts` and updated `src/lib/components/molecules/Links.svelte` to fetch/paginate links via range.
- Added give-first gating for removed comments in `src/lib/components/questions/QuestionContent.svelte`.
- Fixed `FormData.append('parent_id', ...)` type in `src/lib/components/molecules/Comment.svelte`.

### Critical

#### BUG-001: QR Code `quality` option invalid for PNG

**File:** `src/routes/questions/[slug]/+page.svelte:53`

```typescript
const QR_OPTS = {
	type: 'image/png' as const,
	quality: 0.7 // BUG: quality is only valid for JPEG/WebP
	// ...
};
```

**Impact:** TypeScript error, potential runtime issues
**Fix:** Remove `quality` option or change to JPEG type

#### BUG-002: SortComments passes wrong `data.id` instead of `data.question.id`

**File:** `src/lib/components/molecules/SortComments.svelte:110`

```typescript
body.append('questionId', data.id); // BUG: should be data.question.id
```

**Impact:** Sorting fails - question ID is undefined
**Fix:** Change to `data.question.id`

#### BUG-003: AIComments uses `ai_comments` but data provides `aiComments`

**File:** `src/lib/components/molecules/AIComments.svelte:42`

```typescript
{#if browser && data?.ai_comments?.length  // Uses snake_case
```

**File:** `src/routes/questions/[slug]/+page.svelte:35-36`

```typescript
aiComments: data.aiComments,
ai_comments: data.aiComments,  // Workaround in place, but inconsistent
```

**Impact:** AI comments may not display if `ai_comments` mapping is missing
**Fix:** Standardize on one naming convention (camelCase)

#### BUG-004: Links component fetches comments instead of links

**File:** `src/lib/components/molecules/Links.svelte:41-46`

```typescript
const response = await fetch(
	`/comments?type=${parentType}&parentId=${getParentId()}&lastDate=${lastDate}`
);
// BUG: This fetches comments, not links
```

**Impact:** "Load More" on Articles tab loads comments, not articles
**Fix:** Create proper `/links` endpoint or use existing links API

### High

#### BUG-005: Comment.svelte passes number where string is expected

**File:** `src/lib/components/molecules/Comment.svelte:159,216,288,332`

```typescript
body.append('parent_id', _commentComment.id); // id is number, append expects string
```

**Impact:** FormData coerces to string, but TypeScript warns
**Fix:** Explicitly convert: `_commentComment.id.toString()`

#### BUG-006: Missing null check on `_commentComment` in flag modal

**File:** `src/lib/components/molecules/Comment.svelte:613,653`

```html
<Modal2 id="{`edit-modal-${_commentComment?.id}`}">
	<!-- OK -->
	<Modal2 id="{`flag-comment-modal-${_commentComment?.id}`}"> <!-- OK --></Modal2></Modal2
>
```

But inside the modal:

```html
<button on:click="{()" ="">getModal(`edit-modal-${_commentComment?.id}`).close()}></button>
```

**Impact:** If `_commentComment` is null, `getModal(undefined)` returns undefined, `.close()` fails
**Fix:** Add guards or use non-null assertion after checking

#### BUG-007: QuestionDisplay uses legacy Svelte patterns

**File:** `src/lib/components/questions/QuestionDisplay.svelte`

```typescript
export let question;  // Legacy - should be $props()
$: fontSize = ...;    // Legacy - should be $derived()
```

**Impact:** Inconsistency with Svelte 5 runes used elsewhere
**Fix:** Migrate to Svelte 5 runes for consistency

### Medium

#### BUG-008: Comments.svelte mutates props

**File:** `src/lib/components/molecules/Comments.svelte:52,79`

```typescript
comments = _comments; // Update parent array reference
```

**Impact:** Violates one-way data flow, can cause unpredictable behavior
**Fix:** Use callbacks (`onCommentsUpdate`) exclusively

#### BUG-009: Deep copy uses JSON.parse/stringify instead of structuredClone

**Files:** Multiple components

```typescript
let _data = $derived(JSON.parse(JSON.stringify(data)) as QuestionPageData);
```

**Impact:** Loses Date objects, undefined values, and function references
**Fix:** Use `structuredClone(data)` (already used correctly in Comment.svelte:60)

#### BUG-010: Modal2 z-index is excessively high

**File:** `src/lib/components/atoms/Modal2.svelte:65`

```html
class="fixed inset-0 z-[23425343]"
<!-- z-index: 23,425,343 -->
```

**Impact:** Potential conflicts, hard to maintain
**Fix:** Use reasonable z-index like `z-[1000]` or CSS variable

#### BUG-011: innerWidth not reactive on SSR

**File:** `src/routes/questions/[slug]/+page.svelte:62`

```typescript
let innerWidth = $state(0); // Starts at 0
// Only set in onMount
```

**Impact:** Initial render on server uses 0, may cause layout shift
**Fix:** Use sensible default or check `browser` before conditional rendering

#### BUG-012: Removed Comments don't respect give-first model

**File:** `src/lib/components/questions/QuestionContent.svelte:216-224`

```html
{#if _data?.removedComments?.length > 0} <Comments ... />
<!-- No userHasAnswered check -->
```

**Impact:** Removed comments visible without answering first
**Fix:** Add `data?.flags?.userHasAnswered` check

### Additional Bugs Found During Verification (2026-02-05)

#### BUG-013: SortComments action missing / wrong route

**File:** `src/lib/components/molecules/SortComments.svelte:113`

```typescript
const resp = await fetch('/questions?/sortComments', {
```

**Impact:** Sorting likely 404s because there is no `sortComments` action in `src/routes/questions/[slug]/+page.server.ts` or `src/routes/questions/+page.server.ts`.
**Fix:** Implement a `sortComments` action on the slug route and call it with `fetch('?/sortComments', ...)`, or add a dedicated API endpoint.

#### BUG-014: Links pagination cursor uses comment timestamps

**File:** `src/lib/components/molecules/Links.svelte:27`

```typescript
$: lastDate = data.comments?.length ? data.comments[data.comments.length - 1]?.created_at : null;
```

**Impact:** Even with a links API, pagination uses the wrong cursor, so "Load More" can skip/duplicate links or fail to load.
**Fix:** Derive `lastDate` from `links` (or a server-provided links cursor), not `data.comments`.

---

## 2. CODE QUALITY ISSUES

### Type Safety

#### CQ-001: Excessive `any` types in server file

**File:** `src/routes/questions/[slug]/+page.server.ts:699-742`

```typescript
function createBaseResponse(
	question: any, // Should be Question
	comments: any[] // Should be Comment[]
	// ...
);
```

**Fix:** Use proper types from `$lib/types/questions`

#### CQ-002: Type assertions scattered throughout

**Files:** Multiple

```typescript
as unknown as number
(supabase.from('comments_demo') as any)
const result: any = deserialize(await resp.text());
```

**Fix:** Create proper type definitions for Supabase responses

#### CQ-003: Inconsistent prop typing

**File:** `src/lib/components/molecules/Links.svelte:10-12`

```typescript
export let data: any;
export let user: any;
```

vs `Comment.svelte` which uses proper types
**Fix:** Apply proper types consistently

### Architecture

#### CQ-004: Mixed Svelte 4/5 patterns

| Component       | Pattern                                      |
| --------------- | -------------------------------------------- |
| +page.svelte    | Svelte 5 ($props, $state, $derived, $effect) |
| QuestionDisplay | Svelte 4 (export let, $:)                    |
| Comment         | Svelte 4 (export let, $:)                    |
| Comments        | Svelte 4 (export let, $:)                    |
| Interact        | Svelte 5 ($props, $state)                    |

**Fix:** Migrate all to Svelte 5 runes

#### CQ-005: Inconsistent event handling

**Files:** Various

```html
<!-- Svelte 5 style -->
onclick={toggleLike}

<!-- Svelte 4 style -->
on:click={toggleLike}
```

**Fix:** Standardize on Svelte 5 `onclick` handlers

#### CQ-006: SortComments uses SCSS while others use Tailwind

**File:** `src/lib/components/molecules/SortComments.svelte` - 490 lines of SCSS
**Impact:** Inconsistent styling approach, larger bundle
**Fix:** Migrate to Tailwind for consistency

#### CQ-007: Duplicated fingerprint loading logic

**Files:** `Interact.svelte:76-89`, `Comment.svelte:199-211`

```typescript
// Same fingerprint loading code duplicated
const FingerprintJS = (await import('@fingerprintjs/fingerprintjs')).default;
const fp = await FingerprintJS.load();
const fpval = await fp.get();
```

**Fix:** Extract to shared utility function

#### CQ-008: Circular component dependency

**Files:** `Comment.svelte` imports `Comments.svelte`, which imports `Comment.svelte`
**Impact:** Works in Svelte but harder to reason about
**Fix:** Consider restructuring or accept as intentional recursion

### Naming & Consistency

#### CQ-009: Inconsistent naming conventions

```typescript
// Snake_case vs camelCase
ai_comments vs aiComments
comment_count vs commentCount
links_count vs linksCount
```

**Fix:** Standardize on camelCase in TypeScript, snake_case only from DB

#### CQ-010: Unused variables

**File:** `src/lib/components/molecules/Comment.svelte:52`

```typescript
let isHovered = false; // Never used
```

**Fix:** Remove unused variables

#### CQ-011: Console.log statements in production code

**File:** `src/routes/questions/[slug]/+page.server.ts:629,661,674,682,694`

```typescript
console.log('No question tags for question', error);
```

**Fix:** Use proper logging service or remove

### Error Handling

#### CQ-012: Inconsistent error handling patterns

**File:** `Comment.svelte` - some functions throw, some show notifications

```typescript
// Some handlers:
throw new Error(result.error);
// Others:
notifications.danger('Error loading comments', 3000);
```

**Fix:** Standardize error handling approach

#### CQ-013: Silent failures in background tasks

**File:** `+page.server.ts:283-285,291-293`

```typescript
parseUrls(comment, question_id).catch((err) => {
	console.error('Background URL parsing failed:', err);
	// Silently fails - no user notification
});
```

**Fix:** Consider retry logic or admin alerts for persistent failures

### Performance

#### CQ-014: Excessive deep copying

**Files:** Multiple components create deep copies on every render

```typescript
$: _comments = comments ? (JSON.parse(JSON.stringify(comments)) as CommentType[]) : [];
```

**Impact:** Unnecessary memory allocation and GC pressure
**Fix:** Only deep copy when mutation is required, use immutable patterns

#### CQ-015: No debouncing on infinite scroll

**File:** `Comments.svelte` has debounce, but `Links.svelte` doesn't
**Fix:** Add consistent debouncing to all load-more functions

#### CQ-016: Large component files

| File                | Lines |
| ------------------- | ----- |
| Comment.svelte      | 764   |
| SortComments.svelte | 864   |
| +page.server.ts     | 784   |

**Fix:** Split into smaller, focused modules

#### CQ-017: Unused imports

**File:** `Comment.svelte:12,14`

```typescript
import DownIcon from '$lib/components/icons/downIcon.svelte'; // Unused
import RightIcon from '$lib/components/icons/rightIcon.svelte'; // Unused
```

**Fix:** Remove unused imports

#### CQ-018: Magic numbers

**File:** `Comment.svelte:57`

```typescript
const COMMENT_TRUNCATE_LENGTH = 136; // Why 136?
```

**Fix:** Document magic numbers or derive from design system

---

## 3. UI/UX ISSUES

### Responsiveness

#### UX-001: SortComments modal uses light theme, rest of app is dark

**File:** `SortComments.svelte`

- Modal background: `white`
- App background: `#1a1a2e` (dark)

**Impact:** Jarring visual inconsistency
**Fix:** Update SortComments modal to match dark theme

#### UX-002: Tab navigation horizontal scroll on mobile

**File:** `QuestionContent.svelte:106`

```html
<nav class="scrollbar-hide flex overflow-x-auto"></nav>
```

**Impact:** Users may not realize they can scroll to see all tabs
**Fix:** Add scroll indicators or use a different pattern (dropdown/accordion)

#### UX-003: Link cards have fixed 300px height

**File:** `Link.svelte:71`

```scss
height: 300px;
```

**Impact:** Wastes space for links without images, cramped for long descriptions
**Fix:** Use min-height or auto-sizing based on content

#### UX-004: Mobile breakpoints inconsistent

- QuestionDisplay: 500, 768, 1024
- Interact: 576
- SortComments: 400

**Fix:** Define consistent breakpoints in Tailwind config

### Accessibility

#### UX-005: Missing focus management in modals

**File:** `Modal2.svelte`

- No focus trap
- Focus not returned to trigger element on close

**Fix:** Implement proper focus trap and return

#### UX-006: Color contrast issues

**File:** Various - `text-slate-500` on dark backgrounds

```html
<span class="text-slate-500"> <!-- May fail WCAG AA --></span>
```

**Fix:** Audit with contrast checker, use `text-slate-400` minimum

#### UX-007: Icon-only buttons missing accessible labels

**File:** `AIComments.svelte:62-63`

```html
<button ...>
	<LeftIcon />
	<!-- No visible text, relies on aria-label -->
</button>
```

**Impact:** Screen reader users may not understand button purpose
**Fix:** Verify all icon buttons have proper aria-labels (most do, audit all)

#### UX-008: Form validation feedback unclear

**File:** `Comment.svelte` - Flag form shows error at top

```html
{#if flagError}
<div class="mb-4 ...">{flagError}</div>
{/if}
```

**Impact:** Error may be off-screen on longer forms
**Fix:** Add inline validation near the field

### User Experience

#### UX-009: No loading state for initial page load

**File:** `+page.svelte`
**Impact:** Content pops in suddenly after hydration
**Fix:** Add skeleton loaders for initial load

#### UX-010: Optimistic updates don't handle failures gracefully

**File:** `+page.svelte:72-85`

```typescript
// Optimistic update - immediately add comment to UI
if (newComment) {
	optimisticComments = [newComment, ...optimisticComments];
}
// No rollback on failure
```

**Fix:** Implement rollback mechanism on server error

#### UX-011: "None" displayed awkwardly for empty links

**File:** `Links.svelte:112-116`

```html
<h2 class="...">None</h2>
```

**Impact:** Feels abrupt and unhelpful
**Fix:** Use empty state with explanation and CTA

#### UX-012: Subscribe button shows "Subscribe" even when loading

**File:** `Interact.svelte:326-327`

```html
<span class="whitespace-nowrap">
	{subscriptions.some((e) => e.user_id === user?.id) ? 'Subscribed' : 'Subscribe'}
</span>
```

**Impact:** Text doesn't change during loading
**Fix:** Hide text when loading, or show "Subscribing..."

#### UX-013: Long comments truncate at arbitrary length

**File:** `Comment.svelte:57`

```typescript
const COMMENT_TRUNCATE_LENGTH = 136;
```

**Impact:** May cut words mid-sentence
**Fix:** Truncate at word boundaries

#### UX-014: AI Comments carousel has no keyboard navigation

**File:** `AIComments.svelte`
**Impact:** Can't navigate with arrow keys
**Fix:** Add keyboard event handlers for left/right arrows

#### UX-015: Visual hierarchy unclear in comment actions

**File:** `Comment.svelte:440-515` - Like, Reply, and Settings all same visual weight
**Fix:** Differentiate primary action (Reply) from secondary (Like, Settings)

---

## 4. RECOMMENDATIONS (Prioritized)

### P0 - Critical (Fix Immediately)

1. **BUG-002:** Fix SortComments `data.id` -> `data.question.id`
2. **BUG-004:** Fix Links component fetching wrong data
3. **UX-001:** Fix SortComments dark theme mismatch

### P1 - High (Fix This Sprint)

4. **BUG-001:** Remove invalid QR quality option (already fixed in create page)
5. **BUG-003:** Standardize aiComments naming
6. **BUG-005:** Fix FormData type coercion
7. **CQ-001:** Add proper types to server response functions
8. **UX-010:** Add optimistic update rollback

### P2 - Medium (Fix Next Sprint)

9. **CQ-004:** Migrate remaining components to Svelte 5
10. **CQ-006:** Migrate SortComments SCSS to Tailwind
11. **CQ-007:** Extract fingerprint utility
12. **UX-005:** Implement modal focus trap
13. **BUG-012:** Add userHasAnswered check to removed comments

### P3 - Low (Backlog)

14. **CQ-009:** Standardize naming conventions
15. **CQ-016:** Split large component files
16. **UX-002:** Improve mobile tab navigation
17. **UX-014:** Add keyboard nav to carousel
18. **CQ-010-018:** Various cleanup tasks

---

## 5. COMPONENT HEALTH SCORES

| Component       | Code Quality | UI/UX | Accessibility | Overall |
| --------------- | ------------ | ----- | ------------- | ------- |
| +page.svelte    | 8/10         | 8/10  | 7/10          | **B+**  |
| QuestionDisplay | 6/10         | 8/10  | 8/10          | **B**   |
| QuestionContent | 7/10         | 7/10  | 7/10          | **B**   |
| Interact        | 8/10         | 8/10  | 8/10          | **A-**  |
| Comments        | 6/10         | 7/10  | 7/10          | **B-**  |
| Comment         | 5/10         | 7/10  | 8/10          | **B-**  |
| SortComments    | 4/10         | 6/10  | 7/10          | **C+**  |
| AIComments      | 7/10         | 8/10  | 6/10          | **B**   |
| Links           | 4/10         | 5/10  | 6/10          | **C**   |
| Link            | 5/10         | 6/10  | 6/10          | **C+**  |
| Modal2          | 7/10         | 8/10  | 5/10          | **B-**  |

---

## 6. TESTING RECOMMENDATIONS

### Unit Tests Needed

- [ ] `createCommentData()` function validation
- [ ] `checkRateLimit()` edge cases
- [ ] `calculateFontSize()` breakpoints
- [ ] Comment truncation logic

### Integration Tests Needed

- [ ] Give-first flow (comment -> unlock comments)
- [ ] Subscription toggle
- [ ] Like/unlike flow
- [ ] Filter and sort comments

### E2E Tests Needed

- [ ] Full page load and interaction
- [ ] Mobile responsive behavior
- [ ] Modal open/close flows
- [ ] Infinite scroll pagination

---

## Appendix: Files Reviewed

1. `src/routes/questions/[slug]/+page.svelte`
2. `src/routes/questions/[slug]/+page.server.ts`
3. `src/lib/components/questions/QuestionContent.svelte`
4. `src/lib/components/questions/QuestionDisplay.svelte`
5. `src/lib/components/molecules/Interact.svelte`
6. `src/lib/components/molecules/Comments.svelte`
7. `src/lib/components/molecules/Comment.svelte`
8. `src/lib/components/molecules/SortComments.svelte`
9. `src/lib/components/molecules/AIComments.svelte`
10. `src/lib/components/molecules/Links.svelte`
11. `src/lib/components/molecules/Link.svelte`
12. `src/lib/components/atoms/Modal2.svelte`
13. `src/lib/types/questions.ts`
