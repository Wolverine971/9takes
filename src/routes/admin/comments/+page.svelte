<!-- src/routes/admin/comments/+page.svelte -->
<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';
	import { convertDateToReadable } from '../../../utils/conversions';
	import { notifications } from '$lib/components/molecules/notifications';
	import Spinner from '$lib/components/atoms/Spinner.svelte';
	import Modal from '$lib/components/atoms/Modal2.svelte';
	import { getModal } from '$lib/components/atoms/Modal2.svelte';

	export let data: PageData;

	// State variables
	let loading = false;
	let currentCommentId: number | null = null;
	let actionType: 'remove' | 'unflag' | null = null;

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
		} catch (error) {
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
		} catch (error) {
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

	// Check if comment data is missing or empty
	const isEmptyData = (data: any[]) => {
		return !data || data.length === 0;
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
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div class="flex flex-col items-center rounded-lg bg-white p-6 shadow-lg">
				<Spinner size="lg" />
				<p class="mt-4 text-neutral-700">Processing request...</p>
			</div>
		</div>
	{/if}

	<!-- Flagged Comments Section -->
	<div class="section-card">
		<h2 class="section-title flex items-center">
			<span class="mr-2 inline-block h-4 w-4 rounded-full bg-warning-500"></span>
			Flagged Comments
		</h2>

		{#if !isEmptyData(data.flaggedComments)}
			<div class="max-h-96 space-y-4 overflow-y-auto">
				{#each data.flaggedComments as comment}
					<div
						class="rounded-lg border border-warning-500 bg-warning-50 p-4 shadow-sm transition-all hover:shadow-md"
					>
						<div class="md:mb-3">
							{#if comment?.comments}
								<p class="mb-2 text-neutral-800">{comment.comments.comment}</p>
								<div class="space-y-1 rounded-md bg-neutral-100 p-2 text-sm text-neutral-600">
									<p>
										<span class="font-semibold">Flag Reason:</span>
										{comment.description || 'No description provided'}
									</p>
									<p>
										<span class="font-semibold">Reported By:</span>
										{comment?.profiles?.email || 'Anonymous'}
									</p>
								</div>
							{:else}
								<p class="text-error-600 italic">Comment data unavailable</p>
							{/if}
						</div>
						<div class="flex flex-wrap items-center justify-between gap-2">
							<div class="flex flex-wrap gap-2">
								<button
									class="hover:bg-success-600 flex items-center rounded bg-success-500 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-success-500 focus:ring-offset-2"
									on:click={() => confirmAction(comment?.comments?.id, 'unflag')}
									disabled={loading || !comment?.comments?.id}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="mr-1 h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M5 13l4 4L19 7"
										/>
									</svg>
									Approve
								</button>
								<button
									class="hover:bg-error-600 flex items-center rounded bg-error-500 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2"
									on:click={() => confirmAction(comment?.comments?.id, 'remove')}
									disabled={loading || !comment?.comments?.id}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="mr-1 h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
										/>
									</svg>
									Remove
								</button>
							</div>
							<div class="flex items-center text-sm text-neutral-500">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="mr-1 h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								{convertDateToReadable(comment.created_at)}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-center">
				<p class="text-neutral-600">No flagged comments</p>
			</div>
		{/if}
	</div>

	<!-- Regular Comments Section -->
	{#if !isEmptyData(data.comments)}
		<div class="section-card">
			<h2 class="section-title flex items-center">
				<span class="mr-2 inline-block h-4 w-4 rounded-full bg-info-500"></span>
				Recent Comments
			</h2>
			<div class="max-h-96 space-y-4 overflow-y-auto">
				{#each data.comments as comment}
					<div
						class="rounded-lg border border-neutral-200 p-4 shadow-sm transition-all hover:shadow-md {comment.removed
							? 'bg-error-50'
							: 'bg-white'}"
					>
						<p class="mb-3 text-neutral-800 {comment.removed ? 'text-error-700' : ''}">
							{comment?.comment || 'No comment text'}
							{#if comment.removed}
								<span
									class="ml-2 rounded bg-error-100 px-2 py-0.5 text-xs font-medium text-error-700"
									>Removed</span
								>
							{/if}
						</p>
						<div class="flex flex-wrap items-center justify-between gap-2 text-sm">
							<div class="flex flex-wrap items-center gap-x-4 gap-y-1">
								{#if comment?.parentQuestion}
									<a
										href="/questions/{comment?.parentQuestion?.url}"
										class="flex items-center text-primary-700 transition-colors hover:text-primary-800"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="mr-1 h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										{(comment?.parentQuestion?.question_formatted || '').slice(0, 30)}...
									</a>
								{/if}
								<a
									href="/users/{comment?.profiles?.external_id}"
									class="flex items-center text-primary-700 transition-colors hover:text-primary-800"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="mr-1 h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
										/>
									</svg>
									{comment?.profiles?.email || 'Anonymous'}
								</a>
							</div>
							<div class="flex items-center text-neutral-500">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="mr-1 h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								{convertDateToReadable(comment.created_at)}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Blog Comments Section -->
	{#if !isEmptyData(data.blogComments)}
		<div class="section-card">
			<h2 class="section-title flex items-center">
				<span class="mr-2 inline-block h-4 w-4 rounded-full bg-success-500"></span>
				Blog Comments
			</h2>
			<div class="max-h-96 space-y-4 overflow-y-auto">
				{#each data.blogComments as blogComment}
					<div
						class="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
					>
						<p class="mb-3 text-neutral-800">
							{blogComment?.comment || 'No comment text'}
						</p>
						<div class="flex flex-wrap items-center justify-between gap-2 text-sm">
							<a
								href="/{blogComment.blog_type}/{blogComment?.blog_link}"
								class="flex items-center text-primary-700 transition-colors hover:text-primary-800"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="mr-1 h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
									/>
								</svg>
								{blogComment?.blog_link.replace(/-/g, ' ')}
							</a>
							<div class="flex items-center text-neutral-500">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="mr-1 h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								{convertDateToReadable(blogComment.created_at)}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Confirmation Modal -->
	<Modal id="confirmation-modal">
		<div class="p-6">
			<h3 class="mb-4 text-lg font-semibold text-neutral-900">
				{actionType === 'remove' ? 'Remove Comment' : 'Approve Comment'}
			</h3>
			<p class="mb-6 text-neutral-700">
				{#if actionType === 'remove'}
					Are you sure you want to remove this comment? This action cannot be undone.
				{:else if actionType === 'unflag'}
					Are you sure you want to approve this comment and remove the flag?
				{:else}
					Confirm this action?
				{/if}
			</p>
			<div class="flex justify-end space-x-3">
				<button
					class="rounded-md bg-neutral-200 px-4 py-2 text-neutral-800 transition-colors hover:bg-neutral-300"
					on:click={cancelAction}
				>
					Cancel
				</button>
				<button
					class="px-4 py-2 {actionType === 'remove'
						? 'hover:bg-error-600 bg-error-500'
						: 'hover:bg-success-600 bg-success-500'} flex items-center rounded-md text-white transition-colors"
					on:click={executeAction}
				>
					{#if actionType === 'remove'}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mr-1 h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							/>
						</svg>
						Remove
					{:else if actionType === 'unflag'}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mr-1 h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							/>
						</svg>
						Approve
					{:else}
						Confirm
					{/if}
				</button>
			</div>
		</div>
	</Modal>
</div>

<style>
	.admin-comments {
		max-width: 100%;
		margin: 0 auto;
	}

	.section-card {
		background-color: var(--card-background);
		border: 1px solid var(--border-color);
		border-radius: var(--border-radius);
		padding: 1.5rem;
		margin-bottom: 1.5rem;
		box-shadow: var(--shadow-sm);
	}

	.section-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 1rem;
	}

	.max-h-96 {
		max-height: 24rem;
	}

	.overflow-y-auto {
		overflow-y: auto;
		padding-right: 0.5rem;
	}

	/* Comment cards */
	.rounded-lg {
		border-radius: var(--border-radius);
	}

	.border {
		border: 1px solid var(--border-color);
	}

	.shadow-sm {
		box-shadow: var(--shadow-sm);
	}

	.hover\:shadow-md:hover {
		box-shadow: var(--shadow-md);
	}

	/* Colors */
	.bg-warning-50 {
		background-color: var(--warning-light);
	}

	.border-warning-500 {
		border-color: var(--warning);
	}

	.bg-error-50 {
		background-color: var(--error-light);
	}

	.text-error-700 {
		color: var(--error);
	}

	.bg-neutral-50 {
		background-color: var(--hover-background);
	}

	.bg-neutral-100 {
		background-color: var(--hover-background);
	}

	/* Buttons */
	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	/* Status indicators */
	.h-4.w-4 {
		height: 1rem;
		width: 1rem;
	}

	.rounded-full {
		border-radius: 9999px;
	}

	.bg-warning-500 {
		background-color: var(--warning);
	}

	.bg-info-500 {
		background-color: var(--info);
	}

	.bg-success-500 {
		background-color: var(--success);
	}

	/* Links */
	.text-primary-700 {
		color: var(--primary);
	}

	.hover\:text-primary-800:hover {
		color: var(--primary-dark);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.section-card {
			padding: 1rem;
		}

		.overflow-y-auto {
			padding-right: 0;
		}
	}
</style>
