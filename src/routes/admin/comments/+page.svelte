<!-- src/routes/admin/comments/+page.svelte -->
<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';
	import { convertDateToReadable } from '../../../utils/conversions';
	import { notifications } from '$lib/components/molecules/notifications';
	import Spinner from '$lib/components/atoms/Spinner.svelte';
	import Modal from '$lib/components/atoms/Modal2.svelte';
	import { getModal } from '$lib/components/atoms/Modal2.svelte';
	import StatCard from '$lib/components/charts/StatCard.svelte';

	export let data: PageData;

	// State variables
	let loading = false;
	let currentCommentId: number | null = null;
	let actionType: 'remove' | 'unflag' | null = null;
	let searchQuery = '';
	let activeTab: 'flagged' | 'recent' | 'blog' = 'flagged';

	// Computed stats
	$: flaggedCount = data.flaggedComments?.length ?? 0;
	$: recentCount = data.comments?.length ?? 0;
	$: blogCount = data.blogComments?.length ?? 0;
	$: totalCount = flaggedCount + recentCount + blogCount;

	// Filtered comments based on search
	$: filteredFlagged = (data.flaggedComments ?? []).filter((c) => {
		if (!searchQuery) return true;
		const comment = c?.comments?.comment?.toLowerCase() ?? '';
		const reason = c?.description?.toLowerCase() ?? '';
		const email = c?.profiles?.email?.toLowerCase() ?? '';
		return (
			comment.includes(searchQuery.toLowerCase()) ||
			reason.includes(searchQuery.toLowerCase()) ||
			email.includes(searchQuery.toLowerCase())
		);
	});

	$: filteredRecent = (data.comments ?? []).filter((c) => {
		if (!searchQuery) return true;
		const comment = c?.comment?.toLowerCase() ?? '';
		const email = c?.profiles?.email?.toLowerCase() ?? '';
		const question = c?.parentQuestion?.question_formatted?.toLowerCase() ?? '';
		return (
			comment.includes(searchQuery.toLowerCase()) ||
			email.includes(searchQuery.toLowerCase()) ||
			question.includes(searchQuery.toLowerCase())
		);
	});

	$: filteredBlog = (data.blogComments ?? []).filter((c) => {
		if (!searchQuery) return true;
		const comment = c?.comment?.toLowerCase() ?? '';
		const blogLink = c?.blog_link?.toLowerCase() ?? '';
		return (
			comment.includes(searchQuery.toLowerCase()) || blogLink.includes(searchQuery.toLowerCase())
		);
	});

	// Set up action confirmation
	const confirmAction = (id: number, type: 'remove' | 'unflag') => {
		currentCommentId = id;
		actionType = type;
		getModal('confirmation-modal').open();
	};

	// Handle comment removal
	const removeComment = async (commentId: number) => {
		if (!commentId) return;

		loading = true;
		try {
			const body = new FormData();
			body.append('commentId', commentId.toString());

			const response = await fetch(`?/removeComment`, {
				method: 'POST',
				body
			});

			if (!response.ok) {
				throw new Error('Failed to remove comment');
			}

			const result = await response.json();
			if (result.success) {
				notifications.success('Comment removed successfully', 3000);
				await invalidateAll();
			} else {
				throw new Error(result.message || 'Failed to remove comment');
			}
		} catch (error: any) {
			console.error('Error removing comment:', error);
			notifications.danger('Error removing comment: ' + (error.message || 'Unknown error'), 3000);
		} finally {
			loading = false;
			currentCommentId = null;
			actionType = null;
		}
	};

	// Handle comment unflagging
	const unflagComment = async (commentId: number) => {
		if (!commentId) return;

		loading = true;
		try {
			const body = new FormData();
			body.append('commentId', commentId.toString());

			const response = await fetch(`?/unflagComment`, {
				method: 'POST',
				body
			});

			if (!response.ok) {
				throw new Error('Failed to unflag comment');
			}

			const result = await response.json();
			if (result.success) {
				notifications.success('Comment approved and unflagged', 3000);
				await invalidateAll();
			} else {
				throw new Error(result.message || 'Failed to unflag comment');
			}
		} catch (error: any) {
			console.error('Error unflagging comment:', error);
			notifications.danger('Error approving comment: ' + (error.message || 'Unknown error'), 3000);
		} finally {
			loading = false;
			currentCommentId = null;
			actionType = null;
		}
	};

	// Execute the confirmed action
	const executeAction = async () => {
		if (!currentCommentId || !actionType) return;

		if (actionType === 'remove') {
			await removeComment(currentCommentId);
		} else if (actionType === 'unflag') {
			await unflagComment(currentCommentId);
		}

		getModal('confirmation-modal').close();
	};

	// Cancel the action and close modal
	const cancelAction = () => {
		currentCommentId = null;
		actionType = null;
		getModal('confirmation-modal').close();
	};
