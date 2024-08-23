<script lang="ts">
	import Card from '$lib/components/atoms/card.svelte';
	import BlogComments from '$lib/components/blog/BlogComments.svelte';
	import DownIcon from '$lib/components/icons/downIcon.svelte';
	import { notifications } from '$lib/components/molecules/notifications';
	import MasterCommentIcon from '$lib/components/icons/masterCommentIcon.svelte';

	export let comment: any;
	export let slug: string;
	export let session: any;
	export let userHasAnswered: any;

	let _commentComment = comment?.id ? { ...comment } : null;
	let loading = false;
	let innerWidth = 0;

	$: lastDate = _commentComment?.comments?.length
		? _commentComment.comments[_commentComment.comments.length - 1]?.created_at || null
		: null;

	$: if (comment) {
		_commentComment = { ...comment };
	}

	const loadMore = async () => {
		if (!session?.user?.id) {
			notifications.info('Must register or login to see nested comments', 3000);
			return;
		}
		loading = true;
		try {
			const response = await fetch(
				`/comments?type=comment&parentId=${comment.id}&lastDate=${lastDate}`
			);
			const newcommentData = await response.json();
			if (!_commentComment.comments) {
				_commentComment.comments = [];
			}
			_commentComment.comments = [..._commentComment.comments, ...newcommentData];
		} catch (error) {
			console.error('Error loading comments:', error);
		} finally {
			loading = false;
		}
	};
</script>

<svelte:window bind:innerWidth />

<Card class="comment-card">
	<div class="user-comment" itemscope itemtype="https://schema.org/Comment">
		<div class="comment-content">
			<div class="comment-header">
				{#if innerWidth > 500}
					<div class="comment-meta">
						<time itemprop="dateCreated" datetime={_commentComment.created_at}>
							{new Date(_commentComment.created_at).toLocaleDateString('en-US')}
						</time>
					</div>
				{/if}
				<p class="comment-box">
					<span class="profile-avatar" class:active={_commentComment?.profiles?.external_id}>
						{#if _commentComment?.profiles?.enneagram && _commentComment?.profiles?.external_id}
							<a href={`/users/${_commentComment.profiles.external_id}`}>
								{_commentComment?.profiles?.enneagram || 'Rando'}
							</a>
						{:else}
							Rando
						{/if}
					</span>
					<span class="comment-text" itemprop="text">{_commentComment.comment}</span>
				</p>
				{#if innerWidth < 500}
					<hr class="comment-divider" />
					<div class="comment-meta">
						<time itemprop="dateCreated" datetime={_commentComment.created_at}>
							{new Date(_commentComment.created_at).toLocaleDateString('en-US')}
						</time>
					</div>
				{/if}
			</div>
		</div>
	</div>

	{#if _commentComment?.comments?.length}
		<div class="nested-comments">
			<BlogComments
				{slug}
				comments={_commentComment.comments}
				{session}
				parentType={'comment'}
				{userHasAnswered}
			/>
		</div>
	{/if}
	{#if _commentComment.comment_count && !_commentComment?.comments?.length}
		<button type="button" class="load-more-btn" on:click={loadMore}>
			{_commentComment.comment_count}
			{#if loading}
				<div class="loader" />
			{:else}
				<MasterCommentIcon class="icon" type={'multiple'} />
				<DownIcon class="icon" />
			{/if}
		</button>
	{/if}
</Card>

<style lang="scss">
	@import '../molecules/comment.scss';

	.comment-card {
		margin: var(--comment-margin);
		padding: var(--comment-padding);
	}

	.comment-divider {
		width: 80%;
		margin: var(--comment-margin) auto;
		border: none;
		border-top: 1px solid var(--color-border);
	}

	.nested-comments {
		margin-left: calc(var(--comment-padding) * 2);
		margin-top: var(--comment-margin);
	}

	.load-more-btn {
		margin-top: var(--comment-margin);
	}

	.icon {
		width: var(--icon-size);
		height: var(--icon-size);
		fill: var(--color-icon);
	}

	@media (max-width: 500px) {
		.comment-content {
			flex-direction: column;
		}

		.comment-meta {
			margin-top: var(--comment-margin);
		}
	}
</style>
