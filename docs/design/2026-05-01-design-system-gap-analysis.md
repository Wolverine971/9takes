<!-- docs/design/2026-05-01-design-system-gap-analysis.md -->

# 9takes Design System — Gap Analysis

**Date:** 2026-05-01
**Scope:** Audit `docs/brand/`, `docs/design/`, `tailwind.config.ts`, `src/scss/`, `src/lib/components/atoms/`, `src/app.html`. Compare against `design-walkthrough-template.md`.
**Companion doc:** `docs/design-system.md` (the unified living spec)

---

## TL;DR

9takes has the **design tokens of a mature system** — a real palette, theme-aware surfaces, working light/dark, locked radius and shadow scales — sitting **underneath documentation that points in three contradictory directions**. The brand-kit doc says one thing, the visual guide says another, the warm-tech plan says a third, and the code shipped a fourth. This is fixable in one decision: **lock the brand mood**.

Three biggest gaps, ranked:

1. 🔴 **No declared brand mood.** Three competing visual identity docs on disk; code drifted into a fourth. Until this locks, every later decision floats.
2. 🔴 **No `/styleguide` route.** There is no place where a contributor (or DJ) can see "what does 9takes look like?" in one screen. This hides drift and prevents canonicalization.
3. 🔴 **Effect addiction holdover from Solo Leveling era.** 6 glow tokens, gradient buttons, drop-shadow on icons, drop-shadow on text. Already flagged in `2026-04-27-ui-audit-kole-jain-8-mistakes.md` §2 — Week 1 Step 1 still open.

Two surprising **strengths** that didn't fit on the surface:

- ✅ The Tailwind/CSS-var palette is already coherent (teal/rose/purple/warm-stone). Most of the work here is **ratifying the de-facto state**, not redesigning.
- ✅ Light + dark mode is **already shipped** (`ThemeToggle.svelte` exists, full `:root.light` overrides in SCSS, FOUC-prevention script in `app.html`). This is harder to retrofit than to lock — credit where due.

---

## The four contradictory directions

### Direction A — "Solo Leveling Shadow Monarch" (per `BRAND-KIT.md`)

| Element          | Value                    |
| ---------------- | ------------------------ |
| Primary          | `#7c3aed` purple         |
| Secondary        | `#3b82f6` blue           |
| Accent           | `#06b6d4` cyan           |
| Background       | `#0a0a0f` void           |
| **Primary font** | **Noticia Text** (serif) |

**Vibe:** dark scholar, void with serif headlines, glowing edges. Two of these decisions (Noticia Text serif + dark void) are mutually rare — most dark-void aesthetics use sans-serif gaming fonts.

### Direction B — "Solo Leveling Awakening" (per `solo-leveling-visual-guide-unified.md`)

| Element           | Value                                         |
| ----------------- | --------------------------------------------- |
| Primary           | `#7c3aed` purple (Monarch)                    |
| Secondary         | `#3b82f6` blue (System)                       |
| Background        | `#05050a` deeper void                         |
| **Primary fonts** | **Rajdhani + Space Grotesk + JetBrains Mono** |

**Vibe:** gaming-coded, glowing system UI, XP bars, quest cards, scanlines, particle floats. Same color story as A but fonts are completely different — sans-serif gaming.

### Direction C — "Warm Tech Spec" (per `warm-tech-theme-plan.md`)

| Element    | Value                                        |
| ---------- | -------------------------------------------- |
| Primary    | `#F59E0B` amber/gold                         |
| Secondary  | `#F43F5E` warm rose                          |
| Accent     | `#EA580C` terracotta                         |
| Background | `#0C0A09` warm stone                         |
| Mood       | psychologist's office, light + dark co-equal |

**Vibe:** Notion + Headspace + Linear + Stripe. Warm illumination, not gaming energy.

### Direction D — What actually ships in `tailwind.config.ts` + `src/scss/index.scss`

