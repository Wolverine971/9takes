<!-- src/lib/components/blog/stress/StressLoopTypeMap.svelte -->
<script lang="ts">
	import { ENNEAGRAM_STRESS_LOOPS } from '$lib/data/enneagramStressLoops';
</script>

<figure class="type-map" aria-labelledby="type-map-title" aria-describedby="type-map-description">
	<figcaption>
		<span>Final organizing diagram</span>
		<strong id="type-map-title">Nine feared outcomes. Nine prevention moves.</strong>
		<p id="type-map-description">
			Each defense makes sense as an attempt to stop a feared future. The risk is what happens when
			that move becomes automatic.
		</p>
	</figcaption>

	<div class="map-head" aria-hidden="true">
		<span>Type</span>
		<span>What must not happen</span>
		<span>How I prevent it</span>
		<span>How it can backfire</span>
	</div>

	<ol class="map-rows">
		{#each ENNEAGRAM_STRESS_LOOPS as loop (loop.type)}
			<li class="map-row">
				<div class="type-id">
					<span>{loop.type}</span>
					<strong>{loop.name}</strong>
				</div>
				<div class="map-cell map-cell--fear">
					<span>What must not happen</span>
					<p>{loop.coreFear}</p>
				</div>
				<div class="map-cell map-cell--defense">
					<span>How I prevent it</span>
					<p>{loop.defense}</p>
				</div>
				<div class="map-cell map-cell--backfire">
					<span>How it can backfire</span>
					<p>{loop.backfire}</p>
				</div>
			</li>
		{/each}
	</ol>
</figure>

<style lang="scss">
	.type-map {
		overflow: hidden;
		margin: 2rem 0 2.5rem;
		border: 1px solid var(--rule);
		border-radius: 1rem;
		background: var(--surface);
		color: var(--text);
	}

	figcaption {
		display: grid;
		gap: 0.4rem;
		padding: 1.5rem;
		border-bottom: 1px solid var(--rule);
		background:
			radial-gradient(
				circle at 88% 0%,
				color-mix(in srgb, var(--accent) 14%, transparent),
				transparent 34%
			),
			var(--bg);
	}

	figcaption > span,
	.map-head,
	.map-cell > span {
		font-family: var(--font-talk);
		font-size: var(--font-size-xs);
		font-weight: 600;
		letter-spacing: 0.075em;
		text-transform: uppercase;
	}

	figcaption > span {
		color: var(--text-faint);
	}

	figcaption strong {
		font-size: clamp(1.2rem, 3vw, 1.65rem);
		line-height: 1.25;
		letter-spacing: -0.02em;
	}

	figcaption p {
		max-width: 64ch;
		margin: 0;
		color: var(--text-muted);
		font-size: var(--font-size-base);
		line-height: 1.55;
	}

	.map-head,
	.map-row {
		display: grid;
		grid-template-columns: minmax(7.5rem, 0.7fr) repeat(3, minmax(0, 1fr));
	}

	.map-head {
		padding: 0.7rem 1rem;
		border-bottom: 1px solid var(--rule);
		background: var(--surface);
		color: var(--text-faint);
	}

	.map-head span:not(:first-child) {
		padding-left: 0.9rem;
	}

	.map-rows {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.map-row {
		position: relative;
		min-width: 0;
		border-bottom: 1px solid var(--rule);
	}

	.map-row:last-child {
		border-bottom: 0;
	}

	.map-row::before {
		content: '';
		position: absolute;
		inset: 0 auto 0 0;
		width: 3px;
		background: color-mix(in srgb, var(--accent) 55%, transparent);
	}

	.type-id,
	.map-cell {
		min-width: 0;
		padding: 0.95rem 1rem;
	}

	.type-id {
		display: grid;
		grid-template-columns: 2rem minmax(0, 1fr);
		align-items: center;
		gap: 0.6rem;
	}

	.type-id > span {
		display: grid;
		width: 2rem;
		height: 2rem;
		place-items: center;
		border: 1px solid var(--rule);
		border-radius: 0.625rem;
		background: var(--surface-raised);
		color: var(--highlight);
		font-family: var(--font-talk);
		font-size: var(--font-size-xs);
		font-weight: 700;
	}

	.type-id strong {
		font-size: var(--font-size-sm);
		line-height: 1.35;
	}

	.map-cell {
		border-left: 1px solid var(--rule);
	}

	.map-cell > span {
		display: none;
		margin-bottom: 0.25rem;
	}

	.map-cell--fear > span {
		color: var(--text-faint);
	}

	.map-cell--defense > span {
		color: var(--text-faint);
	}

	.map-cell--backfire > span {
		color: var(--text-faint);
	}

	.map-cell p {
		margin: 0;
		color: var(--text-muted);
		font-size: var(--font-size-sm);
		line-height: 1.45;
		overflow-wrap: anywhere;
	}

	@media (max-width: 760px) {
		figcaption {
			padding: 1.15rem 1rem;
		}

		figcaption p {
			font-size: var(--font-size-base);
		}

		.map-head {
			display: none;
		}

		.map-row {
			grid-template-columns: 1fr;
			padding: 1rem;
		}

		.type-id,
		.map-cell {
			padding: 0;
		}

		.type-id {
			margin-bottom: 0.9rem;
		}

		.type-id strong {
			font-size: var(--font-size-base);
		}

		.map-cell {
			padding: 0.75rem 0;
			border-top: 1px solid var(--rule);
			border-left: 0;
		}

		.map-cell > span {
			display: block;
		}

		.map-cell p {
			font-size: var(--font-size-base);
		}
	}
</style>
