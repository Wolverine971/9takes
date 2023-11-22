<script lang="ts">
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

		await fetch('?/reindexEverything', {
			method: 'POST',
			body
		});
	};
</script>

{#if data.user?.admin}
	<div class="glass-card">
		<div class="row">
			<a href="/admin/users">Users</a> |
			<a href="/admin/questions">Questions</a> |
			<a href="/admin/messages">Messages</a>
		</div>

		<div>
			<button type="button" on:click={reindexEverything}>Reindex Elastic Search</button>
		</div>

		<div class="row">
			<h2>Is Demo Time: {isDemoTime}</h2>
			<button
				type="button"
				on:click={() => {
					changeDemoTime();
				}}
			>
				Update
			</button>
		</div>
	</div>
{:else}
	<div class="pretty-div">
		<h1>Error</h1>
	</div>
{/if}

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