| Element           | Value                                                               |
| ----------------- | ------------------------------------------------------------------- |
| Primary           | `#14B8A6` teal (`primary-500`)                                      |
| Secondary         | `#F43F5E` rose (`secondary-500`)                                    |
| Accent            | `#8B5CF6` purple (`accent-500`)                                     |
| Background        | `#0c0a09` warm stone                                                |
| **Primary fonts** | **Rajdhani + Space Grotesk + JetBrains Mono** (same as Direction B) |

**Vibe:** the colors are warm-tech-adjacent (teal not amber, but warm-stone neutrals matching Direction C), and the fonts are gaming-coded (matching Direction B). It's a **chimera** — half Warm Tech color story, half Solo Leveling type. No doc on disk describes it.

### Why this matters

Every decision below loops back to "which of A/B/C/D is the real 9takes?" The honest answer right now is: **D is what users see, but nobody wrote it down.** Direction D + a new typography decision is the cheapest path to coherence — the alternative is repainting the whole product.

---

## Section-by-section audit

### Brand documents

What exists:

- `docs/brand/brand-positioning.md` — strategy, voice, audience. **Solid, locked.**
- `docs/brand/brand-style-guide-v2.md` — voice and copy conventions. **Solid, locked.**
- `docs/brand/dj-communication-guide.md` — how to talk to DJ. **Useful, separate concern.**
- `docs/brand/BRAND-KIT.md` — Direction A (purple primary, Noticia Text serif). **Outdated, contradicts code.**
- `docs/brand/solo-leveling-visual-guide-unified.md` — Direction B (purple + Rajdhani gaming). **Outdated, contradicts code.**
- `docs/brand/9takes-style-guide-for-assets.md` — asset generation reference. **Status unclear, likely Direction-A flavored.**
- `docs/design/warm-tech-theme-plan.md` — Direction C (amber/rose). **Was a plan, never fully shipped — code went teal-not-amber.**
- `docs/design/solo-leveling-*` (5 files) — Direction B variants. **Outdated.**
- `docs/design/2026-04-27-ui-audit-kole-jain-8-mistakes.md` — Kole-framework audit. **Excellent, partial implementation in progress.**
- `docs/design/2026-04-27-mobile-audit.md` — mobile-specific findings. **Worth keeping.**
- `docs/design/admin-style-audit.md` — admin-specific. **Status TBD.**

**Verdict:** Voice/copy docs are gold — leave alone. Visual identity docs are a graveyard of three different products. The unified `docs/design-system.md` should be the new source of truth; old brand-visual docs should get an "ARCHIVED — see design-system.md" header but not be deleted (DJ may want to revisit Direction B for the poster/social asset skin).

### Colors

**In code (Tailwind):** teal primary, rose secondary, purple accent, warm-stone neutrals (5 ramps + brand gold + 4 functional ramps). 50→900 ramps for the main palette, 50/100/500/700 for functional.

**In code (CSS vars):** matches Tailwind. `--bg-base/-deep/-surface/-elevated/-highlight` for both modes. `--text-primary/-secondary/-tertiary/-muted` for both modes. **Light-mode overrides are complete and correct.**

**Drift in code:**

- `--accent-rgb: 45, 212, 191;` — that's teal RGB, but the variable is named accent. Should be `--primary-rgb`.
- Legacy aliases: `--color-theme-purple: var(--primary)` — purple → teal aliasing. Confusing but harmless; flag for cleanup.
- Per `css-drift-audit-2026-04-07.md`: ~100 inline `rgba(45, 212, 191, …)` instances (teal hardcoded), 39 inline `#fff`, two competing near-black overlays (`rgba(12, 10, 9, …)` and `rgba(10, 10, 15, …)`).
- Coaching card hardcodes amber even though `--status-gold` aliases to rose — leftover from the Warm Tech amber proposal.

**What's missing:** no formal documentation of the palette anywhere besides the Tailwind config (`BRAND-KIT.md` documents a different palette entirely). Fixed by `docs/design-system.md` §5.

### Typography

