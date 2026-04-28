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
	type ActivityQuestion = {
		id: number;
		question: string | null;
		question_formatted: string | null;
		url: string | null;
		created_at: string | null;
		comment_count: number | null;
		removed: boolean | null;
	};
	type ActivityComment = {
		id: number;
		source?: 'question' | 'blog';
		comment: string | null;
		created_at: string | null;
		parent_id: number | null;
		parent_type: string | null;
		like_count: number | null;
		comment_count: number | null;
		removed?: boolean | null;
		blog_link?: string | null;
		blog_type?: string | null;
		parentQuestion?: {
			id: number;
			question: string | null;
			question_formatted: string | null;
			url: string | null;
		} | null;
	};
	type UserActivityDetails = {
		profile: {
			id: string;
			email: string | null;
			username: string | null;
			first_name: string | null;
			last_name: string | null;
			enneagram: string | null;
			external_id: string | null;
			admin: boolean | null;
			canAskQuestion: boolean | null;
			avatar_url: string | null;
			created_at: string | null;
			website: string | null;
			first_visit_at?: string | null;
			first_landing_path?: string | null;
			first_acquisition_source?: string | null;
			first_referrer_host?: string | null;
			first_entry_surface?: string | null;
		};
		counts: {
			questions: number;
			comments: number;
			visits: number;
		};
		lastVisit: {
			last_seen_at: string | null;
			started_at: string | null;
			entry_path: string | null;
			exit_path: string | null;
			page_count: number | null;
		} | null;
		recentQuestions: ActivityQuestion[];
		recentComments: ActivityComment[];
	};
	type UserDetailsActionData = {
		success?: boolean;
		details?: UserActivityDetails;
		message?: string;
	};

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

	// User details state
	let detailProfile = $state<Profile | null>(null);
	let detailLoading = $state(false);
	let detailError = $state('');
	let detailData = $state<UserActivityDetails | null>(null);

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

	function displayName(profile: Partial<Profile> | null | undefined): string {
		const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ').trim();
		return fullName || profile?.username || 'Unnamed user';
	}

	function formatDateTime(dateStr: string | null | undefined): string {
		if (!dateStr) return '—';
		const date = new Date(dateStr);
		if (Number.isNaN(date.getTime())) return '—';
		return date.toLocaleString(undefined, {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	function getQuestionText(
		question: ActivityQuestion | ActivityComment['parentQuestion'] | null | undefined
	): string {
		return question?.question_formatted || question?.question || 'Untitled question';
	}

	function getActivityUrl(
		question: ActivityQuestion | ActivityComment['parentQuestion'] | null | undefined
	): string {
		return question?.url ? `/questions/${question.url}` : '/questions';
	}

	function getBlogUrl(blogLink: string | null | undefined): string {
		if (!blogLink) return '';
		if (blogLink.startsWith('/') || blogLink.startsWith('http')) return blogLink;
		return `/${blogLink}`;
	}

	async function openUserDetails(profile: Profile) {
		detailProfile = { ...profile };
		detailData = null;
		detailError = '';
		detailLoading = true;
		getModal('user-details-modal').open();

		try {
			const body = new FormData();
			body.append('userId', profile.id);

			const resp = await fetch('?/getUserDetails', {
				method: 'POST',
				body
			});
			const result = deserialize(await resp.text());
			const resultData =
				result.type === 'success' || result.type === 'failure'
					? (result.data as UserDetailsActionData | undefined)
					: undefined;

			if (result.type === 'success' && resultData?.success && resultData.details) {
				detailData = resultData.details;
			} else {
				detailError = resultData?.message || 'Could not load user details.';
			}
		} catch (error) {
			console.error('Error loading user details:', error);
			detailError = 'Could not load user details.';
		} finally {
			detailLoading = false;
		}
	}

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
										<div class="action-buttons">
											<button
												type="button"
												class="details-btn"
												onclick={() => openUserDetails(profile)}
											>
												Details
											</button>
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
										</div>
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

<Modal2 id="user-details-modal" maxWidth="840px">
	<div class="modal-content detail-modal-content">
		<h2 class="modal-title">User Details</h2>

		{#if detailProfile}
			<div class="modal-user-info detail-user-info">
				<div class="user-avatar">
					{#if detailProfile.enneagram}
						<span
							class="avatar-type"
							style="background: {typeColors[Number(detailProfile.enneagram)] ||
								'var(--text-tertiary)'}"
						>
							{detailProfile.enneagram}
						</span>
					{:else}
						<span class="avatar-placeholder">?</span>
					{/if}
				</div>
				<div class="user-details">
					<p class="user-email">{detailProfile.email}</p>
					<p class="user-name">{displayName(detailProfile)}</p>
				</div>
			</div>
		{/if}

		{#if detailLoading}
			<div class="loading-state">Loading user activity...</div>
		{:else if detailError}
			<div class="error-state">{detailError}</div>
		{:else if detailData}
			<div class="activity-stats">
				<div class="activity-stat">
					<span class="activity-stat-value">{detailData.counts.questions}</span>
					<span class="activity-stat-label">Questions</span>
				</div>
				<div class="activity-stat">
					<span class="activity-stat-value">{detailData.counts.comments}</span>
					<span class="activity-stat-label">Comments</span>
				</div>
				<div class="activity-stat">
					<span class="activity-stat-value">{detailData.counts.visits}</span>
					<span class="activity-stat-label">Visits</span>
				</div>
				<div class="activity-stat activity-stat-wide">
					<span class="activity-stat-value"
						>{formatDateTime(detailData.lastVisit?.last_seen_at)}</span
					>
					<span class="activity-stat-label">Last visit</span>
				</div>
			</div>

			<section class="detail-section">
				<h3>Profile Details</h3>
				<dl class="detail-grid">
					<div>
						<dt>Joined</dt>
						<dd>{formatDateTime(detailData.profile.created_at)}</dd>
					</div>
					<div>
						<dt>Last sign-in</dt>
						<dd>{formatDateTime(detailProfile?.last_sign_in_at)}</dd>
					</div>
					<div>
						<dt>First visit</dt>
						<dd>{formatDateTime(detailData.profile.first_visit_at)}</dd>
					</div>
					<div>
						<dt>Can ask question</dt>
						<dd>{detailData.profile.canAskQuestion ? 'Yes' : 'No'}</dd>
					</div>
					<div>
						<dt>Username</dt>
						<dd>{detailData.profile.username || '-'}</dd>
					</div>
					<div>
						<dt>External ID</dt>
						<dd>
							{#if detailData.profile.external_id}
								<a href="/users/{detailData.profile.external_id}" class="detail-link">
									{detailData.profile.external_id}
								</a>
							{:else}
								-
							{/if}
						</dd>
					</div>
					<div>
						<dt>Source</dt>
						<dd>{detailData.profile.first_acquisition_source || '-'}</dd>
					</div>
					<div>
						<dt>Entry surface</dt>
						<dd>{detailData.profile.first_entry_surface || '-'}</dd>
					</div>
					<div>
						<dt>Landing path</dt>
						<dd>{detailData.profile.first_landing_path || '-'}</dd>
					</div>
					<div>
						<dt>Referrer</dt>
						<dd>{detailData.profile.first_referrer_host || '-'}</dd>
					</div>
					<div>
						<dt>Latest entry path</dt>
						<dd>{detailData.lastVisit?.entry_path || '-'}</dd>
					</div>
					<div>
						<dt>Latest exit path</dt>
						<dd>{detailData.lastVisit?.exit_path || '-'}</dd>
					</div>
					<div>
						<dt>Latest session pages</dt>
						<dd>{detailData.lastVisit?.page_count ?? '-'}</dd>
					</div>
				</dl>
			</section>

			<section class="detail-section">
				<div class="detail-section-header">
					<h3>Questions Asked</h3>
					<span>{detailData.recentQuestions.length} of {detailData.counts.questions}</span>
				</div>
				{#if detailData.recentQuestions.length}
					<ul class="activity-list">
						{#each detailData.recentQuestions as question}
							<li>
								<a href={getActivityUrl(question)} class="activity-title">
									{getQuestionText(question)}
								</a>
								<div class="activity-meta">
									<span>{formatDateTime(question.created_at)}</span>
									<span>{question.comment_count ?? 0} comments</span>
									{#if question.removed}
										<span class="removed-label">Removed</span>
									{/if}
								</div>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="detail-empty">No questions asked yet.</p>
				{/if}
			</section>

			<section class="detail-section">
				<div class="detail-section-header">
					<h3>Comments Created</h3>
					<span>{detailData.recentComments.length} of {detailData.counts.comments}</span>
				</div>
				{#if detailData.recentComments.length}
					<ul class="activity-list">
						{#each detailData.recentComments as comment}
							<li>
								{#if comment.source === 'blog'}
									{#if comment.blog_link}
										<a href={getBlogUrl(comment.blog_link)} class="activity-title">
											{comment.blog_type || comment.blog_link}
										</a>
									{:else}
										<p class="activity-title">{comment.blog_type || 'Blog comment'}</p>
									{/if}
								{:else if comment.parentQuestion}
									<a href={getActivityUrl(comment.parentQuestion)} class="activity-title">
										{getQuestionText(comment.parentQuestion)}
									</a>
								{:else}
									<p class="activity-title">
										Parent {comment.parent_type || 'item'} #{comment.parent_id}
									</p>
								{/if}
								<p class="activity-body">{comment.comment || 'Empty comment'}</p>
								<div class="activity-meta">
									<span>{formatDateTime(comment.created_at)}</span>
									<span>{comment.source === 'blog' ? 'Blog' : 'Question'}</span>
									{#if comment.source !== 'blog'}
										<span>{comment.like_count ?? 0} likes</span>
									{/if}
									{#if comment.removed}
										<span class="removed-label">Removed</span>
									{/if}
								</div>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="detail-empty">No comments created yet.</p>
				{/if}
			</section>
		{/if}
	</div>
</Modal2>

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

	.action-buttons {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.edit-btn,
	.details-btn {
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

	.details-btn {
		color: var(--text-primary);
		border-color: var(--bg-elevated);
	}

	.edit-btn:hover,
	.details-btn:hover {
		background: var(--primary);
		color: white;
		border-color: var(--primary);
	}

	/* Modal Styles */
	.modal-content {
		max-width: 400px;
	}

	.detail-modal-content {
		max-width: 100%;
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
		border-radius: 8px;
		margin-bottom: 16px;
	}

	.detail-user-info {
		margin-bottom: 14px;
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
		border-radius: 8px;
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
		border-radius: 8px;
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

	.loading-state,
	.error-state,
	.detail-empty {
		padding: 14px;
		background: var(--bg-deep);
		border: 1px solid var(--bg-elevated);
		border-radius: 8px;
		color: var(--text-secondary);
		font-size: 0.8125rem;
	}

	.error-state {
		color: #dc2626;
		background: rgba(220, 38, 38, 0.08);
		border-color: rgba(220, 38, 38, 0.25);
	}

	.activity-stats {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 10px;
		margin-bottom: 18px;
	}

	.activity-stat {
		padding: 12px;
		background: var(--bg-deep);
		border: 1px solid var(--bg-elevated);
		border-radius: 8px;
		min-width: 0;
	}

	.activity-stat-value {
		display: block;
		font-size: 1rem;
		font-weight: 700;
		color: var(--text-primary);
		overflow-wrap: anywhere;
	}

	.activity-stat-label {
		display: block;
		margin-top: 4px;
		font-size: 0.6875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--text-secondary);
	}

	.detail-section {
		padding-top: 16px;
		margin-top: 16px;
		border-top: 1px solid var(--bg-elevated);
	}

	.detail-section h3,
	.detail-section-header h3 {
		margin: 0;
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.detail-section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 10px;
	}

	.detail-section-header span {
		color: var(--text-secondary);
		font-size: 0.75rem;
	}

	.detail-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
		margin: 10px 0 0;
	}

	.detail-grid div {
		min-width: 0;
		padding: 10px;
		background: var(--bg-deep);
		border: 1px solid var(--bg-elevated);
		border-radius: 8px;
	}

	.detail-grid dt {
		font-size: 0.6875rem;
		font-weight: 700;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.detail-grid dd {
		margin: 4px 0 0;
		color: var(--text-primary);
		font-size: 0.8125rem;
		overflow-wrap: anywhere;
	}

	.detail-link,
	.activity-title {
		color: var(--primary);
		text-decoration: none;
	}

	.detail-link:hover,
	.activity-title:hover {
		text-decoration: underline;
	}

	.activity-list {
		display: grid;
		gap: 10px;
		padding: 0;
		margin: 0;
		list-style: none;
	}

	.activity-list li {
		padding: 12px;
		background: var(--bg-deep);
		border: 1px solid var(--bg-elevated);
		border-radius: 8px;
	}

	.activity-title {
		display: block;
		margin: 0;
		font-size: 0.875rem;
		font-weight: 700;
		line-height: 1.35;
	}

	.activity-body {
		margin: 8px 0 0;
		color: var(--text-primary);
		font-size: 0.8125rem;
		line-height: 1.45;
		overflow-wrap: anywhere;
	}

	.activity-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 8px;
		color: var(--text-secondary);
		font-size: 0.6875rem;
	}

	.removed-label {
		color: #dc2626;
		font-weight: 700;
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

		.action-buttons {
			width: 100%;
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.edit-btn,
		.details-btn {
			width: 100%;
			justify-content: center;
		}

		.detail-modal-content {
			width: calc(100vw - 32px);
		}

		.activity-stats {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.activity-stat-wide {
			grid-column: span 2;
		}

		.detail-grid {
			grid-template-columns: 1fr;
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

		.activity-stats {
			grid-template-columns: 1fr;
		}

		.activity-stat-wide {
			grid-column: auto;
		}
	}
</style>
