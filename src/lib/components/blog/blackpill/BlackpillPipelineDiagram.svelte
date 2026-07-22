<!-- src/lib/components/blog/blackpill/BlackpillPipelineDiagram.svelte -->
<script lang="ts">
	const blameLanes = [
		{
			title: 'My body / birth',
			thoughts: ['Bad genes', 'Wrong face or height', 'Born without money', 'Wrong family'],
			result: 'Measure, compare, obsess'
		},
		{
			title: 'Women',
			thoughts: [
				'Their standards are too high',
				'They already dislike men like me',
				'Life works for them, not us'
			],
			result: 'Avoid, rank, resent'
		},
		{
			title: 'Culture / economy',
			thoughts: ['Good jobs are out of reach', 'Men are not valued', 'There is no ladder up'],
			result: 'Withdraw, burn out, lose trust'
		}
	];

	const rewards = [
		{ label: 'Clarity', copy: 'Now I get it.' },
		{ label: 'Identity', copy: 'I see the real world.' },
		{ label: 'Belonging', copy: 'These men understand me.' }
	];

	const worldview = [
		'Looks and genes decide your whole life.',
		'The family and class you were born into set your ceiling.',
		'Without money, you cannot become stable, date, or move up.',
		'You may be ready to grind, but there is no ladder into the next class.',
		'Women already dislike men like you.',
		'Society is pushing men out of useful roles.',
		'Effort cannot change your rank. There is no hope.'
	];

	const socialLoop = [
		'Women already hate me',
		'Avoid talking—or enter defensive',
		'The interaction feels tense or hostile',
		'She keeps her distance',
		'More rejection and isolation'
	];

	const moneyLoop = [
		'I will always be poor',
		'No stable work or enough money',
		'Less mobility, training, and access',
		'Fewer contacts and openings',
		'Exhaustion and stalled momentum'
	];
</script>

