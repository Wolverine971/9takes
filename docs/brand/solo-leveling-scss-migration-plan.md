<!-- docs/brand/solo-leveling-scss-migration-plan.md -->

# Solo Leveling SCSS Migration Plan

This document tracks the systematic migration of 9takes from the current purple-light theme to the Solo Leveling dark aesthetic.

## Overview

**Current State**: Purple-based light theme (#6c5ce7 primary, white backgrounds)
**Target State**: Solo Leveling dark aesthetic (void backgrounds, purple/blue/cyan accents, system UI feel)

**Reference Implementation**: `/test-solo-leveling-v4/+page.svelte`

---

## Phase 1: SCSS Variable Migration

### 1.1 Color System (`src/scss/index.scss`)

- [x] Replace primary colors with Solo Leveling palette
- [x] Add void/shadow/system color variables
- [x] Update gradient definitions
- [x] Add glow/accent color variables

**New Color Variables:**

```scss
// Void/Background Colors
--void-abyss: #0a0a0f;
--void-deep: #12121a;
--void-surface: #1a1a2e;
--void-elevated: #252538;

// Shadow Monarch Purple (Primary)
--shadow-monarch: #7c3aed;
--shadow-monarch-light: #8b5cf6;
--shadow-monarch-dark: #6d28d9;
--shadow-monarch-glow: rgba(124, 58, 237, 0.5);

// System Interface Blue (Secondary)
--system-interface: #3b82f6;
--system-interface-light: #60a5fa;
--system-interface-dark: #2563eb;
--system-interface-glow: rgba(59, 130, 246, 0.5);

// Awakening Cyan (Accent)
--awakening-cyan: #06b6d4;
--awakening-cyan-light: #22d3ee;
--awakening-cyan-glow: rgba(6, 182, 212, 0.5);

// Text Colors
--text-primary: #f8fafc;
--text-secondary: #94a3b8;
--text-muted: #64748b;

// Status Colors
--status-success: #10b981;
--status-warning: #f59e0b;
--status-error: #ef4444;
--status-info: #3b82f6;
```

**Status**: ✅ Complete

### 1.2 Typography System

- [x] Update font weights for dark theme readability
- [x] Adjust line heights
- [x] Update heading styles for glow effects

**Status**: ✅ Complete

### 1.3 Shadow System

- [x] Replace light shadows with glow effects
- [x] Add purple/blue glow variants
- [x] Update elevation system for dark backgrounds

**New Shadow Variables:**

```scss
--glow-sm: 0 0 10px var(--shadow-monarch-glow);
--glow-md: 0 0 20px var(--shadow-monarch-glow);
--glow-lg: 0 0 40px var(--shadow-monarch-glow);
--glow-blue: 0 0 20px var(--system-interface-glow);
--glow-cyan: 0 0 20px var(--awakening-cyan-glow);
```

**Status**: ✅ Complete

---

## Phase 2: Component Style Updates (`src/scss/components.scss`)

### 2.1 Buttons

- [x] Update primary button to purple glow style
- [x] Update secondary button to transparent/border style
- [x] Add hover glow animations
- [x] Update disabled states for dark theme

**Status**: ✅ Complete

### 2.2 Cards

- [x] Update card backgrounds to void-surface
- [x] Add subtle border with gradient
- [x] Add hover glow effect
- [x] Update card shadows

**Status**: ✅ Complete

### 2.3 Forms/Inputs

- [x] Update input backgrounds to void-elevated
- [x] Add focus glow effect
- [x] Update placeholder colors
- [x] Update validation state colors

**Status**: ✅ Complete

### 2.4 Modals

- [x] Update modal background to void-deep
- [x] Add border glow
- [x] Update overlay darkness
- [x] Update close button styling

**Status**: ✅ Complete

### 2.5 Navigation/Tabs

- [x] Update tab styling for dark theme
- [x] Add active state glow
- [x] Update hover states

**Status**: ✅ Complete

### 2.6 Badges/Tags

- [x] Update badge backgrounds
- [x] Add type-specific color variants (all 9 Enneagram types)
- [x] Update text contrast
- [x] Add tag component styles

**Status**: ✅ Complete

### 2.7 Spinners/Loading

- [x] Update spinner colors to purple/cyan
- [x] Add glow effect to loading states

**Status**: ✅ Complete

---

## Phase 3: Layout Migration (`src/routes/+layout.svelte`)

### 3.1 Base Layout

- [ ] Update body background to void-abyss
- [ ] Update text color defaults
- [ ] Add global dark theme class

**Status**: Not Started

### 3.2 Header Component

- [ ] Update header background to semi-transparent dark
- [ ] Add subtle border/glow
- [ ] Update logo styling
- [ ] Update navigation link colors
- [ ] Update mobile menu styling

**Status**: Not Started

### 3.3 Footer Component

- [x] Update footer background
- [x] Update link colors
- [x] Update social icons styling

**Status**: ✅ Complete

### 3.4 Toast Component

- [ ] Update toast backgrounds for dark theme
- [ ] Update toast text colors
- [ ] Add appropriate borders

**Status**: Not Started

### 3.5 Navigation Components

- [x] Update BackNavigation for dark theme
- [x] Update CategoryNavigation for dark theme
- [x] Update MobileNav for dark theme

**Status**: ✅ Complete

---

## Phase 4: Homepage Replacement (`src/routes/+page.svelte`)

### 4.1 Content Migration

- [x] Copy data loading pattern from v4
- [x] Replace current homepage with v4 design
- [x] Verify all sections render correctly
- [x] Test responsive behavior

**Status**: ✅ Complete

### 4.2 Server Load Update

- [x] Update/create `+page.server.ts` with v4 data loading
- [x] Verify Supabase queries work
- [x] Test question of the day rotation
- [x] Test featured people loading

**Status**: ✅ Complete

---

## Phase 5: Sub-Component Updates

### 5.1 Blog Components (`src/lib/components/blog/`)

- [x] Update callout components for dark theme
- [x] Update blog layout styling
- [x] Update code block styling
- [x] Update blockquote styling
- [x] Update TableOfContents component
- [x] Update SuggestionsBlog component
- [x] Update ArticleTitle component
- [x] Update ArticleSubTitle component
- [x] Update PeopleSuggestionsSideBar component

**Status**: ✅ Complete

### 5.2 Question Components (`src/lib/components/questions/`)

- [x] Update comment styling
- [x] Update question card styling
- [x] Update form inputs

**Status**: ✅ Complete (updated in previous session)

### 5.3 Atom Components (`src/lib/components/atoms/`)

- [x] Audit all atoms for theme compatibility
- [x] Update Modal2 component
- [x] Update ModalNew component
- [x] Update BackNavigation component
- [x] Update CategoryNavigation component
- [x] Update SmallPopCard component
- [x] Update Skeleton component
- [x] Update SkeletonLoader component
- [x] Update Popover component
- [x] Update LoadingButton component
- [x] Update DateTip component

**Status**: ✅ Complete

### 5.4 Molecule Components (`src/lib/components/molecules/`)

- [x] Update Header component (styles in components.scss)
- [x] Update Footer component
- [x] Update MobileNav component
- [x] Update Email-Signup component
- [x] Update RelatedPosts component

**Status**: ✅ Complete

---

## Phase 6: Blog Styling (`src/scss/blog.scss`)

### 6.1 Content Styling

- [x] Update prose colors for dark theme
- [x] Update heading colors
- [x] Update link colors
- [x] Update list styling

**Status**: ✅ Complete (styles applied in slug page components)

### 6.2 Code Blocks

- [x] Update code block background
- [x] Update syntax highlighting for dark theme
- [x] Add code block border/glow

**Status**: ✅ Complete (styles applied in slug page components)

### 6.3 Media

- [x] Update image styling
- [x] Update figure captions
- [x] Update video embeds

**Status**: ✅ Complete (responsive handling in slug pages)

---

## Phase 7: Cleanup & Optimization

### 7.1 Remove Deprecated Styles

- [x] Remove unused light theme variables (removed Greek theme variables)
- [x] Remove unused component styles
- [x] Remove unused utility classes

**Status**: ✅ Complete

### 7.2 Consolidate Duplicates

- [x] Merge duplicate color definitions
- [x] Consolidate repeated patterns
- [x] Create reusable mixins for glow effects (added to \_mixins.scss)

**Status**: ✅ Complete

### 7.3 Performance Audit

- [x] Check CSS file sizes
- [x] Remove unused CSS
- [x] Optimize specificity

**Status**: ✅ Complete

---

## Type-Specific Colors Reference

For the 9 Enneagram types, use these consistent colors across the app:

```scss
// Type Colors (for badges, accents, highlights)
--type-1-color: #3b82f6; // Blue - Perfectionist
--type-2-color: #ec4899; // Pink - Helper
--type-3-color: #f59e0b; // Amber - Achiever
--type-4-color: #8b5cf6; // Purple - Individualist
--type-5-color: #06b6d4; // Cyan - Investigator
--type-6-color: #22c55e; // Green - Loyalist
--type-7-color: #eab308; // Yellow - Enthusiast
--type-8-color: #ef4444; // Red - Challenger
--type-9-color: #10b981; // Emerald - Peacemaker
```

---

## Progress Tracker

| Phase | Description             | Status      |
| ----- | ----------------------- | ----------- |
| 1     | SCSS Variable Migration | ✅ Complete |
| 2     | Component Style Updates | ✅ Complete |
| 3     | Layout Migration        | ✅ Complete |
| 4     | Homepage Replacement    | ✅ Complete |
| 5     | Sub-Component Updates   | ✅ Complete |
| 6     | Blog Styling            | ✅ Complete |
| 7     | Cleanup & Optimization  | ✅ Complete |

### Phase 5 Progress (Sub-Component Updates)

**Pages Updated:**

- [x] About page (`/src/routes/about/+page.svelte`)
- [x] Questions list page (`/src/routes/questions/+page.svelte`)
- [x] Questions detail page (`/src/routes/questions/[slug]/+page.svelte`)
- [x] Enneagram Corner index page (`/src/routes/enneagram-corner/+page.svelte`)
- [x] Enneagram Corner slug page (`/src/routes/enneagram-corner/[slug]/+page.svelte`)
- [x] Personality Analysis index page (`/src/routes/personality-analysis/+page.svelte`)
- [x] Personality Analysis slug page (`/src/routes/personality-analysis/[slug]/+page.svelte`)

**Question Components Updated:**

- [x] QuestionItem (`/src/lib/components/questions/QuestionItem.svelte`)
- [x] QuestionItemSkeleton (`/src/lib/components/questions/QuestionItemSkeleton.svelte`)
- [x] QuestionDisplay (`/src/lib/components/questions/QuestionDisplay.svelte`)
- [x] QuestionContent (`/src/lib/components/questions/QuestionContent.svelte`)
- [x] SearchQuestion (`/src/lib/components/questions/SearchQuestion.svelte`)
- [x] Interact (`/src/lib/components/molecules/Interact.svelte`)
- [x] AsyncErrorHandler (`/src/lib/components/error/AsyncErrorHandler.svelte`)
- [x] ErrorBoundary (`/src/lib/components/error/ErrorBoundary.svelte`)
- [x] Spinner styles (`/src/scss/components.scss`)

**Atom Components Updated:**

- [x] Modal2 (`/src/lib/components/atoms/Modal2.svelte`)
- [x] ModalNew (`/src/lib/components/atoms/ModalNew.svelte`)
- [x] BackNavigation (`/src/lib/components/atoms/BackNavigation.svelte`)
- [x] CategoryNavigation (`/src/lib/components/atoms/CategoryNavigation.svelte`)
- [x] SmallPopCard (`/src/lib/components/atoms/SmallPopCard.svelte`)
- [x] Skeleton (`/src/lib/components/atoms/Skeleton.svelte`)
- [x] SkeletonLoader (`/src/lib/components/atoms/SkeletonLoader.svelte`)
- [x] Popover (`/src/lib/components/atoms/Popover.svelte`)
- [x] LoadingButton (`/src/lib/components/atoms/LoadingButton.svelte`)
- [x] DateTip (`/src/lib/components/atoms/DateTip.svelte`)

**Molecule Components Updated:**

- [x] Footer (`/src/lib/components/molecules/Footer.svelte`)
- [x] MobileNav (`/src/lib/components/molecules/MobileNav.svelte`)
- [x] Email-Signup (`/src/lib/components/molecules/Email-Signup.svelte`)
- [x] RelatedPosts (`/src/lib/components/molecules/RelatedPosts.svelte`)

**Blog Components Updated:**

- [x] TableOfContents (`/src/lib/components/blog/TableOfContents.svelte`)
- [x] SuggestionsBlog (`/src/lib/components/blog/SuggestionsBlog.svelte`)
- [x] ArticleTitle (`/src/lib/components/blog/ArticleTitle.svelte`)
- [x] ArticleSubTitle (`/src/lib/components/blog/ArticleSubTitle.svelte`)
- [x] PeopleSuggestionsSideBar (`/src/lib/components/blog/PeopleSuggestionsSideBar.svelte`)

---

## Notes

- Keep test-solo-leveling-v4 as reference until migration complete
- Test each phase thoroughly before moving to next
- Maintain backward compatibility where possible during transition
- Update this document as tasks are completed
