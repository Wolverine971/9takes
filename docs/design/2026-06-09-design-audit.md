<!-- docs/design/2026-06-09-design-audit.md -->

# 9takes Design Audit — Streetlamp Symposium V5

> **Date:** 2026-06-09
> **Scope:** Full design-principle audit of production styles vs. the locked spec in `docs/design-system.md` (Streetlamp Symposium · sodium-amber · Inter + JetBrains Mono · borders-over-shadows).
> **Method:** Token-drift sweep across `src/`, designer-grade review of core surfaces (home, header/footer, questions index + detail, enneagram test) and content surfaces (all five blog sections, dossier pages, callouts), verified against `src/scss/index.scss`, `tailwind.config.ts`, and `src/routes/+layout.svelte`.

---

## Verdict

**A genuinely good design system on paper; a B- execution in production.** The V5 spec is distinctive, coherent, and right for the brand — it avoids both generic-SaaS and mystical-cosplay failure modes. The token migration is largely real: **4,533 V5 token references, 0 raw hex in classes, 0 banned Tailwind radii.** But three structural problems quietly undo the work:

1. The best layouts never render at the size they were designed for (root-layout letterboxing).
2. The most important product surface — the question thread — still wears the old design system.
3. The spec's signature moves (amber h1, type-colored takes) don't actually fire anywhere.

---

## What's going well

1. **The brand mood is right and it's ownable.** Amber-pool-against-dark-stone with mono dossier annotations is a real point of view. No competitor in the personality space looks like this. The `§NN · LABEL` kicker system, case-file framing, and type-color stripes are ownable visual vocabulary.

2. **Color theory fundamentals are sound.** Amber `#F59E0B` against warm near-black `#0a0807` is a high-contrast complementary-temperature pairing that reads as "illumination" — metaphor and palette agree. Teal demoted to a data accent was correct; warm primary + cool data accent is a classic editorial split. The warm-stone neutral ramp (brown undertone, not blue-gray) keeps the dark mode from feeling like every other dark mode.

3. **Repetition/rhythm on listing surfaces is excellent.** All five content indexes (community, enneagram-corner, pop-culture, how-to-guides, personality-analysis) share one card grammar: kicker → display heading → alternating `--night-deep`/`--night-mid` bands → `--stone-warm` cards with 1px `--stone-edge` borders and identical hover behavior. Textbook unity.

4. **Elevation philosophy is disciplined.** "Borders do the work, shadows only for floating UI" is mostly followed. The `<Button>` atom is correct (dark text on amber — passes contrast where most amber-button sites fail). The dossier header on `/personality-analysis/[slug]` is a true variant: type-colored stripe, deterministic file numbers, corner brackets, mono coordinates.

5. **Accessibility infrastructure exists.** Global `prefers-reduced-motion` guard, `prefers-contrast: high` support, `:focus-visible` rings, iOS zoom guard, and the 2026-05-29 `--ink-dim` lightening (`#5C4F47` → `#948578`) shows ratios are being checked.

---

## Findings

### 🔴 Critical 1 — The design renders letterboxed (proportion/balance, root cause)

`src/routes/+layout.svelte:47` exempts only `/`, `/content-board`, `/book-session`, `/search` from a `max-w-4xl` (896px) clamp. Every other page — including all five content listing pages whose SCSS defines 1280px heroes and 4-column grids — is squeezed into 896px:

- The 4-column case grid collapses to 2 columns.
- The full-bleed alternating band rhythm (the core chiaroscuro composition) renders as a floating strip with page background leaking around it.
- ~5,000 lines of layout SCSS describe a design users never see.

**Fix:** exempt the five content listing routes (their SCSS already defines its own 1280px inner max-widths). Keep detail/article pages clamped — they need the measure.
**Status: ✅ FIXED 2026-06-09** — listing routes added to `MAX_WIDTH_PAGES`.

### 🔴 Critical 2 — The question thread is two design systems in one viewport (unity)

The Q&A is the product, and it's the least-migrated surface. V5 chrome (case-file coordinates, amber top border) wraps a legacy glass-morphism comment shell:

