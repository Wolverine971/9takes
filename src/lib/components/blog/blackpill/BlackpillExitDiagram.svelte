<!-- src/lib/components/blog/blackpill/BlackpillExitDiagram.svelte -->
<script lang="ts">
	const downwardLoop = [
		'Pain',
		'Total story',
		'Cynical action',
		'Bad result',
		'“The story was true”'
	];

	const truthPairs = [
		['Looks matter', 'Looks decide your whole life'],
		['Money matters', 'Your birth fixes your class forever'],
		['Moving up is hard', 'There is no possible path upward'],
		['Jobs are hard to get', 'You have nothing useful to offer'],
		['Some women dunk on men', 'All women are bad'],
		['Some women have advantages', 'Women have easy lives'],
		['Some women may reject me', 'Women already hate me'],
		['Society sometimes fails men', 'Men have no place or purpose'],
		['Men need support and language', 'Men must organize against women'],
		['I am behind now', 'I will always be behind']
	];

	const socialActions = [
		'Have one normal conversation with no dating goal',
		'Join a recurring, mixed social group',
		'Meet women as individuals, not a category',
		'Count neutral and good interactions too'
	];

	const economicActions = [
		'Define the next money threshold—not the whole class leap',
		'Build one skill that a real employer or customer pays for',
		'Ask for referrals, coaching, and introductions',
		'Find leverage and a ladder—not only more isolated grinding'
	];

	const upwardLoop = [
		'One small action',
		'Real counter-evidence',
		'Competence and connection',
		'Agency',
		'More hope'
	];
</script>

