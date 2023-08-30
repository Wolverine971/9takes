<script lang="ts">
	export let slug = '';
	export let title: string;
	const id = title
		.toLowerCase()
		.replace(/[^a-zA-Z ]/g, '')
		.replace(/\s/g, '-');

	const href = slug ? `/blog/${slug}` : '#' + id;
</script>

{#if slug}
	<h2 class="heading" class:large={!slug} {id}>
		<a {href}>
			{title}
		</a>
	</h2>
{:else}
	<h1 class="heading" class:large={!slug} {id}>
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
