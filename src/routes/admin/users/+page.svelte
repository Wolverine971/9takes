<script lang="ts">
	import type { PageData } from './$types';
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import { deserialize } from '$app/forms';
	import { notifications } from '$lib/components/molecules/notifications';
	import { convertDateToReadable } from '../../../utils/conversions';

	export let data: PageData;

	console.log(data);

	const formattedSignups: any[] = data?.signups?.length
		? data?.signups?.map((s) => {
				return { ...s, createdAt: convertDateToReadable(s.created_at) };
		  })
		: [];

	let formattedProfiles: any[] = data?.profiles?.length
		? data?.profiles?.map((p) => {
				return { ...p, createdAt: convertDateToReadable(p.created_at) };
		  })
		: [];
	let active: any = null;
	let activeAdmin: boolean = false;

	// Sorting state
	let sortField: string = '';
	let sortDirection: string = 'asc';

	// Sorting function
	function sortProfiles(field: string) {
		console.log('sortProfiles', field);
		if (sortField === field) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortField = field;
			sortDirection = 'asc';
		}

		formattedProfiles = [...formattedProfiles].sort((a, b) => {
			if (a[field] < b[field]) return sortDirection === 'asc' ? -1 : 1;
			if (a[field] > b[field]) return sortDirection === 'asc' ? 1 : -1;
			return 0;
		});
	}

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
			<a href="/admin/users" class="active-link">Users</a> |
			<a href="/admin/questions">Questions</a> |
			<a href="/admin/comments">Comments</a> |
			<a href="/admin/messages">Messages</a>
		</div>
		<div class="row">
			<h1 style="">Users</h1>
		</div>

		{#if formattedProfiles?.length}
			<div class="pretty-div">
				<h2>User Profiles ({formattedProfiles?.length})</h2>
				<div class="scroll-table scrollable-div">
					<table>
						<tr>
							<th on:click={() => sortProfiles('id')}>ID</th>
							<th on:click={() => sortProfiles('username')}>Username</th>
							<th on:click={() => sortProfiles('first_name')}>First Name</th>
							<th on:click={() => sortProfiles('last_name')}>Last Name</th>
							<th on:click={() => sortProfiles('enneagram')}>Enneagram</th>
							<th on:click={() => sortProfiles('admin')}>Is Admin</th>
							<th on:click={() => sortProfiles('external_id')}>External ID</th>
							<th on:click={() => sortProfiles('email')}>Email</th>
							<th on:click={() => sortProfiles('phone')}>Phone</th>
							<th on:click={() => sortProfiles('aud')}>Audience</th>
							<th on:click={() => sortProfiles('role')}>Role</th>
							<th on:click={() => sortProfiles('invited_at')}>Invited At</th>
							<th on:click={() => sortProfiles('confirmation_sent_at')}>Confirmation Sent At</th>
							<th on:click={() => sortProfiles('confirmed_at')}>Confirmed At</th>
							<th on:click={() => sortProfiles('last_sign_in_at')}>Last Sign-In At</th>
							<th>Save</th>
						</tr>

						{#each formattedProfiles as profile}
							<tr>
								<td>{profile.id}</td>
								<td>{profile.username}</td>
								<td>{profile.first_name}</td>
								<td>{profile.last_name}</td>
								<td>{profile.enneagram || ''}</td>
								<td>{profile.admin ? 'Yes' : 'No'}</td>
								<td>{profile.external_id}</td>
								<td>{profile.email}</td>
								<td>{profile.phone}</td>
								<td>{profile.aud}</td>
								<td>{profile.role}</td>
								<td>{profile.invited_at ? new Date(profile.invited_at).toLocaleString() : ''}</td>
								<td
									>{profile.confirmation_sent_at
										? new Date(profile.confirmation_sent_at).toLocaleString()
										: ''}</td
								>
								<td
									>{profile.confirmed_at ? new Date(profile.confirmed_at).toLocaleString() : ''}</td
								>
								<td
									>{profile.last_sign_in_at
										? new Date(profile.last_sign_in_at).toLocaleString()
										: ''}</td
								>
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
	.scrollable-div {
		max-height: 800px;
	}
	h1 {
		font-size: 1.5rem;
	}

	td {
		text-align: start;
		margin: 0.2rem;
		padding: 0.5rem;
	}
	// th {
	// 	cursor: pointer;
	// }

	.scrollable-div {
		scrollbar-color: aqua brown;
	}
	th {
		cursor: pointer;
		position: sticky;
		top: 0;
		background-color: white; /* or whatever background color you prefer */
		z-index: 1; /* Ensure the headers stay above the other content */
		padding: 10px; /* Add some padding for better appearance */
		text-align: left; /* Align the text to the left */
		box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4); /* Optional shadow effect for better separation */
	}
</style>
