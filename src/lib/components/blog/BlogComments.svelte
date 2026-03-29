<!-- src/lib/components/blog/BlogComments.svelte -->
<script lang="ts">
	import { browser } from '$app/environment';
	import BlogComment from '$lib/components/blog/BlogComment.svelte';

	let {
		slug,
		comments,
		parentType,
		userHasAnswered,
		user
	}: {
		slug: string;
		comments: any[];
		parentType: string;
		userHasAnswered: boolean;
		user: any;
	} = $props();

	let commentCount = $derived(comments?.length ?? 0);
</script>

<div class="blog-comments">
	{#if commentCount > 0 && !userHasAnswered}
		<p class="comment-info">Must answer question first</p>
	{:else if !browser || (comments?.length && userHasAnswered) || (comments?.length && parentType === 'comment')}
		{#if comments?.length}
			<div class="comment-list">
				{#each comments as comment (comment.id)}
					<BlogComment {comment} {slug} {user} {userHasAnswered} />
				{/each}
			</div>
		{:else}
			<p class="comment-info">No comments yet</p>
		{/if}
	{/if}
</div>

<style lang="scss">
	.blog-comments {
		margin-top: 0.5rem;
	}

	.comment-info {
		padding: 0.75rem 1rem;
		color: var(--text-secondary);
		font-style: italic;
		font-size: 0.9rem;
	}

	.comment-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
</style>
