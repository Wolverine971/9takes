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
> Older brand/visual docs (`BRAND-KIT.md`, `docs/archives/design/solo-leveling-*`, `docs/archives/design/warm-tech-theme-plan.md`) are **historical**. They contradict each other and the code. Treat them as archives, not specs.

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

| Area                | What's in the code today                                                                                                                                                                    | Lock status          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| Brand mood          | Streetlamp Symposium — warm-tech baseline + tech-spec dossier variant for `/personality-analysis/*`                                                                                         | ✅ LOCKED 2026-05-04 |
| Brand voice         | Locked in `brand-positioning.md` + `brand-style-guide-v2.md`                                                                                                                                | ✅ Locked            |
| Color palette       | V5: sodium-amber primary (`--lamp-glow`), warm-stone surfaces (`--night-*`, `--stone-*`), teal data accent (`--data-teal`). **Phase 7 complete 2026-06-11: legacy bridge aliases deleted.** | ✅ LOCKED 2026-05-04 |
| Surface tokens      | `--bg-*` bridge aliases DELETED (Phase 7, 2026-06-11) — use `--night-*` / `--stone-*` directly                                                                                              | ✅ Resolved          |
| Light mode          | Full `:root.light` overrides + `ThemeToggle.svelte` shipped (Tier 2)                                                                                                                        | ✅ Shipped           |
| Typography          | Inter (variable, all weights) + JetBrains Mono. Rajdhani / Space Grotesk / Noticia Text retired in Phase 2.                                                                                 | ✅ LOCKED 2026-05-04 |
| Spacing             | Tailwind `xs/sm/md/lg/xl/2xl/3xl` tokens exist; arbitrary values still common                                                                                                               | 🟡 Partial           |
| Radius              | `sm 4px / md 10px / xl 16px / full` — Kole's recipe, **lint-enforced** (`pnpm lint:radius`) for Tailwind classes AND raw CSS declarations (backlog burned 527→0 2026-06-11)                 | ✅ LOCKED 2026-04-27 |
| Shadow              | Soft, neutral, Kole's recipe (`rgba(0,0,0, 0.15–0.25)`, 2× blur) in dark mode; softer in light mode. CSS-var driven.                                                                        | ✅ LOCKED 2026-04-27 |
| Motion              | Global reduced-motion guard shipped. Duration/easing scale and property-specific transition contract remain open.                                                                           | 🟡 Partial           |
| Glows               | Two tokens remain: `--glow-sm` and `--glow-md`. Legacy color-named utilities and unused global effect mixins are retired.                                                                   | ✅ LOCKED 2026-05-04 |
| Components          | Shared atoms: Button, SectionKicker, Callout (6 blog callouts render through it), CaseCard/CaseGrid/IndexHero (all 5 listing pages). Icon atom still open.                                  | 🟡 Improving         |
| Icons               | Lucide is installed and partially adopted; 27 custom icon components and many inline SVGs remain. Custom Enneagram marks are exempt.                                                        | 🟡 Migrating         |
| Imagery             | Logo (`aero.webp`), hero statues, philosopher photos, DJ portraits — solid asset library, well organized in `static/brand/`                                                                 | ✅ Locked            |
| `/styleguide` route | Shipped — §00–§12 (tokens, type, spacing, radius, shadow, components incl. Callout / CaseCard / CaseGrid / IndexHero as of 2026-06-11)                                                      | ✅ Shipped           |

**Verdict:** Strong token and brand foundation with a shipped styleguide, but partial component
canonicalization and too much styling spread across global SCSS, scoped Svelte styles, Tailwind, and
duplicated specimens. The active maintenance plan lives in
`docs/design/hyperplexed/STYLE_SYSTEM_MAINTENANCE_BACKLOG_2026-08-03.md`.

---

## 2. Goals for the style kit

1. **Keep the system visible** — maintain `/styleguide` as an executable view of every locked token and base component.
2. **Make drift impossible** — token-only colors/radii/shadows; lint enforces (radius lint already exists).
3. **Make it feel like one product** — pick one brand mood and let every later decision flow from it.
4. **Keep it small** — smallest token set that expresses 9takes. Cut effect tokens, not add more.

---

## 3. Build order

Same order as the walkthrough template — brand mood **first**, because every later decision is anchored to it.

