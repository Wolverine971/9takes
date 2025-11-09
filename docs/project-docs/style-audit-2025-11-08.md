# 9takes UI Style Audit – 2025-11-08

This document captures the current state of the design system, identifies the biggest sources of styling drift, and lays out a concrete path to high-information-density defaults powered by Tailwind-first patterns.

---

## 1. Stack & Inventory Snapshot

| Area                | Current State                                                                                                                                   | Notes                                                                                                                    |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Framework           | SvelteKit + mdsvex + Tailwind 3.4 + Flowbite (`tailwind.config.ts:1`)                                                                           | Flowbite utilities are available but lightly used.                                                                       |
| Global styles       | `src/app.scss:1` imports Tailwind layers plus `src/scss/index.scss` (1,054 lines), `components.scss` (1,335 lines) and `blog.scss` (332 lines). | Every Svelte `<style lang="scss">` automatically inherits these via the SCSS `prependData` hook in `svelte.config.js:9`. |
| Legacy CSS          | `src/app.postcss:1` + `src/global.postcss:1` still ship a conflicting dark theme; nothing imports them anymore.                                 | Safe to archive once the Tailwind base covers required resets.                                                           |
| Component styling   | 201 Svelte files total, 135 still declare `<style>` blocks (Python audit).                                                                      | Inline styles dominate long-form/blog components and admin surfaces.                                                     |
| Custom SCSS helpers | Token + utility definitions live in `src/scss/index.scss:10` and `src/scss/components.scss:1` (`.btn-*`, `.card-base`, etc.).                   | Heavy use of `@extend` ties components to SCSS compilation order and hinders tree-shaking.                               |
| Content overrides   | `src/scss/blog.scss:10` rewrites anchor, heading, quote, checklist, and callout styles for every `.blog` wrapper.                               | Adds decorative arrows, extra spacing, and box shadows that fight density goals.                                         |
| Existing docs       | `docs/CSS_STYLE_GUIDE.md:1` and `STYLE_AUDIT_REPORT.md:1` describe a previous purple/glass aesthetic.                                           | Neither reflects the lean, high-density direction nor the current Tailwind palette.                                      |

---

## 2. Key Issues to Resolve

### 2.1 Token Drift & Conflicting Sources

- CSS variables in `src/scss/index.scss:10` define an extensive palette (Greek set, glass effects, golden ratio spacing) while Tailwind tokens live separately in `tailwind.config.ts:6`. Components regularly call `var(--primary-700)` (`src/routes/blog/experiment/+page.svelte:2072`) even though that variable does not exist.
- Legacy PostCSS variables (`src/app.postcss:5`) create yet another color system that is never surfaced in Tailwind utilities.
- Result: designers/authors guess which token is safe, leading to inconsistent colors, radii, and typography across surfaces.

### 2.2 Global SCSS Bloat & `@extend` Chains

- Core helpers `.btn-*`, `.card-*`, `.form-*` etc. in `src/scss/components.scss:1` rely on `@extend`, so local component styles (e.g., `src/lib/components/blog/TableOfContents.svelte:663`) silently pull in large rule sets with limited control over responsive breakpoints.
- Because Svelte scopes component styles, any `@extend .card-base` copies the entire rule set into that component bundle, inflating CSS and making purge outcomes unpredictable.

### 2.3 Layout & Spacing Fighting High-Density Goals

- Global wrappers (`main` and `.section-wrapper` inside `src/scss/index.scss:247`) enforce `padding: 2rem` and `margin-bottom: 4rem`, creating airy layouts that contradict the desired “tight and efficient” presentation.
- Hero/CTA sections in `src/routes/enneagram-corner/+page.svelte:338` and `.resources-footer` at `src/routes/enneagram-corner/+page.svelte:392` default to 2–4 rem paddings, large drop shadows, and wide gradients that consume vertical space.

### 2.4 Blog Overrides Reduce Scanability

- `.blog a::after` (arrow icon) and forced margin resets in `src/scss/blog.scss:10` add visual noise and extra line-height to every blog anchor.
- Additional custom components (`.insight-box`, `.visual-metaphor`, `.checklist-*` at `src/scss/blog.scss:101`) exist only as raw CSS, so mdsvex content authors cannot rely on Tailwind utility classes for these repeatable patterns.

