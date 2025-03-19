<script lang="ts">
	import type { PageData } from './$types';
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import { deserialize } from '$app/forms';
	import { notifications } from '$lib/components/molecules/notifications';
	import { convertDateToReadable } from '../../../utils/conversions';

	export let data: PageData;

	// Format data with readable dates
	const formattedSignups =
		data?.signups?.map((s) => ({
			...s,
			createdAt: convertDateToReadable(s.created_at)
		})) || [];

	let formattedProfiles =
		data?.profiles?.map((p) => ({
			...p,
			createdAt: convertDateToReadable(p.created_at)
		})) || [];

	// User editing state
	let active = null;
	let activeAdmin = false;

	// Sorting state
	let sortField = '';
	let sortDirection = 'asc';

	// Sort profiles by field
	function sortProfiles(field: string) {
		sortDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
		sortField = field;

		formattedProfiles = [...formattedProfiles].sort((a, b) => {
			if (a[field] < b[field]) return sortDirection === 'asc' ? -1 : 1;
			if (a[field] > b[field]) return sortDirection === 'asc' ? 1 : -1;
			return 0;
		});
	}

	// Save admin status changes
	const saveUserAdminChanges = async () => {
		try {
			const body = new FormData();
			body.append('isAdmin', activeAdmin.toString());
			body.append('email', active.email);

			const resp = await fetch('?/updateAdmin', {
				method: 'POST',
				body
			});

			const result = deserialize(await resp.text());

			if (result?.data?.success) {
				notifications.info('User updated successfully', 3000);

				// Update local data
				if (data.profiles) {
					data.profiles = data.profiles.map((p) => ({
						...p,
						admin: p.email === active.email ? activeAdmin : p.admin
					}));

					// Update formatted profiles as well
					formattedProfiles = formattedProfiles.map((p) => ({
						...p,
						admin: p.email === active.email ? activeAdmin : p.admin
					}));
				}
			} else {
				notifications.danger('Error updating user', 3000);
			}
		} catch (error) {
			console.error('Error saving admin changes:', error);
			notifications.danger('Failed to update user', 3000);
		} finally {
			getModal('user-modal').close();
		}
	};

	// Define essential columns for better UI
	const essentialColumns = [
		{ field: 'id', label: 'ID' },
		{ field: 'username', label: 'Username' },
		{ field: 'first_name', label: 'First Name' },
		{ field: 'last_name', label: 'Last Name' },
		{ field: 'enneagram', label: 'Enneagram' },
		{ field: 'admin', label: 'Is Admin' },
		{ field: 'email', label: 'Email' }
	];

	// Define additional columns that can be hidden/shown
	const additionalColumns = [
		{ field: 'external_id', label: 'External ID' },
		{ field: 'phone', label: 'Phone' },
		{ field: 'aud', label: 'Audience' },
		{ field: 'role', label: 'Role' },
		{ field: 'invited_at', label: 'Invited At' },
		{ field: 'confirmation_sent_at', label: 'Confirmation Sent At' },
		{ field: 'confirmed_at', label: 'Confirmed At' },
		{ field: 'last_sign_in_at', label: 'Last Sign-In At' }
	];

	// State for showing additional columns
	let showAdditionalColumns = false;
</script>

