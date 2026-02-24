<!-- src/routes/admin/asset-generators/+page.svelte -->
<script lang="ts">
	const generators = [
		{
			href: '/admin/asset-generators/question-print',
			title: 'Question Print',
			description: 'Generate printable question cards with QR links.'
		},
		{
			href: '/admin/asset-generators/poster-generator',
			title: 'Poster Generator',
			description: 'Create branded social and print posters from question prompts.'
		},
		{
			href: '/admin/asset-generators/zine-creator',
			title: 'Zine Creator',
			description: 'Turn 9takes blogs into imposed, print-ready zines.'
		}
	];
</script>

<div class="asset-generators">
	<header class="hero">
		<h1>Asset Generators</h1>
		<p>All generation tools are now co-located under one admin section.</p>
	</header>

	<section class="grid">
		{#each generators as generator}
			<a class="card" href={generator.href}>
				<h2>{generator.title}</h2>
				<p>{generator.description}</p>
				<span>Open tool</span>
			</a>
		{/each}
	</section>
</div>

<style>
	.asset-generators {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.hero {
		padding: 1.25rem;
		border-radius: 0.75rem;
		border: 1px solid var(--void-elevated);
		background: linear-gradient(130deg, rgba(15, 23, 42, 0.92), rgba(30, 41, 59, 0.86));
	}

	.hero h1 {
		margin: 0;
		font-size: 1.7rem;
	}

	.hero p {
		margin: 0.5rem 0 0;
		color: var(--text-muted);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(230px, 1fr));
		gap: 0.9rem;
	}

	.card {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		padding: 1rem;
		border-radius: 0.7rem;
		border: 1px solid var(--void-elevated);
		background: var(--void-deep);
		text-decoration: none;
		color: inherit;
		transition:
			border-color 0.2s ease,
			transform 0.2s ease;
	}

	.card:hover {
		transform: translateY(-1px);
		border-color: color-mix(in srgb, var(--nebula-primary) 50%, var(--void-elevated));
	}

	.card h2 {
		margin: 0;
		font-size: 1.05rem;
	}

	.card p {
		margin: 0;
		color: var(--text-muted);
		line-height: 1.35;
		font-size: 0.92rem;
	}

	.card span {
		margin-top: auto;
		font-size: 0.85rem;
		font-weight: 700;
		color: color-mix(in srgb, var(--nebula-primary) 65%, white);
	}

	@media (max-width: 1040px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
