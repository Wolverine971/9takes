<!-- src/lib/components/blog/BlogComment.svelte -->
<script lang="ts">
	import BlogComments from '$lib/components/blog/BlogComments.svelte';
	import DownIcon from '$lib/components/icons/downIcon.svelte';
	import { notifications } from '$lib/components/molecules/notifications';
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';

	let {
		comment,
		slug,
		user,
		userHasAnswered
	}: {
		comment: any;
		slug: string;
		user: any;
		userHasAnswered: any;
	} = $props();

	let extraComments = $state<any[]>([]);
	let loading = $state(false);
	let innerWidth = $state(0);

	let allComments = $derived([...(comment?.comments || []), ...extraComments]);

	let lastDate = $derived(
		allComments.length ? allComments[allComments.length - 1]?.created_at || null : null
	);

	const loadMore = async () => {
		if (!user?.id) {
			notifications.info('Must register or login to see nested comments', 3000);
			return;
		}
		loading = true;
		try {
			const response = await fetch(
				`/comments?type=comment&parentId=${comment.id}&lastDate=${lastDate}`
			);
			const newcommentData = await response.json();
			extraComments = [...extraComments, ...newcommentData];
		} catch (error) {
			console.error('Error loading comments:', error);
		} finally {
			loading = false;
		}
	};
</script>

<svelte:window bind:innerWidth />

<section class="comment-card">
	<div class="user-comment" itemscope itemtype="https://schema.org/Comment">
		<div class="comment-content">
			<div class="comment-header">
				{#if innerWidth > 500}
					<div class="comment-meta">
						<time itemprop="dateCreated" datetime={comment.created_at}>
							{new Date(comment.created_at).toLocaleDateString('en-US')}
						</time>
					</div>
				{/if}
				<p class="comment-box">
					<span class="profile-avatar" class:active={comment?.profiles?.external_id}>
						{#if comment?.profiles?.enneagram && comment?.profiles?.external_id}
							<a href={`/users/${comment.profiles.external_id}`}>
								{comment?.profiles?.enneagram || 'Rando'}
							</a>
						{:else}
							Rando
						{/if}
					</span>
					<span class="comment-text" itemprop="text">{comment.comment}</span>
				</p>
				{#if innerWidth < 500}
					<hr class="comment-divider" />
					<div class="comment-meta">
						<time itemprop="dateCreated" datetime={comment.created_at}>
							{new Date(comment.created_at).toLocaleDateString('en-US')}
						</time>
					</div>
				{/if}
			</div>
		</div>
	</div>

	{#if allComments.length}
		<div class="nested-comments">
			<BlogComments {slug} comments={allComments} {user} parentType={'comment'} {userHasAnswered} />
		</div>
	{/if}
	{#if comment.comment_count && !allComments.length}
		<button type="button" class="load-more-btn" onclick={loadMore}>
			{comment.comment_count}
			{#if loading}
				<div class="loader"></div>
			{:else}
				<MasterCommentIcon className="icon" type={'multiple'} />
				<DownIcon className="icon" />
			{/if}
		</button>
	{/if}
</section>

<style lang="scss">
	.comment-card {
		background-color: var(--void-surface);
		border: 1px solid rgba(100, 116, 139, 0.2);
		border-radius: 12px;
		padding: 0.5rem;

		@media (max-width: 576px) {
			padding: 0.25rem;
		}
	}

	.user-comment {
		display: flex;
		flex-direction: column;
	}

	.comment-content {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.comment-header {
		display: flex;
		flex-direction: column;
	}

	.comment-meta {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.8rem;
		color: var(--text-secondary);
		padding: 0.25rem 1rem;
	}

	.comment-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem 1rem;
		margin: 0;

		@media (max-width: 768px) {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.75rem;
		}
	}

	.profile-avatar {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 90px;
		height: 36px;
		background: linear-gradient(145deg, var(--shadow-monarch), var(--shadow-monarch-dark));
		color: #ffffff;
		font-weight: 600;
		font-size: 0.875rem;
		text-align: center;
		border-radius: 8px;
		transition: all 0.2s ease;
		flex-shrink: 0;

		&.active {
			cursor: pointer;

			&:hover {
				transform: translateY(-2px);
				box-shadow: 0 0 15px rgba(124, 58, 237, 0.4);
			}
		}

		a {
			color: #ffffff;
			text-decoration: none;
		}

		@media (max-width: 576px) {
			min-width: 70px;
			height: 32px;
			font-size: 0.8rem;
		}
	}

	.comment-text {
		display: block;
		line-height: 1.5;
		color: var(--text-primary);
		white-space: pre-line;
	}

	.comment-divider {
		width: 80%;
		margin: 0.5rem auto;
		border: none;
		border-top: 1px solid rgba(100, 116, 139, 0.2);
	}

	.nested-comments {
		margin-left: 1.5rem;
		padding-left: 1rem;
		padding-bottom: 0.5rem;
		border-left: 2px solid rgba(124, 58, 237, 0.3);

		@media (max-width: 576px) {
			margin-left: 0.75rem;
			padding-left: 0.5rem;
		}
	}

	.load-more-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.75rem;
		background: var(--void-elevated);
		border: none;
		border-top: 1px solid rgba(100, 116, 139, 0.2);
		color: var(--neutral-700);
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s ease;
		border-radius: 0 0 12px 12px;

		&:hover {
			background: rgba(124, 58, 237, 0.15);
			color: var(--text-primary);
		}

		:global(.icon) {
			width: 1.25rem;
			height: 1.25rem;
			fill: var(--text-secondary);
		}
	}

	.loader {
		width: 1.25rem;
		height: 1.25rem;
		border: 3px solid rgba(124, 58, 237, 0.3);
		border-radius: 50%;
		border-top: 3px solid var(--shadow-monarch);
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
