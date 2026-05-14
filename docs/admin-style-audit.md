<!-- docs/admin-style-audit.md -->

# Admin Panel Style Audit

Last updated: 2026-05-14

## V5 Streetlamp Symposium pass — 2026-05-14

A second sweep was needed because the March audit migrated admin pages to the
Solo Leveling token set (`--void-*`, `--shadow-monarch`), which the May 2026
brand lock retired. Streetlamp Symposium tokens (`--lamp-glow`, `--stone-warm`,
`--ink-*`, `--data-teal`, `--night-deep`) are the V5 canonical set per
`docs/design-system.md`.

### Pages refreshed in this pass

All converted from legacy bridge-aliased tokens and hardcoded hex codes to
explicit V5 tokens. `svelte-check` clean (0 errors).

- `admin/consulting/+page.svelte` — worst offender (20 bridge tokens + 73 hex)
- `admin/content-board/+page.svelte` + `CompactCard.svelte`, `ContentAnalytics.svelte`,
  `MetadataSidebar.svelte`, `CrossLinkAnalysis.svelte`, `ContentEditorModal.svelte`
- `admin/analytics/+page.svelte` (30 hex codes inc. `LineChart color` props)
- `admin/welcome-sequence/+page.svelte` + `admin/reactivation-sequence/+page.svelte`
- `admin/questions/+page.svelte`
- `admin/consulting/clients/+page.svelte`, `admin/consulting/clients/[id]/+page.svelte`
- `admin/consulting/sessions/+page.svelte`, `admin/consulting/sessions/[id]/+page.svelte`
- `admin/consulting/resources/+page.svelte`, `admin/consulting/resources/[slug]/+page.svelte`
- `admin/drafts/[slug]/+page.svelte` (full SCSS block rewrite — was the worst chrome)
- `admin/comments/+page.svelte`, `admin/marketing/+page.svelte`, `admin/categories/+page.svelte`
- `admin/blog-diff/[id]/+page.svelte`, `admin/search/+page.svelte`, `admin/search/typeahead/+page.svelte`
- `admin/email-dashboard/+page.svelte`, `admin/users/+page.svelte`, `admin/messages/+page.svelte`
- `admin/content-board/personality-analysis/[slug]/+page.svelte`
- `admin/+page.svelte` (LineChart props)

### Mechanical translations applied

| Old                                              | New                                                         |
| ------------------------------------------------ | ----------------------------------------------------------- |
| `var(--card-background, white)`                  | `var(--stone-warm)`                                         |
| `var(--hover-background, var(--ink-bright))`     | `var(--stone-mid)` (the broken fallback)                    |
| `var(--lamp-glow, #6366f1)`                      | `var(--lamp-glow)`                                          |
| `var(--ink-bright, #1e293b)`                     | `var(--ink-bright)`                                         |
| `var(--ink-mid, var(--ink-dim))`                 | `var(--ink-mid)`                                            |
| `var(--stone-edge, var(--neutral-700))`          | `var(--stone-edge)`                                         |
| `#6366f1` (indigo)                               | `var(--lamp-glow)` (sodium-amber V5 primary)                |
| `rgba(99, 102, 241, X)`                          | `color-mix(in srgb, var(--lamp-glow) X%, transparent)`      |
| `#3b82f6`, `#60a5fa`, `#93c5fd`, `#bfdbfe`       | `var(--data-teal)` / `var(--data-cyan)`                     |
| `#10b981`, `#22c55e`, `#34d399`, `#059669`       | `var(--success)` / `var(--success-text)`                    |
| `#f59e0b`, `#fbbf24`, `#d97706`                  | `var(--warning)` / `var(--lamp-glow)` / `var(--lamp-light)` |
| `#ef4444`, `#dc2626`, `#fca5a5`                  | `var(--error)` / `var(--error-700)` / `var(--error-text)`   |
| `#fda4af`                                        | `var(--secondary-light)`                                    |
| `rgba(15, 23, 42, 0.65)` (slate modal overlay)   | `rgba(0, 0, 0, 0.6)`                                        |
| Material-Design enneagram colors (`#673AB7` etc) | canonical `--type-1-color` … `--type-9-color`               |
| `:global(.dark)` override blocks                 | **deleted** (V5 swaps via `:root.light`)                    |
| JS status maps holding hex strings               | strings now hold `'var(--success)'` etc.                    |