| #   | Section             | Status               | Notes                                                                                 |
| --- | ------------------- | -------------------- | ------------------------------------------------------------------------------------- |
| 4   | Brand foundations   | ✅ LOCKED 2026-05-04 | Streetlamp Symposium — warm-tech baseline + dossier variant                           |
| 5   | Color               | ✅ LOCKED 2026-05-04 | V5 token set; bridge migration via rollout plan                                       |
| 6   | Typography          | ✅ LOCKED 2026-05-04 | Inter + JetBrains Mono only; Rajdhani/Space Grotesk retired                           |
| 7   | Spacing             | 🟡 De-facto          | Token set exists; subset commitment open                                              |
| 8   | Radius              | ✅ Locked            | `sm/md/xl/full`, lint-enforced                                                        |
| 9   | Shadow              | ✅ Locked            | Kole's recipe, theme-aware                                                            |
| 10  | Motion              | ❌ Open              | No documented scale yet                                                               |
| 11  | Token wiring        | ✅ Resolved          | V5 CSS vars are the single color source; legacy aliases deleted (Phase 7, 2026-06-11) |
| 12  | `/styleguide` route | ✅ Shipped           | §00–§12 live; new atoms added 2026-06-11                                              |
| 13  | Component refactor  | 🟡 Partial           | Modal/Button/Callout/CaseCard/CaseGrid/IndexHero done; Icon atom still missing        |

---

## 4. Brand foundations

Voice is **locked** in `docs/brand/brand-positioning.md` and
`docs/brand/brand-style-guide-v2.md`. The Streetlamp Symposium mood is also locked; the remaining work
is implementation consolidation rather than choosing a new visual direction.

### Locked

| Field                | Value                                                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**             | **9takes** (canonical). All-lowercase wordmark, no space.                                                                                                     |
| **One-line promise** | **See the emotions behind every take.**                                                                                                                       |
| **Mission**          | Help people decode social dynamics, personality-max EQ, and turn conflict into understanding using the Enneagram.                                             |
| **Audience**         | Young men seeking social/dating advantage; tactical-psychology readers ("The Game" lineage); people stuck in workplace/relationship dynamics they can't read. |
| **Voice (4 traits)** | Tactically Direct · Socially Savvy · Respectfully Provocative · Pattern-Recognition Focused                                                                   |
| **What we are NOT**  | ❌ Academic/theoretical · ❌ New-Age mystical · ❌ Generic SaaS minimalist · ❌ Corporate · ❌ Preachy                                                        |

### ✅ LOCKED 2026-05-04 — Streetlamp Symposium

**Two-mode brand:**

- **Primary mode (Streetlamp Symposium)** — warm-tech, dark stone with sodium-amber illumination. Greek-statue + tech-spec contrast as the cultural anchor. Used everywhere except where the dossier variant takes over.
- **Tech-spec dossier variant** — same tokens, denser layout (mono labels, coordinate annotations, stat panels, case-file framing). Used on `/personality-analysis/*` pages.

**Visual references** (the ones we channel):

- Pirate Wires editorial voice ("we know things others don't")
- Caravaggio + Hopper warm-pool-against-shadow lighting
- Persona 5 confidant cards (data-warm, not data-cold)
- Greek philosopher statues lit from one side (already in `static/`)
- Late-night intimate-gathering energy — the streetlamp meetup

**Visual vocabulary** (concrete recurring elements):

- Pools of warm light against deep stone (chiaroscuro composition)
- Greek statue imagery as illuminated subject, not decorative texture
- Mono labels as section markers (`§NN · LABEL`) and dossier annotations
- 1px stone-edge borders as the elevation workhorse — shadows reserved for floating UI
- Sodium-amber primary glow — never neon, never gradient-drenched
- Negative space treated as deep night, not empty white

**Header wordmark accent rule (ratified 2026-07-13):** the text wordmark rests in warm marble
(`--ink-bright` mixed lightly with `--lamp-deep`). Full `--lamp-glow` is reserved for hover/focus,
primary action, and compact illuminated labels. The search edge and Library border carry low-alpha
amber mixed into stone; the logo does not compete with them. See HyperPlexed pattern P19.

**What we are visually NOT** (final):

- ❌ Generic SaaS template (Notion/Linear/Stripe wholesale aesthetic)
- ❌ Wellness-app softness (Headspace, Calm)
- ❌ Solo Leveling wholesale (gaming UI, particle effects, XP bars on the homepage)
- ❌ Mystical / Illuminati cosplay (no eye-in-pyramid, no sacred geometry, no Tarot)
- ❌ MBTI / 16personalities cartoon-coded UI
- ❌ Red-pill / "The Game" bro aesthetic
- ❌ Corporate-cold SaaS (Salesforce, Hubspot)

