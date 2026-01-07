<!-- src/lib/components/molecules/SortComments.svelte -->
<script lang="ts">
	import { fly, fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { deserialize } from '$app/forms';
	import SlidersIcon from '$lib/components/icons/slidersIcon.svelte';
	import { notifications } from '$lib/components/molecules/notifications';
	import { createEventDispatcher } from 'svelte';
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import type { Comment as CommentType, QuestionPageData } from '$lib/types/questions';

	const dispatch = createEventDispatcher<{
		commentsSorted: CommentType[];
	}>();

	// Component props
	export let data: QuestionPageData;
	export let size: 'large' | 'medium' | 'small' = 'large';

	import { viewportWidth } from '$lib/stores/viewport';

	// State variables
	let sortLoading: boolean = false;

	// Use shared viewport store
	$: innerWidth = $viewportWidth;

	type EnneagramTypeOption =
		| '1'
		| '2'
		| '3'
		| '4'
		| '5'
		| '6'
		| '7'
		| '8'
		| '9'
		| 'unknown'
		| 'rando';
	type SortOrder = 'newest' | 'oldest' | 'likes';

	// Enneagram type colors from the design system
	const typeColors: Record<string, string> = {
		'1': '#A9A9A9', // Reformer - Gray
		'2': '#E63946', // Helper - Red
		'3': '#FFD700', // Achiever - Gold
		'4': '#9D4EDD', // Individualist - Purple
		'5': '#457B9D', // Investigator - Blue
		'6': '#B59410', // Loyalist - Olive
		'7': '#76C893', // Enthusiast - Green
		'8': '#1A535C', // Challenger - Teal
		'9': '#F8961E', // Peacemaker - Orange
		unknown: '#6B7280', // Unknown - Neutral gray
		rando: '#94A3B8' // Random - Slate
	};

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
	let selected: EnneagramTypeOption[] = [...typeOptions];
	let sortBy: SortOrder = 'newest';

	// Apply sorting and filtering
	const applyFilters = async () => {
		if (!canSort()) return;

		sortLoading = true;

		try {
			const body = new FormData();
			body.append('enneagramTypes', selected.join(','));
			body.append('questionId', data.id);
			body.append('sortBy', sortBy);

			const resp = await fetch('/questions?/sortComments', {
				method: 'POST',
				body
			});

			const result: any = deserialize(await resp.text());

			if (result.error) {
				console.error('Error applying filters:', result.error);
				notifications.danger('Error applying filters', 3000);
			} else if (result.data) {
				dispatch('commentsSorted', result?.data);
				getModal('sorter').close();
				notifications.info('Comments filtered and sorted', 2000);
			}
		} catch (error) {
			console.error('Error sorting comments:', error);
			notifications.danger('Failed to sort comments', 3000);
		} finally {
			sortLoading = false;
		}
	};

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
	function toggleType(type: string) {
		if (selected.includes(type)) {
			selected = selected.filter((t) => t !== type);
		} else {
			selected = [...selected, type];
		}
	}
</script>

<!-- Filter Button -->
{#if size === 'large'}
	<button
		type="button"
		class="filter-btn filter-btn--large group"
		on:click={() => getModal('sorter').open()}
		in:fade={{ duration: 200 }}
		aria-label="Filter and sort comments"
		title="Filter and sort comments"
	>
		<span class="filter-btn__icon">
			<SlidersIcon className="h-4 w-4" />
		</span>
		<span class="filter-btn__text">Filter</span>
		{#if selected.length !== typeOptions.length || sortBy !== 'newest'}
			<span class="filter-btn__badge" in:scale={{ duration: 150, easing: cubicOut }}>
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
		{/if}
	</button>
{:else}
	<button
		type="button"
		class="filter-btn filter-btn--compact"
		on:click={() => getModal('sorter').open()}
		aria-label="Filter and sort comments"
		title="Filter and sort comments"
	>
		<SlidersIcon className="h-4 w-4" />
		{#if selected.length !== typeOptions.length || sortBy !== 'newest'}
			<span class="filter-btn__dot" in:scale={{ duration: 150, easing: cubicOut }} />
		{/if}
	</button>
{/if}

<!-- Filter Modal -->
<Modal2 id="sorter">
	<div class="filter-modal" in:fly={{ y: -20, duration: 300, easing: cubicOut }}>
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
				on:click={() => getModal('sorter').close()}
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
					<button type="button" class="text-btn" on:click={selectAll}>All</button>
					<span class="text-neutral-300">|</span>
					<button type="button" class="text-btn" on:click={clearAll}>None</button>
				</div>
			</div>

			<div class="type-grid">
				{#each typeOptions as type}
					{@const isSelected = selected.includes(type)}
					<button
						type="button"
						class="type-chip"
						class:type-chip--selected={isSelected}
						style="--type-color: {typeColors[type]}"
						on:click={() => toggleType(type)}
						title={typeNames[type]}
					>
						<span class="type-chip__number">{typeLabels[type]}</span>
						{#if isSelected}
							<span class="type-chip__indicator" in:scale={{ duration: 150, easing: cubicOut }} />
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
					class:sort-option--selected={sortBy === 'newest'}
					on:click={() => (sortBy = 'newest')}
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
					on:click={() => (sortBy = 'oldest')}
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
					on:click={() => (sortBy = 'likes')}
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
					<span class="sort-option__label">Most Liked</span>
				</button>
			</div>
		</div>

		<!-- Action Buttons -->
		<div class="filter-modal__footer">
			<button
				type="button"
				class="action-btn action-btn--secondary"
				on:click={() => getModal('sorter').close()}
			>
				Cancel
			</button>
			<button
				type="button"
				class="action-btn action-btn--primary"
				on:click={applyFilters}
				disabled={sortLoading || !data?.flags?.userHasAnswered}
			>
				{#if sortLoading}
					<span class="action-btn__spinner" />
				{:else}
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 13l4 4L19 7"
						/>
					</svg>
				{/if}
				<span>Apply</span>
			</button>
		</div>

		{#if !data?.flags?.userHasAnswered}
			<p class="filter-modal__hint">Answer the question first to filter comments</p>
		{/if}
	</div>
</Modal2>

<style lang="scss">
	/* Filter Button Styles */
	.filter-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		border: 1px solid #e5e7eb;
		background: white;
		border-radius: 0.5rem;
		font-weight: 500;
		transition: all 0.2s ease;
		position: relative;

		&:hover {
			border-color: #d1d5db;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
		}

		&:focus-visible {
			outline: 2px solid var(--primary-500, #6366f1);
			outline-offset: 2px;
		}
	}

	.filter-btn--large {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
	}

	.filter-btn--compact {
		padding: 0.5rem;
		position: relative;
	}

	.filter-btn__icon {
		display: flex;
		color: var(--primary-500, #6366f1);
	}

	.filter-btn__text {
		color: #374151;
	}

	.filter-btn__badge {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 1.25rem;
		height: 1.25rem;
		padding: 0 0.375rem;
		background: var(--primary-500, #6366f1);
		color: white;
		font-size: 0.75rem;
		font-weight: 600;
		border-radius: 9999px;
	}

	.filter-btn__dot {
		position: absolute;
		top: 0.25rem;
		right: 0.25rem;
		width: 0.5rem;
		height: 0.5rem;
		background: var(--primary-500, #6366f1);
		border-radius: 9999px;
		border: 2px solid white;
	}

	/* Modal Styles */
	.filter-modal {
		width: 100%;
		min-width: min(360px, 90vw);
		max-width: 420px;
		background: white;
		border-radius: 1rem;
		box-shadow:
			0 20px 25px -5px rgba(0, 0, 0, 0.1),
			0 8px 10px -6px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	.filter-modal__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.25rem;
		border-bottom: 1px solid #f3f4f6;
		background: linear-gradient(to bottom, #fafafa, white);
	}

	.filter-modal__title-group {
		display: flex;
		align-items: center;
		gap: 0.625rem;
	}

	.filter-modal__icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		background: linear-gradient(135deg, var(--primary-500, #6366f1), var(--primary-600, #4f46e5));
		color: white;
		border-radius: 0.5rem;
	}

	.filter-modal__title {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: #111827;
	}

	.filter-modal__close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		background: transparent;
		border: none;
		border-radius: 0.5rem;
		color: #9ca3af;
		cursor: pointer;
		transition: all 0.15s ease;

		&:hover {
			background: #f3f4f6;
			color: #6b7280;
		}
	}

	/* Filter Sections */
	.filter-section {
		padding: 1.25rem;

		& + & {
			padding-top: 0;
		}
	}

	.filter-section__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.875rem;
	}

	.filter-section__title {
		margin: 0;
		font-size: 0.8125rem;
		font-weight: 600;
		color: #6b7280;
		text-transform: uppercase;
		letter-spacing: 0.025em;
	}

	.filter-section__actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.text-btn {
		background: none;
		border: none;
		padding: 0.25rem 0.5rem;
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--primary-500, #6366f1);
		cursor: pointer;
		border-radius: 0.25rem;
		transition: background 0.15s ease;

		&:hover {
			background: #f3f4f6;
		}
	}

	/* Type Grid */
	.type-grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 0.5rem;

		@media (max-width: 400px) {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	.type-chip {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 1;
		background: #f9fafb;
		border: 2px solid #e5e7eb;
		border-radius: 0.625rem;
		cursor: pointer;
		transition: all 0.2s ease;

		&:hover {
			border-color: var(--type-color);
			background: color-mix(in srgb, var(--type-color) 8%, white);
		}

		&:focus-visible {
			outline: 2px solid var(--type-color);
			outline-offset: 2px;
		}
	}

	.type-chip--selected {
		background: var(--type-color);
		border-color: var(--type-color);
		box-shadow: 0 2px 8px color-mix(in srgb, var(--type-color) 40%, transparent);

		.type-chip__number {
			color: white;
			text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
		}
	}

	.type-chip__number {
		font-size: 1rem;
		font-weight: 700;
		color: #374151;
		transition: color 0.2s ease;
	}

	.type-chip__indicator {
		position: absolute;
		inset: 0;
		border-radius: 0.5rem;
		border: 2px solid white;
		opacity: 0.5;
		pointer-events: none;
	}

	/* Type Count */
	.type-count {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		margin-top: 0.75rem;
		font-size: 0.8125rem;
	}

	.type-count__number {
		font-weight: 600;
		color: var(--primary-500, #6366f1);
	}

	.type-count__text {
		color: #9ca3af;
	}

	/* Sort Options */
	.sort-options {
		display: flex;
		gap: 0.5rem;
	}

	.sort-option {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.375rem;
		padding: 0.75rem 0.5rem;
		background: #f9fafb;
		border: 2px solid #e5e7eb;
		border-radius: 0.625rem;
		cursor: pointer;
		transition: all 0.2s ease;

		&:hover {
			border-color: #d1d5db;
			background: #f3f4f6;
		}

		&:focus-visible {
			outline: 2px solid var(--primary-500, #6366f1);
			outline-offset: 2px;
		}
	}

	.sort-option--selected {
		background: linear-gradient(135deg, var(--primary-500, #6366f1), var(--primary-600, #4f46e5));
		border-color: var(--primary-500, #6366f1);
		box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);

		.sort-option__icon,
		.sort-option__label {
			color: white;
		}
	}

	.sort-option__icon {
		color: #9ca3af;
		transition: color 0.2s ease;
	}

	.sort-option__label {
		font-size: 0.8125rem;
		font-weight: 500;
		color: #374151;
		transition: color 0.2s ease;
	}

	/* Footer */
	.filter-modal__footer {
		display: flex;
		gap: 0.75rem;
		padding: 1rem 1.25rem;
		border-top: 1px solid #f3f4f6;
		background: #fafafa;
	}

	.action-btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		font-size: 0.875rem;
		font-weight: 600;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s ease;

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}

	.action-btn--secondary {
		background: white;
		border: 1px solid #d1d5db;
		color: #4b5563;

		&:hover:not(:disabled) {
			background: #f9fafb;
			border-color: #9ca3af;
		}
	}

	.action-btn--primary {
		background: linear-gradient(135deg, var(--primary-500, #6366f1), var(--primary-600, #4f46e5));
		border: none;
		color: white;
		box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);

		&:hover:not(:disabled) {
			transform: translateY(-1px);
			box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
		}

		&:active:not(:disabled) {
			transform: translateY(0);
		}
	}

	.action-btn__spinner {
		width: 1rem;
		height: 1rem;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top-color: white;
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Hint */
	.filter-modal__hint {
		margin: 0;
		padding: 0.75rem 1.25rem;
		background: #fef3c7;
		color: #92400e;
		font-size: 0.8125rem;
		text-align: center;
	}

	/* Dark mode support */
	:global(.dark) {
		.filter-btn {
			background: #1f2937;
			border-color: #374151;
			color: #e5e7eb;

			&:hover {
				border-color: #4b5563;
			}
		}

		.filter-btn__text {
			color: #e5e7eb;
		}

		.filter-btn__dot {
			border-color: #1f2937;
		}

		.filter-modal {
			background: #1f2937;
		}

		.filter-modal__header {
			border-color: #374151;
			background: linear-gradient(to bottom, #111827, #1f2937);
		}

		.filter-modal__title {
			color: #f3f4f6;
		}

		.filter-modal__close {
			color: #6b7280;

			&:hover {
				background: #374151;
				color: #9ca3af;
			}
		}

		.filter-section__title {
			color: #9ca3af;
		}

		.type-chip {
			background: #374151;
			border-color: #4b5563;

			&:hover {
				background: color-mix(in srgb, var(--type-color) 15%, #374151);
			}
		}

		.type-chip__number {
			color: #e5e7eb;
		}

		.type-count__text {
			color: #6b7280;
		}

		.sort-option {
			background: #374151;
			border-color: #4b5563;

			&:hover {
				background: #4b5563;
			}
		}

		.sort-option__label {
			color: #e5e7eb;
		}

		.filter-modal__footer {
			border-color: #374151;
			background: #111827;
		}

		.action-btn--secondary {
			background: #374151;
			border-color: #4b5563;
			color: #e5e7eb;

			&:hover:not(:disabled) {
				background: #4b5563;
			}
		}

		.filter-modal__hint {
			background: #78350f;
			color: #fef3c7;
		}
	}
</style>