</script>

<div class="admin-comments">
	<!-- Page Header -->
	<div class="page-header">
		<h1>Comments</h1>
		<p class="subtitle">Review and moderate user comments</p>
	</div>

	<!-- Loading Overlay -->
	{#if loading}
		<div class="loading-overlay">
			<div class="loading-content">
				<Spinner size="lg" />
				<p>Processing request...</p>
			</div>
		</div>
	{/if}

	<!-- Stats Grid -->
	<div class="stats-grid">
		<StatCard
			label="Total Comments"
			value={totalCount}
			icon="💬"
			color="primary"
			subValue="Loaded on this page"
		/>
		<StatCard
			label="Flagged"
			value={flaggedCount}
			icon="🚩"
			color={flaggedCount > 0 ? 'warning' : 'default'}
			subValue={flaggedCount > 0 ? 'Needs review' : 'All clear'}
		/>
		<StatCard label="Recent" value={recentCount} icon="🕐" subValue="Question comments" />
		<StatCard label="Blog Comments" value={blogCount} icon="📝" color="success" subValue="On blog posts" />
	</div>

	<!-- Search and Tabs -->
	<div class="controls-card">
		<div class="search-box">
			<input
				type="text"
				placeholder="Search comments..."
				bind:value={searchQuery}
				class="search-input"
			/>
		</div>
		<div class="tabs">
			<button
				class="tab"
				class:active={activeTab === 'flagged'}
				on:click={() => (activeTab = 'flagged')}
			>
				Flagged
				{#if flaggedCount > 0}
					<span class="tab-badge warning">{flaggedCount}</span>
				{/if}
			</button>
			<button
				class="tab"
				class:active={activeTab === 'recent'}
				on:click={() => (activeTab = 'recent')}
			>
				Recent
				<span class="tab-badge">{recentCount}</span>
			</button>
			<button class="tab" class:active={activeTab === 'blog'} on:click={() => (activeTab = 'blog')}>
				Blog
				<span class="tab-badge">{blogCount}</span>
			</button>
		</div>
	</div>

	<!-- Flagged Comments Section -->
	{#if activeTab === 'flagged'}
		<div class="content-card">
			<div class="card-header">
				<h2>Flagged Comments</h2>
				<span class="header-badge warning">{filteredFlagged.length} items</span>
			</div>
			<div class="card-content">
				{#if filteredFlagged.length > 0}
					<div class="comments-list">
						{#each filteredFlagged as comment}
							<div class="comment-item flagged">
								<div class="comment-body">
									{#if comment?.comments}
										<p class="comment-text">{comment.comments.comment}</p>
										<div class="flag-info">
											<div class="flag-detail">
												<span class="flag-label">Flag Reason:</span>
												<span>{comment.description || 'No description provided'}</span>
											</div>
											<div class="flag-detail">
												<span class="flag-label">Reported By:</span>
												<span>{comment?.profiles?.email || 'Anonymous'}</span>
											</div>
										</div>
									{:else}
										<p class="comment-text error">Comment data unavailable</p>
									{/if}
								</div>
								<div class="comment-footer">
									<div class="comment-actions">
										<button
											class="btn btn-success"
											on:click={() => confirmAction(comment?.comments?.id, 'unflag')}
											disabled={loading || !comment?.comments?.id}
										>
											Approve
										</button>
										<button
											class="btn btn-danger"
											on:click={() => confirmAction(comment?.comments?.id, 'remove')}
											disabled={loading || !comment?.comments?.id}
										>
											Remove
										</button>
									</div>
									<span class="comment-date">
										{convertDateToReadable(comment.created_at ?? '')}
									</span>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="empty-state">
						<span class="empty-icon">✓</span>
						<p>No flagged comments{searchQuery ? ' matching your search' : ''}</p>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Recent Comments Section -->
	{#if activeTab === 'recent'}
		<div class="content-card">
			<div class="card-header">
				<h2>Recent Comments</h2>
				<span class="header-badge">{filteredRecent.length} items</span>
			</div>
			<div class="card-content">
				{#if filteredRecent.length > 0}
					<div class="comments-list">
						{#each filteredRecent as comment}
							<div class="comment-item" class:removed={comment.removed}>
								<div class="comment-body">
									<p class="comment-text">
										{comment?.comment || 'No comment text'}
										{#if comment.removed}
											<span class="status-badge removed">Removed</span>
										{/if}
									</p>
								</div>
								<div class="comment-footer">
									<div class="comment-meta">
										{#if comment?.parentQuestion}
											<a
												href="/questions/{comment?.parentQuestion?.url}"
												class="meta-link"
											>
												Q: {(comment?.parentQuestion?.question_formatted || '').slice(0, 40)}...
											</a>
										{/if}
										<a
											href="/users/{comment?.profiles?.external_id}"
											class="meta-link"
										>
											{comment?.profiles?.email || 'Anonymous'}
										</a>
									</div>
									<span class="comment-date">
										{convertDateToReadable(comment.created_at ?? '')}
									</span>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="empty-state">
						<span class="empty-icon">💬</span>
						<p>No comments{searchQuery ? ' matching your search' : ''}</p>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Blog Comments Section -->
	{#if activeTab === 'blog'}
		<div class="content-card">
			<div class="card-header">
				<h2>Blog Comments</h2>
				<span class="header-badge success">{filteredBlog.length} items</span>
			</div>
			<div class="card-content">
				{#if filteredBlog.length > 0}
					<div class="comments-list">
						{#each filteredBlog as blogComment}
							<div class="comment-item">
								<div class="comment-body">
									<p class="comment-text">{blogComment?.comment || 'No comment text'}</p>
								</div>
								<div class="comment-footer">
									<a
										href="/{blogComment.blog_type}/{blogComment?.blog_link}"
										class="meta-link"
									>
										{blogComment?.blog_link?.replace(/-/g, ' ') ?? 'Unknown blog'}
									</a>
									<span class="comment-date">
										{convertDateToReadable(blogComment.created_at ?? '')}
									</span>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="empty-state">
						<span class="empty-icon">📝</span>
						<p>No blog comments{searchQuery ? ' matching your search' : ''}</p>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Confirmation Modal -->
	<Modal id="confirmation-modal">
		<div class="modal-content">
			<h3 class="modal-title">
				{actionType === 'remove' ? 'Remove Comment' : 'Approve Comment'}
			</h3>
			<p class="modal-text">
				{#if actionType === 'remove'}
					Are you sure you want to remove this comment? This action cannot be undone.
				{:else if actionType === 'unflag'}
					Are you sure you want to approve this comment and remove the flag?
				{:else}
					Confirm this action?
				{/if}
			</p>
			<div class="modal-actions">
				<button class="btn btn-secondary" on:click={cancelAction}>
					Cancel
				</button>
				<button
					class="btn {actionType === 'remove' ? 'btn-danger' : 'btn-success'}"
					on:click={executeAction}
				>
					{actionType === 'remove' ? 'Remove' : 'Approve'}
				</button>
			</div>
		</div>
	</Modal>
</div>

<style>
	.admin-comments {
		width: 100%;
	}

	/* Stats Grid */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 12px;
		margin-bottom: 20px;
	}

	/* Controls Card */
	.controls-card {
		background: var(--card-background, #fff);
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 10px;
		padding: 12px 14px;
		margin-bottom: 20px;
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		align-items: center;
		justify-content: space-between;
	}

	.search-box {
		flex: 1;
		min-width: 160px;
	}

	.search-input {
		width: 100%;
		padding: 8px 12px;
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 6px;
		font-size: 0.8125rem;
		background: var(--card-background, #fff);
		transition: border-color 0.15s, box-shadow 0.15s;
	}

	.search-input:focus {
		outline: none;
		border-color: var(--primary, #6366f1);
		box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
	}

	.tabs {
		display: flex;
		gap: 2px;
		background: var(--hover-background, #f1f5f9);
		padding: 3px;
		border-radius: 6px;
	}

	.tab {
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 6px 12px;
		border: none;
		background: transparent;
		border-radius: 5px;
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--text-secondary, #64748b);
		cursor: pointer;
		transition: all 0.15s;
	}

	.tab:hover {
		color: var(--text-primary, #1e293b);
	}

	.tab.active {
		background: var(--card-background, #fff);
		color: var(--text-primary, #1e293b);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
	}

	.tab-badge {
		font-size: 0.625rem;
		padding: 1px 5px;
		border-radius: 8px;
		background: var(--border-color, #e2e8f0);
		color: var(--text-secondary, #64748b);
	}

	.tab-badge.warning {
		background: rgba(245, 158, 11, 0.15);
		color: #d97706;
	}

	/* Content Card */
	.content-card {
		background: var(--card-background, #fff);
		border: 1px solid var(--border-color, #e2e8f0);
		border-radius: 10px;
		overflow: hidden;
	}

	.card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 16px;
		border-bottom: 1px solid var(--border-color, #e2e8f0);
		background: var(--hover-background, #f8fafc);
	}

	.card-header h2 {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-primary, #1e293b);
		margin: 0;
	}

	.header-badge {
		font-size: 0.6875rem;
		padding: 3px 8px;
		border-radius: 10px;
		background: var(--border-color, #e2e8f0);
		color: var(--text-secondary, #64748b);
	}

	.header-badge.warning {
		background: rgba(245, 158, 11, 0.15);
		color: #d97706;
	}

	.header-badge.success {
		background: rgba(16, 185, 129, 0.15);
		color: #059669;
	}

	.card-content {
		max-height: 500px;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
	}

	/* Comments List */
	.comments-list {
		display: flex;
		flex-direction: column;
	}

	.comment-item {
		padding: 12px 16px;
		border-bottom: 1px solid var(--border-color, #e2e8f0);
		transition: background-color 0.15s;
	}

	.comment-item:last-child {
		border-bottom: none;
	}

	.comment-item:hover {
		background: var(--hover-background, #f8fafc);
	}

	.comment-item.flagged {
		border-left: 3px solid #f59e0b;
		background: rgba(245, 158, 11, 0.05);
	}

	.comment-item.removed {
		border-left: 3px solid #ef4444;
		background: rgba(239, 68, 68, 0.05);
	}

	.comment-body {
		margin-bottom: 10px;
	}

	.comment-text {
		font-size: 0.8125rem;
		color: var(--text-primary, #1e293b);
		line-height: 1.5;
		margin: 0;
	}

	.comment-text.error {
		color: #dc2626;
		font-style: italic;
	}

	.status-badge {
		display: inline-block;
		font-size: 0.625rem;
		padding: 2px 6px;
		border-radius: 4px;
		margin-left: 6px;
		font-weight: 500;
	}

	.status-badge.removed {
		background: rgba(239, 68, 68, 0.15);
		color: #dc2626;
	}

	.flag-info {
		margin-top: 8px;
		padding: 8px 10px;
		background: var(--hover-background, #f1f5f9);
		border-radius: 6px;
		font-size: 0.75rem;
	}

	.flag-detail {
		display: flex;
		gap: 6px;
		margin-bottom: 3px;
	}

	.flag-detail:last-child {
		margin-bottom: 0;
	}

	.flag-label {
		font-weight: 600;
		color: var(--text-secondary, #64748b);
	}

	.comment-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 10px;
	}

	.comment-actions {
		display: flex;
		gap: 6px;
	}

	.comment-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.meta-link {
		font-size: 0.75rem;
		color: var(--primary, #6366f1);
		text-decoration: none;
		transition: color 0.15s;
	}

	.meta-link:hover {
		color: var(--primary-dark, #4f46e5);
		text-decoration: underline;
	}

	.comment-date {
		font-size: 0.6875rem;
		color: var(--text-secondary, #64748b);
	}

	/* Buttons */
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		padding: 6px 12px;
		border: none;
		border-radius: 5px;
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s;
	}

	.btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-success {
		background: #10b981;
		color: white;
	}

	.btn-success:hover:not(:disabled) {
		background: #059669;
	}

	.btn-danger {
		background: #ef4444;
		color: white;
	}

	.btn-danger:hover:not(:disabled) {
		background: #dc2626;
	}

	.btn-secondary {
		background: var(--border-color, #e2e8f0);
		color: var(--text-primary, #1e293b);
	}

	.btn-secondary:hover:not(:disabled) {
		background: var(--hover-background, #cbd5e1);
	}

	/* Empty State */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 40px 16px;
		text-align: center;
	}

	.empty-icon {
		font-size: 2rem;
		margin-bottom: 10px;
		opacity: 0.6;
	}

	.empty-state p {
		color: var(--text-secondary, #64748b);
		margin: 0;
		font-size: 0.8125rem;
	}

	/* Loading Overlay */
	.loading-overlay {
		position: fixed;
		inset: 0;
		z-index: 50;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.5);
	}

	.loading-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		background: var(--card-background, #fff);
		padding: 20px 28px;
		border-radius: 10px;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
	}

	.loading-content p {
		margin-top: 12px;
		color: var(--text-secondary, #64748b);
		font-size: 0.8125rem;
	}

	/* Modal */
	.modal-content {
		padding: 20px;
	}

	.modal-title {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary, #1e293b);
		margin: 0 0 10px 0;
	}

	.modal-text {
		color: var(--text-secondary, #64748b);
		margin: 0 0 20px 0;
		line-height: 1.5;
		font-size: 0.8125rem;
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 10px;
	}

	/* Mobile */
	@media (max-width: 768px) {
		.stats-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 8px;
			margin-bottom: 16px;
		}

		.controls-card {
			padding: 10px 12px;
			margin-bottom: 16px;
			gap: 10px;
			border-radius: 8px;
		}

		.search-input {
			font-size: 0.75rem;
			padding: 8px 10px;
		}

		.tabs {
			padding: 2px;
		}

		.tab {
			padding: 6px 10px;
			font-size: 0.6875rem;
		}

		.tab-badge {
			font-size: 0.5625rem;
			padding: 1px 4px;
		}

		.content-card {
			border-radius: 8px;
		}

		.card-header {
			padding: 10px 12px;
		}

		.card-header h2 {
			font-size: 0.75rem;
		}

		.comment-item {
			padding: 10px 12px;
		}

		.comment-text {
			font-size: 0.75rem;
		}

		.flag-info {
			padding: 6px 8px;
			font-size: 0.6875rem;
		}

		.btn {
			padding: 6px 10px;
			font-size: 0.6875rem;
		}
	}

	/* Extra small screens */
	@media (max-width: 480px) {
		.stats-grid {
			gap: 6px;
		}

		.controls-card {
			flex-direction: column;
			align-items: stretch;
			padding: 8px 10px;
		}

		.tabs {
			justify-content: center;
		}

		.comment-footer {
			flex-direction: column;
			align-items: stretch;
			gap: 8px;
		}

		.comment-actions {
			width: 100%;
		}

		.btn {
			flex: 1;
			justify-content: center;
		}

		.card-content {
			max-height: 400px;
		}
	}
</style>
