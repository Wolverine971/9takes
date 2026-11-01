<!-- src/routes/users/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import Modal, { getModal } from '$lib/components/atoms/Modal.svelte';
	import { convertDateToReadable } from '../../utils/conversions';

	let { data }: { data: PageData } = $props();

	const formattedSignups: any[] = $derived(
		data?.signups?.length
			? data?.signups?.map((s) => {
					const newdate = convertDateToReadable(s.created_at ?? '');
					return { ...s, createdAt: newdate };
				})
			: []
	);
	// Follows the load; a saved admin toggle replaces its row locally.
	let profiles = $derived(data.profiles);
	let active: any = $state(null);
	let activeAdmin: boolean = $state(false);

	const save = async () => {
		let body = new FormData();
		body.append('isAdmin', activeAdmin.toString());
		body.append('email', active.email);

		await fetch('?/updateAdmin', {
			method: 'POST',
			body
		});
		if (profiles) {
			profiles = profiles.map((p) => (p.email === active.email ? { ...p, admin: activeAdmin } : p));
		}
		getModal('user-modal2').close();
	};
</script>

<div class="glass-card">
	{#if data.user?.admin}
		<div class="row">
			<h1 style="">Admin Page</h1>
		</div>

		{#if profiles?.length}
			<div class="pretty-div">
				<h2>User Profiles ({profiles?.length})</h2>
				<div class="scroll-table">
					<table>
						<thead>
							<tr>
								<th>Email</th>
								<th>Name</th>
								<th>Created At</th>
								<th>Enneagram</th>
								<th>Is Admin</th>
								<th>Save</th>
							</tr>
						</thead>
						<tbody>
							{#each profiles as profile (profile.id)}
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
											onclick={() => {
												active = { ...profile };
												activeAdmin = !!active.admin;
												getModal('user-modal2').open();
											}}
										>
											Edit
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}

		{#if formattedSignups?.length}
			<div class="pretty-div">
				<h2>Signups # {data.signups?.length}</h2>
				<div class="scroll-table">
					<table>
						<thead>
							<tr>
								<th>Email</th>
								<th>Name</th>
								<th>Created At</th>
							</tr>
						</thead>
						<tbody>
							{#each formattedSignups as signup (signup.id)}
								<tr>
									<td>{signup.email}</td>
									<td>{signup.name}</td>
									<td>{signup.createdAt}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}
	{:else}
		<div class="pretty-div">
			<h1>Error</h1>
		</div>
	{/if}
</div>

<Modal id="user-modal2" name="Edit user">
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
			onclick={() => {
				save();
			}}
		>
			Save
		</button>
	</div>
</Modal>

<style lang="scss">
	td {
		text-align: start;
		margin: 0.2rem;
		padding: 0.5rem;
	}
</style>
