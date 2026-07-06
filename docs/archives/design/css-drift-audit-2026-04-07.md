<!-- docs/css-drift-audit-2026-04-07.md -->

# CSS Drift Audit — 9takes

**Date:** 2026-04-07  
**Scope:** User-facing route files with the largest local `<style>` blocks, checked against `src/scss/index.scss`, `src/scss/components.scss`, and `tailwind.config.ts`.  
**Status:** Reviewed against the current codebase on 2026-04-07. This document was updated after verification; no production CSS was changed.

---

## Method note

- CSS line counts below are the size of each route's local `<style>` block, not the full file length.
- Color counts are grep-based and directional. They are useful for prioritization, not as exact design metrics.
- This audit checks theme-system fit and maintainability. It does **not** replace a browser-based visual QA pass.

---

## TL;DR

Nine audited pages carry **~7,600 lines of local CSS**. The drift is real, but it falls into a few repeatable buckets rather than nine unrelated design problems:

1. **Theme tokens are bypassed most often in translucent accents and image overlays.** Across the audited files there are `100` teal `rgba(45, 212, 191, …)` calls, `39` hardcoded `#fff` text uses, and two competing near-black overlay families: `rgba(12, 10, 9, …)` and `rgba(10, 10, 15, …)`.
2. **Light mode is genuinely broken on the image-card hubs** because those pages hardcode dark overlays and white overlay text instead of deriving them from theme tokens.
3. **The biggest duplication cluster is `pop-culture`, `how-to-guides`, and `community`.** `personality-analysis` is a close visual sibling, but not a literal copy of the same page.
4. **The shared system is only partially being used.** Global `.btn-*` classes exist, and card primitives exist as `.card-base`, `.card-hover-effect`, and `.card-interactive`, but several route files redefine `.btn-primary` locally and roll their own card shells anyway.

The strongest aesthetic question is not "should everything become generic?" It is: **which visual differences are intentional brand expression, and which are just drift?**

---

## Theme baseline

Source of truth today:

- `src/scss/index.scss`
- `src/scss/components.scss`
- `tailwind.config.ts`

What is already defined:

- **Core palette**: teal primary, rose secondary, purple accent, warm-stone neutrals
- **Functional tokens**: success, warning, error, error-700, text-on-dark, shadows, glow tokens
- **Light mode**: full `:root.light` token overrides exist in `index.scss`
- **Enneagram tokens**: `--type-1-color` through `--type-9-color`
- **Buttons**: `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-ghost`
- **Card primitives**: `.card-base`, `.card-hover-effect`, `.card-interactive`

Important nuance:

- Tailwind already exposes **`brand.gold`** in `tailwind.config.ts`.
- The SCSS token layer does **not** expose a matching `--brand-gold` custom property.
- The homepage already aliases its "gold" semantics back onto rose (`--status-gold: var(--secondary)`), so the current amber usage is partly a visual leftover, not a cleanly established fifth brand color.

---

## Page-by-page findings

### 1. `src/routes/+page.svelte` (Homepage) — 1,171 lines of CSS

| Signal            | Result                                 |
| ----------------- | -------------------------------------- |
| `!important`      | 2, both inside reduced-motion handling |
| Fonts             | Clean                                  |
| Light mode tuning | No page-specific tuning                |

Confirmed drift:

- **Rose text with a sky-blue glow** still appears in `.text-system`:

  ```scss
  .text-system {
  	color: var(--system-hologram);
  	text-shadow: 0 0 15px rgba(96, 165, 250, 0.5);
  }
  ```

  That glow reads like a different brand voice than the text itself.

- **The coaching card still hardcodes amber** in four places, even though the same file maps `--status-gold` and `--status-gold-bright` back to the secondary rose palette.
- **Decorative teal and rose glows are still largely raw RGBA** instead of token-derived `color-mix`.

Designer read:

- The homepage is not the messiest file. It has a coherent local visual language.
- The problem is that a few raw color remnants make it feel like it belongs to an older branch of the brand system.
- This is a good candidate for a **targeted cleanup**, not a visual rewrite.

