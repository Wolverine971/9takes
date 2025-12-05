<!-- src/routes/admin/consulting/clients/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { notifications } from '$lib/components/molecules/notifications';
	import type { PageData } from './$types';

	export let data: PageData;

	// Modal state
	let showCreateModal = false;
	let isCreating = false;

	// Form data
	let newClientName = '';
	let newClientEmail = '';
	let newClientPhone = '';
	let newClientType = '';
	let newClientSource = '';
	let newClientGoal = '';

	// Search/filter
	let searchInput = data.filters.search;
	let searchTimeout: ReturnType<typeof setTimeout>;

	function handleSearch() {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			const url = new URL(window.location.href);
			if (searchInput) {
				url.searchParams.set('q', searchInput);
			} else {
				url.searchParams.delete('q');
			}
			goto(url.toString(), { replaceState: true, invalidateAll: true });
		}, 300);
	}

	function setFilter(key: string, value: string) {
		const url = new URL(window.location.href);
		if (value === 'all') {
			url.searchParams.delete(key);
		} else {
			url.searchParams.set(key, value);
		}
		goto(url.toString(), { replaceState: true, invalidateAll: true });
	}

	function formatDate(dateStr: string | null): string {
		if (!dateStr) return '-';
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function closeModal() {
		showCreateModal = false;
		newClientName = '';
		newClientEmail = '';
		newClientPhone = '';
		newClientType = '';
		newClientSource = '';
		newClientGoal = '';
	}

	const statusLabels: Record<string, { label: string; color: string }> = {
		prospect: { label: 'Prospect', color: '#6366f1' },
		intake_sent: { label: 'Intake Sent', color: '#f59e0b' },
		intake_completed: { label: 'Intake Done', color: '#10b981' },
		active: { label: 'Active', color: '#3b82f6' },
		completed: { label: 'Completed', color: '#6b7280' },
		paused: { label: 'Paused', color: '#9ca3af' },
		churned: { label: 'Churned', color: '#ef4444' }
	};

	const trustLabels: Record<string, { label: string; color: string }> = {
		outer: { label: 'Outer', color: '#ef4444' },
		middle: { label: 'Middle', color: '#f59e0b' },
		inner: { label: 'Inner', color: '#10b981' }
	};
</script>

<div class="clients-page">
	<div class="page-header">
		<div class="header-content">
			<h1>Clients</h1>
			<p class="subtitle">{data.totalClients} total clients</p>
		</div>
		<button class="btn btn-primary" on:click={() => (showCreateModal = true)}>
			+ New Client
		</button>
	</div>

	<!-- Filters -->
	<div class="filters-bar">
		<div class="search-box">
			<input
				type="text"
				placeholder="Search by name or email..."
				bind:value={searchInput}
				on:input={handleSearch}
			/>
		</div>

		<div class="filter-group">
			<label>Status:</label>
			<select
				value={data.filters.status}
				on:change={(e) => setFilter('status', e.currentTarget.value)}
			>
				<option value="all">All ({data.totalClients})</option>
				{#each Object.entries(statusLabels) as [value, { label }]}
					<option {value}>{label} ({data.statusCounts[value] || 0})</option>
				{/each}
			</select>
		</div>

		<div class="filter-group">
			<label>Type:</label>
			<select value={data.filters.type} on:change={(e) => setFilter('type', e.currentTarget.value)}>
				<option value="all">All Types</option>
				{#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as type}
					<option value={type.toString()}>Type {type}</option>
				{/each}
			</select>
		</div>
	</div>

	<!-- Clients Table -->
	<div class="clients-table-wrapper">
		{#if data.clients.length === 0}
			<div class="empty-state">
				<p>No clients found</p>
				<button class="btn btn-primary" on:click={() => (showCreateModal = true)}>
					Create your first client
				</button>
			</div>
		{:else}
			<table class="clients-table">
				<thead>
					<tr>
						<th>Client</th>
						<th>Type</th>
						<th>Status</th>
						<th>Trust Layer</th>
						<th>Sessions</th>
						<th>Intake</th>
						<th>Created</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each data.clients as client}
						<tr>
							<td class="client-cell">
								<a href="/admin/consulting/clients/{client.id}" class="client-name">
									{client.name}
								</a>
								<span class="client-email">{client.email}</span>
							</td>
							<td>
								{#if client.enneagram_type}
									<span class="type-badge">
										{client.enneagram_type}
										{#if client.enneagram_wing}w{client.enneagram_wing}{/if}
									</span>
								{:else}
									<span class="unknown">?</span>
								{/if}
							</td>
							<td>
								<span
									class="status-badge"
									style="--status-color: {statusLabels[client.status]?.color || '#6b7280'}"
								>
									{statusLabels[client.status]?.label || client.status}
								</span>
							</td>
							<td>
								{#if client.trust_layer}
									<span
										class="trust-badge"
										style="--trust-color: {trustLabels[client.trust_layer]?.color || '#6b7280'}"
									>
										{trustLabels[client.trust_layer]?.label || client.trust_layer}
									</span>
								{:else}
									<span class="unknown">-</span>
								{/if}
							</td>
							<td class="center">
								{client.sessions?.[0]?.count || 0}
							</td>
							<td>
								{#if client.intake?.[0]?.status}
									<span class="intake-status intake-{client.intake[0].status}">
										{client.intake[0].status}
									</span>
								{:else}
									<span class="unknown">Not sent</span>
								{/if}
							</td>
							<td class="date-cell">
								{formatDate(client.created_at)}
							</td>
							<td class="actions-cell">
								<a href="/admin/consulting/clients/{client.id}" class="action-link"> View </a>
								<a href="/admin/consulting/sessions?client={client.id}" class="action-link">
									Sessions
								</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
</div>

<!-- Create Client Modal -->
{#if showCreateModal}
	<div class="modal-overlay" on:click|self={closeModal}>
		<div class="modal">
			<div class="modal-header">
				<h2>New Client</h2>
				<button class="close-btn" on:click={closeModal}>&times;</button>
			</div>

			<form
				method="POST"
				action="?/createClient"
				use:enhance={() => {
					isCreating = true;
					return async ({ result }) => {
						isCreating = false;
						if (result.type === 'success') {
							notifications.success('Client created successfully', 3000);
							closeModal();
							invalidateAll();
						} else if (result.type === 'failure') {
							notifications.danger(result.data?.error || 'Failed to create client', 3000);
						}
					};
				}}
			>
				<div class="form-grid">
					<div class="form-group">
						<label for="name">Name *</label>
						<input type="text" id="name" name="name" bind:value={newClientName} required />
					</div>

					<div class="form-group">
						<label for="email">Email *</label>
						<input type="email" id="email" name="email" bind:value={newClientEmail} required />
					</div>

					<div class="form-group">
						<label for="phone">Phone</label>
						<input type="tel" id="phone" name="phone" bind:value={newClientPhone} />
					</div>

					<div class="form-group">
						<label for="enneagramType">Enneagram Type</label>
						<select id="enneagramType" name="enneagramType" bind:value={newClientType}>
							<option value="">Unknown</option>
							{#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as type}
								<option value={type.toString()}>Type {type}</option>
							{/each}
						</select>
					</div>

					<div class="form-group">
						<label for="source">How did they find you?</label>
						<input
							type="text"
							id="source"
							name="source"
							bind:value={newClientSource}
							placeholder="e.g., referral, blog, social media"
						/>
					</div>

					<div class="form-group full-width">
						<label for="initialGoal">What do they want to work on?</label>
						<textarea
							id="initialGoal"
							name="initialGoal"
							bind:value={newClientGoal}
							rows="3"
							placeholder="Their stated goal or reason for reaching out..."
						></textarea>
					</div>
				</div>

				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" on:click={closeModal}> Cancel </button>
					<button type="submit" class="btn btn-primary" disabled={isCreating}>
						{isCreating ? 'Creating...' : 'Create Client'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.clients-page {
		max-width: 1200px;
		margin: 0 auto;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1.5rem;
	}

	.page-header h1 {
		font-size: 1.5rem;
		margin: 0 0 0.25rem;
	}

	.subtitle {
		color: var(--text-secondary);
		margin: 0;
		font-size: 0.875rem;
	}

	/* Filters */
	.filters-bar {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;
	}

	.search-box {
		flex: 1;
		min-width: 200px;
	}

	.search-box input {
		width: 100%;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		font-size: 0.875rem;
	}

	.filter-group {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.filter-group label {
		font-size: 0.8rem;
		color: var(--text-secondary);
	}

	.filter-group select {
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		font-size: 0.875rem;
		background: var(--card-background);
	}

	/* Table */
	.clients-table-wrapper {
		background: var(--card-background);
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		overflow-x: auto;
	}

	.clients-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.875rem;
	}

	.clients-table th {
		text-align: left;
		padding: 0.75rem;
		font-weight: 600;
		color: var(--text-secondary);
		font-size: 0.75rem;
		text-transform: uppercase;
		border-bottom: 1px solid var(--border-color);
		background: var(--hover-background);
	}

	.clients-table td {
		padding: 0.75rem;
		border-bottom: 1px solid var(--border-color);
	}

	.clients-table tbody tr:hover {
		background: var(--hover-background);
	}

	.client-cell {
		min-width: 200px;
	}

	.client-name {
		display: block;
		font-weight: 500;
		color: var(--primary);
		text-decoration: none;
	}

	.client-name:hover {
		text-decoration: underline;
	}

	.client-email {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	.type-badge {
		display: inline-block;
		background: rgba(99, 102, 241, 0.1);
		color: #6366f1;
		padding: 0.125rem 0.5rem;
		border-radius: 4px;
		font-weight: 600;
		font-size: 0.8rem;
	}

	.status-badge {
		display: inline-block;
		background: color-mix(in srgb, var(--status-color) 15%, transparent);
		color: var(--status-color);
		padding: 0.125rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.trust-badge {
		display: inline-block;
		background: color-mix(in srgb, var(--trust-color) 15%, transparent);
		color: var(--trust-color);
		padding: 0.125rem 0.5rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 500;
		text-transform: capitalize;
	}

	.intake-status {
		font-size: 0.75rem;
		padding: 0.125rem 0.375rem;
		border-radius: 4px;
		text-transform: capitalize;
	}

	.intake-pending {
		background: rgba(245, 158, 11, 0.1);
		color: #f59e0b;
	}
	.intake-sent {
		background: rgba(59, 130, 246, 0.1);
		color: #3b82f6;
	}
	.intake-completed {
		background: rgba(16, 185, 129, 0.1);
		color: #10b981;
	}
	.intake-reviewed {
		background: rgba(99, 102, 241, 0.1);
		color: #6366f1;
	}

	.unknown {
		color: var(--text-secondary);
		font-size: 0.8rem;
	}

	.center {
		text-align: center;
	}

	.date-cell {
		font-size: 0.8rem;
		color: var(--text-secondary);
		white-space: nowrap;
	}

	.actions-cell {
		white-space: nowrap;
	}

	.action-link {
		color: var(--primary);
		text-decoration: none;
		font-size: 0.8rem;
		margin-right: 0.75rem;
	}

	.action-link:hover {
		text-decoration: underline;
	}

	/* Empty State */
	.empty-state {
		text-align: center;
		padding: 3rem;
		color: var(--text-secondary);
	}

	.empty-state p {
		margin: 0 0 1rem;
	}

	/* Modal */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1rem;
	}

	.modal {
		background: var(--card-background);
		border-radius: var(--border-radius);
		width: 100%;
		max-width: 500px;
		max-height: 90vh;
		overflow-y: auto;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.5rem;
		border-bottom: 1px solid var(--border-color);
	}

	.modal-header h2 {
		margin: 0;
		font-size: 1.125rem;
	}

	.close-btn {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: var(--text-secondary);
		line-height: 1;
	}

	.form-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		padding: 1.5rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.form-group.full-width {
		grid-column: 1 / -1;
	}

	.form-group label {
		font-size: 0.8rem;
		font-weight: 500;
	}

	.form-group input,
	.form-group select,
	.form-group textarea {
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		font-size: 0.875rem;
		font-family: inherit;
	}

	.form-group textarea {
		resize: vertical;
	}

	.modal-footer {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
		padding: 1rem 1.5rem;
		border-top: 1px solid var(--border-color);
	}

	/* Buttons */
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: var(--border-radius);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		text-decoration: none;
	}

	.btn-primary {
		background: var(--primary);
		color: white;
	}

	.btn-secondary {
		background: var(--background);
		border: 1px solid var(--border-color);
		color: var(--text-primary);
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	@media (max-width: 768px) {
		.form-grid {
			grid-template-columns: 1fr;
		}

		.filters-bar {
			flex-direction: column;
		}

		.filter-group {
			width: 100%;
		}

		.filter-group select {
			flex: 1;
		}
	}
</style>
