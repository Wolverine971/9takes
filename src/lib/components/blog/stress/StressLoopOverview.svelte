<!-- src/lib/components/blog/stress/StressLoopOverview.svelte -->
<figure
	class="stress-loop-overview"
	aria-labelledby="stress-loop-title"
	aria-describedby="stress-loop-description"
>
	<figcaption>
		<span class="diagram-kicker">The stress loop</span>
		<strong id="stress-loop-title">You react to what the event seems to predict.</strong>
		<span id="stress-loop-description">
			The defense is an attempt to stop a feared outcome and recover safety. It can also create the
			result it was meant to prevent.
		</span>
	</figcaption>

	<ol class="loop-track">
		<li class="loop-stage loop-stage--trigger">
			<span class="stage-number">01</span>
			<span class="stage-label">Trigger</span>
			<strong>Something happens.</strong>
			<p>An event gets your attention.</p>
		</li>
		<li class="loop-stage loop-stage--fear">
			<span class="stage-number">02</span>
			<span class="stage-label">Fear</span>
			<strong>“This could lead to what I fear.”</strong>
			<p>The event becomes a prediction.</p>
		</li>
		<li class="loop-stage loop-stage--defense">
			<span class="stage-number">03</span>
			<span class="stage-label">Defense</span>
			<strong>“I need to stop that.”</strong>
			<p>Your go-to prevention move takes over.</p>
		</li>
		<li class="loop-stage loop-stage--backfire">
			<span class="stage-number">04</span>
			<span class="stage-label">Backfire</span>
			<strong>The move creates a new problem.</strong>
			<p>You get less safety—or more of what you feared.</p>
		</li>
	</ol>

	<div class="outcome-split" aria-label="The intended and unintended outcomes of the defense">
		<div class="outcome outcome--wanted">
			<span>Wanted outcome</span>
			<strong>Safety · control · relief</strong>
		</div>
		<div class="outcome outcome--risk">
			<span>When the defense is automatic or overused</span>
			<strong>The backfire becomes the next trigger.</strong>
		</div>
	</div>
</figure>

<style lang="scss">
	.stress-loop-overview {
		position: relative;
		overflow: hidden;
		margin: 2rem 0 2.5rem;
		padding: 1.5rem;
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		background:
			radial-gradient(
				circle at 18% 0%,
				color-mix(in srgb, var(--lamp-glow) 10%, transparent),
				transparent 38%
			),
			var(--night-mid);
		color: var(--ink-bright);
	}

	figcaption {
		display: grid;
		gap: 0.35rem;
		max-width: 62ch;
		margin-bottom: 1.5rem;
	}

	figcaption strong {
		font-size: clamp(1.25rem, 3vw, 1.75rem);
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	figcaption > span:last-child {
		color: var(--ink-mid);
		font-size: 0.95rem;
		line-height: 1.55;
	}

	.diagram-kicker,
	.stage-number,
	.stage-label,
	.outcome span {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.diagram-kicker {
		color: var(--lamp-glow);
	}

	.loop-track {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1.6rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.loop-stage {
		--stage-accent: var(--ink-mid);
		position: relative;
		min-width: 0;
		padding: 1rem;
		border-top: 3px solid var(--stage-accent);
		border-radius: 0.625rem;
		background: color-mix(in srgb, var(--stone-warm) 84%, transparent);
	}

	.loop-stage--fear {
		--stage-accent: var(--lamp-glow);
	}

	.loop-stage--defense {
		--stage-accent: var(--data-teal);
	}

	.loop-stage--backfire {
		--stage-accent: var(--error-text);
	}

	.loop-stage:not(:last-child)::after {
		content: '→';
		position: absolute;
		top: 50%;
		right: -1.35rem;
		width: 1.1rem;
		color: var(--ink-dim);
		font-family: var(--font-mono);
		font-size: 1rem;
		text-align: center;
		transform: translateY(-50%);
	}

	.stage-number {
		display: block;
		margin-bottom: 1rem;
		color: var(--ink-dim);
	}

	.stage-label {
		display: block;
		margin-bottom: 0.4rem;
		color: var(--stage-accent);
	}

	.loop-stage strong {
		display: block;
		font-size: 0.95rem;
		line-height: 1.35;
	}

	.loop-stage p {
		margin: 0.45rem 0 0;
		color: var(--ink-mid);
		font-size: 0.82rem;
		line-height: 1.5;
	}

	.outcome-split {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1px;
		margin-top: 1.5rem;
		border: 1px solid var(--stone-edge);
		border-radius: 0.625rem;
		background: var(--stone-edge);
		overflow: hidden;
	}

	.outcome {
		display: grid;
		gap: 0.3rem;
		padding: 0.9rem 1rem;
		background: var(--night-deep);
	}

	.outcome span {
		color: var(--ink-dim);
	}

	.outcome strong {
		font-size: 0.9rem;
		line-height: 1.4;
	}

	.outcome--wanted strong {
		color: var(--data-cyan);
	}

	.outcome--risk strong {
		color: var(--lamp-light);
	}

	@media (max-width: 760px) {
		.stress-loop-overview {
			padding: 1.1rem;
		}

		.loop-track {
			grid-template-columns: 1fr;
			gap: 1.75rem;
		}

		.loop-stage:not(:last-child)::after {
			content: '↓';
			top: auto;
			right: 50%;
			bottom: -1.45rem;
			transform: translateX(50%);
		}

		.outcome-split {
			grid-template-columns: 1fr;
		}
	}
</style>