---

### 2. `src/routes/enneagram-corner/+page.svelte` — 1,114 lines

| Signal       | Result                        |
| ------------ | ----------------------------- |
| `!important` | 0                             |
| Fonts        | Clean                         |
| Light mode   | Broken on image-card sections |

Confirmed drift:

- Uses both near-black overlay families:
  - `rgba(10, 10, 15, …)`
  - `rgba(12, 10, 9, …)`
- Uses `#fff` 8 times and `rgba(255, 255, 255, 0.8)` 3 times in image-card states.
- Uses raw teal RGBA in borders, fills, and glows.
- Does not leverage the `--type-*` color system in a type-centric hub.

Designer read:

- This page feels visually close to the brand, but the overlay logic is doing too much heavy lifting.
- In dark mode it looks fine. In light mode it will feel like a dark card pasted onto a light shell.

---

### 3. `src/routes/enneagram-corner/mental-health/+page.svelte` — 726 lines

| Signal       | Result                                                     |
| ------------ | ---------------------------------------------------------- |
| `!important` | 0                                                          |
| Fonts        | Clean                                                      |
| Light mode   | Partially tokenized, but image-card treatment still breaks |

Confirmed drift:

- **Crisis banner** is still hardcoded:

  ```scss
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  ```

  This should use semantic error tokens.

- **Type badges are generic teal buttons**, not type-specific colors.
- **Image-card overlays still rely on dark hardcoded gradients and white text.**
- This file is otherwise closer to the design system than the other hubs because it already uses local `color-mix` surface variables.

Designer read:

- This page has the clearest path to improvement: fix the semantic error styling, then decide whether the by-type section should actually look type-specific.

---

### 4. `src/routes/book-session/+page.svelte` — 907 lines

| Signal            | Result                                       |
| ----------------- | -------------------------------------------- |
| `!important`      | 0                                            |
| Fonts             | Clean                                        |
| Light mode tuning | Mostly token-aware, but not fully systemized |

Confirmed drift:

- Error UI still hardcodes literals inside a token-friendly structure:

  ```scss
  border: 1px solid color-mix(in srgb, #ef4444 30%, transparent);
  background: color-mix(in srgb, #ef4444 8%, transparent);
  color: #fca5a5;
  ```

- Success icon is hardcoded `#34d399` instead of `var(--success-text)`.
- `.btn-primary` is redefined locally, so the route uses the shared class name but not the shared implementation.
- `stat-card`, `content-card`, `step-card`, and related shells repeat a common card pattern instead of consuming shared primitives.

Designer read:

- This page is **conversion-oriented**, so some bespoke emphasis is justified.
- The issue is not that it is special. The issue is that the specialness is encoded as local CSS instead of a reusable variant.

---

### 5. `src/routes/about/+page.svelte` — 849 lines

| Signal            | Result                                             |
| ----------------- | -------------------------------------------------- |
| `!important`      | 0                                                  |
| Fonts             | Clean                                              |
| Light mode tuning | Token-aware in structure, but visually dark-biased |

Confirmed drift:

- Comparison block uses stock red/green values instead of semantic tokens:
  - `rgba(239, 68, 68, 0.5)` + `#f87171`
  - `rgba(16, 185, 129, 0.5)` + `#34d399`
- Teal glow/border language is still heavily hardcoded.
- Uses a black shadow `rgba(0, 0, 0, 0.3)` where the broader system has theme shadows.
- `cta-button` and `contact-btn` reimplement gradient-button patterns.

Designer read:

- This page has the strongest "founder / manifesto" feel, so it should probably stay a little bespoke.
- But its bespoke treatment should come from **composition and copy rhythm**, not from every button and card owning a new glow recipe.

---

### 6. Landing-page duplication cluster

Files:

- `src/routes/pop-culture/+page.svelte` — 715 lines of CSS
- `src/routes/how-to-guides/+page.svelte` — 618 lines
- `src/routes/community/+page.svelte` — 609 lines
- `src/routes/personality-analysis/+page.svelte` — 917 lines

