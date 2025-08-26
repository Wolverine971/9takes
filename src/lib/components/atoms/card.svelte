<!-- src/lib/components/atoms/card.svelte -->
<script lang="ts">
	export let style = '';
	export let className = '';
</script>

<section class="md:p-4 {className}" {style}>
	<slot />
</section>