**In code:**

- `tailwind.config.ts:4–6` — `Space Grotesk` (sans), `Rajdhani` (display), `JetBrains Mono` (mono).
- `src/scss/index.scss:187–189` — same three.
- Tailwind typography plugin has its own type scale (h1: 2.25rem, h2: 1.75rem, h3: 1.375rem) that **doesn't match** the SCSS body styles (h1: 2.5rem desktop, 1.75rem mobile; h2: 2rem desktop, 1.5rem mobile).
- `static/fonts/NoticiaText-*.woff2/woff/ttf` files **still on disk** — but no `@font-face` rule references them; Noticia Text is dead in the code despite `BRAND-KIT.md` calling it "primary font."
- `index.scss:432–436` defines a `.noticia-text-regular` class that maps `font-family: var(--font-family) !important` — i.e. it doesn't actually load Noticia Text, it loads Space Grotesk. Pure noise.

**Drift in docs:**

- `BRAND-KIT.md` lines 12, 91–106 — Noticia Text everywhere
- `solo-leveling-visual-guide-unified.md` lines 180–186 — Rajdhani / Space Grotesk / JetBrains Mono
- No documented type scale anywhere

**Verdict:** Typography is the single most contested area. Resolution requires picking the brand mood first (Option A → likely a serif/sans pairing change, Option B → keep Rajdhani+Space Grotesk, Option C → mandate serif).

### Spacing

**In code:** `tailwind.config.ts:127–135` — `xs/sm/md/lg/xl/2xl/3xl` (4/8/12/16/24/32/48px). Reasonable scale.

**Drift:** routes use arbitrary values constantly (`p-3`, `mb-4`, `gap-7`). No ESLint rule against arbitrary spacing. `2026-04-27-ui-audit-kole-jain-8-mistakes.md` §3 flagged this.

**What's missing:** documented usage table per token (when to use `lg` vs `xl`); ESLint rule.

### Radius

✅ **Done.** `sm 4px / md 10px / xl 16px / full`. Lint-enforced via `scripts/lint-radius.js` (`pnpm lint:radius`). Banned classes: `rounded-lg`, `rounded-2xl`, `rounded-3xl`, `rounded-[Npx]`. Documented in audit doc.

Tiny cleanup: `tailwind.config.ts:124` still defines `lg: '0.75rem'` as "DEPRECATED" — could be removed entirely now that lint blocks it.

### Shadow

✅ **Done 2026-04-27.** Kole's recipe applied — soft, neutral, larger blur, low alpha. Theme-aware (CSS-var bound to Tailwind utilities). Documented.

### Motion

**In code:**

- `--transition-base: all 0.2s ease`
- `--transition-glow: all 0.3s ease`
- `--animation-speed: 0.3s`

**What's missing:**

- No documented duration scale (instant / fast / base / slow)
- No documented easing scale (`ease-out-soft`, `ease-in-out-soft`)
- **No global `@media (prefers-reduced-motion: reduce)` rule.** Only one local use in `index.scss:1055–1058` for view-transitions. This is an accessibility gap.
- `@keyframes` for `pulse-glow`, `emerge`, `ring-rotate`, `center-pulse` defined in `solo-leveling-visual-guide-unified.md` but I haven't verified which are actually used in shipping CSS.

### Components

**Atoms folder** (`src/lib/components/atoms/`):

```
BackNavigation.svelte
card.svelte                     // lowercase!
CategoryNavigation.svelte
DateTip.svelte
FloatingParticles.svelte        // decorative leftover from Solo Leveling era
jumbotron.svelte                // lowercase!
LoadingButton.svelte            // canonical button candidate
MarqueeHorizontal.svelte        // decorative, suspicious
Modal2.spec.ts
Modal2.svelte                   // canonical Modal — should be renamed to Modal
PopCard.svelte
PopCardGroup.svelte
Popover.svelte
scribble.svelte                 // decorative, suspicious
Skeleton.svelte                 // pick one
SkeletonLoader.svelte           // pick one
SmallPopCard.svelte
Spinner.svelte
ThemeToggle.svelte              // ✅ shipped, good
```

