<!-- docs/admin-style-audit.md -->

# Admin Panel Style Audit

Last updated: 2026-03-04

## Design System Reference

The admin layout and dashboard use a modern dark-first token system:

- `--void-surface`, `--void-deep`, `--void-elevated`, `--void-highlight`
- `--shadow-monarch`, `--awakening-cyan`
- `--glow-sm`, `--glow-md`
- `--text-primary`, `--text-secondary`

Most other pages use an older, incompatible set with hardcoded light-mode fallbacks:

- `--card-background, #fff`
- `--border-color, #e2e8f0`
- `--hover-background, #f8fafc`
- `--primary, #3b82f6`

---

## Badly Outdated (Priority 1)

### 1. `admin/messages/+page.svelte`

- **Status:** FIXED (2026-03-04)
- **Changes:**
  - Replaced all Tailwind utility classes with scoped CSS using `--void-*` tokens
  - Migrated to Svelte 5 runes (`$props`, `$state`, `onclick`)
  - Removed double-padding wrapper
  - Uses `--void-surface`, `--void-deep`, `--void-elevated` for backgrounds/borders
  - Uses `--shadow-monarch` for accent colors and buttons
  - Clean panel-based layout with proper field styling

### 2. `admin/blog-diff/[id]/+page.svelte`

- **Status:** FIXED (2026-03-04)
- **Changes:**
  - Replaced all Tailwind classes with scoped CSS using `--void-*` tokens
  - Migrated to Svelte 5 runes (`$props`, `$state`, `$derived`, `$effect`, `onclick`)
  - Removed `container mx-auto` double-padding wrapper
  - Version selectors, summary banner, tabs, legend all use design tokens
  - Blog preview styles updated to use `--void-*` tokens for dark mode support
  - Source badges use semantic color classes (info, warning, success)

### 3. `admin/marketing/+page.svelte` + all sub-components

- **Status:** FIXED (2026-03-04)
- **Changes (parent page):**
  - Removed Flowbite `Badge` and `Spinner` imports — replaced with native styled elements
  - Removed `app.scss` import
  - Migrated to Svelte 5 runes (`$props`, `$state`, `$derived`, `onclick`)
  - All CSS now uses `--void-*` tokens (`--void-surface`, `--void-elevated`, `--void-deep`)
  - Uses `--shadow-monarch` for active tab, accent colors, and button glow
  - Removed `--primary-100` gradient header — uses `--void-deep` background
  - Removed all `prefers-color-scheme` dark mode overrides (tokens handle it natively)
  - Native CSS spinner replaces Flowbite `Spinner`
  - Native `.status-badge` and `.tab-badge` replace Flowbite `Badge`
- **Sub-components fixed (7 files):**
  - `CreateContent.svelte` — Removed Flowbite (Button, Input, Label, Textarea, Select), Svelte 5 runes, callback props
  - `ContentEditor.svelte` — Removed Flowbite (Accordion, Modal, Toggle, etc.), custom accordion/toggle/modal, Svelte 5 runes
  - `ContentManager.svelte` — Removed Flowbite (Badge, Button, Card, Select, etc.), `--void-*` tokens, removed dark mode block
  - `TemplateManager.svelte` — Removed 3 Flowbite Modals, native modal overlays, `$derived()` for filters
  - `ContentDetailModal.svelte` — Removed Flowbite (Modal, Badge, Toggle, etc.), `$bindable(open)`, callback props
  - `Calendar.svelte` — Removed Flowbite (Modal, Tooltip, Badge, Spinner), replaced all Tailwind with scoped CSS
  - `CampaignManager.svelte` — Removed 13 Flowbite imports, custom tab bar/accordion/alert/spinner, `--void-*` tokens

---

## Needs Work (Priority 2)

### 4. `admin/search/+page.svelte` + `search/typeahead/+page.svelte`

- **Status:** FIXED (2026-03-04)
- **Changes:**
  - Replaced all hardcoded hex colors with `--void-*` and `--text-*` tokens
  - `#6366f1` → `--shadow-monarch`, `#e5e7eb` → `--void-elevated`, `white` → `--void-surface`
  - Migrated to Svelte 5 runes (`$state`, `$effect`, `onclick`, `oninput`, `onkeydown`, `onfocus`, `onblur`)
  - Removed double-padding wrapper (admin layout provides padding)
  - Spinner, tabs, badges, dropdowns all use token system
  - Scrollbar styling uses `--void-*` tokens

### 5. `admin/drafts/+page.svelte`

- **Status:** FIXED (2026-03-04)
- **Changes:**
  - `export let data` → `$props()`
  - Replaced old tokens: `--card-background` → `--void-surface`, `--border-color` → `--void-elevated`, `--primary` → `--shadow-monarch`
  - Fixed `border-radius: 16px` → `12px` on cards and empty state
  - Replaced raw box-shadow with `var(--glow-sm)`
  - Removed hex fallbacks throughout
  - Removed double-padding wrapper

### 6. `admin/links/+page.svelte`

- **Status:** FIXED (2026-03-04)
- **Changes:**
  - `export let data` → `$props()`, `$:` → `$derived()`, `on:click` → `onclick`
  - Replaced `#f8fafc` → `--void-deep`, old tokens → `--void-*` tokens
  - Fixed `border-radius: 16px` → `12px`
  - Replaced raw box-shadow with `var(--glow-sm)`
  - Spinner uses `--void-elevated` / `--shadow-monarch` tokens
  - Removed hex fallbacks, buttons use token-based hover

### 7. `admin/comments/+page.svelte`

