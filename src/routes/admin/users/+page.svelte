<!-- src/routes/admin/users/+page.svelte -->
<script lang="ts">
	import type { PageData } from './$types';
	import Modal2, { getModal } from '$lib/components/atoms/Modal2.svelte';
	import { deserialize } from '$app/forms';
	import { notifications } from '$lib/components/molecules/notifications';
	import { convertDateToReadable } from '../../../utils/conversions';
	import StatCard from '$lib/components/charts/StatCard.svelte';
	import EnneagramBarChart from '$lib/components/charts/EnneagramBarChart.svelte';

	let { data }: { data: PageData } = $props();

	type Signup = NonNullable<PageData['signups']>[number] & { createdAt: string };
	type Profile = NonNullable<PageData['profiles']>[number] & { createdAt: string };
	type SortField = 'last_sign_in_at' | 'created_at' | 'email' | 'enneagram' | 'admin';

	// Format data with readable dates
	let formattedSignups = $derived<Signup[]>(
		data?.signups?.map((s) => ({
			...s,
			createdAt: s.created_at ? convertDateToReadable(s.created_at) : ''
		})) || []
	);

	let formattedProfiles = $derived<Profile[]>(
		data?.profiles?.map((p) => ({
			...p,
			createdAt: p.created_at ? convertDateToReadable(p.created_at) : ''
		})) || []
	);

	// User editing state
	let active = $state<any>(null);
	let activeAdmin = $state(false);

	// Sorting state
	let sortField = $state<SortField>('last_sign_in_at');
	let sortDirection = $state<'asc' | 'desc'>('desc');

	// Search/filter state
	let searchQuery = $state('');
	let filterType = $state<'all' | 'admins' | 'with-type' | 'no-type'>('all');

	// Compute enneagram distribution
	let enneagramDistribution = $derived(
		formattedProfiles.reduce(
			(acc: Record<number, number>, p: any) => {
				if (p.enneagram) {
					acc[p.enneagram] = (acc[p.enneagram] || 0) + 1;
				}
				return acc;
			},
			{} as Record<number, number>
		)
	);

	// Filter profiles based on search and filter
	let filteredProfiles = $derived(
		formattedProfiles.filter((p) => {
			const matchesSearch =
				!searchQuery ||
				p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				p.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				p.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				p.last_name?.toLowerCase().includes(searchQuery.toLowerCase());

			let matchesFilter = true;
			if (filterType === 'admins') matchesFilter = p.admin === true;
			else if (filterType === 'with-type') matchesFilter = !!p.enneagram;
			else if (filterType === 'no-type') matchesFilter = !p.enneagram;

			return matchesSearch && matchesFilter;
		})
	);

	// Sort profiles by field
	function getSortValue(profile: Profile, field: SortField): number | string {
		switch (field) {
			case 'last_sign_in_at':
				return profile.last_sign_in_at ? new Date(profile.last_sign_in_at).getTime() : 0;
			case 'created_at':
				return profile.created_at ? new Date(profile.created_at).getTime() : 0;
			case 'email':
				return profile.email?.toLowerCase() ?? '';
			case 'enneagram':
				return profile.enneagram ? Number(profile.enneagram) : 0;
			case 'admin':
				return profile.admin ? 1 : 0;
		}
	}

	let sortedProfiles = $derived(
		[...filteredProfiles].sort((a, b) => {
			const aVal = getSortValue(a, sortField);
			const bVal = getSortValue(b, sortField);
			if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
			if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
			return 0;
		})
	);

	function toggleSort(field: SortField) {
		if (sortField === field) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortField = field;
			sortDirection = 'desc';
		}
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

			if (
				result.type === 'success' &&
				(result.data as { success?: boolean } | undefined)?.success
			) {
				notifications.success('User updated successfully', 3000);

				// Update local data - formattedProfiles derives from data.profiles automatically
				if (data.profiles) {
					data.profiles = data.profiles.map((p) => ({
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

	import { TYPE_COLOR_MAP } from '$lib/constants/enneagramColors';

	const typeColors = TYPE_COLOR_MAP;
</script>

<div class="admin-users">
	<header class="page-header">
		<h1 class="page-title">User Management</h1>
	</header>

	<!-- Stats Grid -->
	<section class="stats-section">
		<div class="stats-grid">
			<StatCard icon="👥" label="Total Users" value={formattedProfiles.length} color="primary" />
			<StatCard
				icon="🛡️"
				label="Admins"
				value={formattedProfiles.filter((p) => p.admin).length}
				color="warning"
			/>
			<StatCard
				icon="✅"
				label="With Type"
				value={formattedProfiles.filter((p) => p.enneagram).length}
				subValue="{(
					(formattedProfiles.filter((p) => p.enneagram).length / formattedProfiles.length) *
					100
				).toFixed(0)}%"
				color="success"
			/>
			<StatCard icon="📧" label="Email Signups" value={formattedSignups.length} />
		</div>
	</section>

	<!-- Enneagram Distribution -->
	<section class="distribution-section">
		<div class="distribution-card">
			<EnneagramBarChart
				distribution={enneagramDistribution}
				title="User Type Distribution"
				showPercentages={true}
				compact={true}
			/>
		</div>
	</section>

	<!-- User Profiles Table -->
	{#if formattedProfiles?.length}
		<section class="table-section">
			<div class="table-card">
				<div class="table-header">
					<h3 class="table-title">
						<span class="title-icon">👥</span>
						User Profiles
						<span class="count-badge">{sortedProfiles.length}</span>
					</h3>
					<div class="table-controls">
						<input
							type="text"
							placeholder="Search users..."
							bind:value={searchQuery}
							class="search-input"
						/>
						<select bind:value={filterType} class="filter-select">
							<option value="all">All Users</option>
							<option value="admins">Admins Only</option>
							<option value="with-type">Has Enneagram</option>
							<option value="no-type">No Enneagram</option>
						</select>
					</div>
				</div>
				<div class="table-content">
					<table class="data-table">
						<thead>
							<tr>
								<th class="sortable" onclick={() => toggleSort('last_sign_in_at')}>
									Last Active
									{#if sortField === 'last_sign_in_at'}
										<span class="sort-icon">{sortDirection === 'asc' ? '↑' : '↓'}</span>
									{/if}
								</th>
								<th class="sortable" onclick={() => toggleSort('created_at')}>
									Joined
									{#if sortField === 'created_at'}
										<span class="sort-icon">{sortDirection === 'asc' ? '↑' : '↓'}</span>
									{/if}
								</th>
								<th class="sortable" onclick={() => toggleSort('email')}>
									Email
									{#if sortField === 'email'}
										<span class="sort-icon">{sortDirection === 'asc' ? '↑' : '↓'}</span>
									{/if}
								</th>
								<th class="sortable" onclick={() => toggleSort('enneagram')}>
									Type
									{#if sortField === 'enneagram'}
										<span class="sort-icon">{sortDirection === 'asc' ? '↑' : '↓'}</span>
									{/if}
								</th>
								<th>Name</th>
								<th class="sortable" onclick={() => toggleSort('admin')}>
									Admin
									{#if sortField === 'admin'}
										<span class="sort-icon">{sortDirection === 'asc' ? '↑' : '↓'}</span>
									{/if}
								</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{#each sortedProfiles as profile}
								<tr>
									<td class="date-cell" data-label="Last active">
										{profile.last_sign_in_at
											? new Date(profile.last_sign_in_at).toLocaleDateString()
											: '—'}
									</td>
									<td class="date-cell" data-label="Joined">
										{profile.createdAt || '—'}
									</td>
									<td data-label="Email">
										<a href="mailto:{profile.email}" class="email-link">{profile.email}</a>
									</td>
									<td data-label="Type">
										{#if profile.enneagram}
											{@const profileType = Number(profile.enneagram)}
											<span
												class="type-badge"
												style="background: {typeColors[profileType] || 'var(--text-tertiary)'}"
											>
												{profile.enneagram}
											</span>
										{:else}
											<span class="empty-badge">—</span>
										{/if}
									</td>
									<td class="name-cell" data-label="Name">
										{profile.first_name || profile.username || '—'}
										{profile.last_name || ''}
									</td>
									<td data-label="Role">
										{#if profile.admin}
											<span class="admin-badge">Admin</span>
										{:else}
											<span class="user-badge">User</span>
										{/if}
									</td>
									<td data-label="Actions">
										<button
											type="button"
											class="edit-btn"
											onclick={() => {
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
		</section>
	{/if}

	<!-- Email Signups Table -->
	{#if formattedSignups?.length}
		<section class="table-section">
			<div class="table-card">
				<div class="table-header">
					<h3 class="table-title">
						<span class="title-icon">📧</span>
						Email Signups
						<span class="count-badge">{formattedSignups.length}</span>
					</h3>
				</div>
				<div class="table-content">
					<table class="data-table">
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
									<td data-label="Email">
										<a href="mailto:{signup.email}" class="email-link">{signup.email}</a>
									</td>
									<td class="name-cell" data-label="Name">{signup.name || '—'}</td>
									<td class="date-cell" data-label="Created">{signup.createdAt}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</section>
	{/if}
</div>

<Modal2 id="user-modal">
	<div class="modal-content">
		<h2 class="modal-title">Edit User</h2>
		<div class="modal-user-info">
			<div class="user-avatar">
				{#if active?.enneagram}
					<span
						class="avatar-type"
						style="background: {typeColors[Number(active.enneagram)] || 'var(--text-tertiary)'}"
					>
						{active.enneagram}
					</span>
				{:else}
					<span class="avatar-placeholder">?</span>
				{/if}
			</div>
			<div class="user-details">
				<p class="user-email">{active?.email}</p>
				<p class="user-name">{active?.first_name || ''} {active?.last_name || ''}</p>
			</div>
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
				onclick={() => getModal('user-modal').close()}
			>
				Cancel
			</button>
			<button type="button" class="btn btn-primary" onclick={saveUserAdminChanges}>
				Save Changes
			</button>
		</div>
	</div>
</Modal2>

<style>
	.admin-users {
		width: 100%;
	}

	/* Header */
	.page-header {
		margin-bottom: 20px;
		padding-bottom: 12px;
		border-bottom: 1px solid var(--bg-elevated);
	}

	.page-title {
		font-size: 1.375rem;
		font-weight: 700;
		color: var(--text-primary);
		margin: 0;
	}

	/* Stats Section */
	.stats-section {
		margin-bottom: 20px;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 12px;
	}

	/* Distribution Section */
	.distribution-section {
		margin-bottom: 20px;
	}

	.distribution-card {
		background: var(--bg-surface);
		border: 1px solid var(--bg-elevated);
		border-radius: 10px;
		overflow: hidden;
	}

	/* Table Section */
	.table-section {
		margin-bottom: 20px;
	}

	.table-card {
		background: var(--bg-surface);
		border: 1px solid var(--bg-elevated);
		border-radius: 10px;
		overflow: hidden;
	}

	.table-header {
		padding: 12px 16px;
		border-bottom: 1px solid var(--bg-elevated);
		background: var(--bg-deep);
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 10px;
	}

	.table-title {
		display: flex;
		align-items: center;
		gap: 8px;
		margin: 0;
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.title-icon {
		font-size: 0.9375rem;
	}

	.count-badge {
		padding: 2px 8px;
		background: var(--primary);
		color: white;
		border-radius: 10px;
		font-size: 0.6875rem;
		font-weight: 600;
	}

	.table-controls {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
	}

	.search-input {
		padding: 8px 12px;
		border: 1px solid var(--bg-elevated);
		border-radius: 6px;
		font-size: 0.75rem;
		min-width: 160px;
		background: var(--bg-surface);
		color: var(--text-primary);
	}

	.search-input:focus {
		outline: none;
		border-color: var(--primary);
	}

	.filter-select {
		padding: 8px 12px;
		border: 1px solid var(--bg-elevated);
		border-radius: 6px;
		font-size: 0.75rem;
		background: var(--bg-surface);
		color: var(--text-primary);
		cursor: pointer;
	}

	.table-content {
		overflow-x: auto;
		max-height: 500px;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
	}

	.data-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.75rem;
	}

	.data-table thead {
		position: sticky;
		top: 0;
		background: var(--bg-surface);
		z-index: 1;
	}

	.data-table th {
		padding: 10px 12px;
		text-align: left;
		font-weight: 600;
		color: var(--text-secondary);
		font-size: 0.625rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		border-bottom: 1px solid var(--bg-elevated);
		white-space: nowrap;
	}

	.data-table th.sortable {
		cursor: pointer;
		user-select: none;
	}

	.data-table th.sortable:hover {
		color: var(--primary);
	}

	.sort-icon {
		margin-left: 4px;
		color: var(--primary);
	}

	.data-table td {
		padding: 10px 12px;
		border-bottom: 1px solid var(--bg-elevated);
		color: var(--text-primary);
	}

	.data-table tbody tr:hover {
		background: var(--bg-deep);
	}

	.date-cell {
		white-space: nowrap;
		font-size: 0.6875rem;
		color: var(--text-secondary);
	}

	.name-cell {
		max-width: 160px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.email-link {
		color: var(--text-primary);
		text-decoration: none;
	}

	.email-link:hover {
		color: var(--primary);
	}

	.type-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 22px;
		height: 22px;
		border-radius: 5px;
		font-size: 0.6875rem;
		font-weight: 700;
		color: white;
	}

	.empty-badge {
		color: var(--text-secondary);
	}

	.admin-badge {
		padding: 2px 6px;
		background: rgba(245, 158, 11, 0.1);
		color: #d97706;
		border-radius: 10px;
		font-size: 0.625rem;
		font-weight: 600;
	}

	.user-badge {
		padding: 2px 6px;
		background: var(--bg-deep);
		color: var(--text-secondary);
		border-radius: 10px;
		font-size: 0.625rem;
		font-weight: 500;
	}

	.edit-btn {
		padding: 4px 10px;
		background: var(--bg-surface);
		color: var(--primary);
		border: 1px solid var(--primary);
		border-radius: 5px;
		font-size: 0.6875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.edit-btn:hover {
		background: var(--primary);
		color: white;
	}

	/* Modal Styles */
	.modal-content {
		max-width: 400px;
	}

	.modal-title {
		margin: 0 0 16px 0;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--text-primary);
	}

	.modal-user-info {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px;
		background: var(--bg-deep);
		border-radius: 10px;
		margin-bottom: 16px;
	}

	.user-avatar {
		flex-shrink: 0;
	}

	.avatar-type {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 10px;
		font-size: 1.125rem;
		font-weight: 700;
		color: white;
	}

	.avatar-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 10px;
		font-size: 1.125rem;
		font-weight: 700;
		background: var(--bg-elevated);
		color: var(--text-secondary);
	}

	.user-details {
		min-width: 0;
	}

	.user-email {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0 0 4px 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.user-name {
		font-size: 0.75rem;
		color: var(--text-secondary);
		margin: 0;
	}

	.form-group {
		margin-bottom: 16px;
	}

	.form-group label {
		display: block;
		margin-bottom: 6px;
		font-weight: 500;
		color: var(--text-primary);
		font-size: 0.8125rem;
	}

	.form-select {
		width: 100%;
		padding: 10px 12px;
		border: 1px solid var(--bg-elevated);
		border-radius: 6px;
		background: var(--bg-surface);
		color: var(--text-primary);
		font-size: 0.8125rem;
		cursor: pointer;
	}

	.form-select:focus {
		outline: none;
		border-color: var(--primary);
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 10px;
	}

	.btn {
		padding: 10px 18px;
		font-size: 0.8125rem;
		font-weight: 500;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.btn-secondary {
		background: var(--bg-surface);
		color: var(--text-primary);
		border: 1px solid var(--bg-elevated);
	}

	.btn-secondary:hover {
		background: var(--bg-deep);
	}

	.btn-primary {
		background: var(--primary);
		color: white;
		border: none;
	}

	.btn-primary:hover {
		opacity: 0.85;
	}

	/* Mobile */
	@media (max-width: 768px) {
		.page-header {
			margin-bottom: 16px;
			padding-bottom: 10px;
		}

		.page-title {
			font-size: 1.125rem;
		}

		.stats-section,
		.distribution-section,
		.table-section {
			margin-bottom: 16px;
		}

		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 8px;
		}

		.distribution-card,
		.table-card {
			border-radius: 8px;
		}

		.table-header {
			flex-direction: column;
			align-items: stretch;
			padding: 10px 12px;
			gap: 8px;
		}

		.table-title {
			font-size: 0.75rem;
		}

		.table-controls {
			width: 100%;
		}

		.search-input {
			flex: 1;
			min-width: 0;
			font-size: 0.6875rem;
			padding: 8px 10px;
		}

		.filter-select {
			font-size: 0.6875rem;
			padding: 8px 10px;
		}

		.table-content {
			max-height: none;
			overflow: visible;
		}

		.data-table {
			font-size: 0.6875rem;
		}

		.data-table thead {
			position: absolute;
			width: 1px;
			height: 1px;
			padding: 0;
			margin: -1px;
			overflow: hidden;
			clip: rect(0, 0, 0, 0);
			white-space: nowrap;
			border: 0;
		}

		.data-table,
		.data-table tbody,
		.data-table tr {
			display: block;
		}

		.data-table tbody {
			display: grid;
			gap: 0.75rem;
			padding: 0.75rem;
		}

		.data-table tr {
			border: 1px solid var(--bg-elevated);
			border-radius: 10px;
			background: color-mix(in srgb, var(--bg-deep) 68%, var(--bg-surface));
			padding: 0.85rem;
		}

		.data-table td {
			display: grid;
			grid-template-columns: minmax(84px, 0.85fr) minmax(0, 1fr);
			gap: 0.75rem;
			padding: 0;
			border-bottom: none;
			align-items: start;
		}

		.data-table td + td {
			margin-top: 0.7rem;
		}

		.data-table td::before {
			content: attr(data-label);
			font-size: 0.62rem;
			font-weight: 700;
			letter-spacing: 0.08em;
			text-transform: uppercase;
			color: var(--text-secondary);
		}

		.data-table td[data-label='Actions'] {
			grid-template-columns: 1fr;
		}

		.data-table td[data-label='Actions']::before {
			margin-bottom: 0.1rem;
		}

		.name-cell {
			max-width: none;
			overflow: visible;
			text-overflow: initial;
			white-space: normal;
		}

		.email-link {
			overflow-wrap: anywhere;
			word-break: break-word;
		}

		.date-cell {
			white-space: normal;
		}

		.edit-btn {
			width: 100%;
			justify-content: center;
		}
	}

	/* Extra small screens */
	@media (max-width: 480px) {
		.stats-grid {
			gap: 6px;
		}

		.table-header {
			padding: 8px 10px;
		}

		.data-table th,
		.data-table td {
			padding: 6px 8px;
		}

		.table-content {
			max-height: 400px;
		}
	}
</style>