What is verified:

- **`pop-culture`, `how-to-guides`, and `community` are the clear copy-paste cluster.**
- They share the same card anatomy, white-on-image overlay approach, teal border/glow treatments, and almost the same responsive structure.
- `personality-analysis` shares the same visual family, but its card anatomy is different enough that it should be treated as a **sibling variant**, not proof that all four can be collapsed into one identical partial without design choices.

Repeated overlay patterns:

```scss
background: linear-gradient(
	to top,
	rgba(12, 10, 9, 0.97) 0%,
	rgba(12, 10, 9, 0.72) 45%,
	rgba(12, 10, 9, 0.2) 100%
);
```

and

```scss
background: linear-gradient(
	to top,
	rgba(10, 10, 15, 0.95) 0%,
	rgba(10, 10, 15, 0.6) 40%,
	rgba(10, 10, 15, 0.3) 100%
);
```

Extra notes:

- `pop-culture` also locally redefines `.btn-primary`.
- `how-to-guides` and `community` do not redefine the CTA button pattern because they do not include the same CTA block.
- `personality-analysis` currently has **0** `!important` declarations, not 1.

Designer read:

- The duplication problem is real, but the solution should be **a small family of shared landing-page variants**, not one hyper-generic component that flattens every section into the same page.

---

## Cross-cutting patterns

### Hardcoded values replacing existing tokens

Across the nine audited files:

| Hardcoded value                               |                 Count | Better source                                                           |
| --------------------------------------------- | --------------------: | ----------------------------------------------------------------------- |
| `rgba(45, 212, 191, …)`                       |                   100 | `var(--primary)` with `color-mix` or existing glow tokens               |
| `rgba(251, 113, 133, …)`                      |                     7 | `var(--secondary)` with `color-mix`                                     |
| `rgba(167, 139, 250, …)`                      |                     1 | `var(--accent)` with `color-mix`                                        |
| `rgba(12, 10, 9, …)`                          |                    22 | derived dark overlay token                                              |
| `rgba(10, 10, 15, …)`                         |                    27 | derived dark overlay token                                              |
| `#fff`                                        |                    39 | `var(--text-on-dark)`                                                   |
| `rgba(255, 255, 255, 0.8)`                    |                    12 | tokenized overlay-secondary text                                        |
| `rgba(245, 158, 11, …)`                       |                     4 | either `brand.gold` promoted to CSS tokens, or secondary/accent retheme |
| `rgba(96, 165, 250, 0.5)`                     |                     1 | likely `var(--secondary)`-aligned glow instead                          |
| `#ef4444` / `#fca5a5` / `#dc2626` / `#b91c1c` | small but high-impact | semantic error tokens                                                   |
| `#34d399` / `rgba(16, 185, 129, …)`           |  small but noticeable | semantic success tokens                                                 |

### Light mode risk is not evenly distributed

There are two different situations:

1. **Truly broken in light mode**
   - image cards that hardcode dark overlays and white text
   - especially `enneagram-corner`, `mental-health`, `pop-culture`, `how-to-guides`, `community`, and parts of `personality-analysis`

2. **Mostly serviceable, but stylistically unrefined in light mode**
   - pages that already use theme tokens for most surfaces, but still keep hardcoded glows, shadows, or functional colors
   - especially `homepage`, `about`, and `book-session`

This distinction matters because it changes the order of work.

### Shared API is being bypassed

- Global button classes exist, but `book-session`, `pop-culture`, `enneagram-corner`, and `mental-health` redefine `.btn-primary` locally.
- Global card primitives exist, but the audited route files mostly do not consume them directly.
- That means some drift is not a missing system problem. It is an **adoption problem**.

### Supporting docs are inconsistent

`docs/development/css-style-guide.md` still describes an older purple / white visual system and should not be used as the current source of truth for this cleanup. It should be updated or archived before a broader design-system pass.

---

## What should definitely change

These are low-debate fixes:

