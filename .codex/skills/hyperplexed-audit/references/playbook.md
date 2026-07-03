<!-- .codex/skills/hyperplexed-audit/references/playbook.md -->

# Hyperplexed Design Playbook

> Distilled UI/UX taste and method extracted from the [Hyperplexed](https://www.youtube.com/@Hyperplexed)
> YouTube channel, for use when auditing and polishing 9takes surfaces.
>
> **Source:** 20 transcribed videos (the design-judgment "I Redesigned Popular Websites" series, the
> bad-UI/good-UX commentary videos, and the signature interaction-effect tutorials) plus frame review
> of two videos. Raw transcripts live in `.claude/skills/hyperplexed-audit/references/transcripts/`
> and `.codex/skills/hyperplexed-audit/references/transcripts/`. Corpus completed 2026-07-01.
>
> **Why this exists:** Hyperplexed is the clearest working demonstration of _front-end taste_ on YouTube —
> not "here's a framework," but "here's exactly why this looks wrong and here's the small change that fixes it."
> His redesign videos narrate the _reasoning_ behind every micro-decision, which is precisely what an audit needs.
> Captured 2026-06-26.

---

## 0. How Hyperplexed actually works (the method)

These four habits matter more than any single rule. They're how he _finds_ the problems below.

1. **One feature at a time, top to bottom.** He breaks a page into discrete features and fixes each in isolation
   before moving on. He never tries to "redesign the page" — he redesigns the header, then the search, then the
   filters, then the bottom bar. _Audit the same way: enumerate surfaces, then go region by region._
2. **"All big problems are just small problems in disguise."** Build the crudest working version first (a white
   square that follows the mouse), then layer refinements one at a time. Every polished effect is a stack of
   tiny, individually-obvious steps. _When something feels too broken to fix, you haven't decomposed it yet._
   And don't over-engineer the invariant: fixed slot counts get hardcoded position values, and hand-placed
   tiles beat an algorithm you don't need ("perhaps they algorithmically determine the sizes and positions,
   but that seems unnecessary — let's just take 10 minutes to randomly size and position some divs").
3. **Steal taste from the best, on purpose.** He doesn't invent aesthetics — he keeps a reference library and
   adapts. Named references: **Linear, Vercel, Superlist, Mobbin, Google's Android app-drawer rounding,
   YouTube Music's subtle background gradients, Discord's vertical nav, Vercel's gradient-in-text/border.**
   He treats **Linear and Vercel as the explicit bar for "exceptional UI."**
4. **Two goals held together: "make it look good AND make it easy to use."** He refuses to optimize one at the
   expense of the other. Decluttering is in service of usability, not just minimalism.
5. **His named practice loop: Inspiration → Appreciation → Analyzation → Deconstruction → Reconstruction,
   rinse & repeat.** Interfaces everywhere (not just websites) can inspire; engage with _why_ something drew
   you in before dissecting it; turn "how the heck do I do this" into small questions ("how do I get some
   rectangles on the screen"); then solve them one at a time. This is habits 2–3 formalized as a training loop.

---

## 1. The taste checklist (use this as the audit rubric)

Each item is a recurring, named complaint from the redesign videos. These are the things his eye catches.

### Alignment & geometry

- [ ] **Alignment is sacred — it's his #1 recurring complaint.** Anything that doesn't align with something else
      reads as a defect. Classic example: a label wraps to a second line and pushes its image out of alignment
      with its row → switch the card to landscape and enforce a char-limit/ellipsis instead of letting it wrap.
- [ ] **A label must never knock its icon out of alignment.** When one item in an icon row has extra text and the
      rest don't, the icon shifts and the row looks broken. Fix the data, not by eyeballing.
- [ ] **Consistent corner-radius language.** Don't round most components and leave one square (his Google-doodle
      complaint). Advanced move: the **Android app-drawer trick** — larger radius on outer corners, smaller on
      inner corners, with a small gap between grouped elements.
- [ ] **`box-sizing: border-box`** so padding/border don't blow out intended widths (his nav-section thirds).

### Spacing & density

- [ ] **Even padding on all sides.** "The spacing around your search bar is different on each side" is an instant tell.
- [ ] **Kill unnecessary vertical space.** Narrow menus force text to wrap and waste height; widen the container.
- [ ] **No orphan padding.** Delete defensive padding that only existed for one edge case (the iOS fixed-bottom
      gap that "looks absolutely awful on phones where it's not necessary").
- [ ] **Don't squeeze images** with uneven padding above/below — size them so they "feel like they belong."

### Hierarchy & grouping

- [ ] **Differentiate with size/weight/color, not more elements.** Shrink a clumsy parenthesized date into a
      subtitle; style city/state/zip as subtext under the main address. "Don't make everything the same size and color."
- [ ] **Logo/element proportion must feel balanced** relative to neighbors (logo too big vs. the search bar).
- [ ] **Group by meaning; add separation between distinct actions.** "Even a tiny bit more separation clears
      things up" — if the brain should treat two things as separate actions, space them apart. Conversely, group
      things that belong together (content-interaction nav vs. personal/account nav at the bottom).
- [ ] **Don't co-locate items with different behavior** (a TV-shows tab living among movie _filters_ but acting
      like a _navigation_ link).

