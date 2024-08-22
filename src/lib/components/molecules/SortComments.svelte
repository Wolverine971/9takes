<script lang="ts">
	import { deserialize } from '$app/forms';
	import MultiSelect from 'svelte-multiselect';
	// import FilterListIcon from '$lib/components/icons/filterListIcon.svelte';
	import SlidersIcon from '$lib/components/icons/slidersIcon.svelte';

	import { notifications } from '$lib/components/molecules/notifications';

	import { createEventDispatcher } from 'svelte';
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import Context, { onClickOutside } from '$lib/components/molecules/Context.svelte';
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

<svelte:window bind:innerWidth />
{#if size === 'large'}
	<button
		type="button"
		class="btn btn-primary sort-btn summary-display"
		on:click={() => {
			getModal('sorter').open();
		}}
	>
		<SlidersIcon
			iconStyle={'padding-right: 0.5rem; margin: .5rem 0'}
			height={'1.5rem'}
			fill={'#b3a6c9'}
		/>

		Filter Comments
	</button>
{:else}
	<button
		type="button"
		class="btn btn-primary"
		on:click={() => {
			getModal('sorter').open();
		}}
	>
		<SlidersIcon iconStyle={'padding: 0.25rem; margin: .5rem'} height={'1.5rem'} fill={'#b3a6c9'} />
	</button>
{/if}

<Modal2 id="sorter">
	<div style="margin: 2rem; min-width: 40vw">
		<p>Personality Type</p>
		<Context>
			<div
				use:onClickOutside={() => {
					multiSelectOpen = !multiSelectOpen;
				}}
			>
				<MultiSelect bind:selected options={typeOptions} open={multiSelectOpen} />
			</div>
		</Context>
		<br />

		<p>Order By</p>
		<select bind:value={sortBy}>
			<option value="newest">Newest</option>
			<option value="oldest">Oldest</option>
			<option value="likes">Likes</option>
		</select>
		<br />
		<button
			type="button"
			value="Sort"
			style="float: right;"
			on:click={sort}
			class="regular {!data?.flags?.userHasAnswered ? 'disabled' : ''} btn btn-primary"
		>
			{#if sortLoading}
				<div class="loader" />
			{:else}
				Sort
			{/if}
		</button>
	</div>
</Modal2>

<style lang="scss">
	.dropdown-content ul {
		display: flex;
		flex-direction: column;
	}
	summary::marker {
		display: none;
		content: '';
	}
	.summary-display {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.sort-btn {
		cursor: pointer;
		margin: 0.5rem;
		padding: 0 0.5rem;
		border-radius: var(--base-border-radius);
		border: 1px solid var(--base-white-outline);

		// &:hover {
		// 	background-color: var(--base-white-outline);
		// }
	}

	@media (max-width: 576px) {
		.sort-btn {
			margin: 0.2rem;
			padding: 0.2rem;
			border: 1px solid var(--color-theme-purple);
		}
	}
</style>