**Canonical visual reference:** `/design-preview/v5`. Production migrates in Phase 4 of `docs/design/2026-05-04-rollout-plan.md`.

---

## 5. Color

### Archived pre-V5 palette — historical only

The former teal-primary, rose-secondary, purple-accent, `--bg-*`, `--text-*`, gray-name, and generic
component-alias palettes are retired. They are not alternative themes and must not be copied into new
work. Historical values remain in `docs/design/2026-05-04-streetlamp-symposium-v5.md` for archaeology;
the V5 role map below is the only production color contract.

### ✅ LOCKED 2026-05-04 — V5 token set

The Streetlamp Symposium palette replaced the de-facto teal-primary palette as the brand identity.
The bridge migration is complete: production code uses the V5 role tokens directly, without the
former teal/rose/purple, gray-name, or generic component aliases.

Run `pnpm lint:colors` (also included in `pnpm lint`) to prevent retired bridge tokens, dormant
Tailwind palettes, and old nonsemantic rose/violet interface colors from returning in CSS, inline
markup, SVG attributes, or email source. Canonical Enneagram type colors and the contained
portrait-violet media treatment are deliberate exceptions, not interface accents.

#### V5 brand palette (canonical)

| Role            | Token           | Dark      | Light     | Use                                               |
| --------------- | --------------- | --------- | --------- | ------------------------------------------------- |
| **Primary**     | `--lamp-glow`   | `#F59E0B` | `#B45309` | Sodium-amber illumination — CTAs, brand moments   |
|                 | `--lamp-deep`   | `#B45309` | `#92400E` | Hover, pressed                                    |
|                 | `--lamp-light`  | `#FBBF24` | `#D97706` | Highlights                                        |
| **Data accent** | `--data-teal`   | `#0D9488` | `#0F766E` | Tech-spec annotations, dossier mode, stat panels  |
|                 | `--data-cyan`   | `#5EEAD4` | `#14B8A6` | Active data points                                |
| **Surfaces**    | `--night-deep`  | `#0a0807` | `#FAF8F4` | Page background                                   |
|                 | `--night-mid`   | `#16110d` | `#F2EBDD` | Secondary surface                                 |
|                 | `--stone-warm`  | `#241D17` | `#FFFFFF` | Cards, content containers                         |
|                 | `--stone-mid`   | `#3a302a` | `#F5F0E8` | Elevated, hover                                   |
|                 | `--stone-edge`  | `#5C4F47` | `#D6CCB8` | 1px hairline borders                              |
| **Marble**      | `--marble-pure` | `#FAF8F4` | `#FFFFFF` | Statue lit faces, pure-light moments              |
| **Ink**         | `--ink-bright`  | `#FAF8F4` | `#1C1917` | Primary text + article body (ratified 2026-06-09) |
|                 | `--ink-mid`     | `#A8A095` | `#44403C` | Captions, metadata, secondary voice               |
|                 | `--ink-dim`     | `#5C4F47` | `#78716C` | Captions, mono labels                             |
|                 | `--ink-muted`   | `#3A302A` | `#A8A29E` | Disabled, placeholders                            |

**Why amber instead of teal:** the Streetlamp Symposium mood requires a sodium-vapor warm-light primary. Teal is too cool to read as illumination. Teal survives as **`--data-teal`** — the secondary "system / data" accent for tech-spec dossier moments.

**Enneagram type colors** (data-only, unchanged from production global SCSS):

| Type | Hex       | Type | Hex       | Type | Hex       |
| ---- | --------- | ---- | --------- | ---- | --------- |
| 1    | `#6366F1` | 4    | `#A855F7` | 7    | `#FBBF24` |
| 2    | `#F472B6` | 5    | `#0EA5E9` | 8    | `#DC2626` |
| 3    | `#F59E0B` | 6    | `#22C55E` | 9    | `#34D399` |

#### Personality portrait media color — ✅ LOCKED 2026-08-02

Legacy personality portraits keep their recognizable violet mark, but violet is contained inside
the image rather than promoted into interface chrome. The source files under `static/types/` remain
unchanged; owned portrait callers opt into a theme-aware presentation treatment.

| Role            | Token                           | Dark                                             | Light                                            |
| --------------- | ------------------------------- | ------------------------------------------------ | ------------------------------------------------ |
| Portrait well   | `--personality-portrait-well`   | `#2C1F28`                                        | `#F6F3FB`                                        |
| Portrait filter | `--personality-portrait-filter` | `contrast(1.08) brightness(0.92) saturate(0.68)` | `contrast(1.02) brightness(0.99) saturate(0.58)` |

