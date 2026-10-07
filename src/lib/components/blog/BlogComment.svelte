<!-- src/lib/components/blog/BlogComment.svelte -->
<script lang="ts">
	// blog_comments rows are flat: the table has no parent column and no reply
	// count, so a blog comment has no replies to load. (This used to call
	// /comments?type=comment with the blog comment id, which returned replies
	// to whichever unrelated question take happened to share that id.)
	let {
		comment
	}: {
		comment: any;
		slug?: string;
		user?: any;
		userHasAnswered?: any;
	} = $props();

	let innerWidth = $state(0);
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
</section>

<style lang="scss">
	.comment-card {
		background-color: var(--stone-warm);
		border: 1px solid color-mix(in srgb, var(--ink-dim) 20%, transparent);
		border-radius: 1rem;
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
		color: var(--ink-mid);
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
		background: linear-gradient(145deg, var(--lamp-glow), var(--lamp-glow));
		color: #ffffff;
		font-weight: 600;
		font-size: 0.875rem;
		text-align: center;
		border-radius: 0.625rem;
		transition: all 0.2s ease;
		flex-shrink: 0;

		&.active {
			cursor: pointer;

			&:hover {
				transform: translateY(-2px);
				box-shadow: var(--glow-sm);
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
		color: var(--ink-bright);
		white-space: pre-line;
	}

	.comment-divider {
		width: 80%;
		margin: 0.5rem auto;
		border: none;
		border-top: 1px solid color-mix(in srgb, var(--ink-dim) 20%, transparent);
	}
</style>