### Intentionally NOT touched (visible hex remains)

These hex codes are correct in context and should stay. Any future sweep
should preserve them.

| File                                                   | Why hex stays                                          |
| ------------------------------------------------------ | ------------------------------------------------------ |
| `admin/asset-generators/question-print/+page.svelte`   | Generated print-poster HTML; CSS vars don't export     |
| `admin/asset-generators/zine-creator/+page.svelte`     | Generated zine HTML; CSS vars don't export             |
| `admin/asset-generators/poster-generator/+page.svelte` | Color-picker swatches showing literal poster colors    |
| `admin/marketing/+page.svelte`                         | Twitter/IG/LinkedIn/Facebook brand colors (not 9takes) |
| `admin/links/+page.svelte`                             | QR code black/white + `@media print` border            |
| `admin/email-dashboard/+page.svelte`                   | Email-preview iframe expects light-mode HTML           |
| `admin/consulting/clients/[id]/+page.svelte`           | Hex inside email-body string sent to clients           |
| `admin/analytics/+page.svelte` (one `#fff`)            | White button text on lamp-glow fill                    |

### What's still open

These would be nice but are not blocking. Pick up on a future pass:

1. **Streetlamp dossier polish** — admin headings are still `<h2>` text. To
   fully match the public-page Streetlamp Symposium feel, admin sections
   should use the canonical `<SectionKicker>` atom with `§NN · LABEL` mono
   labels in JetBrains Mono. The `admin/+page.svelte` dashboard already
   demonstrates the pattern (`.eyebrow` + `.section-title`).
2. **Bridge alias cleanup** — `var(--primary-subtle)` and `var(--primary-glow)`
   still appear ~16 times across `admin/content-board/*` files. They resolve
   to V5 `--lamp-soft` / `--lamp-glow-rgba` so they render correctly, but
   for full bridge demolition they should be made explicit:
   - `var(--primary-subtle)` → `color-mix(in srgb, var(--lamp-glow) 14%, transparent)`
   - `var(--primary-glow)` → `color-mix(in srgb, var(--lamp-glow) 30%, transparent)`
3. **Canonical empty/error atoms** — multiple admin pages have ad-hoc
   `.empty-state` and `.error-state` styles. The styleguide ships
   `<EmptyState>` / `<ErrorState>` atoms (per
   `docs/design/migration-progress.md`) but admin hasn't adopted them.
4. **Asset-generator poster aesthetic** — `question-print` and `zine-creator`
   still render with the _old_ Solo Leveling color palette (slate gradients,
   sky-blue, rose-pink accents) and Noticia Text serif. The Streetlamp
   Symposium brand lock retired both. These pages need a real visual redesign,
   not a token sweep — escalate to design conversation.
5. **`/admin` dashboard chart colors** — LineChart now receives
   `color="var(--data-teal)"` etc. Verify LineChart's internal canvas/SVG
   actually resolves CSS vars at draw time (it should, since the prop is
   string-typed and likely fed into stroke/fill attributes that accept
   `var()`). If charts render blank or default, fall back to V5 hex literals.

### Visual QA still owed

Mechanical migration is done but **no visual smoke test was performed.** DJ
should walk each of these admin pages to confirm:

- Status badges read clearly against new amber/teal accents.
- The `.stat-card.highlight` gradient on `admin/consulting/+page.svelte`
  (lamp-glow → data-teal) reads as intentional, not muddy.
- Trust badges (outer/middle/inner) use error/warning/success in correct
  semantic order on `consulting/+page.svelte`,
  `consulting/clients/[id]/+page.svelte`, `consulting/sessions/+page.svelte`,
  `consulting/sessions/[id]/+page.svelte`.
- `admin/drafts/[slug]/+page.svelte` (the most heavily rewritten) — the
  whole SCSS block was replaced; verify the actual draft preview layout
  still reads.

---

## March 2026 history (Solo Leveling pass — now superseded)

The sections below document the original admin migration to the `--void-*`
Solo Leveling token set in March 2026. That token set was retired by the
May 2026 V5 lock; the May 14 pass above migrated all those pages a second
time to Streetlamp Symposium tokens. Kept here for archaeology.

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
