<!-- src/routes/admin/users/+page.svelte -->
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
				notifications.success('User updated successfully', 3000);

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
		{ field: 'last_sign_in_at', label: 'Last Sign-In' },
		{ field: 'email', label: 'Email' },
		{ field: 'enneagram', label: 'Enneagram' },
		{ field: 'username', label: 'Username' },
		{ field: 'first_name', label: 'First Name' },
		{ field: 'last_name', label: 'Last Name' },
		{ field: 'admin', label: 'Is Admin' },
		{ field: 'id', label: 'ID' }
	];

	// Define additional columns that can be hidden/shown
	const additionalColumns = [
		{ field: 'external_id', label: 'External ID' },
		{ field: 'phone', label: 'Phone' },
		{ field: 'aud', label: 'Audience' },
		{ field: 'role', label: 'Role' },
		{ field: 'invited_at', label: 'Invited At' },
		{ field: 'confirmation_sent_at', label: 'Confirmation Sent At' },
		{ field: 'confirmed_at', label: 'Confirmed At' }
	];

	// State for showing additional columns
	let showAdditionalColumns = false;
</script>

<div class="admin-users">
	<h1 class="page-title">User Management</h1>

	<!-- Compact Stats Row -->
	<div class="stats-row">
		<div class="stat-chip">
			<span class="stat-label">Users</span>
			<span class="stat-num">{formattedProfiles?.length || 0}</span>
		</div>
		<div class="stat-chip">
			<span class="stat-label">Admins</span>
			<span class="stat-num">{formattedProfiles?.filter((p) => p.admin).length || 0}</span>
		</div>
		<div class="stat-chip">
			<span class="stat-label">Signups</span>
			<span class="stat-num">{formattedSignups?.length || 0}</span>
		</div>
	</div>

	{#if formattedProfiles?.length}
		<div class="section-card compact">
			<div class="section-header-toolbar compact">
				<span class="section-title">User Profiles ({formattedProfiles.length})</span>
				<button
					class="toggle-btn"
					on:click={() => (showAdditionalColumns = !showAdditionalColumns)}
				>
					{showAdditionalColumns ? '− Less' : '+ More'}
				</button>
			</div>
			<div class="table-wrapper">
				<table class="data-table compact">
					<thead>
						<tr>
							{#each essentialColumns as column}
								<th class="sortable" on:click={() => sortProfiles(column.field)}>
									{column.label}
									{#if sortField === column.field}
										<span class="sort-ind">{sortDirection === 'asc' ? '↑' : '↓'}</span>
									{/if}
								</th>
							{/each}
							{#if showAdditionalColumns}
								{#each additionalColumns as column}
									<th class="sortable" on:click={() => sortProfiles(column.field)}>
										{column.label}
										{#if sortField === column.field}
											<span class="sort-ind">{sortDirection === 'asc' ? '↑' : '↓'}</span>
										{/if}
									</th>
								{/each}
							{/if}
							<th></th>
						</tr>
					</thead>
					<tbody>
						{#each formattedProfiles as profile}
							<tr>
								{#each essentialColumns as column}
									<td>
										{#if column.field === 'admin'}
											<span class="badge" class:badge-yes={profile.admin}>
												{profile.admin ? 'Y' : 'N'}
											</span>
										{:else if column.field === 'email'}
											<a href="mailto:{profile.email}" class="table-link">{profile.email}</a>
										{:else if column.field === 'last_sign_in_at'}
											<span class="date-cell">
												{profile.last_sign_in_at
													? new Date(profile.last_sign_in_at).toLocaleDateString()
													: '—'}
											</span>
										{:else if column.field === 'enneagram'}
											{profile.enneagram ? `T${profile.enneagram}` : '—'}
										{:else}
											{profile[column.field] || '—'}
										{/if}
									</td>
								{/each}
								{#if showAdditionalColumns}
									{#each additionalColumns as column}
										<td class="date-cell">
											{column.field.includes('_at') && profile[column.field]
												? new Date(profile[column.field]).toLocaleDateString()
												: profile[column.field] || '—'}
										</td>
									{/each}
								{/if}
								<td>
									<button
										type="button"
										class="btn-edit"
										on:click={() => {
											active = { ...profile };
											activeAdmin = !!active.admin;
											getModal('user-modal').open();
										}}
									>
										✎
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
		<div class="section-card compact">
			<div class="section-header-toolbar compact">
				<span class="section-title">Email Signups ({formattedSignups.length})</span>
			</div>
			<div class="table-wrapper">
				<table class="data-table compact">
					<thead>
						<tr>
							<th>Email</th>
							<th>Name</th>
							<th>Created</th>
						</tr>
					</thead>
					<tbody>
						{#each formattedSignups as signup}
							<tr>
								<td><a href="mailto:{signup.email}" class="table-link">{signup.email}</a></td>
								<td>{signup.name || '—'}</td>
								<td class="date-cell">{signup.createdAt}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>

<Modal2 id="user-modal">
	<div class="modal-content">
		<h2 class="modal-title">Edit User</h2>
		<div class="modal-info">
			<p class="user-email">{active?.email}</p>
			<p class="user-name">{active?.first_name} {active?.last_name}</p>
		</div>

		<div class="form-group">
			<label for="isAdmin">Administrator Status</label>
			<select name="isAdmin" id="isAdmin" bind:value={activeAdmin} class="form-select">
				<option value={true}>Administrator</option>
				<option value={false}>Regular User</option>
			</select>
		</div>

		<div class="modal-actions">
			<button
				type="button"
				class="btn btn-secondary"
				on:click={() => getModal('user-modal').close()}
			>
				Cancel
			</button>
			<button type="button" class="btn btn-primary" on:click={saveUserAdminChanges}>
				Save Changes
			</button>
		</div>
	</div>
</Modal2>

<style>
	.admin-users {
		max-width: 1400px;
		margin: 0 auto;
	}

	.page-title {
		font-size: 1.25rem;
		margin: 0 0 0.75rem 0;
		color: var(--text-primary);
	}

	/* Compact Stats Row */
	.stats-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.stat-chip {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.5rem 0.75rem;
		background: var(--card-background);
		border: 1px solid var(--border-color);
		border-radius: 6px;
		min-width: 70px;
	}

	.stat-label {
		font-size: 0.65rem;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.stat-num {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--primary);
		line-height: 1.2;
	}

	/* Section Cards - Compact */
	.section-card {
		background-color: var(--card-background);
		border: 1px solid var(--border-color);
		border-radius: 6px;
		overflow: hidden;
	}

	.section-card.compact {
		margin-bottom: 0.75rem;
	}

	.section-header-toolbar {
		padding: 0.5rem 0.75rem;
		background-color: var(--hover-background);
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid var(--border-color);
	}

	.section-header-toolbar.compact {
		padding: 0.375rem 0.5rem;
	}

	.section-title {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0;
	}

	.toggle-btn {
		padding: 0.25rem 0.5rem;
		background-color: var(--background);
		border: 1px solid var(--border-color);
		border-radius: 4px;
		font-size: 0.7rem;
		color: var(--text-primary);
		cursor: pointer;
	}

	.toggle-btn:hover {
		background-color: var(--primary-light);
		border-color: var(--primary);
	}

	/* Table Styles - Compact */
	.table-wrapper {
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
	}

	.data-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.75rem;
	}

	.data-table.compact {
		font-size: 0.7rem;
	}

	.data-table thead {
		background-color: var(--hover-background);
	}

	.data-table th {
		padding: 0.375rem 0.5rem;
		text-align: left;
		font-weight: 600;
		color: var(--text-primary);
		white-space: nowrap;
		border-bottom: 1px solid var(--border-color);
	}

	.data-table th.sortable {
		cursor: pointer;
		user-select: none;
	}

	.data-table th.sortable:hover {
		background-color: var(--primary-light);
	}

	.sort-ind {
		color: var(--primary);
		font-size: 0.65rem;
		margin-left: 2px;
	}

	.data-table td {
		padding: 0.375rem 0.5rem;
		border-top: 1px solid var(--border-color);
		color: var(--text-primary);
	}

	.data-table tbody tr:hover {
		background-color: var(--hover-background);
	}

	.date-cell {
		white-space: nowrap;
		font-size: 0.65rem;
		color: var(--text-secondary);
	}

	/* Badges - Compact */
	.badge {
		display: inline-block;
		padding: 0.125rem 0.375rem;
		border-radius: 9999px;
		font-size: 0.6rem;
		font-weight: 500;
		background-color: var(--error-light);
		color: var(--error);
	}

	.badge-yes {
		background-color: var(--success-light);
		color: var(--success);
	}

	/* Links */
	.table-link {
		color: var(--primary);
		text-decoration: none;
		font-weight: 500;
	}

	.table-link:hover {
		text-decoration: underline;
	}

	/* Edit Button - Compact */
	.btn-edit {
		padding: 0.125rem 0.375rem;
		background: transparent;
		border: 1px solid var(--border-color);
		border-radius: 3px;
		font-size: 0.7rem;
		cursor: pointer;
		color: var(--text-secondary);
	}

	.btn-edit:hover {
		background-color: var(--primary-light);
		border-color: var(--primary);
		color: var(--primary);
	}

	/* Modal Styles */
	.modal-content {
		padding: 1rem;
	}

	.modal-title {
		font-size: 1.125rem;
		margin: 0 0 0.75rem 0;
		color: var(--text-primary);
	}

	.modal-info {
		margin-bottom: 1rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid var(--border-color);
	}

	.user-email {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--primary);
		margin: 0 0 0.125rem 0;
	}

	.user-name {
		color: var(--text-secondary);
		margin: 0;
		font-size: 0.8rem;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.375rem;
		font-weight: 500;
		color: var(--text-primary);
		font-size: 0.8rem;
	}

	.form-select {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid var(--border-color);
		border-radius: 4px;
		background-color: var(--background);
		color: var(--text-primary);
		font-size: 0.875rem;
	}

	.form-select:focus {
		outline: none;
		border-color: var(--primary);
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.btn-secondary {
		background-color: var(--secondary);
		color: var(--text-on-secondary);
		padding: 0.375rem 0.75rem;
		border: none;
		border-radius: 4px;
		font-size: 0.8rem;
		font-weight: 500;
		cursor: pointer;
	}

	.btn-secondary:hover {
		background-color: var(--secondary-dark);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.section-header-toolbar {
			flex-direction: row;
		}

		.data-table th:nth-child(n + 5),
		.data-table td:nth-child(n + 5) {
			display: none;
		}

		.modal-actions {
			flex-direction: column;
		}

		.modal-actions button {
			width: 100%;
		}
	}

	@media (max-width: 480px) {
		.data-table th:nth-child(n + 3),
		.data-table td:nth-child(n + 3) {
			display: none;
		}
	}
</style>
