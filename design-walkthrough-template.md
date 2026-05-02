<!-- design-walkthrough-template.md -->

# Design System Walkthrough — Reusable Template

> A portable playbook for designing or re-designing a product's visual system from first principles, in a guided conversation with an LLM agent.
>
> This template was distilled from the Tiny Tribe Adventures process (see `tinytribe-design-system.md` in this repo for the actual output it produced). Drop it into any project to re-run the same flow.

---

## What this template gives you

After running this end-to-end, you have:

1. A locked **brand foundations** doc (mission, audience, voice, visual mood, what we're not).
2. A complete set of **design tokens**: colors (with semantic + surface roles), typography (3 typefaces, modular scale), spacing, radius, shadow, motion.
3. **Implementation**: tokens wired into Tailwind config + CSS variables, fonts self-hosted, theme system shipped, base components refactored.
4. A **`/styleguide` route** that renders every token + component — the source of truth.
5. A **living doc** (`docs/design-system.md`) with a change log so future drift can be spotted.

Time investment: roughly 1.5–2 hours of conversation + 30–60 minutes of agent implementation. Faster if you know your answers; slower if you need to think.

---

## How to use this template

### 1. Pick a starting mode

There are two ways into this. Choose based on what already exists.

#### Mode A — Start from scratch

You have a tech stack picked (or it's about to be) and an idea, but no UI yet. There's no drift to fix because there's no code.

**Skip directly to Section 1 (Brand Foundations).** The audit step is N/A.

You'll need to make one upfront decision the agent can't make for you: **what tech is this getting built on?** (e.g., "SvelteKit + Tailwind + Flowbite," "Next.js + Tailwind + shadcn/ui," "Rails + Hotwire + Tailwind"). The implementation steps depend on this.

#### Mode B — Audit existing codebase

You already have a working app. Brand might be loose, tokens might be ad-hoc, components might use raw `gray-*` and `blue-*` everywhere. This is the more common (and more valuable) starting point.

**Run the audit first** (Section 0 below), then proceed to Section 1.

### 2. Run the conversation top-down

The build order is **fixed**: brand → color → typography → spacing → radius → shadow → motion → wiring → showcase → component refactor.

This order matters because earlier decisions constrain later ones. You can't pick typography before knowing the brand mood. You can't pick shadows before knowing radius and color tint. Etc.

### 3. Follow the collaboration patterns (the meta-process)

This is the part that made this work well. See **[Section ★] Collaboration patterns** below — the propose/react/lock loop, the mood-board iteration, when to pivot earlier sections, how to document.

### 4. Lock decisions into a doc as you go

Write each section's outcome into a `docs/design-system.md` file in the project. A change log at the bottom captures _when_ each section was locked. This becomes the artifact future contributors point to.

---

## ★ Collaboration patterns (the meta-process)

These are the moves that turned this from a spec dump into a real design conversation. They matter more than the section content.

### Pattern 1 — Propose options + recommendation, never a single answer

Bad agent prompt: _"What font do you want?"_

Good agent prompt: _"Three typeface options, all in the field-manual lane: A — Slab Field Guide (Bitter + Inter + JetBrains Mono), B — Engineered Utility (IBM Plex), C — Bold Stencil (Oswald). My recommendation: A, because [reasons]."_

The user reacts to options faster than they generate them. Always give 2–3 named options + your pick + the reason for your pick. Never offer just a recommendation; never offer just options.

### Pattern 2 — Mood board first, then everything else

Before talking about color or type or radius, **establish the visual mood with reference brands/sites/objects.** Without a shared north star, every later decision is unanchored.

The mood-board step has two halves:

- **Agent suggests 3–5 references**, with one-line vibe descriptions and links.
- **User reacts and tailors** — picks what resonates, rejects what doesn't, adds their own (often surprising) references.

The Tiny Tribe example: agent suggested REI / Field Notes / NYT Cooking / Atlas Obscura / AllTrails. User said "those are too polished," sent photos of a topographic map in a multicam binder + a Navy SEAL field manual book cover. That single user contribution reframed the entire system.

**The user's references are almost always more interesting than the agent's.** Agent goes first to break the blank-page problem; user always overrides.

### Pattern 3 — Reflect references back specifically before committing

When the user gives you references, don't just say "got it." Reflect back:

- What you're reading from the references (specific aesthetic elements)
- How that maps to the existing palette / type / etc.
- What changes about your earlier recommendations as a result
- Updated mood references (drop the wrong ones, add new ones in the right lane)

This is the moment that catches misreads. The user can correct you before the system gets built around a wrong interpretation.

### Pattern 4 — Pivot earlier sections when later context changes them

If the brand mood is locked as "field manual," and the typography section was originally going to recommend Fraunces (editorial serif), **pivot the typography recommendation in place.** Don't pretend the earlier draft was right.

The doc supports this — earlier sections can have a "Pivot YYYY-MM-DD: see updated recommendation" callout where the original lives. Pivots are visible, not hidden.

### Pattern 5 — Lock decisions visibly with checkboxes and dates

Each section in the doc has three states:

- **Decisions to make** (open questions, with checkboxes)
- **Recommended starting point** (agent's opinion, defensible)
- **Final values** (filled in once locked, with a `✅ LOCKED YYYY-MM-DD` marker)

The change log at the bottom of the doc captures the lock event for each section. Anyone joining the project later can see the order decisions were made in.

### Pattern 6 — Build the showcase route as the final source of truth

The `/styleguide` route is the bargain: _if it isn't on this page, it doesn't exist._ This means:

- Every token has a visible swatch on the page
- Every base component (button, card, tag, input, modal) has its variants on the page
- The page itself uses every token, so it visually breaks if anything is misconfigured
- The theme toggle is on this page so light/dark can be checked at a glance

Build this **before** the component refactor pass — it's the test bench for the refactor.

### Pattern 7 — Refactor components with the new tokens _visible_

After tokens are wired in, you want to see them used immediately on real components, not just on the styleguide. Pick the highest-traffic page (in our case the home page + cards + filters) and refactor those first. This is where you discover that an empty state needed a token you didn't define, or a hover state needs an opacity ramp you skipped.

---

## Section 0 — Audit (Mode B only)

Skip if Mode A.

Goal: understand what exists today across **brand, color, typography, spacing, radius, shadow, motion, components, and imagery.** Document each as a heading with bullets.

### Audit prompt template

```
Assess the current state of this project's design system. For each area below,
report what exists today and where it drifts from a coherent system. Specifically:

1. Brand documents — is there a mission / voice / mood doc anywhere?
2. Colors — find tailwind.config.* and any global CSS. List the palette,
   note which colors are actually used vs. ignored.
3. Typography — what font is loaded? Is there a documented type scale?
   How are heading sizes picked across pages?
4. Spacing / radius / shadow / motion — are there documented tokens, or
   defaults + ad-hoc usage?
5. Components — list the custom components. Note which ones use Flowbite/
   ShadCN/etc. defaults vs. custom styles.
6. Imagery — what's in /static or /public? Logos, icons, photography?

End with: a one-sentence verdict on the system's overall maturity, and the
single biggest gap.
```

### Audit output format

```markdown
## Audit (YYYY-MM-DD)

### Brand documents

- [observation]
- [observation]

### Colors

- [palette]
- **Drift in code:** [where intent diverges from execution]

### Typography

[...]

### [continue for each area...]

### Verdict

[one sentence] · Biggest gap: [one thing]
```

The audit becomes Section 1 of `docs/design-system.md`.

---

## Section 1 — Brand foundations

This is the most important section. Until it's locked, every other decision is a guess.

### Five questions to lock

1. **Name & naming consistency.** What is the product called user-facing? Are there asset filenames, package names, or repo names that say something different? Pick one canonical name; everything else is internal nickname.
2. **One-line promise.** What does this product do for the user, in 8 words or less? This becomes the homepage headline + meta description.
3. **Primary audience.** A single specific persona, not a category. "Parents of kids 0–9 in the DMV planning a Saturday outing on a phone" beats "parents."
4. **Voice.** 3–4 adjectives. Plus the inverse: 3–4 explicit "we are NOT" adjectives. The boundary defines the inside.
5. **Visual mood (the mood board).** 3–5 references — brands, sites, magazines, physical objects. _This is where the agent goes first with suggestions, then the user tailors with their own._

### Output template

```markdown
## 1. Brand foundations ✅ LOCKED YYYY-MM-DD

### Name

**[Name].** [Internal nicknames noted as such.]

### One-line promise

> **[8 words or less.]**

### Mission (longer form)

[2-3 sentences for /about and meta description.]

### Primary audience

[One specific persona, with constraints on age/location/use-case/device.]

### Voice

[3-4 adjectives in order of weight, each with a one-line gloss.]

### What we are NOT

- ❌ [Boundary]
- ❌ [Boundary]
- ...

### Visual mood — "[Two-word vibe name]"

**Mood references (the ones we want to channel):**

- [Reference 1 with link/description]
- ...

**What we are visually NOT:**

- [Anti-reference 1]
- ...

### Visual vocabulary

[Concrete elements that show up repeatedly in the UI — e.g., for our
"field manual": topographic contour lines, coordinate labels, scale bars,
kraft texture, line illustrations.]
```

---

## Section 2 — Color

If Mode B and a palette already exists, **start by re-framing the existing palette through the new brand mood.** Often the palette is already correct and was just being used wrong (this happened in Tiny Tribe — the existing forest green / sandstone / orange / sky blue / slate was already a topo-map palette; the team just hadn't realized it).

### Three things to lock

1. **Brand palette** — confirm or trim. Each color gets a 50→900 ramp.
2. **Semantic palette** — `success`, `warning`, `danger`, `info`. Recommend reusing brand colors where possible (e.g., forest green = success, route-marker orange = warning). Add only the colors you actually need that the brand palette doesn't cover (usually a `danger` red).
3. **Surface tokens (theme-aware)** — these are CSS variables that switch in dark mode:
   - `bg-page`, `bg-surface`, `bg-elevated`, `bg-sunken`
   - `border-subtle`, `border-strong`
   - `text-default`, `text-muted`, `text-subtle`, `text-inverted`
   - `ring-focus`

### Dark mode decision

Three tiers of complexity. Pick one upfront:

- **Tier 1** — System preference only (`prefers-color-scheme` media query). ~10 min of work.
- **Tier 2** — System + manual nav toggle, persisted to localStorage. ~1 hour.
- **Tier 3** — System + manual + sunset-aware auto, using user geolocation. ~3–4 hours. Ship this if dark/light parity matters to the brand.

If choosing Tier 2 or 3, also pick a **dark-mode personality**:

- "Standard dark" — generic neutral grays
- "Brand-flavored dark" — e.g., warm browns for kraft, deep navy for nautical, dim red for night-vision

The brand-flavored option is almost always the right one. Generic dark mode erases everything you just decided about brand.

### Critical rule to lock

> No raw `gray-*`, `blue-*`, `green-*`, `red-*`, `slate-*`, `zinc-*` Tailwind classes in `src/`. Always use semantic tokens or brand tokens. Code review enforces.

---

## Section 3 — Typography

### Three decisions to lock

1. **Type system** — pick a 2 or 3-typeface combination matching the brand mood. Always show 3 options with a recommended pick.
2. **Type scale** — modular ratio (1.125 / 1.2 / 1.25), or a hand-tuned field-manual scale (smaller jumps, tighter line-heights). Default 9 sizes from `text-xs` (12px) to `text-5xl` (64px). Each size includes default `font-weight` + `line-height`.
3. **Font weights to ship** — each weight is a separate file. **Always recommend variable fonts via `@fontsource-variable/*`** — single file per family covers all weights. Skip italic for body unless you specifically need it.

### Hosting

**Self-host with `@fontsource-variable/*` packages.** Three reasons:

1. Privacy / GDPR (no Google Fonts CDN sending IPs to Google)
2. Performance (no third-party DNS/TLS handshake)
3. Reliability (doesn't break if Google CDN hiccups)

### Color rules for type

- `h1` → brand primary color (the brand moment)
- `h2`–`h4` → `text-default`
- Body → `text-default`
- Captions → `text-muted`
- Links → `text-accent-700` light / `text-accent-400` dark, with `underline-offset-2 hover:underline`

---

## Section 4 — Spacing

Stick with Tailwind's 4px base scale, **but commit to a 10-step subset.** Anything outside the subset (`p-5`, `gap-7`, `[20px]`) is wrong.

```
space-0.5 (2px)  → hairlines
space-1   (4px)  → icon padding
space-2   (8px)  → tight gaps
space-3   (12px) → default small gap
space-4   (16px) → default gap, card padding
space-6   (24px) → section gaps inside a card
space-8   (32px) → section gaps on a page
space-12  (48px) → major section breaks
space-16  (64px) → hero padding
space-24  (96px) → page-level vertical rhythm
```

For dense brands (field-manual, dashboards, technical): **bias smaller** — when in doubt, step down.

For airy brands (luxury, editorial): **bias larger** — when in doubt, step up.

Soft enforcement (code review) by default. Hard enforcement (ESLint rule) only if drift becomes a problem.

---

## Section 5 — Radius

This is one of the strongest "personality" signals in the system.

### Three philosophies, pick one:

| Philosophy          | Scale                  | Vibe                                         |
| ------------------- | ---------------------- | -------------------------------------------- |
| **Stamped & sharp** | 0 / 2 / 4 / 8 / full   | Field manual, military, technical, brutalist |
| **Friendly soft**   | 0 / 4 / 8 / 12 / full  | Modern SaaS, friendly, approachable          |
| **Pillowy**         | 0 / 6 / 12 / 20 / full | Playful, kid-focused, pop, rounded           |

### Strong opinion to anchor on

**Tags are the leading indicator.** The decision to make tags as `rounded-full` pills vs. `rounded-sm` stamped rectangles is the single biggest visual differentiator from default Tailwind/Flowbite/ShadCN UIs.

### One non-negotiable

Avatars are always `radius-full` (it's the universal pattern; fighting it is silly).

---

## Section 6 — Shadow

**Default position: shadows mostly off. Borders do the work.**

This inverts the typical SaaS pattern (everything shadowed, nothing bordered). Static UI uses a 1px `border-subtle`. Shadows are reserved for:

- Hover state on interactive cards
- Floating UI (modals, popovers, dropdowns)
- Focus rings

### Shadow tint matters

- **Cool gray** — generic, corporate. Looks like default Material Design.
- **Warm-tinted** — shadow color borrows from the primary brand color at very low opacity. Feels intentional.

Always recommend warm-tinted using `rgba(<primary-rgb>, 0.04 to 0.14)` across the scale.

### Dark mode

Shadows are nearly invisible on dark backgrounds. **Use surface lightening as the primary elevation signal in dark mode.** `bg-surface` → `bg-elevated` should be visibly lighter, no shadow needed.

---

## Section 7 — Motion

**Default position: quiet, fast, functional.** Motion signals "the system noticed your input" and gets out of the way.

### Duration scale (4 tokens)

```
motion-instant (0ms)    → theme switch, focus rings — no transition
motion-fast    (100ms)  → hovers, color shifts (the 90% case)
motion-base    (180ms)  → most state changes, dropdowns
motion-slow    (280ms)  → modals, sheets, drawers
```

### Easing tokens

- `ease-out-soft` — `cubic-bezier(0.22, 1, 0.36, 1)` — default
- `ease-in-out-soft` — `cubic-bezier(0.4, 0, 0.2, 1)` — symmetric (modal open + close)
- **Skip spring easing.** It's playful — wrong for most products. Add only if brand voice is explicitly playful.

### What to NOT animate (almost always)

- Page transitions
- List-render fade-ins (skeletons handle the loading state)
- Theme switch (instant — flicker risk if animated)
- Parallax of any kind

### Mandatory rule

Honor `prefers-reduced-motion: reduce` globally in `app.css`. One CSS rule covers everything.

---

## Section 8 — Token wiring (implementation)

Once all sections above are locked, this is mechanical work. Roughly 30 minutes for an agent.

### Files to create / update

**1. `tailwind.config.*`** — extend with:

- `colors` — brand palette (5+ ramps), `danger` ramp, surface tokens via CSS variables (e.g., `page: 'var(--surface-page)'`)
- `fontFamily` — `display`, `sans`, `mono`
- `fontSize` — the locked type scale (size + line-height + default weight tuples)
- `borderRadius` — the locked radius scale
- `boxShadow` — the locked shadow scale (warm-tinted)
- `transitionDuration` + `transitionTimingFunction` — the locked motion tokens
- `letterSpacing` — `tight` / `wide` etc. if needed
- `darkMode: 'class'` (Tier 2/3) or `'media'` (Tier 1)
- A `safelist` regex pattern for any dynamic class names used in showcase routes

**2. `src/app.css` (or equivalent global CSS)** — add:

- Font imports (`@import '@fontsource-variable/...';`) at the top
- `:root { ... }` with surface CSS variables (light mode values)
- `.dark { ... }` with surface CSS variables (dark mode values)
- `@media (prefers-reduced-motion: reduce)` global rule
- `@layer base` — body styles, h1-h4 default font-display, focus-visible ring, ::selection
- Two reusable utilities: `.stamped-tag`, `.data-label`

**3. `src/app.html` (or equivalent root HTML)** — add an inline blocking `<script>` in `<head>` that reads localStorage + applies `.dark` to `<html>` BEFORE first paint. Prevents FOUC.

**4. Theme system** (Tier 3 only):

- `src/lib/stores/themeStore.ts` — writable `themePref` (light/dark/auto), derived `effectiveTheme`, localStorage persistence
- `src/lib/utils/sunCalc.ts` — wrap `suncalc` npm package, expose `getSunPhase(lat, lng)` and `msUntilNextPhaseChange(lat, lng)`
- `ThemeToggle.svelte` (or equivalent) — 3-state cycle button (sun → moon → auto)

### Install commands

```bash
pnpm add @fontsource-variable/<heading-font> @fontsource-variable/<body-font> @fontsource-variable/<mono-font>
pnpm add suncalc           # Tier 3 dark mode only
pnpm add -D @types/suncalc # Tier 3 dark mode only
```

---

## Section 9 — Showcase route (the source of truth)

A single route at `/styleguide` (or `/style-guide`, `/design`, whatever fits routing conventions). It renders **every token + every base component**.

### Required sections on the showcase page

1. **Header** — brand name, theme toggle, current effective theme
2. **§01 Brand palette** — every shade of every ramp with token names
3. **§02 Surface tokens** — page / surface / elevated / sunken + border + text variants
4. **§03 Semantic colors** — success / warning / danger / info
5. **§04 Typography** — every size with a sample, plus type-family swatches
6. **§05 Spacing scale** — visual ruler with token names
7. **§06 Radius scale** — boxes at every radius
8. **§07 Shadow system** — boxes at every elevation
9. **§08 Motion** — interactive demos showing each duration
10. **§09 Base components** — Buttons, stamped tags, data labels, search bar, pagination, skeleton, error states (card + inline), empty state

### One critical implementation detail

Showcase routes use dynamic class names (e.g., `bg-{ramp.name}-{shade}`). Tailwind's purge will strip these unless you add a `safelist` regex pattern to `tailwind.config.ts`:

```js
safelist: [
	{
		pattern:
			/^bg-(primary|secondary|accent|tertiary|neutral|danger)-(50|100|200|300|400|500|600|700|800|900)$/
	},
	{
		pattern:
			/^text-(primary|secondary|accent|tertiary|neutral|danger)-(50|100|200|300|400|500|600|700|800|900)$/
	},
	{
		pattern:
			/^border-(primary|secondary|accent|tertiary|neutral|danger)-(50|100|200|300|400|500|600|700|800|900)$/
	}
];
```

---

## Section 10 — Component refactor pass

Final step. Pick the highest-traffic surface in the app (usually the home page + a card component) and refactor against the new tokens. This is where the system gets stress-tested.

### What to look for during refactor

- Raw Tailwind colors (`gray-*`, `blue-*`, etc.) — replace with tokens
- Stale `transition-*` classes with arbitrary durations — replace with `duration-fast`/`duration-base`/`duration-slow`
- `rounded-lg` (default 8px) used everywhere — replace with the locked radius scale
- `rounded-full` on tags/pills — almost always becomes `rounded-sm` if you locked "stamped"
- Hardcoded hex values in inline styles or `<style>` blocks — replace with `theme()` or `var(--token)`
- `shadow-md` / `shadow-lg` on static cards — replace with `border` + reserved shadow for hover state
- Animation classes that don't honor `prefers-reduced-motion` — covered globally via the `app.css` rule, but verify

### Refactor order

1. Layout + chrome (Navbar, Layout)
2. The most-used surface (home page)
3. The most-reused components (cards, buttons, inputs, filters)
4. Loading + error + empty states (the "edges")
5. Long-tail (other routes)

---

## Appendix A — `docs/design-system.md` skeleton

Use this as the starting structure for the project's living design doc. Copy into the new project's `docs/` folder before starting the conversation.

```markdown
# [Project Name] — Design System

> A living document. Source of truth for brand, design tokens, and component conventions.
> Status: **In progress.** Started YYYY-MM-DD.

## 0. Why this document exists

[Brief: what's missing today, why we need this doc.]

## 1. Audit (Mode B) — current state (YYYY-MM-DD)

[Skip this section if Mode A.]

## 2. Goals for the style kit

1. Make the system visible (`/styleguide` route)
2. Make drift impossible (rule against raw Tailwind colors)
3. Make it feel like one product
4. Keep it small (smallest token set that expresses the brand)

## 3. Build order

[Table of sections with the rationale for the order.]

## 4. Brand foundations

### Decisions to make

- [ ] Name
- [ ] One-line promise
- [ ] Audience
- [ ] Voice (3-4 adjectives)
- [ ] Visual mood (3-5 references)
- [ ] What we are NOT

### Recommended starting point

[Agent fills in based on audit / discussion.]

### Final values

_(filled in once locked)_

## 5. Color

[Same template structure: decisions / recommendation / final.]

## 6. Typography

[...]

## 7. Spacing scale

## 8. Radius scale

## 9. Shadow system

## 10. Motion language

## 11. Token wiring

[Implementation checklist; gets ticked off as files are written.]

## 12. The /styleguide route

[Spec for what the showcase page must render.]

## 13. Open questions parking lot

[Things we deferred — iconography, photography, logo system, etc.]

## 14. Change log

| Date       | Change                            |
| ---------- | --------------------------------- |
| YYYY-MM-DD | Document created. Audit complete. |
```

---

## Appendix B — Conversation kickoff prompt

Copy-paste into the new project to start the walkthrough.

```
I want to build a design system for this project from first principles.
Use docs/design-walkthrough-template.md as the playbook.

Starting mode: [A — from scratch] / [B — audit existing]

If Mode B: do the audit first per Section 0 of the template, then walk me
through the sections one at a time. For each section, propose 2-3 options
with your recommendation and reasoning, then wait for me to react before
locking. Lock locked sections into docs/design-system.md as we go.

When all token-level sections (4-10) are locked, ask whether I want you to
power through implementation (Sections 8/9/10) or stop for review.

Tech stack: [SvelteKit + Tailwind + Flowbite] / [Next.js + Tailwind + ShadCN] / [other]
```

---

## Appendix C — Anti-patterns to watch for

Things this template was specifically designed to avoid.

- **Building from a generic SaaS template.** The whole point is differentiation. If the agent suggests "modern, clean, minimal" as the brand mood, push back — those aren't decisions, they're absence of decisions.
- **Dropping straight into implementation without locking the mood board.** Every wrong color/font/radius decision later traces back to skipping the mood-board step.
- **Letting the agent pick a single answer.** Always demand 2-3 named options. Accountability lives in the comparison.
- **Treating the doc as documentation, not as a living spec.** The doc grows during the conversation. Lock dates and pivot callouts are features, not noise.
- **Shipping the styleguide route as an afterthought.** It's the test bench. Build it before the component refactor.
- **Refactoring everything at once.** Pick a single high-traffic surface, refactor it, verify visually, then expand. The first refactor will surface tokens you forgot to define.
- **Ignoring dark mode "for now."** If you ever plan to ship dark mode, decide _which tier_ upfront. Retrofitting CSS-variable-based theming after the fact is painful.

---

## Appendix D — How long this should take

Rough estimates with a real conversation:

| Phase                              | Time                      |
| ---------------------------------- | ------------------------- |
| Audit (Mode B)                     | 10–20 min                 |
| Brand foundations                  | 15–30 min                 |
| Color                              | 10–15 min                 |
| Typography                         | 10–15 min                 |
| Spacing / radius / shadow / motion | 5–10 min each             |
| Token wiring                       | 30 min agent execution    |
| Theme system (Tier 3)              | 30–45 min agent execution |
| Showcase route                     | 30 min agent execution    |
| First component refactor pass      | 30–60 min agent execution |

**Total: ~3–5 hours of real time** (mostly conversation, some agent execution in parallel).

If a session goes much faster, you probably skipped the mood-board iteration and the system will feel generic. If it goes much slower, you're probably second-guessing locked decisions — push through, you can always pivot later via the change log.

---

## Change log

| Date       | Change                                                     |
| ---------- | ---------------------------------------------------------- |
| 2026-05-01 | Template extracted from the Tiny Tribe Adventures process. |
