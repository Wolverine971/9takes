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
| Motion              | `--transition-base`, `--transition-glow`, `--animation-speed`. No documented duration scale. No `prefers-reduced-motion` global rule.                                                       | ❌ Open              |
| Glows               | 6 glow tokens to be cut to 2 (`--glow-sm`, `--glow-md`) in Phase 2. Tailwind `glow-teal`/`-rose` deleted entirely.                                                                          | ✅ LOCKED 2026-05-04 |
| Components          | Shared atoms: Button, SectionKicker, Callout (6 blog callouts render through it), CaseCard/CaseGrid/IndexHero (all 5 listing pages). Icon atom still open.                                  | 🟡 Improving         |
| Icons               | 27 hand-rolled SVGs in `src/lib/components/icons/`. Stroke widths vary (1.5/1.8/2/4). No library.                                                                                           | ❌ Open              |
| Imagery             | Logo (`aero.webp`), hero statues, philosopher photos, DJ portraits — solid asset library, well organized in `static/brand/`                                                                 | ✅ Locked            |
| `/styleguide` route | Shipped — §00–§12 (tokens, type, spacing, radius, shadow, components incl. Callout / CaseCard / CaseGrid / IndexHero as of 2026-06-11)                                                      | ✅ Shipped           |

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

### Locked (de-facto, awaiting brand-mood ratification)

The Tailwind config and `src/scss/index.scss` already agree on this palette. Locking it formally just means saying "yes, this is the palette" and stripping the alternative-history docs (`BRAND-KIT.md`'s purple-primary, archived `solo-leveling-visual-guide-unified.md`'s shadow-monarch).

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

### ✅ LOCKED 2026-05-04 — V5 token set

The Streetlamp Symposium palette replaces the de-facto teal-primary palette as the brand identity. During the **bridge migration** (per `docs/design/2026-05-04-rollout-plan.md`), V5 tokens coexist with the legacy `--bg-*` / `--text-*` / `--primary-*` set in `src/scss/index.scss`. Legacy tokens get removed in the final cleanup phase.

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

#### Semantic palette (unchanged)

| Role    | Token       | Hex       |
| ------- | ----------- | --------- |
| Success | `--success` | `#10B981` |
| Warning | `--warning` | `#F59E0B` |
| Error   | `--error`   | `#EF4444` |

### Glow tokens — ✅ LOCKED 2026-05-04 (Phase 2 cleanup)

Cut from 6 to 2:

- **Keep:** `--glow-sm` (10px @ low alpha), `--glow-md` (20px @ low alpha) — for hover/focus on interactive elements only
- **Delete in Phase 2:** `--glow-lg`, `--glow-secondary`, `--glow-accent`, `--glow-subtle`, plus Tailwind `glow-teal` and `glow-rose` utilities

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

- [ ] **Iconography library.** Recommendation: `@lucide/svelte` (Feather-lineage, tree-shakeable, themeable via `currentColor`). 27 hand-rolled icons get replaced one route at a time. Stroke width = 1.5 (matches Lucide default). Custom Enneagram-type symbols stay (different category).
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

| Date       | Change                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-04-27 | Radius scale locked + lint-enforced (`pnpm lint:radius`); shadows softened to Kole's recipe; modals consolidated.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| 2026-05-01 | Document created. Audit + gap-analysis complete. Brand mood, typography, spacing, motion sections opened for ratification.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| 2026-05-04 | §4 Brand mood locked (Streetlamp Symposium). §5 Color locked (V5 token set). §6 Typography locked (Inter + JetBrains Mono). Glow tokens locked (cut to 2). Rollout plan created at `docs/design/2026-05-04-rollout-plan.md`. Lock candidate prototype: `/design-preview/v5`.                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 2026-06-11 | **Phase 7 complete — legacy bridge aliases deleted** from `src/scss/index.scss` (both themes): `--bg-*`, `--primary*`, `--accent*`, `--accent-rgb`, `--color-theme-purple*`, `--text-primary/-secondary/-tertiary/-muted`. ~275 consumer `var()` usages across 50 files migrated to V5 names; internal derived tokens re-pointed. Same day: **radius backlog burned 527→0** and `lint:radius` now hard-enforces raw CSS declarations (ratchet at 0); **`<Callout>` base shipped** (6 blog callouts render through it; CorpusStatCallout moved to `tone="data"` teal; furniture emoji → SVG masks); **Callout/CaseCard/CaseGrid/IndexHero added to `/styleguide` §11**. Audit trail: `docs/design/2026-06-09-design-audit.md`. |
| 2026-06-09 | **§6 color rules re-ratified** (design audit `docs/design/2026-06-09-design-audit.md`): h1 = `--ink-bright` (amber-h1-once-per-page rule retired — the amber brand moment is the mono kicker); article body = `--ink-bright` everywhere (`--ink-mid` reserved for captions/metadata/secondary voice). §5 ink table fixed to match. Code swept: community/how-to-guides/enneagram-corner bodies `--ink-mid` → `--ink-bright`; pop-culture legacy `--neutral-700` body → `--ink-bright`. Also: `--prose-measure: 75ch` reading-measure token added (§7 adjacent); blog bodies lifted to true 18px.                                                                                                                              |
| 2026-05-05 | **Migration complete (Phases 1–7).** All page categories, asset generators, admin surface, and 47 components migrated to V5 tokens + Svelte 5 runes. Bridge demolition: legacy SCSS tokens redirected as one-line aliases to V5; V5 is now single source of truth for color values. `body` styles use V5 directly. `/design-preview/v2\|v3\|v4` deleted. `@fontsource/rajdhani` + `@fontsource/space-grotesk` removed. **0 legacy core token refs in `src/` code.** Tracker: `docs/design/migration-progress.md`.                                                                                                                                                                                                             |
| 2026-06-11 | **Phase 8 — `--neutral-*` ramp deleted** from `src/scss/index.scss` (both themes), plus zero-consumer `--neutral-light/-border/-text/-divider`. All 20 `var(--neutral-N)` consumers migrated by role per §6: body prose/headings/primary control text → `--ink-bright`; metadata/secondary voice → `--ink-mid`; panel bg → `--night-deep`; borders → `--stone-edge`. Tailwind `neutral` classes are independent hex literals — unaffected. Same day: stale `.noticia-text-regular` utility renamed `.font-body`. Remaining bridge: the gray-name family (`--dark-gray` ×65 et al.) — Phase 9 candidate.                                                                                                                       |
