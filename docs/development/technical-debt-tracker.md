# Technical Debt Tracker

Last scanned: 2026-03-29

---

## 1. Svelte 5 Migration (Legacy Svelte 4 Patterns)

**Status**: Not started
**Impact**: Code consistency, future Svelte upgrades
**Effort**: Large (143+ files)

| Pattern | Files | Replacement |
|---------|-------|-------------|
| `export let` props | ~143 | `$props()` |
| `$:` reactive declarations | ~61 | `$derived` / `$effect` |
| `onMount` / `onDestroy` | ~45 | `$effect` (where appropriate) |
| `createEventDispatcher` | ~17 | Callback props |

**Note**: Migrate incrementally when touching files. No need for a big-bang rewrite.

---

## 2. Hardcoded Colors (Light/Dark Mode Issues)

**Status**: In progress
**Impact**: Broken visuals in light mode
**Effort**: Medium (~50 files, 190+ instances)

### 2a. `rgba(0,0,0, >0.3)` overlays (~23 files)

Hardcoded dark overlays that look too harsh or opaque in light mode. Replace with theme-aware shadow variables or reduced opacity.

| File | Instances | Issue |
|------|-----------|-------|
| `molecules/RelatedPosts.svelte` | 2 | `rgba(0,0,0,0.7)` and `0.5` in gradients |
| `atoms/PopCardGroup.svelte` | 2 | `rgba(0,0,0,0.8)` text-shadow, `0.4` bg |
| `atoms/SmallPopCard.svelte` | 1 | `rgba(0,0,0,0.8)` text-shadow |
| `blog/SuggestionsPeople.svelte` | 1 | `rgba(0,0,0,0.7)` background |
| `blog/PersonSuggestion.svelte` | 1 | `rgba(0,0,0,0.7)` background |
| `molecules/MobileNav.svelte` | 1 | `rgba(0,0,0,0.7)` background |
| `molecules/MobileNavNew.svelte` | 1 | `rgba(0,0,0,0.5)` background |
| `molecules/Link.svelte` | 1 | `rgba(0,0,0,0.7)` background |
| `atoms/ModalNew.svelte` | 1 | `rgba(0,0,0,0.7)` modal overlay |
| `marketing/ContentDetailModal.svelte` | 1 | `rgba(0,0,0,0.6)` background |
| `marketing/TemplateManager.svelte` | 1 | `rgba(0,0,0,0.6)` background |
| `marketing/ContentEditor.svelte` | 1 | `rgba(0,0,0,0.6)` background |
| `marketing/Calendar.svelte` | 1 | `rgba(0,0,0,0.6)` background |
| `email/EmailComposeModal.svelte` | 1 | `rgba(0,0,0,0.5)` background |
| `questions/QuestionSocialCardTemplate.svelte` | 3 | `rgba(0,0,0,0.55)` text-shadows |
| `notifications/AdminMessageReceiver.svelte` | 1 | `rgba(0,0,0,0.5)` box-shadow |
| `blog/EnneagramDiagram.svelte` | 1 | `rgba(0,0,0,0.4)` box-shadow |
| `questions/SearchQuestion.svelte` | 1 | `rgba(0,0,0,0.4)` box-shadow |
| `molecules/SortComments.svelte` | 1 | `rgba(0,0,0,0.5)` box-shadow |

### 2b. Hardcoded `#fff`/`white`/`#000`/`black` text (~46 files)

Text colors that don't adapt to theme. Replace with `--text-primary`, `--text-on-primary`, etc.

**Worst offenders** (5+ instances):
- `marketing/CampaignManager.svelte` (7)
- `molecules/SortComments.svelte` (6)
- `marketing/ContentDetailModal.svelte` (5)
- `marketing/TemplateManager.svelte` (4)
- `marketing/ContentEditor.svelte` (4)
- `marketing/Calendar.svelte` (3)

### 2c. Hardcoded `rgba(45, 212, 191, ...)` teal (120+ instances)

Should use CSS variables: `--primary-glow`, `--primary-subtle`, `--primary`, etc.

**Worst offenders** (8+ instances):
- `notifications/AdminMessageReceiver.svelte` (18)
- `blog/EnneagramCategoryIntro.svelte` (11)
- `blog/TableOfContents.svelte` (11)
- `molecules/MobileNav.svelte` (9)
- `blog/EnneagramDiagram.svelte` (8)

### 2d. Hardcoded hex backgrounds (8 instances)

| File | Value | Replace with |
|------|-------|-------------|
| `questions/QuestionSocialCardTemplate.svelte` | `#10111f` | `var(--bg-base)` |
| `marketing/ContentEditor.svelte` | `#ef4444`, `#dc2626` | `var(--error)` |
| `marketing/TemplateManager.svelte` | `#ef4444`, `#dc2626` | `var(--error)` |
| `marketing/CampaignManager.svelte` | `#ef4444`, `#dc2626` | `var(--error)` |
| `molecules/LinkMap.svelte` | `#ee8a65` | `var(--secondary)` |

---

## 3. Severely Outdated Dependencies

**Status**: Not started
**Impact**: Security, missing features, API drift
**Effort**: Medium-High (risk of breaking changes)

### Critical (multiple major versions behind)

| Package | Current | Latest | Gap |
|---------|---------|--------|-----|
| `stripe` | 11.18.0 | 21.0.1 | +10 majors |
| `@vavite/node-loader` | 1.8.3 | 5.1.0 | +3 majors |
| `eslint` | 8.57.1 | 10.1.0 | +2 majors |
| `@typescript-eslint/*` | 6.21.0 | 8.57.2 | +2 majors |
| `flowbite` | 2.5.2 | 4.0.1 | +2 majors |
| `flowbite-svelte` | 0.46.23 | 1.33.0 | +1 major |

### High (1 major version behind)

| Package | Current | Latest |
|---------|---------|--------|
| `@elastic/elasticsearch` | 8.19.0 | 9.3.4 |
| `@fingerprintjs/fingerprintjs` | 4.6.2 | 5.1.0 |
| `@sveltejs/vite-plugin-svelte` | 6.2.4 | 7.0.0 |
| `jspdf` | 3.0.1 | 4.2.1 |
| `postcss-load-config` | 4.0.2 | 6.0.1 |
| `postcss-preset-env` | 7.8.3 | 11.2.0 |
| `supabase` (CLI) | 1.226.4 | 2.84.4 |

---

## 4. Code-Level Debt

**Status**: Not started
**Impact**: Low-Medium
**Effort**: Small

- [ ] Remove deprecated methods in `src/utils/server/smart-llm-service.ts` (`getProviderPreferences`, `enforceToolSafeProviderPrefs`)
- [ ] Implement error tracking in `src/lib/utils/logger.ts` (TODO on line 57)
- [ ] Update `.npmrc` — `shamefully-hoist` and `auto-install-peers` are deprecated

---

## Approach

1. **Hardcoded colors** — Fix now (user-visible, light/dark mode broken)
2. **Svelte 5 migration** — Incremental, migrate when touching files
3. **Dependencies** — Plan and test in isolation, one major upgrade at a time
4. **Code debt** — Quick wins, do opportunistically
