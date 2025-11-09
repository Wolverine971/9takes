<!-- src/lib/components/blog/callouts/Checklist.svelte -->
<script lang="ts">
	export let title = '';
	export let items: string[] = [];
	export let note = '';

	const slugify = (value: string) =>
		value
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '') || 'checklist';

	const listId = slugify(title || 'checklist');
</script>

<section class="rounded-2xl border border-neutral-200 bg-white/95 p-5 shadow-sm">
	{#if title}
		<h3 class="text-center text-lg font-semibold text-neutral-900">{title}</h3>
	{/if}

	<div class="mt-4 space-y-3">
		{#each items as item, index}
			{@const itemId = `${listId}-${index}`}
			<div class="flex items-start gap-3 rounded-xl border border-neutral-100 bg-neutral-50/60 px-3 py-2">
				<input
					type="checkbox"
					id={itemId}
					class="mt-1 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
					aria-label={`Checklist item ${index + 1}`}
				/>
				<label for={itemId} class="text-sm leading-snug text-neutral-800">
					{@html item}
				</label>
			</div>
		{/each}
	</div>

	{#if note}
		<p class="mt-4 text-xs leading-snug text-neutral-500">{note}</p>
	{/if}
</section>