Color priority on personality-analysis surfaces:

1. Amber is illumination, action, and focus.
2. Enneagram type color is data only.
3. Legacy portrait violet stays inside treated portrait imagery. Purple remains valid only when it
   is explicitly labeled Type 4 or heart-triad data.
4. Stone and ink carry frames, dividers, corners, and passive annotations.
5. Teal remains reserved for statistical/data moments.

Use the semantic `.personality-portrait-well` and `.personality-portrait-image` opt-ins. Do not
target portrait URLs globally, recolor source assets, reset the filter on hover, or reuse violet for
buttons and decorative UI. The calibration fixture lives in `/styleguide` §13; publishing guidance
lives in `docs/design/personality-portrait-authoring.md`. Run
`pnpm portrait:check -- <type> <Person-Name>` to validate a generated pair and open its exact-asset
dark/light review fixture.

#### Semantic palette (unchanged)

| Role    | Token       | Hex       |
| ------- | ----------- | --------- |
| Success | `--success` | `#10B981` |
| Warning | `--warning` | `#F59E0B` |
| Error   | `--error`   | `#EF4444` |

### Glow tokens — ✅ LOCKED 2026-05-04 (Phase 2 cleanup)

Cut from six to two:

- **Keep:** `--glow-sm` (10px @ low alpha), `--glow-md` (20px @ low alpha) — for hover/focus on interactive elements only
- **Retired:** `--glow-lg`, `--glow-secondary`, `--glow-accent`, `--glow-subtle`, the color-named
  glow mixin aliases, and Tailwind `glow-teal` / `glow-rose` utilities

### Critical rule (locked)

> **No raw Tailwind grayscale or color-name classes in `src/`.** Always use semantic tokens (`var(--ink-bright)`, `bg-[var(--stone-warm)]`) or brand tokens. Code review enforces; ESLint rule to follow in Phase 3.

---

## 6. Typography

### ✅ LOCKED 2026-05-04 — Inter + JetBrains Mono

**Type system:** Inter (variable, weights 400–800) + JetBrains Mono. **No serif. No third sans-serif.**

| Family             | Use                                                                            | Loaded via                                                        |
| ------------------ | ------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| **Inter**          | Display, headlines, body — every size from 12px to 80px                        | `@fontsource-variable/inter` (Phase 2 swap from Google Fonts CDN) |
| **JetBrains Mono** | Section kickers (`§NN · LABEL`), dossier annotations, stat values, coordinates | Already loaded globally                                           |

**Drop in Phase 2:** Rajdhani, Space Grotesk. Inter at weight 800 with -0.04em letter-spacing handles the gravitas role Rajdhani used to do. (Noticia Text files in `static/fonts/` are **kept intentionally** — the question social-card renderer (`renderQuestionSocialCard.ts`) loads the TTFs at runtime, and question-print/social-card templates use the family. Exempt asset skin, not UI chrome.)

### Type scale (V5 lock)

```
display-xl   72px  Inter  800  -0.04em letter-spacing  hero tagline
display-lg   56px  Inter  800  -0.03em                 large section headers
display-md   40px  Inter  700  -0.02em                 standard section headers
display-sm   28px  Inter  700  -0.015em                small section headers
body-lg      18px  Inter  400  1.55 line-height        reading body
body         16px  Inter  400  1.55                    default body
body-sm      14px  Inter  400  1.50                    small body
mono         12px  JetBrains 500  0.08em UPPERCASE     dossier-style labels
mono-lg      14px  JetBrains 500  0.06em UPPERCASE     prominent annotations
```

### Color rules (locked, re-ratified 2026-06-09)

| Element             | Color                                   |
| ------------------- | --------------------------------------- |
| `h1` / display-xl   | `var(--ink-bright)`                     |
| `h2`–`h4`           | `var(--ink-bright)`                     |
| Body                | `var(--ink-bright)`                     |
| Caption / metadata  | `var(--ink-mid)`                        |
| Mono section kicker | `var(--lamp-glow)`                      |
| Mono footnote       | `var(--ink-dim)`                        |
| Links               | `var(--lamp-glow)` with hover underline |