- `border-radius: 1.35rem` (off-scale), permanent shadows on static containers, `backdrop-filter: blur(14px)`, gradient washes — `QuestionContent.svelte:343-357`
- Leftover **teal radial** — `QuestionDisplay.svelte:163`
- `[slug]/+page.svelte:1076-1096` patches it with brittle `:global()` overrides instead of migrating the components.
- Hand-rolled white-on-amber buttons in `Comment.svelte` (:385 type badge, :539 reply submit, :663 edit save) ≈ 2.2:1 contrast — hard WCAG failure, contradicts the Button atom's dark-on-amber rule.
- Banned raw `red-*` / `blue-*` classes for flag/delete actions instead of `--error`/`--info` tokens.

**Status: ✅ FIXED 2026-06-09** — glass shell flattened to V5 (1px stone-edge, 16px radius, no blur/gradient/static shadow), teal radial removed, white-on-amber → dark-on-amber.

### 🔴 Critical 3 — The 9-type payoff is invisible in the product (emphasis)

Marketing surfaces stripe everything by Enneagram type color, but actual comments — the literal "9 takes" — render every type as an identical amber badge (`Comment.svelte:382-396`). The core promise ("see how different types see this differently") has no visual expression where the product makes its argument. **Single highest-leverage design change available.**

**Status: ✅ FIXED 2026-06-09** — comments now carry a type-colored left stripe + type-tinted badge driven by `--type-N-color` tokens.

### 🟠 High — No reading measure anywhere (typography)

Spec: 18px/1.55 at ~68ch. Reality:

- MDsvex articles have **no max-width** in `blog.scss` → ~100ch at 16px; mobile paragraphs drop to 14.4px (`blog.scss:1165`).
- Dossier body is 18px but ~90ch (`.breakdown-inner` 880px).

68ch is the difference between "blog" and "publication." Highest-ROI typography fix remaining.

### 🟠 High — Spec-vs-code schism on two locked rules

- **Amber h1 never fires.** `design-system.md` §6 locks h1 = `--lamp-glow` once per page; every audited surface renders h1 in `--ink-bright`. Decide and ratify one side (ink-bright h1 + amber kickers may be the better look — if so, amend the doc).
- **Body color is three values across four blog sections:** `--ink-mid` (community, guides), legacy `--neutral-700` (pop-culture), `--ink-bright` (dossier). The doc contradicts itself (§5 table: body = ink-mid; §6: body = ink-bright). Recommend `--ink-bright` body, `--ink-mid` captions.

### 🟡 Medium — Retired teal still haunts the codebase: 107 references

