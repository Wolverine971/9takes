<!-- src/routes/personality-analysis/type/[slug]/TypeVennMap.svelte -->
<!--
  The type hub's Venn map. Fields are circles sized by how many people they hold,
  lanes are faint circles inside, crossovers sit where two fields overlap. All
  geometry comes from typeHubVenn.ts in abstract units; this component only turns
  it into percentages, so the map scales to any width. Tapping a field zooms in;
  names appear once they're big enough to read.
-->
<script lang="ts">
	import { FIELD_LABEL_UNITS, LABEL_ARC_SHARE, type VennLayout } from './typeHubVenn';
	import {
		buildPersonalityAnalysisPath,
		buildPersonalityImagePath,
		formatPersonalityDisplayName
	} from '$lib/utils/personalityAnalysis';
	import { portraitPhoneSrc } from '$lib/imageVariants.js';

	type MapPerson = {
		slug: string;
		enneagram: string | null;
		personaTitle: string | null;
	};

	let {
		layout,
		people,
		focused,
		lit,
		typeLabel,
		listHref,
		onfocus
	}: {
		layout: VennLayout;
		people: Map<string, MapPerson>;
		/** Field slug zoomed into, or null for the whole map. */
		focused: string | null;
		/** Slugs lit by the pattern strip, or null when no pattern is active. */
		lit: Set<string> | null;
		/** e.g. "Type 8 (The Challenger)", for alt text. */
		typeLabel: string;
		/** Where the zoomed field's name list lives, offered when names are too small to print. */
		listHref?: string;
		onfocus: (slug: string | null) => void;
	} = $props();

	/** Smallest face slot, in screen px, that gets a printed name. */
	const MIN_SLOT_PX = 52;
	/** Rim labels never render smaller than this, even on a phone's whole-map view. */
	const MIN_LABEL_PX = 9;
	const LANE_LABEL_UNITS = 8.5;

	// Unique per instance: the page renders a wide and a tall map side by side.
	const uid = $props.id();

	let width = $state(0);
	let unitPx = $derived(width > 0 ? width / layout.width : 0);
	// Rim label size in layout units, grown on small screens so it stays legible.
	let labelUnits = $derived(
		unitPx > 0 ? Math.max(FIELD_LABEL_UNITS, MIN_LABEL_PX / unitPx) : FIELD_LABEL_UNITS
	);

	/**
	 * An SVG arc for text on a circle's rim, centred on `angle` (degrees, -90 = top),
	 * in a box of side 2r with the circle centred. On the top half the arc runs
	 * clockwise with glyphs pointing out; on the bottom half it runs the other way so
	 * text still reads left to right.
	 */
	function rimArc(r: number, radius: number, angle: number, textUnits: number): string {
		// Long enough for the text (tracked caps run ~0.8em each) plus a margin;
		// textPath drops whatever doesn't fit on the path.
		const needed = ((textUnits / 2 / Math.max(radius, 1)) * 180) / Math.PI;
		const half = Math.min(175, Math.max(30, needed + 10));
		const top = Math.sin((angle * Math.PI) / 180) <= 0;
		const [from, to] = top ? [angle - half, angle + half] : [angle + half, angle - half];
		const point = (deg: number) => {
			const t = (deg * Math.PI) / 180;
			return `${(r + Math.cos(t) * radius).toFixed(2)} ${(r + Math.sin(t) * radius).toFixed(2)}`;
		};
		const large = half * 2 > 180 ? 1 : 0;
		return `M ${point(from)} A ${radius.toFixed(2)} ${radius.toFixed(2)} 0 ${large} ${top ? 1 : 0} ${point(to)}`;
	}

	/** Rough rendered length of tracked caps, in layout units. */
	const capsLength = (text: string, size: number) => text.length * size * 0.82;

	/** The rim label size for one circle: the shared size, shrunk to fit small circles. */
	function fieldLabelUnits(r: number, text: string): number {
		const fits = (Math.PI * 2 * r * LABEL_ARC_SHARE) / Math.max(text.length * 0.82, 1);
		return Math.min(labelUnits, fits);
	}

	/** Baseline radius: just inside the stroke, whichever way the glyphs face. */
	function labelRadius(r: number, angle: number, size: number): number {
		const top = Math.sin((angle * Math.PI) / 180) <= 0;
		return top ? r - size * 1.05 : r - size * 0.3;
	}

	let focusField = $derived(layout.fields.find((field) => field.slug === focused) ?? null);
	let zoom = $derived.by(() => {
		if (!focusField) return { k: 1, tx: 0, ty: 0 };
		const span = focusField.r * 2 * 1.06;
		const k = Math.max(1, Math.min(layout.width / span, layout.height / span));
		const clamp = (value: number) => Math.min(0, Math.max(1 - k, value));
		return {
			k,
			tx: clamp(0.5 - (focusField.x / layout.width) * k),
			ty: clamp(0.5 - (focusField.y / layout.height) * k)
		};
	});
	// Names print once a face slot is wide enough to carry one (at an 8px floor).
	let showNames = $derived(unitPx > 0 && 2 * layout.faceR * unitPx * zoom.k >= MIN_SLOT_PX);

	// Which fields each crossover belongs to, so a zoomed field keeps its overlap faces lit.
	let overlapFields = $derived(
		new Map(
			layout.overlaps.flatMap((overlap) =>
				overlap.faces.map((face) => [face.slug, [overlap.a, overlap.b]] as const)
			)
		)
	);
	let homeField = $derived(
		new Map(
			layout.fields.flatMap((field) =>
				field.lanes.flatMap((lane) => lane.faces.map((face) => [face.slug, field.slug] as const))
			)
		)
	);

	function inFocus(slug: string): boolean {
		if (!focused) return true;
		return homeField.get(slug) === focused || (overlapFields.get(slug)?.includes(focused) ?? false);
	}

	const left = (x: number, r: number) => `${((x - r) / layout.width) * 100}%`;
	const top = (y: number, r: number) => `${((y - r) / layout.height) * 100}%`;
	const size = (r: number) => `${((2 * r) / layout.width) * 100}%`;
