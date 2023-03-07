<script lang="ts">
	export let description: string;
	export let slug = '';
	const href = slug && `/blog/${slug}`;
</script>

<p>
	{description}

	{#if slug}
		<a {href}>Read More </a>
	{/if}
</p>

<style>
	p {
		align-items: inherit;
		margin: 0;
		margin-bottom: calc(var(--spacing-unit) * 2);
	}
</style>
