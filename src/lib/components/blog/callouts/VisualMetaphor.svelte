<!-- src/lib/components/blog/callouts/VisualMetaphor.svelte -->
<script lang="ts">
	export let title = '';
</script>

<figure class="rounded-lg border border-info-100 bg-info-50/70 px-4 py-4 shadow-sm">
	{#if title}
		<figcaption class="mb-2 text-base font-semibold text-info-800">{title}</figcaption>
	{/if}
	<div class="space-y-3 text-sm leading-snug text-neutral-800">
		<slot />
	</div>
</figure>
