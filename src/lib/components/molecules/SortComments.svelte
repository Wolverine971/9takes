<!-- src/lib/components/molecules/SortComments.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import SlidersIcon from '$lib/components/icons/slidersIcon.svelte';
	import { notifications } from '$lib/components/molecules/notifications';
	import { Button } from '$lib/components/atoms';
	import Modal, { getModal } from '$lib/components/atoms/Modal.svelte';
	import type { QuestionPageData } from '$lib/types/questions';

	interface Props {
		data: QuestionPageData;
		size?: 'large' | 'medium' | 'small';
		value?: SortOrder;
		types?: string[];
		onfilterChange?: (filters: { sort: SortOrder; types: string[] }) => void;
	}

	let { data, size = 'large', value = 'ranked', types, onfilterChange }: Props = $props();

	// State variables
	let reduceMotion = $state(false);

	type EnneagramTypeOption =
		'1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'unknown' | 'rando';
	type SortOrder = 'ranked' | 'newest' | 'oldest' | 'likes';

	const typeLabels: Record<string, string> = {
		'1': '1',
		'2': '2',
		'3': '3',
		'4': '4',
		'5': '5',
		'6': '6',
		'7': '7',
		'8': '8',
		'9': '9',
		unknown: '?',
		rando: '∞'
	};

	const typeNames: Record<string, string> = {
		'1': 'Reformer',
		'2': 'Helper',
		'3': 'Achiever',
		'4': 'Individualist',
		'5': 'Investigator',
		'6': 'Loyalist',
		'7': 'Enthusiast',
		'8': 'Challenger',
		'9': 'Peacemaker',
		unknown: 'Unknown',
		rando: 'Anonymous'
	};

	const typeOptions: EnneagramTypeOption[] = [
		'1',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9',
		'unknown',
		'rando'
	];
	let selected = $state<EnneagramTypeOption[]>([...typeOptions]);
	let sortBy = $state<SortOrder>('ranked');

	// Derived state for filter status
	let hasActiveFilters = $derived(
		(types?.length ?? typeOptions.length) !== typeOptions.length || value !== 'ranked'
	);
	let currentSortLabel = $derived(
		value === 'ranked'
			? data.commentRankingEnabled
				? 'Ranked'
				: 'Default'
			: value === 'likes'
				? 'Likes'
				: value === 'newest'
					? 'Newest'
					: 'Oldest'
	);

	onMount(() => {
		reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	});

	// Draft controls only commit when Apply is pressed. All work stays in memory.
	function openFilters() {
		selected = (types ?? typeOptions).filter((type): type is EnneagramTypeOption =>
			typeOptions.includes(type as EnneagramTypeOption)
		);
		sortBy = value;
		getModal('sorter').open();
	}

	function applyFilters() {
		if (!canSort()) return;
		onfilterChange?.({ sort: sortBy, types: [...selected] });
		getModal('sorter').close();
	}

	// Check if user can sort (must have answered the question)
	function canSort() {
		if (!data?.flags?.userHasAnswered) {
			notifications.info('You must answer the question before sorting comments', 3000);
			return false;
		}
		return true;
	}

	// Select/deselect all types
	function selectAll() {
		selected = [...typeOptions];
	}

	function clearAll() {
		selected = [];
	}

	// Toggle a single type
	function toggleType(type: EnneagramTypeOption) {
		if (selected.includes(type)) {
			selected = selected.filter((t) => t !== type);
		} else {
			selected = [...selected, type];
		}
	}
</script>

