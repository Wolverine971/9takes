<script lang="ts">
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import { notifications } from '$lib/components/molecules/notifications';
	import type { PageData } from './$types';

	export let data: PageData;

	let isDemoTime: boolean = data.demoTime;

	const changeDemoTime = async () => {
		let body = new FormData();

		await fetch('?/toggleDemo', {
			method: 'POST',
			body
		});

		isDemoTime = !isDemoTime;
	};

	const reindexEverything = async () => {
		let body = new FormData();

		const resp = await fetch('?/reindexEverything', {
			method: 'POST',
			body
		});
		notifications.info('Reindexed Questions', 3000);
		getModal('confirmReindex').close();
	};
</script>

{#if data.user?.admin}
	<div class="glass-card">
		<div class="row">
			<a href="/admin/users">Users</a> |
			<a href="/admin/questions">Questions</a> |
			<a href="/admin/messages">Messages</a>
		</div>

		<div class="column">
			<h2>Is Demo Time: {isDemoTime}</h2>
			<div class="row">
				<button
					type="button"
					class="btn btn-primary"
					on:click={() => {
						changeDemoTime();
					}}
				>
					Change Demo Time
				</button>
			</div>
		</div>
		<div class="row">
			<button
				type="button"
				class="btn btn-primary"
				on:click={() => {
					getModal('confirmReindex').open();
				}}>Reindex Elastic Search</button
			>
		</div>

		<div class="column">
			<h2>Daily Visitors</h2>
			<div class="row">
				<table>
					<tr>
						<th>Days</th>
						<th>Visitor Count</th>
					</tr>

					{#each data.dailyVisitors as visitor}
						<tr>
							<td>{visitor.days}</td>
							<td>{visitor.number_of_visitors} </td>
						</tr>
					{/each}
				</table>
			</div>
		</div>
	</div>
{:else}
	<div class="pretty-div">
		<h1>Error</h1>
	</div>
{/if}

<Modal2 id="confirmReindex">
	<h1>Reindex elastic</h1>
	Are you sure?
	<button type="button" class="btn btn-primary" on:click={reindexEverything}>yes</button>
</Modal2>

<style lang="scss">
	h1 {
		font-size: 1.5rem;
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		gap: 10px;
		margin: 1rem;
		justify-content: center;
		align-items: center;
	}
	.pretty-div {
		margin: 1rem;
		padding: 1rem;
	}
	.scrollable-div {
		max-height: 100vh;
		overflow-y: scroll;
		padding: 0.5rem;
	}

	td {
		text-align: start;
		margin: 0.2rem;
		padding: 0.5rem;
	}
</style>
