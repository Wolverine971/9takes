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
- Dossier body is 18px but ~90ch (`.breakdown-inner` 880px). Worse: its paragraphs were actually **16px** — the global `p { font-size: 1rem }` in `index.scss` overrides the container's inherited 18px (direct rules beat inheritance). Same on pop-culture.

68ch is the difference between "blog" and "publication." Highest-ROI typography fix remaining.

**Status: ✅ FIXED 2026-06-09** — `--prose-measure` token added; applied to `.blog`, dossier `.article-body`, pop-culture `.article-content` (all centered). Bodies lifted to a true 18px (`font-size: inherit` on direct `p` rules to defeat the global pin); sub-16px mobile paragraph overrides removed. Tuned 68ch → 75ch after review: DJ found 68ch too tight on desktop.

### 🟠 High — Spec-vs-code schism on two locked rules

- **Amber h1 never fires.** `design-system.md` §6 locks h1 = `--lamp-glow` once per page; every audited surface renders h1 in `--ink-bright`. Decide and ratify one side (ink-bright h1 + amber kickers may be the better look — if so, amend the doc).
- **Body color is three values across four blog sections:** `--ink-mid` (community, guides), legacy `--neutral-700` (pop-culture), `--ink-bright` (dossier). The doc contradicts itself (§5 table: body = ink-mid; §6: body = ink-bright). Recommend `--ink-bright` body, `--ink-mid` captions.

**Status: ✅ FIXED 2026-06-09** — both rules ratified in `design-system.md` (§5 ink table + §6 color rules + changelog):

- **h1 = `--ink-bright`** (code side ratified, spec amended). The amber brand moment is the mono kicker, not the h1. No code change needed — production was already uniform.
- **Body = `--ink-bright`** everywhere; `--ink-mid` reserved for captions/metadata/secondary voice (blockquotes keep `--ink-mid` deliberately). Swept: community + how-to-guides (`.blog` was `--ink-mid`), enneagram-corner (`.article-body` was `--ink-mid`), pop-culture (root, `.article-content`, `p`, `ul/ol` were legacy `--neutral-700`). Dossier was already correct. Mental-health resource-card captions stay `--ink-mid` (correct usage; top-traffic page kept light-touch).

### 🟡 Medium — Retired teal still haunts the codebase: 107 references

