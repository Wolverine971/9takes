<!-- docs/design/hyperplexed/HYPERPLEXED_FIX_PATTERNS.md -->

# Hyperplexed Fix Patterns - 9takes Recipes

> The fix side of the [HyperPlexed Design Playbook](./HYPERPLEXED_DESIGN_PLAYBOOK.md). The playbook
> tells you what's wrong; this doc tells you the 9takes-native fix, so each audit links a finding to
> a pattern number instead of re-deriving the recipe.
>
> Conventions assumed everywhere: **Streetlamp Symposium V5 tokens** (`--lamp-*`, `--night-*`,
> `--stone-*`, `--ink-*`, `--data-teal`, semantic tokens), **Svelte 5 runes in modern files**,
> **Tailwind + SCSS**, light + dark mode, `Button`/`Modal`/`Callout` atoms where appropriate, and
> no raw color-name classes or off-scale radii.

---

## Alignment & Overflow

### P1 - Overflow-Safe Row

**Finding:** a long label wraps or pushes, shifting its icon, badge, action, or neighboring row out
of alignment.

```svelte
<div class="flex min-w-0 items-center gap-sm">
	<span
		class="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-[var(--stone-edge)]"
	>
		<Icon class="h-4 w-4" />
	</span>
	<span class="min-w-0 flex-1 truncate text-sm font-medium text-[var(--ink-bright)]">
		{label}
	</span>
</div>
```

The contract: `min-w-0` on the flex parent or text column, `truncate`/`line-clamp-*` on user-supplied
text, and `shrink-0` on icons, badges, avatars, and action buttons. Long questions, celebrity names,
email addresses, tags, comments, and admin rows should never be left to chance.

### P2 - Two-Radius Rule

**Finding:** mixed corner radii on one surface, square outliers among rounded components, or soft
controls inside equally-soft containers.

- **Cards, panels, modals, banners:** `rounded-xl` (16px).
- **Buttons, inputs, chips, popovers, icon boxes:** `rounded-md` (10px).
- **Tiny badges/dots:** `rounded-sm` (4px).
- **True pills, avatars, spinners only:** `rounded-full`.

Do not use `rounded-lg`, `rounded-2xl`, `rounded-3xl`, or arbitrary radii. `pnpm lint:radius`
enforces this in classes and raw CSS.

### P3 - One Width + One Padding Scale For Shells

**Finding:** each region invents its own width or side padding, so page edges do not line up.

Use the repo's existing shell conventions for the surface you are touching. New broad marketing or
product shells should start from a shared center container and the spacing scale in `docs/design-system.md`:

```svelte
<section class="px-lg py-2xl sm:px-xl lg:px-2xl">
	<div class="mx-auto max-w-7xl">...</div>
</section>
```

Do not introduce a one-off `max-w-[1170px]`, `p-5`, `gap-7`, or bespoke side padding unless the
audit documents why the surface needs a carve-out.

The root layout defaults to the contained reading shell. A route that owns a broad marketing,
index, or product canvas must opt into `pageShell: 'owned'` from its `+page` or `+layout` load,
preferably through `withOwnedPageShell` in `src/lib/layout/pageShell.ts`. Keep route families on a
parent layout where possible. Do not restore pathname allowlists in the root layout: they drift as
new nested routes are added and make a page's effective width impossible to infer from its own
route files.

---

## Hierarchy & Labels

### P4 - Demote Metadata To Subtext

**Finding:** secondary info renders at the same size, weight, color, or visual level as the primary content.

```svelte
<div class="min-w-0">
	<p class="truncate text-sm font-semibold text-[var(--ink-bright)]">{title}</p>
	<p class="truncate text-xs text-[var(--ink-mid)]">{metadata}</p>
</div>
```

Differentiate with size, weight, color, and placement. Adding a new card, divider, badge, or wrapper
is the last resort, not the first.

### P5 - Mono Micro-Label / SectionKicker

**Finding:** uppercase section labels are hand-rolled with drifting tracking, color, size, or punctuation.

