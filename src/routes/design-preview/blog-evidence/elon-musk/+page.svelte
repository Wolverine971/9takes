<!-- src/routes/design-preview/blog-evidence/elon-musk/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import '../../../../scss/blog.scss';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Enriched Elon Musk Article Preview</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="article-preview">
	<div class="preview-bar">
		<div>
			<strong>LOCAL ENRICHMENT PREVIEW</strong>
			<span>{data.evidenceCount} visual hooks · Supabase unchanged</span>
		</div>
		<a href="/design-preview/blog-evidence">View component gallery</a>
	</div>

	<header class="article-preview__header">
		<p>§01 · PERSONALITY CASE FILE</p>
		<h1>{data.title}</h1>
		{#if data.description}
			<span>{data.description}</span>
		{/if}
	</header>

	<article class="article-body">
		{@html data.content}
	</article>
</main>

<style>
	.article-preview {
		min-height: 100vh;
		padding: 1.5rem 1rem 6rem;
		background: var(--night-deep);
		color: var(--ink-bright);
	}

	.preview-bar {
		display: flex;
		width: min(100%, 68rem);
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin: 0 auto 4rem;
		padding: 0.85rem 1rem;
		border: 1px solid var(--stone-edge);
		border-radius: 0.625rem;
		background: var(--night-mid);
		font-family: var(--font-mono);
		font-size: 0.75rem;
	}

	.preview-bar div {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 0.8rem;
	}

	.preview-bar strong {
		color: var(--lamp-glow);
	}

	.preview-bar span {
		color: var(--ink-mid);
	}

	.preview-bar a {
		flex: none;
		color: var(--ink-bright);
		text-underline-offset: 0.18em;
	}

	.article-preview__header {
		width: min(100%, 68rem);
		margin: 0 auto clamp(3rem, 8vw, 6rem);
	}

	.article-preview__header p {
		margin: 0 0 0.8rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--lamp-glow);
	}

	.article-preview__header h1 {
		max-width: 18ch;
		margin: 0 0 1rem;
		font-family: var(--font-display);
		font-size: clamp(2.4rem, 7vw, 5.5rem);
		line-height: 0.98;
		letter-spacing: -0.05em;
		color: var(--ink-bright);
	}

	.article-preview__header span {
		display: block;
		max-width: 62ch;
		font-size: 1.05rem;
		line-height: 1.6;
		color: var(--ink-mid);
	}

	.article-body {
		width: min(100%, var(--prose-measure));
		min-width: 0;
		margin: 0 auto;
		overflow-x: hidden;
		font-family: var(--font-display);
		font-size: 1.125rem;
		line-height: 1.7;
		color: var(--ink-bright);
	}

	.article-body :global(h2) {
		margin: 4rem 0 1rem;
		padding-top: 1rem;
		font-family: var(--font-display);
		font-size: clamp(1.7rem, 4vw, 2.35rem);
		line-height: 1.15;
		letter-spacing: -0.025em;
		color: var(--ink-bright);
	}

	.article-body :global(h3) {
		margin: 2.5rem 0 0.75rem;
		font-size: clamp(1.3rem, 3vw, 1.65rem);
		line-height: 1.25;
		color: var(--ink-bright);
	}

	.article-body :global(p) {
		margin: 0 0 1.4rem;
		font-size: inherit;
		color: var(--ink-bright);
	}

	.article-body :global(ul),
	.article-body :global(ol) {
		margin: 1rem 0 1.5rem;
		padding-left: 1.5rem;
	}

	.article-body :global(li) {
		margin-bottom: 0.55rem;
	}

	.article-body :global(a) {
		color: var(--lamp-glow);
		text-underline-offset: 0.18em;
	}

	.article-body :global(.inner-thought) {
		margin: 2rem 0;
		padding: 1.25rem 1.5rem;
		border-left: 3px solid var(--data-teal);
		background: var(--night-mid);
		font-family: var(--font-mono);
		color: var(--ink-mid);
	}

	.article-body :global(details) {
		margin: 3rem 0;
		padding: 1rem;
		border: 1px solid var(--stone-edge);
		border-radius: 0.625rem;
		background: var(--night-mid);
	}

	.article-body :global(summary) {
		cursor: pointer;
		font-weight: 700;
		color: var(--lamp-glow);
	}

	@media (max-width: 680px) {
		.article-preview {
			padding: 1rem 0.9rem 4rem;
		}

		.preview-bar {
			align-items: flex-start;
			flex-direction: column;
			margin-bottom: 3rem;
		}

		.article-preview__header h1 {
			font-size: 2.7rem;
		}

		.article-body {
			font-size: 1.0625rem;
		}

		.article-body :global(h2) {
			margin-top: 3rem;
			font-size: 1.75rem;
		}
	}
</style>