**Issues:**

- Naming inconsistency: `card.svelte`, `jumbotron.svelte`, `scribble.svelte` are lowercase; everything else is PascalCase.
- Two Skeletons (need to pick one).
- Three PopCards (`PopCard`, `PopCardGroup`, `SmallPopCard`) — need to confirm if all three are legit or duplication.
- `FloatingParticles.svelte`, `MarqueeHorizontal.svelte`, `scribble.svelte` are likely Solo-Leveling-era decorative leftovers — verify reach, probably delete.
- `Modal2.svelte` is canonical but still named `Modal2`. 12 import paths to update.
- **No canonical `<Button>` atom.** `LoadingButton.svelte` is the closest thing; `.btn-primary/.btn-secondary/.btn-outline/.btn-ghost` exist as global CSS classes; route files redefine inline. Per Kole audit Week 2.
- **No canonical `<EmptyState>`, `<ErrorState>`, `<Icon>` atoms.**

**Component sprawl** (per Kole audit, partial):

- ✅ Modal: 3 → 1 (Modal2)
- 🟡 Skeleton: 2 → still 2
- 🟡 Rubix: 2 → still 2 (`rubixDisplay.svelte`, `rubixDisplay2.svelte`)
- 🟡 MobileNav: 2 → still 2 (`MobileNav.svelte` is dead weight per audit)

### Icons

**In code:** 27 hand-rolled SVGs in `src/lib/components/icons/`. Per Kole audit:

- Stroke widths: 1.5, 1.8, 2, 4 (four different values across one library)
- Hardcoded colors: `rubix.svelte` has `stroke="#BE26D7"` 22 times — purple, ignores theme
- Naming: `leftIcon`, `arrowRightIcon`, `commentsIcon`, `CommentXMarkIcon`, `enneagram`, `rubix`, `NO-caseyNeistatCareer.svelte` — chaos
- No tooltip discipline — non-obvious icons (header library dropdown) are unlabeled

**No icon library.** `lucide-svelte` is the recommendation per Kole audit Week 2.

### Imagery

**In code:** good, organized. `static/brand/` has logos + DJ portraits; `static/` has hero imagery (Greek statues, philosopher photos, cyber campfire); `src/lib/images/` has social and content images.

**What's missing:**

- No documented usage rules — when to use `aero` vs `nimbus` vs `oceanic` (8 logo variants exist with no rule)
- Photography direction is split (Greek statues + philosopher gathering + cyber campfire = three different aesthetics)
- Some legacy SVGs in static root (`9-logo.min.svg`, `9logo2.svg`, `number9.svg`) are unreferenced per `BRAND-KIT.md` line 162 — confirm and delete.

### `/styleguide` route

❌ **Does not exist.** This is the highest-ROI thing missing — it would prevent every drift category above from compounding further.

### Light mode

✅ **Shipped, end-to-end working.** `:root.light` overrides in `index.scss:255–325`, `ThemeToggle.svelte` atom, FOUC-prevention script in `app.html`, `darkMode: 'selector'` in Tailwind config. This is a real strength — most projects retrofit this and suffer.

Tier per the template: Tier 2 (system + manual toggle, persisted to localStorage). No sunset-aware auto.

### Effect / glow addiction (the loudest beginner-tell)

Per `2026-04-27-ui-audit-kole-jain-8-mistakes.md` §2 — Week 1 Step 1 still open.

- 6 glow tokens defined: `--glow-sm/-md/-lg/-secondary/-accent/-subtle`
- 2 Tailwind glow utilities: `glow-teal`, `glow-rose`
- Gradient primary buttons in `Comment.svelte:549,676,824` and `/questions/create/+page.svelte:345,395`
- `drop-shadow(0 0 12px var(--primary-glow))` on `QuestionDisplay.svelte:148`
- `filter: drop-shadow(0 0 3px ...)` on `StatCard.svelte` icon variants
- `text-shadow` on `MarqueeHorizontal.svelte` and `PopCardGroup.svelte`

