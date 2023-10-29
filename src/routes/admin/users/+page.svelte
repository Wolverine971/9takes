<script lang="ts">
	import type { PageData } from './$types';
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';

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
	let active: any = null;
	let activeAdmin: boolean = false;

	const save = async () => {
		let body = new FormData();
		body.append('isAdmin', activeAdmin.toString());
		body.append('email', active.email);

		await fetch('?/updateAdmin', {
			method: 'POST',
			body
		});
		if (data.profiles) {
			data.profiles = data?.profiles?.map((p) => {
				if (p.email === active.email) {
					p.admin = activeAdmin;
				}
				return p;
			});
		}
		getModal('user-modal').close();
	};
</script>

{#if data.user?.admin}
	<div class="glass-card">
		<div class="row">
			<h1 style="">Users</h1>
		</div>

		{#if data.profiles?.length}
			<div class="pretty-div">
				<h2>User Profiles ({data.profiles?.length})</h2>
				<div class="scroll-table scrollable-div">
					<table>
						<tr>
							<th>Email</th>
							<th>Name</th>
							<th>Created At</th>
							<th>Enneagram</th>
							<th>Is Admin</th>
							<th>Save</th>
						</tr>

						{#each data.profiles as profile}
							<tr>
								<td>{profile.email}</td>
								<td>{profile.first_name} {profile.last_name}</td>
								<td>{profile.created_at}</td>
								<td>{profile.enneagram}</td>
								<td>
									{profile.admin ? true : false}
								</td>
								<td>
									<button
										type="button"
										on:click={() => {
											active = { ...profile };
											activeAdmin = !!active.admin;
											getModal('user-modal').open();
										}}
									>
										Edit
									</button>
								</td>
							</tr>
						{/each}
					</table>
				</div>
			</div>
		{/if}

		{#if formattedSignups?.length}
			<div class="pretty-div">
				<h2>Signups # {data.signups?.length}</h2>
				<div class="scroll-table scrollable-div">
					<table>
						<tr>
							<th>Email</th>
							<th>Name</th>
							<th>Created At</th>
						</tr>

						{#each formattedSignups as signup}
							<tr>
								<td>{signup.email}</td>
								<td>{signup.name}</td>
								<td>{signup.createdAt}</td>
							</tr>
						{/each}
					</table>
				</div>
			</div>
		{/if}
	</div>
{:else}
	<div class="pretty-div">
		<h1>Error</h1>
	</div>
{/if}

<Modal2 id="user-modal">
	<div>
		<h1>Edit {active?.email}</h1>
		<h2>{active?.first_name} {active?.last_name}</h2>

		<label for="isAdmin">Is Admin</label>

		<select name="isAdmin" id="isAdmin" bind:value={activeAdmin}>
			<option value={true}>true</option>
			<option value={false}>false</option>
		</select>

		<button
			type="button"
			on:click={() => {
				save();
			}}
		>
			Save
		</button>
	</div>
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
