<script lang="ts">
	import type { PageData } from './$types';
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import { deserialize } from '$app/forms';
	import { notifications } from '$lib/components/molecules/notifications';
	import { convertDateToReadable } from '../../../utils/conversions';

	export let data: PageData;

	const formattedSignups: any[] = data?.signups?.length
		? data?.signups?.map((s) => {
				return { ...s, createdAt: convertDateToReadable(s.created_at) };
		  })
		: [];

	const formattedProfiles: any[] = data?.profiles?.length
		? data?.profiles?.map((p) => {
				return { ...p, createdAt: convertDateToReadable(p.created_at) };
		  })
		: [];
	let active: any = null;
	let activeAdmin: boolean = false;

	const saveUserAdminChanges = async () => {
		let body = new FormData();
		body.append('isAdmin', activeAdmin.toString());
		body.append('email', active.email);

		const resp = await fetch('?/updateAdmin', {
			method: 'POST',
			body
		});

		const result: any = deserialize(await resp.text());

		if (result?.data?.success) {
			notifications.info('User updated', 3000);
		} else {
			notifications.danger('Error updating user', 3000);
		}

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

		{#if formattedProfiles?.length}
			<div class="pretty-div">
				<h2>User Profiles ({formattedProfiles?.length})</h2>
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

						{#each formattedProfiles as profile}
							<tr>
								<td>{profile.email}</td>
								<td
									>{profile.first_name || profile.last_name
										? `${profile.first_name} ${profile.last_name}`
										: ''}</td
								>
								<td>{profile.createdAt}</td>
								<td>{profile.enneagram || ''}</td>
								<td>
									{profile.admin ? true : false}
								</td>
								<td>
									<button
										type="button"
										class="btn btn-primary"
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
				saveUserAdminChanges();
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
	select {
		border-radius: 5px;
		border: var(--classic-border);
	}
</style>
