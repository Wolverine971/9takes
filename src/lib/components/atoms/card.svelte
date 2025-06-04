<!-- lib/components/atoms/card.svelte -->
<script lang="ts">
	export let style = '';
	export let className = '';
</script>

<section class="p-2 {className}" {style}>
	<slot />
</section>