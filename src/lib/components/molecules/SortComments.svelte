<script lang="ts">
	import { deserialize } from '$app/forms';
	import MultiSelect from 'svelte-multiselect';
	// import FilterListIcon from '$lib/components/icons/filterListIcon.svelte';
	import SlidersIcon from '$lib/components/icons/slidersIcon.svelte';

	import { notifications } from '$lib/components/molecules/notifications';

	import { createEventDispatcher } from 'svelte';
	import Modal2, { getModal } from '../atoms/Modal2.svelte';
	const dispatch = createEventDispatcher();

	export let data: any;
	export let size: string = 'large';

	$: data, watchData();

	const watchData = () => {};

	const sort = async () => {
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
		}
	};

	let innerWidth: number = 0;
	let selected: string[] = [`1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `unknown`, `rando`];
	const typeOptions = [`1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `unknown`, `rando`];

	let open: boolean = false;
	let sortBy: string = 'newest';
</script>

<svelte:window bind:innerWidth />
{#if size === 'large'}
	<button
		type="button"
		class="btn btn-primary details-display"
		on:click={() => {
			open = !open;
			if (open) getModal('sorter').open();
			else getModal('sorter').close();
		}}
	>
		<div class="summary-display">
			<SlidersIcon
				iconStyle={'padding: 0.25rem; margin: .5rem'}
				height={'1.5rem'}
				fill={open ? '#5407d9' : ''}
			/>

			Filter Comments
		</div>
	</button>
{:else}
	<button
		type="button"
		class="btn btn-primary"
		on:click={() => {
			open = !open;
			if (open) getModal('sorter').open();
			else getModal('sorter').close();
		}}
	>
		<SlidersIcon
			iconStyle={'padding: 0.25rem; margin: .5rem'}
			height={'1.5rem'}
			fill={open ? '#5407d9' : ''}
		/>
	</button>
{/if}

<Modal2 id="sorter">
	<div style="margin: 2rem; min-width: 40vw">
		<MultiSelect bind:selected options={typeOptions} />
		<br />
		<br />

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
			class="regular {!data?.flags?.userHasAnswered ? 'disabled' : ''} btn btn-primary">Sort</button
		>
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
	.details-display {
		cursor: pointer;
		margin: 0.5rem;
		padding: 0 0.5rem;
		border-radius: 5px;

		&:hover {
			background-color: var(--color-paladin-1);
		}
	}

	.details-display button {
		background-color: var(--color-paladin-1);
		// float: left;
		border: 1px solid var(--color-theme-purple-v);
		outline: none;
		cursor: pointer;
		padding: 0.5rem 2rem 0.5rem;
		transition: 0.3s;
		font-size: 0.75rem;
		border-radius: 5px;
		display: flex;
		margin: 0 0 0.5rem 0.5rem;
		justify-content: center;
		align-items: center;
	}

	/* Change background color of buttons on hover */
	.details-display button:hover {
		// background-color: var(--color-paladin-1);
		border-radius: 5px;
	}

	@media (max-width: 576px) {
		.details-display {
			margin: 0.2rem;
			padding: 0.2rem;
			border-radius: 5px;

			border: 1px solid var(--color-theme-purple);
		}
	}
	select {
		border-radius: 5px;
		border: var(--classic-border);
	}
</style>
