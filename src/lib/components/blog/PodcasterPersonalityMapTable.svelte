<!-- src/lib/components/blog/PodcasterPersonalityMapTable.svelte -->
<script lang="ts">
	interface PodcasterRow {
		name: string;
		href: string;
		type: string;
		show: string;
		gravity: string;
		style: string;
	}

	const podcasters: PodcasterRow[] = [
		{
			name: 'Joe Rogan',
			href: '/personality-analysis/joe-rogan',
			type: 'Type 8 · Challenger',
			show: 'The Joe Rogan Experience',
			gravity: "Power, combat, who's real",
			style: 'Pressure test'
		},
		{
			name: 'Dave Portnoy',
			href: '/personality-analysis/dave-portnoy',
			type: 'Type 8 · Challenger',
			show: 'Barstool Sports / One Bite',
			gravity: 'Sports, business, dominance',
			style: 'Confrontation'
		},
		{
			name: 'Sam Parr',
			href: '/personality-analysis/sam-parr',
			type: 'Type 8 · Challenger',
			show: 'My First Million',
			gravity: 'Business, deals, survival',
			style: 'Brute-force honesty'
		},
		{
			name: 'Lex Fridman',
			href: '/personality-analysis/lex-fridman',
			type: 'Type 5 · Investigator',
			show: 'Lex Fridman Podcast',
			gravity: 'Truth, meaning, consciousness',
			style: 'Philosophical excavation'
		},
		{
			name: 'Shawn Ryan',
			href: '/personality-analysis/shawn-ryan',
			type: 'Type 5 · Investigator',
			show: 'Shawn Ryan Show',
			gravity: 'Military, intelligence, survival',
			style: 'Operational patience'
		},
		{
			name: 'Andrew Huberman',
			href: '/personality-analysis/andrew-huberman',
			type: 'Type 5 · Investigator',
			show: 'Huberman Lab',
			gravity: 'Neuroscience, protocols, the body',
			style: 'Clinical translation'
		},
		{
			name: 'Alex Cooper',
			href: '/personality-analysis/alex-cooper',
			type: 'Type 7 · Enthusiast',
			show: 'Call Her Daddy',
			gravity: 'Sex, relationships, drama',
			style: 'Chaotic energy'
		},
		{
			name: 'Theo Von',
			href: '/personality-analysis/theo-von',
			type: 'Type 7 · Enthusiast',
			show: 'This Past Weekend',
			gravity: 'Trauma, absurdity, life',
			style: 'Storytelling riff'
		},
		{
			name: 'Dax Shepard',
			href: '/personality-analysis/dax-shepard',
			type: 'Type 7 · Enthusiast',
			show: 'Armchair Expert',
			gravity: 'Vulnerability, psychology, honesty',
			style: 'Confessional'
		},
		{
			name: 'Brittany Broski',
			href: '/personality-analysis/brittany-broski',
			type: 'Type 7 · Enthusiast',
			show: 'The Broski Report',
			gravity: 'Obsessions, culture, chaos',
			style: 'Enthusiasm tornado'
		},
		{
			name: 'Shaan Puri',
			href: '/personality-analysis/shaan-puri',
			type: 'Type 7 · Enthusiast',
			show: 'My First Million',
			gravity: "Ideas, trends, what's next",
			style: 'Riff machine'
		},
		{
			name: 'Chris Williamson',
			href: '/personality-analysis/chris-williamson',
			type: 'Type 3 · Achiever',
			show: 'Modern Wisdom',
			gravity: 'Self-improvement, optimization',
			style: 'Benchmark interview'
		},
		{
			name: 'Howard Stern',
			href: '/personality-analysis/howard-stern',
			type: 'Type 6 · Loyalist',
			show: 'The Howard Stern Show',
			gravity: 'Fear, taboo, power dynamics',
			style: 'Counterphobic interrogation'
		}
	];
</script>