<section class="pipeline-map" aria-labelledby="pipeline-map-title">
	<header class="map-header">
		<p class="kicker">§01 · The downward spiral</p>
		<h2 id="pipeline-map-title">Pain is real. The story turns it into fate.</h2>
		<p>
			The blackpill does not begin as one bad idea. It forms as pain, blame, community, and behavior
			start reinforcing one another.
		</p>
	</header>

	<div class="origin-stack">
		<article class="flow-node origin-node">
			<span class="node-number">01</span>
			<div>
				<p class="node-label">Real pain</p>
				<p>Rejection · bullying · loneliness · joblessness · poverty · feeling useless</p>
			</div>
		</article>

		<div class="flow-arrow" aria-hidden="true"><span>↓</span></div>

		<article class="flow-node shame-node">
			<span class="node-number">02</span>
			<div>
				<p class="node-label">Shame</p>
				<p>“I am unwanted. I am behind. I have no value. I cannot win.”</p>
				<p class="node-note">No guide · no words · no way out · no tribe</p>
			</div>
		</article>
	</div>

	<div class="flow-arrow" aria-hidden="true"><span>↓</span></div>

	<section class="blame-stage" aria-labelledby="blame-title">
		<div class="stage-heading">
			<span class="node-number">03</span>
			<div>
				<p class="node-label" id="blame-title">Who or what is to blame?</p>
				<p>The same pain gets sorted into three explanations.</p>
			</div>
		</div>

		<div class="branch-grid">
			{#each blameLanes as lane (lane.title)}
				<article class="branch-card">
					<h3>{lane.title}</h3>
					<ul>
						{#each lane.thoughts as thought (thought)}
							<li>“{thought}.”</li>
						{/each}
					</ul>
					<p class="branch-result">{lane.result}</p>
				</article>
			{/each}
		</div>
	</section>

	<div class="flow-arrow" aria-hidden="true"><span>↓</span></div>

	<section class="community-stage" aria-labelledby="community-title">
		<span class="node-number">04</span>
		<div>
			<p class="node-label" id="community-title">Men share the same grievances</p>
			<p>
				Stories become theories. Theories become language. The conversation becomes a community.
			</p>
			<div class="community-message">
				<span>TAKE THE BLACKPILL</span>
				<strong>“Open your eyes. The game is fixed. Nothing will ever change.”</strong>
			</div>
		</div>
	</section>

	<div class="flow-arrow" aria-hidden="true"><span>↓</span></div>

	<div class="reward-grid" aria-label="What the community provides">
		{#each rewards as reward (reward.label)}
			<article>
				<p>{reward.label}</p>
				<strong>{reward.copy}</strong>
			</article>
		{/each}
	</div>

	<div class="flow-arrow" aria-hidden="true"><span>↓</span></div>

	<section class="worldview-stage" aria-labelledby="worldview-title">
		<div class="worldview-heading">
			<p class="kicker">The blackpill worldview</p>
			<h3 id="worldview-title">A hard starting point becomes a permanent sentence.</h3>
		</div>
		<ul>
			{#each worldview as belief (belief)}
				<li>{belief}</li>
			{/each}
		</ul>
	</section>

	<div class="flow-arrow split-arrow" aria-hidden="true"><span>↓</span></div>

	<section class="loop-stage" aria-labelledby="loop-title">
		<div class="loop-heading">
			<p class="kicker">Two loops, one conclusion</p>
			<h3 id="loop-title">The worldview begins manufacturing its own proof.</h3>
		</div>

		<div class="loop-grid">
			<article class="loop-panel social-loop">
				<p class="loop-label">The social spiral</p>
				<ol>
					{#each socialLoop as step, index (step)}
						<li>
							<span>{String(index + 1).padStart(2, '0')}</span>
							<p>{step}</p>
						</li>
					{/each}
				</ol>
				<p class="confirmation">“See? Women hate me.”</p>
			</article>

			<article class="loop-panel money-loop">
				<p class="loop-label">The money spiral</p>
				<ol>
					{#each moneyLoop as step, index (step)}
						<li>
							<span>{String(index + 1).padStart(2, '0')}</span>
							<p>{step}</p>
						</li>
					{/each}
				</ol>
				<p class="confirmation">“See? There is no way up.”</p>
			</article>
		</div>
	</section>

	<footer class="loop-return">
		<span aria-hidden="true">↺</span>
		<div>
			<p>More pain and shame</p>
			<strong>More blame · deeper belief · deeper into the pill</strong>
		</div>
	</footer>
</section>

<style>
	.pipeline-map {
		position: relative;
		left: 50%;
		width: min(70rem, calc(100vw - 2rem));
		margin: 3rem 0;
		padding: clamp(1rem, 3vw, 2rem);
		transform: translateX(-50%);
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		background:
			radial-gradient(
				circle at 50% 0%,
				color-mix(in srgb, var(--lamp-glow) 10%, transparent),
				transparent 32rem
			),
			var(--night-deep);
		color: var(--ink-bright);
		overflow: hidden;
	}

	.pipeline-map::before {
		content: '';
		position: absolute;
		inset: 0 auto 0 50%;
		width: 1px;
		background: linear-gradient(
			to bottom,
			transparent,
			color-mix(in srgb, var(--lamp-glow) 30%, transparent) 8%,
			color-mix(in srgb, var(--lamp-glow) 30%, transparent) 92%,
			transparent
		);
		pointer-events: none;
	}

	.pipeline-map > * {
		position: relative;
		z-index: 1;
	}

	.map-header {
		max-width: 48rem;
		margin: 0 auto 2rem;
		text-align: center;
	}

	.map-header h2 {
		margin: 0.4rem 0 0.75rem;
		font-size: clamp(1.65rem, 4vw, 2.5rem);
		line-height: 1.08;
		letter-spacing: -0.03em;
	}

	.map-header > p:last-child {
		margin: 0;
		color: var(--ink-mid);
		font-size: 1rem;
	}

	.kicker,
	.node-label,
	.loop-label {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--lamp-glow);
	}

	.origin-stack {
		display: grid;
		justify-items: center;
	}

	.flow-node,
	.community-stage {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: 1rem;
		width: min(100%, 42rem);
		padding: 1rem;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: var(--stone-warm);
	}

	.flow-node p,
	.community-stage p {
		margin: 0.35rem 0 0;
	}

	.origin-node {
		border-color: color-mix(in srgb, var(--data-teal) 45%, var(--stone-edge));
	}

	.shame-node {
		border-color: color-mix(in srgb, var(--lamp-glow) 45%, var(--stone-edge));
	}

	.node-number {
		display: grid;
		place-items: center;
		width: 2.5rem;
		height: 2.5rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 32%, var(--stone-edge));
		border-radius: 10px;
		background: var(--night-mid);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--ink-mid);
	}

	.node-note {
		color: var(--ink-mid);
		font-size: 0.9rem;
	}

	.flow-arrow {
		display: grid;
		place-items: center;
		height: 3rem;
		color: var(--lamp-glow);
		font-family: var(--font-mono);
		font-size: 1.25rem;
	}

	.flow-arrow span {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		border-radius: 9999px;
		background: var(--night-deep);
	}

	.blame-stage,
	.loop-stage {
		padding: 1rem;
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		background: color-mix(in srgb, var(--stone-warm) 86%, transparent);
	}

	.stage-heading {
		display: flex;
		align-items: center;
		gap: 1rem;
		max-width: 42rem;
		margin: 0 auto 1rem;
	}

	.stage-heading p {
		margin: 0.25rem 0 0;
	}

	.branch-grid,
	.reward-grid,
	.loop-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.75rem;
	}

	.branch-card {
		display: flex;
		min-width: 0;
		flex-direction: column;
		padding: 1rem;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: var(--night-mid);
	}

	.branch-card h3 {
		margin: 0;
		font-size: 1rem;
	}

	.branch-card ul,
	.worldview-stage ul {
		margin: 0.75rem 0;
		padding: 0;
		list-style: none;
	}

	.branch-card li {
		margin: 0 0 0.45rem;
		color: var(--ink-mid);
		font-size: 0.9rem;
		line-height: 1.45;
	}

	.branch-result {
		margin: auto 0 0;
		padding-top: 0.75rem;
		border-top: 1px solid var(--stone-edge);
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--lamp-glow);
	}

	.community-stage {
		margin: 0 auto;
	}

	.community-message {
		display: grid;
		gap: 0.35rem;
		margin-top: 1rem;
		padding: 0.8rem;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 38%, var(--stone-edge));
		border-radius: 10px;
		background: var(--night-deep);
	}

	.community-message span {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--lamp-glow);
	}

	.reward-grid {
		max-width: 48rem;
		margin: 0 auto;
	}

	.reward-grid article {
		padding: 0.9rem;
		border: 1px solid color-mix(in srgb, var(--data-teal) 42%, var(--stone-edge));
		border-radius: 10px;
		background: color-mix(in srgb, var(--data-teal) 8%, var(--stone-warm));
		text-align: center;
	}

	.reward-grid p {
		margin: 0 0 0.3rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--data-cyan);
	}

	.reward-grid strong {
		font-size: 0.9rem;
	}

	.worldview-stage {
		display: grid;
		grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
		gap: 1.5rem;
		padding: clamp(1rem, 3vw, 1.5rem);
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 50%, var(--stone-edge));
		border-radius: 16px;
		background:
			linear-gradient(
				135deg,
				color-mix(in srgb, var(--lamp-glow) 9%, transparent),
				transparent 48%
			),
			var(--stone-warm);
	}

	.worldview-heading h3,
	.loop-heading h3 {
		margin: 0.45rem 0 0;
		font-size: clamp(1.35rem, 3vw, 1.9rem);
		line-height: 1.15;
		letter-spacing: -0.025em;
	}

	.worldview-stage ul {
		display: grid;
		gap: 0.45rem;
		margin: 0;
	}

	.worldview-stage li {
		position: relative;
		padding-left: 1.25rem;
		color: var(--ink-mid);
		font-size: 0.94rem;
		line-height: 1.45;
	}

	.worldview-stage li::before {
		content: '—';
		position: absolute;
		left: 0;
		color: var(--lamp-glow);
	}

	.loop-heading {
		max-width: 44rem;
		margin: 0 auto 1rem;
		text-align: center;
	}

	.loop-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.loop-panel {
		padding: 1rem;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: var(--night-mid);
	}

	.social-loop {
		border-color: color-mix(in srgb, var(--error) 36%, var(--stone-edge));
	}

	.money-loop {
		border-color: color-mix(in srgb, var(--data-teal) 42%, var(--stone-edge));
	}

	.loop-panel ol {
		display: grid;
		gap: 0;
		margin: 0.8rem 0;
		padding: 0;
		list-style: none;
	}

	.loop-panel li {
		position: relative;
		display: grid;
		grid-template-columns: 2rem minmax(0, 1fr);
		gap: 0.65rem;
		align-items: center;
		min-height: 2.9rem;
	}

	.loop-panel li:not(:last-child)::after {
		content: '';
		position: absolute;
		bottom: -0.3rem;
		left: 0.72rem;
		width: 1px;
		height: 0.6rem;
		background: var(--stone-edge);
	}

	.loop-panel li span {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		color: var(--ink-dim);
	}

	.loop-panel li p {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.35;
	}

	.confirmation {
		margin: 0;
		padding: 0.75rem;
		border-radius: 10px;
		background: var(--stone-warm);
		font-weight: 700;
		text-align: center;
	}

	.loop-return {
		display: flex;
		align-items: center;
		gap: 1rem;
		width: min(100%, 42rem);
		margin: 1rem auto 0;
		padding: 1rem;
		border: 1px dashed color-mix(in srgb, var(--lamp-glow) 45%, var(--stone-edge));
		border-radius: 10px;
		background: var(--night-deep);
	}

	.loop-return > span {
		font-size: 2rem;
		color: var(--lamp-glow);
	}

	.loop-return p,
	.loop-return strong {
		display: block;
		margin: 0;
	}

	.loop-return strong {
		margin-top: 0.2rem;
		color: var(--ink-mid);
		font-size: 0.85rem;
	}

	/* The shared article TOC becomes a fixed 200px left rail on wide screens.
	   Keep the diagram outside that rail instead of letting the wide breakout
	   slide underneath it. */
	@media (min-width: 1360px) {
		.pipeline-map {
			width: min(58rem, calc(100vw - 2rem));
		}
	}

	@media (max-width: 760px) {
		.pipeline-map {
			left: auto;
			width: 100%;
			margin: 2rem 0;
			transform: none;
		}

		.pipeline-map::before {
			left: 1.95rem;
		}

		.branch-grid,
		.reward-grid,
		.loop-grid,
		.worldview-stage {
			grid-template-columns: 1fr;
		}

		.reward-grid article {
			text-align: left;
		}

		.stage-heading {
			align-items: flex-start;
		}

		.flow-node,
		.community-stage {
			grid-template-columns: 2.5rem minmax(0, 1fr);
		}

		.worldview-stage {
			gap: 1rem;
		}
	}

	@media (max-width: 420px) {
		.pipeline-map {
			padding: 0.75rem;
		}

		.blame-stage,
		.loop-stage {
			padding: 0.75rem;
		}

		.flow-node,
		.community-stage {
			gap: 0.75rem;
			padding: 0.8rem;
		}
	}
</style>
