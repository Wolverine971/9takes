<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { deserialize } from '$app/forms';
	import SlidersIcon from '$lib/components/icons/slidersIcon.svelte';
	import { notifications } from '$lib/components/molecules/notifications';
	import { createEventDispatcher } from 'svelte';
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';

	const dispatch = createEventDispatcher();

	// Component props
	export let data: any;
	export let size: string = 'large';

	// State variables
	let sortLoading: boolean = false;
	let innerWidth: number = 0;
	let selected: string[] = [`1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `unknown`, `rando`];
	const typeOptions = [`1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `unknown`, `rando`];
	let sortBy: string = 'newest';

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

<svelte:window bind:innerWidth />

<!-- Filter Button - Different sizes for different viewport widths -->
{#if size === 'large'}
	<button
		type="button"
		class="filter-button"
		on:click={() => getModal('sorter').open()}
		in:fade={{ duration: 200 }}
		aria-label="Filter and sort comments"
		title="Filter and sort comments"
	>
		<SlidersIcon className="filter-icon" />
		<span class="filter-text">Filter Comments</span>
		{#if selected.length !== typeOptions.length}
			<span class="filter-badge">{selected.length}</span>
		{/if}
	</button>
{:else}
	<button
		type="button"
		class="filter-button-small"
		on:click={() => getModal('sorter').open()}
		aria-label="Filter and sort comments"
		title="Filter and sort comments"
	>
		<SlidersIcon className="filter-icon-small" />
	</button>
{/if}

<!-- Filter Modal -->
<Modal2 id="sorter">
	<div class="filter-modal" in:fly={{ y: -20, duration: 300 }}>
		<h2 class="modal-title">Filter & Sort Comments</h2>

		<!-- Personality Type Filters -->
		<div class="filter-section">
			<h3 class="filter-heading">Personality Type</h3>
			<div class="type-selection">
				<div class="quick-select">
					<button class="quick-select-btn" on:click={selectAll} type="button"> Select All </button>
					<button class="quick-select-btn" on:click={clearAll} type="button"> Clear All </button>
				</div>

				<div class="type-grid">
					{#each typeOptions as type}
						<label class="type-chip" class:selected={selected.includes(type)}>
							<input
								type="checkbox"
								value={type}
								checked={selected.includes(type)}
								on:change={() => toggleType(type)}
								class="visually-hidden"
							/>
							<span class="chip-text">Type {type}</span>
						</label>
					{/each}
				</div>
			</div>
		</div>

		<!-- Sort Options -->
		<div class="filter-section">
			<h3 class="filter-heading">Sort Order</h3>
			<div class="sort-options">
				<label class="sort-option" class:selected={sortBy === 'newest'}>
					<input type="radio" bind:group={sortBy} value="newest" class="visually-hidden" />
					<span>Newest First</span>
				</label>
				<label class="sort-option" class:selected={sortBy === 'oldest'}>
					<input type="radio" bind:group={sortBy} value="oldest" class="visually-hidden" />
					<span>Oldest First</span>
				</label>
				<label class="sort-option" class:selected={sortBy === 'likes'}>
					<input type="radio" bind:group={sortBy} value="likes" class="visually-hidden" />
					<span>Most Liked</span>
				</label>
			</div>
		</div>

		<!-- Action Buttons -->
		<div class="filter-actions">
			<button class="cancel-btn" on:click={() => getModal('sorter').close()} type="button">
				Cancel
			</button>
			<button
				class="apply-btn"
				class:disabled={!data?.flags?.userHasAnswered}
				on:click={applyFilters}
				disabled={sortLoading || !data?.flags?.userHasAnswered}
				type="button"
			>
				{#if sortLoading}
					<div class="loader" />
				{:else}
					Apply Filters
				{/if}
			</button>
		</div>
	</div>
</Modal2>

<style lang="scss">
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	/* Hide inputs visually but keep them accessible */
	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}

	/* Filter button styles */
	.filter-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		background: white;
		border: 1px solid var(--light-gray);
		border-radius: var(--base-border-radius);
		cursor: pointer;
		transition: all 0.2s ease;
		font-weight: 500;

		&:hover {
			background: var(--light-gray);
			transform: translateY(-1px);
			box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
		}

		.filter-icon {
			color: var(--accent);
			height: 1.25rem;
			width: 1.25rem;
		}

		.filter-text {
			font-size: 0.95rem;
			white-space: nowrap;
		}

		.filter-badge {
			display: flex;
			align-items: center;
			justify-content: center;
			min-width: 20px;
			height: 20px;
			padding: 0 6px;
			background: var(--accent);
			color: white;
			border-radius: 10px;
			font-size: 0.75rem;
			font-weight: 600;
		}
	}

	.filter-button-small {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		background: white;
		border: 1px solid var(--light-gray);
		border-radius: var(--base-border-radius);
		cursor: pointer;
		transition: all 0.2s ease;

		&:hover {
			background: var(--light-gray);
			transform: translateY(-1px);
		}

		.filter-icon-small {
			color: var(--accent);
			height: 1.25rem;
			width: 1.25rem;
		}
	}

	/* Filter modal styles */
	.filter-modal {
		padding: 1.5rem;
		min-width: 320px;
		max-width: 600px;
		width: 100%;
		background: white;
		border-radius: var(--base-border-radius);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

		@media (max-width: 576px) {
			padding: 1rem;
			min-width: 280px;
		}
	}

	.modal-title {
		margin-top: 0;
		margin-bottom: 1.5rem;
		font-size: 1.4rem;
		font-weight: 600;
		color: var(--darkest-gray);
		text-align: center;
		position: relative;

		&::after {
			content: '';
			position: absolute;
			bottom: -8px;
			left: 50%;
			transform: translateX(-50%);
			width: 60px;
			height: 2px;
			background: var(--accent);
		}
	}

	.filter-section {
		margin-bottom: 1.5rem;

		.filter-heading {
			margin-bottom: 1rem;
			font-size: 1.1rem;
			font-weight: 600;
			color: var(--darkest-gray);
		}
	}

	.quick-select {
		display: flex;
		gap: 0.75rem;
		margin-bottom: 1rem;

		@media (max-width: 576px) {
			flex-direction: column;
			gap: 0.5rem;
		}

		.quick-select-btn {
			padding: 0.5rem 1rem;
			border: 1px solid var(--light-gray);
			border-radius: var(--base-border-radius);
			background: transparent;
			cursor: pointer;
			transition: all 0.2s ease;
			font-size: 0.9rem;

			&:hover {
				background: var(--light-gray);
			}
		}
	}

	.type-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: 0.5rem;

		@media (max-width: 576px) {
			grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
		}

		.type-chip {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0.5rem;
			border: 1px solid var(--light-gray);
			border-radius: var(--base-border-radius);
			cursor: pointer;
			transition: all 0.2s ease;
			font-size: 0.9rem;
			text-align: center;

			&:hover {
				background: var(--light-gray);
			}

			&.selected {
				background: var(--accent);
				border-color: var(--accent);
				color: white;
			}

			.chip-text {
				font-weight: 500;
			}
		}
	}

	.sort-options {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		.sort-option {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0.75rem;
			border: 1px solid var(--light-gray);
			border-radius: var(--base-border-radius);
			cursor: pointer;
			transition: all 0.2s ease;
			font-size: 0.9rem;
			font-weight: 500;

			&:hover {
				background: var(--light-gray);
			}

			&.selected {
				background: var(--accent);
				border-color: var(--accent);
				color: white;
			}
		}
	}

	.filter-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
		margin-top: 1.5rem;

		@media (max-width: 576px) {
			flex-direction: column;
		}
	}

	.cancel-btn,
	.apply-btn {
		padding: 0.75rem 1.5rem;
		border-radius: var(--base-border-radius);
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		font-size: 0.95rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.cancel-btn {
		background: transparent;
		border: 1px solid var(--medium-gray);
		color: var(--dark-gray);

		&:hover {
			background: var(--light-gray);
			color: var(--darkest-gray);
		}
	}

	.apply-btn {
		background: var(--accent);
		color: white;
		border: none;

		&:hover:not(:disabled) {
			background: var(--accent-dark);
			transform: translateY(-2px);
		}

		&:disabled,
		&.disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}

	.loader {
		width: 1.25rem;
		height: 1.25rem;
		border: 3px solid rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		border-top: 3px solid white;
		animation: spin 0.8s linear infinite;
	}
</style>