</script>

{#snippet face(slug: string, x: number, y: number, crossover: boolean)}
	{@const person = people.get(slug)}
	{@const name = formatPersonalityDisplayName(slug)}
	{@const fullPath = person ? buildPersonalityImagePath(person.enneagram, slug, 'full') : ''}
	{@const avif = portraitPhoneSrc(fullPath)}
	<a
		href={buildPersonalityAnalysisPath(slug)}
		class={[
			'v-face',
			crossover && 'v-crossover',
			(!inFocus(slug) || (lit && !lit.has(slug))) && 'v-dim',
			lit?.has(slug) && 'v-lit'
		]}
		style:left={left(x, layout.faceR)}
		style:top={top(y, layout.faceR)}
		style:width={size(layout.faceR)}
		aria-label={person?.personaTitle ? `${name}: ${person.personaTitle}` : name}
	>
		<span class="v-portrait personality-portrait-well">
			{#if person?.enneagram}
				<picture>
					{#if avif}
						<source type="image/avif" srcset={avif} />
					{/if}
					<img
						class="personality-portrait-image"
						src={buildPersonalityImagePath(person.enneagram, slug, 'thumbnail')}
						alt={`${name}, Enneagram ${typeLabel}`}
						width="160"
						height="160"
						loading="lazy"
						decoding="async"
					/>
				</picture>
			{/if}
		</span>
		<span class="v-name" aria-hidden="true">{name}</span>
		<span class="v-tip" aria-hidden="true">
			<strong>{name}</strong>
			{#if person?.personaTitle}<span>{person.personaTitle}</span>{/if}
		</span>
	</a>
{/snippet}

<div
	class={['venn', showNames && 'show-names', focused && 'is-zoomed']}
	style:aspect-ratio={`${layout.width} / ${layout.height}`}
	style:--W={layout.width}
	bind:clientWidth={width}
>
	<div
		class="stage"
		style:transform={`translate(${zoom.tx * 100}%, ${zoom.ty * 100}%) scale(${zoom.k})`}
		style:--k={zoom.k}
	>
		{#each layout.fields as field (field.slug)}
			{@const arcId = `${uid}-rim-${field.slug}`}
			{@const rimUnits = fieldLabelUnits(field.r, field.shortLabel)}
			<button
				type="button"
				class={['v-field', focused && focused !== field.slug && 'v-field-quiet']}
				style:left={left(field.x, field.r)}
				style:top={top(field.y, field.r)}
				style:width={size(field.r)}
				style:--accent={field.accent ?? 'var(--text-faint)'}
				aria-pressed={focused === field.slug}
				aria-label={field.label}
				onclick={() => onfocus(focused === field.slug ? null : field.slug)}
			>
				<svg class="v-rim" viewBox={`0 0 ${field.r * 2} ${field.r * 2}`} aria-hidden="true">
					<defs>
						<path
							id={arcId}
							d={rimArc(
								field.r,
								labelRadius(field.r, field.labelAngle, rimUnits),
								field.labelAngle,
								capsLength(field.shortLabel, rimUnits)
							)}
						/>
					</defs>
					<text style:font-size={`${rimUnits}px`}>
						<textPath href={`#${arcId}`} startOffset="50%" text-anchor="middle">
							{field.shortLabel.toUpperCase()}
						</textPath>
					</text>
				</svg>
			</button>
		{/each}

		{#each layout.fields as field (field.slug)}
			{#each field.lanes as lane (lane.slug)}
				{#if lane.label}
					{@const laneArcId = `${uid}-lane-${field.slug}-${lane.slug}`}
					{@const outer = lane.r + LANE_LABEL_UNITS * 0.45}
					<div
						class="v-lane"
						style:left={left(lane.x, lane.r)}
						style:top={top(lane.y, lane.r)}
						style:width={size(lane.r)}
						style:--accent={field.accent ?? 'var(--text-faint)'}
						aria-hidden="true"
					>
						<svg class="v-lane-rim" viewBox={`0 0 ${lane.r * 2} ${lane.r * 2}`}>
							<defs>
								<path
									id={laneArcId}
									d={rimArc(lane.r, outer, -90, capsLength(lane.label, LANE_LABEL_UNITS))}
								/>
							</defs>
							<text style:font-size={`${LANE_LABEL_UNITS}px`}>
								<textPath href={`#${laneArcId}`} startOffset="50%" text-anchor="middle">
									{lane.label.toUpperCase()}
								</textPath>
							</text>
						</svg>
					</div>
				{/if}
			{/each}
		{/each}

		{#each layout.fields as field (field.slug)}
			{#each field.lanes as lane (lane.slug)}
				{#each lane.faces as item (item.slug)}
					{@render face(item.slug, item.x, item.y, false)}
				{/each}
			{/each}
		{/each}

		{#each layout.overlaps as overlap (`${overlap.a}|${overlap.b}`)}
			{#each overlap.faces as item (item.slug)}
				{@render face(item.slug, item.x, item.y, true)}
			{/each}
		{/each}
	</div>

	{#if focused}
		<div class="map-controls">
			<button type="button" class="control" onclick={() => onfocus(null)}>
				<span aria-hidden="true">&larr;</span> All niches
			</button>
			{#if listHref && !showNames}
				<a class="control" href={listHref}>See names <span aria-hidden="true">&darr;</span></a>
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	.venn {
		position: relative;
		overflow: hidden;
		container-type: inline-size;
		background: var(--surface);
		border: 1px solid var(--rule);
		border-radius: 1rem;
		/* One layout unit, in this map's own width. */
		--u: calc(100cqw / var(--W));
	}

	.stage {
		position: absolute;
		inset: 0;
		transform-origin: 0 0;
		transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
	}

	/* ---------- Fields ---------- */
	.v-field {
		position: absolute;
		aspect-ratio: 1;
		padding: 0;
		border-radius: 50%;
		border: calc(var(--u) * 2.5) solid color-mix(in srgb, var(--accent) 70%, transparent);
		background: color-mix(in srgb, var(--accent) 7%, transparent);
		cursor: zoom-in;
		transition:
			opacity 0.3s ease,
			background-color 0.2s ease;

		&:hover {
			background: color-mix(in srgb, var(--accent) 12%, transparent);
		}

		&:focus-visible {
			outline: 2px solid var(--focus);
			outline-offset: 2px;
		}

		&[aria-pressed='true'] {
			cursor: zoom-out;
		}
	}

	.v-field-quiet {
		opacity: 0.35;
	}

	/* Rim label: small tracked caps riding the inside of the circle's edge. */
	.v-rim,
	.v-lane-rim {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
		pointer-events: none;
	}

	.v-rim text {
		font-family: inherit;
		font-weight: 700;
		letter-spacing: 0.16em;
		fill: color-mix(in srgb, var(--accent) 85%, var(--text));
	}

	/* ---------- Lanes ---------- */
	.v-lane {
		position: absolute;
		aspect-ratio: 1;
		border-radius: 50%;
		border: calc(var(--u) * 1.2) dashed color-mix(in srgb, var(--accent) 22%, transparent);
		pointer-events: none;
	}

	.v-lane-rim text {
		font-family: inherit;
		font-weight: 700;
		letter-spacing: 0.14em;
		fill: color-mix(in srgb, var(--accent) 65%, var(--text-muted));
		opacity: 0;
		transition: opacity 0.25s ease;
	}

	.show-names .v-lane-rim text {
		opacity: 1;
	}

	/* ---------- Faces ---------- */
	.v-face {
		position: absolute;
		aspect-ratio: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-decoration: none;
		z-index: 1;
		transition:
			opacity 0.25s ease,
			filter 0.25s ease;

		&:hover,
		&:focus-visible {
			z-index: 3;
		}

		&:focus-visible {
			outline: none;

			.v-portrait {
				outline: 2px solid var(--focus);
				outline-offset: 2px;
			}
		}
	}

	.v-portrait {
		display: block;
		width: 82%;
		aspect-ratio: 1;
		overflow: hidden;
		border-radius: 50%;
		border: calc(var(--u) * 2) solid var(--rule);
		transition:
			transform 0.2s ease,
			border-color 0.2s ease;

		picture,
		img {
			display: block;
			width: 100%;
			height: 100%;
		}

		img {
			object-fit: cover;
		}
	}

	.v-face:hover .v-portrait {
		transform: scale(1.08);
		border-color: var(--text-muted);
	}

	.v-crossover .v-portrait {
		border-color: color-mix(in srgb, var(--highlight) 70%, transparent);
	}

	.v-lit .v-portrait {
		border-color: var(--type-accent, var(--highlight));
		box-shadow: 0 0 0 calc(var(--u) * 3)
			color-mix(in srgb, var(--type-accent, var(--highlight)) 45%, transparent);
	}

	.v-dim {
		opacity: 0.18;
		filter: grayscale(1);
	}

	.v-name {
		max-width: 100%;
		margin-top: calc(var(--u) * 1.2);
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		/* The 8px floor holds on screen: divide by the zoom the stage applies. */
		font-size: max(calc(8px / var(--k, 1)), calc(var(--u) * 9.5));
		font-weight: 600;
		line-height: 1.1;
		color: var(--text);
		text-shadow: 0 1px 3px var(--bg);
		opacity: 0;
		transition: opacity 0.25s ease;
	}

	.show-names .v-name {
		opacity: 1;
	}

	/* Hover card for when names are too small to print. */
	.v-tip {
		position: absolute;
		bottom: 100%;
		left: 50%;
		transform: translate(-50%, -4px);
		display: none;
		width: max-content;
		max-width: 13rem;
		padding: 0.4rem 0.6rem;
		font-size: var(--font-size-xs);
		line-height: 1.35;
		text-align: center;
		color: var(--text-muted);
		background: var(--surface-raised);
		border: 1px solid var(--rule);
		border-radius: 0.625rem;
		pointer-events: none;

		strong {
			display: block;
			color: var(--text);
		}
	}

	@media (hover: hover) and (pointer: fine) {
		.venn:not(.show-names) .v-face:hover .v-tip,
		.venn:not(.show-names) .v-face:focus-visible .v-tip {
			display: block;
		}
	}

	/* ---------- Zoom controls ---------- */
	.map-controls {
		position: absolute;
		top: 0.75rem;
		left: 0.75rem;
		right: 0.75rem;
		z-index: 4;
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		pointer-events: none;
	}

	.control {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.4rem 0.8rem;
		font: inherit;
		font-size: var(--font-size-sm);
		font-weight: 600;
		color: var(--text);
		text-decoration: none;
		background: var(--surface-raised);
		border: 1px solid var(--rule);
		border-radius: 9999px;
		cursor: pointer;
		pointer-events: auto;

		&:focus-visible {
			outline: 2px solid var(--focus);
			outline-offset: 2px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.stage,
		.v-field,
		.v-face,
		.v-portrait,
		.v-name,
		.v-lane-rim text {
			transition: none;
		}
	}
</style>