Use the existing 9takes section-kicker vocabulary: JetBrains Mono, amber `--lamp-glow`, compact caps,
and the `§NN · LABEL` pattern where the surface is editorial or dossier-like. Prefer an existing
`SectionKicker`/local kicker component when present. Otherwise keep the markup simple:

```svelte
<p class="font-mono text-xs font-bold uppercase tracking-[0.08em] text-[var(--lamp-glow)]">
	§03 · Question Thread
</p>
```

Do not invent a new visual language for every small label.

### P6 - Rename Before You Restyle

**Finding:** a label is vague, redundant, wrapping, ambiguous, or forcing a layout fix that copy could solve.

Procedure:

1. Say what it is. If a user cannot predict the destination from the label, rename it.
2. Shorten until just before ambiguity.
3. Show identifying information, not incidental text.
4. Read adjacent labels together for accidental meanings.
5. Check the mobile wrap. If the right label still does not fit, then apply P1.

---

## Decluttering

### P7 - Filters Button + Selected Chips

**Finding:** a filter row, tabs, or control cluster competes with the main content or creates horizontal scroll.

Keep search visible when it is the primary interaction. Collapse secondary filters behind a `Filters`
button, then render active filters as removable chips below it so state stays visible while the panel
is closed.

```svelte
<Button variant="secondary" onclick={() => (filtersOpen = !filtersOpen)}>Filters</Button>
{#if activeFilters.length}
	<div class="flex flex-wrap gap-sm">
		{#each activeFilters as filter}
			<button
				class="rounded-md border border-[var(--stone-edge)] px-sm py-xs text-xs text-[var(--ink-mid)]"
			>
				{filter.label} <span aria-hidden="true">x</span>
			</button>
		{/each}
	</div>
{/if}
```

### P8 - Do Not Hide What Fits

**Finding:** primary actions are tucked into a drawer or overflow menu even though the layout has room.

Pull the one to three highest-value actions into the flow. Use P6 to shorten labels and P1 to keep
the row stable. If a drawer ends up with zero or one real items, delete the drawer.

---

## Icons & Imagery

### P9 - Fixed Icon Containers, One Icon Style

**Finding:** mixed icon weights/sets, icons changing row height, or labels moving because glyph widths differ.

9takes does not have a canonical icon atom yet. For new line icons, prefer `@lucide/svelte` and keep
stroke, size, and container treatment consistent. Custom Enneagram/type marks are a separate data-symbol category.

```svelte
<span
	class="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-[var(--stone-edge)] text-[var(--lamp-glow)]"
>
	<Icon class="h-4 w-4" aria-hidden="true" />
</span>
```

### P10 - Scrim For Text Over Imagery

**Finding:** text overlays an image, poster, hero media, avatar, or generated asset without guaranteed contrast.

```svelte
<figure class="relative overflow-hidden rounded-xl border border-[var(--stone-edge)]">
	<img {src} {alt} class="h-full w-full object-cover" />
	<figcaption
		class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-lg"
	>
		<p class="line-clamp-2 text-sm font-semibold text-white">{title}</p>
	</figcaption>
</figure>
```

Let the image own its space. Put text in a predictable priority order, and reserve a real area for actions.

---

## Mobile & Data Density

### P11 - Reduced-Motion Gating

**Finding:** transitions, animations, hover effects, loading states, or signature interactions ignore
`prefers-reduced-motion`.

- Tailwind animation utilities pair with `motion-reduce:animate-none` or an equivalent non-moving state.
- Hand-rolled CSS wraps motion in `@media (prefers-reduced-motion: no-preference)` or swaps to a simple fade.
- JS pointer effects return early when `matchMedia('(prefers-reduced-motion: reduce)').matches`.
- Loading indicators may slow down or become static; they must not become unreadable.

### P12 - Wide Table To Mobile Cards

**Finding:** a data table forces horizontal scroll, clips actions, or makes row identity hard to scan on phones.

Render the table on desktop and a card list on mobile. Each card should show row identity first, then
the two or three highest-value fields, then full-width tap targets.