<div class="podcaster-map">
	<div class="podcaster-map__table-shell">
		<table>
			<caption class="sr-only">
				Thirteen podcast hosts compared by Enneagram type, show, topic gravity, and interview style
			</caption>
			<thead>
				<tr>
					<th scope="col">Podcaster</th>
					<th scope="col">Enneagram type</th>
					<th scope="col">Show / platform</th>
					<th scope="col">Topic gravity</th>
					<th scope="col">Interview style</th>
				</tr>
			</thead>
			<tbody>
				{#each podcasters as podcaster (podcaster.href)}
					<tr>
						<th scope="row"><a href={podcaster.href}>{podcaster.name}</a></th>
						<td>{podcaster.type}</td>
						<td>{podcaster.show}</td>
						<td>{podcaster.gravity}</td>
						<td>{podcaster.style}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="podcaster-map__cards" aria-label="Podcaster personality map">
		{#each podcasters as podcaster (podcaster.href)}
			<a class="podcaster-card" href={podcaster.href}>
				<div class="podcaster-card__header">
					<h3>{podcaster.name}</h3>
					<span>{podcaster.type}</span>
				</div>
				<p class="podcaster-card__show">{podcaster.show}</p>
				<dl>
					<div>
						<dt>Topic gravity</dt>
						<dd>{podcaster.gravity}</dd>
					</div>
					<div>
						<dt>Interview style</dt>
						<dd>{podcaster.style}</dd>
					</div>
				</dl>
			</a>
		{/each}
	</div>
</div>

<style lang="scss">
	.podcaster-map {
		margin: 2rem 0;
	}

	.podcaster-map__table-shell {
		overflow-x: auto;
		border: 1px solid var(--stone-edge);
		border-radius: 1rem;
		background: var(--night-deep);
	}

	table {
		min-width: 46rem;
		margin: 0 !important;
	}

	th[scope='row'] {
		font-weight: 600;
		color: var(--ink-bright);
	}

	td,
	th {
		vertical-align: top;
	}

	a {
		color: var(--lamp-glow);
		text-decoration-thickness: 1px;
		text-underline-offset: 0.16em;
	}

	.podcaster-map__cards {
		display: none;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	@media (max-width: 47.99rem) {
		.podcaster-map {
			margin: 1.5rem 0;
		}

		.podcaster-map__table-shell {
			display: none;
		}

		.podcaster-map__cards {
			display: grid;
			gap: 0.75rem;
		}

		.podcaster-card {
			display: block;
			padding: 1rem;
			border: 1px solid var(--stone-edge);
			border-radius: 1rem;
			background: var(--stone-warm);
			color: var(--ink-mid);
			text-decoration: none;
			transition:
				border-color 160ms ease,
				background-color 160ms ease;
		}

		.podcaster-card:hover {
			border-color: var(--lamp-glow);
			background: var(--night-deep);
		}

		:global(.podcaster-card:focus-visible) {
			outline: 2px solid var(--lamp-glow);
			outline-offset: 3px;
		}

		.podcaster-card__header {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			gap: 0.75rem;
		}

		.podcaster-card__header h3 {
			margin: 0;
			padding: 0;
			font-size: 1rem;
			line-height: 1.35;
			color: var(--ink-bright);
		}

		.podcaster-card__header span {
			flex: 0 0 auto;
			padding: 0.2rem 0.45rem;
			border-radius: 999px;
			background: var(--lamp-soft);
			font-family: var(--font-mono);
			font-size: 0.65rem;
			font-weight: 700;
			line-height: 1.35;
			letter-spacing: 0.04em;
			color: var(--lamp-glow);
		}

		.podcaster-card__show {
			margin: 0.35rem 0 0.85rem !important;
			font-size: 0.875rem;
			font-weight: 600;
			color: var(--ink-mid);
		}

		dl {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 0.75rem;
			margin: 0;
		}

		dl > div {
			min-width: 0;
		}

		dt {
			margin-bottom: 0.2rem;
			font-family: var(--font-mono);
			font-size: 0.65rem;
			font-weight: 700;
			letter-spacing: 0.06em;
			text-transform: uppercase;
			color: var(--ink-dim);
		}

		dd {
			margin: 0;
			font-size: 0.8rem;
			line-height: 1.45;
			color: var(--ink-mid);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.podcaster-card {
			transition: none;
		}
	}
</style>
