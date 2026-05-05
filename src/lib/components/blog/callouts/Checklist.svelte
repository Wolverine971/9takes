<!-- src/lib/components/blog/callouts/Checklist.svelte -->
<!--
  9takes Warm Tech Theme - Interactive checklist for blog content
  Used for action items, to-do lists, or step-by-step guides
-->
<script lang="ts">
	export let title = '';
	export let items: string[] = [];
	export let note = '';

	/**
	 * Optional children content (used when dynamically mounted from Supabase content)
	 */
	export let children: string | ((...args: unknown[]) => unknown) = '';

	const slugify = (value: string) =>
		value
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '') || 'checklist';

	const listId = slugify(title || 'checklist');

	// Track checked state for each item (avoids CSS :has() which Sass doesn't support)
	let checkedStates: boolean[] = items.map(() => false);
</script>

<section class="checklist">
	{#if title}
		<h3 class="checklist__title">{title}</h3>
	{/if}

	<div class="checklist__items">
		{#each items as item, index}
			{@const itemId = `${listId}-${index}`}
			<div class="checklist__item" class:checklist__item--checked={checkedStates[index]}>
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
	{:else}
		<slot />
	{/if}
</section>

<style lang="scss">
	.checklist {
		margin: 1.5rem 0;
		padding: 1.25rem 1.5rem;
		border-radius: 12px;
		background: linear-gradient(
			135deg,
			var(--stone-warm) 0%,
			var(--night-deep) 50%,
			var(--night-deep) 100%
		);
		border: 1px solid rgba(45, 212, 191, 0.2);
		box-shadow:
			0 4px 20px rgba(0, 0, 0, 0.3),
			0 0 0 1px rgba(45, 212, 191, 0.1);
	}

	.checklist__title {
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--ink-bright);
		text-align: center;
		margin: 0 0 1rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid rgba(45, 212, 191, 0.2);
	}

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
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid color-mix(in srgb, var(--ink-dim) 15%, transparent);
		border-radius: 8px;
		transition: all 0.2s ease;

		&:hover {
			background: rgba(45, 212, 191, 0.08);
			border-color: rgba(45, 212, 191, 0.25);
		}
	}

	.checklist__checkbox {
		margin-top: 0.125rem;
		width: 18px;
		height: 18px;
		border-radius: 4px;
		border: 2px solid var(--ink-dim);
		background: transparent;
		cursor: pointer;
		flex-shrink: 0;
		appearance: none;
		-webkit-appearance: none;
		transition: all 0.2s ease;

		&:checked {
			background: linear-gradient(135deg, var(--lamp-glow) 0%, var(--lamp-glow) 100%);
			border-color: var(--lamp-glow);

			// Checkmark
			&::after {
				content: '✓';
				display: flex;
				align-items: center;
				justify-content: center;
				color: white;
				font-size: 12px;
				font-weight: bold;
			}
		}

		&:focus {
			outline: none;
			box-shadow: 0 0 0 3px rgba(45, 212, 191, 0.3);
		}
	}

	.checklist__label {
		font-size: 0.9rem;
		line-height: 1.6;
		color: var(--ink-mid);
		cursor: pointer;
		flex: 1;

		:global(strong),
		:global(b) {
			color: var(--ink-bright);
			font-weight: 600;
		}

		:global(a) {
			color: var(--lamp-glow);

			&:hover {
				color: var(--lamp-glow);
			}
		}
	}

	// Checked state styling for the whole item
	.checklist__item--checked {
		background: rgba(34, 197, 94, 0.08);
		border-color: rgba(34, 197, 94, 0.2);

		.checklist__label {
			color: var(--ink-mid);
			text-decoration: line-through;
			text-decoration-color: var(--ink-dim);
		}
	}

	.checklist__note {
		margin: 1rem 0 0;
		padding-top: 0.75rem;
		border-top: 1px solid color-mix(in srgb, var(--ink-dim) 15%, transparent);
		font-size: 0.8rem;
		line-height: 1.5;
		color: var(--ink-dim);
		font-style: italic;
	}

	.checklist__content {
		margin-top: 1rem;
		font-size: 0.9rem;
		line-height: 1.6;
		color: var(--ink-mid);
	}

	// Mobile adjustments
	@media (max-width: 640px) {
		.checklist {
			padding: 1rem 1.25rem;
			margin: 1rem 0;
		}

		.checklist__title {
			font-size: 1rem;
		}

		.checklist__item {
			padding: 0.625rem 0.875rem;
		}

		.checklist__label {
			font-size: 0.85rem;
		}
	}
</style>