```svelte
<table class="hidden md:table">...</table>
<div class="grid gap-lg md:hidden">
	{#each rows as row}
		<article class="rounded-xl border border-[var(--stone-edge)] bg-[var(--stone-warm)] p-lg">
			<p class="font-semibold text-[var(--ink-bright)]">{row.title}</p>
			<p class="text-sm text-[var(--ink-mid)]">{row.meta}</p>
		</article>
	{/each}
</div>
```

### P13 - Route Interactive Controls Through Primitives

**Finding:** hand-rolled buttons, links, dialogs, inputs, tabs, or menus miss focus rings, tap targets,
disabled state, loading state, scroll lock, or Escape behavior.

Use `src/lib/components/atoms/Button.svelte`, `src/lib/components/atoms/Modal.svelte`, and
`src/lib/components/blog/callouts/Callout.svelte` where they fit. If a control cannot use the primitive,
it must still replicate the basics: clear label, keyboard operation, focus-visible ring, disabled/loading
state, 44px-ish tap target where practical, and reduced-motion-safe transitions.

Modal dialogs and modal navigation drawers must also provide the complete focus-boundary contract:

- A descriptive accessible name through `name`/`aria-label` or `labelledBy`.
- Initial focus inside the overlay, with an explicit selector when the first control is not the right target.
- Tab and Shift+Tab wrapping within the active overlay.
- An inert page background and a shared, reference-counted body scroll lock.
- Escape-to-close where dismissal is allowed, plus focus restoration to the opener.
- Inert, accessibility-hidden markup while a persistent portaled dialog is closed.

Use `src/lib/utils/focusBoundary.ts` for shared focus discovery, trapping, background inerting, and focus
restoration. Do not create another route-local focus-trap implementation.

Public forms must also preserve their meaning when placeholder text disappears and when a toast times
out:

- Keep a persistent, visible `<label>` associated through `for`/`id`; placeholders are examples only.
- Give help, counters, and errors stable IDs, then connect the relevant control with
  `aria-describedby` and `aria-invalid`.
- Keep validation and API failures in the form as durable `role="alert"` content. A toast may repeat
  the message, but it cannot be the only error channel.
- Use theme-aware text roles (`--success-text`, `--warning-text`, `--error-text`, `--info-text`) for
  status copy. Reserve raw status/type hues for borders, fills, stripes, and data marks.
- Filled destructive controls must pair `--danger-surface` with `--text-on-danger`; do not assume
  white text is readable on every danger surface or theme.

Do not edit canonical primitives during an audit unless DJ explicitly approves changing the system itself.

---

## Signature Effects (Use At Most One Per Surface)

### P14 - Cursor-Glow Card Grid

**Finding:** a marketing/editorial card grid needs one premium interaction moment and the content is already solid.

One wrapper listener updates every card; CSS renders the glow. The effect is a no-op under reduced motion.

```svelte
<script lang="ts">
	let wrapper = $state<HTMLElement | null>(null);

	function handleMove(e: MouseEvent) {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches || !wrapper) return;
		for (const card of wrapper.querySelectorAll<HTMLElement>('.glow-card')) {
			const rect = card.getBoundingClientRect();
			card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
			card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
		}
	}
</script>

<div bind:this={wrapper} onmousemove={handleMove} class="grid gap-lg sm:grid-cols-3">
	<div class="glow-card rounded-xl border border-[var(--stone-edge)] bg-[var(--stone-warm)]">
		...
	</div>
</div>
```

```css
.glow-card::before {
	content: '';
	position: absolute;
	inset: 0;
	border-radius: inherit;
	opacity: 0;
	transition: opacity 500ms;
	background: radial-gradient(
		600px circle at var(--mouse-x) var(--mouse-y),
		color-mix(in srgb, var(--lamp-glow) 18%, transparent),
		transparent 40%
	);
	pointer-events: none;
}
.glow-card:hover::before {
	opacity: 1;
}
@media (prefers-reduced-motion: reduce) {
	.glow-card::before {
		display: none;
	}
}
```

