<!-- tinytribe-design-system.md -->

# Tiny Tribe Adventures — Design System

> A living document. Source of truth for brand, design tokens, and component conventions.
> Status: **In progress.** We are building this from scratch as of 2026-05-01.

---

## 0. Why this document exists

We have a working app, a real (if loose) color palette, and a strong product idea. We do **not** have:

- A brand one-pager (mission, audience, voice, mood)
- A typography system (no font loaded, no scale)
- Spacing / radius / shadow / motion tokens
- Documented rules for when to use what
- A photography or illustration direction
- Consistency between code and the palette we already declared

This document is the plan for fixing all of that, in order, and the place we'll record every decision so we stop drifting.

---

## 1. Audit — current state (2026-05-01)

### 1.1 Brand documents

- `static/brand/overview.md` — 28 lines of inspirational notes from a YouTube video. Not a brand doc.
- `README.md` — one cryptic line: _"Lego map theme — cool dad mode — black colors. Icon is a backpack exploding with activities."_ This does not match the live app.
- `src/routes/about/+page.svelte` — contains the closest thing to a real mission statement; should be promoted into the brand doc.
- Naming inconsistency: code says **Tiny Tribe Adventures**, repo and asset names say **myth-map / mythmap**.

### 1.2 Colors

- Defined in `tailwind.config.ts` with full 50–900 ramps:
  - `primary` Forest Green `#014421`
  - `secondary` Sandstone `#D2B48C`
  - `accent` Sky Blue `#87CEEB`
  - `tertiary` Rustic Orange `#CD5700`
  - `neutral` Slate Gray `#708090`
- Restated in `CLAUDE.md` and (partially) in `src/app.css` as CSS custom properties.
- **Drift in code:** raw `gray-*`, `blue-*`, `green-*` Tailwind classes are used freely (see `src/routes/+page.svelte`). Tertiary orange is essentially unused. Sandstone body background is overridden on the home page.
- **Missing:** semantic roles (success/warning/danger/info), documented contrast pairs, dark-mode palette (config has `darkMode: 'selector'` but no dark tokens).

### 1.3 Typography

- No web font loaded in `src/app.html`.
- No type scale documented. Heading sizes picked per page (`text-3xl … md:text-5xl` on `/`, `text-4xl md:text-5xl` on `/about`).
- `app.css .preview` block defines markdown-prose sizing, which is the only documented heading rhythm.

### 1.4 Spacing, radius, shadow, motion

- **Spacing** — Tailwind defaults only. No documented scale, no rules.
- **Radius** — Tailwind defaults. Cards use `rounded-lg`, pills use `rounded-full`, no token-level decision.
- **Shadow** — Tailwind defaults. `shadow-sm` / `shadow-lg` used ad-hoc. No tinted brand shadow.
- **Motion** — Some helper CSS (`transition-smooth`, `hover-lift`) referenced in components but not defined in `app.css`. `injectAnimationCSS` exists in `src/lib/utils/pageTransitions` but is not surfaced in tokens.

### 1.5 Components

- Heavy reliance on Flowbite Svelte (Navbar, Card, Button, Tabs). Functional but generic.
- Custom components live in `src/lib/components/{base,locations,shared,map,icons}`.
- No component documentation, no Storybook, no `/styleguide` route.

### 1.6 Imagery

- No photography. Cards display one of ~30 PNG icons in `static/map/` (with versioning leaks like `xxlibrary.png`, `xxxdonut-shack.png`).
- Logos: `myth-map.svg`, `myth-map-small.svg`, `myth-map.png`, plus two unattributed `Untitled design (*).svg` files (~1MB each).

---

## 2. Goals for the style kit

1. **Make the system visible.** A `/styleguide` route renders every token and base component. If it isn't on that page, it doesn't exist.
2. **Make drift impossible.** Lint-level pressure (or at least documented bans) on raw `gray-*` / `blue-*` Tailwind classes. Every value comes from a token.
3. **Make it feel like _one_ product.** Today the home page, the cards, and the about page each feel like they came from a different designer.
4. **Keep it small.** No 60-color palettes, no 12-step shadow scales. The smallest set of tokens that can express the product.

---

## 3. Build order

