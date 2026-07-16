<!-- src/routes/admin/comments/+page.svelte -->
<script lang="ts">
	import { deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';
	import { convertDateToReadable } from '../../../utils/conversions';
	import { notifications } from '$lib/components/molecules/notifications';
	import Spinner from '$lib/components/atoms/Spinner.svelte';
	import Modal from '$lib/components/atoms/Modal.svelte';
	import { getModal } from '$lib/components/atoms/Modal.svelte';
	import StatCard from '$lib/components/charts/StatCard.svelte';
	import { Button } from '$lib/components/atoms';

	type CommentActionPayload = {
		success?: boolean;
		message?: string;
		warning?: string;
	};

	let { data }: { data: PageData } = $props();

	// State variables
	let loading = $state(false);
	let currentCommentId = $state<number | null>(null);
	let actionType = $state<'remove' | 'unflag' | null>(null);
	let searchQuery = $state('');
	let activeTab = $state<'recent' | 'flagged' | 'blog'>('recent');
	let normalizedSearch = $derived(searchQuery.trim().toLowerCase());

	// Computed stats
	let flaggedCount = $derived(data.flaggedComments?.length ?? 0);
	let recentCount = $derived(data.comments?.length ?? 0);
	let blogCount = $derived(data.blogComments?.length ?? 0);
	let totalCount = $derived(flaggedCount + recentCount + blogCount);

	// Filtered comments based on search
	let filteredFlagged = $derived(
		(data.flaggedComments ?? []).filter((c) => {
			if (!normalizedSearch) return true;
			const comment = c?.comments?.comment?.toLowerCase() ?? '';
			const reason = c?.flag_reasons?.reason?.toLowerCase() ?? '';
			const description = c?.description?.toLowerCase() ?? '';
			const email = c?.profiles?.email?.toLowerCase() ?? '';
			return (
				comment.includes(normalizedSearch) ||
				reason.includes(normalizedSearch) ||
				description.includes(normalizedSearch) ||
				email.includes(normalizedSearch)
			);
		})
	);

	let filteredRecent = $derived(
		(data.comments ?? []).filter((c) => {
			if (!normalizedSearch) return true;
			const comment = c?.comment?.toLowerCase() ?? '';
			const email = c?.profiles?.email?.toLowerCase() ?? '';
			const question = (
				c?.parentQuestion?.question_formatted ||
				c?.parentQuestion?.question ||
				''
			).toLowerCase();
			const parentComment = c?.parentComment?.comment?.toLowerCase() ?? '';
			return (
				comment.includes(normalizedSearch) ||
				email.includes(normalizedSearch) ||
				question.includes(normalizedSearch) ||
				parentComment.includes(normalizedSearch)
			);
		})
	);

	let filteredBlog = $derived(
		(data.blogComments ?? []).filter((c) => {
			if (!normalizedSearch) return true;
			const comment = c?.comment?.toLowerCase() ?? '';
			const blogLink = c?.blog_link?.toLowerCase() ?? '';
			const email = c?.profiles?.email?.toLowerCase() ?? '';
			return (
				comment.includes(normalizedSearch) ||
				blogLink.includes(normalizedSearch) ||
				email.includes(normalizedSearch)
			);
		})
	);

	const truncate = (value: string | null | undefined, maxLength = 40) => {
		const text = value?.trim() || 'Unknown';
		return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
	};

	const submitCommentAction = async (
		action: 'removeComment' | 'unflagComment',
		commentId: number
	): Promise<CommentActionPayload> => {
		const body = new FormData();
		body.append('commentId', commentId.toString());

		const response = await fetch(`?/${action}`, {
			method: 'POST',
			body
		});
		const result = deserialize<CommentActionPayload, CommentActionPayload>(await response.text());

		if (response.ok && result.type === 'success' && result.data?.success) {
			return result.data;
		}

		const message =
			result.type === 'failure'
				? result.data?.message
				: result.type === 'error'
					? result.error?.message
					: undefined;
		throw new Error(message || 'The moderation action failed');
	};

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
			const result = await submitCommentAction('removeComment', commentId);
			await invalidateAll();
			if (result.warning) {
				notifications.warning(result.warning, 5000);
			} else {
				notifications.success('Comment removed successfully', 3000);
			}
		} catch (error: unknown) {
			console.error('Error removing comment:', error);
			const message = error instanceof Error ? error.message : 'Unknown error';
			notifications.danger(`Error removing comment: ${message}`, 3000);
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
			const result = await submitCommentAction('unflagComment', commentId);
			await invalidateAll();
			if (result.warning) {
				notifications.warning(result.warning, 5000);
			} else {
				notifications.success('Comment approved and unflagged', 3000);
			}
		} catch (error: unknown) {
			console.error('Error unflagging comment:', error);
			const message = error instanceof Error ? error.message : 'Unknown error';
			notifications.danger(`Error approving comment: ${message}`, 3000);
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

		<StatCard label="Recent" value={recentCount} icon="🕐" subValue="Question comments" />
		<StatCard
			label="Flagged"
			value={flaggedCount}
			icon="🚩"
			color={flaggedCount > 0 ? 'warning' : 'default'}
			subValue={data.demoTime
				? 'Hidden in demo mode'
				: flaggedCount > 0
					? 'Needs review'
					: 'All clear'}
		/>
		<StatCard
			label="Blog Comments"
			value={blogCount}
			icon="📝"
			color="success"
			subValue={data.demoTime ? 'Hidden in demo mode' : 'On blog posts'}
		/>
	</div>

	<!-- Search and Tabs -->
	<div class="controls-card">
		<div class="search-box">
			<input
				type="text"
				placeholder="Search comments..."
				aria-label="Search loaded comments"
				bind:value={searchQuery}
				class="search-input"
			/>
		</div>
		<div class="tabs">
			<button
				type="button"
				class="tab"
				class:active={activeTab === 'recent'}
				onclick={() => (activeTab = 'recent')}
			>
				Recent
				<span class="tab-badge">{recentCount}</span>
			</button>
			<button
				type="button"
				class="tab"
				class:active={activeTab === 'flagged'}
				onclick={() => (activeTab = 'flagged')}
			>
				Flagged
				{#if flaggedCount > 0}
					<span class="tab-badge warning">{flaggedCount}</span>
				{/if}
			</button>

			<button
				type="button"
				class="tab"
				class:active={activeTab === 'blog'}
				onclick={() => (activeTab = 'blog')}
			>
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
						{#each filteredFlagged as comment (comment.id)}
							<div class="comment-item flagged">
								<div class="comment-body">
									{#if comment?.comments}
										<p class="comment-text">{comment.comments.comment}</p>
										<div class="flag-info">
											<div class="flag-detail">
												<span class="flag-label">Flag Reason:</span>
												<span>{comment.flag_reasons?.reason || 'Other'}</span>
											</div>
											{#if comment.description?.trim()}
												<div class="flag-detail">
													<span class="flag-label">Details:</span>
													<span>{comment.description}</span>
												</div>
											{/if}
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
										<Button
											size="sm"
											onclick={() => {
												if (comment?.comments?.id) confirmAction(comment.comments.id, 'unflag');
											}}
											disabled={loading || !comment?.comments?.id}
										>
											Approve
										</Button>
										<Button
											size="sm"
											variant="danger"
											onclick={() => {
												if (comment?.comments?.id) confirmAction(comment.comments.id, 'remove');
											}}
											disabled={loading || !comment?.comments?.id}
										>
											Remove
										</Button>
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
						<p>
							{data.demoTime
								? 'Live flagged comments are hidden in demo mode'
								: `No flagged comments${normalizedSearch ? ' matching your search' : ''}`}
						</p>
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
						{#each filteredRecent as comment (comment.id)}
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
											<a href="/questions/{comment?.parentQuestion?.url}" class="meta-link">
												Q: {truncate(
													comment.parentQuestion.question_formatted ||
														comment.parentQuestion.question
												)}
											</a>
										{:else if comment?.parentComment}
											<span class="meta-text"
												>Reply to: {truncate(comment.parentComment.comment)}</span
											>
										{/if}
										{#if comment?.profiles?.external_id}
											<a href="/users/{comment.profiles.external_id}" class="meta-link">
												{comment.profiles.email || 'Unknown user'}
											</a>
										{:else}
											<span class="meta-text">Anonymous</span>
										{/if}
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
						<p>No comments{normalizedSearch ? ' matching your search' : ''}</p>
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
						{#each filteredBlog as blogComment (blogComment.id)}
							<div class="comment-item">
								<div class="comment-body">
									<p class="comment-text">{blogComment?.comment || 'No comment text'}</p>
								</div>
								<div class="comment-footer">
									<div class="comment-meta">
										{#if blogComment.blog_type && blogComment.blog_link}
											<a href="/{blogComment.blog_type}/{blogComment.blog_link}" class="meta-link">
												{blogComment.blog_link.replace(/-/g, ' ')}
											</a>
										{:else}
											<span class="meta-text">Unknown blog</span>
										{/if}
										{#if blogComment?.profiles?.external_id}
											<a href="/users/{blogComment.profiles.external_id}" class="meta-link">
												{blogComment.profiles.email || 'Unknown user'}
											</a>
										{:else}
											<span class="meta-text">Anonymous</span>
										{/if}
									</div>
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
						<p>
							{data.demoTime
								? 'Live blog comments are hidden in demo mode'
								: `No blog comments${normalizedSearch ? ' matching your search' : ''}`}
						</p>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	{#if data.currentPage > 0 || data.hasMore}
		<nav class="pagination" aria-label="Comment pages">
			<a
				class:disabled={data.currentPage === 0}
				aria-disabled={data.currentPage === 0}
				href={data.currentPage === 0
					? undefined
					: data.currentPage === 1
						? '/admin/comments'
						: `?page=${data.currentPage - 1}`}
			>
				Previous
			</a>
			<span>Page {data.currentPage + 1}</span>
			<a
				class:disabled={!data.hasMore}
				aria-disabled={!data.hasMore}
				href={data.hasMore ? `?page=${data.currentPage + 1}` : undefined}
			>
				Next
			</a>
		</nav>
	{/if}

	<!-- Confirmation Modal -->
	<Modal id="confirmation-modal" name="Confirm comment action">
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
				<Button variant="secondary" onclick={cancelAction} disabled={loading}>Cancel</Button>
				<Button
					variant={actionType === 'remove' ? 'danger' : 'primary'}
					onclick={executeAction}
					{loading}
				>
					{actionType === 'remove' ? 'Remove' : 'Approve'}
				</Button>
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
		background: var(--stone-warm);
		border: 1px solid var(--stone-warm);
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
		border: 1px solid var(--stone-warm);
		border-radius: 0.625rem;
		font-size: 0.8125rem;
		background: var(--stone-warm);
		transition:
			border-color 0.15s,
			box-shadow 0.15s;
	}

	.search-input:focus {
		outline: none;
		border-color: var(--lamp-glow);
		box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
	}

	.tabs {
		display: flex;
		gap: 2px;
		background: var(--night-deep);
		padding: 3px;
		border-radius: 0.625rem;
	}

	.tab {
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 6px 12px;
		border: none;
		background: transparent;
		border-radius: 0.625rem;
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--ink-mid);
		cursor: pointer;
		transition: all 0.15s;
	}

	.tab:hover {
		color: var(--ink-bright);
	}

	.tab.active {
		background: var(--stone-warm);
		color: var(--ink-bright);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
	}

	.tab-badge {
		font-size: 0.625rem;
		padding: 1px 5px;
		border-radius: 9999px;
		background: var(--stone-warm);
		color: var(--ink-mid);
	}

	.tab-badge.warning {
		background: color-mix(in srgb, var(--warning) 18%, transparent);
		color: var(--warning);
	}

	/* Content Card */
	.content-card {
		background: var(--stone-warm);
		border: 1px solid var(--stone-warm);
		border-radius: 10px;
		overflow: hidden;
	}

	.card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 16px;
		border-bottom: 1px solid var(--stone-warm);
		background: var(--night-deep);
	}

	.card-header h2 {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--ink-bright);
		margin: 0;
	}

	.header-badge {
		font-size: 0.6875rem;
		padding: 3px 8px;
		border-radius: 10px;
		background: var(--stone-warm);
		color: var(--ink-mid);
	}

	.header-badge.warning {
		background: color-mix(in srgb, var(--warning) 18%, transparent);
		color: var(--warning);
	}

	.header-badge.success {
		background: color-mix(in srgb, var(--success) 18%, transparent);
		color: var(--success-text);
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
		border-bottom: 1px solid var(--stone-warm);
		transition: background-color 0.15s;
	}

	.comment-item:last-child {
		border-bottom: none;
	}

	.comment-item:hover {
		background: var(--night-deep);
	}

	.comment-item.flagged {
		border-left: 3px solid var(--warning);
		background: color-mix(in srgb, var(--warning) 6%, transparent);
	}

	.comment-item.removed {
		border-left: 3px solid var(--error);
		background: color-mix(in srgb, var(--error) 6%, transparent);
	}

	.comment-body {
		margin-bottom: 10px;
	}

	.comment-text {
		font-size: 0.8125rem;
		color: var(--ink-bright);
		line-height: 1.5;
		margin: 0;
	}

	.comment-text.error {
		color: var(--error-text);
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
		background: color-mix(in srgb, var(--error) 18%, transparent);
		color: var(--error-text);
	}

	.flag-info {
		margin-top: 8px;
		padding: 8px 10px;
		background: var(--night-deep);
		border-radius: 0.625rem;
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
		color: var(--ink-mid);
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
		color: var(--lamp-glow);
		text-decoration: none;
		transition: color 0.15s;
	}

	.meta-link:hover {
		color: var(--lamp-glow);
		text-decoration: underline;
	}

	.meta-text {
		font-size: 0.75rem;
		color: var(--ink-mid);
	}

	.comment-date {
		font-size: 0.6875rem;
		color: var(--ink-mid);
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
		color: var(--ink-mid);
		margin: 0;
		font-size: 0.8125rem;
	}

	.pagination {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 14px;
		margin-top: 18px;
		font-size: 0.8125rem;
		color: var(--ink-mid);
	}

	.pagination a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 40px;
		padding: 8px 14px;
		border: 1px solid var(--stone-edge);
		border-radius: 0.625rem;
		color: var(--lamp-glow);
		text-decoration: none;
	}

	.pagination a:hover:not(.disabled) {
		background: var(--stone-mid);
	}

	.pagination a.disabled {
		opacity: 0.45;
		pointer-events: none;
	}

	/* Loading Overlay */
	.loading-overlay {
		position: fixed;
		inset: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.5);
	}

	.loading-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		background: var(--stone-warm);
		padding: 20px 28px;
		border-radius: 10px;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
	}

	.loading-content p {
		margin-top: 12px;
		color: var(--ink-mid);
		font-size: 0.8125rem;
	}

	/* Modal */
	.modal-content {
		padding: 20px;
	}

	.modal-title {
		font-size: 1rem;
		font-weight: 600;
		color: var(--ink-bright);
		margin: 0 0 10px 0;
	}

	.modal-text {
		color: var(--ink-mid);
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
			border-radius: 1rem;
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
			border-radius: 1rem;
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

		.card-content {
			max-height: 400px;
		}
	}
</style>