`rgba(45,212,191,…)` / `#2DD4BF` (the OLD primary, not sanctioned `--data-teal` #0D9488) survives in:

- `--glass-border` (tints the **site header's** bottom border teal — `index.scss:226`), `--accent-rgb` (`index.scss:53`)
- Pull-quote gradients (`blog.scss:251`), key-stat borders (:290), contrast panels (:462), table zebra stripes (:988)
- Callouts: `QuickAnswer`, `InsightBox`, `Checklist`, `TypeQuotes`, `VisualMetaphor`
- Pop-culture related cards + join box, the primary spinner (`components.scss:711`), QR code (`[slug]/+page.svelte:233`)

One grep-driven sweep fixes all of it.

**Status: ✅ FIXED 2026-06-10** — full sweep across ~35 files. Data/stat moments (key-stat, HornevianMatrix, StatCard, corpus-stats, EnneagramDiagram) tokenized to the sanctioned `--data-teal` family; everything decorative/brand (callout borders, pull-quote gradients, glows, hovers, scrollbars, search highlights, signup boxes, QR code, primary spinner, `--glass-border`, `--accent-rgb`) moved to lamp/stone tokens. Remaining matches in `src/`: zero, except the exempt print/poster asset skins (`questionPrintBackgrounds.ts`, poster-generator) and explanatory comments. Styleguide swatches updated to current token values.

### 🟡 Medium — The callout zoo (repetition)

~8 Svelte callouts + ~13 CSS-only furniture classes in `blog.scss` with radii of 4/6/8/10/12/14px (locked: 4/10/16), icons split between stroked SVG and raw emoji (💭 ℹ️ 🐇), static boxes carrying drop shadows. Three competing "related posts" patterns when listing pages already define the canonical card. Consolidate onto one `Callout` base (one radius, one left-accent, mono kicker label) + tone variants.

**Status: ✅ ALIGNED 2026-06-10** — all callouts + furniture normalized to one visual language: radii on the locked scale (boxes 10px, large CTAs 16px, badges 4px, true pills full), static container shadows removed (borders are the elevation; hover/focus shadows kept on interactive elements), colors tokenized (teal→lamp or data-teal by role, greens→`--success`, dialogue rose→`--data-cyan`). _Structural_ consolidation into a single `<Callout>` base component remains future work (API refactor, not a style fix); emoji→SVG icon unification deferred with it.

**Status: ✅ CONSOLIDATED 2026-06-11** — structural work done:

- New base: `src/lib/components/blog/callouts/Callout.svelte` — one shell (10px radius, 1px tone border, 4px left accent, **mono kicker label** in the system voice, shared prose styles) with tones `lamp / success / warning / error / data / neutral` mapped to the V5 palette.
- Six informational callouts now render through it with unchanged public props: `QuickAnswer` (keeps schema.org Question/Answer markup), `InsightBox` (tone map: info→lamp), `Checklist` (title→kicker label; checkmark now dark-on-amber per CTA contrast rule), `TypeQuotes` (title→kicker; bare `minimal` variant kept), `VisualMetaphor` (floating icon disc kept as signature), `CorpusStatCallout` (**tone=data** — was an off-palette orange `--shadow-flame`; stats are data moments, now `--data-teal`).
- `BookSessionCTA` / `EnneagramTypingFlow` intentionally NOT converted — they're conversion banners, a different category.
- Emoji→SVG: the three `blog.scss` furniture emoji (💭 inner-thought, ℹ️ aside-box, 🐇 rabbit-hole) replaced with stroked-SVG CSS masks tinted by tokens.

### 🟡 Medium — Radius drift hides in scoped SCSS

`pnpm lint:radius` only catches Tailwind classes. Raw CSS carries 6/8/12px, 0.5rem, 0.95rem, 1.2rem, 1.35rem across Header, Footer, MobileNav, homepage cards, QuestionContent. Cards split between an 8px and the locked 16px language. Extend the lint to style blocks.

**Status: ✅ FIXED 2026-06-10** — two-part fix:

1. **Root cause**: the legacy `--border-radius` token was itself 8px and `--border-radius-lg` was 12px — every consumer was off-scale by inheritance. Retoken'd to 10px/16px (one edit fixed dozens of call sites). Named offenders hand-fixed: Header (Library button/menu/items, account button), Footer social buttons, MobileNav buttons/CTAs, homepage cards (8px→16px cards, take/library/primer), questions index note box, question slug panels (12px→16px).
2. **Lint extended with a ratchet**: `lint-radius.js` now scans raw `border-radius:` declarations in svelte/scss/css (allowed: 4/10/16px + rem twins, 0, pills, `var()`/`calc()`-derived; print/email/social-asset dirs exempt). Backlog measured at **527** and ratcheted — the build fails if the count rises; lower `CSS_RATCHET_BASELINE` as files get fixed.

**Status: ✅ BURNED DOWN 2026-06-11** — the full 527-declaration backlog is fixed: ~272 in admin routes, ~106 in user-facing routes, ~150 in `src/lib` + shared SCSS (incl. the widely-used `dark-card`/`dark-input` mixins), plus the styleguide/`index.scss` stragglers. Role-based mapping throughout (chips/inputs→10px, cards/panels→16px, pill-intent→9999px, hairlines→4px or sharp). Lint tokenizer fixed for nested `calc(var() - X)`. **`CSS_RATCHET_BASELINE` is now 0 — raw CSS radii are fully enforced**, same as the class lint.

### 🟡 Medium — Header cluster

- "Library" nav button: permanent `0 10px 24px` shadow + hover lift (elevation-rule violation) and visually **heavier than the Log in CTA** — emphasis inversion in primary nav (`Header.svelte:246-297`).
- JS-driven responsive branching (`innerWidth < 900`, SSR default 1200) → mobile users get desktop markup that swaps after hydration (CLS). Same pattern in `QuestionDisplay`'s 9-breakpoint JS font-size table — should be `clamp()`.
- Nav labels disagree with footer for same destinations ("Questions" vs "Question List", "9takes Opinions" vs "The Takes of 9takes"). Footer links `/blog`, absent from header.

**Status: ✅ FIXED 2026-06-10** —

- Library button flattened: no static shadow/inset/hover-lift, 1px stone-edge border, locked 10px radius, solid surface — it now sits below the Log in CTA in visual weight. Library menu is proper floating UI: solid `--stone-warm`, `var(--shadow-lg)`, 16px radius, no backdrop blur/gradients.
- Header responsive switch moved from JS (`innerWidth < 900`, SSR default 1200) to CSS media queries — both layouts render, CSS picks one, so SSR HTML is correct at every width (no hydration swap/CLS). `QuestionDisplay`'s 9-breakpoint JS font table became length-tiered CSS `clamp()` — same endpoints, SSR-correct.
- One label per destination, shared header/footer: "Questions", "The Takes of 9takes", "Enneagram Corner", "Pop Culture", "Personality Analysis"; header Library gained "How-to Guides" (was footer-only). Footer blurb swapped to the locked brand one-liner.

### 🟡 Medium — Token-drift sweep results (quantified)

| Category                                 | Count    | Status                                                               |
| ---------------------------------------- | -------- | -------------------------------------------------------------------- |
| V5 token references                      | 4,533    | ✅ excellent                                                         |
| Raw hex in classes (`bg-[#…]`)           | 0        | ✅                                                                   |
| Banned Tailwind radii                    | 0 active | ✅                                                                   |
| Raw color-name classes (gray/red/blue/…) | 47       | 🟡 worst: `BlogDiffViewer` (15), `Comment` (13), `ErrorBoundary` (8) |
| Arbitrary shadows (`shadow-[0_0…]`)      | 3        | 🟡 `SmallPopCard` ×2, `ErrorBoundary`                                |
| Off-scale spacing (`p-5`)                | 8        | 🟡                                                                   |
| Retired fonts (Noticia)                  | 8        | 🟢 all in asset generators (intentional)                             |
| Rose/purple as UI chrome                 | ~10      | ✅ confined to data viz / admin                                      |

**Status: ✅ FIXED 2026-06-10** — all 47 raw color-name classes mapped to semantic ramps/tokens (`BlogDiffViewer` → success/error/warning/neutral ramps; `ErrorBoundary` → error tokens, arbitrary glow removed; `CategoryTree`/`MetadataSidebar`/`ContentEditorModal`/`WordCloud`/enneagram-test → ink/lamp/stone vars). 3 arbitrary shadows → `var(--glow-sm/md)` or removed. `p-5` → `p-lg` (both sites). Verification greps clean.

### 🟢 Smaller items

- ~~§ numbering skips §05 on listing pages~~ ✅ 2026-06-10 — `FAQSection` gained a `num` prop rendering the standard `SectionKicker` (replaces its old "?" icon badge when set); community / how-to-guides / enneagram-corner pass `num="05"`. The §01–§06 sequence is now unbroken.
- ~~`EnneagramTypeDossier` on the wrong surface~~ ✅ 2026-06-10 — `/personality-analysis/[slug]` now renders the type dossier panel (from `enneagramTypeProfiles`) after the article body, introduced by a `tone="data"` kicker (`TYPE DOSSIER · <TYPE NAME>`), with a CTA bridging to the enneagram-corner type pillar. The dossier surface finally has dossier density — and a new internal link to the pillar on every analysis.
- ~~Glows on static connector lines; false-affordance stat hovers~~ ✅ 2026-06-10 — three `box-shadow: 0 0 1Npx amber` removed from decorative `::before/::after` lines; `.compiled-stat` hover border removed (non-clickable).
- ~~`.display-xl`/`.display-md`/`.mono` copy-pasted~~ ✅ 2026-06-10 — promoted to global utilities in `index.scss` (V5 type scale); the three identical route copies removed. Other pages' local copies are redundant-but-identical and can be deleted opportunistically.
- ~~Footer brand blurb~~ ✅ 2026-06-10 — swapped for the locked one-liner ("See the emotions behind every take. One situation, nine ways to see it.").
- ~~`MobileNavNew.svelte` legacy bridge tokens~~ ✅ 2026-06-10 — `--card-background`→`--stone-warm`, `--light-gray`→`--stone-mid`, `--lightest-gray`→`--night-mid`. Phase-7 token deletion no longer breaks it.
- ~~Junk markup in article templates~~ ✅ 2026-06-10 — `align-items: inherit` divs stripped; `<hr style="margin: 5rem;">` → a proper `.section-divider` (prose-width 1px stone-edge rule) in community + how-to-guides.
- ~~Question detail: dead "Visuals" tab / "Removed Comments" equal billing~~ ✅ 2026-06-10 — Visuals tab deleted (was permanently empty); Removed Comments demoted from tab to a quiet `<details>` disclosure at the bottom of the thread (renders only when removed comments exist). Tabs are now Comments · Articles.
- ~~Mobile library grid 3-across~~ ✅ 2026-06-10 — 2-across under 640px; names 12.5px→15px, subtitles 10.5px→12px.
- ~~Five listing pages are ~1,000-line near-clones~~ ✅ 2026-06-10 — extracted `marketing/CaseCard.svelte`, `marketing/CaseGrid.svelte`, `marketing/IndexHero.svelte` (607 lines total, one source of truth) and converted all five pages: **−2,308 net lines** (343 added, 2,651 deleted). CaseCard carries the type-stripe hook (`stripe` prop → PA passes `var(--type-N-color)`), featured variant, recency/date meta, and the mobile tightening; IndexHero carries grain/pool/scale-marker/statue + optional `meta` snippet (enneagram-corner's Published/Updated row). Documented exceptions kept local: pop-culture + how-to-guides single-featured 880px wrappers (server returns 1 card; `columns={2}` would half-width it) and enneagram-corner's fixed 3×3 nine-types `.topic-grid`. PA grids use `columns={3}` (fixed 3-up, matching its original portrait layout).

---

## Do more of / do less of

**More:** type-color as data (especially comments/answers/test results) · mono dossier vocabulary extended into the thread (`TAKE №04 · TYPE 8`) · atoms (`CaseCard`, `Callout`, `Icon`, the missing `/styleguide` route) · density on dossier bodies (actual stat panels).

**Less:** glass-morphism and glows (every backdrop-blur deleted makes the chiaroscuro stronger) · hand-rolled one-off buttons/badges bypassing the atom (where every contrast bug lives) · per-route redefinition of system-level styles · spec rules nobody follows (enforce or amend).

---

## Priority order

1. ~~Un-letterbox the content routes (`+layout.svelte:47`)~~ ✅ 2026-06-09
2. ~~V5 pass on the question thread + type-stripe comments~~ ✅ 2026-06-09
3. ~~Prose measure: `--prose-measure: 68ch` token → `.blog`, `.article-body`, pop-culture `.article-content`; lift bodies to 18px; kill sub-16px mobile paragraphs~~ ✅ 2026-06-09
4. ~~Ratify the two contested rules (h1 amber, body color) in `design-system.md`, then sweep~~ ✅ 2026-06-09
5. ~~Grep sweep: 107 retired-teal refs + 47 raw color classes + 3 arbitrary shadows~~ ✅ 2026-06-10
6. ~~Callout zoo visual alignment; `lint:radius` extended to scoped styles (ratchet at 527)~~ ✅ 2026-06-10 — _remaining_: structural `<Callout>` base component, emoji→SVG icons, burn down the 527 radius backlog.
