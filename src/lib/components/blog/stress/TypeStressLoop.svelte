<!-- src/lib/components/blog/stress/TypeStressLoop.svelte -->
<script lang="ts">
	import type { EnneagramStressLoop } from '$lib/data/enneagramStressLoops';

	let { loop }: { loop: EnneagramStressLoop } = $props();
	let typeColor = $derived(`var(--type-${loop.type}-color)`);
</script>

<figure class="type-loop" style:--type-color={typeColor}>
	<figcaption>
		<span class="type-badge">Type {loop.type} · {loop.name}</span>
		<strong>{loop.alarm}</strong>
		<p>{loop.coreFear}</p>
	</figcaption>

	<div class="prevention-map" aria-label={`Type ${loop.type} fear and prevention strategy`}>
		<div class="map-node map-node--fear">
			<span>Feared outcome</span>
			<strong>{loop.coreFear}</strong>
		</div>
		<div class="map-arrow" aria-hidden="true">
			<span>so I try to prevent it</span>
			<b>→</b>
		</div>
		<div class="map-node map-node--defense">
			<span>Go-to defense</span>
			<strong>{loop.defense}</strong>
		</div>
	</div>

	<p class="prevention-rule"><span>The safety rule</span> “{loop.preventionRule}”</p>

	<div class="scenario-heading">
		<span>Three ways the loop can run</span>
		<small>Trigger → fear → defense → backfire</small>
	</div>

	<ol class="scenarios">
		{#each loop.examples as example, index (example.trigger)}
			<li class="scenario">
				<span class="scenario-number">Scenario 0{index + 1}</span>
				<div class="scenario-flow">
					<div class="flow-node flow-node--trigger">
						<span>Trigger</span>
						<p>{example.trigger}</p>
					</div>
					<div class="flow-node flow-node--fear">
						<span>Fear</span>
						<p>{example.fear}</p>
					</div>
					<div class="flow-node flow-node--defense">
						<span>Defense</span>
						<p>{example.defense}</p>
					</div>
					<div class="flow-node flow-node--backfire">
						<span>Backfire</span>
						<p>{example.backfire}</p>
					</div>
				</div>
			</li>
		{/each}
	</ol>

	<div class="loop-interrupt">
		<span>Interrupt the loop</span>
		<strong>{loop.interrupt}</strong>
	</div>
</figure>

<style lang="scss">
	.type-loop {
		position: relative;
		overflow: hidden;
		margin: 1.5rem 0 3rem;
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		background: var(--night-mid);
		color: var(--ink-bright);
	}

	.type-loop::before {
		content: '';
		position: absolute;
		inset: 0 auto 0 0;
		width: 4px;
		background: var(--type-color);
	}

	figcaption {
		display: grid;
		gap: 0.45rem;
		padding: 1.5rem 1.5rem 1.25rem;
		background: color-mix(in srgb, var(--type-color) 6%, var(--night-mid));
	}

	.type-badge,
	.map-node span,
	.map-arrow span,
	.prevention-rule span,
	.scenario-heading span,
	.scenario-heading small,
	.scenario-number,
	.flow-node > span,
	.loop-interrupt span {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.075em;
		text-transform: uppercase;
	}

	.type-badge {
		width: fit-content;
		padding: 0.28rem 0.5rem;
		border: 1px solid color-mix(in srgb, var(--type-color) 40%, var(--stone-edge));
		border-radius: 0.25rem;
		background: color-mix(in srgb, var(--type-color) 12%, transparent);
		color: var(--type-color);
	}

	figcaption > strong {
		font-size: clamp(1.2rem, 3vw, 1.6rem);
		line-height: 1.25;
		letter-spacing: -0.02em;
	}

	figcaption p {
		margin: 0;
		color: var(--ink-mid);
		font-size: 0.95rem;
		line-height: 1.55;
	}

	.prevention-map {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
		align-items: stretch;
		gap: 0.75rem;
		padding: 1.25rem 1.5rem;
		border-top: 1px solid var(--stone-edge);
		border-bottom: 1px solid var(--stone-edge);
		background: var(--night-deep);
	}

	.map-node {
		display: grid;
		align-content: start;
		gap: 0.45rem;
		padding: 0.9rem 1rem;
		border-radius: 0.625rem;
		background: var(--stone-warm);
	}

	.map-node span {
		color: var(--ink-dim);
	}

	.map-node--fear span {
		color: var(--lamp-glow);
	}

	.map-node--defense span {
		color: var(--data-cyan);
	}

	.map-node strong {
		font-size: 0.92rem;
		line-height: 1.45;
	}

	.map-arrow {
		display: grid;
		width: 5.25rem;
		place-content: center;
		gap: 0.25rem;
		color: var(--ink-dim);
		text-align: center;
	}

	.map-arrow span {
		font-size: 0.58rem;
		line-height: 1.35;
	}

	.map-arrow b {
		font-family: var(--font-mono);
		font-size: 1.15rem;
		font-weight: 400;
	}

	.prevention-rule {
		margin: 0;
		padding: 0.9rem 1.5rem;
		border-bottom: 1px solid var(--stone-edge);
		color: var(--ink-mid);
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.prevention-rule span {
		margin-right: 0.5rem;
		color: var(--lamp-glow);
	}

	.scenario-heading {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.25rem 1.5rem 0.75rem;
	}

	.scenario-heading span {
		color: var(--ink-bright);
	}

	.scenario-heading small {
		color: var(--ink-dim);
		text-align: right;
	}

	.scenarios {
		margin: 0;
		padding: 0 1.5rem;
		list-style: none;
	}

	.scenario {
		padding: 0.9rem 0 1.25rem;
	}

	.scenario + .scenario {
		border-top: 1px solid color-mix(in srgb, var(--stone-edge) 72%, transparent);
	}

	.scenario-number {
		display: block;
		margin-bottom: 0.45rem;
		color: var(--ink-dim);
	}

	.scenario-flow {
		display: grid;
		overflow: hidden;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1px;
		border: 1px solid var(--stone-edge);
		border-radius: 0.625rem;
		background: var(--stone-edge);
	}

	.flow-node {
		--stage-accent: var(--ink-mid);
		position: relative;
		min-width: 0;
		padding: 0.85rem;
		background: var(--night-deep);
	}

	.flow-node--fear {
		--stage-accent: var(--lamp-glow);
	}

	.flow-node--defense {
		--stage-accent: var(--data-cyan);
	}

	.flow-node--backfire {
		--stage-accent: var(--error-text);
	}

	.flow-node:not(:last-child)::after {
		content: '›';
		position: absolute;
		top: 50%;
		right: -0.48rem;
		z-index: 1;
		display: grid;
		width: 0.9rem;
		height: 0.9rem;
		place-items: center;
		border-radius: 50%;
		background: var(--stone-edge);
		color: var(--ink-bright);
		font-family: var(--font-mono);
		font-size: 0.85rem;
		line-height: 1;
		transform: translateY(-50%);
	}

	.flow-node > span {
		display: block;
		margin-bottom: 0.4rem;
		color: var(--stage-accent);
	}

	.flow-node p {
		margin: 0;
		color: var(--ink-mid);
		font-size: 0.83rem;
		line-height: 1.48;
		overflow-wrap: anywhere;
	}

	.loop-interrupt {
		display: grid;
		gap: 0.35rem;
		margin-top: 0.5rem;
		padding: 1rem 1.5rem 1.2rem;
		border-top: 1px solid var(--stone-edge);
		background: color-mix(in srgb, var(--type-color) 5%, var(--night-deep));
	}

	.loop-interrupt span {
		color: var(--type-color);
	}

	.loop-interrupt strong {
		font-size: 0.95rem;
		line-height: 1.45;
	}

	@media (max-width: 760px) {
		figcaption,
		.prevention-map,
		.prevention-rule,
		.scenario-heading,
		.scenarios,
		.loop-interrupt {
			padding-right: 1rem;
			padding-left: 1rem;
		}

		figcaption p,
		.map-node strong,
		.prevention-rule,
		.flow-node p,
		.loop-interrupt strong {
			font-size: 1rem;
		}

		.prevention-map {
			grid-template-columns: 1fr;
		}

		.map-arrow {
			width: auto;
			min-height: 2.5rem;
		}

		.map-arrow b {
			line-height: 1;
			transform: rotate(90deg);
		}

		.scenario-heading {
			align-items: flex-start;
			flex-direction: column;
		}

		.scenario-heading small {
			text-align: left;
		}

		.scenario-flow {
			grid-template-columns: 1fr;
		}

		.flow-node {
			padding: 1rem;
		}

		.flow-node:not(:last-child)::after {
			content: '⌄';
			top: auto;
			right: 50%;
			bottom: -0.48rem;
			transform: translateX(50%);
		}
	}
</style>
