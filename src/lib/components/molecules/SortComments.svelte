<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { deserialize } from '$app/forms';
	// import FilterListIcon from '$lib/components/icons/filterListIcon.svelte';
	import SlidersIcon from '$lib/components/icons/slidersIcon.svelte';

	import { notifications } from '$lib/components/molecules/notifications';

	import { createEventDispatcher } from 'svelte';
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	const dispatch = createEventDispatcher();

	export let data: any;
	export let size: string = 'large';
	let sortLoading: boolean = false;

	$: data, watchData();

	const watchData = () => {};

	const sort = async () => {
		sortLoading = true;
		if (!data?.flags?.userHasAnswered) {
			notifications.info('Must answer question to sort comments', 3000);
			return;
		}
		let body = new FormData();
		body.append('enneagramTypes', selected.join(','));
		body.append('questionId', data.id);
		body.append('sortBy', sortBy);

		const resp = await fetch('/questions?/sortComments', {
			method: 'POST',
			body
		});

		const result: any = deserialize(await resp.text());

		if (result.error) {
			console.log(result.error);
		} else if (result.data) {
			dispatch('commentsSorted', result?.data);
			getModal('sorter').close();
		}
		sortLoading = false;
	};

	let innerWidth: number = 0;
	let selected: string[] = [`1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `unknown`, `rando`];
	const typeOptions = [`1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `unknown`, `rando`];

	let sortBy: string = 'newest';
	let multiSelectOpen: boolean = false;
</script>

{#if size === 'large'}
	<button
		type="button"
		class="filter-button"
		on:click={() => getModal('sorter').open()}
		transition:fade
	>
		<SlidersIcon className="filter-icon" />
		<span class="filter-text">Filter Comments</span>
		{#if selected.length !== typeOptions.length}
			<span class="filter-badge">{selected.length}</span>
		{/if}
	</button>
{:else}
	<button type="button" class="filter-button-small" on:click={() => getModal('sorter').open()}>
		<SlidersIcon className="filter-icon-small" />
	</button>
{/if}

<Modal2 id="sorter">
	<div class="filter-modal" transition:fly={{ y: -20 }}>
		<div class="filter-section">
			<h3 class="filter-heading">Personality Type</h3>
			<div class="type-selection">
				<div class="quick-select">
					<button class="quick-select-btn" on:click={() => (selected = typeOptions)}>
						Select All
					</button>
					<button class="quick-select-btn" on:click={() => (selected = [])}> Clear All </button>
				</div>
				<div class="type-grid">
					{#each typeOptions as type}
						<label class="type-chip">
							<input
								type="checkbox"
								value={type}
								checked={selected.includes(type)}
								on:change={(e) => {
									if (e.target.checked) {
										selected = [...selected, type];
									} else {
										selected = selected.filter((t) => t !== type);
									}
								}}
							/>
							<span class="chip-text">Type {type}</span>
						</label>
					{/each}
				</div>
			</div>
		</div>

		<div class="filter-section">
			<h3 class="filter-heading">Sort Order</h3>
			<div class="sort-options">
				<label class="sort-option">
					<input type="radio" bind:group={sortBy} value="newest" />
					<span>Newest First</span>
				</label>
				<label class="sort-option">
					<input type="radio" bind:group={sortBy} value="oldest" />
					<span>Oldest First</span>
				</label>
				<label class="sort-option">
					<input type="radio" bind:group={sortBy} value="likes" />
					<span>Most Liked</span>
				</label>
			</div>
		</div>

		<div class="filter-actions">
			<button class="apply-btn" class:disabled={!data?.flags?.userHasAnswered} on:click={sort}>
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
	.filter-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		background: white;
		border: 1px solid var(--base-grey-1);
		border-radius: var(--base-border-radius);
		cursor: pointer;
		transition: all 0.2s ease;

		&:hover {
			background: var(--base-grey-1);
			transform: translateY(-1px);
		}

		.filter-icon {
			color: var(--accent);
		}

		.filter-text {
			font-weight: 500;
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
			font-weight: bold;
		}
	}

	.filter-modal {
		padding: 1.5rem;
		min-width: 320px;
		max-width: 600px;
		background: white;
		border-radius: var(--base-border-radius);

		.filter-section {
			margin-bottom: 1.5rem;

			.filter-heading {
				margin-bottom: 1rem;
				font-size: 1.1rem;
				font-weight: 600;
				color: var(--color-paladin-4);
			}
		}

		.quick-select {
			display: flex;
			gap: 0.5rem;
			margin-bottom: 1rem;

			.quick-select-btn {
				padding: 0.5rem 1rem;
				border: 1px solid var(--base-grey-1);
				border-radius: var(--base-border-radius);
				background: transparent;
				cursor: pointer;
				transition: all 0.2s ease;

				&:hover {
					background: var(--base-grey-1);
				}
			}
		}

		.type-grid {
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
			gap: 0.5rem;

			.type-chip {
				display: flex;
				align-items: center;
				gap: 0.5rem;
				padding: 0.5rem;
				border: 1px solid var(--base-grey-1);
				border-radius: var(--base-border-radius);
				cursor: pointer;
				transition: all 0.2s ease;

				input[type='checkbox'] {
					display: none;
				}

				&:hover {
					background: var(--base-grey-1);
				}

				&:has(input:checked) {
					background: var(--accent);
					border-color: var(--accent);
					color: white;
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
				gap: 0.5rem;
				padding: 0.5rem;
				border: 1px solid var(--base-grey-1);
				border-radius: var(--base-border-radius);
				cursor: pointer;
				transition: all 0.2s ease;

				&:hover {
					background: var(--base-grey-1);
				}

				&:has(input:checked) {
					background: var(--accent);
					border-color: var(--accent);
					color: white;
				}

				input[type='radio'] {
					display: none;
				}
			}
		}

		.filter-actions {
			display: flex;
			justify-content: flex-end;
			margin-top: 1.5rem;

			.apply-btn {
				padding: 0.75rem 1.5rem;
				background: var(--accent);
				color: white;
				border: none;
				border-radius: var(--base-border-radius);
				cursor: pointer;
				transition: all 0.2s ease;

				&:hover {
					background: var(--accent-dark);
				}

				&.disabled {
					opacity: 0.5;
					cursor: not-allowed;
				}
			}
		}
	}

	@media (max-width: 576px) {
		.filter-modal {
			padding: 1rem;
			min-width: 280px;

			.type-grid {
				grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
			}
		}

		.filter-button-small {
			padding: 0.5rem;
		}
	}
</style>
