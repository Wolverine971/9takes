<!-- docs/development/css-audit-findings.md -->

# CSS Audit Findings

**Date:** 2026-03-04
**Status:** In Progress

---

## High Priority (User-Visible Issues)

### 1. Noticia Text still preloaded on every page

- **Status:** ✅ Fixed
- **Files:** `src/app.html:10-24`
- **Issue:** Preloads and loads Noticia Text font stylesheet even though we switched to Space Grotesk globally. Wastes 2 font preload requests on every page for a font barely used anymore.
- **Fix:** Removed preloads and font stylesheet link. Font files kept in `static/fonts/` in case we revert.

### 2. Light-themed components in a dark-themed app

- **Status:** ✅ Partially fixed (3 of 4 components done)
- **Files & Issues:**
  - ✅ `src/lib/components/molecules/QuestionSearch.svelte` — Converted all light colors to dark theme CSS variables
  - ✅ `src/lib/components/content/contentCard.svelte` — Converted to dark theme with translucent colored accents
  - ✅ `src/lib/components/blog/BlogPurpose.svelte:165` — CTA button now uses `--shadow-monarch` purple instead of white
  - ❌ Several admin pages (`admin/search`, `admin/email`) still use hardcoded white/light backgrounds

### 3. Double particle system on homepage

- **Status:** ✅ Fixed
- **Files:** `src/routes/+page.svelte:284-295`
- **Issue:** `FloatingParticles` renders globally via layout. Homepage also renders its own separate particle system on top. Two overlapping particle animations run simultaneously.
- **Fix:** Removed the homepage's local `.particles` HTML and associated CSS (`particle-rise` keyframes). Now relies on the global `FloatingParticles` component.

### 4. Homepage uses a slightly different `--void-abyss`

- **Status:** ✅ Fixed
- **Files:** `src/routes/+page.svelte`
- **Issue:** Homepage set `--void-abyss: #05050a` locally, while global is `#0a0a0f`. Also overrode `--shadow-monarch`, `--shadow-deep`, and font variables that are now global.
- **Fix:** Removed `--void-abyss`, `--shadow-monarch`, `--shadow-deep` overrides and font variable overrides. Kept homepage-only variables (`--void-shadow`, `--text-pale`, `--shadow-flame`, etc.) that don't exist globally. Changed `font-family: var(--font-body)` to `var(--font-family)` to use the global token.

---

## Medium Priority (Consistency / Maintainability)

### 5. Massive hardcoded hex usage instead of CSS variables

- **Status:** ✅ Fixed (8 core components)
- **Files:** `Footer.svelte`, `MobileNav.svelte`, `BlogComment.svelte`, `TableOfContents.svelte`, `SuggestionsBlog.svelte`, `ModalNew.svelte`, `QuickAnswer.svelte`, `InsightBox.svelte`
- **Issue:** Dozens of components hardcoded `#0a0a0f`, `#1a1a2e`, `#f1f5f9`, `#7c3aed`, etc. instead of using `var(--void-abyss)`, `var(--void-surface)`, etc.
- **Fix:** Replaced all mappable hex values with CSS variables across all 8 components. Hex values without a clear mapping (`#16161e`, `#334155`, `#ffffff`) and `rgba()` values left as-is. JS/script-block hex values left untouched.

### 6. `#c4b5fd` (violet-300) used ~15 times with no CSS variable

- **Status:** ✅ Fixed
- **Files:** `blog.scss`, `components.scss`, 23+ Svelte component files
- **Fix:** Added `--shadow-monarch-lightest: #c4b5fd` to `:root` in `index.scss`. Replaced all ~30 CSS occurrences across `blog.scss`, `components.scss`, and 23 Svelte files with `var(--shadow-monarch-lightest)`. Left JS/inline-style occurrences as raw hex (they need literal values).

### 7. Duplicate/conflicting CSS variables

- **Status:** ✅ Partially fixed
- **File:** `src/scss/index.scss`
- **Fixes applied:**
  - ✅ `--base-border-radius` now references `var(--border-radius)` instead of duplicating the value
  - ✅ `--color-border` now references `var(--border-color)` instead of duplicating `var(--void-elevated)`
  - ✅ `--primary-700` now correctly points to `var(--shadow-monarch-dark)` instead of duplicating `--primary-600`
  - ✅ Removed unused `--block-spacing-vertical` and `--block-spacing-horizontal`
- **Still present:** `--text-secondary` / `--color-text-secondary` / `--text-color-secondary` triple alias kept for backward compatibility (too many references to consolidate safely in one pass)

### 8. SearchQuestion.svelte has 25+ `!important` declarations

- **Status:** ✅ Partially fixed
- **File:** `src/lib/components/questions/SearchQuestion.svelte:424-490`
- **Fix:** Replaced all hardcoded hex colors with CSS variables (`var(--text-primary)`, `var(--text-tertiary)`, `var(--shadow-monarch-lighter)`, `var(--shadow-monarch-subtle)`, `var(--neutral-800)`, `var(--border-radius-lg)`). Added comment explaining `!important` is needed to override Flowbite ComboBox internals. The `!important` declarations themselves remain — removing them would require replacing the Flowbite ComboBox component entirely.