### Decluttering & consolidation

- [ ] **Reduce competing/redundant elements.** Three visible scrollbars → his single biggest annoyance. Collapse
      into one **"Filters" button that expands**, with **selected-state chips** below it.
- [ ] **Merge duplicate paths.** Two buttons that go to the same screen → one. Remove redundant tabs/text/labels.
- [ ] **Chips beat tabs+scroll-arrows** for filter sets — "a lot cleaner."
- [ ] **Hiding it admits it doesn't fit.** Don't tuck primary actions into a drawer/menu when they'd fit in the
      layout: "by default you hide your quick actions in a drawer… you are literally saying these items don't
      fit here normally but we're gonna stuff them in anyways" (Costco). If it's important enough to exist,
      find it a home in the flow — the drawer is for genuine overflow, not for dodging a layout problem.
- [ ] **Right component, wrong context is still a defect.** A well-designed section can fail purely by placement:
      "I appreciate your welcome sign… but I'm not on your home page, nor am I at the top of your page — this
      just feels out of place." Grade every element against _where it appears_, not just how it looks.

### Labels & microcopy (copy is part of the UI)

He treats copy as a design surface in nearly every redesign — rename before you restyle.

- [ ] **A label says exactly what the thing is, in the fewest unambiguous words.** "Call it like it is — it's a
      where, a how, and a when… keep it stupid simple" (Domino's section renames). "RT Podcast" → "Podcast",
      "TV Shows" → "TV" — shorten until just before ambiguity.
- [ ] **Vague friendliness loses to plain naming.** "Welcome" section → "My Account" (Costco). If a user can't
      predict what's inside from the label, the label failed.
- [ ] **Show the identifying information, not the incidental.** Google shortcut labels: the useful content is
      the bare domain (`twitter.com`) plus the page name — not a truncated `https://…` page title. Pick what
      the user actually scans for and display that.
- [ ] **Watch accidental adjacency readings.** Neighboring text can concatenate into something unintended:
      "spend and get" next to "extended" reads "spend and get extended" — off-putting. Read every label in
      context with its neighbors.
- [ ] **Renaming can dissolve a layout problem.** Several of his "redesigns" are really renames — a clearer,
      shorter label removed the wrap, the crowding, or the need for an explanatory element entirely. Try the
      copy fix before the CSS fix.

### Color & icons

- [ ] **Restrained, purposeful color.** One accent, applied where the eye needs it, balanced against branding.
      He frequently goes **dark theme**. Gradients only when _subtle_ (background wash, text/border accent,
      fade-out overlapping a seam). **Red + bold + caps promo text = off-putting.**
- [ ] **Icons: one uniform set, meaningful, contained.** "It's crazy how much of a difference better icons can
      make." Keep icons inside a fixed container so layout never depends on icon size/shape. Thin, consistent style.
- [ ] **Tint imagery toward the surface palette.** A photo shouldn't fight the surface's color story — when an
      image has "too much variation in the color," mute the saturation, hue-rotate toward the accent, and knock
      the opacity down until it reads as part of the surface rather than a rectangle pasted on top.

### Readability & images

- [ ] **Contrast for overlaid text.** Text on an image needs a darken/scrim behind it.
- [ ] **No too-bright text on a clashing background** ("extraordinarily bright and difficult to read").
- [ ] **Let images own their space**, overlap info on a scrim, and carve out space for action buttons within the image.
- [ ] **Cards carry data in a fixed priority order, and cap the noise.** His Steam card: title → **max three
      tags** → price → rating; everything else has to earn its space. Ragged, cut-off text at varying lengths
      plus a centered price with discount noise above/below it = the "cluttered" feel. Decide the order once,
      cap list-y metadata, and enforce it across every card of that type.

