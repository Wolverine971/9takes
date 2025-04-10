<script lang="ts">
	export let slug = '';
	export let title: string;
	const cleanedTitle = title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
	const id = cleanedTitle;

	const href = slug ? `/blog/${slug}` : '#' + id;
</script>

{#if slug}
	<h2 class="heading" class:large={!slug} {id} style:--tag={`h-blog-${cleanedTitle}`}>
		<a {href}>
			{title}
		</a>
	</h2>
{:else}
	<h1
		class="heading"
		class:large={!slug}
		{id}
		itemprop="name"
		style:--tag={`h-blog-${cleanedTitle}`}
	>
		{title}
	</h1>
{/if}

<style>
	h1 {
		text-wrap: balance;
	}
	h2 {
		margin: 0;
		text-wrap: balance;
	}
	.heading {
		margin: 0;
		font-size: 1.8rem;
		font-weight: bolder;
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