### 9. Inconsistent breakpoints

- **Status:** ❌ Not started (deferred)
- **Issue:** SCSS mixins define `480px, 576px, 768px, 800px, 1200px`, but components use `640px, 550px, 500px, 420px, 380px, 320px, 900px` — at least 10 different effective breakpoints.
- **Note:** This is a large refactor affecting many components. Best tackled as a dedicated cleanup pass.

### 10. No z-index scale

- **Status:** ❌ Not started (deferred)
- **Issue:** Values range from `1` to `12433` with no system.
  - `NavbarLinks.svelte` uses `z-index: 1234` on 15+ rules
  - `PrintableContent.svelte` uses `z-index: 12433`
  - Both `Popover.svelte` and admin nav use `z-index: 9999`
- **Note:** Requires careful testing of layering across the entire site. Best tackled as a dedicated cleanup pass.

### 11. Remaining Noticia Text references

- **Status:** ✅ Fixed
- **Files & fixes:**
  - ✅ `questions/create/+page.svelte:163` — Changed JS fontFamily to `"Space Grotesk", sans-serif`
  - ✅ `emails/EmailHead.ts:73` — Changed to `'Space Grotesk'` with system font fallbacks
  - ✅ `WordCloud.svelte:23,50` — Changed D3 `.font()` and `.attr('font-family')` to `'Space Grotesk'`
  - ✅ `stories/enneagram-and-mental-illness/+page.svelte:124,255` — Changed both `amp-story` and `amp-story-bookend` to `'Space Grotesk', sans-serif`
  - ✅ `admin/blog-diff/[id]/+page.svelte:625` — Changed to `var(--font-family)`
  - ✅ `index.scss:366` — `.noticia-text-regular` class now uses `var(--font-family)` instead of hardcoded Noticia Text

---

## Low Priority (Cleanup)

### 12. Dead CSS classes

- **Status:** ✅ Fixed
- **Files:** `src/scss/components.scss`, `src/scss/index.scss`
- **Issue:** Entire unused systems across both global SCSS files.
- **Fix:** Verified each class is truly unused (checked templates, JS, markdown, dynamic class construction), then removed:
  - **From `index.scss`:** `.section-wrapper`, `.hero-content`, `.hero-image`, `.hero-text`, `.question-links`, `.answer-types`, `.question-link` (global), `.arrow`, `.bento`, `.benefits`, `.signup`, `.animate-on-scroll`/`.in-view`, `#component-0/1/2`, `.book-img`, and their responsive media query variants
  - **From `components.scss`:** `.text-shadow-sm`, `.text-shadow-lg`, `.text-gradient`, `.text-glow`, `.line-clamp-3`, `.responsive-grid`, `.responsive-flex`, `.animate-fade-in-up`, `.animate-fade-in-down`, `.animate-scale-in`, `.badge-sm`, `.badge-lg`, `.tag-removable`, `.tab-active`, `.tabs-pills`, `.focus-trap`, and orphaned `@keyframes` (`fadeInUp`, `fadeInDown`, `scaleIn`) plus their reduced-motion references
  - **Kept:** `.tabs`, `.tab`, `.tab-content` (used by 15+ admin pages), `.badge-glow`, `.badge-dot`, `.badge-primary`/etc. (used by components)

### 13. Legacy components still in codebase

- **Status:** ❌ Not started
- **Files:** `src/lib/components/molecules/MobileNav.svelte`, `src/lib/components/molecules/NavbarLinks.svelte`
- **Issue:** `MobileNav.svelte` replaced by `MobileNavNew.svelte`. `NavbarLinks.svelte` uses light theme, float layout, Font Awesome — unused.

### 14. Duplicate `app.scss` imports

- **Status:** ✅ Fixed
- **Files:** `src/routes/blog/+layout.svelte:3`, `src/routes/admin/marketing/+page.svelte:12`
- **Fix:** Removed redundant `app.scss` import from blog layout (root layout already imports it globally). Marketing page import was already removed in a prior pass.

### 15. Nested `<main>` elements

- **Status:** ✅ Fixed
- **File:** `src/routes/enneagram-test/+page.svelte:21`
- **Issue:** Creates a `<main>` inside the layout's `<main>` — invalid HTML, breaks screen reader navigation.
- **Fix:** Changed `<main>` to `<div>` in enneagram-test page. Also fixed `src/routes/admin/marketing/+page.svelte` which had the same issue (`<main class="main-card">` → `<section>`).

### 16. Dead max-width constraints

- **Status:** ❌ Not started
- **Files:** `/community`, `/how-to-guides`, `/personality-analysis` pages
- **Issue:** Set `max-width: 1200px` inside the layout's `max-w-4xl` (896px) container — inner value never takes effect.
