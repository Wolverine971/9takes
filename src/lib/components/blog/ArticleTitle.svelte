<!-- src/lib/components/blog/ArticleTitle.svelte -->
<script lang="ts">
	interface Props {
		slug?: string;
		title: string;
		structuredData?: boolean;
		headingTag?: 'h1' | 'h2';
	}

	let { slug = '', title, structuredData = false, headingTag = 'h1' }: Props = $props();
	const cleanedTitle = $derived(title.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''));
	const id = $derived(cleanedTitle);

	const href = $derived(slug ? `/blog/${slug}` : '#' + id);
</script>

{#if slug}
	<h2 class={['heading', { large: !slug }]} {id} style:--tag={`h-blog-${cleanedTitle}`}>
		<a {href}>
			{title}
		</a>
	</h2>
{:else if headingTag === 'h2'}
	<h2
		class={['heading', { large: !slug }]}
		{id}
		itemprop={structuredData ? 'headline' : undefined}
		style:--tag={`h-blog-${cleanedTitle}`}
	>
		{title}
	</h2>
{:else}
	<h1
		class={['heading', { large: !slug }]}
		{id}
		itemprop={structuredData ? 'headline' : undefined}
		style:--tag={`h-blog-${cleanedTitle}`}
	>
		{title}
	</h1>
{/if}

<style>
	/* Post titles are full sentences, so they stay Archivo semibold (Anton is
	   for short uppercase shouts only). */
	h1 {
		text-wrap: balance;
		color: var(--text);
	}
	h2 {
		margin: 0;
		text-wrap: balance;
	}
	.heading {
		margin: 0;
		font-family: var(--font-talk);
		font-size: 1.8rem;
		font-weight: 600;
		color: var(--text);
	}
	.heading a {
		color: var(--highlight);
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.15em;
		transition: color 0.2s ease;
	}
	.heading a:hover {
		color: var(--text);
	}
	.large {
		margin-top: calc(var(--spacing-unit) * 1);
		font-size: 3rem;
	}
	@media (max-width: 1200px) {
		.large {
			font-size: 2rem;
		}
	}

	@media (max-width: 500px) {
		.large {
			font-size: 1.5rem;
		}
	}
</style>
