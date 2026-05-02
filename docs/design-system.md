<!-- docs/design-system.md -->

# 9takes — Design System

> **A living document.** Source of truth for brand, design tokens, and component conventions.
> Status: **In progress.** Started 2026-05-01.
>
> Sister docs (intentionally not source-of-truth — they're inputs to this doc):
>
> - `docs/design/2026-05-01-design-system-gap-analysis.md` — full audit & contradictions log
> - `docs/brand/brand-positioning.md` — brand strategy (voice, audience)
> - `docs/brand/brand-style-guide-v2.md` — voice & copy conventions
> - `design-walkthrough-template.md` — playbook this doc was built from
>
> Older brand/visual docs (BRAND-KIT.md, solo-leveling-\*, warm-tech-theme-plan.md) are **historical**. They contradict each other and the code. Treat them as archives, not specs.

---

## 0. Why this document exists

9takes has been pulled in three different visual directions over the last 12 months — Solo Leveling (gaming/dark void), Noticia Text (scholarly serif), and Warm Tech (psychologist's office). The code quietly drifted into a fourth state — **teal-primary warm-stone-neutral with Rajdhani+Space Grotesk type** — that nobody fully wrote down. Brand docs and shipped UI no longer match.

This doc collapses all of that into one place:

- **What's actually shipping today** (the audit / current values)
- **What's locked vs. open** (decisions vs. drift)
- **Where to go next** (recommendations + checkboxes for DJ to ratify)

Once everything below is `✅ LOCKED`, the next edit to brand should happen here first, then trickle to code.

---

## 1. Audit (2026-05-01) — current state

Detailed audit lives in `docs/design/2026-05-01-design-system-gap-analysis.md`. Summary table:

| Area                | What's in the code today                                                                                                                       | Lock status                          |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| Brand mood          | Drifted — code says "warm-tech teal," docs say three different things                                                                          | ❌ Contested                         |
| Brand voice         | Locked in `brand-positioning.md` + `brand-style-guide-v2.md`                                                                                   | ✅ Locked                            |
| Color palette       | Teal primary, rose secondary, purple accent, warm-stone neutrals (Tailwind + CSS vars match)                                                   | 🟡 De-facto                          |
| Surface tokens      | `--bg-base/-deep/-surface/-elevated/-highlight` exist for both modes                                                                           | 🟡 De-facto                          |
| Light mode          | Full `:root.light` overrides + `ThemeToggle.svelte` shipped (Tier 2)                                                                           | ✅ Shipped                           |
| Typography          | Rajdhani (display) + Space Grotesk (body) + JetBrains Mono (mono). BRAND-KIT.md still says Noticia Text. No documented type scale.             | ❌ Contested                         |
| Spacing             | Tailwind `xs/sm/md/lg/xl/2xl/3xl` tokens exist; arbitrary values still common                                                                  | 🟡 Partial                           |
| Radius              | `sm 4px / md 10px / xl 16px / full` — Kole's recipe, **lint-enforced** (`pnpm lint:radius`)                                                    | ✅ LOCKED 2026-04-27                 |
| Shadow              | Soft, neutral, Kole's recipe (`rgba(0,0,0, 0.15–0.25)`, 2× blur) in dark mode; softer in light mode. CSS-var driven.                           | ✅ LOCKED 2026-04-27                 |
| Motion              | `--transition-base`, `--transition-glow`, `--animation-speed`. No documented duration scale. No `prefers-reduced-motion` global rule.          | ❌ Open                              |
| Glows               | 6 glow tokens (`--glow-sm/-md/-lg/-secondary/-accent/-subtle` + Tailwind `glow-teal/-rose`). Used heavily on text, icons, buttons.             | ❌ Effect-addiction (per Kole audit) |
| Components          | `.btn-primary/.btn-secondary/.btn-outline/.btn-ghost` and `.card-base/-hover/-interactive` exist, but routes redefine locally. No shared atom. | ❌ Sprawl                            |
| Icons               | 27 hand-rolled SVGs in `src/lib/components/icons/`. Stroke widths vary (1.5/1.8/2/4). No library.                                              | ❌ Open                              |
| Imagery             | Logo (`aero.webp`), hero statues, philosopher photos, DJ portraits — solid asset library, well organized in `static/brand/`                    | ✅ Locked                            |
| `/styleguide` route | **Does not exist.** No visible source of truth for tokens.                                                                                     | ❌ Missing                           |

**Verdict:** Strong token foundation, partial component canonicalization, no styleguide page, brand mood undeclared. **Biggest gap: there is no single document that says "here is what 9takes looks like" that matches the code.** This doc fixes that.

---

## 2. Goals for the style kit

1. **Make the system visible** — ship a `/styleguide` route that renders every token + every base component.
2. **Make drift impossible** — token-only colors/radii/shadows; lint enforces (radius lint already exists).
3. **Make it feel like one product** — pick one brand mood and let every later decision flow from it.
4. **Keep it small** — smallest token set that expresses 9takes. Cut effect tokens, not add more.

---

## 3. Build order

Same order as the walkthrough template — brand mood **first**, because every later decision is anchored to it.

| #   | Section             | Status            | Notes                                                             |
| --- | ------------------- | ----------------- | ----------------------------------------------------------------- |
| 4   | Brand foundations   | ❌ Decisions open | Voice locked, mood contested                                      |
| 5   | Color               | 🟡 De-facto       | Code already converged on teal/rose/purple — needs ratification   |
| 6   | Typography          | ❌ Decisions open | Code says Rajdhani+Space Grotesk; brand-kit doc says Noticia Text |
| 7   | Spacing             | 🟡 De-facto       | Token set exists; subset commitment open                          |
| 8   | Radius              | ✅ Locked         | `sm/md/xl/full`, lint-enforced                                    |
| 9   | Shadow              | ✅ Locked         | Kole's recipe, theme-aware                                        |
| 10  | Motion              | ❌ Open           | No documented scale yet                                           |
| 11  | Token wiring        | 🟡 Partial        | CSS vars + Tailwind both exist; need single source of truth       |
| 12  | `/styleguide` route | ❌ Missing        | Build after sections 4–6 lock                                     |
| 13  | Component refactor  | 🟡 Partial        | Modal/radius/shadows done; Button/Icon atoms still missing        |

---

## 4. Brand foundations

Voice is **locked** in `docs/brand/brand-positioning.md` and `docs/brand/brand-style-guide-v2.md` — those are good and not contradicted by anything. Mood is **open**.

### Locked

| Field                | Value                                                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**             | **9takes** (canonical). All-lowercase wordmark, no space.                                                                                                     |
| **One-line promise** | **See the emotions behind every take.**                                                                                                                       |
| **Mission**          | Help people decode social dynamics, personality-max EQ, and turn conflict into understanding using the Enneagram.                                             |
| **Audience**         | Young men seeking social/dating advantage; tactical-psychology readers ("The Game" lineage); people stuck in workplace/relationship dynamics they can't read. |
| **Voice (4 traits)** | Tactically Direct · Socially Savvy · Respectfully Provocative · Pattern-Recognition Focused                                                                   |
| **What we are NOT**  | ❌ Academic/theoretical · ❌ New-Age mystical · ❌ Generic SaaS minimalist · ❌ Corporate · ❌ Preachy                                                        |

### Decisions to make

- [ ] **Visual mood — pick one of three** (this is the load-bearing call):
  - **Option A — "Warm Tech Spec"** _(my recommendation)_ — psychologist's leather-bound office meets a modern data dashboard. Warm stone neutrals, teal as primary illumination, rose for emotion accents, gold for premium moments. Light + dark co-equal. **Why:** matches voice ("understanding beats judgment"), matches the audience's preferences (tactical, grounded, not gamer-coded), and matches what's actually shipping in the code today. Closest references: Notion light mode, Headspace, Linear surface elevation, Stripe gradient accents.
  - **Option B — "Solo Leveling Awakening"** — gaming-coded dark void, purple shadow energy, blue system UI, glow effects, gamification metaphor (XP, ranks, shadow extraction). Dark-only. **Why pick this:** the metaphor is genuinely strong, and the audience overlaps with gaming/anime culture. Closest references: Solo Leveling UI, Persona series menus, Cyberpunk 2077 HUDs.
  - **Option C — "Field-Manual Psychology"** — almanac/textbook energy. Serif type (Noticia Text or similar), kraft/parchment neutrals, 1px borders not shadows, charts and diagrams over decoration. **Why pick this:** maps directly to "ancient wisdom 2,500 years old," reads as authoritative, hardest to confuse with any competitor. Closest references: NYT Cooking, Atlas Obscura editorial, Field Notes notebooks.

  My pick: **A.** Reasoning: the code already pays this cost; voice traits ("respectful," "pattern recognition," "results-driven") read warmer than Option B's combat metaphor; serious adults who want EQ tools (the actual audience, even if entry is gamer-coded) trust warm-clean over gaming-dark. Option B can survive as a **viral skin** (poster generator, social cards, certain landing pages) without owning the whole product.

- [ ] **Visual vocabulary** — concrete repeating elements. Recommendation if Option A locks: subtle warm grain/paper texture, 1px stone-color borders (not shadows for static UI), warm-tinted teal glow reserved for hero CTAs only, tabular data + chart blocks as first-class citizens, Greek-statue / philosopher imagery as decorative anchor.

### Final values

_(filled in once locked)_

---

## 5. Color

### Locked (de-facto, awaiting brand-mood ratification)

The Tailwind config and `src/scss/index.scss` already agree on this palette. Locking it formally just means saying "yes, this is the palette" and stripping the alternative-history docs (`BRAND-KIT.md`'s purple-primary, `solo-leveling-visual-guide-unified.md`'s shadow-monarch).

#### Brand palette

| Role           | Color      | Hex (500/600 anchor) | Tailwind ramp         | Use                                                               |
| -------------- | ---------- | -------------------- | --------------------- | ----------------------------------------------------------------- |
| **Primary**    | Teal       | `#14B8A6` (500)      | `primary-50→900`      | CTAs, key actions, active state, links, focus rings               |
| **Secondary**  | Rose       | `#F43F5E` (500)      | `secondary-50→900`    | Emotion accents, secondary CTAs, urgency moments                  |
| **Accent**     | Purple     | `#8B5CF6` (500)      | `accent-50→900`       | Insight/wisdom moments (legacy: was the brand color in BRAND-KIT) |
| **Brand gold** | Gold       | `#D4AF37`            | `brand.gold` (single) | Premium / coaching / paid tier moments                            |
| **Neutral**    | Warm stone | `#78716C` (500)      | `neutral-50→950`      | Backgrounds, borders, body text, surface elevation                |

Why this works for Option A: teal carries the "illumination / understanding" idea, rose carries "human emotion," purple was the historical brand color and survives as a complementary accent, gold marks the coaching premium tier. Warm stone neutrals warm the whole UI without going beige.

#### Surface tokens (theme-aware)

CSS variables defined in `src/scss/index.scss` for both `:root` (dark) and `:root.light`:

| Token              | Dark      | Light     | Use                           |
| ------------------ | --------- | --------- | ----------------------------- |
| `--bg-base`        | `#0c0a09` | `#fafaf9` | Page background               |
| `--bg-deep`        | `#1c1917` | `#f5f5f4` | Sidebars, secondary surfaces  |
| `--bg-surface`     | `#292524` | `#ffffff` | Cards, content containers     |
| `--bg-elevated`    | `#44403c` | `#e7e5e4` | Elevated, hover states        |
| `--bg-highlight`   | `#57534e` | `#d6d3d1` | Active, selected              |
| `--text-primary`   | `#fafaf9` | `#1c1917` | Headlines + body              |
| `--text-secondary` | `#a8a29e` | `#57534e` | Body secondary, descriptions  |
| `--text-tertiary`  | `#78716c` | `#78716c` | Captions, metadata            |
| `--text-muted`     | `#57534e` | `#a8a29e` | Disabled, placeholders        |
| `--border-color`   | `#44403c` | `#e7e5e4` | 1px hairlines (the workhorse) |

#### Semantic palette

| Role    | Token             | Hex (anchor) |
| ------- | ----------------- | ------------ |
| Success | `--success`       | `#10B981`    |
| Warning | `--warning`       | `#F59E0B`    |
| Error   | `--error`         | `#EF4444`    |
| Info    | aliased to accent | `#A78BFA`    |

#### Enneagram type colors (data-only, never UI chrome)

| Type | Name          | Hex       |
| ---- | ------------- | --------- |
| 1    | Perfectionist | `#6366F1` |
| 2    | Helper        | `#F472B6` |
| 3    | Achiever      | `#F59E0B` |
| 4    | Individualist | `#A855F7` |
| 5    | Investigator  | `#0EA5E9` |
| 6    | Loyalist      | `#22C55E` |
| 7    | Enthusiast    | `#FBBF24` |
| 8    | Challenger    | `#DC2626` |
| 9    | Peacemaker    | `#34D399` |

### Decisions to make

- [ ] **Ratify the de-facto palette as locked** (yes/no — rejecting it means picking a new one and rewriting the Tailwind config).
- [ ] **Cut the glow effect bloat.** Today there are 6 glow tokens + 2 Tailwind glow utilities. Recommendation: keep only `--glow-sm` and `--glow-md` (primary-tinted) for _interactive_ moments. Delete `--glow-lg`, `--glow-secondary`, `--glow-accent`, `--glow-subtle`, `glow-teal`, `glow-rose`. (See gap-analysis §2.)
- [ ] **Lock the rule:** _no raw `gray-*`, `slate-*`, `zinc-*`, `blue-*`, `green-*`, `red-*` Tailwind classes in `src/`._ Use semantic tokens or brand tokens only. Add an ESLint rule.

### Critical rule (proposed)

> **No raw Tailwind grayscale or color-name classes in `src/`.** Always `text-primary-*`, `bg-secondary-*`, `border-neutral-*`, or surface tokens (`bg-[var(--bg-surface)]`). Code review enforces; ESLint to follow.

---

## 6. Typography

### Decisions to make

- [ ] **Pick the type system.** Three options:
  - **Option A — Keep current (Rajdhani + Space Grotesk + JetBrains Mono).** What ships today. Rajdhani is angular/gaming-coded; Space Grotesk is modern-clean. **Pros:** zero migration. **Cons:** Rajdhani argues for Option B brand mood, doesn't match Warm Tech.
  - **Option B — Inter + Inter Display + JetBrains Mono.** Single-family, variable-weight, infinitely versatile. **Pros:** the safest, most legible, least opinionated; fits any of the three brand moods. **Cons:** says nothing about 9takes; competitors all use Inter.
  - **Option C — Fraunces (display) + Inter (body) + JetBrains Mono.** Editorial serif headline + clean sans body. **Pros:** matches "ancient wisdom modernized" voice; reads like a magazine. **Cons:** larger font payload; serif headlines can read precious.

  My pick: **C — Fraunces + Inter + JetBrains Mono** _if Option A brand mood (Warm Tech) locks_. The serif headline carries the "scholarly but not academic" voice; Inter does heavy-lifting on body without competing. If Option B brand mood (Solo Leveling) locks, keep current Rajdhani+Space Grotesk. If Option C brand mood (Field Manual) locks, Fraunces becomes mandatory.

- [ ] **Lock the type scale.** Currently undocumented and inconsistent (SCSS body styles set `h1: 2.5rem` desktop, Tailwind typography plugin sets `h1: 2.25rem`, mobile h1 is `1.75rem` — not modular).

  Recommended scale (modular ratio 1.250, hand-tuned at the top end):

  ```
  text-xs   12px / 1.4  / 400
  text-sm   14px / 1.45 / 400
  text-base 16px / 1.55 / 400
  text-lg   18px / 1.5  / 400
  text-xl   20px / 1.4  / 600
  text-2xl  24px / 1.3  / 600
  text-3xl  30px / 1.2  / 700  (h2)
  text-4xl  38px / 1.15 / 700  (h1 mobile)
  text-5xl  48px / 1.1  / 700  (h1 desktop)
  ```

- [ ] **Hosting decision.** Move all fonts to `@fontsource-variable/*` packages (self-hosted, GDPR-clean, perf wins). Today fonts are loaded via custom `@font-face` rules + the Noticia Text files in `static/fonts/` are still on disk but unreferenced.

### Color rules (proposed)

| Element   | Color                                                                 |
| --------- | --------------------------------------------------------------------- |
| `h1`      | `var(--primary)` — the brand moment, once per page                    |
| `h2`–`h4` | `var(--text-primary)`                                                 |
| Body      | `var(--text-primary)`                                                 |
| Caption   | `var(--text-secondary)`                                               |
| Links     | `var(--primary)` light / `var(--primary-light)` dark, hover underline |

---

## 7. Spacing scale

### Decisions to make

- [ ] **Commit to a 7-token subset.** Tailwind config already exposes `xs/sm/md/lg/xl/2xl/3xl` (4/8/12/16/24/32/48px). Stop using arbitrary `p-5`, `gap-7`, `[20px]`. Add an ESLint rule.

  Recommendation: keep the existing 7. For 9takes (information-dense Q&A, blog reading, admin dashboards), bias **smaller** when in doubt — readers want density not airiness.

| Token | Value | Use                                    |
| ----- | ----- | -------------------------------------- |
| `xs`  | 4px   | Hairlines, icon padding                |
| `sm`  | 8px   | Tight gaps between paired elements     |
| `md`  | 12px  | Default small gap                      |
| `lg`  | 16px  | Default card padding, default body gap |
| `xl`  | 24px  | Section gaps inside a card             |
| `2xl` | 32px  | Section gaps on a page                 |
| `3xl` | 48px  | Major section breaks, hero padding     |

---

## 8. Radius scale

### ✅ LOCKED 2026-04-27

```
rounded-sm    4px   tiny inline (badges, dot indicators)
rounded-md    10px  buttons, inputs, chips, popovers
rounded-xl    16px  cards, modals, banners
rounded-full        pills, avatars, spinners
```

**Banned**: `rounded-lg`, `rounded-2xl`, `rounded-3xl`, `rounded-[Npx]`. Enforced by `pnpm lint:radius` (`scripts/lint-radius.js`).

Source of truth: `tailwind.config.ts:117–126`.

Philosophy: **stamped-and-soft.** 10px on small components is firm enough to feel intentional, not pillowy. 16px on cards keeps containers warm without going playful. `rounded-full` is reserved for things that are universally pills (avatars, status dots, spinners) — primary CTAs are `rounded-md`.

---

## 9. Shadow system

### ✅ LOCKED 2026-04-27

**Default:** shadows are mostly off. **Borders do the work** for static UI. Shadows reserved for: hover state on interactive cards, floating UI (modals/popovers/dropdowns), focus rings.

```
--shadow-sm   dark: 0 2px 8px  rgba(0,0,0,0.15)   light: 0 1px 3px  rgba(12,10,9,0.08)
--shadow-md   dark: 0 6px 16px rgba(0,0,0,0.18)   light: 0 4px 6px  rgba(12,10,9,0.10)
--shadow-lg   dark: 0 12px 32px rgba(0,0,0,0.22)  light: 0 10px 15px rgba(12,10,9,0.10)
--shadow-xl   dark: 0 24px 48px rgba(0,0,0,0.25)  light: 0 20px 25px rgba(12,10,9,0.12)
```

Tailwind utilities `shadow-{sm,md,lg,xl}` reference `var(--shadow-*)` and auto-respond to theme.

In dark mode, **surface lightening** (`bg-surface` → `bg-elevated`) is the primary elevation signal — shadows are barely visible against `#0c0a09` regardless.

Source of truth: `src/scss/index.scss:155–159` (dark) and `src/scss/index.scss:304–308` (light); `tailwind.config.ts:107–115` (utility binding).

---

## 10. Motion

### Decisions to make

- [ ] **Lock duration tokens.** Currently `--transition-base: all 0.2s ease`, `--transition-glow: all 0.3s ease`, `--animation-speed: 0.3s`. No documented scale, no easing tokens. Recommend:

  ```
  motion-instant  0ms     theme switch, focus rings
  motion-fast     100ms   hovers, color shifts
  motion-base     180ms   most state changes, dropdowns
  motion-slow     280ms   modals, sheets
  ```

- [ ] **Lock easing tokens.**

  ```
  ease-out-soft     cubic-bezier(0.22, 1, 0.36, 1)    default
  ease-in-out-soft  cubic-bezier(0.4, 0, 0.2, 1)      symmetric (modal open + close)
  ```

  Skip spring easing (wrong for 9takes voice).

- [ ] **Mandatory rule:** add `@media (prefers-reduced-motion: reduce)` global rule in `src/scss/index.scss`. Today the only reference is `@include reduced-motion` for `view-transition-name` — global motion is unguarded.

- [ ] **What NOT to animate** — page transitions, list-render fade-ins, theme switches (hard-cut to avoid flicker), parallax of any kind.

---

## 11. Token wiring

### Single source of truth

Today, three sources drift:

1. `tailwind.config.ts` (colors, radii, shadows, spacing, fontFamily, typography plugin)
2. `src/scss/index.scss` (CSS variables — surface, text, primary/secondary, glows, motion)
3. Inline class attributes (ad-hoc `rounded-[Npx]`, `shadow-[0_0_20px_...]`, `bg-[#1a1a2e]`)

**Direction (proposed):** define brand colors and surface tokens **in `src/scss/index.scss`** as CSS variables, reference them in `tailwind.config.ts` via `var(--token)` or by using literal hex (whichever is cleanest per token). Ban arbitrary classes in lint.

### Files involved

- `tailwind.config.ts` — Tailwind extension (the public utility surface)
- `src/scss/index.scss` — CSS variables, base styles, light-mode overrides
- `src/scss/components.scss` — shared utility classes (`.btn-*`, `.card-*`)
- `src/app.html` — pre-paint theme script (already correct)

---

## 12. The `/styleguide` route

### ❌ Does not exist yet — highest-leverage fix in the system.

**Required sections** (per template):

1. Header — brand wordmark, theme toggle, current effective theme indicator
2. §01 Brand palette — every shade of every ramp with token names
3. §02 Surface tokens — page / surface / elevated / sunken + border + text variants
4. §03 Semantic colors — success / warning / error / info
5. §04 Enneagram type colors — all 9, with type names
6. §05 Typography — every size with sample, plus type-family swatches
7. §06 Spacing scale — visual ruler
8. §07 Radius scale — boxes at every radius
9. §08 Shadow system — boxes at every elevation
10. §09 Motion — interactive demos showing each duration
11. §10 Base components — Button (primary/secondary/ghost/loading), Modal, Card, Input, Tag, Skeleton, EmptyState, ErrorBoundary
12. §11 Brand vocab — Greek statue / philosopher / Enneagram diagram swatches

**Build rule:** if it isn't on `/styleguide`, it doesn't exist. Build this **before** the next component refactor pass.

Add a `safelist` regex to `tailwind.config.ts` so dynamic class names (`bg-{ramp}-{shade}`) survive purge.

---

## 13. Open questions parking lot

Things deferred — capture here so they're not lost.

- [ ] **Iconography library.** Recommendation: `lucide-svelte` (Feather-lineage, tree-shakeable, themeable via `currentColor`). 27 hand-rolled icons get replaced one route at a time. Stroke width = 1.5 (matches Lucide default). Custom Enneagram-type symbols stay (different category).
- [ ] **Logo system.** `aero.webp` is the current header/footer logo. 8 color variants exist (`aria/fresco/nimbus/oceanic/polar/dark-rubix/rock-rubix`) with no documented usage rules. Decide: which variants survive, which are deleted?
- [ ] **Photography direction.** Greek statues (`greek_distorted_statue_face.png`), philosopher gathering, cyber campfire — three different aesthetics in the hero rotation. Pick one or document the rule.
- [ ] **Brand-flavored dark mode personality.** Current dark mode is "warm stone" (brown undertone) — feels intentional. Confirm or pick differently (e.g. "deep teal-tinted").
- [ ] **Loading + empty + error states.** No canonical `<EmptyState>`, `<ErrorState>` atoms. Skeleton has two implementations.
- [ ] **Save → badge-dot pattern.** Per Kole audit, save/like/bookmark actions don't show feedback in the nav.
- [ ] **Component canonicalization.** Pick canonical: `<Button>`, `<Modal>` (rename Modal2 → Modal), `<Icon>`, `<EmptyState>`, single MobileNav, single Skeleton, single Rubix.
- [ ] **Chart de-decoration.** EnneagramBarChart (rounded tops, gradient fills), LineChart (SVG glow filter, gradient area fills), StatCard (drop-shadow on icons) all violate Kole's "data first, decoration second."
- [ ] **Solo Leveling skin** — if Option B brand mood is rejected for the main product, can it survive as a _poster generator_ / _social card_ skin? Posters and Instagram assets actually benefit from gaming energy.

---

## 14. Change log

| Date       | Change                                                                                                                     |
| ---------- | -------------------------------------------------------------------------------------------------------------------------- |
| 2026-04-27 | Radius scale locked + lint-enforced (`pnpm lint:radius`); shadows softened to Kole's recipe; modals consolidated.          |
| 2026-05-01 | Document created. Audit + gap-analysis complete. Brand mood, typography, spacing, motion sections opened for ratification. |
