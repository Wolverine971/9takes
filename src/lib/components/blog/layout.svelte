<!-- src/lib/components/blog/layout.svelte -->
<!--
	NOTE: This component is mostly unused. Consider removing if not needed.
	Currently only imported by src/routes/community/+page.svelte
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	// mdsvex spreads the post's frontmatter metadata in as props as well; the
	// layout only renders the post body, so everything else is ignored.
	interface Props {
		children?: Snippet;
		[key: string]: unknown;
	}

	let { children }: Props = $props();
</script>

{@render children?.()}
