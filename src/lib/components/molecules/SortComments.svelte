<!-- lib/components/molecules/SortComments.svelte -->
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
		class="flex cursor-pointer items-center gap-2 rounded border border-neutral-200 bg-white px-4 py-3 font-medium transition-all duration-200 hover:-translate-y-px hover:bg-neutral-100 hover:shadow-sm"
		on:click={() => getModal('sorter').open()}
		in:fade={{ duration: 200 }}
		aria-label="Filter and sort comments"
		title="Filter and sort comments"
	>
		<SlidersIcon className="text-primary-500 h-5 w-5" />
		<span class="whitespace-nowrap text-sm">Filter Comments</span>
		{#if selected.length !== typeOptions.length}
			<span
				class="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-500 px-1.5 text-xs font-semibold text-white"
			>
				{selected.length}
			</span>
		{/if}
	</button>
{:else}
	<button
		type="button"
		class="flex cursor-pointer items-center justify-center rounded border border-neutral-200 bg-white p-2 transition-all duration-200 hover:-translate-y-px hover:bg-neutral-100"
		on:click={() => getModal('sorter').open()}
		aria-label="Filter and sort comments"
		title="Filter and sort comments"
	>
		<SlidersIcon className="text-primary-500 h-5 w-5" />
	</button>
{/if}

<!-- Filter Modal -->
<Modal2 id="sorter">
	<div
		class="w-full min-w-[320px] max-w-[600px] rounded bg-white p-6 shadow-lg sm:min-w-[280px] sm:p-4"
		in:fly={{ y: -20, duration: 300 }}
	>
		<h2
			class="relative mb-6 mt-0 text-center text-xl font-semibold text-neutral-900 after:absolute after:bottom-[-8px] after:left-1/2 after:h-0.5 after:w-[60px] after:-translate-x-1/2 after:bg-primary-500 after:content-['']"
		>
			Filter & Sort Comments
		</h2>

		<!-- Personality Type Filters -->
		<div class="mb-6">
			<h3 class="mb-4 text-lg font-semibold text-neutral-900">Personality Type</h3>
			<div class="mb-4">
				<div class="flex gap-3 sm:flex-col sm:gap-2">
					<button
						class="cursor-pointer rounded border border-neutral-200 bg-transparent px-4 py-2 text-sm transition-all duration-200 hover:bg-neutral-100"
						on:click={selectAll}
						type="button"
					>
						Select All
					</button>
					<button
						class="cursor-pointer rounded border border-neutral-200 bg-transparent px-4 py-2 text-sm transition-all duration-200 hover:bg-neutral-100"
						on:click={clearAll}
						type="button"
					>
						Clear All
					</button>
				</div>

				<div
					class="mt-4 grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2 sm:grid-cols-[repeat(auto-fill,minmax(80px,1fr))]"
				>
					{#each typeOptions as type}
						<label
							class="flex cursor-pointer items-center justify-center rounded border border-neutral-200 p-2 text-center text-sm transition-all duration-200 hover:bg-neutral-100 {selected.includes(
								type
							)
								? 'border-primary-500 bg-primary-500 text-white'
								: ''}"
						>
							<input
								type="checkbox"
								value={type}
								checked={selected.includes(type)}
								on:change={() => toggleType(type)}
								class="sr-only"
							/>
							<span class="font-medium">Type {type}</span>
						</label>
					{/each}
				</div>
			</div>
		</div>

		<!-- Sort Options -->
		<div class="mb-6">
			<h3 class="mb-4 text-lg font-semibold text-neutral-900">Sort Order</h3>
			<div class="flex flex-col gap-2">
				<label
					class="flex cursor-pointer items-center justify-center rounded border border-neutral-200 p-3 text-sm font-medium transition-all duration-200 hover:bg-neutral-100 {sortBy ===
					'newest'
						? 'border-primary-500 bg-primary-500 text-white'
						: ''}"
				>
					<input type="radio" bind:group={sortBy} value="newest" class="sr-only" />
					<span>Newest First</span>
				</label>
				<label
					class="flex cursor-pointer items-center justify-center rounded border border-neutral-200 p-3 text-sm font-medium transition-all duration-200 hover:bg-neutral-100 {sortBy ===
					'oldest'
						? 'border-primary-500 bg-primary-500 text-white'
						: ''}"
				>
					<input type="radio" bind:group={sortBy} value="oldest" class="sr-only" />
					<span>Oldest First</span>
				</label>
				<label
					class="flex cursor-pointer items-center justify-center rounded border border-neutral-200 p-3 text-sm font-medium transition-all duration-200 hover:bg-neutral-100 {sortBy ===
					'likes'
						? 'border-primary-500 bg-primary-500 text-white'
						: ''}"
				>
					<input type="radio" bind:group={sortBy} value="likes" class="sr-only" />
					<span>Most Liked</span>
				</label>
			</div>
		</div>

		<!-- Action Buttons -->
		<div class="mt-6 flex justify-end gap-3 sm:flex-col">
			<button
				class="cursor-pointer rounded border border-neutral-400 bg-transparent px-6 py-3 font-medium text-neutral-600 transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-900"
				on:click={() => getModal('sorter').close()}
				type="button"
			>
				Cancel
			</button>
			<button
				class="flex cursor-pointer items-center justify-center gap-2 rounded border-none bg-primary-500 px-6 py-3 font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
				on:click={applyFilters}
				disabled={sortLoading || !data?.flags?.userHasAnswered}
				type="button"
			>
				{#if sortLoading}
					<div class="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
				{:else}
					Apply Filters
				{/if}
			</button>
		</div>
	</div>
</Modal2>
