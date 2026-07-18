<!-- src/routes/admin/asset-generators/+page.svelte -->
<script lang="ts">
	import { ArrowUpRight, FileQuestion, Newspaper, PanelsTopLeft } from '@lucide/svelte';

	const generators = [
		{
			href: '/admin/asset-generators/question-print',
			title: 'Question Print',
			description: 'Generate printable question cards with QR links.',
			label: 'Conversation cards',
			icon: FileQuestion
		},
		{
			href: '/admin/asset-generators/poster-generator',
			title: 'Poster Generator',
			description: 'Create branded social and print posters from question prompts.',
			label: 'Social and print',
			icon: PanelsTopLeft
		},
		{
			href: '/admin/asset-generators/zine-creator',
			title: 'Zine Creator',
			description: 'Turn 9takes blogs into imposed, print-ready zines.',
			label: 'Editorial production',
			icon: Newspaper
		}
	];
</script>

<div class="asset-generators">
	<header class="page-header">
		<div>
			<span class="page-kicker">Production bench</span>
			<h1>Asset generators</h1>
			<p>Create printable, social, and editorial assets from one workspace.</p>
		</div>
	</header>

	<section class="generator-grid" aria-label="Asset generation tools">
		{#each generators as generator (generator.href)}
			{@const Icon = generator.icon}
			<a class="card" href={generator.href}>
				<span class="card-icon">
					<Icon size={22} strokeWidth={1.7} aria-hidden="true" />
				</span>
				<span class="card-copy">
					<span class="card-label">{generator.label}</span>
					<strong>{generator.title}</strong>
					<small>{generator.description}</small>
				</span>
				<span class="card-action">
					Open
					<ArrowUpRight size={15} strokeWidth={1.8} aria-hidden="true" />
				</span>
			</a>
		{/each}
	</section>
</div>

<style>
	.asset-generators {
		display: grid;
		gap: 1rem;
	}

	.page-header {
		position: relative;
		overflow: hidden;
		padding: 1.25rem;
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		background:
			radial-gradient(
				circle at 90% 10%,
				color-mix(in srgb, var(--lamp-glow) 14%, transparent),
				transparent 42%
			),
			var(--stone-warm);
	}

	.page-kicker {
		display: block;
		margin-bottom: 0.35rem;
		color: var(--lamp-glow);
		font-family: var(--font-mono);
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.page-header h1 {
		margin: 0;
		font-size: 1.7rem;
		color: var(--ink-bright);
		letter-spacing: -0.025em;
	}

	.page-header p {
		margin: 0.5rem 0 0;
		color: var(--ink-mid);
	}

	.generator-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(230px, 1fr));
		gap: 0.75rem;
	}

	.card {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: start;
		gap: 0.75rem;
		min-width: 0;
		padding: 1rem;
		border: 1px solid var(--stone-edge);
		border-radius: 16px;
		background: var(--stone-warm);
		text-decoration: none;
		color: inherit;
		transition:
			background 0.2s ease,
			border-color 0.2s ease,
			transform 0.2s ease;
	}

	.card:hover {
		transform: translateY(-1px);
		border-color: color-mix(in srgb, var(--lamp-glow) 50%, var(--stone-edge));
		background: color-mix(in srgb, var(--lamp-glow) 5%, var(--stone-warm));
	}

	.card-icon {
		display: grid;
		width: 42px;
		height: 42px;
		flex: 0 0 42px;
		place-items: center;
		border: 1px solid var(--stone-edge);
		border-radius: 10px;
		background: var(--night-mid);
		color: var(--lamp-glow);
	}

	.card-copy {
		display: grid;
		min-width: 0;
		gap: 0.2rem;
	}

	.card-label {
		color: var(--ink-mid);
		font-family: var(--font-mono);
		font-size: 0.6rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.card-copy strong {
		color: var(--ink-bright);
		font-size: 0.98rem;
	}

	.card-copy small {
		color: var(--ink-mid);
		font-size: 0.76rem;
		line-height: 1.45;
	}

	.card-action {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		color: var(--lamp-glow);
		font-size: 0.7rem;
		font-weight: 700;
	}

	@media (max-width: 1040px) {
		.generator-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 768px) {
		.card {
			padding: 0.8rem;
		}

		.card-action {
			align-self: center;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.card {
			transition: none;
		}
	}
</style>