### Overflow & responsiveness (never leave it to chance)

- [ ] **Explicit overflow handling:** ellipsis / char-limit for long labels. "It seems silly to leave it up to chance."
- [ ] **Make scrollability obvious:** a distinct container so a cut-off edge clearly signals "more," or dynamically
      adjust padding so the last item aligns with the device edge.
- [ ] **Thumb ergonomics:** move primary actions (search) "closer to where the hand naturally rests," stick on
      scroll. Reconsider always-visible side nav on phones (toggle instead). Watch fixed-bottom cutoff on iOS.

---

## 2. Interaction & motion principles

From the effect tutorials and his most mature (2026) bad-UI/UX videos.

- **Motion should feel natural, not literal.** Never snap 1:1 to the cursor — add slight lag/easing so it
  "chills out and lags behind." Use `element.animate()` with a short duration + `fill: forwards`.
- **Constrain motion to its purpose.** The magic wand isn't free-roam: amplified horizontally near edges,
  limited vertically, rotates within a fixed ~20° range. Constraints make it feel _designed_.
- **Idle life.** A slow infinite rotate/scale/morph keeps a hero element feeling alive at rest.
- **Predictive physics for drag.** Use recent pointer velocity to compute a simulated resting place (throwable bubble).
- **The signature cursor-glow** (the "Linear/Vercel" feel): radial-gradient on a `::before`, position fed from
  `getBoundingClientRect()` on `mousemove` into CSS custom props, opacity transitioned in/out (~500ms). The
  **1px lit border** is faked by exposing a sliver around opaque content via z-index — and **neighboring cards
  react too**, driven by a single listener on the wrapper.
- **The "magic slider" — his most reusable interaction primitive.** Convert the pointer's position into a
  0→1 percentage of a container (`(x - rect.left) / rect.width`), then map that percentage onto _any_
  property range: wand rotation (−10°→+10°), reveal opacity (0→1), blur (1→0). "We've converted our entire
  screen to a range slider without actually requiring a range slider." One listener, one percentage, N
  properties — this is the skeleton under the wand, the glow, and the reveal effects.
- **Layout decision rule: flexbox for one dimension, grid for two.** His stated adage — a row or a column is
  flex; rows _and_ columns together are grid. He applies it per-region, including nested regions inside one card.
- **Surface a snapshot of a deeper page where the user already is.** The Domino's order-tracker gets a live
  snapshot version right inside the menu — the full page still exists, but the glanceable state comes to you.
  (Same instinct as selected-filter chips: show the state without the trip.)
- **Transitions earn the polish label too.** Menu open on Domino's: blur the background content and scale it
  up slightly behind the panel — depth without an opaque overlay. Cheap, and it makes the surface feel layered.
- **Polish = the unglamorous states.** Even his _joke_ bad-UI project ships a success screen, a "generate new
  code" action, and a hint affordance. His bar: "passable on sites known for exceptional UI such as Linear, Vercel."
- **Forgiving hover: delay the exit, never the entry.** When a shared indicator moves between fixed targets
  (the card-picker arm; same shape as a tab underline or nav pill), set transition-delay to zero while _any_
  target is hovered and a short delay only on full de-hover — passing the cursor between targets never snaps
  the indicator home. "We really only need the delay on dehover, not on rehover." (→ P17)
- **Anticipation easing for showpiece motion.** Default `ease` is "typically fine for basic interactions" but
  feels unnatural on a hero move; drag the cubic-bezier into negative progression at the start so the element
  visibly winds up before takeoff — "what the brain perceives as anticipation." And tune durations downward by
  feel: his hovers start at 1s and land around 600ms.
- **One timing owner.** Never split one cycle between a CSS animation and a JS interval — "all sorts of timing
  issues that just ended up making it look plain bad." If JS owns repositioning, let JS own the stagger and
  loop too. Restarting a finished CSS animation from JS requires the DOM-reflow trick (set `animation: none`,
  read a layout property, restore) — use sparingly; reflow is expensive.
