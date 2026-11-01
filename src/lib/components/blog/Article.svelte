<!-- src/lib/components/blog/Article.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<article>
	{@render children?.()}
</article>

<style>
	article {
		margin-bottom: calc(var(--spacing-unit) * 8);
	}
</style>