> **2026-06-09 ratification (design audit):** the original "h1 = `--lamp-glow`
> once per page" rule was never implemented — every shipped surface renders h1
> in `--ink-bright`, consistently. Ratified the code side: **the amber brand
> moment lives in the mono section kicker** (which is amber everywhere), not
> the h1. A full-amber h1 on dark stone reads louder than the Streetlamp mood
> wants.
>
> Same audit also ratified **body = `--ink-bright`** (this table was already
> right, but §5's ink table said body = `--ink-mid` and three blog sections
> shipped three different body colors — `--ink-mid`, legacy `--neutral-700`,
> and `--ink-bright`). Body text in a secondary gray reads as low-confidence.
> `--ink-mid` is for captions, metadata, and secondary voice (e.g. blockquotes).

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

- [x] **Reduced-motion guard shipped.** `src/scss/index.scss` applies the global reduced-motion
      fallback. New signature motion should still be opt-in under
      `prefers-reduced-motion: no-preference`.

- [ ] **What NOT to animate** — page transitions, list-render fade-ins, theme switches (hard-cut to avoid flicker), parallax of any kind.

---

## 11. Token wiring

### Single source of truth

Today, three sources drift:

1. `tailwind.config.ts` (colors, radii, shadows, spacing, fontFamily, typography plugin)
2. `src/scss/index.scss` (CSS variables — lamp, stone, ink, data, semantic status, glows, motion)
3. Inline class attributes (ad-hoc `rounded-[Npx]`, `shadow-[0_0_20px_...]`, `bg-[#1a1a2e]`)

**Direction (proposed):** define brand colors and surface tokens **in `src/scss/index.scss`** as CSS variables, reference them in `tailwind.config.ts` via `var(--token)` or by using literal hex (whichever is cleanest per token). Ban arbitrary classes in lint.

### Files involved

- `tailwind.config.ts` — Tailwind extension (the public utility surface)
- `src/scss/index.scss` — CSS variables, base styles, light-mode overrides
- `src/scss/components.scss` — line-budgeted legacy component migration layer; do not add new
  component semantics here
- `src/app.html` — pre-paint theme script (already correct)

---

## 12. The `/styleguide` route

### ✅ Live system test bench

`/styleguide` now renders the canonical V5 palette, semantic colors, type colors, typography,
spacing, radius, shadows, motion, components, brand vocabulary, and the contained-violet portrait
contract. Its pre-V5 section is an archive notice rather than a second swatch menu. §13 is the
permanent portrait calibration and exact-asset publishing fixture that supersedes temporary decision
previews.

**Build rule:** if a reusable token or component is not represented on `/styleguide`, it does not
belong in the production system.

---

## 13. Open questions parking lot

Things deferred — capture here so they're not lost.

- [ ] **Finish icon convergence.** `@lucide/svelte` is installed and partially adopted. Replace
      ordinary hand-rolled controls one route at a time and lock a shared size/stroke contract. Custom
      Enneagram-type symbols stay as a different category.
- [ ] **Logo system.** `aero.webp` is the current header/footer logo. 8 color variants exist (`aria/fresco/nimbus/oceanic/polar/dark-rubix/rock-rubix`) with no documented usage rules. Decide: which variants survive, which are deleted?
- [ ] **Photography direction.** Greek statues (`greek_distorted_statue_face.png`), philosopher gathering, cyber campfire — three different aesthetics in the hero rotation. Pick one or document the rule.
- [ ] **Brand-flavored dark mode personality.** Current dark mode is "warm stone" (brown undertone) — feels intentional. Confirm or pick differently (e.g. "deep teal-tinted").
- [x] **Loading + empty + error adoption.** `<EmptyState>` and `<ErrorState>` share the canonical
      `StatusState` shell and are used by production content/related-post flows. Skeleton and Spinner each
      have one contract; remaining route-local loaders should migrate as their owners are touched.
- [ ] **Save → badge-dot pattern.** Per Kole audit, save/like/bookmark actions don't show feedback in the nav.
- [ ] **Component canonicalization.** Button, Modal, SectionKicker, Callout, Field/Input/Textarea/Select,
      EmptyState, ErrorState, StatusState, Skeleton, and Spinner are canonical. Remaining gaps are the Icon
      contract, one MobileNav, one Rubix, shared admin primitives, and migration off the global component
      stylesheet.
- [ ] **Chart de-decoration.** EnneagramBarChart (rounded tops, gradient fills), LineChart (SVG glow filter, gradient area fills), StatCard (drop-shadow on icons) all violate Kole's "data first, decoration second."
- [ ] **Solo Leveling skin** — if Option B brand mood is rejected for the main product, can it survive as a _poster generator_ / _social card_ skin? Posters and Instagram assets actually benefit from gaming energy.

