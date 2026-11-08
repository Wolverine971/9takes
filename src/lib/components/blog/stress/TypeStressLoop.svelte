<!-- src/lib/components/blog/stress/TypeStressLoop.svelte -->
<script lang="ts">
	import type { EnneagramStressLoop } from '$lib/data/enneagramStressLoops';

	let { loop }: { loop: EnneagramStressLoop } = $props();
</script>

<figure class="type-loop">
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
		border: 1px solid var(--rule);
		border-radius: 1rem;
		background: var(--surface);
		color: var(--text);
	}

	.type-loop::before {
		content: '';
		position: absolute;
		inset: 0 auto 0 0;
		width: 4px;
		background: var(--accent);
	}

	figcaption {
		display: grid;
		gap: 0.45rem;
		padding: 1.5rem 1.5rem 1.25rem;
		background: color-mix(in srgb, var(--accent) 8%, var(--surface));
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
		font-family: var(--font-talk);
		font-size: var(--font-size-xs);
		font-weight: 600;
		letter-spacing: 0.075em;
		text-transform: uppercase;
	}

	.type-badge {
		width: fit-content;
		padding: 0.28rem 0.5rem;
		border: 1px solid color-mix(in srgb, var(--highlight) 45%, transparent);
		border-radius: 0.25rem;
		background: var(--accent-deep);
		color: var(--highlight);
	}

	figcaption > strong {
		font-size: clamp(1.2rem, 3vw, 1.6rem);
		line-height: 1.25;
		letter-spacing: -0.02em;
	}

	figcaption p {
		margin: 0;
		color: var(--text-muted);
		font-size: var(--font-size-base);
		line-height: 1.55;
	}

	.prevention-map {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
		align-items: stretch;
		gap: 0.75rem;
		padding: 1.25rem 1.5rem;
		border-top: 1px solid var(--rule);
		border-bottom: 1px solid var(--rule);
		background: var(--bg);
	}

	.map-node {
		display: grid;
		align-content: start;
		gap: 0.45rem;
		padding: 0.9rem 1rem;
		border-radius: 0.625rem;
		background: var(--surface);
	}

	.map-node span {
		color: var(--text-faint);
	}

	.map-node--fear span {
		color: var(--text-faint);
	}

	.map-node--defense span {
		color: var(--highlight);
	}

	.map-node strong {
		font-size: var(--font-size-base);
		line-height: 1.45;
	}

	.map-arrow {
		display: grid;
		width: 5.25rem;
		place-content: center;
		gap: 0.25rem;
		color: var(--text-faint);
		text-align: center;
	}

	.map-arrow span {
		font-size: var(--font-size-xs);
		line-height: 1.35;
	}

	.map-arrow b {
		font-family: var(--font-talk);
		font-size: var(--font-size-lg);
		font-weight: 400;
	}

	.prevention-rule {
		margin: 0;
		padding: 0.9rem 1.5rem;
		border-bottom: 1px solid var(--rule);
		color: var(--text-muted);
		font-size: var(--font-size-sm);
		line-height: 1.5;
	}

	.prevention-rule span {
		margin-right: 0.5rem;
		color: var(--text-faint);
	}

	.scenario-heading {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.25rem 1.5rem 0.75rem;
	}

	.scenario-heading span {
		color: var(--text);
	}

	.scenario-heading small {
		color: var(--text-faint);
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
		border-top: 1px solid var(--rule);
	}

	.scenario-number {
		display: block;
		margin-bottom: 0.45rem;
		color: var(--text-faint);
	}

	.scenario-flow {
		display: grid;
		overflow: hidden;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1px;
		border: 1px solid var(--rule);
		border-radius: 0.625rem;
		background: var(--rule);
	}

	.flow-node {
		--stage-accent: var(--rule);
		position: relative;
		min-width: 0;
		padding: 0.85rem;
		border-top: 2px solid var(--stage-accent);
		background: var(--bg);
	}

	.flow-node--fear {
		--stage-accent: color-mix(in srgb, var(--accent) 55%, transparent);
	}

	.flow-node--defense {
		--stage-accent: var(--accent);
	}

	.flow-node--backfire {
		--stage-accent: var(--highlight);
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
		background: var(--surface-raised);
		color: var(--text);
		box-shadow: 0 0 0 1px var(--rule);
		font-family: var(--font-talk);
		font-size: var(--font-size-sm);
		line-height: 1;
		transform: translateY(-50%);
	}

	.flow-node > span {
		display: block;
		margin-bottom: 0.4rem;
		color: var(--text-faint);
	}

	.flow-node p {
		margin: 0;
		color: var(--text-muted);
		font-size: var(--font-size-sm);
		line-height: 1.48;
		overflow-wrap: anywhere;
	}

	.loop-interrupt {
		display: grid;
		gap: 0.35rem;
		margin-top: 0.5rem;
		padding: 1rem 1.5rem 1.2rem;
		border-top: 1px solid var(--rule);
		background: color-mix(in srgb, var(--accent) 8%, var(--bg));
	}

	.loop-interrupt span {
		color: var(--highlight);
	}

	.loop-interrupt strong {
		font-size: var(--font-size-base);
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
			font-size: var(--font-size-base);
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
