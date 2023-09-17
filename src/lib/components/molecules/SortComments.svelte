<script lang="ts">
	import { deserialize } from '$app/forms';
	import MultiSelect from 'svelte-multiselect';
	import FilterListIcon from '$lib/components/icons/filterListIcon.svelte';
	import { notifications } from '$lib/components/molecules/notifications.js';

	import { createEventDispatcher } from 'svelte';
	import DownIcon from '$lib/components/icons/downIcon.svelte';
	const dispatch = createEventDispatcher();

	export let data: any;

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
</script>

<svelte:window bind:innerWidth />

<details class="details-display" bind:open>
	<summary class="summary-display">
		<FilterListIcon
			iconStyle={'padding: 0.25rem; margin: .5rem'}
			height={'1.5rem'}
			fill={open ? '#5407d9' : ''}
		/>

		Filter Comments <DownIcon
			className="hover-change"
			iconStyle={'padding: 0.25rem; margin: .5rem'}
			height={'1.5rem'}
			fill={open ? '#5407d9' : ''}
		/>
	</summary>
	<MultiSelect bind:selected options={typeOptions} />
	<br />
	<button
		type="button"
		value="Sort"
		on:click={sort}
		class="regular {!data?.flags?.userHasAnswered ? 'disabled' : ''}">Sort</button
	>
</details>

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
		padding: 0.5rem;
		border-radius: 5px;

		&:hover {
			background-color: var(--color-bg-0);
		}
	}

	.details-display button {
		background-color: var(--color-bg-0);
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
		// background-color: var(--color-bg-0);
		border-radius: 5px;
		border: 1px solid var(--color-theme-purple);
	}

	@media (max-width: 576px) {
		.details-display {
			margin: 0.2rem;
			padding: 0.2rem;
			border-radius: 5px;

			border: 1px solid var(--color-theme-purple);
		}
	}
</style>