We will build top-down — decisions higher in the list constrain decisions lower in the list.

| #   | Section                 | Why this order                                             |
| --- | ----------------------- | ---------------------------------------------------------- |
| 1   | **Brand foundations**   | Voice + mood drive every other choice                      |
| 2   | **Color**               | Already mostly defined; lock semantics + contrast          |
| 3   | **Typography**          | Single biggest visual lever; sets the "feel"               |
| 4   | **Spacing scale**       | Unblocks consistent layout                                 |
| 5   | **Radius scale**        | One of the strongest "personality" signals                 |
| 6   | **Shadow system**       | Depends on color (tint) and radius                         |
| 7   | **Motion language**     | Glue — applies across everything above                     |
| 8   | **Token wiring**        | Translate decisions into `tailwind.config.ts` + CSS vars   |
| 9   | **`/styleguide` route** | Make the whole system visible & self-documenting           |
| 10  | **Component pass**      | Refactor `LocationCard`, `NavBar`, etc. against new tokens |

Each section below has the same shape:

- **Decisions to make** (questions for us to answer together)
- **Recommended starting point** (my opinion, you can override)
- **Final values** (filled in once we agree)

---

## 4. Brand foundations ✅ LOCKED 2026-05-01

### Name

**Tiny Tribe Adventures.** "Myth Map" / "mythmap" is an internal nickname only and should be removed from anything user-facing. Asset filenames (`myth-map.svg`, `mythmap.png`, etc.) get renamed in a follow-up cleanup pass.

### One-line promise

> **Family-tested places for when you need ideas.**

### Mission (longer form, for /about and meta)

A curated list of family-friendly locations for parents who need ideas. Built parent-to-parent so families can spend less time scrolling and more time exploring.

### Primary audience

Parents of kids age **0–9** in the **DMV** (DC / Maryland / Virginia / Delaware), making a weekend or Saturday-morning plan, **mostly on a phone**. Mobile-first is non-negotiable.

### Voice

Four words, in order of weight:

1. **Parent-to-parent** — the relationship. We're another parent who already figured this out, not a brand selling to you.
2. **Simple** — clarity over cleverness. Plain language.
3. **Low-key enthusiastic** — genuinely excited, never over-caffeinated. "This place is great" beats "AMAZING family fun!!!"
4. **Slightly mischievous** — a wink, not a wisecrack. We don't take ourselves too seriously.

Underneath all four: **generous and optimistic.** We default to assuming the reader is competent and the world is interesting.

### What we are NOT

