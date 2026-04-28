<!-- docs/design/2026-04-27-mobile-audit.md -->

# 9takes Mobile Audit — Complete Pass

**Date:** 2026-04-27
**Method:** Static code/CSS audit across six parallel surface areas (site shell, homepage/marketing, Q&A + comments, blog routes, auth/intake/account, admin panel). Done by reading source — no live device testing.
**Total findings:** ~340 across 56 files.

This is a **complete** mobile audit, not a pretty one. Every finding cites `file:line` so it can be fixed in isolation. Group fixes by the cross-cutting themes below before walking the per-surface lists.

---

## Executive Summary

Six things keep showing up across surfaces. **Fix the cross-cutting themes first** — each one collapses dozens of individual findings.

### 1. 🔴 iOS auto-zoom epidemic

Every form on the site has at least one input under 16px. iOS Safari auto-zooms on focus when an input's declared font-size is below 16px, then doesn't zoom back. **Affected:** login (`.form-input` 0.9rem), register, comment composer (`Interact.svelte:633` 0.95rem), comment reply (`Comment.svelte:530` `text-sm`), `/intake/[token]` (0.95rem), account profile, admin search/select/textarea everywhere, book-session form, EmailComposeModal textarea. Every keystroke session involves a zoom-out fight.

**Single fix:** Global rule `input, select, textarea { font-size: 16px; }` in `src/scss/index.scss`, scoped via `:where()` so per-component rules can still override upward. Zero risk; eliminates ~30 findings.

### 2. 🔴 Tap targets routinely below 44×44

ThemeToggle (32×32), account icon (24×24), mobile hamburger (40×40), admin hamburger (40×40), footer links (~28px row), AIComments carousel arrows (28×28), Comment kebab (32×32), Comment like/reply buttons (~32px), Modal2 close (32×32), BackNavigation (28-32px), CategoryNavigation icon-only (~26px), tabs in `QuestionContent.svelte` (~36×60), tabs in `/admin/comments` (~28px), Email-Signup button (155px fixed). Most are one-rule fixes (`min-width: 44px; min-height: 44px;`).

### 3. 🔴 Breakpoint chaos — 9+ values, almost no reuse

SCSS mixins define 480/576/768/800/1200. Components actually use **380, 480, 500, 575, 576, 600, 639, 640, 700, 720, 767, 768, 800, 899, 900, 920, 960, 992, 1024, 1180, 1200, 1300**. `+layout.svelte` uses 768/480; `Header.svelte` uses 900/639; `Footer.svelte` uses 900/640/380; `HeaderSearch.svelte` uses 767; the swipe-back gesture activates at 768; the mobile drawer in `Header` activates at 900. Between 769–899px you get the mobile-shell header but desktop-sized content padding and **the swipe-back gesture is OFF on devices that visually look mobile**. The `reduced-motion` mixin in `_mixins.scss:142` is **inverted** — it fires when motion is `no-preference`, the opposite of its name.

### 4. 🔴 The global swipe-right-back gesture is dangerous

`+layout.svelte:387-407` fires `history.back()` on any horizontal swipe >100px **anywhere in the app**, with no Y-delta guard. iOS already provides edge-swipe-back. Worse: any horizontal scroller (carousel, code block, scroll-table, marquee, AIComments, image lightbox) where the user swipes right will navigate them away from the page. Half the carousels on this site become traps.

**Fix:** Either delete the gesture entirely (iOS native + Android back button cover this) or restrict to swipes that _start_ within the leftmost 30px AND check that `Math.abs(deltaX) > 2 * Math.abs(deltaY)`.

### 5. 🔴 Half-built features and dead code

Several patterns where intent exists in code but doesn't actually run:

