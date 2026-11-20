<!-- src/lib/components/molecules/PeopleTimeline.svelte -->
<!--
  Set --ptl-gutter on a wrapper (and a matching negative margin) to bleed the scroll
  to the screen edge while the first face lines up with your column.

  Birth-year timeline: generations left (oldest) to right (youngest), each spanning
  its oldest to youngest person's birth year. Build `timeline` on the server with
  buildTimeline() from $lib/peopleTimeline (it reads the taxonomy, which is too big
  to ship to the browser). Scrolls sideways inside itself; the page never does.
-->
<script lang="ts">
	import type { Timeline, TimelinePerson } from '$lib/peopleTimeline';
	import {
		buildPersonalityAnalysisPath,
		buildPersonalityImagePath
	} from '$lib/utils/personalityAnalysis';
	import { portraitPhoneSrc } from '$lib/imageVariants.js';

	let {
		timeline,
		ariaLabel,
		lit = null
	}: {
		timeline: Timeline<TimelinePerson>;
		ariaLabel: string;
		/** When set, everyone outside it dims (the type page's pattern chips). */
		lit?: Set<string> | null;
	} = $props();

	const year = (value: number) => (value < 0 ? `${-value} BC` : String(value));
	const span = (start: number, end: number) =>
		start === end ? year(start) : `${year(start)}–${year(end)}`;
</script>

{#snippet face(person: TimelinePerson)}
	{@const fullPath = buildPersonalityImagePath(person.enneagram, person.slug, 'full')}
	{@const avif = portraitPhoneSrc(fullPath)}
	<li
		class={['ptl-person', lit && (lit.has(person.slug) ? 'is-lit' : 'is-dim')]}
		style:--accent={person.accent ?? 'var(--rule)'}
	>
		<a
			href={buildPersonalityAnalysisPath(person.slug)}
			title={person.personaTitle ? `${person.name}: ${person.personaTitle}` : person.name}
		>
			<span class="ptl-portrait personality-portrait-well">
				{#if person.enneagram}
					<picture>
						{#if avif}
							<source type="image/avif" srcset={avif} />
						{/if}
						<img
							class="personality-portrait-image"
							src={buildPersonalityImagePath(person.enneagram, person.slug, 'thumbnail')}
							alt=""
							width="160"
							height="160"
							loading="lazy"
							decoding="async"
						/>
					</picture>
				{/if}
			</span>
			<span class="ptl-name">{person.name}</span>
			<span class="ptl-born">{person.born == null ? '' : year(person.born)}</span>
		</a>
	</li>
{/snippet}

<div class="ptl" role="region" aria-label={ariaLabel}>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<ol class="ptl-track" tabindex="0">
		{#each timeline.groups as group (group.key)}
			<li class="ptl-group">
				<h3 class="ptl-head">
					<span class="ptl-gen">{group.label}</span>
					<span class="ptl-span">{span(group.startYear, group.endYear)}</span>
				</h3>
				<ul class="ptl-people">
					{#each group.people as person (person.slug)}
						{@render face(person)}
					{/each}
				</ul>
				<div class="ptl-axis" aria-hidden="true">
					<span>{year(group.startYear)}</span>
					{#if group.endYear !== group.startYear}
						<span>{year(group.endYear)}</span>
					{/if}
				</div>
			</li>
		{/each}
		{#if timeline.unknown.length > 0}
			<li class="ptl-group ptl-unknown">
				<h3 class="ptl-head">
					<span class="ptl-gen">Birth year unknown</span>
				</h3>
				<ul class="ptl-people">
					{#each timeline.unknown as person (person.slug)}
						{@render face(person)}
					{/each}
				</ul>
				<div class="ptl-axis" aria-hidden="true"></div>
			</li>
		{/if}
	</ol>
</div>

<style>
	.ptl {
		--ptl-face: 5.25rem;
		position: relative;
		width: 100%;
		min-width: 0;
	}

	.ptl-track {
		display: flex;
		align-items: stretch;
		gap: 2.25rem;
		margin: 0;
		padding: 0.25rem var(--ptl-gutter, 16px) 0.75rem;
		list-style: none;
		overflow-x: auto;
		overscroll-behavior-x: contain;
		scroll-snap-type: x proximity;
		scroll-padding-inline: var(--ptl-gutter, 16px);
		scrollbar-width: thin;
		scrollbar-color: var(--rule) transparent;

		&:focus-visible {
			outline: 2px solid var(--focus);
			outline-offset: 2px;
		}
	}

	.ptl-group {
		flex: none;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		scroll-snap-align: start;
	}

	.ptl-head {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		margin: 0;
		font-size: var(--font-size-xs);
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.ptl-gen {
		color: var(--text);
	}

	.ptl-span {
		color: var(--text-faint);
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}

	/* Two rows, filled column by column, so birth order reads left to right. */
	.ptl-people {
		display: grid;
		grid-auto-flow: column;
		grid-template-rows: repeat(2, auto);
		grid-auto-columns: var(--ptl-face);
		gap: 0.9rem 0.75rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.ptl-person {
		min-width: 0;
		transition:
			opacity 0.2s ease,
			filter 0.2s ease;

		a {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 0.15rem;
			color: inherit;
			text-align: center;
			text-decoration: none;

			&:focus-visible {
				outline: none;

				.ptl-portrait {
					outline: 2px solid var(--focus);
					outline-offset: 2px;
				}
			}
		}
	}

	.ptl-portrait {
		display: block;
		width: 3.5rem;
		aspect-ratio: 1;
		overflow: hidden;
		border-radius: 50%;
		border: 2px solid color-mix(in srgb, var(--accent) 55%, var(--rule));
		margin-bottom: 0.2rem;
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

	.ptl-person a:hover .ptl-portrait {
		transform: scale(1.06);
		border-color: var(--accent);
	}

	.ptl-name {
		max-width: 100%;
		font-size: var(--font-size-xs);
		font-weight: 600;
		line-height: 1.2;
		color: var(--text);
		overflow-wrap: break-word;
		hyphens: auto;
	}

	.ptl-born {
		font-size: var(--font-size-xs);
		line-height: 1.2;
		color: var(--text-faint);
		font-variant-numeric: tabular-nums;
	}

	.is-dim {
		opacity: 0.22;
		filter: grayscale(1);
	}

	.is-lit .ptl-portrait {
		border-color: var(--type-accent, var(--accent));
	}

	/* The year rule under each generation; together they read as one timeline. */
	.ptl-axis {
		display: flex;
		justify-content: space-between;
		margin-top: auto;
		padding-top: 0.4rem;
		border-top: 1px solid var(--rule);
		font-size: var(--font-size-xs);
		color: var(--text-faint);
		font-variant-numeric: tabular-nums;
	}

	.ptl-unknown .ptl-axis {
		border-top-style: dashed;
	}

	@media (prefers-reduced-motion: reduce) {
		.ptl-person,
		.ptl-portrait {
			transition: none;
		}

		.ptl-person a:hover .ptl-portrait {
			transform: none;
		}
	}
</style>