{#if data.user?.admin}
	<div class="rounded-lg bg-neutral-50 bg-opacity-80 p-6 shadow-lg backdrop-blur-sm">
		<!-- Admin Navigation -->
		<div class="mb-6 flex space-x-4 overflow-x-auto pb-2">
			<a href="/admin/users" class="font-semibold text-primary-700">Users</a>
			<span class="text-neutral-400">|</span>
			<a href="/admin/questions" class="text-neutral-600 transition-colors hover:text-primary-600"
				>Questions</a
			>
			<span class="text-neutral-400">|</span>
			<a href="/admin/comments" class="text-neutral-600 transition-colors hover:text-primary-600"
				>Comments</a
			>
			<span class="text-neutral-400">|</span>
			<a href="/content-board" class="text-neutral-600 transition-colors hover:text-primary-600"
				>Content Board</a
			>
			<span class="text-neutral-400">|</span>
			<a href="/marketing" class="text-neutral-600 transition-colors hover:text-primary-600"
				>Marketing</a
			>
			<span class="text-neutral-400">|</span>
			<a href="/links" class="text-neutral-600 transition-colors hover:text-primary-600">Links</a>
			<span class="text-neutral-400">|</span>
			<a href="/admin/messages" class="text-neutral-600 transition-colors hover:text-primary-600"
				>Messages</a
			>
		</div>

		<div class="mb-6">
			<h1 class="text-2xl font-bold text-neutral-900">Users</h1>
		</div>

		{#if formattedProfiles?.length}
			<div class="mb-6 rounded-lg bg-white p-4 shadow-md">
				<div class="mb-4 flex items-center justify-between">
					<h2 class="text-xl font-semibold text-neutral-800">
						User Profiles ({formattedProfiles.length})
					</h2>
					<button
						class="rounded bg-primary-100 px-3 py-1 text-sm text-primary-700 transition-colors hover:bg-primary-200"
						on:click={() => (showAdditionalColumns = !showAdditionalColumns)}
					>
						{showAdditionalColumns ? 'Show Less' : 'Show More Columns'}
					</button>
				</div>

				<div class="max-h-96 overflow-x-auto rounded border border-neutral-200">
					<table class="min-w-full divide-y divide-neutral-200">
						<thead class="bg-neutral-50">
							<tr>
								{#each essentialColumns as column}
									<th
										class="sticky top-0 cursor-pointer bg-neutral-50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600 transition-colors hover:bg-primary-50"
										on:click={() => sortProfiles(column.field)}
									>
										<div class="flex items-center">
											{column.label}
											{#if sortField === column.field}
												<span class="ml-1 text-primary-700">
													{sortDirection === 'asc' ? '↑' : '↓'}
												</span>
											{/if}
										</div>
									</th>
								{/each}

								{#if showAdditionalColumns}
									{#each additionalColumns as column}
										<th
											class="sticky top-0 cursor-pointer bg-neutral-50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600 transition-colors hover:bg-primary-50"
											on:click={() => sortProfiles(column.field)}
										>
											<div class="flex items-center">
												{column.label}
												{#if sortField === column.field}
													<span class="ml-1 text-primary-700">
														{sortDirection === 'asc' ? '↑' : '↓'}
													</span>
												{/if}
											</div>
										</th>
									{/each}
								{/if}

								<th class="sticky top-0 bg-neutral-50 px-4 py-3">Actions</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-neutral-200 bg-white">
							{#each formattedProfiles as profile}
								<tr class="transition-colors hover:bg-primary-50">
									{#each essentialColumns as column}
										<td class="whitespace-nowrap px-4 py-2 text-sm text-neutral-800">
											{column.field === 'admin'
												? profile[column.field]
													? 'Yes'
													: 'No'
												: profile[column.field] || ''}
										</td>
									{/each}

									{#if showAdditionalColumns}
										{#each additionalColumns as column}
											<td class="whitespace-nowrap px-4 py-2 text-sm text-neutral-800">
												{column.field.includes('_at') && profile[column.field]
													? new Date(profile[column.field]).toLocaleString()
													: profile[column.field] || ''}
											</td>
										{/each}
									{/if}

									<td class="whitespace-nowrap px-4 py-2 text-right text-sm font-medium">
										<button
											type="button"
											class="inline-flex items-center rounded border border-transparent bg-primary-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
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
						</tbody>
					</table>
				</div>
			</div>
		{/if}

		{#if formattedSignups?.length}
			<div class="rounded-lg bg-white p-4 shadow-md">
				<h2 class="mb-4 text-xl font-semibold text-neutral-800">
					Signups ({formattedSignups.length})
				</h2>
				<div class="max-h-96 overflow-x-auto rounded border border-neutral-200">
					<table class="min-w-full divide-y divide-neutral-200">
						<thead class="bg-neutral-50">
							<tr>
								<th
									class="sticky top-0 bg-neutral-50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600"
								>
									Email
								</th>
								<th
									class="sticky top-0 bg-neutral-50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600"
								>
									Name
								</th>
								<th
									class="sticky top-0 bg-neutral-50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600"
								>
									Created At
								</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-neutral-200 bg-white">
							{#each formattedSignups as signup}
								<tr class="transition-colors hover:bg-primary-50">
									<td class="whitespace-nowrap px-4 py-2 text-sm text-neutral-800"
										>{signup.email}</td
									>
									<td class="whitespace-nowrap px-4 py-2 text-sm text-neutral-800">{signup.name}</td
									>
									<td class="whitespace-nowrap px-4 py-2 text-sm text-neutral-800"
										>{signup.createdAt}</td
									>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}
	</div>
{:else}
	<div class="rounded-lg bg-white p-6 text-center shadow-md">
		<h1 class="text-xl font-semibold text-error-500">Access Denied</h1>
		<p class="mt-2 text-neutral-600">You need administrator privileges to view this page.</p>
	</div>
{/if}

<Modal2 id="user-modal">
	<div class="bg-neutral-50 p-6">
		<h1 class="mb-2 text-xl font-bold text-neutral-900">Edit User</h1>
		<h2 class="mb-2 text-primary-700">{active?.email}</h2>
		<p class="mb-6 text-sm text-neutral-600">{active?.first_name} {active?.last_name}</p>

		<div class="mb-6">
			<label for="isAdmin" class="mb-1 block text-sm font-medium text-neutral-800"
				>Administrator Status</label
			>
			<select
				name="isAdmin"
				id="isAdmin"
				bind:value={activeAdmin}
				class="mt-1 block w-full rounded border-neutral-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
			>
				<option value={true}>Administrator</option>
				<option value={false}>Regular User</option>
			</select>
		</div>

		<div class="flex justify-end space-x-3">
			<button
				type="button"
				class="inline-flex justify-center rounded border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-md transition-colors hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
				on:click={() => getModal('user-modal').close()}
			>
				Cancel
			</button>
			<button
				type="button"
				class="inline-flex justify-center rounded border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
				on:click={saveUserAdminChanges}
			>
				Save Changes
			</button>
		</div>
	</div>
</Modal2>
