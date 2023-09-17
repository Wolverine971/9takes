<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const formattedSignups: any[] = data?.signups?.length
		? data?.signups?.map((s) => {
				const dateObj = new Date(s.created_at);
				const month = dateObj.getUTCMonth() + 1; //months from 1-12
				const day = dateObj.getUTCDate();
				const year = dateObj.getUTCFullYear();
				const newdate = month + '/' + day + '/' + year;
				return { ...s, createdAt: newdate };
		  })
		: [];

	// export let data: PageData;
</script>

<div class="glass-card">
	{#if data.user?.admin}
		<div class="row">
			<h1 style="">Admin Page</h1>
		</div>

		{#if data.profiles?.length}
			<div class="pretty-div">
				<h2>User's Profiles # {data.profiles?.length}</h2>

				<table>
					<tr>
						<th>Email</th>
						<th>Name</th>
						<th>Is Admin</th>
					</tr>

					{#each data.profiles as profile}
						<tr>
							<td>{profile.email}</td>
							<td>{profile.first_name} {profile.last_name}</td>
							<td>{profile.admin}</td>
						</tr>
					{/each}
				</table>
			</div>
		{/if}

		{#if formattedSignups?.length}
			<div class="pretty-div">
				<h2>Signups # {data.signups?.length}</h2>

				{#each formattedSignups as signup}
					<div class="row" style="justify-content: flex-start;">
						<span>{signup.email}</span>
						<span>Name: {signup.name}</span>
						<span>Created at: {signup.createdAt}</span>
					</div>
				{/each}
			</div>
		{/if}
	{:else}
		<div class="pretty-div">
			<h1>Error</h1>
		</div>
	{/if}
</div>

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
	.scroll-table {
		overflow-x: scroll;
	}
	tr {
		border: var(--classic-border);
		text-align: center;
	}
	td {
		border: var(--classic-border);
		text-align: start;
	}
	th {
		border: var(--classic-border);
		text-align: center;
	}
	.scroll-table::-webkit-scrollbar {
		width: 1rem;
	}

	.scroll-table::-webkit-scrollbar-track {
		box-shadow: 0 0 0.2rem var(--color-paladin-3);
		border-radius: 5px;
	}

	.scroll-table::-webkit-scrollbar-thumb {
		background-color: var(--color-paladin-3);
		border-radius: 5px;
	}
</style>
