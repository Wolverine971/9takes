# CSS Audit Findings

**Date:** 2026-03-04
**Status:** In Progress

---

## High Priority (User-Visible Issues)

### 1. Noticia Text still preloaded on every page
- **Status:** ❌ Not started
- **Files:** `src/app.html:10-24`
- **Issue:** Preloads and loads Noticia Text font stylesheet even though we switched to Space Grotesk globally. Wastes 2 font preload requests on every page for a font barely used anymore.
- **Fix:** Remove preloads and font stylesheet link. Keep the `static/fonts/` files in case we need them later.

### 2. Light-themed components in a dark-themed app
- **Status:** ❌ Not started
- **Files & Issues:**
  - `src/lib/components/molecules/QuestionSearch.svelte` — `background: white`, `border: 1px solid #ccc`, light gray backgrounds. Renders as a jarring white box.
  - `src/lib/components/content/contentCard.svelte` — all light pastel backgrounds (`#eff6ff`, `#f0fdf4`, `#fef3c7`)
  - `src/lib/components/blog/BlogPurpose.svelte:165` — `background: #fff`
  - Several admin pages (`admin/search`, `admin/email`) use hardcoded white/light backgrounds
- **Fix:** Update to use dark theme CSS variables.

### 3. Double particle system on homepage
- **Status:** ❌ Not started
- **Files:** `src/routes/+layout.svelte:536`, `src/routes/+page.svelte:284-295`
- **Issue:** `FloatingParticles` renders globally via layout. Homepage also renders its own separate particle system on top. Two overlapping particle animations run simultaneously.
- **Fix:** Remove the homepage's local particle system and rely on the global one, or exclude the homepage from the global particles.

### 4. Homepage uses a slightly different `--void-abyss`
- **Status:** ❌ Not started
- **Files:** `src/routes/+page.svelte:582`
- **Issue:** Homepage sets `--void-abyss: #05050a` locally, while the global is `#0a0a0f`. Users see a subtle background color shift when navigating away.
- **Fix:** Remove the local override so it inherits the global value.

---

## Medium Priority (Consistency / Maintainability)

### 5. Massive hardcoded hex usage instead of CSS variables
- **Status:** ❌ Not started
- **Files:** `Footer.svelte`, `MobileNav.svelte`, `BlogComment.svelte`, `TableOfContents.svelte`, `SuggestionsBlog.svelte`, `ModalNew.svelte`, `QuickAnswer.svelte`, `InsightBox.svelte`
- **Issue:** Dozens of components hardcode `#0a0a0f`, `#1a1a2e`, `#f1f5f9`, `#7c3aed`, etc. instead of using `var(--void-abyss)`, `var(--void-surface)`, etc.

### 6. `#c4b5fd` (violet-300) used ~15 times with no CSS variable
- **Status:** ❌ Not started
- **Files:** `blog.scss`, `components.scss`, `QuickAnswer.svelte`, `InsightBox.svelte`, `TableOfContents.svelte`, `SortComments.svelte`, etc.
- **Issue:** Needs a `--shadow-monarch-lightest` or similar token.

### 7. Duplicate/conflicting CSS variables
- **Status:** ❌ Not started
- **File:** `src/scss/index.scss`
- **Issues:**
  - `--border-radius` vs `--base-border-radius` (same value, used inconsistently)
  - `--border-color` vs `--color-border` (identical aliases)
  - `--text-secondary` vs `--color-text-secondary` vs `--text-color-secondary` (three names)
  - `--primary-600` and `--primary-700` both point to same color

### 8. SearchQuestion.svelte has 25+ `!important` declarations
- **Status:** ❌ Not started
- **File:** `src/lib/components/questions/SearchQuestion.svelte:426-521`
- **Issue:** Specificity war with Flowbite's input styles.

### 9. Inconsistent breakpoints
- **Status:** ❌ Not started
- **Issue:** SCSS mixins define `480px, 576px, 768px, 800px, 1200px`, but components use `640px, 550px, 500px, 420px, 380px, 320px, 900px` — at least 10 different effective breakpoints.

### 10. No z-index scale
- **Status:** ❌ Not started
- **Issue:** Values range from `1` to `12433` with no system.
  - `NavbarLinks.svelte` uses `z-index: 1234` on 15+ rules
  - `PrintableContent.svelte` uses `z-index: 12433`
  - Both `Popover.svelte` and admin nav use `z-index: 9999`

### 11. Remaining Noticia Text references
- **Status:** ❌ Not started
- **Files:**
  - `questions/create/+page.svelte:163,320` — textarea font
  - `emails/EmailHead.ts:73` — email body font
  - `WordCloud.svelte:23,50` — D3 word cloud
  - `stories/enneagram-and-mental-illness/+page.svelte:124,255`
  - `admin/blog-diff/[id]/+page.svelte:359`

---

## Low Priority (Cleanup)

### 12. Dead CSS classes
- **Status:** ❌ Not started
- **Files:** `src/scss/components.scss`, `src/scss/index.scss`
- **Issue:** Entire unused systems: `.tabs/.tab/.tab-active`, `.badge-glow`, `.badge-dot`, `.badge-sm/.badge-lg`, `.responsive-grid`, `.responsive-flex`, `.animate-fade-in-up/.down`, `.text-gradient`, `.text-glow`, `.focus-trap`, `.hero-content`, `.hero-image`, `.bento`, `.benefits`, `.signup`, `#component-0/1/2`, `.book-img`.

### 13. Legacy components still in codebase
- **Status:** ❌ Not started
- **Files:** `src/lib/components/molecules/MobileNav.svelte`, `src/lib/components/molecules/NavbarLinks.svelte`
- **Issue:** `MobileNav.svelte` replaced by `MobileNavNew.svelte`. `NavbarLinks.svelte` uses light theme, float layout, Font Awesome — unused.

### 14. Duplicate `app.scss` imports
- **Status:** ❌ Not started
- **Files:** `src/routes/blog/+layout.svelte:3`, `src/routes/admin/marketing/+page.svelte:12`

### 15. Nested `<main>` elements
- **Status:** ❌ Not started
- **File:** `src/routes/enneagram-test/+page.svelte:21`
- **Issue:** Creates a `<main>` inside the layout's `<main>` — invalid HTML, breaks screen reader navigation.

### 16. Dead max-width constraints
- **Status:** ❌ Not started
- **Files:** `/community`, `/how-to-guides`, `/personality-analysis` pages
- **Issue:** Set `max-width: 1200px` inside the layout's `max-w-4xl` (896px) container — inner value never takes effect.
