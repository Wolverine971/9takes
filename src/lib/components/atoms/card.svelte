<!-- src/lib/components/atoms/card.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		style?: string;
		className?: string;
		children?: Snippet;
	}

	let { style = '', className = '', children }: Props = $props();
</script>

<section class="md:p-4 {className}" {style}>
	{@render children?.()}
</section>
