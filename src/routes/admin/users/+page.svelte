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

<div class="admin-users">
	<div class="page-header">
		<h1>User Management</h1>
		<p class="subtitle">Manage user accounts and permissions</p>
	</div>

	<!-- Stats Cards -->
	<div class="stats-grid">
		<div class="stat-card">
			<div class="stat-icon">👥</div>
			<div class="stat-content">
				<h3>Total Users</h3>
				<p class="stat-value">{formattedProfiles?.length || 0}</p>
			</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon">🛡️</div>
			<div class="stat-content">
				<h3>Admin Users</h3>
				<p class="stat-value">{formattedProfiles?.filter((p) => p.admin).length || 0}</p>
			</div>
		</div>
		<div class="stat-card">
			<div class="stat-icon">📧</div>
			<div class="stat-content">
				<h3>Email Signups</h3>
				<p class="stat-value">{formattedSignups?.length || 0}</p>
			</div>
		</div>
	</div>

	{#if formattedProfiles?.length}
		<div class="section-card">
			<div class="section-header-toolbar">
				<h2 class="section-title">User Profiles</h2>
				<button
					class="toggle-btn"
					on:click={() => (showAdditionalColumns = !showAdditionalColumns)}
				>
					{showAdditionalColumns ? 'Show Less' : 'Show More'} Columns
				</button>
			</div>
			<div class="table-wrapper">
				<table class="data-table">
					<thead>
						<tr>
							{#each essentialColumns as column}
								<th class="sortable" on:click={() => sortProfiles(column.field)}>
									<div class="th-content">
										{column.label}
										{#if sortField === column.field}
											<span class="sort-indicator">
												{sortDirection === 'asc' ? '↑' : '↓'}
											</span>
										{/if}
									</div>
								</th>
							{/each}

							{#if showAdditionalColumns}
								{#each additionalColumns as column}
									<th class="sortable" on:click={() => sortProfiles(column.field)}>
										<div class="th-content">
											{column.label}
											{#if sortField === column.field}
												<span class="sort-indicator">
													{sortDirection === 'asc' ? '↑' : '↓'}
												</span>
											{/if}
										</div>
									</th>
								{/each}
							{/if}

							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each formattedProfiles as profile}
							<tr>
								{#each essentialColumns as column}
									<td>
										{#if column.field === 'admin'}
											<span class="badge" class:badge-success={profile.admin}>
												{profile.admin ? 'Yes' : 'No'}
											</span>
										{:else if column.field === 'email'}
											<a href="mailto:{profile.email}" class="table-link">{profile.email}</a>
										{:else}
											{profile[column.field] || '—'}
										{/if}
									</td>
								{/each}

								{#if showAdditionalColumns}
									{#each additionalColumns as column}
										<td>
											{column.field.includes('_at') && profile[column.field]
												? new Date(profile[column.field]).toLocaleString()
												: profile[column.field] || '—'}
										</td>
									{/each}
								{/if}

								<td class="action-cell">
									<button
										type="button"
										class="btn-action"
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
		<div class="section-card">
			<div class="section-header-toolbar">
				<h2 class="section-title">Email Signups</h2>
			</div>
			<div class="table-wrapper">
				<table class="data-table">
					<thead>
						<tr>
							<th>Email</th>
							<th>Name</th>
							<th>Created At</th>
						</tr>
					</thead>
					<tbody>
						{#each formattedSignups as signup}
							<tr>
								<td>
									<a href="mailto:{signup.email}" class="table-link">{signup.email}</a>
								</td>
								<td>{signup.name || '—'}</td>
								<td>{signup.createdAt}</td>
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

	.page-header {
		margin-bottom: 2rem;
	}

	.page-header h1 {
		font-size: 2rem;
		margin: 0 0 0.5rem 0;
		color: var(--text-primary);
	}

	.subtitle {
		color: var(--text-secondary);
		margin: 0;
	}

	/* Stats Grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.stat-card {
		background-color: var(--card-background);
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		padding: 1.5rem;
		display: flex;
		align-items: center;
		gap: 1rem;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.stat-card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-md);
	}

	.stat-icon {
		font-size: 2.5rem;
		opacity: 0.8;
	}

	.stat-content h3 {
		margin: 0 0 0.5rem 0;
		font-size: 0.875rem;
		color: var(--text-secondary);
		font-weight: 500;
	}

	.stat-value {
		margin: 0;
		font-size: 1.75rem;
		font-weight: 600;
		color: var(--primary);
	}

	/* Section Cards */
	.section-card {
		background-color: var(--card-background);
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		margin-bottom: 2rem;
		overflow: hidden;
	}

	.section-header-toolbar {
		padding: 1.25rem;
		background-color: var(--hover-background);
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid var(--border-color);
	}

	.section-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0;
	}

	.toggle-btn {
		padding: 0.5rem 1rem;
		background-color: var(--background);
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		font-size: 0.875rem;
		color: var(--text-primary);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.toggle-btn:hover {
		background-color: var(--primary-light);
		border-color: var(--primary);
		color: var(--primary);
	}

	/* Table Styles */
	.table-wrapper {
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
	}

	.data-table {
		width: 100%;
		border-collapse: collapse;
	}

	.data-table thead {
		background-color: var(--hover-background);
	}

	.data-table th {
		padding: 0.75rem 1rem;
		text-align: left;
		font-weight: 600;
		color: var(--text-primary);
		font-size: 0.875rem;
		white-space: nowrap;
		border-bottom: 1px solid var(--border-color);
	}

	.data-table th.sortable {
		cursor: pointer;
		user-select: none;
		transition: background-color 0.2s ease;
	}

	.data-table th.sortable:hover {
		background-color: var(--primary-light);
	}

	.th-content {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.sort-indicator {
		color: var(--primary);
		font-size: 0.75rem;
	}

	.data-table td {
		padding: 0.75rem 1rem;
		border-top: 1px solid var(--border-color);
		color: var(--text-primary);
	}

	.data-table tbody tr {
		transition: background-color 0.2s ease;
	}

	.data-table tbody tr:hover {
		background-color: var(--hover-background);
	}

	/* Badges */
	.badge {
		display: inline-block;
		padding: 0.25rem 0.625rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 500;
		background-color: var(--error-light);
		color: var(--error);
	}

	.badge-success {
		background-color: var(--success-light);
		color: var(--success);
	}

	/* Links */
	.table-link {
		color: var(--primary);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.table-link:hover {
		color: var(--primary-dark);
		text-decoration: underline;
	}

	/* Action Buttons */
	.action-cell {
		text-align: right;
		white-space: nowrap;
	}

	.btn-action {
		padding: 0.375rem 0.75rem;
		background-color: var(--primary);
		color: white;
		border: none;
		border-radius: var(--border-radius);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-action:hover {
		background-color: var(--primary-dark);
		transform: translateY(-1px);
		box-shadow: var(--shadow-sm);
	}

	/* Modal Styles */
	.modal-content {
		padding: 1.5rem;
	}

	.modal-title {
		font-size: 1.5rem;
		margin: 0 0 1rem 0;
		color: var(--text-primary);
	}

	.modal-info {
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--border-color);
	}

	.user-email {
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--primary);
		margin: 0 0 0.25rem 0;
	}

	.user-name {
		color: var(--text-secondary);
		margin: 0;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: var(--text-primary);
	}

	.form-select {
		width: 100%;
		padding: 0.625rem;
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		background-color: var(--background);
		color: var(--text-primary);
		font-size: 1rem;
		transition: border-color 0.2s ease;
	}

	.form-select:focus {
		outline: none;
		border-color: var(--primary);
		box-shadow: 0 0 0 3px var(--primary-light);
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: 2rem;
	}

	.btn-secondary {
		background-color: var(--secondary);
		color: var(--text-on-secondary);
		padding: 0.625rem 1.25rem;
		border: none;
		border-radius: var(--border-radius);
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-secondary:hover {
		background-color: var(--secondary-dark);
		transform: translateY(-1px);
		box-shadow: var(--shadow-sm);
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.page-header h1 {
			font-size: 1.5rem;
		}

		.stats-grid {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.stat-card {
			padding: 1rem;
		}

		.stat-icon {
			font-size: 2rem;
		}

		.stat-value {
			font-size: 1.5rem;
		}

		.section-header-toolbar {
			flex-direction: column;
			gap: 1rem;
			align-items: flex-start;
		}

		.data-table {
			font-size: 0.875rem;
		}

		.data-table th,
		.data-table td {
			padding: 0.5rem;
		}

		/* Hide less important columns on mobile */
		.data-table th:nth-child(n + 4),
		.data-table td:nth-child(n + 4) {
			display: none;
		}

		.modal-content {
			padding: 1rem;
		}

		.modal-actions {
			flex-direction: column;
			gap: 0.5rem;
		}

		.modal-actions button {
			width: 100%;
		}
	}

	@media (max-width: 480px) {
		.data-table {
			font-size: 0.75rem;
		}

		.data-table th,
		.data-table td {
			padding: 0.375rem;
		}

		/* Show only essential columns on very small screens */
		.data-table th:nth-child(n + 3),
		.data-table td:nth-child(n + 3) {
			display: none;
		}
	}
</style>