### 2.5 Hard-Coded Typography & Colors

- `src/lib/components/blog/EnneagramCategoryIntro.svelte:704` hard-codes heading sizes and colors (`#2d3436`, `#a29bfe`), bypassing Tailwind typography utilities.
- `src/routes/enneagram-corner/+page.svelte:347` blends gradients and text colors manually, so future palette tweaks require editing every page.
- Similar hard-coded values exist in `src/lib/components/blog/StructuredBlogView.svelte:195` and `src/lib/components/marketing/Calendar.svelte:702`.

### 2.6 Component-Local Style Islands

- Sticky/Fixed components (`src/lib/components/blog/TableOfContents.svelte:663`) set `position: fixed`, custom scrollbars, and width limits without coordinating with parent layouts, causing collisions on smaller breakpoints.
- AMP story at `src/routes/stories/enneagram-and-mental-illness/+page.svelte:98` embeds custom `<style amp-custom>` rules that ignore the shared palette entirely.
- Marketing calendar (`src/lib/components/marketing/Calendar.svelte:702`) and question/comment SCSS (`src/lib/components/molecules/comment.scss:1`) define their own spacing scales instead of using Tailwind utilities, making consistency impossible.

### 2.7 Stale Governance

- The previous audit (`STYLE_AUDIT_REPORT.md:1`) shows many pages “updated,” yet current scans still flag inline `<style>` blocks and undefined tokens. There is no enforcement mechanism to keep new content Tailwind-only.

---

## 3. High-Information-Density Style Guide (vNext)

### 3.1 Design Principles

1. **Information first**: Typography defaults prioritize legibility at smaller sizes (14–18 px) with tight leading (1.35–1.45) and limited decorative elements.
2. **Tokenized everything**: Colors, radii, shadows, and spacing exist once—in Tailwind’s theme—then used via utilities or semantic component classes.
3. **Layered containment**: Prefer `max-w-*` containers and `gap-*` utilities to keep layouts narrow and organized, rather than applying large section-level padding.
4. **Progressive embellishment**: Accents (gradients, glassmorphism) are opt-in component variants, not the default background for entire sections.

### 3.2 Tokens (Tailwind Theme Extensions)

| Token               | Value                             | Tailwind Usage                                                |
| ------------------- | --------------------------------- | ------------------------------------------------------------- |
| `brand.purple`      | `#6c5ce7` (current `primary.700`) | `text-brand-purple`, `bg-brand-purple`, `border-brand-purple` |
| `brand.purpleDark`  | `#4834d4`                         | Hover states, dark surfaces                                   |
| `brand.purpleLight` | `#a29bfe`                         | Subtle backgrounds, chips                                     |
| `neutral.900`       | `#18191a`                         | Body text                                                     |
| `neutral.700`       | `#4b5563`                         | Secondary text                                                |
| `accent.gold`       | `#d4af37` (Greek highlight)       | Sparing highlight strokes                                     |
| `semantic.success`  | `#00b894`                         | Success badges                                                |
| `semantic.warning`  | `#fdcb6e`                         | Warning callouts                                              |
| `semantic.info`     | `#74b9ff`                         | Info callouts                                                 |

Add these to `tailwind.config.ts:6` under `theme.extend.colors` and remove duplicated CSS variables once components finish migrating.

Spacing scale (rem): `xs 0.25`, `sm 0.5`, `md 0.75`, `lg 1`, `xl 1.5`, `2xl 2`, `3xl 3`. Map to Tailwind `spacing` so that `py-3` ≈ `0.75rem`, enabling tighter layouts by default.

Typography:

- Interface font stack: `{ fontFamily: { sans: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'] } }`
- Editorial font stack: `serif: ['"Noticia Text"', 'Georgia', 'serif']`
- Utility classes:
  - `text-title` (custom): `text-2xl font-semibold tracking-tight`
  - `text-body` (custom): `text-base leading-snug text-neutral-800`

