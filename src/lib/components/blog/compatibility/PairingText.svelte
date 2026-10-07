<!-- src/lib/components/blog/compatibility/PairingText.svelte -->
<!--
  Renders one pairing prose field from $lib/data/enneagramCompatibility,
  turning its [text](/path) markup into links without {@html}.
-->
<script lang="ts">
	import { splitInlineLinks } from '$lib/data/enneagramCompatibility';

	let { text }: { text: string } = $props();

	const segments = $derived(splitInlineLinks(text));
</script>

{#each segments as segment, index (index)}{#if segment.href}<a href={segment.href}>{segment.text}</a
		>{:else}{segment.text}{/if}{/each}