- **`headerVisible` scroll-hide** — variables declared in `+layout.svelte:53-54`, transition-classes added at line 548, but `transform` is never applied. The 110px sticky mobile header eats 16% of an iPhone SE viewport on every page because the hide logic was abandoned.
- **`MobileNav.svelte` and `mobile-ham.svelte`** — not imported anywhere. Dead.
- **`document.querySelector('main.column-width')`** in `EnneagramCTASidebar.svelte:135`, `TableOfContents.svelte:560`, `PeopleSuggestionsSideBar.svelte:65` — the selector exists nowhere. All three sidebars silently fall back to a default 1024px content width, then position against a phantom column on intermediate viewports.
- **`Email-Invite.svelte:22-43`** parses a SvelteKit form-action response with `.json()` (it's serialized differently). The Invite flow has been silently failing on every submission. Compare with `Email-Signup.svelte:39` which uses `deserialize` correctly.
- **`Carousel.svelte:21-26`** starts a `setInterval` with no cleanup; leaks on every navigation.
- **`Enneagram-Select.svelte:13`** hardcodes `id="menu-open"` for both the trigger and click-outside check. Two instances on one page break each other.
- **`Jumbotron.svelte` `pan-image` keyframes** target `background-position` and `background-size` on an `<img>` element. Animation is dead.
- **`/enneagram-test`** is still a client-side meta-refresh redirect to `/questions`. Not a 301. Bad for SEO and slow on mobile.
- **`/signup`** renders 350 confetti particles + waitlist form, but doesn't connect to `/register`. Anyone who lands here is dead-ended.

### 6. 🔴 Unbounded recursive indentation

Two recursive components don't cap depth:

- **Comments** — `Comment.svelte:619-637` renders nested replies via `<Comments>` → `<Comment>` → `<Comments>` with `ml-3 pl-4` per level. At depth 5 on a 360px screen, ~70px of left margin makes comment text 1-3 words per line. The give-first dialogue mechanic dies past depth 3.
- **Category trees** — `CategoryItem.svelte:106-114` recursively indents every level by another 1rem of margin + padding + border-left. Same failure mode.

**Fix pattern (Reddit/HN):** Cap visual indent at depth 3, render deeper levels flat with a "Reply to @author" indicator.

### Severity legend

🔴 high (breaks usability on mobile) · 🟡 medium (degraded but usable) · 🟢 low (polish)

---

## Top 12 Highest-ROI Fixes

| #   | Fix                                                                                                                              | Effort   | Impact                                                                        |
| --- | -------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------- |
| 1   | Global rule `:where(input, select, textarea) { font-size: 16px; }`                                                               | 5 min    | Kills iOS auto-zoom across login/register/intake/account/admin/email/comments |
| 2   | Delete or edge-restrict the swipe-back gesture in `+layout.svelte:387-407`                                                       | 5 min    | Stops accidental back-nav from any horizontal scroller                        |
| 3   | Bump every header-row icon to 44×44 (`ThemeToggle`, account, hamburger, mobile-login, BackNavigation)                            | 30 min   | Fixes the most-tapped controls on every page                                  |
| 4   | Add `data-label` + card-transform CSS to `/admin/categories` table                                                               | 30 min   | Categories goes from "unusable on phone" to "fine"                            |
| 5   | Cap nested-comment indentation at depth 3, flatten beyond                                                                        | 1-2 hrs  | Restores give-first dialogue on mobile                                        |
| 6   | Wire up `headerVisible` scroll-hide OR delete the half-built code and shrink the mobile sticky header                            | 1 hr     | Reclaims 110px of viewport                                                    |
| 7   | Fix `Email-Invite.svelte:22-43` JSON parsing — switch to `deserialize`                                                           | 5 min    | Email Invite has been silently failing                                        |
| 8   | Add cleanup return to `Carousel.svelte:21-26` `setInterval`                                                                      | 2 min    | Memory/battery leak on every nav                                              |
| 9   | Replace `Enneagram-Select.svelte` radial menu with the flat 3×3 grid pattern from `/account`                                     | 2 hrs    | Fixes accessibility, mobile clipping, and global-ID collision in one swap     |
| 10  | Hoist all body typography into one SCSS partial; floor body `<p>` at 16px on all viewports                                       | 1 hr     | Kills the 5 duplicated `:global(p)` blocks across blog templates              |
| 11  | Centralize breakpoints — pick 4 values (e.g. 480/640/768/1024), migrate all components to `@include`                             | half day | Prevents this audit from repeating in 6 months                                |
| 12  | Convert all hub-page card images from inline `style="background-image: url()"` to responsive `<img srcset sizes loading="lazy">` | 1 hr     | LCP/CLS wins on every list page                                               |

---

## Site shell · Header, Footer, Layout globals

### Header & Mobile Nav

#### 🔴 Hamburger tap target is 40×40 — `src/lib/components/molecules/MobileNavNew.svelte:241-251`

`.mobile-nav-toggle` has `padding: 8px` around a 24×24 hamburger = 40×40 hit area, below 44×44 minimum. **Fix:** Bump padding to 10px, or set `min-width: 44px; min-height: 44px;`.

#### 🔴 Account icon button has no explicit hit area — `src/lib/components/molecules/Header.svelte:93-110`

`.account-button` has no padding/min-size declared — SVG is 24×24, so the link is exactly 24×24. Sits between ThemeToggle and hamburger. **Fix:** `display: inline-flex; width: 44px; height: 44px; align-items: center; justify-content: center;`.

#### 🔴 ThemeToggle is 32×32 — `src/lib/components/atoms/ThemeToggle.svelte:97-110`

`width: 2rem; height: 2rem;` on the toggle button. **Fix:** Bump to 2.75rem (44px) or wrap in a 44px hit-target with a smaller visual chip inside.

#### 🔴 Cross-component breakpoint dead zone (769–899px) — `Header.svelte:56` vs `+layout.svelte:431`

Header switches to mobile shell at `< 900px`; layout switches at `<= 768px`; Footer collapses at `<= 900px`; HeaderSearch tweaks at `<= 767px`. Between 769–899px users get the mobile hamburger header but desktop-sized content padding and the swipe-back gesture is OFF. **Fix:** Centralize a single `--bp-mobile` token (900px) and use it everywhere.

#### 🟡 No focus trap inside mobile nav panel — `MobileNavNew.svelte:107-126`

Open panel is `role="dialog" aria-modal="true"` but Tab key escapes back out. **Fix:** On open, focus the close button; trap Tab cycle within `.mobile-nav-panel`; restore focus to `.mobile-nav-toggle` on close.

#### 🟡 Mobile submenu links fall under 44px at `<=480px` — `MobileNavNew.svelte:567-570`

`.submenu-link` padding drops to `0.625rem 1rem 0.625rem 2rem` ≈ 40px tall. **Fix:** Raise to `0.875rem` vertical to keep ≥ 44px.

#### 🟡 Mobile login pill is 32px tall — `Header.svelte:430-442`

`.mobile-login` has `height: 2rem` (32px). **Fix:** Change to `height: 2.5rem` minimum, or remove fixed height and use `padding: 0.55rem 1rem`.

#### 🟡 HeaderSearch input font-size 0.94rem on mobile — `HeaderSearch.svelte:606-608`

At root 16px that's ~15px; iOS auto-zooms on focus. **Fix:** `.mobile input { font-size: 16px; }`.

#### 🟡 HeaderSearch desktop input also borderline — `HeaderSearch.svelte:432`

Default `input { font-size: 0.98rem; }` ≈ 15.7px — affects iPad and small landscape phones. **Fix:** `font-size: max(16px, 0.98rem)`.

#### 🟡 Search clear button (×) is 40×40 — `HeaderSearch.svelte:325-327, 470-489`

**Fix:** Bump to `2.75rem` and the × glyph to `1.5rem`.

#### 🟡 Library menu uses 82vw fallback — `Header.svelte:323`

`width: min(26rem, 82vw)` on tablet-laptop hybrids around 900–1024px is ~820px wide. **Fix:** Lower to `min(26rem, 70vw)` and cap to `max-width: calc(100vw - 1rem)`.

#### 🟡 Library button height shrinks at `<=899px` but rule is unreachable — `Header.svelte:469-473`

Mobile shell branch hides the library button. Dead code. **Fix:** Delete the rule.

#### 🟢 Skip link tap target small — `+layout.svelte:541-546`

Tailwind `focus:px-4 focus:py-2` (~38px tall). **Fix:** Bump to `focus:py-3 focus:text-base`.

#### 🟢 Mobile nav active-link uses raw `--accent-light` background — `MobileNavNew.svelte:399-403`

Hot purple panel under teal text in light mode. **Fix:** Use `color-mix(in srgb, var(--accent) 14%, transparent)`.

#### 🟢 Hamburger hover uses hard-coded `rgba(0,0,0,0.05)` — `MobileNavNew.svelte:258`

Invisible in dark mode. **Fix:** Replace with `var(--primary-subtle)`.

### Footer

#### 🟡 Footer link rows ~28px tall, 8px gap — `Footer.svelte:420-422`

`gap: 0.5rem`, font-size `0.8125rem`, no link padding. Tap-error magnet. **Fix:** Add `padding: 0.5rem 0` to footer `a`; tighten `gap` to `0.25rem`.

#### 🟡 Coaching contact link 13px on mobile — `Footer.svelte:445-447`

Highest-value conversion CTA gets the smallest type. **Fix:** Keep at `0.875rem` minimum or render as a button with padding.

#### 🟡 Connect-section paragraph max-width 280px hard-cap — `Footer.svelte:432-437`

Looks cramped on a 360px viewport when columns aren't. **Fix:** Remove `max-width: 280px` or raise to `min(360px, 100%)`.

#### 🟡 Three breakpoints (900/640/380) don't match anywhere else — `Footer.svelte:353,365,461`

**Fix:** Adopt the SCSS mixin breakpoints (480/576/768) project-wide.

#### 🟢 `homeUrl` logic uses path.includes('9takes') — `Footer.svelte:44`

Bug: should be `host.includes('9takes')`. Will only fire for paths literally containing "9takes".

#### 🟢 Social icons drop to 36×36 at 380px — `Footer.svelte:217-218, 489-491`

**Fix:** Floor at 44×44.

### Layout shell & globals

#### 🔴 Sticky header is ~110px tall on mobile and never hides — `+layout.svelte:548-550` + `Header.svelte:80-122`

Mobile shell stacks `.mobile-top-row` (~32px icons + padding) + `.mobile-search-row` (~46px input + margins) ≈ 110–120px. With `position: sticky; top: 0; z-50`, this consumes ~16% of an iPhone SE viewport on every page. **Fix:** Either implement scroll-hide using `headerVisible` (already declared but dead) or collapse search behind a magnifying-glass icon that expands inline.

#### 🔴 `headerVisible` scroll-hide logic declared but never wired — `+layout.svelte:53-54, 548`

Variables exist; transition class is on the wrapper; no `transform` is ever applied. **Fix:** Implement using `scrollY` (already bound at line 530), or delete the dead variables.

#### 🔴 `body { overflow-x: hidden }` masks real layout bugs — `+layout.svelte:589-601`

Anything wider than viewport is silently clipped. Hides horizontally-overflowing tables/marquees/code blocks. **Fix:** Keep `overflow-x: clip` on `<html>` only; audit each component for true overflow.

#### 🟡 `main { overflow: hidden }` in `index.scss:474` — `index.scss:465-487`

`position: sticky` inside `main` will silently break (sticky doesn't work inside `overflow: hidden` ancestors). Affects in-page TOC and back-to-top. **Fix:** Remove from index.scss; rely on body-level clipping.

#### 🟡 `max-w-4xl` padding shrinks to 0.5rem on `<= 480px` — `+layout.svelte:618-622`

8px edge inset is below typical safe-area. **Fix:** Floor at `0.75rem` and use `safe-area-inset-left/right` env() for notched devices.

#### 🟡 Two competing `main` rules — `index.scss:489-494` vs `+layout.svelte:561-572`

Global `main { padding: 2rem }` matches the bare `<main>` element, doubling/conflicting with Tailwind utilities. **Fix:** Remove the global block; let the layout's per-route Tailwind utilities own this.

#### 🟡 SCSS mixin set has 5 breakpoints, components use 9+ — `_mixins.scss:118-145`

**Fix:** Hoist component breakpoints into mixins; migrate `Header`, `Footer`, `BackNavigation` to `@include` form.

#### 🟡 `reduced-motion` mixin is inverted — `_mixins.scss:142-146`

`@mixin reduced-motion { @media (prefers-reduced-motion: no-preference) { @content; } }` — fires the opposite of its name. **Fix:** Rename to `@mixin allow-motion` and add a separate correct `@mixin reduced-motion`.

#### 🟡 BackNavigation button height 32px — `BackNavigation.svelte:50-72, 88-105`

Container is `h-8`; button has `min-w-7 min-h-7` at xs (28px). **Fix:** `h-12` container and `min-w-11 min-h-11` button.

#### 🟡 BackNavigation truncates destination with ellipsis — `BackNavigation.svelte:75-81`

`whitespace-nowrap` + `max-w-[calc(100%-50px)]` cuts long category names mid-word. **Fix:** `whitespace-normal` or smarter truncation.

#### 🟡 CategoryNavigation font drops to 12.8px on `<= 480px` — `CategoryNavigation.svelte:236-240`

**Fix:** Floor at 14px; reduce padding instead.

#### 🟡 CategoryNavigation runs `setTimeout(checkOverflow, 10)` on every reactive run — `CategoryNavigation.svelte:42-48`

No cleanup. **Fix:** Replace with `ResizeObserver` on a `bind:this` element.

#### 🟡 CategoryNavigation icon-only "all categories" link — `CategoryNavigation.svelte:62-78`

Padding `0.25rem 0.5rem` on an 18px SVG = ~26×34 hit area. **Fix:** `min-height: 44px` on touch devices.

#### 🟢 Story routes bypass layout shell entirely — `+layout.svelte:532-534`

No header, footer, skip link, or analytics for `/stories/*`. Users can't navigate back without browser back. **Fix:** Render at minimum a thin "exit story" CTA, or document the immersive intent.

#### 🟢 Logo has no `aria-current` — `Header.svelte:86-88`

### Effects (particles, swipe gesture)

#### 🔴 Horizontal swipe-back gesture conflicts with iOS edge-swipe and embedded scrollers — `+layout.svelte:387-407, 537-538`

Any swipe right >100px anywhere in the app triggers `history.back()`. iOS already provides edge-swipe-back. Any horizontal scroller (carousel, code block, scroll-table, marquee) where the user swipes will fire `history.back()` if the finger lifts past 100px. **Fix:** Delete entirely, or restrict to `touchStartX < 30` (true edge swipes).

#### 🔴 Swipe gesture has no Y-delta or velocity guard — `+layout.svelte:391-407`

A diagonal swipe down-right (e.g. flicking past a card) registers as "swipe right." **Fix:** Capture Y; only fire if `Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY) * 2`.

#### 🟡 Swipe listener attached at all sizes; mobile check inside handler — `+layout.svelte:398, 537`

Wasted event work; iPad in landscape still has inert listeners. **Fix:** Conditionally bind on resize, or align breakpoint to header's 900px.

#### 🟡 FloatingParticles is `position: fixed` over the viewport with 7 GPU-blurred animated nodes on mobile — `FloatingParticles.svelte:50-79, 188-191`

Plus 3 large `filter: blur(80px)` glow blobs running for the entire session. `blur(80px)` on a 300×300 element is one of the most expensive paint ops. **Fix:** Drop to 3 particles on mobile; replace `filter: blur(80px)` glows with pre-blurred PNGs or remove entirely on mobile.

#### 🟡 Particle animation runs even when tab is hidden — `FloatingParticles.svelte:73-79`

**Fix:** Toggle `paused` class on `visibilitychange`; use `animation-play-state: paused`.

#### 🟡 `prefers-reduced-motion` only hides particles, glow blobs still pulse — `FloatingParticles.svelte:172-185`

Glow pulse is the bigger paint cost. **Fix:** `display: none` for `.glow` under reduced-motion.

#### 🟡 MarqueeHorizontal has no parent clip safety — `MarqueeHorizontal.svelte:127-130`

SSR risk if `--marquee-width` is undefined → `calc(NaN * 2)`. **Fix:** Default `--marquee-width: 100vw` in CSS; let JS overwrite.

#### 🟡 MarqueeHorizontal eats viewport on mobile — `MarqueeHorizontal.svelte:184-208`

`font-size: 1.2rem` + `padding: 1rem 2rem` = ~70px per row. **Fix:** Mobile breakpoint: `padding: 0.5rem 1rem; font-size: 0.9rem;`.

#### 🟡 MarqueeHorizontal hover effect runs on touch — `MarqueeHorizontal.svelte:195-199`

`transform: scale(1.1)` colliding with the parent's translate animation = paint storm on tap-and-hold. **Fix:** Wrap in `@media (hover: hover) and (pointer: fine)`.

#### 🟢 MarqueeHorizontal `role="marquee"` is invalid ARIA — `MarqueeHorizontal.svelte:111`

---

## Homepage & Marketing pages

### Homepage (`/`)

#### 🔴 Hero CTAs hidden well below fold on 360×640 — `+page.svelte:392-419`

Hero stacks badge + h1 (2.25rem on mobile) + lede + 2 full-width stacked buttons inside a 2.7rem padded section before the decision-fork even starts. With ~70px sticky header, both "Give Today's Take" and "I'm New to This" are below the fold. **Fix:** Reduce hero `padding` to ~1.5rem; shrink lede; consider hiding "I'm New" since the decision-no panel below already serves that audience.

#### 🔴 Two competing primary CTAs above fold dilute hierarchy — `+page.svelte:404-419`

Hero offers 2 CTAs, decision-no panel offers 3 more, decision-yes offers 2 more — ~5 calls to action stacked vertically. **Fix:** Drop `.hero-actions` on mobile; the panels below cover both audiences.

#### 🔴 Decision-yes panel ~700-800px tall on mobile before decision-no appears — `+page.svelte:444-492, 2367-2381`

Mobile reorders `.decision-yes` to `order: 1`, but a "new" user must scroll past the entire knows-my-type funnel to find their panel. **Fix:** Keep DOM order matching reading priority on mobile, or collapse demo-preview behind a "Show example" disclosure.

#### 🔴 Famous-people grid forced to 3 columns at all viewports — `+page.svelte:1885-1895, 2545-2577`

`.types-grid { grid-template-columns: repeat(3, 1fr) }` with no mobile override. At 320-360px each card gets ~95-105px wide; long names ("Christopher Hitchens", "Ruth Bader Ginsburg") wrap to 3+ lines; persona titles hidden anyway. **Fix:** `repeat(2, 1fr)` below 480px, or cap to 6 most-recognizable.

#### 🟡 Demo-replies forced to 1 column kills "see all 9 types at a glance" pitch — `+page.svelte:2379-2381`

Stacked, the type-tagged previews read as three more bullets instead of demonstrating the mechanic. **Fix:** `repeat(3, 1fr)` with smaller padding, or horizontal scroll-snap.

#### 🟡 Type-guide grid produces 9-row scroll on mobile — `+page.svelte:1786-1789, 2530-2532`

`auto-fit, minmax(210px, 1fr)` plus mobile override forces single column = 1620px of vertical scroll just for type guides. **Fix:** `repeat(2, 1fr)` on mobile.

#### 🟡 Resource pills row wraps to 4-5 rows on a 360px viewport — `+page.svelte:495-502, 1245-1278`

Five pills + "Explore" kicker create ~150px of dead vertical space. **Fix:** Hide on mobile or replace with a single horizontally scrolling row.

#### 🟡 `meta-value` person name uses `word-break: break-word` — hyphenates "Hitche-ns" — `+page.svelte:2574-2577`

**Fix:** `overflow-wrap: normal; white-space: normal;` and set `min-height` for the meta block.

#### 🟡 Hero h1 `text-wrap: balance` produces 4-line stacks at 2.25rem in 328px — `+page.svelte:999`

**Fix:** Use `text-wrap: pretty` on mobile, or remove below 480px.

#### 🟡 Final-section radial-gradient + `pulse-dot` keyframe runs continuously — `+page.svelte:2214-2237, 2266-2272`

Heavy paint on lower-end Android. **Fix:** OK given global reduced-motion override; verify on real devices.

#### 🟢 `.bg-grid` and `.bg-ambient` `position: fixed` layers add scroll-jitter — `+page.svelte:952-970`

`position: fixed` background gradients trigger repaints during scroll on low-end phones. **Fix:** `background-attachment: fixed` on a single body-level layer.

#### 🟢 Coaching-features 350px-max bullet list inside centered card looks misaligned — `+page.svelte:2183-2189`

**Fix:** Stretch to full width with reduced padding.

### `/book-session`

#### 🔴 Final "Join the Waitlist" CTA anchors back to `#top`, not the form — `book-session/+page.svelte:629, 273-422, 1511-1515`

On mobile the form is below the hero copy in DOM order. User taps "Join the Waitlist" expecting form focus, gets dropped at H1. **Fix:** Change `href="#top"` to `href="#waitlist"`.

#### 🔴 Anchors land hidden under sticky header — `book-session/+page.svelte:253, 273, 485, 629`

No `scroll-margin-top` on `[id]` targets. **Fix:** Add `scroll-margin-top: 5rem` globally on `[id]` targets.

#### 🔴 Page uses Svelte 4 patterns in a runes-required project — `book-session/+page.svelte:10-11`

`export let data` and `export let form` plus `$:`. **Fix:** Migrate to runes when next editing.

#### 🟡 reCAPTCHA widget 304×78px overflows iPhone SE — `book-session/+page.svelte:367-371`

**Fix:** Use `data-size="compact"` (164×144) below 360px, or `transform: scale(0.9)`.

#### 🟡 `enneagramType` placeholder "I am not sure yet" misread as label — `book-session/+page.svelte:331-348`

**Fix:** `<option value="" disabled selected>Select your type</option>`; move "I am not sure yet" to value `unknown`.

#### 🟡 `.form-input` 1rem font borderline; iOS only safe at literal 16px — `book-session/+page.svelte:1008`

**Fix:** `font-size: 16px` or `font-size: max(1rem, 16px)`.

#### 🟡 Hero h1 `clamp(2rem, 11vw, 3rem)` produces 4-line wraps on small phones — `book-session/+page.svelte:1589`

**Fix:** Drop `nowrap` from "1-on-1" span; tighten clamp to `clamp(1.75rem, 8vw, 3rem)`.

#### 🟡 6-chip focus-area row wraps to 3 rows above the form — `book-session/+page.svelte:456-460, 924-940`

**Fix:** Hide chip row on mobile (collapse to "More topics" disclosure) or move support shell after form in DOM order.

#### 🟡 18 stacked content cards before final CTA — `book-session/+page.svelte:538-616`

Six top-level sections × 3-6 cards each = decision fatigue. **Fix:** Cut sections; merge `outcomes` and `process`; move FAQ behind `<details>`.

#### 🟡 FAQ uses cards instead of `<details>` — no progressive disclosure — `book-session/+page.svelte:608-615`

**Fix:** Wrap each in `<details><summary>...</summary>...</details>`.

#### 🟡 Submit button has no `min-height: 44px` floor when text swaps — `book-session/+page.svelte:377`

**Fix:** `min-height: 3rem` explicit.

#### 🟡 `.final-cta` button + text-link equal weight on mobile — `book-session/+page.svelte:628-631, 1417-1421`

Both look heavy. **Fix:** Make text-link smaller secondary on mobile.

#### 🟡 Panel-footnotes "No payment today" repeats info from `.hero-badge` — `book-session/+page.svelte:381-384`

**Fix:** Drop on mobile.

### `/about` + minor pages

#### 🔴 `/followme` has no responsive logic at all — `followme/+page.svelte:19-78`

Inline `style="margin:20px"` everywhere; YouTube `<iframe width="560" height="315">` (overflows any <600px viewport); two side-by-side Twitter timelines unreadable. **Fix:** `width: 100%; aspect-ratio: 16/9; max-width: 560px` on iframe; stack timelines below 720px.

#### 🟡 About `.example-responses` forced to 1 column kills the side-by-side comparison demo — `about/+page.svelte:589-595, 991-995`

**Fix:** Allow 1 column with reduced padding to keep them close, or horizontal scroll-snap row.

#### 🟡 Founder image 240×300px dominates mobile fold — `about/+page.svelte:707-714, 935-938`

Pushes "Why I built 9takes" down ~350px. **Fix:** Cap mobile photo at 160px wide with `aspect-ratio: 1/1`.

#### 🟡 About `.cta-grid` cascade fragile — `about/+page.svelte:861-865, 991-995`

Mixes `display: flex` shorthand selector with `display: grid` override. **Fix:** Decouple.

#### 🟡 About hero h1 `text-wrap: balance` may stack to 5-line single-word lines — `about/+page.svelte:417-420, 1009-1010`

**Fix:** `text-wrap: pretty` below 480px.

#### 🟡 About contact-section button → tiny mailto text on reveal — `about/+page.svelte:321-331`

Inconsistent tap target. **Fix:** Render email as styled `.contact-btn`.

#### 🟡 About `.centers-grid` 3-col stacks to wall-of-text on mobile — `about/+page.svelte:782-787, 991-995`

Body/Head/Heart distinction loses visual punch. **Fix:** Horizontal scroll-snap or `repeat(3, minmax(0, 1fr))` with smaller padding.

#### 🟢 `/goodbye` and `/thanks-for-staying` 8rem top margin too far below header — both files

**Fix:** `margin: clamp(2rem, 12vh, 8rem) auto`.

#### 🟢 `/followme` is `noindex` but accessible by direct URL; visual quality matters — `followme/+page.svelte:14`

### Reusable home components

#### 🔴 PopCard hover-only enneagram-overlay — touch users can't see analysis — `PopCard.svelte:156-175`

Mouseover/leave drives `showDescription`. Touch toggles via `click` but doesn't navigate anywhere. Touch flow is "tap → see analysis → tap → analysis disappears." **Fix:** Add a clear close button on the overlay; auto-dismiss after N seconds; allow `link` prop matching SmallPopCard.

#### 🔴 PopCardGroup `width: clamp(300px, 100%, 700px)` overflows iPhone SE — `PopCardGroup.svelte:78-85`

300px floor + 2px border + 1.5rem auto margin overflows 320px viewports. **Fix:** `width: min(100%, 700px)`.

#### 🔴 SmallPopCard mixes Tailwind hover utilities with custom `.scale-103` — broken cascade — `SmallPopCard.svelte:117-121, 257-263`

`hover:scale-103` declared in both Tailwind class and `<style>` block without `:hover` selector. **Fix:** Define explicitly in `<style>`.

#### 🔴 BlogTiles `.temp-three-row` 30vw × 3 columns overflow at <360px — `BlogTiles.svelte:151-157, 233-257`

`grid-template-columns: 30vw 30vw 30vw` = 90vw + gaps + parent padding = horizontal scrollbar. **Fix:** `repeat(auto-fit, minmax(140px, 1fr))`.

#### 🔴 Carousel.svelte uncleared `setInterval` — leaks on every navigation — `Carousel.svelte:21-26`

`onMount` starts interval, no cleanup return. **Fix:** `return () => clearInterval(id)`.

#### 🔴 WordCloud renders 4-5px text on mobile and is non-responsive — `WordCloud.svelte:18-23, 109-111`

Default `width: 800, height: 400` with no `ResizeObserver`. Words at value=4 → `Math.sqrt(4)*5 = 10px`, scaled down on phone = unreadable. **Fix:** Reactive width via ResizeObserver; floor at `Math.max(12, Math.sqrt(value) * 5)`.

#### 🔴 FamousTypes renders an unstyled `<ul>` of names — `FamousTypes.svelte:11-23`

Plain list, no padding, ~24px tap rows. **Fix:** `li { padding: 0.75rem 0; } a { display: block; min-height: 44px; }`.

#### 🔴 PeopleBoard JS-driven gridSize doesn't re-evaluate on orientation change — `PeopleBoard.svelte:21-25`

`if (window.innerWidth < 600) { gridSize = 5 }` runs once on mount. Rotation keeps wrong grid. **Fix:** Replace with pure CSS `grid-template-columns` + media query.

#### 🔴 PeopleBoard at 9-col on mobile = 38px cards — `PeopleBoard.svelte:14, 29`

**Fix:** `repeat(3, 1fr)` below 480px, `repeat(5, 1fr)` 480-720px, `repeat(9, 1fr)` desktop.

#### 🔴 Email-Invite parses SvelteKit form-action as JSON — silently broken — `Email-Invite.svelte:22-43`

`await fetch(...).json()` cannot parse `{type: 'success', data: ...}`. Compare with Email-Signup.svelte:39 which uses `deserialize` correctly. **Fix:** Switch to `deserialize` pattern.

#### 🟡 PopCard `aria-roledescription="card"` + `role="button"` contradictory — `PopCard.svelte:153-154`

Screen reader announces both. **Fix:** Pick one.

#### 🟡 PopCard min-height `1.5em` doesn't reserve for 2-line names — `PopCard.svelte:373-383`

CLS risk on font-load. **Fix:** Reserve `2.5em` minimum.

#### 🟡 PopCardGroup labels at 320px → 6.4px font — `PopCardGroup.svelte:148, 162`

`clamp(0.6rem, 2vw, 0.85rem)`. **Fix:** Bump floor to `clamp(0.7rem, 2.4vw, 0.85rem)`.

#### 🟡 PopCardGroup hover-only — sticks on tap-and-hold — `PopCardGroup.svelte:112-115`

**Fix:** Wrap in `@media (hover: hover)`.

#### 🟡 SmallPopCard two-tap pattern non-obvious — `SmallPopCard.svelte:142-154`

Tap-1 shows description, tap-2 navigates. No "Tap again to view" hint. **Fix:** Add hint or make first tap navigate.

#### 🟡 SmallPopCard h2 inside cards flattens heading hierarchy — `SmallPopCard.svelte:201, 221`

**Fix:** Use `<p class="card-title">` or accept `headingLevel` prop.

#### 🟡 BlogTiles uses `column-count: 3` AND `display: grid` simultaneously — `BlogTiles.svelte:151-157, 183-187`

Conflicting layout systems on the same selector. **Fix:** Pick one.

#### 🟡 BlogTiles `.fit-card` absolutely positioned at 50% — long titles clipped — `BlogTiles.svelte:171-181`

**Fix:** Use `text-overflow: ellipsis; -webkit-line-clamp: 3` with relative positioning.

#### 🟡 Carousel autoplays every 3.3s with no pause, no a11y, no controls — `Carousel.svelte:34-50`

Annoying autoplay, impossible to dwell on a face. **Fix:** Drop autoplay or add play/pause + dots.

#### 🟡 Carousel has dead `@keyframes scroll` and embedded shell-command HTML comments — `Carousel.svelte:52-179`

**Fix:** Strip dead code.

#### 🟡 WordCloud d3 + d3-cloud is ~150KB transferred for a decorative element — `WordCloud.svelte:32-37`

**Fix:** Render static fallback (top 5 words as text) until libs load.

#### 🟡 WordCloud color palette gray-on-light-gray — sun-unreadable — `WordCloud.svelte:69-82, 109`

**Fix:** Use `var(--text-primary)` or saturated brand colors.

#### 🟡 FamousTypes contains dead `@keyframes scroll` (copy-paste from Carousel) — `FamousTypes.svelte:25-39`

**Fix:** Delete.

#### 🟡 PeopleBoard "YOUR NAME" cell hardcoded at index 40/27 — fragile — `PeopleBoard.svelte:31-41`

**Fix:** Compute from array length.

#### 🟡 CorpusStatsPanel 1-col below 480px destroys comparison context — `CorpusStatsPanel.svelte:194-202`

**Fix:** Keep `repeat(2, 1fr)`; reduce `tile-value` to 1.5rem.

#### 🟡 CorpusStatsPanel depends on tokens scoped to `.sl-page` — `CorpusStatsPanel.svelte:159-180`

Coupling hazard. **Fix:** Promote tokens to global theme file.

#### 🟡 Email-Signup input `padding: 10px` (px), no explicit `font-size` — iOS zoom risk — `Email-Signup.svelte:115-124`

**Fix:** Add `font-size: 16px`; convert padding to rem.

#### 🟡 Email-Signup tablet (768-991px) keeps column layout — `Email-Signup.svelte:115-189`

**Fix:** Move row-layout breakpoint to 600-640px.

#### 🟡 Email-Signup button fixed `width: 155px` while input is 100% — visual mismatch — `Email-Signup.svelte:137-138`

**Fix:** Match input width on mobile.

#### 🟡 Email-Invite missing loading state — double-tap submits twice — `Email-Invite.svelte:48-60`

**Fix:** `disabled={loading || !email.length}`.

#### 🟡 Email-Invite uses `var(--primary)` for placeholder — non-standard — `Email-Invite.svelte:129-133`

**Fix:** `var(--text-tertiary)`.

#### 🟡 Jumbotron `height: 100vh` jumps on iOS Safari address-bar resize — `jumbotron.svelte:94-96`

**Fix:** `100svh` or `100dvh` with `100vh` fallback.

#### 🟡 Jumbotron `pan-image` keyframes target `background-position` on an `<img>` — animation dead — `jumbotron.svelte:164-186, 134-136`

**Fix:** Use `transform: scale() translate()` or convert to `background-image` div.

---

## Q&A platform & comments

### `/questions` list

#### 🟡 Search row stacks button below input on mobile — `SearchQuestion.svelte:497`

Pushes content ~140px down before first question card. **Fix:** Keep input + icon-only ask button in a row; stacked layout only for signed-out "Sign up to ask."

#### 🟡 Category chip strip is double-axis scrollable — `+page.svelte:399-401`

`flex-wrap` + `max-h-32 overflow-y-auto` creates a tiny non-obvious scrollbox. **Fix:** Pick one axis. Either `flex-wrap` with "Show all" expander, or single-row horizontal scroll with snap-x.

#### 🟡 `filterByCategory` race window — `+page.svelte:284-304`

`isNavigating` is set after `await goto(...)` returns; reactive block can re-fire. **Fix:** Set `isNavigating = true` before navigation; clear in `finally`. Better: derive `selectedCategory` from `$page.url`.

#### 🟡 "Browse by Category" `disabled` styling defeated by `!important` — `+page.svelte:402-412`

During fetch, button looks fully active. **Fix:** Disable the entire chip group; move active highlight into `aria-current` styling.

#### 🟡 QuestionItem meta wraps to 3 visual lines below 400px — `QuestionItem.svelte:71-91`

List of 20 questions becomes 60+ rows. **Fix:** Always inline meta at sub-400px (icon + count + · + short date).

#### 🟡 Infinite-scroll trigger has no manual fallback — `+page.svelte:514-527`

If `IntersectionObserver` fails (in-app browsers, accessibility tools), users hit a dead-end. **Fix:** Visible "Load more" button when `hasMore && !loadingMore`.

#### 🟡 Section transitions delay perceived ready by ~900ms — `+page.svelte:374, 388, 444, 532`

`in:fly` delays 300-900ms. **Fix:** Cap at 150ms or skip transitions on mobile.

#### 🟡 Two `<h1>` elements with identical copy — `+page.svelte:332-345`

Duplicated across signed-in/out branches. **Fix:** Hoist h1 above `{#if}`.

#### 🟢 Skeleton row has no `aria-busy` — `QuestionItemSkeleton.svelte:6-19`

### `/questions/[slug]`

#### 🔴 Composer textarea `font-size: 0.95rem` triggers iOS zoom — `Interact.svelte:633`

Highest-friction bug for the give-first mechanic. Every comment session = zoom-out fight. **Fix:** `font-size: 16px` on `.composer-textarea` and matching `::after`.

#### 🔴 Reply textarea uses `text-sm` (14px) — same iOS zoom — `Comment.svelte:530-535`

**Fix:** `text-base` (16px) plus `min-height: 72px`.

#### 🔴 Edit-modal textarea brittle on `text-base` if root font-size shifts — `Comment.svelte:658-664`

**Fix:** Explicit `font-size: 16px` for any form input that must avoid iOS zoom.

#### 🟡 "Post Comment" submit pushed off-screen by depth-prompt + textarea + nudge stack — `Interact.svelte:378-468`

With keyboard up, submit button drops below viewport on phones <700px tall. **Fix:** Make composer footer sticky inside `.composer-surface`, or scroll into view after `shortAnswerNudge = true`.

#### 🟡 Composer footer column wrap fights `min-width: 9.5rem` on submit — `Interact.svelte:572, 642-665`

Cancel button squeezes; spinner clips. **Fix:** Full-width both buttons on mobile; drop `min-width`.

#### 🟡 Interaction toolbar overflows at 320px — `Interact.svelte:314-376`

3 buttons wrap to 2 rows; "Subscribed" wider than "Subscribe" → reflow on toggle. **Fix:** Icon-only buttons under 480px.

#### 🟡 QR-code share button hidden until generation completes — `Interact.svelte:356`

Layout shift when QR appears. **Fix:** Render with disabled+loader, or pre-compute server-side.

#### 🟡 Question category editor injects 3-step admin UI mid-flow — `[slug]/+page.svelte:643-817`

Admin chip rails wrap into 4-5 lines on mobile. **Fix:** Move into a Modal2 or bottom sheet.

#### 🟡 Question stats grid 1-up on mobile = 240px of vertical waste — `[slug]/+page.svelte:1105-1107`

**Fix:** Keep 3 columns at all widths; shrink padding.

#### 🟡 Tab nav icon-only at <575px, 32px tall — `QuestionContent.svelte:121-141`

**Fix:** `min-height: 48px`; align icon + count side-by-side.

#### 🟡 "Visuals" tab is permanent placeholder — eats 25% horizontal — `QuestionContent.svelte:287-326`

**Fix:** Hide until visuals exist or feature-flag.

#### 🟡 Sticky keyboard hides locked-state CTA — `QuestionContent.svelte:185-211`

Give-first conversion moment loses social proof when keyboard opens. **Fix:** Inline a compact "Unlock 47 perspectives" badge inside composer header.

#### 🟡 Edit/flag modals lack `fullMobile` flag — `Comment.svelte:646, 694`

Modal2 supports it but they opt out. White space + rounded corners with keyboard partially obscuring textarea. **Fix:** Add `fullMobile`.

#### 🟡 AI Comments carousel `line-clamp-2` with no expand — `AIComments.svelte:87`

Whole carousel claims to show diverse perspectives but you can only read 2 lines per type. **Fix:** Tap-to-expand or remove clamp.

#### 🟡 AI Comments carousel arrows `h-7 w-7` (28×28) — `AIComments.svelte:56-62, 96-102`

**Fix:** `h-11 w-11`.

#### 🟡 Question h1 sizing is 100-line JS function — `QuestionDisplay.svelte:28-141`

9 length × 4 viewport buckets, depends on `$viewportWidth` store, only updates on resize. Bundle bloat. **Fix:** Replace with CSS `font-size: clamp(1rem, 4vw, 2.25rem)` + `text-wrap: balance`.

#### 🟡 Question detail container has `overflow-x: hidden` masking real overflow — `[slug]/+page.svelte:839`

Long URLs in user-typed context will silently truncate. **Fix:** `overflow-wrap: anywhere` on `.question-overview-context__body`; remove page-level `overflow-x: hidden`.

### Comments + nesting

#### 🔴 Nested comments use unbounded recursive indentation — `Comment.svelte:619-637`

`<Comments>` → `<Comment>` → `<Comments>` with `ml-3 pl-4` per level. At depth 5 on a 360px screen, ~70px left margin = comments are 1-3 words per line. The canonical mobile-comment failure mode. **Fix:** Cap visual indent at depth 3; flatten further with "Reply to @authorName" indicator.

#### 🔴 `structuredClone(comment)` runs reactively on every prop change — `Comment.svelte:60-61`

For a thread of 50 nested comments, deep-cloning on every parent re-render = janky scroll. **Fix:** Drop the second `$: _commentComment = structuredClone(comment)` line. Same problem in `Comments.svelte:33`.

#### 🟡 Deep clone in Comments.svelte for every render — `Comments.svelte:33`

For 100+ comments, ~100KB of JSON serialize/parse per dependency change. **Fix:** Deep-copy only when reference changes.

#### 🟡 Comment text uses `whitespace-pre-line` without `overflow-wrap: anywhere` — `Comment.svelte:421-429`

Long URLs/identifiers overflow horizontally. **Fix:** `overflow-wrap: anywhere; word-break: break-word;`.

#### 🟡 "Read more" expands but never collapses — `Comment.svelte:431-439`

1500-char comment expanded mid-thread eats half the screen. **Fix:** Toggle, add "Show less."

#### 🟡 Like/Reply buttons ~32px tall; kebab 32×32 — `Comment.svelte:443-483`

**Fix:** `py-2.5` (40px) and kebab `h-11 w-11`.

#### 🟡 Reply form `sm:flex-row` is a no-op — `Comment.svelte:537-561`

Always row anyway. Desktop buttons accidentally smaller than mobile. **Fix:** Drop the no-op; verify sizing.

#### 🟡 Thread connector dot misaligned with rounded border — `Comment.svelte:619-624`

**Fix:** CSS pseudo-element with `transform: translateX(-50%)`.

#### 🟡 Comment timestamp uses `toLocaleDateString` only — no relative time — `Comment.svelte:413-415`

Users can't tell if a thread is hot or stale. **Fix:** `Intl.RelativeTimeFormat` or `dayjs.fromNow()`.

#### 🟡 No copy-link to individual comment — `Comment.svelte:385`

Anchor exists; no UI surfaces it. Users screenshot instead. **Fix:** "Copy link" in popover; on copy append `#comment-${id}`.

#### 🟡 `loadMore` pagination races on duplicate fetches — `Comments.svelte:42-50`, `comments/+server.ts:83`

Server uses `range` without lastDate cursor; observer fires multiple times. **Fix:** Cursor-based pagination + coalesce in-flight requests.

#### 🟡 Sort comments require modal — 3 taps for "Newest/Oldest" — `SortComments.svelte:155-199`

**Fix:** Inline 3-segment toggle for newest/oldest/likes; reserve type-filter for modal.

#### 🟡 Filter modal "Apply" disabled with hint below fold — `SortComments.svelte:349`

**Fix:** Disable the trigger with explanation, or move hint above.

#### 🟡 AI Comments only render after hydration — `AIComments.svelte:42`

Blank gap on slow networks. **Fix:** Render server-side; only autoplay/transitions need browser.

#### 🟡 Comment author "Type N" badge layout jitter — `Comment.svelte:391-403`

"Anonymous" wider than "Type 9". **Fix:** `min-width: 5rem` on both.

#### 🟡 Settings popover always `bottom-right` — clips at thread bottom — `Comment.svelte:486`

**Fix:** Auto-flip to `top-right` near viewport bottom.

#### 🟡 No virtualization for long threads — `Comments.svelte:131-145`

300 comments = 300 Comment subtrees + popover + modals. **Fix:** `content-visibility: auto; contain-intrinsic-size: 120px;` on `.comment-card`.

#### 🟡 Comment fade-in stagger applies per-item up to 100ms — `Comments.svelte:134`

Cumulative GPU cost while scrolling. **Fix:** Remove on mobile or only animate newly-added.

#### 🟡 Image attachments not addressed at all

Audit asks about lightbox + pinch-zoom — appears images-in-comments aren't supported. **Fix:** Confirm scope.

### `/questions/create`

#### 🟡 Question textarea `text-lg` (~18px), context `text-base` (16px) — both safe.

Confirming positive baseline.

#### 🟡 No category picker on create page — `create/+page.svelte`

Authors must add category after creation. SEO suffers; questions land uncategorized. **Fix:** Single-select picker on create form.

#### 🟡 Modal preview uses media-query scale transforms — blank corners possible — `create/+page.svelte:386-393`

**Fix:** `aspect-ratio: 1200/630` on preview wrapper; scale inner.

#### 🟡 No autosave/draft recovery — `create/+page.svelte:21-23`

Mobile back gesture loses everything. **Fix:** Persist to localStorage with 24h TTL.

#### 🟡 "Launch Your Question" disabled with no reason — `create/+page.svelte:344-351`

**Fix:** Render hint above button ("Add 7 more characters").

#### 🟡 Image generation 7s timeout swallows errors — `create/+page.svelte:44, 254`

Question created but social card missing. **Fix:** Bump to 12-15s; surface non-blocking notification.

#### 🟡 Hidden capture div at `-200vw` may flash horizontal scrollbar — `create/+page.svelte:406-412`

**Fix:** `position: fixed; left: -200vw; visibility: hidden;` with `contain: layout`.

#### 🟡 No spinner inside submit button during loading — `create/+page.svelte:361-401`

**Fix:** Mirror overlay spinner in button.

### Category navigation

#### 🟡 CategoryTree uses `export let` + Flowbite `<A>` + clickable row+link conflict — `CategoryTree.svelte:14-49`

Tapping the row may toggle expand or trigger nav unpredictably. **Fix:** Separate concerns — chevron is its own button; rest is the link.

#### 🟡 CategoryTree uses `hover:bg-gray-100` — invisible in dark theme — `CategoryTree.svelte:25`

**Fix:** `hover:bg-[var(--bg-elevated)]`.

#### 🟡 CategoryItem recursive indent (1rem margin + 1rem padding + 2px border per level) — same failure as comments — `CategoryItem.svelte:106-114`

**Fix:** Cap at 2 levels; flatten level 3+ with breadcrumb.

#### 🟡 CategoryBrowseBranch `.leaf-link` column-stacks count pill below 639px — `CategoryBrowseBranch.svelte:217-244`

Doubles row height; with 30+ leaves, page is endless. **Fix:** Keep row layout (label left, pill right); ellipsis label if needed.

#### 🟡 Categories index page hero stacks 3 full-width CTAs below 720px — `categories/+page.svelte:325-327`

**Fix:** Two-up CTAs at all sizes; full-width only <360px.

#### 🟡 Category slug page renders SearchQuestion above title — `categories/[slug]/+page.svelte:114`

Pushes the category title (the reason they're here) below fold. **Fix:** Demote search; move below H1.

#### 🟡 CategoryItem `showChildren` defaults to true at every level — `CategoryItem.svelte:8`

50-leaf topic dumps the whole tree on mobile. **Fix:** Default `false` for level ≥ 2; expand on tap.

#### 🟡 `displayedCategories` is unbounded — `+page.svelte:47, 413-424`

40+ categories overflow the height-capped 128px chip box. **Fix:** Top 10-12 chips with "+ N more" expanding to a sheet.

---

## Blog routes

### Article body & typography

#### 🔴 Mobile body kills the gutter — content edge-to-edge with negative margins — `src/scss/blog.scss:996-1019`

`.blog` sets `padding: 0.5rem 0.25rem !important; margin: 0 !important;` and images get `max-width: calc(100% + 0.5rem); margin-left: -0.25rem;`. Eliminates whitespace; can clip on iOS rounded corners. `!important` fights per-page rules. **Fix:** Drop negative margin on `img`; set `padding: 0.75rem 0.875rem`; remove `!important`.

#### 🔴 Body paragraph drops to 0.9rem (~14.4px) on `<= 480px` — `blog.scss:1058`

**Fix:** Floor at `1rem` (16px); only shrink secondary chrome.

#### 🔴 Each [slug] template duplicates `:global(p)` mobile typography — `community/[slug]`, `enneagram-corner/[slug]/+page.svelte:299`, `personality-analysis/[slug]/+page.svelte:709`, `pop-culture/[slug]/+page.svelte:475`, `how-to-guides/[slug]`

Same rule, different sizes per template. **Fix:** Hoist to one `<ArticleBody>` SCSS partial; delete the duplicates.

#### 🟡 H1 collapses to 1.5rem (~24px) at `max-width: 500px` — `ArticleTitle.svelte:63-67`

Long titles wrap to 4-5 lines; loses presence. **Fix:** `clamp(1.625rem, 6vw, 2rem)` + `text-wrap: balance`.

#### 🟡 Personality-analysis `padding: 1rem` overridden by `!important` from blog.scss — `personality-analysis/[slug]/+page.svelte:673`

Per-page intent silently ignored. **Fix:** Remove `!important` from blog.scss.

#### 🟡 H2/H3/H4 spacing fights `padding-top` rule — `blog.scss:27-43`, `personality-analysis/[slug]/+page.svelte:517-543`

Headings end up with inconsistent breathing room across pages. **Fix:** Pick one source; remove the bare `> h2/h3/h4` rules from blog.scss.

#### 🟡 TOC click handler hardcodes 80px header offset — `TableOfContents.svelte:588`

Doesn't match actual mobile header height. **Fix:** Read `header.offsetHeight + 8` at click time.

#### 🟢 First-letter decoration uses fixed 1.5rem — doesn't scale — `blog.scss:81-85`

**Fix:** `font-size: 1.75em` (relative).

#### 🟢 Article meta date "Updated" pill green low-contrast at 13px — `ArticleSubTitle.svelte:119-126`

**Fix:** Bump to 14px on mobile; verify contrast.

### Callouts, tables, code, embeds

#### 🔴 Markdown tables `display: block` + `white-space: nowrap` on mobile — `blog.scss:1035-1048`

Scrollable but `nowrap` forces every cell to one line; no scroll affordance. Users see first 2 columns, miss the rest. **Fix:** Drop `nowrap`; add right-edge gradient mask hint; sticky first column for type-comparison tables.

#### 🔴 8 callout classes use `margin: ... -0.25rem` for edge bleed — `blog.scss:763-872`

Combined with article's `padding: 0.5rem 0.25rem !important`, every callout sits flush to screen edge. iOS rounded corners + edge swipe-back = visual + interaction conflict. **Fix:** Restore minimum `0.5rem` outside gutter; reserve true edge-to-edge for one element at a time.

#### 🔴 No `word-break` on table cells with long URLs — `blog.scss:967-991`

Table balloons wider than viewport; URLs become non-tappable. **Fix:** `word-break: break-word; overflow-wrap: anywhere;` on mobile `td a`.

#### 🔴 Code blocks 12px on small mobile — illegible — `blog.scss:1066`

**Fix:** Floor at `0.85rem`; rely on `overflow-x: auto` for width.

#### 🟡 `.iframe-container { min-height: 280px }` letterboxes embeds — `blog.scss:148-152`

16:9 video on 360px phone needs ~202px height; pinning to 280px wastes space. **Fix:** `aspect-ratio: 16/9`.

#### 🟡 VisualMetaphor icon `top: -10px` collides with prior baseline — `VisualMetaphor.svelte:153-157`

**Fix:** `top: -14px` + `margin-top: 1.5rem` parent on mobile.

#### 🟡 TypeQuotes long unbroken word overflows `.type-quote__text` — `TypeQuotes.svelte:174-176`

**Fix:** `overflow-wrap: anywhere`.

#### 🟡 InsightBox 0.85rem text inverts hierarchy — `InsightBox.svelte:152-154`

Insight boxes carry the most important takeaways but get smallest text. **Fix:** Match body 1rem.

#### 🟡 Checklist 18×18 checkbox tap target — `Checklist.svelte:114-116`

**Fix:** 22×22 visual + label padding for 44×44 hit zone.

#### 🟡 Blockquote negative margin pushes accent border off-screen — `blog.scss:155-165`

**Fix:** `margin: 1rem 0` on mobile.

#### 🟢 Inline code `font-size: 0.9em` fine; minor wrap awkwardness — `blog.scss:961-965`

#### 🟢 EnneagramDiagram caps at `max-width: 22rem` — already responsive — `EnneagramDiagram.svelte:374-388`

### `/personality-analysis` (DB-driven)

#### 🔴 Three sidebars look up `main.column-width` selector that doesn't exist — `EnneagramCTASidebar.svelte:135`, `TableOfContents.svelte:560`, `PeopleSuggestionsSideBar.svelte:65`

All silently fall back to 1024px default. Position math runs against a phantom column on intermediate viewports. **Fix:** Add `class="column-width"` to `<main>`/`<article>`, or change lookup to `.article-body`/`.blog`.

#### 🔴 Hero PopCard 1:1 portrait crop pushes article body below fold — `personality-analysis/[slug]/+page.svelte:499-509, 680-682`

On mobile only `margin: 0.5rem 0` — internal max-widths still allow full-screen render. **Fix:** Cap hero `max-width: 320px` on mobile.

#### 🔴 Comments h3 has no visual divider — mistaken as another article subhead — `personality-analysis/[slug]/+page.svelte:441-465, 630-637`

**Fix:** Top border + section label like "Discussion (12)" + `<hr>` on mobile.

#### 🔴 RelatedPosts fetches client-side after mount — bottom of page blanks during fetch — `RelatedPosts.svelte:38-78`

4G fetch can take 800ms+. CLS hit. **Fix:** SSR the payload, or reserve fixed height with 6 skeleton placeholders.

#### 🟡 Hero face crops with center `object-fit: cover` — eyes lost on portraits — `PopCard.svelte`

**Fix:** `object-position: center 30%`, or per-personality `image_focal_y` column.

#### 🟡 Featured grid forces 4:3 on portrait photos — `personality-analysis/+page.svelte:1026-1031`

Crops portraits to landscape on phones. **Fix:** Keep `aspect-ratio: 3/4` on mobile.

#### 🟡 Comments lazy-load with `rootMargin: 200px` — bundle delay on fast scroll — `personality-analysis/[slug]/+page.svelte:312`

**Fix:** `rootMargin: '600px'` or trigger pre-load at 50% of article.

#### 🟡 No max-width on `.article-body` for personality-analysis — `personality-analysis/[slug]/+page.svelte:511-613`

On iPad portrait (768px), lines exceed 80 characters. **Fix:** `max-width: 70ch` for tablets+.

#### 🟡 PeopleSuggestionsSideBar `display: none` below 1024px — `PeopleSuggestionsSideBar.svelte:233-237`

Phone users get zero exposure to suggested personalities until bottom of page. **Fix:** Inline horizontal scroll strip after hero on mobile, or footer accordion above comments.

#### 🟢 ArticleSubTitle pipe separators "|" can render orphaned on wrap — `ArticleSubTitle.svelte:119-126`

### List pages (community, pop-culture, how-to-guides, enneagram-corner)

#### 🔴 Card descriptions hidden + titles 12px — `community/+page.svelte:752-754, 775-777`, `enneagram-corner/+page.svelte:1202-1204, 1308-1310`, `how-to-guides/+page.svelte:692-694, 716-718`

Wall of cropped titles, half ending in "...". **Fix:** Show 2-line description clamp at 0.8125rem; or 1-column instead.

#### 🔴 `.blog-card { aspect-ratio: 1 }` squeezes title against image — `community/+page.svelte:761-763`, `enneagram-corner/+page.svelte:1294-1297`, `how-to-guides/+page.svelte:702-705`

Gradient overlay too short for title contrast pad. **Fix:** `aspect-ratio: 4/5`; raise overlay opacity; 3-line clamp.

#### 🔴 Featured cards use inline `style="background-image: url()"` — no srcset, no lazy — `community/+page.svelte:166`, `pop-culture/+page.svelte:139`

200×200 cards download 1200×1200 source. LCP hit on 4G. **Fix:** `<img loading="lazy" srcset sizes>` with `object-fit: cover`.

#### 🔴 Personality-analysis featured grid `loading="eager"` for every card — `personality-analysis/+page.svelte:174-179`

No `srcset`. Eats 4G. **Fix:** Lazy all but the first; add `srcset` from personality image map.

#### 🔴 Hero h1 gradient text via `background-clip: text` may render transparent on old Android Chrome — `personality-analysis/+page.svelte:347-358`

**Fix:** `@supports not (background-clip: text) { color: var(--accent-light); }` fallback. Repeated across all hub pages.

#### 🟡 `.index-link-band` horizontal scroll has no scroll-snap — `community/+page.svelte:119-138`, `personality-analysis/+page.svelte:140-149`

Users land mid-pill. **Fix:** `scroll-snap-type: x proximity` + `scroll-snap-align: start`.

#### 🟡 Personality nav-pill `.type-name` hidden below 640px — only "1 2 3 4 5 6 7 8 9" — `personality-analysis/+page.svelte:1124-1126`

Newbies don't know "Type 5 = Investigator." **Fix:** Keep short name visible; reduce font-size to 0.7rem.

#### 🟡 Recent grid hides descriptions + clamps titles to 13px — `community/+page.svelte:751-754`, `enneagram-corner/+page.svelte:1202-1204`

Cards visually identical; recency-affordance fails. **Fix:** Keep title 2-line at 0.875rem; bigger recency badge.

#### 🟡 Hover `transform: translateY` sticks on touch — multiple hub pages

**Fix:** `@media (hover: hover) { ... }`.

#### 🟡 How-to-guides hero has no subtitle — `how-to-guides/+page.svelte:100-102`

Empty above-fold. **Fix:** One-line tagline.

#### 🟡 SuggestionsBlog `min-height: 200px` clips long titles — `SuggestionsBlog.svelte:161-168`

**Fix:** `min-height: auto`; clamp titles to 3 lines.

#### 🟡 Hero radial-gradient blob in fixed pixels overflows narrow phones — `community/+page.svelte:326-336`, `personality-analysis/+page.svelte:336-345`

Visible glow halo on either side at 360px. **Fix:** `width: min(400px, 80vw)`.

### `/stories/enneagram-and-mental-illness` (light touch only — preserve SEO)

> Per memory: this is the top-traffic blog. Apply only light-touch CSS-only fixes; no title/slug/structure changes.

#### 🟡 AMP Story `<p>` at 1.1em wraps bullets to 4-5 lines — `stories/.../+page.svelte:147-150`

**Fix (light-touch):** `<p>` to 1em; `.type-list li` to 0.95em.

#### 🟡 `.overlay { max-height: 80%; padding: 2em }` clips Type 1 bullets on 360×640 — `stories/.../+page.svelte:152-160`

**Fix (light-touch):** `padding: 1.25em`; `<li>` margin from 0.7em to 0.5em.

#### 🟡 No 16px floor for AMP body — `stories/.../+page.svelte:147`

**Fix:** Add `body { font-size: 16px }` in `<style amp-custom>`.

---

## Auth · login, register, account, intake

### `/login`, `/register`, `/signup`

#### 🔴 Email/password inputs drop to 0.9rem (~14.4px) at `<= 480px` — `login/+page.svelte:271`, `register/+page.svelte:295`

iOS auto-zooms on focus. First impression of signup is a viewport jolt. **Fix:** Set inputs to `font-size: 16px` minimum at all breakpoints.

#### 🔴 Login form has no `autocomplete` or `inputmode` — `login/+page.svelte:133-138`

Password managers can't populate; email keyboard doesn't surface "@". **Fix:** `autocomplete="email" inputmode="email"` on email; `autocomplete="current-password"` on password.

#### 🔴 Register form missing `autocomplete="new-password"` and email autofill — `register/+page.svelte:143-154`

Browsers won't offer "suggest strong password." **Fix:** `autocomplete="email" inputmode="email"` on email; `autocomplete="new-password"` on password; consider `minlength="6"`.

#### 🔴 No password visibility toggle on register/login — `login/+page.svelte:137`, `register/+page.svelte:147-154`

Mistyped passwords on soft keyboard cause abandonment. **Fix:** 44×44 reveal button toggling `type` between password/text.

#### 🔴 No password strength feedback during register — `register/+page.svelte:147-154`

Any password accepted silently; users learn after server bounce. **Fix:** `minlength="6"` + inline strength hint matching resetPassword.

#### 🟡 Errors routed only to top-of-screen toast — may render off-screen above keyboard — `login/+page.svelte:86`, `register/+page.svelte:94`

**Fix:** Inline `role="alert"` block above submit; match forgotPassword/resetPassword pattern.

#### 🟡 reCAPTCHA renders bare without container — clips on <360px viewports — `login/+page.svelte:139-141`, `register/+page.svelte:163-165`

Standard widget is 304px wide. **Fix:** Wrap in `display: flex; justify-content: center; overflow-x: auto`; or `compact` size on mobile.

#### 🟡 Login/Register tab anchors have ~50px tap area — `login/+page.svelte:120-123`, `register/+page.svelte:129-133`

**Fix:** 44px tap target padding, or proper segmented-control component.

#### 🟡 `/signup` is a confetti landing dead-end — `signup/+page.svelte:166-172`

350 confetti particles; doesn't connect to `/register`. **Fix:** Redirect `/signup` → `/register`, or drop NUM_CONFETTI to <50 on mobile.

#### 🟡 Email-Invite input lacks 16px and autocomplete — `Email-Invite.svelte:79-86`

Used on `/signup` and elsewhere — every instance triggers iOS zoom. **Fix:** `font-size: 16px; autocomplete="email" inputmode="email"`.

#### 🟢 Honeypot fields correctly off-screen and `aria-hidden` — `register/+page.svelte:158-161`

Confirming positive baseline.

### Password reset flows

#### 🔴 Reset-password inputs lack `autocomplete="new-password"` — `resetPassword/+page.svelte:82-104`

Password managers won't generate or store. **Fix:** Add to both fields.

#### 🔴 Reset-password "confirmPassword" missing `name` attribute — `resetPassword/+page.svelte:98-104`

Field never serializes into POST body; server-side double-check impossible. **Fix:** Add `name="confirmPassword"` and re-validate server-side, or remove confirm field.

#### 🟡 Forgot-password email lacks `autocomplete`/`inputmode` — `forgotPassword/+page.svelte:117-124`

**Fix:** Add both.

#### 🟡 Inputs at `font-size: 1rem` brittle if global root size shifts — `forgotPassword/+page.svelte:209`, `resetPassword/+page.svelte:185`

**Fix:** `font-size: max(1rem, 16px)` or `16px` literal.

#### 🟡 Reset-password redirect timer not announced to screen readers — `resetPassword/+page.svelte:24-31, 57-61`

**Fix:** `role="status" aria-live="polite"` on success-message.

#### 🟡 Forgot-password success/error blocks not announced — `forgotPassword/+page.svelte:109-112, 127-131`

**Fix:** `role="alert"` on error; `role="status" aria-live="polite"` on success.

#### 🟢 Reset-password validation logic clean — confirms `passwordsMatch`, `isValidPassword`, `canSubmit` — `resetPassword/+page.svelte:20-22`

Pattern to copy.

### `/account`

#### 🔴 Account profile inputs at `font-size: 0.95rem` — borderline iOS zoom — `account/+page.svelte:263-269, 274-280, 624`

**Fix:** Bump `.field input` to 16px.

#### 🔴 No way to change email or password — `account/+page.svelte`

Mobile users can't self-serve common actions. **Fix:** Add "Change password" link (deep-link to `/forgotPassword` is acceptable stopgap) and "Delete account" affordance.

#### 🔴 "Save changes" is `type="button"` with no form fallback — `account/+page.svelte:319-331`

Mobile keyboard "Go" key does nothing; no Enter-to-submit. **Fix:** Wrap in `<form on:submit|preventDefault={save}>`.

#### 🟡 Type-card grid 2-column at 720px stays 2-up at 480px — `account/+page.svelte:660-665, 860-862, 891-893`

Long type names risk truncation; 0.84rem font reduces clarity. **Fix:** `grid-template-columns: repeat(auto-fit, minmax(140px, 1fr))`, or single-column <360px.

#### 🟡 Sign-out gets equal weight to Admin link — `account/+page.svelte:228-245, 864-875`

Two stacked full-width buttons of similar visual weight. **Fix:** Sign-out → secondary; add Modal2 confirm.

#### 🟡 Save errors only via toast (may render off-screen) — `account/+page.svelte:170-213`

**Fix:** Inline `<p role="alert">` near save button.

#### 🟡 `selectType` doesn't scroll selection feedback into view — `account/+page.svelte:215-217`

**Fix:** `scrollIntoView({ block: 'nearest' })` on `.type-note`.

#### 🟡 No inline "unfollow" on subscriptions list — `account/+page.svelte:362-374`

Users navigate to question to unfollow; tedious on mobile. **Fix:** 44×44 unfollow button per row + Modal2 confirm.

#### 🔴 `/account/unsubscribe` admin-grade table at non-admin route — `account/unsubscribe/+page.svelte:56-101`

Renders table of all signups + "Refresh all cyphers" admin button. PII leak risk if access control wrong. **Fix:** Verify `+page.server.ts` gates on admin; if admin-only, move under `/admin/`.

#### 🟡 Unsubscribe confirm uses `btn-primary` on destructive "Yes" — `account/unsubscribe/[slug]/+page.svelte:36-41`

**Fix:** `btn-danger` on Yes; stack vertically on mobile with safe action on top.

### `/intake/[token]`

#### 🔴 All inputs at `font-size: 0.95rem` — 7 viewport jolts per submission — `intake/[token]/+page.svelte:663`

**Fix:** `font-size: 16px`.

#### 🔴 Section navigation breaks on mobile back button — `intake/[token]/+page.svelte:11, 25-37`

`currentSection` is local state; back button exits the intake entirely. **Fix:** Mirror to URL hash (`#section-3`); `beforeunload` warning if dirty.

#### 🔴 Required textarea validation no `aria-required`, no error-jump-to-field — `intake/[token]/+page.svelte:225-249`

User on section 7 doesn't know section 2 has unfilled required fields. **Fix:** On submit failure, jump to first invalid section + scroll + focus.

#### 🔴 Submit button doesn't use LoadingButton; manual `disabled` + string text — `intake/[token]/+page.svelte:507-528`

No spinner; double-tap risk on slow networks. **Fix:** `<LoadingButton type="submit" loading={isSubmitting} loadingText="Submitting..." fullWidth>`.

#### 🔴 No autosave / draft persistence — `intake/[token]/+page.svelte:157-172`

Phone calls, app-switches, accidental backgrounding flush WebView. **Fix:** Debounced localStorage autosave keyed on token.

#### 🟡 Progress bar fill from `currentSection / totalSections` — misleading — `intake/[token]/+page.svelte:142-147`

User on section 7 with no fields = 100% bar. **Fix:** Either label "Section X of Y" only, or compute from filled-required.

#### 🟡 Form-navigation Next/Previous not sticky — `intake/[token]/+page.svelte:518-528`

Long sections (5 textareas) require scrolling past everything to find Next. **Fix:** `position: sticky; bottom: 0` + backdrop-blur.

#### 🟡 Radio descriptions use `margin-left: 1.5rem` — overflow risk — `intake/[token]/+page.svelte:705-747`

**Fix:** `padding-left: 1.5rem`.

#### 🟡 Timezone is free-text input — users break canonical IANA zone — `intake/[token]/+page.svelte:486-495`

"Eastern", "EST" mistypes destroy calendar invites. **Fix:** Read-only display + hidden input, or `<select>` of common zones.

#### 🟡 No "Section saved" confirmation between sections — `intake/[token]/+page.svelte:25-30`

Combined with no autosave = users worry about persistence. **Fix:** Inline status on section change.

#### 🟢 `scrollToTop` on section change is correct — `intake/[token]/+page.svelte:39-41`

### Enneagram-Select & shared form atoms

#### 🔴 Enneagram-Select uses radial 80×80 buttons in 140px radius — clips on 360px — `Enneagram-Select.svelte:117-131, 211-253`

At 80°/120°/240°/280° angles, button centers sit ~140px from center; with 80px diameter, menu extends ~220px left/right of center. Goo filter further obscures hit boxes. **Fix:** Replace with the flat 3×3 grid pattern from `/account` (already accessible and mobile-tested).

#### 🔴 Enneagram-Select hardcodes `id="menu-open"` — duplicate instances break each other — `Enneagram-Select.svelte:13, 24, 30`

Comments form + account form on same screen → opening one toggles both. **Fix:** Generate unique ID per instance; `bind:this` instead of `getElementById`.

#### 🔴 Enneagram-Select buttons no `aria-label`, missing role=radio — `Enneagram-Select.svelte:45-99`

Screen reader hears "two, three, four... nine, one" with no context. **Fix:** `aria-label="Type 2 - Helper"`; `role="radiogroup"` + `role="radio" aria-checked` (port from `/account` line 290-307).

#### 🟡 Enneagram-Select hardcodes `rgb(190, 38, 215)` and `var(--black)` — `Enneagram-Select.svelte:119, 125-126, 183-185`

Diverges from `--type-N-color` token system. **Fix:** Use design tokens.

#### 🟡 Modal2 close button is 32×32 — `Modal2.svelte:106`

**Fix:** `h-11 w-11`.

#### 🟡 Modal2 doesn't dodge soft keyboard or iOS safe-area — `Modal2.svelte:96-128`

`max-h-[90vh]` doesn't account for keyboard; content pushed under. **Fix:** `max-h-[90dvh]`; `padding-bottom: env(keyboard-inset-height, 0)`; `env(safe-area-inset-bottom)`.

#### 🟡 Modal2 `disableClose` doesn't suppress visible X button — `Modal2.svelte:34-37, 102-123`

X is rendered but does nothing. Confusing. **Fix:** Conditional render: `{#if !disableClose && !navTop}<button class="...">×</button>{/if}`.

#### 🟡 LoadingButton md size ~36px tall — under 44 — `LoadingButton.svelte:140-143`

Used on Account sign-out. **Fix:** `padding: 0.75rem 1rem` for ~44px, or force `lg` on mobile.

#### 🟡 `/enneagram-test` is meta-refresh client-side redirect — bad SEO, slow on mobile — `enneagram-test/+page.svelte:1-30`

**Fix:** Server-side redirect (`+page.server.ts` returning `redirect(301, '/questions')`).

#### 🟢 Modal2 portal + body scroll-lock with refcount is correct — `Modal2.svelte:39-50, 53-63`

---

## Admin panel

### Admin shell & navigation

#### 🟢 Mobile drawer pattern is solid — `admin/+layout.svelte:357-415`

16-item nav collapses to 280px slide-in drawer, sticky header, hamburger toggle, auto-close on nav. This is the bar other pages should clear.

#### 🟡 Hamburger 40×40 — `admin/+layout.svelte:151-160`

**Fix:** `min-width: 44px; min-height: 44px`.

#### 🟡 Drawer width 280px / 85vw cramped on iPhone SE — `admin/+layout.svelte:370-371`

Acceptable; spot-check on real device.

### Dashboard + analytics

#### 🟡 LineChart has no touch handlers — tooltip never appears on mobile — `LineChart.svelte:357-403`

DJ checks visitor/comment trends from his phone; data values currently unreadable beyond gross shape. **Fix:** Add touch handlers using `d3.pointer`; bind `touchstart`/`touchmove`. Always render latest data point's value as a label so non-interactive view still gives a number.

#### 🟡 Tooltip uses `event.pageX/pageY` — off-screen when chart is mid-page — `LineChart.svelte:393-395`

**Fix:** Position relative to chart container; clamp to `window.innerHeight - tooltipHeight - 16`.

#### 🟡 Cohort tables only `overflow-x: auto` on mobile — 8-12 columns of percentages — `RetentionAnalyticsPanel.svelte:555,662,971,1047,1226-1227`

Effectively unusable for spot-checking on phone. **Fix:** Apply `data-label` card transform for overview/source tables; matrix and weekly can stay scrollable (heatmap-shaped).

#### 🟡 Heatmap table forces 980px min-width — `analytics/+page.svelte:3170-3175`

Acceptable as-is for grid-shaped data; add scroll affordance. **Fix:** Right-edge gradient mask or "scroll →" hint.

#### 🟡 Reindex modal column-reverse stacks Cancel above Start — verify intentional — `admin/+page.svelte:599-616, 1251-1257`

Primary at bottom for thumb is correct; just confirm.

#### 🟢 Pageview table converts to card layout at 700px — `analytics/+page.svelte:4133-4222`

Right pattern.

### Tables (comments, questions, users, categories)

#### 🔴 Categories table only horizontal-scroll on mobile — no card transform — `categories/+page.svelte:428-498, 847-862`

7-column live category table; mobile breakpoint forces `min-width: 120px` per column = ~840px wide. Action column has 4 small buttons. Worst-case data table on the site. **Fix:** Add `data-label` attributes; apply the existing card-transform CSS used in users/email-dashboard/welcome-sequence/analytics.

#### 🟢 Users table converts to card layout via data-label — `users/+page.svelte:1377-1465`

Canonical pattern. Template for fixing categories.

#### 🟢 Comments page is already card-based — `comments/+page.svelte:258-303, 882-915`

Approve/Remove buttons stretch full-width at <=480px.

#### 🟡 Comments tabs ~28px tall, 11px font — `comments/+page.svelte:840-848`

**Fix:** Bump tab vertical padding to 10-12px; font to 0.8125rem.

#### 🟡 Comment date column wraps under actions on mobile — `comments/+page.svelte:897-906`

Acceptable; verify thumb reach.

#### 🟢 Questions list uses card pattern — `questions/+page.svelte:322-401`

#### 🟡 Question filter controls ~250-300px of chrome before first card — `questions/+page.svelte:234-319`

Search + Status + Category + 4 sort tabs all stack vertically. **Fix:** Collapse filters behind a "Filters" sheet on `<= 768px`; show only search + sort tabs by default.

#### 🟡 AdminQuestionItem modal Save button may hide under keyboard — `AdminQuestionItem.svelte:1088-1131`

**Fix:** Sticky footer at `<= 640px`.

### Email dashboard + welcome sequence

#### 🔴 EmailComposeModal textarea has no explicit font-size — iOS auto-zoom — `EmailComposeModal.svelte:380-388`

Most-annoying compose-flow bug. **Fix:** `.form-textarea { font-size: 16px; }` minimum on mobile. Same applies to `.search-input` and `.form-input`.

#### 🟡 Admin search/select inputs at 11-12px on mobile across pages — iOS zoom — `comments/+page.svelte:831-833`, `users/+page.svelte:1356-1361`, email-dashboard search-input

**Fix:** Global rule for admin: `input, select, textarea { font-size: 16px; }` at `max-width: 768px`.

#### 🟡 EmailComposeModal footer buried by keyboard on mobile — `EmailComposeModal.svelte:408-420, 722-745`

Footer is regular `<div>`, not sticky; `max-height: 100vh` doesn't respect keyboard. **Fix:** `.compose-footer { position: sticky; bottom: 0; }` with backdrop; use `100dvh`.

#### 🟡 Email tabs scroll horizontally but not sticky — `email-dashboard/+page.svelte:826-854, 2204-2214`

Easy to lose place when scrolling sent-email list. **Fix:** `.tabs { position: sticky; top: <admin-nav-height>; }` on mobile.

#### 🟢 Email dashboard data tables convert to card layout at <=640px — `email-dashboard/+page.svelte:2261-2329`

#### 🟡 EmailComposeModal Generate-with-AI / Preview buttons lose alignment when content-header column-stacks — `EmailComposeModal.svelte:358-373, 732-736`

Cosmetic. **Fix:** Group action buttons in row that wraps below label.

#### 🟢 Welcome sequence enrollment tables convert to cards at <=768px — `welcome-sequence/+page.svelte:1184-1239`

#### 🟡 Welcome sequence test-send Step select shows full subject text — overflows — `welcome-sequence/+page.svelte:177-217, 1245-1247`

Picking right test step requires reading subject. **Fix:** Step number in trigger; subject in `<small>` below.

#### 🟡 Welcome sequence funnel-bar count badges crammed inside ~36px-wide bars on mobile — `welcome-sequence/+page.svelte:235-253`

Numbers are the main signal. **Fix:** Show count to right of bar at `<= 640px`.

### Content board

#### 🟢 Content board forces list view on mobile + dedicated mobile search/filter sheet — `content-board/+page.svelte:26-31, 48-50, 496-550, 1140-1163`

Drag-and-drop kanban broken on touch — team correctly bypasses.

#### 🟡 Desktop view-toggle still renders on mobile — Board button creates broken state — `content-board/+page.svelte:584-633, 1910-1958`

Two view-toggles visible; tapping desktop one puts user in non-functional state until they scroll back up. **Fix:** Hide `.controls-row .view-toggle` at `max-width: 768px`.

#### 🟡 Kanban drag-and-drop has no touch fallback — iPad falls outside 768px — `content-board/+page.svelte:344-401`

**Fix:** Either keep breakpoint as cutoff, or add stage-change menu on card (3-dot → Move to stage).

### Other admin pages (low priority — informational only)

#### 🟡 Blog diff viewer 2-column with no responsive collapse — `BlogDiffViewer.svelte:173-215`

Per scope, mobile use implausible. Skip unless DJ wants it.

#### 🟢 Asset generators / poster / zine pages — desktop-only flows, no catastrophic findings

---

## Cross-Cutting Quick Wins

A few one-line fixes that close many findings simultaneously.

```scss
// src/scss/_mobile-foundations.scss (new)

// 1. Kill iOS auto-zoom across the entire site
:where(input:not([type='checkbox']):not([type='radio']):not([type='range']), select, textarea) {
	font-size: max(16px, 1rem);
}

// 2. Floor tap targets at 44×44 for any role-button or interactive icon
@media (pointer: coarse) {
	:where(button:not(.btn-text), [role='button'], a[aria-label]:not(.btn-text), .icon-button) {
		min-width: 44px;
		min-height: 44px;
	}
}

// 3. Fix the inverted reduced-motion mixin (already noted)
@mixin reduced-motion {
	@media (prefers-reduced-motion: reduce) {
		@content;
	}
}
@mixin allow-motion {
	@media (prefers-reduced-motion: no-preference) {
		@content;
	}
}

// 4. Long-string overflow defense for user-generated content
.user-text,
.comment-text,
.question-context,
td a {
	overflow-wrap: anywhere;
	word-break: break-word;
}
```

---

## Files With the Most Findings (by surface)

| File                                                   | Findings        |
| ------------------------------------------------------ | --------------- |
| `src/routes/+layout.svelte`                            | 8               |
| `src/lib/components/molecules/Comment.svelte`          | 11              |
| `src/lib/components/molecules/Header.svelte`           | 7               |
| `src/lib/components/molecules/Footer.svelte`           | 7               |
| `src/scss/blog.scss`                                   | 9               |
| `src/lib/components/atoms/FloatingParticles.svelte`    | 4               |
| `src/routes/+page.svelte` (homepage)                   | 14              |
| `src/routes/book-session/+page.svelte`                 | 12              |
| `src/routes/intake/[token]/+page.svelte`               | 9               |
| `src/lib/components/molecules/Enneagram-Select.svelte` | 4               |
| `src/lib/components/molecules/Interact.svelte`         | 6               |
| `src/routes/admin/categories/+page.svelte`             | 1 (high-impact) |

---

## Dead code candidates

Files not imported anywhere — safe to delete pending grep verification:

- `src/lib/components/molecules/MobileNav.svelte`
- `src/lib/components/molecules/mobile-ham.svelte`
- Dead `@keyframes scroll` blocks in `Carousel.svelte:165-179` and `FamousTypes.svelte:25-39`
- HTML-comment `cwebp` shell scripts in `Carousel.svelte:52-164`
- Dead `margin-bottom` on absolutely-positioned `.step-num` in `+page.svelte:2454`
- Dead `.library-button` rule under `@media (max-width: 899px)` in `Header.svelte:469-473` (mobile shell hides this branch)

---

## Progress Log

> Track fixes here as they ship. Mark each line with date completed.

- [ ] Cross-cutting: 16px input rule
- [ ] Cross-cutting: 44px tap target rule
- [ ] Cross-cutting: fix inverted `reduced-motion` mixin
- [ ] Cross-cutting: `overflow-wrap: anywhere` on user-text containers
- [ ] Site shell: delete or edge-restrict swipe-back gesture
- [ ] Site shell: wire up `headerVisible` scroll-hide OR delete dead code
- [ ] Site shell: bump ThemeToggle / account / hamburger / mobile-login to 44×44
- [ ] Site shell: delete `MobileNav.svelte` and `mobile-ham.svelte` (after grep verification)
- [ ] Site shell: drop FloatingParticles on `prefers-reduced-motion` and below 480px
- [ ] Homepage: collapse hero CTAs into the decision-fork on mobile
- [ ] Homepage: fix `Email-Invite.svelte` JSON parsing (silently broken)
- [ ] Homepage: add `setInterval` cleanup to `Carousel.svelte`
- [ ] Homepage: PopCardGroup floor `width: min(100%, 700px)`
- [ ] Homepage: PeopleBoard responsive grid via CSS not JS
- [ ] Homepage: famous-people grid `repeat(2, 1fr)` below 480px
- [ ] `/book-session`: fix `#top` → `#waitlist` anchor
- [ ] `/book-session`: add `scroll-margin-top` globally
- [ ] `/followme`: replace inline 560px iframe + side-by-side timelines
- [ ] Q&A: `font-size: 16px` on `Interact.svelte` composer + `Comment.svelte` reply
- [ ] Q&A: cap nested-comment indentation at depth 3
- [ ] Q&A: drop reactive `structuredClone` in `Comment.svelte:60-61`
- [ ] Q&A: replace 100-line `calculateFontSize` with CSS clamp
- [ ] Q&A: add `fullMobile` to edit/flag modals
- [ ] Q&A: localStorage autosave on `/questions/create`
- [ ] Blog: hoist mobile typography to one SCSS partial; floor `<p>` at 16px
- [ ] Blog: drop `!important` from `blog.scss` `.blog` mobile rule
- [ ] Blog: add `class="column-width"` to article `<main>` so sidebars find it
- [ ] Blog: convert hub-page card images to responsive `<img srcset>`
- [ ] Blog: add `<background-clip: text>` fallback to gradient h1s
- [ ] Blog: cap `/personality-analysis` hero PopCard at 320px on mobile
- [ ] Blog: add scroll-snap to `.index-link-band` across hubs
- [ ] Blog: stories light-touch `<p>` to 1em + `<li>` 0.95em
- [ ] Auth: replace `Enneagram-Select.svelte` with flat 3×3 grid pattern
- [ ] Auth: add `autocomplete` + `inputmode` to login/register/forgot/reset
- [ ] Auth: password visibility toggle on register/login
- [ ] Auth: `/intake/[token]` localStorage autosave + URL-hash sections
- [ ] Auth: `/account` "Save changes" wrap in `<form>`
- [ ] Auth: `/enneagram-test` server-side 301
- [ ] Auth: verify `/account/unsubscribe` admin gate (PII risk)
- [ ] Admin: add `data-label` + card-transform to `/admin/categories`
- [ ] Admin: `EmailComposeModal` sticky footer + `100dvh`
- [ ] Admin: LineChart touch handlers
- [ ] Admin: hide desktop view-toggle on mobile in content-board
- [ ] Admin: collapse `/admin/questions` filters behind sheet on mobile

---

**Audit complete.** 340+ findings, 6 surface areas, ~56 files cited. The biggest wins compound: the four cross-cutting rules at the top close ~80 findings on their own.