### 3.3 Layout Defaults

- **Container**: `<section class="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-0">` keeps content narrow on wide screens while minimizing wasted space.
- **Grid**: Use `gap-4` / `gap-6` for cards; avoid manual `margin: 4rem`.
- **Blog prose**: Extend `@tailwindcss/typography` to shrink default `prose` spacing (`prose-headings:mt-6`, `prose-p:my-3`).
- **Sticky sidebars**: Use `lg:sticky lg:top-24` instead of global `position: fixed` with manual transforms (`src/lib/components/blog/TableOfContents.svelte:663`).

### 3.4 Component Patterns

- **Card**: `rounded-lg border border-neutral-200/80 bg-white shadow-sm hover:shadow-md transition`. Use density modifiers (`data-compact="true"` toggles `p-4` vs `p-5`).
- **Callout (insight/visual metaphor)**:

```svelte
<aside class="rounded-md border-l-4 border-success-500 bg-success-50 px-4 py-3 text-sm leading-snug text-neutral-800 shadow-[0_1px_2px_rgba(15,23,42,0.08)]">
```

- **Checklist**: For mdsvex, register components or shortcodes so authors can write `<Checklist items={...} />` instead of relying on `.checklist-item` CSS.
- **Tables**: `text-sm leading-tight`, `whitespace-nowrap` on headers, `px-3 py-2` cells, `border-y` to keep lines tight.
- **Buttons**: Replace SCSS `.btn-*` mixins with headless Svelte components using Tailwind variants (primary/secondary/ghost). Example:

```svelte
<button class="inline-flex items-center justify-center rounded-md border border-transparent bg-brand-purple px-3 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-brand-purpleDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-purple">
```

---

## 4. Modernization Strategy

1. **Foundation (Week 1)**
   - Mirror all needed tokens (colors, spacing, radii, shadows, fonts) into `tailwind.config.ts:6`.
   - Create `src/lib/styles/tokens.ts` (or JSON) so mdsvex plugins and utility functions reference the same values.
   - Remove `src/app.postcss:1` from the build and ensure `src/routes/+layout.svelte:4` imports only `app.scss`.
2. **Global Layer Cleanup (Week 1–2)**
   - Slim `src/scss/index.scss:10` down to resets + legacy fallbacks; move reusable patterns into Tailwind `@layer components`.
   - Delete decorative rules from `src/scss/blog.scss:10` after recreating them as discrete components (Callout, Checklist, Insight).
3. **Component Migration (Rolling)**
   - Target highest-traffic or visually important components first (see Section 5).
   - For each file: remove `<style>` block, port layout to Tailwind classes, and rely on shared component primitives.
4. **Content Surfaces**
   - Configure `@tailwindcss/typography` to enforce heading/body spacing and register mdsvex components for callouts.
   - Ensure blog layouts use `prose` + utility wrappers rather than custom `.blog` overrides.
5. **Governance**
   - Add lint rule or simple script (e.g., `pnpm lint:styles`) that fails CI if new `<style>` blocks appear outside approved directories.
   - Document required Tailwind classes per component in `docs/project-docs/style-catalog.md` once the first wave ships.

---

## 5. Priority Fix List

