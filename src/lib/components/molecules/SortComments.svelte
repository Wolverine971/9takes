<!-- src/lib/components/molecules/SortComments.svelte -->
<script lang="ts">
	import { fly, fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { deserialize } from '$app/forms';
	import SlidersIcon from '$lib/components/icons/slidersIcon.svelte';
	import { notifications } from '$lib/components/molecules/notifications';
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import type { Comment as CommentType, QuestionPageData } from '$lib/types/questions';

	interface Props {
		data: QuestionPageData;
		size?: 'large' | 'medium' | 'small';
		oncommentsSorted?: (comments: CommentType[]) => void;
	}

	let { data, size = 'large', oncommentsSorted }: Props = $props();

	// State variables
	let sortLoading = $state(false);

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

	import { TYPE_COLOR_MAP } from '$lib/constants/enneagramColors';

	const typeColors: Record<string, string> = {
		...Object.fromEntries(Object.entries(TYPE_COLOR_MAP).map(([k, v]) => [String(k), v])),
		unknown: '#6B7280',
		rando: '#94A3B8'
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
	let selected = $state<EnneagramTypeOption[]>([...typeOptions]);
	let sortBy = $state<SortOrder>('newest');

	// Derived state for filter status
	let hasActiveFilters = $derived(selected.length !== typeOptions.length || sortBy !== 'newest');

	// Apply sorting and filtering
	const applyFilters = async () => {
		if (!canSort()) return;

		sortLoading = true;

		try {
			const body = new FormData();
			body.append('enneagramTypes', selected.join(','));
			body.append('questionId', data.question.id.toString());
			body.append('sortBy', sortBy);

			const resp = await fetch('?/sortComments', {
				method: 'POST',
				body
			});

			const result: any = deserialize(await resp.text());

			if (result.error) {
				console.error('Error applying filters:', result.error);
				notifications.danger('Error applying filters', 3000);
			} else if (result.data) {
				oncommentsSorted?.(result?.data);
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
	function toggleType(type: EnneagramTypeOption) {
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
		onclick={() => getModal('sorter').open()}
		in:fade={{ duration: 200 }}
		aria-label="Filter and sort comments"
		title="Filter and sort comments"
	>
		<span class="filter-btn__icon">
			<SlidersIcon className="h-4 w-4" />
		</span>
		<span class="filter-btn__text">Filter</span>
		{#if hasActiveFilters}
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
		onclick={() => getModal('sorter').open()}
		aria-label="Filter and sort comments"
		title="Filter and sort comments"
	>
		<SlidersIcon className="h-4 w-4" />
		<span class="filter-btn__label">Filter</span>
		{#if hasActiveFilters}
			<span class="filter-btn__dot" in:scale={{ duration: 150, easing: cubicOut }}></span>
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
				{#each typeOptions as type}
					{@const isSelected = selected.includes(type)}
					<button
						type="button"
						class="type-chip"
						class:type-chip--selected={isSelected}
						style="--type-color: {typeColors[type]}"
						onclick={() => toggleType(type)}
						title={typeNames[type]}
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
					class:sort-option--selected={sortBy === 'newest'}
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
					<span class="sort-option__label">Most Liked</span>
				</button>
			</div>
		</div>

		<!-- Action Buttons -->
		<div class="filter-modal__footer">
			<button
				type="button"
				class="action-btn action-btn--secondary"
				onclick={() => getModal('sorter').close()}
			>
				Cancel
			</button>
			<button
				type="button"
				class="action-btn action-btn--primary"
				onclick={applyFilters}
				disabled={sortLoading || !data?.flags?.userHasAnswered}
			>
				{#if sortLoading}
					<span class="action-btn__spinner"></span>
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
	/* Filter Button Styles - Dark Purple Theme */
	.filter-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		border: 1px solid var(--primary-subtle);
		background: var(--primary-subtle);
		border-radius: 0.625rem;
		font-weight: 500;
		transition: all 0.2s ease;
		position: relative;
		color: var(--primary-lightest);

		&:hover {
			background: var(--primary-subtle);
			border-color: var(--primary-glow);
			box-shadow: 0 0 20px var(--primary-subtle);
		}

		&:focus-visible {
			outline: 2px solid var(--accent-light);
			outline-offset: 2px;
		}
	}

	.filter-btn--large {
		padding: 0.625rem 1.125rem;
		font-size: 0.875rem;
	}

	.filter-btn--compact {
		padding: 0.5rem 0.875rem;
		font-size: 0.8125rem;
		gap: 0.375rem;
	}

	.filter-btn__icon {
		display: flex;
		color: var(--accent-light);
	}

	.filter-btn__text,
	.filter-btn__label {
		color: var(--primary-lightest);
		font-weight: 500;
	}

	.filter-btn__badge {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 1.375rem;
		height: 1.375rem;
		padding: 0 0.375rem;
		background: linear-gradient(135deg, var(--accent-light), var(--primary-dark));
		color: white;
		font-size: 0.75rem;
		font-weight: 600;
		border-radius: 9999px;
		box-shadow: 0 2px 8px var(--primary-glow);
	}

	.filter-btn__dot {
		position: absolute;
		top: -0.125rem;
		right: -0.125rem;
		width: 0.625rem;
		height: 0.625rem;
		background: linear-gradient(135deg, var(--accent-light), var(--primary-dark));
		border-radius: 9999px;
		border: 2px solid var(--bg-surface);
		box-shadow: 0 0 8px var(--primary-glow);
	}

	/* Modal Styles - Dark Purple Theme */
	.filter-modal {
		width: 100%;
		min-width: min(360px, 90vw);
		max-width: 420px;
		background: var(--bg-deep);
		border-radius: 1rem;
		border: 1px solid var(--primary-subtle);
		box-shadow:
			0 25px 50px -12px rgba(0, 0, 0, 0.5),
			0 0 40px var(--primary-subtle);
		overflow: hidden;
	}

	.filter-modal__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.125rem 1.25rem;
		border-bottom: 1px solid var(--primary-subtle);
		background: linear-gradient(to bottom, var(--bg-surface), var(--bg-deep));
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
		background: linear-gradient(135deg, var(--primary-dark), var(--accent-dark));
		color: white;
		border-radius: 0.625rem;
		box-shadow: 0 4px 12px rgba(45, 212, 191, 0.4);
	}

	.filter-modal__title {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary);
		letter-spacing: -0.01em;
	}

	.filter-modal__close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		background: transparent;
		border: none;
		border-radius: 0.5rem;
		color: var(--text-tertiary);
		cursor: pointer;
		transition: all 0.15s ease;

		&:hover {
			background: var(--primary-subtle);
			color: var(--accent-light);
		}
	}

	/* Filter Sections */
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
		margin: 0;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--accent-light);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.filter-section__actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.divider {
		color: var(--text-muted);
	}

	.text-btn {
		background: none;
		border: none;
		padding: 0.25rem 0.625rem;
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--primary-lightest);
		cursor: pointer;
		border-radius: 0.375rem;
		transition: all 0.15s ease;

		&:hover {
			background: var(--primary-subtle);
			color: var(--primary-lightest);
		}
	}

	/* Type Grid */
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
		background: var(--bg-surface);
		border: 2px solid var(--bg-highlight);
		border-radius: 0.75rem;
		cursor: pointer;
		transition: all 0.2s ease;

		&:hover {
			border-color: var(--type-color);
			background: color-mix(in srgb, var(--type-color) 12%, var(--bg-surface));
			transform: scale(1.05);
		}

		&:focus-visible {
			outline: 2px solid var(--type-color);
			outline-offset: 2px;
		}
	}

	.type-chip--selected {
		background: var(--type-color);
		border-color: var(--type-color);
		box-shadow:
			0 4px 12px color-mix(in srgb, var(--type-color) 50%, transparent),
			inset 0 1px 0 rgba(255, 255, 255, 0.2);

		.type-chip__number {
			color: white;
			text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
		}
	}

	.type-chip__number {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--text-secondary);
		transition: color 0.2s ease;
	}

	.type-chip__check {
		position: absolute;
		top: 0.125rem;
		right: 0.125rem;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1rem;
		height: 1rem;
		background: rgba(255, 255, 255, 0.25);
		border-radius: 50%;
		color: white;
	}

	/* Type Count */
	.type-count {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		margin-top: 1rem;
		font-size: 0.8125rem;
	}

	.type-count__number {
		font-weight: 700;
		color: var(--accent-light);
	}

	.type-count__text {
		color: var(--text-tertiary);
	}

	/* Sort Options */
	.sort-options {
		display: flex;
		gap: 0.625rem;

		@media (max-width: 380px) {
			flex-direction: column;
		}
	}

	.sort-option {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 0.875rem 0.625rem;
		background: var(--bg-surface);
		border: 2px solid var(--bg-highlight);
		border-radius: 0.75rem;
		cursor: pointer;
		transition: all 0.2s ease;

		@media (max-width: 380px) {
			flex-direction: row;
			justify-content: center;
			padding: 0.75rem 1rem;
		}

		&:hover {
			border-color: var(--primary-glow);
			background: var(--primary-subtle);
		}

		&:focus-visible {
			outline: 2px solid var(--accent-light);
			outline-offset: 2px;
		}
	}

	.sort-option--selected {
		background: linear-gradient(135deg, rgba(45, 212, 191, 0.25), var(--accent-subtle));
		border-color: var(--primary-dark);
		box-shadow:
			0 0 20px rgba(45, 212, 191, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.05);

		.sort-option__icon {
			color: var(--accent-light);
		}

		.sort-option__label {
			color: var(--primary-lightest);
		}
	}

	.sort-option__icon {
		color: var(--text-tertiary);
		transition: color 0.2s ease;
	}

	.sort-option__label {
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--text-secondary);
		transition: color 0.2s ease;
	}

	/* Footer */
	.filter-modal__footer {
		display: flex;
		gap: 0.75rem;
		padding: 1rem 1.25rem;
		border-top: 1px solid var(--primary-subtle);
		background: var(--bg-deep);
	}

	.action-btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.875rem 1rem;
		font-size: 0.875rem;
		font-weight: 600;
		border-radius: 0.625rem;
		cursor: pointer;
		transition: all 0.2s ease;

		&:disabled {
			opacity: 0.4;
			cursor: not-allowed;
		}
	}

	.action-btn--secondary {
		background: transparent;
		border: 1px solid var(--bg-elevated);
		color: var(--text-secondary);

		&:hover:not(:disabled) {
			background: var(--primary-subtle);
			border-color: var(--primary-subtle);
			color: var(--primary-lightest);
		}
	}

	.action-btn--primary {
		background: linear-gradient(135deg, var(--primary-dark), var(--accent-dark));
		border: none;
		color: white;
		box-shadow:
			0 4px 14px rgba(45, 212, 191, 0.4),
			inset 0 1px 0 rgba(255, 255, 255, 0.15);

		&:hover:not(:disabled) {
			transform: translateY(-2px);
			box-shadow:
				0 6px 20px rgba(45, 212, 191, 0.5),
				inset 0 1px 0 rgba(255, 255, 255, 0.15);
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
		padding: 0.875rem 1.25rem;
		background: rgba(251, 191, 36, 0.1);
		border-top: 1px solid rgba(251, 191, 36, 0.2);
		color: var(--warning);
		font-size: 0.8125rem;
		text-align: center;
	}
</style>