---

## 14. Change log

| Date       | Change                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-04-27 | Radius scale locked + lint-enforced (`pnpm lint:radius`); shadows softened to Kole's recipe; modals consolidated.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| 2026-05-01 | Document created. Audit + gap-analysis complete. Brand mood, typography, spacing, motion sections opened for ratification.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| 2026-05-04 | §4 Brand mood locked (Streetlamp Symposium). §5 Color locked (V5 token set). §6 Typography locked (Inter + JetBrains Mono). Glow tokens locked (cut to 2). Rollout plan created at `docs/design/2026-05-04-rollout-plan.md`. Lock candidate prototype: `/design-preview/v5`.                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 2026-06-11 | **Phase 7 complete — legacy bridge aliases deleted** from `src/scss/index.scss` (both themes): `--bg-*`, `--primary*`, `--accent*`, `--accent-rgb`, `--color-theme-purple*`, `--text-primary/-secondary/-tertiary/-muted`. ~275 consumer `var()` usages across 50 files migrated to V5 names; internal derived tokens re-pointed. Same day: **radius backlog burned 527→0** and `lint:radius` now hard-enforces raw CSS declarations (ratchet at 0); **`<Callout>` base shipped** (6 blog callouts render through it; CorpusStatCallout moved to `tone="data"` teal; furniture emoji → SVG masks); **Callout/CaseCard/CaseGrid/IndexHero added to `/styleguide` §11**. Audit trail: `docs/design/2026-06-09-design-audit.md`. |
| 2026-06-09 | **§6 color rules re-ratified** (design audit `docs/design/2026-06-09-design-audit.md`): h1 = `--ink-bright` (amber-h1-once-per-page rule retired — the amber brand moment is the mono kicker); article body = `--ink-bright` everywhere (`--ink-mid` reserved for captions/metadata/secondary voice). §5 ink table fixed to match. Code swept: community/how-to-guides/enneagram-corner bodies `--ink-mid` → `--ink-bright`; pop-culture legacy `--neutral-700` body → `--ink-bright`. Also: `--prose-measure: 75ch` reading-measure token added (§7 adjacent); blog bodies lifted to true 18px.                                                                                                                              |
| 2026-05-05 | **Migration complete (Phases 1–7).** All page categories, asset generators, admin surface, and 47 components migrated to V5 tokens + Svelte 5 runes. Bridge demolition: legacy SCSS tokens redirected as one-line aliases to V5; V5 is now single source of truth for color values. `body` styles use V5 directly. `/design-preview/v2\|v3\|v4` deleted. `@fontsource/rajdhani` + `@fontsource/space-grotesk` removed. **0 legacy core token refs in `src/` code.** Tracker: `docs/design/migration-progress.md`.                                                                                                                                                                                                             |
| 2026-06-11 | **Phase 8 — `--neutral-*` ramp deleted** from `src/scss/index.scss` (both themes), plus zero-consumer `--neutral-light/-border/-text/-divider`. All 20 `var(--neutral-N)` consumers migrated by role per §6: body prose/headings/primary control text → `--ink-bright`; metadata/secondary voice → `--ink-mid`; panel bg → `--night-deep`; borders → `--stone-edge`. Tailwind `neutral` classes are independent hex literals — unaffected. Same day: stale `.noticia-text-regular` utility renamed `.font-body`.                                                                                                                                                                                                              |
| 2026-08-02 | **Contained-violet personality portrait contract locked and Phase 9 alias cleanup completed.** Added theme-aware portrait well/filter tokens, semantic opt-in classes, and `/styleguide` §13 with all nine Enneagram type colors. Removed the standalone rose, gray-name, zero-consumer generic component aliases, and unused color-named glow mixins; migrated the remaining callers to V5 roles; converted the live legacy swatches to an archive notice; and retired the superseded Anna decision preview. Source portrait assets remain unchanged.                                                                                                                                                                        |
| 2026-08-03 | **Phase 9 independent and clean-room hardening completed.** Repaired 18 residual calls to deleted bridge aliases, removed dormant Tailwind rose/purple/obsolete brand ramps, harmonized three published article skins plus print/email output, removed old violet from SVG presentation attributes and shared fallbacks, and added `lint:colors` as a regression guard. Type 4 purple and contained portrait violet remain intentional data/media roles. The form/status/loading primitive families and executable styleguide coverage also shipped; Wave 3 began retiring the line-budgeted global component migration layer.                                                                                                |