- **Pivot the representation until it can animate.** When a property won't animate, rebuild the same visual
  from one that will: a repeating-linear-gradient's position can't animate → a _normal_ gradient tiled by a
  tiny `background-size` produces the identical pattern and pans freely; `object-fit` takes no percentage →
  swap the `<img>` for a `background-image` so `background-size`/`position` can move.
- **JS writes state; CSS renders it.** Across every tutorial the JS converges on setting a data attribute
  (`data-selected`, `data-type`, `data-hidden`) or a CSS custom prop, with the stylesheet owning all
  presentation. Keeps handlers tiny and makes reduced-motion gating a pure-CSS concern.
- **Hidden ≠ inert.** Anything animated out of view is still clickable and tabbable — set `disabled` (or
  `inert`) at the same moment you translate it away.
- **A cursor ornament must communicate, and must never intercept.** His "intelligent" trailer rules: always
  `position: fixed`, top z-index, `pointer-events: none`; and make it earn its existence by reacting to
  context — `e.target.closest('.interactable')` answers "am I over something," a `data-type` attribute picks
  the icon. Weigh any such ornament against his own gratuitous-overlay rule below.
- **Spotlight the hovered item by dimming the set.** CSS-only via `:has()`: when the group contains a hovered
  highlight item, drop the opacity of everything except that item — focus without moving anything. (→ P16)
- **Micro-interactions "that barely make a difference functionally" are what make it enjoyable.** His stated
  philosophy while building the card selector: scale up slightly on hover, down on active, and sweat the exit
  timing curve. In-repo this is exactly what `.pressable` encodes — audits should check every interactive
  element either uses it or has a deliberate reason not to.
- **Per-letter control: split display text into spans.** The explosive-hover skeleton: wrap each letter in its
  own `inline-block` span (generated by a function, never hand-authored) so letters can transform
  independently. Display/marketing text only — and the wrapper must keep an `aria-label` with the original
  string, since span-splitting shreds the accessible name.