| Rank | Path                                                              | Issues                                                                                | Recommended Action                                                                                        |
| ---- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 1    | `src/routes/blog/experiment/+page.svelte:2037`                    | 2,079-line page with bespoke `.row`, `.emotions-box`, undefined `var(--primary-700)`. | Break into mdsvex sections + shared components, move layout to Tailwind grids, drop custom variables.     |
| 2    | `src/routes/enneagram-corner/+page.svelte:312`                    | Large gradients, 2–4 rem padding, manual typography resets.                           | Rebuild hero/CTA using Tailwind containers, convert badges to card components, enforce new spacing scale. |
| 3    | `src/lib/components/blog/EnneagramCategoryIntro.svelte:704`       | Hard-coded headings, grid, overlays; duplicates CSS style guide.                      | Convert to Tailwind classes with responsive grid utilities and semantic tokens.                           |
| 4    | `src/lib/components/blog/TableOfContents.svelte:663`              | Fixed positioning, custom scrollbars, heavy `@extend`.                                | Replace with `sticky` sidebar, use utility classes for typography, expose config via props.               |
| 5    | `src/lib/components/marketing/Calendar.svelte:701`                | Inline global overrides for Flowbite modals/buttons, heavy `!important`.              | Wrap Flowbite calendar in Tailwind `@layer components`, rely on design tokens for badge colors.           |
| 6    | `src/lib/components/molecules/comment.scss:1`                     | 490 lines of SCSS for cards, avatars, actions.                                        | Swap to Tailwind `flex`/`gap` utilities inside the Comments molecule and delete file.                     |
| 7    | `src/scss/blog.scss:10`                                           | Global anchor arrows, callouts, checklists tied to `.blog`.                           | Replace with mdsvex shortcodes + Tailwind components; remove file from `app.scss`.                        |
| 8    | `src/routes/stories/enneagram-and-mental-illness/+page.svelte:98` | AMP-only CSS, divergent palette.                                                      | Create AMP-safe Tailwind preset (limited classes) or inline minimal CSS using shared tokens.              |

---

## 6. Migration Workflow & Checklist

1. **Assess**
   - Capture screenshots + key styles before touching a file.
   - Identify which legacy classes (`.card-base`, `.btn-primary`) the component relies on.
2. **Tokenize**
   - Map every unique color/spacing/typography value to a Tailwind token; extend config first if missing.
3. **Convert**
   - Replace structural CSS with utility classes in markup.
   - For repeated patterns (e.g., `badge-item`), extract a reusable Svelte component or define a Tailwind `@layer components` class.
4. **Clean Up**
   - Remove the `<style>` block entirely; ensure no orphan selectors remain.
   - Run `pnpm check` and visual regression (Playwright) where available.

**Pre-merge checklist**

- No new `style=` attributes in Svelte files unless dynamic calculations are unavoidable.
- Only approved directories (`static/amp`, etc.) may keep inline CSS.
- Accessibility: verify focus states (`focus-visible`) survive conversion.
- Responsive sweep at 375 px, 768 px, 1024 px before sign-off.

---

## 7. References & Next Steps

- Tokens & resets: `tailwind.config.ts:6`, `src/scss/index.scss:10`, `src/scss/components.scss:1`.
- Blog overrides: `src/scss/blog.scss:10`, `docs/CSS_STYLE_GUIDE.md:1`.
- Layout entry point: `src/routes/+layout.svelte:4`.
- Legacy audit: `STYLE_AUDIT_REPORT.md:1`.

**Immediate actions**

1. Extend Tailwind tokens + typography plugin, remove unused PostCSS files.
2. Convert `blog.scss` callouts into Tailwind-powered mdsvex components.
3. Schedule refactors for the top 4 offenders (Section 5) and track progress inside this doc.

Once these foundations are in place, we can methodically ship compact, consistent layouts with predictable defaults and no lingering inline CSS.

---

## Change Log

- **2025-11-08** – Tailwind theme now exposes brand/semantic colors, compact spacing scale, and updated typography defaults (`tailwind.config.ts`). Legacy PostCSS theme files (`src/app.postcss`, `src/global.postcss`) removed, and global SCSS defines `--primary-700`/`--primary-500` for backward compatibility.
- **2025-11-08** – Replaced `.insight-box`, `.visual-metaphor`, and `.checklist-*` blog overrides with Tailwind callout components (`src/lib/components/blog/callouts/*`) and updated relevant Enneagram articles plus `src/scss/blog.scss`.
- **2025-11-08** – Converted `/enneagram-corner` landing page to Tailwind-only layout (navigation grid, blog cards, resource footer) and removed its SCSS block.
- **2025-11-08** – Updated `/questions/categories` routes (index and `[slug]`) plus `/questions/+page`, `/questions/create`, and `/questions/[slug]` to remove inline styles in favor of Tailwind utility classes.
- **2025-11-08** – Modernized `src/lib/components/marketing/Calendar.svelte` with Tailwind wrappers (responsive overflow, modal sizing) and removed the legacy `<style>` block.