### P15 - Magic Slider

**Finding:** pointer position should drive a constrained reveal, spotlight, rotation, blur, or comparison effect.

Convert pointer position into a 0-to-1 fraction of the container, then map that fraction onto a property range.
Constrain motion; do not mirror the cursor literally.

```ts
function fraction(e: MouseEvent, el: HTMLElement): number {
	const rect = el.getBoundingClientRect();
	return Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
}
```

Feed CSS custom props from JS and let CSS render. Gate the whole listener with P11.

### P16 - Spotlight Hover Via `:has()`

**Finding:** a set of peer items needs a stronger hover/focus priority without layout motion.

```css
.spotlight-group:has(.spotlight-item:hover) .spotlight-item:not(:hover),
.spotlight-group:has(.spotlight-item:focus-visible) .spotlight-item:not(:focus-visible) {
	opacity: 0.45;
}
.spotlight-item {
	transition: opacity 300ms ease;
}
@media (prefers-reduced-motion: reduce) {
	.spotlight-item {
		transition: none;
	}
}
```

Keep the dimmed state readable. Pair hover with focus-visible so keyboard users get the same information.

### P17 - Forgiving Shared Indicator

**Finding:** a shared tab/nav/card indicator snaps home while the cursor travels between fixed targets.

Zero delay while any target is hovered; short delay only on full de-hover.

```css
.indicator {
	transition:
		left 250ms ease,
		top 250ms ease;
	transition-delay: 300ms;
}
.group:has(.target:hover) .indicator {
	transition-delay: 0ms;
}
@media (prefers-reduced-motion: reduce) {
	.indicator {
		transition: none;
	}
}
```

Hardcode target positions when the count is fixed; use measurement only when the set is dynamic.

### P18 - Seamless Gradient-Text Accent

**Finding:** a hero or editorial display line needs one premium accent, or an existing gradient text
animation visibly jumps at the loop seam.

Use the same first and last color stops, clip to text, and disable motion under reduced motion.

```css
.magic-text {
	background: linear-gradient(
		90deg,
		var(--lamp-glow),
		var(--lamp-light),
		var(--data-cyan),
		var(--lamp-glow)
	);
	background-size: 200%;
	background-clip: text;
	-webkit-background-clip: text;
	color: transparent;
	animation: magic-pan 6s linear infinite;
}
@keyframes magic-pan {
	to {
		background-position: -200% center;
	}
}
@media (prefers-reduced-motion: reduce) {
	.magic-text {
		animation: none;
	}
}
```

Marketing/editorial only. Never app chrome. Confirm contrast in the live pass.

---

## Color Harmony

### P19 - Budget The Brand Accent

**Finding:** several neighboring elements all use fully saturated `--lamp-glow`, so the interface
loses hierarchy and the sodium-amber identity reads as generic yellow UI chrome.

Give the strongest amber to primary actions, focus indicators, active states, and compact
`SectionKicker` illumination. Resting identity text and passive chrome should sit in the ink/marble
family; borders and surface tints may mix a small amount of amber into stone.

```css
.brand-wordmark {
	color: color-mix(in srgb, var(--ink-bright) 90%, var(--lamp-deep));
}

.brand-wordmark:hover {
	color: color-mix(in srgb, var(--ink-bright) 72%, var(--lamp-glow));
}

.quiet-accent-border {
	border-color: color-mix(in srgb, var(--lamp-glow) 18%, var(--stone-edge));
}
```

Do not replace every amber usage mechanically. Judge the local accent budget: one dominant action,
small illuminated labels, and quiet mixed borders can coexist; several solid yellow elements cannot.
Color-only transitions do not require a reduced-motion fallback, but never attach glow movement or
hover translation merely to make the quieter treatment noticeable.

---

## Using This Doc In An Audit

In audit findings, cite patterns as `-> P1`, `-> P6+P1`, etc. If a fix does not match any pattern and
you invent a new one that a second surface will plausibly need, add it here with the next P-number,
the same finding/recipe shape, and explicit reduced-motion behavior.