1. **Mental-health crisis banner** should use `var(--error)` / `var(--error-700)`.
2. **Homepage `.text-system` glow** should stop using sky blue against rose text.
3. **Image-overlay text** should move from `#fff` and `rgba(255,255,255,0.8)` to overlay text tokens.
4. **The two near-black overlay recipes** should be consolidated into one system.
5. **Book-session and about success/error states** should use semantic tokens instead of raw Tailwind literals.
6. **Pages that redefine `.btn-primary`** should either use the shared button or introduce a named variant instead of shadowing the global class.

---

## Design decisions you need to make

These are the choices that affect the look and feel, not just the codebase.

### 1. What happens to the warm gold accent?

**Option A: Remove it and fold the homepage coaching card into rose / purple**

Pros:

- tighter brand system
- fewer one-off accents
- easier dark/light consistency

Cons:

- the coaching block loses some warmth and premium contrast
- homepage becomes more uniformly "teal + rose"

**Option B: Keep gold, but formalize it as a first-class CSS token**

Pros:

- gives coaching/offer moments a richer, more premium accent
- uses a color Tailwind already acknowledges with `brand.gold`

Cons:

- expands the visual vocabulary
- requires rules about where gold is allowed so it does not start appearing everywhere

### 2. How should image overlays behave in light mode?

**Option A: Keep dark cinematic overlays even in light mode**

Pros:

- preserves drama and legibility on photography
- keeps the card family visually consistent across themes

Cons:

- can feel pasted-on and heavy in light mode
- makes light mode less airy than the token palette suggests

**Option B: Switch to lighter, warmer overlays in light mode**

Pros:

- feels more intentional and theme-aware
- makes light mode look designed rather than merely token-swapped

Cons:

- harder to keep text readable on busy images
- requires extra testing and likely per-component tuning

### 3. Should type-driven pages actually use the full type-color palette?

**Option A: Use `--type-1-color` through `--type-9-color` more aggressively**

Pros:

- stronger information scent
- the by-type sections instantly feel more specific and memorable

Cons:

- the site gets visually noisier
- nine colors can compete with the core teal/rose/accent brand

**Option B: Keep type pages mostly on the core brand palette and use type colors sparingly**

Pros:

- calmer, more editorial look
- less risk of rainbow UI

Cons:

- misses a system that already exists
- type-specific surfaces feel less differentiated

### 4. How much landing-page sameness is acceptable?

**Option A: Create one shared category-hub component for `pop-culture`, `how-to-guides`, and `community`, plus a sibling variant for `personality-analysis`**

Pros:

- best balance of consistency and personality
- less drift, without flattening every page

Cons:

- requires a small design-system effort up front

**Option B: Keep each page bespoke and just token-clean them**

Pros:

- lower immediate implementation cost
- preserves small editorial differences

Cons:

- drift will come back
- maintenance stays expensive

### 5. Do you want a single button language or page-specific buttons?

**Option A: Standardize around the shared `.btn-*` set**

Pros:

- coherence
- lower maintenance
- fewer tiny hover/glow differences

Cons:

- some conversion pages may lose urgency or character

**Option B: Keep page-specific buttons, but rename them as explicit variants**

Pros:

- preserves intentional hierarchy differences
- makes bespoke moments feel chosen, not accidental

Cons:

- more variant management
- requires better documentation discipline

---

## Recommended sequence

If the goal is to improve the design without overcorrecting, the cleanest order is:

1. **Fix semantic mistakes first**
   - crisis banner
   - status colors
   - mismatched homepage glow

2. **Stabilize the overlay system**
   - one overlay recipe family
   - overlay text tokens
   - light-mode strategy

3. **Consolidate the duplicated hubs**
   - shared category-hub base for `pop-culture`, `how-to-guides`, and `community`
   - decide whether `personality-analysis` becomes a variant or stays separate

4. **Then decide how bespoke the homepage/about/coaching surfaces should remain**
   - these are the pages where brand expression matters most
   - they should be curated, not merely normalized
