<!-- src/lib/components/blog/callouts/Checklist.svelte -->
<!--
  Interactive checklist for blog content — action items, to-do lists, steps.
  Shell renders through the shared <Callout> base (2026-06-10 consolidation);
  the title becomes the base's Archivo label. Public props unchanged.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import Callout from './Callout.svelte';

	interface Props {
		title?: string;
		items?: string[];
		note?: string;
		/**
		 * Body content: an HTML string when dynamically mounted from Supabase
		 * content, or the markdown/default content snippet otherwise.
		 */
		children?: Snippet | string;
	}

	let { title = '', items = [], note = '', children = '' }: Props = $props();

	const slugify = (value: string) =>
		value
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '') || 'checklist';

	const listId = $derived(slugify(title || 'checklist'));

	// Track checked state for each item (avoids CSS :has() which Sass doesn't support).
	// Deeply reactive so bind:checked can write into it; starts over if the item list changes.
	const checkedStates = $derived.by(() => {
		const states = $state(items.map(() => false));
		return states;
	});
</script>

<Callout label={title}>
	<div class="checklist__items">
		{#each items as item, index (item)}
			{@const itemId = `${listId}-${index}`}
			<div class={['checklist__item', { 'checklist__item--checked': checkedStates[index] }]}>
				<input
					type="checkbox"
					id={itemId}
					class="checklist__checkbox"
					bind:checked={checkedStates[index]}
				/>
				<label for={itemId} class="checklist__label">
					{@html item}
				</label>
			</div>
		{/each}
	</div>

	{#if note}
		<p class="checklist__note">{note}</p>
	{/if}

	{#if typeof children === 'string' && children.trim() !== ''}
		<div class="checklist__content">
			{@html children}
		</div>
	{:else if typeof children === 'function'}
		{@render children()}
	{/if}
</Callout>

<style lang="scss">
	.checklist__items {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.checklist__item {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		background: var(--bg);
		border: 1px solid var(--rule);
		border-radius: 0.625rem;
		transition:
			background 0.2s ease,
			border-color 0.2s ease;

		&:hover {
			background: var(--surface-raised);
			border-color: color-mix(in srgb, var(--accent) 45%, var(--rule));
		}
	}

	.checklist__checkbox {
		margin-top: 0.125rem;
		width: 18px;
		height: 18px;
		border-radius: 4px;
		border: 2px solid var(--text-faint);
		background: transparent;
		cursor: pointer;
		flex-shrink: 0;
		appearance: none;
		-webkit-appearance: none;
		transition:
			background 0.2s ease,
			border-color 0.2s ease;

		/* Checked = indigo fill, light check (--text on --accent is fine). */
		&:checked {
			background: var(--accent);
			border-color: var(--accent);

			&::after {
				content: '✓';
				display: flex;
				align-items: center;
				justify-content: center;
				color: var(--text);
				font-size: var(--font-size-xs);
				font-weight: bold;
				line-height: 14px;
			}
		}

		&:focus {
			outline: none;
		}

		&:focus-visible {
			outline: 2px solid var(--highlight);
			outline-offset: 2px;
		}
	}

	.checklist__label {
		font-size: var(--font-size-base);
		line-height: 1.6;
		color: var(--text-muted);
		cursor: pointer;
		flex: 1;

		:global(strong),
		:global(b) {
			color: var(--text);
			font-weight: 600;
		}

		:global(a) {
			color: var(--highlight);
			text-decoration: underline;
		}
	}

	/* Checked: the row settles onto --surface-raised with an indigo edge (no green). */
	.checklist__item--checked {
		background: var(--surface-raised);
		border-color: color-mix(in srgb, var(--accent) 45%, var(--rule));

		.checklist__label {
			color: var(--text-faint);
			text-decoration: line-through;
			text-decoration-color: var(--text-faint);
		}
	}

	.checklist__note {
		margin: 1rem 0 0;
		padding-top: 0.75rem;
		border-top: 1px solid var(--rule);
		font-size: var(--font-size-sm);
		line-height: 1.5;
		color: var(--text-faint);
		font-style: italic;
	}

	.checklist__content {
		margin-top: 1rem;
	}

	@media (max-width: 640px) {
		.checklist__item {
			padding: 0.625rem 0.875rem;
		}

		.checklist__label {
			font-size: var(--font-size-sm);
		}
	}
</style>