Recommended subtraction: keep `--glow-sm` and `--glow-md` for _one_ hero CTA. Delete the other four glow tokens, the two Tailwind glow utilities, all gradient backgrounds on functional UI, all `filter: drop-shadow` on icons.

---

## Recommended sequence (anchored to existing audit's Week 1–4 plan)

This sequence assumes Direction A (Warm Tech Spec) gets ratified — adjust if Direction B/C wins.

### Phase 0 — Lock the brand mood (this week)

1. DJ picks A / B / C in `docs/design-system.md` §4. **Everything else waits.**
2. Lock §5 Color (mostly ratification of de-facto state).
3. Lock §6 Typography (only path-dependent decision after mood locks).

### Phase 1 — Ship the source of truth (next 1–2 weeks)

4. Build `/styleguide` route per §12 spec. This becomes the test bench for everything else.
5. Migrate brand-visual docs in `docs/brand/` and `docs/design/` to "ARCHIVED" headers; design-system.md becomes the canonical link from `CLAUDE.md`.
6. Strip glow chains per Kole audit Week 1 Step 1 (deferred since 2026-04-27).
7. Delete the four banned glow tokens; cut Tailwind glow utilities.

### Phase 2 — Component canonicalization (weeks 3–4)

8. Build canonical `<Button>` atom (replaces `LoadingButton` + inline gradient buttons).
9. Adopt `lucide-svelte`. Replace 27 hand-rolled icons one route at a time.
10. Pick one Skeleton, one Rubix, one MobileNav. Delete the others.
11. Rename `Modal2.svelte` → `Modal.svelte` (12 import-path updates).
12. Build `<EmptyState>` and `<ErrorState>` atoms. Wire into search routes.

### Phase 3 — Lock motion + spacing (weeks 5–6)

13. Lock §10 Motion duration + easing tokens.
14. Add global `@media (prefers-reduced-motion: reduce)` rule.
15. Add ESLint rule banning arbitrary Tailwind values (`p-[Npx]`, `gap-[N]`, `bg-[#...]`).
16. Mobile spacing pass at 375px (per Kole audit §3).

### Phase 4 — Polish (week 7+)

17. Chart de-decoration per Kole audit §8.
18. Photography direction lock.
19. Logo variant rules.
20. Save → badge-dot pattern for nav per Kole audit §7.

---

## What this audit does NOT cover

- **Accessibility** beyond reduced-motion (color contrast WCAG sweep is a separate audit).
- **Performance** of the icon migration (bundle-size delta from 27 .svelte files → tree-shaken Lucide).
- **Brand voice / copy** — already locked in `docs/brand/brand-positioning.md` + `brand-style-guide-v2.md`. Untouched here.
- **Specific route audits** — homepage, /personality-analysis, /questions need their own walkthrough passes after the styleguide ships.
- **Email template visual identity** — `src/lib/email/` is its own design surface and was excluded from this scope.
- **Admin panel visual identity** — `docs/design/admin-style-audit.md` exists as a separate audit.

---

## Files referenced

- `docs/design-system.md` — companion living spec
- `docs/brand/brand-positioning.md`, `brand-style-guide-v2.md`, `BRAND-KIT.md`, `dj-communication-guide.md`
- `docs/brand/solo-leveling-visual-guide-unified.md` (and 4 other solo-leveling-\* variants in `docs/design/`)
- `docs/design/warm-tech-theme-plan.md`
- `docs/design/2026-04-27-ui-audit-kole-jain-8-mistakes.md`
- `docs/design/2026-04-27-mobile-audit.md`
- `docs/css-drift-audit-2026-04-07.md`
- `tailwind.config.ts`
- `src/scss/index.scss`, `components.scss`, `_mixins.scss`
- `src/app.html`
- `src/lib/components/atoms/`