- ❌ A parenting blog (we don't tell people how to parent)
- ❌ A deal site (we never lead with discounts)
- ❌ Yelp (curated, not user-review-driven)
- ❌ A travel app (we're for next Saturday, not next vacation)
- ❌ For people without kids (specificity is a feature)

### Visual mood — "Field manual for family adventures"

The aesthetic is **rugged, utilitarian, topographic-map inspired.** Think a tactical field guide that a parent pulls out in the wild — not a polished marketing site they read on a couch.

**Mood references (the ones we actually want to channel):**

- **Topo Designs** ([topodesigns.com](https://topodesigns.com)) — modern outdoor brand nailing this aesthetic
- **Field Notes** ([fieldnotesbrand.com](https://fieldnotesbrand.com)) — small, crafted, utilitarian
- **100 Deadly Skills** (Clint Emerson) — kraft cardstock cover, chunky slab title, line-art illustrations
- **Gaia GPS** ([gaiagps.com](https://gaiagps.com)) — actual topographic map app, our closest functional analog
- **Tom Sachs** workshop aesthetic — handmade, hand-stenciled, "made by humans"
- **Real military topographic maps** in multicam binders (DJ's reference photo)

**What we are visually NOT:**

- Polished SaaS (Linear, Stripe, Vercel — too clean, too tech)
- Editorial magazine (NYT Cooking, Atlas Obscura — too precious)
- Lifestyle parent brand (saccharine, Disney-fied, photo-of-happy-family-on-beach)
- Yelp/Google Maps (purely functional, no soul)

### Visual vocabulary (the system's "ingredients")

These are concrete elements we'll use repeatedly throughout the UI:

- **Topographic contour lines** — as section dividers, card borders, background patterns
- **Coordinate labels** — `38.9072°N, 77.0369°W` style data on location cards
- **Scale bars / distance markers** — for showing "X miles away" with field-map styling
- **Kraft / cardstock paper texture** — subtle grain in backgrounds and cards
- **Line-art illustrations** — black ink on tan, replacing the current PNG icon dump
- **Stamped / printed-on-cardstock feel** — for callouts, tags, status badges
- **Survival orange (`tertiary-500` `#CD5700`)** — used as a route marker / "go here" signal, not just a generic accent

### How the existing color palette already fits

The palette declared in `tailwind.config.ts` is _already_ a topographic map palette — we just haven't been using it that way:

| Color                   | Topo map role                                                                                      |
| ----------------------- | -------------------------------------------------------------------------------------------------- |
| Forest Green `#014421`  | Forest cover                                                                                       |
| Sandstone `#D2B48C`     | Kraft cardstock / open terrain                                                                     |
| Sky Blue `#87CEEB`      | Water features                                                                                     |
| Rustic Orange `#CD5700` | Route marker, survival/safety signal — **the color we've been ignoring is the most important one** |
| Slate Gray `#708090`    | Ink, contour lines, body text                                                                      |

No palette rework needed. We need to **commit** to it and stop using raw `gray-*` / `blue-*` / `green-*` Tailwind classes.

---

## 5. Color system ✅ LOCKED 2026-05-01

### Brand palette (unchanged from existing `tailwind.config.ts`)

| Token           | Hex                     | Topo-map role                                                |
| --------------- | ----------------------- | ------------------------------------------------------------ |
| `primary-500`   | `#014421` Forest Green  | Forest cover, brand, headings, links                         |
| `secondary-500` | `#D2B48C` Sandstone     | Kraft cardstock, soft surfaces                               |
| `accent-500`    | `#87CEEB` Sky Blue      | Water features, highlights                                   |
| `tertiary-500`  | `#CD5700` Rustic Orange | **Route markers / "go" signals** (the most under-used color) |
| `neutral-500`   | `#708090` Slate Gray    | Ink, contour lines, body text                                |

All five families keep their full 50→900 ramps. Dark-mode tokens reference these same ramps.

### Semantic palette (Option A — reuse brand + add one)

| Role      | Light mode token   | Hex       | Use                            |
| --------- | ------------------ | --------- | ------------------------------ |
| `success` | `primary-500`      | `#014421` | Success messages, valid states |
| `warning` | `tertiary-400`     | `#E08F54` | Caution, "heads up" alerts     |
| `danger`  | `danger-500` (new) | `#B0413E` | Errors, destructive actions    |
| `info`    | `accent-600`       | `#7AB9D4` | Informational notes            |

**New `danger` ramp** (rust-red, sits in the same earthy family as the rest of the palette — not fire-engine red):

| 50        | 100       | 200       | 300       | 400       | 500       | 600       | 700       | 800       | 900       |
| --------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- |
| `#FAEEED` | `#F2D2D0` | `#E5A5A2` | `#D77874` | `#C45C58` | `#B0413E` | `#9F3A37` | `#8A322F` | `#762A28` | `#612220` |

### Surface roles — Light mode ("Kraft cardstock")

| Role               | Value                     | Use                                               |
| ------------------ | ------------------------- | ------------------------------------------------- |
| `bg-page`          | `secondary-50` `#FCF9F5`  | Page background — feels like kraft paper          |
| `bg-surface`       | `#FFFFFF`                 | Cards, inputs (white index cards on kraft)        |
| `bg-elevated`      | `#FFFFFF` + `shadow-md`   | Modals, popovers                                  |
| `bg-sunken`        | `secondary-100` `#F7F0E6` | Recessed areas (e.g. code blocks, pressed states) |
| `border-subtle`    | `secondary-200` `#EEE0CC` | Default borders, dividers                         |
| `border-strong`    | `secondary-300` `#E5D0B3` | Emphasized borders, active inputs                 |
| `text-default`     | `neutral-800` `#4E5964`   | Body text, slate ink                              |
| `text-muted`       | `neutral-600` `#657382`   | Secondary text                                    |
| `text-subtle`      | `neutral-500` `#708090`   | Tertiary, captions                                |
| `text-on-primary`  | `#FFFFFF`                 | Text on forest green                              |
| `text-on-tertiary` | `#FFFFFF`                 | Text on rustic orange                             |

### Surface roles — Dark mode ("Dusk topo map")

Maintains the kraft/cardstock feel even in dark mode — pages feel like topo paper at twilight, not generic SaaS dark mode.

| Role                      | Value                     | Notes                                        |
| ------------------------- | ------------------------- | -------------------------------------------- |
| `bg-page`                 | `#1A1410`                 | Very dark warm brown (kraft paper at dusk)   |
| `bg-surface`              | `#2A211B`                 | Lifted brown for cards                       |
| `bg-elevated`             | `#352A22`                 | Modals, popovers                             |
| `bg-sunken`               | `#13100D`                 | Recessed                                     |
| `border-subtle`           | `#3D2F26`                 | Warm dark border                             |
| `border-strong`           | `#5A4636`                 | Emphasized borders                           |
| `text-default`            | `secondary-200` `#EEE0CC` | Kraft tone now reads as text (full circle)   |
| `text-muted`              | `secondary-400` `#DCC099` |                                              |
| `text-subtle`             | `secondary-600` `#BDA27E` |                                              |
| `primary` (links/buttons) | `primary-300` `#74AA85`   | Lightened forest green for AA contrast       |
| `accent`                  | `accent-500` `#87CEEB`    | Sky blue holds up on dark                    |
| `tertiary`                | `tertiary-400` `#E08F54`  | Lighter orange — route markers pop even more |
| `success`                 | `primary-300` `#74AA85`   |                                              |
| `warning`                 | `tertiary-400` `#E08F54`  |                                              |
| `danger`                  | `danger-400` `#C45C58`    | Lightened rust-red                           |
| `info`                    | `accent-400` `#8FCEEC`    | Lightened sky blue                           |

### Dark mode strategy — Tier 3 (sunset-aware)

**Theme states (3):** `light` · `dark` · `auto`

**Resolution order at runtime:**

1. Explicit user override (stored in `localStorage` under `tta-theme`) — `light` or `dark`
2. If theme = `auto`:
   - If user has granted geolocation: compute local sunset/sunrise from `currentLocation` store, switch based on actual sunset
   - Else fall back to `prefers-color-scheme` (OS preference)
3. Default = `auto`

**UI:**

- Sun / moon / "auto" cycle button in `NavBar` (3-state toggle)
- Tooltip on hover explains what "auto" means ("Switches at sunset based on your location")
- Theme transition is instant (no fade — flicker risk on slow devices)

**Tailwind config:** `darkMode: 'class'` (we control the toggle via JS, not media query alone). The `.dark` class is added to `<html>`.

**Implementation modules to build:**

- `src/lib/stores/themeStore.ts` — writable store with `light` / `dark` / `auto`, `localStorage` persistence, exports a derived `effectiveTheme` store
- `src/lib/utils/sunCalc.ts` — computes sunset/sunrise from lat/lng + date (use a tiny dep like `suncalc` or vendor a small implementation)
- `NavBar.svelte` — adds the 3-state toggle
- `app.html` — inline blocking script that reads `localStorage` + applies `.dark` class **before** first paint (avoids FOUC)

### Code rules (enforced by review, not lint yet)

- ❌ No raw `gray-*`, `blue-*`, `green-*`, `red-*`, `slate-*`, `zinc-*` Tailwind classes in `src/`.
- ✅ Use semantic tokens (`bg-page`, `text-muted`, etc.) for everything that isn't decoratively brand-colored.
- ✅ Use brand tokens (`bg-primary-500`, `text-tertiary-600`) only for intentional brand expression.
- Every new color use should be answerable: _what role does this play in the system?_

---

## 6. Typography

### Decisions to make

- [ ] **Heading typeface:** Display character vs. clean sans? Self-hosted vs. Google Fonts?
- [ ] **Body typeface:** Same as heading or paired?
- [ ] **Type scale base:** 16px (default) or 17px (slightly larger for readability)?
- [ ] **Scale ratio:** 1.125 (subtle), 1.2 (balanced), 1.25 (major third — strong)?
- [ ] **Weights to ship:** 400, 600, 700? (Each weight = file size)
- [ ] **Line-height rules:** tight headings (1.1), comfortable body (1.6)?

## 6. Typography ✅ LOCKED 2026-05-01

### Type system — "Slab Field Guide"

A 3-typeface system, all variable fonts, all self-hosted via `@fontsource-variable`.

| Role                   | Typeface                    | Weights used  | Use                                                                  |
| ---------------------- | --------------------------- | ------------- | -------------------------------------------------------------------- |
| **Display / headings** | **Bitter Variable**         | 700, 800      | h1–h4, hero, button labels at large sizes                            |
| **Body / UI**          | **Inter Variable**          | 400, 500, 600 | Body, UI, buttons, forms                                             |
| **Data / labels**      | **JetBrains Mono Variable** | 400, 500      | Coordinates, distances, data labels, "0.4 mi NW" — anything map-like |

### Hosting & loading

- **Self-hosted** via npm packages — no Google Fonts CDN, no third-party requests
- **Variable fonts** — one file per family covers every weight (3 files total, ~80–120KB compressed)
- `font-display: swap` — text renders in fallback immediately, web font swaps in when ready

```bash
pnpm add @fontsource-variable/bitter @fontsource-variable/inter @fontsource-variable/jetbrains-mono
```

In `src/app.css` (top of file):

```css
@import '@fontsource-variable/bitter';
@import '@fontsource-variable/inter';
@import '@fontsource-variable/jetbrains-mono';
```

### Fallback stacks

Chosen so the fallback renders close to the web font in width and x-height — minimizes layout shift (CLS) during the swap.

```css
--font-display: 'Bitter Variable', Georgia, 'Times New Roman', Times, serif;
--font-sans: 'Inter Variable', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
--font-mono:
	'JetBrains Mono Variable', ui-monospace, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
```

### Type scale — Field Manual (tighter, denser)

Pixel sizes, line-heights, and default weights. Use these tokens in code; don't pick sizes ad-hoc.

| Token       | Size | Line-height | Default weight | Family         | Use                                   |
| ----------- | ---- | ----------- | -------------- | -------------- | ------------------------------------- |
| `text-xs`   | 12px | 1.4         | 500            | mono _or_ sans | Captions, coordinates, labels, badges |
| `text-sm`   | 14px | 1.5         | 400            | sans           | Secondary UI, metadata                |
| `text-base` | 16px | 1.6         | 400            | sans           | Body — default everywhere             |
| `text-lg`   | 18px | 1.5         | 500            | sans           | Lead paragraphs, button labels        |
| `text-xl`   | 22px | 1.3         | 700            | display        | h4                                    |
| `text-2xl`  | 28px | 1.2         | 700            | display        | h3                                    |
| `text-3xl`  | 36px | 1.15        | 700            | display        | h2                                    |
| `text-4xl`  | 48px | 1.05        | 800            | display        | h1                                    |
| `text-5xl`  | 64px | 1.0         | 800            | display        | Hero / display only                   |

**Headings** (`text-xl`+): always `font-display` (Bitter), at the default weight in the table above. Don't go heavier than `font-extrabold` (800).

**Body** (`text-base` and below): always `font-sans` (Inter). Default 400.

**Data / mono**: use `font-mono` for coordinates, distances, any UI that should "feel like a map label." Examples: `38.9072°N`, `0.4 mi NW`, `4 yr+`, opening hours.

### Letter-spacing

- Headings (`text-xl`+): `tracking-tight` (`-0.01em`) — Bitter is chunky, slight tightening helps
- Uppercase labels & badges: `tracking-wide` (`0.04em`)
- Body: default (0)

### Color rules for type

- `h1`: `text-primary-700` (forest green) — brand moment
- `h2`–`h4`: `text-default` (`neutral-800` light / `secondary-200` dark)
- Body: `text-default`
- Captions / muted: `text-muted`
- Links in body: `text-accent-700` (light) / `text-accent-400` (dark), underlined on hover

### Italic

Ship **Bitter Italic 700** as one extra file (~10KB) for headline emphasis. Body italic falls back to system italic (Inter doesn't ship italic in our build — we don't need it for UI).

> Earlier draft of the modular 1.25 scale removed — superseded by the field-manual scale above.

---

## 7. Spacing scale ✅ LOCKED 2026-05-01

**Base unit: 4px.** Tailwind's default grid, restricted to a 10-step subset.

| Token       | Pixels | Use                        |
| ----------- | ------ | -------------------------- |
| `space-0.5` | 2      | Hairlines                  |
| `space-1`   | 4      | Icon padding, very tight   |
| `space-2`   | 8      | Tight gaps                 |
| `space-3`   | 12     | Default small gap          |
| `space-4`   | 16     | Default gap, card padding  |
| `space-6`   | 24     | Section gaps inside a card |
| `space-8`   | 32     | Section gaps on a page     |
| `space-12`  | 48     | Major section breaks       |
| `space-16`  | 64     | Hero padding               |
| `space-24`  | 96     | Page-level vertical rhythm |

**Allowed values only.** No `p-5`, `gap-7`, `m-9`, `pt-11`, `[20px]` etc. anywhere in `src/`.

### Field-manual bias

When in doubt, **step down, not up.** Field guides are dense — lots of information per page, not a lot of hero whitespace. Default to the next smaller step before reaching for the next bigger one.

### Enforcement

**Soft rule** — documented here, enforced in code review. No ESLint rule yet (revisit if drift becomes a problem).

---

## 8. Radius scale ✅ LOCKED 2026-05-01

**Philosophy: stamped & sharp, not pillowy.** Minimal radius throughout. Field manuals don't have rounded corners — neither do we.

| Token         | Pixels | Use                                             |
| ------------- | ------ | ----------------------------------------------- |
| `radius-none` | 0      | Edge-to-edge images, dividers, map elements     |
| `radius-sm`   | 2      | Inputs, buttons, tags — **default for most UI** |
| `radius-md`   | 4      | Cards, modals, larger surfaces                  |
| `radius-lg`   | 8      | Hero blocks, big feature cards (rare)           |
| `radius-full` | 9999   | **Avatars only** — not pills/tags               |

### Tags = stamped rectangles, not pills

Tags use `radius-sm` (2px), not `rounded-full`. Reads like a stamped field-guide label instead of a SaaS candy pill. This is the single strongest visual signal of brand commitment in the system.

**Refactor target:** `LocationCard.svelte` currently uses `rounded-full` on the tag overlay and the tag list. Change to `rounded-sm`.

### Defaults to override across the codebase

- `rounded-lg` (Tailwind default 8px) → `radius-md` (4px) for cards
- `rounded-full` on tags/badges → `radius-sm` (2px)
- Flowbite default button radius → `radius-sm` (need to override via Flowbite class props)

### Tradeoff acknowledged

This is a strong opinion. The app will look distinctly different from default Tailwind/Flowbite. That's the point — no one else looks like this, which is exactly the brand goal.

---

## 9. Shadow system ✅ LOCKED 2026-05-01

**Philosophy: shadows mostly off. Borders do the work.**

Static UI uses a 1px border (`border-subtle`) to define edges, not depth. Shadows are reserved for **true elevation moments** — something literally floating above other content, or a hover state communicating interactivity. This inverts the typical SaaS pattern (everything shadowed, nothing bordered).

### Scale — warm-tinted (forest green at low opacity)

| Token         | Value                            | Use                                                                                       |
| ------------- | -------------------------------- | ----------------------------------------------------------------------------------------- |
| `shadow-none` | `none`                           | **Default for all static surfaces** (cards, inputs, sections) — pair with `border-subtle` |
| `shadow-sm`   | `0 1px 2px rgba(1,68,33,0.04)`   | Tiny lift on focused inputs only                                                          |
| `shadow-md`   | `0 4px 12px rgba(1,68,33,0.08)`  | Hover state on interactive cards                                                          |
| `shadow-lg`   | `0 12px 28px rgba(1,68,33,0.10)` | Popovers, dropdowns                                                                       |
| `shadow-xl`   | `0 24px 48px rgba(1,68,33,0.14)` | Modals, sheets                                                                            |

The warm green tint differentiates from generic gray Material shadows.

### The big rule

A static card gets `border border-secondary-200`, not `shadow-md`. Elevation only changes on:

- Hover (interactive cards → `shadow-md` + stronger border)
- Floating UI (modals, popovers, dropdowns)
- Focus rings (inputs)

### Hover spec for interactive cards

Default state:

```
border border-secondary-200 shadow-none
```

Hover state:

```
border-secondary-300 shadow-md
```

(No `translateY` lift — keeps the field-manual stillness. Border + small shadow change is enough signal.)

### Dark mode

Shadows are nearly invisible on dark backgrounds. Use **surface lightening** as the primary elevation signal in dark mode — `bg-surface` `#2A211B` → `bg-elevated` `#352A22`. Shadows still defined but used minimally, at half the opacity above.

### Refactor target

`LocationCard.svelte` currently uses `hover:shadow-lg` as the default lift. Update to the spec above.

---

## 10. Motion language ✅ LOCKED 2026-05-01

**Philosophy: quiet, fast, functional.** Motion signals "the system noticed you" and gets out of the way. No bouncing, no springs, no expressive page transitions, no parallax.

### Duration tokens

| Token            | Value | Use                                       |
| ---------------- | ----- | ----------------------------------------- |
| `motion-instant` | 0ms   | Theme switch, focus rings — no transition |
| `motion-fast`    | 100ms | Hovers, color shifts — the 90% case       |
| `motion-base`    | 180ms | Most state changes, dropdowns, accordions |
| `motion-slow`    | 280ms | Modals, sheets, drawers                   |

### Easing tokens

| Token              | Value                            | Use                             |
| ------------------ | -------------------------------- | ------------------------------- |
| `ease-out-soft`    | `cubic-bezier(0.22, 1, 0.36, 1)` | **Default** — most UI           |
| `ease-in-out-soft` | `cubic-bezier(0.4, 0, 0.2, 1)`   | Symmetric (modals open + close) |

**No spring easing.** Springs are playful — wrong for the brand.

### What we DO animate

- ✅ Hover color/border shifts (`motion-fast` + `ease-out-soft`)
- ✅ Hover shadow appearance (`motion-fast`)
- ✅ Modal/sheet open + close (`motion-slow` + `ease-in-out-soft`)
- ✅ Dropdown/popover open (`motion-base`)
- ✅ Focus ring appearance (`motion-fast`)
- ✅ Skeleton loaders (subtle pulse, existing)

### What we DON'T animate

- ❌ Page transitions — instant route changes
- ❌ Scroll-triggered reveals
- ❌ Card entrance animations on list render
- ❌ Theme switch (instant — flicker risk if animated)
- ❌ Parallax of any kind
- ❌ "Delight" micro-interactions (bounces, confetti, etc.)
- ❌ Pulse on survival-orange "go" markers — color does the work, not motion

### Reduced motion

Honor `prefers-reduced-motion: reduce` globally in `app.css`:

```css
@media (prefers-reduced-motion: reduce) {
	*,
	*::before,
	*::after {
		animation-duration: 0.01ms !important;
		transition-duration: 0.01ms !important;
	}
}
```

### Refactor targets

- `src/lib/utils/pageTransitions.ts` — `injectAnimationCSS` becomes a no-op (or deleted)
- `src/routes/+page.svelte` — remove `in:fade|local={{ duration: 200 }}` from `LocationCard` rendering
- `LocationCard.svelte` — `transition-smooth` and `hover-lift` helper classes need real definitions or token-based replacements

---

## 11. Token wiring

Once all sections above are agreed:

1. Update `tailwind.config.ts`:
   - Extend `colors` with surface + semantic tokens
   - Replace default `fontSize` with our scale (size + line-height pairs)
   - Override `borderRadius` with our radius tokens
   - Override `boxShadow` with our tinted shadows
   - Add `transitionDuration` and `transitionTimingFunction` tokens
   - Add `fontFamily` (`sans`, `display`)
2. Update `src/app.css`:
   - Add `@font-face` or `<link>` to `src/app.html` for chosen fonts
   - Expose all tokens as CSS custom properties under `:root`
   - Set `body` to use `bg-page` + `text-default`
3. Add a `.eslintrc` rule (or just a CONVENTIONS section) banning raw `gray-*` / `blue-*` / `green-*` / `red-*` classes in `src/`.

---

## 12. The `/styleguide` route

A single SvelteKit route at `src/routes/styleguide/+page.svelte` that renders:

1. Brand block — logo, mission, voice
2. Color palette — every shade with its hex + token name
3. Semantic colors — success/warning/danger/info, surfaces
4. Typography — every size, every weight, sample paragraph
5. Spacing scale — visual ruler
6. Radius scale — boxes at every radius
7. Shadow scale — boxes at every elevation
8. Motion — interactive demos of each duration/easing
9. Components — Button, Card, Input, Tag, Modal, etc. — every variant

This page is the **truth.** If we change a token, this page changes. If a component isn't on it, it isn't part of the system.

---

## 13. Open questions parking lot

- ✅ **Iconography:** Keep existing PNGs in `static/map/` for now. Curated SVG illustration set is a future investment, not v1.
- ⏸️ **Photography:** Not in scope right now. Decision deferred.
- ✅ **Dark mode:** Decided — Tier 3 sunset-aware (see Section 5). Removed from open questions.
- ⏸️ **Logo system:** TBD. Current `myth-map.svg` / `myth-map-small.svg` work for v1; lockup variants can come later.
- ✅ **Error & empty states:** Per design judgment — lean into the field-manual aesthetic. Error states use `danger-500` with a topographic / map-style line illustration where appropriate. Empty states use a quiet kraft-toned card with a coordinate-style label (e.g., "No locations found in this grid square") — keeps the brand voice even at moments of nothing.

---

## 14. Change log

| Date       | Change                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-05-01 | Document created. Audit complete. No tokens finalized yet.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 2026-05-01 | Section 4 (Brand foundations) locked. Aesthetic = "Field manual for family adventures" — topographic map / Field Notes / 100 Deadly Skills inspired. Existing palette confirmed as already-correct for this direction. Typography recommendation in Section 6 pivoted to slab serif + utilitarian sans + mono.                                                                                                                                                                                                                                                                  |
| 2026-05-01 | Section 5 (Color system) locked. Semantic palette = reuse brand + new rust-red `danger` ramp. Surfaces = "Kraft cardstock" (light) and "Dusk topo map" (dark). Dark mode = Tier 3 (sunset-aware auto + manual nav toggle), `darkMode: 'class'`.                                                                                                                                                                                                                                                                                                                                 |
| 2026-05-01 | Section 6 (Typography) locked. "Slab Field Guide" — Bitter Variable (display) + Inter Variable (body) + JetBrains Mono Variable (data). Self-hosted via @fontsource-variable. Field-manual type scale (12→64px, tighter line-heights, fewer sizes).                                                                                                                                                                                                                                                                                                                             |
| 2026-05-01 | Section 7 (Spacing) locked. 4px base, 10-step restricted scale, soft enforcement, field-manual density bias.                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| 2026-05-01 | Section 8 (Radius) locked. Stamped & sharp — 0/2/4/8/full px scale. Tags become stamped rectangles, not pills.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 2026-05-01 | Section 9 (Shadow) locked. Shadows mostly off — borders do the work. Warm green-tinted shadow scale reserved for hover/floating UI only. Dark mode uses surface lightening instead of shadows.                                                                                                                                                                                                                                                                                                                                                                                  |
| 2026-05-01 | Section 10 (Motion) locked. Quiet, fast, functional — 0/100/180/280ms duration scale, no spring easing, no page transitions, no orange-marker pulse. All token-level decisions complete.                                                                                                                                                                                                                                                                                                                                                                                        |
| 2026-05-01 | **Implementation complete.** Tokens wired into `tailwind.config.ts` + `src/app.css`. Self-hosted variable fonts installed via `@fontsource-variable/{bitter,inter,jetbrains-mono}`. Sunset-aware theme system shipped (`themeStore` + `sunCalc` + 3-state nav toggle + FOUC script). `/styleguide` route built. Refactored to new tokens: NavBar, home page, LocationCard, LocationCardSmall, LocationFilters, GeoFilters, SearchBar, SkeletonCard, Pagination, ErrorState. Production build passes. Individual location pages intentionally untouched (other agent in flight). |