- **Status:** FIXED (2026-03-04)
- **Changes:**
  - `export let data` → `$props()`, state vars → `$state()`, `$:` → `$derived()`
  - `on:click` → `onclick`, `on:change` → `onchange`
  - Replaced `--card-background` → `--void-surface`, `--border-color` → `--void-elevated`
  - Replaced `--primary` → `--shadow-monarch`, `--hover-background` → `--void-deep`
  - Fixed `border-radius` → `12px`, removed hex fallbacks
  - Note: Pre-existing `GenericStringError` type mismatches remain (not style-related)

### 8. `admin/users/+page.svelte`

- **Status:** FIXED (2026-03-04)
- **Changes:**
  - `export let data` → `$props()`, state vars → `$state()`
  - `formattedProfiles` and `formattedSignups` → `$derived<>()` for proper reactivity
  - `on:click` → `onclick`, `on:change` → `onchange`
  - Replaced `--card-background` → `--void-surface`, `--border-color` → `--void-elevated`
  - Replaced hardcoded `#2563eb` hover → `opacity: 0.85`
  - Fixed `border-radius` → `12px`

### 9. `admin/questions/+page.svelte`

- **Status:** FIXED (2026-03-04)
- **Changes:**
  - `export let data` → `$props()`, state vars → `$state()`, `$:` → `$derived()`
  - `on:click` → `onclick` (kept `on:questionRemoved` for dispatcher-based component)
  - Replaced old tokens → `--void-*` tokens, `--primary` → `--shadow-monarch`
  - Fixed `border-radius` → `12px`, removed hex fallbacks

### 10. `admin/questions/hierarchy/+page.svelte`

- **Status:** FIXED (2026-03-04)
- **Changes:**
  - `export let data` → `$props()`, `let categories` → `$derived(data.categories)`
  - `on:click` → `onclick`
  - Replaced old tokens → `--void-*` tokens
  - Fixed `border-radius` → `12px`, removed hex fallbacks

### 11. `admin/email-dashboard/+page.svelte`

- **Status:** FIXED (2026-03-04)
- **Changes:**
  - `export let data` → `$props()`, ~40 state vars → `$state()`
  - `on:click` → `onclick`, `on:change` → `onchange`, `on:input` → `oninput`
  - `on:click|self` → manual `e.target === e.currentTarget` check
  - Replaced `--card-background` → `--void-surface`, `--border-color` → `--void-elevated`
  - Replaced `--background` → `--void-deep`, `--primary` → `--shadow-monarch`
  - Replaced raw box-shadow → `var(--glow-md)`
  - `var(--success)` → `#22c55e`, `var(--text-tertiary)` → `var(--text-secondary)`
  - `var(--primary-dark, #5b4cdb)` hover → `opacity: 0.85`

### 12. `admin/consulting/*` (layout + all sub-pages)

- **Status:** FIXED (2026-03-04)
- **Files:** `+layout.svelte`, `+page.svelte`, `clients/+page.svelte`, `clients/[id]/+page.svelte`, `sessions/+page.svelte`, `sessions/[id]/+page.svelte`, `resources/+page.svelte`, `resources/[slug]/+page.svelte`
- **Changes:**
  - All 8 files: `export let` → `$props()`, state vars → `$state()`, `$:` → `$derived()`
  - `on:click` → `onclick`, `on:change` → `onchange`, `on:input` → `oninput`
  - `on:click|self` → manual self-check (5 instances across files)
  - Kept `on:send`/`on:close` for `EmailComposeModal` (uses `createEventDispatcher`)
  - Replaced `--card-background` → `--void-surface`, `--border-color` → `--void-elevated`
  - Replaced `--border-radius` → `12px`, `--primary` → `--shadow-monarch`
  - Replaced `--background` → `--void-deep`, `--hover-background` → `--void-deep`
  - Removed all hex fallbacks (`#e2e8f0`, `#64748b`, `#1e293b`, `#6366f1`)

---

## Good (No Action Needed)

| Page                                                   | Notes                                          |
| ------------------------------------------------------ | ---------------------------------------------- |
| `admin/+layout.svelte`                                 | Modern `--void-*` tokens, responsive, Svelte 5 |
| `admin/+page.svelte` (dashboard)                       | Matches layout system, Svelte 5                |
| `admin/analytics/+page.svelte`                         | Clean, uses shared components                  |
| `admin/asset-generators/+page.svelte`                  | Modern tokens, clean                           |
| `admin/asset-generators/poster-generator/+page.svelte` | Svelte 5 runes                                 |
| `admin/asset-generators/zine-creator/+page.svelte`     | Svelte 5 runes                                 |
| `admin/content-board/+page.svelte`                     | Svelte 5, delegates to components              |

---

## Common Fix Checklist

When updating each page, apply all of these:

- [ ] Replace `--card-background` → appropriate `--void-*` token
- [ ] Replace `--border-color` → `--void-elevated` or similar
- [ ] Replace `--hover-background` → `--void-elevated` or `--void-deep`
- [ ] Replace `--primary` → `--shadow-monarch` or appropriate accent
- [ ] Remove all hardcoded hex fallbacks (`#fff`, `#e2e8f0`, `#f8fafc`, `#1e293b`, `#64748b`)
- [ ] Remove double-padding wrappers that conflict with layout's `.admin-content { padding: 24px }`
- [ ] Replace Flowbite components (Badge, Button, Spinner) with native styled elements
- [ ] Replace raw Tailwind classes with scoped CSS using design tokens
- [ ] Migrate `export let` → `$props()`
- [ ] Migrate `$:` → `$derived` / `$effect`
- [ ] Migrate `on:click` → `onclick`
- [ ] Ensure dark mode works correctly
- [ ] Use consistent `border-radius: 12px` on cards