<section class="exit-map" aria-labelledby="exit-map-title">
	<header class="map-header">
		<p class="kicker">§02 · Breaking the loop</p>
		<h2 id="exit-map-title">You do not have to solve your whole life. Break one link.</h2>
		<p>
			The first move is seeing the spiral while it is happening. The second is testing one part of
			the story in the physical world.
		</p>
	</header>

	<section class="see-stage" aria-labelledby="see-title">
		<div class="stage-copy">
			<span class="stage-number">01</span>
			<div>
				<p class="stage-label">See the spiral</p>
				<h3 id="see-title">Name the loop before it names your future.</h3>
			</div>
		</div>

		<ol class="cycle-strip">
			{#each downwardLoop as step, index (step)}
				<li>
					<span>{String(index + 1).padStart(2, '0')}</span>
					<strong>{step}</strong>
				</li>
			{/each}
		</ol>
		<p class="cycle-return"><span aria-hidden="true">↺</span> Then it feeds the original pain.</p>
	</section>

	<section class="separate-stage" aria-labelledby="separate-title">
		<div class="stage-copy">
			<span class="stage-number">02</span>
			<div>
				<p class="stage-label">Separate pain from story</p>
				<h3 id="separate-title">Keep the hard truth. Drop the hopeless conclusion.</h3>
			</div>
		</div>

		<div class="truth-key" aria-hidden="true">
			<span>Hard truth</span>
			<span>does not equal</span>
			<span>Total doom</span>
		</div>

		<div class="truth-grid">
			{#each truthPairs as pair (pair[0])}
				<article class="truth-row">
					<p>{pair[0]}</p>
					<span aria-label="does not equal">≠</span>
					<p>{pair[1]}</p>
				</article>
			{/each}
		</div>
	</section>

	<section class="action-stage" aria-labelledby="action-title">
		<div class="stage-copy">
			<span class="stage-number">03</span>
			<div>
				<p class="stage-label">Create counter-evidence</p>
				<h3 id="action-title">Choose an action small enough to produce a real result.</h3>
			</div>
		</div>

		<div class="action-grid">
			<article class="action-card social-card">
				<p class="action-label">Social action</p>
				<ul>
					{#each socialActions as action (action)}
						<li>{action}</li>
					{/each}
				</ul>
				<p class="action-result">Result: “Not every interaction ends badly.”</p>
			</article>

			<article class="action-card economic-card">
				<p class="action-label">Economic action</p>
				<ul>
					{#each economicActions as action (action)}
						<li>{action}</li>
					{/each}
				</ul>
				<p class="action-result">Result: income · skill · proof · contacts · momentum</p>
			</article>
		</div>
	</section>

	<section class="upward-stage" aria-labelledby="upward-title">
		<div class="upward-heading">
			<p class="kicker">The upward spiral</p>
			<h3 id="upward-title">Evidence restores agency. Agency makes the next action possible.</h3>
		</div>

		<ol>
			{#each upwardLoop as step, index (step)}
				<li>
					<span>{String(index + 1).padStart(2, '0')}</span>
					<strong>{step}</strong>
				</li>
			{/each}
		</ol>
		<p class="upward-return">
			<span aria-hidden="true">↻</span> More hope makes the next small action easier.
		</p>
	</section>
</section>

<style>
	.exit-map {
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
				circle at 50% 100%,
				color-mix(in srgb, var(--data-teal) 11%, transparent),
				transparent 34rem
			),
			var(--night-deep);
		color: var(--ink-bright);
		overflow: hidden;
	}

	.map-header {
		max-width: 50rem;
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
	.stage-label,
	.action-label {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--lamp-glow);
	}

	.see-stage,
	.separate-stage,
	.action-stage,
	.upward-stage {
		margin-top: 1rem;
		padding: clamp(1rem, 3vw, 1.5rem);
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		background: color-mix(in srgb, var(--stone-warm) 88%, transparent);
	}

	.stage-copy {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.25rem;
	}

	.stage-number {
		display: grid;
		place-items: center;
		width: 2.75rem;
		height: 2.75rem;
		flex: 0 0 auto;
		border: 1px solid color-mix(in srgb, var(--lamp-glow) 35%, var(--stone-edge));
		border-radius: 10px;
		background: var(--night-deep);
		font-family: var(--font-mono);
		font-size: 0.72rem;
		color: var(--ink-mid);
	}

	.stage-copy h3,
	.upward-heading h3 {
		margin: 0.35rem 0 0;
		font-size: clamp(1.25rem, 3vw, 1.75rem);
		line-height: 1.15;
		letter-spacing: -0.02em;
	}

	.cycle-strip {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.cycle-strip li {
		position: relative;
		display: grid;
		align-content: center;
		min-height: 6rem;
		padding: 0.8rem;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: var(--night-mid);
	}

	.cycle-strip li:not(:last-child)::after {
		content: '→';
		position: absolute;
		z-index: 1;
		top: 50%;
		right: -0.75rem;
		display: grid;
		place-items: center;
		width: 1rem;
		height: 1rem;
		transform: translateY(-50%);
		background: var(--night-deep);
		color: var(--lamp-glow);
		font-size: 0.8rem;
	}

	.cycle-strip span {
		font-family: var(--font-mono);
		font-size: 0.66rem;
		color: var(--ink-dim);
	}

	.cycle-strip strong {
		margin-top: 0.3rem;
		font-size: 0.9rem;
		line-height: 1.3;
	}

	.cycle-return,
	.upward-return {
		margin: 0.8rem 0 0;
		color: var(--ink-mid);
		font-size: 0.9rem;
		text-align: center;
	}

	.cycle-return span,
	.upward-return span {
		margin-right: 0.25rem;
		color: var(--lamp-glow);
		font-size: 1.2rem;
	}

	.truth-key {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 6rem minmax(0, 1fr);
		gap: 0.75rem;
		margin-bottom: 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-dim);
	}

	.truth-key span:nth-child(2) {
		text-align: center;
	}

	.truth-grid {
		display: grid;
		gap: 0.5rem;
	}

	.truth-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 6rem minmax(0, 1fr);
		gap: 0.75rem;
		align-items: center;
		padding: 0.75rem;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: var(--night-mid);
	}

	.truth-row p {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.35;
	}

	.truth-row p:first-child {
		color: var(--ink-bright);
	}

	.truth-row p:last-child {
		color: var(--ink-mid);
		text-decoration: line-through;
		text-decoration-color: color-mix(in srgb, var(--error) 60%, transparent);
	}

	.truth-row > span {
		font-family: var(--font-mono);
		font-size: 1.2rem;
		font-weight: 700;
		text-align: center;
		color: var(--lamp-glow);
	}

	.action-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.75rem;
	}

	.action-card {
		display: flex;
		min-width: 0;
		flex-direction: column;
		padding: 1rem;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: var(--night-mid);
	}

	.social-card {
		border-color: color-mix(in srgb, var(--lamp-glow) 40%, var(--stone-edge));
	}

	.economic-card {
		border-color: color-mix(in srgb, var(--data-teal) 45%, var(--stone-edge));
	}

	.economic-card .action-label {
		color: var(--data-cyan);
	}

	.action-card ul {
		display: grid;
		gap: 0.5rem;
		margin: 0.8rem 0;
		padding: 0;
		list-style: none;
	}

	.action-card li {
		position: relative;
		padding-left: 1.15rem;
		color: var(--ink-mid);
		font-size: 0.9rem;
		line-height: 1.4;
	}

	.action-card li::before {
		content: '↗';
		position: absolute;
		left: 0;
		color: var(--lamp-glow);
	}

	.economic-card li::before {
		color: var(--data-cyan);
	}

	.action-result {
		margin: auto 0 0;
		padding: 0.75rem;
		border-radius: 10px;
		background: var(--stone-warm);
		font-size: 0.86rem;
		font-weight: 700;
		line-height: 1.4;
	}

	.upward-stage {
		border-color: color-mix(in srgb, var(--data-teal) 48%, var(--stone-edge));
		background:
			linear-gradient(
				135deg,
				color-mix(in srgb, var(--data-teal) 10%, transparent),
				transparent 55%
			),
			var(--stone-warm);
	}

	.upward-heading {
		max-width: 46rem;
		margin: 0 auto 1.25rem;
		text-align: center;
	}

	.upward-stage ol {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.upward-stage li {
		position: relative;
		display: grid;
		align-content: center;
		min-height: 5.5rem;
		padding: 0.75rem;
		border: 1px solid color-mix(in srgb, var(--data-teal) 42%, var(--stone-edge));
		border-radius: 10px;
		background: var(--night-mid);
	}

	.upward-stage li:not(:last-child)::after {
		content: '→';
		position: absolute;
		z-index: 1;
		top: 50%;
		right: -0.75rem;
		display: grid;
		place-items: center;
		width: 1rem;
		height: 1rem;
		transform: translateY(-50%);
		background: var(--night-deep);
		color: var(--data-cyan);
		font-size: 0.8rem;
	}

	.upward-stage li span {
		font-family: var(--font-mono);
		font-size: 0.66rem;
		color: var(--data-cyan);
	}

	.upward-stage li strong {
		margin-top: 0.3rem;
		font-size: 0.88rem;
		line-height: 1.3;
	}

	.upward-return span {
		color: var(--data-cyan);
	}

	/* The shared article TOC becomes a fixed 200px left rail on wide screens.
	   Keep the diagram outside that rail instead of letting the wide breakout
	   slide underneath it. */
	@media (min-width: 1360px) {
		.exit-map {
			width: min(58rem, calc(100vw - 2rem));
		}
	}

	@media (max-width: 760px) {
		.exit-map {
			left: auto;
			width: 100%;
			margin: 2rem 0;
			transform: none;
		}

		.cycle-strip,
		.upward-stage ol,
		.action-grid {
			grid-template-columns: 1fr;
		}

		.cycle-strip li,
		.upward-stage li {
			min-height: auto;
			grid-template-columns: 2rem minmax(0, 1fr);
			align-items: center;
		}

		.cycle-strip li:not(:last-child)::after,
		.upward-stage li:not(:last-child)::after {
			content: '↓';
			top: auto;
			right: auto;
			bottom: -0.75rem;
			left: 50%;
			transform: translateX(-50%);
		}

		.truth-key {
			display: none;
		}

		.truth-row {
			grid-template-columns: 1fr;
			gap: 0.35rem;
		}

		.truth-row > span {
			text-align: left;
		}
	}

	@media (max-width: 420px) {
		.exit-map {
			padding: 0.75rem;
		}

		.see-stage,
		.separate-stage,
		.action-stage,
		.upward-stage {
			padding: 0.75rem;
		}
	}
</style>