- **The seamless gradient-text loop** (Linear's "magic text"): `background-clip: text` + transparent fill,
  `background-size: 200%`, pan the position on infinite repeat — and make the gradient's **start and end
  colors identical** so the loop has no visible seam. (→ P18)

### Accessibility & restraint (his most mature take — weight these heavily)

- **Respect `prefers-reduced-motion`** → fall back to simple fade-ins.
- **Full keyboard operability is "next level," not optional:** tab to focus, space/enter to toggle, delete to
  remove, arrows to reposition, ctrl+arrow for max jumps. _"I am a developer and therefore need to operate
  this entire flow via my keyboard."_
- **Hate gratuitous overlays.** "I hate anything that sits on top of the UI unnecessarily." A persistent on-screen
  toggle with an easily-accessible alternative is "purely an annoyance." If an overlay must exist, make it
  movable/dismissible and delightful.

---

## 3. Applying this to 9takes

9takes's design system is **Streetlamp Symposium V5** (`docs/design-system.md`): sodium-amber light
(`--lamp-*`), warm-stone surfaces (`--night-*`, `--stone-*`), editorial ink (`--ink-*`), data teal
for dossier/stat moments, and Enneagram type colors as data only. The Hyperplexed rubric is highly
compatible with that posture: restrained palette, borders before shadows, dense-but-readable editorial
surfaces, and one intentional signature moment when earned.

**Highest-leverage Hyperplexed lenses for a 9takes audit:**

1. **Alignment & even padding sweep** — go region by region on high-traffic surfaces (`/questions`,
   question detail, blog indexes/articles, `/personality-analysis`, admin pages, sign-up/coaching flows)
   and flag any element that does not align to a shared edge or carries asymmetric padding.
2. **Declutter via consolidation** — look for redundant nav/tabs, duplicate paths to the same view,
   always-visible filter sprawl, and visible nested scroll regions that could become a Filters button
   plus selected chips.
3. **Hierarchy by type, not addition** — demote secondary metadata to `--ink-mid`/`--ink-dim`, smaller
   size, mono labels, or subtext instead of adding containers, cards, dividers, or badges.
4. **V5 token discipline** — use `--lamp-*`, `--stone-*`, `--night-*`, `--ink-*`, semantic tokens,
   and type colors by role. No raw color-name Tailwind classes in `src/`; no off-scale radii.
5. **Radius and shadow discipline** — `rounded-md` (10px) for buttons/inputs/chips, `rounded-xl`
   (16px) for cards/modals/banners, `rounded-full` only for true pills/avatars/dots/spinners.
   Static UI uses borders; shadows are for hover/floating UI.
6. **Overflow is explicit** — audit every label, title, person name, question, answer, tag, and email
   that can run long for truncation, line clamps, or a mobile fallback.
7. **Icons and imagery** — 9takes has no canonical icon atom yet. Prefer `lucide-svelte` for new line
   icons, keep stroke weight/box size consistent, and use scrims whenever text sits over imagery.
8. **Motion restraint + a11y** — respect `prefers-reduced-motion`; verify keyboard operation of any
   custom control; remove gratuitous overlays; prefer `Button`, `Modal`, and `Callout` atoms when applicable.
9. **One signature delight, done well** — cursor glow, spotlight dimming, forgiving indicators, or
   gradient text can work on marketing/editorial surfaces, but at most one per surface and always
   reduced-motion safe.
10. **Labels before layout** — sweep button labels, section headers, nav items, empty states, and form
    helper text. The copy fix often dissolves the CSS problem.

**The workflow around this playbook:**

- **`/hyperplexed-audit <surface>`** (`.claude/commands/hyperplexed-audit.md`) — the entry point.
  Runs the whole loop: locate + prior art → region-by-region static audit → tiered findings with
  `→ P#` citations → **stop for DJ's approval** → apply approved fixes → verify → update the
  tracker and audit doc. Prefer invoking this over running an audit ad hoc.
- **[`HYPERPLEXED_AUDIT_TRACKER.md`](./HYPERPLEXED_AUDIT_TRACKER.md)** — the rollup: which surfaces are
  audited, what shipped, what's still unaudited, and the verification (before/after screenshot) status.
  Start there to pick the next surface; every new audit gets a row.
- **[`HYPERPLEXED_FIX_PATTERNS.md`](./HYPERPLEXED_FIX_PATTERNS.md)** — the fix side of the rubric: each
  recurring finding mapped to its 9takes-native recipe (V5 tokens, local atoms, Svelte 5), so
  audits link to a pattern instead of re-deriving the fix.
- **Audit method:** grade the rendered markup region by region against §1–§2 (static pass), then confirm
  color/contrast and real-device behavior with a live pass (`pnpm dev`, localhost:5173). Cross-reference
  `docs/design/2026-06-09-design-audit.md`, `docs/design/2026-06-11-mobile-audit.md`, and relevant
  `docs/audits/*` files so findings stack instead of duplicate.

---

## 4. Video index (what's in the bundled `references/transcripts/`)

**Tier 1 — design judgment (the taste core):**

- `redesign-rottentomatoes-craigslist`, `redesign-amazon-google`, `redesign-costco-dominos`,
  `redesign-quora-steam` — the four "I Redesigned Popular Websites" episodes; richest reasoning.
- `bad-ui-professional-grade`, `terrible-ux-exceptional` — what makes UX bad, and his accessibility-forward bar.
- `optimal-website-header`, `easiest-website-menu`, `perfect-website`, `website-theme-1996` — anatomy of
  clean headers/menus/grids and the magic-wand reveal.

**Tier 2 — interaction polish:**

- `hover-effect-asap` (signature multi-card cursor glow), `addicting-interactivity` (mouse-trail gallery),
  `website-feature-demands` (lagging blurred blob follower).
- `how-to-slay-with-css` (card-select interface: forgiving hover delay, anticipation easing, hidden ≠ inert),
  `frontend-skills-to-the-moon` (the 5-step practice loop + pannable gallery),
  `extraordinary-from-ordinary` (animated scan-lines + Ken Burns pan; representation pivots),
  `unfiltered-frontend-thought` (narrated raw method: gradient link underline, duration tuning by feel),
  `mouse-trailer-intelligent` (context-aware cursor trailer),
  `explosive-hover-effect` (per-letter scatter + `:has()` spotlight dimming),
  `effect-shouldnt-be-possible` (Linear magic gradient text: one timing owner, DOM-reflow restart).
  _Pulled 2026-07-01; nothing remains deferred._ (Optional watchlist of 4 further effect videos lives in
  [`TRANSCRIPT_BACKLOG_TASK_2026-07-01.md`](./TRANSCRIPT_BACKLOG_TASK_2026-07-01.md) §1.)

The 1hr polyrhythm visualizers, particle-art, AI-tracker, and parody videos were intentionally skipped
(entertainment, not design lessons).