{#snippet filterIcon()}
	<SlidersIcon className="h-4 w-4" />
{/snippet}

{#snippet applyIcon()}
	<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
	</svg>
{/snippet}

<!-- Filter Button -->
<Button
	type="button"
	variant="ghost"
	size={size === 'large' ? 'md' : 'sm'}
	class={`filter-btn-atom ${size === 'large' ? 'filter-btn-atom--large' : 'filter-btn-atom--compact'}`}
	onclick={openFilters}
	aria-label="Filter and sort comments"
	title="Filter and sort comments"
	icon={filterIcon}
>
	{currentSortLabel} · Filter
	{#if hasActiveFilters}
		{#if size === 'large'}
			<span
				class="filter-btn__badge"
				in:scale={{ duration: reduceMotion ? 0 : 150, easing: cubicOut }}
			>
				{#if selected.length !== typeOptions.length}
					{selected.length}
				{:else}
					<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2.5"
							d="M5 13l4 4L19 7"
						/>
					</svg>
				{/if}
			</span>
		{:else}
			<span
				class="filter-btn__dot"
				in:scale={{ duration: reduceMotion ? 0 : 150, easing: cubicOut }}
			></span>
		{/if}
	{/if}
</Button>

<!-- Filter Modal -->
<Modal id="sorter" name="Filter and sort comments" maxWidth="420px">
	<div
		class="filter-modal"
		in:fly={{ y: reduceMotion ? 0 : -20, duration: reduceMotion ? 0 : 300, easing: cubicOut }}
	>
		<!-- Header -->
		<div class="filter-modal__header">
			<div class="filter-modal__title-group">
				<span class="filter-modal__icon">
					<SlidersIcon className="h-5 w-5" />
				</span>
				<h2 class="filter-modal__title">Filter & Sort</h2>
			</div>
			<button
				type="button"
				class="filter-modal__close"
				onclick={() => getModal('sorter').close()}
				aria-label="Close"
			>
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>

		<!-- Personality Type Filters -->
		<div class="filter-section">
			<div class="filter-section__header">
				<h3 class="filter-section__title">Personality Types</h3>
				<div class="filter-section__actions">
					<button type="button" class="text-btn" onclick={selectAll}>All</button>
					<span class="divider">|</span>
					<button type="button" class="text-btn" onclick={clearAll}>None</button>
				</div>
			</div>

			<div class="type-grid">
				{#each typeOptions as type (type)}
					{@const isSelected = selected.includes(type)}
					<button
						type="button"
						class={['type-chip', isSelected && 'type-chip--selected']}
						onclick={() => toggleType(type)}
						title={typeNames[type]}
						aria-pressed={isSelected}
					>
						<span class="type-chip__number">{typeLabels[type]}</span>
						{#if isSelected}
							<span class="type-chip__check">
								<svg class="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="3"
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</span>
						{/if}
					</button>
				{/each}
			</div>

			<!-- Selected count indicator -->
			<div class="type-count">
				<span class="type-count__number">{selected.length}</span>
				<span class="type-count__text">of {typeOptions.length} types selected</span>
			</div>
		</div>

		<!-- Sort Options -->
		<div class="filter-section">
			<h3 class="filter-section__title">Sort Order</h3>
			<div class="sort-options">
				<button
					type="button"
					class="sort-option"
					class:sort-option--selected={sortBy === 'ranked'}
					aria-pressed={sortBy === 'ranked'}
					onclick={() => (sortBy = 'ranked')}
				>
					<span class="sort-option__icon" aria-hidden="true">↕</span>
					<span class="sort-option__label">{data.commentRankingEnabled ? 'Ranked' : 'Default'}</span
					>
				</button>
				<button
					type="button"
					class="sort-option"
					class:sort-option--selected={sortBy === 'newest'}
					aria-pressed={sortBy === 'newest'}
					onclick={() => (sortBy = 'newest')}
				>
					<span class="sort-option__icon">
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</span>
					<span class="sort-option__label">Newest</span>
				</button>
				<button
					type="button"
					class="sort-option"
					class:sort-option--selected={sortBy === 'oldest'}
					aria-pressed={sortBy === 'oldest'}
					onclick={() => (sortBy = 'oldest')}
				>
					<span class="sort-option__icon">
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</span>
					<span class="sort-option__label">Oldest</span>
				</button>
				<button
					type="button"
					class="sort-option"
					class:sort-option--selected={sortBy === 'likes'}
					aria-pressed={sortBy === 'likes'}
					onclick={() => (sortBy = 'likes')}
				>
					<span class="sort-option__icon">
						<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
							/>
						</svg>
					</span>
					<span class="sort-option__label">Likes</span>
				</button>
			</div>
		</div>

		<!-- Action Buttons -->
		<div class="filter-modal__footer">
			<Button
				type="button"
				variant="secondary"
				size="md"
				fullWidth
				onclick={() => getModal('sorter').close()}
			>
				Cancel
			</Button>
			<Button
				type="button"
				variant="primary"
				size="md"
				fullWidth
				onclick={applyFilters}
				disabled={!data?.flags?.userHasAnswered}
				icon={applyIcon}
			>
				Apply
			</Button>
		</div>

		{#if !data?.flags?.userHasAnswered}
			<p class="filter-modal__hint">Answer the question first to filter comments</p>
		{/if}
	</div>
</Modal>

<style lang="scss">
	/* Thread controls stay quiet: lavender ghost, no mint (Cold Light rations mint). */
	:global(.filter-btn-atom) {
		position: relative;
		border-color: color-mix(in srgb, var(--highlight) 28%, transparent);
		background: transparent;
		color: var(--highlight);
	}

	:global(.filter-btn-atom:hover:not(:disabled):not([aria-disabled='true'])) {
		border-color: var(--highlight);
		background: color-mix(in srgb, var(--highlight) 8%, transparent);
		color: var(--highlight);
	}

	.filter-btn__badge {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 1.375rem;
		height: 1.375rem;
		padding: 0 0.375rem;
		border-radius: 9999px;
		background: var(--highlight);
		color: var(--bg);
		font-size: var(--font-size-xs);
		font-weight: 600;
	}

	.filter-btn__dot {
		position: absolute;
		top: -0.125rem;
		right: -0.125rem;
		width: 0.625rem;
		height: 0.625rem;
		border: 2px solid var(--bg);
		border-radius: 9999px;
		background: var(--highlight);
	}

	.filter-modal {
		width: 100%;
		overflow: hidden;
		border: 1px solid var(--rule);
		border-radius: 16px;
		background: var(--surface);
	}

	.filter-modal__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.125rem 1.25rem;
		border-bottom: 1px solid var(--rule);
	}

	.filter-modal__title-group {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.filter-modal__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 50%;
		background: var(--accent-deep);
		color: var(--highlight);
	}

	.filter-modal__title {
		margin: 0;
		color: var(--text);
		font-size: var(--font-size-lg);
		font-weight: 600;
	}

	.filter-modal__close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.75rem;
		height: 2.75rem;
		border: none;
		border-radius: 10px;
		background: transparent;
		color: var(--text-faint);
		cursor: pointer;
		transition:
			background-color 0.15s ease,
			color 0.15s ease;

		&:hover {
			background: color-mix(in srgb, var(--highlight) 8%, transparent);
			color: var(--text);
		}
	}

	.filter-section {
		padding: 1.25rem;

		& + & {
			padding-top: 0.5rem;
		}
	}

	.filter-section__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.filter-section__title {
		margin: 0 0 0.75rem;
		color: var(--highlight);
		font-size: var(--font-size-xs);
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.filter-section__header .filter-section__title {
		margin: 0;
	}

	.filter-section__actions {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.divider {
		color: var(--text-faint);
	}

	.text-btn {
		min-height: 2.75rem;
		padding: 0 0.625rem;
		border: none;
		border-radius: 10px;
		background: none;
		color: var(--highlight);
		font-size: var(--font-size-sm);
		font-weight: 500;
		cursor: pointer;

		&:hover {
			background: color-mix(in srgb, var(--highlight) 8%, transparent);
		}
	}

	/* Type chips match the take chips: indigo-deep and lavender when on, dashed when off. */
	.type-grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 0.625rem;

		@media (max-width: 420px) {
			grid-template-columns: repeat(4, 1fr);
			gap: 0.5rem;
		}

		@media (max-width: 320px) {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.type-chip {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 1;
		border: 1px dashed color-mix(in srgb, var(--highlight) 30%, transparent);
		border-radius: 50%;
		background: transparent;
		cursor: pointer;
		transition:
			border-color 0.2s ease,
			background-color 0.2s ease;

		&:hover {
			border-color: var(--highlight);
		}

		&:focus-visible {
			outline: 2px solid var(--focus);
			outline-offset: 2px;
		}
	}

	.type-chip--selected {
		border: 1px solid color-mix(in srgb, var(--highlight) 45%, transparent);
		background: var(--accent-deep);

		.type-chip__number {
			color: var(--highlight);
		}
	}

	.type-chip__number {
		color: var(--text-faint);
		font-family: var(--font-voice);
		font-style: italic;
		font-size: var(--font-size-lg);
		transition: color 0.2s ease;
	}

	.type-chip__check {
		position: absolute;
		top: -0.125rem;
		right: -0.125rem;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		background: var(--highlight);
		color: var(--bg);
	}

	.type-count {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		margin-top: 1rem;
		font-size: var(--font-size-sm);
	}

	.type-count__number {
		color: var(--highlight);
		font-weight: 700;
	}

	.type-count__text {
		color: var(--text-faint);
	}

	.sort-options {
		display: flex;
		gap: 0.5rem;

		@media (max-width: 380px) {
			flex-direction: column;
		}
	}

	.sort-option {
		display: flex;
		flex: 1;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 0.875rem 0.625rem;
		border: 1px solid var(--rule);
		border-radius: 12px;
		background: transparent;
		cursor: pointer;
		transition:
			border-color 0.2s ease,
			background-color 0.2s ease;

		@media (max-width: 380px) {
			flex-direction: row;
			justify-content: center;
			padding: 0.75rem 1rem;
		}

		&:hover {
			border-color: color-mix(in srgb, var(--highlight) 40%, transparent);
		}

		&:focus-visible {
			outline: 2px solid var(--focus);
			outline-offset: 2px;
		}
	}

	.sort-option--selected {
		border-color: var(--highlight);
		background: color-mix(in srgb, var(--highlight) 10%, transparent);

		.sort-option__icon,
		.sort-option__label {
			color: var(--highlight);
		}
	}

	.sort-option__icon {
		color: var(--text-faint);
		transition: color 0.2s ease;
	}

	.sort-option__label {
		color: var(--text-muted);
		font-size: var(--font-size-sm);
		font-weight: 500;
		transition: color 0.2s ease;
	}

	.filter-modal__footer {
		display: flex;
		gap: 0.75rem;
		padding: 1rem 1.25rem;
		border-top: 1px solid var(--rule);
	}

	.filter-modal__footer :global(.btn) {
		flex: 1;
		min-width: 0;
	}

	.filter-modal__hint {
		margin: 0;
		padding: 0.875rem 1.25rem;
		border-top: 1px solid var(--rule);
		color: var(--text-muted);
		font-size: var(--font-size-sm);
		text-align: center;
	}

	@media (prefers-reduced-motion: reduce) {
		.filter-modal__close,
		.type-chip,
		.type-chip__number,
		.sort-option,
		.sort-option__icon,
		.sort-option__label {
			transition: none;
		}
	}
</style>