`rgba(45,212,191,…)` / `#2DD4BF` (the OLD primary, not sanctioned `--data-teal` #0D9488) survives in:

- `--glass-border` (tints the **site header's** bottom border teal — `index.scss:226`), `--accent-rgb` (`index.scss:53`)
- Pull-quote gradients (`blog.scss:251`), key-stat borders (:290), contrast panels (:462), table zebra stripes (:988)
- Callouts: `QuickAnswer`, `InsightBox`, `Checklist`, `TypeQuotes`, `VisualMetaphor`
- Pop-culture related cards + join box, the primary spinner (`components.scss:711`), QR code (`[slug]/+page.svelte:233`)

One grep-driven sweep fixes all of it.

### 🟡 Medium — The callout zoo (repetition)

~8 Svelte callouts + ~13 CSS-only furniture classes in `blog.scss` with radii of 4/6/8/10/12/14px (locked: 4/10/16), icons split between stroked SVG and raw emoji (💭 ℹ️ 🐇), static boxes carrying drop shadows. Three competing "related posts" patterns when listing pages already define the canonical card. Consolidate onto one `Callout` base (one radius, one left-accent, mono kicker label) + tone variants.

### 🟡 Medium — Radius drift hides in scoped SCSS

`pnpm lint:radius` only catches Tailwind classes. Raw CSS carries 6/8/12px, 0.5rem, 0.95rem, 1.2rem, 1.35rem across Header, Footer, MobileNav, homepage cards, QuestionContent. Cards split between an 8px and the locked 16px language. Extend the lint to style blocks.

### 🟡 Medium — Header cluster

- "Library" nav button: permanent `0 10px 24px` shadow + hover lift (elevation-rule violation) and visually **heavier than the Log in CTA** — emphasis inversion in primary nav (`Header.svelte:246-297`).
- JS-driven responsive branching (`innerWidth < 900`, SSR default 1200) → mobile users get desktop markup that swaps after hydration (CLS). Same pattern in `QuestionDisplay`'s 9-breakpoint JS font-size table — should be `clamp()`.
- Nav labels disagree with footer for same destinations ("Questions" vs "Question List", "9takes Opinions" vs "The Takes of 9takes"). Footer links `/blog`, absent from header.

### 🟡 Medium — Token-drift sweep results (quantified)

| Category | Count | Status |
| --- | --- | --- |
| V5 token references | 4,533 | ✅ excellent |
| Raw hex in classes (`bg-[#…]`) | 0 | ✅ |
| Banned Tailwind radii | 0 active | ✅ |
| Raw color-name classes (gray/red/blue/…) | 47 | 🟡 worst: `BlogDiffViewer` (15), `Comment` (13), `ErrorBoundary` (8) |
| Arbitrary shadows (`shadow-[0_0…]`) | 3 | 🟡 `SmallPopCard` ×2, `ErrorBoundary` |
| Off-scale spacing (`p-5`) | 8 | 🟡 |
| Retired fonts (Noticia) | 8 | 🟢 all in asset generators (intentional) |
| Rose/purple as UI chrome | ~10 | ✅ confined to data viz / admin |

### 🟢 Smaller items

- § numbering skips §05 on listing pages — FAQ section has no kicker; in a numbered system a missing number reads as an error.
- `EnneagramTypeDossier` (densest, best dossier component) ships on enneagram-corner, while `/personality-analysis` body is generic prose — the variant's strongest material is on the wrong surface.
- Glows on static decorative connector lines; amber hover-borders on non-clickable stat blocks (false affordance) — homepage.
- `.display-xl`/`.mono` type classes copy-pasted into three route files — promote to global utilities.
- Footer brand blurb is the generic-SaaS voice the brand doc bans — swap for the locked one-liner.
- `MobileNavNew.svelte` consumes legacy bridge tokens scheduled for Phase-7 deletion.
- Junk markup in article templates: `<hr style="margin: 5rem;" />`, `style="align-items: inherit;"`.
- Question detail: dead "Visuals" tab (permanently empty), "Removed Comments" gets equal billing with the thread — cut/demote.
- Mobile library grid: 3-across under 640px at 12.5px names — 2-across would fix legibility.
- Five listing pages are ~1,000-line near-clones; label drift already visible. Extract `CaseCard`/`CaseGrid`/`IndexHero`.

---

## Do more of / do less of

**More:** type-color as data (especially comments/answers/test results) · mono dossier vocabulary extended into the thread (`TAKE №04 · TYPE 8`) · atoms (`CaseCard`, `Callout`, `Icon`, the missing `/styleguide` route) · density on dossier bodies (actual stat panels).

**Less:** glass-morphism and glows (every backdrop-blur deleted makes the chiaroscuro stronger) · hand-rolled one-off buttons/badges bypassing the atom (where every contrast bug lives) · per-route redefinition of system-level styles · spec rules nobody follows (enforce or amend).

---

## Priority order

1. ~~Un-letterbox the content routes (`+layout.svelte:47`)~~ ✅ 2026-06-09
2. ~~V5 pass on the question thread + type-stripe comments~~ ✅ 2026-06-09
3. Prose measure: `--prose-measure: 68ch` token → `.blog`, `.article-body`, `.breakdown-inner`; lift MDsvex body to 18px; kill sub-16px mobile paragraphs.
4. Ratify the two contested rules (h1 amber, body color) in `design-system.md`, then sweep.
5. Grep sweep: 107 retired-teal refs + 47 raw color classes + 3 arbitrary shadows (worst: `Comment.svelte`, `BlogDiffViewer.svelte`, `ErrorBoundary.svelte`, `blog.scss`, callouts).
6. Consolidate the callout zoo; extend `lint:radius` to scoped styles.
