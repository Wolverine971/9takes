<!-- src/routes/design-preview/blog-evidence/+page.svelte -->
<script lang="ts">
	import EvidenceFigure from '$lib/components/blog/EvidenceFigure.svelte';
	import '../../../scss/blog.scss';

	const evidenceIds = [
		'elon-model-3-launch-2017',
		'elon-talulah-riley-childhood-quote',
		'elon-kimbal-musk-empathy-quote',
		'elon-justine-musk-intimacy-quote',
		'elon-walter-isaacson-conference-room-source'
	];
</script>

<svelte:head>
	<title>Blog Evidence Component Preview</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="evidence-preview">
	<header class="evidence-preview__header">
		<p>§01 · COMPONENT PROOF</p>
		<h1>Elon Musk evidence cards</h1>
		<span>Five local visual hooks. No Supabase data is changed by this preview.</span>
		<a class="full-preview-link" href="/design-preview/blog-evidence/elon-musk">
			View these hooks inside the full Elon article →
		</a>
	</header>

	<article>
		{#each evidenceIds as evidenceId (evidenceId)}
			<EvidenceFigure {evidenceId} />
		{/each}
	</article>
</main>

<style>
	.evidence-preview {
		min-height: 100vh;
		padding: clamp(2rem, 6vw, 5rem) 1rem;
		background: var(--night-deep);
		color: var(--ink-bright);
	}

	.evidence-preview__header {
		width: min(100%, 52rem);
		margin: 0 auto 3rem;
	}

	.evidence-preview__header p {
		margin: 0 0 0.65rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--lamp-glow);
	}

	.evidence-preview__header h1 {
		margin: 0 0 0.8rem;
		font-family: var(--font-display);
		font-size: clamp(2rem, 6vw, 4rem);
		line-height: 1;
		letter-spacing: -0.04em;
	}

	.evidence-preview__header span {
		display: block;
		color: var(--ink-mid);
	}

	.full-preview-link {
		display: inline-block;
		margin-top: 1rem;
		color: var(--lamp-glow);
		text-underline-offset: 0.18em;
	}

	article {
		width: min(100%, 68rem);
		margin: 0 auto;
	}
</style>
