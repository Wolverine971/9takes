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
			<li class="map-row" style:--type-color={`var(--type-${loop.type}-color)`}>
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
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		background: var(--night-mid);
		color: var(--ink-bright);
	}

	figcaption {
		display: grid;
		gap: 0.4rem;
		padding: 1.5rem;
		border-bottom: 1px solid var(--stone-edge);
		background:
			radial-gradient(
				circle at 88% 0%,
				color-mix(in srgb, var(--data-teal) 12%, transparent),
				transparent 34%
			),
			var(--night-deep);
	}

	figcaption > span,
	.map-head,
	.map-cell > span {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.075em;
		text-transform: uppercase;
	}

	figcaption > span {
		color: var(--data-cyan);
	}

	figcaption strong {
		font-size: clamp(1.2rem, 3vw, 1.65rem);
		line-height: 1.25;
		letter-spacing: -0.02em;
	}

	figcaption p {
		max-width: 64ch;
		margin: 0;
		color: var(--ink-mid);
		font-size: 0.95rem;
		line-height: 1.55;
	}

	.map-head,
	.map-row {
		display: grid;
		grid-template-columns: minmax(7.5rem, 0.7fr) repeat(3, minmax(0, 1fr));
	}

	.map-head {
		padding: 0.7rem 1rem;
		border-bottom: 1px solid var(--stone-edge);
		background: var(--stone-warm);
		color: var(--ink-dim);
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
		border-bottom: 1px solid color-mix(in srgb, var(--stone-edge) 74%, transparent);
	}

	.map-row:last-child {
		border-bottom: 0;
	}

	.map-row::before {
		content: '';
		position: absolute;
		inset: 0 auto 0 0;
		width: 3px;
		background: var(--type-color);
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
		border: 1px solid color-mix(in srgb, var(--type-color) 45%, var(--stone-edge));
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--type-color) 12%, transparent);
		color: var(--type-color);
		font-family: var(--font-mono);
		font-size: 0.78rem;
		font-weight: 700;
	}

	.type-id strong {
		font-size: 0.8rem;
		line-height: 1.35;
	}

	.map-cell {
		border-left: 1px solid color-mix(in srgb, var(--stone-edge) 58%, transparent);
	}

	.map-cell > span {
		display: none;
		margin-bottom: 0.25rem;
	}

	.map-cell--fear > span {
		color: var(--lamp-glow);
	}

	.map-cell--defense > span {
		color: var(--data-cyan);
	}

	.map-cell--backfire > span {
		color: var(--error-text);
	}

	.map-cell p {
		margin: 0;
		color: var(--ink-mid);
		font-size: 0.78rem;
		line-height: 1.45;
		overflow-wrap: anywhere;
	}

	@media (max-width: 760px) {
		figcaption {
			padding: 1.15rem 1rem;
		}

		figcaption p {
			font-size: 1rem;
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
			font-size: 1rem;
		}

		.map-cell {
			padding: 0.75rem 0;
			border-top: 1px solid color-mix(in srgb, var(--stone-edge) 58%, transparent);
			border-left: 0;
		}

		.map-cell > span {
			display: block;
		}

		.map-cell p {
			font-size: 1rem;
		}
	}
</style>
